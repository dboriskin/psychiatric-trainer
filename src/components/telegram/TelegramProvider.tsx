// src/components/telegram/TelegramProvider.tsx
import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { useTelegramStore } from '../../store/telegramStore';

// Define the shape of the Telegram WebApp SDK
export interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  sendData: (data: string) => void;
  onEvent: (eventType: string, callback: Function) => void;
  offEvent: (eventType: string, callback: Function) => void;
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: Function) => void;
    offClick: (callback: Function) => void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    setText: (text: string) => void;
    onClick: (callback: Function) => void;
    offClick: (callback: Function) => void;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
    setParams: (params: {
      text?: string;
      color?: string;
      text_color?: string;
      is_active?: boolean;
      is_visible?: boolean;
    }) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  CloudStorage: {
    getItem: (key: string, callback: (error: any, value: string) => void) => void;
    setItem: (key: string, value: string, callback?: (error: any) => void) => void;
    removeItem: (key: string, callback?: (error: any) => void) => void;
    getItems: (keys: string[], callback: (error: any, values: Record<string, string>) => void) => void;
    removeItems: (keys: string[], callback?: (error: any) => void) => void;
    getKeys: (callback: (error: any, keys: string[]) => void) => void;
  };
  DeviceStorage: {
    getItem: (key: string, callback: (error: any, value: string) => void) => void;
    setItem: (key: string, value: string, callback?: (error: any) => void) => void;
    removeItem: (key: string, callback?: (error: any) => void) => void;
    getItems: (keys: string[], callback: (error: any, values: Record<string, string>) => void) => void;
    removeItems: (keys: string[], callback?: (error: any) => void) => void;
    getKeys: (callback: (error: any, keys: string[]) => void) => void;
  };
  disableVerticalSwipes: () => void;
  enableVerticalSwipes: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  showPopup: (params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text: string;
    }>;
  }, callback?: (buttonId: string) => void) => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
  platform: string;
  colorScheme: 'light' | 'dark';
  version: string;
  isVersionAtLeast: (version: string) => boolean;
  setHeaderColor: (color: string) => void;
  setBackgroundColor: (color: string) => void;
  openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
  openTelegramLink: (url: string) => void;
  initData: string;
  initDataUnsafe: any;
  themeParams: Record<string, string>;
  requestWriteAccess: (callback?: (access_granted: boolean) => void) => void;
  requestContact: (callback?: (shared_contact: boolean) => void) => void;
}

// Type for mocked or real Telegram context
export interface TelegramContext {
  webApp: TelegramWebApp | null;
  isReady: boolean;
  isMocked: boolean;
  enableMock: () => void;
  disableMock: () => void;
}

// Create the context
const TelegramContext = createContext<TelegramContext>({
  webApp: null,
  isReady: false,
  isMocked: false,
  enableMock: () => {},
  disableMock: () => {},
});

