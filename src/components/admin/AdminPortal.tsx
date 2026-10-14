import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Post, CrisisLog, Circle } from '../../types';
import {
  Shield,
  Users,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Ban,
  Eye,
  Plus,
  Sparkles,
  RefreshCw,
  Sliders,
  Database,
  Check
} from 'lucide-react';

export const AdminPortal: React.FC = () => {
  const { token, user } = useAuth();
  const [activeTab, setActiveTab] = useState<'system' | 'users' | 'flagged' | 'crisis' | 'circles'>('system');

  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [flaggedPosts, setFlaggedPosts] = useState<Post[]>([]);
  const [crisisLogs, setCrisisLogs] = useState<CrisisLog[]>([]);
  const [circles, setCircles] = useState<Circle[]>([]);
  const [systemMode, setSystemMode] = useState<'virgin' | 'demo'>('demo');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Circle Form
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleDesc, setNewCircleDesc] = useState('');
  const [newCircleCategory, setNewCircleCategory] = useState<'recovery' | 'emotional' | 'life' | 'general'>('recovery');

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [uRes, fRes, cRes, circRes, sRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/flagged-posts', { headers }),
        fetch('/api/admin/crisis-logs', { headers }),
        fetch('/api/circles'),
        fetch('/api/stats')
      ]);

      if (uRes.ok) setAdminUsers(await uRes.json());
      if (fRes.ok) setFlaggedPosts(await fRes.json());
      if (cRes.ok) setCrisisLogs(await cRes.json());
      if (circRes.ok) setCircles(await circRes.json());
      if (sRes.ok) {
        const statsData = await sRes.json();
        if (statsData.mode) setSystemMode(statsData.mode);
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.isAdmin) fetchData();
  }, [token, user]);

  const handleSystemModeSwitch = async (mode: 'virgin' | 'demo', resetToVirgin: boolean = false) => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/system-mode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ mode, resetToVirgin })
      });

      const data = await res.json();
      if (res.ok) {
        setSystemMode(data.mode);
        setStatusMessage(data.message);
        setTimeout(() => setStatusMessage(null), 4000);
        fetchData();
      }
    } catch (err) {
      console.error('System mode switch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuspend = async (userId: string, suspend: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ suspend, reason: 'Admin safety action' })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Suspend error:', err);
    }
  };

  const handleResolveFlagged = async (postId: string, action: 'approve' | 'delete') => {
    try {
      const res = await fetch(`/api/admin/flagged-posts/${postId}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ action })
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error('Resolve error:', err);
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] rounded-3xl p-10 text-center text-[#0F172A] dark:text-white max-w-lg mx-auto my-12 shadow-sm">
        <Shield className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h3 className="font-serif font-bold text-xl">Super Admin Access Required</h3>
        <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-2">
          This portal is reserved for Super Admin <code className="text-amber-600 dark:text-amber-400 font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">izereyves9@gmail.com</code> and verified lead mentors.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Admin Header */}
      <div className="bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] rounded-3xl p-6 text-[#0F172A] dark:text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-600 dark:text-amber-400">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-2xl font-bold">The Open Circle Operations</h2>
              <span className="text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Super Admin
              </span>
            </div>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
              Configure Virgin / Seed mode, review safety logs, users, and circles.
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2 bg-[#F1F5F9] dark:bg-[#1C243B] hover:bg-[#E2E8F0] dark:hover:bg-[#25304C] text-[#0F172A] dark:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-[#E2E8F0] dark:border-[#232D44] shadow-sm transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#6366F1]" /> Refresh Data
        </button>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E2E8F0] dark:border-[#232D44] pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'system'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2234]'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Virgin / Demo Platform Mode</span>
        </button>

        <button
          onClick={() => setActiveTab('flagged')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'flagged'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2234]'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>AI Moderation Queue ({flaggedPosts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('crisis')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'crisis'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2234]'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Crisis Interventions ({crisisLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'users'
              ? 'bg-[#6366F1] text-white shadow-sm'
              : 'text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#1A2234]'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Users & Guides ({adminUsers.length})</span>
        </button>
      </div>

      {/* SYSTEM MODE TAB (Virgin vs Demo Platform Setup) */}
      {activeTab === 'system' && (
        <div className="bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] rounded-3xl p-6 space-y-6">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0F172A] dark:text-white">
              Platform Data & Statistics Configuration
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-1">
              Control how community statistics (Lives Touched, Stories Shared, Reactions, Internet Bundles) behave on this demo and production release.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Virgin Platform Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              systemMode === 'virgin'
                ? 'bg-[#6366F1]/10 dark:bg-[#1C243B] border-2 border-[#6366F1]'
                : 'bg-[#F8FAFC] dark:bg-[#1A2234] border-[#E2E8F0] dark:border-[#283550]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-emerald-500" />
                  <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">
                    Pristine Virgin Sanctuary Mode
                  </h4>
                </div>
                {systemMode === 'virgin' && (
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/30">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-4">
                Strict 100% genuine statistics. No mock posts or fake numbers. Every single counter (Stories Shared, Lives Touched, Reactions, Bundles) computes dynamically in real-time from active real user actions.
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleSystemModeSwitch('virgin', false)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                >
                  Enable Pure Virgin Mode
                </button>
                <button
                  onClick={() => handleSystemModeSwitch('virgin', true)}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors"
                >
                  Wipe Demo Posts (Clean 0 Reset)
                </button>
              </div>
            </div>

            {/* Showcase Demo Card */}
            <div className={`p-5 rounded-2xl border transition-all ${
              systemMode === 'demo'
                ? 'bg-[#6366F1]/10 dark:bg-[#1C243B] border-2 border-[#6366F1]'
                : 'bg-[#F8FAFC] dark:bg-[#1A2234] border-[#E2E8F0] dark:border-[#283550]'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-500" />
                  <h4 className="font-bold text-sm text-[#0F172A] dark:text-white">
                    Showcase Demo Mode
                  </h4>
                </div>
                {systemMode === 'demo' && (
                  <span className="px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border border-indigo-500/30">
                    Active
                  </span>
                )}
              </div>
              <p className="text-xs text-[#64748B] dark:text-[#94A3B8] leading-relaxed mb-4">
                Displays the baseline statistics seen on the visual mockup (28,547 Lives touched, 12,847 Stories shared, 45,892 Reactions) while dynamically adding all new real user actions on top.
              </p>
              <button
                onClick={() => handleSystemModeSwitch('demo', false)}
                className="px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold transition-colors"
              >
                Enable Showcase Demo Mode
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODERATION QUEUE TAB */}
      {activeTab === 'flagged' && (
        <div className="bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] rounded-3xl p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#0F172A] dark:text-white">
            Pre-Moderated Content Queue
          </h3>
          {flaggedPosts.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              All posts are clean and verified! No pending flagged items.
            </div>
          ) : (
            <div className="space-y-3">
              {flaggedPosts.map((post) => (
                <div key={post.id} className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#1A2234] border border-[#E2E8F0] dark:border-[#283550] flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold">{post.nickname}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 font-bold">
                        {post.aiVerdict}
                      </span>
                    </div>
                    <p className="text-xs text-[#334155] dark:text-[#CBD5E1] mt-2 font-mono bg-white dark:bg-[#151A28] p-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#232D44]">
                      {post.content}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResolveFlagged(post.id, 'approve')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleResolveFlagged(post.id, 'delete')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CRISIS TAB */}
      {activeTab === 'crisis' && (
        <div className="bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] rounded-3xl p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#0F172A] dark:text-white">
            AI Sentinel Crisis Logs
          </h3>
          {crisisLogs.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#64748B] dark:text-[#94A3B8]">
              No active crisis alerts logged.
            </div>
          ) : (
            <div className="space-y-3">
              {crisisLogs.map((log) => (
                <div key={log.id} className="p-4 rounded-2xl bg-rose-500/5 dark:bg-[#251820] border border-rose-500/20 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-rose-700 dark:text-rose-300">User: {log.userNickname}</span>
                    <span className="text-[10px] text-[#64748B]">{new Date(log.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-rose-600 dark:text-rose-400 mt-1 font-mono">Trigger: "{log.trigger}"</p>
                  <p className="text-[#64748B] dark:text-[#94A3B8] mt-1">Action: {log.actionTaken}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* USERS TAB */}
      {activeTab === 'users' && (
        <div className="bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] rounded-3xl p-6 space-y-4">
          <h3 className="font-serif text-lg font-bold text-[#0F172A] dark:text-white">
            Sanctuary Accounts & Mentors ({adminUsers.length})
          </h3>
          <div className="divide-y divide-[#E2E8F0] dark:divide-[#232D44]">
            {adminUsers.map((u) => (
              <div key={u.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0F172A] dark:text-white">{u.nickname}</span>
                    {u.isMentor && (
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-500/10 text-emerald-600 rounded-full font-bold">
                        Guide
                      </span>
                    )}
                    {u.isAdmin && (
                      <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 text-amber-600 rounded-full font-bold">
                        Admin
                      </span>
                    )}
                    {u.isGuest && (
                      <span className="text-[10px] px-2 py-0.5 bg-slate-500/10 text-slate-600 rounded-full font-bold">
                        Guest
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8]">
                    Last active: {new Date(u.lastActive).toLocaleDateString()}
                  </p>
                </div>

                {!u.isAdmin && (
                  <button
                    onClick={() => handleSuspend(u.id, !u.isSuspended)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold ${
                      u.isSuspended
                        ? 'bg-emerald-600 text-white'
                        : 'bg-rose-500/10 text-rose-600 border border-rose-500/30'
                    }`}
                  >
                    {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
