import { Listing } from "./types";

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

export function filterListings(listings: Listing[], filters: ListingFilters): Listing[] {
  return listings.filter((listing) => {
    if (filters.minPrice && listing.price < filters.minPrice) return false;
    if (filters.maxPrice && listing.price > filters.maxPrice) return false;
    if (filters.minBeds && listing.beds < filters.minBeds) return false;
    if (filters.style && listing.styleLabel !== filters.style) return false;
    return true;
  });
}
