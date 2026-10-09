"""Generate the keyframe illustrations for "Bit: The Pipeline" anime short.

Each scene is drawn as a 1920x1080 SVG in a flat anime style with the same two
characters as the portfolio: the engineer and Bit. Run:

    python3 anime/generate_scenes.py

SVGs land in anime/scenes/. Render PNGs with `node anime/render_png.cjs`.
"""

from pathlib import Path
import random

OUT = Path(__file__).parent / "scenes"
W, H = 1920, 1080

SKIN = "#ffe0c7"
SKIN_SHADE = "#f5c4a3"
HAIR = "#1b1c27"
HAIR_HI = "#3a3f5c"
TOP = "#1f2430"
TROUSERS = "#59657a"
ORANGE = "#ff8a3d"
BLUSH = "#ff9aa2"


# ---------------------------------------------------------------- helpers

def sparkle(x, y, r, color="#ffffff", opacity=1.0):
    """Four-point anime sparkle."""
    s = r * 0.22
    return (
        f'<path d="M{x} {y-r} Q{x+s} {y-s} {x+r} {y} Q{x+s} {y+s} {x} {y+r} '
        f'Q{x-s} {y+s} {x-r} {y} Q{x-s} {y-s} {x} {y-r}Z" fill="{color}" opacity="{opacity}"/>'
    )


def speed_lines(cx, cy, color="#ffffff", n=70, inner=380, outer=1400, seed=3):
    rnd = random.Random(seed)
    import math
    out = []
    for i in range(n):
        a = (i / n) * 2 * math.pi + rnd.uniform(-0.03, 0.03)
        r0 = inner + rnd.uniform(0, 160)
        w = rnd.uniform(0.004, 0.012)
        p1 = (cx + math.cos(a - w) * outer, cy + math.sin(a - w) * outer)
        p2 = (cx + math.cos(a + w) * outer, cy + math.sin(a + w) * outer)
        p0 = (cx + math.cos(a) * r0, cy + math.sin(a) * r0)
        out.append(
            f'<path d="M{p0[0]:.0f} {p0[1]:.0f} L{p1[0]:.0f} {p1[1]:.0f} L{p2[0]:.0f} {p2[1]:.0f}Z" '
            f'fill="{color}" opacity="{rnd.uniform(0.25, 0.6):.2f}"/>'
        )
    return "\n".join(out)


def stars(n, seed, y_max=600):
    rnd = random.Random(seed)
    return "\n".join(
        f'<circle cx="{rnd.randint(0, W)}" cy="{rnd.randint(0, y_max)}" r="{rnd.uniform(1, 3):.1f}" '
        f'fill="#fff" opacity="{rnd.uniform(0.3, 0.9):.2f}"/>'
        for _ in range(n)
    )


def skyline(base_y, color, seed, lit="#ffd36b", min_h=120, max_h=420, windows=True):
    rnd = random.Random(seed)
    out, x = [], -20
    while x < W:
        bw = rnd.randint(70, 170)
        bh = rnd.randint(min_h, max_h)
        out.append(f'<rect x="{x}" y="{base_y-bh}" width="{bw}" height="{bh+400}" fill="{color}"/>')
        if windows:
            for wy in range(base_y - bh + 20, base_y - 10, 34):
                for wx in range(x + 14, x + bw - 18, 26):
                    if rnd.random() < 0.28:
                        out.append(
                            f'<rect x="{wx}" y="{wy}" width="12" height="16" fill="{lit}" '
                            f'opacity="{rnd.uniform(0.5, 1):.2f}"/>'
                        )
        x += bw + rnd.randint(0, 18)
    return "\n".join(out)


def caption_bar(scene_no, stage, subtitle):
    """Scene label top-left and an anime-style subtitle at the bottom."""
    return f"""
<g font-family="'Segoe UI', 'Helvetica Neue', Arial, sans-serif">
  <rect x="48" y="44" width="{250 + len(stage) * 22}" height="54" rx="27" fill="#000" opacity="0.45"/>
  <text x="76" y="80" fill="#fff" font-size="26" font-weight="700" letter-spacing="3">SCENE {scene_no:02d} · {stage.upper()}</text>
  <text x="{W/2}" y="{H-70}" text-anchor="middle" font-size="44" font-weight="700" fill="#fff"
        stroke="#000" stroke-width="8" paint-order="stroke" stroke-linejoin="round">{subtitle}</text>
</g>"""


def svg(body, defs=""):
    return f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">
<defs>
  <radialGradient id="iris" cx="50%" cy="35%" r="70%">
    <stop offset="0" stop-color="#ffcf73"/><stop offset="0.55" stop-color="#c46a1c"/><stop offset="1" stop-color="#5a2a0c"/>
  </radialGradient>
  <linearGradient id="hairShine" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="{HAIR_HI}"/><stop offset="1" stop-color="{HAIR}"/>
  </linearGradient>
  <radialGradient id="glow" cx="50%" cy="50%" r="50%">
    <stop offset="0" stop-color="#fff" stop-opacity="0.9"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
  </radialGradient>
  <clipPath id="frame"><rect width="{W}" height="{H}"/></clipPath>
  {defs}
