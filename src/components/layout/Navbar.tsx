import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { UserAvatar } from '../shared/UserAvatar';
import { SanctuaryLogo } from '../shared/SanctuaryLogo';
import { Heart, Shield, LogOut, UserCheck, KeyRound, Sparkles, Phone, Compass, Moon, Sun, Gift, Wifi, UserCog } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuthModal: (mode: 'login' | 'register' | 'upgrade' | 'forgot') => void;
  onOpenDonateModal: () => void;
  onOpenEditProfileModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAuthModal,
  onOpenDonateModal,
  onOpenEditProfileModal
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#1A1A1E]/95 backdrop-blur-md border-b border-[#F0EEEA] dark:border-[#2D2D32] text-[#2D2D2D] dark:text-[#E4E4E7] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('circles')}>
            <SanctuaryLogo size="md" />
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-[#2D2D2D] dark:text-white block">
                The Open Circle
              </span>
              <span className="text-[10px] text-[#A09B95] dark:text-[#8E8E93] font-medium tracking-widest uppercase block -mt-1 hidden sm:block">
                No face required. Just your truth.
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-[#F5F3EF] dark:bg-[#28282D] p-1 rounded-2xl border border-[#EBE8E4] dark:border-[#38383E]">
            <button
              onClick={() => setActiveTab('circles')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'circles'
                  ? 'bg-[#7C9082] text-white shadow-sm font-semibold'
                  : 'text-[#6B665F] dark:text-[#A1A1AA] hover:text-[#2D2D2D] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#323238]'
              }`}
            >
              <Compass className="w-4 h-4" /> Circles
            </button>

            <button
              onClick={() => setActiveTab('campfires')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'campfires'
                  ? 'bg-[#7C9082] text-white shadow-sm font-semibold'
                  : 'text-[#6B665F] dark:text-[#A1A1AA] hover:text-[#2D2D2D] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#323238]'
              }`}
            >
              <Phone className="w-4 h-4" /> Live Campfires
            </button>

            <button
              onClick={() => setActiveTab('guides')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'guides'
                  ? 'bg-[#7C9082] text-white shadow-sm font-semibold'
                  : 'text-[#6B665F] dark:text-[#A1A1AA] hover:text-[#2D2D2D] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#323238]'
              }`}
            >
              <UserCheck className="w-4 h-4" /> Peer Guides
            </button>

            <button
              onClick={() => setActiveTab('ai-intern')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                activeTab === 'ai-intern'
                  ? 'bg-[#8B5CF6] text-white shadow-sm font-semibold'
                  : 'text-[#6B665F] dark:text-[#A1A1AA] hover:text-[#2D2D2D] dark:hover:text-white hover:bg-white/60 dark:hover:bg-[#323238]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-purple-300" /> AI Intern
            </button>

            {user?.isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-sm font-semibold'
                    : 'text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30'
                }`}
              >
                <Shield className="w-4 h-4" /> Admin Portal
              </button>
            )}
          </nav>

          {/* Controls: Theme Toggle + Donate + Auth/User */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Donate / Support Button */}
            <button
              onClick={onOpenDonateModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#7C9082]/10 dark:bg-[#7C9082]/20 border border-[#7C9082]/30 text-[#7C9082] dark:text-[#8D9F92] hover:bg-[#7C9082] hover:text-white dark:hover:bg-[#7C9082] dark:hover:text-white transition-all shadow-sm"
              title="Support Volunteer Mentor Data Bundles & Hardship Care Pool"
            >
              <Gift className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Donate Data</span>
            </button>

            {/* Dark / Light Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-[#6B665F] dark:text-[#A1A1AA] hover:text-[#2D2D2D] dark:hover:text-white hover:bg-[#F5F3EF] dark:hover:bg-[#28282D] transition-colors border border-transparent hover:border-[#EBE8E4] dark:hover:border-[#38383E]"
              title={theme === 'dark' ? 'Switch to Warm Light Sanctuary Theme' : 'Switch to Soft Dark Sanctuary Theme'}
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-[#7C9082]" />
              )}
            </button>

            {user?.isGuest ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuthModal('upgrade')}
                  className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-[#F5F3EF] dark:bg-[#28282D] border border-[#E5E2DC] dark:border-[#38383E] text-[#6B665F] dark:text-[#A1A1AA] hover:bg-[#EBE8E4] dark:hover:bg-[#323238] transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#7C9082]" /> Save Progress
                </button>
                <button
                  onClick={() => onOpenAuthModal('login')}
                  className="px-4 py-1.5 rounded-full text-xs font-semibold bg-[#7C9082] text-white hover:bg-[#687C6E] transition-colors shadow-sm"
                >
                  Sign In
                </button>
              </div>
            ) : null}

            {/* Profile Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-[#F5F3EF] dark:hover:bg-[#28282D] transition-colors border border-transparent hover:border-[#F0EEEA] dark:hover:border-[#38383E]"
                >
                  <UserAvatar config={user.avatarConfig} size="sm" isGuide={user.isMentor} />
                  <div className="text-left hidden lg:block">
                    <span className="text-xs font-semibold text-[#2D2D2D] dark:text-white block truncate max-w-[120px]">
                      {user.nickname}
                    </span>
                    <span className="text-[10px] text-[#A09B95] dark:text-[#8E8E93] block -mt-0.5">
                      {user.isGuest ? 'Guest Session' : user.isAdmin ? 'Super Admin' : user.isMentor ? 'Peer Guide' : 'Member'}
                    </span>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#202024] border border-[#F0EEEA] dark:border-[#2D2D32] rounded-2xl shadow-xl py-2 text-[#2D2D2D] dark:text-[#E4E4E7] z-50">
                    <div className="px-4 py-3 border-b border-[#F0EEEA] dark:border-[#2D2D32]">
                      <p className="text-xs font-bold text-[#2D2D2D] dark:text-white">{user.nickname}</p>
                      <p className="text-[11px] text-[#8D8881] dark:text-[#8E8E93] mt-0.5">
                        {user.isGuest ? 'Anonymous Guest Session' : user.email ? 'Registered Account' : 'Anonymous Member'}
                      </p>
                    </div>

                    <button
                      onClick={() => { setDropdownOpen(false); onOpenEditProfileModal(); }}
                      className="w-full text-left px-4 py-2.5 text-xs text-[#7C9082] dark:text-[#8D9F92] hover:bg-[#F5F3EF] dark:hover:bg-[#28282D] flex items-center gap-2 font-semibold border-b border-[#F0EEEA] dark:border-[#2D2D32]"
                    >
                      <UserCog className="w-4 h-4" /> Change Display Name
                    </button>

                    {user.isGuest && (
                      <button
                        onClick={() => { setDropdownOpen(false); onOpenAuthModal('upgrade'); }}
                        className="w-full text-left px-4 py-2.5 text-xs text-[#7C9082] dark:text-[#8D9F92] hover:bg-[#F5F3EF] dark:hover:bg-[#28282D] flex items-center gap-2 font-semibold"
                      >
                        <Sparkles className="w-4 h-4" /> Upgrade to Full Account
                      </button>
                    )}

                    {!user.isGuest && (
                      <button
                        onClick={() => { setDropdownOpen(false); onOpenAuthModal('forgot'); }}
                        className="w-full text-left px-4 py-2 text-xs text-[#6B665F] dark:text-[#A1A1AA] hover:bg-[#F5F3EF] dark:hover:bg-[#28282D] flex items-center gap-2"
                      >
                        <KeyRound className="w-4 h-4" /> Reset Password
                      </button>
                    )}

                    {user.isAdmin && (
                      <button
                        onClick={() => { setDropdownOpen(false); setActiveTab('admin'); }}
                        className="w-full text-left px-4 py-2 text-xs text-amber-700 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 flex items-center gap-2 font-medium"
                      >
                        <Shield className="w-4 h-4" /> Admin Portal
                      </button>
                    )}

                    <div className="border-t border-[#F0EEEA] dark:border-[#2D2D32] mt-1 pt-1">
                      <button
                        onClick={() => { setDropdownOpen(false); logout(); }}
                        className="w-full text-left px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 font-medium"
                      >
                        <LogOut className="w-4 h-4" /> {user.isGuest ? 'New Guest Session' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
