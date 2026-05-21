# -*- coding: utf-8 -*-
"""Build src/data/sdgn/chapters/chap{N}.ts from scripts/sdgn_enrich/chap*.py"""
import importlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "src/data/sdgn/chapters"
HDR = 'import type { SdgnMissionExercise } from "../types";\n\n'

DIFFS = ["Facile"] * 3 + ["Moyen"] * 4 + ["Difficile"] * 2 + ["Tres difficile"]
XPS = [120, 130, 140, 180, 190, 210, 230, 260, 280, 360]
CAS_XP = [560, 620]
CAS_MC = [380, 420]

SKIP = {7, 10, 11}


def fmt_tables(tables):
    if not tables:
        return ""
    parts = ["    supportTables: ["]
    for tbl in tables:
        cols = json.dumps(tbl["columns"], ensure_ascii=False)
        rows = json.dumps(tbl["rows"], ensure_ascii=False)
        title = tbl.get("title")
        if title:
            parts.append(f'      {{ title: {json.dumps(title, ensure_ascii=False)}, columns: {cols}, rows: {rows} }},')
        else:
            parts.append(f"      {{ columns: {cols}, rows: {rows} }},")
    parts.append("    ],")
    return "\n".join(parts)


def render_ex(ch: int, ex: dict, diff: str, xp: int, etude: bool) -> str:
    typ = "Etude de cas" if etude else "Exercice"
    ql = ",\n      ".join(json.dumps(q, ensure_ascii=False) for q in ex["questions"])
    tables = fmt_tables(ex.get("supportTables"))
    return f"""  {{
    id: "sdgn{ch}-{ex['id']}",
    title: {json.dumps(ex['title'], ensure_ascii=False)},
    type: "{typ}",
    difficulty: "{diff}",
    xp: {xp},
    minChars: {ex.get('minChars', 150)},
    support: {json.dumps(ex['support'], ensure_ascii=False)},
{tables}    consigne: {json.dumps(ex['consigne'], ensure_ascii=False)},
    questions: [
      {ql}
    ],
    correctionModele: {json.dumps(ex['correctionModele'], ensure_ascii=False)},
    attendu: {json.dumps(ex['attendu'], ensure_ascii=False)},
  }},"""


def build_chapter(mod_name: str):
    mod = importlib.import_module(f"sdgn_enrich.{mod_name}")
    ch = mod.CHAPTER
    if ch in SKIP:
        print("skip", ch)
        return
    exercises = mod.EXERCISES
    if len(exercises) != 12:
        raise ValueError(f"chap{ch}: expected 12 exercises, got {len(exercises)}")
    lines = [HDR, f"export const SDGN_CHAP{ch}_EXERCISES: SdgnMissionExercise[] = ["]
    for i, ex in enumerate(exercises[:10]):
        lines.append(render_ex(ch, ex, DIFFS[i], XPS[i], False))
    for j, ex in enumerate(exercises[10:12]):
        d = "Difficile" if j == 0 else "Tres difficile"
        if "minChars" not in ex:
            ex = {**ex, "minChars": CAS_MC[j]}
        lines.append(render_ex(ch, ex, d, CAS_XP[j], True))
    lines.append("];")
    out = OUT / f"chap{ch}.ts"
    out.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("wrote", out.name, len(exercises))


def main():
    sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
    for path in sorted(Path(__file__).parent.glob("chap*.py")):
        if path.name == "build_ts.py":
            continue
        build_chapter(path.stem)
    # regen catalog
    import subprocess
    subprocess.run([sys.executable, str(ROOT / "scripts/regen_sdgn_catalog.py")], check=True)


if __name__ == "__main__":
    main()
