import { db } from "@repo/db";
import { computeMetrics } from "@repo/shared";

export default function AdminPage() {
  const events = db.getEvents("B");
  const leads = db.getLeads("B");
  const metrics = computeMetrics(events);

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Admin Lite (Idea B)</h1>
      <div className="grid gap-3 md:grid-cols-2">
        <section className="rounded border border-slate-300 bg-white p-4">
          <h2 className="font-semibold">Top metrics</h2>
          <p>Total events: {metrics.total}</p>
          <p>Unique sessions: {metrics.uniqueSessions}</p>
          <p>Waitlist leads: {leads.length}</p>
          <p>Funnel visitors: {metrics.funnel.visitors}</p>
          <p>Funnel searches: {metrics.funnel.searches}</p>
          <p>Funnel key action: {metrics.funnel.keyActions}</p>
          <p>Funnel pricing: {metrics.funnel.pricingViews}</p>
          <p>Funnel trials/contact: {metrics.funnel.trials}</p>
        </section>
        <section className="rounded border border-slate-300 bg-white p-4">
          <h2 className="font-semibold">Event counts</h2>
          <pre className="mt-2 overflow-auto text-xs">{JSON.stringify(metrics.byEvent, null, 2)}</pre>
        </section>
      </div>
    </div>
  );
}
