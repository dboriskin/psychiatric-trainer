import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  currentIndex?: number;
  onIndexChange?: (index: number) => void;
}

export const StorySlider: React.FC<StorySliderProps> = ({
  stories,
  onComplete,
  autoAdvance = false,
  autoAdvanceDelay = 5000,
  className = '',
  currentIndex: externalIndex,
  onIndexChange,
}) => {
  // Use internal state if no external control is provided
  const [internalIndex, setInternalIndex] = useState(0);
  const currentIndex = externalIndex !== undefined ? externalIndex : internalIndex;
  
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [progressTime, setProgressTime] = useState(0);
  const [touchStartTime, setTouchStartTime] = useState<number | null>(null);
  const [isLongPress, setIsLongPress] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { webApp } = useTelegram();
  
  const currentStory = stories[currentIndex];
  
  // Update index - use callback to prevent function recreation on each render
  const updateIndex = useCallback((newIndex: number) => {
    if (externalIndex !== undefined && onIndexChange) {
      // If controlled externally, call the change handler
      onIndexChange(newIndex);
    } else {
      // Otherwise update internal state
      setInternalIndex(newIndex);
    }
  }, [externalIndex, onIndexChange]);
  
  // Function to go to previous slide
  const goToPrevious = useCallback(() => {
    if (currentIndex > 0 && !isTransitioning) {
      setIsTransitioning(true);
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('light');
      }
      
      updateIndex(currentIndex - 1);
      resetProgressTime();
      
      // Remove transition flag after animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentIndex, isTransitioning, webApp, updateIndex]);
  
  // Function to go to next slide
  const goToNext = useCallback(() => {
    if (currentIndex < stories.length - 1 && !isTransitioning) {
      setIsTransitioning(true);
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('light');
      }
      
      updateIndex(currentIndex + 1);
      resetProgressTime();
      
      // Remove transition flag after animation
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    } else if (currentIndex === stories.length - 1 && onComplete) {
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('success');
      }
      onComplete();
    }
  }, [currentIndex, stories.length, isTransitioning, onComplete, webApp, updateIndex]);
  
  // Reset progress timer
  const resetProgressTime = useCallback(() => {
    setProgressTime(0);
    
    // Clear existing interval
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    
    // Set up new interval for progress tracking
    if (autoAdvance && !isPaused) {
      progressIntervalRef.current = setInterval(() => {
        setProgressTime(prev => {
          const newTime = prev + 100;
          // If reached 100%, move to next slide
          if (newTime >= autoAdvanceDelay) {
            goToNext();
            return 0;
          }
          return newTime;
        });
      }, 100);
    }
  }, [autoAdvance, autoAdvanceDelay, isPaused, goToNext]);
  
  // Effect to handle auto-advance
  useEffect(() => {
    resetProgressTime();
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [currentIndex, autoAdvance, isPaused, resetProgressTime]);
  
  // Effect to handle external pause state changes
  useEffect(() => {
    if (!autoAdvance) {
      // If auto-advance is disabled, clear interval
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    } else {
      // If auto-advance is enabled, reset progress
      resetProgressTime();
    }
  }, [autoAdvance, resetProgressTime]);
  
  // Touch handlers for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
    setTouchStartTime(Date.now());
    
    // Set up long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      setIsPaused(prev => !prev); // Toggle pause on long press
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('medium');
      }
    }, 500); // 500ms for long press
    
    // If auto-advance is on, pause while touching
    if (autoAdvance) {
      setIsPaused(true);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    // Clear long press timer if finger moves significantly
    if (touchStartX !== null && touchStartY !== null) {
      const deltaX = Math.abs(e.touches[0].clientX - touchStartX);
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
      
      if (deltaX > 10 || deltaY > 10) {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      }
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Resume auto-advance if it was paused by touch
    if (autoAdvance && !isLongPress) {
      setIsPaused(false);
    }
    
    // Reset long press flag
    setIsLongPress(false);
    
    // Handle swipe if not a long press
    if (touchStartX !== null && touchStartY !== null && touchStartTime !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndTime = Date.now();
      
      const deltaX = touchStartX - touchEndX;
      const deltaY = touchStartY - touchEndY;
      const timeElapsed = touchEndTime - touchStartTime;
      
      // Only process as swipe if the gesture was quick enough (< 500ms)
      // and the movement was primarily horizontal
      if (timeElapsed < 500 && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          // Swipe left - next slide
          goToNext();
        } else {
          // Swipe right - previous slide
          goToPrevious();
        }
      }
      
      setTouchStartX(null);
      setTouchStartY(null);
      setTouchStartTime(null);
    }
  };
  
  // Handle mouse events for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    // Right-click is handled elsewhere for context menu (pause functionality)
    if (e.button !== 0) return;
    
    // Set up similar behavior to touch for left click
    setTouchStartTime(Date.now());
    setTouchStartX(e.clientX);
    setTouchStartY(e.clientY);
    
    // Set up long press timer for mouse
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
    
    longPressTimerRef.current = setTimeout(() => {
      setIsLongPress(true);
      setIsPaused(prev => !prev);
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('medium');
      }
    }, 800); // Slightly longer for mouse
    
    // If auto-advance is on, pause while mouse is down
    if (autoAdvance) {
      setIsPaused(true);
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    // Clear long press timer if mouse moves significantly
    if (touchStartX !== null && touchStartY !== null) {
      const deltaX = Math.abs(e.clientX - touchStartX);
      const deltaY = Math.abs(e.clientY - touchStartY);
      
      if (deltaX > 10 || deltaY > 10) {
        if (longPressTimerRef.current) {
          clearTimeout(longPressTimerRef.current);
          longPressTimerRef.current = null;
        }
      }
    }
  };
  
  const handleMouseUp = () => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
    
    // Resume auto-advance if it was paused by mouse
    if (autoAdvance && !isLongPress) {
      setIsPaused(false);
    }
    
    // Reset tracking variables
    setIsLongPress(false);
    setTouchStartX(null);
    setTouchStartY(null);
    setTouchStartTime(null);
  };
  
  // Handle click on indicator to jump to a specific slide
  const handleIndicatorClick = (index: number) => {
    if (index !== currentIndex) {
      updateIndex(index);
      resetProgressTime();
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('light');
      }
    }
  };
  
  return (
    <div 
      className={`relative h-full overflow-hidden ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
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
              <h3 className="text-xl font-bold text-white mb-3">{story.title}</h3>
              <div className="text-white mb-12 max-w-3xl mx-auto w-full">{story.content}</div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pause Indicator (only visible when paused) */}
      {isPaused && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 
                       bg-black/50 backdrop-blur-sm rounded-full p-4 
                       animate-pulse">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}
      
      {/* Count Indicator */}
      <div className="absolute top-12 right-4 z-10 bg-black/30 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm">
        {currentIndex + 1}/{stories.length}
      </div>
    </div>
  );
};