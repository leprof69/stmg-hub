import type { DroitMissionExercise } from "../types";

export const DROIT_CHAP1_EXERCISES: DroitMissionExercise[] = [
  {
    id: "drt1-e1",
    title: "Le contrat au quotidien",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 150,
    support:
      "Situation \u2014 L\u00e9a, 17 ans en terminale STMG \u00e0 Nantes, une journ\u00e9e ordinaire :\n\u2014 7 h 45 : elle valide un titre de tram sur l'application « Mobilit\u00e944 » (2,20 \u20ac, trajet A\u2192lyc\u00e9e).\n\u2014 12 h 30 : menu \u00e9tudiant + boisson \u00e0 la cantine (4,80 \u20ac, ticket caisse).\n\u2014 20 h 15 : abonnement « StreamPlus Étudiant » en ligne (9,99 \u20ac/mois, case CGU coch\u00e9e).\n\nLe cours rappelle que nos journ\u00e9es sont faites de contrats : transport, vente, prestation de services.\n\nArticle 1101 du Code civil : « Le contrat est un accord de volont\u00e9s entre deux ou plusieurs personnes destin\u00e9 \u00e0 cr\u00e9er, modifier, transmettre ou \u00e9teindre des obligations. »\n\nPour chaque contrat, des obligations naissent : Mobilit\u00e944 doit transporter L\u00e9a ; L\u00e9a doit payer. Le restaurateur doit fournir le repas ; L\u00e9a doit payer le prix. La plateforme doit donner l'acc\u00e8s au service ; L\u00e9a doit respecter les conditions et payer l'abonnement.",
    consigne:
      "\u00c0 partir du support, d\u00e9finis le contrat (art. 1101), identifie trois contrats conclus par L\u00e9a et pr\u00e9cise une obligation de chaque partie pour l'un d'eux.",
    questions: [
      "Quelle est la d\u00e9finition juridique du contrat ?",
      "Cite trois contrats diff\u00e9rents conclus par L\u00e9a dans la journ\u00e9e.",
      "Pour le contrat de transport, quelle obligation pour l'op\u00e9rateur et pour L\u00e9a ?",
      "En une phrase : pourquoi dit-on que le contrat « cr\u00e9e des obligations » ?",
    ],
    correctionModele:
      "1) Contrat (art. 1101) : accord de volont\u00e9s entre au moins deux personnes pour cr\u00e9er, modifier, transmettre ou \u00e9teindre des obligations.\n\n2) Contrat de transport (tram), contrat de vente (cantine), contrat de fourniture de services num\u00e9riques (streaming).\n\n3) Transport : l'op\u00e9rateur doit acheminer L\u00e9a ; L\u00e9a doit payer le titre (2,20 \u20ac).\n\n4) Chaque partie s'engage \u00e0 ex\u00e9cuter une prestation en contrepartie de celle de l'autre.",
    attendu: "D\u00e9finition art. 1101, trois contrats rep\u00e9r\u00e9s, obligations r\u00e9ciproques expliqu\u00e9es.",
    notionsCibles: ["contrat", "accord de volont\u00e9s", "obligations"],
  },
  {
    id: "drt1-e2",
    title: "Libert\u00e9 contractuelle",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 160,
    support:
      "Hugo, 18 ans, cherche un stage en entreprise. Il peut refuser une offre, n\u00e9gocier avec un second employeur, ou ne pas signer du tout. Il finit par accepter un stage chez « LogiNord » avec une convention sign\u00e9e (dur\u00e9e, horaires, gratification).\n\nArticle 1102 du Code civil : chacun est libre de contracter ou de ne pas contracter, de choisir son cocontractant et de d\u00e9terminer le contenu et la forme du contrat dans les limites fix\u00e9es par la loi.\n\nLe cours pr\u00e9cise aussi des limites :\n\u2014 certains contrats sont impos\u00e9s (assurance automobile responsabilit\u00e9 civile) ;\n\u2014 certaines clauses sont interdites (clauses abusives en B2C) ;\n\u2014 dans un contrat d'adh\u00e9sion, une partie impose un mod\u00e8le (contrat de travail, vente en ligne avec un professionnel) : le consommateur ou le salari\u00e9 n\u00e9gocie peu les clauses.",
    consigne:
      "Explique la libert\u00e9 contractuelle (art. 1102) en t'appuyant sur le cas d'Hugo, puis pr\u00e9sente deux limites fix\u00e9es par la loi.",
    questions: [
      "Quelles libert\u00e9s Hugo exerce-t-il avant de signer ?",
      "Que dit l'article 1102 sur le contenu et la forme du contrat ?",
      "Donne un exemple de contrat impos\u00e9 par la loi.",
      "Qu'est-ce qu'un contrat d'adh\u00e9sion ? Illustre.",
    ],
    correctionModele:
      "1) Hugo choisit de contracter, avec qui, et le contenu de la convention de stage.\n\n2) Libert\u00e9 de contracter, de choisir le cocontractant, de fixer contenu/forme (dans la loi).\n\n3) Ex. assurance RC automobile obligatoire.\n\n4) Contrat pr\u00e9r\u00e9dig\u00e9 impos\u00e9 : CDI, CGV en ligne, peu de marge de n\u00e9gociation.",
    attendu: "Libert\u00e9s illustr\u00e9es, art. 1102, deux limites, adh\u00e9sion.",
    notionsCibles: ["libert\u00e9 contractuelle", "contrat d'adh\u00e9sion"],
  },
  {
    id: "drt1-e3",
    title: "Obligations de donner, faire et ne pas faire",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 170,
    support:
      "Trois situations vues en cours :\n\n1) Vente d'un v\u00e9lo d'occasion 320 \u20ac entre particuliers : le vendeur doit transf\u00e9rer la propri\u00e9t\u00e9 du v\u00e9lo \u00e0 l'acheteur (obligation de donner).\n\n2) Contrat VTC : le chauffeur s'engage \u00e0 conduire la cliente de la gare au lyc\u00e9e (obligation de faire \u2014 accomplir un acte positif).\n\n3) Cession d'un fonds de commerce de boulangerie : le vendeur signe une clause de non-concurrence : il ne rouvrira pas de boulangerie dans un rayon de 5 km pendant 3 ans (obligation de ne pas faire).\n\nLe cours distingue ces trois types selon l'action \u00e0 mener : transf\u00e9rer un bien, accomplir une prestation, ou s'abstenir d'un comportement qu'on aurait pu avoir hors contrat.",
    consigne:
      "D\u00e9finis les trois types d'obligations et associe chaque situation (1, 2, 3) au bon type. Donne une phrase d'explication pour chacune.",
    questions: [
      "D\u00e9finis obligation de donner, de faire et de ne pas faire.",
      "Quel type pour la vente du v\u00e9lo ? Pourquoi ?",
      "Quel type pour le VTC ?",
      "Quel type pour la clause de non-concurrence ?",
    ],
    correctionModele:
      "1) Donner = transf\u00e9rer un bien ou un droit ; faire = ex\u00e9cuter un acte ; ne pas faire = s'abstenir.\n\n2) V\u00e9lo = donner (transfert de propri\u00e9t\u00e9).\n\n3) VTC = faire (prestation de transport).\n\n4) Non-concurrence = ne pas faire (abstention d'ouvrir un commerce concurrent).",
    attendu: "Trois d\u00e9finitions, trois classifications justifi\u00e9es.",
    notionsCibles: ["obligation de donner", "obligation de faire", "obligation de ne pas faire"],
  },
  {
    id: "drt1-e4",
    title: "Obligation de moyens ou de r\u00e9sultat",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 200,
    support:
      "Cas A \u2014 Cabinet m\u00e9ical : le Dr Martin prescrit un traitement adapt\u00e9 \u00e0 une fracture mais ne garantit pas la gu\u00e9rison en 6 semaines. Il doit mettre en \u0153uvre tous les moyens conformes \u00e0 son art (obligation de moyens). Prouver une faute est plus difficile : il faut montrer qu'il n'a pas fait tout ce qui \u00e9tait possible.\n\nCas B \u2014 Vente d'un ordinateur 899 \u20ac : le vendeur doit livrer l'appareil conforme au mod\u00e8le command\u00e9 ; l'acheteur doit payer 899 \u20ac. Ce sont des obligations de r\u00e9sultat : le r\u00e9sultat pr\u00e9vu doit \u00eatre atteint. Si l'ordinateur n'est pas livr\u00e9, l'inex\u00e9cution est plus simple \u00e0 d\u00e9montrer.\n\nLe cours insiste : en responsabilit\u00e9 contractuelle, la qualification moyens/r\u00e9sultat change la preuve attendue du cr\u00e9ancier.",
    consigne:
      "Distingue obligation de moyens et de r\u00e9sultat. Classe les cas A et B et explique qui doit prouver quoi en cas de litige.",
    questions: [
      "D\u00e9finis obligation de moyens et de r\u00e9sultat.",
      "Pourquoi le m\u00e9decin est-il en obligation de moyens ?",
      "Pourquoi la vente est-elle en obligation de r\u00e9sultat ?",
      "Quelle diff\u00e9rence de preuve pour le client si l'ordinateur n'arrive pas ?",
    ],
    correctionModele:
      "1) Moyens = tout mettre en \u0153uvre sans garantir le but ; r\u00e9sultat = atteindre le r\u00e9sultat convenu.\n\n2) Gu\u00e9rison incertaine : pas de garantie de succ\u00e8s m\u00e9dical.\n\n3) Livraison et paiement sont des engagements pr\u00e9cis.\n\n4) Vente : simple constat de non-livraison ; m\u00e9decin : preuve d'une faute dans les moyens.",
    attendu: "D\u00e9finitions, classification A/B, diff\u00e9rence de preuve.",
    notionsCibles: ["obligation de moyens", "obligation de r\u00e9sultat"],
  },
  {
    id: "drt1-e5",
    title: "Contrat de consommation et information",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 210,
    support:
      "Sur le site « ElectroDiscount », Nina, lyc\u00e9enne, ach\u00e8te des \u00e9couteurs 59,99 \u20ac TTC affich\u00e9s avant commande. La fiche produit indique autonomie 30 h, compatibilit\u00e9 Bluetooth 5.3, garantie 2 ans. Le prix est en euros TTC ; la case « J'accepte les CGV » est obligatoire.\n\nArticle L111-1 du Code de la consommation : avant que le consommateur soit li\u00e9, le professionnel communique les caract\u00e9ristiques essentielles du bien, le prix, les modalit\u00e9s de paiement, de livraison, de garantie, etc.\n\nLe professionnel a aussi une obligation de conseil : utiliser son expertise pour orienter le client (ex. banquier qui conseille sur la dur\u00e9e d'un pr\u00eat). Nina n'est pas une professionnelle : asym\u00e9trie d'information ; le droit renforce sa protection.",
    consigne:
      "Explique pourquoi l'achat de Nina est un contrat de consommation. Pr\u00e9sente l'obligation d'information (L111-1) et l'obligation de conseil avec un exemple.",
    questions: [
      "Pourquoi s'agit-il d'un contrat de consommation ?",
      "Quelles informations essentielles ElectroDiscount doit-il donner ?",
      "Pourquoi le prix TTC et en euros est-il important ?",
      "Qu'est-ce que l'obligation de conseil ? Donne un exemple.",
    ],
    correctionModele:
      "1) Professionnel (ElectroDiscount) + consommateur (Nina, achat personnel).\n\n2) Caract\u00e9ristiques, prix, garantie, livraison, etc.\n\n3) Transparence, pas de modification du prix apr\u00e8s acceptation.\n\n4) Le pro doit orienter le client avec son expertise (ex. conseil bancaire).",
    attendu: "Consommation, information L111-1, prix, conseil.",
    notionsCibles: ["contrat de consommation", "obligation d'information", "obligation de conseil"],
  },
  {
    id: "drt1-e6",
    title: "Droit de r\u00e9tractation en ligne",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 220,
    support:
      "Tom commande un blouson 79 \u20ac sur « ModeWeb » le 3 mars. Il re\u00e7oit le colis le 8 mars, l'essaie chez lui. Le 17 mars, il envoie un formulaire de r\u00e9tractation (d\u00e9lai 14 jours pour achat de biens \u00e0 distance).\n\nArticle 1122 du Code civil : la loi ou le contrat peuvent pr\u00e9voir un d\u00e9lai de r\u00e9tractation pendant lequel le consommateur peut revenir sur son consentement.\n\nTableau du cours (extraits) :\n\u2014 Achat sur internet : 14 jours\n\u2014 D\u00e9marchage \u00e0 domicile : 14 jours\n\u2014 Cr\u00e9dit \u00e0 la consommation : 14 jours\n\u2014 Assurance-vie : 30 jours\n\nLoi Chatel (2008) : le cyberconsommateur doit \u00eatre rembours\u00e9 int\u00e9gralement ; les frais de retour restent en principe \u00e0 sa charge sauf r\u00e8gles sp\u00e9cifiques.",
    consigne:
      "D\u00e9finis le droit de r\u00e9tractation. Applique-le au cas de Tom : est-il encore dans les d\u00e9lais ? Que doit obtenir-il ?",
    questions: [
      "Qu'est-ce que le droit de r\u00e9tractation (art. 1122) ?",
      "Tom est-il dans le d\u00e9lai le 17 mars ?",
      "Quel d\u00e9lai pour un achat sur internet ?",
      "Que dit le cours sur le remboursement du cyberconsommateur ?",
    ],
    correctionModele:
      "1) D\u00e9lai pour rompre unilat\u00e9ralement le contrat (repentir).\n\n2) Oui : 14 jours \u00e0 partir de la r\u00e9ception pour achat en ligne (v\u00e9rifier point de d\u00e9part exact en cours).\n\n3) 14 jours pour achat de biens \u00e0 distance.\n\n4) Remboursement total des sommes vers\u00e9es ; retour souvent \u00e0 charge du consommateur.",
    attendu: "D\u00e9finition, application Tom, d\u00e9lai 14 j, remboursement.",
    notionsCibles: ["droit de r\u00e9tractation", "cyberconsommateur"],
  },
  {
    id: "drt1-e7",
    title: "Offre et acceptation",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 230,
    support:
      "Annonce immobili\u00e8re : « Appartement T2, 48 m\u00b2, loyer 720 \u20ac/mois charges comprises, disponible 1er septembre, dossier avec justificatifs de revenus. »\n\nKarim envoie un dossier complet le 12 juin. Le bailleur r\u00e9pond le 18 juin : « J'accepte votre candidature, contrat \u00e0 signer avant le 25 juin. » Karim signe le bail le 22 juin.\n\nLe cours :\n\u2014 L'offre est la proposition de conclure un contrat (ferme, pr\u00e9cise, avec \u00e9l\u00e9ments essentiels).\n\u2014 Elle est r\u00e9vocable tant qu'elle n'est pas accept\u00e9e.\n\u2014 L'acceptation manifeste l'accord ; le contrat est conclu quand l'offreur a connaissance de l'acceptation.\n\u2014 Offre expresse (\u00e9crite) ou tacite (ex. taxi en station).",
    consigne:
      "Reconstitue la formation du contrat de bail : qui fait l'offre ? quand l'acceptation ? \u00e0 quel moment le contrat est-il conclu ?",
    questions: [
      "Qu'est-ce qu'une offre ? L'annonce est-elle une offre au public ?",
      "Quand Karim envoie-t-il une acceptation ?",
      "Quand le contrat est-il form\u00e9 selon le cours ?",
      "Pourquoi l'offre est-elle r\u00e9vocable avant acceptation ?",
    ],
    correctionModele:
      "1) Proposition ferme et pr\u00e9cise de contracter.\n\n2) L'annonce peut viser le public ; l'acceptation du bailleur vise Karim.\n\n3) R\u00e9ponse du bailleur le 18 juin = acceptation ; contrat conclu \u00e0 sa connaissance.\n\n4) L'offreur n'est pas li\u00e9 tant qu'il n'y a pas acceptation.",
    attendu: "Offre, acceptation, moment de formation, r\u00e9vocation.",
    notionsCibles: ["offre", "acceptation", "formation du contrat"],
  },
  {
    id: "drt1-e8",
    title: "Vices du consentement",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 260,
    minChars: 240,
    support:
      "Article 1130 du Code civil : l'erreur, le dol et la violence vicient le consentement lorsqu'ils sont de nature \u00e0 faire contracter diff\u00e9remment. Article 1131 : vices du consentement = nullit\u00e9 relative.\n\nErreur (art. 1132) : fausse repr\u00e9sentation sur la nature du contrat ou l'objet ; doit \u00eatre excusable et d\u00e9terminante.\n\nDol (art. 1137) : man\u0153uvres ou mensonges pour obtenir le consentement ; dissimulation intentionnelle d'une information d\u00e9terminante.\n\nViolence (art. 1140) : pression inspirant la crainte d'un mal consid\u00e9rable pour la personne, sa fortune ou ses proches. La menace d'une voie de droit n'est en principe pas une violence.\n\nExemple cours : acheter un v\u00e9hicule en croyant qu'il a 50 000 km (erreur sur l'objet) ; vendeur qui cache un vice m\u00e9canique (dol) ; signature sous menace physique (violence).",
    consigne:
      "D\u00e9finis erreur, dol et violence. Pour chaque exemple du paragraphe final, indique le vice en jeu et la sanction.",
    questions: [
      "D\u00e9finis erreur, dol et violence.",
      "Quel vice si le compteur kilom\u00e9trique est faux sans mensonge du vendeur ?",
      "Quel vice si le vendeur cache un vice m\u00e9canique ?",
      "Quelle sanction commune (art. 1131) ?",
    ],
    correctionModele:
      "1) Erreur = se tromper ; dol = tromper ; violence = contraindre.\n\n2) Erreur sur l'objet (si d\u00e9terminante).\n\n3) Dol (dissimulation).\n\n4) Nullit\u00e9 relative.",
    attendu: "Trois vices, application, nullit\u00e9 relative.",
    notionsCibles: ["erreur", "dol", "violence", "nullit\u00e9 relative"],
  },
  {
    id: "drt1-e9",
    title: "Capacit\u00e9 et nullit\u00e9",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 260,
    support:
      "Article 1145 : toute personne physique peut contracter sauf incapacit\u00e9 pr\u00e9vue par la loi. Il faut capacit\u00e9 de jouissance et capacit\u00e9 d'exercice.\n\nSituation : Yasmine, 17 ans non \u00e9mancip\u00e9e, souscrit seule un cr\u00e9dit \u00e0 la consommation 1 200 \u20ac pour un ordinateur portable, sans accord de ses parents. La banque « Cr\u00e9ditPlus » valide le dossier en ligne.\n\nLe cours rappelle : mineur non \u00e9mancip\u00e9, majeur sous tutelle ou curatelle peuvent \u00eatre incapables d'exercer seuls. Contrat avec personne incapable : nullit\u00e9 relative (prot\u00e8ge l'int\u00e9r\u00eat des parties), pas l'ordre public absolu.\n\nAutre exemple : personne condamn\u00e9e pour fraudes commerciales peut \u00eatre interdite de signer certains contrats de soci\u00e9t\u00e9.",
    consigne:
      "Explique la capacit\u00e9 \u00e0 contracter. Analyse le contrat de Yasmine : capacit\u00e9, nullit\u00e9, cons\u00e9quences possibles.",
    questions: [
      "Qu'est-ce que la capacit\u00e9 \u00e0 contracter (art. 1145) ?",
      "Yasmine a-t-elle la capacit\u00e9 de signer seule ce cr\u00e9dit ?",
      "Quelle nullit\u00e9 et pourquoi « relative » ?",
      "Que peut demander Yasmine ou ses parents ?",
    ],
    correctionModele:
      "1) Aptitude \u00e0 \u00eatre titulaire de droits et \u00e0 les exercer seul.\n\n2) Non : mineure non \u00e9mancip\u00e9e.\n\n3) Nullit\u00e9 relative (int\u00e9r\u00eat de la mineure).\n\n4) Annulation du contrat, restitutions possibles.",
    attendu: "Capacit\u00e9, incapacit\u00e9 mineure, nullit\u00e9 relative, recours.",
    notionsCibles: ["capacit\u00e9", "nullit\u00e9 relative"],
  },
  {
    id: "drt1-e10",
    title: "Objet et cause du contrat",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 300,
    support:
      "Article 1128 : validit\u00e9 exige consentement, capacit\u00e9, contenu licite et certain (objet + cause).\n\nObjet du contrat : la prestation promise. Cinq conditions du cours : exister ou \u00eatre futur ; \u00eatre dans le commerce ; \u00eatre licite ; \u00eatre d\u00e9termin\u00e9 ou d\u00e9terminable ; \u00eatre possible (\u00ab \u00e0 l'impossible nul n'est tenu \u00bb).\n\nCause : le motif pour lequel on contracte ; doit \u00eatre licite et morale.\n\nExemples :\n\u2014 Vente d'appartement sur plan (objet futur, licite).\n\u2014 Vente de stup\u00e9fiants (objet illicite) \u2192 nullit\u00e9 absolue.\n\u2014 Achat d'un local pour ouvrir un jeu ill\u00e9gal (cause illicite) \u2192 nullit\u00e9 absolue.\n\nNullit\u00e9 absolue = atteinte \u00e0 l'ordre public ; nullit\u00e9 relative = int\u00e9r\u00eat des parties (vices du consentement, incapacit\u00e9).",
    consigne:
      "Pr\u00e9sente les conditions de l'objet et de la cause. Applique aux deux exemples illicites et compare nullit\u00e9 absolue et relative.",
    questions: [
      "Cite quatre conditions que doit respecter l'objet.",
      "Qu'est-ce que la cause du contrat ?",
      "Pourquoi la vente de stup\u00e9fiants entra\u00eene une nullit\u00e9 absolue ?",
      "Diff\u00e9rence nullit\u00e9 absolue / relative ?",
    ],
    correctionModele:
      "1) Ex. licite, d\u00e9termin\u00e9, possible, dans le commerce, existant/futur.\n\n2) Motif licite et moral de contracter.\n\n3) Objet contraire \u00e0 l'ordre public.\n\n4) Absolue = int\u00e9r\u00eat g\u00e9n\u00e9ral ; relative = int\u00e9r\u00eat des parties.",
    attendu: "Objet, cause, illicite, deux nullit\u00e9s.",
    notionsCibles: ["objet du contrat", "cause", "nullit\u00e9 absolue"],
  },
  {
    id: "drt1-cas1",
    title: "\u00c9tude de cas : achat de smartphone en ligne",
    type: "Etude de cas",
    difficulty: "Difficile",
    xp: 560,
    minChars: 500,
    support:
      "Enora, 19 ans, \u00e9tudiante, commande sur « TechZone » un smartphone 899 \u20ac TTC (fiche : 128 Go, garantie 2 ans, livraison 3-5 jours). Elle coche « J'accepte les CGV ». Colis re\u00e7u le 12 avril. Le 20 avril, elle envoie une r\u00e9tractation (produit d\u00e9ball\u00e9 mais non utilis\u00e9 selon elle).\n\nTechZone refuse le remboursement et invoque une clause en bas de page des CGV : « Tout produit dont l'emballage est ouvert est non repris. »\n\nEnora avait aussi tent\u00e9 un paiement en 4x sans frais ; la banque a refus\u00e9 car elle est mineure sans autorisation parentale (cr\u00e9dit non conclu).\n\nRappels cours : contrat de consommation (pro + consommateur) ; droit de r\u00e9tractation 14 jours achat en ligne ; art. L212-1 clauses abusives ; obligation d'information L111-1.",
    consigne:
      "R\u00e9dige une note structur\u00e9e : (1) qualification du contrat, (2) droit de r\u00e9tractation \u00e0 la date du 20 avril, (3) validit\u00e9 de la clause d'exclusion de retour, (4) conseils concrets \u00e0 Enora (recours, preuves).",
    questions: [
      "Contrat de consommation : pourquoi ?",
      "Enora peut-elle se r\u00e9tracter le 20 avril ?",
      "La clause « emballage ouvert » est-elle valable ?",
      "Quels recours et quelles preuves conseiller ?",
    ],
    correctionModele:
      "1) TechZone pro, Enora consommateur (achat personnel).\n\n2) Oui : 14 jours pour achat \u00e0 distance (v\u00e9rifier date de d\u00e9part).\n\n3) Probablement abusive : d\u00e9s\u00e9quilibre significatif.\n\n4) M\u00e9diation conso, signalement, LRAR, capture \u00e9cran commande.",
    attendu: "Note structur\u00e9e en quatre parties argument\u00e9es.",
    notionsCibles: ["contrat de consommation", "r\u00e9tractation", "clause abusive"],
  },
  {
    id: "drt1-cas2",
    title: "\u00c9tude de cas : signature sous pression",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 550,
    support:
      "Marc, 42 ans, veut ouvrir une franchise « Café Express ». Le franchisor lui impose un contrat de 80 pages. Lors de la r\u00e9union du 5 mai, le responsable d\u00e9clare : « Si tu ne signes pas ce soir, l'emplacement rue Centrale part \u00e0 un concurrent ; ta femme et toi perdrez votre apport de 45 000 \u20ac. » Marc signe \u00e0 22 h.\n\nEn relisant le contrat, il d\u00e9couvre des redevances publicitaires de 8 % du CA non mentionn\u00e9es \u00e0 l'oral, et une exclusivité d'approvisionnement auprès de filiales du groupe.\n\nArticles utiles : 1130-1131 (vices du consentement, nullit\u00e9 relative), 1137 (dol), 1140-1141 (violence, menace voie de droit d\u00e9tourn\u00e9e). Contrat d'adh\u00e9sion : peu de n\u00e9gociation.",
    consigne:
      "Analyse les vices du consentement possibles (erreur, dol, violence). Le contrat peut-il \u00eatre annul\u00e9 ? Quelles demandes au juge ? Structure en plan num\u00e9rot\u00e9.",
    questions: [
      "Y a-t-il une violence morale (art. 1140) ? Argumente.",
      "Y a-t-il un dol (art. 1137) ? Quels faits ?",
      "Quelle nullit\u00e9 et quelles cons\u00e9quences ?",
      "Que peut demander Marc (annulation, dommages) ?",
    ],
    correctionModele:
      "1) Pression morale : crainte pour fortune / proches, signature imm\u00e9diate.\n\n2) Dol : redevances et exclusivit\u00e9 non d\u00e9voil\u00e9es, d\u00e9terminantes.\n\n3) Nullit\u00e9 relative.\n\n4) Action en nullit\u00e9, dommages-int\u00e9r\u00eats si faute prouv\u00e9e.",
    attendu: "Plan structur\u00e9, vices analys\u00e9s, demandes au juge.",
    notionsCibles: ["dol", "violence", "nullit\u00e9 relative", "contrat d'adh\u00e9sion"],
  },
];
