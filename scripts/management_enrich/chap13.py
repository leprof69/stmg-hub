# -*- coding: utf-8 -*-
"""Chapitre 13 - Éthique, greenwashing, RSE washing, discrimination, mécénat."""

CHAPTER = 13

EXERCISES = [
    {
        "id": "e1",
        "title": "Éthique des affaires et code de déontologie",
        "support": (
            "GreenPack, PME strasbourgeoise d'emballages (CA 16 M€, 110 salariés), a adopté "
            "un code d'éthique en 2023 : cadeaux clients plafonnés à 50 €, interdiction des "
            "facilités de paiement occultes, procédure d'alerte éthique en ligne. En 2024, "
            "un commercial signale qu'un concurrent offre des voyages aux acheteurs de GMS. "
            "Le comité éthique (DG, DRH, DAF, représentant CSE) examine le cas : la pratique "
            "du concurrent est dénoncée sans dépasser le cadre légal de la concurrence déloyale. "
            "GreenPack remporte un appel d'offres de 2,4 M€ grâce à sa réputation de transparence. "
            "Le cours définit l'éthique comme valeurs au-delà des exigences légales."
        ),
        "consigne": (
            "Explique le rôle du code d'éthique chez GreenPack. "
            "Distingue éthique, légal et intérêt commercial."
        ),
        "questions": [
            "Définis l'éthique des affaires selon le cours.",
            "Quelles règles du code GreenPack illustrent cette démarche ?",
            "Pourquoi l'éthique peut-elle devenir un avantage concurrentiel ?",
        ],
        "correctionModele": (
            "1) Éthique des affaires :\n"
            "Principes éthiques dans la gestion des organisations, au-delà du strict légal.\n\n"
            "2) Code GreenPack :\n"
            "Plafond cadeaux, alerte éthique, comité de gouvernance - prévention corruption.\n\n"
            "3) Avantage concurrentiel :\n"
            "Confiance des clients (appel d'offres 2,4 M€), image durable, réduction des risques "
            "juridiques et réputationnels."
        ),
        "attendu": "Éthique définie, code appliqué, lien performance.",
    },
    {
        "id": "e2",
        "title": "Greenwashing et allégations environnementales",
        "support": (
            "Le concurrent GreenWrap lance une campagne TV « 100 % naturel, 100 % vert » "
            "alors que ses emballages contiennent 80 % de plastique vierge non recyclé. "
            "GreenPack, certifiée FSC et OK Compost sur 72 % de sa gamme, saisit la DGCCRF "
            "avec un dossier de preuves (analyses labo, composition réelle). L'association "
            "Halte au greenwashing relaie l'affaire. Le cours définit le greenwashing comme "
            "pratique de communication environnementale trompeuse lorsque la sincérité de "
            "la démarche est questionnée. GreenPack communique sur des faits vérifiables : "
            "pourcentages matières, certifications, usines auditées."
        ),
        "consigne": (
            "Analyse le cas GreenWrap vs GreenPack. "
            "Définis le greenwashing et les réponses éthiques possibles."
        ),
        "questions": [
            "Qu'est-ce que le greenwashing ?",
            "En quoi la campagne GreenWrap constitue-t-elle un greenwashing ?",
            "Quelle stratégie GreenPack adopte-t-elle pour se différencier éthiquement ?",
        ],
        "correctionModele": (
            "1) Greenwashing :\n"
            "Allégations environnementales non soutenues par les pratiques réelles "
            "(sincérité de la démarche questionnée).\n\n"
            "2) GreenWrap :\n"
            "Discours « 100 % vert » incompatible avec 80 % plastique vierge.\n\n"
            "3) GreenPack :\n"
            "Signalement DGCCRF, communication factuelle, certifications vérifiables."
        ),
        "attendu": "Greenwashing défini, cas analysé, stratégie preuves.",
    },
    {
        "id": "e3",
        "title": "RSE washing et reporting sincère",
        "support": (
            "Le rapport RSE 2024 du concurrent Emball'Pro compte 40 pages dont 2 pages "
            "de données chiffrées, le reste étant des photos stock et des formulations vagues "
            "« nous nous engageons pour la planète ». GreenPack publie un rapport de 28 pages "
            "avec indicateurs : émissions CO2 (Scope 1-2), % matières recyclées, parité "
            "encadrement, nombre d'audits fournisseurs. Le DAF rappelle que les grandes "
            "entreprises doivent publier une déclaration de performance extra-financière ; "
            "GreenPack, en dessous des seuils, le fait volontairement pour préparer les "
            "appels d'offres des grands comptes. Le RSE washing désigne une communication "
            "RSE insincère sans indicateurs."
        ),
        "consigne": (
            "Compare les deux rapports RSE et explique le RSE washing. "
            "Justifie la démarche de transparence de GreenPack."
        ),
        "questions": [
            "Qu'est-ce que le RSE washing (ou social washing) ?",
            "Quels critères distinguent un reporting sincère d'un rapport « washing » ?",
            "Pourquoi GreenPack publie-t-elle des indicateurs même sans obligation légale ?",
        ],
        "correctionModele": (
            "1) RSE washing :\n"
            "Communication RSE sans substance : pas d'indicateurs, discours générique, "
            "sincérité questionnée.\n\n"
            "2) Critères sincérité :\n"
            "Indicateurs mesurables, périmètre clair, preuves, cohérence avec la stratégie.\n\n"
            "3) GreenPack :\n"
            "Anticipation exigences clients, crédibilité appels d'offres, différenciation vs Emball'Pro."
        ),
        "attendu": "RSE washing défini, critères reporting, stratégie GreenPack.",
    },
    {
        "id": "e4",
        "title": "Discrimination et diversité en recrutement",
        "support": (
            "GreenPack fixe un objectif parité 50/50 à l'encadrement d'ici 2027. Le recrutement "
            "phase 1 est « aveugle » : CV sans nom ni photo, tests de compétences uniquement. "
            "Un audit interne révèle que les femmes ingénieures reçoivent en moyenne 4 % de "
            "salaire en moins à poste équivalent. Le DRH lance un plan correction et une formation "
            "« biais inconscients » pour les managers. Le cours cite les discriminations au travail "
            "comme pratiques contraires à l'éthique ; les organisations mettent en place parité, "
            "diversité, handicap. Le CSE valide un accord égalité professionnelle indexé 87/100."
        ),
        "consigne": (
            "Analyse la politique diversité/parité de GreenPack. "
            "Distingue prévention discrimination et correction des inégalités existantes."
        ),
        "questions": [
            "Quelles formes de discrimination le cours mentionne-t-il ?",
            "Comment le recrutement aveugle limite-t-il les biais à l'embauche ?",
            "Pourquoi l'écart salarial 4 % malgré la parité illustre-t-il un enjeu distinct ?",
        ],
        "correctionModele": (
            "1) Discriminations :\n"
            "Inégalités femmes-hommes, origine, handicap, etc. - contraires à l'éthique et au droit.\n\n"
            "2) Recrutement aveugle :\n"
            "Réduit les biais à l'entrée (nom, photo) ; sélection sur compétences.\n\n"
            "3) Écart salarial :\n"
            "La parité à l'embauche ne suffit pas : il faut corriger les inégalités dans la carrière "
            "et la rémunération (formation biais, plan correction)."
        ),
        "attendu": "Discrimination définie, recrutement aveugle, parité vs égalité salariale.",
    },
    {
        "id": "e5",
        "title": "Mécénat et engagement civique",
        "support": (
            "GreenPack consacre 80 000 €/an au mécénat de l'association « Tri'Vert Alsace » "
            "(tri sélectif en entreprises). Forme : mécénat financier (don) + mécénat de "
            "compétences (3 ingénieurs formés aux éco-conceptions, 120 h/an). Le logo GreenPack "
            "apparaît sur les supports de l'association avec une charte de co-branding éthique "
            "(pas de sur-promesse environnementale). Le cours distingue mécénat financier, "
            "en nature et de compétences. Les bénéficiaires sont souvent des associations, "
            "établissements publics ou citoyens. GreenPack refuse un mécénat à une association "
            "politique pour éviter un conflit d'image."
        ),
        "consigne": (
            "Explique les formes de mécénat pratiquées par GreenPack et leurs conditions d'éthique."
        ),
        "questions": [
            "Quelles sont les trois formes principales de mécénat selon le cours ?",
            "Identifie-les dans le support GreenPack.",
            "Pourquoi GreenPack refuse le mécénat politique ?",
        ],
        "correctionModele": (
            "1) Trois formes :\n"
            "- Financier (dons, subventions).\n"
            "- En nature (équipements, brevets).\n"
            "- De compétences (savoir-faire, bénévolat).\n\n"
            "2) GreenPack :\n"
            "80 000 € financier + 120 h compétences ingénieurs.\n\n"
            "3) Refus politique :\n"
            "Cohérence valeurs, éviter instrumentalisation, risque réputationnel et conflit parties prenantes."
        ),
        "attendu": "Mécénat typé, application GreenPack, cohérence éthique.",
    },
    {
        "id": "e6",
        "title": "Lanceurs d'alerte et procédure interne",
        "support": (
            "Un technicien GreenPack alerte via la plateforme interne : un sous-traitant polonais "
            "utilise des solvants non conformes REACH. L'alerte est traitée sous 72 h : audit, "
            "suspension livraisons, signalement à l'agence régionale si nécessaire. Le lanceur "
            "est protégé (anonymat optionnel, pas de sanction). Le cours rappelle que la "
            "dénonciation des pratiques non conformes est favorisée par les réseaux sociaux "
            "et les procédures internes. GreenPack forme 100 % des cadres à l'éthique (e-learning "
            "2 h/an) et affiche la procédure dans les locaux."
        ),
        "consigne": (
            "Analyse la procédure lanceur d'alerte de GreenPack. "
            "Lie éthique, conformité REACH et gouvernance."
        ),
        "questions": [
            "Quel rôle jouent les lanceurs d'alerte dans l'éthique des organisations ?",
            "Reconstitue le traitement de l'alerte REACH dans le support.",
            "Pourquoi protéger le lanceur est-il indispensable ?",
        ],
        "correctionModele": (
            "1) Lanceurs d'alerte :\n"
            "Permettent de détecter pratiques non conformes avant scandalisation publique.\n\n"
            "2) Traitement :\n"
            "Alerte ? audit 72 h ? suspension ? signalement autorité si besoin.\n\n"
            "3) Protection :\n"
            "Encourage les signalements, évite les représailles, conformité droit du travail."
        ),
        "attendu": "Procédure alerte décrite, protection justifiée.",
    },
    {
        "id": "e7",
        "title": "Éthique de la supply chain",
        "support": (
            "GreenPack impose une clause RSE dans tous les contrats fournisseurs : respect "
            "REACH, interdiction travail des mineurs, salaire minimum local, droit syndical. "
            "Audits sociaux annoncés en Asie et Europe de l'Est : 14 sites visités en 2024, "
            "2 non-conformités majeures entraînant exclusion. Le coût audit est de 180 000 € "
            "mais évite un scandale type Mode&Co. Le cours lie éthique et transparence des "
            "chaînes d'approvisionnement. Les ONG et clients GMS exigent désormais ces preuves "
            "dans les appels d'offres."
        ),
        "consigne": (
            "Explique la politique supply chain éthique de GreenPack. "
            "Évalue coût vs risque."
        ),
        "questions": [
            "Pourquoi la supply chain est-elle un enjeu éthique majeur ?",
            "Quels mécanismes GreenPack utilise-t-elle (clause, audit, exclusion) ?",
            "Argumente le ROI éthique des 180 000 € d'audits.",
        ],
        "correctionModele": (
            "1) Enjeu supply chain :\n"
            "Pratiques sous-traitants impactent l'image et la responsabilité de l'acheteur.\n\n"
            "2) Mécanismes :\n"
            "Clause RSE contractuelle, audits, exclusion si non-conformité.\n\n"
            "3) ROI :\n"
            "180 000 € << coût d'une crise (boycott, perte contrats, sanctions)."
        ),
        "attendu": "Supply chain éthique, mécanismes GreenPack, analyse coût-risque.",
    },
    {
        "id": "e8",
        "title": "Conflit d'intérêts en achats",
        "support": (
            "Le directeur achats de GreenPack démissionne après découverte d'un lien familial "
            "non déclaré avec un fournisseur de films plastiques (contrats cumulés 1,2 M€ "
            "sur 3 ans). Le comité éthique constate une violation du code : déclaration annuelle "
            "des liens d'intérêts obligatoire. Les contrats sont résiliés après audit des prix "
            "(surfacturation estimée 8 %). Un intérim externe reprend le poste ; double signature "
            "obligatoire au-delà de 50 000 €. Le cours cite les conflits d'intérêts comme "
            "mise en danger de l'impartialité des décideurs."
        ),
        "consigne": (
            "Analyse le conflit d'intérêts du directeur achats. "
            "Propose des mesures préventives."
        ),
        "questions": [
            "Qu'est-ce qu'un conflit d'intérêts en gestion des organisations ?",
            "Quels faits caractérisent la violation chez GreenPack ?",
            "Quelles mesures préventives au-delà de la démission ?",
        ],
        "correctionModele": (
            "1) Conflit d'intérêts :\n"
            "Situation où un décideur a un intérêt personnel pouvant influencer une décision professionnelle.\n\n"
            "2) Violation :\n"
            "Lien familial non déclaré, contrats 1,2 M€, surfacturation possible.\n\n"
            "3) Mesures :\n"
            "Déclaration annuelle, double signature, rotation fournisseurs, audit aléatoire prix."
        ),
        "attendu": "Conflit défini, faits analysés, prévention structurée.",
    },
    {
        "id": "e9",
        "title": "Compliance et formation éthique",
        "support": (
            "GreenPack déploie un programme compliance : e-learning éthique 2 h/an (100 % cadres), "
            "module anti-corruption pour les commerciaux, registre des cadeaux clients, audit "
            "compliance triennal par un cabinet externe. Le taux de complétion est de 96 %. "
            "Un questionnaire post-formation montre que 88 % des cadres savent utiliser l'alerte "
            "éthique. Le cours présente l'éthique comme enjeu managérial : codes, formations, "
            "contrôles. La Cour des comptes et les investisseurs scrutent de plus en plus "
            "les PME sous-traitantes des grands groupes."
        ),
        "consigne": (
            "Évalue le dispositif compliance de GreenPack. "
            "Relie formation, procédures et gouvernance."
        ),
        "questions": [
            "Qu'est-ce que la compliance dans une démarche éthique ?",
            "Quels éléments du dispositif GreenPack sont les plus pertinents ?",
            "Quelle limite si la culture éthique n'est pas partagée par la direction ?",
        ],
        "correctionModele": (
            "1) Compliance :\n"
            "Ensemble de dispositifs pour garantir le respect des règles éthiques et légales.\n\n"
            "2) Dispositif GreenPack :\n"
            "Formation systématique, registre cadeaux, audit externe, alerte éthique.\n\n"
            "3) Limite :\n"
            "Sans exemplarité du DG et sanctions réelles, la compliance reste « checkbox »."
        ),
        "attendu": "Compliance définie, dispositif évalué, limite culture.",
    },
    {
        "id": "e10",
        "title": "Synthèse : éthique comme avantage stratégique",
        "support": (
            "Un appel d'offres européen de 4,8 M€ exige une charte éthique fournisseurs, "
            "rapport RSE chiffré et absence de greenwashing sur 5 ans. GreenPack est short-listée "
            "avec deux concurrents dont GreenWrap (campagne TV verte contestée). Le comité "
            "d'achat note : « GreenPack = preuves, GreenWrap = promesses ». Le DG prépare "
            "une présentation mobilisant code éthique, audits supply chain, mécénat, parité "
            "et procédure alerte. Le risque : un incident REACH non détecté pourrait tout "
            "invalider en 48 h."
        ),
        "consigne": (
            "Synthèse : pourquoi l'éthique est un avantage compétitif pour GreenPack sur cet appel d'offres. "
            "Structure arguments et risques résiduels."
        ),
        "questions": [
            "Liste cinq atouts éthiques de GreenPack pour l'appel d'offres.",
            "Compare GreenPack et GreenWrap sur le critère sincérité.",
            "Quel risque résiduel et quelle mesure de mitigation ?",
            "En quoi l'éthique est-elle devenue un enjeu stratégique selon le cours ?",
        ],
        "correctionModele": (
            "1) Atouts :\n"
            "Code éthique, certifications, audits, rapport RSE chiffré, mécénat cohérent, alerte interne.\n\n"
            "2) Comparaison :\n"
            "GreenPack = preuves vérifiables ; GreenWrap = greenwashing suspecté.\n\n"
            "3) Risque :\n"
            "Incident REACH ? audits renforcés, traçabilité temps réel.\n\n"
            "4) Enjeu stratégique :\n"
            "Différenciation positive, confiance parties prenantes, conformité exigences clients."
        ),
        "attendu": "Synthèse argumentée appel d'offres, risques identifiés.",
        "minChars": 260,
    },
    {
        "id": "cas1",
        "title": "Étude de cas : Greenwashing concurrent",
        "support": (
            "GreenWrap diffuse une campagne nationale « 100 % naturel » sur TF1 (budget 1,5 M€). "
            "GreenPack commande des analyses indépendantes : 80 % plastique vierge, certification "
            "affichée invalide sur 3 références sur 5. Greenpeace et les clients GMS demandent "
            "transparence. GreenPack hésite entre dénonciation publique agressive et signalement "
            "discret à la DGCCRF. Son propre score RSE est de 82/100. Un journaliste contacte "
            "le DG pour un plateau télé. Risques : procès en diffamation, guerre commerciale, "
            "ou au contraire leadership éthique du secteur."
        ),
        "consigne": (
            "Élabore la stratégie GreenPack : preuves greenwashing, cadre juridique, communication, risques."
        ),
        "questions": [
            "Constitue un dossier de preuves contre le greenwashing GreenWrap.",
            "Quel cadre juridique (DGCCRF, allégations trompeuses) ?",
            "Stratégie communication GreenPack (agressive vs factuelle).",
            "Risques juridiques et réputationnels pour GreenPack.",
            "Synthèse : recommandation au DG.",
        ],
        "correctionModele": (
            "1) Preuves :\n"
            "Analyses labo, compositions, certifications vérifiées, comparaison publicitaire/réalité.\n\n"
            "2) Cadre :\n"
            "DGCCRF, pratiques commerciales trompeuses, allégations environnementales non fondées.\n\n"
            "3) Communication :\n"
            "Stratégie factuelle (données, certifications GreenPack), pas d'attaque ad hominem.\n\n"
            "4) Risques :\n"
            "Diffamation si accusations non prouvées ; guerre prix si GreenWrap riposte.\n\n"
            "5) Recommandation :\n"
            "Signalement autorité + communication preuves + renforcement certifications propres."
        ),
        "attendu": "Stratégie éthique structurée, cadre juridique, recommandation.",
        "minChars": 400,
    },
    {
        "id": "cas2",
        "title": "Étude de cas : Conflit d'intérêts et crise gouvernance",
        "support": (
            "Suite à la démission du directeur achats, l'audit interne révèle 1,2 M€ de contrats "
            "avec la société familiale Polymère Est, surfacturation 8 % (96 000 €), absence de "
            "mise en concurrence sur 4 lots. Le comité éthique recommande résiliation, plainte "
            "possible pour favoritisme. Le CSE demande transparence. Un client GMS menace de "
            "suspendre GreenPack si la gouvernance n'est pas refondée. Le DG doit communiquer "
            "en interne (J+2) et externe (J+7) sans admettre une faute pénale avant instruction."
        ),
        "consigne": (
            "Gère la crise éthique : principes violés, sanctions, mesures préventives, "
            "communication interne/externe mesurée."
        ),
        "questions": [
            "Faits et principes éthiques violés.",
            "Sanctions et mesures correctives immédiates.",
            "Mesures préventives gouvernance achats.",
            "Communication interne (CSE) et externe (client GMS).",
            "Comment restaurer la confiance à 12 mois ?",
        ],
        "correctionModele": (
            "1) Violations :\n"
            "Conflit d'intérêts, favoritisme, surfacturation, défaut concurrence.\n\n"
            "2) Sanctions :\n"
            "Résiliation contrats, remboursement si dû, signalement autorités si infraction.\n\n"
            "3) Prévention :\n"
            "Double signature, appels d'offres obligatoires, déclaration liens, audit aléatoire.\n\n"
            "4) Communication :\n"
            "Interne : transparence, plan action ; externe : faits, mesures, pas de minimisation.\n\n"
            "5) Confiance 12 mois :\n"
            "Audit externe gouvernance, rapport public, indicateurs compliance."
        ),
        "attendu": "Crise gouvernance maîtrisée, plan prévention et communication.",
        "minChars": 450,
    },
]
