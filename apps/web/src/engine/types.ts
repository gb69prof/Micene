import type { CameraMode, CameraPoseRecord, GraphicProfile } from '@/state/appStore';

export interface DiagnosticsSnapshot {
  measuredAt: string;
  fps: number;
  frameTimeMs: number;
  drawCalls: number;
  visibleTriangles: number;
  activeMeshes: number;
  materials: number;
  textures: number;
  backend: 'WebGL2';
  canvas: string;
  devicePixelRatio: number;
  cameraMode: CameraMode;
  cameraPose: CameraPoseRecord;
  selectedFeatureId: string | null;
  graphicProfile: GraphicProfile;
}

export type MoveDirection = 'forward' | 'back' | 'left' | 'right';

export interface EngineAdapterCallbacks {
  onSelect: (featureId: string | null) => void;
  onPose: (pose: CameraPoseRecord) => void;
  onDiagnostics: (snapshot: DiagnosticsSnapshot) => void;
  onError: (message: string) => void;
}

export interface EngineAdapter {
  initialize(canvas: HTMLCanvasElement, callbacks: EngineAdapterCallbacks, initialMode: CameraMode, initialPose: CameraPoseRecord | null, profile: GraphicProfile): Promise<void>;
  setCameraMode(mode: CameraMode): void;
  setSelection(featureId: string | null): void;
  resetCamera(): void;
  nudge(direction: MoveDirection): void;
  dispose(): void;
}
