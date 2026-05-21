import { getSdgnMissionChapterNumbers, isSdgnMissionChapter } from "../data/sdgn/registry";
import {
  SDGN_MISSION_QCM_CURATED,
  type SdgnMissionQcm,
} from "../data/sdgn/sdgnMissionQcmBank";
import { isValidGameQcmItem } from "./qcmEncoding";

/** Pool jeux = banque QCM curee par chapitre (registry Missions). */
function buildMissionQcmBank(): SdgnMissionQcm[] {
  const allowed = new Set(getSdgnMissionChapterNumbers());
  const out: SdgnMissionQcm[] = [];

  for (const q of SDGN_MISSION_QCM_CURATED) {
    if (!allowed.has(q.chapter) || !isSdgnMissionChapter(q.chapter)) continue;
    if (!isValidGameQcmItem(q)) continue;
    out.push(q);
  }

  return out.sort((a, b) =>
    a.chapter !== b.chapter ? a.chapter - b.chapter : a.id.localeCompare(b.id),
  );
}

export const SDGN_MISSION_QCM_BANK: SdgnMissionQcm[] = buildMissionQcmBank();

export function getSdgnMissionChaptersWithQcm(): number[] {
  const chapters = new Set<number>();
  for (const q of SDGN_MISSION_QCM_BANK) {
    chapters.add(q.chapter);
  }
  return [...chapters].sort((a, b) => a - b);
}

export function getGameQcmForChapter(chapter: number): SdgnMissionQcm[] {
  if (!isSdgnMissionChapter(chapter)) return [];
  return SDGN_MISSION_QCM_BANK.filter((q) => q.chapter === chapter);
}

export function formatSdgnMissionChaptersLabel(): string {
  const ch = getSdgnMissionChaptersWithQcm();
  if (ch.length === 0) return "chapitres Missions SDGN";
  if (ch.length === 1) return `chapitre Missions ${ch[0]}`;
  return `chapitres Missions ${ch[0]}\u2013${ch[ch.length - 1]}`;
}
