import type { DroitMissionExercise } from "../types";

export const DROIT_CHAP5_EXERCISES: DroitMissionExercise[] = [
  {
    id: "drt5-e1",
    title: "Clause d'exon\u00e9ration de responsabilit\u00e9",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 150,
    support:
      "Clause d'exon\u00e9ration (ou de limitation) : stipulation par laquelle un professionnel limite ou exclut \u00e0 l'avance sa responsabilit\u00e9 contractuelle en cas de dommage.\n\nExemple CGV salle de sport : \u00ab L'\u00e9tablissement d\u00e9cline toute responsabilit\u00e9 en cas de vol au vestiaire \u00bb.\n\nLimites : clause abusive en B2C (L212-1), inefficace en cas de faute lourde, interdiction de exclure les obligations essentielles du contrat.",
    consigne:
      "D\u00e9finis clause d'exon\u00e9ration. Analyse l'exemple vestiaire. Cite trois limites \u00e0 son efficacit\u00e9.",
    questions: [
      "D\u00e9finition ?",
      "Valable en contrat de consommation ?",
      "Faute lourde ?",
    ],
    correctionModele: "1) Limitation/exclusion responsabilit\u00e9 pr\u00e9vue.\n\n2) Non si abusive.\n\n3) Clause inefficace.",
    attendu: "Clause, limites.",
    notionsCibles: ["clause d'exon\u00e9ration"],
  },
  {
    id: "drt5-e2",
    title: "Cause \u00e9trang\u00e8re",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 160,
    support:
      "Cause \u00e9trang\u00e8re : \u00e9v\u00e9nement ext\u00e9rieur \u00e0 l'auteur du dommage qui rompt le lien de causalit\u00e9 et peut exon\u00e9rer totalement ou partiellement.\n\nTrois types (cours) :\n\u2014 Force majeure (impr\u00e9visible, irr\u00e9sistible, ext\u00e9rieur).\n\u2014 Fait d'un tiers (cause exclusive sans faute du d\u00e9fendeur).\n\u2014 Fait de la victime (imprudence exclusive ou contributive).\n\nEffet : plus de responsabilit\u00e9 (totale) ou partage du pr\u00e9judice (partielle).",
    consigne:
      "D\u00e9finis cause \u00e9trang\u00e8re. Pr\u00e9sente les trois types et l'effet sur la responsabilit\u00e9.",
    questions: [
      "D\u00e9finition ?",
      "Trois causes ?",
      "Effet sur responsabilit\u00e9 ?",
    ],
    correctionModele: "1) \u00c9v\u00e9nement ext\u00e9rieur \u00e0 l'auteur.\n\n2) Force majeure, tiers, victime.\n\n3) Exon\u00e9ration totale ou partielle.",
    attendu: "Cause \u00e9trang\u00e8re, trois types.",
    notionsCibles: ["cause \u00e9trang\u00e8re"],
  },
  {
    id: "drt5-e3",
    title: "Force majeure",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 170,
    support:
      "Force majeure : \u00e9v\u00e9nement impr\u00e9visible, irr\u00e9sistible et ext\u00e9rieur \u00e0 la personne tenue de l'obligation.\n\nExemple \u2014 Temp\u00eate officielle (vigilance orange) : une tuile s'arrache du toit d'un immeuble bien entretenu et brise la vitre du voisin. Le propri\u00e9taire peut s'exon\u00e9rer s'il prouve les trois crit\u00e8res.\n\nEn droit de la circulation (loi Badinter) : la force majeure est difficilement opposable au conducteur pour indemniser une victime corporelle.",
    consigne:
      "D\u00e9finis force majeure (trois crit\u00e8res). Applique \u00e0 la tuile et la temp\u00eate. Compare contractuel et Badinter.",
    questions: [
      "Trois crit\u00e8res ?",
      "Exemple tuile ?",
      "En contractuel et Badinter ?",
    ],
    correctionModele: "1) Impr\u00e9visible, irr\u00e9sistible, ext\u00e9rieur.\n\n2) Propri\u00e9taire peut s'exon\u00e9rer.\n\n3) Difficile en circulation (Badinter).",
    attendu: "Force majeure, exemple.",
    notionsCibles: ["force majeure"],
  },
  {
    id: "drt5-e4",
    title: "Fait d'un tiers",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 200,
    support:
      "Fait d'un tiers : le dommage est caus\u00e9 exclusivement par une personne \u00e9trang\u00e8re au litige, sans faute du d\u00e9fendeur.\n\nExemple \u2014 Un sous-traitant mal cale une marchandise ; le camion du commettant perd la cargaison : le sous-traitant fautif peut \u00eatre seul responsable si le transporteur n'a commis aucune faute.\n\nProduits d\u00e9fectueux : le producteur (art. 1245) reste responsable de plein droit ; il ne peut pas toujours se d\u00e9charger sur le fournisseur vis-\u00e0-vis de la victime.",
    consigne:
      "Quand invoquer le fait d'un tiers ? Qui indemnise la victime ? Lien avec le r\u00e9gime des produits d\u00e9fectueux.",
    questions: [
      "Quand invoquer ?",
      "Qui indemnise la victime ?",
      "Lien avec produit d\u00e9fectueux ?",
    ],
    correctionModele: "1) Tiers cause exclusive.\n\n2) Le tiers responsable.\n\n3) Producteur en 1245.",
    attendu: "Fait tiers, application.",
    notionsCibles: ["fait d'un tiers"],
  },
  {
    id: "drt5-e5",
    title: "Fait de la victime",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 210,
    support:
      "Fait de la victime : comportement fautif de la victime qui contribue ou cause le dommage.\n\nExon\u00e9ration totale : si la victime est seule cause (ex. traverse une voie express interdite aux pi\u00e9tons, cause exclusive).\n\nExon\u00e9ration partielle : partage des responsabilit\u00e9s et r\u00e9duction de l'indemnisation (ex. cycliste sans \u00e9clairage la nuit + automobiliste distrait).\n\nBadinter : en dommage mat\u00e9riel, la faute de la victime peut r\u00e9duire l'indemnit\u00e9 ; en corporel, faute inexcusable rare.",
    consigne:
      "Distingue exon\u00e9ration totale et partielle par fait de la victime. Applique aux exemples. Mentionne Badinter.",
    questions: [
      "Exon\u00e9ration totale ?",
      "Partielle ?",
      "Badinter mat\u00e9riel ?",
    ],
    correctionModele: "1) Si cause exclusive.\n\n2) Partage indemnisation.\n\n3) Juge appr\u00e9cie r\u00e9duction.",
    attendu: "Faute victime, partielle.",
    notionsCibles: ["fait de la victime"],
  },
  {
    id: "drt5-e6",
    title: "Clause abusive et exon\u00e9ration",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 230,
    support:
      "Contrat de consommation : le professionnel est en position dominante, le consommateur adh\u00e8re aux CGV.\n\nClause \u00ab le professionnel exclut toute responsabilit\u00e9 pour dommages corporels ou vol \u00bb = souvent abusive (L212-1) : d\u00e9s\u00e9quilibre significatif au d\u00e9triment du consommateur.\n\nSanction : clause r\u00e9put\u00e9e non \u00e9crite \u2014 le contrat subsiste, le pro reste responsable selon le droit commun.\n\nExemple : billetterie spectacle avec clause limitant tout remboursement en cas d'annulation.",
    consigne:
      "Explique le lien entre clause d'exon\u00e9ration et protection du consommateur (L212-1). Effet si la clause est abusive.",
    questions: [
      "Pourquoi interdire en B2C ?",
      "D\u00e9s\u00e9quilibre ?",
      "Effet si abusive ?",
    ],
    correctionModele: "1) Pro fort / consommateur faible.\n\n2) Oui, significatif.\n\n3) Non \u00e9crite.",
    attendu: "Abus, consommation.",
    notionsCibles: ["clause abusive", "clause d'exon\u00e9ration"],
  },
  {
    id: "drt5-e7",
    title: "Faute lourde et clause",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 230,
    support:
      "Faute lourde : faute d'une particuli\u00e8re gravit\u00e9 commise avec conscience du dommage probable ou de l'imprudence extr\u00eame.\n\nSituation \u2014 Piscine municipale : clause excluant toute responsabilit\u00e9. Ma\u00eetre-nageur laisse volontairement le local produits chimiques ouvert ; intoxication d'un nageur.\n\nM\u00eame avec clause d'exon\u00e9ration, la faute lourde du professionnel engage sa responsabilit\u00e9 : la clause est inefficace pour ce type de faute (ordre public / protection de la victime).",
    consigne:
      "D\u00e9finis faute lourde. Pourquoi la clause d'exon\u00e9ration ne prot\u00e8ge pas le professionnel dans le cas de la piscine ?",
    questions: [
      "Qu'est-ce que faute lourde ?",
      "Clause valable alors ?",
      "Exemple ?",
    ],
    correctionModele: "1) Faute tr\u00e8s grave, conscience du dommage.\n\n2) Non pour cette faute.\n\n3) Mise en danger d\u00e9lib\u00e9r\u00e9e.",
    attendu: "Faute lourde, clause.",
    notionsCibles: ["faute lourde"],
  },
  {
    id: "drt5-e8",
    title: "Cumul contractuel / extracontractuel",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 260,
    minChars: 240,
    support:
      "Un client commande une installation de cuisine (contrat) ; le poseur cause aussi un d\u00e9g\u00e2t \u00e0 un voisin sans lien contractuel (extracontractuel).\n\nLa victime peut choisir le r\u00e9gime le plus favorable (cumul des fondements, pas double indemnisation).\n\nCauses \u00e9trang\u00e8res (FM, tiers, victime) peuvent \u00eatre invoqu\u00e9es dans les deux r\u00e9gimes, mais appr\u00e9ciation diff\u00e8re (ex. FM rare en Badinter pour le corporel).",
    consigne:
      "Explique le cumul des r\u00e9gimes et le choix de la victime. Les causes \u00e9trang\u00e8res sont-elles identiques partout ?",
    questions: [
      "M\u00eame causes \u00e9trang\u00e8res ?",
      "Choix de la victime ?",
      "Force majeure partout ?",
    ],
    correctionModele: "1) Oui en principe.\n\n2) Oui, r\u00e9gime favorable.\n\n3) Appr\u00e9ciation selon contexte.",
    attendu: "Cumul, choix victime.",
    notionsCibles: ["cause \u00e9trang\u00e8re"],
  },
  {
    id: "drt5-e9",
    title: "Temp\u00eate et chantier",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 260,
    support:
      "\u00c9tude \u2014 \u00ab B\u00e2tiExpress \u00bb doit livrer un \u00e9chafaudage le 12 mars pour un chantier lyc\u00e9e. Temp\u00eate officielle les 11\u201312 mars (vents 120 km/h). Livraison le 18 mars. Client r\u00e9clame clause p\u00e9nale 200 \u20ac/jour.\n\nB\u00e2tiExpress invoque force majeure. Le client argue : stocks non s\u00e9curis\u00e9s avant la temp\u00eate, retard \u00e9vitable.\n\nLe juge v\u00e9rifie impr\u00e9visibilit\u00e9, irr\u00e9sistibilit\u00e9, ext\u00e9riorit\u00e9 et rupture du lien causal.",
    consigne:
      "La temp\u00eate est-elle automatiquement une force majeure ? Qui doit prouver quoi ? Impact sur la clause p\u00e9nale ?",
    questions: [
      "Temp\u00eate = force majeure auto ?",
      "Preuve ?",
      "Clause p\u00e9nale + FM ?",
    ],
    correctionModele: "1) Si impr\u00e9visible et irr\u00e9sistible.\n\n2) \u00c0 d\u00e9montrer.\n\n3) P\u00e9nale peut s'appliquer si retard imputable.",
    attendu: "FM contestable.",
    notionsCibles: ["force majeure"],
  },
  {
    id: "drt5-e10",
    title: "Synth\u00e8se exon\u00e9ration",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 300,
    support:
      "Synth\u00e8se \u2014 Concert annul\u00e9 2 h avant : gr\u00e8ve des techniciens lumi\u00e8re (tiers). 1 200 spectateurs, billets 35\u201355 \u20ac. CGV : \u00ab aucun remboursement en cas de force majeure ou gr\u00e8ve \u00bb, en 7 pt gris.\n\nOrganisateur : fait d'un tiers / FM. Spectateurs : consommateurs, clause abusive possible (L212-1), inex\u00e9cution du contrat de prestation.\n\nRecours : remboursement, m\u00e9diation, r\u00e9clamation organisateur.",
    consigne:
      "Analyse : gr\u00e8ve (tiers ou FM ?), clause limitative B2C, droit au remboursement. Plan structur\u00e9 pour les spectateurs.",
    questions: [
      "Gr\u00e8ve = FM ?",
      "Clause limitative valable ?",
      "Remboursement ?",
    ],
    correctionModele: "1) Tiers possible, pas toujours FM.\n\n2) V\u00e9rifier abus B2C.\n\n3) Oui si inex\u00e9cution sans exon\u00e9ration valide.",
    attendu: "Synth\u00e8se exon\u00e9ration.",
    notionsCibles: ["force majeure", "fait d'un tiers", "clause abusive"],
  },
  {
    id: "drt5-cas1",
    title: "\u00c9tude de cas : livraison et temp\u00eate",
    type: "Etude de cas",
    difficulty: "Difficile",
    xp: 560,
    minChars: 500,
    support:
      "\u00c9tude \u2014 \u00ab EventLoc \u00bb loue tentes et sonorisation (28 000 \u20ac) \u00e0 \u00ab FestiPro \u00bb pour un festival le 15 juillet. Livraison pr\u00e9vue le 13 \u00e0 8 h.\nTemp\u00eate m\u00e9t\u00e9o officielle 12\u201313 juillet. Livraison le 14 \u00e0 22 h. Contrat B2B avec clause force majeure d\u00e9taill\u00e9e et p\u00e9nalit\u00e9 1 %/jour.\n\nFestiPro r\u00e9clame p\u00e9nalit\u00e9s et frais de location d'urgence (3 200 \u20ac). EventLoc invoque FM.",
    consigne:
      "Analyse force majeure, validit\u00e9 de la clause FM en B2B, dommages-int\u00e9r\u00eats ou p\u00e9nalit\u00e9s si FM non retenue.",
    questions: [
      "FM retenue ?",
      "Clause FM B2B ?",
      "Dommages-int\u00e9r\u00eats ?",
    ],
    correctionModele: "1) Si crit\u00e8res r\u00e9unis et lien rompu.\n\n2) Valable si pas abusive entre pros.\n\n3) Si pas exon\u00e9r\u00e9, p\u00e9nalit\u00e9s ou D-I.",
    attendu: "FM B2B, clause.",
    notionsCibles: ["force majeure", "clause d'exon\u00e9ration"],
  },
  {
    id: "drt5-cas2",
    title: "\u00c9tude de cas : ski et faute victime",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 550,
    support:
      "\u00c9tude \u2014 Thomas skie hors piste (panneau \u00ab Danger \u2014 hors piste interdit \u00bb). Collision avec un autre skieur sur une piste ouverte. Fracture cheville, 5 000 \u20ac de frais.\n\nStation : faute exclusive de Thomas (fait de la victime). Thomas : signalisation insuffisante, neige glac\u00e9e non trait\u00e9e sur la piste ouverte.\n\nExpert : partage 60 % Thomas / 40 % station possible. Art. 1240 et fait de la victime.",
    consigne:
      "Analyse fait de la victime exclusif ou partiel. Responsabilit\u00e9 \u00e9ventuelle de la station. Cons\u00e9quences sur l'indemnisation.",
    questions: [
      "Fait victime exclusif ?",
      "Responsabilit\u00e9 station ?",
      "Partage ?",
    ],
    correctionModele: "1) Si cause exclusive imprudence majeure.\n\n2) Si d\u00e9faut signalisation ou entretien.\n\n3) Partage indemnisation possible.",
    attendu: "Fait victime, partage.",
    notionsCibles: ["fait de la victime", "faute"],
  },
];
