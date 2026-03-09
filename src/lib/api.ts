import { supabase } from "./supabase";
import type {
  FoodListing,
  PickupRequest,
  AccessibilityTag,
  FoodType,
} from "../types";

// ---- listings ----

export async function fetchListings(filters?: {
  foodType?: FoodType[];
  accessibility?: AccessibilityTag[];
  status?: string;
}) {
  let query = supabase
    .from("listings")
    .select("*, poster:users!poster_id(name)")
    .order("created_at", { ascending: false });

  if (filters?.status) {
    query = query.eq("status", filters.status);
  } else {
    query = query.eq("status", "available");
  }

  if (filters?.foodType && filters.foodType.length > 0) {
    query = query.in("food_type", filters.foodType);
  }

  if (filters?.accessibility && filters.accessibility.length > 0) {
    query = query.overlaps("accessibility_tags", filters.accessibility);
  }

  const { data, error } = await query;

  if (error) return { data: null, error };

  // transform to match FoodListing shape
  const listings: FoodListing[] = (data || []).map(
    (row: Record<string, unknown>) => {
      const now = new Date();
      const until = new Date(row.available_until as string);
      const minutesRemaining = Math.max(
        0,
        Math.round((until.getTime() - now.getTime()) / 60000),
      );

      return {
        id: row.id as string,
        title: row.title as string,
        description: row.description as string,
        photo_url: row.photo_url as string | undefined,
        food_type: row.food_type as FoodType,
        emoji: getCategoryEmoji(row.food_type as FoodType),
        location_name: row.location_name as string,
        location_lat: row.location_lat as number | undefined,
        location_lng: row.location_lng as number | undefined,
        distance: undefined,
        accessibility_tags: (row.accessibility_tags ||
          []) as AccessibilityTag[],
        available_from: row.available_from as string,
        available_until: row.available_until as string,
        minutes_remaining: minutesRemaining,
        poster_id: row.poster_id as string,
        poster_name: (row.poster as Record<string, unknown>)?.name as
          | string
          | undefined,
        status: row.status as FoodListing["status"],
        created_at: row.created_at as string,
      };
    },
  );

  return { data: listings, error: null };
}

export async function fetchMyListings(userId: string) {
  const { data, error } = await supabase
    .from("listings")
    .select("*")
    .eq("poster_id", userId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function createListing(listing: {
  poster_id: string;
  title: string;
  description: string;
  photo_url?: string;
  food_type: FoodType;
  location_name: string;
  location_lat?: number;
  location_lng?: number;
  accessibility_tags: AccessibilityTag[];
  available_from: string;
  available_until: string;
}) {
  const { data, error } = await supabase
    .from("listings")
    .insert(listing)
    .select()
    .single();

  return { data, error };
}

export async function updateListing(
  id: string,
  updates: Partial<{
    title: string;
    description: string;
    photo_url: string;
    food_type: FoodType;
    location_name: string;
    accessibility_tags: AccessibilityTag[];
    available_from: string;
    available_until: string;
    status: string;
  }>,
) {
  const { data, error } = await supabase
    .from("listings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

export async function deleteListing(id: string) {
  const { error } = await supabase.from("listings").delete().eq("id", id);
  return { error };
}

// ---- pickup requests ----

export async function createPickupRequest(request: {
  listing_id: string;
  requester_id: string;
  pickup_time: string;
}) {
  const { data, error } = await supabase
    .from("pickup_requests")
    .insert(request)
    .select()
    .single();

  return { data, error };
}

export async function fetchPickupRequestsForListing(listingId: string) {
  const { data, error } = await supabase
    .from("pickup_requests")
    .select("*, requester:users!requester_id(name)")
    .eq("listing_id", listingId)
    .order("created_at", { ascending: false });

  return { data, error };
}

export async function fetchMyPickupRequests(userId: string) {
  const { data, error } = await supabase
    .from("pickup_requests")
    .select("*, listing:listings!listing_id(*)")
    .eq("requester_id", userId)
    .order("created_at", { ascending: false });

  return {
    data: data as (PickupRequest & { listing: FoodListing })[] | null,
    error,
  };
}

export async function updatePickupRequest(
  id: string,
  updates: { status: PickupRequest["status"] },
) {
  const { data, error } = await supabase
    .from("pickup_requests")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  return { data, error };
}

// ---- swaps (completion) ----

export async function completeSwap(swap: {
  listing_id: string;
  poster_id: string;
  picker_id: string;
  points_awarded?: number;
}) {
  // create swap record (triggers point update)
  const { data, error } = await supabase
    .from("swaps")
    .insert({ points_awarded: 10, ...swap })
    .select()
    .single();

  if (error) return { data: null, error };

  // mark listing as completed
  await supabase
    .from("listings")
    .update({ status: "completed" })
    .eq("id", swap.listing_id);

  // mark the pickup request as completed
  await supabase
    .from("pickup_requests")
    .update({ status: "completed" })
    .eq("listing_id", swap.listing_id)
    .eq("requester_id", swap.picker_id);

  return { data, error: null };
}

// ---- reputation ----

export async function fetchReputation(userId: string) {
  const { data, error } = await supabase
    .from("reputation_scores")
    .select("*")
    .eq("user_id", userId)
    .single();

  return { data, error };
}

// ---- photo upload ----

export async function uploadPhoto(file: File, userId: string) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("listing-photos")
    .upload(path, file);

  if (error) return { url: null, error };

  const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);

  return { url: data.publicUrl, error: null };
}

// helper
function getCategoryEmoji(type: FoodType): string {
  const map: Record<FoodType, string> = {
    produce: "🥬",
    baked: "🥖",
    prepared: "🍕",
    packaged: "🥫",
    dairy: "🥛",
    meals: "🍱",
    beverages: "🧃",
    snacks: "🍪",
  };
  return map[type] || "🍽️";
}
