# -*- coding: utf-8 -*-
"""Add notions[] to sdgn_enrich chapter modules from attendu heuristics."""
import importlib
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from mission_enrich_common import notions_from_attendu  # noqa: E402

ENRICH = ROOT / "scripts/sdgn_enrich"


def patch_file(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    if '"notions"' in text:
        return

    def repl(m):
        attendu = m.group(1)
        notions = notions_from_attendu(attendu)
        if not notions:
            return m.group(0)
        items = ", ".join(f'"{n}"' for n in notions)
        return f'{m.group(0)}\n        "notions": [{items}],'

    new_text = re.sub(
        r'"attendu": "((?:\\.|[^"\\])*)",',
        repl,
        text,
    )
    if new_text != text:
        path.write_text(new_text, encoding="utf-8")
        print("patched", path.name)


def main():
    for path in sorted(ENRICH.glob("chap*.py")):
        if path.name == "build_ts.py":
            continue
        patch_file(path)


if __name__ == "__main__":
    main()
