# "Cute clip-art" style: soft brown outlines, pastel flat colour, dot eyes, rosy cheeks, extra whimsy.
L = "#5a3e2b"   # line colour
def st(w=3.5, fill="none", extra=""):
    return f'fill="{fill}" stroke="{L}" stroke-width="{w}" stroke-linejoin="round" stroke-linecap="round" {extra}'
def eyes(dx=22, y=0, r=5.5, look=0):
    return "".join(f'<ellipse cx="{x+look}" cy="{y}" rx="{r*0.85}" ry="{r}" fill="#3b2a20"/><circle cx="{x+look+1.6}" cy="{y-2}" r="1.6" fill="#fff"/>' for x in (-dx, dx))
def blush(dx=36, y=18):
    return f'<ellipse cx="{-dx}" cy="{y}" rx="11" ry="7" fill="#f6a5a0" opacity=".85"/><ellipse cx="{dx}" cy="{y}" rx="11" ry="7" fill="#f6a5a0" opacity=".85"/>'
def sparkle(x, y, s=1, c="#ffcf3f"):
    return f'<path transform="translate({x} {y}) scale({s})" d="M0 -12 Q2 -2 12 0 Q2 2 0 12 Q-2 2 -12 0 Q-2 -2 0 -12 Z" fill="{c}" stroke="{L}" stroke-width="2"/>'
def zing(x, y, rot=0):   # little "!" emphasis marks like the reference
    return f'<g transform="translate({x} {y}) rotate({rot})" stroke="#e8505b" stroke-width="4" stroke-linecap="round"><path d="M-14 -4 L-20 -12"/><path d="M0 -8 L0 -18"/><path d="M14 -4 L20 -12"/></g>'
def text(x, y, t, size=22, color=L, rot=0, family="'Comic Neue', 'Comic Sans MS', 'Chalkboard SE', sans-serif"):
    return f'<text x="{x}" y="{y}" transform="rotate({rot} {x} {y})" font-family="{family}" font-weight="bold" font-size="{size}" fill="{color}" text-anchor="middle">{t}</text>'

def duck(x, y, s=1, r=0, flip=False):
    sx = -s if flip else s
    return f'''<g transform="translate({x} {y}) rotate({r}) scale({sx} {s})">
 <path d="M-30 4 C-34 -12 -16 -18 -2 -14 C0 -32 28 -36 32 -14 C34 -4 26 0 22 2 C30 8 32 22 18 28 C2 34 -26 32 -30 4 Z" {st(3, "#ffe066")}/>
 <path d="M30 -18 C42 -20 48 -13 42 -8 C38 -5 33 -8 30 -10" {st(3, "#ffa94d")}/>
 <circle cx="20" cy="-18" r="3.6" fill="#3b2a20"/><circle cx="21.2" cy="-19.4" r="1.1" fill="#fff"/>
 <ellipse cx="12" cy="-8" rx="5" ry="3" fill="#f6a5a0" opacity=".8"/>
 <path d="M-14 6 C-6 0 4 2 9 9" {st(2.5)}/>
</g>'''

MO_MOUTH = {"grin": '<path d="M-16 16 Q0 34 16 16 Z" fill="#c2554f" stroke="#5a3e2b" stroke-width="3" stroke-linejoin="round"/><path d="M-10 25 Q0 30 10 25" fill="#f6a5a0"/>',
            "shout": '<ellipse cx="0" cy="26" rx="14" ry="16" fill="#c2554f" stroke="#5a3e2b" stroke-width="3"/><ellipse cx="0" cy="34" rx="8" ry="5" fill="#f6a5a0"/>'}
