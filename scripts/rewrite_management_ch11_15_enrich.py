# -*- coding: utf-8 -*-
"""Enrichment metadata for Management chapters 11-15."""

D = "\u2014 "

CHAPTER_INTRO = {
    11: (
        "BanqueNord est une banque r\u00e9gionale lilloise (CA 95 M\u20ac, 650 salari\u00e9s, 142 agences "
        "dans le Nord-Pas-de-Calais). Depuis 2022, le PDG Philippe Martin pilote une transformation "
        "num\u00e9rique int\u00e9gr\u00e9e : application mobile, cloud, CRM unifi\u00e9 et conduite du changement "
        "sur 24 mois. La directrice digitale In\u00e8s Moreau et le DPO Laurent Girard encadrent les projets "
        "donn\u00e9es et conformit\u00e9 RGPD."
    ),
    12: (
        "Mode&Co est une enseigne de mode parisienne (CA 42 M\u20ac, 280 salari\u00e9s, 1 200 points de vente "
        "partenaires en France). La directrice g\u00e9n\u00e9rale Am\u00e9lie Renard a lanc\u00e9 en 2024 le rebranding "
        "\u00ab Mode&Co Responsible \u00bb visant les 25-35 ans urbains sensibles \u00e0 la mode durable accessible. "
        "Le directeur communication Julien Fabre g\u00e8re un budget global de 3,2 M\u20ac (interne, RP, digital, "
        "\u00e9v\u00e9nementiel) et coordonne la communication int\u00e9gr\u00e9e interne/externe."
    ),
    13: (
        "GreenPack est une PME strasbourgeoise d'emballages responsables (CA 16 M\u20ac, 110 salari\u00e9s). "
        "Fond\u00e9e en 2010 par \u00c9lodie Weiss, elle fabrique des solutions compostables et recyclables "
        "pour la GMS et l'e-commerce. Le comit\u00e9 \u00e9thique (DG, DRH, DAF, repr\u00e9sentant CSE) veille "
        "au code de d\u00e9ontologie adopt\u00e9 en 2023. GreenPack revendique une RSE sinc\u00e8re face aux "
        "pratiques de greenwashing de certains concurrents."
    ),
    14: (
        "TechLink est une ESN rennaise (CA 11 M\u20ac, 95 salari\u00e9s consultants) sp\u00e9cialis\u00e9e en "
        "transformation digitale pour PME bretonnes et parisiennes. Depuis 2023, la DRH Camille Arnaud "
        "et le directeur g\u00e9n\u00e9ral Yann Delorme d\u00e9ploient une organisation hybride : t\u00e9l\u00e9travail "
        "partiel, OKR trimestriels, droit \u00e0 la d\u00e9connexion et management par objectifs. "
        "L'enjeu est de concilier performance projet et qualit\u00e9 de vie au travail."
    ),
    15: (
        "DataSecure est une PME sophi\u00e9tique de cybers\u00e9curit\u00e9 (CA 8 M\u20ac, 62 salari\u00e9s) qui "
        "prot\u00e8ge les donn\u00e9es de 340 PME clientes (SOC, sauvegarde, analyse d'incidents). "
        "Le DPO interne Karim Benali et le RSSI Claire Dubois pilotent la conformit\u00e9 RGPD, "
        "la cybers\u00e9curit\u00e9 et la sensibilisation des \u00e9quipes depuis le plan de mise en conformit\u00e9 2023."
    ),
}

