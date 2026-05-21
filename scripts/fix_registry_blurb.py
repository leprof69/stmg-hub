# -*- coding: utf-8 -*-
from pathlib import Path

p = Path(__file__).resolve().parents[1] / "src/data/sdgn/registry.ts"
text = p.read_text(encoding="utf-8")
old = "export function getSdgnChapterBlurb(chapter: SdgnMissionChapter): string {"
if old not in text:
    raise SystemExit("blurb function not found")
start = text.index(old)
end = text.index("}", start) + 1
new_fn = """export function getSdgnChapterBlurb(chapter: SdgnMissionChapter): string {
  return `Pack complet : 10 exercices progressifs + 2 etudes de cas - ${SDGN_CHAPTER_LABELS[chapter]}.`;
}"""
text = text[:start] + new_fn + text[end:]
p.write_text(text, encoding="utf-8")
print("fixed")
