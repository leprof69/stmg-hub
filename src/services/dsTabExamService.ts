import { deleteField, getDoc, updateDoc } from "firebase/firestore";
import {
  computeDsGradeOn20,
  computeDsScoreFromAnswers,
  computeTopicStats,
} from "../lib/dsSdgnGrading";
import type { DsSdgnPremiereTopic } from "../lib/dsSdgnQcmTopics";
import { rebuildQuestionIdsForResume } from "../lib/dsSdgnQcmDeck";
import { userDocRef } from "./userProfileService";

export const DS_SDGN_QCM_EXAM_ID = "sdgn_premiere_qcm_v1";

export type DsSessionAnswerRecord = {
  sourceId: string;
  topic: DsSdgnPremiereTopic;
  outcome: 0 | 1;
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
  gradeOn20Provisional?: number;
  status: DsSessionStatus;
  completed: boolean;
  questionIds: string[];
  answers: DsSessionAnswerRecord[];
  topicStats: Record<DsSdgnPremiereTopic, import("../lib/dsSdgnGrading").DsTopicStat>;
  /** Temps restant global (s) au moment de l\u2019arr\u00eat. */
  sessionLeftSec?: number;
  /** Index de la prochaine question (= nombre de r\u00e9ponses d\u00e9j\u00e0 enregistr\u00e9es). */
  resumeIndex?: number;
};

export type DsTabResultPayload = {
  score: number;
  total: number;
  skipped: number;
  forcedZero: boolean;
  finishedAt: string;
  gradeOn20: number;
  session: DsSessionRecord;
  resumeGranted?: boolean;
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
  topicStats: Record<DsSdgnPremiereTopic, import("../lib/dsSdgnGrading").DsTopicStat>;
  sessionLeftSec?: number;
  resumeIndex?: number;
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
      input.status === "incomplete" || input.status === "disqualified"
        ? computeDsGradeOn20(input.scorePoints, input.totalQuestions, false)
        : undefined,
    status: input.status,
    completed,
    questionIds: input.questionIds,
    answers: input.answers,
    topicStats: input.topicStats,
    sessionLeftSec: input.sessionLeftSec,
    resumeIndex: input.resumeIndex,
  };
}

function readDsTabRoot(
  userData: Record<string, unknown> | null | undefined,
): Record<string, unknown> | null {
  const tab = (userData?.dsTab as Record<string, unknown> | undefined)?.[DS_SDGN_QCM_EXAM_ID];
  if (!tab || typeof tab !== "object") return null;
  return tab as Record<string, unknown>;
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
      sessionLeftSec: session.sessionLeftSec,
      resumeIndex: session.resumeIndex,
    },
  };

  const patch: Record<string, unknown> = {
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
  };

  if (payload.resumeGranted !== undefined) {
    patch[`${base}.resumeGranted`] = payload.resumeGranted;
  }

  await updateDoc(userDocRef(uid), patch);
}

