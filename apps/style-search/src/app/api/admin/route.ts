import { db } from "@/lib/db";
import { computeMetrics } from "@/lib/domain";
import { NextResponse } from "next/server";

export async function GET() {
  const events = db.getEvents("B");
  const leads = db.getLeads("B");
  const metrics = computeMetrics(events);
  return NextResponse.json({ metrics, leads });
}
