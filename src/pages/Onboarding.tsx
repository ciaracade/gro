import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ACCESSIBILITY_OPTIONS, type AccessibilityTag } from "../types";

const STEPS = ["Welcome", "Name", "Location", "Accessibility"] as const;

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();

  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [accessibilityPrefs, setAccessibilityPrefs] = useState<
    AccessibilityTag[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const currentStep = STEPS[step];
  const progress = ((step + 1) / STEPS.length) * 100;

  function togglePref(tag: AccessibilityTag) {
    setAccessibilityPrefs((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function next() {
    if (step < STEPS.length - 1) setStep(step + 1);
  }

  async function handleFinish() {
    if (!user) return;
    setLoading(true);
    setError("");

    const { error } = await updateProfile({
      name,
      phone: user.phone || "",
      zip_code: zipCode,
      points: 0,
      pickups: 0,
      lbs_saved: 0,
      high_contrast: false,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    navigate("/home");
  }

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* header */}
      <div className="bg-teal px-4 pt-10 pb-4">
        <div className="text-center mb-4">
          <h1 className="font-fredoka text-3xl font-bold text-white">gro!</h1>
        </div>

        {/* progress bar */}
        <div className="h-1 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-white rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* content */}
      <div className="flex-1 px-6 pt-8">
        {currentStep === "Welcome" && (
          <div className="space-y-6 text-center">
            <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 bg-teal/10 rounded-full" />
              <div className="relative z-10 flex flex-col items-center">
                <span className="text-7xl">🧑‍🌾</span>
                <div className="flex gap-2 mt-2">
                  <span className="text-2xl">🌱</span>
                  <span className="text-3xl">🥬</span>
                  <span className="text-2xl">🌿</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome to gro!
              </h2>
              <p className="text-gray-500 mt-2 leading-relaxed">
                Let's set up your profile so you can start sharing food and
                reducing waste in your community.
              </p>
            </div>

            <button
              onClick={next}
              className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl hover:bg-teal-dark transition-colors"
            >
              Let's Get Started
            </button>
          </div>
        )}

        {currentStep === "Name" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                What's your name?
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                This is how other users will see you.
              </p>
            </div>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-teal"
              autoFocus
            />

            <button
              onClick={next}
              disabled={!name.trim()}
              className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === "Location" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Where are you located?
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                We'll use this to show nearby food listings.
              </p>
            </div>

            <input
              type="text"
              value={zipCode}
              onChange={(e) =>
                setZipCode(e.target.value.replace(/\D/g, "").slice(0, 5))
              }
              placeholder="Zip code (e.g. 48104)"
              inputMode="numeric"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-lg focus:outline-none focus:border-teal"
              autoFocus
            />

            <button
              onClick={next}
              disabled={zipCode.length !== 5}
              className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {currentStep === "Accessibility" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Accessibility needs
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Select any that apply to you. We'll prioritize listings that
                match.
              </p>
            </div>

            <div className="space-y-3">
              {ACCESSIBILITY_OPTIONS.map((opt) => (
                <button
                  key={opt.tag}
                  onClick={() => togglePref(opt.tag)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-colors text-left ${
                    accessibilityPrefs.includes(opt.tag)
                      ? "border-teal bg-teal/5"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <span className="text-2xl">{opt.emoji}</span>
                  <span className="font-medium text-gray-700">{opt.label}</span>
                  {accessibilityPrefs.includes(opt.tag) && (
                    <span className="ml-auto text-teal font-bold">✓</span>
                  )}
                </button>
              ))}
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              onClick={handleFinish}
              disabled={loading}
              className="w-full bg-teal text-white font-semibold py-3.5 rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-50"
            >
              {loading ? "Setting up..." : "Finish Setup"}
            </button>

            <button
              onClick={handleFinish}
              disabled={loading}
              className="w-full text-gray-400 text-sm py-2"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
