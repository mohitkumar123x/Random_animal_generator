const fs = require('fs');
const https = require('https');
const path = require('path');

const animals = JSON.parse(fs.readFileSync(path.join(__dirname, '../../src/data/animals.json'), 'utf8'));
const transPath = path.join(__dirname, '../../src/i18n/data/animal-translations.json');
let translations = JSON.parse(fs.readFileSync(transPath, 'utf8'));

const targetLocales = process.argv[2] ? [process.argv[2]] : ['de', 'es', 'fr', 'pt', 'it', 'ja', 'ko', 'zh-CN', 'zh-TW', 'ar'];

const SEP = ' ||| ';

function requestTranslation(text, lang) {
  return new Promise((resolve) => {
    const q = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${q}`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 20000 }, (res) => {
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

function cleanAnimalName(translated, origEnglish) {
  if (!translated) return origEnglish;
  let clean = translated
    .replace(/^(Animal|Tier|Animale|動物|动物|동물|الحيوان|Animais|Animales)\s*[:：]\s*/i, '')
    .trim();
  return clean || origEnglish;
}

function isEnglishOrDummyDesc(desc, englishDesc, locale) {
  if (!desc) return true;
  const t = desc.trim();
  if (t === englishDesc.trim()) return true;
  if (t.includes('ist ein Tier.')) return true;
  if (t.includes('حيوان.')) return true;
  if (t.includes('是一種鳥類。')) return true;
  if (t.includes('The common crane')) return true;
  if (locale === 'de' && (t.includes('ist ein ') || t.includes('ist eine '))) {
    // If it ends with the english description
    const last30 = englishDesc.trim().slice(-30);
    if (t.includes(last30)) return true;
  }
  return false;
}

async function processLocale(locale) {
  console.log(`\n========================================`);
  console.log(`Processing locale: ${locale}`);
  console.log(`========================================`);

  if (!translations[locale]) translations[locale] = {};
  const locData = translations[locale];

  // 1. Animals needing name translation
  const needName = [];
  for (const a of animals) {
    const entry = locData[a.id];
    if (!entry || !entry.name || entry.name.trim() === a.name.trim()) {
      needName.push(a);
    }
  }
  console.log(`  Animals needing Name: ${needName.length}`);

  // 2. Animals needing description translation
  const needDesc = [];
  for (const a of animals) {
    const entry = locData[a.id];
    if (!entry || isEnglishOrDummyDesc(entry.description, a.description, locale)) {
      needDesc.push(a);
    }
  }
  console.log(`  Animals needing Description: ${needDesc.length}`);

  // 3. Animals needing funFact translation
  const needFact = [];
  for (const a of animals) {
    const entry = locData[a.id];
    if (!entry || !entry.funFact || entry.funFact.trim() === a.funFact.trim()) {
      needFact.push(a);
    }
  }
  console.log(`  Animals needing Fun Fact: ${needFact.length}`);

  // Translate names in batches with 'Animal: ' context to ensure zoological translation
  const BATCH_SIZE = 25;
  if (needName.length > 0) {
    console.log(`Translating names...`);
    for (let i = 0; i < needName.length; i += BATCH_SIZE) {
      const chunk = needName.slice(i, i + BATCH_SIZE);
      const queryTexts = chunk.map(a => `Animal: ${a.name}`);
      const translated = await translateBatch(queryTexts, locale);
      chunk.forEach((a, idx) => {
        if (!locData[a.id]) locData[a.id] = {};
        locData[a.id].name = cleanAnimalName(translated[idx], a.name);
      });
      process.stdout.write(`\r  Names: ${Math.min(i + BATCH_SIZE, needName.length)} / ${needName.length}`);
    }
    console.log('');
    fs.writeFileSync(transPath, JSON.stringify(translations, null, 2), 'utf8');
  }

  // Translate descriptions in batches
  if (needDesc.length > 0) {
    console.log(`Translating descriptions...`);
    for (let i = 0; i < needDesc.length; i += BATCH_SIZE) {
      const chunk = needDesc.slice(i, i + BATCH_SIZE);
      const queryTexts = chunk.map(a => a.description);
      const translated = await translateBatch(queryTexts, locale);
      chunk.forEach((a, idx) => {
        if (!locData[a.id]) locData[a.id] = {};
        locData[a.id].description = translated[idx] || a.description;
      });
      process.stdout.write(`\r  Descriptions: ${Math.min(i + BATCH_SIZE, needDesc.length)} / ${needDesc.length}`);
    }
    console.log('');
    fs.writeFileSync(transPath, JSON.stringify(translations, null, 2), 'utf8');
  }

  // Translate fun facts in batches
  if (needFact.length > 0) {
    console.log(`Translating fun facts...`);
    for (let i = 0; i < needFact.length; i += BATCH_SIZE) {
      const chunk = needFact.slice(i, i + BATCH_SIZE);
      const queryTexts = chunk.map(a => a.funFact);
      const translated = await translateBatch(queryTexts, locale);
      chunk.forEach((a, idx) => {
        if (!locData[a.id]) locData[a.id] = {};
        locData[a.id].funFact = translated[idx] || a.funFact;
      });
      process.stdout.write(`\r  Fun facts: ${Math.min(i + BATCH_SIZE, needFact.length)} / ${needFact.length}`);
    }
    console.log('');
    fs.writeFileSync(transPath, JSON.stringify(translations, null, 2), 'utf8');
  }

  console.log(`Locale ${locale} completed!`);
}

async function main() {
  for (const loc of targetLocales) {
    await processLocale(loc);
  }
  console.log(`\nAll animal translations completed successfully!`);
}

main().catch(console.error);
