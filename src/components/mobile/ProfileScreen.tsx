import React, { useState } from 'react';
import { User, Bell, Shield, Trash2, Plus, Edit2, Heart, Check, Settings, Sparkles } from 'lucide-react';
import { Person, Child } from '../../types/calendar';
import { TelegramService } from '../../services/telegram';

interface ProfileScreenProps {
  onOpenAiSettings: () => void;
  onClearAllData: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onOpenAiSettings,
  onClearAllData,
}) => {
  const [userName, setUserName] = useState<string>('Анна Смирнова');
  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
  const [children, setChildren] = useState<{ id: string; name: string; age: number; avatar: string }[]>([
    {
      id: 'c1',
      name: 'Артём',
      age: 7,
      avatar: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'c2',
      name: 'Маша',
      age: 4,
      avatar: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=300&q=80',
    },
  ]);

  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState(3);
  const [isAddingChild, setIsAddingChild] = useState(false);

  const handleAddChild = () => {
    if (!newChildName.trim()) return;
    setChildren((prev) => [
      ...prev,
      {
        id: `c_${Date.now()}`,
        name: newChildName.trim(),
        age: newChildAge,
        avatar: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=300&q=80',
      },
    ]);
    setNewChildName('');
    setIsAddingChild(false);
    TelegramService.triggerHaptic('success');
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 text-[#2C2723]">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-[#FAF7F2]/90 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-[#ECE4D8]/70 flex items-center justify-between max-w-lg mx-auto">
        <h1 className="font-editorial text-2xl font-bold tracking-tight text-[#2C2723]">
          Профиль
        </h1>
      </header>

      <main className="max-w-lg mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-5 border border-[#ECE4D8] shadow-xs flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#EFE8DE] flex items-center justify-center text-[#5C5146] border border-[#DDD2C4] overflow-hidden shrink-0">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
              alt={userName}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="px-2.5 py-1 text-sm rounded-lg border border-[#D5C9BB] bg-[#FAF8F5] text-[#2C2723]"
                />
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="p-1.5 bg-[#2C2723] text-white rounded-lg text-xs"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="font-editorial text-xl font-bold text-[#2C2723]">{userName}</h2>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="text-[#8E8377] hover:text-[#2C2723] p-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            <p className="text-xs text-[#7A6F64] mt-0.5">Семейный аккаунт «МОЙ ГОД»</p>
          </div>
        </div>

        {/* Section: Мои дети */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2C2723]">Мои дети</h3>
            {!isAddingChild && (
              <button
                type="button"
                onClick={() => setIsAddingChild(true)}
                className="text-xs font-semibold text-[#8C4A38] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Добавить</span>
              </button>
            )}
          </div>

          <div className="space-y-2.5">
            {children.map((child) => (
              <div
                key={child.id}
                className="bg-white p-3.5 rounded-2xl border border-[#ECE4D8] flex items-center justify-between shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={child.avatar}
                    alt={child.name}
                    className="w-10 h-10 rounded-xl object-cover border border-[#E5DCD0]"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-[#2C2723]">{child.name}</h4>
                    <p className="text-xs text-[#7A6F64]">{child.age} лет</p>
                  </div>
                </div>
                <span className="text-xs text-[#8E8377] px-2.5 py-1 bg-[#FAF7F2] rounded-lg border border-[#EAE0D4]">
                  В календаре
                </span>
              </div>
            ))}

            {/* Add Child Form */}
            {isAddingChild && (
              <div className="bg-[#FAF4EC] p-4 rounded-2xl border border-[#E9DCB8] space-y-3">
                <h4 className="text-xs font-bold text-[#42362C]">Добавить ребёнка</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Имя"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-white border border-[#D5C9BB]"
                  />
                  <input
                    type="number"
                    placeholder="Возраст"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(parseInt(e.target.value, 10) || 1)}
                    className="px-3 py-2 text-xs rounded-xl bg-white border border-[#D5C9BB]"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddChild}
                    className="flex-1 py-2 bg-[#2C2723] text-white text-xs font-semibold rounded-xl"
                  >
                    Сохранить
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingChild(false)}
                    className="px-3 py-2 text-xs text-[#7A6F64] hover:text-[#2C2723]"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section: Настройки */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#2C2723]">Настройки</h3>
          <div className="bg-white rounded-3xl border border-[#ECE4D8] overflow-hidden divide-y divide-[#F0E8DD]">
            {/* Уведомления */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-4 h-4 text-[#8C4A38]" />
                <div>
                  <span className="text-xs font-semibold text-[#2C2723] block">Уведомления</span>
                  <span className="text-[11px] text-[#7A6F64]">Напоминания о памятных датах</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-10 h-6 rounded-full transition-colors relative cursor-pointer ${
                  notificationsEnabled ? 'bg-[#8C4A38]' : 'bg-[#D6CDC2]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                    notificationsEnabled ? 'right-1' : 'left-1'
                  }`}
                />
              </button>
            </div>

            {/* Приватность */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-[#8C4A38]" />
                <div>
                  <span className="text-xs font-semibold text-[#2C2723] block">Приватность</span>
                  <span className="text-[11px] text-[#7A6F64]">Фотографии используются только для печати</span>
                </div>
              </div>
              <span className="text-[10px] text-[#5B795A] font-bold bg-[#EBF4EB] px-2 py-0.5 rounded-full">
                Защищено
              </span>
            </div>

            {/* Удалить данные */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Очистить все сохранённые календари и фотографии?')) {
                  onClearAllData();
                }
              }}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-red-50/50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-4 h-4 text-red-600" />
                <div>
                  <span className="text-xs font-semibold text-red-600 block">Удалить данные</span>
                  <span className="text-[11px] text-[#8E8377]">Очистить историю созданных календарей</span>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Subtle AI / Generation Settings link */}
        <div className="pt-2 text-center">
          <button
            type="button"
            onClick={onOpenAiSettings}
            className="text-[11px] text-[#8E8377] hover:text-[#2C2723] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Параметры генерации и ключ API</span>
          </button>
        </div>
      </main>
    </div>
  );
};