def mo(x, y, s=1, mood='grin'):
    return f'''<g transform="translate({x} {y}) scale({s})">
 <!-- legs -->
 <path d="M-22 -58 L-24 -14 L-6 -14 L-4 -58 Z M4 -58 L6 -14 L24 -14 L22 -58 Z" {st(3.5, "#f6d2b5")}/>
 <path d="M-36 -78 L-34 -40 L34 -40 L36 -78 Z" {st(3.5, "#7aa6d8")}/>
 <path d="M-30 -10 Q-30 -20 -14 -18 Q-2 -16 -4 -6 Q-18 -2 -30 -10 Z M30 -10 Q30 -20 14 -18 Q2 -16 4 -6 Q18 -2 30 -10 Z" {st(3.5, "#ffffff")}/>
 <!-- arms (behind the body so the shoulders blend) -->
 <path d="M-36 -150 Q-62 -120 -60 -90" stroke="#5a3e2b" stroke-width="22" fill="none" stroke-linecap="round"/>
 <path d="M36 -150 Q66 -158 78 -190" stroke="#5a3e2b" stroke-width="22" fill="none" stroke-linecap="round"/>
 <!-- body -->
 <path d="M-26 -160 Q-46 -156 -44 -130 Q-48 -96 -40 -70 Q0 -60 40 -70 Q48 -96 44 -130 Q46 -156 26 -160 Q0 -166 -26 -160 Z" {st(3.5, "#f47c6c")}/>
 <path d="M-36 -150 Q-62 -120 -60 -90" stroke="#f47c6c" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M36 -150 Q66 -158 78 -190" stroke="#f47c6c" stroke-width="15" fill="none" stroke-linecap="round"/>
 <path d="M-16 -154 Q0 -140 16 -154" {st(3)}/>
 <circle cx="-59" cy="-84" r="11" {st(3.5, "#f6d2b5")}/>
 <!-- raised arm with magnifier -->
 
 <path d="M80 -198 L96 -232" stroke="#8b5e3c" stroke-width="8" stroke-linecap="round"/>
 <circle cx="104" cy="-252" r="22" {st(4, "#d9f0ff")}/><path d="M94 -262 Q100 -268 108 -266" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
 <circle cx="79" cy="-194" r="11" {st(3.5, "#f6d2b5")}/>
 <!-- head -->
 <ellipse cx="-70" cy="-216" rx="10" ry="14" {st(3.5, "#f6d2b5")}/><ellipse cx="70" cy="-216" rx="10" ry="14" {st(3.5, "#f6d2b5")}/>
 <ellipse cx="0" cy="-222" rx="70" ry="64" {st(3.5, "#f6d2b5")}/>
 <path d="M-62 -244 Q-70 -230 -58 -222 M62 -244 Q70 -230 58 -222" {st(3, "#9c6a3f")}/>
 <g transform="translate(0 -214)">{eyes(24, 0)}{blush(42, 20)}
  <g fill="#d48a5f"><circle cx="-44" cy="8" r="2"/><circle cx="-38" cy="12" r="2"/><circle cx="-48" cy="14" r="2"/><circle cx="44" cy="8" r="2"/><circle cx="38" cy="12" r="2"/><circle cx="48" cy="14" r="2"/></g>
  {MO_MOUTH[mood]}
 </g>
 <!-- cereal-box deerstalker -->
 <path d="M-66 -250 Q-62 -302 0 -306 Q62 -302 66 -250 Z" {st(3.5, "#e9c46a")}/>
 <path d="M-66 -250 L-86 -238 L-58 -242 M66 -250 L86 -238 L58 -242" {st(3.5, "#e9c46a")}/>
 <path d="M-48 -290 L-20 -252 M-24 -302 L16 -252 M4 -305 L44 -256 M-52 -262 L-22 -300 M-14 -252 L22 -302 M18 -252 L50 -290" stroke="#c9963b" stroke-width="2.2"/>
 <rect x="-26" y="-296" width="52" height="20" rx="4" {st(2.5, "#fff7df")} transform="rotate(-4 0 -286)"/>
 {text(0, -281, "CRUNCH!", 13, "#e8505b", -4)}
 <path d="M-6 -306 Q0 -322 10 -316 Q4 -312 6 -306" {st(3, "#9c6a3f")}/>
</g>'''

