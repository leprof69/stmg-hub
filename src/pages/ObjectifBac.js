import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const COLORS = {
  dark: "#0F172A",
  card: "#111827",
  panel: "#1F2937",
  border: "#374151",
  blue: "#2563EB",
  green: "#059669",
  amber: "#D97706",
  red: "#DC2626",
  purple: "#7C3AED",
  text: "#E5E7EB",
  muted: "#9CA3AF",
};

const SECTION_CARD = {
  background: "linear-gradient(180deg, #111827 0%, #0B1220 100%)",
  border: `1px solid ${COLORS.border}`,
  borderRadius: 18,
  boxShadow: "0 10px 26px rgba(2, 6, 23, 0.35)",
};

const TWO_COL_GRID = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: 14,
};

const METHODO_RULES = {
  faire: [
    "Analyser d'abord la consigne : verbe d'action (presenter, analyser, montrer, justifier).",
    "Repondre avec une structure visible : idee + preuve tiree des documents + lien au cours.",
    "Citer des donnees precises (chiffres, faits, documents) et expliquer leur utilite.",
    "Mobiliser le vocabulaire de management/MSDGN (finalites, parties prenantes, performance, RSE...).",
    "Conclure chaque reponse par une mini-prise de position argumentee.",
  ],
  eviter: [
    "Paraphraser les documents sans analyser (copier-coller du dossier).",
    "Donner une opinion personnelle sans preuve documentaire.",
    "Faire des calculs sans unite, sans formule, ou sans interpretation managériale.",
    "Ignorer le verbe de consigne (par exemple decrire alors qu'on demande de justifier).",
    "Faire une reponse longue mais floue, sans notions de cours explicites.",
  ],
};

const STUDY_PLAN = [
  { label: "0h00 - 0h20", action: "Lecture active du cas + surlignage des infos cles." },
  { label: "0h20 - 0h35", action: "Tri des documents par dossier + brouillon des notions de cours." },
  { label: "0h35 - 3h30", action: "Traitement des questions (du plus rentable au plus long)." },
  { label: "3h30 - 3h50", action: "Relecture methode : verbe, preuve, notion, conclusion." },
  { label: "3h50 - 4h00", action: "Correction des oublis de calcul, unite, formulation." },
];

const EXERCISES = [
  {
    id: "exo-1",
    type: "Lecture de dossier",
    difficulty: "Fondamental",
    xp: 220,
    minChars: 120,
    title: "Identifier la question de gestion derriere un cas",
    context:
      "Cas type STMG : une entreprise se differencie par un modele e-commerce, une promesse RSE et une croissance rapide.",
    consigne:
      "En 6 a 8 lignes, formule la question de gestion principale et propose 2 sous-questions d'analyse.",
    attendus: [
      "Question centrale formulee sous forme de probleme de performance.",
      "Sous-question 1 sur le modele economique / strategie.",
      "Sous-question 2 sur impacts RH, ethiques ou environnementaux.",
    ],
    correction:
      "Exemple attendu : 'Comment l'entreprise peut-elle maintenir sa performance globale dans un marche concurrentiel tout en conservant son positionnement responsable ?' + sous-questions sur la rentabilite du modele et la creation de valeur RSE.",
  },
  {
    id: "exo-2",
    type: "Argumentation",
    difficulty: "Intermediaire",
    xp: 280,
    minChars: 180,
    title: "Repondre a 'Montrer que...'",
    context:
      "Le sujet demande : 'Montrer que la decision de diversification releve du management strategique.'",
    consigne:
      "Redige une reponse en 10-12 lignes avec 3 arguments, chacun appuye par une preuve issue des documents.",
    attendus: [
      "Argument 1 : decision de long terme avec engagement de ressources.",
      "Argument 2 : impact sur le positionnement concurrentiel.",
      "Argument 3 : prise de risque + coherence avec finalites.",
    ],
    correction:
      "Structure type : idee directrice, 3 paragraphes courts (idee + preuve + notion), mini-conclusion de validation de la these.",
  },
  {
    id: "exo-3",
    type: "Calcul + interpretation",
    difficulty: "Intermediaire",
    xp: 280,
    minChars: 110,
    title: "FRNG, BFR, tresorerie nette sans perte de points",
    context:
      "Donnees d'un cas reel STMG : ressources stables 1 880 922 ; emplois stables 403 726 ; actif circulant 3 124 251 ; passif circulant 3 205 666.",
    consigne:
      "Calcule FRNG, BFR, TN puis commente en 5 lignes la situation financiere.",
    attendus: [
      "FRNG = ressources stables - emplois stables = 1 477 196.",
      "BFR = actif circulant - passif circulant = -81 415.",
      "TN = FRNG - BFR = 1 558 611 + interpretation argumentee.",
    ],
    correction:
      "Lecture attendue : l'entreprise degage un FRNG positif, un BFR negatif (cycle d'exploitation qui finance une partie de l'activite), et une tresorerie nette confortable. Il faut relier ce resultat a la capacite de financer une diversification.",
  },
  {
    id: "exo-4",
    type: "Synthese",
    difficulty: "Exigeant",
    xp: 360,
    minChars: 260,
    title: "Question longue type RSE (15 lignes)",
    context:
      "Sujet type : 'Montrer que la mise en place d'une demarche RSE est creatrice de valeurs.'",
    consigne:
      "Produis une reponse en 15 lignes avec plan court (2 parties) et exemples d'organisations.",
    attendus: [
      "Valeur economique (image, fidelisation, differenciation, performance).",
      "Valeur sociale (motivation, QVT, inclusion, attractivite RH).",
      "Valeur societale/environnementale (legitimite, reduction externalites).",
    ],
    correction:
      "Attendu bac : une argumentation nuancee (benefices + limites/couts) et non un discours militant. Le correcteur valorise la capacite a relier RSE et performance globale.",
  },
];

const SOURCES = [
  { label: "CRCOM - Sujets d'examen MSDGN", url: "https://crcom.ac-versailles.fr/Sujets-d-examen-MSDGN" },
  { label: "CRCOM - Epreuve ecrite MSDGN", url: "https://crcom.ac-versailles.fr/Epreuve-ecrite-management-sciences-de-gestion-et-numerique" },
  { label: "Sujet officiel 2025 (cas Bebe Serein)", url: "https://crcom.ac-versailles.fr/IMG/pdf/stmg-spe-management-gestion-numerique-2025-metropole-sujet-officiel.pdf" },
  { label: "Sujetdebac - Annales MSGN", url: "https://www.sujetdebac.fr/annales/serie-stmg/spe-management-gestion-numerique/" },
  { label: "L'Etudiant - Sujet/corrige 2025", url: "https://www.letudiant.fr/bac/corriges-du-bac/article/sujets-corriges-stmg-management-sciences-de-gestion-et-numerique-bac-2025.html" },
];

const CONSEILS_DU_JOUR = [
  "Commence chaque question en reformulant la consigne avec le verbe attendu (presenter, analyser, justifier).",
  "Vise la structure 3 blocs : idee cle, preuve issue du document, lien avec une notion du cours.",
  "Pour chaque chiffre cite, ajoute une interpretation managériale en une phrase.",
  "Sur un 'montrer que', prends position des la 1re phrase puis demontre avec 2-3 arguments.",
  "Ne laisse aucune question vide : une reponse courte mais ciblee rapporte toujours des points.",
  "Pour les calculs, ecris formule + calcul + unite + commentaire : c'est la sequence qui securise les points.",
  "Utilise le vocabulaire STMG precis (finalites, parties prenantes, performance globale, RSE, avantage concurrentiel).",
  "Relis chaque reponse avec ce filtre : est-ce que je reponds vraiment au verbe de la consigne ?",
  "Quand tu cites un document, mentionne explicitement le fait utilise (donnee, tendance, citation courte).",
  "Conclue les longues reponses par une mini phrase de synthese qui repond directement a la problematique.",
];

