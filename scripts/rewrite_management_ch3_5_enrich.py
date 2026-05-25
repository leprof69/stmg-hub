# -*- coding: utf-8 -*-
"""Enrichment metadata for Management chapters 3-5."""

D = "\u2014 "

CHAPTER_INTRO = {
    3: (
        "Lumina \u00c9clairage est une PME toulousaine de luminaires LED professionnels "
        "(CA 6,2 M\u20ac, 78 salari\u00e9s) dirig\u00e9e par Nathalie Costa depuis 2018. "
        "Le directeur financier Marc Delorme pilote le montage de financement du projet "
        "d'extension de la ligne d'assemblage automatis\u00e9e (420 000 \u20ac, mise en service "
        "septembre 2025)."
    ),
    4: (
        "LogiTrans est une entreprise de transport routier du Havre (CA 18,4 M\u20ac, 142 salari\u00e9s) "
        "pr\u00e9sid\u00e9e par Philippe Garnier. La DRH Sandrine Morel pilote depuis janvier 2025 "
        "une GPEC li\u00e9e \u00e0 l'ouverture d'une plateforme \u00e0 Rouen et au renouvellement "
        "de la flotte gaz."
    ),
    5: (
        "M\u00e9talPro est une fonderie et m\u00e9canique de pr\u00e9cision \u00e0 Saint-\u00c9tienne "
        "(CA 12,8 M\u20ac, 96 salari\u00e9s) dirig\u00e9e par Laurent Fabre, directeur industriel. "
        "L'usine combine innovation de proc\u00e9d\u00e9s, qualit\u00e9 totale et flexibilit\u00e9 "
        "pour r\u00e9pondre aux exigences automobile et a\u00e9ronautique."
    ),
}


def _meta(ch: int, rows: list) -> tuple:
    ctx, quotes, impact, notions = {}, {}, {}, {}
    for sid, context, quote, cons, notion_list in rows:
        key = (ch, sid)
        ctx[key] = context
        quotes[key] = quote
        impact[key] = cons
        notions[key] = notion_list
    return ctx, quotes, impact, notions


