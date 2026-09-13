const fs = require('fs');
const animals = require('./src/data/animals.json');

const koData = {};
const ptData = {};
const itData = {};

for (const a of animals) {
  koData[a.id] = { funFact: a.funFact };
  ptData[a.id] = { funFact: a.funFact };
  itData[a.id] = { funFact: a.funFact };
}

module.exports = { koData, ptData, itData };
