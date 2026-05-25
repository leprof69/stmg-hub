# -*- coding: utf-8 -*-
"""Enrichment metadata for Management chapters 6-10."""

D = "\u2014 "

CHAPTER_INTRO = {
    6: (
        "Caf\u00e9Rouge est un restaurant gastronomique fond\u00e9 en 2018 sur les quais de Bordeaux "
        "par Isabelle Garnier. L'\u00e9tablissement emploie 38 salari\u00e9s (22 en salle, 12 en cuisine, "
        "4 en administration) et sert en moyenne 78 couverts par jour. Marc Delorme, directeur financier, "
        "pilote le contr\u00f4le de gestion depuis janvier 2024."
    ),
    7: (
        "Plastiform est une PME st\u00e9phanoise de plasturgie (CA 22 M\u20ac, 210 salari\u00e9s) "
        "dirig\u00e9e par Nathalie Perrin depuis 2019. L'usine produit des pi\u00e8ces pour l'automobile "
        "et l'\u00e9lectrom\u00e9nager. Le directeur SI, Karim Benali, coordonne la transformation "
        "num\u00e9rique depuis le comit\u00e9 Industrie 4.0 lanc\u00e9 en mars 2023."
    ),
    8: (
        "Mobili\u00e8re Plus, fabricant de meubles bas\u00e9 \u00e0 Laval (CA 35 M\u20ac, 220 salari\u00e9s), "
        "est dirig\u00e9e par Fran\u00e7ois Leclerc depuis 2016. L'usine combine production en s\u00e9rie "
        "standard et gamme premium diff\u00e9renci\u00e9e. La responsable production, Claire Dubois, "
        "a initi\u00e9 la d\u00e9marche lean en septembre 2022 avec l'appui d'un consultant Toyota Way."
    ),
    9: (
        "CleanEco, entreprise de nettoyage professionnel bas\u00e9e \u00e0 Montpellier (CA 9 M\u20ac, "
        "320 agents), a \u00e9t\u00e9 fond\u00e9e en 2010 par Mehdi Sa\u00efd, ancien agent de propret\u00e9. "
        "La DRH Sophie Martin g\u00e8re les relations sociales et la culture d'entreprise. "
        "CleanEco intervient sur 180 sites (bureaux, h\u00f4pitaux, a\u00e9roports) en Occitanie."
    ),
    10: (
        "ServicePlus, soci\u00e9t\u00e9 de services B2B parisienne (CA 15 M\u20ac, 180 salari\u00e9s), "
        "est pr\u00e9sid\u00e9e par \u00c9ric Fontaine depuis 2017. Elle accompagne des PME dans "
        "l'externalisation administrative et IT. La DRH Camille Renard pilote la politique "
        "de motivation et le dialogue social depuis la NAO 2023."
    ),
}

