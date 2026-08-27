import { CARD_BONUS_BY_ID } from "./adminConstants";
import {
  compterCartesTotal,
  compterCartesUniques,
  joursEcoules,
  parseDayKey,
  toDate,
  toDayKey,
} from "./adminUtils";

/** Construit les lignes du tableau reporting à partir des profils Firestore. */
export function buildReportingRows(eleves: Record<string, unknown>[], todayKey = toDayKey()) {
  return eleves.map((eleve) => {
    const lastConnectionAt = toDate(eleve.lastConnectionAt);
    const lastConnectionDay = parseDayKey(eleve.lastConnectionDay);
    const lastCartesDay = parseDayKey(eleve.lastVisit);
    const createdAt = toDate(eleve.createdAt);

    const allDates = [lastConnectionAt, lastConnectionDay, lastCartesDay, createdAt].filter(Boolean) as Date[];
    const lastActivity = allDates.sort((a, b) => b.getTime() - a.getTime())[0] || null;
    const joursSansActivite = joursEcoules(lastActivity);

    const cartes = (eleve.cartes as Record<string, number>) || {};
    const cartesTotal = compterCartesTotal(cartes);
    const cartesUniques = compterCartesUniques(cartes);
    const participationPoints = Object.entries(cartes).reduce((sum, [cardId, qty]) => {
      if ((Number(qty) || 0) <= 0) return sum;
      return sum + (CARD_BONUS_BY_ID[cardId] || 0);
    }, 0);
    const aFaitCartesToday = eleve.lastVisit === todayKey;

    const actionsToday: string[] = [];
    if (lastConnectionDay && toDayKey(lastConnectionDay) === todayKey) actionsToday.push("Connexion");
    if (aFaitCartesToday) actionsToday.push("Cartes");
    if (!actionsToday.length) actionsToday.push("Aucune action détectée");

    const nom =
      (eleve.prenom as string) ||
      (eleve.nom as string) ||
      (eleve.email as string) ||
      `Élève ${String(eleve.id).slice(0, 6)}`;

    return {
      ...eleve,
      id: String(eleve.id),
      nomAffiche: nom,
      cartesTotal,
      cartesUniques,
      participationPoints,
      lastActivity,
      joursSansActivite,
      actionsToday,
      estActifAujourdhui: actionsToday[0] !== "Aucune action détectée",
      sessionTotalSec: Number(eleve.sessionTimeTotalSec) || 0,
      sessionTodaySec: Number((eleve.sessionTimeToday as Record<string, number>)?.[todayKey]) || 0,
      sessionCount: Number(eleve.sessionCount) || 0,
      lastSessionDurationSec: Number(eleve.lastSessionDurationSec) || 0,
    };
  });
}
