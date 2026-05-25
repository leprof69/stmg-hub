# -*- coding: utf-8 -*-
"""Fix euro symbols and common missing accents (SDGN ch.8, Management sources)."""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

EURO_BAD = re.compile(r"\\u0080|\\u00a4|\u0080|\u00a4")

ACCENT_REPLACEMENTS: list[tuple[str, str]] = [
    ("Etude de cas", "\u00c9tude de cas"),
    ("choix numeriques", "choix num\u00e9riques"),
    ("deploiement PGI", "d\u00e9ploiement PGI"),
    ("evenements-resultats", "\u00e9v\u00e9nements-r\u00e9sultats"),
    ("evenement-resultat", "\u00e9v\u00e9nement-r\u00e9sultat"),
    ("Evenement-resultat", "\u00c9v\u00e9nement-r\u00e9sultat"),
    ("evenement declencheur", "\u00e9v\u00e9nement d\u00e9clencheur"),
    ("Evenement declencheur", "\u00c9v\u00e9nement d\u00e9clencheur"),
    ("mise en oeuvre", "mise en \u0153uvre"),
    ("donnees personnelles", "donn\u00e9es personnelles"),
    ("donnees clients", "donn\u00e9es clients"),
    ("donnees ouvertes", "donn\u00e9es ouvertes"),
    ("donnees a caractere", "donn\u00e9es \u00e0 caract\u00e8re"),
    ("donnees GPS", "donn\u00e9es GPS"),
    ("technologies numeriques", "technologies num\u00e9riques"),
    ("usages numeriques", "usages num\u00e9riques"),
    ("le numerique", "le num\u00e9rique"),
    ("du numerique", "du num\u00e9rique"),
    ("au numerique", "au num\u00e9rique"),
    ("formation numerique", "formation num\u00e9rique"),
    ("Reperer", "Rep\u00e9rer"),
    ("Evaluer", "\u00c9valuer"),
    ("Receptionner", "R\u00e9ceptionner"),
    ("receptionner", "r\u00e9ceptionner"),
    ("numeriques", "num\u00e9riques"),
    ("numerique", "num\u00e9rique"),
    ("Numerique", "Num\u00e9rique"),
    ("teletravail", "t\u00e9l\u00e9travail"),
    ("Teletravail", "T\u00e9l\u00e9travail"),
    ("deploiement", "d\u00e9ploiement"),
    ("definis", "d\u00e9finis"),
    ("Definis", "D\u00e9finis"),
    ("definie", "d\u00e9finie"),
    ("definies", "d\u00e9finies"),
    ("represente", "repr\u00e9sente"),
    ("Represente", "Repr\u00e9sente"),
    ("representant", "repr\u00e9sentant"),
    ("reponse", "r\u00e9ponse"),
    ("evenement", "\u00e9v\u00e9nement"),
    ("Evenement", "\u00c9v\u00e9nement"),
    ("evenements", "\u00e9v\u00e9nements"),
    ("resultat", "r\u00e9sultat"),
    ("Resultat", "R\u00e9sultat"),
    ("resultats", "r\u00e9sultats"),
    ("activites", "activit\u00e9s"),
    ("activite", "activit\u00e9"),
    ("Activite", "Activit\u00e9"),
    ("schema", "sch\u00e9ma"),
    ("Schema", "Sch\u00e9ma"),
    ("schemas", "sch\u00e9mas"),
    ("reapprovisionnement", "r\u00e9approvisionnement"),
    ("detecte", "d\u00e9tect\u00e9"),
    ("validee", "valid\u00e9e"),
    ("refusee", "refus\u00e9e"),
    ("realise", "r\u00e9alis\u00e9"),
    ("realiser", "r\u00e9aliser"),
    ("parametrage", "param\u00e9trage"),
    ("parametre", "param\u00e8tre"),
    ("regionale", "r\u00e9gionale"),
    ("credit", "cr\u00e9dit"),
    ("ecrans", "\u00e9crans"),
    ("etapes", "\u00e9tapes"),
    ("donnees", "donn\u00e9es"),
    ("determine", "d\u00e9termine"),
    ("piece", "pi\u00e8ce"),
    ("pieces", "pi\u00e8ces"),
    ("delai", "d\u00e9lai"),
    ("delais", "d\u00e9lais"),
    ("flexibilite", "flexibilit\u00e9"),
    ("metiers", "m\u00e9tiers"),
    ("metier", "m\u00e9tier"),
    ("deploie", "d\u00e9ploie"),
    ("integrer", "int\u00e9grer"),
    ("Integrer", "Int\u00e9grer"),
    ("comptabilite", "comptabilit\u00e9"),
    ("hebergee", "h\u00e9berg\u00e9e"),
    ("heberge", "h\u00e9berge"),
    ("securise", "s\u00e9curis\u00e9"),
    ("securite", "s\u00e9curit\u00e9"),
    ("accede", "acc\u00e8de"),
    ("acces", "acc\u00e8s"),
    ("necessaires", "n\u00e9cessaires"),
    ("necessitant", "n\u00e9cessitant"),
    ("creation", "cr\u00e9ation"),
    ("cout", "co\u00fbt"),
    ("couts", "co\u00fbts"),
    ("eleve", "\u00e9lev\u00e9"),
    ("elevee", "\u00e9lev\u00e9e"),
    ("reorganise", "r\u00e9organise"),
    ("reorganisation", "r\u00e9organisation"),
    ("Presente", "Pr\u00e9sente"),
    ("Precise", "Pr\u00e9cise"),
    ("cloture", "cl\u00f4ture"),
    ("preleve", "pr\u00e9l\u00e8ve"),
    ("deroule", "d\u00e9roule"),
    ("creativite", "cr\u00e9ativit\u00e9"),
    ("attractivite", "attractivit\u00e9"),
    ("equipements", "\u00e9quipements"),
    ("equipes", "\u00e9quipes"),
    ("homologues", "homologu\u00e9s"),
    ("gerer", "g\u00e9rer"),
    ("evite", "\u00e9vite"),
    ("materiel", "mat\u00e9riel"),
    ("salaries", "salari\u00e9s"),
    ("tracabilite", "tra\u00e7abilit\u00e9"),
    ("generalise", "g\u00e9n\u00e9ralis\u00e9"),
    ("comite", "comit\u00e9"),
    ("detachees", "d\u00e9tach\u00e9es"),
    ("preparation", "pr\u00e9paration"),
    ("expedition", "exp\u00e9dition"),
    ("formalise", "formalis\u00e9"),
    ("enchainement", "encha\u00eenement"),
    ("enchainements", "encha\u00eenements"),
    ("reflexion", "r\u00e9flexion"),
    ("inefficacite", "inefficacit\u00e9"),
    ("securisation", "s\u00e9curisation"),
    ("connecte", "connect\u00e9"),
    ("depasse", "d\u00e9passe"),
    ("resistencent", "r\u00e9sistent"),
    ("duree", "dur\u00e9e"),
    ("etude", "\u00e9tude"),
    ("reduire", "r\u00e9duire"),
    ("executent", "ex\u00e9cutent"),
    ("manoeuvre", "man\u0153uvre"),
    ("meme si", "m\u00eame si"),
    ("meme PGI", "m\u00eame PGI"),
    ("meme transaction", "m\u00eame transaction"),
    ("meme logiciel", "m\u00eame logiciel"),
    ("meme famille", "m\u00eame famille"),
    ("meme support", "m\u00eame support"),
    ("creer", "cr\u00e9er"),
    ("creent", "cr\u00e9ent"),
    ("equilibree", "\u00e9quilibr\u00e9e"),
    ("equipe", "\u00e9quipe"),
    ("dediees", "d\u00e9di\u00e9es"),
    ("depenses", "d\u00e9penses"),
    ("categorisation", "cat\u00e9gorisation"),
    ("quantites", "quantit\u00e9s"),
    ("operateur", "op\u00e9rateur"),
    ("operationnelles", "op\u00e9rationnelles"),
    ("operationnelle", "op\u00e9rationnelle"),
    (" a ete ", " a \u00e9t\u00e9 "),
    (" a jour", " \u00e0 jour"),
    (" a domicile", " \u00e0 domicile"),
    (" a distance", " \u00e0 distance"),
    (" a renforcer", " \u00e0 renforcer"),
    (" a caractere", " \u00e0 caract\u00e8re"),
    (" a prendre", " \u00e0 prendre"),
    (" a l'aise", " \u00e0 l'aise"),
    (" a completer", " \u00e0 compl\u00e9ter"),
    ("(?20 %", "(\u221220 %"),
    ("?20 %", "\u221220 %"),
    ("percue", "per\u00e7ue"),
    ("percu", "per\u00e7u"),
    ("aupres", "aupr\u00e8s"),
]


