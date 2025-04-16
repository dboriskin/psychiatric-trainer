import React from 'react';
import { useNavigationStore } from '../../store/navigationStore';
import { useCaseStore } from '../../store/caseStore';

interface CaseNavigationProps {
  className?: string;
}

/**
 * Компонент для навигации внутри кейса - позволяет вернуться к списку случаев
 * или списку категорий из любого места в кейсе
 */
export const CaseNavigation: React.FC<CaseNavigationProps> = ({ className = '' }) => {
  const { setStage } = useNavigationStore();
  const { currentCategoryId } = useCaseStore();
  
  // Обработчик для возврата к списку случаев
  const handleBackToCases = () => {
    console.log('Navigating back to cases list');
    setStage('cases');
  };
  
  // Обработчик для возврата к списку категорий
  const handleBackToCategories = () => {
    console.log('Navigating back to categories list');
    setStage('categories');
  };
  
  return (
    <div className={`flex gap-4 ${className}`}>
      <button
        onClick={handleBackToCases}
        className="text-primary flex items-center text-sm hover:underline"
      >
        <span className="mr-1">←</span> К списку случаев
      </button>
      
      <button
        onClick={handleBackToCategories}
        className="text-gray-500 flex items-center text-sm hover:underline"
      >
        <span className="mr-1">←</span> К категориям
      </button>
    </div>
  );
};