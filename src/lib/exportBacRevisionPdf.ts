import type { StudentBacRevisionReport } from "./adminBacRevisionReport";

type PdfWriter = {
  setFont: (face: string, style: string) => void;
  setFontSize: (size: number) => void;
  setTextColor: (r: number, g: number, b: number) => void;
  splitTextToSize: (text: string, maxWidth: number) => string[];
  text: (text: string | string[], x: number, y: number, opts?: { align?: string }) => void;
  addPage: () => void;
  save: (filename: string) => void;
};

function formatDayFr(dayKey: string): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  if (!y || !m || !d) return dayKey;
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function exportStudentBacRevisionPdf(report: StudentBacRevisionReport): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const docPdf = new jsPDF({ unit: "pt", format: "a4" }) as unknown as PdfWriter & {
    internal: unknown;
  };
  const doc = docPdf as PdfWriter;

  const page = { left: 44, right: 551, top: 48, bottom: 790 };
  const contentWidth = page.right - page.left;
  let y = page.top;
  let pageNumber = 1;

  const drawFooter = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139);
    doc.text(`Page ${pageNumber}`, page.right, 825, { align: "right" });
    doc.setTextColor(15, 23, 42);
  };

  const newPage = () => {
    drawFooter();
    docPdf.addPage();
    pageNumber += 1;
    y = page.top;
  };

  const ensureSpace = (needed = 20) => {
    if (y + needed > page.bottom) newPage();
  };

  const writeText = (
    text: string,
    opts: { size?: number; bold?: boolean; color?: [number, number, number]; lineHeight?: number; indent?: number } = {}
  ) => {
    const { size = 10.5, bold = false, color = [15, 23, 42], lineHeight = 14, indent = 0 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    const lines = doc.splitTextToSize(String(text || ""), contentWidth - indent);
    ensureSpace(lines.length * lineHeight + 2);
    doc.text(lines, page.left + indent, y);
    y += lines.length * lineHeight;
    doc.setTextColor(15, 23, 42);
  };

  const writeSection = (title: string, tone: "ok" | "warn" | "urgent" | "neutral") => {
    const palette =
      tone === "ok"
        ? { text: [5, 150, 105] as [number, number, number] }
        : tone === "urgent"
          ? { text: [185, 28, 28] as [number, number, number] }
          : tone === "warn"
            ? { text: [180, 83, 9] as [number, number, number] }
            : { text: [30, 41, 59] as [number, number, number] };
    ensureSpace(28);
    writeText(title, { size: 12, bold: true, color: palette.text, lineHeight: 16 });
    y += 4;
  };

  const writeNotionList = (items: StudentBacRevisionReport["notionsOk"], emptyMsg: string) => {
    if (!items.length) {
      writeText(emptyMsg, { size: 10, color: [100, 116, 139] });
      y += 6;
      return;
    }
    for (const item of items) {
      const matieres = item.matieres.join(" + ");
      writeText(`\u2022 ${item.notion}  (note la plus basse : ${item.grade})  [${matieres}]`, {
        size: 10,
        lineHeight: 13,
        indent: 8,
      });
      for (const ex of item.exercises.slice(0, 3)) {
        writeText(`   - ${ex.title} (${ex.grade})`, { size: 9, color: [71, 85, 105], indent: 16, lineHeight: 12 });
      }
      if (item.exercises.length > 3) {
        writeText(`   - ... +${item.exercises.length - 3} exercice(s)`, {
          size: 9,
          color: [148, 163, 184],
          indent: 16,
          lineHeight: 12,
        });
      }
      y += 2;
    }
    y += 4;
  };

  writeText("STMG HUB \u2014 Rapport de revision Bac", { size: 16, bold: true, lineHeight: 20 });
  writeText(report.studentName, { size: 13, bold: true, color: [30, 64, 175], lineHeight: 18 });
  writeText(
    `Terminale STMG${report.lycee ? ` \u00b7 ${report.lycee}` : ""}\n` +
      `Periode : depuis le ${formatDayFr(report.reportSince)} (premieres tentatives uniquement)\n` +
      `Matieres : Management Terminale + SDGN Premiere\n` +
      `Genere le ${new Date(report.generatedAt).toLocaleString("fr-FR")}`,
    { size: 10, color: [71, 85, 105], lineHeight: 14 }
  );
  y += 8;

  writeText(
    "Legende : notion OK = note B ou mieux a la 1re tentative ; pas OK = en dessous de B ; urgence Bac = C, D ou E.",
    { size: 9.5, color: [100, 116, 139], lineHeight: 13 }
  );
  y += 10;

  if (!report.hasData) {
    writeText(
      "Aucun exercice Management ou SDGN valide pour la periode selectionnee (premiere tentative).",
      { size: 11, color: [100, 116, 139] }
    );
    drawFooter();
    const safeName = report.studentName.replace(/[^\w\s-]/g, "").trim().slice(0, 40) || "eleve";
    docPdf.save(`rapport-bac-${safeName}.pdf`);
    return;
  }

  writeSection("Notions validees (B ou mieux)", "ok");
  writeNotionList(report.notionsOk, "Aucune notion validee sur la periode.");

  writeSection("Notions a consolider (en dessous de B, hors urgence)", "warn");
  writeNotionList(report.notionsPasOk, "Rien a signaler dans cette categorie.");

  writeSection("A reviser en urgence pour le Bac (C, D, E)", "urgent");
  writeNotionList(report.notionsUrgent, "Aucune notion en urgence \u2014 tres bien.");

  y += 6;
  writeSection("Detail des exercices (1re tentative)", "neutral");
  for (const row of report.exerciseRows) {
    ensureSpace(36);
    writeText(`${row.matiere} \u00b7 ${row.chapter.replace(/^(SDGN|Management)\s+/i, "")}`, {
      size: 9,
      bold: true,
      color: [71, 85, 105],
      lineHeight: 12,
    });
    writeText(`${row.title}  \u2014  ${row.grade}  (${row.score.toFixed(1)}/10)  \u00b7  ${formatDayFr(row.claimDate)}`, {
      size: 10,
      indent: 4,
      lineHeight: 13,
    });
    if (row.notions.length) {
      writeText(`Notions : ${row.notions.join(", ")}`, { size: 9, color: [100, 116, 139], indent: 8, lineHeight: 12 });
    }
    y += 4;
  }

  drawFooter();
  const safeName = report.studentName.replace(/[^\w\s-]/g, "").trim().slice(0, 40) || "eleve";
  docPdf.save(`rapport-bac-${safeName}.pdf`);
}
