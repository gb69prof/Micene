import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe.configure({ timeout: 90_000 });

test('@desktop Step 15: esperienza, rigore scientifico, fallback e offline', async ({ page, context }) => {
  await test.step('quadro iniziale accessibile e confini espliciti', async () => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /La Porta diventa un’esperienza/i })).toBeVisible();
    await expect(page.getByText(/P0-MIN chiuso/i).first()).toBeVisible();
    await expect(page.getByText(/Modello visivo provvisorio/i).first()).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });

  await test.step('fallback WebGL2 accessibile', async () => {
    await page.goto('/explorer?forceFallback=1');
    await expect(page).toHaveURL(/\/fallback\?reason=webgl2/);
    await expect(page.getByRole('heading', { name: /Nessuna falsa ricostruzione statica/i })).toBeVisible();
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  });

  await test.step('scena dominante, avvio, controlli e pannelli museali', async () => {
    await page.goto('/explorer');
    const canvas = page.getByLabel(/Scena 3D procedurale provvisoria/);
    await expect(canvas).toBeVisible();
    await expect(page.getByRole('heading', { name: /Entra nella soglia/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /1250 a.C. · non disponibile/i })).toBeDisabled();
    await expect(page.getByText(/Gate P0-MIN chiuso/i).last()).toBeVisible();
    await page.getByRole('button', { name: /Inizia l’esplorazione|Riprendi l’esplorazione/i }).click();
    await expect(page.getByRole('button', { name: 'Muovi avanti' })).toBeVisible();
    await page.getByRole('button', { name: 'Prima persona' }).click();
    await expect(page.getByRole('button', { name: 'Prima persona' })).toHaveAttribute('aria-pressed', 'true');
    await page.getByRole('button', { name: 'Muovi avanti' }).click();
    await page.getByRole('button', { name: 'Terza persona' }).click();
    const box = await canvas.boundingBox();
    await canvas.click({ position: { x: (box?.width ?? 100) * .72, y: (box?.height ?? 100) * .48 } });
    await page.getByRole('button', { name: 'Apri scheda dell’elemento' }).click();
    await expect(page.getByText('CLASSIFICATO')).toBeVisible();
    await expect(page.locator('.scientific-panel dd').filter({ hasText: /^P0-PH-/ }).first()).toBeVisible();
    await page.getByRole('button', { name: 'Chiudi pannello' }).click();
    await page.getByRole('button', { name: 'Apri legenda scientifica' }).click();
    await expect(page.getByText('Fonte/documentato')).toBeVisible();
    await expect(page.getByText('Inferenza visiva')).toBeVisible();
    await expect(page.getByText('Ipotesi estetica')).toBeVisible();
    await expect(page.getByText('Placeholder', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: 'Chiudi pannello' }).click();
    await page.getByRole('button', { name: 'Nascondi quasi tutta l’interfaccia' }).click();
    await expect(page.getByRole('button', { name: 'Mostra interfaccia' })).toBeVisible();
    await page.getByRole('button', { name: 'Mostra interfaccia' }).click();
    expect((await new AxeBuilder({ page }).exclude('.scene-canvas').analyze()).violations).toEqual([]);
  });

  await test.step('manifest sotto base path e degradazione non bloccante', async () => {
    await page.goto('/explorer');
    await page.getByRole('button', { name: 'Apri diagnostica' }).click();
    await expect(page.getByText(/ready · STEP15-IMMERSIVE-M0-1/)).toBeVisible({ timeout: 15_000 });
    await page.goto('/explorer?manifest=missing');
    await expect(page.getByText(/Manifest esterno non disponibile/)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Riprova' })).toBeVisible();
    await expect(page.getByLabel(/Scena 3D procedurale provvisoria/)).toBeVisible();
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
    await expect(page.getByRole('heading', { name: /La Porta diventa un’esperienza/i })).toBeVisible();
    await expect(page.getByText(/Offline/).first()).toBeVisible();
    await context.setOffline(false);
  });
});

test('@tablet viewport iPad simulato: scena, touch, pannelli e watermark', async ({ page }) => {
  await page.goto('/explorer');
  const viewport = await page.locator('.viewport-shell').boundingBox();
  expect(viewport).not.toBeNull();
  expect(viewport?.width ?? 0).toBeGreaterThan(800);
  expect(viewport?.height ?? 0).toBeGreaterThan(700);
  await page.getByRole('button', { name: /Inizia l’esplorazione|Riprendi l’esplorazione/i }).tap();
  await expect(page.getByRole('button', { name: 'Muovi avanti' })).toBeVisible();
  await page.getByRole('button', { name: 'Muovi avanti' }).tap();
  await page.getByRole('button', { name: 'Apri scheda dell’elemento' }).tap();
  await expect(page.getByText(/Tocca la porta, le mura o il percorso/i)).toBeVisible();
  await expect(page.getByText(/Modello visivo provvisorio/i).first()).toBeVisible();
});
