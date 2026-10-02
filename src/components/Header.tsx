import React from 'react';
import { Leaf, BookOpen, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenGuide: () => void;
  onReset: () => void;
  hasCalculated: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenGuide,
  onReset,
  hasCalculated,
}) => {
  return (
    <header className="border-b border-emerald-950/10 bg-white/85 backdrop-blur-md sticky top-0 z-30 transition-colors shadow-xs">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark with elegant badge */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 via-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-sm shadow-emerald-700/25 ring-1 ring-emerald-600/30">
            <Leaf className="w-4.5 h-4.5 text-emerald-50" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              EcoTrack
            </span>
            <span className="hidden sm:inline text-[13px] font-medium text-slate-400">
              · Personal Waste Tracker
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation / Info trigger with 44px min touch target */}
        <nav className="flex items-center gap-3 sm:gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={onOpenGuide}
            className="min-h-[44px] px-3 rounded-xl flex items-center gap-2 text-slate-600 hover:text-emerald-800 hover:bg-emerald-50/70 active:scale-95 transition-all cursor-pointer text-xs sm:text-sm font-semibold"
          >
            <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><span className="hidden sm:inline">Classification </span>Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary Action with 44px min touch target */}
        <div className="flex items-center gap-2">
          {hasCalculated && (
            <button
              type="button"
              onClick={onReset}
              className="min-h-[44px] px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/90 active:scale-95 rounded-xl border border-slate-200/70 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              title="Reset tracker inputs and results"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Reset</span>
            </button>
          )}
          <a
            href="#tracker-form"
            className="min-h-[44px] px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:scale-95 rounded-xl shadow-sm shadow-emerald-700/20 transition-all cursor-pointer inline-flex items-center whitespace-nowrap"
          >
            Track Today
          </a>
        </div>
      </div>
    </header>
  );
};
