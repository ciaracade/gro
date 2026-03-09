import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { path: "/home", label: "Home", emoji: "🏠" },
  { path: "/give", label: "Give Food", emoji: "➕" },
  { path: "/orders", label: "My Orders", emoji: "📦" },
  { path: "/profile", label: "Profile", emoji: "👤" },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="sticky bottom-0 bg-white border-t border-gray-100 z-50 safe-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-xl transition-all ${
                isActive ? "text-teal" : "text-gray-400 active:scale-95"
              }`}
            >
              <span
                className={`text-xl transition-transform ${isActive ? "scale-110" : ""}`}
              >
                {tab.emoji}
              </span>
              <span
                className={`text-[10px] font-semibold ${isActive ? "text-teal" : ""}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
