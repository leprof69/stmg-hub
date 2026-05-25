import type { SdgnMissionExercise } from "../../data/sdgn/types";
import { MANAGEMENT_CHAP1_GLOSSAIRE } from "../../data/management/glossaire/chap1";
import { MANAGEMENT_CHAP1_RUBRICS } from "../../data/management/rubric/chap1";
import { getMissionExercises, hasMissionPack } from "../missionPack";
import { buildRubricFromExercise, mergeGlossaries } from "./buildRubric";
import type { MissionChapterGlossary, MissionExerciseRubric } from "./types";
import { normalizeRubricText } from "./normalize";

const MANAGEMENT_MATIERE = "Management";
const SDGN_MATIERE = "Sciences de Gestion";

const BASE_GLOSSARY: MissionChapterGlossary = {
  marche: ["marche", "concurrence", "clients", "secteur"],
  organisation: ["organisation", "entreprise", "structure"],
  strategie: ["strategie", "strategique", "decision"],
  rentabilite: ["rentabilite", "rentable", "profit"],
  chiffre: ["chiffre", "chiffres", "donnee", "donnees", "indicateur"],
};

export type MissionRubricPack = {
  glossaire: MissionChapterGlossary;
  getRubric: (exerciseId: string) => MissionExerciseRubric | null;
};

function glossaryFromExercises(exercises: SdgnMissionExercise[]): MissionChapterGlossary {
  const out: MissionChapterGlossary = {};
  for (const ex of exercises) {
    for (const notion of ex.notionsCibles ?? []) {
      const key = normalizeRubricText(notion);
      if (key.length < 4) continue;
      if (!out[key]) out[key] = [notion];
    }
  }
  return out;
}

function rubricForExercise(
  exercise: SdgnMissionExercise,
  matiere: string,
  chapterNum: number
): MissionExerciseRubric {
  if (matiere === MANAGEMENT_MATIERE && chapterNum === 1 && MANAGEMENT_CHAP1_RUBRICS[exercise.id]) {
    return MANAGEMENT_CHAP1_RUBRICS[exercise.id];
  }
  return buildRubricFromExercise(exercise);
}

/** Pack grille pour tout chapitre Missions SDGN ou Management (sans IA). */
export function getMissionRubricPack(matiere: string, chapterNum: number | null): MissionRubricPack | null {
  if (!hasMissionPack(matiere, chapterNum) || chapterNum == null) return null;

  const exercises = getMissionExercises(matiere, chapterNum);
  if (!exercises.length) return null;

  const glossaire = mergeGlossaries(
    BASE_GLOSSARY,
    glossaryFromExercises(exercises),
    matiere === MANAGEMENT_MATIERE && chapterNum === 1 ? MANAGEMENT_CHAP1_GLOSSAIRE : {}
  );

  return {
    glossaire,
    getRubric: (exerciseId) => {
      const ex = exercises.find((e) => e.id === exerciseId);
      if (!ex) return null;
      return rubricForExercise(ex, matiere, chapterNum);
    },
  };
}

export function missionPackUsesRubricCorrection(matiere: string, chapterNum: number | null): boolean {
  return getMissionRubricPack(matiere, chapterNum) != null;
}
