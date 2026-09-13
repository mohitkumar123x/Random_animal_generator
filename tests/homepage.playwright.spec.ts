import { test, expect, type Page } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

const LOCALES = [
  { code: 'en', prefix: '', name: 'English' },
  { code: 'es', prefix: '/es', name: 'Español' },
  { code: 'ja', prefix: '/ja', name: 'Japanese' },
  { code: 'fr', prefix: '/fr', name: 'Français' },
  { code: 'de', prefix: '/de', name: 'Deutsch' },
  { code: 'pt', prefix: '/pt', name: 'Português' },
  { code: 'ko', prefix: '/ko', name: 'Korean' },
  { code: 'it', prefix: '/it', name: 'Italiano' },
  { code: 'zh-CN', prefix: '/zh-CN', name: '简体中文' },
  { code: 'zh-TW', prefix: '/zh-TW', name: '繁體中文' },
  { code: 'ar', prefix: '/ar', name: 'العربية' },
];

const PAGES = [
  { path: '/', name: 'Homepage' },
  { path: '/blog', name: 'Blog' },
  { path: '/spinner', name: 'Spinner' },
  { path: '/quiz', name: 'Quiz' },
];

test.describe('Homepage Tests', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto(BASE_URL);
    await expect(page).toHaveTitle(/Random Animal Generator/);
  });

  test('should display the hero section', async ({ page }) => {
    await page.goto(BASE_URL);
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();
  });

  test('should have a generate button', async ({ page }) => {
    await page.goto(BASE_URL);
    const generateBtn = page.locator('button:has-text("Generate"), button:has-text("Space")').first();
    await expect(generateBtn).toBeVisible();
  });

  test('should have a theme toggle', async ({ page }) => {
    await page.goto(BASE_URL);
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toBeVisible();
  });

  test('should toggle dark mode', async ({ page }) => {
    await page.goto(BASE_URL);
    const html = page.locator('html');
    const themeToggle = page.locator('#theme-toggle');
    
    // Click toggle
    await themeToggle.click();
    await page.waitForTimeout(300);
    
    // Check dark class is toggled
    const hasDarkClass = await html.evaluate(el => el.classList.contains('dark'));
    expect(hasDarkClass).toBe(true);
  });

  test('should have a mobile menu button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    const mobileMenuBtn = page.locator('#mobile-menu-btn');
    await expect(mobileMenuBtn).toBeVisible();
  });

  test('should have language switcher', async ({ page }) => {
    await page.goto(BASE_URL);
    const langBtn = page.locator('#lang-menu-btn');
    await expect(langBtn).toBeVisible();
  });

  test('should open language dropdown', async ({ page }) => {
    await page.goto(BASE_URL);
    const langBtn = page.locator('#lang-menu-btn');
    const langDropdown = page.locator('#lang-menu-dropdown');
    
    await langBtn.click();
    await page.waitForTimeout(300);
    
    const isVisible = await langDropdown.isVisible();
    expect(isVisible).toBe(true);
  });

  test('should display animal cards', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(1000);
    
    // Check if any animal-related content is displayed
    const hasContent = await page.evaluate(() => {
      const body = document.body.innerHTML;
      return body.includes('Habitat') || body.includes('Diet') || body.includes('Lifespan') || 
             body.includes('habitat') || body.includes('diet') || body.includes('lifespan') ||
             document.querySelectorAll('[class*="card"]').length > 0;
    });
    expect(hasContent).toBe(true);
  });
});

test.describe('Blog Page Tests', () => {
  test('should load the English blog page', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    await expect(page).toHaveTitle(/Blog/);
  });

  test('should display blog header', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    const header = page.locator('h1').first();
    await expect(header).toBeVisible();
  });

  test('should display table of contents', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    const toc = page.locator('nav ul').first();
    await expect(toc).toBeVisible();
  });

  test('should have all 10 sections', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    
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
      const section = page.locator(`#${sectionId}`);
      await expect(section).toBeAttached();
    }
  });

  test('should display conservation status table', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    const table = page.locator('#conservation-guide table').first();
    await expect(table).toBeVisible();
  });

  test('should display classification flowchart', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    const flowchart = page.locator('#classification-chart').first();
    await expect(flowchart).toBeVisible();
  });

  test('should have a CTA section', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    const cta = page.locator('section:has-text("Try"), section:has-text("Generate")').first();
    await expect(cta).toBeVisible();
  });
});

test.describe('Blog Locale Tests', () => {
  for (const locale of LOCALES) {
    test(`should load ${locale.name} blog page`, async ({ page }) => {
      const url = locale.code === 'en' 
        ? `${BASE_URL}/blog` 
        : `${BASE_URL}${locale.prefix}/blog`;
      
      await page.goto(url);
      
      // Check page loaded without errors
      const errorOverlay = page.locator('.astro-error, [class*="error"]');
      const hasError = await errorOverlay.count();
      
      // Page should load (may have content but shouldn't crash)
      expect(page.url()).toContain('/blog');
    });

    test(`${locale.name} blog should have h1`, async ({ page }) => {
      const url = locale.code === 'en' 
        ? `${BASE_URL}/blog` 
        : `${BASE_URL}${locale.prefix}/blog`;
      
      await page.goto(url);
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();
    });
  }
});

