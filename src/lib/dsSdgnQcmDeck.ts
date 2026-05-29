import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import {
  classifyDsSdgnPremiereQuestion,
  DS_SDGN_TOPIC_QUOTAS,
  type DsSdgnPremiereTopic,
} from "./dsSdgnQcmTopics";
import { SDGN_DS_PREMIERE_QCM } from "../data/sdgn/sdgnDsPremiereQcm";
import {
  getDsQuestionKind,
  isDsBankQuestionEligible,
  isDsPureCoursBankId,
} from "./integrateDsQuestion";
import { wrapDsPlayQuestion, type DsPlayQuestion } from "./dsSdgnScenarios";
import { sdgnQcmToGameQuiz } from "./gameQcmPool";

/** Part max de questions « cours pur » dans une session. */
const DS_PURE_COURS_SESSION_CAP = 14;

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

/** Banque DS : uniquement questions difficiles au format cas / calcul / cours. */
export const DS_SDGN_EXAM_BANK: SdgnMissionQcm[] = SDGN_DS_PREMIERE_QCM.filter(isDsBankQuestionEligible);

const DIFFICULTE_BY_ID: Record<string, SdgnMissionQcm["difficulte"]> = Object.fromEntries(
  DS_SDGN_EXAM_BANK.map((q) => [q.id, q.difficulte]),
);

/** Tirage al\u00e9atoire (chaque lancement DS = ordre diff\u00e9rent par \u00e9l\u00e8ve). */
function randomIndex(maxExclusive: number): number {
  if (maxExclusive <= 1) return 0;
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return buf[0] % maxExclusive;
}

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = randomIndex(i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function dsQuestionPickScore(q: SdgnMissionQcm): number {
  const kind = getDsQuestionKind(q);
  let score = 0;
  if (kind === "cas") score += 10;
  if (kind === "calcul") score += 8;
  if (kind === "cours") score += 1;
  if (q.difficulte === "difficile") score += 2;
  if (isDsPureCoursBankId(q.id)) score -= 5;
  return score;
}

function pickTopicQuestions(
  topic: DsSdgnPremiereTopic,
  count: number,
  used: Set<string>,
  pureCoursUsed: { n: number },
): SdgnMissionQcm[] {
  const candidates = DS_SDGN_EXAM_BANK.filter((q) => {
    if (used.has(q.id)) return false;
    if (!classifyDsSdgnPremiereQuestion(q).includes(topic)) return false;
    if (isDsPureCoursBankId(q.id) && pureCoursUsed.n >= DS_PURE_COURS_SESSION_CAP) return false;
    return true;
  });
  candidates.sort((a, b) => dsQuestionPickScore(b) - dsQuestionPickScore(a));
  const pool = candidates.slice(0, Math.max(count * 5, count));
  shuffleInPlace(pool);
  const picked = pool.slice(0, count);
  for (const q of picked) {
    used.add(q.id);
    if (isDsPureCoursBankId(q.id)) pureCoursUsed.n += 1;
  }
  return picked;
}

export function buildDsSdgnPremiereDeck(): DsPlayQuestion[] {
  const cap = Math.min(
    DS_SDGN_EXAM_BANK.length,
    Math.floor(DS_SDGN_PREMIERE_SESSION_SEC / DS_SDGN_PREMIERE_QUESTION_SEC),
  );
  const used = new Set<string>();
  const pureCoursUsed = { n: 0 };
  const deck: SdgnMissionQcm[] = [];

  const topicEntries = shuffleInPlace(
    Object.entries(DS_SDGN_TOPIC_QUOTAS) as [DsSdgnPremiereTopic, number][],
  );
  for (const [topic, quota] of topicEntries) {
    const q = Math.min(quota, cap - deck.length);
    if (q <= 0) break;
    deck.push(...pickTopicQuestions(topic, q, used, pureCoursUsed));
  }

  const remainder = DS_SDGN_EXAM_BANK.filter((q) => {
    if (used.has(q.id)) return false;
    if (isDsPureCoursBankId(q.id) && pureCoursUsed.n >= DS_PURE_COURS_SESSION_CAP) return false;
    return true;
  });
  remainder.sort((a, b) => dsQuestionPickScore(b) - dsQuestionPickScore(a));
  shuffleInPlace(remainder);
  for (const q of remainder) {
    if (deck.length >= cap) break;
    deck.push(q);
    used.add(q.id);
    if (isDsPureCoursBankId(q.id)) pureCoursUsed.n += 1;
  }

  shuffleInPlace(deck);
  const playDeck = deck
    .slice(0, cap)
    .map((item) => wrapDsPlayQuestion(item, sdgnQcmToGameQuiz(item)));
  return shuffleInPlace([...playDeck]);
}

const DS_QCM_BY_ID: Record<string, SdgnMissionQcm> = Object.fromEntries(
  DS_SDGN_EXAM_BANK.map((q) => [q.id, q]),
);

/** Reconstruit le m\u00eame paquet qu\u2019au premier lancement (reprise apr\u00e8s anti-triche). */
export function buildDsSdgnPremiereDeckFromQuestionIds(
  questionIds: string[],
  sessionId: string,
): DsPlayQuestion[] {
  const deck: DsPlayQuestion[] = [];
  for (const id of questionIds) {
    const item = DS_QCM_BY_ID[id];
    if (!item) continue;
    deck.push(wrapDsPlayQuestion(item, sdgnQcmToGameQuiz(item, sessionId)));
  }
  return deck;
}

export function formatDsScore(points: number): string {
  const rounded = Math.round(points * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function getDsSdgnPremiereQuestionCount(): number {
  return DS_SDGN_EXAM_BANK.length;
}

export function countDsSdgnPremiereDsDedicated(): number {
  return DS_SDGN_EXAM_BANK.filter((q) => getDsQuestionKind(q) === "cas").length;
}

export function getDsSdgnPremiereDifficulte(sourceId: string): SdgnMissionQcm["difficulte"] | undefined {
  return DIFFICULTE_BY_ID[sourceId];
}

export function countDsSdgnPremiereDifficile(): number {
  return DS_SDGN_EXAM_BANK.filter((q) => q.difficulte === "difficile").length;
}

export function countDsSdgnPremiereByKind(): Record<"cas" | "calcul" | "cours", number> {
  const out = { cas: 0, calcul: 0, cours: 0 };
  for (const q of SDGN_DS_PREMIERE_QCM) {
    out[getDsQuestionKind(q)] += 1;
  }
  return out;
}
