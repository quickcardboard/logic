"""Build art.js: vector place drawings and suspect portraits for the web player.

Usage: python3 tools/build_art.py
Places (art/places.py) are keyed by spot id; portraits (art/characters.py) by suspect name.
The player falls back to the emoji icon or a coloured initial when a drawing is missing.
"""
import json, os, sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(root, "art"))
from places import PLACES
from characters import st, duck

def bust(x, y, s, skin, shirt, hair_back, hair_front, extra_face="", under="", over=""):
    """A head-and-shoulders portrait. `under` (collars, ties, lanyards) is drawn below the head so it never covers the face."""
    return f'''<g transform="translate({x} {y}) scale({s})">
 <path d="M-56 70 Q-56 30 -20 24 Q0 30 20 24 Q56 30 56 70 Z" {st(3.5, shirt)}/>
 {under}
 {hair_back}
 <ellipse cx="-56" cy="-4" rx="9" ry="13" {st(3.5, skin)}/><ellipse cx="56" cy="-4" rx="9" ry="13" {st(3.5, skin)}/>
 <ellipse cx="0" cy="-8" rx="56" ry="50" {st(3.5, skin)}/>
 {hair_front}
 <g transform="translate(0 -4)">{eyes(20, 0, 4.6)}{blush(34, 16)}{extra_face}</g>
 {over}
</g>'''

def eyes(dx=22, y=0, r=5.5):
    return "".join(f'<ellipse cx="{x}" cy="{y}" rx="{r*0.85}" ry="{r}" fill="#3b2a20"/><circle cx="{x+1.6}" cy="{y-2}" r="1.6" fill="#fff"/>' for x in (-dx, dx))
def blush(dx=36, y=18):
    return f'<ellipse cx="{-dx}" cy="{y}" rx="11" ry="7" fill="#f6a5a0" opacity=".85"/><ellipse cx="{dx}" cy="{y}" rx="11" ry="7" fill="#f6a5a0" opacity=".85"/>'

# The suspects are named after their colour, and their clothes match their pawn on the map.
RED, BLUE, GREEN, PURPLE = "#ef4444", "#3b82f6", "#22c55e", "#a855f7"

def coach(x, y, s=1):
    return bust(x, y, s, "#f3c9a4", RED, "",
        f'<path d="M-54 -22 Q-50 -64 0 -64 Q50 -64 54 -22 Q30 -42 0 -40 Q-30 -42 -54 -22 Z" {st(3.5, "#3b2a20")}/><path d="M-56 -26 Q0 -50 56 -26 L56 -14 Q0 -38 -56 -14 Z" {st(3, "#ffffff")}/>',
        f'<path d="M-12 18 Q0 28 12 18" {st(3)}/>',
        over=f'<path d="M-22 34 Q0 52 22 34" {st(2.5)}/><rect x="-9" y="48" width="18" height="10" rx="3" {st(2.5, "#ffd43b")}/>')

def bolt(x, y, s=1):
    return bust(x, y, s, "#e0a77f", BLUE, "",
        f'<path d="M-52 -26 Q-48 -66 0 -66 Q48 -66 52 -26 Z" {st(3.5, "#1d4ed8")}/><path d="M-6 -30 Q30 -34 72 -22 Q40 -14 -4 -20 Z" {st(3.5, "#1d4ed8")}/>',
        f'<path d="M-30 18 Q-30 42 0 44 Q30 42 30 18 Q14 26 0 24 Q-14 26 -30 18 Z" {st(3, "#9c6a3f")}/><path d="M-8 30 Q0 34 8 30" {st(2.5)}/>',
        over=f'<path d="M-34 46 L-30 70 M34 46 L30 70" {st(4)}/>')

def fig(x, y, s=1):
    return bust(x, y, s, "#f8d7c4", GREEN,
        f'<circle cx="0" cy="-66" r="22" {st(3.5, "#8b5e3c")}/><path d="M-10 -84 L-4 -58 M8 -86 L14 -60" stroke="#ffd43b" stroke-width="4" stroke-linecap="round"/>',
        f'<path d="M-56 -4 Q-58 -60 0 -60 Q58 -60 56 -4 Q46 -34 10 -38 Q-26 -40 -56 -4 Z" {st(3.5, "#8b5e3c")}/>',
        f'<path d="M-36 -6 Q-20 -14 -6 -4 Q-20 8 -36 -6 Z M36 -6 Q20 -14 6 -4 Q20 8 36 -6 Z" {st(3, "none")}/><path d="M-6 -4 L6 -4" {st(2.5)}/><path d="M-6 22 Q0 20 6 22" {st(3)}/>',
        under=f'<path d="M-20 26 L0 44 L20 26" {st(3, "#ffffff")}/>')

