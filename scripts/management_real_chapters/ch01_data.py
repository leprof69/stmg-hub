# -*- coding: utf-8 -*-
"""Management chapitre 1 — acteurs reels, un concept par exercice."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH1 = [
    I(
        "e1",
        "La veille commerciale chez Picard",
        support=(
            "Picard, enseigne de surgel\u00e9s (plus de 900 magasins en France), pr\u00e9pare le lancement "
            "d'une gamme de plats v\u00e9g\u00e9tariens. Chaque semaine, l'\u00e9quipe marketing consulte "
            "les avis clients sur Google, les prix de Picard et de deux concurrents (Thiriet et Carrefour "
            "Surgel\u00e9s) et Google Trends sur \u00ab plats v\u00e9g\u00e9tariens surgel\u00e9s \u00bb. "
            "En mars 2025, elle rep\u00e8re +18 % de recherches \u00ab sans viande \u00bb. Thiriet communique "
            "sur une nouvelle gamme veggie. Picard pr\u00e9pare une offre \u00ab Green Bowl \u00bb pour septembre 2025."
        ),
        consigne=(
            "\u00c0 partir du support, explique ce qu'est la veille commerciale et montre "
            "comment Picard l'utilise avant de lancer un nouveau produit."
        ),
        questions=[
            "D\u00e9finis la veille commerciale (objectif + ce qu'elle observe).",
            "Cite deux sources utilis\u00e9es par Picard et un signal rep\u00e9r\u00e9 dans le texte.",
            "En une phrase : quel lien entre ce signal et la future gamme Green Bowl ?",
        ],
        correction=(
            "1) Veille commerciale :\n"
            "Activit\u00e9 qui consiste \u00e0 surveiller et analyser le march\u00e9 (clients, concurrents, tendances) "
            "pour orienter les d\u00e9cisions de l'entreprise.\n\n"
            "2) Picard dans le support :\n"
            f"{D}Sources : avis Google, prix concurrents, Google Trends.\n"
            f"{D}Signal : +18 % de recherches \u00ab sans viande \u00bb ; Thiriet communique sur le veggie.\n\n"
            "3) Lien avec le nouveau produit :\n"
            f"{D}La veille fait appara\u00eetre un besoin ; Picard pr\u00e9pare une offre adapt\u00e9e avant septembre 2025."
        ),
        attendu="D\u00e9finition claire, deux sources + un signal, lien avec la d\u00e9cision produit.",
        notions=["veille commerciale", "signaux faibles"],
    ),
    I(
        "e2",
        "Le big data chez Fnac Darty",
        support=(
            "Fnac Darty enregistre pour chaque client : fr\u00e9quence d'achat, panier moyen (142 \u20ac) "
            "et familles de produits (high-tech, \u00e9lectrom\u00e9nager, culture). En 2025, elle regroupe "
            "ses clients en trois segments : Famille, Express (actifs 25-40 ans), Classique (seniors). "
            "Sur le segment Express, le taux de r\u00e9achat augmente de 11 % apr\u00e8s des e-mails personnalis\u00e9s. "
            "Avant, les m\u00eames messages envoy\u00e9s \u00e0 tous les clients donnaient peu de r\u00e9sultats."
        ),
        consigne=(
            "\u00c0 partir du support, d\u00e9finis le big data en marketing et explique "
            "comment Fnac Darty s'en sert pour adapter sa communication."
        ),
        questions=[
            "Qu'est-ce que le big data (m\u00e9gadonn\u00e9es) en marketing ?",
            "Quelles donn\u00e9es Fnac Darty utilise-t-elle et quels segments cr\u00e9e-t-elle ?",
            "Quel r\u00e9sultat concret montre l'int\u00e9r\u00eat de la segmentation ?",
        ],
        correction=(
            "1) Big data :\n"
            "Volumes de donn\u00e9es clients trop importants pour \u00eatre analys\u00e9s \u00e0 la main ; "
            "ils permettent de rep\u00e9rer des comportements et d'adapter l'offre ou la communication.\n\n"
            "2) Utilisation chez Fnac Darty :\n"
            f"{D}Donn\u00e9es : fr\u00e9quence, panier moyen 142 \u20ac, familles de produits.\n"
            f"{D}Segments : Famille, Express, Classique.\n\n"
            "3) R\u00e9sultat :\n"
            f"{D}+11 % de r\u00e9achat sur Express gr\u00e2ce \u00e0 des messages cibl\u00e9s."
        ),
        attendu="Big data d\u00e9fini, donn\u00e9es et segments identifi\u00e9s, r\u00e9sultat chiffr\u00e9.",
        notions=["big data", "segmentation"],
    ),
    I(
        "e3",
        "Approche r\u00e9active ou anticipative ?",
        support=(
            "Deux distributeurs :\n"
            "\u2014 Lidl : d\u00e8s qu'un rival baisse ses prix de 10 %, Lidl aligne son tarif sous 48 h.\n"
            "\u2014 Intermarch\u00e9 : en octobre 2024, six mois avant la saison des asperges, elle signe "
            "des contrats avec des mara\u00eechers et lance l'offre \u00ab Asperges du matin \u00bb en magasin. "
            "Au printemps 2025 : forte affluence, satisfaction 4,8/5."
        ),
        consigne=(
            "D\u00e9finis l'approche marketing r\u00e9active et l'approche anticipative, "
            "puis classe Lidl et Intermarch\u00e9 en t'appuyant sur le support."
        ),
        questions=[
            "D\u00e9finis approche r\u00e9active et approche anticipative.",
            "Quel exemple illustre chaque approche ?",
            "Quel avantage principal pour Intermarch\u00e9 avec l'approche anticipative ici ?",
        ],
        correction=(
            "1) D\u00e9finitions :\n"
            "R\u00e9active : l'entreprise r\u00e9agit \u00e0 une action concurrente ou \u00e0 une demande d\u00e9j\u00e0 visible.\n"
            "Anticipative : l'entreprise pr\u00e9pare une offre avant que le besoin ne soit massif.\n\n"
            "2) Exemples :\n"
            f"{D}Lidl = r\u00e9active (aligne les prix sous 48 h).\n"
            f"{D}Intermarch\u00e9 = anticipative (contrats six mois avant, offre Asperges du matin).\n\n"
            "3) Avantage Intermarch\u00e9 :\n"
            f"{D}Diff\u00e9renciation et satisfaction \u00e9lev\u00e9e avant que les concurrents ne copient l'id\u00e9e."
        ),
        attendu="Deux d\u00e9finitions, deux exemples justes, un avantage pour Intermarch\u00e9.",
        notions=["approche r\u00e9active", "approche anticipative"],
    ),
    I(
        "e4",
        "Les trois \u00e9tapes de la d\u00e9marche marketing",
        support=(
            "Innocent (groupe Danone) pr\u00e9pare le lancement d'un jus press\u00e9 \u00e0 froid en 2025.\n"
            "\u00c9tape 1 \u2014 \u00c9tude du march\u00e9 : enqu\u00eate aupr\u00e8s de 800 consommateurs, veille "
            "sur les concurrents, Google Trends (+22 % sur \u00ab jus detox \u00bb).\n"
            "\u00c9tape 2 \u2014 Cible : actifs urbains 25-40 ans qui veulent une boisson saine le matin.\n"
            "\u00c9tape 3 \u2014 Offre : trois recettes \u00e0 2,90 \u20ac, bouteille consign\u00e9e, "
            "promotion sur Instagram et en grande surface."
        ),
        consigne=(
            "Nomme les trois \u00e9tapes de la d\u00e9marche marketing, "
            "puis indique ce qu'Innocent fait \u00e0 chaque \u00e9tape."
        ),
        questions=[
            "Quelles sont les trois \u00e9tapes de la d\u00e9marche marketing ?",
            "Que fait Innocent \u00e0 chaque \u00e9tape (reprends le support) ?",
            "Pourquoi parle-t-on de d\u00e9cision strat\u00e9gique pour ce lancement ?",
        ],
        correction=(
            "1) Trois \u00e9tapes :\n"
            "Conna\u00eetre le march\u00e9 ; identifier les besoins ; concevoir une offre adapt\u00e9e.\n\n"
            "2) Application Innocent :\n"
            f"{D}\u00c9tape 1 : enqu\u00eate, veille, Google Trends.\n"
            f"{D}\u00c9tape 2 : cible actifs 25-40 ans.\n"
            f"{D}\u00c9tape 3 : recettes, prix, consigne, r\u00e9seaux sociaux.\n\n"
            "3) Dimension strat\u00e9gique :\n"
            f"{D}Investissement lourd : la d\u00e9cision engage l'entreprise sur plusieurs mois."
        ),
        attendu="Trois \u00e9tapes nomm\u00e9es, application pr\u00e9cise, id\u00e9e de choix strat\u00e9gique.",
        notions=["d\u00e9marche marketing"],
    ),
    I(
        "e5",
        "Approche proactive et approche m\u00e9diatrice",
        support=(
            "Exemple 1 \u2014 Uber Eats : application qui met en relation restaurants et clients. "
            "Uber Eats ne cuisine pas : elle pr\u00e9l\u00e8ve une commission sur chaque commande et recommande "
            "des \u00e9tablissements selon les habitudes.\n"
            "Exemple 2 \u2014 Nespresso lance des capsules compatibles machines tierces alors qu'aucun "
            "client ne l'avait demand\u00e9 explicitement : objectif \u00e9largir le march\u00e9 du caf\u00e9 portionn\u00e9."
        ),
        consigne=(
            "D\u00e9finis l'approche m\u00e9diatrice et l'approche proactive, "
            "puis indique quel exemple correspond \u00e0 chacune."
        ),
        questions=[
            "D\u00e9finis approche m\u00e9diatrice et approche proactive.",
            "Pourquoi Uber Eats est-elle m\u00e9diatrice ?",
            "Pourquoi la strat\u00e9gie Nespresso rel\u00e8ve-t-elle d'une approche proactive ?",
        ],
        correction=(
            "1) D\u00e9finitions :\n"
            "M\u00e9diatrice : mise en relation d'acteurs sans produire le bien.\n"
            "Proactive : cr\u00e9ation d'un nouveau besoin ou march\u00e9.\n\n"
            "2) Uber Eats :\n"
            f"{D}Plateforme, commission, recommandations.\n\n"
            "3) Nespresso :\n"
            f"{D}Offre lanc\u00e9e pour cr\u00e9er ou \u00e9largir un march\u00e9."
        ),
        attendu="Deux d\u00e9finitions, Uber Eats = m\u00e9diatrice, Nespresso = proactive.",
        notions=["approche proactive", "approche m\u00e9diatrice"],
    ),
    I(
        "e6",
        "Innovation de produit : Renault Zo\u00e9",
        support=(
            "En 2025, Renault am\u00e9liore la Zo\u00e9 : autonomie augment\u00e9e, charge rapide, "
            "mat\u00e9riaux recycl\u00e9s dans l'habitacle. Le prix passe de 32 000 \u20ac \u00e0 34 500 \u20ac. "
            "Apr\u00e8s trois mois : +17 % de commandes sur la version restyl\u00e9e, "
            "taux de satisfaction 72 % (contre 65 % sur l'ancienne version)."
        ),
        consigne=(
            "Qu'est-ce qu'une innovation de produit ? "
            "Montre que la Zo\u00e9 restyl\u00e9e en est une et cite un effet chiffr\u00e9."
        ),
        questions=[
            "D\u00e9finis innovation de produit.",
            "En quoi la Zo\u00e9 restyl\u00e9e am\u00e9liore-t-elle l'offre existante ?",
            "Quel indicateur montre que les clients acceptent cette innovation ?",
        ],
        correction=(
            "1) Innovation de produit :\n"
            "Produit nouveau ou nettement am\u00e9lior\u00e9.\n\n"
            "2) Am\u00e9lioration :\n"
            f"{D}Autonomie, charge, mat\u00e9riaux \u2014 m\u00eame mod\u00e8le mais offre enrichie.\n\n"
            "3) Acceptation :\n"
            f"{D}+17 % de commandes ; satisfaction 72 % > 65 %."
        ),
        attendu="D\u00e9finition, am\u00e9lioration rep\u00e9r\u00e9e, indicateur cit\u00e9.",
        notions=["innovation produit"],
    ),
    I(
        "e7",
        "Innovation de proc\u00e9d\u00e9 : La Poste",
        support=(
            "La Poste change l'organisation de ses livraisons du dernier kilom\u00e8tre (le colis ne change pas) :\n"
            "\u2014 logiciel d'optimisation des tourn\u00e9es ;\n"
            "\u2014 v\u00e9hicules \u00e9lectriques sur une partie de la flotte ;\n"
            "\u2014 cr\u00e9neau de livraison pr\u00e9cis via l'application.\n"
            "R\u00e9sultat : livraison r\u00e9ussie du premier coup 94 % (contre 87 % avant), "
            "r\u00e9clamations \u221228 %."
        ),
        consigne=(
            "Distingue innovation de produit et innovation de proc\u00e9d\u00e9. "
            "Classe la r\u00e9organisation des livraisons de La Poste."
        ),
        questions=[
            "Qu'est-ce qu'une innovation de proc\u00e9d\u00e9 ?",
            "Quels changements La Poste apporte-t-elle (hors produit) ?",
            "Cite deux r\u00e9sultats chiffr\u00e9s du support.",
        ],
        correction=(
            "1) Innovation de proc\u00e9d\u00e9 :\n"
            "Nouvelle organisation logistique sans changer le produit.\n\n"
            "2) Changements La Poste :\n"
            f"{D}Optimisation tourn\u00e9es, v\u00e9hicules \u00e9lectriques, cr\u00e9neau via l'app.\n\n"
            "3) R\u00e9sultats :\n"
            f"{D}94 % de livraisons r\u00e9ussies ; r\u00e9clamations \u221228 %."
        ),
        attendu="Proc\u00e9d\u00e9 d\u00e9fini, trois changements, deux chiffres.",
        notions=["innovation de proc\u00e9d\u00e9"],
    ),
    I(
        "e8",
        "Plateforme ou entreprise int\u00e9gr\u00e9e ?",
        support=(
            "Vinted : site de revente entre particuliers, sans stock ni boutique physique. "
            "Elle pr\u00e9l\u00e8ve une commission sur les ventes (8,6 M\u20ac de commissions en 2024).\n"
            "Monoprix : achète, stocke et vend en magasin (marge brute 34 %). "
            "Il contr\u00f4le la qualit\u00e9 et la disponibilit\u00e9 en rayon."
        ),
        consigne=(
            "Explique le mod\u00e8le de plateforme de Vinted, "
            "puis oppose-le au mod\u00e8le int\u00e9gr\u00e9 de Monoprix."
        ),
        questions=[
            "Qu'est-ce qu'un mod\u00e8le \u00e9conomique de plateforme ?",
            "Comment Vinted gagne de l'argent selon le support ?",
            "En quoi Monoprix est-elle diff\u00e9rente ?",
        ],
        correction=(
            "1) Mod\u00e8le plateforme :\n"
            "Mise en relation ; r\u00e9mun\u00e9ration par commission.\n\n"
            "2) Vinted :\n"
            f"{D}Pas de stock ; commissions sur ventes.\n\n"
            "3) Monoprix int\u00e9gr\u00e9 :\n"
            f"{D}Ach\u00e8te, stocke, vend ; contr\u00f4le qualit\u00e9 complet."
        ),
        attendu="Plateforme d\u00e9finie, revenus Vinted, diff\u00e9rence Monoprix.",
        notions=["plateforme", "mod\u00e8le \u00e9conomique"],
    ),
    I(
        "e9",
        "Low cost, gratuit\u00e9 et freemium",
        support=(
            "Trois mod\u00e8les :\n"
            "\u2014 Action : prix bas, assortiment limit\u00e9, options payantes (low cost).\n"
            "\u2014 Spotify : \u00e9coute gratuite avec publicit\u00e9s (gratuit\u00e9).\n"
            "\u2014 Deezer : version gratuite puis abonnement Premium (freemium).\n"
            "Decathlon teste 5 s\u00e9ances gratuites de location v\u00e9lo pour les entreprises avant contrat payant."
        ),
        consigne=(
            "D\u00e9finis low cost, gratuit\u00e9 et freemium. Associe chaque entreprise \u00e0 un mod\u00e8le."
        ),
        questions=[
            "D\u00e9finis les trois mod\u00e8les en une phrase chacun.",
            "Quelle entreprise illustre chaque mod\u00e8le ?",
            "Le test B2B de Decathlon : freemium ou gratuit\u00e9 ? Pourquoi ?",
        ],
        correction=(
            "1) D\u00e9finitions :\n"
            "Low cost, gratuit\u00e9, freemium \u2014 voir cours.\n\n"
            "2) Exemples :\n"
            f"{D}Action = low cost ; Spotify = gratuit\u00e9 ; Deezer = freemium.\n\n"
            "3) Decathlon B2B :\n"
            f"{D}Freemium : essai gratuit puis contrat payant."
        ),
        attendu="Trois d\u00e9finitions, trois associations, choix freemium justifi\u00e9.",
        notions=["low cost", "gratuit\u00e9", "freemium"],
    ),
    I(
        "e10",
        "Performance sociale chez Decathlon",
        support=(
            "Decathlon publie en 2024 :\n"
            "\u2014 taux de d\u00e9part volontaire : 11 % (moyenne du secteur : 18 %) ;\n"
            "\u2014 absent\u00e9isme : 4,2 % ;\n"
            "\u2014 78 % des salari\u00e9s estiment que l'entreprise respecte ses valeurs.\n"
            "Actions : formation interne, comit\u00e9 social et environnemental, charte fournisseurs."
        ),
        consigne=(
            "D\u00e9finis la performance sociale. Interpr\u00e8te les trois indicateurs de Decathlon "
            "et explique le lien avec son image de marque."
        ),
        questions=[
            "Qu'est-ce que la performance sociale ?",
            "Que montrent les chiffres 11 %, 4,2 % et 78 % ?",
            "Pourquoi une bonne performance sociale aide le marketing de Decathlon ?",
        ],
        correction=(
            "1) Performance sociale :\n"
            "R\u00e9sultats pour le bien-\u00eatre des salari\u00e9s.\n\n"
            "2) Interpr\u00e9tation :\n"
            f"{D}Fid\u00e9lisation, conditions correctes, adh\u00e9sion aux valeurs.\n\n"
            "3) Lien marketing :\n"
            f"{D}Renforce la cr\u00e9dibilit\u00e9 de la marque."
        ),
        attendu="D\u00e9finition, trois indicateurs interpr\u00e9t\u00e9s, lien image de marque.",
        notions=["performance sociale", "RSE"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : Carrefour face \u00e0 la concurrence",
        support=(
            "Juin 2025 : Amazon Fresh d\u00e9veloppe la livraison \u00e0 Lyon. Leclerc propose -15 % "
            "sur les fruits et l\u00e9gumes bio. Lidl baisse les prix sur 200 r\u00e9f\u00e9rences.\n"
            "Carrefour ne peut pas mener une guerre des prix (positionnement qualit\u00e9 / services).\n"
            "Sa veille : 62 % des clients choisissent Carrefour pour la qualit\u00e9, "
            "41 % pour le drive, seulement 23 % pour le prix.\n"
            "T2 2025 : croissance +3 % (contre +9 % au T1), NPS 59. Options : (A) baisser les prix ; "
            "(B) renforcer l'app et la personnalisation ; (C) offres B2B entreprises ; (D) partenariats AMAP."
        ),
        consigne=(
            "Tu conseilles Carrefour. Structure : (1) menace concurrentielle, "
            "(2) attentes clients, (3) chiffres, (4) option recommand\u00e9e (A-D)."
        ),
        questions=[
            "Quel mod\u00e8le marketing illustre chaque concurrent (Amazon Fresh, Leclerc, Lidl) ?",
            "Que priorisent les clients de Carrefour ?",
            "Que signifient la baisse de croissance et le NPS ?",
            "Quelle option recommandes-tu ? Pourquoi ?",
        ],
        correction=(
            "1) Concurrents typ\u00e9s selon le support.\n\n"
            "2) Attentes : qualit\u00e9 et services > prix.\n\n"
            "3) Pression concurrentielle sur la croissance.\n\n"
            "4) Recommandation B ou C plut\u00f4t que guerre des prix (A)."
        ),
        attendu="Concurrence typ\u00e9e, attentes clients, indicateurs lus, choix argument\u00e9.",
        notions=["veille commerciale", "mod\u00e8les \u00e9conomiques", "innovation"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : plan marketing Danone 2026",
        support=(
            "Danone pr\u00e9pare 2026 avec trois axes :\n"
            "Axe 1 \u2014 Veille et segmentation clients (big data).\n"
            "Axe 2 \u2014 Innovation produit (emballages plus durables) et proc\u00e9d\u00e9 (logistique bas carbone).\n"
            "Axe 3 \u2014 Freemium B2B pour les entreprises ; pas de publicit\u00e9 intrusive sur le site.\n"
            "Objectifs : CA en croissance, NPS 65, d\u00e9parts volontaires < 10 %.\n"
            "Budget marketing : 285 000 \u20ac. Question : le surco\u00fbt vs hard discount est-il acceptable ?"
        ),
        consigne=(
            "Pr\u00e9sente chaque axe en reliant une notion du chapitre, puis r\u00e9ponds : "
            "le plan est-il coh\u00e9rent avec une strat\u00e9gie premium ?"
        ),
        questions=[
            "Axe 1 : quelles notions (veille, big data, d\u00e9marche marketing) ?",
            "Axe 2 : innovation produit ou proc\u00e9d\u00e9 ?",
            "Axe 3 : quel mod\u00e8le retenu et refus\u00e9 ?",
            "Le surco\u00fbt est-il justifiable ? Argumente.",
        ],
        correction=(
            "1) Axe 1 : veille + donn\u00e9es clients.\n\n"
            "2) Axe 2 : innovation produit et proc\u00e9d\u00e9.\n\n"
            "3) Axe 3 : freemium B2B ; pas de gratuit\u00e9 publicitaire.\n\n"
            "4) Surco\u00fbt justifiable si valeur per\u00e7ue (qualit\u00e9, durable) prioritaire."
        ),
        attendu="Trois axes reli\u00e9s au cours, coh\u00e9rence premium argument\u00e9e.",
        notions=["d\u00e9marche marketing", "innovation", "freemium"],
    ),
]
