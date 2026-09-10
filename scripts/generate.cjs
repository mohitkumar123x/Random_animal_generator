const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
const outputPath = path.join(__dirname, '..', 'src', 'data', 'animals.json');

const categoryFiles = fs.readdirSync(dataDir).filter(f => f.endsWith('.json')).sort();

let allAnimals = [];

for (const file of categoryFiles) {
  const filePath = path.join(dataDir, file);
  const animals = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  allAnimals = allAnimals.concat(animals);
}

const seen = new Set();
const unique = [];
for (const a of allAnimals) {
  if (!seen.has(a.id)) {
    seen.add(a.id);
    if (!a.scientificName) a.scientificName = '';
    unique.push(a);
  }
}

fs.writeFileSync(outputPath, JSON.stringify(unique, null, 2), 'utf8');
console.log(`Generated ${unique.length} animals from ${categoryFiles.length} category files`);
