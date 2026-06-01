import { deleteField, getDoc, updateDoc } from "firebase/firestore";
import {
  buildEmptyTopicStats,
  computeDsGradeOn20,
  computeDsScoreFromAnswers,
  computeTopicStats,
} from "../lib/dsSdgnGrading";
import type { DsSdgnPremiereTopic } from "../lib/dsSdgnQcmTopics";
import {
  DS_SCORE_CORRECT,
  DS_SCORE_WRONG,
  rebuildQuestionIdsForResume,
} from "../lib/dsSdgnQcmDeck";
import { rebuildTerminaleQuestionIdsForResume } from "../lib/dsSdgnTerminaleQcmDeck";
import { userDocRef } from "./userProfileService";

export const DS_SDGN_QCM_EXAM_ID = "sdgn_premiere_qcm_v1";
export const DS_SDGN_TERMINALE_QCM_EXAM_ID = "sdgn_terminale_qcm_v1";

export type DsSessionAnswerRecord = {
  sourceId: string;
  topic: DsSdgnPremiereTopic | string;
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
  topicStats: Record<DsSdgnPremiereTopic, import("../lib/dsSdgnGrading").DsTopicStat> | Record<string, import("../lib/dsSdgnGrading").DsTopicStat>;
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

/** Firestore refuse les champs undefined (erreur silencieuse cote client). */
function stripUndefinedDeep(value: unknown): unknown {
  if (value === undefined) return undefined;
  if (value === null) return null;
  if (Array.isArray(value)) {
    return value
      .map((item) => stripUndefinedDeep(item))
      .filter((item) => item !== undefined);
  }
  if (typeof value !== "object") return value;
  const out: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(value as Record<string, unknown>)) {
    const cleaned = stripUndefinedDeep(val);
    if (cleaned !== undefined) out[key] = cleaned;
  }
  return out;
}

function firestorePatch(patch: Record<string, unknown>): Record<string, unknown> {
  return stripUndefinedDeep(patch) as Record<string, unknown>;
}

export type BuildDsSessionInput = {
  sessionId: string;
  examId?: string;
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
  topicStats: Record<DsSdgnPremiereTopic, import("../lib/dsSdgnGrading").DsTopicStat> | Record<string, import("../lib/dsSdgnGrading").DsTopicStat>;
  sessionLeftSec?: number;
  resumeIndex?: number;
};

export function buildDsSessionRecord(input: BuildDsSessionInput): DsSessionRecord {
  const completed = input.status === "completed";
  const examId = input.examId ?? DS_SDGN_QCM_EXAM_ID;
  const record: DsSessionRecord = {
    sessionId: input.sessionId,
    examId,
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
    status: input.status,
    completed,
    questionIds: input.questionIds,
    answers: input.answers,
    topicStats: input.topicStats,
  };
  if (input.status === "incomplete" || input.status === "disqualified") {
    record.gradeOn20Provisional = computeDsGradeOn20(
      input.scorePoints,
      input.totalQuestions,
      false,
    );
  }
  if (input.sessionLeftSec != null) record.sessionLeftSec = input.sessionLeftSec;
  if (input.resumeIndex != null) record.resumeIndex = input.resumeIndex;
  return record;
}

function parseFlexibleNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const trimmed = value.trim().replace(",", ".");
    if (!trimmed) return null;
    const n = Number(trimmed);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function asNumber(value: unknown): number | null {
  return parseFlexibleNumber(value);
}

/** Champs dsTab aplatis par erreur sur le document racine (import / ancienne ecriture). */
function readLegacyFlatDsTabExam(
  userData: Record<string, unknown>,
): Record<string, unknown> | null {
  const prefix = `dsTab.${DS_SDGN_QCM_EXAM_ID}.`;
  const exam: Record<string, unknown> = {};
  let found = false;
  for (const [key, value] of Object.entries(userData)) {
    if (!key.startsWith(prefix)) continue;
    found = true;
    exam[key.slice(prefix.length)] = value;
  }
  return found ? exam : null;
}

function examTabActivityMetric(tab: Record<string, unknown>): number {
  const grade = parseFlexibleNumber(tab.gradeOn20) ?? 0;
  const score = parseFlexibleNumber(tab.score) ?? 0;
  const last = tab.lastSession;
  const prov =
    last && typeof last === "object"
      ? parseFlexibleNumber((last as Record<string, unknown>).gradeOn20Provisional) ?? 0
      : 0;
  let answered = 0;
  if (last && typeof last === "object") {
    const ls = last as Record<string, unknown>;
    answered = Number(ls.questionsAnswered) || 0;
    if (!answered && Array.isArray(ls.answers)) {
      answered = ls.answers.length;
    }
  }
  return Math.max(grade * 1000, prov * 1000, score, answered);
}

