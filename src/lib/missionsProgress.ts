import { getMissionExerciseContentRevision } from "./missionExerciseRevision";

/** Schema Firestore `missionsProgress.version` (structure, pas reset de progression). */
export const MISSIONS_PROGRESS_VERSION = 1 as const;

export type MissionClaimEntry = {
  lastClaimDate?: string;
  totalClaims?: number;
  /** Revision de contenu pour laquelle des jetons ont deja ete accordes. */
  jetonsAtRevision?: number;
  lastScore?: number;
  lastPercent?: number;
  lastXpAwarded?: number;
  /** Dernier retour correction (admin / suivi pedagogique). */
  lastPointsForts?: string;
  lastPointsFaibles?: string;
};

export function jetonsRevisionDejaAccordee(exerciseId: string, entry?: MissionClaimEntry): number {
  if (entry?.jetonsAtRevision != null) return entry.jetonsAtRevision;
  if ((entry?.lastXpAwarded ?? 0) > 0) return 1;
  return 0;
}

/** Regle habituelle : 1 chance de jetons par revision de contenu de l'exercice. */
export function missionJetonsDejaGagnes(exerciseId: string, entry?: MissionClaimEntry): boolean {
  const current = getMissionExerciseContentRevision(exerciseId);
  return jetonsRevisionDejaAccordee(exerciseId, entry) >= current;
}

export function readMissionClaims(raw: { claims?: Record<string, MissionClaimEntry> } | undefined): Record<
  string,
  MissionClaimEntry
> {
  return raw?.claims && typeof raw.claims === "object" ? raw.claims : {};
}

/** Firestore refuse les champs a `undefined` : les retirer avant updateDoc. */
export function missionClaimEntryForFirestore(entry: MissionClaimEntry): MissionClaimEntry {
  const out: MissionClaimEntry = { ...entry };
  (Object.keys(out) as (keyof MissionClaimEntry)[]).forEach((key) => {
    if (out[key] === undefined) delete out[key];
  });
  return out;
}