NOTIONS = {
    (11, "e1"): ["parcours client", "multicanalit\u00e9", "RO PO"],
    (11, "e2"): ["traces num\u00e9riques", "vue client 360\u00b0", "customer-centric"],
    (11, "e3"): ["social listening", "signaux faibles", "veille marketing"],
    (11, "e4"): ["CRM", "omnicanalit\u00e9", "robots conversationnels"],
    (11, "e5"): ["administration \u00e9lectronique", "d\u00e9mat\u00e9rialisation", "RGPD"],
    (11, "e6"): ["conduite du changement", "mod\u00e8le de Kotter", "transformation num\u00e9rique"],
    (11, "e7"): ["r\u00e9sistances au changement", "accompagnement", "dialogue social"],
    (11, "e8"): ["gouvernance SI", "transformation SI", "dette technique"],
    (11, "e9"): ["agilit\u00e9 organisationnelle", "Scrum", "time-to-market"],
    (11, "e10"): ["transformation num\u00e9rique", "conduite du changement", "intelligence artificielle"],
    (11, "cas1"): ["conduite du changement", "parties prenantes", "communication de crise"],
    (11, "cas2"): ["\u00e9thique IA", "RGPD", "DPIA"],
    (12, "e1"): ["communication strat\u00e9gique", "coh\u00e9sion interne", "image de marque"],
    (12, "e2"): ["communication descendante", "communication ascendante", "communication transversale"],
    (12, "e3"): ["communication commerciale", "communication institutionnelle", "communication int\u00e9gr\u00e9e"],
    (12, "e4"): ["identit\u00e9 visuelle", "image de marque", "positionnement"],
    (12, "e5"): ["communication digitale", "e-r\u00e9putation", "identit\u00e9 num\u00e9rique"],
    (12, "e6"): ["gestion de crise", "communication de crise", "cellule de crise"],
    (12, "e7"): ["communication RSE", "transparence", "greenwashing"],
    (12, "e8"): ["communication int\u00e9gr\u00e9e", "coh\u00e9rence", "multicanalit\u00e9"],
    (12, "e9"): ["indicateurs communication", "ROI communication", "notori\u00e9t\u00e9"],
    (12, "e10"): ["strat\u00e9gie communication", "plan de communication", "budget communication"],
    (12, "cas1"): ["gestion de crise", "communication ascendante", "e-r\u00e9putation"],
    (12, "cas2"): ["rebranding", "greenwashing", "communication int\u00e9gr\u00e9e"],
    (13, "e1"): ["\u00e9thique des affaires", "code de d\u00e9ontologie", "avantage concurrentiel"],
    (13, "e2"): ["greenwashing", "all\u00e9gations environnementales", "DGCCRF"],
    (13, "e3"): ["RSE washing", "reporting RSE", "transparence"],
    (13, "e4"): ["discrimination", "diversit\u00e9", "recrutement"],
    (13, "e5"): ["m\u00e9c\u00e9nat", "engagement civique", "RSE"],
    (13, "e6"): ["lanceur d'alerte", "alerte \u00e9thique", "gouvernance"],
    (13, "e7"): ["\u00e9thique supply chain", "sous-traitance", "audit social"],
    (13, "e8"): ["conflit d'int\u00e9r\u00eats", "achats", "compliance"],
    (13, "e9"): ["compliance", "formation \u00e9thique", "culture d'entreprise"],
    (13, "e10"): ["\u00e9thique strat\u00e9gique", "RSE", "r\u00e9putation"],
    (13, "cas1"): ["greenwashing", "DGCCRF", "preuves et transparence"],
    (13, "cas2"): ["conflit d'int\u00e9r\u00eats", "gouvernance", "crise \u00e9thique"],
    (14, "e1"): ["nouveaux rapports au travail", "autonomie", "manager-coach"],
    (14, "e2"): ["t\u00e9l\u00e9travail", "accord d'entreprise", "cybers\u00e9curit\u00e9"],
    (14, "e3"): ["droit \u00e0 la d\u00e9connexion", "disponibilit\u00e9 permanente", "QVT"],
    (14, "e4"): ["modes de vie", "aspirations salari\u00e9s", "marque employeur"],
    (14, "e5"): ["management \u00e0 distance", "OKR", "objectifs"],
    (14, "e6"): ["coh\u00e9sion d'\u00e9quipe", "mode hybride", "r\u00e9tention"],
    (14, "e7"): ["QVT", "burn-out", "bien-\u00eatre au travail"],
    (14, "e8"): ["parit\u00e9", "in\u00e9galit\u00e9s", "t\u00e9l\u00e9travail"],
    (14, "e9"): ["marque employeur", "attractivit\u00e9", "t\u00e9l\u00e9travail"],
    (14, "e10"): ["arbitrage pr\u00e9sentiel/t\u00e9l\u00e9travail", "organisation hybride", "performance"],
    (14, "cas1"): ["t\u00e9l\u00e9travail", "turnover", "marque employeur"],
    (14, "cas2"): ["droit \u00e0 la d\u00e9connexion", "burn-out", "crise RH"],
    (15, "e1"): ["RGPD", "principes fondateurs", "registre des traitements"],
    (15, "e2"): ["CNIL", "sanctions", "mise en demeure"],
    (15, "e3"): ["droits des personnes", "acc\u00e8s", "effacement", "portabilit\u00e9"],
    (15, "e4"): ["cybers\u00e9curit\u00e9", "protection des donn\u00e9es", "MFA"],
    (15, "e5"): ["violation de donn\u00e9es", "notification CNIL", "72 heures"],
    (15, "e6"): ["blockchain", "tra\u00e7abilit\u00e9", "journalisation"],
    (15, "e7"): ["privacy by design", "minimisation", "DPO"],
    (15, "e8"): ["sous-traitant RGPD", "DPA", "h\u00e9bergeur cloud"],
    (15, "e9"): ["culture s\u00e9curit\u00e9", "phishing", "sensibilisation"],
    (15, "e10"): ["DPIA", "intelligence artificielle", "responsabilit\u00e9 num\u00e9rique"],
    (15, "cas1"): ["contr\u00f4le CNIL", "mise en conformit\u00e9", "registre des traitements"],
    (15, "cas2"): ["ransomware", "PRA", "notification violation"],
}

