import { useState, useEffect } from 'react';
import { CaseDetail } from '../services/api';
import { useCaseStore } from '../store/caseStore';
// Импортируем мок-данные напрямую
import { getCaseDetailById } from '../mocks/data/case-details';
import { useNavigationStore } from '../store/navigationStore';

export function useCase() {
  const { currentCaseId, currentCase, loadCase } = useCaseStore();
  const { currentStage } = useNavigationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [caseDetail, setCaseDetail] = useState<CaseDetail | null>(null);

  useEffect(() => {
    if (!currentCaseId) return;

    const fetchCaseDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log(`Loading case data for ${currentCaseId}, current stage: ${currentStage}`);
        
        // Получаем данные напрямую из моков без таймаута
        const fallbackData = getCaseDetailById(currentCaseId);
        
        if (fallbackData) {
          console.log('Case data loaded successfully:', fallbackData.title);
          setCaseDetail(fallbackData);
          loadCase(currentCaseId, fallbackData);
        } else {
          console.error(`Case details not found for id: ${currentCaseId}`);
          setError('Case details not found');
        }
      } catch (err) {
        console.error('Failed to load case details:', err);
        setError('Failed to load case details');
      } finally {
        setLoading(false);
      }
    };

    // If we already have case details, use them
    if (currentCase && 'patientNotes' in currentCase) {
      console.log('Using cached case data:', (currentCase as CaseDetail).title);
      setCaseDetail(currentCase as CaseDetail);
    } else {
      fetchCaseDetail();
    }
  }, [currentCaseId, currentCase, loadCase, currentStage]);

  return {
    loading,
    error,
    caseDetail,
    caseId: currentCaseId,
  };
}