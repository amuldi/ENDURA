// src/components/BottomNav.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const screens = [
  { name: "Dashboard", path: "/" },
  { name: "1RM", path: "/one-rm" },
  { name: "Zone", path: "/zone" },
  { name: "Insights", path: "/insight" },
];

function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-700 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] flex justify-around items-center h-20 text-sm sm:text-base md:text-lg px-2">
      {screens.map((s) => (
        <button
          key={s.name}
          onClick={() => navigate(s.path)}
          className={`flex-1 text-center transition-all ${
            location.pathname === s.path
              ? "text-[#111] dark:text-white font-semibold"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {s.name}
        </button>
      ))}
    </nav>
  );
}

export default BottomNav;
