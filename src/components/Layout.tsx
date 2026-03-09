import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen bg-cream">
      <div className="flex-1 overflow-y-auto min-h-0">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
