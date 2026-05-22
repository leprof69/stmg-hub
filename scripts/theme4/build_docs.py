# -*- coding: utf-8 -*-
"""Génère Thème 4 SDGN (ELEVE + PROF) — HTML/PDF propres, démarche inductive."""
from __future__ import annotations

import asyncio
import re
from pathlib import Path

from playwright.async_api import async_playwright

SCRIPT_DIR = Path(__file__).resolve().parent
EXPORTS = SCRIPT_DIR.parents[1] / "exports"
CSS = (SCRIPT_DIR / "style.css").read_text(encoding="utf-8")

PDF_OPTS = {
    "format": "A4",
    "print_background": True,
    "margin": {"top": "14mm", "bottom": "16mm", "left": "12mm", "right": "12mm"},
    "display_header_footer": True,
    "header_template": "<div></div>",
    "footer_template": (
        '<div style="font-size:8px;width:100%;text-align:center;color:#64748b;font-family:Segoe UI,sans-serif;">'
        "SDGN 1re STMG — Thème 4 Temps et risque — "
        "Page <span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span></div>"
    ),
}


def page(title: str, subtitle: str, body: str) -> str:
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8"/>
  <title>{title}</title>
  <style>{CSS}</style>
</head>
<body>
<div class="doc-header">
  <h1>{title}</h1>
  <p class="subtitle">{subtitle}</p>
</div>
{body}
</body>
</html>"""


def situation(title: str, inner: str) -> str:
    return f'<div class="situation"><div class="situation-title">{title}</div>{inner}</div>'


def lignes(n: int = 3, large: bool = False) -> str:
    cls = "lignes lignes-lg" if large else "lignes"
    return f'<div class="{cls}">' + ('<span class="ligne"></span>' * n) + "</div>"


def cq(verbe: str, texte: str, n: int = 3) -> str:
    return f'<p class="question-directe"><strong>{verbe}.</strong> {texte}</p>{lignes(n)}'


def exercice(num: str, titre: str, consigne: str) -> str:
    return f"""<div class="exercice-block">
<span class="exercice-num">Exercice {num}</span> <strong>{titre}</strong>
<div class="consigne-travail">{consigne}</div>
</div>"""


def synthese(title: str, headers: list[str], rows: list[str]) -> str:
    th = "".join(f"<th>{h}</th>" for h in headers)
    trs = ""
    for row in rows:
        trs += f"<tr><td><strong>{row}</strong></td>"
        trs += "".join('<td class="cell-ecrit-lg"></td>' for _ in range(len(headers) - 1))
        trs += "</tr>"
    return f"""<div class="synthese">
<h3>{title}</h3>
<p><em>À compléter uniquement après la correction orale du professeur (5 à 10 min en fin de séance).</em></p>
<table><thead><tr>{th}</tr></thead><tbody>{trs}</tbody></table>
</div>"""


def seance_intro(num: str, titre: str, qdg: str, duree: str, objectif: str, page_break: bool = False) -> str:
    br = '<hr class="page-break"/>' if page_break else '<hr class="seance-sep"/>'
    return f"""{br}
<h2>Séance {num} — {titre}</h2>
<p><strong>Question de gestion :</strong> <em>{qdg}</em></p>
<div class="consigne">
<strong>Durée :</strong> {duree} — <strong>Objectif :</strong> {objectif}<br/>
<strong>Travail :</strong> lisez le cas, puis répondez sur les lignes ou dans les tableaux. Appuyez-vous sur les chiffres du cas.
</div>"""


def _slice_marked(body: str, keys: list[str], selected: frozenset[str]) -> str:
    tagged: list[tuple[int, str, str]] = []
    for key in keys:
        tag = f"<!-- SDGN:{key} -->"
        idx = body.find(tag)
        if idx >= 0:
            tagged.append((idx, key, tag))
    if not tagged:
        return body
    tagged.sort(key=lambda x: x[0])
    intro = body[: tagged[0][0]]
    out = [intro]
    for i, (idx, key, _tag) in enumerate(tagged):
        if key not in selected:
            continue
        end = tagged[i + 1][0] if i + 1 < len(tagged) else len(body)
        out.append(body[idx:end])
    return "".join(out)


def _strip_sdgn_markers(body: str) -> str:
    return re.sub(r"<!-- SDGN:[^>]+ -->\n?", "", body)


def _eleve_selected_keys(sel: frozenset[int]) -> frozenset[str]:
    keys = {f"S:{n}" for n in sel if n in {1, 2, 3, 4}}
    if sel == frozenset({1, 2, 3, 4}):
        keys.add("S:MINI")
    return keys


def _prof_selected_keys(sel: frozenset[int]) -> frozenset[str]:
    keys = {f"P:S{n}" for n in sel if n in {1, 2, 3, 4}}
    keys.add("P:FOOTER")
    if sel == frozenset({1, 2, 3, 4}):
        keys.add("P:MINI")
    return keys


ELEVE_SECTION_KEYS = ["S:1", "S:2", "S:3", "S:4", "S:MINI"]
PROF_SECTION_KEYS = ["P:S1", "P:S2", "P:S3", "P:S4", "P:MINI", "P:FOOTER"]


def _seances_subtitle(seances: frozenset[int], role: str) -> str:
    if seances == frozenset({1, 2, 3, 4}):
        if role == "eleve":
            return "Dossier élève — Sciences de gestion et numérique — 1re STMG"
        return "Dossier professeur — Corrigés, synthèse et déroulé"
    nums = " et ".join(str(n) for n in sorted(seances))
    if role == "eleve":
        return f"Dossier élève — Séances {nums} — 1re STMG"
    return f"Dossier professeur — Séances {nums} — Corrigés et déroulé"


def eleve_html(seances: frozenset[int] | None = None) -> str:
    sel = frozenset({1, 2, 3, 4}) if seances is None else seances
    parts: list[str] = []

    theme_rows = ""
    if 1 in sel or 2 in sel or 3 in sel:
        s123 = []
        if 1 in sel:
            s123.append("1")
        if 2 in sel:
            s123.append("2")
        if 3 in sel:
            s123.append("3")
        label = ", ".join(s123[:-1]) + (" et " + s123[-1] if len(s123) > 1 else s123[0]) if s123 else ""
        theme_rows += (
            f"<tr><td>1</td><td>Quelle prise en compte du temps dans la gestion de l'organisation ?</td>"
            f"<td>{label}</td></tr>"
        )
    if 4 in sel:
        mini = "4 + mini-cas" if sel == frozenset({1, 2, 3, 4}) else "4"
        theme_rows += (
            f"<tr><td>2</td><td>L'amélioration de la performance est-elle sans risque ?</td>"
            f"<td>{mini}</td></tr>"
        )

    parts.append(f"""
<div class="consigne">
<strong>Dossier élève — démarche inductive (pas de cours).</strong> Vous découvrez les notions en analysant des situations d'entreprise.
Lisez chaque cas en entier avant de répondre. En fin de séance, après correction, vous complétez <strong>Ma synthèse</strong>.
</div>

<h2>Le thème en bref</h2>
<table>
<thead><tr><th>Chapitre</th><th>Question de gestion</th><th>Séances</th></tr></thead>
<tbody>
{theme_rows}
</tbody></table>
""")

    # === SÉANCE 1 ===
    parts.append("<!-- SDGN:S:1 -->")
    parts.append(seance_intro(
        "1", "Le temps, l'information et la décision",
        "Quelle prise en compte du temps dans la gestion de l'organisation ?",
        "2 h", "Comprendre que toute décision se prend dans le temps, avec une information parfois incomplète ou périmée.",
    ))
    parts.append("""<p><strong>Rappel horizons :</strong> <strong>CT</strong> = court terme (jours, semaines, quelques mois) ·
