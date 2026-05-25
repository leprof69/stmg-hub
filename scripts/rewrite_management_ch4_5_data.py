# -*- coding: utf-8 -*-
"""Chapters 4-5 exercise data (imported by rewrite_management_ch2_5_data.py)."""
D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}

CH4 = [
    I(
        "e1",
        "La d\u00e9marche GPEC chez LogiTrans",
        support=(
            "LogiTrans, entreprise de transport routier bas\u00e9e au Havre (142 salari\u00e9s, "
            "CA 18,4 M\u20ac en 2024), lance en janvier 2025 une d\u00e9marche de gestion "
            "pr\u00e9visionnelle des emplois et des comp\u00e9tences (GPEC) pilot\u00e9e par la DRH "
            "Sandrine Morel. Contexte strat\u00e9gique : ouverture d'une plateforme logistique \u00e0 "
            "Rouen en 2026, renouvellement de 40 % de la flotte (camions gaz), digitalisation "
            "de la planification des tourn\u00e9es. La GPEC doit anticiper les besoins en RH sur "
            "3 \u00e0 5 ans (quantitatif et qualitatif), comparer aux ressources pr\u00e9visibles "
            "et d\u00e9finir les ajustements. Premi\u00e8re r\u00e9union : pr\u00e9sentation du "
            "sch\u00e9ma en 5 \u00e9tapes (strat\u00e9gie \u2192 besoins \u2192 ressources \u2192 "
            "diagnostic \u00e9carts \u2192 mesures). Le PDG Philippe Garnier insiste : "
            "\u00ab sans GPEC, nous recruterons en urgence ou perdons des conducteurs cl\u00e9s \u00bb."
        ),
        consigne=(
            "Pr\u00e9sente la d\u00e9marche GPEC de LogiTrans et explique pourquoi elle s'impose "
            "face aux choix strat\u00e9giques annonc\u00e9s."
        ),
        questions=[
            "Qu'est-ce que la GPEC et quelles \u00e9tapes composent la d\u00e9marche ?",
            "Quels choix strat\u00e9giques de LogiTrans justifient une GPEC en 2025 ?",
            "Quels facteurs d'environnement la GPEC doit-elle int\u00e9grer selon le cours ?",
        ],
        correction=(
            "1) GPEC :\n"
            "D\u00e9marche anticipant les besoins RH quantitatifs et qualitatifs sur 3-5 ans, "
            "compar\u00e9s aux ressources pr\u00e9visibles, pour d\u00e9finir les ajustements.\n\n"
            "2) Choix strat\u00e9giques LogiTrans :\n"
            f"{D}Plateforme Rouen 2026 : nouveaux postes logistique et encadrement.\n"
            f"{D}Renouvellement flotte gaz : comp\u00e9tences maintenance et conduite.\n"
            f"{D}Digitalisation tourn\u00e9es : mont\u00e9e en comp\u00e9tences num\u00e9riques.\n\n"
            "3) Facteurs d'environnement :\n"
            f"{D}Changements technologiques (TMS, v\u00e9hicules gaz).\n"
            f"{D}\u00c9volution d\u00e9mographique (d\u00e9parts retraite conducteurs).\n"
            f"{D}\u00c9volution r\u00e9glementaire (RSE transport, FCO)."
        ),
        attendu="GPEC d\u00e9finie, \u00e9tapes identifi\u00e9es, lien strat\u00e9gie-RH clair.",
        notions=["GPEC", "gestion pr\u00e9visionnelle", "strat\u00e9gie"],
    ),
    I(
        "e2",
        "Anticipation quantitative des besoins en effectifs",
        support=(
            "L'\u00e9quipe RH de LogiTrans projette les effectifs n\u00e9cessaires 2025-2028. "
            "Effectif actuel (janvier 2025) : 142 salari\u00e9s (98 conducteurs, 22 manutentionnaires, "
            "12 dispatchers, 10 administratifs). Sc\u00e9nario strat\u00e9gique retenu : plateforme "
            "Rouen (+18 postes manutention/dispatch en 2026), flotte +15 camions (+15 conducteurs), "
            "si\u00e8ge digitalisation (+3 data analysts). Besoins bruts 2028 : 178 salari\u00e9s. "
            "D\u00e9parts pr\u00e9visibles : 22 d\u00e9parts retraite (dont 16 conducteurs d'ici 2027), "
            "8 d\u00e9missions moyennes/an, 5 fins CDD/an. Recrutements pr\u00e9vus hors GPEC : 4 "
            "alternants/an. Sandrine Morel calcule l'\u00e9cart quantitatif net \u00e0 combler par "
            "recrutement externe, mobilit\u00e9 interne ou flexibilit\u00e9 (int\u00e9rimaires)."
        ),
        consigne=(
            "Analyse l'anticipation quantitative des besoins RH de LogiTrans. Calcule l'\u00e9cart "
            "entre besoins anticip\u00e9s et ressources pr\u00e9visibles."
        ),
        questions=[
            "Comment une organisation anticipe-t-elle ses besoins quantitatifs en RH ?",
            "Calcule le besoin net de recrutement de LogiTrans d'ici 2028.",
            "Quelles mesures d'ajustement quantitatif le cours propose-t-il ?",
        ],
        correction=(
            "1) Anticipation quantitative :\n"
            "Projection des effectifs n\u00e9cessaires selon la strat\u00e9gie (implantations, volumes, "
            "technologie), sur 3-5 ans.\n\n"
            "2) Calcul LogiTrans :\n"
            f"{D}Besoin cible 2028 : 178 salari\u00e9s.\n"
            f"{D}D\u00e9parts pr\u00e9visibles : ~22 retraites + d\u00e9missions/fins CDD.\n"
            f"{D}\u00c9cart net : croissance +36 postes + remplacements retraites (~16 conducteurs).\n"
            f"{D}Recrutement externe estim\u00e9 : ~45-50 personnes sur 3 ans.\n\n"
            "3) Mesures d'ajustement quantitatif :\n"
            f"{D}Recrutement, licenciement, mobilit\u00e9 g\u00e9ographique.\n"
            f"{D}Flexibilit\u00e9 : CDD, int\u00e9rim, temps partiel, heures suppl\u00e9mentaires."
        ),
        attendu="Besoins quantitatifs projet\u00e9s, calcul d'\u00e9cart, mesures identifi\u00e9es.",
        notions=["GPEC quantitative", "effectifs", "recrutement"],
    ),
    I(
        "e3",
        "\u00c9valuation quantitative des ressources pr\u00e9visibles",
        support=(
            "Pour \u00e9valuer les ressources quantitatives pr\u00e9visibles, LogiTrans analyse "
            "sa pyramide des \u00e2ges (f\u00e9vrier 2025) : 38 % des conducteurs ont plus de 50 ans, "
            "12 % ont moins de 30 ans. Taux de rotation global 2024 : 11 % (16 d\u00e9missions sur "
            "142). Taux d'absent\u00e9isme : 6,2 % (vs 5,1 % secteur). 14 salari\u00e9s en temps "
            "partiel (dont 8 conducteurs). 6 CDD longue dur\u00e9e en manutention. Projection : "
            "sans recrutement, l'effectif passerait de 142 \u00e0 118 en 2028 (d\u00e9parts retraite "
            "non compens\u00e9s). Le taux de rotation \u00e9lev\u00e9 chez les dispatchers (18 %) "
            "signale un risque sur la digitalisation. Sandrine Morel utilise ces indicateurs sociaux "
            "pour estimer les ressources pr\u00e9visibles et alimenter le diagnostic d'\u00e9carts."
        ),
        consigne=(
            "Explique comment LogiTrans \u00e9value ses ressources humaines pr\u00e9visibles sur "
            "le plan quantitatif. Interpr\u00e8te les indicateurs sociaux."
        ),
        questions=[
            "Quels indicateurs sociaux permettent de projeter les effectifs futurs ?",
            "Interpr\u00e8te la pyramide des \u00e2ges et le taux de rotation de LogiTrans.",
            "Quel \u00e9cart quantitatif le diagnostic r\u00e9v\u00e8le-t-il sans mesures correctives ?",
        ],
        correction=(
            "1) Indicateurs sociaux :\n"
            f"{D}Pyramide des \u00e2ges, taux de rotation, absent\u00e9isme.\n"
            f"{D}D\u00e9parts retraite, fins CDD, d\u00e9missions, temps partiel.\n\n"
            "2) Interpr\u00e9tation LogiTrans :\n"
            f"{D}38 % conducteurs >50 ans : vague retraites imminente.\n"
            f"{D}Rotation 11 % : fuite mod\u00e9r\u00e9e mais co\u00fbteuse (recrutement, formation).\n"
            f"{D}Rotation dispatchers 18 % : risque pour projet digitalisation.\n\n"
            "3) \u00c9cart sans mesures :\n"
            f"{D}Effectif projet\u00e9 118 vs besoin 178 : \u00e9cart \u221260 postes.\n"
            f"{D}Urgence recrutement conducteurs et mont\u00e9e comp\u00e9tences dispatch."
        ),
        attendu="Indicateurs mobilis\u00e9s, interpr\u00e9tation pertinente, \u00e9cart chiffr\u00e9.",
        notions=["pyramide des \u00e2ges", "taux de rotation", "ressources pr\u00e9visibles"],
    ),
    I(
        "e4",
        "Qualification et comp\u00e9tence : diagnostic qualitatif",
        support=(
            "Sur le plan qualitatif, LogiTrans doit \u00e9quiper ses \u00e9quipes pour la conduite "
            "camions gaz (certification FCO \u00e0 jour), la manutention robotis\u00e9e (CACES R489) "
            "et l'utilisation du TMS \u00ab TransPlan \u00bb (comp\u00e9tences num\u00e9riques). "
            "Audit comp\u00e9tences mars 2025 : 62 % conducteurs FCO valide, 28 % formation gaz "
            "n\u00e9cessaire ; 45 % manutentionnaires sans CACES R489 ; 4 dispatchers ma\u00eetrisent "
            "TransPlan sur 12. La qualification d\u00e9signe dipl\u00f4mes et certifications requis "
            "pour acc\u00e9der \u00e0 un emploi ; la comp\u00e9tence combine savoir, savoir-faire et "
            "savoir-\u00eatre en situation de travail. LogiTrans \u00e9tablit un r\u00e9f\u00e9rentiel "
            "de comp\u00e9tences et une cartographie des m\u00e9tiers pour visualiser les \u00e9carts "
            "qualitatifs \u00e0 combler d'ici 2027."
        ),
        consigne=(
            "Distingue qualification et comp\u00e9tence. Analyse les \u00e9carts qualitatifs "
            "identifi\u00e9s chez LogiTrans et les outils de diagnostic mobilis\u00e9s."
        ),
        questions=[
            "Quelle diff\u00e9rence le cours \u00e9tablit-il entre qualification et comp\u00e9tence ?",
            "Identifie les \u00e9carts qualitatifs majeurs chez LogiTrans d'apr\u00e8s l'audit.",
            "\u00c0 quoi servent le r\u00e9f\u00e9rentiel de comp\u00e9tences et la cartographie des m\u00e9tiers ?",
        ],
        correction=(
            "1) Qualification vs comp\u00e9tence :\n"
            f"{D}Qualification : dipl\u00f4mes, titres, certifications requis (FCO, CACES).\n"
            f"{D}Comp\u00e9tence : savoir + savoir-faire + savoir-\u00eatre en situation de travail.\n\n"
            "2) \u00c9carts LogiTrans :\n"
            f"{D}38 % conducteurs sans FCO valide ou formation gaz.\n"
            f"{D}55 % manutentionnaires sans CACES R489 requis.\n"
            f"{D}67 % dispatchers sans ma\u00eetrise TransPlan.\n\n"
            "3) Outils diagnostic :\n"
            f"{D}R\u00e9f\u00e9rentiel : r\u00e9pertorie comp\u00e9tences d\u00e9tenues.\n"
            f"{D}Cartographie m\u00e9tiers : vue d'ensemble des postes et comp\u00e9tences associ\u00e9es."
        ),
        attendu="Distinction qualification/comp\u00e9tence, \u00e9carts chiffr\u00e9s, outils nomm\u00e9s.",
        notions=["qualification", "comp\u00e9tence", "r\u00e9f\u00e9rentiel de comp\u00e9tences"],
    ),
    I(
        "e5",
        "Soft skills et capital humain",
        support=(
            "LogiTrans int\u00e8gre les soft skills dans sa GPEC qualitative. Enqu\u00eate interne "
            "(n=120, avril 2025) : comp\u00e9tences comportementales les plus cit\u00e9es par les "
            "managers : fiabilit\u00e9 (78 %), communication (71 %), adaptabilit\u00e9 (65 %), "
            "esprit d'\u00e9quipe (62 %). Lacunes identifi\u00e9es chez 22 conducteurs r\u00e9cents "
            "(moins de 2 ans) : gestion du stress routier, relation client livraison. Le PDG rappelle "
            "que le capital humain (ensemble des aptitudes et talents rendant les salari\u00e9s "
            "productifs) est un facteur cl\u00e9 de performance. LogiTrans pr\u00e9voit 120 h de "
            "formation soft skills en 2025-2026 (budget 85 000 \u20ac) via un organisme normand. "
            "Objectif : r\u00e9duire le taux de rotation des conducteurs juniors de 14 % \u00e0 9 %."
        ),
        consigne=(
            "Explique le r\u00f4le des soft skills et du capital humain dans la GPEC qualitative "
            "de LogiTrans."
        ),
        questions=[
            "Qu'est-ce qu'une soft skill ? Donne des exemples du support.",
            "Pourquoi LogiTrans cible-t-elle les conducteurs juniors ?",
            "Comment le capital humain contribue-t-il \u00e0 la performance selon le cours ?",
        ],
        correction=(
            "1) Soft skills :\n"
            "Comp\u00e9tences comportementales non techniques, transversales (savoir-\u00eatre) : "
            "fiabilit\u00e9, communication, adaptabilit\u00e9, esprit d'\u00e9quipe, gestion du stress.\n\n"
            "2) Ciblage conducteurs juniors :\n"
            f"{D}Rotation \u00e9lev\u00e9e (14 %) : co\u00fbt recrutement et formation FCO.\n"
            f"{D}Lacunes relation client et stress routier identifi\u00e9es.\n"
            f"{D}Formation soft skills pour fid\u00e9liser et s\u00e9curiser la qualit\u00e9 de service.\n\n"
            "3) Capital humain :\n"
            f"{D}Aptitudes et talents des salari\u00e9s = productivit\u00e9 et comp\u00e9titivit\u00e9.\n"
            f"{D}Investissement formation 85 000 \u20ac = d\u00e9veloppement du capital humain."
        ),
        attendu="Soft skills d\u00e9finies, ciblage justifi\u00e9, capital humain mobilis\u00e9.",
        notions=["soft skills", "capital humain", "comp\u00e9tences comportementales"],
    ),
    I(
        "e6",
        "Processus de recrutement d'un conducteur poids lourd",
        support=(
            "LogiTrans ouvre 8 postes de conducteurs poids lourd (permis C/CE + FCO) pour la "
            "plateforme Rouen. Processus RH (mai-juin 2025) : 1) analyse du besoin (fiche de "
            "poste, comp\u00e9tences gaz souhait\u00e9es) ; 2) sourcing (P\u00f4le Emploi, "
            "indeed, cooptation interne \u2014 3 candidats) ; 3) pr\u00e9s\u00e9lection CV (142 "
            "candidatures, 28 retenues) ; 4) entretiens (12 convoqu\u00e9s, tests psychotechniques) ; "
            "5) d\u00e9cision et proposition (8 embauches, 2 liste d'attente). D\u00e9lai moyen : "
            "52 jours, co\u00fbt moyen par recrutement 3 800 \u20ac (publicit\u00e9, tests, "
            "int\u00e9gration). Sandrine Morel note que le march\u00e9 du conducteur est tendu "
            "en Normandie (1,2 poste vacant pour 1 candidat qualifi\u00e9, source URSSAF 2024). "
            "LogiTrans propose prime d'embauche 1 500 \u20ac et formation gaz aux 4 candidats "
            "sans certification."
        ),
        consigne=(
            "D\u00e9cris et \u00e9value le processus de recrutement de LogiTrans. Explique comment "
            "le recrutement s'inscrit dans la GPEC quantitative."
        ),
        questions=[
            "Quelles \u00e9tapes composent un processus de recrutement ? Rep\u00e8re-les chez LogiTrans.",
            "Quels crit\u00e8res de s\u00e9lection sont mobilis\u00e9s (qualification, comp\u00e9tence) ?",
            "Comment le contexte de tension sur le march\u00e9 influence-t-il la politique RH ?",
        ],
        correction=(
            "1) \u00c9tapes recrutement LogiTrans :\n"
            f"{D}Analyse besoin \u2192 sourcing \u2192 pr\u00e9s\u00e9lection \u2192 entretiens/tests \u2192 d\u00e9cision.\n"
            f"{D}142 candidatures pour 8 postes : march\u00e9 s\u00e9lectif malgr\u00e9 tension.\n\n"
            "2) Crit\u00e8res s\u00e9lection :\n"
            f"{D}Qualification : permis C/CE, FCO obligatoire.\n"
            f"{D}Comp\u00e9tence : tests psychotechniques, formation gaz si lacune.\n"
            f"{D}Cooptation : canal efficace (3 candidats qualifi\u00e9s).\n\n"
            "3) Contexte march\u00e9 :\n"
            f"{D}P\u00e9nurie conducteurs Normandie : prime 1 500 \u20ac, formation gaz offerte.\n"
            f"{D}Recrutement = mesure d'ajustement quantitatif de la GPEC."
        ),
        attendu="Processus structur\u00e9, crit\u00e8res qualification/comp\u00e9tence, contexte march\u00e9.",
        notions=["recrutement", "GPEC", "march\u00e9 du travail"],
    ),
    I(
        "e7",
        "Mesures d'ajustement qualitatif : formation et promotion",
        support=(
            "Pour combler les \u00e9carts qualitatifs, LogiTrans d\u00e9ploie un plan de formation "
            "2025-2027 (budget 420 000 \u20ac). Actions : certification FCO/gaz pour 34 conducteurs "
            "(120 h, 180 000 \u20ac), CACES R489 pour 12 manutentionnaires (40 h, 65 000 \u20ac), "
            "formation TransPlan pour 8 dispatchers (60 h, 95 000 \u20ac). Dispositifs compl\u00e9mentaires : "
            "tutorat (4 conducteurs seniors accompagnent 8 juniors), promotion interne de 2 manutentionnaires "
            "vers chef d'\u00e9quipe Rouen, mobilit\u00e9 professionnelle d'un dispatcher vers "
            "coordinateur TMS. La formation est un investissement immat\u00e9riel maintenant et "
            "d\u00e9veloppant les comp\u00e9tences. LogiTrans mesure l'efficacit\u00e9 : taux de "
            "couverture comp\u00e9tences cible 85 % en 2027 (vs 58 % en 2025)."
        ),
        consigne=(
            "Pr\u00e9sente les mesures d'ajustement qualitatif de LogiTrans. Distingue formation, "
            "tutorat, promotion et mobilit\u00e9 professionnelle."
        ),
        questions=[
            "Quels dispositifs permettent d'adapter les RH sur le plan qualitatif ?",
            "Analyse le plan de formation LogiTrans : cibles, budget, objectifs.",
            "Quel r\u00f4le jouent le tutorat et la promotion interne dans cette GPEC ?",
        ],
        correction=(
            "1) Dispositifs qualitatifs :\n"
            f"{D}Formation (investissement immat\u00e9riel).\n"
            f"{D}Tutorat (transmission comp\u00e9tences).\n"
            f"{D}Promotion professionnelle (postes plus qualifi\u00e9s).\n"
            f"{D}Mobilit\u00e9 professionnelle (changement de m\u00e9tier).\n\n"
            "2) Plan LogiTrans :\n"
            f"{D}420 000 \u20ac sur 3 ans, 3 axes (conduite gaz, manutention, TMS).\n"
            f"{D}Objectif couverture comp\u00e9tences 85 % en 2027.\n\n"
            "3) Tutorat et promotion :\n"
            f"{D}Tutorat : s\u00e9curise mont\u00e9e comp\u00e9tences juniors, r\u00e9duit rotation.\n"
            f"{D}Promotion/mobilit\u00e9 : pourvoit postes Rouen sans recrutement externe."
        ),
        attendu="Dispositifs qualitatifs nomm\u00e9s, plan chiffr\u00e9, tutorat/promotion expliqu\u00e9s.",
        notions=["formation", "tutorat", "promotion professionnelle"],
    ),
    I(
        "e8",
        "Flexibilit\u00e9 quantitative et qualitative du travail",
        support=(
            "LogiTrans d\u00e9veloppe la flexibilit\u00e9 pour absorber les variations d'activit\u00e9 "
            "(saisonnalit\u00e9 portuaire : +25 % volume T3). Flexibilit\u00e9 quantitative : recours "
            "\u00e0 15 int\u00e9rimaires manutention (contrats 3-6 mois), annualisation du temps de "
            "travail pour 20 conducteurs, heures suppl\u00e9mentaires plafonn\u00e9es \u00e0 80 h/an. "
            "Flexibilit\u00e9 qualitative : polyvalence \u2014 8 manutentionnaires form\u00e9s au dispatch "
            "l\u00e9ger, 4 conducteurs habilit\u00e9s messagerie urbaine. T\u00e9l\u00e9travail partiel "
            "pour 6 administratifs (2 jours/semaine). Le CSE valide en juin 2025 un accord de "
            "flexibilit\u00e9. Risques identifi\u00e9s : turnover int\u00e9rimaires (35 %), fatigue "
            "conducteurs (heures sup). Sandrine Morel int\u00e8gre ces dispositifs dans la GPEC "
            "comme alternative aux recrutements permanents pr\u00e9matur\u00e9s."
        ),
        consigne=(
            "Distingue flexibilit\u00e9 quantitative et qualitative. Analyse les dispositifs "
            "de LogiTrans et leurs limites."
        ),
        questions=[
            "Qu'est-ce que la flexibilit\u00e9 quantitative du travail ? Illustre avec LogiTrans.",
            "Qu'est-ce que la flexibilit\u00e9 qualitative ? Donne des exemples du support.",
            "Quels avantages et risques de ces dispositifs pour l'organisation ?",
        ],
        correction=(
            "1) Flexibilit\u00e9 quantitative :\n"
            f"{D}Adaptation des effectifs et du temps aux variations d'activit\u00e9.\n"
            f"{D}LogiTrans : int\u00e9rim, annualisation, heures sup (+25 % T3 portuaire).\n\n"
            "2) Flexibilit\u00e9 qualitative :\n"
            f"{D}Polyvalence, mobilit\u00e9 professionnelle, comp\u00e9tences transversales.\n"
            f"{D}LogiTrans : manutentionnaires/dispatch, conducteurs/messagerie, t\u00e9l\u00e9travail admin.\n\n"
            "3) Avantages et risques :\n"
            f"{D}Avantages : \u00e9vite sur-recrutement permanent, absorbe pics saisonniers.\n"
            f"{D}Risques : turnover int\u00e9rim 35 %, fatigue conducteurs, co\u00fbt heures sup."
        ),
        attendu="Deux flexibilit\u00e9s distingu\u00e9es, exemples pr\u00e9cis, analyse critique.",
        notions=["flexibilit\u00e9 quantitative", "flexibilit\u00e9 qualitative", "int\u00e9rim"],
    ),
    I(
        "e9",
        "Diagnostic des \u00e9carts et plan d'actions GPEC",
        support=(
            "Tableau de bord GPEC LogiTrans (juillet 2025). \u00c9carts quantitatifs : besoin "
            "+36 postes d'ici 2028, ressources pr\u00e9visibles \u221224 sans action \u2192 \u00e9cart "
            "net \u221260. Mesures : 45 recrutements, 15 int\u00e9rimaires, 3 mobilit\u00e9s "
            "g\u00e9ographiques Le Havre\u2192Rouen. \u00c9carts qualitatifs : 42 % conducteurs "
            "sans certification gaz, 55 % manutentionnaires sans CACES, 67 % dispatchers sans "
            "TMS. Mesures : 420 000 \u20ac formation, tutorat, promotion interne. \u00c9carts "
            "comportementaux : rotation juniors 14 %. Mesures : soft skills, prime fid\u00e9lisation. "
            "Le comit\u00e9 de direction valide le plan d'actions triennal le 12 septembre 2025. "
            "Indicateurs de suivi : effectif, taux couverture comp\u00e9tences, rotation, "
            "co\u00fbt moyen recrutement. La GPEC sera r\u00e9vis\u00e9e annuellement."
        ),
        consigne=(
            "Pr\u00e9sente le diagnostic des \u00e9carts GPEC de LogiTrans et le plan d'actions "
            "associ\u00e9 sur les plans quantitatif et qualitatif."
        ),
        questions=[
            "Comment la GPEC aboutit-elle \u00e0 un diagnostic d'\u00e9carts ?",
            "Pr\u00e9sente les \u00e9carts quantitatifs et qualitatifs de LogiTrans et les mesures retenues.",
            "Quels indicateurs permettront de piloter la GPEC dans le temps ?",
        ],
        correction=(
            "1) Diagnostic d'\u00e9carts :\n"
            "Comparaison besoins anticip\u00e9s (strat\u00e9gie + environnement) vs ressources "
            "pr\u00e9visibles \u2192 \u00e9carts quantitatifs et qualitatifs \u2192 mesures d'ajustement.\n\n"
            "2) \u00c9carts et mesures LogiTrans :\n"
            f"{D}Quantitatif : \u221260 \u2192 recrutement 45, int\u00e9rim 15, mobilit\u00e9 3.\n"
            f"{D}Qualitatif : certifications \u2192 formation 420 k\u20ac, tutorat, promotion.\n"
            f"{D}Comportemental : rotation 14 % \u2192 soft skills, prime fid\u00e9lisation.\n\n"
            "3) Indicateurs de pilotage :\n"
            f"{D}Effectif, couverture comp\u00e9tences (cible 85 %), rotation, co\u00fbt recrutement.\n"
            f"{D}R\u00e9vision annuelle de la GPEC."
        ),
        attendu="Diagnostic structur\u00e9, mesures coh\u00e9rentes, indicateurs de suivi.",
        notions=["diagnostic d'\u00e9carts", "plan d'actions", "GPEC"],
    ),
    I(
        "e10",
        "Synth\u00e8se GPEC : performance \u00e9conomique et capital humain",
        support=(
            "Bilan GPEC LogiTrans un an apr\u00e8s lancement (janvier 2026). Effectif : 151 "
            "(+9 vs 2025). Plateforme Rouen : 11 postes pourvus sur 18 pr\u00e9vus. Couverture "
            "comp\u00e9tences : 71 % (cible 85 % en 2027). Rotation globale : 9,8 % (vs 11 %). "
            "Co\u00fbt recrutement moyen : 3 400 \u20ac. Formation d\u00e9ploy\u00e9e : 280 h "
            "(budget 145 000 \u20ac consomm\u00e9). CA 2025 : 19,6 M\u20ac (+6,5 %). Absent\u00e9isme : "
            "5,4 %. Le PDG conclut : \u00ab la GPEC a \u00e9vit\u00e9 des recrutements paniques "
            "et s\u00e9curis\u00e9 notre transition gaz-num\u00e9rique \u00bb. Points de vigilance : "
            "retard Rouen (7 postes), p\u00e9nurie conducteurs persistante, budget formation "
            "sous-consomm\u00e9 (34 %). Sandrine Morel pr\u00e9pare la r\u00e9vision GPEC 2026-2029."
        ),
        consigne=(
            "R\u00e9dige une synth\u00e8se de la GPEC LogiTrans en mobilisant plans quantitatif "
            "et qualitatif, recrutement, flexibilit\u00e9 et capital humain."
        ),
        questions=[
            "Quels r\u00e9sultats quantitatifs la GPEC a-t-elle produits chez LogiTrans ?",
            "Quels r\u00e9sultats qualitatifs et limites restantes ?",
            "En quoi la GPEC contribue-t-elle \u00e0 la performance \u00e9conomique ?",
        ],
        correction=(
            "1) R\u00e9sultats quantitatifs :\n"
            f"{D}Effectif +9, rotation 11 % \u2192 9,8 %.\n"
            f"{D}11/18 postes Rouen pourvus, recrutements ma\u00eetris\u00e9s.\n"
            f"{D}Co\u00fbt recrutement r\u00e9duit (3 800 \u2192 3 400 \u20ac).\n\n"
            "2) R\u00e9sultats qualitatifs :\n"
            f"{D}Couverture comp\u00e9tences 58 % \u2192 71 %.\n"
            f"{D}280 h formation, tutorat d\u00e9ploy\u00e9.\n"
            f"{D}Limites : retard Rouen, budget formation sous-utilis\u00e9.\n\n"
            "3) Performance \u00e9conomique :\n"
            f"{D}CA +6,5 %, absent\u00e9isme en baisse.\n"
            f"{D}Capital humain s\u00e9curis\u00e9 : transition gaz et TMS sans rupture."
        ),
        attendu="Synth\u00e8se \u00e9quilibr\u00e9e r\u00e9sultats/limites, lien GPEC-performance.",
        notions=["GPEC", "capital humain", "performance \u00e9conomique"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : LogiTrans pr\u00e9pare la plateforme Rouen",
        support=(
            "Cas complet LogiTrans (Le Havre, transport routier, 142 \u2192 178 salari\u00e9s vis\u00e9s). "
            "Projet plateforme Rouen : ouverture janvier 2026, 4 200 m\u00b2, 18 postes (8 manutention, "
            "4 dispatch, 3 encadrement, 3 admin). Flotte gaz : 15 camions neufs, certification conducteurs. "
            "TMS TransPlan d\u00e9ploiement Havre+Rouen. Donn\u00e9es RH : pyramide \u00e2ges conducteurs "
            "38 % >50 ans, rotation dispatchers 18 %, 62 % FCO valide. March\u00e9 : 1,2 poste/candidat "
            "conducteur Normandie. Budget GPEC 2025-2028 : recrutement 570 000 \u20ac, formation 420 000 \u20ac, "
            "int\u00e9rim 180 000 \u20ac. CSE impliqu\u00e9, accord flexibilit\u00e9 juin 2025. "
            "Enjeu : \u00e9viter l'ouverture Rouen sans \u00e9quipes qualifi\u00e9es."
        ),
        consigne=(
            "R\u00e9dige une r\u00e9ponse type bac sur la GPEC de LogiTrans pour Rouen. Mobilise : "
            "GPEC, plans quantitatif/qualitatif, recrutement, formation, flexibilit\u00e9, capital humain."
        ),
        questions=[
            "Pr\u00e9sente la d\u00e9marche GPEC appliqu\u00e9e au projet Rouen.",
            "Analyse les \u00e9carts quantitatifs et qualitatifs identifi\u00e9s.",
            "Quelles mesures d'ajustement recommandes-tu (recrutement, formation, flexibilit\u00e9) ?",
            "Comment \u00e9valuer la r\u00e9ussite de la GPEC \u00e0 horizon 2028 ?",
            "Synth\u00e8se (12-15 lignes) : la GPEC est-elle indispensable pour ce projet ?",
        ],
        correction=(
            "1) D\u00e9marche GPEC Rouen :\n"
            f"{D}Anticipation besoins : +18 postes Rouen +15 conducteurs +3 analysts.\n"
            f"{D}Ressources pr\u00e9visibles : retraites, rotation, effectif actuel 142.\n"
            f"{D}Diagnostic \u00e9carts \u2192 plan triennal valid\u00e9 septembre 2025.\n\n"
            "2) \u00c9carts :\n"
            f"{D}Quantitatif : \u221260 sans mesures ; p\u00e9nurie conducteurs.\n"
            f"{D}Qualitatif : FCO/gaz, CACES, TMS ; soft skills juniors.\n\n"
            "3) Mesures recommand\u00e9es :\n"
            f"{D}Recrutement anticip\u00e9 45 postes, prime 1 500 \u20ac.\n"
            f"{D}Formation 420 k\u20ac, tutorat, promotion interne Rouen.\n"
            f"{D}Int\u00e9rim 15 postes, flexibilit\u00e9 annualisation.\n\n"
            "4) \u00c9valuation 2028 :\n"
            f"{D}Effectif cible 178, couverture comp\u00e9tences 85 %, rotation <10 %.\n"
            f"{D}Plateforme Rouen op\u00e9rationnelle avec \u00e9quipes certifi\u00e9es.\n\n"
            "5) Synth\u00e8se :\n"
            "GPEC indispensable : ouverture Rouen sans anticipation = rupture comp\u00e9tences "
            "et \u00e9chec strat\u00e9gique. La d\u00e9marche s\u00e9curise capital humain et performance."
        ),
        attendu="Cas Rouen analys\u00e9 avec toutes les notions chapitre 4, synth\u00e8se argument\u00e9e.",
        notions=["GPEC", "recrutement", "formation", "flexibilit\u00e9"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : Crise de recrutement conducteurs",
        support=(
            "Alerte RH LogiTrans (novembre 2025) : sur 8 postes conducteurs Rouen, seulement 3 "
            "pourvus apr\u00e8s 4 mois de recrutement. Causes : concurrence Transports Normandie "
            "(salaire +8 %), p\u00e9nurie r\u00e9gionale, 2 candidats retenus d\u00e9clinent l'offre "
            "(conditions gaz). Options : (A) relancer recrutement avec prime 2 500 \u20ac ; "
            "(B) mobilit\u00e9 5 conducteurs Le Havre\u2192Rouen (indemnit\u00e9s logement) ; "
            "(C) sous-traitance partielle 6 mois (co\u00fbt 45 000 \u20ac) ; (D) report ouverture "
            "Rouen de 3 mois. CSE inquiet sur surcharge Havre si mobilit\u00e9. Conducteurs seniors "
            "Havre : 6 partent en retraite T1 2026. Sandrine Morel convoque comit\u00e9 GPEC "
            "extraordinaire. KPI : d\u00e9lai recrutement 52 jours, co\u00fbt 3 800 \u20ac, "
            "rotation 9,8 %."
        ),
        consigne=(
            "Analyse la crise de recrutement et propose un plan d'action GPEC. Mobilise recrutement, "
            "mobilit\u00e9 g\u00e9ographique, flexibilit\u00e9, sous-traitance et diagnostic d'\u00e9carts."
        ),
        questions=[
            "Diagnostique les causes de l'\u00e9chec partiel du recrutement Rouen.",
            "Compare les options A, B, C et D (avantages, limites, co\u00fbts).",
            "Quelle strat\u00e9gie combin\u00e9e recommandes-tu au comit\u00e9 GPEC ?",
            "Comment pr\u00e9venir de futures crises similaires ?",
            "Synth\u00e8se (15-18 lignes) : recrutement et GPEC dans un march\u00e9 tendu.",
        ],
        correction=(
            "1) Diagnostic :\n"
            f"{D}March\u00e9 tendu (1,2 poste/candidat), concurrence salariale.\n"
            f"{D}Exigence certification gaz r\u00e9duit vivier.\n"
            f"{D}D\u00e9lai 52 jours trop long pour urgence Rouen.\n\n"
            "2) Comparaison options :\n"
            f"{D}(A) Prime 2 500 \u20ac : acc\u00e9l\u00e8re recrutement, co\u00fbt ponctuel.\n"
            f"{D}(B) Mobilit\u00e9 Havre\u2192Rouen : rapide, risque surcharge Havre.\n"
            f"{D}(C) Sous-traitance 45 k\u20ac : solution temporaire, pas de comp\u00e9tences internes.\n"
            f"{D}(D) Report 3 mois : s\u00e9curise recrutement, retarde strat\u00e9gie.\n\n"
            "3) Strat\u00e9gie combin\u00e9e :\n"
            "Mix B+C imm\u00e9diat (3 mobilit\u00e9s + sous-traitance partielle) + A renforc\u00e9 "
            "+ formation gaz acc\u00e9l\u00e9r\u00e9e. \u00c9viter report total.\n\n"
            "4) Pr\u00e9vention :\n"
            f"{D}Anticipation recrutement 6 mois avant besoin.\n"
            f"{D}Marque employeur, cooptation, partenariat \u00e9coles conduite.\n"
            f"{D}R\u00e9vision GPEC semestrielle.\n\n"
            "5) Synth\u00e8se :\n"
            "En march\u00e9 tendu, la GPEC doit combiner recrutement anticip\u00e9, flexibilit\u00e9 "
            "et mobilit\u00e9 interne. La crise illustre l'\u00e9cart entre plan pr\u00e9visionnel et "
            "r\u00e9alit\u00e9 du march\u00e9 du travail."
        ),
        attendu="Crise analys\u00e9e, options compar\u00e9es, strat\u00e9gie combin\u00e9e et pr\u00e9vention.",
        notions=["recrutement", "mobilit\u00e9 g\u00e9ographique", "GPEC", "sous-traitance"],
    ),
]

CH5 = [
    I(
        "e1",
        "Innovation de proc\u00e9d\u00e9s chez M\u00e9talPro",
        support=(
            "M\u00e9talPro, fonderie et m\u00e9canique de pr\u00e9cision \u00e0 Saint-\u00c9tienne "
            "(96 salari\u00e9s, CA 12,8 M\u20ac), investit en 2024-2025 dans une cellule robotis\u00e9e "
            "de soudure laser (1,2 M\u20ac). L'innovation de proc\u00e9d\u00e9 consiste \u00e0 adopter "
            "de nouvelles m\u00e9thodes de production ou de distribution. Avant : soudure manuelle "
            "(12 pi\u00e8ces/heure, taux rebut 4,2 %). Apr\u00e8s : soudure laser robotis\u00e9e "
            "(28 pi\u00e8ces/heure, rebut 1,1 %). Changements : techniques (laser vs arc), mat\u00e9riel "
            "(robot KUKA, cellule automatis\u00e9e), logiciel (programmation trajectoires CAD/CAM). "
            "Le directeur industriel Laurent Fabre estime un gain de productivit\u00e9 de 133 % et "
            "une am\u00e9lioration qualit\u00e9 mesurable. Schumpeter distingue cinq types d'innovations ; "
            "ici il s'agit d'une nouvelle m\u00e9thode de production."
        ),
        consigne=(
            "D\u00e9finis l'innovation de proc\u00e9d\u00e9 et analyse celle d\u00e9ploy\u00e9e par "
            "M\u00e9talPro. Distingue innovation de produit et innovation de proc\u00e9d\u00e9."
        ),
        questions=[
            "Qu'est-ce qu'une innovation de proc\u00e9d\u00e9 ? Quels changements implique-t-elle ?",
            "Identifie les changements techniques, mat\u00e9riels et logiciels chez M\u00e9talPro.",
            "Quels avantages concurrentiels cette innovation procure-t-elle ?",
        ],
        correction=(
            "1) Innovation de proc\u00e9d\u00e9 :\n"
            "Nouvelle m\u00e9thode de production ou distribution avec changements significatifs "
            "en techniques, mat\u00e9riel et/ou logiciel. Diff\u00e8re de l'innovation produit "
            "(nouveau bien/service).\n\n"
            "2) Changements M\u00e9talPro :\n"
            f"{D}Technique : soudure laser vs arc manuel.\n"
            f"{D}Mat\u00e9riel : robot KUKA, cellule automatis\u00e9e.\n"
            f"{D}Logiciel : programmation CAD/CAM des trajectoires.\n\n"
            "3) Avantages concurrentiels :\n"
            f"{D}Productivit\u00e9 +133 % (12 \u2192 28 pi\u00e8ces/h).\n"
            f"{D}Qualit\u00e9 : rebut 4,2 % \u2192 1,1 %.\n"
            f"{D}Avantage co\u00fbt et d\u00e9lais vs concurrents m\u00e9caniques Loire."
        ),
        attendu="Innovation proc\u00e9d\u00e9 d\u00e9finie, changements identifi\u00e9s, avantages chiffr\u00e9s.",
        notions=["innovation de proc\u00e9d\u00e9", "productivit\u00e9", "Schumpeter"],
    ),
    I(
        "e2",
        "Fabrication unitaire vs production en s\u00e9rie",
        support=(
            "M\u00e9talPro sert deux segments. Segment A (45 % CA) : pi\u00e8ces sur mesure pour "
            "luxe horloger (fabrication unitaire, 1 \u00e0 5 pi\u00e8ces/commande, d\u00e9lai 6 semaines, "
            "marge 38 %). Segment B (55 % CA) : composants standard pour \u00e9lectrom\u00e9nager "
            "(production en s\u00e9rie, 2 000 pi\u00e8ces/lot, d\u00e9lai 10 jours, marge 14 %). "
            "Fabrication unitaire : production pi\u00e8ce par pi\u00e8ce, personnalisation forte, "
            "qualit\u00e9 \u00e9lev\u00e9e, volumes faibles (ex. avion, luxe). Production en s\u00e9rie : "
            "grandes quantit\u00e9s identiques, division du travail, machines d\u00e9di\u00e9es, "
            "co\u00fbt unitaire r\u00e9duit. M\u00e9talPro arbitre ses investissements 2025 : "
            "renforcer l'atelier unitaire (1 poste soudure fine) ou la ligne s\u00e9rie (presse "
            "800 tonnes). Le choix d\u00e9pend de la strat\u00e9gie commerciale et des d\u00e9bouch\u00e9s."
        ),
        consigne=(
            "Compare fabrication unitaire et production en s\u00e9rie \u00e0 partir du d\u00e9coupage "
            "de M\u00e9talPro. Explique les crit\u00e8res de choix du mode de production."
        ),
        questions=[
            "Quelles caract\u00e9ristiques de la fabrication unitaire et de la production en s\u00e9rie ?",
            "Comment M\u00e9talPro combine-t-elle les deux modes ? Chiffre les diff\u00e9rences.",
            "Quels crit\u00e8res guideraient le prochain investissement industriel ?",
        ],
        correction=(
            "1) Caract\u00e9ristiques :\n"
            f"{D}Unitaire : pi\u00e8ce par pi\u00e8ce, personnalisation, faibles volumes, forte VA.\n"
            f"{D}S\u00e9rie : volumes \u00e9lev\u00e9s, division du travail, co\u00fbt unitaire bas.\n\n"
            "2) Combinaison M\u00e9talPro :\n"
            f"{D}Segment A : unitaire, marge 38 %, d\u00e9lai 6 semaines.\n"
            f"{D}Segment B : s\u00e9rie 2 000 pi\u00e8ces/lot, marge 14 %, d\u00e9lai 10 jours.\n"
            f"{D}Dualit\u00e9 strat\u00e9gique : premium vs volume.\n\n"
            "3) Crit\u00e8res investissement :\n"
            f"{D}Potentiel croissance par segment, d\u00e9bouch\u00e9s clients.\n"
            f"{D}Retour sur investissement, flexibilit\u00e9 vs productivit\u00e9."
        ),
        attendu="Deux modes compar\u00e9s, application M\u00e9talPro chiffr\u00e9e, crit\u00e8res d'arbitrage.",
        notions=["fabrication unitaire", "production en s\u00e9rie", "organisation de la production"],
    ),
    I(
        "e3",
        "Production continue et production discontinue",
        support=(
            "M\u00e9talPro op\u00e8re une fonderie sous pression en production continue (four aliment\u00e9 "
            "24 h/24, 6 jours/semaine, 4 800 kg aluminium/jour, arr\u00eat technique 48 h/mois). "
            "Contraintes : travail post\u00e9 (3 \u00e9quipes), maintenance pr\u00e9ventive stricte, "
            "stocks mati\u00e8res premi\u00e8res \u00e9lev\u00e9s. Parall\u00e8lement, l'atelier "
            "usinage CNC fonctionne en production discontinue (8 h/jour, 5 jours/semaine, "
            "interruption possible entre lots). Justification continue : demande stable "
            "automobile (contrat PSA/Stellantis 2024-2028). Justification discontinue : "
            "commandes variables horlogerie/luxe. Laurent Fabre note que la production continue "
            "engendre contraintes sp\u00e9cifiques (nuit, astreinte) tandis que la discontinue "
            "permet d'ajuster les horaires aux attentes clients et au personnel."
        ),
        consigne=(
            "Distingue production continue et discontinue. Analyse les choix de M\u00e9talPro "
            "et leurs contraintes organisationnelles."
        ),
        questions=[
            "Qu'est-ce que la production continue et quand la choisir ?",
            "Qu'est-ce que la production discontinue et quels avantages pour M\u00e9talPro ?",
            "Quelles contraintes sociales et organisationnelles pour chaque mode ?",
        ],
        correction=(
            "1) Production continue :\n"
            "Op\u00e9rations successives sans interruption (fonderie, acier, \u00e9lectricit\u00e9). "
            "Justifi\u00e9e si demande stable ou contrainte technique. M\u00e9talPro : 24 h/6 j, "
            "contrat Stellantis.\n\n"
            "2) Production discontinue :\n"
            "Processus interruptible avant produit fini (smartphones, usinage). "
            "M\u00e9talPro CNC : 8 h/5 j, commandes variables luxe.\n\n"
            "3) Contraintes :\n"
            f"{D}Continue : travail post\u00e9, astreinte, stocks MP, maintenance.\n"
            f"{D}Discontinue : horaires adaptables, flexibilit\u00e9, moindre usure \u00e9quipes."
        ),
        attendu="Continu/discontinu distingu\u00e9s, application M\u00e9talPro, contraintes identifi\u00e9es.",
        notions=["production continue", "production discontinue", "contraintes organisationnelles"],
    ),
    I(
        "e4",
        "Flexibilit\u00e9 productive et polyvalence",
        support=(
            "M\u00e9talPro renforce sa flexibilit\u00e9 pour r\u00e9pondre aux fluctuations de demande "
            "(automobile \u221212 % T1 2025, luxe horloger +18 %). Dispositifs : polyvalence "
            "des op\u00e9rateurs CNC (12 salari\u00e9s form\u00e9s sur 3 machines vs 1 avant), "
            "changement de s\u00e9rie acc\u00e9l\u00e9r\u00e9 (setup 45 min vs 2 h en 2023), "
            "recours \u00e0 8 int\u00e9rimaires qualifi\u00e9s en pic. L'innovation de proc\u00e9d\u00e9s "
            "vise aussi la flexibilit\u00e9 : la cellule laser s'adapte \u00e0 40 r\u00e9f\u00e9rences "
            "sans retooling majeur. Laurent Fabre rappelle que la flexibilit\u00e9 permet de r\u00e9pondre "
            "rapidement aux \u00e9volutions de la demande et de l'environnement. Objectif 2025 : "
            "taux de charge atelier 82 % (vs 71 % en 2024) sans embauche permanente suppl\u00e9mentaire."
        ),
        consigne=(
            "Explique comment M\u00e9talPro d\u00e9veloppe sa flexibilit\u00e9 productive. "
            "Lie innovation de proc\u00e9d\u00e9s et flexibilit\u00e9."
        ),
        questions=[
            "Quels avantages la flexibilit\u00e9 conf\u00e8re-t-elle \u00e0 une organisation selon le cours ?",
            "Quels dispositifs M\u00e9talPro d\u00e9ploie-t-elle pour gagner en flexibilit\u00e9 ?",
            "Comment l'innovation laser contribue-t-elle \u00e0 cette flexibilit\u00e9 ?",
        ],
        correction=(
            "1) Avantages flexibilit\u00e9 :\n"
            "R\u00e9ponse rapide aux fluctuations demande et \u00e9volutions environnement. "
            "Adaptation sans surinvestissement permanent.\n\n"
            "2) Dispositifs M\u00e9talPro :\n"
            f"{D}Polyvalence : 12 op\u00e9rateurs sur 3 machines.\n"
            f"{D}Setup r\u00e9duit : 2 h \u2192 45 min (SMED implicite).\n"
            f"{D}Int\u00e9rim qualifi\u00e9 : 8 int\u00e9rimaires en pic.\n\n"
            "3) Innovation laser :\n"
            f"{D}40 r\u00e9f\u00e9rences sans retooling majeur.\n"
            f"{D}Taux de charge cible 82 % sans embauche permanente."
        ),
        attendu="Flexibilit\u00e9 d\u00e9finie, dispositifs identifi\u00e9s, lien innovation expliqu\u00e9.",
        notions=["flexibilit\u00e9", "polyvalence", "innovation de proc\u00e9d\u00e9s"],
    ),
    I(
        "e5",
        "Qualit\u00e9 et taux de rebut",
        support=(
            "M\u00e9talPro pilote la qualit\u00e9 production via indicateurs SPC (Statistical Process "
            "Control). Segment s\u00e9rie \u00e9lectrom\u00e9nager : taux de rebut 2,8 % (objectif "
            "2,5 %), PPM d\u00e9fauts 1 400 (objectif 1 000). Segment luxe horloger : rebut 0,6 % "
            "(objectif 0,5 %), contr\u00f4le 100 % visuel + CMM (Coordinate Measuring Machine). "
            "Actions qualit\u00e9 2025 : certification ISO 9001:2015 renouvel\u00e9e, formation "
            "5 sens \u00e0 48 op\u00e9rateurs, andon system sur ligne s\u00e9rie (arr\u00eat imm\u00e9diat "
            "si d\u00e9faut). La cellule laser a r\u00e9duit le rebut soudure de 4,2 % \u00e0 1,1 %. "
            "La qualit\u00e9 est un crit\u00e8re de choix du mode de production : fabrication unitaire "
            "permet contr\u00f4le fin pi\u00e8ce par pi\u00e8ce ; s\u00e9rie exige m\u00e9thodes statistiques."
        ),
        consigne=(
            "Analyse la d\u00e9marche qualit\u00e9 de M\u00e9talPro. Explique le lien entre mode "
            "de production et exigences qualit\u00e9."
        ),
        questions=[
            "Quels indicateurs qualit\u00e9 M\u00e9talPro utilise-t-elle ? Interpr\u00e8te-les.",
            "Quelles actions correctives sont d\u00e9ploy\u00e9es en 2025 ?",
            "Comment le mode de production influence-t-il la d\u00e9marche qualit\u00e9 ?",
        ],
        correction=(
            "1) Indicateurs qualit\u00e9 :\n"
            f"{D}Rebut s\u00e9rie 2,8 % (objectif 2,5 %) : \u00e9cart \u00e0 corriger.\n"
            f"{D}PPM 1 400 (objectif 1 000) : d\u00e9fauts par million.\n"
            f"{D}Luxe rebut 0,6 % : contr\u00f4le 100 %, exigence client \u00e9lev\u00e9e.\n\n"
            "2) Actions 2025 :\n"
            f"{D}ISO 9001 renouvel\u00e9e, formation 5 sens, andon system.\n"
            f"{D}Innovation laser : rebut soudure 4,2 % \u2192 1,1 %.\n\n"
            "3) Lien mode production / qualit\u00e9 :\n"
            f"{D}Unitaire : contr\u00f4le pi\u00e8ce par pi\u00e8ce, faible volume.\n"
            f"{D}S\u00e9rie : SPC, m\u00e9thodes statistiques, andon pour r\u00e9activit\u00e9."
        ),
        attendu="Indicateurs interpr\u00e9t\u00e9s, actions identifi\u00e9es, lien mode/qualit\u00e9.",
        notions=["qualit\u00e9", "taux de rebut", "ISO 9001"],
    ),
    I(
        "e6",
        "Flux pouss\u00e9s et flux tendus",
        support=(
            "M\u00e9talPro g\u00e8re deux logiques logistiques. Flux pouss\u00e9s (segment s\u00e9rie "
            "\u00e9lectrom\u00e9nager) : production planifi\u00e9e selon previsions, stocks finis "
            "820 pi\u00e8ces en moyenne (15 jours de vente), commerciaux \u00e9coulent les stocks. "
            "Co\u00fbt stockage : 12 000 \u20ac/mois. Flux tendus (segment luxe horloger) : production "
            "lanc\u00e9e \u00e0 r\u00e9ception commande client, pas de stock fini, d\u00e9lai 6 semaines "
            "annonc\u00e9. Avantage flux tendus : pas de surstock, personnalisation. Inconv\u00e9nient : "
            "d\u00e9calage commande-livraison. En 2025, M\u00e9talPro teste flux tendu sur 3 "
            "r\u00e9f\u00e9rences s\u00e9rie \u00e0 forte variabilit\u00e9 (stocks r\u00e9duits "
            "\u221240 %). Supply chain management vise \u00e0 optimiser flux physiques et "
            "informationnels du fournisseur au client final."
        ),
        consigne=(
            "Compare flux pouss\u00e9s et flux tendus chez M\u00e9talPro. Analyse l'impact "
            "sur co\u00fbts, d\u00e9lais et qualit\u00e9."
        ),
        questions=[
            "D\u00e9finis production en flux pouss\u00e9s et en flux tendus.",
            "Quelle logique M\u00e9talPro applique-t-elle \u00e0 chaque segment ?",
            "Quels avantages et limites de chaque approche dans ce contexte ?",
        ],
        correction=(
            "1) Flux pouss\u00e9s vs tendus :\n"
            f"{D}Pouss\u00e9s : production/stocks pilot\u00e9s en amont, commerciaux \u00e9coulent.\n"
            f"{D}Tendus : production d\u00e9clench\u00e9e par commande client, pas de stock.\n\n"
            "2) Application M\u00e9talPro :\n"
            f"{D}S\u00e9rie \u00e9lectrom\u00e9nager : flux pouss\u00e9s, 820 pi\u00e8ces stock.\n"
            f"{D}Luxe horloger : flux tendus, commande \u2192 production \u2192 livraison.\n\n"
            "3) Avantages et limites :\n"
            f"{D}Pouss\u00e9s : disponibilit\u00e9 imm\u00e9diate, mais co\u00fbt stock 12 k\u20ac/mois.\n"
            f"{D}Tendus : \u00e9conomie stock, personnalisation, mais d\u00e9lai 6 semaines.\n"
            f"{D}Test hybride 2025 : flux tendu sur 3 r\u00e9f. s\u00e9rie (\u221240 % stocks)."
        ),
        attendu="Flux pouss\u00e9s/tendus d\u00e9finis, application par segment, analyse co\u00fbts/d\u00e9lais.",
        notions=["flux pouss\u00e9s", "flux tendus", "supply chain management"],
    ),
    I(
        "e7",
        "Workflow et automatisation des processus",
        support=(
            "M\u00e9talPro d\u00e9ploie un workflow ERP (SAP Production) pour l'atelier administratif "
            "production : commande client \u2192 planification \u2192 lancement fabrication \u2192 "
            "contr\u00f4le qualit\u00e9 \u2192 exp\u00e9dition. Avant : 12 \u00e9changes email/jour, "
            "d\u00e9lai traitement dossier 2,5 jours, erreurs de saisie 3,1 %. Apr\u00e8s workflow "
            "(mars 2025) : t\u00e2ches automatis\u00e9es, visualisation en temps r\u00e9el, "
            "documents associ\u00e9s \u00e0 chaque \u00e9tape, d\u00e9lai 0,8 jour, erreurs 0,4 %. "
            "Le workflow est un outil informatique automatisant processus et flux d'informations. "
            "Gains : productivit\u00e9 administrative, r\u00e9duction d\u00e9lais et risques d'erreurs. "
            "Limite : investissement 180 000 \u20ac, formation 40 salari\u00e9s, r\u00e9sistance "
            "au changement chez 15 % des op\u00e9rateurs seniors."
        ),
        consigne=(
            "Explique le r\u00f4le du workflow dans l'organisation de la production de M\u00e9talPro. "
            "Analyse gains et limites."
        ),
        questions=[
            "Qu'est-ce qu'un workflow et comment am\u00e9liore-t-il la production de services/processus ?",
            "Quels gains M\u00e9talPro a-t-elle obtenus apr\u00e8s d\u00e9ploiement ?",
            "Quelles limites et conditions de r\u00e9ussite identifies-tu ?",
        ],
        correction=(
            "1) Workflow :\n"
            "Outil informatique automatisant processus et flux d'informations entre t\u00e2ches "
            "successives. Visualisation t\u00e2ches et documents pour tous les acteurs.\n\n"
            "2) Gains M\u00e9talPro :\n"
            f"{D}D\u00e9lai dossier 2,5 \u2192 0,8 jour.\n"
            f"{D}Erreurs 3,1 % \u2192 0,4 %.\n"
            f"{D}Productivit\u00e9 administrative, tra\u00e7abilit\u00e9 renforc\u00e9e.\n\n"
            "3) Limites :\n"
            f"{D}Investissement 180 k\u20ac, formation n\u00e9cessaire.\n"
            f"{D}R\u00e9sistance 15 % seniors : conduite du changement indispensable."
        ),
        attendu="Workflow d\u00e9fini, gains chiffr\u00e9s, limites et conduite changement.",
        notions=["workflow", "automatisation", "productivit\u00e9"],
    ),
    I(
        "e8",
        "Servuction et r\u00f4le du client",
        support=(
            "M\u00e9talPro lance en 2025 un service de prototypage rapide pour clients luxe horloger "
            "(servuction : n\u00e9ologisme Eiglier/Langeard, contraction service + production). "
            "Processus : le client transmet plans 3D et contraintes mati\u00e8res \u2192 M\u00e9talPro "
            "propose faisabilit\u00e9 sous 72 h \u2192 validation client \u2192 fabrication 2 semaines "
            "\u2192 livraison. Le client participe \u00e0 la production en fournissant informations "
            "n\u00e9cessaires et validant les \u00e9tapes. Le service est non stockable : une "
            "cr\u00e9neau de prototypage perdu n'est pas r\u00e9cup\u00e9rable. Tarif : 2 800 \u20ac "
            "par prototype (vs 1 200 \u20ac pi\u00e8ce s\u00e9rie). Satisfaction clients servuction : "
            "4,8/5. Laurent Fabre note que la qualit\u00e9 du service d\u00e9pend en partie "
            "de la coop\u00e9ration client, comme un coiffeur a besoin de la description du client."
        ),
        consigne=(
            "Analyse le service de prototypage de M\u00e9talPro \u00e0 la lumi\u00e8re de la servuction. "
            "Explique le r\u00f4le du client dans la production du service."
        ),
        questions=[
            "Qu'est-ce que la servuction et quelles caract\u00e9ristiques de la production de services ?",
            "Comment le client participe-t-il \u00e0 la servuction de prototypage chez M\u00e9talPro ?",
            "Pourquoi le service est-il non stockable et quelles cons\u00e9quences ?",
        ],
        correction=(
            "1) Servuction :\n"
            "Processus de cr\u00e9ation d'un service ; le client est syst\u00e9matiquement impliqu\u00e9. "
            "Service non stockable, parfois consomm\u00e9 en m\u00eame temps qu'il est produit.\n\n"
            "2) Participation client M\u00e9talPro :\n"
            f"{D}Fourniture plans 3D et contraintes mati\u00e8res.\n"
            f"{D}Validation faisabilit\u00e9 et \u00e9tapes interm\u00e9diaires.\n"
            f"{D}Coop\u00e9ration d\u00e9termine qualit\u00e9 du prototype.\n\n"
            "3) Non stockable :\n"
            f"{D}Cr\u00e9neau prototypage perdu = service perdu \u00e0 jamais.\n"
            f"{D}Planification capacit\u00e9 critique ; tarif premium 2 800 \u20ac justifi\u00e9."
        ),
        attendu="Servuction d\u00e9finie, r\u00f4le client analys\u00e9, non-stockabilit\u00e9 expliqu\u00e9e.",
        notions=["servuction", "production de services", "implication client"],
    ),
    I(
        "e9",
        "Concilier qualit\u00e9, flexibilit\u00e9 et productivit\u00e9",
        support=(
            "Tableau de bord industriel M\u00e9talPro T2 2025. Productivit\u00e9 globale : +18 % "
            "vs 2023 (cellule laser + workflow). Flexibilit\u00e9 : setup moyen 52 min, 38 r\u00e9f\u00e9rences "
            "actives/mois (vs 22 en 2023). Qualit\u00e9 : rebut global 1,9 % (objectif 1,5 %), "
            "r\u00e9clamations clients 12/an (vs 19 en 2023). Tension identifi\u00e9e : acc\u00e9l\u00e9ration "
            "cadence s\u00e9rie Stellantis (+8 % volumes T3) vs maintien PPM <1 000. Options : "
            "(A) heures suppl\u00e9mentaires ; (B) investissement contr\u00f4le automatique 220 k\u20ac ; "
            "(C) refus partiel volumes. Le comit\u00e9 choisit B+C : contr\u00f4le auto pour s\u00e9curiser "
            "qualit\u00e9, n\u00e9gociation d\u00e9lai +2 semaines sur 15 % du volume. Innovation "
            "de proc\u00e9d\u00e9s doit rendre l'entreprise productive ET flexible."
        ),
        consigne=(
            "Analyse la conciliation qualit\u00e9/flexibilit\u00e9/productivit\u00e9 chez M\u00e9talPro. "
            "\u00c9value la d\u00e9cision du comit\u00e9."
        ),
        questions=[
            "Quels indicateurs montrent la performance de M\u00e9talPro sur les trois dimensions ?",
            "Quelle tension entre productivit\u00e9 et qualit\u00e9 appara\u00eet ?",
            "La d\u00e9cision B+C est-elle pertinente ? Argumente.",
        ],
        correction=(
            "1) Indicateurs :\n"
            f"{D}Productivit\u00e9 : +18 %, cellule laser 28 pi\u00e8ces/h.\n"
            f"{D}Flexibilit\u00e9 : setup 52 min, 38 r\u00e9f./mois.\n"
            f"{D}Qualit\u00e9 : rebut 1,9 %, r\u00e9clamations 19 \u2192 12.\n\n"
            "2) Tension productivit\u00e9/qualit\u00e9 :\n"
            f"{D}Hausse volumes Stellantis (+8 %) menace PPM objectif 1 000.\n"
            f"{D}Acc\u00e9l\u00e9rer sans investissement qualit\u00e9 = risque rebut et r\u00e9clamations.\n\n"
            "3) D\u00e9cision B+C :\n"
            f"{D}Pertinente : contr\u00f4le auto s\u00e9curise qualit\u00e9 \u00e0 cadence \u00e9lev\u00e9e.\n"
            f"{D}Refus partiel volume pr\u00e9serve r\u00e9putation et \u00e9vite heures sup co\u00fbteuses.\n"
            f"{D}Concilie les trois dimensions sur le long terme."
        ),
        attendu="Trois dimensions analys\u00e9es, tension identifi\u00e9e, d\u00e9cision \u00e9valu\u00e9e.",
        notions=["qualit\u00e9", "flexibilit\u00e9", "productivit\u00e9"],
    ),
    I(
        "e10",
        "Synth\u00e8se : organisation de la production M\u00e9talPro",
        support=(
            "Synth\u00e8se strat\u00e9gie industrielle M\u00e9talPro 2023-2025. Investissements : "
            "cellule laser 1,2 M\u20ac, workflow ERP 180 k\u20ac, contr\u00f4le auto 220 k\u20ac "
            "(pr\u00e9vu T4). Modes de production : unitaire (luxe), s\u00e9rie (\u00e9lectrom\u00e9nager), "
            "continue (fonderie), discontinue (CNC). Logistique : flux pouss\u00e9s/tendus hybrides. "
            "R\u00e9sultats : productivit\u00e9 +18 %, rebut 1,9 %, taux charge 79 %, CA 13,4 M\u20ac "
            "(+4,7 %). Servuction prototypage lanc\u00e9e. Laurent Fabre pr\u00e9pare le plan 2026-2028 "
            "centr\u00e9 sur Industrie 4.0 (IoT capteurs fonderie, maintenance pr\u00e9dictive). "
            "Enjeu : maintenir avantage concurrentiel loir\u00e9en tout en conciliant qualit\u00e9 "
            "et flexibilit\u00e9 dans un contexte de d\u00e9sindustrialisation r\u00e9gionale."
        ),
        consigne=(
            "R\u00e9dige une synth\u00e8se de l'organisation de la production M\u00e9talPro. Mobilise "
            "innovation proc\u00e9d\u00e9s, modes de production, flexibilit\u00e9, qualit\u00e9, logistique."
        ),
        questions=[
            "Quelles innovations de proc\u00e9d\u00e9s M\u00e9talPro a-t-elle d\u00e9ploy\u00e9es et avec quels r\u00e9sultats ?",
            "Comment les modes de production et la logistique s'articulent-ils ?",
            "Quels d\u00e9fis pour 2026-2028 et quelle place pour l'innovation ?",
        ],
        correction=(
            "1) Innovations proc\u00e9d\u00e9s :\n"
            f"{D}Laser : productivit\u00e9 +133 %, rebut soudure \u22123,1 pts.\n"
            f"{D}Workflow : d\u00e9lai dossier \u22121,7 jour, erreurs \u22122,7 pts.\n"
            f"{D}Contr\u00f4le auto pr\u00e9vu : s\u00e9curiser qualit\u00e9 \u00e0 cadence \u00e9lev\u00e9e.\n\n"
            "2) Modes et logistique :\n"
            f"{D}Dualit\u00e9 unitaire/s\u00e9rie/continu/discontinu selon segments.\n"
            f"{D}Flux pouss\u00e9s (s\u00e9rie) et tendus (luxe) optimisent co\u00fbts/d\u00e9lais.\n\n"
            "3) D\u00e9fis 2026-2028 :\n"
            f"{D}Industrie 4.0 : IoT, maintenance pr\u00e9dictive.\n"
            f"{D}Concilier qualit\u00e9, flexibilit\u00e9, productivit\u00e9 dans un march\u00e9 tendu.\n"
            f"{D}Innovation proc\u00e9d\u00e9s = avantage concurrentiel durable."
        ),
        attendu="Synth\u00e8se compl\u00e8te modes/innovations/logistique, perspective 2026-2028.",
        notions=["innovation de proc\u00e9d\u00e9s", "flexibilit\u00e9", "qualit\u00e9", "logistique"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : D\u00e9ploiement de la cellule laser M\u00e9talPro",
        support=(
            "Projet cellule laser M\u00e9talPro (Saint-\u00c9tienne, 2024-2025). Investissement "
            "1,2 M\u00ac, robot KUKA, formation 24 op\u00e9rateurs (480 h), r\u00e9organisation "
            "atelier soudure. Avant/apr\u00e8s : 12\u219228 pi\u00e8ces/h, rebut 4,2\u21921,1 %, "
            "effectif soudure 14\u219211 (polyvalence). R\u00e9sistance syndicale initiale (CGT) "
            "sur suppressions postes, apais\u00e9e par reclassement 3 salari\u00e9s et formation. "
            "Clients : Stellantis satisfait (PPM am\u00e9lior\u00e9), luxe horloger demande soudure "
            "fine laser (nouveau d\u00e9bouch\u00e9). ROI pr\u00e9vu 3,8 ans. Concurrent "
            "M\u00e9canique Loire investit en soudure TIG manuelle renforc\u00e9e. Comit\u00e9 "
            "doit \u00e9valuer si l'innovation de proc\u00e9d\u00e9s atteint ses objectifs "
            "productivit\u00e9, flexibilit\u00e9 et qualit\u00e9."
        ),
        consigne=(
            "R\u00e9dige une r\u00e9ponse type bac sur le projet cellule laser. Mobilise : "
            "innovation proc\u00e9d\u00e9s, flexibilit\u00e9, qualit\u00e9, modes de production, "
            "avantage concurrentiel."
        ),
        questions=[
            "Caract\u00e9rise l'innovation de proc\u00e9d\u00e9 d\u00e9ploy\u00e9e (techniques, mat\u00e9riel, logiciel).",
            "\u00c9value les r\u00e9sultats productivit\u00e9, qualit\u00e9 et flexibilit\u00e9 obtenus.",
            "Analyse l'impact social et la conduite du changement.",
            "M\u00e9talPro dispose-t-elle d'un avantage concurrentiel durable vs M\u00e9canique Loire ?",
            "Synth\u00e8se (12-15 lignes) : bilan du projet cellule laser.",
        ],
        correction=(
            "1) Innovation proc\u00e9d\u00e9 :\n"
            f"{D}Technique : soudure laser vs arc/TIG.\n"
            f"{D}Mat\u00e9riel : robot KUKA, cellule automatis\u00e9e.\n"
            f"{D}Logiciel : programmation trajectoires, 40 r\u00e9f\u00e9rences.\n\n"
            "2) R\u00e9sultats :\n"
            f"{D}Productivit\u00e9 : +133 % (12\u219228 pi\u00e8ces/h).\n"
            f"{D}Qualit\u00e9 : rebut 4,2 % \u2192 1,1 %.\n"
            f"{D}Flexibilit\u00e9 : 40 r\u00e9f\u00e9rences, nouveau d\u00e9bouch\u00e9 luxe.\n\n"
            "3) Impact social :\n"
            f"{D}Effectif soudure 14\u219211, reclassement 3 salari\u00e9s.\n"
            f"{D}Formation 480 h, n\u00e9gociation CGT indispensable.\n\n"
            "4) Avantage concurrentiel :\n"
            f"{D}Oui vs M\u00e9canique Loire (TIG manuel) : productivit\u00e9 et qualit\u00e9 sup\u00e9rieures.\n"
            f"{D}ROI 3,8 ans, PPM Stellantis am\u00e9lior\u00e9.\n\n"
            "5) Synth\u00e8se :\n"
            "Projet r\u00e9ussi sur les trois dimensions (productivit\u00e9, qualit\u00e9, flexibilit\u00e9). "
            "Innovation proc\u00e9d\u00e9s = levier comp\u00e9titivit\u00e9 si conduite du changement ma\u00eetris\u00e9e."
        ),
        attendu="Projet laser analys\u00e9 avec toutes les notions chapitre 5, synth\u00e8se \u00e9quilibr\u00e9e.",
        notions=["innovation de proc\u00e9d\u00e9s", "qualit\u00e9", "flexibilit\u00e9", "productivit\u00e9"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : R\u00e9organisation logistique et flux tendus",
        support=(
            "M\u00e9talPro lance en 2025 un projet supply chain \u00ab Flux Zen \u00bb : extension "
            "flux tendus de 3 \u00e0 12 r\u00e9f\u00e9rences s\u00e9rie, r\u00e9duction stocks finis "
            "820\u2192350 pi\u00e8ces (\u221257 %), \u00e9conomie stockage 6 800 \u20ac/mois. "
            "Conditions : d\u00e9lai client annonc\u00e9 +3 jours, fiabilit\u00e9 planification 95 % "
            "(vs 88 % avant), EDI avec 4 clients majeurs. Risques : rupture si panne fonderie "
            "continue (24 h/24), gr\u00e8ve transporteurs octobre 2025 (retard 5 jours sur 2 "
            "commandes). Segment luxe d\u00e9j\u00e0 en flux tendus int\u00e9gral. Laurent Fabre "
            "doit pr\u00e9senter au board le bilan \u00e0 6 mois : stocks \u221252 %, r\u00e9clamations "
            "d\u00e9lai +4 (vs +1 avant), marge s\u00e9rie +1,2 pt (moindre d\u00e9pr\u00e9ciation stock). "
            "Poursuivre, ajuster ou revenir partiellement aux flux pouss\u00e9s ?"
        ),
        consigne=(
            "Analyse le projet Flux Zen de M\u00e9talPro. Mobilise flux pouss\u00e9s/tendus, "
            "supply chain management, flexibilit\u00e9, qualit\u00e9/d\u00e9lais, servuction si pertinent."
        ),
        questions=[
            "Pr\u00e9sente les objectifs et r\u00e9sultats du projet Flux Zen.",
            "Quels risques les flux tendus ont-ils r\u00e9v\u00e9l\u00e9s chez M\u00e9talPro ?",
            "Compare avantages \u00e9conomiques et co\u00fbt client (d\u00e9lais, r\u00e9clamations).",
            "Recommandes-tu de poursuivre, ajuster ou revenir aux flux pouss\u00e9s ?",
            "Synth\u00e8se (15-18 lignes) : comment concilier flux tendus, flexibilit\u00e9 et fiabilit\u00e9 ?",
        ],
        correction=(
            "1) Objectifs et r\u00e9sultats Flux Zen :\n"
            f"{D}Extension flux tendus 3\u219212 r\u00e9f., stocks \u221252 %.\n"
            f"{D}\u00c9conomie stockage ~6 800 \u20ac/mois, marge s\u00e9rie +1,2 pt.\n"
            f"{D}Fiabilit\u00e9 planification 88 % \u2192 95 %.\n\n"
            "2) Risques r\u00e9v\u00e9l\u00e9s :\n"
            f"{D}Vuln\u00e9rabilit\u00e9 panne fonderie continue.\n"
            f"{D}Gr\u00e8ve transporteurs : retards, r\u00e9clamations d\u00e9lai +4.\n"
            f"{D}Peu de marge si al\u00e9a supply chain.\n\n"
            "3) \u00c9conomique vs client :\n"
            f"{D}Gain marge et stock vs d\u00e9gradation d\u00e9lais per\u00e7us.\n"
            f"{D}D\u00e9lai annonc\u00e9 +3 jours : transparence n\u00e9cessaire.\n\n"
            "4) Recommandation :\n"
            "Ajuster : poursuivre flux tendus sur r\u00e9f. stables, stock tampon s\u00e9curit\u00e9 "
            "sur 4 r\u00e9f. critiques, dual sourcing transporteurs.\n\n"
            "5) Synth\u00e8se :\n"
            "Flux tendus cr\u00e9ent de la valeur (marge, stocks) mais exigent flexibilit\u00e9 "
            "op\u00e9rationnelle et fiabilit\u00e9 supply chain. Approche hybride optimale."
        ),
        attendu="Projet Flux Zen analys\u00e9, risques/b\u00e9n\u00e9fices pes\u00e9s, recommandation argument\u00e9e.",
        notions=["flux tendus", "flux pouss\u00e9s", "supply chain management", "stocks"],
    ),
]
