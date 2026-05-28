import type { DroitMissionExercise } from "../types";

export const DROIT_CHAP3_EXERCISES: DroitMissionExercise[] = [
  {
    id: "drt3-e1",
    title: "Responsabilit\u00e9 civile et p\u00e9nale",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 150,
    support:
      "Situation \u2014 Un conducteur roule \u00e0 90 km/h en agglom\u00e9ration (limit\u00e9e \u00e0 50). Il percute un pi\u00e9ton : fracture du tibia, 6 semaines d'arr\u00eat de travail, v\u00e9lo d\u00e9truit (480 \u20ac).\n\nResponsabilit\u00e9 civile (art. 1240 et s.) : r\u00e9parer le dommage subi par la victime (frais m\u00e9dicaux, indemnisation, remplacement du v\u00e9lo). But = r\u00e9paration du pr\u00e9judice priv\u00e9.\n\nResponsabilit\u00e9 p\u00e9nale (Code p\u00e9nal) : sanctionner l'infraction (amende, prison, retrait de permis). But = punir et prot\u00e9ger l'ordre public.\n\nLes deux peuvent coexister pour le m\u00eame fait.",
    consigne:
      "Distingue responsabilit\u00e9 civile et p\u00e9nale (but, sanction, qui agit). Applique au cas du conducteur.",
    questions: [
      "But de la responsabilit\u00e9 civile ?",
      "But de la responsabilit\u00e9 p\u00e9nale ?",
      "Exemple pour chaque ?",
    ],
    correctionModele: "1) R\u00e9parer le pr\u00e9judice priv\u00e9.\n\n2) Punir, prot\u00e9ger l'ordre public.\n\n3) Civ. : indemnisation ; p\u00e9n. : amende/prison.",
    attendu: "Deux responsabilit\u00e9s compar\u00e9es.",
    notionsCibles: ["responsabilit\u00e9 civile", "responsabilit\u00e9 p\u00e9nale"],
  },
  {
    id: "drt3-e2",
    title: "Dommages mat\u00e9riel, corporel et moral",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 160,
    support:
      "Victime d'un accident de chien non tenu en laisse :\n\u2014 Mat\u00e9riel : smartphone cass\u00e9 (350 \u20ac), pantalon d\u00e9chir\u00e9 (60 \u20ac) = atteinte aux biens.\n\u2014 Corporel : plaie au mollet, 8 jours ITT, kin\u00e9sith\u00e9rapie = atteinte \u00e0 l'int\u00e9grit\u00e9 physique.\n\u2014 Moral : peur persistante, stress, atteinte \u00e0 la tranquillit\u00e9 = pr\u00e9judice immat\u00e9riel.\n\nDistinction patrimonial (biens, revenus) vs extrapatrimonial (corps, honneur, vie priv\u00e9e).",
    consigne:
      "D\u00e9finis dommage mat\u00e9riel, corporel et moral. Classe chaque poste du support. Distinction patrimonial / extrapatrimonial.",
    questions: [
      "D\u00e9finis dommage mat\u00e9riel, corporel, moral.",
      "Un exemple pour chaque ?",
      "Pr\u00e9judice patrimonial vs extrapatrimonial ?",
    ],
    correctionModele: "1) Biens / corps / souffrance immat\u00e9rielle.\n\n2) Ex. voiture cass\u00e9e ; fracture ; deuil.\n\n3) Patrimonial = biens ; extra = corps/honneur.",
    attendu: "Trois types, exemples, distinction.",
    notionsCibles: ["dommage mat\u00e9riel", "dommage corporel", "dommage moral"],
  },
  {
    id: "drt3-e3",
    title: "Caract\u00e8res du dommage r\u00e9parable",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 170,
    support:
      "Pour \u00eatre indemnis\u00e9, le dommage doit \u00eatre r\u00e9parable : certain, personnel, l\u00e9gitime, direct.\n\nCas A \u2014 Camion percute une vitrine : 2 400 \u20ac de casse (certain, personnel au commer\u00e7ant, l\u00e9gitime, lien direct).\n\nCas B \u2014 Un trafiquant se fait voler 15 000 \u20ac issus d'un trafic : dommage ill\u00e9gitime, non r\u00e9parable en justice civile.\n\nCas C \u2014 Perte de client\u00e8le future estim\u00e9e : dommage \u00e9ventuel ; indemnisable seulement s'il est suffisamment certain.",
    consigne:
      "Cite les quatre caract\u00e8res du dommage r\u00e9parable. Applique aux cas A, B et C du support.",
    questions: [
      "Quatre caract\u00e8res ?",
      "Dommage \u00e9ventuel r\u00e9parable ?",
      "Pourquoi l'argent du trafic non indemnis\u00e9 ?",
    ],
    correctionModele: "1) Certain, personnel, l\u00e9gitime, direct.\n\n2) Futur possible si certain.\n\n3) Ill\u00e9gitime.",
    attendu: "Quatre caract\u00e8res, ill\u00e9gitimit\u00e9.",
    notionsCibles: ["dommage r\u00e9parable"],
  },
  {
    id: "drt3-e4",
    title: "R\u00e9paration int\u00e9grale",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 200,
    support:
      "Principe : r\u00e9paration int\u00e9grale \u2014 la victime doit \u00eatre remise dans la situation o\u00f9 elle aurait \u00e9t\u00e9 sans le dommage, ni plus ni moins (pas de profit, pas de perte).\n\nExemple 1 \u2014 Vandalisme sur une devanture : r\u00e9paration en nature = remplacement des vitres et peinture.\n\nExemple 2 \u2014 Si r\u00e9paration impossible ou insuffisante : dommages-int\u00e9r\u00eats (indemnit\u00e9 p\u00e9cuniaire) pour frais m\u00e9dicaux, perte de revenus, pr\u00e9judice moral.\n\nExemple 3 \u2014 Voiture d\u00e9truite : remplacement du v\u00e9hicule ou \u00e9quivalent selon l'\u00e9tat.",
    consigne:
      "Explique le principe de r\u00e9paration int\u00e9grale, puis la r\u00e9paration en nature et par \u00e9quivalent avec les exemples.",
    questions: [
      "Principe de r\u00e9paration int\u00e9grale ?",
      "En nature ?",
      "Par \u00e9quivalent ?",
    ],
    correctionModele: "1) Tout le pr\u00e9judice, ni plus ni moins.\n\n2) Supprimer le dommage (r\u00e9parer, remplacer).\n\n3) Indemnit\u00e9 p\u00e9cuniaire.",
    attendu: "Int\u00e9grale, nature, \u00e9quivalent.",
    notionsCibles: ["r\u00e9paration int\u00e9grale"],
  },
  {
    id: "drt3-e5",
    title: "Assurance responsabilit\u00e9 civile",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 210,
    support:
      "M. Lefebvre, propri\u00e9taire d'un chien, est assur\u00e9 en responsabilit\u00e9 civile vie priv\u00e9e. Son chien mord un voisin : 1 200 \u20ac de frais m\u00e9dicaux.\n\nL'assureur se substitue au responsable : il indemnise la victime dans la limite du contrat. RC automobile est obligatoire (assurance de personnes : dommages caus\u00e9s aux tiers).\n\nClause d'exclusion possible : si le propri\u00e9taire a provoqu\u00e9 volontairement le chien, l'assureur peut refuser de garantir (faute intentionnelle).",
    consigne:
      "Explique le r\u00f4le de l'assurance RC, l'obligation RC auto et le fonctionnement d'une clause d'exclusion. Applique au cas du chien.",
    questions: [
      "R\u00f4le de l'assureur ?",
      "RC automobile obligatoire ?",
      "Exclusion de garantie ?",
    ],
    correctionModele: "1) Indemniser \u00e0 la place du responsable.\n\n2) Oui, assurance de personnes.\n\n3) Cas o\u00f9 l'assureur ne paie pas (faute volontaire pr\u00e9vue).",
    attendu: "Assurance RC, obligation, exclusion.",
    notionsCibles: ["assurance RC"],
  },
  {
    id: "drt3-e6",
    title: "FGAO et victimes non assur\u00e9es",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 220,
    support:
      "Accident de circulation \u00e0 Lyon : un pi\u00e9ton est bless\u00e9 par un scooter dont le conducteur prend la fuite (non identifi\u00e9). Aucune assurance identifiable.\n\nSans FGAO (Fonds de garantie des victimes d'accidents de circulation, 1951), la victime n'aurait aucun interlocuteur solvable.\n\nLe FGAO indemnise les victimes d'accidents de circulation caus\u00e9s par un conducteur non assur\u00e9, non identifi\u00e9, ou dont l'assurance est nulle. Il compl\u00e8te le m\u00e9canisme d'assurance obligatoire.",
    consigne:
      "Pourquoi le FGAO a-t-il \u00e9t\u00e9 cr\u00e9\u00e9 ? Applique au cas du scooter non identifi\u00e9. Lien avec l'assurance automobile.",
    questions: [
      "Probl\u00e8me sans FGAO ?",
      "Quels accidents couverts ?",
      "Lien avec assurance ?",
    ],
    correctionModele: "1) Victime sans interlocuteur solvable.\n\n2) Circulation, non assur\u00e9/inconnu.\n\n3) Compl\u00e8te le m\u00e9canisme d'assurance.",
    attendu: "FGAO, r\u00f4le, lien assurance.",
    notionsCibles: ["FGAO"],
  },
  {
    id: "drt3-e7",
    title: "Pr\u00e9judice \u00e9cologique",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 230,
    support:
      "Article 1249 : le pr\u00e9judice \u00e9cologique consiste en une atteinte non insignifiante aux \u00e9cosyst\u00e8mes, aux esp\u00e8ces animales et v\u00e9g\u00e9tales, aux ressources naturelles ou au patrimoine naturel.\n\nSituation \u2014 Rejet de produits chimiques dans une rivi\u00e8re : poissons morts sur 2 km, baignade interdite 6 mois, nappes phyt\u00e9e d\u00e9truites.\n\nR\u00e9paration prioritaire en nature : nettoyage, remise en \u00e9tat du milieu. Si impossible : indemnit\u00e9 affect\u00e9e \u00e0 la r\u00e9paration de l'environnement (pas au portefeuille personnel d'un particulier).",
    consigne:
      "D\u00e9finis pr\u00e9judice \u00e9cologique (art. 1249). Qui est la \u00ab victime \u00bb ? Quel mode de r\u00e9paration prioritaire ?",
    questions: [
      "D\u00e9finition ?",
      "Victime = personne ou nature ?",
      "R\u00e9paration prioritaire ?",
    ],
    correctionModele: "1) D\u00e9gradation environnement.\n\n2) Atteinte \u00e0 l'environnement collectif.\n\n3) Remise en \u00e9tat du milieu.",
    attendu: "D\u00e9finition, r\u00e9paration nature.",
    notionsCibles: ["pr\u00e9judice \u00e9cologique"],
  },
  {
    id: "drt3-e8",
    title: "Assurance de biens et de personnes",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 260,
    minChars: 240,
    support:
      "Assurance de biens : prot\u00e8ge le patrimoine de l'assur\u00e9 (incendie appartement, vol v\u00e9lo, d\u00e9g\u00e2t des eaux). L'assur\u00e9 est souvent victime.\n\nAssurance de personnes : couvre les dommages que l'assur\u00e9 cause aux tiers (RC vie priv\u00e9e, RC auto obligatoire, RC chasse). La victime est un tiers.\n\nExemple prime : jeune conducteur 18 ans, permis depuis 3 mois : statistiquement plus d'accidents \u2192 cotisation RC auto plus \u00e9lev\u00e9e (mutualisation des risques).",
    consigne:
      "Compare assurance de biens et de personnes (objet, qui est indemnis\u00e9). Explique pourquoi la prime d'un jeune conducteur est plus \u00e9lev\u00e9e.",
    questions: [
      "Assurance de biens ?",
      "Assurance de personnes ?",
      "Pourquoi prime plus \u00e9lev\u00e9e pour jeune conducteur ?",
    ],
    correctionModele: "1) Prot\u00e8ge son patrimoine.\n\n2) Couvre dommages caus\u00e9s aux tiers.\n\n3) Risque statistiquement plus grand.",
    attendu: "Deux types, prime risque.",
    notionsCibles: ["assurance de biens", "assurance de personnes"],
  },
  {
    id: "drt3-e9",
    title: "FGTI et solidarit\u00e9",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 260,
    support:
      "FGTI (Fonds de garantie des victimes des actes de terrorisme et d'autres infractions) : cr\u00e9\u00e9 pour les victimes du terrorisme, mission \u00e9largie aux victimes d'infractions de droit commun (agressions, violences) quand l'auteur est insolvable ou inconnu.\n\nLogique : solidarit\u00e9 nationale et mutualisation \u2014 tous les assur\u00e9s contribuent via une taxe sur les contrats d'assurance pour couvrir des risques rares mais graves.\n\nExemple : agression avec arme blanche, auteur en fuite, pas d'assurance identifiable : le FGTI peut intervenir sous conditions.",
    consigne:
      "Pr\u00e9sente la mission du FGTI, son extension et la logique de mutualisation / solidarit\u00e9 nationale.",
    questions: [
      "Mission initiale FGTI ?",
      "Extension ?",
      "Lien avec mutualisation ?",
    ],
    correctionModele: "1) Actes de terrorisme.\n\n2) Infractions droit commun.\n\n3) Fonds publics, risque partag\u00e9.",
    attendu: "FGTI, solidarit\u00e9.",
    notionsCibles: ["FGTI", "mutualisation"],
  },
  {
    id: "drt3-e10",
    title: "Synth\u00e8se dommage et assurance",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 300,
    support:
      "Synth\u00e8se \u2014 En promenade, un chien non tenu en laisse bondit sur Julie : entorse cheville (15 jours ITT, 680 \u20ac frais m\u00e9dicaux), sac et t\u00e9l\u00e9phone endommag\u00e9s (290 \u20ac), anxi\u00e9t\u00e9 persistante.\nPropri\u00e9taire assur\u00e9 RC habitation. Julie doit prouver dommage certain, personnel, l\u00e9gitime, direct et lien de causalit\u00e9.\n\nR\u00e9paration int\u00e9grale : frais soins, remplacement biens, pr\u00e9judice moral \u00e9ventuel. L'assureur indemnise \u00e0 la place du propri\u00e9taire.",
    consigne:
      "Encha\u00eene : types de dommages, quatre caract\u00e8res, r\u00e9paration int\u00e9grale, r\u00f4le de l'assureur RC. Structure num\u00e9rot\u00e9e.",
    questions: [
      "Types de dommages ?",
      "Caract\u00e8res v\u00e9rifi\u00e9s ?",
      "Qui indemnise ?",
    ],
    correctionModele: "1) Corporel + mat\u00e9riel (+ moral possible).\n\n2) Certains, personnels, l\u00e9gitimes, directs.\n\n3) Assureur RC du propri\u00e9taire.",
    attendu: "Types, caract\u00e8res, assurance.",
    notionsCibles: ["dommage corporel", "assurance RC"],
  },
  {
    id: "drt3-cas1",
    title: "\u00c9tude de cas : accident de voiture",
    type: "Etude de cas",
    difficulty: "Difficile",
    xp: 560,
    minChars: 500,
    support:
      "\u00c9tude \u2014 M. Bernard, 42 ans, traverse sur passage pi\u00e9ton. Mme Costa, au volant, consulte son t\u00e9l\u00e9phone : collision. Fracture jambe (6 semaines arr\u00eat, 4 200 \u20ac frais + 1 800 \u20ac perte de revenus), v\u00e9lo \u00e9lectrique d\u00e9truit (1 650 \u20ac), souffrances (pr\u00e9judice moral).\n\nAssurance RC de Mme Costa. Expertise : responsabilit\u00e9 partag\u00e9e 70 % conducteur / 30 % pi\u00e9ton (travers\u00e9e l\u00e9g\u00e8rement hors zone ?).\n\nDommages certains, personnels, l\u00e9gitimes, directs. R\u00e9paration int\u00e9grale selon part de responsabilit\u00e9.",
    consigne:
      "Qualifie les dommages, v\u00e9rifie les caract\u00e8res, d\u00e9cris la r\u00e9paration et le r\u00f4le de l'assureur. Impact de la responsabilit\u00e9 partag\u00e9e.",
    questions: [
      "Dommages subis ?",
      "R\u00e9paration int\u00e9grale ?",
      "Assureur remplace qui ?",
    ],
    correctionModele: "1) Corporel, mat\u00e9riel, moral possible.\n\n2) Frais m\u00e9dicaux, remplacement v\u00e9lo, perte de revenus.\n\n3) Assureur indemnise victime.",
    attendu: "Dommages, r\u00e9paration, assurance.",
    notionsCibles: ["dommage corporel", "assurance automobile"],
  },
  {
    id: "drt3-cas2",
    title: "\u00c9tude de cas : pollution rivi\u00e8re",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 550,
    support:
      "\u00c9tude \u2014 L'usine \u00ab ChimPack \u00bb rejette par erreur 800 litres de solvant dans la rivi\u00e8re Lez. Sur 4 km : poissons morts, interdiction de baignade 8 mois, p\u00eache interdite.\n\nL'association \u00ab Rivi\u00e8res propres \u00bb et la commune engagent une action. Art. 1249 pr\u00e9judice \u00e9cologique. ChimPack propose 50 000 \u20ac au maire personnellement : ce n'est pas le bon mode de r\u00e9paration.\n\nPriorit\u00e9 : nettoyage, renaturation. Associations et collectivit\u00e9s peuvent agir si leur objet statutaire et le territoire sont concern\u00e9s.",
    consigne:
      "Analyse pr\u00e9judice \u00e9cologique, r\u00e9paration en nature, int\u00e9r\u00eat \u00e0 agir des associations et de la commune. Pourquoi l'indemnit\u00e9 au maire est inadapt\u00e9e.",
    questions: [
      "Pr\u00e9judice \u00e9cologique ?",
      "R\u00e9paration ?",
      "Int\u00e9r\u00eat \u00e0 agir association ?",
    ],
    correctionModele: "1) Oui, atteinte \u00e9cosyst\u00e8me.\n\n2) Nettoyage rivi\u00e8re, dommages si impossible.\n\n3) Oui si objet statuts / territoire concern\u00e9.",
    attendu: "Ecologique, nature, action.",
    notionsCibles: ["pr\u00e9judice \u00e9cologique"],
  },
];
