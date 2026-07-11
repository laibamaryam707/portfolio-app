import Link from "next/link";

export default function PortfolioNotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-center">
      <div>
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-slate-400 mb-8">This portfolio doesn&apos;t exist yet.</p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 transition">
          Go Home
        </Link>
      </div>
    </div>
  );
}
