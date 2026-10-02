import React, { useState, useEffect } from 'react';
import { ImpactResultsData } from '../types/tracker';
import {
  Award,
  ShieldCheck,
  Compass,
  AlertCircle,
  TrendingDown,
  Layers,
  Recycle,
  Check,
  Share2,
  BookmarkCheck,
  Sparkles,
  Download,
  FileText,
  User,
} from 'lucide-react';

interface ImpactResultsProps {
  results: ImpactResultsData;
  onSaveToHistory: () => void;
  isSaved: boolean;
}

export const ImpactResults: React.FC<ImpactResultsProps> = ({
  results,
  onSaveToHistory,
  isSaved,
}) => {
  const [copied, setCopied] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);

  // Trigger smooth animated transition for the sustainability progress bar (0 -> value)
  useEffect(() => {
    setProgressWidth(0);
    const timer = setTimeout(() => {
      setProgressWidth(results.sustainabilityScore);
    }, 80);
    return () => clearTimeout(timer);
  }, [results.sustainabilityScore]);

  // Color-coded risk levels dynamically with high visual contrast and refined nature palettes
  const getStatusTheme = () => {
    switch (results.statusLevel) {
      case 'champion':
        return {
          icon: Award,
          titleColor: 'text-emerald-900',
          textColor: 'text-emerald-950',
          badgeBg: 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30',
          containerBg: 'bg-gradient-to-br from-emerald-50/90 via-emerald-50/40 to-teal-50/20 border-emerald-300/90',
          cardBorder: 'border-emerald-200/80',
          progressBarColor: 'bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-500',
          glowColor: 'shadow-emerald-500/25',
          accentColor: '#059669',
          badgeLabel: 'Low Environmental Risk',
          statusTone: 'text-emerald-800 bg-emerald-100 ring-1 ring-emerald-600/20',
        };
      case 'conscious':
        return {
          icon: ShieldCheck,
          titleColor: 'text-teal-900',
          textColor: 'text-teal-950',
          badgeBg: 'bg-teal-600 text-white shadow-sm shadow-teal-600/30',
          containerBg: 'bg-gradient-to-br from-teal-50/90 via-teal-50/40 to-emerald-50/20 border-teal-300/90',
          cardBorder: 'border-teal-200/80',
          progressBarColor: 'bg-gradient-to-r from-teal-500 via-teal-600 to-emerald-500',
          glowColor: 'shadow-teal-500/25',
          accentColor: '#0d9488',
          badgeLabel: 'Moderate-Low Risk',
          statusTone: 'text-teal-800 bg-teal-100 ring-1 ring-teal-600/20',
        };
      case 'moderate':
        return {
          icon: Compass,
          titleColor: 'text-amber-900',
          textColor: 'text-amber-950',
          badgeBg: 'bg-amber-600 text-white shadow-sm shadow-amber-600/30',
          containerBg: 'bg-gradient-to-br from-amber-50/90 via-amber-50/40 to-orange-50/20 border-amber-300/90',
          cardBorder: 'border-amber-200/80',
          progressBarColor: 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600',
          glowColor: 'shadow-amber-500/25',
          accentColor: '#d97706',
          badgeLabel: 'Elevated Disposable Risk',
          statusTone: 'text-amber-800 bg-amber-100 ring-1 ring-amber-600/20',
        };
      case 'high_waste':
      default:
        return {
          icon: AlertCircle,
          titleColor: 'text-rose-900',
          textColor: 'text-rose-950',
          badgeBg: 'bg-rose-600 text-white shadow-sm shadow-rose-600/30',
          containerBg: 'bg-gradient-to-br from-rose-50/90 via-rose-50/40 to-orange-50/20 border-rose-300/90',
          cardBorder: 'border-rose-200/80',
          progressBarColor: 'bg-gradient-to-r from-rose-500 via-rose-600 to-orange-500',
          glowColor: 'shadow-rose-500/25',
          accentColor: '#e11d48',
          badgeLabel: 'High Environmental Risk',
          statusTone: 'text-rose-800 bg-rose-100 ring-1 ring-rose-600/20',
        };
    }
  };

  const theme = getStatusTheme();
  const StatusIcon = theme.icon;

  const singleUseTotal = results.plasticCount + results.paperCount;

  // Generate audit summary text for copy and download
  const buildAuditReportText = () => {
    return `======================================================
ECOTRACK - DAILY PERSONAL ENVIRONMENTAL AUDIT
======================================================
Audit Date & Time:   ${results.calculatedAt}
User / Identifier:   ${results.userName}

1. OVERALL STATUS & SCORE
------------------------------------------------------
Impact Status:       ${results.statusTitle.toUpperCase()}
Sustainability Score:${results.sustainabilityScore} / 100
Evaluation:          ${results.statusMessage}

2. MATERIAL & ITEM BREAKDOWN
------------------------------------------------------
• Plastic Items:     ${results.plasticCount} (${results.plasticPercentage}%)
• Paper Items:       ${results.paperCount} (${results.paperPercentage}%)
• Reusable Items:    ${results.reusableCount} (${results.reusableRatio}% Eco Ratio)
------------------------------------------------------
TOTAL ITEMS USED:    ${results.totalItems} items
(Disposables: ${singleUseTotal} | Reusables: ${results.reusableCount})

3. ESTIMATED ENVIRONMENTAL IMPACT
------------------------------------------------------
• Estimated Landfill Mass:   ~${results.estimatedLandfillGrams} g
• Embodied Carbon (CO2e):    ~${results.estimatedCarbonGrams} g CO2e
• Single-Use Waste Diverted: ${results.itemsDiverted} items prevented
======================================================
Generated via EcoTrack Personal Waste Tracker
`;
  };

  // 1. Copy Summary to Clipboard
  const handleCopySummary = () => {
    const text = buildAuditReportText();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // 2. Export Report as Downloadable .txt file
  const handleExportReport = () => {
    const text = buildAuditReportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeName = (results.userName || 'user').trim().replace(/[^a-zA-Z0-9_-]/g, '_') || 'audit';
    link.href = url;
    link.download = `EcoTrack_Audit_${safeName}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Complete Breakdown Card: "Today's Summary" */}
      <section
        className={`bg-white rounded-2xl border ${theme.cardBorder} p-6 sm:p-7 shadow-sm shadow-slate-200/50 relative overflow-hidden transition-all`}
        aria-labelledby="summary-heading"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 shadow-2xs">
                <FileText className="w-3.5 h-3.5 text-emerald-700" />
                Step 2 of 3 · Impact Audit
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs font-semibold text-slate-500">
                Logged at {results.calculatedAt}
              </span>
            </div>
            <h3 id="summary-heading" className="text-xl sm:text-2xl font-extrabold tracking-tight text-slate-900 mt-1">
              Today's Summary
            </h3>
          </div>

          {/* Export & Sharing Action Controls with 44px touch targets */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopySummary}
              className="min-h-[44px] px-3.5 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 active:bg-slate-300 active:scale-95 text-slate-800 rounded-xl border border-slate-200/80 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Copy audit to clipboard"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Copy Summary</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleExportReport}
              className="min-h-[44px] px-3.5 py-2 text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 active:scale-95 text-emerald-800 rounded-xl border border-emerald-200 transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Download text audit report"
            >
              <Download className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Export Report</span>
            </button>

            <button
              type="button"
              onClick={onSaveToHistory}
              disabled={isSaved}
              className={`min-h-[44px] px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all inline-flex items-center gap-1.5 shadow-2xs ${
                isSaved
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300 cursor-default'
                  : 'bg-white hover:bg-slate-50 active:scale-95 text-slate-700 border-slate-200 cursor-pointer'
              }`}
            >
              <BookmarkCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{isSaved ? 'Saved in Log' : 'Save to Log'}</span>
            </button>
          </div>
        </div>

        {/* Structured Breakdown Grid: User, Individual Item Counts, Total Count, and Textual Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-5">
          {/* User Identifier */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-white transition-all shadow-2xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-emerald-700" />
              User Profile
            </span>
            <div className="text-base font-extrabold text-slate-900 mt-1.5 truncate">
              {results.userName}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Personal waste tracking record
            </p>
          </div>

          {/* Individual Item Counts */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-white transition-all shadow-2xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
              Individual Items
            </span>
            <div className="mt-1.5 space-y-1 text-xs">
              <div className="flex items-center justify-between font-medium">
                <span className="text-rose-700 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  Plastic
                </span>
                <span className="font-mono tabular-nums text-slate-900 font-bold">
                  {results.plasticCount} ({results.plasticPercentage}%)
                </span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span className="text-amber-700 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Paper
                </span>
                <span className="font-mono tabular-nums text-slate-900 font-bold">
                  {results.paperCount} ({results.paperPercentage}%)
                </span>
              </div>
              <div className="flex items-center justify-between font-medium">
                <span className="text-emerald-700 flex items-center gap-1 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Reusable
                </span>
                <span className="font-mono tabular-nums text-slate-900 font-bold">
                  {results.reusableCount} ({results.reusableRatio}%)
                </span>
              </div>
            </div>
          </div>

          {/* Total Count */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-white transition-all shadow-2xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              Total Items Count
            </span>
            <div className="text-2xl font-black text-slate-900 mt-1 font-mono tabular-nums">
              {results.totalItems} <span className="text-xs font-semibold text-slate-500">items</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {singleUseTotal} disposable · {results.reusableCount} reusable
            </p>
          </div>

          {/* Textual Impact Status & Score */}
          <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-white transition-all shadow-2xs">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              Impact Status
            </span>
            <div className="mt-1.5">
              <span className={`inline-block px-2.5 py-0.5 rounded-md text-xs font-black ${theme.statusTone}`}>
                {results.statusTitle}
              </span>
            </div>
            <div className="text-xs text-slate-600 mt-1 font-medium">
              Score: <span className="font-mono font-black text-slate-900">{results.sustainabilityScore}</span> / 100
            </div>
          </div>
        </div>

        {/* Detailed Textual Assessment Banner */}
        <div className={`p-5 rounded-2xl border ${theme.containerBg} flex items-start gap-4 shadow-2xs`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${theme.badgeBg}`}>
            <StatusIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className={`text-base font-extrabold tracking-tight ${theme.titleColor}`}>
                {results.statusTitle}
              </h4>
              <span className="text-xs px-2.5 py-0.5 rounded-md bg-white/90 font-bold text-slate-700 border border-slate-200/70 shadow-2xs">
                {theme.badgeLabel}
              </span>
            </div>
            <p className={`text-xs sm:text-sm mt-1.5 leading-relaxed font-normal ${theme.textColor}`}>
              {results.statusMessage}
            </p>
          </div>
        </div>

        {/* Dynamic Visual Progress Bar with Smooth Glowing Transition */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-slate-800 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Sustainability Progress Score
            </span>
            <span className="tabular-nums font-mono text-sm font-black text-slate-900">
              {results.sustainabilityScore} / 100
            </span>
          </div>

          {/* Animated Glowing Progress Track */}
          <div className="w-full h-4 bg-slate-100/90 rounded-full overflow-hidden p-0.5 relative shadow-inner ring-1 ring-slate-200/50">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${theme.glowColor} ${theme.progressBarColor}`}
              style={{ width: `${Math.max(4, Math.min(100, progressWidth))}%` }}
              role="progressbar"
              aria-valuenow={results.sustainabilityScore}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>

          {/* Benchmark Legend */}
          <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
            <span>0% High Waste</span>
            <span className="hidden sm:inline">40% Developing</span>
            <span className="hidden sm:inline">70% Sustainable</span>
            <span>100% Zero-Waste Goal</span>
          </div>
        </div>
      </section>

      {/* 2. Sleek Core Results Cards Grid with Tabular Figures and Shadows */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Items */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm shadow-slate-200/50 hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Total Items
              </span>
              <Layers className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-3xl font-black text-slate-900 tabular-nums font-mono">
              {results.totalItems}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Combined items recorded today
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between font-medium">
            <span>Disposables: {singleUseTotal}</span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-bold">Reusables: {results.reusableCount}</span>
          </div>
        </div>

        {/* Card 2: Plastic Usage Percentage */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm shadow-slate-200/50 hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                Plastic Footprint
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200/60 font-mono tabular-nums">
                {results.plasticCount} {results.plasticCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 tabular-nums font-mono">
              {results.plasticPercentage}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Exact plastic share of today's total
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs">
            <span
              className={`font-bold ${
                results.plasticPercentage > 40
                  ? 'text-rose-600'
                  : results.plasticPercentage > 15
                  ? 'text-amber-600'
                  : 'text-emerald-600'
              }`}
            >
              {results.plasticPercentage > 40
                ? 'High environmental risk'
                : results.plasticPercentage > 15
                ? 'Moderate plastic reliance'
                : 'Minimal plastic footprint'}
            </span>
          </div>
        </div>

        {/* Card 3: Reusable Items & Eco-Friendly Ratio */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm shadow-slate-200/50 hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Eco Reusable Ratio
              </span>
              <Recycle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-700 tabular-nums font-mono">
              {results.reusableRatio}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {results.reusableCount} reusable choices used
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between font-medium">
            <span className="text-emerald-700 font-bold">
              {results.itemsDiverted} items diverted
            </span>
            <span className="text-slate-400">from landfill</span>
          </div>
        </div>

        {/* Card 4: Paper Items Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm shadow-slate-200/50 hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Paper Items
              </span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 font-mono tabular-nums">
                {results.paperCount} {results.paperCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <div className="text-3xl font-black text-slate-900 tabular-nums font-mono">
              {results.paperPercentage}%
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Biodegradable single-use share
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
            <span>Est. {results.paperCount * 16}g paper waste generated</span>
          </div>
        </div>
      </div>

      {/* 3. Proportional Breakdown Bar & Environmental Equivalency Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Proportional Stacked Composition Bar */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between mb-3.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Daily Material Composition
            </h4>
            <span className="text-xs text-slate-500 font-semibold">100% Total items</span>
          </div>

          {/* Segmented Distribution Bar */}
          <div className="w-full h-4.5 bg-slate-100 rounded-lg overflow-hidden flex p-0.5 ring-1 ring-slate-200/60">
            {results.plasticPercentage > 0 && (
              <div
                style={{ width: `${results.plasticPercentage}%` }}
                className="bg-rose-500 h-full transition-all duration-700 relative rounded-l-md"
                title={`Plastic: ${results.plasticPercentage}%`}
              />
            )}
            {results.paperPercentage > 0 && (
              <div
                style={{ width: `${results.paperPercentage}%` }}
                className="bg-amber-400 h-full transition-all duration-700 relative"
                title={`Paper: ${results.paperPercentage}%`}
              />
            )}
            {results.reusableRatio > 0 && (
              <div
                style={{ width: `${results.reusableRatio}%` }}
                className="bg-emerald-600 h-full transition-all duration-700 relative rounded-r-md"
                title={`Reusable: ${results.reusableRatio}%`}
              />
            )}
          </div>

          {/* Legend with Tabular Percentages */}
          <div className="mt-4 grid grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="w-3 h-3 rounded-xs bg-rose-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Plastic</span>
                <span className="text-slate-500 ml-1.5 font-mono tabular-nums font-bold">
                  {results.plasticPercentage}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="w-3 h-3 rounded-xs bg-amber-400 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Paper</span>
                <span className="text-slate-500 ml-1.5 font-mono tabular-nums font-bold">
                  {results.paperPercentage}%
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50/70 border border-slate-100">
              <span className="w-3 h-3 rounded-xs bg-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800">Reusable</span>
                <span className="text-slate-500 ml-1.5 font-mono tabular-nums font-bold">
                  {results.reusableRatio}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Environmental Equivalence Card with Deep Forest Gradient */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-2xl p-6 shadow-sm shadow-emerald-950/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Eco Impact Estimator
              </span>
              <TrendingDown className="w-4 h-4 text-emerald-400" />
            </div>
            <h4 className="text-sm font-bold text-white">
              Estimated Daily Footprint
            </h4>
            <div className="mt-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-800/70">
                <span className="text-emerald-200">Landfill Mass</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  ~{results.estimatedLandfillGrams} g
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-emerald-800/70">
                <span className="text-emerald-200">Embodied Carbon</span>
                <span className="font-mono font-bold text-white tabular-nums">
                  ~{results.estimatedCarbonGrams} g CO₂e
                </span>
              </div>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-emerald-200">Waste Prevented</span>
                <span className="font-mono font-extrabold text-emerald-300 tabular-nums">
                  {results.itemsDiverted} items
                </span>
              </div>
            </div>
          </div>

          <p className="text-[11px] text-emerald-300/80 mt-4 pt-2.5 border-t border-emerald-800/70">
            Based on standard municipal single-use life-cycle benchmarks.
          </p>
        </div>
      </div>
    </div>
  );
};
