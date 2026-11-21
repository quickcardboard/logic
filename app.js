(() => {
  const CASES = window.CASES || [];
  const $ = (id) => document.getElementById(id);
  const svgNS = "http://www.w3.org/2000/svg";
  const R = 7; // spot radius in map units

  let ci = 0;          // current case index
  let st = null;       // current case state
  let tool = "place";
  let selected = null; // selected suspect name

  const store = {
    get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const blank = () => ({ pos: {}, role: {}, marks: {}, crossed: {}, notes: {} });
  const LONG_MS = 450;
  const key = () => "wwW:" + CASES[ci].id;
  const save = () => store.set(key(), st);

  // ---------- geometry of the network ----------
  function distances(c) {
    const adj = {}; c.spots.forEach(s => adj[s.id] = new Set());
    c.paths.forEach(([a, b]) => { adj[a].add(b); adj[b].add(a); });
    const D = {};
    for (const s of c.spots) {
      const d = { [s.id]: 0 }, q = [s.id];
      while (q.length) { const u = q.shift(); for (const v of adj[u]) if (!(v in d)) { d[v] = d[u] + 1; q.push(v); } }
      D[s.id] = d;
    }
    return { adj, D };
  }

  function truth(c, net, stmt, me, pos) {
    const { adj, D } = net, here = pos[me];
    const names = c.suspects.map(s => s.name);
    const near = names.filter(o => o !== me && D[here][pos[o]] === 1).length;
    switch (stmt.t) {
      case "deadend": return adj[here].size === 1;
      case "crossroads": return adj[here].size >= 3;
      case "alone": return near === 0;
      case "onenear": return near === 1;
      case "nextto": return D[here][stmt.spot] === 1;
      case "atornext": return D[here][stmt.spot] <= 1;
      case "at": return here === stmt.spot;
      case "notat": return here !== stmt.spot;
      case "farspot": return D[here][stmt.spot] >= 3;
      case "closer": return D[here][stmt.spot] < D[pos[stmt.who]][stmt.spot];
    }
    const d = D[here][pos[stmt.who]];
    return { near: d === 1, two: d === 2, far: d >= 3 }[stmt.t];
  }

  // ---------- rendering ----------
  function renderNav() {
    const nav = $("cases"); nav.innerHTML = "";
    CASES.forEach((c, i) => {
      const b = document.createElement("button");
      const lv = c.level || 3;
      b.textContent = `${i + 1} ${"★".repeat(lv)}`;
      b.title = `${c.title} (${["", "easy", "medium", "hard"][lv]})`;
      b.title = c.title;
      if (i === ci) b.classList.add("on");
      b.onclick = () => load(i);
      nav.appendChild(b);
    });
  }

  function el(tag, attrs = {}, parent) {
    const e = document.createElementNS(svgNS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }

  function renderMap() {
    const c = CASES[ci], svg = $("map"); svg.innerHTML = "";
    const at = Object.fromEntries(c.spots.map(s => [s.id, s]));
    c.paths.forEach(([a, b]) => el("line", { x1: at[a].x, y1: at[a].y, x2: at[b].x, y2: at[b].y, class: "path" }, svg));
    const who = {}; for (const n in st.pos) who[st.pos[n]] = n;
    const color = Object.fromEntries(c.suspects.map(s => [s.name, s.color]));
    const evAt = {}; c.evidence.forEach(e => (evAt[e.spot] = evAt[e.spot] || []).push(e.icon));

    for (const s of c.spots) {
      const g = el("g", { class: "spot", transform: `translate(${s.x} ${s.y})`, tabindex: 0, role: "button", "aria-label": s.name }, svg);
      el("circle", { r: R, class: "base" }, g);
      const icon = el("text", { class: "icon", y: -0.3 }, g); icon.textContent = s.icon;
      const lab = el("text", { class: "label", y: R + 6.2 }, g); lab.textContent = s.name;
      const notes = (st.notes[s.id] || []).filter(n => !who[s.id]);
      notes.forEach((n, k) => {
        const x = (k - (notes.length - 1) / 2) * 4.3;
        el("circle", { cx: x, cy: R + 0.6, r: 2.05, fill: color[n], class: "note" }, g);
        const t = el("text", { x, y: R + 0.7, class: "notetxt" }, g); t.textContent = n[0];
      });
      (evAt[s.id] || []).forEach((ic, k) => {
        el("circle", { cx: -R + 0.5 - k * 5, cy: -R + 0.5, r: 2.8, fill: "var(--paper)", stroke: "var(--line)", "stroke-width": .5 }, g);
        const t = el("text", { class: "badge", x: -R + 0.5 - k * 5, y: -R + 0.7 }, g); t.textContent = ic;
      });
      if (st.crossed[s.id] && !who[s.id]) {
        el("line", { x1: -4.5, y1: -4.5, x2: 4.5, y2: 4.5, class: "cross" }, g);
        el("line", { x1: 4.5, y1: -4.5, x2: -4.5, y2: 4.5, class: "cross" }, g);
      }
      if (who[s.id]) {
        const tk = el("g", { class: "token", transform: `translate(${R - 1} ${-R + 1})` }, g);
        el("circle", { r: 3.6, fill: color[who[s.id]] }, tk);
        const t = el("text", {}, tk); t.textContent = who[s.id][0];
      }
      // Short tap = pencil note for the selected suspect. Long press = place them here.
      let timer = null, fired = false;
      const cancel = () => { clearTimeout(timer); timer = null; g.classList.remove("pressing"); };
      g.addEventListener("pointerdown", e => {
        if (e.button > 0) return;
        fired = false; g.classList.add("pressing");
        timer = setTimeout(() => { fired = true; cancel(); try { navigator.vibrate && navigator.vibrate(15); } catch {} placeAt(s.id); }, LONG_MS);
      });
      g.addEventListener("pointerup", () => { if (timer && !fired) { cancel(); tapSpot(s.id); } });
      g.addEventListener("pointerleave", cancel);
      g.addEventListener("pointercancel", cancel);
      g.addEventListener("contextmenu", e => e.preventDefault());
      g.addEventListener("keydown", e => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); e.shiftKey ? placeAt(s.id) : tapSpot(s.id); }
      });
    }
  }

  function renderSide() {
    const c = CASES[ci];
    const spotName = Object.fromEntries(c.spots.map(s => [s.id, s.name]));
    $("title").textContent = c.title;
    $("story").textContent = c.story;
    $("muddlerRule").style.display = c.roles.includes("muddler") ? "" : "none";
    $("fibberRule").style.display = c.roles.includes("fibber") ? "" : "none";
    $("tag").textContent = c.roles.length ? "Place every suspect on the map. Find the Fibber." : "Place everyone on the map. Everyone tells the truth.";
    const ev = $("evidence"); ev.innerHTML = "";
    c.evidence.forEach(e => { const li = document.createElement("li"); li.textContent = `${e.icon} ${e.text}`; ev.appendChild(li); });

    const box = $("suspects"); box.innerHTML = "";
    const roleList = c.roles.length ? ["honest", ...c.roles] : [];
    const roleLabel = { honest: "Honest", fibber: "Fibber", muddler: "Muddler" };
    for (const p of c.suspects) {
      const card = document.createElement("div");
      card.className = "card" + (selected === p.name ? " sel" : "");
      card.style.setProperty("--c", p.color);
      card.innerHTML = `<div class="top"><span class="dot">${p.name[0]}</span><span class="name">${p.name}</span>
        <span class="where">${st.pos[p.name] ? "at the " + spotName[st.pos[p.name]] : (selected === p.name ? "selected" : "tap to select")}</span></div>`;
      const roles = document.createElement("div"); roles.className = "roles";
      roleList.forEach(r => {
        const b = document.createElement("button");
        b.textContent = roleLabel[r];
        if ((st.role[p.name] || "") === r) b.classList.add("on");
        b.onclick = (e) => { e.stopPropagation(); st.role[p.name] = st.role[p.name] === r ? "" : r; save(); renderSide(); };
        roles.appendChild(b);
      });
      if (roleList.length) card.appendChild(roles);
      const ul = document.createElement("ul"); ul.className = "stmts";
      c.statements[p.name].forEach((s, k) => {
        const li = document.createElement("li");
        const mk = st.marks[p.name + k] || "";
        if (mk) li.classList.add(mk);
        li.textContent = `“${s.text}”`;
        li.onclick = (e) => { e.stopPropagation(); st.marks[p.name + k] = { "": "t", t: "f", f: "" }[mk]; save(); renderSide(); };
        ul.appendChild(li);
      });
      card.appendChild(ul);
      card.querySelector(".top").onclick = () => { selected = selected === p.name ? null : p.name; setTool("place"); renderSide(); };
      box.appendChild(card);
    }
  }

  function render() { renderNav(); renderMap(); renderSide(); }

  // ---------- interaction ----------
  function clearVerdict() { $("verdict").textContent = ""; $("verdict").className = "verdict"; }
  const occupantOf = id => Object.keys(st.pos).find(n => st.pos[n] === id);

  function tapSpot(id) {
    clearVerdict();
    if (tool === "cross") {
      if (!occupantOf(id)) st.crossed[id] = !st.crossed[id];
    } else if (selected) {
      const list = st.notes[id] || (st.notes[id] = []);
      const k = list.indexOf(selected);
      if (k >= 0) list.splice(k, 1); else list.push(selected);
      const order = CASES[ci].suspects.map(p => p.name);
      list.sort((a, b) => order.indexOf(a) - order.indexOf(b));
    } else {
      $("hint").textContent = "Select a suspect card first. Then tap a spot for a pencil note, or press and hold to place them.";
    }
    save(); renderMap(); renderSide();
  }

  function placeAt(id) {
    clearVerdict();
    const occupant = occupantOf(id);
    if (selected) {
      if (occupant && occupant !== selected) delete st.pos[occupant];
      if (occupant === selected) delete st.pos[selected];
      else { st.pos[selected] = id; st.crossed[id] = false; }
      selected = null;
    } else if (occupant) {
      delete st.pos[occupant];
    }
    save(); renderMap(); renderSide();
  }

  // Hint: the suspect whose own statements (about their own spot) narrow them down the most.
  function hint() {
    const c = CASES[ci], net = distances(c), v = $("verdict");
    const names = c.suspects.map(p => p.name);
    const name = id => c.spots.find(s => s.id === id).name;
    const empty = new Set(c.evidence.filter(e => e.type === "empty").map(e => e.spot));
    const selfOnly = s => !("who" in s) && s.t !== "alone" && s.t !== "onenear";
    let best = null;
    for (const n of names) {
      if (st.pos[n]) continue;
      const sts = c.statements[n].filter(selfOnly);
      if (!sts.length) continue;
      const ok = c.spots.map(s => s.id).filter(id => !empty.has(id) &&
        sts.every(x => truth(c, net, x, n, { ...Object.fromEntries(names.map(m => [m, id])), [n]: id })));
      if (!best || ok.length < best.ok.length) best = { n, ok, sts };
    }
    v.className = "verdict";
    if (!best) { v.textContent = "Hint: look for two people whose statements can't both be true."; return; }
    if (!best.ok.length) {
      v.textContent = c.roles.length
        ? `💡 Hint: no open spot fits what ${best.n} says about their own spot. So ${best.n} can't be honest!`
        : `💡 Hint: something's off. Check ${best.n}'s statements again.`;
      return;
    }
    const list = best.ok.map(name);
    const where = list.length === 1 ? `the ${list[0]}` : list.slice(0, -1).map(x => "the " + x).join(", ") + ` or the ${list.at(-1)}`;
    const lead = c.roles.length ? `If ${best.n} is honest, ` : "";
    v.textContent = `💡 Hint: ${lead}${best.n} can only have been at ${where}. ` +
      (list.length === 1 && !c.roles.length ? `Select ${best.n} and press and hold that spot to place them.` : `Select ${best.n} and tap ${list.length === 1 ? "that spot" : "those spots"} to pencil them in.`);
  }

  let solArmed = false;
  function showSolution() {
    const b = $("solve");
    if (!solArmed) {
      solArmed = true; b.textContent = "Sure? Tap again";
      setTimeout(() => { solArmed = false; b.textContent = "Show solution"; }, 3000);
      return;
    }
    solArmed = false; b.textContent = "Show solution";
    const sol = CASES[ci].solution;
    st.pos = { ...sol.positions }; st.role = {};
    for (const p of CASES[ci].suspects) st.role[p.name] = "honest";
    st.role[sol.fibber] = "fibber";
    if (sol.muddler) st.role[sol.muddler] = "muddler";
    selected = null; save(); render();
    const v = $("verdict"); v.className = "verdict win";
    v.textContent = sol.fibber ? `Solution: ${sol.fibber} was the Fibber` + (sol.muddler ? ` and ${sol.muddler} was the Muddler.` : ".") : "Solution shown.";
  }

  function setTool(t) {
    tool = t;
    $("toolPlace").classList.toggle("on", t === "place");
    $("toolCross").classList.toggle("on", t === "cross");
    $("hint").textContent = t === "cross"
      ? "Tap spots you're sure were empty to cross them out. Tap again to undo."
      : "Select a suspect card. Tap a spot to pencil them in as a maybe. Press and hold a spot to place them there.";
  }

  function check() {
    const c = CASES[ci], net = distances(c), v = $("verdict");
    const names = c.suspects.map(s => s.name);
    v.className = "verdict no";
    if (names.some(n => !st.pos[n])) { v.textContent = "Place every suspect on the map first."; return; }
    const roleOf = n => st.role[n] || "honest";
    const need = c.roles;
    for (const r of need) if (names.filter(n => roleOf(n) === r).length !== 1) {
      v.textContent = `Mark exactly one ${r === "fibber" ? "Fibber" : "Muddler"}.`; return;
    }
    let ok = true;
    for (const n of names) {
      const vals = c.statements[n].map(s => truth(c, net, s, n, st.pos));
      const nt = vals.filter(Boolean).length, L = vals.length;
      const r = roleOf(n);
      if (r === "honest" && nt !== L) ok = false;
      if (r === "fibber" && nt !== 0) ok = false;
      if (r === "muddler" && nt !== L - 1) ok = false;
    }
    const occ = new Set(Object.values(st.pos));
    const fib = names.find(n => roleOf(n) === "fibber");
    for (const e of c.evidence) {
      if (e.type === "occupied" && !occ.has(e.spot)) ok = false;
      if (e.type === "empty" && occ.has(e.spot)) ok = false;
      if (e.type === "culprit_near" && fib && net.D[st.pos[fib]][e.spot] > 1) ok = false;
    }
    if (ok) { v.className = "verdict win"; v.textContent = fib ? `🎉 Case closed! ${fib} was the Fibber. Every statement checks out.` : "🎉 Case closed! Everyone is in the right place."; }
    else v.textContent = "Something doesn't add up. Keep investigating.";
  }

  function load(i) {
    ci = i; selected = null;
    st = Object.assign(blank(), store.get(key()) || {});
    store.set("wwW:last", i);
    $("verdict").textContent = "";
    setTool("place"); render();
  }

  $("toolPlace").onclick = () => setTool("place");
  $("toolCross").onclick = () => { selected = null; setTool("cross"); renderSide(); };
  $("check").onclick = check;
  $("solve").onclick = showSolution;
  $("hintBtn").onclick = hint;
  $("reset").onclick = () => { st = blank(); selected = null; save(); $("verdict").textContent = ""; render(); };

  const last = store.get("wwW:last");
  load(Number.isInteger(last) && last < CASES.length ? last : 0);
})();
