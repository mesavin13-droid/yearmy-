import express from 'express';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '25mb' }));

// Helper to obtain a GoogleGenAI client with custom or default key
function getAiClient(customKey?: string): { client: GoogleGenAI | null; isCustom: boolean } {
  const keyToUse = customKey?.trim() || process.env.GEMINI_API_KEY;
  if (!keyToUse) return { client: null, isCustom: false };

  return {
    client: new GoogleGenAI({
      apiKey: keyToUse,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    }),
    isCustom: Boolean(customKey?.trim()),
  };
}

let rateLimitCoolDownUntil = 0;

function isRateLimited(): boolean {
  return Date.now() < rateLimitCoolDownUntil;
}

function handleAiError(err: any): void {
  const errMsg = String(err?.message || err);
  if (errMsg.includes('429') || errMsg.includes('quota') || errMsg.includes('RESOURCE_EXHAUSTED')) {
    // 30-second cooldown period to respect Free Tier limits
    rateLimitCoolDownUntil = Date.now() + 30000;
  }
}

// 1. Status Check Endpoint
app.get('/api/ai/status', (req, res) => {
  const customKey = (req.headers['x-gemini-api-key'] as string) || '';
  const hasKey = Boolean(customKey || process.env.GEMINI_API_KEY);

  res.json({
    status: 'ok',
    aiEnabled: hasKey && !isRateLimited(),
    coolingDown: isRateLimited(),
    hasCustomKey: Boolean(customKey),
    textModel: 'gemini-3.8-flash',
    imageModel: 'gemini-3.1-flash-lite-image',
  });
});

// 2. Validate API Key Endpoint
app.post('/api/ai/validate-key', async (req, res) => {
  const key = req.body?.apiKey?.trim() || (req.headers['x-gemini-api-key'] as string)?.trim();
  if (!key) {
    return res.json({ valid: false, message: 'Ключ API не передан' });
  }

  try {
    const testAi = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await testAi.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: 'Ответь одним словом: ОК',
    });

    if (response?.text) {
      return res.json({ valid: true, message: 'Ключ Gemini API успешно проверен и работает!' });
    }
    return res.json({ valid: false, message: 'Не получен ответ от модели' });
  } catch (err: any) {
    const msg = String(err?.message || err);
    if (msg.includes('API_KEY_INVALID') || msg.includes('400')) {
      return res.json({ valid: false, message: 'Недействительный ключ API. Проверьте правильность.' });
    }
    if (msg.includes('429') || msg.includes('quota')) {
      return res.json({ valid: false, message: 'Ключ действителен, но исчерпан лимит запросов (429).' });
    }
    return res.json({ valid: false, message: `Ошибка проверки: ${msg.slice(0, 100)}` });
  }
});

// 2. Batch AI Stories Endpoint (1 single API call for all 12 months)
app.post('/api/ai/generate-batch-stories', async (req, res) => {
  const { year, childNames, giftRecipient = 'grandparents' } = req.body;
  const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
  const { client, isCustom } = getAiClient(customKey);

  const defaultCaptions: Record<number, string> = {
    1: `Новогоднее чудо и сияющие глаза любимых внуков ${childNames || ''}.`,
    2: `Маленький защитник с большим сердцем — гордость дедушки и бабушки.`,
    3: `Весеннее тепло и самые нежные первые цветы для любимой бабушки.`,
    4: `Солнечные улыбки внуков, которые согревают каждый весенний день.`,
    5: `Праздничный май. Память поколений, которую мы бережно передаём дальше.`,
    6: `Начало лета! Солнце, босоногое счастье и звонкий детский смех.`,
    7: `Шум прибоя, замок из песка и самые счастливые мгновения лета на даче.`,
    8: `Тёплый август: спелые яблоки, сладкий арбуз и уютные вечера с бабушкой и дедушкой.`,
    9: `Новый рюкзак и важный шаг вперёд. Как быстро растут наши внуки!`,
    10: `Золотой октябрь. Уютное тепло родного дома и радость встречи.`,
    11: `Ноябрьский уют за чашкой чая, когда за окном кружится первый снег.`,
    12: `Ожидание чуда, запах мандаринов и самое дорогое счастье — большая семья.`,
  };

  if (!client || (!isCustom && isRateLimited())) {
    return res.json({ success: true, captions: defaultCaptions, fallback: true, rateLimited: isRateLimited() });
  }

  const prompt = `Ты — автор душевных семейных фотокалендарей «Мой Год» в подарок бабушке и дедушке.
Напиши ровно 12 коротких, очень трогательных предложений (по 1 для каждого месяца с 1 по 12) от лица любимых внуков (${childNames || 'внуков'}).
Формат ответа: строго JSON массив из 12 строк (без markdown кавычек).
Пример: ["Тёплый январь...", "Снежный февраль...", ...]`;

  try {
    const aiPromise = client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI batch timeout')), 5000)
    );

    const response: any = await Promise.race([aiPromise, timeoutPromise]);
    if (response?.text) {
      const parsed = JSON.parse(response.text.trim());
      if (Array.isArray(parsed) && parsed.length >= 12) {
        const result: Record<number, string> = {};
        parsed.slice(0, 12).forEach((cap, idx) => {
          result[idx + 1] = String(cap).replace(/^["«]|["»]$/g, '').trim();
        });
        return res.json({ success: true, captions: result });
      }
    }
  } catch (err: any) {
    handleAiError(err);
  }

  return res.json({ success: true, captions: defaultCaptions, fallback: true });
});

