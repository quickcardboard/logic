// The story player: read a chapter's pages, then solve its map.
import { check, hint } from "./logic.js";
import { Map3D } from "./map3d.js";

const $ = id => document.getElementById(id);
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
};
const ART = window.ART || { places: {}, portraits: {} };
const PUZZLES = Object.fromEntries([...(window.BOOK || []), ...(window.TUTORIAL || [])].map(c => [c.id, c]));

const params = new URLSearchParams(location.search);
const story = window.STORIES.find(s => s.id === params.get("s") && !s.soon) || window.STORIES[0];
let chapterIdx = Math.max(0, story.chapters.findIndex(ch => ch.id === params.get("c")));
if (!params.get("c")) chapterIdx = Math.min(store.get("wwW:chapter:" + story.id) || 0, story.chapters.length - 1);
let mode = "read", page = 0;
let c = null, st = null, selected = null, tool = "place";
let map = null;

const blank = () => ({ pos: {}, role: {}, marks: {}, crossed: {}, notes: {} });
const save = () => c && store.set("wwW:" + c.id, st);
const chapter = () => story.chapters[chapterIdx];

// ---------- top bar ----------
$("storyTitle").textContent = story.title;
document.title = story.title + " · Who Was Where";
document.body.style.setProperty("--spine", story.spine);
const sel = $("chapterSel");
story.chapters.forEach((ch, i) => sel.add(new Option(ch.title, i)));
sel.hidden = story.chapters.length < 2;
sel.onchange = () => openChapter(+sel.value, null);
$("modeRead").onclick = () => setMode("read");
$("modeSolve").onclick = () => setMode("solve");
$("helpBtn").onclick = () => $("help").showModal();
if (story.pdf) $("pdfLink").href = story.pdf; else $("pdfLink").remove();

function openChapter(i, wantMode) {
  chapterIdx = i; sel.value = i; store.set("wwW:chapter:" + story.id, i);
  const ch = chapter();
  page = Math.min(store.get("wwW:page:" + ch.id) || 0, Math.max(0, ch.pages.length - 1));
  c = ch.puzzle ? PUZZLES[ch.puzzle] : null;
  st = c ? Object.assign(blank(), store.get("wwW:" + c.id) || {}) : null;
  selected = null;
  $("modeRead").hidden = !ch.pages.length;
  $("modeSolve").hidden = !c;
  $("modeSeg").hidden = !ch.pages.length || !c;
  setMode(wantMode || (ch.pages.length && !(c && st.solved) ? "read" : "solve"));
  history.replaceState(null, "", `?s=${story.id}&c=${ch.id}`);
}

function setMode(m) {
  mode = m;
  $("modeRead").classList.toggle("on", m === "read");
  $("modeSolve").classList.toggle("on", m === "solve");
  $("reader").hidden = m !== "read";
  $("solver").hidden = m !== "solve";
  if (m === "read") renderPage(0);
  else startSolve();
}

