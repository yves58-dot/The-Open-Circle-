import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserAvatar } from '../shared/UserAvatar';
import {
  Search,
  Shield,
  EyeOff,
  UserCheck,
  LogOut,
  UserCog,
  Heart,
  Sparkles,
  Gift,
  KeyRound,
  ChevronDown
} from 'lucide-react';

interface TopHeaderProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAuthModal: (mode: 'login' | 'register' | 'upgrade' | 'forgot') => void;
  onOpenDonateModal: () => void;
  onOpenEditProfileModal: () => void;
  onOpenCrisisModal: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  onOpenAuthModal,
  onOpenDonateModal,
  onOpenEditProfileModal,
  onOpenCrisisModal
}) => {
  const { user, logout } = useAuth();
  const [anonymousMode, setAnonymousMode] = useState<boolean>(true);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);

  return (
    <header className="h-16 px-6 bg-white/80 dark:bg-[#0E121E]/90 backdrop-blur-md border-b border-[#E2E8F0] dark:border-[#1E273D] flex items-center justify-between gap-4 sticky top-0 z-30 transition-colors">
      
      {/* Search Input */}
      <div className="relative max-w-md w-full">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search topics, stories, or support..."
          className="w-full bg-[#F1F5F9] dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] rounded-full pl-10 pr-4 py-2 text-xs text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] dark:focus:ring-[#818CF8] transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        
        {/* Anonymous Mode Pill Toggle */}
        <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-[#6366F1]/10 dark:bg-[#1C2337] border border-[#6366F1]/20 dark:border-[#2D3854]">
          <EyeOff className="w-3.5 h-3.5 text-[#6366F1] dark:text-[#A5B4FC]" />
          <span className="text-[11px] font-semibold text-[#4F46E5] dark:text-[#A5B4FC]">
            Anonymous Mode
          </span>
          <button
            type="button"
            onClick={() => setAnonymousMode(!anonymousMode)}
            className={`w-7 h-4 rounded-full transition-colors relative flex items-center ${
              anonymousMode ? 'bg-[#6366F1]' : 'bg-[#94A3B8]'
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${
                anonymousMode ? 'translate-x-3.5' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Donate / Support Volunteer Mentors Button */}
        <button
          onClick={onOpenDonateModal}
          className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors"
        >
          <Gift className="w-3.5 h-3.5" />
          <span>Support / Donate</span>
        </button>

        {/* User Profile / Sign In */}
        {user ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F1F5F9] dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] hover:border-[#6366F1] transition-all"
            >
              <UserAvatar config={user.avatarConfig} size="sm" isGuide={user.isMentor} />
              <span className="text-xs font-semibold text-[#0F172A] dark:text-white max-w-[100px] truncate">
                {user.nickname}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8]" />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2"
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <div className="px-4 py-2 border-b border-[#E2E8F0] dark:border-[#232D44]">
                  <p className="text-xs font-bold text-[#0F172A] dark:text-white truncate">
                    {user.nickname}
                  </p>
                  <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8]">
                    {user.isGuest ? 'Anonymous Guest Session' : user.isMentor ? '🌟 Certified Peer Guide' : 'Registered Member'}
                  </p>
                </div>

                <button
                  onClick={() => { setDropdownOpen(false); onOpenEditProfileModal(); }}
                  className="w-full text-left px-4 py-2 text-xs text-[#4F46E5] dark:text-[#A5B4FC] hover:bg-[#F1F5F9] dark:hover:bg-[#1C243B] flex items-center gap-2 font-medium"
                >
                  <UserCog className="w-3.5 h-3.5" /> Change Display Name
                </button>

                {user.isGuest && (
                  <button
                    onClick={() => { setDropdownOpen(false); onOpenAuthModal('upgrade'); }}
                    className="w-full text-left px-4 py-2 text-xs text-[#0F172A] dark:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1C243B] flex items-center gap-2"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-emerald-500" /> Save Account / Password
                  </button>
                )}

                <button
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" /> Leave Sanctuary
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onOpenAuthModal('login')}
            className="px-3.5 py-1.5 rounded-full bg-[#F1F5F9] dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] text-xs font-semibold text-[#0F172A] dark:text-white hover:bg-[#E2E8F0] dark:hover:bg-[#1E273D] transition-colors"
          >
            Sign In (Optional)
          </button>
        )}

        {/* Primary Purple "Get Support Now" Button */}
        <button
          onClick={onOpenCrisisModal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-md shadow-[#6366F1]/25 hover:shadow-lg hover:shadow-[#6366F1]/35 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Heart className="w-3.5 h-3.5 fill-white/30 text-white" />
          <span>Get Support Now</span>
        </button>

      </div>
    </header>
  );
};
