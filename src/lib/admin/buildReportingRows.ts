import { buildDsSdgnStudentRow, isPremiereClasse } from "../adminDsSdgnReport";
import { buildStudentMissionInsights } from "../adminMissionInsights";
import { readMissionClaims } from "../missionsProgress";
import { CARD_BONUS_BY_ID } from "./adminConstants";
import {
  compterCartesTotal,
  compterCartesUniques,
  joursEcoules,
  parseDayKey,
  toDate,
  toDayKey,
} from "./adminUtils";

/** Construit les lignes du tableau reporting \u00e0 partir des profils Firestore. */
export function buildReportingRows(eleves: Record<string, unknown>[], todayKey = toDayKey()) {
  return eleves.map((eleve) => {
    const missionsHistorique = (eleve.missionsHistorique as Record<string, unknown>) || {};
    const missionEntries = Object.values(missionsHistorique) as { date?: string; antiCheatFlags?: { tricheDetectee?: boolean } }[];
    const missionsToday = missionEntries.filter((m) => m?.date === todayKey).length;

    const mp = (eleve.missionsProgress as Record<string, unknown>) || {};
    const mpClaims = readMissionClaims(mp);
    const sdgnClaimEntries = Object.entries(mpClaims).filter(([id]) => String(id).startsWith("sdgn"));
    const sdgnClaimsToday = sdgnClaimEntries.filter(([, c]) => c?.lastClaimDate === todayKey).length;
    const sdgnExerciseCount = sdgnClaimEntries.length;
    const sdgnTotalAttempts = sdgnClaimEntries.reduce((sum, [, c]) => sum + (Number(c?.totalClaims) || 0), 0);
    const sdgnLastXpSum = sdgnClaimEntries.reduce((sum, [, c]) => sum + (Number(c?.lastXpAwarded) || 0), 0);
    const missionInsights = buildStudentMissionInsights(mpClaims);
    const sdgnRows = missionInsights.rows
      .filter((r) => r.matiere === "SDGN")
      .map((r) => ({
        exerciseId: r.exerciseId,
        title: r.title,
        chapter: r.chapter,
        lastClaimDate: r.lastClaimDate,
        totalClaims: r.totalClaims,
        lastScore: r.lastScore,
        lastPercent: r.lastPercent,
        lastXpAwarded: r.lastXpAwarded,
        pointsForts: r.pointsForts,
        pointsFaibles: r.pointsFaibles,
      }));
    const antiCheatEvents = missionEntries.filter((m) => m?.antiCheatFlags?.tricheDetectee);
    const antiCheatToday = missionEntries.filter(
      (m) => m?.date === todayKey && m?.antiCheatFlags?.tricheDetectee,
    ).length;
    const lastMissionDate =
      missionEntries
        .map((m) => parseDayKey(m?.date))
        .filter(Boolean)
        .sort((a, b) => (b as Date).getTime() - (a as Date).getTime())[0] || null;

    const claims = (eleve.objectifBacProgress as { claims?: Record<string, { lastClaimDate?: string; totalClaims?: number }> })?.claims || {};
    const claimEntries = Object.values(claims);
    const objectifToday = claimEntries.filter((c) => c?.lastClaimDate === todayKey).length;
    const objectifTotal = claimEntries.reduce((sum, c) => sum + (c?.totalClaims || 0), 0);
    const lastObjectifDate =
      claimEntries
        .map((c) => parseDayKey(c?.lastClaimDate))
        .filter(Boolean)
        .sort((a, b) => (b as Date).getTime() - (a as Date).getTime())[0] || null;
    const focusClaims = (eleve.focusProgress as { claims?: Record<string, { lastClaimDate?: string; totalClaims?: number }> })?.claims || {};
    const focusEntries = Object.values(focusClaims);
    const focusToday = focusEntries.filter((f) => f?.lastClaimDate === todayKey).length;
    const focusTotal = focusEntries.reduce((sum, f) => sum + (f?.totalClaims || 0), 0);
    const lastFocusDate =
      focusEntries
        .map((f) => parseDayKey(f?.lastClaimDate))
        .filter(Boolean)
        .sort((a, b) => (b as Date).getTime() - (a as Date).getTime())[0] || null;

    const lastConnectionAt = toDate(eleve.lastConnectionAt);
    const lastConnectionDay = parseDayKey(eleve.lastConnectionDay);
    const lastCartesDay = parseDayKey(eleve.lastVisit);
    const createdAt = toDate(eleve.createdAt);

    const lastSdgnDates = sdgnRows.map((r) => parseDayKey(r.lastClaimDate)).filter(Boolean) as Date[];
    const allDates = [
      lastConnectionAt,
      lastConnectionDay,
      lastCartesDay,
      lastMissionDate,
      lastObjectifDate,
      lastFocusDate,
      createdAt,
      ...lastSdgnDates,
    ].filter(Boolean) as Date[];
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
    if (sdgnClaimsToday > 0) actionsToday.push(`${sdgnClaimsToday} exo. SDGN`);
    if (missionsToday > 0) actionsToday.push(`${missionsToday} mission(s) historique`);
    if (objectifToday > 0) actionsToday.push(`${objectifToday} entra\u00eenement(s) bac`);
    if (aFaitCartesToday) actionsToday.push("Cartes");
    if (!actionsToday.length) actionsToday.push("Aucune action d\u00e9tect\u00e9e");

    const nom =
      (eleve.prenom as string) ||
      (eleve.nom as string) ||
      (eleve.email as string) ||
      `\u00c9l\u00e8ve ${String(eleve.id).slice(0, 6)}`;
    const dsSdgnRow = isPremiereClasse(eleve.classe)
      ? buildDsSdgnStudentRow({ ...eleve, id: String(eleve.id), nomAffiche: nom })
      : null;

    return {
      ...eleve,
      id: String(eleve.id),
      nomAffiche: nom,
      cartesTotal,
      cartesUniques,
      participationPoints,
      missionsToday,
      missionsTotal: missionEntries.length,
      missionsProgressChapter: (mp.chapter as string) || "",
      sdgnClaimsToday,
      sdgnExerciseCount,
      sdgnTotalAttempts,
      sdgnLastXpSum,
      sdgnRows,
      missionInsights,
      antiCheatEvents: antiCheatEvents.length,
      antiCheatToday,
      objectifToday,
      objectifTotal,
      focusToday,
      focusTotal,
      lastActivity,
      joursSansActivite,
      actionsToday,
      estActifAujourdhui: actionsToday[0] !== "Aucune action d\u00e9tect\u00e9e",
      sessionTotalSec: Number(eleve.sessionTimeTotalSec) || 0,
      sessionTodaySec: Number((eleve.sessionTimeToday as Record<string, number>)?.[todayKey]) || 0,
      sessionCount: Number(eleve.sessionCount) || 0,
      lastSessionDurationSec: Number(eleve.lastSessionDurationSec) || 0,
      dsSdgnRow,
    };
  });
}
