import { SDGN_CHAPTER_LABELS } from "../data/sdgn/registry";
import { SDGN_MISSION_QCM_CURATED, type SdgnMissionQcm } from "../data/sdgn/sdgnMissionQcmBank";
import {
  DS_SDGN_QCM_EXAM_ID,
  readDsTabExamMeta,
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
  if (row.displayStatus === "not_started") return "\u2014";
  if (!sess) return "\u2014";
  if (sess.forcedZero || row.displayStatus === "disqualified") {
    const prov = sess.gradeOn20Provisional;
    return prov != null ? `${prov} (prov.)` : "0";
  }
  if (row.displayStatus === "incomplete") {
    const prov = sess.gradeOn20Provisional ?? sess.gradeOn20;
    return `${prov} (prov.)`;
  }
  return String(sess.gradeOn20);
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
  const displayStatus = deriveDsDisplayStatus(session, meta.attemptStarted);
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
    hasDsData: displayStatus !== "not_started",
  };
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
  const students = eleves
    .map((e) => buildDsSdgnStudentRow(e))
    .sort((a, b) => a.studentName.localeCompare(b.studentName, "fr"));

  const answerDetails: DsSdgnAnswerDetailRow[] = [];
  for (const student of students) {
    if (!student.session?.answers?.length) continue;
    student.session.answers.forEach((answer, idx) => {
      answerDetails.push(answerDetailFromRecord(student, student.session!, answer, idx));
    });
  }

  return {
    examId: DS_SDGN_QCM_EXAM_ID,
    examLabel: "DS SDGN Premi\u00e8re \u2014 QCM chronom\u00e9tr\u00e9",
    generatedAt: new Date().toISOString(),
    students,
    answerDetails,
    withDsDataCount: students.filter((s) => s.hasDsData).length,
    completedCount: students.filter((s) => s.displayStatus === "completed").length,
    incompleteCount: students.filter(
      (s) => s.displayStatus === "incomplete" || s.displayStatus === "disqualified",
    ).length,
  };
}

export function formatDsTopicAcquisLabel(acquis: boolean, total: number): string {
  if (total <= 0) return "Non \u00e9valu\u00e9";
  return acquis ? "Acquis" : "Non acquis";
}

export { DS_SDGN_TOPIC_ORDER };
