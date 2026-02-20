import { makeEvent, type AnalyticsEvent } from "./schema";

const sink: AnalyticsEvent[] = [];

export function trackEvent(input: Omit<AnalyticsEvent, "timestamp"> & { timestamp?: string }) {
  const event = makeEvent(input);
  sink.push(event);
  return event;
}

export function listEvents() {
  return sink;
}

export function clearEvents() {
  sink.length = 0;
}
