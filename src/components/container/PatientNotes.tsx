import React, { useEffect, useState } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback, useTelegram } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { CaseDetail, PatientNote } from '../../services/api';
import { CaseNavigation } from '../base/CaseNavigation';

interface PatientNotesProps {
  caseDetail: CaseDetail;
}

// Компонент для отображения отдельной заметки с интерактивными элементами
const NoteCard: React.FC<{ note: PatientNote; index: number }> = ({ note, index }) => {
  const [expanded, setExpanded] = useState(false);
  const { webApp } = useTelegram();
  
  // Определяем иконку и цвет фона в зависимости от типа заметки
  let icon = '📝';
  let bgColor = 'bg-blue-50 border-blue-200';
  let iconBg = 'bg-blue-100';
  
  if (note.title.toLowerCase().includes('о пациент')) {
    icon = '👤';
    bgColor = 'bg-indigo-50 border-indigo-200';
    iconBg = 'bg-indigo-100';
  } else if (note.title.toLowerCase().includes('анамнез')) {
    icon = '📋';
    bgColor = 'bg-amber-50 border-amber-200';
    iconBg = 'bg-amber-100';
  } else if (note.title.toLowerCase().includes('наблюдени')) {
    icon = '👁️';
    bgColor = 'bg-emerald-50 border-emerald-200';
    iconBg = 'bg-emerald-100';
  }
  
  // Функция для форматирования текста с выделением ключевых моментов
  const formatContent = (content: string) => {
    // Обрабатываем маркированные списки (строки, начинающиеся с дефиса)
    if (content.includes('\n- ')) {
      return (
        <ul className="space-y-2 mt-2">
          {content.split('\n- ').map((item, idx) => {
            if (idx === 0 && !item.trim().startsWith('-')) {
              return item ? <p key="intro" className="mb-2">{item}</p> : null;
            }
            return item.trim() ? (
              <li key={idx} className="flex items-start">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mt-1.5 mr-2 flex-shrink-0"></span>
                <span>{item.trim()}</span>
              </li>
            ) : null;
          })}
        </ul>
      );
    }
    
    // Обрабатываем обычный текст с выделением важных моментов
    return (
      <p className="whitespace-pre-line">
        {content.split('\n').map((line, idx) => (
          <React.Fragment key={idx}>
            {line}
            {idx < content.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </p>
    );
  };
  
  // Обработчик нажатия на карточку
  const handleExpand = () => {
    setExpanded(!expanded);
    // Вибрация при нажатии (если доступно)
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.selectionChanged();
    }
  };
  
  return (
    <div 
      className={`mb-6 ${bgColor} border rounded-xl shadow-sm transition-all duration-300 overflow-hidden`}
      style={{ 
        transform: expanded ? 'scale(1.02)' : 'scale(1)',
        transition: 'transform 0.2s ease'
      }}
    >
      <div 
        className="flex items-center p-4 cursor-pointer"
        onClick={handleExpand}
      >
        <div className={`${iconBg} w-10 h-10 rounded-full flex items-center justify-center mr-3 text-lg`}>
          {icon}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold">{note.title}</h2>
          {!expanded && (
            <p className="text-sm text-gray-500 mt-1">
              {note.content.length > 100 
                ? `${note.content.substring(0, 100)}...` 
                : note.content}
            </p>
          )}
        </div>
        <div className="ml-2 text-gray-400">
          {expanded ? '▲' : '▼'}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-gray-200">
          <div className="text-gray-700">
            {formatContent(note.content)}
          </div>
          
          {/* Дополнительная кнопка действия (опционально) */}
          {index === 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <button 
                className="text-sm text-primary font-medium flex items-center"
                onClick={(e) => {
                  e.stopPropagation();
                  // Можно добавить какое-то действие здесь
                  if (webApp?.HapticFeedback) {
                    webApp.HapticFeedback.impactOccurred('light');
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Дополнительная информация
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const PatientNotes: React.FC<PatientNotesProps> = ({ caseDetail }) => {
  const { setStage, goBack } = useNavigationStore();
  const [activeNote, setActiveNote] = useState<number | null>(null);
  const { webApp } = useTelegram();

  useEffect(() => {
    // Логируем при монтировании для отладки
    console.log('PatientNotes component mounted:', caseDetail?.title);
  }, [caseDetail]);

  const handleContinue = () => {
    console.log('PatientNotes: continuing to next stage (patient-stories)');
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred('medium');
    }
    setStage('patient-stories');
  };

  const handleBack = () => {
    console.log('PatientNotes: going back to cases list');
    goBack();
  };

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">{caseDetail.title}</h1>
        <p className="text-sm opacity-90">Заметки о пациенте</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        {/* Информационная карточка о пациенте */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex items-center justify-center text-xl">
              {caseDetail.patientName.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold">{caseDetail.patientName}, {caseDetail.patientAge} лет</h2>
              <p className="text-sm text-gray-600">ID: {caseDetail.id}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Категория</p>
              <p className="font-medium">{caseDetail.categoryId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs text-gray-500 mb-1">Статус</p>
              <p className="font-medium text-green-600">Активный случай</p>
            </div>
          </div>
        </div>

        {/* Заметки о пациенте */}
        <h3 className="text-lg font-bold mb-3">История болезни</h3>
        
        {caseDetail.patientNotes.map((note, index) => (
          <NoteCard 
            key={index} 
            note={note} 
            index={index} 
          />
        ))}
        
        {/* Дополнительная информация */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-3 text-blue-700 mt-4">
          <p className="text-sm">
            <span className="font-bold">Важно:</span> Внимательно изучите заметки о пациенте перед переходом к следующему этапу.
          </p>
        </div>
      </div>

      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text="Продолжить"
        onClick={handleContinue}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText="Продолжить"
        onMainButtonClick={handleContinue}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};