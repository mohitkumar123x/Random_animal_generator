const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'src', 'data', 'blog-content.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

function findMapIssues(obj, path = '') {
  const issues = [];
  const checkArray = (val, p) => {
    if (!Array.isArray(val)) {
      issues.push(`${p}: NOT ARRAY, got ${typeof val}`);
      return false;
    }
    return true;
  };

  for (const loc of Object.keys(obj)) {
    const c = obj[loc];
    const prefix = loc;
    if (!checkArray(c.tocItems, prefix + '.tocItems')) continue;
    if (!checkArray(c.conservationGuide.headers, prefix + '.conservation.headers')) continue;
    if (!checkArray(c.conservationGuide.statuses, prefix + '.conservation.statuses')) continue;
    if (!checkArray(c.classification.levels, prefix + '.classification.levels')) continue;
    c.classification.levels.forEach((lvl, i) => {
      if (lvl.type === 'row') {
        if (!checkArray(lvl.items, prefix + `.classification.levels[${i}].items`)) return;
      }
    });
    if (!checkArray(c.categories.items, prefix + '.categories.items')) continue;
    if (!checkArray(c.habitatDistribution.headers, prefix + '.habitatDistribution.headers')) continue;
    if (!checkArray(c.habitatDistribution.rows, prefix + '.habitatDistribution.rows')) continue;
    if (!checkArray(c.endangeredFlowchart.threats, prefix + '.endangeredFlowchart.threats')) continue;
    if (!checkArray(c.endangeredFlowchart.actions, prefix + '.endangeredFlowchart.actions')) continue;
    if (!checkArray(c.recordHolders.headers, prefix + '.recordHolders.headers')) continue;
    if (!checkArray(c.recordHolders.records, prefix + '.recordHolders.records')) continue;
    if (!checkArray(c.workflow.steps, prefix + '.workflow.steps')) continue;
    if (!checkArray(c.funFacts.items, prefix + '.funFacts.items')) continue;
    if (!checkArray(c.education.headers, prefix + '.education.headers')) continue;
    if (!checkArray(c.education.rows, prefix + '.education.rows')) continue;
    if (!checkArray(c.timeline.items, prefix + '.timeline.items')) continue;
  }

  if (issues.length === 0) {
    console.log('ALL 11 LOCALES: STRUCTURALLY VALID ✓');
  } else {
    console.log('ISSUES FOUND:');
    issues.forEach(i => console.log('  -', i));
  }

  console.log('\n--- Comparing EN vs DE object keys (deep) ---');
  function diffKeys(a, b, p = '') {
    const diffs = [];
    const keysA = Object.keys(a).sort();
    const keysB = Object.keys(b).sort();
    const all = new Set([...keysA, ...keysB]);
    for (const k of all) {
      if (!(k in a)) diffs.push(`${p}.${k} missing in EN`);
      if (!(k in b)) diffs.push(`${p}.${k} missing in DE`);
      if (k in a && k in b && typeof a[k] === 'object' && typeof b[k] === 'object' && a[k] !== null && b[k] !== null && !Array.isArray(a[k]) && !Array.isArray(b[k])) {
        diffs.push(...diffKeys(a[k], b[k], `${p}.${k}`));
      }
      if (k in a && k in b && Array.isArray(a[k]) && Array.isArray(b[k]) && a[k].length > 0 && typeof a[k][0] === 'object') {
        const len = Math.min(a[k].length, b[k].length);
        for (let i = 0; i < len; i++) {
          diffs.push(...diffKeys(a[k][i], b[k][i], `${p}.${k}[${i}]`));
        }
      }
    }
    return diffs;
  }
  const diffs = diffKeys(data.en, data.de, '');
  if (diffs.length === 0) console.log('EN vs DE: no key differences ✓');
  else diffs.forEach(d => console.log('  ', d));
