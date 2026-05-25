# -*- coding: utf-8 -*-
"""Management chapitre 6 — acteurs reels, un concept par exercice."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH6 = [
    I(
        "e1",
        "Co\u00fbts fixes et variables chez Paul (Groupe Holder)",
        support=(
            "Paul (Groupe Holder) exploite plus de 400 boulangeries en France. "
            "Le site pilote des Champs-\u00c9lys\u00e9es (Paris) r\u00e9alise 1,8 M\u20ac de CA annuel. "
            "Charges fixes : loyer 14 200 \u20ac/mois, assurance et abonnements 1 800 \u20ac/mois, "
            "amortissement fournil 62 000 \u20ac/an. Charges variables : mati\u00e8res premi\u00e8res 26 % du CA, "
            "masse salariale variable (extras week-end) 18 % du CA. "
            "En mars 2025, +8 % de transactions ne suffit pas \u00e0 redresser le r\u00e9sultat "
            "car le loyer a \u00e9t\u00e9 r\u00e9vis\u00e9 +5 % et l'activit\u00e9 reste sous le seuil de rentabilit\u00e9 en semaine."
        ),
        consigne=(
            "\u00c0 partir du support, distingue charges fixes et charges variables "
            "et explique pourquoi cette classification aide Paul \u00e0 piloter sa rentabilit\u00e9."
        ),
        questions=[
            "D\u00e9finis charges fixes et charges variables selon le cours.",
            "Classe au moins cinq charges du support en fixes ou variables.",
            "Pourquoi une hausse d'activit\u00e9 n'am\u00e9liore-t-elle pas toujours le r\u00e9sultat ?",
        ],
        correction=(
            "1) Charges fixes :\n"
            "Support\u00e9es quelle que soit l'activit\u00e9 (loyer, assurance, amortissements).\n"
            "Charges variables : \u00e9voluent avec les volumes (mati\u00e8res, heures suppl\u00e9mentaires).\n\n"
            "2) Classification Paul :\n"
            f"{D}Fixes : loyer 14 200 \u20ac/mois, assurance 1 800 \u20ac/mois, amortissement 62 000 \u20ac/an.\n"
            f"{D}Variables : mati\u00e8res 26 % CA, masse variable 18 % CA.\n\n"
            "3) Tant que le CA ne couvre pas les CF via la marge sur CV, le r\u00e9sultat reste faible. "
            "Une hausse mod\u00e9r\u00e9e (+8 %) peut \u00eatre absorb\u00e9e par la hausse du loyer (+5 %)."
        ),
        attendu="D\u00e9finitions pr\u00e9cises, classification chiffr\u00e9e, lien activit\u00e9/r\u00e9sultat.",
        notions=["charges fixes", "charges variables", "contr\u00f4le des co\u00fbts"],
    ),
    I(
        "e2",
        "Seuil de rentabilit\u00e9 chez McDonald's France",
        support=(
            "McDonald's France compte plus de 1 500 restaurants. "
            "Un restaurant franchis\u00e9 de banlieue parisienne affiche des charges fixes annuelles "
            "de 420 000 \u20ac (loyer, royalties, structure). "
            "Le taux de marge sur co\u00fbts variables est de 38 % : sur 100 \u20ac de CA, "
            "62 \u20ac couvrent les co\u00fbts variables et 38 \u20ac contribuent aux charges fixes. "
            "SR = 420 000 / 0,38 \u2248 1 105 263 \u20ac de CA annuel. "
            "Le CA r\u00e9alis\u00e9 est de 2 850 000 \u20ac, mais le r\u00e9sultat net est de \u221218 000 \u20ac "
            "en raison de p\u00e9nalit\u00e9s qualit\u00e9 et de gaspillage alimentaire non int\u00e9gr\u00e9s au calcul."
        ),
        consigne=(
            "Explique la notion de seuil de rentabilit\u00e9 et calcule-le \u00e0 partir du support. "
            "Pr\u00e9cise ses limites pour un restaurant McDonald's."
        ),
        questions=[
            "Qu'est-ce que le seuil de rentabilit\u00e9 ? \u00c0 quoi sert-il ?",
            "Calcule et interpr\u00e8te le SR du restaurant McDonald's.",
            "Pourquoi le CA d\u00e9passe-t-il le SR mais le r\u00e9sultat reste-t-il n\u00e9gatif ?",
        ],
        correction=(
            "1) Le SR est le niveau de CA o\u00f9 le r\u00e9sultat est nul :\n"
            f"{D}Les charges variables et fixes sont exactement couvertes.\n"
            f"{D}Outil d'aide \u00e0 la d\u00e9cision (viabilit\u00e9, objectifs commerciaux).\n\n"
            "2) SR = 420 000 / 0,38 \u2248 1 105 263 \u20ac. "
            "Le restaurant d\u00e9passe largement ce seuil (2,85 M\u20ac).\n\n"
            "3) Le SR suppose des co\u00fbts bien class\u00e9s et stables. "
            "Ici, \u00e9carts (gaspillage, p\u00e9nalit\u00e9s) d\u00e9gradent le r\u00e9sultat r\u00e9el malgr\u00e9 un CA \u00e9lev\u00e9."
        ),
        attendu="Formule SR, calcul, interpr\u00e9tation et limites de l'outil.",
        notions=["seuil de rentabilit\u00e9", "point mort", "marge sur co\u00fbts variables"],
    ),
    I(
        "e3",
        "Marge sur co\u00fbts variables chez Accor",
        support=(
            "L'h\u00f4tel Novotel Lyon Part-Dieu (Accor) compare deux offres restauration :\n"
            "\u2014 Petit-d\u00e9jeuner buffet : ticket moyen 18 \u20ac, co\u00fbt variable unitaire 7,20 \u20ac, "
            "marge unitaire 10,80 \u20ac (taux 60 %).\n"
            "\u2014 D\u00eener \u00e9v\u00e9nementiel : ticket moyen 45 \u20ac, co\u00fbt variable 19,80 \u20ac, "
            "marge unitaire 25,20 \u20ac (taux 56 %).\n"
            "Le directeur F&B souhaite promouvoir les d\u00eeners \u00e9v\u00e9nementiels "
            "car chaque couvert suppl\u00e9mentaire contribue davantage \u00e0 couvrir les charges fixes de l'h\u00f4tel."
        ),
        consigne=(
            "Mobilise la marge sur co\u00fbts variables pour analyser la rentabilit\u00e9 "
            "des deux offres restauration d'Accor."
        ),
        questions=[
            "D\u00e9finis marge sur co\u00fbts variables (MCV) et taux de marge.",
            "Compare la MCV des deux offres du support.",
            "Quelle strat\u00e9gie commerciale en d\u00e9duis-tu pour l'h\u00f4tel Accor ?",
        ],
        correction=(
            "1) MCV = CA \u2212 co\u00fbts variables. Taux de marge = MCV / CA. "
            "Elle mesure la contribution de chaque vente \u00e0 la couverture des charges fixes.\n\n"
            "2) Petit-d\u00e9jeuner : marge 10,80 \u20ac (60 %).\n"
            f"{D}D\u00eener \u00e9v\u00e9nementiel : marge 25,20 \u20ac (56 %).\n"
            f"{D}Chaque couvert du soir apporte 2,3\u00d7 plus en euros qu'un petit-d\u00e9jeuner.\n\n"
            "3) D\u00e9velopper les d\u00eeners (s\u00e9minaires, mariages) pour augmenter la MCV globale "
            "et r\u00e9duire le nombre de couverts n\u00e9cessaires au SR."
        ),
        attendu="Calcul MCV, comparaison chiffr\u00e9e, recommandation argument\u00e9e.",
        notions=["marge sur co\u00fbts variables", "taux de marge", "co\u00fbts sp\u00e9cifiques"],
    ),
    I(
        "e4",
        "Point mort en couverts chez Elior",
        support=(
            "Elior g\u00e8re la restauration collective d'une universit\u00e9 parisienne (3 200 couverts/jour). "
            "Charges fixes annuelles du contrat : 680 000 \u20ac. Taux de marge sur co\u00fbts variables : 35 %. "
            "SR = 680 000 / 0,35 \u2248 1 942 857 \u20ac de CA annuel. "
            "Ticket moyen \u00e9tudiant 6,80 \u20ac \u2192 point mort \u2248 285 714 couverts/an, soit 1 562 couverts/jour ouvr\u00e9. "
            "En r\u00e9alit\u00e9, l'universit\u00e9 sert 3 200 couverts/jour mais conna\u00eet une forte saisonnalit\u00e9 : "
            "900/jour en juillet, 3 800/jour en octobre."
        ),
        consigne=(
            "Traduis le seuil de rentabilit\u00e9 en point mort (couverts) "
            "et analyse l'impact de la saisonnalit\u00e9 pour Elior."
        ),
        questions=[
            "Qu'est-ce que le point mort ? Comment le calcule-t-on ?",
            "Calcule le point mort en couverts \u00e0 partir du support.",
            "Comment la saisonnalit\u00e9 affecte-t-elle la gestion du contrat Elior ?",
        ],
        correction=(
            "1) Point mort = SR / ticket moyen (si taux marge constant). "
            "Nombre d'unit\u00e9s \u00e0 vendre pour \u00eatre \u00e0 l'\u00e9quilibre.\n\n"
            "2) SR \u2248 1 942 857 \u20ac. Ticket 6,80 \u20ac \u2192 \u2248 285 714 couverts/an (1 562/jour).\n"
            f"{D}Activit\u00e9 moyenne 3 200/jour : marge de s\u00e9curit\u00e9 confortable.\n\n"
            "3) En basse saison (900/jour < 1 562/jour th\u00e9orique), le mois est d\u00e9ficitaire. "
            "La haute saison compense. Elior doit anticiper tr\u00e9sorerie et ajuster effectifs variables."
        ),
        attendu="Calcul point mort, interpr\u00e9tation, analyse saisonnalit\u00e9.",
        notions=["point mort", "seuil de rentabilit\u00e9", "saisonnalit\u00e9"],
    ),
    I(
        "e5",
        "Effet de levier chez Restos du C\u0153ur",
        support=(
            "Restos du C\u0153ur exploite un centre de distribution alimentaire \u00e0 Bordeaux. "
            "Charges fixes annuelles (locaux, v\u00e9hicules, structure) : 240 000 \u20ac. "
            "Taux de marge sur co\u00fbts variables (valeur des repas distribu\u00e9s moins co\u00fbts directs) : 55 %. "
            "SR \u2248 436 364 \u20ac de \u00ab CA \u00bb \u00e9quivalent (dons valoris\u00e9s + subventions d'activit\u00e9). "
            "Simulation : +10 % d'activit\u00e9 au-dessus du SR entra\u00eene +28 % de capacit\u00e9 d'investissement social. "
            "\u00c0 l'inverse, \u221212 % d'activit\u00e9 en janvier 2025 a r\u00e9duit la marge disponible de 35 %."
        ),
        consigne=(
            "Explique l'effet de levier op\u00e9rationnel \u00e0 partir du support Restos du C\u0153ur "
            "et de la structure co\u00fbts fixes/variables."
        ),
        questions=[
            "Qu'est-ce que l'effet de levier op\u00e9rationnel ?",
            "Pourquoi +10 % d'activit\u00e9 entra\u00eene +28 % de marge disponible ?",
            "Quels risques si l'activit\u00e9 chute durablement sous le SR ?",
        ],
        correction=(
            "1) L'effet de levier : les CF \u00e9tant fixes, toute variation du CA au-del\u00e0 du SR "
            "impacte fortement le r\u00e9sultat (\u00e0 la hausse ou \u00e0 la baisse).\n\n"
            "2) Au-dessus du SR, l'augmentation d'activit\u00e9 ne g\u00e9n\u00e8re que des CV suppl\u00e9mentaires. "
            "La quasi-totalit\u00e9 de la hausse alimente la marge (+28 %).\n\n"
            "3) Sous le SR, les CF restent dus mais la MCV ne suffit plus : "
            "pertes amplifi\u00e9es, risque tr\u00e9sorerie, baisse des distributions alimentaires."
        ),
        attendu="D\u00e9finition levier, m\u00e9canisme chiffr\u00e9, analyse du risque.",
        notions=["effet de levier", "charges fixes", "r\u00e9sultat d'exploitation"],
    ),
    I(
        "e6",
        "Contr\u00f4le des co\u00fbts alimentaires \u2014 Mairie de Bordeaux",
        support=(
            "La Mairie de Bordeaux pilote 87 cantines scolaires (Elior et Sodexo en sous-traitance). "
            "Objectif ratio mati\u00e8res / CA : 32 % maximum. "
            "Tableau de bord mensuel : en septembre 2025, le ratio passe \u00e0 35,4 % (alerte). "
            "Analyse : surconsommation produits bio (+18 000 \u20ac), gaspillage plateaux (+12 400 \u20ac), "
            "erreurs de commande (+6 200 \u20ac). "
            "Actions : fiches techniques standardis\u00e9es, pes\u00e9e des d\u00e9chets, formation portionnage. "
            "Objectif : revenir sous 32 % d'ici janvier 2026."
        ),
        consigne=(
            "Analyse le dispositif de contr\u00f4le des co\u00fbts alimentaires "
            "de la Mairie de Bordeaux et le r\u00f4le du contr\u00f4le de gestion."
        ),
        questions=[
            "Pourquoi contr\u00f4ler les co\u00fbts alimentaires participe-t-il \u00e0 la performance ?",
            "Identifie les \u00e9carts rep\u00e9r\u00e9s et leurs causes dans le support.",
            "Pr\u00e9sente les actions correctives et leurs effets attendus sur le SR.",
        ],
        correction=(
            "1) Le contr\u00f4le des co\u00fbts mesure la rentabilit\u00e9, d\u00e9tecte les d\u00e9rives, "
            "aide \u00e0 la d\u00e9cision (menus, portions, fournisseurs).\n\n"
            "2) \u00c9cart d\u00e9favorable +3,4 pts de ratio (35,4 % vs 32 %). Causes :\n"
            f"{D}Surconsommation bio, gaspillage, erreurs commande (36 600 \u20ac identifi\u00e9s).\n\n"
            "3) Fiches techniques, pes\u00e9e d\u00e9chets, formation \u2192 ma\u00eetrise portions "
            "\u2192 baisse CV \u2192 am\u00e9lioration taux marge \u2192 SR plus bas."
        ),
        attendu="Lien contr\u00f4le/performance, \u00e9carts chiffr\u00e9s, plan d'action coh\u00e9rent.",
        notions=["contr\u00f4le des co\u00fbts", "ratio mati\u00e8res", "tableau de bord"],
    ),
    I(
        "e7",
        "Analyse des \u00e9carts chez Sodexo",
        support=(
            "Sodexo g\u00e8re la restauration d'un si\u00e8ge social \u00e0 La D\u00e9fense (contrat 1,4 M\u20ac/an). "
            "Budget pr\u00e9visionnel octobre 2025 : masse salariale variable 78 000 \u20ac pour un CA de 118 000 \u20ac. "
            "R\u00e9alis\u00e9 : masse 84 600 \u20ac pour un CA de 114 000 \u20ac. "
            "\u00c9cart d\u00e9favorable masse : +6 600 \u20ac. \u00c9cart d\u00e9favorable CA : \u22124 000 \u20ac. "
            "Cause : 220 heures suppl\u00e9mentaires non budg\u00e9t\u00e9es lors d'un \u00e9v\u00e9nement corporate "
            "et baisse de fr\u00e9quentation du self (\u22123,4 %)."
        ),
        consigne=(
            "R\u00e9alise une analyse des \u00e9carts pr\u00e9vision/r\u00e9alis\u00e9 "
            "sur la masse salariale et le CA du contrat Sodexo."
        ),
        questions=[
            "Qu'est-ce qu'un \u00e9cart en contr\u00f4le de gestion ? Distingue \u00e9cart favorable et d\u00e9favorable.",
            "Calcule et interpr\u00e8te les \u00e9carts sur masse et CA d'octobre.",
            "Quelles d\u00e9cisions de management tirer de cette analyse ?",
        ],
        correction=(
            "1) \u00c9cart = R\u00e9alis\u00e9 \u2212 Pr\u00e9vision. D\u00e9favorable si co\u00fbt sup\u00e9rieur ou recette inf\u00e9rieure au budget.\n\n"
            "2) Masse : +6 600 \u20ac d\u00e9favorable (84 600 vs 78 000).\n"
            f"{D}CA : \u22124 000 \u20ac d\u00e9favorable (114 000 vs 118 000).\n"
            f"{D}Double effet n\u00e9gatif sur le r\u00e9sultat du contrat.\n\n"
            "3) Plafond heures sup, planning \u00e9v\u00e9nements, recrutement extras ponctuels, "
            "suivi mensuel des \u00e9carts pour d\u00e9cisions rapides."
        ),
        attendu="\u00c9carts calcul\u00e9s, causes identifi\u00e9es, mesures de correction.",
        notions=["\u00e9carts", "contr\u00f4le de gestion", "budget pr\u00e9visionnel"],
    ),
    I(
        "e8",
        "SR et extension chez Deliveroo",
        support=(
            "Deliveroo d\u00e9veloppe des dark kitchens \u00e0 Lyon. "
            "Projet site Confluence : loyer 6 800 \u20ac/mois, charges fixes additionnelles 72 000 \u20ac/an. "
            "CA pr\u00e9visionnel ann\u00e9e 1 : 620 000 \u20ac, taux marge 41 %. "
            "SR site = 72 000 / 0,41 \u2248 175 610 \u20ac. CA pr\u00e9vu = 353 % du SR. "
            "Investissement \u00e9quipement : 95 000 \u20ac. Tr\u00e9sorerie disponible r\u00e9gion : 62 000 \u20ac. "
            "Sc\u00e9nario pessimiste : CA \u221225 % (465 000 \u20ac). Cannibalisation estim\u00e9e sur site existant : \u22128 %."
        ),
        consigne=(
            "\u00c9value la d\u00e9cision d'ouverture d'une dark kitchen Deliveroo "
            "\u00e0 l'aide du seuil de rentabilit\u00e9 et d'autres crit\u00e8res pertinents."
        ),
        questions=[
            "Calcule le SR du site Confluence et compare-le au CA pr\u00e9visionnel.",
            "Quels autres crit\u00e8res que le SR faut-il int\u00e9grer ?",
            "Quelle recommandation : go, report ou no-go ? Argumente.",
        ],
        correction=(
            "1) SR \u2248 175 610 \u20ac. CA pr\u00e9vu 620 000 \u20ac >> SR (marge de s\u00e9curit\u00e9 confortable).\n\n"
            "2) Tr\u00e9sorerie (62 000 \u20ac < 95 000 \u20ac investissement), cannibalisation \u22128 %, "
            "concurrence Uber Eats, sc\u00e9nario pessimiste 465 000 \u20ac (reste > SR).\n\n"
            "3) Go conditionnel : SR th\u00e9orique favorable mais financement compl\u00e9mentaire n\u00e9cessaire. "
            "Report ou emprunt si tr\u00e9sorerie insuffisante ; clause revue CA \u00e0 6 mois."
        ),
        attendu="SR calcul\u00e9, crit\u00e8res multiples, recommandation argument\u00e9e.",
        notions=["seuil de rentabilit\u00e9", "investissement", "marge de s\u00e9curit\u00e9"],
    ),
    I(
        "e9",
        "Tableau de bord des co\u00fbts chez Mercure",
        support=(
            "L'h\u00f4tel Mercure Paris Gare de Lyon consulte chaque lundi un dashboard aliment\u00e9 "
            "par l'ERP h\u00f4telier et le POS restauration : CA hebdo vs objectif, ratio mati\u00e8res, "
            "ratio masse, marge sur co\u00fbts variables, taux d'atteinte du SR cumul\u00e9. "
            "En octobre 2025, le SR cumul\u00e9 est atteint \u00e0 91 % (retard saison estivale). "
            "Ratio mati\u00e8res vert (< 30 %), masse orange (33 % vs cible 31 %). "
            "Indicateur \u00ab couverts/jour \u00bb : 142 r\u00e9alis\u00e9 vs 158 budget."
        ),
        consigne=(
            "Explique le r\u00f4le d'un tableau de bord dans le contr\u00f4le des co\u00fbts "
            "et interpr\u00e8te les indicateurs Mercure du support."
        ),
        questions=[
            "Qu'est-ce qu'un tableau de bord de gestion ? Quels principes (synth\u00e8se, alerte, action) ?",
            "Interpr\u00e8te chaque indicateur d'octobre (SR 91 %, mati\u00e8res, masse, couverts).",
            "Comment le tableau de bord am\u00e9liore-t-il la prise de d\u00e9cision ?",
        ],
        correction=(
            "1) Tableau de bord : synth\u00e8se visuelle d'indicateurs cl\u00e9s, seuils d'alerte, "
            "pilotage en temps r\u00e9el. Compl\u00e9mentaire \u00e0 la comptabilit\u00e9 (prospective vs historique).\n\n"
            "2) SR 91 % : retard \u00e0 combler.\n"
            f"{D}Mati\u00e8res vert : ma\u00eetrise OK.\n"
            f"{D}Masse orange : d\u00e9rive \u00e0 surveiller.\n"
            f"{D}Couverts 142/158 : sous-performance commerciale.\n\n"
            "3) R\u00e9unions hebdo, actions cibl\u00e9es (promo, plafond heures), anticipation avant fin d'ann\u00e9e."
        ),
        attendu="Principes tableau de bord, lecture indicateurs, lien d\u00e9cision.",
        notions=["tableau de bord", "indicateurs de gestion", "pilotage"],
    ),
    I(
        "e10",
        "Synth\u00e8se contr\u00f4le des co\u00fbts \u2014 CCI Nouvelle-Aquitaine",
        support=(
            "La CCI Nouvelle-Aquitaine anime un atelier pour 40 restaurateurs bordelais. "
            "Cas type : inflation mati\u00e8res +9 % en 2025. Trois options simul\u00e9es :\n"
            "(A) Augmenter les prix de 7 % (risque \u22125 % de couverts).\n"
            "(B) R\u00e9duire les portions (\u00e9conomie 2,8 pts de ratio, risque image).\n"
            "(C) Gamme \u00ab circuit court \u00bb (mati\u00e8res +4 %, ticket moyen +11 %).\n"
            "Sans action : taux marge passe de 40 % \u00e0 36 %, SR augmente de 38 000 \u20ac."
        ),
        consigne=(
            "Compare les trois options \u00e0 la lumi\u00e8re du contr\u00f4le des co\u00fbts, "
            "du SR et du d\u00e9veloppement durable pour l'atelier CCI."
        ),
        questions=[
            "Quel impact de l'inflation si le restaurateur ne r\u00e9agit pas ?",
            "Compare les trois options (prix, portions, gamme locale) sur marge et SR.",
            "Quelle strat\u00e9gie recommandes-tu ? Int\u00e8gre le co\u00fbt du d\u00e9veloppement durable.",
        ],
        correction=(
            "1) Sans action : taux marge 40 % \u2192 36 %, SR augmente, r\u00e9sultat d\u00e9grad\u00e9 malgr\u00e9 CA stable.\n\n"
            "2) Prix +7 % : marge pr\u00e9serv\u00e9e mais \u22125 % couverts.\n"
            f"{D}Portions : gain co\u00fbt mais risque satisfaction.\n"
            f"{D}Gamme locale : ticket +11 %, co\u00fbt mati\u00e8res +4 %, diff\u00e9renciation RSE.\n\n"
            "3) Recommandation mixte : gamme locale + ajustement prix mod\u00e9r\u00e9. "
            "\u00c9viter r\u00e9duction portions seule. Piloter SR mensuel."
        ),
        attendu="Simulation chiffr\u00e9e, comparaison structur\u00e9e, recommandation DD int\u00e9gr\u00e9e.",
        notions=["contr\u00f4le des co\u00fbts", "d\u00e9veloppement durable", "seuil de rentabilit\u00e9"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : rentabilit\u00e9 aux Halles de Bacalan",
        support=(
            "Les Halles de Bacalan (Bordeaux) accueillent 12 commerces alimentaires et 3 restaurants. "
            "Le restaurant Le Bistrot des Halles : CA 980 000 \u20ac, 28 salari\u00e9s, 165 couverts/jour en moyenne. "
            "R\u00e9sultat net 2025 : \u221224 000 \u20ac malgr\u00e9 un CA sup\u00e9rieur au SR th\u00e9orique. "
            "Diagnostic : loyer +7 %, concurrence food trucks (\u221211 % couverts midi), "
            "ratio mati\u00e8res 33,8 % en \u00e9t\u00e9 (cible 29 %), 380 heures sup non budg\u00e9t\u00e9es. "
            "Charges fixes 210 000 \u20ac, taux marge cible 41 %, ticket moyen 26 \u20ac. "
            "Le bailleur exige un retour \u00e0 l'\u00e9quilibre sous 6 mois."
        ),
        consigne=(
            "R\u00e9dige un diagnostic complet et un plan d'action chiffr\u00e9 mobilisant "
            "co\u00fbts fixes/variables, SR, \u00e9carts et tableau de bord."
        ),
        questions=[
            "Classifie les charges et calcule le SR actualis\u00e9.",
            "Analyse les \u00e9carts expliquant le r\u00e9sultat n\u00e9gatif.",
            "Propose au moins quatre leviers de rentabilit\u00e9 chiffr\u00e9s.",
            "D\u00e9finis un tableau de bord mensuel (5 indicateurs minimum).",
            "Plan d'action 6 mois avec objectifs chiffr\u00e9s.",
        ],
        correction=(
            "1) CF 210 000 \u20ac (+loyer), CV \u224859 % CA. SR \u2248 512 195 \u20ac (si marge 41 %).\n\n"
            "2) \u00c9carts : mati\u00e8res +4,8 pts (\u00e9t\u00e9), masse +380 h sup, CA midi \u221211 %, loyer +7 %.\n\n"
            "3) Leviers : ratio mati\u00e8res \u2192 29 % (\u00e9conomie \u224847 000 \u20ac/an), promo soir, "
            "plafond heures sup, partenariat \u00e9v\u00e9nementiel Halles.\n\n"
            "4) Dashboard : CA, ratio mati\u00e8res, masse, SR cumul\u00e9, couverts/jour.\n\n"
            "5) Mois 1-2 : fiches techniques + dashboard. Mois 3-4 : promo soir. Mois 5-6 : r\u00e9sultat \u2265 0."
        ),
        attendu="Diagnostic complet chapitre 6, plan chiffr\u00e9 6 mois.",
        notions=["seuil de rentabilit\u00e9", "\u00e9carts", "contr\u00f4le des co\u00fbts"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : second site UCPA",
        support=(
            "UCPA exploite un centre sport-aventure \u00e0 Lacanau (800 places, CA 2,1 M\u20ac). "
            "Projet ouverture centre Lacanau Oc\u00e9an 2 : loyer 11 500 \u20ac/mois, CF additionnels 118 000 \u20ac/an, "
            "investissement 280 000 \u20ac, CA pr\u00e9vu 1 450 000 \u20ac an 1, marge 44 %. "
            "SR site 2 = 118 000 / 0,44 \u2248 268 182 \u20ac. CA pr\u00e9vu = 540 % du SR. "
            "Sc\u00e9nario pessimiste CA \u221220 % (1 160 000 \u20ac). Tr\u00e9sorerie 95 000 \u20ac, "
            "emprunt possible 150 000 \u20ac \u00e0 4,2 % sur 7 ans. Cannibalisation site 1 : \u22126 %."
        ),
        consigne=(
            "D\u00e9cision d'investissement via SR, sc\u00e9narios et crit\u00e8res financiers. "
            "R\u00e9dige une note go/no-go pour la direction UCPA."
        ),
        questions=[
            "Calcule SR et marge de s\u00e9curit\u00e9 (base et pessimiste).",
            "Estime le d\u00e9lai de retour sur investissement (280 000 \u20ac).",
            "Identifie les risques (tr\u00e9sorerie, cannibalisation, saisonnalit\u00e9).",
            "Sc\u00e9nario pessimiste : le site 2 est-il viable ?",
            "Recommandation finale go/no-go argument\u00e9e.",
        ],
        correction=(
            "1) SR \u2248 268 182 \u20ac. Marge s\u00e9curit\u00e9 base : 1 181 818 \u20ac (440 %).\n"
            f"{D}Pessimiste : 1 160 000 \u20ac, marge s\u00e9curit\u00e9 891 818 \u20ac (332 %).\n\n"
            "2) R\u00e9sultat estim\u00e9 base : (1 450 000 \u00d7 0,44) \u2212 118 000 \u2248 520 000 \u20ac. "
            "Payback \u2248 280 000/520 000 < 1 an op\u00e9rationnel.\n\n"
            "3) Tr\u00e9sorerie insuffisante, cannibalisation 6 %, saisonnalit\u00e9 forte.\n\n"
            "4) Pessimiste reste au-dessus SR : viable mais marge r\u00e9duite.\n\n"
            "5) Go conditionnel : emprunt 150 000 \u20ac + apport, clause revue CA \u00e0 6 mois."
        ),
        attendu="Note d'investissement chiffr\u00e9e, sc\u00e9narios, d\u00e9cision argument\u00e9e.",
        notions=["investissement", "seuil de rentabilit\u00e9", "marge de s\u00e9curit\u00e9"],
    ),
]