def nibbles(x, y, s=1):
    return f'''<g transform="translate({x} {y}) scale({s})">
 <ellipse cx="0" cy="-26" rx="34" ry="28" {st(3.5, "#f3c58b")}/>
 <ellipse cx="0" cy="-18" rx="20" ry="16" fill="#fff4e2"/>
 <circle cx="-22" cy="-50" r="9" {st(3, "#f6b0a8")}/><circle cx="22" cy="-50" r="9" {st(3, "#f6b0a8")}/>
 <g transform="translate(0 -34)">{eyes(11, 0, 4)}</g>
 <ellipse cx="0" cy="-26" rx="4" ry="3" fill="#e8505b"/>
 <path d="M-6 -21 Q0 -16 6 -21" {st(2.5)}/>
 <ellipse cx="-20" cy="-22" rx="6" ry="4" fill="#f6a5a0" opacity=".8"/><ellipse cx="20" cy="-22" rx="6" ry="4" fill="#f6a5a0" opacity=".8"/>
 <path d="M-12 0 Q-12 -8 -6 -6 M12 0 Q12 -8 6 -6" {st(3, "#f6b0a8")}/>
 <!-- police cap -->
 <path d="M-26 -58 L26 -58 L22 -74 Q0 -84 -22 -74 Z" {st(3, "#4a6fa5")}/><path d="M-30 -57 Q0 -50 30 -57" {st(4, "#2f4b75")}/>
 <path d="M0 -76 L3 -70 L9 -70 L4 -66 L6 -60 L0 -64 L-6 -60 L-4 -66 L-9 -70 L-3 -70 Z" fill="#ffd43b" stroke="{L}" stroke-width="1.5"/>
</g>'''

def zara(x, y, s=1, mood='calm'):
    return f'''<g transform="translate({x} {y}) scale({s})">
 <path d="M-22 -58 L-24 -14 L-6 -14 L-4 -58 Z M4 -58 L6 -14 L24 -14 L22 -58 Z" {st(3.5, "#9b7bd4")}/>
 <path d="M-30 -10 Q-30 -20 -14 -18 Q-2 -16 -4 -6 Q-18 -2 -30 -10 Z M30 -10 Q30 -20 14 -18 Q2 -16 4 -6 Q18 -2 30 -10 Z" {st(3.5, "#e8505b")}/>
 <path d="M-38 -150 Q-64 -122 -64 -90" stroke="#5a3e2b" stroke-width="22" fill="none" stroke-linecap="round"/>
 <path d="M38 -150 Q70 -156 80 -188" stroke="#5a3e2b" stroke-width="22" fill="none" stroke-linecap="round"/>
 <path d="M-26 -160 Q-48 -156 -46 -130 Q-52 -96 -44 -60 Q0 -50 44 -60 Q52 -96 46 -130 Q48 -156 26 -160 Q0 -166 -26 -160 Z" {st(3.5, "#ffd166")}/>
 <path d="M-38 -150 Q-64 -122 -64 -90" stroke="#ffd166" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M38 -150 Q70 -156 80 -188" stroke="#ffd166" stroke-width="15" fill="none" stroke-linecap="round"/>
 <path d="M0 -156 L0 -58" {st(2.5)}/>
 <g fill="#fff" stroke="{L}" stroke-width="2">{''.join(f'<circle cx="-8" cy="{yy}" r="3.5"/>' for yy in (-130,-108,-86))}</g>
 <!-- notebook hand and pencil hand -->
 <g transform="rotate(8 -84 -70)"><rect x="-112" y="-96" width="52" height="40" rx="5" {st(3.5, "#63c5b5")}/>
  <path d="M-102 -84 L-70 -84 M-102 -74 L-74 -74 M-102 -64 L-80 -64" stroke="#fff" stroke-width="3" stroke-linecap="round"/></g>
 <circle cx="-64" cy="-84" r="10" {st(3.5, "#b9805b")}/>
 <path d="M84 -200 L96 -236" stroke="#ffb347" stroke-width="8" stroke-linecap="round"/><path d="M96 -236 L99 -246 L92 -240 Z" fill="#5a3e2b"/><path d="M83 -197 L85 -204" stroke="#ff8fab" stroke-width="8" stroke-linecap="round"/>
 <circle cx="80" cy="-192" r="10" {st(3.5, "#b9805b")}/>
 <!-- hair puffs -->
 <circle cx="-62" cy="-268" r="32" {st(3.5, "#4a2f22")}/><circle cx="62" cy="-268" r="32" {st(3.5, "#4a2f22")}/>
 <path d="M-76 -276 Q-66 -290 -54 -282 M54 -282 Q66 -290 76 -276" stroke="#6e4a37" stroke-width="3" fill="none" stroke-linecap="round"/>
 <circle cx="-38" cy="-286" r="8" {st(3, "#ff8fab")}/><circle cx="38" cy="-286" r="8" {st(3, "#ff8fab")}/>
 <!-- head -->
 <ellipse cx="-68" cy="-214" rx="9" ry="13" {st(3.5, "#b9805b")}/><ellipse cx="68" cy="-214" rx="9" ry="13" {st(3.5, "#b9805b")}/>
 <ellipse cx="0" cy="-222" rx="68" ry="63" {st(3.5, "#b9805b")}/>
 <path d="M-66 -232 Q-60 -292 0 -288 Q60 -292 66 -232 Q46 -262 10 -258 Q12 -246 0 -240 Q-8 -256 -34 -256 Q-56 -252 -66 -232 Z" {st(3.5, "#4a2f22")}/>
 <g transform="translate(0 -212)">{eyes(24, 0, 5)}{blush(40, 22)}
  <circle cx="-24" cy="0" r="16" {st(3.5, "none")}/><circle cx="24" cy="0" r="16" {st(3.5, "none")}/><path d="M-8 -2 Q0 -8 8 -2" {st(3)}/>
  {'<ellipse cx="0" cy="28" rx="7" ry="9" fill="#c2554f" stroke="#5a3e2b" stroke-width="3"/>' if mood=="gasp" else '<path d="M-10 26 Q0 32 10 24" fill="none" stroke="#5a3e2b" stroke-width="3" stroke-linecap="round"/>'}
 </g>
</g>'''

