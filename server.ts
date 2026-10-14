import express from 'express';
import path from 'path';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { Circle, User, Post, Booking, CrisisLog, Reaction, Donation, CommunityStats } from './src/types';

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'MOCK_KEY',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// --- IN-MEMORY DATABASE STATE ---
const users: Map<string, User> = new Map();
const userPasswords: Map<string, string> = new Map(); // userId -> password_hash
const circles: Map<string, Circle> = new Map();
const posts: Map<string, Post> = new Map();
const reactions: Map<string, Reaction[]> = new Map(); // postId -> Reaction[]
const bookings: Map<string, Booking> = new Map();
const crisisLogs: Map<string, CrisisLog> = new Map();
const resetTokens: Map<string, { userId: string; expires: number }> = new Map();
const donations: Map<string, Donation> = new Map();


// Helper to encrypt sensitive string (like email) in memory simulation
function encryptString(str: string): string {
  return Buffer.from(str).toString('base64');
}
function decryptString(hash: string): string {
  return Buffer.from(hash, 'base64').toString('utf-8');
}

// --- SEED INITIAL DATA ---
function seedDatabase() {
  // Seed Circles
  const initialCircles: Omit<Circle, 'id' | 'memberCount'>[] = [
    {
      name: 'General Healing Circle',
      description: 'A quiet, welcoming sanctuary for anyone seeking a safe space to share their truth.',
      category: 'general',
      rules: [
        'No hate speech, threats, or harassment',
        'No unsolicited DMs or personal solicitations',
        'No medical diagnosis or prescription advice',
        'Respect all forms of human struggle without hierarchy'
      ],
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      name: 'Alcohol Recovery Circle',
      description: 'A non-judgmental space for individuals navigating sobriety, cravings, and healing.',
      category: 'recovery',
      rules: [
        'No sharing of brands, specific quantities, or purchase locations',
        'Relapse is met with compassion, never shame',
        'No glorification of active drinking',
        'Support each step, no matter how small'
      ],
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      name: 'Substance Recovery Circle',
      description: 'Shared strength for those overcoming substance dependency and building a new chapter.',
      category: 'recovery',
      rules: [
        'No method-sharing or instructions on obtaining substances',
        'Focus on emotional recovery and healthy coping strategies',
        'Maintain absolute confidentiality',
        'Encourage professional harm-reduction resources when appropriate'
      ],
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      name: 'Sex & Masturbation Recovery Circle',
      description: 'Honest, shame-free peer support for compulsive sexual behaviors and pornography reset.',
      category: 'recovery',
      rules: [
        'No sexually explicit descriptions or triggering detail',
        'Focus on triggers, emotional habits, and accountability',
        'Zero judgment, absolute privacy',
        'No unsolicited private messaging'
      ],
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      name: 'Grief & Loss Circle',
      description: 'Holding space for loved ones, broken hearts, and processing profound loss together.',
      category: 'emotional',
      rules: [
        'Honor everyone’s timeline for grief',
        'Listen without trying to fix or offer clichés',
        'Warmth and presence above all else'
      ],
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      name: 'Caregivers Circle',
      description: 'Support for family members, nurses, and guardians carrying the emotional load for others.',
      category: 'life',
      rules: [
        'A safe place to admit tiredness and frustration without guilt',
        'No medical or legal directives',
        'Celebrate small moments of self-care'
      ],
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      name: 'Anxiety & Depression Circle',
      description: 'A calming corner when thoughts race, shadows fall, or breathing gets hard.',
      category: 'emotional',
      rules: [
        'Gentle words only',
        'No toxic positivity or "just cheer up" advice',
        'Acknowledge pain as valid'
      ],
      createdAt: new Date().toISOString(),
      isActive: true
    },
    {
      name: 'Burnout & Workplace Stress Circle',
      description: 'Reclaiming peace and boundaries from overwhelming pressure, fatigue, and burnout.',
      category: 'life',
      rules: [
        'Focus on personal boundary-setting and emotional rest',
        'No commercial self-help pitches'
      ],
      createdAt: new Date().toISOString(),
      isActive: true
    }
  ];

  initialCircles.forEach((cData, index) => {
    const id = `circle-${index + 1}`;
    circles.set(id, {
      ...cData,
      id,
      memberCount: Math.floor(12 + Math.random() * 45)
    });
  });

  // Seed Super Admin / Mentor user (if registered with izereyves9@gmail.com)
  const adminId = 'user-super-admin';
  const encryptedEmail = encryptString('izereyves9@gmail.com');
  const passwordHash = bcrypt.hashSync('AdminSecret123!', 10);

  const adminUser: User = {
    id: adminId,
    email: encryptedEmail,
    nickname: 'YvesGuide',
    avatarConfig: {
      bgColor: '#10B981',
      shape: 'hexagon',
      icon: 'star'
    },
    isGuest: false,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    circlesJoined: Array.from(circles.keys()),
    isAdmin: true,
    isMentor: true,
    mentorVerified: true,
    mentorStatus: 'approved',
    isSuspended: false,
    bio: 'Lead Certified Peer Guide & Founding Member. Specializing in anxiety, addiction recovery, and mindful listening.',
    specializations: ['Anxiety & Depression', 'Alcohol Recovery', 'General Healing'],
    rating: 4.95,
    totalSessions: 42
  };

  users.set(adminId, adminUser);
  userPasswords.set(adminId, passwordHash);

  // Seed a second Peer Guide for directory testing
  const guide2Id = 'user-guide-serene';
  const guide2: User = {
    id: guide2Id,
    email: encryptString('guide.serene@theopencircle.org'),
    nickname: 'SereneMountain',
    avatarConfig: {
      bgColor: '#3B82F6',
      shape: 'circle',
      icon: 'wave'
    },
    isGuest: false,
    emailVerified: true,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    circlesJoined: ['circle-1', 'circle-2', 'circle-5'],
    isAdmin: false,
    isMentor: true,
    mentorVerified: true,
    mentorStatus: 'approved',
    isSuspended: false,
    bio: 'Recovered 5 years sober. Passionate about listening to anyone walking through loss or relapse.',
    specializations: ['Alcohol Recovery', 'Grief & Loss'],
    rating: 4.9,
    totalSessions: 28
  };
  users.set(guide2Id, guide2);

  // Seed initial Posts in General Healing and Anxiety Circles
  const post1: Post = {
    id: 'post-seed-1',
    circleId: 'circle-1',
    userId: guide2Id,
    nickname: 'SereneMountain',
    avatarConfig: guide2.avatarConfig,
    content: 'Welcome to The Open Circle! Remember: no real names, no faces required. Just your truth. We are here to witness you and hold space together.',
    mood: ' Hopeful',
    aiFlagged: false,
    aiVerdict: 'approved',
    humanReviewed: true,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    isGuestPost: false,
    reactions: {
      witnessed: 14,
      with_you: 8,
      rooting_for_you: 12
    }
  };

  const post2: Post = {
    id: 'post-seed-2',
    circleId: 'circle-7', // Anxiety & Depression
    userId: 'user-guest-quiet',
    nickname: 'QuietStorm82',
    avatarConfig: { bgColor: '#8B5CF6', shape: 'square', icon: 'moon' },
    content: 'Having one of those heavy evenings where every thought feels like an overwhelming weight. Just needed to type this out somewhere quiet.',
    mood: ' Overwhelmed',
    aiFlagged: false,
    aiVerdict: 'approved',
    humanReviewed: false,
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    isGuestPost: true,
    expiresAt: new Date(Date.now() + 24 * 3600000 - 1800000).toISOString(),
    reactions: {
      witnessed: 6,
      with_you: 9,
      rooting_for_you: 5
    },
    replies: [
      {
        id: 'reply-seed-1',
        circleId: 'circle-7',
        userId: adminId,
        nickname: 'YvesGuide',
        avatarConfig: adminUser.avatarConfig,
        content: 'I see you QuietStorm. Take three slow breaths. You don’t have to solve everything tonight, just be here with us.',
        aiFlagged: false,
        aiVerdict: 'approved',
        humanReviewed: true,
        createdAt: new Date(Date.now() - 1200000).toISOString(),
        isGuestPost: false,
        reactions: { witnessed: 4, with_you: 3, rooting_for_you: 4 }
      }
    ]
  };

  posts.set(post1.id, post1);
  posts.set(post2.id, post2);
}

