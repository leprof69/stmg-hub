# -*- coding: utf-8 -*-
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[1] / "src/data/management/chapters"
for ch in range(1, 16):
    t = (root / f"chap{ch}.ts").read_text(encoding="utf-8")
    supports = [json.loads(m.group(1)) for m in re.finditer(r'support: ("(?:\\.|[^"\\])*")', t)]
    corrs = [json.loads(m.group(1)) for m in re.finditer(r'correctionModele: ("(?:\\.|[^"\\])*")', t)]
    generic = len(re.findall(r"D\u00e9finis .+ en t'appuyant sur le cours", t))
    generic2 = "d\u00e9finition conforme" in t or "conforme au r\u00e9f\u00e9rentiel" in t
    avg_s = sum(len(s) for s in supports) // max(1, len(supports))
    avg_c = sum(len(c) for c in corrs) // max(1, len(corrs))
    print(
        f"ch{ch:2d}: sup avg={avg_s:4d} min={min(map(len, supports)) if supports else 0:4d} "
        f"| corr avg={avg_c:4d} | generic_def={generic} | template_corr={generic2}"
    )
