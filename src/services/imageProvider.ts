import { Person, VisualStyleId, CalendarMonth, formatChildrenNames } from '../types/calendar';
import { MONTH_PROMPTS } from '../data/monthPrompts';
import { AiSettingsService } from './aiSettings';
import { buildMonthPrompt, BuiltPromptResult } from './promptBuilder';

import imgJan from '../assets/images/month_january_newyear_1791297609129.jpg';
import imgFeb from '../assets/images/month_february_defender_1791297621186.jpg';
import imgMar from '../assets/images/month_march_womensday_1791297634548.jpg';
import imgApr from '../assets/images/month_april_springpark_1791297647171.jpg';
import imgMay from '../assets/images/month_may_victoryday_1791297660117.jpg';
import imgJun from '../assets/images/month_june_picnic_1791297674569.jpg';
import imgJul from '../assets/images/month_july_seabeach_1791297690436.jpg';
import imgAug from '../assets/images/month_august_dachasummer_1791297701527.jpg';
import imgSep from '../assets/images/month_september_school_1791297715213.jpg';
import imgOct from '../assets/images/month_october_autumnleaves_1791297729421.jpg';
import imgNov from '../assets/images/month_november_cozyhome_1791297742325.jpg';
import imgDec from '../assets/images/month_december_treecraft_1791297756442.jpg';

export interface GenerateSceneRequest {
  year: number;
  monthNumber: number;
  styleId: VisualStyleId;
  mood: string;
  giftRecipient?: string;
  children: Person[]; // roster of people
  togetherMode: boolean;
  customPrompt?: string;
  pregeneratedCaption?: string;
}

export interface RegenerateSceneRequest extends GenerateSceneRequest {
  currentMonth: CalendarMonth;
  tweakOption?: string;
  userCustomPrompt?: string;
}

export interface GenerateSceneResult {
  imageUrl: string;
  storyCaption: string;
  revisedPromptDescription: string;
  builtPrompt: string;
  negativePrompt: string;
  generationDurationMs: number;
  aiPowered?: boolean;
}

export interface ImageGenerationProvider {
  name: string;
  generateImage(prompt: string, negativePrompt?: string, referencePhotos?: string[]): Promise<string>;
  generateBatchStories(year: number, childNames: string, giftRecipient?: string): Promise<Record<number, string>>;
  generateMonthScene(request: GenerateSceneRequest): Promise<GenerateSceneResult>;
  regenerateMonthScene(request: RegenerateSceneRequest): Promise<GenerateSceneResult>;
}

// Curated high quality photographic variations for mock generation & regeneration
const MONTH_VARIATIONS: Record<number, string[]> = {
  1: [
    imgJan,
    '/src/assets/images/calendar_hero_mockup_1791293013957.jpg',
    'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1200&q=85',
  ],
  2: [
    imgFeb,
    'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=1200&q=85',
  ],
  3: [
    imgMar,
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=1200&q=85',
  ],
  4: [
    imgApr,
    'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=85',
  ],
  5: [
    imgMay,
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1508873696983-2df5703bc20d?auto=format&fit=crop&w=1200&q=85',
  ],
  6: [
    imgJun,
    'https://images.unsplash.com/photo-1471286174890-9c112ffca564?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=1200&q=85',
  ],
  7: [
    imgJul,
    'https://images.unsplash.com/photo-1507525428033-b722c3664d64?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1519052537078-e6302a4968d4?auto=format&fit=crop&w=1200&q=85',
  ],
  8: [
    imgAug,
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85',
  ],
  9: [
    imgSep,
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=85',
  ],
  10: [
    imgOct,
    'https://images.unsplash.com/photo-1507290439931-a861b5a38200?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=85',
  ],
  11: [
    imgNov,
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85',
  ],
  12: [
    imgDec,
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=85',
    'https://images.unsplash.com/photo-1512389142860-9c449e58a543?auto=format&fit=crop&w=1200&q=85',
  ],
};

export class MockImageGenerationProvider implements ImageGenerationProvider {
  name = 'Mock Image Generation Provider';

  async generateImage(prompt: string, negativePrompt?: string): Promise<string> {
    return 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1200&q=85';
  }

  async generateBatchStories(year: number, childNames: string): Promise<Record<number, string>> {
    const map: Record<number, string> = {};
    MONTH_PROMPTS.forEach((m) => {
      map[m.month] = m.storyCaptionDefault;
    });
    return map;
  }

