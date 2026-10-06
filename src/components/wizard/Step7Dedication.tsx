import React, { useState } from 'react';
import { Heart, ArrowRight, BookHeart, Sparkles, Loader2, Check } from 'lucide-react';
import { CalendarDedication, Child, GiftRecipientType, formatChildrenNames } from '../../types/calendar';
import { generateAiDedicationText } from '../../services/imageProvider';
import { TelegramService } from '../../services/telegram';

interface Step7DedicationProps {
  dedication: CalendarDedication;
  childrenList: Child[];
  giftRecipient?: GiftRecipientType;
  onChangeDedication: (dedication: CalendarDedication) => void;
  onNext: () => void;
}

const DEDICATION_PRESETS = [
  {
    label: '👵👴 Любимым бабушке и дедушке',
    author: 'Любящие дети и внуки ❤️',
    tone: 'Невероятно трогательная благодарность за заботу и тепло',
  },
  {
    label: '👵 Дорогой бабушке',
    author: 'Твои внуки ❤️',
    tone: 'Огромная любовь, тепло, здоровье и радость',
  },
  {
    label: '👴 Любимому дедушке',
    author: 'Твои внуки и дети ❤️',
    tone: 'С уважением, благодарностью и крепким здоровьем',
  },
  {
    label: '🏡 Для всей семьи',
    author: 'Наша дружная семья ❤️',
    tone: 'Тёплая семейная память на весь год',
  },
];

export const Step7Dedication: React.FC<Step7DedicationProps> = ({
  dedication,
  childrenList,
  giftRecipient = 'grandparents',
  onChangeDedication,
  onNext,
}) => {
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);

  const childrenNames = formatChildrenNames(childrenList, true);

  const recipientLabel = giftRecipient === 'grandma'
    ? 'Любимой бабушке'
    : giftRecipient === 'grandpa'
    ? 'Любимому дедушке'
    : giftRecipient === 'godparents'
    ? 'Дорогим крёстным'
    : 'Любимым бабушке и дедушке';

  const defaultSample = `Дорогим и ${recipientLabel}!\nСпасибо за ваше бесконечное тепло, мудрость и самые сладкие объятия.\nПусть каждый день 2027 года дарит вам крепкое здоровье и сияющие улыбки!\nС любовью, ваши внуки ${childrenNames} ❤️`;

  const handleGenerateAi = async (tone?: string, customAuthor?: string) => {
    setIsGeneratingAi(true);
    TelegramService.triggerHaptic('medium');

    try {
      const generatedText = await generateAiDedicationText(
        childrenNames,
        2027,
        customAuthor || dedication.author || 'Ваши дети и внуки ❤️',
        giftRecipient
      );

      onChangeDedication({
        ...dedication,
        enabled: true,
        text: generatedText,
        author: customAuthor || dedication.author || 'Ваши дети и внуки ❤️',
      });
      TelegramService.triggerHaptic('success');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#A6533A] font-semibold uppercase tracking-wider mb-1">
          <Heart className="w-3.5 h-3.5 fill-[#A6533A]" />
          <span>Тёплые семейные слова</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Добавьте несколько слов от себя
        </h2>
        <p className="text-xs sm:text-sm text-[#70665D] mt-2">
          Посвящение будет напечатано на первой титульной странице календаря
        </p>
      </div>

      <div className="bg-white p-6 rounded-3xl border border-[#ECE3D6] shadow-sm mb-6">
        {/* Toggle enable switch */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F2ECE3]">
          <div className="flex items-center gap-2.5">
            <BookHeart className="w-4 h-4 text-[#A6533A]" />
            <span className="text-xs font-semibold text-[#2C2723]">
              Добавить посвящение в календарь
            </span>
          </div>

          <button
            type="button"
            onClick={() =>
              onChangeDedication({
                ...dedication,
                enabled: !dedication.enabled,
                text: dedication.text || defaultSample,
              })
            }
            className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden ${
              dedication.enabled ? 'bg-[#A6533A]' : 'bg-[#D6CDC2]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                dedication.enabled ? 'right-1' : 'left-1'
              }`}
            />
          </button>
        </div>

        {dedication.enabled && (
          <div className="space-y-4">
            {/* Quick AI Generator Toolbar */}
            <div className="bg-[#FAF7F2] p-3 rounded-2xl border border-[#EAE1D3]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#5A4F44] flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#A6533A]" />
                  <span>Помощь искусственного интеллекта:</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleGenerateAi()}
                  disabled={isGeneratingAi}
                  className="px-2.5 py-1 bg-[#A6533A] hover:bg-[#924731] text-white text-[11px] font-medium rounded-lg flex items-center gap-1 shadow-xs transition-colors"
                >
                  {isGeneratingAi ? (
                    <>
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>ИИ сочиняет...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3" />
                      <span>Написать с ИИ ✨</span>
                    </>
                  )}
                </button>
              </div>

              {/* Presets chips */}
              <div className="flex flex-wrap gap-1.5 pt-1 border-t border-[#EDE4D6]">
                {DEDICATION_PRESETS.map((pr) => (
                  <button
                    key={pr.label}
                    type="button"
                    onClick={() => handleGenerateAi(pr.tone, pr.author)}
                    disabled={isGeneratingAi}
                    className="text-[10px] font-medium px-2 py-1 rounded-md bg-white border border-[#DDD2C4] hover:border-[#A6533A] text-[#4E443B] transition-colors"
                  >
                    {pr.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dedication Textarea */}
            <div>
              <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                Текст посвящения:
              </label>
              <textarea
                value={dedication.text}
                onChange={(e) =>
                  onChangeDedication({
                    ...dedication,
                    text: e.target.value,
                  })
                }
                rows={4}
                placeholder={defaultSample}
                className="w-full p-3.5 text-xs rounded-xl border border-[#DCD2C4] bg-[#FAF8F5] text-[#2C2723] focus:bg-white focus:outline-hidden focus:border-[#A6533A] leading-relaxed"
              />
            </div>

            {/* Author Field */}
            <div>
              <label className="block text-xs font-medium text-[#4A423A] mb-1">
                Подпись (от кого):
              </label>
              <input
                type="text"
                value={dedication.author}
                onChange={(e) =>
                  onChangeDedication({
                    ...dedication,
                    author: e.target.value,
                  })
                }
                placeholder="Мама и папа ❤️"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DCD2C4] bg-[#FAF8F5] text-[#2C2723] focus:bg-white focus:outline-hidden focus:border-[#A6533A]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Next Button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-md mx-auto">
          <button
            onClick={onNext}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 bg-[#A6533A] hover:bg-[#924731] text-white active:scale-[0.98] transition-all shadow-sm cursor-pointer"
          >
            <span>Посмотреть весь год</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
