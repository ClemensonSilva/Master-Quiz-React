import React from 'react';

const ProgressBar = ({ progress }) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
      <div 
        className="bg-quiz-progress h-2 rounded-full transition-all duration-300" 
        style={{ width: `${safeProgress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;