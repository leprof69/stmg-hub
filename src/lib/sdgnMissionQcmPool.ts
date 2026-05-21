import { getSdgnMissionChapterNumbers, isSdgnMissionChapter } from "../data/sdgn/registry";
import {
  SDGN_MISSION_QCM_CURATED,
  type SdgnMissionQcm,
} from "../data/sdgn/sdgnMissionQcmBank";
import { buildSdgnMissionQcmFromContent } from "./buildSdgnMissionQcm";

function mergeMissionQcmBanks(): SdgnMissionQcm[] {
  const allowed = new Set(getSdgnMissionChapterNumbers());
  const byId = new Map<string, SdgnMissionQcm>();

  for (const q of buildSdgnMissionQcmFromContent()) {
    if (!allowed.has(q.chapter) || !isSdgnMissionChapter(q.chapter)) continue;
    byId.set(q.id, q);
  }
  for (const q of SDGN_MISSION_QCM_CURATED) {
    if (!allowed.has(q.chapter) || !isSdgnMissionChapter(q.chapter)) continue;
    if (!byId.has(q.id)) byId.set(q.id, q);
  }

  return [...byId.values()].sort((a, b) =>
    a.chapter !== b.chapter ? a.chapter - b.chapter : a.id.localeCompare(b.id),
  );
}

/** Full bank: generated from Missions + curated extras (all registry chapters). */
export const SDGN_MISSION_QCM_BANK: SdgnMissionQcm[] = mergeMissionQcmBanks();

export function getSdgnMissionChaptersWithQcm(): number[] {
  const chapters = new Set<number>();
  for (const q of SDGN_MISSION_QCM_BANK) {
    if (isSdgnMissionChapter(q.chapter)) chapters.add(q.chapter);
  }
  return [...chapters].sort((a, b) => a - b);
}

export function formatSdgnMissionChaptersLabel(): string {
  const ch = getSdgnMissionChaptersWithQcm();
  if (ch.length === 0) return "chapitres Missions SDGN";
  if (ch.length === 1) return `chapitre Missions ${ch[0]}`;
  return `chapitres Missions ${ch[0]}\u2013${ch[ch.length - 1]}`;
}
