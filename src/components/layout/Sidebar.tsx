import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SanctuaryLogo } from '../shared/SanctuaryLogo';
import {
  Home,
  Compass,
  PhoneCall,
  PenTool,
  BookOpen,
  Sparkles,
  Info,
  Shield,
  Moon,
  Sun,
  ShieldCheck,
  Heart
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenStoryComposer: () => void;
  onOpenCrisisModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenStoryComposer,
  onOpenCrisisModal
}) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'circles', label: 'Community Circles', icon: Compass },
    { id: 'campfires', label: 'Live Support', icon: PhoneCall, hasLiveBadge: true },
    { id: 'share', label: 'Share Your Story', icon: PenTool, isAction: true },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'ai-intern', label: 'Self-Help & AI Tools', icon: Sparkles },
    { id: 'guides', label: 'Peer Guides', icon: ShieldCheck },
    { id: 'about', label: 'About Us', icon: Info },
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between p-4 bg-white dark:bg-[#0E121E] border-r border-[#E2E8F0] dark:border-[#1E273D] transition-colors min-h-screen">
      <div className="space-y-6">
        {/* Logo & Brand Name */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 px-2 py-1 cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-[#6366F1]/10 dark:bg-[#6366F1]/20 border border-[#6366F1]/30 group-hover:scale-105 transition-transform text-[#6366F1] dark:text-[#818CF8]">
            <SanctuaryLogo size="md" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-[#0F172A] dark:text-white tracking-tight leading-tight">
              The Open Circle
            </h1>
            <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] font-medium tracking-wide uppercase">
              Anonymous • Safe • Supportive
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isAction) {
              return (
                <button
                  key={item.id}
                  onClick={onOpenStoryComposer}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#161D2F] transition-all"
                >
                  <Icon className="w-4 h-4 text-[#8B5CF6]" />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#6366F1]/10 dark:bg-[#1C243B] text-[#4F46E5] dark:text-[#A5B4FC] border border-[#6366F1]/30 dark:border-[#384872]'
                    : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#161D2F]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#4F46E5] dark:text-[#A5B4FC]' : 'text-[#64748B] dark:text-[#64748B]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.hasLiveBadge && (
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live
                  </span>
                )}
              </button>
            );
          })}

          {user?.isAdmin && (
            <button
              onClick={() => setActiveTab('admin')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'admin'
                  ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                  : 'text-amber-600 dark:text-amber-400/80 hover:bg-amber-500/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Portal</span>
            </button>
          )}
        </nav>
      </div>

      {/* Bottom Floating Safe Badge & Theme Toggle */}
      <div className="space-y-4 pt-6">
        
        {/* "You're Safe Here" glowing green shield card matching the mockup */}
        <div className="p-4 rounded-2xl bg-gradient-to-b from-[#10B981]/10 to-[#10B981]/5 dark:from-[#0F2922] dark:to-[#0D1F1A] border border-[#10B981]/30 text-center relative overflow-hidden group shadow-sm">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2.5 shadow-inner">
            <Heart className="w-6 h-6 fill-emerald-500/40 text-emerald-600 dark:text-emerald-400" />
          </div>
          <h3 className="font-serif font-bold text-sm text-[#0F172A] dark:text-white">
            You're Safe Here
          </h3>
          <p className="text-[11px] font-medium text-[#10B981] dark:text-emerald-400 mt-0.5">
            No face. No name. Just your truth.
          </p>
          <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-1 leading-relaxed">
            We don't collect personal information. Ever.
          </p>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white bg-[#F1F5F9] dark:bg-[#161D2F] border border-[#E2E8F0] dark:border-[#232D44] transition-colors"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-[#6366F1]" />
              <span>Dark Mode</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
};
