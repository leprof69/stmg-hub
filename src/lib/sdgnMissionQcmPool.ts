import {
  getSdgnMissionChapterNumbers,
  isSdgnMissionChapter,
  isSdgnPremiereChapter,
} from "../data/sdgn/registry";
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

/** Banque jeux : SDGN Première uniquement (chapitres 1 à 13). */
export const SDGN_MISSION_QCM_BANK_PREMIERE: SdgnMissionQcm[] = SDGN_MISSION_QCM_BANK.filter((q) =>
  isSdgnPremiereChapter(q.chapter),
);

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

export function getSdgnPremiereChaptersWithQcm(): number[] {
  const chapters = new Set<number>();
  for (const q of SDGN_MISSION_QCM_BANK_PREMIERE) {
    chapters.add(q.chapter);
  }
  return [...chapters].sort((a, b) => a - b);
}

export function formatSdgnMissionChaptersLabel(): string {
  return "chapitres SDGN Première (1 à 13)";
}
