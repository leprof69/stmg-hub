// @ts-nocheck
const FAMILY_TO_FAMILIAR = {
  Architecte: {
    id: "griffon",
    nom: "Griffon",
    emoji: "🦅",
    valeur: "Discipline",
    description: "Un gardien stratège qui veille sur les plans bien construits.",
  },
  Visionnaire: {
    id: "unicorn",
    nom: "Licorne",
    emoji: "🦄",
    valeur: "Creativite",
    description: "Une etincelle d'imagination qui transforme les idees en projets.",
  },
  Challenger: {
    id: "dragon",
    nom: "Dragon",
    emoji: "🐉",
    valeur: "Courage",
    description: "Un compagnon ardent qui adore les defis ambitieux.",
  },
  Explorateur: {
    id: "phoenix",
    nom: "Phoenix",
    emoji: "🔥",
    valeur: "Curiosite",
    description: "Un esprit d'aventure qui renait a chaque apprentissage.",
  },
  Influenceur: {
    id: "kitsune",
    nom: "Kitsune",
    emoji: "🦊",
    valeur: "Charisme",
    description: "Un renard mythique, social et malin, qui inspire son equipe.",
  },
};

const DEFAULT_FAMILIAR = {
  id: "dragon",
  nom: "Dragon",
  emoji: "🐉",
  valeur: "Courage",
  description: "Un compagnon ardent qui adore les defis ambitieux.",
};

export const MOOD_XP_MULTIPLIER = {
  heureux: 1.08,
  neutre: 1,
  triste: 0.95,
  colere: 0.9,
};

const MOOD_LABEL = {
  heureux: "Heureux",
  neutre: "Neutre",
  triste: "Triste",
  colere: "En colere",
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const toDate = (value) => {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value?.toDate === "function") return value.toDate();
  if (typeof value?.seconds === "number") return new Date(value.seconds * 1000);
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const stageFromTotalXp = (totalXp = 0) => {
  if (totalXp >= 2600) return "adulte";
  if (totalXp >= 1100) return "ado";
  if (totalXp >= 300) return "bebe";
  return "oeuf";
};

const moodFromHappiness = (happiness = 50) => {
  if (happiness >= 76) return "heureux";
  if (happiness >= 46) return "neutre";
  if (happiness >= 21) return "triste";
  return "colere";
};

const createEvent = (type, message, details = {}) => ({
  id: `${type}-${Date.now()}`,
  type,
  message,
  details,
  createdAt: new Date().toISOString(),
});

export const getFamiliarByFamily = (famille) => (
  FAMILY_TO_FAMILIAR[famille] || DEFAULT_FAMILIAR
);

export const createDefaultPet = (profil = {}) => {
  const familiar = getFamiliarByFamily(profil?.famille);
  return {
    id: familiar.id,
    nom: familiar.nom,
    emoji: familiar.emoji,
    valeur: familiar.valeur,
    description: familiar.description,
    stage: "oeuf",
    mood: "neutre",
    happiness: 55,
    totalXpFromMissions: 0,
    ageDays: 0,
    isRoaming: false,
    introSeen: false,
    lastMissionAt: null,
    lastXpGainAt: null,
    createdAt: new Date().toISOString(),
    pendingEvent: createEvent(
      "egg_received",
      `Tu as recu un oeuf de ${familiar.nom} ! Gagne 300 XP de missions pour le faire eclore.`,
      { familiar: familiar.nom }
    ),
  };
};

export const normalizePet = (pet, profil = {}) => {
  if (!pet || typeof pet !== "object") return createDefaultPet(profil);
  const familiar = getFamiliarByFamily(profil?.famille);
  const totalXpFromMissions = Number(pet.totalXpFromMissions) || 0;
  const happiness = clamp(Number(pet.happiness) || 55, 0, 100);
  const createdAt = toDate(pet.createdAt) || new Date();
  const ageMs = Math.max(0, Date.now() - createdAt.getTime());
  const ageDays = Math.floor(ageMs / 86400000);
  const stage = stageFromTotalXp(totalXpFromMissions);
  const mood = pet.mood && MOOD_XP_MULTIPLIER[pet.mood]
    ? pet.mood
    : moodFromHappiness(happiness);

  return {
    ...pet,
    id: pet.id || familiar.id,
    nom: pet.nom || familiar.nom,
    emoji: pet.emoji || familiar.emoji,
    valeur: pet.valeur || familiar.valeur,
    description: pet.description || familiar.description,
    stage,
    mood,
    happiness,
    totalXpFromMissions,
    ageDays,
    isRoaming: Boolean(pet.isRoaming),
    introSeen: Boolean(pet.introSeen),
    createdAt: createdAt.toISOString(),
  };
};

export const getPetXpMultiplier = (pet) => {
  const normalized = normalizePet(pet);
  return MOOD_XP_MULTIPLIER[normalized.mood] || 1;
};

export const getPetMoodLabel = (mood) => MOOD_LABEL[mood] || "Neutre";

export const computePetAfterMission = (pet, xpEarned) => {
  const normalized = normalizePet(pet);
  const nowIso = new Date().toISOString();
  const totalXp = normalized.totalXpFromMissions + Math.max(0, xpEarned);
  const previousStage = normalized.stage;
  const stage = stageFromTotalXp(totalXp);
  const happinessDelta = xpEarned > 0 ? 8 : -7;
  const happiness = clamp(normalized.happiness + happinessDelta, 0, 100);
  const mood = moodFromHappiness(happiness);

  const nextPet = {
    ...normalized,
    totalXpFromMissions: totalXp,
    stage,
    happiness,
    mood,
    lastMissionAt: nowIso,
    lastXpGainAt: xpEarned > 0 ? nowIso : normalized.lastXpGainAt || null,
  };

  if (previousStage === "oeuf" && stage === "bebe") {
    nextPet.pendingEvent = createEvent(
      "egg_hatched",
      `Incroyable ! Ton oeuf a eclos : ${normalized.emoji} ${normalized.nom} est ne.`,
      { familiar: normalized.nom }
    );
  } else if (previousStage !== stage && stage === "ado") {
    nextPet.pendingEvent = createEvent(
      "stage_up",
      `${normalized.nom} grandit et passe au stade ado !`,
      { stage }
    );
  } else if (previousStage !== stage && stage === "adulte") {
    nextPet.pendingEvent = createEvent(
      "stage_up",
      `${normalized.nom} est maintenant adulte. Respect !`,
      { stage }
    );
  }

  return nextPet;
};

