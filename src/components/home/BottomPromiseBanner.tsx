import React from 'react';
import { Lock, UserCheck, ShieldCheck, HeartHandshake, Clock } from 'lucide-react';

export const BottomPromiseBanner: React.FC = () => {
  return (
    <div className="w-full rounded-3xl p-5 md:p-6 bg-[#EBE7FD] dark:bg-[#1E1B38] border border-[#DDD4FC] dark:border-[#383363] text-[#2E1A47] dark:text-[#DDD6FE] shadow-sm space-y-4 transition-colors">
      
      {/* Primary Promise Statement */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#D8CCFB] dark:border-[#2F2A52] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-600/10 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-serif font-bold text-sm text-[#1E1236] dark:text-white">
              Your privacy is our promise.
            </h4>
            <p className="text-xs text-[#5B378B] dark:text-[#C4B5FD]">
              No personal data. No tracking. Just a safe space to heal.
            </p>
          </div>
        </div>
      </div>

      {/* 4 Guarantees Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-1 text-xs">
        
        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-600/10 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300 flex-shrink-0">
            <UserCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#1E1236] dark:text-white">100% Anonymous</p>
            <p className="text-[11px] text-[#5B378B] dark:text-[#A78BFA]">No registration required</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-600/10 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300 flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#1E1236] dark:text-white">End-to-End Safe</p>
            <p className="text-[11px] text-[#5B378B] dark:text-[#A78BFA]">Your privacy is protected</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-600/10 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300 flex-shrink-0">
            <HeartHandshake className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#1E1236] dark:text-white">Judgment-Free Zone</p>
            <p className="text-[11px] text-[#5B378B] dark:text-[#A78BFA]">All are welcome here</p>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="p-1.5 rounded-lg bg-purple-600/10 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300 flex-shrink-0">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-[#1E1236] dark:text-white">24/7 Community</p>
            <p className="text-[11px] text-[#5B378B] dark:text-[#A78BFA]">We're here anytime</p>
          </div>
        </div>

      </div>

    </div>
  );
};
