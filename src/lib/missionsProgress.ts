/** Schema Firestore `missionsProgress.version` (ne pas utiliser pour effacer la progression). */
export const MISSIONS_PROGRESS_VERSION = 1 as const;

/**
 * Vague de recompense jetons. Incrementer pour redonner une chance de jetons
 * sur les exos deja valides, sans reset du deblocage (totalClaims conserve).
 */
export const MISSIONS_XP_REWARD_WAVE = 2 as const;

export type MissionClaimEntry = {
  lastClaimDate?: string;
  totalClaims?: number;
  lastXpWave?: number;
  lastScore?: number;
  lastPercent?: number;
  lastXpAwarded?: number;
};

/** Jetons deja gagnes pour cette vague sur un exo deja valide au moins une fois. */
export function missionJetonsDejaGagnesPourVague(entry?: MissionClaimEntry): boolean {
  if ((entry?.totalClaims ?? 0) < 1) return false;
  return (entry?.lastXpWave ?? 1) >= MISSIONS_XP_REWARD_WAVE;
}

export function readMissionClaims(raw: { claims?: Record<string, MissionClaimEntry> } | undefined): Record<
  string,
  MissionClaimEntry
> {
  return raw?.claims && typeof raw.claims === "object" ? raw.claims : {};
}
