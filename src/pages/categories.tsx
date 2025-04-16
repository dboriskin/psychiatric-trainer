import type { NextPage } from 'next';
import { CategoryLibrary } from '../components/container/CategoryLibrary';
import { MainLayout } from '../components/layout/MainLayout';
import { useEffect } from 'react';
import { useNavigationStore } from '../store/navigationStore';
import { useTelegram } from '../components/telegram';

const CategoriesPage: NextPage = () => {
  const { setStage } = useNavigationStore();
  const { webApp } = useTelegram();

  useEffect(() => {
    setStage('categories');
    // Signal to Telegram that we've loaded
    if (webApp) {
      webApp.ready();
    }
  }, [setStage, webApp]);

  return (
    <MainLayout>
      <CategoryLibrary />
    </MainLayout>
  );
};

export default CategoriesPage;