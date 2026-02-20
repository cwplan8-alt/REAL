import { notFound } from "next/navigation";
import { db } from "@repo/db";
import { DISCLAIMER, computeEnvelope } from "@repo/shared";

export default async function ReportPage({ params }: { params: Promise<{ query: string }> }) {
  const { query } = await params;
  const parcel = db.findParcel(decodeURIComponent(query));

  if (!parcel) notFound();

  const envelope = computeEnvelope(parcel);

  return (
    <article className="mx-auto max-w-3xl rounded border border-slate-300 bg-white p-8 print:border-0 print:shadow-none">
      <h1 className="text-2xl font-bold">Preliminary Feasibility Report</h1>
      <p className="text-sm text-slate-600">Generated {new Date().toISOString()}</p>
      <hr className="my-4" />
      <p><b>Address:</b> {parcel.address}</p>
      <p><b>APN:</b> {parcel.apn}</p>
      <p><b>Zoning:</b> {parcel.zoningDistrict}</p>
      <p><b>Allowed uses:</b> {parcel.allowedUses.join(", ")}</p>
      <p><b>Height:</b> {parcel.maxHeightFt} ft</p>
      <p><b>Setbacks:</b> Front {parcel.frontSetbackFt}, Side {parcel.sideSetbackFt}, Rear {parcel.rearSetbackFt} ft</p>
      <p><b>FAR:</b> {parcel.far ?? "N/A"} | <b>Lot coverage:</b> {parcel.lotCoverage ?? "N/A"} | <b>Units:</b> {parcel.maxUnits ?? "N/A"}</p>
      <hr className="my-4" />
      <p><b>Buildable footprint:</b> {envelope.buildableFootprintSqft.toLocaleString()} sf</p>
      <p><b>Max gross floor area:</b> {envelope.maxGrossFloorAreaSqft.toLocaleString()} sf</p>
      <p><b>Estimated effective sellable:</b> {envelope.effectiveSellableAreaSqft.toLocaleString()} sf</p>
      <p><b>Estimated stories:</b> {envelope.estimatedStories}</p>
      <p><b>Assumptions:</b> efficiency {envelope.assumptions.efficiencyFactor}, circulation {envelope.assumptions.circulationFactor}, parking deduction {envelope.assumptions.parkingDeductionSqft} sf</p>
      <hr className="my-4" />
      <p><b>Climate/risk:</b> flood zone {parcel.risk.floodZone}, wildfire {parcel.risk.wildfire}, heat {parcel.risk.heatRisk}</p>
      <p className="mt-4 rounded border border-red-300 bg-red-50 p-2 text-xs text-red-800">{DISCLAIMER}</p>
      <button className="mt-4 rounded bg-slate-900 px-3 py-2 text-white print:hidden" onClick={() => window.print()}>
        Print / Save PDF
      </button>
    </article>
  );
}
