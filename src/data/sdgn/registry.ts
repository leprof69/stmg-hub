import type { SdgnMissionChapter, SdgnMissionExercise } from "./types";

import { SDGN_CHAP1_EXERCISES } from "./chapters/chap1";
import { SDGN_CHAP2_EXERCISES } from "./chapters/chap2";
import { SDGN_CHAP3_EXERCISES } from "./chapters/chap3";
import { SDGN_CHAP4_EXERCISES } from "./chapters/chap4";
import { SDGN_CHAP5_EXERCISES } from "./chapters/chap5";
import { SDGN_CHAP6_EXERCISES } from "./chapters/chap6";
import { SDGN_CHAP7_EXERCISES } from "./chapters/chap7";
import { SDGN_CHAP8_EXERCISES } from "./chapters/chap8";
import { SDGN_CHAP9_EXERCISES } from "./chapters/chap9";
import { SDGN_CHAP10_EXERCISES } from "./chapters/chap10";
import { SDGN_CHAP11_EXERCISES } from "./chapters/chap11";
import { SDGN_CHAP12_EXERCISES } from "./chapters/chap12";
import { SDGN_CHAP13_EXERCISES } from "./chapters/chap13";

export const SDGN_EXERCISES_BY_CHAPTER: Record<SdgnMissionChapter, SdgnMissionExercise[]> = {
  1: SDGN_CHAP1_EXERCISES,
  2: SDGN_CHAP2_EXERCISES,
  3: SDGN_CHAP3_EXERCISES,
  4: SDGN_CHAP4_EXERCISES,
  5: SDGN_CHAP5_EXERCISES,
  6: SDGN_CHAP6_EXERCISES,
  7: SDGN_CHAP7_EXERCISES,
  8: SDGN_CHAP8_EXERCISES,
  9: SDGN_CHAP9_EXERCISES,
  10: SDGN_CHAP10_EXERCISES,
  11: SDGN_CHAP11_EXERCISES,
  12: SDGN_CHAP12_EXERCISES,
  13: SDGN_CHAP13_EXERCISES,
};

export const SDGN_CHAPTER_LABELS: Record<SdgnMissionChapter, string> = {
  1: "Types d'organisation",
  2: "Identité et fonctionnement de l'individu",
  3: "Individu dans l'organisation",
  4: "Activité de travail",
  5: "Évaluation et rétribution",
  6: "Technologies et information",
  7: "Technologies numériques collaboratives",
  8: "Influence du numérique sur l'organisation du travail",
  9: "Valeur perçue",
  10: "Valeur financière et boursière",
  11: "Valeur ajoutée et partenariale",
  12: "Prix, coût et marge",
  13: "Performance commerciale et financière",
};

/** Numeros de chapitres presents dans le pack Missions (cles de SDGN_EXERCISES_BY_CHAPTER). */
export function getSdgnMissionChapterNumbers(): number[] {
  return Object.keys(SDGN_EXERCISES_BY_CHAPTER)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

export function isSdgnMissionChapter(chapter: number): boolean {
  return String(chapter) in SDGN_EXERCISES_BY_CHAPTER;
}

/**
 * Chapitres SDGN Première STMG pour les jeux (QCM, Mot mystère).
 * Couvre l'intégralité du programme Première (chapitres 1 à 13).
 */
export const SDGN_PREMIERE_CHAPTER_NUMBERS: readonly SdgnMissionChapter[] = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
];

export function isSdgnPremiereChapter(chapter: number): chapter is SdgnMissionChapter {
  return (SDGN_PREMIERE_CHAPTER_NUMBERS as readonly number[]).includes(chapter);
}

export function normalizeChapterTitle(value = ""): string {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const SUPPORTED: SdgnMissionChapter[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export function detectSdgnChapterNumber(
  chapitre: { ordre?: number; titre?: string } | null,
  matiere: string
): SdgnMissionChapter | null {
  if (matiere !== "Sciences de Gestion" || !chapitre) return null;
  const ordre = chapitre.ordre;
  if (ordre != null && ordre in SDGN_EXERCISES_BY_CHAPTER) return ordre as SdgnMissionChapter;
  const t = normalizeChapterTitle(chapitre.titre || "");
  for (const n of getSdgnMissionChapterNumbers()) {
    if (t.includes(`chapitre ${n}`) || t.startsWith(`${n} `) || t.startsWith(`${n}.`)) return n;
  }
  return null;
}

export function getSdgnExercises(chapter: SdgnMissionChapter): SdgnMissionExercise[] {
  return SDGN_EXERCISES_BY_CHAPTER[chapter] ?? [];
}

export function getSdgnProgressLabel(chapter: SdgnMissionChapter): string {
  return `SDGN Chapitre ${chapter}`;
}

export function getSdgnChapterBlurb(chapter: SdgnMissionChapter): string {
  return `Pack complet : 10 exercices progressifs + 2 \u00e9tudes de cas \u2014 ${SDGN_CHAPTER_LABELS[chapter]}.`;
}
