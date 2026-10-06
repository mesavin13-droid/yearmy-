import React from 'react';
import { Calendar as CalendarIcon, Check } from 'lucide-react';

interface Step2YearProps {
  selectedYear: number;
  onSelectYear: (year: number) => void;
  onNext: () => void;
}

export const Step2Year: React.FC<Step2YearProps> = ({
  selectedYear,
  onSelectYear,
  onNext,
}) => {
  const years = [2026, 2027, 2028];

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-6 pb-28 text-center">
      <div className="mb-8">
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Какой год создаём?
        </h2>
        <p className="text-xs sm:text-sm text-[#70665D] mt-2">
          Календарь рассчитает точную сетку дней недели и государственные праздники
        </p>
      </div>

      {/* Big Hero Card for Selected Year */}
      <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#ECE3D6] shadow-sm max-w-sm mx-auto mb-8 transition-transform hover:scale-[1.01]">
        <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-[#F6EFE5] flex items-center justify-center text-[#A6533A]">
          <CalendarIcon className="w-6 h-6" />
        </div>
        <div className="font-editorial text-6xl sm:text-7xl font-bold text-[#2C2723] tracking-tight">
          {selectedYear}
        </div>
        <div className="text-xs text-[#8A7C6E] font-medium mt-2">
          12 месяцев праздников и памятных дат
        </div>
      </div>

      {/* Year Selector Buttons */}
      <div className="flex items-center justify-center gap-3 max-w-xs mx-auto mb-8">
        {years.map((yr) => (
          <button
            key={yr}
            onClick={() => onSelectYear(yr)}
            className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all min-h-[48px] ${
              selectedYear === yr
                ? 'bg-[#2C2723] text-white shadow-xs scale-105'
                : 'bg-white border border-[#DDD3C6] text-[#5C5146] hover:bg-[#F7F2EA]'
            }`}
          >
            {yr}
          </button>
        ))}
      </div>

      {/* Sticky Bottom Next Button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-md mx-auto">
          <button
            onClick={onNext}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 bg-[#A6533A] hover:bg-[#924731] text-white active:scale-[0.98] transition-all shadow-sm"
          >
            <span>Выбрать стиль календаря</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
