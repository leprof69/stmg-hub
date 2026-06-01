#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Generate src/data/sdgn/sdgnDsPremiereQcm.ts from scripts/premiere-qcm-source.txt."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "scripts" / "premiere-qcm-source.txt"
OUT = ROOT / "src" / "data" / "sdgn" / "sdgnDsPremiereQcm.ts"

THEME_RE = re.compile(r"Th\u00e8me\s+(\d+)\s*:", re.UNICODE)
ANSWER_RE = re.compile(r"\nR\u00e9ponse\s*:\s*([ABCD])\b", re.I | re.UNICODE)
THEME_HEADER_RE = re.compile(r"^.*?Th\u00e8me\s+\d+\s*:[^\n]*\n", re.S | re.UNICODE)
CHOICE_RE = re.compile(r"^([ABCD])\)\s*", re.M)

ANSWER_MAP = {"A": 0, "B": 1, "C": 2, "D": 3}
PIEGE_RE = re.compile(
    r"(R\u00e9ponse\s*:\s*[ABCD])\s*\([^)]*\)",
    re.I | re.UNICODE,
)


def normalize_source(text: str) -> str:
    """Retire les explications (Pi\u00e8ge : ...) apr\u00e8s la ligne R\u00e9ponse."""
    return PIEGE_RE.sub(r"\1", text)


def ts_escape(s: str) -> str:
    return (
        s.replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\r\n", "\n")
        .replace("\r", "\n")
        .replace("\n", "\\n")
    )


def parse_questions(text: str) -> list[dict]:
    current_theme = 1
    questions: list[dict] = []
    blocks = re.split(r"\n(?=\d+\.\s)", text.strip())

    for block in blocks:
        block = block.strip()
        if not block:
            continue

        theme_match = THEME_RE.search(block)
        if theme_match:
            current_theme = int(theme_match.group(1))
            block = THEME_HEADER_RE.sub("", block, count=1)

        num_match = re.match(r"(\d+)\.\s+(.*)", block, re.S)
        if not num_match:
            continue

        num = int(num_match.group(1))
        rest = num_match.group(2).strip()

        answer_match = ANSWER_RE.search(rest)
        if not answer_match:
            raise ValueError(f"Q{num}: missing answer")
        answer_letter = answer_match.group(1).upper()
        body = rest[: answer_match.start()].strip()

        matches = list(CHOICE_RE.finditer(body))
        if len(matches) != 4:
            raise ValueError(f"Q{num}: expected 4 choices, found {len(matches)}")

        choices: dict[str, str] = {}
        for i, m in enumerate(matches):
            letter = m.group(1)
            start = m.end()
            end = matches[i + 1].start() if i + 1 < len(matches) else len(body)
            choices[letter] = body[start:end].strip()

        question_text = body[: matches[0].start()].strip()

        questions.append(
            {
                "num": num,
                "chapter": min(max(current_theme, 1), 4),
                "question": question_text,
                "choix": [choices["A"], choices["B"], choices["C"], choices["D"]],
                "bonIndex": ANSWER_MAP[answer_letter],
            }
        )

    questions.sort(key=lambda q: q["num"])
    return questions


def render_ts(questions: list[dict]) -> str:
    lines = [
        'import type { SdgnMissionQcm } from "./sdgnMissionQcmBank";',
        "",
        "/** Banque officielle du DS SDGN Premi\u00e8re (100 QCM). */",
        "export const SDGN_DS_PREMIERE_QCM: SdgnMissionQcm[] = [",
    ]

    for q in questions:
        num = q["num"]
        qid = f"sdgn-p-ds-{num:02d}"
        chapter = q["chapter"]
        bon = q["bonIndex"]
        question = ts_escape(q["question"])
        choix = ", ".join(f'"{ts_escape(c)}"' for c in q["choix"])
        lines.append(
            f'  {{ id: "{qid}", chapter: {chapter}, difficulte: "difficile", '
            f'question: "{question}", '
            f"choix: [{choix}] as [string, string, string, string], bonIndex: {bon} }},"
        )

    lines.append("];")
    lines.append("")
    return "\n".join(lines)


def main() -> None:
    text = normalize_source(SOURCE.read_text(encoding="utf-8"))
    questions = parse_questions(text)
    if len(questions) != 100:
        raise SystemExit(f"Expected 100 questions, got {len(questions)}")
    nums = [q["num"] for q in questions]
    if nums != list(range(1, 101)):
        missing = set(range(1, 101)) - set(nums)
        raise SystemExit(f"Bad numbering missing={sorted(missing)}")

    OUT.write_text(render_ts(questions), encoding="utf-8")
    print(f"Wrote {len(questions)} questions to {OUT}")


if __name__ == "__main__":
    main()