CONTEXT = {
    (11, "e1"): "En janvier 2025, In\u00e8s Moreau pr\u00e9sente au comit\u00e9 digital l'analyse des parcours clients multicanaux sur douze mois glissants.",
    (11, "e2"): "Le projet \u00ab client 360 \u00bb entre en phase pilote en f\u00e9vrier 2025 sur 12 000 clients haut de gamme de la m\u00e9tropole lilloise.",
    (11, "e3"): "L'\u00e9quipe communication d\u00e9ploie Brandwatch en mars 2025 pour compl\u00e9ter la veille commerciale trimestrielle traditionnelle.",
    (11, "e4"): "La migration CRM Salesforce s'ach\u00e8ve en avril 2025 apr\u00e8s dix-huit mois de d\u00e9ploiement progressif sur le r\u00e9seau.",
    (11, "e5"): "Le partenariat pr\u00e9fecture du Nord est sign\u00e9 en juin 2024 pour acc\u00e9l\u00e9rer la d\u00e9mat\u00e9rialisation des dossiers cr\u00e9dit.",
    (11, "e6"): "Philippe Martin lance officiellement le plan \u00ab Banque de proximit\u00e9 augment\u00e9e \u00bb en septembre 2023 pour une dur\u00e9e de 24 mois.",
    (11, "e7"): "L'enqu\u00eate interne sur les r\u00e9sistances est diffus\u00e9e en octobre 2024, six mois avant la premi\u00e8re vague de fermetures d'agences.",
    (11, "e8"): "Le comit\u00e9 de gouvernance SI se r\u00e9unit mensuellement depuis la migration cloud europ\u00e9enne valid\u00e9e en d\u00e9cembre 2024.",
    (11, "e9"): "La direction digitale structure six squads produit \u00e0 partir de mars 2024 avec des releases bimensuelles de l'application.",
    (11, "e10"): "Le bilan \u00e0 M+24 est pr\u00e9sent\u00e9 au conseil d'administration en novembre 2025 avant le lancement du projet IA g\u00e9n\u00e9rative.",
    (11, "cas1"): "L'annonce des 12 fermetures d'agences rurales intervient le 15 janvier 2025 lors d'une conf\u00e9rence de presse r\u00e9gionale.",
    (11, "cas2"): "Le pilote chatbot IA d\u00e9marre en f\u00e9vrier 2025 sur les cr\u00e9dits consommation avant une g\u00e9n\u00e9ralisation pr\u00e9vue fin 2026.",
    (12, "e1"): "Le comit\u00e9 strat\u00e9gie communication valide le plan 2025-2027 en septembre 2024 avec des objectifs chiffr\u00e9s par canal.",
    (12, "e2"): "Apr\u00e8s la fusion des studios parisiens et lillois en 2024, Julien Fabre renforce les circuits de remont\u00e9e ascendante.",
    (12, "e3"): "Les campagnes Re-Thread et transparence supply chain sont lanc\u00e9es simultan\u00e9ment en mars 2025.",
    (12, "e4"): "Le rebranding \u00ab Wear the change \u00bb est d\u00e9ploy\u00e9 sur 1 200 points de vente entre avril et d\u00e9cembre 2024.",
    (12, "e5"): "La cellule e-r\u00e9putation surveille Instagram, TikTok et Trustpilot 24h/24 depuis la crise sous-traitance de f\u00e9vrier 2025.",
    (12, "e6"): "La pol\u00e9mique TV sur la sous-traitance au Bangladesh \u00e9clate le 12 f\u00e9vrier 2025 lors du prime-time France 2.",
    (12, "e7"): "Le rapport RSE 2024 est publi\u00e9 en avril 2025 avec un audit social ind\u00e9pendant de 18 fournisseurs prioritaires.",
    (12, "e8"): "Julien Fabre pr\u00e9sente la charte de communication int\u00e9gr\u00e9e au CODIR en mai 2025 apr\u00e8s la crise.",
    (12, "e9"): "Le tableau de bord communication (notori\u00e9t\u00e9, EMV, taux de lecture interne) est revu trimestriellement depuis 2024.",
    (12, "e10"): "Am\u00e9lie Renard arbitre le budget 2026 en octobre 2025 entre relance digitale et renforcement RP institutionnelles.",
    (12, "cas1"): "Le hashtag #BoycottModeAndCo d\u00e9passe 2,4 M d'impressions en 48 h \u00e0 partir du 13 f\u00e9vrier 2025.",
    (12, "cas2"): "Le rebranding durable est soumis au comit\u00e9 \u00e9thique interne en juin 2025 pour \u00e9viter tout greenwashing.",
    (13, "e1"): "Le comit\u00e9 \u00e9thique se r\u00e9unit trimestriellement ; le dernier dossier concerne un appel d'offres GMS de 2,4 M\u20ac en mars 2025.",
    (13, "e2"): "GreenPack d\u00e9pose un signalement DGCCRF contre GreenWrap en janvier 2025 avec analyses laboratoire ind\u00e9pendantes.",
    (13, "e3"): "Le rapport RSE 2024 de GreenPack int\u00e8gre des KPI v\u00e9rifiables publi\u00e9s en avril 2025 (FSC, OK Compost, empreinte carbone).",
    (13, "e4"): "La DRH lance un audit anonyme des processus de recrutement en septembre 2024 apr\u00e8s des signalements internes.",
    (13, "e5"): "GreenPack soutient trois associations environnementales alsaciennes pour 45 000 \u20ac en 2024 via son m\u00e9c\u00e9nat structur\u00e9.",
    (13, "e6"): "La proc\u00e9dure d'alerte \u00e9thique en ligne traite 7 signalements en 2024, dont 2 aboutissant \u00e0 des mesures correctives.",
    (13, "e7"): "Un audit social surprise d'un sous-traitant turc est r\u00e9alis\u00e9 en f\u00e9vrier 2025 avant renouvellement du contrat cadre.",
    (13, "e8"): "Le directeur achats est mis en retrait en mars 2025 apr\u00e8s un conflit d'int\u00e9r\u00eats r\u00e9v\u00e9l\u00e9 par un lanceur d'alerte.",
    (13, "e9"): "120 salari\u00e9s suivent la formation compliance \u00e9thique obligatoire d\u00e9ploy\u00e9e en e-learning entre janvier et mars 2025.",
    (13, "e10"): "\u00c9lodie Weiss pr\u00e9sente la strat\u00e9gie \u00e9thique au comit\u00e9 de direction en novembre 2025 comme levier de diff\u00e9renciation.",
    (13, "cas1"): "L'affaire GreenWrap est relay\u00e9e par l'association Halte au greenwashing et la presse r\u00e9gionale en f\u00e9vrier 2025.",
    (13, "cas2"): "Le conflit d'int\u00e9r\u00eats achats provoque une crise de gouvernance et une assembl\u00e9e extraordinaire en avril 2025.",
    (14, "e1"): "L'accord d'organisation hybride est sign\u00e9 avec les syndicats CFDT et CFE-CGC en juin 2023 pour trois ans.",
    (14, "e2"): "TechLink formalise le t\u00e9l\u00e9travail dans un avenant sign\u00e9 en septembre 2023 avec budget coworking et mat\u00e9riel.",
    (14, "e3"): "Le droit \u00e0 la d\u00e9connexion entre 20 h et 8 h est int\u00e9gr\u00e9 \u00e0 la charte IT en janvier 2024.",
    (14, "e4"): "L'enqu\u00eate modes de vie interne est diffus\u00e9e en mars 2025 aupr\u00e8s des 95 consultants.",
    (14, "e5"): "Les OKR trimestriels remplacent le suivi de pr\u00e9sence \u00e0 partir du T1 2024 sur l'ensemble des \u00e9quipes projets.",
    (14, "e6"): "Camille Arnaud d\u00e9ploie des rituels d'\u00e9quipe hybrides (caf\u00e9 mensuel, offsite semestriel) depuis octobre 2024.",
    (14, "e7"): "Trois cas de burn-out sont identifi\u00e9s en 2024, d\u00e9clenchant un plan QVT renforc\u00e9 avec l'assurance pr\u00e9voyance.",
    (14, "e8"): "Un audit parit\u00e9 t\u00e9l\u00e9travail r\u00e9v\u00e8le un \u00e9cart d'acc\u00e8s de 12 points entre femmes et hommes en f\u00e9vrier 2025.",
    (14, "e9"): "La campagne marque employeur \u00ab TechLink Flex \u00bb est lanc\u00e9e sur LinkedIn en avril 2025 pour recruter 15 profils.",
    (14, "e10"): "Yann Delorme arbitre le ratio pr\u00e9sentiel/t\u00e9l\u00e9travail cible au CODIR de juin 2025 : 40 % pr\u00e9sentiel minimum.",
    (14, "cas1"): "Le retour bureau impos\u00e9 \u00e0 4 jours/semaine en janvier 2025 provoque 8 d\u00e9missions en trois mois.",
    (14, "cas2"): "Un burn-out li\u00e9 \u00e0 la d\u00e9connexion est d\u00e9nonc\u00e9 sur LinkedIn en mars 2025 (4 200 partages en 72 h).",
    (15, "e1"): "Karim Benali met \u00e0 jour le registre des 28 traitements en janvier 2025 avant audit client grands comptes.",
    (15, "e2"): "Le contr\u00f4le CNIL de mars 2024 aboutit \u00e0 une mise en demeure de 90 jours sans amende initiale.",
    (15, "e3"): "DataSecure traite 340 demandes d'acc\u00e8s et 28 demandes d'effacement en 2024 via un portail d\u00e9di\u00e9.",
    (15, "e4"): "Le plan cybers\u00e9curit\u00e9 2025 pr\u00e9voit MFA g\u00e9n\u00e9ralis\u00e9e, chiffrement et pentests semestriels.",
    (15, "e5"): "Une violation de donn\u00e9es simul\u00e9e lors d'un exercice de crise en octobre 2024 teste la proc\u00e9dure 72 h.",
    (15, "e6"): "Un POC blockchain pour journaliser les acc\u00e8s admin est test\u00e9 sur un client pilote en f\u00e9vrier 2025.",
    (15, "e7"): "Le module privacy by design est int\u00e9gr\u00e9 au cycle de d\u00e9veloppement agile depuis juin 2024.",
    (15, "e8"): "Les contrats DPA avec AWS et OVH sont ren\u00e9goci\u00e9s en mars 2025 pour alignement RGPD renforc\u00e9.",
    (15, "e9"): "La campagne anti-phishing \u00ab DataSecure Aware \u00bb atteint 94 % de taux de compl\u00e9tion en d\u00e9cembre 2024.",
    (15, "e10"): "Une DPIA sur le module IA de d\u00e9tection d'anomalies est lanc\u00e9e en avril 2025 avant mise en production.",
    (15, "cas1"): "Le plan de mise en conformit\u00e9 post-contr\u00f4le CNIL est pr\u00e9sent\u00e9 au CODIR en juin 2024.",
    (15, "cas2"): "L'attaque ransomware du 14 mars 2025 affecte 12 clients et d\u00e9clenche la cellule de crise cyber-RGPD.",
}

