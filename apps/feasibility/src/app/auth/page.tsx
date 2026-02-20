"use client";

import { FormEvent, useState } from "react";
import { usePageView } from "@/lib/client";

export default function AuthPage() {
  usePageView("auth");
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, app_id: "A" }),
    });

    setStatus(res.ok ? "Signed in (mock magic link)" : "Sign-in failed");
  }

  return (
    <div className="grid max-w-lg gap-3">
      <h1 className="text-2xl font-bold">Mock Auth</h1>
      <p className="text-sm text-slate-700">Email magic-link behavior is mocked to local session cookie for fast validation.</p>
      <form onSubmit={onSubmit} className="grid gap-2 rounded border border-slate-300 bg-white p-4">
        <input name="email" type="email" required placeholder="you@company.com" className="rounded border border-slate-300 px-3 py-2" />
        <button className="rounded bg-slate-900 px-3 py-2 text-white">Send magic link</button>
      </form>
      {status ? <p className="text-sm">{status}</p> : null}
    </div>
  );
}
