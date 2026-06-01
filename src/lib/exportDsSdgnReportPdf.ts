import type { DsSdgnClassReport } from "./adminDsSdgnReport";
import {
  formatDsDisplayStatusLabel,
  formatDsGradeForReport,
} from "./adminDsSdgnReport";
import { DS_SDGN_TOPIC_LABELS, DS_SDGN_TOPIC_ORDER } from "./dsSdgnQcmTopics";
import {
  computeDsGradeOn20,
  computeDsScoreFromAnswers,
  computeTopicStats,
} from "./dsSdgnGrading";
import { computeTerminaleTopicStats } from "./dsSdgnTerminaleGrading";
import {
  DS_SDGN_QCM_EXAM_ID,
  DS_SDGN_TERMINALE_QCM_EXAM_ID,
  readDsTabLastSession,
  resolveDsGradeOn20FromUser,
} from "../services/dsTabExamService";
import {
  DS_SDGN_TERMINALE_TOPIC_LABELS,
  DS_SDGN_TERMINALE_TOPIC_ORDER,
} from "./dsSdgnTerminaleQcmTopics";
import {
  buildDsTopicDetailsFromSession,
  resolveDsAnswersForTopicStats,
  type DsTopicReportDetail,
} from "./dsSdgnReportNotions";

function formatFrDate(iso?: string): string {
  if (!iso) return "\u2014";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function downloadPdfBlob(doc: import("jspdf").jsPDF, filename: string): void {
  try {
    doc.save(filename);
    return;
  } catch {
    /* fallback navigateurs stricts */
  }
  const blob = doc.output("blob");
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.rel = "noopener";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 2000);
}

type PdfWriteFn = (
  text: string,
  opts?: { size?: number; bold?: boolean; color?: [number, number, number]; lh?: number; indent?: number },
) => void;

type PdfPageLayout = { left: number; bottom: number; w: number };

/** Libelles courts (lecture facile). */
function themeResultLabel(acquis: boolean): string {
  return acquis ? "OK pour ce theme" : "A revoir";
}

/** Bloc erreurs : gros interligne, colonne etroite, peu de titres. */
function writeAccessibleDsReport(
  doc: import("jspdf").jsPDF,
  page: PdfPageLayout,
  yStart: number,
  details: DsTopicReportDetail[],
): number {
  let y = yStart;
  const marginX = 36;
  const textLeft = page.left + marginX;
  const textW = page.w - marginX * 2;
  const bodyLh = 18;
  const bodySize = 11.5;

  const ensure = (need: number) => {
    if (y + need > page.bottom) {
      doc.addPage();
      y = 52;
    }
  };

  const gap = (pts = 16) => {
    y += pts;
  };

  const writeLines = (
    text: string,
    opts: { size?: number; bold?: boolean; color?: [number, number, number]; lh?: number } = {},
  ) => {
    const { size = bodySize, bold = false, color = [30, 41, 59], lh = bodyLh } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, textW);
    ensure(lines.length * lh + 4);
    doc.text(lines, textLeft, y);
    y += lines.length * lh;
  };

  const rule = () => {
    ensure(12);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.8);
    doc.line(textLeft, y, textLeft + textW, y);
    gap(14);
  };

  writeLines("RESUME (4 themes)", { size: 15, bold: true, lh: 20 });
  gap(10);

  details.forEach((detail, i) => {
    const ok = detail.acquis;
    writeLines(`${i + 1}. ${detail.label}`, { size: 12, bold: true, lh: 16 });
    writeLines(themeResultLabel(ok), {
      size: 12,
      bold: true,
      lh: 16,
      color: ok ? [5, 150, 105] : [217, 119, 6],
    });
    if (detail.total > 0) {
      writeLines(`${detail.correct} bonne(s) sur ${detail.total} questions`, {
        size: 10,
        color: [100, 116, 139],
        lh: 14,
      });
    }
    gap(12);
  });

  const toReview = details.filter((d) => !d.acquis && d.failedQuestions.length > 0);
  if (!toReview.length) return y;

  rule();
  writeLines("TES ERREURS (a revoir)", { size: 15, bold: true, lh: 20, color: [185, 28, 28] });
  gap(8);
  writeLines("Relis chaque question. Puis la r\u00e9ponse qu\u0027il fallait choisir.", {
    size: 10,
    color: [100, 116, 139],
    lh: 14,
  });
  gap(16);

  let cardIndex = 0;
  for (const detail of toReview) {
    for (const entry of detail.failedQuestions) {
      cardIndex += 1;
      if (cardIndex > 1) rule();

      writeLines(`Erreur ${cardIndex}`, { size: 13, bold: true, lh: 18, color: [185, 28, 28] });
      writeLines(detail.label, { size: 12, bold: true, lh: 16 });
      gap(10);

      writeLines("QUESTION", { size: 11, bold: true, lh: 15, color: [51, 65, 85] });
      gap(4);
      writeLines(entry.questionText, { size: bodySize, lh: bodyLh });
      gap(14);

      writeLines("IL FALLAIT REPONDRE", { size: 11, bold: true, lh: 15, color: [30, 64, 110] });
      gap(4);
      writeLines(entry.expectedAnswer, { size: bodySize, lh: bodyLh, color: [30, 64, 110] });
      gap(22);
    }
  }

  return y;
}

