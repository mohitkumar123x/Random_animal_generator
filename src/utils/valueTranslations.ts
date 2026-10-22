import valuesData from '../i18n/data/values.json';

const allValues: Record<string, Record<string, Record<string, string>>> = valuesData as any;

export function translateValue(value: string, field: 'habitat' | 'diet' | 'region' | 'lifespan', locale: string): string {
  if (locale === 'en' || !value) return value;

  const fieldMap = allValues[field];
  if (!fieldMap) return value;

  const localeMap = fieldMap[locale];
  if (!localeMap) return value;

  return localeMap[value] || value;
}

