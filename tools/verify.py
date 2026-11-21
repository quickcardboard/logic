"""Independent brute-force check that each case in puzzles/cases.json has exactly one solution."""
import itertools, json, sys
from collections import deque
cases = json.load(open(sys.argv[1] if len(sys.argv) > 1 else "puzzles/cases.json"))
def dist(case):
    ids=[s["id"] for s in case["spots"]]; adj={i:set() for i in ids}
    for a,b in case["paths"]: adj[a].add(b); adj[b].add(a)
    D={}
    for s in ids:
        d={s:0}; q=deque([s])
        while q:
            u=q.popleft()
            for v in adj[u]:
                if v not in d: d[v]=d[u]+1; q.append(v)
        D[s]=d
    return adj,D
def truth(st, me, pos, adj, D, names):
    t=st["t"]; here=pos[me]
    near=[o for o in names if o!=me and D[here][pos[o]]==1]
    if t=="deadend": return len(adj[here])==1
    if t=="crossroads": return len(adj[here])>=3
    if t=="alone": return len(near)==0
    if t=="onenear": return len(near)==1
    if t=="nextto": return D[here][st["spot"]]==1
    if t=="atornext": return D[here][st["spot"]]<=1
    if t=="farspot": return D[here][st["spot"]]>=3
    if t=="closer": return D[here][st["spot"]] < D[pos[st["who"]]][st["spot"]]
    d=D[here][pos[st["who"]]]
    return {"near":d==1,"two":d==2,"far":d>=3}[t]
ok=True
for c in cases:
    adj,D=dist(c); names=[p["name"] for p in c["suspects"]]; ids=[s["id"] for s in c["spots"]]
    sols=[]; allhonest=0
    for perm in itertools.permutations(ids,len(names)):
        pos=dict(zip(names,perm))
        occ=set(perm)
        def evid(culprit):
            for e in c["evidence"]:
                if e["type"]=="occupied" and e["spot"] not in occ: return False
                if e["type"]=="empty" and e["spot"] in occ: return False
                if e["type"]=="culprit_near" and culprit is not None and D[pos[culprit]][e["spot"]]>1: return False
            return True
        nt={n:sum(truth(s,n,pos,adj,D,names) for s in c["statements"][n]) for n in names}
        L={n:len(c["statements"][n]) for n in names}
        if all(nt[n]==L[n] for n in names) and evid(None): allhonest+=1
        for f in names:
            muds=[None] if "muddler" not in c["roles"] else [u for u in names if u!=f]
            for u in muds:
                if nt[f]!=0: continue
                if u is not None and nt[u]!=L[u]-1: continue
                if all(nt[n]==L[n] for n in names if n not in (f,u)) and evid(f):
                    sols.append((pos,f,u))
    good = len(sols)==1 and allhonest==0 and sols[0][0]==c["solution"]["positions"] and sols[0][1]==c["solution"]["fibber"]
    print(c["title"], "solutions:",len(sols),"all-honest:",allhonest,"OK" if good else "PROBLEM")
    ok &= good
sys.exit(0 if ok else 1)
