# Hunchkins

Hunchkins (working title): deduction puzzles for kids, told as storybooks. Play it at https://quickcardboard.com/logic/ (served by GitHub Pages from `main`).

**Rules.** Every suspect stood on a different spot of the map. Honest suspects only say true things. The **Fibber**'s statements are all false. The **Muddler** (in some cases) gets exactly one statement wrong. The evidence is always true. Place everyone and find the Fibber.

Distances count paths along the map: "right next to" is one path, "far" is three or more.

## Files

- `index.html` + `js/shelf.js`: the home page, a 3D bookshelf (three.js, vendored in `vendor/`). Click a book for its teaser, then open it. Browsers without WebGL get a plain list.
- `play.html` + `js/play.js`: the book. `play.html?s=<story>&p=<page>`. Pages turn with a 3D page flip; each map is its own page, and solving it unlocks the pages after it. The map is 3D (`js/map3d.js`, props in `js/props.js`, shared lighting and materials in `js/look.js`); rule checks and hints are in `js/logic.js`.
- `css/app.css`: styles for both pages, desktop and phone.
- `stories.js`: the stories, their chapters, pages of text, which puzzle each chapter uses, and each book's colour theme.
- `puzzles/book/`, `puzzles/tutorial/`: maps, suspects and evidence (`cases.src.json`) and the generated puzzles (`cases.js`).
- `print.html` + `tools/build_pdf.js`: the black-and-white printable book, one PDF per story in `pdf/`.
- `tools/generate.py`: picks statements so each case has exactly one solution and every statement is needed. `tools/grade.py` rates difficulty; `tools/verify.py` is an independent brute-force check.

No build step for the site. To rebuild puzzles, art or PDFs:

```
pip install numpy
python3 tools/generate.py puzzles/book/cases.src.json
python3 tools/verify.py
python3 tools/build_art.py
python3 -m http.server 8765 &   # then:
node tools/build_pdf.js         # needs playwright
```

## Art

Place drawings (`art/places.py`) and suspect portraits (`art/characters.py`) are built into `art.js` with `python3 tools/build_art.py`.
