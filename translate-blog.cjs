const fs = require('fs');
const https = require('https');

const SKIP_FIELDS = new Set(['color', 'code', 'key', 'anchor', 'emoji', 'year', 'value', 'name', 'measurement']);
const SEPARATOR = '|||SEP|||';
const BATCH_SIZE = 8;

const dataFile = 'src/data/blog-content.json';
const content = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const en = content.en;

const allLocales = ['es', 'fr', 'de', 'pt', 'ko', 'it', 'zh-CN', 'zh-TW', 'ar', 'ja'];
const missingLocales = allLocales.filter(l => !content[l]);
const existingLocales = allLocales.filter(l => content[l]);
console.log('Already done:', existingLocales);
console.log('Need to do:', missingLocales);

function flatten(obj, path = []) {
  if (obj === null || obj === undefined || typeof obj !== 'object') return [];
  let result = [];
  for (const [key, value] of Object.entries(obj)) {
    if (SKIP_FIELDS.has(key)) continue;
    const newPath = [...path, key];
    if (typeof value === 'string') {
      result.push({ path: newPath, text: value });
    } else if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        result = result.concat(flatten(value[i], [...newPath, i]));
      }
    } else if (typeof value === 'object') {
      result = result.concat(flatten(value, newPath));
    }
  }
  return result;
}

function setValue(obj, path, value) {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;
}

function translateBatch(texts, targetLang) {
  return new Promise((resolve) => {
    const combined = texts.join('\n' + SEPARATOR + '\n');
    const encoded = encodeURIComponent(combined);
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + targetLang + '&dt=t&q=' + encoded;

    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const translated = parsed[0].map((item) => item[0]).join('');
          const parts = translated.split('\n' + SEPARATOR + '\n').map((s) => s.trim());
          if (parts.length === texts.length) {
            resolve(parts);
          } else {
            resolve(texts);
          }
        } catch (e) {
          console.error('Parse error for', targetLang, e.message);
          resolve(texts);
        }
      });
    });

    req.on('error', () => resolve(texts));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve(texts);
    });
  });
}

async function translateLocale(locale) {
  console.log('Translating to ' + locale + '...');
  const translated = JSON.parse(JSON.stringify(en));
  const flattened = flatten(en);

  for (let i = 0; i < flattened.length; i += BATCH_SIZE) {
    const batch = flattened.slice(i, i + BATCH_SIZE);
    const texts = batch.map((item) => item.text);
    const translatedTexts = await translateBatch(texts, locale);

    for (let j = 0; j < batch.length; j++) {
      setValue(translated, batch[j].path, translatedTexts[j]);
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  content[locale] = translated;
  // Save after each locale
  fs.writeFileSync(dataFile, JSON.stringify(content, null, 2), 'utf8');
  console.log('  ' + locale + ' done, saved. Total locales: ' + Object.keys(content).length);
}

async function main() {
  for (const locale of missingLocales) {
    await translateLocale(locale);
  }
  console.log('All done! Locales:', Object.keys(content));
}

main().catch(console.error);