CONTEXT = {
    (6, "e1"): "En octobre 2025, Marc Delorme pr\u00e9sente la classification des charges au comit\u00e9 de direction familial.",
    (6, "e2"): "L'exercice 2025 se cl\u00f4ture le 31 d\u00e9cembre ; le commissaire aux comptes attend un compte de r\u00e9sultat coh\u00e9rent.",
    (6, "e3"): "L'analyse porte sur la semaine du 14 au 20 octobre 2025, p\u00e9riode creuse avant les f\u00eates.",
    (6, "e4"): "Le budget 2026 int\u00e8gre une hypoth\u00e8se de croissance de 4 % du nombre de couverts.",
    (6, "e5"): "La simulation est r\u00e9alis\u00e9e en novembre 2025 sur la base du compte de r\u00e9sultat pr\u00e9visionnel.",
    (6, "e6"): "Le chef \u00e9toil\u00e9 Antoine Mercier supervise 12 commis et insiste sur la tra\u00e7abilit\u00e9 des produits.",
    (6, "e7"): "L'\u00e9v\u00e9nement priv\u00e9 du 12 octobre 2025 (mariage, 120 couverts) a mobilis\u00e9 toute l'\u00e9quipe.",
    (6, "e8"): "Le conseil municipal des Chartrons a valid\u00e9 le permis d'am\u00e9nager le 15 septembre 2025.",
    (6, "e9"): "Le dashboard est aliment\u00e9 automatiquement par le logiciel de caisse Lightspeed et l'ERP restauration.",
    (6, "e10"): "Le comit\u00e9 strat\u00e9gique se r\u00e9unit le 20 novembre 2025 pour arbitrer la r\u00e9ponse \u00e0 l'inflation.",
    (6, "cas1"): "R\u00e9union d'urgence le 5 novembre 2025 : Isabelle Garnier fixe un objectif de retour \u00e0 l'\u00e9quilibre avant le 30 avril 2026.",
    (6, "cas2"): "Note d'investissement r\u00e9dig\u00e9e par Marc Delorme pour le comit\u00e9 familial du 10 d\u00e9cembre 2025.",
    (7, "e1"): "Le d\u00e9ploiement ERP/MES a d\u00e9but\u00e9 en janvier 2023 et s'est achev\u00e9 en juin 2024.",
    (7, "e2"): "L'investissement robotique est financ\u00e9 par un emprunt de 1,8 M\u20ac sur sept ans contract\u00e9 en avril 2024.",
    (7, "e3"): "Le projet RPA est men\u00e9 avec le prestataire UiPath ; le go-live a eu lieu le 1er mars 2025.",
    (7, "e4"): "La d\u00e9mat\u00e9rialisation atelier est test\u00e9e sur la ligne injection n\u00b03 depuis ao\u00fbt 2024.",
    (7, "e5"): "Le processus non-conformit\u00e9 a \u00e9t\u00e9 cartographi\u00e9 lors d'un atelier BPM en f\u00e9vrier 2025.",
    (7, "e6"): "Les capteurs IoT sont install\u00e9s sur 8 presses sur 14 ; le d\u00e9ploiement complet est pr\u00e9vu fin 2026.",
    (7, "e7"): "Le contrat Azure sign\u00e9 en d\u00e9cembre 2024 pr\u00e9voit un SLA de 99,5 % de disponibilit\u00e9.",
    (7, "e8"): "Le mod\u00e8le ML est entra\u00een\u00e9 sur 18 mois de donn\u00e9es capteurs (janvier 2023 \u2013 juin 2024).",
    (7, "e9"): "Le comit\u00e9 d'investissement valide les projets num\u00e9riques le 18 septembre 2025.",
    (7, "e10"): "La feuille de route 2025-2028 est pr\u00e9sent\u00e9e au CODIR le 22 octobre 2025.",
    (7, "cas1"): "Le client automotive Renault exige une tra\u00e7abilit\u00e9 lot par lot d'ici juin 2026.",
    (7, "cas2"): "L'attaque ransomware survient un vendredi 14 mars 2025 \u00e0 6 h du matin.",
    (8, "e1"): "L'organisation actuelle date de la cr\u00e9ation de l'usine en 2008 ; un audit interne est r\u00e9alis\u00e9 en 2024.",
    (8, "e2"): "Le projet kanban est pilot\u00e9 avec le fournisseur Panneaux Atlantique depuis janvier 2024.",
    (8, "e3"): "La VSM initiale est r\u00e9alis\u00e9e en atelier avec 15 op\u00e9rateurs et 4 encadrants en mars 2023.",
    (8, "e4"): "Claire Dubois a suivi une formation Mintzberg \u00e0 l'EM Lyon en octobre 2024.",
    (8, "e5"): "Le cercle qualit\u00e9 hebdomadaire r\u00e9unit 8 op\u00e9rateurs et 2 cadres chaque mardi \u00e0 7 h.",
    (8, "e6"): "Le CSE a obtenu un accord le 12 juin 2025 sur les pauses et l'ergonomie postes.",
    (8, "e7"): "Le goulet finition est identifi\u00e9 lors de la VSM de septembre 2024.",
    (8, "e8"): "La cellule premium U a \u00e9t\u00e9 inaugur\u00e9e en janvier 2025 pour la gamme haut de gamme.",
    (8, "e9"): "Le tableau de bord est affich\u00e9 en visuel management \u00e0 l'entr\u00e9e de chaque atelier.",
    (8, "e10"): "Le pic Black Friday 2025 est anticip\u00e9 pour la p\u00e9riode 24 novembre \u2013 3 d\u00e9cembre.",
    (8, "cas1"): "Trois clients enseigne menacent de r\u00e9silier leurs contrats cadre si l'OTD reste sous 90 %.",
    (8, "cas2"): "Le projet usine Laval 2 est lanc\u00e9 en conseil d'administration le 8 janvier 2025.",
    (9, "e1"): "CleanEco emploie 25 encadrants, 320 agents, un CSE de 11 membres et des d\u00e9l\u00e9gu\u00e9s CGT/CFDT.",
    (9, "e2"): "La NAO 2025 d\u00e9marre le 15 janvier ; les syndicats d\u00e9posent un cahier des revendications le 22 janvier.",
    (9, "e3"): "L'enqu\u00eate culture interne est diffus\u00e9e en septembre 2025 aupr\u00e8s de 280 agents.",
    (9, "e4"): "L'immeuble tertiaire \u00ab Le Mill\u00e9naire \u00bb \u00e0 Montpellier fait l'objet d'un contrat de 180 000 \u20ac/an.",
    (9, "e5"): "Le RSE interne \u00ab CleanConnect \u00bb est d\u00e9ploy\u00e9 sur Microsoft Viva Engage en avril 2024.",
    (9, "e6"): "L'accord QVT sign\u00e9 le 28 f\u00e9vrier 2024 couvre 320 agents sur trois ans.",
    (9, "e7"): "La gr\u00e8ve a\u00e9roport dure 48 h les 3 et 4 mars 2025 ; 40 agents sur 45 sont mobilis\u00e9s.",
    (9, "e8"): "La communaut\u00e9 eco-nettoyage est lanc\u00e9e en juin 2024 avec un budget formation de 12 000 \u20ac.",
    (9, "e9"): "L'enqu\u00eate engagement est r\u00e9alis\u00e9e par un cabinet externe en octobre 2024.",
    (9, "e10"): "L'appel d'offres h\u00f4pital Montpellier cl\u00f4ture le 30 novembre 2025 ; soutenance le 15 d\u00e9cembre.",
    (9, "cas1"): "Le m\u00e9dia \u00ab La Gazette de Montpellier \u00bb publie un article sur la gr\u00e8ve le 5 mars 2025.",
    (9, "cas2"): "Le concurrent EcoClean propose 0 contrat d'insertion v\u00e9rifiable dans son m\u00e9moire technique.",
    (10, "e1"): "ServicePlus compte 45 managers r\u00e9partis entre bureau d'\u00e9tudes (28), astreinte (12) et direction (5).",
    (10, "e2"): "L'enqu\u00eate motivation est diffus\u00e9e en septembre 2025 aupr\u00e8s des 180 salari\u00e9s.",
    (10, "e3"): "La grille variable commerciale est revue chaque trimestre depuis 2023.",
    (10, "e4"): "Le programme ambassadeurs est lanc\u00e9 en janvier 2025 avec 24 volontaires.",
    (10, "e5"): "Trois comit\u00e9s projet autonomes sont actifs depuis mars 2025.",
    (10, "e6"): "Peakon est d\u00e9ploy\u00e9 en juin 2024 ; les entretiens passent de annuels \u00e0 semestriels.",
    (10, "e7"): "La formation d\u00e9l\u00e9gation est assur\u00e9e par un cabinet RH les 14-15 mai 2025.",
    (10, "e8"): "L'enqu\u00eate d\u00e9part 2024 analyse 12 d\u00e9missions de cadres sur 63 postes.",
    (10, "e9"): "La NAO 2025 se tient du 10 au 28 f\u00e9vrier avec trois s\u00e9ances de n\u00e9gociation.",
    (10, "e10"): "La fusion avec NexCare (620 salari\u00e9s) est annonc\u00e9e le 1er juillet 2025.",
    (10, "cas1"): "Le turnover commercial co\u00fbte 540 000 \u20ac en 2024 selon l'audit RH interne.",
    (10, "cas2"): "Le budget formation fusion s'\u00e9l\u00e8ve \u00e0 180 000 \u20ac sur 18 mois.",
}

