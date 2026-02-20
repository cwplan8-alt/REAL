import { db } from "@repo/db";
import { computeMetrics } from "@repo/shared";
import { NextResponse } from "next/server";

export async function GET() {
  const events = db.getEvents("B");
  const leads = db.getLeads("B");
  const metrics = computeMetrics(events);
  return NextResponse.json({ metrics, leads });
}
