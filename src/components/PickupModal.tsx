import { useState } from "react";
import type { FoodListing } from "../types";
import { useAuth } from "../hooks/useAuth";
import { createPickupRequest } from "../lib/api";

interface PickupModalProps {
  listing: FoodListing;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PickupModal({
  listing,
  onClose,
  onSuccess,
}: PickupModalProps) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"now" | "schedule">("now");
  const [pickupTime, setPickupTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRequest() {
    if (!user) return;
    setLoading(true);
    setError("");

    const time =
      mode === "now"
        ? new Date().toISOString()
        : new Date(pickupTime).toISOString();

    const { error } = await createPickupRequest({
      listing_id: listing.id,
      requester_id: user.id,
      pickup_time: time,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    onSuccess();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-[430px] bg-white rounded-t-3xl p-6 space-y-5">
        <h2 className="text-lg font-bold text-gray-900">Schedule Pickup</h2>

        {/* listing summary */}
        <div className="flex items-center gap-3 p-3 bg-cream rounded-xl">
          <span className="text-3xl">{listing.emoji}</span>
          <div>
            <p className="font-semibold text-gray-900 text-sm">
              {listing.title}
            </p>
            <p className="text-xs text-teal">📍 {listing.location_name}</p>
          </div>
        </div>

        {/* pickup time options */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">
            When do you want to pick up?
          </p>

          <button
            onClick={() => setMode("now")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors text-left ${
              mode === "now" ? "border-teal bg-teal/5" : "border-gray-200"
            }`}
          >
            <span className="text-xl">⚡</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">Pick up now</p>
              <p className="text-xs text-gray-500">
                I'm heading there right away
              </p>
            </div>
          </button>

          <button
            onClick={() => setMode("schedule")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors text-left ${
              mode === "schedule" ? "border-teal bg-teal/5" : "border-gray-200"
            }`}
          >
            <span className="text-xl">🕐</span>
            <div>
              <p className="font-medium text-gray-900 text-sm">
                Hold for 15 minutes
              </p>
              <p className="text-xs text-gray-500">
                Reserve and pick up within the window
              </p>
            </div>
          </button>

          {mode === "schedule" && (
            <div>
              <label className="block text-xs text-gray-500 mb-1">
                Pick a time
              </label>
              <input
                type="datetime-local"
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                min={listing.available_from?.slice(0, 16)}
                max={listing.available_until?.slice(0, 16)}
                className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal"
              />
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={handleRequest}
          disabled={loading || (mode === "schedule" && !pickupTime)}
          className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-50"
        >
          {loading ? "Requesting..." : "Confirm Pickup"}
        </button>
      </div>
    </div>
  );
}
