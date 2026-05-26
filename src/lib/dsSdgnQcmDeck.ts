import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import { SDGN_MISSION_QCM_BANK_PREMIERE } from "./sdgnMissionQcmPool";
import { sdgnQcmToGameQuiz, type GameQuizQ } from "./gameQcmPool";

export const DS_SDGN_PREMIERE_SESSION_SEC = 50 * 60;
export const DS_SDGN_PREMIERE_QUESTION_SEC = 30;

const DIFFICULTE_BY_ID: Record<string, SdgnMissionQcm["difficulte"]> = Object.fromEntries(
  SDGN_MISSION_QCM_BANK_PREMIERE.map((q) => [q.id, q.difficulte]),
);

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * DS 1ere : banque Jeux, ordre aleatoire a chaque session (anti-copie voisin).
 * Toutes les questions "difficile" sont incluses ; le reste complete jusqu'au plafond session.
 */
export function buildDsSdgnPremiereDeck(): GameQuizQ[] {
  const cap = Math.min(
    SDGN_MISSION_QCM_BANK_PREMIERE.length,
    Math.floor(DS_SDGN_PREMIERE_SESSION_SEC / DS_SDGN_PREMIERE_QUESTION_SEC),
  );
  const hard = SDGN_MISSION_QCM_BANK_PREMIERE.filter((q) => q.difficulte === "difficile");
  const others = SDGN_MISSION_QCM_BANK_PREMIERE.filter((q) => q.difficulte !== "difficile");
  shuffleInPlace(others);
  const merged = [...hard, ...others.slice(0, Math.max(0, cap - hard.length))];
  shuffleInPlace(merged);
  return merged.slice(0, cap).map(sdgnQcmToGameQuiz);
}

export function getDsSdgnPremiereQuestionCount(): number {
  return SDGN_MISSION_QCM_BANK_PREMIERE.length;
}

export function getDsSdgnPremiereDifficulte(sourceId: string): SdgnMissionQcm["difficulte"] | undefined {
  return DIFFICULTE_BY_ID[sourceId];
}

export function countDsSdgnPremiereDifficile(): number {
  return SDGN_MISSION_QCM_BANK_PREMIERE.filter((q) => q.difficulte === "difficile").length;
}
