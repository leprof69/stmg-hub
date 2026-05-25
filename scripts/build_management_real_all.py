# -*- coding: utf-8 -*-
"""Build all Management chapter TS files from real-org data modules (no enrich / no rewire)."""
from __future__ import annotations

import importlib
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

OUT = ROOT / "src/data/management/chapters"
HDR = 'import type { ManagementMissionExercise } from "../types";\n\n'
DIFFS = ["Facile"] * 3 + ["Moyen"] * 4 + ["Difficile"] * 2 + ["Tres difficile"]
XPS = [120, 130, 140, 180, 190, 210, 230, 260, 280, 360]
MIN_CHARS = [120, 140, 150, 160, 180, 180, 200, 220, 240, 260]


def ts(value: str) -> str:
    return json.dumps(value, ensure_ascii=True)


def ex(ch, sid, title, diff, xp, mc, *, support, consigne, questions, correction, attendu, notions=None, etude=False):
    typ = "Etude de cas" if etude else "Exercice"
    ql = ",\n      ".join(ts(q) for q in questions)
    notions_line = ""
    if notions:
        nl = ", ".join(ts(n) for n in notions)
        notions_line = f"\n    notionsCibles: [{nl}],"
    return f"""  {{
    id: "mgt{ch}-{sid}",
    title: {ts(title)},
    type: "{typ}",
    difficulty: "{diff}",
    xp: {xp},
    minChars: {mc},
    support: {ts(support)},
    consigne: {ts(consigne)},
    questions: [
      {ql}
    ],
    correctionModele: {ts(correction)},
    attendu: {ts(attendu)},{notions_line}
  }},"""


def write_chapter(ch: int, items: list) -> None:
    lines = [f"export const MANAGEMENT_CHAP{ch}_EXERCISES: ManagementMissionExercise[] = ["]
    for i, item in enumerate(items[:10]):
        body = item["body"]
        lines.append(
            ex(
                ch,
                item["sid"],
                item["title"],
                DIFFS[i],
                XPS[i],
                MIN_CHARS[i],
                support=body["support"],
                consigne=body["consigne"],
                questions=body["questions"],
                correction=body["correction"],
                attendu=body["attendu"],
                notions=body.get("notions"),
            )
        )
    for j, item in enumerate(items[10:12]):
        diff = "Difficile" if j == 0 else "Tres difficile"
        xp = 560 if j == 0 else 620
        mc = 400 if j == 0 else 450
        body = item["body"]
        lines.append(
            ex(
                ch,
                item["sid"],
                item["title"],
                diff,
                xp,
                mc,
                etude=True,
                support=body["support"],
                consigne=body["consigne"],
                questions=body["questions"],
                correction=body["correction"],
                attendu=body["attendu"],
                notions=body.get("notions"),
            )
        )
    lines.append("];")
    (OUT / f"chap{ch}.ts").write_text(HDR + "\n".join(lines) + "\n", encoding="utf-8")
    avg = sum(len(i["body"]["support"]) for i in items) / len(items)
    print(f"chap{ch}.ts written ({len(items)} items, avg support {avg:.0f} chars)")


def load_chapter(ch: int) -> list:
    mod = importlib.import_module(f"management_real_chapters.ch{ch:02d}_data")
    return getattr(mod, f"CH{ch}")


def main() -> None:
    for ch in range(1, 16):
        items = load_chapter(ch)
        if len(items) != 12:
            raise ValueError(f"chap{ch}: expected 12 exercises, got {len(items)}")
        write_chapter(ch, items)

    subprocess.run([sys.executable, str(ROOT / "scripts/regen_management_catalog.py")], check=True)
    print("done (hand-crafted data, enrich skipped)")


if __name__ == "__main__":
    main()
