import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import {
  classifyDsSdgnPremiereQuestion,
  DS_SDGN_TOPIC_QUOTAS,
  type DsSdgnPremiereTopic,
} from "./dsSdgnQcmTopics";
import { SDGN_DS_PREMIERE_QCM } from "../data/sdgn/sdgnDsPremiereQcm";
import { wrapDsPlayQuestion, type DsPlayQuestion } from "./dsSdgnScenarios";
import { sdgnQcmToGameQuiz } from "./gameQcmPool";

export type { DsPlayQuestion } from "./dsSdgnScenarios";

export {
  countDsSdgnPremiereByTopic,
  DS_SDGN_TOPIC_LABELS,
  DS_SDGN_TOPIC_QUOTAS,
} from "./dsSdgnQcmTopics";

export const DS_SDGN_PREMIERE_SESSION_SEC = 50 * 60;
export const DS_SDGN_PREMIERE_QUESTION_SEC = 30;

export const DS_SCORE_CORRECT = 1;
export const DS_SCORE_WRONG = -0.5;

/** Banque DS : QCM sdgn-ds-* (cours pur, \u00e9nonc\u00e9s autonomes). */
export const DS_SDGN_EXAM_BANK: SdgnMissionQcm[] = [...SDGN_DS_PREMIERE_QCM];

const DIFFICULTE_BY_ID: Record<string, SdgnMissionQcm["difficulte"]> = Object.fromEntries(
  DS_SDGN_EXAM_BANK.map((q) => [q.id, q.difficulte]),
);

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickTopicQuestions(
  topic: DsSdgnPremiereTopic,
  count: number,
  used: Set<string>,
): SdgnMissionQcm[] {
  const candidates = DS_SDGN_EXAM_BANK.filter(
    (q) => !used.has(q.id) && classifyDsSdgnPremiereQuestion(q).includes(topic),
  );
  shuffleInPlace(candidates);
  const picked = candidates.slice(0, count);
  for (const q of picked) used.add(q.id);
  return picked;
}

export function buildDsSdgnPremiereDeck(): DsPlayQuestion[] {
  const cap = Math.min(
    DS_SDGN_EXAM_BANK.length,
    Math.floor(DS_SDGN_PREMIERE_SESSION_SEC / DS_SDGN_PREMIERE_QUESTION_SEC),
  );
  const used = new Set<string>();
  const deck: SdgnMissionQcm[] = [];

  for (const [topic, quota] of Object.entries(DS_SDGN_TOPIC_QUOTAS) as [
    DsSdgnPremiereTopic,
    number,
  ][]) {
    const q = Math.min(quota, cap - deck.length);
    if (q <= 0) break;
    deck.push(...pickTopicQuestions(topic, q, used));
  }

  const remainder = DS_SDGN_EXAM_BANK.filter((q) => !used.has(q.id));
  shuffleInPlace(remainder);
  for (const q of remainder) {
    if (deck.length >= cap) break;
    deck.push(q);
    used.add(q.id);
  }

  shuffleInPlace(deck);
  return deck.slice(0, cap).map((item) => wrapDsPlayQuestion(item, sdgnQcmToGameQuiz(item)));
}

export function formatDsScore(points: number): string {
  const rounded = Math.round(points * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function getDsSdgnPremiereQuestionCount(): number {
  return DS_SDGN_EXAM_BANK.length;
}

export function countDsSdgnPremiereDsDedicated(): number {
  return DS_SDGN_EXAM_BANK.length;
}

export function getDsSdgnPremiereDifficulte(sourceId: string): SdgnMissionQcm["difficulte"] | undefined {
  return DIFFICULTE_BY_ID[sourceId];
}

export function countDsSdgnPremiereDifficile(): number {
  return DS_SDGN_EXAM_BANK.filter((q) => q.difficulte === "difficile").length;
}