function pickExamTabFromDsTabContainer(
  dsTab: Record<string, unknown>,
): Record<string, unknown> | null {
  const candidates: Record<string, unknown>[] = [];
  const direct = dsTab[DS_SDGN_QCM_EXAM_ID];
  if (direct && typeof direct === "object") {
    candidates.push(direct as Record<string, unknown>);
  }

  for (const value of Object.values(dsTab)) {
    if (!value || typeof value !== "object" || Array.isArray(value)) continue;
    const candidate = value as Record<string, unknown>;
    if (
      parseFlexibleNumber(candidate.gradeOn20) != null ||
      parseFlexibleNumber(candidate.score) != null ||
      candidate.lastSession ||
      candidate.attemptStarted ||
      candidate.examId === DS_SDGN_QCM_EXAM_ID
    ) {
      candidates.push(candidate);
    }
  }

  if (
    parseFlexibleNumber(dsTab.gradeOn20) != null ||
    parseFlexibleNumber(dsTab.score) != null ||
    dsTab.lastSession ||
    dsTab.attemptStarted
  ) {
    candidates.push(dsTab);
  }

  if (!candidates.length) return null;

  let best = candidates[0];
  let bestMetric = examTabActivityMetric(best);
  for (let i = 1; i < candidates.length; i += 1) {
    const metric = examTabActivityMetric(candidates[i]);
    if (metric > bestMetric) {
      best = candidates[i];
      bestMetric = metric;
    }
  }
  return best;
}

/** Reponses allegees (sans texte de scenario) pour tenir dans le doc Firestore users. */
export function slimDsSessionForFirestore(session: DsSessionRecord): DsSessionRecord {
  const slim: DsSessionRecord = {
    ...session,
    answers: (session.answers ?? []).map((a) => ({
      sourceId: a.sourceId,
      topic: a.topic,
      outcome: a.outcome,
      ...(a.picked != null ? { picked: a.picked } : {}),
    })),
  };
  return firestorePatch(slim as unknown as Record<string, unknown>) as DsSessionRecord;
}

export type DsSdgnPremiereLastSnapshot = {
  gradeOn20: number;
  scorePoints: number;
  totalQuestions: number;
  questionsAnswered: number;
  status: DsSessionStatus;
  forcedZero: boolean;
  finishedAt: string;
  updatedAt: string;
};

export type DsSdgnTerminaleLastSnapshot = DsSdgnPremiereLastSnapshot;

function resolveExamId(examId?: string): string {
  return examId ?? DS_SDGN_QCM_EXAM_ID;
}

function dsLastSnapshotKey(examId: string): "dsSdgnPremiereLast" | "dsSdgnTerminaleLast" {
  return examId === DS_SDGN_TERMINALE_QCM_EXAM_ID
    ? "dsSdgnTerminaleLast"
    : "dsSdgnPremiereLast";
}

function readDsSdgnLastSnapshot(
  userData: Record<string, unknown> | null | undefined,
  examId: string,
): DsSdgnPremiereLastSnapshot | null {
  if (!userData) return null;
  const key = dsLastSnapshotKey(examId);
  const snap = userData[key];
  if (!snap || typeof snap !== "object") return null;
  const rec = snap as Record<string, unknown>;
  const grade = parseFlexibleNumber(rec.gradeOn20);
  if (grade == null || grade < 0) return null;
  return {
    gradeOn20: grade,
    scorePoints: parseFlexibleNumber(rec.scorePoints) ?? 0,
    totalQuestions: parseFlexibleNumber(rec.totalQuestions) ?? 0,
    questionsAnswered: Number(rec.questionsAnswered) || 0,
    status: (rec.status as DsSessionStatus) ?? "incomplete",
    forcedZero: Boolean(rec.forcedZero),
    finishedAt: typeof rec.finishedAt === "string" ? rec.finishedAt : "",
    updatedAt: typeof rec.updatedAt === "string" ? rec.updatedAt : "",
  };
}

function readDsSdgnPremiereLastSnapshot(
  userData: Record<string, unknown> | null | undefined,
): DsSdgnPremiereLastSnapshot | null {
  return readDsSdgnLastSnapshot(userData, DS_SDGN_QCM_EXAM_ID);
}

