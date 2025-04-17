import { create } from 'zustand';
import { saveLastStageForCase, getLastStageForCase } from '../utils/casesProgressStorage';
import { useCaseStore } from './caseStore';

export type StageType = 
  | ''
  | 'categories'
  | 'cases'
  | 'patient-notes'
  | 'patient-stories'
  | 'consultation'
  | 'diagnosis'
  | 'treatment'
  | 'results'
  | 'expert-comment';

// Типы этапов, которые находятся внутри кейса
export const CASE_STAGES: StageType[] = [
  'patient-notes',
  'patient-stories',
  'consultation',
  'diagnosis',
  'treatment',
  'results',
  'expert-comment'
];

// Проверяет, является ли этап этапом внутри кейса
export const isCaseStage = (stage: StageType): boolean => {
  return CASE_STAGES.includes(stage);
};

interface NavigationState {
  currentStage: StageType;
  history: StageType[];
  setStage: (stage: StageType, saveToStorage?: boolean) => void;
  goBack: () => void;
  reset: () => void;
  restoreNavigation: () => boolean;
  enterCase: (caseId: string) => void;
}

// Имена ключей для localStorage
const NAV_STAGE_KEY = 'psychiatric_trainer_current_stage';
const NAV_HISTORY_KEY = 'psychiatric_trainer_history';

// Функции для работы с localStorage
const saveNavigation = (stage: StageType, history: StageType[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(NAV_STAGE_KEY, stage);
    localStorage.setItem(NAV_HISTORY_KEY, JSON.stringify(history));
  }
};

const getStoredNavigation = (): { stage: StageType, history: StageType[] } | null => {
  if (typeof window === 'undefined') return null;
  
  const stage = localStorage.getItem(NAV_STAGE_KEY) as StageType;
  const historyStr = localStorage.getItem(NAV_HISTORY_KEY);
  
  if (!stage) return null;
  
  let history: StageType[] = [];
  try {
    history = historyStr ? JSON.parse(historyStr) : [];
  } catch (e) {
    console.error('Failed to parse navigation history:', e);
  }
  
  return { stage, history };
};

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentStage: '',
  history: [],
  setStage: (stage, saveToStorage = true) => 
    set((state) => {
      // Не добавляем этап в историю, если он уже является текущим
      if (state.currentStage === stage) {
        return state;
      }
      
      console.log(`Navigation: changing stage from ${state.currentStage} to ${stage}`);
      
      const newHistory = [...state.history, stage];
      
      // Сохраняем в localStorage, если нужно
      if (saveToStorage) {
        saveNavigation(stage, newHistory);
        
        // Если это этап внутри кейса, сохраняем его для конкретного кейса
        if (isCaseStage(stage)) {
          const currentCaseId = useCaseStore.getState().currentCaseId;
          if (currentCaseId) {
            saveLastStageForCase(currentCaseId, stage);
          }
        }
      }
      
      return { 
        currentStage: stage, 
        history: newHistory 
      };
    }),
  goBack: () => 
    set((state) => {
      if (state.history.length <= 1) {
        return state;
      }
      
      const newHistory = [...state.history];
      newHistory.pop();
      const prevStage = newHistory[newHistory.length - 1] || 'categories' as StageType;
      
      console.log(`Navigation: going back from ${state.currentStage} to ${prevStage}`);
      
      // Сохраняем новое состояние в localStorage
      saveNavigation(prevStage, newHistory);
      
      return { 
        currentStage: prevStage, 
        history: newHistory 
      };
    }),
  reset: () => {
    // Используем явное приведение типов, чтобы TypeScript был доволен
    const initialStage: StageType = 'categories';
    const initialHistory: StageType[] = ['categories'];
    
    saveNavigation(initialStage, initialHistory);
    set({ 
      currentStage: initialStage, 
      history: initialHistory 
    });
  },
  restoreNavigation: () => {
    const storedNav = getStoredNavigation();
    
    if (storedNav) {
      console.log(`Restoring navigation to: ${storedNav.stage}`);
      set({
        currentStage: storedNav.stage,
        history: storedNav.history,
      });
      return true;
    }
    
    return false;
  },
  // Новый метод для входа в кейс с восстановлением последнего этапа
  enterCase: (caseId: string) => {
    const lastStage = getLastStageForCase(caseId);
    
    if (lastStage && isCaseStage(lastStage)) {
      console.log(`Entering case ${caseId} at last stage: ${lastStage}`);
      get().setStage(lastStage);
    } else {
      console.log(`Entering case ${caseId} at initial stage`);
      get().setStage('patient-notes');
    }
  }
}));