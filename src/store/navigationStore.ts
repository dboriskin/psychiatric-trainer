import { create } from 'zustand';

export type StageType = 
  | 'categories'
  | 'cases'
  | 'patient-notes'
  | 'patient-stories'
  | 'consultation'
  | 'diagnosis'
  | 'treatment'
  | 'results'
  | 'expert-comment';

interface NavigationState {
  currentStage: StageType;
  history: StageType[];
  setStage: (stage: StageType) => void;
  goBack: () => void;
  reset: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentStage: 'categories',
  history: ['categories'],
  setStage: (stage) => 
    set((state) => ({ 
      currentStage: stage, 
      history: [...state.history, stage] 
    })),
  goBack: () => 
    set((state) => {
      if (state.history.length <= 1) {
        return state;
      }
      
      const newHistory = [...state.history];
      newHistory.pop();
      return { 
        currentStage: newHistory[newHistory.length - 1], 
        history: newHistory 
      };
    }),
  reset: () => set({ currentStage: 'categories', history: ['categories'] }),
}));
