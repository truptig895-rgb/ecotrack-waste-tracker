import React, { useEffect, useRef } from 'react';
import { X, AlertCircle } from 'lucide-react';

interface WasteGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WasteGuideModal: React.FC<WasteGuideModalProps> = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close on Escape key press and focus management
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
      // Simple focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              e.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              e.preventDefault();
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    // Auto-focus initial element
    const timer = setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-fadeIn"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={modalRef}
        className="bg-white rounded-2xl max-w-lg w-full border border-slate-200/90 shadow-2xl overflow-hidden animate-fadeIn"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-emerald-50/70">
          <div>
            <h3 id="guide-title" className="text-base font-extrabold text-slate-900">
              Waste Classification Reference
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              How to categorize everyday consumption items accurately
            </p>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            aria-label="Close guide modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 text-sm max-h-[70vh] overflow-y-auto">
          {/* Plastic items */}
          <div className="space-y-1.5 p-3 rounded-xl bg-rose-50/30 border border-rose-100/70">
            <div className="flex items-center gap-2 font-bold text-rose-800 text-xs sm:text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
              <span>Plastic Items (Single-Use Disposables)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-4.5">
              Single-use water bottles, plastic cups, straws, cling wrap, plastic grocery bags, food wrappers, single-serving snack pouches, disposable plastic cutlery, and takeout lids.
            </p>
          </div>

          {/* Paper items */}
          <div className="space-y-1.5 p-3 rounded-xl bg-amber-50/30 border border-amber-100/70">
            <div className="flex items-center gap-2 font-bold text-amber-800 text-xs sm:text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
              <span>Paper Items (Single-Use Disposables)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-4.5">
              Single-use coffee cups (paper exterior), paper napkins, paper bags, thermal receipt printouts, paper towels, single-use cardboard sleeves, and takeout wrappers.
            </p>
          </div>

          {/* Reusable items */}
          <div className="space-y-1.5 p-3 rounded-xl bg-emerald-50/30 border border-emerald-100/70">
            <div className="flex items-center gap-2 font-bold text-emerald-800 text-xs sm:text-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
              <span>Reusable Items (Conscious Alternatives)</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-4.5">
              Stainless steel or glass water bottles, canvas shopping totes, ceramic coffee mugs, reusable food containers/bento boxes, metal/bamboo utensils, washable cloth towels, and reusable beeswax wraps.
            </p>
          </div>

          <div className="pt-2 flex items-start gap-2.5 text-xs text-slate-500">
            <AlertCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              Tip: Count each item used over the course of your current 24-hour day. Reusables reflect positive habit shifts preventing landfill waste.
            </span>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="min-h-[44px] px-5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 active:scale-95 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
          >
            Got it, take me back
          </button>
        </div>
      </div>
    </div>
  );
};
