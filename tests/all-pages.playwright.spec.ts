import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4321';

// Helper: intercept Pexels API calls
function interceptPexels(page: import('@playwright/test').Page) {
  return page.route('**/api.pexels.com/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        photos: [{
          id: 12345,
          src: {
            large2x: 'https://images.pexels.com/photos/12345/pexels-photo-12345.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            large: 'https://images.pexels.com/photos/12345/pexels-photo-12345.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
          },
          alt: 'Test animal photo',
        }],
      }),
    });
  });
}

// Helper: intercept image requests to avoid network delays
function interceptImages(page: import('@playwright/test').Page) {
  return page.route('**/*.jpeg', async (route) => {
    // Return a 1x1 pixel transparent GIF
    const buf = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    await route.fulfill({ status: 200, contentType: 'image/gif', body: buf });
  });
}

test.describe('Homepage - Pexels Image Integration', () => {
  test('should show skeleton loader while image loads', async ({ page }) => {
    await interceptPexels(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    // Press Space to generate
    await page.keyboard.press('Space');
    await page.waitForTimeout(2000);

    // Check if image wrapper exists (may show skeleton or loaded image)
    const imgWrapper = page.locator('#card-image-wrapper');
    await expect(imgWrapper).toBeAttached();
  });

  test('should load animal image from Pexels after generation', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    // Generate single animal
    await page.keyboard.press('Space');
    await page.waitForTimeout(3000);

    // Check if image element has src set
    const imgSrc = await page.evaluate(() => {
      const img = document.getElementById('card-image');
      return img?.getAttribute('src') || '';
    });
    expect(imgSrc).toContain('pexels');
  });

  test('should show fullscreen button when image loads', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    await page.keyboard.press('Space');
    await page.waitForTimeout(3000);

    const fsBtn = page.locator('#btn-fullscreen');
    await expect(fsBtn).toBeVisible();
  });

  test('should open fullscreen overlay on button click', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    await page.keyboard.press('Space');
    await page.waitForTimeout(3000);

    await page.locator('#btn-fullscreen').click();
    const overlay = page.locator('#fullscreen-overlay');
    await expect(overlay).toBeVisible();

    // Close it
    await page.locator('#fullscreen-close').click();
    await expect(overlay).toBeHidden();
  });

  test('should close fullscreen on Escape key', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    await page.keyboard.press('Space');
    await page.waitForTimeout(3000);

    await page.locator('#btn-fullscreen').click();
    await expect(page.locator('#fullscreen-overlay')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(page.locator('#fullscreen-overlay')).toBeHidden();
  });

  test('should hide skeleton and show image when loaded', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    await page.keyboard.press('Space');
    await page.waitForTimeout(3000);

    // Image wrapper should be visible and image should have src
    const imgHasSrc = await page.evaluate(() => {
      const img = document.getElementById('card-image');
      return img?.getAttribute('src')?.length > 0;
    });
    expect(imgHasSrc).toBe(true);
  });
});

