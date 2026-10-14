import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopHeader } from './components/layout/TopHeader';
import { HeroBanner } from './components/home/HeroBanner';
import { CirclesOverview } from './components/home/CirclesOverview';
import { LiveSupportWidget } from './components/home/LiveSupportWidget';
import { StoriesOfStrengthWidget } from './components/home/StoriesOfStrengthWidget';
import { RightSidebar } from './components/home/RightSidebar';
import { BottomPromiseBanner } from './components/home/BottomPromiseBanner';
import { CircleSelector } from './components/circles/CircleSelector';
import { CircleFeed } from './components/circles/CircleFeed';
import { VoiceCallRoom } from './components/calls/VoiceCallRoom';
import { GuideDirectory } from './components/guides/GuideDirectory';
import { AiInternAssistant } from './components/ai-intern/AiInternAssistant';
import { ResourcesView } from './components/shared/ResourcesView';
import { AboutView } from './components/shared/AboutView';
import { AdminPortal } from './components/admin/AdminPortal';
import { StoryComposerModal } from './components/shared/StoryComposerModal';
import { CrisisSupportModal } from './components/shared/CrisisSupportModal';
import { DonationModal } from './components/shared/DonationModal';
import { AuthModal } from './components/auth/AuthModal';
import { EditProfileModal } from './components/auth/EditProfileModal';
import { SanctuaryLogo } from './components/shared/SanctuaryLogo';
import { Circle, CommunityStats } from './types';
import { ShieldAlert, X } from 'lucide-react';

const INITIAL_CIRCLES: Circle[] = [
  {
    id: 'circle-1',
    name: 'General Healing Sanctuary',
    description: 'A warm, judgment-free space to open your heart, exhale, and find encouragement.',
    category: 'general',
    rules: ['Treat every soul with dignity', 'Maintain 100% confidentiality', 'No judgment'],
    createdAt: new Date().toISOString(),
    isActive: true,
    memberCount: 384
  },
  {
    id: 'circle-2',
    name: 'Alcohol Recovery Circle',
    description: 'Shared strength for those navigating sobriety, milestones, or starting day one.',
    category: 'recovery',
    rules: ['Honesty is honored', 'Zero judgment for relapses', 'Support each milestone'],
    createdAt: new Date().toISOString(),
    isActive: true,
    memberCount: 421
  },
  {
    id: 'circle-3',
    name: 'Substance & Habit Recovery',
    description: 'Freedom from substance reliance, rebuilding self-worth with gentle accountability.',
    category: 'recovery',
    rules: ['Safe and confidential', 'One day at a time', 'Compassion first'],
    createdAt: new Date().toISOString(),
    isActive: true,
    memberCount: 295
  },
  {
    id: 'circle-4',
    name: 'Sexual Trauma & Intimacy Recovery',
    description: 'Trauma-informed space to heal from betrayal, assault, or intimacy wounds in safety.',
    category: 'emotional',
    rules: ['Trigger warnings respected', 'Purely supportive dialogue', 'Gentle pace'],
    createdAt: new Date().toISOString(),
    isActive: true,
    memberCount: 310
  },
  {
    id: 'circle-5',
    name: 'Anxiety, Panic & Depression',
    description: 'Grounding techniques, emotional stabilization, and empathetic peer presence.',
    category: 'emotional',
    rules: ['You are not broken', 'Take what serves you', 'Breathe together'],
    createdAt: new Date().toISOString(),
    isActive: true,
    memberCount: 540
  },
  {
    id: 'circle-6',
    name: 'Burnout & Overwhelmed Souls',
    description: 'Reclaiming emotional peace, establishing gentle boundaries, and releasing exhaustion.',
    category: 'life',
    rules: ['Rest is productive', 'No toxic productivity', 'Gentle space'],
    createdAt: new Date().toISOString(),
    isActive: true,
    memberCount: 218
  },
  {
    id: 'circle-7',
    name: 'Grief, Loss & Remembrance',
    description: 'Honoring profound losses, processing heartbreak, and finding gentle solace.',
    category: 'emotional',
    rules: ['Grief has no timeline', 'Speak their names freely', 'Hold space'],
    createdAt: new Date().toISOString(),
    isActive: true,
    memberCount: 267
  }
];

