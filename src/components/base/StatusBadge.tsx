import React from 'react';

type BadgeVariant = 'success' | 'info' | 'warning' | 'error' | 'neutral';

interface StatusBadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  variant = 'neutral',
  className = '',
}) => {
  const baseStyle = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-success/20 text-success',
    info: 'bg-primary/20 text-primary',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    neutral: 'bg-neutral-100 text-neutral-700',
  };
  
  return (
    <span className={`${baseStyle} ${variantStyles[variant]} ${className}`}>
      {label}
    </span>
  );
};