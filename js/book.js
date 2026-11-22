// A board book that turns like an ebook. Drag a page (or tap an arrow) and it curls over:
// the fold follows your finger, the back of the page shows the next page, and soft shadows sit on both sides.
//
// The book is a two-page spread. Reading, the current page is on the right, centred on the screen, and the
// previous page runs off the left edge. A "spread" page (the maps) zooms out to show the whole open book.
//
// Turn geometry works in "turn space": the lifted page spans u = 0 (the spine) to u = W, and its free corner
// C = (W, top or bottom). The fold line is the perpendicular bisector of C and the pointer P. The part of the
// page beyond the fold is reflected across it, and that reflected part shows the back of the page.

const el = (cls, tag = "div") => { const e = document.createElement(tag); e.className = cls; return e; };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Clip a polygon to the half-plane side(X) <= 0 (Sutherland-Hodgman, one edge).
function clipPoly(poly, side) {
  const out = [];
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], sa = side(a), sb = side(b);
    if (sa <= 0) out.push(a);
    if ((sa < 0 && sb > 0) || (sa > 0 && sb < 0)) {
      const t = sa / (sa - sb);
      out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
    }
  }
  return out;
}
const polyCss = pts => pts.length < 3 ? "polygon(0 0, 0 0, 0 0)" : `polygon(${pts.map(p => `${p[0].toFixed(2)}px ${p[1].toFixed(2)}px`).join(",")})`;

export class Book {
  // o: { count, left(i), right(i), isSpread(i), canGo(i) -> true | "locked", onShow(i), onLocked() }
  constructor(viewport, o) {
    this.vp = viewport; this.o = o;
    this.body = el("bk-body");
    this.cover = el("bk-cover");
    this.L = el("bk-slot bk-left"); this.R = el("bk-slot bk-right");
    this.gutter = el("bk-gutter");
    this.fx = el("bk-fx");
    // on map pages the page itself is busy (dragging people, tapping places), so turns start from these edge strips
    this.edgeL = el("bk-edge left"); this.edgeR = el("bk-edge right");
    this.body.append(this.cover, this.L, this.R, this.gutter, this.fx, this.edgeL, this.edgeR);
    viewport.append(this.body);
    this.at = -1; this.turning = null;
    new ResizeObserver(() => this.layout(false)).observe(viewport);
    this.bindPointer();
  }

  // ---------- size and camera ----------
  get narrow() { return this.vp.clientWidth < 760; }
  mode(i) { return this.o.isSpread(i) ? (this.narrow ? "full" : "spread") : "page"; }
  dims(mode) {
    const vw = this.vp.clientWidth, vh = this.vp.clientHeight;
    if (mode === "full") return { W: vw - 16, H: vh - 10 };
    if (this.narrow) { const W = Math.round(vw * 0.84); return { W, H: Math.round(Math.min(vh - 16, W * 1.5)) }; }
    const H = Math.round(vh - 28);
    return { W: Math.round(Math.min(H * 0.92, vw * 0.6)), H };
  }
  layout(animate = true) {
    if (this.at < 0 || this.turning) return;
    const m = this.mode(this.at), { W, H } = this.dims(m), vw = this.vp.clientWidth, vh = this.vp.clientHeight;
    this.W = W; this.H = H;
    let s = 1, x = vw / 2 - 1.5 * W, y = (vh - H) / 2;
    if (m === "spread") { s = Math.min(1, (vw - 28) / (2 * W), (vh - 14) / H); x = (vw - 2 * W * s) / 2; y = (vh - H * s) / 2; }
    this.s = s;
    this.body.classList.toggle("animate", animate);
    this.body.style.setProperty("--W", W + "px");
    this.body.style.setProperty("--H", H + "px");
    this.body.style.transform = `translate(${x}px, ${y}px) scale(${s})`;
    this.body.dataset.mode = m;
    this.vp.dataset.mode = m;
  }

  // ---------- showing a page ----------
  show(i) {
    this.at = i;
    this.L.replaceChildren(this.o.left(i));
    this.R.replaceChildren(this.o.right(i));
    this.layout(false);
    this.o.onShow?.(i);
  }

  // Turn with an animation, as for an arrow tap or a key press.
  turn(dir) {
    if (this.turning) return;
    const to = this.at + dir;
    if (to < 0 || to >= this.o.count) return;
    if (this.o.canGo(to) !== true) { this.o.onLocked?.(); this.wiggle(dir); return; }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { this.show(to); return; }
    this.begin(dir, false);
    const { W, H } = this, cy = H, t0 = performance.now(), ms = 720;
    const step = t => {
      const k = Math.min(1, (t - t0) / ms), e = ease(k);
      this.setP([W - 2 * W * e, cy - Math.sin(Math.PI * e) * H * 0.14 - 1]);
      if (k < 1) requestAnimationFrame(step); else this.finish(true);
    };
    requestAnimationFrame(step);
  }
  wiggle(dir) {
    this.body.animate([{ translate: "0 0" }, { translate: `${-dir * 10}px 0` }, { translate: `${dir * 6}px 0` }, { translate: "0 0" }], { duration: 320 });
  }

