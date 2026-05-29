import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";
import {
  DS_SDGN_QCM_EXAM_ID,
  hasDsTabExamData,
  readDsTabExamGradeOn20,
  readDsTabLastSession,
  type DsSessionRecord,
  type DsSessionStatus,
  type DsTabResultPayload,
} from "./dsTabExamService";

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

function resultDocRef(uid: string) {
  return doc(db, DS_SDGN_RESULTS_COLLECTION, uid);
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
  await setDoc(resultDocRef(summary.uid), toFirestoreSummary(summary), { merge: true });
}

export function summaryFromPayload(
  uid: string,
  payload: DsTabResultPayload,
  profile?: Record<string, unknown>,
): DsSdgnResultSummary {
  const session = payload.session;
  return {
    uid,
    examId: DS_SDGN_QCM_EXAM_ID,
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
  await setDoc(resultDocRef(uid), summary, { merge: true });
}

export function summaryFromUserProfile(
  user: Record<string, unknown>,
): DsSdgnResultSummary | null {
  const uid = String(user.id ?? "");
  if (!uid || !hasDsTabExamData(user)) return null;

  const session = readDsTabLastSession(user);
  const grade =
    readDsTabExamGradeOn20(user) ??
    session?.gradeOn20 ??
    session?.gradeOn20Provisional ??
    0;

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

  return {
    uid,
    examId: DS_SDGN_QCM_EXAM_ID,
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
}

export async function fetchAllDsSdgnResultSummaries(): Promise<DsSdgnResultSummary[]> {
  const snap = await getDocs(collection(db, DS_SDGN_RESULTS_COLLECTION));
  return snap.docs
    .map((d) => ({ ...(d.data() as DsSdgnResultSummary), uid: d.id }))
    .filter((s) => s.examId === DS_SDGN_QCM_EXAM_ID || !s.examId);
}

export type BackfillDsSdgnResultsReport = {
  written: number;
  skipped: number;
  candidates: number;
  errors: string[];
};

/** Recopie users.dsTab -> dsSdgnResults pour les copies deja en base. */
export async function backfillDsSdgnResultsFromUsers(
  users: Record<string, unknown>[],
): Promise<BackfillDsSdgnResultsReport> {
  let written = 0;
  let skipped = 0;
  let candidates = 0;
  const errors: string[] = [];

  for (const user of users) {
    if (user.role === "admin") continue;
    const summary = summaryFromUserProfile(user);
    if (!summary) continue;
    candidates += 1;
    const uid = summary.uid;
    try {
      const existing = await getDoc(resultDocRef(uid));
      if (existing.exists()) {
        const prev = existing.data() as DsSdgnResultSummary;
        if (
          prev.gradeOn20 === summary.gradeOn20 &&
          prev.answersCount === summary.answersCount
        ) {
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
      errors.push(`${name}: ${msg}`);
      if (errors.length >= 5) break;
    }
  }

  return { written, skipped, candidates, errors };
}
