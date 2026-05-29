import type { DsSdgnDirectGradeRow } from "./adminDsSdgnReport";

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

export async function exportDsSdgnGradesOnlyPdf(
  rows: DsSdgnDirectGradeRow[],
  filename?: string,
): Promise<{ filename: string; students: number; withGrade: number }> {
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

  const stamp = new Date().toISOString().slice(0, 10);
  const outName = filename || `notes-ds-sdgn-${stamp}.pdf`;
  const withGrade = rows.filter((r) => r.gradeOn20 > 0).length;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(4, 120, 87);
  doc.text("STMG HUB - Notes DS SDGN Premiere", page.left, y);
  y += 24;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(`Genere le ${new Date().toLocaleString("fr-FR")}`, page.left, y);
  y += 14;
  doc.text(`${withGrade} note(s) sur ${rows.length} eleve(s)`, page.left, y);
  y += 20;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.text("Eleve", page.left, y);
  doc.text("Note /20", page.right - 60, y, { align: "right" });
  y += 16;

  doc.setDrawColor(226, 232, 240);
  doc.line(page.left, y, page.right, y);
  y += 12;

  for (const row of rows) {
    ensure(20);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59);
    const nameLines = doc.splitTextToSize(row.studentName, page.w - 80);
    doc.text(nameLines, page.left, y);

    doc.setFont("helvetica", "bold");
    const note =
      row.gradeOn20 > 0 ? String(row.gradeOn20) : "\u2014";
    doc.setTextColor(row.gradeOn20 > 0 ? 4 : 148, row.gradeOn20 > 0 ? 120 : 163, row.gradeOn20 > 0 ? 87 : 184);
    doc.text(note, page.right - 60, y, { align: "right" });

    y += Math.max(nameLines.length * 14, 16);
  }

  footer();
  downloadPdfBlob(doc, outName);
  return { filename: outName, students: rows.length, withGrade };
}
