// App.jsx - keen-slider + React Router + SplashScreen + BottomNav 항상 표시
import React, { useEffect, useState } from "react";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import OneRM from "./pages/OneRM";
import Zone from "./pages/Zone";
import Dashboard from "./pages/Dashboard";
import Insight from "./pages/Insight";
import SplashScreen from "./SplashScreen";
import BottomNav from "./BottomNav";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

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
    <div className="min-h-screen pb-20 bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white transition-colors duration-300">
      <div ref={sliderRef} className="keen-slider min-h-[calc(100vh-5rem)]">
        {screens.map((s, idx) => (
          <div key={s.name} className="keen-slider__slide p-4">{s.component}</div>
        ))}
      </div>
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
      <div className="min-h-screen pb-20 bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white transition-colors duration-300">
        <Routes>
          <Route path="/" element={<SliderApp />} />
          <Route path="/one-rm" element={<OneRM />} />
          <Route path="/zone" element={<Zone />} />
          <Route path="/insight" element={<Insight />} />
        </Routes>
        <BottomNav />
      </div>
    </Router>
  );
}

export default App;