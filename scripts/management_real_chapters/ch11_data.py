# -*- coding: utf-8 -*-
"""Management chapitre 11 — transformation num\u00e9rique et parcours client."""

D = "\u2014 "


def I(sid, title, **body):
    return {"sid": sid, "title": title, "body": body}


CH11 = [
    I(
        "e1",
        "Parcours client RO PO chez Cr\u00e9dit Agricole",
        support=(
            "Cr\u00e9dit Agricole (coop\u00e9rative bancaire, 142 000 collaborateurs) d\u00e9ploie "
            "en 2024 le parcours \u00ab Pr\u00eat immobilier digital \u00bb :\n"
            "\u2014 RO (Recherche Online) : le client simule son pr\u00eat sur ca.fr "
            "(taux, mensualit\u00e9s) \u2014 2,3 M de simulations en 2024 ;\n"
            "\u2014 ROPO : 68 % des clients simulant en ligne se rendent ensuite "
            "en agence ou en visio pour finaliser ;\n"
            "\u2014 PO (Purchase Offline) : signature chez le conseiller "
            "(agence ou visio-conseil certifi\u00e9e).\n"
            "R\u00e9sultat : d\u00e9lai moyen d'octroi 28 jours (contre 42 jours en 2021), "
            "satisfaction parcours 78/100."
        ),
        consigne=(
            "Explique le parcours client RO PO et montre comment "
            "Cr\u00e9dit Agricole combine digital et agence."
        ),
        questions=[
            "Qu'est-ce que le parcours client RO PO ?",
            "Comment se d\u00e9roule le parcours pr\u00eat immobilier Cr\u00e9dit Agricole ?",
            "Que montrent les chiffres 68 % ROPO et d\u00e9lai 42 \u2192 28 jours ?",
        ],
        correction=(
            "1) Parcours RO PO :\n"
            "RO = Recherche Online (information, comparaison sur le web).\n"
            "PO = Purchase Offline (achat finalis\u00e9 en point de vente physique ou humain).\n"
            "ROPO = recherche en ligne puis achat hors ligne.\n\n"
            "2) Parcours Cr\u00e9dit Agricole :\n"
            f"{D}Simulation en ligne \u2192 rendez-vous agence/visio \u2192 signature conseiller.\n\n"
            "3) Interpr\u00e9tation :\n"
            f"{D}68 % ROPO = le digital pr\u00e9pare mais n'\u00e9limine pas l'agence.\n"
            f"{D}D\u00e9lai \u221214 jours = gain d'efficacit\u00e9 du parcours phygital."
        ),
        attendu="RO PO d\u00e9fini, parcours d\u00e9crit, deux chiffres interpr\u00e9t\u00e9s.",
        notions=["parcours client", "RO PO", "phygital"],
    ),
    I(
        "e2",
        "Traces num\u00e9riques 360\u00b0 chez BNP Paribas",
        support=(
            "BNP Paribas (180 000 collaborateurs) agr\u00e8ge en 2024 les traces "
            "num\u00e9riques clients sur son data hub \u00ab 360\u00b0 Client \u00bb :\n"
            "\u2014 application mobile : connexions, virements, cat\u00e9gorisation d\u00e9penses ;\n"
            "\u2014 site web : pages consult\u00e9es, simulations ;\n"
            "\u2014 agence : comptes-rendus CRM saisis par les conseillers ;\n"
            "\u2014 call center : historique appels et r\u00e9clamations.\n"
            "Exemple : un client consultant 3 pages \u00ab assurance habitation \u00bb "
            "puis appelant le service client re\u00e7oit une offre personnalis\u00e9e "
            "par e-mail sous 24 h. Taux de conversion : +22 % vs campagne g\u00e9n\u00e9rique.\n"
            "Conformit\u00e9 RGPD : consentement opt-in pour le profilage marketing."
        ),
        consigne=(
            "Qu'est-ce qu'une vision client 360\u00b0 ? Explique comment "
            "BNP Paribas l'utilise \u00e0 partir du support."
        ),
        questions=[
            "D\u00e9finis traces num\u00e9riques et vision client 360\u00b0.",
            "Quelles quatre sources de donn\u00e9es BNP agr\u00e8ge-t-il ?",
            "Comment le RGPD limite-t-il l'exploitation de ces traces ?",
        ],
        correction=(
            "1) D\u00e9finitions :\n"
            "Traces num\u00e9riques : donn\u00e9es laiss\u00e9es par le client "
            "lors de ses interactions digitales.\n"
            "Vision 360\u00b0 : agr\u00e9gation de toutes les donn\u00e9es client "
            "(canal, historique, comportement) pour une relation unifi\u00e9e.\n\n"
            "2) Sources BNP :\n"
            f"{D}App mobile, site web, CRM agence, call center.\n\n"
            "3) RGPD :\n"
            f"{D}Consentement opt-in obligatoire pour le profilage marketing."
        ),
        attendu="D\u00e9finitions, quatre sources, limite RGPD.",
        notions=["traces num\u00e9riques", "vision client 360\u00b0"],
    ),
    I(
        "e3",
        "Social listening chez La Banque Postale",
        support=(
            "La Banque Postale (35 000 collaborateurs) met en place en 2024 "
            "un dispositif de social listening (veille r\u00e9seaux sociaux) :\n"
            "\u2014 outil Brandwatch : surveillance X, Facebook, Instagram, forums ;\n"
            "\u2014 mots-cl\u00e9s : \u00ab Banque Postale \u00bb, \u00ab Livret A \u00bb, "
            "\u00ab pr\u00e9l\u00e8vement \u00e0 la source \u00bb ;\n"
            "\u2014 volume : 18 000 mentions/mois, sentiment positif 62 %.\n"
            "Cas mars 2024 : pic n\u00e9gatif (+340 % de mentions n\u00e9gatives en 48 h) "
            "sur une panne de l'application mobile. La direction communique "
            "sur X sous 2 h, publie un communiqu\u00e9, lance un num\u00e9ro d'urgence. "
            "Retour \u00e0 la normale en 5 jours."
        ),
        consigne=(
            "D\u00e9finis le social listening et analyse la gestion de crise "
            "La Banque Postale dans le support."
        ),
        questions=[
            "Qu'est-ce que le social listening ?",
            "Quels outils et indicateurs La Banque Postale utilise-t-elle ?",
            "Comment a-t-elle r\u00e9agi \u00e0 la panne application (mars 2024) ?",
        ],
        correction=(
            "1) Social listening :\n"
            "Veille et analyse des conversations sur les r\u00e9seaux sociaux "
            "pour mesurer l'e-r\u00e9putation et d\u00e9tecter les signaux faibles.\n\n"
            "2) Dispositif Banque Postale :\n"
            f"{D}Brandwatch, 18 000 mentions/mois, sentiment 62 % positif.\n\n"
            "3) Gestion crise panne :\n"
            f"{D}D\u00e9tection pic n\u00e9gatif \u2192 communication X sous 2 h "
            f"\u2192 communiqu\u00e9 + num\u00e9ro urgence \u2192 retour normale 5 jours."
        ),
        attendu="D\u00e9finition, indicateurs, s\u00e9quence de crise.",
        notions=["social listening", "e-r\u00e9putation"],
    ),
    I(
        "e4",
        "CRM omnicanal chez Revolut",
        support=(
            "Revolut (n\u00e9obanque, 45 M de clients dans le monde, 500 salari\u00e9s "
            "en France) centralise son CRM omnicanal en 2024 :\n"
            "\u2014 un m\u00eame identifiant client sur app, chat in-app, e-mail et t\u00e9l\u00e9phone ;\n"
            "\u2014 historique unifi\u00e9 : l'agent voit les 5 derniers contacts "
            "quel que soit le canal ;\n"
            "\u2014 chatbot IA niveau 1 (60 % des demandes r\u00e9solues sans humain) ;\n"
            "\u2014 escalade automatique vers conseiller si score insatisfaction > 3/5.\n"
            "Indicateurs : temps de r\u00e9ponse moyen 4 min (contre 18 min en 2022), "
            "NPS support 71 (contre 58), co\u00fbt par contact \u221235 %."
        ),
        consigne=(
            "D\u00e9finis CRM omnicanal et explique la strat\u00e9gie Revolut "
            "d'apr\u00e8s le support."
        ),
        questions=[
            "Qu'est-ce qu'un CRM omnicanal ?",
            "Comment Revolut unifie-t-il le parcours client sur les canaux ?",
            "Quels r\u00e9sultats le d\u00e9ploiement produit-il ?",
        ],
        correction=(
            "1) CRM omnicanal :\n"
            "Gestion de la relation client int\u00e9grant tous les canaux "
            "(web, app, t\u00e9l\u00e9phone, agence) avec une vue client unique.\n\n"
            "2) Revolut :\n"
            f"{D}Identifiant unique, historique partag\u00e9, chatbot + escalade humaine.\n\n"
            "3) R\u00e9sultats :\n"
            f"{D}R\u00e9ponse 4 min, NPS 71, co\u00fbt contact \u221235 %."
        ),
        attendu="D\u00e9finition CRM omnicanal, m\u00e9canismes Revolut, trois r\u00e9sultats.",
        notions=["CRM omnicanal"],
    ),
    I(
        "e5",
        "Administration \u00e9lectronique chez l'APEC",
        support=(
            "L'APEC (Association pour l'emploi des cadres, 800 salari\u00e9s, "
            "700 000 cadres accompagn\u00e9s/an) digitalise ses services en 2024 :\n"
            "\u2014 espace cadre en ligne : CV, candidatures, prise de RDV conseiller ;\n"
            "\u2014 d\u00e9materialisation : 94 % des inscriptions sans papier ;\n"
            "\u2014 API France Travail : v\u00e9rification automatique du statut cadre ;\n"
            "\u2014 signature \u00e9lectronique des conventions de stage emploi.\n"
            "Avant 2020 : 40 % des d\u00e9marches n\u00e9cessitaient un d\u00e9placement "
            "en centre APEC. En 2024 : 12 %. Satisfaction usagers digitaux : 82/100."
        ),
        consigne=(
            "D\u00e9finis l'administration \u00e9lectronique (e-administration) "
            "et montre la transformation de l'APEC."
        ),
        questions=[
            "Qu'est-ce que l'e-administration ?",
            "Cite trois services d\u00e9mat\u00e9rialis\u00e9s par l'APEC.",
            "Que montrent les chiffres 40 % \u2192 12 % de d\u00e9placements ?",
        ],
        correction=(
            "1) E-administration :\n"
            "D\u00e9mat\u00e9rialisation des d\u00e9marches administratives "
            "accessibles en ligne aux usagers.\n\n"
            "2) Services APEC :\n"
            f"{D}Espace cadre en ligne, API France Travail, signature \u00e9lectronique.\n\n"
            "3) Interpr\u00e9tation :\n"
            f"{D}Fort recours au digital (94 % sans papier), "
            f"r\u00e9duction massive des d\u00e9placements physiques."
        ),
        attendu="D\u00e9finition e-admin, trois services, chiffres interpr\u00e9t\u00e9s.",
        notions=["e-administration", "d\u00e9mat\u00e9rialisation"],
    ),
    I(
        "e6",
        "Conduite du changement (Kotter) \u00e0 la Tr\u00e9sorerie de Paris",
        support=(
            "La Tr\u00e9sorerie de Paris (finances de la Ville de Paris, 320 agents) "
            "lance en 2024 un plan SI comptable sur 24 mois, calqu\u00e9 sur "
            "les 8 \u00e9tapes de Kotter :\n"
            "1. urgence : audit r\u00e9v\u00e8le 40 % de saisies manuelles et risque d'erreur ;\n"
            "2. coalition : chef de projet + 6 r\u00e9f\u00e9rents m\u00e9tiers ;\n"
            "3. vision : \u00ab z\u00e9ro papier comptable 2026 \u00bb ;\n"
            "4. communication : r\u00e9unions mensuelles, intranet, vid\u00e9os 3 min ;\n"
            "5. obstacles : formation de 280 agents, hotline d\u00e9di\u00e9e ;\n"
            "6. victoires rapides : pilote sur un service (budget) en 4 mois ;\n"
            "7-8. ancrage : nouvelles proc\u00e9dures inscrites au r\u00e8glement int\u00e9rieur.\n"
            "Bilan 12 mois : 65 % des \u00e9critures automatis\u00e9es (objectif 100 % en 2026)."
        ),
        consigne=(
            "Pr\u00e9sente le mod\u00e8le de Kotter et indique comment "
            "la Tr\u00e9sorerie de Paris l'applique."
        ),
        questions=[
            "Combien d'\u00e9tapes compte le mod\u00e8le de Kotter ? Cite les trois premi\u00e8res.",
            "Quelles actions concr\u00e8tes la Tr\u00e9sorerie m\u00e8ne-t-elle aux \u00e9tapes 5 et 6 ?",
            "Quel progr\u00e8s chiffr\u00e9 apr\u00e8s 12 mois ?",
        ],
        correction=(
            "1) Kotter (8 \u00e9tapes) :\n"
            "1 Cr\u00e9er l'urgence \u2014 2 Coalition \u2014 3 Vision "
            "(puis communication, lever obstacles, victoires rapides, ancrage).\n\n"
            "2) \u00c9tapes 5-6 Tr\u00e9sorerie :\n"
            f"{D}\u00c9tape 5 : formation 280 agents, hotline.\n"
            f"{D}\u00c9tape 6 : pilote budget en 4 mois (victoire rapide).\n\n"
            "3) Progr\u00e8s :\n"
            f"{D}65 % \u00e9critures automatis\u00e9es (sur objectif z\u00e9ro papier 2026)."
        ),
        attendu="Kotter rappel\u00e9, \u00e9tapes 5-6 appliqu\u00e9es, progr\u00e8s chiffr\u00e9.",
        notions=["Kotter", "conduite du changement"],
    ),
    I(
        "e7",
        "R\u00e9sistances au changement chez la Nef",
        support=(
            "La Nef (Nouvelle \u00c9conomie Fraternelle, banque \u00e9thique, "
            "120 salari\u00e9s) d\u00e9ploie un nouveau SI de gestion des dossiers "
            "de pr\u00eat en 2024. R\u00e9sistances observ\u00e9es :\n"
            "\u2014 crainte de d\u00e9shumanisation : \u00ab on ne conna\u00eet plus nos porteurs "
            "de projet \u00bb (analystes cr\u00e9dit) ;\n"
            "\u2014 peur de la perte de comp\u00e9tences : 45 % des agents > 50 ans ;\n"
            "\u2014 habitudes : Excel utilis\u00e9 depuis 15 ans pour le scoring ;\n"
            "\u2014 taux d'adoption SI : 58 % \u00e0 M+3 (objectif 90 %).\n"
            "Actions : 8 ateliers co-construction, bin\u00f4mes junior/senior, "
            "maintien Excel en parall\u00e8le 6 mois (p\u00e9riode de transition)."
        ),
        consigne=(
            "Identifie les types de r\u00e9sistances au changement chez la Nef "
            "et les leviers activ\u00e9s pour les r\u00e9duire."
        ),
        questions=[
            "Qu'est-ce que la r\u00e9sistance au changement ?",
            "Cite trois formes de r\u00e9sistance observ\u00e9es \u00e0 la Nef.",
            "Quelles actions la direction met-elle en place ?",
        ],
        correction=(
            "1) R\u00e9sistance au changement :\n"
            "Opposition ou lenteur \u00e0 adopter une nouvelle organisation, "
            "un outil ou une m\u00e9thode de travail.\n\n"
            "2) R\u00e9sistances Nef :\n"
            f"{D}Crainte d\u00e9shumanisation.\n"
            f"{D}Peur perte de comp\u00e9tences (agents seniors).\n"
            f"{D}Attachement aux habitudes (Excel).\n\n"
            "3) Leviers :\n"
            f"{D}Ateliers co-construction, bin\u00f4mes junior/senior, "
            f"p\u00e9riode de transition (Excel maintenu 6 mois)."
        ),
        attendu="D\u00e9finition, trois r\u00e9sistances, trois leviers.",
        notions=["r\u00e9sistances au changement"],
    ),
    I(
        "e8",
        "Transformation SI chez PayPal France",
        support=(
            "PayPal France migre en 2024 son infrastructure de paiement "
            "vers le cloud (AWS) en 18 mois :\n"
            "\u2014 phase 1 : audit SI legacy (serveurs on-premise, 12 syst\u00e8mes) ;\n"
            "\u2014 phase 2 : migration progressive par microservices ;\n"
            "\u2014 phase 3 : tests de charge (Black Friday simul\u00e9 : 4 200 transactions/s) ;\n"
            "\u2014 budget : 28 M\u20ac, \u00e9quipe projet 85 personnes (IT + m\u00e9tiers).\n"
            "R\u00e9sultats : disponibilit\u00e9 plateforme 99,97 % (contre 99,2 %), "
            "temps de d\u00e9ploiement nouvelles fonctionnalit\u00e9s : 2 semaines "
            "(contre 3 mois). Incident majeur pendant migration : 0."
        ),
        consigne=(
            "Qu'est-ce qu'une transformation SI ? Analyse le projet "
            "PayPal selon ses phases et r\u00e9sultats."
        ),
        questions=[
            "D\u00e9finis transformation du syst\u00e8me d'information (SI).",
            "Quelles sont les trois phases du projet PayPal ?",
            "Quels r\u00e9sultats chiffr\u00e9s montrent la r\u00e9ussite de la migration ?",
        ],
        correction=(
            "1) Transformation SI :\n"
            "Modernisation de l'architecture informatique (cloud, microservices, "
            "data) pour am\u00e9liorer performance, agilit\u00e9 et s\u00e9curit\u00e9.\n\n"
            "2) Phases PayPal :\n"
            f"{D}Audit legacy \u2192 migration microservices \u2192 tests de charge.\n\n"
            "3) R\u00e9sultats :\n"
            f"{D}Disponibilit\u00e9 99,97 %, d\u00e9ploiement 3 mois \u2192 2 semaines, "
            f"0 incident majeur."
        ),
        attendu="D\u00e9finition SI, trois phases, trois r\u00e9sultats.",
        notions=["transformation SI", "cloud"],
    ),
    I(
        "e9",
        "Agilit\u00e9 organisationnelle chez Stripe",
        support=(
            "Stripe (paiements en ligne, 8 000 salari\u00e9s dans le monde) "
            "organise ses \u00e9quipes produit en mode agile en 2024 :\n"
            "\u2014 squads de 6-8 personnes (dev, product, design) autonomes ;\n"
            "\u2014 sprints de 2 semaines, r\u00e9tro et demo \u00e0 chaque fin de sprint ;\n"
            "\u2014 OKR trimestriels (Objectives and Key Results) par squad ;\n"
            "\u2014 \u00e9chec accept\u00e9 : 3 produits abandonn\u00e9s en 2024 "
            "apr\u00e8s test march\u00e9 (fail fast).\n"
            "Indicateurs : time-to-market nouvelle API : 6 semaines "
            "(contre 5 mois en cycle waterfall avant 2022), "
            "satisfaction d\u00e9veloppeurs 8,6/10."
        ),
        consigne=(
            "D\u00e9finis l'agilit\u00e9 organisationnelle et montre "
            "comment Stripe la pratique."
        ),
        questions=[
            "Qu'est-ce que l'agilit\u00e9 organisationnelle ?",
            "Cite trois pratiques agiles de Stripe.",
            "Que montre la r\u00e9duction du time-to-market (5 mois \u2192 6 semaines) ?",
        ],
        correction=(
            "1) Agilit\u00e9 organisationnelle :\n"
            "Capacit\u00e9 \u00e0 s'adapter rapidement aux changements du march\u00e9 "
            "par des \u00e9quipes autonomes, it\u00e9ratives et orient\u00e9es client.\n\n"
            "2) Pratiques Stripe :\n"
            f"{D}Squads autonomes, sprints 2 semaines, OKR trimestriels.\n\n"
            "3) Time-to-market :\n"
            f"{D}L'agilit\u00e9 r\u00e9duit drastiquement le d\u00e9lai de mise sur le march\u00e9 "
            f"(fail fast sur 3 produits abandonn\u00e9s)."
        ),
        attendu="D\u00e9finition agilit\u00e9, trois pratiques, interpr\u00e9tation time-to-market.",
        notions=["agilit\u00e9", "squads", "OKR"],
    ),
    I(
        "e10",
        "Synth\u00e8se transformation num\u00e9rique \u00e0 la DGFiP",
        support=(
            "La DGFiP (Direction g\u00e9n\u00e9rale des Finances publiques, "
            "140 000 agents) m\u00e8ne depuis 2020 la transformation num\u00e9rique "
            "\u00ab DGFiP 2025 \u00bb :\n"
            "\u2014 pr\u00e9l\u00e8vement \u00e0 la source : 100 % des d\u00e9clarations en ligne ;\n"
            "\u2014 messagerie s\u00e9curis\u00e9e : 28 M de messages usagers/an ;\n"
            "\u2014 d\u00e9tection fraude par IA : 2,4 M d'alertes trait\u00e9es en 2024 ;\n"
            "\u2014 formation : 45 000 agents form\u00e9s au num\u00e9rique ;\n"
            "\u2014 r\u00e9sistances : gr\u00e8ve partielle septembre 2023 ( réforme "
            "des centres des finances publiques).\n"
            "Indicateurs : d\u00e9lai traitement d\u00e9claration 12 jours "
            "(contre 28 en 2018), satisfaction usagers 76/100."
        ),
        consigne=(
            "Synth\u00e9tise la transformation num\u00e9rique DGFiP : "
            "enjeux, outils, r\u00e9sistances et r\u00e9sultats."
        ),
        questions=[
            "Cite trois outils ou services num\u00e9riques de la DGFiP.",
            "Quelle r\u00e9sistance le support mentionne-t-il ?",
            "Quels r\u00e9sultats montrent l'efficacit\u00e9 de la transformation ?",
        ],
        correction=(
            "1) Outils DGFiP :\n"
            f"{D}Pr\u00e9l\u00e8vement \u00e0 la source en ligne, messagerie s\u00e9curis\u00e9e, "
            f"IA anti-fraude.\n\n"
            "2) R\u00e9sistance :\n"
            f"{D}Gr\u00e8ve partielle 2023 sur la r\u00e9forme des centres "
            f"(peur restructuration, changement m\u00e9tiers).\n\n"
            "3) R\u00e9sultats :\n"
            f"{D}D\u00e9lai 28 \u2192 12 jours, satisfaction 76/100, "
            f"45 000 agents form\u00e9s."
        ),
        attendu="Trois outils, r\u00e9sistance cit\u00e9e, r\u00e9sultats chiffr\u00e9s.",
        notions=["transformation num\u00e9rique", "e-administration", "IA"],
    ),
    I(
        "cas1",
        "\u00c9tude de cas : fermeture d'agences \u2014 avis AMF",
        support=(
            "En f\u00e9vrier 2025, l'AMF (Autorit\u00e9 des march\u00e9s financiers) "
            "publie une alerte sur la fermeture acc\u00e9l\u00e9r\u00e9e d'agences bancaires :\n"
            "\u2014 1 700 fermetures nettes en France en 2024 (\u22124,2 % du r\u00e9seau) ;\n"
            "\u2014 zones rurales : 18 % des communes sans agence ni guichet automatique "
            "d\u00e9di\u00e9 aux particuliers ;\n"
            "\u2014 clients seniors : 34 % n'utilisent jamais l'application mobile ;\n"
            "\u2014 risque : exclusion bancaire, recours accru au cash (co\u00fbt social).\n"
            "Cas \u00e9tudi\u00e9 : une banque r\u00e9gionale ferme 45 agences sur 320 en 2024-2025, "
            "propose des \u00ab conseillers itin\u00e9rants \u00bb et des bornes en mairie. "
            "AMF recommande : \u00e9valuation d'impact territorial obligatoire, "
            "maintien d'un point de contact humain par canton."
        ),
        consigne=(
            "Analyse les enjeux de la fermeture d'agences pour le parcours client "
            "et la transformation num\u00e9rique. Que recommande l'AMF ?"
        ),
        questions=[
            "Quels chiffres de l'AMF montrent un risque d'exclusion ?",
            "Pourquoi la fermeture d'agences pose-t-elle probl\u00e8me pour le parcours RO PO ?",
            "Quelles mesures de substitution la banque r\u00e9gionale propose-t-elle ?",
            "Soutiens-tu la recommandation AMF ? Argumente.",
        ],
        correction=(
            "1) Risque exclusion :\n"
            f"{D}18 % communes sans agence, 34 % seniors sans app mobile.\n\n"
            "2) Probl\u00e8me RO PO :\n"
            f"{D}Le PO (achat/conseil en agence) dispara\u00eet pour des clients "
            f"qui ne compensent pas par le digital.\n\n"
            "3) Substitutions banque :\n"
            f"{D}Conseillers itin\u00e9rants, bornes en mairie.\n\n"
            "4) Recommandation AMF :\n"
            f"{D}Oui : \u00e9tude d'impact + contact humain par canton "
            f"pour \u00e9viter exclusion et pr\u00e9server la confiance bancaire."
        ),
        attendu="Chiffres AMF, lien RO PO, mesures banque, avis argument\u00e9 sur AMF.",
        notions=["parcours client", "transformation num\u00e9rique", "inclusion"],
    ),
    I(
        "cas2",
        "\u00c9tude de cas : IA \u00e9thique \u2014 rapport Banque de France",
        support=(
            "La Banque de France publie en avril 2025 un rapport sur l'IA "
            "dans le secteur bancaire :\n"
            "\u2014 78 % des grandes banques utilisent l'IA pour le scoring cr\u00e9dit "
            "ou la d\u00e9tection de fraude ;\n"
            "\u2014 risque de biais : un algorithme test\u00e9 refuse 12 % de dossiers "
            "en quartiers prioritaires vs 4 % ailleurs (\u00e0 profil \u00e9quivalent) ;\n"
            "\u2014 explicabilit\u00e9 : 62 % des clients veulent comprendre "
            "un refus de cr\u00e9dit automatis\u00e9 ;\n"
            "\u2014 cadre : r\u00e8glement europ\u00e9en AI Act (2024), "
            "devoir de transparence pour les d\u00e9cisions automatis\u00e9es.\n"
            "Recommandations Banque de France : audit ind\u00e9pendant des algorithmes, "
            "recours humain obligatoire en cas de refus, formation des \u00e9quipes "
            "compliance. Budget moyen audit : 450 000 \u20ac/banque."
        ),
        consigne=(
            "Analyse les enjeux \u00e9thiques de l'IA bancaire et \u00e9value "
            "les recommandations de la Banque de France."
        ),
        questions=[
            "Quels usages de l'IA le rapport cite-t-il ?",
            "Quel biais l'algorithme de scoring r\u00e9v\u00e8le-t-il ?",
            "Pourquoi 62 % des clients exigent-ils de l'explicabilit\u00e9 ?",
            "Les trois recommandations Banque de France sont-elles pertinentes ?",
        ],
        correction=(
            "1) Usages IA :\n"
            f"{D}Scoring cr\u00e9dit, d\u00e9tection fraude (78 % des grandes banques).\n\n"
            "2) Biais :\n"
            f"{D}Discrimination g\u00e9ographique : 12 % refus QPV vs 4 % ailleurs "
            f"\u00e0 profil \u00e9quivalent.\n\n"
            "3) Explicabilit\u00e9 :\n"
            f"{D}Confiance, droit \u00e0 comprendre une d\u00e9cision (AI Act, RGPD).\n\n"
            "4) Recommandations :\n"
            f"{D}Pertinentes : audit (450 k\u20ac), recours humain, formation compliance "
            f"= pr\u00e9venir biais et pr\u00e9server la confiance dans la transformation num\u00e9rique."
        ),
        attendu="Usages IA, biais chiffr\u00e9, explicabilit\u00e9, recommandations \u00e9valu\u00e9es.",
        notions=["IA \u00e9thique", "biais algorithmique", "AI Act"],
    ),
]