def plumpton(x, y, s=1, mood='smug'):
    return f'''<g transform="translate({x} {y}) scale({s})">
 <path d="M-26 -40 L-28 -8 L-8 -8 L-8 -40 Z M8 -40 L8 -8 L28 -8 L26 -40 Z" {st(3.5, "#4a5a7a")}/>
 <ellipse cx="-20" cy="-6" rx="20" ry="9" {st(3.5, "#3b2a20")}/><ellipse cx="20" cy="-6" rx="20" ry="9" {st(3.5, "#3b2a20")}/>
 <path d="M-52 -150 Q-94 -116 -80 -84" stroke="{L}" stroke-width="22" fill="none" stroke-linecap="round"/>
 <path d="M52 -150 Q94 -116 80 -84" stroke="{L}" stroke-width="22" fill="none" stroke-linecap="round"/>
 <ellipse cx="0" cy="-112" rx="76" ry="80" {st(3.5, "#5b6d94")}/>
 <path d="M-52 -150 Q-94 -116 -80 -84" stroke="#5b6d94" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M52 -150 Q94 -116 80 -84" stroke="#5b6d94" stroke-width="15" fill="none" stroke-linecap="round"/>
 <path d="M-24 -186 L0 -120 L24 -186 Z" {st(3, "#ffffff")}/>
 <path d="M-8 -178 L8 -178 L5 -128 L0 -120 L-5 -128 Z" {st(3, "#e8505b")}/>
 <path d="M-30 -176 L-10 -140 L-36 -150 Z M30 -176 L10 -140 L36 -150 Z" {st(3, "#6d80a8")}/>
  <circle cx="-80" cy="-80" r="11" {st(3.5, "#f8cdb8")}/><circle cx="80" cy="-80" r="11" {st(3.5, "#f8cdb8")}/>
 <!-- coffee mug -->
 <rect x="84" y="-112" width="30" height="34" rx="4" {st(3.5, "#ffffff")}/><path d="M114 -104 Q126 -96 114 -86" {st(3.5)}/>
 {text(99, -90, "#1", 13, "#e8505b")}
 <ellipse cx="-64" cy="-238" rx="9" ry="13" {st(3.5, "#f8cdb8")}/><ellipse cx="64" cy="-238" rx="9" ry="13" {st(3.5, "#f8cdb8")}/>
 <ellipse cx="0" cy="-244" rx="64" ry="58" {st(3.5, "#f8cdb8")}/>
 <!-- comb-over with one heroic curl -->
 <path d="M-56 -266 Q-40 -300 30 -296 Q56 -290 60 -268 Q30 -284 -10 -282 Q-40 -280 -56 -266 Z" {st(3, "#7a5134")}/>
 <path d="M10 -296 Q18 -322 36 -316 Q30 -306 22 -304" {st(3, "#7a5134")}/>
 <g transform="translate(0 -238)">{eyes(22, -4, 5)}{blush(38, 16)}
  <path d="M-34 -18 L-12 -14 M12 -14 L34 -18" {st(4)}/>
  <path d="M-28 16 Q-14 6 0 14 Q14 6 28 16 Q14 24 0 18 Q-14 24 -28 16 Z" {st(2.5, "#7a5134")}/>
  {'<ellipse cx="0" cy="34" rx="9" ry="11" fill="#c2554f" stroke="#5a3e2b" stroke-width="3"/>' if mood=="shock" else '<path d="M-10 30 Q0 34 10 30" fill="none" stroke="#5a3e2b" stroke-width="3" stroke-linecap="round"/>'}
 </g>
</g>'''