function writeTopicDetailsBlock(
  write: PdfWriteFn,
  details: DsTopicReportDetail[],
  opts: { compact?: boolean } = {},
) {
  const compact = opts.compact ?? false;

  details.forEach((detail, themeIndex) => {
    if (detail.total <= 0) {
      write(`Theme ${themeIndex + 1} \u2014 ${detail.label}`, {
        size: compact ? 9 : 11,
        bold: true,
        color: [100, 116, 139],
        lh: compact ? 12 : 15,
      });
      write("Non evalue sur cette copie.", {
        size: compact ? 8 : 9,
        color: [100, 116, 139],
        lh: compact ? 11 : 13,
        indent: 8,
      });
      return;
    }

    const status = detail.acquis ? "OK" : "A revoir";
    const statusColor: [number, number, number] = detail.acquis ? [5, 150, 105] : [217, 119, 6];

    write(`${themeIndex + 1}. ${detail.label}`, {
      size: compact ? 9 : 11,
      bold: true,
      color: [15, 23, 42],
      lh: compact ? 12 : 15,
    });
    write(`${status} (${detail.correct}/${detail.total})`, {
      size: compact ? 8.5 : 10,
      bold: true,
      color: statusColor,
      lh: compact ? 11 : 14,
      indent: 8,
    });

    if (detail.acquis || detail.failedQuestions.length === 0) return;

    if (compact) {
      write(
        `${detail.failedQuestions.length} erreur(s) \u2014 detail dans le PDF individuel.`,
        { size: 7.8, color: [100, 116, 139], lh: 10, indent: 8 },
      );
      return;
    }

    detail.failedQuestions.forEach((entry, idx) => {
      write(`Erreur ${idx + 1} (${entry.bankRef})`, {
        size: 9.5,
        bold: true,
        color: [185, 28, 28],
        lh: 13,
        indent: 8,
      });
      write("Enonce :", {
        size: 9,
        bold: true,
        color: [51, 65, 85],
        lh: 12,
        indent: 12,
      });
      write(entry.questionText, {
        size: 8.5,
        color: [51, 65, 85],
        lh: 12,
        indent: 16,
      });
      write("Bonne reponse attendue :", {
        size: 9,
        bold: true,
        color: [30, 64, 110],
        lh: 12,
        indent: 12,
      });
      write(entry.expectedAnswer, {
        size: 8.5,
        color: [30, 64, 110],
        lh: 12,
        indent: 16,
      });
    });
  });
}

