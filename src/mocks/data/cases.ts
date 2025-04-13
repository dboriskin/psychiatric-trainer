export interface Case {
    id: string;
    categoryId: string;
    title: string;
    patientName: string;
    patientAge: number;
    shortDescription: string;
    isAvailable: boolean;
    completed?: boolean;
    progress?: number;
  }
  
  export const mockCases: Case[] = [
    {
      id: 'postpartum-depression',
      categoryId: 'mood-disorders',
      title: 'Послеродовая депрессия',
      patientName: 'Анна',
      patientAge: 28,
      shortDescription: 'Женщина с симптомами депрессии после рождения первого ребенка',
      isAvailable: true,
      progress: 0
    },
    {
      id: 'bipolar-disorder',
      categoryId: 'mood-disorders',
      title: 'Биполярное расстройство',
      patientName: 'Сергей',
      patientAge: 34,
      shortDescription: 'Пациент с перепадами настроения и эпизодами гипомании',
      isAvailable: true,
      progress: 0
    },
    {
      id: 'dysthymia',
      categoryId: 'mood-disorders',
      title: 'Дистимия',
      patientName: 'Ольга',
      patientAge: 42,
      shortDescription: 'Длительное подавленное настроение и низкая самооценка',
      isAvailable: true,
      progress: 0
    },
    {
      id: 'panic-disorder',
      categoryId: 'anxiety-disorders',
      title: 'Паническое расстройство',
      patientName: 'Михаил',
      patientAge: 25,
      shortDescription: 'Регулярные панические атаки и страх в общественных местах',
      isAvailable: true,
      progress: 0
    },
    {
      id: 'ocd',
      categoryId: 'anxiety-disorders',
      title: 'Обсессивно-компульсивное расстройство',
      patientName: 'Екатерина',
      patientAge: 31,
      shortDescription: 'Навязчивые мысли и ритуальные действия',
      isAvailable: true,
      progress: 0
    }
  ];
  
  export const getCaseById = (id: string): Case | undefined => {
    return mockCases.find(c => c.id === id);
  };
  
  export const getCasesByCategory = (categoryId: string): Case[] => {
    return mockCases.filter(c => c.categoryId === categoryId);
  };