export type AppId = "A" | "B";

export type UserRole = "developer" | "investor-agent" | "buyer" | "architect" | "other";

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

export type EnvelopeAssumptions = {
  efficiencyFactor: number;
  circulationFactor: number;
  parkingDeductionSqft: number;
};

export type EnvelopeEstimate = {
  buildableFootprintSqft: number;
  maxGrossFloorAreaSqft: number;
  effectiveSellableAreaSqft: number;
  estimatedStories: number;
  unitCapApplied: number | null;
  assumptions: EnvelopeAssumptions;
};

export type Listing = {
  id: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  styleLabel: string;
  styleConfidence: number;
  clues: string[];
  neighborhood: string;
};

export const DISCLAIMER =
  "Preliminary screening only. This tool is not legal advice, not permit-grade analysis, and may contain errors. Verify with licensed professionals and the local jurisdiction.";