_CH3_ROWS = [
    ("e1", "Le comit\u00e9 financier valide en f\u00e9vrier 2025 la politique de distribution limit\u00e9e des dividendes.", "Nathalie Costa affirme : \u00ab L'\u00e9pargne de Lumina finance notre avenir industriel sans alourdir la dette. \u00bb", "Cons\u00e9quence : 260 000 \u20ac d'autofinancement couvrent 62 % du budget d'extension.", ["autofinancement", "financement interne", "r\u00e9serve"]),
    ("e2", "La Banque Occitane transmet son offre d'emprunt le 8 mars 2025 apr\u00e8s analyse du bilan 2024.", "Marc Delorme rappelle : \u00ab Chaque point de taux p\u00e8se sur notre marge op\u00e9rationnelle. \u00bb", "Cons\u00e9quence : l'emprunt retenu est plafonn\u00e9 \u00e0 57 000 \u20ac dans le montage final.", ["emprunt bancaire", "financement externe", "int\u00e9r\u00eats"]),
    ("e3", "ProLease Sud pr\u00e9sente une simulation cr\u00e9dit-bail en parall\u00e8le de l'offre bancaire fin mars 2025.", "Le DAF estime : \u00ab La flexibilit\u00e9 a un co\u00fbt : 245 000 \u20ac si nous rachetons la ligne. \u00bb", "Cons\u00e9quence : le cr\u00e9dit-bail est \u00e9cart\u00e9 au profit du montage mixte moins co\u00fbteux.", ["cr\u00e9dit-bail", "redevance", "financement externe"]),
    ("e4", "Le dossier \u00ab Industrie Verte \u00bb est d\u00e9pos\u00e9 \u00e0 la R\u00e9gion Occitanie le 18 f\u00e9vrier 2025.", "Nathalie Costa souligne : \u00ab La subvention r\u00e9duit notre d\u00e9pendance aux taux sans diluer le capital. \u00bb", "Cons\u00e9quence : 63 000 \u20ac de subvention s\u00e9curisent 15 % du projet LED.", ["subvention", "financement externe", "aides publiques"]),
    ("e5", "Le CODIR du 15 mars 2025 arbitre le mix interne/externe devant les trois profils d'actionnaires.", "Thomas Leroy plaide : \u00ab Le cr\u00e9dit-bail prot\u00e8ge notre agilit\u00e9 technologique face \u00e0 l'Asie. \u00bb", "Cons\u00e9quence : le montage 54 % interne / 46 % externe satisfait la majorit\u00e9 du board.", ["financement interne", "financement externe", "arbitrage"]),
    ("e6", "L'exercice 2024 est retravaill\u00e9 en bilan fonctionnel pour pr\u00e9parer la lev\u00e9e de fonds bancaire.", "Marc Delorme insiste : \u00ab Le FR doit couvrir durablement le BFR, sinon la tr\u00e9sorerie s'effondre. \u00bb", "Cons\u00e9quence : le FR positif de 290 k\u20ac rassure la Banque Occitane.", ["bilan fonctionnel", "FR", "BFR"]),
    ("e7", "Le contr\u00f4leur de gestion mod\u00e9lise l'impact de l'extension sur le BFR au T4 2025.", "Nathalie Costa alerte : \u00ab Plus nous vendons, plus le BFR nous immobilise de cash. \u00bb", "Cons\u00e9quence : le BFR passe de 490 k\u20ac \u00e0 620 k\u20ac apr\u00e8s investissement.", ["BFR", "cycle d'exploitation", "stocks et cr\u00e9ances"]),
    ("e8", "La direction n\u00e9gocie l'affacturage avec FactorOccitanie en avril 2025.", "Marc Delorme note : \u00ab L'affacturage transforme nos cr\u00e9ances clients en liquidit\u00e9s imm\u00e9diates. \u00bb", "Cons\u00e9quence : 40 % des cr\u00e9ances sont c\u00e9d\u00e9es, r\u00e9duisant le d\u00e9calage de 12 jours.", ["affacturage", "cr\u00e9ances clients", "financement CT"]),
    ("e9", "Le tableau de tr\u00e9sorerie pr\u00e9visionnelle montre un besoin CT de 530 k\u20ac post-projet.", "La banque exige un plan de retour \u00e0 l'\u00e9quilibre sous 18 mois.", "Cons\u00e9quence : le d\u00e9couvert autoris\u00e9 passe de 250 k\u20ac \u00e0 400 k\u20ac.", ["tr\u00e9sorerie nette", "FR", "BFR", "affacturage"]),
    ("e10", "Le m\u00e9mo au board de mars 2025 synth\u00e9tise financement et \u00e9quilibres financiers.", "Nathalie Costa conclut : \u00ab Investir sans piloter le BFR, c'est s\u00e9cher notre tr\u00e9sorerie. \u00bb", "Cons\u00e9quence : les objectifs 2026 fixent une tr\u00e9sorerie positive et un FR > 150 k\u20ac.", ["financement", "FR", "BFR", "tr\u00e9sorerie"]),
    ("cas1", "Dossier d'investissement complet remis aux banques le 22 mars 2025.", "Les associ\u00e9s valident le sc\u00e9nario D (montage mixte) \u00e0 l'unanimit\u00e9.", "Cons\u00e9quence : la ligne LED est command\u00e9e avec clause de d\u00e9caissement par jalons.", ["financement", "investissement", "ROI"]),
    ("cas2", "Crise de tr\u00e9sorerie d\u00e9clench\u00e9e par le retard client Grand Sud (180 k\u20ac) en mai 2025.", "Marc Delorme n\u00e9gocie en urgence avec la Banque Occitane un relais CT de 60 jours.", "Cons\u00e9quence : le plan affacturage int\u00e9gral \u00e9vite le rejet de l'extension par la banque.", ["BFR", "tr\u00e9sorerie", "cycle d'exploitation", "affacturage"]),
]

