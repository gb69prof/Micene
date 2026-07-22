import { useCallback, useEffect, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { hasWebGL2 } from '@/services/capabilities';
import { loadReleaseManifest, type ManifestResult } from '@/services/releaseManifest';
import { useConnectivity } from '@/services/useConnectivity';
import { useAppStore } from '@/state/appStore';
import type { DiagnosticsSnapshot, MoveDirection } from '@/engine/types';
import { SceneHost, type SceneHostHandle } from './SceneHost';
import { ScientificPanel } from './ScientificPanel';
import { ScientificLegend } from './ScientificLegend';
import { DiagnosticsPanel } from './DiagnosticsPanel';
import { TouchControls } from './TouchControls';

export default function ExplorerPage() {
  const [compatible] = useState(hasWebGL2);
  const [diagnostics, setDiagnostics] = useState<DiagnosticsSnapshot | null>(null);
  const [manifest, setManifest] = useState<ManifestResult>({ state: 'loading', releaseId: null, error: null });
  const [engineError, setEngineError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [minimalUi, setMinimalUi] = useState(false);
  const [openPanel, setOpenPanel] = useState<'science' | 'legend' | 'diagnostics' | null>(null);
  const online = useConnectivity();
  const controlsRef = useRef<SceneHostHandle | null>(null);
  const cameraMode = useAppStore((state) => state.cameraMode);
  const setCameraMode = useAppStore((state) => state.setCameraMode);
  const selectedFeatureId = useAppStore((state) => state.selectedFeatureId);
  const profile = useAppStore((state) => state.graphicProfile);
  const setProfile = useAppStore((state) => state.setGraphicProfile);
  const cameraPose = useAppStore((state) => state.cameraPose);

  const refreshManifest = useCallback(() => { setManifest({ state: 'loading', releaseId: null, error: null }); void loadReleaseManifest().then(setManifest); }, []);
  useEffect(() => { void loadReleaseManifest().then(setManifest); }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('minimal-explorer', minimalUi);
    return () => document.documentElement.classList.remove('minimal-explorer');
  }, [minimalUi]);
  if (!compatible) return <Navigate to="/fallback?reason=webgl2" replace />;
  const move = (direction: MoveDirection) => controlsRef.current?.move(direction);

  return (
    <main className={`explorer-page${started ? ' has-started' : ''}${minimalUi ? ' is-minimal' : ''}`}>
      <h1 className="sr-only">Laboratorio visivo 3D della Porta dei Leoni</h1>
      <section className="viewport-shell" aria-label="Viewport 3D">
          <SceneHost onDiagnostics={setDiagnostics} onEngineError={setEngineError} controlsRef={controlsRef} />
          <div className="atmosphere-overlay" aria-hidden="true" />
          <header className="scene-identity">
            <span className="scene-kicker">ARGOLIDE · AREA P0</span>
            <strong>Porta dei Leoni</strong>
            <span>Stato attuale · modello evocativo M0</span>
          </header>

          <div className="era-switch" aria-label="Stato temporale disponibile">
            <button className="active" aria-pressed="true"><span aria-hidden="true">●</span> Stato attuale</button>
            <button disabled title="Gate P0-MIN chiuso"><span aria-hidden="true">◇</span> 1250 a.C. · non disponibile</button>
          </div>

          {!started && <section className="exploration-intro" aria-labelledby="exploration-title">
            <p>STEP 15 · ESPERIENZA MUSEALE</p>
            <h2 id="exploration-title">Entra nella soglia.</h2>
            <span>L’ambiente che vedrai è una composizione procedurale provvisoria, non un rilievo. Serve a provare esperienza, leggibilità e atmosfera.</span>
            <button className="start-exploration" onClick={() => setStarted(true)}>{cameraPose ? 'Riprendi l’esplorazione' : 'Inizia l’esplorazione'} <b aria-hidden="true">→</b></button>
          </section>}

          <div className="scene-tools" aria-label="Impostazioni visive">
            <label><span className="sr-only">Qualità grafica</span>
              <select aria-label="Qualità grafica" value={profile} onChange={(event) => setProfile(event.target.value as typeof profile)}>
                <option value="light">Qualità leggera</option><option value="balanced">Qualità equilibrata</option><option value="high">Qualità alta</option>
              </select>
            </label>
            <button aria-label="Nascondi quasi tutta l’interfaccia" title="Modalità immersiva" onClick={() => { setMinimalUi(true); setOpenPanel(null); }}>⛶</button>
          </div>

          {started && <TouchControls onMove={move} />}
          <div className="museum-dock" aria-label="Controlli dell'esploratore">
            <div className="mode-switch" role="group" aria-label="Modalità camera">
              <button className={cameraMode === 'first' ? 'active' : ''} aria-pressed={cameraMode === 'first'} onClick={() => setCameraMode('first')}>Prima persona</button>
              <button className={cameraMode === 'third' ? 'active' : ''} aria-pressed={cameraMode === 'third'} onClick={() => setCameraMode('third')}>Terza persona</button>
            </div>
            <button className="dock-icon" aria-label="Ripristina camera" title="Ripristina camera" onClick={() => controlsRef.current?.reset()}>↺</button>
            <span className="dock-spacer" />
            <button className={`dock-icon${openPanel === 'science' ? ' active' : ''}`} aria-label="Apri scheda dell’elemento" aria-pressed={openPanel === 'science'} onClick={() => setOpenPanel(openPanel === 'science' ? null : 'science')}>i</button>
            <button className={`dock-icon${openPanel === 'legend' ? ' active' : ''}`} aria-label="Apri legenda scientifica" aria-pressed={openPanel === 'legend'} onClick={() => setOpenPanel(openPanel === 'legend' ? null : 'legend')}>≡</button>
            <button className={`dock-icon${openPanel === 'diagnostics' ? ' active' : ''}`} aria-label="Apri diagnostica" aria-pressed={openPanel === 'diagnostics'} onClick={() => setOpenPanel(openPanel === 'diagnostics' ? null : 'diagnostics')}>⌁</button>
          </div>

          {minimalUi && <button className="restore-interface" onClick={() => setMinimalUi(false)}>Mostra interfaccia</button>}
          <div className="scene-watermark">Modello visivo provvisorio — non rilievo metrico né ricostruzione archeologica verificata · Gate P0-MIN chiuso</div>
          {engineError && <div className="inline-error" role="alert"><strong>Motore non disponibile</strong><span>{engineError}</span><a href="/fallback">Apri fallback 2D</a></div>}
          {manifest.error && <div className="manifest-warning" role="status"><span>{manifest.error}</span><button onClick={refreshManifest}>Riprova</button></div>}
          {openPanel && <aside className="explorer-drawer" aria-label="Approfondimento">
            <button className="drawer-close" aria-label="Chiudi pannello" onClick={() => setOpenPanel(null)}>×</button>
            {openPanel === 'science' && <ScientificPanel featureId={selectedFeatureId} />}
            {openPanel === 'legend' && <ScientificLegend />}
            {openPanel === 'diagnostics' && <DiagnosticsPanel data={diagnostics} manifest={manifest} online={online} />}
          </aside>}
      </section>
    </main>
  );
}
