"use client";

import { useState } from "react";

export default function FeedbackButton({ listingId, predictedStyle }: { listingId: string; predictedStyle: string }) {
  const [status, setStatus] = useState("");

  async function submitFeedback() {
    const response = await fetch("/api/style-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId, predictedStyle, feedback: "not_this_style" }),
    });

    setStatus(response.ok ? "Feedback submitted" : "Feedback failed");
  }

  return (
    <div className="grid gap-2">
      <button className="w-fit rounded border border-slate-400 px-3 py-2 text-sm" onClick={submitFeedback}>
        Not this style
      </button>
      {status ? <p className="text-sm text-slate-700">{status}</p> : null}
    </div>
  );
}