const VERBE_QUIZ = [
  {
    verbe: "Analyser",
    question: "Quand la consigne demande 'Analyser', qu'attend surtout le correcteur ?",
    options: [
      "Recopier les documents en changeant quelques mots",
      "Decomposer la situation en elements cles puis expliquer leurs liens",
      "Donner uniquement son opinion personnelle",
      "Lister des notions sans explication",
    ],
    correctIndex: 1,
    astuce: "Analyser = decomposer + expliquer les relations entre les faits.",
  },
  {
    verbe: "Justifier",
    question: "Pour bien 'Justifier' une reponse, il faut surtout :",
    options: [
      "Donner des raisons et des preuves (documents + cours)",
      "Ecrire une phrase tres longue",
      "Repondre par oui/non",
      "Citer une definition hors sujet",
    ],
    correctIndex: 0,
    astuce: "Justifier = argument + preuve concrete.",
  },
  {
    verbe: "Comparer",
    question: "La consigne 'Comparer' implique de :",
    options: [
      "Parler d'un seul element en detail",
      "Dire uniquement les points communs",
      "Montrer ressemblances et differences de facon structuree",
      "Faire un calcul",
    ],
    correctIndex: 2,
    astuce: "Comparer = ressemblances ET differences.",
  },
  {
    verbe: "Montrer",
    question: "Si la consigne dit 'Montrer que...', la meilleure approche est :",
    options: [
      "Prendre position puis la prouver avec 2-3 arguments",
      "Rester neutre sans conclure",
      "Donner un exemple sans expliquer",
      "Reecrire l'enonce",
    ],
    correctIndex: 0,
    astuce: "Montrer = demontrer une these, pas decrire vaguement.",
  },
];

const DEFIS_FLASH = [
  {
    theme: "Management",
    type: "Defi",
    consigne: "En 5 lignes, explique en quoi une decision releve du management strategique.",
    repere: "Long terme + engagement de ressources + impact sur le positionnement.",
  },
  {
    theme: "Droit",
    type: "Defi",
    consigne: "Distingue en 4 lignes une obligation de moyen et une obligation de resultat.",
    repere: "Moyen = moyens raisonnables ; resultat = objectif atteint obligatoire.",
  },
  {
    theme: "SDGN",
    type: "Action",
    consigne: "Donne un indicateur de performance et propose une interpretation utile pour un manager.",
    repere: "Exemple : taux de marge, delai moyen, satisfaction client.",
  },
  {
    theme: "Economie",
    type: "Defi",
    consigne: "En 4 lignes, relie inflation et pouvoir d'achat d'un menage.",
    repere: "Si les prix augmentent plus vite que le revenu reel, pouvoir d'achat diminue.",
  },
  {
    theme: "Methode 15 lignes",
    type: "Action",
    consigne: "Propose un mini-plan en 2 parties pour traiter une question longue.",
    repere: "Partie 1 constat/causes ; Partie 2 solutions/limites.",
  },
];

const ORGA_CRITERES = [
  "Type d'organisation (entreprise privee, publique, OBNL...)",
  "Taille justifiee (effectif ou CA, avec classification explicite)",
  "Statut / forme juridique",
  "Champ d'action (geographique + secteur / metier)",
  "Ressources (humaines, materielle, immaterielle, financiere)",
  "Finalite (economique, sociale, sociétale, service public...)",
  "Objectifs quantifies et dates",
];

const DECISION_TRAINER = [
  {
    cas: "La direction decide de lancer une nouvelle gamme et d'entrer sur un nouveau marche europeen.",
    correct: "strategique",
    explication: "Long terme, risque eleve, impact global et engagement de ressources majeures.",
  },
  {
    cas: "Le responsable RH planifie une campagne de recrutement sur 6 mois pour soutenir la croissance.",
    correct: "tactique",
    explication: "Moyen terme, allocation de ressources sur une fonction de l'entreprise.",
  },
  {
    cas: "Le chef d'equipe reorganise le planning de la semaine pour absorber un pic de commandes.",
    correct: "operationnelle",
    explication: "Gestion courante, court terme, decision reversible et locale.",
  },
  {
    cas: "Le comite executif valide le rachat d'un concurrent regional.",
    correct: "strategique",
    explication: "Decision de direction generale, irreversible, qui engage l'avenir global.",
  },
  {
    cas: "Le service logistique choisit un nouveau logiciel interne pour reduire les retards de livraison.",
    correct: "tactique",
    explication: "Decision fonctionnelle de moyen terme qui optimise les ressources.",
  },
];

const PLAN_8_SEMAINES = [
  { semaine: "S1", focus: "Verbes directeurs et lecture des consignes", mission: "20 consignes classees + 1 mini quiz/jour." },
  { semaine: "S2", focus: "Caracteriser une organisation", mission: "3 cas complets avec grille type bac." },
  { semaine: "S3", focus: "Decisions, styles de direction, parties prenantes", mission: "2 etudes de cas + argumentation courte." },
  { semaine: "S4", focus: "Diagnostic strategique interne/externe", mission: "2 SWOT + 1 justification de strategie." },
  { semaine: "S5", focus: "Performance et indicateurs", mission: "Calculs + commentaires managériaux chronometrés." },
  { semaine: "S6", focus: "Question longue 15 lignes", mission: "4 productions avec methode LEGO." },
  { semaine: "S7", focus: "Sujet type bac en condition reelle", mission: "Simulation 4h + correction guidee." },
  { semaine: "S8", focus: "Remediation ciblee et memorisation active", mission: "Reprise des erreurs + fiches ultra-courtes." },
];

const NOTIONS_FLASH = [
  "Diagnostic interne = forces/faiblesses ; externe = opportunites/menaces.",
  "Avantage concurrentiel : produit, marche ou technologie (toujours temporaire).",
  "Style de direction (Likert) : autoritaire, paternaliste, consultatif, participatif.",
  "Probleme de management : le nommer clairement puis expliquer ses consequences.",
  "Performance globale : economique, sociale, environnementale, financiere.",
];

const AUTOEVAL_ITEMS = [
  { id: "q1", section: "Prise en main du sujet", text: "Je lis d'abord la presentation de l'organisation et la question de management principale." },
  { id: "q2", section: "Prise en main du sujet", text: "Je lis toutes les questions des 3 dossiers avant de commencer a rediger." },
  { id: "q3", section: "Preparation dossier", text: "Avant les documents, j'entoure les verbes directeurs et je surligne les notions visees." },
  { id: "q4", section: "Preparation dossier", text: "Avant les documents, je note au brouillon les mots-cles de cours utiles." },
  { id: "q5", section: "Exploitation documents", text: "Je fais une lecture active (surlignage par question + annotations en marge)." },
  { id: "q6", section: "Redaction", text: "Pour les verbes d'analyse, je reponds en AEI (Argument - Explication - Illustration)." },
  { id: "q7", section: "Redaction", text: "Pour la question en 15 lignes, je fais au moins 3 arguments + intro + conclusion." },
  { id: "q8", section: "Calculs", text: "Je pose formule + application numerique + resultat + interpretation." },
  { id: "q9", section: "Presentation copie", text: "J'indique clairement dossier, numero de question, et j'aere ma copie." },
  { id: "q10", section: "Presentation copie", text: "Je me relis a la fin (fautes, oublis, hors-sujet)." },
];

