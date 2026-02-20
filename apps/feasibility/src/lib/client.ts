"use client";

import { useEffect } from "react";

export function getSessionId() {
  if (typeof window === "undefined") return "server-session";
  const key = "session_id_A";
  let current = localStorage.getItem(key);
  if (!current) {
    current = `A-${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem(key, current);
  }
  return current;
}

export async function track(event: string, metadata: Record<string, unknown> = {}) {
  await fetch("/api/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      app_id: "A",
      event,
      session_id: getSessionId(),
      source: typeof window !== "undefined" ? document.referrer || "direct" : "server",
      metadata,
    }),
  });
}

export function usePageView(page: string) {
  useEffect(() => {
    void track("page_view", { page });
  }, [page]);
}
