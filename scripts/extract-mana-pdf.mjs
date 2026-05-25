/** Extract first pages text from mana term PDFs for chapter mapping */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const DIR = "c:/Users/BUREAU/Desktop/mana term";
const OUT = "c:/Users/BUREAU/Desktop/stmg-hub/scripts/mana-pdf-extract.txt";

const py = `
import sys
from pathlib import Path
try:
    from pypdf import PdfReader
except ImportError:
    print("NO_PYPDF")
    sys.exit(1)

folder = Path(r"${DIR.replace(/\\/g, "/")}")
out_lines = []
for pdf in sorted(folder.glob("*.pdf")):
    out_lines.append("\\n" + "=" * 80)
    out_lines.append("FILE: " + pdf.name)
    out_lines.append("=" * 80)
    try:
        r = PdfReader(str(pdf))
        n = len(r.pages)
        out_lines.append(f"PAGES: {n}")
        for i in range(min(4, n)):
            t = r.pages[i].extract_text() or ""
            out_lines.append(f"--- page {i+1} ---")
            out_lines.append(t[:3500])
    except Exception as e:
        out_lines.append("ERROR: " + str(e))

Path(r"${OUT.replace(/\\/g, "/")}").write_text("\\n".join(out_lines), encoding="utf-8")
print("OK", len(list(folder.glob("*.pdf"))), "files")
`;

const r = spawnSync("python", ["-c", py], { encoding: "utf-8", maxBuffer: 50 * 1024 * 1024 });
console.log(r.stdout || r.stderr);
if (r.status !== 0) process.exit(r.status);