export async function markDsAttemptStarted(uid: string, sessionId: string): Promise<void> {
  await updateDoc(userDocRef(uid), {
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.examId`]: DS_SDGN_QCM_EXAM_ID,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.attemptStarted`]: true,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.startedAt`]: new Date().toISOString(),
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.currentSessionId`]: sessionId,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.resumeGranted`]: false,
  });
}

export function readDsTabExamMeta(
  userData: Record<string, unknown> | null | undefined,
): { attemptStarted: boolean; startedAt?: string; resumeGranted: boolean } {
  const examTab = readDsTabRoot(userData);
  if (!examTab) return { attemptStarted: false, resumeGranted: false };
  return {
    attemptStarted: Boolean(examTab.attemptStarted),
    startedAt: typeof examTab.startedAt === "string" ? examTab.startedAt : undefined,
    resumeGranted: Boolean(examTab.resumeGranted),
  };
}

export function readDsTabLastSession(
  userData: Record<string, unknown> | null | undefined,
): DsSessionRecord | null {
  const examTab = readDsTabRoot(userData);
  if (!examTab) return null;
  const last = examTab.lastSession;
  if (!last || typeof last !== "object") return null;
  return normalizeDsSessionRecord(last as DsSessionRecord);
}

function normalizeDsSessionRecord(session: DsSessionRecord): DsSessionRecord {
  const answered = session.questionsAnswered ?? session.answers?.length ?? 0;
  const total = session.totalQuestions ?? 0;
  let status = session.status;
  if (!status) {
    if (session.forcedZero) status = "disqualified";
    else if (answered > 0 && answered < total) status = "incomplete";
    else status = "completed";
  }
  const completed = session.completed ?? status === "completed";
  const scorePoints =
    session.scorePoints ??
    (session.answers?.length ? computeDsScoreFromAnswers(session.answers) : 0);
  return {
    ...session,
    scorePoints,
    questionsAnswered: answered,
    status,
    completed,
    resumeIndex: session.resumeIndex ?? answered,
    gradeOn20Provisional:
      status === "incomplete" || status === "disqualified"
        ? session.gradeOn20Provisional ??
          computeDsGradeOn20(scorePoints, total, false)
        : session.gradeOn20Provisional,
  };
}

/** L\u2019\u00e9l\u00e8ve peut reprendre l\u00e0 o\u00f9 il s\u2019est arr\u00eat\u00e9 (apr\u00e8s action prof). */
export function canStudentResumeDsSdgnExam(
  userData: Record<string, unknown> | null | undefined,
): boolean {
  const meta = readDsTabExamMeta(userData);
  if (!meta.resumeGranted) return false;
  const session = readDsTabLastSession(userData);
  const questionIds = session ? rebuildQuestionIdsForResume(session) : null;
  if (!questionIds?.length) return false;
  const answered = session?.answers?.length ?? 0;
  const total = session?.totalQuestions ?? questionIds.length;
  return answered < total;
}

/** Une tentative termin\u00e9e bloque une nouvelle session ; reprise autoris\u00e9e = exception. */
export function isDsSdgnExamLocked(
  userData: Record<string, unknown> | null | undefined,
): boolean {
  if (canStudentResumeDsSdgnExam(userData)) return false;

  const session = readDsTabLastSession(userData);
  if (session?.status === "completed" && session.completed && !session.forcedZero) {
    return true;
  }

  const meta = readDsTabExamMeta(userData);
  if (meta.attemptStarted) return true;
  return session !== null;
}

export async function resetDsSdgnTabExamForUser(uid: string): Promise<void> {
  await updateDoc(userDocRef(uid), {
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}`]: deleteField(),
  });
}

export type GrantDsSdgnResumeResult = {
  scorePoints: number;
  gradeOn20Provisional: number;
  questionsAnswered: number;
  totalQuestions: number;
  sessionLeftSec: number;
};

/**
 * Prof : autorise l\u2019\u00e9l\u00e8ve \u00e0 reprendre le DS (m\u00eame questions, score conserv\u00e9).
 */
export async function grantDsSdgnExamResume(uid: string): Promise<GrantDsSdgnResumeResult | null> {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) return null;

  const userData = snap.data() as Record<string, unknown>;
  const session = readDsTabLastSession(userData);
  if (!session) return null;

  const answers = session.answers ?? [];
  const questionIds = rebuildQuestionIdsForResume(session);
  if (!questionIds?.length) return null;
  const totalQuestions = session.totalQuestions ?? questionIds.length;
  if (answers.length >= totalQuestions) return null;

  const scorePoints = computeDsScoreFromAnswers(answers);
  const gradeOn20Provisional = computeDsGradeOn20(scorePoints, totalQuestions, false);
  const sessionLeftSec = session.sessionLeftSec ?? 50 * 60;

  const updatedSession: DsSessionRecord = {
    ...session,
    questionIds,
    totalQuestions,
    scorePoints,
    forcedZero: false,
    status: "incomplete",
    completed: false,
    gradeOn20: 0,
    gradeOn20Provisional,
    questionsAnswered: answers.length,
    resumeIndex: answers.length,
    sessionLeftSec,
    correctCount: answers.filter((a) => a.outcome === 1).length,
    wrongCount: answers.filter((a) => a.outcome === 0).length,
    topicStats: computeTopicStats(answers),
  };

  const base = `dsTab.${DS_SDGN_QCM_EXAM_ID}`;
  await updateDoc(userDocRef(uid), {
    [`${base}.resumeGranted`]: true,
    [`${base}.forcedZero`]: false,
    [`${base}.score`]: scorePoints,
    [`${base}.gradeOn20`]: gradeOn20Provisional,
    [`${base}.lastSession`]: updatedSession,
    [`${base}.sessions.${session.sessionId}`]: {
      sessionId: updatedSession.sessionId,
      finishedAt: updatedSession.finishedAt,
      startedAt: updatedSession.startedAt,
      gradeOn20: gradeOn20Provisional,
      scorePoints,
      totalQuestions,
      forcedZero: false,
      topicStats: updatedSession.topicStats,
      correctCount: updatedSession.correctCount,
      wrongCount: updatedSession.wrongCount,
      skippedCount: updatedSession.skippedCount,
      status: "incomplete",
      completed: false,
      questionsAnswered: answers.length,
      sessionLeftSec,
      resumeIndex: answers.length,
    },
  });

  return {
    scorePoints,
    gradeOn20Provisional,
    questionsAnswered: answers.length,
    totalQuestions,
    sessionLeftSec,
  };
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
