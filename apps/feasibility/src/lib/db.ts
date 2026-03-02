import { kv } from "@vercel/kv";
import type { AnalyticsEvent } from "./analytics";
import { parcels } from "./domain";

type WaitlistLead = {
  name: string;
  email: string;
  role: string;
  useCase: string;
  app_id: "A";
  createdAt: string;
};

export const db = {
  async insertEvent(event: AnalyticsEvent) {
    await kv.lpush("feasibility:events", event);
    return event;
  },
  async getEvents(_app_id?: "A"): Promise<AnalyticsEvent[]> {
    return (await kv.lrange<AnalyticsEvent>("feasibility:events", 0, -1)) ?? [];
  },
  async insertLead(lead: WaitlistLead) {
    await kv.lpush("feasibility:leads", lead);
    return lead;
  },
  async getLeads(_app_id?: "A"): Promise<WaitlistLead[]> {
    return (await kv.lrange<WaitlistLead>("feasibility:leads", 0, -1)) ?? [];
  },
  async upsertUser(email: string, app_id: "A") {
    const id = email.toLowerCase();
    await kv.set(`feasibility:user:${id}`, { email, app_id });
    return { id, email, app_id };
  },
  findParcel(query: string) {
    return parcels.find(
      (p) =>
        p.apn.toLowerCase() === query.toLowerCase() ||
        p.address.toLowerCase().includes(query.toLowerCase()),
    );
  },
};
