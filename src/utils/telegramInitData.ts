/**
 * Validates Telegram init data signature
 * Note: This validation should be done on the server side!
 * This is just a client-side helper for development purposes.
 */
export function validateTelegramInitData(initData: string, botToken: string): boolean {
    // In a real implementation, this would use crypto library to verify the HMAC
    // But for development purposes, we're just checking if the data is present
    if (!initData) {
      return false;
    }
  
    // Extract init data parts
    const params = new URLSearchParams(initData);
    const hash = params.get('hash');
    
    if (!hash) {
      return false;
    }
    
    // In a real app, the actual validation would be performed by the server
    // For development, we'll just assume it's valid
    console.warn('Warning: Telegram init data validation is skipped in development mode');
    return true;
  }
  
  /**
   * Parse Telegram init data into an object
   */
  export function parseTelegramInitData(initData: string): any {
    if (!initData) {
      return null;
    }
  
    const params = new URLSearchParams(initData);
    const result: Record<string, any> = {};
  
    // Convert the params to an object
    for (const [key, value] of params.entries()) {
      // Try to parse JSON values
      if (key === 'user') {
        try {
          result[key] = JSON.parse(value);
        } catch {
          result[key] = value;
        }
      } else {
        result[key] = value;
      }
    }
  
    return result;
  }