QUOTES = {
    (6, "e1"): "Isabelle Garnier commente : \u00ab Nous servons plus de couverts mais nous perdons de l'argent : les loyers quais ne fl\u00e9chissent pas. \u00bb",
    (6, "e2"): "Marc Delorme pr\u00e9vient : \u00ab Le SR th\u00e9orique ne suffit pas si nos \u00e9carts op\u00e9rationnels d\u00e9rapent. \u00bb",
    (6, "e3"): "Antoine Mercier estime que \u00ab promouvoir le d\u00eener est plus rentable que brader le d\u00e9jeuner \u00bb.",
    (6, "e4"): "Le responsable salle note : \u00ab En janvier, nous sommes \u00e0 45 couverts : il faut anticiper la tr\u00e9sorerie. \u00bb",
    (6, "e5"): "L'analyste financier rappelle : \u00ab Au-dessus du SR, chaque euro de CA p\u00e8se double sur le r\u00e9sultat. \u00bb",
    (6, "e6"): "Le contr\u00f4leur de gestion alerte : \u00ab Trois points de ratio mati\u00e8res, c'est 72 000 \u20ac de marge en moins sur l'ann\u00e9e. \u00bb",
    (6, "e7"): "Marc Delorme conclut : \u00ab Double \u00e9cart d\u00e9favorable : masse et CA, il faut agir avant novembre. \u00bb",
    (6, "e8"): "Isabelle Garnier h\u00e9site : \u00ab Le SR est bon sur le papier, mais o\u00f9 trouver 120 000 \u20ac d'am\u00e9nagement ? \u00bb",
    (6, "e9"): "Le chef de cuisine affirme : \u00ab Sans dashboard hebdo, nous d\u00e9couvrons les d\u00e9rives trop tard. \u00bb",
    (6, "e10"): "Le contr\u00f4leur simule : \u00ab Sans r\u00e9action, notre marge passe de 42 % \u00e0 39 % en six mois. \u00bb",
    (6, "cas1"): "Isabelle Garnier fixe l'objectif : \u00ab R\u00e9sultat positif avant le 30 avril 2026, sans licenciement. \u00bb",
    (6, "cas2"): "Marc Delorme recommande : \u00ab Go conditionnel si le site 1 est d'abord r\u00e9\u00e9quilibr\u00e9. \u00bb",
    (7, "e1"): "Karim Benali affirme : \u00ab L'ERP est le chef d'orchestre, le MES est les yeux de l'atelier. \u00bb",
    (7, "e2"): "Nathalie Perrin insiste : \u00ab Les robots lib\u00e8rent nos op\u00e9rateurs des postes p\u00e9nibles. \u00bb",
    (7, "e3"): "Le DAF estime : \u00ab La RPA rembourse son investissement en moins d'un an. \u00bb",
    (7, "e4"): "Un op\u00e9rateur t\u00e9moigne : \u00ab Plus de paperasse : je scanne, je valide, c'est trac\u00e9. \u00bb",
    (7, "e5"): "Le responsable qualit\u00e9 note : \u00ab Le BPM a divis\u00e9 par huit le d\u00e9lai de traitement NC. \u00bb",
    (7, "e6"): "Le chef maintenance d\u00e9clare : \u00ab Nous changeons les composants avant la panne, pas apr\u00e8s. \u00bb",
    (7, "e7"): "Apr\u00e8s la panne de mars 2025, Karim Benali jure : \u00ab Plus jamais 4 h sans production. \u00bb",
    (7, "e8"): "Le data scientist affirme : \u00ab 87 % de pr\u00e9diction correcte, c'est d\u00e9j\u00e0 un gain net. \u00bb",
    (7, "e9"): "Le comit\u00e9 valide : \u00ab Payback 2,2 ans, ROI 46 % : le projet IoT passe. \u00bb",
    (7, "e10"): "Nathalie Perrin tranche : \u00ab Quick wins d'abord, ERP qualit\u00e9 en phase 2. \u00bb",
    (7, "cas1"): "Le client automotive rappelle : \u00ab Tra\u00e7abilit\u00e9 lot par lot sous 18 mois, sinon rupture contrat. \u00bb",
    (7, "cas2"): "Le PDG annonce : \u00ab 180 000 \u20ac de CA perdus en 36 h : inacceptable. \u00bb",
    (8, "e1"): "Fran\u00e7ois Leclerc admet : \u00ab La productivit\u00e9 est l\u00e0, mais le turnover sur postes r\u00e9p\u00e9titifs nous co\u00fbte cher. \u00bb",
    (8, "e2"): "Claire Dubois affirme : \u00ab Le kanban a lib\u00e9r\u00e9 420 000 \u20ac de BFR en dix-huit mois. \u00bb",
    (8, "e3"): "Un op\u00e9rateur kaizen t\u00e9moigne : \u00ab 80 petits projets valent mieux qu'une r\u00e9volution. \u00bb",
    (8, "e4"): "Claire Dubois explique : \u00ab En premium, l'ajustement mutuel bat la proc\u00e9dure rigide. \u00bb",
    (8, "e5"): "Le chef d'atelier d\u00e9coupe dit : \u00ab Chez nous, l'info remonte, elle ne descend plus seulement. \u00bb",
    (8, "e6"): "Le d\u00e9l\u00e9gu\u00e9 CSE pr\u00e9vient : \u00ab Le lean ne doit pas rimer avec burn-out. \u00bb",
    (8, "e7"): "Claire Dubois conclut : \u00ab Prot\u00e9ger le goulot, c'est prot\u00e9ger tout le flux. \u00bb",
    (8, "e8"): "Un op\u00e9rateur cellule U affirme : \u00ab Polyvalence et autonomie, c'est motivant. \u00bb",
    (8, "e9"): "Le directeur industriel fixe la cible : \u00ab OTD 97 % en 2026, pas de compromis. \u00bb",
    (8, "e10"): "Claire Dubois alerte : \u00ab 2 500 pi\u00e8ces manquantes sur dix jours : il faut une strat\u00e9gie mixte. \u00bb",
    (8, "cas1"): "Un client enseigne menace : \u00ab 120 000 \u20ac de p\u00e9nalit\u00e9s si l'OTD reste sous 90 %. \u00bb",
    (8, "cas2"): "Fran\u00e7ois Leclerc promet : \u00ab Laval 2 sera lean d\u00e8s la conception, pas en rattrapage. \u00bb",
    (9, "e1"): "Mehdi Sa\u00efd rappelle : \u00ab J'ai \u00e9t\u00e9 agent : je connais leurs attentes autant que celles des actionnaires. \u00bb",
    (9, "e2"): "Sophie Martin affirme : \u00ab La QVT profite aux agents ET \u00e0 la satisfaction clients. \u00bb",
    (9, "e3"): "Un agent enqu\u00eat\u00e9 dit : \u00ab On affiche respect et \u00e9cologie, mais le mat\u00e9riel est us\u00e9. \u00bb",
    (9, "e4"): "La RH conclut : \u00ab Sans m\u00e9diation, le conflit zones aurait dur\u00e9 des mois. \u00bb",
    (9, "e5"): "Sophie Martin estime : \u00ab CleanConnect rapproche les agents \u00e9loign\u00e9s g\u00e9ographiquement. \u00bb",
    (9, "e6"): "Le pr\u00e9sident CSE d\u00e9clare : \u00ab La NAO 2024 est un compromis, pas une victoire totale. \u00bb",
    (9, "e7"): "Le client a\u00e9roport met en demeure : \u00ab Continuit\u00e9 de service ou r\u00e9siliation du contrat 1,2 M\u20ac. \u00bb",
    (9, "e8"): "Un expert eco-nettoyage affirme : \u00ab Partager les fiches m\u00e9thodes a uniformis\u00e9 la qualit\u00e9. \u00bb",
    (9, "e9"): "Sophie Martin fixe l'objectif : \u00ab Score engagement 75/100 d'ici fin 2025. \u00bb",
    (9, "e10"): "Mehdi Sa\u00efd admet : \u00ab Notre turnover affaiblit l'argument QVT face au concurrent. \u00bb",
    (9, "cas1"): "Sophie Martin propose : \u00ab Prime partielle + QVT : chercher le win-win, pas la victoire. \u00bb",
    (9, "cas2"): "Le responsable RSE h\u00f4pital exige : \u00ab Preuves auditables, pas de discours vert. \u00bb",
    (10, "e1"): "\u00c9ric Fontaine affirme : \u00ab Un bon manager adapte son style au contexte, pas l'inverse. \u00bb",
    (10, "e2"): "Camille Renard note : \u00ab La reconnaissance p\u00e8se plus que le bonus pour 58 % des salari\u00e9s. \u00bb",
    (10, "e3"): "Un commercial junior se plaint : \u00ab 41 k\u20ac vs 58 k\u20ac : o\u00f9 est l'\u00e9quit\u00e9 ? \u00bb",
    (10, "e4"): "Un ambassadeur t\u00e9moigne : \u00ab Ce projet me donne du sens, pas seulement un salaire. \u00bb",
    (10, "e5"): "\u00c9ric Fontaine d\u00e9clare : \u00ab D\u00e9l\u00e9guer le budget, c'est d\u00e9l\u00e9guer la confiance. \u00bb",
    (10, "e6"): "Camille Renard affirme : \u00ab Le feedback continu bat l'entretien annuel d\u00e9connect\u00e9. \u00bb",
    (10, "e7"): "Un manager form\u00e9 dit : \u00ab Fixer les KPI, laisser l'autonomie sur les moyens. \u00bb",
    (10, "e8"): "Camille Renard alerte : \u00ab 540 000 \u20ac de turnover cadres, c'est insoutenable. \u00bb",
    (10, "e9"): "Le pr\u00e9sident CSE juge : \u00ab +2,8 % c'est au-dessus de l'inflation, mais en dessous de nos attentes. \u00bb",
    (10, "e10"): "\u00c9ric Fontaine promet : \u00ab Fusion oui, mais charte management co-construite. \u00bb",
    (10, "cas1"): "Camille Renard fixe la cible : \u00ab Turnover commercial 12 % en douze mois. \u00bb",
    (10, "cas2"): "\u00c9ric Fontaine conclut : \u00ab 70 % des managers consultatifs+ \u00e0 18 mois, sinon \u00e9chec fusion. \u00bb",
}

