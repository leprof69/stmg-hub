import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";

/** Th\u00e8mes du DS SDGN 1\u00e8re (100 QCM). */
export type DsSdgnPremiereTopic =
  | "individu_acteur"
  | "numerique_ic"
  | "valeur_performance"
  | "temps_risque";

export const DS_SDGN_TOPIC_LABELS: Record<DsSdgnPremiereTopic, string> = {
  individu_acteur: "De l'individu \u00e0 l'acteur",
  numerique_ic: "Num\u00e9rique et intelligence collective",
  valeur_performance: "Cr\u00e9ation de valeur et performance",
  temps_risque: "Temps et risque",
};

/** 25 questions par th\u00e8me (chapitres 1\u20134). */
export const DS_SDGN_TOPIC_QUOTAS: Record<DsSdgnPremiereTopic, number> = {
  individu_acteur: 25,
  numerique_ic: 25,
  valeur_performance: 25,
  temps_risque: 25,
};

const TOPIC_ORDER: DsSdgnPremiereTopic[] = [
  "individu_acteur",
  "numerique_ic",
  "valeur_performance",
  "temps_risque",
];

const CHAPTER_PRIMARY: Record<number, DsSdgnPremiereTopic> = {
  1: "individu_acteur",
  2: "numerique_ic",
  3: "valeur_performance",
  4: "temps_risque",
};

/** Classe une question dans son th\u00e8me DS. */
export function classifyDsSdgnPremiereQuestion(q: SdgnMissionQcm): DsSdgnPremiereTopic[] {
  const primary = CHAPTER_PRIMARY[q.chapter];
  return primary ? [primary] : [];
}

export function isDsSdgnPremierePriorityQuestion(q: SdgnMissionQcm): boolean {
  return classifyDsSdgnPremiereQuestion(q).length > 0;
}

/** Th\u00e8me principal pour le rapport DS (acquis par notion). */
export function getPrimaryDsSdgnTopic(q: SdgnMissionQcm): DsSdgnPremiereTopic {
  return CHAPTER_PRIMARY[q.chapter] ?? "individu_acteur";
}

export const DS_SDGN_TOPIC_ORDER: readonly DsSdgnPremiereTopic[] = TOPIC_ORDER;

export function countDsSdgnPremiereByTopic(
  bank: readonly SdgnMissionQcm[],
): Record<DsSdgnPremiereTopic, number> {
  const counts: Record<DsSdgnPremiereTopic, number> = {
    individu_acteur: 0,
    numerique_ic: 0,
    valeur_performance: 0,
    temps_risque: 0,
  };
  for (const q of bank) {
    for (const topic of classifyDsSdgnPremiereQuestion(q)) {
      counts[topic] += 1;
    }
  }
  return counts;
}
