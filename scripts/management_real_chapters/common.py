# -*- coding: utf-8 -*-
"""Shared helpers for Management real-org chapter data."""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from management_real_orgs import REAL_ORGS_BY_CHAPTER  # noqa: E402

D = "\u2014 "


def I(sid: str, title: str, **body):
    return {"sid": sid, "title": title, "body": body}


def org(ch: int, index: int) -> str:
    orgs = REAL_ORGS_BY_CHAPTER[ch]
    return orgs[index] if index < len(orgs) else orgs[-1]


def sid_index(sid: str) -> int:
    if sid.startswith("e"):
        return int(sid[1:]) - 1
    if sid.startswith("cas"):
        return 10 + int(sid[3:]) - 1
    return 0
