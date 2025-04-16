import React, { useState, useEffect } from 'react';
import { useNavigationStore } from '../../store/navigationStore';
import { NavigationMapModal } from '../container/NavigationMapModal';
import { useTelegram } from '../telegram';
import { usePlatform } from '../../utils/hooks';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  showNavMap?: boolean;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ 
  children,
  title = 'Психиатрический тренажер',
  showNavMap = false
}) => {
  const [navMapVisible, setNavMapVisible] = useState(false);
  const { currentStage } = useNavigationStore();
  const { webApp } = useTelegram();
  const { isMobile } = usePlatform();

  // Set background color based on Telegram theme
  useEffect(() => {
    if (webApp && webApp.themeParams) {
      document.body.style.backgroundColor = webApp.themeParams.bg_color || '#f5f5f5';
    }
  }, [webApp]);

  // Disable vertical swipes to prevent conflicts with Telegram gestures
  useEffect(() => {
    if (webApp && typeof webApp.disableVerticalSwipes === 'function') {
      webApp.disableVerticalSwipes();
    }
    
    return () => {
      if (webApp && typeof webApp.enableVerticalSwipes === 'function') {
        webApp.enableVerticalSwipes();
      }
    };
  }, [webApp]);

  // Enable closing confirmation for case screens
  useEffect(() => {
    if (webApp && 
        typeof webApp.enableClosingConfirmation === 'function' && 
        currentStage !== 'categories' && 
        currentStage !== 'cases') {
      webApp.enableClosingConfirmation();
    }
    
    return () => {
      if (webApp && typeof webApp.disableClosingConfirmation === 'function') {
        webApp.disableClosingConfirmation();
      }
    };
  }, [webApp, currentStage]);

  return (
    <div className="min-h-screen">
      {/* Modal for navigation map */}
      {showNavMap && (
        <>
          <button 
            className="fixed top-4 right-4 z-10 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center"
            onClick={() => setNavMapVisible(true)}
            aria-label="Открыть карту навигации"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6-3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </button>
          
          <NavigationMapModal 
            isVisible={navMapVisible} 
            onClose={() => setNavMapVisible(false)} 
          />
        </>
      )}

      {/* Main content */}
      <div className="container mx-auto">
        {children}
      </div>
    </div>
  );
};