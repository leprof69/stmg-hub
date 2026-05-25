# -*- coding: utf-8 -*-
"""Chapitre 6 — Le rôle des technologies dans la transformation de l'information."""

CHAPTER = 6

EXERCISES = [
    {
        "id": "e1",
        "title": "Donnée, information et connaissance",
        "support": (
            "Le site e-commerce Cdiscount collecte des clics (données brutes). Le système d'information "
            "agrège : « panier moyen 67 € sur la catégorie smartphones en région Île-de-France » "
            "(information). Le responsable marketing interprète : « lancer une promo -10 % sur les "
            "coques en IDF augmenterait la marge » (connaissance). Sans SI, les données resteraient "
            "inexploitables."
        ),
        "consigne": (
            "Distingue donnée, information et connaissance. Explique la transformation par le SI."
        ),
        "questions": [
            "Qu'est-ce qu'une donnée dans cet exemple ?",
            "À quoi correspond l'information et la connaissance ?",
            "Quel rôle du système d'information dans la chaîne ?",
        ],
        "correctionModele": (
            "1) Donnée : clics bruts, non contextualisés.\n\n"
            "2) Information : agrégat panier moyen 67 € IDF — donnée traitée, sens donné.\n"
            "Connaissance : décision promo coques — interprétation stratégique.\n\n"
            "3) SI :\n"
            "Collecte, stocke, traite, diffuse ; rend la donnée exploitable."
        ),
        "attendu": "Trois niveaux distingués, exemple Cdiscount appliqué.",
        "notions": ["Trois niveaux distingués", "exemple Cdiscount appliqué."],
        "minChars": 120,
    },
    {
        "id": "e2",
        "title": "Big Data et règle des 5V",
        "support": (
            "Orange traite des billions de logs réseau par jour (volume), en temps réel pour détecter "
            "pannes (vélocité), mélangeant texte, géolocalisation et chiffres (variété). Des algorithmes "
            "filtrent les faux positifs (véracité). L'objectif est de réduire les interruptions clients "
            "et d'augmenter la valeur perçue du service (valeur)."
        ),
        "consigne": (
            "Présente le Big Data et illustre chacun des 5V avec le support Orange."
        ),
        "questions": [
            "Définis le Big Data.",
            "Associe chaque V à un élément du texte.",
            "Pourquoi la valeur est-elle le V le plus stratégique pour l'organisation ?",
        ],
        "correctionModele": (
            "1) Big Data : ensemble volumineux de données numériques difficile à traiter classiquement.\n\n"
            "2) 5V :\n"
            "Volume : billions logs. Vélocité : temps réel. Variété : texte, géo, chiffres. "
            "Véracité : filtrage faux positifs. Valeur : moins de pannes, satisfaction client.\n\n"
            "3) Valeur stratégique :\n"
            "Sans valeur business, les autres V n'ont pas d'intérêt économique."
        ),
        "attendu": "5V tous illustrés, Big Data défini.",
        "notions": ["5V tous illustrés", "Big Data défini."],
        "minChars": 140,
    },
    {
        "id": "e3",
        "title": "Open data et réutilisation",
        "support": (
            "La métropole de Lyon publie sur data.gouv.fr les horaires de transports, la qualité de "
            "l'air et les budgets participatifs. Une start-up crée une application « Mobilité Lyon » "
            "croisant ces jeux de données. La loi pour une République numérique impose l'open data "
            "aux collectivités de plus de 3 500 habitants depuis octobre 2018 pour la transparence."
        ),
        "consigne": (
            "Définis l'open data et explique comment manipuler des données ouvertes crée de l'information."
        ),
        "questions": [
            "Qu'est-ce que l'open data (caractères) ?",
            "Donne deux exemples de données publiées et une réutilisation.",
            "Quel objectif de transparence pour les collectivités ?",
        ],
        "correctionModele": (
            "1) Open data : accessible, réutilisable, redistribuable sans restriction.\n\n"
            "2) Exemples :\n"
            "Horaires transports + qualité air ? application Mobilité Lyon = information utile.\n\n"
            "3) Transparence :\n"
            "Permettre aux citoyens de contrôler et comprendre l'action publique."
        ),
        "attendu": "Open data défini, réutilisation concrète, cadre légal cité.",
        "notions": ["Open data défini", "réutilisation concrète", "cadre légal cité."],
        "minChars": 150,
    },
    {
        "id": "e4",
        "title": "Données personnelles",
        "support": (
            "Sephora collecte nom, e-mail, historique d'achats et géolocalisation du smartphone via "
            "l'app (données permettant d'identifier directement ou indirectement une personne). "
            "Elle propose des recommandations personnalisées. Un client demande l'accès à ses données ; "
            "le DPO répond sous un mois. Un mineur de 15 ans ne peut pas consentir seul selon le RGPD."
        ),
        "consigne": (
            "Définis les données à caractère personnel et les contraintes d'utilisation (consentement, droits)."
        ),
        "questions": [
            "Quelles données du support sont personnelles ?",
            "Quel droit le client exerce-t-il ?",
            "Pourquoi le mineur pose-t-il un problème de consentement ?",
        ],
        "correctionModele": (
            "1) Données personnelles : nom, e-mail, achats, géolocalisation — identification directe/indirecte.\n\n"
            "2) Droit d'accès :\n"
            "RGPD permet à l'individu de connaître les données traitées.\n\n"
            "3) Mineur :\n"
            "Consentement parental requis, protection renforcée."
        ),
        "attendu": "Données personnelles repérées, droits RGPD mobilisés.",
        "notions": ["Données personnelles repérées", "droits RGPD mobilisés."],
        "minChars": 160,
    },
    {
        "id": "e5",
        "title": "Système d'information et PGI",
        "support": (
            "Le groupe Leclerc déploie un PGI (ERP) intégrant achats, stocks, ventes et comptabilité. "
            "Les données saisies en caisse alimentent en temps réel le stock et la facturation. "
            "Le SI comprend serveurs, logiciels, réseaux et utilisateurs formés. Sans intégration, "
            "chaque magasin tenait des fichiers Excel isolés (risque de doublons et retards)."
        ),
        "consigne": (
            "Définis le système d'information (SI) et le PGI. Montre la transformation donnée ? information."
        ),
        "questions": [
            "Quels composants du SI cites-tu dans le support ?",
            "Qu'est-ce qu'un PGI et quel bénéfice pour Leclerc ?",
            "Quel problème les fichiers Excel isolés posaient-ils ?",
        ],
        "correctionModele": (
            "1) SI : données + RH + logiciels + matériel en interaction pour traiter et diffuser l'information.\n\n"
            "2) PGI :\n"
            "Progiciel intégré gérant processus clés ; flux caisse ? stock ? compta en temps réel.\n\n"
            "3) Excel isolés :\n"
            "Données non fiabilisées, pas d'actualité, pas de cohérence groupe."
        ),
        "attendu": "SI et PGI définis, intégration expliquée.",
        "notions": ["SI et PGI définis", "intégration expliquée."],
        "minChars": 180,
    },
    {
        "id": "e6",
        "title": "CRM et décision commerciale",
        "support": (
            "Salesforce CRM chez SFR enregistre chaque contact client : appels, offres proposées, "
            "contrats signés. Le tableau de bord commercial affiche taux de transformation par segment. "
            "La direction décide de réallouer les équipes sur les clients « fibre pro » à fort potentiel. "
            "Le CRM transforme des données brutes d'appels en information de pilotage."
        ),
        "consigne": (
            "Explique le rôle d'un CRM dans le SI et l'aide à la prise de décision commerciale."
        ),
        "questions": [
            "Qu'est-ce qu'un CRM ?",
            "Quelle information le tableau de bord fournit-il ?",
            "Quelle décision la direction prend-elle ?",
        ],
        "correctionModele": (
            "1) CRM : logiciel de gestion de la relation client, historique interactions.\n\n"
            "2) Information :\n"
            "Taux de transformation par segment = donnée contextualisée.\n\n"
            "3) Décision :\n"
            "Réallocation ressources vers segment rentable — aide à la décision du manuel."
        ),
        "attendu": "CRM situé dans le SI, lien décision explicite.",
        "notions": ["CRM situé dans le SI", "lien décision explicite."],
        "minChars": 180,
    },
    {
        "id": "e7",
        "title": "Qualité de l'information",
        "support": (
            "Un directeur de magasin Fnac reçoit un rapport : ventes « +120 % » sur une référence, "
            "mais la donnée source comptait les retours comme ventes (fiabilité faible), le rapport "
            "date de six mois (actualité faible) et ne concerne pas son rayon (pertinence faible). "
            "Il refuse de commander du stock supplémentaire. Le manuel exige : pertinence, fiabilité, "
            "objectivité, actualité, accèssibilité, rentabilité."
        ),
        "consigne": (
            "Évalue le rapport selon les critères de qualité de l'information. Explique le refus du directeur."
        ),
        "questions": [
            "Liste les critères de qualité de l'information.",
            "Quels critères ne sont pas respectés dans le cas ?",
            "Pourquoi une information de mauvaise qualité conduit-elle à une mauvaise décision ?",
        ],
        "correctionModele": (
            "1) Critères : pertinence, fiabilité, objectivité, actualité, accèssibilité, rentabilité.\n\n"
            "2) Non respectés :\n"
            "Fiabilité (retours comptés), actualité (6 mois), pertinence (mauvais rayon).\n\n"
            "3) Mauvaise décision :\n"
            "Décision basée sur information erronée ? surstock ou rupture, coût pour l'organisation."
        ),
        "attendu": "Critères nommés et appliqués au rapport Fnac.",
        "minChars": 200,
    },
    {
        "id": "e8",
        "title": "RGPD et registre des traitements",
        "support": (
            "La start-up « HealthTrack » (app bien-être) traite poids, sommeil et localisation. "
            "Le DPO établit un registre : finalité = coaching santé, catégories = données santé, "
            "destinataires = serveur UE, durée conservation = 3 ans. Elle informe les utilisateurs "
            "par pop-up et sécurise les bases (chiffrement). Un utilisateur demande l'effacement ; "
            "l'entreprise a 30 jours pour répondre."
        ),
        "consigne": (
            "Présente les obligations RGPD citées dans le manuel (registre, information, sécurisation, droits)."
        ),
        "questions": [
            "Quelles mentions du registre de traitement repères-tu ?",
            "Quels droits de l'individu sont illustrés ?",
            "Pourquoi les données santé sont-elles sensibles ?",
        ],
        "correctionModele": (
            "1) Registre : finalité, catégories, destinataires, durée conservation.\n\n"
            "2) Droits :\n"
            "Information (pop-up), effacement (demande utilisateur).\n\n"
            "3) Données santé :\n"
            "Sensibles, consentement explicite, sécurisation renforcée obligatoire."
        ),
        "attendu": "RGPD opérationnel sur un cas HealthTrack.",
        "notions": ["RGPD opérationnel sur un cas HealthTrack."],
        "minChars": 220,
    },
    {
        "id": "e9",
        "title": "Exploitation des données et limites",
        "support": (
            "Carrefour croise données de fidélité, météo et open data trafic pour optimiser livraisons. "
            "Un bug affiche des prix erronés sur le site pendant 2 h (qualité). Le régulateur vérifie "
            "le consentement marketing. Les équipes data alertent : « garbage in, garbage out » si "
            "les caisses saisissent mal les références."
        ),
        "consigne": (
            "Montre comment l'organisation exploite les données pour la décision et quelles limites "
            "(qualité, RGPD, fiabilité des sources) apparaissent."
        ),
        "questions": [
            "Donne deux usages de données pour la gestion courante et la décision (cours).",
            "Quels problèmes de qualité et de conformité dans le support ?",
            "Que signifie « garbage in, garbage out » pour le SI ?",
        ],
        "correctionModele": (
            "1) Usages :\n"
            "Gestion courante : livraisons, stocks. Décision : optimisation tournées via croisement données.\n\n"
            "2) Limites :\n"
            "Qualité (prix erronés), RGPD (consentement marketing), saisie caisse défaillante.\n\n"
            "3) Garbage in/out :\n"
            "Donnée entrée fausse ? information et décision fausses malgré outils performants."
        ),
        "attendu": "Usages et limites articulés, qualité de l'information reliée.",
        "notions": ["Usages et limites articulés", "qualité de l'information reliée."],
        "minChars": 240,
    },
    {
        "id": "e10",
        "title": "Synthèse SI, Big Data et réglementation",
        "support": (
            "BNP Paribas combine PGI financier, CRM client, Big Data pour détecter fraude (5V), "
            "open data réglementaire publiée à la Banque de France, et conformité RGPD stricte sur "
            "données personnelles. Un incident 2023 : fuite potentielle d'e-mails clients, réponse "
            "en 48 h, notification CNIL, renforcement chiffrement. La valeur stratégique = confiance."
        ),
        "consigne": (
            "Synthétise le chapitre 6 autour du cas BNP : SI, Big Data, open data, données personnelles, "
            "qualité, RGPD."
        ),
        "questions": [
            "Cartographie les outils et types de données du support.",
            "Comment la fraude illustre-t-elle le Big Data et les 5V ?",
            "Analyse la gestion de l'incident sous l'angle RGPD et qualité.",
            "Pourquoi la confiance est-elle la « valeur » ultime pour une banque ?",
        ],
        "correctionModele": (
            "1) Cartographie :\n"
            "PGI + CRM = SI interne. Big Data fraude. Open data réglementaire. Données perso clients.\n\n"
            "2) Fraude :\n"
            "Volume/variété transactions, vélocité temps réel, véracité modèles, valeur = limiter pertes.\n\n"
            "3) Incident :\n"
            "Notification CNIL, effacement/sécurisation, actualité et fiabilité de la communication crise.\n\n"
            "4) Confiance :\n"
            "Sans confiance, pas de dépôts ; valeur business dépend de la qualité et conformité des données."
        ),
        "attendu": "Synthèse complète chapitre 6 sur cas bancaire.",
        "minChars": 260,
    },
    {
        "id": "cas1",
        "title": "Étude de cas : Ville de Lyon et open data",
        "support": (
            "Lyon Métropole publie 240 jeux de données open data (transports, déchets, budgets). "
            "Étudiants STMG croisent fréquentation TCL et pollution pour proposer un tableau de bord "
            "« mobilité durable ». Une association signale des données budget 2022 non mises à jour "
            "(actualité). Un développeur réutilise les données sans mentionner la source (éthique). "
            "Le service open data corrige les métadonnées et formule une charte de réutilisation. "
            "Objectif : aide à la décision publique et transparence."
        ),
        "consigne": (
            "Rédige une étude type bac : donnée ? information ? connaissance, open data, qualité, "
            "limites. Propose une charte de bonnes pratiques."
        ),
        "questions": [
            "Trace la chaîne de transformation pour le projet « mobilité durable ».",
            "Évalue la qualité des données budget signalées par l'association.",
            "Quelles règles pour la charte de réutilisation (source, actualité, RGPD si données perso) ?",
            "Quels bénéfices pour la collectivité et les citoyens ?",
            "Synthèse (15 lignes) : l'open data suffit-il à décider ?",
        ],
        "correctionModele": (
            "1) Chaîne :\n"
            "Données brutes TCL/pollution ? information croisée tableau de bord ? connaissance "
            "politique mobilité durable.\n\n"
            "2) Qualité budget :\n"
            "Actualité insuffisante, fiabilité contestée ? pertinence décisionnelle réduite.\n\n"
            "3) Charte :\n"
            "Citation source, date de mise à jour, licence, pas de données personnelles sans base légale.\n\n"
            "4) Bénéfices :\n"
            "Transparence, innovation citoyenne, meilleure décision publique.\n\n"
            "5) Synthèse :\n"
            "Open data nécessaire mais pas suffisant : qualité, compétences analyse, complément "
            "données internes et expertise humaine."
        ),
        "attendu": "Open data et qualité maîtrisés, charte proposée, synthèse critique.",
        "notions": ["Open data et qualité maîtrisés", "charte proposée", "synthèse critique."],
        "minChars": 400,
        "supportTables": [
            {
                "title": "Jeux de données Lyon Métropole",
                "columns": ["Thème", "Nombre", "Exemple"],
                "rows": [
                    ["Transports", "45", "Fréquentation TCL"],
                    ["Environnement", "38", "Qualité air"],
                    ["Finances", "52", "Budget participatif"],
                ],
            }
        ],
    },
    {
        "id": "cas2",
        "title": "Étude de cas : Sephora, données et RGPD",
        "support": (
            "Sephora.fr combine CRM (profil beauté), tracking navigation, programme fidélité, "
            "partenaires publicitaires. Un client découvre des pubs ciblées après une recherche "
            "« anti-âge » sur le site. Il exerce droit d'opposition et portabilité. Le DPO vérifie "
            "registre des traitements, durée conservation (5 ans fidélité), sécurisation paiement. "
            "Une faille teste l'accès non autorisé aux adresses : correctif en 24 h, notification "
            "CNIL. CA e-commerce +18 % grâce personnalisation, mais image risque si non conformité."
        ),
        "consigne": (
            "Analyse complète : SI/CRM, données personnelles, Big Data marketing, qualité, RGPD, "
            "limites éthiques. Recommande gouvernance data."
        ),
        "questions": [
            "Identifie les traitements de données et leurs finalités.",
            "Quels droits RGPD le client exerce-t-il ?",
            "Quels risques si faille non corrigée (organisation + individus) ?",
            "Comment concilier personnalisation (+CA) et conformité ?",
            "Synthèse (18 lignes) : gouvernance data responsable pour Sephora.",
        ],
        "correctionModele": (
            "1) Traitements :\n"
            "CRM profil, fidélité, pub ciblée — finalités marketing et relation client.\n\n"
            "2) Droits :\n"
            "Opposition, portabilité, information préalable.\n\n"
            "3) Risques faille :\n"
            "Sanctions CNIL, perte confiance, atteinte vie privée.\n\n"
            "4) Conciliation :\n"
            "Consentement clair, minimisation données, anonymisation stats, DPO et registre à jour.\n\n"
            "5) Synthèse gouvernance :\n"
            "Comité data, audits, qualité information, privacy by design, transparence page "
            "« données personnelles » — performance durable si confiance préservée."
        ),
        "attendu": "Cas e-commerce complet, RGPD et limites, gouvernance recommandée.",
        "notions": ["Cas e-commerce complet", "RGPD et limites", "gouvernance recommandée."],
        "minChars": 450,
    },
]
