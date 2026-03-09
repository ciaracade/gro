export type FoodType =
  | "produce"
  | "baked"
  | "prepared"
  | "packaged"
  | "dairy"
  | "meals"
  | "beverages"
  | "snacks";

export type AccessibilityTag = "wheelchair" | "parking" | "transit" | "covered";

export type TimeRemaining = "under1hr" | "1to3hrs" | "3plus";

export interface FoodListing {
  id: string;
  title: string;
  description: string;
  photo_url?: string;
  food_type: FoodType;
  emoji: string;
  location_name: string;
  location_lat?: number;
  location_lng?: number;
  distance?: string;
  accessibility_tags: AccessibilityTag[];
  available_from: string;
  available_until: string;
  minutes_remaining?: number;
  poster_id: string;
  poster_name?: string;
  status: "available" | "reserved" | "completed" | "expired";
  created_at: string;
}

export interface PickupRequest {
  id: string;
  listing_id: string;
  requester_id: string;
  pickup_time: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  created_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  zip_code: string;
  avatar_url?: string;
  points: number;
  pickups: number;
  lbs_saved: number;
  high_contrast: boolean;
  created_at: string;
}

export interface FilterState {
  distance: number;
  accessibility: AccessibilityTag[];
  foodType: FoodType[];
  timeRemaining: TimeRemaining[];
}

export const FOOD_CATEGORIES: {
  type: FoodType;
  label: string;
  emoji: string;
}[] = [
  { type: "produce", label: "Fresh Produce", emoji: "🥬" },
  { type: "baked", label: "Baked Goods", emoji: "🥖" },
  { type: "prepared", label: "Prepared Food", emoji: "🍕" },
  { type: "packaged", label: "Packaged Food", emoji: "🥫" },
  { type: "dairy", label: "Dairy", emoji: "🥛" },
  { type: "meals", label: "Meals", emoji: "🍱" },
  { type: "beverages", label: "Beverages", emoji: "🧃" },
  { type: "snacks", label: "Snacks", emoji: "🍪" },
];

export const ACCESSIBILITY_OPTIONS: {
  tag: AccessibilityTag;
  label: string;
  emoji: string;
}[] = [
  { tag: "wheelchair", label: "Wheelchair", emoji: "♿" },
  { tag: "parking", label: "Parking", emoji: "🅿️" },
  { tag: "transit", label: "Transit", emoji: "🚌" },
  { tag: "covered", label: "Covered", emoji: "☂️" },
];

export const TIME_OPTIONS: {
  value: TimeRemaining;
  label: string;
  emoji: string;
}[] = [
  { value: "under1hr", label: "Under 1hr", emoji: "⏰" },
  { value: "1to3hrs", label: "1-3 hrs", emoji: "⏰" },
  { value: "3plus", label: "3+ hrs", emoji: "⏰" },
];