def gloria(x, y, s=1):
    return f'''<g transform="translate({x} {y}) scale({s})">
 <path d="M-22 -50 L-24 -12 L-6 -12 L-4 -50 Z M4 -50 L6 -12 L24 -12 L22 -50 Z" {st(3.5, "#f8cdb8")}/>
 <path d="M-30 -8 Q-30 -18 -14 -16 Q-2 -14 -4 -4 Q-18 0 -30 -8 Z M30 -8 Q30 -18 14 -16 Q2 -14 4 -4 Q18 0 30 -8 Z" {st(3.5, "#63c5b5")}/>
 <path d="M-42 -150 Q-70 -118 -62 -84" stroke="{L}" stroke-width="22" fill="none" stroke-linecap="round"/>
 <path d="M42 -150 Q70 -152 78 -176" stroke="{L}" stroke-width="22" fill="none" stroke-linecap="round"/>
 <path d="M-28 -162 Q-52 -158 -52 -132 Q-60 -90 -54 -48 Q0 -38 54 -48 Q60 -90 52 -132 Q52 -158 28 -162 Q0 -168 -28 -162 Z" {st(3.5, "#c3a6e6")}/>
 <path d="M-42 -150 Q-70 -118 -62 -84" stroke="#c3a6e6" stroke-width="15" fill="none" stroke-linecap="round"/><path d="M42 -150 Q70 -152 78 -176" stroke="#c3a6e6" stroke-width="15" fill="none" stroke-linecap="round"/>
 <path d="M-32 -120 L32 -120 L36 -52 Q0 -46 -36 -52 Z" {st(3.5, "#ffffff")}/>
 <path d="M-12 -98 Q0 -88 12 -98 Q8 -84 0 -82 Q-8 -84 -12 -98 Z" fill="#ff8fab" stroke="{L}" stroke-width="2"/>
 
 <circle cx="-61" cy="-79" r="11" {st(3.5, "#f8cdb8")}/>
 
 <path d="M82 -176 L100 -250" stroke="#adb5bd" stroke-width="8" stroke-linecap="round"/><ellipse cx="104" cy="-262" rx="20" ry="14" {st(3.5, "#dee2e6")}/>
 <circle cx="79" cy="-180" r="11" {st(3.5, "#f8cdb8")}/>
 <ellipse cx="-66" cy="-214" rx="9" ry="13" {st(3.5, "#f8cdb8")}/><ellipse cx="66" cy="-214" rx="9" ry="13" {st(3.5, "#f8cdb8")}/>
 <ellipse cx="0" cy="-220" rx="66" ry="62" {st(3.5, "#f8cdb8")}/>
 <!-- silver curls under a hairnet -->
 <path d="M-68 -222 Q-80 -300 0 -300 Q80 -300 68 -222 Q56 -258 0 -258 Q-56 -258 -68 -222 Z" {st(3.5, "#e9ecef")}/>
 <g fill="none" stroke="#ced4da" stroke-width="2.5" stroke-linecap="round">{''.join(f'<path d="M{xx} -262 q6 -10 12 0"/>' for xx in range(-54, 50, 16))}{''.join(f'<path d="M{xx} -282 q6 -10 12 0"/>' for xx in range(-40, 40, 16))}</g>
 <path d="M-72 -226 Q0 -340 72 -226" fill="#ffffff" fill-opacity=".35" stroke="#a5d8ff" stroke-width="2"/>
 <path d="M-58 -260 L58 -260 M-46 -290 L46 -290 M-30 -310 L-50 -226 M0 -318 L0 -258 M30 -310 L50 -226" stroke="#a5d8ff" stroke-width="1.6"/>
 <g transform="translate(0 -212)">
  <path d="M-30 -2 Q-23 -10 -16 -2 M16 -2 Q23 -10 30 -2" {st(3.5)}/>{blush(40, 16)}
  <path d="M-14 18 Q0 32 14 18" {st(3.5, "#c2554f")}/>
  <path d="M-46 -2 Q-60 30 -40 60 M46 -2 Q60 30 40 60" stroke="#c9a227" stroke-width="1.8" fill="none" stroke-dasharray="2 3"/>
 </g>
 {text(-92, -262, "♪", 34, "#9b7bd4", -10, "Georgia, serif")}{text(-118, -222, "♫", 26, "#9b7bd4", 8, "Georgia, serif")}
</g>'''

