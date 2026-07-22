export type ManifestState = 'loading' | 'ready' | 'degraded' | 'offline';

export interface ManifestResult {
  state: ManifestState;
  releaseId: string | null;
  error: string | null;
}

export async function loadReleaseManifest(): Promise<ManifestResult> {
  const params = new URLSearchParams(window.location.search);
  const file = params.get('manifest') === 'missing' ? 'missing-release-step15.json' : 'release-step15.json';
  const path = `${import.meta.env.BASE_URL}${file}`;
  try {
    const response = await fetch(path, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const manifest = await response.json() as { releaseId?: string; containsInstitutionalAssets?: boolean; containsPersonalData?: boolean };
    if (manifest.containsInstitutionalAssets || manifest.containsPersonalData) throw new Error('Manifest non ammesso dalla politica pubblica.');
    return { state: 'ready', releaseId: manifest.releaseId ?? null, error: null };
  } catch (error) {
    const offline = !navigator.onLine;
    return {
      state: offline ? 'offline' : 'degraded',
      releaseId: 'STEP15-INTERNAL-FALLBACK',
      error: `Manifest esterno non disponibile: ${error instanceof Error ? error.message : 'errore sconosciuto'}. Il registro interno validato resta operativo.`
    };
  }
}
