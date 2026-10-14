import React from 'react';
import { Circle } from '../../types';
import {
  Sparkles,
  Leaf,
  Trophy,
  Shield,
  Heart,
  Brain,
  Flame,
  Feather,
  ArrowRight,
  Users
} from 'lucide-react';

interface CirclesOverviewProps {
  circles: Circle[];
  selectedCircleId: string;
  onSelectCircle: (circleId: string) => void;
  onViewAllCircles: () => void;
}

export const CirclesOverview: React.FC<CirclesOverviewProps> = ({
  circles,
  selectedCircleId,
  onSelectCircle,
  onViewAllCircles
}) => {
  // Map category or name to stylized visual configurations
  const getCircleVisual = (name: string, category: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('alcohol')) {
      return {
        icon: Trophy,
        color: 'text-amber-500',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400',
        shortDesc: 'Support for breaking free and rebuilding'
      };
    }
    if (lower.includes('substance')) {
      return {
        icon: Shield,
        color: 'text-purple-500',
        bg: 'bg-purple-500/10',
        border: 'border-purple-500/30',
        dot: 'bg-purple-400',
        shortDesc: 'Overcoming addiction together with compassion'
      };
    }
    if (lower.includes('sex') || lower.includes('trauma')) {
      return {
        icon: Heart,
        color: 'text-rose-500',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        dot: 'bg-rose-400',
        shortDesc: 'Healing from trauma and finding peace'
      };
    }
    if (lower.includes('anxiety') || lower.includes('mental')) {
      return {
        icon: Brain,
        color: 'text-sky-500',
        bg: 'bg-sky-500/10',
        border: 'border-sky-500/30',
        dot: 'bg-sky-400',
        shortDesc: 'Managing depression, anxiety & panic'
      };
    }
    if (lower.includes('grief') || lower.includes('loss')) {
      return {
        icon: Feather,
        color: 'text-indigo-500',
        bg: 'bg-indigo-500/10',
        border: 'border-indigo-500/30',
        dot: 'bg-indigo-400',
        shortDesc: 'Processing loss and honoring memories'
      };
    }
    if (lower.includes('burnout') || lower.includes('stress')) {
      return {
        icon: Flame,
        color: 'text-orange-500',
        bg: 'bg-orange-500/10',
        border: 'border-orange-500/30',
        dot: 'bg-orange-400',
        shortDesc: 'Reclaiming emotional peace and boundaries'
      };
    }
    return {
      icon: Leaf,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      dot: 'bg-emerald-400',
      shortDesc: 'A safe space for open healing and support'
    };
  };

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-serif text-xl md:text-2xl font-bold text-[#0F172A] dark:text-white">
            You're not alone.
          </h3>
          <p className="text-xs md:text-sm text-[#64748B] dark:text-[#94A3B8]">
            Explore communities of people who understand.
          </p>
        </div>

        <button
          onClick={onViewAllCircles}
          className="flex items-center gap-1.5 text-xs font-bold text-[#6366F1] dark:text-[#818CF8] hover:text-[#4F46E5] dark:hover:text-indigo-300 transition-colors group"
        >
          <span>View all circles</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Circles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5">
        {circles.slice(0, 5).map((circle) => {
          const visual = getCircleVisual(circle.name, circle.category);
          const Icon = visual.icon;
          const isSelected = selectedCircleId === circle.id;

          return (
            <div
              key={circle.id}
              onClick={() => onSelectCircle(circle.id)}
              className={`p-4 rounded-2xl cursor-pointer transition-all flex flex-col justify-between h-full group ${
                isSelected
                  ? 'bg-[#6366F1]/10 dark:bg-[#1E2842] border-2 border-[#6366F1] shadow-md shadow-[#6366F1]/10'
                  : 'bg-white dark:bg-[#151A28] border border-[#E2E8F0] dark:border-[#232D44] hover:border-[#6366F1]/50 hover:bg-[#F8FAFC] dark:hover:bg-[#1A2236]'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-xl ${visual.bg} ${visual.color} border ${visual.border}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                    <span className={`w-2 h-2 rounded-full ${visual.dot}`}></span>
                    {circle.memberCount ? `${circle.memberCount} members` : 'Open'}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-sm text-[#0F172A] dark:text-white group-hover:text-[#6366F1] dark:group-hover:text-[#818CF8] transition-colors leading-tight">
                    {circle.name.replace(' Circle', '')}
                  </h4>
                  <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] mt-1 line-clamp-2 leading-relaxed">
                    {visual.shortDesc}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F1F5F9] dark:border-[#1E273D] mt-3 flex items-center justify-between text-[11px] font-medium text-[#64748B] dark:text-[#94A3B8]">
                <span>{circle.category}</span>
                <span className="text-[#6366F1] dark:text-[#818CF8] font-bold group-hover:translate-x-0.5 transition-transform">
                  Enter →
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
