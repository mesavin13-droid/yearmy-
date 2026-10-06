import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { MONTH_PROMPTS } from '../../../data/monthPrompts';

interface StepThemesPreviewProps {
  onStartGeneration: () => void;
}

const MONTH_BADGES = [
  { month: 1, name: 'Январь', icon: '🎄', theme: 'Новый год' },
  { month: 2, name: 'Февраль', icon: '💙', theme: '23 февраля' },
  { month: 3, name: 'Март', icon: '🌷', theme: '8 марта' },
  { month: 4, name: 'Апрель', icon: '🌿', theme: 'Весна' },
  { month: 5, name: 'Май', icon: '🇷🇺', theme: '9 мая' },
  { month: 6, name: 'Июнь', icon: '☀️', theme: 'Лето' },
  { month: 7, name: 'Июль', icon: '🏖', theme: 'Каникулы' },
  { month: 8, name: 'Август', icon: '🍉', theme: 'Лето' },
  { month: 9, name: 'Сентябрь', icon: '🎒', theme: '1 сентября' },
  { month: 10, name: 'Октябрь', icon: '🍂', theme: 'Осень' },
  { month: 11, name: 'Ноябрь', icon: '☕', theme: 'Уют' },
  { month: 12, name: 'Декабрь', icon: '🎄', theme: 'Новый год' },
];

export const StepThemesPreview: React.FC<StepThemesPreviewProps> = ({
  onStartGeneration,
}) => {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Каким будет каждый месяц?
        </h1>
        <p className="text-xs sm:text-sm text-[#70665D] leading-relaxed max-w-sm mx-auto">
          Каждый месяц — это новая тёплая глава вашей семейной истории.
        </p>
      </div>

      {/* 12 Compact Cards Grid (3 columns on mobile) */}
      <div className="grid grid-cols-3 gap-2.5">
        {MONTH_BADGES.map((m) => {
          const config = MONTH_PROMPTS.find((p) => p.month === m.month);
          return (
            <div
              key={m.month}
              className="bg-white p-3 rounded-2xl border border-[#ECE4D8] text-center space-y-1 shadow-2xs hover:border-[#D5C7B5] transition-all"
            >
              <span className="text-2xl block">{m.icon}</span>
              <span className="font-editorial text-sm font-bold text-[#2C2723] block leading-tight">
                {m.name}
              </span>
              <span className="text-[10px] text-[#7A6F64] font-medium block leading-tight">
                {m.theme}
              </span>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Create Calendar Button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={onStartGeneration}
            className="w-full py-4 rounded-2xl text-sm font-semibold bg-[#2C2723] hover:bg-[#433B35] text-white active:scale-[0.98] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <span>Создать календарь</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
