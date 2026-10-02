import React from 'react';
import {
  TrackerInputs,
  TrackerValidationErrors,
} from '../types/tracker';
import {
  User,
  Plus,
  Minus,
  Sparkles,
  RotateCcw,
  Calculator,
  AlertTriangle,
  HelpCircle,
  Recycle,
  Trash2,
} from 'lucide-react';

interface UserInputsProps {
  inputs: TrackerInputs;
  errors: TrackerValidationErrors;
  onChange: (field: keyof TrackerInputs, value: string) => void;
  onIncrement: (field: 'plasticItems' | 'paperItems' | 'reusableItems', delta: number) => void;
  onCalculate: (e: React.FormEvent) => void;
  onReset: () => void;
  onApplyPreset: (preset: { name: string; plastic: string; paper: string; reusable: string }) => void;
  onOpenGuide: () => void;
  isCalculating: boolean;
}

export const UserInputs: React.FC<UserInputsProps> = ({
  inputs,
  errors,
  onChange,
  onIncrement,
  onCalculate,
  onReset,
  onApplyPreset,
  onOpenGuide,
  isCalculating,
}) => {
  const presets = [
    { label: 'Low-Waste Day', name: 'Maya', plastic: '0', paper: '1', reusable: '5' },
    { label: 'Office Day', name: 'Jordan', plastic: '2', paper: '2', reusable: '3' },
    { label: 'Takeout Lunch', name: 'Alex', plastic: '5', paper: '3', reusable: '1' },
  ];

  // Disallow invalid characters on keydown for integer inputs
  const handleNumericKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-', '.', ','].includes(e.key)) {
      e.preventDefault();
    }
  };

  // Sanitize pasted inputs to only allow numeric digits up to 4 characters
  const handleNumericPaste = (
    e: React.ClipboardEvent<HTMLInputElement>,
    field: 'plasticItems' | 'paperItems' | 'reusableItems'
  ) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text');
    const sanitized = pasted.replace(/\D/g, '').slice(0, 4);
    onChange(field, sanitized);
  };

  return (
    <section
      id="tracker-form"
      className="bg-white rounded-2xl border border-emerald-950/10 shadow-sm shadow-slate-200/50 overflow-hidden transition-all"
    >
      {/* Top Banner with nature accents */}
      <div className="px-6 py-5 border-b border-emerald-950/10 bg-gradient-to-r from-emerald-50/80 via-emerald-50/40 to-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md shadow-2xs">
              Step 1 of 3 · Daily Log
            </span>
            <span className="text-xs text-slate-400">·</span>
            <span className="text-xs text-slate-500 font-semibold">Consumption Input</span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 mt-1">
            Daily Waste Log
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
            Record every disposable and reusable item used throughout your day
          </p>
        </div>

        {/* Quick Presets for fast exploration with 44px touch targets */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-slate-500 font-semibold mr-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Quick Presets:
          </span>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => onApplyPreset(p)}
              className="min-h-[44px] px-3.5 py-2 text-xs font-semibold bg-white hover:bg-emerald-50 active:bg-emerald-100 active:scale-95 border border-slate-200 hover:border-emerald-300 rounded-xl text-slate-700 hover:text-emerald-800 transition-all cursor-pointer shadow-2xs inline-flex items-center"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={onCalculate} className="p-6 sm:p-7 space-y-7">
        {/* General validation error notification (e.g. division by zero edge-case) */}
        {errors.general && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-amber-50 border border-amber-300/90 text-amber-900 text-sm flex items-start gap-3 animate-fadeIn shadow-2xs"
          >
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
            <div>
              <p className="font-bold text-sm">Action Needed</p>
              <p className="font-normal text-xs sm:text-sm mt-0.5 leading-relaxed">
                {errors.general}
              </p>
            </div>
          </div>
        )}

        {/* User Name Input */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="userName"
              className="text-sm font-bold text-slate-800 flex items-center gap-2"
            >
              <User className="w-4 h-4 text-emerald-700" />
              <span>Your Name / Identifier</span>
            </label>
            <span className="text-xs text-slate-400 font-medium">Required for personalized assessment</span>
          </div>
          <div className="relative">
            <input
              id="userName"
              type="text"
              value={inputs.userName}
              onChange={(e) => onChange('userName', e.target.value)}
              placeholder="e.g. Alex Green or Robin"
              maxLength={40}
              className={`w-full min-h-[44px] px-4 py-2.5 bg-slate-50/70 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:bg-white shadow-2xs ${
                errors.userName
                  ? 'border-rose-400 focus:border-rose-500 bg-rose-50/30'
                  : 'border-slate-200 hover:border-slate-300 focus:border-emerald-600'
              }`}
            />
          </div>
          {errors.userName && (
            <p className="text-xs font-semibold text-rose-600 mt-1 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
              {errors.userName}
            </p>
          )}
        </div>

        {/* Visual Category Grouping: Single-Use Disposables vs Reusable Alternatives */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 pb-1 border-b border-slate-100">
            <span className="font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              Single-Use Disposables
            </span>
            <span className="font-bold uppercase tracking-wider text-emerald-700 hidden sm:flex items-center gap-1.5">
              <Recycle className="w-3.5 h-3.5 text-emerald-600" />
              Conscious Alternatives
            </span>
          </div>

          {/* 3 Item Counting Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 1. Plastic Items (Single-Use) */}
            <div
              className={`p-5 rounded-2xl border transition-all shadow-2xs flex flex-col justify-between ${
                errors.plasticItems
                  ? 'border-rose-300 bg-rose-50/20 shadow-rose-100'
                  : 'border-rose-200/70 bg-gradient-to-b from-rose-50/30 to-white hover:border-rose-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 bg-rose-100/70 px-2 py-0.5 rounded-md inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      Plastic
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                      Single-Use Plastic
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenGuide}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center cursor-pointer transition-colors"
                    title="What counts as plastic?"
                    aria-label="Plastic classification info"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-4 min-h-[34px] leading-relaxed">
                  Bottles, cups, plastic cutlery, snack wrappers, cling film & retail bags.
                </p>
              </div>

              <div>
                {/* Stepper + Input with 44px min touch targets */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onIncrement('plasticItems', -1)}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 font-bold transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
                    disabled={Number(inputs.plasticItems) <= 0}
                    aria-label="Decrease plastic items by 1"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={inputs.plasticItems}
                    onChange={(e) => onChange('plasticItems', e.target.value)}
                    onKeyDown={handleNumericKeyDown}
                    onPaste={(e) => handleNumericPaste(e, 'plasticItems')}
                    className={`w-full min-h-[44px] text-center py-2 px-2 text-lg font-bold font-mono tabular-nums rounded-xl border transition-all ${
                      errors.plasticItems
                        ? 'border-rose-400 text-rose-700 bg-rose-50/50'
                        : 'border-slate-200 bg-white text-slate-800 focus:border-rose-500'
                    }`}
                    placeholder="0"
                    aria-label="Plastic items count"
                  />

                  <button
                    type="button"
                    onClick={() => onIncrement('plasticItems', 1)}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:border-rose-300 hover:text-rose-700 active:bg-rose-100 active:scale-95 flex items-center justify-center text-slate-700 font-bold transition-all cursor-pointer shadow-2xs"
                    aria-label="Increase plastic items by 1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick-add chips with accessible touch targets */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onIncrement('plasticItems', 1)}
                    className="min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-700 hover:text-rose-700 hover:bg-rose-50 active:scale-95 rounded-lg border border-slate-200 hover:border-rose-300 transition-all inline-flex items-center cursor-pointer shadow-2xs"
                  >
                    +1 Bottle
                  </button>
                  <button
                    type="button"
                    onClick={() => onIncrement('plasticItems', 1)}
                    className="min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-700 hover:text-rose-700 hover:bg-rose-50 active:scale-95 rounded-lg border border-slate-200 hover:border-rose-300 transition-all inline-flex items-center cursor-pointer shadow-2xs"
                  >
                    +1 Wrapper
                  </button>
                </div>

                {errors.plasticItems && (
                  <p className="text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-rose-600" />
                    {errors.plasticItems}
                  </p>
                )}
              </div>
            </div>

            {/* 2. Paper Items (Single-Use) */}
            <div
              className={`p-5 rounded-2xl border transition-all shadow-2xs flex flex-col justify-between ${
                errors.paperItems
                  ? 'border-amber-300 bg-amber-50/20 shadow-amber-100'
                  : 'border-amber-200/70 bg-gradient-to-b from-amber-50/30 to-white hover:border-amber-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Paper
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                      Single-Use Paper
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenGuide}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center cursor-pointer transition-colors"
                    title="What counts as paper?"
                    aria-label="Paper classification info"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-4 min-h-[34px] leading-relaxed">
                  Paper coffee cups, disposable napkins, paper bags, thermal receipts & sleeves.
                </p>
              </div>

              <div>
                {/* Stepper + Input with 44px min touch targets */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onIncrement('paperItems', -1)}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 font-bold transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
                    disabled={Number(inputs.paperItems) <= 0}
                    aria-label="Decrease paper items by 1"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={inputs.paperItems}
                    onChange={(e) => onChange('paperItems', e.target.value)}
                    onKeyDown={handleNumericKeyDown}
                    onPaste={(e) => handleNumericPaste(e, 'paperItems')}
                    className={`w-full min-h-[44px] text-center py-2 px-2 text-lg font-bold font-mono tabular-nums rounded-xl border transition-all ${
                      errors.paperItems
                        ? 'border-rose-400 text-rose-700 bg-rose-50/50'
                        : 'border-slate-200 bg-white text-slate-800 focus:border-amber-500'
                    }`}
                    placeholder="0"
                    aria-label="Paper items count"
                  />

                  <button
                    type="button"
                    onClick={() => onIncrement('paperItems', 1)}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700 active:bg-amber-100 active:scale-95 flex items-center justify-center text-slate-700 font-bold transition-all cursor-pointer shadow-2xs"
                    aria-label="Increase paper items by 1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick-add chips with accessible touch targets */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onIncrement('paperItems', 1)}
                    className="min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-amber-50 active:scale-95 rounded-lg border border-slate-200 hover:border-amber-300 transition-all inline-flex items-center cursor-pointer shadow-2xs"
                  >
                    +1 Coffee Cup
                  </button>
                  <button
                    type="button"
                    onClick={() => onIncrement('paperItems', 1)}
                    className="min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-700 hover:text-amber-700 hover:bg-amber-50 active:scale-95 rounded-lg border border-slate-200 hover:border-amber-300 transition-all inline-flex items-center cursor-pointer shadow-2xs"
                  >
                    +1 Napkin
                  </button>
                </div>

                {errors.paperItems && (
                  <p className="text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-rose-600" />
                    {errors.paperItems}
                  </p>
                )}
              </div>
            </div>

            {/* 3. Reusable Items (Conscious Alternatives) */}
            <div
              className={`p-5 rounded-2xl border transition-all shadow-2xs flex flex-col justify-between ${
                errors.reusableItems
                  ? 'border-rose-300 bg-rose-50/20'
                  : 'border-emerald-300/80 bg-gradient-to-b from-emerald-50/50 to-white hover:border-emerald-400 hover:shadow-sm ring-1 ring-emerald-500/10'
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-1.5">
                  <div>
                    <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md inline-flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                      Reusable
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                      Eco Alternatives
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenGuide}
                    className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg min-h-[44px] min-w-[44px] -mr-2 -mt-2 flex items-center justify-center cursor-pointer transition-colors"
                    title="What counts as reusable?"
                    aria-label="Reusable classification info"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mb-4 min-h-[34px] leading-relaxed">
                  Refillable bottle, ceramic travel mug, cloth tote, bento box & steel utensils.
                </p>
              </div>

              <div>
                {/* Stepper + Input with 44px min touch targets */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onIncrement('reusableItems', -1)}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-slate-100 active:bg-slate-200 active:scale-95 flex items-center justify-center text-slate-700 font-bold transition-all cursor-pointer disabled:opacity-30 disabled:pointer-events-none shadow-2xs"
                    disabled={Number(inputs.reusableItems) <= 0}
                    aria-label="Decrease reusable items by 1"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    value={inputs.reusableItems}
                    onChange={(e) => onChange('reusableItems', e.target.value)}
                    onKeyDown={handleNumericKeyDown}
                    onPaste={(e) => handleNumericPaste(e, 'reusableItems')}
                    className={`w-full min-h-[44px] text-center py-2 px-2 text-lg font-bold font-mono tabular-nums rounded-xl border transition-all ${
                      errors.reusableItems
                        ? 'border-rose-400 text-rose-700 bg-rose-50/50'
                        : 'border-slate-200 bg-white text-slate-800 focus:border-emerald-600'
                    }`}
                    placeholder="0"
                    aria-label="Reusable items count"
                  />

                  <button
                    type="button"
                    onClick={() => onIncrement('reusableItems', 1)}
                    className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl border border-slate-200 bg-white hover:bg-emerald-50 hover:border-emerald-300 hover:text-emerald-700 active:bg-emerald-100 active:scale-95 flex items-center justify-center text-slate-700 font-bold transition-all cursor-pointer shadow-2xs"
                    aria-label="Increase reusable items by 1"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Quick-add chips with accessible touch targets */}
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => onIncrement('reusableItems', 1)}
                    className="min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all inline-flex items-center cursor-pointer shadow-2xs"
                  >
                    +1 Water Bottle
                  </button>
                  <button
                    type="button"
                    onClick={() => onIncrement('reusableItems', 1)}
                    className="min-h-[44px] px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 active:scale-95 rounded-lg border border-slate-200 hover:border-emerald-300 transition-all inline-flex items-center cursor-pointer shadow-2xs"
                  >
                    +1 Tote Bag
                  </button>
                </div>

                {errors.reusableItems && (
                  <p className="text-xs font-semibold text-rose-600 mt-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-rose-600" />
                    {errors.reusableItems}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls: Calculate & Reset */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onReset}
            className="order-2 sm:order-1 min-h-[44px] px-5 py-2.5 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 active:scale-95 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Tracker</span>
          </button>

          <button
            type="submit"
            disabled={isCalculating}
            className="order-1 sm:order-2 min-h-[48px] px-8 py-3 text-sm font-extrabold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:scale-[0.98] rounded-xl shadow-md shadow-emerald-700/25 transition-all flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60"
          >
            <Calculator className="w-4 h-4" />
            <span>{isCalculating ? 'Computing Impact...' : 'Calculate My Impact'}</span>
          </button>
        </div>
      </form>
    </section>
  );
};
