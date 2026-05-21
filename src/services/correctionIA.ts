import { decodeUnicodeEscapes } from "../lib/decodeUnicode";

/**
 * Correction IA / locale harmonise pour Missions, Objectif Bac et futurs crans.
 * Priorité au fond (idées + notions), pas aux mots exacts  scoring sémantique léger (racines / synonymes).
 */

/** Tableaux optionnels affichés dans les missions (compte de résultat, bilan, etc.). */
export type ExerciseSupportTable = {
  title?: string;
  columns: string[];
  rows: string[][];
};

export type CorrectionExerciseBase = {
  title: string;
  consigne: string;
  /** Résumé pdagogique ; peut être vide si la grille / reference suffisent (ex. Objectif Bac). */
  attendu: string;
  minChars: number;
  support?: string;
  /** Données structurées (injectées dans le corpus de correction comme texte). */
  supportTables?: ExerciseSupportTable[];
  questions?: string[];
  correctionModele?: string;
  referentielNotions?: string[];
  referentielCompetences?: string[];
  /** Objectif Bac et assimilés */
  context?: string;
  grille?: string[];
  correctionPartielle?: string;
};

export type MissionLocalEval = {
  score: number;
  feedback: string;
  analyseDeveloppee: string;
  pointsForts: string;
  pointsFaibles: string;
  conseilsProgression: string;
  propositionReponse: string;
  source: "local";
};

