/** M\u00eame logique que src/lib/integrateDsQuestion.ts (export PDF hors bundle). */

function normalizeDsText(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2019]/g, "'");
}

const THEMED_SITUATIONS = [
  {
    match: (t) => /reseau social d'entreprise|\brse\b/.test(t),
    situation:
      "DataFlow d\u00e9ploie un r\u00e9seau social d'entreprise (RSE) sur son intranet : groupes par m\u00e9tier, fil du PDG, charte d'utilisation. Le DRH \u00e9value l'effet sur la communication interne.",
  },
  {
    match: (t) => /intranet|outil collaboratif|communication interne/.test(t),
    situation:
      "DataFlow met en place un intranet et des espaces collaboratifs pour 400 salari\u00e9s sur deux sites.",
  },
  {
    match: (t) =>
      /intelligence artificielle|\bia\b|automatise|automatisation/.test(t) &&
      !/reseau social/.test(t),
    situation:
      "DataFlow teste l'automatisation du tri des demandes SAV par IA et chiffre les risques num\u00e9riques avant g\u00e9n\u00e9ralisation.",
  },
  {
    match: (t) => /rgpd|donnee personnelle|consentement/.test(t),
    situation:
      "DataFlow stocke des e-mails clients nominatifs ; le DPO alerte sur le consentement et la conformit\u00e9 RGPD.",
  },
  {
    match: (t) => /open data|data\.gouv/.test(t),
    situation:
      "DataFlow compare des jeux open data publics et des donn\u00e9es clients pour un projet d'\u00e9tude.",
  },
  {
    match: (t) => /pgi|erp|processus|evenement declencheur|evenement-resultat/.test(t),
    situation:
      "DataFlow mod\u00e9lise son processus commande, pr\u00e9paration et exp\u00e9dition dans un PGI.",
  },
  {
    match: (t) => /identite numerique|e-reputation|linkedin|bad buzz/.test(t),
    situation:
      "Un recruteur de DataFlow consulte le profil public d'un candidat et rep\u00e8re une publication sensible.",
  },
  {
    match: (t) => /valeur ajoutee|consommations intermediaires/.test(t),
    situation:
      "GreenWave publie son compte de r\u00e9sultat et doit analyser la valeur ajout\u00e9e \u00e0 partir du CA et des CI.",
  },
  {
    match: (t) => /marge commerciale|prix d'achat|prix de vente|cout de revient|taux de marge/.test(t),
    situation:
      "Prix & Marge compare en rayon le prix d'achat, le prix de vente et la marge unitaire d'une r\u00e9f\u00e9rence.",
  },
  {
    match: (t) => /prix ttc|prix ht|\bttc\b|\bht\b|tva/.test(t),
    situation:
      "La comptabilit\u00e9 de Prix & Marge re\u00e7oit un prix TTC (TVA 20 %) et doit retrouver le HT.",
  },
  {
    match: (t) => /rentabilite financiere|profitabilite|part de marche|resultat net/.test(t),
    situation:
      "Helios communique ses r\u00e9sultats : le comit\u00e9 compare rentabilit\u00e9, profitabilit\u00e9 et part de march\u00e9.",
  },
  {
    match: (t) => /efficacite|efficience|performance globale|indicateur de performance/.test(t),
    situation:
      "Helios arbitre entre objectifs commerciaux, financiers, sociaux et environnementaux (performance globale).",
  },
  {
    match: (t) => /qvct|qualite de vie|conditions de travail|teletravail|ergonomie|eclairage/.test(t),
    situation:
      "NovaRetail organise un comit\u00e9 QVCT apr\u00e8s des signalements sur la p\u00e9nibilit\u00e9 en r\u00e9serve.",
  },
  {
    match: (t) => /equite interne|equite externe|remuneration|prime|grille d'evaluation/.test(t),
    situation:
      "NovaRetail compare salaires internes et r\u00e9mun\u00e9rations du march\u00e9 pour un m\u00eame poste.",
  },
  {
    match: (t) => /style de management|autocratique|consultatif|participatif|influence|manipulation/.test(t),
    situation:
      "Chez NovaRetail, un manager doit trancher sur son mode de d\u00e9cision et d'influence.",
  },
  {
    match: (t) => /association|objet social|dividende|actionnaire|cse|ago|pdg/.test(t),
    situation:
      "Une organisation revoit sa gouvernance : r\u00f4le des actionnaires, du personnel \u00e9lu et des parties prenantes.",
  },
  {
    match: (t) => /valeur percue|influenceur|image de marque/.test(t),
    situation:
      "GreenWave subit une critique virale sur les r\u00e9seaux ; l'\u00e9quipe marketing analyse la valeur per\u00e7ue.",
  },
  {
    match: (t) => /valeur boursiere|cours action|capitaux propres/.test(t) && !/actif du bilan/.test(t),
    situation:
      "GreenWave suit l'\u00e9volution de sa valeur boursi\u00e8re et de ses capitaux propres en Bourse.",
  },
  {
    match: (t) => /capitaux propres.*actif|actif.*capitaux propres/.test(t),
    situation:
      "En cours de STMG, un \u00e9l\u00e8ve pr\u00e9sente un bilan o\u00f9 les capitaux propres sont \u00e0 l'actif.",
  },
];

