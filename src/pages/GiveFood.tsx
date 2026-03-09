import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { createListing, uploadPhoto } from "../lib/api";
import {
  FOOD_CATEGORIES,
  ACCESSIBILITY_OPTIONS,
  type FoodType,
  type AccessibilityTag,
} from "../types";

const STEPS = ["What", "Details", "Photo", "When", "Where", "Review"] as const;

export default function GiveFood() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<FoodType | null>(
    null,
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<AccessibilityTag[]>([]);
  const [locationName, setLocationName] = useState("");
  const [availableFrom, setAvailableFrom] = useState("");
  const [availableUntil, setAvailableUntil] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  function toggleTag(tag: AccessibilityTag) {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  function back() {
    if (step > 0) setStep(step - 1);
    else navigate("/home");
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    const reader = new FileReader();
    reader.onload = () => setPhotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handlePost() {
    if (!user || !selectedCategory) return;
    setPosting(true);
    setError("");

    let photoUrl: string | undefined;

    // upload photo if selected
    if (photoFile) {
      const { url, error: uploadError } = await uploadPhoto(photoFile, user.id);
      if (uploadError) {
        setError("Failed to upload photo: " + uploadError.message);
        setPosting(false);
        return;
      }
      photoUrl = url ?? undefined;
    }

    const { error: createError } = await createListing({
      poster_id: user.id,
      title,
      description,
      photo_url: photoUrl,
      food_type: selectedCategory,
      location_name: locationName,
      accessibility_tags: selectedTags,
      available_from: new Date(availableFrom).toISOString(),
      available_until: new Date(availableUntil).toISOString(),
    });

    setPosting(false);

    if (createError) {
      setError(createError.message);
      return;
    }

    navigate("/home");
  }

  return (
    <div className="flex flex-col min-h-full bg-cream">
      {/* teal header */}
      <header className="bg-teal px-5 pt-12 pb-5 rounded-b-4xl shrink-0">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={back}
            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white"
          >
            ←
          </button>
          <h1 className="text-white font-semibold text-lg">Give Food</h1>
          <button
            onClick={() => navigate("/home")}
            className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center text-white"
          >
            ✕
          </button>
        </div>

        <div className="flex gap-1">
          {STEPS.map((s, i) => (
            <button
              key={s}
              onClick={() => i <= step && setStep(i)}
              className={`flex-1 text-xs font-medium pb-2 border-b-2 transition-colors ${
                i === step
                  ? "text-white border-white"
                  : i < step
                    ? "text-white/70 border-white/30"
                    : "text-white/40 border-transparent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-2 h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* step content */}
      <div className="flex-1 p-5">
        {currentStep === "What" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                What food are you sharing?
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Select the type that best describes your food.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {FOOD_CATEGORIES.map((cat) => (
                <button
                  key={cat.type}
                  onClick={() => {
                    setSelectedCategory(cat.type);
                    next();
                  }}
                  className={`bg-white rounded-xl p-5 flex flex-col items-center gap-2 border-2 transition-colors ${
                    selectedCategory === cat.type
                      ? "border-teal bg-teal/5"
                      : "border-gray-100"
                  }`}
                >
                  <span className="text-4xl">{cat.emoji}</span>
                  <span className="text-sm font-medium text-gray-700">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {currentStep === "Details" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Food Details</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Fresh vegetables from garden"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the food, quantity, and any dietary info..."
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal resize-none"
              />
            </div>
            <button
              onClick={next}
              disabled={!title.trim()}
              className="w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === "Photo" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Add a Photo</h2>
            <p className="text-sm text-gray-500">
              Help others see what you're sharing.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
            />

            {photoPreview ? (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Food preview"
                  className="w-full h-48 object-cover rounded-2xl"
                />
                <button
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full text-white flex items-center justify-center text-sm"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-12 flex flex-col items-center gap-3"
              >
                <span className="text-4xl">📷</span>
                <p className="text-sm text-gray-500">Tap to add a photo</p>
              </button>
            )}

            <button
              onClick={next}
              className="w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal-dark transition-colors"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === "When" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Availability Window
            </h2>
            <p className="text-sm text-gray-500">
              When can someone pick this up?
            </p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available from
              </label>
              <input
                type="datetime-local"
                value={availableFrom}
                onChange={(e) => setAvailableFrom(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Available until
              </label>
              <input
                type="datetime-local"
                value={availableUntil}
                onChange={(e) => setAvailableUntil(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <button
              onClick={next}
              disabled={!availableFrom || !availableUntil}
              className="w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === "Where" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Pickup Location</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location name
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="e.g. Main Library front desk"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-teal"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Accessibility
              </label>
              <div className="flex flex-wrap gap-2">
                {ACCESSIBILITY_OPTIONS.map((opt) => (
                  <button
                    key={opt.tag}
                    onClick={() => toggleTag(opt.tag)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedTags.includes(opt.tag)
                        ? "border-teal text-teal bg-teal/5"
                        : "border-gray-300 text-gray-600 bg-white"
                    }`}
                  >
                    {opt.emoji} {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={next}
              disabled={!locationName.trim()}
              className="w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === "Review" && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              Review Your Listing
            </h2>
            <div className="bg-white rounded-2xl p-4 space-y-3 border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">
                  {FOOD_CATEGORIES.find((c) => c.type === selectedCategory)
                    ?.emoji || "🍽️"}
                </span>
                <div>
                  <p className="font-semibold text-gray-900">
                    {title || "Untitled"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {FOOD_CATEGORIES.find((c) => c.type === selectedCategory)
                      ?.label || "Food"}
                  </p>
                </div>
              </div>
              {photoPreview && (
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded-xl"
                />
              )}
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}
              {locationName && (
                <p className="text-sm text-teal font-medium">
                  📍 {locationName}
                </p>
              )}
              {selectedTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedTags.map((tag) => {
                    const opt = ACCESSIBILITY_OPTIONS.find(
                      (o) => o.tag === tag,
                    );
                    return (
                      <span
                        key={tag}
                        className="text-xs bg-gray-50 border border-gray-200 rounded-full px-2.5 py-1"
                      >
                        {opt?.emoji} {opt?.label}
                      </span>
                    );
                  })}
                </div>
              )}
              {availableFrom && availableUntil && (
                <p className="text-xs text-gray-500">
                  Available: {new Date(availableFrom).toLocaleString()} -{" "}
                  {new Date(availableUntil).toLocaleString()}
                </p>
              )}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handlePost}
              disabled={posting}
              className="w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {posting ? "Posting..." : "Post Listing"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
