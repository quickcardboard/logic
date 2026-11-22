"""Vector drawings of map places, each centred on (0, 0) and fitting the box -130 -125 260 210."""
INK = "#4a3b30"
def ln(w=2.6, fill="none", col=INK):
    return f'fill="{fill}" stroke="{col}" stroke-width="{w}" stroke-linecap="round" stroke-linejoin="round"'
# --- the seven places, drawn in the scene ---
def bikeshed(x, y):
    return (f'<g transform="translate({x} {y})">'
      f'<path d="M-110 30 L-110 -40 L110 -40 L110 30 Z" {ln(fill="#f3dfbd")}/>'
      f'<path d="M-92 30 L-92 -20 L92 -20 L92 30 Z" {ln(2.2, fill="#7d6250")}/>'
      f'<path d="M-126 -36 L-96 -92 L126 -92 L126 -36 Z" {ln(fill="#e7605f")}/>'
      f'<path d="M-118 -52 H118 M-108 -70 H122" {ln(1.8, col="#c24b4c")}/>'
      + "".join(f'<g transform="translate({bx} 14)"><circle cx="-16" cy="6" r="13" fill="none" stroke="{INK}" stroke-width="2.4"/><circle cx="16" cy="6" r="13" fill="none" stroke="{INK}" stroke-width="2.4"/><path d="M-16 6 L-4 -12 L12 -12 L16 6 M-4 -12 L0 6 L12 -12" {ln(3.4, col=c)}/></g>'
                for bx, c in ((-56, "#4dabf7"), (0, "#ff6b6b"), (56, "#fcc419")))
      + '</g>')
def bellbox(x, y):
    return (f'<g transform="translate({x} {y})">'
      f'<path d="M-40 34 V-66 H40 V34 Z" {ln(fill="#c08a5b")}/>'
      f'<path d="M-50 -64 L0 -96 L50 -64 Z" {ln(fill="#9a6a44")}/>'
      f'<path d="M-12 -98 q-2 -18 12 -20 q14 2 12 20 z" {ln(2.2, fill="#ffd43b")}/><circle cx="0" cy="-96" r="4" fill="{INK}"/>'
      f'<path d="M0 -60 V30" {ln(2)}/>'
      f'<rect x="-10" y="-14" width="20" height="17" rx="3" {ln(2.2, fill="#adb5bd")}/><path d="M-6 -14 q6 -14 12 0" {ln(2.2)}/>'
      f'<path d="M-40 -66 L-8 -34 M-40 -46 L-20 -46 M-26 -66 L-26 -54 M-40 -56 q8 2 14 -10 M-40 -36 q18 -6 18 -22" {ln(1.2, col="#8d99a6")}/>'
      '</g>')
def garden(x, y):
    s = f'<g transform="translate({x} {y})">'
    for by in (-34, 26):
        s += f'<path d="M-96 {by-20} H96 V{by+20} H-96 Z" {ln(fill="#a0703f")}/><path d="M-86 {by-12} H86 V{by+12} H-86 Z" fill="#7a5134"/>'
        for cx in range(-72, 80, 24):
            s += f'<path d="M{cx} {by} q-8 -16 -6 -24 M{cx} {by} q0 -18 2 -26 M{cx} {by} q8 -14 8 -22" {ln(2.4, col="#4fae4f")}/><path d="M{cx-4} {by+2} L{cx} {by+10} L{cx+4} {by+2} Z" fill="#ff922b"/>'
    return s + '</g>'
def frame(x, y):
    s = f'<g transform="translate({x} {y})"><ellipse cx="0" cy="22" rx="120" ry="34" {ln(2.2, fill="#f2e2b6")}/>'
    for r, c in ((96, "#e8505b"), (70, "#4dabf7"), (44, "#fcc419")):
        s += f'<path d="M{-r} 26 Q{-r} {-r*1.1} 0 {-r*1.05} Q{r} {-r*1.1} {r} 26" {ln(6, col=c)}/>'
    s += f'<path d="M-86 -24 Q0 -36 86 -24 M-60 -60 Q0 -70 60 -60" {ln(5, col="#69db7c")}/>'
    return s + '</g>'
def fountain(x, y):
    return (f'<g transform="translate({x} {y})">'
      f'<ellipse cx="0" cy="18" rx="74" ry="24" {ln(fill="#cfd8dc")}/><ellipse cx="0" cy="12" rx="60" ry="16" {ln(2, fill="#a5d8ff")}/>'
      f'<path d="M-12 12 V-40 H12 V12" {ln(fill="#e3e8eb")}/><ellipse cx="0" cy="-42" rx="30" ry="10" {ln(fill="#cfd8dc")}/>'
      f'<path d="M4 -46 Q24 -96 50 -40 M-4 -46 Q-26 -90 -46 -36" {ln(3.4, col="#4dabf7")}/>'
      f'<circle cx="50" cy="-30" r="3.5" fill="#4dabf7"/><circle cx="-46" cy="-26" r="3.5" fill="#4dabf7"/>'
      '</g>')
