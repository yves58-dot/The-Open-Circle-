import React, { useState } from 'react';
import { SanctuaryLogo } from './SanctuaryLogo';
import { Heart, Wifi, Shield, Sparkles, CheckCircle2, Gift, DollarSign, X } from 'lucide-react';

interface DonationModalProps {
  onClose: () => void;
  onDonationSuccess: (amount: number, cause: string) => void;
  currentUserNickname?: string;
}

export const DonationModal: React.FC<DonationModalProps> = ({
  onClose,
  onDonationSuccess,
  currentUserNickname = 'Anonymous Member'
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number>(15);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [cause, setCause] = useState<'mentor_data' | 'hardship_pool' | 'general'>('mentor_data');
  const [message, setMessage] = useState<string>('');
  const [donorNickname, setDonorNickname] = useState<string>(currentUserNickname);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [completedDonation, setCompletedDonation] = useState<{ amount: number; bundles: number } | null>(null);

  const presets = [
    {
      amount: 5,
      title: '1 GB Mentor Data Bundle',
      desc: 'Keeps 1 Volunteer Mentor online for 3 audio campfire sessions.',
      icon: Wifi,
      popular: false
    },
    {
      amount: 15,
      title: 'Weekly Mentor Connectivity Package',
      desc: 'Full 1-week unlimited data connectivity for a dedicated Peer Guide.',
      icon: Gift,
      popular: true
    },
    {
      amount: 30,
      title: 'Hardship Micro-Grant Pool',
      desc: 'Provides anonymous internet & emergency phone credit for members in distress.',
      icon: Heart,
      popular: false
    },
    {
      amount: 50,
      title: 'Sanctuary Guardian Pack',
      desc: 'Funds data bundles for 3 Volunteer Mentors + 2 Hardship Members.',
      icon: Shield,
      popular: false
    }
  ];

  const effectiveAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  const bundlesFunded = Math.floor(effectiveAmount / 5);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (effectiveAmount <= 0) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donorNickname: donorNickname || 'Anonymous Member',
          amount: effectiveAmount,
          cause,
          message
        })
      });

      if (res.ok) {
        setCompletedDonation({
          amount: effectiveAmount,
          bundles: bundlesFunded
        });
        onDonationSuccess(effectiveAmount, cause);
      }
    } catch (err) {
      console.error('Failed to submit donation:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#202024] border border-[#E5E2DC] dark:border-[#2D2D32] rounded-3xl max-w-xl w-full p-6 text-[#2D2D2D] dark:text-[#E4E4E7] shadow-2xl relative my-6 transition-colors">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8D8881] dark:text-[#A1A1AA] hover:text-[#2D2D2D] dark:hover:text-white p-1.5 rounded-full hover:bg-[#F5F3EF] dark:hover:bg-[#2B2B30]"
        >
          <X className="w-5 h-5" />
        </button>

        {completedDonation ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-[#7C9082]/10 dark:bg-[#7C9082]/20 rounded-full flex items-center justify-center text-[#7C9082] mx-auto border border-[#7C9082]/30 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-2xl font-bold">Deep Heartfelt Gratitude!</h3>
            <p className="text-sm text-[#6B665F] dark:text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
              Your gift of <strong className="text-[#2D2D2D] dark:text-white">${completedDonation.amount}</strong> has been received into the Sanctuary Care Pool!
            </p>

            {completedDonation.bundles > 0 && (
              <div className="p-4 bg-[#F5F3EF] dark:bg-[#29292E] rounded-2xl border border-[#E5E2DC] dark:border-[#38383E] inline-block text-xs font-semibold text-[#7C9082]">
                <Wifi className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
                This directly funds {completedDonation.bundles} Internet Data Bundle{completedDonation.bundles > 1 ? 's' : ''} for Volunteer Mentors!
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-[#7C9082] hover:bg-[#687C6E] text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                Return to Sanctuary
              </button>
            </div>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <SanctuaryLogo size="md" />
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#7C9082] dark:text-[#8D9F92] block">
                  Community Mutual Aid & Mentor Bundles
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#2D2D2D] dark:text-white">
                  Support The Open Circle
                </h3>
              </div>
            </div>

            <p className="text-xs text-[#6B665F] dark:text-[#A1A1AA] leading-relaxed mb-5">
              Our Volunteer Mentors offer free, compassionate listening every single day. Many operate in regions with high mobile data costs. Your donation buys internet bundles for guides or funds micro-grants for members in hardship.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Cause Selector */}
              <div>
                <label className="text-xs font-bold text-[#2D2D2D] dark:text-[#D4D4D8] block mb-2">
                  Select Cause
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCause('mentor_data')}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                      cause === 'mentor_data'
                        ? 'bg-[#7C9082] text-white border-[#7C9082] shadow-sm font-semibold'
                        : 'bg-[#FBF9F7] dark:bg-[#28282D] text-[#6B665F] dark:text-[#A1A1AA] border-[#EBE8E4] dark:border-[#38383E]'
                    }`}
                  >
                    <Wifi className="w-4 h-4 mb-1" />
                    <span className="font-bold block">Mentor Data Bundles</span>
                    <span className="text-[10px] opacity-80 block">Keep guides online</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCause('hardship_pool')}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                      cause === 'hardship_pool'
                        ? 'bg-[#7C9082] text-white border-[#7C9082] shadow-sm font-semibold'
                        : 'bg-[#FBF9F7] dark:bg-[#28282D] text-[#6B665F] dark:text-[#A1A1AA] border-[#EBE8E4] dark:border-[#38383E]'
                    }`}
                  >
                    <Heart className="w-4 h-4 mb-1" />
                    <span className="font-bold block">Hardship Micro-Grant</span>
                    <span className="text-[10px] opacity-80 block">Care pool for members</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setCause('general')}
                    className={`p-3 rounded-2xl border text-left text-xs transition-all ${
                      cause === 'general'
                        ? 'bg-[#7C9082] text-white border-[#7C9082] shadow-sm font-semibold'
                        : 'bg-[#FBF9F7] dark:bg-[#28282D] text-[#6B665F] dark:text-[#A1A1AA] border-[#EBE8E4] dark:border-[#38383E]'
                    }`}
                  >
                    <Shield className="w-4 h-4 mb-1" />
                    <span className="font-bold block">Sanctuary Fund</span>
                    <span className="text-[10px] opacity-80 block">AI safety & tech costs</span>
                  </button>
                </div>
              </div>

              {/* Amount Presets */}
              <div>
                <label className="text-xs font-bold text-[#2D2D2D] dark:text-[#D4D4D8] block mb-2">
                  Select Amount
                </label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {presets.map((p) => {
                    const Icon = p.icon;
                    const isSelected = selectedAmount === p.amount && !customAmount;
                    return (
                      <button
                        key={p.amount}
                        type="button"
                        onClick={() => {
                          setSelectedAmount(p.amount);
                          setCustomAmount('');
                        }}
                        className={`p-3 rounded-2xl border text-left transition-all relative ${
                          isSelected
                            ? 'bg-[#F5F3EF] dark:bg-[#2B2B30] border-[#7C9082] ring-2 ring-[#7C9082]/30'
                            : 'bg-[#FBF9F7] dark:bg-[#28282D] border-[#EBE8E4] dark:border-[#38383E]'
                        }`}
                      >
                        {p.popular && (
                          <span className="absolute top-2 right-2 text-[9px] bg-[#7C9082] text-white font-bold px-1.5 py-0.5 rounded-md">
                            Popular
                          </span>
                        )}
                        <div className="flex items-center gap-1.5 text-[#2D2D2D] dark:text-white font-bold text-base">
                          <DollarSign className="w-4 h-4 text-[#7C9082]" /> {p.amount}
                        </div>
                        <p className="text-[11px] font-semibold text-[#2D2D2D] dark:text-white mt-0.5">{p.title}</p>
                        <p className="text-[10px] text-[#8D8881] dark:text-[#8E8E93] leading-tight mt-0.5">{p.desc}</p>
                      </button>
                    );
                  })}
                </div>

                {/* Custom Amount Input */}
                <div className="relative mt-2">
                  <span className="absolute left-3 top-2.5 text-xs text-[#8D8881] font-bold">$</span>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter custom dollar amount..."
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      if (e.target.value) setSelectedAmount(0);
                    }}
                    className="w-full bg-[#FBF9F7] dark:bg-[#28282D] border border-[#EBE8E4] dark:border-[#38383E] rounded-xl pl-8 pr-3 py-2 text-xs text-[#2D2D2D] dark:text-white placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-[#7C9082]"
                  />
                </div>
              </div>

              {/* Message / Encouragement Note */}
              <div>
                <label className="text-xs font-bold text-[#2D2D2D] dark:text-[#D4D4D8] block mb-1">
                  Words of Encouragement for Volunteer Mentors (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Thank you Yves and mentors for keeping this sanctuary open..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FBF9F7] dark:bg-[#28282D] border border-[#EBE8E4] dark:border-[#38383E] rounded-xl p-2.5 text-xs text-[#2D2D2D] dark:text-white placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-[#7C9082] resize-none"
                />
              </div>

              {/* Donor Nickname */}
              <div>
                <label className="text-xs font-bold text-[#2D2D2D] dark:text-[#D4D4D8] block mb-1">
                  Display Nickname
                </label>
                <input
                  type="text"
                  value={donorNickname}
                  onChange={(e) => setDonorNickname(e.target.value)}
                  className="w-full bg-[#FBF9F7] dark:bg-[#28282D] border border-[#EBE8E4] dark:border-[#38383E] rounded-xl px-3 py-2 text-xs text-[#2D2D2D] dark:text-white focus:outline-none"
                />
              </div>

              {/* Action */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || effectiveAmount <= 0}
                  className="w-full py-3 bg-[#7C9082] hover:bg-[#687C6E] disabled:opacity-50 text-white rounded-2xl text-xs font-bold shadow-md shadow-[#7C9082]/20 transition-all flex items-center justify-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Donate ${effectiveAmount} via Secure Care Gateway</span>
                </button>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
