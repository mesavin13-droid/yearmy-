import React, { useState } from 'react';
import { Heart, RefreshCw, Edit3, X, Check, ArrowRight, Sparkles, ZoomIn, Loader2 } from 'lucide-react';
import { CalendarMonth, VisualStyleId, Person } from '../../../types/calendar';
import { currentImageProvider } from '../../../services/imageProvider';
import { TelegramService } from '../../../services/telegram';

interface StepReadyGalleryProps {
  year: number;
  months: CalendarMonth[];
  styleId: VisualStyleId;
  people: Person[];
  togetherMode: boolean;
  onUpdateMonth: (monthNumber: number, updated: CalendarMonth) => void;
  onNext: () => void;
}

const TWEAK_OPTIONS = [
  'Больше праздника',
  'Другая одежда',
  'Другой фон',
  'Более реалистично',
  'Больше семейного тепла',
];

export const StepReadyGallery: React.FC<StepReadyGalleryProps> = ({
  year,
  months,
  styleId,
  people,
  togetherMode,
  onUpdateMonth,
  onNext,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<CalendarMonth | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedTweak, setSelectedTweak] = useState<string>(TWEAK_OPTIONS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);

  const openMonthDetail = (m: CalendarMonth) => {
    setSelectedMonth(m);
    setIsEditing(false);
    TelegramService.triggerHaptic('light');
  };

  const handleToggleFavorite = (m: CalendarMonth) => {
    const updated = { ...m, isFavorite: !m.isFavorite };
    onUpdateMonth(m.monthNumber, updated);
    if (selectedMonth?.monthNumber === m.monthNumber) {
      setSelectedMonth(updated);
    }
    TelegramService.triggerHaptic('light');
  };

  const handleQuickRegenerate = async (m: CalendarMonth) => {
    setIsRegenerating(true);
    TelegramService.triggerHaptic('medium');

    try {
      const res = await currentImageProvider.regenerateMonthScene({
        year,
        monthNumber: m.monthNumber,
        styleId,
        mood: 'warm_family',
        children: people,
        togetherMode,
        currentMonth: m,
        tweakOption: 'Новый ракурс',
      });

      const updated: CalendarMonth = {
        ...m,
        imageUrl: res.imageUrl,
        storyCaption: res.storyCaption,
        builtPrompt: res.builtPrompt,
        version: m.version + 1,
      };

      onUpdateMonth(m.monthNumber, updated);
      setSelectedMonth(updated);
      TelegramService.triggerHaptic('success');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleRunCustomEdit = async () => {
    if (!selectedMonth) return;
    setIsRegenerating(true);
    TelegramService.triggerHaptic('medium');

    try {
      const res = await currentImageProvider.regenerateMonthScene({
        year,
        monthNumber: selectedMonth.monthNumber,
        styleId,
        mood: 'warm_family',
        children: people,
        togetherMode,
        currentMonth: selectedMonth,
        tweakOption: selectedTweak,
        userCustomPrompt: customPrompt,
      });

      const updated: CalendarMonth = {
        ...selectedMonth,
        imageUrl: res.imageUrl,
        storyCaption: res.storyCaption,
        builtPrompt: res.builtPrompt,
        version: selectedMonth.version + 1,
        regenerationPrompt: customPrompt || selectedTweak,
      };

      onUpdateMonth(selectedMonth.monthNumber, updated);
      setSelectedMonth(updated);
      setIsEditing(false);
      TelegramService.triggerHaptic('success');
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6 text-[#2C2723]">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Ваш год готов ❤️
        </h1>
        <p className="text-xs sm:text-sm text-[#70665D] leading-relaxed max-w-sm mx-auto">
          Мы собрали 12 историй вашей семьи. Нажмите на любой месяц, чтобы рассмотреть или изменить его.
        </p>
      </div>

      {/* 3x4 Grid of Months */}
      <div className="grid grid-cols-3 gap-2.5">
        {months.map((m) => (
          <button
            key={m.monthNumber}
            type="button"
            onClick={() => openMonthDetail(m)}
            className="group bg-white rounded-2xl p-2 border border-[#ECE4D8] hover:border-[#8C4A38] text-left transition-all shadow-2xs overflow-hidden cursor-pointer"
          >
            <div className="relative rounded-xl overflow-hidden aspect-[4/3] mb-1.5 bg-[#F5EFE6]">
              <img
                src={m.imageUrl}
                alt={m.monthName}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {m.isFavorite && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[9px]">
                  ♥
                </div>
              )}
            </div>
            <div className="px-0.5 space-y-0.5">
              <span className="font-editorial text-xs font-bold text-[#2C2723] block leading-tight">
                {m.monthName}
              </span>
              <span className="text-[10px] text-[#7A6F64] block truncate leading-tight">
                {m.themeTitle}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Fullscreen Month Detail Modal */}
      {selectedMonth && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#FAF7F2] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-5 border border-[#ECE4D8] space-y-4 max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <span className="font-editorial text-xs uppercase tracking-widest text-[#8C4A38] font-bold">
                {selectedMonth.monthName} · {year}
              </span>
              <button
                type="button"
                onClick={() => setSelectedMonth(null)}
                className="w-8 h-8 rounded-full bg-white border border-[#D5C9BB] flex items-center justify-center text-[#5C5146] hover:text-[#2C2723] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If Not Editing: Main Month View */}
            {!isEditing ? (
              <div className="space-y-4">
                {/* Big Image Card */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-black/5 border border-[#E5DCD0] shadow-sm">
                  <img
                    src={selectedMonth.imageUrl}
                    alt={selectedMonth.monthName}
                    className="w-full h-full object-cover"
                  />
                  {isRegenerating && (
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex flex-col items-center justify-center text-white gap-2">
                      <Loader2 className="w-8 h-8 animate-spin" />
                      <span className="text-xs font-medium">Создаём новый вариант…</span>
                    </div>
                  )}
                </div>

                {/* Typography Block */}
                <div className="space-y-1 text-center px-2">
                  <h3 className="font-editorial text-3xl font-bold text-[#2C2723] uppercase tracking-wide">
                    {selectedMonth.monthName}
                  </h3>
                  <span className="text-xs font-semibold text-[#8C4A38] block">
                    «{selectedMonth.themeTitle}»
                  </span>
                  <p className="text-xs text-[#5C5146] leading-relaxed pt-1">
                    «{selectedMonth.storyCaption}»
                  </p>
                </div>

                {/* Actions (♡ Нравится, ↻ Перегенерировать, ✏️ Изменить) */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#ECE4D8]">
                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(selectedMonth)}
                    className={`py-3 px-2 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      selectedMonth.isFavorite
                        ? 'bg-red-50 text-red-600 border-red-200'
                        : 'bg-white text-[#5C5146] border-[#ECE4D8] hover:border-[#D5C7B5]'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${selectedMonth.isFavorite ? 'fill-red-600' : ''}`} />
                    <span>Нравится</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRegenerate(selectedMonth)}
                    disabled={isRegenerating}
                    className="py-3 px-2 bg-white hover:bg-[#FAF8F5] text-[#5C5146] text-xs font-semibold rounded-2xl border border-[#ECE4D8] flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-4 h-4 text-[#8C4A38] ${isRegenerating ? 'animate-spin' : ''}`} />
                    <span>Обновить</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="py-3 px-2 bg-[#2C2723] hover:bg-[#433B35] text-white text-xs font-semibold rounded-2xl flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span>Изменить</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Editing Sub-View */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#2C2723]">
                    Изменить {selectedMonth.monthName.toLowerCase()}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="text-xs text-[#8E8377] hover:text-[#2C2723]"
                  >
                    Назад
                  </button>
                </div>

                {/* Quick Tweak Options */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-semibold text-[#5C5146]">
                    Что хотите изменить?
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {TWEAK_OPTIONS.map((tweak) => {
                      const isSelected = selectedTweak === tweak;
                      return (
                        <button
                          key={tweak}
                          type="button"
                          onClick={() => setSelectedTweak(tweak)}
                          className={`py-1.5 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#2C2723] text-white border-[#2C2723]'
                              : 'bg-white text-[#5C5146] border-[#ECE4D8] hover:border-[#D5C7B5]'
                          }`}
                        >
                          {tweak}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom text field */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-semibold text-[#5C5146]">
                    Напишите свой вариант:
                  </label>
                  <textarea
                    rows={3}
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Например: Хочу большую ёлку и камин на заднем плане."
                    className="w-full p-3 text-xs rounded-2xl bg-white border border-[#D5C9BB] focus:outline-hidden focus:border-[#8C4A38]"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleRunCustomEdit}
                  disabled={isRegenerating}
                  className="w-full py-3.5 bg-[#2C2723] hover:bg-[#433B35] text-white text-xs font-semibold rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {isRegenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Создаём новый вариант…</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Создать новый вариант</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sticky Bottom Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={onNext}
            className="w-full py-4 rounded-2xl text-sm font-semibold bg-[#2C2723] hover:bg-[#433B35] text-white active:scale-[0.98] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <span>Добавить посвящение</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
