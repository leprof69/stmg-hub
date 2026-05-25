import type { SdgnMissionExercise } from "../data/sdgn/types";
import {
  detectManagementChapterNumber,
  getManagementChapterBlurb,
  getManagementExercises,
  getManagementProgressLabel,
  MANAGEMENT_MATIERE,
} from "../data/management/registry";
import {
  detectSdgnChapterNumber,
  getSdgnChapterBlurb,
  getSdgnExercises,
  getSdgnProgressLabel,
} from "../data/sdgn/registry";

export type MissionPackMatiere = "Sciences de Gestion" | typeof MANAGEMENT_MATIERE;

export function detectMissionChapterNumber(
  chapitre: { ordre?: number; titre?: string } | null,
  matiere: string,
): number | null {
  if (matiere === "Sciences de Gestion") return detectSdgnChapterNumber(chapitre, matiere);
  if (matiere === MANAGEMENT_MATIERE) return detectManagementChapterNumber(chapitre, matiere);
  return null;
}

export function hasMissionPack(matiere: string, chapterNum: number | null): boolean {
  return chapterNum != null && (matiere === "Sciences de Gestion" || matiere === MANAGEMENT_MATIERE);
}

export function getMissionExercises(matiere: string, chapterNum: number): SdgnMissionExercise[] {
  if (matiere === "Sciences de Gestion") return getSdgnExercises(chapterNum);
  if (matiere === MANAGEMENT_MATIERE) return getManagementExercises(chapterNum);
  return [];
}

export function getMissionProgressLabel(matiere: string, chapterNum: number): string {
  if (matiere === "Sciences de Gestion") return getSdgnProgressLabel(chapterNum);
  if (matiere === MANAGEMENT_MATIERE) return getManagementProgressLabel(chapterNum);
  return "Missions";
}

export function getMissionChapterBlurb(matiere: string, chapterNum: number): string {
  if (matiere === "Sciences de Gestion") return getSdgnChapterBlurb(chapterNum);
  if (matiere === MANAGEMENT_MATIERE) return getManagementChapterBlurb(chapterNum);
  return "";
}
