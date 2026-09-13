const fs = require('fs');
const path = require('path');

const englishEntries = fs.readFileSync(path.join(__dirname, '..', 'english_entries.txt'), 'utf-8')
  .trim()
  .split('\n')
  .map(line => {
    const [id, text] = line.split('|||');
    return { id: id.trim(), text: text.trim() };
  });

const BATCH_SIZE = 30;
const batches = [];
for (let i = 0; i < englishEntries.length; i += BATCH_SIZE) {
  batches.push(englishEntries.slice(i, i + BATCH_SIZE));
}

batches.forEach((batch, idx) => {
  const partNum = idx + 1;
  const fileName = `ar-part${partNum}.js`;
  const filePath = path.join(__dirname, fileName);
  
  const lines = ['module.exports = {'];
  batch.forEach((entry, i) => {
    const comma = i < batch.length - 1 ? ',' : '';
    // Escape quotes in the text
    const escapedText = entry.text.replace(/"/g, '\\"');
    lines.push(`  "${entry.id}": "${escapedText}"${comma}`);
  });
  lines.push('};');
  
  fs.writeFileSync(filePath, lines.join('\n'), 'utf-8');
  console.log(`Wrote ${fileName} with ${batch.length} entries`);
});

console.log(`\nTotal: ${englishEntries.length} entries in ${batches.length} files`);
