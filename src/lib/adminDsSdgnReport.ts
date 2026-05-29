import { SDGN_CHAPTER_LABELS } from "../data/sdgn/registry";
import { SDGN_MISSION_QCM_CURATED, type SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import { buildEmptyTopicStats } from "./dsSdgnGrading";
import type { DsSdgnResultSummary } from "../services/dsSdgnResultsService";
import {
  DS_SDGN_QCM_EXAM_ID,
  hasDsTabExamData,
  readDsTabExamMeta,
  readDsTabExamGradeOn20,
  readDsTabLastSession,
  type DsSessionAnswerRecord,
  type DsSessionRecord,
  type DsSessionStatus,
} from "../services/dsTabExamService";
import {
  DS_SDGN_TOPIC_LABELS,
  DS_SDGN_TOPIC_ORDER,
  type DsSdgnPremiereTopic,
} from "./dsSdgnQcmTopics";

const QCM_BY_ID: Record<string, SdgnMissionQcm> = Object.fromEntries(
  SDGN_MISSION_QCM_CURATED.map((q) => [q.id, q]),
);

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

export type DsSdgnAnswerDetailRow = {
  studentId: string;
  studentName: string;
  sessionId: string;
  index: number;
  sourceId: string;
  topic: DsSdgnPremiereTopic;
  topicLabel: string;
  chapter: number;
  chapterLabel: string;
  scenarioTitle: string;
  scenarioText: string;
  question: string;
  choices: string[];
  correctChoice: string;
  pickedChoice: string;
  outcomeLabel: string;
  acquisQuestion: string;
};

export type DsSdgnClassReport = {
  examId: string;
  examLabel: string;
  generatedAt: string;
  students: DsSdgnStudentReportRow[];
  answerDetails: DsSdgnAnswerDetailRow[];
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

/** Note affich\u00e9e : toujours le chiffre Firebase si disponible. */
export function formatDsGradeForReport(row: DsSdgnStudentReportRow): string {
  const grade =
    row.examRootGrade ??
    row.session?.gradeOn20 ??
    row.session?.gradeOn20Provisional ??
    0;

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

/** @deprecated Utiliser resolveDsSdgnDisplayStatus */
export function deriveDsDisplayStatus(
  session: DsSessionRecord | null,
  attemptStarted: boolean,
): DsSdgnDisplayStatus {
  const grade = session?.gradeOn20 ?? session?.gradeOn20Provisional;
  return resolveDsSdgnDisplayStatus(session, grade, attemptStarted);
}

export function buildDsSdgnStudentRow(eleve: {
  id: string;
  nomAffiche?: string;
  prenom?: string;
  nom?: string;
  email?: string;
  classe?: string;
  lycee?: string;
  dsTab?: Record<string, unknown>;
}): DsSdgnStudentReportRow {
  const userRecord = eleve as Record<string, unknown>;
  const session = readDsTabLastSession(userRecord);
  const meta = readDsTabExamMeta(userRecord);
  const hasData = hasDsTabExamData(userRecord);
  const examRootGrade = readDsTabExamGradeOn20(userRecord);
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

export function isPremiereClasse(classe: unknown): boolean {
  const c = String(classe ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return (
    c === "premiere" ||
    c === "1ere" ||
    c.startsWith("1ere ") ||
    c.includes("premiere")
  );
}

/** Toutes les lignes Premi\u00e8re pour le rapport DS (depuis profils Firestore). */
export function buildPremiereDsReportingRows(
  eleves: Record<string, unknown>[],
): DsSdgnStudentReportRow[] {
  const byId = new Map<string, DsSdgnStudentReportRow>();

  for (const e of eleves) {
    const id = String(e.id ?? "");
    if (!id) continue;
    const nom =
      String(e.prenom || e.nom || e.email || "") || `\u00c9l\u00e8ve ${id.slice(0, 6)}`;
    const row = buildDsSdgnStudentRow({
      ...e,
      id,
      nomAffiche: nom,
    } as Parameters<typeof buildDsSdgnStudentRow>[0]);

    const include =
      isPremiereClasse(e.classe) || hasDsTabExamData(e as Record<string, unknown>);
    if (!include) continue;
    byId.set(id, row);
  }

  return Array.from(byId.values()).sort((a, b) =>
    a.studentName.localeCompare(b.studentName, "fr"),
  );
}

/** Compte les profils avec dsTab SDGN detecte (diagnostic admin). */
export function countUsersWithDsSdgnExamData(
  users: Record<string, unknown>[],
): number {
  return users.filter((u) => hasDsTabExamData(u as Record<string, unknown>)).length;
}

function buildDsSdgnStudentRowFromSummary(
  summary: DsSdgnResultSummary,
  user?: Record<string, unknown>,
): DsSdgnStudentReportRow {
  const sessionFromUser = user ? readDsTabLastSession(user as Record<string, unknown>) : null;
  const session: DsSessionRecord | null =
    sessionFromUser ??
    ({
      sessionId: summary.sessionId ?? summary.uid,
      examId: DS_SDGN_QCM_EXAM_ID,
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
      topicStats: summary.topicStats ?? buildEmptyTopicStats(),
    } as DsSessionRecord);

  const name =
    summary.prenom ||
    summary.nom ||
    summary.email ||
    (user?.prenom as string) ||
    (user?.nom as string) ||
    `Eleve ${summary.uid.slice(0, 6)}`;

  const examRootGrade =
    summary.gradeOn20 ??
    (user ? readDsTabExamGradeOn20(user as Record<string, unknown>) : undefined) ??
    session?.gradeOn20;

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
): DsSdgnStudentReportRow[] {
  const userById = new Map(users.map((u) => [String(u.id), u]));
  const byId = new Map<string, DsSdgnStudentReportRow>();

  for (const summary of summaries) {
    if (summary.examId && summary.examId !== DS_SDGN_QCM_EXAM_ID) continue;
    const user = userById.get(summary.uid);
    byId.set(summary.uid, buildDsSdgnStudentRowFromSummary(summary, user));
  }

  for (const user of users) {
    if (user.role === "admin") continue;
    const id = String(user.id ?? "");
    if (!id || byId.has(id)) continue;
    if (!isPremiereClasse(user.classe)) continue;
    const nom =
      String(user.prenom || user.nom || user.email || "") || `\u00c9l\u00e8ve ${id.slice(0, 6)}`;
    byId.set(
      id,
      buildDsSdgnStudentRow({
        ...user,
        id,
        nomAffiche: nom,
      } as Parameters<typeof buildDsSdgnStudentRow>[0]),
    );
  }

  return Array.from(byId.values()).sort((a, b) =>
    a.studentName.localeCompare(b.studentName, "fr"),
  );
}

/** Reinjecte lastSession complet (reponses) depuis users.dsTab pour Excel/PDF. */
export function enrichExportRowsWithUserSessions(
  rows: DsSdgnStudentReportRow[],
  users: Record<string, unknown>[],
): DsSdgnStudentReportRow[] {
  const userById = new Map(users.map((u) => [String(u.id), u]));
  return rows.map((row) => {
    const user = userById.get(row.studentId);
    if (!user) return row;
    const fullSession = readDsTabLastSession(user as Record<string, unknown>);
    const rootGrade = readDsTabExamGradeOn20(user as Record<string, unknown>);
    if (!fullSession) return row;
    return {
      ...row,
      session: fullSession,
      examRootGrade: rootGrade ?? row.examRootGrade,
      displayStatus: fullSession.status ?? row.displayStatus,
      hasDsData: true,
    };
  });
}

export function buildExportReportForAdmin(
  premiereRows: DsSdgnStudentReportRow[],
  usersAll: Record<string, unknown>[],
): DsSdgnClassReport {
  const withActivity = premiereRows.filter(
    (r) =>
      r.hasDsData ||
      r.displayStatus !== "not_started" ||
      (r.examRootGrade != null && r.examRootGrade > 0),
  );
  const enriched = enrichExportRowsWithUserSessions(withActivity, usersAll);
  return buildDsSdgnClassReportFromStudents(enriched);
}

/** Tous les comptes (hors admin) avec une copie DS enregistr\u00e9e \u2014 pour export complet. */
export function buildDsSdgnClassReportFromAllUsersWithDsData(
  users: Record<string, unknown>[],
): DsSdgnClassReport {
  const rows: DsSdgnStudentReportRow[] = [];
  for (const u of users) {
    if (u.role === "admin") continue;
    const id = String(u.id ?? "");
    if (!id) continue;
    if (!hasDsTabExamData(u as Record<string, unknown>)) continue;
    const nom =
      String(u.prenom || u.nom || u.email || "") || `\u00c9l\u00e8ve ${id.slice(0, 6)}`;
    rows.push(
      buildDsSdgnStudentRow({
        ...u,
        id,
        nomAffiche: nom,
      } as Parameters<typeof buildDsSdgnStudentRow>[0]),
    );
  }
  return buildDsSdgnClassReportFromStudents(rows);
}

function answerDetailFromRecord(
  student: DsSdgnStudentReportRow,
  session: DsSessionRecord,
  answer: DsSessionAnswerRecord,
  index: number,
): DsSdgnAnswerDetailRow {
  const bank = QCM_BY_ID[answer.sourceId];
  const chapter = bank?.chapter ?? 0;
  const chLabel =
    chapter in SDGN_CHAPTER_LABELS
      ? SDGN_CHAPTER_LABELS[chapter as keyof typeof SDGN_CHAPTER_LABELS]
      : "";
  const correctIdx = bank?.bonIndex ?? 0;
  const choices = bank?.choix ?? ["?", "?", "?", "?"];
  const picked =
    answer.picked != null ? choices[answer.picked] ?? "\u2014" : "\u2014 (temps \u00e9coul\u00e9)";
  const ok = answer.outcome === 1;

  return {
    studentId: student.studentId,
    studentName: student.studentName,
    sessionId: session.sessionId,
    index: index + 1,
    sourceId: answer.sourceId,
    topic: answer.topic,
    topicLabel: DS_SDGN_TOPIC_LABELS[answer.topic],
    chapter,
    chapterLabel: chLabel,
    scenarioTitle: answer.scenarioTitle || DS_SDGN_TOPIC_LABELS[answer.topic],
    scenarioText: answer.scenarioText || "",
    question: bank?.question ?? answer.sourceId,
    choices: [...choices],
    correctChoice: choices[correctIdx] ?? "",
    pickedChoice: picked,
    outcomeLabel: ok ? "Correct" : "Incorrect / non r\u00e9pondu",
    acquisQuestion: ok ? "Acquis" : "Non acquis",
  };
}

function buildReportPayload(students: DsSdgnStudentReportRow[]): DsSdgnClassReport {
  const sorted = [...students].sort((a, b) =>
    a.studentName.localeCompare(b.studentName, "fr"),
  );
  const answerDetails: DsSdgnAnswerDetailRow[] = [];
  for (const student of sorted) {
    if (!student.session?.answers?.length) continue;
    student.session.answers.forEach((answer, idx) => {
      answerDetails.push(answerDetailFromRecord(student, student.session!, answer, idx));
    });
  }
  return {
    examId: DS_SDGN_QCM_EXAM_ID,
    examLabel: "DS SDGN Premi\u00e8re \u2014 QCM chronom\u00e9tr\u00e9",
    generatedAt: new Date().toISOString(),
    students: sorted,
    answerDetails,
    withDsDataCount: sorted.filter((s) => s.hasDsData).length,
    completedCount: sorted.filter((s) => s.displayStatus === "completed").length,
    incompleteCount: sorted.filter(
      (s) => s.displayStatus === "incomplete" || s.displayStatus === "disqualified",
    ).length,
  };
}

/** Depuis les profils Firestore (avec dsTab). */
export function buildDsSdgnClassReport(
  eleves: {
    id: string;
    nomAffiche?: string;
    prenom?: string;
    nom?: string;
    email?: string;
    classe?: string;
    lycee?: string;
    dsTab?: Record<string, unknown>;
  }[],
): DsSdgnClassReport {
  return buildReportPayload(eleves.map((e) => buildDsSdgnStudentRow(e)));
}

/** Depuis les lignes dsSdgnRow d\u00e9j\u00e0 construites (admin reporting). */
export function buildDsSdgnClassReportFromStudents(
  students: DsSdgnStudentReportRow[],
): DsSdgnClassReport {
  return buildReportPayload(students);
}

export function formatDsTopicAcquisLabel(acquis: boolean, total: number): string {
  if (total <= 0) return "Non \u00e9valu\u00e9";
  return acquis ? "Acquis" : "Non acquis";
}

export { DS_SDGN_TOPIC_ORDER };
