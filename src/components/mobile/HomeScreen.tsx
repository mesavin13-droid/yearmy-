import React from 'react';
import { ArrowRight, User, Calendar as CalendarIcon, Heart, Sparkles, Plus, CheckCircle2 } from 'lucide-react';
import { Calendar } from '../../types/calendar';
import imgJan from '../../assets/images/month_january_newyear_1791297609129.jpg';
import imgMar from '../../assets/images/month_march_womensday_1791297634548.jpg';
import imgOct from '../../assets/images/month_october_autumnleaves_1791297729421.jpg';

interface HomeScreenProps {
  onStartNew: () => void;
  onOpenCalendar: (cal: Calendar) => void;
  onOpenProfile: () => void;
  savedCalendars: Calendar[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartNew,
  onOpenCalendar,
  onOpenProfile,
  savedCalendars,
}) => {
  const latestCalendar = savedCalendars[0];

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 text-[#2C2723]">
      {/* Top Header */}
      <header className="sticky top-0 z-20 bg-[#FAF7F2]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-[#ECE4D8]/70 flex items-center justify-between max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-editorial text-2xl font-bold tracking-tight text-[#2C2723]">
            Мой год
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenProfile}
          className="w-9 h-9 rounded-full bg-[#EFE8DE] hover:bg-[#E5DCD0] flex items-center justify-center text-[#5C5146] transition-colors cursor-pointer border border-[#DDD2C4]"
          aria-label="Профиль"
        >
          <User className="w-4 h-4" />
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* Main Hero Block */}
        <div className="bg-white rounded-3xl p-6 border border-[#E9DFC3] shadow-xs space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FAF4EC] text-[#8C4A38] text-[11px] font-semibold rounded-full border border-[#EFE2D2]">
            <Heart className="w-3 h-3 fill-[#8C4A38]" />
            <span>Семейный календарь на 12 месяцев</span>
          </div>

          <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723] leading-tight">
            Создайте календарь<br />с вашей семьёй
          </h1>

          <p className="text-xs sm:text-sm text-[#70665D] leading-relaxed">
            Загрузите фотографии — мы превратим каждый месяц в отдельную тёплую историю.
          </p>

          <button
            type="button"
            onClick={onStartNew}
            className="w-full py-4 px-6 bg-[#2C2723] hover:bg-[#433B35] active:scale-[0.98] text-white rounded-2xl font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Создать календарь</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Big Beautiful Mockup Card */}
        <div className="bg-white rounded-3xl p-4 border border-[#ECE4D8] overflow-hidden shadow-xs">
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-[#F5EFE6]">
            <img
              src={imgJan}
              alt="Январь — Новый год"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-3 right-3 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-editorial text-xs uppercase tracking-widest text-white/80 block">
                    Январь · 2027
                  </span>
                  <span className="text-sm font-semibold">Новогодняя сказка и тёплые объятия</span>
                </div>
                <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-medium">
                  Настенный А3
                </span>
              </div>
            </div>
          </div>

          {/* Mini thumbnails strip */}
          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
              <img src={imgMar} alt="Март" className="w-full h-full object-cover" />
              <div className="absolute bottom-1 left-1.5 text-[10px] font-bold text-white drop-shadow-sm">
                Март 🌷
              </div>
            </div>
            <div className="relative rounded-xl overflow-hidden aspect-[4/3]">
              <img src={imgOct} alt="Октябрь" className="w-full h-full object-cover" />
              <div className="absolute bottom-1 left-1.5 text-[10px] font-bold text-white drop-shadow-sm">
                Октябрь 🍂
              </div>
            </div>
            <button
              type="button"
              onClick={onStartNew}
              className="rounded-xl border-2 border-dashed border-[#D5C9BB] bg-[#FAF8F5] hover:bg-white flex flex-col items-center justify-center p-2 text-center text-[#5C5146] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#8C4A38] mb-0.5" />
              <span className="text-[10px] font-medium leading-tight">12 историй</span>
            </button>
          </div>
        </div>

        {/* Section: Ваши календари */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-[#2C2723]">Ваши календари</h2>
            {savedCalendars.length > 0 && (
              <span className="text-xs text-[#8E8377]">{savedCalendars.length} готово</span>
            )}
          </div>

          {savedCalendars.length > 0 ? (
            <div className="space-y-3">
              {savedCalendars.map((cal) => (
                <div
                  key={cal.id}
                  className="bg-white p-4 rounded-2xl border border-[#ECE4D8] flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={cal.months[0]?.imageUrl || imgJan}
                      alt={cal.title}
                      className="w-14 h-14 rounded-xl object-cover border border-[#E5DCD0]"
                    />
                    <div>
                      <h3 className="font-editorial text-lg font-bold text-[#2C2723]">
                        {cal.year} год
                      </h3>
                      <p className="text-xs text-[#7A6F64]">
                        {cal.months.length || 12} месяцев · {cal.formatSettings?.format || 'A3'}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenCalendar(cal)}
                    className="px-4 py-2 bg-[#FAF7F2] hover:bg-[#2C2723] hover:text-white text-[#2C2723] text-xs font-semibold rounded-xl border border-[#DDD2C4] transition-all cursor-pointer"
                  >
                    Открыть
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white/70 rounded-2xl p-6 border border-dashed border-[#D8CCBD] text-center space-y-2">
              <CalendarIcon className="w-6 h-6 text-[#A09385] mx-auto" />
              <p className="text-xs text-[#7A6F64]">
                Здесь появятся ваши семейные календари.
              </p>
              <button
                type="button"
                onClick={onStartNew}
                className="text-xs font-semibold text-[#8C4A38] hover:underline cursor-pointer"
              >
                Создать первый календарь →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
