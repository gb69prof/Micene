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
  const online = useConnectivity();
  const controlsRef = useRef<SceneHostHandle | null>(null);
  const cameraMode = useAppStore((state) => state.cameraMode);
  const setCameraMode = useAppStore((state) => state.setCameraMode);
  const selectedFeatureId = useAppStore((state) => state.selectedFeatureId);
  const profile = useAppStore((state) => state.graphicProfile);
  const setProfile = useAppStore((state) => state.setGraphicProfile);

  const refreshManifest = useCallback(() => { setManifest({ state: 'loading', releaseId: null, error: null }); void loadReleaseManifest().then(setManifest); }, []);
  useEffect(() => { void loadReleaseManifest().then(setManifest); }, []);
  if (!compatible) return <Navigate to="/fallback?reason=webgl2" replace />;
  const move = (direction: MoveDirection) => controlsRef.current?.move(direction);

  return (
    <main className="explorer-page">
      <h1 className="sr-only">Esploratore 3D diagnostico PLACEHOLDER</h1>
      <div className="explorer-toolbar" aria-label="Controlli dell'esploratore">
        <div className="mode-switch" role="group" aria-label="Modalità camera">
          <button className={cameraMode === 'first' ? 'active' : ''} aria-pressed={cameraMode === 'first'} onClick={() => setCameraMode('first')}>Prima persona</button>
          <button className={cameraMode === 'third' ? 'active' : ''} aria-pressed={cameraMode === 'third'} onClick={() => setCameraMode('third')}>Terza persona</button>
        </div>
        <button onClick={() => controlsRef.current?.reset()}>Reset camera</button>
        <label>Profilo
          <select value={profile} onChange={(event) => setProfile(event.target.value as typeof profile)}>
            <option value="light">Leggero</option><option value="balanced">Equilibrato</option><option value="high">Alto</option>
          </select>
        </label>
        <div className="axis-key" aria-label="Assi della scena"><span className="axis-x">X Est</span><span className="axis-y">Y Nord</span><span className="axis-z">Z alto</span></div>
      </div>
      <div className="explorer-layout">
        <section className="viewport-shell" aria-label="Viewport 3D">
          <SceneHost onDiagnostics={setDiagnostics} onEngineError={setEngineError} controlsRef={controlsRef} />
          <div className="scene-badge"><strong>LG01</strong><span>origine semantica</span><b>M0 / coordinate metriche non determinate</b></div>
          <div className="scene-watermark">PROTOTIPO TECNICO · PLACEHOLDER · NON È UNA RICOSTRUZIONE DI MICENE</div>
          <TouchControls onMove={move} />
          <div className="control-help">WASD / frecce · trascina per ruotare · rotella o pizzica per zoom</div>
          {engineError && <div className="inline-error" role="alert"><strong>Motore non disponibile</strong><span>{engineError}</span><a href="/fallback">Apri fallback 2D</a></div>}
          {manifest.error && <div className="manifest-warning" role="status"><span>{manifest.error}</span><button onClick={refreshManifest}>Riprova</button></div>}
        </section>
        <aside className="explorer-sidebar">
          <ScientificPanel featureId={selectedFeatureId} />
          <ScientificLegend />
          <DiagnosticsPanel data={diagnostics} manifest={manifest} online={online} />
        </aside>
      </div>
    </main>
  );
}
