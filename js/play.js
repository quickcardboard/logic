// The story book: one page at a time, turned with a 3D page flip. Map pages are puzzles,
// and solving one unlocks the pages after it.
import { check, hint } from "./logic.js";
import { Map3D } from "./map3d.js";

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
const pages = [];
if (story.chapters.some(ch => ch.pages.length)) pages.push({ kind: "title" });
story.chapters.forEach((ch, ci) => {
  ch.pages.forEach((pg, i) => pages.push({ kind: "story", ch, ci, i, pg }));
  if (ch.puzzle && PUZZLES[ch.puzzle]) pages.push({ kind: "puzzle", ch, ci, c: PUZZLES[ch.puzzle] });
});
pages.push({ kind: "end" });

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
for (const [k, v] of Object.entries({ accent: theme.accent, "accent-ink": theme.accentInk, soft: theme.soft, sky: theme.sky, paper: theme.paper }))
  if (v) root.setProperty("--" + k, v);
$("storyTitle").textContent = story.title;
document.title = story.title + " · Hunchkins";
$("helpBtn").onclick = () => $("help").showModal();
if (story.pdf) $("pdfLink").href = story.pdf; else $("pdfLink").remove();

// ---------- turning pages ----------
let at = -1, sheet = null, flipping = false;
const bookmark = store.get("wwW:at:" + story.id);
let start = 0;
if (params.has("p")) start = +params.get("p");
else if (params.get("c")) {   // older links: ?c=<chapter>&m=solve
  const ci = story.chapters.findIndex(ch => ch.id === params.get("c"));
  start = params.get("m") === "solve" ? pages.findIndex(p => p.kind === "puzzle" && p.ci === ci) : firstPageOf(ci);
}
start = Math.max(0, Math.min(start, pages.length - 1));
while (start > 0 && lockedAt(start)) start--;

function go(i, dir = Math.sign(i - at)) {
  if (flipping || i === at || i < 0 || i >= pages.length) return;
  if (i > at && lockedAt(i)) { nudgeLocked(); return; }
  const next = buildSheet(i), stage = $("stage");
  const old = sheet; at = i; sheet = next;
  afterTurn();
  if (!old || reduceMotion) { stage.replaceChildren(next); settle(next); return; }
  flipping = true;
  const leaf = document.createElement("div"); leaf.className = "leaf";
  const back = document.createElement("div"); back.className = "sheet-back";
  const shade = document.createElement("div"); shade.className = "under-shade";
  const ease = "cubic-bezier(.4, .05, .25, 1)", ms = 800;
  let anim;
  if (dir > 0) {
    // the new page waits underneath while the old one turns over to the left
    stage.replaceChildren(next, shade, leaf); leaf.append(old, back);
    anim = leaf.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(-178deg)" }], { duration: ms, easing: ease });
    shade.animate([{ opacity: 0.35 }, { opacity: 0 }], { duration: ms, easing: ease });
  } else {
    // the previous page turns back over the current one
    stage.replaceChildren(old, shade, leaf); leaf.append(next, back);
    anim = leaf.animate([{ transform: "rotateY(-178deg)" }, { transform: "rotateY(0deg)" }], { duration: ms, easing: ease });
    shade.animate([{ opacity: 0 }, { opacity: 0.35 }], { duration: ms, easing: ease });
  }
  anim.finished.then(() => { stage.replaceChildren(next); flipping = false; settle(next); });
}
const turn = d => go(at + d, d);

function afterTurn() {
  const p = pages[at];
  store.set("wwW:at:" + story.id, at);
  history.replaceState(null, "", `?s=${story.id}&p=${at}`);
  const ch = p.ch;
  $("chapterName").textContent = ch ? ch.title + (p.kind === "puzzle" ? " · the map" : "") : p.kind === "end" ? "The end (for now)" : "";
  $("prev").disabled = at === 0;
  const locked = at < pages.length - 1 && lockedAt(at + 1);
  $("next").disabled = at === pages.length - 1;
  $("next").classList.toggle("locked", locked);
  $("next").setAttribute("aria-label", locked ? "Solve the map to unlock the next page" : "Next page");
  document.body.classList.toggle("on-puzzle", p.kind === "puzzle");
  renderProgress(); renderContents();
}
function settle(el) {
  if (pages[at].kind === "puzzle") { map.resize(); map.fit(); }
  el.querySelector(".prose, .sheet-scroll")?.scrollTo(0, 0);
}
function nudgeLocked() {
  toast("🔒 Solve the map to turn the page.");
  $("next").animate([{ transform: "translateX(0)" }, { transform: "translateX(6px)" }, { transform: "translateX(-6px)" }, { transform: "translateX(0)" }], { duration: 300 });
}

