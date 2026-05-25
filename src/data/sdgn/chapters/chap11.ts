import type { SdgnMissionExercise } from "../types";

export const SDGN_CHAP11_EXERCISES: SdgnMissionExercise[] = [
  {
    id: "sdgn11-e1",
    title: "Les facteurs de production",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 120,
    consigne: "\u00c0 partir du document, mobilise facteurs de production et travail/capital pour r\u00e9pondre aux questions (\u00ab Les facteurs de production \u00bb).",
    questions: [
      "Distingue les facteurs de production \u00ab travail \u00bb et \u00ab capital \u00bb dans cet exemple (donne au moins deux exemples pour chaque cat\u00e9gorie).",
      "Explique en une phrase pourquoi le chiffre d'affaires ne revient pas int\u00e9gralement \u00e0 l'entreprise."
    ],
    correctionModele: "",
    attendu: "Distinction travail / capital correcte, lien CA et paiements des tiers.",
    notionsCibles: ["facteurs de production", "travail/capital"],
  },
  {
    id: "sdgn11-e2",
    title: "Le chiffre d'affaires",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 130,
    consigne: "\u00c0 partir du document, mobilise chiffre d'affaires et HT/TTC pour r\u00e9pondre aux questions (\u00ab Le chiffre d'affaires \u00bb).",
    questions: [
      "D\u00e9finis le chiffre d'affaires avec tes mots.",
      "Pourquoi le programme impose souvent de raisonner en HT pour calculer la valeur ajout\u00e9e et les consommations interm\u00e9diaires ?"
    ],
    correctionModele: "",
    attendu: "D\u00e9finition claire, justification HT coh\u00e9rente.",
    notionsCibles: ["chiffre d'affaires", "HT/TTC"],
  },
  {
    id: "sdgn11-e3",
    title: "Calculer la valeur ajout\u00e9e",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 130,
    support: "Donn\u00e9es exercice N \u2014 Cosm\u00e9Bio SAS (milliers d'euros HT).",

    supportTables: [
      {
        title: "Éléments pour le calcul",
        columns: ["Rubrique", "Montant (K€ HT)"],
        rows: [
          ["Chiffre d'affaires (ventes)", "4 200"],
          ["Achats de matières premières", "1 100"],
          ["Énergie (électricité, gaz)", "180"],
          ["Prestations externes (publicité, audit)", "420"],
          ["Consommations intermédiaires (total)", "1 700"],
        ],
      },
    ],
    consigne: "Applique la formule du cours et montre ton calcul.",
    questions: [
      "Calcule la valeur ajout\u00e9e : VA = CA \u2212 consommations interm\u00e9diaires.",
      "Explique ce que repr\u00e9sente \u00e9conomiquement la valeur ajout\u00e9e pour Cosm\u00e9Bio."
    ],
    correctionModele: "",
    attendu: "Formule correcte, r\u00e9sultat exact, interpr\u00e9tation en termes de richesse cr\u00e9\u00e9e.",
    notionsCibles: ["valeur ajout\u00e9e", "consommations interm\u00e9diaires"],
  },
  {
    id: "sdgn11-e4",
    title: "CA = quantit\u00e9s \u00d7 prix unitaire HT",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 160,
    support: "La biscuiterie Armor Biscuits vend deux gammes au m\u00eame exercice (prix HT).",

    supportTables: [
      {
        title: "Ventes de l'exercice",
        columns: ["Gamme", "Quantité vendue", "Prix unitaire HT"],
        rows: [
          ["Palets bretons", "120 000 boîtes", "2,80 €"],
          ["Sablés premium", "35 000 boîtes", "6,50 €"],
        ],
      },
    ],
    consigne: "Calcule puis synth\u00e9tise.",
    questions: [
      "Calcule le chiffre d'affaires HT total en appliquant CA = \u03a3 (quantit\u00e9s \u00d7 prix unitaire HT).",
      "Indique le pourcentage du CA repr\u00e9sent\u00e9 par la gamme premium (arrondi \u00e0 une d\u00e9cimale)."
    ],
    correctionModele: "",
    attendu: "Calculs d\u00e9taill\u00e9s, pourcentage correct.",
    notionsCibles: ["r\u00e9partition VA", "partage valeur"],
  },
  {
    id: "sdgn11-e5",
    title: "Consommations interm\u00e9diaires",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 170,

    supportTables: [
      {
        title: "À qualifier pour Armor Biscuits",
        columns: ["Opération", "Entrer dans les CI ?"],
        rows: [
          ["Achat de beurre pour la pâte", "…"],
          ["Salaires des opérateurs de ligne", "…"],
          ["Loyer de l'usine", "…"],
          ["Dividendes versés aux associés", "…"],
          ["Électricité de production", "…"],
        ],
      },
    ],
    consigne: "",
    questions: [
      "Compl\u00e8te la colonne \u00ab justification \u00bb pour les cinq op\u00e9rations."
    ],
    correctionModele: "",
    attendu: "Distinction CI / charges de r\u00e9partition ou financier ma\u00eetris\u00e9e.",
    notionsCibles: ["partenariat", "valeur partenariale"],
  },
  {
    id: "sdgn11-e6",
    title: "R\u00e9partir la valeur ajout\u00e9e entre les acteurs",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 190,

    supportTables: [
      {
        title: "Répartition de la VA — Manufacture Delta (M€)",
        columns: ["Bénéficiaire", "Montant (M€)"],
        rows: [
          ["Salaires nets et charges sociales (ensemble)", "42"],
          ["Impôts et taxes (État)", "8"],
          ["Intérêts d'emprunts (banques)", "3"],
          ["Dotations aux amortissements et réserves (entreprise)", "15"],
          ["Résultat distribuable incluant dividendes (actionnaires)", "12"],
          ["Total VA", "80"],
        ],
      },
    ],
    consigne: "Analyse la r\u00e9partition.",
    questions: [
      "V\u00e9rifie que la somme des montants \u00e9gale bien la valeur ajout\u00e9e totale.",
      "Identifie qui re\u00e7oit la part la plus importante et ce que cela traduit sur le plan \u00e9conomique.",
      "Cite deux contreparties concr\u00e8tes vers\u00e9es aux actionnaires et aux salari\u00e9s selon le cours."
    ],
    correctionModele: "",
    attendu: "Calcul de coh\u00e9rence, lecture du tableau, contreparties du cours.",
    notionsCibles: ["fournisseurs", "clients"],
  },
  {
    id: "sdgn11-e7",
    title: "D\u00e9cisions de gestion et risque de conflit",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 200,
    consigne: "Mobilise la notion de dilemme du cours.",
    questions: [
      "Formule le dilemme entre r\u00e9mun\u00e9ration des actionnaires et r\u00e9mun\u00e9ration des salari\u00e9s.",
      "Propose un arbitrage r\u00e9aliste (sans chercher \u00ab la \u00bb bonne r\u00e9ponse unique) qui nomme explicitement les parties prenantes."
    ],
    correctionModele: "",
    attendu: "Dilemme bien pos\u00e9, arbitrage argument\u00e9 et multicrit\u00e8re.",
    notionsCibles: ["salari\u00e9s", "actionnaires"],
  },
  {
    id: "sdgn11-e8",
    title: "Salari\u00e9s actionnaires",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 260,
    minChars: 220,
    consigne: "Explique le lien avec la r\u00e9partition de la valeur et les conflits possibles.",
    questions: [
      "En quoi le fait de devenir actionnaire peut-il modifier la position des salari\u00e9s dans la r\u00e9partition de la valeur ajout\u00e9e ?",
      "Quel risque ou limite peux-tu mentionner si la valeur de l'action baisse fortement ?"
    ],
    correctionModele: "",
    attendu: "Double statut salari\u00e9/actionnaire, risque de concentration.",
    notionsCibles: ["\u00c9tat", "collectivit\u00e9s"],
  },
  {
    id: "sdgn11-e9",
    title: "Valeur actionnariale et valeur partenariale",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 240,
    consigne: "D\u00e9finis et compares.",
    questions: [
      "D\u00e9finis la valeur actionnariale et la valeur partenariale.",
      "Donne un exemple concret de geste qui illustre une logique \u00ab partenariale \u00bb avec un fournisseur (au-del\u00e0 du simple paiement de facture)."
    ],
    correctionModele: "",
    attendu: "D\u00e9finitions fid\u00e8les au cours, exemple partenarial pr\u00e9cis.",
    notionsCibles: ["cr\u00e9ation de richesse", "distribution"],
  },
  {
    id: "sdgn11-e10",
    title: "Concilier les deux logiques de valeur",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 300,
    consigne: "Synth\u00e8se argument\u00e9e.",
    questions: [
      "Montre en quoi les attentes des diff\u00e9rentes parties prenantes peuvent entrer en tension sur la r\u00e9partition de la valeur cr\u00e9\u00e9e.",
      "Explique comment une gouvernance \u00ab plus partenariale \u00bb (information, participation des salari\u00e9s aux d\u00e9cisions) peut aussi servir la valeur actionnariale \u00e0 moyen terme."
    ],
    correctionModele: "",
    attendu: "Tensions identifiables, lien participation / performance / valeur actionnariale.",
    notionsCibles: ["synth\u00e8se VA", "analyse"],
  },
  {
    id: "sdgn11-cas1",
    title: "\u00c9tude de cas : VertLift et la r\u00e9partition de la VA",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 560,
    minChars: 560,

    supportTables: [
      {
        title: "Synthèse valeur ajoutée et répartition (M€)",
        columns: ["Rubrique", "Montant"],
        rows: [
          ["Chiffre d'affaires HT", "410"],
          ["Consommations intermédiaires", "235"],
          ["Valeur ajoutée", "175"],
          ["Salaires + charges sociales", "88"],
          ["Impôts et taxes", "15"],
          ["Intérêts bancaires", "7"],
          ["Autofinancement (amortissements, réserves)", "35"],
          ["Bénéfice net avant dividendes décidés", "30"],
        ],
      },
    ],
    consigne: "",
    questions: [
      "V\u00e9rifie le calcul de la valeur ajout\u00e9e \u00e0 partir du tableau.",
      "Calcule la part relative des salaires dans la VA (en %, arrondi \u00e0 une d\u00e9cimale).",
      "Identifie trois tensions distinctes entre parties prenantes \u00e0 partir du texte et du tableau.",
      "Propose un plan d'arbitrage en deux ans qui associe progression salariale mod\u00e9r\u00e9e et dividende minimum acceptable.",
      "Dis si cette situation rel\u00e8ve davantage, \u00e0 court terme, d'une logique de valeur actionnariale ou partenariale dans les annonces actuelles ; argumente."
    ],
    correctionModele: "",
    attendu: "Calculs exacts, trois tensions claires, arbitrage cr\u00e9dible, distinction des deux valeurs argument\u00e9e.",
    notionsCibles: ["dossier VA", "calcul"],
  },
  {
    id: "sdgn11-cas2",
    title: "\u00c9tude de cas : Alliance Fromagerie \u00d7 Grande distribution",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 620,
    consigne: "Mobilise valeur partenariale, parties prenantes et lien avec la cr\u00e9ation de valeur.",
    questions: [
      "Explique en quoi cet accord d\u00e9passe une simple relation acheteur-vendeur ponctuelle.",
      "Identifie au moins quatre parties prenantes concern\u00e9es et ce qu'elles y gagnent potentiellement.",
      "Analyse un risque r\u00e9siduel pour la fromagerie si la grande distribution impose brutalement une baisse de prix.",
      "Montre comment une meilleure coordination peut augmenter la valeur ajout\u00e9e globale de la cha\u00eene (sans calcul num\u00e9rique obligatoire).",
      "Propose une mesure de gouvernance interne (chez Les Alpages) qui rapproche valeur partenariale et int\u00e9r\u00eat des actionnaires familiaux."
    ],
    correctionModele: "",
    attendu: "Analyse partenariale riche, quatre parties prenantes minimum, risque et cr\u00e9ation de valeur cha\u00eene, mesure de gouvernance r\u00e9aliste.",
    notionsCibles: ["cas partenarial", "recommandation"],
  },
];
