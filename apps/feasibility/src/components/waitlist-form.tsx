"use client";

import { FormEvent, useState } from "react";

type Props = { appId: "A" | "B" };

export function WaitlistForm({ appId }: Props) {
  const [status, setStatus] = useState<string>("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      app_id: appId,
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      role: String(formData.get("role") || "other"),
      useCase: String(formData.get("useCase") || ""),
    };

    const response = await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setStatus("Joined waitlist");
      event.currentTarget.reset();
      return;
    }

    setStatus("Could not submit");
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-2 rounded-lg border border-slate-200 bg-white p-4">
      <input name="name" placeholder="Name" required className="rounded border border-slate-300 px-3 py-2" />
      <input name="email" placeholder="Email" type="email" required className="rounded border border-slate-300 px-3 py-2" />
      <input name="role" placeholder="Role (developer, investor-agent)" required className="rounded border border-slate-300 px-3 py-2" />
      <input name="useCase" placeholder="Use case" required className="rounded border border-slate-300 px-3 py-2" />
      <button className="rounded bg-slate-900 px-3 py-2 text-white" type="submit">Join waitlist</button>
      {status ? <p className="text-sm text-slate-700">{status}</p> : null}
    </form>
  );
}
