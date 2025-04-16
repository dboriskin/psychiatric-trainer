import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useNavigationStore, StageType } from '../../store/navigationStore';
import { useCaseStore } from '../../store/caseStore';
import { useTelegram } from '../../components/telegram';
import { SidebarLayout } from '../../components/layout/SidebarLayout';
import { LoadingSpinner } from '../../components/base';
import { useCase } from '../../hooks/useCase';
import { useProgress } from '../../hooks/useProgress';

// Import container components for different stages
import { PatientNotes } from '../../components/container/PatientNotes';
import { PatientStories } from '../../components/container/PatientStories';
import { ConsultationTransition } from '../../components/container/ConsultationTransition';
import { DiagnosticModule } from '../../components/container/DiagnosticModule';
import { TreatmentModule } from '../../components/container/TreatmentModule';
import { ResultsModule } from '../../components/container/ResultsModule';
import { ExpertCommentary } from '../../components/container/ExpertCommentary';

const CaseStagePage: NextPage = () => {
  const router = useRouter();
  const { stage } = router.query;
  const { currentStage, setStage, history } = useNavigationStore();
  const { currentCaseId } = useCaseStore();
  const { webApp } = useTelegram();
  const { caseDetail, loading: caseLoading } = useCase();
  const { progress, loading: progressLoading } = useProgress();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Если no case is selected, redirect to cases list
    if (!currentCaseId) {
      console.warn('No case selected, redirecting to cases list');
      router.replace('/cases');
      return;
    }
    
    console.log(`CaseStagePage mounted: stage=${stage}, caseId=${currentCaseId}`);

    // Parse stage from URL
    if (stage && typeof stage === 'string') {
      const validStage = isValidStage(stage);
      
      if (validStage) {
        // If valid stage, set it as current
        console.log(`Setting stage to: ${validStage}`);
        setStage(validStage);
      } else {
        // If invalid stage, redirect to patient-notes
        console.warn(`Invalid stage: ${stage}, redirecting to patient-notes`);
        router.replace('/case/patient-notes');
      }
    }

    // Signal to Telegram that we've loaded
    if (webApp) {
      webApp.ready();
    }

    // Set loading to false when everything is loaded
    if (!caseLoading && !progressLoading && caseDetail) {
      console.log('Case data loaded successfully:', caseDetail.title);
      setLoading(false);
    }
  }, [stage, setStage, webApp, currentCaseId, router, caseLoading, progressLoading, caseDetail]);

  // Check if the stage is valid
  const isValidStage = (stage: string): StageType | null => {
    const validStages: StageType[] = [
      'patient-notes',
      'patient-stories',
      'consultation',
      'diagnosis',
      'treatment',
      'results',
      'expert-comment'
    ];
    
    return validStages.includes(stage as StageType) ? (stage as StageType) : null;
  };

  // Render appropriate component based on stage
  const renderStageComponent = () => {
    if (loading || !caseDetail) {
      return (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner size="lg" />
        </div>
      );
    }

    switch (currentStage) {
      case 'patient-notes':
        return <PatientNotes caseDetail={caseDetail} />;
      case 'patient-stories':
        return <PatientStories caseDetail={caseDetail} />;
      case 'consultation':
        return <ConsultationTransition caseDetail={caseDetail} />;
      case 'diagnosis':
        return <DiagnosticModule caseDetail={caseDetail} />;
      case 'treatment':
        return <TreatmentModule caseDetail={caseDetail} />;
      case 'results':
        return <ResultsModule caseDetail={caseDetail} />;
      case 'expert-comment':
        return <ExpertCommentary caseDetail={caseDetail} />;
      default:
        return (
          <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Неизвестный этап</h1>
            <p>Выберите этап из боковой панели</p>
          </div>
        );
    }
  };

  return (
    <SidebarLayout>
      {renderStageComponent()}
    </SidebarLayout>
  );
};

export default CaseStagePage;