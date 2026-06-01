import {
  resolveGradeFromDsSdgnSummary,
  type DsSdgnResultSummary,
} from "../services/dsSdgnResultsService";
import {
  DS_SDGN_QCM_EXAM_ID,
  DS_SDGN_TERMINALE_QCM_EXAM_ID,
  hasDsTabExamData,
  readDsTabExamMeta,
  readDsTabExamGradeOn20,
  resolveDsGradeOn20FromUser,
  readDsTabLastSession,
  type DsSessionRecord,
  type DsSessionStatus,
} from "../services/dsTabExamService";
import { buildEmptyTopicStats } from "./dsSdgnGrading";
import { buildEmptyTerminaleTopicStats } from "./dsSdgnTerminaleGrading";
import { isPremiereClasse, isTerminaleClasse } from "./dsSdgnClasse";

export type DsSdgnDisplayStatus = "not_started" | DsSessionStatus;

export type DsSdgnStudentReportRow = {
  studentId: string;
  studentName: string;
  classe: string;
  lycee?: string;
  email?: string;
  session: DsSessionRecord | null;
  displayStatus: DsSdgnDisplayStatus;
  hasDsData: boolean;
  /** Note lue sur dsTab (secours si lastSession incomplete). */
  examRootGrade?: number;
};

export type DsSdgnClassReport = {
  examId: string;
  examLabel: string;
  generatedAt: string;
  students: DsSdgnStudentReportRow[];
  withDsDataCount: number;
  completedCount: number;
  incompleteCount: number;
};

export function formatDsDisplayStatusLabel(status: DsSdgnDisplayStatus): string {
  switch (status) {
    case "not_started":
      return "Jamais commenc\u00e9";
    case "incomplete":
      return "Non termin\u00e9";
    case "completed":
      return "Termin\u00e9";
    case "disqualified":
      return "Anti-triche (0)";
    default:
      return status;
  }
}

/** Note /20 la plus fiable pour l'affichage admin (racine + session + provisional). */
export function resolveReportGradeOn20(row: DsSdgnStudentReportRow): number {
  return Math.max(
    row.examRootGrade ?? 0,
    row.session?.gradeOn20Provisional ?? 0,
    row.session?.gradeOn20 ?? 0,
  );
}

/** Note affich\u00e9e : toujours le chiffre Firebase si disponible. */
export function formatDsGradeForReport(row: DsSdgnStudentReportRow): string {
  const grade = resolveReportGradeOn20(row);

  if (row.displayStatus === "not_started" && grade <= 0) return "\u2014";
  if (grade <= 0) return "0";
  if (row.displayStatus === "completed") return String(grade);
  if (row.displayStatus === "disqualified" || row.displayStatus === "incomplete") {
    return `${grade} (prov.)`;
  }
  return String(grade);
}

/**
 * Statut affich\u00e9 : se base sur la note et la progression, pas seulement lastSession.status
 * (souvent "incomplete" apr\u00e8s cl\u00f4ture admin alors que gradeOn20 est d\u00e9j\u00e0 enregistr\u00e9).
 */
export function resolveDsSdgnDisplayStatus(
  session: DsSessionRecord | null,
  examRootGrade: number | undefined,
  attemptStarted = false,
): DsSdgnDisplayStatus {
  const grade =
    examRootGrade ??
    session?.gradeOn20 ??
    session?.gradeOn20Provisional ??
    0;
  const answered = session?.questionsAnswered ?? session?.answers?.length ?? 0;
  const total = session?.totalQuestions ?? 0;
  const forced = Boolean(session?.forcedZero);

  if (!session && grade <= 0 && !attemptStarted) return "not_started";

  if (forced && grade <= 0) return "disqualified";

  const finishedAll = total > 0 && answered >= total;
  const sessionCompleted =
    session?.completed === true ||
    (session?.status === "completed" && !forced);

  if (sessionCompleted && grade > 0) return "completed";
  if (finishedAll && grade > 0) return "completed";
  if (grade > 0 && !forced && session?.finishedAt && answered > 0) {
    if (total <= 0 || answered >= total) return "completed";
  }

  if (forced && grade > 0) return "disqualified";
  if (answered > 0 || grade > 0) return "incomplete";
  if (attemptStarted) return "incomplete";
  return "not_started";
}

