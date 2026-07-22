# PROJECT STATE — 2026-07-22

## Sintesi verificata

Step 15 implementato come direzione artistica e interfaccia immersiva della scena P0 provvisoria. L’esperienza conserva l’architettura Babylon/React, il fallback 2D, il picking scientifico, la PWA offline e i vincoli di pubblicazione.

## Gate

| Gate | Stato | Evidenza | Limite residuo |
|---|---|---|---|
| T1 | PASS nell’ambiente testato | build PWA, manifest sotto base path, service worker, offline, fallback e axe | nuovo collaudo su Safari/iPad reale non eseguito nello Step 15 |
| T2 | PASS nell’ambiente testato | scena, prima/terza persona, touch simulato, reset, profili adattivi e diagnostica | FPS reale su iPad da misurare sul dispositivo |
| Base T4 | PASS STRUTTURALE | picking su mesh unite → featureId → scheda; legenda a quattro classi | non equivale a validazione archeologica |
| P0-MIN | CHIUSO | nessun rilievo istituzionale, misura controllata o autorizzazione acquisita | invariato |

## Build e test finali

- Registry: 10/10 record validi; nessun asset definitivo, istituzionale o personale.
- ESLint: PASS.
- TypeScript strict: PASS.
- Vitest/Testing Library: 4 file, 7 test, tutti PASS.
- Build Vite/PWA: PASS; precache Workbox circa 2,15 MiB.
- Playwright desktop: PASS, inclusi axe, fallback, picking, pannelli, modalità immersiva, manifest e offline.
- Viewport 834×1194 e 1194×834 con touch simulato: PASS.
- Safari/iPad reale: non eseguito in questo ambiente; resta `PENDING DEVICE` per la nuova resa Step 15.

## Diagnostica grafica

Il test headless usa Chromium 149 e SwiftShader, cioè rendering software senza GPU: gli FPS non sono trasferibili a desktop o iPad reali. Dopo l’unione delle mesh le draw call misurate sono scese da 422 a 68; i triangoli visibili sono circa 9.652 nel profilo Equilibrato. Il profilo Leggero riduce scala hardware e dettagli decorativi.

## Stato scientifico e richieste

- La scena resta `M0 / DEBUG_DISPLAY`; nessuna misura è derivabile.
- Stato attuale e 1250 a.C. non sono fusi; la vista 1250 è bloccata.
- R01, R02, R03 e R05 non inviate; R04 sospesa e non inviabile.
- Risposte, licenze e autorizzazioni: nessuna ricevuta.
- Dati personali: non utilizzati.

## Limiti residui

- Blocchi, rilievo dei leoni, terreno, pietre e vegetazione restano procedurali.
- Texture fotografiche/PBR, modelli professionali e fotogrammetria non sono presenti.
- Il chunk Babylon resta ampio ma è caricato solo entrando nell’esploratore.
- Il fotorealismo dell’immagine di direzione artistica richiede produzione asset dedicata e fonti legalmente utilizzabili.
