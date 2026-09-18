const fs = require('fs');
const https = require('https');

const SKIP_FIELDS = new Set(['color', 'code', 'key', 'anchor', 'emoji', 'year', 'value', 'name', 'measurement']);
const SEP = '\u0001';
const BATCH_SIZE = 40;
const DELAY = 5000;

const dataFile = 'src/data/blog-content.json';
const content = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const en = content.en;

const missingLocales = ['pt', 'it', 'ja', 'zh-CN', 'zh-TW', 'ar'];

function flatten(obj, path = []) {
  if (obj === null || typeof obj !== 'object') return [];
  let result = [];
  for (const [k, v] of Object.entries(obj)) {
    if (SKIP_FIELDS.has(k)) continue;
    const np = [...path, k];
    if (typeof v === 'string') result.push({ path: np, text: v });
    else if (Array.isArray(v)) for (let i = 0; i < v.length; i++) result = result.concat(flatten(v[i], [...np, i]));
    else if (typeof v === 'object') result = result.concat(flatten(v, np));
  }
  return result;
}

function setValue(obj, path, value) {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) current = current[path[i]];
  current[path[path.length - 1]] = value;
}

function translateBatch(texts, targetLang) {
  return new Promise((resolve) => {
    const combined = texts.join(SEP);
    const encoded = encodeURIComponent(combined);
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + targetLang + '&dt=t&q=' + encoded;

    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 30000
    };

    let retries = 5;

    function attempt() {
      const req = https.get(url, options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          if (res.statusCode === 429 && retries > 0) {
            retries--;
            setTimeout(attempt, 10000);
            return;
          }
          try {
            const parsed = JSON.parse(data);
            const translated = parsed[0].map((item) => item[0]).join('');
            const parts = translated.split(SEP);
            if (parts.length === texts.length) {
              resolve(parts.map((p) => p.trim()));
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        });
      });

      req.on('error', () => {
        if (retries > 0) { retries--; setTimeout(attempt, 5000); }
        else resolve(null);
      });
    }
    attempt();
  });
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function translateLocale(locale) {
  console.log('Translating to ' + locale + '...');
  const translated = JSON.parse(JSON.stringify(en));
  const flattened = flatten(en);
  console.log('  ' + flattened.length + ' strings to translate');

  for (let i = 0; i < flattened.length; i += BATCH_SIZE) {
    const batch = flattened.slice(i, i + BATCH_SIZE);
    const texts = batch.map((item) => item.text);

    let translatedTexts = await translateBatch(texts, locale);

    if (translatedTexts === null) {
      console.log('  Batch failed at offset ' + i + ', trying individual translations');
      translatedTexts = [];
      for (const text of texts) {
        let result = null;
        for (let retry = 0; retry < 3; retry++) {
          result = await translateBatch([text], locale);
          if (result && result.length === 1) break;
          await delay(2000);
        }
        translatedTexts.push(result && result.length === 1 ? result[0] : text);
        await delay(1000);
      }
    }

    for (let j = 0; j < batch.length; j++) {
      setValue(translated, batch[j].path, translatedTexts[j]);
    }

    console.log('  ' + locale + ': ' + Math.min(i + BATCH_SIZE, flattened.length) + '/' + flattened.length + ' done');
    await delay(DELAY);
  }

  content[locale] = translated;
  fs.writeFileSync(dataFile, JSON.stringify(content, null, 2), 'utf8');
  console.log('  ' + locale + ' done, saved.');
}

async function main() {
  for (const locale of missingLocales) {
    await translateLocale(locale);
  }
  console.log('All done! Locales:', Object.keys(content));
}

main().catch(console.error);
