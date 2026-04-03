import { defineConfig, devices } from '@playwright/test';
import { getBaseURL, getResolvedEnvSummary } from './config/resolve-env';

const summary = getResolvedEnvSummary();
console.log(`[playwright] env=${summary.env} baseURL=${summary.baseURL} source=${summary.source}`);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }], ['list'], ['junit', { outputFile: 'test-results/junit.xml' }]],
  use: {
    baseURL: getBaseURL(),
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});

