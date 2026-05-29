import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import { getPrimaryDsSdgnTopic } from "./dsSdgnQcmTopics";
import { isDsSdgnCalculationQuestion } from "./dsSdgnQuestionTiming";
import type { GameQuizQ } from "./gameQcmPool";

export type DsPresentationMode = "course";

export type DsPlayQuestion = GameQuizQ & {
  topic: import("./dsSdgnQcmTopics").DsSdgnPremiereTopic;
  presentationMode: DsPresentationMode;
  /** false = pas de limite de 30 s sur cette question */
  questionTimed: boolean;
};

export function wrapDsPlayQuestion(item: SdgnMissionQcm, quiz: GameQuizQ): DsPlayQuestion {
  const topic = getPrimaryDsSdgnTopic(item);

  const hasCalc = isDsSdgnCalculationQuestion(item.question, item.choix);

  return {
    ...quiz,
    q: item.question,
    topic,
    presentationMode: "course",
    questionTimed: !hasCalc,
  };
}
