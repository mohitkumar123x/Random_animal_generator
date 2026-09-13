import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const fs = require('fs');
const animals = require('./src/data/animals.json');
const translations = require('./src/data/animal-translations.json');
const koOverride = require('./ko-funfact-overrides.json');
const ptOverride = require('./pt-funfact-overrides.json');
const itOverride = require('./it-funfact-overrides.json');

function generateLocale(locale, override) {
  const locData = translations[locale] || {};
  const result = {};
  let count = 0;
  for (const a of animals) {
    if (override[a.id]) {
      result[a.id] = override[a.id];
      count++;
    } else if (locData[a.id] && locData[a.id].funFact !== a.funFact) {
      result[a.id] = locData[a.id].funFact;
    } else {
      result[a.id] = a.funFact;
    }
  }
  const path = `./src/data/${locale}-funfacts.json`;
  fs.writeFileSync(path, JSON.stringify(result, null, 2) + '\n');
  console.log(`${locale}: ${Object.keys(result).length} entries (${count} newly translated)`);
}

generateLocale('ko', koOverride);
generateLocale('pt', ptOverride);
generateLocale('it', itOverride);
console.log('Done!');
