import React from 'react';
import { useTelegram } from './TelegramProvider';
import { useNavigationStore } from '../../store/navigationStore';
import { useCaseStore } from '../../store/caseStore';

interface TelegramDebugPanelProps {
  onClose: () => void;
}

export const TelegramDebugPanel: React.FC<TelegramDebugPanelProps> = ({
  onClose,
}) => {
  const { webApp, isMocked } = useTelegram();
  const { currentStage } = useNavigationStore();
  const { currentCaseId, currentCategoryId } = useCaseStore();
  
  if (!webApp) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-neutral-800 text-white p-4 text-sm z-50">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold">Telegram Debug Panel</span>
        <button 
          onClick={onClose}
          className="text-white hover:text-red-400"
        >
          Close
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p>Stage: <span className="font-mono">{currentStage}</span></p>
          <p>Category ID: <span className="font-mono">{currentCategoryId || 'none'}</span></p>
          <p>Case ID: <span className="font-mono">{currentCaseId || 'none'}</span></p>
          <p>Mock Mode: <span className="font-mono">{isMocked ? 'Yes' : 'No'}</span></p>
        </div>
        <div>
          <p>Platform: <span className="font-mono">{webApp?.platform || 'unknown'}</span></p>
          <p>Color Scheme: <span className="font-mono">{webApp?.colorScheme || 'unknown'}</span></p>
          <p>Viewport Height: <span className="font-mono">{webApp?.viewportHeight || 0}px</span></p>
        </div>
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <div className="text-xs font-bold mb-1">MainButton Controls:</div>
          <div className="flex space-x-2">
            <button 
              onClick={() => webApp?.MainButton.show()}
              className="bg-blue-600 px-2 py-1 rounded text-xs"
            >
              Show
            </button>
            <button 
              onClick={() => webApp?.MainButton.hide()}
              className="bg-blue-600 px-2 py-1 rounded text-xs"
            >
              Hide
            </button>
            <button 
              onClick={() => {
                webApp?.MainButton.setText("Test Button");
                webApp?.MainButton.show();
              }}
              className="bg-blue-600 px-2 py-1 rounded text-xs"
            >
              Set Text
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <div className="text-xs font-bold mb-1">BackButton Controls:</div>
          <div className="flex space-x-2">
            <button 
              onClick={() => webApp?.BackButton.show()}
              className="bg-blue-600 px-2 py-1 rounded text-xs"
            >
              Show
            </button>
            <button 
              onClick={() => webApp?.BackButton.hide()}
              className="bg-blue-600 px-2 py-1 rounded text-xs"
            >
              Hide
            </button>
            <button 
              onClick={() => (webApp as any)?.debug?.triggerBackButton()}
              className="bg-blue-600 px-2 py-1 rounded text-xs"
            >
              Trigger
            </button>
          </div>
        </div>
      </div>
      <div className="mt-2 space-y-1">
        <div className="text-xs font-bold mb-1">Popups & Dialogs:</div>
        <div className="flex space-x-2">
          <button 
            onClick={() => webApp?.showAlert("This is a test alert")}
            className="bg-blue-600 px-2 py-1 rounded text-xs"
          >
            Alert
          </button>
          <button 
            onClick={() => webApp?.showConfirm("This is a test confirmation")}
            className="bg-blue-600 px-2 py-1 rounded text-xs"
          >
            Confirm
          </button>
          <button 
            onClick={() => 
              webApp?.showPopup({
                title: "Test Popup",
                message: "This is a test popup with multiple buttons",
                buttons: [
                  { id: "ok", type: "default", text: "OK" },
                  { id: "cancel", type: "cancel", text: "Cancel" }
                ]
              })
            }
            className="bg-blue-600 px-2 py-1 rounded text-xs"
          >
            Popup
          </button>
          <button 
            onClick={() => (webApp as any)?.debug?.toggleColorScheme()}
            className="bg-blue-600 px-2 py-1 rounded text-xs"
          >
            Toggle Theme
          </button>
        </div>
      </div>
    </div>
  );
};