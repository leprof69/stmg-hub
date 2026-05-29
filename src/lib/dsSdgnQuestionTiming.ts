/**
 * Questions DS avec calculs numeriques : pas de chrono par question (session 50 min conservee).
 */
export function isDsSdgnCalculationQuestion(
  question: string,
  _choices?: readonly string[],
): boolean {
  const stem = question.trim();
  if (!/\d/.test(stem)) return false;

  if (/\u20ac/.test(stem)) return true;
  if (/(?:^|[\s(])\d[\d\s.,]*\s*%/.test(stem)) return true;

  if (/\b(CA|RN|CP|VA|CI|PV|TTC|HT)\b/i.test(stem)) return true;

  if (
    /(calcule|calculer|d['\u2019]environ|\u00e9tait de|sera de|donne un|donne une|multipli|divis|soustr|additionn)/i.test(
      stem,
    )
  ) {
    return true;
  }

  if (/Un coll\u00e8gue annonce|Objectif\s*:/i.test(stem)) return true;

  const numbers = stem.match(/\d[\d\s.,]*/g);
  if (numbers && numbers.length >= 2) return true;

  return false;
}
