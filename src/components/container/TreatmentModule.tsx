import React, { useState, useEffect } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback, useTelegram } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { CaseNavigation } from '../base/CaseNavigation';
import { useProgress } from '../../hooks/useProgress';

interface TreatmentModuleProps {
  caseDetail: CaseDetail;
}

// Компонент для отображения информации о преимуществах и недостатках метода лечения
interface TreatmentDetailProps {
  title: string;
  pros: string[];
  cons: string[];
}

const TreatmentDetail: React.FC<TreatmentDetailProps> = ({ title, pros, cons }) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <h4 className="font-medium mb-3">{title}</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 rounded-lg p-3">
          <h5 className="text-sm font-medium text-green-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Преимущества
          </h5>
          <ul className="space-y-1">
            {pros.map((pro, index) => (
              <li key={index} className="text-sm text-green-700 flex items-start">
                <span className="inline-block w-1 h-1 rounded-full bg-green-500 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>{pro}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="bg-red-50 rounded-lg p-3">
          <h5 className="text-sm font-medium text-red-800 mb-2 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Недостатки
          </h5>
          <ul className="space-y-1">
            {cons.map((con, index) => (
              <li key={index} className="text-sm text-red-700 flex items-start">
                <span className="inline-block w-1 h-1 rounded-full bg-red-500 mt-1.5 mr-2 flex-shrink-0"></span>
                <span>{con}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const TreatmentModule: React.FC<TreatmentModuleProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();
  const [selectedTreatment, setSelectedTreatment] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { webApp } = useTelegram();
  const { completeStage } = useProgress();

  // Карта преимуществ и недостатков для каждого варианта лечения
  const treatmentDetailsMap: Record<string, { pros: string[], cons: string[] }> = {
    'treatment-1': {
      pros: [
        'Комплексный подход, воздействующий на биологические и психологические аспекты депрессии',
        'Более высокая эффективность по сравнению с монотерапией',
        'Профилактика рецидивов',
        'Улучшение социального функционирования',
        'Формирование адаптивных навыков совладания со стрессом'
      ],
      cons: [
        'Требует больше времени и ресурсов',
        'Необходимость координации между разными специалистами',
        'Риск побочных эффектов от медикаментов',
        'Долгий период подбора оптимальной дозировки лекарств',
        'Более высокая стоимость лечения'
      ]
    },
    'treatment-2': {
      pros: [
        'Отсутствие побочных эффектов, характерных для медикаментов',
        'Развитие долгосрочных навыков совладания с проблемами',
        'Безопасность для периода грудного вскармливания',
        'Формирование поддерживающей терапевтической среды',
        'Адресует психологические аспекты материнства'
      ],
      cons: [
        'Медленное облегчение биологических симптомов (сон, аппетит)',
        'Меньшая эффективность при тяжелой депрессии',
        'Требует высокой мотивации и вовлеченности пациента',
        'Ограниченная доступность квалифицированных психотерапевтов',
        'Временные затраты на регулярные сессии'
      ]
    },
    'treatment-3': {
      pros: [
        'Быстрое улучшение биологических симптомов (сон, аппетит)',
        'Эффективность независимо от психологической готовности пациента',
        'Более высокая доступность (не требует еженедельных встреч)',
        'Структурированный подход с измеримыми результатами',
        'Научно доказанная эффективность'
      ],
      cons: [
        'Не адресует психологические проблемы и навыки совладания',
        'Риск побочных эффектов',
        'Потенциальные опасения по поводу грудного вскармливания',
        'Выше риск рецидива после прекращения приема',
        'Может формировать зависимость от медикаментов, а не от собственных ресурсов'
      ]
    }
  };

  useEffect(() => {
    console.log('TreatmentModule component mounted');
    console.log('Treatment options available:', caseDetail.treatmentOptions.length);
  }, [caseDetail]);

  const handleContinue = () => {
    console.log('TreatmentModule: continuing to results stage');
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('success');
    }
    
    // Отмечаем этап как завершенный
    completeStage('treatment');
    
    // Переходим к следующему этапу
    setStage('results');
  };

  const handleBack = () => {
    console.log('TreatmentModule: going back to diagnosis');
    goBack();
  };

  const handleTreatmentClick = (treatmentId: string) => {
    if (selectedTreatment === treatmentId) {
      // Если уже выбрано, переключаем режим детализации
      setShowDetails(!showDetails);
    } else {
      // Выбираем новый вариант лечения
      setSelectedTreatment(treatmentId);
      setShowDetails(true);
    }
    
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.selectionChanged();
    }
  };

  const recommendedTreatment = caseDetail.treatmentOptions.find(t => t.isRecommended);

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">План лечения</h1>
        <p className="text-sm opacity-90">Выберите оптимальную стратегию лечения</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        {/* Информационная карточка о выборе стратегии */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-blue-700 mb-1">
                На основе поставленного диагноза выберите оптимальную стратегию лечения.
              </p>
              <p className="text-sm text-blue-600">
                Оценивайте эффективность, риски, доступность и соответствие потребностям пациента.
              </p>
            </div>
          </div>
        </div>
        
        {/* Варианты лечения */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h2 className="text-lg font-bold mb-4">Выберите стратегию лечения:</h2>
          <div className="space-y-4">
            {caseDetail.treatmentOptions.map((option) => (
              <div 
                key={option.id} 
                className={`
                  p-4 border rounded-lg cursor-pointer transition-colors
                  ${selectedTreatment === option.id 
                    ? 'border-primary bg-primary/10' 
                    : 'border-gray-200 hover:bg-gray-50'}
                `}
                onClick={() => handleTreatmentClick(option.id)}
              >
                <div className="flex items-start">
                  <div className={`
                    w-5 h-5 rounded-full border-2 mt-1 mr-3 flex-shrink-0 flex items-center justify-center
                    ${selectedTreatment === option.id ? 'border-primary' : 'border-gray-300'}
                  `}>
                    {selectedTreatment === option.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{option.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    
                    {selectedTreatment === option.id && showDetails && (
                      <>
                        {/* Добавляем информацию о преимуществах и недостатках */}
                        <TreatmentDetail 
                          title="Анализ эффективности подхода"
                          pros={treatmentDetailsMap[option.id]?.pros || []}
                          cons={treatmentDetailsMap[option.id]?.cons || []}
                        />
                        
                        {/* Если это рекомендуемый вариант, показываем соответствующее сообщение */}
                        {option.isRecommended && (
                          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-green-800 font-medium">
                                Это рекомендуемая стратегия лечения для данного случая.
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {/* Кнопка для скрытия детальной информации */}
                        <div className="mt-4 flex justify-end">
                          <button 
                            className="text-sm text-primary font-medium"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowDetails(false);
                            }}
                          >
                            Скрыть детали
                          </button>
                        </div>
                      </>
                    )}
                    
                    {selectedTreatment === option.id && !showDetails && (
                      <div className="mt-2">
                        <button 
                          className="text-sm text-primary font-medium"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowDetails(true);
                          }}
                        >
                          Показать детали
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Сравнительная таблица для выбранного лечения */}
        {selectedTreatment && (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <h3 className="font-bold mb-3">Прогнозируемая эффективность</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
                      Критерий
                    </th>
                    <th className="py-2 px-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
                      Оценка
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-3 text-sm border-b border-gray-200">
                      Скорость улучшения
                    </td>
                    <td className="py-2 px-3 text-sm border-b border-gray-200">
                      {selectedTreatment === 'treatment-1' ? (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Средняя</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                          </div>
                        </div>
                      ) : selectedTreatment === 'treatment-2' ? (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Медленная</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Высокая</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-sm border-b border-gray-200">
                      Долгосрочная эффективность
                    </td>
                    <td className="py-2 px-3 text-sm border-b border-gray-200">
                      {selectedTreatment === 'treatment-1' ? (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Высокая</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                          </div>
                        </div>
                      ) : selectedTreatment === 'treatment-2' ? (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Средняя</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Низкая</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-3 text-sm border-b border-gray-200">
                      Риск побочных эффектов
                    </td>
                    <td className="py-2 px-3 text-sm border-b border-gray-200">
                      {selectedTreatment === 'treatment-1' ? (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Средний</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                          </div>
                        </div>
                      ) : selectedTreatment === 'treatment-2' ? (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Низкий</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-green-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <span className="font-medium mr-2">Высокий</span>
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text="К результатам"
        onClick={handleContinue}
        disabled={!selectedTreatment}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText="К результатам"
        onMainButtonClick={handleContinue}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};