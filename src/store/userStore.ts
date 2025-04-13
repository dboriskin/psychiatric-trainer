import { create } from 'zustand';

interface UserState {
  userId: string | null;
  name: string | null;
  progress: Record<string, any>;
  isAuthenticated: boolean;
  setUser: (userId: string, name: string) => void;
  updateProgress: (caseId: string, progress: any) => void;
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  userId: null,
  name: null,
  progress: {},
  isAuthenticated: false,
  setUser: (userId, name) => set({ userId, name, isAuthenticated: true }),
  updateProgress: (caseId, progress) => 
    set((state) => ({ 
      progress: { 
        ...state.progress, 
        [caseId]: progress 
      } 
    })),
  reset: () => set({ userId: null, name: null, progress: {}, isAuthenticated: false }),
}));