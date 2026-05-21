# -*- coding: utf-8 -*-
"""Genere les sequences Theme 4 SDGN (ELEVE + PROF) en MD, HTML et PDF (Playwright)."""
from __future__ import annotations

import asyncio
import re
from pathlib import Path

import markdown
from playwright.async_api import async_playwright

SCRIPT_DIR = Path(__file__).resolve().parent
ROOT = SCRIPT_DIR.parents[1]
EXPORTS = ROOT / "exports"
STYLE_PATH = SCRIPT_DIR / "style.css"

PDF_OPTIONS = {
    "format": "A4",
    "print_background": True,
    "margin": {"top": "18mm", "bottom": "18mm", "left": "14mm", "right": "14mm"},
    "display_header_footer": True,
    "header_template": "<div></div>",
    "footer_template": (
        '<div style="font-size:9px;width:100%;text-align:center;color:#64748b;">'
        "Page <span class=\"pageNumber\"></span> / <span class=\"totalPages\"></span>"
        "</div>"
    ),
}


def load_css() -> str:
    return STYLE_PATH.read_text(encoding="utf-8")


def md_extensions() -> list:
    return ["tables", "fenced_code", "nl2br", "sane_lists", "attr_list"]


def markdown_to_html(md: str, title: str, css: str) -> str:
    body = markdown.markdown(md, extensions=md_extensions())
    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <title>{title}</title>
  <style>
{css}
  </style>
</head>
<body>
{body}
</body>
</html>"""


def write_text(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8", newline="\n")


async def html_to_pdf(html_path: Path, pdf_path: Path) -> None:
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        await page.goto(html_path.as_uri(), wait_until="networkidle")
        await page.pdf(path=str(pdf_path), **PDF_OPTIONS)
        await browser.close()


def build_eleve_md() -> str:
    return ELEVE_MD


def build_prof_md() -> str:
    return PROF_MD


def export_pair(md: str, stem: str, css: str) -> tuple[Path, Path]:
    md_path = EXPORTS / f"{stem}.md"
    html_path = EXPORTS / f"{stem}.html"
    pdf_path = EXPORTS / f"{stem}.pdf"
    write_text(md_path, md)
    title = stem.replace("_", " ")
    html = markdown_to_html(md, title, css)
    write_text(html_path, html)
    return html_path, pdf_path


ELEVE_MD = """
<div class="doc-header">

# Theme 4 - Piloter l'activité de l'organisation

<p class="subtitle">Séquence inductive - Document élève</p>

<p class="doc-meta">SDGN - Premiere STMG | Chapitres 1 et 2 (QdG) | Manuel : temps et performance | Ne pas lire de synthèse avant les séances : vous construisez vos notions en resolvant des situations.</p>

</div>

<div class="consigne">

**Consigne de travail** : Pour chaque situation, analysez les documents, répondez aux questions dans les cadres prévus, puis completez **Ma synthèse** uniquement **après** la correction en classe.

</div>

## Séance 1 - Le temps dans le management (horizon et période)

<div class="situation">

<div class="situation-title">Situation A - Glaces du Parc (saisonnalité)</div>

Glaces du Parc est une franchise de glaces artisanales en bord de mer. Le dirigeant constate que 62 % du chiffre d'affaires est réalisé entre juin et aout. Il souhaite lisser l'activité sur l'annee.

| Indicateur | T1 | T2 | T3 | T4 |
| --- | --- | --- | --- | --- |
| CA (k€) | 28 | 95 | 110 | 42 |
| Effectif saisonnier | 4 | 14 | 16 | 6 |

</div>

<p class="question">1. Identifiez l'<strong>horizon de planification</strong> pertinent pour anticiper la saison estivale.</p>
<div class="reponse"></div>

<p class="question">2. Proposez deux actions compatibles avec un horizon <strong>moyen terme</strong> pour reduire la dépendance a la saison.</p>
<div class="reponse reponse-lg"></div>

<p class="question">3. Distinguez <strong>horizon</strong> et <strong>période</strong> sur ce cas.</p>
<div class="reponse"></div>

<div class="situation">

<div class="situation-title">Situation B - DataWear (veille et anticipation)</div>

DataWear conçoit des vetements connectes. Le marche des capteurs textiles evolue vite. Le comite de direction doit choisir entre lancer une collection en 9 mois ou renforcer la veille concurrentielle.

</div>

<p class="question">4. Citez deux sources de <strong>veille</strong> utiles pour DataWear.</p>
<div class="reponse"></div>

<p class="question">5. Quel horizon choisiriez-vous pour valider un investissement R&D majeur ? Justifiez.</p>
<div class="reponse reponse-lg"></div>

<div class="synthèse">

### Ma synthèse (a completer après correction)

