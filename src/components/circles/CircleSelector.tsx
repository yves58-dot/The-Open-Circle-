import React, { useState } from 'react';
import { Circle } from '../../types';
import { Heart, Shield, Users, Sparkles, Filter } from 'lucide-react';

interface CircleSelectorProps {
  circles: Circle[];
  activeCircleId: string;
  onSelectCircle: (circleId: string) => void;
}

export const CircleSelector: React.FC<CircleSelectorProps> = ({
  circles,
  activeCircleId,
  onSelectCircle
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Circles' },
    { id: 'general', label: 'General' },
    { id: 'recovery', label: 'Recovery' },
    { id: 'emotional', label: 'Emotional Support' },
    { id: 'life', label: 'Life & Family' }
  ];

  const filteredCircles = selectedCategory === 'all'
    ? circles
    : circles.filter(c => c.category === selectedCategory);

  const getCategoryColor = (cat: Circle['category']) => {
    switch (cat) {
      case 'recovery': return 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300';
      case 'emotional': return 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
      case 'life': return 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300';
      default: return 'bg-[#F5F3EF] dark:bg-[#2B2B30] border-[#E5E2DC] dark:border-[#38383E] text-[#7C9082] dark:text-[#8D9F92]';
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <Filter className="w-4 h-4 text-[#8D8881] dark:text-[#8E8E93] shrink-0 ml-1 mr-1" />
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-[#7C9082] text-white border-[#7C9082] shadow-sm'
                : 'bg-white dark:bg-[#202024] text-[#6B665F] dark:text-[#A1A1AA] border-[#EBE8E4] dark:border-[#38383E] hover:bg-[#F5F3EF] dark:hover:bg-[#28282D]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid of Circles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {filteredCircles.map(circle => {
          const isActive = circle.id === activeCircleId;
          return (
            <div
              key={circle.id}
              onClick={() => onSelectCircle(circle.id)}
              className={`group p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                isActive
                  ? 'bg-white dark:bg-[#202024] border-[#7C9082] shadow-md ring-2 ring-[#7C9082]/20'
                  : 'bg-white dark:bg-[#202024] border-[#F0EEEA] dark:border-[#2D2D32] hover:border-[#E5E2DC] dark:hover:border-[#38383E] hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full border ${getCategoryColor(circle.category)}`}>
                    {circle.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-[#8D8881] dark:text-[#8E8E93]">
                    <Users className="w-3.5 h-3.5" />
                    <span>{circle.memberCount} members</span>
                  </div>
                </div>

                <h4 className="font-serif font-bold text-base text-[#2D2D2D] dark:text-white group-hover:text-[#7C9082] dark:group-hover:text-[#8D9F92] transition-colors">
                  {circle.name}
                </h4>

                <p className="text-xs text-[#6B665F] dark:text-[#A1A1AA] mt-1 line-clamp-2 leading-relaxed">
                  {circle.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#F0EEEA] dark:border-[#2D2D32] flex items-center justify-between">
                <span className="text-[11px] text-[#7C9082] dark:text-[#8D9F92] font-semibold flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5" /> Verified Rules
                </span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-xl transition-colors ${
                  isActive ? 'bg-[#7C9082] text-white' : 'bg-[#F5F3EF] dark:bg-[#28282D] text-[#6B665F] dark:text-[#A1A1AA] group-hover:bg-[#7C9082] group-hover:text-white'
                }`}>
                  {isActive ? 'Active Circle' : 'Join Circle'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
