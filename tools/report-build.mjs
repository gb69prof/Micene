import { createGzip } from 'node:zlib';
import { createReadStream } from 'node:fs';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const files = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    else files.push(path);
  }
}
async function gzipSize(path) {
  return new Promise((resolve, reject) => {
    let bytes = 0; const gzip = createGzip();
    createReadStream(path).pipe(gzip).on('data', (chunk) => { bytes += chunk.length; }).on('end', () => resolve(bytes)).on('error', reject);
  });
}
await walk('dist');
const records = [];
for (const path of files.sort()) {
  const bytes = (await stat(path)).size;
  records.push({ file: relative('dist', path), bytes, gzipBytes: await gzipSize(path) });
}
const initialExtensions = new Set(['.html', '.css', '.js']);
const totalBytes = records.reduce((sum, item) => sum + item.bytes, 0);
const initialShell = records.filter((item) => !item.file.includes('babylon-') && !item.file.includes('ExplorerPage-') && [...initialExtensions].some((ext) => item.file.endsWith(ext)));
await mkdir('reports/performance', { recursive: true });
await writeFile('reports/performance/build-sizes.json', JSON.stringify({
  measuredAt: new Date().toISOString(), totalBuildBytes: totalBytes,
  initialShellGzipBytes: initialShell.reduce((sum, item) => sum + item.gzipBytes, 0), files: records
}, null, 2));
