// The story book: a board book whose pages curl over like an ebook's (js/book.js). Map pages are puzzles,
// and solving one unlocks the pages after it.
import { check, hint } from "./logic.js";
import { Map3D } from "./map3d.js";
import { Book } from "./book.js";

const $ = id => document.getElementById(id);
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const ART = window.ART || { places: {}, portraits: {} };
const PUZZLES = Object.fromEntries([...(window.BOOK || []), ...(window.TUTORIAL || [])].map(c => [c.id, c]));
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const params = new URLSearchParams(location.search);
const story = window.STORIES.find(s => s.id === params.get("s") && !s.soon) || window.STORIES[0];

// ---------- the book's pages ----------
// Story text is always the same size. Pages in stories.js are written to fit a phone held sideways.
// A bigger screen puts several of them on one page (only at those page breaks), and a page that still
// doesn't fit flows onto the next page (at a paragraph break when it can).
let pages = [];
const oneEach = ch => ch.pages.map((pg, i) => ({ i, text: pg.text, end: i === ch.pages.length - 1 }));
function buildPages(split = (ch, paras) => [paras], group = oneEach) {
  const out = [];
  if (story.chapters.some(ch => ch.pages.length)) out.push({ kind: "title" });
  story.chapters.forEach((ch, ci) => {
    group(ch).forEach(({ i, text, end }) => {
      const head = i === 0, last = end && !!(ch.puzzle && PUZZLES[ch.puzzle]);
      const parts = split(ch, text, head, last);
      parts.forEach((paras, part) => out.push({ kind: "story", ch, ci, i, part, paras,
        head: head && part === 0, last: last && part === parts.length - 1 }));
    });
    if (ch.puzzle && PUZZLES[ch.puzzle]) out.push({ kind: "puzzle", ch, ci, c: PUZZLES[ch.puzzle] });
  });
  out.push({ kind: "end" });
  pages = out;
}
buildPages();

const blank = () => ({ pos: {}, role: {}, marks: {}, crossed: {}, notes: {} });
const stateOf = c => Object.assign(blank(), store.get("wwW:" + c.id) || {});
// Once solved, a map keeps its later pages unlocked even if the player changes it afterwards.
const solved = c => { const s = store.get("wwW:" + c.id); return !!(s?.solved || s?.everSolved); };
// A page is locked while any map before it is unsolved.
const lockedAt = i => pages.slice(0, i).some(p => p.kind === "puzzle" && !solved(p.c));
const firstPageOf = ci => pages.findIndex(p => p.ci === ci);

// ---------- theme and top bar ----------
const theme = story.theme || {};
const root = document.documentElement.style;
for (const [k, v] of Object.entries({ accent: theme.accent, "accent-ink": theme.accentInk, soft: theme.soft }))
  if (v) root.setProperty("--" + k, v);
$("storyTitle").textContent = story.title;
document.title = story.title + " · Hunchkins";
$("helpBtn").onclick = () => $("help").showModal();
if (story.pdf) $("pdfLink").href = story.pdf; else $("pdfLink").remove();

// ---------- the book ----------
let at = 0;
const bookmark = store.get("wwW:at:" + story.id);

// ---------- the book ----------
// The book turns in "leaves". On a phone each leaf is one page. On a wide screen it is an open spread of two
// pages, like a real book: story pages pair up, and each map fills a spread of its own.
const isWide = () => { const v = $("viewport"); return v.clientWidth >= 600 && v.clientWidth >= v.clientHeight * 1.1; };
let wide = isWide(), leaves = [];
function buildLeaves() {
  leaves = [];
  if (!wide) { pages.forEach((_, i) => leaves.push({ L: "prev", R: i, pages: [i] })); return; }
  let buf = null;   // a story page waiting for a partner on the right
  const flush = () => { if (buf !== null) leaves.push({ L: buf, R: "blank", pages: [buf] }); buf = null; };
  pages.forEach((p, i) => {
    if (p.kind === "title") leaves.push({ L: "cover", R: i, pages: [i] });
    else if (p.kind === "puzzle") { flush(); leaves.push({ L: "dock", R: "map", pages: [i] }); }
    else if (p.kind === "end") { if (buf !== null) { leaves.push({ L: buf, R: i, pages: [buf, i] }); buf = null; } else leaves.push({ L: i, R: "back", pages: [i] }); }
    else if (buf === null) buf = i;
    else { leaves.push({ L: buf, R: i, pages: [buf, i] }); buf = null; }
  });
  flush();
}
buildLeaves();
const leafOf = i => Math.max(0, leaves.findIndex(l => l.pages.includes(i)));
const pageOf = u => leaves[u].pages[0];