def page(w, h, body, bg="#fff9ef"):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}">
<rect width="{w}" height="{h}" fill="{bg}"/>{body}</svg>'''

def bust(x, y, s, skin, shirt, hair_back, hair_front, extra_face="", extra=""):
    return f'''<g transform="translate({x} {y}) scale({s})">
 <path d="M-56 70 Q-56 30 -20 24 Q0 30 20 24 Q56 30 56 70 Z" {st(3.5, shirt)}/>
 {hair_back}
 <ellipse cx="-56" cy="-4" rx="9" ry="13" {st(3.5, skin)}/><ellipse cx="56" cy="-4" rx="9" ry="13" {st(3.5, skin)}/>
 <ellipse cx="0" cy="-8" rx="56" ry="50" {st(3.5, skin)}/>
 {hair_front}
 <g transform="translate(0 -4)">{eyes(20, 0, 4.6)}{blush(34, 16)}{extra_face}</g>
 {extra}
</g>'''

def coach(x, y, s=1):
    return bust(x, y, s, "#f3c9a4", "#3fa7d6",
        "",
        f'<path d="M-54 -22 Q-50 -64 0 -64 Q50 -64 54 -22 Q30 -42 0 -40 Q-30 -42 -54 -22 Z" {st(3.5, "#3b2a20")}/><path d="M-56 -26 Q0 -50 56 -26 L56 -14 Q0 -38 -56 -14 Z" {st(3, "#e8505b")}/>',
        f'<path d="M-12 18 Q0 28 12 18" {st(3)}/>',
        f'<path d="M-20 26 L0 46 L20 26" {st(3, "#3fa7d6")}/><path d="M0 46 L0 58" {st(2.5)}/><rect x="-8" y="56" width="18" height="10" rx="3" {st(2.5, "#ffd43b")}/>')

def bolt(x, y, s=1):
    return bust(x, y, s, "#e0a77f", "#7a9e7e",
        "",
        f'<path d="M-52 -26 Q-48 -66 0 -66 Q48 -66 52 -26 Z" {st(3.5, "#4a6fa5")}/><path d="M-6 -30 Q30 -34 72 -22 Q40 -14 -4 -20 Z" {st(3.5, "#4a6fa5")}/>',
        f'<path d="M-30 18 Q-30 42 0 44 Q30 42 30 18 Q14 26 0 24 Q-14 26 -30 18 Z" {st(3, "#9c6a3f")}/><path d="M-8 30 Q0 34 8 30" {st(2.5)}/>',
        f'<path d="M-34 40 L-30 70 M34 40 L30 70" {st(4)}/>')

def fig(x, y, s=1):
    return bust(x, y, s, "#f8d7c4", "#9b7bd4",
        f'<circle cx="0" cy="-66" r="22" {st(3.5, "#8b5e3c")}/><path d="M-10 -84 L-4 -58 M8 -86 L14 -60" stroke="#ffd43b" stroke-width="4" stroke-linecap="round"/>',
        f'<path d="M-56 -4 Q-58 -60 0 -60 Q58 -60 56 -4 Q46 -34 10 -38 Q-26 -40 -56 -4 Z" {st(3.5, "#8b5e3c")}/>',
        f'<path d="M-36 -6 Q-20 -14 -6 -4 Q-20 8 -36 -6 Z M36 -6 Q20 -14 6 -4 Q20 8 36 -6 Z" {st(3, "none")}/><path d="M-6 -4 L6 -4" {st(2.5)}/><path d="M-8 20 Q0 18 8 20" {st(3)}/><rect x="-5.5" y="6" width="11" height="34" rx="5.5" {st(3, "#f8d7c4")}/><circle cx="0" cy="46" r="13" {st(3, "#f8d7c4")}/><path d="M-6 40 L6 40" stroke="#f8d7c4" stroke-width="5"/>',
        "")
