import React from 'react';

interface ProgressIndicatorProps {
  value: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export const ProgressIndicator: React.FC<ProgressIndicatorProps> = ({
  value,
  size = 'md',
  showValue = false,
  className = '',
}) => {
  // Ensure value is between 0 and 100
  const normalizedValue = Math.min(100, Math.max(0, value));
  
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full bg-neutral-200 rounded-full overflow-hidden">
        <div
          className={`bg-primary ${sizeStyles[size]}`}
          style={{ width: `${normalizedValue}%` }}
        ></div>
      </div>
      
      {showValue && (
        <div className="mt-1 text-xs text-neutral-700 text-right">
          {normalizedValue}%
        </div>
      )}
    </div>
  );
};