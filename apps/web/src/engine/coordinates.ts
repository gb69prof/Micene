import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import type { Vec3Record } from '@/state/appStore';

export function scientificToBabylon([x, y, z]: readonly [number, number, number]): Vector3 {
  return new Vector3(x, z, y);
}

export function babylonToScientific(vector: Vector3): Vec3Record {
  return { x: round(vector.x), y: round(vector.z), z: round(vector.y) };
}

function round(value: number): number { return Math.round(value * 100) / 100; }