| Notion | Ma definition en une phrase | Exemple de mon cas |
| --- | --- | --- |
| Horizon de planification | | |
| Période | | |
| Veille strategique | | |

</div>

<hr class="page-break" />

## Séance 2 - Piloter dans le temps (SR, trésorerie, Gantt, budget)

<div class="situation">

<div class="situation-title">Situation C - Nova Logistics (delais clients)</div>

Nova Logistics promet une livraison en 48 h. Sur 1 200 commandes du mois, 156 dépassent 48 h. Le taux de service objectif est 95 %.

</div>

<p class="question">1. Calculez le taux de respect du delai actuel.</p>
<div class="reponse"></div>

<p class="question">2. Proposez un indicateur de suivi et une fréquence de controle.</p>
<div class="reponse reponse-lg"></div>

<div class="situation">

<div class="situation-title">Situation D - Bubble Tea Lyon (seuil de rentabilité)</div>

| Poste | Montant mensuel |
| --- | --- |
| Charges fixes | 8 400 € |
| Prix moyen unitaire | 6,50 € |
| Cout variable unitaire | 2,80 € |

</div>

<p class="question">3. Calculez le seuil de rentabilité en nombre de boissons (arrondi superieur).</p>
<div class="reponse"></div>

<p class="question">4. Le point de vente réalisé 2 050 ventes/mois. Commentez la situation.</p>
<div class="reponse"></div>

<div class="situation">

<div class="situation-title">Situation E - Studio Créatif (trésorerie)</div>

| Mois | Encaissements | Decaissements | Solde cumule |
| --- | --- | --- | --- |
| janvier | 18 000 | 21 500 | -3 500 |
| fevrier | 22 000 | 19 000 | -500 |
| mars | 15 000 | 24 000 | -9 500 |

</div>

<p class="question">5. Identifiez le mois le plus risque pour la trésorerie et proposez deux actions court terme.</p>
<div class="reponse reponse-lg"></div>

<div class="situation">

<div class="situation-title">Situation F - Salon professionnel (diagramme de Gantt)</div>

Taches : reservation stand (J1-J5), conception stand (J4-J12), logistique (J10-J16), formation equipe (J14-J18). Le salon ouvre le J20.

</div>

<p class="question">6. Representez un Gantt simplifie (barres sur 20 jours) et indiquez une dépendance critique.</p>
<div class="reponse reponse-xl"></div>

<p class="question">7. Ordonnez les etapes budgetaires suivantes : (a) arbitrage, (b) prévision, (c) suivi mensuel, (d) fixation des enveloppes.</p>
<div class="reponse"></div>

<div class="synthèse">

### Ma synthèse (a completer après correction)

| Notion | Ma definition | Outil / indicateur |
| --- | --- | --- |
| Seuil de rentabilité | | |
| Trésorerie | | |
| Diagramme de Gantt | | |
| Budget (logique) | | |

</div>

<hr class="page-break" />

## Séance 3 - Performance et cycle de vie (GreenRun)

<div class="situation">

<div class="situation-title">Situation G - GreenRun (performance commerciale)</div>

GreenRun commercialise des boissons isotoniques éco-conçues.

| Indicateur | N-1 | N |
| --- | --- | --- |
| CA (k€) | 420 | 465 |
| Marge commerciale (k€) | 126 | 153 |
| Parts de marche (%) | 8,1 | 9,4 |

</div>

<p class="question">1. Calculez le taux de évolution du CA et de la marge commerciale.</p>
<div class="reponse"></div>

<p class="question">2. Proposez deux axes pour améliorer la performance au sens management.</p>
<div class="reponse reponse-lg"></div>

<p class="question">3. Placez GreenRun sur une frise du cycle de vie et justifiéz.</p>
<div class="reponse reponse-xl"></div>

<div class="synthèse">

### Ma synthèse (a completer après correction)

| Notion | Ma definition | Exemple GreenRun |
| --- | --- | --- |
| Performance | | |
| Cycle de vie du produit | | |

</div>

<hr class="page-break" />

## Séance 4 - Risques internes et externes

<div class="situation">

<div class="situation-title">Situation H - Cartographie des risques</div>

Pour GreenRun, on rélève : rupture fournisseur bouteille recyclee, erreur d'étiquetage nutritionnel, baisse de la demande running, hausse des taux, dépendance a un influenceur.

</div>

<p class="question">1. Classez chaque risque en interne / externe.</p>
<div class="reponse reponse-lg"></div>

<p class="question">2. Choisissez deux risques prioritaires et proposez une mesure de prévention ou de reduction.</p>
<div class="reponse reponse-lg"></div>

<div class="synthèse">

### Ma synthèse (a completer après correction)

| Notion | Ma definition | Exemple |
| --- | --- | --- |
| Risque interne | | |
| Risque externe | | |