const CHAPTER_FALLBACK = {
  1: "Une organisation (entreprise, association ou organisme public) fait l'objet d'une analyse de gouvernance et de parties prenantes.",
  2: "Un candidat et un recruteur \u00e9changent sur le comportement professionnel et l'image num\u00e9rique.",
  3: "NovaRetail \u00e9tudie les relations hi\u00e9rarchiques, le leadership et les strat\u00e9gies d'influence en magasin.",
  4: "NovaRetail am\u00e9nage les postes de travail pour r\u00e9duire la p\u00e9nibilit\u00e9 et am\u00e9liorer les conditions.",
  5: "NovaRetail compare grilles de salaires, primes et \u00e9quit\u00e9 interne / externe.",
  6: "DataFlow traite un sujet de donn\u00e9es, d'information et de conformit\u00e9 num\u00e9rique.",
  7: "DataFlow d\u00e9ploie des outils num\u00e9riques collaboratifs pour les \u00e9quipes.",
  8: "DataFlow mod\u00e9lise l'impact du num\u00e9rique sur l'organisation du travail et les processus.",
  9: "GreenWave analyse la valeur per\u00e7ue et l'image de marque aupr\u00e8s des clients.",
  10: "GreenWave suit sa valeur financi\u00e8re et boursi\u00e8re.",
  11: "GreenWave calcule et interpr\u00e8te la valeur ajout\u00e9e et sa r\u00e9partition.",
  12: "Prix & Marge \u00e9tudie prix, co\u00fbts, marges et TVA sur une r\u00e9f\u00e9rence produit.",
  13: "Helios analyse sa performance commerciale, financi\u00e8re, sociale et environnementale.",
};

function questionAlreadyIntegrated(q) {
  if (q.length >= 100) return true;
  if (/\d/.test(q) && /(\u20ac|EUR|%)/.test(q)) return true;
  if (/^(Entreprise|NovaRetail|DataFlow|GreenWave|Helios|Prix & Marge|SportSolidaire)/i.test(q)) {
    return true;
  }
  return false;
}

function pickSituation(item) {
  const text = normalizeDsText(`${item.question} ${item.choix.join(" ")}`);
  for (const themed of THEMED_SITUATIONS) {
    if (themed.match(text)) return themed.situation;
  }
  return CHAPTER_FALLBACK[item.chapter] ?? CHAPTER_FALLBACK[6];
}

export function buildIntegratedDsQuestionText(item) {
  if (questionAlreadyIntegrated(item.question)) {
    return item.question;
  }
  const situation = pickSituation(item);
  const bridge = item.question.trim().endsWith("?") ? "" : " :";
  return `${situation} ${item.question}${bridge}`.replace(/\s+/g, " ").trim();
}

export function finalizeDsQuestion(q) {
  return {
    ...q,
    difficulte: q.difficulte === "facile" ? "difficile" : q.difficulte,
    question: buildIntegratedDsQuestionText(q),
  };
}
