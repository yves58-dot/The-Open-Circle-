import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { generateRandomAvatar } from '../../utils/avatar';
import { UserAvatar } from '../shared/UserAvatar';
import { X, Sparkles, KeyRound, Lock, Mail, User, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  initialMode?: 'login' | 'register' | 'upgrade' | 'forgot';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode = 'login',
  onClose
}) => {
  const { login, register, upgradeGuest, user } = useAuth();
  const [mode, setMode] = useState<'login' | 'register' | 'upgrade' | 'forgot'>(initialMode);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatarConfig, setAvatarConfig] = useState(generateRandomAvatar());
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const res = await login(email, password);
    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Login failed');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const res = await register(email, password, nickname, avatarConfig);
    setIsSubmitting(false);
    if (res.success) {
      onClose();
    } else {
      setError(res.error || 'Registration failed');
    }
  };

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    const res = await upgradeGuest(email, password, nickname);
    setIsSubmitting(false);
    if (res.success) {
      setSuccessMsg('Guest account upgraded! All your posts are now permanent.');
      setTimeout(() => onClose(), 1500);
    } else {
      setError(res.error || 'Upgrade failed');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setIsSubmitting(false);
      setSuccessMsg(data.message);
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err) {
      setIsSubmitting(false);
      setError('Network error');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: resetToken, newPassword })
      });
      const data = await res.json();
      setIsSubmitting(false);
      if (res.ok) {
        setSuccessMsg(data.message);
        setTimeout(() => setMode('login'), 1500);
      } else {
        setError(data.error || 'Reset failed');
      }
    } catch (err) {
      setIsSubmitting(false);
      setError('Network error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2D2D]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-[#E5E2DC] rounded-3xl max-w-md w-full p-6 text-[#2D2D2D] shadow-2xl relative my-8">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8D8881] hover:text-[#2D2D2D] p-1 rounded-full hover:bg-[#F5F3EF]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#F5F3EF] border border-[#E5E2DC] flex items-center justify-center text-[#7C9082] mx-auto mb-3 shadow-sm">
            <Heart className="w-6 h-6 fill-[#7C9082]/20" />
          </div>
          <h3 className="font-serif text-2xl font-bold text-[#2D2D2D]">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Sanctuary Account'}
            {mode === 'upgrade' && 'Upgrade Guest Session'}
            {mode === 'forgot' && 'Reset Your Password'}
          </h3>
          <p className="text-xs text-[#8D8881] mt-1">
            "No face required. No name needed. Just your truth."
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs mb-4">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-[#7C9082] text-xs mb-4 font-semibold">
            {successMsg}
          </div>
        )}

        {/* LOGIN FORM */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs text-[#6B665F] font-medium block mb-1">Encrypted Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8D8881] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D2D2D] placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-[#6B665F] font-medium">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('forgot')}
                  className="text-[11px] text-[#7C9082] hover:underline font-semibold"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8D8881] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D2D2D] placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#7C9082] hover:bg-[#687C6E] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-[#7C9082]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Sign In</span> <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-[#8D8881] space-y-2">
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-[#7C9082] font-bold hover:underline"
                >
                  Sign Up Free
                </button>
              </p>
              <button
                type="button"
                onClick={onClose}
                className="text-[#8D8881] hover:text-[#2D2D2D] text-[11px] block mx-auto underline font-medium"
              >
                Continue as Anonymous Guest →
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="text-xs text-[#6B665F] font-medium block mb-1">Anonymous Nickname</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#8D8881] absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  minLength={3}
                  maxLength={20}
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder="e.g. CourageousFox"
                  className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D2D2D] placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
                />
              </div>
            </div>

            {/* Avatar Selector */}
            <div>
              <label className="text-xs text-[#6B665F] font-medium block mb-1">Avatar Preview</label>
              <div className="flex items-center justify-between bg-[#FBF9F7] p-3 rounded-2xl border border-[#EBE8E4]">
                <UserAvatar config={avatarConfig} size="md" />
                <button
                  type="button"
                  onClick={() => setAvatarConfig(generateRandomAvatar())}
                  className="text-xs bg-[#F5F3EF] hover:bg-[#EBE8E4] text-[#2D2D2D] px-3 py-1.5 rounded-xl font-semibold border border-[#EBE8E4]"
                >
                  Randomize Avatar
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#6B665F] font-medium block mb-1">Email (Encrypted for account recovery only)</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8D8881] absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@domain.com"
                  className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D2D2D] placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-[#6B665F] font-medium block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8D8881] absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-[#2D2D2D] placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#7C9082] hover:bg-[#687C6E] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-[#7C9082]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Create Account</span> <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-center text-xs text-[#8D8881]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#7C9082] font-bold hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* UPGRADE GUEST FORM */}
        {mode === 'upgrade' && (
          <form onSubmit={handleUpgrade} className="space-y-4">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-[#2D2D2D]">
              <span className="font-bold text-[#7C9082] block mb-0.5">Account Upgrade Benefits:</span>
              • Your current posts become permanent (no 24h expiry)<br />
              • Unlocks 1-on-1 Peer Guide bookings & Group Campfire calls<br />
              • Save Circle memberships & badges
            </div>

            <div>
              <label className="text-xs text-[#6B665F] font-medium block mb-1">Current Nickname</label>
              <input
                type="text"
                value={nickname || user?.nickname || ''}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2D2D] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-[#6B665F] font-medium block mb-1">Email (Encrypted for recovery)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.email@domain.com"
                className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2D2D] placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
              />
            </div>

            <div>
              <label className="text-xs text-[#6B665F] font-medium block mb-1">Create Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2D2D] placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-[#7C9082] hover:bg-[#687C6E] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-[#7C9082]/20 transition-all"
            >
              Confirm Account Upgrade
            </button>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {mode === 'forgot' && (
          <form onSubmit={resetToken ? handleResetPassword : handleForgotPassword} className="space-y-4">
            {!resetToken ? (
              <>
                <div>
                  <label className="text-xs text-[#6B665F] font-medium block mb-1">Registered Account Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.email@domain.com"
                    className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2D2D] placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#7C9082] hover:bg-[#687C6E] text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Send Reset Link
                </button>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs text-[#6B665F] font-medium block mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl px-3.5 py-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#7C9082] hover:bg-[#687C6E] text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Confirm New Password
                </button>
              </>
            )}

            <div className="text-center text-xs text-[#8D8881]">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#7C9082] hover:underline font-bold"
              >
                Return to Login
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
