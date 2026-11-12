import translations from '../i18n/data/translations.json';
import animalTranslations from '../i18n/data/animal-translations.json';

export type Locale = keyof typeof translations;

const locales: Locale[] = ['en', 'es', 'ja', 'fr', 'de', 'pt', 'ko', 'it', 'zh-CN', 'zh-TW', 'ar'];

const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸',
  ja: '🇯🇵',
  fr: '🇫🇷',
  de: '🇩🇪',
  pt: '🇧🇷',
  ko: '🇰🇷',
  it: '🇮🇹',
  'zh-CN': '🇨🇳',
  'zh-TW': '🇹🇼',
  ar: '🇸🇦',
};

const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
  ja: '日本語',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ko: '한국어',
  it: 'Italiano',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  ar: 'العربية',
};

export const brandNames: Record<Locale, string> = {
  en: 'Best Random Animal Generator',
  es: 'Generador de Animales Aleatorios',
  ja: 'ランダム動物生成器',
  fr: "Générateur d'Animaux Aléatoires",
  de: 'Zufälliger Tiergenerator',
  pt: 'Gerador de Animais Aleatórios',
  ko: '랜덤 동물 생성기',
  it: 'Generatore di Animali Casuali',
  'zh-CN': '随机动物生成器',
  'zh-TW': '隨機動物產生器',
  ar: 'مولّد حيوانات عشوائية',
};

export const defaultImageAlts: Record<Locale, string> = {
  en: "Random Animal Generator with pictures and fun facts – free online tool showing a random animal card with habitat, diet and conservation status",
  es: "Generador de Animales Aleatorios con imágenes y datos curiosos: herramienta online gratuita con fichas de hábitat, dieta y estado de conservación",
  ja: "写真と楽しい事実付きのランダム動物生成器 - 生息地、食性、保全状況を表示する無料オンラインツール",
  fr: "Générateur d'animaux aléatoires avec photos et anecdotes : outil en ligne gratuit présentant des fiches sur l'habitat, le régime et le statut de conservation",
  de: "Zufälliger Tiergenerator mit Bildern und Fun Facts – kostenloses Online-Tool mit Lebensraum, Ernährung und Schutzstatus",
  pt: "Gerador de Animais Aleatórios com fotos e curiosidades – ferramenta online grátis com habitat, dieta e estado de conservação",
  ko: "사진과 재미있는 사실이 있는 랜덤 동물 생성기 – 서식지, 식단, 보존 상태를 보여주는 무료 온라인 도구",
  it: "Generatore di Animali Casuali con immagini e curiosità: strumento online gratuito con habitat, dieta e stato di conservazione",
  'zh-CN': "带有图片和趣味知识的随机动物生成器 – 展示栖息地、食性和保护状态的免费在线工具",
  'zh-TW': "帶有圖片和趣味知識的隨機動物產生器 – 顯示棲息地、食性和保護狀態的免費線上工具",
  ar: "مولّد حيوانات عشوائية مع صور وحقائق ممتعة - أداة مجانية عبر الإنترنت تعرض الموطن والنظام الغذائي وحالة الحفظ",
};

export const spinnerImageAlts: Record<Locale, string> = {
  en: "Random Animal Generator Wheel – colorful spinner wheel that lands on a random animal with a picture, fun fact and conservation status",
  es: "Ruleta del Generador de Animales Aleatorios: rueda giratoria colorida para descubrir animales con foto, datos curiosos y estado de conservación",
  ja: "ランダム動物ルーレット - 写真、楽しい事実、保全状況付きの動物が当たるカラフルなスピンホイール",
  fr: "Roue du générateur d'animaux aléatoires : roue interactive colorée sélectionnant un animal avec photo, anecdotes et statut de conservation",
  de: "Glücksrad des Zufälligen Tiergenerators – buntes Drehrad für Tiere mit Foto, Fun Facts und Schutzstatus",
  pt: "Roleta do Gerador de Animais Aleatórios – roleta giratória colorida com fotos de animais, curiosidades e estado de conservação",
  ko: "랜덤 동물 회전판 – 사진, 재미있는 사실, 보존 상태가 있는 동물로 멈추는 다채로운 룰렛",
  it: "Ruota del Generatore di Animali Casuali: ruota girevole colorata per scoprire animali con foto, curiosità e stato di conservazione",
  'zh-CN': "随机动物转盘 – 带有动物图片、趣味知识和保护状态的彩色幸运转盘",
  'zh-TW': "隨機動物轉盤 – 帶有動物圖片、趣味知識與保護狀態的彩色幸運轉盤",
  ar: "عجلة مولّد الحيوانات العشوائية - عجلة دوارة ملونة لاختيار حيوان عشوائي مع صورة وحقائق وحالة الحفظ",
};

export const languages = localeNames;
export const defaultLang: Locale = 'en';
export const showDefaultLang = false;

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.en;
}

export function getLocaleFlags() {
  return localeFlags;
}

export function getLocaleNames() {
  return localeNames;
}

export function getLocales() {
  return locales;
}

export function getPathForLocale(path: string, locale: Locale) {
  if (locale === 'en') return path;
  return `/${locale}${path}`;
}

// --- Recipe helpers (https://docs.astro.build/en/recipes/i18n/) ---

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if ((lang as Locale) in translations) return lang as Locale;
  return defaultLang;
}

export function useTranslations(lang: Locale) {
  return function t(key: keyof (typeof translations)['en']) {
    const dict = (translations as any)[lang] as Record<string, string>;
    const fallback = (translations as any)[defaultLang] as Record<string, string>;
    return dict?.[key] ?? fallback?.[key] ?? (key as string);
  };
}

export function useTranslatedPath(lang: Locale) {
  return function translatePath(path: string, l: string = lang) {
    return !showDefaultLang && l === defaultLang ? path : `/${l}${path}`;
  };
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split('/');
  const path = parts.pop() || parts.pop();
  return path || undefined;
}

// --- Animal translation helpers with fallback ---

export function getAnimalTranslation(
  animal: { id: string; name: string; description: string; funFact: string },
  locale: Locale
) {
  const localeMap = (animalTranslations as any)[locale] as Record<string, any> | undefined;
  const entry = localeMap?.[animal.id];
  return {
    name: entry?.name ?? animal.name,
    description: entry?.description ?? animal.description,
    funFact: entry?.funFact ?? animal.funFact,
  };
}

export function getAnimalFunFact(animal: { id: string; funFact: string }, locale: Locale) {
  const localeMap = (animalTranslations as any)[locale] as Record<string, any> | undefined;
  return localeMap?.[animal.id]?.funFact ?? animal.funFact;
}
