import React from 'react';
import { Circle } from '../../types';
import { ShieldAlert, CheckCircle2, X } from 'lucide-react';

interface CircleRulesModalProps {
  circle: Circle;
  onAcknowledge: () => void;
  onClose: () => void;
}

export const CircleRulesModal: React.FC<CircleRulesModalProps> = ({
  circle,
  onAcknowledge,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-slate-100 shadow-2xl relative">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1 rounded-full hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-slate-100">{circle.name} Guardrails</h3>
            <p className="text-xs text-slate-400">Sanctuary Rules & Mutual Commitments</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 mb-4 leading-relaxed">
          Before entering and sharing in <strong className="text-emerald-400">{circle.name}</strong>, please acknowledge our community safety promises:
        </p>

        <div className="space-y-3 bg-slate-800/60 p-4 rounded-2xl border border-slate-700/60 mb-6 max-h-60 overflow-y-auto">
          {circle.rules.map((rule, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{rule}</span>
            </div>
          ))}
          <div className="flex items-start gap-2.5 text-xs text-slate-200 pt-2 border-t border-slate-700/50">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>AI Intern Pre-Moderation: Every post is scanned for toxicity & crisis signals before going live.</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onAcknowledge}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all flex items-center gap-2"
          >
            I Acknowledge & Enter Circle
          </button>
        </div>
      </div>
    </div>
  );
};
