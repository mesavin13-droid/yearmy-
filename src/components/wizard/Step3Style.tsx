import React from 'react';
import { Check } from 'lucide-react';
import { VisualStyleId } from '../../types/calendar';
import { VISUAL_STYLES } from '../../config/months';

interface Step3StyleProps {
  selectedStyleId: VisualStyleId;
  onSelectStyle: (styleId: VisualStyleId) => void;
  onNext: () => void;
}

export const Step3Style: React.FC<Step3StyleProps> = ({
  selectedStyleId,
  onSelectStyle,
  onNext,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <div className="text-center mb-8">
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Каким будет ваш год?
        </h2>
        <p className="text-xs sm:text-sm text-[#70665D] mt-2">
          Выберите стиль иллюстраций. Каждый месяц будет выдержан в единой эстетике.
        </p>
      </div>

      {/* Style Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {VISUAL_STYLES.map((style) => {
          const isSelected = selectedStyleId === style.id;

          return (
            <div
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              className={`cursor-pointer rounded-2xl p-4 border transition-all ${
                isSelected
                  ? 'bg-white border-[#2C2723] ring-2 ring-[#2C2723] shadow-md'
                  : 'bg-white border-[#ECE4D8] hover:border-[#D0C2B0]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{style.icon}</span>
                  <div>
                    <h3 className="text-sm font-bold text-[#2C2723]">{style.name}</h3>
                    <p className="text-[11px] text-[#8C5E47] font-medium">{style.tagline}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center border transition-colors ${
                    isSelected
                      ? 'bg-[#2C2723] border-[#2C2723] text-white'
                      : 'border-[#D5C9BB] bg-[#FAF8F5]'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                </div>
              </div>

              <div className="h-32 rounded-xl overflow-hidden mb-3 bg-[#F4EFE6] relative">
                <img
                  src={style.previewImage}
                  alt={style.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <p className="text-xs text-[#70665D] leading-relaxed mb-2">
                {style.description}
              </p>
              
              <div className="text-[10px] text-[#9A8E83] pt-2 border-t border-[#F2ECE3]">
                {style.palette}
              </div>
            </div>
          );
        })}
      </div>

      {/* Sticky Bottom Next Button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-md mx-auto">
          <button
            onClick={onNext}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 bg-[#A6533A] hover:bg-[#924731] text-white active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Настроить атмосферу</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
