// App.jsx - 모바일 스와이프 네비게이션 + 다크모드 자동 감지
import React, { useEffect, useState } from "react";
import SwipeableViews from "react-swipeable-views";
import OneRM from "./OneRM";
import Zone from "./Zone";
import Dashboard from "./Dashboard";
import Insight from "./Insight";

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [pageIndex, setPageIndex] = useState(0);

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

  const screens = [
    { name: "대시보드", component: <Dashboard /> },
    { name: "1RM", component: <OneRM /> },
    { name: "Zone", component: <Zone /> },
    { name: "분석", component: <Insight /> },
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white transition-colors duration-300">
      <SwipeableViews
        index={pageIndex}
        onChangeIndex={setPageIndex}
        className="min-h-[calc(100vh-3.5rem)]"
      >
        {screens.map((s, idx) => (
          <div key={idx} className="min-h-[calc(100vh-3.5rem)]">{s.component}</div>
        ))}
      </SwipeableViews>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-700 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] flex justify-around items-center h-20 text-sm sm:text-base md:text-lg px-2">

        {screens.map((s, idx) => (
          <button
            key={s.name}
            onClick={() => setPageIndex(idx)}
            className={`flex-1 text-center transition-all ${pageIndex === idx ? "text-[#111] dark:text-white font-semibold" : "text-gray-500 dark:text-gray-400"}`}
          >
            {s.name}
          </button>
        ))}
      </nav>
    </div>
  );
}

export default App;
