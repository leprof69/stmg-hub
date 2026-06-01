import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import { SDGN_DS_PREMIERE_QCM } from "../data/sdgn/sdgnDsPremiereQcm";
import { isDsBankQuestionEligible } from "./integrateDsQuestion";
import { DS_SDGN_TOPIC_ORDER } from "./dsSdgnQcmTopics";
import { wrapDsPlayQuestion, type DsPlayQuestion } from "./dsSdgnScenarios";
import { sdgnQcmToGameQuiz, shuffleArrayWithSeed } from "./gameQcmPool";

export type { DsPlayQuestion } from "./dsSdgnScenarios";

export {
  countDsSdgnPremiereByTopic,
  DS_SDGN_TOPIC_LABELS,
  DS_SDGN_TOPIC_ORDER,
  DS_SDGN_TOPIC_QUOTAS,
} from "./dsSdgnQcmTopics";

export const DS_SDGN_PREMIERE_SESSION_SEC = 50 * 60;
export const DS_SDGN_PREMIERE_QUESTION_SEC = 30;

/** Bar\u00e8me DS : bonne r\u00e9ponse +1 pt, mauvaise r\u00e9ponse \u22120,5 pt (1\u00e8re et Terminale). */
export const DS_SCORE_CORRECT = 1;
export const DS_SCORE_WRONG = -0.5;

/** Banque DS Premi\u00e8re : 100 QCM difficiles. */
export const DS_SDGN_EXAM_BANK: SdgnMissionQcm[] = SDGN_DS_PREMIERE_QCM.filter(isDsBankQuestionEligible);

const DS_QCM_BY_ID: Record<string, SdgnMissionQcm> = Object.fromEntries(
  DS_SDGN_EXAM_BANK.map((q) => [q.id, q]),
);

/** Ordre unique par \u00e9l\u00e8ve (uid + session) ; reprise via questionIds enregistr\u00e9s. */
export function buildDsSdgnPremiereDeck(studentKey: string, sessionId: string): DsPlayQuestion[] {
  const seed = `${studentKey}:${sessionId}:premiere-deck`;
  const pool = shuffleArrayWithSeed(DS_SDGN_EXAM_BANK, seed);
  return pool.map((item) => wrapDsPlayQuestion(item, sdgnQcmToGameQuiz(item, sessionId)));
}

export function rebuildQuestionIdsForResume(session: {
  questionIds?: string[];
}): string[] | null {
  if (session.questionIds?.length) return session.questionIds;
  return null;
}

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
