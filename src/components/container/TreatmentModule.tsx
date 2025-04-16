import React, { useState, useEffect } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { CaseNavigation } from '../base/CaseNavigation';

interface TreatmentModuleProps {
  caseDetail: CaseDetail;
}

export const TreatmentModule: React.FC<TreatmentModuleProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);

  useEffect(() => {
    console.log('TreatmentModule component mounted');
    console.log('Treatment options available:', caseDetail.treatmentOptions.length);
  }, [caseDetail]);

  const handleContinue = () => {
    console.log('TreatmentModule: continuing to results stage');
    setStage('results');
  };

  const handleBack = () => {
    console.log('TreatmentModule: going back to diagnosis');
    goBack();
  };

  const recommendedTreatment = caseDetail.treatmentOptions.find(t => t.isRecommended);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">План лечения</h1>
        <p className="text-sm opacity-90">Выберите оптимальную стратегию лечения</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h2 className="text-lg font-bold mb-4">Выберите стратегию лечения:</h2>
          <div className="space-y-4">
            {caseDetail.treatmentOptions.map((option) => (
              <div 
                key={option.id} 
                className={`
                  p-4 border rounded-lg cursor-pointer transition-colors
                  ${selectedTreatment === option.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 hover:bg-gray-50'}
                `}
                onClick={() => setSelectedTreatment(option.id)}
              >
                <div className="flex items-start">
                  <div className={`
                    w-5 h-5 rounded-full border-2 mt-1 mr-3 flex-shrink-0 flex items-center justify-center
                    ${selectedTreatment === option.id ? 'border-primary' : 'border-gray-300'}
                  `}>
                    {selectedTreatment === option.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{option.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedTreatment && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h3 className="font-bold mb-2">Подробная информация:</h3>
            <p className="mb-4">
              {caseDetail.treatmentOptions.find(t => t.id === selectedTreatment)?.description}
            </p>
            
            {selectedTreatment === recommendedTreatment?.id && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                <p className="text-green-800 font-medium">
                  Это рекомендуемая стратегия лечения для данного случая.
                </p>
              </div>
            )}
          </div>
        )}
        
        {/* Кнопка продолжения для лучшей видимости */}
        <div className="mt-6">
          <button 
            onClick={handleContinue}
            disabled={!selectedTreatment}
            className={`w-full py-3 rounded-lg font-medium ${
              selectedTreatment 
                ? 'bg-primary text-white' 
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Перейти к результатам
          </button>
        </div>
      </div>

      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text="Перейти к результатам"
        onClick={handleContinue}
        disabled={!selectedTreatment}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText="Перейти к результатам"
        onMainButtonClick={handleContinue}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};