"use client";

import { useRef } from "react";
import { Upload, X, Link as LinkIcon } from "lucide-react";
import { compressImage } from "@/lib/image-utils";
import toast from "react-hot-toast";

interface ImagePickerProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  aspect?: "square" | "wide";
}

export default function ImagePicker({ label, value, onChange, aspect = "square" }: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      toast.error("Image must be under 8MB");
      return;
    }
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
      toast.success("Image uploaded");
    } catch {
      toast.error("Failed to process image");
    }
    e.target.value = "";
  };

  const previewClass = aspect === "wide" ? "aspect-video w-full" : "w-28 h-28";

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label}</label>

      {value ? (
        <div className="relative inline-block">
          <img src={value} alt="" className={`${previewClass} rounded-xl object-cover border border-white/10`} />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute -top-2 -right-2 p-1 rounded-full bg-red-600 text-white hover:bg-red-500"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`${previewClass} flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/20 bg-white/5 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition cursor-pointer`}
        >
          <Upload size={22} className="text-slate-400" />
          <span className="text-xs text-slate-400">Choose from computer</span>
        </button>
      )}

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <div className="flex items-center gap-2 pt-1">
        <LinkIcon size={14} className="text-slate-500 shrink-0" />
        <input
          type="url"
          value={value.startsWith("data:") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Or paste image URL..."
          className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
        />
      </div>
    </div>
  );
}
