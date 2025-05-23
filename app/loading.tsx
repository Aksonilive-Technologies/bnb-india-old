// components/LoadingDots.tsx
import React from "react";

import "@/styles/loadingDots.css"; // Import the CSS file for styles

const LoadingDots: React.FC = () => {
  return (
    <div className="flex flex-col gap-6 items-center justify-center h-screen">
      <div className="loading-dots">
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
      </div>
      <p>loading...</p>
    </div>
  );
};

export default LoadingDots;
