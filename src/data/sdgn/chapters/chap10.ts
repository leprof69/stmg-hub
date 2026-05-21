import type { SdgnMissionExercise } from "../types";

export const SDGN_CHAP10_EXERCISES: SdgnMissionExercise[] = [
  {
    id: "sdgn10-e1",
    title: "Lire un compte de résultat simplifié",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 120,
    support:
      "Extrait du compte de résultat simplifié de Fnac Darty (exercice N, montants en millions d'euros). Lis les tableaux ci-dessous.",
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
    consigne: "Réponds aux trois questions en t'appuyant sur le support.",
    questions: [
      "Identifie deux charges d'exploitation de Fnac Darty et explique en une phrase ce qu'elles représentent.",
      "Identifie deux produits d'exploitation et explique leur origine.",
      "Calcule le résultat d'exploitation en appliquant la formule du cours. Vérifie que tu retrouves le chiffre du support.",
    ],
    correctionModele:
      "1) Deux charges d'exploitation :\n" +
      "— Salaires et charges sociales (1 350 M€) : ce sont les rémunérations versées aux salariés ainsi que les cotisations patronales. Elles représentent le coût du travail.\n" +
      "— Achats de marchandises (5 600 M€) : ce sont les coûts d'achat des produits revendus en magasin et sur le site. Il s'agit du principal poste de charges pour un distributeur.\n\n" +
      "2) Deux produits d'exploitation :\n" +
      "— Ventes de marchandises (7 850 M€) : il s'agit du chiffre d'affaires réalisé par la vente de produits (high-tech, électroménager, livres…). C'est la ressource principale de l'entreprise.\n" +
      "— Prestations de services (420 M€) : revenus issus des services proposés (contrats d'entretien, garanties étendues, abonnements Fnac+…).\n\n" +
      "3) Calcul du résultat d'exploitation :\n" +
      "Résultat d'exploitation = Total produits d'exploitation − Total charges d'exploitation\n" +
      "= 8 350 M€ − 7 960 M€ = 390 M€ ✓\n" +
      "Le résultat est positif : Fnac Darty dégage un bénéfice d'exploitation de 390 millions d'euros.",
    attendu: "Identification correcte des postes, application de la formule, résultat juste et commenté.",
  },
  {
    id: "sdgn10-e2",
    title: "Charges et produits : classer",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 140,
    support:
      "Liste des opérations réalisées par Boulanger SA durant l'exercice. À classer pour chaque ligne.",
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
    consigne: "Pour chacune des 8 opérations, précise s'il s'agit d'une charge ou d'un produit, puis indique sa nature : exploitation, financière ou exceptionnelle.",
    questions: [
      "Opérations 1 à 4 : charge ou produit ? Exploitation, financière ou exceptionnelle ?",
      "Opérations 5 à 8 : charge ou produit ? Exploitation, financière ou exceptionnelle ?",
    ],
    correctionModele:
      "Opérations 1 à 4 :\n" +
      "1. Salaires → Charge d'exploitation (coût lié à l'activité courante de l'entreprise).\n" +
      "2. Ventes de réfrigérateurs → Produit d'exploitation (recette principale de l'activité commerciale).\n" +
      "3. Intérêts bancaires → Charge financière (coût lié au financement par emprunt).\n" +
      "4. Loyer des entrepôts → Charge d'exploitation (dépense nécessaire à l'activité courante).\n\n" +
      "Opérations 5 à 8 :\n" +
      "5. Subvention d'exploitation → Produit d'exploitation (aide reçue dans le cadre de l'activité normale).\n" +
      "6. Dotation aux amortissements → Charge d'exploitation (constatation comptable de la perte de valeur d'un bien).\n" +
      "7. Dividendes reçus → Produit financier (revenu issu d'une participation dans une autre société).\n" +
      "8. Amende concurrence → Charge exceptionnelle (opération inhabituelle, hors exploitation courante).",
    attendu: "Classement correct des 8 opérations avec nature précisée et justification courte.",
  },
  {
    id: "sdgn10-e3",
    title: "Résultat net : bénéfice ou perte ?",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 120,
    support:
      "Données simplifiées du compte de résultat de Renault SA (exercice N, milliards d'euros).",
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
    consigne: "Réponds aux trois questions en montrant tes calculs.",
    questions: [
      "Calcule le résultat avant impôt (résultat = total produits − total charges).",
      "Calcule le résultat net (après impôt). S'agit-il d'un bénéfice ou d'une perte ? Justifie.",
      "Explique en deux phrases ce que ce résultat signifie concrètement pour Renault et ses actionnaires.",
    ],
    correctionModele:
      "1) Résultat avant impôt :\n" +
      "Résultat avant impôt = Total produits − Total charges\n" +
      "= 46,4 − 44,9 = 1,5 Md€\n\n" +
      "2) Résultat net :\n" +
      "Résultat net = Résultat avant impôt − Impôt sur les bénéfices\n" +
      "= 1,5 − 0,4 = 1,1 Md€\n" +
      "Le résultat est positif : il s'agit d'un bénéfice. Renault a créé de la richesse sur cet exercice.\n\n" +
      "3) Signification pour Renault et ses actionnaires :\n" +
      "Un bénéfice de 1,1 Md€ signifie que Renault a vendu plus qu'il n'a dépensé : l'entreprise est rentable. " +
      "Pour les actionnaires, cela peut se traduire par le versement de dividendes ou par le renforcement des capitaux propres, qui sécurisent l'avenir financier du groupe.",
    attendu: "Calculs détaillés, distinction bénéfice/perte, commentaire économique pertinent.",
  },
  {
    id: "sdgn10-e4",
    title: "L'actif du bilan",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 180,
    support:
      "Extrait de l'actif du bilan de Carrefour SA au 31 décembre N (montants en millions d'euros).",
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
    consigne: "Réponds aux questions en identifiant précisément les lignes du bilan.",
    questions: [
      "Identifie les immobilisations corporelles de Carrefour et donne leur montant total.",
      "Quel montant représentent les disponibilités ? Qu'est-ce que cela signifie pour la trésorerie de l'entreprise ?",
      "Relève les créances clients : qui doit cet argent à Carrefour, et pourquoi ce poste existe-t-il au bilan ?",
      "Explique pourquoi les brevets et logiciels figurent à l'actif du bilan plutôt qu'en charges.",
    ],
    correctionModele:
      "1) Immobilisations corporelles :\n" +
      "Terrains et constructions (8 600 M€) + Matériels et outillages (2 100 M€) = 10 700 M€.\n" +
      "Ce sont des biens physiques durables utilisés pour exploiter les magasins.\n\n" +
      "2) Disponibilités :\n" +
      "1 450 M€ → c'est la trésorerie immédiatement disponible (soldes bancaires + caisse). " +
      "Cela signifie que Carrefour dispose de liquidités importantes pour faire face à ses dépenses courantes et rembourser ses dettes à court terme.\n\n" +
      "3) Créances clients :\n" +
      "920 M€ → ce sont des sommes que des clients (entreprises, franchisés, fournisseurs en compte courant) doivent encore à Carrefour pour des marchandises ou services déjà livrés. " +
      "Ce poste existe car les transactions ne sont pas toujours réglées immédiatement : un délai de paiement est accordé.\n\n" +
      "4) Pourquoi les brevets figurent à l'actif :\n" +
      "Un brevet ou un logiciel est un actif incorporel : il a une valeur économique durable pour l'entreprise (protection d'une innovation, utilisation sur plusieurs exercices). " +
      "Il est inscrit à l'actif car il continuera à générer des avantages économiques futurs, contrairement à une dépense ponctuelle passée en charges.",
    attendu: "Identification précise des postes, calculs corrects, explications conceptuelles claires.",
  },
  {
    id: "sdgn10-e5",
    title: "Le passif et les capitaux propres",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 170,
    support:
      "Extrait du passif du bilan d'Atelier du Lin SAS (PME textile) au 31 décembre N (milliers d'euros).",
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
    consigne: "Réponds aux questions en t'appuyant sur les données chiffrées du support.",
    questions: [
      "Identifie les capitaux propres et leur montant total. Explique ce qu'ils représentent.",
      "Identifie les dettes fournisseurs. Qui sont-ils pour cette PME, et à quoi correspond cette dette ?",
      "Calcule la valeur financière (patrimoine) de la PME en appliquant la formule du cours.",
    ],
    correctionModele:
      "1) Capitaux propres :\n" +
      "Capitaux propres = Capital social (800 K€) + Réserves (340 K€) + Résultat (95 K€) = 1 235 K€.\n" +
      "Ils représentent les ressources apportées ou accumulées par les associés : le capital investi au départ, les bénéfices non distribués (réserves) et le résultat de l'exercice en cours. " +
      "C'est la « richesse propre » de l'entreprise, sans dette.\n\n" +
      "2) Dettes fournisseurs :\n" +
      "280 K€ → ce sont les sommes encore dues aux fournisseurs de matières premières (lin, tissu…) qui ont livré mais n'ont pas encore été payés. " +
      "Ce délai de paiement (souvent 30 à 60 jours) est une pratique commerciale normale.\n\n" +
      "3) Valeur financière (patrimoine) :\n" +
      "Valeur financière = Total actif − Total dettes\n" +
      "= 2 310 K€ − 1 075 K€ = 1 235 K€\n" +
      "On retrouve bien le montant des capitaux propres : patrimoine = capitaux propres. " +
      "La PME possède plus qu'elle ne doit, ce qui est un signe de solidité financière.",
    attendu: "Calcul exact du patrimoine, compréhension des capitaux propres, lien avec la formule du cours.",
  },
  {
    id: "sdgn10-e6",
    title: "Valeur financière fondée sur le patrimoine",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 180,
    support:
      "Bilan simplifié de la Boulangerie Artisanale Dupont au 31/12/N (entreprise individuelle, montants en euros).",
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
    consigne: "Analyse la situation financière de la boulangerie en répondant aux deux questions.",
    questions: [
      "Calcule les capitaux propres (valeur financière patrimoniale) de la boulangerie en appliquant la formule : Total actif − Total dettes.",
      "Interprète ce résultat du point de vue d'un banquier qui envisage d'accorder un prêt supplémentaire pour financer une extension du local.",
    ],
    correctionModele:
      "1) Calcul des capitaux propres :\n" +
      "Capitaux propres = Total actif − Total dettes\n" +
      "= 74 500 € − 27 000 € = 47 500 €\n" +
      "La valeur financière (patrimoine net) de la boulangerie est de 47 500 €.\n\n" +
      "2) Interprétation du point de vue du banquier :\n" +
      "Le banquier analyse le bilan pour évaluer la solvabilité de l'emprunteur. " +
      "Avec 47 500 € de capitaux propres pour 27 000 € de dettes, la boulangerie a plus de ressources propres que de dettes : c'est un signe de bonne santé financière. " +
      "Le ratio dettes/capitaux propres est inférieur à 1, ce qui rassure le prêteur. " +
      "Toutefois, le banquier étudiera aussi la capacité de remboursement (bénéfice annuel) et la valeur des garanties (le four, le local) avant d'accorder un nouveau crédit.",
    attendu: "Calcul exact, interprétation réaliste du point de vue bancaire, lien avec les notions de solvabilité.",
  },
  {
    id: "sdgn10-e7",
    title: "La Bourse et le cours de l'action",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 200,
    support:
      "Article de presse (extrait, source fictive, données illustratives) — Décembre N :\n" +
      "« LVMH (Moët Hennessy Louis Vuitton) est le premier groupe mondial du luxe, coté sur Euronext Paris. " +
      "Au 15 décembre N, le cours de l'action LVMH s'établit à 740 €. Le groupe dispose de 502 millions d'actions en circulation. " +
      "En début d'année, le cours était de 680 €. " +
      "Après la publication de résultats semestriels solides (chiffre d'affaires +8 %, résultat net +6 %), " +
      "plusieurs analystes ont relevé leur objectif de cours, contribuant à la hausse observée. " +
      "Les investisseurs institutionnels (fonds de pension, assureurs) détiennent environ 60 % du capital. »",
    consigne: "Réponds aux trois questions en t'appuyant sur le support et sur ton cours.",
    questions: [
      "Explique avec tes propres mots ce qu'est le cours d'une action et comment il se forme.",
      "Calcule la valeur boursière de LVMH au 15 décembre N.",
      "Identifie dans le support au moins deux facteurs qui expliquent la hausse du cours de l'action depuis le début de l'année.",
    ],
    correctionModele:
      "1) Le cours d'une action :\n" +
      "Le cours d'une action est le prix auquel une action s'échange en Bourse à un instant donné. " +
      "Il résulte de la confrontation entre l'offre (vendeurs d'actions) et la demande (acheteurs d'actions). " +
      "Si beaucoup d'investisseurs veulent acheter une action, le cours monte ; si beaucoup veulent vendre, il baisse. " +
      "Le cours fluctue en permanence en fonction des informations disponibles sur l'entreprise et son environnement.\n\n" +
      "2) Valeur boursière de LVMH :\n" +
      "Valeur boursière = Nombre d'actions × Cours de l'action\n" +
      "= 502 000 000 × 740 € = 371 480 000 000 € ≈ 371,5 milliards d'euros\n\n" +
      "3) Facteurs expliquant la hausse :\n" +
      "— Publication de résultats solides (CA +8 %, résultat net +6 %) : les investisseurs anticipent une performance durable et achètent davantage d'actions.\n" +
      "— Relèvement des objectifs de cours par les analystes financiers : cela incite d'autres investisseurs à acheter, créant une pression haussière sur le cours.",
    attendu: "Définition claire du cours, calcul correct de la valeur boursière, facteurs bien identifiés.",
  },
  {
    id: "sdgn10-e8",
    title: "Facteurs influençant la valeur boursière",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 260,
    minChars: 230,
    support:
      "Dépêche financière (extrait, données fictives illustratives) — Résultats semestriels Air France-KLM :\n" +
      "« Air France-KLM a publié ses résultats du premier semestre N. Le chiffre d'affaires progresse de +7 % à 14,2 Md€, porté par la reprise du trafic long-courrier. " +
      "Cependant, le résultat net s'établit à seulement 180 M€, en retrait de 35 % par rapport au S1 N-1, en raison de la hausse du prix du kérosène (+22 %) et des coûts de maintenance d'une flotte vieillissante. " +
      "Les analystes attendaient un résultat de 310 M€. Suite à cette publication, le cours de l'action Air France-KLM a chuté de 8,4 % en une séance, passant de 12,80 € à 11,72 €. " +
      "Le PDG a évoqué un plan de réduction des coûts, mais les investisseurs restent prudents face aux incertitudes sur le prix du carburant. »",
    consigne: "Réponds aux questions en mobilisant les notions du cours sur la valeur boursière.",
    questions: [
      "Identifie dans le texte au moins trois facteurs qui ont contribué à la baisse du cours de l'action Air France-KLM.",
      "Explique le lien entre le résultat net et la valeur boursière d'une société cotée.",
      "Identifie deux catégories d'acteurs qui surveillent attentivement la valeur boursière d'Air France-KLM et explique pourquoi elle les intéresse.",
    ],
    correctionModele:
      "1) Facteurs expliquant la baisse du cours :\n" +
      "— Résultat net décevant (180 M€ au lieu des 310 M€ attendus) : les investisseurs révisent à la baisse leurs anticipations de rentabilité.\n" +
      "— Hausse du prix du kérosène (+22 %) : coût non maîtrisable qui pèse sur les marges futures.\n" +
      "— Coûts de maintenance élevés liés à une flotte vieillissante : signal d'un besoin d'investissement important à venir.\n" +
      "— Incertitudes sur les perspectives (prix du carburant) : l'incertitude pousse les investisseurs à vendre.\n\n" +
      "2) Lien résultat net / valeur boursière :\n" +
      "Le résultat net mesure ce que l'entreprise a gagné après toutes les charges et impôts. " +
      "Un résultat élevé signifie que l'entreprise est rentable et peut distribuer des dividendes ou investir. " +
      "Les investisseurs achètent des actions en espérant en tirer un revenu (dividende) ou une plus-value. " +
      "Si le résultat déçoit, la demande d'actions baisse → le cours diminue → la valeur boursière recule.\n\n" +
      "3) Acteurs qui surveillent la valeur boursière :\n" +
      "— Les actionnaires (institutionnels et particuliers) : la valeur de leurs titres dépend directement du cours ; une baisse réduit leur patrimoine.\n" +
      "— Les dirigeants d'Air France-KLM : une valorisation boursière basse fragilise l'entreprise (risque d'OPA, difficulté à lever des fonds, signal négatif pour les partenaires).",
    attendu: "Analyse complète des facteurs, lien résultat/cours bien expliqué, acteurs et enjeux identifiés.",
  },
  {
    id: "sdgn10-e9",
    title: "Comparer valeur financière et valeur boursière",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 250,
    support:
      "Données Tesla Inc. (exercice N, chiffres illustratifs simplifiés). Tesla est cotée au NASDAQ. Les ventes de véhicules électriques ont progressé de +40 % sur 3 ans ; les investisseurs anticipent une forte croissance du marché de l'électrique et une diversification (énergie solaire, batteries). La concurrence s'intensifie (BYD, Volkswagen, Renault).",
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
      "Calcule la valeur financière (patrimoine) de Tesla à partir des données du bilan.",
      "Calcule la valeur boursière de Tesla.",
      "Compare les deux valeurs. Que constates-tu ? Explique pourquoi elles peuvent différer autant.",
    ],
    correctionModele:
      "1) Valeur financière (patrimoine) :\n" +
      "Valeur financière = Total actif − Total dettes\n" +
      "= 92 Md$ − 62 Md$ = 30 Md$\n" +
      "(On retrouve bien les capitaux propres.)\n\n" +
      "2) Valeur boursière :\n" +
      "Valeur boursière = Nombre d'actions × Cours de l'action\n" +
      "= 3 200 000 000 × 210 $ = 672 000 000 000 $ = 672 Md$\n\n" +
      "3) Comparaison et explication :\n" +
      "La valeur boursière (672 Md$) est 22 fois supérieure à la valeur financière patrimoniale (30 Md$). Cet écart est considérable.\n" +
      "Explications :\n" +
      "— La Bourse ne valorise pas seulement ce que l'entreprise possède aujourd'hui, mais ce qu'elle est susceptible de gagner demain. Les investisseurs anticipent une croissance forte du marché électrique.\n" +
      "— La notoriété de la marque Tesla, le leadership technologique et les perspectives de diversification (solaire, batteries) sont des actifs immatériels non comptabilisés au bilan.\n" +
      "— La valeur boursière reflète la confiance des investisseurs et leurs anticipations de bénéfices futurs, alors que la valeur financière ne mesure que le patrimoine actuel.\n" +
      "— Risque : si les résultats déçoivent ou si la concurrence s'intensifie, la valeur boursière peut chuter brutalement.",
    attendu: "Deux calculs corrects, analyse lucide de l'écart, notions de patrimoine vs anticipations bien articulées.",
  },
  {
    id: "sdgn10-e10",
    title: "Répartition de la valeur ajoutée",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 300,
    support:
      "Rapport annuel simplifié — Bonval SA (groupe agro-alimentaire fictif, inspiré du secteur Danone). Les montants sont en millions d'euros.",
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
    consigne: "Analyse la répartition de la valeur ajoutée en mobilisant les notions du cours.",
    questions: [
      "Rappelle la définition de la valeur ajoutée et vérifie le calcul à partir du support.",
      "Identifie les acteurs qui se partagent la valeur ajoutée et indique la part reçue par chacun (en M€ et en %).",
      "Explique pourquoi la répartition de la valeur ajoutée peut être source de tensions entre les parties prenantes.",
      "Quel lien peut-on établir entre valeur ajoutée, résultat net et valeur financière ou boursière de l'entreprise ?",
    ],
    correctionModele:
      "1) Définition et vérification :\n" +
      "La valeur ajoutée (VA) mesure la richesse créée par l'entreprise. Elle se calcule ainsi :\n" +
      "VA = Chiffre d'affaires − Consommations intermédiaires (achats + services externes)\n" +
      "= 8 600 − (3 900 + 800) = 8 600 − 4 700 = 3 900 M€ ✓\n\n" +
      "2) Répartition de la VA :\n" +
      "Total VA = 3 900 M€\n" +
      "— Salariés (salaires + charges) : 1 850 M€ → 47,4 %\n" +
      "— État (impôts et taxes) : 320 M€ → 8,2 %\n" +
      "— Établissements de crédit (intérêts) : 210 M€ → 5,4 %\n" +
      "— Entreprise elle-même (amortissements) : 480 M€ → 12,3 %\n" +
      "— Actionnaires + réserves (résultat net) : 1 040 M€ → 26,7 %\n\n" +
      "3) Sources de tensions :\n" +
      "La VA est limitée : ce qu'un acteur reçoit de plus, c'est potentiellement moins pour les autres. " +
      "Les salariés peuvent demander des augmentations (syndicats, négociations collectives) au détriment du résultat distribué aux actionnaires. " +
      "Les actionnaires peuvent exiger de meilleurs rendements, ce qui pousse les dirigeants à comprimer les salaires ou délocaliser. " +
      "L'État peut augmenter les impôts, réduisant la part disponible pour les autres acteurs. " +
      "Ces arbitrages définissent la « valeur sociale » de l'entreprise.\n\n" +
      "4) Lien VA / résultat / valeur financière ou boursière :\n" +
      "Le résultat net (1 040 M€) est la part de VA qui reste après rémunération de tous les autres acteurs. " +
      "S'il est mis en réserve, il accroît les capitaux propres → la valeur financière patrimoniale augmente. " +
      "Sur les marchés financiers, un résultat net élevé et régulier attire les investisseurs → le cours de l'action monte → la valeur boursière progresse. " +
      "La VA est donc à l'origine de toutes les formes de valeur de l'entreprise.",
    attendu: "Calcul de VA, tableau de répartition complet, analyse des tensions, synthèse sur les liens entre les formes de valeur.",
  },
  {
    id: "sdgn10-cas1",
    title: "Étude de cas : Orange SA",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 560,
    minChars: 560,
    support:
      "Orange SA — opérateur historique de télécommunications en France, coté sur Euronext Paris. Environ 137 000 salariés dans le monde, activité dans 26 pays (mobile, Internet, TV, B2B). Données ci-dessous pour l'exercice N.",
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
    consigne:
      "Rédige une réponse structurée et complète en répondant à chaque question dans l'ordre. Mobilise les notions du chapitre 10.",
    questions: [
      "Calcule le résultat d'exploitation, puis le résultat avant impôt, puis le résultat net. Montre tes calculs.",
      "Identifie dans le compte de résultat un exemple de charge d'exploitation, une charge financière et un résultat exceptionnel. Précise la nature (exploitation / financière / exceptionnelle) de chaque élément.",
      "Calcule la valeur financière patrimoniale d'Orange à partir du bilan.",
      "Calcule la valeur boursière d'Orange au 31/12/N.",
      "Compare les deux valeurs. Laquelle est la plus élevée ? Propose une explication économique.",
      "Qui est intéressé par ces informations financières ? Cite au moins trois catégories d'acteurs et explique pourquoi chacun surveille ces données.",
    ],
    correctionModele:
      "1) Calculs des résultats :\n" +
      "Résultat d'exploitation = Produits d'exploitation − Charges d'exploitation\n" +
      "= 43,0 − 38,0 = 5,0 Md€\n\n" +
      "Résultat avant impôt = Résultat d'exploitation + Résultat financier + Résultat exceptionnel\n" +
      "Résultat financier = Produits financiers − Charges financières = 0,3 − 1,2 = −0,9 Md€\n" +
      "Résultat avant impôt = 5,0 + (−0,9) + (−0,2) = 3,9 Md€\n\n" +
      "Résultat net = Résultat avant impôt − Impôt sur les bénéfices\n" +
      "= 3,9 − 1,1 = 2,8 Md€ (bénéfice)\n\n" +
      "2) Nature des éléments :\n" +
      "— Charges d'exploitation (38,0 Md€) : nature exploitation — dépenses liées à l'activité courante (réseaux, salaires, marketing…).\n" +
      "— Charges financières (1,2 Md€) : nature financière — intérêts versés aux banques pour le remboursement des emprunts contractés pour financer l'infrastructure.\n" +
      "— Résultat exceptionnel (−0,2 Md€) : nature exceptionnelle — opération inhabituelle (par exemple, coût d'une restructuration ou d'un litige).\n\n" +
      "3) Valeur financière patrimoniale :\n" +
      "Valeur financière = Total actif − Total dettes\n" +
      "= 53,0 − 29,0 = 24,0 Md€\n" +
      "(Correspond aux capitaux propres indiqués au bilan.)\n\n" +
      "4) Valeur boursière :\n" +
      "Valeur boursière = Nombre d'actions × Cours de l'action\n" +
      "= 2 660 000 000 × 10,00 € = 26 600 000 000 € = 26,6 Md€\n\n" +
      "5) Comparaison :\n" +
      "Valeur boursière (26,6 Md€) > Valeur financière patrimoniale (24,0 Md€)\n" +
      "La valeur boursière est légèrement supérieure. La Bourse valorise Orange au-delà de ses seuls capitaux propres car les investisseurs anticipent des flux de trésorerie futurs (abonnements récurrents, réseau 5G en déploiement). " +
      "Cet écart reste modéré : dans le secteur des télécoms, les actifs sont très capitalistiques et l'endettement important, ce qui limite la prime boursière par rapport à d'autres secteurs (tech, luxe).\n\n" +
      "6) Acteurs intéressés par ces informations :\n" +
      "— Actionnaires : ils surveillent le résultat net (dividendes potentiels) et la valeur boursière (évolution de leur patrimoine).\n" +
      "— Banques et créanciers : ils analysent les capitaux propres et les dettes pour évaluer la solvabilité d'Orange avant d'accorder un nouveau crédit.\n" +
      "— Salariés et syndicats : un résultat net élevé peut justifier des demandes de revalorisation salariale ou de partage de la valeur ajoutée.\n" +
      "— Investisseurs institutionnels (fonds de pension, assureurs) : ils arbitrent entre acheter et vendre des actions en fonction de la valeur boursière et des perspectives.\n" +
      "— État : en tant qu'actionnaire (il détient ~23 % du capital), mais aussi pour le rendement fiscal (impôt sur les bénéfices).",
    attendu:
      "Calculs complets et détaillés, identification des natures, comparaison des deux valeurs argumentée, au moins trois acteurs avec justifications précises.",
  },
  {
    id: "sdgn10-cas2",
    title: "Étude de cas : Doctolib, une start-up non cotée",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 620,
    support:
      "Doctolib — start-up française (prise de rendez-vous médicaux en ligne). Plus de 80 000 professionnels partenaires et 60 millions de patients utilisateurs. Non cotée en Bourse. Contexte : forte croissance du marché de la santé numérique (estimé à 660 Md$ en 2030, source illustrative McKinsey).",
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
    consigne:
      "Rédige une analyse structurée et argumentée de la situation de Doctolib en répondant à chaque question. Mobilise les notions du cours.",
    questions: [
      "Calcule la valeur financière patrimoniale de Doctolib. Que représente-t-elle concrètement ?",
      "Doctolib n'est pas cotée en Bourse. Comment les investisseurs ont-ils quand même déterminé une valeur pour l'entreprise ? Explique la différence entre valeur comptable et valeur de marché.",
      "Pourquoi des investisseurs acceptent-ils de valoriser Doctolib à 5 800 M€ alors que ses capitaux propres ne s'élèvent qu'à 180 M€ ? Identifie au moins trois raisons.",
      "Doctolib affiche une perte de 35 M€ cette année. Est-ce nécessairement un mauvais signe ? Explique.",
      "Quels sont les enjeux de la valeur de Doctolib pour ses différentes parties prenantes (fondateurs, investisseurs, salariés, patients, État) ?",
    ],
    correctionModele:
      "1) Valeur financière patrimoniale :\n" +
      "Valeur financière = Total actif − Total dettes\n" +
      "= 420 M€ − 240 M€ = 180 M€\n" +
      "Elle représente ce que l'entreprise « vaut » sur la base de son patrimoine actuel : la richesse accumulée par les apports des associés et les bénéfices passés mis en réserve. " +
      "C'est une mesure comptable, fondée sur ce qui est dans le bilan aujourd'hui.\n\n" +
      "2) Valeur de marché vs valeur comptable :\n" +
      "La valeur comptable (180 M€) repose sur les données historiques du bilan. " +
      "La valeur de marché (5 800 M€) est le prix qu'un investisseur est prêt à payer pour entrer au capital, estimé lors d'une levée de fonds. " +
      "Pour une entreprise non cotée, il n'y a pas de cours boursier : la valorisation est négociée entre l'entreprise et les investisseurs, en s'appuyant sur des méthodes de projection (multiples de chiffre d'affaires, flux de trésorerie futurs actualisés). " +
      "La différence entre les deux reflète la prime payée pour les perspectives de croissance future.\n\n" +
      "3) Pourquoi 5 800 M€ pour 180 M€ de capitaux propres :\n" +
      "— Marché à très forte croissance : le marché de la santé numérique vaut potentiellement 660 Md$ en 2030 ; être en position de leader aujourd'hui ouvre des revenus futurs considérables.\n" +
      "— Actifs immatériels non comptabilisés : la base de 80 000 professionnels partenaires, la marque Doctolib, les données de santé agrégées (dans le respect du RGPD), les algorithmes d'IA représentent une valeur réelle non inscrite au bilan.\n" +
      "— Modèle économique récurrent : les abonnements mensuels des professionnels de santé génèrent des revenus stables et prévisibles, très appréciés des investisseurs.\n" +
      "— Barrières à l'entrée élevées : recréer un réseau de 80 000 médecins et 60 millions de patients prendrait des années à un concurrent.\n" +
      "— Perspectives d'introduction en Bourse (IPO) : les investisseurs anticipent une sortie valorisante dans 2-3 ans.\n\n" +
      "4) La perte de 35 M€ : bon ou mauvais signe ?\n" +
      "Ce n'est pas nécessairement un mauvais signe dans ce contexte. " +
      "Doctolib réinvestit massivement ses revenus en R&D (IA, nouvelles fonctionnalités) et en expansion internationale (Allemagne, Italie). " +
      "Pour une start-up en hypercroissance, accepter des pertes à court terme pour conquérir des parts de marché est une stratégie délibérée (stratégie « blitzscaling »). " +
      "Les investisseurs évaluent la trajectoire de croissance plutôt que le résultat immédiat. " +
      "En revanche, si les pertes persistent trop longtemps sans croissance du chiffre d'affaires, cela deviendrait préoccupant.\n\n" +
      "5) Enjeux pour les parties prenantes :\n" +
      "— Fondateurs : une valorisation élevée préserve leur part du capital et leur influence dans les décisions stratégiques.\n" +
      "— Investisseurs : ils espèrent une plus-value lors de l'IPO ou d'une revente ; la valorisation actuelle sécurise leur mise.\n" +
      "— Salariés : la valorisation de l'entreprise peut se traduire par des stock-options attractives ; l'avenir de leurs emplois dépend de la viabilité financière.\n" +
      "— Patients : une Doctolib financièrement solide garantit la continuité et l'amélioration du service de prise de rendez-vous.\n" +
      "— État : une licorne française représente un enjeu de souveraineté numérique (données de santé), de fiscalité future et d'emplois qualifiés.",
    attendu:
      "Calcul de valeur financière, distinction comptable/marché claire, au moins trois raisons argumentées pour l'écart de valorisation, analyse nuancée de la perte, parties prenantes toutes traitées avec enjeux précis.",
  },
];

/** Chapitre 11 — Valeur ajoutée et valeur partenariale (manuel 1re STMG). */