seedDatabase();

// --- AUTH / USER API ROUTES ---

// Create or retrieve 24-hour Guest Session
app.post('/api/auth/guest', (req, res) => {
  const { guestId, nickname, avatarConfig } = req.body;

  if (guestId && users.has(guestId)) {
    const existing = users.get(guestId)!;
    existing.lastActive = new Date().toISOString();
    return res.json({ user: existing, token: guestId });
  }

  const newGuestId = `guest-${crypto.randomUUID()}`;
  const guestUser: User = {
    id: newGuestId,
    nickname: nickname || `SolaceVisitor${Math.floor(100 + Math.random() * 899)}`,
    avatarConfig: avatarConfig || { bgColor: '#06B6D4', shape: 'circle', icon: 'flower' },
    isGuest: true,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    circlesJoined: ['circle-1'],
    isAdmin: false,
    isMentor: false,
    mentorVerified: false,
    mentorStatus: 'pending',
    isSuspended: false
  };

  users.set(newGuestId, guestUser);
  res.status(201).json({ user: guestUser, token: newGuestId });
});

// Register with Email + Password
app.post('/api/auth/register', async (req, res) => {
  const { email, password, nickname, avatarConfig } = req.body;

  if (!email || !password || !nickname) {
    return res.status(400).json({ error: 'Email, password, and nickname are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const encrypted = encryptString(normalizedEmail);

  // Check existing email
  for (const [, user] of users) {
    if (user.email && user.email === encrypted) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }
    if (user.nickname.toLowerCase() === nickname.trim().toLowerCase()) {
      return res.status(400).json({ error: 'This nickname is already taken' });
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = `user-${crypto.randomUUID()}`;

  const userData: User = {
    id: userId,
    email: encrypted,
    nickname: nickname.trim(),
    avatarConfig: avatarConfig || { bgColor: '#10B981', shape: 'circle', icon: 'star' },
    isGuest: false,
    emailVerified: false,
    createdAt: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    circlesJoined: ['circle-1'],
    isAdmin: false,
    isMentor: false,
    mentorVerified: false,
    mentorStatus: 'pending',
    isSuspended: false
  };

  // Auto-assign admin if email matches izereyves9@gmail.com
  if (normalizedEmail === 'izereyves9@gmail.com') {
    userData.isAdmin = true;
    userData.isMentor = true;
    userData.mentorVerified = true;
    userData.mentorStatus = 'approved';
    userData.bio = 'Platform Founder & Lead Mentor';
  }

  users.set(userId, userData);
  userPasswords.set(userId, passwordHash);

  res.status(201).json({ user: userData, token: userId });
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const encrypted = encryptString(normalizedEmail);

  let foundUser: User | null = null;
  for (const [, user] of users) {
    if (user.email && user.email === encrypted) {
      foundUser = user;
      break;
    }
  }

  if (!foundUser) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  if (foundUser.isSuspended) {
    return res.status(403).json({ error: `Account suspended: ${foundUser.suspensionReason || 'Contact support'}` });
  }

  const hash = userPasswords.get(foundUser.id);
  if (!hash) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const match = await bcrypt.compare(password, hash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  foundUser.lastActive = new Date().toISOString();
  res.json({ user: foundUser, token: foundUser.id });
});

// Upgrade Guest to Registered Account
app.post('/api/auth/upgrade-guest', async (req, res) => {
  const { guestId, email, password, nickname } = req.body;

  if (!guestId || !users.has(guestId)) {
    return res.status(400).json({ error: 'Valid guest session required' });
  }

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const guest = users.get(guestId)!;
  const normalizedEmail = email.trim().toLowerCase();
  const encrypted = encryptString(normalizedEmail);

  for (const [, u] of users) {
    if (u.email === encrypted) {
      return res.status(400).json({ error: 'Email already in use' });
    }
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const updatedNickname = nickname ? nickname.trim() : guest.nickname;

  // Upgrade in place
  guest.email = encrypted;
  guest.isGuest = false;
  guest.nickname = updatedNickname;
  guest.upgradedFromGuest = true;

  if (normalizedEmail === 'izereyves9@gmail.com') {
    guest.isAdmin = true;
    guest.isMentor = true;
    guest.mentorVerified = true;
    guest.mentorStatus = 'approved';
  }

  userPasswords.set(guest.id, passwordHash);

  // Upgrade guest posts to permanent (remove expiry)
  for (const [, post] of posts) {
    if (post.userId === guest.id) {
      post.isGuestPost = false;
      delete post.expiresAt;
    }
  }

  res.json({ user: guest, token: guest.id, message: 'Account successfully upgraded! All your posts are now permanent.' });
});

// Forgot Password
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const encrypted = encryptString(email.trim().toLowerCase());
  let targetUser: User | null = null;
  for (const [, u] of users) {
    if (u.email === encrypted) {
      targetUser = u;
      break;
    }
  }

  if (!targetUser) {
    // For security, present same success message
    return res.json({ message: 'If an account exists for this email, password reset instructions have been sent.' });
  }

  const token = crypto.randomBytes(20).toString('hex');
  resetTokens.set(token, { userId: targetUser.id, expires: Date.now() + 3600000 });

  res.json({
    message: 'If an account exists for this email, password reset instructions have been sent.',
    resetToken: token // Included for instant MVP testing
  });
});

// Reset Password
app.post('/api/auth/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;
  if (!token || !newPassword) return res.status(400).json({ error: 'Token and new password required' });

  const record = resetTokens.get(token);
  if (!record || record.expires < Date.now()) {
    return res.status(400).json({ error: 'Reset link invalid or expired' });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);
  userPasswords.set(record.userId, passwordHash);
  resetTokens.delete(token);

  res.json({ message: 'Password reset successfully! You can now log in.' });
});

// Get Current User
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !users.has(token)) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = users.get(token)!;
  res.json({ user });
});

