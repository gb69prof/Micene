import type { DiagnosticsSnapshot } from '@/engine/types';
import type { ManifestResult } from '@/services/releaseManifest';

export function DiagnosticsPanel({ data, manifest, online }: { data: DiagnosticsSnapshot | null; manifest: ManifestResult; online: boolean }) {
  return (
    <section className="panel diagnostics-panel">
      <div className="panel-heading"><span>DIAGNOSTICA MISURATA</span><b>LIVE</b></div>
      <div className="diagnostic-grid">
        <Metric label="FPS" value={data ? data.fps.toFixed(1) : '—'} kind="MISURATO" />
        <Metric label="Frame time" value={data ? `${data.frameTimeMs.toFixed(1)} ms` : '—'} kind="MISURATO" />
        <Metric label="Draw call" value={data ? String(data.drawCalls) : '—'} kind="MISURATO" />
        <Metric label="Triangoli visibili" value={data ? String(data.visibleTriangles) : '—'} kind="MISURATO" />
        <Metric label="Backend" value={data?.backend ?? '—'} kind="RILEVATO" />
        <Metric label="Canvas / DPR" value={data ? `${data.canvas} / ${data.devicePixelRatio}` : '—'} kind="RILEVATO" />
        <Metric label="Camera" value={data?.cameraMode ?? '—'} kind="STATO" />
        <Metric label="Selezione" value={data?.selectedFeatureId ?? 'nessuna'} kind="STATO" />
        <Metric label="Connessione" value={online ? 'online' : 'offline'} kind="STATO" />
        <Metric label="Cache/manifest" value={`${manifest.state} · ${manifest.releaseId ?? '—'}`} kind="STATO" />
        <Metric label="Profilo" value={data?.graphicProfile ?? 'balanced'} kind="STATO" />
        <Metric label="Target desktop" value="60 FPS" kind="TARGET · NON RISULTATO" />
      </div>
      {data && <p className="camera-readout">Posizione M0/DEBUG_DISPLAY: X {data.cameraPose.position.x} · Y {data.cameraPose.position.y} · Z {data.cameraPose.position.z}</p>}
    </section>
  );
}

function Metric({ label, value, kind }: { label: string; value: string; kind: string }) {
  return <div className="metric"><span>{label}</span><strong>{value}</strong><small>{kind}</small></div>;
}
