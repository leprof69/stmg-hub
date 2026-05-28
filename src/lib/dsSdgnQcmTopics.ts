import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";

/** Notions prioritaires du DS SDGN 1\u00e8re. */
export type DsSdgnPremiereTopic =
  | "conditions_travail"
  | "numerique"
  | "valeurs_creation"
  | "performance_globale"
  | "prix_couts_marges";

export const DS_SDGN_TOPIC_LABELS: Record<DsSdgnPremiereTopic, string> = {
  conditions_travail: "Conditions de travail",
  numerique: "Num\u00e9rique",
  valeurs_creation: "Cr\u00e9ation de valeurs",
  performance_globale: "Performance globale",
  prix_couts_marges: "Prix, co\u00fbts et marges",
};

/** Part minimale du DS consacr\u00e9e \u00e0 chaque notion (sur 100 questions max). */
export const DS_SDGN_TOPIC_QUOTAS: Record<DsSdgnPremiereTopic, number> = {
  conditions_travail: 14,
  numerique: 16,
  valeurs_creation: 20,
  performance_globale: 18,
  prix_couts_marges: 22,
};

const TOPIC_ORDER: DsSdgnPremiereTopic[] = [
  "conditions_travail",
  "numerique",
  "valeurs_creation",
  "performance_globale",
  "prix_couts_marges",
];

const CHAPTER_PRIMARY: Partial<Record<number, DsSdgnPremiereTopic>> = {
  4: "conditions_travail",
  5: "conditions_travail",
  2: "numerique",
  6: "numerique",
  7: "numerique",
  8: "numerique",
  9: "valeurs_creation",
  10: "valeurs_creation",
  11: "valeurs_creation",
  12: "prix_couts_marges",
  13: "performance_globale",
};

const TOPIC_KEYWORDS: Record<DsSdgnPremiereTopic, string[]> = {
  conditions_travail: [
    "conditions de travail",
    "qvct",
    "qualite de vie au travail",
    "teletravail",
    "amenager",
    "competence",
    "evaluation professionnelle",
    "grille d'evaluation",
    "prime",
    "entretien",
    "savoir-etre",
    "activite de travail",
  ],
  numerique: [
    "numerique",
    "digital",
    "intranet",
    "big data",
    "rgpd",
    "open data",
    "pgi",
    "collaboratif",
    "intelligence artificielle",
    " identite numerique",
    "linkedin",
    "e-reputation professionnelle",
    "reseau social d'entreprise",
    "serveur",
    "processus",
    "evenement declencheur",
  ],
  valeurs_creation: [
    "valeur percue",
    "valeur financiere",
    "valeur ajoutee",
    "valeur boursiere",
    "valeur partenarial",
    "e-reputation",
    "image de marque",
    "consommations intermediaires",
    "chiffre d'affaires",
    "influenceur",
    "bad buzz",
    "patrimoine",
    "capitaux propres",
    "bilan",
  ],
  performance_globale: [
    "performance commerciale",
    "performance financiere",
    "rentabilite",
    "profitabilite",
    "part de marche",
    "efficience",
    "efficacite",
    "environnement",
    "social",
    "developpement durable",
    "responsabilite societale",
    "performance sociale",
    "performance environnementale",
    "indicateur de performance",
    "dividende",
    "autofinancement",
  ],
  prix_couts_marges: [
    "marge commerciale",
    "marge unitaire",
    "taux de marge",
    "cout de revient",
    "co\u00fbt de revient",
    "prix de vente",
    "prix d'achat",
    " ht ",
    " ttc",
    "tva",
    "prix ht",
    "prix ttc",
  ],
};

function normalizeDsText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "'");
}

function matchesKeywords(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

/** Classe une question dans une ou plusieurs notions DS. */
export function classifyDsSdgnPremiereQuestion(q: SdgnMissionQcm): DsSdgnPremiereTopic[] {
  const text = normalizeDsText(`${q.question} ${q.choix.join(" ")}`);
  const topics = new Set<DsSdgnPremiereTopic>();

  for (const topic of TOPIC_ORDER) {
    if (matchesKeywords(text, TOPIC_KEYWORDS[topic])) topics.add(topic);
  }

  const primary = CHAPTER_PRIMARY[q.chapter];
  if (primary && topics.size === 0) topics.add(primary);

  if (q.id.startsWith("sdgn-ds-")) {
    if ([11, 9, 10].includes(q.chapter)) topics.add("valeurs_creation");
    if (q.chapter === 12) topics.add("prix_couts_marges");
    if (q.chapter === 13) topics.add("performance_globale");
    if ([4, 5].includes(q.chapter)) topics.add("conditions_travail");
    if ([2, 6, 7, 8].includes(q.chapter)) topics.add("numerique");
  }

  return [...topics];
}

export function isDsSdgnPremierePriorityQuestion(q: SdgnMissionQcm): boolean {
  return classifyDsSdgnPremiereQuestion(q).length > 0;
}

/** Notion principale pour le rapport DS (sc\u00e9nario + acquis). */
export function getPrimaryDsSdgnTopic(q: SdgnMissionQcm): DsSdgnPremiereTopic {
  const topics = classifyDsSdgnPremiereQuestion(q);
  if (topics.length > 0) return topics[0];
  return CHAPTER_PRIMARY[q.chapter] ?? "valeurs_creation";
}

export const DS_SDGN_TOPIC_ORDER: readonly DsSdgnPremiereTopic[] = TOPIC_ORDER;

export function countDsSdgnPremiereByTopic(
  bank: readonly SdgnMissionQcm[],
): Record<DsSdgnPremiereTopic, number> {
  const counts: Record<DsSdgnPremiereTopic, number> = {
    conditions_travail: 0,
    numerique: 0,
    valeurs_creation: 0,
    performance_globale: 0,
    prix_couts_marges: 0,
  };
  for (const q of bank) {
    for (const topic of classifyDsSdgnPremiereQuestion(q)) {
      counts[topic] += 1;
    }
  }
  return counts;
}
