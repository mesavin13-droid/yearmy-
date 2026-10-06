import React from 'react';
import { Sparkles, Check, Heart } from 'lucide-react';

interface Step4MoodProps {
  selectedMood: string;
  onSelectMood: (mood: string) => void;
  customWishes: string;
  onChangeCustomWishes: (wishes: string) => void;
  onStartGeneration: () => void;
}

const MOOD_OPTIONS = [
  {
    id: 'warm_family',
    title: 'Тёплое и семейное',
    desc: 'Домашний уют, искренние улыбки, мягкий рассеянный свет и ощущение безопасности.',
    emoji: '🏡',
  },
  {
    id: 'festive_bright',
    title: 'Праздничное и яркое',
    desc: 'Торжественные огни, нарядная одежда, подарки, цветы и радостное предвкушение чуда.',
    emoji: '🎉',
  },
  {
    id: 'gentle_calm',
    title: 'Спокойное и нежное',
    desc: 'Пастельные тона, натуральные ткани, чистый дневной воздух и гармония.',
    emoji: '🕊️',
  },
  {
    id: 'adventure_curious',
    title: 'Приключенческое',
    desc: 'Путешествия, прогулки на природе, любознательность и открытый взгляд на мир.',
    emoji: '🧭',
  },
];

export const Step4Mood: React.FC<Step4MoodProps> = ({
  selectedMood,
  onSelectMood,
  customWishes,
  onChangeCustomWishes,
  onStartGeneration,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28">
      <div className="text-center mb-8">
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Настроение вашего года
        </h2>
        <p className="text-xs sm:text-sm text-[#70665D] mt-2">
          Выберите общее эмоциональное звучание сюжетов или добавьте свои пожелания
        </p>
      </div>

      {/* Mood Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {MOOD_OPTIONS.map((m) => {
          const isSelected = selectedMood === m.id;

          return (
            <div
              key={m.id}
              onClick={() => onSelectMood(m.id)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-white border-[#2C2723] ring-2 ring-[#2C2723] shadow-xs'
                  : 'bg-white border-[#ECE4D8] hover:border-[#D0C2B0]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{m.emoji}</span>
                  <h3 className="text-xs font-bold text-[#2C2723]">{m.title}</h3>
                </div>
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center border ${
                    isSelected
                      ? 'bg-[#2C2723] border-[#2C2723] text-white'
                      : 'border-[#D5C9BB] bg-[#FAF8F5]'
                  }`}
                >
                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                </div>
              </div>
              <p className="text-xs text-[#70665D] leading-relaxed">
                {m.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Custom Request Input */}
      <div className="bg-white p-5 rounded-3xl border border-[#ECE4D8] mb-8 shadow-xs">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#A6533A]" />
          <label className="text-xs font-bold text-[#2C2723]">
            Что хотите изменить в сюжетах? (необязательно)
          </label>
        </div>
        <textarea
          value={customWishes}
          onChange={(e) => onChangeCustomWishes(e.target.value)}
          placeholder="Например: Хочу, чтобы дети были возле большой ёлки, или добавить рыжего кота, или сделать акцент на книгах и дачном саде..."
          rows={3}
          className="w-full p-3.5 text-xs rounded-xl border border-[#DCD2C4] bg-[#FAF8F5] text-[#2C2723] focus:bg-white focus:outline-hidden focus:border-[#A6533A] leading-relaxed transition-colors"
        />
        <div className="flex items-center justify-between text-[10px] text-[#8C7F72] mt-2">
          <span>Этот текст будет добавлен в блок USER CUSTOM REQUEST для всех 12 месяцев</span>
          <span className="font-mono text-[#A6533A]">12/12 месяцев</span>
        </div>
      </div>

      {/* Sticky Bottom Generation Button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-md mx-auto">
          <button
            onClick={onStartGeneration}
            className="w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 bg-[#A6533A] hover:bg-[#924731] text-white active:scale-[0.98] transition-all shadow-md shadow-[#A6533A]/20"
          >
            <Sparkles className="w-4 h-4" />
            <span>Создать 12 месяцев</span>
          </button>
        </div>
      </div>
    </div>
  );
};
