import type { DsSdgnClassReport } from "./adminDsSdgnReport";
import {
  formatDsDisplayStatusLabel,
  formatDsGradeForReport,
  formatDsTopicAcquisLabel,
} from "./adminDsSdgnReport";
import { DS_SDGN_TOPIC_LABELS, DS_SDGN_TOPIC_ORDER } from "./dsSdgnQcmTopics";

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

export function buildDsClassReportForExport(report: DsSdgnClassReport): DsSdgnClassReport {
  return report;
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
    doc.text(`STMG HUB - Rapport DS SDGN - page ${pageNum}`, page.left, 820);
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

  const write = (
    text: string,
    opts: { size?: number; bold?: boolean; color?: [number, number, number]; lh?: number; indent?: number } = {},
  ) => {
    const { size = 10, bold = false, color = [30, 41, 59], lh = 13, indent = 0 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(text, page.w - indent);
    ensure(lines.length * lh + 2);
    doc.text(lines, page.left + indent, y);
    y += lines.length * lh;
  };

  const stamp = new Date().toISOString().slice(0, 10);
  const outName = filename || `rapport-ds-sdgn-complet-${stamp}.pdf`;
  const answerTotal = report.answerDetails.length;

  write("STMG HUB - Rapport DS SDGN Premiere", { size: 18, bold: true, lh: 22 });
  write(report.examLabel, { size: 11, color: [71, 85, 105], lh: 14 });
  write(`Genere le ${formatFrDate(report.generatedAt)}`, { size: 10, color: [100, 116, 139], lh: 13 });
  write(
    `${report.students.length} eleve(s) - ${report.completedCount} termine(s) - ${report.incompleteCount} en cours/interrompu - ${answerTotal} reponses detaillees`,
    { size: 10, bold: true, color: [15, 118, 110], lh: 14 },
  );
  y += 8;

  if (!report.students.length) {
    write("Aucune copie DS dans ce rapport.", { size: 12, color: [180, 83, 9] });
    footer();
    downloadPdfBlob(doc, outName);
    return { filename: outName, students: 0, answers: 0 };
  }

  write("1. Synthese classe (notes /20)", { size: 13, bold: true, color: [4, 120, 87], lh: 16 });
  y += 4;

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

    const notionParts = DS_SDGN_TOPIC_ORDER.map((topic) => {
      const stat = sess?.topicStats?.[topic];
      const short = DS_SDGN_TOPIC_LABELS[topic].split(" ")[0];
      if (stat && stat.total > 0) {
        return `${short}: ${stat.acquis ? "Acquis" : "Non"} (${stat.correct}/${stat.total})`;
      }
      return `${short}: N/E`;
    });
    write(notionParts.join("  |  "), { size: 8.5, color: [71, 85, 105], lh: 11, indent: 10 });
    y += 4;
  }

  newPage();
  write("2. Detail des reponses", { size: 13, bold: true, color: [4, 120, 87], lh: 16 });
  y += 6;

  const byStudent = new Map<string, typeof report.answerDetails>();
  for (const row of report.answerDetails) {
    if (!byStudent.has(row.studentId)) byStudent.set(row.studentId, []);
    byStudent.get(row.studentId)!.push(row);
  }

  for (const s of report.students) {
    const rows = byStudent.get(s.studentId) ?? [];
    ensure(28);
    write(
      `${s.studentName} - ${formatDsGradeForReport(s)} /20 - ${formatDsDisplayStatusLabel(s.displayStatus)}`,
      { size: 11, bold: true, color: [30, 64, 175], lh: 14 },
    );

    if (!rows.length) {
      write(
        "Pas de detail question par question (note et notions OK en section 1). Les reponses sont peut-etre seulement dans users.dsTab.lastSession.",
        { size: 9, color: [148, 163, 184], indent: 8, lh: 12 },
      );
      y += 6;
      continue;
    }

    for (const row of rows) {
      ensure(70);
      write(
        `Q${row.index} - ${row.topicLabel} - ${row.outcomeLabel}`,
        { size: 9.5, bold: true, indent: 8, lh: 12 },
      );
      if (row.scenarioText) {
        write(truncate(row.scenarioText, 480), { size: 8.5, indent: 12, lh: 11 });
      }
      write(`Question : ${truncate(row.question, 460)}`, { size: 8.5, indent: 12, lh: 11 });
      write(`Eleve : ${truncate(row.pickedChoice, 220)}`, { size: 8.5, indent: 12, lh: 11 });
      write(`Correct : ${truncate(row.correctChoice, 220)}`, {
        size: 8.5,
        indent: 12,
        color: [5, 150, 105],
        lh: 11,
      });
      y += 2;
    }
    y += 6;
  }

  footer();
  downloadPdfBlob(doc, outName);
  return { filename: outName, students: report.students.length, answers: answerTotal };
}
