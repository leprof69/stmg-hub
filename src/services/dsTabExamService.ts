import { deleteField, updateDoc } from "firebase/firestore";
import type { DsAnswerOutcomeCode, DsTopicStat } from "../lib/dsSdgnGrading";
import type { DsSdgnPremiereTopic } from "../lib/dsSdgnQcmTopics";
import { userDocRef } from "./userProfileService";

export const DS_SDGN_QCM_EXAM_ID = "sdgn_premiere_qcm_v1";

export type DsSessionAnswerRecord = {
  sourceId: string;
  topic: DsSdgnPremiereTopic;
  outcome: DsAnswerOutcomeCode;
  picked?: 0 | 1 | 2 | 3;
  scenarioTitle?: string;
  scenarioText?: string;
};

export type DsSessionStatus = "completed" | "incomplete" | "disqualified";

export type DsSessionRecord = {
  sessionId: string;
  examId: string;
  startedAt: string;
  finishedAt: string;
  scorePoints: number;
  totalQuestions: number;
  questionsAnswered: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  forcedZero: boolean;
  gradeOn20: number;
  /** Note calculee sur le nombre de questions prevues (meme si non termine). */
  gradeOn20Provisional?: number;
  status: DsSessionStatus;
  completed: boolean;
  questionIds: string[];
  answers: DsSessionAnswerRecord[];
  topicStats: Record<DsSdgnPremiereTopic, DsTopicStat>;
};

export type DsTabResultPayload = {
  score: number;
  total: number;
  skipped: number;
  forcedZero: boolean;
  finishedAt: string;
  gradeOn20: number;
  session: DsSessionRecord;
};

const MAX_SESSION_HISTORY = 12;

export type BuildDsSessionInput = {
  sessionId: string;
  startedAt: string;
  finishedAt: string;
  scorePoints: number;
  totalQuestions: number;
  questionsAnswered: number;
  correctCount: number;
  wrongCount: number;
  skippedCount: number;
  forcedZero: boolean;
  gradeOn20: number;
  status: DsSessionStatus;
  questionIds: string[];
  answers: DsSessionAnswerRecord[];
  topicStats: Record<DsSdgnPremiereTopic, DsTopicStat>;
};

export function buildDsSessionRecord(input: BuildDsSessionInput): DsSessionRecord {
  const completed = input.status === "completed";
  return {
    sessionId: input.sessionId,
    examId: DS_SDGN_QCM_EXAM_ID,
    startedAt: input.startedAt,
    finishedAt: input.finishedAt,
    scorePoints: input.scorePoints,
    totalQuestions: input.totalQuestions,
    questionsAnswered: input.questionsAnswered,
    correctCount: input.correctCount,
    wrongCount: input.wrongCount,
    skippedCount: input.skippedCount,
    forcedZero: input.forcedZero,
    gradeOn20: input.gradeOn20,
    gradeOn20Provisional:
      input.status === "incomplete" ? input.gradeOn20 : undefined,
    status: input.status,
    completed,
    questionIds: input.questionIds,
    answers: input.answers,
    topicStats: input.topicStats,
  };
}

export async function persistDsTabResult(uid: string, payload: DsTabResultPayload): Promise<void> {
  const base = `dsTab.${DS_SDGN_QCM_EXAM_ID}`;
  const session = payload.session;
  const historyPatch: Record<string, unknown> = {
    [`${base}.sessions.${session.sessionId}`]: {
      sessionId: session.sessionId,
      finishedAt: session.finishedAt,
      startedAt: session.startedAt,
      gradeOn20: session.gradeOn20,
      scorePoints: session.scorePoints,
      totalQuestions: session.totalQuestions,
      forcedZero: session.forcedZero,
      topicStats: session.topicStats,
      correctCount: session.correctCount,
      wrongCount: session.wrongCount,
      skippedCount: session.skippedCount,
      status: session.status,
      completed: session.completed,
      questionsAnswered: session.questionsAnswered,
    },
  };

  await updateDoc(userDocRef(uid), {
    [`${base}.examId`]: DS_SDGN_QCM_EXAM_ID,
    [`${base}.score`]: payload.score,
    [`${base}.total`]: payload.total,
    [`${base}.skipped`]: payload.skipped,
    [`${base}.forcedZero`]: payload.forcedZero,
    [`${base}.finishedAt`]: payload.finishedAt,
    [`${base}.gradeOn20`]: payload.gradeOn20,
    [`${base}.lastSessionId`]: session.sessionId,
    [`${base}.lastSession`]: session,
    ...historyPatch,
  });
}

