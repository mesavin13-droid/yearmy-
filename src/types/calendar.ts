export type VisualStyleId =
  | 'realistic'
  | 'cinematic'
  | 'fairytale'
  | 'premium family photography'
  | '3D animation'
  // Legacy aliases supported gracefully
  | 'photorealism'
  | '3d_story'
  | 'tender';

export interface VisualStyle {
  id: VisualStyleId;
  name: string;
  tagline: string;
  description: string;
  icon: string;
  palette: string;
  previewImage: string;
}

export type PersonType = 'child' | 'mother' | 'father' | 'grandmother' | 'grandfather' | 'other';

export interface PersonPhoto {
  id: string;
  url: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  isMainFace?: boolean;
}

export interface Person {
  id: string;
  name: string;
  type: PersonType;
  age?: number;
  birthDate?: string;
  gender?: 'boy' | 'girl' | 'male' | 'female';
  roleDescription?: string;
  isPrimary: boolean;
  avatarUrl?: string;
  photos: PersonPhoto[];
}

// Backward compatibility aliases
export type Child = Person;
export type ChildPhoto = PersonPhoto;

export interface MonthConfig {
  number: number; // 1 to 12
  name: string;
  nameGenitive: string;
  season: 'winter' | 'spring' | 'summer' | 'autumn';
  holidayTitle: string;
  themeDescription: string;
  storyCaptionDefault: string;
  colorTone: string;
  icon: string;
  mockSceneUrl: string;
}

export interface CalendarMonth {
  monthNumber: number;
  monthName: string;
  themeTitle: string;
  imageUrl: string;
  storyCaption: string;
  regenerationPrompt?: string;
  builtPrompt?: string;
  negativePrompt?: string;
  version: number;
  isRegenerating?: boolean;
  isFavorite?: boolean;
}

export type GiftRecipientType = 'grandparents' | 'grandma' | 'grandpa' | 'family' | 'godparents';

export interface CalendarDedication {
  enabled: boolean;
  text: string;
  author: string;
  recipientTitle?: string;
}

export type CalendarOrientation = 'portrait' | 'landscape';
export type CalendarPageFormat = 'A4' | 'A3' | 'square';
export type CalendarBindingType = 'wall' | 'desk_flip';

export interface CalendarFormatSettings {
  orientation: CalendarOrientation;
  format: CalendarPageFormat;
  binding: CalendarBindingType;
}

export interface Calendar {
  id: string;
  title: string;
  year: number;
  styleId: VisualStyleId;
  mood: string;
  giftRecipient: GiftRecipientType;
  children: Person[]; // can include any family member or child
  togetherMode: boolean; // whether scenes should feature all people together
  customRequest?: string; // "Что хотите изменить?"
  months: CalendarMonth[];
  dedication: CalendarDedication;
  formatSettings: CalendarFormatSettings;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'generated' | 'completed';
}

export interface PricingPlan {
  id: string;
  title: string;
  description: string;
  priceRub: number;
  originalPriceRub?: number;
  isPopular?: boolean;
}

