import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";

/** 6 th\u00e8mes du DS SDGN Terminale. */
export type DsSdgnTerminaleTopic =
  | "production"
  | "acteurs"
  | "numerique_rse"
  | "ecosystemes_cyber"
  | "analyse_financiere"
  | "transversalite";

export const DS_SDGN_TERMINALE_TOPIC_LABELS: Record<DsSdgnTerminaleTopic, string> = {
  production: "Organisations et activit\u00e9 de production",
  acteurs: "Organisations et acteurs",
  numerique_rse: "Num\u00e9rique, RSE et nouveaux comportements",
  ecosystemes_cyber: "\u00c9cosyst\u00e8mes, cybers\u00e9curit\u00e9 et SI",
  analyse_financiere: "Analyse financi\u00e8re et rentabilit\u00e9",
  transversalite: "Transversalit\u00e9",
};

export const DS_SDGN_TERMINALE_TOPIC_ORDER: readonly DsSdgnTerminaleTopic[] = [
  "production",
  "acteurs",
  "numerique_rse",
  "ecosystemes_cyber",
  "analyse_financiere",
  "transversalite",
];

const CHAPTER_TOPIC: Record<number, DsSdgnTerminaleTopic> = {
  1: "production",
  2: "acteurs",
  3: "numerique_rse",
  4: "ecosystemes_cyber",
  5: "analyse_financiere",
  6: "transversalite",
};

export function getPrimaryDsSdgnTerminaleTopic(q: SdgnMissionQcm): DsSdgnTerminaleTopic {
  return CHAPTER_TOPIC[q.chapter] ?? "transversalite";
}
