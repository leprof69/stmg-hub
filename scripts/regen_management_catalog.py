# -*- coding: utf-8 -*-
"""Regenerate src/data/managementMissionCatalog.ts from chapter packs."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src/data/management/chapters"
CATALOG = ROOT / "src/data/managementMissionCatalog.ts"

TITLE_RE = re.compile(
    r'id: "(mgt\d+-(?:e\d+|cas\d+))"[\s\S]*?title: ("(?:\\.|[^"\\])*")[\s\S]*?xp: (\d+)'
)


def main():
    entries = []
    for ch in range(1, 16):
        path = OUT / f"chap{ch}.ts"
        if not path.exists():
            print(f"missing: {path}")
            continue
        text = path.read_text(encoding="utf-8")
        for m in TITLE_RE.finditer(text):
            title = json.loads(m.group(2))
            entries.append((m.group(1), title, int(m.group(3)), ch))

    lines = [
        "/** Genere par scripts/regen_management_catalog.py */",
        "export const MANAGEMENT_MISSIONS_PROGRESS_VERSION = 1 as const;",
        "export type ManagementMissionMeta = { title: string; chapter: string; xpMax: number };",
        "export const MANAGEMENT_MISSION_BY_ID: Record<string, ManagementMissionMeta> = {",
    ]
    for tid, tit, xp, ch in entries:
        lines.append(
            f'  "{tid}": {{ title: {json.dumps(tit, ensure_ascii=True)}, '
            f'chapter: "Management Chapitre {ch}", xpMax: {xp} }},'
        )
    lines += [
        "};",
        "const ORDER_INDEX: Record<string, number> = Object.fromEntries("
        "Object.keys(MANAGEMENT_MISSION_BY_ID).map((id, i) => [id, i])"
        ");",
        "export function getManagementMissionMeta(exerciseId: string): ManagementMissionMeta {",
        '  return MANAGEMENT_MISSION_BY_ID[exerciseId] ?? { title: exerciseId, chapter: "Mission Management", xpMax: 0 };',
        "}",
        "export function compareManagementExerciseIds(a: string, b: string): number {",
        "  return (ORDER_INDEX[a] ?? 9999) - (ORDER_INDEX[b] ?? 9999);",
        "}",
    ]
    CATALOG.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"catalog: {len(entries)} entries")


if __name__ == "__main__":
    main()