def gloria(x, y, s=1):
    net = ''.join(f'<path d="M{xx} -40 q6 -10 12 0" fill="none" stroke="#ced4da" stroke-width="2.5" stroke-linecap="round"/>' for xx in range(-46, 40, 16))
    return bust(x, y, s, "#f8cdb8", PURPLE,
        "",
        f'<path d="M-58 -10 Q-66 -70 0 -70 Q66 -70 58 -10 Q48 -40 0 -40 Q-48 -40 -58 -10 Z" {st(3.5, "#e9ecef")}/>{net}'
        '<path d="M-60 -12 Q0 -100 60 -12" fill="#ffffff" fill-opacity=".35" stroke="#a5d8ff" stroke-width="2"/>',
        f'<path d="M-12 16 Q0 26 12 16" {st(3)}/>',
        over=f'<path d="M-30 46 L30 46 L34 70 L-34 70 Z" {st(3, "#ffffff")}/>')

def plumpton(x, y, s=1):
    return bust(x, y, s, "#f8cdb8", "#5b6d94",
        "",
        f'<path d="M-50 -30 Q-36 -64 26 -60 Q50 -54 54 -32 Q28 -48 -8 -46 Q-36 -44 -50 -30 Z" {st(3, "#7a5134")}/><path d="M8 -60 Q16 -84 32 -78 Q26 -70 20 -68" {st(3, "#7a5134")}/>',
        f'<path d="M-26 12 Q-12 4 0 11 Q12 4 26 12 Q12 19 0 15 Q-12 19 -26 12 Z" {st(2.5, "#7a5134")}/><path d="M-8 26 Q0 29 8 26" {st(3)}/>',
        under=f'<path d="M-16 24 L0 62 L16 24 Z" {st(3, "#ffffff")}/><path d="M-5 38 L5 38 L3 58 L0 64 L-3 58 Z" {st(2.5, "#e8505b")}/>')

def mo(x, y, s=1):
    return bust(x, y, s, "#f6d2b5", "#f47c6c", "",
        f'<path d="M-58 -26 Q-54 -78 0 -80 Q54 -78 58 -26 Z" {st(3.5, "#e9c46a")}/><path d="M-58 -26 L-74 -16 L-50 -20 M58 -26 L74 -16 L50 -20" {st(3, "#e9c46a")}/>'
        '<path d="M-40 -64 L-18 -32 M-16 -76 L16 -32 M10 -78 L40 -40" stroke="#c9963b" stroke-width="2"/>',
        f'<path d="M-14 16 Q0 30 14 16 Z" {st(3, "#c2554f")}/>', "")

def zara(x, y, s=1):
    return bust(x, y, s, "#b9805b", "#ffd166",
        f'<circle cx="-50" cy="-56" r="24" {st(3.5, "#4a2f22")}/><circle cx="50" cy="-56" r="24" {st(3.5, "#4a2f22")}/>',
        f'<path d="M-54 -14 Q-50 -64 0 -62 Q50 -64 54 -14 Q38 -40 8 -38 Q6 -28 0 -24 Q-6 -36 -28 -36 Q-46 -32 -54 -14 Z" {st(3.5, "#4a2f22")}/>',
        f'<circle cx="-20" cy="0" r="13" {st(3, "none")}/><circle cx="20" cy="0" r="13" {st(3, "none")}/><path d="M-7 -2 Q0 -6 7 -2" {st(2.5)}/><path d="M-9 20 Q0 26 9 20" {st(3)}/>', "")


# --- The Runaway Dragon Egg: the castle grown-ups and the egg ---
def radish(x, y, s=1):
    return bust(x, y, s, "#f3c9a4", RED, "",
        f'<path d="M-60 -10 Q-62 -78 0 -78 Q62 -78 60 -10 L50 -10 Q48 -42 0 -44 Q-48 -42 -50 -10 Z" {st(3.5, "#ced4da")}/>'
        f'<path d="M0 -78 V-44" {st(3)}/><path d="M-4 -80 Q-10 -100 8 -98 Q24 -96 14 -80 Z" {st(3, "#e8505b")}/>',
        f'<path d="M0 14 Q-14 8 -30 14 Q-46 20 -50 6 Q-40 26 -20 24 Q-6 22 0 18 Q6 22 20 24 Q40 26 50 6 Q46 20 30 14 Q14 8 0 14 Z" {st(3, "#8b4a2b")}/>'
        f'<path d="M-8 32 Q0 36 8 32" {st(3)}/>',
        over=f'<path d="M-14 44 L0 58 L14 44" {st(3, "#ffd43b")}/>')

