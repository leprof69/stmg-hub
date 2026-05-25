/** Letter grades for Missions (internal 0-10 score unchanged for jetons / Firestore). */
export type MissionLetterGrade = "S+" | "S" | "A+" | "A" | "B+" | "B" | "C+" | "C" | "D+" | "D" | "E" | "F";

export type MissionLetterGradeMeta = {
  grade: MissionLetterGrade;
  label: string;
  color: string;
  bg: string;
  border: string;
};

const GRADE_META: Record<MissionLetterGrade, Omit<MissionLetterGradeMeta, "grade">> = {
  "S+": { label: "Exceptionnel", color: "#14532d", bg: "#ecfdf5", border: "#86efac" },
  S: { label: "Excellent", color: "#166534", bg: "#ecfdf5", border: "#6ee7b7" },
  "A+": { label: "Tr\u00e8s solide", color: "#1d4ed8", bg: "#eff6ff", border: "#93c5fd" },
  A: { label: "Solide", color: "#1e40af", bg: "#eff6ff", border: "#bfdbfe" },
  "B+": { label: "Bon travail", color: "#0369a1", bg: "#f0f9ff", border: "#7dd3fc" },
  B: { label: "Correct", color: "#0f766e", bg: "#f0fdfa", border: "#5eead4" },
  "C+": { label: "Passable", color: "#b45309", bg: "#fffbeb", border: "#fcd34d" },
  C: { label: "Fragile", color: "#c2410c", bg: "#fff7ed", border: "#fdba74" },
  "D+": { label: "Insuffisant", color: "#b91c1c", bg: "#fef2f2", border: "#fca5a5" },
  D: { label: "A retravailler", color: "#991b1b", bg: "#fef2f2", border: "#f87171" },
  E: { label: "En progression", color: "#9a3412", bg: "#fff7ed", border: "#fdba74" },
  F: { label: "Recommence", color: "#7f1d1d", bg: "#fef2f2", border: "#fecaca" },
};

const GRADE_TOKENS = "S\\+|S|A\\+|A|B\\+|B|C\\+|C|D\\+|D|E|F";

const GRADE_LINE_START =
  /^[\s\-*\u2022]*(?:(?:\u00c9|\u00e9)valuation|niveau\s*[:=]|(?:ta\s+)?note\s*[:=]|(?:ta\s+)?note\s+(?:obtenue|finale|sur)|score|r[\u00e9e]sultat\s*:|[\d.]+\s*\/\s*10)/i;

const GRADE_SENTENCE = new RegExp(
  [
    String.raw`\b(?:\u00c9|\u00e9)valuation\b`,
    String.raw`\bniveau\s+(?:de\s+)?(?:ma[\u00ee]trise|global|actuel|g[\u00e9e]n[\u00e9e]ral)\b`,
    String.raw`\b(?:ta\s+)?note\s+(?:obtenue|finale|sur|est|serait)\b`,
    String.raw`\bnote\s*[:=]\s*(?:[\d.]+\s*(?:\/\s*10|sur\s*10)?|${GRADE_TOKENS})\b`,
    String.raw`\bscore\b`,
    String.raw`\d{1,2}(?:\.\d+)?\s*\/\s*10\b`,
    String.raw`\bsur\s*10\b`,
    String.raw`\b(?:\u00e9|e)quivalence\b.*\d`,
    String.raw`\d{1,3}\s*%\s*(?:de\s+la\s+r[\u00e9e]compense|des\s+jetons|de\s+la\s+note|d[\u2019']?XP|des\s+XP|du\s+vocabulaire|de\s+r[\u00e9e]ussite|de\s+ma[\u00ee]trise)\b`,
    String.raw`\bniveau\s*[:=]\s*(?:[\d.]+|${GRADE_TOKENS})\b`,
    String.raw`\brefl[\u00e8e]te\b.*\b(?:note|score|\/?10|sur\s*10)\b`,
    String.raw`\b(?:environ|aux?\s+alentours\s+de|plut[\u00f4o]t)\s+\d{1,2}(?:[.,]\d+)?\s*(?:\/|\sur\s*)\s*10\b`,
    String.raw`\b(?:obtiens?|as\s+obtenu|tu\s+es\s+[\u00e0a])\s+\d{1,2}(?:[.,]\d+)?\s*(?:\/|\sur\s*)\s*10\b`,
    String.raw`\b(?:ta\s+)?note\b[^.!\n]{0,48}(?:\/\s*10|sur\s*10|\(\s*\))/`,
    String.raw`\b(?:\u00e9|e)chelle\s+de\s+10\b`,
    String.raw`\bpoints?\s+sur\s*10\b`,
    String.raw`\b\d{1,2}(?:\.\d+)?\s+points?\s+(?:sur|\/)\s*10\b`,
  ].join("|"),
  "i"
);

