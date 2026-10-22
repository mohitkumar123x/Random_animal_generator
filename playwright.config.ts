import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '*.playwright.spec.ts',
  timeout: 60000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    headless: !process.env.HEADED,
    launchOptions: {
      executablePath: 'C:\\Users\\mohit\\AppData\\Local\\ms-playwright\\chromium-1243\\chrome-win64\\chrome.exe',
    },
  },
  webServer: {
    command: 'npx astro dev',
    url: 'http://localhost:4321',
    reuseExistingServer: true,
    timeout: 120000,
    env: {
      ASTRO_DEV_BACKGROUND: '1',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
