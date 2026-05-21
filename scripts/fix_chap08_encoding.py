# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(__file__).resolve().parent / "sdgn_enrich/chap08.py"
t = p.read_bytes().decode("latin-1")
replacements = {
    "\x97": "-",
    "\x96": "-",
    "\x91": "'",
    "\x92": "'",
    "\x93": '"',
    "\x94": '"',
    "": "e",
    "": "e",
    "": "a",
    "": "u",
    "": "o",
    "": "i",
    "": "E",
    "": "A",
    "": "EUR",
}
for old, new in replacements.items():
    if old:
        t = t.replace(old, new)
p.write_text(t, encoding="utf-8")
print("fixed", p)