// 3. AI Personalized Story Caption Generation Endpoint
app.post('/api/ai/generate-story', async (req, res) => {
  const { monthName, holidayTitle, year, childNames, style, mood, tweak, customPrompt, giftRecipient = 'grandparents' } = req.body;
  const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
  const { client, isCustom } = getAiClient(customKey);

  const recipientDescriptions: Record<string, string> = {
    grandparents: 'любимым бабушке и дедушке от внуков',
    grandma: 'самой заботливой бабушке от внуков',
    grandpa: 'любимому дедушке от внуков',
    family: 'всей семье на память',
    godparents: 'дорогим крёстным родителям',
  };

  const recipientContext = recipientDescriptions[giftRecipient] || 'любимым бабушке и дедушке';

  const fallbackCaptions: Record<string, string> = {
    'Январь': `Новогоднее чудо и сияющие глаза любимых внуков ${childNames || ''}.`,
    'Февраль': `Маленький защитник с большим сердцем — гордость дедушки и бабушки.`,
    'Март': `Весеннее тепло и самые нежные весенние цветы для любимой бабушки.`,
    'Апрель': `Солнечные улыбки внуков, которые согревают каждый день.`,
    'Май': `Праздничный май. Память поколений, которую мы бережно передаём дальше.`,
    'Июнь': `Начало лета! Солнце, босоногое счастье и звонкий детский смех.`,
    'Июль': `Шум прибоя, замок из песка и самые счастливые мгновения лета на даче.`,
    'Август': `Тёплый август: спелые яблоки, сладкий арбуз и уютные вечера с бабушкой и дедушкой.`,
    'Сентябрь': `Новый рюкзак и важный шаг вперёд. Как быстро растут наши внуки!`,
    'Октябрь': `Золотой октябрь. Уютное тепло родного дома и радость встречи.`,
    'Ноябрь': `Ноябрьский уют за чашкой чая, когда за окном кружится первый снег.`,
    'Декабрь': `Ожидание чуда, запах мандаринов и самое дорогое счастье — большая семья.`,
  };

  if (!client || (!isCustom && isRateLimited())) {
    return res.json({
      success: true,
      caption: fallbackCaptions[monthName] || `Счастливые мгновения ${monthName} ${year || 2027} года для любимой семьи.`,
      fallback: true,
      rateLimited: isRateLimited(),
    });
  }

  const prompt = `Ты — автор душевных семейных фотокалендарей премиум-класса «Мой Год».
Календарь создаётся в ПОДАРОК: ${recipientContext}.
Герои фотографий на страницах — любимые внуки: ${childNames || 'внук'}.
Месяц: ${monthName || 'Месяц'} ${year || 2027} года.
Праздничный сюжет: ${holidayTitle || 'Семейный праздник'}.
Художественный стиль: ${style || 'Фотореализм'}.
${tweak ? `Пожелание родителей: ${tweak}.` : ''}
${customPrompt ? `Детали: ${customPrompt}.` : ''}

Строгие правила:
- Напиши ровно ОДНО короткое, тёплое, трогательное предложение (от 6 до 12 слов).
- Строго без кавычек.
- Подпись должна согревать сердце бабушки и дедушки, вызывать умиление, любовь и гордость за внуков.
- Избегай банальных шаблонных AI-штампов. Только искренние семейные чувства.`;

  try {
    const aiPromise = client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: { temperature: 0.8 },
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI request timeout')), 3500)
    );

    const response: any = await Promise.race([aiPromise, timeoutPromise]);
    const caption = response?.text ? response.text.trim().replace(/^["«]|["»]$/g, '') : '';
    if (caption) {
      return res.json({ success: true, caption });
    }
  } catch (err: any) {
    handleAiError(err);
  }

  return res.json({
    success: true,
    caption: fallbackCaptions[monthName] || `Счастливые мгновения ${monthName} ${year || 2027} года для любимой семьи.`,
    fallback: true,
  });
});

