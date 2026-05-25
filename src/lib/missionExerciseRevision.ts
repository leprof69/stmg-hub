import {
  MISSION_EXERCISE_CONTENT_REVISION,
  MISSION_EXERCISE_IDS_AT_REVISION_2,
} from "../data/missionRevisionManifest";

/** Revision actuelle du contenu d'un exercice Missions (1 = version initiale). */
export function getMissionExerciseContentRevision(exerciseId: string): number {
  if (MISSION_EXERCISE_IDS_AT_REVISION_2.has(exerciseId)) return MISSION_EXERCISE_CONTENT_REVISION;
  return 1;
}
