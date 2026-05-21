const MOJIBAKE_RE =
  /\u251c|\u2510|\u2524|\u00e2\u20ac|\u00c2[\u00a0-\u00bf]|rel\u00efve|acc\u00efs|si\u00efge|th\u00efme|r\u00efgle|apr\u00efs|mod\u00efles/;

const REPLACEMENT_CHAR = "\uFFFD";

/** Meta-programme : pas une question sur la notion (interdit en jeu). */
const META_QUESTION_RE =
  /\u00e0 quel chapitre|appartient la notion|quel intitul\u00e9 correspond|quelle affirmation d\u00e9crit une comp\u00e9tence|question directrice \(qdg\)|quelle est la question directrice|chapitre sdgn missions appartient|activit\u00e9 du pack missions sdgn/i;

export function hasBrokenQcmEncoding(text: string): boolean {
  return MOJIBAKE_RE.test(text) || text.includes(REPLACEMENT_CHAR);
}

export function isMetaProgramQuestion(text: string): boolean {
  return META_QUESTION_RE.test(text);
}

export function isValidGameQcmItem(item: {
  id?: string;
  question: string;
  choix: readonly string[];
  chapter?: number;
}): boolean {
  if (!item.question.trim() || item.question.length < 15) return false;
  if (hasBrokenQcmEncoding(item.question)) return false;
  if (isMetaProgramQuestion(item.question)) return false;
  if (item.id?.startsWith("gen-")) return false;
  if (item.choix.length !== 4) return false;
  if (item.choix.some((c) => !c.trim() || c.length < 2)) return false;
  if (item.choix.some((c) => hasBrokenQcmEncoding(c) || isMetaProgramQuestion(c))) return false;
  if (item.choix.some((c) => c.length > 220)) return false;
  const unique = new Set(item.choix.map((c) => c.trim().toLowerCase()));
  if (unique.size < 4) return false;
  return true;
}
