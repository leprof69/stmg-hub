import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import { SDGN_MISSION_QCM_BANK } from "./sdgnMissionQcmPool";

/** Format commun aux jeux (Serpent, Casino, Grand Oral). */
export type GameQuizQ = {
  q: string;
  choices: [string, string, string, string];
  ok: 0 | 1 | 2 | 3;
  chapter: number;
  sourceId: string;
};

export function sdgnQcmToGameQuiz(item: SdgnMissionQcm): GameQuizQ {
  return {
    q: item.question,
    choices: item.choix,
    ok: item.bonIndex,
    chapter: item.chapter,
    sourceId: item.id,
  };
}

/** Pool unique : QCM des chapitres SDGN presents dans Missions (registry + referentiel + exercices). */
export const GAME_QCM_POOL: GameQuizQ[] = SDGN_MISSION_QCM_BANK.map(sdgnQcmToGameQuiz);

export function pickRandomGameQcm(count: number, excludeSourceIds: string[] = []): GameQuizQ[] {
  const exclude = new Set(excludeSourceIds);
  const pool = GAME_QCM_POOL.filter((q) => !exclude.has(q.sourceId));
  const source = pool.length >= count ? pool : GAME_QCM_POOL;
  return [...source].sort(() => Math.random() - 0.5).slice(0, count);
}

export function pickOneRandomGameQcm(excludeSourceIds: string[] = []): GameQuizQ {
  const [one] = pickRandomGameQcm(1, excludeSourceIds);
  return one ?? GAME_QCM_POOL[Math.floor(Math.random() * GAME_QCM_POOL.length)];
}
