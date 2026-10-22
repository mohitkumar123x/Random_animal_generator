const fs = require('fs');
const https = require('https');
const path = require('path');

const animals = JSON.parse(fs.readFileSync(path.join(__dirname, '../../src/data/animals.json'), 'utf8'));

const uniqueHabitats = [...new Set(animals.map(a => a.habitat).filter(Boolean))];
const uniqueRegions = [...new Set(animals.map(a => a.region).filter(Boolean))];
const uniqueDiets = [...new Set(animals.map(a => a.diet).filter(Boolean))];

console.log(`Unique habitats: ${uniqueHabitats.length}`);
console.log(`Unique regions: ${uniqueRegions.length}`);
console.log(`Unique diets: ${uniqueDiets.length}`);

const locales = ['es', 'ja', 'fr', 'de', 'pt', 'ko', 'it', 'zh-CN', 'zh-TW', 'ar'];

const valuesPath = path.join(__dirname, '../../src/i18n/data/values.json');
let valuesData = {};
if (fs.existsSync(valuesPath)) {
  try {
    valuesData = JSON.parse(fs.readFileSync(valuesPath, 'utf8'));
  } catch (e) {}
}

if (!valuesData.diet) valuesData.diet = {};
if (!valuesData.habitat) valuesData.habitat = {};
if (!valuesData.region) valuesData.region = {};

// Diets are small and fixed
const dietTranslations = {
  en: { Carnivore: 'Carnivore', Herbivore: 'Herbivore', Omnivore: 'Omnivore', Insectivore: 'Insectivore', Detritivore: 'Detritivore', 'Filter feeder': 'Filter feeder' },
  fr: { Carnivore: 'Carnivore', Herbivore: 'Herbivore', Omnivore: 'Omnivore', Insectivore: 'Insectivore', Detritivore: 'Détritivore', 'Filter feeder': 'Filtreur' },
  es: { Carnivore: 'Carnívoro', Herbivore: 'Herbívoro', Omnivore: 'Omnívoro', Insectivore: 'Insectívoro', Detritivore: 'Detritívoro', 'Filter feeder': 'Filtrador' },
  ja: { Carnivore: '肉食', Herbivore: '草食', Omnivore: '雑食', Insectivore: '虫食', Detritivore: '腐食', 'Filter feeder': '濾過摂食' },
  de: { Carnivore: 'Fleischfresser', Herbivore: 'Pflanzenfresser', Omnivore: 'Allesfresser', Insectivore: 'Insektenfresser', Detritivore: 'Detritivorer', 'Filter feeder': 'Filterfresser' },
  pt: { Carnivore: 'Carnívoro', Herbivore: 'Herbívoro', Omnivore: 'Omnívoro', Insectivore: 'Insetívoro', Detritivore: 'Detritívoro', 'Filter feeder': 'Filtrador' },
  ko: { Carnivore: '육식', Herbivore: '초식', Omnivore: '잡식', Insectivore: '곤충식', Detritivore: '부식', 'Filter feeder': '여과섭식' },
  it: { Carnivore: 'Carnivoro', Herbivore: 'Erbivoro', Omnivore: 'Onnivoro', Insectivore: 'Insettivoro', Detritivore: 'Detritivoro', 'Filter feeder': 'Filtratore' },
  'zh-CN': { Carnivore: '肉食', Herbivore: '草食', Omnivore: '杂食', Insectivore: '食虫', Detritivore: '食碎屑', 'Filter feeder': '滤食' },
  'zh-TW': { Carnivore: '肉食', Herbivore: '草食', Omnivore: '雜食', Insectivore: '食蟲', Detritivore: '食碎屑', 'Filter feeder': '濾食' },
  ar: { Carnivore: 'آكل اللحوم', Herbivore: 'آكل الأعشاب', Omnivore: 'آكل كل شيء', Insectivore: 'آكل الحشرات', Detritivore: 'آكل التحلل', 'Filter feeder': 'المصفية' },
};
valuesData.diet = dietTranslations;

const SEP = ' ||| ';

function requestTranslation(text, lang) {
  return new Promise((resolve) => {
    const q = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${q}`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const full = parsed[0].map(x => x[0]).join('');
          resolve(full);
        } catch (e) {
          resolve(null);
        }
      });
    });
    req.on('error', () => resolve(null));
    req.on('timeout', () => { req.destroy(); resolve(null); });
  });
}

async function translateBatch(texts, lang) {
  if (texts.length === 0) return [];
  if (texts.length === 1) {
    const single = await requestTranslation(texts[0], lang);
    return single ? [single.trim()] : [texts[0]];
  }

  const combined = texts.join(SEP);
  const result = await requestTranslation(combined, lang);
  if (result) {
    const parts = result.split('|||').map(s => s.trim());
    if (parts.length === texts.length) {
      return parts;
    }
  }

  // Fallback: split in halves
  const mid = Math.floor(texts.length / 2);
  const left = await translateBatch(texts.slice(0, mid), lang);
  const right = await translateBatch(texts.slice(mid), lang);
  return [...left, ...right];
}

async function processField(fieldName, items) {
  console.log(`Processing field: ${fieldName} (${items.length} items)`);
  for (const locale of locales) {
    if (!valuesData[fieldName][locale]) valuesData[fieldName][locale] = {};
    const missing = items.filter(item => !valuesData[fieldName][locale][item]);
    console.log(`  Locale ${locale}: ${missing.length} missing of ${items.length}`);
    if (missing.length === 0) continue;

    const BATCH_SIZE = 25;
    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      const chunk = missing.slice(i, i + BATCH_SIZE);
      const translated = await translateBatch(chunk, locale);
      chunk.forEach((orig, idx) => {
        valuesData[fieldName][locale][orig] = translated[idx] || orig;
      });
      process.stdout.write(`\r  ${locale} [${fieldName}]: ${Math.min(i + BATCH_SIZE, missing.length)} / ${missing.length}`);
    }
    console.log('');
    // Save progress after each locale
    fs.writeFileSync(valuesPath, JSON.stringify(valuesData, null, 2), 'utf8');
  }
}

async function run() {
  await processField('habitat', uniqueHabitats);
  await processField('region', uniqueRegions);
  console.log('Values translation completed successfully!');
}

run().catch(console.error);
