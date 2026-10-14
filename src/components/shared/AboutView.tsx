import React from 'react';
import { SanctuaryLogo } from './SanctuaryLogo';
import { Shield, Heart, Users, Sparkles, Gift, Lock, CheckCircle2 } from 'lucide-react';

interface AboutViewProps {
  onOpenDonateModal: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onOpenDonateModal }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Hero */}
      <div className="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-[#1E1B4B] via-[#0F172A] to-[#0A0E1A] text-white shadow-xl border border-[#312E81]/30 text-center space-y-4">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-[#6366F1]/20 border border-[#6366F1]/40 flex items-center justify-center text-[#818CF8]">
          <SanctuaryLogo size="lg" />
        </div>
        <h2 className="font-serif text-3xl md:text-4xl font-extrabold tracking-tight">
          The Open Circle
        </h2>
        <p className="text-sm md:text-base text-indigo-200/90 max-w-xl mx-auto leading-relaxed">
          A judgment-free, anonymous sanctuary where healing is shared, burdens are witnessed, and no one walks through darkness alone.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm space-y-2">
          <div className="p-3 w-fit rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#0F172A] dark:text-white">
            100% Anonymous
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            No real names, no phone numbers required, no camera demands. Participate as a guest or with a pseudonym of your choosing.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm space-y-2">
          <div className="p-3 w-fit rounded-2xl bg-[#6366F1]/10 text-[#6366F1] dark:text-[#818CF8] border border-[#6366F1]/20">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#0F172A] dark:text-white">
            Certified Peer Guides
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Trained listeners with lived experience in recovery and grief, dedicated to holding compassionate space without judgment or unsolicited advice.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm space-y-2">
          <div className="p-3 w-fit rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-base text-[#0F172A] dark:text-white">
            AI Safety Sentinel
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Real-time pre-moderation protects our circles from hate, harassment, or triggering instructions while actively offering instant crisis lifelines.
          </p>
        </div>

      </div>

      {/* Volunteer Mentor Fund Banner */}
      <div className="p-6 rounded-3xl bg-rose-500/5 dark:bg-[#1E1724] border border-rose-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-serif font-bold text-base text-[#0F172A] dark:text-white flex items-center justify-center sm:justify-start gap-2">
            <Gift className="w-4 h-4 text-rose-500" />
            <span>Volunteer Mentor Data Bundles & Hardship Fund</span>
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            $5 sponsors 1 month of internet connectivity for volunteer peer mentors providing free 24/7 care in underserved communities.
          </p>
        </div>

        <button
          onClick={onOpenDonateModal}
          className="px-5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 whitespace-nowrap transition-all hover:scale-105"
        >
          Sponsor a Mentor Bundle
        </button>
      </div>

    </div>
  );
};
