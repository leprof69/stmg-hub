# -*- coding: utf-8 -*-
"""Shared helpers for Missions exercise enrichment."""
from __future__ import annotations

import re
import unicodedata

GENERIC_CONSIGNE_PATTERNS = (
    r"^R\u00e9ponds aux questions dans l'ordre",
    r"^R\u00e9ponds aux trois questions",
    r"^R\u00e9ponds en t'appuyant sur le cours et sur le support\.?$",
    r"^Appuie-toi sur l'extrait et sur ton cours",
    r"^D\u00e9finis et illustre bri\u00e8vement\.?$",
    r"^Pour chaque famille d'outils",
)


def fix_correction_text(text: str) -> str:
    if not text:
        return text
    out = text
    out = re.sub(
        r"Prix de vente \? Co[u\u00fb]t \(d'achat ou de revient\) = Marge",
        "Prix de vente \u2212 co\u00fbt (d'achat ou de revient) = marge commerciale",
        out,
        flags=re.I,
    )
    out = re.sub(
        r"(\d[\d,]*)\s*/\s*0,85\s*(?:x|\u00d7)\s*100\s*(?:\u2212|-)\s*(\d+\s*%)",
        lambda m: f"{m.group(1)} / 0,85 \u00d7 100 \u2248 {m.group(2)}",
        out,
    )
    out = re.sub(
        r"avantage concurrentiel fort \? marge unitaire",
        "avantage concurrentiel : marge unitaire",
        out,
        flags=re.I,
    )
    out = re.sub(r"\?\s*marge unitaire", ": marge unitaire", out, flags=re.I)
    return out


def is_generic_consigne(consigne: str) -> bool:
    c = consigne.strip()
    return any(re.search(p, c, re.I) for p in GENERIC_CONSIGNE_PATTERNS)


def improve_consigne(consigne: str, title: str, notions: list[str]) -> str:
    if not is_generic_consigne(consigne):
        return consigne.strip()
    notion_txt = " et ".join(notions[:2]) if notions else "les notions du chapitre"
    return (
        f"\u00c0 partir du document, mobilise {notion_txt} pour r\u00e9pondre aux questions "
        f"(\u00ab {title} \u00bb)."
    )


def notions_from_attendu(attendu: str, max_n: int = 3) -> list[str]:
    if not attendu:
        return []
    parts = re.split(r"[,;\u00b7]", attendu)
    out: list[str] = []
    for part in parts:
        p = part.strip()
        if len(p) < 4 or len(p) > 42:
            continue
        p = re.sub(r"^(d\u00e9finition|calcul|distinction|articulation|identification)\s+", "", p, flags=re.I)
        if p and p not in out:
            out.append(p[:42])
        if len(out) >= max_n:
            break
    return out


def strip_accents(value: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", value) if unicodedata.category(c) != "Mn"
    ).lower()


def replace_org_in_text(text: str, old: str, new: str) -> str:
    if not text or old == new:
        return text
    return text.replace(old, new)