export function buildDsSdgnStudentRow(
  eleve: {
    id: string;
    nomAffiche?: string;
    prenom?: string;
    nom?: string;
    email?: string;
    classe?: string;
    lycee?: string;
    dsTab?: Record<string, unknown>;
  },
  examId: string = DS_SDGN_QCM_EXAM_ID,
): DsSdgnStudentReportRow {
  const userRecord = eleve as Record<string, unknown>;
  const session = readDsTabLastSession(userRecord, examId);
  const meta = readDsTabExamMeta(userRecord, examId);
  const hasData = hasDsTabExamData(userRecord, examId);
  const resolvedGrade = resolveDsGradeOn20FromUser(userRecord, examId);
  const examRootGrade =
    resolvedGrade > 0 ? resolvedGrade : readDsTabExamGradeOn20(userRecord, examId);
  const displayStatus: DsSdgnDisplayStatus = hasData
    ? resolveDsSdgnDisplayStatus(session, examRootGrade, meta.attemptStarted)
    : "not_started";
  const name =
    eleve.nomAffiche ||
    eleve.prenom ||
    eleve.nom ||
    eleve.email ||
    `Eleve ${eleve.id.slice(0, 6)}`;

  return {
    studentId: eleve.id,
    studentName: name,
    classe: eleve.classe || "",
    lycee: eleve.lycee,
    email: eleve.email,
    session,
    displayStatus,
    hasDsData: hasData,
    examRootGrade: Number.isFinite(examRootGrade) ? examRootGrade : undefined,
  };
}

/** Toutes les lignes Premi\u00e8re pour le rapport DS (depuis profils Firestore). */
export function buildPremiereDsReportingRows(
  eleves: Record<string, unknown>[],
): DsSdgnStudentReportRow[] {
  return buildDsReportingRowsForExam(eleves, DS_SDGN_QCM_EXAM_ID, isPremiereClasse);
}

/** Toutes les lignes Terminale pour le rapport DS. */
export function buildTerminaleDsReportingRows(
  eleves: Record<string, unknown>[],
): DsSdgnStudentReportRow[] {
  return buildDsReportingRowsForExam(eleves, DS_SDGN_TERMINALE_QCM_EXAM_ID, isTerminaleClasse);
}

function buildDsReportingRowsForExam(
  eleves: Record<string, unknown>[],
  examId: string,
  matchClasse: (classe: unknown) => boolean,
): DsSdgnStudentReportRow[] {
  const byId = new Map<string, DsSdgnStudentReportRow>();

  for (const e of eleves) {
    const id = String(e.id ?? "");
    if (!id) continue;
    const nom =
      String(e.prenom || e.nom || e.email || "") || `\u00c9l\u00e8ve ${id.slice(0, 6)}`;
    const row = buildDsSdgnStudentRow(
      {
        ...e,
        id,
        nomAffiche: nom,
      } as Parameters<typeof buildDsSdgnStudentRow>[0],
      examId,
    );

    const include =
      matchClasse(e.classe) || hasDsTabExamData(e as Record<string, unknown>, examId);
    if (!include) continue;
    byId.set(id, row);
  }

  return Array.from(byId.values()).sort((a, b) =>
    a.studentName.localeCompare(b.studentName, "fr"),
  );
}

function buildDsSdgnStudentRowFromSummary(
  summary: DsSdgnResultSummary,
  user?: Record<string, unknown>,
): DsSdgnStudentReportRow {
  const examId = summary.examId ?? DS_SDGN_QCM_EXAM_ID;
  const sessionFromUser = user
    ? readDsTabLastSession(user as Record<string, unknown>, examId)
    : null;
  const emptyTopicStats =
    examId === DS_SDGN_TERMINALE_QCM_EXAM_ID
      ? buildEmptyTerminaleTopicStats()
      : buildEmptyTopicStats();
  const session: DsSessionRecord | null =
    sessionFromUser ??
    ({
      sessionId: summary.sessionId ?? summary.uid,
      examId,
      startedAt: summary.startedAt ?? summary.finishedAt,
      finishedAt: summary.finishedAt,
      scorePoints: summary.scorePoints,
      totalQuestions: summary.totalQuestions,
      questionsAnswered: summary.questionsAnswered,
      correctCount: summary.correctCount,
      wrongCount: summary.wrongCount,
      skippedCount: 0,
      forcedZero: summary.forcedZero,
      gradeOn20: summary.gradeOn20,
      status: summary.status,
      completed: summary.completed,
      questionIds: [],
      answers: [],
      topicStats: summary.topicStats ?? emptyTopicStats,
    } as DsSessionRecord);

  const name =
    summary.prenom ||
    summary.nom ||
    summary.email ||
    (user?.prenom as string) ||
    (user?.nom as string) ||
    `Eleve ${summary.uid.slice(0, 6)}`;

  const fromUser = user
    ? resolveDsGradeOn20FromUser(user as Record<string, unknown>, examId)
    : 0;
  const fromSummary = resolveGradeFromDsSdgnSummary(summary);
  const bestGrade = Math.max(summary.gradeOn20 ?? 0, fromUser, fromSummary);
  const examRootGrade = bestGrade > 0 ? bestGrade : undefined;

  return {
    studentId: summary.uid,
    studentName: name,
    classe: summary.classe || String(user?.classe ?? ""),
    lycee: summary.lycee || (user?.lycee as string | undefined),
    email: summary.email || (user?.email as string | undefined),
    session,
    displayStatus: resolveDsSdgnDisplayStatus(session, examRootGrade, true),
    hasDsData: true,
    examRootGrade,
  };
}