IMPACT = {
    (6, "e1"): "Cons\u00e9quence : le r\u00e9sultat d'exploitation recule de 18 000 \u20ac malgr\u00e9 +6 % de couverts.",
    (6, "e2"): "Cons\u00e9quence : l'\u00e9cart entre SR th\u00e9orique et r\u00e9sultat r\u00e9el fragilise la cr\u00e9dibilit\u00e9 aupr\u00e8s de la banque.",
    (6, "e3"): "Cons\u00e9quence : orienter la client\u00e8le vers le soir r\u00e9duirait le point mort de 4 000 couverts/an.",
    (6, "e4"): "Cons\u00e9quence : janvier g\u00e9n\u00e8re un d\u00e9ficit mensuel estim\u00e9 \u00e0 8 500 \u20ac.",
    (6, "e5"): "Cons\u00e9quence : une baisse de 10 % du CA sous le SR pourrait tripler les pertes.",
    (6, "e6"): "Cons\u00e9quence : revenir \u00e0 28 % lib\u00e8rerait environ 72 000 \u20ac de marge annuelle.",
    (6, "e7"): "Cons\u00e9quence : le double \u00e9cart d\u00e9grade le r\u00e9sultat d'octobre de 9 200 \u20ac.",
    (6, "e8"): "Cons\u00e9quence : un report de six mois co\u00fbterait environ 45 000 \u20ac de CA pr\u00e9visionnel perdu.",
    (6, "e9"): "Cons\u00e9quence : le retard SR cumul\u00e9 impose une promo cibl\u00e9e d\u00e8cembre (+12 % couverts vis\u00e9s).",
    (6, "e10"): "Cons\u00e9quence : l'inaction ferait passer le SR de 428 571 \u20ac \u00e0 464 000 \u20ac.",
    (6, "cas1"): "Cons\u00e9quence : sans plan, la tr\u00e9sorerie sera n\u00e9gative de 35 000 \u20ac au 31 mars 2026.",
    (6, "cas2"): "Cons\u00e9quence : la cannibalisation pourrait r\u00e9duire le CA site 1 de 120 000 \u20ac/an.",
    (7, "e1"): "Cons\u00e9quence : le taux de service client progresse de 91 % \u00e0 97 % en dix-huit mois.",
    (7, "e2"): "Cons\u00e9quence : 17 postes manutention sont reclass\u00e9s en maintenance et contr\u00f4le qualit\u00e9.",
    (7, "e3"): "Cons\u00e9quence : 1,5 ETP comptabilit\u00e9 sont r\u00e9affect\u00e9s au contr\u00f4le de gestion analytique.",
    (7, "e4"): "Cons\u00e9quence : les d\u00e9lais de traitement des non-conformit\u00e9s chutent de 48 h \u00e0 6 h.",
    (7, "e5"): "Cons\u00e9quence : le taux de reprise qualit\u00e9 baisse de 2,4 % \u00e0 1,1 % en six mois.",
    (7, "e6"): "Cons\u00e9quence : les arr\u00eats non planifi\u00e9s reculent de 40 h \u00e0 24 h par an et par presse.",
    (7, "e7"): "Cons\u00e9quence : la panne de mars 2025 a co\u00fbt\u00e9 180 000 \u20ac de CA et 3 alertes clients.",
    (7, "e8"): "Cons\u00e9quence : 13 % d'erreurs de pr\u00e9diction n\u00e9cessitent une validation humaine syst\u00e9matique.",
    (7, "e9"): "Cons\u00e9quence : le projet IoT est valid\u00e9 avec un budget formation de 180 000 \u20ac sur 3 ans.",
    (7, "e10"): "Cons\u00e9quence : la priorit\u00e9 RPA lib\u00e8re 120 000 \u20ac de tr\u00e9sorerie pour l'ann\u00e9e 1.",
    (7, "cas1"): "Cons\u00e9quence : un retard tra\u00e7abilit\u00e9 expose Plastiform \u00e0 4,2 M\u20ac de contrats automotive.",
    (7, "cas2"): "Cons\u00e9quence : trois clients automotive exigent un audit cybers\u00e9curit\u00e9 sous 60 jours.",
    (8, "e1"): "Cons\u00e9quence : le turnover 16 % co\u00fbte environ 280 000 \u20ac/an en recrutement et formation.",
    (8, "e2"): "Cons\u00e9quence : la rupture de novembre 2025 retarde trois livraisons enseigne de cinq jours.",
    (8, "e3"): "Cons\u00e9quence : le lead time passe de 18 \u00e0 12 jours, soit \u221233 % en dix-huit mois.",
    (8, "e4"): "Cons\u00e9quence : l'OTD progresse de 87 % \u00e0 94 % gr\u00e2ce \u00e0 la coordination renforc\u00e9e.",
    (8, "e5"): "Cons\u00e9quence : 80 kaizen/an g\u00e9n\u00e8rent une productivit\u00e9 +12 % en deux ans.",
    (8, "e6"): "Cons\u00e9quence : l'absent\u00e9isme recule de 6,2 % \u00e0 5,1 % apr\u00e8s l'accord CSE.",
    (8, "e7"): "Cons\u00e9quence : le buffer de 50 pi\u00e8ces \u00e9vite 12 ruptures de flux en trimestre 4.",
    (8, "e8"): "Cons\u00e9quence : la cellule premium affiche un taux de rebuts de 0,6 % vs 1,2 % en ligne flow.",
    (8, "e9"): "Cons\u00e9quence : le WIP r\u00e9duit de 20 % lib\u00e8re 180 000 \u20ac de fonds de roulement.",
    (8, "e10"): "Cons\u00e9quence : refuser des commandes p\u00e9naliserait 400 000 \u20ac de CA sur dix jours.",
    (8, "cas1"): "Cons\u00e9quence : les p\u00e9nalit\u00e9s contractuelles atteignent d\u00e9j\u00e0 120 000 \u20ac cumul\u00e9es.",
    (8, "cas2"): "Cons\u00e9quence : le CSE exige un protocole social avant toute r\u00e9duction d'effectif.",
    (9, "e1"): "Cons\u00e9quence : ignorer le CSE sur la restructuration N\u00eemes exposerait \u00e0 un recours prud'homal.",
    (9, "e2"): "Cons\u00e9quence : la gr\u00e8ve a\u00e9roport menace 1,2 M\u20ac de CA annuel sur ce seul site.",
    (9, "e3"): "Cons\u00e9quence : le turnover 22 % co\u00fbte 340 000 \u20ac/an en recrutement et formation.",
    (9, "e4"): "Cons\u00e9quence : l'absent\u00e9isme +40 % sur le site a g\u00e9n\u00e9r\u00e9 8 200 \u20ac de p\u00e9nalit\u00e9s.",
    (9, "e5"): "Cons\u00e9quence : le temps de recherche d'information baisse de 60 % depuis CleanConnect.",
    (9, "e6"): "Cons\u00e9quence : l'accord QVT a r\u00e9duit l'absent\u00e9isme de 3 points en douze mois.",
    (9, "e7"): "Cons\u00e9quence : la m\u00e9diation \u00e9vite une gr\u00e8ve reconductible et pr\u00e9serve le contrat a\u00e9roport.",
    (9, "e8"): "Cons\u00e9quence : la satisfaction clients progresse de 8 points sur les sites pilotes.",
    (9, "e9"): "Cons\u00e9quence : l'objectif 75/100 n\u00e9cessite +13 points en douze mois.",
    (9, "e10"): "Cons\u00e9quence : remporter l'AO h\u00f4pital s\u00e9curiserait 2 M\u20ac/an pendant cinq ans.",
    (9, "cas1"): "Cons\u00e9quence : CleanEco a d\u00e9j\u00e0 perdu un contrat mairie de 180 000 \u20ac en 2024.",
    (9, "cas2"): "Cons\u00e9quence : un dossier RSE faible pourrait co\u00fbter 500 000 \u20ac de marge sur cinq ans.",
    (10, "e1"): "Cons\u00e9quence : un style inadapt\u00e9 en astreinte pourrait compromettre la continuit\u00e9 de service.",
    (10, "e2"): "Cons\u00e9quence : sous-estimer la reconnaissance alimente le turnover cadres \u00e0 19 %.",
    (10, "e3"): "Cons\u00e9quence : le turnover commercial 24 % a fait perdre 420 000 \u20ac de CA client.",
    (10, "e4"): "Cons\u00e9quence : le NPS progresse de 12 points sur les comptes accompagn\u00e9s par les ambassadeurs.",
    (10, "e5"): "Cons\u00e9quence : la satisfaction onboarding progresse de 18 points en quatre mois.",
    (10, "e6"): "Cons\u00e9quence : l'engagement progresse de 9 points en huit mois post-d\u00e9ploiement Peakon.",
    (10, "e7"): "Cons\u00e9quence : le d\u00e9lai de r\u00e9ponse client passe de 4 h \u00e0 2 h en trois mois.",
    (10, "e8"): "Cons\u00e9quence : r\u00e9duire le turnover \u00e0 12 % \u00e9conomiserait 315 000 \u20ac sur deux ans.",
    (10, "e9"): "Cons\u00e9quence : 48 % d'insatisfaction salariale alimente les d\u00e9missions volontaires.",
    (10, "e10"): "Cons\u00e9quence : le turnover post-fusion pourrait bondir de 5 points sans plan d'harmonisation.",
    (10, "cas1"): "Cons\u00e9quence : chaque d\u00e9part commercial co\u00fbte 45 000 \u20ac et met en risque 2 \u00e0 3 comptes.",
    (10, "cas2"): "Cons\u00e9quence : 45 managers \u00e0 former repr\u00e9sentent 135 jours de formation cumul\u00e9s.",
}

