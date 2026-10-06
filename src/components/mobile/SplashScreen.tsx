import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import imgJan from '../../assets/images/month_january_newyear_1791297609129.jpg';

interface SplashScreenProps {
  onEnter: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onEnter }) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#FAF7F2] flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden">
      {/* Soft atmospheric background photograph */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={imgJan}
          alt="Календарь"
          className="w-full h-full object-cover opacity-20 filter blur-sm scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF7F2]/80 via-[#FAF7F2]/90 to-[#FAF7F2]" />
      </div>

      {/* Top subtle branding */}
      <div className="pt-4 text-center">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#8C4A38]/80">
          Семейный фотоальбом & печать
        </span>
      </div>

      {/* Center Typography Block */}
      <div className="max-w-md mx-auto text-center my-auto space-y-6">
        <h1 className="font-editorial text-5xl sm:text-7xl font-bold tracking-tight text-[#2C2723]">
          МОЙ ГОД
        </h1>

        <div className="w-12 h-0.5 bg-[#8C4A38]/30 mx-auto" />

        <div className="space-y-1.5 font-editorial text-xl sm:text-2xl text-[#5C5146] font-normal leading-relaxed">
          <p>12 месяцев.</p>
          <p>12 историй.</p>
          <p className="text-[#2C2723] font-medium">Один год вашей семьи.</p>
        </div>

        <p className="text-xs sm:text-sm text-[#7A6F64] max-w-xs mx-auto leading-relaxed pt-2">
          Персональный настенный календарь с живыми фотографиями любимых детей и близких.
        </p>
      </div>

      {/* Bottom Enter Button */}
      <div className="max-w-sm mx-auto w-full pb-4">
        <button
          type="button"
          onClick={onEnter}
          className="w-full py-4 px-6 bg-[#2C2723] hover:bg-[#433B35] active:scale-[0.98] text-white rounded-2xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Открыть альбом</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
