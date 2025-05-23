import React from 'react';

interface CircularRatingProps {
  value: number; // Rating value (e.g., 4.4)
  text: string;  // Text label (e.g., "Sound Quality")
}

const CircularRating: React.FC<CircularRatingProps> = ({ value, text }) => {
  // Convert rating value to percentage (out of 100 for circle progress)
  const radius = 25; // Radius of the circle
  const strokeWidth = 6; // Width of the circle stroke
  const circumference = 2 * Math.PI * radius; // Total circumference of the circle
  const percentage = (value / 5) * 100; // Assuming the rating is out of 5

  return (
    <div className="flex items-center">
      <svg className="w-20 h-20">
        {/* Background circle */}
        <circle
          className="text-gray-300"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        {/* Progress circle */}
        <circle
          className="text-green-500"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - (percentage / 100) * circumference}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="50%"
          cy="50%"
        />
        {/* Text in the center of the circle */}
        <text
          x="50%"
          y="50%"
          dominantBaseline="middle"
          textAnchor="middle"
          className="text-lg font-semibold fill-black"
        >
          {value.toFixed(1)}
        </text>
      </svg>
      {/* Label below the circle */}
      <p className="mt-2 text-md font-semibold">{text}</p>
    </div>
  );
};

export default CircularRating;
