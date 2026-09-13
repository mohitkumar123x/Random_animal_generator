const fs = require('fs');
const animals = require('./src/data/animals.json');
const translations = require('./src/data/animal-translations.json');

function getUntranslated(locale) {
  const locData = translations[locale] || {};
  const result = {};
  for (const a of animals) {
    if (!locData[a.id] || locData[a.id].funFact === a.funFact) {
      result[a.id] = a.funFact;
    }
  }
  return result;
}

const koUn = getUntranslated('ko');
const ptUn = getUntranslated('pt');
const itUn = getUntranslated('it');

console.log('ko untranslated:', Object.keys(koUn).length);
console.log('pt untranslated:', Object.keys(ptUn).length);
console.log('it untranslated:', Object.keys(itUn).length);

fs.writeFileSync('./ko-untranslated.json', JSON.stringify(koUn, null, 2));
fs.writeFileSync('./pt-untranslated.json', JSON.stringify(ptUn, null, 2));
fs.writeFileSync('./it-untranslated.json', JSON.stringify(itUn, null, 2));
console.log('Wrote untranslated files');
