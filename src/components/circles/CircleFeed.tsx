import React, { useState, useEffect } from 'react';
import { Circle, Post } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { UserAvatar } from '../shared/UserAvatar';
import { CircleRulesModal } from './CircleRulesModal';
import {
  Eye, Handshake, Sprout, Send, Sparkles, ShieldAlert,
  AlertTriangle, MessageSquare, Clock, Heart, CornerDownRight, RefreshCw
} from 'lucide-react';

interface CircleFeedProps {
  circle: Circle;
}

export const CircleFeed: React.FC<CircleFeedProps> = ({ circle }) => {
  const { user, token, setCrisisMessage } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [content, setContent] = useState<string>('');
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [replyToPostId, setReplyToPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  
  const [isPosting, setIsPosting] = useState<boolean>(false);
  const [rulesAcknowledged, setRulesAcknowledged] = useState<boolean>(false);
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);
  
  const [preModError, setPreModError] = useState<{ message: string; postId?: string; canAppeal?: boolean } | null>(null);

  const MOOD_OPTIONS = [
    '🌧️ Heavy', ' Overwhelmed', ' Hopeful', ' Relapsed',
    ' Proud', ' Lonely', ' Recovering', ' In Pain'
  ];

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/circles/${circle.id}/posts`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [circle.id, token]);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!rulesAcknowledged) {
      setShowRulesModal(true);
      return;
    }

    setIsPosting(true);
    setPreModError(null);

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          circleId: circle.id,
          content: content.trim(),
          mood: selectedMood
        })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.canAppeal) {
          setPreModError({
            message: data.error || 'Post held by AI Intern pre-moderation.',
            postId: data.postId,
            canAppeal: true
          });
        } else {
          alert(data.error || 'Failed to submit post');
        }
        return;
      }

      if (data.crisisAlert && data.crisisMessage) {
        setCrisisMessage(data.crisisMessage);
      }

      setContent('');
      setSelectedMood('');
      fetchPosts();
    } catch (err) {
      console.error('Error posting:', err);
    } finally {
      setIsPosting(false);
    }
  };

  const handleCreateReply = async (parentPostId: string) => {
    if (!replyContent.trim()) return;

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          circleId: circle.id,
          content: replyContent.trim(),
          replyTo: parentPostId
        })
      });

      if (res.ok) {
        setReplyContent('');
        setReplyToPostId(null);
        fetchPosts();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to send reply');
      }
    } catch (err) {
      console.error('Error replying:', err);
    }
  };

  const handleReact = async (postId: string, type: 'witnessed' | 'with_you' | 'rooting_for_you') => {
    try {
      const res = await fetch(`/api/posts/${postId}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ type })
      });

      if (res.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error('Reaction error:', err);
    }
  };

  const handleAppeal = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/appeal`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        alert('Escalated to human Peer Guide review queue.');
        setPreModError(null);
        fetchPosts();
      }
    } catch (err) {
      console.error('Appeal error:', err);
    }
  };

  const handleTriggerEmpathyBoost = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/empathy-boost`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error('Empathy boost error:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Circle Banner Header */}
      <div className="bg-white dark:bg-[#202024] border border-[#F0EEEA] dark:border-[#2D2D32] rounded-3xl p-6 text-[#2D2D2D] dark:text-[#E4E4E7] shadow-sm relative overflow-hidden transition-colors">
        <div className="absolute top-0 right-0 p-8 opacity-10 dark:opacity-5 pointer-events-none">
          <Heart className="w-48 h-48 text-[#7C9082]" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs uppercase font-bold text-[#7C9082] dark:text-[#8D9F92] tracking-wider">
                Active Circle Feed
              </span>
              <h2 className="font-serif text-2xl font-bold text-[#2D2D2D] dark:text-white mt-0.5">
                {circle.name}
              </h2>
            </div>
            <button
              onClick={() => setShowRulesModal(true)}
              className="self-start sm:self-center px-3.5 py-1.5 rounded-xl bg-[#F5F3EF] dark:bg-[#2B2B30] border border-[#E5E2DC] dark:border-[#38383E] hover:border-[#7C9082] text-xs font-semibold text-[#6B665F] dark:text-[#A1A1AA] hover:text-[#2D2D2D] dark:hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <ShieldAlert className="w-4 h-4 text-[#7C9082] dark:text-[#8D9F92]" /> View Circle Rules
            </button>
          </div>

          <p className="text-sm text-[#6B665F] dark:text-[#A1A1AA] mt-2 max-w-3xl leading-relaxed">
            {circle.description}
          </p>
        </div>
      </div>

      {/* Post Creation Form */}
      <div className="bg-white dark:bg-[#202024] border border-[#F0EEEA] dark:border-[#2D2D32] rounded-3xl p-5 shadow-sm transition-colors">
        <form onSubmit={handleCreatePost} className="space-y-4">
          <div className="flex items-start gap-3">
            {user && <UserAvatar config={user.avatarConfig} size="md" isGuide={user.isMentor} />}
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={`Share your truth in ${circle.name}... (No real name or face required)`}
                rows={3}
                maxLength={2000}
                className="w-full bg-[#FBF9F7] dark:bg-[#28282D] border border-[#EBE8E4] dark:border-[#38383E] rounded-2xl p-4 text-sm text-[#2D2D2D] dark:text-white placeholder-[#A09B95] dark:placeholder-[#71717A] focus:outline-none focus:ring-2 focus:ring-[#7C9082]/40 resize-none transition-colors"
              />
              <div className="flex items-center justify-between mt-1 text-[11px] text-[#8D8881] dark:text-[#8E8E93] px-1">
                <span className="flex items-center gap-1 text-[#8D8881] dark:text-[#8E8E93]">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> AI Gatekeeper Active (Scans for safety & crisis)
                </span>
                <span>{content.length}/2000</span>
              </div>
            </div>
          </div>

          {/* Mood Tags & Submit */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F0EEEA] dark:border-[#2D2D32]">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              <span className="text-xs text-[#8D8881] dark:text-[#8E8E93] font-medium mr-1">Mood:</span>
              {MOOD_OPTIONS.map(m => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setSelectedMood(selectedMood === m ? '' : m)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    selectedMood === m
                      ? 'bg-[#7C9082] text-white font-semibold shadow-sm'
                      : 'bg-[#F5F3EF] dark:bg-[#2B2B30] text-[#6B665F] dark:text-[#A1A1AA] hover:bg-[#EBE8E4] dark:hover:bg-[#323238]'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isPosting || !content.trim()}
              className="px-5 py-2.5 bg-[#7C9082] hover:bg-[#687C6E] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-[#7C9082]/20 transition-all flex items-center gap-2 ml-auto"
            >
              {isPosting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              <span>Post Anonymously</span>
            </button>
          </div>
        </form>

        {/* Pre-Moderation Held Post Alert */}
        {preModError && (
          <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-amber-900 dark:text-amber-200 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{preModError.message}</span>
            </div>
            {preModError.canAppeal && preModError.postId && (
              <button
                onClick={() => handleAppeal(preModError.postId!)}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold shrink-0 shadow-sm"
              >
                Disagree with the Intern (Escalate to Guide)
              </button>
            )}
          </div>
        )}
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12 text-[#8D8881] dark:text-[#8E8E93] flex flex-col items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin text-[#7C9082]" />
            <p className="text-sm">Listening for truth in {circle.name}...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-[#202024] border border-[#F0EEEA] dark:border-[#2D2D32] rounded-3xl p-10 text-center text-[#8D8881] dark:text-[#8E8E93]">
            <Heart className="w-10 h-10 mx-auto text-[#A09B95] dark:text-[#71717A] mb-2" />
            <h4 className="font-serif text-lg text-[#2D2D2D] dark:text-white font-semibold">No posts in this Circle yet</h4>
            <p className="text-xs text-[#6B665F] dark:text-[#A1A1AA] mt-1 max-w-sm mx-auto">
              Be the first voice. Your words might be the comfort someone else needs tonight.
            </p>
          </div>
        ) : (
          posts.map(post => (
            <div
              key={post.id}
              className={`bg-white dark:bg-[#202024] border rounded-3xl p-5 text-[#2D2D2D] dark:text-[#E4E4E7] shadow-sm transition-all ${
                post.aiVerdict === 'flagged'
                  ? 'border-amber-300 dark:border-amber-800 bg-amber-50/40 dark:bg-amber-950/20'
                  : 'border-[#F0EEEA] dark:border-[#2D2D32] hover:border-[#E5E2DC] dark:hover:border-[#38383E]'
              }`}
            >
              {/* Post Header */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <UserAvatar config={post.avatarConfig} size="md" isGuide={post.nickname.includes('Guide') || post.nickname.includes('Serene')} />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-sm text-[#2D2D2D] dark:text-white">
                        {post.nickname}
                      </span>
                      {post.isGuestPost && (
                        <span className="text-[10px] bg-[#F5F3EF] dark:bg-[#2B2B30] text-[#8D8881] dark:text-[#8E8E93] px-2 py-0.5 rounded-full border border-[#E5E2DC] dark:border-[#38383E] flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3" /> Guest (24h expiry)
                        </span>
                      )}
                      {post.mood && (
                        <span className="text-[10px] bg-[#F5F3EF] dark:bg-[#2B2B30] text-[#7C9082] dark:text-[#8D9F92] px-2 py-0.5 rounded-full border border-[#E5E2DC] dark:border-[#38383E] font-semibold">
                          {post.mood}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#A09B95] dark:text-[#71717A] block mt-0.5">
                      {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {post.aiVerdict === 'flagged' && (
                  <span className="text-[11px] bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800 flex items-center gap-1 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" /> Held for Guide Review
                  </span>
                )}
              </div>

              {/* Post Content */}
              <p className="text-sm text-[#2D2D2D] dark:text-[#E4E4E7] leading-relaxed whitespace-pre-wrap mb-4">
                {post.content}
              </p>

              {/* Reaction Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F0EEEA] dark:border-[#2D2D32]">
                <div className="flex items-center gap-2">
                  {/* Witnessed */}
                  <button
                    onClick={() => handleReact(post.id, 'witnessed')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F3EF] dark:bg-[#28282D] hover:bg-[#EBE8E4] dark:hover:bg-[#323238] text-xs font-semibold text-[#6B665F] dark:text-[#A1A1AA] border border-[#E5E2DC] dark:border-[#38383E] transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Witnessed ({post.reactions?.witnessed || 0})</span>
                  </button>

                  {/* With You */}
                  <button
                    onClick={() => handleReact(post.id, 'with_you')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F3EF] dark:bg-[#28282D] hover:bg-[#EBE8E4] dark:hover:bg-[#323238] text-xs font-semibold text-[#6B665F] dark:text-[#A1A1AA] border border-[#E5E2DC] dark:border-[#38383E] transition-colors"
                  >
                    <Handshake className="w-3.5 h-3.5 text-[#7C9082] dark:text-[#8D9F92]" />
                    <span>With You ({post.reactions?.with_you || 0})</span>
                  </button>

                  {/* Rooting for You */}
                  <button
                    onClick={() => handleReact(post.id, 'rooting_for_you')}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F5F3EF] dark:bg-[#28282D] hover:bg-[#EBE8E4] dark:hover:bg-[#323238] text-xs font-semibold text-[#6B665F] dark:text-[#A1A1AA] border border-[#E5E2DC] dark:border-[#38383E] transition-colors"
                  >
                    <Sprout className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>Rooting for You ({post.reactions?.rooting_for_you || 0})</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setReplyToPostId(replyToPostId === post.id ? null : post.id)}
                    className="flex items-center gap-1 text-xs font-semibold text-[#6B665F] dark:text-[#A1A1AA] hover:text-[#2D2D2D] dark:hover:text-white px-2.5 py-1.5 rounded-xl hover:bg-[#F5F3EF] dark:hover:bg-[#28282D] transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Reply ({post.replies?.length || 0})</span>
                  </button>

                  {/* Empathy Booster auto-reply button */}
                  {(!post.replies || post.replies.length === 0) && (
                    <button
                      onClick={() => handleTriggerEmpathyBoost(post.id)}
                      className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-900 px-2.5 py-1.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 transition-colors"
                      title="Trigger AI Intern Empathy Booster"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" /> AI Empathy Nudge
                    </button>
                  )}
                </div>
              </div>

              {/* Reply Input Box */}
              {replyToPostId === post.id && (
                <div className="mt-4 pt-3 border-t border-[#F0EEEA] dark:border-[#2D2D32] flex items-center gap-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a supportive reply..."
                    className="flex-1 bg-[#FBF9F7] dark:bg-[#28282D] border border-[#EBE8E4] dark:border-[#38383E] rounded-xl px-3.5 py-2 text-xs text-[#2D2D2D] dark:text-white placeholder-[#A09B95] dark:placeholder-[#71717A] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
                  />
                  <button
                    onClick={() => handleCreateReply(post.id)}
                    disabled={!replyContent.trim()}
                    className="px-3.5 py-2 bg-[#7C9082] hover:bg-[#687C6E] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shrink-0 shadow-sm"
                  >
                    Send Reply
                  </button>
                </div>
              )}

              {/* Nested Replies */}
              {post.replies && post.replies.length > 0 && (
                <div className="mt-4 space-y-3 pl-4 sm:pl-6 border-l-2 border-[#EBE8E4] dark:border-[#38383E]">
                  {post.replies.map(reply => (
                    <div
                      key={reply.id}
                      className={`p-3.5 rounded-2xl border text-[#2D2D2D] dark:text-[#E4E4E7] ${
                        reply.aiAutoReply
                          ? 'bg-purple-50/60 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800'
                          : 'bg-[#FBF9F7] dark:bg-[#28282D] border-[#F0EEEA] dark:border-[#38383E]'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <UserAvatar config={reply.avatarConfig} size="sm" isGuide={reply.nickname.includes('Guide')} />
                        <span className="font-serif font-bold text-xs text-[#2D2D2D] dark:text-white">
                          {reply.nickname}
                        </span>
                        {reply.aiAutoReply && (
                          <span className="text-[10px] bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 flex items-center gap-1 font-semibold">
                            <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" /> Empathy Booster
                          </span>
                        )}
                        <span className="text-[10px] text-[#A09B95] dark:text-[#71717A] ml-auto">
                          {new Date(reply.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B665F] dark:text-[#A1A1AA] leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ))
        )}
      </div>

      {/* Circle Rules Modal */}
      {showRulesModal && (
        <CircleRulesModal
          circle={circle}
          onAcknowledge={() => {
            setRulesAcknowledged(true);
            setShowRulesModal(false);
          }}
          onClose={() => setShowRulesModal(false)}
        />
      )}

    </div>
  );
};
