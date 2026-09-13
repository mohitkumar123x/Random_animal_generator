const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');
const animals = JSON.parse(fs.readFileSync(path.join(dataDir, 'animals.json'), 'utf8'));
const translations = JSON.parse(fs.readFileSync(path.join(dataDir, 'animal-translations.json'), 'utf8'));

// Extract all animal IDs
const allAnimalIds = animals.map(a => a.id);

// Helper: check if an entry has name AND description
function hasNameAndDesc(entry) {
  return entry && entry.name && entry.description;
}

// For each locale, find missing entries and generate translations
function generateForLocale(locale) {
  const localeData = translations[locale] || {};
  const missing = [];
  
  for (const animal of animals) {
    const existing = localeData[animal.id];
    if (!existing || !hasNameAndDesc(existing)) {
      missing.push(animal);
    }
  }
  
  return missing;
}

const zhTWMissing = generateForLocale('zh-TW');
const arMissing = generateForLocale('ar');
const deMissing = generateForLocale('de');

console.log(`zh-TW missing: ${zhTWMissing.length}`);
console.log(`ar missing: ${arMissing.length}`);
console.log(`de missing: ${deMissing.length}`);

// Print the missing IDs for each
console.log('\nzh-TW missing IDs:');
console.log(zhTWMissing.map(a => a.id).join(', '));
console.log('\nar missing IDs:');
console.log(arMissing.map(a => a.id).join(', '));
console.log('\nde missing IDs:');
console.log(deMissing.map(a => a.id).join(', '));