// Create a mock implementation of the Telegram WebApp SDK
function createMockWebApp(): TelegramWebApp {
  // Create event system for the mock
  const events: Record<string, Function[]> = {};

  // Object to store cloud storage data
  const mockCloudStorage: Record<string, string> = {};
  const mockDeviceStorage: Record<string, string> = {};

  // Mock for BackButton
  const backButton = {
    isVisible: false,
    show: function() {
      this.isVisible = true;
      console.log('BackButton shown');
    },
    hide: function() {
      this.isVisible = false;
      console.log('BackButton hidden');
    },
    onClick: function(callback: Function) {
      if (!events['backButtonClicked']) {
        events['backButtonClicked'] = [];
      }
      events['backButtonClicked'].push(callback);
      console.log('BackButton click handler added');
    },
    offClick: function(callback: Function) {
      if (events['backButtonClicked']) {
        events['backButtonClicked'] = events['backButtonClicked'].filter(cb => cb !== callback);
      }
      console.log('BackButton click handler removed');
    },
  };

  // Mock for MainButton
  const mainButton = {
    text: 'CONTINUE',
    color: '#5288c1',
    textColor: '#ffffff',
    isVisible: false,
    isActive: true,
    setText: function(text: string) {
      this.text = text;
      console.log(`MainButton text set to: ${text}`);
    },
    onClick: function(callback: Function) {
      if (!events['mainButtonClicked']) {
        events['mainButtonClicked'] = [];
      }
      events['mainButtonClicked'].push(callback);
      console.log('MainButton click handler added');
    },
    offClick: function(callback: Function) {
      if (events['mainButtonClicked']) {
        events['mainButtonClicked'] = events['mainButtonClicked'].filter(cb => cb !== callback);
      }
      console.log('MainButton click handler removed');
    },
    show: function() {
      this.isVisible = true;
      console.log('MainButton shown');
    },
    hide: function() {
      this.isVisible = false;
      console.log('MainButton hidden');
    },
    enable: function() {
      this.isActive = true;
      console.log('MainButton enabled');
    },
    disable: function() {
      this.isActive = false;
      console.log('MainButton disabled');
    },
    showProgress: function(leaveActive = false) {
      if (!leaveActive) {
        this.isActive = false;
      }
      console.log('MainButton progress shown');
    },
    hideProgress: function() {
      console.log('MainButton progress hidden');
    },
    setParams: function(params: any) {
      if (params.text) this.text = params.text;
      if (params.color) this.color = params.color;
      if (params.text_color) this.textColor = params.text_color;
      if (params.is_active !== undefined) this.isActive = params.is_active;
      if (params.is_visible !== undefined) this.isVisible = params.is_visible;
      console.log('MainButton params set:', params);
    }
  };

  // Mock haptic feedback
  const hapticFeedback = {
    impactOccurred: function(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') {
      console.log(`Haptic impact: ${style}`);
    },
    notificationOccurred: function(type: 'error' | 'success' | 'warning') {
      console.log(`Haptic notification: ${type}`);
    },
    selectionChanged: function() {
      console.log('Haptic selection changed');
    }
  };

  // Mock CloudStorage
  const cloudStorage = {
    getItem: function(key: string, callback: (error: any, value: string) => void) {
      setTimeout(() => {
        callback(null, mockCloudStorage[key] || '');
      }, 100);
    },
    setItem: function(key: string, value: string, callback?: (error: any) => void) {
      setTimeout(() => {
        mockCloudStorage[key] = value;
        if (callback) callback(null);
      }, 100);
    },
    removeItem: function(key: string, callback?: (error: any) => void) {
      setTimeout(() => {
        delete mockCloudStorage[key];
        if (callback) callback(null);
      }, 100);
    },
    getItems: function(keys: string[], callback: (error: any, values: Record<string, string>) => void) {
      setTimeout(() => {
        const values: Record<string, string> = {};
        keys.forEach(key => {
          if (mockCloudStorage[key]) {
            values[key] = mockCloudStorage[key];
          }
        });
        callback(null, values);
      }, 100);
    },
    removeItems: function(keys: string[], callback?: (error: any) => void) {
      setTimeout(() => {
        keys.forEach(key => {
          delete mockCloudStorage[key];
        });
        if (callback) callback(null);
      }, 100);
    },
    getKeys: function(callback: (error: any, keys: string[]) => void) {
      setTimeout(() => {
        callback(null, Object.keys(mockCloudStorage));
      }, 100);
    }
  };

  // Mock DeviceStorage
  const deviceStorage = {
    getItem: function(key: string, callback: (error: any, value: string) => void) {
      setTimeout(() => {
        callback(null, mockDeviceStorage[key] || '');
      }, 100);
    },
    setItem: function(key: string, value: string, callback?: (error: any) => void) {
      setTimeout(() => {
        mockDeviceStorage[key] = value;
        if (callback) callback(null);
      }, 100);
    },
    removeItem: function(key: string, callback?: (error: any) => void) {
      setTimeout(() => {
        delete mockDeviceStorage[key];
        if (callback) callback(null);
      }, 100);
    },
    getItems: function(keys: string[], callback: (error: any, values: Record<string, string>) => void) {
      setTimeout(() => {
        const values: Record<string, string> = {};
        keys.forEach(key => {
          if (mockDeviceStorage[key]) {
            values[key] = mockDeviceStorage[key];
          }
        });
        callback(null, values);
      }, 100);
    },
    removeItems: function(keys: string[], callback?: (error: any) => void) {
      setTimeout(() => {
        keys.forEach(key => {
          delete mockDeviceStorage[key];
        });
        if (callback) callback(null);
      }, 100);
    },
    getKeys: function(callback: (error: any, keys: string[]) => void) {
      setTimeout(() => {
        callback(null, Object.keys(mockDeviceStorage));
      }, 100);
    }
  };

  // Helper to trigger events
  const triggerEvent = (eventType: string, ...args: any[]) => {
    if (events[eventType]) {
      events[eventType].forEach(callback => callback(...args));
    }
  };

  // Create the mock WebApp object
  const mockWebApp: TelegramWebApp = {
    ready: () => console.log('WebApp.ready() called'),
    expand: () => console.log('WebApp.expand() called'),
    close: () => console.log('WebApp.close() called'),
    isExpanded: true,
    viewportHeight: window.innerHeight,
    viewportStableHeight: window.innerHeight,
    sendData: (data: string) => console.log('WebApp.sendData() called with:', data),
    onEvent: (eventType: string, callback: Function) => {
      if (!events[eventType]) {
        events[eventType] = [];
      }
      events[eventType].push(callback);
      console.log(`Event listener added for: ${eventType}`);
    },
    offEvent: (eventType: string, callback: Function) => {
      if (events[eventType]) {
        events[eventType] = events[eventType].filter(cb => cb !== callback);
      }
      console.log(`Event listener removed for: ${eventType}`);
    },
    BackButton: backButton,
    MainButton: mainButton,
    HapticFeedback: hapticFeedback,
    CloudStorage: cloudStorage,
    DeviceStorage: deviceStorage,
    disableVerticalSwipes: () => console.log('disableVerticalSwipes called'),
    enableVerticalSwipes: () => console.log('enableVerticalSwipes called'),
    enableClosingConfirmation: () => console.log('enableClosingConfirmation called'),
    disableClosingConfirmation: () => console.log('disableClosingConfirmation called'),
    showPopup: (params, callback) => {
      console.log('showPopup called with:', params);
      if (callback) setTimeout(() => callback('ok'), 1000);
    },
    showAlert: (message, callback) => {
      console.log('showAlert called with:', message);
      if (callback) setTimeout(callback, 1000);
    },
    showConfirm: (message, callback) => {
      console.log('showConfirm called with:', message);
      if (callback) setTimeout(() => callback(true), 1000);
    },
    platform: 'web',
    colorScheme: 'light',
    version: '6.0',
    isVersionAtLeast: () => true,
    setHeaderColor: (color) => console.log('setHeaderColor called with:', color),
    setBackgroundColor: (color) => console.log('setBackgroundColor called with:', color),
    openLink: (url, options) => {
      console.log('openLink called with:', url, options);
      window.open(url, '_blank');
    },
    openTelegramLink: (url) => {
      console.log('openTelegramLink called with:', url);
      window.open(url, '_blank');
    },
    initData: '',
    initDataUnsafe: {
      query_id: 'mock_query_id',
      user: {
        id: 123456789,
        first_name: 'Mock',
        last_name: 'User',
        username: 'mockuser',
        language_code: 'ru'
      },
      auth_date: Math.floor(Date.now() / 1000),
      hash: 'mock_hash'
    },
    themeParams: {
      bg_color: '#ffffff',
      text_color: '#000000',
      hint_color: '#999999',
      link_color: '#5288c1',
      button_color: '#5288c1',
      button_text_color: '#ffffff'
    },
    requestWriteAccess: (callback) => {
      console.log('requestWriteAccess called');
      if (callback) setTimeout(() => callback(true), 1000);
    },
    requestContact: (callback) => {
      console.log('requestContact called');
      if (callback) setTimeout(() => callback(true), 1000);
    }
  };

  // Add custom debug methods for browser development
  (mockWebApp as any).debug = {
    triggerBackButton: () => {
      triggerEvent('backButtonClicked');
    },
    triggerMainButton: () => {
      triggerEvent('mainButtonClicked');
    },
    toggleColorScheme: () => {
      const newScheme = mockWebApp.colorScheme === 'light' ? 'dark' : 'light';
      (mockWebApp as any).colorScheme = newScheme;
      triggerEvent('themeChanged');
    }
  };

  return mockWebApp;
}

