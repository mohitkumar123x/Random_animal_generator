const fs = require('fs');
const path = require('path');

// Read the English entries
const entries = fs.readFileSync('english_entries.txt', 'utf8').trim().split('\n');
const parsed = entries.map(line => {
  const [id, ...rest] = line.split('|||');
  return { id, text: rest.join('|||') };
});

// Split into batches of 20
const batchSize = 20;
const batches = [];
for (let i = 0; i < parsed.length; i += batchSize) {
  batches.push(parsed.slice(i, i + batchSize));
}

console.log(`Total entries: ${parsed.length}`);
console.log(`Batches: ${batches.length}`);
console.log(`First batch IDs: ${batches[0].map(e => e.id).join(', ')}`);
console.log(`Last batch IDs: ${batches[batches.length-1].map(e => e.id).join(', ')}`);

// Write a manifest file
const manifest = {
  totalEntries: parsed.length,
  totalBatches: batches.length,
  batchSize: batchSize,
  batches: batches.map((b, i) => ({
    index: i + 1,
    file: `batch${String(i+1).padStart(3,'0')}.json`,
    ids: b.map(e => e.id),
    count: b.length
  }))
};
fs.writeFileSync(path.join(__dirname, 'translation-batches', 'manifest.json'), JSON.stringify(manifest, null, 2));
console.log('Manifest written');
