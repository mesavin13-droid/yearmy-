import React from 'react';
import { Plus, BookOpen, Printer, Trash2, ArrowRight } from 'lucide-react';
import { Calendar } from '../../types/calendar';
import imgJan from '../../assets/images/month_january_newyear_1791297609129.jpg';

interface MyCalendarsScreenProps {
  calendars: Calendar[];
  onOpenCalendar: (cal: Calendar) => void;
  onOrderPrint: (cal: Calendar) => void;
  onDeleteCalendar: (id: string) => void;
  onStartNew: () => void;
}

export const MyCalendarsScreen: React.FC<MyCalendarsScreenProps> = ({
  calendars,
  onOpenCalendar,
  onOrderPrint,
  onDeleteCalendar,
  onStartNew,
}) => {
  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 text-[#2C2723]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#FAF7F2]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-[#ECE4D8]/70 flex items-center justify-between max-w-lg mx-auto">
        <h1 className="font-editorial text-2xl font-bold tracking-tight text-[#2C2723]">
          Мои календари
        </h1>
        <button
          type="button"
          onClick={onStartNew}
          className="text-xs font-semibold text-[#8C4A38] hover:text-[#703A2B] flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Новый</span>
        </button>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-6 pt-5 space-y-4">
        {calendars.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 border border-[#ECE4D8] text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-full bg-[#FAF4EC] flex items-center justify-center text-[#8C4A38] mx-auto">
              <BookOpen className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="font-editorial text-2xl font-bold text-[#2C2723]">
                У вас пока нет календарей
              </h2>
              <p className="text-xs text-[#7A6F64] max-w-xs mx-auto">
                Создайте первый семейный фотокалендарь с любимыми детьми и памятными датами.
              </p>
            </div>
            <button
              type="button"
              onClick={onStartNew}
              className="py-3 px-6 bg-[#2C2723] hover:bg-[#433B35] text-white rounded-2xl font-semibold text-xs shadow-sm transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Создать календарь</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {calendars.map((cal) => {
              const coverImg = cal.months[0]?.imageUrl || imgJan;
              const createdDate = cal.createdAt
                ? new Date(cal.createdAt).toLocaleDateString('ru-RU', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })
                : '6 октября 2026';

              return (
                <div
                  key={cal.id}
                  className="bg-white rounded-3xl p-4 border border-[#ECE4D8] shadow-xs space-y-4 transition-all hover:border-[#D5C7B5]"
                >
                  <div className="flex gap-4 items-start">
                    <img
                      src={coverImg}
                      alt={cal.title}
                      className="w-24 h-32 rounded-2xl object-cover border border-[#E5DCD0] shrink-0 shadow-xs"
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#8C4A38] uppercase tracking-wider">
                          {cal.formatSettings?.format || 'A3'} · {cal.formatSettings?.binding === 'wall' ? 'Настенный' : 'Перекидной'}
                        </span>
                        <button
                          type="button"
                          onClick={() => onDeleteCalendar(cal.id)}
                          className="p-1 text-[#A09385] hover:text-red-600 transition-colors cursor-pointer"
                          title="Удалить календарь"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <h3 className="font-editorial text-2xl font-bold text-[#2C2723] leading-none">
                        {cal.year} год
                      </h3>
                      <p className="text-xs text-[#5C5146] font-medium">{cal.title}</p>
                      <p className="text-[11px] text-[#8E8377] pt-1">
                        {cal.months.length || 12} месяцев
                      </p>
                      <p className="text-[10px] text-[#A09385]">Создан {createdDate}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-[#F0E8DD]">
                    <button
                      type="button"
                      onClick={() => onOpenCalendar(cal)}
                      className="py-2.5 px-4 bg-[#FAF7F2] hover:bg-[#2C2723] hover:text-white text-[#2C2723] text-xs font-semibold rounded-xl border border-[#DDD2C4] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Открыть</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onOrderPrint(cal)}
                      className="py-2.5 px-4 bg-[#2C2723] hover:bg-[#433B35] text-white text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Печать</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};
