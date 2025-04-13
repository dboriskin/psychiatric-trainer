import React from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  rightElement?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  rightElement,
}) => {
  return (
    <header className="bg-primary text-white p-4 shadow-md">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          {subtitle && <p className="text-sm text-white/80">{subtitle}</p>}
        </div>
        {rightElement && (
          <div>{rightElement}</div>
        )}
      </div>
    </header>
  );
};