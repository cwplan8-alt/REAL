import { db } from "@repo/db";
import { computeMetrics } from "@repo/shared";
import { NextResponse } from "next/server";

export async function GET() {
  const events = db.getEvents("A");
  const leads = db.getLeads("A");
  const metrics = computeMetrics(events);
  return NextResponse.json({ metrics, leads });
}
