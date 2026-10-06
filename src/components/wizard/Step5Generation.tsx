import React, { useEffect, useState } from 'react';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { Calendar, CalendarMonth, formatChildrenNames } from '../../types/calendar';
import { MONTH_CONFIGS } from '../../config/months';
import { currentImageProvider } from '../../services/imageProvider';
import { TelegramService } from '../../services/telegram';

interface Step5GenerationProps {
  calendar: Calendar;
  onGenerationComplete: (generatedMonths: CalendarMonth[]) => void;
}

export const Step5Generation: React.FC<Step5GenerationProps> = ({
  calendar,
  onGenerationComplete,
}) => {
  const [currentMonthIndex, setCurrentMonthIndex] = useState(0);
  const [completedMonths, setCompletedMonths] = useState<CalendarMonth[]>([]);
  const [isGenerating, setIsGenerating] = useState(true);

  const childrenNames = formatChildrenNames(calendar.children, calendar.togetherMode);

  useEffect(() => {
    let isCancelled = false;

    async function runGeneration() {
      // 1 single batch call for all 12 months (avoids 429 quota exhaustion)
      let batchCaptions: Record<number, string> = {};
      try {
        batchCaptions = await currentImageProvider.generateBatchStories(
          calendar.year,
          childrenNames,
          calendar.giftRecipient || 'grandparents'
        );
      } catch (e) {
        console.warn('Batch generation fallback:', e);
      }

      if (isCancelled) return;

      const generatedList: CalendarMonth[] = [];

      for (let i = 0; i < MONTH_CONFIGS.length; i++) {
        if (isCancelled) return;
        setCurrentMonthIndex(i);

        const config = MONTH_CONFIGS[i];
        const caption = batchCaptions[config.number] || config.storyCaptionDefault;

        const result = await currentImageProvider.generateMonthScene({
          year: calendar.year,
          monthNumber: config.number,
          styleId: calendar.styleId,
          mood: calendar.mood,
          children: calendar.children,
          togetherMode: calendar.togetherMode,
          giftRecipient: calendar.giftRecipient,
          customPrompt: calendar.customRequest,
          pregeneratedCaption: caption,
        });

        if (isCancelled) return;

        const newMonth: CalendarMonth = {
          monthNumber: config.number,
          monthName: config.name,
          themeTitle: config.holidayTitle,
          imageUrl: result.imageUrl,
          storyCaption: result.storyCaption,
          builtPrompt: result.builtPrompt,
          negativePrompt: result.negativePrompt,
          version: 1,
        };

        generatedList.push(newMonth);
        setCompletedMonths([...generatedList]);
        TelegramService.triggerHaptic('light');

        // Smooth visual pacing for realistic generation feeling
        await new Promise((res) => setTimeout(res, 120));
      }

      if (!isCancelled) {
        setIsGenerating(false);
        TelegramService.triggerHaptic('success');
        // Short pause to view all 12 completed checkmarks
        setTimeout(() => {
          onGenerationComplete(generatedList);
        }, 600);
      }
    }

    runGeneration();

    return () => {
      isCancelled = true;
    };
  }, [calendar, onGenerationComplete]);

  const currentConfig = MONTH_CONFIGS[currentMonthIndex] || MONTH_CONFIGS[0];
  const progressPercent = Math.round((completedMonths.length / 12) * 100);

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-8 text-center pb-20">
      {/* Editorial Title */}
      <div className="mb-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#A6533A] mb-1 block">
          Идёт создание иллюстраций
        </span>
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Создаём ваш {calendar.year} год
        </h2>
        <p className="text-xs sm:text-sm text-[#70665D] mt-1.5">
          Главный герой: <strong className="text-[#2C2723]">{childrenNames}</strong>
        </p>
      </div>

      {/* Big Animated Active Month Card */}
      <div className="bg-white p-6 rounded-3xl border border-[#ECE3D6] shadow-sm mb-6 max-w-sm mx-auto">
        <div className="text-4xl mb-2 animate-bounce">
          {currentConfig.icon}
        </div>
        <div className="text-xs font-bold uppercase tracking-wider text-[#A6533A] mb-0.5">
          {isGenerating ? `Создаём ${currentConfig.name.toLowerCase()}...` : 'Все месяцы готовы!'}
        </div>
        <h3 className="font-editorial text-2xl font-bold text-[#2C2723]">
          {currentConfig.name}
        </h3>
        <p className="text-xs text-[#85776B] font-medium mt-1">
          {currentConfig.holidayTitle}
        </p>
        <p className="text-[11px] text-[#A39688] mt-2 italic leading-relaxed">
          «{currentConfig.storyCaptionDefault}»
        </p>

        {/* Linear Progress Bar */}
        <div className="w-full bg-[#F0E9DF] rounded-full h-2 mt-5 overflow-hidden">
          <div
            className="bg-[#A6533A] h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-[11px] font-mono text-[#8C7F72] mt-2">
          {completedMonths.length} из 12 месяцев ({progressPercent}%)
        </div>
      </div>

      {/* Month-by-month progress checklist */}
      <div className="bg-white p-4 rounded-2xl border border-[#ECE4D8] max-w-md mx-auto text-left">
        <div className="text-xs font-semibold text-[#4A4137] mb-2.5 px-1">
          Ход работы над календарём:
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {MONTH_CONFIGS.map((m, idx) => {
            const isDone = completedMonths.some((cm) => cm.monthNumber === m.number);
            const isCurrent = currentMonthIndex === idx && isGenerating;

            return (
              <div
                key={m.number}
                className={`p-2 rounded-xl flex items-center justify-between transition-colors ${
                  isDone
                    ? 'bg-[#F5F9F4] text-[#2C5229]'
                    : isCurrent
                    ? 'bg-[#FBF6EE] text-[#A6533A] font-semibold'
                    : 'text-[#B0A598] bg-[#FAF8F5]'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-sm">{m.icon}</span>
                  <span className="truncate">{m.name}</span>
                </div>

                <div className="shrink-0 ml-1">
                  {isDone ? (
                    <Check className="w-3.5 h-3.5 text-[#4D8249] stroke-[2.5]" />
                  ) : isCurrent ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-[#A6533A]" />
                  ) : (
                    <span className="text-[10px] text-[#C2B7AA]">·</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
