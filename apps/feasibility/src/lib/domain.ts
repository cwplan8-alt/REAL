export const DISCLAIMER =
  "Preliminary screening only. This tool is not legal advice, not permit-grade analysis, and may contain errors. Verify with licensed professionals and the local jurisdiction.";

export type Parcel = {
  apn: string;
  address: string;
  zoningDistrict: string;
  allowedUses: string[];
  maxHeightFt: number;
  frontSetbackFt: number;
  sideSetbackFt: number;
  rearSetbackFt: number;
  far?: number;
  lotCoverage?: number;
  maxUnits?: number;
  lotAreaSqft: number;
  lotWidthFt: number;
  lotDepthFt: number;
  risk: {
    floodZone: string;
    wildfire: "low" | "medium" | "high";
    heatRisk: "low" | "medium" | "high";
  };
};

export type EnvelopeEstimate = {
  buildableFootprintSqft: number;
  maxGrossFloorAreaSqft: number;
  effectiveSellableAreaSqft: number;
  estimatedStories: number;
  unitCapApplied: number | null;
  assumptions: {
    efficiencyFactor: number;
    circulationFactor: number;
    parkingDeductionSqft: number;
  };
};

export const parcels: Parcel[] = [
  {
    apn: "100-200-01",
    address: "123 Main St, Metro City",
    zoningDistrict: "R-3",
    allowedUses: ["Multifamily", "ADU", "Townhome"],
    maxHeightFt: 45,
    frontSetbackFt: 15,
    sideSetbackFt: 5,
    rearSetbackFt: 15,
    far: 2,
    lotCoverage: 0.6,
    maxUnits: 18,
    lotAreaSqft: 12000,
    lotWidthFt: 100,
    lotDepthFt: 120,
    risk: { floodZone: "X", wildfire: "low", heatRisk: "medium" },
  },
  {
    apn: "100-200-02",
    address: "55 Oak Ave, Metro City",
    zoningDistrict: "MU-2",
    allowedUses: ["Mixed-use", "Retail", "Multifamily"],
    maxHeightFt: 65,
    frontSetbackFt: 10,
    sideSetbackFt: 0,
    rearSetbackFt: 10,
    far: 3.5,
    lotCoverage: 0.8,
    maxUnits: 42,
    lotAreaSqft: 20000,
    lotWidthFt: 125,
    lotDepthFt: 160,
    risk: { floodZone: "AE", wildfire: "low", heatRisk: "high" },
  },
];

export function computeEnvelope(parcel: Parcel): EnvelopeEstimate {
  const assumptions = {
    efficiencyFactor: 0.82,
    circulationFactor: 0.9,
    parkingDeductionSqft: 2500,
  };

  const widthBuildable = Math.max(parcel.lotWidthFt - parcel.sideSetbackFt * 2, 0);
  const depthBuildable = Math.max(parcel.lotDepthFt - parcel.frontSetbackFt - parcel.rearSetbackFt, 0);
  const rawFootprint = widthBuildable * depthBuildable;
  const coverageCap = parcel.lotCoverage ? parcel.lotAreaSqft * parcel.lotCoverage : rawFootprint;
  const buildableFootprintSqft = Math.min(rawFootprint, coverageCap);

  const storiesByHeight = Math.max(Math.floor(parcel.maxHeightFt / 12), 1);
  const areaByHeight = buildableFootprintSqft * storiesByHeight;
  const areaByFar = parcel.far ? parcel.lotAreaSqft * parcel.far : areaByHeight;
  const maxGrossFloorAreaSqft = Math.min(areaByHeight, areaByFar);

  const afterParking = Math.max(maxGrossFloorAreaSqft - assumptions.parkingDeductionSqft, 0);
  const effectiveSellableAreaSqft = Math.round(
    afterParking * assumptions.efficiencyFactor * assumptions.circulationFactor,
  );

  return {
    buildableFootprintSqft: Math.round(buildableFootprintSqft),
    maxGrossFloorAreaSqft: Math.round(maxGrossFloorAreaSqft),
    effectiveSellableAreaSqft,
    estimatedStories: storiesByHeight,
    unitCapApplied: parcel.maxUnits ?? null,
    assumptions,
  };
}

export function computeMetrics(events: Array<{ event: string; session_id: string }>) {
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

export function sessionCookieName(_app?: string) {
  return "feasibility_user";
}
