import { beforeEach, describe, expect, it } from 'vitest';
import { useAppStore } from './appStore';

describe('store serializzabile', () => {
  beforeEach(() => {
    localStorage.clear();
    useAppStore.setState({ cameraMode: 'third', selectedFeatureId: null, cameraPose: null, graphicProfile: 'balanced', language: 'it' });
  });

  it('conserva modalità, posa e selezione come record semplici', () => {
    const pose = { position: { x: 1, y: 2, z: 3 }, target: { x: 0, y: 0, z: 1 } };
    useAppStore.getState().setCameraMode('first');
    useAppStore.getState().selectFeature('P0-PH-LG01-VOL');
    useAppStore.getState().setCameraPose(pose);
    const state = useAppStore.getState();
    expect(state.cameraMode).toBe('first');
    expect(state.selectedFeatureId).toBe('P0-PH-LG01-VOL');
    expect(JSON.parse(JSON.stringify(state.cameraPose))).toEqual(pose);
    expect(JSON.stringify(state.cameraPose)).not.toContain('Babylon');
  });
});
