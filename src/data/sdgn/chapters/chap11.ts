import type { SdgnMissionExercise } from "../types";

export const SDGN_CHAP11_EXERCISES: SdgnMissionExercise[] = [
  {
    id: "sdgn11-e1",
    title: "Les facteurs de production",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 120,
    support:
      "La PME BioPain fabrique du pain bio dans son atelier. Elle emploie 12 boulangers et une responsable administrative. Elle utilise de la farine, du levain, un four professionnel, de l'électricité et des emballages recyclables.",
    consigne: "Réponds en t'appuyant sur le cours et sur le support.",
    questions: [
      "Distingue les facteurs de production « travail » et « capital » dans cet exemple (donne au moins deux exemples pour chaque catégorie).",
      "Explique en une phrase pourquoi le chiffre d'affaires ne revient pas intégralement à l'entreprise.",
    ],
    correctionModele:
      "1) Travail : les 12 boulangers et la responsable administrative mobilisent la force de travail (fabrication, organisation du laboratoire).\n" +
      "Capital : le four professionnel relève du capital technique / équipements productifs ; farine, levain, emballages et électricité sont des biens et énergies incorporés ou consommés pour produire — dans la grille « travail / capital » du cours, ils complètent les moyens matériels mis en œuvre par l'entreprise.\n\n" +
      "2) Le CA correspond aux ventes aux clients, mais l'entreprise doit ensuite payer ou engager des décaissements pour ses achats (farine, énergie…), les salaires et charges sociales, les impôts, etc. : tout le CA ne reste donc pas disponible sous forme de profit.",
    attendu: "Distinction travail / capital correcte, lien CA et paiements des tiers.",
  },
  {
    id: "sdgn11-e2",
    title: "Le chiffre d'affaires",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 130,
    support:
      "Le chiffre d'affaires est la somme des ventes réalisées avec des tiers dans le cadre de l'activité normale de l'entreprise. Il peut être exprimé hors taxes (HT) ou toutes taxes comprises (TTC).",
    consigne: "Définis et illustre brièvement.",
    questions: [
      "Définis le chiffre d'affaires avec tes mots.",
      "Pourquoi le programme impose souvent de raisonner en HT pour calculer la valeur ajoutée et les consommations intermédiaires ?",
    ],
    correctionModele:
      "1) Le chiffre d'affaires mesure le montant total des ventes de biens ou de services réalisées par l'entreprise sur une période donnée : c'est la somme facturée aux clients pour l'activité courante.\n\n" +
      "2) La TVA collectée sur les ventes est reversée à l'État : elle ne constitue pas une richesse pour l'entreprise. Raisonner en HT permet de comparer ce que l'entreprise produit réellement comme valeur marchande avec les achats HT rémunérant les fournisseurs.",
    attendu: "Définition claire, justification HT cohérente.",
  },
  {
    id: "sdgn11-e3",
    title: "Calculer la valeur ajoutée",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 130,
    support: "Données exercice N — CosméBio SAS (milliers d'euros HT).",
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
      "Calcule la valeur ajoutée : VA = CA − consommations intermédiaires.",
      "Explique ce que représente économiquement la valeur ajoutée pour CosméBio.",
    ],
    correctionModele:
      "1) VA = CA − CI = 4 200 − 1 700 = 2 500 K€.\n\n" +
      "2) La valeur ajoutée mesure la richesse créée par l'entreprise : ce que le marché paie (CA) diminué de ce qui a été acheté et consommé « en entrée » pour fabriquer ou distribuer (matières, énergie, services externes). C'est le supplément de valeur produit par CosméBio sur les produits qu'elle vend.",
    attendu: "Formule correcte, résultat exact, interprétation en termes de richesse créée.",
  },
  {
    id: "sdgn11-e4",
    title: "CA = quantités × prix unitaire HT",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 160,
    support: "La biscuiterie Armor Biscuits vend deux gammes au même exercice (prix HT).",
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
    consigne: "Calcule puis synthétise.",
    questions: [
      "Calcule le chiffre d'affaires HT total en appliquant CA = Σ (quantités × prix unitaire HT).",
      "Indique le pourcentage du CA représenté par la gamme premium (arrondi à une décimale).",
    ],
    correctionModele:
      "1) CA palets = 120 000 × 2,80 € = 336 000 €.\n" +
      "CA sablés = 35 000 × 6,50 € = 227 500 €.\n" +
      "CA total HT = 563 500 €.\n\n" +
      "2) Part premium = 227 500 / 563 500 ≈ 40,4 %.\n" +
      "La gamme premium pèse environ deux cinquièmes du CA malgré des volumes inférieurs : elle tire la valeur vers le haut.",
    attendu: "Calculs détaillés, pourcentage correct.",
  },
  {
    id: "sdgn11-e5",
    title: "Consommations intermédiaires",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 170,
    support:
      "Les consommations intermédiaires regroupent les achats de biens et services nécessaires au processus de production et absorbés pendant l'exercice (HT).",
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
    consigne:
      "Pour chaque ligne du tableau, réponds par « Oui (entre dans les CI) » ou « Non » et justifie en une courte phrase.",
    questions: ["Complète la colonne « justification » pour les cinq opérations."],
    correctionModele:
      "Beurre : Oui — matière transformée dans le produit.\n" +
      "Salaires : Non — la rémunération du travail entre dans la répartition de la valeur ajoutée, pas dans les CI.\n" +
      "Loyer : Oui — charge externe de fonctionnement nécessaire à la production.\n" +
      "Dividendes : Non — rémunération des actionnaires sur le résultat, pas un achat consommé pour fabriquer.\n" +
      "Électricité : Oui — énergie consommée pour faire tourner les lignes.",
    attendu: "Distinction CI / charges de répartition ou financier maîtrisée.",
  },
  {
    id: "sdgn11-e6",
    title: "Répartir la valeur ajoutée entre les acteurs",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 190,
    support:
      "Les acteurs bénéficiaires de la valeur ajoutée sont notamment : les salariés, l'État et organismes sociaux, les banques, l'entreprise elle-même (autofinancement, réserves), les actionnaires.",
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
    consigne: "Analyse la répartition.",
    questions: [
      "Vérifie que la somme des montants égale bien la valeur ajoutée totale.",
      "Identifie qui reçoit la part la plus importante et ce que cela traduit sur le plan économique.",
      "Cite deux contreparties concrètes versées aux actionnaires et aux salariés selon le cours.",
    ],
    correctionModele:
      "42 + 8 + 3 + 15 + 12 = 80 M€ : la répartition couvre bien la VA.\n\n" +
      "La part la plus importante va aux salariés (42 M€) : la valeur créée rémunère avant tout le travail dans cette entreprise industrielle.\n\n" +
      "Actionnaires : dividendes et hausse potentielle de la valeur des actions.\n" +
      "Salariés : salaires et cotisations sociales couvrant protection sociale.",
    attendu: "Calcul de cohérence, lecture du tableau, contreparties du cours.",
  },
  {
    id: "sdgn11-e7",
    title: "Décisions de gestion et risque de conflit",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 200,
    support:
      "Le comité d'entreprise d'OptiLog conteste le projet de la direction d'augmenter le dividende de 12 % alors que la prime exceptionnelle aux salariés est gelée. Les actionnaires institutionnels souhaitent un rendement minimum pour rester investis.",
    consigne: "Mobilise la notion de dilemme du cours.",
    questions: [
      "Formule le dilemme entre rémunération des actionnaires et rémunération des salariés.",
      "Propose un arbitrage réaliste (sans chercher « la » bonne réponse unique) qui nomme explicitement les parties prenantes.",
    ],
    correctionModele:
      "1) Dilemme : augmenter les dividendes pour fidéliser les actionnaires et financer l'entreprise par capitaux propres risque de mécontenter les salariés et le CE ; augmenter les salaires ou primes améliore la motivation mais peut refroidir les investisseurs qui compareraient le rendement avec d'autres titres.\n\n" +
      "2) Exemple d'arbitrage : verser une partie modeste de la hausse de résultat en prime exceptionnelle limitée + maintenir une augmentation de dividende modérée (pas 12 %) ; communiquer sur un plan d'investissement équipement sécurisant l'emploi. On cherche un équilibre entre actionnaires, salariés et pérennité de l'entreprise.",
    attendu: "Dilemme bien posé, arbitrage argumenté et multicritère.",
  },
  {
    id: "sdgn11-e8",
    title: "Salariés actionnaires",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 260,
    minChars: 220,
    support:
      "Daher Aero mise sur l'actionnariat salarial : les salariés peuvent souscrire à des actions à prix préférentiel. La direction espère renforcer l'adhésion aux objectifs de productivité.",
    consigne: "Explique le lien avec la répartition de la valeur et les conflits possibles.",
    questions: [
      "En quoi le fait de devenir actionnaire peut-il modifier la position des salariés dans la répartition de la valeur ajoutée ?",
      "Quel risque ou limite peux-tu mentionner si la valeur de l'action baisse fortement ?",
    ],
    correctionModele:
      "1) Le salarié cumule rémunération du travail (salaire) et rémunération du capital investi (dividendes, plus-value sur les actions). Il est à la fois partie prenante dans la négociation salariale et dans la logique de valeur actionnariale.\n\n" +
      "2) Si le cours s'effondre, le salarié peut voir son épargne salariale perdre de la valeur alors même que son emploi soit fragile : concentration du risque sur une même entité (double exposition).",
    attendu: "Double statut salarié/actionnaire, risque de concentration.",
  },
  {
    id: "sdgn11-e9",
    title: "Valeur actionnariale et valeur partenariale",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 240,
    support:
      "Le mode de gouvernance correspond aux règles qui déterminent comment l'entreprise est gérée et contrôlée. Selon ces règles, la valeur créée peut être interprétée prioritairement comme valeur actionnariale ou élargie en valeur partenariale.",
    consigne: "Définis et compares.",
    questions: [
      "Définis la valeur actionnariale et la valeur partenariale.",
      "Donne un exemple concret de geste qui illustre une logique « partenariale » avec un fournisseur (au-delà du simple paiement de facture).",
    ],
    correctionModele:
      "1) Valeur actionnariale : la valeur créée est pensée d'abord au service des actionnaires (dividendes, valorisation boursière, réinvestissement au service du rendement financier).\n" +
      "Valeur partenariale : la valeur résulte de la coopération de l'ensemble des parties prenantes (société, salariés, clients, fournisseurs, actionnaires) avec des relations durables et la confiance.\n\n" +
      "2) Exemple : co-conception d'un composant avec échange de données de production en temps réel, formation croisée des équipes, contrat long terme avec clause de partage des gains de productivité — va au-delà de l'échange marchand ponctuel.",
    attendu: "Définitions fidèles au cours, exemple partenarial précis.",
  },
  {
    id: "sdgn11-e10",
    title: "Concilier les deux logiques de valeur",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 300,
    support:
      "GreenGlass recycle le verre avec ses collectivités locales et ses clients industriels. Les actionnaires exigent une marge minimale ; les salariés demandent des investissements de sécurité coûteux ; les municipalités veulent des prix bas.",
    consigne: "Synthèse argumentée.",
    questions: [
      "Montre en quoi les attentes des différentes parties prenantes peuvent entrer en tension sur la répartition de la valeur créée.",
      "Explique comment une gouvernance « plus partenariale » (information, participation des salariés aux décisions) peut aussi servir la valeur actionnariale à moyen terme.",
    ],
    correctionModele:
      "1) Pression sur les prix publics vs besoin de marge pour les actionnaires vs coût des investissements sécurité pour les salariés : la VA à répartir est contrainte ; accorder une partie à un acteur en limite une autre.\n\n" +
      "2) Impliquer les salariés sur les décisions d'investissement peut réduire les conflits sociaux, améliorer la productivité et la qualité, diminuer l'absentéisme : ce sont des leviers de performance durable qui peuvent augmenter le résultat et la valorisation pour les actionnaires à horizon de quelques années.",
    attendu: "Tensions identifiables, lien participation / performance / valeur actionnariale.",
  },
  {
    id: "sdgn11-cas1",
    title: "Étude de cas : VertLift et la répartition de la VA",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 560,
    minChars: 560,
    support:
      "VertLift conçoit des ascenseurs basse consommation. Exercice N : la direction annonce une forte hausse du résultat grâce aux aides publiques à la rénovation énergétique. Le syndicat réclame une redistribution massive via les salaires ; les fonds pensionnaires minoritaires menacent de vendre leur participation si le dividende ne croît pas.",
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
    consigne:
      "Rédige une copie structurée type dossier : définitions, calculs, analyse des conflits et proposition d'arbitrage réaliste.",
    questions: [
      "Vérifie le calcul de la valeur ajoutée à partir du tableau.",
      "Calcule la part relative des salaires dans la VA (en %, arrondi à une décimale).",
      "Identifie trois tensions distinctes entre parties prenantes à partir du texte et du tableau.",
      "Propose un plan d'arbitrage en deux ans qui associe progression salariale modérée et dividende minimum acceptable.",
      "Dis si cette situation relève davantage, à court terme, d'une logique de valeur actionnariale ou partenariale dans les annonces actuelles ; argumente.",
    ],
    correctionModele:
      "1) VA = 410 − 235 = 175 M€ ✓ (cohérent avec la ligne VA du tableau).\n\n" +
      "2) Part salaires dans VA = 88 / 175 ≈ 50,3 %.\n\n" +
      "3) Tensions : rémunération du travail (revendications syndicales) vs exigence de dividendes des investisseurs ; arbitrage entre garder des marges pour autofinancement / investissements (35 M€) et augmenter salaires ou dividendes ; enjeu avec l'État si les aides publiques sont liées au maintien des emplois ou à des contreparties.\n\n" +
      "4) Exemple : année 1 — prime exceptionnelle limitée + dividende symbolique en hausse modérée ; année 2 — clause salaire indexée sur productivité si objectifs atteints + engagement public sur l'emploi pour rassurer les aides.\n\n" +
      "5) À court terme les annonces font primer la performance financière (résultat, dividendes attendus par fonds) : logique proche de la valeur actionnariale ; pour autant la présence syndicale et les aides publiques appellent une légitimité partenariale sur la répartition.",
    attendu: "Calculs exacts, trois tensions claires, arbitrage crédible, distinction des deux valeurs argumentée.",
  },
  {
    id: "sdgn11-cas2",
    title: "Étude de cas : Alliance Fromagerie × Grande distribution",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 620,
    support:
      "La fromagerie Les Alpages et l'enseigne Carrefour Bio (fictif) signent un accord-cadre trois ans : prévisions de volumes partagées, logiciel commun de traçabilité, réunions mensuelles conjointes pour ajuster les promotions. Les agriculteurs fournisseurs de lait sont informés en amont des volumes prévus.",
    consigne: "Mobilise valeur partenariale, parties prenantes et lien avec la création de valeur.",
    questions: [
      "Explique en quoi cet accord dépasse une simple relation acheteur-vendeur ponctuelle.",
      "Identifie au moins quatre parties prenantes concernées et ce qu'elles y gagnent potentiellement.",
      "Analyse un risque résiduel pour la fromagerie si la grande distribution impose brutalement une baisse de prix.",
      "Montre comment une meilleure coordination peut augmenter la valeur ajoutée globale de la chaîne (sans calcul numérique obligatoire).",
      "Propose une mesure de gouvernance interne (chez Les Alpages) qui rapproche valeur partenariale et intérêt des actionnaires familiaux.",
    ],
    correctionModele:
      "1) Au-delà du prix et de la quantité, il y a partage d'informations (prévisions, traçabilité), coordination temporelle et objectifs communs sur plusieurs exercices : caractéristiques du partenariat.\n\n" +
      "2) Fromagerie : volumes réguliers ; Grande distribution : réassort fiable et image qualité ; Agriculteurs : visibilité sur la collecte ; Consommateurs : disponibilité et traçabilité ; Actionnaires familiaux : réduction du risque commercial.\n\n" +
      "3) Risque : dépendance au distributeur, pression sur les prix sans contrepartie si la balance de pouvoir est déséquilibrée ; effacement de la marge qui réduit la VA distribuable côté producteur.\n\n" +
      "4) Moins de ruptures, moins de stocks invendus, meilleure planification : les CI et pertes peuvent baisser pour la chaîne, ce qui augmente la richesse créée pour un même prix final ou permet des prix plus attractifs tout en préservant les marges.\n\n" +
      "5) Exemple : instance paritaire interne (salariés + famille actionnaire) sur les volumes et prix acceptés dans les accords-cadre ; transparence sur la marge pour éviter les conflits internes lors des négociations commerciales.",
    attendu: "Analyse partenariale riche, quatre parties prenantes minimum, risque et création de valeur chaîne, mesure de gouvernance réaliste.",
  },
];
