import React, { useState, useEffect, useRef } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback, useTelegram } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { StorySlider } from '../base/StorySlider';
import { CaseNavigation } from '../base/CaseNavigation';
import { useProgress } from '../../hooks/useProgress';
import { usePlatform } from '../../utils/hooks';

interface PatientStoriesProps {
  caseDetail: CaseDetail;
}

export const PatientStories: React.FC<PatientStoriesProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [viewedStories, setViewedStories] = useState<string[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const { webApp } = useTelegram();
  const { completeStage } = useProgress();
  const storiesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('PatientStories component mounted:', caseDetail?.title);
    console.log('Stories available:', caseDetail?.patientStories?.length || 0);
    
    // Load previously viewed stories from localStorage
    try {
      const storedViewedStories = localStorage.getItem(`viewed_stories_${caseDetail.id}`);
      if (storedViewedStories) {
        setViewedStories(JSON.parse(storedViewedStories));
      }
    } catch (error) {
      console.error('Failed to load viewed stories from localStorage', error);
    }
  }, [caseDetail]);

  // Save viewed stories to localStorage
  useEffect(() => {
    if (viewedStories.length > 0) {
      try {
        localStorage.setItem(`viewed_stories_${caseDetail.id}`, JSON.stringify(viewedStories));
      } catch (error) {
        console.error('Failed to save viewed stories to localStorage', error);
      }
    }
  }, [viewedStories, caseDetail.id]);

  // Handle continuing to next stage
  const handleContinue = () => {
    console.log('PatientStories: continuing to next stage (consultation)');
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('success');
    }
    
    // Mark stage as completed
    completeStage('patient-stories');
    
    // Go to next stage
    setStage('consultation');
  };

  // Handle going back
  const handleBack = () => {
    console.log('PatientStories: going back to patient notes');
    goBack();
  };

  // Open stories view with the first unviewed story or the first story
  const handleOpenStories = () => {
    // Find the first unviewed story
    const firstUnviewedIndex = caseDetail.patientStories.findIndex(
      story => !viewedStories.includes(story.id)
    );
    
    // If all stories are viewed, start from the beginning
    const startIndex = firstUnviewedIndex >= 0 ? firstUnviewedIndex : 0;
    
    setCurrentStoryIndex(startIndex);
    setIsStoriesOpen(true);
    
    // Apply body styles to prevent scrolling when stories are open
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred('light');
    }
  };

  // Close stories view
  const handleCloseStories = () => {
    setIsStoriesOpen(false);
    
    // Restore body styles
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.height = '';
    
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred('light');
    }
    
    // Mark all stories as viewed when closing stories view
    // Only if we've seen at least one story
    if (viewedStories.length > 0) {
      const allStoryIds = caseDetail.patientStories.map(story => story.id);
      setViewedStories(allStoryIds);
    }
  };

  // Mark current story as viewed
  const handleStoryViewed = (storyId: string) => {
    if (!viewedStories.includes(storyId)) {
      setViewedStories(prev => [...prev, storyId]);
    }
  };

  // Check if all stories have been viewed
  const allStoriesViewed = caseDetail.patientStories.every(
    story => viewedStories.includes(story.id)
  );

  return (
    <div className="min-h-screen" ref={storiesContainerRef}>
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">История пациента</h1>
        <p className="text-sm opacity-90">{caseDetail.patientName}, {caseDetail.patientAge} лет</p>
      </div>

      <div className="p-4">
        {/* Navigation for return to cases and categories */}
        <CaseNavigation className="mb-4" />
        
        {/* Instagram-like story circle */}
        <div className="flex flex-col items-center justify-center my-8">
          <div 
            className={`relative cursor-pointer`}
            onClick={handleOpenStories}
          >
            {/* Story indicator ring */}
            <div className={`
              w-32 h-32 rounded-full 
              ${allStoriesViewed ? 'bg-gray-300' : 'bg-gradient-to-tr from-purple-500 via-pink-500 to-yellow-500'}
              p-1
            `}>
              {/* Patient avatar */}
              <div 
                className="w-full h-full rounded-full bg-cover bg-center border-2 border-white"
                style={{ 
                  backgroundImage: `url(https://via.placeholder.com/300x300/e0e0e0/333333?text=${caseDetail.patientName.charAt(0)})` 
                }}
              />
            </div>
            
            {/* Story progress indicators */}
            <div className="absolute inset-0 -m-1">
              <svg width="100%" height="100%" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="49" fill="none" 
                  stroke="rgba(255,255,255,0.2)" strokeWidth="2" 
                />
                
                {caseDetail.patientStories.map((story, index) => {
                  const segmentAngle = 360 / caseDetail.patientStories.length;
                  const startAngle = -90 + (index * segmentAngle);
                  const endAngle = startAngle + segmentAngle;
                  
                  // Convert angles to coordinates
                  const startX = 50 + 49 * Math.cos((startAngle * Math.PI) / 180);
                  const startY = 50 + 49 * Math.sin((startAngle * Math.PI) / 180);
                  const endX = 50 + 49 * Math.cos((endAngle * Math.PI) / 180);
                  const endY = 50 + 49 * Math.sin((endAngle * Math.PI) / 180);
                  
                  // Determine the large arc flag (0 for < 180 degrees, 1 for >= 180 degrees)
                  const largeArcFlag = segmentAngle <= 180 ? 0 : 1;
                  
                  return (
                    <path
                      key={story.id}
                      d={`M 50,50 L ${startX},${startY} A 49,49 0 ${largeArcFlag},1 ${endX},${endY} Z`}
                      fill="none"
                      stroke={viewedStories.includes(story.id) ? "rgba(255,255,255,0.5)" : "white"}
                      strokeWidth="2"
                      strokeDasharray={viewedStories.includes(story.id) ? "2,2" : "0"}
                      opacity={viewedStories.includes(story.id) ? 0.7 : 1}
                    />
                  );
                })}
              </svg>
            </div>
            
            {/* Play button overlay - only show if not all stories viewed */}
            {!allStoriesViewed && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-white/30 backdrop-blur-sm p-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            )}
          </div>
          
          <h3 className="mt-4 text-lg font-medium text-center">{caseDetail.patientName}</h3>
          <p className="text-gray-500 text-sm">{caseDetail.patientAge} лет</p>
          
          <p className="mt-6 text-center text-gray-600 max-w-md">
            Нажмите на изображение пациентки, чтобы просмотреть историю её обращения
            {allStoriesViewed ? ' (все слайды просмотрены)' : ''}
          </p>
          
          {allStoriesViewed && (
            <button 
              className="mt-4 bg-primary text-white py-2 px-4 rounded-lg inline-flex items-center"
              onClick={handleContinue}
            >
              Продолжить
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Additional context/instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
          <h4 className="font-medium text-blue-800">Важная информация</h4>
          <p className="mt-2 text-sm text-blue-700">
            После просмотра истории пациентки вы перейдете к этапу консультации. 
            Обратите внимание на ключевые моменты в истории пациентки, они помогут вам в дальнейшей работе.
          </p>
        </div>
      </div>

      {/* Fullscreen Stories Overlay */}
      {isStoriesOpen && (
        <div className="fixed inset-0 bg-black z-50">
          {/* Close button */}
          <button 
            className="absolute top-4 right-4 z-50 bg-black/30 backdrop-blur-sm rounded-full p-2"
            onClick={handleCloseStories}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          {/* Instagram-like Stories Interface */}
          <InstagramStoryViewer 
            stories={caseDetail.patientStories} 
            initialIndex={currentStoryIndex}
            onIndexChange={setCurrentStoryIndex}
            onStoryViewed={handleStoryViewed}
            onClose={handleCloseStories}
          />
        </div>
      )}

      {/* Back Button - only shown when stories are not open */}
      {!isStoriesOpen && <TelegramBackButton onClick={handleBack} />}

      {/* Main Button - only shown when stories are not open */}
      {!isStoriesOpen && (
        <TelegramMainButton
          text={allStoriesViewed ? "Продолжить" : "Просмотреть историю"}
          onClick={allStoriesViewed ? handleContinue : handleOpenStories}
        />
      )}
      
      {/* Fallback buttons for browser - only shown when stories are not open */}
      {!isStoriesOpen && (
        <ButtonFallback
          mainButtonText={allStoriesViewed ? "Продолжить" : "Просмотреть историю"}
          onMainButtonClick={allStoriesViewed ? handleContinue : handleOpenStories}
          onBackButtonClick={handleBack}
        />
      )}
    </div>
  );
};

