"""Grade how hard a case is for a human, using only "pencil mark" deductions.

Each suspect gets a list of candidates: (role, spot) pairs, like sudoku pencil marks.
Level 1: solved by checking each statement on its own (statements about one's own spot),
         plus "only one suspect can be here" / "this suspect has one spot left".
Level 2: also needs statements linking two or three suspects, checked pair by pair.
Level 3: needs trial and error ("suppose Mabel is the Fibber...").
"""
import itertools, json, sys
from collections import deque

def network(case):
    ids = [s["id"] for s in case["spots"]]
    adj = {i: set() for i in ids}
    for a, b in case["paths"]:
        adj[a].add(b); adj[b].add(a)
    D = {}
    for s in ids:
        d = {s: 0}; q = deque([s])
        while q:
            u = q.popleft()
            for v in adj[u]:
                if v not in d: d[v] = d[u] + 1; q.append(v)
        D[s] = d
    return adj, D

def truth(st, me, pos, adj, D, names):
    t = st["t"]; here = pos[me]
    if t in ("alone", "onenear"):
        near = [o for o in names if o != me and D[here][pos[o]] == 1]
        return len(near) == 0 if t == "alone" else len(near) == 1
    if t == "deadend": return len(adj[here]) == 1
    if t == "crossroads": return len(adj[here]) >= 3
    if t == "nextto": return D[here][st["spot"]] == 1
    if t == "atornext": return D[here][st["spot"]] <= 1
    if t == "at": return here == st["spot"]
    if t == "notat": return here != st["spot"]
    if t == "farspot": return D[here][st["spot"]] >= 3
    if t == "closer": return D[here][st["spot"]] < D[pos[st["who"]]][st["spot"]]
    d = D[here][pos[st["who"]]]
    return {"near": d == 1, "two": d == 2, "far": d >= 3}[t]

def involved(st, me, names):
    if st["t"] in ("alone", "onenear"): return set(names)
    return {me} | ({st["who"]} if "who" in st else set())

def role_ok(role, nt, L):
    return {"H": nt == L, "F": nt == 0, "M": nt == L - 1}[role]

def grade(case, max_arity=3):
    adj, D = network(case)
    names = [p["name"] for p in case["suspects"]]
    ids = [s["id"] for s in case["spots"]]
    roles = ["H"] + [{"fibber": "F", "muddler": "M"}[r] for r in case["roles"]]
    dom = {n: {(r, s) for r in roles for s in ids} for n in names}
    for e in case["evidence"]:
        if e["type"] == "empty":
            for n in names: dom[n] = {x for x in dom[n] if x[1] != e["spot"]}
        if e["type"] == "culprit_near":
            for n in names: dom[n] = {x for x in dom[n] if x[0] != "F" or D[x[1]][e["spot"]] <= 1}
    # one constraint per speaker over the speaker plus everyone their statements mention
    cons = []
    for n in names:
        sts = case["statements"][n]
        scope = sorted(set().union(*[involved(s, n, names) for s in sts]), key=names.index)
        cons.append((n, sts, scope))

    def check(n, sts, scope, assign):
        pos = {m: assign[m][1] for m in scope}
        if len(set(pos.values())) < len(pos): return False
        nt = sum(truth(s, n, pos, adj, D, names) for s in sts)
        return role_ok(assign[n][0], nt, len(sts))

    def globals_():
        changed = False
        # one spot per suspect, all different
        for n in names:
            spots = {x[1] for x in dom[n]}
            if len(spots) == 1:
                s = next(iter(spots))
                for m in names:
                    if m != n and any(x[1] == s for x in dom[m]):
                        dom[m] = {x for x in dom[m] if x[1] != s}; changed = True
        # exactly one of each special role
        for r in roles[1:]:
            can = [n for n in names if any(x[0] == r for x in dom[n])]
            must = [n for n in names if all(x[0] == r for x in dom[n])]
            if len(can) == 1 and any(x[0] != r for x in dom[can[0]]):
                dom[can[0]] = {x for x in dom[can[0]] if x[0] == r}; changed = True
            if must:
                for m in names:
                    if m != must[0] and any(x[0] == r for x in dom[m]):
                        dom[m] = {x for x in dom[m] if x[0] != r}; changed = True
        # evidence "someone was here": if only one suspect can be there, they were
        for e in case["evidence"]:
            if e["type"] == "occupied":
                can = [n for n in names if any(x[1] == e["spot"] for x in dom[n])]
                if len(can) == 1 and any(x[1] != e["spot"] for x in dom[can[0]]):
                    dom[can[0]] = {x for x in dom[can[0]] if x[1] == e["spot"]}; changed = True
        return changed

    def revise(arity):
        changed = False
        for n, sts, scope in cons:
            if len(scope) > arity: continue
            for v in scope:
                keep = set()
                others = [m for m in scope if m != v]
                for val in dom[v]:
                    for combo in itertools.product(*[dom[m] for m in others]):
                        a = dict(zip(others, combo)); a[v] = val
                        if check(n, sts, scope, a): keep.add(val); break
                if keep != dom[v]: dom[v] = keep; changed = True
        return changed

    def solved(): return all(len(dom[n]) == 1 for n in names)
    def broken(): return any(len(dom[n]) == 0 for n in names)
    for level, arity in ((1, 1), (2, max_arity)):
        while True:
            c = revise(arity) | globals_()
            if broken(): return 9, dom
            if solved(): return level, dom
            if not c: break
    return 3, dom

if __name__ == "__main__":
    for c in json.load(open(sys.argv[1] if len(sys.argv) > 1 else "puzzles/cases.json")):
        lv, _ = grade(c)
        print(c["title"], "level", lv)
