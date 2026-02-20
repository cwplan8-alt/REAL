"use client";

import { usePageView, track } from "@/lib/client";

export default function PricingPage() {
  usePageView("pricing");

  async function startTrial(plan: string) {
    await track("pricing_viewed", { plan });
    await track("trial_started", { plan });
    alert(`Trial started: ${plan}`);
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Pricing Experiment</h1>
      <p className="text-slate-700">Testing willingness-to-pay and conversion.</p>
      <div className="grid gap-3 md:grid-cols-3">
        {["Starter $49", "Pro $149", "Team $399"].map((plan) => (
          <article key={plan} className="rounded border border-slate-300 bg-white p-4">
            <h2 className="font-semibold">{plan}</h2>
            <p className="mb-3 mt-1 text-sm text-slate-600">Includes preliminary feasibility screening.</p>
            <button onClick={() => startTrial(plan)} className="rounded bg-slate-900 px-3 py-2 text-sm text-white">
              Start trial
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}
