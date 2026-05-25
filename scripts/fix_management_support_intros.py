# -*- coding: utf-8 -*-
"""Fix first-sentence org context in Management supports after rewire."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from management_real_orgs import REAL_ORGS_BY_CHAPTER  # noqa: E402

MGMT = ROOT / "src/data/management/chapters"

# Intro plausible par organisation (remplace un d\u00e9but de support incoh\u00e9rent)
INTRO: dict[str, str] = {
    "Etsy": "Etsy est une marketplace mondiale d'objets cr\u00e9atifs et vintage (7 M+ vendeurs actifs).",
    "Vinted": "Vinted est une plateforme europ\u00e9enne de mode seconde main (80 M+ utilisateurs).",
    "Amazon": "Amazon France est le leader fran\u00e7ais du e-commerce generaliste.",
    "BlaBlaCar": "BlaBlaCar est la plateforme fran\u00e7aise de covoiturage longue distance.",
    "Airbnb": "Airbnb met en relation voyageurs et h\u00f4tes pour locations courte dur\u00e9e.",
    "Booking.com": "Booking.com est un site mondial de r\u00e9servation h\u00f4teli\u00e8re.",
    "SNCF Connect": "SNCF Connect est l'application officielle de billetterie SNCF.",
    "Uber": "Uber France propose VTC, livraison repas (Uber Eats) et mobilit\u00e9.",
    "Doctolib": "Doctolib est le leader fran\u00e7ais de prise de rendez-vous m\u00e9dicaux en ligne.",
    "Stripe": "Stripe est une fintech de paiement en ligne pour sites et applications.",
    "Accor": "Accor est un groupe h\u00f4telier mondial (4 200+ h\u00f4tels, marques Ibis \u00e0 Fairmont).",
    "Michelin": "Michelin est un industriel mondial du pneumatique et des services mobilit\u00e9.",
    "Schneider Electric": "Schneider Electric est un \u00e9quipementier \u00e9lectrique et d'automation.",
    "Paul (Groupe Holder)": "Paul est un r\u00e9seau fran\u00e7ais de boulangeries-p\u00e2tisseries (750+ points de vente).",
    "McDonald's France": "McDonald's France compte plus de 1 500 restaurants et 80 000 collaborateurs.",
    "Capgemini": "Capgemini est une ESN mondiale (340 000 collaborateurs, conseil et SI).",
    "Accenture": "Accenture est un cabinet mondial de conseil et services num\u00e9riques.",
    "Atos": "Atos est une ESN europ\u00e9enne (cloud, cybers\u00e9curit\u00e9, supercalculateurs).",
    "Orange": "Orange est l'op\u00e9rateur t\u00e9l\u00e9com historique en France (La Poste Mobile absorb\u00e9).",
    "SNCF": "La SNCF est l'entreprise publique ferroviaire fran\u00e7aise.",
    "Kiabi": "Kiabi est une enseigne fran\u00e7aise de pr\u00eat-\u00e0-porter familial (500+ magasins).",
    "Decathlon": "Decathlon est le leader mondial d'articles de sport (1 700+ magasins).",
    "Cr\u00e9dit Agricole": "Le Cr\u00e9dit Agricole est le premier r\u00e9seau bancaire fran\u00e7ais.",
    "Orange Cyberdefense": "Orange Cyberdefense est la filiale cybers\u00e9curit\u00e9 du groupe Orange.",
    "CNIL": "La CNIL est l'autorit\u00e9 fran\u00e7aise de protection des donn\u00e9es personnelles.",
    "France Travail": "France Travail (ex P\u00f4le emploi) est le service public de l'emploi.",
    "Mairie de Grenoble": "La Mairie de Grenoble est une collectivit\u00e9 de 160 000 habitants.",
    "Geodis": "Geodis est un logisticien international (filiale SNCF, entrep\u00f4ts et transport).",
    "La Poste": "La Poste est l'op\u00e9rateur postal et logistique fran\u00e7ais.",
    "Renault": "Renault est un constructeur automobile fran\u00e7ais du groupe Renault.",
    "Veolia": "Veolia est un leader mondial des services \u00e0 l'environnement (eau, d\u00e9chets, \u00e9nergie).",
    "IKEA France": "IKEA France est le leader de l'ameublement en kit (10+ magasins en France).",
    "L'Or\u00e9al": "L'Or\u00e9al est le num\u00e9ro un mondial de la cosm\u00e9tique.",
    "Patagonia": "Patagonia est une marque outdoor am\u00e9ricaine engag\u00e9e pour l'environnement.",
    "Greenpeace": "Greenpeace est une ONG environnementale internationale.",
    "Biocoop": "Biocoop est un r\u00e9seau coop\u00e9ratif de magasins bio en France.",
    "Danone": "Danone est un groupe agroalimentaire fran\u00e7ais (produits laitiers, eaux, nutrition).",
    "Microsoft France": "Microsoft France d\u00e9ploie cloud Azure, Office 365 et solutions entreprises.",
    "Google France": "Google France d\u00e9veloppe services num\u00e9riques, cloud et publicit\u00e9 en ligne.",
    "Amazon Web Services": "AWS (Amazon Web Services) est le leader mondial du cloud public.",
    "ANSSI": "L'ANSSI est l'autorit\u00e9 nationale fran\u00e7aise de s\u00e9curit\u00e9 des SI.",
}


def parse_json_field(block: str, field: str) -> str | None:
    m = re.search(rf"{field}: (\"(?:\\.|[^\"\\])*\")", block, re.S)
    if not m:
        return None
    return json.loads(m.group(1))


def exercise_index(ex_id: str) -> int:
    m = re.search(r"-(e\d+|cas\d+)$", ex_id)
    if not m:
        return 0
    sid = m.group(1)
    if sid.startswith("e"):
        return int(sid[1:]) - 1
    return 10 + int(sid[3:]) - 1


def extract_exercise_id(block: str) -> str:
    m = re.search(r'id: "(mgt(\d+)-(e\d+|cas\d+))"', block)
    return m.group(1) if m else ""


def fix_support(support: str, org: str) -> str:
    if org not in INTRO:
        return support
    intro = INTRO[org]
    # Remplace la premi\u00e8re phrase (jusqu'au premier point) par l'intro canonique
    if support.startswith(org) or re.match(rf"^{re.escape(org)}[,\s]", support):
        rest = re.sub(r"^[^.]+\.\s*", "", support, count=1)
        return intro + " " + rest if rest else intro
    # Remplace aussi "En 2024-2025, Org, ..."
    m = re.match(r"^En 2024-2025,\s*" + re.escape(org) + r"[^.]*\.\s*", support)
    if m:
        return intro + " " + support[m.end() :]
    return support


def process(path: Path) -> None:
    text = path.read_text(encoding="utf-8")
    m = re.search(r"export const \w+.*? = \[", text, re.S)
    if not m:
        return
    header = text[: m.end()]
    end = text.rfind("];")
    body = text[m.end() : end]
    parts = re.split(r"\n  \{", body)
    blocks = [("" if i == 0 else "  {") + p for i, p in enumerate(parts) if p.strip()]
    ch_m = re.search(r"mgt(\d+)-", text)
    ch = int(ch_m.group(1)) if ch_m else 0
    orgs = REAL_ORGS_BY_CHAPTER.get(ch, [])
    out_blocks = []
    for block in blocks:
        ex_id = extract_exercise_id(block)
        if not ex_id:
            continue
        idx = exercise_index(ex_id)
        org = orgs[idx] if idx < len(orgs) else ""
        support = parse_json_field(block, "support")
        if support and org:
            new_support = fix_support(support, org)
            if new_support != support:
                block = block.replace(
                    "support: " + json.dumps(support, ensure_ascii=True),
                    "support: " + json.dumps(new_support, ensure_ascii=True),
                )
        out_blocks.append(block)
    path.write_text(header + "\n" + "\n".join(out_blocks) + "\n];\n", encoding="utf-8")
    print("fixed", path.name)


def main():
    for ch in range(1, 16):
        p = MGMT / f"chap{ch}.ts"
        if p.exists():
            process(p)


if __name__ == "__main__":
    main()
