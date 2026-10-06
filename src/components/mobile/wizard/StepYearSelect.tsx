import React from 'react';
import { Check, Calendar as CalendarIcon, Sparkles } from 'lucide-react';
import { TelegramService } from '../../../services/telegram';

interface StepYearSelectProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
  onNext: () => void;
}

const AVAILABLE_YEARS = [2026, 2027, 2028];

export const StepYearSelect: React.FC<StepYearSelectProps> = ({
  selectedYear,
  onSelectYear,
  onNext,
}) => {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Какой год создаём?
        </h1>
        <p className="text-xs sm:text-sm text-[#70665D] leading-relaxed max-w-sm mx-auto">
          Календарь станет памятным подарком и сохранит этот особенный год.
        </p>
      </div>

      {/* Big Main Year Card */}
      <div className="bg-white p-8 rounded-3xl border-2 border-[#2C2723] shadow-md text-center space-y-3">
        <span className="text-[11px] font-bold text-[#8C4A38] uppercase tracking-widest block">
          Выбранный год
        </span>
        <div className="font-editorial text-6xl sm:text-7xl font-bold text-[#2C2723] tracking-tight">
          {selectedYear}
        </div>
        <p className="text-xs text-[#7A6F64]">
          12 месяцев с января по декабрь
        </p>
      </div>

      {/* Year Selector Pills */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-[#5C5146] block text-center">
          Выберите год календаря:
        </span>
        <div className="grid grid-cols-3 gap-3">
          {AVAILABLE_YEARS.map((y) => {
            const isSelected = selectedYear === y;
            return (
              <button
                key={y}
                type="button"
                onClick={() => {
                  onSelectYear(y);
                  TelegramService.triggerHaptic('light');
                }}
                className={`py-3.5 px-4 rounded-2xl font-editorial text-2xl font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2C2723] text-white border-[#2C2723] shadow-sm scale-[1.02]'
                    : 'bg-white text-[#5C5146] border-[#ECE4D8] hover:border-[#D5C7B5]'
                }`}
              >
                {y}
              </button>
            );
          })}
        </div>
      </div>

      {/* Sticky Bottom Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={onNext}
            className="w-full py-4 rounded-2xl text-sm font-semibold bg-[#2C2723] hover:bg-[#433B35] text-white active:scale-[0.98] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <span>Продолжить</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
