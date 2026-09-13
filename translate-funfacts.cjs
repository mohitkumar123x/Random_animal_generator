const fs = require('fs');
const path = require('path');

const zhTW = JSON.parse(fs.readFileSync('src/data/zh-TW-funfacts.json','utf8'));
const ar = JSON.parse(fs.readFileSync('src/data/ar-funfacts.json','utf8'));

function isEnglish(s) {
  return /^[\x20-\x7E]*$/.test(s);
}

// Load all translation batches
const zhTWtranslations = {};
const arTranslations = {};

const batchDir = path.join(__dirname, 'translation-batches');
if (fs.existsSync(batchDir)) {
  const files = fs.readdirSync(batchDir).filter(f => f.endsWith('.json')).sort();
  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(batchDir, file), 'utf8'));
    if (data.zhTW) Object.assign(zhTWtranslations, data.zhTW);
    if (data.ar) Object.assign(arTranslations, data.ar);
  }
}

// Apply translations
let zhTWapplied = 0, arApplied = 0;
for (const [id, val] of Object.entries(zhTW)) {
  if (isEnglish(val) && zhTWtranslations[id]) {
    zhTW[id] = zhTWtranslations[id];
    zhTWapplied++;
  }
}
for (const [id, val] of Object.entries(ar)) {
  if (isEnglish(val) && arTranslations[id]) {
    ar[id] = arTranslations[id];
    arApplied++;
  }
}

// Count remaining English
let zhTWengRemaining = 0, arEngRemaining = 0;
for (const [id, val] of Object.entries(zhTW)) {
  if (isEnglish(val)) zhTWengRemaining++;
}
for (const [id, val] of Object.entries(ar)) {
  if (isEnglish(val)) arEngRemaining++;
}

console.log(`zh-TW: ${zhTWapplied} translations applied, ${zhTWengRemaining} English entries remaining`);
console.log(`ar: ${arApplied} translations applied, ${arEngRemaining} English entries remaining`);

// Write files
fs.writeFileSync('src/data/zh-TW-funfacts.json', JSON.stringify(zhTW, null, 2));
fs.writeFileSync('src/data/ar-funfacts.json', JSON.stringify(ar, null, 2));
console.log('Files written successfully');
