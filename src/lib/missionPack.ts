import {
  detectDroitChapterNumber,
  DROIT_MATIERE,
  getDroitChapterBlurb,
  getDroitExercises,
  getDroitProgressLabel,
} from "../data/droit/registry";
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
import type { SdgnMissionExercise } from "../data/sdgn/types";

export type MissionPackMatiere = "Sciences de Gestion" | typeof MANAGEMENT_MATIERE | typeof DROIT_MATIERE;

export function detectMissionChapterNumber(
  chapitre: { ordre?: number; titre?: string } | null,
  matiere: string,
): number | null {
  if (matiere === "Sciences de Gestion") return detectSdgnChapterNumber(chapitre, matiere);
  if (matiere === MANAGEMENT_MATIERE) return detectManagementChapterNumber(chapitre, matiere);
  if (matiere === DROIT_MATIERE) return detectDroitChapterNumber(chapitre, matiere);
  return null;
}

export function hasMissionPack(matiere: string, chapterNum: number | null): boolean {
  if (chapterNum == null) return false;
  if (matiere === "Sciences de Gestion") return true;
  if (matiere === MANAGEMENT_MATIERE) return true;
  if (matiere === DROIT_MATIERE) {
    return (getDroitExercises(chapterNum)?.length ?? 0) > 0;
  }
  return false;
}

export function getMissionExercises(matiere: string, chapterNum: number): SdgnMissionExercise[] {
  if (matiere === "Sciences de Gestion") return getSdgnExercises(chapterNum);
  if (matiere === MANAGEMENT_MATIERE) return getManagementExercises(chapterNum);
  if (matiere === DROIT_MATIERE) return getDroitExercises(chapterNum);
  return [];
}

export function getMissionProgressLabel(matiere: string, chapterNum: number): string {
  if (matiere === "Sciences de Gestion") return getSdgnProgressLabel(chapterNum);
  if (matiere === MANAGEMENT_MATIERE) return getManagementProgressLabel(chapterNum);
  if (matiere === DROIT_MATIERE) return getDroitProgressLabel(chapterNum);
  return "Missions";
}

export function getMissionChapterBlurb(matiere: string, chapterNum: number): string {
  if (matiere === "Sciences de Gestion") return getSdgnChapterBlurb(chapterNum);
  if (matiere === MANAGEMENT_MATIERE) return getManagementChapterBlurb(chapterNum);
  if (matiere === DROIT_MATIERE) return getDroitChapterBlurb(chapterNum);
  return "";
}
