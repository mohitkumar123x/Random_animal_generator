const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src', 'data', 'blog-content.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
const locs = Object.keys(data);
console.log('Total locales:', locs.length);
let allOk = true;
locs.forEach(loc => {
  const c = data[loc];
  const arrays = [
    ['tocItems', c.tocItems],
    ['conservationGuide.headers', c.conservationGuide.headers],
    ['conservationGuide.statuses', c.conservationGuide.statuses],
    ['classification.levels', c.classification.levels],
    ['categories.items', c.categories.items],
    ['habitatDistribution.headers', c.habitatDistribution.headers],
    ['habitatDistribution.rows', c.habitatDistribution.rows],
    ['endangeredFlowchart.threats', c.endangeredFlowchart.threats],
    ['endangeredFlowchart.actions', c.endangeredFlowchart.actions],
    ['recordHolders.headers', c.recordHolders.headers],
    ['recordHolders.records', c.recordHolders.records],
    ['workflow.steps', c.workflow.steps],
    ['funFacts.items', c.funFacts.items],
    ['education.headers', c.education.headers],
    ['education.rows', c.education.rows],
    ['timeline.items', c.timeline.items],
  ];
  c.classification.levels.forEach((lvl, i) => {
    if (lvl.type === 'row') arrays.push([`classification.levels[${i}].items`, lvl.items]);
  });
  const bad = arrays.filter(a => !Array.isArray(a[1]));
  if (bad.length) {
    allOk = false;
    console.log(loc, 'HAS PROBLEMS:', bad.map(b => b[0]).join(', '));
  } else {
    console.log(loc, 'arrays OK');
  }
});
console.log('\n--- SAMPLE: DE endangeredFlowchart keys ---');
console.log(Object.keys(data.de.endangeredFlowchart));
console.log('EN endangeredFlowchart keys:', Object.keys(data.en.endangeredFlowchart));
