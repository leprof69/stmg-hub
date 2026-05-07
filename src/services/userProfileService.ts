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
