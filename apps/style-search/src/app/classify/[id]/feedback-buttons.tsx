"use client";

import { useState } from "react";

type Props = { resultId: string; predictedStyle: string };

export default function FeedbackButtons({ resultId, predictedStyle }: Props) {
  const [status, setStatus] = useState<"idle" | "correct" | "correcting" | "done">("idle");
  const [correction, setCorrection] = useState("");

  async function submitFeedback(feedback: "correct" | "incorrect", correctedStyle?: string) {
    await fetch("/api/style-feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        listingId: resultId,
        predictedStyle,
        feedback,
        correctedStyle: correctedStyle ?? null,
        session_id: `B-feedback-${resultId}`,
      }),
    });
  }

  if (status === "correct" || status === "done") {
    return (
      <p className="text-sm text-slate-500">
        {status === "correct" ? "Thanks — classification confirmed." : "Thanks for the correction."}
      </p>
    );
  }

  if (status === "correcting") {
    return (
      <div className="flex gap-2">
        <input
          autoFocus
          value={correction}
          onChange={(e) => setCorrection(e.target.value)}
          placeholder="What style is it? (e.g. Cape Cod)"
          className="rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:border-slate-500"
        />
        <button
          onClick={async () => {
            await submitFeedback("incorrect", correction);
            setStatus("done");
          }}
          disabled={!correction.trim()}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          Submit
        </button>
        <button onClick={() => setStatus("idle")} className="text-sm text-slate-500">
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={async () => {
          await submitFeedback("correct");
          setStatus("correct");
        }}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
      >
        Style is correct
      </button>
      <button
        onClick={() => setStatus("correcting")}
        className="rounded-lg border border-slate-300 px-4 py-2 text-sm hover:bg-slate-50 transition-colors"
      >
        Wrong — correct it
      </button>
    </div>
  );
}
