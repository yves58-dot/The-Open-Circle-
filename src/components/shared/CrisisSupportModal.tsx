import React, { useState, useEffect } from 'react';
import { X, Phone, MessageSquare, ShieldAlert, Heart, Wind, Globe, Sparkles } from 'lucide-react';

interface CrisisSupportModalProps {
  onClose: () => void;
  onConnectGuide: () => void;
}

export const CrisisSupportModal: React.FC<CrisisSupportModalProps> = ({
  onClose,
  onConnectGuide
}) => {
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const [breathTimer, setBreathTimer] = useState<number>(4);

  useEffect(() => {
    const phases: Array<'Inhale' | 'Hold' | 'Exhale' | 'Rest'> = ['Inhale', 'Hold', 'Exhale', 'Rest'];
    let currentIdx = 0;
    let secondsLeft = 4;

    const interval = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        currentIdx = (currentIdx + 1) % 4;
        setBreathPhase(phases[currentIdx]);
        secondsLeft = 4;
      }
      setBreathTimer(secondsLeft);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E17]/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#151A28] border border-rose-200 dark:border-rose-900/50 rounded-3xl max-w-lg w-full p-6 text-[#0F172A] dark:text-[#E2E8F0] shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white p-1.5 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#1E273D] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-500/30">
            <Heart className="w-6 h-6 fill-rose-500/20" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0F172A] dark:text-white">
              Immediate Support & Sanctuary
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              You are valued. You are not alone. Help is available right now.
            </p>
          </div>
        </div>

        {/* Emergency Alert Banner */}
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            <span>If you are in immediate physical danger:</span>
          </div>
          <p>
            Please call emergency services (<strong>911</strong> in the US/Canada, <strong>999</strong> in the UK, <strong>112</strong> in Europe) or go to the nearest emergency room.
          </p>
        </div>

        {/* 24/7 Verified Crisis Hotlines */}
        <div className="space-y-2.5">
          <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
            Free & Confidential 24/7 Hotlines
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            
            {/* 988 Lifeline */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1A2234] border border-[#E2E8F0] dark:border-[#283550] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">988 Lifeline</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">24/7 Free</span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Call or text <strong>988</strong> anytime across the United States & Canada.
              </p>
            </div>

            {/* Crisis Text Line */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1A2234] border border-[#E2E8F0] dark:border-[#283550] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">Crisis Text Line</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold">Text Free</span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Text <strong>HOME</strong> to <strong>741741</strong> to connect with a crisis counselor.
              </p>
            </div>

            {/* SAMHSA Addiction & Mental Health */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1A2234] border border-[#E2E8F0] dark:border-[#283550] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">SAMHSA Helpline</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">Recovery</span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Call <strong>1-800-662-4357</strong> for substance and mental health support.
              </p>
            </div>

            {/* The Trevor Project */}
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1A2234] border border-[#E2E8F0] dark:border-[#283550] space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] dark:text-white">Trevor Project</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold">LGBTQ+</span>
              </div>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                Call <strong>1-866-488-7386</strong> or text <strong>START</strong> to <strong>678-678</strong>.
              </p>
            </div>

          </div>
        </div>

        {/* Calming Box Breathing Tool */}
        <div className="p-4 rounded-2xl bg-indigo-500/5 dark:bg-[#1A2238] border border-indigo-500/20 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#6366F1] dark:text-[#818CF8]">
            <Wind className="w-4 h-4" />
            <span>Interactive Box Breathing</span>
          </div>

          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-[#6366F1] to-[#8B5CF6] flex flex-col items-center justify-center text-white shadow-lg shadow-[#6366F1]/30 transition-transform duration-1000 scale-105">
            <span className="text-xs font-extrabold uppercase tracking-wider">{breathPhase}</span>
            <span className="text-xl font-bold">{breathTimer}s</span>
          </div>

          <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
            Follow the gentle rhythm. Breathe in peace, release tension.
          </p>
        </div>

        {/* Talk to Peer Guide Button */}
        <div className="pt-1 flex gap-2">
          <button
            onClick={() => { onClose(); onConnectGuide(); }}
            className="w-full py-3 rounded-2xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-md shadow-[#6366F1]/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Talk with a Peer Guide in Live Campfire</span>
          </button>
        </div>

      </div>
    </div>
  );
};