export async function exportDsSdgnClassReportPdf(
  report: DsSdgnClassReport,
  filename?: string,
): Promise<{ filename: string; students: number; answers: number }> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

  const page = { left: 48, right: 547, top: 52, bottom: 780, w: 499 };
  let y = page.top;
  let pageNum = 1;

  const footer = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`STMG HUB - Notes DS SDGN - page ${pageNum}`, page.left, 820);
    doc.setTextColor(30, 30, 30);
  };

  const newPage = () => {
    footer();
    doc.addPage();
    pageNum += 1;
    y = page.top;
  };

  const ensure = (h = 18) => {
    if (y + h > page.bottom) newPage();
  };

  const write: PdfWriteFn = (text, opts = {}) => {
    const { size = 10, bold = false, color = [30, 41, 59], lh = 13, indent = 0 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, page.w - indent);
    ensure(lines.length * lh + 2);
    doc.text(lines, page.left + indent, y);
    y += lines.length * lh;
  };

  const isTerminale = report.examId === DS_SDGN_TERMINALE_QCM_EXAM_ID;
  const topicOrder = isTerminale ? DS_SDGN_TERMINALE_TOPIC_ORDER : DS_SDGN_TOPIC_ORDER;
  const topicLabels = isTerminale ? DS_SDGN_TERMINALE_TOPIC_LABELS : DS_SDGN_TOPIC_LABELS;

  const stamp = new Date().toISOString().slice(0, 10);
  const outName =
    filename ||
    `notes-ds-sdgn-${isTerminale ? "terminale" : "premiere"}-${stamp}.pdf`;

  write("STMG HUB - Notes DS SDGN", { size: 18, bold: true, lh: 22 });
  write(report.examLabel, { size: 11, color: [71, 85, 105], lh: 14 });
  write(`Genere le ${formatFrDate(report.generatedAt)}`, { size: 10, color: [100, 116, 139], lh: 13 });
  write(
    `${report.students.length} eleve(s) - ${report.completedCount} termine(s) - ${report.incompleteCount} en cours ou interrompu(s)`,
    { size: 10, bold: true, color: [15, 118, 110], lh: 14 },
  );
  y += 8;

  if (!report.students.length) {
    write("Aucune copie DS dans ce rapport.", { size: 12, color: [180, 83, 9] });
    footer();
    downloadPdfBlob(doc, outName);
    return { filename: outName, students: 0, answers: 0 };
  }

  for (const s of report.students) {
    const sess = s.session;
    const answered = sess?.questionsAnswered ?? sess?.answers?.length ?? 0;
    const planned = sess?.totalQuestions;
    const prog =
      planned != null && planned > 0 ? `${answered}/${planned}` : `${answered} rep.`;

    ensure(52);
    write(
      `${s.studentName}  |  ${formatDsDisplayStatusLabel(s.displayStatus)}  |  ${formatDsGradeForReport(s)} /20  |  ${prog}`,
      { size: 10, bold: true, lh: 13 },
    );

    const details = buildDsTopicDetailsFromSession(
      sess,
      report.examId,
      topicOrder,
      topicLabels,
    );
    writeTopicDetailsBlock(write, details, { compact: true });
    y += 6;
  }

  footer();
  downloadPdfBlob(doc, outName);
  return { filename: outName, students: report.students.length, answers: 0 };
}

export type DsPersonalReportInput = {
  studentName: string;
  examLabel: string;
  gradeOn20: number;
  scorePoints: number;
  correctCount: number;
  wrongCount: number;
  totalQuestions: number;
  topicStats: Record<string, { correct: number; total: number; acquis: boolean }>;
  topicOrder: readonly string[];
  topicLabels: Record<string, string>;
  topicDetails?: DsTopicReportDetail[];
};

function parseRootNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value.trim().replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

