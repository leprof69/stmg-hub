# -*- coding: utf-8 -*-
"""Restore correctionIA.ts as UTF-8 from git blob (latin-1/cp1252)."""
import subprocess
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / "src/services/correctionIA.ts"
raw = subprocess.run(
    ["git", "show", "HEAD:src/services/correctionIA.ts"],
    capture_output=True,
    check=True,
).stdout

text = None
for enc in ("utf-8", "latin-1", "cp1252"):
    try:
        text = raw.decode(enc)
        if "\ufffd" not in text:
            break
    except UnicodeDecodeError:
        continue
if text is None:
    text = raw.decode("latin-1")

needle = "  correctionModele?: string;\n"
insert = (
    "  correctionModele?: string;\n"
    "  referentielNotions?: string[];\n"
    "  referentielCompetences?: string[];\n"
)
if "referentielNotions" not in text:
    text = text.replace(needle, insert, 1)

old_corpus = "    ex.correctionModele || \"\",\n  ]"
new_corpus = (
    "    ex.correctionModele || \"\",\n"
    "    (ex.referentielNotions || []).join(\" \"),\n"
    "    (ex.referentielCompetences || []).join(\" \"),\n"
    "  ]"
)
if "referentielNotions" not in text.split("buildExerciseKeywordCorpus")[1][:500]:
    text = text.replace(old_corpus, new_corpus, 1)

marker = "Questions : ${(exercise.questions || []).join(\" | \")}\n"
if marker in text and "referentielNotions" not in text[text.index(marker) : text.index(marker) + 200]:
    text = text.replace(
        marker,
        marker
        + "Notions referentiel chapitre : ${(exercise.referentielNotions || []).join(\" | \") || \"-\"}\n"
        + "Competences attendues : ${(exercise.referentielCompetences || []).join(\" | \") || \"-\"}\n",
        1,
    )

TARGET.write_text(text, encoding="utf-8")
print("wrote", TARGET, "chars", len(text), "fffd", text.count("\ufffd"))