const book = new Book($("viewport"), {
  get count() { return leaves.length; },
  wide: () => wide,
  isSpread: u => pages[pageOf(u)].kind === "puzzle",
  canGo: u => !lockedAt(pageOf(u)),
  left: leftPage, right: rightPage,
  onShow: u => { at = pageOf(u); afterTurn(); },
  onLocked: () => toast("🔒 Solve the map to turn the page."),
});

// Measure pages with a hidden copy of a story page at this screen's size.
function paginate() {
  const { W, H } = book.dims(wide ? "spread" : "page");
  const probe = document.createElement("div");
  probe.className = "bk-body probe"; probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = `--W:${W}px; --H:${H}px; visibility:hidden; pointer-events:none; transform:none;`;
  probe.innerHTML = `<div class="bk-slot bk-right" style="left:0"><article class="pg sheet story"></article></div>`;
  $("viewport").append(probe);
  const sheet = probe.querySelector("article");
  const fits = (ch, paras, head, last) => {
    sheet.innerHTML = storyHTML(ch, paras, head, last, 0);
    const pr = sheet.firstElementChild;
    return pr.scrollHeight <= pr.clientHeight + 1;
  };
  buildPages((ch, paras, head, last) => {
    const parts = []; let cur = [];
    const isHead = () => head && !parts.length;
    for (let k = 0; k < paras.length; k++) {
      const para = paras[k];
      if (fits(ch, [...cur, para], isHead(), false)) { cur.push(para); continue; }
      if (cur.length) { parts.push(cur); cur = []; }
      if (fits(ch, [para], isHead(), false)) { cur = [para]; continue; }
      // one long paragraph: break it between words
      let words = para.split(" ");
      while (words.length) {
        let n = words.length;
        while (n > 1 && !fits(ch, [words.slice(0, n).join(" ")], isHead(), false)) n--;
        const piece = words.slice(0, n).join(" "); words = words.slice(n);
        if (words.length) parts.push([piece]); else cur = [piece];
      }
    }
    if (last && !fits(ch, cur, isHead(), true)) { parts.push(cur); cur = []; }   // the "Turn to the map" button
    parts.push(cur);
    // Two pages from one: move the break so both pages hold about the same amount, not one line on its own.
    if (parts.length === 2 && parts[1].length && parts.flat().length === paras.length && paras.length > 2) {
      const len = list => list.join(" ").length;
      let best = null;
      for (let j = 1; j < paras.length; j++) {
        const a = paras.slice(0, j), b = paras.slice(j);
        if (!fits(ch, a, head, false) || !fits(ch, b, false, last)) continue;
        const score = Math.abs(len(a) - len(b));
        if (!best || score < best.score) best = { score, parts: [a, b] };
      }
      if (best) return best.parts;
    }
    return parts;
  }, ch => {   // join whole pages while they fit together
    const groups = [];
    ch.pages.forEach((pg, i) => {
      const end = i === ch.pages.length - 1, puzzle = !!(ch.puzzle && PUZZLES[ch.puzzle]);
      const g = groups[groups.length - 1];
      if (g && fits(ch, [...g.text, ...pg.text], g.i === 0, end && puzzle)) { g.text = [...g.text, ...pg.text]; g.end = end; return; }
      groups.push({ i, text: pg.text, end });
    });
    return groups;
  });
  probe.remove();
}
const pageKey = p => p ? [p.kind, p.ci, p.i ?? "", p.part ?? ""].join(":") : "";
function relayout() {   // after a rotate or resize: pages may break differently, so rebuild on the same spot
  const key = pageKey(pages[at]), was = pages[at];
  wide = isWide(); paginate(); buildLeaves();
  let i = pages.findIndex(p => pageKey(p) === key);
  if (i < 0) i = pages.findIndex(p => p.kind === was?.kind && p.ci === was?.ci && p.i === was?.i);
  at = Math.max(0, i); book.show(leafOf(at));
}
let lastSize = "", resizeT = 0;
addEventListener("resize", () => {
  clearTimeout(resizeT);
  resizeT = setTimeout(() => {
    const { W, H } = book.dims(isWide() ? "spread" : "page"), size = `${isWide()}:${W}x${H}`;
    if (size === lastSize || book.turning) return;
    lastSize = size; relayout();
  }, 150);
});
function go(i) {
  if (i < 0 || i >= pages.length || lockedAt(i)) return;
  const u = leafOf(i), cur = leafOf(at);
  if (u === cur) return;
  if (u === cur + 1 || u === cur - 1) return book.turn(u - cur);
  book.show(u);
}
const turn = d => book.turn(d);

