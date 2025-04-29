// App.jsx - Insight 탭 추가
import React, { useState, useLayoutEffect } from "react";
import { useSwipeable } from "react-swipeable";
import OneRM from "./OneRM";
import Zone from "./Zone";
import Dashboard from "./Dashboard";
import Insight from "./Insight";

function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [darkMode, setDarkMode] = useState(false);

  useLayoutEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(isDark);

      const listener = (e) => setDarkMode(e.matches);
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);

      return () => {
        window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
      };
    }
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeTab === "dashboard") setActiveTab("1rm");
      else if (activeTab === "1rm") setActiveTab("zone");
      else if (activeTab === "zone") setActiveTab("insight");
    },
    onSwipedRight: () => {
      if (activeTab === "insight") setActiveTab("zone");
      else if (activeTab === "zone") setActiveTab("1rm");
      else if (activeTab === "1rm") setActiveTab("dashboard");
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-[#121212] text-white" : "bg-[#FAFAFA] text-black"
      } px-4 py-6`}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveTab("dashboard")}
            className={`px-6 py-2 rounded-full border font-semibold transition duration-150 active:scale-95 ${
              activeTab === "dashboard"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-400 hover:bg-gray-200"
            }`}
          >
            대시보드
          </button>
          <button
            onClick={() => setActiveTab("1rm")}
            className={`px-6 py-2 rounded-full border font-semibold transition duration-150 active:scale-95 ${
              activeTab === "1rm"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-400 hover:bg-gray-200"
            }`}
          >
            1RM
          </button>
          <button
            onClick={() => setActiveTab("zone")}
            className={`px-6 py-2 rounded-full border font-semibold transition duration-150 active:scale-95 ${
              activeTab === "zone"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-400 hover:bg-gray-200"
            }`}
          >
            Zone
          </button>
          <button
            onClick={() => setActiveTab("insight")}
            className={`px-6 py-2 rounded-full border font-semibold transition duration-150 active:scale-95 ${
              activeTab === "insight"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-400 hover:bg-gray-200"
            }`}
          >
            분석
          </button>
        </div>
        {activeTab === "dashboard" ? (
          <Dashboard />
        ) : activeTab === "1rm" ? (
          <OneRM />
        ) : activeTab === "zone" ? (
          <Zone />
        ) : (
          <Insight />
        )}
      </div>
    </div>
  );
}

export default App;
