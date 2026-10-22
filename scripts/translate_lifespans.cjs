const fs = require('fs');
const https = require('https');
const path = require('path');

const root = path.join(__dirname, '..');
const animals = JSON.parse(fs.readFileSync(path.join(root, 'src/data/animals.json'), 'utf8'));
const valuesPath = path.join(root, 'src/i18n/data/values.json');
const values = JSON.parse(fs.readFileSync(valuesPath, 'utf8'));

if (!values.lifespan) values.lifespan = {};

const uniqueLifespans = [...new Set(animals.map(a => a.lifespan).filter(Boolean))];
console.log(`Total unique lifespans: ${uniqueLifespans.length}`);

const locales = ['es', 'ja', 'fr', 'de', 'pt', 'ko', 'it', 'zh-CN', 'zh-TW', 'ar'];

function requestTranslation(text, lang) {
  return new Promise((resolve) => {
    const q = encodeURIComponent(text);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${lang}&dt=t&q=${q}`;
    const req = https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, timeout: 10000 }, (res) => {
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

const SEP = ' ||| ';

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

async function main() {
  values.lifespan.en = Object.fromEntries(uniqueLifespans.map(l => [l, l]));

  for (const loc of locales) {
    if (!values.lifespan[loc]) values.lifespan[loc] = {};
    const missing = uniqueLifespans.filter(l => !values.lifespan[loc][l]);
    console.log(`[${loc}] missing lifespans: ${missing.length}`);
    if (missing.length === 0) continue;

    const BATCH_SIZE = 25;
    for (let i = 0; i < missing.length; i += BATCH_SIZE) {
      const batch = missing.slice(i, i + BATCH_SIZE);
      const translated = await translateBatch(batch, loc);
      batch.forEach((text, idx) => {
        values.lifespan[loc][text] = translated[idx] || text;
      });
      console.log(`  [${loc}] translated ${Math.min(i + BATCH_SIZE, missing.length)} / ${missing.length}`);
      await new Promise(r => setTimeout(r, 200));
    }
    fs.writeFileSync(valuesPath, JSON.stringify(values, null, 2), 'utf8');
  }

  fs.writeFileSync(valuesPath, JSON.stringify(values, null, 2), 'utf8');
  console.log('All lifespans translated and saved to values.json!');
}

main().catch(console.error);
