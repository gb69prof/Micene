import { describe, expect, it } from 'vitest';
import { placeholderRecordSchema, placeholderRegistry, placeholderRegistrySchema } from './placeholderSchema';

describe('registro PLACEHOLDER', () => {
  it('valida il registro reale e mantiene ogni record fuori da A–D', () => {
    const result = placeholderRegistrySchema.safeParse(placeholderRegistry);
    expect(result.success).toBe(true);
    expect(placeholderRegistry.records.length).toBeGreaterThan(5);
    for (const record of placeholderRegistry.records) {
      expect(record.status).toBe('PLACEHOLDER');
      expect(record.metricStatus).toBe('M0');
      expect(record.confidenceGrade).toBeNull();
      expect(record.epistemicKind).toBeNull();
      expect(record.releaseEligible).toBe(false);
    }
  });

  it('rifiuta motivazione o requisito di sostituzione mancanti', () => {
    const valid = placeholderRegistry.records[0];
    expect(placeholderRecordSchema.safeParse({ ...valid, placeholderReason: '' }).success).toBe(false);
    expect(placeholderRecordSchema.safeParse({ ...valid, replacementRequirement: '' }).success).toBe(false);
  });

  it('rifiuta promozione a definitivo o released', () => {
    const valid = placeholderRegistry.records[0];
    expect(placeholderRecordSchema.safeParse({ ...valid, publicationClass: 'DEFINITIVE' }).success).toBe(false);
    expect(placeholderRecordSchema.safeParse({ ...valid, workflowStatus: 'RELEASED' }).success).toBe(false);
    expect(placeholderRecordSchema.safeParse({ ...valid, releaseEligible: true }).success).toBe(false);
  });
});
