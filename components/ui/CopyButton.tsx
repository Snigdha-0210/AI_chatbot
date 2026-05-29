"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export function CopyButton({
  text,
  label = "Copy",
  className = "",
}: {
  text: string;
  label?: string;
  className?: string;
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-on-surface-variant transition hover:border-primary/30 hover:text-primary ${className}`}
    >
      <span className="material-symbols-outlined text-sm">
        {copied ? "check" : "content_copy"}
      </span>
      {copied ? "Copied" : label}
    </button>
  );
}
