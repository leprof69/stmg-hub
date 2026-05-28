/**
 * Genere la boite a outils PDF Bac Management (hors site).
 * Sortie : boite-outils-bac-management/
 *
 * Usage : node scripts/generate-boite-outils-bac.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createPdfWriter, slugify, titleCase } from "./bac-toolbox/pdf-helpers.mjs";
import {
  writeBilanPedagogique,
  writeCompteResultatPedagogique,
} from "./bac-toolbox/bilan-compte-resultat.mjs";
import {
  buildFicheContent,
  CHAPTER_LABELS,
  writeNotionFiche,
} from "./bac-toolbox/notions-fiches.mjs";

const OUT_DIR = "boite-outils-bac-management";
const FICHES_DIR = join(OUT_DIR, "fiches");

function loadNotions() {
  const raw = readFileSync("scripts/_notions-list.json", "utf8");
  const data = JSON.parse(raw);
  return data.notions;
}

async function writeGuide(pdf, index) {
  pdf.heading("Boite a outils Bac Management", 1);
  pdf.write("STMG HUB \u2014 Terminale \u2014 Programme officiel Management (15 chapitres)", {
    size: 10,
    color: [71, 85, 105],
  });
  pdf.rule();
  pdf.heading("Contenu du dossier", 2);
  pdf.write(
    "1. 01-Bilan-comptable-explications.pdf \u2014 structure, tableau complet, lecture Bac.\n2. 02-Compte-de-resultat-explications.pdf \u2014 VA, resultats, tableau complet.\n3. Dossier fiches/ \u2014 une fiche PDF par notion du programme (extrait des chapitres Missions Management).\n4. 00-Index-fiches.pdf \u2014 liste de toutes les fiches.",
  );
  pdf.heading("Programme officiel (15 chapitres)", 2);
  for (const [num, label] of Object.entries(CHAPTER_LABELS)) {
    pdf.write(`Chapitre ${num} : ${label}`, { size: 10 });
  }
  pdf.heading(`Index des ${index.length} fiches notions`, 2);
  let currentCh = null;
  for (const item of index) {
    if (item.ch !== currentCh) {
      currentCh = item.ch;
      pdf.write(`\nChapitre ${currentCh} \u2014 ${CHAPTER_LABELS[currentCh] || ""}`, {
        bold: true,
        size: 10,
      });
    }
    pdf.write(`  \u2022 ${item.file} \u2014 ${item.notion}`, { size: 9 });
  }
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(FICHES_DIR, { recursive: true });

  const notions = loadNotions();
  const index = [];

  console.log("PDF Bilan...");
  const pdfBilan = await createPdfWriter();
  writeBilanPedagogique(pdfBilan);
  pdfBilan.save(join(OUT_DIR, "01-Bilan-comptable-explications.pdf"));

  console.log("PDF Compte de resultat...");
  const pdfCr = await createPdfWriter();
  writeCompteResultatPedagogique(pdfCr);
  pdfCr.save(join(OUT_DIR, "02-Compte-de-resultat-explications.pdf"));

  console.log(`PDF Fiches notions (${notions.length})...`);
  for (const { n: notion, chs } of notions) {
    const chapters = chs.sort((a, b) => a - b);
    const fiche = buildFicheContent(notion, chapters);
    const pdf = await createPdfWriter();
    writeNotionFiche(pdf, fiche);
    const primaryCh = chapters[0] ?? 0;
    const fname = `ch${String(primaryCh).padStart(2, "0")}-${slugify(notion)}.pdf`;
    pdf.save(join(FICHES_DIR, fname));
    index.push({ ch: primaryCh, notion: titleCase(notion), file: `fiches/${fname}` });
  }

  index.sort((a, b) => a.ch - b.ch || a.notion.localeCompare(b.notion, "fr"));

  console.log("PDF Guide et index...");
  const pdfGuide = await createPdfWriter();
  await writeGuide(pdfGuide, index);
  pdfGuide.save(join(OUT_DIR, "00-Guide-boite-a-outils.pdf"));

  const pdfIndex = await createPdfWriter();
  pdfIndex.heading("Index des fiches notions", 1);
  pdfIndex.write(`${index.length} fiches \u2014 Management Terminale STMG`);
  let cur = null;
  for (const item of index) {
    if (item.ch !== cur) {
      cur = item.ch;
      pdfIndex.heading(`Chapitre ${cur}`, 2);
      pdfIndex.write(CHAPTER_LABELS[cur] || "", { size: 10 });
    }
    pdfIndex.write(`${item.notion}  \u2192  ${item.file}`, { size: 9 });
  }
  pdfIndex.save(join(OUT_DIR, "00-Index-fiches.pdf"));

  const readme = `Boite a outils Bac Management \u2014 STMG HUB
========================================

Genere le ${new Date().toLocaleString("fr-FR")}

Contenu :
- 00-Guide-boite-a-outils.pdf : mode d'emploi
- 00-Index-fiches.pdf : liste des ${index.length} fiches
- 01-Bilan-comptable-explications.pdf
- 02-Compte-de-resultat-explications.pdf
- fiches/ : une fiche par notion du programme (Management Terminale)

Regenerer : npm run generate:boite-outils-bac
`;
  writeFileSync(join(OUT_DIR, "README.txt"), readme, "utf8");

  console.log(`\nTermine : ${OUT_DIR}/`);
  console.log(`  - 2 fiches comptabilite`);
  console.log(`  - ${index.length} fiches notions`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
