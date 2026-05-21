# -*- coding: utf-8 -*-
"""Regenerate src/data/sdgnMissionCatalog.ts from chapter packs."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/data/sdgn/chapters"
CATALOG = ROOT / "src/data/sdgnMissionCatalog.ts"

TITLE_RE = re.compile(
    r'id: "(sdgn\d+-(?:e\d+|cas\d+))"[\s\S]*?title: ("(?:\\.|[^"\\])*")[\s\S]*?xp: (\d+)'
)


def main():
    entries = []
    for ch in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]:
        text = (OUT / f"chap{ch}.ts").read_text(encoding="utf-8")
        for m in TITLE_RE.finditer(text):
            title = json.loads(m.group(2))
            entries.append((m.group(1), title, int(m.group(3)), ch))

    lines = [
        "/** Genere par scripts/regen_sdgn_catalog.py */",
        "export const SDGN_MISSIONS_PROGRESS_VERSION = 1 as const;",
        "export type SdgnMissionMeta = { title: string; chapter: string; xpMax: number };",
        "export const SDGN_MISSION_BY_ID: Record<string, SdgnMissionMeta> = {",
    ]
    for tid, tit, xp, ch in entries:
        lines.append(
            f'  "{tid}": {{ title: {json.dumps(tit, ensure_ascii=True)}, '
            f'chapter: "SDGN Chapitre {ch}", xpMax: {xp} }},'
        )
    lines += [
        "};",
        "const ORDER_INDEX: Record<string, number> = Object.fromEntries("
        "Object.keys(SDGN_MISSION_BY_ID).map((id, i) => [id, i])"
        ");",
        "export function getSdgnMissionMeta(exerciseId: string): SdgnMissionMeta {",
        '  return SDGN_MISSION_BY_ID[exerciseId] ?? { title: exerciseId, chapter: "Mission SDGN", xpMax: 0 };',
        "}",
        "export function compareSdgnExerciseIds(a: string, b: string): number {",
        "  return (ORDER_INDEX[a] ?? 9999) - (ORDER_INDEX[b] ?? 9999);",
        "}",
    ]
    CATALOG.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"catalog: {len(entries)} entries")


if __name__ == "__main__":
    main()
