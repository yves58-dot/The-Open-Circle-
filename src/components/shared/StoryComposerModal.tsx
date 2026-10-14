import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Circle } from '../../types';
import { UserAvatar } from './UserAvatar';
import { X, Sparkles, Send, ShieldAlert, Heart, Shield, RefreshCw } from 'lucide-react';

interface StoryComposerModalProps {
  circles: Circle[];
  selectedCircleId: string;
  onClose: () => void;
  onPostCreated: () => void;
}

const MOOD_TAGS = [
  '🌱 Hopeful',
  '🌧️ Struggling',
  '🕯️ Vulnerable',
  '🕊️ Grateful',
  '⚡ Overwhelmed',
  '🏆 6 Months Free',
  '🌟 1 Year Free',
  '🌿 Seeking Peace'
];

export const StoryComposerModal: React.FC<StoryComposerModalProps> = ({
  circles,
  selectedCircleId,
  onClose,
  onPostCreated
}) => {
  const { user, token } = useAuth();
  const [circleId, setCircleId] = useState<string>(selectedCircleId || circles[0]?.id || 'circle-1');
  const [content, setContent] = useState<string>('');
  const [mood, setMood] = useState<string>('🌱 Hopeful');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Please write your story or reflection.');
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setAiFeedback(null);

    try {
      const res = await fetch(`/api/circles/${circleId}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          content: content.trim(),
          mood
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to share story');
        if (data.crisis) {
          setAiFeedback('Our AI safety sentinel noticed potential crisis expressions. Please remember support is available 24/7.');
        }
        setIsSubmitting(false);
        return;
      }

      onPostCreated();
      onClose();
    } catch (err) {
      setError('Network error while posting story.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0B0E17]/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] rounded-3xl max-w-lg w-full p-6 text-[#0F172A] dark:text-[#E2E8F0] shadow-2xl relative space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white p-1 rounded-full hover:bg-[#F1F5F9] dark:hover:bg-[#1E273D] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#6366F1]/10 text-[#6366F1] dark:text-[#818CF8] rounded-2xl border border-[#6366F1]/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0F172A] dark:text-white">
              Share Your Story Anonymously
            </h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              No names, no faces. Your words are held in compassionate confidence.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-600 dark:text-rose-400 text-xs">
            {error}
          </div>
        )}

        {aiFeedback && (
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-600 dark:text-amber-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{aiFeedback}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Choose Circle */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#475569] dark:text-[#94A3B8]">
              Select Circle Sanctuary
            </label>
            <select
              value={circleId}
              onChange={(e) => setCircleId(e.target.value)}
              className="w-full bg-[#F8FAFC] dark:bg-[#1A2234] border border-[#E2E8F0] dark:border-[#283550] rounded-xl px-3 py-2 text-xs text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
            >
              {circles.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mood Chips */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#475569] dark:text-[#94A3B8]">
              How are you feeling today?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {MOOD_TAGS.map((tag) => (
                <button
                  type="button"
                  key={tag}
                  onClick={() => setMood(tag)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    mood === tag
                      ? 'bg-[#6366F1] text-white shadow-sm'
                      : 'bg-[#F1F5F9] dark:bg-[#1A2234] text-[#64748B] dark:text-[#94A3B8] hover:bg-[#E2E8F0] dark:hover:bg-[#25314C]'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Story Textarea */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#475569] dark:text-[#94A3B8]">
              Your Story / Reflection
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="Write freely. Express your struggles, your gratitude, your milestones, or what's on your heart tonight..."
              className="w-full bg-[#F8FAFC] dark:bg-[#1A2234] border border-[#E2E8F0] dark:border-[#283550] rounded-2xl p-3.5 text-xs md:text-sm text-[#0F172A] dark:text-white placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1] resize-none"
            />
          </div>

          {/* Identity Indicator & Submit */}
          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserAvatar
                config={user?.avatarConfig || { bgColor: '#6366F1', shape: 'circle', icon: 'heart' }}
                size="sm"
              />
              <span className="text-xs text-[#64748B] dark:text-[#94A3B8]">
                Posting as <strong className="text-[#0F172A] dark:text-white">{user?.nickname || 'Anonymous'}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !content.trim()}
                className="px-5 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold shadow-md shadow-[#6366F1]/20 disabled:opacity-50 flex items-center gap-1.5 transition-all"
              >
                {isSubmitting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Post Anonymously</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