$("prev").onclick = () => turn(-1);
$("next").onclick = () => turn(1);
document.addEventListener("keydown", e => {
  if (e.target.closest("input, select, textarea, dialog") || $("help").open) return;
  if (e.key === "ArrowRight") turn(1);
  if (e.key === "ArrowLeft") turn(-1);
});
{ // swipe to turn, except on map pages where dragging places people
  let x0 = null, y0 = 0;
  $("stage").addEventListener("pointerdown", e => { if (pages[at].kind !== "puzzle") { x0 = e.clientX; y0 = e.clientY; } });
  $("stage").addEventListener("pointerup", e => {
    if (x0 !== null && Math.abs(e.clientX - x0) > 50 && Math.abs(e.clientX - x0) > Math.abs(e.clientY - y0)) turn(e.clientX < x0 ? 1 : -1);
    x0 = null;
  });
}

function renderProgress() {
  // one little bar per page, grouped by chapter; map pages are wider
  let html = "", lastCi = null;
  pages.forEach((p, i) => {
    if (p.ci !== lastCi && i) html += `<span class="gap"></span>`;
    lastCi = p.ci;
    const cls = [p.kind, i === at ? "on" : "", i < at ? "done" : "", lockedAt(i) ? "locked" : ""].join(" ");
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

// ---------- building a page ----------
function artFor(key) {
  if (!key) return "";
  const [kind, id] = key.includes(":") ? key.split(":") : [key, ""];
  if (kind === "place" && ART.places[id]) return `<svg viewBox="${ART.placeBox}">${ART.places[id]}</svg>`;
  if (kind === "duck" && ART.covers?.duck) return `<svg viewBox="${ART.coverBox}" preserveAspectRatio="xMidYMid slice">${ART.covers.duck}</svg>`;
  return "";
}
function buildSheet(i) {
  const p = pages[i], el = document.createElement("article");
  el.className = "sheet " + p.kind;
  if (p.kind === "title") {
    const resume = bookmark > 0 && bookmark < pages.length && !lockedAt(bookmark) ? bookmark : 0;
    el.innerHTML = `<div class="cover-art">${story.cover && ART.covers?.[story.cover] ? `<svg viewBox="${ART.coverBox}" preserveAspectRatio="xMidYMid slice">${ART.covers[story.cover]}</svg>` : ""}</div>
      <div class="cover-text"><h1>${story.title}</h1><p>${story.teaser}</p>
      <div class="cover-actions"><button class="primary big" type="button" data-go="1">Start reading</button>
      ${resume > 1 ? `<button class="big" type="button" data-go="${resume}">Continue: ${pages[resume].ch?.title || "where you were"}</button>` : ""}</div></div>`;
  } else if (p.kind === "story") {
    el.innerHTML = `<div class="art">${artFor(p.pg.art)}</div>
      <div class="prose">${p.i === 0 ? `<h2>${p.ch.title}</h2>` : ""}${p.pg.text.map(t => `<p>${t}</p>`).join("")}
      ${p.i === p.ch.pages.length - 1 && p.ch.puzzle ? `<button class="primary big" type="button" data-go="${i + 1}">Turn to the map →</button>` : ""}</div>
      <span class="folio">${i + 1}</span>`;
  } else if (p.kind === "puzzle") {
    openPuzzle(p.c);
    el.appendChild(solverEl);
  } else {
    const tut = story.id === "tutorial", main = window.STORIES.find(s => !s.soon && s.id !== "tutorial");
    el.innerHTML = `<div class="end-art">${tut ? "🎉" : "🦆"}</div>
      <h2>${tut ? "You're ready!" : "To be continued…"}</h2>
      <p>${tut ? "Now try a real mystery." : "Thursday's prank is on its way. Come back soon for the next chapter."}</p>
      <div class="cover-actions">${tut && main ? `<a class="btn primary big" href="play.html?s=${main.id}">Open ${main.title}</a>` : ""}
      <a class="btn big" href="./">Back to the bookshelf</a>${story.pdf ? `<a class="btn big" href="${story.pdf}" download>⬇ Printable PDF</a>` : ""}</div>`;
  }
  el.querySelectorAll("[data-go]").forEach(b => b.onclick = () => go(+b.dataset.go));
  return el;
}

// ---------- the puzzle page ----------
const solverEl = $("solverTpl").content.firstElementChild.cloneNode(true);
let c = null, st = null, selected = null, focus = null, tool = "place";
const save = () => c && store.set("wwW:" + c.id, st);
const map = new Map3D(solverEl.querySelector("#mapbox"), { tap: tapSpot, hold: placeAt, clue: i => { focus = { clue: i }; renderSolver(); } });
const q = sel => solverEl.querySelector(sel);

function openPuzzle(pc) {
  if (c !== pc) { c = pc; st = stateOf(c); selected = null; focus = null; map.setCase(c); }
  q("#question").textContent = c.story;
  document.querySelectorAll("#help .r-fib").forEach(e => e.hidden = !c.roles.includes("fibber"));
  document.querySelectorAll("#help .r-mud").forEach(e => e.hidden = !c.roles.includes("muddler"));
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

go(start, 0);
