import React, { useEffect, useState } from 'react';
import { Card, Header, LoadingSpinner, StatusBadge, ProgressIndicator } from '../base';
import { useNavigationStore } from '../../store/navigationStore';
import { useCaseStore } from '../../store/caseStore';
import { Case } from '../../services/api';
import { useTelegram, TelegramMainButton, TelegramBackButton, ButtonFallback } from '../telegram';
// Импортируем мок-данные напрямую
import { getCasesByCategory } from '../../mocks/data/cases';

export const CaseSelector: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const { setStage, goBack, enterCase } = useNavigationStore();
  const { currentCategoryId, setCurrentCase } = useCaseStore();
  const { webApp, isMocked } = useTelegram();

  useEffect(() => {
    const loadCases = async () => {
      if (!currentCategoryId) {
        setStage('categories');
        return;
      }

      // Имитируем загрузку данных
      setLoading(true);
      
      // Используем таймаут для эмуляции сетевого запроса
      setTimeout(() => {
        const data = getCasesByCategory(currentCategoryId);
        setCases(data);
        setLoading(false);
      }, 500);
    };

    loadCases();
  }, [currentCategoryId, setStage]);

  const handleCaseClick = (caseItem: Case) => {
    if (!caseItem.isAvailable) return;
    
    // Установка текущего кейса в состояние
    setCurrentCase(caseItem.id);
    
    // Используем новый метод enterCase для перехода к последнему посещенному этапу кейса
    // или к начальному этапу, если кейс посещается впервые
    enterCase(caseItem.id);
    
    // Выводим в консоль для отладки
    console.log(`Selected case: ${caseItem.id}, navigating using enterCase method`);
  };

  const handleBackToCategoriesClick = () => {
    console.log('CaseSelector: going back to categories');
    setStage('categories');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Get the category name for the header
  const categoryName = cases.length > 0 
    ? cases[0].categoryId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Клинические случаи';

  return (
    <div className="min-h-screen pb-16">
      <Header 
        title={categoryName}
        subtitle="Выберите клинический случай"
      />

      <main className="container-padding">
        {/* Кнопка возврата к категориям */}
        <div className="mb-4">
          <button
            className="text-primary flex items-center"
            onClick={handleBackToCategoriesClick}
          >
            <span className="mr-1">←</span> К списку категорий
          </button>
        </div>

        <div className="space-y-4">
          {cases.map((caseItem) => (
            <Card 
              key={caseItem.id}
              onClick={() => handleCaseClick(caseItem)}
              className={`${!caseItem.isAvailable ? 'opacity-70' : ''}`}
            >
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold">{caseItem.title}</h3>
                  {caseItem.progress !== undefined && caseItem.progress > 0 && (
                    <StatusBadge 
                      label={caseItem.completed ? "Завершено" : "В процессе"} 
                      variant={caseItem.completed ? "success" : "info"} 
                    />
                  )}
                </div>
                
                <p className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold">Пациент:</span> {caseItem.patientName}, {caseItem.patientAge} лет
                </p>
                
                <p className="text-sm text-gray-600 mb-3">{caseItem.shortDescription}</p>
                
                {caseItem.progress !== undefined && caseItem.progress > 0 && (
                  <div className="mt-2">
                    <ProgressIndicator 
                      value={caseItem.progress} 
                      size="sm" 
                      showValue 
                    />
                  </div>
                )}
                
                <div className="mt-3">
                  <button 
                    className="bg-primary text-white py-1 px-3 rounded-md text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCaseClick(caseItem);
                    }}
                  >
                    {caseItem.progress ? 'Продолжить' : 'Начать'}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      {/* Back button for navigation */}
      <TelegramBackButton onClick={handleBackToCategoriesClick} />

      {/* Main button for starting the first case */}
      {cases.length > 0 && (
        <TelegramMainButton
          text={cases[0].progress ? 'Продолжить последний' : 'Начать первый случай'}
          onClick={() => handleCaseClick(cases[0])}
        />
      )}
      
      {/* Fallback кнопки для браузера - показываются только в режиме отладки */}
      {isMocked && (
        <ButtonFallback
          mainButtonText={cases.length > 0 && cases[0].progress ? 'Продолжить последний' : 'Начать первый случай'}
          onMainButtonClick={() => cases.length > 0 && handleCaseClick(cases[0])}
          onBackButtonClick={handleBackToCategoriesClick}
        />
      )}
    </div>
  );
};