</defs>
<g clip-path="url(#frame)">
{body}
</g>
</svg>
"""


# ---------------------------------------------------------------- characters

def engineer(x, y, s=1.0, expr="smile", left="down", right="down", flip=False, legs=True, look=(0, 0)):
    """The engineer, front view. (x, y) is the centre of the head.

    expr: smile | determined | surprised | joy | calm
    arm poses: down | up | forward | wave | hold | type | book
    look: pupil offset in px, so he can glance at Bit.
    """
    lx, ly = look

    def arm(side, pose):
        sx = -70 * side if False else 70 * side
        sh = (sx, 128)
        poses = {
            "down": [(sx + 16 * side, 215), (sx + 12 * side, 295)],
            "up": [(sx + 42 * side, 40), (sx + 52 * side, -50)],
            "forward": [(sx + 30 * side, 210), (sx - 10 * side, 245)],
            "hold": [(sx + 34 * side, 200), (sx + 64 * side, 150)],
            "wave": [(sx + 70 * side, 70), (sx + 82 * side, -30)],
            "type": [(sx + 20 * side, 220), (sx - 18 * side, 240)],
            "book": [(sx + 20 * side, 220), (sx - 40 * side, 200)],
        }
        (ex, ey), (hx, hy) = poses[pose]
        out = (
            f'<path d="M{sh[0]} {sh[1]} Q{ex} {ey} {hx} {hy}" stroke="{TOP}" stroke-width="40" '
            f'fill="none" stroke-linecap="round"/>'
            f'<circle cx="{hx}" cy="{hy}" r="21" fill="{SKIN}"/>'
        )
        if pose == "wave":
            for i, dx in enumerate((-14, -5, 5, 14)):
                out += f'<rect x="{hx+dx-4}" y="{hy-44+abs(i-1.5)*5}" width="8" height="30" rx="4" fill="{SKIN}"/>'
        return out, (hx, hy)

    left_svg, lh = arm(-1, left)
    right_svg, rh = arm(1, right)

    eye_l = eye(-27, 8, lx, ly, expr)
    eye_r = eye(27, 8, lx, ly, expr)

    mouths = {
        "smile": f'<path d="M-14 50 Q0 62 14 50" stroke="#7a2e2e" stroke-width="4" fill="none" stroke-linecap="round"/>',
        "joy": f'<path d="M-18 46 Q0 76 18 46Z" fill="#7a2e2e"/><path d="M-10 60 Q0 70 10 60Z" fill="#ff7b84"/>',
        "surprised": f'<ellipse cx="0" cy="56" rx="9" ry="12" fill="#7a2e2e"/>',
        "determined": f'<path d="M-12 56 L12 52" stroke="#7a2e2e" stroke-width="4" stroke-linecap="round"/>',
        "calm": f'<path d="M-9 54 Q0 58 9 54" stroke="#7a2e2e" stroke-width="3.5" fill="none" stroke-linecap="round"/>',
    }
    brows = {
        "determined": '<path d="M-44 -22 L-12 -12" stroke="#1b1c27" stroke-width="6" stroke-linecap="round"/>'
                      '<path d="M44 -22 L12 -12" stroke="#1b1c27" stroke-width="6" stroke-linecap="round"/>',
        "surprised": '<path d="M-42 -32 Q-28 -40 -14 -32" stroke="#1b1c27" stroke-width="5" fill="none" stroke-linecap="round"/>'
                     '<path d="M42 -32 Q28 -40 14 -32" stroke="#1b1c27" stroke-width="5" fill="none" stroke-linecap="round"/>',
    }
    brow = brows.get(expr, '<path d="M-42 -22 Q-28 -28 -14 -22" stroke="#1b1c27" stroke-width="5" fill="none" stroke-linecap="round"/>'
                           '<path d="M42 -22 Q28 -28 14 -22" stroke="#1b1c27" stroke-width="5" fill="none" stroke-linecap="round"/>')

    leg_svg = ""
    if legs:
        leg_svg = f"""
  <path d="M-30 300 L-38 505" stroke="{TROUSERS}" stroke-width="46" stroke-linecap="round"/>
  <path d="M30 300 L38 505" stroke="{TROUSERS}" stroke-width="46" stroke-linecap="round"/>
  <ellipse cx="-44" cy="528" rx="40" ry="20" fill="#fff"/><rect x="-84" y="532" width="80" height="10" rx="5" fill="{ORANGE}"/>
  <ellipse cx="44" cy="528" rx="40" ry="20" fill="#fff"/><rect x="4" y="532" width="80" height="10" rx="5" fill="{ORANGE}"/>"""

    body = f"""
