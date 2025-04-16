import React, { useEffect, useState } from 'react';
import { Card, Header, LoadingSpinner, StatusBadge } from '../base';
import { useNavigationStore } from '../../store/navigationStore';
import { useCaseStore } from '../../store/caseStore';
import { Category } from '../../services/api';
import { useTelegram, TelegramMainButton } from '../telegram';
import { useMobileView } from '../../utils/hooks';
// Импортируем мок-данные напрямую
import { mockCategories } from '../../mocks/data/categories';

export const CategoryLibrary: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const { setStage } = useNavigationStore();
  const { setCurrentCategory } = useCaseStore();
  const isMobile = useMobileView();
  const { webApp } = useTelegram();

  useEffect(() => {
    // Имитируем загрузку данных
    setLoading(true);
    
    // Используем таймаут для эмуляции сетевого запроса
    const timer = setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleCategoryClick = (category: Category) => {
    if (!category.isAvailable) return;
    
    setCurrentCategory(category.id);
    setStage('cases');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16">
      <Header 
        title="Клинические тренажеры" 
        subtitle="Выберите направление для изучения"
      />

      <main className="container-padding">
        {/* Filter tabs */}
        <div className="mb-4 border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeFilter === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveFilter('all')}
            >
              Все
            </button>
            <button
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeFilter === 'inProgress'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveFilter('inProgress')}
            >
              В работе
            </button>
            <button
              className={`py-2 px-4 text-center border-b-2 font-medium text-sm ${
                activeFilter === 'completed'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveFilter('completed')}
            >
              Завершенные
            </button>
          </nav>
        </div>

        {/* Categories grid */}
        <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
          {categories.map((category) => (
            <Card 
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`${!category.isAvailable ? 'opacity-70' : ''} transition-transform hover:scale-105`}
            >
              <div 
                className="h-32 bg-cover bg-center" 
                style={{ backgroundImage: `url(${category.backgroundUrl})` }}
              >
                <div className="h-full flex items-end p-3 bg-gradient-to-t from-black/70 to-transparent">
                  <h2 className="text-white text-lg font-bold">{category.name}</h2>
                </div>
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <div className="flex justify-between items-center">
                  {category.isAvailable ? (
                    <StatusBadge label="Доступно" variant="success" />
                  ) : (
                    <StatusBadge label="Скоро" variant="neutral" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search input (initially hidden, for future implementation) */}
        <div className="hidden mt-4">
          <input
            type="text"
            placeholder="Поиск тренажеров..."
            className="w-full p-2 border border-gray-300 rounded-lg"
          />
        </div>
      </main>

      {/* Telegram Main Button */}
      <TelegramMainButton
        text="Открыть профиль"
        onClick={() => {
          // Navigate to profile or do something else
          console.log('Open profile');
        }}
      />
    </div>
  );
};