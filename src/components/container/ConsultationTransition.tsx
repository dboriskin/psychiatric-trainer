import React, { useEffect, useState } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback, useTelegram } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { CaseNavigation } from '../base/CaseNavigation';
import { useProgress } from '../../hooks/useProgress';

interface ConsultationTransitionProps {
  caseDetail: CaseDetail;
}

export const ConsultationTransition: React.FC<ConsultationTransitionProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();
  const { webApp } = useTelegram();
  const { completeStage, isStageCompleted } = useProgress();
  const [consultationStarted, setConsultationStarted] = useState(false);
  const [consultationCompleted, setConsultationCompleted] = useState(false);
  
  // Для демонстрационных целей, в реальном приложении это будет выводиться из состояния прогресса
  const hasCompletedConsultation = isStageCompleted('consultation');

  useEffect(() => {
    console.log('ConsultationTransition component mounted');
    console.log('Chat ID available:', !!caseDetail.consultationChatId);
    
    // Проверяем, был ли уже завершен этап консультации
    if (hasCompletedConsultation) {
      setConsultationCompleted(true);
    }
  }, [caseDetail, hasCompletedConsultation]);

  const handleContinue = () => {
    console.log('ConsultationTransition: continuing to diagnosis stage');
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('success');
    }
    
    // Отмечаем этап как завершенный
    completeStage('consultation');
    
    // Переходим к следующему этапу
    setStage('diagnosis');
  };

  const handleBack = () => {
    console.log('ConsultationTransition: going back to patient stories');
    goBack();
  };

  const handleOpenChat = () => {
    const chatId = caseDetail.consultationChatId;
    
    // Отмечаем, что консультация началась
    setConsultationStarted(true);
    
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred('medium');
    }
    
    if (chatId) {
      console.log(`Opening Telegram chat with ID: ${chatId}`);
      // Открываем Telegram чат
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/${chatId}`);
      } else {
        // Для разработки просто показываем сообщение
        alert(`Будет открыт чат с ID: ${chatId}`);
        
        // Для демонстрационных целей, имитируем завершение консультации через 3 секунды
        setTimeout(() => {
          setConsultationCompleted(true);
        }, 3000);
      }
    }
  };
  
  // Для отображения условной цепочки сообщений
  const ChatPreview = () => (
    <div className="mb-6 bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-bold">Предпросмотр консультации</h3>
      </div>
      <div className="p-4 bg-gray-50 max-h-60 overflow-y-auto">
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="w-8 h-8 bg-primary rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
              В
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
              <p className="text-sm">Здравствуйте, {caseDetail.patientName}! Меня зовут доктор Волков. Расскажите, что вас беспокоит?</p>
            </div>
          </div>
          
          <div className="flex gap-2 justify-end">
            <div className="bg-primary/10 p-3 rounded-lg shadow-sm max-w-[80%]">
              <p className="text-sm">Здравствуйте, доктор. Последнее время я чувствую себя очень плохо...</p>
            </div>
            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
              {caseDetail.patientName.charAt(0)}
            </div>
          </div>
          
          <div className="flex justify-center">
            <span className="text-xs text-gray-500">. . .</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">Консультация</h1>
        <p className="text-sm opacity-90">Переход к чат-группе</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        {/* Статус прогресса */}
        <div className="flex items-center mb-6">
          <div className={`w-3 h-3 rounded-full mr-2 ${consultationStarted ? (consultationCompleted ? 'bg-green-500' : 'bg-yellow-500') : 'bg-gray-300'}`}></div>
          <p className={`text-sm ${consultationStarted ? (consultationCompleted ? 'text-green-700 font-medium' : 'text-yellow-700') : 'text-gray-500'}`}>
            {consultationStarted 
              ? (consultationCompleted 
                ? 'Консультация завершена' 
                : 'Консультация начата')
              : 'Консультация не начата'}
          </p>
        </div>
        
        {/* Основная информация о консультации */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-start mb-4">
            <div className="bg-primary/20 rounded-full p-2 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-bold">Консультация с пациентом</h2>
              <p className="text-sm text-gray-600">
                Интерактивная симуляция клинической беседы
              </p>
            </div>
          </div>
          
          <p className="mb-4">
            Сейчас вы будете перенаправлены в специальную чат-группу Telegram, где пройдет симуляция консультации с пациентом {caseDetail.patientName}.
          </p>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-3 mb-4">
            <div className="flex">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-blue-700">
                В чате вы сможете наблюдать за диалогом и в некоторых моментах выбирать варианты ответов специалиста. Это поможет вам лучше понять клиническую картину и симптомы пациента.
              </p>
            </div>
          </div>
          
          {!consultationCompleted && (
            <button 
              className={`w-full ${consultationStarted ? 'bg-yellow-500' : 'bg-primary'} text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center`}
              onClick={handleOpenChat}
            >
              {consultationStarted ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Вернуться к чат-группе
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Перейти к чат-группе
                </>
              )}
            </button>
          )}
          
          {consultationCompleted && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              <div className="flex items-center mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <p className="font-medium">Консультация успешно завершена!</p>
              </div>
              <p className="text-sm">Вы можете продолжить к этапу диагностики.</p>
            </div>
          )}
        </div>

        {/* Предпросмотр чата */}
        <ChatPreview />

        {/* Подсказка */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
          <p className="text-sm text-yellow-700">
            <span className="font-bold">Подсказка:</span> После завершения консультации в чате, вернитесь сюда и нажмите кнопку «Продолжить» внизу экрана для перехода к этапу диагностики.
          </p>
        </div>
        
        {/* Список шагов */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h3 className="font-bold mb-3">Что ожидать в чате:</h3>
          <div className="space-y-3">
            <div className="flex">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">1</span>
              <p className="text-sm">Знакомство с пациентом и сбор жалоб</p>
            </div>
            <div className="flex">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">2</span>
              <p className="text-sm">Уточнение симптомов и их продолжительности</p>
            </div>
            <div className="flex">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">3</span>
              <p className="text-sm">Сбор анамнеза и социального контекста</p>
            </div>
            <div className="flex">
              <span className="bg-primary text-white w-5 h-5 rounded-full flex items-center justify-center text-xs mr-3 flex-shrink-0">4</span>
              <p className="text-sm">Оценка психического статуса</p>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text={consultationCompleted ? "К диагностике" : "Завершить консультацию"}
        onClick={handleContinue}
        disabled={!consultationCompleted && !hasCompletedConsultation}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText={consultationCompleted ? "К диагностике" : "Завершить консультацию"}
        onMainButtonClick={handleContinue}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};