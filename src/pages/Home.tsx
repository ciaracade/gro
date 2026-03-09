import { useState } from "react";
import ListingCard from "../components/ListingCard";
import FilterPanel from "../components/FilterPanel";
import { mockListings, mockUser } from "../lib/mockData";
import type { FilterState } from "../types";

const defaultFilters: FilterState = {
  distance: 3,
  accessibility: [],
  foodType: [],
  timeRemaining: [],
};

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const hasUrgent = mockListings.some(
    (l) => l.minutes_remaining && l.minutes_remaining <= 60,
  );

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* teal header */}
      <header className="bg-teal px-4 pt-10 pb-6 relative">
        {/* points badge */}
        <div className="absolute top-10 right-4">
          <span className="inline-flex items-center gap-1 bg-teal-dark/50 text-white px-3 py-1 rounded-full text-sm font-semibold">
            ⭐ {mockUser.points} pts
          </span>
        </div>

        {/* logo */}
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
          {/* section header */}
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

          {/* listings */}
          <div className="space-y-4">
            {mockListings.map((listing) => (
              <ListingCard
                key={listing.id}
                listing={listing}
                onPickup={() => alert(`Picking up: ${listing.title}`)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* filter panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}
