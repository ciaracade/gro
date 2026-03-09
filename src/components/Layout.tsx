import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";

export default function Layout() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-cream relative">
      <Outlet />
      <BottomNav />
    </div>
  );
}
