export interface Category {
    id: string;
    name: string;
    description: string;
    iconUrl: string;
    backgroundUrl: string;
    isAvailable: boolean;
    comingSoon?: boolean;
  }
  
  export const mockCategories: Category[] = [
    {
      id: 'mood-disorders',
      name: 'Расстройства настроения',
      description: 'Депрессия, биполярное расстройство и другие аффективные расстройства',
      iconUrl: '/images/mood-icon.svg',
      backgroundUrl: 'https://via.placeholder.com/500x300/5288c1/FFFFFF?text=Расстройства+настроения',
      isAvailable: true
    },
    {
      id: 'anxiety-disorders',
      name: 'Тревожные расстройства',
      description: 'Панические атаки, ОКР, генерализованное тревожное расстройство',
      iconUrl: '/images/anxiety-icon.svg',
      backgroundUrl: 'https://via.placeholder.com/500x300/4eadd8/FFFFFF?text=Тревожные+расстройства',
      isAvailable: true
    },
    {
      id: 'eating-disorders',
      name: 'Расстройства пищевого поведения',
      description: 'Анорексия, булимия, компульсивное переедание',
      iconUrl: '/images/eating-icon.svg',
      backgroundUrl: 'https://via.placeholder.com/500x300/b58db6/FFFFFF?text=Пищевые+расстройства',
      isAvailable: false,
      comingSoon: true
    },
    {
      id: 'cognitive-disorders',
      name: 'Когнитивные нарушения',
      description: 'Деменция, болезнь Альцгеймера, когнитивное снижение',
      iconUrl: '/images/cognitive-icon.svg',
      backgroundUrl: 'https://via.placeholder.com/500x300/9cb071/FFFFFF?text=Когнитивные+нарушения',
      isAvailable: false,
      comingSoon: true
    }
  ];