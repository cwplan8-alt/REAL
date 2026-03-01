"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { classifyStyleConfidence, filterListings, listings } from "@/lib/domain";
import { track, usePageView } from "@/lib/client";

export default function SearchPage() {
  usePageView("search");
  const [minBeds, setMinBeds] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [style, setStyle] = useState("");

  const styles = useMemo(() => Array.from(new Set(listings.map((listing) => listing.styleLabel))), []);
  const filtered = useMemo(
    () =>
      filterListings(listings, {
        minBeds: minBeds ? Number(minBeds) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        style: style || undefined,
      }),
    [minBeds, maxPrice, style],
  );

  async function submitSearch() {
    await track("search_submitted", {
      minBeds: minBeds || null,
      maxPrice: maxPrice || null,
      style: style || null,
      resultCount: filtered.length,
    });
  }

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-bold">Architectural Style Search</h1>
      <section className="grid gap-2 rounded border border-slate-300 bg-white p-4 md:grid-cols-4">
        <input value={minBeds} onChange={(event) => setMinBeds(event.target.value)} placeholder="Min beds" className="rounded border border-slate-300 px-3 py-2" />
        <input value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max price" className="rounded border border-slate-300 px-3 py-2" />
        <select value={style} onChange={(event) => setStyle(event.target.value)} className="rounded border border-slate-300 px-3 py-2">
          <option value="">Any style</option>
          {styles.map((styleName) => (
            <option key={styleName} value={styleName}>{styleName}</option>
          ))}
        </select>
        <button className="rounded bg-slate-900 px-4 py-2 text-white" onClick={submitSearch}>Apply filters</button>
      </section>

      <p className="text-sm text-slate-700">{filtered.length} results</p>

      <section className="grid gap-3">
        {filtered.map((listing) => (
          <article key={listing.id} className="rounded border border-slate-300 bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold">{listing.address}</h2>
                <p className="text-sm text-slate-600">{listing.neighborhood}</p>
                <p className="text-sm">${listing.price.toLocaleString()} | {listing.beds} bd / {listing.baths} ba | {listing.sqft} sf</p>
              </div>
              <div className="text-right text-sm">
                <p className="font-medium">{listing.styleLabel}</p>
                <p>Confidence {(classifyStyleConfidence(listing) * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link href={`/listing/${listing.id}`} className="rounded bg-slate-900 px-3 py-2 text-xs text-white" onClick={() => track("result_clicked", { listingId: listing.id, style: listing.styleLabel })}>
                View details
              </Link>
              <button className="rounded border border-slate-400 px-3 py-2 text-xs" onClick={() => track("contact_requested", { action: "save_search_placeholder" })}>
                Save search + alert
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
