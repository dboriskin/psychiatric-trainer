import { create } from 'zustand';

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

interface NavigationState {
  currentStage: StageType;
  history: StageType[];
  setStage: (stage: StageType) => void;
  goBack: () => void;
  reset: () => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  currentStage: '',
  history: [],
  setStage: (stage) => 
    set((state) => {
      // Не добавляем этап в историю, если он уже является текущим
      if (state.currentStage === stage) {
        return state;
      }
      
      console.log(`Navigation: changing stage from ${state.currentStage} to ${stage}`);
      
      return { 
        currentStage: stage, 
        history: [...state.history, stage] 
      };
    }),
  goBack: () => 
    set((state) => {
      if (state.history.length <= 1) {
        return state;
      }
      
      const newHistory = [...state.history];
      newHistory.pop();
      const prevStage = newHistory[newHistory.length - 1] || 'categories';
      
      console.log(`Navigation: going back from ${state.currentStage} to ${prevStage}`);
      
      return { 
        currentStage: prevStage, 
        history: newHistory 
      };
    }),
  reset: () => set({ currentStage: 'categories', history: ['categories'] }),
}));