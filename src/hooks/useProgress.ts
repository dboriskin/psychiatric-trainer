import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useCaseStore } from '../store/caseStore';
import { useTelegram } from '../components/telegram';
import { api } from '../services/api';
import { cloudStorage, deviceStorage } from '../utils/telegramStorage';
import { StageType } from '../store/navigationStore';

export interface CaseProgress {
  completed: boolean;
  currentStage: StageType;
  stagesCompleted: StageType[];
  lastUpdated: string;
  score?: number;
  diagnosisSelected?: string;
  treatmentSelected?: string;
}

export function useProgress() {
  const { userId, updateProgress: updateUserProgress } = useUserStore();
  const { currentCaseId } = useCaseStore();
  const { webApp } = useTelegram();
  const [progress, setProgress] = useState<CaseProgress | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentCaseId) return;

    const loadProgress = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try to get progress from Telegram CloudStorage
        if (webApp?.CloudStorage) {
          const key = `progress_${currentCaseId}`;
          try {
            const value = await cloudStorage.getItem(key);
            if (value) {
              const parsedProgress = JSON.parse(value) as CaseProgress;
              setProgress(parsedProgress);
              updateUserProgress(currentCaseId, parsedProgress);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('Failed to load progress from CloudStorage:', err);
            // Fall through to next storage method
          }

          // Fallback to DeviceStorage
          try {
            const value = await deviceStorage.getItem(key);
            if (value) {
              const parsedProgress = JSON.parse(value) as CaseProgress;
              setProgress(parsedProgress);
              updateUserProgress(currentCaseId, parsedProgress);
              setLoading(false);
              return;
            }
          } catch (err) {
            console.error('Failed to load progress from DeviceStorage:', err);
            // Fall through to localStorage
          }
        }

        // If CloudStorage and DeviceStorage failed, check localStorage
        const key = `progress_${currentCaseId}`;
        const storedProgress = localStorage.getItem(key);
        if (storedProgress) {
          const parsedProgress = JSON.parse(storedProgress) as CaseProgress;
          setProgress(parsedProgress);
          updateUserProgress(currentCaseId, parsedProgress);
        }
      } catch (err) {
        console.error('Failed to load progress:', err);
        setError('Failed to load progress');
      } finally {
        setLoading(false);
      }
    };

    loadProgress();
  }, [currentCaseId, updateUserProgress, webApp]);

  const updateProgress = async (updatedProgress: Partial<CaseProgress>) => {
    if (!currentCaseId) return null;

    try {
      // Merge with existing progress
      const newProgress: CaseProgress = {
        ...(progress || {
          completed: false,
          currentStage: 'patient-notes' as StageType,
          stagesCompleted: [],
          lastUpdated: new Date().toISOString(),
        }),
        ...updatedProgress,
        lastUpdated: new Date().toISOString(),
      } as CaseProgress;

      setProgress(newProgress);
      updateUserProgress(currentCaseId, newProgress);

      // Save to CloudStorage
      const key = `progress_${currentCaseId}`;
      if (webApp?.CloudStorage) {
        try {
          await cloudStorage.setItem(key, JSON.stringify(newProgress));
        } catch (err) {
          console.error('Failed to save progress to CloudStorage:', err);
          // Fallback to DeviceStorage
          try {
            await deviceStorage.setItem(key, JSON.stringify(newProgress));
          } catch (deviceErr) {
            console.error('Failed to save progress to DeviceStorage:', deviceErr);
            // Fallback to localStorage
            localStorage.setItem(key, JSON.stringify(newProgress));
          }
        }
      } else {
        // If CloudStorage not available, use localStorage
        localStorage.setItem(key, JSON.stringify(newProgress));
      }

      // If user is authenticated, sync with server
      if (userId) {
        await api.updateProgress(userId, currentCaseId, newProgress);
      }

      return newProgress;
    } catch (err) {
      console.error('Failed to update progress:', err);
      setError('Failed to update progress');
      return null;
    }
  };

  const completeStage = async (stage: StageType) => {
    const stagesCompleted = progress?.stagesCompleted || [];
    
    if (!stagesCompleted.includes(stage)) {
      return updateProgress({
        stagesCompleted: [...stagesCompleted, stage],
        currentStage: stage,
      });
    } else {
      return updateProgress({
        currentStage: stage,
      });
    }
  };

  const isStageCompleted = (stage: StageType): boolean => {
    return progress?.stagesCompleted?.includes(stage) || false;
  };

  const getProgressPercentage = (): number => {
    if (!progress) return 0;
    
    const totalStages = 7; // Total number of stages in the case
    const completedStages = progress.stagesCompleted.length;
    
    return Math.round((completedStages / totalStages) * 100);
  };

  return {
    progress,
    loading,
    error,
    updateProgress,
    completeStage,
    isStageCompleted,
    getProgressPercentage,
  };
}