QUOTES = {
    (11, "e1"): "In\u00e8s Moreau affirme : \u00ab Le client ne distingue plus le canal : il juge BanqueNord dans sa globalit\u00e9. \u00bb",
    (11, "e2"): "Laurent Girard rappelle : \u00ab Sans finalit\u00e9 document\u00e9e, la vue 360\u00b0 devient un risque RGPD, pas un atout. \u00bb",
    (11, "e3"): "Le directeur marketing estime : \u00ab Le social listening d\u00e9tecte des tendances six mois avant les barom\u00e8tres classiques. \u00bb",
    (11, "e4"): "In\u00e8s Moreau conclut : \u00ab L'omnicanalit\u00e9, c'est la m\u00eame promesse de service sur tous les points de contact. \u00bb",
    (11, "e5"): "Philippe Martin d\u00e9clare : \u00ab La d\u00e9mat\u00e9rialisation ne supprime pas le conseil : elle lib\u00e8re du temps pour la valeur ajout\u00e9e. \u00bb",
    (11, "e6"): "Philippe Martin insiste : \u00ab Sans coalition et quick wins, la transformation digitale reste un PowerPoint. \u00bb",
    (11, "e7"): "Un conseiller t\u00e9moigne : \u00ab Nos clients ruraux ne veulent pas d'une banque sans visage, mais d'un conseiller joignable. \u00bb",
    (11, "e8"): "Le DSI affirme : \u00ab La gouvernance SI aligne investissements, m\u00e9tiers et contraintes r\u00e9glementaires. \u00bb",
    (11, "e9"): "In\u00e8s Moreau admet : \u00ab L'agilit\u00e9 sans co-construction terrain cr\u00e9e des outils que personne n'utilise. \u00bb",
    (11, "e10"): "Philippe Martin r\u00e9sume : \u00ab La technologie n'est rien sans la confiance des conseillers et des clients. \u00bb",
    (11, "cas1"): "Philippe Martin promet : \u00ab Proximit\u00e9 augment\u00e9e, pas abandon des territoires. \u00bb",
    (11, "cas2"): "Le comit\u00e9 \u00e9thique exige : \u00ab L'IA assiste le conseiller ; elle ne d\u00e9cide jamais seule d'un refus de cr\u00e9dit. \u00bb",
    (12, "e1"): "Am\u00e9lie Renard affirme : \u00ab Communication interne et externe sont les deux faces d'une m\u00eame strat\u00e9gie. \u00bb",
    (12, "e2"): "Julien Fabre regrette : \u00ab Nous avions l'alerte Bangladesh 48 h avant la crise : l'ascendant n'a pas \u00e9t\u00e9 entendu. \u00bb",
    (12, "e3"): "Julien Fabre rappelle : \u00ab Vendre du vert sans preuves institutionnelles, c'est pr\u00e9parer une crise. \u00bb",
    (12, "e4"): "Le directeur marketing dit : \u00ab L'identit\u00e9 visuelle se contr\u00f4le ; l'image de marque se gagne. \u00bb",
    (12, "e5"): "La responsable social media alerte : \u00ab Six heures de silence en crise, c'est six heures de boycott. \u00bb",
    (12, "e6"): "Am\u00e9lie Renard reconna\u00eet : \u00ab Notre premier communiqu\u00e9 \u00e9tait juridique ; il fallait \u00eatre humain d\u00e8s l'heure 1. \u00bb",
    (12, "e7"): "Julien Fabre affirme : \u00ab La transparence RSE n'est pas un appendix : c'est le socle de la cr\u00e9dibilit\u00e9 commerciale. \u00bb",
    (12, "e8"): "Julien Fabre conclut : \u00ab Communication int\u00e9gr\u00e9e : un seul message, tous les canaux, z\u00e9ro contradiction. \u00bb",
    (12, "e9"): "Am\u00e9lie Renard fixe la r\u00e8gle : \u00ab Chaque euro communication doit \u00eatre reli\u00e9 \u00e0 un indicateur mesurable. \u00bb",
    (12, "e10"): "Julien Fabre recommande : \u00ab Post-crise, renforcer l'institutionnel avant de relancer le commercial. \u00bb",
    (12, "cas1"): "Am\u00e9lie Renard s'excuse publiquement : \u00ab Nous avons trahi la confiance ; voici notre plan de transparence. \u00bb",
    (12, "cas2"): "Julien Fabre promet : \u00ab Chaque all\u00e9gation durable sera prouv\u00e9e par un QR code tra\u00e7able. \u00bb",
    (13, "e1"): "\u00c9lodie Weiss affirme : \u00ab L'\u00e9thique n'est pas un co\u00fbt : c'est un filtre de d\u00e9cision quotidien. \u00bb",
    (13, "e2"): "\u00c9lodie Weiss d\u00e9clare : \u00ab Nous d\u00e9non\u00e7ons le greenwashing avec des preuves, pas des slogans. \u00bb",
    (13, "e3"): "La responsable RSE insiste : \u00ab Un reporting sinc\u00e8re accepte de montrer aussi nos limites. \u00bb",
    (13, "e4"): "La DRH affirme : \u00ab La diversit\u00e9 n'est pas un slogan RH : c'est une exigence de comp\u00e9tences et de justice. \u00bb",
    (13, "e5"): "\u00c9lodie Weiss estime : \u00ab Le m\u00e9c\u00e9nat structur\u00e9 d\u00e9passe le ch\u00e8que ponctuel du dirigeant. \u00bb",
    (13, "e6"): "Le pr\u00e9sident du comit\u00e9 \u00e9thique rappelle : \u00ab Prot\u00e9ger le lanceur d'alerte, c'est prot\u00e9ger l'entreprise. \u00bb",
    (13, "e7"): "\u00c9lodie Weiss affirme : \u00ab Notre responsabilit\u00e9 s'\u00e9tend \u00e0 toute la cha\u00eene, pas seulement \u00e0 l'usine strasbourgeoise. \u00bb",
    (13, "e8"): "Le DAF alerte : \u00ab Un conflit d'int\u00e9r\u00eats non trait\u00e9 co\u00fbte plus cher qu'un appel d'offres perdu. \u00bb",
    (13, "e9"): "La responsable compliance dit : \u00ab L'\u00e9thique se forme et se contr\u00f4le, comme la s\u00e9curit\u00e9 au travail. \u00bb",
    (13, "e10"): "\u00c9lodie Weiss conclut : \u00ab L'\u00e9thique sinc\u00e8re devient un actif strat\u00e9gique mesurable en appels d'offres. \u00bb",
    (13, "cas1"): "\u00c9lodie Weiss affirme : \u00ab Les faits v\u00e9rifiables battent les slogans verts de nos concurrents. \u00bb",
    (13, "cas2"): "\u00c9lodie Weiss promet : \u00ab Gouvernance renforc\u00e9e, achats externalis\u00e9s au comit\u00e9 \u00e9thique ind\u00e9pendant. \u00bb",
    (14, "e1"): "Yann Delorme affirme : \u00ab Le manager mesure des r\u00e9sultats, plus une carte de pointage. \u00bb",
    (14, "e2"): "Camille Arnaud estime : \u00ab Le t\u00e9l\u00e9travail est un droit n\u00e9goci\u00e9, pas un privil\u00e8ge discr\u00e9tionnaire. \u00bb",
    (14, "e3"): "Camille Arnaud rappelle : \u00ab La d\u00e9connexion prot\u00e8ge la sant\u00e9 et la qualit\u00e9 des livrables. \u00bb",
    (14, "e4"): "Yann Delorme conclut : \u00ab Comprendre les modes de vie des consultants, c'est retenir les talents. \u00bb",
    (14, "e5"): "Un manager projet t\u00e9moigne : \u00ab Les OKR ont remplac\u00e9 le contr\u00f4le de pr\u00e9sence sans perdre le pilotage. \u00bb",
    (14, "e6"): "Camille Arnaud affirme : \u00ab En hybride, la coh\u00e9sion se construit par des rituels, pas par l'open space. \u00bb",
    (14, "e7"): "Camille Arnaud alerte : \u00ab Trois burn-out, c'est trois alertes rouges sur notre mod\u00e8le hybride. \u00bb",
    (14, "e8"): "Camille Arnaud promet : \u00ab Corriger l'\u00e9cart d'acc\u00e8s au TT, c'est une question de parit\u00e9 concr\u00e8te. \u00bb",
    (14, "e9"): "Yann Delorme affirme : \u00ab TechLink Flex est notre argument num\u00e9ro un face aux ESN parisiennes. \u00bb",
    (14, "e10"): "Yann Delorme tranche : \u00ab Ni 100 % pr\u00e9sentiel, ni 100 % distance : l'arbitrage hybride est strat\u00e9gique. \u00bb",
    (14, "cas1"): "Yann Delorme reconna\u00eet : \u00ab Imposer le retour bureau sans dialogue a co\u00fbt\u00e9 huit d\u00e9parts en trois mois. \u00bb",
    (14, "cas2"): "Camille Arnaud s'engage : \u00ab D\u00e9connexion renforc\u00e9e, managers form\u00e9s, cellule d'\u00e9coute d\u00e9di\u00e9e. \u00bb",
    (15, "e1"): "Karim Benali affirme : \u00ab Le registre des traitements est notre boussole RGPD, pas une formalit\u00e9. \u00bb",
    (15, "e2"): "Karim Benali rappelle : \u00ab Une mise en demeure CNIL co\u00fbte moins qu'une amende, mais plus qu'une conformit\u00e9 anticip\u00e9e. \u00bb",
    (15, "e3"): "Karim Benali insiste : \u00ab Les droits des personnes ne sont pas n\u00e9gociables, m\u00eame pour un client strat\u00e9gique. \u00bb",
    (15, "e4"): "Claire Dubois affirme : \u00ab Cybers\u00e9curit\u00e9 et RGPD sont indissociables : prot\u00e9ger les donn\u00e9es, c'est prot\u00e9ger les personnes. \u00bb",
    (15, "e5"): "Claire Dubois alerte : \u00ab 72 heures pour notifier la CNIL : la pr\u00e9paration ne s'improvise pas le jour J. \u00bb",
    (15, "e6"): "Claire Dubois estime : \u00ab La blockchain peut renforcer la tra\u00e7abilit\u00e9, pas remplacer le DPO. \u00bb",
    (15, "e7"): "Karim Benali affirme : \u00ab Privacy by design co\u00fbte moins cher que la conformit\u00e9 a posteriori. \u00bb",
    (15, "e8"): "Karim Benali rappelle : \u00ab Un sous-traitant non conforme expose DataSecure autant que ses propres failles. \u00bb",
    (15, "e9"): "Claire Dubois conclut : \u00ab 94 % de formation anti-phishing, c'est une barri\u00e8re humaine indispensable. \u00bb",
    (15, "e10"): "Karim Benali affirme : \u00ab Toute IA traitant des donn\u00e9es personnelles exige une DPIA avant production. \u00bb",
    (15, "cas1"): "Karim Benali promet : \u00ab Z\u00e9ro amende CNIL gr\u00e2ce \u00e0 un plan de conformit\u00e9 ex\u00e9cut\u00e9 en 90 jours. \u00bb",
    (15, "cas2"): "Claire Dubois d\u00e9clare : \u00ab Le ransomware teste notre PRA, notre RGPD et notre communication de crise simultan\u00e9ment. \u00bb",
}

