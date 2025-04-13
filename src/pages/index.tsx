import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import { useTelegram, TelegramMainButton, TelegramDebugPanel } from '../components/telegram';
import { Header, LoadingSpinner } from '../components/base';
import { useTelegramStore } from '../store';

const Home: NextPage = () => {
  const { webApp, isReady } = useTelegram();
  const { isMocked } = useTelegramStore();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    // Set the background color to match the Telegram theme
    if (webApp && webApp.themeParams) {
      document.body.style.backgroundColor = webApp.themeParams.bg_color || '#f5f5f5';
    }
  }, [webApp]);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <Header 
        title="Психиатрический тренажер" 
        subtitle="Практические навыки диагностики"
        rightElement={
          process.env.NODE_ENV === 'development' && (
            <button 
              onClick={() => setShowDebug(!showDebug)}
              className="text-white text-sm bg-white/20 rounded px-2 py-1"
            >
              {showDebug ? 'Hide Debug' : 'Debug'}
            </button>
          )
        }
      />

      <main className="container-padding">
        <div className="bg-white rounded-xl shadow-md p-4 mb-4">
          <h2 className="text-lg font-bold mb-2">Добро пожаловать в тренажер!</h2>
          <p className="text-gray-700">
            Это базовая версия психиатрического тренажера для Telegram Mini Apps. 
            Сейчас вы видите структуру проекта со всеми настроенными компонентами.
          </p>
          
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3">
            <h3 className="font-bold text-blue-800">Статус проекта:</h3>
            <ul className="list-disc ml-5 mt-2 text-sm">
              <li>✅ Next.js с TypeScript и Tailwind CSS</li>
              <li>✅ Zustand для управления состоянием</li>
              <li>✅ Базовые UI компоненты</li>
              <li>✅ Эмулятор Telegram SDK</li>
              <li>✅ MSW для моков API</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-bold mb-2">Статус Telegram SDK:</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold">Режим:</p>
              <p className="text-sm">{isMocked ? 'Эмуляция' : 'Реальный SDK'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Платформа:</p>
              <p className="text-sm">{webApp?.platform || 'Неизвестно'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Цветовая схема:</p>
              <p className="text-sm">{webApp?.colorScheme || 'Неизвестно'}</p>
            </div>
            <div>
              <p className="text-sm font-semibold">Версия:</p>
              <p className="text-sm">{webApp?.version || 'Неизвестно'}</p>
            </div>
          </div>
        </div>
      </main>

      {/* Example of using TelegramMainButton */}
      <TelegramMainButton
        text="Открыть консоль"
        onClick={() => {
          console.log('Telegram WebApp:', webApp);
          alert('Подробности в консоли браузера');
        }}
      />

      {/* Debug Panel (development only) */}
      {process.env.NODE_ENV === 'development' && showDebug && (
        <TelegramDebugPanel onClose={() => setShowDebug(false)} />
      )}
    </div>
  );
};

export default Home;