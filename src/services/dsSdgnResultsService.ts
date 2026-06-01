import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { DS_SCORE_CORRECT, DS_SCORE_WRONG } from "../lib/dsSdgnQcmDeck";
import { computeDsGradeOn20 } from "../lib/dsSdgnGrading";
import {
  DS_SDGN_QCM_EXAM_ID,
  DS_SDGN_TERMINALE_QCM_EXAM_ID,
  hasDsTabExamData,
  readDsTabExamRoot,
  resolveDsGradeOn20FromUser,
  readDsTabLastSession,
  type DsSessionRecord,
  type DsSessionStatus,
  type DsTabResultPayload,
} from "./dsTabExamService";

const DS_SDGN_EXAM_IDS = [DS_SDGN_QCM_EXAM_ID, DS_SDGN_TERMINALE_QCM_EXAM_ID] as const;
import { userDocRef } from "./userProfileService";

export const DS_SDGN_RESULTS_COLLECTION = "dsSdgnResults";

export type DsSdgnResultSummary = {
  uid: string;
  examId: string;
  prenom?: string;
  nom?: string;
  email?: string;
  classe?: string;
  lycee?: string;
  gradeOn20: number;
  scorePoints: number;
  totalQuestions: number;
  questionsAnswered: number;
  correctCount: number;
  wrongCount: number;
  forcedZero: boolean;
  status: DsSessionStatus;
  completed: boolean;
  finishedAt: string;
  startedAt?: string;
  sessionId?: string;
  topicStats?: DsSessionRecord["topicStats"];
  /** Copie legere des reponses pour export admin (sans tout le dsTab). */
  answersCount: number;
  updatedAt: string;
};

function resultDocId(uid: string, examId: string): string {
  return `${uid}__${examId}`;
}

function parseResultDocId(docId: string): { uid: string; examId: string } {
  const sep = docId.indexOf("__");
  if (sep === -1) {
    return { uid: docId, examId: DS_SDGN_QCM_EXAM_ID };
  }
  return {
    uid: docId.slice(0, sep),
    examId: docId.slice(sep + 2),
  };
}

function resultDocRef(uid: string, examId: string = DS_SDGN_QCM_EXAM_ID) {
  return doc(db, DS_SDGN_RESULTS_COLLECTION, resultDocId(uid, examId));
}

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

function toFirestoreSummary(summary: DsSdgnResultSummary): Record<string, unknown> {
  return stripUndefinedDeep(summary) as Record<string, unknown>;
}

async function writeSummaryDoc(summary: DsSdgnResultSummary): Promise<void> {
  await setDoc(
    resultDocRef(summary.uid, summary.examId ?? DS_SDGN_QCM_EXAM_ID),
    toFirestoreSummary(summary),
    { merge: true },
  );
}

export function summaryFromPayload(
  uid: string,
  payload: DsTabResultPayload,
  profile?: Record<string, unknown>,
): DsSdgnResultSummary {
  const session = payload.session;
  const examId = session.examId ?? DS_SDGN_QCM_EXAM_ID;
  return {
    uid,
    examId,
    prenom: typeof profile?.prenom === "string" ? profile.prenom : undefined,
    nom: typeof profile?.nom === "string" ? profile.nom : undefined,
    email: typeof profile?.email === "string" ? profile.email : undefined,
    classe: typeof profile?.classe === "string" ? profile.classe : undefined,
    lycee: typeof profile?.lycee === "string" ? profile.lycee : undefined,
    gradeOn20: payload.gradeOn20,
    scorePoints: payload.score,
    totalQuestions: payload.total,
    questionsAnswered: session.questionsAnswered ?? session.answers?.length ?? 0,
    correctCount: session.correctCount ?? 0,
    wrongCount: session.wrongCount ?? 0,
    forcedZero: payload.forcedZero,
    status: session.status,
    completed: session.completed,
    finishedAt: payload.finishedAt,
    startedAt: session.startedAt,
    sessionId: session.sessionId,
    topicStats: session.topicStats,
    answersCount: session.answers?.length ?? 0,
    updatedAt: new Date().toISOString(),
  };
}

/** Ecriture miroir lisible par l'admin (collection dediee). */
export async function syncDsSdgnResultSummary(
  uid: string,
  payload: DsTabResultPayload,
  profile?: Record<string, unknown>,
): Promise<void> {
  const summary = summaryFromPayload(uid, payload, profile);
  const grade = Math.max(
    summary.gradeOn20,
    computeDsGradeOn20(payload.score, payload.total, false),
    payload.gradeOn20,
  );
  await setDoc(
    resultDocRef(uid, summary.examId),
    toFirestoreSummary({ ...summary, gradeOn20: grade }),
    { merge: true },
  );
}

