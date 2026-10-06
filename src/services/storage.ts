import { Calendar, Child, PricingPlan } from '../types/calendar';

const STORAGE_CALENDARS_KEY = 'moy_god_saved_calendars_v1';
const STORAGE_CURRENT_CALENDAR_ID = 'moy_god_active_calendar_id_v1';

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'pdf_export',
    title: 'PDF для печати',
    description: 'Файл сверхвысокого разрешения 300 DPI для самостоятельной печати в любой типографии города.',
    priceRub: 299,
  },
  {
    id: 'premium_gen',
    title: 'Премиум-генерация',
    description: 'Неограниченные перегенерации всех 12 месяцев, выбор из 3 вариантов для каждой даты и улучшение лиц.',
    priceRub: 499,
    originalPriceRub: 790,
  },
  {
    id: 'print_single',
    title: 'Печатный настенный календарь',
    description: 'Премиальная матовая бумага 250 г/м², металлическая пружина, ригель. Доставка курьером до двери.',
    priceRub: 1890,
    originalPriceRub: 2490,
    isPopular: true,
  },
  {
    id: 'family_pack',
    title: 'Семейный набор (3 календаря)',
    description: '1 для себя + 2 в подарок бабушкам и дедушкам. В красивых подарочных крафтовых коробках.',
    priceRub: 3490,
    originalPriceRub: 5670,
  },
];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateChildPhotoFile(file: File): FileValidationResult {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
  const maxSizeBytes = 12 * 1024 * 1024; // 12MB limit

  if (!allowedMimeTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic)$/i)) {
    return {
      valid: false,
      error: 'Поддерживаются только фотографии в форматах JPEG, PNG, WEBP или HEIC.',
    };
  }

  if (file.size > maxSizeBytes) {
    return {
      valid: false,
      error: 'Размер фотографии превышает допустимый лимит (до 12 МБ).',
    };
  }

  return { valid: true };
}

export class CalendarRepository {
  static getSavedCalendars(): Calendar[] {
    try {
      const data = localStorage.getItem(STORAGE_CALENDARS_KEY);
      if (!data) return [];
      return JSON.parse(data) as Calendar[];
    } catch {
      return [];
    }
  }

  static saveCalendar(calendar: Calendar): void {
    try {
      const current = this.getSavedCalendars();
      const existingIdx = current.findIndex((c) => c.id === calendar.id);
      let updated: Calendar[];
      if (existingIdx >= 0) {
        updated = [...current];
        updated[existingIdx] = { ...calendar, updatedAt: new Date().toISOString() };
      } else {
        updated = [calendar, ...current];
      }
      localStorage.setItem(STORAGE_CALENDARS_KEY, JSON.stringify(updated));
      localStorage.setItem(STORAGE_CURRENT_CALENDAR_ID, calendar.id);
    } catch (e) {
      console.warn('LocalStorage save error (likely quota):', e);
    }
  }

  static getCalendarById(id: string): Calendar | null {
    const all = this.getSavedCalendars();
    return all.find((c) => c.id === id) || null;
  }

  static getActiveCalendarId(): string | null {
    return localStorage.getItem(STORAGE_CURRENT_CALENDAR_ID);
  }

  static setActiveCalendarId(id: string): void {
    localStorage.setItem(STORAGE_CURRENT_CALENDAR_ID, id);
  }

  static deleteCalendar(id: string): void {
    const current = this.getSavedCalendars();
    const filtered = current.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_CALENDARS_KEY, JSON.stringify(filtered));
  }

  static clearAll(): void {
    localStorage.removeItem(STORAGE_CALENDARS_KEY);
    localStorage.removeItem(STORAGE_CURRENT_CALENDAR_ID);
  }
}
