const fs = require('fs');
const animals = require('./animals.json');
const translations = require('./animal-translations.json');
const pt = translations.pt || {};

const ptNames = {};

for (const a of animals) {
  const entry = pt[a.id];
  if (!entry || !entry.name || !entry.description) {
    ptNames[a.id] = { _en_name: a.name, _en_desc: a.description };
  }
}

fs.writeFileSync('./_pt_ids.json', JSON.stringify(ptNames));
console.log('Extracted', Object.keys(ptNames).length, 'IDs needing generation');