function afterTurn() {
  const p = pages[at];
  store.set("wwW:at:" + story.id, at);
  history.replaceState(null, "", `?s=${story.id}&p=${at}`);
  const ch = p.ch;
  $("chapterName").textContent = ch ? ch.title + (p.kind === "puzzle" ? " · the map" : "") : p.kind === "end" ? "The end" : "";
  const u = leafOf(at), last = u === leaves.length - 1;
  $("prev").disabled = u === 0;
  const locked = !last && lockedAt(pageOf(u + 1));
  $("next").disabled = last;
  $("next").classList.toggle("locked", locked);
  $("next").setAttribute("aria-label", locked ? "Solve the map to unlock the next page" : "Next page");
  document.body.classList.toggle("on-puzzle", p.kind === "puzzle");
  renderProgress(); renderContents();
}

$("prev").onclick = () => turn(-1);
$("next").onclick = () => turn(1);
document.addEventListener("keydown", e => {
  if (e.target.closest("input, select, textarea, dialog") || $("help").open) return;
  if (e.key === "ArrowRight") turn(1);
  if (e.key === "ArrowLeft") turn(-1);
});

function renderProgress() {
  // one little bar per page, grouped by chapter; map pages are wider
  let html = "", lastCi = null;
  pages.forEach((p, i) => {
    if (p.ci !== lastCi && i) html += `<span class="gap"></span>`;
    lastCi = p.ci;
    const here = leaves[leafOf(at)].pages.includes(i);
    const cls = [p.kind, here ? "on" : "", i < at && !here ? "done" : "", lockedAt(i) ? "locked" : ""].join(" ");
    html += `<i class="${cls}"></i>`;
  });
  $("progress").innerHTML = html;
}

// ---------- contents ----------
$("contentsBtn").onclick = e => { e.stopPropagation(); const c = $("contents"); c.hidden = !c.hidden; $("contentsBtn").setAttribute("aria-expanded", !c.hidden); };
document.addEventListener("click", e => { if (!e.target.closest("#contents, #contentsBtn")) $("contents").hidden = true; });
function renderContents() {
  $("contentsList").innerHTML = story.chapters.map((ch, ci) => {
    const i = firstPageOf(ci), locked = lockedAt(i), c = ch.puzzle && PUZZLES[ch.puzzle];
    const mark = locked ? "🔒" : c && solved(c) ? "✓" : "";
    return `<li><button type="button" data-p="${i}" ${locked ? "disabled" : ""} class="${pages[at]?.ci === ci ? "here" : ""}">
      <span>${ch.title}</span><b>${mark}</b></button></li>`;
  }).join("");
  $("contentsList").querySelectorAll("button").forEach(b => b.onclick = () => { $("contents").hidden = true; go(+b.dataset.p); });
}

