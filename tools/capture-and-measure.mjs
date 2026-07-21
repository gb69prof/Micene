import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium as playwrightChromium } from '@playwright/test';
import chromium from '@sparticuz/chromium';

await mkdir('screenshots', { recursive: true });
await mkdir('reports/performance', { recursive: true });
const server = spawn(process.execPath, ['tools/static-server.mjs'], { stdio: 'ignore' });
try {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try { if ((await fetch('http://127.0.0.1:4173')).ok) break; } catch { /* attesa server */ }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const browser = await playwrightChromium.launch({
    executablePath: await chromium.executablePath(),
    args: chromium.args,
    env: { HOME: '/tmp/codex-home', XDG_CACHE_HOME: '/tmp/codex-home/.cache', FONTCONFIG_PATH: '/tmp/fonts' }
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();
  await page.goto('http://127.0.0.1:4173/');
  await page.screenshot({ path: 'screenshots/01-home-desktop.png', fullPage: true });
  await page.goto('http://127.0.0.1:4173/fallback');
  await page.screenshot({ path: 'screenshots/02-fallback-desktop.png', fullPage: true });
  await page.goto('http://127.0.0.1:4173/explorer');
  await page.getByText('WebGL2').first().waitFor({ state: 'visible', timeout: 15_000 });
  await page.screenshot({ path: 'screenshots/03-explorer-desktop.png' });
  const canvas = page.getByLabel(/Scena diagnostica 3D/);
  const box = await canvas.boundingBox();
  const selectedBadge = page.locator('.scientific-panel').getByText('PLACEHOLDER', { exact: true }).first();
  if (box) {
    for (const [x, y] of [[0.25, 0.35], [0.5, 0.35], [0.75, 0.35], [0.5, 0.6], [0.42, 0.76]]) {
      await canvas.click({ position: { x: box.width * x, y: box.height * y } });
      if (await selectedBadge.count()) break;
    }
  }
  await selectedBadge.waitFor({ state: 'visible' });
  await page.screenshot({ path: 'screenshots/04-explorer-selection-desktop.png' });

  const metrics = await page.locator('.metric').evaluateAll((nodes) => nodes.map((node) => ({
    label: node.querySelector('span')?.textContent ?? '', value: node.querySelector('strong')?.textContent ?? '', kind: node.querySelector('small')?.textContent ?? ''
  })));
  const graphics = await page.locator('canvas').evaluate((canvasElement) => {
    const gl = canvasElement.getContext('webgl2');
    if (!gl) return { webglVersion: null, renderer: null, vendor: null };
    const debug = gl.getExtension('WEBGL_debug_renderer_info');
    return {
      webglVersion: gl.getParameter(gl.VERSION),
      renderer: debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER),
      vendor: debug ? gl.getParameter(debug.UNMASKED_VENDOR_WEBGL) : gl.getParameter(gl.VENDOR)
    };
  });
  await writeFile('reports/performance/runtime-metrics.json', JSON.stringify({
    measuredAt: new Date().toISOString(), environment: { browser: await browser.version(), viewport: '1280x720', simulation: 'desktop headless; non iPad reale', ...graphics }, metrics
  }, null, 2));

  await page.setViewportSize({ width: 834, height: 1194 });
  await page.goto('http://127.0.0.1:4173/explorer');
  await page.getByText('WebGL2').first().waitFor({ state: 'visible', timeout: 15_000 });
  await page.screenshot({ path: 'screenshots/05-explorer-tablet-portrait-simulated.png', fullPage: true });
  await page.setViewportSize({ width: 1194, height: 834 });
  await page.goto('http://127.0.0.1:4173/explorer');
  await page.getByText('WebGL2').first().waitFor({ state: 'visible', timeout: 15_000 });
  await page.screenshot({ path: 'screenshots/06-explorer-tablet-landscape-simulated.png', fullPage: true });
  await browser.close();
} finally {
  server.kill('SIGTERM');
}
