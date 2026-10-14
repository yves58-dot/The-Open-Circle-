import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserAvatar } from '../shared/UserAvatar';
import { generateRandomAvatar, generateNickname, AVATAR_BG_COLORS, AVATAR_ICONS } from '../../utils/avatar';
import { X, UserCog, RefreshCw, Sparkles, Check } from 'lucide-react';

interface EditProfileModalProps {
  onClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const [nickname, setNickname] = useState<string>(user?.nickname || '');
  const [avatarConfig, setAvatarConfig] = useState(user?.avatarConfig || generateRandomAvatar());
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (!user) return null;

  const handleRandomizeAvatar = () => {
    setAvatarConfig(generateRandomAvatar());
  };

  const handleGenerateNickname = () => {
    setNickname(generateNickname());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Display name / nickname cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await updateProfile(nickname.trim(), avatarConfig);
    setIsSubmitting(false);

    if (res.success) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setError(res.error || 'Failed to update profile');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2D2D2D]/60 dark:bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#202024] border border-[#F0EEEA] dark:border-[#2D2D32] rounded-3xl max-w-md w-full p-6 text-[#2D2D2D] dark:text-[#E4E4E7] shadow-2xl relative transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8D8881] dark:text-[#A1A1AA] hover:text-[#2D2D2D] dark:hover:text-white p-1.5 rounded-full hover:bg-[#F5F3EF] dark:hover:bg-[#2B2B30] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-[#7C9082]/10 dark:bg-[#7C9082]/20 border border-[#7C9082]/30 rounded-2xl text-[#7C9082] dark:text-[#8D9F92]">
            <UserCog className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2D2D2D] dark:text-white">
              Edit Display Name
            </h3>
            <p className="text-xs text-[#8D8881] dark:text-[#8E8E93]">
              Customize how you appear across circles & support sessions
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-300 text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4" /> Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Avatar Preview & Customizer */}
          <div className="p-4 bg-[#FBF9F7] dark:bg-[#28282D] rounded-2xl border border-[#F0EEEA] dark:border-[#38383E] flex flex-col items-center gap-3">
            <div className="flex items-center gap-4">
              <UserAvatar config={avatarConfig} size="lg" isGuide={user.isMentor} />
              <button
                type="button"
                onClick={handleRandomizeAvatar}
                className="px-3 py-1.5 bg-white dark:bg-[#202024] border border-[#E5E2DC] dark:border-[#38383E] rounded-xl text-xs font-semibold text-[#6B665F] dark:text-[#A1A1AA] hover:text-[#2D2D2D] dark:hover:text-white flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Randomize Avatar
              </button>
            </div>

            {/* Color Palette */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pt-1 pb-1">
              {AVATAR_BG_COLORS.map(color => (
                <button
                  type="button"
                  key={color}
                  onClick={() => setAvatarConfig({ ...avatarConfig, bgColor: color })}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    avatarConfig.bgColor === color ? 'scale-110 border-white dark:border-black ring-2 ring-[#7C9082]' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Nickname Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[#6B665F] dark:text-[#A1A1AA]">
                Display Name / Nickname
              </label>
              <button
                type="button"
                onClick={handleGenerateNickname}
                className="text-[11px] font-semibold text-[#7C9082] dark:text-[#8D9F92] hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" /> Auto-Generate
              </button>
            </div>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={40}
              placeholder="e.g. QuietStorm82, Yves, SolaceFriend"
              className="w-full bg-[#FBF9F7] dark:bg-[#28282D] border border-[#EBE8E4] dark:border-[#38383E] rounded-xl px-3.5 py-2.5 text-sm text-[#2D2D2D] dark:text-white placeholder-[#A09B95] dark:placeholder-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#7C9082]"
            />
            <p className="text-[11px] text-[#A09B95] dark:text-[#71717A]">
              You can change this name whenever you like. All your past posts in circles will reflect your updated display name.
            </p>
          </div>

          {/* Save Button */}
          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-transparent text-xs font-semibold text-[#6B665F] dark:text-[#A1A1AA] hover:bg-[#F5F3EF] dark:hover:bg-[#28282D] rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !nickname.trim()}
              className="px-5 py-2 bg-[#7C9082] hover:bg-[#687C6E] text-white disabled:opacity-50 text-xs font-semibold rounded-xl shadow-md shadow-[#7C9082]/20 transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Save Display Name</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