_CH4_ROWS = [
    ("e1", "Atelier GPEC du 14 janvier 2025 : pr\u00e9sentation des cinq \u00e9tapes aux managers.", "Philippe Garnier affirme : \u00ab Sans GPEC, nous recruterons en urgence ou perdrons des conducteurs cl\u00e9s. \u00bb", "Cons\u00e9quence : la feuille de route RH 2025-2028 est valid\u00e9e par le COMEX.", ["GPEC", "gestion pr\u00e9visionnelle", "strat\u00e9gie"]),
    ("e2", "Projection quantitative des effectifs 2025-2028 diffus\u00e9e en f\u00e9vrier 2025.", "Sandrine Morel rappelle : \u00ab 22 d\u00e9parts retraite imposent un plan de remplacement anticip\u00e9. \u00bb", "Cons\u00e9quence : 36 recrutements nets sont budg\u00e9t\u00e9s sur trois ans.", ["anticipation quantitative", "effectifs", "d\u00e9parts"]),
    ("e3", "Cartographie des comp\u00e9tences TMS et conduite gaz lanc\u00e9e en mars 2025.", "Le responsable formation estime : \u00ab 40 % des conducteurs devront monter en comp\u00e9tence num\u00e9rique. \u00bb", "Cons\u00e9quence : un plan de 1200 h de formation est inscrit au budget.", ["anticipation qualitative", "comp\u00e9tences", "formation"]),
    ("e4", "Diagnostic \u00e9carts RH pr\u00e9sent\u00e9 au CODIR d'avril 2025.", "Philippe Garnier exige : \u00ab Chaque \u00e9cart doit avoir une mesure : recruter, former ou externaliser. \u00bb", "Cons\u00e9quence : trois dispositifs (apprentissage, VAE, recrutement) sont activ\u00e9s.", ["diagnostic \u00e9carts", "mesures GPEC", "ajustements"]),
    ("e5", "Accord de performance sign\u00e9 avec les syndicats CFDT/CGT en mai 2025.", "Sandrine Morel souligne : \u00ab La GPEC n\u00e9goci\u00e9e renforce la l\u00e9gitimit\u00e9 sociale du plan Rouen. \u00bb", "Cons\u00e9quence : le taux d'acceptation des mobilit\u00e9s internes atteint 78 %.", ["dialogue social", "GPEC", "n\u00e9gociation"]),
    ("e6", "Campagne de marque employeur \u00ab Route & Avenir \u00bb lanc\u00e9e en juin 2025.", "Le responsable communication interne vise 200 candidatures conducteurs qualifi\u00e9s.", "Cons\u00e9quence : le co\u00fbt de recrutement baisse de 18 % en six mois.", ["marque employeur", "recrutement", "attractivit\u00e9"]),
    ("e7", "Plan de succession des conducteurs experts \u00e2g\u00e9s de plus de 55 ans valid\u00e9 en juillet 2025.", "Sandrine Morel affirme : \u00ab Transmettre le savoir-faire routier est aussi strat\u00e9gique que renouveler la flotte. \u00bb", "Cons\u00e9quence : douze tandems mentor/rel\u00e8ve sont op\u00e9rationnels.", ["succession", "transmission", "GPEC"]),
    ("e8", "Tableau de bord RH trimestriel int\u00e9gr\u00e9 au pilotage strat\u00e9gique d\u00e8s septembre 2025.", "Philippe Garnier exige un indicateur \u00e9carts comp\u00e9tences TMS \u00e0 chaque COMEX.", "Cons\u00e9quence : les \u00e9carts critiques passent de 14 \u00e0 6 postes en un an.", ["pilotage RH", "indicateurs", "GPEC"]),
    ("e9", "Externalisation partielle de la maintenance informatique TMS \u00e9tudi\u00e9e en octobre 2025.", "Le DSI recommande un partenaire sp\u00e9cialis\u00e9 transport pour gagner du temps.", "Cons\u00e9quence : huit postes data/logistique sont cr\u00e9\u00e9s en interne, le reste externalis\u00e9.", ["externalisation", "comp\u00e9tences", "strat\u00e9gie RH"]),
    ("e10", "Bilan GPEC 2025 pr\u00e9sent\u00e9 au conseil d'administration en d\u00e9cembre 2025.", "Philippe Garnier conclut : \u00ab La GPEC transforme notre strat\u00e9gie en trajectoire RH mesurable. \u00bb", "Cons\u00e9quence : le budget formation 2026 augmente de 22 %.", ["GPEC", "bilan", "strat\u00e9gie"]),
    ("cas1", "Gr\u00e8ve conducteurs de 48 h en mars 2025 sur la plateforme Le Havre.", "Sandrine Morel m\u00e9diation : \u00ab La GPEC doit \u00eatre visible dans les garanties offertes aux conducteurs. \u00bb", "Cons\u00e9quence : un protocole mobilit\u00e9 et formation est sign\u00e9 sous 72 h.", ["crise sociale", "GPEC", "dialogue social"]),
    ("cas2", "Ouverture plateforme Rouen avanc\u00e9e \u00e0 septembre 2026 ; besoin urgent de 18 postes.", "Philippe Garnier active le vivier \u00ab Route & Avenir \u00bb et l'apprentissage.", "Cons\u00e9quence : 14 postes pourvus avant ouverture, 4 encore en formation.", ["recrutement", "GPEC", "d\u00e9ploiement"]),
]

