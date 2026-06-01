/** D\u00e9termine l'examen DS SDGN selon la classe \u00e9l\u00e8ve. */
export function isPremiereClasse(classe: unknown): boolean {
  const c = String(classe ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return (
    c === "premiere" ||
    c === "1ere" ||
    c.startsWith("1ere ") ||
    c.includes("premiere")
  );
}

export function isTerminaleClasse(classe: unknown): boolean {
  const c = String(classe ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return c === "terminale" || c.startsWith("terminale ") || c.includes("terminale");
}

export function resolveDsSdgnNiveauLabel(classe: unknown): "premiere" | "terminale" {
  if (isTerminaleClasse(classe)) return "terminale";
  return "premiere";
}
