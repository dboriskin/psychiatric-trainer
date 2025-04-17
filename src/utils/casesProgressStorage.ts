import { StageType } from '../store/navigationStore';

// Ключ для localStorage
const CASES_STAGES_KEY = 'psychiatric_trainer_cases_stages';

// Интерфейс для хранения этапов по каждому кейсу
interface CasesStages {
  [caseId: string]: StageType;
}

/**
 * Сохраняет текущий этап для указанного кейса
 */
export function saveLastStageForCase(caseId: string, stage: StageType): void {
  if (!caseId || !stage || typeof window === 'undefined') return;
  
  try {
    // Получить текущие данные
    const storedData = localStorage.getItem(CASES_STAGES_KEY);
    const casesStages: CasesStages = storedData ? JSON.parse(storedData) : {};
    
    // Обновить данные
    casesStages[caseId] = stage;
    
    // Сохранить обновленные данные
    localStorage.setItem(CASES_STAGES_KEY, JSON.stringify(casesStages));
    
    console.log(`Saved stage ${stage} for case ${caseId}`);
  } catch (error) {
    console.error('Failed to save case stage:', error);
  }
}

/**
 * Получает последний сохраненный этап для указанного кейса
 */
export function getLastStageForCase(caseId: string): StageType | null {
  if (!caseId || typeof window === 'undefined') return null;
  
  try {
    const storedData = localStorage.getItem(CASES_STAGES_KEY);
    if (!storedData) return null;
    
    const casesStages: CasesStages = JSON.parse(storedData);
    const lastStage = casesStages[caseId];
    
    if (lastStage) {
      console.log(`Retrieved last stage ${lastStage} for case ${caseId}`);
    }
    
    return lastStage || null;
  } catch (error) {
    console.error('Failed to retrieve case stage:', error);
    return null;
  }
}

/**
 * Удаляет информацию о последнем этапе для указанного кейса
 */
export function clearLastStageForCase(caseId: string): void {
  if (!caseId || typeof window === 'undefined') return;
  
  try {
    const storedData = localStorage.getItem(CASES_STAGES_KEY);
    if (!storedData) return;
    
    const casesStages: CasesStages = JSON.parse(storedData);
    
    if (casesStages[caseId]) {
      delete casesStages[caseId];
      localStorage.setItem(CASES_STAGES_KEY, JSON.stringify(casesStages));
      console.log(`Cleared stage for case ${caseId}`);
    }
  } catch (error) {
    console.error('Failed to clear case stage:', error);
  }
}