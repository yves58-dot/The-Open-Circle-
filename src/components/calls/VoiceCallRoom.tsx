import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { UserAvatar } from '../shared/UserAvatar';
import { Mic, MicOff, Hand, Volume2, Users, Sparkles, PhoneOff, Radio, Play, Heart } from 'lucide-react';

interface VoiceCallRoomProps {
  roomName?: string;
  isGroupCampfire?: boolean;
}

export const VoiceCallRoom: React.FC<VoiceCallRoomProps> = ({
  roomName = 'General Recovery Campfire',
  isGroupCampfire = true
}) => {
  const { user } = useAuth();
  const [isInCall, setIsInCall] = useState<boolean>(false);
  const [isMuted, setIsInMuted] = useState<boolean>(true);
  const [handRaised, setHandRaised] = useState<boolean>(false);
  const [speakingUser, setSpeakingUser] = useState<string>('YvesGuide');
  const [aiGroundingPrompt, setAiGroundingPrompt] = useState<string>(
    'Before we begin, let us take three deep breaths together. Breathe in... and gently release.'
  );

  // Simulated participants for campfire
  const [participants, setParticipants] = useState([
    { id: '1', nickname: 'YvesGuide', avatarConfig: { bgColor: '#10B981', shape: 'hexagon', icon: 'star' }, isGuide: true, isSpeaking: true },
    { id: '2', nickname: 'QuietStorm82', avatarConfig: { bgColor: '#8B5CF6', shape: 'square', icon: 'moon' }, isSpeaking: false },
    { id: '3', nickname: 'CourageousFox14', avatarConfig: { bgColor: '#F59E0B', shape: 'circle', icon: 'feather' }, isSpeaking: false },
    { id: '4', nickname: 'RiverPebble9', avatarConfig: { bgColor: '#3B82F6', shape: 'circle', icon: 'wave' }, isSpeaking: false },
    { id: '5', nickname: 'AI Intern (Facilitator)', avatarConfig: { bgColor: '#8B5CF6', shape: 'hexagon', icon: 'heart' }, isAi: true, isSpeaking: false }
  ]);

  // Simulate speaking rotation
  useEffect(() => {
    if (!isInCall) return;

    const interval = setInterval(() => {
      const speakers = ['YvesGuide', 'QuietStorm82', 'CourageousFox14', 'AI Intern (Facilitator)'];
      const nextSpeaker = speakers[Math.floor(Math.random() * speakers.length)];
      setSpeakingUser(nextSpeaker);

      setParticipants(prev =>
        prev.map(p => ({
          ...p,
          isSpeaking: p.nickname === nextSpeaker
        }))
      );
    }, 6000);

    return () => clearInterval(interval);
  }, [isInCall]);

  const fetchGroundingPrompt = async (scenario: string) => {
    try {
      const res = await fetch('/api/ai/campfire-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario })
      });
      if (res.ok) {
        const data = await res.json();
        setAiGroundingPrompt(data.promptText);
      }
    } catch (err) {
      console.error('Grounding prompt error:', err);
    }
  };

  return (
    <div className="bg-white border border-[#F0EEEA] rounded-3xl p-6 text-[#2D2D2D] shadow-sm relative overflow-hidden">
      
      {/* Room Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#F0EEEA]">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F5F3EF] border border-[#E5E2DC] rounded-2xl text-[#7C9082]">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#7C9082] bg-[#F5F3EF] px-2 py-0.5 rounded-full border border-[#E5E2DC]">
                {isGroupCampfire ? 'Live Campfire Circle' : 'Private 1-on-1 Call'}
              </span>
              <span className="text-[10px] text-[#8D8881]">Audio Only • No Video</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-[#2D2D2D] mt-0.5">{roomName}</h3>
          </div>
        </div>

        {!isInCall ? (
          <button
            onClick={() => setIsInCall(true)}
            className="px-6 py-2.5 bg-[#7C9082] hover:bg-[#687C6E] text-white font-semibold text-xs rounded-xl shadow-sm shadow-[#7C9082]/20 flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> Join Call
          </button>
        ) : (
          <button
            onClick={() => setIsInCall(false)}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-sm flex items-center gap-2"
          >
            <PhoneOff className="w-4 h-4" /> Leave Call
          </button>
        )}
      </div>

      {/* AI Grounding Banner */}
      <div className="my-4 p-3.5 bg-purple-50/80 border border-purple-200 rounded-2xl text-purple-900 text-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-purple-600 shrink-0" />
          <span><strong className="text-purple-900">AI Facilitator Prompt:</strong> "{aiGroundingPrompt}"</span>
        </div>
        <button
          onClick={() => fetchGroundingPrompt('silence')}
          className="text-[10px] bg-purple-100 hover:bg-purple-200 text-purple-800 px-2.5 py-1 rounded-lg border border-purple-300 font-semibold shrink-0"
        >
          New Prompt
        </button>
      </div>

      {/* Circular Campfire Stage */}
      <div className="min-h-[300px] bg-[#FBF9F7] rounded-3xl border border-[#F0EEEA] p-6 flex flex-col items-center justify-center relative overflow-hidden my-4">
        
        {/* Glow Effects */}
        <div className="absolute w-40 h-40 bg-[#7C9082]/10 rounded-full blur-3xl pointer-events-none" />

        {!isInCall ? (
          <div className="text-center text-[#8D8881] space-y-2 max-w-sm">
            <Radio className="w-12 h-12 text-[#A09B95] mx-auto" />
            <h4 className="font-serif font-bold text-[#2D2D2D] text-base">Campfire is Live</h4>
            <p className="text-xs text-[#6B665F]">
              Join as a quiet listener or raise your hand to speak. Completely anonymous voice space.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-lg">
            
            {/* Circular Participant Avatars */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-6 justify-items-center items-center py-6">
              {participants.map((p) => {
                const isSpeaking = p.isSpeaking;
                return (
                  <div key={p.id} className="flex flex-col items-center gap-2 text-center group">
                    <div className={`relative rounded-full transition-all duration-300 ${
                      isSpeaking ? 'ring-4 ring-[#7C9082] ring-offset-2 ring-offset-[#FBF9F7] scale-105' : 'opacity-80'
                    }`}>
                      <UserAvatar config={p.avatarConfig as any} size="lg" isGuide={p.isGuide} />
                      {isSpeaking && (
                        <span className="absolute -top-1 -right-1 bg-[#7C9082] text-white p-1 rounded-full animate-bounce shadow-sm">
                          <Volume2 size={12} />
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-[#2D2D2D] truncate max-w-[90px]">
                      {p.nickname}
                    </span>
                  </div>
                );
              })}

              {/* Current Viewing User in Room */}
              {user && (
                <div className="flex flex-col items-center gap-2 text-center">
                  <div className={`relative rounded-full transition-all duration-300 ${
                    !isMuted ? 'ring-4 ring-[#7C9082] ring-offset-2 ring-offset-[#FBF9F7] scale-105' : 'opacity-90'
                  }`}>
                    <UserAvatar config={user.avatarConfig} size="lg" isGuide={user.isMentor} />
                    {!isMuted && (
                      <span className="absolute -top-1 -right-1 bg-[#7C9082] text-white p-1 rounded-full">
                        <Volume2 size={12} />
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-bold text-[#7C9082] truncate max-w-[90px]">
                    You ({user.nickname})
                  </span>
                </div>
              )}
            </div>

            {/* Currently Speaking Indicator */}
            <div className="text-center pt-2">
              <span className="text-xs text-[#7C9082] font-semibold inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full border border-[#EBE8E4] shadow-sm">
                <Volume2 className="w-3.5 h-3.5 animate-pulse" /> Currently Speaking: {speakingUser}
              </span>
            </div>

          </div>
        )}
      </div>

      {/* Call Controls Bar */}
      {isInCall && (
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-[#F0EEEA]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsInMuted(!isMuted)}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                isMuted
                  ? 'bg-[#F5F3EF] border-[#EBE8E4] text-[#6B665F] hover:bg-[#EBE8E4]'
                  : 'bg-[#7C9082] border-[#7C9082] text-white shadow-sm'
              }`}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              <span>{isMuted ? 'Muted' : 'Unmuted'}</span>
            </button>

            <button
              onClick={() => setHandRaised(!handRaised)}
              className={`p-3 rounded-2xl border text-xs font-semibold flex items-center gap-2 transition-colors ${
                handRaised
                  ? 'bg-amber-600 border-amber-600 text-white shadow-sm'
                  : 'bg-[#F5F3EF] border-[#EBE8E4] text-[#6B665F] hover:bg-[#EBE8E4]'
              }`}
            >
              <Hand className="w-4 h-4" />
              <span>{handRaised ? 'Hand Raised' : 'Raise Hand'}</span>
            </button>
          </div>

          <div className="text-xs text-[#8D8881] flex items-center gap-2 font-medium">
            <Users className="w-4 h-4 text-[#7C9082]" />
            <span>{participants.length + 1} Participants</span>
          </div>
        </div>
      )}

    </div>
  );
};
