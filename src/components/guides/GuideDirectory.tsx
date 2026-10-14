import React, { useState, useEffect } from 'react';
import { User, Booking } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { UserAvatar } from '../shared/UserAvatar';
import { Shield, Star, Calendar, Clock, CheckCircle2, HeartHandshake, UserX, Sparkles } from 'lucide-react';

interface GuideDirectoryProps {
  onOpenAuthModal: (mode: 'login' | 'register' | 'upgrade' | 'forgot') => void;
}

export const GuideDirectory: React.FC<GuideDirectoryProps> = ({ onOpenAuthModal }) => {
  const { user, token } = useAuth();
  const [guides, setGuides] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedGuide, setSelectedGuide] = useState<User | null>(null);
  
  // Booking Form State
  const [scheduledAt, setScheduledAt] = useState<string>('');
  const [sessionType, setSessionType] = useState<'private' | 'public'>('private');
  const [topic, setTopic] = useState<string>('');
  const [bookingSuccess, setBookingSuccess] = useState<Booking | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const fetchGuides = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/guides');
      if (res.ok) {
        const data = await res.json();
        setGuides(data);
      }
    } catch (err) {
      console.error('Failed to fetch guides:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, []);

  const handleBookSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.isGuest) {
      onOpenAuthModal('upgrade');
      return;
    }
    if (!selectedGuide) return;

    setBookingError(null);
    setBookingSuccess(null);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          guideId: selectedGuide.id,
          scheduledAt: scheduledAt || new Date(Date.now() + 3600000 * 24).toISOString(),
          duration: 30,
          type: sessionType,
          topic
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setBookingError(data.error || 'Failed to book session');
        return;
      }

      setBookingSuccess(data.booking);
    } catch (err) {
      setBookingError('Network error while booking session');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white border border-[#F0EEEA] rounded-3xl p-6 text-[#2D2D2D] shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-[#F5F3EF] border border-[#E5E2DC] rounded-2xl text-[#7C9082]">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs uppercase font-bold text-[#7C9082] tracking-wider">
              Mentorship, Not Therapy
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2D2D2D]">
              Certified Peer Guides
            </h2>
          </div>
        </div>
        <p className="text-sm text-[#6B665F] max-w-3xl leading-relaxed mt-2">
          Vetted mentors with lived experience in recovery, grief, and emotional healing.
          No clinical judgment. Just a warm, human hand to hold while you find your footing.
        </p>

        <div className="mt-4 p-3 bg-[#FBF9F7] border border-[#F0EEEA] rounded-2xl text-xs text-[#6B665F] flex items-start gap-2">
          <Shield className="w-4 h-4 text-[#7C9082] shrink-0 mt-0.5" />
          <span>
            <strong className="text-[#2D2D2D]">Medical Disclaimer:</strong> Peer Guides provide active listening and shared support. They do not diagnose, treat, or prescribe medical directives.
          </span>
        </div>
      </div>

      {/* Guide Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-2 text-center py-10 text-[#8D8881]">
            Loading Certified Peer Guides...
          </div>
        ) : guides.length === 0 ? (
          <div className="col-span-2 text-center py-10 text-[#8D8881]">
            No active peer guides available at this moment.
          </div>
        ) : (
          guides.map(guide => (
            <div
              key={guide.id}
              className="bg-white border border-[#F0EEEA] rounded-3xl p-5 text-[#2D2D2D] shadow-sm flex flex-col justify-between hover:border-[#E5E2DC] transition-colors"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <UserAvatar config={guide.avatarConfig} size="lg" isGuide={true} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-serif font-bold text-base text-[#2D2D2D]">
                          {guide.nickname}
                        </h3>
                        <span className="text-[10px] bg-[#F5F3EF] text-[#7C9082] px-2 py-0.5 rounded-full border border-[#E5E2DC] font-semibold">
                          Verified Guide
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#8D8881] mt-0.5">
                        <span className="flex items-center gap-1 text-amber-600 font-semibold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {guide.rating || 4.9}
                        </span>
                        <span>•</span>
                        <span>{guide.totalSessions || 15}+ Sessions</span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#6B665F] leading-relaxed mb-4">
                  {guide.bio || 'Vetted Certified Peer Guide ready to listen with empathy and compassion.'}
                </p>

                {/* Specializations */}
                {guide.specializations && guide.specializations.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 mb-4">
                    {guide.specializations.map((spec, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] bg-[#F5F3EF] text-[#6B665F] px-2.5 py-1 rounded-lg border border-[#EBE8E4] font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#F0EEEA] flex items-center justify-between">
                <span className="text-[11px] text-[#8D8881] flex items-center gap-1 font-medium">
                  <Clock className="w-3.5 h-3.5 text-[#7C9082]" /> 30-min Audio Session
                </span>
                <button
                  onClick={() => {
                    setSelectedGuide(guide);
                    setBookingSuccess(null);
                    setBookingError(null);
                  }}
                  className="px-4 py-2 bg-[#7C9082] hover:bg-[#687C6E] text-white text-xs font-semibold rounded-xl shadow-sm shadow-[#7C9082]/20 transition-colors"
                >
                  Book 1-on-1 Call
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Booking Modal */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 bg-[#2D2D2D]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E2DC] rounded-3xl max-w-md w-full p-6 text-[#2D2D2D] shadow-2xl relative">
            
            <button
              onClick={() => setSelectedGuide(null)}
              className="absolute top-4 right-4 text-[#8D8881] hover:text-[#2D2D2D] p-1 rounded-full hover:bg-[#F5F3EF]"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <UserAvatar config={selectedGuide.avatarConfig} size="md" isGuide={true} />
              <div>
                <h3 className="font-serif text-lg font-bold">Book Call with {selectedGuide.nickname}</h3>
                <p className="text-xs text-[#8D8881]">30-Minute Audio Call • End-to-End Encrypted</p>
              </div>
            </div>

            {user?.isGuest && (
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs mb-4">
                <p className="font-semibold">Account Required for Peer Bookings</p>
                <p className="mt-0.5">Please sign up or upgrade your guest session to schedule 1-on-1 calls with mentors.</p>
                <button
                  onClick={() => {
                    setSelectedGuide(null);
                    onOpenAuthModal('upgrade');
                  }}
                  className="mt-2 text-xs text-amber-800 underline font-bold block"
                >
                  Upgrade Guest Session Now →
                </button>
              </div>
            )}

            {bookingSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-[#2D2D2D] text-xs text-center space-y-3">
                <CheckCircle2 className="w-8 h-8 text-[#7C9082] mx-auto" />
                <h4 className="font-serif font-bold text-base text-[#2D2D2D]">Session Scheduled!</h4>
                <p className="text-[#6B665F]">
                  Your {bookingSuccess.type} session with {selectedGuide.nickname} has been booked for {new Date(bookingSuccess.scheduledAt).toLocaleString()}.
                </p>
                <button
                  onClick={() => setSelectedGuide(null)}
                  className="w-full py-2 bg-[#7C9082] hover:bg-[#687C6E] text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Close & View Calendar
                </button>
              </div>
            ) : (
              <form onSubmit={handleBookSession} className="space-y-4">
                <div>
                  <label className="text-xs text-[#6B665F] font-medium block mb-1">Preferred Date & Time</label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl p-2.5 text-xs text-[#2D2D2D] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
                  />
                </div>

                <div>
                  <label className="text-xs text-[#6B665F] font-medium block mb-1">Call Privacy Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setSessionType('private')}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                        sessionType === 'private'
                          ? 'bg-[#7C9082] text-white border-[#7C9082] shadow-sm'
                          : 'bg-[#F5F3EF] text-[#6B665F] border-[#EBE8E4]'
                      }`}
                    >
                      <span className="font-bold block">Private Call</span>
                      <span className="text-[10px] opacity-80 block">1-on-1 Confidential</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSessionType('public')}
                      className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                        sessionType === 'public'
                          ? 'bg-[#7C9082] text-white border-[#7C9082] shadow-sm'
                          : 'bg-[#F5F3EF] text-[#6B665F] border-[#EBE8E4]'
                      }`}
                    >
                      <span className="font-bold block">Public Campfire</span>
                      <span className="text-[10px] opacity-80 block">Others can listen</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-[#6B665F] font-medium block mb-1">What would you like to process? (Optional)</label>
                  <textarea
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Briefly state what's on your heart..."
                    rows={2}
                    className="w-full bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl p-2.5 text-xs text-[#2D2D2D] placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-[#7C9082] resize-none"
                  />
                </div>

                {bookingError && (
                  <p className="text-xs text-rose-700 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                    {bookingError}
                  </p>
                )}

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedGuide(null)}
                    className="px-4 py-2 text-xs text-[#8D8881] hover:text-[#2D2D2D]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={user?.isGuest}
                    className="px-5 py-2.5 bg-[#7C9082] hover:bg-[#687C6E] disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-md shadow-[#7C9082]/20"
                  >
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
