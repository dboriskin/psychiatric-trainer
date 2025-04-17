import React, { useState, useEffect } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { useTelegram } from '../telegram/TelegramProvider';
import { CaseDetail } from '../../services/api';
import { useProgress } from '../../hooks/useProgress';
import { CaseNavigation } from '../base/CaseNavigation';

interface ExpertCommentaryProps {
  caseDetail: CaseDetail;
}

export const ExpertCommentary: React.FC<ExpertCommentaryProps> = ({ caseDetail }) => {
  const { goBack, setStage } = useNavigationStore();
  const { webApp } = useTelegram();
  const { progress, updateProgress } = useProgress();
  const [showExtended, setShowExtended] = useState(false);
  
  // Для демо-версии делаем все варианты просмотренными
  const allOptionsViewed = true;

  useEffect(() => {
    console.log('ExpertCommentary component mounted');
    console.log('Extended content available:', !!caseDetail.expertCommentary.extendedContent);
    
    // Устанавливаем флаг завершения случая при входе на этот экран
    if (progress && !progress.completed) {
      updateProgress({
        completed: true,
        currentStage: 'expert-comment',
        stagesCompleted: [...(progress.stagesCompleted || []), 'expert-comment']
      });
    }
  }, [caseDetail, progress, updateProgress]);

  const handleBack = () => {
    console.log('ExpertCommentary: going back to results');
    goBack();
  };

  const handleFinish = () => {
    console.log('ExpertCommentary: finishing the case');
    
    // В демо-режиме просто возвращаемся к списку категорий
    setStage('categories');
    
    // В реальном проекте мы бы отправили данные боту
    // if (webApp && webApp.sendData) {
    //   const result = { caseId: caseDetail.id, completed: true };
    //   webApp.sendData(JSON.stringify(result));
    // }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">{caseDetail.expertCommentary.title}</h1>
        <p className="text-sm opacity-90">Мнение специалиста</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        {/* Видеоплеер (заглушка) */}
        <div className="bg-gray-800 aspect-video rounded-xl flex items-center justify-center mb-6">
          <div className="text-white text-center p-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-white/80">Видео комментарий эксперта</p>
            <p className="text-xs text-white/60 mt-1">(Нажмите для воспроизведения)</p>
          </div>
        </div>

        {/* Базовый комментарий */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h2 className="text-lg font-bold mb-3">Комментарий эксперта</h2>
          <div className="text-gray-700 whitespace-pre-line">
            {caseDetail.expertCommentary.basicContent}
          </div>
        </div>

        {/* Расширенный комментарий (отображается только после изучения всех вариантов) */}
        {allOptionsViewed ? (
          <div className="bg-white rounded-xl shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-bold">Расширенный комментарий</h2>
              {!showExtended && (
                <button 
                  className="text-primary font-medium"
                  onClick={() => setShowExtended(true)}
                >
                  Показать
                </button>
              )}
            </div>
            
            {showExtended ? (
              <div className="text-gray-700 whitespace-pre-line">
                {caseDetail.expertCommentary.extendedContent}
              </div>
            ) : (
              <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
                <p>Расширенный комментарий доступен. Нажмите "Показать", чтобы увидеть дополнительную информацию от эксперта.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl shadow-md p-4 border border-gray-300">
            <div className="flex items-center space-x-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-500">Расширенный комментарий</h2>
            </div>
            <p className="text-gray-500">
              Чтобы разблокировать расширенный комментарий эксперта, вернитесь на экран результатов и изучите все варианты лечения.
            </p>
          </div>
        )}
      </div>

      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text="Завершить случай"
        onClick={handleFinish}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText="Завершить случай"
        onMainButtonClick={handleFinish}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};