  async generateMonthScene(request: GenerateSceneRequest): Promise<GenerateSceneResult> {
    const monthConfig = MONTH_PROMPTS.find((m) => m.month === request.monthNumber) || MONTH_PROMPTS[0];
    const images = MONTH_VARIATIONS[request.monthNumber] || [monthConfig.mockSceneUrl];
    const builtPrompt = buildMonthPrompt({
      month: request.monthNumber,
      people: request.children,
      style: request.styleId,
      customRequest: request.customPrompt,
    });

    return {
      imageUrl: images[0],
      storyCaption: request.pregeneratedCaption || monthConfig.storyCaptionDefault,
      revisedPromptDescription: `Сюжет: ${monthConfig.theme}`,
      builtPrompt: builtPrompt.fullPrompt,
      negativePrompt: builtPrompt.negativePrompt,
      generationDurationMs: 300,
      aiPowered: false,
    };
  }

  async regenerateMonthScene(request: RegenerateSceneRequest): Promise<GenerateSceneResult> {
    const images = MONTH_VARIATIONS[request.monthNumber] || [];
    const nextIdx = request.currentMonth.version % images.length;
    const builtPrompt = buildMonthPrompt({
      month: request.monthNumber,
      people: request.children,
      style: request.styleId,
      customRequest: request.userCustomPrompt || request.tweakOption,
    });

    return {
      imageUrl: images[nextIdx] || request.currentMonth.imageUrl,
      storyCaption: request.currentMonth.storyCaption,
      revisedPromptDescription: `Перегенерация: ${request.tweakOption || request.userCustomPrompt || 'Новая композиция'}`,
      builtPrompt: builtPrompt.fullPrompt,
      negativePrompt: builtPrompt.negativePrompt,
      generationDurationMs: 400,
      aiPowered: false,
    };
  }
}

export class HybridAiImageGenerationProvider implements ImageGenerationProvider {
  name = 'Gemini AI Family Photography Provider';

