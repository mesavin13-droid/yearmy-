import React, { useState, useEffect } from 'react';
import {
  Download,
  Printer,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  FileCheck,
  Layout,
  Sparkles,
  Layers,
  Heart,
  Calendar as CalendarIcon,
  X,
  Plus,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Calendar, CalendarOrientation, CalendarPageFormat, CalendarBindingType, formatChildrenNames } from '../../types/calendar';
import { getCalendarGridDays, DayInfo } from '../../config/months';
import { generateCalendarPDF } from '../../services/pdfExport';
import { TelegramService } from '../../services/telegram';

interface Step8PreviewExportProps {
  calendar: Calendar;
  onUpdateFormatSettings: (settings: {
    orientation: CalendarOrientation;
    format: CalendarPageFormat;
    binding: CalendarBindingType;
  }) => void;
  onOrderPrint: () => void;
}

export const Step8PreviewExport: React.FC<Step8PreviewExportProps> = ({
  calendar,
  onUpdateFormatSettings,
  onOrderPrint,
}) => {
  // Page index: 0 = Cover, 1..12 = Jan..Dec, 13 = Year Summary Collage
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [isExportingPDF, setIsExportingPDF] = useState<boolean>(false);

  // Clickable Calendar Day Event State
  const [customDayNotes, setCustomDayNotes] = useState<Record<string, string>>({});
  const [activeDayModal, setActiveDayModal] = useState<{ monthNumber: number; dayNumber: number } | null>(null);
  const [dayNoteInput, setDayNoteInput] = useState<string>('');

  useEffect(() => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#A6533A', '#D4AF37', '#EAE2D5'],
      });
    } catch {
      // ignore
    }
  }, []);

  const totalPages = 14; // Cover + 12 months + Summary

  const prevPage = () => {
    setCurrentPageIndex((prev) => Math.max(0, prev - 1));
    TelegramService.triggerHaptic('light');
  };

  const nextPage = () => {
    setCurrentPageIndex((prev) => Math.min(totalPages - 1, prev + 1));
    TelegramService.triggerHaptic('light');
  };

  const handleDownloadPDF = async () => {
    setIsExportingPDF(true);
    TelegramService.triggerHaptic('medium');
    try {
      await generateCalendarPDF(calendar);
      TelegramService.triggerHaptic('success');
    } catch (e) {
      console.error('PDF export error:', e);
      window.print();
    } finally {
      setIsExportingPDF(false);
    }
  };

  const openDayNoteModal = (monthNumber: number, dayNumber: number) => {
    const key = `${monthNumber}_${dayNumber}`;
    setActiveDayModal({ monthNumber, dayNumber });
    setDayNoteInput(customDayNotes[key] || '');
    TelegramService.triggerHaptic('light');
  };

  const saveDayNote = () => {
    if (!activeDayModal) return;
    const key = `${activeDayModal.monthNumber}_${activeDayModal.dayNumber}`;
    if (dayNoteInput.trim()) {
      setCustomDayNotes((prev) => ({ ...prev, [key]: dayNoteInput.trim() }));
    } else {
      setCustomDayNotes((prev) => {
        const copy = { ...prev };
        delete copy[key];
        return copy;
      });
    }
    setActiveDayModal(null);
    TelegramService.triggerHaptic('success');
  };

  const primaryChild = calendar.children.find((c) => c.isPrimary) || calendar.children[0];
  const childrenNames = formatChildrenNames(calendar.children, calendar.togetherMode);

  const { orientation, format, binding } = calendar.formatSettings;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 pb-32">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#5B795A] font-semibold uppercase tracking-wider mb-1">
          <FileCheck className="w-4 h-4" />
          <span>Календарь полностью сформирован</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#2C2723]">
          Предпросмотр календаря
        </h2>
        <p className="text-xs sm:text-sm text-[#70665D] mt-1.5">
          Листайте страницы. Вы можете нажимать на любую дату в сетке, чтобы отметить семейные праздники и дни рождения!
        </p>
      </div>

      {/* Format & Binding Customization Controls - ALL CLICKABLE */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#ECE4D8] mb-6 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Orientation */}
        <div className="flex items-center gap-2">
          <span className="text-[#756A5F] font-medium">Ориентация:</span>
          <div className="flex bg-[#F5EFE6] p-1 rounded-xl">
            <button
              onClick={() => onUpdateFormatSettings({ ...calendar.formatSettings, orientation: 'portrait' })}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                orientation === 'portrait' ? 'bg-white text-[#2C2723] shadow-xs' : 'text-[#70665D]'
              }`}
            >
              Портрет
            </button>
            <button
              onClick={() => onUpdateFormatSettings({ ...calendar.formatSettings, orientation: 'landscape' })}
              className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                orientation === 'landscape' ? 'bg-white text-[#2C2723] shadow-xs' : 'text-[#70665D]'
              }`}
            >
              Альбом
            </button>
          </div>
        </div>

        {/* Paper Size */}
        <div className="flex items-center gap-2">
          <span className="text-[#756A5F] font-medium">Формат:</span>
          <div className="flex bg-[#F5EFE6] p-1 rounded-xl">
            {(['A4', 'A3', 'square'] as CalendarPageFormat[]).map((fmt) => (
              <button
                key={fmt}
                onClick={() => onUpdateFormatSettings({ ...calendar.formatSettings, format: fmt })}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors uppercase cursor-pointer ${
                  format === fmt ? 'bg-white text-[#2C2723] shadow-xs' : 'text-[#70665D]'
                }`}
              >
                {fmt === 'square' ? 'Квадрат' : fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Binding Type */}
        <div className="flex items-center gap-2">
          <span className="text-[#756A5F] font-medium">Тип:</span>
          <div className="flex bg-[#F5EFE6] p-1 rounded-xl">
            <button
              onClick={() => onUpdateFormatSettings({ ...calendar.formatSettings, binding: 'wall' })}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                binding === 'wall' ? 'bg-white text-[#2C2723] shadow-xs' : 'text-[#70665D]'
              }`}
            >
              Настенный
            </button>
            <button
              onClick={() => onUpdateFormatSettings({ ...calendar.formatSettings, binding: 'desk_flip' })}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                binding === 'desk_flip' ? 'bg-white text-[#2C2723] shadow-xs' : 'text-[#70665D]'
              }`}
            >
              Перекидной
            </button>
          </div>
        </div>
      </div>

      {/* Realistic Calendar Presentation Container */}
      <div className="relative mx-auto max-w-xl bg-white p-4 sm:p-6 rounded-3xl shadow-2xl border border-[#E3DACF]">
        {/* Spiral Ring Binding Mockup */}
        <div className="flex justify-center items-center gap-3 sm:gap-4 -mt-7 sm:-mt-9 mb-4">
          {Array.from({ length: orientation === 'landscape' ? 14 : 10 }).map((_, i) => (
            <div
              key={i}
              className="w-2.5 sm:w-3 h-5 sm:h-6 bg-gradient-to-b from-[#8C8276] via-[#D8D0C5] to-[#756A5E] rounded-full shadow-md border border-[#524B43]"
            />
          ))}
        </div>

        {/* PAGE 0: COVER */}
        {currentPageIndex === 0 && (
          <div className="bg-[#FAF7F2] p-6 sm:p-8 rounded-2xl border border-[#E8DFD3] min-h-[440px] flex flex-col justify-between text-center relative overflow-hidden">
            <div className="text-[11px] font-mono tracking-widest text-[#8C7D6E] uppercase">
              {calendar.giftRecipient === 'grandparents'
                ? 'Любимым бабушке и дедушке · Семейный календарь'
                : calendar.giftRecipient === 'grandma'
                ? 'Любимой бабушке · Семейный календарь'
                : calendar.giftRecipient === 'grandpa'
                ? 'Любимому дедушке · Семейный календарь'
                : `Семейный календарь · ${calendar.year}`}
            </div>

            <div className="my-4">
              <h1 className="font-editorial text-4xl sm:text-6xl font-bold text-[#2C2723] tracking-wide mb-1">
                МОЙ ГОД
              </h1>
              <div className="font-editorial text-2xl sm:text-3xl font-semibold text-[#A6533A]">
                {calendar.year}
              </div>
            </div>

            {/* Cover Photo - Clickable to advance */}
            <div
              onClick={nextPage}
              title="Нажмите, чтобы открыть январь"
              className="relative mx-auto w-48 sm:w-60 aspect-4/3 rounded-2xl overflow-hidden shadow-md border-2 border-white my-3 cursor-pointer group"
            >
              <img
                src={calendar.months[0]?.imageUrl || primaryChild?.avatarUrl}
                alt="Главная обложка"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                Листать дальше →
              </div>
            </div>

            <div>
              <div className="font-editorial text-xl font-bold text-[#2C2723]">
                {childrenNames}
              </div>
              <p className="text-xs text-[#7A6F63] font-editorial italic mt-1">
                {calendar.giftRecipient === 'grandparents' || calendar.giftRecipient === 'grandma' || calendar.giftRecipient === 'grandpa'
                  ? '12 месяцев с любимыми внуками. Каждый день рядом.'
                  : '12 месяцев. 12 историй. Один год твоего ребёнка.'}
              </p>

              {calendar.dedication.enabled && calendar.dedication.text && (
                <div className="mt-4 pt-3 border-t border-[#ECE4D8] text-[11px] text-[#554A40] italic max-w-xs mx-auto">
                  «{calendar.dedication.text}»
                  {calendar.dedication.author && (
                    <div className="text-[10px] text-[#938576] not-italic mt-0.5">
                      — {calendar.dedication.author}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="text-[9px] text-[#A6998B] mt-3">
              Титульная страница · Нажмите «Вперёд», чтобы листать
            </div>
          </div>
        )}

        {/* PAGES 1..12: MONTHS */}
        {currentPageIndex >= 1 && currentPageIndex <= 12 && (
          (() => {
            const month = calendar.months[currentPageIndex - 1];
            const days = getCalendarGridDays(calendar.year, month.monthNumber - 1);
            const dayNames = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

            return (
              <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl border border-[#E8DFD3] min-h-[440px] flex flex-col justify-between">
                {/* Month Heading */}
                <div className="flex items-baseline justify-between border-b border-[#ECE3D5] pb-2 mb-3">
                  <div>
                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2C2723] uppercase tracking-wide">
                      {month.monthName}
                    </h3>
                    <span className="text-[11px] text-[#A6533A] font-medium">
                      {month.themeTitle}
                    </span>
                  </div>
                  <div className="font-editorial text-lg text-[#857668]">
                    {calendar.year}
                  </div>
                </div>

                {/* Photo Frame */}
                <div className="relative aspect-16/10 rounded-xl overflow-hidden shadow-sm border border-[#E0D5C7] mb-3 bg-[#F0E9DF]">
                  <img
                    src={month.imageUrl}
                    alt={month.monthName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md">
                    {childrenNames}
                  </div>
                </div>

                {/* Story Caption */}
                <p className="font-editorial italic text-xs sm:text-sm text-[#4E443B] text-center mb-3">
                  «{month.storyCaption}»
                </p>

                {/* Russian Calendar Grid - CLICKABLE DATES */}
                <div className="bg-white p-3 rounded-xl border border-[#EBE2D4]">
                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#7A6F64] mb-1.5 pb-1 border-b border-[#F2ECE3]">
                    {dayNames.map((d, i) => (
                      <span key={d} className={i >= 5 ? 'text-[#A6533A]' : ''}>
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {days.map((day, idx) => {
                      const noteKey = `${month.monthNumber}_${day.dayNumber}`;
                      const hasNote = day.isCurrentMonth && customDayNotes[noteKey];

                      return (
                        <div
                          key={idx}
                          onClick={() => day.isCurrentMonth && openDayNoteModal(month.monthNumber, day.dayNumber)}
                          title={
                            day.isCurrentMonth
                              ? hasNote
                                ? `${day.dayNumber}: ${customDayNotes[noteKey]}`
                                : `Нажмите, чтобы добавить памятную дату на ${day.dayNumber} ${month.monthName}`
                              : undefined
                          }
                          className={`py-1 rounded-md transition-all relative ${
                            !day.isCurrentMonth
                              ? 'text-[#CCC2B5] cursor-default'
                              : 'cursor-pointer hover:bg-[#F3ECE1] active:scale-95'
                          } ${
                            day.isCurrentMonth && (day.isHoliday || day.isWeekend)
                              ? 'text-[#A6533A] font-semibold bg-[#FDF7F4]'
                              : day.isCurrentMonth
                              ? 'text-[#2C2723]'
                              : ''
                          } ${hasNote ? 'ring-1 ring-[#A6533A] bg-[#FAF2EB] font-bold' : ''}`}
                        >
                          <span>{day.dayNumber}</span>
                          {hasNote && (
                            <span className="block text-[8px] text-[#A6533A] truncate px-0.5 font-normal">
                              ★
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-[#A6998B] mt-2 pt-2 border-t border-[#F2ECE3]">
                  <span>МОЙ ГОД {calendar.year} · нажмите дату для отметки</span>
                  <span>{month.monthNumber} из 12</span>
                </div>
              </div>
            );
          })()
        )}

        {/* PAGE 13: YEAR SUMMARY COLLAGE - CLICKABLE MONTHS */}
        {currentPageIndex === 13 && (
          <div className="bg-[#FAF7F2] p-4 sm:p-6 rounded-2xl border border-[#E8DFD3] min-h-[440px] flex flex-col justify-between text-center">
            <div className="border-b border-[#ECE3D5] pb-2 mb-3">
              <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2C2723]">
                Наш {calendar.year} год
              </h3>
              <p className="text-xs text-[#827467]">
                12 историй маленького счастья · {childrenNames}
              </p>
            </div>

            {/* 12 Months Thumbnails Collage - Clicking any jumps to that month page */}
            <div className="grid grid-cols-4 gap-2 my-2">
              {calendar.months.map((m) => (
                <div
                  key={m.monthNumber}
                  onClick={() => setCurrentPageIndex(m.monthNumber)}
                  title={`Открыть ${m.monthName}`}
                  className="bg-white p-1 rounded-lg border border-[#E5DACD] hover:border-[#A6533A] cursor-pointer hover:shadow-xs transition-all text-left group"
                >
                  <div className="aspect-square rounded overflow-hidden mb-1 bg-[#F5EFE6]">
                    <img
                      src={m.imageUrl}
                      alt={m.monthName}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="text-[9px] font-bold text-[#2C2723] uppercase truncate group-hover:text-[#A6533A]">
                    {m.monthName}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[11px] text-[#6C6053] font-editorial italic mt-2">
              Пусть каждый год приносит столько же тепла, улыбок и радости.
            </div>

            <div className="text-[10px] text-[#A6998B] mt-2">
              Финальная страница · Нажмите на любую миниатюру для перехода
            </div>
          </div>
        )}

        {/* Page Turner Controls */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#F0E8DC]">
          <button
            onClick={prevPage}
            disabled={currentPageIndex === 0}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#D5C9BB] text-[#4E443B] disabled:text-[#C5BDB2] disabled:border-[#E8DFD3] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Назад</span>
          </button>

          <span className="text-xs font-mono text-[#8C7E70]">
            Страница {currentPageIndex + 1} из {totalPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPageIndex === totalPages - 1}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl border border-[#D5C9BB] text-[#4E443B] disabled:text-[#C5BDB2] disabled:border-[#E8DFD3] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
          >
            <span>Вперёд</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Interactive Day Note Modal */}
      {activeDayModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-[#FAF7F2] rounded-3xl p-5 border border-[#E8DFD3] shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#A6533A]" />
                <h4 className="font-editorial text-xl font-bold text-[#2C2723]">
                  {activeDayModal.dayNumber} число месяца
                </h4>
              </div>
              <button
                onClick={() => setActiveDayModal(null)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#70665D] hover:bg-[#EFE9DF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#70665D] mb-3">
              Добавьте семейное событие (день рождения, годовщину или поездку):
            </p>

            <input
              type="text"
              value={dayNoteInput}
              onChange={(e) => setDayNoteInput(e.target.value)}
              placeholder="Например: День рождения Артёма 🎂"
              className="w-full px-3 py-2 text-xs rounded-xl border border-[#DCD2C4] bg-white text-[#2C2723] focus:outline-hidden focus:border-[#A6533A] mb-4"
            />

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {['🎂 День рождения внука', '🎂 День рождения внучки', '👵 Юбилей бабушки', '👴 Юбилей дедушки', '🏡 Сбор всей семьи'].map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setDayNoteInput(sug)}
                  className="text-[10px] px-2 py-1 rounded-md bg-white border border-[#DDD3C7] text-[#4A4137] hover:border-[#A6533A]"
                >
                  {sug}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={saveDayNote}
                className="flex-1 py-2.5 bg-[#A6533A] hover:bg-[#924731] text-white text-xs font-semibold rounded-xl"
              >
                Сохранить в календарь
              </button>
              <button
                onClick={() => setActiveDayModal(null)}
                className="px-3 py-2.5 bg-[#EFE8DC] text-xs font-medium rounded-xl text-[#554A40]"
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-md mx-auto space-y-2">
          {/* Big Download PDF Button */}
          <button
            onClick={handleDownloadPDF}
            disabled={isExportingPDF}
            className="w-full py-4 bg-[#A6533A] hover:bg-[#924731] text-white font-semibold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-md shadow-[#A6533A]/20 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingPDF ? 'Формируем PDF...' : 'Скачать календарь'}</span>
          </button>
          
          <div className="text-[11px] text-center text-[#756A5F]">
            PDF в высоком качестве для печати
          </div>

          {/* Order Printed Physical Calendar CTA */}
          <button
            onClick={onOrderPrint}
            className="w-full py-2.5 bg-white hover:bg-[#FBF7F0] border border-[#DDD3C6] text-[#4A4137] text-xs font-medium rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[#A6533A]" />
            <span>Заказать печать календаря с доставкой</span>
          </button>
        </div>
      </div>
    </div>
  );
};
