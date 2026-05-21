# -*- coding: utf-8 -*-
from pathlib import Path
from collections import Counter

t = Path("src/data/sdgn/sdgnMissionQcmBank.ts").read_text(encoding="utf-8")
pairs = Counter()
for i, c in enumerate(t):
    if c == "\u251c" and i + 1 < len(t):
        pairs[t[i : i + 2]] += 1
for p, n in pairs.most_common(30):
    print(repr(p), n, "->", [hex(ord(x)) for x in p])
