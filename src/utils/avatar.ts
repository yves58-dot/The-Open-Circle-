import { AvatarConfig } from '../types';

const ADJECTIVES = [
  'Courageous', 'Gentle', 'Resilient', 'Quiet', 'Hopeful',
  'Peaceful', 'Brave', 'Compassionate', 'Serene', 'Wisdom',
  'Patient', 'Kind', 'Sincere', 'Tender', 'Luminous',
  'Steady', 'Wandering', 'Reflective', 'Harmonious', 'Graceful'
];

const NOUNS = [
  'Fox', 'Mountain', 'River', 'Oak', 'Haven',
  'Willow', 'Sparrow', 'Meadow', 'Horizon', 'Harbor',
  'Beacon', 'Creek', 'Starlight', 'Forest', 'Valley',
  'Wave', 'Solace', 'Sanctuary', 'Pebble', 'Echo'
];

export function generateNickname(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const num = Math.floor(10 + Math.random() * 90);
  return `${adj}${noun}${num}`;
}

export const AVATAR_BG_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Emerald
  '#8B5CF6', // Purple
  '#F59E0B', // Amber
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#64748B', // Slate
];

export const AVATAR_ICONS: AvatarConfig['icon'][] = [
  'flower', 'tree', 'wave', 'star', 'moon', 'heart', 'sun', 'feather'
];

export function generateRandomAvatar(): AvatarConfig {
  return {
    bgColor: AVATAR_BG_COLORS[Math.floor(Math.random() * AVATAR_BG_COLORS.length)],
    shape: ['circle', 'square', 'hexagon'][Math.floor(Math.random() * 3)] as AvatarConfig['shape'],
    icon: AVATAR_ICONS[Math.floor(Math.random() * AVATAR_ICONS.length)]
  };
}
