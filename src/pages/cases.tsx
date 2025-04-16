import type { NextPage } from 'next';
import { CaseSelector } from '../components/container/CaseSelector';
import { MainLayout } from '../components/layout/MainLayout';
import { useEffect } from 'react';
import { useNavigationStore } from '../store/navigationStore';
import { useTelegram } from '../components/telegram';
import { useRouter } from 'next/router';
import { useCaseStore } from '../store/caseStore';

const CasesPage: NextPage = () => {
  const { currentStage, setStage } = useNavigationStore();
  const { currentCategoryId } = useCaseStore();
  const { webApp } = useTelegram();
  const router = useRouter();

  useEffect(() => {
    // If there's no category selected, redirect to categories
    if (!currentCategoryId) {
      router.replace('/categories');
      return;
    }

    // If coming from another page (not from navigation)
    if (currentStage !== 'cases') {
      setStage('cases');
    }
    
    // Signal to Telegram that we've loaded
    if (webApp) {
      webApp.ready();
    }
  }, [currentStage, setStage, webApp, currentCategoryId, router]);

  return (
    <MainLayout>
      <CaseSelector />
    </MainLayout>
  );
};

export default CasesPage;