def apply_accents(text: str) -> str:
    for old, new in ACCENT_REPLACEMENTS:
        text = text.replace(old, new)
    return text


def fix_file(path: Path, *, accents: bool) -> bool:
    raw = path.read_text(encoding="utf-8")
    updated = EURO_BAD.sub(r"\\u20ac" if path.suffix == ".ts" else "\u20ac", raw)
    if accents:
        updated = apply_accents(updated)
    if updated != raw:
        path.write_text(updated, encoding="utf-8")
        print("fixed", path.relative_to(ROOT))
        return True
    return False


def main() -> None:
    changed = False

    for p in (ROOT / "scripts/management_real_chapters").glob("ch*_data.py"):
        changed |= fix_file(p, accents=False)

    sdgn8 = ROOT / "scripts/sdgn_enrich/chap08.py"
    if sdgn8.exists():
        changed |= fix_file(sdgn8, accents=True)

    ref = ROOT / "src/data/sdgn/chapterReferential.ts"
    if ref.exists():
        changed |= fix_file(ref, accents=True)

    mgmt_reg = ROOT / "src/data/management/registry.ts"
    if mgmt_reg.exists():
        text = mgmt_reg.read_text(encoding="utf-8")
        new = text.replace("2 \\u00e9tudes de cas", "2 \u00e9tudes de cas")
        if new != text:
            mgmt_reg.write_text(new, encoding="utf-8")
            print("fixed", mgmt_reg.relative_to(ROOT))
            changed = True

    if changed:
        subprocess.run([sys.executable, str(ROOT / "scripts/build_management_real_all.py")], check=True)
        subprocess.run([sys.executable, str(ROOT / "scripts/sdgn_enrich/build_ts.py")], check=True)
    else:
        print("no source changes; rebuilding anyway")
        subprocess.run([sys.executable, str(ROOT / "scripts/build_management_real_all.py")], check=True)
        subprocess.run([sys.executable, str(ROOT / "scripts/sdgn_enrich/build_ts.py")], check=True)


if __name__ == "__main__":
    main()
