import type { SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import { buildDsDisplayEnonce } from "./integrateDsQuestion";
import {
  DS_SDGN_QCM_EXAM_ID,
  DS_SDGN_TERMINALE_QCM_EXAM_ID,
  type DsSessionAnswerRecord,
} from "../services/dsTabExamService";
import { DS_SDGN_EXAM_BANK } from "./dsSdgnQcmDeck";
import { getPrimaryDsSdgnTopic } from "./dsSdgnQcmTopics";
import { DS_SDGN_TERMINALE_EXAM_BANK } from "./dsSdgnTerminaleQcmDeck";
import { getPrimaryDsSdgnTerminaleTopic } from "./dsSdgnTerminaleQcmTopics";
import { computeTopicStats } from "./dsSdgnGrading";
import { computeTerminaleTopicStats } from "./dsSdgnTerminaleGrading";

export type DsFailedQuestionEntry = {
  sourceId: string;
  sortIndex: number;
  /** Reference banque (ex. Q34). */
  bankRef: string;
  questionText: string;
  expectedAnswer: string;
};

export type DsTopicReportDetail = {
  topic: string;
  label: string;
  acquis: boolean;
  correct: number;
  total: number;
  failedQuestions: DsFailedQuestionEntry[];
};

const PREMIERE_BY_ID = Object.fromEntries(DS_SDGN_EXAM_BANK.map((q) => [q.id, q]));
const TERMINALE_BY_ID = Object.fromEntries(DS_SDGN_TERMINALE_EXAM_BANK.map((q) => [q.id, q]));

function lookupQuestion(sourceId: string, examId: string): SdgnMissionQcm | null {
  if (examId === DS_SDGN_TERMINALE_QCM_EXAM_ID) {
    return TERMINALE_BY_ID[sourceId] ?? null;
  }
  return PREMIERE_BY_ID[sourceId] ?? null;
}

function questionSortIndex(sourceId: string): number {
  const m = sourceId.match(/(\d+)\s*$/);
  return m ? Number(m[1]) : 0;
}

function normalizeDisplayText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function buildFailedEntry(q: SdgnMissionQcm): DsFailedQuestionEntry {
  const sortIndex = questionSortIndex(q.id);
  const expected = normalizeDisplayText(q.choix[q.bonIndex] ?? "");
  return {
    sourceId: q.id,
    sortIndex,
    bankRef: sortIndex > 0 ? `Q${sortIndex}` : q.id,
    questionText: normalizeDisplayText(buildDsDisplayEnonce(q)),
    expectedAnswer: expected || "Revoir la correction de cette question.",
  };
}

function resolveTopicForAnswer(
  answer: DsSessionAnswerRecord,
  q: SdgnMissionQcm | null,
  examId: string,
): string {
  if (q) {
    return examId === DS_SDGN_TERMINALE_QCM_EXAM_ID
      ? getPrimaryDsSdgnTerminaleTopic(q)
      : getPrimaryDsSdgnTopic(q);
  }
  const fromAnswer = String(answer.topic ?? "").trim();
  return fromAnswer || "individu_acteur";
}

/** Reclasse les reponses selon la banque QCM (ignore d'anciens topic en session). */
export function resolveDsAnswersForTopicStats(
  answers: readonly DsSessionAnswerRecord[],
  examId: string,
): { topic: string; outcome: 0 | 1 }[] {
  return answers.map((answer) => ({
    topic: resolveTopicForAnswer(answer, lookupQuestion(answer.sourceId, examId), examId),
    outcome: answer.outcome === 1 ? 1 : 0,
  }));
}

export function buildDsTopicDetailsFromAnswers(
  answers: readonly DsSessionAnswerRecord[],
  examId: string,
  topicOrder: readonly string[],
  topicLabels: Record<string, string>,
  topicStats: Record<string, { correct: number; total: number; acquis: boolean }>,
): DsTopicReportDetail[] {
  const failedByTopic = new Map<string, DsFailedQuestionEntry[]>();
  const seenIdsByTopic = new Map<string, Set<string>>();

  for (const answer of answers) {
    if (answer.outcome !== 0) continue;

    const q = lookupQuestion(answer.sourceId, examId);
    if (!q) continue;

    const resolvedTopic = resolveTopicForAnswer(answer, q, examId);
    const seen = seenIdsByTopic.get(resolvedTopic) ?? new Set<string>();
    if (seen.has(answer.sourceId)) continue;
    seen.add(answer.sourceId);
    seenIdsByTopic.set(resolvedTopic, seen);

    const bucket = failedByTopic.get(resolvedTopic) ?? [];
    bucket.push(buildFailedEntry(q));
    failedByTopic.set(resolvedTopic, bucket);
  }

  for (const [topic, entries] of failedByTopic) {
    entries.sort((a, b) => a.sortIndex - b.sortIndex);
    failedByTopic.set(topic, entries);
  }

  return topicOrder.map((topic) => {
    const stat = topicStats[topic];
    return {
      topic,
      label: topicLabels[topic] ?? topic,
      acquis: Boolean(stat?.acquis),
      correct: stat?.correct ?? 0,
      total: stat?.total ?? 0,
      failedQuestions: stat?.acquis ? [] : (failedByTopic.get(topic) ?? []),
    };
  });
}

export function buildDsTopicDetailsFromSession(
  session: {
    answers?: DsSessionAnswerRecord[];
    topicStats?: Record<string, { correct: number; total: number; acquis: boolean }>;
  } | null | undefined,
  examId: string,
  topicOrder: readonly string[],
  topicLabels: Record<string, string>,
): DsTopicReportDetail[] {
  const answers = session?.answers ?? [];
  const isTerminale = examId === DS_SDGN_TERMINALE_QCM_EXAM_ID;

  let topicStats = session?.topicStats ?? {};
  if (answers.length > 0) {
    const resolved = resolveDsAnswersForTopicStats(answers, examId);
    topicStats = isTerminale
      ? computeTerminaleTopicStats(resolved as Parameters<typeof computeTerminaleTopicStats>[0])
      : computeTopicStats(resolved as Parameters<typeof computeTopicStats>[0]);
  }

  return buildDsTopicDetailsFromAnswers(answers, examId, topicOrder, topicLabels, topicStats);
}

export function getPrimaryTopicForQuestionId(sourceId: string, examId: string): string | null {
  const q = lookupQuestion(sourceId, examId);
  if (!q) return null;
  return examId === DS_SDGN_TERMINALE_QCM_EXAM_ID
    ? getPrimaryDsSdgnTerminaleTopic(q)
    : getPrimaryDsSdgnTopic(q);
}
