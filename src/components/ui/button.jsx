import React from 'react';

const Button = ({ 
  children, 
  onClick = () => {},
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const baseStyles = "font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center";
  
  const variants = {
    primary: "bg-quiz-dark text-white hover:bg-gray-800",
    purple: "bg-quiz-purple text-white hover:bg-purple-700",
    outline: "bg-white text-black border border-gray-200 hover:bg-gray-100",
    danger: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    sm: "text-xs py-1 px-3",
    md: "text-sm py-2 px-4",
    lg: "text-base py-3 px-6",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
      {...props}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;