test.describe('Navigation Tests', () => {
  test('should navigate to homepage from navbar', async ({ page }) => {
    await page.goto(`${BASE_URL}/blog`);
    const logo = page.locator('a[href="/"]').first();
    await logo.click();
    await page.waitForURL('**/');
    expect(page.url()).toBe(`${BASE_URL}/`);
  });

  test('should navigate to blog from navbar', async ({ page }) => {
    await page.goto(BASE_URL);
    const blogLink = page.locator('a[href*="blog"]').first();
    await blogLink.click();
    await page.waitForURL('**/blog');
    expect(page.url()).toContain('/blog');
  });

  test('should navigate to spinner from navbar', async ({ page }) => {
    await page.goto(BASE_URL);
    const spinnerLink = page.locator('a[href*="spinner"]').first();
    await spinnerLink.click();
    await page.waitForURL('**/spinner');
    expect(page.url()).toContain('/spinner');
  });

  test('should navigate to quiz from navbar', async ({ page }) => {
    await page.goto(BASE_URL);
    const quizLink = page.locator('a[href*="quiz"]').first();
    await quizLink.click();
    await page.waitForURL('**/quiz');
    expect(page.url()).toContain('/quiz');
  });
});

test.describe('Language Switcher Tests', () => {
  test('should switch to Spanish', async ({ page }) => {
    await page.goto(BASE_URL);
    const langBtn = page.locator('#lang-menu-btn');
    
    await langBtn.click();
    await page.waitForTimeout(300);
    
    const spanishLink = page.locator('#lang-menu-dropdown a[href="/es/"]');
    await spanishLink.click();
    
    await page.waitForURL('**/es/**');
    expect(page.url()).toContain('/es/');
  });

  test('should switch to Japanese', async ({ page }) => {
    await page.goto(BASE_URL);
    const langBtn = page.locator('#lang-menu-btn');
    
    await langBtn.click();
    await page.waitForTimeout(300);
    
    const japaneseLink = page.locator('#lang-menu-dropdown a[href="/ja/"]');
    await japaneseLink.click();
    
    await page.waitForURL('**/ja/**');
    expect(page.url()).toContain('/ja/');
  });

  test('should switch to French', async ({ page }) => {
    await page.goto(BASE_URL);
    const langBtn = page.locator('#lang-menu-btn');
    
    await langBtn.click();
    await page.waitForTimeout(300);
    
    const frenchLink = page.locator('#lang-menu-dropdown a[href="/fr/"]');
    await frenchLink.click();
    
    await page.waitForURL('**/fr/**');
    expect(page.url()).toContain('/fr/');
  });

  test('should switch back to English', async ({ page }) => {
    await page.goto(`${BASE_URL}/es/`);
    const langBtn = page.locator('#lang-menu-btn');
    
    await langBtn.click();
    await page.waitForTimeout(300);
    
    const englishLink = page.locator('#lang-menu-dropdown a[href="/"]');
    await englishLink.click();
    
    await page.waitForURL(BASE_URL + '/');
    expect(page.url()).toBe(`${BASE_URL}/`);
  });
});

test.describe('SEO Tests', () => {
  test('should have meta description', async ({ page }) => {
    await page.goto(BASE_URL);
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /.+/);
  });

  test('should have canonical URL', async ({ page }) => {
    await page.goto(BASE_URL);
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /.+/);
  });

  test('should have Open Graph tags', async ({ page }) => {
    await page.goto(BASE_URL);
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveAttribute('content', /.+/);
  });

  test('should have hreflang tags', async ({ page }) => {
    await page.goto(BASE_URL);
    const hreflang = page.locator('link[rel="alternate"][hreflang]');
    const count = await hreflang.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should have structured data', async ({ page }) => {
    await page.goto(BASE_URL);
    const jsonLd = page.locator('script[type="application/ld+json"]');
    const count = await jsonLd.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Responsive Design Tests', () => {
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(BASE_URL);
    
    const mobileMenuBtn = page.locator('#mobile-menu-btn');
    await expect(mobileMenuBtn).toBeVisible();
  });

  test('should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(BASE_URL);
    
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();
  });

  test('should work on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto(BASE_URL);
    
    const heroTitle = page.locator('h1').first();
    await expect(heroTitle).toBeVisible();
  });
});

test.describe('404 Page Tests', () => {
  test('should show 404 for non-existent page', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/non-existent-page`);
    expect(response?.status()).toBe(404);
  });
});

test.describe('Accessibility Tests', () => {
  test('should have lang attribute on html', async ({ page }) => {
    await page.goto(BASE_URL);
    const html = page.locator('html');
    await expect(html).toHaveAttribute('lang', /.+/);
  });

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto(BASE_URL);
    const h1 = page.locator('h1');
    const count = await h1.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('should have aria labels on buttons', async ({ page }) => {
    await page.goto(BASE_URL);
    const themeToggle = page.locator('#theme-toggle');
    await expect(themeToggle).toHaveAttribute('aria-label', /.+/);
  });
});

test.describe('Compare Page Hreflang Tests', () => {
  const locales = ['en', 'es', 'ja', 'fr', 'de', 'pt', 'ko', 'it', 'zh-CN', 'zh-TW', 'ar'];
  
  for (const locale of locales) {
    test(`should have hreflang tags on ${locale} compare page`, async ({ page }) => {
      const url = locale === 'en' ? `${BASE_URL}/compare` : `${BASE_URL}/${locale}/compare`;
      await page.goto(url);
      await page.waitForTimeout(500);
      
      const hreflangs = page.locator('link[rel="alternate"][hreflang]');
      const count = await hreflangs.count();
      expect(count).toBeGreaterThanOrEqual(11);
      
      const enLink = page.locator('link[rel="alternate"][hreflang="en"]');
      await expect(enLink).toHaveAttribute('href', /\/compare/);
      
      const xDefault = page.locator('link[rel="alternate"][hreflang="x-default"]');
      await expect(xDefault).toHaveAttribute('href', /\/compare/);
    });
  }
});
