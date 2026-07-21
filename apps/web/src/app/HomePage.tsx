import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function HomePage() {
  const { t } = useTranslation();
  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">STEP 12 · T0 APERTO</p>
          <h1>Il contenitore prima della ricostruzione.</h1>
          <p className="lead">Questo prototipo prova PWA, navigazione, picking, diagnostica e modalità scientifica. Non prova la forma di Micene: ogni volume è un segnaposto tecnico M0.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/explorer">{t('openExplorer')}</Link>
            <Link className="secondary-button" to="/fallback">Consulta il fallback accessibile</Link>
          </div>
        </div>
        <div className="status-orbit" aria-label="Stato dei Gate">
          <div className="orbit-ring"><span>T1</span><span>T2</span><span>T4 base</span></div>
          <div className="orbit-core"><strong>M0</strong><span>LG01 semantica</span></div>
        </div>
      </section>
      <section className="principle-grid" aria-label="Principi di controllo">
        <article><span>01</span><h2>Dato ≠ grafica</h2><p>Le coordinate di visualizzazione tecnica restano separate dai dati scientifici.</p></article>
        <article><span>02</span><h2>PLACEHOLDER ≠ D</h2><p>Il segnaposto è fuori dai livelli A–D e non è un’ipotesi archeologica.</p></article>
        <article><span>03</span><h2>{t('gateClosed')}</h2><p>Nessun Gate tecnico modifica la chiusura archeologica e metrica di P0-MIN.</p></article>
      </section>
      <section className="gate-strip">
        <div><span>R01 · R02 · R03 · R05</span><strong>Pronte dopo compilazione/conferma · non inviate</strong></div>
        <div><span>R04</span><strong>Sospesa · non inviabile</strong></div>
        <div><span>Privacy</span><strong>Nessuna analytics, telemetria o dato personale</strong></div>
      </section>
    </main>
  );
}
