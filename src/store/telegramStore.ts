import { create } from 'zustand';

interface TelegramState {
  isReady: boolean;
  isMocked: boolean;
  platform: string;
  colorScheme: 'light' | 'dark';
  viewportHeight: number;
  viewportStableHeight: number;
  initDataUnsafe: any;
  setReady: (isReady: boolean) => void;
  setMocked: (isMocked: boolean) => void;
  setPlatform: (platform: string, reload?: boolean) => void;
  setColorScheme: (colorScheme: 'light' | 'dark') => void;
  setViewportHeight: (height: number) => void;
  setViewportStableHeight: (height: number) => void;
  setInitDataUnsafe: (data: any) => void;
  reset: () => void;
}

// Получаем сохранённую платформу, если она есть
const getSavedPlatform = (): string => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage.getItem('debug_platform') || 'web';
  }
  return 'web';
};

export const useTelegramStore = create<TelegramState>((set) => ({
  isReady: false,
  isMocked: false,
  platform: getSavedPlatform(),
  colorScheme: 'light',
  viewportHeight: 0,
  viewportStableHeight: 0,
  initDataUnsafe: null,
  setReady: (isReady) => set({ isReady }),
  setMocked: (isMocked) => set({ isMocked }),
  setPlatform: (platform, reload = false) => {
    // Сохраняем платформу в localStorage для persistence
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem('debug_platform', platform);
    }
    set({ platform });
    
    // Перезагружаем страницу только если явно запрошено
    // Это предотвращает цикл перезагрузок при инициализации
    if (reload && typeof window !== 'undefined') {
      window.location.reload();
    }
  },
  setColorScheme: (colorScheme) => set({ colorScheme }),
  setViewportHeight: (height) => set({ viewportHeight: height }),
  setViewportStableHeight: (height) => set({ viewportStableHeight: height }),
  setInitDataUnsafe: (data) => set({ initDataUnsafe: data }),
  reset: () => set({
    isReady: false,
    isMocked: false,
    platform: 'web',
    colorScheme: 'light',
    viewportHeight: 0,
    viewportStableHeight: 0,
    initDataUnsafe: null,
  }),
}));