import React, { useState, useEffect } from 'react';

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
  
  const currentStory = stories[currentIndex];
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (onComplete) {
      onComplete();
    }
  };
  
  // Auto-advance timer
  useEffect(() => {
    if (autoAdvance && !isPaused) {
      const timer = setTimeout(goToNext, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, autoAdvance, isPaused]);
  
  return (
    <div 
      className={`relative h-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Progress Indicators */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4 flex space-x-1">
        {stories.map((_, index) => (
          <div 
            key={index} 
            className={`h-1 rounded-full flex-grow ${
              index < currentIndex ? 'bg-white' : 
              index === currentIndex ? 'bg-white/80' : 
              'bg-white/40'
            }`}
          />
        ))}
      </div>
      
      {/* Story Content */}
      <div 
        className="h-full w-full"
        style={{
          backgroundImage: currentStory.backgroundImage ? `url(${currentStory.backgroundImage})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="h-full w-full bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-xl font-bold text-white mb-2">{currentStory.title}</h3>
          <div className="text-white mb-10">{currentStory.content}</div>
        </div>
      </div>
      
      {/* Navigation Controls */}
      <div 
        className="absolute left-0 top-0 h-full w-1/4 cursor-pointer"
        onClick={goToPrevious}
      />
      <div 
        className="absolute right-0 top-0 h-full w-1/4 cursor-pointer"
        onClick={goToNext}
      />
    </div>
  );
};