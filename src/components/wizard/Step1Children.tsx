import React, { useState, useRef } from 'react';
import { Plus, Trash2, Camera, Image as ImageIcon, Star, Users, Check, AlertCircle, Sparkles, Gift, Heart, UserPlus, UserCheck } from 'lucide-react';
import { Person, PersonPhoto, PersonType, GiftRecipientType, formatChildrenNames, PERSON_TYPE_LABELS, DEMO_FAMILY_MEMBERS, DEFAULT_PRESET_CHILDREN } from '../../types/calendar';
import { validateChildPhotoFile } from '../../services/storage';

interface Step1ChildrenProps {
  childrenList: Person[];
  togetherMode: boolean;
  giftRecipient: GiftRecipientType;
  onChangeGiftRecipient: (recipient: GiftRecipientType) => void;
  onUpdateChildren: (children: Person[], togetherMode: boolean) => void;
  onNext: () => void;
}

const GIFT_RECIPIENT_OPTIONS: { id: GiftRecipientType; label: string; icon: string; subtitle: string }[] = [
  { id: 'grandparents', label: 'Бабушке и дедушке', icon: '👵👴', subtitle: 'Самый тёплый подарок' },
  { id: 'grandma', label: 'Любимой бабушке', icon: '👵', subtitle: 'От внуков и детей' },
  { id: 'grandpa', label: 'Любимому дедушке', icon: '👴', subtitle: 'С гордостью и любовью' },
  { id: 'family', label: 'Всей семье', icon: '🏡', subtitle: 'Семейная реликвия' },
  { id: 'godparents', label: 'Крёстным родителям', icon: '🕊️', subtitle: 'В знак благодарности' },
];