// 4. AI Dedication Generator Endpoint
app.post('/api/ai/generate-dedication', async (req, res) => {
  const { childNames, year, author, giftRecipient = 'grandparents' } = req.body;
  const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
  const { client, isCustom } = getAiClient(customKey);

  const recipientTarget = giftRecipient === 'grandma'
    ? 'бабушке'
    : giftRecipient === 'grandpa'
    ? 'дедушке'
    : giftRecipient === 'godparents'
    ? 'крёстным'
    : 'бабушке и дедушке';

  const defaultDedication = `Дорогим и любимым ${recipientTarget}!\nСпасибо за ваше бесконечное тепло, мудрость и заботу.\nПусть каждый день ${year || 2027} года дарит вам крепкое здоровье, спокойствие и улыбки!\nС любовью, ваши дети и внуки ${childNames ? `(${childNames})` : ''} ❤️`;

  if (!client || (!isCustom && isRateLimited())) {
    return res.json({
      success: true,
      dedication: defaultDedication,
      fallback: true,
      rateLimited: isRateLimited(),
    });
  }

  try {
    const prompt = `Напиши короткое, невероятно трогательное посвящение на первую страницу семейного календаря.
Календарь дарят в ПОДАРОК: ${recipientTarget}.
Подарок от: ${author || 'любящих детей и внуков'}.
Имена внуков / детей: ${childNames || 'Артём'}.
Год: ${year || 2027}.

Требования:
- 2-3 короткие душевные строчки с переносами строк.
- Слова глубокой благодарности за тепло, заботу, мудрость и пожелание крепкого здоровья и счастья на весь год.
- В конце подпись любящих внуков и детей с сердечком ❤️.
- Без пафоса, искренне, чтобы у старшего поколения выступили слёзы радости.`;

    const aiPromise = client.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AI dedication timeout')), 3500)
    );

    const response: any = await Promise.race([aiPromise, timeoutPromise]);
    const dedicationText = response?.text ? response.text.trim() : '';
    if (dedicationText) {
      return res.json({ success: true, dedication: dedicationText });
    }
  } catch (error: any) {
    handleAiError(error);
  }

  return res.json({
    success: true,
    dedication: defaultDedication,
    fallback: true,
  });
});

// 5. AI Image Generation / Scene Variation Endpoint
app.post('/api/ai/generate-image', async (req, res) => {
  try {
    const { prompt, aspectRatio = '4:3' } = req.body;
    const customKey = (req.headers['x-gemini-api-key'] as string) || req.body?.apiKey;
    const { client } = getAiClient(customKey);

    if (!client) {
      return res.json({
        success: false,
        fallback: true,
        message: 'No GEMINI_API_KEY provided; using curated photo scene',
      });
    }

    const response = await client.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [
          {
            text: `High-quality warm family photography: ${prompt}. Soft natural cinematic lighting, Leica 35mm shallow depth of field, tactile paper texture, joyful authentic expression, editorial magazine quality.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio === '1:1' ? '1:1' : '4:3',
        },
      },
    });

    let generatedImageUrl = '';
    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        generatedImageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }

    if (generatedImageUrl) {
      return res.json({
        success: true,
        imageUrl: generatedImageUrl,
      });
    }

    return res.json({
      success: false,
      fallback: true,
    });
  } catch (error: any) {
    return res.json({
      success: false,
      fallback: true,
      error: error.message,
    });
  }
});

async function startServer() {
  // Vite middlewares in development
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });

  app.use(vite.middlewares);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`> Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