// ---------- building pages ----------
// Each spread has a left and a right page. Reading, the right page is the current one and the left page is
// the one before it. A map fills the whole spread: suspects and clues on the left, the map on the right
// (on a phone, the map and the panel share one tall page).
function leftPage(u) {
  const L = leaves[u].L;
  if (L === "dock") { openPuzzle(pages[pageOf(u)].c); return mountDock(); }
  if (L === "cover") return paper("endpaper");
  if (L !== "prev") return buildSheet(L);
  // one page at a time: the left page is the one before, running off the screen
  const i = pageOf(u), p = pages[i];
  if (p.kind === "puzzle" || i === 0) return paper("endpaper");
  const prev = pages[i - 1];
  if (prev.kind === "puzzle") return paper("solved", `<div><b>✓</b><p>${prev.ch.title.replace(/^Chapter \d+: /, "")}</p><p class="small">Map solved</p></div>`);
  return buildSheet(i - 1);
}
function rightPage(u) {
  const R = leaves[u].R;
  if (R === "map") { openPuzzle(pages[pageOf(u)].c); return mountMap(); }
  if (R === "blank") return paper("blank");
  if (R === "back") return paper("endpaper");
  const p = pages[R];
  if (p.kind === "puzzle") { openPuzzle(p.c); return mountFull(); }
  return buildSheet(R);
}
function paper(cls, html = "") { const e = document.createElement("article"); e.className = "pg " + cls; e.innerHTML = html; return e; }

function buildSheet(i) {
  const p = pages[i], el = document.createElement("article");
  el.className = "pg sheet " + p.kind;
  if (p.kind === "title") {
    const resume = bookmark > 0 && bookmark < pages.length && !lockedAt(bookmark) ? bookmark : 0;
    el.innerHTML = `<div class="cover-text"><p class="kicker">A Hunchkins mystery</p><h1>${story.title}</h1><p>${story.teaser}</p>
      <div class="cover-actions"><button class="primary big" type="button" data-go="1">Start reading</button>
      ${resume > 1 ? `<button class="big" type="button" data-go="${resume}">Continue: ${pages[resume].ch?.title || "where you were"}</button>` : ""}</div></div>`;
  } else if (p.kind === "story") {
    el.innerHTML = storyHTML(p.ch, p.paras, p.head, p.last, i);
  } else {
    const tut = story.id === "tutorial", main = window.STORIES.find(s => !s.soon && s.id !== "tutorial");
    el.innerHTML = `<h2>${tut ? "You're ready!" : "Case closed!"}</h2>
      <p>${tut ? "Now try a real mystery." : "More mysteries are on their way. Come back soon!"}</p>
      <div class="cover-actions">${tut && main ? `<a class="btn primary" href="play.html?s=${main.id}">Open ${main.title}</a>` : ""}
      <a class="btn" href="./">Back to the bookshelf</a>${story.pdf ? `<a class="btn" href="${story.pdf}" download>⬇ Printable PDF</a>` : ""}</div>`;
  }
  el.querySelectorAll("[data-go]").forEach(b => b.onclick = () => go(+b.dataset.go));
  return el;
}
function storyHTML(ch, paras, head, last, i) {
  const m = ch.title.match(/^(Chapter \d+): (.*)$/);
  const h = !head ? "" : m ? `<p class="ch-label">${m[1]}</p><h2>${m[2]}</h2>` : `<h2>${ch.title}</h2>`;
  return `<div class="prose">${h}${paras.map(t => `<p>${t}</p>`).join("")}
    ${last ? `<button class="primary" type="button" data-go="${i + 1}">Turn to the map →</button>` : ""}</div>
    <span class="folio">${i + 1}</span>`;
}

// ---------- the puzzle ----------
const solverEl = $("solverTpl").content.firstElementChild.cloneNode(true);
const mapboxEl = solverEl.querySelector("#mapbox"), dockEl = solverEl.querySelector(".dock");
const dockPage = paper("dock-page"), mapPage = paper("map-page"), fullPage = paper("full-page");
// The tutorial coach sits in the panel on a two-page spread (so it never hides the map), and over the map on phones.
const coachEl = mapboxEl.querySelector("#coach");
function mountDock() { dockEl.querySelector(".people").after(coachEl); dockPage.append(dockEl); return dockPage; }
function mountMap() { mapPage.append(mapboxEl); return mapPage; }
function mountFull() { mapboxEl.append(coachEl); fullPage.append(mapboxEl, dockEl); return fullPage; }
let c = null, st = null, selected = null, focus = null, tool = "place";
const save = () => c && store.set("wwW:" + c.id, st);
const map = new Map3D(mapboxEl, { tap: tapSpot, hold: placeAt, move: movePerson, clue: i => { focus = { clue: i }; renderSolver(); } });
const q = sel => sel === "#mapbox" ? mapboxEl : mapboxEl.querySelector(sel) || dockEl.querySelector(sel);

