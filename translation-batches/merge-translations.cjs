const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'src', 'data');

// Load zh-TW translations
const zhTWTranslations = require('./zhtw-translations.cjs');

// Load existing zh-TW funfacts
const zhTWPath = path.join(dataDir, 'zh-TW-funfacts.json');
const zhTWData = JSON.parse(fs.readFileSync(zhTWPath, 'utf-8'));

// Apply translations
let updated = 0;
let notFound = 0;
for (const [id, text] of Object.entries(zhTWTranslations)) {
  if (zhTWData.hasOwnProperty(id)) {
    zhTWData[id] = text;
    updated++;
  } else {
    console.log(`ID not found in zh-TW: ${id}`);
    notFound++;
  }
}

// Write updated file
fs.writeFileSync(zhTWPath, JSON.stringify(zhTWData, null, 2), 'utf-8');
console.log(`zh-TW: Updated ${updated} entries, ${notFound} not found`);

// Verify no English remains
const isEnglish = (text) => {
  if (!text || typeof text !== 'string') return false;
  const cjkRegex = /[\u4e00-\u9fff\u3400-\u4dbf\u3000-\u303f\uff00-\uffef\u0600-\u06ff\u0590-\u05ff]/;
  if (cjkRegex.test(text)) return false;
  const asciiCount = (text.match(/[\x00-\x7F]/g) || []).length;
  return (asciiCount / text.length) > 0.8;
};

let englishCount = 0;
for (const [id, text] of Object.entries(zhTWData)) {
  if (isEnglish(text)) {
    englishCount++;
  }
}
console.log(`zh-TW: ${englishCount} English entries remaining`);
