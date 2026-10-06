import React, { useState } from 'react';
import { Check, Calendar as CalendarIcon, Grid, Layers, ArrowRight, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  CalendarMonth,
  CalendarOrientation,
  CalendarPageFormat,
  CalendarBindingType,
  CalendarDedication,
  Person,
} from '../../../types/calendar';
import { TelegramService } from '../../../services/telegram';
import imgJan from '../../../assets/images/month_january_newyear_1791297609129.jpg';

interface StepFormatAndPreviewProps {
  year: number;
  months: CalendarMonth[];
  dedication: CalendarDedication;
  people: Person[];
  formatSettings: {
    orientation: CalendarOrientation;
    format: CalendarPageFormat;
    binding: CalendarBindingType;
  };
  onUpdateFormat: (settings: {
    orientation: CalendarOrientation;
    format: CalendarPageFormat;
    binding: CalendarBindingType;
  }) => void;
  onNext: () => void;
}

const FORMAT_OPTIONS: { id: CalendarPageFormat; name: string; desc: string; size: string }[] = [
  { id: 'A3', name: 'A3', desc: 'Большой семейный', size: '30 × 42 см' },
  { id: 'A4', name: 'A4', desc: 'Компактный', size: '21 × 30 см' },
  { id: 'square', name: 'Квадрат', desc: 'Современный формат', size: '30 × 30 см' },
];

const BINDING_OPTIONS: { id: CalendarBindingType; name: string; desc: string }[] = [
  { id: 'wall', name: 'Настенный', desc: 'С пружиной и ригелем' },
  { id: 'desk_flip', name: 'Перекидной', desc: 'На подставке' },
];

