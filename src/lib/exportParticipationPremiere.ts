import { COLLECTIONS } from "../services/collectionsData";
import { CARD_BONUS_BY_ID } from "./admin/adminConstants";
import { participationNoteSur20, participationNiveau } from "./adminParticipation";

export type ParticipationPremiereRow = {
  studentId: string;
  nom: string;
  prenom?: string;
  nomFamille?: string;
  email?: string;
  lycee?: string;
  participationPoints: number;
  noteSur20: number;
  niveauLabel: string;
  cartesUniques: number;
  cartesTotal: number;
  cartesParticipation: string;
  cartesPossedees: string;
};

const CARD_META_BY_ID: Record<string, { nom: string; rarete: string }> = (() => {
  const map: Record<string, { nom: string; rarete: string }> = {};
  for (const set of COLLECTIONS) {
    for (const card of set.cartes || []) {
      map[card.id] = { nom: card.nom, rarete: card.rarete };
    }
  }
  return map;
})();

function escapeCsvCell(value: string | number): string {
  const s = String(value ?? "");
  if (/[;"\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function formatCartesList(
  cartes: Record<string, number> | undefined,
  opts: { participationOnly?: boolean },
): string {
  if (!cartes || typeof cartes !== "object") return "";
  const parts: string[] = [];
  for (const [cardId, qtyRaw] of Object.entries(cartes)) {
    const qty = Number(qtyRaw) || 0;
    if (qty <= 0) continue;
    const bonus = CARD_BONUS_BY_ID[cardId] || 0;
    if (opts.participationOnly && bonus <= 0) continue;
    const meta = CARD_META_BY_ID[cardId];
    const label = meta?.nom ?? cardId;
    const rarete = meta?.rarete ?? "?";
    parts.push(`${label} (${rarete})${qty > 1 ? ` x${qty}` : ""}`);
  }
  parts.sort((a, b) => a.localeCompare(b, "fr"));
  return parts.join(" | ");
}

export function buildPremiereParticipationRows(
  reportingRows: readonly Record<string, unknown>[],
): ParticipationPremiereRow[] {
  const premiere = reportingRows.filter((e) => {
    if (String(e.role ?? "") === "admin") return false;
    return String(e.classe ?? "") === "premiere";
  });

  const maxPts = Math.max(0, ...premiere.map((e) => Number(e.participationPoints) || 0));

  const rows: ParticipationPremiereRow[] = premiere.map((e) => {
    const cartes = (e.cartes as Record<string, number>) || {};
    const pts = Number(e.participationPoints) || 0;
    const niveau = participationNiveau(pts);
    const nomAffiche =
      String(e.nomAffiche ?? "") ||
      [e.prenom, e.nom].filter(Boolean).join(" ") ||
      String(e.email ?? "") ||
      `Eleve ${String(e.id ?? "").slice(0, 6)}`;

    return {
      studentId: String(e.id ?? ""),
      nom: nomAffiche,
      prenom: typeof e.prenom === "string" ? e.prenom : undefined,
      nomFamille: typeof e.nom === "string" ? e.nom : undefined,
      email: typeof e.email === "string" ? e.email : undefined,
      lycee: typeof e.lycee === "string" ? e.lycee : undefined,
      participationPoints: Math.round(pts * 10) / 10,
      noteSur20: participationNoteSur20(pts, maxPts),
      niveauLabel: niveau.label,
      cartesUniques: Number(e.cartesUniques) || 0,
      cartesTotal: Number(e.cartesTotal) || 0,
      cartesParticipation: formatCartesList(cartes, { participationOnly: true }),
      cartesPossedees: formatCartesList(cartes, { participationOnly: false }),
    };
  });

  rows.sort((a, b) => a.nom.localeCompare(b.nom, "fr"));
  return rows;
}

function downloadBlob(blob: Blob, filename: string): void {
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

/** Export CSV (Excel FR) : 1\u00e8re STMG, participation et cartes. */
export function exportParticipationPremiereCsv(
  reportingRows: readonly Record<string, unknown>[],
): { filename: string; count: number } {
  const rows = buildPremiereParticipationRows(reportingRows);
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `participation-1ere-${stamp}.csv`;

  const header = [
    "Nom",
    "Prenom",
    "Nom de famille",
    "Email",
    "Lycee",
    "Points participation",
    "Note participation /20",
    "Niveau",
    "Cartes uniques",
    "Cartes total",
    "Cartes rare+ (participation)",
    "Toutes les cartes",
  ];

  const lines = [
    header.join(";"),
    ...rows.map((r) =>
      [
        r.nom,
        r.prenom ?? "",
        r.nomFamille ?? "",
        r.email ?? "",
        r.lycee ?? "",
        r.participationPoints.toFixed(1).replace(".", ","),
        String(r.noteSur20).replace(".", ","),
        r.niveauLabel,
        r.cartesUniques,
        r.cartesTotal,
        r.cartesParticipation,
        r.cartesPossedees,
      ]
        .map(escapeCsvCell)
        .join(";"),
    ),
  ];

  const bom = "\uFEFF";
  const blob = new Blob([bom + lines.join("\r\n")], { type: "text/csv;charset=utf-8" });
  downloadBlob(blob, filename);
  return { filename, count: rows.length };
}

/** Export PDF : liste 1\u00e8re participation + cartes. */
export async function exportParticipationPremierePdf(
  reportingRows: readonly Record<string, unknown>[],
): Promise<{ filename: string; count: number }> {
  const rows = buildPremiereParticipationRows(reportingRows);
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `participation-1ere-${stamp}.pdf`;

  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });

  const page = { left: 40, bottom: 800, w: 515 };
  let y = 48;
  let pageNum = 1;

  const footer = () => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(`STMG HUB - Participation 1ere - page ${pageNum}`, page.left, 820);
    doc.setTextColor(30, 30, 30);
  };

  const newPage = () => {
    footer();
    doc.addPage();
    pageNum += 1;
    y = 48;
  };

  const ensure = (h: number) => {
    if (y + h > page.bottom) newPage();
  };

  const write = (text: string, opts: { size?: number; bold?: boolean; lh?: number } = {}) => {
    const { size = 10, bold = false, lh = 13 } = opts;
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(text, page.w);
    ensure(lines.length * lh);
    doc.text(lines, page.left, y);
    y += lines.length * lh;
  };

  write("STMG HUB - Participation 1ere STMG", { size: 16, bold: true, lh: 20 });
  write(
    `Genere le ${new Date().toLocaleString("fr-FR")} - ${rows.length} eleve(s) - note /20 relative au meilleur score du groupe`,
    { size: 9, lh: 12 },
  );
  y += 8;

  if (!rows.length) {
    write("Aucun eleve de 1ere dans la base.", { size: 11 });
    footer();
    doc.save(filename);
    return { filename, count: 0 };
  }

  rows.forEach((r, index) => {
    ensure(80);
    write(`${index + 1}. ${r.nom}${r.lycee ? ` (${r.lycee})` : ""}`, { size: 11, bold: true, lh: 15 });
    write(
      `Participation : ${r.participationPoints.toFixed(1)} pt - Note : ${r.noteSur20}/20 - ${r.niveauLabel}`,
      { size: 10, lh: 13 },
    );
    write(`Cartes : ${r.cartesUniques} types (${r.cartesTotal} au total)`, { size: 10, lh: 13 });
    if (r.cartesParticipation) {
      write(`Cartes rare+ : ${r.cartesParticipation}`, { size: 9, lh: 12 });
    } else {
      write("Cartes rare+ : aucune", { size: 9, lh: 12 });
    }
    y += 6;
  });

  footer();
  doc.save(filename);
  return { filename, count: rows.length };
}
