import { kv } from "@vercel/kv";
import type { AnalyticsEvent } from "./analytics";
import { listings } from "./domain";

type WaitlistLead = {
  name: string;
  email: string;
  role: string;
  useCase: string;
  app_id: "B";
  createdAt: string;
};

export const db = {
  async insertEvent(event: AnalyticsEvent) {
    await kv.lpush("style-search:events", event);
    return event;
  },
  async getEvents(_app_id?: "B"): Promise<AnalyticsEvent[]> {
    return (await kv.lrange<AnalyticsEvent>("style-search:events", 0, -1)) ?? [];
  },
  async insertLead(lead: WaitlistLead) {
    await kv.lpush("style-search:leads", lead);
    return lead;
  },
  async getLeads(_app_id?: "B"): Promise<WaitlistLead[]> {
    return (await kv.lrange<WaitlistLead>("style-search:leads", 0, -1)) ?? [];
  },
  async upsertUser(email: string, app_id: "B") {
    const id = email.toLowerCase();
    await kv.set(`style-search:user:${id}`, { email, app_id });
    return { id, email, app_id };
  },
  getListings() {
    return listings;
  },
};