function openPuzzle(pc) {
  if (c !== pc) { c = pc; st = stateOf(c); selected = null; focus = null; map.setCase(c); }
  q("#question").textContent = c.story;
  setTool("place"); renderSolver();
}

function renderSolver() {
  map.update(st, selected);
  map.showClue(focus && "clue" in focus ? focus.clue : -1);
  renderPeople(); renderDetail(); renderCoach();
}

function portrait(name, color) {
  const a = ART.portraits[name];
  return a ? `<svg class="face" viewBox="${ART.portraitBox}" aria-hidden="true">${a}</svg>`
           : `<span class="face initial" style="background:${color}">${name[0]}</span>`;
}

function renderPeople() {
  const spotName = Object.fromEntries(c.spots.map(s => [s.id, s.name]));
  const people = q("#people"); people.innerHTML = "";
  for (const p of c.suspects) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "person" + (selected === p.name ? " sel" : "") + (st.pos[p.name] ? " placed" : "");
    b.style.setProperty("--c", p.color);
    b.innerHTML = `${portrait(p.name, p.color)}<span class="pname">${p.name}</span><span class="where">${st.pos[p.name] ? spotName[st.pos[p.name]] : "not placed"}</span>`;
    dragOrSelect(b, p.name);
    people.appendChild(b);
  }
}

// What people said and the evidence. On a wide screen it is all listed; on a phone the panel has a fixed
// height and shows just the picked person or the clue tapped on the map.
function renderDetail() {
  const box = q("#detail"); box.innerHTML = "";
  const roleList = c.roles.length ? ["honest", ...c.roles] : [];
  const roleLabel = { honest: "Honest", fibber: "Fibber", muddler: "Muddler" };
  const showing = focus?.who || (focus && "clue" in focus ? null : selected);
  box.insertAdjacentHTML("beforeend", `<div class="sec-title">What they said</div>`);
  for (const p of c.suspects) {
    const says = document.createElement("div");
    says.className = "says item" + (showing === p.name ? " on" : "");
    says.style.setProperty("--c", p.color);
    says.innerHTML = `<div class="who">${p.name} said:</div>`;
    const ul = document.createElement("ul");
    c.statements[p.name].forEach((s, k) => {
      const li = document.createElement("li"), mk = st.marks[p.name + k] || "";
      if (mk) li.className = mk;
      li.textContent = `“${s.text}”`;
      li.onclick = () => { st.marks[p.name + k] = { "": "t", t: "f", f: "" }[mk]; save(); renderDetail(); };
      ul.appendChild(li);
    });
    says.appendChild(ul);
    if (roleList.length) {
      const roles = document.createElement("div"); roles.className = "roles";
      for (const r of roleList) {
        const rb = document.createElement("button"); rb.type = "button"; rb.textContent = roleLabel[r];
        if ((st.role[p.name] || "") === r) rb.classList.add("on");
        rb.onclick = () => { st.role[p.name] = st.role[p.name] === r ? "" : r; save(); renderDetail(); };
        roles.appendChild(rb);
      }
      says.appendChild(roles);
    }
    box.appendChild(says);
  }
  box.insertAdjacentHTML("beforeend", `<div class="sec-title">Evidence</div>` + c.evidence.map((e, i) =>
    `<div class="clue item${focus && focus.clue === i ? " on" : ""}" data-clue="${i}"><span class="ico">${e.icon}</span><span><b>${c.spots.find(s => s.id === e.spot)?.name || ""}</b> ${e.text}</span></div>`).join(""));
  const anyOn = box.querySelector(".item.on");
  box.insertAdjacentHTML("beforeend", `<p class="pick${anyOn ? "" : " on"}">Tap a person to see what they said, or tap a clue <span class="mini-badge">${c.evidence[0]?.icon || "🔍"}</span> on the map.</p>`);
  box.classList.toggle("has-focus", !!anyOn);
  box.querySelectorAll(".clue").forEach(el => el.onclick = () => { focus = { clue: +el.dataset.clue }; renderSolver(); });
}