interface TelegramProviderProps {
  children: React.ReactNode;
  mockByDefault?: boolean;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ 
    children,
    mockByDefault = true
  }) => {
    // Use refs to avoid state changes during render
    const webAppRef = useRef<any>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const telegramStore = useTelegramStore();
    
    // Initialize only once on mount
    useEffect(() => {
      // Skip for SSR
      if (typeof window === 'undefined') return;
      
      let isMounted = true;
      
      const initialize = () => {
        if (mockByDefault) {
          initializeMock();
        } else {
          initializeReal();
        }
        
        if (isMounted) {
          setIsInitialized(true);
        }
      };
      
      const initializeMock = () => {
        if (!isMounted) return;
        
        const mockWebApp = createMockWebApp();
        webAppRef.current = mockWebApp;
        
        // Update store in one batch to prevent multiple re-renders
        telegramStore.setMocked(true);
        telegramStore.setReady(true);
        telegramStore.setPlatform(mockWebApp.platform);
        telegramStore.setColorScheme(mockWebApp.colorScheme);
        telegramStore.setViewportHeight(mockWebApp.viewportHeight);
        telegramStore.setViewportStableHeight(mockWebApp.viewportStableHeight);
        telegramStore.setInitDataUnsafe(mockWebApp.initDataUnsafe);
        
        // Signal ready
        mockWebApp.ready();
        console.log('Mock WebApp initialized');
      };
      
      const initializeReal = () => {
        if (!isMounted) return;
        
        // Check if Telegram WebApp is available
        if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
          const tgWebApp = window.Telegram.WebApp;
          webAppRef.current = tgWebApp;
          
          // Update store in one batch
          telegramStore.setMocked(false);
          telegramStore.setReady(true);
          telegramStore.setPlatform(tgWebApp.platform);
          telegramStore.setColorScheme(tgWebApp.colorScheme);
          telegramStore.setViewportHeight(tgWebApp.viewportHeight);
          telegramStore.setViewportStableHeight(tgWebApp.viewportStableHeight);
          telegramStore.setInitDataUnsafe(tgWebApp.initDataUnsafe);
          
          // Signal ready
          tgWebApp.ready();
          console.log('Real Telegram WebApp initialized');
        } else {
          // Fallback to mock if real WebApp not available
          console.warn('Telegram WebApp is not available, falling back to mock');
          initializeMock();
        }
      };
      
      // Run initialization
      initialize();
      
      // Clean up on unmount
      return () => {
        isMounted = false;
      };
    }, []); // Empty dependency array - run once on mount
    
    // Set up event listeners after initialization
    useEffect(() => {
      if (!isInitialized || !webAppRef.current) return;
      
      // For real Telegram WebApp only, set up listeners
      if (!telegramStore.isMocked) {
        // Handle viewport changes
        const handleViewportChanged = () => {
          telegramStore.setViewportHeight(webAppRef.current.viewportHeight);
          telegramStore.setViewportStableHeight(webAppRef.current.viewportStableHeight);
        };
        
        // Handle theme changes
        const handleThemeChanged = () => {
          telegramStore.setColorScheme(webAppRef.current.colorScheme);
        };
        
        // Register event handlers
        webAppRef.current.onEvent('viewportChanged', handleViewportChanged);
        webAppRef.current.onEvent('themeChanged', handleThemeChanged);
        
        // Clean up event handlers
        return () => {
          if (webAppRef.current) {
            webAppRef.current.offEvent('viewportChanged', handleViewportChanged);
            webAppRef.current.offEvent('themeChanged', handleThemeChanged);
          }
        };
      }
    }, [isInitialized, telegramStore.isMocked]); // Only re-run if initialization status changes
    
    // These functions are for manually changing the mode - should be rarely used
    const enableMock = () => {
      // Only run on client and if not already mocked
      if (typeof window === 'undefined' || telegramStore.isMocked) return;
      
      const mockWebApp = createMockWebApp();
      webAppRef.current = mockWebApp;
      telegramStore.setMocked(true);
      mockWebApp.ready();
    };
    
    const disableMock = () => {
      // Only run on client, if not already real, and if real is available
      if (typeof window === 'undefined' || 
          !telegramStore.isMocked || 
          !window.Telegram?.WebApp) return;
      
      webAppRef.current = window.Telegram.WebApp;
      telegramStore.setMocked(false);
      window.Telegram.WebApp.ready();
    };
    
    // Create context value using the ref to avoid re-renders
    const contextValue = {
      webApp: webAppRef.current,
      isReady: telegramStore.isReady,
      isMocked: telegramStore.isMocked,
      enableMock,
      disableMock
    };
    
    return (
      <TelegramContext.Provider value={contextValue}>
        {children}
      </TelegramContext.Provider>
    );
  };
  
  // Keep existing hooks
  
  // Custom hook to use the Telegram context
  export const useTelegram = () => useContext(TelegramContext);
  
  // Helper hooks for using specific parts of the Telegram WebApp API
  export const useMainButton = () => {
    const { webApp } = useTelegram();
    return webApp?.MainButton;
  };
  
  export const useBackButton = () => {
    const { webApp } = useTelegram();
    return webApp?.BackButton;
  };
  
  export const useHapticFeedback = () => {
    const { webApp } = useTelegram();
    return webApp?.HapticFeedback;
  };
  
  export const useCloudStorage = () => {
    const { webApp } = useTelegram();
    return webApp?.CloudStorage;
  };
  
  export const useDeviceStorage = () => {
    const { webApp } = useTelegram();
    return webApp?.DeviceStorage;
  };
  
  // Add global type definitions
  declare global {
    interface Window {
      Telegram?: {
        WebApp: any;
      };
    }
  }