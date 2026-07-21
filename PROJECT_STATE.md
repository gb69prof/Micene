# PROJECT STATE — 2026-07-21

## Sintesi verificata

Step 12 implementato come prototipo tecnico controllato. Il progetto compila, genera una PWA installabile a livello tecnico, riapre la shell offline dopo la prima visita e rende una scena WebGL2 composta da dieci record `PLACEHOLDER` validati.

## Gate

| Gate | Stato | Evidenza | Limite residuo |
|---|---|---|---|
| T0 | APERTO | Mandato umano dello Step 12 | Non apre P0-MIN |
| T1 | PASS nell’ambiente testato | Build, manifest, service worker, offline, fallback e axe | Installazione e aggiornamento su Safari/iPad reale: PENDING DEVICE |
| T2 | PASS nell’ambiente testato | Scena, prima/terza persona, tastiera, touch simulato, reset, picking e diagnostica | Prestazioni e gesti su iPad reale: PENDING DEVICE |
| Base T4 | PASS STRUTTURALE | picking → featureId → scheda; legenda A–D/M0–M3; fonti e decisioni NULL | Non equivale a T4 scientifico completo |
| P0-MIN | CHIUSO | Dati metrici, NOW e separazione REM/MOD ancora mancanti | Invariato |

## Build e test finali

- Registry: 10/10 record validi; nessun asset definitivo, istituzionale o personale.
- ESLint: PASS.
- TypeScript strict: PASS.
- Vitest/Testing Library: 4 file, 7 test, tutti PASS.
- Build Vite: PASS.
- Playwright desktop: PASS per shell, axe, fallback, scena, selezione, cambio camera, touch HTML, manifest mancante e offline.
- Tablet 834×1194 simulato: PASS.
- Tablet 1194×834 simulato: PASS.
- Safari/iPad reale: non eseguito, `PENDING DEVICE`.

## Misure ottenute

Ambiente: Chromium 149 headless, WebGL2 tramite ANGLE/SwiftShader, viewport 1280×720. Non è hardware iPad.

| Metrica | Risultato | Qualifica |
|---|---:|---|
| FPS | 59,7 | misurato in headless SwiftShader |
| Frame time | 16,8 ms | misurato |
| Draw call | 12 | misurato |
| Triangoli visibili | 157 | misurato |
| Shell iniziale gzip | 107.879 byte | calcolato sulla build |
| Precache Workbox | 2.080,21 KiB | sopra target 2 MiB; sotto soglia 4 MiB |

## Stato richieste

- R01, R02, R03 e R05: pronte dopo compilazione o conferma; non inviate.
- R04: sospesa e non inviabile.
- Risposte, licenze e autorizzazioni: nessuna ricevuta.
- Dati personali: non utilizzati.

## Blocchi e problemi residui

- Verifica reale di installazione, offline, aggiornamento, touch e prestazioni su Safari/iPad.
- Precache di 2,03 MiB circa: supera marginalmente il target, non la soglia minima.
- Chunk Babylon da circa 1,65 MB non compresso: lazy-loaded sull’esploratore, ma da ottimizzare dopo la misura su dispositivo.
- Nessun dato archeologico può sostituire i segnaposto finché P0-MIN resta chiuso.
