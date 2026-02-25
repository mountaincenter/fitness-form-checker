"use client";

import Link from "next/link";
import PoseCamera from "@/components/PoseCamera";

export default function PlankPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center gap-4 p-3">
      <div className="flex items-center gap-4 w-full">
        <Link href="/" className="text-gray-400 hover:text-white transition-colors">
          ← 戻る
        </Link>
        <h1 className="text-2xl font-bold">🧘 プランク</h1>
      </div>

      <PoseCamera />

      <p className="text-gray-500 text-sm">
        カメラに全身が映るように横向きで構えてください
      </p>
    </main>
  );
}
