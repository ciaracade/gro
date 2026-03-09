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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = location.pathname.startsWith(tab.path);

          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? "text-teal" : "text-gray-400"
              }`}
            >
              <span className="text-xl">{tab.emoji}</span>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
