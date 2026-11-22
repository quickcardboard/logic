// The 3D case map: a little diorama of places joined by paths, with pawns for the people you place.
// Labels, pencil notes and evidence badges are HTML laid over the canvas so text stays crisp.
import * as THREE from "../vendor/three.module.min.js";
import { RoundedBoxGeometry } from "../vendor/RoundedBoxGeometry.js";
import { prop, mat } from "./props.js";
import { makeRenderer, addLights, toy } from "./look.js";

const SCALE = 0.2;          // map units (0..100) to world units
const PLATFORM_R = 1.35;
const LONG_MS = 450;

export class Map3D {
  constructor(host, handlers) {
    this.host = host; this.on = handlers;
    this.renderer = makeRenderer();
    host.appendChild(this.renderer.domElement);
    this.overlay = document.createElement("div"); this.overlay.className = "map-overlay"; host.appendChild(this.overlay);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
    addLights(this.renderer, this.scene, { sun: [-7, 16, 10], size: 16 });

    this.world = new THREE.Group(); this.scene.add(this.world);
    this.ray = new THREE.Raycaster(); this.ptr = new THREE.Vector2();
    this.anims = [];
    this.view = { tilt: 0.86, turn: 0 };   // camera angle above the board and around it

    new ResizeObserver(() => this.resize()).observe(host);
    this.bindPointer();
    const loop = (t) => { this.tick(t); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  // ---------- building the board ----------
  setCase(c) {
    this.c = c;
    this.world.clear(); this.overlay.innerHTML = "";
    this.spots = {}; this.pawns = {};
    const xs = c.spots.map(s => s.x), ys = c.spots.map(s => s.y);
    this.center = { x: (Math.min(...xs) + Math.max(...xs)) / 2, y: (Math.min(...ys) + Math.max(...ys)) / 2 };
    const W = (Math.max(...xs) - Math.min(...xs)) * SCALE + 5.5, D = (Math.max(...ys) - Math.min(...ys)) * SCALE + 6;
    this.size = { W, D };

    // a chunky toy board: grass on a soft rounded base
    const board = new THREE.Mesh(new RoundedBoxGeometry(W, 0.7, D, 4, 0.3), toy("#8fdc6a", { rough: 0.8 }));
    board.position.y = -0.35; board.receiveShadow = true; this.world.add(board);
    const base = new THREE.Mesh(new RoundedBoxGeometry(W + 0.3, 0.7, D + 0.3, 4, 0.33), toy(c.base || "#ffffff", { rough: 0.6 }));
    base.position.y = -0.85; base.receiveShadow = true; this.world.add(base);
    // a few trees and bushes round the edge so it reads as a place
    const rnd = mulberry(c.id.length * 97 + c.spots.length);
    for (let i = 0; i < 9; i++) {
      const side = i % 4, t = rnd() * 0.9 + 0.05;
      const x = side < 2 ? (t - 0.5) * W : (side === 2 ? -W / 2 + 0.6 : W / 2 - 0.6);
      const z = side >= 2 ? (t - 0.5) * D : (side === 0 ? -D / 2 + 0.6 : D / 2 - 0.6);
      if (c.spots.some(s => Math.hypot(this.wx(s) - x, this.wz(s) - z) < 2.4)) continue;
      this.world.add(tree(x, z, 0.6 + rnd() * 0.5));
    }

    for (const [a, b] of c.paths) {
      const A = c.spots.find(s => s.id === a), B = c.spots.find(s => s.id === b);
      const x1 = this.wx(A), z1 = this.wz(A), x2 = this.wx(B), z2 = this.wz(B);
      const len = Math.hypot(x2 - x1, z2 - z1);
      const path = new THREE.Mesh(new RoundedBoxGeometry(0.8, 0.08, len, 2, 0.035), toy("#fff3d6", { rough: 0.9 }));
      path.position.set((x1 + x2) / 2, 0.03, (z1 + z2) / 2);
      path.rotation.y = Math.atan2(x2 - x1, z2 - z1);
      path.receiveShadow = true; this.world.add(path);
    }

    for (const s of c.spots) {
      const g = new THREE.Group(); g.position.set(this.wx(s), 0, this.wz(s));
      const plat = new THREE.Mesh(new THREE.CylinderGeometry(PLATFORM_R, PLATFORM_R + 0.06, 0.22, 64), new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.5, envMapIntensity: 0.7 }));
      plat.position.y = 0.11; plat.receiveShadow = true; plat.castShadow = true; g.add(plat);
      const ring = new THREE.Mesh(new THREE.TorusGeometry(PLATFORM_R + 0.03, 0.07, 12, 72), new THREE.MeshStandardMaterial({ color: "#c9d6ea", roughness: 0.4, envMapIntensity: 0.8 }));
      ring.rotation.x = Math.PI / 2; ring.position.y = 0.23; g.add(ring);
      const p = prop(s.id); p.scale.setScalar(0.82); p.position.set(0, 0.22, -0.2); g.add(p);
      const cross = new THREE.Group();
      for (const r of [Math.PI / 4, -Math.PI / 4]) {
        const bar = new THREE.Mesh(new RoundedBoxGeometry(2.3, 0.16, 0.26, 2, 0.07), toy("#ff4b4b"));
        bar.rotation.y = r; bar.position.y = 0.75; cross.add(bar);
      }
      cross.visible = false; g.add(cross);
      g.traverse(o => { o.userData.spot = s.id; });
      this.world.add(g);
      const label = document.createElement("div"); label.className = "spot-label";
      label.innerHTML = `<span class="badges"></span><span class="name">${s.name}</span><span class="notes"></span>`;
      this.overlay.appendChild(label);
      this.spots[s.id] = { g, plat, ring, prop: p, cross, label, crossed: false };
    }
    c.evidence.forEach((e, i) => {
      const b = this.spots[e.spot]?.label.querySelector(".badges");
      if (!b) return;
      const btn = document.createElement("button");
      btn.type = "button"; btn.className = "badge"; btn.textContent = e.icon; btn.dataset.clue = i;
      btn.setAttribute("aria-label", "Evidence: " + e.text);
      btn.addEventListener("click", ev => { ev.stopPropagation(); this.on.clue?.(i); });
      b.appendChild(btn);
    });
    for (const p of c.suspects) {
      const pawn = makePawn(p.color);
      pawn.visible = false; pawn.userData.who = p.name;
      pawn.traverse(o => { o.userData.who = p.name; });
      this.world.add(pawn);
      const tag = document.createElement("div"); tag.className = "pawn-tag"; tag.textContent = p.name;
      tag.style.setProperty("--c", p.color); this.overlay.appendChild(tag);
      this.pawns[p.name] = { pawn, tag, at: null };
    }
    this.resize();
  }

