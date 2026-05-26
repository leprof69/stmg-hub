import type { DroitMissionChapter, DroitMissionExercise } from "./types";

export const DROIT_MATIERE = "Droit" as const;

/**
 * Packs Missions Droit Terminale : un fichier chapters/chapN.ts par chapitre fourni.
 * Vide tant que les cours ne sont pas integres.
 */
export const DROIT_EXERCISES_BY_CHAPTER: Record<DroitMissionChapter, DroitMissionExercise[]> = {};

export const DROIT_CHAPTER_LABELS: Record<DroitMissionChapter, string> = {};

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
  if (ordre != null && isDroitMissionChapter(ordre)) return ordre;
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
  if (label) {
    return `Pack Terminale : 10 exercices progressifs + 2 etudes de cas - ${label}.`;
  }
  return "Pack Droit Terminale en preparation.";
}
