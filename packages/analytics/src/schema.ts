import { z } from "zod";

export const eventNameSchema = z.enum([
  "page_view",
  "search_submitted",
  "result_clicked",
  "report_generated",
  "style_feedback_submitted",
  "pricing_viewed",
  "trial_started",
  "waitlist_joined",
  "contact_requested",
]);

export const analyticsEventSchema = z.object({
  app_id: z.enum(["A", "B"]),
  event: eventNameSchema,
  timestamp: z.string().datetime(),
  session_id: z.string().min(4),
  user_id: z.string().optional(),
  role: z.string().optional(),
  source: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).default({}),
});

export type AnalyticsEvent = z.infer<typeof analyticsEventSchema>;

export function makeEvent(input: Omit<AnalyticsEvent, "timestamp"> & { timestamp?: string }): AnalyticsEvent {
  return analyticsEventSchema.parse({
    ...input,
    timestamp: input.timestamp ?? new Date().toISOString(),
  });
}
