import { makeEvent } from "@repo/analytics";
import { db } from "@repo/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const event = makeEvent({
    app_id: "B",
    event: "style_feedback_submitted",
    session_id: body.session_id ?? `B-${Math.random().toString(36).slice(2, 10)}`,
    metadata: {
      listingId: body.listingId,
      predictedStyle: body.predictedStyle,
      feedback: body.feedback,
    },
  });

  db.insertEvent(event);
  return NextResponse.json({ ok: true });
}
