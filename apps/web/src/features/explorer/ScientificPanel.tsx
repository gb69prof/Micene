import { placeholderRegistry } from '@/data/placeholderSchema';

export function ScientificPanel({ featureId }: { featureId: string | null }) {
  const record = placeholderRegistry.records.find((entry) => entry.featureId === featureId) ?? null;
  return (
    <section className="panel scientific-panel" aria-live="polite" aria-label="Scheda scientifica dell'elemento selezionato">
      <div className="panel-heading"><span>SCHEDA DELL'ELEMENTO</span>{record && <b>CLASSIFICATO</b>}</div>
      {!record ? <p className="empty-state">Tocca la porta, le mura o il percorso per distinguere dato, inferenza visiva e placeholder.</p> : <>
        <h2>{record.name.it}</h2>
        <dl className="record-list">
          <div><dt>featureId</dt><dd>{record.featureId}</dd></div>
          <div><dt>assetId</dt><dd>{record.assetId}</dd></div>
          <div><dt>Stato metrico</dt><dd>M0 · coordinate metriche non determinate</dd></div>
          <div><dt>Classificazione</dt><dd>{record.featureId === 'P0-PH-LG01-VOL' ? 'Fonte/documentato per identità e caratteri generali; geometria: inferenza visiva' : 'Inferenza visiva / placeholder geometrico'}</dd></div>
          <div><dt>Attendibilità A–D</dt><dd>NULL · nessun livello attribuito</dd></div>
          <div><dt>Base informativa</dt><dd>Sintesi dei dossier di progetto; nessuna fonte associata alla geometria e nessuna misura o asset istituzionale incorporato</dd></div>
          <div><dt>Decisioni</dt><dd>NULL · nessuna decisione scientifica</dd></div>
          <div><dt>Spazio</dt><dd>{record.displayTransform.space} · non è projectTransform</dd></div>
        </dl>
        <div className="reason-block"><strong>Perché è un segnaposto</strong><p>{record.placeholderReason}</p></div>
        <div className="replacement-block"><strong>Requisito di sostituzione</strong><p>{record.replacementRequirement}</p></div>
      </>}
    </section>
  );
}
