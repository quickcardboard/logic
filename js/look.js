// Shared 3D look for the shelf and the maps: soft studio light, gentle shadows and toy-like materials.
import * as THREE from "../vendor/three.module.min.js";
import { RoomEnvironment } from "../vendor/RoomEnvironment.js";

export function makeRenderer() {
  const r = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  r.setPixelRatio(Math.min(devicePixelRatio, 2));
  r.shadowMap.enabled = true; r.shadowMap.type = THREE.PCFSoftShadowMap;
  r.outputColorSpace = THREE.SRGBColorSpace;
  r.toneMapping = THREE.NoToneMapping;
  return r;
}

// Image-based light from a soft "room", a sky/ground fill, and one warm sun that casts soft shadows.
export function addLights(renderer, scene, { sun = [-6, 14, 9], size = 14 } = {}) {
  const pm = new THREE.PMREMGenerator(renderer);
  scene.environment = pm.fromScene(new RoomEnvironment(renderer), 0.04).texture;
  pm.dispose();
  scene.add(new THREE.HemisphereLight("#ffffff", "#cfe3ff", 0.35));
  const light = new THREE.DirectionalLight("#fff6e6", 1.25);
  light.position.set(...sun); light.castShadow = true;
  light.shadow.mapSize.set(2048, 2048);
  Object.assign(light.shadow.camera, { left: -size, right: size, top: size, bottom: -size, near: 1, far: 80 });
  light.shadow.bias = -0.0004; light.shadow.normalBias = 0.02; light.shadow.radius = 6;
  scene.add(light);
  return light;
}

const cache = {};
// A soft plastic-toy material. Cached by colour so a scene shares materials.
export function toy(color, { rough = 0.55, env = 0.45 } = {}) {
  const k = color + rough + env;
  return cache[k] || (cache[k] = new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: 0, envMapIntensity: env }));
}
