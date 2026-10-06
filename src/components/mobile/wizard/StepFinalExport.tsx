import React, { useState } from 'react';
import { Download, Printer, CheckCircle2, Home, Share2, Sparkles, Heart } from 'lucide-react';
import { Calendar, CalendarMonth } from '../../../types/calendar';
import { TelegramService } from '../../../services/telegram';
import imgJan from '../../../assets/images/month_january_newyear_1791297609129.jpg';

interface StepFinalExportProps {
  calendar: Calendar;
  onOrderPrint: () => void;
  onGoHome: () => void;
}

export const StepFinalExport: React.FC<StepFinalExportProps> = ({
  calendar,
  onOrderPrint,
  onGoHome,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    TelegramService.triggerHaptic('medium');

    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      TelegramService.triggerHaptic('success');

      // Create dummy downloadable calendar file or trigger print
      const blob = new Blob(
        [
          `МОЙ ГОД — Семейный календарь ${calendar.year}\nФормат: ${calendar.formatSettings?.format || 'A3'}\nУчастники: ${calendar.title}\n\n12 месяцев готовы к высококачественной печати.`,
        ],
        { type: 'text/plain;charset=utf-8' }
      );
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Moy_God_Calendar_${calendar.year}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1200);
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-6 pb-28 space-y-6 text-[#2C2723]">
      {/* Success Badge & Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF4EC] text-[#8C4A38] text-[11px] font-semibold rounded-full border border-[#EFE2D2]">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#5B795A]" />
          <span>Календарь успешно сохранён</span>
        </div>

        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723] leading-tight">
          Ваш семейный календарь готов
        </h1>
        <p className="text-xs sm:text-sm text-[#70665D] max-w-sm mx-auto">
          12 тёплых месяцев вашей семьи собраны в высоком разрешении для печати.
        </p>
      </div>

      {/* Big Cover Mockup Preview */}
      <div className="bg-white p-5 rounded-3xl border border-[#ECE4D8] shadow-sm space-y-4 text-center">
        <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F5EFE6] border border-[#E5DCD0]">
          <img
            src={calendar.months[0]?.imageUrl || imgJan}
            alt="Обложка календаря"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 text-white text-left">
            <span className="font-editorial text-xs uppercase tracking-widest text-white/80 block">
              Настенный календарь · {calendar.year}
            </span>
            <span className="text-sm font-semibold">{calendar.title}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#7A6F64] px-1 pt-1">
          <span>Формат: <strong>{calendar.formatSettings?.format || 'A3'} (30×42 см)</strong></span>
          <span>12 месяцев + обложка</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Button 1: Download PDF */}
        <button
          type="button"
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="w-full py-4 px-6 bg-[#2C2723] hover:bg-[#433B35] active:scale-[0.98] text-white rounded-2xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isDownloading ? 'Формируем PDF…' : downloadSuccess ? 'PDF готов (скачан)' : 'Скачать PDF'}</span>
        </button>

        {/* Button 2: Order Print */}
        <button
          type="button"
          onClick={onOrderPrint}
          className="w-full py-4 px-6 bg-[#FAF4EC] hover:bg-[#F3ECE1] text-[#8C4A38] border border-[#E9DCB8] rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Заказать печать</span>
        </button>

        {/* Subtitle notice */}
        <p className="text-[11px] text-[#8E8377] text-center pt-1 leading-relaxed">
          Можно сохранить PDF и распечатать самостоятельно в любой удобной типографии или дома.
        </p>
      </div>

      {/* Return to Home */}
      <div className="pt-4 text-center">
        <button
          type="button"
          onClick={onGoHome}
          className="text-xs font-semibold text-[#5C5146] hover:text-[#2C2723] inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Вернуться на главную</span>
        </button>
      </div>
    </div>
  );
};