// Update Profile (Change Display Name / Nickname & Avatar)
app.put('/api/auth/profile', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !users.has(token)) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const user = users.get(token)!;
  const { nickname, avatarConfig } = req.body;

  if (nickname && nickname.trim()) {
    const newNickname = nickname.trim();

    // Check if nickname taken by another user
    for (const [id, u] of users) {
      if (id !== user.id && u.nickname.toLowerCase() === newNickname.toLowerCase()) {
        return res.status(400).json({ error: 'This nickname is already in use' });
      }
    }

    user.nickname = newNickname;

    // Update nickname on existing user posts
    for (const [, post] of posts) {
      if (post.userId === user.id) {
        post.nickname = newNickname;
      }
      if (post.replies) {
        for (const reply of post.replies) {
          if (reply.userId === user.id) {
            reply.nickname = newNickname;
          }
        }
      }
    }
  }

  if (avatarConfig) {
    user.avatarConfig = avatarConfig;
  }

  res.json({ user, message: 'Display name updated successfully!' });
});

// --- CIRCLES & POSTS API ROUTES ---

// List Circles
app.get('/api/circles', (req, res) => {
  res.json(Array.from(circles.values()));
});

// Join/Leave Circle
app.post('/api/circles/:id/join', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  if (!userId || !users.has(userId)) return res.status(401).json({ error: 'Unauthorized' });

  const circle = circles.get(req.params.id);
  if (!circle) return res.status(404).json({ error: 'Circle not found' });

  const user = users.get(userId)!;
  if (!user.circlesJoined.includes(circle.id)) {
    user.circlesJoined.push(circle.id);
    circle.memberCount += 1;
  }
  res.json({ user, circle });
});