function collectGradesFromSessionsMap(
  tab: Record<string, unknown>,
  out: number[],
): void {
  const sessions = tab.sessions;
  if (!sessions || typeof sessions !== "object" || Array.isArray(sessions)) return;
  for (const entry of Object.values(sessions as Record<string, unknown>)) {
    if (!entry || typeof entry !== "object") continue;
    const rec = entry as Record<string, unknown>;
    const g = parseFlexibleNumber(rec.gradeOn20);
    if (g != null && g > 0) out.push(g);
    const score = parseFlexibleNumber(rec.scorePoints);
    const total = parseFlexibleNumber(rec.totalQuestions);
    if (score != null && total != null && total > 0) {
      out.push(computeDsGradeOn20(score, total, false));
    }
  }
}

/** Parcourt tout le document utilisateur (dsTab parfois imbrique autrement). */
function deepFindExamTabInTree(
  value: unknown,
  depth = 0,
): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || depth > 12) return null;

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = deepFindExamTabInTree(item, depth + 1);
      if (found) return found;
    }
    return null;
  }

  const rec = value as Record<string, unknown>;
  const grade = parseFlexibleNumber(rec.gradeOn20);
  const hasExamMarker =
    rec.examId === DS_SDGN_QCM_EXAM_ID ||
    rec.lastSession != null ||
    rec.attemptStarted === true ||
    parseFlexibleNumber(rec.score) != null;

  if (grade != null && hasExamMarker) return rec;
  if (rec.examId === DS_SDGN_QCM_EXAM_ID) return rec;

  for (const child of Object.values(rec)) {
    const found = deepFindExamTabInTree(child, depth + 1);
    if (found) return found;
  }
  return null;
}

function readDsTabRoot(
  userData: Record<string, unknown> | null | undefined,
  examId: string = DS_SDGN_QCM_EXAM_ID,
): Record<string, unknown> | null {
  if (!userData) return null;

  const dsTab = userData.dsTab;
  if (dsTab && typeof dsTab === "object" && !Array.isArray(dsTab)) {
    const direct = (dsTab as Record<string, unknown>)[examId];
    if (direct && typeof direct === "object" && !Array.isArray(direct)) {
      return direct as Record<string, unknown>;
    }
    if (examId === DS_SDGN_QCM_EXAM_ID) {
      const fromContainer = pickExamTabFromDsTabContainer(dsTab as Record<string, unknown>);
      if (fromContainer) return fromContainer;
    }
  }

  if (examId === DS_SDGN_QCM_EXAM_ID) {
    const legacyFlat = readLegacyFlatDsTabExam(userData);
    if (legacyFlat) return legacyFlat;
    return deepFindExamTabInTree(userData);
  }

  return null;
}

