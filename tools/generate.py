"""Generate statements for each case so it has exactly one solution at the wanted difficulty.

Every statement is needed: removing any one leaves more than one solution.

Rules: every suspect stands on a different spot. Honest suspects make only true
statements. The Fibber's statements are all false. The Muddler has exactly one
false statement. Evidence is always true. A case with "roles": [] has no liar.

Each case in the source file may set:
  "level": 1, 2 or 3 (see tools/grade.py). Default 3.
  "kinds": statement kinds the generator may use.
  "want_fibber": the name the story needs to be the Fibber.
  "statements" + "solution": a hand-written case, kept as is.

Usage: python3 tools/generate.py puzzles/cases.src.json
Writes puzzles/cases.json and puzzles/cases.js (the web player loads the .js file).
"""
import itertools, json, os, random, sys
sys.path.insert(0, os.path.dirname(__file__))
from grade import network, truth, grade, role_ok

ALL_KINDS = ["deadend", "crossroads", "nextto", "farspot", "near", "two", "far", "closer", "alone", "onenear"]

def library(case, kinds):
    names = [p["name"] for p in case["suspects"]]
    spots = case["spots"]
    lib = {n: [] for n in names}
    for n in names:
        add = lambda k, text, **kw: k in kinds and lib[n].append(dict(text=text, t=k, **kw))
        add("deadend", "I was at a dead end.")
        add("crossroads", "I was at a crossroads (3 or more paths).")
        add("alone", "Nobody was right next to me.")
        add("onenear", "Exactly one person was right next to me.")
        for s in spots:
            add("nextto", f"I was right next to the {s['name']}.", spot=s["id"])
            add("notat", f"I wasn't at the {s['name']}.", spot=s["id"])
            add("farspot", f"I was far from the {s['name']} (3 or more paths).", spot=s["id"])
        for m in names:
            if m == n: continue
            add("near", f"{m} was right next to me.", who=m)
            add("two", f"{m} and I were exactly two paths apart.", who=m)
            add("far", f"{m} was far from me (3 or more paths).", who=m)
            for s in spots:
                add("closer", f"I was closer to the {s['name']} than {m} was.", who=m, spot=s["id"])
    return lib

def solutions(case, limit=2):
    adj, D = network(case)
    names = [p["name"] for p in case["suspects"]]
    ids = [s["id"] for s in case["spots"]]
    roles = case["roles"]
    out, honest_ok = [], 0
    for perm in itertools.permutations(ids, len(names)):
        pos = dict(zip(names, perm)); occ = set(perm)
        if any(e["type"] == "occupied" and e["spot"] not in occ for e in case["evidence"]): continue
        if any(e["type"] == "empty" and e["spot"] in occ for e in case["evidence"]): continue
        nt = {n: sum(truth(s, n, pos, adj, D, names) for s in case["statements"][n]) for n in names}
        L = {n: len(case["statements"][n]) for n in names}
        if all(nt[n] == L[n] for n in names):
            honest_ok += 1
            if not roles: out.append((pos, None, None))
        if not roles: 
            if len(out) >= limit: break
            continue
        for f in names:
            if nt[f] != 0: continue
            if any(e["type"] == "culprit_near" and D[pos[f]][e["spot"]] > 1 for e in case["evidence"]): continue
            for u in ([None] if "muddler" not in roles else [u for u in names if u != f]):
                if u is not None and nt[u] != L[u] - 1: continue
                if all(nt[n] == L[n] for n in names if n not in (f, u)):
                    out.append((pos, f, u))
        if len(out) >= limit: break
    return out, honest_ok

def build(case, seed, tries=20000):
    rng = random.Random(seed)
    names = [p["name"] for p in case["suspects"]]
    kinds = case.get("kinds", ALL_KINDS)
    lib = library(case, kinds)
    per = case.get("per", 2)
    want = case.get("level", 3)
    for _ in range(tries):
        st = {}
        for n in names:
            ks = rng.sample(sorted({x["t"] for x in lib[n]}), per)
            st[n] = [rng.choice([x for x in lib[n] if x["t"] == k]) for k in ks]
        texts = [s["text"] for n in names for s in st[n]]
        if len(set(texts)) != len(texts): continue
        trial = dict(case, statements=st)
        sols, honest_ok = solutions(trial)
        if len(sols) != 1: continue
        if case["roles"] and honest_ok: continue
        pos, f, u = sols[0]
        if case.get("want_fibber") and f != case["want_fibber"]: continue
        if f:   # the Fibber's statements must not contradict each other on their face
            if not any(all(truth(s, f, p, *network(case), names) for s in st[f])
                       for p in (dict(zip(names, pr)) for pr in itertools.permutations([s["id"] for s in case["spots"]], len(names)))):
                continue
        lv, _ = grade(trial)
        if lv != want: continue
        # every statement must matter: drop any statement the case can do without
        # (each person keeps at least one), as long as the difficulty stays the same
        for n in names:
            for x in list(st[n]):
                if len(st[n]) == 1: break
                st2 = dict(st); st2[n] = [y for y in st[n] if y is not x]
                t2 = dict(case, statements=st2)
                s2, h2 = solutions(t2)
                if len(s2) == 1 and not (case["roles"] and h2) and s2[0][1] == f and grade(t2)[0] == want:
                    st = st2
        trial = dict(case, statements=st)
        def needed(n, k):
            st2 = {m: [x for j, x in enumerate(v) if not (m == n and j == k)] for m, v in st.items()}
            return len(solutions(dict(case, statements=st2))[0]) != 1
        if not all(needed(n, k) for n in names for k in range(len(st[n])) if len(st[n]) > 1): continue
        trial["solution"] = {"positions": pos, "fibber": f, "muddler": u}
        return trial
    return None

if __name__ == "__main__":
    src = json.load(open(sys.argv[1]))
    result = []
    for c in src:
        if "statements" in c:
            lv, _ = grade(c); c = dict(c, level=lv)
            result.append(c); print(c["title"], "hand-written, level", lv, file=sys.stderr); continue
        for seed in range(40):
            r = build(c, seed)
            if r:
                result.append(r); print(c["title"], "ok, level", r["level"] if "level" in r else 3, r["solution"], file=sys.stderr); break
        else:
            print(c["title"], "FAILED", file=sys.stderr); sys.exit(1)
    out = os.path.join(os.path.dirname(sys.argv[1]), "cases")
    json.dump(result, open(out + ".json", "w"), indent=1, ensure_ascii=False)
    var = "BOOK" if os.path.basename(os.path.dirname(os.path.abspath(sys.argv[1]))) == "book" else "CASES"
    open(out + ".js", "w").write("// Generated by tools/generate.py. Do not edit by hand.\nwindow." + var + " = " + json.dumps(result, indent=1, ensure_ascii=False) + ";\n")
