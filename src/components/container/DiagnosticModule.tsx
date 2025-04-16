import React, { useState, useEffect } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { CaseNavigation } from '../base/CaseNavigation';
interface DiagnosticModuleProps {
  caseDetail: CaseDetail;
}

export const DiagnosticModule: React.FC<DiagnosticModuleProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    console.log('DiagnosticModule component mounted');
    console.log('Diagnosis options available:', caseDetail.diagnosisOptions.length);
  }, [caseDetail]);

  const handleContinue = () => {
    if (showResult) {
      console.log('DiagnosticModule: continuing to treatment stage');
      setStage('treatment');
    } else {
      console.log('DiagnosticModule: showing diagnosis result');
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (showResult) {
      console.log('DiagnosticModule: hiding result, back to selection');
      setShowResult(false);
    } else {
      console.log('DiagnosticModule: going back to consultation');
      goBack();
    }
  };

  const correctDiagnosis = caseDetail.diagnosisOptions.find(d => d.isCorrect);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">Диагностика</h1>
        <p className="text-sm opacity-90">Выберите диагноз на основе собранной информации</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        {!showResult ? (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h2 className="text-lg font-bold mb-4">Выберите наиболее вероятный диагноз:</h2>
            <div className="space-y-3">
              {caseDetail.diagnosisOptions.map((option) => (
                <div 
                  key={option.id} 
                  className={`
                    p-3 border rounded-lg cursor-pointer transition-colors
                    ${selectedDiagnosis === option.id 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-200 hover:bg-gray-50'}
                  `}
                  onClick={() => setSelectedDiagnosis(option.id)}
                >
                  <div className="flex items-center">
                    <div className={`
                      w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                      ${selectedDiagnosis === option.id ? 'border-primary' : 'border-gray-300'}
                    `}>
                      {selectedDiagnosis === option.id && (
                        <div className="w-3 h-3 rounded-full bg-primary" />
                      )}
                    </div>
                    <span className="font-medium">{option.name}</span>
                  </div>
                </div>
              ))}
            </div>
            {/* Кнопка подтверждения диагноза для лучшей видимости */}
            <div className="mt-6">
              <button 
                onClick={handleContinue}
                disabled={!selectedDiagnosis}
                className={`w-full py-3 rounded-lg font-medium ${
                  selectedDiagnosis 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Подтвердить диагноз
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`
              p-4 rounded-xl shadow-md
              ${selectedDiagnosis === correctDiagnosis?.id
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'}
            `}>
              <h2 className="text-lg font-bold mb-2">
                {selectedDiagnosis === correctDiagnosis?.id
                  ? 'Правильный диагноз!'
                  : 'Диагноз неверный'}
              </h2>
              
              <p className="mb-2">
                Вы выбрали: <span className="font-semibold">
                  {caseDetail.diagnosisOptions.find(d => d.id === selectedDiagnosis)?.name || 'Не выбрано'}
                </span>
              </p>
              
              <div className="mt-4">
                <h3 className="font-semibold mb-1">Верный диагноз:</h3>
                <p className="font-medium text-green-800">{correctDiagnosis?.name}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-md p-4">
              <h3 className="font-bold mb-2">Обоснование:</h3>
              <p className="text-gray-700">
                {caseDetail.diagnosisOptions.find(d => d.isCorrect)?.explanation}
              </p>
            </div>

            {/* Кнопка перехода к лечению для лучшей видимости */}
            <div className="mt-6">
              <button 
                onClick={handleContinue}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium"
              >
                Перейти к лечению
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text={showResult ? "Перейти к лечению" : "Подтвердить диагноз"}
        onClick={handleContinue}
        disabled={!showResult && !selectedDiagnosis}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText={showResult ? "Перейти к лечению" : "Подтвердить диагноз"}
        onMainButtonClick={handleContinue}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};