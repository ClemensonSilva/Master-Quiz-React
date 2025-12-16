import React from 'react';

export default function DonutChart({ percentage }) {
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="50" stroke="#E5E7EB" strokeWidth="12" fill="transparent" />
        <circle 
          cx="60" cy="60" r="50" stroke="#3B82F6" strokeWidth="12" fill="transparent"
          strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <span className="absolute text-2xl font-bold text-gray-700">{percentage}%</span>
    </div>
  );
}