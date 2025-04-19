import React, { useState, useEffect, useRef } from 'react';
import { useTelegram } from '../telegram/TelegramProvider';

interface Story {
  id: string;
  title: string;
  content: React.ReactNode;
  backgroundImage?: string;
}

interface StorySliderProps {
  stories: Story[];
  onComplete?: () => void;
  autoAdvance?: boolean;
  autoAdvanceDelay?: number; // in milliseconds
  className?: string;
}

export const StorySlider: React.FC<StorySliderProps> = ({
  stories,
  onComplete,
  autoAdvance = false,
  autoAdvanceDelay = 5000,
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progressTime, setProgressTime] = useState(0);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const { webApp } = useTelegram();
  
  const currentStory = stories[currentIndex];
  
  // Функция для перехода к предыдущему слайду
  const goToPrevious = () => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('light');
      }
      setCurrentIndex(currentIndex - 1);
      resetProgressTime();
      
      // Снимаем флаг перехода через небольшую задержку
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  };
  
  // Функция для перехода к следующему слайду
  const goToNext = () => {
    if (currentIndex < stories.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('light');
      }
      setCurrentIndex(currentIndex + 1);
      resetProgressTime();
      
      // Снимаем флаг перехода через небольшую задержку
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    } else if (currentIndex === stories.length - 1 && onComplete) {
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('success');
      }
      onComplete();
    }
  };
  
  // Сброс таймера прогресса
  const resetProgressTime = () => {
    setProgressTime(0);
    
    // Очищаем существующий интервал
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Устанавливаем новый интервал для обновления прогресса
    if (autoAdvance && !isPaused) {
      progressIntervalRef.current = setInterval(() => {
        setProgressTime(prev => {
          const newTime = prev + 100;
          // Если достигли 100%, переходим к следующему слайду
          if (newTime >= autoAdvanceDelay) {
            goToNext();
            return 0;
          }
          return newTime;
        });
      }, 100);
    }
  };
  
  // Обработчики касаний для свайпов
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setIsPaused(true);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null && touchStartY !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      
      const deltaX = touchStartX - touchEndX;
      const deltaY = touchStartY - touchEndY;
      
      // Определяем, был ли жест горизонтальным свайпом
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Свайп влево - следующий слайд
          goToNext();
        } else {
          // Свайп вправо - предыдущий слайд
          goToPrevious();
        }
      }
      
      setTouchStartX(null);
      setTouchStartY(null);
      setIsPaused(false);
    }
  };
  
  // Эффект для управления автоматическим переходом к следующему слайду
  useEffect(() => {
    resetProgressTime();
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentIndex, autoAdvance, isPaused]);
  
  // Обработчик нажатия на индикатор
  const handleIndicatorClick = (index: number) => {
    if (index !== currentIndex) {
      setCurrentIndex(index);
      resetProgressTime();
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('light');
      }
    }
  };
  
  return (
    <div 
      className={`relative h-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Progress Indicators */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4 flex space-x-1">
        {stories.map((_, index) => (
          <div 
            key={index} 
            className="relative h-1 rounded-full flex-grow overflow-hidden bg-white/40 cursor-pointer"
            onClick={() => handleIndicatorClick(index)}
          >
            {index === currentIndex && (
              <div 
                className="absolute top-0 left-0 h-full bg-white"
                style={{ 
                  width: `${(progressTime / autoAdvanceDelay) * 100}%`,
                  transition: isPaused ? 'none' : 'width 0.1s linear'
                }}
              />
            )}
            {index < currentIndex && (
              <div className="absolute top-0 left-0 h-full w-full bg-white" />
            )}
          </div>
        ))}
      </div>
      
      {/* Counter */}
      <div className="absolute top-4 right-4 z-10 bg-black/30 text-white px-2 py-1 rounded-full text-xs">
        {currentIndex + 1}/{stories.length}
      </div>
      
      {/* Story Content */}
      <div className="h-full w-full relative">
        {stories.map((story, index) => (
          <div 
            key={story.id} 
            className={`absolute top-0 left-0 h-full w-full transition-transform duration-300 ${
              index === currentIndex 
                ? 'translate-x-0 opacity-100 z-10' 
                : index < currentIndex 
                  ? '-translate-x-full opacity-0 z-0' 
                  : 'translate-x-full opacity-0 z-0'
            }`}
            style={{
              backgroundImage: story.backgroundImage ? `url(${story.backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="h-full w-full bg-gradient-to-t from-black/80 via-black/40 to-black/30 flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold text-white mb-2">{story.title}</h3>
              <div className="text-white mb-10">{story.content}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation Controls */}
      <div className="absolute inset-0 flex pointer-events-none">
        <div 
          className="w-1/4 h-full pointer-events-auto cursor-pointer"
          onClick={goToPrevious}
        />
        <div className="w-2/4 h-full" />
        <div 
          className="w-1/4 h-full pointer-events-auto cursor-pointer"
          onClick={goToNext}
        />
      </div>
      
      {/* Navigation Arrows */}
      <div className="absolute inset-y-0 left-4 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        {currentIndex > 0 && (
          <button 
            className="w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center"
            onClick={goToPrevious}
            aria-label="Предыдущая история"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}
      </div>
      <div className="absolute inset-y-0 right-4 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <button 
          className="w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center"
          onClick={goToNext}
          aria-label="Следующая история"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};