def bluebell(x, y, s=1):
    return bust(x, y, s, "#f8d7c4", BLUE,
        f'<circle cx="0" cy="-66" r="24" {st(3.5, "#c9963b")}/><path d="M-22 -80 Q-36 -94 -30 -70 Z M22 -80 Q36 -94 30 -70 Z" {st(3, "#4dabf7")}/>',
        f'<path d="M-56 -4 Q-60 -62 0 -60 Q60 -62 56 -4 Q48 -36 20 -40 Q0 -30 -20 -40 Q-48 -36 -56 -4 Z" {st(3.5, "#c9963b")}/>',
        f'<path d="M-10 18 Q0 28 10 18" {st(3)}/>',
        under=f'<path d="M-26 26 Q0 46 26 26" {st(3, "#ffffff")}/>')

def fernbeard(x, y, s=1):
    return bust(x, y, s, "#f3c9a4", GREEN, "",
        f'<path d="M-46 -42 L6 -98 L48 -42 Z" {st(3.5, "#2f9e44")}/><ellipse cx="0" cy="-40" rx="68" ry="13" {st(3.5, "#2f9e44")}/>'
        f'<path d="M8 -74 l3 7 l8 1 l-6 5 l2 8 l-7 -4 l-7 4 l2 -8 l-6 -5 l8 -1 z" fill="#ffd43b"/>',
        f'<path d="M-36 -18 Q-22 -26 -8 -18 M8 -18 Q22 -26 36 -18" {st(5, "none")}/>',
        over=f'<path d="M-42 6 Q-50 66 0 74 Q50 66 42 6 Q24 26 0 22 Q-24 26 -42 6 Z" {st(3.5, "#f8f9fa")}/><path d="M-16 22 Q0 16 16 22" {st(3, "#f8f9fa")}/>')

def mulberry(x, y, s=1):
    return bust(x, y, s, "#f8cdb8", PURPLE,
        f'<path d="M-58 -6 Q-66 -50 -40 -50 M58 -6 Q66 -50 40 -50" {st(10, "none")}/>',
        f'<path d="M-44 -46 H44 V-30 Q0 -24 -44 -30 Z" {st(3.5, "#ffffff")}/><circle cx="-26" cy="-64" r="22" {st(3.5, "#ffffff")}/><circle cx="2" cy="-74" r="24" {st(3.5, "#ffffff")}/><circle cx="28" cy="-62" r="20" {st(3.5, "#ffffff")}/><path d="M-40 -46 Q0 -54 40 -46" {st(3.5, "#ffffff")}/>',
        f'<path d="M-14 16 Q0 30 14 16" {st(3)}/>',
        over=f'<path d="M-30 46 L30 46 L34 70 L-34 70 Z" {st(3, "#ffffff")}/>')

def egg_portrait(x, y, s=1):
    dots = "".join(f'<ellipse cx="{dx}" cy="{dy}" rx="{r}" ry="{r*0.8}" fill="{c}"/>' for dx, dy, r, c in
        ((-20, -40, 7, "#2f9e44"), (18, -52, 6, "#e8590c"), (26, -14, 8, "#2f9e44"), (-30, 4, 7, "#e8590c"), (4, 20, 9, "#2f9e44"), (-8, -18, 5, "#e8590c"), (30, 32, 6, "#e8590c"), (-22, 40, 6, "#2f9e44")))
    return (f'<g transform="translate({x} {y}) scale({s})"><ellipse cx="0" cy="62" rx="54" ry="10" fill="#e9c46a" opacity=".6"/>'
            f'<ellipse cx="0" cy="-4" rx="50" ry="64" {st(3.5, "#f4b860")}/>{dots}'
            f'<path d="M-30 -40 Q-36 -20 -32 0" stroke="#ffffff" stroke-width="5" fill="none" opacity=".6" stroke-linecap="round"/></g>')

