# -*- coding: utf-8 -*-
"""Apply accent + euro fixes to all SDGN mission Python sources, then rebuild TS."""
from __future__ import annotations

import importlib.util
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENRICH = ROOT / "scripts/sdgn_enrich"
CHAP08 = importlib.util.spec_from_file_location(
    "fix_sdgn_chap08_accents",
    ROOT / "scripts/fix_sdgn_chap08_accents.py",
)
_mod = importlib.util.module_from_spec(CHAP08)
CHAP08.loader.exec_module(_mod)  # type: ignore[union-attr]
fix_text = _mod.fix_text

REVIEW = importlib.util.spec_from_file_location(
    "fix_french_encoding_review",
    ROOT / "scripts/fix_french_encoding_review.py",
)
_mod2 = importlib.util.module_from_spec(REVIEW)
REVIEW.loader.exec_module(_mod2)  # type: ignore[union-attr]
apply_accents = _mod2.apply_accents
EURO_BAD = _mod2.EURO_BAD


def fix_py(path: Path) -> bool:
    raw = path.read_text(encoding="utf-8")
    updated = EURO_BAD.sub("\u20ac", raw)
    updated = apply_accents(updated)
    updated = fix_text(updated)
    # typo fixes from partial replacements
    for old, new in [
        (" a a ", " a "),
        ("comme ca", "comme \u00e7a"),
        ("r\u00e9alis\u00e9r", "r\u00e9aliser"),
        ("formalis\u00e9r", "formaliser"),
        ("acc\u00e8ssible", "accessible"),
        ("pr\u00e9lev\u00e9 une", "pr\u00e9l\u00e8ve une"),
        ("s\u00e9curis\u00e9nt", "s\u00e9curisent"),
        ("r\u00e9alis\u00e9 38", "r\u00e9alise 38"),
        ("vi\u00e0 Internet", "via Internet"),
    ]:
        updated = updated.replace(old, new)
    if updated != raw:
        path.write_text(updated, encoding="utf-8")
        print("fixed", path.relative_to(ROOT))
        return True
    return False


def main() -> None:
    changed = False
    for p in sorted(ENRICH.glob("chap*.py")):
        if p.name == "build_ts.py":
            continue
        changed |= fix_py(p)
    ref = ROOT / "src/data/sdgn/chapterReferential.ts"
    if ref.exists():
        raw = ref.read_text(encoding="utf-8")
        updated = apply_accents(raw)
        if updated != raw:
            ref.write_text(updated, encoding="utf-8")
            print("fixed", ref.relative_to(ROOT))
            changed = True
    subprocess.run([sys.executable, str(ENRICH / "build_ts.py")], check=True)
    if not changed:
        print("sdgn sources already OK")


if __name__ == "__main__":
    main()
