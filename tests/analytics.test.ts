import { describe, expect, it } from "vitest";
import { analyticsEventSchema, makeEvent } from "@repo/analytics";

describe("analytics schema validation", () => {
  it("accepts required event fields", () => {
    const event = makeEvent({
      app_id: "A",
      event: "page_view",
      session_id: "A-1234",
      metadata: { page: "landing" },
    });
    expect(event.event).toBe("page_view");
  });

  it("rejects invalid event names", () => {
    const parsed = analyticsEventSchema.safeParse({
      app_id: "A",
      event: "bad_event",
      timestamp: new Date().toISOString(),
      session_id: "A-1234",
    });
    expect(parsed.success).toBe(false);
  });
});
