const fs = require('fs');
const https = require('https');
const path = require('path');

const transPath = path.join(__dirname, '../../src/i18n/data/animal-translations.json');
let translations = JSON.parse(fs.readFileSync(transPath, 'utf8'));

const animals = JSON.parse(fs.readFileSync(path.join(__dirname, '../../src/data/animals.json'), 'utf8'));

const targetLocales = process.argv[2] ? [process.argv[2]] : ['ko', 'ja', 'fr', 'es', 'de', 'pt', 'it', 'zh-CN', 'zh-TW', 'ar'];

const SEP = ' ||| ';

function requestGoogle(text, lang) {
  return new Promise((resolve) => {
    const q = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=dict-chrome-ex&sl=en&tl=${lang}&dt=t&q=${q}`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }, timeout: 15000 }, (res) => {
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
    const s = await requestGoogle(texts[0], lang);
    return [s ? s.trim() : texts[0]];
  }

  const combined = texts.join(SEP);
  const result = await requestGoogle(combined, lang);
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

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function processLocale(locale) {
  console.log(`\n========================================`);
  console.log(`Processing locale: ${locale}`);
  console.log(`========================================`);

  if (!translations[locale]) translations[locale] = {};
  const locData = translations[locale];

  // 1. Names needing translation
  const needName = animals.filter(a => {
    const entry = locData[a.id];
    return !entry || !entry.name || entry.name.trim() === a.name.trim();
  });
  console.log(`  Animals needing Name: ${needName.length}`);

  // 2. Descriptions needing translation
  const needDesc = animals.filter(a => {
    const entry = locData[a.id];
    return !entry || !entry.description || entry.description.trim() === a.description.trim();
  });
  console.log(`  Animals needing Description: ${needDesc.length}`);

  // 3. Fun facts needing translation
  const needFact = animals.filter(a => {
    const entry = locData[a.id];
    return !entry || !entry.funFact || entry.funFact.trim() === a.funFact.trim();
  });
  console.log(`  Animals needing Fun Fact: ${needFact.length}`);

  const BATCH_SIZE = 20;

  // Translate Names with 'Animal: ' context for accurate zoological names
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
      await sleep(100);
    }
    console.log('');
    fs.writeFileSync(transPath, JSON.stringify(translations, null, 2), 'utf8');
  }

  // Translate Descriptions
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
      await sleep(100);
    }
    console.log('');
    fs.writeFileSync(transPath, JSON.stringify(translations, null, 2), 'utf8');
  }

  // Translate Fun facts
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
      await sleep(100);
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