/** Checkpoint en cours : ecrit la note dans dsSdgnResults avant la fin du DS. */
export async function syncDsSdgnCheckpointSummary(
  uid: string,
  input: {
    session: DsTabResultPayload["session"];
    gradeOn20: number;
    score: number;
    total: number;
  },
  profile?: Record<string, unknown>,
): Promise<void> {
  const session = input.session;
  const examId = session.examId ?? DS_SDGN_QCM_EXAM_ID;
  const grade = Math.max(
    input.gradeOn20,
    computeDsGradeOn20(input.score, input.total, false),
  );
  const summary: DsSdgnResultSummary = {
    uid,
    examId,
    prenom: typeof profile?.prenom === "string" ? profile.prenom : undefined,
    nom: typeof profile?.nom === "string" ? profile.nom : undefined,
    email: typeof profile?.email === "string" ? profile.email : undefined,
    classe: typeof profile?.classe === "string" ? profile.classe : undefined,
    lycee: typeof profile?.lycee === "string" ? profile.lycee : undefined,
    gradeOn20: grade,
    scorePoints: input.score,
    totalQuestions: input.total,
    questionsAnswered: session.questionsAnswered ?? session.answers?.length ?? 0,
    correctCount: session.correctCount ?? 0,
    wrongCount: session.wrongCount ?? 0,
    forcedZero: session.forcedZero ?? false,
    status: session.status ?? "incomplete",
    completed: session.completed ?? false,
    finishedAt: session.finishedAt ?? "",
    startedAt: session.startedAt,
    sessionId: session.sessionId,
    topicStats: session.topicStats,
    answersCount: session.answers?.length ?? 0,
    updatedAt: new Date().toISOString(),
  };
  await setDoc(resultDocRef(uid, examId), toFirestoreSummary(summary), { merge: true });
}

export function summaryFromUserProfile(
  user: Record<string, unknown>,
  examId: string = DS_SDGN_QCM_EXAM_ID,
): DsSdgnResultSummary | null {
  const uid = String(user.id ?? "");
  if (!uid || !hasDsTabExamData(user, examId)) return null;

  const session = readDsTabLastSession(user, examId);
  const grade = resolveDsGradeOn20FromUser(user, examId);

  if (!session && grade <= 0) return null;

  const answered = session?.questionsAnswered ?? session?.answers?.length ?? 0;
  const total = session?.totalQuestions ?? 0;
  const forced = Boolean(session?.forcedZero);
  let status: DsSessionStatus = session?.status ?? "incomplete";
  let completed = session?.completed ?? false;

  if (forced && grade <= 0) {
    status = "disqualified";
    completed = false;
  } else if (grade > 0 && total > 0 && answered >= total) {
    status = "completed";
    completed = true;
  } else if (grade > 0 && session?.status === "completed" && !forced) {
    status = "completed";
    completed = true;
  } else if (answered > 0 || grade > 0) {
    status = "incomplete";
    completed = false;
  }

  const summary: DsSdgnResultSummary = {
    uid,
    examId,
    prenom: typeof user.prenom === "string" ? user.prenom : undefined,
    nom: typeof user.nom === "string" ? user.nom : undefined,
    email: typeof user.email === "string" ? user.email : undefined,
    classe: typeof user.classe === "string" ? user.classe : undefined,
    lycee: typeof user.lycee === "string" ? user.lycee : undefined,
    gradeOn20: grade,
    scorePoints: session?.scorePoints ?? 0,
    totalQuestions: session?.totalQuestions ?? 0,
    questionsAnswered: session?.questionsAnswered ?? session?.answers?.length ?? 0,
    correctCount: session?.correctCount ?? 0,
    wrongCount: session?.wrongCount ?? 0,
    forcedZero: session?.forcedZero ?? false,
    status,
    completed,
    finishedAt: session?.finishedAt ?? "",
    startedAt: session?.startedAt,
    sessionId: session?.sessionId,
    topicStats: session?.topicStats,
    answersCount: session?.answers?.length ?? 0,
    updatedAt: new Date().toISOString(),
  };
  summary.gradeOn20 = Math.max(grade, resolveGradeFromDsSdgnSummary(summary));
  return summary;
}

export async function fetchAllDsSdgnResultSummaries(): Promise<DsSdgnResultSummary[]> {
  const snap = await getDocs(collection(db, DS_SDGN_RESULTS_COLLECTION));
  return snap.docs.map((d) => {
    const parsed = parseResultDocId(d.id);
    const data = d.data() as DsSdgnResultSummary;
    return {
      ...data,
      uid: parsed.uid,
      examId: data.examId ?? parsed.examId,
    };
  });
}

export type BackfillDsSdgnResultsReport = {
  written: number;
  skipped: number;
  candidates: number;
  errors: string[];
  gradesFound: number;
  userDocsPatched: number;
};