export async function markDsAttemptStarted(uid: string, sessionId: string): Promise<void> {
  await updateDoc(userDocRef(uid), {
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.examId`]: DS_SDGN_QCM_EXAM_ID,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.attemptStarted`]: true,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.startedAt`]: new Date().toISOString(),
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.currentSessionId`]: sessionId,
  });
}

export function readDsTabExamMeta(
  userData: Record<string, unknown> | null | undefined,
): { attemptStarted: boolean; startedAt?: string } {
  const tab = (userData?.dsTab as Record<string, unknown> | undefined)?.[DS_SDGN_QCM_EXAM_ID];
  if (!tab || typeof tab !== "object") return { attemptStarted: false };
  const examTab = tab as Record<string, unknown>;
  return {
    attemptStarted: Boolean(examTab.attemptStarted),
    startedAt: typeof examTab.startedAt === "string" ? examTab.startedAt : undefined,
  };
}

/** Lecture c\u00f4t\u00e9 admin : derni\u00e8re session (terminee ou non). */
export function readDsTabLastSession(
  userData: Record<string, unknown> | null | undefined,
): DsSessionRecord | null {
  const tab = (userData?.dsTab as Record<string, unknown> | undefined)?.[DS_SDGN_QCM_EXAM_ID];
  if (!tab || typeof tab !== "object") return null;
  const examTab = tab as Record<string, unknown>;
  const last = examTab.lastSession;
  if (!last || typeof last !== "object") return null;
  const session = last as DsSessionRecord;
  return normalizeDsSessionRecord(session);
}

function normalizeDsSessionRecord(session: DsSessionRecord): DsSessionRecord {
  const answered =
    session.questionsAnswered ??
    session.answers?.length ??
    0;
  const total = session.totalQuestions ?? 0;
  let status = session.status;
  if (!status) {
    if (session.forcedZero) status = "disqualified";
    else if (answered > 0 && answered < total) status = "incomplete";
    else status = "completed";
  }
  const completed = session.completed ?? status === "completed";
  return {
    ...session,
    questionsAnswered: answered,
    status,
    completed,
    gradeOn20Provisional:
      status === "incomplete" ? session.gradeOn20Provisional ?? session.gradeOn20 : session.gradeOn20Provisional,
  };
}

/** Une tentative lanc\u00e9e ou enregistr\u00e9e bloque une nouvelle session jusqu'\u00e0 reset admin. */
export function isDsSdgnExamLocked(
  userData: Record<string, unknown> | null | undefined,
): boolean {
  const meta = readDsTabExamMeta(userData);
  if (meta.attemptStarted) return true;
  return readDsTabLastSession(userData) !== null;
}

export async function resetDsSdgnTabExamForUser(uid: string): Promise<void> {
  await updateDoc(userDocRef(uid), {
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}`]: deleteField(),
  });
}

export function trimDsSessionHistory(
  sessions: Record<string, unknown> | undefined,
): Record<string, unknown> {
  if (!sessions) return {};
  const entries = Object.entries(sessions).sort(([, a], [, b]) => {
    const da = String((a as { finishedAt?: string })?.finishedAt ?? "");
    const db = String((b as { finishedAt?: string })?.finishedAt ?? "");
    return db.localeCompare(da);
  });
  return Object.fromEntries(entries.slice(0, MAX_SESSION_HISTORY));
}
