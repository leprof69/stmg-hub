/**
 * PDF redige DS SDGN Premiere : un seul enonce par question (cas / calcul / cours).
 * Sortie : docs/DS-SDGN-Premiere-QCM-complet.pdf
 */
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { createPdfWriter } from "./bac-toolbox/pdf-helpers.mjs";
import {
  buildDsDisplayEnonce,
  DS_QUESTION_KIND_LABEL,
  finalizeDsQuestion,
  getDsQuestionKind,
} from "./ds-toolbox/integrateDsQuestion.mjs";
import { loadDsQcmFromSources } from "./ds-toolbox/parseSdgnQcmFromTs.mjs";

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
  8: "Impact du num\u00e9rique sur l'organisation",
  9: "Valeur per\u00e7ue et image de marque",
  10: "Valeur financi\u00e8re et boursi\u00e8re",
  11: "Cr\u00e9ation et mesure de la valeur",
  12: "Prix, co\u00fbts et marges",
  13: "Performance globale",
};

const LETTERS = ["A", "B", "C", "D"];

async function main() {
  const raw = loadDsQcmFromSources({
    bankPath: "src/data/sdgn/sdgnMissionQcmBank.ts",
    extraPath: "src/data/sdgn/sdgnDsPremiereQcm.ts",
    purePath: "src/data/sdgn/sdgnDsPremierePureCours.ts",
    casPath: "src/data/sdgn/sdgnDsPremiereCasEntreprise.ts",
  });
  const questions = raw.map(finalizeDsQuestion).filter((q) => q.difficulte === "difficile");

  if (questions.length < 90) {
    console.error(`Banque DS trop petite (${questions.length} questions eligibles).`);
    process.exit(1);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  const pdf = await createPdfWriter();

  pdf.heading("DS SDGN Premi\u00e8re STMG \u2014 Banque QCM", 1);
  pdf.write(
    `${questions.length} questions difficiles \u00b7 3 types : cas entreprise (texte unique), calcul simple, cours pur.`,
    { size: 10, color: [71, 85, 105] },
  );
  pdf.write("Version professeur : bonne r\u00e9ponse marqu\u00e9e.", {
    size: 10,
    color: [71, 85, 105],
  });
  pdf.rule();

  questions.forEach((q, index) => {
    const num = index + 1;
    const chLabel = CHAPTER_LABELS[q.chapter] ?? `Chapitre ${q.chapter}`;
    const kind = getDsQuestionKind(q);
    const kindLabel = DS_QUESTION_KIND_LABEL[kind];
    const enonce = buildDsDisplayEnonce(q);

    pdf.heading(`Question ${num} \u2014 ${kindLabel}`, 2);
    pdf.write(`Ch. ${q.chapter} \u2014 ${chLabel} \u00b7 ${q.id}`, {
      size: 8,
      color: [100, 116, 139],
      lineHeight: 11,
    });
    pdf.write(enonce, { size: 11, lineHeight: 15 });
    ySpacer(pdf, 6);

    q.choix.forEach((choice, i) => {
      const letter = LETTERS[i] ?? String(i + 1);
      const isCorrect = i === q.bonIndex;
      pdf.write(`${letter}. ${choice}${isCorrect ? "  \u2713" : ""}`, {
        size: 10,
        indent: 10,
        lineHeight: 14,
        bold: isCorrect,
        color: isCorrect ? [22, 101, 52] : [30, 41, 59],
      });
    });

    const correct = LETTERS[q.bonIndex] ?? "?";
    pdf.write(`Correction : ${correct}`, {
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
