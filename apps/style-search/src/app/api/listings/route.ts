import { db } from "@repo/db";
import { filterListings } from "@repo/shared";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const listings = db.getListings();
  const results = filterListings(listings, {
    minBeds: body.minBeds ? Number(body.minBeds) : undefined,
    maxPrice: body.maxPrice ? Number(body.maxPrice) : undefined,
    style: body.style || undefined,
  });

  return NextResponse.json({ results });
}
