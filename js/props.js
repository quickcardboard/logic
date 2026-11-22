// Small low-poly models for map places, built from simple shapes. Each fits in about 2 x 2 units,
// stands on y = 0 and faces +z (toward the camera).
import * as THREE from "../vendor/three.module.min.js";

const mats = {};
export function mat(color) {
  return mats[color] || (mats[color] = new THREE.MeshStandardMaterial({ color, roughness: 0.85, metalness: 0, flatShading: true }));
}
function mesh(geo, color, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat(color));
  m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
  return m;
}
const box = (w, h, d, color, x, y, z) => mesh(new THREE.BoxGeometry(w, h, d), color, x, y + h / 2, z);
const cyl = (rt, rb, h, color, x, y, z, seg = 20) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg), color, x, y + h / 2, z);
const ball = (r, color, x, y, z) => mesh(new THREE.SphereGeometry(r, 16, 12), color, x, y, z);
function prism(w, h, d, color, x, y, z) {   // a gable roof: triangle across x, length along z
  const shape = new THREE.Shape(); shape.moveTo(-w / 2, 0); shape.lineTo(w / 2, 0); shape.lineTo(0, h); shape.closePath();
  const g = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false }); g.translate(0, 0, -d / 2);
  return mesh(g, color, x, y, z);
}
function sc(m, x, y, z) { m.scale.set(x, y, z); return m; }
function group(...parts) { const g = new THREE.Group(); parts.flat().forEach(p => g.add(p)); return g; }