/** Reconstitue note / score / themes depuis users.dsTab (reponses + racine + snapshot). */
export function buildPersonalReportFromUserRecord(
  userRecord: Record<string, unknown>,
  examId: string,
  examLabel: string,
  studentName: string,
): DsPersonalReportInput | null {
  const session = readDsTabLastSession(userRecord, examId);
  const answers = session?.answers ?? [];
  const answered = session?.questionsAnswered ?? answers.length;
  const dsTabBox = userRecord.dsTab;
  const rootTab =
    dsTabBox && typeof dsTabBox === "object" && !Array.isArray(dsTabBox)
      ? ((dsTabBox as Record<string, unknown>)[examId] as Record<string, unknown> | undefined)
      : undefined;
  const rootScore = parseRootNumber(rootTab?.score);
  const rootTotal = parseRootNumber(rootTab?.total);

  if (answered <= 0 && rootScore <= 0 && resolveDsGradeOn20FromUser(userRecord, examId) <= 0) {
    return null;
  }

  const totalQuestions =
    session?.totalQuestions ?? rootTotal ?? session?.questionIds?.length ?? answered;
  const correctCount =
    answers.length > 0
      ? answers.filter((a) => a.outcome === 1).length
      : (session?.correctCount ?? 0);
  const wrongCount =
    answers.length > 0
      ? answers.filter((a) => a.outcome === 0).length
      : (session?.wrongCount ?? 0);
  const scoreFromAnswers = answers.length > 0 ? computeDsScoreFromAnswers(answers) : 0;
  const scorePoints = Math.max(session?.scorePoints ?? 0, rootScore, scoreFromAnswers);
  const gradeOn20 = Math.max(
    resolveDsGradeOn20FromUser(userRecord, examId),
    session?.gradeOn20 ?? 0,
    session?.gradeOn20Provisional ?? 0,
    computeDsGradeOn20(scorePoints, totalQuestions, false),
  );

  const isTerminale = examId === DS_SDGN_TERMINALE_QCM_EXAM_ID;
  const topicOrder = isTerminale ? DS_SDGN_TERMINALE_TOPIC_ORDER : DS_SDGN_TOPIC_ORDER;
  const topicLabels = isTerminale ? DS_SDGN_TERMINALE_TOPIC_LABELS : DS_SDGN_TOPIC_LABELS;

  let topicStats: DsPersonalReportInput["topicStats"] = {};
  if (answers.length > 0) {
    const resolved = resolveDsAnswersForTopicStats(answers, examId);
    topicStats = (isTerminale
      ? computeTerminaleTopicStats(
          resolved as Parameters<typeof computeTerminaleTopicStats>[0],
        )
      : computeTopicStats(resolved as Parameters<typeof computeTopicStats>[0])) as DsPersonalReportInput["topicStats"];
  } else {
    topicStats =
      (session?.topicStats as DsPersonalReportInput["topicStats"]) ?? {};
  }

  const topicDetails = buildDsTopicDetailsFromSession(
    { answers, topicStats },
    examId,
    topicOrder as readonly string[],
    topicLabels as Record<string, string>,
  );

  return {
    studentName,
    examLabel,
    gradeOn20,
    scorePoints,
    correctCount,
    wrongCount,
    totalQuestions,
    topicStats,
    topicOrder: topicOrder as readonly string[],
    topicLabels: topicLabels as Record<string, string>,
    topicDetails,
  };
}

/** Compte rendu individuel eleve. */
export async function exportDsSdgnPersonalSessionPdf(
  input: DsPersonalReportInput,
): Promise<{ filename: string }> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

  const page: PdfPageLayout = { left: 48, bottom: 760, w: 499 };
  let y = 52;

  const writeTop = (
    text: string,
    opts: { size?: number; bold?: boolean; color?: [number, number, number]; lh?: number } = {},
  ) => {
    const { size = 11, bold = false, color = [30, 41, 59], lh = 16 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, page.w);
    if (y + lines.length * lh > page.bottom) {
      doc.addPage();
      y = 52;
    }
    doc.text(lines, page.left, y);
    y += lines.length * lh;
  };

  const stamp = new Date().toISOString().slice(0, 10);
  const safeName = input.studentName.replace(/[^\w\s-]/g, "").trim().replace(/\s+/g, "-") || "eleve";
  const outName = `compte-rendu-ds-${safeName}-${stamp}.pdf`;

  writeTop("Compte rendu DS SDGN", { size: 20, bold: true, lh: 26 });
  writeTop(input.examLabel, { size: 12, color: [71, 85, 105], lh: 18 });
  writeTop(input.studentName, { size: 12, lh: 18 });
  y += 10;

  writeTop(`Note : ${input.gradeOn20} / 20`, { size: 22, bold: true, color: [2, 132, 199], lh: 28 });
  writeTop(
    `${input.correctCount} bonnes reponses  |  ${input.wrongCount} erreurs`,
    { size: 12, lh: 18 },
  );
  y += 18;

  const details =
    input.topicDetails ??
    input.topicOrder.map((topic) => ({
      topic,
      label: input.topicLabels[topic] ?? topic,
      acquis: input.topicStats[topic]?.acquis ?? false,
      correct: input.topicStats[topic]?.correct ?? 0,
      total: input.topicStats[topic]?.total ?? 0,
      failedQuestions: [],
    }));

  y = writeAccessibleDsReport(doc, page, y, details);

  downloadPdfBlob(doc, outName);
  return { filename: outName };
}
