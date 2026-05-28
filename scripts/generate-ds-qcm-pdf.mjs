/**
 * Genere un PDF avec toutes les questions du DS SDGN Premiere (banque complete).
 * Sortie : docs/DS-SDGN-Premiere-QCM-complet.pdf
 *
 * Usage : npm run generate:ds-qcm-pdf
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { createPdfWriter } from "./bac-toolbox/pdf-helpers.mjs";
import { loadDsQcmFromSources } from "./ds-toolbox/parseSdgnQcmFromTs.mjs";

function finalizeDsQuestion(q) {
  return {
    ...q,
    difficulte: q.difficulte === "facile" ? "difficile" : q.difficulte,
  };
}

const OUT_DIR = "docs";
const OUT_FILE = join(OUT_DIR, "DS-SDGN-Premiere-QCM-complet.pdf");

const CHAPTER_LABELS = {
  1: "Types d'organisation",
  2: "Identit\u00e9 et fonctionnement de l'individu",
  3: "Individu dans l'organisation",
  4: "Activit\u00e9 de travail",
  5: "\u00c9valuation et r\u00e9tribution",
  6: "Technologies et information",
  7: "Technologies num\u00e9riques collaboratives",
  8: "Influence du num\u00e9rique sur l'organisation du travail",
  9: "Valeur per\u00e7ue",
  10: "Valeur financi\u00e8re et boursi\u00e8re",
  11: "Valeur ajout\u00e9e et partenariale",
  12: "Prix, co\u00fbt et marge",
  13: "Performance commerciale et financi\u00e8re",
};

const LETTERS = ["A", "B", "C", "D"];

async function main() {
  const raw = loadDsQcmFromSources({
    bankPath: "src/data/sdgn/sdgnMissionQcmBank.ts",
    extraPath: "src/data/sdgn/sdgnDsPremiereQcm.ts",
    purePath: "src/data/sdgn/sdgnDsPremierePureCours.ts",
  });
  const questions = raw.map(finalizeDsQuestion);

  if (questions.length < 100) {
    console.error(`Banque DS trop petite (${questions.length} questions, attendu ~106).`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const pdf = await createPdfWriter();

  pdf.heading("DS SDGN \u2014 Premi\u00e8re \u2014 Banque QCM compl\u00e8te", 1);
  pdf.write(
    `STMG HUB \u2014 ${questions.length} questions \u00e9nonc\u00e9s int\u00e9gr\u00e9s (mini cas + question), comme sur la page DS.`,
    { size: 10, color: [71, 85, 105] },
  );
  pdf.write(
    "Document professeur : r\u00e9ponses correctes indiqu\u00e9es en fin de chaque question. Bar\u00e8me DS : +1 pt / bonne r\u00e9ponse, \u22120,5 pt / erreur.",
    { size: 10, color: [71, 85, 105] },
  );
  pdf.rule();

  pdf.heading("Sommaire par chapitre", 2);
  const byChapter = new Map();
  for (const q of questions) {
    const ch = q.chapter || 0;
    if (!byChapter.has(ch)) byChapter.set(ch, []);
    byChapter.get(ch).push(q);
  }
  for (const ch of [...byChapter.keys()].sort((a, b) => a - b)) {
    const label = CHAPTER_LABELS[ch] ?? `Chapitre ${ch}`;
    pdf.write(`Ch. ${ch} \u2014 ${label} : ${byChapter.get(ch).length} question(s)`, {
      size: 10,
      indent: 8,
    });
  }
  pdf.newPage();

  questions.forEach((q, index) => {
    const num = index + 1;
    const chLabel = CHAPTER_LABELS[q.chapter] ?? `Chapitre ${q.chapter}`;
    pdf.heading(`Question ${num} \u2014 ${q.id}`, 2);
    pdf.write(`Chapitre ${q.chapter} \u2014 ${chLabel}`, {
      size: 9,
      color: [100, 116, 139],
      lineHeight: 12,
    });
    pdf.write(q.question, { size: 11, lineHeight: 15 });
    ySpacer(pdf, 4);

    q.choix.forEach((choice, i) => {
      const letter = LETTERS[i] ?? String(i + 1);
      const mark = i === q.bonIndex ? " \u2713" : "";
      pdf.write(`${letter}. ${choice}${mark}`, {
        size: 10,
        indent: 12,
        lineHeight: 13,
        bold: i === q.bonIndex,
        color: i === q.bonIndex ? [22, 101, 52] : [30, 41, 59],
      });
    });

    const correct = LETTERS[q.bonIndex] ?? "?";
    pdf.write(`R\u00e9ponse correcte : ${correct}`, {
      size: 9,
      bold: true,
      color: [22, 101, 52],
      lineHeight: 12,
    });
    pdf.rule();
  });

  pdf.save(OUT_FILE);
  console.log(`PDF genere : ${OUT_FILE} (${questions.length} questions)`);
}

function ySpacer(pdf, px) {
  pdf.setY(pdf.getY() + px);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
