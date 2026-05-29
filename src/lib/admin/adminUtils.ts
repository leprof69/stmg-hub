export const col = (row: Record<string, unknown>, ...keys: string[]) => {
  for (const k of keys) {
    const v = row[k];
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return "";
};

export const splitMotsCles = (valeur: unknown) => {
  if (!valeur) return [];
  return String(valeur)
    .split(/[|,;/]/)
    .map((m) => m.trim())
    .filter(Boolean);
};

export const compterCartesTotal = (cartes: Record<string, number> = {}) =>
  Object.values(cartes).reduce((sum, n) => sum + (Number(n) || 0), 0);

export const compterCartesUniques = (cartes: Record<string, number> = {}) =>
  Object.values(cartes).filter((n) => (Number(n) || 0) > 0).length;

export const toDate = (value: unknown): Date | null => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && value !== null && "toDate" in value && typeof (value as { toDate: () => Date }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate();
  }
  if (typeof value === "number") return new Date(value);
  if (typeof value === "string") {
    const asDate = new Date(value);
    return Number.isNaN(asDate.getTime()) ? null : asDate;
  }
  return null;
};

export const parseDayKey = (value: unknown): Date | null => {
  if (!value || typeof value !== "string") return null;
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [y, m, d] = parts;
  return new Date(y, m - 1, d, 12, 0, 0, 0);
};

export const toDayKey = (date = new Date()) =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export const joursEcoules = (date: Date | null) => {
  if (!date) return null;
  const now = new Date();
  const a = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const b = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
};

export const formatDateFr = (date: Date | null) => {
  if (!date) return "Jamais";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDuration = (seconds = 0) => {
  const total = Math.max(0, Math.floor(Number(seconds) || 0));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m > 0) return `${m}m ${String(s).padStart(2, "0")}s`;
  return `${s}s`;
};
