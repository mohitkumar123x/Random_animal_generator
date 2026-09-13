import translations from '../data/translations.json';
import animalTranslations from '../data/animal-translations.json';

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
