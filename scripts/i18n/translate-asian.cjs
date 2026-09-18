const fs = require('fs');
const https = require('https');

const SKIP_FIELDS = new Set(['color', 'code', 'key', 'anchor', 'emoji', 'year', 'value', 'name', 'measurement']);
const SEPARATOR = '|||SEP|||';
const BATCH_SIZE = 5;

const dataFile = 'src/data/blog-content.json';
const content = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
const en = content.en;

const missingLocales = ['ko', 'ja', 'zh-CN', 'zh-TW', 'ar'];

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

function translateText(text, targetLang) {
  return new Promise((resolve) => {
    const encoded = encodeURIComponent(text);
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + targetLang + '&dt=t&q=' + encoded;

    const req = https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const translated = parsed[0].map((item) => item[0]).join('');
          resolve(translated || text);
        } catch (e) {
          resolve(text);
        }
      });
    });

    req.on('error', () => resolve(text));
    req.setTimeout(15000, () => {
      req.destroy();
      resolve(text);
    });
  });
}

async function translateLocale(locale) {
  console.log('Translating to ' + locale + '...');
  const translated = JSON.parse(JSON.stringify(en));
  const flattened = flatten(en);

  for (let i = 0; i < flattened.length; i++) {
    const text = flattened[i].text;
    const translatedText = await translateText(text, locale);
    setValue(translated, flattened[i].path, translatedText);
    await new Promise((r) => setTimeout(r, 150));
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
