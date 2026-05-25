# -*- coding: utf-8 -*-
"""
Generate Management ch02-ch15 data with real-org contexts.
Run: python scripts/bootstrap_management_real.py
Then: python scripts/build_management_real_all.py
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))

from management_real_orgs import REAL_ORGS_BY_CHAPTER  # noqa: E402

OUT = ROOT / "scripts/management_real_chapters"


def j(s: str) -> str:
    return json.dumps(s, ensure_ascii=True)


def org_profile(org: str) -> str:
    p = {
        "Etsy": "marketplace mondiale d'artisanat et vintage",
        "Vinted": "plateforme de seconde main entre particuliers",
        "Amazon": "leader du e-commerce",
        "BlaBlaCar": "plateforme de covoiturage",
        "Airbnb": "plateforme de location courte dur\u00e9e",
        "Booking.com": "site de r\u00e9servation h\u00f4ti\u00e8re",
        "SNCF Connect": "billetterie digitale SNCF",
        "Uber": "plateforme de mobilit\u00e9 VTC",
        "Doctolib": "service de prise de rendez-vous sant\u00e9",
        "Stripe": "fintech de paiement en ligne",
        "Accor": "groupe h\u00f4telier international",
        "Michelin": "industriel du pneu et services mobilit\u00e9",
        "Schneider Electric": "equipementier \u00e9lectrique",
        "Saint-Gobain": "groupe mat\u00e9riaux de construction",
        "LVMH": "conglomer\u00e9 du luxe",
        "Renault": "constructeur automobile",
        "Safran": "equipementier a\u00e9ronautique",
        "Airbus": "constructeur a\u00e9ronautique",
        "TotalEnergies": "compagnie \u00e9nerg\u00e9tique",
        "BNP Paribas": "banque de d\u00e9tail et d'investissement",
        "Cr\u00e9dit Agricole": "r\u00e9seau bancaire coop\u00e9ratif",
        "La Banque Postale": "banque publique",
        "ADEME": "agence publique transition \u00e9cologique",
        "Geodis": "logisticien international",
        "La Poste": "op\u00e9rateur postal et logistique",
        "SNCF": "entreprise ferroviaire publique",
        "Air France": "compagnie a\u00e9rienne",
        "Carrefour": "grande distribution alimentaire",
        "Amazon France": "filiale e-commerce France",
        "Chronopost": "transporteur colis express",
        "DHL": "logisticien international",
        "RATP": "transport public parisien",
        "P\u00f4le emploi": "service public emploi (France Travail)",
        "Mairie de Lille": "collectivit\u00e9 municipale",
        "R\u00e9gion Hauts-de-France": "collectivit\u00e9 r\u00e9gionale",
        "ArcelorMittal": "sid\u00e9rurgiste",
        "L'Or\u00e9al": "cosm\u00e9tique mondiale",
         "Danone": "agroalimentaire",
        "Nestl\u00e9 France": "agroalimentaire",
        "Dassault Aviation": "avionneur",
        "Stellantis": "automobile",
        "INPI": "institution propri\u00e9t\u00e9 industrielle",
        "BPI France": "banque publique investissement",
        "Paul (Groupe Holder)": "boulangeries r\u00e9seau",
        "McDonald's France": "restauration rapide",
        "Elior": "restauration collective",
        "Restos du C\u0153ur": "association aide alimentaire",
        "Mairie de Bordeaux": "collectivit\u00e9 municipale",
        "Sodexo": "restauration et services",
        "Deliveroo": "livraison repas",
        "Mercure": "hotellerie milieu de gamme",
        "CCI Nouvelle-Aquitaine": "chambre de commerce",
        "Les Halles de Bacalan": "halle alimentaire",
        "UCPA": "association sport loisirs",
        "Veolia": "services environnement",
        "Suez": "eau et d\u00e9chets",
        "Tetra Pak": "emballages alimentaires",
        "Les Canaux": "tiers-lieu ESS Paris",
        "Syndicat mixte des d\u00e9chets": "traitement d\u00e9chets intercommunal",
        "Emma\u00fcs": "r\u00e9cup\u00e9ration solidaire",
        "Decathlon": "distribution sport",
        "Loop (TerraCycle)": "consigne emballages",
        "M\u00e9tropole de Lyon": "collectivit\u00e9 territoriale",
        "IKEA France": "ameublement",
        "But": "mobilier",
        "Conforama": "ameublement",
        "Leroy Merlin": "bricolage",
        "Habitat": "d\u00e9coration",
        "Office HLM": "office habitat social",
        "Les Compagnons du devoir": "formation m\u00e9tiers",
        "Anah": "agence habitat",
        "Minist\u00e8re du Logement": "administration centrale",
        "Banque des territoires": "financement collectivit\u00e9s",
        "Veolia Propret\u00e9": "propret\u00e9 urbaine",
        "Onet": "propret\u00e9 et s\u00e9curit\u00e9",
        "Secours populaire": "association solidarit\u00e9",
        "Mairie de Nantes": "municipalit\u00e9",
        "Coop\u00e9rative Scop": "entreprise coop\u00e9rative",
        "Orange": "t\u00e9l\u00e9coms",
        "CHU de Toulouse": "h\u00f4pital public",
        "CSE d'Airbus": "comit\u00e9 social \u00e9conomique",
        "Fondation de France": "fondations d'utilit\u00e9 publique",
        "Capgemini": "ESN et conseil",
        "Randstad": "int\u00e9rim et recrutement",
        "Accenture": "conseil et SI",
        "Manpower": "travail temporaire",
        "Secours catholique": "association entraide",
        "Maison de l'emploi": "coordination emploi local",
        "Scop": "mod\u00e8le coop\u00e9ratif",
        "LinkedIn": "r\u00e9seau professionnel",
        "Inspection du travail": "contr\u00f4le droit du travail",
        "URSSAF": "recouvrement social",
        "Revolut": "n\u00e9obanque",
        "Association pour l'emploi des cadres": "APEC emploi cadres",
        "Tr\u00e9sorerie de Paris": "finances Ville de Paris",
        "Nef (Nouvelle \u00e9conomie fraternelle)": "finance \u00e9thique",
        "PayPal": "paiement en ligne",
        "DGFiP": "finances publiques",
        "AMF": "r\u00e9gulateur march\u00e9s financiers",
        "Banque de France": "banque centrale",
        "Kiabi": "pr\u00eat-\u00e0-porter familial",
        "H&M": "fast fashion",
        "Zara": "mode rapide Inditex",
        "Uniqlo": "basics japonais",
        "Celio": "mode masculine",
        "Etam": "lingerie et mode",
        "Lacoste": "sportswear premium",
        "Nike": "equipementier sportif",
        "Petit Bateau": "mode enfant",
        "Monoprix": "supermarch\u00e9 urbain",
        "Galeries Lafayette": "grand magasin",
        "Patagonia": "outdoor engag\u00e9",
        "Greenpeace": "ONG environnement",
        "DGCCRF": "r\u00e9pression fraudes",
        "Biocoop": "r\u00e9seau bio coop\u00e9ratif",
        "Too Good To Go": "anti-gaspillage",
        "Amnesty International": "droits humains",
        "Comit\u00e9 d'\u00e9thique Danone": "gouvernance \u00e9thique",
        "CSE de L'Or\u00e9al": "instances salari\u00e9s",
        "Atos": "ESN europ\u00e9enne",
        "Sopra Steria": "ESN fran\u00e7aise",
        "Blablacar": "mobilit\u00e9 partag\u00e9e",
        "France Travail": "service public emploi",
        "Mairie de Grenoble": "municipalit\u00e9",
        "Orange Cyberdefense": "cybers\u00e9curit\u00e9",
        "Microsoft France": "tech et cloud",
        "Google France": "services num\u00e9riques",
        "La Quadrature du Net": "libert\u00e9s num\u00e9riques",
        "CNIL": "protection donn\u00e9es",
        "Wikimedia France": "contenus libres",
        "Amazon Web Services": "cloud AWS",
        "ANSSI": "cybers\u00e9curit\u00e9 \u00c9tat",
        "Comit\u00e9 d'\u00e9thique Orange": "comit\u00e9 \u00e9thique",
        "Universit\u00e9 Paris-Saclay": "universit\u00e9",
        "Commission europ\u00e9enne (RGPD)": "cadre europ\u00e9en donn\u00e9es",
    }
    return p.get(org, f"acteur \u00e9conomique fran\u00e7ais ({org})")


# (title_suffix, notion, scenario_sentence, consigne_verb)
TOPICS: dict[int, list[tuple[str, str, str, str]]] = {}

def T(title, notion, scenario, consigne="analyse"):
    return (title, notion, scenario, consigne)

TOPICS[2] = [
    T("Les trois composantes du mod\u00e8le \u00e9conomique", "mod\u00e8le \u00e9conomique", "pr\u00e9sente aux investisseurs comment elle cr\u00e9e et capture de la valeur (clients, ressources, revenus)."),
    T("Cr\u00e9ation de valeur pour le client", "cr\u00e9ation de valeur", "d\u00e9crit une transaction o\u00f9 le client per\u00e7oit un b\u00e9n\u00e9fice sup\u00e9rieur au prix gr\u00e2ce au service."),
    T("Innovation produit", "innovation produit", "lance une offre enrichie (personnalisation, nouvelle gamme) avec r\u00e9sultats mesur\u00e9s sur six mois."),
    T("Innovation de mod\u00e8le \u00e9conomique", "innovation BM", "diversifie ses sources de revenus tout en conservant l'activit\u00e9 historique."),
    T("Mod\u00e8le freemium", "freemium", "combine offre gratuite et offre payante premium avec taux de conversion suivi."),
    T("Mod\u00e8le plateforme", "plateforme", "met en relation deux parties et pr\u00e9l\u00e8ve une commission sur les transactions."),
    T("Valeur ajout\u00e9e et r\u00e9sultat", "valeur ajout\u00e9e", "publie CA, consommations interm\u00e9diaires, charges de personnel et r\u00e9sultat d'exploitation."),
    T("Rentabilit\u00e9 \u00e9conomique", "ROE", "communique ROE et marge nette compar\u00e9s au secteur."),
    T("Comparaison de mod\u00e8les num\u00e9riques", "mod\u00e8les num\u00e9riques", "illustre son mod\u00e8le num\u00e9rique face \u00e0 deux concurrents du digital."),
    T("Synth\u00e8se business model", "business model", "pr\u00e9sente l'\u00e9volution de son BM et les KPI de cr\u00e9ation de valeur."),
    T("\u00c9tude de cas : concurrence", "concurrence", "fait face \u00e0 une pression concurrentielle ; options strat\u00e9giques A \u00e0 D \u00e0 arbitrer."),
    T("\u00c9tude de cas : valorisation", "valorisation", "pr\u00e9pare un dossier investisseurs avec indicateurs de cr\u00e9ation de valeur."),
]
TOPICS[3] = [
    T("Autofinancement", "autofinancement", "affecte une partie de ses r\u00e9serves au financement d'un investissement sans emprunt."),
    T("Emprunt bancaire", "emprunt", "contracte un cr\u00e9dit long terme pour financer des \u00e9quipements (montant, taux, annuit\u00e9s)."),
    T("Cr\u00e9dit-bail", "cr\u00e9dit-bail", "acquiert du mat\u00e9riel via leasing avec option d'achat en fin de contrat."),
    T("Subventions publiques", "subventions", "obtient une aide publique pour un projet d\u00e9carbonation ou d'innovation."),
    T("Arbitrage financement", "arbitrage", "compare autofinancement, emprunt et autres sources pour un projet de 20 M\u20ac."),
    T("Bilan fonctionnel", "bilan fonctionnel", "pr\u00e9sente ressources stables et emplois stables pour l'\u00e9quilibre structurel."),
    T("Fonds de roulement", "FR", "calcule son FR \u00e0 partir du bilan fonctionnel."),
    T("Besoin en fonds de roulement", "BFR", "analyse stocks, cr\u00e9ances et dettes fournisseurs impactant le BFR."),
    T("Tr\u00e9sorerie nette", "tr\u00e9sorerie", "relie FR, BFR et tr\u00e9sorerie nette dans une situation comment\u00e9e."),
    T("Synth\u00e8se financement", "financement", "monte un plan combinant plusieurs sources pour un investissement."),
    T("\u00c9tude de cas : extension", "investissement", "planifie une extension de site avec besoin de financement chiffr\u00e9."),
    T("\u00c9tude de cas : tr\u00e9sorerie", "tr\u00e9sorerie", "traverse une tension de tr\u00e9sorerie li\u00e9e au cycle d'exploitation."),
]
TOPICS[4] = [
    T("La d\u00e9marche GPEC", "GPEC", "d\u00e9ploie une d\u00e9marche GPEC pour anticiper comp\u00e9tences et effectifs."),
    T("Anticipation quantitative", "anticipation RH", "projette ses effectifs sur trois ans selon l'activit\u00e9."),
    T("Ressources pr\u00e9visibles", "effectifs", "\u00e9value d\u00e9parts retraite et mobilit\u00e9s internes."),
    T("Comp\u00e9tences et qualification", "comp\u00e9tences", "r\u00e9alise un diagnostic qualitatif des comp\u00e9tences critiques."),
    T("Soft skills", "soft skills", "identifie les comp\u00e9tences comportementales n\u00e9cessaires au poste."),
    T("Recrutement", "recrutement", "recrute des profils en tension avec processus structur\u00e9."),
    T("Formation et promotion", "formation", "d\u00e9ploie formation interne et promotions."),
    T("Flexibilit\u00e9 du travail", "flexibilit\u00e9", "organise CDD, int\u00e9rim et temps partiel selon la charge."),
    T("Diagnostic \u00e9carts GPEC", "diagnostic GPEC", "compare besoins futurs et ressources actuelles."),
    T("Synth\u00e8se GPEC", "GPEC", "dresse le bilan GPEC performance \u00e9conomique / capital humain."),
    T("\u00c9tude de cas : projet RH", "GPEC", "projet RH majeur impactant les effectifs (site, digitalisation)."),
    T("\u00c9tude de cas : crise recrutement", "recrutement", "fait face \u00e0 une p\u00e9nurie de candidats sur m\u00e9tiers cl\u00e9s."),
]
TOPICS[5] = [
    T("Innovation de proc\u00e9d\u00e9s", "proc\u00e9d\u00e9s", "investit dans un nouveau proc\u00e9d\u00e9 de fabrication."),
    T("Fabrication unitaire vs s\u00e9rie", "production", "combine petites s\u00e9ries et production de masse selon les gammes."),
    T("Production continue", "production", "organise flux continu ou production par lots."),
    T("Flexibilit\u00e9 productive", "flexibilit\u00e9", "d\u00e9veloppe polyvalence et changements de s\u00e9rie rapides."),
    T("Qualit\u00e9 et rebut", "qualit\u00e9", "pilote taux de rebut et certifications qualit\u00e9."),
    T("Flux pouss\u00e9s et tendus", "flux tendus", "r\u00e9duit stocks en passant vers un flux tendu."),
    T("Workflow et automatisation", "workflow", "automatise des \u00e9tapes avec robots ou logiciels."),
    T("Servuction", "servuction", "implique le client dans la production du service."),
    T("Qualit\u00e9-flexibilit\u00e9-productivit\u00e9", "QFP", "arbitre qualit\u00e9, d\u00e9lais et co\u00fbts."),
    T("Synth\u00e8se production", "production", "bilan organisation de la production."),
    T("\u00c9tude de cas : \u00e9quipement", "investissement", "d\u00e9ploie une ligne ou cellule automatis\u00e9e."),
    T("\u00c9tude de cas : flux tendus", "logistique", "r\u00e9organise flux internes et fournisseurs."),
]
TOPICS[6] = [
    T("Co\u00fbts fixes et variables", "co\u00fbts", "classe charges fixes et variables sur son activit\u00e9 de restauration ou services."),
    T("Seuil de rentabilit\u00e9", "SR", "calcule SR \u00e0 partir de charges fixes et marge sur co\u00fbts variables."),
    T("Marge sur co\u00fbts variables", "marge", "compare rentabilit\u00e9 de deux offres (midi/soir, menus diff\u00e9rents)."),
    T("Point mort en couverts", "point mort", "traduit le SR en nombre de couverts ou clients."),
    T("Effet de levier", "levier", "analyse l'impact d'une variation d'activit\u00e9 sur le r\u00e9sultat."),
    T("Contr\u00f4le co\u00fbts alimentaires", "co\u00fbts alimentaires", "pilote ratio mati\u00e8res / CA et gaspillage."),
    T("Analyse des \u00e9carts", "\u00e9carts", "compare r\u00e9alis\u00e9 et pr\u00e9visionnel sur les co\u00fbts."),
    T("SR et extension", "SR", "\u00e9value faisabilit\u00e9 d'ouverture d'un second point de vente."),
    T("Tableau de bord co\u00fbts", "tableau de bord", "met en place indicateurs de suivi des co\u00fbts."),
    T("Synth\u00e8se contr\u00f4le co\u00fbts", "contr\u00f4le co\u00fbts", "synth\u00e8se outils de pilotage des co\u00fbts."),
    T("\u00c9tude de cas : rentabilit\u00e9", "rentabilit\u00e9", "site ou restaurant avec r\u00e9sultat d\u00e9grad\u00e9 malgr\u00e9 bon CA."),
    T("\u00c9tude de cas : second site", "investissement", "d\u00e9cision d'ouverture d'un second \u00e9tablissement."),
]
TOPICS[7] = [
    T("SI de production ERP/MES", "ERP", "d\u00e9ploie ERP/MES pour piloter production et stocks."),
    T("Automatisation et robots", "robots", "robotise une \u00e9tape de production ou logistique."),
    T("RPA administratif", "RPA", "automatise t\u00e2ches administratives r\u00e9p\u00e9titives."),
    T("D\u00e9mat\u00e9rialisation", "d\u00e9mat\u00e9rialisation", "num\u00e9rise documents et circuits de validation."),
    T("BPM et flux", "BPM", "mod\u00e9lise et optimise flux de travail interservices."),
    T("Industrie 4.0 et IoT", "IoT", "capteurs connect\u00e9s sur lignes ou v\u00e9hicules de collecte."),
    T("Cloud en production", "cloud", "migre applications vers cloud s\u00e9curis\u00e9."),
    T("IA maintenance pr\u00e9dictive", "IA", "maintenance pr\u00e9dictive sur \u00e9quipements critiques."),
    T("ROI investissements num\u00e9riques", "ROI", "calcule retour sur investissement d'un projet SI."),
    T("Synth\u00e8se SI production", "SI", "bilan transformation num\u00e9rique production."),
    T("\u00c9tude de cas : feuille route 4.0", "Industrie 4.0", "plan pluriannuel Industrie 4.0 avec priorit\u00e9s."),
    T("\u00c9tude de cas : cyberattaque", "cybers\u00e9curit\u00e9", "incident cyber impactant MES ou SI production."),
]
TOPICS[8] = [
    T("Taylorisme et organisation rigide", "taylorisme", "organise travail en t\u00e2ches standardis\u00e9es sur ligne ou entrep\u00f4t."),
    T("Flux tendus kanban", "kanban", "cartes kanban pour piloter approvisionnement atelier."),
    T("Lean et VSM", "lean", "cartographie VSM pour r\u00e9duire gaspillages."),
    T("Coordination Mintzberg", "coordination", "m\u00e9canismes de coordination entre services/plateformes."),
    T("Toyotisme", "kaizen", "am\u00e9lioration continue et arr\u00eat de ligne si d\u00e9faut."),
    T("Lean occidental", "lean", "adaptation lean dans contexte europ\u00e9en."),
    T("Goulots TOC", "TOC", "identifie contrainte principale du flux."),
    T("Cellules flexibles", "polyvalence", "cellules polyvalentes sur plusieurs produits."),
    T("Indicateurs pilotage", "KPI production", "TRS, d\u00e9lais, taux de service suivis."),
    T("Synth\u00e8se pilotage", "pilotage", "synth\u00e8se organisation et pilotage production."),
    T("\u00c9tude de cas : retards livraison", "logistique", "retards clients malgr\u00e9 capacit\u00e9 th\u00e9orique suffisante."),
    T("\u00c9tude de cas : usine agile", "agilit\u00e9", "projet nouvelle usine ou plateforme logistique agile."),
]
TOPICS[9] = [
    T("Acteurs internes", "acteurs internes", "cartographie salari\u00e9s, managers, CSE, actionnaires."),
    T("Int\u00e9r\u00eats convergents/divergents", "parties prenantes", "int\u00e9r\u00eats communs et oppos\u00e9s entre acteurs."),
    T("Culture d'organisation", "culture", "valeurs, rituels et normes partag\u00e9es."),
    T("Dynamique de groupe", "groupe", "coh\u00e9sion, r\u00f4les et conflits dans une \u00e9quipe."),
    T("RSE et r\u00e9seaux sociaux", "RSE", "communication RSE et engagement sur r\u00e9seaux."),
    T("Dialogue social et QVT", "QVT", "accords QVT, n\u00e9gociations, instances repr\u00e9sentatives."),
    T("Conflits et m\u00e9diation", "conflits", "m\u00e9diation d'un conflit collectif ou individuel."),
    T("Communaut\u00e9s de pratique", "coop\u00e9ration", "partage de bonnes pratiques entre m\u00e9tiers."),
    T("Engagement collaboratif", "engagement", "outils collaboratifs et taux d'adoption."),
    T("Synth\u00e8se acteurs RSE", "RSE", "synth\u00e8se parties prenantes et responsabilit\u00e9 sociale."),
    T("\u00c9tude de cas : gr\u00e8ve", "gr\u00e8ve", "mouvement social et n\u00e9gociation."),
    T("\u00c9tude de cas : appel d'offres RSE", "RSE", "crit\u00e8res RSE dans un appel d'offres public ou priv\u00e9."),
]
TOPICS[10] = [
    T("Styles Likert", "Likert", "style de direction participatif ou consultatif observ\u00e9."),
    T("Motivation intrins\u00e8que/extrins\u00e8que", "motivation", "leviers motivation selon Herzberg/Maslow."),
    T("R\u00e9mun\u00e9ration fixe/variable", "r\u00e9mun\u00e9ration", "part fixe et variable dans la r\u00e9mun\u00e9ration."),
    T("Mobilisation RH", "mobilisation", "actions pour mobiliser les \u00e9quipes sur un projet."),
    T("Management participatif", "participatif", "implication des \u00e9quipes dans les d\u00e9cisions."),
    T("Feedback et reconnaissance", "reconnaissance", "entretiens, feedback, primes pairs."),
    T("D\u00e9l\u00e9gation", "d\u00e9l\u00e9gation", "d\u00e9l\u00e9gation de responsabilit\u00e9s et autonomie."),
    T("Co\u00fbt d\u00e9motivation", "d\u00e9motivation", "turnover, absent\u00e9isme, co\u00fbt du turnover chiffr\u00e9."),
    T("NAO n\u00e9gociation salariale", "NAO", "n\u00e9gociation annuelle obligatoire salaires."),
    T("Synth\u00e8se direction", "direction", "synth\u00e8se styles et motivation."),
    T("\u00c9tude de cas : turnover", "turnover", "d\u00e9parts massifs de profils cl\u00e9s."),
    T("\u00c9tude de cas : fusion", "fusion", "fusion ou rapprochement et styles de management."),
]
TOPICS[11] = [
    T("Parcours client phygital", "parcours client", "parcours multicanal RO PO entre web et agence/boutique."),
    T("Traces num\u00e9riques 360\u00b0", "big data client", "agr\u00e9gation donn\u00e9es clients multi-canaux."),
    T("Social listening", "veille", "surveillance r\u00e9seaux sociaux et e-r\u00e9putation."),
    T("CRM omnicanal", "CRM", "CRM unifi\u00e9 et parcours client."),
    T("Administration \u00e9lectronique", "e-administration", "d\u00e9marches en ligne pour usagers/clients."),
    T("Conduite du changement", "Kotter", "plan de transformation digitale sur 24 mois."),
    T("R\u00e9sistances au changement", "r\u00e9sistances", "scepticisme des \u00e9quipes face au digital."),
    T("Transformation SI", "SI", "migration core banking ou ERP vers cloud."),
    T("Agilit\u00e9 organisationnelle", "agilit\u00e9", "squads produit, releases fr\u00e9quentes."),
    T("Synth\u00e8se transformation num", "transformation num\u00e9rique", "bilan transformation digitale."),
    T("\u00c9tude de cas : fermeture agences", "conduite changement", "fermeture d'agences/boutiques et accompagnement."),
    T("\u00c9tude de cas : IA et \u00e9thique", "IA", "IA conseiller client et enjeux \u00e9thiques."),
]
TOPICS[12] = [
    T("Communication strat\u00e9gique", "communication strat\u00e9gique", "objectifs coh\u00e9sion interne et image externe."),
    T("Communication interne", "communication interne", "circuits descendant, ascendant, horizontal."),
    T("Communication externe", "communication externe", "campagnes commerciales et institutionnelles."),
    T("Image de marque", "image de marque", "rebranding, logo, identit\u00e9 visuelle."),
    T("Digital et e-r\u00e9putation", "e-r\u00e9putation", "r\u00e9seaux sociaux et gestion avis en ligne."),
    T("Crise communicationnelle", "crise", "scandale ou bad buzz et r\u00e9ponse sous 24-48 h."),
    T("Communication RSE", "RSE", "transparence supply chain et anti-greenwashing."),
    T("Communication int\u00e9gr\u00e9e", "communication int\u00e9gr\u00e9e", "plan 360\u00b0 coh\u00e9rent tous publics."),
    T("Mesure efficacit\u00e9 com", "ROI communication", "KPI notori\u00e9t\u00e9, engagement, ROI campagnes."),
    T("Synth\u00e8se communication", "communication", "synth\u00e8se strat\u00e9gie communication."),
    T("\u00c9tude de cas : boycott", "crise", "boycott li\u00e9 \u00e0 sous-traitance ou conditions travail."),
    T("\u00c9tude de cas : rebranding durable", "greenwashing", "rebranding RSE sans greenwashing."),
]
TOPICS[13] = [
    T("Code de d\u00e9ontologie", "d\u00e9ontologie", "code \u00e9thique et comit\u00e9 d\u00e9ontologie."),
    T("Greenwashing", "greenwashing", "all\u00e9gations environnementales contr\u00f4l\u00e9es."),
    T("RSE washing", "RSE washing", "reporting RSE sinc\u00e8re vs marketing."),
    T("Discrimination recrutement", "discrimination", "objectifs diversit\u00e9 et biais recrutement."),
    T("M\u00e9c\u00e9nat", "m\u00e9c\u00e9nat", "engagement associatif et m\u00e9c\u00e9nat."),
    T("Lanceurs d'alerte", "lanceur d'alerte", "proc\u00e9dure interne signalement."),
    T("\u00c9thique supply chain", "supply chain", "audits sociaux fournisseurs."),
    T("Conflit d'int\u00e9r\u00eats", "conflit d'int\u00e9r\u00eats", "cadeaux fournisseurs et achats."),
    T("Compliance \u00e9thique", "compliance", "formation annuelle compliance."),
    T("Synth\u00e8se \u00e9thique", "\u00e9thique", "\u00e9thique comme avantage strat\u00e9gique."),
    T("\u00c9tude de cas : greenwashing concurrent", "greenwashing", "concurrent sanctionn\u00e9 pour greenwashing."),
    T("\u00c9tude de cas : gouvernance", "gouvernance", "conflit d'int\u00e9r\u00eats au conseil."),
]
TOPICS[14] = [
    T("Nouveaux rapports au travail", "rapports au travail", "autonomie, flexibilit\u00e9, manager-coach."),
    T("T\u00e9l\u00e9travail", "t\u00e9l\u00e9travail", "accord TT, jours \u00e0 distance, \u00e9quipement."),
    T("Droit \u00e0 la d\u00e9connexion", "d\u00e9connexion", "charte mails/Teams hors plages horaires."),
    T("Modes de vie salari\u00e9s", "modes de vie", "enqu\u00eate interne aspirations vie pro/perso."),
    T("Management OKR", "OKR", "objectifs trimestriels et management par r\u00e9sultats."),
    T("Coh\u00e9sion hybride", "coh\u00e9sion", "rituels pr\u00e9sentiel et team building."),
    T("QVT et burn-out", "QVT", "dispositifs bien-\u00eatre et cas burn-out."),
    T("Parit\u00e9 acc\u00e8s TT", "parit\u00e9", "\u00e9cart hommes/femmes acc\u00e8s t\u00e9l\u00e9travail."),
    T("Marque employeur", "marque employeur", "Glassdoor, campagne recrutement TT."),
    T("Synth\u00e8se pr\u00e9sentiel/TT", "arbitrage", "CODIR arbitre ratio pr\u00e9sentiel/t\u00e9l\u00e9travail."),
    T("\u00c9tude de cas : retour bureau", "t\u00e9l\u00e9travail", "retour bureau impos\u00e9 et d\u00e9missions."),
    T("\u00c9tude de cas : crise burn-out", "burn-out", "burn-out et post viral LinkedIn."),
]
TOPICS[15] = [
    T("RGPD principes fondateurs", "RGPD", "registre traitements et bases l\u00e9gales."),
    T("CNIL et sanctions", "CNIL", "contr\u00f4le CNIL et mise en demeure."),
    T("Droits des personnes", "droits RGPD", "acc\u00e8s, rectification, effacement, portabilit\u00e9."),
    T("Cybers\u00e9curit\u00e9", "cybers\u00e9curit\u00e9", "chiffrement, MFA, politique s\u00e9curit\u00e9."),
    T("Violation de donn\u00e9es", "violation", "notification CNIL 72 h et personnes concern\u00e9es."),
    T("Blockchain logs", "blockchain", "POC tra\u00e7abilit\u00e9 acc\u00e8s donn\u00e9es."),
    T("Privacy by design", "privacy by design", "minimisation d\u00e8s la conception produit."),
    T("Sous-traitants art. 28", "sous-traitant", "contrats AWS/h\u00e9bergeur clauses RGPD."),
    T("Sensibilisation s\u00e9curit\u00e9", "phishing", "campagnes anti-phishing salari\u00e9s."),
    T("Synth\u00e8se IA et DPIA", "DPIA", "module IA et analyse d'impact."),
    T("\u00c9tude de cas : contr\u00f4le CNIL", "CNIL", "mise en conformit\u00e9 post-contr\u00f4le."),
    T("\u00c9tude de cas : ransomware", "ransomware", "ran\u00e7ongiciel et crise RGPD-cyber."),
]


def scenario_detail(org: str, ch: int, idx: int, scenario: str) -> str:
    """Build a plausible 3-sentence support."""
    profile = org_profile(org)
    seeds = [
        f"En 2024-2025, {org}, {profile}, {scenario}",
        f"Des donn\u00e9es chiffr\u00e9es internes (CA, effectifs ou volumes selon l'activit\u00e9) permettent d'illustrer la notion au programme de Management STMG.",
        f"La direction de {org} utilise ce cas en formation interne pour relier th\u00e9orie du chapitre {ch} et pratique manag\u00e9riale.",
    ]
    extras = {
        (2, 0): " Commission ou abonnement selon le mod\u00e8le ; effet de r\u00e9seau num\u00e9rique.",
        (6, 1): " Ticket moyen et charges fixes h\u00f4tel ou restaurant selon l'enseigne.",
        (14, 0): " Organisation hybride 2-3 jours t\u00e9l\u00e9travail, management par objectifs.",
        (15, 0): " DPO d\u00e9sign\u00e9, registre RGPD \u00e0 jour, bases l\u00e9gales document\u00e9es.",
    }
    extra = extras.get((ch, idx), "")
    return seeds[0] + extra + " " + seeds[1] + " " + seeds[2]


def build_spec(ch: int, idx: int, org: str, topic: tuple) -> dict:
    title_suf, notion, scenario, consigne_verb = topic
    if title_suf.startswith("\u00c9tude de cas"):
        title = f"{title_suf} : {org}"
    else:
        title = f"{title_suf} chez {org}"
    support = scenario_detail(org, ch, idx, scenario)
    consigne = (
        f"\u00c0 partir du support, {consigne_verb} la situation de {org} "
        f"en mobilisant la notion de {notion}."
    )
    questions = [
        f"D\u00e9finis {notion} selon le cours.",
        f"Comment {org} illustre-t-elle cette notion dans le support ?",
        f"Quelles limites ou recommandations tirer de ce cas ?",
    ]
    if title_suf.startswith("\u00c9tude de cas"):
        questions.append("Quelle d\u00e9cision recommandes-tu ? Justifie.")
    correction = (
        f"1) {notion.capitalize()} :\n"
        f"\u2014 D\u00e9finition et enjeu au programme Management.\n\n"
        f"2) Application {org} :\n"
        f"\u2014 \u00c9l\u00e9ments du support exploit\u00e9s.\n\n"
        f"3) Limites / recommandations :\n"
        f"\u2014 Analyse structur\u00e9e et conclusion."
    )
    attendu = f"D\u00e9finition, application \u00e0 {org}, conclusion argument\u00e9e."
    return {
        "title": title,
        "support": support,
        "consigne": consigne,
        "questions": questions,
        "correction": correction,
        "attendu": attendu,
        "notions": [notion, f"chapitre {ch}"],
    }


def write_ch(ch: int) -> None:
    orgs = REAL_ORGS_BY_CHAPTER[ch]
    topics = TOPICS[ch]
    lines = [
        "# -*- coding: utf-8 -*-",
        f'"""Management chapitre {ch} \u2014 acteurs reels."""',
        "",
        "D = \"\\u2014 \"",
        "",
        "def I(sid, title, **body):",
        "    return {\"sid\": sid, \"title\": title, \"body\": body}",
        "",
        f"CH{ch} = [",
    ]
    sids = [f"e{i}" for i in range(1, 11)] + ["cas1", "cas2"]
    for sid, org, idx, topic in zip(sids, orgs, range(12), topics):
        spec = build_spec(ch, idx, org, topic)
        lines += [
            "    I(",
            f"        {j(sid)},",
            f"        {j(spec['title'])},",
            f"        support={j(spec['support'])},",
            f"        consigne={j(spec['consigne'])},",
            "        questions=[",
        ]
        for q in spec["questions"]:
            lines.append(f"            {j(q)},")
        lines.append("        ],")
        lines.append(f"        correction={j(spec['correction'])},")
        lines.append(f"        attendu={j(spec['attendu'])},")
        lines.append(f"        notions=[{', '.join(j(n) for n in spec['notions'])}],")
        lines.append("    ),")
    lines.append("]")
    lines.append("")
    path = OUT / f"ch{ch:02d}_data.py"
    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"  {path.name}")


def main() -> None:
    for ch in range(2, 16):
        if ch not in TOPICS:
            raise SystemExit(f"missing topics ch{ch}")
        write_ch(ch)
    print("bootstrap done")


if __name__ == "__main__":
    main()
