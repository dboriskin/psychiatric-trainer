import { useCloudStorage, useDeviceStorage } from '../components/telegram/TelegramProvider';

/**
 * Utility for working with Telegram CloudStorage with Promise-based API
 */
export const cloudStorage = {
  /**
   * Get an item from CloudStorage
   */
  getItem: (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Get the CloudStorage from the window object if in Telegram environment
      const storage = 
        (typeof window !== 'undefined' && 
         window.Telegram?.WebApp?.CloudStorage) || 
        null;

      if (!storage) {
        reject(new Error('Telegram CloudStorage is not available'));
        return;
      }

      storage.getItem(key, (error: Error | null, value: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  },

  /**
   * Set an item in CloudStorage
   */
  setItem: (key: string, value: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const storage = 
        (typeof window !== 'undefined' && 
         window.Telegram?.WebApp?.CloudStorage) || 
        null;

      if (!storage) {
        reject(new Error('Telegram CloudStorage is not available'));
        return;
      }

      storage.setItem(key, value, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Remove an item from CloudStorage
   */
  removeItem: (key: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const storage = 
        (typeof window !== 'undefined' && 
         window.Telegram?.WebApp?.CloudStorage) || 
        null;

      if (!storage) {
        reject(new Error('Telegram CloudStorage is not available'));
        return;
      }

      storage.removeItem(key, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Get multiple items from CloudStorage
   */
  getItems: (keys: string[]): Promise<Record<string, string>> => {
    return new Promise((resolve, reject) => {
      const storage = 
        (typeof window !== 'undefined' && 
         window.Telegram?.WebApp?.CloudStorage) || 
        null;

      if (!storage) {
        reject(new Error('Telegram CloudStorage is not available'));
        return;
      }

      storage.getItems(keys, (error: Error | null, values: Record<string, string>) => {
        if (error) {
          reject(error);
        } else {
          resolve(values);
        }
      });
    });
  },
};

/**
 * Utility for working with Telegram DeviceStorage with Promise-based API
 */
export const deviceStorage = {
  /**
   * Get an item from DeviceStorage
   */
  getItem: (key: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storage = 
        (typeof window !== 'undefined' && 
         window.Telegram?.WebApp?.DeviceStorage) || 
        null;

      if (!storage) {
        // Fallback to localStorage if DeviceStorage is not available
        if (typeof window !== 'undefined' && window.localStorage) {
          resolve(window.localStorage.getItem(key) || '');
          return;
        }
        reject(new Error('Storage is not available'));
        return;
      }

      storage.getItem(key, (error: Error | null, value: string) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  },

  /**
   * Set an item in DeviceStorage
   */
  setItem: (key: string, value: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const storage = 
        (typeof window !== 'undefined' && 
         window.Telegram?.WebApp?.DeviceStorage) || 
        null;

      if (!storage) {
        // Fallback to localStorage if DeviceStorage is not available
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
          resolve();
          return;
        }
        reject(new Error('Storage is not available'));
        return;
      }

      storage.setItem(key, value, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },

  /**
   * Remove an item from DeviceStorage
   */
  removeItem: (key: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const storage = 
        (typeof window !== 'undefined' && 
         window.Telegram?.WebApp?.DeviceStorage) || 
        null;

      if (!storage) {
        // Fallback to localStorage if DeviceStorage is not available
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
          resolve();
          return;
        }
        reject(new Error('Storage is not available'));
        return;
      }

      storage.removeItem(key, (error: Error | null) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  },
};