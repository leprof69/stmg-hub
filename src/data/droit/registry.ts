import type { DroitMissionChapter, DroitMissionExercise } from "./types";

import { DROIT_CHAP1_EXERCISES } from "./chapters/chap1";
import { DROIT_CHAP2_EXERCISES } from "./chapters/chap2";
import { DROIT_CHAP3_EXERCISES } from "./chapters/chap3";
import { DROIT_CHAP4_EXERCISES } from "./chapters/chap4";
import { DROIT_CHAP5_EXERCISES } from "./chapters/chap5";

export const DROIT_MATIERE = "Droit" as const;

export const DROIT_EXERCISES_BY_CHAPTER: Record<DroitMissionChapter, DroitMissionExercise[]> = {
  1: DROIT_CHAP1_EXERCISES,
  2: DROIT_CHAP2_EXERCISES,
  3: DROIT_CHAP3_EXERCISES,
  4: DROIT_CHAP4_EXERCISES,
  5: DROIT_CHAP5_EXERCISES,
};

export const DROIT_CHAPTER_LABELS: Record<DroitMissionChapter, string> = {
  1: "La formation du contrat",
  2: "L'ex\u00e9cution du contrat",
  3: "Le dommage r\u00e9parable",
  4: "Les diff\u00e9rents r\u00e9gimes de responsabilit\u00e9s",
  5: "Les moyens d'exon\u00e9ration de la responsabilit\u00e9",
};

export const DROIT_BO_ORDRE_TO_CHAPTER: Record<number, DroitMissionChapter> = {
  84: 1,
  85: 2,
  86: 3,
  88: 4,
  89: 5,
};


export function getDroitMissionChapterNumbers(): number[] {
  return Object.keys(DROIT_EXERCISES_BY_CHAPTER)
    .map((k) => Number(k))
    .filter((n) => Number.isFinite(n) && (DROIT_EXERCISES_BY_CHAPTER[n]?.length ?? 0) > 0)
    .sort((a, b) => a - b);
}

export function isDroitMissionChapter(chapter: number): chapter is DroitMissionChapter {
  return String(chapter) in DROIT_EXERCISES_BY_CHAPTER && (DROIT_EXERCISES_BY_CHAPTER[chapter]?.length ?? 0) > 0;
}

function normalizeChapterTitle(value = ""): string {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function detectDroitChapterNumber(
  chapitre: { ordre?: number; titre?: string } | null,
  matiere: string,
): DroitMissionChapter | null {
  if (matiere !== DROIT_MATIERE || !chapitre) return null;
  const ordre = chapitre.ordre;
  if (ordre != null) {
    if (isDroitMissionChapter(ordre)) return ordre;
    const mapped = DROIT_BO_ORDRE_TO_CHAPTER[ordre];
    if (mapped != null) return mapped;
  }
  const t = normalizeChapterTitle(chapitre.titre || "");
  for (const n of getDroitMissionChapterNumbers()) {
    if (t.includes(`chapitre ${n}`) || t.startsWith(`${n} `) || t.startsWith(`${n}.`)) return n;
  }
  return null;
}

export function getDroitExercises(chapter: DroitMissionChapter): DroitMissionExercise[] {
  return DROIT_EXERCISES_BY_CHAPTER[chapter] ?? [];
}

export function getDroitProgressLabel(chapter: DroitMissionChapter): string {
  return `Droit Chapitre ${chapter}`;
}

export function getDroitChapterBlurb(chapter: DroitMissionChapter): string {
  const label = DROIT_CHAPTER_LABELS[chapter];
  return label
    ? `Pack Terminale : 10 exercices progressifs + 2 etudes de cas - ${label}.`
    : "Pack Droit Terminale en preparation.";
}

export function compareDroitExerciseIds(a: string, b: string): number {
  const ma = a.match(/^drt(\d+)-(e\d+|cas\d+)$/);
  const mb = b.match(/^drt(\d+)-(e\d+|cas\d+)$/);
  if (!ma || !mb) return a.localeCompare(b, "fr");
  const ca = Number(ma[1]);
  const cb = Number(mb[1]);
  if (ca !== cb) return ca - cb;
  const rank = (s: string) => (s.startsWith("e") ? Number(s.slice(1)) : 100 + Number(s.slice(3)));
  return rank(ma[2]) - rank(mb[2]);
}
