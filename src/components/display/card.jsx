import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-quiz-light-gray p-5 rounded-lg border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;