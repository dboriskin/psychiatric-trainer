import React, { useEffect, useState } from 'react';
import { useNavigationStore } from '../store/navigationStore';
import { useCaseStore } from '../store/caseStore';
import { useTelegram } from './telegram/TelegramProvider';
import { LoadingSpinner } from './base';
import { PlatformSwitcher } from './debug/PlatformSwitcher';

// Импортируем все контейнеры
import { CategoryLibrary } from './container/CategoryLibrary';
import { CaseSelector } from './container/CaseSelector';
import { PatientNotes } from './container/PatientNotes';
import { PatientStories } from './container/PatientStories';
import { ConsultationTransition } from './container/ConsultationTransition';
import { DiagnosticModule } from './container/DiagnosticModule';
import { TreatmentModule } from './container/TreatmentModule';
import { ResultsModule } from './container/ResultsModule';
import { ExpertCommentary } from './container/ExpertCommentary';

// Импортируем для данных кейса
import { useCase } from '../hooks/useCase';
import { MainLayout } from './layout/MainLayout';
import { SidebarLayout } from './layout/SidebarLayout';

const App: React.FC = () => {
  const { currentStage, setStage, restoreNavigation } = useNavigationStore();
  const { currentCaseId, currentCategoryId, restoreState: restoreCaseState } = useCaseStore();
  const { webApp, isReady } = useTelegram();
  const { caseDetail, loading: caseLoading } = useCase();
  const [showDebug, setShowDebug] = useState(process.env.NODE_ENV === 'development');
  const [isAppInitialized, setIsAppInitialized] = useState(false);

  // Восстановление состояния приложения
  useEffect(() => {
    if (isReady && !isAppInitialized) {
      console.log('App: initializing and restoring state');
      
      // Попытка восстановить состояние
      const caseStateRestored = restoreCaseState();
      const navigationRestored = restoreNavigation();
      
      // Если не удалось восстановить состояние, устанавливаем начальный экран
      if (!navigationRestored) {
        console.log('App: no saved navigation, setting initial state');
        setStage('categories', false); // false - не сохранять в localStorage
      }
      
      setIsAppInitialized(true);
    }
  }, [isReady, isAppInitialized, restoreNavigation, restoreCaseState, setStage]);

  // Сигнализируем Telegram, что приложение загружено
  useEffect(() => {
    if (webApp && isReady) {
      webApp.ready();
    }
  }, [webApp, isReady]);

  // Для отладки
  useEffect(() => {
    if (isAppInitialized) {
      console.log(`App: Current stage: ${currentStage}, caseId: ${currentCaseId || 'none'}, categoryId: ${currentCategoryId || 'none'}`);
    }
  }, [currentStage, currentCaseId, currentCategoryId, isAppInitialized]);

  if (!isReady || !isAppInitialized) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Выбор компонента в зависимости от текущего этапа
  const renderContent = () => {
    switch (currentStage) {
      case 'categories':
        return <CategoryLibrary />;
      case 'cases':
        return <CaseSelector />;
      case 'patient-notes':
      case 'patient-stories':
      case 'consultation':
      case 'diagnosis':
      case 'treatment':
      case 'results':
      case 'expert-comment':
        // Для этапов кейса проверяем наличие данных
        if (!currentCaseId || caseLoading || !caseDetail) {
          return (
            <div className="flex items-center justify-center h-screen">
              <LoadingSpinner size="lg" />
            </div>
          );
        }

        // Оборачиваем в SidebarLayout только компоненты этапов кейса
        return (
          <SidebarLayout>
            {renderCaseStage()}
          </SidebarLayout>
        );
      default:
        return <CategoryLibrary />;
    }
  };

  // Отрисовка конкретного этапа кейса
  const renderCaseStage = () => {
    if (!caseDetail) return null;

    switch (currentStage) {
      case 'patient-notes':
        return <PatientNotes caseDetail={caseDetail} />;
      case 'patient-stories':
        return <PatientStories caseDetail={caseDetail} />;
      case 'consultation':
        return <ConsultationTransition caseDetail={caseDetail} />;
      case 'diagnosis':
        return <DiagnosticModule caseDetail={caseDetail} />;
      case 'treatment':
        return <TreatmentModule caseDetail={caseDetail} />;
      case 'results':
        return <ResultsModule caseDetail={caseDetail} />;
      case 'expert-comment':
        return <ExpertCommentary caseDetail={caseDetail} />;
      default:
        return null;
    }
  };

  // Обработчик для возврата к списку категорий
  const handleReturnToCategories = () => {
    console.log('App: returning to categories list');
    setStage('categories');
  };

  // Проверка - сейчас мы внутри кейса?
  const isInCase = ['patient-notes', 'patient-stories', 'consultation', 
                    'diagnosis', 'treatment', 'results', 'expert-comment'].includes(currentStage);

  return (
    <MainLayout showNavMap={isInCase}>
      {renderContent()}
      
      {/* Кнопка для возврата к списку категорий из любого места приложения */}
      {/* {(currentStage !== 'categories' && process.env.NODE_ENV === 'development') && (
        <div className="fixed top-4 left-4 z-50">
          <button
            onClick={handleReturnToCategories}
            className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm shadow-md"
          >
            К категориям
          </button>
        </div>
      )} */}
      
      {/* Отладочная информация в режиме разработки */}
      {showDebug && (
        <div className="fixed bottom-0 left-0 right-0 bg-black/80 text-white text-xs p-2 z-50">
          <div className="flex justify-between items-center">
            <span>Стадия: <b>{currentStage}</b></span>
            <button 
              onClick={() => setShowDebug(false)}
              className="text-xs bg-red-500 text-white px-2 py-0.5 rounded"
            >
              Скрыть
            </button>
          </div>
          <div>
            {currentCategoryId ? (
              <span>Категория: <b>{currentCategoryId}</b></span>
            ) : (
              <span>Категория: не выбрана</span>
            )}
          </div>
          <div>
            {currentCaseId ? (
              <span>Кейс: <b>{currentCaseId}</b></span>
            ) : (
              <span>Кейс: не выбран</span>
            )}
          </div>
          <div>
            Компонент: <b>{renderContent().type?.name || 'Unknown'}</b>
          </div>
        </div>
      )}
      
      {/* Переключатель платформы в режиме разработки */}
      {process.env.NODE_ENV === 'development' && <PlatformSwitcher />}
    </MainLayout>
  );
};

export default App;