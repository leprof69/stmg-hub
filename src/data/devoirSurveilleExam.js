export const DS_EXAM_ID = "chapitre13_1h_2026";
export const DS_LOCK_TYPE = "DS 1h - Chapitre 13";

export const DS_EXERCISES = [
  {
    id: "ds13_e1",
    title: "Partie 1 - Questions de cours",
    context: "Chapitre 13 : analyse des performances commerciale et financière. Réponds avec un vocabulaire de cours précis et des définitions structurées.",
    questions: [
      {
        id: "q1",
        label: "Q1",
        points: 3,
        prompt: "Définis la performance d’une organisation et présente les 3 étapes de la démarche de performance.",
        expected: "Performance = atteinte d’objectifs prédéfinis. Étapes attendues : définition d’objectifs, mobilisation de moyens, atteinte d’un résultat.",
      },
      {
        id: "q2",
        label: "Q2",
        points: 3,
        prompt: "Explique clairement la différence entre efficacité et efficience puis illustre avec un exemple.",
        expected: "Efficacité = atteindre l’objectif. Efficience = atteindre l’objectif en optimisant les ressources. L’exemple doit montrer la différence entre résultat et coût des moyens.",
      },
      {
        id: "q3",
        label: "Q3",
        points: 2,
        prompt: "Définis rentabilité et profitabilité, puis cite et définis 3 indicateurs de performance commerciale.",
        expected: "Rentabilité = capacité à générer un profit à partir des capitaux/moyens investis. Profitabilité = capacité à générer un profit à partir de l’activité (CA). Indicateurs commerciaux : CA, part de marché, fidélité.",
      },
    ],
  },
  {
    id: "ds13_e2",
    title: "Partie 2 - Exercice calculé",
    context: "Entreprise NOVA SNACK. Données N : CA 1 260 000 €, marché 6 000 000 €, résultat net 94 500 €, capitaux propres 540 000 €. Données N-1 : CA 1 080 000 €, marché 5 700 000 €, résultat net 81 000 €, capitaux propres 500 000 €.",
    questions: [
      {
        id: "q1",
        label: "Q1",
        points: 4,
        prompt: "Calcule le taux d’évolution du chiffre d’affaires entre N-1 et N (formule, application numérique, résultat).",
        expected: "Taux d’évolution = (1 260 000 - 1 080 000) / 1 080 000 = +16,7 %.",
      },
      {
        id: "q2",
        label: "Q2",
        points: 4,
        prompt: "Calcule la part de marché de NOVA SNACK en N-1 puis en N et compare les deux résultats.",
        expected: "N-1 : 1 080 000 / 5 700 000 = 18,9 %. N : 1 260 000 / 6 000 000 = 21,0 %. Conclusion : gain de part de marché.",
      },
      {
        id: "q3",
        label: "Q3",
        points: 4,
        prompt: "Calcule la profitabilité et la rentabilité financière en N-1 puis en N, puis rédige une analyse de l’évolution de la performance financière.",
        expected: "Profitabilité N-1 = 81 000 / 1 080 000 = 7,5 %, N = 94 500 / 1 260 000 = 7,5 %. Rentabilité N-1 = 81 000 / 500 000 = 16,2 %, N = 94 500 / 540 000 = 17,5 %. Analyse : activité stable en marge relative, meilleure rentabilité des capitaux.",
      },
    ],
  },
  {
    id: "ds13_e3",
    title: "Partie 3 - Analyse d’objectifs",
    context: "Entreprise ECO'BAG. Objectifs N : +10 % de CA, satisfaction client 90 %, délai de livraison max 3 jours. Résultats N : CA N-1 = 800 000 €, CA N = 860 000 €, satisfaction = 87 %, délai moyen = 3,8 jours.",
    questions: [
      {
        id: "q1",
        label: "Q1",
        points: 3,
        prompt: "Calcule l’évolution du chiffre d’affaires entre N-1 et N puis indique si l’objectif de +10 % est atteint.",
        expected: "Évolution = (860 000 - 800 000) / 800 000 = +7,5 %. Objectif +10 % non atteint.",
      },
      {
        id: "q2",
        label: "Q2",
        points: 2,
        prompt: "Vérifie les objectifs de satisfaction (90 %) et de délai (3 jours) puis justifie ta conclusion.",
        expected: "Satisfaction 87 % < 90 % : non atteint. Délai 3,8 jours > 3 jours : non atteint.",
      },
      {
        id: "q3",
        label: "Q3",
        points: 3,
        prompt: "Rédige une analyse globale de la performance et propose 2 actions d’amélioration concrètes pour N+1.",
        expected: "Performance globale partiellement atteinte. Actions possibles : amélioration logistique pour délai, programme qualité/satisfaction, suivi d’indicateurs réguliers.",
      },
    ],
  },
];
