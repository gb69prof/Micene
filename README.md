# Micene — Esplorazione archeologica 3D

Step 15 trasforma il prototipo della Porta dei Leoni in un’esperienza museale immersiva, mantenendo una separazione esplicita fra identità documentata, inferenza visiva, ipotesi estetica e geometria `PLACEHOLDER`.

La scena pubblicata è un **modello visivo provvisorio** nello spazio sintetico `DEBUG_DISPLAY`: non è un rilievo metrico, non è una ricostruzione archeologica verificata e non anticipa la Micene del 1250 a.C. Il Gate `P0-MIN` resta chiuso.

## Avvio e verifica

Requisiti: Node.js 24 o successivo e npm.

```bash
npm install
npm run dev
npm run check
npm run test:e2e
```

Build per GitHub Pages:

```bash
BASE_PATH=/Micene/ npm run build
```

## Contenuto dello Step 15

- scena 3D dominante con HUD museale sovrapposto e richiudibile;
- ingresso/ripresa dell’esplorazione e modalità quasi priva di interfaccia;
- pannelli separati per scheda scientifica, legenda e diagnostica;
- stato attuale attivo e vista 1250 a.C. esplicitamente non disponibile;
- cielo, terreno, pietra, luce, foschia e dettagli realizzati proceduralmente;
- profili grafici Leggero, Equilibrato e Alto applicati anche a risoluzione e dettaglio;
- blocchi uniti per elemento scientifico per ridurre le draw call senza perdere il picking;
- PWA installabile, precache offline, fallback 2D e percorsi compatibili con `/Micene/`.

Non sono presenti analytics, dati personali, asset istituzionali, texture fotografiche o modelli 3D di terzi.
