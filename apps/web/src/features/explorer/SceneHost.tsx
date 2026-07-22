import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import { BabylonEngineAdapter } from '@/engine/BabylonEngineAdapter';
import type { DiagnosticsSnapshot, MoveDirection } from '@/engine/types';
import { useAppStore } from '@/state/appStore';

export interface SceneHostHandle { reset: () => void; move: (direction: MoveDirection) => void }

export function SceneHost({ onDiagnostics, onEngineError, controlsRef }: {
  onDiagnostics: (data: DiagnosticsSnapshot) => void;
  onEngineError: (message: string) => void;
  controlsRef: MutableRefObject<SceneHostHandle | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const adapterRef = useRef<BabylonEngineAdapter | null>(null);
  const [ready, setReady] = useState(false);
  const cameraMode = useAppStore((state) => state.cameraMode);
  const selectedFeatureId = useAppStore((state) => state.selectedFeatureId);
  const cameraPose = useAppStore((state) => state.cameraPose);
  const graphicProfile = useAppStore((state) => state.graphicProfile);
  const selectFeature = useAppStore((state) => state.selectFeature);
  const setCameraPose = useAppStore((state) => state.setCameraPose);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const adapter = new BabylonEngineAdapter(); adapterRef.current = adapter;
    controlsRef.current = { reset: () => adapter.resetCamera(), move: (direction) => adapter.nudge(direction) };
    void adapter.initialize(canvas, {
      onSelect: selectFeature, onPose: setCameraPose, onDiagnostics,
      onError: onEngineError
    }, cameraMode, cameraPose, graphicProfile).then(() => setReady(true)).catch(() => setReady(false));
    return () => { controlsRef.current = null; adapter.dispose(); adapterRef.current = null; };
    // Initial state is intentionally captured once; later changes use dedicated effects.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (ready) adapterRef.current?.setCameraMode(cameraMode); }, [cameraMode, ready]);
  useEffect(() => { if (ready) adapterRef.current?.setSelection(selectedFeatureId); }, [selectedFeatureId, ready]);
  useEffect(() => { if (ready) adapterRef.current?.setGraphicProfile(graphicProfile); }, [graphicProfile, ready]);

  return <canvas ref={canvasRef} className="scene-canvas" aria-label="Scena 3D procedurale provvisoria della Porta dei Leoni" tabIndex={0} />;
}
