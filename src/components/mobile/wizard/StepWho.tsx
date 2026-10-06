import React, { useState, useRef } from 'react';
import { Plus, Trash2, Camera, Check, User, Users, Sparkles, Heart } from 'lucide-react';
import { Person, PersonType, PERSON_TYPE_LABELS, DEFAULT_PRESET_CHILDREN, DEMO_FAMILY_MEMBERS } from '../../../types/calendar';
import { validateChildPhotoFile } from '../../../services/storage';
import { TelegramService } from '../../../services/telegram';

interface StepWhoProps {
  people: Person[];
  togetherMode: boolean;
  onUpdatePeople: (people: Person[], togetherMode: boolean) => void;
  onNext: () => void;
}

export const StepWho: React.FC<StepWhoProps> = ({
  people,
  togetherMode,
  onUpdatePeople,
  onNext,
}) => {
  const [isAddingPerson, setIsAddingPerson] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<PersonType>('child');
  const [age, setAge] = useState<number>(7);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateChildPhotoFile(file);
    if (!validation.valid) {
      alert(validation.error || 'Ошибка загрузки');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPhotoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleSavePerson = () => {
    if (!name.trim()) return;

    const defaultAvatar =
      photoUrl ||
      (type === 'child'
        ? 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=400&q=80'
        : type === 'mother'
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');

    const newPerson: Person = {
      id: `p_${Date.now()}`,
      name: name.trim(),
      type,
      age,
      roleDescription: PERSON_TYPE_LABELS[type].label,
      isPrimary: people.length === 0,
      avatarUrl: defaultAvatar,
      photos: [
        {
          id: `ph_${Date.now()}`,
          url: defaultAvatar,
          fileName: `${name.trim()}_face.jpg`,
          fileSize: 1024 * 300,
          uploadedAt: new Date().toISOString(),
          isMainFace: true,
        },
      ],
    };

    const nextList = [...people, newPerson];
    onUpdatePeople(nextList, nextList.length > 1);
    setName('');
    setPhotoUrl('');
    setIsAddingPerson(false);
    TelegramService.triggerHaptic('success');
  };

  const handleRemovePerson = (id: string) => {
    const filtered = people.filter((p) => p.id !== id);
    if (filtered.length > 0 && !filtered.some((p) => p.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onUpdatePeople(filtered, filtered.length > 1);
    TelegramService.triggerHaptic('light');
  };

  const loadPreset = (presetType: '1_child' | '2_children' | 'family') => {
    let selected: Person[] = [];
    if (presetType === '1_child') {
      selected = [DEFAULT_PRESET_CHILDREN[0]];
    } else if (presetType === '2_children') {
      selected = [DEFAULT_PRESET_CHILDREN[0], DEFAULT_PRESET_CHILDREN[1]];
    } else {
      selected = [
        DEMO_FAMILY_MEMBERS[4], // Папа
        DEMO_FAMILY_MEMBERS[3], // Мама
        DEFAULT_PRESET_CHILDREN[0], // Артём
        DEFAULT_PRESET_CHILDREN[1], // Маша
      ];
    }
    onUpdatePeople(selected, selected.length > 1);
    setIsAddingPerson(false);
    TelegramService.triggerHaptic('medium');
  };

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6">
      {/* Title & Subtitle */}
      <div className="text-center space-y-2">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Кто будет в календаре?
        </h1>
        <p className="text-xs sm:text-sm text-[#70665D] leading-relaxed max-w-sm mx-auto">
          Можно добавить одного ребёнка, нескольких детей или всю семью.
        </p>
      </div>

      {/* Quick composition buttons */}
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => loadPreset('1_child')}
          className="p-2.5 bg-white rounded-2xl border border-[#ECE4D8] hover:border-[#8C4A38] text-center transition-all cursor-pointer shadow-2xs"
        >
          <span className="text-lg block mb-0.5">👶</span>
          <span className="text-xs font-bold text-[#2C2723] block">1 ребёнок</span>
          <span className="text-[10px] text-[#8E8377] block">Артём</span>
        </button>

        <button
          type="button"
          onClick={() => loadPreset('2_children')}
          className="p-2.5 bg-white rounded-2xl border border-[#ECE4D8] hover:border-[#8C4A38] text-center transition-all cursor-pointer shadow-2xs"
        >
          <span className="text-lg block mb-0.5">👦👧</span>
          <span className="text-xs font-bold text-[#2C2723] block">2 детей</span>
          <span className="text-[10px] text-[#8E8377] block">Артём и Маша</span>
        </button>

        <button
          type="button"
          onClick={() => loadPreset('family')}
          className="p-2.5 bg-white rounded-2xl border border-[#ECE4D8] hover:border-[#8C4A38] text-center transition-all cursor-pointer shadow-2xs"
        >
          <span className="text-lg block mb-0.5">👨‍👩‍👧‍👦</span>
          <span className="text-xs font-bold text-[#2C2723] block">Вся семья</span>
          <span className="text-[10px] text-[#8E8377] block">Родители и дети</span>
        </button>
      </div>

      {/* People Cards Grid */}
      <div className="space-y-3">
        {people.map((person) => (
          <div
            key={person.id}
            className="bg-white p-4 rounded-3xl border border-[#ECE4D8] shadow-xs flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3.5">
              <img
                src={person.avatarUrl || person.photos[0]?.url}
                alt={person.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#E5DCD0]"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h3 className="font-editorial text-xl font-bold text-[#2C2723]">
                    {person.name}
                  </h3>
                  <span className="text-[10px] font-bold text-[#8C4A38] bg-[#FAF4EC] px-2 py-0.5 rounded-md border border-[#EFE2D2]">
                    {PERSON_TYPE_LABELS[person.type]?.label || 'Участник'}
                  </span>
                </div>
                <p className="text-xs text-[#7A6F64]">
                  {person.age ? `${person.age} лет` : ''}
                </p>
              </div>
            </div>

            {people.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemovePerson(person.id)}
                className="p-2 text-[#A09385] hover:text-red-600 transition-colors cursor-pointer"
                title="Удалить"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Add Person Modal/Form or Button */}
      {isAddingPerson ? (
        <div className="bg-white p-5 rounded-3xl border border-[#E3DACF] shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2C2723]">Добавить человека</h3>
            <button
              type="button"
              onClick={() => setIsAddingPerson(false)}
              className="text-xs text-[#8E8377] hover:text-[#2C2723] cursor-pointer"
            >
              Отмена
            </button>
          </div>

          {/* Role selection */}
          <div className="grid grid-cols-3 gap-1.5">
            {(['child', 'mother', 'father', 'grandmother', 'grandfather'] as PersonType[]).map(
              (r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setType(r);
                    if (!age) setAge(PERSON_TYPE_LABELS[r].defaultAge);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    type === r
                      ? 'bg-[#2C2723] text-white border-[#2C2723]'
                      : 'bg-[#FAF8F5] text-[#5C5146] border-[#DDD2C4]'
                  }`}
                >
                  {PERSON_TYPE_LABELS[r].label}
                </button>
              )
            )}
          </div>

          {/* Name and Age */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#5C5146] mb-1">Имя</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Имя"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#FAF8F5] border border-[#D5C9BB] focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-[#5C5146] mb-1">Возраст</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value, 10) || 1)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#FAF8F5] border border-[#D5C9BB] focus:bg-white"
              />
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className="block text-[11px] font-semibold text-[#5C5146] mb-1">
              Фотография (необязательно, можно добавить на следующем шаге)
            </label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 rounded-xl border border-dashed border-[#D5C9BB] bg-[#FAF8F5] text-xs text-[#5C5146] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#8C4A38]" />
              <span>{photoUrl ? 'Фото загружено' : 'Выбрать фото лица'}</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <button
            type="button"
            onClick={handleSavePerson}
            disabled={!name.trim()}
            className={`w-full py-3 text-xs font-semibold rounded-xl text-white transition-all cursor-pointer ${
              name.trim() ? 'bg-[#2C2723] hover:bg-[#433B35]' : 'bg-[#DDD2C4] cursor-not-allowed'
            }`}
          >
            Сохранить
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAddingPerson(true)}
          className="w-full py-4 rounded-3xl border-2 border-dashed border-[#D8CCBD] bg-white/60 hover:bg-white text-xs font-semibold text-[#5C5146] hover:text-[#2C2723] flex items-center justify-center gap-2 transition-all cursor-pointer min-h-[52px]"
        >
          <Plus className="w-4 h-4 text-[#8C4A38]" />
          <span>+ Добавить человека</span>
        </button>
      )}

      {/* Sticky Bottom Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            disabled={people.length === 0}
            onClick={onNext}
            className={`w-full py-4 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer ${
              people.length > 0
                ? 'bg-[#2C2723] hover:bg-[#433B35] text-white active:scale-[0.98]'
                : 'bg-[#DDD2C4] text-[#8E8377] cursor-not-allowed'
            }`}
          >
            <span>Продолжить</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
