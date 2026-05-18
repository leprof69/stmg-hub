import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
  orderBy,
  limit,
  type Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { FS } from "./firestoreConstants";
import { getDuelSeasonId } from "./duelSeason";
import {
  DUEL_QCM_BANK,
  DUEL_QUESTIONS_PAR_PARTIE,
  DUEL_TEMPS_TOTAL_SEC,
  type DuelQcmSource,
} from "../data/duelQcmBank";

export type DuelQuestionFrozen = {
  sourceId: string;
  question: string;
  choix: [string, string, string, string];
  bonIndex: 0 | 1 | 2 | 3;
};

export type DuelRunDoc = {
  authorUid: string;
  authorPrenom: string;
  seasonId: string;
  durationLimitSec: number;
  questions: DuelQuestionFrozen[];
  ghostCorrect: number;
  ghostTimeMs: number;
  createdAt?: Timestamp;
};

export type DuelAttemptDoc = {
  runId: string;
  playerUid: string;
  playerPrenom: string;
  seasonId: string;
  score: number;
  timeMs: number;
  createdAt?: Timestamp;
};

function shuffleIndices4(seedBase: number): [0, 1, 2, 3] {
  const order: [0, 1, 2, 3] = [0, 1, 2, 3];
  let s = Math.max(1, seedBase % 100000) + 17;
  for (let i = 3; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    const tmp = order[i];
    order[i] = order[j];
    order[j] = tmp;
  }
  return order;
}

function freezeQuestion(src: DuelQcmSource, shuffleKey: number): DuelQuestionFrozen {
  const perm = shuffleIndices4(shuffleKey + src.id.charCodeAt(0) * 997);
  const choix: [string, string, string, string] = [
    src.choix[perm[0]],
    src.choix[perm[1]],
    src.choix[perm[2]],
    src.choix[perm[3]],
  ];
  const pos = perm.indexOf(src.bonIndex) as 0 | 1 | 2 | 3;
  return {
    sourceId: src.id,
    question: src.question,
    choix,
    bonIndex: pos,
  };
}

/** Tirage + ordre des reponses fige (meme partie pour tous les joueurs d'un run). */
export function buildDuelPartieQuestions(seed = Date.now()): DuelQuestionFrozen[] {
  const pool = [...DUEL_QCM_BANK];
  const out: DuelQuestionFrozen[] = [];
  let s = seed % 1000000007;
  for (let n = 0; n < DUEL_QUESTIONS_PAR_PARTIE && pool.length > 0; n++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const idx = s % pool.length;
    const [picked] = pool.splice(idx, 1);
    out.push(freezeQuestion(picked, s + n * 7919));
  }
  return out;
}

export function duelAttemptDocId(runId: string, playerUid: string): string {
  return `${runId}_${playerUid}`;
}

export async function createDuelRun(params: {
  authorUid: string;
  authorPrenom: string;
  questions: DuelQuestionFrozen[];
  ghostCorrect: number;
  ghostTimeMs: number;
}): Promise<string> {
  const seasonId = getDuelSeasonId();
  const ref = await addDoc(collection(db, FS.duelRuns), {
    authorUid: params.authorUid,
    authorPrenom: params.authorPrenom.trim().slice(0, 48),
    seasonId,
    durationLimitSec: DUEL_TEMPS_TOTAL_SEC,
    questions: params.questions,
    ghostCorrect: params.ghostCorrect,
    ghostTimeMs: Math.max(1, Math.floor(params.ghostTimeMs)),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function fetchDuelRun(runId: string): Promise<DuelRunDoc | null> {
  const snap = await getDoc(doc(db, FS.duelRuns, runId));
  if (!snap.exists()) return null;
  return snap.data() as DuelRunDoc;
}

export async function listGhostRunsForSeason(
  seasonId: string,
  excludeAuthorUid: string,
  max = 40
): Promise<{ id: string; data: DuelRunDoc }[]> {
  const qy = query(
    collection(db, FS.duelRuns),
    where("seasonId", "==", seasonId),
    orderBy("createdAt", "desc"),
    limit(max)
  );
  const snap = await getDocs(qy);
  const rows: { id: string; data: DuelRunDoc }[] = [];
  snap.forEach((d) => {
    const data = d.data() as DuelRunDoc;
    if (data.authorUid !== excludeAuthorUid) rows.push({ id: d.id, data });
  });
  return rows;
}

export async function getAttemptIdsForPlayerOnRuns(
  playerUid: string,
  runIds: string[]
): Promise<Set<string>> {
  const done = new Set<string>();
  if (runIds.length === 0) return done;
  const chunks: string[][] = [];
  for (let i = 0; i < runIds.length; i += 10) chunks.push(runIds.slice(i, i + 10));
  for (const chunk of chunks) {
    const qy = query(collection(db, FS.duelAttempts), where("playerUid", "==", playerUid), where("runId", "in", chunk));
    const snap = await getDocs(qy);
    snap.forEach((d) => {
      const r = d.data() as DuelAttemptDoc;
      if (r.runId) done.add(r.runId);
    });
  }
  return done;
}

export async function hasPlayerAttemptedRun(runId: string, playerUid: string): Promise<boolean> {
  const snap = await getDoc(doc(db, FS.duelAttempts, duelAttemptDocId(runId, playerUid)));
  return snap.exists();
}

export async function saveDuelAttempt(docData: DuelAttemptDoc): Promise<void> {
  const id = duelAttemptDocId(docData.runId, docData.playerUid);
  await setDoc(doc(db, FS.duelAttempts, id), {
    ...docData,
    playerPrenom: docData.playerPrenom.trim().slice(0, 48),
    createdAt: serverTimestamp(),
  });
}

/** Departage : meilleur score, puis temps plus court. */
export function compareDuelChallengerVsGhost(
  score: number,
  timeMs: number,
  ghostCorrect: number,
  ghostTimeMs: number
): "win" | "lose" | "draw" {
  if (score > ghostCorrect) return "win";
  if (score < ghostCorrect) return "lose";
  if (timeMs < ghostTimeMs) return "win";
  if (timeMs > ghostTimeMs) return "lose";
  return "draw";
}

export { DUEL_TEMPS_TOTAL_SEC, DUEL_QUESTIONS_PAR_PARTIE };
