"""Generate network deduction cases and verify each has exactly one solution.

Rules: every suspect stands on a different spot. Honest suspects make only true
statements. The Fibber's statements are all false. The Muddler (if present)
has exactly one false statement. Evidence clues are always true.
Usage: python3 tools/generate.py puzzles/cases.src.json
Writes puzzles/cases.json and puzzles/cases.js (the web player loads the .js file).
"""
import itertools, json, random, sys
from collections import deque
import numpy as np

def dist_table(n, edges):
    adj = {i: set() for i in range(n)}
    for a, b in edges:
        adj[a].add(b); adj[b].add(a)
    D = np.full((n, n), 99)
    for s in range(n):
        D[s, s] = 0; q = deque([s])
        while q:
            u = q.popleft()
            for v in adj[u]:
                if D[s, v] == 99:
                    D[s, v] = D[s, u] + 1; q.append(v)
    return adj, D

def build(case, seed, tries=400000, statements_per=2):
    spots = case["spots"]; n = len(spots); names = [s["name"] for s in spots]
    idx = {s["id"]: i for i, s in enumerate(spots)}
    edges = [(idx[a], idx[b]) for a, b in case["paths"]]
    adj, D = dist_table(n, edges)
    deg = np.array([len(adj[i]) for i in range(n)])
    people = [p["name"] for p in case["suspects"]]; k = len(people)
    P = np.array(list(itertools.permutations(range(n), k)))   # (m,k) spot of each suspect
    m = len(P)
    # ---- evidence (always true) ----
    ev_mask = np.ones(m, bool)
    culprit_ev = []   # masks per culprit index
    for e in case["evidence"]:
        s = idx[e["spot"]]
        if e["type"] == "occupied":   ev_mask &= (P == s).any(1)
        elif e["type"] == "empty":    ev_mask &= ~(P == s).any(1)
        elif e["type"] == "culprit_near":
            culprit_ev.append(np.stack([D[P[:, c], s] <= 1 for c in range(k)], 1))
    # ---- statement library: (speaker, text, kind, mask, data) ----
    lib = []
    pairD = {(i, j): D[P[:, i], P[:, j]] for i in range(k) for j in range(k) if i != j}
    nearcount = [sum((pairD[(i, j)] == 1).astype(int) for j in range(k) if j != i) for i in range(k)]
    for i in range(k):
        si = P[:, i]
        lib.append((i, "I was at a dead end.", {"t": "deadend"}, deg[si] == 1))
        lib.append((i, "I was at a crossroads (3 or more paths).", {"t": "crossroads"}, deg[si] >= 3))
        lib.append((i, "Nobody was right next to me.", {"t": "alone"}, nearcount[i] == 0))
        lib.append((i, "Exactly one person was right next to me.", {"t": "onenear"}, nearcount[i] == 1))
        for s in range(n):
            lib.append((i, f"I was right next to the {names[s]}.", {"t": "nextto", "spot": spots[s]["id"]}, D[si, s] == 1))
            lib.append((i, f"I was far from the {names[s]} (3 or more paths).", {"t": "farspot", "spot": spots[s]["id"]}, D[si, s] >= 3))
        for j in range(k):
            if j == i: continue
            d = pairD[(i, j)]
            lib.append((i, f"{people[j]} was right next to me.", {"t": "near", "who": j}, d == 1))
            lib.append((i, f"{people[j]} and I were exactly two paths apart.", {"t": "two", "who": j}, d == 2))
            lib.append((i, f"{people[j]} was far from me (3 or more paths).", {"t": "far", "who": j}, d >= 3))
            for s in range(n):
                lib.append((i, f"I was closer to the {names[s]} than {people[j]} was.", {"t": "closer", "who": j, "spot": spots[s]["id"]}, D[si, s] < D[P[:, j], s]))
    by = [[s for s in lib if s[0] == i] for i in range(k)]
    roles = case["roles"]   # e.g. ["fibber"] or ["fibber","muddler"]
    rng = random.Random(seed)
    best = None
    for t in range(tries):
        ch = []; seen = set()
        for i in range(k):
            types = rng.sample(sorted({x[2]["t"] for x in by[i]}), statements_per)
            pick = [rng.choice([x for x in by[i] if x[2]["t"] == ty]) for ty in types]
            ch.append(pick)
        texts = [c[1] for row in ch for c in row]
        if len(set(texts)) != len(texts): continue
        T = [np.stack([c[3] for c in ch[i]], 1) for i in range(k)]   # (m, spp)
        nt = [x.sum(1) for x in T]
        honest = [x == statements_per for x in nt]
        fib = [x == 0 for x in nt]
        mud = [x == statements_per - 1 for x in nt]
        if (ev_mask & np.all(np.stack(honest, 1), 1)).any():
            continue   # must be impossible if everyone is honest
        # every statement must be satisfiable on its own by evidence (no self-contradiction giveaways)
        total = 0; sol = None
        assigns = []
        if roles == ["fibber"]:
            assigns = [(f, None) for f in range(k)]
        else:
            assigns = [(f, u) for f in range(k) for u in range(k) if u != f]
        for f, u in assigns:
            mask = ev_mask & fib[f]
            for ce in culprit_ev: mask &= ce[:, f]
            if u is not None: mask &= mud[u]
            for i in range(k):
                if i != f and i != u: mask &= honest[i]
            c = int(mask.sum()); total += c
            if c == 1: sol = (f, u, int(np.nonzero(mask)[0][0]))
            if total > 1: break
        if total != 1: continue
        f, u, row = sol
        # fibber's statements must not be jointly impossible on their own
        both = np.all(T[f], 1)
        if not both.any(): continue
        # all evidence + candidate pruning count, a rough "difficulty" score: how many placements survive evidence
        out = {
            "solution": {"positions": {people[i]: spots[P[row, i]]["id"] for i in range(k)},
                          "fibber": people[f], "muddler": people[u] if u is not None else None},
            "statements": {people[i]: [{"text": c[1], **c[2], **({"who": people[c[2]["who"]]} if "who" in c[2] else {})} for c in ch[i]] for i in range(k)},
            "tries": t,
        }
        return out
    return None

if __name__ == "__main__":
    cases = json.load(open(sys.argv[1]))
    result = []
    for c in cases:
        for seed in range(50):
            r = build(c, seed)
            if r:
                c2 = dict(c); c2.update({"statements": r["statements"], "solution": r["solution"]})
                result.append(c2)
                print(c["title"], "ok, seed", seed, r["solution"], file=sys.stderr)
                break
        else:
            print(c["title"], "FAILED", file=sys.stderr)
    import os
    out = os.path.join(os.path.dirname(sys.argv[1]), "cases")
    json.dump(result, open(out + ".json", "w"), indent=1)
    open(out + ".js", "w").write("// Generated by tools/generate.py. Do not edit by hand.\nwindow.CASES = " + json.dumps(result, indent=1) + ";\n")
