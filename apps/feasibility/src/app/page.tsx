"use client";

import Link from "next/link";
import { WaitlistForm } from "@/components/waitlist-form";
import { usePageView, track } from "@/lib/client";

export default function Home() {
  usePageView("landing");

  return (
    <div className="grid gap-8">
      <section className="rounded-xl border border-slate-300 bg-white p-8">
        <h1 className="text-3xl font-bold">What can I build here?</h1>
        <p className="mt-3 max-w-3xl text-slate-700">
          Preliminary parcel feasibility screening for small developers and investor-agents. One city, fast answers.
        </p>
        <div className="mt-5 flex gap-3">
          <Link href="/analyze" className="rounded bg-slate-900 px-4 py-2 text-white" onClick={() => track("search_submitted", { origin: "landing_cta" })}>
            Start parcel check
          </Link>
          <Link href="/pricing" className="rounded border border-slate-400 px-4 py-2" onClick={() => track("pricing_viewed", { origin: "landing" })}>
            View pricing
          </Link>
        </div>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold">Lead capture</h2>
        <WaitlistForm appId="A" />
      </section>
    </div>
  );
}
