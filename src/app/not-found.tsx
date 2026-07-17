import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-6"
      style={{ backgroundColor: "#0a192b" }}
    >
      <p className="text-8xl font-bold text-white/10 mb-4">404</p>
      <h2 className="text-2xl font-bold text-white mb-2">Page not found</h2>
      <p className="text-white/60 text-sm mb-8">
        This page doesn&apos;t exist or was moved.
      </p>
      <Link
        href="/dashboard"
        className="px-5 py-2.5 rounded-xl bg-sky-500 text-white text-sm font-medium hover:bg-sky-400 transition"
      >
        Back to dashboard
      </Link>
    </div>
  );
}