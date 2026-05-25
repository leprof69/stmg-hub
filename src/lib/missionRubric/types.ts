/** Critère d'une grille de correction Missions (sans IA). */
export type MissionRubricCriterion = {
  id: string;
  /** Libellà affiché dans le feedback élève. */
  libelle: string;
  poids: number;
  /** Termes ou expressions du cours (synonymes via glossaire chapitre). */
  termes: string[];
  /** Nombre minimal de termes distincts à repèrer (ex. deux sources = 2). */
  minHits?: number;
};

export type MissionRubricQuestion = {
  questionIndex: number;
  criteres: MissionRubricCriterion[];
};

/** Repères courts affichés à l'élève (proposition de correction). */
export type MissionReperesQuestion = {
  questionIndex: number;
  lignes: string[];
};

export type MissionExerciseRubric = {
  exerciseId: string;
  questions: MissionRubricQuestion[];
  reperes: MissionReperesQuestion[];
};

/** Glossaire : clà normalis—e ? variantes acceptées (sans la clà elle-mème). */
export type MissionChapterGlossary = Record<string, string[]>;
