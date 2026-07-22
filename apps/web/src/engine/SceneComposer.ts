import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { Scene } from '@babylonjs/core/scene';

type Feature = { id: string; asset: string; selectable: boolean };

const features = {
  terrain: { id: 'P0-PH-PLANE-001', asset: 'ASSET-P0-PH-PLANE-001', selectable: false },
  approach: { id: 'P0-PH-AP01-VOL', asset: 'ASSET-P0-PH-AP01-VOL', selectable: true },
  west: { id: 'P0-PH-LGWB-VOL', asset: 'ASSET-P0-PH-LGWB-VOL', selectable: true },
  east: { id: 'P0-PH-LGEC-VOL', asset: 'ASSET-P0-PH-LGEC-VOL', selectable: true },
  gate: { id: 'P0-PH-LG01-VOL', asset: 'ASSET-P0-PH-LG01-VOL', selectable: true },
  inner: { id: 'P0-PH-IR01-VOL', asset: 'ASSET-P0-PH-IR01-VOL', selectable: true }
} satisfies Record<string, Feature>;

export class SceneComposer {
  readonly featureMeshes = new Map<string, AbstractMesh>();

  compose(scene: Scene): void {
    scene.clearColor = new Color4(0.48, 0.69, 0.82, 1);
    scene.fogMode = Scene.FOGMODE_LINEAR;
    scene.fogColor = new Color3(0.66, 0.77, 0.8);
    scene.fogStart = 38; scene.fogEnd = 72;
    const sky = new HemisphericLight('mediterranean-sky', new Vector3(0.1, 1, 0), scene);
    sky.intensity = 1.05; sky.groundColor = new Color3(0.28, 0.24, 0.18);
    const sun = new DirectionalLight('mediterranean-sun', new Vector3(-0.45, -1, 0.35), scene);
    sun.position = new Vector3(18, 28, -20); sun.intensity = 1.45;
    const shadows = new ShadowGenerator(1024, sun); shadows.useBlurExponentialShadowMap = true; shadows.blurKernel = 12;

    const earth = this.material(scene, 'earth', '#8b7657', '#242019');
    const stone = this.material(scene, 'limestone', '#b9ab91', '#34302a');
    const darkStone = this.material(scene, 'weathered-stone', '#948772', '#292621');
    const vegetation = this.material(scene, 'dry-shrub', '#657049', '#182015');

    const ground = MeshBuilder.CreateGround('rocky-terrain', { width: 60, height: 76, subdivisions: 20 }, scene);
    const positions = ground.getVerticesData('position');
    if (positions) {
      for (let i = 0; i < positions.length; i += 3) {
        const x = positions[i]; const z = positions[i + 2];
        positions[i + 1] = 0.12 * Math.sin(x * 0.7) + 0.1 * Math.cos(z * 0.45) + Math.max(0, z + 8) * 0.035;
      }
      ground.updateVerticesData('position', positions); ground.refreshBoundingInfo();
    }
    ground.material = earth; ground.receiveShadows = true; this.bind(ground, features.terrain);

    const path = MeshBuilder.CreateGround('approach-path', { width: 6.4, height: 34, subdivisions: 8 }, scene);
    path.position = new Vector3(0, 0.18, -10); path.material = darkStone; path.receiveShadows = true; this.bind(path, features.approach);

    this.wall(scene, features.west, -7.4, 4.7, 14.8, stone, shadows, -0.04);
    this.wall(scene, features.east, 7.4, 4.7, 14.8, stone, shadows, 0.04);
    this.wall(scene, features.inner, 0, 5.5, 21, darkStone, shadows, 0, 18);
    this.gate(scene, stone, darkStone, shadows);

    for (let i = 0; i < 34; i += 1) {
      const side = i % 2 ? -1 : 1;
      const shrub = MeshBuilder.CreateSphere(`shrub-${i}`, { diameter: 0.65 + (i % 4) * 0.12, segments: 4 }, scene);
      shrub.scaling.y = 0.55; shrub.position = new Vector3(side * (5.2 + (i % 7) * 1.55), 0.42, -22 + Math.floor(i / 2) * 2.7);
      shrub.material = vegetation; shrub.isPickable = false;
    }
  }

