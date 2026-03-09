import { useState } from "react";
import FilterChip from "./FilterChip";
import {
  ACCESSIBILITY_OPTIONS,
  TIME_OPTIONS,
  type AccessibilityTag,
  type FoodType,
  type TimeRemaining,
  type FilterState,
} from "../types";

const FOOD_FILTER_OPTIONS: { type: FoodType; label: string; emoji: string }[] =
  [
    { type: "produce", label: "Produce", emoji: "🥬" },
    { type: "baked", label: "Baked", emoji: "🥐" },
    { type: "prepared", label: "Prepared", emoji: "🍕" },
    { type: "packaged", label: "Packaged", emoji: "🥫" },
  ];

interface FilterPanelProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClose: () => void;
}

export default function FilterPanel({
  filters,
  onFiltersChange,
  onClose,
}: FilterPanelProps) {
  const [local, setLocal] = useState<FilterState>(filters);

  function toggleAccessibility(tag: AccessibilityTag) {
    setLocal((prev) => ({
      ...prev,
      accessibility: prev.accessibility.includes(tag)
        ? prev.accessibility.filter((t) => t !== tag)
        : [...prev.accessibility, tag],
    }));
  }

  function toggleFoodType(type: FoodType) {
    setLocal((prev) => ({
      ...prev,
      foodType: prev.foodType.includes(type)
        ? prev.foodType.filter((t) => t !== type)
        : [...prev.foodType, type],
    }));
  }

  function toggleTime(value: TimeRemaining) {
    setLocal((prev) => ({
      ...prev,
      timeRemaining: prev.timeRemaining.includes(value)
        ? prev.timeRemaining.filter((t) => t !== value)
        : [...prev.timeRemaining, value],
    }));
  }

  function apply() {
    onFiltersChange(local);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md mx-auto bg-white rounded-t-3xl p-6 space-y-6 max-h-[85vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900">🔍 Filter Listings</h2>

        {/* distance */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Distance
          </label>
          <input
            type="range"
            min={1}
            max={10}
            value={local.distance}
            onChange={(e) =>
              setLocal((prev) => ({
                ...prev,
                distance: Number(e.target.value),
              }))
            }
            className="w-full accent-blue-500"
          />
          <p className="text-sm text-gray-500">Within {local.distance} miles</p>
        </div>

        {/* accessibility */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Accessibility
          </label>
          <div className="flex flex-wrap gap-2">
            {ACCESSIBILITY_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.tag}
                emoji={opt.emoji}
                label={opt.label}
                selected={local.accessibility.includes(opt.tag)}
                onClick={() => toggleAccessibility(opt.tag)}
              />
            ))}
          </div>
        </div>

        {/* food type */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Food Type
          </label>
          <div className="flex flex-wrap gap-2">
            {FOOD_FILTER_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.type}
                emoji={opt.emoji}
                label={opt.label}
                selected={local.foodType.includes(opt.type)}
                onClick={() => toggleFoodType(opt.type)}
              />
            ))}
          </div>
        </div>

        {/* time remaining */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">
            Time Remaining
          </label>
          <div className="flex flex-wrap gap-2">
            {TIME_OPTIONS.map((opt) => (
              <FilterChip
                key={opt.value}
                emoji={opt.emoji}
                label={opt.label}
                selected={local.timeRemaining.includes(opt.value)}
                onClick={() => toggleTime(opt.value)}
              />
            ))}
          </div>
        </div>

        {/* apply button */}
        <button
          onClick={apply}
          className="w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal-dark transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
