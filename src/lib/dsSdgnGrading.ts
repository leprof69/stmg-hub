import {
  DS_SCORE_CORRECT,
  DS_SCORE_WRONG,
} from "./dsSdgnQcmDeck";
import {
  DS_SDGN_TOPIC_ORDER,
  type DsSdgnPremiereTopic,
} from "./dsSdgnQcmTopics";

/** 1 = correct, 0 = faux / timeout */
export type DsAnswerOutcomeCode = 1 | 0;

export type DsTopicStat = {
  correct: number;
  total: number;
  acquis: boolean;
};

export const DS_ACQUIS_MIN_RATIO = 0.6;

export function computeDsGradeOn20(
  scorePoints: number,
  totalQuestions: number,
  forcedZero: boolean,
): number {
  if (forcedZero || totalQuestions <= 0) return 0;
  const maxPoints = totalQuestions * DS_SCORE_CORRECT;
  if (maxPoints <= 0) return 0;
  const ratio = scorePoints / maxPoints;
  const grade = ratio * 20;
  return Math.round(Math.max(0, Math.min(20, grade)) * 10) / 10;
}

export function buildEmptyTopicStats(): Record<DsSdgnPremiereTopic, DsTopicStat> {
  return Object.fromEntries(
    DS_SDGN_TOPIC_ORDER.map((topic) => [topic, { correct: 0, total: 0, acquis: false }]),
  ) as Record<DsSdgnPremiereTopic, DsTopicStat>;
}

export function computeTopicStats(
  answers: { topic: DsSdgnPremiereTopic; outcome: DsAnswerOutcomeCode }[],
): Record<DsSdgnPremiereTopic, DsTopicStat> {
  const stats = buildEmptyTopicStats();
  for (const a of answers) {
    const row = stats[a.topic as DsSdgnPremiereTopic];
    if (!row) continue;
    row.total += 1;
    if (a.outcome === 1) row.correct += 1;
  }
  for (const topic of DS_SDGN_TOPIC_ORDER) {
    const row = stats[topic];
    row.acquis =
      row.total > 0 && row.correct / row.total >= DS_ACQUIS_MIN_RATIO;
  }
  return stats;
}

export function outcomeFromAnswer(
  wasCorrect: boolean,
): DsAnswerOutcomeCode {
  return wasCorrect ? 1 : 0;
}

export function pointsFromOutcome(outcome: DsAnswerOutcomeCode): number {
  return outcome === 1 ? DS_SCORE_CORRECT : DS_SCORE_WRONG;
}

/** Recalcule les points DS \u00e0 partir des r\u00e9ponses d\u00e9j\u00e0 enregistr\u00e9es. */
export function computeDsScoreFromAnswers(
  answers: readonly { outcome: DsAnswerOutcomeCode }[],
): number {
  const raw = answers.reduce((sum, a) => sum + pointsFromOutcome(a.outcome), 0);
  return Math.round(raw * 10) / 10;
}
