/** Saison Duel : fenetres de 21 jours (3 semaines), identifiant stable pour Firestore. */

const MS_DAY = 24 * 60 * 60 * 1000;
const SEASON_DAYS = 21;

/** Ancre UTC (modifiable avant prod) : debut de la saison 0. */
const DUEL_SEASON_EPOCH_MS = Date.UTC(2026, 4, 12, 0, 0, 0);

export function getDuelSeasonIndex(nowMs = Date.now()): number {
  return Math.max(0, Math.floor((nowMs - DUEL_SEASON_EPOCH_MS) / (SEASON_DAYS * MS_DAY)));
}

export function getDuelSeasonId(nowMs = Date.now()): string {
  return `duel-s${getDuelSeasonIndex(nowMs)}`;
}

export function getDuelSeasonEndsAt(nowMs = Date.now()): Date {
  const idx = getDuelSeasonIndex(nowMs);
  const end = DUEL_SEASON_EPOCH_MS + (idx + 1) * SEASON_DAYS * MS_DAY;
  return new Date(end);
}

export function getDuelSeasonDaysLeft(nowMs = Date.now()): number {
  const end = getDuelSeasonEndsAt(nowMs).getTime();
  return Math.max(0, Math.ceil((end - nowMs) / MS_DAY));
}
