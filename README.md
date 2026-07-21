# Micene — Step 12

Prototipo tecnico controllato della PWA e della scena P0 `PLACEHOLDER`.

Questo software non ricostruisce Micene. Visualizza soltanto primitive astratte nello spazio sintetico `DEBUG_DISPLAY`, con stato metrico `M0`, coordinate archeologiche non determinate e nessun livello A–D attribuito.

## Avvio

Requisiti: Node.js 24 o successivo e npm.

```bash
npm install
npm run dev
```

Build e controlli:

```bash
npm run check
npm run test:e2e
npm run preview
```

La build di produzione viene generata in `dist/`. Il server di anteprima ascolta esclusivamente su `127.0.0.1:4173` e non pubblica il progetto online.

## Garanzie dello Step 12

- Babylon.js è incapsulato dietro `EngineAdapter`; nessun oggetto del motore entra nello store serializzabile o nei record scientifici.
- Il registry Zod/JSON Schema blocca motivazioni mancanti, promozioni `DEFINITIVE`/`RELEASED`, asset non ammessi e dati istituzionali o personali nel manifest pubblico.
- `PLACEHOLDER` resta distinto da A–D e da `DATA`, `INFERENCE`, `HYPOTHESIS`.
- La shell dispone di home, esploratore, fallback 2D, manifest, service worker, aggiornamento controllato, stato offline e retry.
- Non sono presenti analytics, telemetria remota, CDN runtime, texture realistiche o dati istituzionali.

## Stato archeologico

`P0-MIN` resta chiuso. R01, R02, R03 e R05 non sono state inviate; R04 resta sospesa e non inviabile. Nessuna risposta, licenza o autorizzazione è considerata ricevuta.
