// Telegram Mini App (TMA) helper & adapter

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        initData: string;
        initDataUnsafe?: {
          user?: TelegramUser;
        };
        themeParams?: Record<string, string>;
        isExpanded?: boolean;
        headerColor?: string;
        backgroundColor?: string;
        MainButton?: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
          setText: (text: string) => void;
          showProgress: (leaveActive: boolean) => void;
          hideProgress: () => void;
        };
        BackButton?: {
          isVisible: boolean;
          show: () => void;
          hide: () => void;
          onClick: (cb: () => void) => void;
          offClick: (cb: () => void) => void;
        };
        HapticFeedback?: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export class TelegramService {
  static isInsideTelegram(): boolean {
    return typeof window !== 'undefined' && Boolean(window.Telegram?.WebApp?.initData);
  }

  static getTelegramUser(): TelegramUser | null {
    if (typeof window === 'undefined') return null;
    return window.Telegram?.WebApp?.initDataUnsafe?.user || null;
  }

  static init(): void {
    if (typeof window === 'undefined') return;
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      if (tg.headerColor) tg.headerColor = '#FAF7F2';
      if (tg.backgroundColor) tg.backgroundColor = '#FAF7F2';
    }
  }

  static triggerHaptic(style: 'light' | 'medium' | 'heavy' | 'success' = 'light'): void {
    if (typeof window === 'undefined') return;
    const haptic = window.Telegram?.WebApp?.HapticFeedback;
    if (haptic) {
      if (style === 'success') {
        haptic.notificationOccurred('success');
      } else {
        haptic.impactOccurred(style);
      }
    }
  }
}
