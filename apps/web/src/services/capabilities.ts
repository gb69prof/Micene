export function hasWebGL2(): boolean {
  if (new URLSearchParams(window.location.search).get('forceFallback') === '1') return false;
  try {
    const canvas = document.createElement('canvas');
    return canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) instanceof WebGL2RenderingContext;
  } catch {
    return false;
  }
}
