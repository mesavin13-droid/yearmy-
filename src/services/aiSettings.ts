// Service to manage AI API Key and Generation Settings

const STORAGE_CUSTOM_KEY = 'moy_god_gemini_api_key_v1';
const STORAGE_AI_MODE = 'moy_god_ai_mode_v1';

export type AiMode = 'smart' | 'instant';

export const AiSettingsService = {
  getCustomKey(): string {
    try {
      return localStorage.getItem(STORAGE_CUSTOM_KEY) || '';
    } catch {
      return '';
    }
  },

  setCustomKey(key: string): void {
    try {
      if (key.trim()) {
        localStorage.setItem(STORAGE_CUSTOM_KEY, key.trim());
      } else {
        localStorage.removeItem(STORAGE_CUSTOM_KEY);
      }
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  clearCustomKey(): void {
    try {
      localStorage.removeItem(STORAGE_CUSTOM_KEY);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getAiMode(): AiMode {
    try {
      const mode = localStorage.getItem(STORAGE_AI_MODE);
      return mode === 'instant' ? 'instant' : 'smart';
    } catch {
      return 'smart';
    }
  },

  setAiMode(mode: AiMode): void {
    try {
      localStorage.setItem(STORAGE_AI_MODE, mode);
    } catch (e) {
      console.warn('Storage error:', e);
    }
  },

  getApiHeaders(): Record<string, string> {
    const customKey = this.getCustomKey();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (customKey) {
      headers['x-gemini-api-key'] = customKey;
    }
    return headers;
  },

  async validateKey(key: string): Promise<{ valid: boolean; message: string }> {
    try {
      const res = await fetch('/api/ai/validate-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key }),
      });
      const data = await res.json();
      return {
        valid: Boolean(data.valid),
        message: data.message || (data.valid ? 'Ключ успешно проверен' : 'Не удалось проверить ключ'),
      };
    } catch (err: any) {
      return { valid: false, message: err.message || 'Ошибка сети' };
    }
  },
};
