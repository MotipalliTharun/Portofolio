"""Generates art/scene_ocean_drive.svg — the 4K (3840x2160) key frame for NEON COAST.

Hero rear-follow shot down Ocean Drive, Miami Beach at dusk, framed 2.39:1 inside
a 16:9 UHD canvas. Run: python3 src/gen_scene.py
"""
import math
import random
from pathlib import Path

W, H = 3840, 2160
BAR = 277                      # letterbox bar height for 2.39:1
VX, VY = 1920, 1060            # vanishing point
GROUND_Y = H - BAR             # bottom of picture area
random.seed(27)

out = []
o = out.append


def ground_y(x):
    """Sidewalk/building base line, rising toward the vanishing point."""
    return VY + abs(VX - x) / VX * 470


# ---------------------------------------------------------------- defs
o(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">')
o('''<defs>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#07041a"/>
    <stop offset="0.35" stop-color="#2a0b4f"/>
    <stop offset="0.65" stop-color="#8e1a6b"/>
    <stop offset="0.85" stop-color="#ff4f6d"/>
    <stop offset="1" stop-color="#ffb070"/>
  </linearGradient>
  <radialGradient id="sun" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#fff3c4"/>
    <stop offset="0.6" stop-color="#ffb35c"/>
    <stop offset="1" stop-color="#ff5e62"/>
  </radialGradient>
  <radialGradient id="sunGlow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0" stop-color="#ff9a5c" stop-opacity="0.75"/>
    <stop offset="1" stop-color="#ff3d7f" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="road" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#3a1a3d"/>
    <stop offset="0.25" stop-color="#1c0f24"/>
    <stop offset="1" stop-color="#0a070e"/>
  </linearGradient>
  <linearGradient id="walk" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#2b1433"/>
    <stop offset="1" stop-color="#120a17"/>
  </linearGradient>
  <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#19e6d0"/>
    <stop offset="0.5" stop-color="#19e6d0" stop-opacity="0"/>
    <stop offset="1" stop-color="#ff2e88"/>
  </linearGradient>
  <linearGradient id="ti" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#c9b9ff"/>
    <stop offset="0.5" stop-color="#6d6a8a"/>
    <stop offset="1" stop-color="#2c2b3a"/>
  </linearGradient>
  <radialGradient id="vignette" cx="0.5" cy="0.55" r="0.75">
    <stop offset="0.55" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity="0.75"/>
  </radialGradient>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="9" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="rival"><feColorMatrix type="hueRotate" values="185"/></filter>
  <filter id="bigGlow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="28"/>
  </filter>
  <filter id="blurX" x="-10%" y="-10%" width="120%" height="120%">
    <feGaussianBlur stdDeviation="14 2"/>
  </filter>
  <filter id="grain" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>
    <feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.09 0"/>
  </filter>
  <clipPath id="picture"><rect x="0" y="''' + str(BAR) + '''" width="3840" height="''' + str(H - 2 * BAR) + '''"/></clipPath>
  <clipPath id="aboveHorizon"><rect x="0" y="0" width="3840" height="''' + str(VY) + '''"/></clipPath>
''')

# ---- motorcycle seen from behind, origin = rear contact patch
o('''  <g id="bikeRear">
    <ellipse cx="0" cy="6" rx="330" ry="40" fill="#000" opacity="0.65"/>
    <path d="M-235 -700 L235 -700 L205 -560 L-205 -560 Z" fill="#0d0f14"/>
    <path d="M-235 -700 L-205 -560" stroke="#19e6d0" stroke-width="10" filter="url(#glow)"/>
    <path d="M235 -700 L205 -560" stroke="#ff2e88" stroke-width="10" filter="url(#glow)"/>
    <rect x="-72" y="-300" width="144" height="306" rx="62" fill="#08080a"/>
    <rect x="-72" y="-300" width="144" height="306" rx="62" fill="none" stroke="url(#rim)" stroke-width="8"/>
    <path d="M-95 -175 L-78 -150 L-160 -330 L-180 -318 Z" fill="#2b2f36"/>
    <path d="M95 -175 L78 -150 L160 -330 L180 -318 Z" fill="#2b2f36"/>
    <ellipse cx="-165" cy="-385" rx="55" ry="72" fill="url(#ti)"/>
    <ellipse cx="-165" cy="-385" rx="30" ry="42" fill="#111"/>
    <ellipse cx="165" cy="-385" rx="55" ry="72" fill="url(#ti)"/>
    <ellipse cx="165" cy="-385" rx="30" ry="42" fill="#111"/>
    <path d="M-140 -560 L-275 -470 L-165 -410" fill="none" stroke="#15171c" stroke-width="96" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M140 -560 L275 -470 L165 -410" fill="none" stroke="#15171c" stroke-width="96" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="-275" cy="-470" r="40" fill="#2a2d35" stroke="#19e6d0" stroke-width="5"/>
    <circle cx="275" cy="-470" r="40" fill="#2a2d35" stroke="#ff2e88" stroke-width="5"/>
    <path d="M-215 -440 L-110 -440 L-105 -330 L-225 -320 Z" fill="#0b0b0d"/>
    <path d="M215 -440 L110 -440 L105 -330 L225 -320 Z" fill="#0b0b0d"/>
    <path d="M-62 -505 L62 -505 L98 -430 L-98 -430 Z" fill="#0d0f14"/>
    <rect x="-85" y="-448" width="170" height="16" rx="8" fill="#ff1a3c" filter="url(#glow)"/>
    <rect x="-55" y="-420" width="110" height="58" rx="6" fill="#e9e4dc"/>
    <rect x="-55" y="-420" width="110" height="12" fill="#f28c28"/>
    <text x="0" y="-378" font-family="Arial Black, Arial, sans-serif" font-size="30" text-anchor="middle" fill="#1b4d8c">MRI 27</text>
    <ellipse cx="0" cy="-562" rx="155" ry="92" fill="#121418"/>
    <path d="M-150 -580 Q-205 -740 -212 -800 Q-150 -868 0 -876 Q150 -868 212 -800 Q205 -740 150 -580 Z" fill="#121418"/>
    <path d="M-150 -580 Q-205 -740 -212 -800 Q-150 -868 0 -876 Q150 -868 212 -800 Q205 -740 150 -580" fill="none" stroke="url(#rim)" stroke-width="12"/>
    <ellipse cx="0" cy="-835" rx="95" ry="48" fill="#1c1f26"/>
    <path d="M-14 -870 L14 -870 L15 -812 L-15 -812 Z" fill="#19e6d0" opacity="0.85"/>
    <path d="M-17 -680 L17 -680 L22 -600 L-22 -600 Z" fill="#19e6d0" opacity="0.85"/>
    <text x="0" y="-700" font-family="Arial Black, Arial, sans-serif" font-size="58" text-anchor="middle" fill="#ff2e88" letter-spacing="6">27</text>
    <text x="0" y="-770" font-family="Arial, sans-serif" font-weight="bold" font-size="34" text-anchor="middle" fill="#e8e8f0" letter-spacing="10">REYES</text>
    <path d="M-200 -800 L-300 -705 L-335 -645" fill="none" stroke="#121418" stroke-width="80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M200 -800 L300 -705 L335 -645" fill="none" stroke="#121418" stroke-width="80" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M-200 -800 L-300 -705" stroke="#19e6d0" stroke-width="8" opacity="0.7"/>
    <path d="M200 -800 L300 -705" stroke="#ff2e88" stroke-width="8" opacity="0.7"/>
    <circle cx="-338" cy="-640" r="42" fill="#0b0b0d"/>
    <circle cx="338" cy="-640" r="42" fill="#0b0b0d"/>
    <path d="M-300 -700 L-400 -750" stroke="#222" stroke-width="12"/>
    <path d="M300 -700 L400 -750" stroke="#222" stroke-width="12"/>
    <ellipse cx="-420" cy="-760" rx="62" ry="34" fill="#0d0f14" stroke="#19e6d0" stroke-width="5"/>
    <ellipse cx="420" cy="-760" rx="62" ry="34" fill="#0d0f14" stroke="#ff2e88" stroke-width="5"/>
    <ellipse cx="0" cy="-922" rx="118" ry="108" fill="#0d0f14"/>
    <ellipse cx="0" cy="-922" rx="118" ry="108" fill="none" stroke="url(#rim)" stroke-width="12"/>
    <path d="M-10 -1030 L10 -1030 L16 -816 L-16 -816 Z" fill="#19e6d0"/>
    <path d="M-60 -1010 Q0 -1040 60 -1010" fill="none" stroke="#ff2e88" stroke-width="10"/>
  </g>
</defs>''')

# ---------------------------------------------------------------- sky
o('<g clip-path="url(#picture)">')
o(f'<rect width="{W}" height="{VY + 40}" fill="url(#sky)"/>')
for _ in range(90):  # first stars
    x, y = random.uniform(0, W), random.uniform(BAR, 600)
    o(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{random.uniform(1.5, 3.5):.1f}" fill="#fff" opacity="{random.uniform(0.2, 0.8):.2f}"/>')
o(f'<circle cx="{VX}" cy="{VY}" r="900" fill="url(#sunGlow)"/>')
o('<g clip-path="url(#aboveHorizon)">')
o(f'<circle cx="{VX}" cy="{VY}" r="330" fill="url(#sun)"/>')
for i in range(7):  # heat-shimmer bands across the sun
    y = VY - 40 - i * 46
    o(f'<rect x="{VX - 340}" y="{y}" width="680" height="{14 - i * 1.6:.1f}" fill="#ff4f6d" opacity="0.85"/>')
o('</g>')
# distant causeway skyline
x = 1250
while x < 2600:
    w = random.randint(30, 80)
    h = random.randint(30, 170) if abs(x - VX) > 250 else random.randint(10, 60)
    o(f'<rect x="{x}" y="{VY - h}" width="{w}" height="{h}" fill="#3b1240" opacity="0.9"/>')
    x += w + random.randint(0, 12)

# ---------------------------------------------------------------- ground
o(f'<path d="M0 {ground_y(0):.0f} L{VX} {VY} L{W} {ground_y(W):.0f} L{W} {H} L0 {H} Z" fill="url(#walk)"/>')
o(f'<path d="M160 {H} L{VX - 30} {VY} L{VX + 30} {VY} L{W - 160} {H} Z" fill="url(#road)"/>')
# curbs
o(f'<path d="M160 {H} L{VX - 30} {VY}" stroke="#ffcf5c" stroke-width="10" opacity="0.6"/>')
o(f'<path d="M{W - 160} {H} L{VX + 30} {VY}" stroke="#ffcf5c" stroke-width="10" opacity="0.6"/>')

# ---------------------------------------------------------------- art-deco buildings
NEON = ["#19e6d0", "#ff2e88", "#ffd23f", "#8a5cff", "#ff6b3d"]
SIGNS = ["HOTEL", "CAFE", "OCEAN", "DECO", "BAR", "SURF", "MOTEL", "VICE"]


def building(x0, x1, top, side):
    base0, base1 = ground_y(x0), ground_y(x1)
    col = random.choice(["#2a1238", "#341542", "#1f0f2e", "#3d1a4a"])
    neon = random.choice(NEON)
    o(f'<path d="M{x0} {base0:.0f} L{x0} {top} L{x1} {top} L{x1} {base1:.0f} Z" fill="{col}"/>')
    # stepped deco crown
    w = x1 - x0
    o(f'<rect x="{x0 + w * 0.3:.0f}" y="{top - w * 0.12:.0f}" width="{w * 0.4:.0f}" height="{w * 0.12:.0f}" fill="{col}"/>')
    o(f'<rect x="{x0 + w * 0.42:.0f}" y="{top - w * 0.2:.0f}" width="{w * 0.16:.0f}" height="{w * 0.08:.0f}" fill="{col}"/>')
    # neon trim
    o(f'<path d="M{x0} {top + 18} L{x1} {top + 18}" stroke="{neon}" stroke-width="{max(3, w / 60):.0f}" filter="url(#glow)"/>')
    o(f'<path d="M{x0 + w * 0.5:.0f} {top - w * 0.2:.0f} L{x0 + w * 0.5:.0f} {min(base0, base1) - 20:.0f}" stroke="{neon}" stroke-width="{max(2, w / 90):.0f}" opacity="0.8" filter="url(#glow)"/>')
    # windows
    rows = int((min(base0, base1) - top - 80) / (w * 0.14 + 10))
    for r in range(max(rows, 0)):
        for c in range(4):
            if random.random() < 0.35:
                continue
            wx = x0 + w * (0.08 + c * 0.23)
            wy = top + 60 + r * (w * 0.14 + 10)
            lit = random.random() < 0.45
            fill = random.choice(["#ffd9a0", "#ffe9c7", "#9ff5ff"]) if lit else "#170a20"
            o(f'<rect x="{wx:.0f}" y="{wy:.0f}" width="{w * 0.14:.0f}" height="{w * 0.09:.0f}" fill="{fill}" opacity="{0.9 if lit else 1}"/>')
    # vertical sign
    if w > 140 and random.random() < 0.8:
        word = random.choice(SIGNS)
        sx = x1 - w * 0.12 if side == "L" else x0 + w * 0.12
        fs = w * 0.11
        for i, ch in enumerate(word):
            o(f'<text x="{sx:.0f}" y="{top + 120 + i * fs * 1.05:.0f}" font-family="Arial Black, Arial, sans-serif" font-size="{fs:.0f}" text-anchor="middle" fill="{neon}" filter="url(#glow)">{ch}</text>')
    # reflection on wet road
    rx = x1 if side == "L" else x0
    o(f'<rect x="{rx - w * 0.15:.0f}" y="{max(base0, base1):.0f}" width="{w * 0.3:.0f}" height="{w * 1.1:.0f}" fill="{neon}" opacity="0.10" filter="url(#bigGlow)"/>')


left = [(0, 470, 300), (470, 830, 470), (830, 1120, 640), (1120, 1350, 760), (1350, 1520, 860), (1520, 1650, 930), (1650, 1750, 975), (1750, 1820, 1005)]
for x0, x1, top in left:
    building(x0, x1, top, "L")
for x0, x1, top in left:
    building(W - x1, W - x0, top, "R")


# ---------------------------------------------------------------- palms
def palm(x, base, h, lean):
    s = h / 1000
    tx, ty = x + lean * s * 260, base - h
    o(f'<path d="M{x - 18 * s:.0f} {base:.0f} Q{x + lean * 60 * s:.0f} {base - h * 0.5:.0f} {tx:.0f} {ty:.0f} L{tx + 10 * s:.0f} {ty:.0f} Q{x + lean * 90 * s:.0f} {base - h * 0.5:.0f} {x + 18 * s:.0f} {base:.0f} Z" fill="#100614"/>')
    for a in range(0, 360, 36):
        ang = math.radians(a + random.uniform(-10, 10))
        L = random.uniform(260, 380) * s
        ex, ey = tx + math.cos(ang) * L, ty + math.sin(ang) * L * 0.55 + L * 0.35
        cx, cy = tx + math.cos(ang) * L * 0.5, ty - 60 * s
        o(f'<path d="M{tx:.0f} {ty:.0f} Q{cx:.0f} {cy:.0f} {ex:.0f} {ey:.0f}" fill="none" stroke="#100614" stroke-width="{26 * s:.1f}" stroke-linecap="round"/>')
        o(f'<path d="M{tx:.0f} {ty:.0f} Q{cx:.0f} {cy:.0f} {ex:.0f} {ey:.0f}" fill="none" stroke="#100614" stroke-width="{70 * s:.1f}" stroke-dasharray="{4 * s:.1f} {14 * s:.1f}" opacity="0.6"/>')


for x in (260, 760, 1150, 1440, 1630):
    base = ground_y(x) + 30
    h = (base - VY) * 2.6
    palm(x, base, h, -0.4)
    palm(W - x, base, h, 0.4)

# ---------------------------------------------------------------- road markings (perspective)
for i in range(1, 26):
    z0, z1 = i * 1.0, i * 1.0 + 0.45
    y0, y1 = VY + 900 / z1, VY + 900 / z0
    if y1 > H:
        continue
    w0, w1 = 46 / z1, 46 / z0
    o(f'<path d="M{VX - w0:.1f} {y0:.1f} L{VX + w0:.1f} {y0:.1f} L{VX + w1:.1f} {y1:.1f} L{VX - w1:.1f} {y1:.1f} Z" fill="#f4e9c8" opacity="0.85"/>')

# light trails (traffic in long exposure)
for k, (col, off) in enumerate([("#ff2340", 260), ("#ff2340", 330), ("#fff1d6", 520), ("#ffd27a", 600)]):
    o(f'<path d="M{VX - 40} {VY + 4} Q{VX - off} {VY + 300} {420 - k * 60} {H}" fill="none" stroke="{col}" stroke-width="{8 + k * 3}" opacity="0.75" filter="url(#glow)"/>')
    o(f'<path d="M{VX + 40} {VY + 4} Q{VX + off} {VY + 300} {W - 420 + k * 60} {H}" fill="none" stroke="{col}" stroke-width="{8 + k * 3}" opacity="0.6" filter="url(#glow)"/>')

# road sheen from the sun
o(f'<path d="M{VX - 120} {VY} L{VX + 120} {VY} L{VX + 700} {H} L{VX - 700} {H} Z" fill="#ff8a5c" opacity="0.12" filter="url(#bigGlow)"/>')

# ---------------------------------------------------------------- bikes
# rival (Dax, red Ducati-style) far ahead, tail light only reads
o(f'<g transform="translate(2210 1235) scale(0.16)" opacity="0.92" filter="url(#rival)"><use href="#bikeRear"/></g>')
o('<circle cx="2210" cy="1165" r="22" fill="#ff1a3c" opacity="0.6" filter="url(#bigGlow)"/>')
# speed streaks
for _ in range(70):
    side = random.choice([-1, 1])
    x = VX + side * random.uniform(500, 1900)
    y = random.uniform(1300, GROUND_Y)
    ang = math.atan2(y - VY, x - VX)
    L = random.uniform(120, 420)
    o(f'<path d="M{x:.0f} {y:.0f} L{x + math.cos(ang) * L:.0f} {y + math.sin(ang) * L:.0f}" stroke="#fff" stroke-width="{random.uniform(2, 6):.1f}" opacity="{random.uniform(0.05, 0.22):.2f}"/>')
# hero
o('<ellipse cx="1920" cy="1600" rx="400" ry="80" fill="#ff1a3c" opacity="0.25" filter="url(#bigGlow)"/>')
o('<g transform="translate(1920 1860) scale(0.7)"><use href="#bikeRear"/></g>')

# grade
o(f'<rect width="{W}" height="{H}" fill="url(#vignette)"/>')
o(f'<rect width="{W}" height="{H}" filter="url(#grain)"/>')
o('</g>')

# ---------------------------------------------------------------- letterbox + slate
o(f'<rect width="{W}" height="{BAR}" fill="#000"/><rect y="{H - BAR}" width="{W}" height="{BAR}" fill="#000"/>')
o(f'<text x="140" y="{H - BAR + 150}" font-family="Arial, sans-serif" font-size="56" letter-spacing="22" fill="#e8e8f0">NEON COAST</text>')
o(f'<text x="{W - 140}" y="{H - BAR + 150}" font-family="Arial, sans-serif" font-size="40" letter-spacing="8" text-anchor="end" fill="#8b8aa3">SC. 7 · EXT. OCEAN DRIVE, MIAMI BEACH, FL · DUSK · 3840×2160 · 2.39:1</text>')
o('</svg>')

Path(__file__).resolve().parent.parent.joinpath("art", "scene_ocean_drive.svg").write_text("\n".join(out))
print("wrote scene_ocean_drive.svg")
