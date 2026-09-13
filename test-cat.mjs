import { chromium } from 'playwright';
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
page.on('console', msg => console.log('BROWSER:', msg.text()));
await page.goto('http://localhost:4321/', { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(2000);
// Check categories visible
const cats = await page.$$eval('.cat-btn', els => els.map(e => e.getAttribute('data-category') + ':' + e.textContent.trim()));
console.log('categories found', cats);

// Try to click fantasy
const fantasyBtn = page.locator('[data-category="fantasy"]');
await fantasyBtn.scrollIntoViewIfNeeded();
await page.waitForTimeout(500);
console.log('clicking fantasy');
await fantasyBtn.click({ force: true });
await page.waitForTimeout(500);
// Check currentCategory via window eval
const curCat = await page.evaluate(() => window.currentCategory || 'unknown variable');
console.log('currentCategory after click (via window?)', curCat);
// Try to evaluate the script's currentCategory variable directly? It's inside module closure, not global. Let's check getFilteredPool
const poolInfo = await page.evaluate(async () => {
  // access allAnimals from window? The script defines const allAnimals but not global, but we can try to get via page's JS context
  // Instead, re-fetch animals.json and filter
  const res = await fetch('/src/data/animals.json').catch(()=> null);
  return 'no direct';
});
console.log(poolInfo);

// Try to generate and check result
const genBtn = page.locator('#generate-btn');
await genBtn.click();
await page.waitForTimeout(2500); // wait for spinner
const cardText = await page.locator('#animal-card').textContent().catch(()=> 'no card');
console.log('card text snippet', cardText?.slice(0,500));
const cardVisible = await page.locator('#animal-card').isVisible().catch(()=>false);
console.log('card visible', cardVisible);
const cardCategory = await page.evaluate(() => {
  // try to get last generated animal category via checking card-conservation? Not.
  // Instead check the emoji/name?
  const name = document.getElementById('card-name')?.textContent;
  return name;
});
console.log('card name', cardCategory);

// Try prehistoric
const preBtn = page.locator('[data-category="prehistoric"]');
await preBtn.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await preBtn.click({ force: true });
await page.waitForTimeout(500);
await genBtn.click();
await page.waitForTimeout(2500);
const preName = await page.evaluate(() => document.getElementById('card-name')?.textContent);
console.log('prehistoric card name', preName);

// Try mythical
const mythBtn = page.locator('[data-category="mythical"]');
await mythBtn.scrollIntoViewIfNeeded();
await page.waitForTimeout(300);
await mythBtn.click({ force: true });
await page.waitForTimeout(500);
await genBtn.click();
await page.waitForTimeout(2500);
const mythName = await page.evaluate(() => document.getElementById('card-name')?.textContent);
console.log('mythical card name', mythName);

await browser.close();
