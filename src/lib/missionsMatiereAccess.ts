/** Regles d'acces Missions par niveau (decouple du catalogue cours Firestore). */

export type MissionNiveau = "premiere" | "terminale";

export const MISSIONS_MATIERES_CATALOG = [
  { matiere: "Sciences de Gestion", label: "SDGN" },
  { matiere: "Management", label: "Management" },
  { matiere: "Droit", label: "Droit" },
  { matiere: "\u00c9conomie", label: "\u00c9conomie" },
] as const;

export type MissionMatiereId = (typeof MISSIONS_MATIERES_CATALOG)[number]["matiere"];

/** Matieres visibles dans le select Missions pour un niveau. */
export function getMissionsMatieresForNiveau(niveau: MissionNiveau): { matiere: MissionMatiereId; label: string }[] {
  if (niveau === "premiere") {
    return [{ matiere: "Sciences de Gestion", label: "SDGN" }];
  }
  return [
    { matiere: "Sciences de Gestion", label: "SDGN" },
    { matiere: "Droit", label: "Droit" },
    { matiere: "Management", label: "Management" },
  ];
}

/** Un pack code (SDGN / Management / Droit) ne doit pas s'afficher hors du bon niveau. */
export function isMissionPackAllowedForNiveau(matiere: string, niveau: MissionNiveau): boolean {
  if (matiere === "Sciences de Gestion") return true;
  if (matiere === "Management" || matiere === "Droit") return niveau === "terminale";
  return false;
}

export function missionsEmptyStateMessage(niveau: MissionNiveau, matiere: string): string {
  if (niveau === "premiere") {
    return "Premiere STMG : packs Missions SDGN (ch. 1 a 13). Management et Droit sont reserves a la Terminale.";
  }
  if (matiere === "Droit") {
    return "Droit Terminale : packs ch. 1 a 5 (formation du contrat, execution, dommage, responsabilites, exoneration).";
  }
  if (matiere === "Management") {
    return "Management Terminale : packs ch. 1 a 15 (10 exercices + 2 etudes de cas par chapitre).";
  }
  if (matiere === "Sciences de Gestion") {
    return "SDGN : packs disponibles selon le chapitre selectionne (Premiere et Terminale).";
  }
  return "Selectionne un chapitre avec un pack Missions disponible.";
}
