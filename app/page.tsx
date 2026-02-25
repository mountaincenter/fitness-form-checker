import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-12 px-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Fitness Form Checker
        </h1>
        <p className="mt-3 text-gray-400">
          カメラでフォームをリアルタイム判定
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <Link
          href="/squat"
          className="flex-1 flex flex-col items-center gap-3 p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-blue-500 hover:bg-gray-800 transition-all"
        >
          <span className="text-5xl">🏋️</span>
          <span className="text-xl font-semibold">スクワット</span>
          <span className="text-sm text-gray-400">回数カウント</span>
        </Link>

        <Link
          href="/plank"
          className="flex-1 flex flex-col items-center gap-3 p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:border-emerald-500 hover:bg-gray-800 transition-all"
        >
          <span className="text-5xl">🧘</span>
          <span className="text-xl font-semibold">プランク</span>
          <span className="text-sm text-gray-400">タイマー</span>
        </Link>
      </div>
    </main>
  );
}
