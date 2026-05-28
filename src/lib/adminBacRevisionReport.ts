import { getManagementMissionMeta } from "../data/managementMissionCatalog";
import { getSdgnMissionMeta } from "../data/sdgnMissionCatalog";
import {
  isMissionNotionGradeOk,
  isMissionNotionGradePasOk,
  isMissionNotionGradeUrgentBac,
  scoreToMissionLetterGrade,
  worstMissionLetterGrade,
  type MissionLetterGrade,
} from "./missionGrades";
import { getMissionNotionsForExercise } from "./missionNotionsIndex";
import type { MissionClaimEntry } from "./missionsProgress";
import { readMissionClaims } from "./missionsProgress";

export type BacReportMatiere = "SDGN" | "Management";

export type BacReportExerciseRow = {
  exerciseId: string;
  title: string;
  chapter: string;
  matiere: BacReportMatiere;
  claimDate: string;
  grade: MissionLetterGrade;
  score: number;
  notions: string[];
};

export type BacNotionEntry = {
  notion: string;
  grade: MissionLetterGrade;
  matieres: BacReportMatiere[];
  exercises: { exerciseId: string; title: string; grade: MissionLetterGrade }[];
};

export type StudentBacRevisionReport = {
  studentId: string;
  studentName: string;
  classe: string;
  lycee?: string;
  reportSince: string;
  generatedAt: string;
  exerciseRows: BacReportExerciseRow[];
  notionsOk: BacNotionEntry[];
  notionsPasOk: BacNotionEntry[];
  notionsUrgent: BacNotionEntry[];
  hasData: boolean;
};

export function normalizeDayKey(key?: string | null): string | null {
  if (!key) return null;
  const m = String(key).trim().match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!m) return null;
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

export function isDayKeyOnOrAfter(day: string | null, since: string): boolean {
  const d = normalizeDayKey(day);
  const s = normalizeDayKey(since);
  if (!d || !s) return false;
  return d >= s;
}

export function isBacReportExerciseId(exerciseId: string): boolean {
  const id = String(exerciseId);
  return id.startsWith("sdgn") || id.startsWith("mgt");
}

function matiereForExercise(exerciseId: string): BacReportMatiere | null {
  if (exerciseId.startsWith("sdgn")) return "SDGN";
  if (exerciseId.startsWith("mgt")) return "Management";
  return null;
}

function metaForExercise(exerciseId: string): { title: string; chapter: string } {
  if (exerciseId.startsWith("mgt")) {
    const m = getManagementMissionMeta(exerciseId);
    return { title: m.title, chapter: m.chapter };
  }
  const s = getSdgnMissionMeta(exerciseId);
  return { title: s.title, chapter: s.chapter };
}

/** Score et date de la premiere tentative uniquement. */
export function getFirstAttemptMissionClaim(
  entry?: MissionClaimEntry
): { score: number; claimDate: string; percent?: number } | null {
  if (!entry) return null;
  const claimDate = normalizeDayKey(entry.firstClaimDate ?? entry.lastClaimDate);
  if (entry.firstScore != null && claimDate) {
    return {
      score: entry.firstScore,
      claimDate,
      percent: entry.firstPercent,
    };
  }
  if (Number(entry.totalClaims) === 1 && entry.lastScore != null && claimDate) {
    return {
      score: entry.lastScore,
      claimDate,
      percent: entry.lastPercent,
    };
  }
  return null;
}

function aggregateNotions(rows: BacReportExerciseRow[]): {
  ok: BacNotionEntry[];
  pasOk: BacNotionEntry[];
  urgent: BacNotionEntry[];
} {
  const byNotion = new Map<
    string,
    {
      notion: string;
      grades: MissionLetterGrade[];
      matieres: Set<BacReportMatiere>;
      exercises: { exerciseId: string; title: string; grade: MissionLetterGrade }[];
    }
  >();

  for (const row of rows) {
    const notions = row.notions.length ? row.notions : ["(notion non renseignee)"];
    for (const notion of notions) {
      const key = notion.toLowerCase();
      let bucket = byNotion.get(key);
      if (!bucket) {
        bucket = { notion, grades: [], matieres: new Set(), exercises: [] };
        byNotion.set(key, bucket);
      }
      bucket.grades.push(row.grade);
      bucket.matieres.add(row.matiere);
      bucket.exercises.push({
        exerciseId: row.exerciseId,
        title: row.title,
        grade: row.grade,
      });
    }
  }

  const ok: BacNotionEntry[] = [];
  const pasOk: BacNotionEntry[] = [];
  const urgent: BacNotionEntry[] = [];

  for (const bucket of byNotion.values()) {
    const worst = worstMissionLetterGrade(bucket.grades);
    if (!worst) continue;
    const entry: BacNotionEntry = {
      notion: bucket.notion,
      grade: worst,
      matieres: [...bucket.matieres],
      exercises: bucket.exercises,
    };
    if (isMissionNotionGradeUrgentBac(worst)) {
      urgent.push(entry);
    } else if (isMissionNotionGradePasOk(worst)) {
      pasOk.push(entry);
    } else if (isMissionNotionGradeOk(worst)) {
      ok.push(entry);
    }
  }

  const sortNotions = (a: BacNotionEntry, b: BacNotionEntry) =>
    a.notion.localeCompare(b.notion, "fr", { sensitivity: "base" });

  ok.sort(sortNotions);
  pasOk.sort(sortNotions);
  urgent.sort(sortNotions);

  return { ok, pasOk, urgent };
}

export function buildStudentBacRevisionReport(input: {
  studentId: string;
  studentName: string;
  classe: string;
  lycee?: string;
  reportSince: string;
  missionsProgress?: { claims?: Record<string, MissionClaimEntry> };
}): StudentBacRevisionReport {
  const reportSince = normalizeDayKey(input.reportSince) ?? normalizeDayKey(new Date().toISOString())!;
  const claims = readMissionClaims(input.missionsProgress);
  const exerciseRows: BacReportExerciseRow[] = [];

  for (const [exerciseId, entry] of Object.entries(claims)) {
    if (!isBacReportExerciseId(exerciseId)) continue;
    const matiere = matiereForExercise(exerciseId);
    if (!matiere) continue;

    const first = getFirstAttemptMissionClaim(entry);
    if (!first || !isDayKeyOnOrAfter(first.claimDate, reportSince)) continue;

    const grade = scoreToMissionLetterGrade(first.score);
    const meta = metaForExercise(exerciseId);
    exerciseRows.push({
      exerciseId,
      title: meta.title,
      chapter: meta.chapter,
      matiere,
      claimDate: first.claimDate,
      grade,
      score: first.score,
      notions: getMissionNotionsForExercise(exerciseId),
    });
  }

  exerciseRows.sort((a, b) => {
    if (a.matiere !== b.matiere) return a.matiere.localeCompare(b.matiere, "fr");
    return a.exerciseId.localeCompare(b.exerciseId, "fr");
  });

  const { ok, pasOk, urgent } = aggregateNotions(exerciseRows);

  return {
    studentId: input.studentId,
    studentName: input.studentName,
    classe: input.classe,
    lycee: input.lycee,
    reportSince,
    generatedAt: new Date().toISOString(),
    exerciseRows,
    notionsOk: ok,
    notionsPasOk: pasOk,
    notionsUrgent: urgent,
    hasData: exerciseRows.length > 0,
  };
}
