import type { CorrectionExerciseBase, MissionLocalEval } from "../../services/correctionIA";
import { sanitizeMissionEvaluationText } from "../missionGrades";
import type {
  MissionChapterGlossary,
  MissionExerciseRubric,
  MissionRubricCriterion,
} from "./types";
import { compactToken, normalizeRubricText } from "./normalize";

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

function sanitizeEval<T extends {
  feedback: string;
  analyseDeveloppee?: string;
  pointsForts: string;
  pointsFaibles: string;
  conseilsProgression?: string;
  propositionReponse: string;
}>(evalResult: T): T {
  return {
    ...evalResult,
    feedback: sanitizeMissionEvaluationText(evalResult.feedback),
    analyseDeveloppee: evalResult.analyseDeveloppee
      ? sanitizeMissionEvaluationText(evalResult.analyseDeveloppee)
      : evalResult.analyseDeveloppee,
    pointsForts: sanitizeMissionEvaluationText(evalResult.pointsForts),
    pointsFaibles: sanitizeMissionEvaluationText(evalResult.pointsFaibles),
    conseilsProgression: evalResult.conseilsProgression
      ? sanitizeMissionEvaluationText(evalResult.conseilsProgression)
      : evalResult.conseilsProgression,
    propositionReponse: evalResult.propositionReponse,
  };
}

function expandTerms(terms: string[], glossary: MissionChapterGlossary): string[] {
  const out = new Set<string>();
  for (const raw of terms) {
    const norm = normalizeRubricText(raw);
    const compact = compactToken(raw);
    if (norm) out.add(norm);
    if (compact) out.add(compact);
    const variants = glossary[norm] || glossary[compact] || [];
    for (const v of variants) {
      const vn = normalizeRubricText(v);
      const vc = compactToken(v);
      if (vn) out.add(vn);
      if (vc) out.add(vc);
    }
  }
  return Array.from(out).filter((t) => t.length >= 3);
}

function countDistinctHits(textNorm: string, terms: string[]): number {
  const compact = textNorm.replace(/\s+/g, "");
  const matched = new Set<string>();
  for (const term of terms) {
    if (term.length < 3) continue;
    const hit = term.includes(" ")
      ? textNorm.includes(term)
      : textNorm.includes(term) || compact.includes(term.replace(/\s+/g, ""));
    if (hit) matched.add(term);
  }
  return matched.size;
}

type CriterionStatus = "ok" | "partiel" | "manquant";

function evaluateCriterion(
  answerText: string,
  crit: MissionRubricCriterion,
  glossary: MissionChapterGlossary
): CriterionStatus {
  const textNorm = normalizeRubricText(answerText);
  if (!textNorm) return "manquant";

  const expanded = expandTerms(crit.termes, glossary);
  const minHits = crit.minHits ?? 1;
  const hits = countDistinctHits(textNorm, expanded);

  if (hits >= minHits) return "ok";
  if (hits > 0) return "partiel";
  return "manquant";
}

export type RubricCriterionResult = {
  questionIndex: number;
  criterionId: string;
  libelle: string;
  status: CriterionStatus;
  poids: number;
  poidsObtenu: number;
};

export type MissionRubricEvalResult = Omit<MissionLocalEval, "source"> & {
  rubricDetails: RubricCriterionResult[];
  source: "rubric";
};

export function buildReperesDisplay(rubric: MissionExerciseRubric): string {
  const lines: string[] = ["Rep\u00e8res de correction (niveau cours) :", ""];
  for (const rep of rubric.reperes) {
    lines.push(`Question ${rep.questionIndex + 1}`);
    rep.lignes.forEach((l) => lines.push(`\u2014 ${l}`));
    lines.push("");
  }
  return lines.join("\n").trim();
}

