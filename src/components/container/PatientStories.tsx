import React, { useState, useEffect } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { StorySlider } from '../base/StorySlider';
import { CaseNavigation } from '../base/CaseNavigation';

interface PatientStoriesProps {
  caseDetail: CaseDetail;
}

export const PatientStories: React.FC<PatientStoriesProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();
  const [storyComplete, setStoryComplete] = useState(false);

  useEffect(() => {
    console.log('PatientStories component mounted:', caseDetail?.title);
    console.log('Stories available:', caseDetail?.patientStories?.length || 0);
  }, [caseDetail]);

  const handleContinue = () => {
    console.log('PatientStories: continuing to next stage (consultation)');
    setStage('consultation');
  };

  const handleBack = () => {
    console.log('PatientStories: going back to patient notes');
    goBack();
  };

  const handleStoryComplete = () => {
    console.log('Story viewing completed');
    setStoryComplete(true);
  };

  // Преобразуем истории в формат, ожидаемый StorySlider
  const stories = caseDetail.patientStories.map(story => ({
    id: story.id,
    title: story.title,
    content: <div className="whitespace-pre-line">{story.content}</div>,
    backgroundImage: story.backgroundImage
  }));

  return (
    <div className="h-screen relative">
      {/* Навигация для возврата к списку кейсов и категорий */}
      <div className="absolute top-4 left-4 z-10 bg-black/30 p-2 rounded">
        <CaseNavigation />
      </div>
      
      <StorySlider 
        stories={stories}
        onComplete={handleStoryComplete}
        className="h-full"
      />
      
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