// ---------- reader ----------
function artFor(key) {
  if (!key) return "";
  const [kind, id] = key.includes(":") ? key.split(":") : [key, ""];
  if (kind === "place" && ART.places[id]) return `<svg viewBox="${ART.placeBox}">${ART.places[id]}</svg>`;
  if (kind === "who" && ART.portraits[id]) return `<svg viewBox="${ART.portraitBox}">${ART.portraits[id]}</svg>`;
  if (kind === "duck" && ART.covers?.duck) return `<svg viewBox="${ART.coverBox}">${ART.covers.duck}</svg>`;
  return "";
}
function renderPage(dir) {
  const ch = chapter(), pg = ch.pages[page];
  if (!pg) return;
  store.set("wwW:page:" + ch.id, page);
  const last = page === ch.pages.length - 1;
  const nextCh = story.chapters[chapterIdx + 1];
  let end = "";
  if (last && c) end = `<button class="primary big" id="goSolve" type="button">Solve the map 🔍</button>`;
  else if (last && nextCh) end = `<button class="primary big" id="goNext" type="button">Next: ${nextCh.title} →</button>`;
  const el = $("page");
  el.className = "page" + (dir > 0 ? " in-right" : dir < 0 ? " in-left" : "");
  el.innerHTML = `<div class="art">${artFor(pg.art)}</div>
    ${page === 0 ? `<h2>${ch.title}</h2>` : ""}
    <div class="prose">${pg.text.map(t => `<p>${t}</p>`).join("")}</div>${end}`;
  void el.offsetWidth; el.classList.add("show");
  $("goSolve")?.addEventListener("click", () => setMode("solve"));
  $("goNext")?.addEventListener("click", () => openChapter(chapterIdx + 1, "read"));
  $("dots").innerHTML = ch.pages.map((_, i) => `<i class="${i === page ? "on" : ""}"></i>`).join("");
  $("prev").disabled = page === 0;
  $("next").disabled = last;
}
const turn = d => { const n = page + d; if (n < 0 || n >= chapter().pages.length) return; page = n; renderPage(d); };
$("prev").onclick = () => turn(-1);
$("next").onclick = () => turn(1);
document.addEventListener("keydown", e => {
  if (mode !== "read" || e.target.closest("select, dialog")) return;
  if (e.key === "ArrowRight") turn(1);
  if (e.key === "ArrowLeft") turn(-1);
});
{ // swipe to turn pages
  let x0 = null;
  $("stage").addEventListener("pointerdown", e => { x0 = e.clientX; });
  $("stage").addEventListener("pointerup", e => {
    if (x0 !== null && Math.abs(e.clientX - x0) > 50) turn(e.clientX < x0 ? 1 : -1);
    x0 = null;
  });
}

// ---------- solver ----------
function startSolve() {
  if (!map) map = new Map3D($("mapbox"), { tap: tapSpot, hold: placeAt });
  if (map.c !== c) map.setCase(c);
  $("question").textContent = c.story;
  document.querySelectorAll("#help .r-fib").forEach(e => e.hidden = !c.roles.includes("fibber"));
  document.querySelectorAll("#help .r-mud").forEach(e => e.hidden = !c.roles.includes("muddler"));
  setTool("place"); renderSolver();
}

function renderSolver() {
  map.update(st, selected);
  renderPeople(); renderClues(); renderCoach();
}

function portrait(name, color) {
  const a = ART.portraits[name];
  return a ? `<svg class="face" viewBox="${ART.portraitBox}" aria-hidden="true">${a}</svg>`
           : `<span class="face initial" style="background:${color}">${name[0]}</span>`;
}

function renderPeople() {
  const spotName = Object.fromEntries(c.spots.map(s => [s.id, s.name]));
  const people = $("people"); people.innerHTML = "";
  for (const p of c.suspects) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "person" + (selected === p.name ? " sel" : "") + (st.pos[p.name] ? " placed" : "");
    b.style.setProperty("--c", p.color);
    b.innerHTML = `${portrait(p.name, p.color)}<span class="pname">${p.name}</span><span class="where">${st.pos[p.name] ? spotName[st.pos[p.name]] : "not placed"}</span>`;
    dragOrSelect(b, p.name);
    people.appendChild(b);
  }
  const said = $("said"); said.innerHTML = "";
  said.classList.toggle("none-selected", !selected);
  const roleList = c.roles.length ? ["honest", ...c.roles] : [];
  const roleLabel = { honest: "Honest", fibber: "Fibber", muddler: "Muddler" };
  for (const p of c.suspects) {
    const box = document.createElement("div");
    box.className = "says" + (selected === p.name ? " sel" : "");
    box.style.setProperty("--c", p.color);
    box.innerHTML = `<div class="who">${p.name} said:</div>`;
    const ul = document.createElement("ul");
    c.statements[p.name].forEach((s, k) => {
      const li = document.createElement("li"), mk = st.marks[p.name + k] || "";
      if (mk) li.className = mk;
      li.textContent = `“${s.text}”`;
      li.onclick = () => { st.marks[p.name + k] = { "": "t", t: "f", f: "" }[mk]; save(); renderPeople(); };
      ul.appendChild(li);
    });
    box.appendChild(ul);
    if (roleList.length) {
      const roles = document.createElement("div"); roles.className = "roles";
      for (const r of roleList) {
        const rb = document.createElement("button"); rb.type = "button"; rb.textContent = roleLabel[r];
        if ((st.role[p.name] || "") === r) rb.classList.add("on");
        rb.onclick = () => { st.role[p.name] = st.role[p.name] === r ? "" : r; save(); renderPeople(); };
        roles.appendChild(rb);
      }
      box.appendChild(roles);
    }
    said.appendChild(box);
  }
  said.insertAdjacentHTML("beforeend", `<p class="pick">Tap a person to see what they said.</p>`);
}

