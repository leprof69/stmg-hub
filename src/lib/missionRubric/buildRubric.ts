import type { CorrectionExerciseBase } from "../../services/correctionIA";
import type { SdgnMissionExercise } from "../../data/sdgn/types";
import type { MissionExerciseRubric, MissionRubricCriterion } from "./types";
import { normalizeRubricText } from "./normalize";

type MissionExerciseLike = CorrectionExerciseBase & Pick<SdgnMissionExercise, "id" | "notionsCibles">;

const STOP = new Set([
  "reponse",
  "reponses",
  "question",
  "questions",
  "exercice",
  "consigne",
  "support",
  "document",
  "exemple",
  "exemples",
  "notion",
  "notions",
  "mobilise",
  "mobiliser",
  "explique",
  "definis",
  "presente",
  "montre",
  "cite",
  "pourquoi",
  "quelle",
  "quel",
  "quels",
  "quelles",
  "comment",
  "entre",
  "ainsi",
  "donc",
  "dans",
  "avec",
  "sans",
  "plus",
  "toute",
  "tous",
  "toutes",
  "leur",
  "leurs",
  "cette",
  "cela",
  "etre",
  "avoir",
  "faire",
]);

function tokenizeForTerms(text: string): string[] {
  const norm = normalizeRubricText(text);
  const raw = norm.split(" ").filter((w) => w.length >= 4 && !STOP.has(w));
  const freq = new Map<string, number>();
  raw.forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));
  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w);
}

function splitCorrectionSections(modele: string, questionCount: number): string[] {
  const trimmed = String(modele || "").trim();
  if (!trimmed) return Array(questionCount).fill("");

  const byNumber = trimmed.split(/\n(?=\d+\)\s)/).map((block) => block.replace(/^\d+\)\s*/, "").trim());
  if (byNumber.length >= questionCount) return byNumber.slice(0, questionCount);

  const byParagraph = trimmed.split(/\n{2,}/).filter(Boolean);
  if (byParagraph.length >= questionCount) return byParagraph.slice(0, questionCount);

  return Array(questionCount).fill(trimmed);
}

function shortenReperes(section: string, attendu?: string): string[] {
  const source = section.trim() || attendu?.trim() || "";
  if (!source) return ["Reprends les elements du cours et du document."];

  const lines = source
    .split(/\n+/)
    .map((l) => l.replace(/^[-\u2014]\s*/, "").trim())
    .filter((l) => l.length > 12);

  if (lines.length) return lines.slice(0, 3).map((l) => (l.length > 220 ? `${l.slice(0, 217)}...` : l));

  const sentences = source.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
  return sentences.slice(0, 2).map((s) => (s.length > 220 ? `${s.slice(0, 217)}...` : s));
}

function questionNeedsDocument(q: string): boolean {
  return /cite|document|support|texte|chiffre|donn|repere|illustr|appuie|montre que|dans le/i.test(q);
}

function questionIsDefinition(q: string): boolean {
  const n = normalizeRubricText(q);
  return (
    n.includes("definir") ||
    n.includes("definis") ||
    n.includes("qu est ce") ||
    n.includes("quest ce") ||
    n.includes("nomme") ||
    n.includes("presente la notion")
  );
}

function buildCriteriaForQuestion(
  questionIndex: number,
  question: string,
  sectionText: string,
  exercise: MissionExerciseLike
): MissionRubricCriterion[] {
  const terms = tokenizeForTerms(
    [sectionText, exercise.attendu || "", ...(exercise.notionsCibles || [])].join(" ")
  ).slice(0, 14);

  const criteres: MissionRubricCriterion[] = [];

  if (questionIsDefinition(question)) {
    criteres.push({
      id: `q${questionIndex}-def`,
      libelle: "Definition ou notion du cours",
      poids: 2,
      termes: terms.slice(0, 8),
      minHits: 2,
    });
  } else {
    criteres.push({
      id: `q${questionIndex}-fond`,
      libelle: `Idees attendues (question ${questionIndex + 1})`,
      poids: 2,
      termes: terms.slice(0, 10),
      minHits: Math.min(3, Math.max(2, Math.ceil(terms.length * 0.35))),
    });
  }

  if (questionNeedsDocument(question) && exercise.support) {
    const docTerms = tokenizeForTerms(exercise.support).slice(0, 12);
    criteres.push({
      id: `q${questionIndex}-doc`,
      libelle: "Exemples ou chiffres du document",
      poids: 2,
      termes: docTerms.length ? docTerms : terms.slice(0, 6),
      minHits: 2,
    });
  }

  if (/chiffre|calcule|pourcent|%|montant|euro/i.test(question)) {
    const nums = (sectionText.match(/\d+[.,]?\d*/g) || []).slice(0, 6);
    if (nums.length) {
      criteres.push({
        id: `q${questionIndex}-calc`,
        libelle: "Donnees chiffrees pertinentes",
        poids: 2,
        termes: nums,
        minHits: 1,
      });
    }
  }

  return criteres;
}

/** Rubrique auto-generee a partir du sujet (questions + correction modele + support). */
export function buildRubricFromExercise(exercise: MissionExerciseLike): MissionExerciseRubric {
  const questions = exercise.questions ?? [];
  const qCount = Math.max(questions.length, 1);
  const sections = splitCorrectionSections(exercise.correctionModele ?? "", qCount);

  const blocks: { q: number; criteres: MissionRubricCriterion[]; reperes: string[] }[] = [];

  if (questions.length === 0) {
    const terms = tokenizeForTerms(
      [exercise.correctionModele, exercise.attendu, exercise.consigne, exercise.support].filter(Boolean).join(" ")
    ).slice(0, 12);
    blocks.push({
      q: 0,
      criteres: [
        {
          id: "global-fond",
          libelle: "Contenu attendu de l'exercice",
          poids: 3,
          termes: terms,
          minHits: Math.min(4, Math.max(2, Math.ceil(terms.length * 0.4))),
        },
      ],
      reperes: shortenReperes(exercise.correctionModele || "", exercise.attendu),
    });
  } else {
    questions.forEach((question, qi) => {
      blocks.push({
        q: qi,
        criteres: buildCriteriaForQuestion(qi, question, sections[qi] ?? "", exercise),
        reperes: shortenReperes(sections[qi] ?? "", exercise.attendu),
      });
    });
  }

  return {
    exerciseId: exercise.id,
    questions: blocks.map((b) => ({ questionIndex: b.q, criteres: b.criteres })),
    reperes: blocks.map((b) => ({ questionIndex: b.q, lignes: b.reperes })),
  };
}

export function mergeGlossaries(...parts: Array<Record<string, string[]>>): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const part of parts) {
    for (const [key, vals] of Object.entries(part)) {
      const k = normalizeRubricText(key);
      if (!k) continue;
      out[k] = [...new Set([...(out[k] || []), ...vals])];
    }
  }
  return out;
}
