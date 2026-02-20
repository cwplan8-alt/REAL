"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { DISCLAIMER } from "@repo/shared";
import { usePageView, track } from "@/lib/client";

type Result = {
  parcel: {
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
    risk: { floodZone: string; wildfire: string; heatRisk: string };
  };
  envelope: {
    buildableFootprintSqft: number;
    maxGrossFloorAreaSqft: number;
    effectiveSellableAreaSqft: number;
    estimatedStories: number;
  };
};

export default function AnalyzePage() {
  usePageView("analyze");
  const [result, setResult] = useState<Result | null>(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Loading...");
    const response = await fetch("/api/feasibility", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      setStatus("Parcel not found in seed data");
      setResult(null);
      return;
    }

    const json = await response.json();
    setResult(json);
    setStatus("Result loaded");
    await track("search_submitted", { query });
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Parcel Feasibility Screener</h1>
      <form onSubmit={onSubmit} className="flex gap-2">
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Enter parcel address or APN"
          className="w-full rounded border border-slate-300 px-3 py-2"
          required
        />
        <button className="rounded bg-slate-900 px-4 py-2 text-white" type="submit">Analyze</button>
      </form>
      {status ? <p className="text-sm text-slate-700">{status}</p> : null}

      {result ? (
        <section className="grid gap-4 rounded-xl border border-slate-300 bg-white p-5">
          <div>
            <h2 className="text-xl font-semibold">{result.parcel.address}</h2>
            <p className="text-sm text-slate-600">APN {result.parcel.apn}</p>
          </div>
          <div className="grid gap-2 text-sm">
            <p><b>Zoning:</b> {result.parcel.zoningDistrict}</p>
            <p><b>Allowed uses:</b> {result.parcel.allowedUses.join(", ")}</p>
            <p><b>Height:</b> {result.parcel.maxHeightFt} ft</p>
            <p><b>Setbacks:</b> Front {result.parcel.frontSetbackFt} / Side {result.parcel.sideSetbackFt} / Rear {result.parcel.rearSetbackFt} ft</p>
            <p><b>FAR:</b> {result.parcel.far ?? "N/A"} | <b>Lot coverage:</b> {result.parcel.lotCoverage ?? "N/A"}</p>
            <p><b>Max units:</b> {result.parcel.maxUnits ?? "Not specified"}</p>
          </div>
          <div className="grid gap-1 text-sm">
            <p><b>Estimated buildable footprint:</b> {result.envelope.buildableFootprintSqft.toLocaleString()} sf</p>
            <p><b>Estimated max GFA:</b> {result.envelope.maxGrossFloorAreaSqft.toLocaleString()} sf</p>
            <p><b>Estimated effective sellable:</b> {result.envelope.effectiveSellableAreaSqft.toLocaleString()} sf</p>
            <p><b>Estimated stories:</b> {result.envelope.estimatedStories}</p>
          </div>
          <div className="rounded border border-amber-300 bg-amber-50 p-3 text-sm">
            <b>Climate / Risk panel:</b> Flood zone {result.parcel.risk.floodZone}, wildfire {result.parcel.risk.wildfire}, heat {result.parcel.risk.heatRisk}
          </div>
          <div className="flex gap-3">
            <Link
              href={`/report/${encodeURIComponent(result.parcel.apn)}`}
              className="rounded bg-slate-900 px-3 py-2 text-sm text-white"
              onClick={() => track("report_generated", { apn: result.parcel.apn })}
            >
              Printable report
            </Link>
            <Link href="/pricing" className="rounded border border-slate-400 px-3 py-2 text-sm" onClick={() => track("pricing_viewed", { origin: "analyze" })}>
              Pricing
            </Link>
          </div>
          <p className="rounded border border-red-300 bg-red-50 p-2 text-xs text-red-800">{DISCLAIMER}</p>
        </section>
      ) : null}
    </div>
  );
}
