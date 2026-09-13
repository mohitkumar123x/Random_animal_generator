// i18n UI dictionary — following https://docs.astro.build/en/recipes/i18n/
// Central source for languages, default lang, and UI strings
import translations from '../data/translations.json';

export const languages = {
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
} as const;

export const defaultLang = 'en' as const;
export const showDefaultLang = false;

export type Locale = keyof typeof languages;

// Re-export raw UI translations (same shape as translations.json)
// `ui` is the dictionary used by useTranslations helper per recipe
export const ui = translations as Record<Locale, Record<string, string>>;

// Route translations (optional) — translate URL segments per locale
// Example: { de: { about: "uber-uns" }, fr: { about: "a-propos" } }
export const routes: Record<string, Record<string, string>> = {
  de: {},
  fr: {},
  es: {},
  ja: {},
  pt: {},
  ko: {},
  it: {},
  'zh-CN': {},
  'zh-TW': {},
  ar: {},
};

export const localeFlags: Record<Locale, string> = {
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
