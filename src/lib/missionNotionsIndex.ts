import { MANAGEMENT_EXERCISES_BY_CHAPTER } from "../data/management/registry";
import { SDGN_EXERCISES_BY_CHAPTER } from "../data/sdgn/registry";

const NOTIONS_BY_EXERCISE_ID: Record<string, string[]> = {};

function registerExercises(exercises: { id: string; notionsCibles?: string[] }[]) {
  for (const ex of exercises) {
    const notions = (ex.notionsCibles ?? []).map((n) => String(n).trim()).filter(Boolean);
    if (notions.length) NOTIONS_BY_EXERCISE_ID[ex.id] = notions;
  }
}

for (const list of Object.values(SDGN_EXERCISES_BY_CHAPTER)) {
  registerExercises(list);
}
for (const list of Object.values(MANAGEMENT_EXERCISES_BY_CHAPTER)) {
  registerExercises(list);
}

export function getMissionNotionsForExercise(exerciseId: string): string[] {
  return NOTIONS_BY_EXERCISE_ID[exerciseId] ?? [];
}