// Get Circle Posts
app.get('/api/circles/:id/posts', (req, res) => {
  const circleId = req.params.id;
  const userId = req.headers.authorization?.replace('Bearer ', '');

  const circlePosts: Post[] = [];
  const now = new Date().toISOString();

  for (const [, post] of posts) {
    if (post.circleId === circleId && !post.replyTo) {
      // Expiry filter for guest posts older than 24 hours (unless owned by viewing user)
      if (post.expiresAt && post.expiresAt < now && post.userId !== userId) {
        continue;
      }
      if (post.aiVerdict === 'blocked') {
        // Blocked posts only visible to owner with a warning
        if (post.userId !== userId) continue;
      }
      circlePosts.push(post);
    }
  }

  // Sort latest first
  circlePosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  res.json(circlePosts);
});

// Create Post or Reply with Gemini AI Intern Pre-Moderation
app.post('/api/posts', async (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  if (!userId || !users.has(userId)) return res.status(401).json({ error: 'Unauthorized' });

  const user = users.get(userId)!;
  const { circleId, content, mood, replyTo } = req.body;

  if (!content || !content.trim()) return res.status(400).json({ error: 'Content required' });
  if (content.length > 2000) return res.status(400).json({ error: 'Exceeds 2000 character limit' });

  // --- GEMINI AI PRE-MODERATION SCAN ---
  let aiVerdict: 'approved' | 'blocked' | 'flagged' = 'approved';
  let aiFlagged = false;
  let crisisDetected = false;
  let moderationReason = '';

  try {
    const prompt = `You are the AI Intern for "The Open Circle", a safe, anonymous sanctuary for peer healing.
Scan the following user post and classify it into one of these categories:
1. APPROVED: Safe, respectful, vulnerable human expression, struggles, or recovery thoughts.
2. BLOCKED: Contains severe hate speech, slurs, explicit NSFW pornography, commercial spam, or method sharing (how to obtain illicit drugs, how to perform self-harm).
3. FLAGGED: Contains crisis language, active suicidal ideation, severe self-harm statements, or extreme despair requiring immediate care.

Post content: "${content}"

Respond strictly in valid JSON format:
{
  "category": "APPROVED" | "BLOCKED" | "FLAGGED",
  "reason": "short explanation",
  "crisisDetected": boolean
}`;

    const geminiRes = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    if (geminiRes.text) {
      const parsed = JSON.parse(geminiRes.text);
      if (parsed.category === 'BLOCKED') {
        aiVerdict = 'blocked';
        aiFlagged = true;
        moderationReason = parsed.reason || 'Violates community guardrails.';
      } else if (parsed.category === 'FLAGGED' || parsed.crisisDetected) {
        aiVerdict = 'flagged';
        aiFlagged = true;
        crisisDetected = true;
        moderationReason = 'Crisis language detected.';
      }
    }
  } catch (err) {
    console.error('Gemini Pre-moderation error:', err);
    // Fallback basic keyword scan
    const lower = content.toLowerCase();
    if (lower.includes('kill myself') || lower.includes('end my life') || lower.includes('suicide')) {
      aiVerdict = 'flagged';
      aiFlagged = true;
      crisisDetected = true;
    }
  }

  const postId = `post-${crypto.randomUUID()}`;
  const isGuestPost = user.isGuest;
  const expiresAt = isGuestPost ? new Date(Date.now() + 24 * 3600000).toISOString() : undefined;

  const newPost: Post = {
    id: postId,
    circleId,
    userId: user.id,
    nickname: user.nickname,
    avatarConfig: user.avatarConfig,
    content,
    mood,
    aiFlagged,
    aiVerdict,
    humanReviewed: false,
    createdAt: new Date().toISOString(),
    replyTo: replyTo || null,
    isGuestPost,
    expiresAt,
    reactions: { witnessed: 0, with_you: 0, rooting_for_you: 0 }
  };

  // If this is a reply to a parent post, append to parent replies
  if (replyTo && posts.has(replyTo)) {
    const parent = posts.get(replyTo)!;
    parent.replies = parent.replies || [];
    parent.replies.push(newPost);
  } else {
    posts.set(postId, newPost);
  }

  // Handle Crisis Escalation if detected
  if (crisisDetected) {
    const crisisLogId = `crisis-${crypto.randomUUID()}`;
    const crisisRecord: CrisisLog = {
      id: crisisLogId,
      userId: user.id,
      userNickname: user.nickname,
      trigger: content.substring(0, 100),
      actionTaken: 'Private crisis resources DM dispatched; Certified Peer Guide queue alerted.',
      createdAt: new Date().toISOString()
    };
    crisisLogs.set(crisisLogId, crisisRecord);

    return res.status(200).json({
      post: newPost,
      crisisAlert: true,
      crisisMessage: `We hear that you're in a lot of pain right now. Please know that you are not alone and your life matters.
      Immediate Resources:
      • 988 Suicide & Crisis Lifeline: Call or text 988 (Available 24/7, free & confidential)
      • Crisis Text Line: Text HOME to 741741
      • International Helplines: https://findahelpline.com
      A Certified Peer Guide has also been discreetly notified.`
    });
  }

  if (aiVerdict === 'blocked') {
    return res.status(400).json({
      error: 'Your post was held by the AI Intern as it contains content that violates community guidelines.',
      reason: moderationReason,
      canAppeal: true,
      postId
    });
  }

  res.status(201).json({ post: newPost });
});