/** Note depuis dsSdgnResults (grade stocke, score ou bonnes/mauvaises reponses). */
export function resolveGradeFromDsSdgnSummary(summary: DsSdgnResultSummary): number {
  const stored = Number(summary.gradeOn20) || 0;
  const total = Number(summary.totalQuestions) || 0;
  if (total <= 0) return stored;

  const candidates = [stored];
  const score = Number(summary.scorePoints);
  if (Number.isFinite(score)) {
    candidates.push(computeDsGradeOn20(score, total, false));
  }

  const correct = Number(summary.correctCount) || 0;
  const wrong = Number(summary.wrongCount) || 0;
  if (correct > 0 || wrong > 0) {
    const fromCounts = correct * DS_SCORE_CORRECT + wrong * DS_SCORE_WRONG;
    candidates.push(computeDsGradeOn20(fromCounts, total, false));
  }

  const answered = Number(summary.questionsAnswered) || Number(summary.answersCount) || 0;
  if (answered > 0 && candidates.every((g) => g <= 0)) {
    candidates.push(computeDsGradeOn20(0, total, false));
  }

  return Math.max(0, ...candidates);
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

/** Recopie users.dsTab -> dsSdgnResults pour les copies deja en base. */
export async function backfillDsSdgnResultsFromUsers(
  users: Record<string, unknown>[],
): Promise<BackfillDsSdgnResultsReport> {
  let written = 0;
  let skipped = 0;
  let candidates = 0;
  let gradesFound = 0;
  let userDocsPatched = 0;
  const errors: string[] = [];

  for (const user of users) {
    if (user.role === "admin") continue;
    const uid = String(user.id ?? "");
    if (!uid) continue;

    let freshUser = user;
    try {
      const snap = await getDoc(userDocRef(uid));
      if (snap.exists()) {
        freshUser = { id: uid, ...snap.data() };
      }
    } catch {
      /* ignore */
    }

    for (const examId of DS_SDGN_EXAM_IDS) {
      if (!hasDsTabExamData(freshUser, examId)) continue;

      candidates += 1;
      const fromUser = resolveDsGradeOn20FromUser(freshUser, examId);
      let summary = summaryFromUserProfile(freshUser, examId);
      if (!summary) continue;

      const mergedGrade = Math.max(
        fromUser,
        summary.gradeOn20 ?? 0,
        resolveGradeFromDsSdgnSummary(summary),
      );
      summary = { ...summary, gradeOn20: mergedGrade };

      try {
        if (summary.gradeOn20 > 0 && examId === DS_SDGN_QCM_EXAM_ID) {
          const tab = readDsTabExamRoot(freshUser, examId);
          const cur = parseFlexibleNumber(tab?.gradeOn20) ?? 0;
          const patch: Record<string, unknown> = {
            dsSdgnPremiereLast: {
              gradeOn20: summary.gradeOn20,
              scorePoints: summary.scorePoints,
              totalQuestions: summary.totalQuestions,
              questionsAnswered: summary.questionsAnswered,
              status: summary.status,
              forcedZero: summary.forcedZero,
              finishedAt: summary.finishedAt,
              updatedAt: new Date().toISOString(),
            },
          };
          if (cur < summary.gradeOn20 - 0.001) {
            patch[`dsTab.${DS_SDGN_QCM_EXAM_ID}.gradeOn20`] = summary.gradeOn20;
            patch[`dsTab.${DS_SDGN_QCM_EXAM_ID}.score`] =
              summary.scorePoints || tab?.score || 0;
          }
          await updateDoc(userDocRef(uid), patch);
          userDocsPatched += 1;
        }

        const existing = await getDoc(resultDocRef(uid, examId));
        if (existing.exists()) {
          const prev = existing.data() as DsSdgnResultSummary;
          const prevGrade = Number(prev.gradeOn20) || 0;
          const newGrade = Number(summary.gradeOn20) || 0;
          const gradeImproved = newGrade > prevGrade + 0.001;
          const unchanged =
            !gradeImproved &&
            Math.abs(prevGrade - newGrade) < 0.001 &&
            prev.answersCount === summary.answersCount;
          if (unchanged) {
            skipped += 1;
            continue;
          }
        }
        await writeSummaryDoc(summary);
        written += 1;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        const name =
          summary.prenom || summary.nom || summary.email || uid.slice(0, 6);
        errors.push(`${name} (${examId}): ${msg}`);
        if (errors.length >= 8) break;
      }
    }
    if (errors.length >= 8) break;
  }

  const uniqueGrades = users.filter(
    (u) => u.role !== "admin" && resolveDsGradeOn20FromUser(u as Record<string, unknown>) > 0,
  ).length;

  return {
    written,
    skipped,
    candidates,
    errors,
    gradesFound: uniqueGrades,
    userDocsPatched,
  };
}
