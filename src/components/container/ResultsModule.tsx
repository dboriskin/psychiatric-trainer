import React, { useState, useEffect } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback, useTelegram } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { ProgressIndicator } from '../base';
import { CaseNavigation } from '../base/CaseNavigation';
import { useProgress } from '../../hooks/useProgress';

interface ResultsModuleProps {
  caseDetail: CaseDetail;
}

// Компонент для отображения сравнения состояния до и после лечения
const BeforeAfterComparison: React.FC<{ treatment: any }> = ({ treatment }) => {
  // Данные для визуализации изменений (примеры)
  const symptomChanges = [
    { 
      name: "Настроение", 
      before: 20, 
      after: 70,
      changeDirection: "up"
    },
    { 
      name: "Интерес к деятельности", 
      before: 15, 
      after: 65,
      changeDirection: "up"
    },
    { 
      name: "Качество сна", 
      before: 30, 
      after: 75,
      changeDirection: "up"
    },
    { 
      name: "Энергия", 
      before: 25, 
      after: 70,
      changeDirection: "up"
    },
    { 
      name: "Аппетит", 
      before: 40, 
      after: 80,
      changeDirection: "up"
    },
    { 
      name: "Тревога", 
      before: 75, 
      after: 35,
      changeDirection: "down"
    },
    { 
      name: "Негативные мысли", 
      before: 85, 
      after: 40,
      changeDirection: "down"
    }
  ];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
      <h3 className="font-bold mb-4">Динамика симптомов</h3>
      
      <div className="space-y-4">
        {symptomChanges.map((symptom, index) => (
          <div key={index}>
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">{symptom.name}</span>
              <span className="text-sm text-gray-500 flex items-center">
                {symptom.changeDirection === "up" ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                  </svg>
                )}
                {Math.abs(symptom.after - symptom.before)}%
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* До лечения */}
              <div className="w-1/2">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-red-400 rounded-full" 
                    style={{ width: `${symptom.before}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">До лечения</div>
              </div>
              
              {/* После лечения */}
              <div className="w-1/2">
                <div className="h-2 w-full bg-gray-200 rounded-full">
                  <div 
                    className="h-2 bg-green-500 rounded-full" 
                    style={{ width: `${symptom.after}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1">После лечения</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ResultsModule: React.FC<ResultsModuleProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [viewedOptions, setViewedOptions] = useState<string[]>([]);
  const { webApp } = useTelegram();
  const { completeStage } = useProgress();
  
  useEffect(() => {
    console.log('ResultsModule component mounted');
    
    // Автоматически отмечаем все опции как просмотренные для демо-версии
    const allOptionIds = caseDetail.treatmentOptions.map(option => option.id);
    setViewedOptions(allOptionIds);
    
    console.log('All treatment options marked as viewed for demo purposes');
  }, [caseDetail]);
  
  const handleViewOption = (optionId: string) => {
    setSelectedOption(optionId);
    if (!viewedOptions.includes(optionId)) {
      setViewedOptions([...viewedOptions, optionId]);
    }
    
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.selectionChanged();
    }
  };

  const handleContinue = () => {
    console.log('ResultsModule: continuing to expert comment stage');
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('success');
    }
    
    // Отмечаем этап как завершенный
    completeStage('results');
    
    // Переходим к следующему этапу
    setStage('expert-comment');
  };

  const handleBack = () => {
    console.log('ResultsModule: going back to treatment');
    goBack();
  };

  const allOptionsViewed = viewedOptions.length === caseDetail.treatmentOptions.length;
  const progressPercentage = (viewedOptions.length / caseDetail.treatmentOptions.length) * 100;
  
  // Находим текущий выбранный вариант лечения
  const currentOption = caseDetail.treatmentOptions.find(option => option.id === selectedOption);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">Результаты лечения</h1>
        <p className="text-sm opacity-90">Изучите результаты различных вариантов лечения</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        {/* Блок с прогрессом изучения вариантов */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Варианты лечения:</h2>
            <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Изучено: {viewedOptions.length}/{caseDetail.treatmentOptions.length}
            </div>
          </div>
          
          <ProgressIndicator value={progressPercentage} size="md" />
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {caseDetail.treatmentOptions.map((option) => (
              <div 
                key={option.id} 
                className={`
                  p-3 border rounded-lg cursor-pointer transition-all duration-200
                  ${selectedOption === option.id 
                    ? 'border-primary bg-primary/10 shadow transform scale-[1.02]' 
                    : viewedOptions.includes(option.id)
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'}
                `}
                onClick={() => handleViewOption(option.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{option.name}</h3>
                  {viewedOptions.includes(option.id) && (
                    <span className="flex items-center text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Изучено
                    </span>
                  )}
                </div>
                
                {option.isRecommended && (
                  <div className="mt-1 flex items-center text-xs text-green-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Рекомендуемая стратегия
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Анимированная подсказка, если не все варианты просмотрены */}
          {!allOptionsViewed && (
            <div className="mt-4 text-center text-primary text-sm animate-pulse">
              Изучите все варианты, чтобы разблокировать расширенный комментарий эксперта
            </div>
          )}
        </div>

        {/* Детальный результат выбранного варианта */}
        {selectedOption && (
          <>
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex items-start mb-4">
                <div className={`rounded-lg p-2 mr-3 ${currentOption?.isRecommended ? 'bg-green-100' : 'bg-blue-100'}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${currentOption?.isRecommended ? 'text-green-600' : 'text-blue-600'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {currentOption?.name}
                    {currentOption?.isRecommended && (
                      <span className="ml-2 text-xs font-normal bg-green-100 text-green-800 py-1 px-2 rounded-full">
                        Рекомендуемый вариант
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">{currentOption?.description}</p>
                </div>
              </div>
              
              {/* Результаты лечения */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-bold mb-2">Результаты:</h4>
                <p className="text-gray-800 whitespace-pre-line">{currentOption?.outcomes}</p>
              </div>
            </div>
            
            {/* Визуализация "до/после" */}
            <BeforeAfterComparison treatment={currentOption} />
            
            {/* Рекомендации */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <h3 className="font-bold mb-3">Рекомендации по дальнейшему ведению</h3>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Регулярный мониторинг состояния</p>
                    <p className="text-xs text-gray-600">Повторная оценка по шкалам EPDS каждые 2 недели</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Поддержка грудного вскармливания</p>
                    <p className="text-xs text-gray-600">Консультация специалиста по лактации при необходимости</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Привлечение семьи к поддержке</p>
                    <p className="text-xs text-gray-600">Семейное консультирование и обучение родственников</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-green-100 p-1 rounded-full mr-3 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Профилактика рецидива</p>
                    <p className="text-xs text-gray-600">Продолжение терапии минимум 6-12 месяцев после ремиссии</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
        
        {/* Блок разблокировки расширенного комментария */}
        <div className={`bg-white rounded-xl shadow-md p-4 mb-6 ${allOptionsViewed ? 'border-2 border-green-500' : 'border border-gray-200'}`}>
          <div className="flex items-start">
            <div className={`p-2 rounded-full mr-3 ${allOptionsViewed ? 'bg-green-100' : 'bg-gray-100'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${allOptionsViewed ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {allOptionsViewed ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                )}
              </svg>
            </div>
            <div>
              <h3 className="font-bold mb-1">Расширенный комментарий эксперта</h3>
              {allOptionsViewed ? (
                <div>
                  <p className="text-sm text-green-700 mb-2">
                    Поздравляем! Вы изучили все варианты лечения и разблокировали расширенный комментарий эксперта.
                  </p>
                  <button 
                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-primary text-white rounded-lg"
                    onClick={handleContinue}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Перейти к комментарию
                  </button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Изучите все варианты лечения, чтобы разблокировать расширенный комментарий эксперта.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Навигация между вариантами */}
        {selectedOption && caseDetail.treatmentOptions.length > 1 && (
          <div className="fixed bottom-24 right-4 left-4 z-20 flex justify-between">
            <button 
              className="bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2"
              onClick={() => {
                const index = caseDetail.treatmentOptions.findIndex(o => o.id === selectedOption);
                if (index > 0) {
                  handleViewOption(caseDetail.treatmentOptions[index - 1].id);
                }
              }}
              disabled={caseDetail.treatmentOptions.findIndex(o => o.id === selectedOption) === 0}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            <button 
              className="bg-white/80 backdrop-blur-sm shadow-md rounded-full p-2"
              onClick={() => {
                const index = caseDetail.treatmentOptions.findIndex(o => o.id === selectedOption);
                if (index < caseDetail.treatmentOptions.length - 1) {
                  handleViewOption(caseDetail.treatmentOptions[index + 1].id);
                }
              }}
              disabled={caseDetail.treatmentOptions.findIndex(o => o.id === selectedOption) === caseDetail.treatmentOptions.length - 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text={allOptionsViewed 
          ? "К комментарию эксперта" 
          : "Продолжить"
        }
        onClick={handleContinue}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText={allOptionsViewed 
          ? "К комментарию эксперта" 
          : "Продолжить"
        }
        onMainButtonClick={handleContinue}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};