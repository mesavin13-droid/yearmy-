// Universal Prompt Builder for "МОЙ ГОД" Family Calendar

import { Person, VisualStyleId } from '../types/calendar';
import { MONTH_PROMPTS, MonthPromptConfig } from '../data/monthPrompts';

export interface BuildMonthPromptOptions {
  month: number; // 1 to 12
  people: Person[];
  style: VisualStyleId;
  customRequest?: string;
}

export interface BuiltPromptResult {
  fullPrompt: string;
  negativePrompt: string;
  monthConfig: MonthPromptConfig;
  compositionRule: string;
  peopleDescription: string;
  peopleCount: number;
}

export const BASE_IDENTITY_PROMPT = `Use the uploaded reference photos as identity references for every selected person.
Include exactly the people selected by the user.
Do not add any unselected people.
Preserve each person’s recognizable identity, facial features, hairstyle, hair color, eye color, skin tone, age and body proportions.
Do not merge identities.
Do not change the age of any child.
Create a realistic professional family photograph.
Natural anatomy, realistic hands, realistic fingers, realistic skin and hair.
Natural interaction between family members.
The final image must look like a real professional family photoshoot, not an AI-generated image.
Vertical composition suitable for a printed family calendar.
Leave clean negative space for calendar typography.
Do not generate any text, letters, numbers, logos or watermarks inside the image.`;

export const UNIVERSAL_NEGATIVE_PROMPT = `extra people, duplicate person, duplicated face, merged faces, wrong identity, different child, different age, deformed face, distorted hands, extra fingers, missing fingers, unnatural anatomy, duplicate limbs, blurry face, plastic skin, artificial face, text, letters, numbers, watermark, logo, bad framing, cropped faces, distorted eyes`;

export const STYLE_DESCRIPTIONS: Record<string, string> = {
  'realistic': 'Style: Realistic high-end photography, natural soft lighting, true-to-life colors, authentic warm expressions.',
  'photorealism': 'Style: Realistic high-end photography, natural soft lighting, true-to-life colors, authentic warm expressions.',
  'cinematic': 'Style: Cinematic film still, 35mm lens, warm golden cinematic lighting, rich depth of field, atmospheric mood.',
  'fairytale': 'Style: Magical fairytale atmosphere, soft ethereal glow, enchanting sparkles, warm storybook aesthetic.',
  'tender': 'Style: Gentle pastel aesthetic, soft diffused warm light, tender tactile warmth and cozy linen textures.',
  'premium family photography': 'Style: Premium studio and editorial family photoshoot, Leica look, soft diffused light, luxury linen texture.',
  '3D animation': 'Style: Charming 3D stylized animated family art style, Pixar-inspired warm expressive characters, rich textures.',
  '3d_story': 'Style: Charming 3D stylized animated family art style, Pixar-inspired warm expressive characters, rich textures.',
};

/**
 * Derives dynamic composition rules based strictly on people count
 */
export function getDynamicComposition(peopleCount: number): string {
  if (peopleCount <= 1) {
    return 'Composition: Single person centered hero composition, emotionally engaging portrait, perfectly framed with clear seasonal background elements.';
  }
  if (peopleCount <= 3) {
    return 'Composition: Intimate group composition of all selected individuals, natural close physical proximity, all faces and eyes clearly visible and recognizable, natural interaction.';
  }
  return `Composition: Wide harmonious family group portrait featuring all ${peopleCount} individuals without clutter, balanced tiered standing and sitting poses, all faces clearly visible and recognizable, no overlapping occlusions or cropped individuals.`;
}

/**
 * Builds clean, structured description of the people roster
 */
export function buildPeopleRoster(people: Person[]): string {
  if (!people || people.length === 0) {
    return 'PEOPLE IN SCENE: 1 child hero (primary protagonist).';
  }

  const count = people.length;
  const countRule = `EXACT PEOPLE COUNT: ${count} (${count === 1 ? 'EXACTLY ONE PERSON' : `EXACTLY ${count} PEOPLE`} — DO NOT ADD ANY EXTRA OR UNSELECTED PEOPLE).`;

  const rosterLines = people.map((p, idx) => {
    const ageText = p.age ? `, Age: ${p.age} years old` : '';
    const typeText = p.type ? `Type: ${p.type}` : 'Type: family member';
    const roleText = p.roleDescription ? `, Role: ${p.roleDescription}` : '';
    const photoRef = p.photos && p.photos.length > 0 ? ` [Identity reference: ${p.photos[0].fileName || `photo_${idx + 1}`}]` : '';
    return `  - Person #${idx + 1}: ${p.name} (${typeText}${ageText}${roleText})${photoRef}`;
  });

  return `${countRule}\nPEOPLE ROSTER:\n${rosterLines.join('\n')}`;
}

/**
 * Main Universal Prompt Builder:
 * USER PEOPLE DATA + REFERENCE PHOTOS + MONTH PROMPT + STYLE + CALENDAR REQUIREMENTS = FINAL IMAGE PROMPT
 */
export function buildMonthPrompt(options: BuildMonthPromptOptions): BuiltPromptResult {
  const { month, people = [], style = 'premium family photography', customRequest = '' } = options;

  const monthConfig = MONTH_PROMPTS.find((m) => m.month === month) || MONTH_PROMPTS[0];
  const count = people.length || 1;
  const compositionRule = getDynamicComposition(count);
  const peopleDescription = buildPeopleRoster(people);
  const styleDescription = STYLE_DESCRIPTIONS[style] || STYLE_DESCRIPTIONS['premium family photography'];

  const promptSections = [
    '=== 1. BASE IDENTITY & PHOTOGRAPHY INSTRUCTIONS ===',
    BASE_IDENTITY_PROMPT,
    '',
    '=== 2. PEOPLE ROSTER & EXACT COUNT CONSTRAINT ===',
    peopleDescription,
    '',
    '=== 3. MONTH SCENE & SEASONAL THEME ===',
    `Month: ${monthConfig.name} (${monthConfig.season.toUpperCase()})`,
    `Theme: ${monthConfig.theme}`,
    `Scene description: ${monthConfig.prompt}`,
    `Seasonal Mood: ${monthConfig.mood}`,
    '',
    '=== 4. COMPOSITION & FRAMING ===',
    compositionRule,
    `Month-specific composition: ${monthConfig.composition}`,
    '',
    '=== 5. ARTISTIC STYLE ===',
    styleDescription,
  ];

  if (customRequest && customRequest.trim()) {
    promptSections.push(
      '',
      '=== 6. USER CUSTOM REQUEST ===',
      `USER CUSTOM REQUEST: ${customRequest.trim()}`
    );
  }

  const fullPrompt = promptSections.join('\n');

  return {
    fullPrompt,
    negativePrompt: UNIVERSAL_NEGATIVE_PROMPT,
    monthConfig,
    compositionRule,
    peopleDescription,
    peopleCount: count,
  };
}
