import { Engine } from '@babylonjs/core/Engines/engine';
import { SceneInstrumentation } from '@babylonjs/core/Instrumentation/sceneInstrumentation';
import { Scene } from '@babylonjs/core/scene';
import '@babylonjs/core/Culling/ray';
import type { CameraMode, CameraPoseRecord, GraphicProfile } from '@/state/appStore';
import { CameraRigController } from './CameraRigController';
import { SceneComposer } from './SceneComposer';
import type { EngineAdapter, EngineAdapterCallbacks, MoveDirection } from './types';

export class BabylonEngineAdapter implements EngineAdapter {
  private engine: Engine | null = null;
  private scene: Scene | null = null;
  private composer: SceneComposer | null = null;
  private cameraRig: CameraRigController | null = null;
  private instrumentation: SceneInstrumentation | null = null;
  private diagnosticsTimer: number | null = null;
  private poseTimer: number | null = null;
  private resizeHandler: (() => void) | null = null;
  private pointerHandler: ((event: PointerEvent) => void) | null = null;
  private callbacks: EngineAdapterCallbacks | null = null;
  private selectedFeatureId: string | null = null;
  private profile: GraphicProfile = 'balanced';

  async initialize(canvas: HTMLCanvasElement, callbacks: EngineAdapterCallbacks, initialMode: CameraMode, initialPose: CameraPoseRecord | null, profile: GraphicProfile): Promise<void> {
    this.callbacks = callbacks; this.profile = profile;
    try {
      const engine = new Engine(canvas, true, { preserveDrawingBuffer: false, stencil: true, disableWebGL2Support: false }, true);
      if (engine.webGLVersion < 2) throw new Error('WebGL2 non disponibile.');
      engine.setHardwareScalingLevel(profile === 'light' ? 1.6 : profile === 'balanced' ? 1.25 : 1);
      const scene = new Scene(engine);
      this.engine = engine; this.scene = scene;
      this.instrumentation = new SceneInstrumentation(scene);
      this.composer = new SceneComposer(); this.composer.compose(scene);
      this.cameraRig = new CameraRigController(scene, canvas); this.cameraRig.activate(initialMode, initialPose);
      this.pointerHandler = (event: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        const pickInfo = scene.pick(event.clientX - rect.left, event.clientY - rect.top);
        const mesh = pickInfo?.pickedMesh;
        const featureId = mesh?.metadata?.selectable === true ? String(mesh.metadata.featureId) : null;
        this.setSelection(featureId); callbacks.onSelect(featureId);
      };
      canvas.addEventListener('pointerdown', this.pointerHandler);
      scene.onBeforeRenderObservable.add(() => this.cameraRig?.enforceTechnicalLimits());
      engine.runRenderLoop(() => scene.render());
      this.resizeHandler = () => engine.resize(); window.addEventListener('resize', this.resizeHandler);
      this.poseTimer = window.setInterval(() => callbacks.onPose(this.cameraRig?.readPose() ?? initialPose ?? defaultPose()), 400);
      this.diagnosticsTimer = window.setInterval(() => this.emitDiagnostics(canvas), 500);
      await scene.whenReadyAsync();
    } catch (error) {
      callbacks.onError(error instanceof Error ? error.message : 'Errore sconosciuto del motore 3D.');
      throw error;
    }
  }

  setCameraMode(mode: CameraMode): void { this.cameraRig?.activate(mode); }
  setSelection(featureId: string | null): void { this.selectedFeatureId = featureId; this.composer?.setSelection(featureId); }
  resetCamera(): void { this.cameraRig?.reset(); }
  nudge(direction: MoveDirection): void { this.cameraRig?.nudge(direction); }

  dispose(): void {
    if (this.diagnosticsTimer !== null) window.clearInterval(this.diagnosticsTimer);
    if (this.poseTimer !== null) window.clearInterval(this.poseTimer);
    if (this.resizeHandler) window.removeEventListener('resize', this.resizeHandler);
    const canvas = this.engine?.getRenderingCanvas();
    if (canvas && this.pointerHandler) canvas.removeEventListener('pointerdown', this.pointerHandler);
    this.instrumentation?.dispose(); this.scene?.dispose(); this.engine?.dispose();
    this.engine = null; this.scene = null; this.cameraRig = null; this.composer = null;
  }

  private emitDiagnostics(canvas: HTMLCanvasElement): void {
    if (!this.engine || !this.scene || !this.cameraRig || !this.callbacks) return;
    const fps = Math.max(0, this.engine.getFps());
    this.callbacks.onDiagnostics({
      measuredAt: new Date().toISOString(), fps: round(fps), frameTimeMs: round(fps > 0 ? 1000 / fps : 0),
      drawCalls: Math.round(this.instrumentation?.drawCallsCounter.current ?? 0),
      visibleTriangles: Math.round(this.scene.getActiveIndices() / 3), activeMeshes: this.scene.getActiveMeshes().length,
      materials: this.scene.materials.length, textures: this.scene.textures.length, backend: 'WebGL2',
      canvas: `${canvas.width}×${canvas.height}`, devicePixelRatio: window.devicePixelRatio,
      cameraMode: this.cameraRig.getMode(), cameraPose: this.cameraRig.readPose(),
      selectedFeatureId: this.selectedFeatureId, graphicProfile: this.profile
    });
  }
}

function round(value: number): number { return Math.round(value * 10) / 10; }
function defaultPose(): CameraPoseRecord { return { position: { x: 0, y: -15, z: 6.5 }, target: { x: 0, y: 1.5, z: 1.5 } }; }
