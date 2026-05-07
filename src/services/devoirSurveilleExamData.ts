export const DS_EXAM_ID = "chapitre13_1h_2026_v3";
export const DS_LOCK_TYPE = "DS 1h - Chapitre 13 (version 3)";

export const DS_EXERCISES = [
  {
    id: "ds13_e1",
    title: "Partie 1 - Questions de cours",
    context: "Chapitre 13 : analyse des performances commerciale et financière. Réponds avec un vocabulaire de cours précis, des définitions complètes et des phrases structurées.",
    questions: [
      {
        id: "q1",
        label: "Q1",
        points: 1,
        prompt: "Définis la performance d’une organisation et présente les trois étapes de la démarche de performance.",
        expected: "Performance = atteinte d’objectifs prédéfinis. Étapes attendues : définition d’objectifs, mobilisation de moyens, mesure/atteinte des résultats.",
      },
      {
        id: "q2",
        label: "Q2",
        points: 1,
        prompt: "Explique clairement la différence entre efficacité et efficience puis illustre avec un exemple.",
        expected: "Efficacité = atteindre l’objectif. Efficience = atteindre l’objectif en optimisant les ressources. L’exemple doit montrer la différence entre résultat et coût des moyens.",
      },
      {
        id: "q3",
        label: "Q3",
        points: 1,
        prompt: "Définis rentabilité et profitabilité, puis cite et définis 3 indicateurs de performance commerciale.",
        expected: "Rentabilité = capacité à générer un profit à partir des capitaux/moyens investis. Profitabilité = capacité à générer un profit à partir de l’activité (CA). Indicateurs commerciaux : CA, part de marché, fidélité.",
      },
      {
        id: "q4",
        label: "Q4",
        points: 1,
        prompt: "Explique ce qu’est un objectif mesurable. Donne un exemple d’objectif quantitatif et un exemple d’objectif qualitatif.",
        expected: "Un objectif mesurable est un objectif vérifiable avec des indicateurs explicites. Exemples attendus : quantitatif (CA en euros, volume de ventes, délai en jours), qualitatif (satisfaction client, qualité de service, ambiance de travail).",
      },
      {
        id: "q5",
        label: "Q5",
        points: 1,
        prompt: "Pourquoi la comparaison dans le temps et dans l’espace est-elle importante pour analyser la performance ?",
        expected: "Comparer dans le temps permet de mesurer une évolution (progression/régression). Comparer dans l’espace permet de situer l’organisation face aux concurrents ou à d’autres unités de référence.",
      },
      {
        id: "q6",
        label: "Q6",
        points: 1,
        prompt: "Montre en quoi les attentes des différents acteurs (clients, salariés, actionnaires, dirigeants) peuvent être contradictoires dans la recherche de performance.",
        expected: "Les acteurs poursuivent des objectifs parfois opposés : prix bas vs marge élevée, hausse de salaires vs réduction des coûts, dividendes élevés vs autofinancement, croissance rapide vs stabilité sociale.",
      },
    ],
  },
  {
    id: "ds13_e2",
    title: "Partie 2 - Cas pratique détaillé : performance commerciale et financière",
    context: "L’entreprise OCEA FOOD produit des lunch box isothermes pour les lycées et la restauration rapide. En N, elle lance une gamme personnalisable, signe un partenariat avec deux grossistes et renforce sa communication digitale. La direction souhaite mesurer les effets commerciaux et financiers de ces décisions.\n\nDonnées N : CA 1 620 000 €, marché 8 100 000 €, résultat net 113 400 €, capitaux propres 700 000 €.\nDonnées N-1 : CA 1 440 000 €, marché 7 900 000 €, résultat net 93 600 €, capitaux propres 650 000 €.",
    questions: [
      {
        id: "q1",
        label: "Q1",
        points: 2,
        prompt: "Calcule le taux d’évolution du chiffre d’affaires entre N-1 et N (formule, application numérique, résultat).",
        expected: "Taux d’évolution = (1 620 000 - 1 440 000) / 1 440 000 = +12,5 %.",
      },
      {
        id: "q2",
        label: "Q2",
        points: 1,
        prompt: "Calcule la part de marché de OCEA FOOD en N-1 puis en N et compare les deux résultats.",
        expected: "N-1 : 1 440 000 / 7 900 000 = 18,2 %. N : 1 620 000 / 8 100 000 = 20,0 %. Conclusion : gain de part de marché.",
      },
      {
        id: "q3",
        label: "Q3",
        points: 1,
        prompt: "Calcule la profitabilité en N-1 puis en N et interprète l’évolution obtenue.",
        expected: "Profitabilité N-1 = 93 600 / 1 440 000 = 6,5 %. Profitabilité N = 113 400 / 1 620 000 = 7,0 %. Interprétation : amélioration de la marge nette sur CA.",
      },
      {
        id: "q4",
        label: "Q4",
        points: 1,
        prompt: "Calcule la rentabilité financière en N-1 puis en N et interprète le résultat.",
        expected: "Rentabilité N-1 = 93 600 / 650 000 = 14,4 %. Rentabilité N = 113 400 / 700 000 = 16,2 %. Interprétation : meilleure rémunération des capitaux propres.",
      },
      {
        id: "q5",
        label: "Q5",
        points: 3,
        prompt: "Calcule la profitabilité et la rentabilité financière en N-1 puis en N, puis rédige une analyse de l’évolution de la performance financière.",
        expected: "Analyse attendue : progression du CA et de la part de marché, amélioration de la profitabilité et de la rentabilité financière. Les actions commerciales semblent efficaces et créent davantage de valeur.",
      },
    ],
  },
  {
    id: "ds13_e3",
    title: "Partie 3 - Cas pratique détaillé : pilotage par objectifs",
    context: "L’entreprise BLEU MARKET distribue des produits d’entretien écologiques auprès des commerces de proximité. Pour l’année N, la direction fixe trois objectifs : augmenter les ventes, améliorer la satisfaction client et réduire les délais de préparation de commandes.\n\nObjectifs N : +9 % de CA ; satisfaction client 91 % ; délai moyen de préparation 24 heures.\nRésultats N : CA N-1 = 1 000 000 €, CA N = 1 070 000 €, satisfaction = 88 %, délai moyen = 29 heures.",
    questions: [
      {
        id: "q1",
        label: "Q1",
        points: 1,
        prompt: "Calcule l’évolution du chiffre d’affaires entre N-1 et N puis indique si l’objectif de +9 % est atteint.",
        expected: "Évolution = (1 070 000 - 1 000 000) / 1 000 000 = +7,0 %. Objectif +9 % non atteint.",
      },
      {
        id: "q2",
        label: "Q2",
        points: 1,
        prompt: "Vérifie les objectifs de satisfaction (91 %) et de délai (24 h) puis justifie ta conclusion.",
        expected: "Satisfaction 88 % < 91 % : non atteint. Délai moyen 29 h > 24 h : non atteint.",
      },
      {
        id: "q3",
        label: "Q3",
        points: 3,
        prompt: "Rédige une analyse globale de la performance et propose 2 actions d’amélioration concrètes pour N+1.",
        expected: "Performance globale partiellement atteinte : progression du CA, mais objectif de croissance non atteint, satisfaction et délai insuffisants. Actions possibles : améliorer l’organisation logistique, renforcer le suivi client, ajuster la planification des équipes et des stocks.",
      },
      {
        id: "q4",
        label: "Q4",
        points: 1,
        prompt: "Explique en quoi la non-atteinte de certains objectifs peut révéler des contraintes de ressources, mais aussi des opportunités de progression pour l’année suivante.",
        expected: "Attendu : identifier des contraintes (capacités logistiques, coordination commerciale, ressources humaines) et proposer des opportunités (digitalisation du suivi, formation, planification, pilotage plus fin des indicateurs).",
      },
    ],
  },
];
