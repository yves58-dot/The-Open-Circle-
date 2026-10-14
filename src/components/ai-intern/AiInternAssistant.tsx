import React, { useState } from 'react';
import { UserAvatar } from '../shared/UserAvatar';
import { Sparkles, Send, ShieldCheck, Heart, Bot, HelpCircle, MessageSquare } from 'lucide-react';

export const AiInternAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ sender: 'ai' | 'user'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: "Hello! I am the AI Intern for The Open Circle. I work in the background pre-moderating posts, offering empathy nudges, and keeping our campfire calls balanced. How can I support you right now?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, time }]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(prev => [...prev, { sender: 'ai', text: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } else {
        setMessages(prev => [...prev, { sender: 'ai', text: "I hear you. I'm right here with you in this safe space.", time }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "I hear you. I'm right here with you in this safe space.", time }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left Column: AI Intern Information */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white border border-[#F0EEEA] rounded-3xl p-5 text-[#2D2D2D] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-purple-700">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#2D2D2D]">The AI Intern</h3>
              <p className="text-xs text-purple-800 font-semibold">Silent Guardian, Gentle Facilitator</p>
            </div>
          </div>

          <p className="text-xs text-[#6B665F] leading-relaxed mb-4">
            The AI Intern is designed to protect our sanctuary, keep conversations balanced, and ensure no vulnerable post is ever left without empathy.
          </p>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#FBF9F7] rounded-2xl border border-[#F0EEEA]">
              <span className="font-bold text-purple-900 block mb-1">1. Gatekeeper (Pre-Moderation)</span>
              <p className="text-[#6B665F]">Scans posts in milliseconds for hate speech, method sharing, and crisis language before going live.</p>
            </div>

            <div className="p-3 bg-[#FBF9F7] rounded-2xl border border-[#F0EEEA]">
              <span className="font-bold text-purple-900 block mb-1">2. Group Call Facilitator</span>
              <p className="text-[#6B665F]">Maintains audio room balance, handles awkward silences, and opens calls with grounding exercises.</p>
            </div>

            <div className="p-3 bg-[#FBF9F7] rounded-2xl border border-[#F0EEEA]">
              <span className="font-bold text-purple-900 block mb-1">3. Empathy Booster</span>
              <p className="text-[#6B665F]">Sends warm auto-replies to posts receiving zero replies within 5 minutes so no one feels ignored.</p>
            </div>

            <div className="p-3 bg-[#FBF9F7] rounded-2xl border border-[#F0EEEA]">
              <span className="font-bold text-purple-900 block mb-1">4. Crisis Detection & DM</span>
              <p className="text-[#6B665F]">Discreetly dispatches private helpline resources and alerts Peer Guides when distress is detected.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Chat Interface */}
      <div className="lg:col-span-2 bg-white border border-[#F0EEEA] rounded-3xl p-5 text-[#2D2D2D] shadow-sm flex flex-col h-[580px]">
        
        <div className="flex items-center justify-between pb-3 border-b border-[#F0EEEA] mb-4">
          <div className="flex items-center gap-2.5">
            <UserAvatar config={{ bgColor: '#8B5CF6', shape: 'hexagon', icon: 'heart' }} size="md" />
            <div>
              <h4 className="font-serif font-bold text-sm text-[#2D2D2D]">Private AI Intern Chat</h4>
              <span className="text-[10px] text-[#7C9082] flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3" /> Anonymous & Encrypted
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${m.sender === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {m.sender === 'ai' ? (
                <UserAvatar config={{ bgColor: '#8B5CF6', shape: 'hexagon', icon: 'heart' }} size="sm" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-[#7C9082] text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                  You
                </div>
              )}

              <div
                className={`max-w-md p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#7C9082] text-white rounded-tr-none shadow-sm'
                    : 'bg-[#F5F3EF] border border-[#EBE8E4] text-[#2D2D2D] rounded-tl-none'
                }`}
              >
                <p>{m.text}</p>
                <span className="text-[9px] opacity-70 block text-right mt-1">{m.time}</span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-purple-800 p-2 font-medium">
              <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
              <span>AI Intern is reflecting...</span>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="mt-4 pt-3 border-t border-[#F0EEEA] flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a thought or question to the AI Intern..."
            className="flex-1 bg-[#FBF9F7] border border-[#EBE8E4] rounded-xl px-4 py-2.5 text-xs text-[#2D2D2D] placeholder-[#A09B95] focus:outline-none focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2.5 bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" /> Send
          </button>
        </form>

      </div>

    </div>
  );
};
