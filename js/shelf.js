// Home page: a 3D bookshelf. Tap a book to pull it out and see a teaser, then open it.
import * as THREE from "../vendor/three.module.min.js";
import { RoundedBoxGeometry } from "../vendor/RoundedBoxGeometry.js";
import { makeRenderer, addLights, toy } from "./look.js";

const $ = id => document.getElementById(id);
const host = $("shelf3d");
const STORIES = window.STORIES;
const ART = window.ART || {};
const PUZZLE_IDS = new Set([...(window.BOOK || []), ...(window.TUTORIAL || [])].map(c => c.id));

const renderer = makeRenderer();
host.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
addLights(renderer, scene, { sun: [-4, 8, 9], size: 8 });

const M = (c, o) => toy(c, o);
const add = (geo, mat, x, y, z, parent = scene) => {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m;
};
const rbox = (w, h, d, r = 0.08) => new RoundedBoxGeometry(w, h, d, 4, r);

// ---------- the bookcase ----------
// A bright toy bookcase: white frame, sky-blue back. Theme-neutral, so any kind of story fits on it.
const caseMat = M("#ffffff", { rough: 0.45 }), backing = M("#bfe3ff", { rough: 0.8 });
const CASE_W = 7.2, ROW_Y = 0;
add(rbox(CASE_W + 0.4, 4.4, 0.2, 0.06), backing, 0, 1.9, -1.1);                                    // back
for (const x of [-CASE_W / 2 - 0.15, CASE_W / 2 + 0.15]) add(rbox(0.3, 4.7, 2.2, 0.12), caseMat, x, 1.9, 0); // sides
for (const y of [ROW_Y - 0.15, 2.95]) add(rbox(CASE_W + 0.2, 0.3, 2.2, 0.1), caseMat, 0, y, 0);         // shelves
add(rbox(CASE_W + 0.9, 0.32, 2.4, 0.14), caseMat, 0, 4.25, 0);                                         // top
add(rbox(CASE_W + 0.9, 0.5, 2.4, 0.16), M("#ffc53d"), 0, -0.55, 0);                                   // base
// a few toys on the shelves
duck(2.7, ROW_Y, 0.3, 0.55);
planet(-2.4, 3.1, 0.1);
plant(1.7, 3.1, 0.2);
stackOfBooks(-0.6, 3.1, 0);

// ---------- books ----------
const books = [];
const sizes = [[0.62, 2.35, 1.6], [0.42, 1.95, 1.45], [0.5, 2.1, 1.5], [0.46, 2.2, 1.5]];
let x0 = -CASE_W / 2 + 0.5;
const ready = document.fonts ? document.fonts.load('600 48px "Fredoka"').catch(() => {}) : Promise.resolve();
ready.then(async () => {
  for (const [i, s] of STORIES.entries()) {
    const [w, h, d] = sizes[i % sizes.length];
    const book = makeBook(s, w, h, d, await coverTexture(s, h / d), spineTexture(s, w / h));
    const tilt = i === STORIES.length - 1 ? -0.12 : 0;
    book.position.set(x0 + w / 2, ROW_Y + h / 2, 0.15); book.rotation.z = tilt;
    x0 += w + 0.1;
    book.userData = { story: s, home: book.position.clone(), homeRot: book.rotation.clone(), out: 0 };
    book.traverse(o => { o.userData.book = book; });
    scene.add(book); books.push(book);
  }
  resize();
});