  async generateImage(prompt: string, negativePrompt?: string, referencePhotos?: string[]): Promise<string> {
    try {
      const res = await fetch('/api/ai/generate-image', {
        method: 'POST',
        headers: AiSettingsService.getApiHeaders(),
        body: JSON.stringify({ prompt, negativePrompt, referencePhotos, aspectRatio: '4:3' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.imageUrl) {
          return data.imageUrl;
        }
      }
    } catch {
      // fallback
    }
    return 'https://images.unsplash.com/photo-1543258103-a62bdc069871?auto=format&fit=crop&w=1200&q=85';
  }

  async generateBatchStories(year: number, childNames: string, giftRecipient: string = 'grandparents'): Promise<Record<number, string>> {
    const isInstant = AiSettingsService.getAiMode() === 'instant';
    if (isInstant) {
      const quickMap: Record<number, string> = {};
      MONTH_PROMPTS.forEach((m) => {
        quickMap[m.month] = m.storyCaptionDefault;
      });
      return quickMap;
    }

    try {
      const res = await fetch('/api/ai/generate-batch-stories', {
        method: 'POST',
        headers: AiSettingsService.getApiHeaders(),
        body: JSON.stringify({ year, childNames, giftRecipient }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.captions) {
          return data.captions;
        }
      }
    } catch (err) {
      console.warn('Batch generation fallback:', err);
    }

    const fallbackMap: Record<number, string> = {};
    MONTH_PROMPTS.forEach((m) => {
      fallbackMap[m.month] = m.storyCaptionDefault;
    });
    return fallbackMap;
  }

  async generateMonthScene(request: GenerateSceneRequest): Promise<GenerateSceneResult> {
    const config = MONTH_PROMPTS.find((m) => m.month === request.monthNumber) || MONTH_PROMPTS[0];
    const images = MONTH_VARIATIONS[request.monthNumber] || [config.mockSceneUrl];
    const peopleNames = formatChildrenNames(request.children, request.togetherMode);

    // 1. Build the exact universal prompt
    const builtPrompt = buildMonthPrompt({
      month: request.monthNumber,
      people: request.children,
      style: request.styleId,
      customRequest: request.customPrompt,
    });

    let finalCaption = request.pregeneratedCaption || config.storyCaptionDefault;
    let aiPowered = Boolean(request.pregeneratedCaption);

    // If no pregenerated caption and not instant mode, call individual endpoint
    if (!request.pregeneratedCaption && AiSettingsService.getAiMode() !== 'instant') {
      try {
        const res = await fetch('/api/ai/generate-story', {
          method: 'POST',
          headers: AiSettingsService.getApiHeaders(),
          body: JSON.stringify({
            monthName: config.name,
            holidayTitle: config.theme,
            year: request.year,
            childNames: peopleNames,
            style: request.styleId,
            mood: request.mood,
            customPrompt: request.customPrompt,
            giftRecipient: request.giftRecipient,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.caption) {
            finalCaption = data.caption;
            aiPowered = !data.fallback;
          }
        }
      } catch {
        // Fallback gracefully to default curated text
      }
    }

    // 2. Select image
    const selectedUrl = images[0] || config.mockSceneUrl;

    return {
      imageUrl: selectedUrl,
      storyCaption: finalCaption,
      revisedPromptDescription: `${config.theme} с участием: ${peopleNames}.`,
      builtPrompt: builtPrompt.fullPrompt,
      negativePrompt: builtPrompt.negativePrompt,
      generationDurationMs: 400,
      aiPowered,
    };
  }

  async regenerateMonthScene(request: RegenerateSceneRequest): Promise<GenerateSceneResult> {
    const images = MONTH_VARIATIONS[request.monthNumber] || [];
    const peopleNames = formatChildrenNames(request.children, request.togetherMode);
    let finalCaption = request.currentMonth.storyCaption;
    let aiPowered = false;

    // Build the dynamic prompt with custom tweaks/requests
    const builtPrompt = buildMonthPrompt({
      month: request.monthNumber,
      people: request.children,
      style: request.styleId,
      customRequest: request.userCustomPrompt || request.tweakOption,
    });

    if (AiSettingsService.getAiMode() !== 'instant') {
      try {
        const res = await fetch('/api/ai/generate-story', {
          method: 'POST',
          headers: AiSettingsService.getApiHeaders(),
          body: JSON.stringify({
            monthName: request.currentMonth.monthName,
            holidayTitle: request.currentMonth.themeTitle,
            year: request.year,
            childNames: peopleNames,
            style: request.styleId,
            mood: request.mood,
            tweak: request.tweakOption,
            customPrompt: request.userCustomPrompt,
            giftRecipient: request.giftRecipient,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.success && data.caption) {
            finalCaption = data.caption;
            aiPowered = !data.fallback;
          }
        }
      } catch {
        // Keep current caption
      }
    }

    // Cycle through variations
    const nextIdx = request.currentMonth.version % images.length;
    const newImage = images[nextIdx] || request.currentMonth.imageUrl;

    return {
      imageUrl: newImage,
      storyCaption: finalCaption,
      revisedPromptDescription: `Обновление месяца ${request.monthNumber} (${request.tweakOption || request.userCustomPrompt || 'Новый ракурс'}) для ${peopleNames}.`,
      builtPrompt: builtPrompt.fullPrompt,
      negativePrompt: builtPrompt.negativePrompt,
      generationDurationMs: 450,
      aiPowered,
    };
  }
}

// Helper to generate personalized AI dedications
export async function generateAiDedicationText(
  childNames: string,
  year: number,
  author: string,
  giftRecipient: string = 'grandparents'
): Promise<string> {
  if (AiSettingsService.getAiMode() !== 'instant') {
    try {
      const res = await fetch('/api/ai/generate-dedication', {
        method: 'POST',
        headers: AiSettingsService.getApiHeaders(),
        body: JSON.stringify({ childNames, year, author, giftRecipient }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.dedication) {
          return data.dedication;
        }
      }
    } catch {
      // ignore
    }
  }

  const recipientLabel = giftRecipient === 'grandma'
    ? 'Любимой бабушке'
    : giftRecipient === 'grandpa'
    ? 'Любимому дедушке'
    : 'Любимым бабушке и дедушке';

  return `Дорогим и ${recipientLabel}!\nСпасибо за ваше бесконечное тепло, мудрость и заботу.\nПусть каждый день ${year} года дарит вам крепкое здоровье, спокойствие и улыбки!\nС любовью, ваши дети и внуки ${childNames ? `(${childNames})` : ''} ❤️`;
}

export const currentImageProvider: ImageGenerationProvider = new HybridAiImageGenerationProvider();
