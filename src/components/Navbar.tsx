import React from 'react';
import { Calendar, Plus, BookOpen, Key, Sparkles } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';
import { AiSettingsService } from '../services/aiSettings';

interface NavbarProps {
  onStartNew: () => void;
  onOpenMyCalendars: () => void;
  onOpenAiSettings: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartNew,
  onOpenMyCalendars,
  onOpenAiSettings,
  savedCount,
}) => {
  const hasCustomKey = Boolean(AiSettingsService.getCustomKey());
  const isInstant = AiSettingsService.getAiMode() === 'instant';

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF7F2]/90 backdrop-blur-md border-b border-[#ECE4D8]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-15 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single element) */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-left group flex items-center gap-2 cursor-pointer focus-visible:outline-hidden"
        >
          <span className="font-editorial text-2xl font-bold tracking-wider text-[#2C2723] group-hover:text-[#A6533A] transition-colors">
            МОЙ ГОД
          </span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#A6533A]" />
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[#70665D]">
          <a href="#how-it-works" className="hover:text-[#2C2723] transition-colors">
            Как это работает
          </a>
          <a href="#styles" className="hover:text-[#2C2723] transition-colors">
            Стили
          </a>
          <a href="#themes" className="hover:text-[#2C2723] transition-colors">
            12 историй
          </a>
          <a href="#formats" className="hover:text-[#2C2723] transition-colors">
            Форматы
          </a>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Settings / Key Button */}
          <button
            onClick={onOpenAiSettings}
            className="flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium text-[#5C5349] hover:text-[#2C2723] bg-[#F3ECE1] hover:bg-[#EBE2D4] rounded-xl transition-colors min-h-[40px] cursor-pointer"
            title="Настройки ИИ и свой ключ Gemini API"
          >
            <Key className="w-3.5 h-3.5 text-[#A6533A]" />
            <span className="hidden sm:inline">Ключ ИИ</span>
            <span
              className={`w-2 h-2 rounded-full ${
                hasCustomKey ? 'bg-emerald-500' : isInstant ? 'bg-amber-500' : 'bg-[#A6533A]'
              }`}
            />
          </button>

          <div className="hidden sm:block">
            <PWAInstallButton />
          </div>

          <button
            onClick={onOpenMyCalendars}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#5C5349] hover:text-[#2C2723] bg-[#F3ECE1] hover:bg-[#EBE2D4] rounded-xl transition-colors min-h-[40px] cursor-pointer"
            title="Мои сохранённые календари"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#A6533A]" />
            <span className="hidden xs:inline">Календари</span>
            {savedCount > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 bg-[#2C2723] text-white text-[10px] rounded-full font-bold">
                {savedCount}
              </span>
            )}
          </button>

          <button
            onClick={onStartNew}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#A6533A] hover:bg-[#924731] active:scale-[0.98] rounded-xl shadow-xs transition-all min-h-[40px] whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Создать календарь</span>
          </button>
        </div>
      </div>
    </header>
  );
};
