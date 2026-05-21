# -*- coding: utf-8 -*-
"""Convertit les dossiers Theme 4 MD en PDF (UTF-8)."""
from __future__ import annotations

from io import BytesIO
from pathlib import Path

import markdown
from xhtml2pdf import pisa

ROOT = Path(__file__).resolve().parents[1]
EXPORTS = ROOT / "exports"

CSS = """
@page {
  size: A4;
  margin: 1.8cm 1.6cm;
}
body {
  font-family: Helvetica, Arial, sans-serif;
  font-size: 10.5pt;
  line-height: 1.45;
  color: #1a1a1a;
}
h1 {
  font-size: 18pt;
  color: #0f3d5c;
  border-bottom: 2px solid #0f3d5c;
  padding-bottom: 6px;
  margin-top: 0;
}
h2 {
  font-size: 14pt;
  color: #145374;
  margin-top: 18px;
  page-break-after: avoid;
}
h3 {
  font-size: 11.5pt;
  color: #1f6b8f;
  margin-top: 14px;
  page-break-after: avoid;
}
p, li { margin: 0 0 6px 0; }
ul, ol { margin: 6px 0 10px 18px; }
blockquote {
  margin: 10px 0;
  padding: 8px 12px;
  background: #f3f8fb;
  border-left: 4px solid #1f6b8f;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin: 10px 0 14px 0;
  font-size: 9.5pt;
}
th, td {
  border: 1px solid #b8c9d4;
  padding: 5px 6px;
  vertical-align: top;
}
th {
  background: #e8f1f6;
  font-weight: bold;
}
code, pre {
  font-family: Courier, monospace;
  font-size: 9pt;
}
pre {
  background: #f5f5f5;
  border: 1px solid #ddd;
  padding: 8px;
  white-space: pre-wrap;
}
hr {
  border: none;
  border-top: 1px solid #ccd6dd;
  margin: 14px 0;
}
strong { color: #123047; }
"""


def read_md(path: Path) -> str:
    try:
        text = path.read_text(encoding="utf-8")
    except UnicodeDecodeError:
        text = path.read_text(encoding="latin-1")
    path.write_text(text, encoding="utf-8")
    return text


def md_to_pdf(md_path: Path, pdf_path: Path) -> None:
    text = read_md(md_path)
    body = markdown.markdown(
        text,
        extensions=["tables", "fenced_code", "nl2br", "sane_lists"],
    )
    html = f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>{md_path.stem}</title>
  <style>{CSS}</style>
</head>
<body>{body}</body>
</html>"""

    with pdf_path.open("wb") as out:
        status = pisa.CreatePDF(html, dest=out, encoding="utf-8")
    if status.err:
        raise RuntimeError(f"Erreur PDF pour {md_path.name}")


def main() -> None:
    pairs = [
        ("SDGN_Theme4_Sequence_ELEVE.md", "SDGN_Theme4_Sequence_ELEVE.pdf"),
        ("SDGN_Theme4_Sequence_PROF.md", "SDGN_Theme4_Sequence_PROF.pdf"),
    ]
    for md_name, pdf_name in pairs:
        md_path = EXPORTS / md_name
        pdf_path = EXPORTS / pdf_name
        md_to_pdf(md_path, pdf_path)
        print(f"OK  {pdf_path}  ({pdf_path.stat().st_size // 1024} Ko)")


if __name__ == "__main__":
    main()
