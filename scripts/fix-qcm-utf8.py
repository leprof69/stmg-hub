# -*- coding: utf-8 -*-
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
FILES = [
    ROOT / "src/data/sdgn/sdgnMissionQcmBank.ts",
    ROOT / "scripts/duelQcmBank.legacy.ts",
]

REPLACEMENTS = [
    ("\u251c\u00ae", "\u00e9"),
    ("\u251c\u00a9", "\u00e9"),
    ("\u251c\u00bf", "\u00e8"),
    ("\u251c\u00a8", "\u00e8"),
    ("\u251c\u00a0", "\u00e0"),
    ("\u251c\u00b0", "\u00b0"),
    ("\u251c\u00a7", "\u00e7"),
    ("\u251c\u00ab", "\u00ab"),
    ("\u251c\u00bb", "\u00bb"),
    ("\u251c\u2019", "\u2019"),
    ("\u251c\u00c9", "\u00c9"),
    ("\u251c\u00ea", "\u00ea"),
    ("\u251c\u00e9", "\u00e9"),
    ("\u251c\u00e8", "\u00e8"),
    ("\u251c\u00e0", "\u00e0"),
    ("\u251c\u00f4", "\u00f4"),
    ("\u251c\u00ee", "\u00ee"),
    ("\u251c\u00e2", "\u00e2"),
    ("\u251c\u00fb", "\u00fb"),
    ("\u00e2\u20ac\u2122", "\u2019"),
    ("\u00e2\u20ac\u0153", "\u0153"),
    ("\u00e2\u20ac", "\u20ac"),
    ("\u00c3\u00a9", "\u00e9"),
    ("\u00c3\u00a8", "\u00e8"),
    ("\u00c3\u00a0", "\u00e0"),
    ("\u00c3\u00b4", "\u00f4"),
    ("\u00c3\u00ae", "\u00ee"),
    ("\u00c3\u00ab", "\u00eb"),
    ("\u00c3\u00a7", "\u00e7"),
    ("\u00c3\u0089", "\u00c9"),
    ("\u251c\u00e1", "\u00e0"),
    ("\u251c\u00ac", "\u00ea"),
    ("\u251c\u2524", "\u00f4"),
    ("\u251c\u00eb", "\u00c9"),
    ("\u251c\u00f3", "\u00f4"),
    ("rel\u00efve", "rel\u00e8ve"),
    ("acc\u00efs", "acc\u00e8s"),
    ("si\u00efge", "si\u00e8ge"),
    ("th\u00efme", "th\u00e8me"),
    ("r\u00efgle", "r\u00e8gle"),
    ("apr\u00efs", "apr\u00e8s"),
    ("mod\u00efles", "mod\u00e8les"),
    ("concern\u00e9r", "concerner"),
]

MOJI_MARK = "\u251c"


def fix_text(text: str) -> str:
    for bad, good in REPLACEMENTS:
        text = text.replace(bad, good)
    return text


def main():
    for path in FILES:
        raw = path.read_text(encoding="utf-8")
        fixed = fix_text(raw)
        path.write_text(fixed, encoding="utf-8")
        print(path.relative_to(ROOT), "box:", fixed.count(MOJI_MARK))


if __name__ == "__main__":
    main()
