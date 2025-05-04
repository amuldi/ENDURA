// App.jsx - keen-slider + React Router + SplashScreen 적용
import React, { useEffect, useState } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import OneRM from "./OneRM";
import Zone from "./Zone";
import Dashboard from "./Dashboard";
import Insight from "./Insight";
import SplashScreen from "./SplashScreen";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

function SliderApp() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    loop: false,
  });

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
      <div ref={sliderRef} className="keen-slider min-h-[calc(100vh-5rem)]">
        {screens.map((s, idx) => (
          <div key={s.name} className="keen-slider__slide p-4">{s.component}</div>
        ))}
      </div>

      {/* 하단 네비게이션 */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-700 shadow-[0_-1px_4px_rgba(0,0,0,0.05)] flex justify-around items-center h-20 text-sm sm:text-base md:text-lg px-2">
        {screens.map((s, idx) => (
          <button
            key={s.name}
            onClick={() => instanceRef.current?.moveToIdx(idx)}
            className={`flex-1 text-center transition-all ${currentSlide === idx ? "text-[#111] dark:text-white font-semibold" : "text-gray-500 dark:text-gray-400"}`}
          >
            {s.name}
          </button>
        ))}
      </nav>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<SliderApp />} />
        <Route path="/one-rm" element={<OneRM />} />
        <Route path="/zone" element={<Zone />} />
        <Route path="/insight" element={<Insight />} />
      </Routes>
    </Router>
  );
}

export default App;