import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserAvatar } from '../shared/UserAvatar';
import { Headphones, PhoneCall, ShieldCheck, CheckCircle2, Sparkles, MessageCircle } from 'lucide-react';

interface LiveSupportWidgetProps {
  onStartSupport: () => void;
}

export const LiveSupportWidget: React.FC<LiveSupportWidgetProps> = ({ onStartSupport }) => {
  const { user } = useAuth();
  const [timeString, setTimeString] = useState<string>('');

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

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm flex flex-col justify-between space-y-4">
      
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <h3 className="font-serif font-bold text-base text-[#0F172A] dark:text-white">
            Live Support ({timeString || 'Now'})
          </h3>
        </div>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
          You're not alone tonight. Trained listeners are here.
        </p>
      </div>

      {/* Listener Profile Card */}
      <div className="p-3.5 rounded-2xl bg-[#F8FAFC] dark:bg-[#1A2234] border border-[#E2E8F0] dark:border-[#283550] flex items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <UserAvatar
              config={{
                bgColor: '#6366F1',
                shape: 'circle',
                icon: 'star'
              }}
              size="md"
              isGuide={true}
            />
            <span className="w-3 h-3 rounded-full bg-emerald-500 border-2 border-white dark:border-[#1A2234] absolute -bottom-0.5 -right-0.5"></span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#0F172A] dark:text-white">
                Anonymous Listener
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                • Online
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
              "I'm here to listen. You matter."
            </p>
          </div>
        </div>

        <button
          onClick={onStartSupport}
          className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-md shadow-[#6366F1]/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 flex-shrink-0"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>Start Chat</span>
        </button>

      </div>

      {/* Online Listeners Row */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="text-xs font-semibold text-[#64748B] dark:text-[#94A3B8]">
            3 listeners online
          </span>
        </div>

        <div className="flex items-center -space-x-2">
          <div className="w-6 h-6 rounded-full bg-indigo-500 border-2 border-white dark:border-[#151A28] flex items-center justify-center text-[9px] text-white font-bold">
            A
          </div>
          <div className="w-6 h-6 rounded-full bg-emerald-500 border-2 border-white dark:border-[#151A28] flex items-center justify-center text-[9px] text-white font-bold">
            Y
          </div>
          <div className="w-6 h-6 rounded-full bg-purple-500 border-2 border-white dark:border-[#151A28] flex items-center justify-center text-[9px] text-white font-bold">
            S
          </div>
        </div>
      </div>

    </div>
  );
};
