// i18n helpers — following https://docs.astro.build/en/recipes/i18n/
import { ui, defaultLang, showDefaultLang, routes } from './ui';
import type { Locale } from './ui';
import animalTranslations from '../data/animal-translations.json';

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Locale;
  return defaultLang as Locale;
}

export function useTranslations(lang: Locale) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    const dict = ui[lang] as Record<string, string>;
    const fallback = ui[defaultLang] as Record<string, string>;
    return dict[key] ?? fallback[key] ?? (key as string);
  };
}

export function useTranslatedPath(lang: Locale) {
  return function translatePath(path: string, l: string = lang) {
    const pathName = path.replaceAll('/', '');
    const routeMap: Record<string, string> | undefined =
      l !== defaultLang && l in routes ? (routes as any)[l] : undefined;
    const translatedPath = routeMap?.[pathName] ? '/' + routeMap[pathName] : path;
    return !showDefaultLang && l === defaultLang ? translatedPath : `/${l}${translatedPath}`;
  };
}

export function getRouteFromUrl(url: URL): string | undefined {
  const pathname = new URL(url).pathname;
  const parts = pathname?.split('/');
  const path = parts.pop() || parts.pop();
  if (path === undefined) return undefined;
  const currentLang = getLangFromUrl(url);
  if (defaultLang === currentLang) {
    const route = Object.values(routes)[0] as Record<string, string> | undefined;
    return route?.[path];
  }
  const getKeyByValue = (obj: Record<string, string>, value: string): string | undefined => {
    return Object.keys(obj).find((key) => obj[key] === value);
  };
  const reversedKey = getKeyByValue((routes as any)[currentLang] ?? {}, path);
  if (reversedKey !== undefined) return reversedKey;
  return undefined;
}

// ---- Animal-specific i18n helpers (extension for this project) ----

export type AnimalTranslation = {
  name: string;
  description: string;
  funFact: string;
};

/**
 * Get translated animal fields with fallback to original English data.
 * Mirrors the recipe's fallback pattern: try locale dict, else defaultLang.
 */
export function getAnimalTranslation(
  animal: { id: string; name: string; description: string; funFact: string },
  locale: Locale
): AnimalTranslation {
  const localeMap = (animalTranslations as any)[locale] as Record<string, any> | undefined;
  const entry = localeMap?.[animal.id];
  return {
    name: entry?.name ?? animal.name,
    description: entry?.description ?? animal.description,
    funFact: entry?.funFact ?? animal.funFact,
  };
}

export function getAnimalName(
  animal: { id: string; name: string },
  locale: Locale
): string {
  const localeMap = (animalTranslations as any)[locale] as Record<string, any> | undefined;
  return localeMap?.[animal.id]?.name ?? animal.name;
}

export function getAnimalDescription(
  animal: { id: string; description: string },
  locale: Locale
): string {
  const localeMap = (animalTranslations as any)[locale] as Record<string, any> | undefined;
  return localeMap?.[animal.id]?.description ?? animal.description;
}

export function getAnimalFunFact(
  animal: { id: string; funFact: string },
  locale: Locale
): string {
  const localeMap = (animalTranslations as any)[locale] as Record<string, any> | undefined;
  return localeMap?.[animal.id]?.funFact ?? animal.funFact;
}
