import React, { useEffect } from 'react';
import { useMainButton } from './TelegramProvider';

interface TelegramMainButtonProps {
  text: string;
  onClick: () => void;
  disabled?: boolean;
  progress?: boolean;
  color?: string;
  textColor?: string;
}

export const TelegramMainButton: React.FC<TelegramMainButtonProps> = ({
  text,
  onClick,
  disabled = false,
  progress = false,
  color,
  textColor,
}) => {
  const mainButton = useMainButton();
  
  useEffect(() => {
    if (!mainButton) return;
    
    // Set button text
    mainButton.setText(text);
    
    // Set colors if provided
    if (color || textColor) {
      mainButton.setParams({
        color: color,
        text_color: textColor,
      });
    }
    
    // Add click handler
    mainButton.onClick(onClick);
    
    // Show the button
    mainButton.show();
    
    // Handle disabled state
    if (disabled) {
      mainButton.disable();
    } else {
      mainButton.enable();
    }
    
    // Handle loading state
    if (progress) {
      mainButton.showProgress();
    } else {
      mainButton.hideProgress();
    }
    
    // Cleanup on unmount
    return () => {
      mainButton.offClick(onClick);
      mainButton.hide();
    };
  }, [mainButton, text, onClick, disabled, progress, color, textColor]);
  
  // This component doesn't render anything itself
  return null;
};