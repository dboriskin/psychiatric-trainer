import React from 'react';
import { useTelegram } from './TelegramProvider';

interface TelegramConfirmProps {
  message: string;
  onResult?: (confirmed: boolean) => void;
}

export const TelegramConfirm: React.FC<TelegramConfirmProps> = ({
  message,
  onResult,
}) => {
  const { webApp } = useTelegram();
  
  const handleShowConfirm = () => {
    if (!webApp) return;
    
    webApp.showConfirm(message, onResult);
  };
  
  // Trigger confirm immediately when component mounts
  React.useEffect(() => {
    handleShowConfirm();
  }, []);
  
  // This component doesn't render anything itself
  return null;
};