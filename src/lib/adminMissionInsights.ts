import { getManagementMissionMeta } from "../data/managementMissionCatalog";
import { compareSdgnExerciseIds, getSdgnMissionMeta } from "../data/sdgnMissionCatalog";
import type { MissionClaimEntry } from "./missionsProgress";

export type MissionFeedbackRow = {
  exerciseId: string;
  title: string;
  chapter: string;
  matiere: "SDGN" | "Management";
  lastClaimDate?: string;
  totalClaims: number;
  lastScore?: number;
  lastPercent?: number;
  lastXpAwarded: number;
  pointsForts: string;
  pointsFaibles: string;
};

export type StudentMissionInsights = {
  exerciseCount: number;
  rows: MissionFeedbackRow[];
  pointsForts: string[];
  pointsFaibles: string[];
  hasFeedback: boolean;
};

const GENERIC_FEEDBACK = [
  /^aucun\s+\u00e9l\u00e9ment\s+exploitable/i,
  /^r\u00e9ponse\s+absente/i,
  /^quelques\s+pistes\s+sont\s+amorc/i,
  /^tu\s+as\s+bien\s+commenc\u00e9/i,
  /^peu\s+d['\u2019]\u00e9l\u00e9ments\s+manquants\s*:\s*v\u00e9rifie\s+la\s+formulation/i,
];

function isGenericFeedbackLine(line: string): boolean {
  const t = line.trim();
  if (t.length < 10) return true;
  return GENERIC_FEEDBACK.some((re) => re.test(t));
}

/** Decoupe un retour correction en lignes exploitables pour l'admin. */
export function splitMissionFeedbackText(text: string | undefined): string[] {
  if (!text?.trim()) return [];
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\u2022/g, "\n")
    .replace(/\s*;\s*/g, "\n");
  const parts = normalized
    .split(/\n+/)
    .map((s) => s.replace(/^[\s\-*Q\d]+[:.)]\s*/i, "").trim())
    .filter((s) => s.length >= 12 && !isGenericFeedbackLine(s));
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const key = p.toLowerCase().slice(0, 80);
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(p);
  }
  return out;
}

function missionMeta(exerciseId: string): { title: string; chapter: string; matiere: "SDGN" | "Management" } {
  if (exerciseId.startsWith("mgt")) {
    const m = getManagementMissionMeta(exerciseId);
    return { title: m.title, chapter: m.chapter, matiere: "Management" };
  }
  const s = getSdgnMissionMeta(exerciseId);
  return { title: s.title, chapter: s.chapter, matiere: "SDGN" };
}

function compareMissionExerciseIds(a: string, b: string): number {
  if (a.startsWith("sdgn") && b.startsWith("sdgn")) return compareSdgnExerciseIds(a, b);
  if (a.startsWith("mgt") && b.startsWith("mgt")) return a.localeCompare(b, "fr");
  if (a.startsWith("sdgn")) return -1;
  if (b.startsWith("sdgn")) return 1;
  return a.localeCompare(b, "fr");
}

export function isMissionExerciseId(exerciseId: string): boolean {
  const id = String(exerciseId);
  return id.startsWith("sdgn") || id.startsWith("mgt");
}

/** Agregge points forts / lacunes a partir des claims Firestore missionsProgress. */
export function buildStudentMissionInsights(claims: Record<string, MissionClaimEntry>): StudentMissionInsights {
  const rows: MissionFeedbackRow[] = Object.entries(claims)
    .filter(([id]) => isMissionExerciseId(id))
    .map(([exerciseId, c]) => {
      const meta = missionMeta(exerciseId);
      return {
        exerciseId,
        title: meta.title,
        chapter: meta.chapter,
        matiere: meta.matiere,
        lastClaimDate: c?.lastClaimDate,
        totalClaims: Number(c?.totalClaims) || 0,
        lastScore: c?.lastScore,
        lastPercent: c?.lastPercent,
        lastXpAwarded: Number(c?.lastXpAwarded) || 0,
        pointsForts: String(c?.lastPointsForts || "").trim(),
        pointsFaibles: String(c?.lastPointsFaibles || "").trim(),
      };
    })
    .sort((a, b) => compareMissionExerciseIds(a.exerciseId, b.exerciseId));

  const fortsAgg: string[] = [];
  const faiblesAgg: string[] = [];
  for (const row of rows) {
    fortsAgg.push(...splitMissionFeedbackText(row.pointsForts));
    faiblesAgg.push(...splitMissionFeedbackText(row.pointsFaibles));
  }

  const dedupe = (items: string[], max: number) => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of items) {
      const key = item.toLowerCase().slice(0, 72);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
      if (out.length >= max) break;
    }
    return out;
  };

  const pointsForts = dedupe(fortsAgg, 10);
  const pointsFaibles = dedupe(faiblesAgg, 10);
  const hasFeedback = rows.some((r) => r.pointsForts || r.pointsFaibles);

  return {
    exerciseCount: rows.length,
    rows,
    pointsForts,
    pointsFaibles,
    hasFeedback,
  };
}
