import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { computeDsGradeOn20 } from "../lib/dsSdgnGrading";
import { db } from "./firebase";
import { DS_SDGN_QCM_EXAM_ID } from "./dsTabExamService";

/** Collection minimale : une note par eleve, lisible directement par l'admin. */
export const DS_SDGN_NOTES_COLLECTION = "dsSdgnNotes";

export type DsSdgnNote = {
  uid: string;
  prenom?: string;
  nom?: string;
  email?: string;
  classe?: string;
  gradeOn20: number;
  scorePoints: number;
  totalQuestions: number;
  questionsAnswered?: number;
  status?: string;
  updatedAt: string;
};

function noteRef(uid: string) {
  return doc(db, DS_SDGN_NOTES_COLLECTION, uid);
}

function stripUndefined(value: Record<string, unknown>): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(value)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

export async function writeDsSdgnNote(note: DsSdgnNote): Promise<void> {
  const grade = Number(note.gradeOn20);
  if (!Number.isFinite(grade) || grade < 0) return;
  await setDoc(
    noteRef(note.uid),
    stripUndefined({
      ...note,
      gradeOn20: Math.round(grade * 10) / 10,
      updatedAt: note.updatedAt || new Date().toISOString(),
    }),
    { merge: true },
  );
}

export async function fetchAllDsSdgnNotes(): Promise<DsSdgnNote[]> {
  const snap = await getDocs(collection(db, DS_SDGN_NOTES_COLLECTION));
  return snap.docs
    .map((d) => ({ uid: d.id, ...(d.data() as Omit<DsSdgnNote, "uid">) }))
    .sort((a, b) =>
      String(a.prenom || a.nom || "").localeCompare(String(b.prenom || b.nom || ""), "fr"),
    );
}

/** Lecture directe users.dsTab.sdgn_premiere_qcm_v1 (sans heuristiques). */
export function readDsTabSimple(
  user: Record<string, unknown>,
): Record<string, unknown> | null {
  const dsTab = user.dsTab;
  if (!dsTab || typeof dsTab !== "object" || Array.isArray(dsTab)) return null;
  const box = dsTab as Record<string, unknown>;
  const exam = box[DS_SDGN_QCM_EXAM_ID];
  if (exam && typeof exam === "object") return exam as Record<string, unknown>;
  if (box.score != null || box.gradeOn20 != null || box.lastSession) return box;
  return null;
}

function num(v: unknown): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v.trim().replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
}

export function buildNoteFromUser(user: Record<string, unknown>): DsSdgnNote | null {
  const uid = String(user.id ?? "");
  if (!uid || user.role === "admin") return null;

  const premiereLast = user.dsSdgnPremiereLast;
  if (premiereLast && typeof premiereLast === "object") {
    const pl = premiereLast as Record<string, unknown>;
    const g = num(pl.gradeOn20);
    if (g > 0) {
      return {
        uid,
        prenom: typeof user.prenom === "string" ? user.prenom : undefined,
        nom: typeof user.nom === "string" ? user.nom : undefined,
        email: typeof user.email === "string" ? user.email : undefined,
        classe: typeof user.classe === "string" ? user.classe : undefined,
        gradeOn20: g,
        scorePoints: num(pl.scorePoints),
        totalQuestions: num(pl.totalQuestions),
        questionsAnswered: num(pl.questionsAnswered),
        status: typeof pl.status === "string" ? pl.status : undefined,
        updatedAt:
          typeof pl.updatedAt === "string" ? pl.updatedAt : new Date().toISOString(),
      };
    }
  }

  const tab = readDsTabSimple(user);
  if (!tab) return null;

  const score = num(tab.score);
  const total = num(tab.total) || num((tab.lastSession as Record<string, unknown>)?.totalQuestions);
  const storedGrade = num(tab.gradeOn20);
  const last = tab.lastSession;
  const prov =
    last && typeof last === "object" ? num((last as Record<string, unknown>).gradeOn20Provisional) : 0;
  const sessionGrade =
    last && typeof last === "object" ? num((last as Record<string, unknown>).gradeOn20) : 0;
  const computed = total > 0 ? computeDsGradeOn20(score, total, false) : 0;
  const grade = Math.max(storedGrade, prov, sessionGrade, computed);

  if (grade <= 0 && score <= 0 && !tab.attemptStarted) return null;

  let answered = 0;
  if (last && typeof last === "object") {
    const ls = last as Record<string, unknown>;
    answered = num(ls.questionsAnswered);
    if (!answered && Array.isArray(ls.answers)) {
      answered = ls.answers.length;
    }
  }

  return {
    uid,
    prenom: typeof user.prenom === "string" ? user.prenom : undefined,
    nom: typeof user.nom === "string" ? user.nom : undefined,
    email: typeof user.email === "string" ? user.email : undefined,
    classe: typeof user.classe === "string" ? user.classe : undefined,
    gradeOn20: grade,
    scorePoints: score,
    totalQuestions: total,
    questionsAnswered: answered,
    status:
      last && typeof last === "object"
        ? String((last as Record<string, unknown>).status ?? "")
        : undefined,
    updatedAt: new Date().toISOString(),
  };
}

export type RebuildDsSdgnNotesReport = {
  written: number;
  withGrade: number;
  scanned: number;
  errors: string[];
};

export async function rebuildAllDsSdgnNotesFromUsers(
  users: Record<string, unknown>[],
): Promise<RebuildDsSdgnNotesReport> {
  let written = 0;
  let withGrade = 0;
  let scanned = 0;
  const errors: string[] = [];

  for (const user of users) {
    if (user.role === "admin") continue;
    scanned += 1;
    const note = buildNoteFromUser(user);
    if (!note) continue;
    try {
      await writeDsSdgnNote(note);
      written += 1;
      if (note.gradeOn20 > 0) withGrade += 1;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      errors.push(`${note.prenom || note.uid.slice(0, 6)}: ${msg}`);
      if (errors.length >= 5) break;
    }
  }

  return { written, withGrade, scanned, errors };
}

export async function adminSaveDsSdgnNote(
  uid: string,
  gradeOn20: number,
  profile?: { prenom?: string; nom?: string; email?: string; classe?: string },
): Promise<void> {
  const existing = await getDoc(noteRef(uid));
  const prev = existing.exists() ? (existing.data() as DsSdgnNote) : null;
  await writeDsSdgnNote({
    uid,
    prenom: profile?.prenom ?? prev?.prenom,
    nom: profile?.nom ?? prev?.nom,
    email: profile?.email ?? prev?.email,
    classe: profile?.classe ?? prev?.classe,
    gradeOn20,
    scorePoints: prev?.scorePoints ?? 0,
    totalQuestions: prev?.totalQuestions ?? 0,
    questionsAnswered: prev?.questionsAnswered,
    status: prev?.status ?? "completed",
    updatedAt: new Date().toISOString(),
  });
}
