const fs = require('fs');
const https = require('https');
const path = require('path');

const valuesPath = path.join(__dirname, '../../src/i18n/data/values.json');
const values = JSON.parse(fs.readFileSync(valuesPath, 'utf8'));

const animals = JSON.parse(fs.readFileSync(path.join(__dirname, '../../src/data/animals.json'), 'utf8'));

const uniqueHabitats = [...new Set(animals.map(a => a.habitat).filter(Boolean))];
const uniqueRegions = [...new Set(animals.map(a => a.region).filter(Boolean))];

const locales = ['ko', 'ja', 'zh-CN', 'zh-TW', 'es', 'fr', 'de', 'it', 'pt', 'ar'];

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

  // Fallback: divide & conquer
  const mid = Math.floor(texts.length / 2);
  const left = await translateBatch(texts.slice(0, mid), lang);
  const right = await translateBatch(texts.slice(mid), lang);
  return [...left, ...right];
}

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function processValues() {
  if (!values.habitat) values.habitat = {};
  if (!values.region) values.region = {};

  // Habitats
  console.log(`Processing Habitats (${uniqueHabitats.length})...`);
  for (const locale of locales) {
    if (!values.habitat[locale]) values.habitat[locale] = {};
    const map = values.habitat[locale];
    
    // Find missing or untranslated (where translated === english)
    const missing = uniqueHabitats.filter(h => !map[h] || map[h] === h);
    console.log(`  [habitat:${locale}] needing translation: ${missing.length}`);
    
    const BATCH = 20;
    for (let i = 0; i < missing.length; i += BATCH) {
      const chunk = missing.slice(i, i + BATCH);
      const translated = await translateBatch(chunk, locale);
      chunk.forEach((item, idx) => {
        map[item] = translated[idx] || item;
      });
      process.stdout.write(`\r    Done ${Math.min(i + BATCH, missing.length)} / ${missing.length}`);
      await sleep(100);
    }
    if (missing.length > 0) console.log('');
  }

  // Regions
  console.log(`\nProcessing Regions (${uniqueRegions.length})...`);
  for (const locale of locales) {
    if (!values.region[locale]) values.region[locale] = {};
    const map = values.region[locale];
    
    const missing = uniqueRegions.filter(r => !map[r] || map[r] === r);
    console.log(`  [region:${locale}] needing translation: ${missing.length}`);
    
    const BATCH = 20;
    for (let i = 0; i < missing.length; i += BATCH) {
      const chunk = missing.slice(i, i + BATCH);
      const translated = await translateBatch(chunk, locale);
      chunk.forEach((item, idx) => {
        map[item] = translated[idx] || item;
      });
      process.stdout.write(`\r    Done ${Math.min(i + BATCH, missing.length)} / ${missing.length}`);
      await sleep(100);
    }
    if (missing.length > 0) console.log('');
  }

  fs.writeFileSync(valuesPath, JSON.stringify(values, null, 2), 'utf8');
  console.log('\nvalues.json successfully updated!');
}

processValues().catch(console.error);
