"use client";

import { useState } from "react";
import Image from "next/image";
import { Link2, Check, QrCode } from "lucide-react";
import toast from "react-hot-toast";

export default function SharePortfolio({ username }: { username: string }) {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const url = typeof window !== "undefined" ? `${window.location.origin}/portfolio/${username}` : "";
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(url)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy");
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-sm font-semibold text-white/70 mb-3">Share your portfolio</h2>
      <div className="flex flex-wrap items-center gap-2">
        <code className="flex-1 min-w-0 truncate text-sm text-white bg-white/5 border border-white/10 rounded-lg px-3 py-2">{url}</code>
        <button onClick={copy} className="px-3 py-2 rounded-lg bg-sky-500 text-white text-sm hover:bg-sky-400 transition flex items-center gap-1.5">
          {copied ? <Check size={15} /> : <Link2 size={15} />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={() => setShowQr((v) => !v)} className="px-3 py-2 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition flex items-center gap-1.5">
          <QrCode size={15} /> QR
        </button>
      </div>
      {showQr && (
        <div className="mt-4 flex justify-center">
          <Image src={qrSrc} alt="Portfolio QR code" className="rounded-xl bg-white p-2" width={180} height={180} unoptimized />
        </div>
      )}
    </div>
  );
}