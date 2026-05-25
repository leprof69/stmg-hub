import type { SdgnMissionExercise } from "../types";

export const SDGN_CHAP10_EXERCISES: SdgnMissionExercise[] = [
  {
    id: "sdgn10-e1",
    title: "Lire un compte de r\u00e9sultat simplifi\u00e9",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 120,

    supportTables: [
      {
        title: "Produits d'exploitation",
        columns: ["Poste", "Montant (M€)"],
        rows: [
          ["Ventes de marchandises", "7 850"],
          ["Prestations de services", "420"],
          ["Autres produits d'exploitation", "80"],
          ["Total produits d'exploitation", "8 350"],
        ],
      },
      {
        title: "Charges d'exploitation",
        columns: ["Poste", "Montant (M€)"],
        rows: [
          ["Achats de marchandises", "5 600"],
          ["Salaires et charges sociales", "1 350"],
          ["Loyers et charges locatives", "480"],
          ["Amortissements", "210"],
          ["Autres charges d'exploitation", "320"],
          ["Total charges d'exploitation", "7 960"],
        ],
      },
      {
        title: "Synthèse",
        columns: ["Indicateur", "Montant (M€)"],
        rows: [["Résultat d'exploitation (produits − charges)", "390"]],
      },
    ],
    consigne: "\u00c0 partir du document, mobilise compte de r\u00e9sultat et produits d'exploitation pour r\u00e9pondre aux questions (\u00ab Lire un compte de r\u00e9sultat simplifi\u00e9 \u00bb).",
    questions: [
      "Identifie deux charges d'exploitation de Fnac Darty et explique en une phrase ce qu'elles repr\u00e9sentent.",
      "Identifie deux produits d'exploitation et explique leur origine.",
      "Calcule le r\u00e9sultat d'exploitation en appliquant la formule du cours. V\u00e9rifie que tu retrouves le chiffre du support."
    ],
    correctionModele: "",
    attendu: "Identification correcte des postes, application de la formule, r\u00e9sultat juste et comment\u00e9.",
    notionsCibles: ["compte de r\u00e9sultat", "produits d'exploitation"],
  },
  {
    id: "sdgn10-e2",
    title: "Charges et produits : classer",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 140,

    supportTables: [
      {
        title: "Opérations à analyser",
        columns: ["N°", "Opération", "Montant (€)"],
        rows: [
          ["1", "Versement des salaires du mois de mars", "280 000"],
          ["2", "Vente de réfrigérateurs à des clients particuliers", "1 200 000"],
          ["3", "Intérêts versés à la banque sur un emprunt en cours", "45 000"],
          ["4", "Loyer des entrepôts de stockage", "96 000"],
          ["5", "Subvention d'exploitation reçue de la région", "30 000"],
          ["6", "Dotation aux amortissements d'un chariot élévateur", "18 000"],
          ["7", "Dividendes reçus d'une filiale étrangère", "22 000"],
          ["8", "Amende pour infraction au droit de la concurrence", "15 000"],
        ],
      },
    ],
    consigne: "Pour chacune des 8 op\u00e9rations, pr\u00e9cise s'il s'agit d'une charge ou d'un produit, puis indique sa nature : exploitation, financi\u00e8re ou exceptionnelle.",
    questions: [
      "Op\u00e9rations 1 \u00e0 4 : charge ou produit ? Exploitation, financi\u00e8re ou exceptionnelle ?",
      "Op\u00e9rations 5 \u00e0 8 : charge ou produit ? Exploitation, financi\u00e8re ou exceptionnelle ?"
    ],
    correctionModele: "",
    attendu: "Classement correct des 8 op\u00e9rations avec nature pr\u00e9cis\u00e9e et justification courte.",
    notionsCibles: ["charges d'exploitation", "r\u00e9sultat d'exploitation"],
  },
  {
    id: "sdgn10-e3",
    title: "R\u00e9sultat net : b\u00e9n\u00e9fice ou perte ?",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 120,

    supportTables: [
      {
        title: "Synthèse du compte de résultat",
        columns: ["Rubrique", "Montant (Md€)"],
        rows: [
          ["Produits d'exploitation", "44,8"],
          ["Produits financiers", "1,1"],
          ["Produits exceptionnels", "0,5"],
          ["Total des produits", "46,4"],
          ["Charges d'exploitation", "42,5"],
          ["Charges financières", "1,8"],
          ["Charges exceptionnelles", "0,6"],
          ["Total des charges", "44,9"],
          ["Impôt sur les bénéfices", "0,4"],
        ],
      },
    ],
    consigne: "\u00c0 partir du document, mobilise bilan et actif/passif pour r\u00e9pondre aux questions (\u00ab R\u00e9sultat net : b\u00e9n\u00e9fice ou perte ? \u00bb).",
    questions: [
      "Calcule le r\u00e9sultat avant imp\u00f4t (r\u00e9sultat = total produits \u2212 total charges).",
      "Calcule le r\u00e9sultat net (apr\u00e8s imp\u00f4t). S'agit-il d'un b\u00e9n\u00e9fice ou d'une perte ? Justifie.",
      "Explique en deux phrases ce que ce r\u00e9sultat signifie concr\u00e8tement pour Renault et ses actionnaires."
    ],
    correctionModele: "",
    attendu: "Calculs d\u00e9taill\u00e9s, distinction b\u00e9n\u00e9fice/perte, commentaire \u00e9conomique pertinent.",
    notionsCibles: ["bilan", "actif/passif"],
  },
  {
    id: "sdgn10-e4",
    title: "L'actif du bilan",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 180,

    supportTables: [
      {
        title: "Actif immobilisé",
        columns: ["Poste", "Catégorie", "Montant (M€)"],
        rows: [
          ["Fonds de commerce et marques", "Immobilisations incorporelles", "3 200"],
          ["Brevets et logiciels", "Immobilisations incorporelles", "480"],
          ["Terrains et constructions", "Immobilisations corporelles", "8 600"],
          ["Matériels et outillages", "Immobilisations corporelles", "2 100"],
          ["Participations dans des filiales", "Immobilisations financières", "5 400"],
        ],
      },
      {
        title: "Actif circulant",
        columns: ["Poste", "Montant (M€)"],
        rows: [
          ["Stocks de marchandises", "3 800"],
          ["Créances clients", "920"],
          ["Disponibilités (banque + caisse)", "1 450"],
        ],
      },
      {
        title: "Total",
        columns: ["", "Montant (M€)"],
        rows: [["TOTAL ACTIF", "25 950"]],
      },
    ],
    consigne: "R\u00e9ponds aux questions en identifiant pr\u00e9cis\u00e9ment les lignes du bilan.",
    questions: [
      "Identifie les immobilisations corporelles de Carrefour et donne leur montant total.",
      "Quel montant repr\u00e9sentent les disponibilit\u00e9s ? Qu'est-ce que cela signifie pour la tr\u00e9sorerie de l'entreprise ?",
      "Rel\u00e8ve les cr\u00e9ances clients : qui doit cet argent \u00e0 Carrefour, et pourquoi ce poste existe-t-il au bilan ?",
      "Explique pourquoi les brevets et logiciels figurent \u00e0 l'actif du bilan plut\u00f4t qu'en charges."
    ],
    correctionModele: "",
    attendu: "Identification pr\u00e9cise des postes, calculs corrects, explications conceptuelles claires.",
    notionsCibles: ["immobilisations", "amortissements"],
  },
  {
    id: "sdgn10-e5",
    title: "Le passif et les capitaux propres",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 170,

    supportTables: [
      {
        title: "Capitaux propres",
        columns: ["Poste", "Montant (K€)"],
        rows: [
          ["Capital social", "800"],
          ["Réserves", "340"],
          ["Résultat de l'exercice", "95"],
          ["Sous-total capitaux propres", "1 235"],
        ],
      },
      {
        title: "Dettes",
        columns: ["Poste", "Montant (K€)"],
        rows: [
          ["Emprunt bancaire à long terme", "620"],
          ["Dettes fournisseurs", "280"],
          ["Dettes fiscales et sociales", "115"],
          ["Concours bancaires courants", "60"],
          ["Sous-total dettes", "1 075"],
        ],
      },
      {
        title: "Total passif",
        columns: ["", "Montant (K€)"],
        rows: [["TOTAL PASSIF", "2 310"]],
      },
    ],
    consigne: "R\u00e9ponds aux questions en t'appuyant sur les donn\u00e9es chiffr\u00e9es du support.",
    questions: [
      "Identifie les capitaux propres et leur montant total. Explique ce qu'ils repr\u00e9sentent.",
      "Identifie les dettes fournisseurs. Qui sont-ils pour cette PME, et \u00e0 quoi correspond cette dette ?",
      "Calcule la valeur financi\u00e8re (patrimoine) de la PME en appliquant la formule du cours."
    ],
    correctionModele: "",
    attendu: "Calcul exact du patrimoine, compr\u00e9hension des capitaux propres, lien avec la formule du cours.",
    notionsCibles: ["capitaux propres", "endettement"],
  },
  {
    id: "sdgn10-e6",
    title: "Valeur financi\u00e8re fond\u00e9e sur le patrimoine",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 180,

    supportTables: [
      {
        title: "Actif",
        columns: ["Poste", "Montant (€)"],
        rows: [
          ["Four et matériel professionnel", "48 000"],
          ["Véhicule de livraison", "12 000"],
          ["Stock de matières premières (farine, beurre…)", "3 500"],
          ["Créances clients (restaurants livrés)", "4 200"],
          ["Disponibilités", "6 800"],
          ["TOTAL ACTIF", "74 500"],
        ],
      },
      {
        title: "Passif (dettes)",
        columns: ["Poste", "Montant (€)"],
        rows: [
          ["Emprunt bancaire pour le four", "22 000"],
          ["Dettes fournisseurs", "3 800"],
          ["Dettes fiscales", "1 200"],
          ["TOTAL DETTES", "27 000"],
        ],
      },
    ],
    consigne: "Analyse la situation financi\u00e8re de la boulangerie en r\u00e9pondant aux deux questions.",
    questions: [
      "Calcule les capitaux propres (valeur financi\u00e8re patrimoniale) de la boulangerie en appliquant la formule : Total actif \u2212 Total dettes.",
      "Interpr\u00e8te ce r\u00e9sultat du point de vue d'un banquier qui envisage d'accorder un pr\u00eat suppl\u00e9mentaire pour financer une extension du local."
    ],
    correctionModele: "",
    attendu: "Calcul exact, interpr\u00e9tation r\u00e9aliste du point de vue bancaire, lien avec les notions de solvabilit\u00e9.",
    notionsCibles: ["flux de tr\u00e9sorerie", "liquidit\u00e9"],
  },
  {
    id: "sdgn10-e7",
    title: "La Bourse et le cours de l'action",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 200,
    consigne: "\u00c0 partir du document, mobilise cours de bourse et capitalisation pour r\u00e9pondre aux questions (\u00ab La Bourse et le cours de l'action \u00bb).",
    questions: [
      "Explique avec tes propres mots ce qu'est le cours d'une action et comment il se forme.",
      "Calcule la valeur boursi\u00e8re de LVMH au 15 d\u00e9cembre N.",
      "Identifie dans le support au moins deux facteurs qui expliquent la hausse du cours de l'action depuis le d\u00e9but de l'ann\u00e9e."
    ],
    correctionModele: "",
    attendu: "D\u00e9finition claire du cours, calcul correct de la valeur boursi\u00e8re, facteurs bien identifi\u00e9s.",
    notionsCibles: ["cours de bourse", "capitalisation"],
  },
  {
    id: "sdgn10-e8",
    title: "Facteurs influen\u00e7ant la valeur boursi\u00e8re",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 260,
    minChars: 230,
    consigne: "R\u00e9ponds aux questions en mobilisant les notions du cours sur la valeur boursi\u00e8re.",
    questions: [
      "Identifie dans le texte au moins trois facteurs qui ont contribu\u00e9 \u00e0 la baisse du cours de l'action Air France-KLM.",
      "Explique le lien entre le r\u00e9sultat net et la valeur boursi\u00e8re d'une soci\u00e9t\u00e9 cot\u00e9e.",
      "Identifie deux cat\u00e9gories d'acteurs qui surveillent attentivement la valeur boursi\u00e8re d'Air France-KLM et explique pourquoi elle les int\u00e9resse."
    ],
    correctionModele: "",
    attendu: "Analyse compl\u00e8te des facteurs, lien r\u00e9sultat/cours bien expliqu\u00e9, acteurs et enjeux identifi\u00e9s.",
    notionsCibles: ["PER", "valorisation"],
  },
  {
    id: "sdgn10-e9",
    title: "Comparer valeur financi\u00e8re et valeur boursi\u00e8re",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 250,

    supportTables: [
      {
        title: "Extrait de bilan (Md$)",
        columns: ["Poste", "Montant"],
        rows: [
          ["Total actif", "92"],
          ["Total dettes", "62"],
          ["Capitaux propres", "30"],
        ],
      },
      {
        title: "Données boursières",
        columns: ["Indicateur", "Valeur"],
        rows: [
          ["Nombre d'actions en circulation", "3,2 milliards"],
          ["Cours de l'action", "210 $"],
        ],
      },
    ],
    consigne: "Compare les deux formes de valeur en mobilisant les notions du cours.",
    questions: [
      "Calcule la valeur financi\u00e8re (patrimoine) de Tesla \u00e0 partir des donn\u00e9es du bilan.",
      "Calcule la valeur boursi\u00e8re de Tesla.",
      "Compare les deux valeurs. Que constates-tu ? Explique pourquoi elles peuvent diff\u00e9rer autant."
    ],
    correctionModele: "",
    attendu: "Deux calculs corrects, analyse lucide de l'\u00e9cart, notions de patrimoine vs anticipations bien articul\u00e9es.",
    notionsCibles: ["dividendes", "actionnaires"],
  },
  {
    id: "sdgn10-e10",
    title: "R\u00e9partition de la valeur ajout\u00e9e",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 300,

    supportTables: [
      {
        title: "Calcul de la valeur ajoutée",
        columns: ["Poste", "Montant (M€)"],
        rows: [
          ["Chiffre d'affaires", "8 600"],
          ["Achats de matières premières consommées", "3 900"],
          ["Services externes", "800"],
          ["Valeur ajoutée (CA − achats − services)", "3 900"],
        ],
      },
      {
        title: "Répartition de la valeur ajoutée",
        columns: ["Acteur / poste", "Montant (M€)", "% de la VA"],
        rows: [
          ["Salaires et charges sociales (salariés)", "1 850", "47,4 %"],
          ["Impôts et taxes (État)", "320", "8,2 %"],
          ["Intérêts des emprunts (établissements de crédit)", "210", "5,4 %"],
          ["Amortissements (outil de production)", "480", "12,3 %"],
          ["Résultat net (dont dividendes actionnaires 300 M€)", "1 040", "26,7 %"],
          ["Total réparti", "3 900", "100 %"],
        ],
      },
    ],
    consigne: "Analyse la r\u00e9partition de la valeur ajout\u00e9e en mobilisant les notions du cours.",
    questions: [
      "Rappelle la d\u00e9finition de la valeur ajout\u00e9e et v\u00e9rifie le calcul \u00e0 partir du support.",
      "Identifie les acteurs qui se partagent la valeur ajout\u00e9e et indique la part re\u00e7ue par chacun (en M\u20ac et en %).",
      "Explique pourquoi la r\u00e9partition de la valeur ajout\u00e9e peut \u00eatre source de tensions entre les parties prenantes.",
      "Quel lien peut-on \u00e9tablir entre valeur ajout\u00e9e, r\u00e9sultat net et valeur financi\u00e8re ou boursi\u00e8re de l'entreprise ?"
    ],
    correctionModele: "",
    attendu: "Calcul de VA, tableau de r\u00e9partition complet, analyse des tensions, synth\u00e8se sur les liens entre les formes de valeur.",
    notionsCibles: ["synth\u00e8se financi\u00e8re", "analyse"],
  },
  {
    id: "sdgn10-cas1",
    title: "\u00c9tude de cas : Orange SA",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 560,
    minChars: 560,

    supportTables: [
      {
        title: "Compte de résultat simplifié (Md€)",
        columns: ["Rubrique", "Montant"],
        rows: [
          ["Produits d'exploitation", "43,0"],
          ["Charges d'exploitation", "38,0"],
          ["Charges financières (intérêts emprunts)", "1,2"],
          ["Produits financiers", "0,3"],
          ["Résultat exceptionnel", "−0,2"],
          ["Impôt sur les bénéfices", "1,1"],
        ],
      },
      {
        title: "Bilan au 31/12/N (Md€)",
        columns: ["Rubrique", "Montant"],
        rows: [
          ["Total actif", "53,0"],
          ["Total dettes", "29,0"],
          ["Capitaux propres", "24,0"],
        ],
      },
      {
        title: "Données boursières au 31/12/N",
        columns: ["Indicateur", "Valeur"],
        rows: [
          ["Nombre d'actions en circulation", "2,66 milliards"],
          ["Cours de l'action", "10,00 €"],
        ],
      },
    ],
    consigne: "",
    questions: [
      "Calcule le r\u00e9sultat d'exploitation, puis le r\u00e9sultat avant imp\u00f4t, puis le r\u00e9sultat net. Montre tes calculs.",
      "Identifie dans le compte de r\u00e9sultat un exemple de charge d'exploitation, une charge financi\u00e8re et un r\u00e9sultat exceptionnel. Pr\u00e9cise la nature (exploitation / financi\u00e8re / exceptionnelle) de chaque \u00e9l\u00e9ment.",
      "Calcule la valeur financi\u00e8re patrimoniale d'Orange \u00e0 partir du bilan.",
      "Calcule la valeur boursi\u00e8re d'Orange au 31/12/N.",
      "Compare les deux valeurs. Laquelle est la plus \u00e9lev\u00e9e ? Propose une explication \u00e9conomique.",
      "Qui est int\u00e9ress\u00e9 par ces informations financi\u00e8res ? Cite au moins trois cat\u00e9gories d'acteurs et explique pourquoi chacun surveille ces donn\u00e9es."
    ],
    correctionModele: "",
    attendu: "",
    notionsCibles: ["dossier financier", "interpr\u00e9tation"],
  },
  {
    id: "sdgn10-cas2",
    title: "\u00c9tude de cas : Doctolib, une start-up non cot\u00e9e",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 620,

    supportTables: [
      {
        title: "Bilan simplifié (exercice N)",
        columns: ["Poste", "Montant (M€)"],
        rows: [
          ["Total actif", "420"],
          ["Total dettes", "240"],
          ["Capitaux propres", "180"],
        ],
      },
      {
        title: "Compte de résultat (extrait)",
        columns: ["Poste", "Montant (M€)"],
        rows: [["Résultat net de l'exercice", "−35"]],
      },
      {
        title: "Valorisation levée de fonds (série E)",
        columns: ["Donnée", "Valeur"],
        rows: [
          ["Valorisation retenue par les investisseurs", "5 800 M€"],
          ["Investisseurs cités (illustratif)", "General Atlantic, Eurazeo…"],
        ],
      },
    ],
    consigne: "",
    questions: [
      "Calcule la valeur financi\u00e8re patrimoniale de Doctolib. Que repr\u00e9sente-t-elle concr\u00e8tement ?",
      "Doctolib n'est pas cot\u00e9e en Bourse. Comment les investisseurs ont-ils quand m\u00eame d\u00e9termin\u00e9 une valeur pour l'entreprise ? Explique la diff\u00e9rence entre valeur comptable et valeur de march\u00e9.",
      "Pourquoi des investisseurs acceptent-ils de valoriser Doctolib \u00e0 5 800 M\u20ac alors que ses capitaux propres ne s'\u00e9l\u00e8vent qu'\u00e0 180 M\u20ac ? Identifie au moins trois raisons.",
      "Doctolib affiche une perte de 35 M\u20ac cette ann\u00e9e. Est-ce n\u00e9cessairement un mauvais signe ? Explique.",
      "Quels sont les enjeux de la valeur de Doctolib pour ses diff\u00e9rentes parties prenantes (fondateurs, investisseurs, salari\u00e9s, patients, \u00c9tat) ?"
    ],
    correctionModele: "",
    attendu: "",
    notionsCibles: ["cas boursier", "recommandation"],
  },
];
