# -*- coding: utf-8 -*-
"""
Enrich all Missions exercise packs (SDGN + Management).

- notionsCibles on every exercise
- consignes less generic
- correction typos fixed
- Management: one different org per exercise (within chapter)
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from mission_enrich_common import (  # noqa: E402
    fix_correction_text,
    improve_consigne,
    notions_from_attendu,
)

SDGN_DIR = ROOT / "src/data/sdgn/chapters"
MGMT_DIR = ROOT / "src/data/management/chapters"

SDGN_NOTIONS: dict[int, list[list[str]]] = {
    1: [
        ["action collective organis\u00e9e", "personne morale"],
        ["personne morale", "statuts juridiques"],
        ["objet social", "finalit\u00e9"],
        ["entreprise priv\u00e9e", "service public"],
        ["association", "gouvernance"],
        ["SA", "actionnariat"],
        ["SARL", "g\u00e9rance"],
        ["coop\u00e9rative", "SCOP"],
        ["modes de contr\u00f4le", "gouvernance"],
        ["parties prenantes", "responsabilit\u00e9"],
        ["synth\u00e8se types d'organisation", "comparaison"],
        ["dossier bac", "gouvernance"],
    ],
    7: [
        ["visioconf\u00e9rence", "travail collaboratif"],
        ["outils collaboratifs", "communication"],
        ["travail collaboratif", "mutualisation"],
        ["synchrone", "asynchrone"],
        ["intranet", "extranet"],
        ["droits d'acc\u00e8s", "s\u00e9curit\u00e9"],
        ["intelligence collective", "partage"],
        ["RSE num\u00e9rique", "impact environnemental"],
        ["transformation num\u00e9rique", "organisation"],
        ["synth\u00e8se TIC", "collaboration"],
        ["dossier TIC", "arbitrage"],
        ["cas TIC", "recommandation"],
    ],
    10: [
        ["compte de r\u00e9sultat", "produits d'exploitation"],
        ["charges d'exploitation", "r\u00e9sultat d'exploitation"],
        ["bilan", "actif/passif"],
        ["immobilisations", "amortissements"],
        ["capitaux propres", "endettement"],
        ["flux de tr\u00e9sorerie", "liquidit\u00e9"],
        ["cours de bourse", "capitalisation"],
        ["PER", "valorisation"],
        ["dividendes", "actionnaires"],
        ["synth\u00e8se financi\u00e8re", "analyse"],
        ["dossier financier", "interpr\u00e9tation"],
        ["cas boursier", "recommandation"],
    ],
    11: [
        ["facteurs de production", "travail/capital"],
        ["chiffre d'affaires", "HT/TTC"],
        ["valeur ajout\u00e9e", "consommations interm\u00e9diaires"],
        ["r\u00e9partition VA", "partage valeur"],
        ["partenariat", "valeur partenariale"],
        ["fournisseurs", "clients"],
        ["salari\u00e9s", "actionnaires"],
        ["\u00c9tat", "collectivit\u00e9s"],
        ["cr\u00e9ation de richesse", "distribution"],
        ["synth\u00e8se VA", "analyse"],
        ["dossier VA", "calcul"],
        ["cas partenarial", "recommandation"],
    ],
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


def split_exercises(text: str) -> tuple[str, list[str], str]:
    m = re.search(r"export const \w+.*? = \[", text, re.S)
    if not m:
        raise ValueError("array export not found")
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


def extract_exercise_id(block: str) -> str:
    m = re.search(r'id: "(sdgn\d+-(?:e\d+|cas\d+)|mgt\d+-(?:e\d+|cas\d+))"', block)
    return m.group(1) if m else ""


def chapter_from_id(ex_id: str) -> int:
    m = re.match(r"(?:sdgn|mgt)(\d+)-", ex_id)
    return int(m.group(1)) if m else 0


def exercise_index(ex_id: str) -> int:
    m = re.search(r"-(e\d+|cas\d+)$", ex_id)
    if not m:
        return 0
    sid = m.group(1)
    if sid.startswith("e"):
        return int(sid[1:]) - 1
    return 10 + int(sid[3:]) - 1


def extract_raw_tables(block: str) -> str:
    m = re.search(r"\n    supportTables: \[\n[\s\S]*?\n    \],", block)
    return m.group(0) + "\n" if m else ""


def render_exercise(block: str, *, is_management: bool) -> str:
    ex_id = extract_exercise_id(block)
    ch = chapter_from_id(ex_id)
    idx = exercise_index(ex_id)

    title = parse_json_field(block, "title") or ""
    support = parse_json_field(block, "support")
    consigne = parse_json_field(block, "consigne") or ""
    attendu = parse_json_field(block, "attendu") or ""
    correction = parse_json_field(block, "correctionModele") or ""
    questions = parse_questions(block)
    notions = parse_notions(block)
    if len(notions) < 2:
        if ch in SDGN_NOTIONS and idx < len(SDGN_NOTIONS[ch]):
            notions = SDGN_NOTIONS[ch][idx]
        elif not notions:
            notions = notions_from_attendu(attendu)

    if is_management:
        pass  # orgas reelles : scripts/rewire_management_real_orgs.py

    consigne = improve_consigne(consigne, title, notions)
    correction = fix_correction_text(correction)

    typ = re.search(r'type: "(Exercice|Etude de cas)"', block)
    diff = re.search(r'difficulty: "(Facile|Moyen|Difficile|Tres difficile)"', block)
    xp = re.search(r"xp: (\d+)", block)
    mc = re.search(r"minChars: (\d+)", block)
    tables = extract_raw_tables(block)

    ql = ",\n      ".join(ts_str(q) for q in questions)
    nl = ", ".join(ts_str(n) for n in notions[:4])

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
        f"    notionsCibles: [{nl}],",
        "  },",
    ]
    return "\n".join(lines)


def process_file(path: Path, *, is_management: bool) -> None:
    text = path.read_text(encoding="utf-8")
    header, blocks, footer = split_exercises(text)
    out_blocks = [render_exercise(b, is_management=is_management) for b in blocks if extract_exercise_id(b)]
    path.write_text(header + "\n" + "\n".join(out_blocks) + "\n" + footer + "\n", encoding="utf-8")
    print("enriched", path.name, len(out_blocks))


def main():
    for ch in range(1, 14):
        p = SDGN_DIR / f"chap{ch}.ts"
        if p.exists():
            process_file(p, is_management=False)

    for ch in range(1, 16):
        p = MGMT_DIR / f"chap{ch}.ts"
        if p.exists():
            process_file(p, is_management=True)

    subprocess.run([sys.executable, str(ROOT / "scripts/regen_sdgn_catalog.py")], check=True)
    print("done")


if __name__ == "__main__":
    main()
