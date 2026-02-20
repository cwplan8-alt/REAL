import { AnalyticsEvent } from "@repo/analytics";
import { listings, parcels } from "@repo/shared";

type WaitlistLead = {
  name: string;
  email: string;
  role: string;
  useCase: string;
  app_id: "A" | "B";
  createdAt: string;
};

const events: AnalyticsEvent[] = [];
const leads: WaitlistLead[] = [];
const users = new Map<string, { email: string; app_id: "A" | "B" }>();

export function insertEvent(event: AnalyticsEvent) {
  events.push(event);
  return event;
}

export function getEvents(app_id?: "A" | "B") {
  return app_id ? events.filter((e) => e.app_id === app_id) : events;
}

export function insertLead(lead: WaitlistLead) {
  leads.push(lead);
  return lead;
}

export function getLeads(app_id?: "A" | "B") {
  return app_id ? leads.filter((l) => l.app_id === app_id) : leads;
}

export function upsertUser(email: string, app_id: "A" | "B") {
  const id = email.toLowerCase();
  users.set(id, { email, app_id });
  return { id, email, app_id };
}

export function getParcels() {
  return parcels;
}

export function findParcel(query: string) {
  return parcels.find(
    (p) => p.apn.toLowerCase() === query.toLowerCase() || p.address.toLowerCase().includes(query.toLowerCase()),
  );
}

export function getListings() {
  return listings;
}

export const db = {
  insertEvent,
  getEvents,
  insertLead,
  getLeads,
  upsertUser,
  getParcels,
  findParcel,
  getListings,
};
