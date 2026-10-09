"""Generates the two rider character sheets for NEON COAST (3840x2160 each).

Run: python3 src/gen_characters.py
"""
from pathlib import Path

ART = Path(__file__).resolve().parent.parent / "art"

CHARACTERS = [
    dict(
        file="character_mari_reyes.svg",
        role="LEAD RIDER",
        name="MARISOL “MARI” REYES",
        tagline="27 · Little Havana · ex-WERA club racer turned night courier",
        number="27", a="#19e6d0", b="#ff2e88", skin="#b67a52", hair="#120c0a",
        hair_path="M1815 470 Q1820 330 1935 335 Q2040 340 2035 470 Q2010 400 1930 405 Q1860 405 1815 470 Z"
                  " M2020 420 Q2110 470 2080 640 Q2060 560 2010 500 Z",
        notes=[
            ("Leathers", "One-piece, Midnight Ink, teal spine + magenta flank"),
            ("Helmet", "Carbon, iridium visor — reflects the neon city"),
            ("Tell", "Taps the tank twice before every launch"),
            ("Want", "Win the Causeway run to buy back her father's shop"),
            ("Voice", "Few words. English &amp; Spanish. Dry humour."),
        ],
    ),
    dict(
        file="character_dax_holloway.svg",
        role="RIVAL",
        name="DAX HOLLOWAY",
        tagline="34 · Palm Beach money · owns the underground Causeway Run",
        number="01", a="#ff3b3b", b="#ffd23f", skin="#e2b48f", hair="#c9a46a",
        hair_path="M1818 455 Q1830 345 1930 340 Q2030 345 2040 455 Q2000 395 1930 392 Q1860 395 1818 455 Z",
        notes=[
            ("Bike", "Red Italian-style V4, “CORSA ROSSA”, plate DAX 01"),
            ("Leathers", "Black, blood-red chevron, gold piping, never scuffed"),
            ("Helmet", "Black carbon, red ring, gold mirror visor"),
            ("Want", "Stay undefeated — and own Mari's skill"),
            ("Voice", "Smiling, polite, always a threat underneath"),
        ],
    ),
]

TEMPLATE = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3840 2160" width="3840" height="2160">
<defs>
  <radialGradient id="bg" cx="0.5" cy="0.5" r="0.8">
    <stop offset="0" stop-color="#2a1238"/><stop offset="0.6" stop-color="#120a1c"/><stop offset="1" stop-color="#05030a"/>
  </radialGradient>
  <pattern id="grid" width="120" height="120" patternUnits="userSpaceOnUse">
    <path d="M120 0 L0 0 0 120" fill="none" stroke="#fff" stroke-opacity="0.04" stroke-width="2"/>
  </pattern>
  <linearGradient id="leather" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#08090c"/><stop offset="0.45" stop-color="#22252e"/><stop offset="1" stop-color="#0a0b0f"/>
  </linearGradient>
  <linearGradient id="visor" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="{a}"/><stop offset="0.5" stop-color="#2a0b4f"/><stop offset="1" stop-color="{b}"/>
  </linearGradient>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
    <feGaussianBlur stdDeviation="7" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="soft"><feGaussianBlur stdDeviation="30"/></filter>
</defs>
<rect width="3840" height="2160" fill="url(#bg)"/>
<rect width="3840" height="2160" fill="url(#grid)"/>
<circle cx="1920" cy="1100" r="820" fill="{b}" opacity="0.08" filter="url(#soft)"/>

<text x="160" y="230" font-family="Arial, sans-serif" font-size="44" letter-spacing="18" fill="{a}">NEON COAST · {role}</text>
<text x="160" y="350" font-family="Arial Black, Arial, sans-serif" font-size="110" fill="#f4f1ff">{name}</text>
<text x="160" y="420" font-family="Arial, sans-serif" font-size="40" fill="#8b8aa3">{tagline}</text>

<ellipse cx="1920" cy="1975" rx="420" ry="45" fill="#000" opacity="0.7" filter="url(#soft)"/>

