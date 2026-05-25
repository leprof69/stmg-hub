# -*- coding: utf-8 -*-
"""Shared enrichment helpers for Management mission exercises (graduated difficulty)."""

D = "\u2014 "


def sid_tier(sid: str) -> str:
    if sid.startswith("cas"):
        return "cas"
    if sid in ("e1", "e2", "e3"):
        return "facile"
    if sid in ("e4", "e5", "e6", "e7"):
        return "moyen"
    return "difficile"


def enrich_consigne(consigne: str, _attendu: str = "", sid: str = "") -> str:
    """Keep consignes short and readable; no appended criteria block."""
    return consigne.strip()


def parse_sections(corr: str):
    import re

    chunks = re.split(r"\n\n(?=\d+\))", corr.strip())
    sections = []
    for chunk in chunks:
        m = re.match(r"(\d+\))\s*(.+?):\s*\n?(.*)", chunk, re.S)
        if m:
            sections.append((m.group(1), m.group(2).strip(), m.group(3).strip()))
        else:
            sections.append(("", chunk.strip(), ""))
    return sections


def _lines_to_bullets(body: str):
    bullets = []
    for line in body.split("\n"):
        line = line.strip()
        if not line:
            continue
        if line.startswith("- ") or line.startswith("\u2014 ") or line.startswith("* "):
            bullets.append(line.lstrip("-*\u2014 ").strip())
        else:
            for sent in line.replace("\n", " ").split(". "):
                s = sent.strip()
                if s:
                    if not s.endswith("."):
                        s += "."
                    bullets.append(s)
    return bullets


def _intro_redundant(intro: str, base: str) -> bool:
    if not intro or not base:
        return False
    probe = intro[:72].strip()
    return probe and probe in base


def enrich_support(
    ch: int,
    sid: str,
    base: str,
    *,
    intro: str,
    context: dict,
    quotes: dict,
    impact: dict,
) -> str:
    """Graduated support length: facile = base only; complexity rises with exercise index."""
    key = (ch, sid)
    tier = sid_tier(sid)
    ctx = context.get(key, "").strip()
    imp = impact.get(key, "").strip()
    b = base.strip()

    if tier == "facile":
        return b

    if tier == "moyen":
        return " ".join(p for p in [ctx, b] if p)

    if tier == "difficile":
        return " ".join(p for p in [ctx, b, imp] if p)

    # cas : fil rouge + situation, sans citation ni double intro
    intro_use = "" if _intro_redundant(intro, b) else intro.strip()
    return " ".join(p for p in [intro_use, ctx, b, imp] if p)


def enrich_correction(
    ch: int,
    sid: str,
    corr: str,
    attendu: str,
    notions: list,
    *,
    corr_extra=None,
    min_len=None,
) -> str:
    tier = sid_tier(sid)
    if min_len is None:
        min_len = {"facile": 10_000, "moyen": 10_000, "difficile": 900, "cas": 750}.get(tier, 10_000)

    key = (ch, sid)
    extras = (corr_extra or {}).get(key, [])
    sections = parse_sections(corr)
    out = []
    for i, (num, title, body) in enumerate(sections):
        header = f"{num} {title} :" if num else title
        lines = [header]
        for b in _lines_to_bullets(body):
            lines.append(f"{D}{b}")
        if tier in ("difficile", "cas") and i < len(extras):
            _, bullets = extras[i]
            for b in bullets:
                lines.append(f"{D}{b}")
        out.append("\n".join(lines))

    text = "\n\n".join(out)
    if tier in ("difficile", "cas") and notions and len(text) < min_len:
        nnum = len(sections) + 1
        synth = [f"{nnum}) Pour aller plus loin :"]
        synth.append(
            f"{D}Relier au moins une notion du cours ({notions[0]}) \u00e0 un rep\u00e8re pr\u00e9cis du support."
        )
        if attendu:
            synth.append(f"{D}Attendu en copie : {attendu}")
        out.append("\n".join(synth))
        text = "\n\n".join(out)

    return text.strip()