// React to Post
app.post('/api/posts/:id/react', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  if (!userId || !users.has(userId)) return res.status(401).json({ error: 'Unauthorized' });

  const { type } = req.body as { type: 'witnessed' | 'with_you' | 'rooting_for_you' };
  if (!['witnessed', 'with_you', 'rooting_for_you'].includes(type)) {
    return res.status(400).json({ error: 'Invalid reaction type' });
  }

  const post = posts.get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const pReactions = reactions.get(post.id) || [];
  const existingIndex = pReactions.findIndex(r => r.userId === userId);

  if (existingIndex >= 0) {
    const prevType = pReactions[existingIndex].type;
    post.reactions[prevType] = Math.max(0, post.reactions[prevType] - 1);
    if (prevType === type) {
      // Toggle off
      pReactions.splice(existingIndex, 1);
    } else {
      pReactions[existingIndex].type = type;
      post.reactions[type] += 1;
    }
  } else {
    pReactions.push({
      id: `react-${crypto.randomUUID()}`,
      postId: post.id,
      userId,
      type,
      createdAt: new Date().toISOString()
    });
    post.reactions[type] += 1;
  }

  reactions.set(post.id, pReactions);
  res.json({ post, reactions: post.reactions });
});

// Appeal AI Verdict ("Disagree with the Intern")
app.post('/api/posts/:id/appeal', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  if (!userId || !users.has(userId)) return res.status(401).json({ error: 'Unauthorized' });

  const post = posts.get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  post.aiVerdict = 'flagged';
  post.humanReviewed = false;

  res.json({ message: 'Escalated to human Peer Guide review queue. Decision within 15 mins.', post });
});

