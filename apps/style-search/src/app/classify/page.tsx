"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

type InputMode = "url" | "upload";

export default function ClassifyPage() {
  const router = useRouter();
  const [mode, setMode] = useState<InputMode>("url");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      let response: Response;

      if (mode === "url") {
        response = await fetch("/api/classify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
      } else {
        if (!file) { setStatus("error"); setErrorMsg("Please select an image."); return; }
        const form = new FormData();
        form.append("image", file);
        response = await fetch("/api/classify", { method: "POST", body: form });
      }

      if (!response.ok) {
        const data = await response.json() as { error?: string };
        throw new Error(data.error ?? "Something went wrong");
      }

      const data = await response.json() as { id: string };
      router.push(`/classify/${data.id}`);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong — please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Classify a Home</h1>
        <p className="mt-2 text-slate-600">
          Paste any listing URL or upload a photo. Get the architectural style, design quality score,
          and a lesson on what makes this home look the way it does.
        </p>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <div className="mb-5 flex gap-1 rounded-lg bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${mode === "url" ? "bg-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            Paste URL
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${mode === "upload" ? "bg-white shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          >
            Upload photo
          </button>
        </div>

        <form onSubmit={onSubmit} className="grid gap-4">
          {mode === "url" ? (
            <div>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.redfin.com/... or paste a direct image URL"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm focus:border-slate-500 focus:outline-none"
                required
              />
              <p className="mt-1.5 text-xs text-slate-500">Works with Redfin, Compass, any listing site, or a direct .jpg/.png URL</p>
            </div>
          ) : (
            <div>
              <div
                onClick={() => fileRef.current?.click()}
                className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-10 hover:border-slate-400 hover:bg-slate-100 transition-colors"
              >
                <p className="text-sm font-medium text-slate-700">{file ? file.name : "Click to choose a photo"}</p>
                <p className="mt-1 text-xs text-slate-500">JPG, PNG, or WebP · max 5MB</p>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
          )}

          {errorMsg ? (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{errorMsg}</p>
          ) : null}

          <button
            type="submit"
            disabled={status === "loading"}
            className="rounded-lg bg-slate-900 px-6 py-3 font-medium text-white disabled:opacity-60 hover:bg-slate-700 transition-colors"
          >
            {status === "loading" ? "Analyzing architecture…" : "Classify →"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-slate-400">
        Powered by Claude Vision · Results are educational, not appraisals
      </p>
    </div>
  );
}
