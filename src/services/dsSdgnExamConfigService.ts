import { doc, getDoc, onSnapshot, setDoc, type Unsubscribe } from "firebase/firestore";
import { auth, db } from "./firebase";
import { DS_SDGN_QCM_EXAM_ID, forceFinalizeDsSdgnExamForUser } from "./dsTabExamService";

export const DS_SDGN_EXAM_CONFIG_DOC_ID = "ds_sdgn_premiere_qcm_v1";

export type DsSdgnExamConfig = {
  closed: boolean;
  closedAt?: string;
  closedBy?: string;
};

const configRef = () => doc(db, "examConfig", DS_SDGN_EXAM_CONFIG_DOC_ID);

export async function readDsSdgnExamConfig(): Promise<DsSdgnExamConfig> {
  const snap = await getDoc(configRef());
  if (!snap.exists()) return { closed: false };
  const data = snap.data();
  return {
    closed: Boolean(data.closed),
    closedAt: typeof data.closedAt === "string" ? data.closedAt : undefined,
    closedBy: typeof data.closedBy === "string" ? data.closedBy : undefined,
  };
}

export function subscribeDsSdgnExamConfig(
  onChange: (config: DsSdgnExamConfig) => void,
): Unsubscribe {
  return onSnapshot(
    configRef(),
    (snap) => {
      if (!snap.exists()) {
        onChange({ closed: false });
        return;
      }
      const data = snap.data();
      onChange({
        closed: Boolean(data.closed),
        closedAt: typeof data.closedAt === "string" ? data.closedAt : undefined,
        closedBy: typeof data.closedBy === "string" ? data.closedBy : undefined,
      });
    },
    (err) => {
      console.error("examConfig snapshot", err);
      onChange({ closed: false });
    },
  );
}

async function setDsSdgnExamClosed(closed: boolean): Promise<void> {
  const uid = auth.currentUser?.uid ?? "";
  if (closed) {
    await setDoc(
      configRef(),
      {
        examId: DS_SDGN_QCM_EXAM_ID,
        closed: true,
        closedAt: new Date().toISOString(),
        closedBy: uid,
      },
      { merge: true },
    );
  } else {
    await setDoc(
      configRef(),
      {
        examId: DS_SDGN_QCM_EXAM_ID,
        closed: false,
        reopenedAt: new Date().toISOString(),
        reopenedBy: uid,
      },
      { merge: true },
    );
  }
}

export type CloseDsSdgnPremiereResult = {
  finalized: number;
  skipped: number;
  closedAt: string;
};

/** Coupe les sessions en cours et interdit tout nouveau lancement (sauf admin). */
export async function closeDsSdgnPremiereExamForAll(
  premiereStudentIds: string[],
): Promise<CloseDsSdgnPremiereResult> {
  const closedAt = new Date().toISOString();
  await setDsSdgnExamClosed(true);

  let finalized = 0;
  let skipped = 0;
  const uniqueIds = [...new Set(premiereStudentIds.filter(Boolean))];

  for (const uid of uniqueIds) {
    try {
      const outcome = await forceFinalizeDsSdgnExamForUser(uid);
      if (outcome === "finalized") finalized += 1;
      else skipped += 1;
    } catch (err) {
      console.error("forceFinalize", uid, err);
      skipped += 1;
    }
  }

  return { finalized, skipped, closedAt };
}

export async function reopenDsSdgnPremiereExam(): Promise<void> {
  await setDsSdgnExamClosed(false);
}
