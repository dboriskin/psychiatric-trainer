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
  setPlatform: (platform: string) => void;
  setColorScheme: (colorScheme: 'light' | 'dark') => void;
  setViewportHeight: (height: number) => void;
  setViewportStableHeight: (height: number) => void;
  setInitDataUnsafe: (data: any) => void;
  reset: () => void;
}

export const useTelegramStore = create<TelegramState>((set) => ({
  isReady: false,
  isMocked: false,
  platform: 'unknown',
  colorScheme: 'light',
  viewportHeight: 0,
  viewportStableHeight: 0,
  initDataUnsafe: null,
  setReady: (isReady) => set({ isReady }),
  setMocked: (isMocked) => set({ isMocked }),
  setPlatform: (platform) => set({ platform }),
  setColorScheme: (colorScheme) => set({ colorScheme }),
  setViewportHeight: (height) => set({ viewportHeight: height }),
  setViewportStableHeight: (height) => set({ viewportStableHeight: height }),
  setInitDataUnsafe: (data) => set({ initDataUnsafe: data }),
  reset: () => set({
    isReady: false,
    isMocked: false,
    platform: 'unknown',
    colorScheme: 'light',
    viewportHeight: 0,
    viewportStableHeight: 0,
    initDataUnsafe: null,
  }),
}));