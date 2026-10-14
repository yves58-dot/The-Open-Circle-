import React, { useEffect, useState } from 'react';
import { CommunityStats } from '../../types';
import { Users, Wifi, MessageCircle, Heart, UserCheck, Shield, Radio, Activity } from 'lucide-react';

interface CommunityStatsCardProps {
  onOpenDonateModal?: () => void;
}

export const CommunityStatsCard: React.FC<CommunityStatsCardProps> = ({ onOpenDonateModal }) => {
  const [stats, setStats] = useState<CommunityStats>({
    totalMembers: 84,
    activeGuests: 38,
    volunteerMentors: 6,
    circlesCount: 8,
    totalPostsShared: 142,
    totalReactionsShared: 412,
    internetBundlesFunded: 28,
    totalDonationsRaised: 140,
    liveActiveVisitors: 19,
    livesTouchedCount: 382
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    // Poll stats every 8 seconds for real-time live counter effect
    const interval = setInterval(fetchStats, 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white dark:bg-[#202024] border border-[#F0EEEA] dark:border-[#2D2D32] rounded-3xl p-6 text-[#2D2D2D] dark:text-[#E4E4E7] shadow-sm transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F0EEEA] dark:border-[#2D2D32]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F5F3EF] dark:bg-[#2B2B30] border border-[#E5E2DC] dark:border-[#38383E] rounded-2xl text-[#7C9082] dark:text-[#8D9F92]">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7C9082] dark:text-[#8D9F92] bg-[#F5F3EF] dark:bg-[#2B2B30] px-2 py-0.5 rounded-full border border-[#E5E2DC] dark:border-[#38383E]">
                Live Sanctuary Pulse
              </span>
              <span className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                Updating Live
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2D2D2D] dark:text-white mt-0.5">
              Sanctuary Community Impact
            </h3>
          </div>
        </div>

        {onOpenDonateModal && (
          <button
            onClick={onOpenDonateModal}
            className="px-4 py-2 bg-[#7C9082] hover:bg-[#687C6E] text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0"
          >
            <Wifi className="w-4 h-4" /> Fund Mentor Data Bundles
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
        
        {/* Total Members Joined */}
        <div className="p-3.5 bg-[#FBF9F7] dark:bg-[#28282D] rounded-2xl border border-[#F0EEEA] dark:border-[#38383E] space-y-1">
          <div className="flex items-center justify-between text-[#7C9082] dark:text-[#8D9F92]">
            <Users className="w-4 h-4" />
            <span className="text-[10px] text-[#8D8881] dark:text-[#8E8E93]">Joined</span>
          </div>
          <p className="font-serif text-2xl font-bold text-[#2D2D2D] dark:text-white">
            {stats.totalMembers}
          </p>
          <p className="text-[10px] text-[#6B665F] dark:text-[#A1A1AA] truncate">
            {stats.activeGuests} Active Guests
          </p>
        </div>

        {/* Volunteer Mentors */}
        <div className="p-3.5 bg-[#FBF9F7] dark:bg-[#28282D] rounded-2xl border border-[#F0EEEA] dark:border-[#38383E] space-y-1">
          <div className="flex items-center justify-between text-[#7C9082] dark:text-[#8D9F92]">
            <UserCheck className="w-4 h-4" />
            <span className="text-[10px] text-[#8D8881] dark:text-[#8E8E93]">Mentors</span>
          </div>
          <p className="font-serif text-2xl font-bold text-[#2D2D2D] dark:text-white">
            {stats.volunteerMentors}
          </p>
          <p className="text-[10px] text-[#6B665F] dark:text-[#A1A1AA] truncate">
            Verified Guides
          </p>
        </div>

        {/* Mentor Bundles Funded */}
        <div className="p-3.5 bg-[#FBF9F7] dark:bg-[#28282D] rounded-2xl border border-[#F0EEEA] dark:border-[#38383E] space-y-1">
          <div className="flex items-center justify-between text-[#7C9082] dark:text-[#8D9F92]">
            <Wifi className="w-4 h-4 text-[#7C9082]" />
            <span className="text-[10px] text-[#8D8881] dark:text-[#8E8E93]">Data Bundles</span>
          </div>
          <p className="font-serif text-2xl font-bold text-[#7C9082] dark:text-[#8D9F92]">
            {stats.internetBundlesFunded} GB
          </p>
          <p className="text-[10px] text-[#6B665F] dark:text-[#A1A1AA] truncate">
            ${stats.totalDonationsRaised} Raised
          </p>
        </div>

        {/* Posts & Safe Stories Shared */}
        <div className="p-3.5 bg-[#FBF9F7] dark:bg-[#28282D] rounded-2xl border border-[#F0EEEA] dark:border-[#38383E] space-y-1">
          <div className="flex items-center justify-between text-[#7C9082] dark:text-[#8D9F92]">
            <MessageCircle className="w-4 h-4" />
            <span className="text-[10px] text-[#8D8881] dark:text-[#8E8E93]">Shared</span>
          </div>
          <p className="font-serif text-2xl font-bold text-[#2D2D2D] dark:text-white">
            {stats.totalPostsShared}
          </p>
          <p className="text-[10px] text-[#6B665F] dark:text-[#A1A1AA] truncate">
            Safe Stories
          </p>
        </div>

        {/* Reactions & Support */}
        <div className="p-3.5 bg-[#FBF9F7] dark:bg-[#28282D] rounded-2xl border border-[#F0EEEA] dark:border-[#38383E] space-y-1">
          <div className="flex items-center justify-between text-[#7C9082] dark:text-[#8D9F92]">
            <Heart className="w-4 h-4 text-rose-500" />
            <span className="text-[10px] text-[#8D8881] dark:text-[#8E8E93]">Empathy</span>
          </div>
          <p className="font-serif text-2xl font-bold text-[#2D2D2D] dark:text-white">
            {stats.totalReactionsShared}
          </p>
          <p className="text-[10px] text-[#6B665F] dark:text-[#A1A1AA] truncate">
            Witnessed Touches
          </p>
        </div>

        {/* Live Active Online Right Now */}
        <div className="p-3.5 bg-[#FBF9F7] dark:bg-[#28282D] rounded-2xl border border-[#F0EEEA] dark:border-[#38383E] space-y-1">
          <div className="flex items-center justify-between text-emerald-600 dark:text-emerald-400">
            <Radio className="w-4 h-4 animate-pulse" />
            <span className="text-[10px] text-[#8D8881] dark:text-[#8E8E93]">Online Now</span>
          </div>
          <p className="font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {stats.liveActiveVisitors}
          </p>
          <p className="text-[10px] text-[#6B665F] dark:text-[#A1A1AA] truncate">
            Present in Circles
          </p>
        </div>

      </div>
    </div>
  );
};
