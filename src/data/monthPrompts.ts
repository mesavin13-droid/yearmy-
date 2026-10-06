// 12 Months Configuration and Prompts for "МОЙ ГОД"

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

export interface MonthPromptConfig {
  month: number;
  name: string;
  nameGenitive: string;
  theme: string;
  prompt: string;
  composition: string;
  mood: string;
  season: 'winter' | 'spring' | 'summer' | 'autumn';
  icon: string;
  colorTone: string;
  storyCaptionDefault: string;
  mockSceneUrl: string;
}

export const MONTH_PROMPTS: MonthPromptConfig[] = [
  {
    month: 1,
    name: 'Январь',
    nameGenitive: 'января',
    theme: 'Новый год',
    prompt: 'Cozy festive New Year celebration at home. Decorated tall evergreen Christmas tree with warm twinkling fairy lights and delicate glass baubles, wrapped holiday gift boxes on the floor, soft gentle snowfall visible through the frosted window, warm ambient fireplace glow, joyful festive atmosphere.',
    composition: 'Warm centered family composition around the festive Christmas tree and gifts, cozy holiday atmosphere with depth and warm lighting.',
    mood: 'Joyful, warm, magical holiday anticipation, cozy and loving.',
    season: 'winter',
    icon: '🎄',
    colorTone: '#8C3D2B',
    storyCaptionDefault: 'Новогоднее чудо, тёплый свет гирлянд и самое дорогое счастье — быть вместе.',
    mockSceneUrl: imgJan,
  },
  {
    month: 2,
    name: 'Февраль',
    nameGenitive: 'февраля',
    theme: '23 февраля',
    prompt: 'Refined 23 February Defender of the Fatherland Day celebration. Elegant patriotic and respectful family atmosphere, fresh bright red carnations, subtle Russian tricolor silk ribbon motif, classic warm interior, heroic pride, no combat or aggressive military aesthetics.',
    composition: 'Proud and respectful family group portrait, noble posture, warm eye contact, soft natural window light.',
    mood: 'Proud, noble, protective, warm and loving family respect.',
    season: 'winter',
    icon: '🎖️',
    colorTone: '#34495E',
    storyCaptionDefault: 'Наши главные защитники и гордость семьи — с большим и добрым сердцем.',
    mockSceneUrl: imgFeb,
  },
  {
    month: 3,
    name: 'Март',
    nameGenitive: 'марта',
    theme: '8 марта & Первые цветы',
    prompt: 'International Women’s Day 8 March spring celebration. Fresh lush bouquet of bright yellow mimosa and delicate pink and red spring tulips, early soft spring morning sunshine streaming into a light airy room, gentle loving smiles, tender affection.',
    composition: 'Tender close-knit composition, holding spring flowers with care, joyful expressions and pastel tones.',
    mood: 'Tender, bright, loving, fresh spring awakening.',
    season: 'spring',
    icon: '🌷',
    colorTone: '#5B7065',
    storyCaptionDefault: 'Первые весенние тюльпаны, ласковое солнце и море любви для самых дорогих.',
    mockSceneUrl: imgMar,
  },
  {
    month: 4,
    name: 'Апрель',
    nameGenitive: 'апреля',
    theme: 'Весеннее пробуждение природы',
    prompt: 'Sunny spring park in April. Blooming fruit trees with delicate white and pink cherry blossoms, fresh green grass, warm golden afternoon sunbeams, gentle spring breeze, light spring jackets, floating soap bubbles.',
    composition: 'Lively outdoor park setting with natural depth, blooming branches framing the family members comfortably.',
    mood: 'Carefree, refreshing, cheerful, full of vitality and spring joy.',
    season: 'spring',
    icon: '🌱',
    colorTone: '#4F7942',
    storyCaptionDefault: 'Природа оживает после долгой зимы, наполняя каждый день солнечным светом.',
    mockSceneUrl: imgApr,
  },
  {
    month: 5,
    name: 'Май',
    nameGenitive: 'мая',
    theme: '9 мая · День Победы и памяти',
    prompt: 'Solemn and peaceful 9 May Victory Day remembrance. Fresh red carnations, authentic St. George ribbon, blossoming spring apple orchard in full white bloom, clear peaceful blue sky, honorable memory of generations, strictly peaceful atmosphere without warfare or weapons.',
    composition: 'Harmonious multi-generational or family portrait in a blooming garden, holding commemorative red flowers with reverence.',
    mood: 'Solemn, peaceful, grateful, profound family unity and memory.',
    season: 'spring',
    icon: '🎗️',
    colorTone: '#8B263E',
    storyCaptionDefault: 'Праздничный май. Память поколений и мирное небо, которое мы бережно храним.',
    mockSceneUrl: imgMay,
  },
  {
    month: 6,
    name: 'Июнь',
    nameGenitive: 'июня',
    theme: 'Начало лета & Пикник',
    prompt: 'First month of summer in June. Picturesque countryside meadow with yellow dandelions and lush green grass, relaxed sunny picnic on a classic checkered blanket with fresh strawberries and homemade lemonade, warm bright daylight.',
    composition: 'Relaxed natural gathering on the summer grass, candid interactions, laughing and enjoying the sunshine.',
    mood: 'Carefree, radiant, playful, warm summer freedom.',
    season: 'summer',
    icon: '☀️',
    colorTone: '#D4AC0D',
    storyCaptionDefault: 'Здравствуй, долгожданное лето! Время босоногого счастья, солнца и приключений.',
    mockSceneUrl: imgJun,
  },
  {
    month: 7,
    name: 'Июль',
    nameGenitive: 'июля',
    theme: 'Летние каникулы & Море',
    prompt: 'Mid-summer coastal vacation in July. Golden sandy beach beside calm turquoise sparkling sea, gentle seafoam, building sandcastles together, sea breeze, bright warm sunlight, coastal holiday joy.',
    composition: 'Scenic sea horizon background with clear foreground focus on the family by the shore.',
    mood: 'Sun-drenched, exhilarating, peaceful, cherished summer vacation.',
    season: 'summer',
    icon: '🌊',
    colorTone: '#2980B9',
    storyCaptionDefault: 'Шум прибоя, тёплый песок и самые счастливые мгновения летнего путешествия.',
    mockSceneUrl: imgJul,
  },
  {
    month: 8,
    name: 'Август',
    nameGenitive: 'августа',
    theme: 'Конец лета & Дачный сад',
    prompt: 'Cozy late August evening in an orchard dacha garden. Ripe red apples on trees, large sweet sliced watermelon on a wooden garden table, warm golden hour sunset light filtering through leaves, vintage cozy terrace.',
    composition: 'Warm rustic garden setting, gathered around the orchard table sharing sweet fruit in the golden hour glow.',
    mood: 'Abundant, peaceful, nostalgic, sweet golden warmth.',
    season: 'summer',
    icon: '🍉',
    colorTone: '#C0392B',
    storyCaptionDefault: 'Тёплый август на даче: спелые яблоки, сладкий арбуз и уютные душевные вечера.',
    mockSceneUrl: imgAug,
  },
  {
    month: 9,
    name: 'Сентябрь',
    nameGenitive: 'сентября',
    theme: '1 сентября & Начало учебного года',
    prompt: 'September Back to School day. Crisp autumn morning, neat school attire, leather backpack, hardcover books, vibrant gladioli and asters floral bouquet, golden maple leaves on the path, proud and inspired atmosphere.',
    composition: 'Inspiring front-facing portrait with school accessories and colorful autumn flowers in hands.',
    mood: 'Proud, motivated, curious, festive new beginning.',
    season: 'autumn',
    icon: '🎒',
    colorTone: '#BA4A00',
    storyCaptionDefault: 'Новый рюкзак, букет цветов и важный шаг вперёд. Как быстро растут наши дети!',
    mockSceneUrl: imgSep,
  },
  {
    month: 10,
    name: 'Октябрь',
    nameGenitive: 'октября',
    theme: 'Золотая осень & Листопад',
    prompt: 'Peak golden autumn in October park. Golden amber and scarlet maple leaves blanketing the ground, throwing crisp dry leaves in the air with joyful laughter, warm knitted woolen sweaters and scarves, soft cinematic autumn light.',
    composition: 'Dynamic, candid autumn action in the park, golden leaves floating in the air around the family.',
    mood: 'Playful, vibrant, cozy, quintessential autumn nostalgia.',
    season: 'autumn',
    icon: '🍁',
    colorTone: '#D35400',
    storyCaptionDefault: 'Золотой октябрь. Шуршать листьями под ногами и радоваться простым чудесам.',
    mockSceneUrl: imgOct,
  },
  {
    month: 11,
    name: 'Ноябрь',
    nameGenitive: 'ноября',
    theme: 'Домашний уют & Семейный вечер',
    prompt: 'Warm November indoor family evening. Wrapped in soft chunky knitted blankets on a comfortable sofa, holding ceramic mugs with hot cocoa, reading a large illustrated storybook together, soft warm lamplight, first frost outside the window.',
    composition: 'Intimate, warm cuddle composition on the sofa or rug, surrounded by soft pillows and warm light.',
    mood: 'Deeply comforting, tranquil, loving, sheltered family sanctuary.',
    season: 'autumn',
    icon: '🧣',
    colorTone: '#5D6D7E',
    storyCaptionDefault: 'Ноябрьский уют за чашкой чая и чтением сказок, когда за окном кружится первый снег.',
    mockSceneUrl: imgNov,
  },
  {
    month: 12,
    name: 'Декабрь',
    nameGenitive: 'декабря',
    theme: 'Подготовка к Новому году',
    prompt: 'Magical December holiday preparations. Decorating the majestic Christmas tree together with vintage ornaments and glittering ribbons, stringing warm amber fairy lights, baking gingerbread cookies, joyful anticipation of the coming year.',
    composition: 'Collaborative festive scene, family members decorating tree branches and smiling at each other.',
    mood: 'Enchanting, expectant, harmonious, overflowing with holiday magic.',
    season: 'winter',
    icon: '✨',
    colorTone: '#196F3D',
    storyCaptionDefault: 'Ожидание чуда, запах мандаринов и самое дорогое богатство — большая дружная семья.',
    mockSceneUrl: imgDec,
  },
];

