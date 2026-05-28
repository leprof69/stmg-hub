import type { DroitMissionExercise } from "../types";

export const DROIT_CHAP2_EXERCISES: DroitMissionExercise[] = [
  {
    id: "drt2-e1",
    title: "Force obligatoire du contrat",
    type: "Exercice",
    difficulty: "Facile",
    xp: 120,
    minChars: 150,
    support:
      "Situation \u2014 Sarah, salari\u00e9e chez \u00ab MediPrint \u00bb, a sign\u00e9 un CDI \u00e0 temps plein (35 h/semaine, horaires 9 h\u201317 h).\nEn mars, sa manager lui impose unilat\u00e9ralement des permanences jusqu'\u00e0 20 h sans avenant ni accord \u00e9crit. Sarah refuse : elle invoque le contrat initial.\n\nArticle 1103 : les contrats l\u00e9galement form\u00e9s tiennent lieu de loi \u00e0 ceux qui les ont faits.\nArticle 1193 : les contrats ne peuvent \u00eatre modifi\u00e9s ou r\u00e9voqu\u00e9s que du consentement mutuel des parties, ou pour les causes que la loi autorise.\n\nLe cours : une fois le contrat conclu, chaque partie doit l'ex\u00e9cuter ; aucune ne peut modifier seule les obligations (horaires, r\u00e9mun\u00e9ration, prestation).",
    consigne:
      "Explique la force obligatoire (art. 1103) et l'article 1193. Applique au cas de Sarah : la manager peut-elle imposer seule les nouveaux horaires ? Quelle solution juridique pour les modifier ?",
    questions: [
      "Qu'est-ce que la force obligatoire ?",
      "Que dit l'article 1193 ?",
      "La manager peut-elle modifier seule les horaires ?",
      "Quelle solution pour changer les horaires l\u00e9galement ?",
    ],
    correctionModele:
      "1) Contrat = loi des parties.\n\n2) Modification/r\u00e9vocation seulement par accord mutuel ou causes l\u00e9gales.\n\n3) Non : modification unilat\u00e9rale interdite.\n\n4) Avenant sign\u00e9, accord collectif ou voies sp\u00e9cifiques au droit du travail.",
    attendu: "Force obligatoire, art. 1193, exemple.",
    notionsCibles: ["force obligatoire"],
  },
  {
    id: "drt2-e2",
    title: "Bonne foi dans l'ex\u00e9cution",
    type: "Exercice",
    difficulty: "Facile",
    xp: 130,
    minChars: 160,
    support:
      "Article 1104 : les contrats doivent \u00eatre n\u00e9goci\u00e9s, form\u00e9s et ex\u00e9cut\u00e9s de bonne foi.\n\nSituation \u2014 Paul, comptable chez \u00ab B\u00e2tirPro \u00bb, doit utiliser le logiciel de paie et les tableurs de l'entreprise. Il refuse d'ouvrir l'ordinateur et demande que tout soit fait sur papier, ce qui retarde les d\u00e9clarations URSSAF de 3 semaines. Le service RH estime qu'il entrave volontairement l'ex\u00e9cution du contrat.\n\nBonne foi = honn\u00eatet\u00e9, loyaut\u00e9, coop\u00e9ration : faciliter l'ex\u00e9cution par le cocontractant. Mauvaise foi = comportement qui complique d\u00e9lib\u00e9r\u00e9ment l'autre partie.",
    consigne:
      "D\u00e9finis la bonne foi (art. 1104). Paul est-il de bonne ou mauvaise foi ? Justifie avec le cours et le support.",
    questions: [
      "Que signifie ex\u00e9cuter de bonne foi ?",
      "Le comptable est-il de mauvaise foi ?",
      "Quelles qualit\u00e9s attendues ?",
    ],
    correctionModele: "1) Honn\u00eatet\u00e9, loyaut\u00e9, coop\u00e9ration.\n\n2) Oui : entrave volontaire \u00e0 l'ex\u00e9cution.\n\n3) Faciliter le travail de l'autre partie.",
    attendu: "D\u00e9finition, application comptable.",
    notionsCibles: ["bonne foi"],
  },
  {
    id: "drt2-e3",
    title: "Effet relatif et stipulation pour autrui",
    type: "Exercice",
    difficulty: "Facile",
    xp: 140,
    minChars: 170,
    support:
      "Article 1165 : les conventions n'ont d'effet qu'entre les parties contractantes ; elles ne nuisent point au tiers.\n\nM. Dupont est li\u00e9 par un contrat de travail avec son employeur. Malade, il ne peut pas travailler : l'employeur ne peut pas exiger que Mme Dupont (son \u00e9pouse) remplace son mari au bureau \u2014 elle n'est pas partie au contrat.\n\nException \u2014 Article 1205 : stipulation pour autrui. Exemple assurance-vie : le souscripteur (stipulant) obtient du assureur (promettant) une prestation au profit d'un b\u00e9n\u00e9ficiaire tiers. Le b\u00e9n\u00e9ficiaire peut accepter ou refuser ; s'il accepte, l'op\u00e9ration devient d\u00e9finitive.",
    consigne:
      "Explique l'effet relatif (art. 1165) avec l'exemple Dupont. Pr\u00e9sente la stipulation pour autrui (art. 1205) et l'exemple assurance-vie.",
    questions: [
      "Qu'est-ce que l'effet relatif ?",
      "Pourquoi l'\u00e9pouse ne peut remplacer le mari malade au travail ?",
      "Exemple stipulation pour autrui ?",
    ],
    correctionModele: "1) Contrat lie seulement les signataires.\n\n2) Madame Dupont n'est pas partie au contrat de travail.\n\n3) Assurance-vie : b\u00e9n\u00e9ficiaire cr\u00e9ancier sans avoir sign\u00e9.",
    attendu: "Effet relatif, exception assurance.",
    notionsCibles: ["effet relatif", "stipulation pour autrui"],
  },
  {
    id: "drt2-e4",
    title: "Exception d'inex\u00e9cution",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 180,
    minChars: 200,
    support:
      "Contrat synallagmatique : chaque partie doit une prestation en \u00e9change de celle de l'autre.\n\nSituation \u2014 \u00ab LogiSud \u00bb emploie M. Z. Contrat : salaire mensuel contre travail. M. Z. part en vacances sans pr\u00e9venir ni donner de nouvelles depuis 4 semaines. L'entreprise suspend le versement des salaires en invoquant l'exception d'inex\u00e9cution : tant que M. Z. n'ex\u00e9cute pas son travail, l'employeur ne paie pas.\n\nLe cr\u00e9ancier doit prouver l'inex\u00e9cution du d\u00e9biteur. Exception au principe de la force obligatoire : on ne peut pas compenser unilat\u00e9ralement sans texte.",
    consigne:
      "D\u00e9finis contrat synallagmatique et exception d'inex\u00e9cution. Le non-paiement des salaires est-il l\u00e9gal ici ? Qui doit prouver quoi ?",
    questions: [
      "Qu'est-ce qu'un contrat synallagmatique ?",
      "Pourquoi suspendre les salaires ?",
      "Que doit prouver l'employeur ?",
    ],
    correctionModele: "1) Prestations r\u00e9ciproques.\n\n2) Refuser sa propre prestation tant que l'autre n'a pas ex\u00e9cut\u00e9.\n\n3) Inex\u00e9cution du salari\u00e9.",
    attendu: "Synallagmatique, exception, preuve.",
    notionsCibles: ["exception d'inex\u00e9cution"],
  },
  {
    id: "drt2-e5",
    title: "Mise en demeure",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 190,
    minChars: 210,
    support:
      "La mise en demeure est l'acte par lequel le cr\u00e9ancier exige l'ex\u00e9cution du contrat et constate le retard du d\u00e9biteur.\n\nSituation \u2014 \u00ab EcoLoc \u00bb, loueur de mat\u00e9riel BTP, a livr\u00e9 une nacelle avec 12 jours de retard. Le client \u00ab Chantier+ \u00bb envoie une lettre recommand\u00e9e avec AR le 8 juin : \u00ab Ex\u00e9cutez sous 8 jours faute de quoi nous engagerons des poursuites. \u00bb Les int\u00e9r\u00eats moratoires peuvent commencer \u00e0 courir.\n\nFormes possibles : lettre simple, LRAR, e-mail, mise en demeure par huissier, citation en justice. \u00c9tape pr\u00e9alable \u00e0 l'ex\u00e9cution forc\u00e9e devant le juge.",
    consigne:
      "D\u00e9finis la mise en demeure. Reconstitue la d\u00e9marche d'EcoLoc et explique son lien avec l'ex\u00e9cution forc\u00e9e.",
    questions: [
      "Qu'est-ce qu'une mise en demeure ?",
      "Quelles formes possibles ?",
      "Quel lien avec l'ex\u00e9cution forc\u00e9e ?",
    ],
    correctionModele: "1) Demande formelle d'ex\u00e9cuter.\n\n2) LRAR, mail, citation, huissier.\n\n3) \u00c9tape pr\u00e9alable \u00e0 contraindre le d\u00e9biteur.",
    attendu: "D\u00e9finition, formes, lien ex\u00e9cution forc\u00e9e.",
    notionsCibles: ["mise en demeure"],
  },
  {
    id: "drt2-e6",
    title: "Ex\u00e9cution forc\u00e9e : saisie et astreinte",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 210,
    minChars: 220,
    support:
      "Ex\u00e9cution forc\u00e9e : le cr\u00e9ancier demande au juge de contraindre le d\u00e9biteur.\n\nTypes (cours) :\n\u2014 Ex\u00e9cution en nature / saisie (obligation de donner) : saisie conservatoire, saisie-vente de biens meubles, saisie immobili\u00e8re, saisie-arr\u00eat sur salaires.\n\u2014 Astreinte (obligation de faire / ne pas faire encore possible) : somme par jour de retard, parfois pr\u00e9vue au contrat.\n\u2014 Ex\u00e9cution par \u00e9quivalent / dommages-int\u00e9r\u00eats (obligation de faire impossible) : indemniser le pr\u00e9judice.\n\nExemple : loueur qui ne rend pas la caution 800 \u20ac apr\u00e8s \u00e9tat des lieux \u2014 saisie possible sur compte bancaire apr\u00e8s jugement.",
    consigne:
      "Compare les trois types d'ex\u00e9cution forc\u00e9e du cours. Donne un exemple pour chacun.",
    questions: [
      "Quand une saisie ?",
      "Qu'est-ce qu'une astreinte ?",
      "Ex\u00e9cution par \u00e9quivalent si ?",
    ],
    correctionModele: "1) Obligation de donner.\n\n2) Sanction p\u00e9cuniaire quotidienne.\n\n3) Obligation de faire/de ne pas faire impossible.",
    attendu: "Saisie, astreinte, dommages-int\u00e9r\u00eats.",
    notionsCibles: ["ex\u00e9cution forc\u00e9e", "astreinte"],
  },
  {
    id: "drt2-e7",
    title: "Clause r\u00e9solutoire et clause p\u00e9nale",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 230,
    minChars: 230,
    support:
      "Clauses particuli\u00e8res anticip\u00e9es \u00e0 la signature :\n\n\u2014 Clause r\u00e9solutoire : si une partie n'ex\u00e9cute pas, le contrat est r\u00e9solu r\u00e9troactivement (restitutions).\n\u2014 Clause p\u00e9nale (stipulation de p\u00e9nalit\u00e9) : montant d'indemnit\u00e9 fix\u00e9 d'avance en cas de retard ou inex\u00e9cution.\n\u2014 Clause compromissoire : renvoi du litige \u00e0 un arbitre.\n\nExemple location : clause r\u00e9solutoire pour loyers impay\u00e9s apr\u00e8s mise en demeure ; clause p\u00e9nale de 50 \u20ac/jour de retard de livraison en BTP.",
    consigne:
      "D\u00e9finis clause r\u00e9solutoire, clause p\u00e9nale et clause compromissoire. Pour chacune, indique quand elle s'applique.",
    questions: [
      "Effet clause r\u00e9solutoire ?",
      "Effet clause p\u00e9nale ?",
      "Pourquoi les pr\u00e9voir \u00e0 l'avance ?",
    ],
    correctionModele: "1) Fin du contrat, restitutions.\n\n2) Indemnit\u00e9 forfaitaire.\n\n3) Anticiper les litiges.",
    attendu: "Deux clauses compar\u00e9es.",
    notionsCibles: ["clause r\u00e9solutoire", "clause p\u00e9nale"],
  },
  {
    id: "drt2-e8",
    title: "Clauses abusives",
    type: "Exercice",
    difficulty: "Moyen",
    xp: 260,
    minChars: 240,
    support:
      "Article L212-1 Code de la consommation : clause abusive = d\u00e9s\u00e9quilibre significatif au d\u00e9triment du consommateur.\n\nExemples cours :\n\u2014 Le professionnel seul peut attester la conformit\u00e9 du produit (emp\u00eache le client de contester).\n\u2014 Contrat de travail : tenue vestimentaire impos\u00e9e sans lien avec la t\u00e2che.\n\nSanction : clause r\u00e9put\u00e9e non \u00e9crite \u2014 le contrat continue, mais la clause dispara\u00eet.",
    consigne:
      "D\u00e9finis clause abusive (L212-1). Analyse les deux exemples du support et pr\u00e9cise la sanction.",
    questions: [
      "D\u00e9finition clause abusive ?",
      "Exemple dans un contrat de consommation ?",
      "Le contrat dispara\u00eet-il enti\u00e8rement ?",
    ],
    correctionModele: "1) D\u00e9s\u00e9quilibre significatif.\n\n2) Ex. attestation unilat\u00e9rale de qualit\u00e9.\n\n3) Clause r\u00e9put\u00e9e non \u00e9crite, contrat subsiste.",
    attendu: "D\u00e9finition, exemple, non \u00e9crit.",
    notionsCibles: ["clause abusive"],
  },
  {
    id: "drt2-e9",
    title: "R\u00e9solution et r\u00e9siliation",
    type: "Exercice",
    difficulty: "Difficile",
    xp: 280,
    minChars: 260,
    support:
      "R\u00e9solution vs r\u00e9siliation (cours) :\n\nR\u00e9solution \u2014 an\u00e9antissement r\u00e9troactif pour inex\u00e9cution : restitutions (biens rendus, sommes rembours\u00e9es). Ex. vente d'ordinateur non livr\u00e9 un mois apr\u00e8s la date : l'acheteur demande r\u00e9solution et remboursement.\n\nR\u00e9siliation \u2014 fin du contrat \u00e0 une date pour contrats \u00e0 ex\u00e9cution successive. Ex. forfait mobile : on arr\u00eate de payer, l'op\u00e9rateur coupe l'acc\u00e8s ; pas de remboursement r\u00e9troactif global comme une r\u00e9solution.",
    consigne:
      "Ne confonds pas r\u00e9solution et r\u00e9siliation. D\u00e9finis chaque notion et illustre avec les exemples du support.",
    questions: [
      "R\u00e9solution : quand et effet ?",
      "R\u00e9siliation : quand et effet ?",
      "Exemple de chaque ?",
    ],
    correctionModele: "1) Inex\u00e9cution, retour en arri\u00e8re.\n\n2) Contrat successif, fin simple.\n\n3) Vente vs abonnement t\u00e9l\u00e9com.",
    attendu: "Deux notions, deux exemples.",
    notionsCibles: ["r\u00e9solution", "r\u00e9siliation"],
  },
  {
    id: "drt2-e10",
    title: "Synth\u00e8se ex\u00e9cution et bonne foi",
    type: "Exercice",
    difficulty: "Tres difficile",
    xp: 360,
    minChars: 300,
    support:
      "Synth\u00e8se \u2014 Bail commercial \u00ab LocaBureau \u00bb : locataire \u00ab StartUp Lab \u00bb constate une panne de chaudi\u00e8re depuis 10 jours (locaux \u00e0 14 \u00b0C). Le bail pr\u00e9voit l'entretien des \u00e9quipements par le bailleur.\nLe bailleur r\u00e9pond qu'il est en cong\u00e9s. StartUp Lab envoie une mise en demeure LRAR le 2 octobre, invoque une clause r\u00e9solutoire et une clause p\u00e9nale de 80 \u20ac/jour. Il fait r\u00e9parer par un chauffagiste (420 \u20ac) le 5 octobre.\n\nArticles 1103, 1104, mise en demeure, ex\u00e9cution forc\u00e9e, clauses du contrat.",
    consigne:
      "R\u00e9dige un plan d'action pour le locataire : force obligatoire, bonne foi, mise en demeure, clauses, recours (r\u00e9paration par tiers, dommages). Structure num\u00e9rot\u00e9e.",
    questions: [
      "Quelle obligation du bailleur ?",
      "Mise en demeure utile ?",
      "Recours possible ?",
    ],
    correctionModele: "1) Ex\u00e9cuter les engagements (chauffage).\n\n2) Oui, constate retard.\n\n3) R\u00e9paration, dommages, r\u00e9duction de loyer selon cas.",
    attendu: "Obligations, mise en demeure, recours.",
    notionsCibles: ["force obligatoire", "mise en demeure"],
  },
  {
    id: "drt2-cas1",
    title: "\u00c9tude de cas : livraison retard\u00e9e B2B",
    type: "Etude de cas",
    difficulty: "Difficile",
    xp: 560,
    minChars: 500,
    support:
      "\u00c9tude \u2014 \u00ab EventPro \u00bb loue 200 chaises (4 800 \u20ac) \u00e0 \u00ab Mariage2025 \u00bb pour le 14 juin, livraison imp\u00e9rative le 12 juin \u00e0 18 h.\nLe 12 juin \u00e0 22 h, seules 120 chaises arrivent. Le 13 juin, 80 chaises suppl\u00e9mentaires. Mariage2025 loue en urgence 80 chaises ailleurs (620 \u20ac).\n\nContrat B2B avec clause p\u00e9nale : 100 \u20ac/jour de retard. EventPro invoque une gr\u00e8ve du transporteur r\u00e9gionale (24\u201325 mai). La force majeure n'est pas automatique en responsabilit\u00e9 contractuelle classique.\n\nArticles 1103, 1104, 1231-1, clause p\u00e9nale, dommages-int\u00e9r\u00eats.",
    consigne:
      "Note pour Mariage2025 : (1) inex\u00e9cution, (2) clause p\u00e9nale, (3) dommages (location urgence), (4) la gr\u00e8ve transport exon\u00e8re-t-elle EventPro ? Argumente.",
    questions: [
      "Contrat tenait lieu de loi ?",
      "Clause p\u00e9nale applicable ?",
      "Gr\u00e8ve transport = exon\u00e9ration ?",
    ],
    correctionModele: "1) Oui art. 1103.\n\n2) Oui si pr\u00e9vue.\n\n3) D\u00e9bat : tiers possible mais pas automatique en contractuel.",
    attendu: "Force obligatoire, p\u00e9nale, tiers.",
    notionsCibles: ["clause p\u00e9nale", "inex\u00e9cution"],
  },
  {
    id: "drt2-cas2",
    title: "\u00c9tude de cas : forfait mobile r\u00e9sili\u00e9",
    type: "Etude de cas",
    difficulty: "Tres difficile",
    xp: 620,
    minChars: 550,
    support:
      "\u00c9tude \u2014 Clara r\u00e9silie son forfait \u00ab TelMob \u00bb 24,99 \u20ac/mois le 1er f\u00e9vrier (fin \u00e0 fin f\u00e9vrier). En mars et avril, des pr\u00e9l\u00e8vements continuent.\nCGV : reconduction tacite 24 mois, r\u00e9siliation possible seulement par courrier papier en recommand\u00e9 adress\u00e9 \u00e0 un centre en Belgique. Clause en 6 pt, fond gris.\n\nClara est consommatrice. Art. L212-1 clauses abusives. Art. 1193 : modification unilat\u00e9rale interdite. M\u00e9diation consommation, r\u00e9clamation op\u00e9rateur, preuves (captures, relev\u00e9s bancaires).",
    consigne:
      "Analyse : r\u00e9siliation vs reconduction, clause abusive, recours de Clara. Plan conseil juridique d\u00e9taill\u00e9.",
    questions: [
      "R\u00e9siliation ou r\u00e9solution ?",
      "Clause 24 mois abusive ?",
      "Recours Cl\u00e9mence ?",
    ],
    correctionModele: "1) R\u00e9siliation (ex\u00e9cution successive).\n\n2) Probablement abusive (d\u00e9s\u00e9quilibre).\n\n3) M\u00e9diation, r\u00e9clamation, DGCCRF.",
    attendu: "R\u00e9siliation, abus, recours.",
    notionsCibles: ["r\u00e9siliation", "clause abusive"],
  },
];
