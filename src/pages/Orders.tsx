import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  fetchMyPickupRequests,
  fetchMyListings,
  fetchPickupRequestsForListing,
  updatePickupRequest,
  updateListing,
  completeSwap,
} from "../lib/api";
import type { FoodListing, PickupRequest } from "../types";

type Tab = "pickups" | "listings";

export default function Orders() {
  const { user, refreshProfile } = useAuth();
  const [tab, setTab] = useState<Tab>("pickups");
  const [myPickups, setMyPickups] = useState<
    (PickupRequest & { listing: FoodListing })[]
  >([]);
  const [myListings, setMyListings] = useState<
    (FoodListing & { requests?: PickupRequest[] })[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, tab]);

  async function loadData() {
    if (!user) return;
    setLoading(true);

    if (tab === "pickups") {
      const { data } = await fetchMyPickupRequests(user.id);
      setMyPickups(data || []);
    } else {
      const { data } = await fetchMyListings(user.id);
      const listings = (data || []) as FoodListing[];

      // load pickup requests for each listing
      const withRequests = await Promise.all(
        listings.map(async (listing) => {
          const { data: requests } = await fetchPickupRequestsForListing(
            listing.id,
          );
          return { ...listing, requests: (requests || []) as PickupRequest[] };
        }),
      );
      setMyListings(withRequests);
    }

    setLoading(false);
  }

  async function handleConfirmRequest(requestId: string) {
    await updatePickupRequest(requestId, { status: "confirmed" });
    loadData();
  }

  async function handleCompletePickup(
    pickup: PickupRequest & { listing: FoodListing },
  ) {
    if (!user) return;
    await completeSwap({
      listing_id: pickup.listing_id,
      poster_id: pickup.listing.poster_id,
      picker_id: user.id,
    });
    await refreshProfile();
    loadData();
  }

  async function handleCancelListing(listingId: string) {
    await updateListing(listingId, { status: "expired" });
    loadData();
  }

  const statusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-teal/10 text-teal",
      completed: "bg-green-100 text-green-700",
      cancelled: "bg-gray-100 text-gray-500",
      available: "bg-teal/10 text-teal",
      reserved: "bg-blue-100 text-blue-700",
      expired: "bg-gray-100 text-gray-500",
    };
    return (
      <span
        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${colors[status] || "bg-gray-100 text-gray-500"}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-full bg-teal">
      <header className="px-5 pt-14 pb-6 shrink-0">
        <h1 className="text-center text-white font-bold text-xl">My Orders</h1>
      </header>

      {/* tabs + content in cream area */}
      <div className="flex-1 bg-cream rounded-t-4xl px-4 pt-5 pb-6 flex flex-col">
        <div className="flex bg-white rounded-xl overflow-hidden shadow-sm shadow-black/5 shrink-0">
          <button
            onClick={() => setTab("pickups")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "pickups"
                ? "border-teal text-teal"
                : "border-transparent text-gray-500"
            }`}
          >
            My Pickups
          </button>
          <button
            onClick={() => setTab("listings")}
            className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
              tab === "listings"
                ? "border-teal text-teal"
                : "border-transparent text-gray-500"
            }`}
          >
            My Listings
          </button>
        </div>

        <div className="flex-1 pt-3 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              Loading...
            </div>
          ) : tab === "pickups" ? (
            myPickups.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">
                <p className="text-3xl mb-2">📦</p>
                No pickups yet. Browse the feed to find food!
              </div>
            ) : (
              myPickups.map((pickup) => (
                <div
                  key={pickup.id}
                  className="bg-white rounded-2xl p-4 shadow-sm space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {pickup.listing?.food_type === "produce"
                        ? "🥬"
                        : pickup.listing?.food_type === "baked"
                          ? "🥖"
                          : pickup.listing?.food_type === "prepared"
                            ? "🍕"
                            : "🥫"}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-sm">
                        {pickup.listing?.title || "Food Listing"}
                      </p>
                      <p className="text-xs text-gray-500">
                        Pickup: {new Date(pickup.pickup_time).toLocaleString()}
                      </p>
                    </div>
                    {statusBadge(pickup.status)}
                  </div>

                  {pickup.listing?.location_name && (
                    <p className="text-sm text-teal font-medium">
                      📍 {pickup.listing.location_name}
                    </p>
                  )}

                  {pickup.status === "confirmed" && (
                    <button
                      onClick={() => handleCompletePickup(pickup)}
                      className="w-full bg-teal text-white font-semibold py-3 rounded-xl text-sm hover:bg-teal-dark transition-colors"
                    >
                      Confirm I Picked Up
                    </button>
                  )}
                </div>
              ))
            )
          ) : myListings.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              <p className="text-3xl mb-2">🍽️</p>
              No listings yet. Tap "Give Food" to share!
            </div>
          ) : (
            myListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white rounded-2xl p-4 shadow-sm space-y-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {listing.food_type === "produce"
                      ? "🥬"
                      : listing.food_type === "baked"
                        ? "🥖"
                        : listing.food_type === "prepared"
                          ? "🍕"
                          : "🥫"}
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-sm">
                      {listing.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      📍 {listing.location_name}
                    </p>
                  </div>
                  {statusBadge(listing.status)}
                </div>

                {/* pending pickup requests */}
                {listing.requests &&
                  listing.requests.length > 0 &&
                  listing.status === "available" && (
                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-gray-600">
                        Pickup Requests:
                      </p>
                      {listing.requests
                        .filter((r) => r.status === "pending")
                        .map((req) => (
                          <div
                            key={req.id}
                            className="flex items-center justify-between p-2 bg-cream rounded-lg"
                          >
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                {(
                                  req as unknown as {
                                    requester?: { name?: string };
                                  }
                                ).requester?.name || "User"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(req.pickup_time).toLocaleString()}
                              </p>
                            </div>
                            <button
                              onClick={() => handleConfirmRequest(req.id)}
                              className="bg-teal text-white text-xs font-semibold px-3 py-1.5 rounded-lg"
                            >
                              Confirm
                            </button>
                          </div>
                        ))}
                    </div>
                  )}

                {listing.status === "available" && (
                  <button
                    onClick={() => handleCancelListing(listing.id)}
                    className="w-full border border-gray-300 text-gray-600 font-medium py-2 rounded-xl text-sm"
                  >
                    Cancel Listing
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