  // ---------- the curl ----------
  begin(dir, top) {
    const W = this.W, H = this.H, to = this.at + dir;
    const front = (dir > 0 ? this.R : this.L).firstElementChild;
    const under = dir > 0 ? this.o.right(to) : this.o.left(to);
    const backPage = dir > 0 ? this.o.left(to) : this.o.right(to);
    const slot = dir > 0 ? this.R : this.L;
    const underShade = el("bk-shade under"), frontShade = el("bk-shade front");
    slot.prepend(under, underShade);
    slot.append(frontShade);
    const back = el("bk-back"); back.append(backPage); const backShade = el("bk-shade back"); back.append(backShade);
    back.style.width = W + "px"; back.style.height = H + "px";
    this.fx.replaceChildren(back);
    this.turning = { dir, to, top, front, under, backPage, back, slot, underShade, frontShade, backShade, C: [W, top ? 0 : H] };
    this.body.classList.add("turning");
    this.setP([W - 0.5, top ? 0.5 : H - 0.5]);
  }

  setP(P) {
    const T = this.turning; if (!T) return;
    const W = this.W, H = this.H, C = T.C, cy = C[1];
    // keep the page attached at the spine: the pointer can't pull the corner further than the page allows
    const S = [0, cy], S2 = [0, H - cy], diag = Math.hypot(W, H);
    let d = Math.hypot(P[0] - S[0], P[1] - S[1]);
    if (d > W) P = [S[0] + (P[0] - S[0]) * W / d, S[1] + (P[1] - S[1]) * W / d];
    d = Math.hypot(P[0] - S2[0], P[1] - S2[1]);
    if (d > diag) P = [S2[0] + (P[0] - S2[0]) * diag / d, S2[1] + (P[1] - S2[1]) * diag / d];
    T.P = P;
    const len = Math.hypot(C[0] - P[0], C[1] - P[1]);
    if (len < 0.5) { T.front.style.clipPath = ""; T.back.style.visibility = "hidden"; return; }
    T.back.style.visibility = "";
    const n = [(C[0] - P[0]) / len, (C[1] - P[1]) / len], M = [(C[0] + P[0]) / 2, (C[1] + P[1]) / 2];
    const side = X => dot([X[0] - M[0], X[1] - M[1]], n);
    const rect = [[0, 0], [W, 0], [W, H], [0, H]];
    const keep = clipPoly(rect, side), cut = clipPoly(rect, X => -side(X));
    const fwd = T.dir > 0;
    const toLocal = p => fwd ? p : [W - p[0], p[1]];     // turn space -> the lifted page's own slot
    T.front.style.clipPath = polyCss(keep.map(toLocal));

    // the back of the page: reflect across the fold
    const r00 = 1 - 2 * n[0] * n[0], r01 = -2 * n[0] * n[1], r11 = 1 - 2 * n[1] * n[1];
    const md = 2 * dot(M, n), tR = [md * n[0], md * n[1]];
    let a, b, c, dd, e, f, backClip;
    if (fwd) { // back-local x' -> leaf u = W - x' -> reflected
      a = -r00; b = -r01; c = r01; dd = r11; e = W * r00 + tR[0]; f = W * r01 + tR[1];
      backClip = cut.map(p => [W - p[0], p[1]]);
    } else {   // mirrored: the left page lifts and folds to the right
      a = -r00; b = r01; c = -r01; dd = r11; e = -tR[0]; f = tR[1];
      backClip = cut;
    }
    T.back.style.transform = `translate(${this.W}px, 0) matrix(${a}, ${b}, ${c}, ${dd}, ${e}, ${f})`;
    T.back.style.clipPath = polyCss(backClip);

    // shadows: on the page underneath beyond the fold, on the front just before it, and a sheen on the back
    const nl = fwd ? n : [-n[0], n[1]], Ml = toLocal(M);
    const ang = Math.atan2(nl[1], nl[0]) * 180 / Math.PI, reach = Math.min(1, len / W);
    const place = (s, mx, my, deg) => { s.style.transform = `translate(${mx}px, ${my}px) rotate(${deg}deg)`; };
    place(T.underShade, Ml[0], Ml[1], ang);
    T.underShade.style.opacity = (0.55 * (1 - reach * 0.6)).toFixed(3);
    place(T.frontShade, Ml[0], Ml[1], ang + 180);
    T.frontShade.style.opacity = (0.35 * Math.min(1, reach * 3)).toFixed(3);
    const Mb = fwd ? [W - M[0], M[1]] : M, nb = fwd ? [-n[0], n[1]] : n;
    place(T.backShade, Mb[0], Mb[1], Math.atan2(nb[1], nb[0]) * 180 / Math.PI);
  }

