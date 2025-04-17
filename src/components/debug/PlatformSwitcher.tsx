import React, { useEffect, useState } from 'react';
import { useTelegram } from '../telegram/TelegramProvider';
import { useTelegramStore } from '../../store/telegramStore';

/**
 * Компонент для переключения эмулируемой платформы в режиме отладки
 */
export const PlatformSwitcher: React.FC = () => {
  const { isMocked } = useTelegram();
  const { platform, setPlatform } = useTelegramStore();
  const [showPanel, setShowPanel] = useState(false);
  
  // Показываем переключатель только в режиме разработки и если используется мок
  if (process.env.NODE_ENV !== 'development' || !isMocked) {
    return null;
  }

  const switchPlatform = (newPlatform: string) => {
    if (platform === newPlatform) return; // Не делаем ничего, если платформа не изменилась
    
    // Устанавливаем новую платформу и запрашиваем перезагрузку
    setPlatform(newPlatform, true);
    // Не нужно вызывать перезагрузку здесь, она будет вызвана в setPlatform
  };

  return (
    <>
      {/* Кнопка для показа/скрытия панели */}
      <button 
        className="fixed right-4 bottom-4 z-50 bg-blue-600 text-white p-2 rounded-full shadow-lg"
        onClick={() => setShowPanel(!showPanel)}
        title="Переключить платформу"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Панель переключения платформы */}
      {showPanel && (
        <div className="fixed right-4 bottom-16 z-50 bg-white p-4 rounded-lg shadow-xl border border-gray-200">
          <h3 className="text-lg font-bold mb-2">Эмулировать платформу</h3>
          <div className="flex flex-col space-y-2">
            <label className="flex items-center space-x-2">
              <input 
                type="radio" 
                name="platform" 
                value="web" 
                checked={platform === 'web'} 
                onChange={() => switchPlatform('web')} 
              />
              <span>Десктоп (web)</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="radio" 
                name="platform" 
                value="android" 
                checked={platform === 'android'} 
                onChange={() => switchPlatform('android')} 
              />
              <span>Android</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="radio" 
                name="platform" 
                value="ios" 
                checked={platform === 'ios'} 
                onChange={() => switchPlatform('ios')} 
              />
              <span>iOS</span>
            </label>
          </div>
          <div className="mt-3 text-xs text-gray-500">
            Текущая платформа: <strong>{platform}</strong>
          </div>
          <div className="mt-1 text-xs text-gray-400">
            После изменения страница перезагрузится
          </div>
        </div>
      )}
    </>
  );
};