</div>

<hr class="page-break" />

## Mini-cas Kadalys (Guadeloupe)

<div class="situation">

<div class="situation-title">Kadalys - valorisation de la banane verte</div>

Kadalys transforme la banane rejetée par l'export en actifs cosmetiques. L'entreprise doit arbitrer entre extension export USA, certification bio et modernisation de l'usine.

| Option | Investissement | Delai | Impact marge estimé |
| --- | --- | --- | --- |
| Export USA | 350 k€ | 18 mois | +12 % |
| Certification bio | 90 k€ | 9 mois | +6 % |
| Modernisation usine | 220 k€ | 12 mois | +9 % |

</div>

<p class="question">1. Quel horizon de décision convient a ce mini-cas ?</p>
<div class="reponse"></div>

<p class="question">2. Quels risques internes et externes identifiez-vous ?</p>
<div class="reponse reponse-lg"></div>

<p class="question">3. Quelle option recommandez-vous avec un argument économique et un argument RSE ?</p>
<div class="reponse reponse-xl"></div>

<div class="synthèse">

### Ma synthèse finale du theme 4

| Competence | Ce que je sais faire maintenant | Preuve dans le mini-cas |
| --- | --- | --- |
| Choisir un horizon | | |
| Piloter performance / risques | | |

</div>

<p class="footer-note">STMG HUB - Theme 4 SDGN - Document élève - UTF-8</p>
"""


PROF_MD = """
<div class="doc-header">

# Theme 4 - Piloter l'activité de l'organisation

<p class="subtitle">Séquence inductive - Document professeur</p>

<p class="doc-meta">SDGN - Premiere STMG | Chapitres 1 et 2 (QdG) | Méthodologie, corrections, synthèse a institutionnaliser</p>

</div>

## Méthodologie inductive (5 phases)

| Phase | Intention prof | Consigne type |
| --- | --- | --- |
| 1. Situation-probleme | Motiver et questionner | « Quel decideur doit trancher et pourquoi ? » |
| 2. Investigation | Documents, calculs, graphiques | Travail en duo, 10 min |
| 3. Debating | Mise en commun des hypotheses | Oral rapide, tableau |
| 4. Institutionnalisation | Definitions validees | Remplir « Synthèse a institutionnaliser » |
| 5. Reinvestissement | Mini-cas Kadalys | Evaluation formative |

<div class="prof-box">

**Progression conseillée** : Séance 1 (temps long) -> Séance 2 (outils de pilotage) -> Séance 3 (performance / cycle de vie) -> Séance 4 (risques) -> Kadalys (synthèse integrative).

</div>

## Tableau de progression

| Séance | Compétences | Situations | Durée |
| --- | --- | --- | --- |
| 1 | Horizon, période, veille | Glaces du Parc, DataWear | 2 h |
| 2 | SR, trésorerie, Gantt, budget | Nova, Bubble Tea, Studio Créatif, salon | 2 h |
| 3 | Performance, cycle de vie | GreenRun | 2 h |
| 4 | Risques | Cartographie GreenRun | 1 h 30 |
| 5 | Reinvestissement | Kadalys | 1 h |

<hr />

## Séance 1 - Corrections

<h3>Glaces du Parc</h3>

<div class="prof-box">

1. Horizon pertinent : **moyen terme** (1 a 3 ans) pour diversifier l'offre (evenements, corners hiver, partenariats).
2. Exemples : produits chauds hors saison, contrats entreprises, reduction saisonniers via formation croisee.
3. **Horizon** = durée couverte par la décision strategique ; **période** = decoupage temporel de gestion (trimestre, mois).

</div>

<h3>DataWear</h3>

<div class="prof-box">

4. Veille : brevets, salons pro, etudes de consommation, benchmark concurrents, reseaux sociaux pro.
5. Investissement R&D majeur : **long terme** (3 a 5 ans) car retour incertain et cout élève.

</div>

<div class="prof-synthèse">

### Synthèse a institutionnaliser - Séance 1

- **Horizon de planification** : durée pendant laquelle une décision structure l'organisation (court, moyen, long terme).
- **Période** : intervalle de gestion choisi pour suivre et comparer les resultats (mois, trimestre, annee).
- **Veille strategique** : collecte et analyse d'informations sur l'environnement pour anticiper les évolutions.

</div>

## Séance 2 - Corrections

<h3>Nova Logistics</h3>

<div class="prof-box">

1. Taux de respect : (1200 - 156) / 1200 = **87 %** (objectif 95 % non atteint).
2. Indicateur : taux de livraison a J+2 ; fréquence : hebdomadaire + alerte quotidienne si &lt; 90 %.

</div>

<h3>Bubble Tea Lyon</h3>

<div class="prof-box">

