import React from 'react';
import { AvatarConfig } from '../../types';
import { Flower, Trees, Waves, Star, Moon, Heart, Sun, Feather, Shield } from 'lucide-react';

interface UserAvatarProps {
  config: AvatarConfig;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  isGuide?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  config,
  size = 'md',
  showBadge = false,
  isGuide = false
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl'
  }[size];

  const iconSizeMap = {
    sm: 16,
    md: 20,
    lg: 26,
    xl: 36
  }[size];

  const shapeClass = {
    circle: 'rounded-full',
    square: 'rounded-xl',
    hexagon: 'rounded-2xl transform rotate-3'
  }[config.shape || 'circle'];

  const renderIcon = () => {
    const s = iconSizeMap;
    switch (config.icon) {
      case 'flower': return <Flower size={s} className="text-white opacity-90" />;
      case 'tree': return <Trees size={s} className="text-white opacity-90" />;
      case 'wave': return <Waves size={s} className="text-white opacity-90" />;
      case 'star': return <Star size={s} className="text-white opacity-90" />;
      case 'moon': return <Moon size={s} className="text-white opacity-90" />;
      case 'heart': return <Heart size={s} className="text-white opacity-90" />;
      case 'sun': return <Sun size={s} className="text-white opacity-90" />;
      case 'feather': return <Feather size={s} className="text-white opacity-90" />;
      default: return <Flower size={s} className="text-white opacity-90" />;
    }
  };

  return (
    <div className="relative inline-block">
      <div
        className={`${sizeClasses} ${shapeClass} flex items-center justify-center shadow-sm transition-transform hover:scale-105 shrink-0`}
        style={{ backgroundColor: config.bgColor || '#3B82F6' }}
      >
        {renderIcon()}
      </div>
      {(showBadge || isGuide) && (
        <span
          className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 shadow border border-white dark:border-slate-800"
          title="Verified Certified Peer Guide"
        >
          <Shield size={size === 'sm' ? 10 : 12} className="fill-emerald-600" />
        </span>
      )}
    </div>
  );
};
