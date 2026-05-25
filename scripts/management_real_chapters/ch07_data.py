# -*- coding: utf-8 -*-
"""Management chapitre 7 — acteurs reels, un concept par exercice."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH7 = [
    I(
        "e1",
        "SI de production ERP/MES chez Veolia",
        support=(
            "Veolia exploite une usine de valorisation \u00e9nerg\u00e9tique des d\u00e9chets \u00e0 Ivry-sur-Seine. "
            "L'ERP SAP couvre achats, stocks, comptabilit\u00e9 et maintenance. "
            "Le MES (Manufacturing Execution System) trace chaque lot en temps r\u00e9el : "
            "temp\u00e9rature de combustion, param\u00e8tres turbine, op\u00e9rateur de quart. "
            "L'ERP coordonne la commande client \u2192 ordre de production \u2192 approvisionnement \u2192 livraison d'\u00e9nergie. "
            "Avant l'int\u00e9gration, les silos d'information causaient 14 % de retards. "
            "Apr\u00e8s 20 mois, le taux de service client passe de 89 % \u00e0 96 %."
        ),
        consigne=(
            "Explique le r\u00f4le central des syst\u00e8mes d'information (ERP, MES) "
            "dans la digitalisation des processus de production chez Veolia."
        ),
        questions=[
            "Qu'est-ce qu'un ERP et un MES ? Quelle diff\u00e9rence ?",
            "Comment Veolia illustre-t-elle la continuit\u00e9 num\u00e9rique du cours ?",
            "Quels avantages et limites de l'int\u00e9gration ERP/MES ?",
        ],
        correction=(
            "1) ERP (PGI) : chef d'orchestre gestion (achats, stocks, compta).\n"
            "MES : pilotage atelier temps r\u00e9el (tra\u00e7abilit\u00e9, cycles).\n\n"
            "2) Flux num\u00e9rique de la commande \u00e0 la livraison, \u00e9limination silos, tra\u00e7abilit\u00e9 lots.\n\n"
            "3) Avantages : r\u00e9activit\u00e9, taux service +7 pts.\n"
            f"{D}Limites : co\u00fbt, d\u00e9ploiement 20 mois, formation, d\u00e9pendance SI."
        ),
        attendu="D\u00e9finitions ERP/MES, application Veolia, analyse critique.",
        notions=["ERP", "MES", "syst\u00e8mes d'information"],
    ),
    I(
        "e2",
        "Automatisation et robots chez Suez",
        support=(
            "Suez a \u00e9quip\u00e9 son centre de tri automatique de Saint-Quentin-en-Yvelines "
            "de robots de pr\u00e9hension et de convoyeurs intelligents. "
            "Investissement : 4,2 M\u20ac. Cadence de tri +31 %, erreurs de classification \u221222 %, "
            "p\u00e9nibilit\u00e9 r\u00e9duite (postes manutention \u00e9limin\u00e9s). "
            "Effectifs tri : \u221212 % r\u00e9affect\u00e9s en maintenance et contr\u00f4le qualit\u00e9. "
            "Le CSE a n\u00e9goci\u00e9 un plan de formation et de reclassement sur 18 mois."
        ),
        consigne=(
            "Analyse l'automatisation industrielle chez Suez : d\u00e9finition, "
            "impacts productivit\u00e9/emploi/qualit\u00e9."
        ),
        questions=[
            "D\u00e9finis l'automatisation industrielle selon le cours.",
            "Quels impacts positifs et n\u00e9gatifs chez Suez ?",
            "Pourquoi la dimension sociale (CSE, formation) est-elle importante ?",
        ],
        correction=(
            "1) Int\u00e9gration machines/robots/ordinateurs pour t\u00e2ches autrefois manuelles. "
            "R\u00e9duit co\u00fbts, am\u00e9liore productivit\u00e9 et qualit\u00e9, diminue p\u00e9nibilit\u00e9.\n\n"
            "2) Positifs : cadence +31 %, erreurs \u221222 %, qualit\u00e9.\n"
            f"{D}N\u00e9gatifs : \u221212 % effectifs tri (r\u00e9affectation n\u00e9cessaire).\n\n"
            "3) Automatisation transforme emplois : formation maintenance/qualit\u00e9, "
            "dialogue social, acceptabilit\u00e9 du projet."
        ),
        attendu="D\u00e9finition, impacts chiffr\u00e9s, dimension RH.",
        notions=["automatisation", "robots", "productivit\u00e9"],
    ),
    I(
        "e3",
        "RPA administratif chez Danone",
        support=(
            "Danone d\u00e9ploie la RPA (Robotic Process Automation) sur le traitement des factures fournisseurs "
            "de son si\u00e8ge \u00e0 Paris : 3 800 factures/mois saisies automatiquement, "
            "rapprochement bon de commande, validation comptable. "
            "Erreurs de saisie \u221288 %, d\u00e9lai traitement 6 j \u2192 9 h, "
            "2,3 ETP r\u00e9affect\u00e9s au contr\u00f4le de gestion et analyse des \u00e9carts."
        ),
        consigne=(
            "Pr\u00e9sente la RPA, ses avantages et ses diff\u00e9rences "
            "avec l'automatisation industrielle chez Danone."
        ),
        questions=[
            "Qu'est-ce que la RPA ? Dans quels secteurs est-elle utilis\u00e9e ?",
            "Analyse les r\u00e9sultats du d\u00e9ploiement RPA chez Danone.",
            "Compare RPA (services) et automatisation industrielle (robots).",
        ],
        correction=(
            "1) RPA : automatisation de t\u00e2ches r\u00e9p\u00e9titives administratives via robots logiciels. "
            "Comptabilit\u00e9, banque, RH, assurances.\n\n"
            "2) 3 800 factures/mois, erreurs \u221288 %, d\u00e9lai \u00f715, 2,3 ETP \u2192 contr\u00f4le de gestion.\n\n"
            "3) RPA = logiciel, t\u00e2ches bureau. Automatisation industrielle = machines/robots en atelier. "
            "M\u00eame logique : productivit\u00e9, conformit\u00e9, d\u00e9charge humaine."
        ),
        attendu="D\u00e9finition RPA, r\u00e9sultats chiffr\u00e9s, comparaison avec automatisation.",
        notions=["RPA", "automatisation", "transformation num\u00e9rique"],
    ),
    I(
        "e4",
        "D\u00e9mat\u00e9rialisation chez Tetra Pak",
        support=(
            "L'usine Tetra Pak de Rubi\u00e1 (Espagne, site de r\u00e9f\u00e9rence pour la France) "
            "remplace les bons de production papier par des tablettes en atelier : "
            "saisie temps, param\u00e8tres aseptiques, photos d\u00e9fauts. "
            "Archivage cloud certifi\u00e9 ISO 27001. "
            "Gains : r\u00e9activit\u00e9 (+d\u00e9lais), r\u00e9duction co\u00fbts papier/archivage (\u221248 000 \u20ac/an), "
            "tra\u00e7abilit\u00e9 am\u00e9lior\u00e9e, d\u00e9marche z\u00e9ro papier (RSE). "
            "Les flux documentaires (commandes, BL, certificats mati\u00e8res) circulent num\u00e9riquement."
        ),
        consigne=(
            "Explique la d\u00e9mat\u00e9rialisation des processus de production "
            "et ses enjeux pour Tetra Pak."
        ),
        questions=[
            "D\u00e9finis d\u00e9mat\u00e9rialisation et digitalisation selon le cours.",
            "Quels enjeux rep\u00e8res-tu dans le support (d\u00e9lais, co\u00fbts, tra\u00e7abilit\u00e9, RSE) ?",
            "Quelles limites ou risques de la d\u00e9mat\u00e9rialisation ?",
        ],
        correction=(
            "1) D\u00e9mat\u00e9rialisation : remplacer supports mat\u00e9riels par num\u00e9riques. "
            "Digitalisation des flux documentaires.\n\n"
            "2) R\u00e9activit\u00e9, \u221248 000 \u20ac/an, tra\u00e7abilit\u00e9 lots, z\u00e9ro papier, partage parties prenantes.\n\n"
            "3) Cybers\u00e9curit\u00e9 (ISO 27001 n\u00e9cessaire), d\u00e9pendance connexion, "
            "formation op\u00e9rateurs, co\u00fbt initial tablettes."
        ),
        attendu="D\u00e9finitions, quatre enjeux identifi\u00e9s, limites argument\u00e9es.",
        notions=["d\u00e9mat\u00e9rialisation", "digitalisation", "tra\u00e7abilit\u00e9"],
    ),
    I(
        "e5",
        "BPM et flux de travail chez Nestl\u00e9",
        support=(
            "Nestl\u00e9 France (usine de Vittel) cartographie ses processus m\u00e9tiers "
            "avant d'adopter un logiciel BPM (Business Process Management). "
            "Exemple : processus \u00ab non-conformit\u00e9 qualit\u00e9 eau \u00bb \u2014 "
            "d\u00e9tection capteur MES \u2192 alerte responsable qualit\u00e9 \u2192 analyse \u2192 d\u00e9cision \u2192 tra\u00e7abilit\u00e9 ERP. "
            "D\u00e9lai moyen de traitement : 52 h \u2192 5 h. "
            "Le BPM est au c\u0153ur de la transformation num\u00e9rique : mod\u00e9liser, optimiser, automatiser."
        ),
        consigne=(
            "Mobilise les notions de workflow, diagramme de flux et BPM "
            "pour analyser l'optimisation du processus qualit\u00e9 Nestl\u00e9."
        ),
        questions=[
            "Qu'est-ce qu'un workflow et un diagramme de flux de donn\u00e9es ?",
            "Quel r\u00f4le joue le BPM dans la transformation num\u00e9rique ?",
            "Analyse l'am\u00e9lioration du processus non-conformit\u00e9 chez Nestl\u00e9.",
        ],
        correction=(
            "1) Workflow : mod\u00e9lisation des t\u00e2ches et acteurs d'un processus. "
            "Diagramme de flux : circulation des donn\u00e9es dans les SI.\n\n"
            "2) BPM : mod\u00e9liser, optimiser, automatiser processus m\u00e9tiers. "
            "C\u0153ur de la transformation digitale.\n\n"
            "3) Cha\u00eene MES\u2192qualit\u00e9\u2192ERP automatis\u00e9e, d\u00e9lai 52 h \u2192 5 h (\u00f710), "
            "tra\u00e7abilit\u00e9 renforc\u00e9e."
        ),
        attendu="D\u00e9finitions BPM/workflow, application processus qualit\u00e9.",
        notions=["BPM", "workflow", "transformation num\u00e9rique"],
    ),
    I(
        "e6",
        "Industrie 4.0 et IoT chez Les Canaux",
        support=(
            "Les Canaux (hub d'innovation sociale \u00e0 Lille) accompagne une start-up "
            "qui \u00e9quipe des conteneurs de collecte de d\u00e9chets de capteurs IoT "
            "(niveau de remplissage, temp\u00e9rature, localisation). "
            "Donn\u00e9es transmises en temps r\u00e9el vers une plateforme cloud. "
            "Optimisation tourn\u00e9es : \u221218 % de km parcourus, \u221212 % de collectes \u00e0 vide. "
            "8 conteneurs pilotes d\u00e9ploy\u00e9s fin 2025, extension pr\u00e9vue \u00e0 120 unit\u00e9s en 2026."
        ),
        consigne=(
            "Explique le r\u00f4le des objets connect\u00e9s (IoT/IIoT) "
            "dans l'am\u00e9lioration des processus de production et de logistique."
        ),
        questions=[
            "Qu'est-ce que l'IoT industriel (IIoT) ?",
            "Comment les capteurs am\u00e9liorent-ils qualit\u00e9, productivit\u00e9 et s\u00e9curit\u00e9 ?",
            "Pr\u00e9sente les r\u00e9sultats du pilote Les Canaux \u00e0 partir du support.",
        ],
        correction=(
            "1) IIoT : objets connect\u00e9s en cha\u00eene de production/logistique, "
            "capteurs \u2192 donn\u00e9es temps r\u00e9el \u2192 big data.\n\n"
            "2) Surveillance continue, d\u00e9cisions op\u00e9rateurs inform\u00e9es, "
            "optimisation tourn\u00e9es, r\u00e9duction gaspillages.\n\n"
            "3) \u221218 % km, \u221212 % collectes \u00e0 vide, pilote 8 conteneurs, "
            "extension 120 unit\u00e9s pr\u00e9vue."
        ),
        attendu="D\u00e9finition IIoT, impacts, r\u00e9sultats chiffr\u00e9s.",
        notions=["IoT", "Industrie 4.0", "objets connect\u00e9s"],
    ),
    I(
        "e7",
        "Cloud computing \u2014 Syndicat mixte des d\u00e9chets",
        support=(
            "Le Syndicat mixte des d\u00e9chets du Pays Basque stocke et analyse "
            "les donn\u00e9es IoT de 340 conteneurs sur un cloud OVHcloud : "
            "planification tourn\u00e9es \u00e0 distance 24h/24, mises \u00e0 jour logicielles \u00e0 distance. "
            "Avantages : donn\u00e9es accessibles partout, gain de place, \u00e9nergie. "
            "Inconv\u00e9nient identifi\u00e9 : panne serveur f\u00e9vrier 2025 (3 h d'interruption, "
            "12 tourn\u00e9es retard\u00e9es). N\u00e9cessit\u00e9 connexion performante en zone rurale."
        ),
        consigne=(
            "Pr\u00e9sente le cloud computing, ses apports et ses limites "
            "pour les processus de production et de collecte."
        ),
        questions=[
            "D\u00e9finis cloud computing et son lien avec IoT et IA.",
            "Cite trois avantages et deux inconv\u00e9nients illustr\u00e9s par le syndicat.",
            "Comment s\u00e9curiser un usage cloud en environnement industriel ?",
        ],
        correction=(
            "1) Cloud : serveurs distants via Internet pour stocker/exploiter donn\u00e9es. "
            "Base pour IoT, IA, d\u00e9mat\u00e9rialisation.\n\n"
            "2) Avantages : acc\u00e8s distant, maintenance 24/7, mises \u00e0 jour, gain place/\u00e9nergie.\n"
            f"{D}Inconv\u00e9nients : panne serveur (3 h, 12 tourn\u00e9es), d\u00e9pendance connexion.\n\n"
            "3) Sauvegardes, plan continuit\u00e9, redondance, s\u00e9curisation acc\u00e8s, segmentation OT/IT."
        ),
        attendu="D\u00e9finition cloud, avantages/inconv\u00e9nients, s\u00e9curisation.",
        notions=["cloud computing", "IoT", "cybers\u00e9curit\u00e9"],
    ),
    I(
        "e8",
        "IA et maintenance pr\u00e9dictive chez Emma\u00fcs",
        support=(
            "Emma\u00fcs France \u00e9quipe son centre de tri de Saint-Ouen de capteurs "
            "sur presses \u00e0 balles et convoyeurs. Des algorithmes de machine learning "
            "analysent 14 mois de donn\u00e9es pour pr\u00e9dire les d\u00e9faillances. "
            "Taux de pr\u00e9diction correcte : 84 %. "
            "Pannes \u221219 %, arr\u00eats non planifi\u00e9s \u221232 h/an. "
            "13 % d'erreurs de pr\u00e9diction n\u00e9cessitent une validation humaine syst\u00e9matique."
        ),
        consigne=(
            "Explique l'intelligence artificielle et son application "
            "\u00e0 la maintenance pr\u00e9dictive chez Emma\u00fcs."
        ),
        questions=[
            "D\u00e9finis intelligence artificielle et machine learning.",
            "Comment l'IA am\u00e9liore-t-elle la maintenance pr\u00e9dictive ?",
            "Quelles limites de l'IA en production industrielle ?",
        ],
        correction=(
            "1) IA : machines accomplissant t\u00e2ches humaines via algorithmes. "
            "Machine learning : apprentissage sur donn\u00e9es massives.\n\n"
            "2) Analyse 14 mois donn\u00e9es, d\u00e9tection patterns, pr\u00e9diction 84 %, "
            "pannes \u221219 %, \u221232 h arr\u00eat.\n\n"
            "3) Qualit\u00e9 donn\u00e9es, co\u00fbt, expertise humaine n\u00e9cessaire, "
            "erreurs possibles (16 %), d\u00e9pendance SI."
        ),
        attendu="D\u00e9finitions IA/ML, application maintenance, limites.",
        notions=["intelligence artificielle", "maintenance pr\u00e9dictive", "machine learning"],
    ),
    I(
        "e9",
        "ROI num\u00e9rique chez Decathlon",
        support=(
            "Decathlon d\u00e9ploie la RFID en magasin sur 42 sites pilotes (investissement 2,1 M\u20ac). "
            "Gains annuels estim\u00e9s : inventaire \u2212620 000 \u20ac, ruptures \u2212380 000 \u20ac, "
            "productivit\u00e9 caisse +145 000 \u20ac. Total gains 1 145 000 \u20ac/an. "
            "Payback : 2,1 M / 1,145 M \u2248 1,8 an. "
            "Comit\u00e9 d'investissement exige ROI > 12 % et payback < 3 ans. Projet valid\u00e9. "
            "Formation : 80 h/an/magasin, budget 320 000 \u20ac sur 2 ans."
        ),
        consigne=(
            "Calcule le retour sur investissement du projet RFID Decathlon "
            "et pr\u00e9sente les crit\u00e8res de d\u00e9cision d'investissement num\u00e9rique."
        ),
        questions=[
            "Calcule le payback et le gain annuel du projet RFID.",
            "Quels crit\u00e8res au-del\u00e0 du ROI financier faut-il consid\u00e9rer ?",
            "Le projet est-il valid\u00e9 selon les crit\u00e8res du comit\u00e9 ?",
        ],
        correction=(
            "1) Gains 1 145 000 \u20ac/an. Payback 1,8 an (< 3 ans). "
            "ROI annuel \u2248 1 145 000/2 100 000 \u2248 55 % (> 12 %).\n\n"
            "2) Formation (320 000 \u20ac), conduite changement, cybers\u00e9curit\u00e9, "
            "d\u00e9pendance fournisseur.\n\n"
            "3) Oui : payback et ROI d\u00e9passent les seuils. Formation int\u00e9gr\u00e9e au plan."
        ),
        attendu="Calcul payback/ROI, crit\u00e8res multiples, d\u00e9cision justifi\u00e9e.",
        notions=["ROI", "investissement num\u00e9rique", "payback"],
    ),
    I(
        "e10",
        "Synth\u00e8se SI production \u2014 Loop (TerraCycle)",
        support=(
            "Loop (TerraCycle) d\u00e9ploie en France une plateforme de consigne num\u00e9rique "
            "pour emballages r\u00e9utilisables (Carrefour, Nestl\u00e9). "
            "Feuille de route 2025-2027 (budget 890 k\u20ac) : "
            "(1) IoT conteneurs retour 280 k\u20ac, (2) RPA facturation 95 k\u20ac, "
            "(3) Module tra\u00e7abilit\u00e9 ERP 310 k\u20ac, (4) App consommateur 205 k\u20ac. "
            "Quick win : RPA (payback < 1 an). IoT : suivi retours. "
            "ERP tra\u00e7abilit\u00e9 : d\u00e9lai 18 mois. Conduite changement : 60 h formation/an."
        ),
        consigne=(
            "Priorise les quatre projets de la feuille de route Loop "
            "en mobilisant SI, automatisation, ROI et conduite du changement."
        ),
        questions=[
            "Pr\u00e9sente les quatre projets et leurs apports respectifs.",
            "Propose un ordre de priorit\u00e9 argument\u00e9 (ROI, risques, quick wins).",
            "Quels facteurs de conduite du changement int\u00e9grer ?",
        ],
        correction=(
            "1) IoT (suivi retours), RPA (admin), ERP tra\u00e7abilit\u00e9 (long terme), app consommateur (engagement).\n\n"
            "2) Priorit\u00e9 : (1) RPA quick win, (2) app consommateur, (3) IoT, (4) ERP tra\u00e7abilit\u00e9 phase 2.\n\n"
            "3) Formation 60 h/an, communication, implication partenaires (Carrefour, Nestl\u00e9), pilotes avant d\u00e9ploiement."
        ),
        attendu="Comparaison projets, prioritisation argument\u00e9e, conduite changement.",
        notions=["SI production", "conduite du changement", "ROI"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : feuille de route 4.0 \u2014 ADEME",
        support=(
            "L'ADEME pilote le programme \u00ab Usines du futur \u00bb pour 120 PME industrielles. "
            "Budget national 45 M\u20ac sur 4 ans. Crit\u00e8res d'\u00e9ligibilit\u00e9 : ROI > 10 %, "
            "r\u00e9duction empreinte carbone mesurable, plan formation obligatoire. "
            "PME cible type : CA 8-25 M\u20ac, 80-250 salari\u00e9s, maturit\u00e9 num\u00e9rique faible. "
            "Projets prioritaires : IoT \u00e9nergie (payback 2,5 ans), RPA comptabilit\u00e9 (0,9 an), "
            "MES qualit\u00e9 (d\u00e9lai 24 mois). Tr\u00e9sorerie PME max 200 k\u20ac/an d'investissement. "
            "Exigence clients grands comptes : tra\u00e7abilit\u00e9 renforc\u00e9e d'ici 18 mois."
        ),
        consigne=(
            "R\u00e9dige une feuille de route type ADEME pour une PME industrielle "
            "avec crit\u00e8res, ROI, planning et conduite du changement."
        ),
        questions=[
            "Quels crit\u00e8res de priorit\u00e9 retenir (ROI, client, RH, capacit\u00e9 SI) ?",
            "Analyse chaque projet (co\u00fbt, b\u00e9n\u00e9fices, risques, d\u00e9lai).",
            "Propose un planning 2025-2028 respectant tr\u00e9sorerie 200 k\u20ac/an.",
            "Plan conduite du changement (formation, communication, CSE).",
            "Synth\u00e8se : roadmap argument\u00e9e en 10 lignes.",
        ],
        correction=(
            "1) ROI, exigence client 18 mois, impact emploi, capacit\u00e9 SI limit\u00e9e.\n\n"
            "2) RPA : quick win. IoT \u00e9nergie : \u00e9conomies. MES qualit\u00e9 : exigence client mais long.\n\n"
            "3) An 1 : RPA + d\u00e9but IoT (180 k\u20ac). An 2 : fin IoT (200 k\u20ac). An 3-4 : MES qualit\u00e9.\n\n"
            "4) Formation obligatoire ADEME, r\u00e9unions CSE, pilotes atelier.\n\n"
            "5) Quick wins d'abord, qualit\u00e9 client en parall\u00e8le, MES en phase 2."
        ),
        attendu="Roadmap compl\u00e8te chapitre 7, planning tr\u00e9sorerie respect\u00e9.",
        notions=["Industrie 4.0", "feuille de route", "ROI"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : cyberattaque \u2014 M\u00e9tropole de Lyon",
        support=(
            "La M\u00e9tropole de Lyon g\u00e8re via un MES municipal la supervision "
            "de 12 usines de traitement des eaux et de 340 capteurs IoT urbains. "
            "Ransomware paralyse le MES 28 h en mars 2025 : "
            "production arr\u00eat\u00e9e sur 2 sites, 240 000 \u20ac de p\u00e9nalit\u00e9s contractuelles, "
            "5 collectivit\u00e9s voisines alert\u00e9es. Cause : phishing email comptabilit\u00e9, "
            "r\u00e9seau OT/IT non segment\u00e9. Sauvegardes cloud compromises. "
            "PRA (plan reprise activit\u00e9) jamais test\u00e9. Restauration manuelle 28 h."
        ),
        consigne=(
            "Analyse la crise SI production de la M\u00e9tropole de Lyon "
            "et propose un plan pr\u00e9ventif (cybers\u00e9curit\u00e9 industrielle)."
        ),
        questions=[
            "Identifie les vuln\u00e9rabilit\u00e9s ayant permis l'attaque.",
            "Quantifie les cons\u00e9quences \u00e9conomiques et relationnelles.",
            "Pr\u00e9sente un plan de reprise d'activit\u00e9 (PRA) adapt\u00e9.",
            "Mesures pr\u00e9ventives \u00e0 d\u00e9ployer (OT/IT, sauvegardes, formation).",
            "Communication collectivit\u00e9s partenaires : que dire et quand ?",
        ],
        correction=(
            "1) Phishing, OT/IT non segment\u00e9, sauvegardes compromises, PRA non test\u00e9.\n\n"
            "2) 240 000 \u20ac p\u00e9nalit\u00e9s, 28 h arr\u00eat, 5 collectivit\u00e9s alert\u00e9es (risque contrat).\n\n"
            "3) PRA : restauration MES < 4 h, sauvegardes offline, proc\u00e9dure manuelle temporaire.\n\n"
            "4) Segmentation, MFA, sauvegardes air-gapped, tests trimestriels, sensibilisation phishing.\n\n"
            "5) Transparence rapide, plan correction, audit s\u00e9curit\u00e9, reporting hebdo."
        ),
        attendu="Analyse cyber compl\u00e8te, PRA et pr\u00e9vention structur\u00e9s.",
        notions=["cybers\u00e9curit\u00e9", "PRA", "MES"],
    ),
]
