const fs = require('fs');

const SKIP_FIELDS = new Set(['color', 'code', 'key', 'anchor', 'emoji', 'year', 'value', 'name', 'measurement']);
const SEP = '|ZQX9ZQX9|';
const BATCH_SIZE = 80;

const content = JSON.parse(fs.readFileSync('src/data/blog-content.json', 'utf8'));
const en = content.en;
const locales = ['pt', 'it', 'ja', 'zh-CN', 'zh-TW', 'ar'];

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

const flattened = flatten(en);
const totalLength = flattened.map(f => f.text).join(SEP).length;
console.log('Total strings:', flattened.length);
console.log('Total text length:', totalLength);
console.log('Batch size:', BATCH_SIZE);
console.log('Number of batches:', Math.ceil(flattened.length / BATCH_SIZE));

let batchNum = 0;
const urls = [];
for (const locale of locales) {
  for (let i = 0; i < flattened.length; i += BATCH_SIZE) {
    const batch = flattened.slice(i, i + BATCH_SIZE);
    const texts = batch.map(item => item.text);
    const combined = texts.join(SEP);
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=' + locale + '&dt=t&q=' + encodeURIComponent(combined);
    urls.push({ locale, batchStart: i, batchSize: batch.length, url, texts });
    batchNum++;
  }
}

// Save URL info to file for later processing
const urlsToSave = urls.map(u => ({ locale: u.locale, start: u.batchStart, count: u.batchSize, url: u.url }));
fs.writeFileSync('translate-urls.json', JSON.stringify(urlsToSave, null, 2), 'utf8');
fs.writeFileSync('translate-inputs.json', JSON.stringify(flattened.map(f => ({ path: f.path, text: f.text })), null, 2), 'utf8');
console.log('Generated ' + urls.length + ' URLs');
console.log('Saved to translate-urls.json and translate-inputs.json');

// Print URLs for manual fetching
console.log('\n=== URLs to fetch with webfetch ===');
for (const u of urls) {
  console.log('[' + u.locale + ' batch ' + u.batchStart + '-' + (u.batchStart + u.batchSize) + '] chars=' + u.texts.join(SEP).length);
}
