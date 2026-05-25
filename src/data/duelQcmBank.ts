/**
 * Duel : banque QCM SDGN Première (chapitres 1 à 13).
 * Source : src/lib/sdgnMissionQcmPool.ts
 */
import {
  DUEL_QUESTIONS_PAR_PARTIE,
  DUEL_TEMPS_TOTAL_SEC,
  type SdgnMissionQcm,
  type SdgnMissionQcmDifficulte,
} from "./sdgn/sdgnMissionQcmBank";
import { SDGN_MISSION_QCM_BANK_PREMIERE } from "../lib/sdgnMissionQcmPool";

export { DUEL_QUESTIONS_PAR_PARTIE, DUEL_TEMPS_TOTAL_SEC };
export type DuelDifficulte = SdgnMissionQcmDifficulte;
export type DuelMatiere = "Sciences de Gestion";

export type DuelQcmSource = SdgnMissionQcm & { matiere: DuelMatiere };

export const DUEL_QCM_BANK: DuelQcmSource[] = SDGN_MISSION_QCM_BANK_PREMIERE.map((q) => ({
  ...q,
  matiere: "Sciences de Gestion" as const,
}));
