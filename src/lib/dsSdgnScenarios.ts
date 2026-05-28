import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import { getPrimaryDsSdgnTopic } from "./dsSdgnQcmTopics";
import type { GameQuizQ } from "./gameQcmPool";

export type DsPresentationMode = "course";

export type DsPlayQuestion = GameQuizQ & {
  topic: import("./dsSdgnQcmTopics").DsSdgnPremiereTopic;
  presentationMode: DsPresentationMode;
};

export function wrapDsPlayQuestion(item: SdgnMissionQcm, quiz: GameQuizQ): DsPlayQuestion {
  const topic = getPrimaryDsSdgnTopic(item);

  return {
    ...quiz,
    q: item.question,
    topic,
    presentationMode: "course",
  };
}