NOTIONS = {
    (6, "e1"): ["charges fixes", "charges variables", "contr\u00f4le des co\u00fbts"],
    (6, "e2"): ["seuil de rentabilit\u00e9", "point mort", "marge sur co\u00fbts variables"],
    (6, "e3"): ["marge sur co\u00fbts variables", "taux de marge", "co\u00fbts sp\u00e9cifiques"],
    (6, "e4"): ["point mort", "seuil de rentabilit\u00e9", "saisonnalit\u00e9"],
    (6, "e5"): ["effet de levier", "charges fixes", "r\u00e9sultat d'exploitation"],
    (6, "e6"): ["contr\u00f4le des co\u00fbts", "ratio mati\u00e8res", "tableau de bord"],
    (6, "e7"): ["\u00e9carts", "contr\u00f4le de gestion", "budget pr\u00e9visionnel"],
    (6, "e8"): ["seuil de rentabilit\u00e9", "investissement", "marge de s\u00e9curit\u00e9"],
    (6, "e9"): ["tableau de bord", "indicateurs de gestion", "pilotage"],
    (6, "e10"): ["contr\u00f4le des co\u00fbts", "d\u00e9veloppement durable", "seuil de rentabilit\u00e9"],
    (6, "cas1"): ["seuil de rentabilit\u00e9", "\u00e9carts", "contr\u00f4le des co\u00fbts"],
    (6, "cas2"): ["investissement", "seuil de rentabilit\u00e9", "marge de s\u00e9curit\u00e9"],
    (7, "e1"): ["ERP", "MES", "syst\u00e8mes d'information"],
    (7, "e2"): ["automatisation", "robots", "productivit\u00e9"],
    (7, "e3"): ["RPA", "automatisation", "transformation num\u00e9rique"],
    (7, "e4"): ["d\u00e9mat\u00e9rialisation", "digitalisation", "tra\u00e7abilit\u00e9"],
    (7, "e5"): ["BPM", "workflow", "transformation num\u00e9rique"],
    (7, "e6"): ["IoT", "Industrie 4.0", "maintenance pr\u00e9dictive"],
    (7, "e7"): ["cloud computing", "IoT", "cybers\u00e9curit\u00e9"],
    (7, "e8"): ["intelligence artificielle", "maintenance pr\u00e9dictive", "machine learning"],
    (7, "e9"): ["ROI", "investissement num\u00e9rique", "payback"],
    (7, "e10"): ["SI production", "conduite du changement", "ROI"],
    (7, "cas1"): ["Industrie 4.0", "feuille de route", "ROI"],
    (7, "cas2"): ["cybers\u00e9curit\u00e9", "PRA", "MES"],
    (8, "e1"): ["organisation rigide", "taylorisme", "division du travail"],
    (8, "e2"): ["flux tendu", "kanban", "juste \u00e0 temps"],
    (8, "e3"): ["lean management", "VSM", "muda"],
    (8, "e4"): ["Mintzberg", "coordination", "standardisation"],
    (8, "e5"): ["toyotisme", "kaizen", "am\u00e9lioration continue"],
    (8, "e6"): ["lean management", "conditions de travail", "CSE"],
    (8, "e7"): ["goulot d'\u00e9tranglement", "TOC", "OTD"],
    (8, "e8"): ["cellules flexibles", "polyvalence", "organisation du travail"],
    (8, "e9"): ["OTD", "WIP", "indicateurs de production"],
    (8, "e10"): ["capacit\u00e9 de production", "TOC", "flux tendu"],
    (8, "cas1"): ["lean management", "OTD", "goulot d'\u00e9tranglement"],
    (8, "cas2"): ["usine 4.0", "lean", "conduite du changement"],
    (9, "e1"): ["acteurs internes", "parties prenantes", "management"],
    (9, "e2"): ["int\u00e9r\u00eats convergents", "int\u00e9r\u00eats divergents", "conflit"],
    (9, "e3"): ["culture d'organisation", "valeurs", "turnover"],
    (9, "e4"): ["dynamique de groupe", "coh\u00e9sion", "leadership"],
    (9, "e5"): ["RSE interne", "responsabilit\u00e9 soci\u00e9tale", "communication interne"],
    (9, "e6"): ["dialogue social", "NAO", "QVT"],
    (9, "e7"): ["conflit collectif", "m\u00e9diation", "gr\u00e8ve"],
    (9, "e8"): ["communaut\u00e9 de pratique", "mode projet", "coop\u00e9ration"],
    (9, "e9"): ["engagement", "outils collaboratifs", "motivation"],
    (9, "e10"): ["RSE", "appel d'offres", "greenwashing"],
    (9, "cas1"): ["n\u00e9gociation", "conflit", "dialogue social"],
    (9, "cas2"): ["RSE", "greenwashing", "responsabilit\u00e9 soci\u00e9tale"],
    (10, "e1"): ["styles de direction", "Likert", "management"],
    (10, "e2"): ["motivation intrins\u00e8que", "motivation extrins\u00e8que", "Herzberg"],
    (10, "e3"): ["r\u00e9mun\u00e9ration variable", "\u00e9quit\u00e9", "turnover"],
    (10, "e4"): ["mobilisation", "motivation", "engagement"],
    (10, "e5"): ["management participatif", "Likert", "autonomie"],
    (10, "e6"): ["feedback", "reconnaissance", "Herzberg"],
    (10, "e7"): ["d\u00e9l\u00e9gation", "responsabilisation", "Mintzberg"],
    (10, "e8"): ["turnover", "d\u00e9motivation", "co\u00fbt RH"],
    (10, "e9"): ["NAO", "dialogue social", "n\u00e9gociation"],
    (10, "e10"): ["fusion", "styles de direction", "conduite du changement"],
    (10, "cas1"): ["motivation", "r\u00e9mun\u00e9ration", "Herzberg"],
    (10, "cas2"): ["Likert", "fusion", "conduite du changement"],
}