export type ObjectifBacEvalResult = {
  score: number;
  feedback: string;
  points_forts: string;
  a_ameliorer: string;
  elements_reperes: string[];
  source: "ai" | "local";
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export const parseJson = (raw = "") => {
  const cleaned = String(raw).replace(/```json|```/gi, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
};

const normalizeText = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tokens = (value = "") => normalizeText(value).split(" ").filter((token) => token.length >= 4);

const STOPWORDS_CORRECTION = new Set([
  "reponds",
  "reponse",
  "reponses",
  "question",
  "questions",
  "ordre",
  "consigne",
  "support",
  "document",
  "modele",
  "vocabulaire",
  "chapitre",
  "claire",
  "claires",
  "minimum",
  "travail",
  "professionnel",
  "traitee",
  "attendu",
  "attendue",
  "attendues",
  "corriger",
  "corrige",
  "corrigee",
  "synthese",
  "point",
  "points",
]);

const SYNONYM_GROUPS: string[][] = [
  ["visioconference", "visio", "reuniondistance", "reunion"],
  ["collaboration", "cooperation", "collectif", "equipe"],
  ["communication", "echanges", "interaction", "dialogue"],
  ["organisation", "coordination", "planification", "suivi"],
  ["stockage", "partage", "dossier", "cloud", "serveur"],
  ["creation", "coedition", "production", "contenu"],
  ["internet", "siteweb", "web", "public"],
  ["intranet", "interne", "salaries"],
  ["extranet", "partenaires", "autorises", "fournisseurs"],
  ["securite", "confidentialite", "protection", "risque"],
  ["droitsacces", "acces", "autorisation", "permission"],
  ["reseausocialinterne", "reseausocial", "socialinterne", "vivaengage", "yammer"],
  ["intelligencecollective", "idees", "mutualiser", "connaissances"],
  ["intelligenceartificielle", "artificielle", "algorithme", "automatisation"],
  ["performance", "efficacite", "productivite", "reactivite"],
  ["numerique", "technologie", "outil", "logiciel", "application"],
  ["avantage", "interet", "benefice", "apport"],
  ["definir", "definition", "signifie", "designe", "permet"],
];

const canonicalizeToken = (token: string) => {
  const compact = token.replace(/\s+/g, "");
  const group = SYNONYM_GROUPS.find((g) => g.includes(compact));
  return group ? group[0] : compact;
};

const tokenStem = (token: string) => {
  const t = canonicalizeToken(token);
  return t.length <= 5 ? t : t.slice(0, 6);
};

const toSemanticSet = (items: string[]) => new Set(items.map((w) => tokenStem(w)));

const pickMissingKeywords = (expected: string[], learnerSemantic: Set<string>, limit = 6) =>
  expected
    .filter((w) => !learnerSemantic.has(tokenStem(w)))
    .filter((w) => w.length >= 5)
    .slice(0, limit);

function stringifySupportTables(tables?: ExerciseSupportTable[]): string {
  if (!tables?.length) return "";
  return tables
    .map((t) => {
      const parts = [t.title || "", t.columns.join(" "), ...t.rows.map((r) => r.join(" "))];
      return parts.filter(Boolean).join(" ");
    })
    .join("\n");
}

export function buildExerciseKeywordCorpus(ex: CorrectionExerciseBase): string {
  return [
    ex.support || "",
    stringifySupportTables(ex.supportTables),
    ex.context || "",
    (ex.questions || []).join(" "),
    ex.attendu || "",
    (ex.grille || []).join(" "),
    ex.correctionPartielle || "",
    ex.consigne || "",
    ex.correctionModele || "",
    (ex.referentielNotions || []).join(" "),
    (ex.referentielCompetences || []).join(" "),
  ]
    .filter(Boolean)
    .join(" ");
}

export function buildExpectedKeywords(exercise: CorrectionExerciseBase): string[] {
  const corpus = buildExerciseKeywordCorpus(exercise);
  const raw = tokens(corpus).filter((w) => w.length >= 5 && !STOPWORDS_CORRECTION.has(w));
  const freq = new Map<string, number>();
  raw.forEach((w) => freq.set(w, (freq.get(w) || 0) + 1));
  const ordered = Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([w]) => w)
    .slice(0, 20);
  return ordered.length ? ordered : raw.slice(0, 14);
}

/** Réponse de secours affiche si aucune correction détaillée n'est fournie dans les donnes. */
export function buildPerfectAnswerLocal(exercise: CorrectionExerciseBase): string {
  if (exercise.correctionModele?.trim()) {
    return exercise.correctionModele.trim();
  }
  const lines: string[] = [];
  lines.push(`Réponse modèle  ${exercise.title}`);
  lines.push("");
  if (exercise.questions?.length) {
    lines.push("Correction type (question par question) :");
    lines.push("");
    lines.push("Questions  traiter :");
    exercise.questions.forEach((q, i) => {
      lines.push(`${i + 1}) ${q}`);
    });
    lines.push("");
  } else if (exercise.grille?.length) {
    lines.push("Repères de correction :");
    exercise.grille.forEach((g, i) => {
      lines.push(`${i + 1}. ${g}`);
    });
    lines.push("");
    if (exercise.correctionPartielle?.trim()) {
      lines.push(exercise.correctionPartielle.trim());
      lines.push("");
    }
  }
  const attendu = exercise.attendu?.trim();
  if (attendu) {
    lines.push(`Réponse attendue : ${attendu}`);
  } else if (!exercise.grille?.length) {
    lines.push("Voir la consigne et les documents du sujet pour la correction attendue.");
  }
  return lines.join("\n");
}

/** Formulation volontairement pdagogique à conserver pour l'élève (feedback utile). */
export function buildDeveloppementLocal(score: number, ratio: number, missing: string[]) {
  const lignes: string[] = [];
  lignes.push(`Évaluation du fond : ${score}/10.`);
  if (ratio >= 0.7) {
    lignes.push("Tu as bien couvert les idées attendues. La majorit des éléments de réponse est présente.");
  } else if (ratio >= 0.5) {
    lignes.push("Ta réponse est globalement juste, mais il manque encore quelques éléments importants.");
  } else if (ratio >= 0.3) {
    lignes.push("Ta réponse aborde le sujet mais une partie importante du contenu attendu n'apparat pas encore.");
  } else {
    lignes.push("Ta réponse est trop courte ou trop éloignée des notions attendues. Relis le cours et la consigne.");
  }
  if (missing.length) {
    lignes.push(`éléments  ajouter pour te rapprocher de la réponse parfaite : ${missing.join(", ")}.`);
  }
  return lignes.join("\n\n");
}

export function buildConseilsLocal(missing: string[]) {
  return missing.length
    ? `Ajoute en priorité ces éléments : ${missing.join(", ")}.`
    : "Relis ta réponse et vrifie que chaque question est traite explicitement.";
}

type SemanticBundle = {
  score: number;
  coverage: number;
  missing: string[];
  analyseBlock: string;
  conseils: string;
  pointsForts: string;
  pointsFaibles: string;
};

function computeSemanticBundle(exercise: CorrectionExerciseBase, text: string): SemanticBundle | null {
  const trimmed = String(text || "").trim();
  if (!trimmed) return null;

  const expectedKeywords = buildExpectedKeywords(exercise);
  const expectedSemantic = toSemanticSet(expectedKeywords);
  const learnerTokens = new Set(tokens(trimmed));
  const learnerSemantic = toSemanticSet(Array.from(learnerTokens));
  let overlap = 0;
  for (const token of learnerSemantic) if (expectedSemantic.has(token)) overlap += 1;
  const ratio = expectedSemantic.size ? overlap / expectedSemantic.size : 0;
  const coverage = clamp(ratio, 0, 1);
  const missing = pickMissingKeywords(expectedKeywords, learnerSemantic);

  let score = 2 + coverage * 7;
  if (trimmed.length >= exercise.minChars) score += 0.5;
  if (trimmed.length >= exercise.minChars * 1.3) score += 0.3;
  if (coverage >= 0.5) score += 0.5;
  if (coverage >= 0.7) score += 0.3;
  score = clamp(Math.round(score * 10) / 10, 0, 10);

  const analyseBlock = buildDeveloppementLocal(score, coverage, missing);
  const conseils = buildConseilsLocal(missing);

  return {
    score,
    coverage,
    missing,
    analyseBlock,
    conseils,
    pointsForts: coverage >= 0.6
      ? "Plusieurs idées attendues sont bien présentes dans ta réponse."
      : coverage >= 0.35
      ? "Tu as commencé  traiter certains aspects du sujet."
      : "Réponse trop éloignée des notions attendues.",
    pointsFaibles: missing.length
      ? `éléments manquants ou trop peu développés : ${missing.join(", ")}.`
      : "Peu d'éléments manquants repérés.",
  };
}

export function localCorrectionMissions(exercise: CorrectionExerciseBase, answer: string): MissionLocalEval {
  const text = String(answer || "").trim();
  if (!text) {
    return {
      score: 0,
      feedback: "Réponse vide : impossible d'évaluer le contenu.",
      analyseDeveloppee: "Saisis une première version en rpondant point par point  la consigne.",
      pointsForts: "Aucun lment exploitable pour le moment.",
      pointsFaibles: "Réponse absente.",
      conseilsProgression: "Relis la consigne et rponds point par point.",
      propositionReponse: buildPerfectAnswerLocal(exercise),
      source: "local",
    };
  }

  const bundle = computeSemanticBundle(exercise, text);
  if (!bundle) {
    return {
      score: 0,
      feedback: "Réponse vide : impossible d'évaluer le contenu.",
      analyseDeveloppee: "Saisis une première version en rpondant point par point  la consigne.",
      pointsForts: "Aucun lment exploitable pour le moment.",
      pointsFaibles: "Réponse absente.",
      conseilsProgression: "Relis la consigne et rponds point par point.",
      propositionReponse: buildPerfectAnswerLocal(exercise),
      source: "local",
    };
  }

  return {
    score: bundle.score,
    feedback: "Correction centre sur le fond de ta réponse.",
    analyseDeveloppee: bundle.analyseBlock,
    pointsForts: bundle.pointsForts,
    pointsFaibles: bundle.pointsFaibles,
    conseilsProgression: bundle.conseils,
    propositionReponse: buildPerfectAnswerLocal(exercise),
    source: "local",
  };
}

export function localCorrectionObjectifBac(exercise: CorrectionExerciseBase, answer: string): ObjectifBacEvalResult {
  const text = String(answer || "").trim();
  if (!text) {
    return {
      score: 0,
      feedback: "Réponse vide.",
      points_forts: "Aucun pour le moment.",
      a_ameliorer: "Commence par une réponse courte mais structurée.",
      elements_reperes: [],
      source: "local",
    };
  }

  const bundle = computeSemanticBundle(exercise, text);
  if (!bundle) {
    return {
      score: 0,
      feedback: "Réponse vide.",
      points_forts: "Aucun pour le moment.",
      a_ameliorer: "Commence par une réponse courte mais structurée.",
      elements_reperes: [],
      source: "local",
    };
  }

  const hasStructure = /(\n|^-|:|1\.)/m.test(text);
  const hasExample = /(exemple|dans le cas|document|dossier|chiffre|%|)/i.test(text);
  const hasConclusion = /(donc|en conclusion|on peut conclure|ainsi)/i.test(text);
  let adjusted = bundle.score + (hasStructure ? 0.2 : 0) + (hasExample ? 0.2 : 0) + (hasConclusion ? 0.1 : 0);
  adjusted = clamp(Math.round(adjusted * 10) / 10, 0, 10);

  const elements_reperes =
    bundle.missing.length > 0
      ? bundle.missing.slice(0, 3).map((w) => `Idée ou notion  mieux mobiliser : ${w}`)
      : (exercise.grille || []).slice(0, 2).filter(Boolean);

  return {
    score: adjusted,
    feedback: "Évaluation locale alignée sur le fond : idées attendues, structure et exemples.",
    points_forts: hasExample
      ? "Tu appuies déjà ta réponse avec des éléments concrets."
      : bundle.coverage >= 0.5
      ? "Plusieurs notions attendues sont abordées."
      : "Réponse à développer davantage.",
    a_ameliorer: bundle.missing.length
      ? `Renforce surtout : ${bundle.missing.slice(0, 5).join(", ")}.`
      : "Rends ton argumentation plus explicite et relie-la davantage aux critères de la grille.",
    elements_reperes,
    source: "local",
  };
}

export type MissionEvalMerge = MissionLocalEval | (Omit<MissionLocalEval, "source"> & { source: "ai" });

function sanitizeAiText(value: unknown, fallback: string): string {
  const s = decodeUnicodeEscapes(String(value || "").trim());
  return s.length ? s : fallback;
}

export function buildReliableMissionsEvaluation(
  local: MissionLocalEval,
  ai: Record<string, unknown> | null,
  exercise: CorrectionExerciseBase
): MissionEvalMerge {
  if (!ai) return local;

  const aiScoreRaw = Number(ai.score);
  const aiScore = Number.isFinite(aiScoreRaw) ? clamp(aiScoreRaw, 0, 10) : local.score;
  const aiFeedback = sanitizeAiText(ai.feedback, local.feedback);
  const aiPlus = sanitizeAiText(ai.points_forts, local.pointsForts);
  const aiMinus = sanitizeAiText(ai.points_faibles, local.pointsFaibles);
  const aiAnswer = sanitizeAiText(ai.proposition_reponse, "");
  const aiAnalyse = sanitizeAiText((ai as Record<string, unknown>).analyse_developpee, local.analyseDeveloppee);
  const aiConseils = sanitizeAiText((ai as Record<string, unknown>).conseils_progression, local.conseilsProgression);

  const deltaMax = 2.5;
  const minAllowed = clamp(local.score - deltaMax, 0, 10);
  const maxAllowed = clamp(local.score + deltaMax, 0, 10);
  const blendedScore = clamp(Math.round((local.score * 0.6 + aiScore * 0.4) * 10) / 10, minAllowed, maxAllowed);

  const fallbackAnswer = buildPerfectAnswerLocal(exercise);
  const safeAnswer = aiAnswer.length >= 80 && aiAnswer.length <= 4800 ? aiAnswer : fallbackAnswer;

  return {
    score: blendedScore,
    feedback: aiFeedback.length >= 8 ? aiFeedback : local.feedback,
    analyseDeveloppee: aiAnalyse.length >= 120 ? aiAnalyse : local.analyseDeveloppee,
    pointsForts: aiPlus.length >= 6 ? aiPlus : local.pointsForts,
    pointsFaibles: aiMinus.length >= 6 ? aiMinus : local.pointsFaibles,
    conseilsProgression: aiConseils.length >= 40 ? aiConseils : local.conseilsProgression,
    propositionReponse: safeAnswer,
    source: "ai",
  };
}

export function buildReliableObjectifBacEvaluation(
  local: ObjectifBacEvalResult,
  ai: Record<string, unknown> | null,
  _exercise: CorrectionExerciseBase
): ObjectifBacEvalResult {
  if (!ai) return local;

  const aiScoreRaw = Number(ai.score);
  const aiScore = Number.isFinite(aiScoreRaw) ? clamp(aiScoreRaw, 0, 10) : local.score;

  const deltaMax = 2.5;
  const minAllowed = clamp(local.score - deltaMax, 0, 10);
  const maxAllowed = clamp(local.score + deltaMax, 0, 10);
  const blendedScore = clamp(Math.round((local.score * 0.6 + aiScore * 0.4) * 10) / 10, minAllowed, maxAllowed);

  const aiFeedback = sanitizeAiText(ai.feedback, local.feedback);
  const aiPlus = sanitizeAiText(ai.points_forts, local.points_forts);
  const aiMinus = sanitizeAiText(ai.a_ameliorer, local.a_ameliorer);
  const aiElts = Array.isArray(ai.elements_reperes)
    ? (ai.elements_reperes as unknown[]).map((x) => decodeUnicodeEscapes(String(x)))
    : [];

  return {
    score: blendedScore,
    feedback: aiFeedback.length >= 8 ? aiFeedback : local.feedback,
    points_forts: aiPlus.length >= 6 ? aiPlus : local.points_forts,
    a_ameliorer: aiMinus.length >= 6 ? aiMinus : local.a_ameliorer,
    elements_reperes: aiElts.filter(Boolean).length ? aiElts.slice(0, 6) : local.elements_reperes,
    source: "ai",
  };
}

const IA_RULES_MISSIONS = `
Règles :
- Évalue le fond et les idées mobilises ; accepte les synonymes et reformulations fidles (pas besoin des mots exacts).
- Ne pénalise pas la forme si le contenu est correct ; reste bienveillant et précis.
- score entre 0 et 10 (nombre, entier ou décimal)
- feedback : synthèse courte et bienveillante
- analyse_developpee : dire clairement ce qui est juste et ce qui manque, sans juger la forme
- conseils_progression : actions simples sur le contenu
- points_forts / points_faibles : explicites
- proposition_reponse : réponse modèle complète (version attendue la plus proche d'une copie parfaite)
- aucun texte hors JSON`;

export function buildMissionsAIPrompt(exercise: CorrectionExerciseBase, studentAnswer: string): string {
  return `Tu es correcteur STMG (Sciences de Gestion). Retourne UNIQUEMENT un JSON valide :
{"score":number,"feedback":string,"analyse_developpee":string,"points_forts":string,"points_faibles":string,"conseils_progression":string,"proposition_reponse":string}

Exercice : ${exercise.title}
Consigne : ${exercise.consigne}
Support : ${exercise.support || "Aucun"}
Données (tableaux, rsum textuel) : ${stringifySupportTables(exercise.supportTables) || ""}
Questions : ${(exercise.questions || []).join(" | ")}
Notions referentiel chapitre : ${(exercise.referentielNotions || []).join(" | ") || "-"}
Competences attendues : ${(exercise.referentielCompetences || []).join(" | ") || "-"}
Correction modèle (référence pdagogique, ne pas recopier mot pour mot) : ${exercise.correctionModele || exercise.attendu}
Réponse élève : ${studentAnswer}
${IA_RULES_MISSIONS}`;
}

const IA_RULES_OBJECTIF_BAC = `
Règles :
- Évalue le fond : respect du verbe, notions, preuves et structure ; accepte synonymes et reformulations.
- score entre 0 et 10 (nombre)
- feedback : synthèse courte
- points_forts / a_ameliorer : explicites et orientés contenu
- elements_reperes : 2 à 6 courtes pistes (idées ou critères), pas une liste de mots isols
- aucun texte hors JSON`;

export function buildObjectifBacAIPrompt(exercise: CorrectionExerciseBase, studentAnswer: string): string {
  return `Tu es correcteur Bac STMG Management. Retourne UNIQUEMENT un JSON valide :
{"score":number,"feedback":string,"points_forts":string,"a_ameliorer":string,"elements_reperes":string[]}

Exercice : ${exercise.title}
Contexte : ${exercise.context || ""}
Consigne : ${exercise.consigne}
Grille : ${(exercise.grille || []).join(" | ")}
Rfrence partielle (repres, ne pas exiger la recopie) : ${exercise.correctionPartielle || ""}
Réponse élève : ${studentAnswer}
${IA_RULES_OBJECTIF_BAC}`;
}

const GEMINI_JSON_CONFIG = { temperature: 0.1, maxOutputTokens: 2048, responseMimeType: "application/json" as const };
const GROQ_MAX_TOKENS = 2048;

export async function callGeminiCorrection(prompt: string): Promise<Record<string, unknown> | null> {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
  if (!key) return null;
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: GEMINI_JSON_CONFIG,
      }),
    }
  );
  if (!response.ok) return null;
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part?.text || "").join("\n") || "";
  return parseJson(text);
}

export async function callGroqCorrection(prompt: string): Promise<Record<string, unknown> | null> {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) return null;
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: GROQ_MAX_TOKENS,
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return parseJson(data?.choices?.[0]?.message?.content || "");
}
