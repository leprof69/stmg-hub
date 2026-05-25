# -*- coding: utf-8 -*-
"""Chapitre 8 - L'influence du numérique sur l'organisation du travail."""

CHAPTER = 8

EXERCISES = [
    {
        "id": "e1",
        "title": "La notion de processus de gestion",
        "support": (
            "La PME logistique « Express Nord » traite chaque jour 1 200 commandes e-commerce "
            "pour des clients B2B. Le processus « traiter une commande » mobilise successivement : "
            "le service commercial (validation du bon de commande), le stock (préparation colis), "
            "la logistique (expédition) et la comptabilité (facturation). Certaines étapes sont "
            "automatisées via un logiciel de gestion d'entrepôt (WMS) : génération automatique du "
            "bon de préparation dès validation du paiement. Le directeur des opérations explique "
            "que ce processus part d'un besoin client (« livrer la marchandise commandée ») et "
            "aboutit à un résultat mesurable (colis expédié sous 48 h, facture émise). Des acteurs "
            "de quatre services différents interviennent, mais la base de données unique du WMS "
            "assure la continuité de l'information."
        ),
        "consigne": (
            "À partir du support, définis la notion de processus de gestion et explique comment "
            "elle représente l'organisation du travail chez Express Nord. Mobilise les notions "
            "processus, acteurs, automatisation et résultat."
        ),
        "questions": [
            "Qu'est-ce qu'un processus de gestion selon le manuel ?",
            "Identifie dans le texte les acteurs, les activités et le résultat du processus.",
            "Quel rôle joue l'automatisation (WMS) dans ce processus ?",
        ],
        "correctionModele": (
            "1) Définition du processus :\n"
            "Un processus est un enchaînement d'activités (opérations) complémentaires réalisées "
            "par un ou plusieurs acteurs appartenant à différents services. À partir d'un besoin, "
            "il permet d'obtenir un résultat en mobilisant des ressources. Une partie des opérations "
            "peut être automatisée.\n\n"
            "2) Éléments chez Express Nord :\n"
            "- Acteurs : commercial, stock, logistique, comptabilité.\n"
            "- Activités : validation commande, préparation, expédition, facturation.\n"
            "- Besoin : livrer la marchandise commandée.\n"
            "- Résultat : colis expédié sous 48 h, facture émise.\n\n"
            "3) Automatisation :\n"
            "Le WMS génère automatiquement le bon de préparation après validation du paiement. "
            "Cela accélère le flux, réduit les erreurs de saisie et structure l'organisation du "
            "travail autour d'un système d'information partagé."
        ),
        "attendu": "Définition du cours, repérage précis dans le support, lien SI / organisation du travail.",
        "notions": ["Définition du cours", "repérage précis dans le support", "lien SI / organisation du travail."],
        "minChars": 130,
    },
    {
        "id": "e2",
        "title": "Schéma événement-résultat",
        "support": (
            "Le service achats de Renault Trucks modelise le processus « traiter une commande "
            "fournisseur » avec un schéma événement-résultat. L'événement déclencheur initial est "
            "« besoin de réapprovisionnement détecté ». L'activité « passer commande fournisseur » "
            "produit deux issues possibles (règles d'émission) : soit « commande validée », soit "
            "« commande refusée (budget insuffisant) ». L'événement-résultat « commande validée » "
            "d\u00e9clenche l'activit\u00e9 suivante \u00ab r\u00e9ceptionner la livraison \u00bb. Un tableau d'analyse a \u00e9t\u00e9 r\u00e9alis\u00e9 en amont pour distinguer formellement d\u00e9clencheurs, activit\u00e9s et "
            "\u00e9v\u00e9nements-r\u00e9sultats avant de param\u00e9trer le PGI."
        ),
        "consigne": (
            "Explique la logique du schéma événement-résultat en t'appuyant sur l'exemple Renault "
            "Trucks. Utilise le tableau ci-dessous pour structurer ta réponse."
        ),
        "questions": [
            "Qu'est-ce qu'un événement déclencheur et un événement-résultat ?",
            "Complète le tableau : relie chaque ligne du support au bon type d'élément.",
            "Pourquoi réaliser un tableau d'analyse avant d'implanter un PGI ?",
        ],
        "supportTables": [
            {
                "title": "Tableau d'analyse du processus (à compléter dans ta copie)",
                "columns": ["Élément", "Exemple dans le support"],
                "rows": [
                    ["Événement déclencheur", "Besoin de réapprovisionnement détecté"],
                    ["Activité", "Passer commande fournisseur / Réceptionner livraison"],
                    ["Règle d'émission", "Commande validée OU refusée (budget)"],
                    ["Événement-résultat", "Commande validée ? déclenche reception"],
                ],
            }
        ],
        "correctionModele": (
            "1) Événements :\n"
            "L'événement déclencheur lance une activité (ici : besoin de réapprovisionnement). "
            "L'événement-résultat est l'issue d'une activité et devient declencheur de l'activité "
            "suivante (commande validée ? reception).\n\n"
            "2) Tableau :\n"
            "Déclencheur : besoin détecté. Activité 1 : passer commande. Règles : validée / refusée. "
            "Résultat : commande validée. Activité 2 : réceptionner.\n\n"
            "3) Intérêt du tableau avant PGI :\n"
            "Il formalise le processus, clarifie les enchaînements et les acteurs, et permet de "
            "configurer correctement le progiciel. Sans cette analyse, le PGI risque de rigidifier "
            "des pratiques mal définies."
        ),
        "attendu": "Vocabulaire exact du manuel, tableau exploité, lien avec modélisation SI.",
        "notions": ["Vocabulaire exact du manuel", "tableau exploit\u00e9", "lien avec mod\u00e9lisation SI."],
        "minChars": 150,
    },
    {
        "id": "e3",
        "title": "SI structurant et rigidité des processus",
        "support": (
            "Dans une banque régionale, le PGI impose un circuit de validation des dossiers de "
            "crédit en cinq écrans obligatoires. Les conseillers estiment que deux étapes pourraient "
            "être fusionnées, mais le logiciel ne le permet pas sans refonte du paramétrage. "
            "Paradoxalement, le m\u00eame PGI a supprim\u00e9 les doubles saisies entre agence et si\u00e8ge : "
            "les données client sont saisies une seule fois et mises à jour en temps réel. La "
            "direction affirme que le système d'information « structure » l'organisation : il "
            "détermine qui fait quoi, dans quel ordre, et quelles informations circulent entre "
            "les services. L'automatisation des relances (e-mails si pièce manquante) a réduit "
            "de 20 % le délai moyen de traitement, mais les conseillers regrettent une perte "
            "de flexibilité relationnelle avec certains clients fragiles."
        ),
        "consigne": (
            "Analyse les effets du numérique sur l'organisation du travail dans cette banque : "
            "avantages et contraintes. Mobilise les notions de système d'information structurant, "
            "automatisation et rôle des acteurs."
        ),
        "questions": [
            "En quoi le PGI est-il un syst\u00e8me structurant pour l'organisation ?",
            "Cite un avantage et une contrainte illustr\u00e9s par le support.",
            "Comment le numérique modifie-t-il le rôle des conseillers clients ?",
        ],
        "correctionModele": (
            "1) SI structurant :\n"
            "Le PGI modelise l'organisation du travail : encha\u00eenement impos\u00e9, circulation de "
            "l'information, r\u00f4les d\u00e9finis. Il peut g\u00e9n\u00e9rer des modes de fonctionnement rigides.\n\n"
            "2) Avantage / contrainte :\n"
            "- Avantage : suppression double saisie, mise à jour temps réel, relances automatiques "
            "(−20 % délai).\n"
            "- Contrainte : cinq écrans obligatoires, peu de flexibilité pour adapter le circuit.\n\n"
            "3) Rôle des acteurs :\n"
            "Les conseillers exécutent un processus cadre par le logiciel ; leur marge de manœuvre "
            "relationnelle diminue sur certains dossiers, même si ils gagnent en efficacité "
            "administrative."
        ),
        "attendu": "Analyse équilibrée, vocabulaire chapitre 8, exemples tires du support.",
        "notions": ["Analyse équilibrée", "vocabulaire chapitre 8", "exemples tires du support."],
        "minChars": 160,
    },
    {
        "id": "e4",
        "title": "Le progiciel de gestion integre (PGI)",
        "support": (
            "L'entreprise agroalimentaire Andros déploie SAP (PGI) pour intégrer comptabilité, "
            "achats, production et ventes. Tous les modules partagent une base de données unique "
            "hébergée sur le serveur du siège. Chaque utilisateur se connecté avec identifiant "
            "et mot de passe ; les acheteurs peuvent créer et modifier des commandes, les "
            "comptables peuvent seulement interroger et valider. La direction met en avant "
            "qu'une commande client saisie une fois alimente automatiquement la production "
            "planifiee et la facturation, sans ressaisie."
        ),
        "consigne": (
            "Présente le PGI et ses avantages en t'appuyant sur le cas Andros. Précise le rôle "
            "des droits d'accès (création, interrogation, modification, suppression)."
        ),
        "questions": [
            "Qu'est-ce qu'un PGI ? Quelles applications métiers regroupe-t-il ici ?",
            "Explique les avantages de la base de données unique et de la saisie unique.",
            "A quoi servent les droits d'accès differencies entre acheteurs et comptables ?",
        ],
        "correctionModele": (
            "1) Définition PGI :\n"
            "Le progiciel de gestion intégré regroupe plusieurs applications métiers (comptabilité, "
            "achats, production, ventes) sur une base unique, installé en réseau.\n\n"
            "2) Avantages :\n"
            "- Données saisies une seule fois, mises à jour en temps réel.\n"
            "- Gain de temps, meilleure efficacité, cohérence entre services.\n"
            "- Enchainement automatique commande ? production ? facturation.\n\n"
            "3) Droits d'accès :\n"
            "Ils sécurisent l'information : chaque profil n'accède qu'aux fonctions nécessaires "
            "(CRUD : création, interrogation, modification, suppression), limitant erreurs et fraudes."
        ),
        "attendu": "Définition complète, avantages illustres, sécurité et droits d'accès.",
        "notions": ["Définition complète", "avantages illustres", "sécurité et droits d'accès."],
        "minChars": 150,
    },
    {
        "id": "e5",
        "title": "Contraintes de mise en place d'un PGI",
        "support": (
            "La PME textile \u00ab Laine du Morvan \u00bb (85 salari\u00e9s) budgete 420 000 \u20ac pour impl\u00e9menter "
            "un PGI sur 18 mois. Le cabinet conseil estime que 40 % du budget servira à "
            "repenser les processus (atelier, approvisionnement, SAV) avant paramétrage. "
            "Plusieurs chefs d'atelier résistent : « on a toujours fait comme ça ». "
            "La direction anticipe une période ou production et facturation seront ralenties "
            "pendant la bascule. Le manuel rappelle que le coût d'acquisition est élevé et que "
            "l'implantation peut être longue si l'organisation ne réorganise pas ses pratiques."
        ),
        "consigne": (
            "Identifie les contraintes de mise en place du PGI et propose des actions pour "
            "faciliter l'adoption. Mobilise réorganisation des processus, coût et conduite du changement."
        ),
        "questions": [
            "Quelles contraintes du manuel retrouves-tu dans le cas Laine du Morvan ?",
            "Pourquoi faut-il repenser les processus avant d'installer le PGI ?",
            "Propose deux actions concretes pour limiter la resistance au changement.",
        ],
        "correctionModele": (
            "1) Contraintes :\n"
            "- Co\u00fbt \u00e9lev\u00e9 (420 000 \u20ac).\n"
            "- Dur\u00e9e longue (18 mois).\n"
            "- R\u00e9organisation obligatoire des processus actuels.\n"
            "- Ralentissement temporaire de l'activité à la bascule.\n"
            "- Résistance humaine des chefs d'atelier.\n\n"
            "2) Repenser les processus :\n"
            "Le PGI impacte les pratiques : sans réflexion amont, on automatise l'inefficacité. "
            "La modélisation (schémas événement-résultat) précède le paramétrage.\n\n"
            "3) Actions :\n"
            "- Communication et formation des chefs d'atelier, implication dans la conception.\n"
            "- Pilote sur un atelier, accompagnement changement, quick wins visibles."
        ),
        "attendu": "Contraintes du cours + cas, solutions réalistes de conduite du changement.",
        "notions": ["Contraintes du cours + cas"],
        "minChars": 170,
    },
    {
        "id": "e6",
        "title": "E-commerce et m-commerce",
        "support": (
            "Fnac Darty réalise 38 % de son chiffre d'affaires via le e-commerce (site fnac.com "
            "accessible sur ordinateur). Son application mobile « Fnac & moi » permet d'acheter "
            "en m-commerce : le support est le smartphone connecté à Internet, avec paiement "
            "Apple Pay et suivi de commande en temps réel. En 2024, le trafic mobile dépasse "
            "le desktop le week-end. Le directeur digital rappelle que le m-commerce est une "
            "branche du e-commerce lorsque l'utilisateur passe par un terminal mobile."
        ),
        "consigne": (
            "Distingue e-commerce et m-commerce en t'appuyant sur Fnac Darty. Explique les "
            "implications pour l'organisation du travail (logistique, SAV, marketing digital)."
        ),
        "questions": [
            "Définis e-commerce et m-commerce avec l'exemple Fnac Darty.",
            "Quelle différence entre achat sur fnac.com (PC) et sur l'application mobile ?",
            "Quels impacts sur l'organisation du travail (deux exemples) ?",
        ],
        "correctionModele": (
            "1) Définitions :\n"
            "- E-commerce : transactions commerciales en ligne via un support numérique connecté "
            "à Internet (site web sur ordinateur).\n"
            "- M-commerce : branche du e-commerce via support mobile (smartphone, application).\n\n"
            "2) Différence supports :\n"
            "Même transaction commerciale, mais canal et ergonomie differents ; l'app mobile "
            "facilite achat impulsif, géolocalisation, notifications.\n\n"
            "3) Impacts organisation :\n"
            "- Logistique : pics de commandes le week-end, préparation colis accrue.\n"
            "- Marketing / SI : équipes dédiées à l'app, maintenance, données de navigation mobile."
        ),
        "attendu": "Définitions precises, distinction claire, impacts organisation concrets.",
        "notions": ["Définitions precises", "claire", "impacts organisation concrets."],
        "minChars": 160,
    },
    {
        "id": "e7",
        "title": "Site de marché et enchères en ligne",
        "support": (
            "Sur la plateforme Catawiki, un collectionneur met en vente une montre vintage. "
            "Les ench\u00e8res durent sept jours. \u00c0 la cl\u00f4ture, l'acqu\u00e9reur est l'ench\u00e9risseur ayant "
            "propose le prix le plus élevé (2 450 €). Catawiki prélève une commission de 12 % "
            "sur le prix final. Le vendeur n'a pas de magasin physique : toute la transaction "
            "passe par le site de marché. Le processus combine automatisation (compteur temps "
            "r\u00e9el, notifications e-mail) et intervention humaine (expertise authentification "
            "de la montre avant mise en ligne)."
        ),
        "consigne": (
            "Explique le fonctionnement d'un site de marché par les enchères en ligne. "
            "Relie processus, automatisation et rôle des acteurs."
        ),
        "questions": [
            "Qu'est-ce qu'un site de marché selon le manuel ? Comment se déroule l'enchère ?",
            "Quelles parties du processus sont automatisées chez Catawiki ?",
            "Quel risque pour l'acheteur si l'expertise n'est pas réalisée ?",
        ],
        "correctionModele": (
            "1) Site de marché :\n"
            "Commerce base sur l'enchère d'un bien dans un temps imparti ; l'acquéreur est celui "
            "dont l'offre est la plus élevée a la clôture.\n\n"
            "2) Automatisation :\n"
            "Compteur temps réel, notifications, enregistrement des offres, calcul commission - "
            "réduit le travail manuel. L'expertise reste humaine (contrôle qualité).\n\n"
            "3) Risque sans expertise :\n"
            "Acheteur pourrait payer un prix élevé pour un bien non conforme ; atteinte confiance "
            "et e-reputation de la plateforme."
        ),
        "attendu": "Définition enchère en ligne, processus événement-résultat implicite, analyse risque.",
        "notions": ["Définition enchère en ligne", "processus événement-résultat implicite", "analyse risque."],
        "minChars": 150,
    },
    {
        "id": "e8",
        "title": "Télétravail et organisation",
        "support": (
            "Le cabinet de conseil « Altitude RH » (220 consultants) a adopté une charte "
            "télétravail : deux jours par semaine à domicile, trois jours au siège parisien. "
            "Les consultants accèdent au PGI et aux dossiers clients via un VPN sécurisé. "
            "La direction note une meilleure attractivité RH, mais aussi des difficultes "
            "de coordination sur les projets transverses nécessitant créativité collective. "
            "Le télétravail permet de travailler à distance de l'organisation, comme le rappelle "
            "le manuel, à condition que le système d'information garantisse sécurité et transmission."
        ),
        "consigne": (
            "Analyse les opportunites et limites du télétravail chez Altitude RH. Mobilise "
            "télétravail, système d'information, sécurité des données."
        ),
        "questions": [
            "Définis le télétravail et explique comment il est organise ici.",
            "Quelles conditions du manuel sont remplies (ou à renforcer) pour le SI ?",
            "Un avantage et une limite pour l'organisation ?",
        ],
        "correctionModele": (
            "1) Télétravail :\n"
            "Travail à distance de l'organisation (ici 2 j/sem domicile), tendance a se developper.\n\n"
            "2) Conditions SI :\n"
            "VPN = sécurité et accès distant aux données ; à renforcer : charte RGPD, formation "
            "phishing, équipements homologués.\n\n"
            "3) Avantage / limite :\n"
            "- Avantage : attractivité RH, flexibilité.\n"
            "- Limite : coordination projets creatifs, lien social affaibli."
        ),
        "attendu": "Definition, SI et sécurité, arbitrage organisationnel argumente.",
        "notions": ["Definition", "SI et sécurité", "arbitrage organisationnel argumente."],
        "minChars": 160,
    },
    {
        "id": "e9",
        "title": "Mobilité professionnelle et SI",
        "support": (
            "Les 140 techniciens SAV de Bosch Thermotechnologie interviennent chez les "
            "particuliers avec une tablette professionnelle : consultation historique chaudière, "
            "saisie du compte-rendu d'intervention, commande de pièces en temps réel. "
            "Le siège met à jour le planning chaque matin via le même logiciel. "
            "Le manuel indique que certains métiers obligent les salariés a être mobiles ; "
            "le SI doit alors assurer transmission et sécurité des données sur le terrain."
        ),
        "consigne": (
            "Montre en quoi la mobilité transforme l'organisation du travail et le rôle du SI. "
            "Compare avec le télétravail (une différence, une similitude)."
        ),
        "questions": [
            "En quoi les techniciens Bosch sont-ils des acteurs mobiles ?",
            "Quelles fonctions du SI sont indispensables sur le terrain ?",
            "Différence et similitude avec le télétravail.",
        ],
        "correctionModele": (
            "1) Mobilité :\n"
            "Travail chez le client, pas au siège ; tablette = terminal mobile connecté.\n\n"
            "2) Fonctions SI :\n"
            "Consultation données, saisie intervention, commande pièces, synchro planning - "
            "transmission temps réel et sécurisation des accès.\n\n"
            "3) Comparaison télétravail :\n"
            "- Similitude : travail hors locaux, dépendance au numérique.\n"
            "- Différence : mobilité = deplacement professionnel terrain ; télétravail = domicile fixe."
        ),
        "attendu": "Mobilité bien définie, SI adapte, comparaison pertinente.",
        "notions": ["Mobilité bien définie", "SI adapte", "comparaison pertinente."],
        "minChars": 150,
    },
    {
        "id": "e10",
        "title": "Intelligence artificielle et cloud computing",
        "support": (
            "La start-up « GreenInvoice » utilise Microsoft 365 (cloud computing) pour stocker "
            "contrats et factures sur des serveurs distants accessibles via Internet. "
            "L'IA intégrée propose une catégorisation automatique des dépenses et alerte "
            "si un fournisseur devient récurrent. Le fondateur indique que l'IA analyse "
            "d'importants volumes de données pour gérer des taches opérationnelles quotidiennes "
            "en autonomie, tandis que le cloud évite d'acheter un serveur physique. "
            "Il reste vigilant : les données clients sont hébergées chez un opérateur américain, "
            "soumises au RGPD et aux clauses contractuelles de confidentialité."
        ),
        "consigne": (
            "Définis intelligence artificielle et cloud computing, puis analyse leurs effets "
            "sur l'organisation du travail et les precautions à prendre."
        ),
        "questions": [
            "Définis IA et cloud computing avec l'exemple GreenInvoice.",
            "Quels gains pour l'organisation du travail ?",
            "Quelles precautions (données, reglementation) ?",
        ],
        "correctionModele": (
            "1) Définitions :\n"
            "- IA : algorithmes analysant de grandes quantités de données pour automatiser "
            "taches opérationnelles (catégorisation dépenses, alertes).\n"
            "- Cloud : stockage et traitement sur serveurs distants en ligne, sans serveur local.\n\n"
            "2) Gains organisation :\n"
            "Gain de temps comptable, decisions plus rapides, scalabilite sans investissement "
            "matériel lourd.\n\n"
            "3) Précautions :\n"
            "RGPD, localisation hébergeur, contrats, sauvegardes, contrôle humain des decisions IA."
        ),
        "attendu": "Définitions manuel, gains et risques, RGPD mentionné.",
        "notions": ["Définitions manuel", "gains et risques", "RGPD mentionné."],
        "minChars": 170,
    },
    {
        "id": "cas1",
        "title": "Étude de cas : déploiement PGI chez Medisport",
        "support": (
            "Medisport (120 salariés) distribue du matériel sportif aux clubs. Avant PGI, "
            "chaque service tenait un fichier Excel ; les délais de facturation atteignaient "
            "12 jours. Le projet « Odoo » (PGI open source) vise : base unique, processus "
            "commande client formalisé (événement « commande web » ? préparation ? expédition "
            "? facture), droits d'accès par profil. Budget 280 000 € sur 14 mois dont 90 000 € "
            "conseil processus. Le comité de pilotage doit trancher : garder un atelier de "
            "reparation sans passer par le PGI (habitude) ou l'intégrer pour tracer les pièces détachées."
        ),
        "consigne": (
            "Rédige une étude de cas structuree (intro, diagnostic, schéma processus, avantages "
            "et contraintes PGI, recommandation). Mobilise toutes les notions du chapitre 8."
        ),
        "questions": [
            "Diagnostic : quels problemes l'ancien systeme provoquait-il ?",
            "Propose un enchaînement événement-résultat simplifie pour une commande web.",
            "Analyse avantages et contraintes du projet Odoo pour Medisport.",
            "Recommandation : faut-il intégrer l'atelier reparation au PGI ? Argumente.",
        ],
        "correctionModele": (
            "1) Diagnostic :\n"
            "Fichiers Excel isolés ? doubles saisies, lenteur facturation (12 j), manque "
            "de vision globale, risques d'erreurs.\n\n"
            "2) Schéma simplifie :\n"
            "Déclencheur : commande web validée ? Activité : préparer colis ? Résultat : "
            "colis prêt ? Activité : facturer ? Résultat : facture émise.\n\n"
            "3) Avantages / contraintes :\n"
            "- Avantages : saisie unique, temps réel, traçabilité pièces, droits d'accès.\n"
            "- Contraintes : coût, durée, réorganisation, résistance atelier.\n\n"
            "4) Recommandation :\n"
            "Intégrer l'atelier pour tracer pièces et stocks ; sinon rupture informationnelle. "
            "Accompagner par formation et pilote, avec période transitoire acceptée."
        ),
        "attendu": "Etude complete type bac, schéma processus, arbitrage argumente.",
        "notions": ["Etude complete type bac", "schéma processus", "arbitrage argumente."],
        "minChars": 400,
    },
    {
        "id": "cas2",
        "title": "Étude de cas : choix numériques chez TerraLog",
        "support": (
            "TerraLog (transport routier, 65 salariés) doit choisir en 2026 :\n"
            "- Option A : PGI cloud + télétravail 1 j/sem pour planificateurs, IA pour optimiser tournées.\n"
            "- Option B : conserver logiciel métier actuel + renforcer m-commerce clients (app suivi colis).\n"
            "- Option C : hybride PGI cloud + app mobile chauffeurs (mobilité) sans télétravail généralisé.\n"
            "Contraintes : budget max 200 000 €, données GPS conducteurs (données personnelles), "
            "chauffeurs peu à l'aise avec le numérique. La performance visee : réduire coûts "
            "carburant de 8 % et délai livraison de 15 %."
        ),
        "consigne": (
            "Compare les trois options et recommande la plus pertinente en justifiant chaque "
            "critere (processus, PGI, e/m-commerce, télétravail, mobilité, IA, cloud, RGPD)."
        ),
        "questions": [
            "Evalue chaque option selon : organisation du travail, coût, données personnelles.",
            "Quels indicateurs pour mesurer la performance visée ?",
            "Quelle option recommandes-tu et quelles conditions de mise en œuvre ?",
            "Quels risques humains et comment les réduire ?",
        ],
        "correctionModele": (
            "1) Évaluation options :\n"
            "- A : PGI + cloud + IA + télétravail = efficacité planification mais coût, "
            "formation, GPS = données perso.\n"
            "- B : m-commerce sans refonte processus = limite sur gains internes.\n"
            "- C : hybride souvent optimal : PGI cloud, mobilité chauffeurs, pas télétravail massif.\n\n"
            "2) Indicateurs :\n"
            "Co\u00fbt carburant/L, d\u00e9lai moyen livraison, taux utilisation camions.\n\n"
            "3) Recommandation :\n"
            "Option C : formaliser processus transport, PGI cloud, app chauffeurs, registre RGPD "
            "GPS, formation numérique.\n\n"
            "4) Risques humains :\n"
            "Résistance chauffeurs ? formation terrain, support, implication pilotes."
        ),
        "attendu": "Comparaison structuree, recommandation chiffree, RGPD et conduite du changement.",
        "notions": ["Comparaison structuree", "recommandation chiffree", "RGPD et conduite du changement."],
        "minChars": 420,
    },
]
