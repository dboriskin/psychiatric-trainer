import { create } from 'zustand';

interface CaseState {
  currentCaseId: string | null;
  currentCase: any | null;
  currentCategoryId: string | null;
  cases: Record<string, any>;
  setCurrentCase: (caseId: string) => void;
  setCurrentCategory: (categoryId: string) => void;
  loadCase: (caseId: string, caseData: any) => void;
  reset: () => void;
}

export const useCaseStore = create<CaseState>((set, get) => ({
  currentCaseId: null,
  currentCase: null,
  currentCategoryId: null,
  cases: {},
  setCurrentCase: (caseId) => 
    set({ 
      currentCaseId: caseId, 
      currentCase: get().cases[caseId] || null 
    }),
  setCurrentCategory: (categoryId) =>
    set({ currentCategoryId: categoryId }),
  loadCase: (caseId, caseData) => 
    set((state) => ({ 
      cases: { 
        ...state.cases, 
        [caseId]: caseData 
      },
      currentCaseId: caseId,
      currentCase: caseData,
    })),
  reset: () => set({ 
    currentCaseId: null, 
    currentCase: null,
    currentCategoryId: null, 
  }),
}));