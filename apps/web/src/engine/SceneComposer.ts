import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { DynamicTexture } from '@babylonjs/core/Materials/Textures/dynamicTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { ImageProcessingConfiguration } from '@babylonjs/core/Materials/imageProcessingConfiguration';
import { Scene } from '@babylonjs/core/scene';
import type { GraphicProfile } from '@/state/appStore';

type Feature = { id: string; asset: string; selectable: boolean };
type DetailLevel = 'base' | 'balanced' | 'high';

const features = {
  terrain: { id: 'P0-PH-PLANE-001', asset: 'ASSET-P0-PH-PLANE-001', selectable: false },
  approach: { id: 'P0-PH-AP01-VOL', asset: 'ASSET-P0-PH-AP01-VOL', selectable: true },
  west: { id: 'P0-PH-LGWB-VOL', asset: 'ASSET-P0-PH-LGWB-VOL', selectable: true },
  east: { id: 'P0-PH-LGEC-VOL', asset: 'ASSET-P0-PH-LGEC-VOL', selectable: true },
  gate: { id: 'P0-PH-LG01-VOL', asset: 'ASSET-P0-PH-LG01-VOL', selectable: true },
  inner: { id: 'P0-PH-IR01-VOL', asset: 'ASSET-P0-PH-IR01-VOL', selectable: true }
} satisfies Record<string, Feature>;

export class SceneComposer {
  readonly featureMeshes = new Map<string, AbstractMesh[]>();
  private readonly detailMeshes: Array<{ mesh: AbstractMesh; level: DetailLevel }> = [];
  private profile: GraphicProfile = 'balanced';

  compose(scene: Scene, profile: GraphicProfile): void {
    this.profile = profile;
    this.configureAtmosphere(scene);
    const shadowMapSize = profile === 'light' ? 512 : profile === 'balanced' ? 1024 : 2048;
    const skyLight = new HemisphericLight('mediterranean-sky', new Vector3(-0.15, 1, -0.1), scene);
    skyLight.intensity = 1.28;
    skyLight.groundColor = Color3.FromHexString('#766751');
    const sun = new DirectionalLight('mediterranean-sun', new Vector3(-0.42, -1, 0.32), scene);
    sun.position = new Vector3(26, 32, -24);
    sun.intensity = 2.35;
    const shadows = new ShadowGenerator(shadowMapSize, sun);
    shadows.useBlurExponentialShadowMap = true;
    shadows.blurKernel = profile === 'light' ? 8 : 18;
    shadows.bias = 0.0008;

    const stoneTexture = this.createStoneTexture(scene, profile === 'high' ? 384 : 256);
    const stoneNormal = this.createNormalTexture(scene, profile === 'light' ? 128 : 256);
    const earthTexture = this.createEarthTexture(scene, profile === 'high' ? 384 : 256);
    const stoneMaterials = ['#c6b492', '#d2bf9d', '#b7a587', '#dbc8a8', '#aa997f'].map((color, index) =>
      this.material(scene, `stone-${index}`, color, stoneTexture, stoneNormal, 0.42)
    );
    const reliefStone = this.material(scene, 'relief-stone', '#d7c5a6', stoneTexture, stoneNormal, 0.3);
    const earth = this.material(scene, 'sun-baked-earth', '#a57d55', earthTexture, stoneNormal, 0.22);
    const path = this.material(scene, 'approach-stone', '#aa8d69', earthTexture, stoneNormal, 0.35);
    const vegetation = this.flatMaterial(scene, 'dry-vegetation', '#646547');

    this.createGround(scene, earth, path);
    this.createApproachWalls(scene, stoneMaterials, shadows);
    this.createGate(scene, stoneMaterials, reliefStone, shadows);
    this.createInnerDepth(scene, stoneMaterials, shadows);
    this.createGroundDetails(scene, stoneMaterials, vegetation, shadows);
    this.setGraphicProfile(profile);
  }

  setGraphicProfile(profile: GraphicProfile): void {
    this.profile = profile;
    for (const { mesh, level } of this.detailMeshes) {
      mesh.setEnabled(level === 'base' || (level === 'balanced' && profile !== 'light') || (level === 'high' && profile === 'high'));
    }
  }

  setSelection(featureId: string | null): void {
    for (const [id, meshes] of this.featureMeshes) {
      for (const mesh of meshes) {
        mesh.renderOutline = id === featureId;
        mesh.outlineColor = Color3.FromHexString('#e7c27d');
        mesh.outlineWidth = 0.055;
      }
    }
  }