CORR_EXTRA = {
    (6, "e1"): [
        ("Classification Caf\u00e9Rouge", [
            "Loyer quais 8 500 \u20ac/mois : charge fixe contractuelle.",
            "Assurances et abonnements 1 200 \u20ac/mois : fixes.",
            "Amortissement cuisine 45 000 \u20ac/an : fixe comptable.",
            "Mati\u00e8res 28 % CA et masse variable 32 % CA : charges variables.",
            "Classification utile pour simuler l'impact d'une variation d'activit\u00e9.",
        ]),
        ("Lien activit\u00e9 / r\u00e9sultat", [
            "+6 % couverts ne suffit pas si CF augmentent (+4 % loyer).",
            "Tant que MCV cumul\u00e9e ne couvre pas les CF, le r\u00e9sultat reste n\u00e9gatif.",
            "Le contr\u00f4le de gestion doit piloter CF et CV s\u00e9par\u00e9ment.",
        ]),
    ],
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


def _body_to_bullets(body: str):
    bullets = []
    for sent in body.replace("\n", " ").split(". "):
        s = sent.strip()
        if s:
            if not s.endswith("."):
                s += "."
            bullets.append(s)
    return bullets


def enrich_correction(ch: int, sid: str, corr: str, attendu: str = "") -> str:
    from management_enrich_common import enrich_correction as _enrich

    key = (ch, sid)
    return _enrich(
        ch,
        sid,
        corr,
        attendu,
        NOTIONS.get(key, []),
        corr_extra=CORR_EXTRA,
    )
