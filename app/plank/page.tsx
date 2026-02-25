"use client";

import Link from "next/link";
import PoseCamera from "@/components/PoseCamera";

export default function PlankPage() {
  return (
    <main className="min-h-dvh flex flex-col bg-[var(--bg-primary)]">
      {/* Header bar */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <Link
          href="/"
          className="flex items-center gap-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-xs tracking-wide uppercase">Back</span>
        </Link>
        <h1 className="font-display text-xl tracking-widest text-[var(--accent)]">
          PLANK
        </h1>
        <div className="w-14" />
      </header>

      {/* Camera - fill remaining space */}
      <div className="flex-1 relative">
        <PoseCamera />
      </div>

      {/* Bottom bar */}
      <div className="px-4 py-3 border-t border-[var(--border)] text-center">
        <p className="text-[var(--text-muted)] text-xs tracking-wide">
          横向きで全身がカメラに映るように構えてください
        </p>
      </div>
    </main>
  );
}
