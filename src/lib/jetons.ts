/**
 * Libell’s UI pour la monnaie à jetons à (Firestore conserve les champs `xp`, `xpDepensee`, etc.).
 */

const LOCALE = "fr-FR";

export function motJetons(quantite: number): "jeton" | "jetons" {
  const n = Math.trunc(Math.abs(Number(quantite) || 0));
  return n === 1 ? "jeton" : "jetons";
}

/** Ex. 120 jetons */
export function formatJetons(quantite: number): string {
  const n = Math.trunc(Number(quantite) || 0);
  const abs = Math.abs(n);
  return `${abs.toLocaleString(LOCALE)} ${motJetons(abs)}`;
}

/** Ex. +12 jetons ou ?3 jetons */
export function formatJetonsDelta(quantite: number): string {
  const n = Math.trunc(Number(quantite) || 0);
  if (n === 0) return `0 ${motJetons(0)}`;
  const sign = n > 0 ? "+" : "?";
  const abs = Math.abs(n);
  return `${sign}${abs.toLocaleString(LOCALE)} ${motJetons(abs)}`;
}