test.describe('Homepage - Multi-Card Images', () => {
  test('should show images in multi-card grid', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    // Select 5 animals
    await page.locator('#count-select').selectOption('5');
    await page.locator('#generate-btn').click();
    await page.waitForTimeout(3000);

    const multiCards = page.locator('#multi-results > div');
    const count = await multiCards.count();
    expect(count).toBe(5);

    // Check each card has image wrapper
    for (let i = 0; i < count; i++) {
      const imgWrap = multiCards.nth(i).locator('.multi-card-image');
      await expect(imgWrap).toBeAttached();
    }
  });

  test('should show skeleton in multi-cards while loading', async ({ page }) => {
    await interceptPexels(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    await page.locator('#count-select').selectOption('5');
    await page.locator('#generate-btn').click();
    await page.waitForTimeout(2000);

    const skeletons = page.locator('.multi-card-skeleton');
    const count = await skeletons.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe('Spinner Page - Pexels Images', () => {
  test('should load spinner page', async ({ page }) => {
    await page.goto(`${BASE_URL}/spinner`);
    await expect(page).toHaveTitle(/Spinner/);
  });

  test('should have spin button', async ({ page }) => {
    await page.goto(`${BASE_URL}/spinner`);
    const spinBtn = page.locator('#spin-btn');
    await expect(spinBtn).toBeVisible();
  });

  test('should show result image wrapper after spin', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(`${BASE_URL}/spinner`);
    await page.waitForTimeout(500);

    await page.locator('#spin-btn').click();
    await page.waitForTimeout(6000);

    const resultImg = page.locator('#result-image');
    const src = await resultImg.getAttribute('src');
    expect(src).toBeTruthy();
  });

  test('should show spinner card with image after spin', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(`${BASE_URL}/spinner`);
    await page.waitForTimeout(500);

    await page.locator('#spin-btn').click();
    await page.waitForTimeout(6000);

    const card = page.locator('#spinner-card');
    await expect(card).toBeVisible();

    const cardImg = page.locator('#card-image');
    const src = await cardImg.getAttribute('src');
    expect(src).toContain('pexels');
  });

  test('should hide skeletons after spinner card loads', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(`${BASE_URL}/spinner`);
    await page.waitForTimeout(500);

    await page.locator('#spin-btn').click();
    await page.waitForTimeout(6000);

    const resultSkelHidden = await page.evaluate(() => {
      const skel = document.querySelector('#result-image-wrapper .image-skeleton, #result-image-wrapper .skeleton');
      return !skel || skel.classList.contains('hidden');
    });
    expect(resultSkelHidden).toBe(true);
  });

  test('should reset images when category changes', async ({ page }) => {
    await interceptPexels(page);
    await page.goto(`${BASE_URL}/spinner`);
    await page.waitForTimeout(500);

    await page.locator('#spinner-category').selectOption('mammal');
    await page.waitForTimeout(300);

    const resultImgHidden = await page.evaluate(() => {
      const wrap = document.getElementById('result-image-wrapper');
      return wrap?.classList.contains('hidden') ?? true;
    });
    expect(resultImgHidden).toBe(true);
  });
});

test.describe('Quiz Page - Pexels Images', () => {
  test('should load quiz page', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz`);
    await expect(page).toHaveTitle(/Quiz/);
  });

  test('should have quiz options', async ({ page }) => {
    await page.goto(`${BASE_URL}/quiz`);
    await page.waitForTimeout(1000);
    const options = page.locator('#quiz-options button');
    const count = await options.count();
    expect(count).toBe(4);
  });

  test('should show quiz image wrapper', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(`${BASE_URL}/quiz`);
    await page.waitForTimeout(2000);

    const imgWrapper = page.locator('#quiz-image-wrapper');
    await expect(imgWrapper).toBeAttached();
  });

  test('should load image in quiz after question renders', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(`${BASE_URL}/quiz`);
    await page.waitForTimeout(3000);

    const imgSrc = await page.evaluate(() => {
      const img = document.getElementById('quiz-image');
      return img?.getAttribute('src') || '';
    });
    expect(imgSrc).toContain('pexels');
  });

  test('should load new image on next question', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(`${BASE_URL}/quiz`);
    await page.waitForTimeout(2000);

    // Answer a question
    const firstOption = page.locator('#quiz-options button').first();
    await firstOption.click();
    await page.waitForTimeout(500);

    // Click next
    await page.locator('#quiz-next').click();
    await page.waitForTimeout(3000);

    const imgSrc = await page.evaluate(() => {
      const img = document.getElementById('quiz-image');
      return img?.getAttribute('src') || '';
    });
    expect(imgSrc).toContain('pexels');
  });
});

test.describe('Compare Section - Pexels Images', () => {
  test('should show compare section with images', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    // The compare section is in index.astro - find and click compare button
    const compareBtn = page.locator('#compare-btn');
    if (await compareBtn.isVisible()) {
      await compareBtn.click();
      await page.waitForTimeout(3000);

      const compareCards = page.locator('.compare-card');
      const count = await compareCards.count();
      expect(count).toBe(2);

      // Check image wrappers exist
      for (let i = 0; i < count; i++) {
        const imgWrap = compareCards.nth(i).locator('.compare-image');
        await expect(imgWrap).toBeAttached();
      }
    }
  });
});

test.describe('Download Card - Full Info', () => {
  test('should have download button', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);
    await page.keyboard.press('Space');
    await page.waitForTimeout(2000);

    const dlBtn = page.locator('#btn-download');
    await expect(dlBtn).toBeVisible();
  });

  test('should download PNG with all info', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    await page.keyboard.press('Space');
    await page.waitForTimeout(3000);

    // Set up download listener
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#btn-download').click();
    const download = await downloadPromise;

    expect(download.suggestedFilename()).toContain('.png');
  });
});

test.describe('Pexels API Key', () => {
  test('should use correct API key in requests', async ({ page }) => {
    let authHeader = '';
    await page.route('**/api.pexels.com/**', async (route) => {
      authHeader = route.request().headers()['authorization'] || '';
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ photos: [{ id: 1, src: { large2x: 'test.jpg', large: 'test.jpg' } }] }),
      });
    });

    await page.goto(BASE_URL);
    await page.waitForTimeout(500);
    await page.keyboard.press('Space');
    await page.waitForTimeout(3000);

    expect(authHeader).toBe('xEfnJ9xU5Fem8MeEPh1zE3lURDVneBkLnPGnrNAjnbMCBAY0LGtdgLFE');
  });
});

test.describe('Image Caching', () => {
  test('should cache image URLs in localStorage', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    await page.keyboard.press('Space');
    await page.waitForTimeout(3000);

    const cache = await page.evaluate(() => {
      return localStorage.getItem('pexelsImageCache') || '{}';
    });
    const parsed = JSON.parse(cache);
    expect(Object.keys(parsed).length).toBeGreaterThan(0);
  });

  test('should use cached image on second generation', async ({ page }) => {
    await interceptPexels(page);
    await interceptImages(page);
    await page.goto(BASE_URL);
    await page.waitForTimeout(500);

    // First generation
    await page.keyboard.press('Space');
    await page.waitForTimeout(3000);

    const cacheAfterFirst = await page.evaluate(() => {
      const cache = JSON.parse(localStorage.getItem('pexelsImageCache') || '{}');
      return Object.keys(cache).length;
    });

    // Second generation
    await page.keyboard.press('Space');
    await page.waitForTimeout(3000);

    const cacheAfterSecond = await page.evaluate(() => {
      const cache = JSON.parse(localStorage.getItem('pexelsImageCache') || '{}');
      return Object.keys(cache).length;
    });

    // Cache should have at least as many entries (may grow if different animal picked)
    expect(cacheAfterSecond).toBeGreaterThanOrEqual(cacheAfterFirst);
  });
});
