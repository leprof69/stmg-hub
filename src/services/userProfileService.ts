import {
  doc,
  getDoc,
  updateDoc,
  increment,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { db } from "./firebase";
import { FS } from "./firestoreConstants";

export type UserProfile = { id: string } & DocumentData;

/** Portefeuille actuel + jetons déjà dépensés en boutique : total « carrière » pour stats / badges (champs `xp`, `xpDepensee`). */
export function getXpTotalePourNiveau(data: { xp?: unknown; xpDepensee?: unknown } | null | undefined): number {
  const wallet = Math.max(0, Number(data?.xp) || 0);
  const spent = Math.max(0, Number(data?.xpDepensee) || 0);
  return wallet + spent;
}

/** Prestige affiché au classement (base + boutique + dons sociaux). */
export function getPrestigeTotal(data: { prestigeBase?: unknown; prestige?: unknown; prestigeGifted?: unknown; prestigeDonBonus?: unknown } | null | undefined): number {
  const base     = Number(data?.prestigeBase);
  const extra    = Number(data?.prestige);
  const gifted   = Number(data?.prestigeGifted);   // reçu d'autres élèves
  const donBonus = Number(data?.prestigeDonBonus);  // bonus x2 pour avoir donné
  return Math.max(0,
    (Number.isFinite(base)     ? base     : 0) +
    (Number.isFinite(extra)    ? extra    : 0) +
    (Number.isFinite(gifted)   ? gifted   : 0) +
    (Number.isFinite(donBonus) ? donBonus : 0)
  );
}

/**
 * Score utilisé pour le **niveau** du dashboard : le prestige réel (dépenses boutique),
 * ou à défaut jetons cumulés / 10 (même échelle qu’environ 1 prestige / 10 jetons dépensés) pour ne pas
 * rester bloqué au niveau 1 tant qu’aucun pack n’est ouvert.
 */
export function getPrestigePourNiveau(data: Parameters<typeof getXpTotalePourNiveau>[0]): number {
  const prestige = getPrestigeTotal(data);
  const depuisXp = Math.floor(getXpTotalePourNiveau(data) / 10);
  return Math.max(prestige, depuisXp);
}

/** Palier de prestige pour +1 niveau (~équivalent 500 jetons cumulés à l’ancienne formule). */
export const PRESTIGE_PAR_NIVEAU = 50;

export function userDocRef(uid: string) {
  return doc(db, FS.users, uid);
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

export async function trackUserConnection(uid: string): Promise<void> {
  const today = new Date();
  const dayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  await updateDoc(userDocRef(uid), {
    lastConnectionAt: serverTimestamp(),
    lastConnectionDay: dayKey,
    connexionCount: increment(1),
    lastActionType: "connexion",
    lastActionPage: "dashboard",
    lastActionAt: serverTimestamp(),
  });
}

export async function startSessionTracking(uid: string): Promise<void> {
  const today = new Date();
  const dayKey = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  await updateDoc(userDocRef(uid), {
    sessionCount: increment(1),
    lastSessionStartAt: serverTimestamp(),
    lastSessionDay: dayKey,
  });
}

export async function flushSessionTime(uid: string, deltaSec: number, dayKey: string): Promise<void> {
  if (deltaSec <= 0) return;
  await updateDoc(userDocRef(uid), {
    sessionTimeTotalSec: increment(deltaSec),
    [`sessionTimeToday.${dayKey}`]: increment(deltaSec),
    lastSessionSeenAt: serverTimestamp(),
  });
}

export async function endSessionTracking(
  uid: string,
  totalDurationSec: number
): Promise<void> {
  await updateDoc(userDocRef(uid), {
    lastSessionDurationSec: Math.max(0, totalDurationSec),
    lastSessionEndAt: serverTimestamp(),
  });
}

export async function trackNavigation(uid: string, page: string): Promise<void> {
  await updateDoc(userDocRef(uid), {
    lastActionType: "navigation",
    lastActionPage: page,
    lastActionAt: serverTimestamp(),
    [`activityCounters.${page}`]: increment(1),
  });
}

