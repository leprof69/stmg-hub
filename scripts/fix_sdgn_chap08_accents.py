# -*- coding: utf-8 -*-
"""Second-pass French accents for SDGN chapter 8 (word-boundary safe)."""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CHAP08 = ROOT / "scripts/sdgn_enrich/chap08.py"

PHRASES: list[tuple[str, str]] = [
    ("A partir", "\u00c0 partir"),
    ("a la bascule", "\u00e0 la bascule"),
    ("a condition", "\u00e0 condition"),
    ("a Internet", "\u00e0 Internet"),
    ("a ete ", "a \u00e9t\u00e9 "),
    ("a completer", "\u00e0 compl\u00e9ter"),
    ("temps reel", "temps r\u00e9el"),
    ("regles d'emission", "r\u00e8gles d'\u00e9mission"),
    ("rigidite des", "rigidit\u00e9 des"),
    ("Definition du", "D\u00e9finition du"),
    ("Definition PGI", "D\u00e9finition PGI"),
    ("Definition complete", "D\u00e9finition compl\u00e8te"),
    ("Definition enchere", "D\u00e9finition ench\u00e8re"),
    ("Complete le", "Compl\u00e8te le"),
    ("Elements chez", "\u00c9l\u00e9ments chez"),
    ("Interet du", "Int\u00e9r\u00eat du"),
    ("Role des", "R\u00f4le des"),
    ("Duree longue", "Dur\u00e9e longue"),
    ("Cout eleve", "Co\u00fbt \u00e9lev\u00e9"),
    ("Donnees saisies", "Donn\u00e9es saisies"),
    ("systeme d'information", "syst\u00e8me d'information"),
    ("efficacite administrative", "efficacit\u00e9 administrative"),
    ("efficacite, coherence", "efficacit\u00e9, coh\u00e9rence"),
    ("installe en reseau", "install\u00e9 en r\u00e9seau"),
    ("integre regroupe", "int\u00e9gr\u00e9 regroupe"),
    ("solutions realistes", "solutions r\u00e9alistes"),
    ("modelisation SI", "mod\u00e9lisation SI"),
    ("modelisation (", "mod\u00e9lisation ("),
    ("acc\u00e8ssible", "accessible"),
    ("pr\u00e9lev\u00e9 une", "pr\u00e9l\u00e8ve une"),
    ("s\u00e9curis\u00e9nt", "s\u00e9curisent"),
    ("r\u00e9alis\u00e9 38", "r\u00e9alise 38"),
    ("r\u00e9alis\u00e9r ", "r\u00e9aliser "),
    ("periode transitoire", "p\u00e9riode transitoire"),
    ("acceptee", "accept\u00e9e"),
    ("isoles ?", "isol\u00e9s ?"),
    ("pret ?", "pr\u00eat ?"),
    ("emise", "\u00e9mise"),
    ("expedie", "exp\u00e9di\u00e9"),
    ("commandee", "command\u00e9e"),
    ("automatisee", "automatis\u00e9e"),
    ("fusionnees", "fusionn\u00e9es"),
    ("etre fusionnees", "\u00eatre fusionn\u00e9es"),
    ("etre automatisee", "\u00eatre automatis\u00e9e"),
    ("etre mobiles", "\u00eatre mobiles"),
    ("siege parisien", "si\u00e8ge parisien"),
    ("au siege", "au si\u00e8ge"),
    ("encheres ", "ench\u00e8res "),
    ("enchere ", "ench\u00e8re "),
    ("acquereur", "acqu\u00e9reur"),
    ("marche par", "march\u00e9 par"),
    ("site de marche", "site de march\u00e9"),
    ("controle qualite", "contr\u00f4le qualit\u00e9"),
    ("dependance au", "d\u00e9pendance au"),
    ("difference, une", "diff\u00e9rence, une"),
    ("Difference :", "Diff\u00e9rence :"),
    ("mobilite transforme", "mobilit\u00e9 transforme"),
    ("Mobilite :", "Mobilit\u00e9 :"),
    ("chaudiere,", "chaudi\u00e8re,"),
    ("adopte une", "adopt\u00e9 une"),
    ("resistance atelier", "r\u00e9sistance atelier"),
    ("Resistance humaine", "R\u00e9sistance humaine"),
    ("preparer colis", "pr\u00e9parer colis"),
    ("Declencheur :", "D\u00e9clencheur :"),
    ("Regles :", "R\u00e8gles :"),
    ("type d'element", "type d'\u00e9l\u00e9ment"),
    ("precis dans", "pr\u00e9cis dans"),
    ("precis,", "pr\u00e9cis,"),
    ("exploite,", "exploit\u00e9,"),
    ("operations)", "op\u00e9rations)"),
    ("operations ", "op\u00e9rations "),
    ("complementaires", "compl\u00e9mentaires"),
    ("appartenant a ", "appartenant \u00e0 "),
    ("differents services", "diff\u00e9rents services"),
    ("apres validation", "apr\u00e8s validation"),
    ("accelere le", "acc\u00e9l\u00e8re le"),
    ("partage.", "partag\u00e9."),
    ("param\u00e8trer", "param\u00e9trer"),
    ("formalis\u00e9 le", "formalise le"),
]