  wx(s) { return (s.x - this.center.x) * SCALE; }
  wz(s) { return (s.y - this.center.y) * SCALE; }

  // ---------- showing the player's work ----------
  showClue(i) {   // highlight the evidence badge that is open in the side panel
    this.overlay.querySelectorAll(".badge").forEach(b => b.classList.toggle("on", +b.dataset.clue === i));
  }
  update(st, selected) {
    this.st = st; this.selected = selected;
    const color = Object.fromEntries(this.c.suspects.map(s => [s.name, s.color]));
    const who = {}; for (const n in st.pos) who[st.pos[n]] = n;
    for (const [id, S] of Object.entries(this.spots)) {
      const crossed = !!st.crossed[id] && !who[id];
      S.cross.visible = crossed;
      S.prop.visible = true;
      S.plat.material.color.set(crossed ? "#dfe5ee" : "#ffffff");
      const notes = (st.notes[id] || []).filter(() => !who[id]);
      S.label.querySelector(".notes").innerHTML = notes.map(n => `<i style="--c:${color[n]}">${n[0]}</i>`).join("");
      S.label.classList.toggle("has-notes", notes.length > 0);
    }
    for (const [name, P] of Object.entries(this.pawns)) {
      const at = st.pos[name] || null;
      if (at !== P.at) {
        P.at = at; P.pawn.visible = !!at;
        if (at) {
          const s = this.spots[at].g.position;
          P.pawn.position.set(s.x + 0.55, 0.22, s.z + 0.7);
          this.drop(P.pawn);
        }
      }
      P.pawn.userData.selected = name === selected;
    }
  }

  drop(obj) {
    const y1 = obj.position.y, start = performance.now();
    obj.position.y = y1 + 3;
    this.anims.push(t => {
      const k = Math.min(1, (t - start) / 420);
      const e = k < 1 ? 1 - Math.pow(1 - k, 3) : 1;
      obj.position.y = y1 + 3 * (1 - e) + (k < 1 ? 0 : 0);
      obj.scale.set(1 + 0.15 * Math.sin(k * Math.PI), 1 - 0.12 * Math.sin(k * Math.PI), 1 + 0.15 * Math.sin(k * Math.PI));
      return k < 1;
    });
  }

  // ---------- camera ----------
  resize() {
    const w = this.host.clientWidth, h = this.host.clientHeight;
    if (!w || !h || !this.size) return;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h; this.camera.updateProjectionMatrix();
    this.fit();
  }
  fit() {
    const { W, D } = this.size, a = this.camera.aspect;
    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    // distance so the board fits both ways, allowing for the tilt
    const needH = D * Math.sin(this.view.tilt) + 3.2, needW = W + 0.6;
    const dist = Math.max(needH / (2 * Math.tan(fov / 2)), needW / (2 * Math.tan(fov / 2) * a)) * 1.02;
    const t = this.view.tilt, r = this.view.turn;
    this.camera.position.set(Math.sin(r) * Math.cos(t) * dist, Math.sin(t) * dist, Math.cos(r) * Math.cos(t) * dist);
    this.camera.lookAt(0, 0.3, 0.55);
  }

