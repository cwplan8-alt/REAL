import { notFound } from "next/navigation";
import { listings } from "@repo/shared";
import FeedbackButton from "./style-feedback";

export default async function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = listings.find((item) => item.id === id);

  if (!listing) notFound();

  return (
    <div className="grid gap-4 rounded border border-slate-300 bg-white p-5">
      <h1 className="text-2xl font-bold">{listing.address}</h1>
      <p>${listing.price.toLocaleString()} | {listing.beds} bd / {listing.baths} ba | {listing.sqft} sf</p>
      <p><b>Predicted style:</b> {listing.styleLabel} ({Math.round(listing.styleConfidence * 100)}%)</p>
      <div>
        <p className="font-medium">Style clues</p>
        <ul className="list-disc pl-5">
          {listing.clues.map((clue) => (
            <li key={clue}>{clue}</li>
          ))}
        </ul>
      </div>
      <FeedbackButton listingId={listing.id} predictedStyle={listing.styleLabel} />
    </div>
  );
}
