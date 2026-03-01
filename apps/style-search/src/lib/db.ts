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

type Store = {
  events: AnalyticsEvent[];
  leads: WaitlistLead[];
  users: Map<string, { email: string; app_id: "B" }>;
};

const globalForStore = globalThis as unknown as { __STYLE_DB__?: Store };

function getStore(): Store {
  if (!globalForStore.__STYLE_DB__) {
    globalForStore.__STYLE_DB__ = {
      events: [],
      leads: [],
      users: new Map(),
    };
  }
  return globalForStore.__STYLE_DB__;
}

export const db = {
  insertEvent(event: AnalyticsEvent) {
    getStore().events.push(event);
    return event;
  },
  getEvents(_app_id?: "B") {
    return getStore().events;
  },
  insertLead(lead: WaitlistLead) {
    getStore().leads.push(lead);
    return lead;
  },
  getLeads(_app_id?: "B") {
    return getStore().leads;
  },
  upsertUser(email: string, app_id: "B") {
    const id = email.toLowerCase();
    getStore().users.set(id, { email, app_id });
    return { id, email, app_id };
  },
  getListings() {
    return listings;
  },
};
