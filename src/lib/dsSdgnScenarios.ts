import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import {
  buildDsDisplayEnonce,
  DS_QUESTION_KIND_LABEL,
  getDsQuestionKind,
  type DsQuestionKind,
} from "./integrateDsQuestion";
import { getPrimaryDsSdgnTopic } from "./dsSdgnQcmTopics";
import type { GameQuizQ } from "./gameQcmPool";

export type { DsQuestionKind };

export type DsPlayQuestion = GameQuizQ & {
  topic: import("./dsSdgnQcmTopics").DsSdgnPremiereTopic;
  questionKind: DsQuestionKind;
  kindLabel: string;
  /** false = pas de limite de 30 s sur cette question */
  questionTimed: boolean;
};

export function wrapDsPlayQuestion(item: SdgnMissionQcm, quiz: GameQuizQ): DsPlayQuestion {
  const topic = getPrimaryDsSdgnTopic(item);
  const questionKind = getDsQuestionKind(item);
  return {
    ...quiz,
    q: buildDsDisplayEnonce(item),
    topic,
    questionKind,
    kindLabel: DS_QUESTION_KIND_LABEL[questionKind],
    /** 30 s par question sauf type Calcul. */
    questionTimed: questionKind !== "calcul",
  };
}