// A person button: tap selects, dragging drops them onto the map.
function dragOrSelect(btn, name) {
  btn.addEventListener("pointerdown", e => {
    if (e.button > 0) return;
    const x0 = e.clientX, y0 = e.clientY; let ghost = null;
    const move = ev => {
      if (!ghost && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 8) {
        ghost = btn.querySelector(".face").cloneNode(true); ghost.classList.add("ghost");
        ghost.style.setProperty("--c", btn.style.getPropertyValue("--c"));
        document.body.appendChild(ghost); selected = name;
      }
      if (ghost) {
        ghost.style.transform = `translate(${ev.clientX}px, ${ev.clientY}px) translate(-50%, -60%)`;
        map.hot = map.spotAt(ev.clientX, ev.clientY);
      }
    };
    const up = ev => {
      removeEventListener("pointermove", move); removeEventListener("pointerup", up);
      if (ghost) {
        ghost.remove(); map.hot = null;
        const id = map.spotAt(ev.clientX, ev.clientY);
        if (id) { selected = name; focus = { who: name }; placeAt(id); } else renderSolver();
      } else {
        selected = selected === name ? null : name;
        focus = selected ? { who: name } : null;
        if (tool !== "place") setTool("place");
        renderSolver();
      }
    };
    addEventListener("pointermove", move); addEventListener("pointerup", up);
  });
}

const occupantOf = id => Object.keys(st.pos).find(n => st.pos[n] === id);
function tapSpot(id) {
  if (tool === "cross") {
    if (!occupantOf(id)) st.crossed[id] = !st.crossed[id];
  } else if (selected) {
    const list = st.notes[id] || (st.notes[id] = []);
    const k = list.indexOf(selected);
    if (k >= 0) list.splice(k, 1); else list.push(selected);
    const order = c.suspects.map(p => p.name);
    list.sort((a, b) => order.indexOf(a) - order.indexOf(b));
  } else {
    const ev = c.evidence.findIndex(e => e.spot === id);
    if (ev >= 0) { focus = { clue: ev }; renderSolver(); return; }
    toast("Pick a person first. Then tap a place for a maybe, or press and hold to place them.");
  }
  markUnsolved(); save(); renderSolver();
}
// Dragging a pawn on the map to another place moves that person there.
function movePerson(name, id) {
  if (st.pos[name] === id) return;
  const occupant = occupantOf(id);
  if (occupant) delete st.pos[occupant];
  st.pos[name] = id; st.crossed[id] = false; selected = null; focus = { who: name };
  markUnsolved(); save(); renderSolver();
}
function placeAt(id) {
  const occupant = occupantOf(id);
  if (selected) {
    if (occupant && occupant !== selected) delete st.pos[occupant];
    if (occupant === selected) delete st.pos[selected];
    else { st.pos[selected] = id; st.crossed[id] = false; }
    selected = null;
  } else if (occupant) {
    delete st.pos[occupant]; toast(`Picked ${occupant} back up.`);
  }
  markUnsolved(); save(); renderSolver();
}
function markUnsolved() { if (st.solved) st.everSolved = true; st.solved = false; }

function setTool(t) {
  tool = t;
  q("#toolPlace").classList.toggle("on", t === "place");
  q("#toolCross").classList.toggle("on", t === "cross");
  if (t === "cross") { selected = null; renderSolver(); toast("Tap places you know were empty to cross them out."); }
}
q("#toolPlace").onclick = () => setTool("place");
q("#toolCross").onclick = () => setTool("cross");

let toastTimer = null;
function toast(msg, kind = "") {
  const t = $("toast"); t.textContent = msg; t.className = "toast show " + kind;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), kind === "win" ? 6000 : 3800);
}

