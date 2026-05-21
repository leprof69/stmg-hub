import { SDGN_CHAPTER_REFERENTIAL } from "../data/sdgn/chapterReferential";
import {
  getSdgnExercises,
  getSdgnMissionChapterNumbers,
  isSdgnMissionChapter,
  SDGN_CHAPTER_LABELS,
} from "../data/sdgn/registry";
import type {
  SdgnMissionQcm,
  SdgnMissionQcmDifficulte,
} from "../data/sdgn/sdgnMissionQcmBank";

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h || 1;
}

function shuffleOrder(seed: number, n: number): number[] {
  const order = Array.from({ length: n }, (_, i) => i);
  let s = seed;
  for (let i = n - 1; i > 0; i--) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const j = s % (i + 1);
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

function makeMcq(
  id: string,
  chapter: number,
  difficulte: SdgnMissionQcmDifficulte,
  question: string,
  correct: string,
  distractors: string[],
): SdgnMissionQcm | null {
  const trimmedCorrect = correct.trim();
  if (!trimmedCorrect) return null;

  const seen = new Set<string>([trimmedCorrect]);
  const wrong: string[] = [];
  for (const d of distractors) {
    const t = d.trim();
    if (!t || seen.has(t)) continue;
    seen.add(t);
    wrong.push(t);
    if (wrong.length >= 3) break;
  }
  while (wrong.length < 3) {
    wrong.push("Aucune de ces r\u00E9ponses");
  }

  const pool = [trimmedCorrect, wrong[0], wrong[1], wrong[2]];
  const perm = shuffleOrder(hashSeed(id), 4);
  const choix = perm.map((i) => pool[i]) as [string, string, string, string];
  const bonIndex = perm.indexOf(0) as 0 | 1 | 2 | 3;

  return { id, chapter, difficulte, question, choix, bonIndex };
}

function chapterLabel(chapter: number): string {
  return SDGN_CHAPTER_LABELS[chapter as keyof typeof SDGN_CHAPTER_LABELS] ?? `Chapitre ${chapter}`;
}

function otherChapterLabels(chapter: number, count: number): string[] {
  const nums = getSdgnMissionChapterNumbers().filter((n) => n !== chapter);
  const out: string[] = [];
  let seed = hashSeed(`ch-${chapter}`) + 7;
  for (let i = 0; i < count && nums.length > 0; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const n = nums[seed % nums.length];
    out.push(`Chapitre ${n} \u2014 ${chapterLabel(n)}`);
    nums.splice(nums.indexOf(n), 1);
    if (nums.length === 0) break;
  }
  return out;
}

function pickFromPool<T>(pool: T[], exclude: T, count: number, seedKey: string): T[] {
  const rest = pool.filter((x) => x !== exclude);
  const out: T[] = [];
  let s = hashSeed(seedKey);
  const copy = [...rest];
  while (out.length < count && copy.length > 0) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    const idx = s % copy.length;
    out.push(copy[idx]);
    copy.splice(idx, 1);
  }
  return out;
}

function slugPart(value: string, max = 36): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, max);
}

/** Build QCM from Missions referential + exercises (auto-extends with new registry chapters). */
export function buildSdgnMissionQcmFromContent(): SdgnMissionQcm[] {
  const chapters = getSdgnMissionChapterNumbers();
  const allNotions: { chapter: number; notion: string }[] = [];
  const allCompetences: { chapter: number; text: string }[] = [];
  const allQdg: { chapter: number; text: string }[] = [];
  const allExerciseTitles: { chapter: number; title: string }[] = [];

  for (const chapter of chapters) {
    const ref = SDGN_CHAPTER_REFERENTIAL[chapter];
    if (ref) {
      for (const notion of ref.notions) {
        allNotions.push({ chapter, notion });
      }
      for (const text of ref.competences) {
        allCompetences.push({ chapter, text });
      }
      if (ref.question.trim()) {
        allQdg.push({ chapter, text: ref.question.trim() });
      }
    }
    for (const ex of getSdgnExercises(chapter)) {
      if (ex.title.trim()) {
        allExerciseTitles.push({ chapter, title: ex.title.trim() });
      }
    }
  }

  const out: SdgnMissionQcm[] = [];

  for (const { chapter, notion } of allNotions) {
    if (!isSdgnMissionChapter(chapter)) continue;
    const label = chapterLabel(chapter);
    const correct = `Chapitre ${chapter} \u2014 ${label}`;
    const q = makeMcq(
      `gen-sdgn${chapter}-not-${slugPart(notion)}`,
      chapter,
      notion.length > 42 ? "moyen" : "facile",
      `\u00C0 quel chapitre SDGN Missions appartient la notion \u00AB ${notion} \u00BB ?`,
      correct,
      otherChapterLabels(chapter, 3),
    );
    if (q) out.push(q);
  }

  for (const { chapter, text } of allCompetences) {
    if (!isSdgnMissionChapter(chapter)) continue;
    const label = chapterLabel(chapter);
    const pool = allCompetences.map((c) => c.text);
    const q = makeMcq(
      `gen-sdgn${chapter}-cmp-${slugPart(text)}`,
      chapter,
      text.length > 72 ? "moyen" : "facile",
      `Quelle affirmation d\u00E9crit une comp\u00E9tence attendue au chapitre ${chapter} (${label}) ?`,
      text,
      pickFromPool(pool, text, 3, `cmp-${chapter}-${text}`),
    );
    if (q) out.push(q);
  }

  for (const { chapter, text } of allQdg) {
    if (!isSdgnMissionChapter(chapter)) continue;
    const label = chapterLabel(chapter);
    const pool = allQdg.map((q) => q.text);
    const item = makeMcq(
      `gen-sdgn${chapter}-qdg`,
      chapter,
      "moyen",
      `Quelle est la question directrice (QdG) du chapitre ${chapter} \u2014 ${label} ?`,
      text,
      pickFromPool(pool, text, 3, `qdg-${chapter}`),
    );
    if (item) out.push(item);
  }

  for (const { chapter, title } of allExerciseTitles) {
    if (!isSdgnMissionChapter(chapter)) continue;
    const pool = allExerciseTitles.map((e) => e.title);
    const item = makeMcq(
      `gen-sdgn${chapter}-exo-${slugPart(title)}`,
      chapter,
      "facile",
      `Quel intitul\u00E9 correspond \u00E0 une activit\u00E9 du pack Missions SDGN (chapitre ${chapter}) ?`,
      title,
      pickFromPool(pool, title, 3, `exo-${chapter}-${title}`),
    );
    if (item) out.push(item);
  }

  return out;
}
