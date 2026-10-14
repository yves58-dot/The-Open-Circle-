import React, { useState } from 'react';
import { Post } from '../../types';
import { Heart, MessageSquare, Share2, Sparkles, ArrowRight, Shield } from 'lucide-react';

interface StoriesOfStrengthWidgetProps {
  onReadMore: () => void;
  onOpenStoryComposer: () => void;
}

export const StoriesOfStrengthWidget: React.FC<StoriesOfStrengthWidgetProps> = ({
  onReadMore,
  onOpenStoryComposer
}) => {
  const [likes, setLikes] = useState<number>(245);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [shared, setShared] = useState<boolean>(false);

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleShare = () => {
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="p-5 rounded-3xl bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] shadow-sm flex flex-col justify-between space-y-4">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-base text-[#0F172A] dark:text-white">
            Stories of Strength
          </h3>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8] mt-0.5">
            Real people. Real stories. Real hope.
          </p>
        </div>

        <button
          onClick={onReadMore}
          className="text-xs font-bold text-[#6366F1] dark:text-[#818CF8] hover:underline flex items-center gap-1"
        >
          <span>Read more stories</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Featured Quote Story Card */}
      <div className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#1A2234] border border-[#E2E8F0] dark:border-[#283550] space-y-3">
        <p className="text-xs md:text-sm text-[#334155] dark:text-[#CBD5E1] font-serif italic leading-relaxed">
          “I was at my lowest at 2 AM, ready to give up. This community saved my life. Today, I'm 6 months sober and rebuilding.”
        </p>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#475569] dark:text-[#94A3B8]">
              — Anonymous
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
              6 months free
            </span>
          </div>

          {/* Micro Interactions */}
          <div className="flex items-center gap-3 text-xs text-[#64748B] dark:text-[#94A3B8]">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 hover:text-rose-500 transition-colors ${
                hasLiked ? 'text-rose-500 font-bold' : ''
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{likes}</span>
            </button>

            <button
              onClick={onReadMore}
              className="flex items-center gap-1 hover:text-[#6366F1] transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>18</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-[#6366F1] transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{shared ? 'Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