export async function persistDsTabResult(uid: string, payload: DsTabResultPayload): Promise<void> {
  const examId = payload.session.examId ?? DS_SDGN_QCM_EXAM_ID;
  const base = `dsTab.${examId}`;
  const session = slimDsSessionForFirestore(payload.session);
  const gradeOn20 = Math.max(
    payload.gradeOn20,
    computeDsGradeOn20(payload.score, payload.total, false),
    session.gradeOn20Provisional ?? 0,
  );

  const snapshot: DsSdgnPremiereLastSnapshot = {
    gradeOn20,
    scorePoints: payload.score,
    totalQuestions: payload.total,
    questionsAnswered: session.questionsAnswered ?? session.answers?.length ?? 0,
    status: session.status,
    forcedZero: payload.forcedZero,
    finishedAt: payload.finishedAt,
    updatedAt: new Date().toISOString(),
  };

  const profileSnap = await getDoc(userDocRef(uid));
  const profile = profileSnap.exists()
    ? (profileSnap.data() as Record<string, unknown>)
    : undefined;
  const isAdminUser = profile?.role === "admin";

  const payloadForSync: DsTabResultPayload = {
    ...payload,
    gradeOn20,
    session,
  };

  if (!isAdminUser) {
    const { syncDsSdgnResultSummary } = await import("./dsSdgnResultsService");
    const { writeDsSdgnNote } = await import("./dsSdgnNotesService");
    try {
      await writeDsSdgnNote({
        uid,
        prenom: typeof profile?.prenom === "string" ? profile.prenom : undefined,
        nom: typeof profile?.nom === "string" ? profile.nom : undefined,
        email: typeof profile?.email === "string" ? profile.email : undefined,
        classe: typeof profile?.classe === "string" ? profile.classe : undefined,
        gradeOn20,
        scorePoints: payload.score,
        totalQuestions: payload.total,
        questionsAnswered: session.questionsAnswered ?? session.answers?.length ?? 0,
        status: session.status,
        updatedAt: snapshot.updatedAt,
      });
    } catch (err) {
      console.warn("dsSdgnNotes non enregistre", err);
    }
    try {
      await syncDsSdgnResultSummary(uid, payloadForSync, profile);
    } catch (err) {
      console.warn("dsSdgnResults non synchronise", err);
    }
  }

  const historyPatch: Record<string, unknown> = {
    [`${base}.sessions.${session.sessionId}`]: {
      sessionId: session.sessionId,
      finishedAt: session.finishedAt,
      startedAt: session.startedAt,
      gradeOn20: gradeOn20,
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
    [dsLastSnapshotKey(examId)]: snapshot,
    [`${base}.examId`]: examId,
    [`${base}.score`]: payload.score,
    [`${base}.total`]: payload.total,
    [`${base}.skipped`]: payload.skipped,
    [`${base}.forcedZero`]: payload.forcedZero,
    [`${base}.finishedAt`]: payload.finishedAt,
    [`${base}.gradeOn20`]: gradeOn20,
    [`${base}.lastSessionId`]: session.sessionId,
    [`${base}.lastSession`]: session,
    ...(isAdminUser ? {} : historyPatch),
  };

  if (payload.resumeGranted !== undefined) {
    patch[`${base}.resumeGranted`] = payload.resumeGranted;
  }

  const essentialPatch = firestorePatch({
    [dsLastSnapshotKey(examId)]: snapshot,
    [`${base}.examId`]: examId,
    [`${base}.gradeOn20`]: gradeOn20,
    [`${base}.score`]: payload.score,
    [`${base}.total`]: payload.total,
    [`${base}.finishedAt`]: payload.finishedAt,
    [`${base}.forcedZero`]: payload.forcedZero,
    [`${base}.lastSessionId`]: session.sessionId,
    [`${base}.lastSession`]: session,
  });

  try {
    await updateDoc(userDocRef(uid), firestorePatch(patch));
  } catch (err) {
    console.error(
      "dsTab complet non enregistre (copie trop lourde ?) — repli sur champs essentiels",
      err,
    );
    try {
      await updateDoc(userDocRef(uid), essentialPatch);
    } catch (err2) {
      console.error("dsTab repli essentiel echoue — snapshot minimal", err2);
      await updateDoc(
        userDocRef(uid),
        firestorePatch({
          [dsLastSnapshotKey(examId)]: snapshot,
          [`${base}.gradeOn20`]: gradeOn20,
          [`${base}.score`]: payload.score,
          [`${base}.total`]: payload.total,
          [`${base}.finishedAt`]: payload.finishedAt,
          [`${base}.lastSessionId`]: session.sessionId,
        }),
      );
    }
  }
}

/** Sauvegarde intermediaire (reponses + score) pour ne pas perdre la copie en cours. */
export async function persistDsTabCheckpoint(
  uid: string,
  input: {
    examId?: string;
    sessionId: string;
    startedAt: string;
    scorePoints: number;
    totalQuestions: number;
    answers: DsSessionAnswerRecord[];
    questionIds: string[];
    sessionLeftSec: number;
    topicStats?: Record<string, import("../lib/dsSdgnGrading").DsTopicStat>;
  },
): Promise<void> {
  const examId = resolveExamId(input.examId);
  const slimAnswers: DsSessionAnswerRecord[] = input.answers.map((a) => ({
    sourceId: a.sourceId,
    topic: a.topic,
    outcome: a.outcome,
    ...(a.picked != null ? { picked: a.picked } : {}),
  }));
  const gradeOn20Provisional = computeDsGradeOn20(
    input.scorePoints,
    input.totalQuestions,
    false,
  );
  const partial: DsSessionRecord = {
    sessionId: input.sessionId,
    examId,
    startedAt: input.startedAt,
    finishedAt: "",
    scorePoints: input.scorePoints,
    totalQuestions: input.totalQuestions,
    questionsAnswered: slimAnswers.length,
    correctCount: slimAnswers.filter((a) => a.outcome === 1).length,
    wrongCount: slimAnswers.filter((a) => a.outcome === 0).length,
    skippedCount: 0,
    forcedZero: false,
    gradeOn20: 0,
    gradeOn20Provisional,
    status: "incomplete",
    completed: false,
    questionIds: input.questionIds,
    answers: slimAnswers,
    topicStats:
      input.topicStats ??
      computeTopicStats(
        slimAnswers as { topic: DsSdgnPremiereTopic; outcome: 0 | 1 }[],
      ),
    sessionLeftSec: input.sessionLeftSec,
    resumeIndex: slimAnswers.length,
  };
  const base = `dsTab.${examId}`;
  const snapshot: DsSdgnPremiereLastSnapshot = {
    gradeOn20: gradeOn20Provisional,
    scorePoints: input.scorePoints,
    totalQuestions: input.totalQuestions,
    questionsAnswered: slimAnswers.length,
    status: "incomplete",
    forcedZero: false,
    finishedAt: "",
    updatedAt: new Date().toISOString(),
  };

  const profileSnap = await getDoc(userDocRef(uid));
  const profile = profileSnap.exists()
    ? (profileSnap.data() as Record<string, unknown>)
    : undefined;
  const isAdminUser = profile?.role === "admin";

  if (!isAdminUser) {
    const { syncDsSdgnCheckpointSummary } = await import("./dsSdgnResultsService");
    const { writeDsSdgnNote } = await import("./dsSdgnNotesService");
    try {
      await writeDsSdgnNote({
        uid,
        prenom: typeof profile?.prenom === "string" ? profile.prenom : undefined,
        nom: typeof profile?.nom === "string" ? profile.nom : undefined,
        email: typeof profile?.email === "string" ? profile.email : undefined,
        classe: typeof profile?.classe === "string" ? profile.classe : undefined,
        gradeOn20: gradeOn20Provisional,
        scorePoints: input.scorePoints,
        totalQuestions: input.totalQuestions,
        questionsAnswered: slimAnswers.length,
        status: "incomplete",
        updatedAt: snapshot.updatedAt,
      });
    } catch (err) {
      console.warn("dsSdgnNotes checkpoint non enregistre", err);
    }
    try {
      await syncDsSdgnCheckpointSummary(
        uid,
        {
          session: partial,
          gradeOn20: gradeOn20Provisional,
          score: input.scorePoints,
          total: input.totalQuestions,
        },
        profile,
      );
    } catch (err) {
      console.warn("dsSdgnResults checkpoint non synchronise", err);
    }
  }

  await updateDoc(userDocRef(uid), firestorePatch({
    [dsLastSnapshotKey(examId)]: snapshot,
    [`${base}.examId`]: examId,
    [`${base}.attemptStarted`]: true,
    [`${base}.score`]: input.scorePoints,
    [`${base}.total`]: input.totalQuestions,
    [`${base}.gradeOn20`]: gradeOn20Provisional,
    [`${base}.lastSession`]: slimDsSessionForFirestore(partial),
    [`${base}.lastSessionId`]: input.sessionId,
  }));
}

export async function markDsAttemptStarted(
  uid: string,
  sessionId: string,
  examId: string = DS_SDGN_QCM_EXAM_ID,
): Promise<void> {
  await updateDoc(userDocRef(uid), {
    [`dsTab.${examId}.examId`]: examId,
    [`dsTab.${examId}.attemptStarted`]: true,
    [`dsTab.${examId}.startedAt`]: new Date().toISOString(),
    [`dsTab.${examId}.currentSessionId`]: sessionId,
    [`dsTab.${examId}.resumeGranted`]: false,
  });
}

export function readDsTabExamMeta(
  userData: Record<string, unknown> | null | undefined,
  examId: string = DS_SDGN_QCM_EXAM_ID,
): { attemptStarted: boolean; startedAt?: string; resumeGranted: boolean } {
  const examTab = readDsTabRoot(userData, examId);
  if (!examTab) return { attemptStarted: false, resumeGranted: false };
  return {
    attemptStarted: Boolean(examTab.attemptStarted),
    startedAt: typeof examTab.startedAt === "string" ? examTab.startedAt : undefined,
    resumeGranted: Boolean(examTab.resumeGranted),
  };
}

/** Reconstruit une session si lastSession manque mais grade/score sont au niveau dsTab. */
function synthesizeSessionFromExamTab(examTab: Record<string, unknown>): DsSessionRecord | null {
  const gradeOn20 = asNumber(examTab.gradeOn20);
  const scorePoints = asNumber(examTab.score);
  if (gradeOn20 == null && scorePoints == null && !examTab.attemptStarted) return null;

  const forcedZero = Boolean(examTab.forcedZero);
  const totalQuestions = asNumber(examTab.total) ?? 0;
  const finishedAt = typeof examTab.finishedAt === "string" ? examTab.finishedAt : "";
  const startedAt = typeof examTab.startedAt === "string" ? examTab.startedAt : finishedAt;

  return {
    sessionId: String(examTab.lastSessionId ?? examTab.currentSessionId ?? "legacy"),
    examId: DS_SDGN_QCM_EXAM_ID,
    startedAt,
    finishedAt,
    scorePoints: scorePoints ?? 0,
    totalQuestions,
    questionsAnswered: 0,
    correctCount: 0,
    wrongCount: 0,
    skippedCount: asNumber(examTab.skipped) ?? 0,
    forcedZero,
    gradeOn20: forcedZero ? 0 : (gradeOn20 ?? 0),
    gradeOn20Provisional:
      forcedZero && gradeOn20 != null ? gradeOn20 : undefined,
    status: forcedZero ? "disqualified" : "completed",
    completed: !forcedZero,
    questionIds: [],
    answers: [],
    topicStats: buildEmptyTopicStats(),
  };
}

/** Corrige lastSession si le champ racine dsTab a la vraie note (bug anti-triche pass\u00e9). */
function reconcileSessionWithExamTabRoot(
  session: DsSessionRecord,
  examTab: Record<string, unknown>,
): DsSessionRecord {
  const rootGrade = asNumber(examTab.gradeOn20);
  const rootScore = asNumber(examTab.score);
  const rootForced = Boolean(examTab.forcedZero);

  if (rootForced && rootGrade != null && rootGrade > 0) {
    const prov = Math.max(
      rootGrade,
      asNumber(session.gradeOn20Provisional) ?? 0,
      asNumber(session.gradeOn20) ?? 0,
    );
    return {
      ...session,
      forcedZero: true,
      gradeOn20: 0,
      gradeOn20Provisional: prov,
      status: session.status ?? "disqualified",
    };
  }

  if (!rootForced && rootGrade != null && rootGrade > 0 && (session.forcedZero || session.gradeOn20 === 0)) {
    const answered = session.questionsAnswered ?? session.answers?.length ?? 0;
    const total = session.totalQuestions ?? asNumber(examTab.total) ?? 0;
    const incomplete = total > 0 && answered > 0 && answered < total;
    return {
      ...session,
      forcedZero: false,
      gradeOn20: rootGrade,
      scorePoints: rootScore ?? session.scorePoints,
      status: incomplete ? "incomplete" : "completed",
      completed: !incomplete,
      gradeOn20Provisional: incomplete ? rootGrade : undefined,
    };
  }

  if (!rootForced && rootGrade != null && rootGrade > 0 && session.gradeOn20 !== rootGrade) {
    return { ...session, gradeOn20: rootGrade, scorePoints: rootScore ?? session.scorePoints };
  }

  return session;
}

export function readDsTabExamRoot(
  userData: Record<string, unknown> | null | undefined,
  examId: string = DS_SDGN_QCM_EXAM_ID,
): Record<string, unknown> | null {
  return readDsTabRoot(userData, examId);
}

function collectDsGradesFromTree(value: unknown, depth: number, out: number[]): void {
  if (!value || typeof value !== "object" || depth > 24) return;
  if (Array.isArray(value)) {
    for (const item of value) collectDsGradesFromTree(item, depth + 1, out);
    return;
  }
  const rec = value as Record<string, unknown>;
  for (const key of ["gradeOn20", "gradeOn20Provisional"] as const) {
    const n = parseFlexibleNumber(rec[key]);
    if (n != null && n > 0) out.push(n);
  }
  for (const child of Object.values(rec)) {
    collectDsGradesFromTree(child, depth + 1, out);
  }
}

/**
 * Meilleure note /20 dans dsTab (racine, lastSession, sessions, champs aplatis).
 * Indispensable quand forcedZero met gradeOn20 a 0 mais garde la note en provisional.
 */
export function resolveDsGradeOn20FromUser(
  userData: Record<string, unknown> | null | undefined,
  examId: string = DS_SDGN_QCM_EXAM_ID,
): number {
  if (!userData) return 0;
  const grades: number[] = [];

  const lastSnap = readDsSdgnLastSnapshot(userData, examId);
  if (lastSnap && lastSnap.gradeOn20 > 0) {
    grades.push(lastSnap.gradeOn20);
    const fromSnap = computeDsGradeOn20(
      lastSnap.scorePoints,
      lastSnap.totalQuestions,
      false,
    );
    if (fromSnap > 0) grades.push(fromSnap);
  }

  const tab = readDsTabRoot(userData, examId);
  if (tab) {
    collectDsGradesFromTree(tab, 0, grades);
    collectGradesFromSessionsMap(tab, grades);
    const score = parseFlexibleNumber(tab.score);
    const total = parseFlexibleNumber(tab.total);
    if (score != null && total != null && total > 0) {
      grades.push(computeDsGradeOn20(score, total, false));
    }
  }

  const prefix = `dsTab.${examId}.`;
  for (const [key, val] of Object.entries(userData)) {
    if (!key.startsWith(prefix)) continue;
    if (!key.endsWith(".gradeOn20") && !key.endsWith(".gradeOn20Provisional")) continue;
    const n = parseFlexibleNumber(val);
    if (n != null && n > 0) grades.push(n);
  }

  const session = readDsTabLastSession(userData, examId);
  if (session) {
    const answers = session.answers ?? [];
    const total =
      session.totalQuestions ??
      session.questionIds?.length ??
      (answers.length > 0 ? answers.length : 0);
    const score =
      session.scorePoints ??
      (answers.length > 0 ? computeDsScoreFromAnswers(answers) : 0);
    if (total > 0 && (score > 0 || answers.length > 0)) {
      grades.push(computeDsGradeOn20(score, total, false));
    }
    const correct =
      session.correctCount ?? answers.filter((a) => a.outcome === 1).length;
    const wrong =
      session.wrongCount ?? answers.filter((a) => a.outcome === 0).length;
    if (total > 0 && (correct > 0 || wrong > 0)) {
      const fromCounts = correct * DS_SCORE_CORRECT + wrong * DS_SCORE_WRONG;
      grades.push(computeDsGradeOn20(fromCounts, total, false));
    }
  }

  return grades.length > 0 ? Math.max(...grades) : 0;
}

export function readDsTabExamGradeOn20(
  userData: Record<string, unknown> | null | undefined,
  examId: string = DS_SDGN_QCM_EXAM_ID,
): number | undefined {
  const g = resolveDsGradeOn20FromUser(userData, examId);
  return g > 0 ? g : undefined;
}

export function hasDsTabExamData(
  userData: Record<string, unknown> | null | undefined,
  examId: string = DS_SDGN_QCM_EXAM_ID,
): boolean {
  const lastSnap = readDsSdgnLastSnapshot(userData, examId);
  if (lastSnap && (lastSnap.gradeOn20 > 0 || lastSnap.questionsAnswered > 0)) {
    return true;
  }
  const examTab = readDsTabRoot(userData, examId);
  if (!examTab) return false;
  if (examTab.lastSession) return true;
  if (asNumber(examTab.gradeOn20) != null) return true;
  if (asNumber(examTab.score) != null) return true;
  return Boolean(examTab.attemptStarted);
}

export function readDsTabLastSession(
  userData: Record<string, unknown> | null | undefined,
  examId: string = DS_SDGN_QCM_EXAM_ID,
): DsSessionRecord | null {
  const examTab = readDsTabRoot(userData, examId);
  if (!examTab) return null;

  const last = examTab.lastSession;
  if (last && typeof last === "object") {
    return reconcileSessionWithExamTabRoot(
      normalizeDsSessionRecord(last as DsSessionRecord),
      examTab,
    );
  }

  return synthesizeSessionFromExamTab(examTab);
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

/** L'eleve peut reprendre une session en cours (non terminee). */
export function canStudentContinueDsSdgnExam(
  userData: Record<string, unknown> | null | undefined,
  examId: string = DS_SDGN_QCM_EXAM_ID,
): boolean {
  const session = readDsTabLastSession(userData, examId);
  if (!session) return false;
  if (session.status === "completed" && session.completed && !session.forcedZero) {
    return false;
  }
  const questionIds =
    examId === DS_SDGN_TERMINALE_QCM_EXAM_ID
      ? rebuildTerminaleQuestionIdsForResume(session)
      : rebuildQuestionIdsForResume(session);
  if (!questionIds?.length) return false;
  const answered = session.answers?.length ?? session.questionsAnswered ?? 0;
  const total = session.totalQuestions ?? questionIds.length;
  if (answered <= 0) return false;
  return answered < total;
}

/** Session non termin\u00e9e (en cours ou anti-triche interrompu). */
export function isDsSdgnSessionInProgress(
  userData: Record<string, unknown> | null | undefined,
  examId: string = DS_SDGN_QCM_EXAM_ID,
): boolean {
  if (canStudentContinueDsSdgnExam(userData, examId)) return true;

  const session = readDsTabLastSession(userData, examId);
  const meta = readDsTabExamMeta(userData, examId);

  if (session?.status === "completed" && session.completed && !session.forcedZero) {
    return false;
  }

  if (session) {
    const answered = session.answers?.length ?? session.questionsAnswered ?? 0;
    const total = session.totalQuestions ?? 0;
    if (session.status === "incomplete" || session.status === "disqualified") return true;
    if (total > 0 && answered > 0 && answered < total) return true;
    if (session.forcedZero && answered > 0) return true;
  }

  return meta.attemptStarted && session !== null;
}

/** Une tentative termin\u00e9e bloque une nouvelle session ; reprise autoris\u00e9e = exception. */
export function isDsSdgnExamLocked(
  userData: Record<string, unknown> | null | undefined,
  options?: { globallyClosed?: boolean; examId?: string },
): boolean {
  const examId = resolveExamId(options?.examId);
  if (options?.globallyClosed) return true;
  if (canStudentContinueDsSdgnExam(userData, examId)) return false;

  const session = readDsTabLastSession(userData, examId);
  const rootGrade = resolveDsGradeOn20FromUser(userData, examId);
  const answered = session?.questionsAnswered ?? session?.answers?.length ?? 0;
  const total = session?.totalQuestions ?? 0;
  const finishedAll = total > 0 && answered >= total;

  if (session?.status === "completed" && session.completed && !session.forcedZero) {
    return true;
  }

  if (rootGrade > 0 && finishedAll) return true;

  const meta = readDsTabExamMeta(userData, examId);
  if (meta.attemptStarted && finishedAll && rootGrade > 0) return true;
  return false;
}

export type ForceFinalizeDsSdgnOutcome = "skipped" | "finalized";

/**
 * Cl\u00f4ture c\u00f4t\u00e9 serveur : enregistre la note sur les r\u00e9ponses d\u00e9j\u00e0 sauv\u00e9es
 * (l\u2019\u00e9l\u00e8ve encore en train de jouer est finalis\u00e9 par son client via examConfig).
 */
export async function forceFinalizeDsSdgnExamForUser(
  uid: string,
): Promise<ForceFinalizeDsSdgnOutcome> {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) return "skipped";

  const userData = snap.data() as Record<string, unknown>;
  const session = readDsTabLastSession(userData);
  const meta = readDsTabExamMeta(userData);

  if (session?.status === "completed" && session.completed && !session.forcedZero) {
    return "skipped";
  }
  if (!session && !meta.attemptStarted) return "skipped";
  if (!isDsSdgnSessionInProgress(userData)) return "skipped";

  const answers = [...(session?.answers ?? [])];
  const questionIds = session ? rebuildQuestionIdsForResume(session) : null;
  const totalQuestions =
    session?.totalQuestions ?? questionIds?.length ?? (answers.length > 0 ? answers.length : 0);
  if (!answers.length && !meta.attemptStarted) return "skipped";

  const scorePoints = computeDsScoreFromAnswers(answers);
  const gradeOn20 = computeDsGradeOn20(
    scorePoints,
    Math.max(totalQuestions, answers.length, 1),
    false,
  );
  const finishedAt = new Date().toISOString();
  const sessionId = session?.sessionId ?? `admin-close-${Date.now()}`;

  const updatedSession = buildDsSessionRecord({
    sessionId,
    startedAt: session?.startedAt ?? finishedAt,
    finishedAt,
    scorePoints,
    totalQuestions: Math.max(totalQuestions, answers.length),
    questionsAnswered: answers.length,
    correctCount: answers.filter((a) => a.outcome === 1).length,
    wrongCount: answers.filter((a) => a.outcome === 0).length,
    skippedCount: session?.skippedCount ?? 0,
    forcedZero: false,
    gradeOn20,
    status: "completed",
    questionIds: session?.questionIds?.length
      ? session.questionIds
      : (questionIds ?? []),
    answers,
    topicStats: computeTopicStats(
      answers as { topic: DsSdgnPremiereTopic; outcome: 0 | 1 }[],
    ),
    sessionLeftSec: 0,
    resumeIndex: answers.length,
  });

  const payload: DsTabResultPayload = {
    score: scorePoints,
    total: updatedSession.totalQuestions,
    skipped: updatedSession.skippedCount,
    forcedZero: false,
    finishedAt,
    gradeOn20,
    session: updatedSession,
    resumeGranted: false,
  };
  await persistDsTabResult(uid, payload);

  return "finalized";
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
