# -*- coding: utf-8 -*-
"""Rewrite Management chapters 11-15 at chap1-2 / SDGN quality."""
import importlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from rewrite_management_ch11_15_enrich import NOTIONS, enrich_correction, enrich_support

OUT = ROOT / "src/data/management/chapters"
HDR = 'import type { ManagementMissionExercise } from "../types";\n\n'
DIFFS = ["Facile"] * 3 + ["Moyen"] * 4 + ["Difficile"] * 2 + ["Tres difficile"]
XPS = [120, 130, 140, 180, 190, 210, 230, 260, 280, 360]
MIN_CHARS = [120, 140, 150, 160, 180, 180, 200, 220, 240, 260]
CAS_XP = [560, 620]
CAS_MC = [400, 450]

MODULES = ["chap11", "chap12", "chap13", "chap14", "chap15"]


def ts(value: str) -> str:
    return json.dumps(value, ensure_ascii=True)


def build_item(ch: int, raw: dict) -> dict:
    sid = raw["id"]
    return {
        "id": sid,
        "title": raw["title"],
        "support": enrich_support(ch, sid, raw["support"]),
        "consigne": raw["consigne"],
        "questions": raw["questions"],
        "correctionModele": enrich_correction(ch, sid, raw["correctionModele"], raw["attendu"]),
        "attendu": raw["attendu"],
        "notionsCibles": NOTIONS.get((ch, sid), []),
        "minChars": raw.get("minChars"),
    }


def ex(ch, item, diff, xp, mc, etude=False):
    typ = "Etude de cas" if etude else "Exercice"
    ql = ",\n      ".join(ts(q) for q in item["questions"])
    notions_line = ""
    if item.get("notionsCibles"):
        nl = ", ".join(ts(n) for n in item["notionsCibles"])
        notions_line = f"\n    notionsCibles: [{nl}],"
    return f"""  {{
    id: "mgt{ch}-{item['id']}",
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
    correctionModele: {ts(item['correctionModele'])},
    attendu: {ts(item['attendu'])},{notions_line}
  }},"""


def write_chapter(mod_name: str):
    mod = importlib.import_module(f"management_enrich.{mod_name}")
    ch = mod.CHAPTER
    raw_items = mod.EXERCISES
    if len(raw_items) != 12:
        raise ValueError(f"chap{ch}: expected 12 exercises, got {len(raw_items)}")

    items = [build_item(ch, r) for r in raw_items]
    lines = [HDR, f"export const MANAGEMENT_CHAP{ch}_EXERCISES: ManagementMissionExercise[] = ["]
    for i, item in enumerate(items[:10]):
        mc = item.get("minChars") or MIN_CHARS[i]
        lines.append(ex(ch, item, DIFFS[i], XPS[i], mc))
    for j, item in enumerate(items[10:12]):
        diff = "Difficile" if j == 0 else "Tres difficile"
        mc = item.get("minChars") or CAS_MC[j]
        lines.append(ex(ch, item, diff, CAS_XP[j], mc, etude=True))
    lines.append("];")

    path = OUT / f"chap{ch}.ts"
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")
    avg_s = sum(len(i["support"]) for i in items) / len(items)
    avg_c = sum(len(i["correctionModele"]) for i in items) / len(items)
    print(f"chap{ch}.ts written ({len(items)} items, avg support {avg_s:.0f}, avg corr {avg_c:.0f})")


def main():
    mods = sys.argv[1:] or MODULES
    for m in mods:
        write_chapter(m)


if __name__ == "__main__":
    main()
