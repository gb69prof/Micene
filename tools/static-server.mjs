import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('../dist', import.meta.url)));
const types = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.webmanifest': 'application/manifest+json', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.map': 'application/json; charset=utf-8'
};

createServer((request, response) => {
  const pathname = decodeURIComponent(new URL(request.url ?? '/', 'http://127.0.0.1').pathname);
  const relative = normalize(pathname).replace(/^[/\\]+/, '');
  let file = resolve(join(root, relative || 'index.html'));
  if (!file.startsWith(root)) { response.writeHead(403).end('Forbidden'); return; }
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(root, 'index.html');
  const extension = extname(file);
  response.writeHead(200, {
    'Content-Type': types[extension] ?? 'application/octet-stream',
    'Cache-Control': extension === '.html' || file.endsWith('sw.js') ? 'no-cache' : 'public, max-age=31536000, immutable',
    'Cross-Origin-Opener-Policy': 'same-origin', 'Cross-Origin-Embedder-Policy': 'credentialless'
  });
  createReadStream(file).pipe(response);
}).listen(4173, '127.0.0.1', () => console.log('Build disponibile su http://127.0.0.1:4173'));
