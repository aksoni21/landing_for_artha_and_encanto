import React from 'react';

interface AssessmentFooterProps {
  variant?: 'light' | 'dark' | 'transparent';
  className?: string;
}

export const AssessmentFooter: React.FC<AssessmentFooterProps> = ({
  variant = 'transparent',
  className = ''
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'light':
        return 'border-t border-gray-200 bg-white text-gray-600';
      case 'dark':
        return 'border-t border-gray-700 bg-gray-800 text-gray-300';
      case 'transparent':
      default:
        return 'border-t border-white/20 bg-white/10 backdrop-blur-sm text-white/80';
    }
  };

  return (
    <div className={`flex-shrink-0 ${getVariantStyles()} ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full bg-current opacity-60"></div>
            <span>Secure & Confidential</span>
          </div>
          <div className="opacity-60 text-xs">
            Powered by EncantaSpeak
          </div>
        </div>
      </div>
    </div>
  );
};