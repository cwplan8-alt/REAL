import { Redis } from "@upstash/redis";
import type { AnalyticsEvent } from "./analytics";
import { listings } from "./domain";

const redis = Redis.fromEnv();

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
    await redis.lpush("style-search:events", event);
    return event;
  },
  async getEvents(_app_id?: "B"): Promise<AnalyticsEvent[]> {
    return (await redis.lrange<AnalyticsEvent>("style-search:events", 0, -1)) ?? [];
  },
  async insertLead(lead: WaitlistLead) {
    await redis.lpush("style-search:leads", lead);
    return lead;
  },
  async getLeads(_app_id?: "B"): Promise<WaitlistLead[]> {
    return (await redis.lrange<WaitlistLead>("style-search:leads", 0, -1)) ?? [];
  },
  async upsertUser(email: string, app_id: "B") {
    const id = email.toLowerCase();
    await redis.set(`style-search:user:${id}`, { email, app_id });
    return { id, email, app_id };
  },
  getListings() {
    return listings;
  },
};
