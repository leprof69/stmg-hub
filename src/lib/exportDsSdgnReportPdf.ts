import type { DsSdgnClassReport, DsSdgnStudentReportRow } from "./adminDsSdgnReport";
import {
  formatDsDisplayStatusLabel,
  formatDsGradeForReport,
  formatDsTopicAcquisLabel,
} from "./adminDsSdgnReport";
import { DS_SDGN_TOPIC_LABELS, DS_SDGN_TOPIC_ORDER } from "./dsSdgnQcmTopics";

type PdfWriter = {
  setFont: (face: string, style: string) => void;
  setFontSize: (size: number) => void;
  setTextColor: (r: number, g: number, b: number) => void;
  setDrawColor: (r: number, g: number, b: number) => void;
  setFillColor: (r: number, g: number, b: number) => void;
  splitTextToSize: (text: string, maxWidth: number) => string[];
  text: (text: string | string[], x: number, y: number, opts?: { align?: string }) => void;
  rect: (x: number, y: number, w: number, h: number, style?: string) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  addPage: () => void;
  save: (filename: string) => void;
};

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

function truncate(text: string, max: number): string {
  const t = String(text || "").replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}\u2026`;
}

/** \u00c9l\u00e8ves ayant commenc\u00e9 ou termin\u00e9 (exclut jamais commenc\u00e9 sans donn\u00e9es). */
export function filterDsStudentsWithActivity(
  students: DsSdgnStudentReportRow[],
): DsSdgnStudentReportRow[] {
  return students.filter(
    (s) =>
      s.hasDsData ||
      s.displayStatus !== "not_started" ||
      (s.examRootGrade != null && s.examRootGrade > 0),
  );
}

export function buildDsClassReportForExport(
  report: DsSdgnClassReport,
  onlyWithActivity = true,
): DsSdgnClassReport {
  const students = onlyWithActivity
    ? filterDsStudentsWithActivity(report.students)
    : report.students;
  const answerDetails = report.answerDetails.filter((d) =>
    students.some((s) => s.studentId === d.studentId),
  );
  return {
    ...report,
    students,
    answerDetails,
    withDsDataCount: students.filter((s) => s.hasDsData).length,
    completedCount: students.filter((s) => s.displayStatus === "completed").length,
    incompleteCount: students.filter(
      (s) => s.displayStatus === "incomplete" || s.displayStatus === "disqualified",
    ).length,
  };
}

export async function exportDsSdgnClassReportPdf(
  report: DsSdgnClassReport,
  filename?: string,
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const docPdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
  const doc = docPdf as unknown as PdfWriter;

  const page = { left: 40, right: 555, top: 44, bottom: 800, w: 515 };
  let y = page.top;
  let pageNumber = 1;

  const footer = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`STMG HUB \u2014 Rapport DS SDGN \u2014 p. ${pageNumber}`, page.right, 822, {
      align: "right",
    });
    doc.setTextColor(15, 23, 42);
  };

  const newPage = () => {
    footer();
    docPdf.addPage();
    pageNumber += 1;
    y = page.top;
  };

  const ensure = (h = 20) => {
    if (y + h > page.bottom) newPage();
  };

  const write = (
    text: string,
    opts: {
      size?: number;
      bold?: boolean;
      color?: [number, number, number];
      lineHeight?: number;
      indent?: number;
    } = {},
  ) => {
    const { size = 10, bold = false, color = [15, 23, 42], lineHeight = 13, indent = 0 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(String(text || ""), page.w - indent);
    ensure(lines.length * lineHeight + 2);
    doc.text(lines, page.left + indent, y);
    y += lines.length * lineHeight;
  };

  const section = (title: string, color: [number, number, number] = [4, 120, 87]) => {
    ensure(28);
    write(title, { size: 12, bold: true, color, lineHeight: 16 });
    y += 4;
  };

  const drawTableRow = (
    cells: string[],
    colWidths: number[],
    isHeader: boolean,
    rowH = 15,
  ) => {
    const totalW = colWidths.reduce((a, b) => a + b, 0);
    ensure(rowH + 8);
    let x = page.left;
    if (isHeader) {
      doc.setFillColor(236, 253, 245);
      doc.rect(page.left, y - 11, totalW, rowH, "F");
    }
    doc.setFont("helvetica", isHeader ? "bold" : "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(30, 41, 59);
    for (let i = 0; i < cells.length; i++) {
      const clipped = truncate(cells[i] ?? "", Math.floor(colWidths[i] / 4.5));
      doc.text(clipped, x + 3, y);
      x += colWidths[i];
    }
    doc.setDrawColor(226, 232, 240);
    doc.rect(page.left, y - 11, totalW, rowH);
    y += rowH;
  };

  write("STMG HUB \u2014 Rapport DS SDGN Premi\u00e8re", { size: 16, bold: true, lineHeight: 20 });
  write(report.examLabel, { size: 11, color: [71, 85, 105], lineHeight: 14 });
  write(
    `G\u00e9n\u00e9r\u00e9 le ${formatFrDate(report.generatedAt)}\n` +
      `${report.students.length} \u00e9l\u00e8ve(s) dans ce rapport \u00b7 ` +
      `${report.completedCount} termin\u00e9(s) \u00b7 ` +
      `${report.incompleteCount} en cours / interrompu(s) \u00b7 ` +
      `${report.students.filter((s) => s.displayStatus === "not_started").length} sans activit\u00e9`,
    { size: 9.5, color: [100, 116, 139], lineHeight: 13 },
  );
  y += 8;

  if (!report.students.length) {
    write("Aucune copie DS d\u00e9tect\u00e9e pour l\u2019export.", {
      size: 11,
      color: [180, 83, 9],
    });
    footer();
    docPdf.save(filename || `rapport-ds-sdgn-${new Date().toISOString().slice(0, 10)}.pdf`);
    return;
  }

  section("1. Synth\u00e8se classe (/20 et acquis par notion)");
  const topicShort = DS_SDGN_TOPIC_ORDER.map((t) =>
    truncate(DS_SDGN_TOPIC_LABELS[t].split(" ")[0] ?? t, 10),
  );
  const cols = ["\u00c9l\u00e8ve", "Statut", "Prog.", "Note", ...topicShort];
  const widths = [100, 68, 44, 38, ...DS_SDGN_TOPIC_ORDER.map(() => 48)];
  drawTableRow(cols, widths, true);
  for (const s of report.students) {
    const sess = s.session;
    const answered = sess?.questionsAnswered ?? sess?.answers?.length ?? 0;
    const planned = sess?.totalQuestions;
    const prog =
      planned != null && planned > 0
        ? `${answered}/${planned}`
        : s.displayStatus === "not_started"
          ? "\u2014"
          : `${answered}/?`;
    const topicCells = DS_SDGN_TOPIC_ORDER.map((topic) => {
      const stat = sess?.topicStats?.[topic];
      if (!stat || stat.total <= 0) return s.displayStatus === "not_started" ? "N/C" : "N/E";
      return stat.acquis ? "OK" : "Non";
    });
    drawTableRow(
      [
        s.studentName,
        formatDsDisplayStatusLabel(s.displayStatus),
        prog,
        formatDsGradeForReport(s),
        ...topicCells,
      ],
      widths,
      false,
    );
  }
  y += 6;
  write(
    `Notions : ${DS_SDGN_TOPIC_ORDER.map((t) => DS_SDGN_TOPIC_LABELS[t]).join(" \u00b7 ")}`,
    { size: 8, color: [100, 116, 139], lineHeight: 11 },
  );
  y += 10;

  section("2. Acquis par notion (d\u00e9tail)");
  for (const s of report.students) {
    ensure(40);
    write(s.studentName, { size: 10.5, bold: true, color: [30, 64, 175] });
    const sess = s.session;
    for (const topic of DS_SDGN_TOPIC_ORDER) {
      const stat = sess?.topicStats?.[topic];
      const label = DS_SDGN_TOPIC_LABELS[topic];
      if (stat && stat.total > 0) {
        write(
          `\u2022 ${label} : ${formatDsTopicAcquisLabel(stat.acquis, stat.total)} (${stat.correct}/${stat.total})`,
          { size: 9, indent: 10, lineHeight: 12 },
        );
      } else {
        write(
          `\u2022 ${label} : ${s.displayStatus === "not_started" ? "Non commenc\u00e9" : "Non \u00e9valu\u00e9"}`,
          { size: 9, indent: 10, color: [148, 163, 184], lineHeight: 12 },
        );
      }
    }
    y += 4;
  }

  newPage();
  section("3. D\u00e9tail des r\u00e9ponses (par \u00e9l\u00e8ve)");

  const detailsByStudent = new Map<string, typeof report.answerDetails>();
  for (const row of report.answerDetails) {
    if (!detailsByStudent.has(row.studentId)) {
      detailsByStudent.set(row.studentId, []);
    }
    detailsByStudent.get(row.studentId)!.push(row);
  }

  for (const s of report.students) {
    const rows = detailsByStudent.get(s.studentId) ?? [];
    ensure(36);
    write(`${s.studentName} \u2014 ${formatDsDisplayStatusLabel(s.displayStatus)} \u2014 ${formatDsGradeForReport(s)}`, {
      size: 11,
      bold: true,
      color: [15, 118, 110],
      lineHeight: 15,
    });
    if (!rows.length) {
      write("Aucune r\u00e9ponse enregistr\u00e9e (session sans d\u00e9tail ou non commenc\u00e9e).", {
        size: 9,
        color: [100, 116, 139],
        indent: 8,
      });
      y += 6;
      continue;
    }
    for (const row of rows) {
      ensure(80);
      write(
        `Q${row.index} \u00b7 ${row.topicLabel} \u00b7 ${row.outcomeLabel} \u00b7 ${row.acquisQuestion}`,
        { size: 9.5, bold: true, indent: 6, lineHeight: 12 },
      );
      if (row.scenarioText) {
        write(truncate(row.scenarioText, 420), { size: 8.5, indent: 12, color: [71, 85, 105], lineHeight: 11 });
      }
      write(`Question : ${truncate(row.question, 400)}`, { size: 8.5, indent: 12, lineHeight: 11 });
      write(`R\u00e9ponse \u00e9l\u00e8ve : ${truncate(row.pickedChoice, 200)}`, {
        size: 8.5,
        indent: 12,
        lineHeight: 11,
      });
      write(`Bonne r\u00e9ponse : ${truncate(row.correctChoice, 200)}`, {
        size: 8.5,
        indent: 12,
        color: [5, 150, 105],
        lineHeight: 11,
      });
      y += 3;
    }
    y += 8;
  }

  footer();
  const stamp = new Date().toISOString().slice(0, 10);
  docPdf.save(filename || `rapport-ds-sdgn-complet-${stamp}.pdf`);
}
