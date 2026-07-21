import { defineConfig, devices } from '@playwright/test';
import chromium from '@sparticuz/chromium';

const executablePath = await chromium.executablePath();

export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './test-results',
  workers: 1,
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173',
    launchOptions: {
      executablePath,
      args: chromium.args,
      env: { HOME: '/tmp/codex-home', XDG_CACHE_HOME: '/tmp/codex-home/.cache', FONTCONFIG_PATH: '/tmp/fonts' }
    },
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: true,
    timeout: 120_000
  },
  projects: [
    { name: 'desktop-chromium', grep: /@desktop/, use: { ...devices['Desktop Chrome'] } },
    { name: 'tablet-portrait-simulated', grep: /@tablet/, use: { ...devices['Desktop Chrome'], viewport: { width: 834, height: 1194 }, hasTouch: true, deviceScaleFactor: 1 } },
    { name: 'tablet-landscape-simulated', grep: /@tablet/, use: { ...devices['Desktop Chrome'], viewport: { width: 1194, height: 834 }, hasTouch: true, deviceScaleFactor: 1 } }
  ]
});
