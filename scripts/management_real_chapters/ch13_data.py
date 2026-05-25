# -*- coding: utf-8 -*-
"""Management chapitre 13 — acteurs reels, un concept par exercice."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH13 = [
    I(
        "e1",
        "Code de d\u00e9ontologie chez L'Or\u00e9al",
        support=(
            "L'Or\u00e9al (88 000 salari\u00e9s) applique depuis 2020 un Code d'\u00e9thique traduit "
            "en 45 langues. Comit\u00e9 d\u00e9ontologie : 4 r\u00e9unions/an, 312 signalements trait\u00e9s en 2024 "
            "(dont 28 aboutissant \u00e0 sanction).\n"
            "R\u00e8gles : cadeaux fournisseurs plafonn\u00e9s 50 \u20ac, interdiction conflits d'int\u00e9r\u00eats "
            "non d\u00e9clar\u00e9s, protection lanceurs d'alerte.\n"
            "R\u00e9sultat : 89 % des managers form\u00e9s ; score \u00e9thique Great Place to Work : 82/100."
        ),
        consigne=(
            "D\u00e9finis la d\u00e9ontologie en entreprise et montre comment L'Or\u00e9al la d\u00e9ploie."
        ),
        questions=[
            "Qu'est-ce que la d\u00e9ontologie en entreprise ?",
            "Quels dispositifs L'Or\u00e9al met-elle en place ?",
            "Pourquoi un code de d\u00e9ontologie peut-il \u00eatre un avantage concurrentiel ?",
        ],
        correction=(
            "1) D\u00e9ontologie :\n"
            "Ensemble de r\u00e8gles \u00e9thiques et de devoirs professionnels guidant les comportements "
            "des salari\u00e9s et dirigeants.\n\n"
            "2) Dispositifs L'Or\u00e9al :\n"
            f"{D}Code traduit, comit\u00e9 d\u00e9ontologie, signalements, plafonds cadeaux, formation managers.\n\n"
            "3) Avantage concurrentiel :\n"
            f"{D}R\u00e9duit les risques juridiques et renforce confiance clients, partenaires et talents (score 82/100)."
        ),
        attendu="D\u00e9finition, dispositifs cit\u00e9s, avantage \u00e9thique argument\u00e9.",
        notions=["d\u00e9ontologie", "code \u00e9thique", "comit\u00e9 d\u00e9ontologie"],
    ),
    I(
        "e2",
        "Greenwashing chez Nestl\u00e9",
        support=(
            "Nestl\u00e9 communique en 2024 sur des emballages \u00ab 100 % recyclable d'ici 2025 \u00bb "
            "pour les bouteilles Vittel. La DGCCRF ouvre une enqu\u00eate apr\u00e8s plainte d'associations : "
            "seulement 62 % des points de collecte acceptent le plastique ; all\u00e9gation jug\u00e9e trompeuse.\n"
            "Sanction possible : 375 000 \u20ac (publicit\u00e9 comparative). "
            "Notori\u00e9t\u00e9 \u00e9thique Nestl\u00e9 : \u22129 points en six mois."
        ),
        consigne=(
            "D\u00e9finis le greenwashing et analyse le cas Nestl\u00e9/Vittel."
        ),
        questions=[
            "Qu'est-ce que le greenwashing ?",
            "Pourquoi l'all\u00e9gation \u00ab 100 % recyclable \u00bb est-elle contest\u00e9e ?",
            "Quels risques pour Nestl\u00e9 (juridique et r\u00e9putation) ?",
        ],
        correction=(
            "1) Greenwashing :\n"
            "Communication environnementale exag\u00e9r\u00e9e ou mensong\u00e8re pour se donner une image \u00e9cologique "
            "non justifi\u00e9e par les pratiques r\u00e9elles.\n\n"
            "2) Contestation Nestl\u00e9 :\n"
            f"{D}Recyclabilit\u00e9 th\u00e9orique \u2260 recyclage effectif ; 62 % des collectes seulement.\n\n"
            "3) Risques :\n"
            f"{D}Sanction DGCCRF, atteinte r\u00e9putation (\u22129 points \u00e9thique)."
        ),
        attendu="D\u00e9finition, critique de l'all\u00e9gation, risques identifi\u00e9s.",
        notions=["greenwashing", "DGCCRF", "all\u00e9gations environnementales"],
    ),
    I(
        "e3",
        "RSE washing chez Patagonia",
        support=(
            "Patagonia affirme : \u00ab We're in business to save our home planet \u00bb. "
            "En 2024, 98 % des produits en coton bio certifi\u00e9 ; 1 % des ventes revers\u00e9 \u00e0 des ONG ; "
            "rapport d'impact public d\u00e9taill\u00e9.\n"
            "Critiques 2025 : cha\u00eene polyester encore p\u00e9trolier (42 % du mix) ; "
            "prix \u00e9lev\u00e9s limitant l'accessibilit\u00e9.\n"
            "Patagonia r\u00e9pond par transparence sur limites et objectif polyester recycl\u00e9 85 % en 2028."
        ),
        consigne=(
            "D\u00e9finis le RSE washing et explique pourquoi Patagonia est plut\u00f4t un mod\u00e8le "
            "de sinc\u00e9rit\u00e9 que de RSE washing."
        ),
        questions=[
            "Qu'est-ce que le RSE washing ?",
            "Quels \u00e9l\u00e9ments cr\u00e9dibles dans la d\u00e9marche Patagonia ?",
            "Comment la transparence sur les limites \u00e9vite-t-elle le RSE washing ?",
        ],
        correction=(
            "1) RSE washing :\n"
            "Communication sociale/environnementale superficielle sans actions concr\u00e8tes ni r\u00e9sultats v\u00e9rifiables.\n\n"
            "2) Cr\u00e9dibilit\u00e9 Patagonia :\n"
            f"{D}Coton bio 98 %, reversement 1 %, rapport public chiffr\u00e9.\n\n"
            "3) Transparence :\n"
            f"{D}Reconna\u00eet les limites (polyester) et fixe objectifs mesurables \u2192 cr\u00e9dibilit\u00e9, pas du washing."
        ),
        attendu="D\u00e9finition RSE washing, preuves Patagonia, r\u00f4le transparence.",
        notions=["RSE washing", "reporting RSE", "transparence"],
    ),
    I(
        "e4",
        "Discrimination au recrutement chez Greenpeace",
        support=(
            "Greenpeace France audite ses recrutements 2024 : sur 48 embauches, "
            "72 % profils dipl\u00f4m\u00e9s Grandes \u00c9coles ; 8 % issus de quartiers prioritaires "
            "(objectif interne : 20 %).\n"
            "Analyse des entretiens : biais de similarit\u00e9 (recruteurs favorisent profils "
            "proches d'eux). Mesures 2025 : grille anonymis\u00e9e, jury mixte, formation biais inconscients.\n"
            "R\u00e9sultat attendu : diversit\u00e9 sociale +8 points d'ici 2026."
        ),
        consigne=(
            "D\u00e9finis la discrimination au travail et analyse la d\u00e9marche Greenpeace."
        ),
        questions=[
            "Qu'est-ce que la discrimination au recrutement ?",
            "Quel biais Greenpeace identifie-t-elle dans le support ?",
            "Quelles mesures correctives sont mises en place ?",
        ],
        correction=(
            "1) Discrimination recrutement :\n"
            "Traitement d\u00e9favorable d'un candidat bas\u00e9 sur un crit\u00e8re ill\u00e9gitime "
            "(origine, genre, dipl\u00f4me, quartier, etc.).\n\n"
            "2) Biais identifi\u00e9 :\n"
            f"{D}Biais de similarit\u00e9 ; sous-repr\u00e9sentation quartiers prioritaires (8 % vs 20 % objectif).\n\n"
            "3) Mesures :\n"
            f"{D}Grille anonymis\u00e9e, jury mixte, formation biais inconscients."
        ),
        attendu="D\u00e9finition, biais rep\u00e9r\u00e9, mesures correctives.",
        notions=["discrimination", "diversit\u00e9", "recrutement"],
    ),
    I(
        "e5",
        "M\u00e9c\u00e9nat chez Emma\u00fcs",
        support=(
            "Emma\u00fcs France (350 communaut\u00e9s, 12 000 compagnons) re\u00e7oit en 2024 :\n"
            "\u2014 m\u00e9c\u00e9nat entreprises : 2,1 M\u20ac (Decathlon, Leroy Merlin, banques) ;\n"
            "\u2014 m\u00e9c\u00e9nat de comp\u00e9tences : 840 jours de b\u00e9n\u00e9volat pro (compta, digital) ;\n"
            "\u2014 dons particuliers : 4,6 M\u20ac.\n"
            "Charte m\u00e9c\u00e8nes : pas de contrepartie publicitaire agressive ; "
            "rapport d'utilisation des fonds publi\u00e9 chaque ann\u00e9e."
        ),
        consigne=(
            "D\u00e9finis le m\u00e9c\u00e9nat d'entreprise et montre comment Emma\u00fcs le structure."
        ),
        questions=[
            "Qu'est-ce que le m\u00e9c\u00e9nat d'entreprise ?",
            "Distingue m\u00e9c\u00e9nat financier et m\u00e9c\u00e9nat de comp\u00e9tences dans le cas Emma\u00fcs.",
            "Pourquoi une charte m\u00e9c\u00e8nes est-elle importante \u00e9thiquement ?",
        ],
        correction=(
            "1) M\u00e9c\u00e9nat entreprise :\n"
            "Soutien gratuit (financier ou en comp\u00e9tences) d'une cause d'int\u00e9r\u00eat g\u00e9n\u00e9ral "
            "sans contrepartie commerciale directe.\n\n"
            "2) Distinction Emma\u00fcs :\n"
            f"{D}Financier : 2,1 M\u20ac entreprises.\n"
            f"{D}Comp\u00e9tences : 840 jours b\u00e9n\u00e9volat pro.\n\n"
            "3) Charte :\n"
            f"{D}\u00c9vite l'opportunisme marketing ; garantit transparence et respect de la cause."
        ),
        attendu="D\u00e9finition, deux types de m\u00e9c\u00e9nat, int\u00e9r\u00eat charte.",
        notions=["m\u00e9c\u00e9nat", "engagement associatif", "RSE"],
    ),
    I(
        "e6",
        "Lanceurs d'alerte et DGCCRF",
        support=(
            "Un contr\u00f4leur DGCCRF signale en interne (2024) des pratiques de contrefa\u00e7on alimentaire "
            "non poursuivies faute de moyens. Proc\u00e9dure lanceur d'alerte (loi Sapin II) : "
            "signalement au d\u00e9fenseur des droits \u2192 enqu\u00eate \u2192 14 entreprises sanctionn\u00e9es en 2025.\n"
            "Protection : anonymat, interdiction repr\u00e9sailles, accompagnement juridique.\n"
            "Co\u00fbt des fraudes \u00e9vit\u00e9es estim\u00e9 : 8,2 M\u20ac consommateurs."
        ),
        consigne=(
            "D\u00e9finis le lanceur d'alerte et explique son r\u00f4le \u00e9thique dans le cas DGCCRF."
        ),
        questions=[
            "Qu'est-ce qu'un lanceur d'alerte ?",
            "Quelle proc\u00e9dure suit le signalement dans le support ?",
            "Pourquoi prot\u00e9ger les lanceurs d'alerte est-il essentiel ?",
        ],
        correction=(
            "1) Lanceur d'alerte :\n"
            "Personne qui signale de bonne foi un crime, d\u00e9lit ou violation grave "
            "(s\u00e9curit\u00e9, environnement, corruption).\n\n"
            "2) Proc\u00e9dure :\n"
            f"{D}Signalement interne \u2192 d\u00e9fenseur des droits \u2192 enqu\u00eate \u2192 14 sanctions.\n\n"
            "3) Protection essentielle :\n"
            f"{D}Sans anonymat et anti-repr\u00e9sailles, les fraudes restent cach\u00e9es (8,2 M\u20ac \u00e9vit\u00e9s ici)."
        ),
        attendu="D\u00e9finition, proc\u00e9dure, justification protection.",
        notions=["lanceur d'alerte", "alerte \u00e9thique", "gouvernance"],
    ),
    I(
        "e7",
        "\u00c9thique supply chain chez Biocoop",
        support=(
            "Biocoop (700 magasins coop\u00e9ratifs) audite 100 % de ses fournisseurs bio prioritaires.\n"
            "Audit social 2025 (atelier fruits secs Espagne) : salaires conformes, "
            "mais logements ouvriers agricoles insuffisants \u2192 plan correctif 180 000 \u20ac.\n"
            "Charte fournisseurs : interdiction travail des mineurs, SMIC local minimum, "
            "droit de contr\u00f4le surprise Biocoop.\n"
            "R\u00e9sultat : 94 % fournisseurs conformes ; 6 % sous surveillance renforc\u00e9e."
        ),
        consigne=(
            "Explique l'\u00e9thique de la supply chain et montre comment Biocoop la contr\u00f4le."
        ),
        questions=[
            "Qu'est-ce que l'\u00e9thique de la supply chain ?",
            "Quels crit\u00e8res la charte Biocoop impose-t-elle ?",
            "Comment l'entreprise r\u00e9agit-elle \u00e0 une non-conformit\u00e9 d\u00e9tect\u00e9e ?",
        ],
        correction=(
            "1) \u00c9thique supply chain :\n"
            "Respect des normes sociales, environnementales et d\u00e9ontologiques "
            "par l'entreprise et l'ensemble de ses fournisseurs.\n\n"
            "2) Charte Biocoop :\n"
            f"{D}Pas de travail des mineurs, SMIC local, droit d'audit surprise.\n\n"
            "3) Non-conformit\u00e9 :\n"
            f"{D}Plan correctif chiffr\u00e9 (180 000 \u20ac) ; fournisseurs d\u00e9faillants sous surveillance."
        ),
        attendu="D\u00e9finition, crit\u00e8res charte, r\u00e9action corrective.",
        notions=["supply chain \u00e9thique", "audit social", "fournisseurs"],
    ),
    I(
        "e8",
        "Conflit d'int\u00e9r\u00eats chez Danone",
        support=(
            "Mars 2025 : le directeur achats emballages Danone poss\u00e8de discr\u00e8tement 12 % "
            "d'une PME sous-traitante candidate \u00e0 un appel d'offres de 4,5 M\u20ac.\n"
            "Un salari\u00e9 signale via la ligne \u00e9thique. Enqu\u00eate interne : "
            "mise \u00e0 l'\u00e9cart du directeur, annulation AO, nouvel appel d'offres transparent.\n"
            "Code Danone : d\u00e9claration obligatoire participations et cadeaux > 30 \u20ac."
        ),
        consigne=(
            "D\u00e9finis le conflit d'int\u00e9r\u00eats et analyse le cas Danone."
        ),
        questions=[
            "Qu'est-ce qu'un conflit d'int\u00e9r\u00eats ?",
            "En quoi la situation du directeur achats en est-elle un ?",
            "Quelles mesures Danone prend-elle ?",
        ],
        correction=(
            "1) Conflit d'int\u00e9r\u00eats :\n"
            "Situation o\u00f9 un d\u00e9cideur peut \u00eatre influenc\u00e9 par un int\u00e9r\u00eat personnel "
            "au d\u00e9triment de l'int\u00e9r\u00eat de l'entreprise.\n\n"
            "2) Cas directeur achats :\n"
            f"{D}Participation 12 % dans un candidat \u00e0 un AO de 4,5 M\u20ac qu'il doit \u00e9valuer.\n\n"
            "3) Mesures :\n"
            f"{D}Signalement, enqu\u00eate, \u00e9cartement, annulation AO, nouvel appel transparent."
        ),
        attendu="D\u00e9finition, application au cas, mesures correctives.",
        notions=["conflit d'int\u00e9r\u00eats", "achats", "compliance"],
    ),
    I(
        "e9",
        "Compliance \u00e9thique chez Too Good To Go",
        support=(
            "Too Good To Go (anti-gaspillage, 150 M repas sauv\u00e9s en 2024) d\u00e9ploie en 2025 "
            "une formation compliance obligatoire pour 100 % des salari\u00e9s (e-learning 2 h) :\n"
            "\u2014 RGPD et donn\u00e9es clients ;\n"
            "\u2014 anti-corruption ;\n"
            "\u2014 hygi\u00e8ne et s\u00e9curit\u00e9 alimentaire partenaires.\n"
            "Taux de compl\u00e9tion : 97 %. Incidents \u00e9thiques signal\u00e9s : 11 en 2024, "
            "tous trait\u00e9s sous 15 jours."
        ),
        consigne=(
            "D\u00e9finis la compliance et explique le dispositif Too Good To Go."
        ),
        questions=[
            "Qu'est-ce que la compliance (\u00e9thique et r\u00e9glementaire) ?",
            "Quels th\u00e8mes couvre la formation ?",
            "Quels indicateurs montrent l'efficacit\u00e9 du dispositif ?",
        ],
        correction=(
            "1) Compliance :\n"
            "Ensemble des processus pour garantir le respect des lois, r\u00e8glements "
            "et r\u00e8gles internes de l'entreprise.\n\n"
            "2) Th\u00e8mes formation :\n"
            f"{D}RGPD, anti-corruption, hygi\u00e8ne alimentaire partenaires.\n\n"
            "3) Efficacit\u00e9 :\n"
            f"{D}97 % compl\u00e9tion ; 11 incidents trait\u00e9s sous 15 jours."
        ),
        attendu="D\u00e9finition compliance, th\u00e8mes, indicateurs.",
        notions=["compliance", "formation \u00e9thique", "culture d'entreprise"],
    ),
    I(
        "e10",
        "Synth\u00e8se \u00e9thique chez Amnesty International",
        support=(
            "Amnesty International France (800 000 sympathisants) exige une \u00e9thique exemplaire :\n"
            "\u2014 transparence financi\u00e8re (rapport public, 78 % fonds \u2192 terrain) ;\n"
            "\u2014 charte diversit\u00e9 et non-discrimination ;\n"
            "\u2014 campagnes bas\u00e9es sur faits v\u00e9rifiables (pas de d\u00e9sinformation) ;\n"
            "\u2014 refus de financements \u00e9tatiques contraignants.\n"
            "Cr\u00e9dibilit\u00e9 (sondage 2025) : 71 % Fran\u00e7ais font confiance \u00e0 ses rapports "
            "(contre 34 % pour une marque fast fashion moyenne)."
        ),
        consigne=(
            "Montre en quoi l'\u00e9thique est un avantage strat\u00e9gique pour Amnesty International."
        ),
        questions=[
            "Quels piliers \u00e9thiques Amnesty d\u00e9ploie-t-elle ?",
            "Pourquoi la cr\u00e9dibilit\u00e9 est-elle vitale pour une ONG ?",
            "Compare le score de confiance Amnesty \u00e0 une marque fast fashion.",
        ],
        correction=(
            "1) Piliers \u00e9thiques :\n"
            f"{D}Transparence financi\u00e8re, diversit\u00e9, faits v\u00e9rifiables, ind\u00e9pendance financi\u00e8re.\n\n"
            "2) Cr\u00e9dibilit\u00e9 vitale :\n"
            f"{D}La mission repose sur la confiance du public et des m\u00e9dias.\n\n"
            "3) Comparaison :\n"
            f"{D}71 % confiance Amnesty vs 34 % fast fashion \u2192 l'\u00e9thique est son capital strat\u00e9gique."
        ),
        attendu="Piliers list\u00e9s, r\u00f4le cr\u00e9dibilit\u00e9, comparaison chiffr\u00e9e.",
        notions=["\u00e9thique strat\u00e9gique", "RSE", "r\u00e9putation"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : greenwashing concurrent \u2014 Comit\u00e9 d'\u00e9thique Danone",
        support=(
            "Le comit\u00e9 d'\u00e9thique Danone examine en f\u00e9vrier 2025 une campagne concurrente "
            "(marque yaourts) : \u00ab 100 % naturel \u00bb avec colorants artificiels list\u00e9s au dos.\n"
            "Danone h\u00e9site : (A) ignorer ; (B) signalement DGCCRF avec analyses labo ; "
            "(C) contre-pub agressive ; (D) communication Danone sur ses propres preuves sans attaquer le nom.\n"
            "Enjeu : cr\u00e9dibilit\u00e9 RSE Danone (objectif 2026 : leader transparence alimentaire)."
        ),
        consigne=(
            "Analyse le greenwashing du concurrent et recommande une d\u00e9marche \u00e9thique pour Danone."
        ),
        questions=[
            "Pourquoi \u00ab 100 % naturel \u00bb est-il un cas de greenwashing ?",
            "Quels risques \u00e9thiques pour Danone avec l'option C ?",
            "Quels avantages de l'option B ou D ?",
            "Quelle d\u00e9cision recommandes-tu ? Justifie.",
        ],
        correction=(
            "1) Greenwashing concurrent :\n"
            f"{D}All\u00e9gation \u00ab naturel \u00bb contredite par colorants artificiels.\n\n"
            "2) Risque option C :\n"
            f"{D}D\u00e9nigrement, guerre commerciale agressive, atteinte \u00e0 l'\u00e9thique de communication.\n\n"
            "3) Options B/D :\n"
            f"{D}B = signalement l\u00e9gitime avec preuves ; D = diff\u00e9renciation par transparence propre.\n\n"
            "4) Recommandation D (+ B si fraude av\u00e9r\u00e9e) :\n"
            f"{D}Renforcer sa cr\u00e9dibilit\u00e9 sans d\u00e9nigrement."
        ),
        attendu="Greenwashing identifi\u00e9, risques option C, recommandation argument\u00e9e.",
        notions=["greenwashing", "DGCCRF", "preuves et transparence"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : gouvernance \u2014 CSE de L'Or\u00e9al",
        support=(
            "Le CSE L'Or\u00e9al Clichy alerte en avril 2025 : un administrateur ind\u00e9pendant "
            "si\u00e8ge aussi au conseil d'un fournisseur chimique strat\u00e9gique (CA fournisseur : "
            "12 % des achats L'Or\u00e9al).\n"
            "Conflit d'int\u00e9r\u00eats potentiel non d\u00e9clar\u00e9. CSE demande : "
            "audition, recusation votes achats, renforcement gouvernance.\n"
            "Options CODIR : (A) minimiser ; (B) recusation + audit gouvernance ; "
            "(C) licenciement administrateur ; (D) silence et renouvellement contrat fournisseur."
        ),
        consigne=(
            "Analyse le probl\u00e8me de gouvernance et propose une d\u00e9cision \u00e9thique."
        ),
        questions=[
            "Quel conflit d'int\u00e9r\u00eats est en jeu ?",
            "Quel r\u00f4le du CSE dans cette crise \u00e9thique ?",
            "Pourquoi l'option D est-elle dangereuse ?",
            "Quelle option recommandes-tu ? Justifie.",
        ],
        correction=(
            "1) Conflit :\n"
            f"{D}Administrateur ind\u00e9pendant li\u00e9 \u00e0 un fournisseur repr\u00e9sentant 12 % des achats.\n\n"
            "2) R\u00f4le CSE :\n"
            f"{D}Alerte, demande audition, veille int\u00e9r\u00eats salari\u00e9s et \u00e9thique entreprise.\n\n"
            "3) Danger option D :\n"
            f"{D}Dissimulation, renouvellement malgr\u00e9 conflit \u2192 crise r\u00e9putation et juridique.\n\n"
            "4) Recommandation B :\n"
            f"{D}Recusation, audit gouvernance, transparence publique interne."
        ),
        attendu="Conflit identifi\u00e9, r\u00f4le CSE, rejet option D, choix B argument\u00e9.",
        notions=["gouvernance", "conflit d'int\u00e9r\u00eats", "CSE"],
    ),
]
