"""Independent brute-force check: every case has exactly one solution, it matches the stored
answer, and (for cases with a liar) there is no solution if everyone were honest."""
import itertools, json, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from grade import network, truth, grade
cases = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "puzzles/cases.json"))
ok = True
for c in cases:
    adj, D = network(c); names = [p["name"] for p in c["suspects"]]; ids = [s["id"] for s in c["spots"]]
    sols = []; allhonest = 0
    for perm in itertools.permutations(ids, len(names)):
        pos = dict(zip(names, perm)); occ = set(perm)
        if any(e["type"] == "occupied" and e["spot"] not in occ for e in c["evidence"]): continue
        if any(e["type"] == "empty" and e["spot"] in occ for e in c["evidence"]): continue
        nt = {n: sum(truth(s, n, pos, adj, D, names) for s in c["statements"][n]) for n in names}
        L = {n: len(c["statements"][n]) for n in names}
        honest = all(nt[n] == L[n] for n in names)
        allhonest += honest
        if not c["roles"]:
            if honest: sols.append((pos, None))
            continue
        for f in names:
            if nt[f] != 0: continue
            if any(e["type"] == "culprit_near" and D[pos[f]][e["spot"]] > 1 for e in c["evidence"]): continue
            muds = [None] if "muddler" not in c["roles"] else [u for u in names if u != f]
            for u in muds:
                if u is not None and nt[u] != L[u] - 1: continue
                if all(nt[n] == L[n] for n in names if n not in (f, u)): sols.append((pos, f))
    good = (len(sols) == 1 and sols[0][0] == c["solution"]["positions"] and sols[0][1] == c["solution"]["fibber"]
            and (allhonest == 0 or not c["roles"]))
    print(f'{c["title"]}: solutions {len(sols)}, level {grade(c)[0]}, {"OK" if good else "PROBLEM"}')
    ok &= good
sys.exit(0 if ok else 1)