export const StepFormatAndPreview: React.FC<StepFormatAndPreviewProps> = ({
  year,
  months,
  dedication,
  people,
  formatSettings,
  onUpdateFormat,
  onNext,
}) => {
  const [viewMode, setViewMode] = useState<'single' | 'all'>('single');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0); // 0 = Cover, 1..12 = Months, 13 = Final

  const totalPages = 14; // Cover + 12 months + Year Collage

  const handlePrevPage = () => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
    TelegramService.triggerHaptic('light');
  };

  const handleNextPage = () => {
    setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1));
    TelegramService.triggerHaptic('light');
  };

  const currentMonthData = currentPageIndex >= 1 && currentPageIndex <= 12 ? months[currentPageIndex - 1] : null;

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6 text-[#2C2723]">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Какой календарь сделать?
        </h1>
        <p className="text-xs sm:text-sm text-[#70665D] leading-relaxed max-w-sm mx-auto">
          Выберите формат печати и полистайте готовые страницы.
        </p>
      </div>

      {/* Format Cards */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-[#2C2723]">Формат страниц:</label>
        <div className="grid grid-cols-3 gap-2.5">
          {FORMAT_OPTIONS.map((f) => {
            const isSelected = formatSettings.format === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  onUpdateFormat({ ...formatSettings, format: f.id });
                  TelegramService.triggerHaptic('light');
                }}
                className={`p-3.5 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2C2723] text-white border-[#2C2723] shadow-xs scale-[1.02]'
                    : 'bg-white text-[#5C5146] border-[#ECE4D8] hover:border-[#D5C7B5]'
                }`}
              >
                <span className="font-editorial text-2xl font-bold block">{f.name}</span>
                <span className="text-[11px] block opacity-90 leading-tight mt-0.5">{f.desc}</span>
                <span className="text-[9px] block opacity-70 mt-1">{f.size}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Binding Options */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-[#2C2723]">Тип крепления:</label>
        <div className="grid grid-cols-2 gap-3">
          {BINDING_OPTIONS.map((b) => {
            const isSelected = formatSettings.binding === b.id;
            return (
              <button
                key={b.id}
                type="button"
                onClick={() => {
                  onUpdateFormat({ ...formatSettings, binding: b.id });
                  TelegramService.triggerHaptic('light');
                }}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-[#2C2723] text-white border-[#2C2723] shadow-xs'
                    : 'bg-white text-[#5C5146] border-[#ECE4D8] hover:border-[#D5C7B5]'
                }`}
              >
                <div>
                  <span className="text-xs font-bold block">{b.name}</span>
                  <span className="text-[10px] opacity-80">{b.desc}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-white" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Realistic Calendar Mockup Preview Box */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#ECE4D8] shadow-xs space-y-4">
        {/* Toggle: Страницы / Весь календарь */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-[#2C2723] flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-[#8C4A38]" />
            <span>Предпросмотр макета</span>
          </span>

          <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#ECE4D8] text-xs">
            <button
              type="button"
              onClick={() => setViewMode('single')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'single'
                  ? 'bg-[#2C2723] text-white shadow-2xs'
                  : 'text-[#7A6F64] hover:text-[#2C2723]'
              }`}
            >
              Страницы
            </button>
            <button
              type="button"
              onClick={() => setViewMode('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                viewMode === 'all'
                  ? 'bg-[#2C2723] text-white shadow-2xs'
                  : 'text-[#7A6F64] hover:text-[#2C2723]'
              }`}
            >
              Весь календарь
            </button>
          </div>
        </div>

        {/* View Mode: Single Page Navigation */}
        {viewMode === 'single' ? (
          <div className="space-y-3">
            {/* The calendar page physical mockup */}
            <div className="relative bg-[#FAF7F2] rounded-2xl border-4 border-white shadow-md p-4 overflow-hidden">
              {/* Spiral binding rings at top */}
              <div className="flex justify-center gap-1.5 pb-3">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="w-2.5 h-3.5 bg-[#8E8377]/40 rounded-full border border-black/10" />
                ))}
              </div>

              {/* Cover Page (index 0) */}
              {currentPageIndex === 0 && (
                <div className="space-y-4 text-center">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#EFE8DE] shadow-xs">
                    <img
                      src={months[0]?.imageUrl || imgJan}
                      alt="Обложка"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="font-editorial text-xs uppercase tracking-widest text-[#8C4A38] font-bold">
                      Семейный календарь
                    </span>
                    <h3 className="font-editorial text-4xl font-bold text-[#2C2723]">
                      МОЙ ГОД · {year}
                    </h3>
                    {dedication.enabled && dedication.text && (
                      <p className="text-xs text-[#5C5146] font-editorial italic max-w-xs mx-auto pt-1 whitespace-pre-line">
                        «{dedication.text}»
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Month Page (index 1..12) */}
              {currentMonthData && (
                <div className="space-y-3">
                  <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-[#EFE8DE] shadow-xs">
                    <img
                      src={currentMonthData.imageUrl}
                      alt={currentMonthData.monthName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-center space-y-0.5">
                    <h3 className="font-editorial text-3xl font-bold text-[#2C2723] uppercase">
                      {currentMonthData.monthName}
                    </h3>
                    <p className="text-xs text-[#7A6F64] font-medium">
                      «{currentMonthData.storyCaption}»
                    </p>
                  </div>

                  {/* Sample mini calendar grid */}
                  <div className="bg-white/80 p-2.5 rounded-xl border border-[#ECE4D8] text-[10px] text-[#7A6F64]">
                    <div className="grid grid-cols-7 gap-1 text-center font-bold text-[#2C2723] mb-1">
                      <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span className="text-[#8C4A38]">Сб</span><span className="text-[#8C4A38]">Вс</span>
                    </div>
                    <div className="grid grid-cols-7 gap-1 text-center">
                      {Array.from({ length: 31 }).map((_, d) => (
                        <span
                          key={d}
                          className={`py-0.5 rounded-sm ${
                            (d + 1) % 7 === 0 || (d + 2) % 7 === 0 ? 'text-[#8C4A38] font-medium' : ''
                          }`}
                        >
                          {d + 1}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Final Collage Page (index 13) */}
              {currentPageIndex === 13 && (
                <div className="space-y-3 text-center">
                  <span className="font-editorial text-xs uppercase tracking-widest text-[#8C4A38] font-bold">
                    Память на всю жизнь
                  </span>
                  <h3 className="font-editorial text-3xl font-bold text-[#2C2723]">
                    Наш {year} год
                  </h3>
                  <div className="grid grid-cols-4 gap-1.5 p-1 bg-white rounded-xl border border-[#ECE4D8]">
                    {months.map((m) => (
                      <img
                        key={m.monthNumber}
                        src={m.imageUrl}
                        alt={m.monthName}
                        className="w-full aspect-square object-cover rounded-md"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-[#7A6F64] font-editorial pt-1">
                    С любовью для всей семьи ❤️
                  </p>
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handlePrevPage}
                disabled={currentPageIndex === 0}
                className="py-2 px-3.5 bg-[#FAF8F5] hover:bg-white text-xs font-semibold text-[#5C5146] disabled:opacity-40 rounded-xl border border-[#D5C9BB] flex items-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Назад</span>
              </button>

              <span className="text-xs font-mono font-bold text-[#8C4A38]">
                {currentPageIndex === 0
                  ? 'Обложка'
                  : currentPageIndex === 13
                  ? 'Коллаж года'
                  : `${months[currentPageIndex - 1]?.monthName} (${currentPageIndex}/12)`}
              </span>

              <button
                type="button"
                onClick={handleNextPage}
                disabled={currentPageIndex === totalPages - 1}
                className="py-2 px-3.5 bg-[#FAF8F5] hover:bg-white text-xs font-semibold text-[#5C5146] disabled:opacity-40 rounded-xl border border-[#D5C9BB] flex items-center gap-1 cursor-pointer"
              >
                <span>Вперёд</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* View Mode: All Pages Grid */
          <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto p-1">
            <div
              onClick={() => {
                setCurrentPageIndex(0);
                setViewMode('single');
              }}
              className="p-1.5 bg-[#FAF7F2] rounded-xl border border-[#D5C9BB] text-center cursor-pointer hover:border-[#2C2723]"
            >
              <img src={months[0]?.imageUrl || imgJan} className="w-full aspect-[4/3] object-cover rounded-lg mb-1" alt="Обложка" />
              <span className="text-[10px] font-bold block">Обложка</span>
            </div>
            {months.map((m, idx) => (
              <div
                key={m.monthNumber}
                onClick={() => {
                  setCurrentPageIndex(idx + 1);
                  setViewMode('single');
                }}
                className="p-1.5 bg-[#FAF7F2] rounded-xl border border-[#D5C9BB] text-center cursor-pointer hover:border-[#2C2723]"
              >
                <img src={m.imageUrl} className="w-full aspect-[4/3] object-cover rounded-lg mb-1" alt={m.monthName} />
                <span className="text-[10px] font-bold block truncate">{m.monthName}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Finalize Button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={onNext}
            className="w-full py-4 rounded-2xl text-sm font-semibold bg-[#2C2723] hover:bg-[#433B35] text-white active:scale-[0.98] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <span>Перейти к заказу и PDF</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
