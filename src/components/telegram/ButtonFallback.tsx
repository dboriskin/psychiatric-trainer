import React from 'react';
import { useTelegram } from './TelegramProvider';

// Компонент для отображения стандартных кнопок, когда Telegram кнопки недоступны
interface ButtonFallbackProps {
  mainButtonText?: string;
  onMainButtonClick?: () => void;
  onBackButtonClick?: () => void;
  showBackButton?: boolean;
}

export const ButtonFallback: React.FC<ButtonFallbackProps> = ({
  mainButtonText = 'Продолжить',
  onMainButtonClick,
  onBackButtonClick,
  showBackButton = true
}) => {
  // Всегда показываем кнопки в режиме разработки
  const showButtons = process.env.NODE_ENV === 'development';
  
  if (!showButtons) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 flex justify-between z-40">
      {showBackButton && (
        <button
          className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg"
          onClick={onBackButtonClick}
        >
          Назад
        </button>
      )}
      
      <button
        className="bg-primary text-white py-2 px-6 rounded-lg ml-auto"
        onClick={onMainButtonClick}
      >
        {mainButtonText}
      </button>
    </div>
  );
};