_CH5_ROWS = [
    ("e1", "Comit\u00e9 industriel du 12 janvier 2025 : validation de la cellule soudure laser.", "Laurent Fabre affirme : \u00ab L'innovation de proc\u00e9d\u00e9 double notre cadence sans doubler l'effectif. \u00bb", "Cons\u00e9quence : la productivit\u00e9 soudure progresse de 133 % en pilote.", ["innovation de proc\u00e9d\u00e9s", "productivit\u00e9", "Schumpeter"]),
    ("e2", "Audit qualit\u00e9 client automotive exige un taux de rebut inf\u00e9rieur \u00e0 1,5 % d\u00e8s T2 2025.", "Le responsable qualit\u00e9 lance la d\u00e9marche Six Sigma sur la ligne laser.", "Cons\u00e9quence : le rebut passe de 4,2 % \u00e0 1,1 % en quatre mois.", ["qualit\u00e9 totale", "Six Sigma", "rebuts"]),
    ("e3", "Cellule flexible U5 mise en service en mars 2025 pour petites s\u00e9ries a\u00e9ronautiques.", "Laurent Fabre note : \u00ab La flexibilit\u00e9 est notre r\u00e9ponse aux commandes inf\u00e9rieures \u00e0 50 pi\u00e8ces. \u00bb", "Cons\u00e9quence : les d\u00e9lais de 200 \u00e0 80 pi\u00e8ces sont r\u00e9duits de 40 %.", ["flexibilit\u00e9", "petites s\u00e9ries", "cellule flexible"]),
    ("e4", "Benchmark concurrentiel r\u00e9alis\u00e9 en avril 2025 sur les co\u00fbts de non-qualit\u00e9.", "Le contr\u00f4leur de gestion chiffre 380 000 \u20ac de co\u00fbts cach\u00e9s annuels avant Six Sigma.", "Cons\u00e9quence : le ROI qualit\u00e9 est d\u00e9montr\u00e9 au board en moins de 14 mois.", ["co\u00fbt de la non-qualit\u00e9", "qualit\u00e9", "pilotage"]),
    ("e5", "Plan de maintenance pr\u00e9ventive digitalis\u00e9 d\u00e9ploy\u00e9 sur le parc machines en mai 2025.", "Le chef d'atelier insiste : \u00ab Un arr\u00eat machine co\u00fbte 12 000 \u20ac par jour chez nos clients auto. \u00bb", "Cons\u00e9quence : la disponibilit\u00e9 machines passe de 91 % \u00e0 96 %.", ["maintenance", "disponibilit\u00e9", "production"]),
    ("e6", "Certification ISO 9001:2015 renouvel\u00e9e sans \u00e9cart majeur en juin 2025.", "L'auditeur externe f\u00e9licite la tra\u00e7abilit\u00e9 laser lot par lot.", "Cons\u00e9quence : M\u00e9talPro int\u00e8gre le panel fournisseurs premium d'un \u00e9quipementier.", ["ISO 9001", "certification", "tra\u00e7abilit\u00e9"]),
    ("e7", "Exp\u00e9rimentation TPM sur la ligne fonderie lanc\u00e9e en juillet 2025.", "Les op\u00e9rateurs pilotes r\u00e9duisent les micro-arr\u00eats de 28 % en huit semaines.", "Cons\u00e9quence : le TPM est \u00e9tendu \u00e0 toutes les lignes en 2026.", ["TPM", "am\u00e9lioration continue", "op\u00e9rateurs"]),
    ("e8", "Projet kanban fournisseurs acier d\u00e9marr\u00e9 avec le principal sous-traitant en ao\u00fbt 2025.", "Laurent Fabre vise une r\u00e9duction stocks mati\u00e8res de 25 % sans rupture.", "Cons\u00e9quence : le stock moyen passe de 45 \u00e0 34 jours de consommation.", ["stocks", "flux tendus", "fournisseurs"]),
    ("e9", "Tableau de bord OEE (Overall Equipment Effectiveness) g\u00e9n\u00e9ralis\u00e9 en septembre 2025.", "La direction fixe une cible OEE globale de 82 % contre 71 % actuellement.", "Cons\u00e9quence : trois lignes sous 75 % OEE sont en plan d'action prioritaire.", ["OEE", "indicateurs", "performance industrielle"]),
    ("e10", "Synth\u00e8se strat\u00e9gie production 2025 pr\u00e9sent\u00e9e au conseil en novembre 2025.", "Laurent Fabre conclut : \u00ab Qualit\u00e9, flexibilit\u00e9 et innovation proc\u00e9d\u00e9s sont indissociables. \u00bb", "Cons\u00e9quence : le budget R&D proc\u00e9d\u00e9s 2026 augmente de 15 %.", ["strat\u00e9gie production", "qualit\u00e9", "flexibilit\u00e9"]),
    ("cas1", "Rappel lot critique client a\u00e9ronautique en f\u00e9vrier 2025 (risque soudure).", "La cellule laser est mise en quarantaine 72 h ; enqu\u00eate 8D lanc\u00e9e.", "Cons\u00e9quence : le plan qualit\u00e9 renforc\u00e9 \u00e9vite la d\u00e9satisfaction du contrat cadre.", ["crise qualit\u00e9", "8D", "client a\u00e9ronautique"]),
    ("cas2", "Commande record 12 000 pi\u00e8ces automobile \u00e0 livrer en 10 semaines (septembre 2025).", "Laurent Fabre active heures sup, sous-traitance contr\u00f4l\u00e9e et cellule flexible.", "Cons\u00e9quence : 98,5 % des pi\u00e8ces sont livr\u00e9es \u00e0 temps avec rebut < 1,3 %.", ["flexibilit\u00e9", "pic d'activit\u00e9", "qualit\u00e9"]),
]

_CTX3, _Q3, _I3, NOTIONS3 = _meta(3, _CH3_ROWS)
_CTX4, _Q4, _I4, NOTIONS4 = _meta(4, _CH4_ROWS)
_CTX5, _Q5, _I5, NOTIONS5 = _meta(5, _CH5_ROWS)

CONTEXT = {**_CTX3, **_CTX4, **_CTX5}
QUOTES = {**_Q3, **_Q4, **_Q5}
IMPACT = {**_I3, **_I4, **_I5}
NOTIONS = {**NOTIONS3, **NOTIONS4, **NOTIONS5}


def enrich_support_ch(ch: int, sid: str, base: str) -> str:
    from management_enrich_common import enrich_support

    return enrich_support(
        ch,
        sid,
        base,
        intro=CHAPTER_INTRO.get(ch, ""),
        context=CONTEXT,
        quotes={},
        impact=IMPACT,
    )


def enrich_correction_ch(ch: int, sid: str, corr: str, attendu: str, notions=None) -> str:
    from management_enrich_common import enrich_correction

    return enrich_correction(
        ch,
        sid,
        corr,
        attendu,
        notions or NOTIONS.get((ch, sid), []),
    )