export function formatChildrenNames(people: Person[], togetherMode: boolean = true): string {
  if (!people || people.length === 0) return 'Семья';
  if (!togetherMode || people.length === 1) {
    const primary = people.find((c) => c.isPrimary) || people[0];
    return primary?.name || 'Ребёнок';
  }
  const names = people.map((c) => c.name.trim()).filter(Boolean);
  if (names.length === 0) return 'Вся семья';
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} и ${names[1]}`;
  const last = names[names.length - 1];
  const others = names.slice(0, -1).join(', ');
  return `${others} и ${last}`;
}

export const PERSON_TYPE_LABELS: Record<PersonType, { label: string; icon: string; defaultAge: number }> = {
  child: { label: 'Ребёнок', icon: '👶', defaultAge: 6 },
  mother: { label: 'Мама', icon: '👩', defaultAge: 32 },
  father: { label: 'Папа', icon: '👨', defaultAge: 35 },
  grandmother: { label: 'Бабушка', icon: '👵', defaultAge: 62 },
  grandfather: { label: 'Дедушка', icon: '👴', defaultAge: 65 },
  other: { label: 'Член семьи', icon: '🧑', defaultAge: 25 },
};

export const DEFAULT_PRESET_CHILDREN: Person[] = [
  {
    id: 'person_artem',
    name: 'Артём',
    type: 'child',
    age: 7,
    birthDate: '2020-05-14',
    gender: 'boy',
    roleDescription: 'Старший сын / внук',
    isPrimary: true,
    avatarUrl: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=400&q=80',
    photos: [
      {
        id: 'photo_artem_1',
        url: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=800&q=80',
        fileName: 'artem_photo.jpg',
        fileSize: 1024 * 450,
        uploadedAt: new Date().toISOString(),
        isMainFace: true,
      },
    ],
  },
  {
    id: 'person_masha',
    name: 'Маша',
    type: 'child',
    age: 4,
    birthDate: '2022-09-21',
    gender: 'girl',
    roleDescription: 'Дочь / внучка',
    isPrimary: false,
    avatarUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
    photos: [
      {
        id: 'photo_masha_1',
        url: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
        fileName: 'masha_portrait.jpg',
        fileSize: 1024 * 380,
        uploadedAt: new Date().toISOString(),
        isMainFace: true,
      },
    ],
  },
  {
    id: 'person_misha',
    name: 'Миша',
    type: 'child',
    age: 2,
    birthDate: '2024-03-10',
    gender: 'boy',
    roleDescription: 'Младший сын / внук',
    isPrimary: false,
    avatarUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=400&q=80',
    photos: [
      {
        id: 'photo_misha_1',
        url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80',
        fileName: 'misha_baby.jpg',
        fileSize: 1024 * 320,
        uploadedAt: new Date().toISOString(),
        isMainFace: true,
      },
    ],
  },
];

export const DEMO_FAMILY_MEMBERS: Person[] = [
  ...DEFAULT_PRESET_CHILDREN,
  {
    id: 'person_anna_mom',
    name: 'Анна',
    type: 'mother',
    age: 32,
    roleDescription: 'Мама',
    isPrimary: false,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    photos: [
      {
        id: 'photo_anna_1',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
        fileName: 'mom_anna.jpg',
        fileSize: 1024 * 400,
        uploadedAt: new Date().toISOString(),
        isMainFace: true,
      },
    ],
  },
  {
    id: 'person_dmitry_dad',
    name: 'Дмитрий',
    type: 'father',
    age: 35,
    roleDescription: 'Папа',
    isPrimary: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    photos: [
      {
        id: 'photo_dmitry_1',
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        fileName: 'dad_dmitry.jpg',
        fileSize: 1024 * 420,
        uploadedAt: new Date().toISOString(),
        isMainFace: true,
      },
    ],
  },
  {
    id: 'person_elena_grandma',
    name: 'Елена',
    type: 'grandmother',
    age: 62,
    roleDescription: 'Бабушка',
    isPrimary: false,
    avatarUrl: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=400&q=80',
    photos: [
      {
        id: 'photo_elena_1',
        url: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=800&q=80',
        fileName: 'grandma_elena.jpg',
        fileSize: 1024 * 390,
        uploadedAt: new Date().toISOString(),
        isMainFace: true,
      },
    ],
  },
  {
    id: 'person_viktor_grandpa',
    name: 'Виктор',
    type: 'grandfather',
    age: 65,
    roleDescription: 'Дедушка',
    isPrimary: false,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    photos: [
      {
        id: 'photo_viktor_1',
        url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80',
        fileName: 'grandpa_viktor.jpg',
        fileSize: 1024 * 410,
        uploadedAt: new Date().toISOString(),
        isMainFace: true,
      },
    ],
  },
];