<!-- legs -->
<path d="M1755 1170 L1915 1170 L1895 1870 L1775 1870 Z" fill="url(#leather)"/>
<path d="M1925 1170 L2085 1170 L2065 1870 L1945 1870 Z" fill="url(#leather)"/>
<path d="M1760 1200 L1780 1860" stroke="{b}" stroke-width="16" filter="url(#glow)"/>
<path d="M2080 1200 L2060 1860" stroke="{b}" stroke-width="16" filter="url(#glow)"/>
<rect x="1785" y="1480" width="95" height="120" rx="30" fill="#2c2f38" stroke="{a}" stroke-width="6"/>
<rect x="1960" y="1480" width="95" height="120" rx="30" fill="#2c2f38" stroke="{a}" stroke-width="6"/>
<!-- boots -->
<path d="M1760 1820 L1905 1820 L1915 1960 L1730 1960 Q1730 1900 1760 1820 Z" fill="#0b0b0d"/>
<path d="M1935 1820 L2080 1820 Q2110 1900 2110 1960 L1925 1960 Z" fill="#0b0b0d"/>
<path d="M1735 1930 L1915 1930 M1925 1930 L2105 1930" stroke="{a}" stroke-width="10"/>

<!-- torso -->
<path d="M1690 765 Q1700 722 1765 710 L2075 710 Q2140 722 2150 765 L2095 1185 L1745 1185 Z" fill="url(#leather)"/>
<path d="M1920 712 L1920 1180" stroke="#3a3e4a" stroke-width="8"/>
<path d="M1700 790 L1920 940 L2140 790" fill="none" stroke="{a}" stroke-width="26" filter="url(#glow)"/>
<path d="M1745 1150 L2095 1150" stroke="{b}" stroke-width="14"/>
<text x="2020" y="1060" font-family="Arial Black, Arial, sans-serif" font-size="96" text-anchor="middle" fill="{b}">{number}</text>
<rect x="1772" y="1000" width="110" height="42" rx="6" fill="#e8e8f0"/>
<rect x="1772" y="1000" width="110" height="14" fill="{a}"/>
<!-- collar -->
<path d="M1850 660 L1990 660 L2000 725 L1840 725 Z" fill="#14161c" stroke="{a}" stroke-width="6"/>

<!-- right arm (viewer left), hanging -->
<path d="M1700 770 Q1620 800 1625 960 L1620 1270 L1715 1275 L1735 960 Z" fill="url(#leather)"/>
<path d="M1655 790 Q1625 900 1630 1260" stroke="{a}" stroke-width="10" fill="none" opacity="0.8"/>
<path d="M1612 1260 L1722 1262 L1730 1360 Q1670 1400 1612 1360 Z" fill="#0b0b0d"/>
<path d="M1620 1300 L1722 1300" stroke="{b}" stroke-width="8"/>

<!-- left arm (viewer right), bent, holding helmet at the hip -->
<path d="M2140 770 Q2230 800 2235 960 L2250 1060 L2150 1080 L2120 960 Z" fill="url(#leather)"/>
<path d="M2150 1080 L2250 1060 L2300 1140 L2200 1170 Z" fill="url(#leather)"/>

<!-- helmet -->
<g transform="translate(2330 1170)">
  <circle r="165" fill="#0d0f14"/>
  <circle r="165" fill="none" stroke="{a}" stroke-width="8"/>
  <path d="M-150 -20 Q-130 -110 0 -115 Q130 -110 150 -20 Q120 40 0 42 Q-120 40 -150 -20 Z" fill="url(#visor)"/>
  <path d="M-110 -70 Q-40 -105 40 -95" stroke="#fff" stroke-opacity="0.6" stroke-width="10" fill="none"/>
  <path d="M-12 -165 L12 -165 L16 -115 L-16 -115 Z" fill="{a}"/>
  <path d="M-150 60 Q0 150 150 60" fill="none" stroke="{b}" stroke-width="12"/>
  <text y="120" font-family="Arial Black, Arial, sans-serif" font-size="56" text-anchor="middle" fill="#e8e8f0">{number}</text>
