import { z } from 'zod';
import rawRegistry from '@data/assets/placeholders.json';

const vec3Schema = z.tuple([z.number(), z.number(), z.number()]);
export const placeholderRecordSchema = z.object({
  featureId: z.string().regex(/^P0-PH-[A-Z0-9-]+$/),
  assetId: z.string().regex(/^ASSET-P0-PH-[A-Z0-9-]+$/),
  name: z.object({ it: z.string().min(1), en: z.string().min(1) }).strict(),
  status: z.literal('PLACEHOLDER'), placeholder: z.literal(true), metricStatus: z.literal('M0'),
  placeholderReason: z.string().min(10), replacementRequirement: z.string().min(10),
  displayTransform: z.object({
    space: z.literal('DEBUG_DISPLAY'), position: vec3Schema, rotation: vec3Schema, scale: vec3Schema
  }).strict(),
  temporalStates: z.array(z.enum(['COMMON', 'NOW', 'REM', 'MOD', '1250', 'CMP', 'HYP'])).min(1),
  sources: z.array(z.never()).max(0), decisionIds: z.array(z.never()).max(0),
  confidenceGrade: z.null(), epistemicKind: z.null(),
  publicationClass: z.enum(['PROVISIONAL', 'DEMO']),
  workflowStatus: z.enum(['RAW', 'STAGING', 'VALIDATED']),
  releaseEligible: z.literal(false),
  primitiveType: z.enum(['ground', 'grid', 'axis', 'box', 'cylinder', 'sphere', 'path', 'seam']),
  materialKey: z.enum(['neutral', 'magenta', 'cyan', 'yellow', 'axis', 'grid']),
  selectable: z.boolean()
}).strict();

export const placeholderRegistrySchema = z.object({
  schemaVersion: z.literal('1.0.0'), profile: z.literal('DEBUG_DISPLAY'),
  records: z.array(placeholderRecordSchema).min(1)
}).strict();

export type PlaceholderRecord = z.infer<typeof placeholderRecordSchema>;
export type PlaceholderRegistry = z.infer<typeof placeholderRegistrySchema>;
export const placeholderRegistry: PlaceholderRegistry = placeholderRegistrySchema.parse(rawRegistry);