  // ---------- frame loop: animations, hover, labels ----------
  tick(t) {
    if (!this.c) return;
    this.anims = this.anims.filter(f => f(t));
    for (const [id, S] of Object.entries(this.spots)) {
      const hot = id === this.hot || id === this.pressing;
      const k = this.pressing === id ? 1.08 : hot ? 1.04 : 1;
      S.g.scale.lerp(new THREE.Vector3(k, k, k), 0.25);
      S.ring.material.color.set(this.pressing === id ? "#ff4b4b" : hot ? "#1cb0f6" : "#c9d6ea");
    }
    for (const P of Object.values(this.pawns)) {
      if (P.pawn.visible) P.pawn.rotation.y = P.pawn.userData.selected ? t / 400 : 0;
    }
    this.renderer.render(this.scene, this.camera);
    this.placeLabels();
  }
  project(v) {
    const p = v.clone().project(this.camera), el = this.renderer.domElement;
    return { x: (p.x + 1) / 2 * el.clientWidth, y: (1 - p.y) / 2 * el.clientHeight };
  }
  placeLabels() {
    for (const S of Object.values(this.spots)) {
      const p = this.project(S.g.position.clone().add(new THREE.Vector3(0, 0, PLATFORM_R + 0.1)));
      S.label.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, 0)`;
    }
    for (const P of Object.values(this.pawns)) {
      P.tag.hidden = !P.pawn.visible;
      if (!P.pawn.visible) continue;
      const p = this.project(P.pawn.position.clone().add(new THREE.Vector3(0, 1.55, 0)));
      P.tag.style.transform = `translate(${p.x}px, ${p.y}px) translate(-50%, -100%)`;
    }
  }

  // ---------- input ----------
  spotAt(clientX, clientY) {
    const r = this.renderer.domElement.getBoundingClientRect();
    if (clientX < r.left || clientX > r.right || clientY < r.top || clientY > r.bottom) return null;
    this.ptr.set((clientX - r.left) / r.width * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    this.ray.setFromCamera(this.ptr, this.camera);
    const hits = this.ray.intersectObjects(this.world.children, true);
    for (const h of hits) {
      if (h.object.userData.spot) return h.object.userData.spot;
      if (h.object.userData.who) { const at = this.st?.pos[h.object.userData.who]; if (at) return at; }
    }
    // forgiving taps: the nearest platform within reach of the touch point on the ground
    const ground = new THREE.Plane(new THREE.Vector3(0, 1, 0), -0.2), hit = new THREE.Vector3();
    if (!this.ray.ray.intersectPlane(ground, hit)) return null;
    let best = null, bd = PLATFORM_R + 0.5;
    for (const [id, S] of Object.entries(this.spots)) {
      const d = Math.hypot(S.g.position.x - hit.x, S.g.position.z - hit.z);
      if (d < bd) { bd = d; best = id; }
    }
    return best;
  }
  bindPointer() {
    const el = this.renderer.domElement;
    el.style.touchAction = "none";
    let timer = null, downId = null, fired = false, start = null;
    const cancel = () => { clearTimeout(timer); timer = null; this.pressing = null; };
    el.addEventListener("pointermove", e => {
      if (e.pointerType === "mouse") this.hot = this.spotAt(e.clientX, e.clientY);
      el.style.cursor = this.hot ? "pointer" : "default";
      if (start && Math.hypot(e.clientX - start.x, e.clientY - start.y) > 12) cancel();
    });
    el.addEventListener("pointerdown", e => {
      if (e.button > 0) return;
      downId = this.spotAt(e.clientX, e.clientY); fired = false; start = { x: e.clientX, y: e.clientY };
      if (!downId) return;
      this.pressing = downId;
      timer = setTimeout(() => {
        fired = true; cancel();
        try { navigator.vibrate && navigator.vibrate(15); } catch {}
        this.on.hold(downId);
      }, LONG_MS);
    });
    el.addEventListener("pointerup", () => {
      if (timer && !fired && downId) { cancel(); this.on.tap(downId); }
      cancel(); start = null;
    });
    el.addEventListener("pointerleave", () => { cancel(); this.hot = null; start = null; });
    el.addEventListener("pointercancel", cancel);
    el.addEventListener("contextmenu", e => e.preventDefault());
  }
}

function makePawn(color) {
  const g = new THREE.Group();
  const shiny = toy(color, { rough: 0.35, env: 1 });
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.38, 0.75, 40), shiny);
  body.position.y = 0.38;
  const base = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.42, 0.1, 40), shiny);
  base.position.y = 0.05;
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 32, 24), shiny);
  head.position.y = 0.98;
  for (const m of [body, base, head]) { m.castShadow = true; g.add(m); }
  return g;
}

function tree(x, z, s) {
  const g = new THREE.Group();
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.14, 0.6, 16), mat("#b07a4f"));
  trunk.position.y = 0.3;
  const top = new THREE.Mesh(new THREE.SphereGeometry(0.6, 24, 16), mat("#5cc451"));
  top.position.y = 0.95;
  const top2 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 24, 16), mat("#79d66b"));
  top2.position.set(0.25, 1.3, 0.1);
  for (const m of [trunk, top, top2]) { m.castShadow = true; m.receiveShadow = true; g.add(m); }
  g.position.set(x, 0, z); g.scale.setScalar(s);
  return g;
}

function mulberry(a) {
  return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
}
