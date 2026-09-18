const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
let rawT = fs.readFileSync(path.join(dataDir, 'animal-translations.json'), 'utf8');
if (rawT.charCodeAt(0) === 0xFEFF) rawT = rawT.slice(1);
const animalT = JSON.parse(rawT);
let rawA = fs.readFileSync(path.join(dataDir, 'animals.json'), 'utf8');
if (rawA.charCodeAt(0) === 0xFEFF) rawA = rawA.slice(1);
const animals = JSON.parse(rawA);
const animalsMap = {};
animals.forEach(a => animalsMap[a.id] = a);

const files = {
  'fr': 'fr-funfacts.json',
  'ja': 'ja-funfacts.json',
  'ko': 'ko-funfacts.json',
  'pt': 'pt-funfacts.json',
  'it': 'it-funfacts.json',
  'zh-CN': 'zh-CN-funfacts.json',
  'zh-TW': 'zh-TW-funfacts.json',
  'ar': 'ar-funfacts.json'
};

for (const [locale, fileName] of Object.entries(files)) {
  const file = path.join(dataDir, fileName);
  if (!fs.existsSync(file)) { console.log(`${locale}: no file`); continue; }
  let raw = fs.readFileSync(file, 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1);
  const data = JSON.parse(raw);
  if (!animalT[locale]) animalT[locale] = {};
  let updated = 0;
  for (const [id, funFact] of Object.entries(data)) {
    if (!animalT[locale][id]) animalT[locale][id] = {};
    const orig = animalsMap[id];
    // Only update if the current funFact is English (same as original) or missing
    const current = animalT[locale][id].funFact;
    if (!current || (orig && current === orig.funFact)) {
      animalT[locale][id].funFact = funFact;
      updated++;
    }
  }
  console.log(`${locale}: updated ${updated} funFact translations`);
}

fs.writeFileSync(path.join(dataDir, 'animal-translations.json'), JSON.stringify(animalT, null, 2), 'utf8');
console.log('Done!');
