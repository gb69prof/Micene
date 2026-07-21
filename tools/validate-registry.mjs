import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { z } from 'zod';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const vec3 = z.tuple([z.number(), z.number(), z.number()]);
const recordSchema = z.object({
  featureId: z.string().regex(/^P0-PH-[A-Z0-9-]+$/),
  assetId: z.string().regex(/^ASSET-P0-PH-[A-Z0-9-]+$/),
  name: z.object({ it: z.string().min(1), en: z.string().min(1) }).strict(),
  status: z.literal('PLACEHOLDER'),
  placeholder: z.literal(true),
  metricStatus: z.literal('M0'),
  placeholderReason: z.string().min(10),
  replacementRequirement: z.string().min(10),
  displayTransform: z.object({ space: z.literal('DEBUG_DISPLAY'), position: vec3, rotation: vec3, scale: vec3 }).strict(),
  temporalStates: z.array(z.enum(['COMMON', 'NOW', 'REM', 'MOD', '1250', 'CMP', 'HYP'])).min(1),
  sources: z.array(z.never()).max(0),
  decisionIds: z.array(z.never()).max(0),
  confidenceGrade: z.null(),
  epistemicKind: z.null(),
  publicationClass: z.enum(['PROVISIONAL', 'DEMO']),
  workflowStatus: z.enum(['RAW', 'STAGING', 'VALIDATED']),
  releaseEligible: z.literal(false),
  primitiveType: z.enum(['ground', 'grid', 'axis', 'box', 'cylinder', 'sphere', 'path', 'seam']),
  materialKey: z.enum(['neutral', 'magenta', 'cyan', 'yellow', 'axis', 'grid']),
  selectable: z.boolean()
}).strict();

const registrySchema = z.object({
  schemaVersion: z.literal('1.0.0'),
  profile: z.literal('DEBUG_DISPLAY'),
  records: z.array(recordSchema).min(1)
}).strict();

const registry = JSON.parse(await readFile(resolve(root, 'data/assets/placeholders.json'), 'utf8'));
const manifest = JSON.parse(await readFile(resolve(root, 'assets/manifests/release-step12.json'), 'utf8'));
const parsed = registrySchema.parse(registry);
const assetIds = new Set(parsed.records.map((record) => record.assetId));
const featureIds = new Set(parsed.records.map((record) => record.featureId));

if (assetIds.size !== parsed.records.length || featureIds.size !== parsed.records.length) {
  throw new Error('featureId e assetId devono essere univoci.');
}
if (manifest.containsInstitutionalAssets || manifest.containsPersonalData) {
  throw new Error('Il manifest pubblico non può contenere dati istituzionali o personali.');
}
for (const manifestAssetId of manifest.assetIds) {
  if (!assetIds.has(manifestAssetId)) throw new Error(`Asset non registrato nel manifest: ${manifestAssetId}`);
}
for (const record of parsed.records) {
  if (record.publicationClass === 'DEFINITIVE' || record.workflowStatus === 'RELEASED' || record.releaseEligible) {
    throw new Error(`Promozione automatica vietata: ${record.assetId}`);
  }
  if (!manifest.assetIds.includes(record.assetId)) throw new Error(`Asset escluso dal manifest controllato: ${record.assetId}`);
}

console.log(`Registry valido: ${parsed.records.length} PLACEHOLDER; nessun asset definitivo, istituzionale o personale.`);
