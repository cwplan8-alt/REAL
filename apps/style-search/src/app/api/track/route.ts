import { makeEvent } from "@repo/analytics";
import { db } from "@repo/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const event = makeEvent(body);
  db.insertEvent(event);
  return NextResponse.json({ ok: true, event });
}
