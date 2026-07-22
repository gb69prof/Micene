import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { UniversalCamera } from '@babylonjs/core/Cameras/universalCamera';
import type { Camera } from '@babylonjs/core/Cameras/camera';
import type { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { CameraMode, CameraPoseRecord } from '@/state/appStore';
import { babylonToScientific, scientificToBabylon } from './coordinates';
import type { MoveDirection } from './types';

const DEFAULT_POSITION = new Vector3(0, 5.3, -24);
const DEFAULT_TARGET = new Vector3(0, 5.4, 2);

export class CameraRigController {
  private camera: Camera | null = null;
  private mode: CameraMode = 'third';

  constructor(private readonly scene: Scene, private readonly canvas: HTMLCanvasElement) {}

  activate(mode: CameraMode, pose?: CameraPoseRecord | null): void {
    const current = pose ? {
      position: scientificToBabylon([pose.position.x, pose.position.y, pose.position.z]),
      target: scientificToBabylon([pose.target.x, pose.target.y, pose.target.z])
    } : this.readBabylonPose();
    this.camera?.detachControl();
    this.camera?.dispose();
    this.mode = mode;
    const position = current?.position ?? DEFAULT_POSITION.clone();
    const target = current?.target ?? DEFAULT_TARGET.clone();

    if (mode === 'first') {
      const camera = new UniversalCamera('camera-first', position, this.scene);
      camera.setTarget(target);
      camera.speed = 0.26;
      camera.angularSensibility = 2400;
      camera.minZ = 0.1;
      camera.keysUp = [38, 87]; camera.keysDown = [40, 83];
      camera.keysLeft = [37, 65]; camera.keysRight = [39, 68];
      camera.attachControl(this.canvas, true);
      this.canvas.tabIndex = 0;
      this.camera = camera;
    } else {
      const offset = position.subtract(target);
      const radius = Math.max(4, offset.length());
      const alpha = Math.atan2(offset.z, offset.x);
      const beta = Math.acos(Math.min(0.98, Math.max(-0.98, offset.y / radius)));
      const camera = new ArcRotateCamera('camera-third', alpha, beta, radius, target, this.scene);
      camera.lowerRadiusLimit = 5; camera.upperRadiusLimit = 42;
      camera.lowerBetaLimit = 0.2; camera.upperBetaLimit = Math.PI / 2.05;
      camera.wheelPrecision = 40; camera.pinchPrecision = 80;
      camera.panningSensibility = 80; camera.minZ = 0.1;
      camera.attachControl(this.canvas, true);
      this.canvas.tabIndex = 0;
      this.camera = camera;
    }
    this.scene.activeCamera = this.camera;
  }

  getMode(): CameraMode { return this.mode; }

  reset(): void {
    this.activate(this.mode, {
      position: babylonToScientific(DEFAULT_POSITION),
      target: babylonToScientific(DEFAULT_TARGET)
    });
  }

  nudge(direction: MoveDirection): void {
    if (!this.camera) return;
    const pose = this.readBabylonPose();
    if (!pose) return;
    const forward = pose.target.subtract(pose.position); forward.y = 0;
    if (forward.lengthSquared() < 0.001) forward.z = 1;
    forward.normalize();
    const right = new Vector3(forward.z, 0, -forward.x);
    const delta = direction === 'forward' ? forward : direction === 'back' ? forward.scale(-1) : direction === 'right' ? right : right.scale(-1);
    pose.position.addInPlace(delta.scale(0.7));
    pose.target.addInPlace(delta.scale(0.7));
    this.applyBabylonPose(pose.position, pose.target);
  }

  enforceTechnicalLimits(): void {
    if (!this.camera) return;
    const position = this.camera.position;
    position.x = Math.max(-25, Math.min(25, position.x));
    position.z = Math.max(-34, Math.min(30, position.z));
    position.y = Math.max(0.8, Math.min(18, position.y));
  }

  readPose(): CameraPoseRecord {
    const pose = this.readBabylonPose() ?? { position: DEFAULT_POSITION, target: DEFAULT_TARGET };
    return { position: babylonToScientific(pose.position), target: babylonToScientific(pose.target) };
  }

  private readBabylonPose(): { position: Vector3; target: Vector3 } | null {
    if (!this.camera) return null;
    if (this.camera instanceof ArcRotateCamera) return { position: this.camera.position.clone(), target: this.camera.target.clone() };
    if (this.camera instanceof UniversalCamera) return { position: this.camera.position.clone(), target: this.camera.getTarget().clone() };
    return null;
  }

  private applyBabylonPose(position: Vector3, target: Vector3): void {
    if (!this.camera) return;
    if (this.camera instanceof ArcRotateCamera) {
      this.camera.setTarget(target);
      const offset = position.subtract(target);
      this.camera.radius = Math.max(4, offset.length());
      this.camera.alpha = Math.atan2(offset.z, offset.x);
      this.camera.beta = Math.acos(Math.min(0.98, Math.max(-0.98, offset.y / this.camera.radius)));
    } else if (this.camera instanceof UniversalCamera) {
      this.camera.position.copyFrom(position); this.camera.setTarget(target);
    }
  }
}
