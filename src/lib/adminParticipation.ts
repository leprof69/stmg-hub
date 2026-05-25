/** Participation (cartes collection) - aligne Admin / Cartes. */
export const PARTICIPATION_BARME = [
  { rarete: "Rare", pts: 0.5 },
  { rarete: "Epique", pts: 1 },
  { rarete: "Legendaire", pts: 2 },
  { rarete: "Ultra rare", pts: 3 },
] as const;

export function participationNiveau(points: number) {
  if (points >= 5) return { label: "Excellent", color: "#059669", bg: "#DCFCE7" };
  if (points >= 3) return { label: "Bon", color: "#0284C7", bg: "#E0F2FE" };
  if (points >= 1) return { label: "Correct", color: "#B45309", bg: "#FEF3C7" };
  if (points > 0) return { label: "Debutant", color: "#64748B", bg: "#F1F5F9" };
  return { label: "Aucune carte rare+", color: "#DC2626", bg: "#FEE2E2" };
}

/** Note /20 relative au meilleur score du groupe filtre. */
export function participationNoteSur20(points: number, maxInGroup: number): number {
  if (points <= 0) return 0;
  if (maxInGroup <= 0) return 0;
  return Math.round(Math.min(20, (points / maxInGroup) * 20) * 10) / 10;
}
