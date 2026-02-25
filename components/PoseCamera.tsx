"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Landmark, SKELETON_CONNECTIONS } from "@/lib/pose-utils";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    Pose: any;
  }
}

interface PoseCameraProps {
  onResults?: (landmarks: Landmark[]) => void;
  skeletonColor?: string;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const s = document.createElement("script");
    s.src = src;
    s.crossOrigin = "anonymous";
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export default function PoseCamera({
  onResults,
  skeletonColor = "#00FF00",
}: PoseCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const onResultsRef = useRef(onResults);
  onResultsRef.current = onResults;
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  const drawSkeleton = useCallback(
    (ctx: CanvasRenderingContext2D, landmarks: Landmark[], w: number, h: number) => {
      ctx.strokeStyle = skeletonColor;
      ctx.lineWidth = 3;
      for (const [i, j] of SKELETON_CONNECTIONS) {
        const a = landmarks[i];
        const b = landmarks[j];
        if ((a.visibility ?? 0) > 0.5 && (b.visibility ?? 0) > 0.5) {
          ctx.beginPath();
          ctx.moveTo(a.x * w, a.y * h);
          ctx.lineTo(b.x * w, b.y * h);
          ctx.stroke();
        }
      }
      ctx.fillStyle = "#FF0000";
      for (const lm of landmarks) {
        if ((lm.visibility ?? 0) > 0.5) {
          ctx.beginPath();
          ctx.arc(lm.x * w, lm.y * h, 5, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    },
    [skeletonColor]
  );

  useEffect(() => {
    let cancelled = false;

    async function init() {
      try {
        await loadScript(
          "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"
        );

        if (cancelled) return;

        const video = videoRef.current!;
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        const pose = new window.Pose({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        pose.onResults((results: any) => {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          if (results.poseLandmarks) {
            drawSkeleton(ctx, results.poseLandmarks, canvas.width, canvas.height);
            onResultsRef.current?.(results.poseLandmarks);
          }
        });

        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        });

        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        video.srcObject = stream;
        await video.play();
        setStatus("ready");

        const processFrame = async () => {
          if (cancelled) return;
          if (video.readyState >= 2) {
            await pose.send({ image: video });
          }
          rafRef.current = requestAnimationFrame(processFrame);
        };
        processFrame();

        return () => {
          pose.close();
          stream.getTracks().forEach((t) => t.stop());
        };
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    let cleanup: (() => void) | undefined;
    init().then((fn) => {
      cleanup = fn;
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      cleanup?.();
    };
  }, [drawSkeleton]);

  return (
    <div className="relative w-full mx-auto">
      <video ref={videoRef} className="hidden" playsInline muted />
      <canvas ref={canvasRef} className="w-full rounded-2xl shadow-lg" />

      {status === "loading" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-2xl">
          <p className="text-gray-400 animate-pulse">モデル読み込み中...</p>
        </div>
      )}
      {status === "error" && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 rounded-2xl">
          <p className="text-red-400">カメラまたはモデルの読み込みに失敗しました</p>
        </div>
      )}
    </div>
  );
}
