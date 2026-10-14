export interface AvatarConfig {
  bgColor: string;
  shape: 'circle' | 'square' | 'hexagon';
  icon: 'flower' | 'tree' | 'wave' | 'star' | 'moon' | 'heart' | 'sun' | 'feather';
}

export interface User {
  id: string;
  email?: string | null;
  nickname: string;
  avatarConfig: AvatarConfig;
  isGuest: boolean;
  emailVerified?: boolean;
  createdAt: string;
  lastActive: string;
  circlesJoined: string[];
  isAdmin: boolean;
  isMentor: boolean;
  mentorVerified: boolean;
  mentorStatus: 'pending' | 'approved' | 'rejected' | 'suspended';
  isSuspended: boolean;
  suspensionReason?: string | null;
  upgradedFromGuest?: boolean;
  guestCreatedAt?: string | null;
  bio?: string;
  specializations?: string[];
  rating?: number;
  totalSessions?: number;
}

export interface Circle {
  id: string;
  name: string;
  description: string;
  category: 'recovery' | 'emotional' | 'life' | 'general';
  rules: string[];
  assignedGuideId?: string | null;
  assignedGuideName?: string | null;
  createdAt: string;
  isActive: boolean;
  memberCount: number;
}

export interface Reaction {
  id: string;
  postId: string;
  userId: string;
  type: 'witnessed' | 'with_you' | 'rooting_for_you';
  createdAt: string;
}

export interface Post {
  id: string;
  circleId: string;
  userId: string;
  nickname: string;
  avatarConfig: AvatarConfig;
  content: string;
  mood?: string;
  aiFlagged: boolean;
  aiVerdict: 'approved' | 'blocked' | 'flagged';
  humanReviewed: boolean;
  createdAt: string;
  replyTo?: string | null;
  isGuestPost: boolean;
  expiresAt?: string | null;
  reactions: {
    witnessed: number;
    with_you: number;
    rooting_for_you: number;
  };
  userReactions?: Record<string, 'witnessed' | 'with_you' | 'rooting_for_you'>;
  replies?: Post[];
  aiAutoReply?: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  userNickname: string;
  guideId: string;
  guideNickname: string;
  circleId?: string;
  scheduledAt: string;
  duration: number; // in minutes
  type: 'private' | 'public';
  status: 'pending' | 'approved' | 'completed' | 'cancelled';
  createdAt: string;
  topic?: string;
}

export interface CrisisLog {
  id: string;
  userId: string;
  userNickname: string;
  trigger: string;
  actionTaken: string;
  guideResponse?: string;
  resolvedAt?: string | null;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  crisisResourcesShown?: boolean;
}

export interface Donation {
  id: string;
  donorNickname: string;
  amount: number;
  cause: 'mentor_data' | 'hardship_pool' | 'general';
  message?: string;
  bundlesFunded: number;
  createdAt: string;
}

export interface CommunityStats {
  totalMembers: number;
  activeGuests: number;
  volunteerMentors: number;
  circlesCount: number;
  totalPostsShared: number;
  totalReactionsShared: number;
  internetBundlesFunded: number;
  totalDonationsRaised: number;
  liveActiveVisitors: number;
  livesTouchedCount: number;
}

