"use client";

import { usePageView, track } from "@/lib/client";

export default function PricingPage() {
  usePageView("pricing");

  async function startTrial(plan: string) {
    await track("pricing_viewed", { plan });
    await track("trial_started", { plan });
    alert(`Trial started: ${plan}`);
  }

  async function requestContact(plan: string) {
    await track("contact_requested", { plan, intent: "talk_to_sales" });
    alert(`Contact requested: ${plan}`);
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Pricing Experiment</h1>
      <div className="grid gap-3 md:grid-cols-3">
        {["Starter $29", "Pro $79", "Team $199"].map((plan) => (
          <article key={plan} className="rounded border border-slate-300 bg-white p-4">
            <h2 className="font-semibold">{plan}</h2>
            <p className="mb-3 mt-1 text-sm text-slate-600">Style filter, confidence score, and save-alert workflow.</p>
            <div className="flex gap-2">
              <button onClick={() => startTrial(plan)} className="rounded bg-slate-900 px-3 py-2 text-xs text-white">Start trial</button>
              <button onClick={() => requestContact(plan)} className="rounded border border-slate-400 px-3 py-2 text-xs">Talk to sales</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
