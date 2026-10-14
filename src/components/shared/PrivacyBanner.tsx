import React from 'react';
import { ShieldCheck, HeartHandshake, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const PrivacyBanner: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white dark:bg-[#202024] border border-[#F0EEEA] dark:border-[#2D2D32] rounded-2xl p-4 md:p-5 text-[#2D2D2D] dark:text-[#E4E4E7] shadow-sm transition-colors">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-2.5 bg-[#F5F3EF] dark:bg-[#2B2B30] border border-[#E5E2DC] dark:border-[#38383E] rounded-xl shrink-0 text-[#7C9082] dark:text-[#8D9F92] mt-0.5 md:mt-0">
            <EyeOff className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold tracking-tight text-[#2D2D2D] dark:text-white flex items-center gap-2">
              "No face required. No name needed. Just your truth."
            </h3>
            <p className="text-sm text-[#6B665F] dark:text-[#A1A1AA] mt-1 max-w-2xl leading-relaxed">
              Welcome to your anonymous sanctuary. We never record your face, store your real name, or sell your data.
              {user?.isGuest && (
                <span className="block text-[#7C9082] dark:text-[#8D9F92] font-semibold mt-1">
                  • Active Guest Session: Posts auto-expire after 24 hours. You can upgrade to save progress anytime.
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F3EF] dark:bg-[#2B2B30] border border-[#EBE8E4] dark:border-[#38383E] rounded-full text-xs text-[#6B665F] dark:text-[#A1A1AA] font-semibold">
            <Lock className="w-3.5 h-3.5 text-[#7C9082] dark:text-[#8D9F92]" /> 256-Bit Encrypted
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5F3EF] dark:bg-[#2B2B30] border border-[#EBE8E4] dark:border-[#38383E] rounded-full text-xs text-[#6B665F] dark:text-[#A1A1AA] font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-rose-500" /> Free Sanctuary
          </div>
        </div>
      </div>
    </div>
  );
};
