import type { DroitMissionExercise } from "../types";

export const DROIT_CHAP4_EXERCISES: DroitMissionExercise[] = [
  {
    id: "drt4-e1",
    title: "Contractuelle et extracontractuelle",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 150,
    support:
      "Cas 1 \u2014 \u00ab TechStore \u00bb vend un ordinateur 899 \u20ac : non livr\u00e9 \u00e0 la date pr\u00e9vue. Lien contractuel : responsabilit\u00e9 contractuelle (inex\u00e9cution d'une obligation de r\u00e9sultat).\n\nCas 2 \u2014 Deux automobilistes inconnus se percutent sans relation pr\u00e9alable : responsabilit\u00e9 extracontractuelle (d\u00e9lictuelle), art. 1240.\n\nLa victime peut parfois cumuler les fondements mais ne peut pas \u00eatre indemnis\u00e9e deux fois pour le m\u00eame pr\u00e9judice.",
    consigne:
      "Distingue responsabilit\u00e9 contractuelle et extracontractuelle (fondement, fait g\u00e9n\u00e9rateur). Illustre avec les cas 1 et 2.",
    questions: [
      "Responsabilit\u00e9 contractuelle ?",
      "Extracontractuelle ?",
      "Exemple accident sans contrat pr\u00e9alable ?",
    ],
    correctionModele: "1) Lien contrat non respect\u00e9.\n\n2) Fait juridique ind\u00e9pendant.\n\n3) Choc de voitures inconnus.",
    attendu: "Deux r\u00e9gimes, exemples.",
    notionsCibles: ["responsabilit\u00e9 contractuelle", "responsabilit\u00e9 extracontractuelle"],
  },
  {
    id: "drt4-e2",
    title: "Trois \u00e9l\u00e9ments de la responsabilit\u00e9",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 160,
    support:
      "Trois \u00e9l\u00e9ments constitutifs de la responsabilit\u00e9 civile :\n1) Un dommage r\u00e9parable (certain, personnel, l\u00e9gitime, direct).\n2) Un fait g\u00e9n\u00e9rateur (inex\u00e9cution contractuelle, faute, fait d'autrui, fait des choses, produit d\u00e9fectueux\u2026).\n3) Un lien de causalit\u00e9 entre le fait et le dommage.\n\nExemple : livreur B2B casse une palette (dommage mat\u00e9riel 1 200 \u20ac) parce qu'il roule trop vite (faute) \u2192 lien direct. En principe, la victime prouve ; certaines pr\u00e9somptions all\u00e8gent la charge.",
    consigne:
      "Cite et explique les trois \u00e9l\u00e9ments. Applique \u00e0 l'exemple du livreur. Qui prouve en principe ?",
    questions: [
      "Les trois \u00e9l\u00e9ments ?",
      "Fait g\u00e9n\u00e9rateur en contractuel ?",
      "Lien de causalit\u00e9 ?",
    ],
    correctionModele: "1) Dommage, fait, causalit\u00e9.\n\n2) Inex\u00e9cution obligation.\n\n3) Fait a caus\u00e9 le dommage.",
    attendu: "Trois \u00e9l\u00e9ments expliqu\u00e9s.",
    notionsCibles: ["fait g\u00e9n\u00e9rateur", "lien de causalit\u00e9"],
  },
  {
    id: "drt4-e3",
    title: "Responsabilit\u00e9 du fait personnel",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 170,
    support:
      "Articles 1240-1241 : tout fait quelconque de l'homme qui cause \u00e0 autrui un dommage oblige celui par la faute duquel il est arriv\u00e9 \u00e0 le r\u00e9parer.\n\nSituation \u2014 Un cycliste roule sur le trottoir, percute une passante : entorse. Faute = comportement contraire \u00e0 celui d'un usager prudent (imprudence) ou volontaire.\n\nEn principe, la victime prouve dommage, faute et causalit\u00e9. Pas de pr\u00e9somption automatique de faute.",
    consigne:
      "D\u00e9finis responsabilit\u00e9 pour faute (art. 1240). Qu'est-ce que l'imprudence ? Qui supporte la charge de la preuve ?",
    questions: [
      "Base l\u00e9gale ?",
      "Imprudence ?",
      "Preuve \u00e0 qui ?",
    ],
    correctionModele: "1) Art. 1240 et suivants.\n\n2) Comportement d'un homme raisonnable non respect\u00e9.\n\n3) Victime en principe.",
    attendu: "Faute, imprudence, preuve.",
    notionsCibles: ["faute", "art. 1240"],
  },
  {
    id: "drt4-e4",
    title: "Responsabilit\u00e9 du fait d'autrui",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 200,
    support:
      "Article 1242 : responsabilit\u00e9 du fait d'autrui.\n\nCas A \u2014 Enfant mineur de 8 ans casse une vitrine en jouant au ballon : les parents sont pr\u00e9sum\u00e9s responsables (garde et surveillance).\n\nCas B \u2014 Livreur salari\u00e9 percute un pi\u00e9ton en livrant des colis (temps et lieu du travail) : l'employeur (commettant) r\u00e9pond du fait du pr\u00e9pos\u00e9.\n\nPr\u00e9somption de responsabilit\u00e9 : la victime prouve surtout le dommage et le lien de causalit\u00e9 ; le d\u00e9fendeur peut parfois s'exon\u00e9rer (faute de la victime, fait d'un tiers).",
    consigne:
      "Compare responsabilit\u00e9 des parents et de l'employeur (art. 1242). Quelle facilit\u00e9 de preuve pour la victime ?",
    questions: [
      "Parents / enfants ?",
      "Employeur / salari\u00e9 ?",
      "Preuve all\u00e9g\u00e9e ?",
    ],
    correctionModele: "1) Dommages caus\u00e9s par enfant mineur au foyer.\n\n2) Dommage dans fonctions et temps de travail.\n\n3) Oui, pr\u00e9somption de responsabilit\u00e9.",
    attendu: "1242, deux cas, preuve.",
    notionsCibles: ["responsabilit\u00e9 du fait d'autrui", "pr\u00e9pos\u00e9"],
  },
  {
    id: "drt4-e5",
    title: "Responsabilit\u00e9 du fait des choses",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 210,
    support:
      "Responsabilit\u00e9 du fait des choses (art. 1242 al. 2) : le gardien r\u00e9pond des dommages caus\u00e9s par la chose.\n\nChose en mouvement (ex. voiture en marche) : pr\u00e9somption que la chose a jou\u00e9 un r\u00f4le actif ; la victime prouve surtout causalit\u00e9.\n\nChose immobile (ex. arbre sur un trottoir) : la victime doit prouver un vice ou une anomalie de la chose (branche pourrie non \u00e9lagu\u00e9e).\n\nGardien = celui qui a la garde mat\u00e9rielle ou juridique (propri\u00e9taire, locataire selon cas).",
    consigne:
      "Explique la responsabilit\u00e9 du fait des choses. Compare chose en mouvement et immobile. Qui est le gardien ?",
    questions: [
      "Qui est le gardien ?",
      "Chose en mouvement ?",
      "Chose immobile ?",
    ],
    correctionModele: "1) Celui qui a la garde.\n\n2) Pr\u00e9somption, preuve causalit\u00e9 suffit souvent.\n\n3) Preuve du fait actif de la chose.",
    attendu: "Gardien, mouvement, immobile.",
    notionsCibles: ["responsabilit\u00e9 du fait des choses"],
  },
  {
    id: "drt4-e6",
    title: "Loi Badinter",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 220,
    support:
      "Loi Badinter (1985) : r\u00e9gime sp\u00e9cial pour les victimes d'accidents de la circulation.\n\nConditions cumulatives : accident de circulation, impliquant un v\u00e9hicule terrestre \u00e0 moteur (VTM), dommage li\u00e9 \u00e0 l'accident.\n\nAvantages victime : indemnisation facilit\u00e9e, force majeure difficilement opposable au conducteur, faute inexcusable de la victime rare en dommage corporel (volontaire ou inexcusable seulement).\n\nExemple : pi\u00e9ton renvers\u00e9 sur route publique par une voiture.",
    consigne:
      "Cite les trois conditions de la loi Badinter. Quels avantages pour la victime corporelle ?",
    questions: [
      "Trois conditions cumulatives ?",
      "Avantage victime ?",
      "Faute victime corporel ?",
    ],
    correctionModele: "1) Accident circulation, VTM, dommage li\u00e9.\n\n2) Indemnisation facilit\u00e9e.\n\n3) Volontaire ou inexcusable exceptionnelle.",
    attendu: "Badinter, conditions, protection.",
    notionsCibles: ["loi Badinter"],
  },
  {
    id: "drt4-e7",
    title: "Produits d\u00e9fectueux",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 230,
    support:
      "Articles 1245 et s. : responsabilit\u00e9 du fait des produits d\u00e9fectueux.\n\nSituation \u2014 Trottinette \u00e9lectrique : frein d\u00e9fectueux, chute, fracture poignet. Notice sans avertissement sur la pente. Producteur identifi\u00e9 en France.\n\nVictime prouve : d\u00e9faut de s\u00e9curit\u00e9 du produit (pas conforme \u00e0 l'attente l\u00e9gitime), dommage, lien de causalit\u00e9. Pas besoin de prouver la faute du producteur (responsabilit\u00e9 de plein droit).\n\nExon\u00e9rations possibles (art. 1245-10) : non mise en circulation, d\u00e9faut post\u00e9rieur, etc.",
    consigne:
      "Pr\u00e9sente le r\u00e9gime art. 1245 : contre qui agir, preuves de la victime, exon\u00e9rations possibles du producteur.",
    questions: [
      "Contre qui agir ?",
      "D\u00e9faut de s\u00e9curit\u00e9 ?",
      "Exon\u00e9rations producteur ?",
    ],
    correctionModele: "1) Producteur, importateur ou vendeur \u00e0 d\u00e9faut.\n\n2) Produit dangereux vs attente normale.\n\n3) Art. 1245-10 (non mise en circulation, etc.).",
    attendu: "1245, preuves victime, exon\u00e9rations.",
    notionsCibles: ["produit d\u00e9fectueux"],
  },
  {
    id: "drt4-e8",
    title: "Accident du travail",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 260,
    minChars: 240,
    support:
      "Loi du 9 avril 1898 : accident du travail.\n\nCrit\u00e8res : fait accidentel, l\u00e9sion (corporelle ou psychique), survenu par le fait ou \u00e0 l'occasion du travail (ou trajet domicile-travail).\n\nPr\u00e9somption d'origine professionnelle : pas besoin de prouver la faute de l'employeur. Prestations : frais m\u00e9dicaux, indemnit\u00e9s journali\u00e8res, rente en cas de s\u00e9quelle, prise en charge par l'assurance AT/MP.\n\nExemple : chute d'un \u00e9chafaudage sur un chantier BTP.",
    consigne:
      "Cite les crit\u00e8res de l'accident du travail. Quel avantage pour le salari\u00e9 ? Quelles prestations ?",
    questions: [
      "Crit\u00e8res ?",
      "Avantage salari\u00e9 ?",
      "Prestations ?",
    ],
    correctionModele: "1) Soudainet\u00e9, l\u00e9sion, lien professionnel.\n\n2) Pr\u00e9somption origine pro.\n\n3) Frais m\u00e9dicaux, indemnit\u00e9s, rente.",
    attendu: "AT, pr\u00e9somption, prestations.",
    notionsCibles: ["accident du travail"],
  },
  {
    id: "drt4-e9",
    title: "Obligation de moyens vs r\u00e9sultat en responsabilit\u00e9",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 260,
    support:
      "En responsabilit\u00e9, la qualification moyens/r\u00e9sultat change la preuve.\n\nM\u00e9decin (obligation de moyens en principe) : doit mettre en \u0153uvre tous les moyens conformes \u00e0 son art ; la gu\u00e9rison n'est pas garantie. La victime doit prouver une faute ou des moyens insuffisants.\n\nVendeur (obligation de r\u00e9sultat) : doit livrer le bien conforme. Si non livr\u00e9, l'inex\u00e9cution est \u00e9tablie sans prouver une faute.\n\nS\u00e9curit\u00e9 : jurisprudence tend vers une obligation de r\u00e9sultat (ex. absence de signalisation dangereuse).",
    consigne:
      "Distingue obligation de moyens et de r\u00e9sultat en responsabilit\u00e9. Applique au m\u00e9decin et au vendeur. Mentionne la s\u00e9curit\u00e9.",
    questions: [
      "M\u00e9decin ?",
      "Vendeur non livr\u00e9 ?",
      "S\u00e9curit\u00e9 souvent obligation de r\u00e9sultat ?",
    ],
    correctionModele: "1) Moyens : pas garantie gu\u00e9rison.\n\n2) R\u00e9sultat : livraison due.\n\n3) Jurisprudence souvent r\u00e9sultat pour s\u00e9curit\u00e9.",
    attendu: "Moyens/r\u00e9sultat en responsabilit\u00e9.",
    notionsCibles: ["obligation de moyens", "obligation de r\u00e9sultat"],
  },
  {
    id: "drt4-e10",
    title: "Faute et responsabilit\u00e9 sans faute",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 300,
    support:
      "R\u00e9gime classique (art. 1240) : responsabilit\u00e9 pour faute \u2014 la victime prouve un comportement fautif (imprudence, n\u00e9gligence).\n\n\u00c9volution : responsabilit\u00e9 du risque \u2014 celui qui cr\u00e9e un risque anormal doit en assumer les cons\u00e9quences m\u00eame sans faute prouv\u00e9e (activit\u00e9 dangereuse, produits, fait des choses en mouvement).\n\nExemples : transport de mati\u00e8res dangereuses, produits d\u00e9fectueux (1245), loi Badinter (risque de la circulation).",
    consigne:
      "Compare responsabilit\u00e9 pour faute et pour risque. Donne deux exemples de r\u00e9gimes proches du risque.",
    questions: [
      "R\u00e9gime faute ?",
      "R\u00e9gime risque ?",
      "Exemple risque ?",
    ],
    correctionModele: "1) Prouver comportement fautif.\n\n2) Cr\u00e9ation de risque suffit.\n\n3) Activit\u00e9 dangereuse, produits, etc.",
    attendu: "Faute vs risque.",
    notionsCibles: ["responsabilit\u00e9 pour faute", "responsabilit\u00e9 du risque"],
  },
  {
    id: "drt4-cas1",
    title: "\u00c9tude de cas : collision et Badinter",
    type: "Etude de cas",
    difficulty: "Difficile",
    xp: 560,
    minChars: 500,
    support:
      "\u00c9tude \u2014 Collision sur route d\u00e9partementale entre deux voitures. Pi\u00e9ton bless\u00e9 l\u00e9ger (entorse), d\u00e9g\u00e2ts mat\u00e9riels 3 400 \u20ac. Conducteur B : pas d'assurance valide, permis suspendu.\n\nConditions Badinter : accident circulation, VTM, dommage li\u00e9 \u2014 v\u00e9rifier pour le pi\u00e9ton et les conducteurs.\n\nCorporel : indemnisation facilit\u00e9e ; FGAO si conducteur responsable non assur\u00e9.\n\nMat\u00e9riel : faute de la victime peut r\u00e9duire l'indemnisation (conduite imprudente).",
    consigne:
      "Applique la loi Badinter et le FGAO. Distingue traitement corporel et mat\u00e9riel. Qui indemnise le pi\u00e9ton ?",
    questions: [
      "Badinter applicable ?",
      "Qui indemnise corporel ?",
      "Dommage mat\u00e9riel victime ?",
    ],
    correctionModele: "1) Oui si VTM + accident + dommage.\n\n2) FGAO si non assur\u00e9.\n\n3) Faute victime peut limiter mat\u00e9riel.",
    attendu: "Badinter, FGAO, faute.",
    notionsCibles: ["loi Badinter", "FGAO"],
  },
  {
    id: "drt4-cas2",
    title: "\u00c9tude de cas : produit d\u00e9fectueux",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 550,
    support:
      "\u00c9tude \u2014 Amina ach\u00e8te une trottinette \u00e9lectrique \u00ab SwiftRoll Pro \u00bb (producteur UE). Frein avant l\u00e2che en descente mod\u00e9r\u00e9e : chute, fracture poignet, 3 semaines ITT, 2 100 \u20ac frais.\nNotice : pas d'avertissement sur les pentes > 8 %. Expert : d\u00e9faut de conception du syst\u00e8me de freinage.\n\nArt. 1245 : producteur, importateur ou vendeur \u00e0 d\u00e9faut. Preuves victime : d\u00e9faut de s\u00e9curit\u00e9, dommage, causalit\u00e9. Producteur peut invoquer art. 1245-10.",
    consigne:
      "Analyse compl\u00e8te art. 1245 : d\u00e9faut de s\u00e9curit\u00e9, preuves, d\u00e9fendeurs possibles, exon\u00e9rations. Dommages \u00e0 indemniser.",
    questions: [
      "R\u00e9gime applicable ?",
      "Preuves victime ?",
      "Exon\u00e9ration possible ?",
    ],
    correctionModele: "1) Art. 1245 si d\u00e9faut s\u00e9curit\u00e9.\n\n2) D\u00e9faut, dommage, lien.\n\n3) Producteur peut prouver absence d\u00e9faut \u00e0 la mise en circulation.",
    attendu: "Produit d\u00e9fectueux complet.",
    notionsCibles: ["produit d\u00e9fectueux", "d\u00e9faut de s\u00e9curit\u00e9"],
  },
];
