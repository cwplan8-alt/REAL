import { EnvelopeEstimate, Parcel } from "./types";

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
