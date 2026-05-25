# -*- coding: utf-8 -*-
"""Management chapitre 12 — acteurs reels, un concept par exercice."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH12 = [
    I(
        "e1",
        "Communication strat\u00e9gique chez Kiabi",
        support=(
            "Kiabi (pr\u00eat-\u00e0-porter familial, 550 magasins en Europe) pr\u00e9pare 2025-2027. "
            "Objectifs : notori\u00e9t\u00e9 \u00ab mode accessible et responsable \u00bb (+8 points), "
            "engagement interne 72 % (contre 61 % en 2024), trafic magasin +5 %.\n"
            "Plan valid\u00e9 en septembre 2024 : m\u00eame fil rouge interne (intranet, managers) "
            "et externe (pub, RP, r\u00e9seaux). Budget global 18 M\u20ac r\u00e9parti : 40 % digital, "
            "35 % magasin, 25 % interne."
        ),
        consigne=(
            "\u00c0 partir du support, d\u00e9finis la communication strat\u00e9gique "
            "et montre comment Kiabi l'organise."
        ),
        questions=[
            "Qu'est-ce que la communication strat\u00e9gique ?",
            "Quels objectifs chiffr\u00e9s Kiabi fixe-t-elle pour 2025-2027 ?",
            "Pourquoi aligner communication interne et externe sur un m\u00eame fil rouge ?",
        ],
        correction=(
            "1) Communication strat\u00e9gique :\n"
            "Ensemble des messages planifi\u00e9s pour atteindre les objectifs de l'entreprise "
            "aupr\u00e8s des publics internes et externes, de fa\u00e7on coh\u00e9rente dans le temps.\n\n"
            "2) Objectifs Kiabi :\n"
            f"{D}Notori\u00e9t\u00e9 responsable +8 points.\n"
            f"{D}Engagement interne 72 % (61 % en 2024).\n"
            f"{D}Trafic magasin +5 %.\n\n"
            "3) Alignement interne/externe :\n"
            f"{D}Les salari\u00e9s portent le m\u00eame discours que la pub ; "
            "la cr\u00e9dibilit\u00e9 externe d\u00e9pend de la coh\u00e9sion interne."
        ),
        attendu="D\u00e9finition, trois objectifs chiffr\u00e9s, justification de l'alignement.",
        notions=["communication strat\u00e9gique", "coh\u00e9rence"],
    ),
    I(
        "e2",
        "Communication interne chez Decathlon",
        support=(
            "Decathlon (105 000 salari\u00e9s, 1 750 magasins) fusionne en 2024 les \u00e9quipes "
            "de Lille et de Lyon. Julien, directeur communication interne, d\u00e9ploie :\n"
            "\u2014 descendante : vid\u00e9os mensuelles du PDG sur l'intranet (taux de lecture 68 %) ;\n"
            "\u2014 ascendante : bo\u00eete \u00e0 id\u00e9es \u00ab Terrain \u00bb (420 remont\u00e9es en six mois) ;\n"
            "\u2014 transversale : communaut\u00e9 Teams \u00ab Sport Makers \u00bb entre magasins et si\u00e8ge.\n"
            "R\u00e9sultat : 74 % des salari\u00e9s estiment \u00ab bien inform\u00e9s \u00bb (contre 58 % avant fusion)."
        ),
        consigne=(
            "D\u00e9finis communication descendante, ascendante et transversale. "
            "Illustre chaque type avec Decathlon."
        ),
        questions=[
            "D\u00e9finis les trois types de communication interne.",
            "Quel outil ou action Decathlon utilise-t-elle pour chaque type ?",
            "Quel indicateur montre l'am\u00e9lioration de la communication interne ?",
        ],
        correction=(
            "1) Types :\n"
            "Descendante : direction \u2192 salari\u00e9s.\n"
            "Ascendante : salari\u00e9s \u2192 direction.\n"
            "Transversale : entre services ou sites au m\u00eame niveau.\n\n"
            "2) Decathlon :\n"
            f"{D}Descendante : vid\u00e9os PDG intranet.\n"
            f"{D}Ascendante : bo\u00eete \u00ab Terrain \u00bb.\n"
            f"{D}Transversale : Teams \u00ab Sport Makers \u00bb.\n\n"
            "3) Indicateur :\n"
            f"{D}74 % se sentent bien inform\u00e9s (58 % avant)."
        ),
        attendu="Trois d\u00e9finitions, trois exemples, indicateur cit\u00e9.",
        notions=["communication interne", "descendante", "ascendante", "transversale"],
    ),
    I(
        "e3",
        "Communication externe chez H&M",
        support=(
            "H&M lance en mars 2025 deux volets simultan\u00e9s :\n"
            "Commercial : collection \u00ab Conscious Choice \u00bb (pub TV, Instagram, influenceurs mode).\n"
            "Institutionnel : rapport durabilit\u00e9 2024, conf\u00e9rence presse Stockholm, partenariat "
            "avec l'ONU sur l'eau.\n"
            "Budget : 12 M\u20ac commercial, 1,8 M\u20ac institutionnel. "
            "Notori\u00e9t\u00e9 spontan\u00e9e : 34 % (commercial) ; cr\u00e9dibilit\u00e9 RSE : 41 % "
            "(sondage post-RP, +6 points vs 2023)."
        ),
        consigne=(
            "Distingue communication commerciale et communication institutionnelle. "
            "Applique \u00e0 H&M."
        ),
        questions=[
            "D\u00e9finis communication commerciale et institutionnelle.",
            "Quel exemple H&M pour chaque type dans le support ?",
            "Pourquoi mener les deux en parall\u00e8le ?",
        ],
        correction=(
            "1) D\u00e9finitions :\n"
            "Commerciale : promouvoir produits et ventes.\n"
            "Institutionnelle : valoriser l'image, les valeurs, la responsabilit\u00e9 de l'entreprise.\n\n"
            "2) H&M :\n"
            f"{D}Commerciale : collection Conscious Choice, pub, influenceurs.\n"
            f"{D}Institutionnelle : rapport durabilit\u00e9, conf\u00e9rence presse, partenariat ONU.\n\n"
            "3) Parall\u00e8le :\n"
            f"{D}La pub vend ; l'institutionnel renforce la confiance et limite les accusations de greenwashing."
        ),
        attendu="Deux d\u00e9finitions, deux exemples, int\u00e9r\u00eat du double volet.",
        notions=["communication externe", "commerciale", "institutionnelle"],
    ),
    I(
        "e4",
        "Image de marque chez Zara",
        support=(
            "Inditex d\u00e9ploie en 2024-2025 un rebranding Zara : nouveau logo minimaliste, "
            "fa\u00e7ades magasins \u00e9pur\u00e9es, campagne \u00ab Less is More \u00bb.\n"
            "Avant : image \u00ab fast fashion abordable \u00bb (sondage 2023 : 62 % des 18-30 ans).\n"
            "Apr\u00e8s six mois : perception \u00ab mode premium accessible \u00bb 48 % (+11 points), "
            "mais critiques sur TikTok (\u00ab greenwashing visuel \u00bb, 890 000 vues).\n"
            "Identit\u00e9 visuelle = logo, couleurs, typographie. Image de marque = ce que le public ressent."
        ),
        consigne=(
            "Distingue identit\u00e9 visuelle et image de marque. Analyse le rebranding Zara."
        ),
        questions=[
            "Quelle diff\u00e9rence entre identit\u00e9 visuelle et image de marque ?",
            "Quels \u00e9l\u00e9ments du rebranding Zara rel\u00e8vent de l'identit\u00e9 visuelle ?",
            "L'image de marque a-t-elle suivi ? Cite un chiffre et une limite.",
        ],
        correction=(
            "1) Diff\u00e9rence :\n"
            "Identit\u00e9 visuelle : signes contr\u00f4l\u00e9s par l'entreprise (logo, couleurs).\n"
            "Image de marque : repr\u00e9sentation mentale du public.\n\n"
            "2) Identit\u00e9 Zara :\n"
            f"{D}Nouveau logo, fa\u00e7ades, campagne Less is More.\n\n"
            "3) Image :\n"
            f"{D}Progression +11 points vers \u00ab premium accessible \u00bb.\n"
            f"{D}Limite : bad buzz TikTok greenwashing visuel."
        ),
        attendu="Distinction claire, \u00e9l\u00e9ments identit\u00e9, \u00e9volution image + limite.",
        notions=["image de marque", "identit\u00e9 visuelle", "rebranding"],
    ),
    I(
        "e5",
        "E-r\u00e9putation chez Uniqlo",
        support=(
            "Uniqlo surveille depuis janvier 2025 Instagram, TikTok, Google Avis et Reddit.\n"
            "Signaux rep\u00e9r\u00e9s : +22 % de mentions \u00ab Heattech \u00bb ; avis Google magasin "
            "Paris Op\u00e9ra : 4,1/5 (500 avis) ; thread Reddit critiquant les conditions usines Asie "
            "(12 000 upvotes en 72 h).\n"
            "Cellule e-r\u00e9putation : r\u00e9ponse sous 4 h sur r\u00e9seaux, mod\u00e9ration avis, "
            "note interne NPS digital 52 (objectif 60)."
        ),
        consigne=(
            "D\u00e9finis l'e-r\u00e9putation et explique comment Uniqlo la g\u00e8re."
        ),
        questions=[
            "Qu'est-ce que l'e-r\u00e9putation ?",
            "Cite deux sources surveill\u00e9es et un signal positif, un signal n\u00e9gatif.",
            "Quelles actions Uniqlo met-elle en place pour la g\u00e9rer ?",
        ],
        correction=(
            "1) E-r\u00e9putation :\n"
            "Image et avis diffus\u00e9s sur Internet par clients, internautes et m\u00e9dias.\n\n"
            "2) Signaux :\n"
            f"{D}Sources : Instagram, TikTok, Google Avis, Reddit.\n"
            f"{D}Positif : +22 % mentions Heattech ; 4,1/5 Google.\n"
            f"{D}N\u00e9gatif : thread Reddit usines Asie.\n\n"
            "3) Actions :\n"
            f"{D}R\u00e9ponse sous 4 h, mod\u00e9ration avis, suivi NPS digital."
        ),
        attendu="D\u00e9finition, sources + signaux, actions de gestion.",
        notions=["e-r\u00e9putation", "communication digitale", "veille"],
    ),
    I(
        "e6",
        "Crise communicationnelle chez Celio",
        support=(
            "12 f\u00e9vrier 2025, 21 h : reportage France 2 sur sous-traitance Celio au Bangladesh "
            "(salaires et s\u00e9curit\u00e9). Hashtag #BoycottCelio : 1,8 M impressions en 24 h.\n"
            "Chronologie Celio :\n"
            "\u2014 H+6 : communiqu\u00e9 juridique (mal per\u00e7u).\n"
            "\u2014 H+18 : PDG en visio presse, excuses et audit ind\u00e9pendant annonc\u00e9.\n"
            "\u2014 J+3 : page transparence fournisseurs en ligne.\n"
            "Trafic e-commerce : \u221231 % la semaine 1, \u221212 % semaine 4."
        ),
        consigne=(
            "D\u00e9finis une crise communicationnelle et analyse la gestion Celio."
        ),
        questions=[
            "Qu'est-ce qu'une crise communicationnelle ?",
            "Quels \u00e9l\u00e9ments d\u00e9clencheurs et d'amplification cites-tu ?",
            "Quelle erreur initiale et quelle bonne pratique ensuite ?",
        ],
        correction=(
            "1) Crise communicationnelle :\n"
            "Situation o\u00f9 l'image de l'entreprise est menac\u00e9e par un \u00e9v\u00e9nement "
            "mal per\u00e7u, amplifi\u00e9 par les m\u00e9dias et les r\u00e9seaux.\n\n"
            "2) D\u00e9clencheurs :\n"
            f"{D}Reportage TV Bangladesh ; hashtag #BoycottCelio 1,8 M impressions.\n\n"
            "3) Gestion :\n"
            f"{D}Erreur : communiqu\u00e9 juridique froid \u00e0 H+6.\n"
            f"{D}Bonne pratique : excuses PDG H+18, audit, transparence J+3."
        ),
        attendu="D\u00e9finition, d\u00e9clencheurs chiffr\u00e9s, erreur + bonne pratique.",
        notions=["crise communicationnelle", "communication de crise"],
    ),
    I(
        "e7",
        "Communication RSE chez Etam",
        support=(
            "Etam publie en avril 2025 son rapport RSE \u00ab Lingerie Responsable \u00bb :\n"
            "\u2014 78 % coton bio sur la gamme principale (objectif 2026 : 90 %) ;\n"
            "\u2014 audit social de 22 ateliers partenaires ;\n"
            "\u2014 campagne #PreuvesEtam : QR code sur \u00e9tiquette \u2192 fiche tra\u00e7abilit\u00e9.\n"
            "Communication : dossier presse, LinkedIn, affiches magasin. "
            "Cr\u00e9dibilit\u00e9 RSE (sondage) : 54 % (contre 38 % avant campagne)."
        ),
        consigne=(
            "Explique la communication RSE et montre comment Etam \u00e9vite le greenwashing."
        ),
        questions=[
            "Qu'est-ce que la communication RSE ?",
            "Quels contenus concrets Etam communique-t-elle ?",
            "Comment la transparence renforce-t-elle la cr\u00e9dibilit\u00e9 ? Cite un chiffre.",
        ],
        correction=(
            "1) Communication RSE :\n"
            "Diffusion des engagements et r\u00e9sultats sociaux, soci\u00e9taux et environnementaux "
            "de l'entreprise aupr\u00e8s de ses publics.\n\n"
            "2) Contenus Etam :\n"
            f"{D}Rapport chiffr\u00e9, audits, QR code tra\u00e7abilit\u00e9, campagne #PreuvesEtam.\n\n"
            "3) Cr\u00e9dibilit\u00e9 :\n"
            f"{D}Preuves v\u00e9rifiables \u2192 cr\u00e9dibilit\u00e9 54 % (+16 points)."
        ),
        attendu="D\u00e9finition RSE, contenus concrets, lien transparence/cr\u00e9dibilit\u00e9.",
        notions=["communication RSE", "transparence", "greenwashing"],
    ),
    I(
        "e8",
        "Communication int\u00e9gr\u00e9e chez Lacoste",
        support=(
            "Lacoste d\u00e9ploie en mai 2025 la campagne 360\u00b0 \u00ab Save Our Species \u00bb (crocodile menac\u00e9s) :\n"
            "\u2014 pub print et digital ;\n"
            "\u2014 RP avec WWF ;\n"
            "\u2014 contenus employ\u00e9s ambassadeurs sur LinkedIn ;\n"
            "\u2014 corners magasin et site e-commerce ;\n"
            "\u2014 m\u00eame baseline et visuels sur tous les supports.\n"
            "EMV (earned media value) : 4,2 M\u20ac. Coh\u00e9rence per\u00e7ue par les clients : 81 %."
        ),
        consigne=(
            "D\u00e9finis la communication int\u00e9gr\u00e9e et montre comment Lacoste l'applique."
        ),
        questions=[
            "Qu'est-ce que la communication int\u00e9gr\u00e9e (360\u00b0) ?",
            "Liste au moins quatre canaux utilis\u00e9s par Lacoste avec le m\u00eame message.",
            "Quel indicateur montre l'efficacit\u00e9 de cette coh\u00e9rence ?",
        ],
        correction=(
            "1) Communication int\u00e9gr\u00e9e :\n"
            "M\u00eame message et m\u00eame identit\u00e9 d\u00e9ploy\u00e9s sur tous les canaux "
            "vers tous les publics, sans contradiction.\n\n"
            "2) Lacoste :\n"
            f"{D}Pub, RP/WWF, ambassadeurs internes, magasin, e-commerce, m\u00eame baseline.\n\n"
            "3) Efficacit\u00e9 :\n"
            f"{D}EMV 4,2 M\u20ac ; coh\u00e9rence per\u00e7ue 81 %."
        ),
        attendu="D\u00e9finition 360\u00b0, canaux list\u00e9s, indicateur cit\u00e9.",
        notions=["communication int\u00e9gr\u00e9e", "360\u00b0", "coh\u00e9rence"],
    ),
    I(
        "e9",
        "Mesure de l'efficacit\u00e9 chez Nike",
        support=(
            "Nike \u00e9value sa campagne \u00ab You Can't Stop Us \u00bb (2024-2025) :\n"
            "\u2014 notori\u00e9t\u00e9 assist\u00e9e : 78 % (+5 points) ;\n"
            "\u2014 engagement Instagram : 12 M interactions ;\n"
            "\u2014 trafic nike.com : +18 % pendant la campagne ;\n"
            "\u2014 ventes e-commerce Europe : +9 % ;\n"
            "\u2014 budget m\u00e9dia : 45 M\u20ac \u2192 ROI estim\u00e9 3,2 (CA incremental / budget).\n"
            "Tableau de bord revu chaque trimestre au comit\u00e9 marketing."
        ),
        consigne=(
            "Cite des indicateurs pour mesurer l'efficacit\u00e9 d'une communication. "
            "Interpr\u00e8te ceux de Nike."
        ),
        questions=[
            "Quels types d'indicateurs mesurent l'efficacit\u00e9 communication ?",
            "Classe les indicateurs Nike : notori\u00e9t\u00e9, engagement, ventes, ROI.",
            "Que signifie un ROI communication de 3,2 ?",
        ],
        correction=(
            "1) Types d'indicateurs :\n"
            "Notori\u00e9t\u00e9, engagement, trafic, ventes, retour sur investissement (ROI).\n\n"
            "2) Nike :\n"
            f"{D}Notori\u00e9t\u00e9 78 % ; engagement 12 M ; trafic +18 % ; ventes +9 % ; ROI 3,2.\n\n"
            "3) ROI 3,2 :\n"
            f"{D}Chaque euro investi g\u00e9n\u00e8re 3,20 \u20ac de CA incremental estim\u00e9."
        ),
        attendu="Types d'indicateurs, application Nike, interpr\u00e9tation ROI.",
        notions=["ROI communication", "KPI", "notori\u00e9t\u00e9"],
    ),
    I(
        "e10",
        "Synth\u00e8se communication chez Petit Bateau",
        support=(
            "Petit Bateau pr\u00e9pare 2026 avec budget communication 6,5 M\u20ac :\n"
            "Axe 1 \u2014 Strat\u00e9gie : renforcer \u00ab h\u00e9ritage fran\u00e7ais et qualit\u00e9 durable \u00bb.\n"
            "Axe 2 \u2014 Interne : formation managers au discours marque (800 vendeurs).\n"
            "Axe 3 \u2014 Externe : pub famille, RP patrimoine, Instagram #PetitBateauDepuis1893.\n"
            "Axe 4 \u2014 Mesure : NPS client 62, notori\u00e9t\u00e9 71 %, taux lecture intranet 65 %.\n"
            "Objectif : +4 % CA France sans baisser la marge."
        ),
        consigne=(
            "Pr\u00e9sente une synth\u00e8se du plan de communication Petit Bateau "
            "en reliant strat\u00e9gie, interne, externe et mesure."
        ),
        questions=[
            "Quel fil rouge strat\u00e9gique pour Petit Bateau ?",
            "Comment interne et externe sont-ils articul\u00e9s ?",
            "Quels KPI permettent de piloter le plan ?",
        ],
        correction=(
            "1) Fil rouge :\n"
            f"{D}H\u00e9ritage fran\u00e7ais et qualit\u00e9 durable.\n\n"
            "2) Articulation :\n"
            f"{D}Formation vendeurs (interne) + pub/RP/r\u00e9seaux (externe) portent le m\u00eame message.\n\n"
            "3) KPI :\n"
            f"{D}NPS 62, notori\u00e9t\u00e9 71 %, lecture intranet 65 %, objectif CA +4 %."
        ),
        attendu="Fil rouge, articulation interne/externe, KPI identifi\u00e9s.",
        notions=["plan de communication", "synth\u00e8se", "KPI"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : boycott chez Monoprix",
        support=(
            "Mars 2025 : une ONG accuse Monoprix de travail dissimul\u00e9 via sous-traitants logistique "
            "(entrep\u00f4ts \u00cele-de-France). Gr\u00e8ve appel\u00e9e sur Twitter ; 340 000 signatures p\u00e9tition.\n"
            "Donn\u00e9es Monoprix : CA magasins Paris \u22128 % semaine 1 ; 62 % clients urbains 25-40 ans "
            "sensibles \u00e0 l'\u00e9thique ; NPS passe de 58 \u00e0 44.\n"
            "Options : (A) silence juridique ; (B) n\u00e9gociation syndicats + communiqu\u00e9 transparent ; "
            "(C) pub \u00ab Monoprix engag\u00e9 \u00bb sans preuves ; (D) audit ind\u00e9pendant + plan correctif public."
        ),
        consigne=(
            "Analyse la crise et recommande une strat\u00e9gie communicationnelle (A-D)."
        ),
        questions=[
            "Quels publics sont touch\u00e9s (clients, salari\u00e9s, m\u00e9dias) ?",
            "Quels chiffres montrent la gravit\u00e9 ?",
            "Pourquoi l'option C est-elle risqu\u00e9e ?",
            "Quelle option recommandes-tu ? Justifie.",
        ],
        correction=(
            "1) Publics :\n"
            f"{D}Clients urbains \u00e9thiques, salari\u00e9s/syndicats, m\u00e9dias et ONG.\n\n"
            "2) Gravit\u00e9 :\n"
            f"{D}CA \u22128 %, NPS 58\u219244, 340 000 signatures.\n\n"
            "3) Risque option C :\n"
            f"{D}Pub sans preuves = greenwashing / social washing, aggrave la crise.\n\n"
            "4) Recommandation D (ou B+D) :\n"
            f"{D}Transparence, audit ind\u00e9pendant, plan correctif cr\u00e9dible."
        ),
        attendu="Publics identifi\u00e9s, chiffres lus, rejet option C, choix argument\u00e9.",
        notions=["boycott", "crise communicationnelle", "transparence"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : rebranding durable aux Galeries Lafayette",
        support=(
            "Galeries Lafayette Haussmann lance \u00ab Green Glam \u00bb (2025) : fa\u00e7ade verte temporaire, "
            "corner mode \u00e9co-design, slogan \u00ab Le luxe de demain est responsable \u00bb.\n"
            "Critiques : aucun seuil chiffr\u00e9 de produits durables ; fournisseurs non audit\u00e9s ; "
            "association accus\u00e9e de social washing par des influenceurs (2,1 M vues TikTok).\n"
            "Budget rebranding : 2,8 M\u20ac. Options : (A) poursuivre la campagne ; "
            "(B) pause + rapport transparence ; (C) renommer sans changer le fond ; "
            "(D) rebranding avec objectifs chiffr\u00e9s, audits et comit\u00e9 ind\u00e9pendant."
        ),
        consigne=(
            "Diagnostique le risque de greenwashing et propose une strat\u00e9gie de rebranding cr\u00e9dible."
        ),
        questions=[
            "Quels signes de greenwashing dans le support ?",
            "Quelle diff\u00e9rence entre rebranding visuel et engagement r\u00e9el ?",
            "Quels \u00e9l\u00e9ments rendent un rebranding durable cr\u00e9dible ?",
            "Quelle option recommandes-tu ? Justifie.",
        ],
        correction=(
            "1) Signes greenwashing :\n"
            f"{D}Slogan vert sans chiffres ; fa\u00e7ade \u00ab green \u00bb cosm\u00e9tique ; fournisseurs non audit\u00e9s.\n\n"
            "2) Rebranding visuel vs r\u00e9el :\n"
            f"{D}Visuel = couleurs, slogan ; r\u00e9el = pratiques achats, audits, objectifs mesurables.\n\n"
            "3) Cr\u00e9dibilit\u00e9 :\n"
            f"{D}Objectifs chiffr\u00e9s, audits ind\u00e9pendants, transparence publique.\n\n"
            "4) Recommandation D :\n"
            f"{D}Rebranding accompagn\u00e9 de preuves, pas de communication cosm\u00e9tique seule."
        ),
        attendu="Greenwashing rep\u00e9r\u00e9, distinction visuel/r\u00e9el, option D argument\u00e9e.",
        notions=["rebranding", "greenwashing", "communication RSE"],
    ),
]
