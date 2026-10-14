import React, { useState, useEffect } from 'react';
import { CommunityStats } from '../../types';
import {
  Heart,
  Users,
  FileText,
  MessageCircle,
  Trophy,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Gift
} from 'lucide-react';

interface RightSidebarProps {
  stats: CommunityStats | null;
  onOpenCrisisModal: () => void;
  onOpenDonateModal: () => void;
}

const INSPIRATIONAL_QUOTES = [
  { text: "The darkest nights produce the brightest stars.", author: "Unknown" },
  { text: "You don't have to carry the entire mountain at once. Just the next step.", author: "Sanctuary Wisdom" },
  { text: "Healing doesn't mean the damage never existed. It means the damage no longer controls your life.", author: "Akshay Dubey" },
  { text: "There is hope, even when your brain tells you there isn't.", author: "John Green" },
  { text: "You are not broken. You are human, healing one honest breath at a time.", author: "Open Circle" },
];

export const RightSidebar: React.FC<RightSidebarProps> = ({
  stats,
  onOpenCrisisModal,
  onOpenDonateModal
}) => {
  const [timeString, setTimeString] = useState<string>('');
  const [quoteIndex, setQuoteIndex] = useState<number>(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNextQuote = () => {
    setQuoteIndex((prev) => (prev + 1) % INSPIRATIONAL_QUOTES.length);
  };

  const currentQuote = INSPIRATIONAL_QUOTES[quoteIndex];

  // Helper format number
  const formatNum = (val?: number) => {
    if (!val) return '0';
    return val.toLocaleString();
  };

  return (
    <aside className="w-80 flex-shrink-0 space-y-4">
      
      {/* 1. Time-Aware Support Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm space-y-3.5 text-center">
        <div>
          <h3 className="font-serif text-lg font-bold text-[#0F172A] dark:text-white">
            It's {timeString || 'Late'}
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
            Can't sleep? Can't talk to anyone?
            <br />
            You can talk to us.
          </p>
        </div>

        <button
          onClick={onOpenCrisisModal}
          className="w-full py-2.5 px-4 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white text-xs font-bold shadow-md shadow-[#8B5CF6]/25 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Heart className="w-4 h-4 fill-white/20 text-white" />
          <span>I Need Support Now</span>
        </button>
      </div>

      {/* 2. Community Impact Card */}
      <div className="p-5 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm space-y-4">
        <div>
          <h3 className="font-serif text-sm font-bold text-[#0F172A] dark:text-white">
            Community Impact
          </h3>
          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            Together, we're making a difference.
          </p>
        </div>

        <div className="space-y-3.5">
          
          {/* Lives Touched */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#0F172A] dark:text-white leading-none">
                {formatNum(stats?.livesTouchedCount || stats?.totalMembers || 28547)}
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium mt-0.5">
                Lives touched
              </p>
            </div>
          </div>

          {/* Stories Shared */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#6366F1]/10 text-[#6366F1] dark:text-[#818CF8] border border-[#6366F1]/20">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#0F172A] dark:text-white leading-none">
                {formatNum(stats?.totalPostsShared || 12847)}
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium mt-0.5">
                Stories shared
              </p>
            </div>
          </div>

          {/* Support Messages & Reactions */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#0F172A] dark:text-white leading-none">
                {formatNum(stats?.totalReactionsShared || 45892)}
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium mt-0.5">
                Support messages
              </p>
            </div>
          </div>

          {/* Days of Recovery / Bundles */}
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-[#0F172A] dark:text-white leading-none">
                {formatNum((stats?.internetBundlesFunded ? stats.internetBundlesFunded * 100 : 14328))}
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-medium mt-0.5">
                Days of recovery celebrated
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Quote Card */}
      <div className="p-5 rounded-3xl bg-[#EBE4F9] dark:bg-[#201D38] border border-[#D8C7F5] dark:border-[#372E5A] text-[#2E1A47] dark:text-[#E9D5FF] space-y-2 relative group">
        <p className="text-xs md:text-sm font-serif italic leading-relaxed">
          “{currentQuote.text}”
        </p>
        <div className="flex items-center justify-between pt-1 text-[11px] font-semibold text-[#5B378B] dark:text-[#C084FC]">
          <span>— {currentQuote.author}</span>
          <button
            onClick={handleNextQuote}
            title="Next inspiring quote"
            className="p-1 rounded-full hover:bg-purple-200/50 dark:hover:bg-purple-900/40 transition-colors"
          >
            <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform" />
          </button>
        </div>
      </div>

      {/* 4. Crisis Resources Card */}
      <div className="p-4 rounded-3xl bg-[#FEEBE7] dark:bg-[#341F1D] border border-[#FCC8BE] dark:border-[#522924] text-[#7C2D24] dark:text-[#FECDD3] space-y-2.5">
        <div>
          <h4 className="font-serif font-bold text-xs text-[#991B1B] dark:text-rose-300">
            Crisis Resources
          </h4>
          <p className="text-[11px] text-[#7F1D1D] dark:text-rose-200/80 leading-relaxed mt-0.5">
            If you're in immediate danger, please contact local emergency services.
          </p>
        </div>

        <button
          onClick={onOpenCrisisModal}
          className="w-full py-1.5 px-3 rounded-xl bg-white dark:bg-[#4C1D1A] border border-[#FCA5A5] dark:border-[#7F1D1D] text-xs font-bold text-rose-700 dark:text-rose-200 hover:bg-rose-50 dark:hover:bg-[#5C231F] transition-colors shadow-sm"
        >
          View Resources
        </button>
      </div>

    </aside>
  );
};
