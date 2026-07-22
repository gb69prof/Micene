import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium as playwrightChromium } from '@playwright/test';
import chromium from '@sparticuz/chromium';

await mkdir('screenshots/_qa', { recursive: true });
await mkdir('reports/performance/_qa', { recursive: true });
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
  await page.screenshot({ path: 'screenshots/_qa/01-home-desktop.png', fullPage: true });
  await page.goto('http://127.0.0.1:4173/fallback');
  await page.screenshot({ path: 'screenshots/_qa/02-fallback-desktop.png', fullPage: true });
  await page.goto('http://127.0.0.1:4173/explorer');
  const canvas = page.getByLabel(/Scena 3D procedurale provvisoria/);
  await canvas.waitFor({ state: 'visible', timeout: 15_000 });
  await page.screenshot({ path: 'screenshots/_qa/03-explorer-entry-desktop.png' });
  await page.getByRole('button', { name: /Inizia l’esplorazione|Riprendi l’esplorazione/ }).click();
  await page.screenshot({ path: 'screenshots/_qa/04-explorer-started-desktop.png' });
  await page.getByRole('button', { name: 'Apri diagnostica' }).click();
  await page.getByText('WebGL2').first().waitFor({ state: 'visible', timeout: 15_000 });

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
  await writeFile('reports/performance/_qa/runtime-metrics.json', JSON.stringify({
    measuredAt: new Date().toISOString(), environment: { browser: await browser.version(), viewport: '1280x720', simulation: 'desktop headless; non iPad reale', ...graphics }, metrics
  }, null, 2));

  await page.setViewportSize({ width: 834, height: 1194 });
  await page.goto('http://127.0.0.1:4173/explorer');
  await canvas.waitFor({ state: 'visible', timeout: 15_000 });
  await page.screenshot({ path: 'screenshots/_qa/05-explorer-tablet-portrait-simulated.png' });
  await page.setViewportSize({ width: 1194, height: 834 });
  await page.goto('http://127.0.0.1:4173/explorer');
  await canvas.waitFor({ state: 'visible', timeout: 15_000 });
  await page.screenshot({ path: 'screenshots/_qa/06-explorer-tablet-landscape-simulated.png' });
  await browser.close();
} finally {
  server.kill('SIGTERM');
}
