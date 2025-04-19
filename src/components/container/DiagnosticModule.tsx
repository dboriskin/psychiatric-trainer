import React, { useState, useEffect } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback, useTelegram } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail } from '../../services/api';
import { CaseNavigation } from '../base/CaseNavigation';
import { useProgress } from '../../hooks/useProgress';
import { TabNavigation } from '../base/TabNavigation';

interface DiagnosticModuleProps {
  caseDetail: CaseDetail;
}

// Компонент для отображения критериев диагностики
const DiagnosticCriteria: React.FC<{ diagnosis: string }> = ({ diagnosis }) => {
  // Примеры критериев для разных диагнозов
  const criteriaMap: Record<string, string[]> = {
    'Послеродовая депрессия (F53.0)': [
      'Депрессивное настроение большую часть дня',
      'Значительное снижение интереса к деятельности',
      'Нарушения сна (бессонница или чрезмерная сонливость)',
      'Психомоторное возбуждение или заторможенность',
      'Усталость или снижение энергии',
      'Чувство никчемности или избыточной вины',
      'Снижение способности мыслить, концентрироваться',
      'Повторяющиеся мысли о смерти или суициде',
      'Возникновение в течение 4 недель после родов'
    ],
    'Адаптационное расстройство (F43.2)': [
      'Появление симптомов в течение 3 месяцев после стрессового события',
      'Выраженный дистресс, несоразмерный тяжести стрессора',
      'Нарушение социального функционирования',
      'Симптомы не соответствуют критериям другого расстройства',
      'Симптомы не являются нормальной реакцией горя',
      'После устранения стрессора симптомы сохраняются не более 6 месяцев'
    ],
    'Генерализованное тревожное расстройство (F41.1)': [
      'Чрезмерная тревога и беспокойство большую часть дней',
      'Трудности с контролем беспокойства',
      'Тревога связана с тремя или более симптомами (беспокойство, утомляемость, проблемы с концентрацией, раздражительность, мышечное напряжение, нарушения сна)',
      'Нарушение социального или профессионального функционирования',
      'Симптомы не вызваны психоактивными веществами или соматическим заболеванием',
      'Симптомы не объясняются другим психическим расстройством'
    ]
  };
  
  const criteria = criteriaMap[diagnosis] || [];
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-bold mb-3">Диагностические критерии {diagnosis}</h3>
      <ul className="space-y-2">
        {criteria.map((criterion, index) => (
          <li key={index} className="flex items-start text-sm">
            <span className="inline-block w-2 h-2 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></span>
            <span>{criterion}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Компонент для отображения диагностических шкал
const DiagnosticScales: React.FC = () => {
  const [selectedScale, setSelectedScale] = useState<string>('phdq');
  
  return (
    <div>
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
        <h3 className="font-bold mb-3">Диагностические шкалы</h3>
        <p className="text-sm text-gray-600 mb-4">
          Выберите шкалу для оценки состояния пациента:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <button 
            className={`text-left p-3 rounded-lg border ${selectedScale === 'phdq' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
            onClick={() => setSelectedScale('phdq')}
          >
            <div className="font-medium">EPDS</div>
            <div className="text-xs text-gray-500">Эдинбургская шкала послеродовой депрессии</div>
          </button>
          
          <button 
            className={`text-left p-3 rounded-lg border ${selectedScale === 'ham-d' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
            onClick={() => setSelectedScale('ham-d')}
          >
            <div className="font-medium">HAM-D</div>
            <div className="text-xs text-gray-500">Шкала депрессии Гамильтона</div>
          </button>
          
          <button 
            className={`text-left p-3 rounded-lg border ${selectedScale === 'beck' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
            onClick={() => setSelectedScale('beck')}
          >
            <div className="font-medium">BDI</div>
            <div className="text-xs text-gray-500">Шкала депрессии Бека</div>
          </button>
          
          <button 
            className={`text-left p-3 rounded-lg border ${selectedScale === 'gad7' ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
            onClick={() => setSelectedScale('gad7')}
          >
            <div className="font-medium">GAD-7</div>
            <div className="text-xs text-gray-500">Шкала тревоги</div>
          </button>
        </div>
      </div>
      
      {/* Результаты выбранной шкалы */}
      <div className="bg-white rounded-xl shadow-sm p-4">
        {selectedScale === 'phdq' && (
          <div>
            <h4 className="font-bold mb-2">Эдинбургская шкала послеродовой депрессии (EPDS)</h4>
            <div className="flex items-center mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <span className="text-sm font-medium">15/30</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Интерпретация результата:</p>
            <p className="text-sm border-l-4 border-red-500 pl-3 py-1">
              Показатель 15 указывает на высокую вероятность послеродовой депрессии. Рекомендуется полная клиническая оценка.
            </p>
          </div>
        )}
        
        {selectedScale === 'ham-d' && (
          <div>
            <h4 className="font-bold mb-2">Шкала депрессии Гамильтона (HAM-D)</h4>
            <div className="flex items-center mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-sm font-medium">18/52</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Интерпретация результата:</p>
            <p className="text-sm border-l-4 border-red-500 pl-3 py-1">
              Показатель 18 соответствует депрессии средней тяжести.
            </p>
          </div>
        )}
        
        {selectedScale === 'beck' && (
          <div>
            <h4 className="font-bold mb-2">Шкала депрессии Бека (BDI)</h4>
            <div className="flex items-center mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: '55%' }}></div>
              </div>
              <span className="text-sm font-medium">22/63</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Интерпретация результата:</p>
            <p className="text-sm border-l-4 border-orange-500 pl-3 py-1">
              Показатель 22 указывает на депрессию средней тяжести.
            </p>
          </div>
        )}
        
        {selectedScale === 'gad7' && (
          <div>
            <h4 className="font-bold mb-2">Шкала тревоги (GAD-7)</h4>
            <div className="flex items-center mb-3">
              <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: '40%' }}></div>
              </div>
              <span className="text-sm font-medium">8/21</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Интерпретация результата:</p>
            <p className="text-sm border-l-4 border-yellow-500 pl-3 py-1">
              Показатель 8 указывает на умеренную тревогу.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Компонент для отображения ключевых симптомов
const KeySymptoms: React.FC = () => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  
  const symptoms = [
    "Подавленное настроение",
    "Потеря интереса и удовольствия",
    "Нарушения сна",
    "Снижение аппетита и веса",
    "Психомоторное возбуждение или заторможенность",
    "Усталость и потеря энергии",
    "Чувство вины или бесполезности",
    "Трудности с концентрацией внимания",
    "Суицидальные мысли",
    "Тревога",
    "Сниженная способность заботиться о ребенке",
    "Страх причинить вред ребенку"
  ];
  
  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h3 className="font-bold mb-3">Выявленные симптомы</h3>
      <p className="text-sm text-gray-600 mb-3">
        Отметьте симптомы, которые вы наблюдали у пациента:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {symptoms.map((symptom, index) => (
          <div 
            key={index}
            className={`flex items-center p-2 rounded-lg cursor-pointer border ${selectedSymptoms.includes(symptom) ? 'border-primary bg-primary/10' : 'border-gray-200'}`}
            onClick={() => toggleSymptom(symptom)}
          >
            <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${selectedSymptoms.includes(symptom) ? 'bg-primary border-primary' : 'border-gray-400'}`}>
              {selectedSymptoms.includes(symptom) && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <span className="text-sm">{symptom}</span>
          </div>
        ))}
      </div>
      
      {selectedSymptoms.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Выбрано симптомов: <span className="font-bold">{selectedSymptoms.length}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export const DiagnosticModule: React.FC<DiagnosticModuleProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('diagnosis');
  const { webApp } = useTelegram();
  const { completeStage } = useProgress();

  const correctDiagnosis = caseDetail.diagnosisOptions.find(d => d.isCorrect);

  useEffect(() => {
    console.log('DiagnosticModule component mounted');
    console.log('Diagnosis options available:', caseDetail.diagnosisOptions.length);
  }, [caseDetail]);

  const handleContinue = () => {
    if (showResult) {
      console.log('DiagnosticModule: continuing to treatment stage');
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.notificationOccurred('success');
      }
      
      // Отмечаем этап как завершенный
      completeStage('diagnosis');
      
      // Переходим к следующему этапу
      setStage('treatment');
    } else {
      console.log('DiagnosticModule: showing diagnosis result');
      if (webApp?.HapticFeedback) {
        webApp.HapticFeedback.impactOccurred('medium');
      }
      setShowResult(true);
    }
  };

  const handleBack = () => {
    if (showResult) {
      console.log('DiagnosticModule: hiding result, back to selection');
      setShowResult(false);
    } else {
      console.log('DiagnosticModule: going back to consultation');
      goBack();
    }
  };

  const handleDiagnosisSelect = (diagnosisId: string) => {
    setSelectedDiagnosis(diagnosisId);
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.selectionChanged();
    }
  };

  const renderDiagnosisContent = () => (
    <>
      {!showResult ? (
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h2 className="text-lg font-bold mb-4">Выберите наиболее вероятный диагноз:</h2>
          <div className="space-y-3">
            {caseDetail.diagnosisOptions.map((option) => (
              <div 
                key={option.id} 
                className={`
                  p-4 border rounded-lg cursor-pointer transition-all
                  ${selectedDiagnosis === option.id 
                    ? 'border-primary bg-primary/10 shadow-md transform scale-[1.02]' 
                    : 'border-gray-200 hover:bg-gray-50'}
                `}
                onClick={() => handleDiagnosisSelect(option.id)}
              >
                <div className="flex items-center">
                  <div className={`
                    w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                    ${selectedDiagnosis === option.id ? 'border-primary' : 'border-gray-300'}
                  `}>
                    {selectedDiagnosis === option.id && (
                      <div className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </div>
                  <span className="font-medium">{option.name}</span>
                </div>
                
                {selectedDiagnosis === option.id && (
                  <div className="pl-8 mt-2">
                    <p className="text-sm text-gray-600">
                      Нажмите "Подтвердить диагноз", чтобы проверить ваш выбор.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className={`
            p-5 rounded-xl shadow-md
            ${selectedDiagnosis === correctDiagnosis?.id
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'}
          `}>
            <div className="flex items-start">
              <div className={`rounded-full p-2 mr-3 ${selectedDiagnosis === correctDiagnosis?.id ? 'bg-green-100' : 'bg-red-100'}`}>
                {selectedDiagnosis === correctDiagnosis?.id ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">
                  {selectedDiagnosis === correctDiagnosis?.id
                    ? 'Правильный диагноз!'
                    : 'Диагноз неверный'}
                </h2>
                
                <p className="mb-2">
                  Вы выбрали: <span className="font-semibold">
                    {caseDetail.diagnosisOptions.find(d => d.id === selectedDiagnosis)?.name || 'Не выбрано'}
                  </span>
                </p>
                
                <div className="mt-4">
                  <h3 className="font-semibold mb-1">Верный диагноз:</h3>
                  <p className="font-medium text-green-800">{correctDiagnosis?.name}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-4">
            <h3 className="font-bold mb-2">Обоснование:</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {caseDetail.diagnosisOptions.find(d => d.isCorrect)?.explanation}
            </p>
          </div>
          
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 text-blue-700">
            <h3 className="font-bold mb-1">Мышление эксперта:</h3>
            <p className="text-sm">
              При диагностике важно учитывать временную динамику симптомов и их связь с событиями жизни пациента. В данном случае депрессивное расстройство возникло в послеродовом периоде, что является ключевым дифференциальным признаком.
            </p>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">Диагностика</h1>
        <p className="text-sm opacity-90">Выберите диагноз на основе собранной информации</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        {/* Только если диагноз уже выбран, покажем табы для навигации */}
        {showResult && (
          <div className="mb-6">
            <TabNavigation 
              tabs={[
                { id: 'diagnosis', label: 'Диагноз' },
                { id: 'criteria', label: 'Критерии' },
                { id: 'symptoms', label: 'Симптомы' },
                { id: 'scales', label: 'Шкалы' },
              ]}
              activeTab={activeTab}
              onChange={setActiveTab}
            />
          </div>
        )}
        
        {/* Содержимое в зависимости от активного таба */}
        {activeTab === 'diagnosis' && renderDiagnosisContent()}
        
        {activeTab === 'criteria' && showResult && (
          <DiagnosticCriteria 
            diagnosis={correctDiagnosis?.name || ''} 
          />
        )}
        
        {activeTab === 'symptoms' && showResult && (
          <KeySymptoms />
        )}
        
        {activeTab === 'scales' && showResult && (
          <DiagnosticScales />
        )}
        
        {/* Кнопка подтверждения диагноза для лучшей видимости (на экране выбора) */}
        {!showResult && (
          <div className="mt-6">
            <button 
              onClick={handleContinue}
              disabled={!selectedDiagnosis}
              className={`w-full py-3 rounded-lg font-medium ${
                selectedDiagnosis 
                  ? 'bg-primary text-white' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Подтвердить диагноз
            </button>
          </div>
        )}
      </div>

      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text={showResult ? "К лечению" : "Подтвердить диагноз"}
        onClick={handleContinue}
        disabled={!showResult && !selectedDiagnosis}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText={showResult ? "К лечению" : "Подтвердить диагноз"}
        onMainButtonClick={handleContinue}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};