export const Step1Children: React.FC<Step1ChildrenProps> = ({
  childrenList,
  togetherMode,
  giftRecipient,
  onChangeGiftRecipient,
  onUpdateChildren,
  onNext,
}) => {
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [activeName, setActiveName] = useState('');
  const [activeType, setActiveType] = useState<PersonType>('child');
  const [activeAge, setActiveAge] = useState<number>(7);
  const [activeRole, setActiveRole] = useState('');
  const [activePhotos, setActivePhotos] = useState<PersonPhoto[]>([]);
  const [isAddingNew, setIsAddingNew] = useState(childrenList.length === 0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const startEditing = (person: Person) => {
    setEditingPersonId(person.id);
    setActiveName(person.name);
    setActiveType(person.type || 'child');
    setActiveAge(person.age || 7);
    setActiveRole(person.roleDescription || '');
    setActivePhotos(person.photos || []);
    setIsAddingNew(false);
    setValidationError(null);
  };

  const startAddNew = () => {
    setEditingPersonId(null);
    setActiveName('');
    setActiveType('child');
    setActiveAge(6);
    setActiveRole('');
    setActivePhotos([]);
    setIsAddingNew(true);
    setValidationError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const validation = validateChildPhotoFile(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Ошибка загрузки файла');
      return;
    }

    setValidationError(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const newPhoto: PersonPhoto = {
        id: `photo_${Date.now()}`,
        url: dataUrl,
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
        isMainFace: activePhotos.length === 0,
      };

      setActivePhotos((prev) => [...prev.slice(0, 2), newPhoto]);
    };
    reader.readAsDataURL(file);
  };

  const saveCurrentPerson = () => {
    if (!activeName.trim()) {
      setValidationError('Пожалуйста, укажите имя');
      return;
    }

    if (activePhotos.length === 0) {
      setValidationError('Добавьте хотя бы одну фотографию лица для сохранения внешности');
      return;
    }

    const updatedPerson: Person = {
      id: editingPersonId || `person_${Date.now()}`,
      name: activeName.trim(),
      type: activeType,
      age: activeAge || PERSON_TYPE_LABELS[activeType].defaultAge,
      roleDescription: activeRole.trim() || PERSON_TYPE_LABELS[activeType].label,
      isPrimary: childrenList.length === 0 || (!editingPersonId && childrenList.length === 0),
      avatarUrl: activePhotos[0]?.url,
      photos: activePhotos,
    };

    let nextPeople: Person[];
    if (editingPersonId) {
      nextPeople = childrenList.map((c) => (c.id === editingPersonId ? updatedPerson : c));
    } else {
      nextPeople = [...childrenList, updatedPerson];
    }

    if (!nextPeople.some((c) => c.isPrimary) && nextPeople.length > 0) {
      nextPeople[0].isPrimary = true;
    }

    onUpdateChildren(nextPeople, nextPeople.length > 1);
    setIsAddingNew(false);
    setEditingPersonId(null);
    setValidationError(null);
  };

  const setPrimaryPerson = (id: string) => {
    const updated = childrenList.map((c) => ({
      ...c,
      isPrimary: c.id === id,
    }));
    onUpdateChildren(updated, togetherMode);
  };

  const removePerson = (id: string) => {
    const filtered = childrenList.filter((c) => c.id !== id);
    if (filtered.length > 0 && !filtered.some((c) => c.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    onUpdateChildren(filtered, togetherMode);
    if (editingPersonId === id) {
      setIsAddingNew(false);
      setEditingPersonId(null);
    }
  };

  const loadSinglePreset = (preset: Person) => {
    const newPerson: Person = {
      ...preset,
      id: `person_${Date.now()}`,
      isPrimary: childrenList.length === 0,
    };
    const nextList = [...childrenList, newPerson];
    onUpdateChildren(nextList, nextList.length > 1);
    setIsAddingNew(false);
  };

  const loadCompositionPreset = (type: '1_child' | '2_children' | '3_children' | 'parents_kids' | 'grandparents_kids' | 'whole_family') => {
    let selected: Person[] = [];

    switch (type) {
      case '1_child':
        selected = [DEMO_FAMILY_MEMBERS[0]]; // Артём
        break;
      case '2_children':
        selected = [DEMO_FAMILY_MEMBERS[0], DEMO_FAMILY_MEMBERS[1]]; // Артём + Маша
        break;
      case '3_children':
        selected = [DEMO_FAMILY_MEMBERS[0], DEMO_FAMILY_MEMBERS[1], DEMO_FAMILY_MEMBERS[2]]; // Артём + Маша + Миша
        break;
      case 'parents_kids':
        selected = [
          DEMO_FAMILY_MEMBERS[4], // Дмитрий (Папа)
          DEMO_FAMILY_MEMBERS[3], // Анна (Мама)
          DEMO_FAMILY_MEMBERS[0], // Артём
          DEMO_FAMILY_MEMBERS[1], // Маша
        ];
        break;
      case 'grandparents_kids':
        selected = [
          DEMO_FAMILY_MEMBERS[5], // Елена (Бабушка)
          DEMO_FAMILY_MEMBERS[6], // Виктор (Дедушка)
          DEMO_FAMILY_MEMBERS[0], // Артём
          DEMO_FAMILY_MEMBERS[1], // Маша
        ];
        break;
      case 'whole_family':
        selected = [...DEMO_FAMILY_MEMBERS]; // Все 7 членов семьи
        break;
    }

    const mapped = selected.map((p, idx) => ({
      ...p,
      id: `person_${Date.now()}_${idx}`,
      isPrimary: idx === 0,
    }));

    onUpdateChildren(mapped, mapped.length > 1);
    setIsAddingNew(false);
    setEditingPersonId(null);
  };

  const unusedPresets = DEMO_FAMILY_MEMBERS.filter(
    (preset) => !childrenList.some((c) => c.name === preset.name)
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 pb-28">
      {/* Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-1.5 text-xs text-[#A6533A] font-semibold uppercase tracking-wider mb-1">
          <Gift className="w-3.5 h-3.5 text-[#A6533A]" />
          <span>Подарок для самых близких</span>
        </div>
        <h2 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Кому предназначен календарь?
        </h2>
        <p className="text-xs sm:text-sm text-[#70665D] mt-1.5">
          Выберите получателя — ИИ подберёт самые тёплые сюжеты и слова благодарности
        </p>
      </div>

      {/* Recipient Picker Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mb-8">
        {GIFT_RECIPIENT_OPTIONS.map((opt) => {
          const isSelected = giftRecipient === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeGiftRecipient(opt.id)}
              className={`p-3 rounded-2xl text-left border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white border-[#2C2723] ring-2 ring-[#2C2723] shadow-xs'
                  : 'bg-white border-[#ECE4D8] hover:border-[#CDBFB0]'
              }`}
            >
              <span className="text-2xl block mb-1">{opt.icon}</span>
              <span className="text-xs font-bold text-[#2C2723] block">{opt.label}</span>
              <span className="text-[10px] text-[#7A6F64] block">{opt.subtitle}</span>
            </button>
          );
        })}
      </div>

      {/* Composition Quick-Picks Section */}
      <div className="bg-[#FAF4EC] p-4 rounded-3xl border border-[#E9DCB8] mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-[#42362C] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#A6533A]" />
            <span>Готовые составы для календаря:</span>
          </span>
          <span className="text-[10px] text-[#7A6D5E]">нажмите для мгновенного выбора</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => loadCompositionPreset('1_child')}
            className="p-2.5 bg-white rounded-xl border border-[#DDD1C3] hover:border-[#A6533A] text-left transition-colors cursor-pointer"
          >
            <span className="font-bold text-[#2C2723] block">👶 1 ребёнок</span>
            <span className="text-[10px] text-[#7A6D5E] block">Артём (7 лет)</span>
          </button>

          <button
            type="button"
            onClick={() => loadCompositionPreset('2_children')}
            className="p-2.5 bg-white rounded-xl border border-[#DDD1C3] hover:border-[#A6533A] text-left transition-colors cursor-pointer"
          >
            <span className="font-bold text-[#2C2723] block">👦👧 2 детей</span>
            <span className="text-[10px] text-[#7A6D5E] block">Артём и Маша</span>
          </button>

          <button
            type="button"
            onClick={() => loadCompositionPreset('3_children')}
            className="p-2.5 bg-white rounded-xl border border-[#DDD1C3] hover:border-[#A6533A] text-left transition-colors cursor-pointer"
          >
            <span className="font-bold text-[#2C2723] block">👦👧👶 3 детей</span>
            <span className="text-[10px] text-[#7A6D5E] block">Артём, Маша и Миша</span>
          </button>

          <button
            type="button"
            onClick={() => loadCompositionPreset('parents_kids')}
            className="p-2.5 bg-white rounded-xl border border-[#DDD1C3] hover:border-[#A6533A] text-left transition-colors cursor-pointer"
          >
            <span className="font-bold text-[#2C2723] block">👨‍👩‍👧‍👦 Семья с родителями</span>
            <span className="text-[10px] text-[#7A6D5E] block">Мама, Папа + 2 детей</span>
          </button>

          <button
            type="button"
            onClick={() => loadCompositionPreset('grandparents_kids')}
            className="p-2.5 bg-white rounded-xl border border-[#DDD1C3] hover:border-[#A6533A] text-left transition-colors cursor-pointer"
          >
            <span className="font-bold text-[#2C2723] block">👵👴 С внуками</span>
            <span className="text-[10px] text-[#7A6D5E] block">Бабушка, Дедушка + внуки</span>
          </button>

          <button
            type="button"
            onClick={() => loadCompositionPreset('whole_family')}
            className="p-2.5 bg-white rounded-xl border border-[#DDD1C3] hover:border-[#A6533A] text-left transition-colors cursor-pointer"
          >
            <span className="font-bold text-[#2C2723] block">🌟 Вся большая семья</span>
            <span className="text-[10px] text-[#7A6D5E] block">Все поколения (7 чел)</span>
          </button>
        </div>
      </div>

      {/* Subheader: People on Calendar */}
      <div className="flex items-center justify-between mb-3 pt-2 border-t border-[#ECE3D6]">
        <div>
          <h3 className="text-sm font-bold text-[#2C2723] flex items-center gap-2">
            <span>Участники календаря</span>
            <span className="px-2 py-0.5 bg-[#F0E6D8] text-[#7A5B40] text-[10px] rounded-full font-bold">
              {childrenList.length} {childrenList.length === 1 ? 'человек' : childrenList.length < 5 ? 'человека' : 'человек'}
            </span>
          </h3>
          <p className="text-xs text-[#7A6F64]">
            {childrenList.length > 0
              ? `В сцене будут строго: ${formatChildrenNames(childrenList, togetherMode)} (без посторонних лиц)`
              : 'Добавьте 1 или несколько людей для фотосцен'}
          </p>
        </div>
      </div>

      {/* Quick Add Missing Family Members Chips */}
      {unusedPresets.length > 0 && (
        <div className="mb-4 p-2.5 bg-white rounded-2xl border border-[#EDE0D0] flex items-center gap-2 flex-wrap text-xs">
          <span className="text-[11px] text-[#7A6B5C] font-semibold flex items-center gap-1">
            <UserPlus className="w-3.5 h-3.5 text-[#A6533A]" />
            <span>Быстро добавить:</span>
          </span>
          {unusedPresets.map((preset) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => loadSinglePreset(preset)}
              className="text-[11px] px-2.5 py-1 bg-[#FAF7F2] hover:bg-white border border-[#D8C7B5] hover:border-[#A6533A] text-[#40362E] rounded-lg font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <img
                src={preset.avatarUrl}
                alt={preset.name}
                className="w-4 h-4 rounded-full object-cover"
              />
              <span>+ {preset.name} ({PERSON_TYPE_LABELS[preset.type].label})</span>
            </button>
          ))}
        </div>
      )}

      {/* People List Cards */}
      <div className="space-y-3 mb-6">
        {childrenList.map((person) => {
          const typeInfo = PERSON_TYPE_LABELS[person.type] || PERSON_TYPE_LABELS.other;
          return (
            <div
              key={person.id}
              className={`p-4 rounded-2xl border transition-all ${
                editingPersonId === person.id && !isAddingNew
                  ? 'bg-[#F7F2EA] border-[#C4B39F] shadow-xs'
                  : 'bg-white border-[#ECE4D8] hover:border-[#D5C7B5]'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={person.avatarUrl || person.photos[0]?.url}
                    alt={person.name}
                    referrerPolicy="no-referrer"
                    className="w-12 h-12 rounded-xl object-cover border border-[#E3DACF]"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-[#2C2723]">{person.name}</h3>
                      <span className="text-[10px] bg-[#EAE1D3] text-[#65574A] px-2 py-0.5 rounded-md font-medium">
                        {typeInfo.icon} {person.roleDescription || typeInfo.label}
                      </span>
                      {person.isPrimary && (
                        <span className="text-[10px] bg-[#FAF0E4] text-[#A6533A] border border-[#E8D6C4] px-1.5 py-0.2 rounded-md font-bold">
                          Главный герой
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#827568] mt-0.5">
                      {person.age ? `${person.age} лет` : ''} · {person.photos.length} фото лица (Identity Reference)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!person.isPrimary && childrenList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setPrimaryPerson(person.id)}
                      title="Сделать главным героем"
                      className="p-2 text-[#827568] hover:text-[#A6533A] hover:bg-[#F3ECE1] rounded-lg transition-colors cursor-pointer"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => startEditing(person)}
                    className="text-xs font-medium text-[#5C5146] hover:text-[#2C2723] px-2.5 py-1.5 rounded-lg hover:bg-[#EFE7DC] transition-colors cursor-pointer"
                  >
                    Изменить
                  </button>
                  {childrenList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePerson(person.id)}
                      className="p-2 text-[#9A8F83] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Multiple People / Group Mode Toggle */}
      {childrenList.length > 1 && !isAddingNew && (
        <div className="mb-6 p-4 bg-white rounded-2xl border border-[#ECE4D8]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4 text-[#A6533A]" />
              <div>
                <span className="text-xs font-semibold text-[#2C2723] block">
                  Групповая композиция со всеми участниками
                </span>
                <span className="text-[11px] text-[#70665D]">
                  Все {childrenList.length} человек будут присутствовать вместе на фотографиях каждого месяца
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateChildren(childrenList, !togetherMode)}
              className={`w-11 h-6 rounded-full transition-colors relative focus:outline-hidden cursor-pointer ${
                togetherMode ? 'bg-[#A6533A]' : 'bg-[#D6CDC2]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform transform absolute top-1 ${
                  togetherMode ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>
      )}

      {/* Form: Add or Edit Person */}
      {(isAddingNew || editingPersonId) ? (
        <div className="bg-white p-5 rounded-3xl border border-[#E3DACF] shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-[#2C2723]">
              {editingPersonId ? 'Редактировать человека' : 'Добавить человека в календарь'}
            </h3>
            {childrenList.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setIsAddingNew(false);
                  setEditingPersonId(null);
                }}
                className="text-xs text-[#827568] hover:text-[#2C2723] cursor-pointer"
              >
                Отмена
              </button>
            )}
          </div>

          <div className="space-y-4">
            {/* Person Role/Type Selector */}
            <div>
              <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
                Кем приходится в семье:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(Object.keys(PERSON_TYPE_LABELS) as PersonType[]).map((typeKey) => {
                  const item = PERSON_TYPE_LABELS[typeKey];
                  const isSelected = activeType === typeKey;
                  return (
                    <button
                      key={typeKey}
                      type="button"
                      onClick={() => {
                        setActiveType(typeKey);
                        if (!activeRole) setActiveRole(item.label);
                        if (!activeAge) setActiveAge(item.defaultAge);
                      }}
                      className={`py-2 px-2.5 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[#2C2723] text-white border-[#2C2723] shadow-xs'
                          : 'bg-[#FAF8F5] text-[#4E443B] border-[#DDD2C4] hover:bg-white'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name & Age */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-[#4A423A] mb-1">
                  Имя *
                </label>
                <input
                  type="text"
                  value={activeName}
                  onChange={(e) => setActiveName(e.target.value)}
                  placeholder="Например: Артём или Анна"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#DCD2C4] bg-[#FAF8F5] text-[#2C2723] focus:bg-white focus:outline-hidden focus:border-[#A6533A] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#4A423A] mb-1">
                  Возраст (лет)
                </label>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={activeAge}
                  onChange={(e) => setActiveAge(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#DCD2C4] bg-[#FAF8F5] text-[#2C2723] focus:bg-white focus:outline-hidden focus:border-[#A6533A]"
                />
              </div>
            </div>

            {/* Photos Section */}
            <div>
              <label className="block text-xs font-medium text-[#4A423A] mb-1">
                Фотографии лица (Identity Reference) *
              </label>

              <div className="bg-[#FAF7F2] p-3 rounded-xl border border-[#EDE4D8] mb-3">
                <span className="text-[11px] font-semibold text-[#6C5E50] block mb-0.5">
                  Требования для точного сохранения внешности:
                </span>
                <p className="text-[11px] text-[#7A6F64]">
                  Лицо крупным планом, без масок и фильтров. ИИ использует это фото как точный референс черт лица, волос и цвета глаз.
                </p>
              </div>

              {/* Photo Previews */}
              {activePhotos.length > 0 && (
                <div className="flex gap-2.5 mb-3 overflow-x-auto py-1">
                  {activePhotos.map((p, idx) => (
                    <div key={p.id} className="relative group shrink-0">
                      <img
                        src={p.url}
                        alt="Фото"
                        className="w-20 h-20 rounded-xl object-cover border border-[#D5C9BB]"
                      />
                      <button
                        type="button"
                        onClick={() => setActivePhotos((prev) => prev.filter((item) => item.id !== p.id))}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs shadow-xs cursor-pointer"
                      >
                        ×
                      </button>
                      {idx === 0 && (
                        <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[9px] text-center rounded-sm py-0.2">
                          Главное
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Trigger Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl border border-[#D5C9BB] bg-white hover:bg-[#FAF7F2] text-xs font-medium text-[#433B33] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#A6533A]" />
                  <span>📷 Сделать фото</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="py-2.5 px-3 rounded-xl border border-[#D5C9BB] bg-white hover:bg-[#FAF7F2] text-xs font-medium text-[#433B33] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-[#A6533A]" />
                  <span>🖼 Из галереи</span>
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/heic"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            </div>

            {/* Error Message */}
            {validationError && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            {/* Save Person Button */}
            <button
              type="button"
              onClick={saveCurrentPerson}
              className="w-full py-3 bg-[#2C2723] hover:bg-[#433B35] text-white text-xs font-semibold rounded-xl transition-colors mt-2 cursor-pointer"
            >
              Использовать этого участника
            </button>
          </div>
        </div>
      ) : (
        /* Add Person Button */
        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={startAddNew}
            className="w-full py-3.5 border-2 border-dashed border-[#D5C8B9] hover:border-[#A6533A] bg-white/70 hover:bg-white text-xs font-medium text-[#5C5146] hover:text-[#2C2723] rounded-2xl flex items-center justify-center gap-2 transition-all min-h-[48px] cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#A6533A]" />
            <span>Добавить ещё одного человека (ребёнка, маму, папу, бабушку...)</span>
          </button>
        </div>
      )}

      {/* Sticky Bottom Next Button */}
      <div className="fixed bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-md mx-auto">
          <button
            type="button"
            disabled={childrenList.length === 0}
            onClick={onNext}
            className={`w-full py-3.5 rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${
              childrenList.length > 0
                ? 'bg-[#A6533A] hover:bg-[#924731] text-white active:scale-[0.98]'
                : 'bg-[#DDD3C7] text-[#8E8377] cursor-not-allowed'
            }`}
          >
            <span>Продолжить выбор года</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
