import { AnalyticsEvent } from "@repo/analytics";

export function computeMetrics(events: AnalyticsEvent[]) {
  const total = events.length;
  const uniqueSessions = new Set(events.map((e) => e.session_id)).size;
  const byEvent = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.event] = (acc[event.event] ?? 0) + 1;
    return acc;
  }, {});

  const funnel = {
    visitors: byEvent.page_view ?? 0,
    searches: byEvent.search_submitted ?? 0,
    keyActions: (byEvent.report_generated ?? 0) + (byEvent.style_feedback_submitted ?? 0),
    pricingViews: byEvent.pricing_viewed ?? 0,
    trials: (byEvent.trial_started ?? 0) + (byEvent.contact_requested ?? 0),
  };

  return { total, uniqueSessions, byEvent, funnel };
}
