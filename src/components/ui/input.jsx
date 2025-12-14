import React from 'react';

const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600 ${className}`}
        {...props}
      />
      {error && <span className="text-red-500 text-xs mt-1">{error}</span>}
    </div>
  );
};

export default Input;