import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import { SDGN_DS_TERMINALE_QCM } from "../data/sdgn/sdgnDsTerminaleQcm";
import { isDsBankQuestionEligible } from "./integrateDsQuestion";
import {
  getPrimaryDsSdgnTerminaleTopic,
  DS_SDGN_TERMINALE_TOPIC_ORDER,
  type DsSdgnTerminaleTopic,
} from "./dsSdgnTerminaleQcmTopics";
import { sdgnQcmToGameQuiz, shuffleArrayWithSeed } from "./gameQcmPool";
import type { GameQuizQ } from "./gameQcmPool";
import { buildDsDisplayEnonce, DS_QUESTION_KIND_LABEL, type DsQuestionKind } from "./integrateDsQuestion";
export { DS_SCORE_CORRECT, DS_SCORE_WRONG, formatDsScore } from "./dsSdgnQcmDeck";

export const DS_SDGN_TERMINALE_SESSION_SEC = 50 * 60;
export const DS_SDGN_TERMINALE_QUESTION_SEC = 30;

export const DS_SDGN_TERMINALE_EXAM_BANK: SdgnMissionQcm[] =
  SDGN_DS_TERMINALE_QCM.filter(isDsBankQuestionEligible);

export type DsTerminalePlayQuestion = GameQuizQ & {
  topic: DsSdgnTerminaleTopic;
  questionKind: DsQuestionKind;
  kindLabel: string;
  questionTimed: boolean;
};

function wrapTerminalePlayQuestion(item: SdgnMissionQcm, quiz: GameQuizQ): DsTerminalePlayQuestion {
  return {
    ...quiz,
    q: buildDsDisplayEnonce(item),
    topic: getPrimaryDsSdgnTerminaleTopic(item),
    questionKind: "cas",
    kindLabel: DS_QUESTION_KIND_LABEL.cas,
    questionTimed: false,
  };
}

/** Ordre unique par \u00e9l\u00e8ve (uid + session) ; reprise via questionIds enregistr\u00e9s. */
export function buildDsSdgnTerminaleDeck(
  studentKey: string,
  sessionId: string,
): DsTerminalePlayQuestion[] {
  const seed = `${studentKey}:${sessionId}:terminale-deck`;
  const pool = shuffleArrayWithSeed(DS_SDGN_TERMINALE_EXAM_BANK, seed);
  return pool.map((item) => wrapTerminalePlayQuestion(item, sdgnQcmToGameQuiz(item, sessionId)));
}

export function buildDsSdgnTerminaleDeckFromQuestionIds(
  questionIds: string[],
  sessionId: string,
): DsTerminalePlayQuestion[] {
  const byId = new Map(DS_SDGN_TERMINALE_EXAM_BANK.map((q) => [q.id, q]));
  return questionIds
    .map((id) => byId.get(id))
    .filter((q): q is SdgnMissionQcm => Boolean(q))
    .map((item) => wrapTerminalePlayQuestion(item, sdgnQcmToGameQuiz(item, sessionId)));
}

export function getDsSdgnTerminaleQuestionCount(): number {
  return DS_SDGN_TERMINALE_EXAM_BANK.length;
}

export function rebuildTerminaleQuestionIdsForResume(session: {
  questionIds?: string[];
  totalQuestions?: number;
}): string[] | null {
  if (session.questionIds?.length) return session.questionIds;
  return null;
}
