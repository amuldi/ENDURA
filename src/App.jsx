import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import OneRM from "./pages/OneRM";
import Insight from "./pages/Insight";
import SplashScreen from "./SplashScreen";
import BottomNav from "./BottomNav";

function AppRoutes() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Splash 후 /dashboard로 이동
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <>
      <BottomNav />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/one-rm" element={<OneRM />} />
        <Route path="/insight" element={<Insight />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </>
  );
}

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 다크모드 감지
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    const handler = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [isDarkMode]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white pb-28">
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
}
