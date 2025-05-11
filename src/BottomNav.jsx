import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, BarChart2, Activity, TrendingUp } from "lucide-react";

const tabs = [
  { name: "Dashboard", path: "/dashboard", icon: <Home size={20} /> },
  { name: "1RM", path: "/one-rm", icon: <BarChart2 size={20} /> },
  { name: "Insights", path: "/insight", icon: <TrendingUp size={20} /> },
];

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-700 shadow-sm h-20 flex justify-around items-center">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path;
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center text-xs sm:text-sm transition-all ${
              isActive
                ? "text-black-600 dark:text-white-400 font-semibold"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            {tab.icon}
            <span className="mt-1">{tab.name}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNav;
