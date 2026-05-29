import { COLLECTIONS } from "../../services/collectionsData";

export const ADMIN_COLORS = {
  S: "#3B82F6",
  T: "#7C3AED",
  M: "#F97316",
  G: "#10B981",
  H: "#EF4444",
  U: "#F59E0B",
  B: "#06B6D4",
} as const;

export const ADMIN_SECTIONS = [
  { id: "overview", label: "Vue d\u2019ensemble" },
  { id: "eleves", label: "\u00c9l\u00e8ves" },
  { id: "examens", label: "Examens & DS" },
  { id: "jetons", label: "Jetons & r\u00e9compenses" },
  { id: "contenus", label: "Imports" },
  { id: "aide", label: "Aide" },
] as const;

export type AdminSectionId = (typeof ADMIN_SECTIONS)[number]["id"];

export const EMOJI_PAR_MATIERE: Record<string, string> = {
  Management: "\ud83c\udfea",
  Droit: "\u2696\ufe0f",
  Economie: "\ud83d\udcca",
  "Sciences de Gestion": "\ud83d\udcbb",
  Marketing: "\ud83d\udce3",
  "Ressources Humaines": "\ud83d\udc65",
  "Gestion Finance": "\ud83d\udcb0",
};

export const FAMILLE_COLORS: Record<string, string> = {
  Architecte: "#3B82F6",
  Visionnaire: "#7C3AED",
  Challenger: "#F97316",
  Explorateur: "#10B981",
  Influenceur: "#EF4444",
};

export const FAMILLE_EMOJIS: Record<string, string> = {
  Architecte: "\ud83e\udde0",
  Visionnaire: "\ud83c\udfa8",
  Challenger: "\u26a1",
  Explorateur: "\ud83d\udd2c",
  Influenceur: "\ud83d\udd25",
};

export const RECOMPENSES_INDIVIDUEL = [
  { rang: 1, label: "\ud83e\udd47 1er", xp: 200, couleur: "#F59E0B" },
  { rang: 2, label: "\ud83e\udd48 2\u00e8me", xp: 150, couleur: "#9CA3AF" },
  { rang: 3, label: "\ud83e\udd49 3\u00e8me", xp: 100, couleur: "#CD7F32" },
  { rang: 4, label: "4\u00e8me", xp: 75, couleur: "#3B82F6" },
  { rang: 5, label: "5\u00e8me", xp: 50, couleur: "#3B82F6" },
];

export const RECOMPENSES_FAMILLE = [
  { rang: 1, label: "\ud83e\udd47 1\u00e8re", xp: 150, couleur: "#F59E0B" },
  { rang: 2, label: "\ud83e\udd48 2\u00e8me", xp: 100, couleur: "#9CA3AF" },
  { rang: 3, label: "\ud83e\udd49 3\u00e8me", xp: 75, couleur: "#CD7F32" },
  { rang: 4, label: "4\u00e8me", xp: 50, couleur: "#3B82F6" },
  { rang: 5, label: "5\u00e8me", xp: 25, couleur: "#3B82F6" },
];

const RARETE_PARTICIPATION: Record<string, number> = {
  commune: 0,
  peu_commune: 0,
  rare: 0.5,
  epique: 1,
  legendaire: 2,
  ultra_rare: 3,
};

export const CARD_BONUS_BY_ID: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  COLLECTIONS.forEach((colSet) => {
    (colSet.cartes || []).forEach((card) => {
      map[card.id] = RARETE_PARTICIPATION[card.rarete] || 0;
    });
  });
  return map;
})();
