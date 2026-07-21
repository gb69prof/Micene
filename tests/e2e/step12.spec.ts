import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('@desktop flusso desktop: shell, fallback, scena, selezione, errori e offline', async ({ page, context }) => {
  await test.step('shell accessibile', async () => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /contenitore prima della ricostruzione/i })).toBeVisible();
    await expect(page.getByText(/P0-MIN chiuso/i).first()).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });

  await test.step('fallback WebGL2 accessibile', async () => {
    await page.goto('/explorer?forceFallback=1');
    await expect(page).toHaveURL(/\/fallback\?reason=webgl2/);
    await expect(page.getByRole('heading', { name: /Nessuna falsa ricostruzione statica/i })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });

  await test.step('scena, diagnostica, picking e controlli', async () => {
    await page.goto('/explorer');
    const canvas = page.getByLabel(/Scena diagnostica 3D/);
    await expect(canvas).toBeVisible();
    await expect(page.getByText(/M0 \/ coordinate metriche non determinate/i)).toBeVisible();
    await expect(page.getByText(/WebGL2/).first()).toBeVisible({ timeout: 15_000 });
    const box = await canvas.boundingBox();
    expect(box).not.toBeNull();
    const selectedBadge = page.locator('.scientific-panel').getByText(/PLACEHOLDER/).first();
    for (const [x, y] of [[0.25, 0.35], [0.5, 0.35], [0.75, 0.35], [0.5, 0.6], [0.42, 0.76]]) {
      await canvas.click({ position: { x: (box?.width ?? 2) * x, y: (box?.height ?? 2) * y } });
      if (await selectedBadge.count()) break;
    }
    await expect(selectedBadge).toBeVisible();
    await expect(page.locator('.scientific-panel dd').filter({ hasText: /^P0-PH-/ }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Prima persona' }).click();
    await expect(page.getByRole('button', { name: 'Prima persona' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Muovi avanti' }).click();
    await page.getByRole('button', { name: 'Terza persona' }).click();
    await expect(page.getByRole('button', { name: 'Terza persona' })).toHaveAttribute('aria-pressed', 'true');
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });

  await test.step('manifest mancante non blocca la scena', async () => {
    await page.goto('/explorer?manifest=missing');
    await expect(page.getByText(/Manifest esterno non disponibile/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Riprova' })).toBeVisible();
    await expect(page.getByLabel(/Scena diagnostica 3D/)).toBeVisible();
  });

  await test.step('riapertura offline dopo prima visita', async () => {
    await page.goto('/');
    await page.waitForFunction(async () => {
      if (!('serviceWorker' in navigator)) return false;
      const registration = await navigator.serviceWorker.ready;
      return registration.active?.state === 'activated';
    }, null, { timeout: 15_000 });
    await page.reload();
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, { timeout: 15_000 });
    await context.setOffline(true);
    await page.reload();
    await expect(page.getByRole('heading', { name: /contenitore prima della ricostruzione/i })).toBeVisible();
    await expect(page.getByText(/Offline/).first()).toBeVisible();
    await context.setOffline(false);
  });
});

test('@tablet viewport tablet simulato: layout, touch e avvertenze', async ({ page }) => {
  await page.goto('/explorer');
  const toolbar = await page.locator('.explorer-toolbar').boundingBox();
  const viewport = await page.locator('.viewport-shell').boundingBox();
  expect(toolbar).not.toBeNull(); expect(viewport).not.toBeNull();
  expect((viewport?.y ?? 0)).toBeGreaterThanOrEqual((toolbar?.y ?? 0) + (toolbar?.height ?? 0) - 1);
  await expect(page.getByRole('button', { name: 'Muovi avanti' })).toBeVisible();
  await page.getByRole('button', { name: 'Muovi avanti' }).tap();
  await expect(page.getByText(/NON È UNA RICOSTRUZIONE DI MICENE/).first()).toBeVisible();
});