const PROTOCOLE_JOUR_J = [
  { id: "step1", timing: "0-10 min", action: "Lire la situation globale + surligner la question de management centrale." },
  { id: "step2", timing: "10-20 min", action: "Lire toutes les questions, entourer les verbes directeurs, repérer notions." },
  { id: "step3", timing: "20-35 min", action: "Classer les documents par dossier et noter au brouillon les mots-cles de cours." },
  { id: "step4", timing: "35-200 min", action: "Traiter les questions dans l'ordre avec AEI + preuve documentaire." },
  { id: "step5", timing: "200-225 min", action: "Faire les calculs complets (formule, resultat, interpretation)." },
  { id: "step6", timing: "225-240 min", action: "Relecture finale ciblee: verbes, notion, preuve, conclusion, orthographe." },
];

const EXAM_PHASES = [
  { label: "Lecture globale", durationMin: 20, color: "#2563EB" },
  { label: "Preparation brouillon", durationMin: 15, color: "#7C3AED" },
  { label: "Traitement des dossiers", durationMin: 175, color: "#059669" },
  { label: "Calculs + verification", durationMin: 25, color: "#D97706" },
  { label: "Relecture finale", durationMin: 5, color: "#DC2626" },
];

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const getConseilIndexDuJour = (uid = "invite") => {
  const seed = `${getTodayKey()}-${uid}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % CONSEILS_DU_JOUR.length;
};

const formatSeconds = (totalSec) => {
  const safe = Math.max(0, Number(totalSec) || 0);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const REFERENTIEL_METHODO = [
  "Toujours repondre au verbe directeur demande.",
  "S'appuyer sur les notions de cours et sur des preuves issues des documents.",
  "Structurer la reponse clairement (idee, explication, illustration).",
  "Pour les calculs: formule, application numerique, resultat, interpretation.",
  "Conclure les questions longues avec une prise de position claire.",
];

const normalizeText = (text = "") => String(text)
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9\s]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const getTokens = (text = "") => normalizeText(text).split(" ").filter((t) => t.length >= 4);

const buildExpectedTokenSet = (exercise) => {
  const source = `${exercise.consigne || ""} ${exercise.attendus?.join(" ") || ""} ${exercise.correction || ""}`;
  return new Set(getTokens(source));
};

const extractReferenceHints = (exercise, limit = 3) => {
  const hints = [];
  if (Array.isArray(exercise.attendus) && exercise.attendus.length) {
    for (const attendu of exercise.attendus.slice(0, limit)) {
      hints.push(attendu);
    }
  }
  if (hints.length < limit && exercise.correction) {
    const sentences = exercise.correction.split(/(?<=[.!?])\s+/).map((s) => s.trim()).filter(Boolean);
    for (const sentence of sentences) {
      if (hints.length >= limit) break;
      if (!hints.includes(sentence)) hints.push(sentence);
    }
  }
  return hints.slice(0, limit);
};

const evaluateLocally = (exercise, answer) => {
  const trimmed = String(answer || "").trim();
  if (!trimmed) {
    return {
      score: 0,
      feedback: "Reponse vide: impossible a corriger.",
      points_forts: "Aucun element exploitable pour l'instant.",
      a_ameliorer: "Commence par une reponse courte mais structuree.",
      elements_reperes: extractReferenceHints(exercise),
      source: "local",
    };
  }

  const minChars = Math.max(80, Number(exercise.minChars || 120));
  const lengthRatio = Math.min(1, trimmed.length / minChars);
  const expected = buildExpectedTokenSet(exercise);
  const answerTokens = new Set(getTokens(trimmed));
  let overlap = 0;
  for (const token of answerTokens) {
    if (expected.has(token)) overlap += 1;
  }
  const tokenRatio = expected.size ? overlap / Math.max(8, Math.min(30, expected.size)) : 0;

  const hasStructure = /(\n|^-|•|1\.)/m.test(trimmed);
  const hasJustification = /(par exemple|car |en effet|document|dossier|chiffre|%|€)/i.test(trimmed);
  const hasConclusion = /(donc|en conclusion|on peut conclure|ainsi)/i.test(trimmed);

  let score = 2
    + (lengthRatio * 3.2)
    + (Math.min(1, tokenRatio) * 3.5)
    + (hasStructure ? 0.8 : 0)
    + (hasJustification ? 0.8 : 0)
    + (hasConclusion ? 0.7 : 0);

  score = Math.max(0, Math.min(10, Math.round(score)));

  return {
    score,
    feedback: "Evaluation locale basee sur structure, notions attendues et qualite argumentative.",
    points_forts: hasJustification
      ? "Tu mobilises deja des justifications, ce qui est central au bac."
      : "Ta reponse est amorcee et exploitable.",
    a_ameliorer: hasStructure
      ? "Ajoute encore plus de precision documentaire et de vocabulaire de cours."
      : "Structure davantage en blocs (idee, explication, illustration) pour gagner des points.",
    elements_reperes: extractReferenceHints(exercise),
    source: "local",
  };
};

const parseCorrectionJson = (raw = "") => {
  const clean = String(raw).replace(/```json|```/gi, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(clean.slice(start, end + 1));
  } catch {
    return null;
  }
};

const callGeminiCorrection = async (prompt) => {
  const key = process.env.REACT_APP_GEMINI_API_KEY;
  if (!key) return null;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 700, responseMimeType: "application/json" },
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || "").join("\n") || "";
  return parseCorrectionJson(text);
};

const callGroqCorrection = async (prompt) => {
  const key = process.env.REACT_APP_GROQ_API_KEY;
  if (!key) return null;
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 650,
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return parseCorrectionJson(data?.choices?.[0]?.message?.content || "");
};

function ExerciseCard({ exercise, status, onClaimXP, onEvaluateResponse }) {
  const [draft, setDraft] = useState("");
  const [showCorrection, setShowCorrection] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const responseLength = draft.trim().length;
  const alreadyClaimedToday = status?.lastClaimDate === getTodayKey();
  const canClaim = responseLength >= exercise.minChars && !alreadyClaimedToday && !loading;
  const canEvaluate = responseLength >= Math.max(80, Math.floor(exercise.minChars * 0.6)) && !isEvaluating;

  const handleClaim = async () => {
    if (!canClaim) return;
    setLoading(true);
    try {
      await onClaimXP(exercise.id, exercise.xp);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!canEvaluate) return;
    setIsEvaluating(true);
    try {
      const result = await onEvaluateResponse(exercise, draft);
      setEvaluation(result);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        padding: 20,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span
          style={{
            background: "#1D4ED8",
            color: "white",
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {exercise.type}
        </span>
        <span
          style={{
            background: "#14532D",
            color: "#DCFCE7",
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          +{exercise.xp} XP
        </span>
        <span
          style={{
            background: "#374151",
            color: "#E5E7EB",
            padding: "4px 10px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {exercise.difficulty}
        </span>
      </div>

      <h3 style={{ color: "white", margin: 0, fontSize: "1.2rem" }}>{exercise.title}</h3>
      <p style={{ color: COLORS.muted, margin: 0, lineHeight: 1.6 }}>{exercise.context}</p>
      <p style={{ color: COLORS.text, margin: 0, lineHeight: 1.6 }}>
        <strong>Consigne :</strong> {exercise.consigne}
      </p>

      <div style={{ background: COLORS.panel, borderRadius: 14, padding: 14, border: `1px solid ${COLORS.border}` }}>
        <p style={{ color: "#93C5FD", margin: "0 0 8px", fontWeight: 700 }}>Ce que le correcteur attend</p>
        <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.65 }}>
          {exercise.attendus.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>

      <textarea
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="Ecris ta reponse ici (entrainement libre)..."
        style={{
          width: "100%",
          minHeight: 120,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
          background: "#0B1220",
          color: "white",
          padding: 12,
          fontSize: 14,
          lineHeight: 1.5,
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
      <p style={{ margin: "-4px 0 0", color: COLORS.muted, fontSize: 12 }}>
        Minimum recommande pour validation XP : {exercise.minChars} caracteres.
      </p>

      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button
          onClick={handleEvaluate}
          disabled={!canEvaluate}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            background: canEvaluate ? "#7C3AED" : "#374151",
            color: canEvaluate ? "white" : "#9CA3AF",
            fontWeight: 700,
            cursor: canEvaluate ? "pointer" : "not-allowed",
          }}
        >
          {isEvaluating ? "Correction en cours..." : "Corriger ma reponse (IA + bareme)"}
        </button>
        <button
          onClick={handleClaim}
          disabled={!canClaim}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            background: canClaim ? "#2563EB" : "#374151",
            color: canClaim ? "white" : "#9CA3AF",
            fontWeight: 700,
            cursor: canClaim ? "pointer" : "not-allowed",
          }}
        >
          {loading ? "Validation..." : alreadyClaimedToday ? "XP deja gagne aujourd'hui" : `Valider et gagner ${exercise.xp} XP`}
        </button>
        <button
          onClick={() => setShowCorrection((value) => !value)}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "10px 14px",
            background: showCorrection ? COLORS.red : COLORS.green,
            color: "white",
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          {showCorrection ? "Masquer la correction guidee" : "Afficher la correction guidee"}
        </button>
      </div>
      {evaluation && (
        <div style={{ background: "#0B1E34", border: "1px solid #2563EB", borderRadius: 14, padding: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <p style={{ margin: 0, color: "#93C5FD", fontWeight: 800 }}>Resultat correction</p>
            <span style={{ background: evaluation.score >= 7 ? "#059669" : evaluation.score >= 5 ? "#D97706" : "#DC2626", color: "white", borderRadius: 999, padding: "5px 12px", fontWeight: 800 }}>
              {evaluation.score}/10
            </span>
          </div>
          <p style={{ margin: "8px 0 0", color: "#DBEAFE", lineHeight: 1.5 }}>
            <strong>Feedback :</strong> {evaluation.feedback}
          </p>
          <p style={{ margin: "6px 0 0", color: "#86EFAC", lineHeight: 1.5 }}>
            <strong>Points forts :</strong> {evaluation.points_forts}
          </p>
          <p style={{ margin: "6px 0 0", color: "#FDE68A", lineHeight: 1.5 }}>
            <strong>A ameliorer :</strong> {evaluation.a_ameliorer}
          </p>
          {Array.isArray(evaluation.elements_reperes) && evaluation.elements_reperes.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <p style={{ margin: "0 0 4px", color: "#BFDBFE", fontWeight: 700 }}>Elements attendus (partiels)</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#E5E7EB", lineHeight: 1.6 }}>
                {evaluation.elements_reperes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          )}
          <p style={{ margin: "8px 0 0", color: "#9CA3AF", fontSize: 12 }}>
            Moteur: {evaluation.source === "ai" ? "IA + garde-fous locaux" : "Evaluation locale (mode secours)"}
          </p>
        </div>
      )}
      {alreadyClaimedToday && (
        <p style={{ margin: 0, color: "#86EFAC", fontSize: 12 }}>
          Bonus de cet exercice deja recupere aujourd'hui. Tu peux continuer a t'entrainer.
        </p>
      )}

      {showCorrection && (
        <div style={{ background: "#052E16", border: "1px solid #166534", borderRadius: 14, padding: 14 }}>
          <p style={{ color: "#86EFAC", margin: "0 0 8px", fontWeight: 700 }}>Correction guidee</p>
          <p style={{ color: "#DCFCE7", margin: 0, lineHeight: 1.65 }}>{exercise.correction}</p>
        </div>
      )}
    </div>
  );
}

export default function ObjectifBac({ profil, onXPGagne }) {
  const [selectedType, setSelectedType] = useState("Tous");
  const [claimState, setClaimState] = useState({});
  const [banner, setBanner] = useState(null);
  const [conseilDuJour, setConseilDuJour] = useState("");
  const [coffreOuvert, setCoffreOuvert] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizScore, setQuizScore] = useState({ ok: 0, total: 0 });
  const [defiActuel, setDefiActuel] = useState(null);
  const [check15Lignes, setCheck15Lignes] = useState({
    reformulation: false,
    planVisible: false,
    preuvesDocs: false,
    notionsCours: false,
    miniConclusion: false,
  });
  const [orgaChecklist, setOrgaChecklist] = useState(() =>
    ORGA_CRITERES.reduce((acc, _, index) => ({ ...acc, [index]: false }), {})
  );
  const [decisionIndex, setDecisionIndex] = useState(0);
  const [decisionChoice, setDecisionChoice] = useState(null);
  const [decisionFeedback, setDecisionFeedback] = useState(null);
  const [decisionScore, setDecisionScore] = useState({ ok: 0, total: 0 });
  const [semainesValidees, setSemainesValidees] = useState({});
  const [autoEvalAnswers, setAutoEvalAnswers] = useState({});
  const [jourJState, setJourJState] = useState(() =>
    PROTOCOLE_JOUR_J.reduce((acc, step) => ({ ...acc, [step.id]: false }), {})
  );
  const [modeExamRunning, setModeExamRunning] = useState(false);
  const [examRemainingSec, setExamRemainingSec] = useState(4 * 60 * 60);

  const types = useMemo(() => ["Tous", ...new Set(EXERCISES.map((exercise) => exercise.type))], []);
  const filteredExercises = useMemo(
    () => EXERCISES.filter((exercise) => selectedType === "Tous" || exercise.type === selectedType),
    [selectedType]
  );
  const potentialXp = useMemo(() => EXERCISES.reduce((sum, exercise) => sum + exercise.xp, 0), []);

  useEffect(() => {
    const loadProgress = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) return;
        const progress = snap.data().objectifBacProgress || {};
        const claims = progress.claims || {};
        setClaimState(claims);
        if (progress.autoEvalAnswers) setAutoEvalAnswers(progress.autoEvalAnswers);
        if (progress.jourJState) setJourJState(progress.jourJState);
        if (progress.semainesValidees) setSemainesValidees(progress.semainesValidees);
        if (progress.check15Lignes) setCheck15Lignes(progress.check15Lignes);
        if (progress.orgaChecklist) setOrgaChecklist(progress.orgaChecklist);
        if (typeof progress.examRemainingSec === "number") setExamRemainingSec(progress.examRemainingSec);
      } catch (error) {
        console.error("Impossible de charger la progression Objectif Bac", error);
      }
    };
    loadProgress();
  }, []);

  useEffect(() => {
    const uid = auth.currentUser?.uid || "invite";
    const index = getConseilIndexDuJour(uid);
    setConseilDuJour(CONSEILS_DU_JOUR[index]);
    setCoffreOuvert(false);
  }, []);

  useEffect(() => {
    if (!modeExamRunning) return undefined;
    const interval = setInterval(() => {
      setExamRemainingSec((prev) => {
        if (prev <= 1) {
          setModeExamRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [modeExamRunning]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return undefined;
    const timeout = setTimeout(async () => {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          objectifBacProgress: {
            claims: claimState,
            autoEvalAnswers,
            jourJState,
            semainesValidees,
            check15Lignes,
            orgaChecklist,
            examRemainingSec,
          },
        });
      } catch (error) {
        console.error("Sauvegarde progression Objectif Bac impossible", error);
      }
    }, 900);
    return () => clearTimeout(timeout);
  }, [claimState, autoEvalAnswers, jourJState, semainesValidees, check15Lignes, orgaChecklist, examRemainingSec]);

  const handleClaimXP = async (exerciseId, xpAmount) => {
    const user = auth.currentUser;
    if (!user) return;

    const today = getTodayKey();
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;

    const data = snap.data();
    const previousClaims = data.objectifBacProgress?.claims || {};
    if (previousClaims?.[exerciseId]?.lastClaimDate === today) {
      setBanner({ type: "error", text: "XP deja gagne pour cet exercice aujourd'hui." });
      return;
    }

    const nextXp = (data.xp || 0) + xpAmount;
    const nextClaims = {
      ...previousClaims,
      [exerciseId]: {
        lastClaimDate: today,
        totalClaims: (previousClaims?.[exerciseId]?.totalClaims || 0) + 1,
      },
    };

    await updateDoc(userRef, {
      xp: nextXp,
      objectifBacProgress: {
        claims: nextClaims,
      },
    });

    setClaimState(nextClaims);
    setBanner({ type: "success", text: `+${xpAmount} XP ajoutes !` });
    if (onXPGagne) onXPGagne();
  };

  const handleEvaluateResponse = async (exercise, answer) => {
    const local = evaluateLocally(exercise, answer);
    const prompt = `Tu es correcteur bac STMG MSGN.
Retourne UNIQUEMENT un JSON valide:
{"score":number,"feedback":string,"points_forts":string,"a_ameliorer":string,"elements_reperes":string[]}

Contexte de correction:
- Exercice: ${exercise.title}
- Consigne: ${exercise.consigne}
- Attendus: ${exercise.attendus.join(" | ")}
- Correction guidee de reference: ${exercise.correction}
- Referentiel methodologique: ${REFERENTIEL_METHODO.join(" | ")}

Reponse eleve:
${answer}

Contraintes:
- score entier entre 0 et 10
- elements_reperes: 2 ou 3 elements courts maximum
- pas de texte hors JSON`;

    let ai = null;
    try {
      ai = await callGeminiCorrection(prompt);
      if (!ai) ai = await callGroqCorrection(prompt);
    } catch {
      ai = null;
    }

    if (!ai) return local;

    const aiScore = Number(ai.score);
    const score = Number.isFinite(aiScore)
      ? Math.max(0, Math.min(10, Math.round((aiScore * 0.65) + (local.score * 0.35))))
      : local.score;

    return {
      score,
      feedback: String(ai.feedback || local.feedback),
      points_forts: String(ai.points_forts || local.points_forts),
      a_ameliorer: String(ai.a_ameliorer || local.a_ameliorer),
      elements_reperes: Array.isArray(ai.elements_reperes) && ai.elements_reperes.length
        ? ai.elements_reperes.slice(0, 3)
        : local.elements_reperes,
      source: "ai",
    };
  };

  const currentQuiz = VERBE_QUIZ[quizIndex];

  const validerQuiz = () => {
    if (quizChoice === null) return;
    const isGood = quizChoice === currentQuiz.correctIndex;
    setQuizFeedback(isGood ? "Bonne reponse." : "Pas encore.");
    setQuizScore((prev) => ({ ok: prev.ok + (isGood ? 1 : 0), total: prev.total + 1 }));
  };

  const questionSuivanteQuiz = () => {
    setQuizIndex((prev) => (prev + 1) % VERBE_QUIZ.length);
    setQuizChoice(null);
    setQuizFeedback(null);
  };

  const tirerDefi = () => {
    const index = Math.floor(Math.random() * DEFIS_FLASH.length);
    setDefiActuel(DEFIS_FLASH[index]);
  };

  const currentDecision = DECISION_TRAINER[decisionIndex];
  const orgaProgress = Object.values(orgaChecklist).filter(Boolean).length;
  const orgaTotal = ORGA_CRITERES.length;
  const jourJProgress = Object.values(jourJState).filter(Boolean).length;
  const examElapsedSec = (4 * 60 * 60) - examRemainingSec;
  const examPhaseIndex = useMemo(() => {
    let cumulative = 0;
    for (let i = 0; i < EXAM_PHASES.length; i++) {
      cumulative += EXAM_PHASES[i].durationMin * 60;
      if (examElapsedSec < cumulative) return i;
    }
    return EXAM_PHASES.length - 1;
  }, [examElapsedSec]);
  const examProgressPercent = Math.max(0, Math.min(100, Math.round((examElapsedSec / (4 * 60 * 60)) * 100)));

  const autoEvalStats = useMemo(() => {
    const base = { toujours: 0, pas_toujours: 0, jamais: 0 };
    for (const id of Object.keys(autoEvalAnswers)) {
      const value = autoEvalAnswers[id];
      if (value && Object.hasOwn(base, value)) base[value] += 1;
    }
    return base;
  }, [autoEvalAnswers]);
  const autoEvalTotal = AUTOEVAL_ITEMS.length;
  const autoEvalDone = Object.keys(autoEvalAnswers).length === autoEvalTotal;

  const autoEvalDiagnostic = useMemo(() => {
    if (!autoEvalDone) return null;
    if (autoEvalStats.toujours >= autoEvalStats.pas_toujours && autoEvalStats.toujours >= autoEvalStats.jamais) {
      return {
        niveau: "BRAVO",
        color: "#86EFAC",
        text: "Methodologie globalement acquise. Continue a automatiser les etapes de brouillon + relecture.",
      };
    }
    if (autoEvalStats.pas_toujours >= autoEvalStats.jamais) {
      return {
        niveau: "CA VA LE FAIRE",
        color: "#FCD34D",
        text: "Tu as les bases mais pas encore les automatismes. Fais 1 sujet complet chrono par semaine.",
      };
    }
    return {
      niveau: "PLAN DE SAUVETAGE",
      color: "#FCA5A5",
      text: "Tu dois ritualiser les etapes. Objectif: appliquer le protocole jour J sur chaque entrainement ecrit.",
    };
  }, [autoEvalDone, autoEvalStats]);

  const recommandationsPrioritaires = useMemo(() => {
    const tips = [];
    const answers = autoEvalAnswers;
    const get = (id) => answers[id];
    if (get("q3") === "jamais" || get("q4") === "jamais") {
      tips.push("Avant chaque dossier: entoure les verbes directeurs et note 4-5 notions de cours au brouillon.");
    }
    if (get("q6") !== "toujours") {
      tips.push("Passe tes reponses d'analyse en mode AEI: Argument, Explication, Illustration.");
    }
    if (get("q8") !== "toujours") {
      tips.push("Pour chaque calcul: formule, application numerique, resultat puis interpretation.");
    }
    if (get("q10") !== "toujours") {
      tips.push("Garde 10 minutes obligatoires de relecture finale pour verifier verbes, notions et hors-sujet.");
    }
    if (!tips.length) {
      tips.push("Tu es sur une bonne dynamique: fais 1 sujet complet chrono/semaine pour maintenir le niveau.");
    }
    return tips.slice(0, 4);
  }, [autoEvalAnswers]);

  const validerDecision = () => {
    if (!decisionChoice) return;
    const isGood = decisionChoice === currentDecision.correct;
    setDecisionFeedback(isGood ? "Bonne qualification." : "Qualification a corriger.");
    setDecisionScore((prev) => ({ ok: prev.ok + (isGood ? 1 : 0), total: prev.total + 1 }));
  };

  const prochainDecisionCas = () => {
    setDecisionIndex((prev) => (prev + 1) % DECISION_TRAINER.length);
    setDecisionChoice(null);
    setDecisionFeedback(null);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #1E1B4B 0%, #0F172A 45%, #020617 100%)",
        color: "white",
        padding: "24px 16px 34px",
      }}
    >
      <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", flexDirection: "column", gap: 20 }}>
        {banner && (
          <div
            style={{
              borderRadius: 12,
              padding: "10px 14px",
              background: banner.type === "success" ? "#14532D" : "#7F1D1D",
              border: `1px solid ${banner.type === "success" ? "#16A34A" : "#DC2626"}`,
              color: "white",
              fontWeight: 700,
              boxShadow: "0 8px 22px rgba(0,0,0,0.35)",
            }}
          >
            {banner.text}
          </div>
        )}
        <section
          style={{
            borderRadius: 24,
            padding: "28px 24px",
            background: "linear-gradient(135deg, #1E3A8A 0%, #312E81 45%, #581C87 100%)",
            border: "1px solid #6366F1",
            boxShadow: "0 16px 34px rgba(49, 46, 129, 0.45)",
          }}
        >
          <h1 style={{ margin: "0 0 8px", fontSize: "2rem" }}>Objectif Bac - MSDGN (Methodologie)</h1>
          <p style={{ margin: 0, color: "#DDD6FE", lineHeight: 1.65 }}>
            Entrainement 100% oriente methode de l'epreuve : comprendre la consigne, exploiter les documents, mobiliser les notions
            de cours, puis justifier proprement comme attendu au bac.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 14 }}>
            <span style={{ background: "rgba(255,255,255,0.2)", borderRadius: 999, padding: "6px 12px", fontWeight: 700 }}>
              XP actuel : {profil?.xp || 0}
            </span>
            <span style={{ background: "rgba(22,163,74,0.25)", borderRadius: 999, padding: "6px 12px", fontWeight: 700 }}>
              Potentiel / jour : +{potentialXp} XP
            </span>
          </div>
        </section>

        <section style={{ ...SECTION_CARD, padding: 18 }}>
          <p style={{ margin: "0 0 10px", color: "#93C5FD", fontWeight: 800 }}>Mode Examen 4h (simulation reelle)</p>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <p style={{ margin: 0, color: "#BFDBFE", fontSize: 13, fontWeight: 700 }}>
                Phase actuelle: {EXAM_PHASES[examPhaseIndex].label}
              </p>
              <p style={{ margin: "3px 0 0", color: "white", fontSize: 28, fontWeight: 800 }}>
                {formatSeconds(examRemainingSec)}
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                onClick={() => setModeExamRunning((v) => !v)}
                style={{ border: "none", borderRadius: 10, padding: "9px 12px", background: modeExamRunning ? "#DC2626" : "#2563EB", color: "white", fontWeight: 700, cursor: "pointer" }}
              >
                {modeExamRunning ? "Pause" : "Demarrer"}
              </button>
              <button
                onClick={() => {
                  setModeExamRunning(false);
                  setExamRemainingSec(4 * 60 * 60);
                }}
                style={{ border: "none", borderRadius: 10, padding: "9px 12px", background: "#374151", color: "white", fontWeight: 700, cursor: "pointer" }}
              >
                Reinitialiser
              </button>
            </div>
          </div>
          <div style={{ marginTop: 10, height: 10, borderRadius: 999, background: "#1F2937", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${examProgressPercent}%`,
                borderRadius: 999,
                background: `linear-gradient(90deg, #2563EB, ${EXAM_PHASES[examPhaseIndex].color})`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
          <p style={{ margin: "7px 0 0", color: "#9CA3AF", fontSize: 12 }}>
            Progression simulation: {examProgressPercent}% du temps epreuve.
          </p>
        </section>

        <section style={{ ...SECTION_CARD, padding: 18 }}>
          <p style={{ margin: "0 0 10px", color: "#A7F3D0", fontWeight: 800 }}>Priorites personnalisees</p>
          <p style={{ margin: "0 0 10px", color: COLORS.text }}>
            Recommandations automatiques basees sur tes reponses d'autoevaluation.
          </p>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#DCFCE7", lineHeight: 1.65 }}>
            {recommandationsPrioritaires.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        </section>

        <section style={{ ...SECTION_CARD, padding: 18 }}>
          <p style={{ margin: "0 0 10px", color: "#FDE68A", fontWeight: 800 }}>Coffre-fort Methodo du jour</p>
          <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setCoffreOuvert((value) => !value)}
              style={{
                border: "none",
                borderRadius: 16,
                cursor: "pointer",
                padding: "14px 18px",
                background: coffreOuvert ? "linear-gradient(135deg, #065F46, #047857)" : "linear-gradient(135deg, #92400E, #B45309)",
                color: "white",
                fontWeight: 800,
                minWidth: 190,
                boxShadow: coffreOuvert ? "0 8px 24px rgba(6,95,70,0.45)" : "0 8px 24px rgba(146,64,14,0.45)",
              }}
            >
              {coffreOuvert ? "🔓 Coffre ouvert" : "🔐 Ouvrir le coffre"}
            </button>
            <p style={{ margin: 0, color: COLORS.muted, fontSize: 13 }}>
              1 conseil stable par jour pour mieux memoriser la methode.
            </p>
          </div>
          {coffreOuvert && (
            <div style={{ marginTop: 12, background: "#1E293B", border: "1px solid #334155", borderRadius: 12, padding: 14 }}>
              <p style={{ margin: "0 0 6px", color: "#FCD34D", fontWeight: 700 }}>💡 Conseil du jour</p>
              <p style={{ margin: 0, color: "#E2E8F0", lineHeight: 1.6 }}>{conseilDuJour}</p>
            </div>
          )}
        </section>

        <section style={TWO_COL_GRID}>
          <div style={{ ...SECTION_CARD, padding: 16 }}>
            <p style={{ margin: "0 0 10px", color: "#93C5FD", fontWeight: 800 }}>Quiz verbes directeurs</p>
            <p style={{ margin: "0 0 10px", color: COLORS.text, lineHeight: 1.5 }}>
              <strong>{currentQuiz.verbe}</strong> - {currentQuiz.question}
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {currentQuiz.options.map((option, index) => (
                <button
                  key={option}
                  onClick={() => setQuizChoice(index)}
                  style={{
                    border: `1px solid ${quizChoice === index ? "#60A5FA" : COLORS.border}`,
                    background: quizChoice === index ? "#1E3A8A" : COLORS.panel,
                    color: "white",
                    borderRadius: 10,
                    padding: "10px 12px",
                    textAlign: "left",
                    cursor: "pointer",
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
              <button
                onClick={validerQuiz}
                disabled={quizChoice === null}
                style={{
                  border: "none",
                  borderRadius: 10,
                  padding: "8px 12px",
                  cursor: quizChoice === null ? "not-allowed" : "pointer",
                  background: quizChoice === null ? "#374151" : "#2563EB",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                Valider
              </button>
              <button
                onClick={questionSuivanteQuiz}
                style={{ border: "none", borderRadius: 10, padding: "8px 12px", background: "#7C3AED", color: "white", fontWeight: 700, cursor: "pointer" }}
              >
                Question suivante
              </button>
            </div>
            <p style={{ margin: "10px 0 0", color: quizFeedback === "Bonne reponse." ? "#86EFAC" : "#FCA5A5", minHeight: 20 }}>
              {quizFeedback ? `${quizFeedback} ${currentQuiz.astuce}` : ""}
            </p>
            <p style={{ margin: 0, color: COLORS.muted, fontSize: 13 }}>
              Score session: {quizScore.ok}/{quizScore.total}
            </p>
          </div>

          <div style={{ ...SECTION_CARD, padding: 16 }}>
            <p style={{ margin: "0 0 10px", color: "#F9A8D4", fontWeight: 800 }}>Carte defi express</p>
            <p style={{ margin: "0 0 10px", color: COLORS.text, lineHeight: 1.5 }}>
              Inspire des cartes revision STMG: tire un defi rapide pour t'entrainer en 3-5 minutes.
            </p>
            <button
              onClick={tirerDefi}
              style={{ border: "none", borderRadius: 10, padding: "10px 12px", background: "#DB2777", color: "white", fontWeight: 700, cursor: "pointer" }}
            >
              Tirer une carte
            </button>
            {defiActuel && (
              <div style={{ marginTop: 10, background: "#3F1D2E", border: "1px solid #9D174D", borderRadius: 10, padding: 12 }}>
                <p style={{ margin: "0 0 6px", color: "#FBCFE8", fontWeight: 700 }}>
                  {defiActuel.type} - {defiActuel.theme}
                </p>
                <p style={{ margin: "0 0 6px", color: "#FCE7F3", lineHeight: 1.5 }}>{defiActuel.consigne}</p>
                <p style={{ margin: 0, color: "#F9A8D4", fontSize: 13 }}>Repere attendu: {defiActuel.repere}</p>
              </div>
            )}
          </div>
        </section>

        <section style={{ ...SECTION_CARD, padding: 16 }}>
          <p style={{ margin: "0 0 10px", color: "#C4B5FD", fontWeight: 800 }}>Checklist interactive - question en 15 lignes</p>
          <p style={{ margin: "0 0 10px", color: COLORS.text }}>
            Coche les etapes avant de rendre une question longue (methode "15 lignes").
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 8 }}>
            {Object.entries({
              reformulation: "Je reformule clairement la problematique.",
              planVisible: "Mon plan est visible (2 parties ou 2-3 paragraphes logiques).",
              preuvesDocs: "J'appuie mes idees avec des preuves des documents.",
              notionsCours: "Je mobilise explicitement des notions du cours.",
              miniConclusion: "Je termine par une mini conclusion argumentee.",
            }).map(([key, label]) => (
              <label key={key} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "10px 12px", color: "white", display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={check15Lignes[key]}
                  onChange={(event) => setCheck15Lignes((prev) => ({ ...prev, [key]: event.target.checked }))}
                  style={{ marginTop: 2 }}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
          <p style={{ margin: "10px 0 0", color: "#A5B4FC", fontWeight: 700 }}>
            Progression: {Object.values(check15Lignes).filter(Boolean).length}/5 cases cochees
          </p>
        </section>

        <section style={TWO_COL_GRID}>
          <div style={{ ...SECTION_CARD, padding: 16 }}>
            <p style={{ margin: "0 0 10px", color: "#FCA5A5", fontWeight: 800 }}>Simulateur - Caracteriser une organisation</p>
            <p style={{ margin: "0 0 10px", color: COLORS.text, lineHeight: 1.55 }}>
              Mode bac : coche les elements indispensables avant de rediger. Ton objectif est d'eviter les oublis qui font perdre des points faciles.
            </p>
            <div style={{ display: "grid", gap: 8 }}>
              {ORGA_CRITERES.map((critere, index) => (
                <label
                  key={critere}
                  style={{
                    background: COLORS.panel,
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: 10,
                    padding: "10px 12px",
                    color: "white",
                    display: "flex",
                    gap: 8,
                    alignItems: "flex-start",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={orgaChecklist[index]}
                    onChange={(event) => setOrgaChecklist((prev) => ({ ...prev, [index]: event.target.checked }))}
                    style={{ marginTop: 2 }}
                  />
                  <span>{critere}</span>
                </label>
              ))}
            </div>
            <p style={{ margin: "10px 0 0", color: orgaProgress === orgaTotal ? "#86EFAC" : "#FCD34D", fontWeight: 700 }}>
              Grille complete: {orgaProgress}/{orgaTotal}
            </p>
          </div>

          <div style={{ ...SECTION_CARD, padding: 16 }}>
            <p style={{ margin: "0 0 10px", color: "#FDE68A", fontWeight: 800 }}>Classificateur de decisions</p>
            <p style={{ margin: "0 0 10px", color: COLORS.text, lineHeight: 1.55 }}>{currentDecision.cas}</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                { id: "strategique", label: "Strategique" },
                { id: "tactique", label: "Tactique" },
                { id: "operationnelle", label: "Operationnelle" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => setDecisionChoice(option.id)}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontWeight: 700,
                    background: decisionChoice === option.id ? "#1D4ED8" : "#374151",
                    color: "white",
                  }}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button
                onClick={validerDecision}
                disabled={!decisionChoice}
                style={{
                  border: "none",
                  borderRadius: 10,
                  padding: "8px 12px",
                  cursor: decisionChoice ? "pointer" : "not-allowed",
                  background: decisionChoice ? "#2563EB" : "#374151",
                  color: "white",
                  fontWeight: 700,
                }}
              >
                Valider
              </button>
              <button
                onClick={prochainDecisionCas}
                style={{ border: "none", borderRadius: 10, padding: "8px 12px", background: "#7C3AED", color: "white", fontWeight: 700, cursor: "pointer" }}
              >
                Cas suivant
              </button>
            </div>
            <p style={{ margin: "10px 0 0", color: decisionFeedback === "Bonne qualification." ? "#86EFAC" : "#FCA5A5", minHeight: 20 }}>
              {decisionFeedback ? `${decisionFeedback} ${currentDecision.explication}` : ""}
            </p>
            <p style={{ margin: 0, color: COLORS.muted, fontSize: 13 }}>
              Score session: {decisionScore.ok}/{decisionScore.total}
            </p>
          </div>
        </section>

        <section style={{ ...SECTION_CARD, padding: 16 }}>
          <p style={{ margin: "0 0 10px", color: "#93C5FD", fontWeight: 800 }}>Plan d'attaque 8 semaines (mode prepa intensive)</p>
          <p style={{ margin: "0 0 10px", color: COLORS.text }}>
            Coche chaque semaine validee pour piloter ta progression jusqu'au jour J.
          </p>
          <div style={{ display: "grid", gap: 8 }}>
            {PLAN_8_SEMAINES.map((step) => (
              <label
                key={step.semaine}
                style={{
                  background: COLORS.panel,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  color: "white",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={Boolean(semainesValidees[step.semaine])}
                  onChange={(event) => setSemainesValidees((prev) => ({ ...prev, [step.semaine]: event.target.checked }))}
                  style={{ marginTop: 2 }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: 800, color: "#BFDBFE" }}>{step.semaine} - {step.focus}</p>
                  <p style={{ margin: "2px 0 0", color: "#D1D5DB", fontSize: 14 }}>{step.mission}</p>
                </div>
              </label>
            ))}
          </div>
          <p style={{ margin: "10px 0 0", color: "#A7F3D0", fontWeight: 700 }}>
            Semaines validees: {Object.values(semainesValidees).filter(Boolean).length}/{PLAN_8_SEMAINES.length}
          </p>
        </section>

        <section style={{ ...SECTION_CARD, padding: 16 }}>
          <p style={{ margin: "0 0 10px", color: "#FCD34D", fontWeight: 800 }}>Notions flash a memoriser</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {NOTIONS_FLASH.map((notion) => (
              <div key={notion} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 12, color: "#E5E7EB", lineHeight: 1.5 }}>
                {notion}
              </div>
            ))}
          </div>
        </section>

        <section style={{ ...SECTION_CARD, padding: 16 }}>
          <p style={{ margin: "0 0 10px", color: "#FDE68A", fontWeight: 800 }}>Autoevaluation methodo (outil ultime)</p>
          <p style={{ margin: "0 0 12px", color: COLORS.text }}>
            Evalue ta pratique reelle devant une copie: <strong>Toujours</strong>, <strong>Pas toujours</strong>, <strong>Jamais</strong>.
          </p>
          <div style={{ display: "grid", gap: 10 }}>
            {AUTOEVAL_ITEMS.map((item) => (
              <div key={item.id} style={{ background: COLORS.panel, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 12 }}>
                <p style={{ margin: "0 0 4px", color: "#BFDBFE", fontSize: 13, fontWeight: 700 }}>{item.section}</p>
                <p style={{ margin: "0 0 8px", color: "white", lineHeight: 1.5 }}>{item.text}</p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { id: "toujours", label: "Toujours", color: "#059669" },
                    { id: "pas_toujours", label: "Pas toujours", color: "#D97706" },
                    { id: "jamais", label: "Jamais", color: "#DC2626" },
                  ].map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() => setAutoEvalAnswers((prev) => ({ ...prev, [item.id]: choice.id }))}
                      style={{
                        border: "none",
                        borderRadius: 999,
                        padding: "7px 12px",
                        cursor: "pointer",
                        fontWeight: 700,
                        background: autoEvalAnswers[item.id] === choice.id ? choice.color : "#374151",
                        color: "white",
                      }}
                    >
                      {choice.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p style={{ margin: "12px 0 0", color: "#C4B5FD", fontWeight: 700 }}>
            Rempli: {Object.keys(autoEvalAnswers).length}/{autoEvalTotal} · Toujours: {autoEvalStats.toujours} · Pas toujours: {autoEvalStats.pas_toujours} · Jamais: {autoEvalStats.jamais}
          </p>
          {autoEvalDiagnostic && (
            <div style={{ marginTop: 10, background: "#111827", border: `1px solid ${autoEvalDiagnostic.color}`, borderRadius: 10, padding: 12 }}>
              <p style={{ margin: "0 0 4px", color: autoEvalDiagnostic.color, fontWeight: 800 }}>
                Diagnostic: {autoEvalDiagnostic.niveau}
              </p>
              <p style={{ margin: 0, color: "#E5E7EB" }}>{autoEvalDiagnostic.text}</p>
            </div>
          )}
        </section>

        <section style={{ ...SECTION_CARD, padding: 16 }}>
          <p style={{ margin: "0 0 10px", color: "#93C5FD", fontWeight: 800 }}>Protocole Jour J (anti-oublis devant la copie)</p>
          <p style={{ margin: "0 0 10px", color: COLORS.text }}>
            A suivre dans l'ordre pendant l'epreuve. Coche chaque etape quand elle est faite.
          </p>
          <div style={{ display: "grid", gap: 8 }}>
            {PROTOCOLE_JOUR_J.map((step) => (
              <label
                key={step.id}
                style={{
                  background: COLORS.panel,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 10,
                  padding: "10px 12px",
                  color: "white",
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={jourJState[step.id]}
                  onChange={(event) => setJourJState((prev) => ({ ...prev, [step.id]: event.target.checked }))}
                  style={{ marginTop: 2 }}
                />
                <div>
                  <p style={{ margin: 0, fontWeight: 800, color: "#BFDBFE" }}>{step.timing}</p>
                  <p style={{ margin: "2px 0 0", color: "#D1D5DB", fontSize: 14 }}>{step.action}</p>
                </div>
              </label>
            ))}
          </div>
          <p style={{ margin: "10px 0 0", color: jourJProgress === PROTOCOLE_JOUR_J.length ? "#86EFAC" : "#FCD34D", fontWeight: 700 }}>
            Protocole complete: {jourJProgress}/{PROTOCOLE_JOUR_J.length}
          </p>
        </section>

        <section style={TWO_COL_GRID}>
          <div style={{ ...SECTION_CARD, padding: 16 }}>
            <p style={{ margin: "0 0 10px", color: "#86EFAC", fontWeight: 800 }}>A faire</p>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.7 }}>
              {METHODO_RULES.faire.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div style={{ ...SECTION_CARD, padding: 16 }}>
            <p style={{ margin: "0 0 10px", color: "#FCA5A5", fontWeight: 800 }}>A eviter</p>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.7 }}>
              {METHODO_RULES.eviter.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </section>

        <section style={{ ...SECTION_CARD, padding: 16 }}>
          <p style={{ margin: "0 0 10px", color: "#BFDBFE", fontWeight: 800 }}>Gestion du temps - simulation 4h</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
            {STUDY_PLAN.map((step) => (
              <div key={step.label} style={{ background: COLORS.panel, borderRadius: 12, padding: 12, border: `1px solid ${COLORS.border}` }}>
                <p style={{ margin: "0 0 6px", color: "#93C5FD", fontWeight: 700 }}>{step.label}</p>
                <p style={{ margin: 0, color: COLORS.text, lineHeight: 1.55 }}>{step.action}</p>
              </div>
            ))}
          </div>
        </section>

        <section style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ color: COLORS.muted, fontWeight: 700 }}>Filtrer les entrainements :</span>
          {types.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "8px 14px",
                cursor: "pointer",
                fontWeight: 700,
                background: selectedType === type ? COLORS.blue : "#374151",
                color: "white",
              }}
            >
              {type}
            </button>
          ))}
        </section>

        <section style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          {filteredExercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              status={claimState[exercise.id]}
              onClaimXP={handleClaimXP}
              onEvaluateResponse={handleEvaluateResponse}
            />
          ))}
        </section>

        <section style={{ ...SECTION_CARD, padding: 16 }}>
          <p style={{ margin: "0 0 10px", color: "#C4B5FD", fontWeight: 800 }}>Base annales / corriges utilises</p>
          <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.7 }}>
            {SOURCES.map((source) => (
              <li key={source.url}>
                <a href={source.url} target="_blank" rel="noreferrer" style={{ color: "#93C5FD" }}>
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
          <p style={{ margin: "10px 0 0", color: COLORS.muted, fontSize: 13 }}>
            Note: cette version met l'accent sur la methodologie management. On peut ensuite ajouter des sessions completes
            par annee et des entrainements supplementaires (QCM, cas integral, correction pas a pas).
          </p>
        </section>
      </div>
    </div>
  );
}
