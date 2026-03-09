import type { FoodListing } from "../types";

const accessibilityLabels: Record<string, { emoji: string; label: string }> = {
  wheelchair: { emoji: "🧑‍🦽", label: "Wheelchair accessible" },
  covered: { emoji: "☂️", label: "Covered area" },
  parking: { emoji: "🅿️", label: "Nearby parking" },
  transit: { emoji: "🚌", label: "Near transit" },
};

// map food types to display emojis
const foodEmojis: Record<string, string[]> = {
  produce: ["🥖", "🍎", "🥬"],
  baked: ["🥐", "🍞", "🥖"],
  prepared: ["🍝", "🥗", "🍲"],
  packaged: ["🥫", "🫙", "🥫"],
  dairy: ["🥛", "🧀", "🥚"],
  meals: ["🍱", "🍛", "🍜"],
};

interface ListingCardProps {
  listing: FoodListing;
  onPickup?: () => void;
}

export default function ListingCard({ listing, onPickup }: ListingCardProps) {
  const emojis = foodEmojis[listing.food_type] || ["🍽️"];
  const isUrgent = listing.minutes_remaining && listing.minutes_remaining <= 60;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      {/* food emoji display area */}
      <div className="relative bg-cream p-6 flex items-center justify-center gap-4">
        {emojis.map((emoji, i) => (
          <span key={i} className="text-5xl">
            {emoji}
          </span>
        ))}
        {listing.minutes_remaining && (
          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold text-white ${
              isUrgent ? "bg-salmon" : "bg-orange-400"
            }`}
          >
            🕐 {listing.minutes_remaining} min left
          </span>
        )}
      </div>

      {/* card content */}
      <div className="p-4 space-y-3">
        <h3 className="text-lg font-bold text-gray-900">{listing.title}</h3>
        <p className="text-sm text-gray-600 leading-relaxed">
          {listing.description}
        </p>

        {/* location */}
        <p className="text-sm text-teal font-medium">
          📍 {listing.distance} · {listing.location_name}
        </p>

        {/* accessibility tags */}
        <div className="flex flex-wrap gap-2">
          {listing.accessibility_tags.map((tag) => {
            const info = accessibilityLabels[tag];
            if (!info) return null;
            return (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs text-gray-700"
              >
                {info.emoji} {info.label}
              </span>
            );
          })}
        </div>

        {/* pickup button */}
        {onPickup && (
          <button
            onClick={onPickup}
            className="w-full bg-teal text-white font-semibold py-3 rounded-xl text-sm hover:bg-teal-dark transition-colors"
          >
            I Can Pick Up
          </button>
        )}
      </div>
    </div>
  );
}
