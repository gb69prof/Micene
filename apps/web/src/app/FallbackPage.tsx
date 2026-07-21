import { Link } from 'react-router-dom';

export function FallbackPage() {
  return (
    <main className="fallback-page">
      <p className="eyebrow">MODALITÀ 2D ACCESSIBILE</p>
      <h1>Nessuna falsa ricostruzione statica.</h1>
      <p className="lead">Questa pagina resta leggibile quando WebGL2 non è disponibile o quando l’utente preferisce evitare la scena 3D.</p>
      <section className="fallback-grid">
        <article><h2>Scopo</h2><p>Verificare il contenitore tecnico che, in futuro, potrà ricevere dati autorizzati e validati.</p></article>
        <article><h2>Stato scientifico</h2><p>Origine LG01 semantica; coordinate E₀/N₀/H₀ NULL; stato metrico M0; nessun livello A attribuito ai segnaposto.</p></article>
        <article><h2>Gate</h2><p>T0 aperto dal mandato dello Step 12. P0-MIN resta chiuso. T1, T2 e base T4 dipendono dalle prove tecniche registrate.</p></article>
        <article><h2>Richieste</h2><p>R01, R02, R03 e R05 non inviate; R04 sospesa; nessuna risposta, licenza o autorizzazione ricevuta.</p></article>
      </section>
      <div className="note-box"><strong>Assi convenzionali</strong><span>X = Est · Y = Nord · Z = alto</span><span>MYS-LRF non materializzato</span></div>
      <Link className="secondary-button" to="/">Torna al quadro iniziale</Link>
    </main>
  );
}
