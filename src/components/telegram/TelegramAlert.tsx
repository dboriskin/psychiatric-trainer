import React from 'react';
import { useTelegram } from './TelegramProvider';

interface TelegramAlertProps {
  message: string;
  onClose?: () => void;
}

export const TelegramAlert: React.FC<TelegramAlertProps> = ({
  message,
  onClose,
}) => {
  const { webApp } = useTelegram();
  
  const handleShowAlert = () => {
    if (!webApp) return;
    
    webApp.showAlert(message, onClose);
  };
  
  // Trigger alert immediately when component mounts
  React.useEffect(() => {
    handleShowAlert();
  }, []);
  
  // This component doesn't render anything itself
  return null;
};