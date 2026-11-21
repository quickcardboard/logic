# Who Was Where?

A prototype of a network-map deduction puzzle. Play it at https://quickcardboard.com/logic/ (served by GitHub Pages from `main`).

**Rules.** Every suspect stood on a different spot of the map. Honest suspects only say true things. The **Fibber**'s statements are all false. The **Muddler** (in some cases) gets exactly one statement wrong. The evidence is always true. Place everyone and find the Fibber.

Distances count paths along the map: "right next to" is one path, "far" is three or more.

## Files

- `index.html`, `style.css`, `app.js`: the web player. No build step; open `index.html` directly.
- `puzzles/cases.src.json`: hand-written maps, suspects, and evidence for each case.
- `tools/generate.py`: picks statements for each case so it has exactly one solution and no solution if everyone were honest. Writes `puzzles/cases.json` and `puzzles/cases.js`.
- `tools/verify.py`: independent brute-force check of every case.

```
pip install numpy
python3 tools/generate.py puzzles/cases.src.json
python3 tools/verify.py
```