IMPACT = {
    (11, "e1"): "Cons\u00e9quence : le parcours phygital oriente la r\u00e9organisation du r\u00e9seau d'agences et le budget digital 2026.",
    (11, "e2"): "Cons\u00e9quence : la compl\u00e9tude profil \u00e0 89 % am\u00e9liore le taux de conversion cr\u00e9dit de 6 points en pilote.",
    (11, "e3"): "Cons\u00e9quence : l'option conseiller vid\u00e9o 48 h g\u00e9n\u00e8re 1 200 demandes en deux mois.",
    (11, "e4"): "Cons\u00e9quence : le taux de r\u00e9solution premier contact \u00e0 78 % r\u00e9duit les rappels de 22 %.",
    (11, "e5"): "Cons\u00e9quence : le d\u00e9lai dossier pr\u00eat passe de 21 \u00e0 12 jours sur 18 000 dossiers 2024.",
    (11, "e6"): "Cons\u00e9quence : 7 \u00e9tapes Kotter sur 8 valid\u00e9es \u00e0 M+18 cr\u00e9ditent la prochaine vague IA.",
    (11, "e7"): "Cons\u00e9quence : le mod\u00e8le hub conseil pilote limite les d\u00e9missions \u00e0 15 % sur les agences concern\u00e9es.",
    (11, "e8"): "Cons\u00e9quence : les incidents de production divis\u00e9s par quatre s\u00e9curisent la continuit\u00e9 bancaire.",
    (11, "e9"): "Cons\u00e9quence : le time-to-market virement instantan\u00e9 passe de 9 \u00e0 3 mois.",
    (11, "e10"): "Cons\u00e9quence : le co\u00fbt par agence recule de 22 % malgr\u00e9 12 fermetures programm\u00e9es.",
    (11, "cas1"): "Cons\u00e9quence : l'usage app mobile progresse de 25 % sur les communes touch\u00e9es gr\u00e2ce aux ateliers mairie.",
    (11, "cas2"): "Cons\u00e9quence : la contestation client viralis\u00e9e (12 000 partages) impose une r\u00e9ponse en moins de 24 h.",
    (12, "e1"): "Cons\u00e9quence : la campagne fusion r\u00e9duit les tensions inter-studios de 40 % en six mois.",
    (12, "e2"): "Cons\u00e9quence : l'alerte ascendante ignor\u00e9e a co\u00fbt\u00e9 48 h de retard en gestion de crise.",
    (12, "e3"): "Cons\u00e9quence : l'alignement commercial/institutionnel conditionne la cr\u00e9dibilit\u00e9 post-crise.",
    (12, "e4"): "Cons\u00e9quence : la notori\u00e9t\u00e9 assist\u00e9e progresse de 26 % \u00e0 34 % en huit mois.",
    (12, "e5"): "Cons\u00e9quence : Trustpilot chute de 4,2 \u00e0 3,1 en 48 h de crise sous-traitance.",
    (12, "e6"): "Cons\u00e9quence : le premier communiqu\u00e9 \u00e0 6 h est jug\u00e9 insuffisant par 68 % des internautes sond\u00e9s.",
    (12, "e7"): "Cons\u00e9quence : l'audit social ind\u00e9pendant restaure partiellement la confiance des m\u00e9dias.",
    (12, "e8"): "Cons\u00e9quence : la charte int\u00e9gr\u00e9e \u00e9vite les contradictions entre RP, digital et retail.",
    (12, "e9"): "Cons\u00e9quence : le ROI digital est estim\u00e9 \u00e0 3,2\u00d7 le budget m\u00e9dia sur la campagne Re-Thread.",
    (12, "e10"): "Cons\u00e9quence : le budget 2026 r\u00e9alloue 8 points vers l'institutionnel post-crise.",
    (12, "cas1"): "Cons\u00e9quence : #BoycottModeAndCo atteint 2,4 M d'impressions et menace 8 % du CA e-commerce trimestriel.",
    (12, "cas2"): "Cons\u00e9quence : le rebranding durable exige des preuves tra\u00e7ables pour \u00e9viter un second boycott.",
    (13, "e1"): "Cons\u00e9quence : l'appel d'offres 2,4 M\u20ac est remport\u00e9 gr\u00e2ce \u00e0 la r\u00e9putation \u00e9thique.",
    (13, "e2"): "Cons\u00e9quence : le signalement DGCCRF acc\u00e9l\u00e8re le contr\u00f4le du concurrent GreenWrap.",
    (13, "e3"): "Cons\u00e9quence : le reporting sinc\u00e8re diff\u00e9rencie GreenPack des concurrents RSE washing.",
    (13, "e4"): "Cons\u00e9quence : l'audit recrutement corrige trois pratiques discriminatoires en six mois.",
    (13, "e5"): "Cons\u00e9quence : le m\u00e9c\u00e9nat structur\u00e9 renforce l'image employeur locale.",
    (13, "e6"): "Cons\u00e9quence : deux alertes \u00e9thiques aboutissent \u00e0 des mesures correctives sans fuite m\u00e9diatique.",
    (13, "e7"): "Cons\u00e9quence : l'audit supply chain \u00e9vite le renouvellement d'un sous-traitant non conforme.",
    (13, "e8"): "Cons\u00e9quence : le conflit d'int\u00e9r\u00eats achats entra\u00eene une d\u00e9mission et une refonte des proc\u00e9dures.",
    (13, "e9"): "Cons\u00e9quence : 120 salari\u00e9s form\u00e9s r\u00e9duisent les risques de non-conformit\u00e9 \u00e9thique.",
    (13, "e10"): "Cons\u00e9quence : l'\u00e9thique devient un crit\u00e8re de diff\u00e9renciation dans 60 % des AO 2025.",
    (13, "cas1"): "Cons\u00e9quence : l'affaire GreenWrap renforce la notori\u00e9t\u00e9 \u00e9thique de GreenPack aupr\u00e8s de la GMS.",
    (13, "cas2"): "Cons\u00e9quence : la crise gouvernance impose une assembl\u00e9e extraordinaire et un audit externe.",
    (14, "e1"): "Cons\u00e9quence : le NPS projets \u00e0 62 valide le mod\u00e8le hybride par objectifs.",
    (14, "e2"): "Cons\u00e9quence : les co\u00fbts immobiliers reculent de 22 % gr\u00e2ce aux bureaux flex.",
    (14, "e3"): "Cons\u00e9quence : la charte d\u00e9connexion r\u00e9duit les connexions nocturnes de 34 %.",
    (14, "e4"): "Cons\u00e9quence : 64 % des consultants citent l'\u00e9quilibre vie pro/perso comme priorit\u00e9 num\u00e9ro un.",
    (14, "e5"): "Cons\u00e9quence : les OKR trimestriels am\u00e9liorent la satisfaction client de 11 points en un an.",
    (14, "e6"): "Cons\u00e9quence : les rituels hybrides stabilisent le turnover \u00e0 14 % contre 22 % en 2023.",
    (14, "e7"): "Cons\u00e9quence : le plan QVT post-burn-out r\u00e9duit l'absent\u00e9isme de 2,1 points.",
    (14, "e8"): "Cons\u00e9quence : l'\u00e9cart d'acc\u00e8s TT de 12 points d\u00e9clenche un plan parit\u00e9 cibl\u00e9.",
    (14, "e9"): "Cons\u00e9quence : TechLink Flex g\u00e9n\u00e8re 340 candidatures qualifi\u00e9es en six semaines.",
    (14, "e10"): "Cons\u00e9quence : l'arbitrage 40 % pr\u00e9sentiel minimum sera n\u00e9goci\u00e9 avec les syndicats en septembre 2025.",
    (14, "cas1"): "Cons\u00e9quence : huit d\u00e9missions en trois mois co\u00fbtent 280 000 \u20ac en recrutement et perte de comp\u00e9tences.",
    (14, "cas2"): "Cons\u00e9quence : 4 200 partages LinkedIn imposent une r\u00e9ponse RH publique sous 48 h.",
    (15, "e1"): "Cons\u00e9quence : le retrait du module profilage \u00e9vite un risque sanction majeur CNIL.",
    (15, "e2"): "Cons\u00e9quence : le d\u00e9lai d'acc\u00e8s passe de 45 \u00e0 22 jours en 90 jours post-contr\u00f4le.",
    (15, "e3"): "Cons\u00e9quence : 340 demandes d'acc\u00e8s trait\u00e9es renforcent la confiance des clients PME.",
    (15, "e4"): "Cons\u00e9quence : le plan cybers\u00e9curit\u00e9 2025 r\u00e9duit les incidents de 38 % en pilote.",
    (15, "e5"): "Cons\u00e9quence : l'exercice de crise valide la proc\u00e9dure notification 72 h.",
    (15, "e6"): "Cons\u00e9quence : le POC blockchain am\u00e9liore l'auditabilit\u00e9 des acc\u00e8s admin de 90 %.",
    (15, "e7"): "Cons\u00e9quence : privacy by design r\u00e9duit de 40 % les retouches conformit\u00e9 en fin de projet.",
    (15, "e8"): "Cons\u00e9quence : les DPA ren\u00e9goci\u00e9s couvrent 100 % des sous-traitants critiques.",
    (15, "e9"): "Cons\u00e9quence : le taux de clic phishing simul\u00e9 chute de 18 % \u00e0 4 % apr\u00e8s formation.",
    (15, "e10"): "Cons\u00e9quence : la DPIA IA identifie trois risques \u00e9lev\u00e9s avant mise en production.",
    (15, "cas1"): "Cons\u00e9quence : z\u00e9ro amende CNIL apr\u00e8s mise en conformit\u00e9 en 90 jours.",
    (15, "cas2"): "Cons\u00e9quence : l'attaque ransomware du 14 mars affecte 12 clients et d\u00e9clenche 340 notifications.",
}


