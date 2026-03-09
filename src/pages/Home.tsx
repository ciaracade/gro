import { useState, useEffect, useCallback } from "react";
import ListingCard from "../components/ListingCard";
import FilterPanel from "../components/FilterPanel";
import PickupModal from "../components/PickupModal";
import { useAuth } from "../hooks/useAuth";
import { fetchListings } from "../lib/api";
import { mockListings } from "../lib/mockData";
import type { FilterState, FoodListing } from "../types";

const defaultFilters: FilterState = {
  distance: 3,
  accessibility: [],
  foodType: [],
  timeRemaining: [],
};

export default function Home() {
  const { profile } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [pickupListing, setPickupListing] = useState<FoodListing | null>(null);

  const loadListings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await fetchListings({
      foodType: filters.foodType.length > 0 ? filters.foodType : undefined,
      accessibility:
        filters.accessibility.length > 0 ? filters.accessibility : undefined,
    });

    if (error || !data) {
      // fall back to mock data if supabase isn't configured
      setListings(mockListings);
    } else {
      setListings(data);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const hasUrgent = listings.some(
    (l) => l.minutes_remaining && l.minutes_remaining <= 60,
  );

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* teal header */}
      <header className="bg-teal px-4 pt-10 pb-6 relative">
        <div className="absolute top-10 right-4">
          <span className="inline-flex items-center gap-1 bg-teal-dark/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ⭐ {profile?.points ?? 0} pts
          </span>
        </div>

        <div className="text-center">
          <h1 className="font-fredoka text-4xl font-bold text-white">gro!</h1>
          <p className="text-white/90 text-sm mt-1">
            Share food. Reduce waste. Grow community.
          </p>
        </div>
      </header>

      {/* content */}
      <div className="flex-1 px-4 -mt-2">
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-800">
                📍 Nearby Food Available
              </span>
              {hasUrgent && (
                <span className="bg-salmon text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Urgent
                </span>
              )}
            </div>
            <button
              onClick={() => setShowFilters(true)}
              className="text-sm text-teal font-medium"
            >
              🔍 Filter
            </button>
          </div>

          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              Loading listings...
            </div>
          ) : listings.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No food available nearby right now.
            </div>
          ) : (
            <div className="space-y-4">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onPickup={() => setPickupListing(listing)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {pickupListing && (
        <PickupModal
          listing={pickupListing}
          onClose={() => setPickupListing(null)}
          onSuccess={() => {
            setPickupListing(null);
            loadListings();
          }}
        />
      )}
    </div>
  );
}