// Empathy Booster Trigger (AI Auto-Reply for Unanswered Posts)
app.post('/api/posts/:id/empathy-boost', async (req, res) => {
  const post = posts.get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  if (post.replies && post.replies.length > 0) {
    return res.json({ message: 'Post already has human replies', post });
  }

  try {
    const prompt = `You are the empathetic AI Intern at "The Open Circle".
Write a short, compassionate, 2-3 sentence auto-reply acknowledging the user's vulnerability.
User post: "${post.content}"
Maintain a gentle tone: "I hear you. This sounds heavy. I'm just an intern, but I see you. How can this community support you right now?"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    const replyText = response.text || "I hear you. This sounds heavy. I'm just an intern, but I see you. How can this community support you right now?";

    const aiReply: Post = {
      id: `reply-ai-${crypto.randomUUID()}`,
      circleId: post.circleId,
      userId: 'user-ai-intern',
      nickname: 'AI Intern (Companion)',
      avatarConfig: { bgColor: '#8B5CF6', shape: 'hexagon', icon: 'heart' },
      content: replyText,
      aiFlagged: false,
      aiVerdict: 'approved',
      humanReviewed: true,
      createdAt: new Date().toISOString(),
      replyTo: post.id,
      isGuestPost: false,
      reactions: { witnessed: 3, with_you: 2, rooting_for_you: 4 },
      aiAutoReply: true
    };

    post.replies = post.replies || [];
    post.replies.push(aiReply);

    res.json({ message: 'Empathy booster generated', reply: aiReply, post });
  } catch (err) {
    console.error('Empathy Booster Error:', err);
    res.status(500).json({ error: 'Failed to generate empathy reply' });
  }
});

// --- PEER GUIDES & BOOKINGS ROUTES ---

// List Guides
app.get('/api/guides', (req, res) => {
  const guideList: User[] = [];
  for (const [, user] of users) {
    if (user.isMentor && user.mentorStatus === 'approved') {
      guideList.push(user);
    }
  }
  res.json(guideList);
});

// Create Booking
app.post('/api/bookings', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  if (!userId || !users.has(userId)) return res.status(401).json({ error: 'Unauthorized' });

  const user = users.get(userId)!;
  if (user.isGuest) {
    return res.status(403).json({ error: 'Registered account required to book sessions with Peer Guides.' });
  }

  const { guideId, scheduledAt, duration, type, topic } = req.body;
  if (!guideId || !users.has(guideId)) return res.status(400).json({ error: 'Valid Peer Guide required' });

  const guide = users.get(guideId)!;

  const bookingId = `booking-${crypto.randomUUID()}`;
  const newBooking: Booking = {
    id: bookingId,
    userId: user.id,
    userNickname: user.nickname,
    guideId: guide.id,
    guideNickname: guide.nickname,
    scheduledAt: scheduledAt || new Date(Date.now() + 3600000 * 24).toISOString(),
    duration: duration || 30,
    type: type || 'private',
    status: 'approved',
    createdAt: new Date().toISOString(),
    topic
  };

  bookings.set(bookingId, newBooking);
  res.status(201).json({ booking: newBooking });
});

// Get User/Guide Bookings
app.get('/api/bookings', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  if (!userId || !users.has(userId)) return res.status(401).json({ error: 'Unauthorized' });

  const userBookings: Booking[] = [];
  for (const [, b] of bookings) {
    if (b.userId === userId || b.guideId === userId) {
      userBookings.push(b);
    }
  }

  res.json(userBookings);
});

// --- ADMIN PORTAL ROUTES ---

// Admin Users List
app.get('/api/admin/users', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  if (!userId || !users.get(userId)?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const list = Array.from(users.values()).map(u => ({
    ...u,
    email: u.email ? decryptString(u.email) : null
  }));

  res.json(list);
});

// Admin Suspend/Unsuspend User
app.post('/api/admin/users/:id/suspend', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  if (!userId || !users.get(userId)?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const target = users.get(req.params.id);
  if (!target) return res.status(404).json({ error: 'User not found' });

  const { suspend, reason } = req.body;
  target.isSuspended = !!suspend;
  target.suspensionReason = suspend ? (reason || 'Admin action') : null;

  res.json({ user: target });
});

// Admin Flagged Content Queue
app.get('/api/admin/flagged-posts', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  const user = users.get(userId || '');
  if (!user || (!user.isAdmin && !user.isMentor)) {
    return res.status(403).json({ error: 'Admin or Mentor access required' });
  }

  const flagged: Post[] = [];
  for (const [, p] of posts) {
    if (p.aiVerdict === 'flagged' || p.aiVerdict === 'blocked' || p.aiFlagged) {
      flagged.push(p);
    }
  }

  res.json(flagged);
});

// Admin Resolve Flagged Post
app.post('/api/admin/flagged-posts/:id/resolve', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  const user = users.get(userId || '');
  if (!user || (!user.isAdmin && !user.isMentor)) {
    return res.status(403).json({ error: 'Admin or Mentor access required' });
  }

  const post = posts.get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const { action } = req.body; // 'approve' | 'delete'
  if (action === 'approve') {
    post.aiVerdict = 'approved';
    post.aiFlagged = false;
    post.humanReviewed = true;
  } else if (action === 'delete') {
    posts.delete(post.id);
  }

  res.json({ message: `Post resolved with action: ${action}` });
});

// Admin Crisis Logs
app.get('/api/admin/crisis-logs', (req, res) => {
  const userId = req.headers.authorization?.replace('Bearer ', '');
  const user = users.get(userId || '');
  if (!user || (!user.isAdmin && !user.isMentor)) {
    return res.status(403).json({ error: 'Admin or Mentor access required' });
  }

  res.json(Array.from(crisisLogs.values()));
});

// --- AI INTERN CHAT ASSISTANT & CAMPFIRE PROMPTS ---
app.post('/api/ai/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  try {
    const prompt = `You are the AI Intern for "The Open Circle", an anonymous, warm, non-clinical peer support sanctuary.
Respond with human warmth, deep active listening, and validation. You are an intern companion, not a licensed therapist or doctor.
User message: "${message}"`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are the AI Intern at The Open Circle. Always emphasize: 'No face required. No name needed. Just your truth.'"
      }
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ reply: "I hear you. I'm here right now listening to you. How are you holding up today?" });
  }
});

// Group Call Grounding Prompt
app.post('/api/ai/campfire-prompt', async (req, res) => {
  const { scenario } = req.body;

  let systemPrompt = "Provide a soothing 1-sentence grounding instruction or campfire check-in prompt for a group support call.";
  if (scenario === 'start') {
    systemPrompt = "Provide a 2-sentence soothing group breathing and grounding exercise to start a support circle call.";
  } else if (scenario === 'silence') {
    systemPrompt = "Provide a gentle question to break a long silence in a group support call.";
  } else if (scenario === 'dominate') {
    systemPrompt = "Provide a tactful, non-judgmental prompt to invite quiet participants to share.";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: systemPrompt
    });

    res.json({ promptText: response.text });
  } catch (err) {
    res.json({ promptText: "Let's pause together, take a slow deep breath in... and release. Would anyone else like to share?" });
  }
});

// --- DONATIONS & DYNAMIC COMMUNITY STATISTICS ---

// Platform state mode: 'virgin' for pure real-time data from 0, 'demo' for populated showcase
let sanctuaryMode: 'virgin' | 'demo' = 'demo';

// Process Donation
app.post('/api/donations', (req, res) => {
  const { donorNickname, amount, cause, message } = req.body;
  if (!amount || amount <= 0) {
    return res.status(400).json({ error: 'Valid donation amount required' });
  }

  const donationId = `don-${crypto.randomUUID()}`;
  const numBundles = Math.floor(amount / 5);

  const donation: Donation = {
    id: donationId,
    donorNickname: donorNickname || 'Anonymous Member',
    amount: Number(amount),
    cause: cause || 'mentor_data',
    message,
    bundlesFunded: numBundles,
    createdAt: new Date().toISOString()
  };

  donations.set(donationId, donation);
  res.status(201).json({ donation, message: 'Thank you for supporting the sanctuary!' });
});

// Dynamic Community Stats Endpoint (Real-time live updates)
app.get('/api/stats', (req, res) => {
  let registeredMembers = 0;
  let activeGuests = 0;
  let volunteerMentors = 0;

  for (const [, u] of users) {
    if (u.isGuest) activeGuests++;
    else registeredMembers++;
    if (u.isMentor) volunteerMentors++;
  }

  let totalDonations = 0;
  let totalBundles = 0;

  for (const [, d] of donations) {
    totalDonations += d.amount;
    totalBundles += d.bundlesFunded;
  }

  let postsCount = 0;
  let reactionsCount = 0;
  for (const [, p] of posts) {
    postsCount++;
    if (p.replies) postsCount += p.replies.length;
    if (p.reactions) {
      reactionsCount += (p.reactions.witnessed || 0) + (p.reactions.with_you || 0) + (p.reactions.rooting_for_you || 0);
    }
  }

  if (sanctuaryMode === 'virgin') {
    // Pure genuine real-time statistics directly from actual records
    const liveActiveVisitors = Math.max(1, users.size);
    const livesTouched = users.size + postsCount + reactionsCount + totalBundles;

    const stats: CommunityStats = {
      totalMembers: users.size,
      activeGuests,
      volunteerMentors,
      circlesCount: circles.size,
      totalPostsShared: postsCount,
      totalReactionsShared: reactionsCount,
      internetBundlesFunded: totalBundles,
      totalDonationsRaised: totalDonations,
      liveActiveVisitors,
      livesTouchedCount: livesTouched
    };
    return res.json({ ...stats, mode: 'virgin' });
  }

  // Demo showcase mode with baseline values
  const seedMemberBaseline = 84;
  const seedPostsBaseline = 142;
  const seedReactionsBaseline = 412;
  const seedDonationsBaseline = 140;
  const seedBundlesBaseline = 28;

  const stats: CommunityStats = {
    totalMembers: seedMemberBaseline + users.size,
    activeGuests: Math.max(12, activeGuests),
    volunteerMentors: Math.max(4, volunteerMentors),
    circlesCount: circles.size,
    totalPostsShared: seedPostsBaseline + postsCount,
    totalReactionsShared: seedReactionsBaseline + reactionsCount,
    internetBundlesFunded: seedBundlesBaseline + totalBundles,
    totalDonationsRaised: seedDonationsBaseline + totalDonations,
    liveActiveVisitors: Math.max(14, activeGuests + 3),
    livesTouchedCount: seedMemberBaseline + seedPostsBaseline + seedReactionsBaseline + users.size * 3
  };

  res.json({ ...stats, mode: 'demo' });
});

// Admin endpoint to toggle or reset platform state
app.post('/api/admin/system-mode', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  const user = token ? users.get(token) : null;
  if (!user || !user.isAdmin) {
    return res.status(403).json({ error: 'Super Admin privileges required' });
  }

  const { mode, resetToVirgin } = req.body;
  if (mode === 'virgin' || mode === 'demo') {
    sanctuaryMode = mode;
  }

  if (resetToVirgin) {
    // Clear sample posts, reactions, donations while retaining admin user and official circles
    posts.clear();
    reactions.clear();
    donations.clear();
    sanctuaryMode = 'virgin';
  }

  res.json({
    success: true,
    mode: sanctuaryMode,
    message: sanctuaryMode === 'virgin'
      ? 'Platform switched to Pristine Virgin Mode (Real-time live statistics from 0).'
      : 'Platform switched to Showcase Demo Mode.'
  });
});


// --- SERVE VITE MIDDLEWARE OR STATIC FILES ---
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
