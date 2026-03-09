import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchReputation } from "../lib/api";

export default function Profile() {
  const { profile, updateProfile, signOut } = useAuth();
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(profile?.email || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [zipCode, setZipCode] = useState(profile?.zip_code || "");
  const [highContrast, setHighContrast] = useState(
    profile?.high_contrast || false,
  );
  const [trustScore, setTrustScore] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.phone);
      setZipCode(profile.zip_code);
      setHighContrast(profile.high_contrast);

      fetchReputation(profile.id).then(({ data }) => {
        if (data) setTrustScore(data.trust_score);
      });
    }
  }, [profile]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    await updateProfile({
      name,
      email,
      phone,
      zip_code: zipCode,
      high_contrast: highContrast,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* teal header with avatar */}
      <header className="bg-teal px-4 pt-10 pb-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-white/20 border-3 border-white flex items-center justify-center text-3xl mb-3">
          👤
        </div>
        <h2 className="text-white font-bold text-lg">
          {profile?.name || "User"}
        </h2>
      </header>

      {/* stats row */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex justify-around">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">
              {profile?.points ?? 0}
            </p>
            <p className="text-xs text-gray-500">Points</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">
              {profile?.pickups ?? 0}
            </p>
            <p className="text-xs text-gray-500">Pickups</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">
              {profile?.lbs_saved ?? 0}
            </p>
            <p className="text-xs text-gray-500">lbs saved</p>
          </div>
        </div>
      </div>

      {/* trust score */}
      {trustScore !== null && (
        <div className="px-4 mt-4">
          <div className="bg-white rounded-2xl shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Trust Score</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal rounded-full transition-all"
                  style={{ width: `${Math.round(trustScore * 100)}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-teal">
                {Math.round(trustScore * 100)}%
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Based on your swap history (WBRS)
            </p>
          </div>
        </div>
      )}

      {/* personal info */}
      <div className="px-4 mt-4 space-y-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">
            👤 Personal Information
          </h3>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Zip Code</label>
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-teal text-white font-semibold py-3 rounded-xl hover:bg-teal-dark transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        {/* accessibility settings */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">
            ⚙️ Accessibility Settings
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">High Contrast Mode</span>
            <button
              onClick={() => {
                setHighContrast(!highContrast);
                updateProfile({ high_contrast: !highContrast });
              }}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                highContrast ? "bg-teal" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  highContrast ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>

        {/* sign out */}
        <button
          onClick={signOut}
          className="w-full border border-red-300 text-red-500 font-medium py-3 rounded-xl"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
