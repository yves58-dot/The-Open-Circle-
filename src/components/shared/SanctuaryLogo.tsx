import React from 'react';

interface SanctuaryLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const SanctuaryLogo: React.FC<SanctuaryLogoProps> = ({
  className = '',
  size = 'md',
  showText = false
}) => {
  const sizeMap = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div className={`relative ${sizeMap[size]} shrink-0 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-[#7C9082] via-[#8D9F92] to-[#A2B4A7] text-white shadow-md shadow-[#7C9082]/20 overflow-hidden group transition-transform hover:scale-105`}>
        {/* Decorative Ring Background */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full p-1.5 text-white stroke-current fill-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer Interconnected Circle of Support */}
          <circle cx="50" cy="50" r="42" strokeWidth="3" strokeDasharray="6 4" opacity="0.6" />
          <circle cx="50" cy="50" r="34" strokeWidth="2.5" className="opacity-80" />
          
          {/* Inner Warm Petals / Holding Hands Nodes */}
          <g className="fill-current stroke-none">
            {/* Top Node */}
            <circle cx="50" cy="16" r="5" className="text-amber-200 fill-amber-200" />
            {/* Right Node */}
            <circle cx="84" cy="50" r="5" className="text-amber-200 fill-amber-200" />
            {/* Bottom Node */}
            <circle cx="50" cy="84" r="5" className="text-amber-200 fill-amber-200" />
            {/* Left Node */}
            <circle cx="16" cy="50" r="5" className="text-amber-200 fill-amber-200" />
          </g>

          {/* Central Heart of Truth */}
          <path
            d="M50 63 C35 50 28 39 36 30 C42 23 50 31 50 31 C50 31 58 23 64 30 C72 39 65 50 50 63 Z"
            fill="currentColor"
            className="text-white"
          />
        </svg>

        {/* Ambient Subtle Glow Accent */}
        <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
      </div>

      {showText && (
        <div className="text-left">
          <span className="font-serif text-lg font-bold tracking-tight text-current block leading-none">
            The Open Circle
          </span>
          <span className="text-[10px] opacity-70 font-medium tracking-widest uppercase block mt-1">
            Peer Sanctuary
          </span>
        </div>
      )}
    </div>
  );
};
