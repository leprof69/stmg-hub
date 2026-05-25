# -*- coding: utf-8 -*-
"""Rewrite Management chapter 1 at SDGN quality."""
import json
from pathlib import Path

ROOT = Path(Path(__file__).resolve().parents[1])
OUT = ROOT / "src/data/management/chapters"
HDR = 'import type { ManagementMissionExercise } from "../types";\n\n'
DIFFS = ["Facile"] * 3 + ["Moyen"] * 4 + ["Difficile"] * 2 + ["Tres difficile"]
XPS = [120, 130, 140, 180, 190, 210, 230, 260, 280, 360]
MIN_CHARS = [120, 140, 150, 160, 180, 180, 200, 220, 240, 260]
D = "\u2014 "


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


def write_chapter(ch, items):
    lines = [f"export const MANAGEMENT_CHAP{ch}_EXERCISES: ManagementMissionExercise[] = ["]
    for i, item in enumerate(items[:10]):
        lines.append(ex(ch, item["sid"], item["title"], DIFFS[i], XPS[i], MIN_CHARS[i], **item["body"]))
    for j, item in enumerate(items[10:12]):
        diff = "Difficile" if j == 0 else "Tres difficile"
        xp = 560 if j == 0 else 620
        mc = 400 if j == 0 else 450
        lines.append(ex(ch, item["sid"], item["title"], diff, xp, mc, etude=True, **item["body"]))
    lines.append("];")
    (OUT / f"chap{ch}.ts").write_text(HDR + "\n".join(lines) + "\n", encoding="utf-8")
    supports = [item["body"]["support"] for item in items]
    avg = sum(len(s) for s in supports) / len(supports)
    print(f"chap{ch}.ts written ({len(items)} items, avg support {avg:.0f} chars)")


if __name__ == "__main__":
    from rewrite_management_ch1_data import CH1
    write_chapter(1, CH1)
