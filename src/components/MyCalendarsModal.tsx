import React from 'react';
import { X, Calendar as CalendarIcon, Download, Play, Trash2, Plus, Sparkles } from 'lucide-react';
import { Calendar } from '../types/calendar';
import { generateCalendarPDF } from '../services/pdfExport';

interface MyCalendarsModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendars: Calendar[];
  activeCalendarId: string | null;
  onSelectCalendar: (id: string) => void;
  onDeleteCalendar: (id: string) => void;
  onStartNew: () => void;
}

export const MyCalendarsModal: React.FC<MyCalendarsModalProps> = ({
  isOpen,
  onClose,
  calendars,
  activeCalendarId,
  onSelectCalendar,
  onDeleteCalendar,
  onStartNew,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-5 sm:p-6 border border-[#E8DFD3] shadow-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#ECE4D8]">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#A6533A]" />
            <h3 className="font-editorial text-2xl font-bold text-[#2C2723]">
              Мои календари
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#70665D] hover:bg-[#EFE9DF]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3">
          {calendars.length === 0 ? (
            <div className="text-center py-10 px-4 bg-white rounded-2xl border border-[#ECE4D8]">
              <CalendarIcon className="w-10 h-10 text-[#C2B7A8] mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-[#2C2723]">
                Пока нет сохранённых календарей
              </h4>
              <p className="text-xs text-[#70665D] mt-1 mb-4">
                Создайте первый персональный календарь для вашего ребёнка.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onStartNew();
                }}
                className="px-5 py-2.5 bg-[#A6533A] hover:bg-[#924731] text-white text-xs font-semibold rounded-xl"
              >
                Создать календарь
              </button>
            </div>
          ) : (
            calendars.map((cal) => {
              const primaryChild = cal.children.find((c) => c.isPrimary) || cal.children[0];
              const childNames = cal.togetherMode && cal.children.length > 1
                ? cal.children.map((c) => c.name).join(' и ')
                : (primaryChild?.name || 'Ребёнок');

              const createdDate = new Date(cal.createdAt).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
              });

              const isCurrent = cal.id === activeCalendarId;

              return (
                <div
                  key={cal.id}
                  className={`p-4 rounded-2xl border bg-white transition-all ${
                    isCurrent
                      ? 'border-[#2C2723] ring-1 ring-[#2C2723]'
                      : 'border-[#ECE4D8] hover:border-[#D0C2B0]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#F4EFE6] overflow-hidden shrink-0 border border-[#E3DACF]">
                        {cal.months[0]?.imageUrl ? (
                          <img
                            src={cal.months[0].imageUrl}
                            alt="Обложка"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-[#A6533A] text-sm">
                            {cal.year}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-[#2C2723]">
                            Календарь {cal.year}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] bg-[#EAE2D5] text-[#554A40] px-2 py-0.2 rounded-md font-medium">
                              Текущий
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#7A6F64] mt-0.5">
                          {childNames} · 12 месяцев
                        </p>
                        <p className="text-[10px] text-[#A09385]">
                          Создан {createdDate}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteCalendar(cal.id)}
                      className="p-1.5 text-[#A6998B] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Удалить календарь"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-[#F2ECE3]">
                    <button
                      onClick={() => {
                        onSelectCalendar(cal.id);
                        onClose();
                      }}
                      className="flex-1 py-1.5 px-3 bg-[#2C2723] hover:bg-[#433B35] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Открыть</span>
                    </button>

                    <button
                      onClick={() => generateCalendarPDF(cal)}
                      className="py-1.5 px-3 border border-[#D5C9BB] hover:bg-[#FAF7F2] text-[#4E443B] text-xs font-medium rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <Download className="w-3 h-3" />
                      <span>Скачать</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-[#ECE4D8] flex justify-between items-center">
          <button
            onClick={() => {
              onClose();
              onStartNew();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#A6533A] hover:text-[#8B3F27]"
          >
            <Plus className="w-4 h-4" />
            <span>Создать ещё один календарь</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#EFE8DC] hover:bg-[#E5DCD0] text-xs font-medium text-[#4A4137] rounded-xl transition-colors"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
