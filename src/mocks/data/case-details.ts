export interface PatientStory {
    id: string;
    title: string;
    backgroundImage?: string;
    content: string;
  }
  
  export interface PatientNote {
    title: string;
    content: string;
  }
  
  export interface CaseDetail {
    id: string;
    categoryId: string;
    title: string;
    patientName: string;
    patientAge: number;
    fullDescription: string;
    patientNotes: PatientNote[];
    patientStories: PatientStory[];
    consultationChatId?: string;
    diagnosisOptions: {
      id: string;
      name: string;
      isCorrect: boolean;
      explanation: string;
    }[];
    treatmentOptions: {
      id: string;
      name: string;
      description: string;
      outcomes: string;
      isRecommended: boolean;
    }[];
    expertCommentary: {
      title: string;
      basicContent: string;
      extendedContent: string;
      videoUrl?: string;
    };
  }
  
  // Фабрика для создания заглушек кейсов
  function createEmptyCase(caseId: string, categoryId: string, title: string, patientName: string, patientAge: number): CaseDetail {
    return {
      id: caseId,
      categoryId,
      title,
      patientName,
      patientAge,
      fullDescription: `Заглушка описания для ${title}`,
      patientNotes: [
        {
          title: 'О пациенте',
          content: `${patientName}, ${patientAge} лет. Это заглушка для демонстрации навигации. В полной версии здесь будет подробная информация о пациенте.`
        },
        {
          title: 'Анамнез',
          content: 'Заглушка анамнеза. Здесь будут данные о предыдущих состояниях и истории болезни.'
        }
      ],
      patientStories: [
        {
          id: 'story-1',
          title: 'История пациента',
          backgroundImage: 'https://via.placeholder.com/800x1200/333333/FFFFFF?text=История+пациента',
          content: 'Заглушка для истории пациента. В полной версии здесь будет описание случая от первого лица или со слов врача.'
        }
      ],
      consultationChatId: 'demoChatId',
      diagnosisOptions: [
        {
          id: 'diagnosis-1',
          name: 'Заглушка диагноза 1',
          isCorrect: true,
          explanation: 'Это правильный диагноз для демонстрации.'
        },
        {
          id: 'diagnosis-2',
          name: 'Заглушка диагноза 2',
          isCorrect: false,
          explanation: 'Это неправильный диагноз для демонстрации.'
        }
      ],
      treatmentOptions: [
        {
          id: 'treatment-1',
          name: 'Заглушка лечения 1',
          description: 'Описание первого варианта лечения.',
          outcomes: 'Результаты первого варианта лечения.',
          isRecommended: true
        },
        {
          id: 'treatment-2',
          name: 'Заглушка лечения 2',
          description: 'Описание второго варианта лечения.',
          outcomes: 'Результаты второго варианта лечения.',
          isRecommended: false
        }
      ],
      expertCommentary: {
        title: 'Комментарий эксперта',
        basicContent: 'Базовый комментарий эксперта для демонстрации функциональности.',
        extendedContent: 'Расширенный комментарий эксперта, который становится доступен после изучения всех вариантов лечения.',
        videoUrl: ''
      }
    };
  }
  
  export const mockCaseDetails: Record<string, CaseDetail> = {
    'postpartum-depression': {
      id: 'postpartum-depression',
      categoryId: 'mood-disorders',
      title: 'Послеродовая депрессия',
      patientName: 'Анна',
      patientAge: 28,
      fullDescription: 'Пациентка Анна, 28 лет, молодая мать с симптомами послеродовой депрессии, возникшими через 6 недель после рождения первого ребенка.',
      patientNotes: [
        {
          title: 'О пациентке',
          content: 'Анна, 28 лет. Образованная женщина, работает бухгалтером. Находится в декретном отпуске. Замужем 3 года, отношения описывает как хорошие. Родила первого ребенка 6 недель назад, роды были тяжелыми (экстренное кесарево сечение).'
        },
        {
          title: 'Анамнез',
          content: '- Нет предыдущей истории психических расстройств\n- Депрессивный эпизод в университете, длившийся около 3 месяцев\n- Семейный анамнез: мать страдала от депрессии\n- Никаких соматических заболеваний\n- Не курит, алкоголь - редко'
        },
        {
          title: 'Наблюдения',
          content: 'Пациентка выглядит уставшей, с трудом поддерживает зрительный контакт. Одежда опрятная, но волосы не ухожены. Говорит тихо, часто вздыхает. Упоминает чувство вины за то, что "не справляется" с материнством.'
        }
      ],
      patientStories: [
        {
          id: 'story-1',
          title: 'Первый прием',
          backgroundImage: 'https://via.placeholder.com/800x1200/333333/FFFFFF?text=История+пациентки',
          content: 'Анна пришла на прием по настоянию мужа. Выглядит истощенной, с кругами под глазами. "Я не могу спать, даже когда ребенок спит. Просто лежу и думаю о том, что я плохая мать. Иногда мне кажется, что было бы лучше, если бы меня не было. Не то чтобы я хочу причинить себе вред, просто думаю, что все были бы счастливее без меня."'
        },
        {
          id: 'story-2',
          title: 'Симптомы',
          backgroundImage: 'https://via.placeholder.com/800x1200/333333/FFFFFF?text=Симптомы',
          content: '"Я чувствую себя опустошенной. Мне не радостно смотреть на ребенка, а ведь я так ждала его. Я не могу есть, похудела на 7 кг после родов. Все говорят, что это нормально быть уставшей, но я думаю, со мной что-то не так. Я не могу принимать решения, даже самые простые, например, что надеть."'
        },
        {
          id: 'story-3',
          title: 'Социальная ситуация',
          backgroundImage: 'https://via.placeholder.com/800x1200/333333/FFFFFF?text=Социальная+ситуация',
          content: '"Муж старается помогать, но он работает допоздна. Моя мама живет в другом городе. Я перестала общаться с подругами, не хочу никого видеть. Мне кажется, они все счастливые матери, а я... я боюсь, что они увидят, какая я на самом деле неспособная."'
        }
      ],
      consultationChatId: 'chat123456',
      diagnosisOptions: [
        {
          id: 'diagnosis-1',
          name: 'Послеродовая депрессия (F53.0)',
          isCorrect: true,
          explanation: 'Депрессивное расстройство, возникшее в послеродовом периоде (до 6 недель после родов). Характеризуется подавленным настроением, ангедонией, нарушениями сна и аппетита, чувством вины и снижением самооценки.'
        },
        {
          id: 'diagnosis-2',
          name: 'Адаптационное расстройство (F43.2)',
          isCorrect: false,
          explanation: 'Хотя переход к материнству является стрессом, симптомы пациентки слишком серьезны и соответствуют критериям депрессивного расстройства. Присутствуют суицидальные мысли и значительные нарушения функционирования.'
        },
        {
          id: 'diagnosis-3',
          name: 'Генерализованное тревожное расстройство (F41.1)',
          isCorrect: false,
          explanation: 'Хотя у пациентки есть тревожные симптомы, преобладают депрессивные симптомы: подавленное настроение, ангедония, чувство вины, суицидальные мысли.'
        }
      ],
      treatmentOptions: [
        {
          id: 'treatment-1',
          name: 'Фармакотерапия и психотерапия',
          description: 'Комбинированный подход: СИОЗС (сертралин) и когнитивно-поведенческая терапия (КПТ).',
          outcomes: 'Через 8 недель значительное улучшение настроения, нормализация сна и аппетита. Суицидальные мысли исчезли. Пациентка сообщает о улучшении отношений с ребенком и возвращении интереса к жизни.',
          isRecommended: true
        },
        {
          id: 'treatment-2',
          name: 'Только психотерапия',
          description: 'Когнитивно-поведенческая терапия без медикаментозного лечения.',
          outcomes: 'Медленное улучшение в течение 12 недель. Некоторые симптомы сохраняются, особенно проблемы со сном и аппетитом. Потребовалось больше времени для достижения ремиссии.',
          isRecommended: false
        },
        {
          id: 'treatment-3',
          name: 'Только фармакотерапия',
          description: 'Лечение СИОЗС (сертралин) без структурированной психотерапии.',
          outcomes: 'Улучшение биологических симптомов через 6 недель, но сохраняются проблемы в отношениях с ребенком и чувство неуверенности в своих материнских способностях.',
          isRecommended: false
        }
      ],
      expertCommentary: {
        title: 'Комментарий эксперта',
        basicContent: 'Послеродовая депрессия - серьезное состояние, которое часто недооценивается и списывается на "обычную усталость". Важно различать послеродовую хандру (baby blues), которая проходит через 2 недели, и послеродовую депрессию, требующую лечения.',
        extendedContent: 'При лечении послеродовой депрессии необходимо учитывать специфику перинатального периода. СИОЗС, особенно сертралин, считаются безопасными при грудном вскармливании. Важно также работать с парой мать-ребенок, улучшая их взаимодействие, и привлекать к поддержке других членов семьи. Следует оценить риск суицида и при необходимости принять меры для обеспечения безопасности пациентки и ребенка.',
        videoUrl: 'https://example.com/expert-video.mp4'
      }
    },
    
    // Создаем заглушки для остальных кейсов
    'bipolar-disorder': createEmptyCase(
      'bipolar-disorder', 
      'mood-disorders', 
      'Биполярное расстройство', 
      'Сергей', 
      34
    ),
    
    'dysthymia': createEmptyCase(
      'dysthymia', 
      'mood-disorders', 
      'Дистимия', 
      'Ольга', 
      42
    ),
    
    'panic-disorder': createEmptyCase(
      'panic-disorder', 
      'anxiety-disorders', 
      'Паническое расстройство', 
      'Михаил', 
      25
    ),
    
    'ocd': createEmptyCase(
      'ocd', 
      'anxiety-disorders', 
      'Обсессивно-компульсивное расстройство', 
      'Екатерина', 
      31
    )
  };
  
  export const getCaseDetailById = (id: string): CaseDetail | undefined => {
    return mockCaseDetails[id];
  };