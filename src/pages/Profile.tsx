import { useState } from "react";
import { mockUser } from "../lib/mockData";

export default function Profile() {
  const [user, setUser] = useState(mockUser);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* teal header with avatar */}
      <header className="bg-teal px-4 pt-10 pb-8 flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-white/20 border-3 border-white flex items-center justify-center text-3xl mb-3">
          👤
        </div>
        <h2 className="text-white font-bold text-lg">{user.name}</h2>
      </header>

      {/* stats row */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex justify-around">
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{user.points}</p>
            <p className="text-xs text-gray-500">Points</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{user.pickups}</p>
            <p className="text-xs text-gray-500">Pickups</p>
          </div>
          <div className="text-center">
            <p className="text-xl font-bold text-gray-900">{user.lbs_saved}</p>
            <p className="text-xs text-gray-500">lbs saved</p>
          </div>
        </div>
      </div>

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
              value={user.name}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Email</label>
            <input
              type="email"
              value={user.email}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Phone</label>
            <input
              type="tel"
              value={user.phone}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Zip Code</label>
            <input
              type="text"
              value={user.zip_code}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, zip_code: e.target.value }))
              }
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-teal"
            />
          </div>
        </div>

        {/* accessibility settings */}
        <div className="bg-white rounded-2xl shadow-sm p-4 space-y-4">
          <h3 className="font-semibold text-gray-900">
            ⚙️ Accessibility Settings
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">High Contrast Mode</span>
            <button
              onClick={() =>
                setUser((prev) => ({
                  ...prev,
                  high_contrast: !prev.high_contrast,
                }))
              }
              className={`w-12 h-7 rounded-full transition-colors relative ${
                user.high_contrast ? "bg-teal" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  user.high_contrast ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
