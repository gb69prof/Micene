# Micene 1250 a.C. — avvio e pubblicazione

## Avvio locale

Questa è una PWA WebGL: non aprire `index.html` con un semplice doppio clic. Avvia un piccolo server HTTP nella cartella `micene`.

Con Python:

```bash
python3 -m http.server 8080
```

Poi apri nel browser:

```text
http://localhost:8080
```

## Pubblicazione su GitHub Pages

Copia il contenuto della cartella `micene` nella radice del repository o nella cartella pubblicata da GitHub Pages. Il file iniziale è `index.html`.

## Prima apertura

La libreria Three.js viene caricata dal CDN già usato dal prototipo originale. Dopo la prima visita, il service worker prova a conservarla nella cache per l'uso successivo.

## Fotografie personali

La cartella `textures` contiene l'elenco dei nomi da usare per sostituire automaticamente le superfici procedurali con fotografie reali.