// A book, not a box: two cover boards, a cream page block set back from the edges, and a rounded spine.
// The spine faces +z (out of the shelf) and the front cover faces +x.
function makeBook(s, w, h, d, coverTex, spineTex) {
  const g = new THREE.Group(), t = 0.05, color = s.spine;
  const board = M(color, { rough: 0.5 });
  const coverMat = new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.5, envMapIntensity: 0.7 });
  const spineMat = new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.5, envMapIntensity: 0.7 });
  // box faces: +x, -x, +y, -y, +z, -z
  add(new THREE.BoxGeometry(t, h, d - 0.02), [coverMat, board, board, board, board, board], w / 2 - t / 2, 0, -0.01, g);
  add(new THREE.BoxGeometry(t, h, d - 0.02), board, -w / 2 + t / 2, 0, -0.01, g);
  add(new THREE.BoxGeometry(w - 2 * t, h - 0.1, d - 0.12), pagesMat(), 0, 0, -0.02, g);
  const spine = add(new THREE.CylinderGeometry(w / 2, w / 2, h, 32, 1, true, -Math.PI / 2, Math.PI), spineMat, 0, 0, d / 2 - 0.05, g);
  spine.scale.z = 0.4;
  return g;
}
let _pages = null;
function pagesMat() {   // fine lines, like the edges of many pages
  if (_pages) return _pages;
  const cv = document.createElement("canvas"); cv.width = 64; cv.height = 256;
  const g = cv.getContext("2d"); g.fillStyle = "#fffaf0"; g.fillRect(0, 0, 64, 256);
  g.fillStyle = "#e9e0cf"; for (let y = 0; y < 256; y += 4) g.fillRect(0, y, 64, 1);
  const tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace;
  return (_pages = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.9, envMapIntensity: 0.5 }));
}

