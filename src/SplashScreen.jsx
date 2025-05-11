// src/components/SplashScreen.jsx
import React from "react";

function SplashScreen() {
  return (
    <div
      className="fixed inset-0 bg-black text-white flex items-center justify-center z-50"
    >
      <img
        src="/apple-touch-icon.png"
        alt="SU'REN Logo"
        className="w-48 h-48" // 192px × 192px
      />
    </div>
  );
}

export default SplashScreen;
