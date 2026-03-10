import { useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import AppShell from "./components/AppShell";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Onboarding from "./pages/Onboarding";
import Home from "./pages/Home";
import GiveFood from "./pages/GiveFood";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

function AuthHashRedirect() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash?.slice(1);
    if (!hash || location.pathname === "/login") return;

    const params = new URLSearchParams(hash);
    if (
      params.has("error") ||
      params.has("error_code") ||
      params.has("error_description")
    ) {
      navigate(`/login${window.location.hash}`, { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthHashRedirect />
        <Routes>
          <Route element={<AppShell />}>
            {/* public routes */}
            <Route path="/" element={<Splash />} />
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* protected routes with bottom nav */}
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route path="/home" element={<Home />} />
              <Route path="/give" element={<GiveFood />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
