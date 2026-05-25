# -*- coding: utf-8 -*-
"""Chapitre 4 — L'activité de travail au sein des organisations."""

CHAPTER = 4

EXERCISES = [
    {
        "id": "e1",
        "title": "Savoirs, savoir-faire et savoir-être",
        "support": (
            "Sophie, chargée de clientèle à la Banque Populaire Atlantique, maîtrise les thématiques "
            "Bourse, épargne et crédit (savoirs). Elle applique les procédures KYC et rédige des "
            "comptes rendus clairs (savoir-faire). Ses collègues la décrivent comme accueillante, "
            "dynamique et capable de gérer un client en colère sans hausser le ton (savoir-être). "
            "Son manager souhaite la promouvoir responsable d'agence : il lui manque des savoirs "
            "en management d'équipe et un savoir-être plus affirmé pour trancher."
        ),
        "consigne": (
            "Distingue savoirs, savoir-faire et savoir-être chez Sophie. Mobilise l'approche par compétences."
        ),
        "questions": [
            "Classe chaque élément du support dans savoirs, savoir-faire ou savoir-être.",
            "Pourquoi le savoir-être est-il difficile à observer selon le cours ?",
            "Quelles compétences manquent pour la promotion ?",
        ],
        "correctionModele": (
            "1) Classification :\n"
            "Savoirs : Bourse, épargne, crédit. Savoir-faire : KYC, comptes rendus. Savoir-être : "
            "accueil, dynamisme, gestion du conflit.\n\n"
            "2) Savoir-être subjectif :\n"
            "Interprétation des qualités par autrui, pas de mesure objective unique.\n\n"
            "3) Lacunes promotion :\n"
            "Savoirs management, savoir-être décisionnel plus affirmé."
        ),
        "attendu": "Trois piliers distingués, exemples du support, analyse promotion.",
        "notions": ["Trois piliers distingués", "exemples du support", "analyse promotion."],
        "minChars": 120,
    },
    {
        "id": "e2",
        "title": "Approche par compétences et performance",
        "support": (
            "Decathlon forme ses vendeurs au conseil running et au montage de vélos, puis mesure "
            "la satisfaction client par enquêtes. La direction affirme que développer les compétences "
            "crée de l'intelligence collective (partage de savoirs entre magasins) et rend les salariés "
            "plus polyvalents. Un magasin où les formations ont été coupées voit son taux de retour "
            "produits augmenter de 6 points."
        ),
        "consigne": (
            "Explique les bénéfices de l'approche par compétences pour l'organisation selon le manuel."
        ),
        "questions": [
            "Définis l'approche par compétences.",
            "Quels bénéfices Decathlon en tire-t-il (support + cours) ?",
            "Que démontre le magasin sans formation ?",
        ],
        "correctionModele": (
            "1) Approche par compétences :\n"
            "Centrée sur l'individu et son développement pour occuper son poste.\n\n"
            "2) Bénéfices :\n"
            "Gestion prévisionnelle, intelligence collective, polyvalence, performance (satisfaction client).\n\n"
            "3) Contre-exemple :\n"
            "Sans formation, compétences stagnent, performance baisse (retours produits)."
        ),
        "attendu": "Lien formation-compétences-performance argumenté.",
        "minChars": 140,
    },
    {
        "id": "e3",
        "title": "Fiche de poste",
        "support": (
            "La PME « Com'Pulse » recrute un chargé de communication. Fiche de poste : intitulé « Chargé(e) "
            "de communication » ; tâches — veille, réseaux sociaux, organisation d'événements ; compétences — "
            "Photoshop, InDesign, anglais B2, travail d'équipe ; qualifications — Bac+2 communication + "
            "1re expérience ; conditions — bureau, journée, déplacements occasionnels ; rattachement — "
            "directeur marketing."
        ),
        "consigne": (
            "Présente le rôle de la fiche de poste et vérifie que toutes les rubriques du cours sont présentes."
        ),
        "questions": [
            "À quoi sert une fiche de poste pour l'organisation et le candidat ?",
            "Liste les rubriques présentes dans l'exemple.",
            "Quelle rubrique manquerait si le salaire n'était pas mentionné ailleurs ?",
        ],
        "correctionModele": (
            "1) Rôle :\n"
            "Décrire précisément le contenu du poste, guider recrutement et attentes.\n\n"
            "2) Rubriques présentes :\n"
            "Intitulé, tâches, compétences, qualifications, conditions d'exercice, rattachement.\n\n"
            "3) Rémunération :\n"
            "Peut figurer dans conditions ou offre séparée ; la fiche reste exhaustive sur le travail."
        ),
        "attendu": "Fiche de poste structurée, rubriques identifiées.",
        "notions": ["Fiche de poste structurée", "rubriques identifiées."],
        "minChars": 150,
    },
    {
        "id": "e4",
        "title": "Profil de compétences et projet professionnel",
        "support": (
            "Marc, technicien maintenance chez Renault, remplit son profil de compétences : savoirs "
            "électricité automobile, savoir-faire diagnostic OBD, savoir-être rigueur. Il identifie "
            "un manque d'anglais technique pour travailler sur des véhicules export. Le service RH "
            "lui propose une formation et une mobilité au Portugal. Marc définit un objectif : "
            "devenir référent international d'ici trois ans."
        ),
        "consigne": (
            "Explique l'intérêt du profil de compétences pour le salarié et l'organisation (approche par compétences)."
        ),
        "questions": [
            "Qu'est-ce qu'un profil de compétences ?",
            "Comment Marc l'utilise pour son projet professionnel ?",
            "Quel intérêt pour Renault ?",
        ],
        "correctionModele": (
            "1) Profil de compétences :\n"
            "Répertoire des savoirs, savoir-faire et savoir-être acquis sur le parcours.\n\n"
            "2) Usage salarié :\n"
            "Marc repère lacune anglais, axe formation, objectif référent international.\n\n"
            "3) Intérêt organisation :\n"
            "Adéquation poste-besoins, mobilité internationale, fidélisation et GPEC."
        ),
        "attendu": "Double usage salarié/organisation du profil de compétences.",
        "minChars": 160,
    },
    {
        "id": "e5",
        "title": "Conditions de travail : facteurs d'influence",
        "support": (
            "Dans un entrepôt Amazon, les préparateurs de commandes effectuent 12 km de marché par "
            "shift (facteur physique), dans un bruit constant de 78 dB (environnemental), avec des "
            "objectifs chiffrés minute par minute (organisationnel). Les relations entre collègues "
            "sont tendues après un changement de manager autoritaire (social). Un salarié confie "
            "des difficultés à « déconnectér » mentalement (psychologique)."
        ),
        "consigne": (
            "Classe chaque élément du support dans les facteurs physiques, environnementaux, "
            "organisationnels, sociaux et psychologiques des conditions de travail."
        ),
        "questions": [
            "Rappelle l'obligation légale de l'employeur (Code du travail).",
            "Associe chaque difficulté au bon facteur.",
            "Pourquoi faut-il analyser ces facteurs ensemble ?",
        ],
        "correctionModele": (
            "1) Obligation L.4121 :\n"
            "Assurer sécurité et protéger santé physique et mentale.\n\n"
            "2) Classification :\n"
            "Physique : marché 12 km. Environnemental : bruit 78 dB. Organisationnel : objectifs "
            "minute. Social : manager autoritaire. Psychologique : difficulté déconnexion.\n\n"
            "3) Analyse globale :\n"
            "Facteurs liés ; négliger un volet fausse le diagnostic des risques."
        ),
        "attendu": "Cinq familles de facteurs correctement appliquées.",
        "minChars": 180,
    },
    {
        "id": "e6",
        "title": "QVCT et acteurs des conditions de travail",
        "support": (
            "L'Oréal lance un plan QVCT : ergonomie des postes labo, séances de sophrologie, enquête "
            "salariés co-construite avec le CSE et la médecine du travail. L'Anact fournit un guide "
            "méthodologique. L'INRS alerte sur certains produits chimiques. L'employeur investit "
            "2 M€. Résultat attendu : baisse absentéisme et amélioration image employeur."
        ),
        "consigne": (
            "Définis la QVCT et le rôle de chaque acteur mentionné (employeur, salarié, CSE, médecine "
            "du travail, Anact, INRS)."
        ),
        "questions": [
            "Qu'est-ce que la qualité de vie et des conditions de travail (QVCT) ?",
            "Quel rôle pour le CSE et la médecine du travail ?",
            "Pourquoi l'employeur investit malgré le coût ?",
        ],
        "correctionModele": (
            "1) QVCT :\n"
            "Démarche pour optimiser conditions de travail, productivité et bien-être.\n\n"
            "2) Acteurs :\n"
            "Employeur : garant, finance. Salarié : enquête, propositions. CSE : promotion santé/sécurité. "
            "Médecine du travail : prévention. Anact : amélioration conditions. INRS : prévention risques.\n\n"
            "3) Investissement :\n"
            "Réduction coûts absentéisme, fidélisation, performance et image."
        ),
        "attendu": "QVCT et acteurs nommés avec rôles précis.",
        "notions": ["QVCT et acteurs nommés avec rôles précis."],
        "minChars": 180,
    },
    {
        "id": "e7",
        "title": "Télétravail et conditions de travail",
        "support": (
            "Depuis 2023, Salesforce impose deux jours de télétravail par semaine. Les salariés "
            "gagnent en autonomie sur les horaires (psychologique positif) mais signalent isolement "
            "(social négatif) et fatigue visuelle (physique). L'entreprise finance chaises ergonomiques "
            "et organise des « semaines présentielles » d'équipe. Le CSE négocie une charte : droit "
            "à la déconnexion, réunion d'accueil obligatoire pour les nouveaux."
        ),
        "consigne": (
            "Analyse l'impact du télétravail sur les conditions de travail (facteurs physiques, "
            "sociaux, psychologiques, organisationnels)."
        ),
        "questions": [
            "Quels effets positifs et négatifs du télétravail dans le support ?",
            "Quelles mesures correctives l'employeur met-il en place ?",
            "Pourquoi la charte CSE est-elle importante ?",
        ],
        "correctionModele": (
            "1) Effets :\n"
            "+ autonomie (psy/orga). ? isolement (social), fatigue visuelle (physique).\n\n"
            "2) Mesures :\n"
            "Ergonomie, semaines présentielles, charte déconnexion.\n\n"
            "3) Charte :\n"
            "Formalise normes, protège santé mentale, équilibre vie pro/perso."
        ),
        "attendu": "Télétravail analysé comme levier et contrainte QVCT.",
        "minChars": 200,
    },
    {
        "id": "e8",
        "title": "Bonnes et mauvaises conditions : conséquences",
        "support": (
            "Usine A : yoga, formation continue, taux d'absentéisme 3 %, turnover 5 %. Usine B : "
            "surcharge, pas de pause, absentéisme 14 %, turnover 22 %, grève en 2024. Le manuel "
            "liste les conséquences pour l'organisation (image, coûts cachés, conflits) et le salarié "
            "(stress, TMS, démotivation)."
        ),
        "consigne": (
            "Compare les deux usines en mobilisant les conséquences positives et négatives des "
            "conditions de travail pour l'organisation et le salarié."
        ),
        "questions": [
            "Quels indicateurs montrent la performance sociale de l'usine A ?",
            "Quels risques pour l'usine B (organisation et salariés) ?",
            "Pourquoi l'amélioration des conditions est un « gage de performance » malgré le coût ?",
        ],
        "correctionModele": (
            "1) Usine A :\n"
            "Baisse absentéisme/turnover, motivation, fidélisation, image positive.\n\n"
            "2) Usine B :\n"
            "Absentéisme, turnover, grève, coûts cachés, stress, TMS, démotivation.\n\n"
            "3) Gage de performance :\n"
            "Investissement formation/ergonomie < coûts turnover et conflits."
        ),
        "attendu": "Comparaison chiffrée, conséquences doubles (orga/salarié).",
        "notions": ["Comparaison chiffrée", "conséquences doubles (orga/salarié)."],
        "minChars": 220,
    },
    {
        "id": "e9",
        "title": "Conflits au travail et résolution",
        "support": (
            "Deux chefs de projet chez Capgemini se disputent la priorité d'un client. Le conflit "
            "ralentit la livraison. Le N+1 organise une médiation : chacun expose ses arguments, "
            "un calendrier partagé est adopté. Le projet repart ; la cohésion s'améliore. Le manuel "
            "cite médiation, recours hiérarchique, arbitrage et négociation comme modes de résolution."
        ),
        "consigne": (
            "Définis le conflit au travail, ses effets négatifs et montre comment la médiation peut "
            "avoir des effets positifs."
        ),
        "questions": [
            "Qu'est-ce qu'un conflit dans une organisation ?",
            "Quels effets négatifs avant médiation ?",
            "Pourquoi la médiation a-t-elle des effets positifs selon le cours ?",
        ],
        "correctionModele": (
            "1) Conflit : opposition violente ou fermée de sentiments.\n\n"
            "2) Effets négatifs : retard projet, tension, risque démotivation.\n\n"
            "3) Médiation :\n"
            "Intervenant facilite discussion, terrain d'entente ? parole libérée, cohésion, "
            "dynamique de changement."
        ),
        "attendu": "Conflit et résolution, effets négatifs/positifs distingués.",
        "notions": ["Conflit et résolution", "effets négatifs/positifs distingués."],
        "minChars": 240,
    },
    {
        "id": "e10",
        "title": "Auto-entrepreneur et conditions de travail",
        "support": (
            "Léa, salariée en CDI chez un cabinet comptable, crée une activité auto-entrepreneur de "
            "coaching scolaire le soir. Avantages : complément de revenu, faible charges si pas de "
            "CA. Inconvénients : fatigue, frontière floue vie pro/perso, dépendance à un client "
            "représentant 60 % du CA auto-entrepreneur. Le manuel compare contraintes auto-entrepreneur "
            "et salarié (pas de congés payés, isolement)."
        ),
        "consigne": (
            "Compare conditions de travail du salarié en CDI et de l'auto-entrepreneur pour Léa. "
            "Mobilise le statut micro-entrepreneur du cours."
        ),
        "questions": [
            "Quels avantages de l'auto-entrepreneur pour Léa ?",
            "Quels risques sur ses conditions de travail globales ?",
            "Quelle différence de protection avec son statut salarié ?",
        ],
        "correctionModele": (
            "1) Avantages :\n"
            "Complément revenu, lancement peu coûteux, cotisations si CA.\n\n"
            "2) Risques :\n"
            "Fatigue, isolement, dépendance client, confusion vie pro/perso.\n\n"
            "3) Protection salarié :\n"
            "CDI : congés, sécurité sociale employeur, CSE possible ; auto-entrepreneur : pas congés "
            "payés, pas chômage, autonomie mais précarité."
        ),
        "attendu": "Double statut analysé, complémentarité et tensions.",
        "notions": ["Double statut analysé", "complémentarité et tensions."],
        "minChars": 260,
    },
    {
        "id": "cas1",
        "title": "Étude de cas : Fiche de poste et compétences",
        "support": (
            "Zara France recrute un responsable de rayon. Fiche : management 8 personnes, gestion stocks, "
            "merchandising, KPI ventes. Compétences : savoirs mode et supply chain, savoir-faire Excel "
            "et planification, savoir-être leadership et résistance stress. Qualification : Bac+3 commerce "
            "+ 3 ans retail. Conditions : horaires décalés, magasin. Profil interne : Nadia, vendeuse "
            "5 ans, profil de compétences riche en savoir-faire client mais sans savoirs management. "
            "Externe : Karim, diplômé, peu d'expérience terrain. Le RH organise assessment center sur "
            "savoir-être et mise en situation."
        ),
        "consigne": (
            "Aide le RH à trancher en mobilisant fiche de poste, profil de compétences, savoirs/savoir-faire/"
            "savoir-être, qualification. Pas de réponse unique mais argumentation structurée."
        ),
        "questions": [
            "Vérifie la cohérence de la fiche de poste avec le cours.",
            "Compare Nadia et Karim avec l'approche par compétences.",
            "Pourquoi l'assessment sur savoir-être est-il pertinent ?",
            "Quel plan de développement pour le candidat retenu si lacunes ?",
            "Synthèse (12 lignes) : compétences ou qualification — quel critère prioritaire ?",
        ],
        "correctionModele": (
            "1) Fiche cohérente : toutes rubriques présentes, compétences alignées poste.\n\n"
            "2) Nadia : savoir-faire client fort, lacunes savoirs management. Karim : savoirs théoriques, "
            "faible savoir-faire terrain.\n\n"
            "3) Assessment savoir-être : critère différenciant, difficile à observer autrement.\n\n"
            "4) Plan développement : formation management (Nadia) ou immersion terrain (Karim).\n\n"
            "5) Synthèse :\n"
            "Approche par compétences combine savoirs, savoir-faire et savoir-être ; qualification "
            "seule insuffisante. Priorité au poste : leadership + stress ? évaluer savoir-être et "
            "compléter par formation."
        ),
        "attendu": "Décision RH argumentée, outils du chapitre 4 mobilisés.",
        "notions": ["Décision RH argumentée", "outils du chapitre 4 mobilisés."],
        "minChars": 400,
    },
    {
        "id": "cas2",
        "title": "Étude de cas : QVCT et crise sociale",
        "support": (
            "Une blanchisserie industrielle (120 salariés) affiche un absentéisme de 18 %. Causes : "
            "chaleur 35 °C (physique), pression cadence (organisationnel), conflits avec encadrement "
            "(social). Le CSE alerte. L'employeur, aidé par l'Anact, installe ventilation, réduit "
            "cadence, forme les managers au dialogue. Médecine du travail suit 15 dossiers TMS. Après "
            "12 mois : absentéisme 9 %, plus de grève. Un conflit sur primes est résolu par négociation "
            "entre syndicats et direction."
        ),
        "consigne": (
            "Rédige un diagnostic QVCT et un plan d'action en mobilisant facteurs de conditions de "
            "travail, acteurs, conséquences, conflits et résolution."
        ),
        "questions": [
            "Diagnostic : classe chaque cause par type de facteur.",
            "Quels acteurs interviennent et comment ?",
            "Quels effets attendus sur organisation et salariés si QVCT réussie ?",
            "Analyse le conflit sur primes et sa résolution.",
            "Synthèse (15-18 lignes) : la QVCT est-elle rentable pour l'employeur ?",
        ],
        "correctionModele": (
            "1) Diagnostic : chaleur physique, cadence organisationnel, relations sociales tendues.\n\n"
            "2) Acteurs : employeur investit, CSE alerte, Anact conseille, médecine travail suit TMS.\n\n"
            "3) Effets : baisse absentéisme, fidélisation, baisse coûts cachés, motivation.\n\n"
            "4) Conflit primes : opposition ? négociation, consensus possible, effets positifs si écoûté.\n\n"
            "5) Synthèse rentabilité :\n"
            "Coût ventilation/formation < coût absentéisme et grèves ; QVCT = performance sociale "
            "et pérennité."
        ),
        "attendu": "Diagnostic complet, plan QVCT, rentabilité argumentée.",
        "notions": ["Diagnostic complet", "plan QVCT", "rentabilité argumentée."],
        "minChars": 450,
    },
]
