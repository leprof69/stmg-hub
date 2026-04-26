export const DS_EXAM_ID = "chapitre13_1h_2026";
export const DS_LOCK_TYPE = "DS 1h - Chapitre 13";

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
    context: "L’entreprise NOVA SNACK vend des lunch box réutilisables aux lycéens et aux entreprises. En N, elle lance une nouvelle gamme premium, augmente ses dépenses de communication et renforce son réseau de distribution dans deux nouvelles villes. Le dirigeant veut savoir si ces décisions améliorent réellement la performance commerciale et financière.\n\nDonnées N : CA 1 260 000 €, marché 6 000 000 €, résultat net 94 500 €, capitaux propres 540 000 €.\nDonnées N-1 : CA 1 080 000 €, marché 5 700 000 €, résultat net 81 000 €, capitaux propres 500 000 €.",
    questions: [
      {
        id: "q1",
        label: "Q1",
        points: 2,
        prompt: "Calcule le taux d’évolution du chiffre d’affaires entre N-1 et N (formule, application numérique, résultat).",
        expected: "Taux d’évolution = (1 260 000 - 1 080 000) / 1 080 000 = +16,7 %.",
      },
      {
        id: "q2",
        label: "Q2",
        points: 1,
        prompt: "Calcule la part de marché de NOVA SNACK en N-1 puis en N et compare les deux résultats.",
        expected: "N-1 : 1 080 000 / 5 700 000 = 18,9 %. N : 1 260 000 / 6 000 000 = 21,0 %. Conclusion : gain de part de marché.",
      },
      {
        id: "q3",
        label: "Q3",
        points: 1,
        prompt: "Calcule la profitabilité en N-1 puis en N et interprète l’évolution obtenue.",
        expected: "Profitabilité N-1 = 81 000 / 1 080 000 = 7,5 %. Profitabilité N = 94 500 / 1 260 000 = 7,5 %. Interprétation : marge nette stable par rapport au CA.",
      },
      {
        id: "q4",
        label: "Q4",
        points: 1,
        prompt: "Calcule la rentabilité financière en N-1 puis en N et interprète le résultat.",
        expected: "Rentabilité N-1 = 81 000 / 500 000 = 16,2 %. Rentabilité N = 94 500 / 540 000 = 17,5 %. Interprétation : meilleure rémunération des capitaux propres.",
      },
      {
        id: "q5",
        label: "Q5",
        points: 3,
        prompt: "Calcule la profitabilité et la rentabilité financière en N-1 puis en N, puis rédige une analyse de l’évolution de la performance financière.",
        expected: "Analyse attendue : performance commerciale en hausse (CA et part de marché), profitabilité stable, rentabilité financière en progression. Les investissements commerciaux semblent efficaces pour gagner des parts de marché tout en maintenant le niveau de profitabilité.",
      },
    ],
  },
  {
    id: "ds13_e3",
    title: "Partie 3 - Cas pratique détaillé : pilotage par objectifs",
    context: "L’entreprise ECO'BAG fabrique des sacs réutilisables à destination des commerces de proximité. Pour l’année N, la direction fixe trois objectifs prioritaires : croissance de l’activité, amélioration de la satisfaction client et réduction des délais de livraison. En fin d’année, les indicateurs suivants sont relevés.\n\nObjectifs N : +10 % de CA ; satisfaction client 90 % ; délai de livraison maximum 3 jours.\nRésultats N : CA N-1 = 800 000 €, CA N = 860 000 €, satisfaction = 87 %, délai moyen = 3,8 jours.",
    questions: [
      {
        id: "q1",
        label: "Q1",
        points: 1,
        prompt: "Calcule l’évolution du chiffre d’affaires entre N-1 et N puis indique si l’objectif de +10 % est atteint.",
        expected: "Évolution = (860 000 - 800 000) / 800 000 = +7,5 %. Objectif +10 % non atteint.",
      },
      {
        id: "q2",
        label: "Q2",
        points: 1,
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
      {
        id: "q4",
        label: "Q4",
        points: 1,
        prompt: "Explique en quoi la non-atteinte de certains objectifs peut révéler des contraintes de ressources, mais aussi des opportunités de progression pour l’année suivante.",
        expected: "Attendu : identifier des contraintes (organisation logistique, moyens humains, coordination) et proposer des opportunités (digitalisation du suivi, formation, meilleure planification, pilotage plus fin des indicateurs).",
      },
    ],
  },
];
