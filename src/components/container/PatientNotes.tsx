import React, { useEffect } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { CaseNavigation } from '../base/CaseNavigation';

interface PatientNotesProps {
  caseDetail: CaseDetail;
}

export const PatientNotes: React.FC<PatientNotesProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();

  useEffect(() => {
    // Логируем при монтировании для отладки
    console.log('PatientNotes component mounted:', caseDetail?.title);
  }, [caseDetail]);

  const handleContinue = () => {
    console.log('PatientNotes: continuing to next stage (patient-stories)');
    setStage('patient-stories');
  };

  const handleBack = () => {
    console.log('PatientNotes: going back to cases list');
    goBack();
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">{caseDetail.title}</h1>
        <p className="text-sm opacity-90">Заметки о пациенте</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        {caseDetail.patientNotes.map((note, index) => (
          <div key={index} className="mb-6 bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-bold mb-2">{note.title}</h2>
            <div className="whitespace-pre-line text-gray-700">
              {note.content}
            </div>
          </div>
        ))}
        
        {/* Кнопка продолжения для лучшей видимости */}
        <div className="mt-8">
          <button 
            onClick={handleContinue}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium"
          >
            Продолжить
          </button>
        </div>
      </div>

      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text="Продолжить"
        onClick={handleContinue}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText="Продолжить"
        onMainButtonClick={handleContinue}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};