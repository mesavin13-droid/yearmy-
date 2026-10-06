import React from 'react';
import { Check } from 'lucide-react';
import { VisualStyleId } from '../../../types/calendar';
import { TelegramService } from '../../../services/telegram';
import imgJan from '../../../assets/images/month_january_newyear_1791297609129.jpg';
import imgOct from '../../../assets/images/month_october_autumnleaves_1791297729421.jpg';
import imgDec from '../../../assets/images/month_december_treecraft_1791297756442.jpg';
import imgNov from '../../../assets/images/month_november_cozyhome_1791297742325.jpg';

interface StepStyleSelectProps {
  selectedStyle: VisualStyleId;
  onSelectStyle: (style: VisualStyleId) => void;
  onNext: () => void;
}

interface StyleOption {
  id: VisualStyleId;
  title: string;
  subtitle: string;
  image: string;
}

const STYLE_OPTIONS: StyleOption[] = [
  {
    id: 'realistic',
    title: 'Фотореализм',
    subtitle: 'Как настоящая семейная фотосессия',
    image: imgOct,
  },
  {
    id: 'fairytale',
    title: 'Сказочный',
    subtitle: 'Немного волшебства',
    image: imgJan,
  },
  {
    id: 'cinematic',
    title: 'Кино',
    subtitle: 'Как кадр из фильма',
    image: imgNov,
  },
  {
    id: '3D animation',
    title: '3D',
    subtitle: 'Мультяшная семейная история',
    image: imgDec,
  },
];

export const StepStyleSelect: React.FC<StepStyleSelectProps> = ({
  selectedStyle,
  onSelectStyle,
  onNext,
}) => {
  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6">
      {/* Title */}
      <div className="text-center space-y-2">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Каким будет ваш год?
        </h1>
        <p className="text-xs sm:text-sm text-[#70665D] leading-relaxed max-w-sm mx-auto">
          Выберите художественный стиль для фотографий каждого месяца.
        </p>
      </div>

      {/* 2-Column Style Cards */}
      <div className="grid grid-cols-2 gap-3.5">
        {STYLE_OPTIONS.map((opt) => {
          const isSelected =
            selectedStyle === opt.id ||
            (opt.id === 'realistic' && (selectedStyle === 'photorealism' || selectedStyle === 'premium family photography'));

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => {
                onSelectStyle(opt.id);
                TelegramService.triggerHaptic('light');
              }}
              className={`rounded-3xl p-3 text-left border transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative shadow-xs ${
                isSelected
                  ? 'bg-white border-[#2C2723] ring-2 ring-[#2C2723]'
                  : 'bg-white border-[#ECE4D8] hover:border-[#CDBFB0]'
              }`}
            >
              {/* Photo */}
              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-3 bg-[#F5EFE6]">
                <img
                  src={opt.image}
                  alt={opt.title}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-[#2C2723] text-white rounded-full flex items-center justify-center shadow-xs">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Text */}
              <div className="space-y-0.5 px-0.5">
                <h3 className="font-editorial text-lg font-bold text-[#2C2723] leading-tight">
                  {opt.title}
                </h3>
                <p className="text-[11px] text-[#7A6F64] leading-snug">
                  «{opt.subtitle}»
                </p>
              </div>
            </button>
          );
        })}
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
