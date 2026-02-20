import { describe, expect, it } from "vitest";
import { classifyStyleConfidence, filterListings, listings } from "@repo/shared";

describe("style filter/classifier", () => {
  it("filters by style and constraints", () => {
    const result = filterListings(listings, { style: "Craftsman", minBeds: 3, maxPrice: 900000 });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("l1");
  });

  it("keeps confidence in expected range", () => {
    const confidence = classifyStyleConfidence(listings[1]);
    expect(confidence).toBeGreaterThanOrEqual(0.5);
    expect(confidence).toBeLessThanOrEqual(0.99);
  });
});