<strong>MT</strong> = moyen terme (1 à 3 ans) · <strong>LT</strong> = long terme (plus de 3 ans).</p>""")

    parts.append(situation("CAS 1 — Glaces du Parc (station balnéaire, Var)", """
<div class="contexte">
Glaces du Parc est une glacerie artisanale en bord de mer. Mme Costa prépare le comité de direction et
<strong>pilote son activité par trimestres</strong> (voir tableau). L'activité est <strong>très saisonnière</strong> : 62 % du CA entre juin et août. En février 2025, la trésorerie
est tombée à <strong>8 400 &euro;</strong>. Une chaîne low-cost ouvre à 500 m. En juillet 2024, la pluie avait
fait baisser les ventes de <strong>22 %</strong>.
</div>
<table><thead><tr><th>Trimestre</th><th>CA (k&euro;)</th><th>Effectif saisonnier</th></tr></thead>
<tbody>
<tr><td>T1 (janv.-mars)</td><td>28</td><td>0</td></tr>
<tr><td>T2 (avr.-juin)</td><td>95</td><td>10</td></tr>
<tr><td>T3 (juil.-sept.)</td><td>110</td><td>16</td></tr>
<tr><td>T4 (oct.-déc.)</td><td>42</td><td>2</td></tr>
</tbody></table>
<p><strong>Décisions à trancher :</strong></p>
<table><thead><tr><th>N&deg;</th><th>Décision</th><th>Délai prévu</th></tr></thead>
<tbody>
<tr><td>1</td><td>Commander 5 000 cornetes</td><td>Cette semaine</td></tr>
<tr><td>2</td><td>Recruter 8 vendeurs saisonniers</td><td>D'ici 6 semaines</td></tr>
<tr><td>3</td><td>Ouvrir un 2<sup>e</sup> kiosque</td><td>D'ici 14 mois</td></tr>
<tr><td>4</td><td>Construire un atelier de fabrication</td><td>D'ici 5 ans</td></tr>
<tr><td>5</td><td>Payer la facture du grossiste</td><td>Vendredi (fin de mois)</td></tr>
<tr><td>6</td><td>Refonte de l'identité visuelle</td><td>D'ici 3 ans</td></tr>
</tbody></table>"""))

    parts.append(exercice("1.1", "Classer les décisions dans le temps",
        cq("Complète", "le tableau : pour chaque décision, indique <strong>CT</strong> (court terme), <strong>MT</strong> (moyen, 1 à 3 ans) ou <strong>LT</strong> (long, plus de 3 ans). Ajoute une courte justification.", 0)
        + """<table><thead><tr><th>N&deg;</th><th>CT / MT / LT</th><th>Pourquoi ? (1 phrase + chiffre du cas)</th></tr></thead><tbody>
