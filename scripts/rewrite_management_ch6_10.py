# -*- coding: utf-8 -*-
"""Rewrite Management chapters 6-10 at SDGN / chap2 quality."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from gen_rich_management_ch6_10 import CH6, CH7, CH8, CH9, CH10
from management_enrich_common import enrich_consigne
from rewrite_management_ch6_10_enrich import NOTIONS, enrich_correction, enrich_support

OUT = ROOT / "src/data/management/chapters"
HDR = 'import type { ManagementMissionExercise } from "../types";\n\n'
DIFFS = ["Facile"] * 3 + ["Moyen"] * 4 + ["Difficile"] * 2 + ["Tres difficile"]
XPS = [120, 130, 140, 180, 190, 210, 230, 260, 280, 360]
MIN_CHARS = [120, 140, 150, 160, 180, 180, 200, 220, 240, 260]

CHAPTERS = {6: CH6, 7: CH7, 8: CH8, 9: CH9, 10: CH10}


def ts(value: str) -> str:
    return json.dumps(value, ensure_ascii=True)


def build_item(ch: int, raw: dict) -> dict:
    sid = raw["sid"]
    return {
        "sid": sid,
        "title": raw["title"],
        "support": enrich_support(ch, sid, raw["support"]),
        "consigne": enrich_consigne(raw["consigne"], raw["attendu"], raw["sid"]),
        "questions": raw["questions"],
        "correction": enrich_correction(ch, sid, raw["correction"], raw["attendu"]),
        "attendu": raw["attendu"],
        "notions": NOTIONS.get((ch, sid), []),
    }


def ex(ch, item, diff, xp, mc, etude=False):
    typ = "Etude de cas" if etude else "Exercice"
    ql = ",\n      ".join(ts(q) for q in item["questions"])
    notions_line = ""
    if item.get("notions"):
        nl = ", ".join(ts(n) for n in item["notions"])
        notions_line = f"\n    notionsCibles: [{nl}],"
    return f"""  {{
    id: "mgt{ch}-{item['sid']}",
    title: {ts(item['title'])},
    type: "{typ}",
    difficulty: "{diff}",
    xp: {xp},
    minChars: {mc},
    support: {ts(item['support'])},
    consigne: {ts(item['consigne'])},
    questions: [
      {ql}
    ],
    correctionModele: {ts(item['correction'])},
    attendu: {ts(item['attendu'])},{notions_line}
  }},"""


def write_chapter(ch: int, raw_items):
    items = [build_item(ch, r) for r in raw_items]
    lines = [f"export const MANAGEMENT_CHAP{ch}_EXERCISES: ManagementMissionExercise[] = ["]
    for i, item in enumerate(items[:10]):
        lines.append(ex(ch, item, DIFFS[i], XPS[i], MIN_CHARS[i]))
    for j, item in enumerate(items[10:12]):
        diff = "Difficile" if j == 0 else "Tres difficile"
        xp = 560 if j == 0 else 620
        mc = 400 if j == 0 else 450
        lines.append(ex(ch, item, diff, xp, mc, etude=True))
    lines.append("];")
    path = OUT / f"chap{ch}.ts"
    path.write_text(HDR + "\n".join(lines) + "\n", encoding="utf-8")
    avg_s = sum(len(i["support"]) for i in items) / len(items)
    avg_c = sum(len(i["correction"]) for i in items) / len(items)
    print(f"chap{ch}.ts written ({len(items)} items, avg support {avg_s:.0f}, avg corr {avg_c:.0f})")


def export_data_module():
    """Write rewrite_management_ch6_10_data.py for inspection / reuse."""
    out_path = ROOT / "scripts/rewrite_management_ch6_10_data.py"
    lines = [
        '# -*- coding: utf-8 -*-',
        '"""Generated exercise data for Management chapters 6-10."""',
        "",
        "def I(sid, title, **body):",
        '    return {"sid": sid, "title": title, "body": body}',
        "",
    ]
    for ch, raw_items in CHAPTERS.items():
        lines.append(f"CH{ch} = [")
        for raw in raw_items:
            item = build_item(ch, raw)
            lines.append("    I(")
            lines.append(f'        "{item["sid"]}",')
            lines.append(f'        {json.dumps(item["title"], ensure_ascii=True)},')
            lines.append(f"        support={json.dumps(item['support'], ensure_ascii=True)},")
            lines.append(f"        consigne={json.dumps(item['consigne'], ensure_ascii=True)},")
            lines.append(f"        questions={json.dumps(item['questions'], ensure_ascii=True)},")
            lines.append(f"        correction={json.dumps(item['correction'], ensure_ascii=True)},")
            lines.append(f"        attendu={json.dumps(item['attendu'], ensure_ascii=True)},")
            lines.append(f"        notions={json.dumps(item['notions'], ensure_ascii=True)},")
            lines.append("    ),")
        lines.append("]")
        lines.append("")
    out_path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"data module: {out_path.name}")


if __name__ == "__main__":
    for ch, items in CHAPTERS.items():
        write_chapter(ch, items)
    export_data_module()
