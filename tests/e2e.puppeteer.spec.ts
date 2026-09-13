import puppeteer, { type Browser, type Page } from 'puppeteer';

const BASE_URL = 'http://localhost:4321';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const LOCALES = [
  { code: 'en', prefix: '' },
  { code: 'es', prefix: '/es' },
  { code: 'ja', prefix: '/ja' },
  { code: 'fr', prefix: '/fr' },
  { code: 'de', prefix: '/de' },
  { code: 'pt', prefix: '/pt' },
  { code: 'ko', prefix: '/ko' },
  { code: 'it', prefix: '/it' },
  { code: 'zh-CN', prefix: '/zh-CN' },
  { code: 'zh-TW', prefix: '/zh-TW' },
  { code: 'ar', prefix: '/ar' },
];

describe('Puppeteer E2E Tests', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  describe('Homepage Tests', () => {
    test('should load the homepage', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const title = await page.title();
      expect(title).toContain('Random Animal Generator');
    });

    test('should display hero section', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const h1 = await page.$('h1');
      expect(h1).toBeTruthy();
    });

    test('should have generate button', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const generateBtn = await page.$('button');
      expect(generateBtn).toBeTruthy();
    });

    test('should have theme toggle', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const themeToggle = await page.$('#theme-toggle');
      expect(themeToggle).toBeTruthy();
    });

    test('should toggle dark mode', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      // Clear any stored theme preference
      await page.evaluate(() => {
        localStorage.removeItem('theme');
        document.documentElement.classList.remove('dark');
      });
      
      const themeToggle = await page.$('#theme-toggle');
      await themeToggle?.click();
      
      await delay(300);
      
      const hasDarkClass = await page.evaluate(() => {
        return document.documentElement.classList.contains('dark');
      });
      expect(hasDarkClass).toBe(true);
    });

    test('should have language switcher', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const langBtn = await page.$('#lang-menu-btn');
      expect(langBtn).toBeTruthy();
    });

    test('should open language dropdown', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      const langBtn = await page.$('#lang-menu-btn');
      await langBtn?.click();
      
      await delay(300);
      
      const langDropdown = await page.$('#lang-menu-dropdown');
      const isVisible = await page.evaluate((el) => {
        return el && !el.classList.contains('hidden');
      }, langDropdown);
      expect(isVisible).toBe(true);
    });

    test('should display animal cards after generation', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      // Click generate button
      const generateBtn = await page.$('button');
      await generateBtn?.click();
      
      await delay(2000);
      
      // Check if animal card appeared - look for any element with animal info
      const hasContent = await page.evaluate(() => {
        const body = document.body.innerHTML;
        return body.includes('Habitat') || body.includes('Diet') || body.includes('Lifespan') || 
               body.includes('habitat') || body.includes('diet') || body.includes('lifespan') ||
               document.querySelectorAll('[class*="card"]').length > 0;
      });
      expect(hasContent).toBe(true);
    });
  });

  describe('Blog Page Tests', () => {
    test('should load the English blog page', async () => {
      await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle0' });
      const title = await page.title();
      expect(title).toContain('Blog');
    });

    test('should display blog header', async () => {
      await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle0' });
      const h1 = await page.$('h1');
      expect(h1).toBeTruthy();
    });

    test('should display table of contents', async () => {
      await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle0' });
      const toc = await page.$('nav ul');
      expect(toc).toBeTruthy();
    });

    test('should have all 10 sections', async () => {
      await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle0' });
      
      const sections = [
        'conservation-guide',
        'classification-chart',
        'category-breakdown',
        'habitat-map',
        'endangered-flowchart',
        'record-holders',
        'generator-workflow',
        'fun-facts-grid',
        'education-guide',
        'extinction-timeline',
      ];

      for (const sectionId of sections) {
        const section = await page.$(`#${sectionId}`);
        expect(section).toBeTruthy();
      }
    });

    test('should display conservation status table', async () => {
      await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle0' });
      const table = await page.$('#conservation-guide table');
      expect(table).toBeTruthy();
    });

    test('should display classification flowchart', async () => {
      await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle0' });
      const flowchart = await page.$('#classification-chart');
      expect(flowchart).toBeTruthy();
    });
  });

  describe('Blog Locale Tests', () => {
    LOCALES.forEach((locale) => {
      test(`should load ${locale.code} blog page`, async () => {
        const url = locale.code === 'en'
          ? `${BASE_URL}/blog`
          : `${BASE_URL}${locale.prefix}/blog`;
        
        await page.goto(url, { waitUntil: 'networkidle0' });
        
        // Check page loaded
        const pageUrl = page.url();
        expect(pageUrl).toContain('/blog');
      });

      test(`${locale.code} blog should have h1`, async () => {
        const url = locale.code === 'en'
          ? `${BASE_URL}/blog`
          : `${BASE_URL}${locale.prefix}/blog`;
        
        await page.goto(url, { waitUntil: 'networkidle0' });
        const h1 = await page.$('h1');
        expect(h1).toBeTruthy();
      });
    });
  });

  describe('Navigation Tests', () => {
    test('should navigate to homepage from navbar', async () => {
      await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle0' });
      
      const logo = await page.$('a[href="/"]');
      await logo?.click();
      
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      expect(page.url()).toBe(`${BASE_URL}/`);
    });

    test('should navigate to blog from navbar', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      const blogLink = await page.$('a[href*="blog"]');
      await blogLink?.click();
      
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      expect(page.url()).toContain('/blog');
    });

    test('should navigate to spinner from navbar', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      const spinnerLink = await page.$('a[href*="spinner"]');
      await spinnerLink?.click();
      
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      expect(page.url()).toContain('/spinner');
    });

    test('should navigate to quiz from navbar', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      const quizLink = await page.$('a[href*="quiz"]');
      await quizLink?.click();
      
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      expect(page.url()).toContain('/quiz');
    });
  });

  describe('Language Switcher Tests', () => {
    test('should switch to Spanish', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      const langBtn = await page.$('#lang-menu-btn');
      await langBtn?.click();
      
      await delay(300);
      
      const spanishLink = await page.$('a[href="/es/"]');
      await spanishLink?.click();
      
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      expect(page.url()).toContain('/es/');
    });

    test('should switch to Japanese', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      const langBtn = await page.$('#lang-menu-btn');
      await langBtn?.click();
      
      await delay(300);
      
      const japaneseLink = await page.$('a[href="/ja/"]');
      await japaneseLink?.click();
      
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      expect(page.url()).toContain('/ja/');
    });

    test('should switch to French', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      const langBtn = await page.$('#lang-menu-btn');
      await langBtn?.click();
      
      await delay(300);
      
      const frenchLink = await page.$('a[href="/fr/"]');
      await frenchLink?.click();
      
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      expect(page.url()).toContain('/fr/');
    });

    test('should switch back to English', async () => {
      await page.goto(`${BASE_URL}/es/`, { waitUntil: 'networkidle0' });
      
      const langBtn = await page.$('#lang-menu-btn');
      await langBtn?.click();
      
      await delay(300);
      
      const englishLink = await page.$('a[href="/"]');
      await englishLink?.click();
      
      await page.waitForNavigation({ waitUntil: 'networkidle0' });
      expect(page.url()).toBe(`${BASE_URL}/`);
    });
  });

  describe('SEO Tests', () => {
    test('should have meta description', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const metaDesc = await page.$('meta[name="description"]');
      expect(metaDesc).toBeTruthy();
    });

    test('should have canonical URL', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const canonical = await page.$('link[rel="canonical"]');
      expect(canonical).toBeTruthy();
    });

    test('should have Open Graph tags', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const ogTitle = await page.$('meta[property="og:title"]');
      expect(ogTitle).toBeTruthy();
    });

    test('should have hreflang tags', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const hreflang = await page.$$('link[rel="alternate"][hreflang]');
      expect(hreflang.length).toBeGreaterThan(0);
    });

    test('should have structured data', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const jsonLd = await page.$$('script[type="application/ld+json"]');
      expect(jsonLd.length).toBeGreaterThan(0);
    });
  });

  describe('Performance Tests', () => {
    test('should load homepage within 3 seconds', async () => {
      const startTime = Date.now();
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);
    });

    test('should load blog page within 3 seconds', async () => {
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/blog`, { waitUntil: 'networkidle0' });
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);
    });

    test('should load spinner page within 3 seconds', async () => {
      const startTime = Date.now();
      await page.goto(`${BASE_URL}/spinner`, { waitUntil: 'networkidle0' });
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(3000);
    });
  });

  describe('Responsive Design Tests', () => {
    test('should work on mobile viewport', async () => {
      await page.setViewport({ width: 375, height: 667 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      const mobileMenuBtn = await page.$('#mobile-menu-btn');
      expect(mobileMenuBtn).toBeTruthy();
    });

    test('should work on tablet viewport', async () => {
      await page.setViewport({ width: 768, height: 1024 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      const h1 = await page.$('h1');
      expect(h1).toBeTruthy();
    });

    test('should work on desktop viewport', async () => {
      await page.setViewport({ width: 1920, height: 1080 });
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      
      const h1 = await page.$('h1');
      expect(h1).toBeTruthy();
    });
  });

  describe('404 Page Tests', () => {
    test('should show 404 for non-existent page', async () => {
      const response = await page.goto(`${BASE_URL}/non-existent-page`, { waitUntil: 'networkidle0' });
      expect(response?.status()).toBe(404);
    });
  });

  describe('Accessibility Tests', () => {
    test('should have lang attribute on html', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const lang = await page.evaluate(() => document.documentElement.getAttribute('lang'));
      expect(lang).toBeTruthy();
    });

    test('should have proper heading hierarchy', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const h1Count = await page.evaluate(() => document.querySelectorAll('h1').length);
      expect(h1Count).toBeGreaterThanOrEqual(1);
    });

    test('should have aria labels on buttons', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const ariaLabel = await page.evaluate(() => {
        const btn = document.querySelector('#theme-toggle');
        return btn?.getAttribute('aria-label');
      });
      expect(ariaLabel).toBeTruthy();
    });
  });

  describe('Footer Tests', () => {
    test('should display footer', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const footer = await page.$('footer');
      expect(footer).toBeTruthy();
    });

    test('should have footer links', async () => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
      const footerLinks = await page.$$('footer a');
      expect(footerLinks.length).toBeGreaterThan(0);
    });
  });
});
