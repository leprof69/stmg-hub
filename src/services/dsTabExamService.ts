import { updateDoc } from "firebase/firestore";
import { userDocRef } from "./userProfileService";

export const DS_SDGN_QCM_EXAM_ID = "sdgn_premiere_qcm_v1";

export type DsTabResultPayload = {
  score: number;
  total: number;
  skipped: number;
  forcedZero: boolean;
  finishedAt: string;
};

export async function persistDsForcedZero(uid: string): Promise<void> {
  const now = new Date().toISOString();
  await updateDoc(userDocRef(uid), {
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.examId`]: DS_SDGN_QCM_EXAM_ID,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.forcedZero`]: true,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.forcedZeroAt`]: now,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.score`]: 0,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.finishedAt`]: now,
  });
}

export async function persistDsTabResult(uid: string, payload: DsTabResultPayload): Promise<void> {
  await updateDoc(userDocRef(uid), {
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.examId`]: DS_SDGN_QCM_EXAM_ID,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.score`]: payload.score,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.total`]: payload.total,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.skipped`]: payload.skipped,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.forcedZero`]: payload.forcedZero,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.finishedAt`]: payload.finishedAt,
  });
}

export async function markDsAttemptStarted(uid: string): Promise<void> {
  await updateDoc(userDocRef(uid), {
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.examId`]: DS_SDGN_QCM_EXAM_ID,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.attemptStarted`]: true,
    [`dsTab.${DS_SDGN_QCM_EXAM_ID}.startedAt`]: new Date().toISOString(),
  });
}
