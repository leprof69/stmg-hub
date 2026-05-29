import { SDGN_CHAPTER_LABELS } from "../data/sdgn/registry";
import { SDGN_MISSION_QCM_CURATED, type SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
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

export function formatDsGradeForReport(row: DsSdgnStudentReportRow): string {
  const sess = row.session;
  const rootGrade = row.examRootGrade;
  if (!sess) {
    if (rootGrade != null && rootGrade > 0) return String(rootGrade);
    return row.displayStatus === "not_started" ? "\u2014" : "\u2014";
  }
  if (sess.forcedZero || row.displayStatus === "disqualified") {
    const prov = sess.gradeOn20Provisional ?? rootGrade ?? sess.gradeOn20;
    return prov > 0 ? `${prov} (prov.)` : "0";
  }
  if (row.displayStatus === "incomplete") {
    const prov = sess.gradeOn20Provisional ?? rootGrade ?? sess.gradeOn20;
    return `${prov} (prov.)`;
  }
  const grade = sess.gradeOn20 > 0 ? sess.gradeOn20 : (rootGrade ?? 0);
  if (grade > 0) return String(grade);
  return row.displayStatus === "not_started" ? "\u2014" : "0";
}

export function deriveDsDisplayStatus(
  session: DsSessionRecord | null,
  attemptStarted: boolean,
): DsSdgnDisplayStatus {
  if (session?.status) return session.status;
  if (session) {
    if (session.forcedZero) return "disqualified";
    const answered = session.questionsAnswered ?? session.answers?.length ?? 0;
    if (answered > 0 && answered < (session.totalQuestions ?? 0)) return "incomplete";
    if (answered > 0) return "completed";
  }
  if (attemptStarted) return "incomplete";
  return "not_started";
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
  let displayStatus: DsSdgnDisplayStatus = hasData
    ? deriveDsDisplayStatus(session, meta.attemptStarted)
    : "not_started";
  if (
    hasData &&
    displayStatus === "not_started" &&
    examRootGrade != null &&
    examRootGrade > 0
  ) {
    displayStatus = "completed";
  }
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
    hasDsData: hasData && displayStatus !== "not_started",
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
