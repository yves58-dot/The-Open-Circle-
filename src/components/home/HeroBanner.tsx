import React from 'react';
import { Sparkles, BookOpen, Heart, Moon } from 'lucide-react';

interface HeroBannerProps {
  onShareClick: () => void;
  onBrowseClick: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onShareClick,
  onBrowseClick
}) => {
  return (
    <div className="relative w-full rounded-3xl overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#1E1B4B] to-[#0A0E1A] text-white p-8 md:p-12 shadow-xl border border-[#312E81]/30">
      
      {/* Night Sky Graphic / Ambient Glow & Moon Elements */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
        {/* Glowing Crescent Moon */}
        <div className="absolute top-8 right-12 md:right-24 w-20 h-20 rounded-full bg-gradient-to-tr from-amber-100 to-amber-200/80 shadow-[0_0_50px_rgba(254,240,138,0.45)] flex items-center justify-center">
          {/* Inner shadow overlay creating crescent silhouette */}
          <div className="w-16 h-16 rounded-full bg-[#181838] translate-x-3 -translate-y-2"></div>
        </div>

        {/* Twinkling Star Dots */}
        <div className="absolute top-12 right-64 w-1.5 h-1.5 rounded-full bg-white animate-pulse opacity-80"></div>
        <div className="absolute top-24 right-40 w-2 h-2 rounded-full bg-indigo-200 animate-ping opacity-60"></div>
        <div className="absolute top-6 right-80 w-1 h-1 rounded-full bg-white opacity-70"></div>
        <div className="absolute top-36 right-16 w-1.5 h-1.5 rounded-full bg-amber-100 animate-pulse opacity-75"></div>

        {/* Peaceful Meditative Silhouette Accent in the background */}
        <div className="absolute bottom-0 right-16 md:right-32 opacity-25 md:opacity-35 pointer-events-none">
          <svg width="180" height="120" viewBox="0 0 200 140" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 30 C108 30 115 37 115 45 C115 53 108 60 100 60 C92 60 85 53 85 45 C85 37 92 30 100 30 Z" fill="#C7D2FE" />
            <path d="M70 140 C70 95 85 75 100 75 C115 75 130 95 130 140 Z" fill="#818CF8" />
            <path d="M40 140 C50 110 75 100 100 100 C125 100 150 110 160 140 Z" fill="#6366F1" opacity="0.6" />
            <path d="M0 140 Q100 120 200 140 Z" fill="#312E81" />
          </svg>
        </div>

        {/* Soft Radial Ambient Lights */}
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-[#6366F1]/20 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#8B5CF6]/15 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-2xl space-y-6">
        
        <div className="space-y-3">
          <h2 className="font-serif text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            It's okay not to be okay.
          </h2>
          <p className="text-base md:text-lg text-indigo-200/90 font-medium leading-relaxed max-w-xl">
            A safe, anonymous space to share, heal, and grow—together.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3.5 pt-2">
          <button
            onClick={onShareClick}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-sm font-bold shadow-lg shadow-[#6366F1]/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>Share Anonymously</span>
          </button>

          <button
            onClick={onBrowseClick}
            className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/15 backdrop-blur-md text-white border border-white/20 text-sm font-semibold hover:border-white/30 transition-all"
          >
            <BookOpen className="w-4 h-4 text-indigo-300" />
            <span>Browse Stories</span>
          </button>
        </div>

      </div>

    </div>
  );
};
