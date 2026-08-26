import React from 'react';

interface QuickPollLogoProps {
  className?: string;
}

export const QuickPollLogo: React.FC<QuickPollLogoProps> = ({ className = 'w-8 h-8' }) => {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="2" y="7" width="5.5" height="13" rx="2.75" />
      <rect x="9.25" y="2" width="5.5" height="20" rx="2.75" />
      <rect x="16.5" y="7" width="5.5" height="13" rx="2.75" />
    </svg>
  );
};
