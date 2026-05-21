# -*- coding: utf-8 -*-
"""Chapitre 8 - L'influence du numerique sur l'organisation du travail."""

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
            "A partir du support, definis la notion de processus de gestion et explique comment "
            "elle represente l'organisation du travail chez Express Nord. Mobilise les notions "
            "processus, acteurs, automatisation et resultat."
        ),
        "questions": [
            "Qu'est-ce qu'un processus de gestion selon le manuel ?",
            "Identifie dans le texte les acteurs, les activites et le resultat du processus.",
            "Quel role joue l'automatisation (WMS) dans ce processus ?",
        ],
        "correctionModele": (
            "1) Definition du processus :\n"
            "Un processus est un enchainement d'activites (operations) complementaires realisees "
            "par un ou plusieurs acteurs appartenant a differents services. A partir d'un besoin, "
            "il permet d'obtenir un resultat en mobilisant des ressources. Une partie des operations "
            "peut etre automatisee.\n\n"
            "2) Elements chez Express Nord :\n"
            "- Acteurs : commercial, stock, logistique, comptabilite.\n"
            "- Activites : validation commande, preparation, expedition, facturation.\n"
            "- Besoin : livrer la marchandise commandee.\n"
            "- Resultat : colis expedie sous 48 h, facture emise.\n\n"
            "3) Automatisation :\n"
            "Le WMS genere automatiquement le bon de preparation apres validation du paiement. "
            "Cela accelere le flux, reduit les erreurs de saisie et structure l'organisation du "
            "travail autour d'un systeme d'information partage."
        ),
        "attendu": "Definition du cours, repérage precis dans le support, lien SI / organisation du travail.",
        "minChars": 130,
    },
    {
        "id": "e2",
        "title": "Schema evenement-resultat",
        "support": (
            "Le service achats de Renault Trucks modelise le processus « traiter une commande "
            "fournisseur » avec un schema evenement-resultat. L'evenement declencheur initial est "
            "« besoin de reapprovisionnement detecte ». L'activite « passer commande fournisseur » "
            "produit deux issues possibles (regles d'emission) : soit « commande validee », soit "
            "« commande refusee (budget insuffisant) ». L'evenement-resultat « commande validee » "
            "declenche l'activite suivante « receptionner la livraison ». Un tableau d'analyse a "
            "ete realise en amont pour distinguer formellement declencheurs, activites et "
            "evenements-resultats avant de parametrer le PGI."
        ),
        "consigne": (
            "Explique la logique du schema evenement-resultat en t'appuyant sur l'exemple Renault "
            "Trucks. Utilise le tableau ci-dessous pour structurer ta reponse."
        ),
        "questions": [
            "Qu'est-ce qu'un evenement declencheur et un evenement-resultat ?",
            "Complete le tableau : relie chaque ligne du support au bon type d'element.",
            "Pourquoi realiser un tableau d'analyse avant d'implanter un PGI ?",
        ],
        "supportTables": [
            {
                "title": "Tableau d'analyse du processus (a completer dans ta copie)",
                "columns": ["Element", "Exemple dans le support"],
                "rows": [
                    ["Evenement declencheur", "Besoin de reapprovisionnement detecte"],
                    ["Activite", "Passer commande fournisseur / Receptionner livraison"],
                    ["Regle d'emission", "Commande validee OU refusee (budget)"],
                    ["Evenement-resultat", "Commande validee ? declenche reception"],
                ],
            }
        ],
        "correctionModele": (
            "1) Evenements :\n"
            "L'evenement declencheur lance une activite (ici : besoin de reapprovisionnement). "
            "L'evenement-resultat est l'issue d'une activite et devient declencheur de l'activite "
            "suivante (commande validee ? reception).\n\n"
            "2) Tableau :\n"
            "Declencheur : besoin detecte. Activite 1 : passer commande. Regles : validee / refusee. "
            "Resultat : commande validee. Activite 2 : receptionner.\n\n"
            "3) Interet du tableau avant PGI :\n"
            "Il formalise le processus, clarifie les enchainements et les acteurs, et permet de "
            "configurer correctement le progiciel. Sans cette analyse, le PGI risque de rigidifier "
            "des pratiques mal definies."
        ),
        "attendu": "Vocabulaire exact du manuel, tableau exploite, lien avec modelisation SI.",
        "minChars": 150,
    },
    {
        "id": "e3",
        "title": "SI structurant et rigidite des processus",
        "support": (
            "Dans une banque regionale, le PGI impose un circuit de validation des dossiers de "
            "credit en cinq ecrans obligatoires. Les conseillers estiment que deux etapes pourraient "
            "etre fusionnees, mais le logiciel ne le permet pas sans refonte du parametrage. "
            "Paradoxalement, le meme PGI a supprime les doubles saisies entre agence et siege : "
            "les donnees client sont saisies une seule fois et mises a jour en temps reel. La "
            "direction affirme que le systeme d'information « structure » l'organisation : il "
            "determine qui fait quoi, dans quel ordre, et quelles informations circulent entre "
            "les services. L'automatisation des relances (e-mails si piece manquante) a reduit "
            "de 20 % le delai moyen de traitement, mais les conseillers regrettent une perte "
            "de flexibilite relationnelle avec certains clients fragiles."
        ),
        "consigne": (
            "Analyse les effets du numerique sur l'organisation du travail dans cette banque : "
            "avantages et contraintes. Mobilise les notions de systeme d'information structurant, "
            "automatisation et role des acteurs."
        ),
        "questions": [
            "En quoi le PGI est-il un systeme structurant pour l'organisation ?",
            "Cite un avantage et une contrainte illustres par le support.",
            "Comment le numerique modifie-t-il le role des conseillers clients ?",
        ],
        "correctionModele": (
            "1) SI structurant :\n"
            "Le PGI modelise l'organisation du travail : enchainement impose, circulation de "
            "l'information, roles definis. Il peut generer des modes de fonctionnement rigides.\n\n"
            "2) Avantage / contrainte :\n"
            "- Avantage : suppression double saisie, mise a jour temps reel, relances automatiques "
            "(?20 % delai).\n"
            "- Contrainte : cinq ecrans obligatoires, peu de flexibilite pour adapter le circuit.\n\n"
            "3) Role des acteurs :\n"
            "Les conseillers executent un processus cadre par le logiciel ; leur marge de manoeuvre "
            "relationnelle diminue sur certains dossiers, meme si ils gagnent en efficacite "
            "administrative."
        ),
        "attendu": "Analyse equilibree, vocabulaire chapitre 8, exemples tires du support.",
        "minChars": 160,
    },
    {
        "id": "e4",
        "title": "Le progiciel de gestion integre (PGI)",
        "support": (
            "L'entreprise agroalimentaire Andros deploie SAP (PGI) pour integrer comptabilite, "
            "achats, production et ventes. Tous les modules partagent une base de donnees unique "
            "hebergee sur le serveur du siege. Chaque utilisateur se connecte avec identifiant "
            "et mot de passe ; les acheteurs peuvent creer et modifier des commandes, les "
            "comptables peuvent seulement interroger et valider. La direction met en avant "
            "qu'une commande client saisie une fois alimente automatiquement la production "
            "planifiee et la facturation, sans ressaisie."
        ),
        "consigne": (
            "Presente le PGI et ses avantages en t'appuyant sur le cas Andros. Precise le role "
            "des droits d'acces (creation, interrogation, modification, suppression)."
        ),
        "questions": [
            "Qu'est-ce qu'un PGI ? Quelles applications metiers regroupe-t-il ici ?",
            "Explique les avantages de la base de donnees unique et de la saisie unique.",
            "A quoi servent les droits d'acces differencies entre acheteurs et comptables ?",
        ],
        "correctionModele": (
            "1) Definition PGI :\n"
            "Le progiciel de gestion integre regroupe plusieurs applications metiers (comptabilite, "
            "achats, production, ventes) sur une base unique, installe en reseau.\n\n"
            "2) Avantages :\n"
            "- Donnees saisies une seule fois, mises a jour en temps reel.\n"
            "- Gain de temps, meilleure efficacite, coherence entre services.\n"
            "- Enchainement automatique commande ? production ? facturation.\n\n"
            "3) Droits d'acces :\n"
            "Ils securisent l'information : chaque profil n'accede qu'aux fonctions necessaires "
            "(CRUD : creation, interrogation, modification, suppression), limitant erreurs et fraudes."
        ),
        "attendu": "Definition complete, avantages illustres, securite et droits d'acces.",
        "minChars": 150,
    },
    {
        "id": "e5",
        "title": "Contraintes de mise en place d'un PGI",
        "support": (
            "La PME textile « Laine du Morvan » (85 salaries) budgete 420 000  pour implementer "
            "un PGI sur 18 mois. Le cabinet conseil estime que 40 % du budget servira a "
            "repenser les processus (atelier, approvisionnement, SAV) avant parametrage. "
            "Plusieurs chefs d'atelier resistencent : « on a toujours fait comme ca ». "
            "La direction anticipe une periode ou production et facturation seront ralenties "
            "pendant la bascule. Le manuel rappelle que le cout d'acquisition est eleve et que "
            "l'implantation peut etre longue si l'organisation ne reorganise pas ses pratiques."
        ),
        "consigne": (
            "Identifie les contraintes de mise en place du PGI et propose des actions pour "
            "faciliter l'adoption. Mobilise reorganisation des processus, cout et conduite du changement."
        ),
        "questions": [
            "Quelles contraintes du manuel retrouves-tu dans le cas Laine du Morvan ?",
            "Pourquoi faut-il repenser les processus avant d'installer le PGI ?",
            "Propose deux actions concretes pour limiter la resistance au changement.",
        ],
        "correctionModele": (
            "1) Contraintes :\n"
            "- Cout eleve (420 000 ).\n"
            "- Duree longue (18 mois).\n"
            "- Reorganisation obligatoire des processus actuels.\n"
            "- Ralentissement temporaire de l'activite a la bascule.\n"
            "- Resistance humaine des chefs d'atelier.\n\n"
            "2) Repenser les processus :\n"
            "Le PGI impacte les pratiques : sans reflexion amont, on automatise l'inefficacite. "
            "La modelisation (schemas evenement-resultat) precede le parametrage.\n\n"
            "3) Actions :\n"
            "- Communication et formation des chefs d'atelier, implication dans la conception.\n"
            "- Pilote sur un atelier, accompagnement changement, quick wins visibles."
        ),
        "attendu": "Contraintes du cours + cas, solutions realistes de conduite du changement.",
        "minChars": 170,
    },
    {
        "id": "e6",
        "title": "E-commerce et m-commerce",
        "support": (
            "Fnac Darty realise 38 % de son chiffre d'affaires via le e-commerce (site fnac.com "
            "accessible sur ordinateur). Son application mobile « Fnac & moi » permet d'acheter "
            "en m-commerce : le support est le smartphone connecte a Internet, avec paiement "
            "Apple Pay et suivi de commande en temps reel. En 2024, le trafic mobile depasse "
            "le desktop le week-end. Le directeur digital rappelle que le m-commerce est une "
            "branche du e-commerce lorsque l'utilisateur passe par un terminal mobile."
        ),
        "consigne": (
            "Distingue e-commerce et m-commerce en t'appuyant sur Fnac Darty. Explique les "
            "implications pour l'organisation du travail (logistique, SAV, marketing digital)."
        ),
        "questions": [
            "Definis e-commerce et m-commerce avec l'exemple Fnac Darty.",
            "Quelle difference entre achat sur fnac.com (PC) et sur l'application mobile ?",
            "Quels impacts sur l'organisation du travail (deux exemples) ?",
        ],
        "correctionModele": (
            "1) Definitions :\n"
            "- E-commerce : transactions commerciales en ligne via un support numerique connecte "
            "a Internet (site web sur ordinateur).\n"
            "- M-commerce : branche du e-commerce via support mobile (smartphone, application).\n\n"
            "2) Difference supports :\n"
            "Meme transaction commerciale, mais canal et ergonomie differents ; l'app mobile "
            "facilite achat impulsif, geolocalisation, notifications.\n\n"
            "3) Impacts organisation :\n"
            "- Logistique : pics de commandes le week-end, preparation colis accrue.\n"
            "- Marketing / SI : equipes dediees a l'app, maintenance, donnees de navigation mobile."
        ),
        "attendu": "Definitions precises, distinction claire, impacts organisation concrets.",
        "minChars": 160,
    },
    {
        "id": "e7",
        "title": "Site de marche et encheres en ligne",
        "support": (
            "Sur la plateforme Catawiki, un collectionneur met en vente une montre vintage. "
            "Les encheres durent sept jours. A la cloture, l'acquereur est l'enchérisseur ayant "
            "propose le prix le plus eleve (2 450 ). Catawiki preleve une commission de 12 % "
            "sur le prix final. Le vendeur n'a pas de magasin physique : toute la transaction "
            "passe par le site de marche. Le processus combine automatisation (compteur temps "
            "reel, notifications e-mail) et intervention humaine (expertise authentification "
            "de la montre avant mise en ligne)."
        ),
        "consigne": (
            "Explique le fonctionnement d'un site de marche par les encheres en ligne. "
            "Relie processus, automatisation et role des acteurs."
        ),
        "questions": [
            "Qu'est-ce qu'un site de marche selon le manuel ? Comment se deroule l'enchere ?",
            "Quelles parties du processus sont automatisees chez Catawiki ?",
            "Quel risque pour l'acheteur si l'expertise n'est pas realisee ?",
        ],
        "correctionModele": (
            "1) Site de marche :\n"
            "Commerce base sur l'enchere d'un bien dans un temps imparti ; l'acquereur est celui "
            "dont l'offre est la plus elevee a la cloture.\n\n"
            "2) Automatisation :\n"
            "Compteur temps reel, notifications, enregistrement des offres, calcul commission - "
            "reduit le travail manuel. L'expertise reste humaine (controle qualite).\n\n"
            "3) Risque sans expertise :\n"
            "Acheteur pourrait payer un prix eleve pour un bien non conforme ; atteinte confiance "
            "et e-reputation de la plateforme."
        ),
        "attendu": "Definition enchere en ligne, processus evenement-resultat implicite, analyse risque.",
        "minChars": 150,
    },
    {
        "id": "e8",
        "title": "Teletravail et organisation",
        "support": (
            "Le cabinet de conseil « Altitude RH » (220 consultants) a adopte une charte "
            "teletravail : deux jours par semaine a domicile, trois jours au siege parisien. "
            "Les consultants accedent au PGI et aux dossiers clients via un VPN securise. "
            "La direction note une meilleure attractivite RH, mais aussi des difficultes "
            "de coordination sur les projets transverses necessitant creativite collective. "
            "Le teletravail permet de travailler a distance de l'organisation, comme le rappelle "
            "le manuel, a condition que le systeme d'information garantisse securite et transmission."
        ),
        "consigne": (
            "Analyse les opportunites et limites du teletravail chez Altitude RH. Mobilise "
            "teletravail, systeme d'information, securite des donnees."
        ),
        "questions": [
            "Definis le teletravail et explique comment il est organise ici.",
            "Quelles conditions du manuel sont remplies (ou a renforcer) pour le SI ?",
            "Un avantage et une limite pour l'organisation ?",
        ],
        "correctionModele": (
            "1) Teletravail :\n"
            "Travail a distance de l'organisation (ici 2 j/sem domicile), tendance a se developper.\n\n"
            "2) Conditions SI :\n"
            "VPN = securite et acces distant aux donnees ; a renforcer : charte RGPD, formation "
            "phishing, equipements homologues.\n\n"
            "3) Avantage / limite :\n"
            "- Avantage : attractivite RH, flexibilite.\n"
            "- Limite : coordination projets creatifs, lien social affaibli."
        ),
        "attendu": "Definition, SI et securite, arbitrage organisationnel argumente.",
        "minChars": 160,
    },
    {
        "id": "e9",
        "title": "Mobilite professionnelle et SI",
        "support": (
            "Les 140 techniciens SAV de Bosch Thermotechnologie interviennent chez les "
            "particuliers avec une tablette professionnelle : consultation historique chaudiere, "
            "saisie du compte-rendu d'intervention, commande de pieces en temps reel. "
            "Le siege met a jour le planning chaque matin via le meme logiciel. "
            "Le manuel indique que certains metiers obligent les salaries a etre mobiles ; "
            "le SI doit alors assurer transmission et securite des donnees sur le terrain."
        ),
        "consigne": (
            "Montre en quoi la mobilite transforme l'organisation du travail et le role du SI. "
            "Compare avec le teletravail (une difference, une similitude)."
        ),
        "questions": [
            "En quoi les techniciens Bosch sont-ils des acteurs mobiles ?",
            "Quelles fonctions du SI sont indispensables sur le terrain ?",
            "Difference et similitude avec le teletravail.",
        ],
        "correctionModele": (
            "1) Mobilite :\n"
            "Travail chez le client, pas au siege ; tablette = terminal mobile connecte.\n\n"
            "2) Fonctions SI :\n"
            "Consultation donnees, saisie intervention, commande pieces, synchro planning - "
            "transmission temps reel et securisation des acces.\n\n"
            "3) Comparaison teletravail :\n"
            "- Similitude : travail hors locaux, dependance au numerique.\n"
            "- Difference : mobilite = deplacement professionnel terrain ; teletravail = domicile fixe."
        ),
        "attendu": "Mobilite bien definie, SI adapte, comparaison pertinente.",
        "minChars": 150,
    },
    {
        "id": "e10",
        "title": "Intelligence artificielle et cloud computing",
        "support": (
            "La start-up « GreenInvoice » utilise Microsoft 365 (cloud computing) pour stocker "
            "contrats et factures sur des serveurs distants accessibles via Internet. "
            "L'IA integree propose une categorisation automatique des depenses et alerte "
            "si un fournisseur devient recurrent. Le fondateur indique que l'IA analyse "
            "d'importants volumes de donnees pour gerer des taches operationnelles quotidiennes "
            "en autonomie, tandis que le cloud evite d'acheter un serveur physique. "
            "Il reste vigilant : les donnees clients sont hebergees chez un operateur americain, "
            "soumises au RGPD et aux clauses contractuelles de confidentialite."
        ),
        "consigne": (
            "Definis intelligence artificielle et cloud computing, puis analyse leurs effets "
            "sur l'organisation du travail et les precautions a prendre."
        ),
        "questions": [
            "Definis IA et cloud computing avec l'exemple GreenInvoice.",
            "Quels gains pour l'organisation du travail ?",
            "Quelles precautions (donnees, reglementation) ?",
        ],
        "correctionModele": (
            "1) Definitions :\n"
            "- IA : algorithmes analysant de grandes quantites de donnees pour automatiser "
            "taches operationnelles (categorisation depenses, alertes).\n"
            "- Cloud : stockage et traitement sur serveurs distants en ligne, sans serveur local.\n\n"
            "2) Gains organisation :\n"
            "Gain de temps comptable, decisions plus rapides, scalabilite sans investissement "
            "materiel lourd.\n\n"
            "3) Precautions :\n"
            "RGPD, localisation hebergeur, contrats, sauvegardes, controle humain des decisions IA."
        ),
        "attendu": "Definitions manuel, gains et risques, RGPD mentionne.",
        "minChars": 170,
    },
    {
        "id": "cas1",
        "title": "Etude de cas : deploiement PGI chez Medisport",
        "support": (
            "Medisport (120 salaries) distribue du materiel sportif aux clubs. Avant PGI, "
            "chaque service tenait un fichier Excel ; les delais de facturation atteignaient "
            "12 jours. Le projet « Odoo » (PGI open source) vise : base unique, processus "
            "commande client formalise (evenement « commande web » ? preparation ? expedition "
            "? facture), droits d'acces par profil. Budget 280 000  sur 14 mois dont 90 000  "
            "conseil processus. Le comite de pilotage doit trancher : garder un atelier de "
            "reparation sans passer par le PGI (habitude) ou l'integrer pour tracer les pieces detachees."
        ),
        "consigne": (
            "Rédige une etude de cas structuree (intro, diagnostic, schema processus, avantages "
            "et contraintes PGI, recommandation). Mobilise toutes les notions du chapitre 8."
        ),
        "questions": [
            "Diagnostic : quels problemes l'ancien systeme provoquait-il ?",
            "Propose un enchainement evenement-resultat simplifie pour une commande web.",
            "Analyse avantages et contraintes du projet Odoo pour Medisport.",
            "Recommandation : faut-il integrer l'atelier reparation au PGI ? Argumente.",
        ],
        "correctionModele": (
            "1) Diagnostic :\n"
            "Fichiers Excel isoles ? doubles saisies, lenteur facturation (12 j), manque "
            "de vision globale, risques d'erreurs.\n\n"
            "2) Schema simplifie :\n"
            "Declencheur : commande web validee ? Activite : preparer colis ? Resultat : "
            "colis pret ? Activite : facturer ? Resultat : facture emise.\n\n"
            "3) Avantages / contraintes :\n"
            "- Avantages : saisie unique, temps reel, tracabilite pieces, droits d'acces.\n"
            "- Contraintes : cout, duree, reorganisation, resistance atelier.\n\n"
            "4) Recommandation :\n"
            "Integrer l'atelier pour tracer pieces et stocks ; sinon rupture informationnelle. "
            "Accompagner par formation et pilote, avec periode transitoire acceptee."
        ),
        "attendu": "Etude complete type bac, schema processus, arbitrage argumente.",
        "minChars": 400,
    },
    {
        "id": "cas2",
        "title": "Etude de cas : choix numeriques chez TerraLog",
        "support": (
            "TerraLog (transport routier, 65 salaries) doit choisir en 2026 :\n"
            "- Option A : PGI cloud + teletravail 1 j/sem pour planificateurs, IA pour optimiser tournées.\n"
            "- Option B : conserver logiciel metier actuel + renforcer m-commerce clients (app suivi colis).\n"
            "- Option C : hybride PGI cloud + app mobile chauffeurs (mobilite) sans teletravail generalise.\n"
            "Contraintes : budget max 200 000 , donnees GPS conducteurs (donnees personnelles), "
            "chauffeurs peu a l'aise avec le numerique. La performance visee : reduire couts "
            "carburant de 8 % et delai livraison de 15 %."
        ),
        "consigne": (
            "Compare les trois options et recommande la plus pertinente en justifiant chaque "
            "critere (processus, PGI, e/m-commerce, teletravail, mobilite, IA, cloud, RGPD)."
        ),
        "questions": [
            "Evalue chaque option selon : organisation du travail, cout, donnees personnelles.",
            "Quels indicateurs pour mesurer la performance visée ?",
            "Quelle option recommandes-tu et quelles conditions de mise en oeuvre ?",
            "Quels risques humains et comment les reduire ?",
        ],
        "correctionModele": (
            "1) Evaluation options :\n"
            "- A : PGI + cloud + IA + teletravail = efficacite planification mais cout, "
            "formation, GPS = donnees perso.\n"
            "- B : m-commerce sans refonte processus = limite sur gains internes.\n"
            "- C : hybride souvent optimal : PGI cloud, mobilite chauffeurs, pas teletravail massif.\n\n"
            "2) Indicateurs :\n"
            "Cout carburant/L, delai moyen livraison, taux utilisation camions.\n\n"
            "3) Recommandation :\n"
            "Option C : formaliser processus transport, PGI cloud, app chauffeurs, registre RGPD "
            "GPS, formation numerique.\n\n"
            "4) Risques humains :\n"
            "Resistance chauffeurs ? formation terrain, support, implication pilotes."
        ),
        "attendu": "Comparaison structuree, recommandation chiffree, RGPD et conduite du changement.",
        "minChars": 420,
    },
]
