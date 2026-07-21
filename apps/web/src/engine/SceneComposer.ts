import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import type { Scene } from '@babylonjs/core/scene';
import { placeholderRegistry, type PlaceholderRecord } from '@/data/placeholderSchema';
import { scientificToBabylon } from './coordinates';

const palette = {
  neutral: Color3.FromHexString('#25394a'), magenta: Color3.FromHexString('#f13da6'),
  cyan: Color3.FromHexString('#34d5e8'), yellow: Color3.FromHexString('#ffd34e')
};

export class SceneComposer {
  readonly featureMeshes = new Map<string, AbstractMesh>();

  compose(scene: Scene): void {
    scene.clearColor = Color4.FromHexString('#07111bff');
    const light = new HemisphericLight('P0-PH-LIGHT-001', new Vector3(0.3, 1, -0.2), scene);
    light.intensity = 0.72;
    for (const record of placeholderRegistry.records) this.createRecord(scene, record);
  }

  setSelection(featureId: string | null): void {
    for (const [id, mesh] of this.featureMeshes) {
      mesh.renderOutline = id === featureId;
      mesh.outlineColor = Color3.White();
      mesh.outlineWidth = 0.08;
    }
  }

  private createRecord(scene: Scene, record: PlaceholderRecord): void {
    if (record.primitiveType === 'grid') return this.createGrid(scene, record);
    if (record.primitiveType === 'axis') return this.createAxes(scene, record);
    let mesh: AbstractMesh;
    if (record.primitiveType === 'ground') mesh = MeshBuilder.CreateGround(record.assetId, { width: 1, height: 1 }, scene);
    else if (record.primitiveType === 'cylinder') mesh = MeshBuilder.CreateCylinder(record.assetId, { height: 1, diameter: 1, tessellation: 12 }, scene);
    else mesh = MeshBuilder.CreateBox(record.assetId, { size: 1 }, scene);
    this.applyTransform(mesh, record);
    const material = new StandardMaterial(`MAT-${record.assetId}`, scene);
    const color = record.materialKey in palette ? palette[record.materialKey as keyof typeof palette] : palette.neutral;
    material.diffuseColor = color; material.emissiveColor = color.scale(0.28); material.alpha = record.primitiveType === 'ground' ? 0.78 : 0.58;
    material.wireframe = record.primitiveType !== 'ground'; material.backFaceCulling = false;
    mesh.material = material;
    this.bind(mesh, record);
  }

  private createGrid(scene: Scene, record: PlaceholderRecord): void {
    const lines: Vector3[][] = [];
    for (let i = -12; i <= 12; i += 1) {
      lines.push([new Vector3(-14, 0.025, i), new Vector3(14, 0.025, i)]);
      lines.push([new Vector3(i, 0.025, -12), new Vector3(i, 0.025, 12)]);
    }
    const mesh = MeshBuilder.CreateLineSystem(record.assetId, { lines }, scene);
    mesh.color = Color3.FromHexString('#365d70'); mesh.alpha = 0.48;
    this.bind(mesh, record);
  }

  private createAxes(scene: Scene, record: PlaceholderRecord): void {
    const length = record.displayTransform.scale[0];
    const x = MeshBuilder.CreateLines(`${record.assetId}-X`, { points: [Vector3.Zero(), new Vector3(length, 0, 0)] }, scene);
    const y = MeshBuilder.CreateLines(`${record.assetId}-Y`, { points: [Vector3.Zero(), new Vector3(0, 0, length)] }, scene);
    const z = MeshBuilder.CreateLines(`${record.assetId}-Z`, { points: [Vector3.Zero(), new Vector3(0, length, 0)] }, scene);
    x.color = Color3.FromHexString('#ff597d'); y.color = Color3.FromHexString('#4ee6b5'); z.color = Color3.FromHexString('#68a8ff');
    for (const mesh of [x, y, z]) this.bind(mesh, record);
  }

  private applyTransform(mesh: AbstractMesh, record: PlaceholderRecord): void {
    mesh.position = scientificToBabylon(record.displayTransform.position);
    const [sx, sy, sz] = record.displayTransform.scale;
    mesh.scaling = new Vector3(sx, sz, sy);
    const [rx, ry, rz] = record.displayTransform.rotation;
    mesh.rotation = new Vector3(rx, rz, ry);
  }

  private bind(mesh: AbstractMesh, record: PlaceholderRecord): void {
    mesh.metadata = { featureId: record.featureId, assetId: record.assetId, selectable: record.selectable, placeholder: true };
    if (record.selectable) this.featureMeshes.set(record.featureId, mesh);
  }
}
