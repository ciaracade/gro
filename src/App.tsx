import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Splash from "./pages/Splash";
import Home from "./pages/Home";
import GiveFood from "./pages/GiveFood";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* splash has no bottom nav */}
        <Route path="/" element={<Splash />} />

        {/* main app with bottom nav */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/give" element={<GiveFood />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
