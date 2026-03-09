import { Outlet } from "react-router-dom";

export default function AppShell() {
  return (
    <div className="app-shell">
      <Outlet />
    </div>
  );
}
