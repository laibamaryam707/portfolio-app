"use client";

import { useEffect, useState } from "react";
import { RefreshCw, ExternalLink, Monitor, Smartphone } from "lucide-react";


export default function PreviewPage() {
  const [username, setUsername] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setUsername(d.user?.username || ""));
  }, []);

  const src = username ? `/portfolio/${username}?t=${refreshKey}` : "";

  return (
    <><div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                  <h1 className="text-2xl font-bold text-white">Live Preview</h1>
                  <p className="text-white/70 text-sm mt-1">
                      Your portfolio exactly as visitors see it. Hit refresh after editing.
                  </p>
              </div>
              <div className="flex items-center gap-2">
                  <div className="flex rounded-xl border border-white/10 overflow-hidden">
                      <button
                          onClick={() => setDevice("desktop")}
                          className={`px-3 py-2 text-sm flex items-center gap-1.5 transition ${device === "desktop" ? "bg-sky-500 text-white" : "text-white/70 hover:bg-white/5"}`}
                      >
                          <Monitor size={15} /> Desktop
                      </button>
                      <button
                          onClick={() => setDevice("mobile")}
                          className={`px-3 py-2 text-sm flex items-center gap-1.5 transition ${device === "mobile" ? "bg-sky-500 text-white" : "text-white/70 hover:bg-white/5"}`}
                      >
                          <Smartphone size={15} /> Mobile
                      </button>
                  </div>
                  <button
                      onClick={() => setRefreshKey((k) => k + 1)}
                      className="px-3 py-2 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition flex items-center gap-1.5"
                  >
                      <RefreshCw size={15} /> Refresh
                  </button>
                  {username && (
                      <a
                          href={`/portfolio/${username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 rounded-xl bg-sky-500 text-white text-sm hover:bg-sky-400 transition flex items-center gap-1.5"
                      >
                          <ExternalLink size={15} /> Open
                      </a>
                  )}
              </div>
          </div><div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex justify-center">
              {src ? (
                  <div
                      className={`bg-white rounded-xl overflow-hidden transition-all duration-300 ${device === "mobile" ? "w-[390px]" : "w-full"}`}
                      style={{ height: "72vh" }}
                  >
                      <iframe key={refreshKey} src={src} className="w-full h-full border-0" title="Portfolio preview" />
                  </div>
              ) : (
                  <p className="text-white/70 py-20">Loading preview…</p>
              )}
          </div>
        </div></>
  );
}