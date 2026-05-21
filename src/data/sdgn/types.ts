import type { ExerciseSupportTable } from "../../services/correctionIA";

export type SdgnMissionExercise = {
  id: string;
  title: string;
  type: "Exercice" | "Etude de cas";
  difficulty: "Facile" | "Moyen" | "Difficile" | "Tres difficile";
  xp: number;
  consigne: string;
  attendu: string;
  minChars: number;
  support?: string;
  supportTables?: ExerciseSupportTable[];
  questions?: string[];
  correctionModele?: string;
  /** Notions du referentiel a mobiliser (affichage + correction). */
  notionsCibles?: string[];
};

/** Numero de chapitre SDGN present dans le registry Missions (voir registry.ts). */
export type SdgnMissionChapter = number;
