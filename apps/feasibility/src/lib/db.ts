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

type Store = {
  events: AnalyticsEvent[];
  leads: WaitlistLead[];
  users: Map<string, { email: string; app_id: "A" }>;
};

const globalForStore = globalThis as unknown as { __FEASIBILITY_DB__?: Store };

function getStore(): Store {
  if (!globalForStore.__FEASIBILITY_DB__) {
    globalForStore.__FEASIBILITY_DB__ = {
      events: [],
      leads: [],
      users: new Map(),
    };
  }
  return globalForStore.__FEASIBILITY_DB__;
}

export const db = {
  insertEvent(event: AnalyticsEvent) {
    getStore().events.push(event);
    return event;
  },
  getEvents(_app_id?: "A") {
    return getStore().events;
  },
  insertLead(lead: WaitlistLead) {
    getStore().leads.push(lead);
    return lead;
  },
  getLeads(_app_id?: "A") {
    return getStore().leads;
  },
  upsertUser(email: string, app_id: "A") {
    const id = email.toLowerCase();
    getStore().users.set(id, { email, app_id });
    return { id, email, app_id };
  },
  findParcel(query: string) {
    return parcels.find(
      (p) => p.apn.toLowerCase() === query.toLowerCase() || p.address.toLowerCase().includes(query.toLowerCase()),
    );
  },
};
