import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Heart, Sparkles, ZoomIn, X, Calendar as CalendarIcon } from 'lucide-react';
import { MONTH_CONFIGS, VISUAL_STYLES } from '../config/months';
import { MonthConfig, VisualStyle, VisualStyleId } from '../types/calendar';

interface HeroProps {
  onStartNew: (preselectedStyle?: VisualStyleId) => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartNew }) => {
  const [selectedModalMonth, setSelectedModalMonth] = useState<MonthConfig | null>(null);

  return (
    <section className="relative pt-6 sm:pt-12 pb-16 overflow-hidden">
      {/* Background ambient warmth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-[#F3ECE1]/70 to-transparent -z-10 pointer-events-none rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Editorial Subheading Kicker */}
        <div className="inline-flex items-center gap-2 mb-4 text-xs tracking-widest uppercase text-[#8C5E47] font-semibold">
          <Heart className="w-3.5 h-3.5 fill-[#A6533A] text-[#A6533A]" />
          <span>Самый душевный подарок для бабушки и дедушки</span>
          <span className="text-[#D3C7B8]">·</span>
          <span className="flex items-center gap-1 text-[#5B795A]">
            <Sparkles className="w-3 h-3" />
            <span>AI Сюжеты с внуками</span>
          </span>
        </div>

        {/* Main Title */}
        <h1 className="font-editorial text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#2C2723] text-balance mb-4 sm:mb-6">
          Мой год
        </h1>

        {/* Subtitle */}
        <p className="font-editorial text-xl sm:text-3xl text-[#5C5146] font-normal text-balance mb-4 leading-snug">
          12 месяцев с любимыми внуками. Каждый день рядом.
        </p>

        {/* Additional Description */}
        <p className="max-w-xl mx-auto text-sm sm:text-base text-[#756A5F] leading-relaxed mb-8 text-balance">
          Подарите бабушке и дедушке настенный календарь, в котором их внуки улыбаются со страниц каждого месяца.
          Уютные праздничные сюжеты, памятные семейные даты и слова любви на весь год.
        </p>

        {/* Big Action CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
          <button
            onClick={() => onStartNew()}
            className="w-full sm:w-auto px-8 py-4 bg-[#A6533A] hover:bg-[#924731] active:scale-[0.98] text-white rounded-2xl font-semibold text-base shadow-md shadow-[#A6533A]/15 transition-all flex items-center justify-center gap-2.5 min-h-[52px] cursor-pointer"
          >
            <span>Создать календарь</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          
          <a
            href="#themes"
            className="w-full sm:w-auto px-6 py-4 bg-white/80 hover:bg-white text-[#5C5146] hover:text-[#2C2723] border border-[#E5DCD0] rounded-2xl font-medium text-sm transition-all flex items-center justify-center min-h-[52px]"
          >
            Посмотреть 12 сюжетов
          </a>
        </div>

        {/* Value Points (Zero-Pill clean metadata) */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-[#70665D] mb-12">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5B795A]" />
            <span>Сохраняет узнаваемость лица</span>
          </div>
          <span className="text-[#D3C7B8] hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5B795A]" />
            <span>Готов к печати 300 DPI</span>
          </div>
          <span className="text-[#D3C7B8] hidden sm:inline">·</span>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#5B795A]" />
            <span>Приватное хранение фото</span>
          </div>
        </div>

        {/* Mockup Showcase Card - Clickable */}
        <div
          onClick={() => onStartNew()}
          title="Нажмите, чтобы создать календарь"
          className="relative mx-auto max-w-2xl bg-white p-3 sm:p-5 rounded-3xl shadow-xl border border-[#ECE3D6] cursor-pointer group transition-all hover:shadow-2xl"
        >
          <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-[#F2EDE4]">
            <img
              src="/src/assets/images/calendar_hero_mockup_1791293013957.jpg"
              alt="Макет семейного настенного календаря Мой Год"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform group-hover:scale-[1.02] transition-transform duration-700"
            />
            
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/60 shadow-xs flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#A6533A]" />
              <span className="text-[11px] font-semibold text-[#2C2723] uppercase tracking-wider">
                Январь 2027 · Новогодняя сказка
              </span>
            </div>

            <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg border border-white/60 shadow-xs">
              <span className="text-[10px] text-[#5C5146] font-medium">
                Формат A4 / Настенный
              </span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#F2ECE3] flex items-center justify-between text-xs text-[#7A6F64]">
            <span className="font-editorial italic text-sm text-[#4E443B]">
              «Первый месяц нового года и самые долгожданные подарки.»
            </span>
            <span className="text-[11px] text-[#A6533A] font-semibold shrink-0 group-hover:underline">
              Нажмите, чтобы начать →
            </span>
          </div>
        </div>
      </div>

      {/* Section: How It Works */}
      <div id="how-it-works" className="max-w-4xl mx-auto px-4 sm:px-6 mt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A6533A]">
            Простой и понятный процесс
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2C2723] mt-1">
            Как создаётся ваш календарь
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => onStartNew()}
            className="bg-white p-5 rounded-2xl border border-[#ECE4D8] hover:border-[#A6533A] cursor-pointer transition-all hover:shadow-sm"
          >
            <span className="text-2xl font-editorial font-bold text-[#A6533A]">01.</span>
            <h3 className="text-sm font-semibold text-[#2C2723] mt-2 mb-1">
              Загрузите фото ребёнка
            </h3>
            <p className="text-xs text-[#70665D] leading-relaxed">
              1–3 обычных снимка из галереи телефона. Наш алгоритм аккуратно переносит черты лица без искажений.
            </p>
          </div>

          <div
            onClick={() => onStartNew()}
            className="bg-white p-5 rounded-2xl border border-[#ECE4D8] hover:border-[#A6533A] cursor-pointer transition-all hover:shadow-sm"
          >
            <span className="text-2xl font-editorial font-bold text-[#A6533A]">02.</span>
            <h3 className="text-sm font-semibold text-[#2C2723] mt-2 mb-1">
              Выберите стиль и год
            </h3>
            <p className="text-xs text-[#70665D] leading-relaxed">
              От фотореализма до сказочной иллюстрации. Мы создаём 12 уникальных сезонных сцен от января до декабря.
            </p>
          </div>

          <div
            onClick={() => onStartNew()}
            className="bg-white p-5 rounded-2xl border border-[#ECE4D8] hover:border-[#A6533A] cursor-pointer transition-all hover:shadow-sm"
          >
            <span className="text-2xl font-editorial font-bold text-[#A6533A]">03.</span>
            <h3 className="text-sm font-semibold text-[#2C2723] mt-2 mb-1">
              Получите готовый календарь
            </h3>
            <p className="text-xs text-[#70665D] leading-relaxed">
              Настройте сюжеты, добавьте семейное посвящение и скачайте макет для печати в качестве 300 DPI.
            </p>
          </div>
        </div>
      </div>

      {/* Section: 12 Month Themes Preview - FULLY CLICKABLE */}
      <div id="themes" className="max-w-4xl mx-auto px-4 sm:px-6 mt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A6533A]">
            12 месяцев · 12 историй
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2C2723] mt-1">
            Сюжет каждого месяца продуман до мелочей
          </h2>
          <p className="text-xs text-[#70665D] max-w-md mx-auto mt-2">
            Нажмите на любой месяц, чтобы открыть подробности праздничной сцены
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {MONTH_CONFIGS.map((month) => (
            <div
              key={month.number}
              onClick={() => setSelectedModalMonth(month)}
              className="bg-white p-3.5 rounded-2xl border border-[#ECE4D8] hover:border-[#A6533A] hover:shadow-md transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xl group-hover:scale-110 transition-transform">{month.icon}</span>
                <span className="text-[10px] font-mono font-bold text-[#A6533A]">
                  {String(month.number).padStart(2, '0')}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#2C2723] group-hover:text-[#A6533A] transition-colors">
                {month.name}
              </h4>
              <p className="text-[11px] text-[#A6533A] font-medium mb-1.5">{month.holidayTitle}</p>
              <p className="text-[10px] text-[#7A6F64] line-clamp-2 leading-relaxed">
                {month.themeDescription}
              </p>
              <div className="mt-2 pt-1 border-t border-[#F2ECE3] flex items-center justify-between text-[10px] text-[#8C7F72]">
                <span>Подробнее</span>
                <ZoomIn className="w-3 h-3 text-[#A6533A]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Visual Styles - FULLY CLICKABLE */}
      <div id="styles" className="max-w-4xl mx-auto px-4 sm:px-6 mt-20">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#A6533A]">
            Художественные стили
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2C2723] mt-1">
            Каким будет ваш год?
          </h2>
          <p className="text-xs text-[#70665D] mt-1">
            Нажмите на стиль, чтобы сразу начать календарь в этой эстетике
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {VISUAL_STYLES.map((st) => (
            <div
              key={st.id}
              onClick={() => onStartNew(st.id)}
              className="bg-white p-4 rounded-2xl border border-[#ECE4D8] hover:border-[#A6533A] hover:shadow-md transition-all cursor-pointer group text-left"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl group-hover:scale-110 transition-transform">{st.icon}</span>
                <div>
                  <h4 className="text-xs font-bold text-[#2C2723] group-hover:text-[#A6533A] transition-colors">
                    {st.name}
                  </h4>
                  <p className="text-[10px] text-[#8C5E47] font-medium">{st.tagline}</p>
                </div>
              </div>
              <p className="text-xs text-[#70665D] leading-relaxed mb-3">
                {st.description}
              </p>
              <div className="flex items-center justify-between text-[10px] text-[#A6533A] pt-2 border-t border-[#F2ECE3] font-semibold">
                <span>Выбрать стиль</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Month Details Modal */}
      {selectedModalMonth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 border border-[#E8DFD3] shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{selectedModalMonth.icon}</span>
                <div>
                  <h3 className="font-editorial text-2xl font-bold text-[#2C2723]">
                    {selectedModalMonth.name}
                  </h3>
                  <span className="text-xs font-semibold text-[#A6533A]">
                    {selectedModalMonth.holidayTitle}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedModalMonth(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#70665D] hover:bg-[#EFE9DF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-[#F2EDE4]">
              <img
                src={selectedModalMonth.mockSceneUrl}
                alt={selectedModalMonth.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 mb-6 text-xs text-[#554A40]">
              <div>
                <strong className="block text-[#2C2723] mb-0.5">Сюжет месяца:</strong>
                <p className="leading-relaxed">{selectedModalMonth.themeDescription}</p>
              </div>
              <div>
                <strong className="block text-[#2C2723] mb-0.5">История в календаре:</strong>
                <p className="font-editorial italic text-sm text-[#4E443B]">
                  «{selectedModalMonth.storyCaptionDefault}»
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                setSelectedModalMonth(null);
                onStartNew();
              }}
              className="w-full py-3.5 bg-[#A6533A] hover:bg-[#924731] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>Создать календарь с этим сюжетом</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom CTA Banner */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 mt-20">
        <div className="bg-[#FAF3EA] border border-[#E6DCCE] rounded-3xl p-6 sm:p-10 text-center shadow-xs">
          <h3 className="font-editorial text-2xl sm:text-3xl font-bold text-[#2C2723] mb-2">
            Подарите ребёнку его личную историю
          </h3>
          <p className="text-xs sm:text-sm text-[#70665D] max-w-md mx-auto mb-6">
            Календарь, который останется в памяти на всю жизнь и будет бережно храниться в семейном архиве.
          </p>
          <button
            onClick={() => onStartNew()}
            className="px-8 py-3.5 bg-[#A6533A] hover:bg-[#924731] active:scale-[0.98] text-white rounded-xl font-semibold text-sm shadow-xs transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <span>Начать создание календаря</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