  private configureAtmosphere(scene: Scene): void {
    scene.clearColor = Color4.FromHexString('#8fb3c7ff');
    scene.ambientColor = Color3.FromHexString('#4c4034');
    scene.fogMode = Scene.FOGMODE_LINEAR;
    scene.fogColor = Color3.FromHexString('#a9b9b8');
    scene.fogStart = 42;
    scene.fogEnd = 88;
    const processing = scene.imageProcessingConfiguration;
    processing.toneMappingEnabled = true;
    processing.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
    processing.exposure = 1.26;
    processing.contrast = 1.12;
    processing.vignetteEnabled = true;
    processing.vignetteWeight = 1.35;
    processing.vignetteColor = Color4.FromHexString('#2b2118ff');
    processing.vignetteBlendMode = ImageProcessingConfiguration.VIGNETTEMODE_MULTIPLY;

    const skyTexture = new DynamicTexture('sky-gradient', { width: 32, height: 256 }, scene, false);
    const context = skyTexture.getContext();
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, '#5d91b5');
    gradient.addColorStop(0.48, '#a9c8d5');
    gradient.addColorStop(0.76, '#d7c7aa');
    gradient.addColorStop(1, '#8f7b5e');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 32, 256);
    skyTexture.update(false);
    const skyMaterial = new StandardMaterial('sky-dome-material', scene);
    skyMaterial.disableLighting = true;
    skyMaterial.backFaceCulling = false;
    skyMaterial.emissiveTexture = skyTexture;
    skyMaterial.emissiveColor = Color3.White();
    const sky = MeshBuilder.CreateSphere('sky-dome', { diameter: 170, segments: 16 }, scene);
    sky.material = skyMaterial;
    sky.isPickable = false;
    sky.infiniteDistance = true;
  }

  private createGround(scene: Scene, earth: StandardMaterial, pathMaterial: StandardMaterial): void {
    const ground = MeshBuilder.CreateGround('rocky-terrain', { width: 72, height: 92, subdivisions: 32, updatable: true }, scene);
    this.deformGround(ground, (x, z) => 0.1 * Math.sin(x * 0.47) + 0.08 * Math.cos(z * 0.34) + Math.max(0, z + 7) * 0.025);
    ground.material = earth;
    ground.receiveShadows = true;
    this.bind(ground, features.terrain);

    const path = MeshBuilder.CreateGround('approach-path', { width: 8.2, height: 40, subdivisions: 22, updatable: true }, scene);
    path.position = new Vector3(0, 0.18, -10);
    this.deformGround(path, (x, z) => 0.035 * Math.sin(x * 2.1 + z * 0.7) + Math.max(0, z + 13) * 0.018);
    path.material = pathMaterial;
    path.receiveShadows = true;
    this.bind(path, features.approach);
  }

  private createApproachWalls(scene: Scene, materials: StandardMaterial[], shadows: ShadowGenerator): void {
    const west = [...this.sideWall(scene, features.west, -7.9, materials, -1), ...this.frontWall(scene, features.west, -1, materials)];
    const east = [...this.sideWall(scene, features.east, 7.9, materials, 1), ...this.frontWall(scene, features.east, 1, materials)];
    this.mergeFeature(west, features.west, 'west-approach-wall', shadows);
    this.mergeFeature(east, features.east, 'east-approach-wall', shadows);
  }

  private sideWall(scene: Scene, feature: Feature, x: number, materials: StandardMaterial[], side: number): AbstractMesh[] {
    const blocks: AbstractMesh[] = [];
    for (let row = 0; row < 6; row += 1) {
      for (let column = 0; column < 7; column += 1) {
        const seed = row * 17 + column * 11 + (side > 0 ? 5 : 0);
        const width = 3.2 + this.noise(seed) * 1.05;
        const height = 1.05 + this.noise(seed + 2) * 0.48;
        const depth = 2.45 + this.noise(seed + 4) * 0.55;
        const block = MeshBuilder.CreateBox(`${feature.asset}-side-${row}-${column}`, { width, height, depth }, scene);
        block.position = new Vector3(
          x + side * (row * 0.14 + this.noise(seed + 7) * 0.2),
          0.63 + row * 1.18 + this.noise(seed + 3) * 0.08,
          -5.7 + column * 2.22 + (row % 2) * 0.48
        );
        block.rotation = new Vector3((this.noise(seed + 8) - 0.5) * 0.025, (this.noise(seed + 9) - 0.5) * 0.055, (this.noise(seed + 10) - 0.5) * 0.025);
        block.material = materials[seed % materials.length];
        block.receiveShadows = true;
        blocks.push(block);
      }
    }
    return blocks;
  }

  private frontWall(scene: Scene, feature: Feature, side: number, materials: StandardMaterial[]): AbstractMesh[] {
    const blocks: AbstractMesh[] = [];
    for (let row = 0; row < 6; row += 1) {
      for (let column = 0; column < 3; column += 1) {
        const seed = 180 + row * 13 + column * 7 + (side > 0 ? 3 : 0);
        const block = MeshBuilder.CreateBox(`${feature.asset}-front-${row}-${column}`, {
          width: 2.7 + this.noise(seed) * 0.8,
          height: 1.05 + this.noise(seed + 1) * 0.42,
          depth: 3.15 + this.noise(seed + 2) * 0.35
        }, scene);
        block.position = new Vector3(side * (5.15 + column * 2.5), 0.65 + row * 1.2, 8.15 + (row % 2) * 0.18);
        block.rotation.z = (this.noise(seed + 4) - 0.5) * 0.025;
        block.material = materials[seed % materials.length];
        block.receiveShadows = true;
        blocks.push(block);
      }
    }
    return blocks;
  }

  private createGate(scene: Scene, materials: StandardMaterial[], relief: StandardMaterial, shadows: ShadowGenerator): void {
    const gate = features.gate;
    const parts: AbstractMesh[] = [];
    for (const side of [-1, 1]) {
      for (let row = 0; row < 3; row += 1) {
        const block = MeshBuilder.CreateBox(`gate-jamb-${side}-${row}`, { width: 2.45, height: 2.28, depth: 3.45 }, scene);
        block.position = new Vector3(side * 3.45, 1.18 + row * 2.24, 7.8);
        block.rotation.z = side * (row - 1) * 0.006;
        block.material = materials[(row + (side > 0 ? 2 : 0)) % materials.length];
        block.receiveShadows = true;
        parts.push(block);
      }
    }
    const lintel = MeshBuilder.CreateBox('gate-lintel', { width: 9.2, height: 1.48, depth: 3.65 }, scene);
    lintel.position = new Vector3(0, 7.45, 7.8);
    lintel.material = materials[1];
    lintel.receiveShadows = true;
    parts.push(lintel);

    const triangle = MeshBuilder.CreateCylinder('relieving-triangle', { height: 0.9, diameter: 2, tessellation: 3 }, scene);
    triangle.rotation.x = Math.PI / 2;
    triangle.rotation.z = Math.PI / 2;
    triangle.scaling = new Vector3(3.2, 1, 2.35);
    triangle.position = new Vector3(0, 9.48, 7.22);
    triangle.material = relief;
    parts.push(triangle);
    const column = MeshBuilder.CreateCylinder('relief-column', { height: 2.3, diameterTop: 0.38, diameterBottom: 0.58, tessellation: 12 }, scene);
    column.position = new Vector3(0, 9.55, 6.68);
    column.material = materials[3];
    parts.push(column);
    for (const side of [-1, 1]) {
      const body = MeshBuilder.CreatePolyhedron(`lion-abstraction-${side}`, { type: 2, size: 1 }, scene);
      body.scaling = new Vector3(0.72, 1.42, 0.3);
      body.rotation.z = side * 0.44;
      body.position = new Vector3(side * 1.12, 9.55, 6.72);
      body.material = relief;
      parts.push(body);
    }
    this.mergeFeature(parts, gate, 'lion-gate-provisional', shadows);
  }

  private createInnerDepth(scene: Scene, materials: StandardMaterial[], shadows: ShadowGenerator): void {
    const blocks: AbstractMesh[] = [];
    for (let row = 0; row < 5; row += 1) {
      for (let column = 0; column < 8; column += 1) {
        const seed = 310 + row * 13 + column;
        const block = MeshBuilder.CreateBox(`${features.inner.asset}-${row}-${column}`, { width: 2.9, height: 1.06, depth: 2.35 }, scene);
        block.position = new Vector3(-10.2 + column * 2.9 + (row % 2) * 0.4, 0.6 + row * 1.08, 21.5);
        block.rotation.y = (this.noise(seed) - 0.5) * 0.04;
        block.material = materials[(seed + 2) % materials.length];
        block.receiveShadows = true;
        blocks.push(block);
      }
    }
    this.mergeFeature(blocks, features.inner, 'inner-depth-wall', shadows);
  }

  private createGroundDetails(scene: Scene, stones: StandardMaterial[], vegetation: StandardMaterial, shadows: ShadowGenerator): void {
    const stoneGroups: Record<DetailLevel, AbstractMesh[]> = { base: [], balanced: [], high: [] };
    const shrubGroups: Record<DetailLevel, AbstractMesh[]> = { base: [], balanced: [], high: [] };
    for (let index = 0; index < 52; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const seed = 500 + index * 7;
      const stone = MeshBuilder.CreatePolyhedron(`ground-stone-${index}`, { type: 1, size: 0.24 + this.noise(seed) * 0.45 }, scene);
      stone.scaling.y = 0.42 + this.noise(seed + 1) * 0.35;
      stone.position = new Vector3(side * (4.7 + this.noise(seed + 2) * 11), 0.3, -24 + this.noise(seed + 3) * 43);
      stone.rotation = new Vector3(this.noise(seed + 4), this.noise(seed + 5) * Math.PI, this.noise(seed + 6));
      stone.material = stones[index % stones.length];
      stone.isPickable = false;
      const level: DetailLevel = index < 20 ? 'base' : index < 38 ? 'balanced' : 'high';
      stoneGroups[level].push(stone);
    }
    for (let index = 0; index < 30; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const seed = 900 + index * 5;
      const shrub = MeshBuilder.CreateCylinder(`shrub-${index}`, { height: 0.75 + this.noise(seed) * 0.65, diameterTop: 0.08, diameterBottom: 0.7 + this.noise(seed + 3) * 0.65, tessellation: 5 }, scene);
      shrub.scaling = new Vector3(1, 1, 0.72);
      shrub.position = new Vector3(side * (6 + this.noise(seed + 1) * 9.5), 0.44, -19 + this.noise(seed + 2) * 36);
      shrub.material = vegetation;
      shrub.isPickable = false;
      const level: DetailLevel = index < 12 ? 'base' : index < 23 ? 'balanced' : 'high';
      shrubGroups[level].push(shrub);
    }
    for (const level of ['base', 'balanced', 'high'] as const) {
      this.mergeDetail(stoneGroups[level], `ground-stones-${level}`, level, shadows, true);
      this.mergeDetail(shrubGroups[level], `dry-shrubs-${level}`, level, shadows, false);
    }
  }

  private mergeFeature(meshes: AbstractMesh[], feature: Feature, name: string, shadows: ShadowGenerator): void {
    const merged = Mesh.MergeMeshes(meshes as Mesh[], true, true, undefined, true, true);
    if (!merged) return;
    merged.name = name;
    merged.receiveShadows = true;
    shadows.addShadowCaster(merged);
    this.bind(merged, feature);
  }

  private mergeDetail(meshes: AbstractMesh[], name: string, level: DetailLevel, shadows: ShadowGenerator, castsShadow: boolean): void {
    const merged = Mesh.MergeMeshes(meshes as Mesh[], true, true, undefined, true, true);
    if (!merged) return;
    merged.name = name;
    merged.isPickable = false;
    merged.receiveShadows = true;
    if (castsShadow) shadows.addShadowCaster(merged);
    this.detailMeshes.push({ mesh: merged, level });
  }

  private deformGround(mesh: AbstractMesh, elevation: (x: number, z: number) => number): void {
    const positions = mesh.getVerticesData('position');
    const indices = mesh.getIndices();
    if (!positions || !indices) return;
    for (let index = 0; index < positions.length; index += 3) positions[index + 1] = elevation(positions[index], positions[index + 2]);
    const normals = new Array<number>(positions.length).fill(0);
    VertexData.ComputeNormals(positions, indices, normals);
    mesh.updateVerticesData('position', positions);
    mesh.updateVerticesData('normal', normals);
    mesh.refreshBoundingInfo({});
  }

  private createStoneTexture(scene: Scene, size: number): DynamicTexture {
    const texture = new DynamicTexture('procedural-stone-color', { width: size, height: size }, scene, false);
    const context = texture.getContext();
    context.fillStyle = '#c7b79c';
    context.fillRect(0, 0, size, size);
    for (let index = 0; index < 460; index += 1) {
      const value = 95 + Math.floor(this.noise(index * 9) * 105);
      context.fillStyle = `rgba(${value}, ${Math.max(48, value - 10)}, ${Math.max(38, value - 24)}, ${0.035 + this.noise(index * 13) * 0.1})`;
      const radius = 1 + this.noise(index * 17) * 8;
      context.beginPath();
      context.arc(this.noise(index * 23) * size, this.noise(index * 29) * size, radius, 0, Math.PI * 2);
      context.fill();
    }
    context.strokeStyle = 'rgba(54, 42, 30, .14)';
    context.lineWidth = 1;
    for (let index = 0; index < 24; index += 1) {
      const y = this.noise(index * 31) * size;
      context.beginPath();
      context.moveTo(0, y);
      context.lineTo(size, y + (this.noise(index * 37) - 0.5) * 18);
      context.stroke();
    }
    texture.wrapU = Texture.WRAP_ADDRESSMODE;
    texture.wrapV = Texture.WRAP_ADDRESSMODE;
    texture.uScale = 1.8;
    texture.vScale = 1.8;
    texture.update(false);
    return texture;
  }

  private createEarthTexture(scene: Scene, size: number): DynamicTexture {
    const texture = new DynamicTexture('procedural-earth-color', { width: size, height: size }, scene, false);
    const context = texture.getContext();
    context.fillStyle = '#9b7956';
    context.fillRect(0, 0, size, size);
    for (let index = 0; index < 620; index += 1) {
      const light = 80 + Math.floor(this.noise(index * 11) * 80);
      context.fillStyle = `rgba(${light + 22}, ${light}, ${Math.max(45, light - 27)}, ${0.04 + this.noise(index * 19) * 0.12})`;
      const radius = 0.5 + this.noise(index * 13) * 3.5;
      context.beginPath();
      context.arc(this.noise(index * 17) * size, this.noise(index * 23) * size, radius, 0, Math.PI * 2);
      context.fill();
    }
    texture.wrapU = Texture.WRAP_ADDRESSMODE;
    texture.wrapV = Texture.WRAP_ADDRESSMODE;
    texture.uScale = 7;
    texture.vScale = 7;
    texture.update(false);
    return texture;
  }

  private createNormalTexture(scene: Scene, size: number): DynamicTexture {
    const texture = new DynamicTexture('procedural-stone-normal', { width: size, height: size }, scene, false);
    const context = texture.getContext();
    context.fillStyle = '#8080ff';
    context.fillRect(0, 0, size, size);
    for (let index = 0; index < 360; index += 1) {
      const red = 112 + Math.floor(this.noise(index * 7) * 32);
      const green = 112 + Math.floor(this.noise(index * 13) * 32);
      context.fillStyle = `rgba(${red}, ${green}, 245, .24)`;
      context.beginPath();
      context.arc(this.noise(index * 17) * size, this.noise(index * 19) * size, 1 + this.noise(index * 29) * 5, 0, Math.PI * 2);
      context.fill();
    }
    texture.wrapU = Texture.WRAP_ADDRESSMODE;
    texture.wrapV = Texture.WRAP_ADDRESSMODE;
    texture.uScale = 2.2;
    texture.vScale = 2.2;
    texture.update(false);
    return texture;
  }

  private material(scene: Scene, name: string, color: string, texture: DynamicTexture, normal: DynamicTexture, bumpLevel: number): StandardMaterial {
    const material = new StandardMaterial(name, scene);
    material.diffuseColor = Color3.FromHexString(color);
    material.diffuseTexture = texture;
    material.bumpTexture = normal;
    material.bumpTexture.level = bumpLevel;
    material.specularColor = Color3.FromHexString('#4f493f');
    material.specularPower = 20;
    return material;
  }

  private flatMaterial(scene: Scene, name: string, color: string): StandardMaterial {
    const material = new StandardMaterial(name, scene);
    material.diffuseColor = Color3.FromHexString(color);
    material.specularColor = Color3.Black();
    return material;
  }

  private bind(mesh: AbstractMesh, feature: Feature): void {
    mesh.metadata = { featureId: feature.id, assetId: feature.asset, selectable: feature.selectable, placeholder: true };
    mesh.isPickable = feature.selectable;
    if (!feature.selectable) return;
    const meshes = this.featureMeshes.get(feature.id) ?? [];
    meshes.push(mesh);
    this.featureMeshes.set(feature.id, meshes);
  }

  private noise(seed: number): number {
    const value = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
    return value - Math.floor(value);
  }
}
