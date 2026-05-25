# -*- coding: utf-8 -*-
"""Remplace les noms fictifs Management par des organisations reelles (1 exo = 1 acteur)."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from management_real_orgs import (  # noqa: E402
    CHAPTER_FICTION,
    EXTRA_FICTION,
    PRIMARY_FICTION,
    REAL_ORGS_BY_CHAPTER,
)

MGMT_DIR = ROOT / "src/data/management/chapters"

# Remplacements globaux fictif -> reel (si le nom apparait encore dans un exercice)
GLOBAL_FAKE_TO_REAL = {
    "Locavore": "La Ruche qui dit Oui",
    "GreenBox": "Lidl",
    "MonPanierBio": "Intermarch\u00e9",
    "GreenWrap": "Nestl\u00e9",
    "GMS Frais du Sud": "Monoprix",
    "Start-up VegoTrack": "Back Market",
    "Asso Panier Solidaire Lyon": "Restos du C\u0153ur",
    "Coop Bio Rh\u00f4ne": "Biocoop",
    "March\u00e9 Paysan M\u00e9tropole": "Les Halles de Lyon",
    "R\u00e9seau Restos Bio": "Biocoop",
    "Mode&Co": "Primark",
    "TechLink": "Capgemini",
    "DataSecure": "Orange Cyberdefense",
    "BanqueNord": "Cr\u00e9dit Agricole",
    "GreenPack": "Nestl\u00e9",
}


def ts_str(value: str) -> str:
    return json.dumps(value, ensure_ascii=True)


def parse_json_field(block: str, field: str) -> str | None:
    m = re.search(rf"{field}: (\"(?:\\.|[^\"\\])*\")", block, re.S)
    if not m:
        return None
    return json.loads(m.group(1))


def parse_questions(block: str) -> list[str]:
    m = re.search(r"questions: \[(.*?)\]", block, re.S)
    if not m:
        return []
    return [json.loads(x) for x in re.findall(r"\"(?:\\.|[^\"\\])*\"", m.group(1))]


def parse_notions(block: str) -> list[str]:
    m = re.search(r"notionsCibles: \[(.*?)\]", block, re.S)
    if not m:
        return []
    return [json.loads(x) for x in re.findall(r"\"(?:\\.|[^\"\\])*\"", m.group(1))]


def extract_exercise_id(block: str) -> str:
    m = re.search(r'id: "(mgt(\d+)-(e\d+|cas\d+))"', block)
    return m.group(1) if m else ""


def exercise_index(ex_id: str) -> int:
    m = re.search(r"-(e\d+|cas\d+)$", ex_id)
    if not m:
        return 0
    sid = m.group(1)
    if sid.startswith("e"):
        return int(sid[1:]) - 1
    return 10 + int(sid[3:]) - 1


def split_exercises(text: str) -> tuple[str, list[str], str]:
    m = re.search(r"export const \w+.*? = \[", text, re.S)
    if not m:
        raise ValueError("export not found")
    header = text[: m.end()]
    end = text.rfind("];")
    body = text[m.end() : end]
    parts = re.split(r"\n  \{", body)
    blocks: list[str] = []
    for i, part in enumerate(parts):
        if not part.strip():
            continue
        blocks.append(("" if i == 0 else "  {") + part)
    return header, blocks, "];"


def extract_raw_tables(block: str) -> str:
    m = re.search(r"\n    supportTables: \[\n[\s\S]*?\n    \],", block)
    return m.group(0) + "\n" if m else ""


def fiction_names_for_chapter(ch: int) -> list[str]:
    names: list[str] = []
    for group in (CHAPTER_FICTION.get(ch, ()), (PRIMARY_FICTION.get(ch, ""),), EXTRA_FICTION):
        for name in group:
            if name and name not in names:
                names.append(name)
    return names


def rewire_text(text: str, ch: int, idx: int, orgs: list[str]) -> str:
    if not text:
        return text
    target = orgs[idx] if idx < len(orgs) else orgs[-1]
    out = text
    for fake in fiction_names_for_chapter(ch):
        if fake in out:
            out = out.replace(fake, target)
    for fake, real in GLOBAL_FAKE_TO_REAL.items():
        if fake in out:
            out = out.replace(fake, real)
    return out


def render_block(block: str, ch: int, idx: int) -> str:
    orgs = REAL_ORGS_BY_CHAPTER.get(ch, [])
    if not orgs:
        return block

    ex_id = extract_exercise_id(block)
    title = rewire_text(parse_json_field(block, "title") or "", ch, idx, orgs)
    support_raw = parse_json_field(block, "support")
    support = rewire_text(support_raw, ch, idx, orgs) if support_raw else None
    consigne = rewire_text(parse_json_field(block, "consigne") or "", ch, idx, orgs)
    attendu = rewire_text(parse_json_field(block, "attendu") or "", ch, idx, orgs)
    correction = rewire_text(parse_json_field(block, "correctionModele") or "", ch, idx, orgs)
    questions = [rewire_text(q, ch, idx, orgs) for q in parse_questions(block)]
    notions = parse_notions(block)
    tables = extract_raw_tables(block)

    typ = re.search(r'type: "(Exercice|Etude de cas)"', block)
    diff = re.search(r'difficulty: "(Facile|Moyen|Difficile|Tres difficile)"', block)
    xp = re.search(r"xp: (\d+)", block)
    mc = re.search(r"minChars: (\d+)", block)
    ql = ",\n      ".join(ts_str(q) for q in questions)
    nl = ", ".join(ts_str(n) for n in notions) if notions else ""

    lines = [
        "  {",
        f'    id: "{ex_id}",',
        f"    title: {ts_str(title)},",
        f'    type: "{typ.group(1)}",',
        f'    difficulty: "{diff.group(1)}",',
        f"    xp: {xp.group(1)},",
        f"    minChars: {mc.group(1)},",
    ]
    if support is not None:
        lines.append(f"    support: {ts_str(support)},")
    if tables:
        lines.append(tables.rstrip())
    lines += [
        f"    consigne: {ts_str(consigne)},",
        "    questions: [",
        f"      {ql}",
        "    ],",
        f"    correctionModele: {ts_str(correction)},",
        f"    attendu: {ts_str(attendu)},",
    ]
    if nl:
        lines.append(f"    notionsCibles: [{nl}],")
    lines.append("  },")
    return "\n".join(lines)


def rewire_chapter(ch: int) -> None:
    if ch == 1:
        return  # ch1 regenere depuis rewrite_management_ch1_data (deja reel)
    path = MGMT_DIR / f"chap{ch}.ts"
    text = path.read_text(encoding="utf-8")
    header, blocks, footer = split_exercises(text)
    out = []
    for block in blocks:
        ex_id = extract_exercise_id(block)
        if not ex_id:
            continue
        idx = exercise_index(ex_id)
        out.append(render_block(block, ch, idx))
    path.write_text(header + "\n" + "\n".join(out) + "\n" + footer + "\n", encoding="utf-8")
    print("rewired", path.name)


def main():
    import subprocess

    subprocess.run([sys.executable, str(ROOT / "scripts/rewrite_management_ch1.py")], check=True)
    subprocess.run([sys.executable, str(ROOT / "scripts/rewrite_management_ch2_5.py")], check=True)
    subprocess.run([sys.executable, str(ROOT / "scripts/rewrite_management_ch6_10.py")], check=True)
    subprocess.run([sys.executable, str(ROOT / "scripts/rewrite_management_ch11_15.py")], check=True)
    for ch in range(2, 16):
        rewire_chapter(ch)
    print("done")


if __name__ == "__main__":
    main()
