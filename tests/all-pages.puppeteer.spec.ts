import puppeteer, { type Browser, type Page } from 'puppeteer';

const BASE_URL = 'http://localhost:4321';
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const MOCK_PEXELS_RESPONSE = JSON.stringify({
  photos: [{
    id: 12345,
    src: {
      large2x: 'https://images.pexels.com/photos/12345/pexels-photo-12345.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
      large: 'https://images.pexels.com/photos/12345/pexels-photo-12345.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    },
    alt: 'Test animal photo',
  }],
});

const MOCK_FETCH_SCRIPT = `
  const originalFetch = window.fetch;
  window.fetch = function(url, opts) {
    if (typeof url === 'string' && url.includes('api.pexels.com')) {
      return Promise.resolve(new Response('${MOCK_PEXELS_RESPONSE}', {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
    return originalFetch.apply(this, arguments);
  };
`;

describe('Puppeteer - Homepage Pexels Integration', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  test('should generate animal and show image wrapper', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.keyboard.press('Space');
    await delay(3000);

    const imgWrapper = await page.$('#card-image-wrapper');
    expect(imgWrapper).toBeTruthy();
  });

  test('should set image src from Pexels', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.keyboard.press('Space');
    await delay(3000);

    const imgSrc = await page.evaluate(() => {
      const img = document.getElementById('card-image');
      return img?.getAttribute('src') || '';
    });
    expect(imgSrc).toContain('pexels');
  });

  test('should show fullscreen button', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.keyboard.press('Space');
    await delay(3000);

    const fsBtn = await page.$('#btn-fullscreen');
    expect(fsBtn).toBeTruthy();
  });

  test('should open fullscreen overlay', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.keyboard.press('Space');
    await delay(3000);

    await page.click('#btn-fullscreen');
    await delay(300);

    const overlayVisible = await page.evaluate(() => {
      const overlay = document.getElementById('fullscreen-overlay');
      return overlay && !overlay.classList.contains('hidden');
    });
    expect(overlayVisible).toBe(true);
  });

  test('should close fullscreen on Escape', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.keyboard.press('Space');
    await delay(3000);

    await page.click('#btn-fullscreen');
    await delay(300);
    await page.keyboard.press('Escape');
    await delay(300);

    const overlayHidden = await page.evaluate(() => {
      const overlay = document.getElementById('fullscreen-overlay');
      return overlay?.classList.contains('hidden') ?? true;
    });
    expect(overlayHidden).toBe(true);
  });

  test('should use correct API key', async () => {
    let capturedAuth = '';
    await page.evaluateOnNewDocument(`
      const originalFetch = window.fetch;
      window.fetch = function(url, opts) {
        if (typeof url === 'string' && url.includes('api.pexels.com')) {
          window.__capturedAuth = opts?.headers?.Authorization || '';
          return Promise.resolve(new Response('${MOCK_PEXELS_RESPONSE}', {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
        return originalFetch.apply(this, arguments);
      };
    `);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.keyboard.press('Space');
    await delay(3000);

    capturedAuth = await page.evaluate(() => (window as any).__capturedAuth || '');
    expect(capturedAuth).toBe('xEfnJ9xU5Fem8MeEPh1zE3lURDVneBkLnPGnrNAjnbMCBAY0LGtdgLFE');
  });

  test('should cache images in localStorage', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.keyboard.press('Space');
    await delay(3000);

    const cache = await page.evaluate(() => {
      return localStorage.getItem('pexelsImageCache') || '{}';
    });
    const parsed = JSON.parse(cache);
    expect(Object.keys(parsed).length).toBeGreaterThan(0);
  });
});

describe('Puppeteer - Multi-Card Images', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  test('should show 5 cards with image wrappers', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.select('#count-select', '5');
    await page.click('#generate-btn');
    await delay(3000);

    const cardCount = await page.evaluate(() => {
      return document.querySelectorAll('#multi-results > div').length;
    });
    expect(cardCount).toBe(5);

    const imgWrappers = await page.evaluate(() => {
      return document.querySelectorAll('.multi-card-image').length;
    });
    expect(imgWrappers).toBe(5);
  });

  test('should have skeleton elements in multi-cards', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.select('#count-select', '5');
    await page.click('#generate-btn');
    await delay(500);

    const skeletonCount = await page.evaluate(() => {
      return document.querySelectorAll('.multi-card-skeleton').length;
    });
    expect(skeletonCount).toBe(5);
  });

  test('should load images in multi-cards', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.select('#count-select', '5');
    await page.click('#generate-btn');
    await delay(4000);

    const loadedImages = await page.evaluate(() => {
      const imgs = document.querySelectorAll('.multi-card-img');
      let loaded = 0;
      imgs.forEach(img => { if ((img as HTMLImageElement).src) loaded++; });
      return loaded;
    });
    expect(loadedImages).toBeGreaterThan(0);
  });
});

