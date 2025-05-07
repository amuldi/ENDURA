// src/components/SplashScreen.jsx
import React from "react";

function SplashScreen() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-black dark:bg-[#000000] text-black dark:text-white">
      <img
        src="/apple-touch-icon.png"
        alt="SU'REN Logo"
        className="w-48 h-48" // 192px × 192px
      />
    </div>
  );
}

export default SplashScreen;
