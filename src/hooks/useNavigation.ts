import { useCallback } from 'react';
import { useNavigationStore, StageType } from '../store/navigationStore';
import { useRouter } from 'next/router';

export function useNavigation() {
  const { currentStage, setStage, goBack, history } = useNavigationStore();
  const router = useRouter();

  const navigateTo = useCallback((stage: StageType) => {
    setStage(stage);
    
    // Map stages to routes
    switch (stage) {
      case 'categories':
        router.push('/categories');
        break;
      case 'cases':
        router.push('/cases');
        break;
      case 'patient-notes':
      case 'patient-stories':
      case 'consultation':
      case 'diagnosis':
      case 'treatment':
      case 'results':
      case 'expert-comment':
        router.push(`/case/${stage}`);
        break;
      default:
        break;
    }
  }, [router, setStage]);

  const handleBack = useCallback(() => {
    const prevStage = history[history.length - 2];
    goBack();
    
    // If we have a previous stage, update the route
    if (prevStage) {
      switch (prevStage) {
        case 'categories':
          router.push('/categories');
          break;
        case 'cases':
          router.push('/cases');
          break;
        case 'patient-notes':
        case 'patient-stories':
        case 'consultation':
        case 'diagnosis':
        case 'treatment':
        case 'results':
        case 'expert-comment':
          router.push(`/case/${prevStage}`);
          break;
        default:
          break;
      }
    }

    return prevStage;
  }, [goBack, history, router]);

  return {
    currentStage,
    navigateTo,
    handleBack,
    history,
    canGoBack: history.length > 1,
  };
}