import type { ManagementMissionChapter, ManagementMissionExercise } from "./types";

import { MANAGEMENT_CHAP1_EXERCISES } from "./chapters/chap1";
import { MANAGEMENT_CHAP2_EXERCISES } from "./chapters/chap2";
import { MANAGEMENT_CHAP3_EXERCISES } from "./chapters/chap3";
import { MANAGEMENT_CHAP4_EXERCISES } from "./chapters/chap4";
import { MANAGEMENT_CHAP5_EXERCISES } from "./chapters/chap5";
import { MANAGEMENT_CHAP6_EXERCISES } from "./chapters/chap6";
import { MANAGEMENT_CHAP7_EXERCISES } from "./chapters/chap7";
import { MANAGEMENT_CHAP8_EXERCISES } from "./chapters/chap8";
import { MANAGEMENT_CHAP9_EXERCISES } from "./chapters/chap9";
import { MANAGEMENT_CHAP10_EXERCISES } from "./chapters/chap10";
import { MANAGEMENT_CHAP11_EXERCISES } from "./chapters/chap11";
import { MANAGEMENT_CHAP12_EXERCISES } from "./chapters/chap12";
import { MANAGEMENT_CHAP13_EXERCISES } from "./chapters/chap13";
import { MANAGEMENT_CHAP14_EXERCISES } from "./chapters/chap14";
import { MANAGEMENT_CHAP15_EXERCISES } from "./chapters/chap15";

export const MANAGEMENT_MATIERE = "Management" as const;

export const MANAGEMENT_EXERCISES_BY_CHAPTER: Record<ManagementMissionChapter, ManagementMissionExercise[]> = {
  1: MANAGEMENT_CHAP1_EXERCISES,
  2: MANAGEMENT_CHAP2_EXERCISES,
  3: MANAGEMENT_CHAP3_EXERCISES,
  4: MANAGEMENT_CHAP4_EXERCISES,
  5: MANAGEMENT_CHAP5_EXERCISES,
  6: MANAGEMENT_CHAP6_EXERCISES,
  7: MANAGEMENT_CHAP7_EXERCISES,
  8: MANAGEMENT_CHAP8_EXERCISES,
  9: MANAGEMENT_CHAP9_EXERCISES,
  10: MANAGEMENT_CHAP10_EXERCISES,
  11: MANAGEMENT_CHAP11_EXERCISES,
  12: MANAGEMENT_CHAP12_EXERCISES,
  13: MANAGEMENT_CHAP13_EXERCISES,
  14: MANAGEMENT_CHAP14_EXERCISES,
  15: MANAGEMENT_CHAP15_EXERCISES,
};

export const MANAGEMENT_CHAPTER_LABELS: Record<ManagementMissionChapter, string> = {
  1: "Quels produits ou services pour quels besoins ?",
  2: "Comment cr\u00e9er de la valeur et la mesurer ?",
  3: "Quelles ressources financi\u00e8res pour produire ?",
  4: "Quelles ressources humaines pour produire ?",
  5: "Quels choix d'organisation de la production (qualit\u00e9 et flexibilit\u00e9) ?",
  6: "Pourquoi contr\u00f4ler les co\u00fbts ?",
  7: "Quel est le r\u00f4le des technologies num\u00e9riques dans la production ?",
  8: "Comment organiser et piloter la production ?",
  9: "Comment le management prend-il en compte les attentes des acteurs ?",
  10: "Comment f\u00e9d\u00e9rer les acteurs de l'organisation ?",
  11: "Les transformations num\u00e9riques dans l'organisation",
  12: "Comment une organisation communique-t-elle avec ses acteurs ?",
  13: "Quels enjeux \u00e9thiques dans l'activit\u00e9 des organisations ?",
  14: "Comment les organisations prennent-elles en compte les changements des modes de vie ?",
  15: "Quelles responsabilit\u00e9s le num\u00e9rique cr\u00e9e-t-il pour les organisations ?",
};

export function getManagementMissionChapterNumbers(): number[] {
  return Object.keys(MANAGEMENT_EXERCISES_BY_CHAPTER)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n))
    .sort((a, b) => a - b);
}

export function isManagementMissionChapter(chapter: number): chapter is ManagementMissionChapter {
  return String(chapter) in MANAGEMENT_EXERCISES_BY_CHAPTER;
}

function normalizeChapterTitle(value = ""): string {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function detectManagementChapterNumber(
  chapitre: { ordre?: number; titre?: string } | null,
  matiere: string,
): ManagementMissionChapter | null {
  if (matiere !== MANAGEMENT_MATIERE || !chapitre) return null;
  const ordre = chapitre.ordre;
  if (ordre != null && isManagementMissionChapter(ordre)) return ordre;
  const t = normalizeChapterTitle(chapitre.titre || "");
  for (const n of getManagementMissionChapterNumbers()) {
    if (t.includes(`chapitre ${n}`) || t.startsWith(`${n} `) || t.startsWith(`${n}.`)) return n;
  }
  return null;
}

export function getManagementExercises(chapter: ManagementMissionChapter): ManagementMissionExercise[] {
  return MANAGEMENT_EXERCISES_BY_CHAPTER[chapter] ?? [];
}

export function getManagementProgressLabel(chapter: ManagementMissionChapter): string {
  return `Management Chapitre ${chapter}`;
}

export function getManagementChapterBlurb(chapter: ManagementMissionChapter): string {
  return `Pack Terminale : 10 exercices progressifs + 2 études de cas \u2014 ${MANAGEMENT_CHAPTER_LABELS[chapter]}.`;
}