3. Marge unitaire = 6,50 - 2,80 = 3,70 €. SR = 8400 / 3,70 = **2 270 boissons** (arrondi superieur).
4. 2050 &gt; 2270 : resultat positif, marge de securite d'environ 9 %.

</div>

<h3>Studio Créatif</h3>

<div class="prof-box">

5. Mois le plus risque : **mars** (solde -9 500). Actions : negocier delais fournisseurs, relance clients, decaler investissements non urgents.

</div>

<h3>Gantt et budget</h3>

<div class="prof-box">

6. Dépendance critique : logistique depend de conception stand ; formation depend des deux.
7. Ordre budget : **(b) prévision -> (d) fixation enveloppes -> (a) arbitrage -> (c) suivi mensuel**.

</div>

<div class="prof-synthèse">

### Synthèse a institutionnaliser - Séance 2

- **Seuil de rentabilité (SR)** : volume ou CA minimum pour couvrir les charges fixes.
- **Trésorerie** : flux reels d'encaissements et décaissements (distinct du resultat comptable).
- **Diagramme de Gantt** : representation des taches, durées et chevauchements dans le temps.
- **Budget** : traduction chiffree des choix de pilotage sur une période.

</div>

## Séance 3 - Corrections (GreenRun)

<div class="prof-box">

1. Évolution CA : (465 - 420) / 420 = **+10,7 %**. Marge : (153 - 126) / 126 = **+21,4 %**.
2. Axes : renforcer la force de vente sur le canal bio, optimiser le mix produit a forte marge.
3. Frise : phase **croissance** (hausse CA et parts de marche, investissements marketing possibles).

</div>

<div class="prof-synthèse">

### Synthèse a institutionnaliser - Séance 3

- **Performance** : degre d'atteinte des objectifs fixes (économiques, commerciaux, sociaux, environnementaux).
- **Cycle de vie du produit** : phases (lancement, croissance, maturite, declin) influencant ventes et décisions.

</div>

## Séance 4 - Corrections (risques)

<div class="prof-box">

| Risque | Type |
| --- | --- |
| Rupture fournisseur | Interne |
| Erreur étiquetage | Interne |
| Baisse demande running | Externe |
| Hausse des taux | Externe |
| Dépendance influenceur | Externe |

Priorisation attendue : rupture fournisseur + étiquetage (conformite). Mesures : double sourcing, controle qualite renforce.

</div>

<div class="prof-synthèse">

### Synthèse a institutionnaliser - Séance 4

- **Risque interne** : lie aux processus, ressources, décisions de l'organisation.
- **Risque externe** : lie a l'environnement (marche, réglementation, conjoncture).

</div>

## Mini-cas Kadalys - Correction type

<div class="prof-box">

1. Horizon : **moyen terme** (9 a 18 mois) pour comparer les trois options.
2. Internes : qualite extraction, capacite usine ; externes : réglementation cosmetique USA, concurrence bio, cyclones.
3. Reponse ouverte : modernisation + bio souvent pertinent (marge + RSE). Export USA si financement et distribution securises.

</div>

## Notions transversales a institutionnaliser

<div class="prof-synthèse">

- **Asymetrie d'information** : l'un des acteurs dispose de plus d'informations (ex. fournisseur, plateforme).
- **Pilotage** : mise en coherence des objectifs, indicateurs, décisions et corrections dans le temps.
- **Risque** : evenement incertain pouvant affecter l'atteinte des objectifs.

</div>

## Grille d'evaluation - Synthèse élève

| Critere | Insuffisant (0-5) | Satisfaisant (6-10) | Tres satisfaisant (11-15) |
| --- | --- | --- | --- |
| Definitions | Imprécises ou absentes | Correctes mais peu illustrées | Précises et illustrées par le cas |
| Raisonnement | Sans lien avec la situation | Partiellement argumente | Argumentation complète |
| Outils (SR, Gantt, frise) | Erreurs majeures | Application partielle | Application maîtrisée |
| Prise de décision | Absente | Choix sans justification | Choix justifié (éco + RSE) |

<p class="footer-note">STMG HUB - Theme 4 SDGN - Document professeur - UTF-8</p>
"""


async def main_async() -> None:
    css = load_css()
    pairs = [
        (build_eleve_md(), "SDGN_Theme4_Sequence_ELEVE"),
        (build_prof_md(), "SDGN_Theme4_Sequence_PROF"),
    ]
    for md, stem in pairs:
        html_path, pdf_path = export_pair(md, stem, css)
        await html_to_pdf(html_path, pdf_path)
        size_kb = pdf_path.stat().st_size // 1024
        print(f"OK  {pdf_path.name}  ({size_kb} Ko)")


def main() -> None:
    asyncio.run(main_async())


if __name__ == "__main__":
    main()
