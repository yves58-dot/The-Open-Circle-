import React from 'react';
import { Phone, MessageSquare, Heart, Shield, Globe, Wind, BookOpen, AlertTriangle } from 'lucide-react';

interface ResourcesViewProps {
  onOpenCrisisModal: () => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ onOpenCrisisModal }) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#6366F1]/10 text-[#6366F1] dark:text-[#818CF8] border border-[#6366F1]/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#0F172A] dark:text-white">
              Sanctuary Resource Hub
            </h2>
            <p className="text-xs md:text-sm text-[#64748B] dark:text-[#94A3B8]">
              Immediate hotlines, recovery guides, and grounded mental health self-care tools.
            </p>
          </div>
        </div>
      </div>

      {/* Emergency Notice */}
      <div className="p-5 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-serif font-bold text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Immediate Physical Crisis Support
          </h3>
          <p className="text-xs text-rose-600 dark:text-rose-300/90">
            If you or someone you know is in immediate life-threatening danger, reach out to local emergency services right away.
          </p>
        </div>
        <button
          onClick={onOpenCrisisModal}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 whitespace-nowrap transition-colors"
        >
          Open 24/7 Lifelines
        </button>
      </div>

      {/* Grid of Verified Helplines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* 988 Suicide & Crisis Lifeline */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#0F172A] dark:text-white">988 Suicide & Crisis Lifeline</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">Free & 24/7</span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Call or text <strong>988</strong> across the US and Canada for immediate emotional crisis counseling and de-escalation.
          </p>
        </div>

        {/* Crisis Text Line */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#0F172A] dark:text-white">Crisis Text Line</span>
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">Text Support</span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Text <strong>HOME</strong> to <strong>741741</strong> to connect with a trained, compassionate volunteer crisis counselor.
          </p>
        </div>

        {/* SAMHSA */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#0F172A] dark:text-white">SAMHSA National Helpline</span>
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold">Substance & Mental Health</span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Call <strong>1-800-662-4357</strong> for confidential substance use and mental health support, treatment referral, and recovery info.
          </p>
        </div>

        {/* The Trevor Project */}
        <div className="p-5 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#0F172A] dark:text-white">The Trevor Project</span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold">LGBTQ+ Youth</span>
          </div>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
            Call <strong>1-866-488-7386</strong> or text <strong>START</strong> to <strong>678-678</strong> for confidential 24/7 crisis support.
          </p>
        </div>

      </div>

    </div>
  );
};
