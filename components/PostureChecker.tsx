"use client";

import { useState, useCallback, useRef } from "react";
import PoseCamera from "@/components/PoseCamera";
import { Landmark, calcAngle, POSE } from "@/lib/pose-utils";

interface PostureResult {
  overall: "good" | "warn" | "bad";
  shoulderHipKnee: number;
  hipKneeAnkle: number;
  shoulderLevel: number;
  messages: string[];
}

const GOOD_THRESHOLD = 170;
const WARN_THRESHOLD = 160;
const SHOULDER_LEVEL_THRESHOLD = 0.03;

function analyzePosture(lm: Landmark[]): PostureResult | null {
  const ls = lm[POSE.LEFT_SHOULDER];
  const rs = lm[POSE.RIGHT_SHOULDER];
  const lh = lm[POSE.LEFT_HIP];
  const rh = lm[POSE.RIGHT_HIP];
  const lk = lm[POSE.LEFT_KNEE];
  const rk = lm[POSE.RIGHT_KNEE];
  const la = lm[POSE.LEFT_ANKLE];
  const ra = lm[POSE.RIGHT_ANKLE];

  const minVis = 0.5;
  const points = [ls, rs, lh, rh, lk, rk, la, ra];
  if (points.some((p) => (p.visibility ?? 0) < minVis)) return null;

  // 左右平均で計算
  const shoulder = { x: (ls.x + rs.x) / 2, y: (ls.y + rs.y) / 2, z: 0 };
  const hip = { x: (lh.x + rh.x) / 2, y: (lh.y + rh.y) / 2, z: 0 };
  const knee = { x: (lk.x + rk.x) / 2, y: (lk.y + rk.y) / 2, z: 0 };
  const ankle = { x: (la.x + ra.x) / 2, y: (la.y + ra.y) / 2, z: 0 };

  const shoulderHipKnee = calcAngle(shoulder, hip, knee);
  const hipKneeAnkle = calcAngle(hip, knee, ankle);
  const shoulderLevel = Math.abs(ls.y - rs.y);

  const messages: string[] = [];
  let worst: "good" | "warn" | "bad" = "good";

  if (shoulderHipKnee < WARN_THRESHOLD) {
    messages.push("上体が傾いています");
    worst = "bad";
  } else if (shoulderHipKnee < GOOD_THRESHOLD) {
    messages.push("上体がやや傾いています");
    if (worst === "good") worst = "warn";
  }

  if (hipKneeAnkle < WARN_THRESHOLD) {
    messages.push("膝が曲がっています");
    worst = "bad";
  } else if (hipKneeAnkle < GOOD_THRESHOLD) {
    messages.push("膝がやや曲がっています");
    if (worst === "good") worst = "warn";
  }

  if (shoulderLevel > SHOULDER_LEVEL_THRESHOLD) {
    messages.push("肩が傾いています");
    if (worst === "good") worst = "warn";
  }

  if (messages.length === 0) {
    messages.push("姿勢は良好です");
  }

  return { overall: worst, shoulderHipKnee, hipKneeAnkle, shoulderLevel, messages };
}

const STATUS_CONFIG = {
  good: { color: "var(--accent)", label: "GOOD", skeletonColor: "#CCFF00" },
  warn: { color: "#FFAA00", label: "CHECK", skeletonColor: "#FFAA00" },
  bad: { color: "#FF4444", label: "FIX", skeletonColor: "#FF4444" },
} as const;

export default function PostureChecker() {
  const [result, setResult] = useState<PostureResult | null>(null);
  const lastUpdate = useRef(0);

  const handleResults = useCallback((landmarks: Landmark[]) => {
    const now = Date.now();
    if (now - lastUpdate.current < 200) return;
    lastUpdate.current = now;
    setResult(analyzePosture(landmarks));
  }, []);

  const status = result ? STATUS_CONFIG[result.overall] : null;

  return (
    <div className="flex-1 flex flex-col relative">
      <PoseCamera
        onResults={handleResults}
        skeletonColor={status?.skeletonColor ?? "#00FF00"}
      />

      {/* Overlay: status badge */}
      {status && (
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <div
            className="px-3 py-1 font-display text-lg tracking-widest rounded-sm"
            style={{
              backgroundColor: status.color,
              color: "#000",
            }}
          >
            {status.label}
          </div>
        </div>
      )}

      {/* Overlay: angle info */}
      {result && (
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm rounded-sm px-3 py-2 text-xs space-y-1">
          <div className="flex justify-between gap-4">
            <span className="text-[var(--text-muted)]">上体</span>
            <span style={{ color: result.shoulderHipKnee >= GOOD_THRESHOLD ? "var(--accent)" : result.shoulderHipKnee >= WARN_THRESHOLD ? "#FFAA00" : "#FF4444" }}>
              {result.shoulderHipKnee.toFixed(0)}°
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[var(--text-muted)]">膝</span>
            <span style={{ color: result.hipKneeAnkle >= GOOD_THRESHOLD ? "var(--accent)" : result.hipKneeAnkle >= WARN_THRESHOLD ? "#FFAA00" : "#FF4444" }}>
              {result.hipKneeAnkle.toFixed(0)}°
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[var(--text-muted)]">肩の傾き</span>
            <span style={{ color: result.shoulderLevel <= SHOULDER_LEVEL_THRESHOLD ? "var(--accent)" : "#FFAA00" }}>
              {result.shoulderLevel < 0.01 ? "OK" : (result.shoulderLevel * 100).toFixed(1)}
            </span>
          </div>
        </div>
      )}

      {/* Overlay: messages */}
      {result && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-black/70 backdrop-blur-sm rounded-sm px-4 py-3 text-center">
            {result.messages.map((msg, i) => (
              <p key={i} className="text-sm" style={{ color: status?.color }}>
                {msg}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
