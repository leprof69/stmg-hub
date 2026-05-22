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

/** Mélange A–D pour que la bonne réponse ne reste pas toujours en B (banque ~93 % bonIndex 1). */
export function shuffleGameQuizChoices(
  choices: [string, string, string, string],
  correctIdx: 0 | 1 | 2 | 3,
): { choices: [string, string, string, string]; ok: 0 | 1 | 2 | 3 } {
  const order: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  const shuffled = order.map((i) => choices[i]) as [string, string, string, string];
  const ok = order.indexOf(correctIdx) as 0 | 1 | 2 | 3;
  return { choices: shuffled, ok };
}

export function withShuffledChoices(q: GameQuizQ): GameQuizQ {
  const { choices, ok } = shuffleGameQuizChoices(q.choices, q.ok);
  return { ...q, choices, ok };
}

export function sdgnQcmToGameQuiz(item: SdgnMissionQcm): GameQuizQ {
  const { choices, ok } = shuffleGameQuizChoices(item.choix, item.bonIndex);
  return {
    q: item.question,
    choices,
    ok,
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
  return [...source]
    .sort(() => Math.random() - 0.5)
    .slice(0, count)
    .map(withShuffledChoices);
}

export function pickOneRandomGameQcm(excludeSourceIds: string[] = []): GameQuizQ {
  const [one] = pickRandomGameQcm(1, excludeSourceIds);
  return (
    one ??
    withShuffledChoices(GAME_QCM_POOL[Math.floor(Math.random() * GAME_QCM_POOL.length)])
  );
}
