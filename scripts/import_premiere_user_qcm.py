#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Importe scripts/premiere-qcm-user-raw.txt -> premiere-qcm-source.txt puis build TS."""

from __future__ import annotations

import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "scripts" / "premiere-qcm-user-raw.txt"
SOURCE = ROOT / "scripts" / "premiere-qcm-source.txt"
BUILD = ROOT / "scripts" / "build_premiere_qcm.py"


def main() -> None:
    if not RAW.is_file():
        raise SystemExit(f"Missing {RAW}")

    from build_premiere_qcm import normalize_source

    text = normalize_source(RAW.read_text(encoding="utf-8"))
    SOURCE.write_text(text, encoding="utf-8")
    print(f"Wrote {SOURCE}")

    subprocess.run([sys.executable, str(BUILD)], cwd=str(ROOT), check=True)


if __name__ == "__main__":
    main()
