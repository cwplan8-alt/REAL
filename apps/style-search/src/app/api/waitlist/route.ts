import { makeEvent } from "@repo/analytics";
import { db } from "@repo/db";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const lead = db.insertLead({
    app_id: "B",
    name: body.name,
    email: body.email,
    role: body.role,
    useCase: body.useCase,
    createdAt: new Date().toISOString(),
  });

  db.insertEvent(
    makeEvent({
      app_id: "B",
      event: "waitlist_joined",
      session_id: body.session_id ?? `B-${Math.random().toString(36).slice(2, 10)}`,
      role: body.role,
      metadata: { email: body.email },
    }),
  );

  return NextResponse.json({ ok: true, lead });
}
