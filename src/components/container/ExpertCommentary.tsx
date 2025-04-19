import React, { useState, useEffect, useRef } from 'react';
import { TelegramMainButton, TelegramBackButton, ButtonFallback } from '../telegram';
import { useNavigationStore } from '../../store/navigationStore';
import { useTelegram } from '../telegram/TelegramProvider';
import { CaseDetail } from '../../services/api';
import { useProgress } from '../../hooks/useProgress';
import { CaseNavigation } from '../base/CaseNavigation';

interface ExpertCommentaryProps {
  caseDetail: CaseDetail;
}

export const ExpertCommentary: React.FC<ExpertCommentaryProps> = ({ caseDetail }) => {
  const { goBack, setStage } = useNavigationStore();
  const { webApp } = useTelegram();
  const { progress, updateProgress } = useProgress();
  const [showExtended, setShowExtended] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [activeNoteIndex, setActiveNoteIndex] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Для демо-версии делаем все варианты просмотренными
  const allOptionsViewed = true;

  useEffect(() => {
    console.log('ExpertCommentary component mounted');
    console.log('Extended content available:', !!caseDetail.expertCommentary.extendedContent);
    
    // Устанавливаем флаг завершения случая при входе на этот экран
    if (progress && !progress.completed) {
      updateProgress({
        completed: true,
        currentStage: 'expert-comment',
        stagesCompleted: [...(progress.stagesCompleted || []), 'expert-comment']
      });
    }
  }, [caseDetail, progress, updateProgress]);

  const handleBack = () => {
    console.log('ExpertCommentary: going back to results');
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred('light');
    }
    goBack();
  };

  const handleFinish = () => {
    console.log('ExpertCommentary: finishing the case');
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.notificationOccurred('success');
    }
    
    // В демо-режиме просто возвращаемся к списку категорий
    setStage('categories');
    
    // В реальном проекте мы бы отправили данные боту
    // if (webApp && webApp.sendData) {
    //   const result = { caseId: caseDetail.id, completed: true };
    //   webApp.sendData(JSON.stringify(result));
    // }
  };
  
  // Обработчик для управления видео
  const handleVideoClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsVideoPlaying(true);
        if (webApp?.HapticFeedback) {
          webApp.HapticFeedback.impactOccurred('light');
        }
      } else {
        videoRef.current.pause();
        setIsVideoPlaying(false);
        if (webApp?.HapticFeedback) {
          webApp.HapticFeedback.impactOccurred('light');
        }
      }
    }
  };
  
  // Обработчик для обновления прогресса видео
  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(progress);
    }
  };
  
  // Функция для форматирования времени видео
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Определим некоторые заметки для коллекции интерактивных заметок эксперта
  const expertNotes = [
    {
      title: "Дифференциальная диагностика",
      content: "При послеродовой депрессии важно исключить биполярное расстройство, поскольку антидепрессанты могут спровоцировать манию. В анамнезе пациентки нет указаний на маниакальные или гипоманиакальные эпизоды, что подтверждает диагноз униполярной депрессии.",
      icon: "🔍"
    },
    {
      title: "Фармакотерапия при грудном вскармливании",
      content: "Сертралин имеет наиболее благоприятный профиль безопасности при грудном вскармливании из всех СИОЗС. Концентрация в грудном молоке и плазме младенцев минимальна, и нет убедительных данных о негативном влиянии на развитие ребенка.",
      icon: "💊"
    },
    {
      title: "Динамика восстановления",
      content: "Типичная динамика при терапии СИОЗС: первыми улучшаются физические симптомы (сон, аппетит, энергия) в течение 1-2 недель, затем настроение и когнитивные функции (через 2-4 недели), и в последнюю очередь - интерес и мотивация (3-6 недель).",
      icon: "📈"
    },
    {
      title: "Работа с чувством вины",
      content: "Чувство вины перед ребенком - центральный симптом у многих женщин с послеродовой депрессией. Важно нормализовать эти чувства и объяснить биологическую природу нарушений. Стигматизация и чувство вины часто становятся барьером для обращения за помощью.",
      icon: "🧠"
    }
  ];

  return (
    <div className="min-h-screen pb-20">
      <div className="bg-primary text-white p-4">
        <h1 className="text-xl font-bold">{caseDetail.expertCommentary.title}</h1>
        <p className="text-sm opacity-90">Мнение специалиста</p>
      </div>

      <div className="p-4">
        {/* Навигация для возврата к списку кейсов и категорий */}
        <CaseNavigation className="mb-4" />
        
        {/* Информация об эксперте */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-primary/20 rounded-full mr-3 flex items-center justify-center text-primary font-bold">
              ДВ
            </div>
            <div>
              <h2 className="font-bold">Д-р Волков Александр Иванович</h2>
              <p className="text-sm text-gray-600">Психиатр, кандидат медицинских наук</p>
              <p className="text-xs text-gray-500 mt-1">Специалист по перинатальной психиатрии, 15 лет опыта</p>
            </div>
          </div>
        </div>
        
        {/* Видеоплеер с комментарием эксперта */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6 relative transition-all duration-300 ease-in-out"
          style={{
            position: isVideoExpanded ? 'fixed' : 'relative',
            top: isVideoExpanded ? '0' : 'auto',
            left: isVideoExpanded ? '0' : 'auto',
            right: isVideoExpanded ? '0' : 'auto',
            bottom: isVideoExpanded ? '0' : 'auto',
            zIndex: isVideoExpanded ? 50 : 'auto',
            borderRadius: isVideoExpanded ? '0' : '0.75rem',
          }}
        >
          <div 
            className="relative cursor-pointer"
            onClick={handleVideoClick}
          >
            {/* Заглушка видеоплеера */}
            <div 
              className="bg-gray-900 aspect-video relative overflow-hidden"
              style={{
                height: isVideoExpanded ? '100vh' : 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {/* Используем здесь реальный видеоплеер вместо заглушки */}
              <video 
                ref={videoRef}
                className="w-full h-full object-contain"
                poster="https://via.placeholder.com/1280x720/333333/FFFFFF?text=Комментарий+эксперта"
                onTimeUpdate={handleVideoTimeUpdate}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                onEnded={() => setIsVideoPlaying(false)}
              >
                <source src={caseDetail.expertCommentary.videoUrl || ""} type="video/mp4" />
                Ваш браузер не поддерживает видео.
              </video>
              
              {/* Кнопка Play/Pause */}
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-primary/80 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            
            {/* Прогресс-бар видео */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
              <div 
                className="h-full bg-primary"
                style={{ width: `${videoProgress}%` }}
              ></div>
            </div>
          </div>
          
          {/* Управление видео */}
          <div className="px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <button 
                className="p-2 rounded-full hover:bg-gray-100"
                onClick={handleVideoClick}
              >
                {isVideoPlaying ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                )}
              </button>
              <span className="text-xs ml-2">
                {videoRef.current 
                  ? `${formatTime(videoRef.current.currentTime)} / ${formatTime(videoRef.current.duration || 0)}`
                  : "0:00 / 0:00"
                }
              </span>
            </div>
            
            <button 
              className="p-2 rounded-full hover:bg-gray-100"
              onClick={() => {
                console.log("Toggling fullscreen mode");
                setIsVideoExpanded(!isVideoExpanded);
                // Принудительно обновляем DOM при изменении состояния
                setTimeout(() => window.dispatchEvent(new Event('resize')), 50);
              }}
            >
              {isVideoExpanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Кнопка закрытия для полноэкранного режима */}
          {isVideoExpanded && (
            <button 
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"
              onClick={() => setIsVideoExpanded(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Базовый комментарий */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <h2 className="text-lg font-bold mb-3">Комментарий эксперта</h2>
          <div className="text-gray-700 whitespace-pre-line">
            {caseDetail.expertCommentary.basicContent}
          </div>
        </div>
        
        {/* Интерактивные заметки эксперта */}
        <div className="mb-6">
          <h3 className="font-bold mb-3">Ключевые заметки эксперта</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {expertNotes.map((note, index) => (
              <div 
                key={index}
                className={`border rounded-xl p-3 cursor-pointer transition-all ${
                  activeNoteIndex === index 
                    ? 'border-primary bg-primary/10 shadow transform scale-[1.02]'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setActiveNoteIndex(activeNoteIndex === index ? null : index);
                  if (webApp?.HapticFeedback) {
                    webApp.HapticFeedback.selectionChanged();
                  }
                }}
              >
                <div className="flex items-start">
                  <div className="text-2xl mr-3">{note.icon}</div>
                  <div>
                    <h4 className="font-medium">{note.title}</h4>
                    {activeNoteIndex === index && (
                      <p className="text-sm mt-2 text-gray-700">{note.content}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Расширенный комментарий (отображается только после изучения всех вариантов) */}
        {allOptionsViewed ? (
          <div className="bg-white rounded-xl shadow-md p-4 mb-6">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <h2 className="text-lg font-bold">Расширенный комментарий</h2>
              </div>
              
              {!showExtended && (
                <button 
                  className="text-primary font-medium flex items-center"
                  onClick={() => {
                    setShowExtended(true);
                    if (webApp?.HapticFeedback) {
                      webApp.HapticFeedback.impactOccurred('light');
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Показать
                </button>
              )}
            </div>
            
            {showExtended ? (
              <div className="text-gray-700 whitespace-pre-line">
                {caseDetail.expertCommentary.extendedContent}
              </div>
            ) : (
              <div className="bg-blue-50 p-4 rounded-lg text-blue-800 flex">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p>Расширенный комментарий доступен! Нажмите "Показать", чтобы увидеть дополнительную информацию от эксперта.</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-100 rounded-xl shadow-md p-4 border border-gray-300">
            <div className="flex items-center space-x-3 mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-lg font-bold text-gray-500">Расширенный комментарий</h2>
            </div>
            <p className="text-gray-500">
              Чтобы разблокировать расширенный комментарий эксперта, вернитесь на экран результатов и изучите все варианты лечения.
            </p>
          </div>
        )}
        
        {/* Сертификат о прохождении кейса */}
        <div className="bg-gradient-to-r from-primary/20 to-blue-100 rounded-xl shadow-md p-5 mb-6 border border-primary/30">
          <div className="text-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h3 className="text-lg font-bold mt-2">Поздравляем!</h3>
            <p className="text-sm text-gray-600">Вы успешно завершили клинический случай</p>
          </div>
          
          <div className="text-center mt-4">
            <h4 className="font-bold text-xl">{caseDetail.title}</h4>
            <p className="text-sm mt-1">Прогресс: 100%</p>
            
            <button 
              className="mt-4 bg-primary text-white px-4 py-2 rounded-lg font-medium"
              onClick={handleFinish}
            >
              Завершить случай
            </button>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <TelegramBackButton onClick={handleBack} />

      {/* Main Button */}
      <TelegramMainButton
        text="Завершить случай"
        onClick={handleFinish}
      />
      
      {/* Fallback кнопки для браузера */}
      <ButtonFallback
        mainButtonText="Завершить случай"
        onMainButtonClick={handleFinish}
        onBackButtonClick={handleBack}
      />
    </div>
  );
};