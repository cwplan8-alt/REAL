import { makeEvent } from "@/lib/analytics";
import { db } from "@/lib/db";
import { sessionCookieName } from "@/lib/domain";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.upsertUser(body.email, "A");

  await db.insertEvent(
    makeEvent({
      app_id: "A",
      event: "contact_requested",
      session_id: `A-${Math.random().toString(36).slice(2, 10)}`,
      user_id: user.id,
      metadata: { action: "mock_magic_link" },
    }),
  );

  const response = NextResponse.json({ ok: true, user });
  response.cookies.set(sessionCookieName("A"), user.id, { httpOnly: false, path: "/" });
  return response;
}
