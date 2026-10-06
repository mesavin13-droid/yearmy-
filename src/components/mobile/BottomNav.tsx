import React from 'react';
import { Home, BookOpen, User } from 'lucide-react';

export type TabId = 'home' | 'calendars' | 'profile';

interface BottomNavProps {
  activeTab: TabId;
  onChangeTab: (tab: TabId) => void;
  savedCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  savedCount,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#ECE4D8] py-2 px-6 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {/* 1. Главная */}
        <button
          type="button"
          onClick={() => onChangeTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-[#2C2723] font-semibold scale-105'
              : 'text-[#8E8377] hover:text-[#2C2723]'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-[#8C4A38]' : ''}`} />
          <span className="text-[11px]">Главная</span>
        </button>

        {/* 2. Календари */}
        <button
          type="button"
          onClick={() => onChangeTab('calendars')}
          className={`relative flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeTab === 'calendars'
              ? 'text-[#2C2723] font-semibold scale-105'
              : 'text-[#8E8377] hover:text-[#2C2723]'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'calendars' ? 'text-[#8C4A38]' : ''}`} />
          <span className="text-[11px]">Календари</span>
          {savedCount > 0 && (
            <span className="absolute top-0 right-2 w-4 h-4 bg-[#8C4A38] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {savedCount}
            </span>
          )}
        </button>

        {/* 3. Профиль */}
        <button
          type="button"
          onClick={() => onChangeTab('profile')}
          className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'text-[#2C2723] font-semibold scale-105'
              : 'text-[#8E8377] hover:text-[#2C2723]'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'text-[#8C4A38]' : ''}`} />
          <span className="text-[11px]">Профиль</span>
        </button>
      </div>
    </div>
  );
};
