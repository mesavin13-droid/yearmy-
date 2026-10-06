import { MonthConfig, VisualStyle } from '../types/calendar';
import { MONTH_PROMPTS } from '../data/monthPrompts';

export const VISUAL_STYLES: VisualStyle[] = [
  {
    id: 'premium family photography',
    name: 'Премиум фотосессия',
    tagline: 'Студийный журнал',
    description: 'Естественный рассеянный свет, благородные натуральные ткани, чистая оптика Leica и безупречная цветокоррекция.',
    icon: '📸',
    palette: 'Тёплый лен, крем, мягкий дневной свет',
    previewImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'realistic',
    name: 'Реализм',
    tagline: 'Живые семейные моменты',
    description: 'Абсолютно естественные фотографии из жизни. Истинные эмоции, естественные позы и тёплый домашний уют.',
    icon: '🎞️',
    palette: 'Натуральные природные оттенки, мягкие тени',
    previewImage: 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'cinematic',
    name: 'Кинематограф',
    tagline: 'Кадр из любимого фильма',
    description: 'Глубокие кадры с художественным объёмом, тёплым золотым светом и кинематографичной оптикой 35мм.',
    icon: '🎬',
    palette: 'Контрастные тёплые акценты, глубина резкости',
    previewImage: 'https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'fairytale',
    name: 'Сказочный',
    tagline: 'Магия и волшебство',
    description: 'Мягкое волшебное свечение, мерцающие огоньки, золотые искры и атмосфера доброй семейной сказки.',
    icon: '✨',
    palette: 'Глубокий синий, золото, янтарные огни',
    previewImage: 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: '3D animation',
    name: '3D анимация',
    tagline: 'Семейный мультфильм',
    description: 'Выразительный стиль современной 3D-анимации. Тёплые округлые формы, яркие эмоции и очарование.',
    icon: '🧸',
    palette: 'Пастельные насыщенные оттенки, мягкий глянец',
    previewImage: 'https://images.unsplash.com/photo-1566140967404-b8b3932483f5?auto=format&fit=crop&w=600&q=80',
  },
];

export const MONTH_CONFIGS: MonthConfig[] = MONTH_PROMPTS.map((mp) => ({
  number: mp.month,
  name: mp.name,
  nameGenitive: mp.nameGenitive,
  season: mp.season,
  holidayTitle: mp.theme,
  themeDescription: mp.prompt,
  storyCaptionDefault: mp.storyCaptionDefault,
  colorTone: mp.colorTone,
  icon: mp.icon,
  mockSceneUrl: mp.mockSceneUrl,
}));

export interface DayInfo {
  dayNumber: number;
  isCurrentMonth: boolean;
  isWeekend: boolean;
  isHoliday?: boolean;
  holidayName?: string;
}

// Russian official non-working holidays
export const RUSSIAN_HOLIDAYS_BY_MONTH: Record<number, number[]> = {
  1: [1, 2, 3, 4, 5, 6, 7, 8],
  2: [23],
  3: [8],
  5: [1, 9],
  6: [12],
  11: [4],
};

// Generates calendar matrix for a given month and year
export function getCalendarGridDays(year: number, monthIndex0: number): DayInfo[] {
  const firstDayOfMonth = new Date(year, monthIndex0, 1);
  const lastDayOfMonth = new Date(year, monthIndex0 + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();

  // Russian week starts on Monday: Monday = 0, ..., Sunday = 6
  let firstDayWeekday = firstDayOfMonth.getDay() - 1;
  if (firstDayWeekday === -1) firstDayWeekday = 6;

  const days: DayInfo[] = [];

  // Previous month fill
  const prevMonthLastDate = new Date(year, monthIndex0, 0).getDate();
  for (let i = firstDayWeekday - 1; i >= 0; i--) {
    days.push({
      dayNumber: prevMonthLastDate - i,
      isCurrentMonth: false,
      isWeekend: false,
    });
  }

  const holidays = RUSSIAN_HOLIDAYS_BY_MONTH[monthIndex0 + 1] || [];

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const dayOfWeek = (firstDayWeekday + d - 1) % 7;
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Saturday (5), Sunday (6)
    const isHoliday = holidays.includes(d);

    days.push({
      dayNumber: d,
      isCurrentMonth: true,
      isWeekend,
      isHoliday,
    });
  }

  // Next month tail to fill clean 6-row or 5-row grid
  const remaining = (7 - (days.length % 7)) % 7;
  for (let n = 1; n <= remaining; n++) {
    days.push({
      dayNumber: n,
      isCurrentMonth: false,
      isWeekend: false,
    });
  }

  return days;
}
