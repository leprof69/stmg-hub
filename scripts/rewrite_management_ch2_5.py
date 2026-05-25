# -*- coding: utf-8 -*-
"""Rewrite Management chapters 2-5 at SDGN quality."""
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


def _enrich_item(ch: int, item: dict) -> dict:
    body = dict(item["body"])
    if ch not in (3, 4, 5):
        return body
    from rewrite_management_ch3_5_enrich import enrich_correction_ch, enrich_support_ch
    from management_enrich_common import enrich_consigne

    sid = item["sid"]
    notions = body.get("notions") or []
    body["support"] = enrich_support_ch(ch, sid, body["support"])
    body["consigne"] = enrich_consigne(body["consigne"], body["attendu"], sid)
    body["correction"] = enrich_correction_ch(ch, sid, body["correction"], body["attendu"], notions)
    return body


def write_chapter(ch, items):
    lines = [f"export const MANAGEMENT_CHAP{ch}_EXERCISES: ManagementMissionExercise[] = ["]
    for i, item in enumerate(items[:10]):
        body = _enrich_item(ch, item)
        lines.append(ex(ch, item["sid"], item["title"], DIFFS[i], XPS[i], MIN_CHARS[i], **body))
    for j, item in enumerate(items[10:12]):
        diff = "Difficile" if j == 0 else "Tres difficile"
        xp = 560 if j == 0 else 620
        mc = 400 if j == 0 else 450
        body = _enrich_item(ch, item)
        lines.append(ex(ch, item["sid"], item["title"], diff, xp, mc, etude=True, **body))
    lines.append("];")
    (OUT / f"chap{ch}.ts").write_text(HDR + "\n".join(lines) + "\n", encoding="utf-8")
    enriched = [_enrich_item(ch, item) for item in items]
    avg_s = sum(len(b["support"]) for b in enriched) / len(enriched)
    avg_c = sum(len(b["correction"]) for b in enriched) / len(enriched)
    print(f"chap{ch}.ts written ({len(items)} items, avg support {avg_s:.0f}, avg corr {avg_c:.0f})")


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


def load_chapters():
    from rewrite_management_ch2_5_data import CH2, CH3, CH4, CH5
    return CH2, CH3, CH4, CH5


if __name__ == "__main__":
    from rewrite_management_ch2_5_data import CH2, CH3, CH4, CH5
    for ch, items in [(2, CH2), (3, CH3), (4, CH4), (5, CH5)]:
        write_chapter(ch, items)
