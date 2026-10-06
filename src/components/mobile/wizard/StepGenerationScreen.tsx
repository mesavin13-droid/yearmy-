import React, { useState, useEffect } from 'react';
import { Check, Loader2, Sparkles, Heart } from 'lucide-react';
import { CalendarMonth, Person, VisualStyleId, GiftRecipientType } from '../../../types/calendar';
import { MONTH_PROMPTS } from '../../../data/monthPrompts';
import { currentImageProvider } from '../../../services/imageProvider';
import { TelegramService } from '../../../services/telegram';

interface StepGenerationScreenProps {
  year: number;
  styleId: VisualStyleId;
  mood: string;
  giftRecipient: GiftRecipientType;
  people: Person[];
  togetherMode: boolean;
  onGenerationComplete: (months: CalendarMonth[]) => void;
}

export const StepGenerationScreen: React.FC<StepGenerationScreenProps> = ({
  year,
  styleId,
  mood,
  giftRecipient,
  people,
  togetherMode,
  onGenerationComplete,
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(0);
  const [generatedMonths, setGeneratedMonths] = useState<CalendarMonth[]>([]);

  useEffect(() => {
    let isCancelled = false;

    async function runGeneration() {
      // 1. Batch generate stories
      const names = people.map((p) => p.name).join(', ') || 'семьи';
      let batchCaptions: Record<number, string> = {};
      try {
        batchCaptions = await currentImageProvider.generateBatchStories(
          year,
          names,
          giftRecipient
        );
      } catch {
        // fallback
      }

      const results: CalendarMonth[] = [];

      for (let i = 0; i < MONTH_PROMPTS.length; i++) {
        if (isCancelled) return;
        setCurrentMonthIndex(i);

        const config = MONTH_PROMPTS[i];
        const res = await currentImageProvider.generateMonthScene({
          year,
          monthNumber: config.month,
          styleId,
          mood,
          giftRecipient,
          children: people,
          togetherMode,
          pregeneratedCaption: batchCaptions[config.month],
        });

        const monthObj: CalendarMonth = {
          monthNumber: config.month,
          monthName: config.name,
          themeTitle: config.theme,
          imageUrl: res.imageUrl,
          storyCaption: res.storyCaption,
          builtPrompt: res.builtPrompt,
          negativePrompt: res.negativePrompt,
          version: 1,
        };

        results.push(monthObj);
        setGeneratedMonths([...results]);
        TelegramService.triggerHaptic('light');

        // Smooth aesthetic step delay
        await new Promise((r) => setTimeout(r, 450));
      }

      if (!isCancelled) {
        TelegramService.triggerHaptic('success');
        onGenerationComplete(results);
      }
    }

    runGeneration();

    return () => {
      isCancelled = true;
    };
  }, []);

  const currentMonthConfig = MONTH_PROMPTS[currentMonthIndex] || MONTH_PROMPTS[0];
  const progressPercent = Math.min(100, Math.round(((currentMonthIndex + 1) / 12) * 100));

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-5 pb-16 space-y-6 text-[#2C2723]">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Создаём ваш год
        </h1>
        <p className="text-xs sm:text-sm text-[#70665D]">
          Создаём вашу историю…
        </p>
      </div>

      {/* Big Preview Photo Card */}
      <div className="bg-white p-4 rounded-3xl border border-[#ECE4D8] shadow-xs space-y-3 overflow-hidden">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F5EFE6]">
          <img
            src={currentMonthConfig.mockSceneUrl}
            alt={currentMonthConfig.name}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-white flex items-end justify-between">
            <div>
              <span className="font-editorial text-xs uppercase tracking-widest text-white/80 block">
                {currentMonthConfig.name}
              </span>
              <span className="text-sm font-semibold">«{currentMonthConfig.theme}»</span>
            </div>
            <span className="text-xs bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Dynamic Month Text */}
        <div className="text-center py-1">
          <span className="font-editorial text-2xl font-bold text-[#2C2723] block">
            {currentMonthConfig.name}
          </span>
          <span className="text-xs text-[#7A6F64]">
            {currentMonthConfig.storyCaptionDefault}
          </span>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full bg-[#EFE8DE] h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-[#2C2723] h-full transition-all duration-300 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Minimalist Months Check List (2 columns) */}
      <div className="bg-white rounded-3xl p-5 border border-[#ECE4D8] shadow-xs space-y-2">
        <div className="text-xs font-bold text-[#5C5146] mb-2">
          12 глав вашего года:
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          {MONTH_PROMPTS.map((m, idx) => {
            const isDone = idx < currentMonthIndex || (idx === currentMonthIndex && progressPercent === 100);
            const isCurrent = idx === currentMonthIndex && progressPercent < 100;

            return (
              <div
                key={m.month}
                className={`flex items-center gap-2 transition-colors ${
                  isDone
                    ? 'text-[#2C2723] font-semibold'
                    : isCurrent
                    ? 'text-[#8C4A38] font-bold'
                    : 'text-[#B0A599]'
                }`}
              >
                {isDone ? (
                  <span className="w-4 h-4 rounded-full bg-[#5B795A] text-white flex items-center justify-center text-[10px] shrink-0">
                    ✓
                  </span>
                ) : isCurrent ? (
                  <span className="w-4 h-4 rounded-full border-2 border-[#8C4A38] border-t-transparent animate-spin shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full border border-[#D5C9BB] shrink-0 text-center text-[10px] leading-3 text-transparent">
                    ○
                  </span>
                )}
                <span>{m.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
