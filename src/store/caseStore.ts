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
  restoreState: () => boolean;
}

// Ключи для localStorage
const CASE_ID_KEY = 'psychiatric_trainer_current_case_id';
const CATEGORY_ID_KEY = 'psychiatric_trainer_current_category_id';

// Функции для работы с localStorage
const saveCurrentIds = (caseId: string | null, categoryId: string | null) => {
  if (typeof window !== 'undefined') {
    if (caseId) {
      localStorage.setItem(CASE_ID_KEY, caseId);
    } else {
      localStorage.removeItem(CASE_ID_KEY);
    }
    
    if (categoryId) {
      localStorage.setItem(CATEGORY_ID_KEY, categoryId);
    } else {
      localStorage.removeItem(CATEGORY_ID_KEY);
    }
  }
};

const getStoredIds = () => {
  if (typeof window === 'undefined') return { caseId: null, categoryId: null };
  
  const caseId = localStorage.getItem(CASE_ID_KEY);
  const categoryId = localStorage.getItem(CATEGORY_ID_KEY);
  
  return { caseId, categoryId };
};

export const useCaseStore = create<CaseState>((set, get) => ({
  currentCaseId: null,
  currentCase: null,
  currentCategoryId: null,
  cases: {},
  setCurrentCase: (caseId) => {
    saveCurrentIds(caseId, get().currentCategoryId);
    set({ 
      currentCaseId: caseId, 
      currentCase: get().cases[caseId] || null 
    });
  },
  setCurrentCategory: (categoryId) => {
    saveCurrentIds(get().currentCaseId, categoryId);
    set({ currentCategoryId: categoryId });
  },
  loadCase: (caseId, caseData) => {
    saveCurrentIds(caseId, get().currentCategoryId);
    set((state) => ({ 
      cases: { 
        ...state.cases, 
        [caseId]: caseData 
      },
      currentCaseId: caseId,
      currentCase: caseData,
    }));
  },
  reset: () => {
    saveCurrentIds(null, null);
    set({ 
      currentCaseId: null, 
      currentCase: null,
      currentCategoryId: null, 
    });
  },
  restoreState: () => {
    const { caseId, categoryId } = getStoredIds();
    
    if (caseId || categoryId) {
      set({
        currentCaseId: caseId,
        currentCategoryId: categoryId
      });
      return true;
    }
    
    return false;
  }
}));