<g transform="translate({x} {y}) scale({-s if flip else s} {s})">
  <!-- back hair -->
  <path d="M-74 -10 Q-86 -96 0 -104 Q86 -96 74 -10 Q78 40 62 70 L-62 70 Q-78 40 -74 -10Z" fill="{HAIR}"/>
  {leg_svg}
  <!-- torso -->
  <path d="M-72 118 Q-80 112 -40 100 L40 100 Q80 112 72 118 L64 310 Q0 322 -64 310Z" fill="{TOP}"/>
  <rect x="-13" y="66" width="26" height="40" fill="{SKIN_SHADE}"/>
  <path d="M-18 100 L0 196 L18 100" stroke="{ORANGE}" stroke-width="7" fill="none"/>
  <rect x="-20" y="192" width="40" height="52" rx="6" fill="#fff"/><rect x="-20" y="192" width="40" height="14" rx="6" fill="{ORANGE}"/>
  <rect x="-12" y="214" width="24" height="4" fill="#bbb"/><rect x="-12" y="224" width="16" height="4" fill="#bbb"/>
  {left_svg}
  {right_svg}
  <!-- face -->
  <path d="M-62 -6 Q-62 48 -28 76 Q0 94 28 76 Q62 48 62 -6 Q62 -78 0 -78 Q-62 -78 -62 -6Z" fill="{SKIN}"/>
  <ellipse cx="-66" cy="14" rx="9" ry="16" fill="{SKIN_SHADE}"/><ellipse cx="66" cy="14" rx="9" ry="16" fill="{SKIN_SHADE}"/>
  <ellipse cx="-40" cy="40" rx="13" ry="7" fill="{BLUSH}" opacity="0.7"/>
  <ellipse cx="40" cy="40" rx="13" ry="7" fill="{BLUSH}" opacity="0.7"/>
  {eye_l}{eye_r}
  {brow}
  <path d="M-2 30 L2 36" stroke="{SKIN_SHADE}" stroke-width="3" stroke-linecap="round"/>
  {mouths[expr]}
  <!-- swept fringe -->
  <path d="M-70 -6 Q-80 -92 -6 -100 Q72 -104 74 -20 Q60 -48 44 -50 L50 -14 Q30 -44 14 -52 L8 -24 Q-6 -52 -24 -54
           L-30 -18 Q-40 -44 -52 -40 Q-62 -30 -70 -6Z" fill="url(#hairShine)"/>
  <path d="M-30 -84 Q0 -94 30 -86" stroke="#6b7399" stroke-width="5" fill="none" stroke-linecap="round" opacity="0.7"/>
</g>"""
    # hand positions in scene coordinates, so props can be attached
    m = -s if flip else s
    hands = {"left": (x + lh[0] * m, y + lh[1] * s), "right": (x + rh[0] * m, y + rh[1] * s)}
    return body, hands


def eye(cx, cy, lx, ly, expr):
    if expr == "joy":  # closed happy arcs
        return (f'<path d="M{cx-16} {cy+4} Q{cx} {cy-14} {cx+16} {cy+4}" stroke="#1b1c27" '
                f'stroke-width="6" fill="none" stroke-linecap="round"/>')
    if expr == "calm":  # half-lidded
        return (f'<path d="M{cx-17} {cy} Q{cx} {cy+16} {cx+17} {cy}Z" fill="#fff"/>'
                f'<ellipse cx="{cx+lx}" cy="{cy+6}" rx="10" ry="8" fill="url(#iris)"/>'
                f'<path d="M{cx-19} {cy} L{cx+19} {cy-2}" stroke="#1b1c27" stroke-width="6" stroke-linecap="round"/>')
    ry = 23 if expr == "surprised" else 20
    return f"""
<ellipse cx="{cx}" cy="{cy}" rx="16" ry="{ry}" fill="#fff"/>
<ellipse cx="{cx+lx}" cy="{cy+2+ly}" rx="12" ry="{ry-4}" fill="url(#iris)"/>
<ellipse cx="{cx+lx}" cy="{cy+4+ly}" rx="5.5" ry="{ry-11}" fill="#2b1206"/>
<circle cx="{cx+lx-4}" cy="{cy-6+ly}" r="5" fill="#fff"/>
<circle cx="{cx+lx+5}" cy="{cy+9+ly}" r="2.2" fill="#fff"/>
<path d="M{cx-19} {cy-ry+6} Q{cx} {cy-ry-6} {cx+20} {cy-ry+4} L{cx+22} {cy-ry+10}" stroke="#1b1c27" stroke-width="6" fill="none" stroke-linecap="round"/>"""


def bit(x, y, size=90, state="clean", expr="happy", look=(0, 0)):
    """Bit, the data packet. state: raw | clean | curated | served."""
    fills = {"raw": "#9aa0ab", "clean": "#5ab4ff", "curated": "#a68bff", "served": "#3ddc84"}
    shades = {"raw": "#767c88", "clean": "#2f8be0", "curated": "#7c5ce0", "served": "#22b866"}
    f, sh = fills[state], shades[state]
    r = size / 2
    lx, ly = look
    out = [f'<g transform="translate({x} {y})">']
    if state != "raw":
        out.append(f'<circle r="{size*1.1}" fill="url(#glow)" opacity="0.55"/>')
    out.append(f'<rect x="{-r}" y="{-r+6}" width="{size}" height="{size}" rx="{size*0.26}" fill="{sh}"/>')
    out.append(f'<rect x="{-r}" y="{-r}" width="{size}" height="{size}" rx="{size*0.26}" fill="{f}"/>')
    out.append(f'<rect x="{-r+size*0.12}" y="{-r+size*0.1}" width="{size*0.3}" height="{size*0.12}" rx="{size*0.06}" fill="#fff" opacity="0.5"/>')
    if state == "raw":
        rnd = random.Random(int(x + y))
        for _ in range(14):
            out.append(f'<rect x="{rnd.uniform(-r, r-8):.0f}" y="{rnd.uniform(-r, r-8):.0f}" width="{rnd.randint(4, 10)}" '
                       f'height="{rnd.randint(4, 10)}" fill="#4a4f5a" opacity="0.7"/>')
    ex = size * 0.18
    ey = -size * 0.02
    er = size * 0.11
    if expr == "joy":
        for sx in (-ex, ex):
            out.append(f'<path d="M{sx-er} {ey+er*0.4} Q{sx} {ey-er*1.2} {sx+er} {ey+er*0.4}" stroke="#14213d" '
                       f'stroke-width="{size*0.05}" fill="none" stroke-linecap="round"/>')
    else:
        for sx in (-ex, ex):
            out.append(f'<ellipse cx="{sx}" cy="{ey}" rx="{er}" ry="{er*1.3}" fill="#14213d"/>')
            out.append(f'<circle cx="{sx-er*0.35+lx}" cy="{ey-er*0.5+ly}" r="{er*0.42}" fill="#fff"/>')
    if expr == "worried":
        out.append(f'<path d="M{-size*0.1} {size*0.24} Q0 {size*0.18} {size*0.1} {size*0.24}" stroke="#14213d" '
                   f'stroke-width="{size*0.04}" fill="none" stroke-linecap="round"/>')
    else:
        out.append(f'<path d="M{-size*0.1} {size*0.18} Q0 {size*0.28} {size*0.1} {size*0.18}" stroke="#14213d" '
                   f'stroke-width="{size*0.04}" fill="none" stroke-linecap="round"/>')
    out.append(f'<ellipse cx="{-size*0.32}" cy="{size*0.14}" rx="{size*0.08}" ry="{size*0.045}" fill="{BLUSH}" opacity="0.8"/>')
    out.append(f'<ellipse cx="{size*0.32}" cy="{size*0.14}" rx="{size*0.08}" ry="{size*0.045}" fill="{BLUSH}" opacity="0.8"/>')
    if state == "served":
        out.append(f'<circle cx="{r*0.85}" cy="{-r*0.85}" r="{size*0.2}" fill="#fff"/>')
        out.append(f'<path d="M{r*0.85-size*0.09} {-r*0.85} l{size*0.06} {size*0.07} l{size*0.12} {-size*0.13}" '
                   f'stroke="#22b866" stroke-width="{size*0.05}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>')
    out.append("</g>")
    return "\n".join(out)


def speech(x, y, text, w=None, tail="left"):
    w = w or 40 + len(text) * 19
    tx = x + 40 if tail == "left" else x + w - 40
    return (f'<g font-family="\'Segoe UI\', Arial, sans-serif">'
            f'<rect x="{x}" y="{y}" width="{w}" height="70" rx="35" fill="#fff" stroke="#14213d" stroke-width="4"/>'
            f'<path d="M{tx-12} {y+66} L{tx-24 if tail == "left" else tx+24} {y+100} L{tx+14} {y+66}" fill="#fff" stroke="#14213d" stroke-width="4" stroke-linejoin="round"/>'
            f'<rect x="{tx-14}" y="{y+60}" width="30" height="8" fill="#fff"/>'
            f'<text x="{x + w/2}" y="{y+46}" text-anchor="middle" font-size="32" font-weight="700" fill="#14213d">{text}</text></g>')


# ---------------------------------------------------------------- scenes

def scene_01():
    """INGEST: rainy night, the engineer at his desk, Bit pops out of the laptop."""
    defs = """
<linearGradient id="night" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0b1030"/><stop offset="1" stop-color="#2b2457"/></linearGradient>
<linearGradient id="room" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#232445"/><stop offset="1" stop-color="#15162b"/></linearGradient>
<radialGradient id="screenGlow" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#7fd3ff" stop-opacity="0.7"/><stop offset="1" stop-color="#7fd3ff" stop-opacity="0"/></radialGradient>"""
    rnd = random.Random(1)
    rain = "\n".join(
        f'<line x1="{(x:=rnd.randint(280, 1640))}" y1="{(yy:=rnd.randint(110, 600))}" x2="{x-10}" y2="{yy+40}" '
        f'stroke="#9fb6ff" stroke-width="2" opacity="0.5"/>' for _ in range(120))
    eng, hands = engineer(760, 470, 1.0, expr="surprised", left="type", right="type", legs=False, look=(6, -4))
    code = "\n".join(
        f'<rect x="{1060 + rnd.randint(0, 20)}" y="{560 + i*22}" width="{rnd.randint(60, 200)}" height="8" rx="4" '
        f'fill="{rnd.choice(["#7fd3ff", "#ff8a3d", "#3ddc84", "#c3a6ff"])}" opacity="0.85"/>' for i in range(7))
    body = f"""
<rect width="{W}" height="{H}" fill="url(#room)"/>
<!-- window -->
<rect x="260" y="90" width="1400" height="540" rx="12" fill="url(#night)"/>
<g transform="translate(260 90) scale(0.73 0.6)">{stars(80, 7, 600)}</g>
<g transform="translate(260 0)"><g transform="scale(0.73 1)">{skyline(630, "#161a3a", 4, max_h=330)}</g></g>
<circle cx="1440" cy="210" r="60" fill="#fff6d8"/><circle cx="1470" cy="195" r="56" fill="#0f1438" opacity="0.9"/>
{rain}
<rect x="250" y="80" width="1420" height="560" rx="16" fill="none" stroke="#3a3c66" stroke-width="20"/>
<rect x="950" y="90" width="16" height="540" fill="#3a3c66"/>
<!-- desk lamp glow -->
<circle cx="1200" cy="640" r="520" fill="url(#screenGlow)" opacity="0.6"/>
{eng}
<!-- desk -->
<rect x="0" y="760" width="{W}" height="320" fill="#3b2f4a"/>
<rect x="0" y="760" width="{W}" height="22" fill="#54446a"/>
<!-- laptop -->
<path d="M1010 520 L1380 520 L1380 760 L1010 760Z" fill="#c7cbe0"/>
<rect x="1028" y="538" width="334" height="204" rx="6" fill="#0d1026"/>
{code}
<path d="M960 760 L1430 760 L1450 790 L940 790Z" fill="#a7abc4"/>
<!-- mug -->
<rect x="420" y="660" width="90" height="105" rx="14" fill="{ORANGE}"/>
<path d="M510 690 Q550 700 510 740" stroke="{ORANGE}" stroke-width="14" fill="none"/>
<path d="M445 640 Q430 610 450 580 M480 640 Q495 600 475 570" stroke="#fff" stroke-width="5" fill="none" opacity="0.5" stroke-linecap="round"/>
<!-- Bit emerging -->
<circle cx="1195" cy="470" r="200" fill="url(#screenGlow)"/>
{sparkle(1080, 400, 26)}{sparkle(1330, 430, 18)}{sparkle(1290, 340, 14, "#ffe27a")}
{bit(1195, 460, 120, "raw", "worried", look=(-4, 0))}
{speech(1300, 300, "...hello?", tail="left")}
{caption_bar(1, "ingest", "Midnight. A new record arrives… and it's looking right at him.")}"""
    return svg(body, defs)


def scene_02():
    """CLEANSE: magical scrub, noise flies off, Bit turns clean blue."""
    defs = """
<clipPath id="rawHalf"><rect x="980" y="270" width="200" height="420"/></clipPath>
<radialGradient id="bg2" cx="55%" cy="45%" r="80%"><stop offset="0" stop-color="#e9f6ff"/><stop offset="0.6" stop-color="#9fd4ff"/><stop offset="1" stop-color="#4b7bd6"/></radialGradient>"""
    rnd = random.Random(2)
    specks = "\n".join(
        f'<rect x="{rnd.randint(1100, 1700)}" y="{rnd.randint(150, 800)}" width="{(sz:=rnd.randint(8, 22))}" height="{sz}" '
        f'fill="#5a606c" opacity="{rnd.uniform(0.3, 0.8):.2f}" transform="rotate({rnd.randint(0, 90)} 1400 450)"/>'
        for _ in range(40))
    bubbles = "\n".join(
        f'<circle cx="{rnd.randint(850, 1500)}" cy="{rnd.randint(150, 900)}" r="{rnd.randint(10, 40)}" fill="#fff" '
        f'opacity="0.35" stroke="#fff" stroke-width="3"/>' for _ in range(28))
    eng, hands = engineer(620, 380, 1.15, expr="determined", left="down", right="hold", look=(8, 0))
    hx, hy = hands["right"]
    body = f"""
<rect width="{W}" height="{H}" fill="url(#bg2)"/>
{speed_lines(1180, 470, "#ffffff", seed=5)}
{bubbles}
{specks}
<!-- giant Bit: left half raw, right half clean -->
<g>
  {bit(1180, 470, 380, "clean", "joy")}
  <g clip-path="url(#rawHalf)">
    <rect x="990" y="280" width="380" height="380" rx="99" fill="#9aa0ab" opacity="0.85"/>
    {"".join(f'<rect x="{rnd.randint(1000, 1160)}" y="{rnd.randint(300, 640)}" width="{(q:=rnd.randint(8, 20))}" height="{q}" fill="#4a4f5a" opacity="0.8"/>' for _ in range(26))}
  </g>
  <path d="M1180 270 L1180 670" stroke="#fff" stroke-width="10" stroke-dasharray="4 18" stroke-linecap="round" opacity="0.9"/>
</g>
{eng}
<!-- sponge -->
<g transform="translate({hx} {hy}) rotate(-18)">
  <rect x="-10" y="-60" width="130" height="90" rx="22" fill="#ffd84a"/>
  <rect x="-10" y="-10" width="130" height="40" rx="14" fill="#3ddc84"/>
  <circle cx="30" cy="-30" r="7" fill="#e8b92e"/><circle cx="70" cy="-40" r="5" fill="#e8b92e"/><circle cx="90" cy="-20" r="6" fill="#e8b92e"/>
</g>
{sparkle(1380, 250, 50)}{sparkle(1450, 640, 34)}{sparkle(1080, 210, 26, "#fff7b0")}{sparkle(1560, 420, 22)}
{caption_bar(2, "cleanse", "\"Hold still! Nulls, duplicates, typos… all of it goes!\"")}"""
    return svg(body, defs)


def scene_03():
    """JOIN: two rivers of light-packets merge at a pipe junction; he tightens it."""
    defs = """
<linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d1147"/><stop offset="1" stop-color="#5b2a86"/></linearGradient>
<linearGradient id="pipe" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9d2e6"/><stop offset="0.5" stop-color="#8793ad"/><stop offset="1" stop-color="#5b6680"/></linearGradient>
<linearGradient id="pipeV" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#c9d2e6"/><stop offset="0.5" stop-color="#8793ad"/><stop offset="1" stop-color="#5b6680"/></linearGradient>"""
    rnd = random.Random(3)
    packets_a = "\n".join(bit(1180, y, 46, "clean", "happy") for y in (150, 260))
    packets_b = "\n".join(bit(1180, y, 46, "curated", "happy") for y in (800, 910))
    packets_out = "\n".join(bit(x, 540, 56, "curated" if i % 2 else "clean", "joy") for i, x in enumerate((1420, 1560, 1700, 1840)))
    eng, hands = engineer(760, 420, 1.0, expr="smile", left="down", right="hold", look=(10, 0))
    hx, hy = hands["right"]
    body = f"""
<rect width="{W}" height="{H}" fill="url(#bg3)"/>
{stars(160, 11, 1080)}
<!-- streams -->
<rect x="1130" y="0" width="100" height="480" fill="url(#pipeV)"/>
<rect x="1130" y="600" width="100" height="480" fill="url(#pipeV)"/>
<rect x="1180" y="490" width="760" height="100" fill="url(#pipe)"/>
<rect x="1130" y="0" width="100" height="480" fill="#7fd3ff" opacity="0.15"/>
<circle cx="1180" cy="540" r="120" fill="url(#pipeV)"/>
<circle cx="1180" cy="540" r="80" fill="#2a2f45"/>
<circle cx="1180" cy="540" r="60" fill="#3ddc84" opacity="0.6"/>
{''.join(f'<circle cx="{1180 + 98*__import__("math").cos(a*0.785)}" cy="{540 + 98*__import__("math").sin(a*0.785)}" r="10" fill="#5b6680"/>' for a in range(8))}
<circle cx="1180" cy="540" r="160" fill="url(#glow)" opacity="0.6"/>
{packets_a}{packets_b}{packets_out}
<text x="1110" y="70" fill="#9fd4ff" font-family="monospace" font-size="30" text-anchor="end">orders ▼</text>
<text x="1110" y="760" fill="#c3a6ff" font-family="monospace" font-size="30" text-anchor="end">customers ▲</text>
<text x="1880" y="460" fill="#3ddc84" font-family="monospace" font-size="30" text-anchor="end">ON customer_id ►</text>
{eng}
<!-- wrench -->
<g transform="translate({hx} {hy}) rotate(-40)">
  <rect x="0" y="-12" width="210" height="24" rx="12" fill="#d7dcea"/>
  <path d="M200 -40 Q260 -40 260 0 Q260 40 200 40 L215 14 L240 14 L240 -14 L215 -14Z" fill="#d7dcea"/>
</g>
{sparkle(1100, 420, 30, "#fff7b0")}{sparkle(1280, 660, 22)}
{caption_bar(3, "join", "Two streams. One key. Perfect fit.")}"""
    return svg(body, defs)


def scene_04():
    """BUILD: low-angle action shot, hammer overhead, blocks stacking, sparks."""
    defs = """
<linearGradient id="bg4" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ff6b3d"/><stop offset="0.6" stop-color="#ffb347"/><stop offset="1" stop-color="#ffe29a"/></linearGradient>"""
    blocks = [("API", "#5ab4ff", 1150, 300, 420), ("ETL", "#a68bff", 1110, 470, 500), ("DQ", "#3ddc84", 1070, 640, 580)]
    blk = "\n".join(
        f'<rect x="{bx}" y="{by+10}" width="{bw}" height="160" rx="18" fill="#000" opacity="0.18"/>'
        f'<rect x="{bx}" y="{by}" width="{bw}" height="160" rx="18" fill="{c}"/>'
        f'<rect x="{bx+20}" y="{by+16}" width="{bw*0.4}" height="18" rx="9" fill="#fff" opacity="0.4"/>'
        f'<text x="{bx+bw/2}" y="{by+108}" text-anchor="middle" font-family="Arial Black, Arial, sans-serif" font-size="80" '
        f'font-weight="900" fill="#fff">{t}</text>' for t, c, bx, by, bw in blocks)
    eng, hands = engineer(620, 310, 1.12, expr="determined", left="down", right="up", look=(8, -6))
    hx, hy = hands["right"]
    rnd = random.Random(4)
    sparks = "\n".join(sparkle(1370 + rnd.randint(-160, 160), 290 + rnd.randint(-80, 30), rnd.randint(10, 28), "#fff7b0") for _ in range(9))
    body = f"""
<rect width="{W}" height="{H}" fill="url(#bg4)"/>
{speed_lines(1360, 300, "#ffffff", seed=9, inner=200)}
<rect x="0" y="820" width="{W}" height="260" fill="#6b3a2a"/>
<path d="M0 820 L{W} 820" stroke="#3b1f16" stroke-width="10" stroke-dasharray="40 24"/>
{blk}
{bit(1360, 220, 110, "curated", "joy")}
{eng}
<!-- hammer -->
<g transform="translate({hx} {hy}) rotate(28)">
  <rect x="-12" y="-200" width="24" height="210" rx="10" fill="#8b5a3c"/>
  <rect x="-70" y="-250" width="140" height="70" rx="12" fill="#5b6680"/>
  <rect x="-70" y="-250" width="140" height="18" rx="9" fill="#c9d2e6"/>
</g>
{sparks}
<text x="1420" y="170" font-family="Arial Black, Arial, sans-serif" font-size="88" font-weight="900" fill="#fff"
      stroke="#ff3d3d" stroke-width="10" paint-order="stroke" transform="rotate(-10 1420 170)">KA-CHUNK!</text>
{caption_bar(4, "build", "\"Validation, transforms, an API on top. Now it can stand on its own!\"")}"""
    return svg(body, defs)


def scene_05():
    """INDEX: a library of floating skill cards, filing them into a glowing cabinet."""
    defs = """
<linearGradient id="bg5" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0f3b4a"/><stop offset="1" stop-color="#14695e"/></linearGradient>"""
    skills = ["Python", "SQL", "Spark", "Airflow", "dbt", "Kafka", "AWS", "Snowflake", "React", "Docker"]
    rnd = random.Random(5)
    cards = []
    for i, sk in enumerate(skills):
        cx = 1130 + (i % 4) * 205 + rnd.randint(-30, 30)
        cy = 140 + (i // 4) * 170 + rnd.randint(-20, 20)
        rot = rnd.randint(-14, 14)
        cards.append(
            f'<g transform="translate({cx} {cy}) rotate({rot})">'
            f'<rect x="-90" y="-50" width="180" height="100" rx="14" fill="#fff" opacity="0.95"/>'
            f'<rect x="-90" y="-50" width="180" height="22" rx="11" fill="{rnd.choice(["#5ab4ff", "#a68bff", "#3ddc84", ORANGE])}"/>'
            f'<text y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#14213d">{sk}</text></g>')
    shelves = "\n".join(
        f'<rect x="0" y="{y}" width="560" height="14" fill="#0a2a33"/>' +
        "".join(f'<rect x="{x}" y="{y-rnd.randint(70, 110)}" width="{rnd.randint(22, 34)}" height="110" fill="{rnd.choice(["#ff8a3d", "#5ab4ff", "#a68bff", "#ffd84a", "#3ddc84"])}" opacity="0.6"/>'
                for x in range(20, 540, 40))
        for y in (240, 440, 640))
    eng, hands = engineer(820, 420, 1.0, expr="smile", left="down", right="up", look=(6, -10))
    hx, hy = hands["right"]
    body = f"""
<rect width="{W}" height="{H}" fill="url(#bg5)"/>
{shelves}
{stars(90, 15, 1080)}
<!-- cabinet -->
<rect x="1180" y="600" width="520" height="420" rx="18" fill="#2a3b4f"/>
<rect x="1200" y="620" width="480" height="120" rx="12" fill="#3e5370"/>
<rect x="1200" y="760" width="480" height="120" rx="12" fill="#3e5370"/>
<rect x="1150" y="560" width="480" height="120" rx="12" fill="#56739a" transform="rotate(-4 1390 620)"/>
<rect x="1360" y="600" width="80" height="16" rx="8" fill="#c9d2e6" transform="rotate(-4 1390 620)"/>
<circle cx="1420" cy="600" r="220" fill="url(#glow)" opacity="0.5"/>
<rect x="1220" y="680" width="160" height="14" rx="7" fill="#fff" opacity="0.7"/><rect x="1220" y="820" width="160" height="14" rx="7" fill="#fff" opacity="0.7"/>
{"".join(cards)}
{eng}
<!-- card in hand -->
<g transform="translate({hx} {hy-40}) rotate(-8)">
  <rect x="-90" y="-50" width="180" height="100" rx="14" fill="#fff"/><rect x="-90" y="-50" width="180" height="22" rx="11" fill="{ORANGE}"/>
  <text y="28" text-anchor="middle" font-family="Arial, sans-serif" font-size="32" font-weight="700" fill="#14213d">PySpark</text>
</g>
{bit(1500, 500, 90, "curated", "happy", look=(-6, 0))}
{speech(1500, 380, "lineage: tracked!", tail="left")}
{sparkle(1180, 520, 22)}{sparkle(1640, 470, 18, "#fff7b0")}
{caption_bar(5, "index", "Every skill filed, every source traced.")}"""
    return svg(body, defs)


def scene_06():
    """ARCHIVE: sunset rooftop, he reads, graduation cap tassel in the wind, an idea bulb lights."""
    defs = """
<linearGradient id="bg6" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a2a6b"/><stop offset="0.45" stop-color="#d9608a"/><stop offset="0.75" stop-color="#ffb36b"/><stop offset="1" stop-color="#ffd9a0"/></linearGradient>
<radialGradient id="sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#fff4c2"/><stop offset="1" stop-color="#ffb36b" stop-opacity="0"/></radialGradient>"""
    rnd = random.Random(6)
    petals = "\n".join(
        f'<ellipse cx="{rnd.randint(0, W)}" cy="{rnd.randint(0, 900)}" rx="10" ry="6" fill="#ffc3d6" '
        f'transform="rotate({rnd.randint(0, 180)} {W/2} {H/2})" opacity="0.85"/>' for _ in range(45))
    eng, hands = engineer(820, 400, 1.05, expr="calm", left="book", right="book", look=(0, 4))
    body = f"""
<rect width="{W}" height="{H}" fill="url(#bg6)"/>
<circle cx="1350" cy="640" r="380" fill="url(#sun)"/>
<circle cx="1350" cy="640" r="150" fill="#fff1c9"/>
{skyline(820, "#5a3a6b", 21, lit="#ffe8a8", min_h=60, max_h=260)}
<!-- rooftop -->
<rect x="0" y="800" width="{W}" height="280" fill="#3b2a4a"/>
<rect x="0" y="800" width="{W}" height="16" fill="#5a4470"/>
{"".join(f'<rect x="{x}" y="700" width="10" height="100" fill="#2a1d36"/>' for x in range(0, W, 80))}
<rect x="0" y="700" width="{W}" height="10" fill="#2a1d36"/>
{eng}
<!-- graduation cap -->
<g transform="translate(822 296) rotate(-6)">
  <rect x="-48" y="-6" width="96" height="40" rx="8" fill="#14213d"/>
  <path d="M-110 -10 L0 -50 L110 -10 L0 30Z" fill="#1b2a52"/>
  <path d="M0 -10 Q60 0 92 36" stroke="#ffd84a" stroke-width="5" fill="none"/>
  <path d="M86 34 L98 34 L104 74 L80 74Z" fill="#ffd84a"/>
</g>
<!-- book -->
<g transform="translate(820 625)">
  <path d="M-110 -20 L0 0 L110 -20 L110 70 L0 90 L-110 70Z" fill="#fff"/>
  <path d="M0 0 L0 90" stroke="#ccc" stroke-width="4"/>
  <path d="M-110 70 L0 90 L110 70 L110 80 L0 100 L-110 80Z" fill="{ORANGE}"/>
  {"".join(f'<rect x="{-96 if i < 4 else 14}" y="{12 + (i % 4)*14}" width="{70 + (i*7) % 20}" height="5" fill="#9aa0ab"/>' for i in range(8))}
</g>
<!-- idea bulb -->
<circle cx="1030" cy="170" r="110" fill="url(#glow)"/>
<path d="M1030 110 a50 50 0 0 1 30 90 l0 20 l-60 0 l0 -20 a50 50 0 0 1 30 -90Z" fill="#fff38a"/>
<rect x="1002" y="222" width="56" height="22" rx="6" fill="#9aa0ab"/>
{"".join(f'<path d="M{1030 + 85*__import__("math").cos(a)} {165 + 85*__import__("math").sin(a)} L{1030 + 120*__import__("math").cos(a)} {165 + 120*__import__("math").sin(a)}" stroke="#fff38a" stroke-width="6" stroke-linecap="round"/>' for a in (3.14, 3.66, 4.19, 4.71, 5.24, 5.76, 0))}
{bit(560, 750, 80, "curated", "joy")}
{petals}
{caption_bar(6, "archive", "Everything learned is kept. Nothing is lost — only versioned.")}"""
    return svg(body, defs)


def scene_07():
    """SERVE: morning, Bit glows green with a tick; he waves at the camera."""
    defs = """
<linearGradient id="bg7" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7cc8ff"/><stop offset="0.7" stop-color="#d7f0ff"/><stop offset="1" stop-color="#f4fbff"/></linearGradient>"""
    rnd = random.Random(7)
    clouds = "\n".join(
        f'<g opacity="0.9" transform="translate({cx} {cy}) scale({sc})"><ellipse rx="120" ry="44" fill="#fff"/>'
        f'<ellipse cx="-60" cy="-20" rx="60" ry="46" fill="#fff"/><ellipse cx="40" cy="-34" rx="70" ry="56" fill="#fff"/></g>'
        for cx, cy, sc in ((300, 180, 1.2), (900, 120, 0.8), (1600, 220, 1.4), (1250, 330, 0.6)))
    confetti = "\n".join(
        f'<rect x="{rnd.randint(0, W)}" y="{rnd.randint(0, 760)}" width="14" height="24" rx="3" '
        f'fill="{rnd.choice(["#ff8a3d", "#5ab4ff", "#a68bff", "#3ddc84", "#ffd84a", "#ff7b9c"])}" '
        f'transform="rotate({rnd.randint(0, 180)} {W/2} 400)"/>' for _ in range(70))
    eng, hands = engineer(820, 330, 1.2, expr="joy", left="hold", right="wave")
    lx, ly = hands["left"]
    body = f"""
<rect width="{W}" height="{H}" fill="url(#bg7)"/>
{clouds}
<!-- hill -->
<ellipse cx="960" cy="1180" rx="1300" ry="420" fill="#7ed492"/>
<ellipse cx="400" cy="1120" rx="700" ry="300" fill="#62c47b"/>
{"".join(f'<circle cx="{rnd.randint(0, W)}" cy="{rnd.randint(860, 1060)}" r="7" fill="{rnd.choice(["#fff", "#ffd84a", "#ff9aa2"])}"/>' for _ in range(60))}
{confetti}
{eng}
<!-- tray -->
<ellipse cx="{lx-10}" cy="{ly-6}" rx="130" ry="22" fill="#c9d2e6"/>
<ellipse cx="{lx-10}" cy="{ly-12}" rx="130" ry="22" fill="#eef1f8"/>
{bit(lx-10, ly-110, 150, "served", "joy")}
{sparkle(lx-120, ly-200, 30)}{sparkle(lx+90, ly-230, 22, "#fff7b0")}{sparkle(lx+120, ly-120, 16)}
{speech(1220, 160, "Order up! Served fresh.", tail="left")}
{caption_bar(7, "serve", "\"Status: 200 OK. Ready when you are.\"")}"""
    return svg(body, defs)


def scene_08():
    """END CARD: title logo, both characters as chibi, credits."""
    defs = """
<linearGradient id="bg8" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#14213d"/><stop offset="1" stop-color="#3b2a6b"/></linearGradient>
<linearGradient id="titleGrad" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5ab4ff"/><stop offset="0.5" stop-color="#a68bff"/><stop offset="1" stop-color="#3ddc84"/></linearGradient>"""
    eng, _ = engineer(560, 520, 0.9, expr="joy", left="down", right="wave")
    body = f"""
<rect width="{W}" height="{H}" fill="url(#bg8)"/>
{stars(220, 31, 1080)}
{speed_lines(1200, 440, "#a68bff", seed=13, inner=420, n=50)}
{eng}
{bit(1560, 760, 120, "served", "joy")}
<g font-family="Arial Black, Arial, sans-serif" text-anchor="middle">
  <text x="1200" y="390" font-size="170" font-weight="900" fill="url(#titleGrad)" stroke="#fff" stroke-width="6" paint-order="stroke">BIT</text>
  <text x="1200" y="490" font-size="64" font-weight="900" fill="#fff" letter-spacing="10">THE PIPELINE</text>
  <text x="1200" y="560" font-size="30" fill="#c9d2e6" font-family="Arial, sans-serif" letter-spacing="4">ingest · cleanse · join · build · index · archive · serve</text>
  <text x="1200" y="680" font-size="34" fill="#ffd84a" font-family="Arial, sans-serif" font-weight="700">Story &amp; data engineering — Tharun Motipalli</text>
</g>
{sparkle(1460, 260, 34)}{sparkle(920, 300, 22, "#fff7b0")}{sparkle(1600, 600, 20)}
<text x="{W/2}" y="{H-60}" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#fff" opacity="0.8">To be continued… in the next deploy.</text>"""
    return svg(body, defs)


SCENES = [scene_01, scene_02, scene_03, scene_04, scene_05, scene_06, scene_07, scene_08]

if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    for i, fn in enumerate(SCENES, 1):
        path = OUT / f"scene-{i:02d}.svg"
        path.write_text(fn())
        print("wrote", path)
