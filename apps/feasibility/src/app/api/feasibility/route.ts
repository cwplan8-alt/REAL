import { db } from "@/lib/db";
import { computeEnvelope } from "@/lib/domain";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const query = String(body.query || "");
  const parcel = db.findParcel(query);

  if (!parcel) {
    return NextResponse.json({ error: "Parcel not found" }, { status: 404 });
  }

  const envelope = computeEnvelope(parcel);
  return NextResponse.json({ parcel, envelope });
}

