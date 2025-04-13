import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const baseStyle = 'bg-white rounded-xl shadow-md overflow-hidden';
  const clickableStyle = onClick ? 'cursor-pointer transition-transform hover:scale-[1.02]' : '';
  
  return (
    <div
      className={`${baseStyle} ${clickableStyle} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};
