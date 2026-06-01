import {
  DS_SDGN_TERMINALE_TOPIC_ORDER,
  type DsSdgnTerminaleTopic,
} from "./dsSdgnTerminaleQcmTopics";
import type { DsAnswerOutcomeCode, DsTopicStat } from "./dsSdgnGrading";

export { DS_ACQUIS_MIN_RATIO, computeDsGradeOn20, computeDsScoreFromAnswers, outcomeFromAnswer, pointsFromOutcome } from "./dsSdgnGrading";
export { DS_SCORE_CORRECT, DS_SCORE_WRONG } from "./dsSdgnQcmDeck";

export function buildEmptyTerminaleTopicStats(): Record<DsSdgnTerminaleTopic, DsTopicStat> {
  return Object.fromEntries(
    DS_SDGN_TERMINALE_TOPIC_ORDER.map((topic) => [topic, { correct: 0, total: 0, acquis: false }]),
  ) as Record<DsSdgnTerminaleTopic, DsTopicStat>;
}

export function computeTerminaleTopicStats(
  answers: { topic: DsSdgnTerminaleTopic; outcome: DsAnswerOutcomeCode }[],
): Record<DsSdgnTerminaleTopic, DsTopicStat> {
  const stats = buildEmptyTerminaleTopicStats();
  for (const a of answers) {
    const row = stats[a.topic as DsSdgnTerminaleTopic];
    if (!row) continue;
    row.total += 1;
    if (a.outcome === 1) row.correct += 1;
  }
  for (const topic of DS_SDGN_TERMINALE_TOPIC_ORDER) {
    const row = stats[topic];
    row.acquis = row.total > 0 && row.correct / row.total >= 0.6;
  }
  return stats;
}
