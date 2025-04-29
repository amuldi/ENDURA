// App.jsx - 하단 탭 네비 + 다크모드 자동 감지 포함 전체 코드
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import OneRM from "./OneRM";
import Zone from "./Zone";
import Dashboard from "./Dashboard";
import Insight from "./Insight";

function Navigation() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111] border-t shadow-md flex justify-around items-center h-14 text-sm sm:text-base">
      <Link to="/" className={`${isActive("/") ? "text-black dark:text-white font-bold" : "text-gray-500 dark:text-gray-400"}`}>대시보드</Link>
      <Link to="/onerm" className={`${isActive("/onerm") ? "text-black dark:text-white font-bold" : "text-gray-500 dark:text-gray-400"}`}>1RM</Link>
      <Link to="/zone" className={`${isActive("/zone") ? "text-black dark:text-white font-bold" : "text-gray-500 dark:text-gray-400"}`}>Zone</Link>
      <Link to="/insight" className={`${isActive("/insight") ? "text-black dark:text-white font-bold" : "text-gray-500 dark:text-gray-400"}`}>분석</Link>
    </nav>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const matchDark = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setIsDarkMode(matchDark.matches);
    updateTheme();
    matchDark.addEventListener("change", updateTheme);
    return () => matchDark.removeEventListener("change", updateTheme);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <Router>
      <div className="pb-16 min-h-screen bg-white dark:bg-[#111] text-black dark:text-white max-w-md mx-auto">
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