def mud(x, y):
    s = (f'<g transform="translate({x} {y})"><path d="M-110 6 q-10 -40 40 -44 q30 -26 70 -6 q60 -10 68 30 q24 30 -20 46 q-40 26 -90 10 q-60 8 -68 -36 z" {ln(fill="#a47148")}/>'
         f'<ellipse cx="54" cy="20" rx="26" ry="10" fill="#8fb7d4" opacity=".8"/>')
    for i, (fx, fy) in enumerate(((-70, 10), (-40, -10), (-10, 16), (20, -6))):
        s += f'<g transform="translate({fx} {fy}) rotate(70)" fill="#5e3d26"><ellipse cx="0" cy="-5" rx="6" ry="10"/><ellipse cx="0" cy="11" rx="5" ry="5"/></g>'
    return s + '</g>'
def hopscotch(x, y):
    s = f'<g transform="translate({x} {y})"><path d="M-80 -86 H80 V70 H-80 Z" {ln(2.2, fill="#c9cdd2")}/>'
    sq = [(0, 44), (0, 12), (-18, -20), (18, -20), (0, -52)]
    for i, (sx, sy) in enumerate(sq):
        s += f'<rect x="{sx-17}" y="{sy-15}" width="34" height="30" fill="none" stroke="#ffffff" stroke-width="3"/>'
    s += f'<path d="M50 50 l14 -4" {ln(6, col="#ff8fab")}/>'
    return s + '</g>'

def flagpole(x, y):
    return (f'<g transform="translate({x} {y})"><ellipse cx="0" cy="40" rx="40" ry="12" {ln(fill="#cfd8dc")}/>'
      f'<path d="M0 40 V-110" {ln(6)}/><path d="M0 40 V-110" {ln(3, col="#e9ecef")}/><circle cx="0" cy="-112" r="7" {ln(fill="#ffd43b")}/>'
      f'<path d="M3 -104 Q40 -116 80 -100 Q70 -82 80 -62 Q40 -76 3 -64 Z" {ln(fill="#4dabf7")}/>'
      f'<path d="M38 -92 l4 9 l10 1 l-7 6 l2 10 l-9 -5 l-9 5 l2 -10 l-7 -6 l10 -1 z" fill="#fff"/></g>')
def hall(x, y):
    s = (f'<g transform="translate({x} {y})"><path d="M-110 40 V-60 H110 V40 Z" {ln(fill="#f3dfbd")}/>'
      f'<path d="M-90 40 V-14 H90 V40 Z" {ln(fill="#8a6a52")}/>'
      f'<path d="M-110 -60 Q-80 -20 -60 -60 Q-40 -10 -20 -60 M110 -60 Q80 -20 60 -60 Q40 -10 20 -60" {ln(fill="#e8505b")}/>'
      f'<path d="M-114 -62 H114" {ln(5, col="#c2554f")}/><ellipse cx="0" cy="20" rx="40" ry="10" fill="#ffe9a8" opacity=".8"/>')
    return s + '</g>'
def office(x, y):
    return (f'<g transform="translate({x} {y})"><path d="M-100 0 H60 V40 H-100 Z" {ln(fill="#c08a5b")}/>'
      f'<path d="M-88 40 V60 M48 40 V60" {ln(4)}/>'
      f'<rect x="-80" y="-60" width="70" height="52" rx="6" {ln(fill="#495057")}/><rect x="-73" y="-53" width="56" height="38" rx="3" fill="#a5d8ff"/><path d="M-45 -8 V0" {ln(5)}/>'
      f'<rect x="10" y="-30" width="26" height="30" rx="4" {ln(fill="#fff")}/><path d="M36 -22 q12 6 0 16" {ln(2.4)}/>'
      f'<path d="M70 60 V-70 H120 V60 Z" {ln(fill="#adb5bd")}/>' + "".join(f'<path d="M76 {yy} H114 V{yy+36} H76 Z" {ln(2, fill="#ced4da")}/><path d="M88 {yy+16} H102" {ln(3)}/>' for yy in (-62, -20, 22)) + '</g>')
def library(x, y):
    s = f'<g transform="translate({x} {y})"><path d="M-100 60 V-100 H100 V60 Z" {ln(fill="#a0703f")}/>'
    cols = ["#e8505b", "#4dabf7", "#fcc419", "#69db7c", "#b197fc", "#ff922b"]
    for r, yy in enumerate((-90, -40, 10)):
        s += f'<path d="M-90 {yy} H90 V{yy+44} H-90 Z" fill="#7a5134"/>'
        x0 = -88
        for i in range(10):
            w = 12 + (i * 7 + r * 3) % 8; h = 34 + (i * 5 + r) % 9
            s += f'<rect x="{x0}" y="{yy+44-h}" width="{w}" height="{h}" {ln(1.8, fill=cols[(i+r) % 6])}/>'
            x0 += w + 2
            if x0 > 74: break
    return s + '</g>'
