import React from 'react';
import { useTelegram } from './TelegramProvider';

interface Button {
  id: string;
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  text: string;
}

interface TelegramPopupProps {
  title?: string;
  message: string;
  buttons?: Button[];
  onButtonClick?: (buttonId: string) => void;
}

export const TelegramPopup: React.FC<TelegramPopupProps> = ({
  title,
  message,
  buttons,
  onButtonClick,
}) => {
  const { webApp } = useTelegram();
  
  const handleShowPopup = () => {
    if (!webApp) return;
    
    webApp.showPopup({
      title,
      message,
      buttons,
    }, onButtonClick);
  };
  
  // Trigger popup immediately when component mounts
  React.useEffect(() => {
    handleShowPopup();
  }, []);
  
  // This component doesn't render anything itself
  return null;
};