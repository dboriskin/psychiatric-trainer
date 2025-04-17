/**
 * Упрощенная и надежная реализация хранилища для Telegram Mini Apps с автоматическим fallback на localStorage
 */

/**
 * Унифицированное хранилище, которое пытается использовать Telegram CloudStorage,
 * но автоматически переключается на localStorage при ошибках
 */
export const storage = {
    /**
     * Получение значения из хранилища
     */
    getItem: (key: string): Promise<string> => {
      return new Promise((resolve) => {
        // Сначала пробуем использовать localStorage (он точно работает)
        if (typeof window !== 'undefined' && window.localStorage) {
          const localValue = window.localStorage.getItem(key);
          if (localValue !== null) {
            resolve(localValue);
            return;
          }
        }
        
        // Затем пробуем Telegram CloudStorage, если он доступен
        if (typeof window !== 'undefined' && 
            window.Telegram?.WebApp?.CloudStorage && 
            typeof window.Telegram.WebApp.CloudStorage.getItem === 'function') {
          
          try {
            window.Telegram.WebApp.CloudStorage.getItem(key, (error: Error | null, value: string) => {
              if (error || value === undefined || value === null) {
                // Если произошла ошибка или значение не найдено, возвращаем пустую строку
                console.warn('CloudStorage.getItem failed:', error);
                resolve('');
              } else {
                // Если успешно получили значение, сохраняем его также в localStorage для следующего раза
                if (typeof window !== 'undefined' && window.localStorage) {
                  try {
                    window.localStorage.setItem(key, value);
                  } catch (e) {
                    console.warn('Failed to cache CloudStorage value in localStorage:', e);
                  }
                }
                resolve(value);
              }
            });
          } catch (e) {
            console.warn('Exception when calling CloudStorage.getItem:', e);
            resolve('');
          }
        } else {
          // CloudStorage недоступен, возвращаем пустую строку
          resolve('');
        }
      });
    },
  
    /**
     * Сохранение значения в хранилище
     */
    setItem: (key: string, value: string): Promise<void> => {
      return new Promise((resolve) => {
        // Всегда сохраняем в localStorage как базовое хранилище
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.setItem(key, value);
          } catch (e) {
            console.warn('Failed to save to localStorage:', e);
          }
        }
        
        // Затем пробуем сохранить в Telegram CloudStorage, если он доступен
        if (typeof window !== 'undefined' && 
            window.Telegram?.WebApp?.CloudStorage && 
            typeof window.Telegram.WebApp.CloudStorage.setItem === 'function') {
          
          try {
            window.Telegram.WebApp.CloudStorage.setItem(key, value, (error: Error | null) => {
              if (error) {
                console.warn('CloudStorage.setItem failed:', error);
              }
              // В любом случае считаем операцию успешной, т.к. мы уже сохранили в localStorage
              resolve();
            });
          } catch (e) {
            console.warn('Exception when calling CloudStorage.setItem:', e);
            resolve();
          }
        } else {
          // CloudStorage недоступен, но мы уже сохранили в localStorage, поэтому считаем операцию успешной
          resolve();
        }
      });
    },
  
    /**
     * Удаление значения из хранилища
     */
    removeItem: (key: string): Promise<void> => {
      return new Promise((resolve) => {
        // Удаляем из localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          try {
            window.localStorage.removeItem(key);
          } catch (e) {
            console.warn('Failed to remove from localStorage:', e);
          }
        }
        
        // Пробуем удалить из Telegram CloudStorage, если он доступен
        if (typeof window !== 'undefined' && 
            window.Telegram?.WebApp?.CloudStorage && 
            typeof window.Telegram.WebApp.CloudStorage.removeItem === 'function') {
          
          try {
            window.Telegram.WebApp.CloudStorage.removeItem(key, (error: Error | null) => {
              if (error) {
                console.warn('CloudStorage.removeItem failed:', error);
              }
              resolve();
            });
          } catch (e) {
            console.warn('Exception when calling CloudStorage.removeItem:', e);
            resolve();
          }
        } else {
          resolve();
        }
      });
    }
  };
  
  // Для совместимости с существующим кодом
  export const cloudStorage = storage;
  export const deviceStorage = storage;