# STEP 15 — evidenza di verifica

Data: 22 luglio 2026.

## Confine scientifico

La release contiene soltanto materiali e geometrie procedurali provvisorie. Non contiene dati personali, asset istituzionali, coordinate metriche, rilievi, texture fotografiche o ricostruzione 1250 a.C. Il Gate P0-MIN resta chiuso.

## Comandi eseguiti

```bash
npm run check
npm run test:e2e
BASE_PATH=/Micene/ npm run build
npm run capture
```

## Esito

- lint, TypeScript, registry, 7 unit test e build PWA: PASS;
- desktop Chromium: PASS;
- fallback WebGL2 e riapertura offline: PASS;
- axe-core sulle viste testate: nessuna violazione rilevata;
- viewport touch 834×1194 e 1194×834: PASS;
- picking dopo unione delle mesh: PASS;
- manifest Step 15 sotto base path: PASS;
- Safari/iPad reale: non eseguito, quindi non dichiarato superato.

## Misure non trasferibili

Il browser headless usa SwiftShader software. Le 68 draw call e circa 9.652 triangoli sono utili per il confronto interno; gli FPS di questo ambiente non stimano le prestazioni dell’iPad.
