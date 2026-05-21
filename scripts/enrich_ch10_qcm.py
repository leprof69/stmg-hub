# -*- coding: utf-8 -*-
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "scripts/_ch10_qcm_fragment.ts"

ITEMS = [
    ("01", "facile", "Le compte de r\u00e9sultat pr\u00e9sente sur une p\u00e9riode :",
     ["L'actif et le passif au m\u00eame instant", "Les produits et les charges", "Uniquement les stocks", "La part de march\u00e9"], 1),
    ("02", "facile", "A l'actif du bilan, on retrouve surtout :",
     ["Les dettes envers les fournisseurs", "Les emplois de l'organisation", "Le chiffre d'affaires de l'ann\u00e9e", "Les dividendes vers\u00e9s"], 1),
    ("03", "moyen", "Les capitaux propres au passif repr\u00e9sentent :",
     ["Des dettes \u00e0 court terme", "Les ressources appartenant \u00e0 l'entreprise (patrimoine net)", "Le stock de marchandises", "Les ventes du trimestre"], 1),
    ("04", "moyen", "La valeur financi\u00e8re s'appuie principalement sur :",
     ["Le cours de Bourse du jour", "Le patrimoine et la rentabilit\u00e9 issues de la comptabilit\u00e9", "Le nombre d'abonn\u00e9s sur les r\u00e9seaux", "L'objet social uniquement"], 1),
    ("05", "facile", "La valeur boursi\u00e8re d'une soci\u00e9t\u00e9 cot\u00e9e d\u00e9pend surtout :",
     ["Uniquement du dernier bilan comptable", "Des anticipations des investisseurs et du cours de l'action", "Du t\u00e9l\u00e9travail obligatoire", "Du nombre de magasins"], 1),
    ("06", "moyen", "Le r\u00e9sultat d'exploitation se calcule par :",
     ["Actif - passif", "Produits d'exploitation - charges d'exploitation", "Chiffre d'affaires - consommations interm\u00e9diaires", "Dividendes - imp\u00f4ts"], 1),
    ("07", "facile", "Un \u00e9cart entre valeur boursi\u00e8re et valeur financi\u00e8re peut s'expliquer par :",
     ["L'absence totale d'investisseurs", "Les anticipations du march\u00e9 (optimisme ou prudence)", "La suppression du bilan", "L'open data"], 1),
    ("08", "moyen", "Les salaires et charges sociales sont :",
     ["Des produits d'exploitation", "Des charges d'exploitation", "Des capitaux propres", "Des actifs incorporels"], 1),
    ("09", "facile", "Le passif du bilan indique :",
     ["Les emplois (stocks, immobilisations...)", "Les ressources (dettes et capitaux propres)", "Le chiffre d'affaires", "La marge commerciale"], 1),
    ("10", "moyen", "Une entreprise cot\u00e9e en Bourse :",
     ["N'a pas de comptabilit\u00e9", "Dispose d'un cours d'action observable sur le march\u00e9", "N'a jamais de valeur boursi\u00e8re", "Supprime le compte de r\u00e9sultat"], 1),
    ("11", "facile", "Parmi ces postes, les produits d'exploitation comprennent :",
     ["Les achats de marchandises", "Les ventes et prestations de services", "Les dotations aux amortissements", "Les int\u00e9r\u00eats d'emprunt"], 1),
    ("12", "moyen", "Analyser le patrimoine (actif - dettes) permet surtout de :",
     ["Fixer le prix psychologique d'un produit", "\u00c9valuer la solvabilit\u00e9 et la valeur financi\u00e8re", "Mesurer la notoriet\u00e9 spontan\u00e9e", "Calculer la valeur ajout\u00e9e"], 1),
    ("13", "facile", "Les cr\u00e9ances clients \u00e0 l'actif correspondent :",
     ["\u00c0 des dettes envers les fournisseurs", "\u00c0 des sommes que des clients doivent encore r\u00e9gler", "Au capital social", "Aux dividendes \u00e0 payer"], 1),
    ("14", "facile", "Les dettes fournisseurs au passif repr\u00e9sentent :",
     ["Des ventes d\u00e9j\u00e0 encaiss\u00e9es", "Des sommes encore dues aux fournisseurs", "Le r\u00e9sultat net de l'exercice", "Les actions en circulation"], 1),
    ("15", "moyen", "Le cours d'une action en Bourse r\u00e9sulte surtout :",
     ["D'une d\u00e9cision du PDG seul", "De la confrontation entre offre et demande d'actions", "Du montant des stocks", "Du nombre de salari\u00e9s"], 1),
    ("16", "moyen", "La valeur boursi\u00e8re d'une soci\u00e9t\u00e9 se calcule :",
     ["Passif - actif", "Nombre d'actions \u00d7 cours de l'action", "Chiffre d'affaires / effectif", "Capitaux propres + dettes"], 1),
    ("17", "moyen", "Des r\u00e9sultats publi\u00e9s nettement inf\u00e9rieurs aux attentes des analystes tendent \u00e0 :",
     ["Faire monter m\u00e9caniquement le cours", "Inciter certains investisseurs \u00e0 vendre et faire baisser le cours", "Supprimer le compte de r\u00e9sultat", "\u00c9liminer les capitaux propres"], 1),
    ("18", "facile", "Les int\u00e9r\u00eats vers\u00e9s sur un emprunt bancaire sont en g\u00e9n\u00e9ral :",
     ["Une charge d'exploitation", "Une charge financi\u00e8re", "Un produit d'exploitation", "Un actif incorporel"], 1),
    ("19", "facile", "Les stocks de marchandises figurent \u00e0 l'actif car :",
     ["Ce sont des dettes", "Ils ont une valeur pour l'entreprise en attente de vente", "Ils remplacent les capitaux propres", "Ce sont des charges financi\u00e8res"], 1),
    ("20", "moyen", "Une start-up non cot\u00e9e (application en ligne) :",
     ["A un cours de Bourse mis \u00e0 jour chaque seconde", "N'a pas de cours d'action observable sur un march\u00e9 organis\u00e9", "N'a pas de compte de r\u00e9sultat", "N'a pas de clients"], 1),
    ("21", "facile", "Le patrimoine net (capitaux propres) peut s'obtenir par :",
     ["Total actif + total dettes", "Total actif - total dettes", "Produits - charges financi\u00e8res seules", "Cours \u00d7 nombre de clients"], 1),
    ("22", "moyen", "La dotation aux amortissements d'un \u00e9quipement est :",
     ["Un produit financier", "Une charge d'exploitation (usure comptable)", "Un passif", "Une cr\u00e9ance client"], 1),
    ("23", "facile", "Le bilan comptable d'une organisation pr\u00e9sente :",
     ["Uniquement les flux de tr\u00e9sorerie du mois", "La situation patrimoniale \u00e0 une date donn\u00e9e (actif/passif)", "Seulement les ventes", "Uniquement les avis clients"], 1),
    ("24", "moyen", "Comparer valeur financi\u00e8re et valeur boursi\u00e8re sert \u00e0 :",
     ["Mesurer la satisfaction client", "Voir si le march\u00e9 sur\u00e9value ou sous\u00e9value l'entreprise", "Calculer la TVA", "D\u00e9terminer l'objet social"], 1),
]


def main():
    lines = []
    for suffix, diff, q, c, b in ITEMS:
        choix = ", ".join(json.dumps(x, ensure_ascii=False) for x in c)
        lines.append(
            f'  {{ id: "sdgn10-{suffix}", chapter: 10, difficulte: {json.dumps(diff)}, '
            f"question: {json.dumps(q, ensure_ascii=False)}, "
            f"choix: [{choix}] as [string, string, string, string], bonIndex: {b} }},"
        )
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print("written", OUT, len(ITEMS))


if __name__ == "__main__":
    main()
