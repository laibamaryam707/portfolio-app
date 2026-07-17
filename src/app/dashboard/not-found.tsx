import Link from "next/link";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <p className="text-8xl font-bold text-white/10 mb-4">404</p>
      <h2 className="text-xl font-bold text-white mb-2">Page not found</h2>
      <p className="text-black text-sm mb-6">
        This page does not exist or was moved.
      </p>
      <Link href="/dashboard">
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  );
}