</g>
<path d="M2190 1170 L2250 1220 L2210 1260 L2160 1200 Z" fill="#0b0b0d"/>

<!-- neck + head -->
<rect x="1882" y="610" width="76" height="70" fill="{skin}"/>
<path d="M1882 650 Q1920 680 1958 650" fill="none" stroke="#000" stroke-opacity="0.2" stroke-width="10"/>
<ellipse cx="1925" cy="520" rx="108" ry="132" fill="{skin}"/>
<ellipse cx="1820" cy="530" rx="18" ry="30" fill="{skin}"/>
<ellipse cx="2030" cy="530" rx="18" ry="30" fill="{skin}"/>
<path d="{hair_path}" fill="{hair}"/>
<path d="M1865 492 L1905 486 M1948 486 L1988 492" stroke="{hair}" stroke-width="10" stroke-linecap="round"/>
<ellipse cx="1885" cy="525" rx="14" ry="9" fill="#1a1010"/>
<ellipse cx="1968" cy="525" rx="14" ry="9" fill="#1a1010"/>
<circle cx="1889" cy="522" r="3" fill="#fff"/><circle cx="1972" cy="522" r="3" fill="#fff"/>
<path d="M1925 540 L1915 585 L1932 588" fill="none" stroke="#000" stroke-opacity="0.25" stroke-width="6"/>
<path d="M1893 615 Q1925 628 1960 612" fill="none" stroke="#5a2a20" stroke-width="8" stroke-linecap="round"/>

<!-- callouts -->
<g stroke="#8b8aa3" stroke-width="3" fill="none">
  <path d="M2330 1010 L2600 760 L2780 760"/>
  <path d="M1920 870 L1500 760 L1320 760"/>
  <path d="M1830 1540 L1500 1540 L1320 1540"/>
</g>
<g font-family="Arial, sans-serif" font-size="36" fill="#e8e8f0">
  <text x="2800" y="772">Iridium visor · #{number}</text>
  <text x="1300" y="772" text-anchor="end">Chevron chest trim</text>
  <text x="1300" y="1552" text-anchor="end">Knee sliders, worn to the base</text>
</g>

<!-- notes card -->
<g transform="translate(2740 1000)">
  <rect width="960" height="660" rx="18" fill="#0b0712" stroke="#2a2340" stroke-width="3"/>
  {notes}
</g>
<!-- palette -->
<g transform="translate(160 1720)" font-family="Arial, sans-serif" font-size="30" fill="#8b8aa3">
  <rect width="110" height="110" rx="10" fill="#121418" stroke="#333" stroke-width="2"/><text y="150">Leather</text>
  <rect x="150" width="110" height="110" rx="10" fill="{a}"/><text x="150" y="150">Primary</text>
  <rect x="300" width="110" height="110" rx="10" fill="{b}"/><text x="300" y="150">Accent</text>
  <rect x="450" width="110" height="110" rx="10" fill="{skin}"/><text x="450" y="150">Skin</text>
</g>
<text x="160" y="2070" font-family="Arial, sans-serif" font-size="32" letter-spacing="8" fill="#5d5a75">FICTIONAL CHARACTER · FRONT TURNAROUND · 3840×2160</text>
</svg>
"""

for c in CHARACTERS:
    rows = []
    for i, (k, v) in enumerate(c["notes"]):
        y = 100 + i * 120
        rows.append(f'<text x="44" y="{y}" font-family="Arial, sans-serif" font-size="30" letter-spacing="6" fill="{c["a"]}">{k.upper()}</text>')
        rows.append(f'<text x="44" y="{y + 48}" font-family="Arial, sans-serif" font-size="34" fill="#e8e8f0">{v}</text>')
    fields = {k: v for k, v in c.items() if k not in ("file", "notes")}
    svg = TEMPLATE.format(notes="\n  ".join(rows), **fields)
    (ART / c["file"]).write_text(svg)
    print("wrote", c["file"])
