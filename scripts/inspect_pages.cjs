const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const locales = ['en', 'ar', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-CN', 'zh-TW'];

locales.forEach(l => {
  const file = path.join(root, 'src/pages', l === 'en' ? 'index.astro' : `${l}/index.astro`);
  if (!fs.existsSync(file)) return;
  const c = fs.readFileSync(file, 'utf8');
  const m = c.match(/placeholder:\s*(['"])([\s\S]*?)\1\s*[,}]/);
  console.log(`[${l}] placeholder:`, m ? m[2] : 'none');
});
