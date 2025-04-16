import React, { useState, useEffect } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { ProgressIndicator } from '../base';
import { CaseNavigation } from '../base/CaseNavigation';

interface ResultsModuleProps {
  caseDetail: CaseDetail;
}

export const ResultsModule: React.FC<ResultsModuleProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [viewedOptions, setViewedOptions] = useState<string[]>([]);
  
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
  };

  const handleContinue = () => {
    console.log('ResultsModule: continuing to expert comment stage');
    setStage('expert-comment');
  };

  const handleBack = () => {
    console.log('ResultsModule: going back to treatment');
    goBack();
  };

  const allOptionsViewed = viewedOptions.length === caseDetail.treatmentOptions.length;
  const progressPercentage = (viewedOptions.length / caseDetail.treatmentOptions.length) * 100;

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">Результаты лечения</h1>
        <p className="text-sm opacity-90">Изучите результаты различных вариантов лечения</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Варианты лечения:</h2>
            <div className="text-sm text-gray-600">
              Изучено: {viewedOptions.length}/{caseDetail.treatmentOptions.length}
            </div>
          </div>
          
          <ProgressIndicator value={progressPercentage} size="md" />
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {caseDetail.treatmentOptions.map((option) => (
              <div 
                key={option.id} 
                className={`
                  p-3 border rounded-lg cursor-pointer transition-colors
                  ${selectedOption === option.id 
                    ? 'border-primary bg-primary/10' 
                    : viewedOptions.includes(option.id)
                      ? 'border-green-300 bg-green-50'
                      : 'border-gray-200 hover:bg-gray-50'}
                `}
                onClick={() => handleViewOption(option.id)}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{option.name}</h3>
                  {viewedOptions.includes(option.id) && (
                    <span className="text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                      Изучено
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedOption && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h3 className="font-bold mb-3">
              {caseDetail.treatmentOptions.find(t => t.id === selectedOption)?.name}
            </h3>
            
            <div className="mb-4">
              <h4 className="font-semibold text-sm text-gray-600 mb-1">Описание лечения:</h4>
              <p className="text-gray-800">
                {caseDetail.treatmentOptions.find(t => t.id === selectedOption)?.description}
              </p>
            </div>
            
            <div className="mt-4">
              <h4 className="font-semibold text-sm text-gray-600 mb-1">Результаты:</h4>
              <p className="text-gray-800">
                {caseDetail.treatmentOptions.find(t => t.id === selectedOption)?.outcomes}
              </p>
            </div>
            
            {caseDetail.treatmentOptions.find(t => t.id === selectedOption)?.isRecommended && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-green-800 font-medium">
                  Это рекомендуемая стратегия лечения для данного случая.
                </p>
              </div>
            )}
          </div>
        )}
        
        {!allOptionsViewed && (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-3 mt-4 mb-6">
            <p className="text-sm text-yellow-800">
              <span className="font-bold">Подсказка:</span> Изучите все варианты лечения, чтобы получить доступ к расширенному комментарию эксперта.
            </p>
          </div>
        )}
        
        {/* Кнопка перехода к комментарию эксперта для лучшей видимости */}
        <div className="mt-6">
          <button 
            onClick={handleContinue}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium"
          >
            {allOptionsViewed 
              ? "Перейти к комментарию эксперта" 
              : "Продолжить"
            }
          </button>
        </div>
      </div>

      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text={allOptionsViewed 
          ? "Перейти к комментарию эксперта" 
          : "Продолжить"
        }
        onClick={handleContinue}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText={allOptionsViewed 
          ? "Перейти к комментарию эксперта" 
          : "Продолжить"
        }
        onMainButtonClick={handleContinue}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};