describe('Puppeteer - Spinner Page Images', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  test('should load spinner page', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(`${BASE_URL}/spinner`, { waitUntil: 'networkidle0' });
    const title = await page.title();
    expect(title).toContain('Spinner');
  });

  test('should have spin button', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(`${BASE_URL}/spinner`, { waitUntil: 'networkidle0' });
    const spinBtn = await page.$('#spin-btn');
    expect(spinBtn).toBeTruthy();
  });

  test('should show result image after spin', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(`${BASE_URL}/spinner`, { waitUntil: 'networkidle0' });
    await page.click('#spin-btn');
    await delay(6000);

    const imgSrc = await page.evaluate(() => {
      const img = document.getElementById('result-image');
      return img?.getAttribute('src') || '';
    });
    expect(imgSrc).toContain('pexels');
  });

  test('should show spinner card with image', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(`${BASE_URL}/spinner`, { waitUntil: 'networkidle0' });
    await page.click('#spin-btn');
    await delay(6000);

    const cardVisible = await page.evaluate(() => {
      const card = document.getElementById('spinner-card');
      return card && !card.classList.contains('hidden');
    });
    expect(cardVisible).toBe(true);

    const cardImgSrc = await page.evaluate(() => {
      const img = document.getElementById('card-image');
      return img?.getAttribute('src') || '';
    });
    expect(cardImgSrc).toContain('pexels');
  });

  test('should reset images on category change', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(`${BASE_URL}/spinner`, { waitUntil: 'networkidle0' });
    await page.select('#spinner-category', 'mammal');
    await delay(300);

    const resultHidden = await page.evaluate(() => {
      const wrap = document.getElementById('result-image-wrapper');
      return wrap?.classList.contains('hidden') ?? true;
    });
    expect(resultHidden).toBe(true);
  });
});

describe('Puppeteer - Quiz Page Images', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  test('should load quiz page', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(`${BASE_URL}/quiz`, { waitUntil: 'networkidle0' });
    const title = await page.title();
    expect(title).toContain('Quiz');
  });

  test('should have 4 quiz options', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(`${BASE_URL}/quiz`, { waitUntil: 'networkidle0' });
    await delay(1000);

    const optionCount = await page.evaluate(() => {
      return document.querySelectorAll('#quiz-options button').length;
    });
    expect(optionCount).toBe(4);
  });

  test('should have quiz image wrapper', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(`${BASE_URL}/quiz`, { waitUntil: 'networkidle0' });
    await delay(2000);

    const imgWrapper = await page.$('#quiz-image-wrapper');
    expect(imgWrapper).toBeTruthy();
  });

  test('should load quiz image from Pexels', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(`${BASE_URL}/quiz`, { waitUntil: 'networkidle0' });
    await delay(3000);

    const imgSrc = await page.evaluate(() => {
      const img = document.getElementById('quiz-image');
      return img?.getAttribute('src') || '';
    });
    expect(imgSrc).toContain('pexels');
  });
});

describe('Puppeteer - Compare Section Images', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  test('should show compare cards with image wrappers', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });

    const compareBtn = await page.$('#compare-btn');
    if (compareBtn) {
      await compareBtn.click();
      await delay(3000);

      const cardCount = await page.evaluate(() => {
        return document.querySelectorAll('.compare-card').length;
      });
      expect(cardCount).toBe(2);

      const imgWrappers = await page.evaluate(() => {
        return document.querySelectorAll('.compare-image').length;
      });
      expect(imgWrappers).toBe(2);
    }
  });
});

describe('Puppeteer - Download Card', () => {
  let browser: Browser;
  let page: Page;

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    page = await browser.newPage();
  });

  afterEach(async () => {
    await page.close();
  });

  test('should have download button after generation', async () => {
    await page.evaluateOnNewDocument(MOCK_FETCH_SCRIPT);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    await page.keyboard.press('Space');
    await delay(3000);

    const dlBtn = await page.$('#btn-download');
    expect(dlBtn).toBeTruthy();
  });
});