def egg_cover():
    """Cover for The Runaway Dragon Egg: a speckled egg in the Bonfire Pile in front of the castle."""
    sky = '<rect x="-200" y="-150" width="400" height="300" fill="#bfe7d3"/>'
    castle = (f'<path d="M-170 70 V-40 H-150 V-55 H-135 V-40 H-115 V-55 H-100 V-40 H-80 V70 Z" {st(3.5, "#d9cbb4")}/>'
              f'<path d="M80 70 V-60 H95 V-75 H110 V-60 H125 V-75 H140 V-60 H155 V70 Z" {st(3.5, "#d9cbb4")}/>'
              f'<path d="M110 -75 L117 -120 L124 -75" {st(3.5, "#7950f2")}/><path d="M117 -120 L140 -112 L117 -104" {st(3, "#e8505b")}/>'
              f'<path d="M-80 70 V-10 H80 V70 Z" {st(3.5, "#e6dac6")}/><path d="M-22 70 V30 Q0 8 22 30 V70 Z" {st(3.5, "#8a6a52")}/>')
    ground = f'<path d="M-200 60 Q0 40 200 60 V150 H-200 Z" {st(3.5, "#8fd18f")}/>'
    straw = "".join(f'<path d="M{x0} 120 L{x0 + dx} 64" stroke="#e9b949" stroke-width="7" stroke-linecap="round"/>' for x0, dx in ((-90, 20), (-70, -10), (-50, 26), (-30, -18), (-10, 14), (10, -20), (30, 18), (50, -12), (70, 22), (90, -14)))
    pile = f'<path d="M-110 126 Q0 40 110 126 Z" {st(3.5, "#f2c14e")}/>' + straw
    egg = egg_portrait(0, 30, 1.25)
    toast = (f'<g transform="translate(130 104)"><ellipse cx="0" cy="0" rx="22" ry="17" {st(3, "#ff922b")}/><circle cx="18" cy="-16" r="13" {st(3, "#ff922b")}/>'
             f'<circle cx="22" cy="-19" r="3" fill="#3b2a20"/><path d="M-8 -12 L-22 -32 L2 -20 Z" {st(2.5, "#ffd43b")}/><path d="M-20 4 Q-40 10 -36 -8" {st(3, "none")}/>'
             f'<circle cx="38" cy="-26" r="3" fill="#ffd43b"/><circle cx="44" cy="-18" r="2" fill="#fab005"/></g>')
    return sky + castle + ground + pile + egg + toast

PORTRAITS = {"Mo": mo, "Zara": zara, "Coach Cherry": coach, "Mr. Blueberry": bolt, "Ms. Peapod": fig, "Mrs. Lavender": gloria, "Principal Plumpton": plumpton,
             "Sir Radish": radish, "Lady Bluebell": bluebell, "Wizard Fernbeard": fernbeard, "Mother Mulberry": mulberry, "The Egg": egg_portrait}
def duck_cover():
    """Cover for The Rubber Duck Bandit: the principal, a duck on his head, ducks everywhere."""
    sky = '<rect x="-200" y="-150" width="400" height="300" fill="#ffe8a3"/>'
    rays = "".join(f'<path d="M0 30 L{300*__import__("math").cos(a/10*6.283):.0f} {300*__import__("math").sin(a/10*6.283):.0f} L{300*__import__("math").cos((a+.5)/10*6.283):.0f} {300*__import__("math").sin((a+.5)/10*6.283):.0f} Z" fill="#ffdb6e"/>' for a in range(10))
    ducks = "".join(duck(x, y, s, r, f) for x, y, s, r, f in ((-150, 100, .9, -10, False), (150, 110, .8, 12, True), (-120, -90, .6, 20, False), (140, -80, .7, -15, True), (-60, 125, .6, 0, True), (70, 128, .55, 8, False)))
    hero = duck(0, 30, 3.2)
    mask = ('<g transform="translate(0 30) scale(3.2)">'
            '<path d="M6 -24 Q20 -28 34 -22 L33 -13 Q20 -16 7 -14 Z" fill="#2b2d42" stroke="#5a3e2b" stroke-width="1.2"/>'
            '<ellipse cx="20" cy="-18.5" rx="4" ry="3" fill="#fff"/><circle cx="20.5" cy="-18.5" r="1.9" fill="#3b2a20"/>'
            '<path d="M7 -19 Q-2 -22 -6 -16 M7 -17 Q0 -14 -4 -9" stroke="#2b2d42" stroke-width="2" fill="none" stroke-linecap="round"/></g>')
    return sky + rays + ducks + hero + mask

art = {
    "placeBox": "-130 -125 260 210",
    "portraitBox": "-75 -100 150 175",
    "places": {k: f(0, 0) for k, f in PLACES.items()},
    "portraits": {k: f(0, 0, 1) for k, f in PORTRAITS.items()},
    "coverBox": "-200 -150 400 300",
    "covers": {"duck": duck_cover(), "egg": egg_cover()},
}
out = os.path.join(root, "art.js")
open(out, "w").write("// Generated by tools/build_art.py. Do not edit by hand.\nwindow.ART = " + json.dumps(art, ensure_ascii=False) + ";\n")
print("wrote", out, len(art["places"]), "places,", len(art["portraits"]), "portraits")