function renderClues() {
  $("clues").innerHTML = `<div class="who">Evidence</div>` +
    c.evidence.map(e => `<div class="clue"><span>${e.icon}</span>${e.text}</div>`).join("");
}

// A person button: tap selects, dragging drops them onto the map.
function dragOrSelect(btn, name) {
  btn.addEventListener("pointerdown", e => {
    if (e.button > 0) return;
    const x0 = e.clientX, y0 = e.clientY; let ghost = null;
    const move = ev => {
      if (!ghost && Math.hypot(ev.clientX - x0, ev.clientY - y0) > 8) {
        ghost = btn.querySelector(".face").cloneNode(true); ghost.classList.add("ghost");
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
        if (id) { selected = name; placeAt(id); } else renderSolver();
      } else {
        selected = selected === name ? null : name;
        if (tool !== "place") setTool("place");
        renderSolver();
      }
    };
    addEventListener("pointermove", move); addEventListener("pointerup", up);
    btn.setPointerCapture?.(e.pointerId); btn.releasePointerCapture?.(e.pointerId);
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
    toast("Pick a person first. Then tap a place for a maybe, or press and hold to place them.");
  }
  st.solved = false; save(); renderSolver();
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
  st.solved = false; save(); renderSolver();
}

function setTool(t) {
  tool = t;
  $("toolPlace").classList.toggle("on", t === "place");
  $("toolCross").classList.toggle("on", t === "cross");
  if (t === "cross") { selected = null; renderSolver(); toast("Tap places you know were empty to cross them out."); }
}
$("toolPlace").onclick = () => setTool("place");
$("toolCross").onclick = () => setTool("cross");

let toastTimer = null;
function toast(msg, kind = "") {
  const t = $("toast"); t.textContent = msg; t.className = "toast show " + kind;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove("show"), kind === "win" ? 6000 : 3800);
}

$("check").onclick = () => {
  const r = check(c, st);
  if (r.ok) { st.solved = true; save(); renderCoach(); celebrate(); }
  toast(r.ok ? "🎉 " + r.message : r.message, r.ok ? "win" : "no");
};
$("hintBtn").onclick = () => toast("💡 " + hint(c, st));
$("moreBtn").onclick = () => { const m = $("menu"); m.hidden = !m.hidden; $("moreBtn").setAttribute("aria-expanded", !m.hidden); };
document.addEventListener("click", e => { if (!e.target.closest(".more")) $("menu").hidden = true; });
$("reset").onclick = () => { st = blank(); selected = null; save(); renderSolver(); $("menu").hidden = true; };
let armed = false;
$("solve").onclick = () => {
  if (!armed) { armed = true; $("solve").textContent = "Sure? Tap again"; setTimeout(() => { armed = false; $("solve").textContent = "Show the answer"; }, 3000); return; }
  armed = false; $("solve").textContent = "Show the answer"; $("menu").hidden = true;
  const sol = c.solution;
  st.pos = { ...sol.positions }; st.role = {};
  for (const p of c.suspects) st.role[p.name] = "honest";
  if (sol.fibber) st.role[sol.fibber] = "fibber";
  if (sol.muddler) st.role[sol.muddler] = "muddler";
  selected = null; save(); renderSolver();
  toast(sol.fibber ? `Here's the answer. ${sol.fibber} was the Fibber.` : "Here's the answer.");
};

function celebrate() {
  const box = $("mapbox");
  for (let i = 0; i < 40; i++) {
    const d = document.createElement("i"); d.className = "confetti";
    d.style.left = Math.random() * 100 + "%"; d.style.background = ["#ffd43b", "#e8505b", "#4dabf7", "#69db7c", "#b197fc"][i % 5];
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
  const box = $("coach");
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
  if (step.until === "end") box.insertAdjacentHTML("beforeend", `<a class="btn primary" href="play.html?s=duck">Start The Rubber Duck Bandit</a>`);
}

openChapter(chapterIdx, params.get("m"));
