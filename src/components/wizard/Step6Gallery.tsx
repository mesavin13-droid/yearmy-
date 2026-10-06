import React, { useState } from 'react';
import { RefreshCw, Check, X, Sparkles, Edit3, Heart, ArrowRight, ZoomIn, Loader2, FileCode2, Copy } from 'lucide-react';
import { Calendar, CalendarMonth, formatChildrenNames } from '../../types/calendar';
import { currentImageProvider } from '../../services/imageProvider';
import { buildMonthPrompt } from '../../services/promptBuilder';
import { TelegramService } from '../../services/telegram';
import { AiSettingsService } from '../../services/aiSettings';

interface Step6GalleryProps {
  calendar: Calendar;
  onUpdateMonth: (monthNumber: number, updatedMonth: CalendarMonth) => void;
  onNext: () => void;
}

const TWEAK_PRESETS = [
  'Сделать праздничнее и ярче',
  'Изменить фон и окружение',
  'Другая одежда и детали',
  'Более естественный свет',
  'Другой ракурс и композиция',
  'Свой точный запрос',
];

export const Step6Gallery: React.FC<Step6GalleryProps> = ({
  calendar,
  onUpdateMonth,
  onNext,
}) => {
  const [activeRegenMonth, setActiveRegenMonth] = useState<CalendarMonth | null>(null);
  const [selectedTweak, setSelectedTweak] = useState<string>(TWEAK_PRESETS[0]);
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [isRegenerating, setIsRegenerating] = useState<boolean>(false);
  const [editingCaptionMonth, setEditingCaptionMonth] = useState<number | null>(null);
  const [captionText, setCaptionText] = useState<string>('');
  const [isAiWritingCaption, setIsAiWritingCaption] = useState<boolean>(false);
  const [lightboxMonth, setLightboxMonth] = useState<CalendarMonth | null>(null);
  const [inspectPromptMonth, setInspectPromptMonth] = useState<CalendarMonth | null>(null);
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  const peopleNames = formatChildrenNames(calendar.children, calendar.togetherMode);

  const toggleFavorite = (month: CalendarMonth, e?: React.MouseEvent) => {
    e?.stopPropagation();
    onUpdateMonth(month.monthNumber, {
      ...month,
      isFavorite: !month.isFavorite,
    });
    TelegramService.triggerHaptic('light');
  };

  const openRegenerateModal = (month: CalendarMonth, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveRegenMonth(month);
    setSelectedTweak(TWEAK_PRESETS[0]);
    setCustomPrompt(month.regenerationPrompt || '');
  };

  const openPromptInspector = (month: CalendarMonth, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setInspectPromptMonth(month);
    setCopiedPrompt(false);
  };

  const handleRunRegeneration = async () => {
    if (!activeRegenMonth) return;
    setIsRegenerating(true);
    TelegramService.triggerHaptic('medium');

    try {
      const result = await currentImageProvider.regenerateMonthScene({
        year: calendar.year,
        monthNumber: activeRegenMonth.monthNumber,
        styleId: calendar.styleId,
        mood: calendar.mood,
        children: calendar.children,
        togetherMode: calendar.togetherMode,
        currentMonth: activeRegenMonth,
        tweakOption: selectedTweak,
        userCustomPrompt: customPrompt,
      });

      const updated: CalendarMonth = {
        ...activeRegenMonth,
        imageUrl: result.imageUrl,
        storyCaption: result.storyCaption,
        builtPrompt: result.builtPrompt,
        negativePrompt: result.negativePrompt,
        version: activeRegenMonth.version + 1,
        regenerationPrompt: selectedTweak === 'Свой точный запрос' ? customPrompt : selectedTweak,
      };

      onUpdateMonth(activeRegenMonth.monthNumber, updated);
      TelegramService.triggerHaptic('success');
      setActiveRegenMonth(null);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleAiGenerateCaption = async (month: CalendarMonth, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsAiWritingCaption(true);
    TelegramService.triggerHaptic('light');

    try {
      const res = await fetch('/api/ai/generate-story', {
        method: 'POST',
        headers: AiSettingsService.getApiHeaders(),
        body: JSON.stringify({
          monthName: month.monthName,
          holidayTitle: month.themeTitle,
          year: calendar.year,
          childNames: peopleNames,
          style: calendar.styleId,
          mood: calendar.mood,
          giftRecipient: calendar.giftRecipient,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.caption) {
          onUpdateMonth(month.monthNumber, {
            ...month,
            storyCaption: data.caption,
          });
          if (editingCaptionMonth === month.monthNumber) {
            setCaptionText(data.caption);
          }
          TelegramService.triggerHaptic('success');
        }
      }
    } catch (err) {
      console.warn('AI caption error:', err);
    } finally {
      setIsAiWritingCaption(false);
    }
  };

  const startEditCaption = (month: CalendarMonth, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingCaptionMonth(month.monthNumber);
    setCaptionText(month.storyCaption);
  };

  const saveEditedCaption = (monthNumber: number) => {
    const targetMonth = calendar.months.find((m) => m.monthNumber === monthNumber);
    if (targetMonth && captionText.trim()) {
      onUpdateMonth(monthNumber, {
        ...targetMonth,
        storyCaption: captionText.trim(),
      });
    }
    setEditingCaptionMonth(null);
  };

  const getFullBuiltPrompt = (month: CalendarMonth): string => {
    if (month.builtPrompt) return month.builtPrompt;
    const res = buildMonthPrompt({
      month: month.monthNumber,
      people: calendar.children,
      style: calendar.styleId,
      customRequest: month.regenerationPrompt || calendar.customRequest,
    });
    return res.fullPrompt;
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28">
      {/* Title */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#A6533A] font-semibold uppercase tracking-wider mb-1">
          <Heart className="w-3.5 h-3.5 fill-[#A6533A]" />
          <span>Все 12 сюжетов созданы</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-5xl font-bold text-[#2C2723]">
          Ваш {calendar.year} год готов ❤️
        </h2>
        <p className="text-xs sm:text-sm text-[#70665D] mt-2 max-w-lg mx-auto">
          Участники: <strong>{peopleNames}</strong> ({calendar.children.length} {calendar.children.length === 1 ? 'человек' : 'чел.'}).
          Нажмите на любой месяц, чтобы увеличить фото, поставить ♡, изменить сюжет или посмотреть AI-промпт.
        </p>
      </div>

      {/* 3x4 Grid on mobile, 4-column responsive grid - ALL CLICKABLE */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-8">
        {calendar.months.map((m) => {
          return (
            <div
              key={m.monthNumber}
              onClick={() => setLightboxMonth(m)}
              className="bg-white rounded-2xl border border-[#ECE4D8] overflow-hidden flex flex-col shadow-xs hover:border-[#A6533A] hover:shadow-md transition-all cursor-pointer group relative"
            >
              {/* Image Box */}
              <div className="relative aspect-4/3 bg-[#F4EFE6] overflow-hidden">
                <img
                  src={m.imageUrl}
                  alt={m.monthName}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                  {m.monthName}
                </div>

                {/* Top Action Icons: Heart & Zoom */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => toggleFavorite(m, e)}
                    className={`w-7 h-7 rounded-full backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer shadow-xs ${
                      m.isFavorite
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 hover:bg-white text-[#70665D] hover:text-red-500'
                    }`}
                    title={m.isFavorite ? 'В избранном' : 'Добавить в избранное'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${m.isFavorite ? 'fill-white' : ''}`} />
                  </button>

                  <div className="w-7 h-7 rounded-full bg-white/80 backdrop-blur-xs flex items-center justify-center text-[#2C2723] opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <h4 className="text-xs font-bold text-[#2C2723] group-hover:text-[#A6533A] transition-colors line-clamp-1">
                      {m.themeTitle}
                    </h4>
                  </div>

                  {/* Story caption */}
                  {editingCaptionMonth === m.monthNumber ? (
                    <div className="mt-1.5" onClick={(e) => e.stopPropagation()}>
                      <textarea
                        value={captionText}
                        onChange={(e) => setCaptionText(e.target.value)}
                        rows={2}
                        className="w-full p-1.5 text-[11px] rounded-lg border border-[#A6533A] bg-[#FAF8F5] text-[#2C2723]"
                      />
                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={() => saveEditedCaption(m.monthNumber)}
                          className="px-2 py-0.5 bg-[#2C2723] text-white text-[10px] rounded-md font-medium cursor-pointer"
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={(e) => handleAiGenerateCaption(m, e)}
                          className="px-2 py-0.5 bg-[#FAF3EA] text-[#A6533A] border border-[#E5DACD] text-[10px] rounded-md font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>ИИ</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p
                      onClick={(e) => startEditCaption(m, e)}
                      title="Нажмите, чтобы изменить подпись"
                      className="text-[11px] text-[#7A6F64] italic mt-0.5 line-clamp-2 leading-relaxed hover:text-[#2C2723]"
                    >
                      «{m.storyCaption}»
                    </p>
                  )}
                </div>

                {/* Actions Toolbar: Regenerate / Edit / Prompt */}
                <div className="mt-3 pt-2 border-t border-[#F3EDE4] flex items-center justify-between">
                  <button
                    onClick={(e) => openRegenerateModal(m, e)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-[#7A6F64] hover:text-[#A6533A] py-1 px-1.5 rounded-lg hover:bg-[#FAF4EC] transition-colors cursor-pointer"
                    title="Перегенерировать этот месяц с сохранением людей"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>↻ Заново</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={(e) => openPromptInspector(m, e)}
                      title="Посмотреть AI-промпт"
                      className="p-1 text-[#8C7E72] hover:text-[#2C2723] hover:bg-[#FAF4EC] rounded-md transition-colors cursor-pointer"
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => startEditCaption(m, e)}
                      className="p-1 text-[#A39688] hover:text-[#2C2723] hover:bg-[#FAF4EC] rounded-md transition-colors cursor-pointer"
                      title="Редактировать подпись"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox / Zoom & Details Modal */}
      {lightboxMonth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-5 border border-[#E8DFD3] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#ECE4D8]">
              <div>
                <h3 className="font-editorial text-2xl font-bold text-[#2C2723]">
                  {lightboxMonth.monthName} · {calendar.year}
                </h3>
                <span className="text-xs font-semibold text-[#A6533A]">
                  {lightboxMonth.themeTitle}
                </span>
              </div>
              <button
                onClick={() => setLightboxMonth(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#70665D] hover:bg-[#EFE9DF] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-4/3 rounded-2xl overflow-hidden mb-3 bg-[#F2EDE4] shadow-inner relative">
              <img
                src={lightboxMonth.imageUrl}
                alt={lightboxMonth.monthName}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => toggleFavorite(lightboxMonth, e)}
                className={`absolute top-3 right-3 px-3 py-1.5 rounded-full backdrop-blur-md text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md ${
                  lightboxMonth.isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-[#42362C]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${lightboxMonth.isFavorite ? 'fill-white' : ''}`} />
                <span>{lightboxMonth.isFavorite ? 'В избранном' : '♡ Нравится'}</span>
              </button>
            </div>

            {/* Story caption in Lightbox */}
            <div className="bg-white p-3.5 rounded-2xl border border-[#ECE4D8] mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-semibold text-[#554A40]">История месяца:</span>
                <button
                  onClick={() => handleAiGenerateCaption(lightboxMonth)}
                  disabled={isAiWritingCaption}
                  className="flex items-center gap-1 text-[11px] text-[#A6533A] font-medium hover:underline cursor-pointer"
                >
                  {isAiWritingCaption ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                  <span>Переписать с ИИ</span>
                </button>
              </div>
              <p className="font-editorial italic text-sm text-[#3E342C] leading-relaxed">
                «{lightboxMonth.storyCaption}»
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  const m = lightboxMonth;
                  setLightboxMonth(null);
                  openRegenerateModal(m);
                }}
                className="flex-1 py-3 bg-[#A6533A] hover:bg-[#924731] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>↻ Перегенерировать этот месяц</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const m = lightboxMonth;
                  setLightboxMonth(null);
                  openPromptInspector(m);
                }}
                className="px-3.5 py-3 bg-white border border-[#D5C9BB] text-[#4A4137] text-xs font-medium rounded-xl hover:bg-[#FAF7F2] cursor-pointer"
                title="Посмотреть полный AI-промпт"
              >
                <FileCode2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLightboxMonth(null)}
                className="px-4 py-3 bg-[#EFE8DC] text-[#4A4137] text-xs font-medium rounded-xl hover:bg-[#E5DCD0] cursor-pointer"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Regeneration Modal */}
      {activeRegenMonth && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="w-full max-w-md bg-[#FAF7F2] rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 border border-[#E8DFD3] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#A6533A]">
                  {activeRegenMonth.monthName} · {activeRegenMonth.themeTitle}
                </span>
                <h3 className="font-editorial text-2xl font-bold text-[#2C2723]">
                  Что изменить в сюжете?
                </h3>
                <p className="text-[11px] text-[#7A6D5E]">
                  Участники ({peopleNames}) и стиль сохраняются строго без изменений.
                </p>
              </div>
              <button
                onClick={() => setActiveRegenMonth(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#70665D] hover:bg-[#EFE9DF] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Presets */}
            <div className="space-y-2 mb-4">
              <label className="block text-xs font-medium text-[#4A423A]">
                Выберите направление изменений:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {TWEAK_PRESETS.map((preset) => {
                  const isSelected = selectedTweak === preset;
                  return (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setSelectedTweak(preset)}
                      className={`p-2.5 rounded-xl text-xs font-medium text-left transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2C2723] text-white shadow-xs'
                          : 'bg-white border border-[#DDD3C7] text-[#4E453D] hover:bg-[#F5EFE6]'
                      }`}
                    >
                      {preset}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Input */}
            <div className="mb-5">
              <label className="block text-xs font-medium text-[#4A423A] mb-1">
                Пожелание к генерации:
              </label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Например: добавьте пушистого рыжего кота рядом, больше огоньков на ёлке или перенести сцену на веранду..."
                rows={2}
                className="w-full p-3 text-xs rounded-xl border border-[#DCD2C4] bg-white text-[#2C2723] focus:outline-hidden focus:border-[#A6533A]"
              />
            </div>

            {/* Generate New Variant Button */}
            <button
              onClick={handleRunRegeneration}
              disabled={isRegenerating}
              className="w-full py-3.5 bg-[#A6533A] hover:bg-[#924731] disabled:bg-[#CDBFB0] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              {isRegenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Создаём новый вариант с ИИ...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Перегенерировать месяц</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Prompt Inspector Modal (Requirement 9) */}
      {inspectPromptMonth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-xl bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-[#E8DFD3] shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#ECE4D8]">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-5 h-5 text-[#A6533A]" />
                <div>
                  <h3 className="font-editorial text-xl font-bold text-[#2C2723]">
                    AI Prompt: {inspectPromptMonth.monthName} ({inspectPromptMonth.themeTitle})
                  </h3>
                  <p className="text-[10px] text-[#7A6F64]">
                    Универсальный промпт по формуле: People + References + Month + Style + Requirements
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectPromptMonth(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#70665D] hover:bg-[#EFE9DF] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-[#42362C]">Final Image Prompt:</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(getFullBuiltPrompt(inspectPromptMonth));
                    setCopiedPrompt(true);
                    TelegramService.triggerHaptic('light');
                    setTimeout(() => setCopiedPrompt(false), 2000);
                  }}
                  className="text-[11px] text-[#A6533A] hover:underline flex items-center gap-1 cursor-pointer font-medium"
                >
                  {copiedPrompt ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedPrompt ? 'Скопировано!' : 'Копировать'}</span>
                </button>
              </div>
              <pre className="p-3.5 bg-[#2C2723] text-[#EFEBE4] rounded-xl text-[11px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-64 border border-[#3F3934]">
                {getFullBuiltPrompt(inspectPromptMonth)}
              </pre>
            </div>

            <div className="mb-4">
              <span className="text-xs font-bold text-[#42362C] block mb-1">Negative Prompt:</span>
              <pre className="p-2.5 bg-[#F2EDE4] text-[#4A4137] rounded-xl text-[10px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap border border-[#DDD3C7]">
                {inspectPromptMonth.negativePrompt || 'extra people, duplicate person, duplicated face, merged faces, wrong identity, different child, different age, deformed face, distorted hands, extra fingers, missing fingers, unnatural anatomy, duplicate limbs, blurry face, plastic skin, artificial face, text, letters, numbers, watermark, logo'}
              </pre>
            </div>

            <button
              onClick={() => setInspectPromptMonth(null)}
              className="w-full py-2.5 bg-[#2C2723] text-white text-xs font-semibold rounded-xl hover:bg-[#433B35] cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      )}

      {/* Sticky Bottom Next Button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-md mx-auto">
          <button
            onClick={onNext}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 bg-[#A6533A] hover:bg-[#924731] text-white active:scale-[0.98] transition-all shadow-sm cursor-pointer"
          >
            <span>Добавить посвящение</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