def door(x, y):
    return (f'<g transform="translate({x} {y})"><path d="M-80 50 V-80 Q0 -120 80 -80 V50 Z" {ln(fill="#f1c9a5")}/>'
      f'<path d="M-60 50 V-70 H60 V50 Z" {ln(fill="#7fb3d5")}/><path d="M0 -70 V50" {ln()}/>'
      f'<rect x="-50" y="-60" width="40" height="50" rx="4" {ln(2, fill="#d6f0ff")}/><rect x="10" y="-60" width="40" height="50" rx="4" {ln(2, fill="#d6f0ff")}/>'
      f'<circle cx="-10" cy="10" r="4" fill="{INK}"/><circle cx="10" cy="10" r="4" fill="{INK}"/>'
      f'<path d="M-70 50 H70 L80 66 H-80 Z" {ln(fill="#e8505b")}/></g>')
def kitchen(x, y):
    return (f'<g transform="translate({x} {y})"><path d="M-90 60 V-20 H90 V60 Z" {ln(fill="#e9ecef")}/>'
      f'<rect x="-60" y="6" width="120" height="44" rx="6" {ln(fill="#495057")}/><path d="M-90 -20 H90" {ln(6)}/>'
      f'<circle cx="-70" cy="-6" r="6" {ln(2, fill="#ff6b6b")}/><circle cx="-50" cy="-6" r="6" {ln(2, fill="#ff6b6b")}/>'
      f'<path d="M-40 -24 V-80 H40 V-24 Z" {ln(fill="#ced4da")}/><path d="M-50 -80 H50" {ln(6)}/><path d="M-40 -60 H-58 M40 -60 H58" {ln(4)}/>'
      f'<path d="M-16 -92 q-10 -12 0 -24 q10 -12 0 -22 M16 -92 q-10 -12 0 -24 q10 -12 0 -22" {ln(3, col="#adb5bd")}/></g>')
def staff(x, y):
    s = (f'<g transform="translate({x} {y})"><ellipse cx="0" cy="10" rx="110" ry="34" {ln(fill="#c08a5b")}/>'
      f'<path d="M-90 30 V64 M90 30 V64" {ln(5)}/>')
    for mx, c in ((-60, "#4dabf7"), (-14, "#fcc419"), (40, "#e8505b")):
        s += f'<path d="M{mx-14} -20 V10 Q{mx} 16 {mx+14} 10 V-20 Z" {ln(fill=c)}/><path d="M{mx+14} -12 q12 4 0 16" {ln(2.4)}/><path d="M{mx-4} -30 q-6 -10 0 -18 M{mx+6} -30 q-6 -10 0 -18" {ln(2, col="#adb5bd")}/>'
    s += f'<path d="M66 -4 V-48 Q86 -60 106 -48 V-4 Z" {ln(fill="#cfd8dc")}/><path d="M66 -40 Q52 -42 54 -24" {ln(3)}/>'
    return s + '</g>'
def classroom(x, y):
    return (f'<g transform="translate({x} {y})"><rect x="-110" y="-100" width="220" height="110" rx="6" {ln(fill="#a0703f")}/>'
      f'<rect x="-100" y="-90" width="200" height="90" rx="3" fill="#2f5d50"/>'
      f'<path d="M-80 -66 q10 -12 20 0 q10 12 20 0 M-80 -36 H-10 M20 -64 L36 -40 L52 -64 M20 -30 H80" {ln(3, col="#ffffff")}/>'
      f'<path d="M-60 30 H60 V44 H-60 Z" {ln(fill="#ffd43b")}/><path d="M-50 44 V70 M50 44 V70" {ln(4)}/>'
      f'<rect x="-30" y="18" width="40" height="12" rx="2" {ln(2, fill="#fff")}/><path d="M20 24 L46 16" {ln(5, col="#ff922b")}/></g>')
def toilets(x, y):
    return (f'<g transform="translate({x} {y})"><rect x="-56" y="-100" width="70" height="56" rx="8" {ln(fill="#f8f9fa")}/>'
      f'<path d="M-70 -44 H40 Q46 6 0 18 L-10 50 H-40 L-48 18 Q-76 6 -70 -44 Z" {ln(fill="#f8f9fa")}/>'
      f'<ellipse cx="-15" cy="-44" rx="54" ry="12" {ln(fill="#e9ecef")}/>'
      f'<path d="M66 -40 V-10" {ln(4)}/><circle cx="84" cy="0" r="20" {ln(fill="#ffffff")}/><circle cx="84" cy="0" r="6" {ln(2, fill="#dee2e6")}/><path d="M84 20 V54" {ln(2.4)}/></g>')

PLACES = dict(bikeshed=bikeshed, bellbox=bellbox, garden=garden, frame=frame, fountain=fountain, mud=mud, hopscotch=hopscotch,
              flagpole=flagpole, hall=hall, office=office, library=library, door=door, kitchen=kitchen, staff=staff,
              **{"class": classroom}, toilets=toilets)
