import React, { useEffect } from 'react';
import { useBackButton } from './TelegramProvider';

interface TelegramBackButtonProps {
  onClick: () => void;
}

export const TelegramBackButton: React.FC<TelegramBackButtonProps> = ({
  onClick,
}) => {
  const backButton = useBackButton();
  
  useEffect(() => {
    if (!backButton) return;
    
    // Show back button
    backButton.show();
    
    // Add click handler
    backButton.onClick(onClick);
    
    // Cleanup on unmount
    return () => {
      backButton.offClick(onClick);
      backButton.hide();
    };
  }, [backButton, onClick]);
  
  // This component doesn't render anything itself
  return null;
};