import React from 'react';
import { Check, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { CalendarDedication, Person } from '../../../types/calendar';
import { TelegramService } from '../../../services/telegram';

interface StepDedicationScreenProps {
  dedication: CalendarDedication;
  people: Person[];
  year: number;
  onUpdateDedication: (d: CalendarDedication) => void;
  onNext: () => void;
}

export const StepDedicationScreen: React.FC<StepDedicationScreenProps> = ({
  dedication,
  people,
  year,
  onUpdateDedication,
  onNext,
}) => {
  const defaultText = `Нашему любимому ${people[0]?.name || 'малышу'}.\nПусть каждый день ${year} года будет маленьким счастливым приключением!\nМама и папа ❤️`;

  const handleToggle = () => {
    onUpdateDedication({
      ...dedication,
      enabled: !dedication.enabled,
      text: dedication.text || defaultText,
    });
    TelegramService.triggerHaptic('light');
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6 text-[#2C2723]">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Добавьте несколько слов
        </h1>
        <p className="text-xs sm:text-sm text-[#70665D] leading-relaxed max-w-sm mx-auto">
          Эта надпись останется с календарём на титульной странице на весь год.
        </p>
      </div>

      {/* Toggle card */}
      <div className="bg-white p-4 rounded-3xl border border-[#ECE4D8] shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-5 h-5 text-[#8C4A38]" />
          <div>
            <span className="text-xs font-bold text-[#2C2723] block">
              Памятное посвящение на обложке
            </span>
            <span className="text-[11px] text-[#7A6F64]">
              Тёплые слова от родителей или внуков
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleToggle}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
            dedication.enabled ? 'bg-[#8C4A38]' : 'bg-[#D6CDC2]'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
              dedication.enabled ? 'right-1' : 'left-1'
            }`}
          />
        </button>
      </div>

      {/* Dedication Text Card */}
      {dedication.enabled && (
        <div className="bg-white p-5 rounded-3xl border border-[#ECE4D8] shadow-xs space-y-3">
          <label className="block text-xs font-bold text-[#2C2723]">
            Текст посвящения:
          </label>
          <textarea
            rows={5}
            value={dedication.text || defaultText}
            onChange={(e) =>
              onUpdateDedication({
                ...dedication,
                text: e.target.value,
              })
            }
            className="w-full p-4 text-xs font-editorial text-base text-[#2C2723] rounded-2xl bg-[#FAF8F5] border border-[#D5C9BB] focus:bg-white focus:outline-hidden focus:border-[#8C4A38] leading-relaxed"
            placeholder={defaultText}
          />
          <p className="text-[11px] text-[#8E8377] text-right">
            Отобразится на первой странице календаря
          </p>
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
            <span>Выбрать формат</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
