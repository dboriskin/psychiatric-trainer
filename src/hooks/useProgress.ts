import { useState, useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { useCaseStore } from '../store/caseStore';
import { useTelegram } from '../components/telegram';
import { api } from '../services/api';
import { storage } from '../utils/telegramStorage';
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

        // Используем единую функцию getItem из нашего безопасного хранилища
        const key = `progress_${currentCaseId}`;
        const value = await storage.getItem(key);
        
        if (value) {
          try {
            const parsedProgress = JSON.parse(value) as CaseProgress;
            setProgress(parsedProgress);
            updateUserProgress(currentCaseId, parsedProgress);
          } catch (parseErr) {
            console.error('Failed to parse progress JSON:', parseErr);
            setError('Ошибка при обработке данных о прогрессе');
          }
        }
      } catch (err) {
        console.error('Failed to load progress:', err);
        setError('Не удалось загрузить прогресс');
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

      // Сохраняем в нашем безопасном хранилище
      const key = `progress_${currentCaseId}`;
      await storage.setItem(key, JSON.stringify(newProgress));

      // If user is authenticated, sync with server
      if (userId) {
        try {
          await api.updateProgress(userId, currentCaseId, newProgress);
        } catch (apiErr) {
          console.warn('Failed to sync progress with server:', apiErr);
          // Не прерываем выполнение даже при ошибке API
        }
      }

      return newProgress;
    } catch (err) {
      console.error('Failed to update progress:', err);
      setError('Не удалось обновить прогресс');
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