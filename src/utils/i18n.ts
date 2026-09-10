import translations from '../data/translations.json';

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
