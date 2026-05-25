# -*- coding: utf-8 -*-
"""Management chapitre 3 — acteurs reels, un concept par exercice."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH3 = [
    I(
        "e1",
        "Autofinancement et \u00e9pargne chez Schneider Electric",
        support=(
            "Schneider Electric affiche en 2024 un r\u00e9sultat net de 3,8 Md€ sur un CA de "
            "36,5 Md€. La direction d\u00e9cide de distribuer 1,2 Md€ de dividendes et de "
            "conserver 2,6 Md€ en r\u00e9serve pour autofinancer un projet d'usine smart grid "
            "\u00e0 Grenoble (budget 420 M\u20ac, mise en service 2026). L'autofinancement provient "
            "de l'\u00e9pargne de l'entreprise et ne g\u00e9n\u00e8re aucune charge financi\u00e8re. "
            "Le solde disponible ne couvre que 62 % du besoin : un compl\u00e9ment de financement "
            "devra \u00eatre arbitr\u00e9 entre emprunt, cr\u00e9dit-bail et subventions."
        ),
        consigne=(
            "Explique le principe de l'autofinancement et son r\u00f4le dans le projet Schneider Electric. "
            "Pr\u00e9sente ses avantages et ses limites."
        ),
        questions=[
            "Qu'est-ce que l'autofinancement et d'o\u00f9 provient-il ?",
            "Comment Schneider Electric mobilise-t-elle l'autofinancement pour son projet ?",
            "Pourquoi l'autofinancement seul ne suffit-il pas ici ?",
        ],
        correction=(
            "1) Autofinancement :\n"
            "Part des r\u00e9sultats conserv\u00e9e par l'entreprise pour financer ses investissements. "
            "Provient de l'\u00e9pargne de l'entreprise (r\u00e9sultat non distribu\u00e9).\n\n"
            "2) Mobilisation Schneider :\n"
            f"{D}R\u00e9sultat net 2024 : 3,8 Md€.\n"
            f"{D}Dividendes 1,2 Md€ ; 2,6 Md€ conserv\u00e9s (420 M\u20ac projet Grenoble).\n"
            f"{D}Autofinancement couvre 62 % du besoin.\n\n"
            "3) Limites :\n"
            f"{D}Avantage : gratuit\u00e9, pas d'int\u00e9r\u00eats.\n"
            f"{D}Limite : montant insuffisant (38 % manquants).\n"
            f"{D}Compl\u00e9ment n\u00e9cessaire : emprunt, cr\u00e9dit-bail ou subvention."
        ),
        attendu="Autofinancement d\u00e9fini, application chiffr\u00e9e, limites identifi\u00e9es.",
        notions=["autofinancement", "financement interne", "r\u00e9serve"],
    ),
    I(
        "e2",
        "Emprunt bancaire chez Saint-Gobain",
        support=(
            "Pour financer la d\u00e9carbonation de son site de production verrier \u00e0 Ch\u00e2lon-sur-Sa\u00f4ne "
            "(280 M\u20ac), Saint-Gobain sollicite un syndicat bancaire en mars 2025. Proposition : "
            "emprunt de 180 M\u20ac sur huit ans, taux fixe 3,8 %, remboursement par annuit\u00e9s "
            "constant de 26,4 M\u20ac. Co\u00fbt total des int\u00e9r\u00eats : 31,2 M\u20ac. L'emprunt "
            "est un engagement entre banques (pr\u00eateuses) et Saint-Gobain (emprunteur) : "
            "remboursement capital + int\u00e9r\u00eats. La banque exige un endettement net "
            "inf\u00e9rieur \u00e0 40 % des capitaux propres (actuellement 32 %)."
        ),
        consigne=(
            "Analyse l'emprunt bancaire propos\u00e9 \u00e0 Saint-Gobain. D\u00e9finis le financement "
            "externe par emprunt et compare-le \u00e0 l'autofinancement."
        ),
        questions=[
            "Qu'est-ce qu'un emprunt bancaire et comment se r\u00e9mun\u00e8re le pr\u00eateur ?",
            "Calcule le co\u00fbt total de l'emprunt Saint-Gobain (int\u00e9r\u00eats).",
            "Quels avantages et inconv\u00e9nients de l'emprunt par rapport \u00e0 l'autofinancement ?",
        ],
        correction=(
            "1) Emprunt bancaire :\n"
            "Engagement banque-entreprise : pr\u00eat d'une somme, remboursement capital + int\u00e9r\u00eats. "
            "L'int\u00e9r\u00eat r\u00e9mun\u00e8re le pr\u00eateur.\n\n"
            "2) Co\u00fbt Saint-Gobain :\n"
            f"{D}Emprunt 180 M\u20ac, 8 ans, 3,8 %.\n"
            f"{D}Annuit\u00e9s : 8 \u00d7 26,4 = 211,2 M\u20ac.\n"
            f"{D}Int\u00e9r\u00eats totaux : 211,2 \u2212 180 = 31,2 M\u20ac.\n\n"
            "3) Comparaison :\n"
            f"{D}Avantages emprunt : pr\u00e9serve le capital, acc\u00e9l\u00e8re l'investissement vert.\n"
            f"{D}Inconv\u00e9nients : charge financi\u00e8re 31,2 M\u20ac, contraintes bancaires.\n"
            f"{D}Autofinancement gratuit mais limit\u00e9 et plus lent."
        ),
        attendu="Emprunt d\u00e9fini, calculs corrects, comparaison avec autofinancement.",
        notions=["emprunt bancaire", "financement externe", "int\u00e9r\u00eats"],
    ),
    I(
        "e3",
        "Cr\u00e9dit-bail et acquisition d'\u00e9quipement chez Michelin",
        support=(
            "Michelin \u00e9tudie un contrat de cr\u00e9dit-bail avec BNP Paribas Leasing Solutions "
            "pour une ligne de vulcanisation robotis\u00e9e (Clermont-Ferrand) : mise \u00e0 disposition "
            "48 mois, redevance trimestrielle 2,8 M\u20ac (11,2 M\u20ac/an). Au terme : restitution, "
            "acquisition pour 8 M\u20ac (valeur r\u00e9siduelle) ou renouvellement. Le cr\u00e9dit-bailleur "
            "reste propri\u00e9taire pendant le contrat. Co\u00fbt total sur 4 ans si acquisition : "
            "44,8 M\u20ac redevances + 8 M\u20ac = 52,8 M\u20ac. Comparaison achat direct : 62 M\u20ac "
            "amortis sur 10 ans."
        ),
        consigne=(
            "Analyse le contrat de cr\u00e9dit-bail propos\u00e9 \u00e0 Michelin. Pr\u00e9sente le "
            "fonctionnement du cr\u00e9dit-bail et ses options en fin de contrat."
        ),
        questions=[
            "Qu'est-ce qu'un cr\u00e9dit-bail et quelles sont les parties au contrat ?",
            "Quelles options Michelin aura-t-elle au terme des 48 mois ?",
            "Compare le co\u00fbt du cr\u00e9dit-bail avec l'achat direct pour ce projet.",
        ],
        correction=(
            "1) Cr\u00e9dit-bail :\n"
            "Contrat entre soci\u00e9t\u00e9 financi\u00e8re (cr\u00e9dit-bailleur) et entreprise : "
            "mise \u00e0 disposition d'un bien moyennant redevances. Propri\u00e9t\u00e9 chez le bailleur.\n\n"
            "2) Options fin de contrat :\n"
            f"{D}Restituer le bien au cr\u00e9dit-bailleur.\n"
            f"{D}Acqu\u00e9rir pour 8 M\u20ac (valeur r\u00e9siduelle).\n"
            f"{D}Renouveler le contrat.\n\n"
            "3) Comparaison co\u00fbts :\n"
            f"{D}Cr\u00e9dit-bail : 52,8 M\u20ac total si acquisition.\n"
            f"{D}Achat direct : 62 M\u20ac immobilis\u00e9s sur 10 ans.\n"
            f"{D}Cr\u00e9dit-bail : flexibilit\u00e9 technologique mais co\u00fbt \u00e9lev\u00e9 si rachat."
        ),
        attendu="Cr\u00e9dit-bail d\u00e9fini, options identifi\u00e9es, comparaison chiffr\u00e9e.",
        notions=["cr\u00e9dit-bail", "redevance", "financement externe"],
    ),
    I(
        "e4",
        "Subventions et aides publiques chez LVMH",
        support=(
            "LVMH d\u00e9pose en 2025 un dossier aupr\u00e8s de Bpifrance \u00ab Industrie du futur \u00bb "
            "pour moderniser son atelier maroquinerie \u00e0 Sainte-Florence (Maine-et-Loire) : "
            "investissement 45 M\u20ac. Subvention potentielle : 12 % plafonn\u00e9e \u00e0 4 M\u20ac "
            "(calcul : 5,4 M\u20ac retenus au plafond 4 M\u20ac). Une subvention est une aide "
            "financi\u00e8re r\u00e9elle, sans remboursement, accord\u00e9e pour favoriser le "
            "d\u00e9veloppement. Conditions : maintien 180 emplois 24 mois, formation 40 % "
            "des op\u00e9rateurs. Montage : autofinancement 28 M\u20ac + subvention 4 M\u20ac + "
            "emprunt 13 M\u20ac."
        ),
        consigne=(
            "Explique le r\u00f4le des subventions dans le montage de financement de LVMH. "
            "Distingue subvention, emprunt et autofinancement."
        ),
        questions=[
            "Qu'est-ce qu'une subvention et en quoi diff\u00e8re-t-elle d'un emprunt ?",
            "Calcule la subvention obtenue par LVMH et cite ses conditions.",
            "Pr\u00e9sente le montage de financement global retenu (3 sources).",
        ],
        correction=(
            "1) Subvention :\n"
            "Aide financi\u00e8re r\u00e9elle, sans remboursement, accord\u00e9e par l'\u00c9tat ou "
            "collectivit\u00e9. Diff\u00e8re de l'emprunt (remboursable + int\u00e9r\u00eats).\n\n"
            "2) Subvention LVMH :\n"
            f"{D}12 % \u00d7 45 M\u20ac = 5,4 M\u20ac, plafonn\u00e9e \u00e0 4 M\u20ac.\n"
            f"{D}Conditions : maintien 180 emplois, formation 40 % op\u00e9rateurs.\n"
            f"{D}R\u00e9duit le besoin de financement externe co\u00fbteux.\n\n"
            "3) Montage global :\n"
            f"{D}Autofinancement : 28 M\u20ac (62 %).\n"
            f"{D}Subvention Bpifrance : 4 M\u20ac (9 %).\n"
            f"{D}Emprunt bancaire : 13 M\u20ac (29 %)."
        ),
        attendu="Subvention d\u00e9finie, calcul correct, montage \u00e9quilibr\u00e9 pr\u00e9sent\u00e9.",
        notions=["subvention", "financement externe", "aides publiques"],
    ),
    I(
        "e5",
        "Arbitrage financement interne et externe chez Renault",
        support=(
            "Le comit\u00e9 de direction Renault r\u00e9unit en mars 2025 pour arbitrer le financement "
            "de l'usine batteries \u00e9lectriques Douai (1,9 Md\u20ac). Trois profils : la DG "
            "privil\u00e9gie l'autofinancement et prudence ; Nissan (alliance) souhaite un levier "
            "bancaire ; l'ing\u00e9nierie pr\u00e9f\u00e8re le cr\u00e9dit-bail \u00e9quipements. "
            "Contexte : taux BCE 3,5 %, inflation +6 %, concurrence chinoise. Montage retenu : "
            "autofinancement 45 %, subventions UE 15 %, emprunt 30 %, cr\u00e9dit-bail 10 %. "
            "Crit\u00e8res : forme SA cot\u00e9e, 128 000 salari\u00e9s, maturit\u00e9 bancaire 20 ans."
        ),
        consigne=(
            "Analyse l'arbitrage entre financement interne et externe chez Renault. "
            "Mobilise les crit\u00e8res du cours (forme, taille, maturit\u00e9, environnement)."
        ),
        questions=[
            "Distingue financement interne et financement externe avec exemples Renault.",
            "Quels crit\u00e8res influencent le choix de financement selon le cours ?",
            "Quel montage Renault retient-il et pourquoi est-il \u00e9quilibr\u00e9 ?",
        ],
        correction=(
            "1) Financement interne vs externe :\n"
            f"{D}Interne : autofinancement 45 %, \u00e9pargne entreprise, gratuit.\n"
            f"{D}Externe : subventions UE, emprunt, cr\u00e9dit-bail.\n\n"
            "2) Crit\u00e8res de choix :\n"
            f"{D}Forme juridique (SA cot\u00e9e) et taille (128 000 salari\u00e9s).\n"
            f"{D}Maturit\u00e9 bancaire (20 ans relation bancaire).\n"
            f"{D}Environnement : taux, inflation, concurrence chinoise.\n\n"
            "3) Montage retenu :\n"
            f"{D}Mix 45 % interne / 55 % externe : prudence + acc\u00e9l\u00e9ration.\n"
            f"{D}Subvention UE r\u00e9duit le co\u00fbt ; emprunt limit\u00e9 \u00e0 30 %.\n"
            f"{D}Compromis entre profils actionnaires."
        ),
        attendu="Distinction interne/externe, crit\u00e8res mobilis\u00e9s, montage justifi\u00e9.",
        notions=["financement interne", "financement externe", "arbitrage"],
    ),
    I(
        "e6",
        "Bilan fonctionnel chez Safran",
        support=(
            "Safran pr\u00e9sente son bilan fonctionnel simplifi\u00e9 au 31/12/2024 (k\u20ac) : "
            "Ressources stables = Capitaux propres 12 450 + Dettes LT 4 820 = 17 270. "
            "Emplois stables = Immobilisations nettes 15 680. Passif circulant 5 120 ; "
            "Actif circulant 6 890. Tr\u00e9sorerie active 420. Le bilan fonctionnel rattache "
            "les op\u00e9rations \u00e0 l'exploitation, aux flux ou aux investissements. Safran "
            "pr\u00e9pare un investissement moteurs bas carbone (680 M\u20ac) qui augmentera "
            "les emplois stables."
        ),
        consigne=(
            "Explique la structure du bilan fonctionnel de Safran. Pr\u00e9sente ressources stables, "
            "emplois stables, actif/passif circulant."
        ),
        questions=[
            "Qu'est-ce que le bilan fonctionnel et \u00e0 quoi sert-il ?",
            "Pr\u00e9sente les ressources et emplois stables de Safran \u00e0 partir des donn\u00e9es.",
            "Comment l'investissement pr\u00e9vu de 680 M\u20ac impactera-t-il le bilan fonctionnel ?",
        ],
        correction=(
            "1) Bilan fonctionnel :\n"
            "Analyse du bilan par origine et utilisation des flux financiers. "
            "Rattache op\u00e9rations \u00e0 exploitation, flux ou investissements.\n\n"
            "2) Structure Safran :\n"
            f"{D}Ressources stables : 17 270 k\u20ac (CP 12 450 + dettes LT 4 820).\n"
            f"{D}Emplois stables : 15 680 k\u20ac (immobilisations nettes).\n"
            f"{D}Exc\u00e9dent ressources stables : 1 590 k\u20ac avant investissement.\n"
            f"{D}Actif circulant (6 890) > Passif circulant (5 120) : BFR positif.\n\n"
            "3) Impact investissement :\n"
            f"{D}Emplois stables passent \u00e0 ~16 360 M\u20ac (+680).\n"
            f"{D}Financement externe n\u00e9cessaire malgr\u00e9 exc\u00e9dent initial."
        ),
        attendu="Bilan fonctionnel expliqu\u00e9, donn\u00e9es structur\u00e9es, impact investissement.",
        notions=["bilan fonctionnel", "ressources stables", "emplois stables"],
    ),
    I(
        "e7",
        "Fonds de roulement net global chez Airbus",
        support=(
            "A partir du bilan fonctionnel Airbus 2024, le contr\u00f4leur calcule le FR : "
            "FR = Ressources stables 28 400 \u2212 Emplois stables 24 150 = +4 250 M\u20ac (positif). "
            "Interpr\u00e9tation : les ressources stables suffisent \u00e0 financer les emplois stables, "
            "l'exc\u00e9dent peut contribuer au financement du cycle d'exploitation. Apr\u00e8s "
            "investissement A320neo ramp-up (+1 200 M\u20ac emplois stables, +800 M\u20ac ressources LT), "
            "FR redevient : 29 200 \u2212 25 350 = +3 850 M\u20ac. Un FR n\u00e9gatif obligerait "
            "Airbus \u00e0 recourir \u00e0 des d\u00e9couverts."
        ),
        consigne=(
            "Calcule et interpr\u00e8te le fonds de roulement d'Airbus avant et apr\u00e8s investissement. "
            "Pr\u00e9sente les cons\u00e9quences d'un FR n\u00e9gatif."
        ),
        questions=[
            "Quelle est la formule du fonds de roulement net global ?",
            "Calcule le FR d'Airbus avant et apr\u00e8s l'investissement.",
            "Que faire si le FR est n\u00e9gatif selon le cours ?",
        ],
        correction=(
            "1) Formule FR :\n"
            "FR = Ressources stables \u2212 Emplois stables.\n\n"
            "2) Calculs Airbus :\n"
            f"{D}Avant : FR = 28 400 \u2212 24 150 = +4 250 M\u20ac (positif, \u00e9quilibr\u00e9).\n"
            f"{D}Apr\u00e8s : FR = 29 200 \u2212 25 350 = +3 850 M\u20ac (positif mais r\u00e9duit).\n\n"
            "3) FR n\u00e9gatif :\n"
            f"{D}Ressources stables insuffisantes pour emplois stables.\n"
            f"{D}Solutions : d\u00e9couverts, allongement d\u00e9lais fournisseurs, comptes courants associ\u00e9s."
        ),
        attendu="Formule correcte, calculs avant/apr\u00e8s, cons\u00e9quences FR n\u00e9gatif.",
        notions=["fonds de roulement", "FR", "bilan fonctionnel"],
    ),
    I(
        "e8",
        "Besoin en fonds de roulement chez TotalEnergies",
        support=(
            "TotalEnergies pr\u00e9sente un BFR positif en 2024 : BFR = Actif circulant "
            "\u2212 Passif circulant = 18 200 \u2212 14 800 = 3 400 M\u20ac. Composition actif "
            "circulant : stocks p\u00e9troliers 8 900 M\u20ac, cr\u00e9ances clients 6 200 M\u20ac, "
            "autres 3 100 M\u20ac. Passif circulant : dettes fournisseurs 9 400 M\u20ac, "
            "charges 4 200 M\u20ac, autres 1 200 M\u20ac. Cycle d'exploitation : environ 45 jours "
            "entre achat brut et encaissement. Le BFR positif signifie un d\u00e9calage \u00e0 "
            "financer entre emplois et ressources CT."
        ),
        consigne=(
            "Calcule et interpr\u00e8te le BFR de TotalEnergies. Explique le lien entre cycle "
            "d'exploitation et besoin de financement \u00e0 court terme."
        ),
        questions=[
            "Quelle est la formule du BFR et que signifie un BFR positif ?",
            "Calcule le BFR de TotalEnergies et identifie les postes principaux.",
            "Comment le cycle d'exploitation de 45 jours explique-t-il le BFR positif ?",
        ],
        correction=(
            "1) Formule BFR :\n"
            "BFR = Actif circulant \u2212 Passif circulant. BFR positif : ressources CT insuffisantes "
            "pour couvrir emplois CT.\n\n"
            "2) Calcul TotalEnergies :\n"
            f"{D}BFR = 18 200 \u2212 14 800 = 3 400 M\u20ac (positif).\n"
            f"{D}Actif : stocks 8 900 + cr\u00e9ances 6 200 + autres.\n"
            f"{D}Passif : fournisseurs 9 400 + charges 4 200 + autres.\n\n"
            "3) Cycle d'exploitation :\n"
            f"{D}45 jours achat-encaissement = capital bloqu\u00e9.\n"
            f"{D}Stocks p\u00e9troliers et cr\u00e9ances gonflent le BFR."
        ),
        attendu="BFR calcul\u00e9, composants identifi\u00e9s, lien cycle d'exploitation expliqu\u00e9.",
        notions=["besoin en fonds de roulement", "BFR", "cycle d'exploitation"],
    ),
    I(
        "e9",
        "Tr\u00e9sorerie nette chez BNP Paribas",
        support=(
            "Pour une filiale industrielle du groupe analys\u00e9e par BNP Paribas en 2024 : "
            "FR = +290 k\u20ac, BFR = +490 k\u20ac, Tr\u00e9sorerie nette = FR \u2212 BFR = "
            "\u2212200 k\u20ac (n\u00e9gative). Tr\u00e9sorerie nette n\u00e9gative = emploi CT "
            "financ\u00e9 par d\u00e9couvert autoris\u00e9 250 k\u20ac \u00e0 7,5 %. BNP Paribas "
            "propose aussi l'affacturage sur 40 % des cr\u00e9ances (frais 2,1 %) pour acc\u00e9l\u00e9rer "
            "les encaissements. Formule : Tr\u00e9sorerie = FR \u2212 BFR. Si positive : ressource CT ; "
            "si n\u00e9gative : emploi CT (d\u00e9couverts)."
        ),
        consigne=(
            "Calcule la tr\u00e9sorerie nette et analyse l'\u00e9quilibre financier. "
            "Pr\u00e9sente les solutions de financement du cycle d'exploitation."
        ),
        questions=[
            "Quelle est la relation entre FR, BFR et tr\u00e9sorerie nette ?",
            "Calcule la tr\u00e9sorerie nette et interpr\u00e8te le signe n\u00e9gatif.",
            "Quelles solutions BNP Paribas propose-t-elle pour financer le cycle d'exploitation ?",
        ],
        correction=(
            "1) Relation FR/BFR/Tr\u00e9sorerie :\n"
            "Tr\u00e9sorerie nette = FR \u2212 BFR. Mesure liquidit\u00e9s disponibles ou emprunt\u00e9es.\n\n"
            "2) Calcul :\n"
            f"{D}Tr\u00e9sorerie = 290 \u2212 490 = \u2212200 k\u20ac (n\u00e9gative).\n"
            f"{D}Emploi CT : 200 k\u20ac financ\u00e9s par d\u00e9couvert.\n\n"
            "3) Solutions BNP Paribas :\n"
            f"{D}D\u00e9couvert bancaire 250 k\u20ac autoris\u00e9.\n"
            f"{D}Affacturage 40 % cr\u00e9ances (financement anticip\u00e9 factures).\n"
            f"{D}Objectif : r\u00e9duire le d\u00e9calage du cycle d'exploitation."
        ),
        attendu="Formule tr\u00e9sorerie, calcul correct, solutions CT identifi\u00e9es.",
        notions=["tr\u00e9sorerie nette", "FR", "BFR", "affacturage"],
    ),
    I(
        "e10",
        "Synth\u00e8se financement et \u00e9quilibre financier chez Cr\u00e9dit Agricole",
        support=(
            "Synth\u00e8se Cr\u00e9dit Agricole CIB (financement PME client) mars 2025. Projet client "
            "agroalimentaire : 8,2 M\u20ac. Montage retenu : autofinancement 3,1 M\u20ac, subvention "
            "R\u00e9gion 0,9 M\u20ac, pr\u00eat CA 3,5 M\u20ac \u00e0 3,2 %, cr\u00e9dit-bail rejet\u00e9. "
            "Apr\u00e8s investissement : FR +85 k\u20ac, BFR +620 k\u20ac, tr\u00e9sorerie \u2212535 k\u20ac. "
            "Plan tr\u00e9sorerie : affacturage 60 % cr\u00e9ances, d\u00e9lai fournisseurs 45 \u2192 52 jours. "
            "Indicateurs cibles 2026 : FR > 150 k\u20ac, tr\u00e9sorerie positive."
        ),
        consigne=(
            "R\u00e9dige une synth\u00e8se du montage de financement et de l'\u00e9quilibre financier. "
            "Mobilise toutes les modalit\u00e9s de financement et les trois ratios."
        ),
        questions=[
            "Pr\u00e9sente le montage de financement retenu et justifie le rejet du cr\u00e9dit-bail.",
            "Analyse l'\u00e9quilibre FR/BFR/tr\u00e9sorerie apr\u00e8s investissement.",
            "Quelles mesures pour r\u00e9tablir une tr\u00e9sorerie positive d'ici 2026 ?",
        ],
        correction=(
            "1) Montage financement :\n"
            f"{D}Interne : autofinancement 3,1 M\u20ac (38 %).\n"
            f"{D}Externe : subvention 0,9 M\u20ac + pr\u00eat CA 3,5 M\u20ac.\n"
            f"{D}Cr\u00e9dit-bail rejet\u00e9 : co\u00fbt total sup\u00e9rieur.\n\n"
            "2) \u00c9quilibre financier :\n"
            f"{D}FR +85 k\u20ac : positif mais faible.\n"
            f"{D}BFR +620 k\u20ac : d\u00e9calage CT important.\n"
            f"{D}Tr\u00e9sorerie \u2212535 k\u20ac : d\u00e9s\u00e9quilibre.\n\n"
            "3) Mesures 2026 :\n"
            f"{D}Affacturage \u00e9tendu (60 % cr\u00e9ances).\n"
            f"{D}Allongement d\u00e9lai fournisseurs.\n"
            f"{D}Surveillance FR/BFR trimestrielle."
        ),
        attendu="Synth\u00e8se compl\u00e8te financement + ratios, mesures coh\u00e9rentes.",
        notions=["financement", "FR", "BFR", "tr\u00e9sorerie"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : La Banque Postale finance une extension",
        support=(
            "La Banque Postale accompagne une PME normande de packaging (CA 12 M\u20ac, 95 salari\u00e9s). "
            "Projet extension ligne recyclage : 4,2 M\u20ac, ROI 4,5 ans. Bilan fonctionnel 2024 : "
            "FR +180 k\u20ac, BFR +420 k\u20ac, tr\u00e9sorerie \u2212240 k\u20ac. Options : "
            "(A) autofinancement seul \u2014 impossible ; (B) emprunt 2,1 M\u20ac \u00e0 4,5 % ; "
            "(C) cr\u00e9dit-bail 2,8 M\u20ac total ; (D) montage mixte retenu. Subvention ADEME "
            "420 k\u20ac obtenue. D\u00e9lai d\u00e9cision : 15 avril 2025. Le board doit valider "
            "montage et plan tr\u00e9sorerie post-investissement."
        ),
        consigne=(
            "R\u00e9dige une r\u00e9ponse type bac sur le financement du projet. Mobilise : "
            "financement interne/externe, autofinancement, emprunt, cr\u00e9dit-bail, subvention, FR/BFR/tr\u00e9sorerie."
        ),
        questions=[
            "Pr\u00e9sente les options de financement \u00e9tudi\u00e9es et le montage retenu.",
            "Analyse le bilan fonctionnel avant investissement (FR, BFR, tr\u00e9sorerie).",
            "Compare emprunt, cr\u00e9dit-bail et subvention dans ce contexte.",
            "Quel plan de tr\u00e9sorerie post-investissement recommandes-tu ?",
        ],
        correction=(
            "1) Options et montage :\n"
            f"{D}(A) Autofinancement seul : insuffisant.\n"
            f"{D}(B) Emprunt seul : charge financi\u00e8re \u00e9lev\u00e9e.\n"
            f"{D}(C) Cr\u00e9dit-bail : flexible mais co\u00fbteux (2,8 M\u20ac).\n"
            f"{D}(D) Mixte : autofinancement + subvention ADEME + pr\u00eat Banque Postale.\n\n"
            "2) Bilan fonctionnel avant :\n"
            f"{D}FR +180 k\u20ac : \u00e9quilibre structurel correct.\n"
            f"{D}BFR +420 k\u20ac : cycle gourmand.\n"
            f"{D}Tr\u00e9sorerie \u2212240 k\u20ac : d\u00e9j\u00e0 tendue.\n\n"
            "3) Comparaison modalit\u00e9s :\n"
            f"{D}Subvention ADEME 420 k\u20ac : gratuite, conditions environnementales.\n"
            f"{D}Emprunt : charge int\u00e9r\u00eats mod\u00e9r\u00e9e.\n"
            f"{D}Cr\u00e9dit-bail rejet\u00e9 : co\u00fbt total sup\u00e9rieur.\n\n"
            "4) Plan tr\u00e9sorerie :\n"
            "Affacturage, n\u00e9gociation d\u00e9lais fournisseurs, d\u00e9couverts temporaire, "
            "surveillance mensuelle FR/BFR."
        ),
        attendu="Options compar\u00e9es, bilan analys\u00e9, plan tr\u00e9sorerie argument\u00e9.",
        notions=["financement", "bilan fonctionnel", "subvention", "emprunt"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : Crise de tr\u00e9sorerie et ADEME",
        support=(
            "Une PME \u00e9nergies renouvelables (client ADEME, 62 salari\u00e9s, CA 9,8 M\u20ac) "
            "alerte en novembre 2025 : tr\u00e9sorerie \u2212680 k\u20ac malgr\u00e9 subvention ADEME "
            "180 k\u20ac vers\u00e9e. Causes : retard encaissement cr\u00e9dits imp\u00f4t recherche, "
            "BFR gonfl\u00e9 (+35 % stocks), investissement panneaux solaires acc\u00e9l\u00e9r\u00e9. "
            "Bilan : FR +45 k\u20ac, BFR +725 k\u20ac. Options : (A) emprunt relais Bpifrance 500 k\u20ac ; "
            "(B) affacturage int\u00e9gral cr\u00e9ances ; (C) report investissement 6 mois ; "
            "(D) avance remboursable ADEME 200 k\u20ac. KPI : d\u00e9lai client 68 jours, "
            "d\u00e9lai fournisseur 32 jours."
        ),
        consigne=(
            "Analyse la crise de tr\u00e9sorerie et propose un plan d'action. Mobilise FR, BFR, "
            "tr\u00e9sorerie, subventions et financements CT."
        ),
        questions=[
            "Diagnostique les causes de la tr\u00e9sorerie n\u00e9gative \u00e0 partir du support.",
            "Compare les options A, B, C et D (avantages, limites, co\u00fbts).",
            "Quelle strat\u00e9gie combin\u00e9e recommandes-tu ?",
            "Comment pr\u00e9venir de futures tensions de tr\u00e9sorerie ?",
        ],
        correction=(
            "1) Diagnostic :\n"
            f"{D}BFR +725 k\u20ac vs FR +45 k\u20ac : d\u00e9s\u00e9quilibre structurel.\n"
            f"{D}Retard CIR et stocks (+35 %) aggravent la tr\u00e9sorerie.\n"
            f"{D}Investissement acc\u00e9l\u00e9r\u00e9 sans financement CT adapt\u00e9.\n\n"
            "2) Comparaison options :\n"
            f"{D}(A) Emprunt relais : rapide, charge int\u00e9r\u00eats.\n"
            f"{D}(B) Affacturage : acc\u00e9l\u00e8re encaissements, frais 2-3 %.\n"
            f"{D}(C) Report investissement : s\u00e9curise tr\u00e9sorerie, retarde projet vert.\n"
            f"{D}(D) Avance ADEME : adapt\u00e9e au profil, remboursable.\n\n"
            "3) Strat\u00e9gie combin\u00e9e :\n"
            "Mix B + D imm\u00e9diat + A si n\u00e9cessaire. \u00c9viter report total (C) si subvention "
            "conditionn\u00e9e aux d\u00e9lais.\n\n"
            "4) Pr\u00e9vention :\n"
            f"{D}Pilotage mensuel FR/BFR/tr\u00e9sorerie.\n"
            f"{D}Anticipation d\u00e9calages CIR et stocks.\n"
            f"{D}Montage financement \u00e9quilibrant investissement et CT."
        ),
        attendu="Crise analys\u00e9e, options compar\u00e9es, strat\u00e9gie combin\u00e9e et pr\u00e9vention.",
        notions=["tr\u00e9sorerie", "BFR", "subvention", "financement CT"],
    ),
]
