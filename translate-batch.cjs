const fs = require('fs');
const https = require('https');

const SKIP_FIELDS = new Set(['color', 'code', 'key', 'anchor', 'emoji', 'year', 'value', 'name', 'measurement']);
const SEPARATOR = '|ZQX9ZQX9|';
const BATCH_SIZE = 10;

const dataFile = 'src/data/blog-content.json';
const content = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const en = content.en;

const missingLocales = ['pt', 'it', 'ja', 'zh-CN', 'zh-TW', 'ar'];

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
    const combined = texts.join(SEPARATOR);
    const encoded = encodeURIComponent(combined);
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + targetLang + '&dt=t&q=' + encoded;

    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const translated = parsed[0].map((item) => item[0]).join('');
          const parts = translated.split(SEPARATOR).map((s) => s.trim());
          if (parts.length === texts.length) {
            resolve(parts);
          } else {
            console.warn('  Batch size mismatch for ' + targetLang + ': expected ' + texts.length + ', got ' + parts.length);
            resolve(texts);
          }
        } catch (e) {
          console.error('  Parse error for ' + targetLang + ': ' + e.message);
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
  console.log('  ' + flattened.length + ' strings to translate');

  for (let i = 0; i < flattened.length; i += BATCH_SIZE) {
    const batch = flattened.slice(i, i + BATCH_SIZE);
    const texts = batch.map((item) => item.text);
    const translatedTexts = await translateBatch(texts, locale);

    for (let j = 0; j < batch.length; j++) {
      setValue(translated, batch[j].path, translatedTexts[j]);
    }

    if ((i / BATCH_SIZE + 1) % 5 === 0) {
      console.log('  ' + locale + ': ' + (i + BATCH_SIZE) + '/' + flattened.length + ' done');
    }

    await new Promise((r) => setTimeout(r, 300));
  }

  content[locale] = translated;
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
