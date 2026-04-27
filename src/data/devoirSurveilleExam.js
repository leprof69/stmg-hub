export const DS_EXAM_ID = "chapitre13_1h_2026_v2";
export const DS_LOCK_TYPE = "DS 1h - Chapitre 13 (version 2)";

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
        prompt: "Définis la performance d’une organisation et présente les 3 étapes de la démarche de performance.",
        expected: "Performance = atteinte d’objectifs prédéfinis. Étapes attendues : définition d’objectifs, mobilisation de moyens, atteinte d’un résultat.",
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
    context: "L’entreprise GREEN CUP fabrique des gobelets réutilisables pour les cafés et les événements locaux. En N, elle ouvre un site e-commerce, élargit sa gamme et renforce sa force commerciale. La direction veut vérifier l’impact de ces choix sur la performance commerciale et financière.\n\nDonnées N : CA 1 485 000 €, marché 7 200 000 €, résultat net 118 800 €, capitaux propres 660 000 €.\nDonnées N-1 : CA 1 320 000 €, marché 7 000 000 €, résultat net 99 000 €, capitaux propres 620 000 €.",
    questions: [
      {
        id: "q1",
        label: "Q1",
        points: 2,
        prompt: "Calcule le taux d’évolution du chiffre d’affaires entre N-1 et N (formule, application numérique, résultat).",
        expected: "Taux d’évolution = (1 485 000 - 1 320 000) / 1 320 000 = +12,5 %.",
      },
      {
        id: "q2",
        label: "Q2",
        points: 1,
        prompt: "Calcule la part de marché de NOVA SNACK en N-1 puis en N et compare les deux résultats.",
        expected: "N-1 : 1 320 000 / 7 000 000 = 18,9 %. N : 1 485 000 / 7 200 000 = 20,6 %. Conclusion : gain de part de marché.",
      },
      {
        id: "q3",
        label: "Q3",
        points: 1,
        prompt: "Calcule la profitabilité en N-1 puis en N et interprète l’évolution obtenue.",
        expected: "Profitabilité N-1 = 99 000 / 1 320 000 = 7,5 %. Profitabilité N = 118 800 / 1 485 000 = 8,0 %. Interprétation : amélioration de la marge nette sur CA.",
      },
      {
        id: "q4",
        label: "Q4",
        points: 1,
        prompt: "Calcule la rentabilité financière en N-1 puis en N et interprète le résultat.",
        expected: "Rentabilité N-1 = 99 000 / 620 000 = 16,0 %. Rentabilité N = 118 800 / 660 000 = 18,0 %. Interprétation : meilleure rémunération des capitaux propres.",
      },
      {
        id: "q5",
        label: "Q5",
        points: 3,
        prompt: "Calcule la profitabilité et la rentabilité financière en N-1 puis en N, puis rédige une analyse de l’évolution de la performance financière.",
        expected: "Analyse attendue : performance commerciale en hausse (CA et part de marché), profitabilité en progression, rentabilité financière en hausse. Les investissements semblent efficaces : ils soutiennent la croissance et améliorent la performance financière.",
      },
    ],
  },
  {
    id: "ds13_e3",
    title: "Partie 3 - Cas pratique détaillé : pilotage par objectifs",
    context: "L’entreprise VIVA TEXTILE vend des tenues professionnelles à des PME. En N, la direction fixe trois objectifs : accélérer la croissance, améliorer la satisfaction client et réduire les retards de livraison. En fin d’année, les indicateurs sont les suivants.\n\nObjectifs N : +12 % de CA ; satisfaction client 92 % ; délai moyen de livraison 2,5 jours.\nRésultats N : CA N-1 = 950 000 €, CA N = 1 036 500 €, satisfaction = 89 %, délai moyen = 2,9 jours.",
    questions: [
      {
        id: "q1",
        label: "Q1",
        points: 1,
        prompt: "Calcule l’évolution du chiffre d’affaires entre N-1 et N puis indique si l’objectif de +12 % est atteint.",
        expected: "Évolution = (1 036 500 - 950 000) / 950 000 = +9,1 %. Objectif +12 % non atteint.",
      },
      {
        id: "q2",
        label: "Q2",
        points: 1,
        prompt: "Vérifie les objectifs de satisfaction (92 %) et de délai (2,5 jours) puis justifie ta conclusion.",
        expected: "Satisfaction 89 % < 92 % : non atteint. Délai 2,9 jours > 2,5 jours : non atteint.",
      },
      {
        id: "q3",
        label: "Q3",
        points: 3,
        prompt: "Rédige une analyse globale de la performance et propose 2 actions d’amélioration concrètes pour N+1.",
        expected: "Performance globale partiellement atteinte : CA progresse mais en dessous de l’objectif, satisfaction et délai non atteints. Actions possibles : optimiser la préparation des commandes, renforcer le SAV, mieux planifier les stocks et suivre les indicateurs mensuellement.",
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