/**
 * Source fiable pour l'admin : collection dsSdgnResults (remplie a chaque fin de DS).
 */
export function buildReportingRowsFromDsSdgnSummaries(
  summaries: DsSdgnResultSummary[],
  users: Record<string, unknown>[],
  examId: string = DS_SDGN_QCM_EXAM_ID,
): DsSdgnStudentReportRow[] {
  const userById = new Map(users.map((u) => [String(u.id), u]));
  const byId = new Map<string, DsSdgnStudentReportRow>();
  const matchClasse =
    examId === DS_SDGN_TERMINALE_QCM_EXAM_ID ? isTerminaleClasse : isPremiereClasse;

  for (const summary of summaries) {
    const sid = summary.examId ?? DS_SDGN_QCM_EXAM_ID;
    if (sid !== examId) continue;
    const user = userById.get(summary.uid);
    byId.set(summary.uid, buildDsSdgnStudentRowFromSummary(summary, user));
  }

  for (const user of users) {
    if (user.role === "admin") continue;
    const id = String(user.id ?? "");
    if (!id || byId.has(id)) continue;
    if (!matchClasse(user.classe)) continue;
    const nom =
      String(user.prenom || user.nom || user.email || "") || `\u00c9l\u00e8ve ${id.slice(0, 6)}`;
    byId.set(
      id,
      buildDsSdgnStudentRow(
        {
          ...user,
          id,
          nomAffiche: nom,
        } as Parameters<typeof buildDsSdgnStudentRow>[0],
        examId,
      ),
    );
  }

  return Array.from(byId.values()).sort((a, b) =>
    a.studentName.localeCompare(b.studentName, "fr"),
  );
}

/** Reinjecte lastSession complet (reponses) depuis users.dsTab pour le PDF. */
export function enrichExportRowsWithUserSessions(
  rows: DsSdgnStudentReportRow[],
  users: Record<string, unknown>[],
  examId: string = DS_SDGN_QCM_EXAM_ID,
): DsSdgnStudentReportRow[] {
  const userById = new Map(users.map((u) => [String(u.id), u]));
  return rows.map((row) => {
    const user = userById.get(row.studentId);
    if (!user) return row;
    const fullSession = readDsTabLastSession(user as Record<string, unknown>, examId);
    const rootGrade = resolveDsGradeOn20FromUser(user as Record<string, unknown>, examId);
    if (!fullSession) {
      if (rootGrade > 0) {
        return {
          ...row,
          examRootGrade: rootGrade,
          displayStatus: resolveDsSdgnDisplayStatus(row.session, rootGrade, true),
        };
      }
      return row;
    }
    const examRootGrade =
      Math.max(rootGrade, row.examRootGrade ?? 0, resolveReportGradeOn20(row)) || undefined;
    return {
      ...row,
      session: fullSession,
      examRootGrade: examRootGrade && examRootGrade > 0 ? examRootGrade : row.examRootGrade,
      displayStatus: resolveDsSdgnDisplayStatus(
        fullSession,
        examRootGrade ?? rootGrade,
        true,
      ),
      hasDsData: true,
    };
  });
}

export function buildExportReportForAdmin(
  rows: DsSdgnStudentReportRow[],
  usersAll: Record<string, unknown>[],
  examId: string,
  examLabel: string,
): DsSdgnClassReport {
  const withActivity = rows.filter(
    (r) =>
      r.hasDsData ||
      r.displayStatus !== "not_started" ||
      (r.examRootGrade != null && r.examRootGrade > 0),
  );
  const enriched = enrichExportRowsWithUserSessions(withActivity, usersAll, examId);
  return buildDsSdgnClassReportFromStudents(enriched, examId, examLabel);
}

function buildReportPayload(
  students: DsSdgnStudentReportRow[],
  examId: string,
  examLabel: string,
): DsSdgnClassReport {
  const sorted = [...students].sort((a, b) =>
    a.studentName.localeCompare(b.studentName, "fr"),
  );
  return {
    examId,
    examLabel,
    generatedAt: new Date().toISOString(),
    students: sorted,
    withDsDataCount: sorted.filter((s) => s.hasDsData).length,
    completedCount: sorted.filter((s) => s.displayStatus === "completed").length,
    incompleteCount: sorted.filter(
      (s) => s.displayStatus === "incomplete" || s.displayStatus === "disqualified",
    ).length,
  };
}

export function buildDsSdgnClassReportFromStudents(
  students: DsSdgnStudentReportRow[],
  examId: string = DS_SDGN_QCM_EXAM_ID,
  examLabel = "DS SDGN Premi\u00e8re \u2014 QCM chronom\u00e9tr\u00e9",
): DsSdgnClassReport {
  return buildReportPayload(students, examId, examLabel);
}

export { isPremiereClasse, isTerminaleClasse } from "./dsSdgnClasse";
