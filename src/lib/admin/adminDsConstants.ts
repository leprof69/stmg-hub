import { DS_EXERCISES } from "../../services/devoirSurveilleExamData";

export { DS_EXAM_ID, DS_LOCK_TYPE, DS_EXERCISES } from "../../services/devoirSurveilleExamData";

export const DS_EXERCISE_BY_ID = Object.fromEntries(
  DS_EXERCISES.map((exercise) => [exercise.id, exercise]),
);
