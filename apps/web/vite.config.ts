import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { fileURLToPath, URL } from 'node:url';

// GitHub Pages serves this repository below /Micene/.  Locally the app stays at
// the root, while CI supplies BASE_PATH=/Micene/ before building the artifact.
const base = process.env.BASE_PATH ?? '/';

export default defineConfig({
  base,
  root: fileURLToPath(new URL('.', import.meta.url)),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@data': fileURLToPath(new URL('../../data', import.meta.url))
    }
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/*.png', 'release-step12.json'],
      manifest: {
        name: 'Micene — Prototipo tecnico controllato',
        short_name: 'Micene P0 LAB',
        description: 'Laboratorio tecnico PLACEHOLDER. Non è una ricostruzione di Micene.',
        lang: 'it',
        start_url: './',
        scope: './',
        display: 'standalone',
        orientation: 'any',
        background_color: '#07111b',
        theme_color: '#0a1522',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,json,png,svg,woff2}'],
        navigateFallback: `${base}index.html`,
        cleanupOutdatedCaches: true,
        clientsClaim: false,
        skipWaiting: false,
        runtimeCaching: []
      },
      devOptions: { enabled: true, type: 'module' }
    })
  ],
  build: {
    outDir: fileURLToPath(new URL('../../dist', import.meta.url)),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@babylonjs/core')) return 'babylon';
          if (id.includes('i18next')) return 'i18n';
          if (id.includes('react') || id.includes('zustand')) return 'react';
          return undefined;
        }
      }
    }
  },
  server: { port: 4173, strictPort: true },
  preview: { port: 4173, strictPort: true }
});
