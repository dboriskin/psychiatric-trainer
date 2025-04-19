import React, { useState, useEffect } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback, useTelegram } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { StorySlider } from '../base/StorySlider';
import { CaseNavigation } from '../base/CaseNavigation';
import { useProgress } from '../../hooks/useProgress';

interface PatientStoriesProps {
  caseDetail: CaseDetail;
}

export const PatientStories: React.FC<PatientStoriesProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();
  const [storyComplete, setStoryComplete] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const { webApp } = useTelegram();
  const { completeStage } = useProgress();

  useEffect(() => {
    console.log('PatientStories component mounted:', caseDetail?.title);
    console.log('Stories available:', caseDetail?.patientStories?.length || 0);
  }, [caseDetail]);

  const handleContinue = () => {
    console.log('PatientStories: continuing to next stage (consultation)');
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('success');
    }
    
    // Отмечаем этап как завершенный в хранилище прогресса
    completeStage('patient-stories');
    
    // Переходим к следующему этапу
    setStage('consultation');
  };

  const handleBack = () => {
    console.log('PatientStories: going back to patient notes');
    goBack();
  };

  const handleStoryComplete = () => {
    console.log('Story viewing completed');
    setStoryComplete(true);
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('success');
    }
  };

  const handleStoryChange = (index: number) => {
    setCurrentStoryIndex(index);
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.selectionChanged();
    }
  };

  // Преобразуем содержимое историй для улучшенного отображения
  const formatStoryContent = (content: string) => {
    // Разбиваем содержимое на параграфы
    const paragraphs = content.split('\n\n');
    
    return (
      <div className="space-y-3">
        {paragraphs.map((paragraph, idx) => {
          // Добавляем специальное форматирование для прямой речи
          if (paragraph.includes('"')) {
            return (
              <p key={idx} className="italic text-white font-medium">
                {paragraph}
              </p>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>
    );
  };

  // Преобразуем истории в формат, ожидаемый StorySlider
  const stories = caseDetail.patientStories.map(story => ({
    id: story.id,
    title: story.title,
    content: formatStoryContent(story.content),
    backgroundImage: story.backgroundImage || `https://via.placeholder.com/800x1200/333333/FFFFFF?text=${encodeURIComponent(story.title)}`
  }));

  return (
    <div className="h-screen relative">
      {/* Индикатор текущей стадии */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent pt-2 pb-8 pointer-events-none">
        <div className="px-4">
          <p className="text-white/90 text-sm font-medium mb-1">История пациента</p>
          <h2 className="text-white text-xl font-bold">{caseDetail.patientName}, {caseDetail.patientAge} лет</h2>
        </div>
      </div>
      
      {/* Навигация для возврата к списку кейсов и категорий */}
      <div className="absolute top-4 left-4 z-10 bg-black/30 p-2 rounded-lg backdrop-blur-sm">
        <CaseNavigation />
      </div>
      
      {/* Индикатор завершения */}
      {storyComplete && (
        <div className="absolute top-20 right-4 z-10 bg-green-500 text-white px-3 py-1 rounded-full text-sm animate-pulse">
          Готово!
        </div>
      )}
      
      {/* Слайдер историй */}
      <StorySlider 
        stories={stories}
        onComplete={handleStoryComplete}
        className="h-full"
        autoAdvance={true}
        autoAdvanceDelay={8000}
      />
      
      {/* Подсказка по свайпам */}
      <div className="absolute bottom-24 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <div className="bg-black/40 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
          <span className="mr-2">←</span> Свайп для навигации <span className="ml-2">→</span>
        </div>
      </div>
      
      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text={storyComplete ? "Продолжить" : "Пропустить историю"}
        onClick={handleContinue}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText={storyComplete ? "Продолжить" : "Пропустить историю"}
        onMainButtonClick={handleContinue}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};