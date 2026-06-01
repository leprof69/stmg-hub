import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import { SDGN_MISSION_QCM_BANK_PREMIERE } from "./sdgnMissionQcmPool";

/** Format commun aux jeux (Serpent, Casino, Grand Oral). */
export type GameQuizQ = {
  q: string;
  choices: [string, string, string, string];
  ok: 0 | 1 | 2 | 3;
  chapter: number;
  sourceId: string;
};

export function hashSeed(key: string): number {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function seededUnit(seedKey: string, step: number): number {
  let s = (hashSeed(`${seedKey}:${step}`) + 0x9e3779b9) >>> 0;
  s = Math.imul(s ^ (s >>> 16), 0x85ebca6b) >>> 0;
  s = Math.imul(s ^ (s >>> 13), 0xc2b2ae35) >>> 0;
  return ((s ^ (s >>> 16)) >>> 0) / 0xffffffff;
}

/** M\u00e9lange d\u00e9terministe (seed \u00e9l\u00e8ve + session) pour un ordre diff\u00e9rent par copie. */
export function shuffleArrayWithSeed<T>(items: readonly T[], seedKey: string): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(seededUnit(seedKey, i) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Mélange A–D pour que la bonne réponse ne reste pas toujours en B (banque ~93 % bonIndex 1). */
export function shuffleGameQuizChoices(
  choices: [string, string, string, string],
  correctIdx: 0 | 1 | 2 | 3,
  seedKey?: string,
): { choices: [string, string, string, string]; ok: 0 | 1 | 2 | 3 } {
  const order: (0 | 1 | 2 | 3)[] = [0, 1, 2, 3];
  for (let i = order.length - 1; i > 0; i--) {
    const j = seedKey
      ? Math.floor(seededUnit(seedKey, i) * (i + 1))
      : (() => {
          const buf = new Uint32Array(1);
          crypto.getRandomValues(buf);
          return buf[0] % (i + 1);
        })();
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

export function sdgnQcmToGameQuiz(item: SdgnMissionQcm, sessionId?: string): GameQuizQ {
  const seedKey = sessionId ? `${sessionId}:${item.id}` : undefined;
  const { choices, ok } = shuffleGameQuizChoices(item.choix, item.bonIndex, seedKey);
  return {
    q: item.question,
    choices,
    ok,
    chapter: item.chapter,
    sourceId: item.id,
  };
}

/** Pool jeux : QCM SDGN Première (chapitres 1 à 13), tirage aléatoire à chaque partie. */
export const GAME_QCM_POOL: GameQuizQ[] = SDGN_MISSION_QCM_BANK_PREMIERE.map((item) =>
  sdgnQcmToGameQuiz(item),
);

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