/** Correction locale par grille + glossaire (pilote Management ch.1). */
export function rubricCorrectionMissions(
  exercise: CorrectionExerciseBase,
  answersByQuestion: string[],
  rubric: MissionExerciseRubric,
  glossary: MissionChapterGlossary
): MissionRubricEvalResult {
  const combined = answersByQuestion.map((a) => String(a || "").trim()).join("\n\n");
  const empty = !combined.trim();

  if (empty) {
    return {
      ...sanitizeEval({
        score: 0,
        feedback: "R\u00e9ponse vide : r\u00e9ponds \u00e0 chaque question ci-dessus.",
        analyseDeveloppee: "",
        pointsForts: "Aucun \u00e9l\u00e9ment exploitable pour le moment.",
        pointsFaibles: "Toutes les questions sont \u00e0 compl\u00e9ter.",
        conseilsProgression: "Appuie-toi sur le document pour chaque question.",
        propositionReponse: buildReperesDisplay(rubric),
      }),
      rubricDetails: [],
      source: "rubric",
    };
  }

  const details: RubricCriterionResult[] = [];
  let totalWeight = 0;
  let earnedWeight = 0;

  for (const block of rubric.questions) {
    const qText = answersByQuestion[block.questionIndex] || "";
    for (const crit of block.criteres) {
      totalWeight += crit.poids;
      const status = evaluateCriterion(qText, crit, glossary);
      const poidsObtenu = status === "ok" ? crit.poids : status === "partiel" ? crit.poids * 0.5 : 0;
      earnedWeight += poidsObtenu;
      details.push({
        questionIndex: block.questionIndex,
        criterionId: crit.id,
        libelle: crit.libelle,
        status,
        poids: crit.poids,
        poidsObtenu,
      });
    }
  }

  const ratio = totalWeight > 0 ? earnedWeight / totalWeight : 0;
  let score = 2 + ratio * 7;
  if (combined.length >= exercise.minChars) score += 0.4;
  if (combined.length >= exercise.minChars * 1.25) score += 0.3;
  if (ratio >= 0.55) score += 0.4;
  if (ratio >= 0.8) score += 0.3;
  score = clamp(Math.round(score * 10) / 10, 0, 10);

  const okLines: string[] = [];
  const missLines: string[] = [];
  const partialLines: string[] = [];

  for (const d of details) {
    const prefix = `Q${d.questionIndex + 1}`;
    if (d.status === "ok") okLines.push(`${prefix} : ${d.libelle}`);
    else if (d.status === "partiel") partialLines.push(`${prefix} : ${d.libelle} (incomplet)`);
    else missLines.push(`${prefix} : ${d.libelle}`);
  }

  const feedback =
    ratio >= 0.75
      ? "Bonne copie : la plupart des crit\u00e8res du chapitre sont couverts."
      : ratio >= 0.5
        ? "Copie correcte : continue \u00e0 pr\u00e9ciser les notions et les exemples du document."
        : "Copie \u00e0 retravailler : plusieurs crit\u00e8res du cours ne sont pas encore visibles.";

  const analyseParts: string[] = [];
  if (okLines.length) analyseParts.push("Valid\u00e9 :\n" + okLines.map((l) => `\u2022 ${l}`).join("\n"));
  if (partialLines.length) analyseParts.push("Partiel :\n" + partialLines.map((l) => `\u2022 ${l}`).join("\n"));
  if (missLines.length) analyseParts.push("Manquant :\n" + missLines.map((l) => `\u2022 ${l}`).join("\n"));

  const pointsForts =
    okLines.length >= 2
      ? "Tu mobilises plusieurs notions attendues avec des rep\u00e8res du support."
      : okLines.length === 1
        ? "Un crit\u00e8re important est bien trait\u00e9."
        : "Quelques pistes sont amorc\u00e9es ; appuie-toi sur le document.";

  const pointsFaibles = missLines.length
    ? `\u00c0 renforcer : ${missLines.slice(0, 5).join(" ; ")}.`
    : partialLines.length
      ? `Pr\u00e9cise : ${partialLines.slice(0, 4).join(" ; ")}.`
      : "Peu d'\u00e9l\u00e9ments manquants : v\u00e9rifie la formulation et les chiffres du texte.";

  const conseils = missLines.length
    ? "Reprends chaque question une par une avec les rep\u00e8res propos\u00e9s ci-dessous."
    : "Relis ta copie pour int\u00e9grer les crit\u00e8res encore partiels.";

  const base = sanitizeEval({
    score,
    feedback,
    analyseDeveloppee: analyseParts.join("\n\n"),
    pointsForts,
    pointsFaibles,
    conseilsProgression: conseils,
    propositionReponse: buildReperesDisplay(rubric),
  });

  return { ...base, rubricDetails: details, source: "rubric" };
}
