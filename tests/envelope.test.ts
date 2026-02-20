import { describe, expect, it } from "vitest";
import { computeEnvelope, parcels } from "@repo/shared";

describe("envelope calc", () => {
  it("computes positive buildable metrics", () => {
    const result = computeEnvelope(parcels[0]);
    expect(result.buildableFootprintSqft).toBeGreaterThan(0);
    expect(result.maxGrossFloorAreaSqft).toBeGreaterThan(result.buildableFootprintSqft);
    expect(result.effectiveSellableAreaSqft).toBeGreaterThan(0);
    expect(result.estimatedStories).toBeGreaterThanOrEqual(1);
  });

  it("respects far cap", () => {
    const parcel = { ...parcels[0], far: 0.2 };
    const result = computeEnvelope(parcel);
    expect(result.maxGrossFloorAreaSqft).toBeLessThanOrEqual(Math.round(parcel.lotAreaSqft * 0.2));
  });
});