const P = {
  bikeshed: () => group(
    box(2, 0.9, 1.1, "#f3dfbd", 0, 0, -0.15),
    box(1.7, 0.7, 0.05, "#7d6250", 0, 0, 0.42),
    prism(2.3, 0.55, 1.4, "#e8505b", 0, 0.9, -0.15),
    [-0.55, 0, 0.55].map((x, i) => group(
      mesh(new THREE.TorusGeometry(0.16, 0.035, 6, 16), "#3b2a20", x - 0.17, 0.2, 0.62),
      mesh(new THREE.TorusGeometry(0.16, 0.035, 6, 16), "#3b2a20", x + 0.17, 0.2, 0.62),
      box(0.36, 0.05, 0.05, ["#4dabf7", "#ff6b6b", "#fcc419"][i], x, 0.32, 0.62)))),
  bellbox: () => group(
    box(0.8, 1.3, 0.7, "#c08a5b", 0, 0, 0),
    mesh(new THREE.ConeGeometry(0.66, 0.45, 4), "#9a6a44", 0, 1.52, 0).rotateY(Math.PI / 4),
    ball(0.16, "#ffd43b", 0, 1.86, 0),
    box(0.2, 0.18, 0.06, "#adb5bd", 0, 0.55, 0.37)),
  garden: () => group(
    [-0.45, 0.45].map(z => group(
      box(1.9, 0.3, 0.6, "#a0703f", 0, 0, z),
      box(1.75, 0.05, 0.48, "#6b4630", 0, 0.28, z),
      [-0.65, -0.32, 0, 0.32, 0.65].map(x => group(
        mesh(new THREE.ConeGeometry(0.06, 0.2, 6), "#ff922b", x, 0.36, z).rotateX(Math.PI),
        mesh(new THREE.ConeGeometry(0.09, 0.28, 5), "#4fae4f", x, 0.56, z)))))),
  frame: () => group(
    cyl(1.05, 1.05, 0.06, "#f2e2b6", 0, 0, 0, 28),
    [[0.95, "#e8505b"], [0.7, "#4dabf7"], [0.45, "#fcc419"]].map(([r, c]) =>
      mesh(new THREE.TorusGeometry(r, 0.05, 6, 28, Math.PI), c, 0, 0.05, 0)),
    [0.35, -0.35].map(z => mesh(new THREE.TorusGeometry(0.95, 0.04, 6, 28, Math.PI), "#69db7c", 0, 0.05, z).rotateY(Math.PI / 2).rotateZ(0))),
  fountain: () => group(
    cyl(0.95, 1, 0.3, "#cfd8dc", 0, 0, 0),
    cyl(0.82, 0.82, 0.04, "#74c0fc", 0, 0.28, 0),
    cyl(0.14, 0.18, 0.8, "#e3e8eb", 0, 0.3, 0),
    cyl(0.45, 0.25, 0.18, "#cfd8dc", 0, 1.05, 0),
    ball(0.12, "#a5d8ff", 0, 1.32, 0), ball(0.07, "#a5d8ff", 0.3, 1.2, 0.1), ball(0.07, "#a5d8ff", -0.25, 1.18, -0.1)),
  mud: () => group(
    sc(mesh(new THREE.SphereGeometry(1, 10, 6), "#a47148", 0, 0.02, 0), 1, 0.08, 0.75),
    sc(mesh(new THREE.SphereGeometry(0.35, 10, 6), "#8fb7d4", 0.5, 0.05, 0.25), 1, 0.05, 0.6),
    [[-0.5, -0.1], [-0.2, 0.15], [0.05, -0.15], [0.3, 0.1]].map(([x, z]) => sc(mesh(new THREE.SphereGeometry(0.1, 8, 6), "#5e3d26", x, 0.08, z), 1.6, 0.4, 0.8))),
  hopscotch: () => group(
    box(1.4, 0.05, 1.9, "#c9cdd2", 0, 0, 0),
    [[0, 0.6], [0, 0.2], [-0.2, -0.2], [0.2, -0.2], [0, -0.6]].map(([x, z]) => box(0.34, 0.03, 0.32, "#ffffff", x, 0.05, z))),
  flagpole: () => group(
    cyl(0.4, 0.45, 0.15, "#cfd8dc", 0, 0, 0),
    cyl(0.04, 0.04, 2.1, "#e9ecef", 0, 0.15, 0, 8),
    ball(0.09, "#ffd43b", 0, 2.3, 0),
    box(0.75, 0.45, 0.04, "#4dabf7", 0.4, 1.7, 0)),
  hall: () => group(
    box(2, 1.1, 1.2, "#f3dfbd", 0, 0, -0.1),
    prism(2.2, 0.5, 1.4, "#c2554f", 0, 1.1, -0.1),
    box(1.2, 0.75, 0.05, "#8a6a52", 0, 0, 0.52),
    box(1.3, 0.25, 0.08, "#e8505b", 0, 0.75, 0.53)),
  office: () => group(
    box(1.2, 0.5, 0.6, "#c08a5b", -0.3, 0, 0.1),
    box(0.5, 0.36, 0.06, "#495057", -0.4, 0.5, 0),
    box(0.42, 0.28, 0.02, "#a5d8ff", -0.4, 0.54, 0.04),
    cyl(0.08, 0.08, 0.16, "#ffffff", 0.05, 0.5, 0.15, 10),
    box(0.5, 1.2, 0.6, "#adb5bd", 0.65, 0, -0.05)),
  library: () => group(
    box(1.7, 1.5, 0.5, "#a0703f", 0, 0, -0.2),
    [0.15, 0.6, 1.05].flatMap((y, r) => Array.from({ length: 7 }, (_, i) =>
      box(0.16, 0.32 + ((i + r) % 3) * 0.04, 0.3, ["#e8505b", "#4dabf7", "#fcc419", "#69db7c", "#b197fc", "#ff922b"][(i + r) % 6], -0.62 + i * 0.205, y, 0.02)))),
  door: () => group(
    box(1.6, 1.5, 0.3, "#f1c9a5", 0, 0, -0.2),
    box(0.9, 1.15, 0.06, "#7fb3d5", 0, 0, -0.02),
    box(1.1, 0.03, 0.5, "#e8505b", 0, 0, 0.3)),
  kitchen: () => group(
    box(1.6, 0.8, 0.8, "#e9ecef", 0, 0, 0),
    box(1.0, 0.4, 0.04, "#495057", 0, 0.15, 0.41),
    cyl(0.32, 0.3, 0.4, "#ced4da", -0.25, 0.8, 0),
    [0, 0.18, 0.36].map((y, i) => ball(0.08 - i * 0.015, "#f1f3f5", -0.25 + i * 0.05, 1.35 + y, 0))),
  staff: () => group(
    cyl(0.85, 0.85, 0.08, "#c08a5b", 0, 0.5, 0, 24),
    cyl(0.08, 0.12, 0.5, "#8a6a52", 0, 0, 0, 10),
    [["#4dabf7", -0.4, 0.2], ["#fcc419", 0.05, 0.35], ["#e8505b", 0.4, 0]].map(([c, x, z]) => cyl(0.1, 0.09, 0.2, c, x, 0.58, z, 10)),
    cyl(0.14, 0.18, 0.3, "#cfd8dc", 0.2, 0.58, -0.4, 12)),
  class: () => group(
    box(1.8, 1.05, 0.1, "#a0703f", 0, 0.35, -0.5),
    box(1.6, 0.85, 0.04, "#2f5d50", 0, 0.45, -0.43),
    box(1.0, 0.08, 0.55, "#ffd43b", 0, 0.45, 0.25),
    [[-0.4, 0.05], [0.4, 0.05], [-0.4, 0.45], [0.4, 0.45]].map(([x, z]) => box(0.06, 0.45, 0.06, "#8a6a52", x, 0, z))),
  toilets: () => group(
    box(0.7, 0.55, 0.3, "#f8f9fa", -0.2, 0.45, -0.35),
    cyl(0.38, 0.28, 0.45, "#f8f9fa", -0.2, 0, 0.05),
    cyl(0.4, 0.4, 0.04, "#e9ecef", -0.2, 0.45, 0.05),
    mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.2, 16), "#ffffff", 0.6, 0.65, 0).rotateZ(Math.PI / 2)),
};

// Unknown places get a little signpost.
function fallback() {
  return group(cyl(0.05, 0.05, 1.1, "#8a6a52", 0, 0, 0, 8), box(0.9, 0.45, 0.06, "#f3dfbd", 0, 0.75, 0));
}

export function prop(id) {
  const g = (P[id] || fallback)();
  g.traverse(o => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}