// Instagram-like Stories Viewer Component
interface InstagramStoryViewerProps {
  stories: {
    id: string;
    title: string;
    content: string;
    backgroundImage?: string;
  }[];
  initialIndex: number;
  onIndexChange: (index: number) => void;
  onStoryViewed: (storyId: string) => void;
  onClose: () => void;
}

const InstagramStoryViewer: React.FC<InstagramStoryViewerProps> = ({
  stories,
  initialIndex,
  onIndexChange,
  onStoryViewed,
  onClose
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [progressBars, setProgressBars] = useState<boolean[]>(
    stories.map((_, index) => index < initialIndex)
  );
  const { webApp } = useTelegram();
  const progressAnimationRef = useRef<NodeJS.Timeout | null>(null);
  
  const currentStory = stories[currentIndex];
  
  // Mark current story as viewed and animate progress bar
  useEffect(() => {
    if (!currentStory) return;
    
    // Mark as viewed
    onStoryViewed(currentStory.id);
    
    // Animate progress bar for current story
    if (progressAnimationRef.current) {
      clearTimeout(progressAnimationRef.current);
    }
    
    // Fill progress bar for current story
    progressAnimationRef.current = setTimeout(() => {
      setProgressBars(prev => {
        const newBars = [...prev];
        newBars[currentIndex] = true;
        return newBars;
      });
    }, 100);
    
    // Update parent's index
    onIndexChange(currentIndex);
    
    return () => {
      if (progressAnimationRef.current) {
        clearTimeout(progressAnimationRef.current);
      }
    };
  }, [currentIndex, currentStory, onStoryViewed, onIndexChange]);
  
  // Go to previous story
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('light');
      }
    }
  };
  
  // Go to next story or close if on last story
  const goToNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('light');
      }
    } else {
      // Close on last story
      onClose();
    }
  };
  
  // Handle touch events for swipe navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setIsPaused(true);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      
      // Swipe threshold
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          // Swipe left to right = next story
          goToNext();
        } else {
          // Swipe right to left = previous story
          goToPrevious();
        }
      }
      
      setTouchStartX(null);
      setIsPaused(false);
    }
  };
  
  // Handle clicks on left/right side of the screen
  const handleScreenClick = (e: React.MouseEvent) => {
    const { clientX, currentTarget } = e;
    const { offsetWidth } = currentTarget as HTMLDivElement;
    
    // Click on right third = next, left third = previous
    if (clientX > offsetWidth * (2/3)) {
      goToNext();
    } else if (clientX < offsetWidth * (1/3)) {
      goToPrevious();
    }
  };
  
  // Format story content for display
  const formatStoryContent = (content: string) => {
    // Split content into paragraphs
    const paragraphs = content.split('\n\n');
    
    return (
      <>
        {paragraphs.map((paragraph, idx) => {
          // Special formatting for direct speech/dialogue
          if (paragraph.includes('"')) {
            return (
              <p key={idx} className="italic text-white font-medium mb-3">
                {paragraph}
              </p>
            );
          }
          return <p key={idx} className="text-white mb-3">{paragraph}</p>;
        })}
      </>
    );
  };
  
  return (
    <div 
      className="h-full w-full relative"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleScreenClick}
    >
      {/* Progress bars at the top */}
      <div className="absolute top-4 left-0 right-0 z-10 px-4 flex space-x-1">
        {stories.map((_, index) => (
          <div key={index} className="h-1 bg-white/30 rounded-full flex-1 overflow-hidden">
            {index <= currentIndex && (
              <div 
                className={`h-full bg-white rounded-full ${
                  index === currentIndex && !progressBars[index] 
                    ? 'animate-[progress_3s_ease-in-out_forwards]' 
                    : progressBars[index] ? 'w-full' : 'w-0'
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Story content */}
      <div 
        className="h-full w-full bg-cover bg-center"
        style={{
          backgroundImage: currentStory?.backgroundImage 
            ? `url(${currentStory.backgroundImage})` 
            : 'url(https://via.placeholder.com/800x1200/333333/FFFFFF)'
        }}
      >
        {/* Gradient overlay for text readability */}
        <div className="h-full w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
          <h3 className="text-2xl font-bold text-white mb-4">{currentStory?.title}</h3>
          <div className="text-white text-lg mb-12 max-w-xl">
            {currentStory && formatStoryContent(currentStory.content)}
          </div>
        </div>
      </div>
      
      {/* Touch areas indicators - only in development */}
      {process.env.NODE_ENV === 'development' && (
        <>
          <div className="absolute inset-y-0 left-0 w-1/3 border border-red-500 opacity-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 left-1/3 right-1/3 border border-green-500 opacity-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-1/3 border border-blue-500 opacity-10 pointer-events-none"></div>
        </>
      )}
      
      <style jsx>{`
        @keyframes progress {
          0% { width: 0; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};