function spineTexture(s, aspect) {
  const H = 1024, W = Math.round(H * aspect), cv = document.createElement("canvas");
  cv.width = W; cv.height = H; const g = cv.getContext("2d");
  g.fillStyle = s.spine; g.fillRect(0, 0, W, H);
  g.fillStyle = "rgba(0,0,0,.12)"; g.fillRect(0, 60, W, 16); g.fillRect(0, H - 76, W, 16);
  g.save(); g.translate(W / 2, H / 2); g.rotate(-Math.PI / 2);
  g.fillStyle = s.ink; g.textAlign = "center"; g.textBaseline = "middle";
  let size = Math.min(W * 0.62, 120); g.font = `600 ${size}px "Fredoka", sans-serif`;
  while (g.measureText(s.title).width > H * 0.78 && size > 20) { size -= 4; g.font = `600 ${size}px "Fredoka", sans-serif`; }
  g.fillText(s.title, 0, 4); g.restore();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

async function coverTexture(s, aspect) {   // aspect = height / depth of the book
  const H = 1024, W = Math.round(H / aspect), cv = document.createElement("canvas");
  cv.width = W; cv.height = H; const g = cv.getContext("2d");
  g.fillStyle = s.spine; g.fillRect(0, 0, W, H);
  if (s.cover && ART.covers?.[s.cover]) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${ART.coverBox}" width="800" height="600">${ART.covers[s.cover]}</svg>`;
    const img = new Image(); img.src = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    try {
      await img.decode(); const iw = W - 80, ih = iw * 0.75;
      g.save(); g.beginPath(); g.roundRect(40, 310, iw, ih, 36); g.clip(); g.drawImage(img, 40, 310, iw, ih); g.restore();
      g.strokeStyle = "#ffffff"; g.lineWidth = 12; g.beginPath(); g.roundRect(40, 310, iw, ih, 36); g.stroke();
    } catch {}
  } else {
    g.fillStyle = "rgba(255,255,255,.35)"; g.font = `600 ${W * 0.5}px "Fredoka", sans-serif`; g.textAlign = "center";
    g.fillText(s.soon ? "?" : "★", W / 2, H * 0.62);
  }
  g.fillStyle = s.ink; g.textAlign = "center"; g.textBaseline = "middle";
  let size = 96; g.font = `600 ${size}px "Fredoka", sans-serif`;
  const words = s.title.split(" "), lines = [""];
  for (const w of words) { const t = (lines.at(-1) + " " + w).trim(); if (g.measureText(t).width > W - 80 && lines.at(-1)) lines.push(w); else lines[lines.length - 1] = t; }
  lines.forEach((l, i) => g.fillText(l, W / 2, 110 + i * 100));
  g.font = `500 48px "Fredoka", sans-serif`; g.fillText(s.soon ? "Coming soon" : s.ages || "", W / 2, H - 90);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function planet(x, y, z) {
  const p = add(new THREE.SphereGeometry(0.42, 40, 28), M("#ff8fab"), x, y + 0.62, z);
  const ring = add(new THREE.TorusGeometry(0.66, 0.05, 12, 64), M("#ffd166"), x, y + 0.62, z);
  ring.rotation.set(1.2, 0.3, 0.2);
  add(new THREE.CylinderGeometry(0.06, 0.06, 0.25, 16), M("#ffffff"), x, y + 0.12, z);
  add(new THREE.CylinderGeometry(0.3, 0.34, 0.08, 32), M("#ffffff"), x, y + 0.04, z);
  return p;
}
function duck(x, y, z, s, ry = 0.5) {
  const g = new THREE.Group(), yel = M("#ffd43b", { rough: 0.3 });
  add(new THREE.SphereGeometry(0.5, 20, 16), yel, 0, 0.42, 0, g).scale.set(1.25, 0.85, 1);
  add(new THREE.SphereGeometry(0.33, 20, 16), yel, 0.35, 0.95, 0, g);
  add(new THREE.ConeGeometry(0.12, 0.3, 12), M("#ff922b"), 0.72, 0.92, 0, g).rotation.z = -Math.PI / 2;
  for (const zz of [-0.17, 0.17]) add(new THREE.SphereGeometry(0.045, 8, 8), M("#3b2a20"), 0.56, 1.05, zz, g);
  add(new THREE.SphereGeometry(0.2, 12, 10), yel, -0.62, 0.62, 0, g).scale.set(1, 0.6, 0.8);
  g.position.set(x, y, z); g.scale.setScalar(s); g.rotation.y = ry; scene.add(g);
}
function plant(x, y, z) {
  add(new THREE.CylinderGeometry(0.28, 0.22, 0.45, 16), M("#e07a5f"), x, y + 0.22, z);
  for (let i = 0; i < 6; i++) {
    const leaf = add(new THREE.SphereGeometry(0.18, 8, 6), M(i % 2 ? "#69b34c" : "#8cc66b"), x + Math.cos(i) * 0.15, y + 0.62 + (i % 3) * 0.12, z + Math.sin(i) * 0.15);
    leaf.scale.set(0.6, 1.4, 0.6); leaf.rotation.z = Math.cos(i) * 0.6;
  }
}
function stackOfBooks(x, y, z) {
  ["#1cb0f6", "#ff4b4b", "#ce82ff"].forEach((c, i) => {
    const b = add(rbox(1.3 - i * 0.12, 0.22, 1.0, 0.05), M(c), x, y + 0.11 + i * 0.22, z);
    b.rotation.y = (i - 1) * 0.12;
  });
}

// ---------- camera and layout ----------
const view = { x: 0, y: 1.8, dist: 12, look: new THREE.Vector3(0, 1.7, 0) };
let mouse = { x: 0, y: 0 };
function resize() {
  const w = host.clientWidth, h = host.clientHeight;
  renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  const fov = THREE.MathUtils.degToRad(camera.fov);
  // phones (portrait): frame just the books; wide screens: the whole bookcase
  const narrow = camera.aspect < 0.9;
  const needW = narrow ? 4.2 : CASE_W + 1.8, needH = narrow ? 3.6 : 6.3;
  view.x = narrow ? -1.95 : 0; view.look.set(view.x, narrow ? 0.4 : 1.95, 0); view.y = narrow ? 0.3 : 2.1;
  view.dist = Math.max(needH / (2 * Math.tan(fov / 2)), needW / (2 * Math.tan(fov / 2) * camera.aspect));
}
new ResizeObserver(resize).observe(host);
addEventListener("pointermove", e => { mouse.x = e.clientX / innerWidth - 0.5; mouse.y = e.clientY / innerHeight - 0.5; });

// ---------- picking, pulling out, opening ----------
const ray = new THREE.Raycaster(), ptr = new THREE.Vector2();
let hovered = null, picked = null, opening = null;
function bookAt(e) {
  const r = renderer.domElement.getBoundingClientRect();
  ptr.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
  ray.setFromCamera(ptr, camera);
  return ray.intersectObjects(books, true)[0]?.object.userData.book || null;
}
renderer.domElement.addEventListener("pointermove", e => {
  hovered = picked ? null : bookAt(e);
  renderer.domElement.style.cursor = hovered || picked ? "pointer" : "default";
});
renderer.domElement.addEventListener("click", e => {
  if (opening) return;
  const b = bookAt(e);
  if (picked && (!b || b === picked)) { if (b === picked && !picked.userData.story.soon) open(); else putBack(); return; }
  if (b) pick(b);
});
addEventListener("keydown", e => { if (e.key === "Escape") putBack(); });

function pick(b) {
  if (picked && picked !== b) picked.userData.target = null;
  picked = b; hovered = null;
  const s = b.userData.story;
  $("tTitle").textContent = s.title;
  $("tText").textContent = s.teaser;
  const chapters = (s.chapters || []).filter(ch => !ch.puzzle || PUZZLE_IDS.has(ch.puzzle));
  const maps = chapters.filter(ch => ch.puzzle).length;
  $("tMeta").textContent = s.soon ? "Coming soon" : [s.ages, maps ? `${maps} map${maps > 1 ? "s" : ""} to solve` : ""].filter(Boolean).join(" · ");
  $("tOpen").hidden = !!s.soon;
  $("tPdf").hidden = !s.pdf; if (s.pdf) $("tPdf").href = s.pdf;
  $("teaser").style.setProperty("--accent", s.theme?.accent || s.spine);
  $("teaser").style.setProperty("--accent-ink", s.theme?.accentInk || s.ink || "#fff");
  $("teaser").classList.add("show");
}
function putBack() {
  picked = null; $("teaser").classList.remove("show");
}
function open() {
  const s = picked.userData.story;
  if (s.soon) return;
  opening = { t0: performance.now(), href: `play.html?s=${s.id}` };
  $("teaser").classList.remove("show");
  document.body.classList.add("opening");
}
$("tOpen").onclick = () => picked && open();
$("tClose").onclick = putBack;

// ---------- frame loop ----------
const tmpV = new THREE.Vector3(), tmpQ = new THREE.Quaternion(), outRot = new THREE.Euler();
function frame(t) {
  requestAnimationFrame(frame);
  const narrow = camera.aspect < 0.9;
  for (const b of books) {
    const u = b.userData;
    let pos = u.home.clone(), rot = u.homeRot;
    if (b === hovered) pos.z += 0.45;
    if (b === picked) {
      // out of the shelf, turned to show its cover, floating in front
      pos.set(narrow ? view.x : -1.6, (narrow ? 1.55 : 1.6) + Math.sin(t / 700) * 0.05, narrow ? 2.6 : 3.2);
      outRot.set(0.05, -Math.PI / 2 + 0.22 + Math.sin(t / 900) * 0.04, 0);
      rot = outRot;
    }
    b.position.lerp(pos, 0.12);
    tmpQ.setFromEuler(rot); b.quaternion.slerp(tmpQ, 0.12);
  }
  // camera: gentle sway, or a dolly into the book when opening
  let cam = tmpV.set(view.x + mouse.x * 0.8, view.y - mouse.y * 0.5, view.dist), look = view.look;
  if (opening && picked) {
    const k = Math.min(1, (performance.now() - opening.t0) / 900), e = k * k * (3 - 2 * k);
    const target = picked.position.clone().add(new THREE.Vector3(0, 0, 1.2));
    cam = cam.clone().lerp(target, e); look = view.look.clone().lerp(picked.position, e);
    if (k >= 1 && !opening.done) { opening.done = true; location.href = opening.href; }
  }
  camera.position.lerp(cam, opening ? 0.5 : 0.08); camera.lookAt(look);
  renderer.render(scene, camera);
}
requestAnimationFrame(frame);
addEventListener("pageshow", e => { if (e.persisted) { opening = null; document.body.classList.remove("opening"); putBack(); } });