q("#check").onclick = () => {
  const r = check(c, st);
  if (r.ok) {
    st.solved = true; save(); renderCoach(); celebrate(); afterTurn();
    $("next").classList.add("ready"); setTimeout(() => $("next").classList.remove("ready"), 4000);
  }
  toast(r.ok ? "🎉 " + r.message + " The next page is unlocked." : r.message, r.ok ? "win" : "no");
};
q("#hintBtn").onclick = () => toast("💡 " + hint(c, st));
q("#moreBtn").onclick = () => { const m = q("#menu"); m.hidden = !m.hidden; q("#moreBtn").setAttribute("aria-expanded", !m.hidden); };
document.addEventListener("click", e => { if (!e.target.closest(".more")) q("#menu").hidden = true; });
q("#reset").onclick = () => { const was = st.solved || st.everSolved; st = blank(); if (was) st.everSolved = true; selected = null; focus = null; save(); renderSolver(); q("#menu").hidden = true; };
let armed = false;
q("#solve").onclick = () => {
  if (!armed) { armed = true; q("#solve").textContent = "Sure? Tap again"; setTimeout(() => { armed = false; q("#solve").textContent = "Show the answer"; }, 3000); return; }
  armed = false; q("#solve").textContent = "Show the answer"; q("#menu").hidden = true;
  const sol = c.solution;
  st.pos = { ...sol.positions }; st.role = {};
  for (const p of c.suspects) st.role[p.name] = "honest";
  if (sol.fibber) st.role[sol.fibber] = "fibber";
  if (sol.muddler) st.role[sol.muddler] = "muddler";
  st.solved = true; selected = null; save(); renderSolver(); afterTurn();
  toast(sol.fibber ? `Here's the answer. ${sol.fibber} was the Fibber.` : "Here's the answer. The next page is unlocked.");
};

function celebrate() {
  const box = q("#mapbox");
  for (let i = 0; i < 40; i++) {
    const d = document.createElement("i"); d.className = "confetti";
    d.style.left = Math.random() * 100 + "%"; d.style.background = ["#ffc53d", "#ff4b4b", "#1cb0f6", "#58cc02", "#ce82ff"][i % 5];
    d.style.animationDelay = Math.random() * .4 + "s"; d.style.setProperty("--dx", (Math.random() * 2 - 1) * 80 + "px");
    box.appendChild(d); setTimeout(() => d.remove(), 2200);
  }
}

// ---------- tutorial coach: one step at a time ----------
function stepDone(step) {
  const u = step.until;
  if (u === "solved") return !!st.solved;
  if (typeof u !== "object") return false;
  if (u.crossed) return u.crossed.every(id => st.crossed[id]);
  if (u.at) return Object.entries(u.at).every(([n, id]) => st.pos[n] === id);
  if (u.notes) return Object.entries(u.notes).every(([n, k]) => st.pos[n] || Object.values(st.notes).filter(l => l.includes(n)).length >= k);
  return false;
}
function renderCoach() {
  const box = q("#coach");
  if (!c.tutorial) { box.hidden = true; return; }
  st.tut = st.tut || 0;
  while (st.tut < c.tutorial.length - 1 && stepDone(c.tutorial[st.tut])) st.tut++;
  save();
  const step = c.tutorial[st.tut];
  box.hidden = false;
  box.innerHTML = `<p class="step">Step ${st.tut + 1} of ${c.tutorial.length}</p><p>${step.text.replace("Close the case", "Check my answer").replace("✋ Notes & place", "✋ Place")}</p>`;
  if (step.until === "next") {
    const b = document.createElement("button"); b.className = "primary"; b.type = "button"; b.textContent = "Next";
    b.onclick = () => { st.tut++; renderCoach(); }; box.appendChild(b);
  }
  if (step.until === "end") {
    const b = document.createElement("button"); b.className = "primary"; b.type = "button"; b.textContent = "Turn the page →";
    b.onclick = () => turn(1); box.appendChild(b);
  }
}

// Measure with the real fonts, then open the book at the right page.
await document.fonts?.ready;
paginate(); buildLeaves();
{ const d = book.dims(wide ? "spread" : "page"); lastSize = `${wide}:${d.W}x${d.H}`; }
let start = 0;
if (params.has("p")) start = +params.get("p");
else if (params.get("c")) {   // older links: ?c=<chapter>&m=solve
  const ci = story.chapters.findIndex(ch => ch.id === params.get("c"));
  start = params.get("m") === "solve" ? pages.findIndex(p => p.kind === "puzzle" && p.ci === ci) : firstPageOf(ci);
}
start = Math.max(0, Math.min(start, pages.length - 1));
while (start > 0 && lockedAt(start)) start--;
book.show(leafOf(start));
