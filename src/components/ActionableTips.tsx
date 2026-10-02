import React from 'react';
import { ImpactResultsData } from '../types/tracker';
import { Lightbulb, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ActionableTipsProps {
  results: ImpactResultsData;
}

export const ActionableTips: React.FC<ActionableTipsProps> = ({ results }) => {
  // Generate contextual tips based on the user's specific consumption profile
  const getTips = () => {
    const list = [];

    if (results.plasticCount > 0) {
      if (results.plasticPercentage >= 35) {
        list.push({
          title: 'Swap Everyday Bottled Drinks',
          desc: 'Carrying a durable insulated bottle eliminates ~150 plastic bottles per year and keeps water cold all day.',
          priority: 'High Impact',
          iconColor: 'text-rose-600',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        });
        list.push({
          title: 'Pack a Foldable Tote in Your Everyday Bag',
          desc: 'Keeping an ultra-light fabric tote in your backpack or coat pocket avoids 3-5 disposable retail bags each week.',
          priority: 'Quick Habit',
          iconColor: 'text-rose-600',
          badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
        });
      } else {
        list.push({
          title: 'Tackle Snack Packaging & Takeout Cutlery',
          desc: 'Keep a lightweight bamboo or stainless fork in your workspace or bag to decline plastic utensils.',
          priority: 'Targeted Swap',
          iconColor: 'text-amber-600',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        });
      }
    }

    if (results.paperCount > 0) {
      if (results.paperPercentage >= 30) {
        list.push({
          title: 'Bring a Reusable Travel Coffee Tumbler',
          desc: 'Most single-use paper cups are lined with polyethylene and cannot be recycled in regular paper bins.',
          priority: 'High Impact',
          iconColor: 'text-amber-600',
          badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
        });
      }
      list.push({
        title: 'Opt for Digital Receipts & Cloth Napkins',
        desc: 'Request email/SMS receipts at checkout. Thermal receipt paper contains BPA coatings that prevent recycling.',
        priority: 'Easy Win',
        iconColor: 'text-amber-600',
        badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
      });
    }

    if (results.reusableRatio >= 60) {
      list.push({
        title: 'Inspire Your Household or Workplace',
        desc: 'You have mastered core zero-waste habits! Sharing practical tips or gifting a spare tote helps amplify your impact.',
        priority: 'Leadership',
        iconColor: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      });
    }

    if (list.length === 0) {
      list.push({
        title: 'Keep Up Your Zero-Waste Momentum',
        desc: 'Review weekly logs to identify emerging disposable patterns when traveling or ordering takeout.',
        priority: 'Maintenance',
        iconColor: 'text-emerald-600',
        badgeBg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      });
    }

    return list.slice(0, 3);
  };

  const tips = getTips();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-sm shadow-slate-200/50">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200/80 flex items-center justify-center text-emerald-800 shadow-2xs ring-1 ring-emerald-500/20">
            <Lightbulb className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-base font-extrabold tracking-tight text-slate-900">
              Personalized Recommendations for {results.userName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Targeted low-effort habits based on today's items
            </p>
          </div>
        </div>
        <span className="self-start sm:self-auto text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-200/60 px-3 py-1 rounded-lg shadow-2xs">
          Step 3 of 3 · Action Plan
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="p-5 rounded-xl border border-slate-200/70 bg-gradient-to-b from-slate-50/60 to-white hover:border-emerald-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2.5">
                <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-semibold ${tip.badgeBg}`}>
                  <CheckCircle2 className={`w-3.5 h-3.5 ${tip.iconColor}`} />
                  {tip.priority}
                </span>
                <span className="font-mono text-slate-400 font-bold">0{idx + 1}</span>
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                {tip.title}
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                {tip.desc}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-bold text-emerald-700 flex items-center gap-1.5">
              <span>Low-effort swap</span>
              <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
