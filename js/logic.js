// Puzzle rules: distances on the path network, whether a statement is true, and checking an answer.

export function network(c) {
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

export function truth(c, net, stmt, me, pos) {
  const { adj, D } = net, here = pos[me];
  const names = c.suspects.map(s => s.name);
  const near = names.filter(o => o !== me && pos[o] && D[here][pos[o]] === 1).length;
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

// Returns { ok, message } for the player's placements and roles.
export function check(c, st) {
  const net = network(c), names = c.suspects.map(s => s.name);
  if (names.some(n => !st.pos[n])) return { ok: false, message: "Place everyone on the map first." };
  const roleOf = n => st.role[n] || "honest";
  for (const r of c.roles) if (names.filter(n => roleOf(n) === r).length !== 1)
    return { ok: false, message: `Mark exactly one ${r === "fibber" ? "Fibber" : "Muddler"}.` };
  let ok = true;
  for (const n of names) {
    const vals = c.statements[n].map(s => truth(c, net, s, n, st.pos));
    const nt = vals.filter(Boolean).length, L = vals.length, r = roleOf(n);
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
  if (!ok) return { ok: false, message: "Something doesn't add up. Keep investigating." };
  return { ok: true, message: fib ? `Case closed! ${fib} was the Fibber.` : "Case closed! Everyone is in the right place." };
}

// A gentle hint: the unplaced person whose statements about their own spot fit the fewest open spots.
export function hint(c, st) {
  const net = network(c), names = c.suspects.map(p => p.name);
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
    if (!best || ok.length < best.ok.length) best = { n, ok };
  }
  if (!best) {
    const left = names.filter(n => !st.pos[n]);
    if (!left.length) return "Everyone is placed. Press Check to see if you're right.";
    return `Look at what ${left[0]} says about the people already on the map.`;
  }
  if (!best.ok.length) return c.roles.length ? `No open spot fits what ${best.n} says. So ${best.n} can't be honest!` : `Something's off. Check ${best.n}'s statements again.`;
  const list = best.ok.map(name);
  const where = list.length === 1 ? `the ${list[0]}` : list.slice(0, -1).map(x => "the " + x).join(", ") + ` or the ${list.at(-1)}`;
  return `${c.roles.length ? `If ${best.n} is honest, ` : ""}${best.n} can only have been at ${where}.`;
}
