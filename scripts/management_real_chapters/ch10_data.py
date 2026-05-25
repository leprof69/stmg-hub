# -*- coding: utf-8 -*-
"""Management chapitre 10 — motivation, styles de direction et mobilisation RH."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH10 = [
    I(
        "e1",
        "Styles de direction Likert chez Capgemini",
        support=(
            "Capgemini France (340 000 salari\u00e9s dans le monde, 55 000 en France, "
            "ESN et conseil) forme ses managers aux quatre styles de Likert en 2024 :\n"
            "\u2014 style 1 (exploitatif) : rare, signal\u00e9 en audit interne sur 2 % des \u00e9quipes ;\n"
            "\u2014 style 2 (bienveillant) : 18 % \u2014 manager protecteur mais d\u00e9cide seul ;\n"
            "\u2014 style 3 (consultatif) : 52 % \u2014 d\u00e9cisions prises apr\u00e8s consultation ;\n"
            "\u2014 style 4 (participatif) : 28 % \u2014 d\u00e9cisions en groupe sur les projets agile.\n"
            "Enqu\u00eate 2024 : satisfaction \u00e9quipe 7,8/10 en style 4, 6,1/10 en style 2. "
            "Sur un projet cloud de 40 consultants, passage du style 2 au style 3 "
            "r\u00e9duit le turnover projet de 24 % \u00e0 11 % en 8 mois."
        ),
        consigne=(
            "Pr\u00e9sente les styles de direction de Likert et indique "
            "celui qui domine chez Capgemini selon le support."
        ),
        questions=[
            "Rappelle les quatre styles de Likert (num\u00e9ro + caract\u00e9ristique).",
            "Quel style est le plus r\u00e9pandu chez Capgemini ? Cite un chiffre de satisfaction.",
            "Que montre l'exp\u00e9rience du projet cloud (turnover 24 % \u2192 11 %) ?",
        ],
        correction=(
            "1) Quatre styles Likert :\n"
            "1 Exploitatif \u2014 2 Bienveillant \u2014 3 Consultatif \u2014 4 Participatif "
            "(du moins au plus de participation des subordonn\u00e9s).\n\n"
            "2) Capgemini :\n"
            f"{D}Style 3 consultatif dominant (52 %).\n"
            f"{D}Style 4 : satisfaction 7,8/10 (meilleure que style 2 : 6,1/10).\n\n"
            "3) Projet cloud :\n"
            f"{D}Plus de consultation/participation = moins de turnover (\u221213 points)."
        ),
        attendu="Quatre styles rappel\u00e9s, style dominant identifi\u00e9, lien participation / fid\u00e9lisation.",
        notions=["Likert", "styles de direction"],
    ),
    I(
        "e2",
        "Motivation intrins\u00e8que et extrins\u00e8que chez Randstad",
        support=(
            "Randstad France (leader int\u00e9rim, 4 500 consultants internes) distingue "
            "deux leviers de motivation en 2024 :\n"
            "Motivation extrins\u00e8que :\n"
            "\u2014 primes trimestrielles sur objectifs de placement (jusqu'\u00e0 15 % du fixe) ;\n"
            "\u2014 voiture de fonction pour les seniors.\n"
            "Motivation intrins\u00e8que :\n"
            "\u2014 programme \u00ab Randstad Academy \u00bb : 40 h de formation/an ;\n"
            "\u2014 autonomie sur le portefeuille clients int\u00e9rimaires ;\n"
            "\u2014 reconnaissance \u00ab Consultant de l'ann\u00e9e \u00bb (vote pairs).\n"
            "Enqu\u00eate interne : 71 % citent la formation comme premier levier de fid\u00e9lisation, "
            "43 % citent le salaire. Turnover consultants : 21 % (secteur : 26 %)."
        ),
        consigne=(
            "Distingue motivation intrins\u00e8que et extrins\u00e8que, "
            "puis classe les leviers Randstad dans chaque cat\u00e9gorie."
        ),
        questions=[
            "D\u00e9finis motivation intrins\u00e8que et motivation extrins\u00e8que.",
            "Classe les cinq leviers Randstad (extrins\u00e8que ou intrins\u00e8que).",
            "Que montrent les chiffres 71 % / 43 % et le turnover 21 % ?",
        ],
        correction=(
            "1) D\u00e9finitions :\n"
            "Extrins\u00e8que : motivation par r\u00e9compenses ext\u00e9rieures (salaire, primes, statut).\n"
            "Intrins\u00e8que : motivation par le plaisir du travail, l'autonomie, "
            "l'apprentissage, la reconnaissance.\n\n"
            "2) Classification Randstad :\n"
            f"{D}Extrins\u00e8que : primes, voiture de fonction.\n"
            f"{D}Intrins\u00e8que : formation, autonomie, reconnaissance pairs.\n\n"
            "3) Interpr\u00e9tation :\n"
            f"{D}La formation (intrins\u00e8que) prime sur le salaire pour la fid\u00e9lisation.\n"
            f"{D}Turnover 21 % < secteur 26 % = mix de leviers efficace."
        ),
        attendu="Deux d\u00e9finitions, classification correcte, interpr\u00e9tation des enqu\u00eates.",
        notions=["motivation intrins\u00e8que", "motivation extrins\u00e8que"],
    ),
    I(
        "e3",
        "R\u00e9mun\u00e9ration fixe et variable chez Accenture",
        support=(
            "Accenture France (65 000 salari\u00e9s) structure la r\u00e9mun\u00e9ration "
            "des consultants en 2024 :\n"
            "\u2014 part fixe : 65 \u00e0 75 % du package (salaire de base + avantages) ;\n"
            "\u2014 part variable : 25 \u00e0 35 % (bonus annuel li\u00e9 aux r\u00e9sultats "
            "de l'entreprise + prime individuelle sur objectifs billables).\n"
            "Exemple consultant confirm\u00e9 Paris : 52 000 \u20ac fixe + 18 000 \u20ac variable "
            "max (dont 8 000 \u20ac bonus entreprise, 10 000 \u20ac individuel).\n"
            "Politique 2024 : augmenter la part fixe de 2 points pour les profils "
            "junior (moins de 3 ans) afin de limiter le turnover junior (32 % \u2192 objectif 25 %)."
        ),
        consigne=(
            "Explique la structure fixe/variable de la r\u00e9mun\u00e9ration "
            "et la politique Accenture pour les juniors."
        ),
        questions=[
            "Quelle diff\u00e9rence entre r\u00e9mun\u00e9ration fixe et variable ?",
            "D\u00e9compose le package du consultant confirm\u00e9 (52 000 + 18 000 \u20ac).",
            "Pourquoi Accenture augmente-t-elle la part fixe pour les juniors ?",
        ],
        correction=(
            "1) Fixe vs variable :\n"
            "Fixe : garanti (salaire de base). Variable : d\u00e9pend des r\u00e9sultats "
            "collectifs et/ou individuels.\n\n"
            "2) Package confirm\u00e9 :\n"
            f"{D}Fixe 52 000 \u20ac (73 %).\n"
            f"{D}Variable 18 000 \u20ac max : 8 000 \u20ac entreprise + 10 000 \u20ac individuel.\n\n"
            "3) Politique juniors :\n"
            f"{D}S\u00e9curiser le revenu (moins de d\u00e9pendance au variable) "
            f"pour r\u00e9duire le turnover 32 % \u2192 25 %."
        ),
        attendu="Distinction fixe/variable, d\u00e9composition chiffr\u00e9e, logique RH expliqu\u00e9e.",
        notions=["r\u00e9mun\u00e9ration", "part fixe", "part variable"],
    ),
    I(
        "e4",
        "Mobilisation RH chez Manpower",
        support=(
            "Manpower France (2 200 collaborateurs, 400 agences) lance en 2024 "
            "le plan \u00ab Connect Talent \u00bb pour mobiliser les \u00e9quipes sur "
            "la digitalisation du recrutement :\n"
            "\u2014 comit\u00e9 de pilotage mixte (RH si\u00e8ge + agences) ;\n"
            "\u2014 120 ambassadeurs volontaires form\u00e9s aux nouveaux outils ATS ;\n"
            "\u2014 objectif : 80 % des candidatures trait\u00e9es en moins de 48 h.\n"
            "Communication : newsletter hebdo, webinaires, tableau de bord visible "
            "dans chaque agence (taux de conversion affich\u00e9).\n"
            "R\u00e9sultats 6 mois : 76 % des candidatures sous 48 h, "
            "adoption outil 84 % (contre 52 % au lancement), "
            "satisfaction client agence +12 points NPS."
        ),
        consigne=(
            "Qu'est-ce que la mobilisation RH ? Montre comment Manpower "
            "mobilise ses \u00e9quipes sur le plan Connect Talent."
        ),
        questions=[
            "D\u00e9finis mobilisation RH.",
            "Cite trois leviers de mobilisation utilis\u00e9s par Manpower.",
            "Quels r\u00e9sultats le support montre-t-il apr\u00e8s 6 mois ?",
        ],
        correction=(
            "1) Mobilisation RH :\n"
            "Ensemble des actions pour impliquer et enthousiasmer les salari\u00e9s "
            "autour d'un projet ou d'une transformation de l'organisation.\n\n"
            "2) Leviers Manpower :\n"
            f"{D}Comit\u00e9 de pilotage mixte.\n"
            f"{D}Ambassadeurs form\u00e9s (120).\n"
            f"{D}Communication (newsletter, webinaires, tableau de bord).\n\n"
            "3) R\u00e9sultats :\n"
            f"{D}76 % candidatures < 48 h ; adoption 84 % ; NPS client +12 points."
        ),
        attendu="D\u00e9finition, trois leviers, trois r\u00e9sultats chiffr\u00e9s.",
        notions=["mobilisation RH"],
    ),
    I(
        "e5",
        "Management participatif chez Secours catholique",
        support=(
            "Secours catholique (62 000 b\u00e9n\u00e9voles, 2 100 salari\u00e9s) pratique "
            "le management participatif dans ses 1 000 d\u00e9l\u00e9gations d\u00e9partementales :\n"
            "\u2014 assembl\u00e9es trimestrielles : b\u00e9n\u00e9voles + salari\u00e9s votent "
            "les priorit\u00e9s d'action locale (urgence alimentaire, logement, accueil migrants) ;\n"
            "\u2014 budget participatif : 15 % du budget local d\u00e9cid\u00e9 en assembl\u00e9e ;\n"
            "\u2014 coordinateurs \u00e9lus pour 2 ans par les \u00e9quipes.\n"
            "En 2024, 89 % des d\u00e9l\u00e9gations ont tenu leur assembl\u00e9e. "
            "Enqu\u00eate b\u00e9n\u00e9voles : 74 % se sentent \u00ab acteurs des d\u00e9cisions \u00bb "
            "(contre 61 % en 2020). Limite : d\u00e9cisions plus lentes "
            "(d\u00e9lai moyen projet : 6 semaines vs 4 en direction centralis\u00e9e)."
        ),
        consigne=(
            "D\u00e9finis le management participatif et montre comment "
            "Secours catholique le met en \u0153uvre."
        ),
        questions=[
            "Qu'est-ce que le management participatif ?",
            "Cite deux m\u00e9canismes participatifs de Secours catholique.",
            "Quels avantages et quelle limite le support indique-t-il ?",
        ],
        correction=(
            "1) Management participatif :\n"
            "Style de direction o\u00f9 les salari\u00e9s (et ici b\u00e9n\u00e9voles) "
            "participent aux d\u00e9cisions qui les concernent.\n\n"
            "2) M\u00e9canismes :\n"
            f"{D}Assembl\u00e9es trimestrielles (vote priorit\u00e9s).\n"
            f"{D}Budget participatif 15 %, coordinateurs \u00e9lus.\n\n"
            "3) Bilan :\n"
            f"{D}Avantage : sentiment d'acteur 74 % (+13 points).\n"
            f"{D}Limite : lenteur d\u00e9cisionnelle (6 vs 4 semaines)."
        ),
        attendu="D\u00e9finition, deux m\u00e9canismes, avantage + limite.",
        notions=["management participatif"],
    ),
    I(
        "e6",
        "Feedback et reconnaissance \u00e0 la Maison de l'emploi de Lyon",
        support=(
            "La Maison de l'emploi M\u00e9tropole de Lyon (structure publique de coordination "
            "emploi-formation, 45 agents) d\u00e9ploie en 2024 :\n"
            "\u2014 entretiens annuels remplac\u00e9s par des entretiens trimestriels "
            "(\u00ab check-in \u00bb 30 min manager / agent) ;\n"
            "\u2014 feedback 360\u00b0 pour les 8 chefs de service (coll\u00e8gues, "
            "N+1, N-1, partenaires externes) ;\n"
            "\u2014 prime \u00ab coup de c\u0153ur \u00bb mensuelle de 150 \u20ac "
            "vot\u00e9e par les pairs (12 attributions en 2024).\n"
            "R\u00e9sultats : engagement enqu\u00eate interne 72 % (contre 58 % en 2023), "
            "absent\u00e9isme 4,1 % (contre 6,2 %). 91 % des agents estiment "
            "le feedback \u00ab utile \u00bb."
        ),
        consigne=(
            "Explique le feedback et la reconnaissance au travail, "
            "puis analyse la d\u00e9marche de la Maison de l'emploi."
        ),
        questions=[
            "Qu'est-ce que le feedback ? Qu'est-ce que la reconnaissance au travail ?",
            "Quels trois dispositifs la Maison de l'emploi utilise-t-elle ?",
            "Quels indicateurs montrent l'efficacit\u00e9 de cette d\u00e9marche ?",
        ],
        correction=(
            "1) D\u00e9finitions :\n"
            "Feedback : retour d'information sur la performance ou le comportement "
            "pour progresser.\n"
            "Reconnaissance : mise en valeur des contributions individuelles ou collectives.\n\n"
            "2) Dispositifs Lyon :\n"
            f"{D}Check-in trimestriel.\n"
            f"{D}Feedback 360\u00b0 managers.\n"
            f"{D}Prime pairs (150 \u20ac).\n\n"
            "3) Indicateurs :\n"
            f"{D}Engagement 58 % \u2192 72 % ; absent\u00e9isme 6,2 % \u2192 4,1 % ; "
            f"91 % trouvent le feedback utile."
        ),
        attendu="Deux d\u00e9finitions, trois dispositifs, trois r\u00e9sultats.",
        notions=["feedback", "reconnaissance"],
    ),
    I(
        "e7",
        "D\u00e9l\u00e9gation dans une Scop boulangerie",
        support=(
            "La Scop \u00ab Le Pain des Copains \u00bb (Lyon, 32 associ\u00e9s-salari\u00e9s, "
            "4 points de vente) r\u00e9organise la gouvernance en 2024 :\n"
            "\u2014 le directeur d\u00e9l\u00e8gue la gestion des stocks \u00e0 un associ\u00e9 "
            "boulanger (formation 3 jours, budget d\u00e9cisionnel 5 000 \u20ac/mois) ;\n"
            "\u2014 chaque point de vente \u00e9lit un r\u00e9f\u00e9rent qui g\u00e8re "
            "les plannings sans validation syst\u00e9matique du si\u00e8ge ;\n"
            "\u2014 contr\u00f4le : bilan mensuel au conseil d'administration de la Scop.\n"
            "R\u00e9sultats : ruptures produits \u221230 %, d\u00e9lai de d\u00e9cision "
            "stock 5 jours \u2192 24 h, satisfaction associ\u00e9s 8,4/10 sur l'autonomie."
        ),
        consigne=(
            "D\u00e9finis la d\u00e9l\u00e9gation et montre comment cette Scop "
            "l'organise avec contr\u00f4le."
        ),
        questions=[
            "Qu'est-ce que la d\u00e9l\u00e9gation en management ?",
            "Quelles responsabilit\u00e9s sont d\u00e9l\u00e9gu\u00e9es et \u00e0 qui ?",
            "Comment le contr\u00f4le est-il maintenu malgr\u00e9 la d\u00e9l\u00e9gation ?",
        ],
        correction=(
            "1) D\u00e9l\u00e9gation :\n"
            "Transfert par un sup\u00e9rieur d'une partie de ses pouvoirs de d\u00e9cision "
            "et de responsabilit\u00e9 \u00e0 un subordonn\u00e9, avec contr\u00f4le.\n\n"
            "2) D\u00e9l\u00e9gations Scop :\n"
            f"{D}Stocks \u2192 boulanger associ\u00e9 (budget 5 000 \u20ac/mois).\n"
            f"{D}Plannings \u2192 r\u00e9f\u00e9rents de magasin.\n\n"
            "3) Contr\u00f4le :\n"
            f"{D}Bilan mensuel au conseil d'administration.\n"
            f"{D}Formation pr\u00e9alable (3 jours) avant d\u00e9l\u00e9gation."
        ),
        attendu="D\u00e9finition, deux d\u00e9l\u00e9gations, m\u00e9canisme de contr\u00f4le.",
        notions=["d\u00e9l\u00e9gation"],
    ),
    I(
        "e8",
        "Co\u00fbt de la d\u00e9motivation chez Orange",
        support=(
            "Orange \u00e9value en 2024 le co\u00fbt de la d\u00e9motivation sur son "
            "centre de relation client de Roubaix (1 800 conseillers) :\n"
            "\u2014 turnover : 28 % (co\u00fbt recrutement + formation : 8 200 \u20ac/salari\u00e9) ;\n"
            "\u2014 absent\u00e9isme : 9,4 % (moyenne groupe : 5,8 %) ;\n"
            "\u2014 productivit\u00e9 : \u221215 % d'appels trait\u00e9s/heure vs sites motiv\u00e9s ;\n"
            "\u2014 enqu\u00eate : 34 % des d\u00e9parts citent \u00ab manque de reconnaissance "
            "et feedback \u00bb.\n"
            "Estimation direction : co\u00fbt total d\u00e9motivation = 14,6 M\u20ac/an "
            "sur ce site. Plan correctif : managers form\u00e9s au feedback, "
            "prime coh\u00e9sion d'\u00e9quipe (budget 1,2 M\u20ac)."
        ),
        consigne=(
            "Explique comment la d\u00e9motivation se traduit en co\u00fbt "
            "et analyse le cas Orange Roubaix."
        ),
        questions=[
            "Quels sont les principaux co\u00fbts de la d\u00e9motivation pour une entreprise ?",
            "Cite trois indicateurs n\u00e9gatifs du site Roubaix.",
            "Le plan correctif (1,2 M\u20ac) est-il pertinent face au co\u00fbt 14,6 M\u20ac ?",
        ],
        correction=(
            "1) Co\u00fbts d\u00e9motivation :\n"
            "Turnover, absent\u00e9isme, baisse de productivit\u00e9, d\u00e9gradation "
            "de la qualit\u00e9 de service.\n\n"
            "2) Indicateurs Roubaix :\n"
            f"{D}Turnover 28 % (8 200 \u20ac/recrutement).\n"
            f"{D}Absent\u00e9isme 9,4 %.\n"
            f"{D}Productivit\u00e9 \u221215 %.\n\n"
            "3) Pertinence plan :\n"
            f"{D}Oui : investissement 1,2 M\u20ac << co\u00fbt 14,6 M\u20ac ; "
            f"cible la cause principale (reconnaissance, feedback)."
        ),
        attendu="Co\u00fbts list\u00e9s, trois indicateurs, ROI du plan argument\u00e9.",
        notions=["d\u00e9motivation", "co\u00fbt RH"],
    ),
    I(
        "e9",
        "NAO et transparence salariale chez LinkedIn France",
        support=(
            "LinkedIn France (filiale Microsoft, 700 salari\u00e9s \u00e0 Paris) pr\u00e9pare "
            "sa NAO (N\u00e9gociation Annuelle Obligatoire) 2025 :\n"
            "\u2014 obligation l\u00e9gale : n\u00e9gocier salaires et temps de travail "
            "avec d\u00e9l\u00e9gu\u00e9s syndicaux ou CSE ;\n"
            "\u2014 publication interne : fourchette salariale par grade "
            "(ex. ing\u00e9nieur L4 : 52\u201368 k\u20ac) ;\n"
            "\u2014 \u00e9cart salarial H/F : 3,2 % (contre 15,5 % moyenne tech France selon INSEE).\n"
            "Proposition direction : +3,8 % masse salariale, prime inflation 800 \u20ac. "
            "Syndicats (CGT, CFDT) demandent +5 % et indexation compl\u00e8te."
        ),
        consigne=(
            "Qu'est-ce que la NAO ? Explique le r\u00f4le de la transparence salariale "
            "dans la n\u00e9gociation LinkedIn."
        ),
        questions=[
            "D\u00e9finis la NAO (N\u00e9gociation Annuelle Obligatoire).",
            "Quels \u00e9l\u00e9ments LinkedIn rend-il transparents avant la n\u00e9gociation ?",
            "Comment interpr\u00e9ter l'\u00e9cart salarial H/F de 3,2 % ?",
        ],
        correction=(
            "1) NAO :\n"
            "N\u00e9gociation annuelle obligatoire entre employeur et repr\u00e9sentants "
            "du personnel sur salaires et organisation du temps de travail.\n\n"
            "2) Transparence LinkedIn :\n"
            f"{D}Fourchettes salariales par grade publi\u00e9es en interne.\n"
            f"{D}\u00c9cart H/F mesur\u00e9 et compar\u00e9 au secteur.\n\n"
            "3) \u00c9cart 3,2 % :\n"
            f"{D}Nettement inf\u00e9rieur \u00e0 la moyenne tech (15,5 %) \u2014 "
            f"argument pour la direction, mais syndicats revendiquent plus (+5 %)."
        ),
        attendu="D\u00e9finition NAO, transparence cit\u00e9e, \u00e9cart H/F interpr\u00e9t\u00e9.",
        notions=["NAO", "transparence salariale"],
    ),
    I(
        "e10",
        "Synth\u00e8se : styles de direction chez P\u00f4le emploi",
        support=(
            "P\u00f4le emploi (France Travail depuis 2024, 50 000 agents) m\u00e8ne "
            "en 2024-2025 une transformation de son management :\n"
            "\u2014 objectif : passer d'un management directif (consignes nationales strictes) "
            "\u00e0 un management de proximit\u00e9 (styles consultatif et participatif Likert 3-4) ;\n"
            "\u2014 formation : 12 000 managers form\u00e9s (feedback, d\u00e9l\u00e9gation, motivation) ;\n"
            "\u2014 indicateurs : satisfaction usagers +6 points, engagement agents +9 points, "
            "turnover \u22122,1 points.\n"
            "Tension : agents exp\u00e9riment\u00e9s vs jeunes recrues sur l'autonomie d\u00e9cisionnelle. "
            "Syndicats demandent garanties sur la charge de travail."
        ),
        consigne=(
            "Synth\u00e9tise : relie styles de direction, motivation et mobilisation "
            "dans la transformation P\u00f4le emploi."
        ),
        questions=[
            "Quel changement de style de direction P\u00f4le emploi vise-t-il ?",
            "Quels trois leviers de management le support cite-t-il ?",
            "Quels r\u00e9sultats et quelle tension persistent ?",
        ],
        correction=(
            "1) Changement de style :\n"
            f"{D}Directif \u2192 consultatif/participatif (Likert 3-4).\n\n"
            "2) Leviers :\n"
            f"{D}Formation managers (feedback, d\u00e9l\u00e9gation, motivation).\n"
            f"{D}Management de proximit\u00e9.\n\n"
            "3) R\u00e9sultats et tension :\n"
            f"{D}Satisfaction usagers +6, engagement +9, turnover \u22122,1.\n"
            f"{D}Tension g\u00e9n\u00e9rationnelle + crainte surcharge (syndicats)."
        ),
        attendu="Changement Likert identifi\u00e9, leviers cit\u00e9s, r\u00e9sultats + tension.",
        notions=["styles de direction", "motivation", "mobilisation RH"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : turnover chez une start-up r\u00e9f\u00e9renc\u00e9e par l'Inspection du travail",
        support=(
            "L'Inspection du travail (DREETS) publie en mars 2025 un rapport "
            "sur une ESN parisienne de 180 salari\u00e9s (anonymis\u00e9e \u00ab TechFlow \u00bb) "
            "signal\u00e9e par des salari\u00e9s :\n"
            "\u2014 turnover 2024 : 42 % (dont 68 % d\u00e9missions volontaires < 18 mois) ;\n"
            "\u2014 heures suppl\u00e9mentaires non d\u00e9clar\u00e9es estim\u00e9es \u00e0 12 h/semaine "
            "pour 40 % des devs ;\n"
            "\u2014 management : style 1-2 Likert (decisions unilat\u00e9rales, pression sur d\u00e9lais) ;\n"
            "\u2014 r\u00e9mun\u00e9ration : fixe sous le march\u00e9 (\u22128 % vs Accenture/Capgemini), "
            "variable promis mais rarement vers\u00e9.\n"
            "Recommandations inspection : mise en conformit\u00e9 temps de travail, "
            "formation managers, NAO r\u00e9elle. Risque : proc\u00e9dure prud'homale "
            "et mise en demeure."
        ),
        consigne=(
            "Analyse les causes du turnover et propose un plan d'action "
            "en mobilisant les notions du chapitre 10."
        ),
        questions=[
            "Quelles causes de turnover le rapport identifie-t-il ?",
            "Relie style Likert, r\u00e9mun\u00e9ration et motivation au turnover 42 %.",
            "Quelles mesures l'inspection recommande-t-elle ?",
            "Propose trois actions prioritaires pour la direction.",
        ],
        correction=(
            "1) Causes turnover :\n"
            f"{D}Management directif (Likert 1-2), heures sup non d\u00e9clar\u00e9es, "
            f"r\u00e9mun\u00e9ration insuffisante, variable non vers\u00e9.\n\n"
            "2) Lien chapitre 10 :\n"
            f"{D}Absence de motivation intrins\u00e8que (autonomie, reconnaissance).\n"
            f"{D}Motivation extrins\u00e8que d\u00e9\u00e7ue (salaire, variable).\n\n"
            "3) Recommandations inspection :\n"
            f"{D}Conformit\u00e9 temps de travail, formation managers, NAO.\n\n"
            "4) Actions prioritaires :\n"
            f"{D}Passer au style consultatif, r\u00e9mun\u00e9ration march\u00e9, "
            f"feedback r\u00e9gulier, respecter le droit du travail."
        ),
        attendu="Causes identifi\u00e9es, liens cours, recommandations inspection, plan coh\u00e9rent.",
        notions=["turnover", "Likert", "motivation", "NAO"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : fusion et co\u00fbt de la d\u00e9motivation \u2014 dossier URSSAF",
        support=(
            "En 2024, deux agences d'int\u00e9rim fusionnent (A : 95 salari\u00e9s, B : 110 salari\u00e9s). "
            "L'URSSAF contr\u00f4le la nouvelle entit\u00e9 en janvier 2025 :\n"
            "\u2014 effectif post-fusion : 165 (40 d\u00e9parts volontaires ou ruptures conventionnelles) ;\n"
            "\u2014 cotisations sociales 2024 : trou de 340 000 \u20ac (d\u00e9clarations tardives "
            "sur primes de d\u00e9part) ;\n"
            "\u2014 climat social : 58 % des restants estiment la fusion \u00ab mal g\u00e9r\u00e9e \u00bb "
            "(double hi\u00e9rarchie, cultures A vs B) ;\n"
            "\u2014 absent\u00e9isme post-fusion : 11,2 % (contre 6,5 % avant).\n"
            "Co\u00fbt estim\u00e9 de la d\u00e9motivation post-fusion : 2,1 M\u20ac "
            "(turnover + absent\u00e9isme + baisse CA agences). "
            "L'URSSAF exige un plan de redressement sous 90 jours."
        ),
        consigne=(
            "Analyse l'impact d'une fusion mal accompagn\u00e9e sur la motivation "
            "et les obligations sociales. Propose un plan de redressement."
        ),
        questions=[
            "Quels signes de d\u00e9motivation apparaissent apr\u00e8s la fusion ?",
            "Pourquoi l'URSSAF intervient-elle (340 000 \u20ac) ?",
            "Quelles causes manag\u00e9riales expliquent le climat social d\u00e9grad\u00e9 ?",
            "Propose un plan en trois axes pour redresser la situation.",
        ],
        correction=(
            "1) Signes d\u00e9motivation :\n"
            f"{D}40 d\u00e9parts, absent\u00e9isme 11,2 %, 58 % insatisfaits, co\u00fbt 2,1 M\u20ac.\n\n"
            "2) R\u00f4le URSSAF :\n"
            f"{D}Contr\u00f4le cotisations sociales ; trou 340 000 \u20ac "
            f"sur primes non d\u00e9clar\u00e9es \u00e0 temps.\n\n"
            "3) Causes manag\u00e9riales :\n"
            f"{D}Absence de mobilisation RH, double hi\u00e9rarchie, "
            f"cultures A/B non int\u00e9gr\u00e9es, pas de feedback.\n\n"
            "4) Plan redressement :\n"
            f"{D}R\u00e9gulariser cotisations.\n"
            f"{D}Management participatif + communication fusion.\n"
            f"{D}Reconnaissance et r\u00e9mun\u00e9ration transparente (NAO)."
        ),
        attendu="Signes chiffr\u00e9s, r\u00f4le URSSAF, causes fusion, plan trois axes.",
        notions=["fusion", "d\u00e9motivation", "mobilisation RH", "cotisations sociales"],
    ),
]