const INITIAL_STATS: CommunityStats = {
  totalMembers: 28547,
  activeGuests: 34,
  volunteerMentors: 8,
  circlesCount: 7,
  totalPostsShared: 12847,
  totalReactionsShared: 45892,
  internetBundlesFunded: 143,
  totalDonationsRaised: 715,
  liveActiveVisitors: 42,
  livesTouchedCount: 28547
};

function AppContent() {
  const { user, crisisMessage, setCrisisMessage } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('home');
  const [circles, setCircles] = useState<Circle[]>(INITIAL_CIRCLES);
  const [activeCircleId, setActiveCircleId] = useState<string>('circle-1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [stats, setStats] = useState<CommunityStats>(INITIAL_STATS);

  // Modals
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'upgrade' | 'forgot' | null>(null);
  const [isStoryComposerOpen, setIsStoryComposerOpen] = useState<boolean>(false);
  const [isCrisisModalOpen, setIsCrisisModalOpen] = useState<boolean>(false);
  const [isDonateOpen, setIsDonateOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);

  const fetchCircles = async () => {
    try {
      const res = await fetch('/api/circles');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setCircles(data);
        }
      }
    } catch {
      // Retain fallback circles gracefully if connection is initializing
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        if (data && typeof data === 'object') {
          setStats((prev) => ({ ...prev, ...data }));
        }
      }
    } catch {
      // Retain existing stats gracefully during server restarts or transient pauses
    }
  };

  useEffect(() => {
    fetchCircles();
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const activeCircle = circles.find((c) => c.id === activeCircleId) || circles[0];

  const handleSelectCircle = (circleId: string) => {
    setActiveCircleId(circleId);
    setActiveTab('circles');
  };

  // Filter circles if search query provided
  const filteredCircles = searchQuery.trim()
    ? circles.filter(
        (c) =>
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : circles;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0E17] text-[#0F172A] dark:text-[#E2E8F0] flex font-sans selection:bg-[#6366F1]/20 transition-colors">
      
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenStoryComposer={() => setIsStoryComposerOpen(true)}
        onOpenCrisisModal={() => setIsCrisisModalOpen(true)}
      />

      {/* Main Center & Right Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <TopHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onOpenAuthModal={(mode) => setAuthModalMode(mode)}
          onOpenDonateModal={() => setIsDonateOpen(true)}
          onOpenEditProfileModal={() => setIsEditProfileOpen(true)}
          onOpenCrisisModal={() => setIsCrisisModalOpen(true)}
        />

        {/* Dashboard Content with Middle Area & Right Sidebar */}
        <div className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col xl:flex-row gap-6 max-w-[1600px] w-full mx-auto">
          
          {/* Main Primary View */}
          <div className="flex-1 min-w-0 space-y-6">
            
            {activeTab === 'home' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                
                {/* 1. Hero Banner */}
                <HeroBanner
                  onShareClick={() => setIsStoryComposerOpen(true)}
                  onBrowseClick={() => {
                    const el = document.getElementById('circles-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                {/* 2. Explore Communities / Circles Section */}
                <div id="circles-section">
                  <CirclesOverview
                    circles={filteredCircles}
                    selectedCircleId={activeCircleId}
                    onSelectCircle={handleSelectCircle}
                    onViewAllCircles={() => setActiveTab('circles')}
                  />
                </div>

                {/* 3. Two-Column Live Support & Stories Split Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LiveSupportWidget
                    onStartSupport={() => setActiveTab('campfires')}
                  />
                  <StoriesOfStrengthWidget
                    onReadMore={() => setActiveTab('circles')}
                    onOpenStoryComposer={() => setIsStoryComposerOpen(true)}
                  />
                </div>

                {/* 4. Full-Width Bottom Privacy Promise Banner */}
                <BottomPromiseBanner />
              </div>
            )}

            {/* CIRCLES TAB */}
            {activeTab === 'circles' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <CircleSelector
                  circles={filteredCircles}
                  activeCircleId={activeCircleId}
                  onSelectCircle={(id) => setActiveCircleId(id)}
                />

                {activeCircle && (
                  <CircleFeed circle={activeCircle} />
                )}

                <BottomPromiseBanner />
              </div>
            )}

            {/* LIVE SUPPORT & CAMPFIRES TAB */}
            {activeTab === 'campfires' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <VoiceCallRoom
                  roomName={activeCircle ? `${activeCircle.name} Campfire` : 'General Sanctuary Campfire'}
                />
                <BottomPromiseBanner />
              </div>
            )}

            {/* PEER GUIDES TAB */}
            {activeTab === 'guides' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <GuideDirectory
                  onOpenAuthModal={(mode) => setAuthModalMode(mode)}
                />
                <BottomPromiseBanner />
              </div>
            )}

            {/* AI INTERN & TOOLS TAB */}
            {activeTab === 'ai-intern' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <AiInternAssistant />
                <BottomPromiseBanner />
              </div>
            )}

            {/* RESOURCES TAB */}
            {activeTab === 'resources' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <ResourcesView
                  onOpenCrisisModal={() => setIsCrisisModalOpen(true)}
                />
                <BottomPromiseBanner />
              </div>
            )}

            {/* ABOUT US TAB */}
            {activeTab === 'about' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <AboutView
                  onOpenDonateModal={() => setIsDonateOpen(true)}
                />
                <BottomPromiseBanner />
              </div>
            )}

            {/* SUPER ADMIN PORTAL TAB */}
            {activeTab === 'admin' && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <AdminPortal />
              </div>
            )}

          </div>

          {/* Right Sidebar (Impact, Time Support, Quote & Emergency Box) */}
          <div className="w-full xl:w-80 flex-shrink-0">
            <RightSidebar
              stats={stats}
              onOpenCrisisModal={() => setIsCrisisModalOpen(true)}
              onOpenDonateModal={() => setIsDonateOpen(true)}
            />
          </div>

        </div>

        {/* Global Footer */}
        <footer className="py-6 px-6 border-t border-[#E2E8F0] dark:border-[#1E273D] text-center text-xs text-[#64748B] dark:text-[#94A3B8] transition-colors">
          <p>
            The Open Circle – Anonymous. Safe. Supportive. You matter. 💜
          </p>
        </footer>

      </div>

      {/* --- MODALS --- */}

      {/* Story Composer Modal */}
      {isStoryComposerOpen && (
        <StoryComposerModal
          circles={circles}
          selectedCircleId={activeCircleId}
          onClose={() => setIsStoryComposerOpen(false)}
          onPostCreated={() => {
            fetchStats();
            fetchCircles();
          }}
        />
      )}

      {/* Crisis Support Modal */}
      {isCrisisModalOpen && (
        <CrisisSupportModal
          onClose={() => setIsCrisisModalOpen(false)}
          onConnectGuide={() => {
            setIsCrisisModalOpen(false);
            setActiveTab('campfires');
          }}
        />
      )}

      {/* Donation Modal */}
      {isDonateOpen && (
        <DonationModal
          onClose={() => setIsDonateOpen(false)}
          onDonationSuccess={() => {
            fetchStats();
          }}
          currentUserNickname={user?.nickname}
        />
      )}

      {/* Auth Modal */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
        />
      )}

      {/* Edit Profile / Nickname Modal */}
      {isEditProfileOpen && (
        <EditProfileModal
          onClose={() => setIsEditProfileOpen(false)}
        />
      )}

      {/* AI Crisis Pop-up if auto-triggered by AI Safety Sentinel */}
      {crisisMessage && (
        <div className="fixed inset-0 z-50 bg-[#0B0E17]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#151A28] border border-rose-200 dark:border-rose-900/50 rounded-3xl max-w-lg w-full p-6 text-[#0F172A] dark:text-[#E2E8F0] shadow-2xl relative space-y-4">
            <button
              onClick={() => setCrisisMessage(null)}
              className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white p-1.5 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#1E273D]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-2xl border border-rose-500/30">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold">You Are Not Alone</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Sanctuary Care Sentinel</p>
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] dark:bg-[#1A2234] rounded-2xl border border-[#E2E8F0] dark:border-[#283550] text-xs text-[#334155] dark:text-[#CBD5E1] leading-relaxed whitespace-pre-line max-h-60 overflow-y-auto">
              {crisisMessage}
            </div>

            <button
              onClick={() => setCrisisMessage(null)}
              className="w-full py-2.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-xl text-xs font-bold shadow-md shadow-[#6366F1]/20 transition-all"
            >
              I Understand & Feel Supported
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
