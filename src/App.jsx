import React, { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import OneRM from "./OneRM";
import Zone2 from "./Zone2";

function App() {
  const [activeTab, setActiveTab] = useState("1rm");
  const [darkMode, setDarkMode] = useState(false);

  // 다크모드 자동 감지
  useEffect(() => {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(isDark);

    const listener = (e) => setDarkMode(e.matches);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', listener);

    return () => {
      window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', listener);
    };
  }, []);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (activeTab === "1rm") setActiveTab("zone2");
    },
    onSwipedRight: () => {
      if (activeTab === "zone2") setActiveTab("1rm");
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div
      {...handlers}
      className={`min-h-screen ${darkMode ? "bg-[#121212] text-white" : "bg-[#FAFAFA] text-black"} px-4 py-6 transition-colors duration-300`}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("1rm")}
            className={`px-6 py-2 rounded-full border font-semibold transition duration-300 active:scale-95 ${
              activeTab === "1rm"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-400 hover:bg-gray-200"
            }`}
          >
            1RM
          </button>
          <button
            onClick={() => setActiveTab("zone2")}
            className={`px-6 py-2 rounded-full border font-semibold transition duration-300 active:scale-95 ${
              activeTab === "zone2"
                ? "bg-black text-white border-black"
                : "bg-white text-black border-gray-400 hover:bg-gray-200"
            }`}
          >
            Zone 2
          </button>
        </div>

        {activeTab === "1rm" ? <OneRM /> : <Zone2 />}
      </div>
    </div>
  );
}

export default App;
