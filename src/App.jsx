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
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";

// SliderApp은 추후 사용 가능
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

// Splash → 자동 이동 → 라우팅 구성
function AppRoutes() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      navigate("/dashboard");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    // 로딩 화면은 여백 없이 꽉 채우기
    return <SplashScreen />;
  }

  // 실제 페이지만 하단 여백 확보
  return (
    <div className="pb-28">
      <BottomNav />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/one-rm" element={<OneRM />} />
        <Route path="/zone" element={<Zone />} />
        <Route path="/insight" element={<Insight />} />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}


function App() {
  return (
    <div className="w-full overflow-x-hidden min-h-screen bg-[#f9f9f9] dark:bg-[#111] text-[#111] dark:text-white pb-28">
    <Router>
      <AppRoutes />
    </Router>
  </div>
  
  );
}

export default App;