  setSelection(featureId: string | null): void {
    for (const [id, mesh] of this.featureMeshes) {
      mesh.renderOutline = id === featureId; mesh.outlineColor = Color3.FromHexString('#fff0b4'); mesh.outlineWidth = 0.1;
    }
  }

  private wall(scene: Scene, feature: Feature, x: number, y: number, depth: number, material: StandardMaterial, shadows: ShadowGenerator, tilt: number, z = 3): void {
    for (let row = 0; row < 6; row += 1) for (let col = 0; col < 4; col += 1) {
      const width = 2.8 + ((row + col) % 3) * 0.55; const height = 1.15 + ((row * 2 + col) % 3) * 0.2;
      const block = MeshBuilder.CreatePolyhedron(`${feature.asset}-${row}-${col}`, { type: 1, size: 1 }, scene);
      block.scaling = new Vector3(width, height, depth / 8); block.position = new Vector3(x + (col - 1.5) * 2.2 + row * tilt, y - 3.2 + row * 1.25, z + (col % 2) * 0.35);
      block.rotation = new Vector3(0.02 * ((row % 3) - 1), 0.04 * ((col % 3) - 1), 0.015 * ((row + col) % 3 - 1));
      block.material = material; block.receiveShadows = true; shadows.addShadowCaster(block); this.bind(block, feature);
    }
  }

  private gate(scene: Scene, stone: StandardMaterial, reliefStone: StandardMaterial, shadows: ShadowGenerator): void {
    const gate = features.gate;
    const jamb = (name: string, x: number) => {
      const mesh = MeshBuilder.CreateBox(name, { width: 2.5, height: 7.1, depth: 3.2 }, scene);
      mesh.position = new Vector3(x, 3.65, 2); mesh.material = stone; shadows.addShadowCaster(mesh); this.bind(mesh, gate);
    };
    jamb('gate-west-jamb', -3.5); jamb('gate-east-jamb', 3.5);
    const lintel = MeshBuilder.CreateBox('gate-lintel', { width: 9.3, height: 1.55, depth: 3.45 }, scene);
    lintel.position = new Vector3(0, 7.55, 2); lintel.material = stone; shadows.addShadowCaster(lintel); this.bind(lintel, gate);
    const triangle = MeshBuilder.CreateCylinder('relieving-triangle', { height: 1, diameter: 2, tessellation: 3 }, scene);
    triangle.rotation.x = Math.PI / 2; triangle.rotation.z = Math.PI / 2; triangle.scaling = new Vector3(3.4, 1.1, 2.4); triangle.position = new Vector3(0, 9.65, 1.94); triangle.material = reliefStone; this.bind(triangle, gate);
    const column = MeshBuilder.CreateCylinder('relief-column', { height: 2.45, diameterTop: 0.42, diameterBottom: 0.62, tessellation: 12 }, scene);
    column.position = new Vector3(0, 9.75, 0.75); column.material = stone; this.bind(column, gate);
    for (const side of [-1, 1]) {
      const lion = MeshBuilder.CreatePolyhedron(`lion-body-${side}`, { type: 2, size: 1 }, scene);
      lion.scaling = new Vector3(0.75, 1.5, 0.35); lion.rotation.z = side * 0.42; lion.position = new Vector3(side * 1.18, 9.72, 0.8); lion.material = stone; this.bind(lion, gate);
      const neck = MeshBuilder.CreateCylinder(`lion-neck-${side}`, { height: 0.78, diameter: 0.36, tessellation: 8 }, scene);
      neck.position = new Vector3(side * 0.72, 10.65, 0.76); neck.rotation.z = side * 0.34; neck.material = stone; this.bind(neck, gate);
    }
  }

  private material(scene: Scene, name: string, diffuse: string, emissive: string): StandardMaterial {
    const material = new StandardMaterial(name, scene); material.diffuseColor = Color3.FromHexString(diffuse); material.emissiveColor = Color3.FromHexString(emissive).scale(0.18); material.specularColor = new Color3(0.08, 0.08, 0.07); return material;
  }

  private bind(mesh: AbstractMesh, feature: Feature): void {
    mesh.metadata = { featureId: feature.id, assetId: feature.asset, selectable: feature.selectable, placeholder: true };
    mesh.isPickable = feature.selectable; if (feature.selectable && !this.featureMeshes.has(feature.id)) this.featureMeshes.set(feature.id, mesh);
  }
}