function dropGradeSentences(text: string): string {
  const chunks = text.split(/\n{2,}/);
  const cleaned = chunks
    .map((chunk) => {
      const sentences = chunk
        .split(/(?<=[.!?\u2026])\s+/)
        .map((s) => s.trim())
        .filter(Boolean)
        .filter((sentence) => !GRADE_SENTENCE.test(sentence));
      return sentences.join(" ");
    })
    .map((p) => p.trim())
    .filter(Boolean);
  return cleaned.join("\n\n");
}

/** Strip numeric grade phrasing from correction feedback (letter shown separately in UI). */
export function sanitizeMissionEvaluationText(text: string): string {
  if (!text) return text;

  let out = String(text)
    .split("\n")
    .filter((line) => !GRADE_LINE_START.test(line.trim()))
    .join("\n");

  out = out.replace(/\u00c9valuation du fond\s*:[^\n]*/gi, "");
  out = dropGradeSentences(out);

  out = out.replace(/\u00c9valuation locale[^.!\n]*[.!]?/gi, "");
  out = out.replace(/(?:ta\s+)?note\s*(?:obtenue|finale)?\s*[:=]\s*[\d.]+\s*(?:\/\s*10|sur\s*10)?\.?/gi, "");
  out = out.replace(/(?:score|niveau)\s*[:=]\s*[\d.]+\s*(?:\/\s*10|sur\s*10)?\.?/gi, "");
  out = out.replace(/(?<![\d/])(\d{1,2}(?:\.\d+)?)\s*\/\s*10\b/g, "");
  out = out.replace(/\bsur\s*10\b/gi, "");
  out = out.replace(/\d{1,3}\s*%\s*(?:de la r[\u00e9e]compense|des jetons|de la note)\b[^.!\n]*/gi, "");
  out = out.replace(new RegExp(`\\bnote\\s*[:=]\\s*(${GRADE_TOKENS})\\b`, "gi"), "");
  out = out.replace(new RegExp(`\\bniveau\\s*[:=]\\s*(${GRADE_TOKENS})\\b`, "gi"), "");

  out = dropGradeSentences(out);
  out = out.replace(/\n{3,}/g, "\n\n").trim();

  return out;
}

export function scoreToMissionLetterGrade(score: number): MissionLetterGrade {
  const s = Math.max(0, Math.min(10, score));
  if (s >= 9.5) return "S+";
  if (s >= 9) return "S";
  if (s >= 8.5) return "A+";
  if (s >= 8) return "A";
  if (s >= 7.5) return "B+";
  if (s >= 7) return "B";
  if (s >= 6.5) return "C+";
  if (s >= 6) return "C";
  if (s >= 5.5) return "D+";
  if (s >= 5) return "D";
  if (s >= 3.5) return "E";
  return "F";
}

export function getMissionLetterGradeMeta(score: number): MissionLetterGradeMeta {
  const grade = scoreToMissionLetterGrade(score);
  return { grade, ...GRADE_META[grade] };
}

export function formatMissionGradeForDisplay(score: number): string {
  return scoreToMissionLetterGrade(score);
}
