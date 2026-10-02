/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { UserInputs } from './components/UserInputs';
import { ImpactResults } from './components/ImpactResults';
import { ActionableTips } from './components/ActionableTips';
import { HistoryLog } from './components/HistoryLog';
import { WasteGuideModal } from './components/WasteGuideModal';
import {
  TrackerInputs,
  TrackerValidationErrors,
  ImpactResultsData,
  HistoryRecord,
} from './types/tracker';
import { validateTrackerInputs, calculateImpact } from './utils/calculator';
import {
  Leaf,
  Shield,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  TreePine,
  Layers,
  X,
} from 'lucide-react';

const INITIAL_INPUTS: TrackerInputs = {
  userName: '',
  plasticItems: '',
  paperItems: '',
  reusableItems: '',
};

export default function App() {
  const [inputs, setInputs] = useState<TrackerInputs>(INITIAL_INPUTS);
  const [errors, setErrors] = useState<TrackerValidationErrors>({});
  const [results, setResults] = useState<ImpactResultsData | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>(() => {
    try {
      const saved = localStorage.getItem('ecotrack_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isSavedCurrent, setIsSavedCurrent] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ecotrack_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Unable to persist history', e);
    }
  }, [history]);

  // Handle text input changes with sanitization
  const handleInputChange = (field: keyof TrackerInputs, value: string) => {
    // If it's a numeric count, reject negative signs or decimals immediately during typing
    if (field !== 'userName') {
      if (value !== '' && !/^\d*$/.test(value)) {
        return;
      }
      // Clamp numeric length to 4 digits (max 9999)
      if (value.length > 4) {
        return;
      }
    } else {
      // Clamp name length to 40 characters
      if (value.length > 40) {
        return;
      }
    }

    setInputs((prev) => ({ ...prev, [field]: value }));

    // Clear field-specific error as user edits
    if (errors[field] || errors.general) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  // Handle stepper increments (+1 / -1) clamped between 0 and 9999
  const handleIncrement = (
    field: 'plasticItems' | 'paperItems' | 'reusableItems',
    delta: number
  ) => {
    const rawVal = (inputs[field] || '').trim();
    const currentVal = rawVal === '' ? 0 : parseInt(rawVal, 10);
    const base = isNaN(currentVal) ? 0 : currentVal;
    const nextVal = Math.min(9999, Math.max(0, base + delta));

    setInputs((prev) => ({ ...prev, [field]: String(nextVal) }));
    if (errors[field] || errors.general) {
      setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
    }
  };

  // Preset selector
  const handleApplyPreset = (preset: {
    name: string;
    plastic: string;
    paper: string;
    reusable: string;
  }) => {
    setInputs({
      userName: preset.name,
      plasticItems: preset.plastic,
      paperItems: preset.paper,
      reusableItems: preset.reusable,
    });
    setErrors({});
    setNotification(`Applied '${preset.name}' sample preset.`);
    setTimeout(() => setNotification(null), 3000);
  };

  // Calculate Impact handler
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate inputs directly to enforce: no empty inputs, no decimals, no negatives, no 0-sum
    const validationErrors = validateTrackerInputs(inputs);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsCalculating(true);

    // Smooth settling animation for progress and calculations
    setTimeout(() => {
      const calculatedData = calculateImpact(inputs);
      setResults(calculatedData);
      setIsSavedCurrent(false);
      setIsCalculating(false);

      // Smooth scroll to results upon calculation
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }, 180);
  };

  // Instant Reset Function: restores clean initial defaults without page reloads
  const handleReset = () => {
    setInputs(INITIAL_INPUTS);
    setErrors({});
    setResults(null);
    setIsSavedCurrent(false);
    setNotification('Tracker smoothly reset to initial state.');
    setTimeout(() => setNotification(null), 3000);

    // Smooth scroll back to top without reloading
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save current calculation to local session log
  const handleSaveToHistory = () => {
    if (!results || isSavedCurrent) return;

    const newRecord: HistoryRecord = {
      ...results,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };

    setHistory((prev) => [newRecord, ...prev].slice(0, 25));
    setIsSavedCurrent(true);
    setNotification('Daily audit recorded in Session History.');
    setTimeout(() => setNotification(null), 3000);
  };

  // Clear all saved session history
  const handleClearHistory = () => {
    setHistory([]);
    setNotification('Session history cleared.');
    setTimeout(() => setNotification(null), 2500);
  };

  // Load a historical record into active view
  const handleSelectRecord = (record: HistoryRecord) => {
    setInputs({
      userName: record.userName,
      plasticItems: String(record.plasticCount),
      paperItems: String(record.paperCount),
      reusableItems: String(record.reusableCount),
    });
    setResults(record);
    setIsSavedCurrent(true);
    setErrors({});
    setNotification(`Loaded record for ${record.userName}.`);
    setTimeout(() => setNotification(null), 2500);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8F6] text-slate-800 antialiased selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Header Contract */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onReset={handleReset}
        hasCalculated={results !== null}
      />

      {/* Floating Notification Toast */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 right-6 z-40 bg-slate-900/95 backdrop-blur-md text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-xl shadow-slate-900/20 border border-slate-800 flex items-center gap-2.5 animate-fadeIn ring-1 ring-white/10"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
          <button
            type="button"
            onClick={() => setNotification(null)}
            className="ml-2 text-slate-400 hover:text-white p-1 rounded-md cursor-pointer transition-colors"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area with zero horizontal overflow */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-8 overflow-x-hidden">
        {/* Hero Section with Lush Nature Aesthetic and Subtle Radial Light */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white p-7 sm:p-10 shadow-md shadow-emerald-950/20 border border-emerald-800/40">
          {/* Subtle nature leaf watermark */}
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-6 translate-y-6">
            <TreePine className="w-72 h-72 text-emerald-200" />
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-300 tracking-wider uppercase bg-emerald-900/60 px-3 py-1 rounded-full border border-emerald-700/50 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Personal Waste & Conservation Tracker</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white text-balance leading-tight">
              Quantify your daily footprint. <br className="hidden sm:inline" />
              Champion conscious alternatives.
            </h1>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed font-normal">
              Track your daily single-use items versus reusable alternatives. Discover your exact plastic usage percentage, benchmark your sustainability progress, and receive customized habits to minimize waste.
            </p>

            {/* Quiet trust / scope highlights */}
            <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-emerald-200 font-medium">
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>Strict integer validation</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Adaptive sustainability score</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Zero telemetry · Private tracking</span>
              </div>
            </div>
          </div>
        </section>

        {/* User Input Dashboard */}
        <UserInputs
          inputs={inputs}
          errors={errors}
          onChange={handleInputChange}
          onIncrement={handleIncrement}
          onCalculate={handleCalculate}
          onReset={handleReset}
          onApplyPreset={handleApplyPreset}
          onOpenGuide={() => setIsGuideOpen(true)}
          isCalculating={isCalculating}
        />

        {/* Dynamic Results & Progress Section */}
        {results && (
          <section ref={resultsRef} className="space-y-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900">
                  Impact Assessment for {results.userName}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Calculated metrics and environmental sustainability benchmarks
                </p>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="self-start sm:self-auto min-h-[44px] px-3.5 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 rounded-xl hover:bg-slate-200/60 active:scale-95 transition-all cursor-pointer shadow-2xs border border-slate-200/80"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Tracker</span>
              </button>
            </div>

            {/* Sleek Result Cards, Dedicated Breakdown Card, and Animated Progress Bar */}
            <ImpactResults
              results={results}
              onSaveToHistory={handleSaveToHistory}
              isSaved={isSavedCurrent}
            />

            {/* Personalized Actionable Tips */}
            <ActionableTips results={results} />
          </section>
        )}

        {/* Session History Log */}
        <HistoryLog
          records={history}
          onClearHistory={handleClearHistory}
          onSelectRecord={handleSelectRecord}
        />
      </main>

      {/* Classification Reference Modal */}
      <WasteGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Quiet, clean Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white">
              <Leaf className="w-3 h-3" />
            </div>
            <span className="font-extrabold text-slate-800">
              EcoTrack
            </span>
            <span className="text-slate-400">·</span>
            <span className="font-medium">Personal Waste Tracker</span>
          </div>

          <div className="text-slate-400 font-medium">
            Fostering circular habits one day at a time
          </div>
        </div>
      </footer>
    </div>
  );
}
