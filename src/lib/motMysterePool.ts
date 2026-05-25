import { MOT_MYSTERE_BANK, type MotMystereEntry } from "../data/motMystereBank";
import { MOT_MYSTERE_QCM_BY_ENTRY_ID } from "../data/motMystereQcmMap";
import { isSdgnPremiereChapter, SDGN_CHAPTER_LABELS } from "../data/sdgn/registry";
import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import { getGameQcmForChapter, SDGN_MISSION_QCM_BANK_PREMIERE } from "./sdgnMissionQcmPool";
import { sdgnQcmToGameQuiz, type GameQuizQ } from "./gameQcmPool";

export type { MotMystereEntry };

export function motMystereChapterLabel(chapter: number): string {
  if (isSdgnPremiereChapter(chapter)) {
    return `Ch. ${chapter} - ${SDGN_CHAPTER_LABELS[chapter]}`;
  }
  return `Ch. ${chapter}`;
}

/** Normalise pour comparer la reponse saisie (minuscules, sans accents ni ponctuation). */
export function normalizeMotMystereAnswer(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function motMystereAnswersMatch(input: string, entry: MotMystereEntry): boolean {
  const n = normalizeMotMystereAnswer(input);
  if (!n) return false;
  const compact = (s: string) => s.replace(/\s/g, "");
  const candidates = [entry.term, ...(entry.aliases ?? [])].map(normalizeMotMystereAnswer);
  return candidates.some((c) => c === n || compact(c) === compact(n));
}

export function jetonsMotMystere(hintLevel: number, usedQcm: boolean): number {
  if (usedQcm) return 10;
  const table = [50, 40, 30, 20];
  return table[Math.min(Math.max(0, hintLevel), table.length - 1)];
}

const MOT_MYSTERE_POOL = MOT_MYSTERE_BANK.filter((e) => isSdgnPremiereChapter(e.chapter));

export function pickMotMystereRound(count: number, excludeIds: string[] = []): MotMystereEntry[] {
  const exclude = new Set(excludeIds);
  const pool = MOT_MYSTERE_POOL.filter((e) => !exclude.has(e.id));
  const source = pool.length >= count ? pool : MOT_MYSTERE_POOL;
  return [...source].sort(() => Math.random() - 0.5).slice(0, count);
}

export function pickOneMotMystere(excludeIds: string[] = []): MotMystereEntry {
  const [one] = pickMotMystereRound(1, excludeIds);
  return one ?? MOT_MYSTERE_POOL[Math.floor(Math.random() * MOT_MYSTERE_POOL.length)];
}

const SDGN_QCM_BY_ID = new Map<string, SdgnMissionQcm>(
  SDGN_MISSION_QCM_BANK_PREMIERE.map((q) => [q.id, q]),
);

/** QCM de cours SDGN Premi\u00e8re associ\u00e9 au mot (mode secours). */
export function getMotMystereQcm(entry: MotMystereEntry): GameQuizQ {
  const linkedId = MOT_MYSTERE_QCM_BY_ENTRY_ID[entry.id];
  const linked = linkedId ? SDGN_QCM_BY_ID.get(linkedId) : undefined;
  const chapterPool = getGameQcmForChapter(entry.chapter);
  const fallback =
    linked ??
    chapterPool[Math.floor(Math.random() * chapterPool.length)] ??
    SDGN_MISSION_QCM_BANK_PREMIERE[0];
  return sdgnQcmToGameQuiz(fallback);
}

export const MOT_MYSTERE_WORDS_PER_SESSION = 5;
