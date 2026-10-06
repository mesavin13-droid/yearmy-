import React, { useRef, useState } from 'react';
import { Plus, Check, Trash2, Camera, Image as ImageIcon, Sparkles, CheckCircle2 } from 'lucide-react';
import { Person, PersonPhoto } from '../../../types/calendar';
import { validateChildPhotoFile } from '../../../services/storage';
import { TelegramService } from '../../../services/telegram';

interface StepPhotosProps {
  people: Person[];
  onUpdatePeople: (people: Person[]) => void;
  onNext: () => void;
}

export const StepPhotos: React.FC<StepPhotosProps> = ({
  people,
  onUpdatePeople,
  onNext,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<string>(people[0]?.id || '');

  const activePerson = people.find((p) => p.id === selectedPersonId) || people[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !activePerson) return;

    const newPhotos: PersonPhoto[] = [];
    Array.from(files).slice(0, 5).forEach((file, index) => {
      const validation = validateChildPhotoFile(file);
      if (!validation.valid) return;

      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        const photo: PersonPhoto = {
          id: `ph_${Date.now()}_${index}`,
          url: dataUrl,
          fileName: file.name,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
          isMainFace: activePerson.photos.length === 0 && index === 0,
        };

        const updatedPerson = {
          ...activePerson,
          avatarUrl: activePerson.avatarUrl || dataUrl,
          photos: [...activePerson.photos, photo].slice(0, 5),
        };

        const updatedList = people.map((p) => (p.id === activePerson.id ? updatedPerson : p));
        onUpdatePeople(updatedList);
        TelegramService.triggerHaptic('light');
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePhoto = (photoId: string) => {
    if (!activePerson) return;
    const filteredPhotos = activePerson.photos.filter((p) => p.id !== photoId);
    const updatedPerson = {
      ...activePerson,
      avatarUrl: filteredPhotos[0]?.url || activePerson.avatarUrl,
      photos: filteredPhotos,
    };
    const updatedList = people.map((p) => (p.id === activePerson.id ? updatedPerson : p));
    onUpdatePeople(updatedList);
  };

  const allPhotosCount = people.reduce((acc, p) => acc + (p.photos?.length || 0), 0);

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 pt-5 pb-28 space-y-6">
      {/* Title & Subtitle */}
      <div className="text-center space-y-2">
        <h1 className="font-editorial text-3xl sm:text-4xl font-bold text-[#2C2723]">
          Добавьте фотографии
        </h1>
        <p className="text-xs sm:text-sm text-[#70665D] leading-relaxed max-w-sm mx-auto">
          Лучше всего подойдут фотографии, где хорошо видно лицо.
        </p>
      </div>

      {/* Person Selector Tabs if multiple people */}
      {people.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {people.map((person) => {
            const isSelected = person.id === activePerson?.id;
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => setSelectedPersonId(person.id)}
                className={`px-3.5 py-2 rounded-2xl flex items-center gap-2 border text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2C2723] text-white border-[#2C2723] shadow-xs'
                    : 'bg-white text-[#5C5146] border-[#ECE4D8] hover:border-[#D5C7B5]'
                }`}
              >
                <img
                  src={person.avatarUrl || person.photos[0]?.url}
                  alt={person.name}
                  className="w-5 h-5 rounded-full object-cover"
                />
                <span>{person.name}</span>
                <span className="text-[10px] opacity-80">({person.photos.length})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Big Upload Area */}
      <div className="bg-white p-6 rounded-3xl border border-[#ECE4D8] shadow-xs text-center space-y-4">
        {activePerson && (
          <div className="text-left flex items-center justify-between pb-2 border-b border-[#F0E8DD]">
            <span className="text-xs font-bold text-[#2C2723]">
              Фотографии для {activePerson.name} ({activePerson.photos.length}/5)
            </span>
            {activePerson.photos.length > 0 && (
              <span className="text-[11px] text-[#5B795A] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Фотографии готовы</span>
              </span>
            )}
          </div>
        )}

        {/* Big Drop/Click Zone */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-10 px-4 rounded-3xl border-2 border-dashed border-[#D5C9BB] hover:border-[#8C4A38] bg-[#FAF8F5] hover:bg-white flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group"
        >
          <div className="w-14 h-14 rounded-full bg-white group-hover:bg-[#FAF4EC] flex items-center justify-center text-[#8C4A38] border border-[#E5DCD0] shadow-xs transition-colors">
            <Plus className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <span className="text-sm font-bold text-[#2C2723] block">
              Добавить фото
            </span>
            <span className="text-xs text-[#8E8377] block">
              Можно загрузить до 5 фотографий
            </span>
          </div>
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Thumbnails of current person's photos */}
        {activePerson && activePerson.photos.length > 0 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5 pt-2">
            {activePerson.photos.map((photo, idx) => (
              <div key={photo.id} className="relative group rounded-2xl overflow-hidden aspect-square border border-[#E5DCD0]">
                <img
                  src={photo.url}
                  alt={`Фото ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(photo.id)}
                  className="absolute top-1 right-1 w-5 h-5 bg-black/60 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer"
                  title="Удалить"
                >
                  ×
                </button>
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[8px] font-bold rounded-sm py-0.5 text-center">
                    Главное
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Continue Button */}
      <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/95 to-transparent border-t border-[#ECE4D8]/60">
        <div className="max-w-lg mx-auto">
          <button
            type="button"
            onClick={onNext}
            className="w-full py-4 rounded-2xl text-sm font-semibold bg-[#2C2723] hover:bg-[#433B35] text-white active:scale-[0.98] flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
          >
            <span>Продолжить</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
