"use client";

import { useState } from "react";

export default function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={copy}
      className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
    >
      {copied ? "Copied!" : "Copy share link"}
    </button>
  );
}
