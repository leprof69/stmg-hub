/**
 * Duel : reexporte la banque QCM missions SDGN (tous chapitres du pack Missions).
 * Source : src/lib/sdgnMissionQcmPool.ts
 */
import {
  DUEL_QUESTIONS_PAR_PARTIE,
  DUEL_TEMPS_TOTAL_SEC,
  type SdgnMissionQcm,
  type SdgnMissionQcmDifficulte,
} from "./sdgn/sdgnMissionQcmBank";
import { SDGN_MISSION_QCM_BANK } from "../lib/sdgnMissionQcmPool";

export { DUEL_QUESTIONS_PAR_PARTIE, DUEL_TEMPS_TOTAL_SEC };
export type DuelDifficulte = SdgnMissionQcmDifficulte;
export type DuelMatiere = "Sciences de Gestion";

export type DuelQcmSource = SdgnMissionQcm & { matiere: DuelMatiere };

export const DUEL_QCM_BANK: DuelQcmSource[] = SDGN_MISSION_QCM_BANK.map((q) => ({
  ...q,
  matiere: "Sciences de Gestion" as const,
}));
