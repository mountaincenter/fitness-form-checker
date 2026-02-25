import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-6 py-12 stripe-bg">
      {/* Hero */}
      <div className="animate-in text-center mb-4">
        <p className="text-[var(--accent)] text-xs font-semibold tracking-[0.3em] uppercase mb-3">
          AI-Powered
        </p>
        <h1 className="font-display text-7xl sm:text-8xl tracking-wide leading-none">
          FORM
          <br />
          <span className="text-[var(--accent)]">CHECK</span>
        </h1>
      </div>

      <p className="animate-in delay-1 text-[var(--text-secondary)] text-sm text-center max-w-xs leading-relaxed mb-12">
        カメラでリアルタイムにフォームを判定。
        <br />
        正しい動きを、正しく数える。
      </p>

      {/* Cards */}
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <Link
          href="/squat"
          className="animate-in delay-2 group card-cut block p-6 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-3xl tracking-wide group-hover:text-[var(--accent)] transition-colors">
                SQUAT
              </p>
              <p className="text-[var(--text-muted)] text-xs mt-1 tracking-wide uppercase">
                Rep Counter
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border border-[var(--border)] group-hover:border-[var(--accent)] group-hover:glow-accent flex items-center justify-center transition-all duration-300">
              <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>

        <Link
          href="/plank"
          className="animate-in delay-3 group card-cut block p-6 bg-[var(--bg-surface)] border border-[var(--border)] hover:border-[var(--accent)] transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-3xl tracking-wide group-hover:text-[var(--accent)] transition-colors">
                PLANK
              </p>
              <p className="text-[var(--text-muted)] text-xs mt-1 tracking-wide uppercase">
                Hold Timer
              </p>
            </div>
            <div className="w-12 h-12 rounded-full border border-[var(--border)] group-hover:border-[var(--accent)] group-hover:glow-accent flex items-center justify-center transition-all duration-300">
              <svg className="w-5 h-5 text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      </div>

      {/* Footer tag */}
      <p className="animate-in delay-4 text-[var(--text-muted)] text-[10px] tracking-[0.2em] uppercase mt-16">
        MediaPipe Pose &middot; Browser Only &middot; No Data Sent
      </p>
    </main>
  );
}