  finish(complete) {
    const T = this.turning; if (!T) return;
    T.front.style.clipPath = "";
    T.underShade.remove(); T.frontShade.remove();
    if (complete) {
      T.front.remove();
      T.backPage.style.clipPath = "";
      (T.dir > 0 ? this.L : this.R).replaceChildren(T.backPage);
      this.fx.replaceChildren();
      this.at = T.to;
    } else {
      T.under.remove();
      this.fx.replaceChildren();
    }
    this.turning = null;
    this.body.classList.remove("turning");
    this.layout(true);
    if (complete) this.o.onShow?.(this.at);
    else this.o.onCancel?.(this.at);
  }

  // Animate the corner from where it is to the end (or back), then finish.
  settleTo(complete) {
    const T = this.turning; if (!T) return;
    const from = T.P || T.C, to = complete ? [-this.W, T.C[1]] : T.C, t0 = performance.now();
    const ms = 260 + 260 * Math.hypot(to[0] - from[0], to[1] - from[1]) / (2 * this.W);
    const step = t => {
      const k = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - k, 3);
      this.setP([from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e + (complete ? -Math.sin(Math.PI * e) * this.H * 0.05 : 0)]);
      if (k < 1) requestAnimationFrame(step); else this.finish(complete);
    };
    requestAnimationFrame(step);
  }

  // ---------- pointer: drag a page to curl it, tap near an edge to turn ----------
  bindPointer() {
    const vp = this.vp;
    let down = null;
    const local = e => {   // pointer in book-body coordinates (unscaled)
      const r = this.body.getBoundingClientRect();
      return [(e.clientX - r.left) / this.s, (e.clientY - r.top) / this.s];
    };
    vp.addEventListener("pointerdown", e => {
      if (this.turning || e.button > 0) return;
      if (e.target.closest("button, a, input, select, .person, canvas, .badge, .dock, .menu")) {
        // on a map page, only the outer page edges start a turn
        if (!e.target.closest(".bk-edge")) return;
      }
      const p = local(e);
      if (this.mode(this.at) !== "page" && !e.target.closest(".bk-edge")) return;
      down = { x: e.clientX, y: e.clientY, p, id: e.pointerId, t: performance.now(), dir: p[0] >= this.W ? 1 : -1, started: false, last: [e.clientX, performance.now()], vx: 0 };
    });
    addEventListener("pointermove", e => {
      if (!down || e.pointerId !== down.id) return;
      const dx = e.clientX - down.x, dy = e.clientY - down.y;
      const now = performance.now();
      down.vx = (e.clientX - down.last[0]) / Math.max(1, now - down.last[1]); down.last = [e.clientX, now];
      if (!down.started) {
        if (Math.hypot(dx, dy) < 8) return;
        if (Math.abs(dx) < Math.abs(dy)) { down = null; return; }
        // drag left on the right page = forward; drag right on the left page (or anywhere, phones) = back
        let dir = dx < 0 ? 1 : -1;
        const to = this.at + dir;
        if (to < 0 || to >= this.o.count) { down = null; return; }
        down.locked = this.o.canGo(to) !== true;
        down.dir = dir; down.started = true;
        this.begin(dir, down.p[1] < this.H * 0.35);
      }
      const T = this.turning; if (!T) return;
      let u = T.C[0] - (T.dir > 0 ? -dx : dx) / this.s;
      if (down.locked) u = Math.max(u, this.W * 0.72);
      this.setP([u, T.C[1] + dy / this.s * 0.6]);
    });
    const up = e => {
      if (!down || e.pointerId !== down.id) return;
      const d = down; down = null;
      if (!d.started) {
        // a tap near the outer edge of a page turns it, like an ebook
        const p = d.p, W = this.W;
        if (this.mode(this.at) === "page" && !e.target.closest("button, a")) {
          if (p[0] > W * 1.72) this.turn(1);                  // outer part of the right page: forward
          else if (p[0] >= 0 && p[0] < W * 1.2) this.turn(-1); // the left page, or the inner edge of the right one: back
        }
        return;
      }
      const T = this.turning; if (!T) return;
      const fling = T.dir > 0 ? d.vx < -0.5 : d.vx > 0.5;
      const complete = !d.locked && (T.P[0] < this.W * 0.45 || fling);
      if (d.locked) this.o.onLocked?.();
      this.settleTo(complete);
    };
    addEventListener("pointerup", up);
    addEventListener("pointercancel", up);
  }
}
