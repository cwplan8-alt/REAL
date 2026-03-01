export type Listing = {
  id: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  styleLabel: string;
  styleConfidence: number;
  clues: string[];
  neighborhood: string;
};

export const listings: Listing[] = [
  {
    id: "l1",
    address: "12 Cedar Ln, Metro",
    price: 845000,
    beds: 3,
    baths: 2,
    sqft: 1820,
    yearBuilt: 1928,
    styleLabel: "Craftsman",
    styleConfidence: 0.79,
    clues: ["Exposed rafters", "Tapered columns", "Wide front porch"],
    neighborhood: "North Park",
  },
  {
    id: "l2",
    address: "81 Skyline Dr, Metro",
    price: 1295000,
    beds: 4,
    baths: 3,
    sqft: 2550,
    yearBuilt: 1964,
    styleLabel: "Mid-Century Modern",
    styleConfidence: 0.84,
    clues: ["Low-pitched roof", "Clerestory windows", "Open plan"],
    neighborhood: "Canyon View",
  },
  {
    id: "l3",
    address: "9 Harbor Ct, Metro",
    price: 940000,
    beds: 3,
    baths: 2,
    sqft: 1740,
    yearBuilt: 1998,
    styleLabel: "Contemporary",
    styleConfidence: 0.62,
    clues: ["Flat planes", "Large glazing"],
    neighborhood: "Marina East",
  },
  {
    id: "l4",
    address: "303 Willow St, Metro",
    price: 715000,
    beds: 2,
    baths: 1,
    sqft: 1320,
    yearBuilt: 1911,
    styleLabel: "Victorian",
    styleConfidence: 0.73,
    clues: ["Ornate trim", "Bay windows", "Steep gable"],
    neighborhood: "Old Town",
  },
];

export type ListingFilters = {
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  style?: string;
};

export function classifyStyleConfidence(listing: Listing): number {
  const styleBonus = listing.clues.length >= 3 ? 0.15 : 0;
  const ageBonus = listing.yearBuilt < 1970 ? 0.08 : 0;
  return Math.min(0.99, Math.max(0.5, listing.styleConfidence + styleBonus + ageBonus));
}

export function filterListings(input: Listing[], filters: ListingFilters): Listing[] {
  return input.filter((listing) => {
    if (filters.minPrice && listing.price < filters.minPrice) return false;
    if (filters.maxPrice && listing.price > filters.maxPrice) return false;
    if (filters.minBeds && listing.beds < filters.minBeds) return false;
    if (filters.style && listing.styleLabel !== filters.style) return false;
    return true;
  });
}

export function computeMetrics(events: Array<{ event: string; session_id: string }>) {
  const total = events.length;
  const uniqueSessions = new Set(events.map((e) => e.session_id)).size;
  const byEvent = events.reduce<Record<string, number>>((acc, event) => {
    acc[event.event] = (acc[event.event] ?? 0) + 1;
    return acc;
  }, {});

  const funnel = {
    visitors: byEvent.page_view ?? 0,
    searches: byEvent.search_submitted ?? 0,
    keyActions: (byEvent.report_generated ?? 0) + (byEvent.style_feedback_submitted ?? 0),
    pricingViews: byEvent.pricing_viewed ?? 0,
    trials: (byEvent.trial_started ?? 0) + (byEvent.contact_requested ?? 0),
  };

  return { total, uniqueSessions, byEvent, funnel };
}

export function sessionCookieName(_app?: string) {
  return "stylesearch_user";
}