def enrich_support(ch: int, sid: str, base: str) -> str:
    from management_enrich_common import enrich_support as _enrich

    return _enrich(
        ch,
        sid,
        base,
        intro=CHAPTER_INTRO.get(ch, ""),
        context=CONTEXT,
        quotes={},
        impact=IMPACT,
    )


def parse_sections(corr: str):
    import re

    chunks = re.split(r"\n\n(?=\d+\))", corr.strip())
    sections = []
    for chunk in chunks:
        m = re.match(r"(\d+\))\s*(.+?):\s*\n?(.*)", chunk, re.S)
        if m:
            sections.append((m.group(1), m.group(2).strip(), m.group(3).strip()))
        else:
            sections.append(("", chunk.strip(), ""))
    return sections


def _lines_to_bullets(body: str):
    bullets = []
    for line in body.split("\n"):
        line = line.strip()
        if not line:
            continue
        if line.startswith("- ") or line.startswith("\u2014 ") or line.startswith("* "):
            bullets.append(line.lstrip("-*\u2014 ").strip())
        else:
            for sent in line.replace("\n", " ").split(". "):
                s = sent.strip()
                if s:
                    if not s.endswith("."):
                        s += "."
                    bullets.append(s)
    return bullets


def enrich_correction(ch: int, sid: str, corr: str, attendu: str) -> str:
    from management_enrich_common import enrich_correction as _enrich

    key = (ch, sid)
    return _enrich(ch, sid, corr, attendu, NOTIONS.get(key, []))
