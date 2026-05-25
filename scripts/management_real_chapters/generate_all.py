# -*- coding: utf-8 -*-
"""Generate management_real_chapters/chXX_data.py from embedded specs."""
from __future__ import annotations

import importlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from management_real_orgs import REAL_ORGS_BY_CHAPTER  # noqa: E402

OUT = Path(__file__).resolve().parent


def j(s: str) -> str:
    return json.dumps(s, ensure_ascii=True)


def write_ch(ch: int, specs: list[dict]) -> None:
    orgs = REAL_ORGS_BY_CHAPTER[ch]
    if len(specs) != 12:
        raise ValueError(f"ch{ch}: need 12 specs, got {len(specs)}")
    lines = [
        "# -*- coding: utf-8 -*-",
        f'"""Management chapitre {ch} \u2014 acteurs reels, un concept par exercice."""',
        "",
        "D = \"\\u2014 \"",
        "",
        "",
        "def I(sid, title, **body):",
        "    return {\"sid\": sid, \"title\": title, \"body\": body}",
        "",
        "",
        f"CH{ch} = [",
    ]
    sids = [f"e{i}" for i in range(1, 11)] + ["cas1", "cas2"]
    for sid, org, spec in zip(sids, orgs, specs):
        def fmt(s: str) -> str:
            return s.replace("{org}", org)

        title = fmt(spec["title"])
        support = fmt(spec["support"])
        consigne = fmt(spec["consigne"])
        correction = fmt(spec["correction"])
        attendu = fmt(spec["attendu"])
        qs = [fmt(q) for q in spec["questions"]]
        notions = spec.get("notions", [])
        lines.append("    I(")
        lines.append(f"        {j(sid)},")
        lines.append(f"        {j(title)},")
        lines.append(f"        support={j(support)},")
        lines.append(f"        consigne={j(consigne)},")
        lines.append("        questions=[")
        for q in qs:
            lines.append(f"            {j(q)},")
        lines.append("        ],")
        lines.append(f"        correction={j(correction)},")
        lines.append(f"        attendu={j(attendu)},")
        if notions:
            nl = ", ".join(j(n) for n in notions)
            lines.append(f"        notions=[{nl}],")
        lines.append("    ),")
    lines.append("]")
    lines.append("")
    (OUT / f"ch{ch:02d}_data.py").write_text("\n".join(lines), encoding="utf-8")
    print(f"ch{ch:02d}_data.py ({sum(len(s['support']) for s in specs) // 12} avg support chars)")


def main() -> None:
    for mod_name in ("specs_ch02_05", "specs_ch06_10", "specs_ch11_15"):
        mod = importlib.import_module(f"management_real_chapters.{mod_name}")
        for ch, specs in mod.SPECS.items():
            write_ch(ch, specs)
    print("done")


if __name__ == "__main__":
    main()
