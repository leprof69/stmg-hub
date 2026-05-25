# -*- coding: utf-8 -*-
"""Build src/data/management/chapters/chap11-15.ts from management_enrich modules."""
import importlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
OUT = ROOT / "src/data/management/chapters"
HDR = 'import type { ManagementMissionExercise } from "../types";\n\n'

DIFFS = ["Facile"] * 3 + ["Moyen"] * 4 + ["Difficile"] * 2 + ["Tres difficile"]
XPS = [120, 130, 140, 180, 190, 210, 230, 260, 280, 360]
MIN_CHARS = [120, 140, 150, 160, 180, 180, 200, 220, 240, 260]
CAS_XP = [560, 620]
CAS_MC = [400, 450]


def render_ex(ch: int, ex: dict, diff: str, xp: int, etude: bool) -> str:
    typ = "Etude de cas" if etude else "Exercice"
    ql = ",\n      ".join(json.dumps(q, ensure_ascii=True) for q in ex["questions"])
    mc = ex.get("minChars", MIN_CHARS[9] if not etude else CAS_MC[0])
    return f"""  {{
    id: "mgt{ch}-{ex['id']}",
    title: {json.dumps(ex['title'], ensure_ascii=True)},
    type: "{typ}",
    difficulty: "{diff}",
    xp: {xp},
    minChars: {mc},
    support: {json.dumps(ex['support'], ensure_ascii=True)},
    consigne: {json.dumps(ex['consigne'], ensure_ascii=True)},
    questions: [
      {ql}
    ],
    correctionModele: {json.dumps(ex['correctionModele'], ensure_ascii=True)},
    attendu: {json.dumps(ex['attendu'], ensure_ascii=True)},
  }},"""


def build_chapter(mod_name: str):
    mod = importlib.import_module(f"management_enrich.{mod_name}")
    ch = mod.CHAPTER
    exercises = mod.EXERCISES
    if len(exercises) != 12:
        raise ValueError(f"chap{ch}: expected 12 exercises, got {len(exercises)}")
    lines = [HDR, f"export const MANAGEMENT_CHAP{ch}_EXERCISES: ManagementMissionExercise[] = ["]
    for i, ex in enumerate(exercises[:10]):
        mc = ex.get("minChars", MIN_CHARS[i])
        ex = {**ex, "minChars": mc}
        lines.append(render_ex(ch, ex, DIFFS[i], XPS[i], False))
    for j, ex in enumerate(exercises[10:12]):
        d = "Difficile" if j == 0 else "Tres difficile"
        ex = {**ex, "minChars": ex.get("minChars", CAS_MC[j])}
        lines.append(render_ex(ch, ex, d, CAS_XP[j], True))
    lines.append("];")
    out = OUT / f"chap{ch}.ts"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("wrote", out.name)


def main():
    mods = sys.argv[1:] or ["chap11", "chap12", "chap13", "chap14", "chap15"]
    for m in mods:
        build_chapter(m)


if __name__ == "__main__":
    main()
