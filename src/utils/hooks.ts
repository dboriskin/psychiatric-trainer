import { useEffect, useState } from 'react';
import { useTelegramStore } from '../store';

/**
 * Hook to determine if the application is running in mobile view
 */
export function useMobileView(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Listen for resize events
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);
  
  return isMobile;
}

/**
 * Hook to detect the platform (mobile, desktop, etc.)
 */
export function usePlatform() {
  const { platform } = useTelegramStore();
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  
  useEffect(() => {
    // Check if the platform is mobile based on the Telegram platform info
    const mobileCheck = platform === 'android' || platform === 'ios';
    setIsMobileDevice(mobileCheck);
  }, [platform]);
  
  return {
    isMobile: isMobileDevice,
    platform,
    isAndroid: platform === 'android',
    isIOS: platform === 'ios',
    isDesktop: platform === 'web' || platform === 'tdesktop',
  };
}