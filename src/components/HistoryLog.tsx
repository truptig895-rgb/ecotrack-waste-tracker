import React from 'react';
import { HistoryRecord } from '../types/tracker';
import { History, Trash2, Calendar, Award } from 'lucide-react';

interface HistoryLogProps {
  records: HistoryRecord[];
  onClearHistory: () => void;
  onSelectRecord?: (record: HistoryRecord) => void;
}

export const HistoryLog: React.FC<HistoryLogProps> = ({
  records,
  onClearHistory,
  onSelectRecord,
}) => {
  if (records.length === 0) {
    return null;
  }

  return (
    <section className="bg-white rounded-2xl border border-slate-200/80 shadow-sm shadow-slate-200/50 overflow-hidden transition-all">
      <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-800">
            <History className="w-4 h-4 text-emerald-700" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight text-slate-900">
              Session History ({records.length})
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              Click any row to re-inspect full audit metrics
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClearHistory}
          className="min-h-[44px] px-3.5 py-2 text-xs font-bold text-slate-500 hover:text-rose-700 hover:bg-rose-50 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer rounded-xl border border-transparent hover:border-rose-200 shadow-2xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/90 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Time</th>
              <th className="py-3 px-4 text-right">Total</th>
              <th className="py-3 px-4 text-right">Plastic %</th>
              <th className="py-3 px-4 text-right">Reusable %</th>
              <th className="py-3 px-4 text-right">Score</th>
              <th className="py-3 px-4">Impact Tier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {records.map((rec) => (
              <tr
                key={rec.id}
                onClick={() => onSelectRecord && onSelectRecord(rec)}
                className={`transition-colors ${
                  onSelectRecord
                    ? 'cursor-pointer hover:bg-emerald-50/50 active:bg-emerald-50'
                    : 'hover:bg-slate-50/70'
                }`}
                title={onSelectRecord ? 'Click to inspect this audit record' : undefined}
              >
                <td className="py-3.5 px-4 font-bold text-slate-900">
                  {rec.userName}
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-medium">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{rec.calculatedAt}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-800">
                  {rec.totalItems}
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-rose-600 font-bold">
                  {rec.plasticPercentage}%
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-700 font-bold">
                  {rec.reusableRatio}%
                </td>
                <td className="py-3.5 px-4 text-right font-mono tabular-nums font-black text-slate-900">
                  {rec.sustainabilityScore}/100
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                      rec.statusLevel === 'champion'
                        ? 'text-emerald-800 bg-emerald-100/80 ring-1 ring-emerald-500/20'
                        : rec.statusLevel === 'conscious'
                        ? 'text-teal-800 bg-teal-100/80 ring-1 ring-teal-500/20'
                        : rec.statusLevel === 'moderate'
                        ? 'text-amber-800 bg-amber-100/80 ring-1 ring-amber-500/20'
                        : 'text-rose-800 bg-rose-100/80 ring-1 ring-rose-500/20'
                    }`}
                  >
                    <Award className="w-3 h-3 shrink-0" />
                    {rec.statusTitle}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
