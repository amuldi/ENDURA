// App.jsx - 다크모드 감지 개선 + 여백 제거
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import OneRM from "./OneRM";
import Zone from "./Zone";
import Dashboard from "./Dashboard";
import Insight from "./Insight";

function Navigation() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `${isActive(path) ? "text-[#111] dark:text-white font-semibold" : "text-gray-500 dark:text-gray-400"} transition-all`;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-700 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] flex justify-around items-center h-14 sm:h-16 text-xs sm:text-sm md:text-base backdrop-blur-sm">
      <Link to="/" className={linkClass("/")}>대시보드</Link>
      <Link to="/onerm" className={linkClass("/onerm")}>1RM</Link>
      <Link to="/zone" className={linkClass("/zone")}>Zone</Link>
      <Link to="/insight" className={linkClass("/insight")}>분석</Link>
    </nav>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setIsDarkMode(mediaQuery.matches);
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white max-w-full mx-0 px-0 transition-colors duration-300">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/onerm" element={<OneRM />} />
          <Route path="/zone" element={<Zone />} />
          <Route path="/insight" element={<Insight />} />
        </Routes>
        <Navigation />
      </div>
    </Router>
  );
}

export default App;
