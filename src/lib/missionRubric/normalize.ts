export function normalizeRubricText(value = ""): string {
  return String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function compactToken(value: string): string {
  return normalizeRubricText(value).replace(/\s+/g, "");
}
