import React, { useState } from 'react';
import { useNavigationStore, StageType } from '../../store/navigationStore';
import { useMobileView } from '../../utils/hooks';

interface SidebarLayoutProps {
  children: React.ReactNode;
}

interface StageInfo {
  id: StageType;
  label: string;
  icon: React.ReactNode;
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ children }) => {
  const { currentStage, setStage, history } = useNavigationStore();
  const isMobile = useMobileView();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Define the stages for the sidebar
  const stages: StageInfo[] = [
    { 
      id: 'patient-notes', 
      label: 'Заметки о пациенте', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
    },
    { 
      id: 'patient-stories', 
      label: 'История пациента', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    { 
      id: 'consultation', 
      label: 'Консультация', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      )
    },
    { 
      id: 'diagnosis', 
      label: 'Диагностика', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    { 
      id: 'treatment', 
      label: 'Лечение', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    },
    { 
      id: 'results', 
      label: 'Результаты', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    { 
      id: 'expert-comment', 
      label: 'Комментарий эксперта', 
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      )
    },
  ];

  const handleStageClick = (stage: StageType) => {
    if (history.includes(stage)) {
      setStage(stage);
      if (isMobile) {
        setSidebarOpen(false);
      }
    }
  };

  // For mobile, only show the sidebar when it's opened
  // For desktop, always show the sidebar
  const showSidebar = !isMobile || sidebarOpen;

  return (
    <div className="flex h-screen">
      {/* Mobile sidebar toggle */}
      {isMobile && (
        <button
          className={`fixed top-4 left-4 z-50 bg-white rounded-full w-10 h-10 shadow-md flex items-center justify-center ${sidebarOpen ? 'hidden' : ''}`}
          onClick={() => setSidebarOpen(true)}
          aria-label="Открыть меню"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Sidebar */}
      {showSidebar && (
        <div className={`
          ${isMobile 
            ? 'fixed inset-0 z-40 bg-black/50 flex' 
            : 'w-64 bg-white border-r border-gray-200'
          }
        `}>
          <div className={`
            ${isMobile 
              ? 'bg-white w-3/4 max-w-xs h-full' 
              : 'w-full'
            } overflow-y-auto
          `}>
            {/* Mobile close button */}
            {isMobile && (
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold">Навигация</h2>
                <button 
                  className="text-gray-600"
                  onClick={() => setSidebarOpen(false)}
                  aria-label="Закрыть меню"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Stage navigation */}
            <div className="py-4">
              {stages.map((stage, index) => (
                <div 
                  key={stage.id}
                  className={`
                    px-4 py-3 flex items-center space-x-3 transition-colors
                    ${history.includes(stage.id) 
                      ? 'cursor-pointer hover:bg-gray-100' 
                      : 'opacity-50 cursor-not-allowed'
                    }
                    ${currentStage === stage.id ? 'bg-primary/10 border-l-4 border-primary' : ''}
                  `}
                  onClick={() => handleStageClick(stage.id)}
                >
                  {stage.icon}
                  <span className={currentStage === stage.id ? 'font-bold' : ''}>
                    {stage.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay click to close for mobile */}
          {isMobile && (
            <div 
              className="flex-1"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </div>
      )}

      {/* Main content */}
      <div className={`${isMobile ? 'w-full' : 'flex-1'} overflow-y-auto`}>
        {children}
      </div>
    </div>
  );
};