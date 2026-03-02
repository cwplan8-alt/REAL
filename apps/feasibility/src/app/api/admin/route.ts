import { db } from "@/lib/db";
import { computeMetrics } from "@/lib/domain";
import { NextResponse } from "next/server";

export async function GET() {
  const events = await db.getEvents("A");
  const leads = await db.getLeads("A");
  const metrics = computeMetrics(events);
  return NextResponse.json({ metrics, leads });
}
