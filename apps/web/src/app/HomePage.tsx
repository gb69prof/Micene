import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function HomePage() {
  const { t } = useTranslation();
  return (
    <main className="home-page">
      <section className="hero-panel">
        <div className="hero-copy">
          <p className="eyebrow">STEP 15 · DIREZIONE ARTISTICA</p>
          <h1>La Porta diventa un’esperienza, senza smettere di essere onesta.</h1>
          <p className="lead">Un allestimento museale immersivo per esplorare lo stato attuale in forma evocativa. Atmosfera, luce e materiali sono procedurali; geometrie e proporzioni restano provvisorie e non metriche.</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/explorer">Inizia l’esplorazione</Link>
            <Link className="secondary-button" to="/fallback">Consulta il fallback accessibile</Link>
          </div>
        </div>
        <div className="status-orbit" aria-label="Stato dei Gate">
          <div className="orbit-ring"><span>T1</span><span>T2</span><span>T4 base</span></div>
          <div className="orbit-core"><strong>15</strong><span>direzione artistica · M0</span></div>
        </div>
      </section>
      <section className="principle-grid" aria-label="Principi di controllo">
        <article><span>ORA</span><h2>Regia visiva</h2><p>HUD museale, luce mediterranea, foschia, materiali e profondità migliorano subito con codice.</p></article>
        <article><span>PRODUZIONE</span><h2>Asset realistici</h2><p>Pietra PBR, fotogrammetria e modelli professionali richiedono una fase dedicata e fonti riutilizzabili.</p></article>
        <article><span>ESCLUSO</span><h2>{t('gateClosed')}</h2><p>Nessun dettaglio non documentato e nessuna geometria presentata come rilievo o ricostruzione verificata.</p></article>
      </section>
      <section className="gate-strip">
        <div><span>R01 · R02 · R03 · R05</span><strong>Pronte dopo compilazione/conferma · non inviate</strong></div>
        <div><span>R04</span><strong>Sospesa · non inviabile</strong></div>
        <div><span>Privacy</span><strong>Nessuna analytics, telemetria o dato personale</strong></div>
      </section>
    </main>
  );
}