<tr><td>1</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>2</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>3</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>4</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>5</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>6</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""
        + cq("Explique", "une décision difficile à classer (4 lignes). Utilise le CA trimestriel ou la trésorerie hivernale.", 4)))

    parts.append(exercice("1.2", "Anticiper dans un environnement incertain",
        cq("Cite", "4 facteurs <strong>extérieurs</strong> (hors contrôle de Mme Costa) qui rendent le CA difficile à prévoir.", 0)
        + """<table><thead><tr><th>Facteur extérieur</th><th>Effet possible sur l'activité</th><th>Action pour anticiper</th></tr></thead><tbody>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""))

    parts.append(situation("CAS 2 — DataWear (start-up, Lyon)", """
<div class="contexte">
DataWear vend des vêtements connectés. En janvier 2026, Mme Zhang (achats) commande <strong>15 000 capteurs</strong>
pour 420 000 &euro; en se basant sur les ventes de <strong>2020</strong> (confinement). Or le marché baisse :
CA prévu 2026 = <strong>6,4 M&euro;</strong>. Stock actuel : <strong>8 mois</strong>. Trésorerie : <strong>95 000 &euro;</strong>.
Loyer : 28 000 &euro;/mois. Deux salariés risquent un licenciement. Le marketing n'a pas été consulté : 71 % des clients
préfèrent désormais les montres connectées.
</div>
<table><thead><tr><th>Année</th><th>CA (M&euro;)</th><th>Commentaire</th></tr></thead>
<tbody>
<tr><td>2020</td><td>12,4</td><td>Pic confinement</td></tr>
<tr><td>2025</td><td>7,8</td><td>Concurrence, baisse demande</td></tr>
<tr><td>2026 (prév.)</td><td>6,4</td><td>Marché essoufflé</td></tr>
</tbody></table>
<p><em>Comité d'achat : « On reprend le volume 2020 » · « Promo −8 % si commande avant fin janvier » · « Pas le temps de refaire une enquête ».</em></p>"""))

    parts.append(exercice("1.3", "Analyser une mauvaise décision",
        cq("Explique", "le problème principal de l'achat de janvier 2026 (6 lignes). Utilise au moins 2 chiffres, le stock, la trésorerie et la comparaison 2020/2026.", 6)
        + cq("Propose", "3 actions que la direction aurait pu mener <strong>avant</strong> de commander.", 0)
        + """<table><thead><tr><th>Action</th><th>Qui la fait ?</th><th>Quelle info obtenue ?</th></tr></thead><tbody>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""
        + cq("Décris", "2 conséquences possibles si les capteurs ne se vendent pas (trésorerie, emploi…).", 3)))

    parts.append(situation("CAS 3 — Nova Logistics (transport, Nantes)", """
<div class="contexte">
Nova Logistics est une PME de messagerie (120 salariés). <strong>Lundi 3 mars :</strong> le commercial apprend qu'un
concurrent baissera ses tarifs de 12 % dès lundi suivant. M. Pelletier informe son équipe mais <strong>pas</strong> la production,
la facturation ni le service client. <strong>Mercredi :</strong> production planifie sans adapter les tarifs.
<strong>Vendredi 7 mars :</strong> production apprend la nouvelle par rumeur. <strong>34 clients</strong> sont déjà partis.
</div>
<table><thead><tr><th>Service</th><th>Informé ?</th><th>Conséquence</th></tr></thead>
<tbody>
<tr><td>Commercial</td><td>Oui (lundi)</td><td>Aucune consigne aux autres services</td></tr>
<tr><td>Production</td><td>Non (rumeur vendredi)</td><td>Planning non adapté</td></tr>
<tr><td>Facturation</td><td>Non</td><td>Devis au tarif ancien</td></tr>
<tr><td>Service client</td><td>Non</td><td>Pas de contre-offre possible</td></tr>
</tbody></table>"""))

    parts.append(exercice("1.4", "Dysfonctionnement d'information",
        cq("Raconte", "la situation dans l'ordre (lundi → vendredi), en 6 lignes, comme un compte rendu à la direction.", 6)
        + cq("Liste", "3 conséquences si cela se reproduit (clients, coûts, conflits, image…).", 0)
        + """<table><thead><tr><th>Conséquence</th></tr></thead><tbody>
<tr><td class="cell-ecrit-lg"></td></tr><tr><td class="cell-ecrit-lg"></td></tr><tr><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""
        + cq("Propose", "2 mesures concrètes pour que l'information circule entre les services (qui, quand, comment).", 0)
        + """<table><thead><tr><th>Mesure</th><th>Qui / quand ?</th></tr></thead><tbody>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""))

    parts.append("""
<h3>Entraînement — Vrai ou faux</h3>
<p class="question-directe"><strong>Indique</strong> V ou F, puis <strong>justifie</strong> en 2 phrases en citant un cas et un chiffre.</p>
<table><thead><tr><th>#</th><th>Affirmation</th><th>V/F</th><th>Justification</th></tr></thead><tbody>
<tr><td>1</td><td>Plus on prévoit loin, plus on est sûr de l'avenir.</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>2</td><td>Une entreprise saisonnière doit tenir compte du calendrier.</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>3</td><td>Les chiffres de 2020 suffisent pour décider en 2026.</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>4</td><td>Tous les salariés ont la même info au même moment.</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>5</td><td>Surveiller la concurrence aide à mieux décider.</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>""")

    parts.append("""
<h3>Entraînement — Relie situation et idée</h3>
<p class="question-directe"><strong>Associe</strong> chaque lettre au bon numéro (1 à 5). Puis <strong>justifie</strong> 2 associations en 1 phrase.</p>
<table><thead><tr><th>Situation</th><th>N&deg; (1-5)</th></tr></thead><tbody>
<tr><td>a — Glaces du Parc : CA concentré sur l'été</td><td class="cell-ecrit"></td></tr>
<tr><td>b — DataWear : achat basé sur 2020</td><td class="cell-ecrit"></td></tr>
<tr><td>c — Nova : commercial informé, production non</td><td class="cell-ecrit"></td></tr>
<tr><td>d — Mme Costa pilote par trimestres</td><td class="cell-ecrit"></td></tr>
<tr><td>e — DataWear pourrait observer les concurrents chaque mois</td><td class="cell-ecrit"></td></tr>
</tbody></table>
<p><em>1 = info périmée · 2 = découpage du temps · 3 = inégalité d'info · 4 = veille · 5 = calendrier sectoriel</em></p>"""
        + cq("Justifie", "deux associations de ton choix.", 2))

    parts.append(synthese("Ma synthèse — Séance 1",
        ["Notion", "Ma définition", "Exemple (quel cas ?)"],
        ["Horizon CT / MT / LT", "Actualité de l'information", "Asymétrie d'information", "Veille", "Incertitude"]))

    # === SÉANCE 2 ===
    parts.append("<!-- SDGN:S:2 -->")
    parts.append(seance_intro("2", "Prévoir l'activité : enquête, charges et seuil de rentabilité",
        "Quelle prise en compte du temps dans la gestion de l'organisation ?",
        "2 h", "Estimer si une activité peut être viable : combien faut-il vendre au minimum ?"))

    parts.append(situation("CAS 4 — Bubble Tea Lyon", """
<div class="contexte">
Léa et Karim veulent ouvrir un bubble tea à Lyon. Enquête auprès de 200 lycéens/étudiants :
62 % achètent régulièrement une boisson fraîche ; 48 % acceptent <strong>6,50 &euro;</strong> ;
31 % connaissent le concurrent TeaZone (à 400 m). Local : <strong>9 100 &euro;/mois</strong> (loyer, charges, salaire).
Léa craint : « Et si on ne vend que 1 500 boissons par mois ? »
</div>
<table><thead><tr><th>Poste</th><th>Montant</th></tr></thead>
<tbody>
<tr><td>Prix de vente</td><td>6,50 &euro; / boisson</td></tr>
<tr><td>Ingrédients + emballage</td><td>2,60 &euro; / boisson</td></tr>
<tr><td>Local + charges + salaire</td><td>9 100 &euro; / mois</td></tr>
</tbody></table>"""))

    parts.append(exercice("2.1", "Distinguer les charges",
        cq("Classe", "chaque poste dans le tableau : <strong>variable</strong> si le montant augmente quand on vend plus ; <strong>fixe</strong> s'il reste le même chaque mois.", 0)
        + """<table><thead><tr><th>Poste</th><th>Variable / Fixe</th><th>En 1 phrase, pourquoi ?</th></tr></thead><tbody>
<tr><td>Ingrédients</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>Local + charges</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""
        + cq("Calcule", "combien l'entreprise gagne sur <strong>1 boisson vendue</strong> (marge unitaire). Montre ton calcul.", 2)))

    parts.append(exercice("2.2", "Combien vendre pour ne pas perdre d'argent ?",
        cq("Calcule", "combien de boissons Léa et Karim doivent vendre <strong>au minimum par mois</strong> pour ne pas perdre d'argent. "
        "Utilise les chiffres du cas et ta marge de l'exercice 2.1. Montre ton raisonnement.", 0)
        + """<table><thead><tr><th>Question</th><th>Ta réponse</th></tr></thead><tbody>
<tr><td>Marge sur 1 boisson</td><td class="cell-ecrit-lg"></td></tr>
<tr><td>Nombre minimum de boissons par mois</td><td class="cell-ecrit-lg"></td></tr>
<tr><td>Chiffre d'affaires minimum correspondant</td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""
        + cq("Vérifie", "avec ton nombre de boissons : le résultat du mois est-il proche de 0 &euro; ? Montre ton calcul.", 3)))

    parts.append(exercice("2.3", "Croiser enquête et seuil",
        cq("Explique", "d'après l'enquête du cas (200 personnes interrogées, 62 % achètent régulièrement une boisson fraîche, "
        "48 % acceptent 6,50 &euro;, concurrent TeaZone à 400 m), est-il réaliste de viser "
        "<strong>1 500 boissons par mois</strong> ? Appuie-toi sur un chiffre de l'enquête.", 5)
        + cq("Compare", "1 500 boissons avec le minimum trouvé en 2.2. Que réponds-tu à Léa ?", 3)))

    parts.append(exercice("2.4", "Que gagne-t-on avec 2 800 ventes ?",
        cq("Calcule", "le bénéfice ou la perte du mois si le chiffre d'affaires est de <strong>18 200 &euro;</strong> "
        "(environ 2 800 boissons). Montre ton calcul.", 4)
        + cq("Compare", "ce résultat avec le minimum trouvé en 2.2. "
        "L'ouverture du bubble tea te semble-t-elle viable ? "
        "Réponds à Léa si elle craint 1 500 ventes (tu peux t'appuyer sur l'exercice 2.3).", 4)))

    parts.append(situation("CAS 5 — Deux mois après l'ouverture", """
<table><thead><tr><th></th><th>Mois 1</th><th>Mois 2</th></tr></thead><tbody>
<tr><td>Boissons vendues</td><td>2 000</td><td>2 800</td></tr>
<tr><td>Chiffre d'affaires</td><td>13 000 &euro;</td><td>18 200 &euro;</td></tr>
<tr><td>Coûts variables</td><td>5 200 &euro;</td><td>7 280 &euro;</td></tr>
<tr><td>Coûts fixes</td><td>9 100 &euro;</td><td>9 100 &euro;</td></tr>
</tbody></table>"""))

    parts.append(exercice("2.5", "Comparer deux périodes",
        cq("Calcule", "le résultat (bénéfice ou perte) de chaque mois. Utilise les chiffres du tableau du cas.", 0)
        + """<table><thead><tr><th>Mois</th><th>Calcul détaillé</th><th>Résultat (&euro;)</th></tr></thead><tbody>
<tr><td>Mois 1</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td></tr>
<tr><td>Mois 2</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td></tr>
</tbody></table>"""
        + cq("Explique", "pourquoi le mois 1 est en perte alors qu'ils ont vendu 2 000 boissons. "
        "Compare ce nombre au minimum calculé en exercice 2.2.", 4)
        + cq("Dis", "en 2 ou 3 phrases, à quoi sert de comparer le mois 1 et le mois 2 pour la suite.", 3)))

    parts.append("""
<h3>Entraînement — Vrai ou faux</h3>
<p class="question-directe"><strong>Indique</strong> V ou F, puis <strong>justifie</strong> en 2 phrases en citant Bubble Tea.</p>
<table><thead><tr><th>#</th><th>Affirmation</th><th>V/F</th><th>Justification</th></tr></thead><tbody>
<tr><td>1</td><td>Les charges fixes augmentent quand on vend plus de boissons.</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>2</td><td>Le seuil de rentabilité indique un niveau minimum de ventes.</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>3</td><td>Une enquête clients sert à estimer une demande possible.</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>4</td><td>Vendre plus que le minimum garantit toujours un bénéfice important.</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>""")

    parts.append(synthese("Ma synthèse — Séance 2",
        ["Notion", "Ma définition", "Exemple Bubble Tea"],
        ["Enquête", "Charges fixes / variables", "Seuil de rentabilité", "Point mort"]))

    # === SÉANCE 3 ===
    parts.append("<!-- SDGN:S:3 -->")
    parts.append(seance_intro("3", "Budget, trésorerie et planification",
        "Quelle prise en compte du temps dans la gestion de l'organisation ?",
        "2 h", "Anticiper les entrées et sorties d'argent ; planifier un projet dans le temps.", page_break=True))

    parts.append(situation("CAS 6 — Studio Créatif (agence, Bordeaux)", """
<div class="contexte">
Studio Créatif emploie 6 personnes. M. Dupré suit l'argent <strong>réellement disponible</strong> sur le compte bancaire.
Les clients paient leurs factures à <strong>45 jours</strong> ; salaires et loyer sont payés le 5 du mois.
En janvier, l'agence a envoyé des factures pour <strong>18 000 &euro;</strong> de prestations,
mais seulement <strong>12 000 &euro;</strong> sont entrés sur le compte ce mois-là.
</div>
<div class="definitions">
<p><strong>Encaissement</strong> = argent reçu sur le compte bancaire (client qui paie, virement reçu…).</p>
<p><strong>Décaissement</strong> = argent payé et sorti du compte (salaires, loyer, fournisseurs…).</p>
</div>
<p>Solde au 1<sup>er</sup> janvier : <strong>2 000 &euro;</strong></p>
<table><thead><tr><th>Mois</th><th>Encaissements (entrées)</th><th>Décaissements (sorties)</th></tr></thead>
<tbody>
<tr><td>Janvier</td><td>12 000 &euro;</td><td>14 500 &euro;</td></tr>
<tr><td>Février</td><td>15 000 &euro;</td><td>11 000 &euro;</td></tr>
<tr><td>Mars</td><td>9 000 &euro;</td><td>13 000 &euro;</td></tr>
</tbody></table>"""))

    parts.append(exercice("3.1", "Budget de trésorerie trimestriel",
        cq("Calcule", "le solde de trésorerie en fin de janvier, fin de février et fin de mars. "
        "Pour chaque mois, écris le calcul complet à partir du solde précédent.", 0)
        + """<table><thead><tr><th>Mois</th><th>Ton calcul</th><th>Solde fin de mois</th></tr></thead><tbody>
<tr><td>Janvier</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td></tr>
<tr><td>Février</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td></tr>
<tr><td>Mars</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td></tr>
</tbody></table>"""
        + cq("Indique", "le(s) mois où le compte risque d'être à découvert. "
        "Que pourrait-il se passer concrètement (impossibilité de payer salaires, fournisseurs, banque…) ?", 4)
        + cq("Explique", "pourquoi en janvier l'agence a facturé 18 000 &euro; mais n'a encaissé que 12 000 &euro;. "
        "Utilise l'info « clients paient à 45 jours ».", 3)
        + cq("Propose", "2 actions concrètes pour que Studio Créatif ne manque plus d'argent sur le compte.", 0)
        + """<table><thead><tr><th>Action</th><th>Effet attendu</th></tr></thead><tbody>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""))

    parts.append(situation("CAS 7 — Salon orientation STMG (6 semaines)", """
<div class="contexte">
Votre lycée organise un salon orientation dans <strong>6 semaines</strong>. Vous gérez le planning.
Sans affiche validée, la com' réseaux ne démarre pas. Sans sponsors, pas de goodies.
</div>
<ul>
<li><strong>Affiche</strong> — 1 semaine (dès S1)</li>
<li><strong>Sponsors</strong> — 2 semaines (S2-S3)</li>
<li><strong>Com' réseaux</strong> — 3 semaines (S2-S4, après affiche)</li>
<li><strong>Goodies</strong> — 1 semaine (S4, après sponsors)</li>
<li><strong>Répétition stand</strong> — 1 semaine (S5, après matériel livré S4)</li>
</ul>"""))

    parts.append(exercice("3.2", "Planifier dans le temps",
        cq("Remplis", "le planning : indique dans quelle(s) semaine(s) chaque tâche a lieu (coche ou note S1, S2…). "
        "Respecte les contraintes du cas (affiche avant com', sponsors avant goodies…).", 0)
        + """<table><thead><tr><th>Tâche</th><th>S1</th><th>S2</th><th>S3</th><th>S4</th><th>S5</th><th>S6</th></tr></thead>
<tbody>
<tr><td>Affiche</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>Sponsors</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>Com' réseaux</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>Goodies</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>Répétition stand</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""
        + cq("Identifie", "1 tâche critique : si elle retarde, quelles autres sont bloquées ?", 3)
        + cq("Dis", "à quoi sert ce type de planning dans une entreprise.", 2)))

    parts.append(exercice("3.3", "Ordre logique d'une démarche budgétaire",
        """<p>Remets dans l'ordre (1 à 5) :</p>
<ul>
<li><strong>A</strong> — Budget de trésorerie (argent sur le compte)</li>
<li><strong>B</strong> — Enquête clients (prix, demande)</li>
<li><strong>C</strong> — Budget des ventes</li>
<li><strong>D</strong> — CA minimum (seuil de rentabilité)</li>
<li><strong>E</strong> — Repérer coûts fixes et variables</li>
</ul>"""
        + cq("Écris", "l'ordre complet des 5 étapes (de la première à la dernière).", 1)
        + cq("Justifie", "pourquoi l'enquête clients doit venir tôt et pourquoi le budget de trésorerie vient en dernier.", 4)))

    parts.append("""
<h3>Entraînement — Relie la situation au bon budget</h3>
<p class="question-directe"><strong>Associe</strong> chaque situation (a à d) au bon type de budget (1 à 4).</p>
<table><thead><tr><th>Situation</th><th>Budget n&deg; (1-4)</th></tr></thead><tbody>
<tr><td>a — Bubble Tea : combien vendre pour ne pas perdre d'argent</td><td class="cell-ecrit"></td></tr>
<tr><td>b — Studio Créatif : argent disponible sur le compte chaque mois</td><td class="cell-ecrit"></td></tr>
<tr><td>c — Salon STMG : quelles tâches en semaine 3</td><td class="cell-ecrit"></td></tr>
<tr><td>d — Kadalys : prévoir le chiffre d'affaires export la 1<sup>re</sup> année</td><td class="cell-ecrit"></td></tr>
</tbody></table>
<p><em>1 = budget des ventes · 2 = budget de trésorerie · 3 = diagramme de Gantt · 4 = seuil de rentabilité</em></p>"""
        + cq("Justifie", "deux associations en citant un fait du cas.", 2))

    parts.append(synthese("Ma synthèse — Séance 3",
        ["Notion", "Ma définition", "Exemple"],
        ["Budget de trésorerie", "Diagramme de Gantt", "Encaissement / décaissement", "Budget"]))

    # === SÉANCE 4 ===
    parts.append("<!-- SDGN:S:4 -->")
    parts.append(seance_intro("4", "Performance, risques et cycle de vie",
        "L'amélioration de la performance est-elle sans risque ?",
        "2 h", "Montrer que chercher la performance peut créer ou aggraver des risques."))

    parts.append(situation("CAS 8 — GreenRun (baskets éco-responsables)", """
<div class="contexte">
GreenRun fabrique des baskets « 100 % matériaux recyclés ». Ventes +40 % en 6 mois. M. Lemaire veut
passer la marge de 28 % à 30 %. Il annonce :
</div>
<ol>
<li><strong>Flux tendu</strong> : stock max 5 jours (au lieu de 3 semaines)</li>
<li><strong>1 seul fournisseur</strong> asiatique (−20 % vs Europe)</li>
<li><strong>−40 %</strong> du budget contrôle qualité</li>
</ol>
<p>La marque communique sur l'écologie. La responsable qualité, le logisticien et la com' s'inquiètent.</p>"""))

    parts.append(exercice("4.1", "Identifier les risques",
        cq("Cite", "3 risques <strong>extérieurs</strong> auxquels GreenRun était déjà exposée (marché, concurrence, matières…).", 3)
        + cq("Complète", "le tableau : pour chaque décision de M. Lemaire, indique un risque créé ou aggravé.", 0)
        + """<table><thead><tr><th>Décision</th><th>Risque</th><th>Qui est touché ?</th></tr></thead><tbody>
<tr><td>Stock 5 jours</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td></tr>
<tr><td>Fournisseur unique</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td></tr>
<tr><td>Moins de contrôle qualité</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td></tr>
</tbody></table>"""
        + cq("Propose", "1 mesure de prévention pour chaque risque interne du tableau.", 0)
        + """<table><thead><tr><th>Risque</th><th>Mesure</th></tr></thead><tbody>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""))

    parts.append(exercice("4.2", "Performance financière et autres performances",
        cq("Explique", "en 8 lignes ce qui peut se passer si la marge monte mais la qualité baisse : clients, salariés, image écologique.", 8)
        + cq("Réponds", "« Améliorer la performance financière est-il sans risque pour GreenRun ? » (2 lignes).", 2)))

    parts.append(situation("CAS 9 — Frise « GreenRun Classic »", """
<table><thead><tr><th>Période</th><th>Faits observés</th></tr></thead><tbody>
<tr><td>2018</td><td>Tests en labo, aucune vente</td></tr>
<tr><td>2019</td><td>Lancement, ventes faibles puis montée</td></tr>
<tr><td>2020-2022</td><td>Ventes × 4, marque connue</td></tr>
<tr><td>2023</td><td>Ventes stables, concurrence accrue</td></tr>
<tr><td>2025</td><td>Ventes ÷ 2, produit « démodé », nouvelle techno concurrente</td></tr>
</tbody></table>"""))

    parts.append(exercice("4.3", "Cycle de vie du produit",
        cq("Décris", "chaque période du tableau avec tes mots (1 phrase par ligne).", 0)
        + """<table><thead><tr><th>Période</th><th>Ta description</th><th>Risque principal</th></tr></thead><tbody>
<tr><td>2018</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>2019</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>2020-2022</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>2023</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>2025</td><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""
        + cq("Indique", "la phase en 2025 et une décision stratégique possible (abandon, relance, innovation). Argumente en 5 lignes.", 5)))

    parts.append("""
<h3>Entraînement — Risque interne (I) ou externe (E) ?</h3>
<p class="question-directe"><strong>Indique</strong> I ou E et <strong>justifie</strong> en 2 phrases.</p>
<table><thead><tr><th>Situation</th><th>I/E</th><th>Pourquoi ?</th></tr></thead><tbody>
<tr><td>Concurrent lance une appli gratuite</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>GreenRun supprime le contrôle qualité</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>Grève au port bloque les livraisons</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>PDG abandonne un produit sans étude</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td>Prix du coton recyclé +25 % (sécheresse)</td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>""")

    parts.append(synthese("Ma synthèse — Séance 4",
        ["Notion", "Ma définition", "Exemple GreenRun"],
        ["Risque interne / externe", "Cycle de vie (5 phases)", "Gestion des risques", "Obsolescence"]))

    # === MINI-CAS ===
    parts.append("<!-- SDGN:S:MINI -->")
    parts.append("""<hr class="page-break"/>
<h2>Mini-cas final — Kadalys (Guadeloupe)</h2>
<div class="consigne">
<strong>Durée :</strong> 45 min à 1 h — <strong>Travail :</strong> individuel ou binôme.<br/>
Mobilise les notions des séances 1 à 4. Chaque réponse doit citer un <strong>fait</strong> ou un <strong>chiffre</strong> du cas.
</div>""")

    parts.append(situation("Kadalys — Cosmétiques à base de banane verte", """
<div class="contexte">
Kadalys valorise la banane verte rejetée par l'export (cosmétiques anti-âge). 35 salariés, CA 4,2 M&euro;.
Mme Joseph veut <strong>exporter en Europe</strong>. Trésorerie : <strong>320 000 &euro;</strong>.
Un retard de livraison de 3 semaines en 2025 a fait perdre un distributeur belge.
</div>
<table><thead><tr><th>Projet</th><th>Détail</th></tr></thead><tbody>
<tr><td>Pub Europe</td><td>180 000 &euro; — lancement dans 4 mois</td></tr>
<tr><td>Commercial export</td><td>42 000 &euro;/an — recruté sous 3 mois</td></tr>
<tr><td>Transport maritime</td><td>21 jours · 12 000 &euro;/conteneur · marge préservée</td></tr>
<tr><td>Transport aérien</td><td>3 jours · 28 000 &euro;/conteneur · marge −8 %</td></tr>
</tbody></table>"""))

    parts.append(exercice("F.1", "Arbitrer dans le temps",
        cq("Classe", "pub, recrutement et transport en CT, MT ou LT. Justifie 1 cas difficile (4 lignes).", 4)
        + cq("Liste", "4 prévisions chiffrées à construire avant l'export (ventes, charges, trésorerie, seuil…).", 0)
        + """<table><thead><tr><th>Prévision</th><th>À quoi elle sert ?</th></tr></thead><tbody>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""))

    parts.append(exercice("F.2", "Risques et performance",
        cq("Identifie", "2 risques extérieurs et 2 risques liés aux décisions de Kadalys.", 0)
        + """<table><thead><tr><th>Risque</th><th>I/E</th><th>Conséquence possible</th></tr></thead><tbody>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""
        + cq("Explique", "les risques si Mme Joseph choisit le transport aérien « pour aller plus vite » (financier, image, écologie).", 5)
        + cq("Propose", "2 indicateurs pour vérifier dans 6 mois si l'export fonctionne.", 0)
        + """<table><thead><tr><th>Indicateur</th><th>Seuil d'alerte</th></tr></thead><tbody>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
<tr><td class="cell-ecrit-lg"></td><td class="cell-ecrit-lg"></td></tr>
</tbody></table>"""
        + cq("Rédige", "une réponse aux 2 questions de gestion du thème (8 lignes), avec Kadalys + un autre cas.", 8)))

    parts.append(synthese("Ma synthèse — Bilan du thème 4",
        ["Question de gestion", "Ma réponse (8-10 lignes, après correction)"],
        ["Quelle prise en compte du temps dans la gestion de l'organisation ?",
         "L'amélioration de la performance est-elle sans risque ?"]))

    return page(
        "Thème 4 : Temps et risque",
        _seances_subtitle(sel, "eleve"),
        _strip_sdgn_markers(_slice_marked("".join(parts), ELEVE_SECTION_KEYS, _eleve_selected_keys(sel))),
    )


def prof_html(seances: frozenset[int] | None = None) -> str:
    sel = frozenset({1, 2, 3, 4}) if seances is None else seances
    parts: list[str] = []

    org_rows = ""
    if 1 in sel:
        org_rows += "<tr><td>S1</td><td>2 h</td><td>Glaces du Parc, DataWear, Nova Logistics</td><td>Horizon, période, actualité, veille, asymétrie, incertitude</td></tr>"
    if 2 in sel:
        org_rows += "<tr><td>S2</td><td>2 h</td><td>Bubble Tea, comparaison mois 1/2</td><td>Enquête, prospective, CF/CV, seuil de rentabilité</td></tr>"
    if 3 in sel:
        org_rows += "<tr><td>S3</td><td>2 h</td><td>Studio Créatif, salon STMG, ordre budget</td><td>Budget, trésorerie, Gantt</td></tr>"
    if 4 in sel:
        org_rows += "<tr><td>S4</td><td>2 h</td><td>GreenRun, frise produit, I/E</td><td>Risques, cycle de vie, gestion des risques</td></tr>"
    if sel == frozenset({1, 2, 3, 4}):
        org_rows += "<tr><td>Mini-cas</td><td>1 h</td><td>Kadalys</td><td>Synthèse des 2 QdG</td></tr>"

    org_title = "Organisation de la séquence (4 séances + mini-cas)"
    if sel == frozenset({1, 2}):
        org_title = "Organisation — séances 1 et 2"

    parts.append(f"""
<div class="consigne">
<strong>Document professeur.</strong> Démarche inductive : ne distribuez pas la synthèse avant les cas.
Corrigez à l'oral, institutionnalisez les notions, puis faites compléter « Ma synthèse » (5-10 min).
Tous les contenus nécessaires sont dans ce dossier (cas, consignes, corrigés).
</div>

<h2>{org_title}</h2>
<table>
<thead><tr><th>Séance</th><th>Durée</th><th>Cas principaux</th><th>Notions à institutionnaliser</th></tr></thead>
<tbody>
{org_rows}
</tbody></table>

<h2>Déroulé type d'une séance (5 phases)</h2>
<table>
<thead><tr><th>Phase</th><th>Durée</th><th>Action prof</th></tr></thead>
<tbody>
<tr><td>1. Présentation du cas</td><td>5-10 min</td><td>Lecture collective ou silencieuse ; vérifier la compréhension (dates, chiffres, personnages)</td></tr>
<tr><td>2. Travail élève</td><td>30-45 min</td><td>Individuel ou binôme ; circuler, questionner sans donner la réponse (« Quel chiffre du cas t'aide ? »)</td></tr>
<tr><td>3. Mise en commun</td><td>20-30 min</td><td>Correction au tableau ; faire formuler les idées par les élèves avant d'introduire le vocabulaire</td></tr>
<tr><td>4. Institutionnalisation</td><td>10-15 min</td><td>Donner les termes et définitions (cf. synthèse ci-dessous) ; relier chaque notion à un cas</td></tr>
<tr><td>5. Synthèse écrite</td><td>5-10 min</td><td>Élève complète la fiche en fin de séance — ne pas corriger sur place, récupérer pour évaluation</td></tr>
</tbody></table>
""")

    # SEANCE 1 PROF
    parts.append("""<!-- SDGN:P:S1 --><hr class="page-break"/>
<h2>Séance 1 — Corrigés détaillés</h2>

<h3>Exercice 1.1 — Glaces du Parc</h3>
<div class="prof-box">
<table><thead><tr><th>N&deg;</th><th>Horizon</th><th>Commentaire attendu</th></tr></thead>
<tbody>
<tr><td>1</td><td>CT</td><td>Commande immédiate avant l'été</td></tr>
<tr><td>2</td><td>CT (MT accepté si argument saison + 6 semaines)</td><td>Recrutement avant pic T3</td></tr>
<tr><td>3</td><td>MT</td><td>14 mois = projet structurel</td></tr>
<tr><td>4</td><td>LT</td><td>5 ans = transformation durable</td></tr>
<tr><td>5</td><td>CT</td><td>Échéance fin de mois, trésorerie</td></tr>
<tr><td>6</td><td>LT ou MT</td><td>3 ans : accepter MT si élève argumente refonte progressive</td></tr>
</tbody></table>
<p><strong>Classifications difficiles :</strong> n&deg;2 (frontière CT/MT) ; n&deg;6 (MT vs LT).</p>
<p><strong>Facteurs d'incertitude (ex. 1.2) :</strong> météo (−22 % juillet 2024), tourisme, concurrence low-cost,
réglementation sanitaire, pouvoir d'achat, saisonnalité 62 % CA été.</p>
<p><strong>Erreurs fréquentes :</strong> confondre « urgence » et CT sans lien avec le délai ; oublier la trésorerie hivernale (8 400 &euro;).</p>
</div>

<h3>Exercice 1.2 — Anticiper</h3>
<div class="prof-box">
<p><strong>Réponses attendues :</strong> 4 facteurs extérieurs développés avec effet sur CA/trésorerie + mesure d'anticipation
(ex. : veille météo, enquête touristique, benchmark concurrence, simulation trésorerie T1).</p>
<p><strong>Question orale :</strong> « Quelle décision de Mme Costa devient plus risquée si la météo est mauvaise ? » → recrutement + commandes.</p>
</div>

<h3>Exercice 1.3 — DataWear</h3>
<div class="prof-box">
<p><strong>Problème central :</strong> information <strong>désactualisée</strong> (2020 ≠ 2026), surstock (8 mois),
trésorerie tendue (95 000 &euro; vs loyer 28 000 &euro;/mois), marketing non consulté (71 % montres connectées).</p>
<p><strong>Actions possibles :</strong> enquête récente, veille concurrentielle, commande progressive, réunion inter-services avant achat.</p>
<p><strong>Conséquences (partie C) :</strong> trésorerie asphyxiée, licenciements, obsolescence stock, perte parts de marché.</p>
<p><strong>Questions orales :</strong> « Quel mot résume le problème de DataWear ? » → actualité / info périmée.</p>
</div>

<h3>Exercice 1.4 — Nova Logistics</h3>
<div class="prof-box">
<p><strong>Compte rendu :</strong> chronologie lundi 3 → vendredi 7 mars, 34 clients perdus, services non informés.</p>
<p><strong>Asymétrie d'information</strong> entre commercial et production/facturation/service client.</p>
<p><strong>Conséquences :</strong> perte clients, conflits internes, surcoûts production, image dégradée, devis erronés.</p>
<p><strong>Mesures :</strong> réunion inter-services hebdomadaire, outil partage d'info (CRM), procédure alerte concurrentielle sous 24 h.</p>
<p><strong>Partie D :</strong> confidentialité, peur du panique, silos organisationnels — accepter si argumenté.</p>
</div>

<h3>V/F : 1-F, 2-V, 3-F, 4-F, 5-V</h3>
<p><strong>Justifications attendues :</strong> 1 → incertitude augmente avec l'horizon ; 3 → DataWear 2020/2026 ;
4 → Nova Logistics ; 5 → veille concurrence TransExpress.</p>

<h3>Liaison : a-5, b-1, c-3, d-2, e-4</h3>
<p><strong>Confusion possible :</strong> d pourrait sembler lié à 5 (saison) — distinguer découpage de gestion vs calendrier sectoriel.
Le cas 1 précise que Mme Costa pilote par trimestres.</p>

<div class="prof-synthese"><h3>Synthèse à institutionnaliser — Séance 1</h3>
<ul>
<li><strong>Horizon</strong> : durée couverte par une décision (CT : jours/mois ; MT : 1-3 ans ; LT : stratégie)</li>
<li><strong>Période</strong> : découpage du temps pour piloter (mois, trimestre, exercice)</li>
<li><strong>Actualité de l'information</strong> : une info périmée mène à une mauvaise décision</li>
<li><strong>Veille informationnelle</strong> : surveillance continue de l'environnement</li>
<li><strong>Asymétrie d'information</strong> : acteurs n'ont pas le même niveau d'information</li>
<li><strong>Incertitude</strong> : l'avenir n'est pas parfaitement prévisible ; plus l'horizon est lointain, plus c'est incertain</li>
</ul>
<p><strong>Phrase QdG :</strong> « L'organisation prend en compte le temps en distinguant les horizons, en actualisant l'information et en organisant une veille. »</p>
</div>
""")

    parts.append("""<!-- SDGN:P:S2 --><hr class="page-break"/>
<h2>Séance 2 — Corrigés détaillés</h2>
<div class="prof-box">
<h3>Bubble Tea — Calculs</h3>
<p>CV unitaire : 2,60 &euro; — CF : 9 100 &euro;/mois — PV : 6,50 &euro;</p>
<p>Marge unitaire = 6,50 − 2,60 = <strong>3,90 &euro;</strong></p>
<p>Taux marge = 3,90 / 6,50 = <strong>60 %</strong></p>
<p>SR = 9 100 / 0,60 = <strong>15 167 &euro;</strong> soit <strong>2 333 boissons</strong> (arrondi supérieur : 2 334)</p>
<p>CA 18 200 &euro; : CV totaux = 18 200 × 40 % = 7 280 &euro; (ou 2 800 × 2,60) ; marge CV = 10 920 &euro; ;
résultat = 10 920 − 9 100 = <strong>+1 820 &euro;</strong></p>
<p>1 500 boissons : CA = 9 750 &euro; ; CV = 3 900 &euro; ; résultat = 9 750 − 3 900 − 9 100 = <strong>−3 250 &euro;</strong> → non viable</p>
<p>Loyer +800 &euro; : CF = 9 900 &euro; ; SR = 9 900 / 0,60 = <strong>16 500 &euro;</strong> → renégocier ou augmenter le volume</p>
<p><strong>Mois 1 :</strong> 13 000 − 5 200 − 9 100 = <strong>−1 300 &euro;</strong> — <strong>Mois 2 :</strong> <strong>+1 820 &euro;</strong></p>
<h3>Exercice 2.3 — Enquête et seuil</h3>
<p><strong>Réponse attendue :</strong> 62 % de 200 personnes = demande potentielle limitée au lycée/étudiants ;
1 500 boissons/mois ≈ 50/jour — ambitieux mais pas impossible si clientèle élargie ;
TeaZone à 400 m = concurrence. Comparer à ~2 334 boissons minimum (2.2) : 1 500 &lt; minimum → perte (~−3 250 &euro;).</p>
<p><strong>Erreurs fréquentes :</strong> oublier la vérification SR ; confondre marge unitaire et taux de marge ; arrondir à l'inférieur ;
répondre sans chiffre de l'enquête.</p>
<p><strong>Questions orales :</strong> « Que se passe-t-il si Léa n'a que 1 500 ventes ? » — « Pourquoi le mois 1 est déficitaire malgré 2 000 ventes ? »</p>
<h3>V/F séance 2 : 1-F, 2-V, 3-V, 4-F</h3>
<p>4-F : mois 2 bénéficie mais marge modeste ; beaucoup de ventes restent proches du minimum.</p>
</div>
<div class="prof-synthese"><h3>Synthèse à institutionnaliser — Séance 2</h3>
<ul>
<li><strong>Enquête</strong> : recueil de données (sondage) pour estimer une demande</li>
<li><strong>Prospective</strong> : anticipation de l'avenir à partir d'hypothèses</li>
<li><strong>Charges fixes</strong> : ne varient pas avec le volume (loyer, salaire fixe)</li>
<li><strong>Charges variables</strong> : varient avec le volume (ingrédients)</li>
<li><strong>Seuil de rentabilité</strong> : CA minimum où résultat = 0 ; SR = CF / taux de marge sur coût variable</li>
</ul>
<p><strong>Institutionnalisation :</strong> nommer « seuil de rentabilité » après que les élèves aient trouvé le CA minimum.</p>
</div>
""")

    parts.append("""<!-- SDGN:P:S3 --><hr class="page-break"/>
<h2>Séance 3 — Corrigés détaillés</h2>
<div class="prof-box">
<h3>Studio Créatif — Trésorerie</h3>
<table><thead><tr><th>Fin de mois</th><th>Calcul</th><th>Solde</th></tr></thead>
<tbody>
<tr><td>Janvier</td><td>2 000 + 12 000 − 14 500</td><td><strong>−500 &euro;</strong></td></tr>
<tr><td>Février</td><td>−500 + 15 000 − 11 000</td><td><strong>+3 500 &euro;</strong></td></tr>
<tr><td>Mars</td><td>3 500 + 9 000 − 13 000</td><td><strong>−500 &euro;</strong></td></tr>
</tbody></table>
<p>Mois tendus : janvier et mars. Risque : cessation de paiements, impossibilité de payer salaires/fournisseurs.</p>
<p><strong>Résultat comptable ≠ trésorerie :</strong> janvier 18 000 &euro; facturés vs 12 000 &euro; encaissés.</p>
<p><strong>Actions CT :</strong> négocier délais fournisseurs, relance clients, découvert autorisé, acomptes.
<strong>MT :</strong> réviser calendrier investissements, réduire délais de paiement clients.</p>
<p><strong>Salon STMG (3.2) :</strong> chemin critique affiche → com réseaux ; sponsors → goodies → répétition stand.
Retard affiche = retard com + risque jour J. Goodies en S4 après sponsors.</p>
<p><strong>Ordre budget (3.3) :</strong> B enquête → E CF/CV → C budget ventes → D SR → A trésorerie.</p>
<p><strong>Entraînement budgets :</strong> a-4, b-2, c-3, d-1.</p>
</div>
<div class="prof-synthese"><h3>Synthèse à institutionnaliser — Séance 3</h3>
<ul>
<li><strong>Budget</strong> : prévision chiffrée des produits et charges</li>
<li><strong>Budget de trésorerie</strong> : prévision encaissements − décaissements</li>
<li><strong>Diagramme de Gantt</strong> : tâches, durées, chevauchements dans le temps</li>
<li><strong>Temps et argent</strong> : 1 &euro; aujourd'hui ≠ 1 &euro; demain (décalage dans le temps)</li>
</ul>
</div>
""")

    parts.append("""<!-- SDGN:P:S4 --><hr class="page-break"/>
<h2>Séance 4 — Corrigés détaillés</h2>
<div class="prof-box">
<h3>GreenRun — Exercice 4.1</h3>
<p><strong>Risques externes (avant décisions) :</strong> mode éco, concurrence, réglementation, coût matières recyclées,
enquête journaliste.</p>
<table><thead><tr><th>Décision</th><th>Risque créé/aggravé</th><th>Touché</th></tr></thead>
<tbody>
<tr><td>Flux tendu</td><td>Rupture stock, impossibilité de servir les commandes</td><td>Commercial, clients</td></tr>
<tr><td>Fournisseur unique Asie</td><td>Dépendance, délai maritime, réputation RSE</td><td>Logistique, image</td></tr>
<tr><td>−40 % contrôle qualité</td><td>Retours produits, bad buzz, contentieux</td><td>Clients, qualité</td></tr>
</tbody></table>
<p><strong>Exercice 4.2 :</strong> performances commerciale / sociale / environnementale peuvent se dégrader
malgré marge +2 pts → réponse QdG : non, pas sans risque.</p>
<p><strong>Frise (4.3) :</strong> développement (2018) → introduction (2019) → croissance (2020-22) → maturité (2023) → déclin (2025).</p>
<p><strong>2025 :</strong> déclin — stratégies : abandon, relance (nouveau design), innovation (nouvelle gamme).</p>
<p><strong>I/E :</strong> 1-E, 2-I, 3-E, 4-I, 5-E, 6-E ou I si élève argumente choix stratégique de dépendance.</p>
</div>
<div class="prof-synthese"><h3>Synthèse à institutionnaliser — Séance 4</h3>
<ul>
<li><strong>Risque</strong> : événement incertain affectant l'organisation</li>
<li><strong>Risque interne / externe</strong></li>
<li><strong>Cycle de vie</strong> : 5 phases (développement, introduction, croissance, maturité, déclin)</li>
<li><strong>Obsolescence, rupture technologique, empreinte environnementale</strong></li>
<li><strong>Gestion des risques</strong> : identifier → évaluer → traiter</li>
</ul>
<p><strong>Phrase QdG :</strong> « Améliorer la performance n'est pas sans risque : les décisions peuvent créer des risques internes ; l'environnement en génère d'externes. »</p>
</div>
""")

    parts.append("""<!-- SDGN:P:MINI --><hr class="page-break"/>
<h2>Mini-cas Kadalys — Corrigé type</h2>
<div class="prof-box">
<p><strong>Horizons :</strong> pub = CT/MT (4 mois) ; recrutement = MT (3 mois + effet long) ; transport = CT (contrat) / MT (partenariat).</p>
<p><strong>Prévisions :</strong> budget ventes export, budget charges (pub 180 k&euro;, salaire 42 k&euro;), budget trésorerie
(cumul dépenses vs 320 k&euro;), SR export, scénario maritime vs aérien.</p>
<p><strong>Calendrier logique :</strong> recrutement → prospection → premier envoi → pub (ou pub après test distribution).</p>
<p><strong>Risques ext. :</strong> réglementation cosmétique UE, taux de change, logistique, concurrence, exigence délais clients EU.</p>
<p><strong>Risques int. :</strong> endettement campagne, mauvais recrutement, dépendance transporteur, trésorerie insuffisante si tout simultané.</p>
<p><strong>Transport aérien :</strong> marge −8 %, empreinte carbone, image RSE contradictoire, trésorerie (28 k vs 12 k/conteneur).</p>
<p><strong>Indicateurs 6 mois :</strong> CA export, marge par conteneur, trésorerie, taux retour produit, parts de marché, délai moyen livraison.</p>
<p><strong>Synthèse QdG attendue :</strong> mobiliser horizons + prévisions + risques ; exemples Kadalys + Bubble Tea ou GreenRun.</p>
</div>""")

    grille_qdg_row = ""
    if sel == frozenset({1, 2, 3, 4}):
        grille_qdg_row = "<tr><td>QdG (mini-cas)</td><td>Non traitée</td><td>Amorce</td><td>Réponse structurée 8-10 lignes</td></tr>"

    vigilance: list[str] = [
        "<li>Ne jamais distribuer la synthèse avant les cas.</li>",
        "<li>SR ≠ point mort (date) : en 1<sup>re</sup>, SR = montant en &euro;.</li>",
    ]
    if 3 in sel:
        vigilance.append("<li>Résultat comptable ≠ trésorerie (Studio Créatif).</li>")
    if 4 in sel:
        vigilance.append("<li>Articuler séance 4 avec thème 3 : performances contradictoires.</li>")
    vigilance.append("<li>Exiger des justifications chiffrées : les consignes élèves le demandent explicitement.</li>")

    parts.append(f"""<!-- SDGN:P:FOOTER -->
<h2>Grille d'évaluation — Synthèse écrite (/4 par séance)</h2>
<table>
<thead><tr><th>Critère</th><th>0-1 pt</th><th>2-3 pts</th><th>4 pts</th></tr></thead>
<tbody>
<tr><td>Définitions</td><td>Absentes ou fausses</td><td>Partielles</td><td>Correctes, mots de l'élève</td></tr>
<tr><td>Lien avec le cas</td><td>Aucun</td><td>Exemple vague</td><td>Exemple précis (nom du cas + fait chiffré)</td></tr>
{grille_qdg_row}
</tbody></table>

<h2>Points de vigilance</h2>
<ul>
{"".join(vigilance)}
</ul>
""")

    return page(
        "Thème 4 : Temps et risque",
        _seances_subtitle(sel, "prof"),
        _strip_sdgn_markers(_slice_marked("".join(parts), PROF_SECTION_KEYS, _prof_selected_keys(sel))),
    )


async def main_async() -> None:
    EXPORTS.mkdir(parents=True, exist_ok=True)
    s12 = frozenset({1, 2})
    pairs = [
        ("SDGN_Theme4_Sequence_ELEVE", eleve_html()),
        ("SDGN_Theme4_Sequence_PROF", prof_html()),
        ("SDGN_Theme4_Seances12_ELEVE", eleve_html(s12)),
        ("SDGN_Theme4_Seances12_PROF", prof_html(s12)),
    ]
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for stem, html in pairs:
            html_path = EXPORTS / f"{stem}.html"
            pdf_path = EXPORTS / f"{stem}.pdf"
            html_path.write_text(html, encoding="utf-8", newline="\n")
            pg = await browser.new_page()
            await pg.goto(html_path.as_uri(), wait_until="networkidle")
            await pg.pdf(path=str(pdf_path), **PDF_OPTS)
            await pg.close()
            print(f"OK  {pdf_path.name}  ({pdf_path.stat().st_size // 1024} Ko)")
        await browser.close()


def main() -> None:
    asyncio.run(main_async())


if __name__ == "__main__":
    main()
