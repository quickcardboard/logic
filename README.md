# Who Was Where?

A prototype of a network-map deduction puzzle. Play it at https://quickcardboard.com/logic (home page: story shelf; play.html?s=duck plays a story, play.html?s=practice the practice cases)/ (served by GitHub Pages from `main`).

**Rules.** Every suspect stood on a different spot of the map. Honest suspects only say true things. The **Fibber**'s statements are all false. The **Muddler** (in some cases) gets exactly one statement wrong. The evidence is always true. Place everyone and find the Fibber.

Distances count paths along the map: "right next to" is one path, "far" is three or more.

## Files

- `index.html`, `style.css`, `app.js`: the web player. No build step; open `index.html` directly.
- `puzzles/cases.src.json`: hand-written maps, suspects, and evidence for each case.
- `tools/generate.py`: picks statements for each case so it has exactly one solution at the wanted difficulty, every statement is needed, and (with a liar) there is no solution if everyone were honest. Writes `puzzles/cases.json` and `puzzles/cases.js`.
- `tools/grade.py`: rates each case by the simplest steps that solve it. ★ = statements about a person's own spot are enough, ★★ = also needs statements linking two people, ★★★ = needs trial and error ("suppose X is the Fibber").
- `tools/verify.py`: independent brute-force check of every case.

```
pip install numpy
python3 tools/generate.py puzzles/cases.src.json
python3 tools/verify.py
```

## Art

Place drawings (`art/places.py`) and suspect portraits (`art/characters.py`) are built into `art.js` with `python3 tools/build_art.py`. Spots without a drawing fall back to their emoji; suspects without a portrait show a coloured initial.
