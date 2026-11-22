// Home page: a 3D bookshelf. Tap a book to pull it out and see a teaser, then open it.
import * as THREE from "../vendor/three.module.min.js";

const $ = id => document.getElementById(id);
const host = $("shelf3d");
const STORIES = window.STORIES;
const ART = window.ART || {};
const PUZZLE_IDS = new Set([...(window.BOOK || []), ...(window.TUTORIAL || [])].map(c => c.id));

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
scene.add(new THREE.HemisphereLight("#fff6e8", "#b89878", 1.5));
const lamp = new THREE.DirectionalLight("#fff1d6", 2.3);
lamp.position.set(-4, 7, 8); lamp.castShadow = true; lamp.shadow.mapSize.set(2048, 2048);
Object.assign(lamp.shadow.camera, { left: -8, right: 8, top: 6, bottom: -6 });
lamp.shadow.radius = 5; lamp.shadow.bias = -0.0008;
scene.add(lamp);

const M = c => new THREE.MeshStandardMaterial({ color: c, roughness: 0.8 });
const add = (geo, mat, x, y, z, parent = scene) => {
  const m = new THREE.Mesh(geo, mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m;
};

// ---------- the bookcase ----------
const wood = M("#c99566"), woodDark = M("#a8774d");
const CASE_W = 7.2, ROW_Y = 0;
add(new THREE.BoxGeometry(CASE_W + 0.6, 4.4, 0.2), woodDark, 0, 1.9, -1.1);            // back
for (const x of [-CASE_W / 2 - 0.15, CASE_W / 2 + 0.15]) add(new THREE.BoxGeometry(0.3, 4.4, 2.2), wood, x, 1.9, 0); // sides
for (const y of [ROW_Y - 0.15, 2.95]) add(new THREE.BoxGeometry(CASE_W + 0.6, 0.3, 2.2), wood, 0, y, 0);              // shelves
add(new THREE.BoxGeometry(CASE_W + 1, 0.3, 2.4), woodDark, 0, 4.15, 0);                 // top
add(new THREE.BoxGeometry(CASE_W + 1, 0.5, 2.4), woodDark, 0, -0.55, 0);                // base
// a rubber duck and a little plant keep the shelves company
duck(2.7, ROW_Y, 0.3, 0.55);
duck(-2.2, 3.1, 0.1, 0.42, -0.5);
plant(1.6, 3.1, 0.2);
stackOfBooks(-1.2, 3.1, 0);

// ---------- books ----------
const books = [];
const sizes = [[0.62, 2.35, 1.6], [0.42, 1.95, 1.45], [0.5, 2.1, 1.5], [0.46, 2.2, 1.5]];
let x0 = -CASE_W / 2 + 0.5;
const ready = document.fonts ? document.fonts.load('600 48px "Fredoka"').catch(() => {}) : Promise.resolve();
ready.then(async () => {
  for (const [i, s] of STORIES.entries()) {
    const [w, h, d] = sizes[i % sizes.length];
    const cover = await coverTexture(s, h / d);
    const spine = spineTexture(s, w / h);
    const pages = M("#fbf3df"), coverMat = new THREE.MeshStandardMaterial({ map: cover, roughness: 0.7 });
    const back = M(s.spine), spineMat = new THREE.MeshStandardMaterial({ map: spine, roughness: 0.7 });
    // box faces: +x, -x, +y, -y, +z, -z. The cover is on +x, the spine faces us on +z.
    const book = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), [coverMat, back, pages, pages, spineMat, pages]);
    book.castShadow = book.receiveShadow = true;
    const tilt = i === STORIES.length - 1 ? -0.12 : 0;
    book.position.set(x0 + w / 2, ROW_Y + h / 2, 0.15); book.rotation.z = tilt;
    x0 += w + 0.08;
    book.userData = { story: s, home: book.position.clone(), homeRot: book.rotation.clone(), out: 0 };
    scene.add(book); books.push(book);
  }
  resize();
});

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
    try { await img.decode(); const iw = W - 80, ih = iw * 0.75; g.fillStyle = "#4a3b30"; g.fillRect(36, 306, iw + 8, ih + 8); g.drawImage(img, 40, 310, iw, ih); } catch {}
  } else {
    g.fillStyle = "rgba(255,255,255,.35)"; g.font = `600 ${W * 0.5}px "Fredoka", sans-serif`; g.textAlign = "center";
    g.fillText(s.soon ? "?" : "★", W / 2, H * 0.62);
  }
  g.fillStyle = s.ink; g.textAlign = "center"; g.textBaseline = "middle";
  let size = 96; g.font = `600 ${size}px "Fredoka", sans-serif`;
  const words = s.title.split(" "), lines = [""];
  for (const w of words) { const t = (lines.at(-1) + " " + w).trim(); if (g.measureText(t).width > W - 80 && lines.at(-1)) lines.push(w); else lines[lines.length - 1] = t; }
  lines.forEach((l, i) => g.fillText(l, W / 2, 110 + i * 100));
  g.font = `500 48px "Fredoka", sans-serif`; g.fillText(s.soon ? "Coming soon" : "Who Was Where?", W / 2, H - 90);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t;
}

function duck(x, y, z, s, ry = 0.5) {
  const g = new THREE.Group(), yel = M("#ffd43b");
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
  ["#4dabf7", "#e8505b", "#b197fc"].forEach((c, i) => {
    const b = add(new THREE.BoxGeometry(1.3 - i * 0.12, 0.22, 1.0), M(c), x, y + 0.11 + i * 0.22, z);
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
  const needW = narrow ? 4.2 : CASE_W + 1.6, needH = narrow ? 3.6 : 5.6;
  view.x = narrow ? -1.95 : 0; view.look.set(view.x, narrow ? 0.4 : 1.7, 0); view.y = narrow ? 0.3 : 1.8;
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
  return ray.intersectObjects(books)[0]?.object || null;
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
