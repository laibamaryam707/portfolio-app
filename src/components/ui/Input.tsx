import { InputHTMLAttributes, TextareaHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export function Input({ label, className = "", ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
      <input
        className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition ${className}`}
        {...props}
      />
    </div>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export function Textarea({ label, className = "", ...props }: TextareaProps) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
      <textarea
        className={`w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition resize-none ${className}`}
        {...props}
      />
    </div>
  );
}

export function Select({
  label,
  children,
  className = "",
  ...props
}: InputHTMLAttributes<HTMLSelectElement> & { label?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-medium text-slate-300">{label}</label>}
      <select
        className={`w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-2.5 text-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}