BOUNDARY: list[tuple[str, str]] = [
    (r"\brole\b", "r\u00f4le"),
    (r"\bRole\b", "R\u00f4le"),
    (r"\broles\b", "r\u00f4les"),
    (r"\bgenere\b", "g\u00e9n\u00e8re"),
    (r"\bapres\b", "apr\u00e8s"),
    (r"\baccelere\b", "acc\u00e9l\u00e8re"),
    (r"\breduit\b", "r\u00e9duit"),
    (r"\bdeclenche\b", "d\u00e9clenche"),
    (r"\bprecede\b", "pr\u00e9c\u00e8de"),
    (r"\bpreparer\b", "pr\u00e9parer"),
    (r"\bpret\b", "pr\u00eat"),
    (r"\belement\b", "\u00e9l\u00e9ment"),
    (r"\bElement\b", "\u00c9l\u00e9ment"),
    (r"\bregle\b", "r\u00e8gle"),
    (r"\bRegle\b", "R\u00e8gle"),
    (r"\bregles\b", "r\u00e8gles"),
    (r"\bRegles\b", "R\u00e8gles"),
    (r"\bemission\b", "\u00e9mission"),
    (r"\bcoherence\b", "coh\u00e9rence"),
    (r"\befficacite\b", "efficacit\u00e9"),
    (r"\bcontrole\b", "contr\u00f4le"),
    (r"\bqualite\b", "qualit\u00e9"),
    (r"\bdependance\b", "d\u00e9pendance"),
    (r"\bdifference\b", "diff\u00e9rence"),
    (r"\bDifference\b", "Diff\u00e9rence"),
    (r"\bmobilite\b", "mobilit\u00e9"),
    (r"\bMobilite\b", "Mobilit\u00e9"),
    (r"\bchaudiere\b", "chaudi\u00e8re"),
    (r"\bperiode\b", "p\u00e9riode"),
    (r"\bisoles\b", "isol\u00e9s"),
    (r"\bsiege\b", "si\u00e8ge"),
    (r"\betre\b", "\u00eatre"),
    (r"\bmarche\b", "march\u00e9"),
    (r"\bencheres\b", "ench\u00e8res"),
    (r"\benchere\b", "ench\u00e8re"),
]


def fix_text(text: str) -> str:
    for old, new in PHRASES:
        text = text.replace(old, new)
    for pat, repl in BOUNDARY:
        text = re.sub(pat, repl, text)
    return text


def main() -> None:
    raw = CHAP08.read_text(encoding="utf-8")
    updated = fix_text(raw)
    if updated != raw:
        CHAP08.write_text(updated, encoding="utf-8")
        print("updated", CHAP08.name)
    subprocess.run(
        [sys.executable, str(ROOT / "scripts/sdgn_enrich/build_ts.py")],
        check=True,
    )


if __name__ == "__main__":
    main()
