import React, { useEffect } from 'react';
import { useNavigationStore, StageType } from '../../store/navigationStore';
import { usePlatform } from '../../utils/hooks';

interface NavigationMapModalProps {
  onClose: () => void;
  isVisible: boolean;
}

interface StageInfo {
  id: StageType;
  label: string;
  isEnabled: boolean;
}

export const NavigationMapModal: React.FC<NavigationMapModalProps> = ({ 
  onClose,
  isVisible
}) => {
  const { currentStage, setStage, history } = useNavigationStore();
  const { isMobile } = usePlatform();
  
  // Блокируем скролл body когда модальное окно открыто
  useEffect(() => {
    if (isVisible) {
      // Сохраняем текущую позицию скролла
      const scrollY = window.scrollY;
      
      // Блокируем скролл и фиксируем позицию body
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';
      
      // Восстанавливаем скролл при закрытии
      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isVisible]);
  
  // Define the stages in the navigation map
  const stages: StageInfo[] = [
    { id: 'patient-notes', label: 'Заметки о пациенте', isEnabled: history.includes('patient-notes') },
    { id: 'patient-stories', label: 'История пациента', isEnabled: history.includes('patient-stories') },
    { id: 'consultation', label: 'Консультация', isEnabled: history.includes('consultation') },
    { id: 'diagnosis', label: 'Диагностика', isEnabled: history.includes('diagnosis') },
    { id: 'treatment', label: 'Лечение', isEnabled: history.includes('treatment') },
    { id: 'results', label: 'Результаты', isEnabled: history.includes('results') },
    { id: 'expert-comment', label: 'Комментарий эксперта', isEnabled: history.includes('expert-comment') },
  ];

  const handleStageClick = (stage: StageType) => {
    if (history.includes(stage)) {
      // Обновляем состояние
      setStage(stage);
      
      // Закрываем модальное окно
      onClose();
      
      console.log(`Navigation map: switched to stage ${stage}`);
    }
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" 
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-xl ${isMobile ? 'p-3 w-[95%] max-h-[80vh]' : 'p-4 w-[90%] max-w-md'} mx-auto overflow-hidden flex flex-col`} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-2 sticky top-0 bg-white py-2 border-b border-gray-100 z-10">
          <h2 className="text-lg font-bold">Карта навигации</h2>
          <button 
            className="text-gray-600 hover:text-gray-900 h-8 w-8 flex items-center justify-center"
            onClick={onClose}
            aria-label="Закрыть"
          >
            ✕
          </button>
        </div>

        <div className="space-y-2 overflow-y-auto flex-1 p-1">
          {stages.map((stage, index) => (
            <React.Fragment key={stage.id}>
              <div 
                className={`
                  flex items-center p-3 rounded-lg transition-colors
                  ${stage.isEnabled ? 'cursor-pointer hover:bg-gray-100' : 'opacity-50 cursor-not-allowed'}
                  ${currentStage === stage.id ? 'bg-primary/10 border border-primary' : ''}
                `}
                onClick={() => stage.isEnabled && handleStageClick(stage.id)}
              >
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center mr-3
                  ${currentStage === stage.id 
                    ? 'bg-primary text-white' 
                    : stage.isEnabled 
                      ? 'bg-success text-white' 
                      : 'bg-gray-300 text-gray-600'}
                `}>
                  {index + 1}
                </div>
                <span className={`${currentStage === stage.id ? 'font-bold' : ''}`}>
                  {stage.label}
                </span>
              </div>
              {index < stages.length - 1 && (
                <div className="h-5 w-0.5 bg-gray-300 ml-4"></div>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Закрепленная кнопка внизу модального окна (только на мобильных) */}
        {isMobile && (
          <div className="sticky bottom-0 pt-3 pb-1 bg-white border-t border-gray-200 mt-1">
            <button 
              className="w-full bg-primary text-white py-2 px-4 rounded-lg"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        )}
        
        {/* Кнопка закрытия (только на десктопе) */}
        {!isMobile && (
          <div className="mt-4 text-center">
            <button 
              className="bg-primary text-white py-2 px-4 rounded-lg"
              onClick={onClose}
            >
              Закрыть
            </button>
          </div>
        )}
      </div>
    </div>
  );
};