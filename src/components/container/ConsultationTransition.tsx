import React, { useEffect } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { CaseNavigation } from '../base/CaseNavigation';

interface ConsultationTransitionProps {
  caseDetail: CaseDetail;
}

export const ConsultationTransition: React.FC<ConsultationTransitionProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();

  useEffect(() => {
    console.log('ConsultationTransition component mounted');
    console.log('Chat ID available:', !!caseDetail.consultationChatId);
  }, [caseDetail]);

  const handleContinue = () => {
    console.log('ConsultationTransition: continuing to diagnosis stage');
    setStage('diagnosis');
  };

  const handleBack = () => {
    console.log('ConsultationTransition: going back to patient stories');
    goBack();
  };

  const handleOpenChat = () => {
    const chatId = caseDetail.consultationChatId;
    if (chatId) {
      console.log(`Opening Telegram chat with ID: ${chatId}`);
      // Открываем Telegram чат
      if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
        window.Telegram.WebApp.openTelegramLink(`https://t.me/${chatId}`);
      } else {
        // Для разработки просто показываем сообщение
        alert(`Будет открыт чат с ID: ${chatId}`);
      }
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">Консультация</h1>
        <p className="text-sm opacity-90">Переход к чат-группе</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Консультация с пациентом</h2>
          <p className="mb-4">
            Сейчас вы будете перенаправлены в специальную чат-группу Telegram, где пройдет симуляция консультации с пациентом. 
            В чате вы сможете наблюдать за диалогом и в некоторых моментах выбирать варианты ответов специалиста.
          </p>
          <p className="mb-6">
            После завершения консультации вернитесь сюда для продолжения клинического случая.
          </p>
          <button 
            className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium"
            onClick={handleOpenChat}
          >
            Перейти к чат-группе
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <p className="text-sm text-blue-700">
            <span className="font-bold">Подсказка:</span> После завершения консультации в чате, вернитесь сюда и нажмите кнопку «Продолжить» внизу экрана.
          </p>
        </div>
        
        {/* Кнопка продолжения для лучшей видимости */}
        <div className="mt-8">
          <button 
            onClick={handleContinue}
            className="w-full bg-primary text-white py-3 rounded-lg font-medium"
          >
            Продолжить к диагностике
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
        mainButtonText="Продолжить к диагностике"
        onMainButtonClick={handleContinue}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};