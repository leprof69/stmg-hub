# -*- coding: utf-8 -*-
"""Management chapitre 14 — acteurs reels, un concept par exercice."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH14 = [
    I(
        "e1",
        "Nouveaux rapports au travail chez Capgemini",
        support=(
            "Capgemini France (55 000 consultants) d\u00e9ploie le mod\u00e8le \u00ab Next \u00bb depuis 2023 : "
            "le manager devient coach, fixe des objectifs trimestriels au lieu de contr\u00f4ler la pr\u00e9sence.\n"
            "Enqu\u00eate 2025 (4 200 r\u00e9ponses) : 68 % des consultants estiment avoir plus d'autonomie ; "
            "72 % jugent leur manager \u00ab facilitateur \u00bb (contre 51 % en 2022).\n"
            "Outils : entretiens mensuels 1-to-1, plateforme Skills pour monter en comp\u00e9tence cloud."
        ),
        consigne=(
            "Explique les nouveaux rapports au travail et montre comment Capgemini transforme le r\u00f4le du manager."
        ),
        questions=[
            "Quels changements caract\u00e9risent les nouveaux rapports au travail ?",
            "Comment Capgemini red\u00e9finit-elle le r\u00f4le du manager ?",
            "Cite deux indicateurs montrant l'\u00e9volution per\u00e7ue.",
        ],
        correction=(
            "1) Nouveaux rapports au travail :\n"
            "Moins de contr\u00f4le de pr\u00e9sence, plus d'autonomie, management par objectifs et comp\u00e9tences, "
            "manager coach/facilitateur.\n\n"
            "2) Capgemini :\n"
            f"{D}Mod\u00e8le Next : objectifs trimestriels, 1-to-1, plateforme Skills, manager coach.\n\n"
            "3) Indicateurs :\n"
            f"{D}68 % plus d'autonomie ; 72 % managers facilitateurs (51 % en 2022)."
        ),
        attendu="Changements d\u00e9crits, mod\u00e8le Capgemini, deux chiffres.",
        notions=["nouveaux rapports au travail", "autonomie", "manager-coach"],
    ),
    I(
        "e2",
        "T\u00e9l\u00e9travail chez Accenture",
        support=(
            "Accenture France signe en septembre 2023 un accord de t\u00e9l\u00e9travail : "
            "jusqu'\u00e0 3 jours/semaine \u00e0 distance, 2 jours minimum au bureau ou chez le client.\n"
            "Budget \u00e9quipement : 650 \u20ac/salari\u00e9 ( \u00e9cran, chaise, casque). "
            "Forfait coworking : 150 \u20ac/ mois si logement trop petit.\n"
            "R\u00e9sultats 2024 : satisfaction TT 76 % ; productivit\u00e9 per\u00e7ue +8 % ; "
            "turnover \u22123 points vs 2022."
        ),
        consigne=(
            "D\u00e9finis le t\u00e9l\u00e9travail et pr\u00e9sente l'accord Accenture."
        ),
        questions=[
            "Qu'est-ce que le t\u00e9l\u00e9travail (cadre l\u00e9gal et pratique) ?",
            "Quelles r\u00e8gles et avantages mat\u00e9riels Accenture pr\u00e9voit-elle ?",
            "Quels effets chiffr\u00e9s en 2024 ?",
        ],
        correction=(
            "1) T\u00e9l\u00e9travail :\n"
            "Organisation du travail r\u00e9alis\u00e9 hors locaux de l'employeur, "
            "encadr\u00e9e par un accord d'entreprise (jours, \u00e9quipement, r\u00e9versibilit\u00e9).\n\n"
            "2) Accord Accenture :\n"
            f"{D}3 jours TT max, 2 jours pr\u00e9sentiel/client, 650 \u20ac mat\u00e9riel, 150 \u20ac coworking.\n\n"
            "3) Effets 2024 :\n"
            f"{D}Satisfaction 76 %, productivit\u00e9 +8 %, turnover \u22123 points."
        ),
        attendu="D\u00e9finition TT, r\u00e8gles Accenture, trois effets chiffr\u00e9s.",
        notions=["t\u00e9l\u00e9travail", "accord d'entreprise", "QVT"],
    ),
    I(
        "e3",
        "Droit \u00e0 la d\u00e9connexion chez Atos",
        support=(
            "Atos int\u00e8gre en janvier 2024 une charte \u00ab Digital Balance \u00bb : "
            "aucune obligation de r\u00e9pondre aux mails Teams entre 20 h et 8 h "
            "(sauf astreinte d\u00e9clar\u00e9e et r\u00e9mun\u00e9r\u00e9e).\n"
            "Outils : param\u00e8tre Outlook \u00ab envoi diff\u00e9r\u00e9 \u00bb activ\u00e9 par d\u00e9faut ; "
            "badge \u00ab hors disponibilit\u00e9 \u00bb sur Teams apr\u00e8s 19 h 30.\n"
            "Enqu\u00eate 2025 : 61 % des salari\u00e9s estiment mieux s\u00e9parer vie pro/perso "
            "(contre 38 % avant charte) ; signalements surcharge : \u221222 %."
        ),
        consigne=(
            "D\u00e9finis le droit \u00e0 la d\u00e9connexion et analyse la charte Atos."
        ),
        questions=[
            "Qu'est-ce que le droit \u00e0 la d\u00e9connexion ?",
            "Quelles mesures concr\u00e8tes Atos d\u00e9ploie-t-elle ?",
            "Quels r\u00e9sultats mesurables en 2025 ?",
        ],
        correction=(
            "1) Droit \u00e0 la d\u00e9connexion :\n"
            "Possibilit\u00e9 pour le salari\u00e9 de ne pas \u00eatre joignable hors temps de travail, "
            "notamment sur outils num\u00e9riques (loi 2016, accords d'entreprise).\n\n"
            "2) Mesures Atos :\n"
            f"{D}Plage 20 h-8 h, envoi diff\u00e9r\u00e9 Outlook, badge Teams, astreintes encadr\u00e9es.\n\n"
            "3) R\u00e9sultats :\n"
            f"{D}61 % mieux s\u00e9parent pro/perso (38 % avant) ; signalements surcharge \u221222 %."
        ),
        attendu="D\u00e9finition, mesures Atos, r\u00e9sultats chiffr\u00e9s.",
        notions=["droit \u00e0 la d\u00e9connexion", "QVT", "disponibilit\u00e9"],
    ),
    I(
        "e4",
        "Modes de vie salari\u00e9s chez Sopra Steria",
        support=(
            "Sopra Steria lance en mars 2025 l'enqu\u00eate \u00ab Work & Life \u00bb (3 800 r\u00e9ponses France) :\n"
            "\u2014 34 % parents jeunes enfants : besoin flexibilit\u00e9 horaires ;\n"
            "\u2014 28 % 50+ : pr\u00e9f\u00e9rence 2 jours TT pour sant\u00e9/transport ;\n"
            "\u2014 22 % 25-35 ans : souhaitent 4 jours TT et nomadisme europ\u00e9en.\n"
            "La DRH adapte : forfaits jours pour cadres parents, semaine \u00ab focus \u00bb sans r\u00e9union "
            "le vendredi, option contrat \u00e0 temps partiel 80 %."
        ),
        consigne=(
            "Explique la prise en compte des modes de vie et montre comment Sopra Steria adapte l'organisation."
        ),
        questions=[
            "Qu'entend-on par modes de vie des salari\u00e9s ?",
            "Quels profils et besoins ressortent de l'enqu\u00eate ?",
            "Quelles adaptations RH Sopra Steria propose-t-elle ?",
        ],
        correction=(
            "1) Modes de vie :\n"
            "Aspirations et contraintes personnelles (famille, sant\u00e9, mobilit\u00e9, \u00e2ge) "
            "influen\u00e7ant les attentes vis-\u00e0-vis du travail.\n\n"
            "2) Profils enqu\u00eate :\n"
            f"{D}Parents (flexibilit\u00e9), 50+ (2 j TT sant\u00e9), 25-35 ans (4 j TT nomadisme).\n\n"
            "3) Adaptations :\n"
            f"{D}Forfaits jours parents, vendredi sans r\u00e9union, temps partiel 80 %."
        ),
        attendu="D\u00e9finition modes de vie, profils enqu\u00eate, adaptations RH.",
        notions=["modes de vie", "aspirations salari\u00e9s", "flexibilit\u00e9"],
    ),
    I(
        "e5",
        "Management OKR chez Orange",
        support=(
            "Orange Business adopte les OKR (Objectives and Key Results) en 2024 sur 12 000 managers et experts.\n"
            "Exemple T2 2025 : Objectif \u00ab Acc\u00e9l\u00e9rer la fibre entreprises \u00bb ; "
            "KR1 : +15 % de leads qualifi\u00e9s ; KR2 : d\u00e9lai r\u00e9ponse devis \u2264 48 h ; "
            "KR3 : NPS clients B2B \u2265 55.\n"
            "Revues trimestrielles publiques sur l'intranet. R\u00e9sultat : 78 % des \u00e9quipes "
            "atteignent au moins 2 KR sur 3 (contre 62 % avec anciens objectifs annuels)."
        ),
        consigne=(
            "D\u00e9finis les OKR et montre comment Orange les utilise en mode hybride."
        ),
        questions=[
            "Qu'est-ce qu'un OKR ?",
            "Reprends l'exemple Orange du support (objectif + 3 KR).",
            "Pourquoi les OKR conviennent-ils au management \u00e0 distance ?",
        ],
        correction=(
            "1) OKR :\n"
            "Objectif qualitatif ambitieux + 3 \u00e0 5 r\u00e9sultats cl\u00e9s mesurables, "
            "revus trimestriellement.\n\n"
            "2) Exemple Orange :\n"
            f"{D}Objectif fibre entreprises ; KR leads +15 %, devis \u226448 h, NPS \u226555.\n\n"
            "3) Management \u00e0 distance :\n"
            f"{D}\u00c9value les r\u00e9sultats, pas la pr\u00e9sence ; transparence intranet ; 78 % \u00e9quipes performantes."
        ),
        attendu="D\u00e9finition OKR, exemple d\u00e9taill\u00e9, lien management distance.",
        notions=["OKR", "management \u00e0 distance", "objectifs"],
    ),
    I(
        "e6",
        "Coh\u00e9sion hybride chez SNCF",
        support=(
            "SNCF Voyageurs (55 000 agents) m\u00e9lange m\u00e9tiers terrain (conducteurs, contr\u00f4leurs) "
            "et fonctions support en TT partiel.\n"
            "Dispositifs coh\u00e9sion 2024-2025 :\n"
            "\u2014 \u00ab SNCF Connect Day \u00bb mensuel : tous les supports se retrouvent en gare hub ;\n"
            "\u2014 mentorat crois\u00e9 terrain/si\u00e8ge ;\n"
            "\u2014 application interne \u00ab Merci coll\u00e8gue \u00bb (42 000 remerciements en 2024).\n"
            "Indice coh\u00e9sion interne : 67/100 (+9 points vs 2023)."
        ),
        consigne=(
            "Explique les enjeux de coh\u00e9sion en organisation hybride et montre les rituels SNCF."
        ),
        questions=[
            "Pourquoi la coh\u00e9sion est-elle fragilis\u00e9e en mode hybride ?",
            "Quels rituels SNCF d\u00e9ploie-t-elle ?",
            "Quel indicateur montre une am\u00e9lioration ?",
        ],
        correction=(
            "1) Fragilisation hybride :\n"
            f"{D}Moins d'\u00e9changes informels ; fracture terrain/si\u00e8ge ; isolement des TT r\u00e9guliers.\n\n"
            "2) Rituels SNCF :\n"
            f"{D}Connect Day mensuel, mentorat crois\u00e9, app \u00ab Merci coll\u00e8gue \u00bb.\n\n"
            "3) Indicateur :\n"
            f"{D}Indice coh\u00e9sion 67/100 (+9 points)."
        ),
        attendu="Enjeux coh\u00e9sion, rituels SNCF, indicateur cit\u00e9.",
        notions=["coh\u00e9sion d'\u00e9quipe", "mode hybride", "r\u00e9tention"],
    ),
    I(
        "e7",
        "QVT et burn-out chez Blablacar",
        support=(
            "Blablacar (900 salari\u00e9s, startup scale-up) identifie en 2024 trois cas de burn-out "
            "dans l'\u00e9quipe produit (releases hebdomadaires, r\u00e9unions tardives).\n"
            "Plan QVT 2025 : psychologue du travail \u00e0 demi-journ\u00e9e/semaine ; "
            "plafond 2 r\u00e9unions après 18 h ; \u00ab recharge week \u00bb sans d\u00e9ploiement une semaine/trimestre.\n"
            "Absent\u00e9isme maladie : 4,8 % (contre 6,9 % en 2023). eNPS (Net Promoter Score employeur) : 42 (+11)."
        ),
        consigne=(
            "D\u00e9finis QVT et burn-out, puis analyse le plan Blablacar."
        ),
        questions=[
            "Qu'est-ce que la QVT ? Qu'est-ce que le burn-out ?",
            "Quels facteurs de risque chez Blablacar ?",
            "Quelles mesures et quels r\u00e9sultats ?",
        ],
        correction=(
            "1) D\u00e9finitions :\n"
            "QVT : conditions de travail favorisant sant\u00e9, s\u00e9curit\u00e9 et \u00e9panouissement.\n"
            "Burn-out : \u00e9puisement professionnel par stress chronique.\n\n"
            "2) Facteurs Blablacar :\n"
            f"{D}Releases hebdo, r\u00e9unions tardives, pression produit.\n\n"
            "3) Mesures et r\u00e9sultats :\n"
            f"{D}Psychologue, plafond r\u00e9unions, recharge week ; absent\u00e9isme 4,8 %, eNPS 42."
        ),
        attendu="Deux d\u00e9finitions, facteurs risque, mesures + chiffres.",
        notions=["QVT", "burn-out", "bien-\u00eatre au travail"],
    ),
    I(
        "e8",
        "Parit\u00e9 acc\u00e8s t\u00e9l\u00e9travail chez Doctolib",
        support=(
            "Doctolib (2 800 salari\u00e9s, healthtech Paris/Berlin/Nantes) audite en f\u00e9vrier 2025 "
            "l'acc\u00e8s au t\u00e9l\u00e9travail : 71 % des hommes cadres en TT r\u00e9gulier vs 59 % des femmes cadres.\n"
            "Explication partielle : femmes plus pr\u00e9sentes en postes contact patient (pr\u00e9sentiel contraint). "
            "Mesures : objectif parit\u00e9 65/65 d'ici 2026 ; TT \u00e9largi aux r\u00f4les support clinique ; "
            "cr\u00e8che entreprise et cong\u00e9s parentaux \u00e9galis\u00e9s.\n"
            "Index \u00e9galit\u00e9 Doctolib 2024 : 85/100."
        ),
        consigne=(
            "Analyse l'\u00e9cart d'acc\u00e8s au t\u00e9l\u00e9travail et les mesures de parit\u00e9 chez Doctolib."
        ),
        questions=[
            "Quel \u00e9cart chiffr\u00e9 l'audit r\u00e9v\u00e8le-t-il ?",
            "Quelle explication partielle Doctolib identifie-t-elle ?",
            "Quelles mesures pour r\u00e9duire l'in\u00e9galit\u00e9 ?",
        ],
        correction=(
            "1) \u00c9cart :\n"
            f"{D}71 % hommes cadres en TT vs 59 % femmes cadres (\u00e9cart 12 points).\n\n"
            "2) Explication :\n"
            f"{D}Postes contact patient plus f\u00e9minis\u00e9s et contraints en pr\u00e9sentiel.\n\n"
            "3) Mesures :\n"
            f"{D}Objectif 65/65, TT support clinique, cr\u00e8che, cong\u00e9s parentaux \u00e9galis\u00e9s."
        ),
        attendu="\u00c9cart chiffr\u00e9, explication, mesures parit\u00e9.",
        notions=["parit\u00e9", "in\u00e9galit\u00e9s", "t\u00e9l\u00e9travail"],
    ),
    I(
        "e9",
        "Marque employeur chez Vinted",
        support=(
            "Vinted (hub Vilnius + bureaux Paris, 1 600 salari\u00e9s EU) lance en avril 2025 "
            "la campagne marque employeur \u00ab Work from Anywhere EU \u00bb sur LinkedIn et Welcome to the Jungle.\n"
            "Promesses : TT depuis 27 pays UE, budget mobilit\u00e9 2 000 \u20ac/an, semaine bien-\u00eatre.\n"
            "R\u00e9sultats 6 mois : 18 000 candidatures (+140 % vs 2024) ; "
            "Glassdoor 4,2/5 ; co\u00fbt recrutement \u221218 % gr\u00e2ce au vivier inbound."
        ),
        consigne=(
            "D\u00e9finis la marque employeur et montre la strat\u00e9gie Vinted."
        ),
        questions=[
            "Qu'est-ce que la marque employeur ?",
            "Quelles promesses Vinted communique-t-elle ?",
            "Quels r\u00e9sultats chiffr\u00e9s pour le recrutement ?",
        ],
        correction=(
            "1) Marque employeur :\n"
            "Image et r\u00e9putation de l'entreprise en tant qu'employeur, "
            "pour attirer et retenir les talents.\n\n"
            "2) Promesses Vinted :\n"
            f"{D}TT 27 pays UE, budget mobilit\u00e9 2 000 \u20ac, semaine bien-\u00eatre.\n\n"
            "3) R\u00e9sultats :\n"
            f"{D}18 000 candidatures (+140 %), Glassdoor 4,2/5, co\u00fbt recrutement \u221218 %."
        ),
        attendu="D\u00e9finition, promesses, trois r\u00e9sultats chiffr\u00e9s.",
        notions=["marque employeur", "attractivit\u00e9", "recrutement"],
    ),
    I(
        "e10",
        "Synth\u00e8se arbitrage pr\u00e9sentiel/TT chez ADEME",
        support=(
            "L'ADEME (Agence transition \u00e9cologique, 1 900 agents) arbitre en juin 2025 son ratio cible : "
            "actuellement 45 % TT moyen (post-Covid), b\u00e2tements si\u00e8ge Valbonne sous-utilis\u00e9s (\u221232 % occupation).\n"
            "Contraintes : missions terrain (audits usines), secret certaines donn\u00e9es, "
            "objectif neutralit\u00e9 carbone (r\u00e9duire d\u00e9placements).\n"
            "D\u00e9cision CODIR : 3 jours TT max, 2 jours pr\u00e9sentiel dont 1 jour \u00e9quipe obligatoire ; "
            "mutualisation bureaux ; budget d\u00e9placements \u221215 %."
        ),
        consigne=(
            "Pr\u00e9sente l'arbitrage ADEME entre pr\u00e9sentiel et t\u00e9l\u00e9travail."
        ),
        questions=[
            "Quels crit\u00e8res ADEME doit-elle concilier ?",
            "Quelle d\u00e9cision le CODIR prend-il ?",
            "Pourquoi cet arbitrage est-il coh\u00e9rent avec la mission de l'agence ?",
        ],
        correction=(
            "1) Crit\u00e8res :\n"
            f"{D}Flexibilit\u00e9 agents, co\u00fbt immobilier, missions terrain, s\u00e9curit\u00e9 donn\u00e9es, empreinte carbone.\n\n"
            "2) D\u00e9cision :\n"
            f"{D}3 j TT max, 2 j pr\u00e9sentiel (1 j \u00e9quipe), mutualisation bureaux.\n\n"
            "3) Coh\u00e9rence mission :\n"
            f"{D}R\u00e9duit d\u00e9placements (\u221215 % budget) tout en gardant coh\u00e9sion et audits terrain."
        ),
        attendu="Crit\u00e8res list\u00e9s, d\u00e9cision CODIR, lien mission ADEME.",
        notions=["arbitrage pr\u00e9sentiel/t\u00e9l\u00e9travail", "organisation hybride", "performance"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : retour au bureau chez France Travail",
        support=(
            "France Travail (130 000 agents) impose en janvier 2025 un retour au bureau "
            "4 jours/semaine pour les conseillers et managers (1 jour TT maintenu).\n"
            "Motif direction : mont\u00e9e en charge des usagers en agence, coh\u00e9sion \u00e9quipes.\n"
            "Effets 3 mois : 340 d\u00e9missions volontaires (+85 % vs T1 2024) ; "
            "gr\u00e8ve syndicale 12 mars ; Glassdoor 2,9/5 ; "
            "82 % des agents TT r\u00e9guliers insatisfaits (enqu\u00eate interne).\n"
            "Options : (A) maintenir 4 j ; (B) revenir \u00e0 2-3 j TT n\u00e9goci\u00e9 ; "
            "(C) prime pr\u00e9sentiel 150 \u20ac/ mois ; (D) TT selon m\u00e9tier (accueil pr\u00e9sentiel, back-office hybride)."
        ),
        consigne=(
            "Analyse la crise du retour au bureau et recommande une organisation hybride."
        ),
        questions=[
            "Pourquoi France Travail a-t-elle impos\u00e9 le retour bureau ?",
            "Quels signaux montrent l'\u00e9chec de la mesure ?",
            "Compare les options A \u00e0 D.",
            "Quelle d\u00e9cision recommandes-tu ? Justifie.",
        ],
        correction=(
            "1) Motif direction :\n"
            f"{D}Affluence usagers agence, coh\u00e9sion \u00e9quipes.\n\n"
            "2) Signaux \u00e9chec :\n"
            f"{D}340 d\u00e9missions, gr\u00e8ve, Glassdoor 2,9/5, 82 % insatisfaits.\n\n"
            "3) Options :\n"
            f"{D}A = rigide ; B = n\u00e9gociation ; C = incitation faible ; D = diff\u00e9renciation m\u00e9tiers.\n\n"
            "4) Recommandation D (ou B+D) :\n"
            f"{D}Hybride adapt\u00e9 au m\u00e9tier : accueil pr\u00e9sentiel, back-office flexible."
        ),
        attendu="Motif, signaux crise, comparaison options, recommandation argument\u00e9e.",
        notions=["retour au bureau", "t\u00e9l\u00e9travail", "turnover"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : crise LinkedIn \u2014 Mairie de Grenoble",
        support=(
            "Mars 2025 : une adjointe RH de la Mairie de Grenoble publie sur LinkedIn un t\u00e9moignage "
            "anonymis\u00e9 sur burn-out et mails du maire \u00e0 23 h (4 800 partages en 72 h).\n"
            "Contexte : 3 200 agents municipaux, TT limit\u00e9 aux cadres (1 jour/semaine), "
            "charte d\u00e9connexion non appliqu\u00e9e aux \u00e9lus.\n"
            "R\u00e9actions : syndicats FO/CGT, p\u00e9tition 12 000 signatures, "
            "presse locale, candidats opposition relancent le d\u00e9bat pr\u00e9sentiel.\n"
            "Options : (A) disciplinaire contre l'auteur ; (B) silence ; "
            "(C) m\u00e9dia training maire ; (D) charte d\u00e9connexion \u00e9lus + plan QVT + m\u00e9diateur."
        ),
        consigne=(
            "Analyse la crise RH r\u00e9v\u00e9l\u00e9e sur LinkedIn et propose une r\u00e9ponse manag\u00e9riale."
        ),
        questions=[
            "Quels probl\u00e8mes de QVT le post LinkedIn r\u00e9v\u00e8le-t-il ?",
            "Pourquoi l'option A aggraverait la crise ?",
            "Quels leviers l'option D active-t-elle ?",
            "Quelle d\u00e9cision recommandes-tu ? Justifie.",
        ],
        correction=(
            "1) Probl\u00e8mes QVT :\n"
            f"{D}Burn-out, d\u00e9connexion non respect\u00e9e, in\u00e9galit\u00e9 TT cadres/autres, pression \u00e9lus.\n\n"
            "2) Risque option A :\n"
            f"{D}R\u00e9pression du lanceur d'alerte \u2192 amplification m\u00e9diatique et perte confiance agents.\n\n"
            "3) Leviers option D :\n"
            f"{D}Charte \u00e9lus, plan QVT, m\u00e9diateur \u2192 reconnaissance probl\u00e8me et action structurelle.\n\n"
            "4) Recommandation D :\n"
            f"{D}R\u00e9ponse transparente, pas de repr\u00e9sailles, mesures concr\u00e8tes burn-out/d\u00e9connexion."
        ),
        attendu="Probl\u00e8mes QVT, rejet option A, leviers option D, recommandation.",
        notions=["burn-out", "droit \u00e0 la d\u00e9connexion", "crise RH"],
    ),
]
