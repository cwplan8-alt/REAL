export const eventNames = [
  "page_view",
  "search_submitted",
  "result_clicked",
  "report_generated",
  "style_feedback_submitted",
  "pricing_viewed",
  "trial_started",
  "waitlist_joined",
  "contact_requested",
] as const;

export type EventName = (typeof eventNames)[number];

export type AnalyticsEvent = {
  app_id: "A" | "B";
  event: EventName;
  timestamp: string;
  session_id: string;
  user_id?: string;
  role?: string;
  source?: string;
  metadata: Record<string, unknown>;
};

export function makeEvent(input: Omit<AnalyticsEvent, "timestamp" | "metadata"> & { timestamp?: string; metadata?: Record<string, unknown> }) {
  if (!eventNames.includes(input.event)) {
    throw new Error(`Invalid event: ${input.event}`);
  }

  return {
    ...input,
    timestamp: input.timestamp ?? new Date().toISOString(),
    metadata: input.metadata ?? {},
  } satisfies AnalyticsEvent;
}
