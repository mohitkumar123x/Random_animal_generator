const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const locales = ['ar', 'de', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'zh-CN', 'zh-TW'];

const pages = [
  { name: 'about-us.astro', importName: 'AboutUsPage' },
  { name: 'contact-us.astro', importName: 'ContactUsPage' },
  { name: 'privacy-policy.astro', importName: 'PrivacyPolicyPage' },
  { name: 'terms-and-conditions.astro', importName: 'TermsPage' },
];

locales.forEach(loc => {
  const dir = path.join(root, 'src/pages', loc);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  pages.forEach(p => {
    const filePath = path.join(dir, p.name);
    const content = `---
import ${p.importName} from '../${p.name}';
---

<${p.importName} locale="${loc}" />
`;
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Created ${loc}/${p.name}`);
  });
});
