# -*- coding: utf-8 -*-
"""Chapitre 5 — L'évaluation et la rétribution de l'activité de travail."""

CHAPTER = 5

EXERCISES = [
    {
        "id": "e1",
        "title": "Finalités de l'évaluation professionnelle",
        "support": (
            "Chaque année, Michelin organise un entretien professionnel obligatoire : bilan des "
            "objectifs atteints, fixation de nouveaux indicateurs, discussion formations (sécurité, "
            "nouveaux outils), évolution de carrière possible, retour sur ergonomie des postes. "
            "Le salarié peut préparer une auto-évaluation. Le manager admet que l'évaluation reste "
            "partiellement subjective, d'où l'intérêt du dialogue."
        ),
        "consigne": (
            "Liste les finalités de l'évaluation de l'activité de travail selon le manuel et illustre "
            "avec le support Michelin."
        ),
        "questions": [
            "Quelles finalités de l'évaluation professionnelle le cours identifie-t-il ?",
            "Repère dans le texte un exemple pour chaque finalité citée.",
            "Pourquoi l'auto-évaluation réduit-elle le stress lié à la subjectivité ?",
        ],
        "correctionModele": (
            "1) Finalités :\n"
            "Bilan année, objectifs suivants, évolution carrière, formations, conditions de travail.\n\n"
            "2) Exemples Michelin :\n"
            "Objectifs, formation sécurité, évolution carrière, ergonomie.\n\n"
            "3) Auto-évaluation :\n"
            "Permet au salarié d'exprimer sa perception, réduit l'écart avec le jugement du manager."
        ),
        "attendu": "Cinq finalités présentes, exemples précis, subjectivité évoquée.",
        "notions": ["Cinq finalités présentes", "exemples précis", "subjectivité évoquée."],
        "minChars": 120,
    },
    {
        "id": "e2",
        "title": "Entretien professionnel et subjectivité",
        "support": (
            "Lors de l'entretien annuel chez Bouygues Telecom, Amina estime avoir dépassé ses objectifs "
            "commerciaux de 8 %. Son manager retient 5 % et note « marge de progression ». Amina perçoit "
            "un biais. Le RH propose un entretien de recadrage avec grille d'évaluation partagée à l'avance "
            "(critères : CA, satisfaction client, travail d'équipe). Les deux parties signent un compte "
            "rendu. Amina demande une formation négociation pour monter en compétence."
        ),
        "consigne": (
            "Explique le rôle de l'entretien professionnel, le risque de subjectivité et l'intérêt "
            "d'une grille d'évaluation."
        ),
        "questions": [
            "Qu'est-ce qu'un entretien professionnel dans ce contexte ?",
            "Pourquoi la perception diffère-t-elle entre Amina et son manager ?",
            "Comment la grille d'évaluation améliore-t-elle le processus ?",
        ],
        "correctionModele": (
            "1) Entretien professionnel :\n"
            "Moment d'échange manager-collaborateur sur résultats, objectifs, formation, conditions.\n\n"
            "2) Subjectivité :\n"
            "Même données interprétées différemment (8 % vs 5 %), jugement du manager influencé.\n\n"
            "3) Grille d'évaluation :\n"
            "Critères explicites partagés avant l'entretien, plus d'objectivité, traçabilité signée."
        ),
        "attendu": "Entretien défini, subjectivité expliquée, grille justifiée.",
        "notions": ["Entretien défini", "subjectivité expliquée", "grille justifiée."],
        "minChars": 140,
    },
    {
        "id": "e3",
        "title": "Indicateurs d'activité et de productivité",
        "support": (
            "La boulangerie industrielle « Pain Quotidien » suit chaque mois : nombre de baguettes "
            "produites, taux de rebuts, heures travaillées par équipe, effectif présent. En janvier : "
            "980 000 baguettes, 4 200 heures, 95 salariés. Février : 1 050 000 baguettes, 4 100 heures, "
            "94 salariés. Le directeur utilise ces indicateurs pour l'évaluation collective de l'atelier."
        ),
        "consigne": (
            "Distingue indicateurs d'activité et de productivité. Calcule productivité horaire et "
            "par tête pour février."
        ),
        "questions": [
            "Quels indicateurs d'activité sont suivis ?",
            "Calcule la productivité horaire et par tête de février (formules du cours).",
            "Comment ces indicateurs aident-ils l'évaluation ?",
        ],
        "correctionModele": (
            "1) Indicateurs d'activité :\n"
            "Volume production (baguettes), rebuts, heures, effectif.\n\n"
            "2) Calculs février :\n"
            "Productivité horaire = 1 050 000 / 4 100 ? 256 baguettes/heure.\n"
            "Productivité par tête = 1 050 000 / 94 ? 11 170 baguettes/salarié.\n\n"
            "3) Aide à l'évaluation :\n"
            "Mesure objective de l'efficacité, repère baisses ou progressions, alimente tableau de bord."
        ),
        "attendu": "Formules correctes, calculs février, lien évaluation.",
        "notions": ["Formules correctes", "calculs février", "lien évaluation."],
        "minChars": 150,
        "supportTables": [
            {
                "title": "Production atelier — Pain Quotidien",
                "columns": ["Mois", "Baguettes", "Heures", "Effectif"],
                "rows": [
                    ["Janvier", "980 000", "4 200", "95"],
                    ["Février", "1 050 000", "4 100", "94"],
                ],
            }
        ],
    },
    {
        "id": "e4",
        "title": "Salaire brut, net et charges",
        "support": (
            "Camille, assistante administrative, perçoit un salaire de base de 2 200 €, une prime "
            "d'ancienneté de 80 € et 120 € d'heures supplémentaires. Cotisations salariales : 22 % "
            "du brut. Prélèvement à la source : 3 %. Le manuel rappelle : salaire brut = base + "
            "compléments ; net après prélèvement = brut ? cotisations ? impôt source ; employeur "
            "verse aussi des cotisations patronales."
        ),
        "consigne": (
            "Calcule le salaire brut puis le net après prélèvement à la source. Explique la "
            "différence brut/net et cite les composantes de la rémunération."
        ),
        "questions": [
            "Calcule le salaire brut de Camille.",
            "Calcule le net après prélèvement à la source.",
            "Pourquoi l'employeur paie-t-il plus que le brut au salarié ?",
        ],
        "correctionModele": (
            "1) Brut = 2 200 + 80 + 120 = 2 400 €.\n\n"
            "2) Cotisations 22 % = 528 €. Reste 1 872 €. Impôt source 3 % de 2 400 = 72 €. "
            "Net ? 1 800 € (arrondi selon assiette réelle).\n\n"
            "3) Employeur :\n"
            "Cotisations patronales (Urssaf, retraite) s'ajoutent au brut = coût total employeur."
        ),
        "attendu": "Calculs brut/net corrects, composantes nommées.",
        "notions": ["Calculs brut/net corrects", "composantes nommées."],
        "minChars": 160,
    },
    {
        "id": "e5",
        "title": "Primes et avantages en nature",
        "support": (
            "Dassault Aviation rémunère ses techniciens avec salaire de base, prime de risque (atelier), "
            "prime de rendement si objectifs qualité atteints, tickets restaurant (avantage en nature), "
            "véhicule de fonction pour les inspecteurs (avantage en nature), indemnité de transport "
            "non imposable dans certaines limites. La direction communique sur l'équité interne : "
            "grille transparente liant primes aux indicateurs d'activité."
        ),
        "consigne": (
            "Classe chaque élément de rémunération (salaire, prime, avantage en nature, indemnité). "
            "Explique l'équité interne."
        ),
        "questions": [
            "Définis prime et avantage en nature avec un exemple du support.",
            "Quelle différence entre indemnité de transport et ticket restaurant ?",
            "Comment la grille transparente favorise-t-elle l'équité interne ?",
        ],
        "correctionModele": (
            "1) Prime : complément récompensant performance ou risque (rendement, risque atelier).\n"
            "Avantage en nature : tickets restaurant, véhicule à conditions préférentielles.\n\n"
            "2) Indemnité :\n"
            "Dédommagement de frais professionnels (transport), pas rémunération du travail en soi.\n\n"
            "3) Équité interne :\n"
            "Critères connus de tous, lien primes-indicateurs, réduit sentiment d'injustice."
        ),
        "attendu": "Composantes de rémunération classées, équité interne expliquée.",
        "notions": ["Composantes de rémunération classées", "équité interne expliquée."],
        "minChars": 180,
    },
    {
        "id": "e6",
        "title": "Participation et intéressement",
        "support": (
            "L'entreprise de plus de 50 salariés « TechFlow » (120 salariés) verse une participation "
            "légale de 400 000 € répartie au prorata des salaires. Elle propose aussi un accord "
            "d'intéressement lié au résultat d'exploitation : si ROE > 8 %, bonus collectif. En 2024, "
            "ROE = 9 % : chaque salarié reçoit 1 200 €. Le CSE valide l'accord. Objectif : fédérer "
            "autour de la performance collective."
        ),
        "consigne": (
            "Distingue participation et intéressement. Explique la rémunération collective et la "
            "fidélisation."
        ),
        "questions": [
            "Qu'est-ce que la participation ? TechFlow y est-elle soumise ?",
            "Qu'est-ce que l'intéressement ? Quel déclencheur en 2024 ?",
            "Quel lien avec la motivation et la fidélisation ?",
        ],
        "correctionModele": (
            "1) Participation : obligatoire >50 salariés, part des bénéfices à tous les salariés.\n\n"
            "2) Intéressement : facultatif, lié performance (ROE > 8 %), 1 200 € versés.\n\n"
            "3) Motivation :\n"
            "Rémunération collective aligne intérêts salariés/organisation, renforce engagement."
        ),
        "attendu": "Participation vs intéressement, seuil 50 salariés, motivation.",
        "notions": ["Participation vs intéressement", "seuil 50 salariés", "motivation."],
        "minChars": 180,
    },
    {
        "id": "e7",
        "title": "Équité interne et externe",
        "support": (
            "Un ingénieur chez Safran compare son salaire à celui d'un homologue chez Thales (équité "
            "externe) et à celui d'un technicien du même service (équité interne). Il estime un écart "
            "de 8 % avec Thales et 25 % avec le technicien. Le DRH explique : grille de métiers, "
            "convention collective, prime ancienneté. Une enquête salariale sectorielle est lancée "
            "pour éviter les départs vers la concurrence."
        ),
        "consigne": (
            "Définis équité interne et équité externe. Analyse la situation de l'ingénieur."
        ),
        "questions": [
            "Qu'est-ce que l'équité externe ? Et l'équité interne ?",
            "Quels éléments le DRH invoque-t-il pour justifier les écarts ?",
            "Pourquoi l'enquête sectorielle répond-elle à un enjeu de rétention ?",
        ],
        "correctionModele": (
            "1) Équité externe : comparaison avec autres organisations (Thales).\n"
            "Équité interne : comparaison entre postes d'un même employeur.\n\n"
            "2) Justifications DRH :\n"
            "Grille métiers, convention collective, prime ancienneté = critères objectivés.\n\n"
            "3) Enquête sectorielle :\n"
            "Ajuster rémunération externe pour limiter départs (turn-over, coût recrutement)."
        ),
        "attendu": "Deux équités distinguées, leviers RH identifiés.",
        "notions": ["Deux équités distinguées", "leviers RH identifiés."],
        "minChars": 200,
    },
    {
        "id": "e8",
        "title": "Lien évaluation-rétribution-motivation",
        "support": (
            "Chez L'Oréal, la prime au mérite suit l'entretien annuel : note A = 15 % de prime, B = 8 %, C = 0 %. "
            "Un salarié noté B accepte car la grille était connue. Un salarié noté C démissionne. "
            "Le manager du site Brest améliore les entretiens en fixant des objectifs SMART en début "
            "d'année. Motivation globale en hausse selon enquête interne (+12 points)."
        ),
        "consigne": (
            "Explique le lien entre évaluation, rétribution (prime au mérite) et motivation. "
            "Montre effets positifs et négatifs."
        ),
        "questions": [
            "Comment l'évaluation déclenche-t-elle la rétribution variable ?",
            "Pourquoi la transparence de la grille motive-t-elle le salarié B ?",
            "Pourquoi le salarié C part-il ? Que change le manager ?",
        ],
        "correctionModele": (
            "1) Lien : évaluation (note) ? prime au mérite (rétribution) ? sentiment de justice/motivation.\n\n"
            "2) Salarié B :\n"
            "Équité interne respectée, critères connus, acceptation.\n\n"
            "3) Salarié C et amélioration :\n"
            "Perception d'injustice ? démotivation, départ. Objectifs SMART en amont clarifient attentes."
        ),
        "attendu": "Chaîne évaluation-rétribution-motivation articulée.",
        "minChars": 220,
    },
    {
        "id": "e9",
        "title": "Taux d'absentéisme",
        "support": (
            "L'usine « TextilPro » enregistre 1 240 jours d'absence pour maladie sur une période où "
            "le temps théorique de travail est de 18 500 jours. Le DRH calcule le taux d'absentéisme. "
            "Les causes identifiées : cadence élevée, climat social tendu. Actions : ergonomie, "
            "formation managers. Objectif : passer sous 5 %."
        ),
        "consigne": (
            "Calcule le taux d'absentéisme avec la formule du cours. Interprète le résultat et "
            "les coûts pour l'organisation."
        ),
        "questions": [
            "Applique la formule : (jours absence / jours théoriques) × 100.",
            "Le taux est-il préoccupant ? Justifie.",
            "Quels coûts l'absentéisme génère-t-il selon le manuel ?",
        ],
        "correctionModele": (
            "1) Taux = (1 240 / 18 500) × 100 ? 6,7 %.\n\n"
            "2) Préoccupant :\n"
            "Proche de 7 %, au-dessus de l'objectif 5 %, signale dysfonctionnements.\n\n"
            "3) Coûts :\n"
            "Maintien salaire, charge sur présents, baisse productivité, image employeur."
        ),
        "attendu": "Calcul correct, interprétation et coûts cités.",
        "notions": ["correct", "interprétation et coûts cités."],
        "minChars": 200,
        "supportTables": [
            {
                "title": "Absentéisme TextilPro",
                "columns": ["Indicateur", "Valeur"],
                "rows": [
                    ["Jours d'absence", "1 240"],
                    ["Jours théoriques travaillés", "18 500"],
                ],
            }
        ],
    },
    {
        "id": "e10",
        "title": "Turn-over et coût du recrutement",
        "support": (
            "Start-up « GreenApps » : effectif 01/01/N = 80 ; départs en N = 14 ; arrivées = 18. "
            "Le DRH estime qu'un recrutement raté coûte jusqu'à 100 000 € (temps RH, annonces, tests). "
            "Turn-over élevé entraîne fuite de compétences et baisse productivité. La direction lie "
            "une revalorisation des salaires juniors à une baisse des départs."
        ),
        "consigne": (
            "Calcule le taux de rotation du personnel. Explique pourquoi le turn-over est un coût "
            "pour l'organisation au-delà de la rémunération."
        ),
        "questions": [
            "Calcule le taux de rotation : ((départs + arrivées)/2) / effectif × 100.",
            "Interprète le résultat pour la fidélisation.",
            "Pourquoi maîtriser le recrutement est-il stratégique (support) ?",
        ],
        "correctionModele": (
            "1) Taux = ((14 + 18) / 2) / 80 × 100 = 16 / 80 × 100 = 20 %.\n\n"
            "2) Interprétation :\n"
            "Turn-over élevé = faible fidélité, instabilité des équipes.\n\n"
            "3) Recrutement :\n"
            "Coût direct (100 000 € si échec) + fuite compétences + baisse productivité ; "
            "rétribution compétitive limite départs."
        ),
        "attendu": "Formule turn-over correcte, coûts multiples identifiés.",
        "notions": ["Formule turn-over correcte", "coûts multiples identifiés."],
        "minChars": 240,
        "supportTables": [
            {
                "title": "Effectifs GreenApps — année N",
                "columns": ["Indicateur", "Valeur"],
                "rows": [
                    ["Effectif au 01/01/N", "80"],
                    ["Départs", "14"],
                    ["Arrivées", "18"],
                ],
            }
        ],
    },
    {
        "id": "cas1",
        "title": "Étude de cas : Politique de rémunération Danone",
        "support": (
            "Danone combine salaire de base (convention agroalimentaire), primes de rendement liées "
            "aux objectifs CO? et CA, participation légale, intéressement sur marge, tickets restaurant, "
            "télétravail deux jours. L'entretien professionnel fixe trois objectifs notés. En 2024, "
            "taux d'absentéisme 4,2 %, turn-over 9 %. Un site voit une grève sur primes jugées opaques ; "
            "la direction publie la grille et forme les managers. Équité externe : enquête salariale "
            "monde vs Nestlé/Unilever."
        ),
        "consigne": (
            "Rédige une analyse type bac : évaluation, composantes de rétribution, équité, "
            "indicateurs RH, lien motivation. Propose des recommandations."
        ),
        "questions": [
            "Recense les composantes de la rémunération chez Danone.",
            "Comment l'évaluation structure-t-elle la prime ?",
            "Analyse équité interne (grève) et externe (enquête).",
            "Interprète absentéisme et turn-over.",
            "Synthèse (15 lignes) : politique de rétribution équilibrée ?",
        ],
        "correctionModele": (
            "1) Rémunération : base, primes rendement, participation, intéressement, tickets restaurant.\n\n"
            "2) Évaluation : entretien, 3 objectifs notés ? prime liée.\n\n"
            "3) Équité :\n"
            "Interne : grève = grille opaque ? transparence. Externe : benchmark concurrents.\n\n"
            "4) Indicateurs :\n"
            "Absentéisme 4,2 % modéré, turn-over 9 % acceptable, vigilance site en grève.\n\n"
            "5) Synthèse :\n"
            "Politique globalement équilibrée si transparence et mix fixe/variable ; motivation par "
            "collectif et RSE ; améliorer communication primes."
        ),
        "attendu": "Cas intégré chapitre 5, recommandations concrètes.",
        "notions": ["Cas intégré chapitre 5", "recommandations concrètes."],
        "minChars": 400,
    },
    {
        "id": "cas2",
        "title": "Étude de cas : Crise d'absentéisme et rétribution",
        "support": (
            "Hôpital privé « Santé+ » : 450 salariés, absentéisme 11 %, turn-over infirmières 24 %. "
            "Causes : sous-effectif, primes nuit faibles, évaluation perçue comme injuste. Projet : "
            "prime de risque +15 %, entretiens avec grille, auto-évaluation, participation aux gains "
            "si indicateurs qualité atteints. Coût recrutement infirmière : 25 000 €. Simulation : "
            "baisse absentéisme à 7 % économiserait 180 000 €/an. Négociation avec CSE en cours."
        ),
        "consigne": (
            "Construis un tableau de bord RH et un argumentaire direction : évaluation, rétribution, "
            "coûts du travail, motivation. Chiffre le ROI des mesures proposées."
        ),
        "questions": [
            "Diagnostic : relie absentéisme, turn-over, évaluation et rémunération.",
            "Liste les mesures et leur effet attendu sur motivation.",
            "Compare coût des mesures vs économies absentéisme (support).",
            "Quel rôle du CSE dans la négociation collective ?",
            "Synthèse (18 lignes) : la rétribution peut-elle seule résoudre la crise ?",
        ],
        "correctionModele": (
            "1) Diagnostic :\n"
            "Mauvaises conditions + primes faibles + évaluation subjective ? absentéisme et départs.\n\n"
            "2) Mesures :\n"
            "Prime risque, grille, auto-évaluation, intéressement qualité ? équité et motivation.\n\n"
            "3) ROI :\n"
            "Économie 180 000 € si absentéisme 7 % vs coût primes/recrutement à modéliser.\n\n"
            "4) CSE :\n"
            "Négociation conditions et primes, légitimité sociale.\n\n"
            "5) Synthèse :\n"
            "Rétribution seule insuffisante ; nécessite effectifs, QVCT, évaluation juste ; "
            "rétribution + organisation = pérennité."
        ),
        "attendu": "Argumentaire chiffré, diagnostic systémique, synthèse nuancée.",
        "notions": ["Argumentaire chiffré", "diagnostic systémique", "synthèse nuancée."],
        "minChars": 450,
        "supportTables": [
            {
                "title": "Indicateurs Santé+",
                "columns": ["Indicateur", "Valeur actuelle", "Cible"],
                "rows": [
                    ["Absentéisme", "11 %", "7 %"],
                    ["Turn-over infirmières", "24 %", "—"],
                    ["Coût recrutement / poste", "25 000 €", "—"],
                    ["Économie potentielle", "—", "180 000 €/an"],
                ],
            }
        ],
    },
]
