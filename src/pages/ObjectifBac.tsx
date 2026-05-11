// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../services/firebase";
import { jsPDF } from "jspdf";

const COLORS = {
  page: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  muted: "#475569",
  blue: "#2563EB",
  cyan: "#0891B2",
  green: "#16A34A",
  orange: "#EA580C",
  rose: "#E11D48",
  violet: "#7C3AED",
  amber: "#D97706",
};

const SHELL_CARD = {
  background: COLORS.card,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 18,
  boxShadow: "0 8px 22px rgba(15, 23, 42, 0.06)",
  transition: "transform 0.18s ease, box-shadow 0.18s ease",
};

const SUBMENU = [
  { id: "vue", label: "Vue d’ensemble", emoji: "🧭" },
  { id: "examen", label: "Mode examen 4h", emoji: "⏱️" },
  { id: "entrainements", label: "Entraînements", emoji: "🧠" },
  { id: "methodo", label: "Outils méthodo", emoji: "🛠️" },
];

const EXAM_STEPS = [
  { id: "s1", label: "Lecture globale du sujet", durationMin: 20, action: "Lire la présentation de l’organisation, repérer la problématique centrale, regarder les 3 dossiers." },
  { id: "s2", label: "Préparation au brouillon", durationMin: 15, action: "Entourer les verbes directeurs, surligner les notions, classer les documents par dossier." },
  { id: "s3", label: "Traitement des dossiers", durationMin: 165, action: "Rédiger en AEI, citer des preuves documentaires, garder la logique des questions." },
  { id: "s4", label: "Calculs et vérifications", durationMin: 25, action: "Formule + application + résultat + interprétation managériale." },
  { id: "s5", label: "Relecture finale", durationMin: 15, action: "Vérifier verbes, hors-sujet, numérotation, orthographe, conclusion des questions longues." },
];

const CONSEILS_COFFRE = [
  "Avant d’écrire, reformule la question avec le verbe directeur. Tu évites 80 % des hors-sujets.",
  "Sur chaque réponse d’analyse : une idée, une preuve du document, une notion du cours.",
  "Ne laisse jamais une question vide : une réponse courte et ciblée rapporte toujours des points.",
  "Si tu fais un calcul sans interprétation, tu perds des points faciles. Interpréter est obligatoire.",
  "Sur la question en 15 lignes : annonce ton idée directrice dès la première phrase.",
  "Passe une ligne entre les arguments. Une copie aérée donne une impression de maîtrise.",
  "Quand un chiffre apparaît, explique ce qu’il signifie pour l’organisation étudiée.",
  "À la relecture, vérifie d’abord : verbe respecté ? notion mobilisée ? exemple présent ?",
];

const VERB_QUIZ = [
  {
    id: "v1",
    verbe: "Démontrer",
    question: "Sujet Ankama (2023) : « Démontrer l’intérêt d’avoir opté pour différents DAS ». Quelle structure est la plus attendue ?",
    options: [
      "Lister les DAS sans expliquer.",
      "Prendre une position, puis argumenter avec avantages précis et preuves tirées du cas.",
      "Donner une définition générale de l’entreprise.",
      "Comparer Ankama à une autre entreprise sans lien.",
    ],
    correct: 1,
    explication: "Démontrer exige une thèse + des arguments justifiés. Il faut prouver, pas seulement décrire.",
  },
  {
    id: "v2",
    verbe: "Identifier",
    question: "Consigne : « Identifier les ressources et compétences ». Qu’attend d’abord le correcteur ?",
    options: [
      "Une prise de position personnelle.",
      "Des exemples d’actualité hors sujet.",
      "Un repérage précis d’éléments dans les documents, classés et nommés correctement.",
      "Un calcul de marge.",
    ],
    correct: 2,
    explication: "Identifier = repérer et nommer correctement des éléments pertinents dans le dossier.",
  },
  {
    id: "v3",
    verbe: "Comparer",
    question: "Consigne calcul : « Comparer le coût de revient pour 3 000 et 100 unités ». Que faut-il absolument faire ?",
    options: [
      "Donner uniquement les deux chiffres finaux.",
      "Mettre en parallèle les valeurs ET conclure sur la pertinence du mode de production.",
      "Parler du style de direction.",
      "Résumer le document sans chiffres.",
    ],
    correct: 1,
    explication: "Comparer = montrer des écarts ET expliquer ce qu’ils impliquent pour la décision.",
  },
  {
    id: "v4",
    verbe: "Montrer",
    question: "Question longue : « Montrer que les outils numériques influencent l’identité ». Quel plan est pertinent ?",
    options: [
      "Définition uniquement.",
      "Communication interne/externe + effets positifs/limites sur l’identité.",
      "Une liste de réseaux sociaux.",
      "Un exemple unique sans analyse.",
    ],
    correct: 1,
    explication: "Montrer implique une argumentation équilibrée, structurée et illustrée par des cas.",
  },
  {
    id: "v5",
    verbe: "Présenter",
    question: "Consigne : « Présenter le mode de production choisi ». Que veut dire « présenter » ici ?",
    options: [
      "Raconter l’histoire de l’entreprise.",
      "Définir le mode retenu, le caractériser et relier au cas.",
      "Énumérer des notions au hasard.",
      "Donner un avis personnel sans preuve.",
    ],
    correct: 1,
    explication: "Présenter = exposer clairement, de façon ordonnée, avec précision et lien au dossier.",
  },
  {
    id: "v6",
    verbe: "Apprécier",
    question: "Consigne : « Apprécier la pertinence d’une décision ». Comment répondre au niveau bac ?",
    options: [
      "Dire juste « c’est bien ».",
      "Juger avec critères explicites, avantages/limites, puis conclure.",
      "Copier la consigne.",
      "Ne pas conclure.",
    ],
    correct: 1,
    explication: "Apprécier = porter un jugement argumenté, pas une opinion vague.",
  },
];

const DECISION_CASES = [
  {
    id: "d1",
    cas: "La direction valide le rachat d’un studio externe pour développer une nouvelle licence.",
    correct: "stratégique",
    correction: "Décision stratégique : long terme, engagement massif de ressources, impact global sur l’avenir.",
  },
  {
    id: "d2",
    cas: "Le responsable RH lance un plan de formation interne sur 12 mois pour monter en compétences.",
    correct: "tactique",
    correction: "Décision tactique : niveau fonctionnel, moyen terme, allocation de ressources au sein d’une fonction.",
  },
  {
    id: "d3",
    cas: "Le chef d’atelier modifie les horaires de l’équipe pour gérer un pic de commandes cette semaine.",
    correct: "opérationnelle",
    correction: "Décision opérationnelle : court terme, gestion courante, impact local et réversible.",
  },
];

const MANAGEMENT_DEFIS = [
  {
    id: "m1",
    theme: "Diagnostic stratégique",
    consigne: "À partir d’un cas d’entreprise de ton choix, propose 2 forces, 2 faiblesses, 2 opportunités, 2 menaces.",
    correction: "Correction-type : Interne = ressources/compétences (forces/faiblesses), Externe = environnement (opportunités/menaces). Les éléments doivent être reliés au cas et justifiés.",
  },
  {
    id: "m2",
    theme: "Style de direction",
    consigne: "Rédige un paragraphe montrant qu’un style paternaliste peut être pertinent dans une entreprise donnée.",
    correction: "Attendu : définir le style, appuyer par 2-3 indices (proximité, décisions centralisées, bienveillance), puis discuter effets motivation/performance.",
  },
  {
    id: "m3",
    theme: "Calculs de performance",
    consigne: "Explique la méthode complète pour traiter une question de marge et taux de marge au bac.",
    correction: "Étapes : (1) formule marge = PV - coût de revient ; (2) formule taux de marge = marge / coût de revient ; (3) application chiffrée ; (4) interprétation et décision.",
  },
  {
    id: "m4",
    theme: "Question de synthèse 15 lignes",
    consigne: "Rédige le plan détaillé d’une réponse « Montrer que la marque employeur participe à la performance globale ».",
    correction: "Plan possible : I) Effets sur performance sociale et RH ; II) Effets sur performance commerciale et financière ; III) Limites/risques et conditions de réussite.",
  },
];

const SYNTHESIS_CHECK = [
  "J’ai reformulé la problématique en une phrase claire.",
  "Mon plan est visible (2 ou 3 blocs logiques).",
  "Chaque bloc contient au moins un argument justifié.",
  "J’utilise des notions de cours explicites.",
  "J’utilise des exemples d’organisations (vu en cours ou annales).",
  "Je conclus par une réponse nette à la question posée.",
];

const EXERCISES = [
  {
    id: "e1",
    type: "Cas Annale 2023",
    niveau: "Terminale",
    xp: 320,
    minChars: 220,
    title: "Ankama - Intérêt de la diversification en DAS",
    context:
      "Tu traites une question de dossier 1 : montrer l’intérêt d’avoir plusieurs domaines d’activité stratégiques (jeu vidéo, BD, animation, produits dérivés).",
    consigne:
      "Rédige une réponse argumentée (10-12 lignes) montrant l’intérêt stratégique de cette diversification pour Ankama.",
    grille: [
      "Respect du verbe « démontrer » (thèse + preuves).",
      "Mobilisation de notions (DAS, synergies, risque, rentabilité).",
      "Utilisation d’éléments du cas (faits/chiffres/exemples).",
      "Conclusion explicite.",
    ],
    correctionPartielle:
      "Éléments attendus : diversification = répartition des risques, synergies entre médias, renforcement de la notoriété, capacité d’innovation, fidélisation de communautés.",
  },
  {
    id: "e2",
    type: "Cas Annale 2023",
    niveau: "Terminale",
    xp: 340,
    minChars: 230,
    title: "Ankama - Chaîne de valeur et management stratégique",
    context:
      "Question de dossier 1 : montrer que la décision de maîtriser les activités de la chaîne de valeur relève du management stratégique.",
    consigne:
      "Produis une démonstration structurée (10 lignes minimum) et justifie avec des critères de décision stratégique.",
    grille: [
      "Qualification correcte du type de décision.",
      "Critères de décision stratégique (long terme, irréversibilité, ressources, niveau direction).",
      "Lien concret avec le cas.",
      "Rédaction claire et argumentée.",
    ],
    correctionPartielle:
      "Repères : décision prise au plus haut niveau, mobilise des ressources importantes, engage l’entreprise sur le long terme, difficilement réversible.",
  },
  {
    id: "e3",
    type: "Calculs",
    niveau: "Terminale",
    xp: 360,
    minChars: 180,
    title: "Ankama - Coût de revient, marge, taux de marge",
    context:
      "Question type dossier 2 : retrouver le coût de revient unitaire puis apprécier la pertinence commerciale à partir du taux de marge.",
    consigne:
      "Explique ta démarche complète comme sur copie d’examen (formules, calculs, interprétation managériale).",
    grille: [
      "Formules correctement posées.",
      "Chaîne de calcul lisible.",
      "Interprétation des résultats.",
      "Conclusion de décision.",
    ],
    correctionPartielle:
      "Méthode attendue : formule -> application numérique -> résultat -> interprétation. Le correcteur valorise autant la démarche que le résultat.",
  },
  {
    id: "e4",
    type: "Question de synthèse",
    niveau: "Terminale",
    xp: 420,
    minChars: 320,
    title: "Question 15 lignes - Outils numériques et identité",
    context:
      "Question longue inspirée d’annales : montrer que les outils numériques de communication influencent l’identité des organisations.",
    consigne:
      "Rédige une réponse de 15 lignes environ avec introduction, au moins 3 arguments, exemples et conclusion.",
    grille: [
      "Structure de synthèse respectée.",
      "Arguments distincts et justifiés.",
      "Exemples d’organisations pertinents.",
      "Vision équilibrée (apports + limites).",
    ],
    correctionPartielle:
      "Pistes : identité interne (cohésion, culture), identité externe (notoriété, marque employeur), risques (bad buzz, perte de contrôle de l’image).",
  },
  {
    id: "e5",
    type: "Méthodologie pure",
    niveau: "Première/Terminale",
    xp: 280,
    minChars: 180,
    title: "Caractériser une organisation sans oubli",
    context:
      "Exercice d’automatisation de la première question de sujet.",
    consigne:
      "Rédige un canevas de réponse « caractériser une organisation » en intégrant les critères incontournables et leur justification.",
    grille: [
      "Critères essentiels présents.",
      "Justification et précision attendues.",
      "Organisation claire de la réponse.",
    ],
    correctionPartielle:
      "Repères : type, taille, statut, champ d’action, ressources, finalité, objectifs. Ne pas « raconter » : justifier chaque point.",
  },
];

const AUTOEVAL_ITEMS = [
  { id: "a1", text: "Je lis tout le sujet avant de rédiger." },
  { id: "a2", text: "J’entoure les verbes directeurs avant lecture des docs." },
  { id: "a3", text: "Je prépare mes notions au brouillon avant rédaction." },
  { id: "a4", text: "Je traite les réponses d’analyse avec une structure AEI." },
  { id: "a5", text: "Je fais systématiquement formule + calcul + interprétation pour les calculs." },
  { id: "a6", text: "Je garde un temps de relecture finale obligatoire." },
];

const DS_LOCK_TYPE = "DS 1h - Chapitre 13";
const DS_CODE_STORAGE_KEY = "objectifBacDsUnlocked";
const DS_ACCESS_CODE = (import.meta.env.VITE_DS_ACCESS_CODE || "STMG13").trim();
const DS_EXAM_ID = "chapitre13_1h_2026";
const normalizeAccessCode = (value = "") => String(value).trim().toUpperCase();

const normalizeText = (text = "") => String(text)
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[^a-z0-9\s]/g, " ")
  .replace(/\s+/g, " ")
  .trim();

const tokens = (text = "") => normalizeText(text).split(" ").filter((t) => t.length >= 4);

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const getDailyIndex = (size, uid = "invite") => {
  const seed = `${getTodayKey()}-${uid}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) % size;
};

const formatSeconds = (sec) => {
  const safe = Math.max(0, Number(sec) || 0);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

const getMasteryLevel = (totalClaims) => {
  if (totalClaims >= 35) return { label: "Légende MSGN", color: "#7C3AED" };
  if (totalClaims >= 22) return { label: "Expert méthodo", color: "#0891B2" };
  if (totalClaims >= 12) return { label: "Confirmé", color: "#16A34A" };
  if (totalClaims >= 5) return { label: "En progression", color: "#EA580C" };
  return { label: "Échauffement", color: "#64748B" };
};

const localCorrection = (exercise, answer) => {
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
  const expected = new Set(tokens(`${exercise.consigne} ${exercise.grille.join(" ")} ${exercise.correctionPartielle}`));
  const rep = new Set(tokens(text));
  let overlap = 0;
  for (const tk of rep) if (expected.has(tk)) overlap += 1;
  const ratio = expected.size ? overlap / Math.max(10, Math.min(35, expected.size)) : 0;
  const hasStructure = /(\n|^-|•|1\.)/m.test(text);
  const hasExample = /(exemple|dans le cas|document|dossier|chiffre|%|€)/i.test(text);
  const hasConclusion = /(donc|en conclusion|on peut conclure|ainsi)/i.test(text);
  let score = 2 + (Math.min(1, ratio) * 4.2) + (hasStructure ? 1 : 0) + (hasExample ? 1 : 0) + (hasConclusion ? 1 : 0);
  score = Math.max(0, Math.min(10, Math.round(score)));
  return {
    score,
    feedback: "Évaluation locale basée sur structure, notions et justification.",
    points_forts: hasExample ? "Tu appuies déjà ta réponse avec des éléments concrets." : "Réponse exploitable.",
    a_ameliorer: "Rends ton argumentation plus explicite et ajoute davantage de liens avec les notions du cours.",
    elements_reperes: [exercise.grille[0], exercise.grille[1]].filter(Boolean),
    source: "local",
  };
};

const parseJson = (raw = "") => {
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

const callGemini = async (prompt) => {
  const key = import.meta.env.VITE_GEMINI_API_KEY;
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
  return parseJson(text);
};

const callGroq = async (prompt) => {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) return null;
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      max_tokens: 700,
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return parseJson(data?.choices?.[0]?.message?.content || "");
};

function ExerciseCard({
  exercise,
  status,
  onClaimXP,
  onEvaluateResponse,
  forceZero = false,
  isDsExercise = false,
  onDsSubmit,
}) {
  const [answer, setAnswer] = useState("");
  const [showCorrection, setShowCorrection] = useState(false);
  const [loadingXP, setLoadingXP] = useState(false);
  const [loadingEval, setLoadingEval] = useState(false);
  const [evalResult, setEvalResult] = useState(null);
  const [localInfo, setLocalInfo] = useState("");
  const [answerLocked, setAnswerLocked] = useState(false);
  const [dsSubmitted, setDsSubmitted] = useState(false);

  const length = answer.trim().length;
  const alreadyClaimed = status?.lastClaimDate === getTodayKey();
  const isLocked = answerLocked || forceZero || dsSubmitted;
  const canClaim = !forceZero && !isDsExercise && length >= exercise.minChars && !alreadyClaimed && !loadingXP;
  const canEval = !forceZero && !isDsExercise && length >= Math.max(80, Math.floor(exercise.minChars * 0.6)) && !loadingEval && !answerLocked;
  const claimHint = alreadyClaimed
    ? "XP déjà validés aujourd’hui pour cet exercice."
    : length < exercise.minChars
      ? `Réponse trop courte pour valider l’XP (${exercise.minChars} caractères mini).`
      : "";

  const claimXP = async () => {
    if (!canClaim) {
      setLocalInfo(claimHint || "Validation impossible pour le moment.");
      return;
    }
    setLoadingXP(true);
    try {
      const ok = await onClaimXP(exercise.id, exercise.xp);
      if (!ok) setLocalInfo("Échec de validation. Vérifie la connexion et réessaie.");
    } finally {
      setLoadingXP(false);
    }
  };

  const evaluate = async () => {
    if (!canEval) return;
    setLoadingEval(true);
    try {
      const result = await onEvaluateResponse(exercise, answer);
      setEvalResult(result);
      if (result) setAnswerLocked(true);
    } finally {
      setLoadingEval(false);
    }
  };

  const submitDsAnswer = () => {
    if (isLocked) return;
    const payload = String(answer || "").trim();
    if (!payload) {
      setLocalInfo("Réponse vide : saisis au moins un élément avant de rendre.");
      return;
    }
    setDsSubmitted(true);
    setLocalInfo("Copie rendue : réponse figée, modification impossible.");
    if (onDsSubmit) onDsSubmit(exercise, payload);
  };

  return (
    <article style={{ ...SHELL_CARD, padding: 18 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <span style={{ background: "#DBEAFE", color: "#1D4ED8", borderRadius: 999, padding: "4px 10px", fontWeight: 700, fontSize: 12 }}>{exercise.type}</span>
        <span style={{ background: "#DCFCE7", color: "#166534", borderRadius: 999, padding: "4px 10px", fontWeight: 700, fontSize: 12 }}>+{exercise.xp} XP</span>
        <span style={{ background: "#FEF3C7", color: "#92400E", borderRadius: 999, padding: "4px 10px", fontWeight: 700, fontSize: 12 }}>{exercise.niveau}</span>
      </div>

      <h3 style={{ margin: "0 0 6px", color: COLORS.text }}>{exercise.title}</h3>
      <p style={{ margin: "0 0 8px", color: COLORS.muted, lineHeight: 1.55 }}>{exercise.context}</p>
      <p style={{ margin: "0 0 10px", color: COLORS.text, lineHeight: 1.55 }}>
        <strong>Consigne :</strong> {exercise.consigne}
      </p>

      <div style={{ background: "#F8FAFC", border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, marginBottom: 10 }}>
        <p style={{ margin: "0 0 6px", color: "#0C4A6E", fontWeight: 800 }}>Critères de réussite</p>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#334155", lineHeight: 1.55 }}>
          {exercise.grille.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </div>

      <textarea
        value={answer}
        onChange={(e) => {
          if (isLocked) return;
          setAnswer(e.target.value);
        }}
        readOnly={isLocked}
        onPaste={(e) => e.preventDefault()}
        onCopy={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
        onDrop={(e) => e.preventDefault()}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          const key = String(e.key || "").toLowerCase();
          if ((e.ctrlKey || e.metaKey) && (key === "v" || key === "c" || key === "x" || key === "insert")) {
            e.preventDefault();
          }
          if (e.shiftKey && key === "insert") e.preventDefault();
        }}
        placeholder="Rédige ta réponse ici..."
        style={{
          width: "100%",
          minHeight: 150,
          borderRadius: 12,
          border: `1px solid ${COLORS.border}`,
          background: "#FFFFFF",
          color: COLORS.text,
          padding: 12,
          fontSize: 14,
          lineHeight: 1.55,
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
      <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 12 }}>
        Copier/coller désactivé sur cette zone de réponse.
      </p>
      {answerLocked && (
        <p style={{ margin: "6px 0 0", color: "#9F1239", fontSize: 12, fontWeight: 700 }}>
          Réponse verrouillée après correction : modification impossible.
        </p>
      )}
      {dsSubmitted && (
        <p style={{ margin: "6px 0 0", color: "#7C2D12", fontSize: 12, fontWeight: 800 }}>
          Copie DS rendue : la réponse est verrouillée.
        </p>
      )}
      {forceZero && (
        <p style={{ margin: "6px 0 0", color: "#991B1B", fontSize: 12, fontWeight: 800 }}>
          Sortie de page détectée : note du DS forcée à 0.
        </p>
      )}
      <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 12 }}>
        Longueur recommandée pour validation XP : {exercise.minChars} caractères minimum.
      </p>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        {isDsExercise ? (
          <button
            onClick={submitDsAnswer}
            disabled={isLocked}
            style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: isLocked ? "not-allowed" : "pointer", background: isLocked ? "#CBD5E1" : COLORS.orange, color: "white", fontWeight: 800 }}
          >
            {isLocked ? "Copie déjà rendue" : "Rendre ma copie (définitif)"}
          </button>
        ) : (
          <>
            <button
              onClick={evaluate}
              disabled={!canEval}
              style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: canEval ? "pointer" : "not-allowed", background: canEval ? COLORS.violet : "#CBD5E1", color: "white", fontWeight: 700 }}
            >
              {loadingEval ? "Correction..." : "Corriger (IA + barème)"}
            </button>
            <button
              onClick={claimXP}
              disabled={!canClaim}
              style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: canClaim ? "pointer" : "not-allowed", background: canClaim ? COLORS.blue : "#CBD5E1", color: "white", fontWeight: 700 }}
            >
              {loadingXP ? "Validation..." : alreadyClaimed ? "XP déjà gagné aujourd’hui" : `Valider et gagner ${exercise.xp} XP`}
            </button>
            <button
              onClick={() => setShowCorrection((v) => !v)}
              style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: "pointer", background: showCorrection ? COLORS.rose : COLORS.green, color: "white", fontWeight: 700 }}
            >
              {showCorrection ? "Masquer correction partielle" : "Afficher correction partielle"}
            </button>
          </>
        )}
      </div>
      {(claimHint || localInfo) && (
        <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 12 }}>
          {localInfo || claimHint}
        </p>
      )}

      {!isDsExercise && evalResult && (
        <div style={{ marginTop: 10, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 12, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <p style={{ margin: 0, color: "#1E3A8A", fontWeight: 800 }}>Résultat de correction</p>
            <span style={{ background: evalResult.score >= 7 ? COLORS.green : evalResult.score >= 5 ? COLORS.orange : COLORS.rose, color: "white", borderRadius: 999, padding: "4px 11px", fontWeight: 800 }}>
              {evalResult.score}/10
            </span>
          </div>
          <p style={{ margin: "8px 0 0", color: "#1E293B" }}><strong>Feedback :</strong> {evalResult.feedback}</p>
          <p style={{ margin: "6px 0 0", color: "#166534" }}><strong>Points forts :</strong> {evalResult.points_forts}</p>
          <p style={{ margin: "6px 0 0", color: "#92400E" }}><strong>À améliorer :</strong> {evalResult.a_ameliorer}</p>
          {Array.isArray(evalResult.elements_reperes) && evalResult.elements_reperes.length > 0 && (
            <ul style={{ margin: "6px 0 0", paddingLeft: 18, color: "#1F2937", lineHeight: 1.55 }}>
              {evalResult.elements_reperes.map((line) => <li key={line}>{line}</li>)}
            </ul>
          )}
          <p style={{ margin: "6px 0 0", fontSize: 12, color: "#64748B" }}>
            Source : {evalResult.source === "ai" ? "IA + garde-fous locaux" : "Évaluation locale"}
          </p>
        </div>
      )}

      {!isDsExercise && showCorrection && (
        <div style={{ marginTop: 10, background: "#ECFDF5", border: "1px solid #86EFAC", borderRadius: 12, padding: 12 }}>
          <p style={{ margin: "0 0 6px", color: "#166534", fontWeight: 800 }}>Correction partielle</p>
          <p style={{ margin: 0, color: "#14532D", lineHeight: 1.55 }}>{exercise.correctionPartielle}</p>
        </div>
      )}
    </article>
  );
}

function DsExerciseCard({
  exercise,
  forceZero = false,
  copyFinalized = false,
  answerDrafts = {},
  lockedQuestions = {},
  onDraftChange,
  onValidateQuestion,
}) {
  const questions = Array.isArray(exercise.dsQuestions) && exercise.dsQuestions.length
    ? exercise.dsQuestions
    : [{ id: "q1", label: "Q1", prompt: exercise.consigne, minChars: Math.max(60, Math.floor((exercise.minChars || 120) / 2)) }];

  return (
    <article style={{ ...SHELL_CARD, padding: 18 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <span style={{ background: "#DBEAFE", color: "#1D4ED8", borderRadius: 999, padding: "4px 10px", fontWeight: 700, fontSize: 12 }}>{exercise.type}</span>
        <span style={{ background: "#FEF3C7", color: "#92400E", borderRadius: 999, padding: "4px 10px", fontWeight: 700, fontSize: 12 }}>{exercise.niveau}</span>
      </div>
      <h3 style={{ margin: "0 0 6px", color: COLORS.text }}>{exercise.title}</h3>
      <p style={{ margin: "0 0 8px", color: COLORS.muted, lineHeight: 1.55 }}>{exercise.context}</p>
      <div style={{ background: "#F8FAFC", border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, marginBottom: 10 }}>
        <p style={{ margin: "0 0 6px", color: "#0C4A6E", fontWeight: 800 }}>Critères de réussite</p>
        <ul style={{ margin: 0, paddingLeft: 18, color: "#334155", lineHeight: 1.55 }}>
          {exercise.grille.map((line) => <li key={line}>{line}</li>)}
        </ul>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {questions.map((question, index) => {
          const value = String(answerDrafts[question.id] || "");
          const isQuestionLocked = Boolean(lockedQuestions[question.id]) || forceZero || copyFinalized;
          const minChars = Number(question.minChars) || 80;
          return (
            <section key={`${exercise.id}-${question.id}`} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: 12, background: "#FFFFFF" }}>
              <p style={{ margin: "0 0 6px", color: "#1E3A8A", fontWeight: 800 }}>
                {question.label || `Q${index + 1}`}
              </p>
              <p style={{ margin: "0 0 8px", color: "#1F2937", lineHeight: 1.55 }}>{question.prompt}</p>
              <textarea
                value={value}
                onChange={(e) => onDraftChange(exercise.id, question.id, e.target.value)}
                readOnly={isQuestionLocked}
                onPaste={(e) => e.preventDefault()}
                onCopy={(e) => e.preventDefault()}
                onCut={(e) => e.preventDefault()}
                onDrop={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
                onKeyDown={(e) => {
                  const key = String(e.key || "").toLowerCase();
                  if ((e.ctrlKey || e.metaKey) && (key === "v" || key === "c" || key === "x" || key === "insert")) e.preventDefault();
                  if (e.shiftKey && key === "insert") e.preventDefault();
                }}
                placeholder="Réponse attendue..."
                style={{
                  width: "100%",
                  minHeight: 120,
                  borderRadius: 10,
                  border: `1px solid ${COLORS.border}`,
                  padding: 10,
                  fontSize: 14,
                  lineHeight: 1.5,
                  resize: "vertical",
                  boxSizing: "border-box",
                }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                <p style={{ margin: 0, color: "#64748B", fontSize: 12 }}>
                  {value.trim().length} caractères · minimum conseillé {minChars}
                </p>
                <button
                  onClick={() => onValidateQuestion(exercise, question)}
                  disabled={isQuestionLocked || value.trim().length < minChars}
                  style={{
                    border: "none",
                    borderRadius: 10,
                    padding: "8px 11px",
                    cursor: isQuestionLocked || value.trim().length < minChars ? "not-allowed" : "pointer",
                    background: isQuestionLocked ? "#CBD5E1" : COLORS.orange,
                    color: "white",
                    fontWeight: 800,
                  }}
                >
                  {isQuestionLocked ? "Réponse validée" : "Valider la réponse"}
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </article>
  );
}

const ONGLET_IDS = ["vue", "examen", "entrainements", "methodo"];

export default function ObjectifBac({ profil, onXPGagne, initialActiveTab = "vue" }) {
  const [activeTab, setActiveTab] = useState(() =>
    ONGLET_IDS.includes(initialActiveTab) ? initialActiveTab : "vue"
  );
  const [banner, setBanner] = useState(null);
  const [claimState, setClaimState] = useState({});
  const [selectedType, setSelectedType] = useState("Tous");
  const [dsCodeInput, setDsCodeInput] = useState("");
  const [dsUnlocked, setDsUnlocked] = useState(false);
  const [dsAttemptStarted, setDsAttemptStarted] = useState(false);
  const [dsForcedZero, setDsForcedZero] = useState(false);
  const [dsSubmissions, setDsSubmissions] = useState({});
  const [dsFinalizedAt, setDsFinalizedAt] = useState("");
  const [dsDraftAnswers, setDsDraftAnswers] = useState({});

  const [coffreOpen, setCoffreOpen] = useState(false);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizChoice, setQuizChoice] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [quizScore, setQuizScore] = useState({ ok: 0, total: 0 });

  const [defi, setDefi] = useState(null);
  const [showDefiCorrection, setShowDefiCorrection] = useState(false);

  const [synthChecklist, setSynthChecklist] = useState(() =>
    SYNTHESIS_CHECK.reduce((acc, _, i) => ({ ...acc, [i]: false }), {})
  );
  const [decisionIndex, setDecisionIndex] = useState(0);
  const [decisionChoice, setDecisionChoice] = useState(null);
  const [decisionFeedback, setDecisionFeedback] = useState(null);
  const [autoEval, setAutoEval] = useState({});

  const [examRemainingSec, setExamRemainingSec] = useState(4 * 60 * 60);
  const [examRunning, setExamRunning] = useState(false);
  const [examStepState, setExamStepState] = useState(() =>
    EXAM_STEPS.reduce((acc, step) => ({ ...acc, [step.id]: false }), {})
  );

  const hasDsPack = useMemo(() => EXERCISES.some((e) => e.type === DS_LOCK_TYPE), []);
  const visibleExercises = useMemo(
    () => EXERCISES.filter((e) => dsUnlocked || e.type !== DS_LOCK_TYPE),
    [dsUnlocked]
  );
  const availableTypes = useMemo(() => ["Tous", ...new Set(visibleExercises.map((e) => e.type))], [visibleExercises]);
  const filteredExercises = useMemo(
    () => visibleExercises.filter((e) => selectedType === "Tous" || e.type === selectedType),
    [selectedType, visibleExercises]
  );
  const dailyXpPotential = useMemo(() => EXERCISES.reduce((sum, e) => sum + e.xp, 0), []);
  const todayKey = getTodayKey();
  const completedTodayCount = useMemo(
    () => Object.values(claimState).filter((entry) => entry?.lastClaimDate === todayKey).length,
    [claimState, todayKey]
  );
  const totalClaims = useMemo(
    () => Object.values(claimState).reduce((sum, entry) => sum + (entry?.totalClaims || 0), 0),
    [claimState]
  );
  const mastery = useMemo(() => getMasteryLevel(totalClaims), [totalClaims]);
  const globalProgress = useMemo(
    () => Math.max(0, Math.min(100, Math.round((completedTodayCount / EXERCISES.length) * 100))),
    [completedTodayCount]
  );

  const coffreConseil = useMemo(() => {
    const uid = auth.currentUser?.uid || "invite";
    return CONSEILS_COFFRE[getDailyIndex(CONSEILS_COFFRE.length, uid)];
  }, []);

  const currentQuiz = VERB_QUIZ[quizIndex];
  const currentDecision = DECISION_CASES[decisionIndex];

  const examElapsed = (4 * 60 * 60) - examRemainingSec;
  const examProgress = Math.max(0, Math.min(100, Math.round((examElapsed / (4 * 60 * 60)) * 100)));
  const examPhaseIndex = useMemo(() => {
    let acc = 0;
    for (let i = 0; i < EXAM_STEPS.length; i++) {
      acc += EXAM_STEPS[i].durationMin * 60;
      if (examElapsed < acc) return i;
    }
    return EXAM_STEPS.length - 1;
  }, [examElapsed]);

  const autoEvalStats = useMemo(() => {
    const result = { toujours: 0, pas_toujours: 0, jamais: 0 };
    for (const value of Object.values(autoEval)) {
      if (Object.hasOwn(result, value)) result[value] += 1;
    }
    return result;
  }, [autoEval]);

  const autoEvalDiagnostic = useMemo(() => {
    if (Object.keys(autoEval).length !== AUTOEVAL_ITEMS.length) return "Complète d’abord toute l’autoévaluation pour obtenir ton diagnostic.";
    if (autoEvalStats.toujours >= autoEvalStats.pas_toujours && autoEvalStats.toujours >= autoEvalStats.jamais) {
      return "Niveau méthodologique solide : passe en mode annale chronométrée chaque semaine.";
    }
    if (autoEvalStats.pas_toujours >= autoEvalStats.jamais) {
      return "Bon potentiel : tu dois transformer tes habitudes en automatismes (brouillon + relecture).";
    }
    return "Priorité absolue : ritualiser les étapes du protocole jour J avant de viser la performance.";
  }, [autoEval, autoEvalStats]);

  const recommandations = useMemo(() => {
    const tips = [];
    if (autoEval.a2 === "jamais" || autoEval.a3 === "jamais") tips.push("Avant lecture des documents : entoure verbes + notions et prépare ton brouillon de notions.");
    if (autoEval.a4 !== "toujours") tips.push("Rédige tes analyses en AEI : Argument, Explication, Illustration.");
    if (autoEval.a5 !== "toujours") tips.push("Sur chaque calcul : formule, application, résultat, interprétation managériale.");
    if (autoEval.a6 !== "toujours") tips.push("Bloque 10-15 minutes de relecture finale, non négociables.");
    if (!tips.length) tips.push("Très bon niveau : enchaîne des sujets complets 4h pour sécuriser le jour J.");
    return tips.slice(0, 4);
  }, [autoEval]);
  const masteryBadges = useMemo(() => ([
    { id: "b1", label: "Routine 4h", unlocked: Object.values(examStepState).filter(Boolean).length >= EXAM_STEPS.length },
    { id: "b2", label: "Quiz focus", unlocked: quizScore.ok >= 5 },
    { id: "b3", label: "Discipline synthèse", unlocked: Object.values(synthChecklist).filter(Boolean).length >= SYNTHESIS_CHECK.length },
    { id: "b4", label: "Régularité", unlocked: completedTodayCount >= 3 },
  ]), [examStepState, quizScore.ok, synthChecklist, completedTodayCount]);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) return;
        const data = snap.data();
        const p = data.objectifBacProgress || {};
        const dsExam = data.objectifBacDs?.[DS_EXAM_ID] || {};
        setClaimState(p.claims || {});
        if (p.activeTab) setActiveTab(p.activeTab);
        if (p.selectedType) setSelectedType(p.selectedType);
        if (p.autoEval) setAutoEval(p.autoEval);
        if (p.synthChecklist) setSynthChecklist(p.synthChecklist);
        if (p.examStepState) setExamStepState(p.examStepState);
        if (typeof p.examRemainingSec === "number") setExamRemainingSec(p.examRemainingSec);
        if (dsExam.submissions && typeof dsExam.submissions === "object") setDsSubmissions(dsExam.submissions);
        if (dsExam.forcedZero === true) setDsForcedZero(true);
        if (typeof dsExam.finalizedAt === "string") setDsFinalizedAt(dsExam.finalizedAt);
        if (dsExam.attemptStarted || (dsExam.submissions && Object.keys(dsExam.submissions).length > 0)) setDsAttemptStarted(true);
      } catch (e) {
        console.error("Chargement Objectif Bac impossible", e);
      }
    };
    load();
  }, []);

  useEffect(() => {
    try {
      const unlocked = window.sessionStorage.getItem(DS_CODE_STORAGE_KEY) === "1";
      setDsUnlocked(unlocked);
    } catch {
      setDsUnlocked(false);
    }
  }, []);

  useEffect(() => {
    if (!availableTypes.includes(selectedType)) {
      setSelectedType("Tous");
    }
  }, [availableTypes, selectedType]);

  useEffect(() => {
    if (!dsAttemptStarted || dsForcedZero) return undefined;
    const disqualify = () => {
      setDsForcedZero(true);
      setBanner({ type: "error", text: "Anti-triche DS : sortie de page détectée, note forcée à 0." });
      const user = auth.currentUser;
      if (user) {
        updateDoc(doc(db, "users", user.uid), {
          [`objectifBacDs.${DS_EXAM_ID}.forcedZero`]: true,
          [`objectifBacDs.${DS_EXAM_ID}.forcedZeroAt`]: new Date().toISOString(),
          [`objectifBacDs.${DS_EXAM_ID}.attemptStarted`]: true,
        }).catch((err) => console.error("Sauvegarde anti-triche DS impossible", err));
      }
    };
    const onVisibility = () => {
      if (document.hidden) disqualify();
    };
    window.addEventListener("blur", disqualify);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", disqualify);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [dsAttemptStarted, dsForcedZero]);

  useEffect(() => {
    if (!examRunning) return undefined;
    const interval = setInterval(() => {
      setExamRemainingSec((prev) => {
        if (prev <= 1) {
          setExamRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [examRunning]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return undefined;
    const timeout = setTimeout(async () => {
      try {
        await updateDoc(doc(db, "users", user.uid), {
          objectifBacProgress: {
            claims: claimState,
            activeTab,
            selectedType,
            autoEval,
            synthChecklist,
            examStepState,
            examRemainingSec,
          },
        });
      } catch (e) {
        console.error("Sauvegarde Objectif Bac impossible", e);
      }
    }, 900);
    return () => clearTimeout(timeout);
  }, [claimState, activeTab, selectedType, autoEval, synthChecklist, examStepState, examRemainingSec]);

  const handleClaimXP = async (exerciseId, xpAmount) => {
    const user = auth.currentUser;
    if (!user) {
      setBanner({ type: "error", text: "Session expirée. Reconnecte-toi pour valider l’XP." });
      return false;
    }
    try {
      const exercise = EXERCISES.find((item) => item.id === exerciseId);
      if (exercise?.type === DS_LOCK_TYPE && dsForcedZero) {
        setBanner({ type: "error", text: "DS disqualifié : sortie de page détectée, aucun XP validable." });
        return false;
      }
      const today = getTodayKey();
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setBanner({ type: "error", text: "Profil introuvable. Recharge la page." });
        return false;
      }
      const data = snap.data();
      const claims = data.objectifBacProgress?.claims || {};
      if (claims?.[exerciseId]?.lastClaimDate === today) {
        setBanner({ type: "error", text: "XP déjà gagnés aujourd’hui pour cet exercice." });
        return false;
      }
      const nextClaims = {
        ...claims,
        [exerciseId]: {
          lastClaimDate: today,
          totalClaims: (claims?.[exerciseId]?.totalClaims || 0) + 1,
        },
      };
      await updateDoc(ref, {
        xp: (data.xp || 0) + xpAmount,
        objectifBacProgress: {
          ...(data.objectifBacProgress || {}),
          claims: nextClaims,
        },
      });
      setClaimState(nextClaims);
      setBanner({ type: "success", text: `+${xpAmount} XP ajoutés !` });
      if (onXPGagne) onXPGagne();
      return true;
    } catch (err) {
      console.error("Validation XP Objectif Bac impossible", err);
      setBanner({ type: "error", text: "Validation impossible pour le moment. Vérifie la connexion puis réessaie." });
      return false;
    }
  };

  const handleEvaluateResponse = async (exercise, answer) => {
    if (exercise?.type === DS_LOCK_TYPE) {
      setDsAttemptStarted(true);
      if (dsForcedZero) {
        return {
          score: 0,
          feedback: "Sortie de page détectée pendant le DS : copie notée 0.",
          points_forts: "Aucun (copie disqualifiée).",
          a_ameliorer: "Rester sur la page DS jusqu'à la fin de l'épreuve.",
          elements_reperes: ["Anti-triche actif : perte de focus/onglet = 0"],
          source: "local",
        };
      }
    }
    const local = localCorrection(exercise, answer);
    const prompt = `Tu es correcteur Bac STMG Management.
Retourne UNIQUEMENT un JSON:
{"score":number,"feedback":string,"points_forts":string,"a_ameliorer":string,"elements_reperes":string[]}

Consigne: ${exercise.consigne}
Grille: ${exercise.grille.join(" | ")}
Référence partielle: ${exercise.correctionPartielle}
Réponse élève: ${answer}

Règles:
- score entier 0..10
- pas de texte hors JSON
- 2 à 3 éléments repérés max`;

    let ai = null;
    try {
      ai = await callGemini(prompt);
      if (!ai) ai = await callGroq(prompt);
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
      elements_reperes: Array.isArray(ai.elements_reperes) && ai.elements_reperes.length ? ai.elements_reperes.slice(0, 3) : local.elements_reperes,
      source: "ai",
    };
  };

  const validateVerbQuiz = () => {
    if (quizChoice === null) return;
    const ok = quizChoice === currentQuiz.correct;
    setQuizFeedback(ok ? "Bonne réponse." : "Pas encore.");
    setQuizScore((prev) => ({ ok: prev.ok + (ok ? 1 : 0), total: prev.total + 1 }));
  };

  const nextVerbQuestion = () => {
    setQuizIndex((prev) => (prev + 1) % VERB_QUIZ.length);
    setQuizChoice(null);
    setQuizFeedback(null);
  };

  const drawDefi = () => {
    setDefi(MANAGEMENT_DEFIS[Math.floor(Math.random() * MANAGEMENT_DEFIS.length)]);
    setShowDefiCorrection(false);
  };

  const validateDecision = () => {
    if (!decisionChoice) return;
    const ok = decisionChoice === currentDecision.correct;
    setDecisionFeedback(ok ? "Bonne qualification." : "Qualification à corriger.");
  };

  const unlockDsPack = () => {
    const expected = DS_ACCESS_CODE;
    if (!expected) {
      setBanner({ type: "error", text: "Code DS non configuré. Ajoute VITE_DS_ACCESS_CODE dans .env." });
      return;
    }
    if (normalizeAccessCode(dsCodeInput) !== normalizeAccessCode(expected)) {
      setBanner({ type: "error", text: "Code incorrect. Le sujet DS reste verrouillé." });
      return;
    }
    setDsUnlocked(true);
    setDsCodeInput("");
    try {
      window.sessionStorage.setItem(DS_CODE_STORAGE_KEY, "1");
    } catch {
      // no-op if storage unavailable
    }
    setBanner({ type: "success", text: "Sujet DS déverrouillé." });
  };

  const handleDsDraftChange = (exerciseId, questionId, value) => {
    setDsDraftAnswers((prev) => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {}),
        [questionId]: value,
      },
    }));
  };

  const handleDsValidateQuestion = (exercise, question) => {
    if (dsForcedZero || dsFinalizedAt) return;
    const answer = String(dsDraftAnswers?.[exercise.id]?.[question.id] || "").trim();
    const minChars = Number(question.minChars) || 80;
    if (answer.length < minChars) {
      setBanner({ type: "error", text: `Réponse trop courte pour ${question.label || question.id}.` });
      return;
    }

    setDsAttemptStarted(true);
    const nowIso = new Date().toISOString();
    const payload = { prompt: question.prompt, answer, validatedAt: nowIso };
    setDsSubmissions((prev) => ({
      ...prev,
      [exercise.id]: {
        ...(prev[exercise.id] || {}),
        title: exercise.title,
        questions: {
          ...((prev[exercise.id] && prev[exercise.id].questions) || {}),
          [question.id]: payload,
        },
      },
    }));
    const user = auth.currentUser;
    if (user) {
      updateDoc(doc(db, "users", user.uid), {
        [`objectifBacDs.${DS_EXAM_ID}.examId`]: DS_EXAM_ID,
        [`objectifBacDs.${DS_EXAM_ID}.type`]: DS_LOCK_TYPE,
        [`objectifBacDs.${DS_EXAM_ID}.attemptStarted`]: true,
        [`objectifBacDs.${DS_EXAM_ID}.forcedZero`]: dsForcedZero,
        [`objectifBacDs.${DS_EXAM_ID}.submissions.${exercise.id}.title`]: exercise.title,
        [`objectifBacDs.${DS_EXAM_ID}.submissions.${exercise.id}.questions.${question.id}`]: payload,
      }).catch((err) => console.error("Sauvegarde copie DS impossible", err));
    }
    setBanner({ type: "success", text: `${question.label || "Question"} validée.` });
  };

  const dsExercises = useMemo(() => EXERCISES.filter((e) => e.type === DS_LOCK_TYPE), []);
  const canFinalizeDsCopy = useMemo(() => {
    if (!dsUnlocked || dsForcedZero || dsFinalizedAt || !dsExercises.length) return false;
    return dsExercises.every((exercise) => {
      const questions = Array.isArray(exercise.dsQuestions) && exercise.dsQuestions.length ? exercise.dsQuestions : [{ id: "q1" }];
      return questions.every((q) => Boolean(dsSubmissions?.[exercise.id]?.questions?.[q.id]));
    });
  }, [dsUnlocked, dsForcedZero, dsFinalizedAt, dsExercises, dsSubmissions]);

  const finalizeDsCopy = async () => {
    if (!canFinalizeDsCopy) {
      setBanner({ type: "error", text: "Toutes les réponses ne sont pas encore validées." });
      return;
    }
    const user = auth.currentUser;
    const nowIso = new Date().toISOString();
    setDsFinalizedAt(nowIso);
    setBanner({ type: "success", text: "Copie finale validée. Aucune modification possible." });
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        [`objectifBacDs.${DS_EXAM_ID}.finalizedAt`]: nowIso,
      });
    } catch (err) {
      console.error("Validation finale DS impossible", err);
    }
  };

  const downloadDsPdf = () => {
    const hasCopies = dsExercises.some((e) => {
      const submission = dsSubmissions[e.id];
      if (!submission) return false;
      if (submission.answer) return true;
      const questionMap = submission.questions || {};
      return Object.values(questionMap).some((q) => Boolean(q?.answer));
    });
    if (!hasCopies) {
      setBanner({ type: "error", text: "Aucune copie DS disponible à exporter." });
      return;
    }

    const studentName = `${profil?.prenom || ""} ${profil?.nom || ""}`.trim() || "Eleve";
    const docPdf = new jsPDF({ unit: "pt", format: "a4" });
    const left = 40;
    const right = 555;
    const maxWidth = right - left;
    let y = 48;

    const writeLine = (text, size = 11, bold = false, gap = 14) => {
      docPdf.setFont("helvetica", bold ? "bold" : "normal");
      docPdf.setFontSize(size);
      const lines = docPdf.splitTextToSize(String(text), maxWidth);
      if (y + lines.length * gap > 790) {
        docPdf.addPage();
        y = 48;
      }
      docPdf.text(lines, left, y);
      y += lines.length * gap;
    };

    writeLine("STMG HUB - Copie Devoir Surveille", 15, true, 18);
    writeLine(`Eleve : ${studentName}`, 11, true);
    writeLine(`Classe : ${profil?.classe || "non renseignee"}`);
    writeLine(`Date export : ${new Date().toLocaleString()}`);
    writeLine(`Statut anti-triche : ${dsForcedZero ? "DISQUALIFIE (sortie de page -> 0)" : "Conforme"}`, 11, true);
    writeLine(`Copie finale : ${dsFinalizedAt ? `validee le ${new Date(dsFinalizedAt).toLocaleString()}` : "non finalisee"}`);
    y += 6;

    dsExercises.forEach((exercise, idx) => {
      const submission = dsSubmissions[exercise.id];
      writeLine(`${idx + 1}. ${exercise.title}`, 12, true, 16);
      const questionMap = submission?.questions || {};
      const questionEntries = Object.entries(questionMap);
      if (!questionEntries.length && submission?.answer) {
        writeLine("Reponse unique :", 11, true);
        writeLine(submission.answer);
      } else if (!questionEntries.length) {
        writeLine("(aucune reponse)");
      } else {
        questionEntries.forEach(([qId, qData], qIndex) => {
          writeLine(`Q${qIndex + 1} (${qId})`, 11, true);
          writeLine(`Question : ${qData?.prompt || "non renseignee"}`);
          writeLine(`Validation : ${qData?.validatedAt ? new Date(qData.validatedAt).toLocaleString() : "non renseignee"}`);
          writeLine(`Reponse : ${qData?.answer || "(vide)"}`);
        });
      }
      y += 8;
    });

    const safeName = studentName.replace(/[^a-zA-Z0-9-_ ]/g, "").trim().replace(/\s+/g, "_") || "Eleve";
    docPdf.save(`copie-ds-${safeName}.pdf`);
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.page, color: COLORS.text, padding: "22px 14px 34px" }}>
      <style>
        {`
          .ob-card:hover { transform: translateY(-2px); box-shadow: 0 14px 26px rgba(15, 23, 42, 0.1); }
          .ob-btn { transition: transform 0.15s ease, filter 0.15s ease; }
          .ob-btn:hover { transform: translateY(-1px); filter: brightness(1.02); }
          .ob-pulse { animation: obPulse 1.4s infinite ease-in-out; }
          @keyframes obPulse {
            0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.35); }
            70% { box-shadow: 0 0 0 10px rgba(37, 99, 235, 0); }
            100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
          }
        `}
      </style>
      <div style={{ maxWidth: 1180, margin: "0 auto", display: "flex", flexDirection: "column", gap: 16 }}>
        {banner && (
          <div style={{ ...SHELL_CARD, borderColor: banner.type === "success" ? "#86EFAC" : "#FCA5A5", padding: "10px 12px", color: banner.type === "success" ? "#166534" : "#991B1B", fontWeight: 700 }}>
            {banner.text}
          </div>
        )}

        <header className="ob-card" style={{ ...SHELL_CARD, padding: 20, background: "linear-gradient(120deg, #DBEAFE 0%, #ECFEFF 45%, #FCE7F3 100%)" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "2rem", color: "#0B3B8F" }}>🎓 Objectif Bac - MSGN</h1>
          <p style={{ margin: 0, color: "#1E293B", lineHeight: 1.55 }}>
            Un espace clair, ludique et exigeant pour préparer l’épreuve écrite : méthode, entraînement sur cas, simulation 4h, correction IA et progression personnalisée.
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            <span style={{ background: "#1D4ED8", color: "white", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>XP actuel : {profil?.xp || 0}</span>
            <span style={{ background: "#16A34A", color: "white", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>Potentiel / jour : +{dailyXpPotential} XP</span>
            <span style={{ background: "#EA580C", color: "white", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>Objectif : méthodo automatisée</span>
            <span style={{ background: mastery.color, color: "white", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>Niveau : {mastery.label}</span>
          </div>
          <div style={{ marginTop: 12, display: "grid", gap: 8, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
            <div style={{ background: "rgba(255,255,255,0.72)", borderRadius: 12, padding: "10px 12px", border: "1px solid #BFDBFE" }}>
              <p style={{ margin: 0, color: "#1E3A8A", fontWeight: 800 }}>Progression du jour</p>
              <p style={{ margin: "2px 0 6px", color: "#0F172A", fontSize: 13 }}>{completedTodayCount}/{EXERCISES.length} exercices validés</p>
              <div style={{ height: 8, borderRadius: 999, background: "#DBEAFE", overflow: "hidden" }}>
                <div style={{ width: `${globalProgress}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #2563EB, #16A34A)", transition: "width 0.3s ease" }} />
              </div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.72)", borderRadius: 12, padding: "10px 12px", border: "1px solid #A7F3D0" }}>
              <p style={{ margin: 0, color: "#065F46", fontWeight: 800 }}>Répétitions cumulées</p>
              <p style={{ margin: "2px 0 0", color: "#14532D", fontSize: 26, fontWeight: 900 }}>{totalClaims}</p>
            </div>
            <div style={{ background: "rgba(255,255,255,0.72)", borderRadius: 12, padding: "10px 12px", border: "1px solid #FBCFE8" }}>
              <p style={{ margin: "0 0 5px", color: "#9D174D", fontWeight: 800 }}>Badges maîtrise</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {masteryBadges.map((badge) => (
                  <span key={badge.id} style={{ borderRadius: 999, padding: "4px 9px", fontSize: 12, fontWeight: 700, background: badge.unlocked ? "#16A34A" : "#E2E8F0", color: badge.unlocked ? "white" : "#475569" }}>
                    {badge.unlocked ? "🏅" : "🔒"} {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </header>

        <nav className="ob-card" style={{ ...SHELL_CARD, padding: 10, display: "flex", gap: 8, flexWrap: "wrap", position: "sticky", top: 8, zIndex: 5 }}>
          {SUBMENU.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                border: "none",
                borderRadius: 999,
                padding: "8px 13px",
                cursor: "pointer",
                fontWeight: 700,
                background: activeTab === tab.id ? COLORS.blue : "#E2E8F0",
                color: activeTab === tab.id ? "white" : "#0F172A",
              }}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === "vue" && (
          <>
            <section style={{ ...SHELL_CARD, padding: 16 }}>
              <p style={{ margin: "0 0 8px", color: "#B45309", fontWeight: 800 }}>Pourquoi le mode examen ?</p>
              <p style={{ margin: "0 0 10px", color: COLORS.muted, lineHeight: 1.6 }}>
                Cet outil sert à t’entraîner comme le jour J : respecter le temps, suivre les étapes méthodologiques dans l’ordre, et éviter les oublis qui coûtent des points.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 8 }}>
                {EXAM_STEPS.map((step) => (
                  <div key={step.id} style={{ background: "#F8FAFC", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 10 }}>
                    <p style={{ margin: 0, color: "#1D4ED8", fontWeight: 800 }}>{step.label}</p>
                    <p style={{ margin: "2px 0 0", color: "#475569", fontSize: 13 }}>{step.durationMin} min</p>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ ...SHELL_CARD, padding: 16 }}>
              <p style={{ margin: "0 0 8px", color: "#92400E", fontWeight: 800 }}>🧰 Coffre méthodo illustré</p>
              <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                <div style={{ width: 96, height: 78, borderRadius: 14, background: "linear-gradient(135deg, #FDBA74, #F59E0B)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44, border: "2px solid #B45309" }}>
                  {coffreOpen ? "🧰" : "🗝️"}
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <p style={{ margin: "0 0 6px", color: COLORS.muted }}>
                    Clique pour ouvrir le conseil du jour. Un seul conseil par jour pour mieux mémoriser.
                  </p>
                  <button
                    onClick={() => setCoffreOpen((v) => !v)}
                    style={{ border: "none", borderRadius: 10, padding: "9px 12px", background: coffreOpen ? COLORS.green : COLORS.orange, color: "white", fontWeight: 700, cursor: "pointer" }}
                  >
                    {coffreOpen ? "Fermer le coffre" : "Ouvrir le coffre"}
                  </button>
                </div>
              </div>
              {coffreOpen && (
                <div style={{ marginTop: 10, background: "#FFF7ED", border: "1px solid #FDBA74", borderRadius: 10, padding: 12 }}>
                  <p style={{ margin: "0 0 4px", color: "#9A3412", fontWeight: 800 }}>Conseil du jour</p>
                  <p style={{ margin: 0, color: "#7C2D12", lineHeight: 1.6 }}>{coffreConseil}</p>
                </div>
              )}
            </section>

            <section style={{ ...SHELL_CARD, padding: 16 }}>
              <p style={{ margin: "0 0 8px", color: "#166534", fontWeight: 800 }}>Priorités personnalisées</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: "#14532D", lineHeight: 1.6 }}>
                {recommandations.map((line) => <li key={line}>{line}</li>)}
              </ul>
            </section>
          </>
        )}

        {activeTab === "examen" && (
          <>
            <section style={{ ...SHELL_CARD, padding: 16 }}>
              <p style={{ margin: "0 0 8px", color: "#1D4ED8", fontWeight: 800 }}>Simulation 4h en conditions bac</p>
              <p style={{ margin: "0 0 10px", color: COLORS.muted }}>
                Lance le minuteur et suis les étapes ci-dessous. Le protocole est couplé au timer : c’est exactement la routine à reproduire devant la copie.
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <p style={{ margin: 0, color: "#1E3A8A", fontWeight: 800 }}>Phase actuelle : {EXAM_STEPS[examPhaseIndex].label}</p>
                  <p style={{ margin: "2px 0 0", fontSize: 30, fontWeight: 900, color: COLORS.text }}>{formatSeconds(examRemainingSec)}</p>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => setExamRunning((v) => !v)} style={{ border: "none", borderRadius: 10, padding: "9px 12px", background: examRunning ? COLORS.rose : COLORS.blue, color: "white", fontWeight: 700, cursor: "pointer" }}>
                    {examRunning ? "Pause" : "Démarrer"}
                  </button>
                  <button onClick={() => { setExamRunning(false); setExamRemainingSec(4 * 60 * 60); }} style={{ border: "none", borderRadius: 10, padding: "9px 12px", background: "#334155", color: "white", fontWeight: 700, cursor: "pointer" }}>
                    Réinitialiser
                  </button>
                </div>
              </div>
              <div style={{ marginTop: 10, height: 10, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
                <div style={{ width: `${examProgress}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #2563EB, #16A34A)" }} />
              </div>
              <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 12 }}>Progression du temps : {examProgress}%</p>
            </section>

            <section style={{ ...SHELL_CARD, padding: 16 }}>
              <p style={{ margin: "0 0 10px", color: "#0891B2", fontWeight: 800 }}>Protocole jour J (à cocher)</p>
              <div style={{ display: "grid", gap: 8 }}>
                {EXAM_STEPS.map((step, idx) => {
                  const isCurrent = idx === examPhaseIndex;
                  return (
                  <label key={step.id} className={isCurrent && examRunning ? "ob-pulse" : ""} style={{ background: isCurrent ? "#EFF6FF" : "#F8FAFC", border: `1px solid ${isCurrent ? "#60A5FA" : COLORS.border}`, borderRadius: 10, padding: 10, display: "flex", gap: 10, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={examStepState[step.id]}
                      onChange={(e) => setExamStepState((prev) => ({ ...prev, [step.id]: e.target.checked }))}
                      style={{ marginTop: 2 }}
                    />
                    <div>
                      <p style={{ margin: 0, color: isCurrent ? "#1D4ED8" : "#0C4A6E", fontWeight: 800 }}>
                        {step.label} ({step.durationMin} min) {isCurrent ? "• phase en cours" : ""}
                      </p>
                      <p style={{ margin: "2px 0 0", color: "#334155", fontSize: 14 }}>{step.action}</p>
                    </div>
                  </label>
                )})}
              </div>
              <p style={{ margin: "8px 0 0", color: "#0F766E", fontWeight: 700 }}>
                Étapes validées : {Object.values(examStepState).filter(Boolean).length}/{EXAM_STEPS.length}
              </p>
            </section>
          </>
        )}

        {activeTab === "entrainements" && (
          <>
            {hasDsPack && !dsUnlocked && (
              <section style={{ ...SHELL_CARD, padding: 16, border: "1px solid #F59E0B", background: "#FFFBEB" }}>
                <p style={{ margin: "0 0 8px", color: "#92400E", fontWeight: 800 }}>🔐 Sujet DS verrouillé</p>
                <p style={{ margin: "0 0 10px", color: "#78350F", lineHeight: 1.55 }}>
                  Le pack « {DS_LOCK_TYPE} » est caché tant que le code d’accès n’est pas saisi.
                </p>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <input
                    type="password"
                    value={dsCodeInput}
                    onChange={(e) => setDsCodeInput(e.target.value)}
                    placeholder="Entrer le code DS"
                    style={{
                      flex: "1 1 240px",
                      borderRadius: 10,
                      border: `1px solid ${COLORS.border}`,
                      padding: "9px 11px",
                      fontSize: 14,
                      background: "white",
                    }}
                  />
                  <button
                    className="ob-btn"
                    onClick={unlockDsPack}
                    style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: "pointer", fontWeight: 700, background: COLORS.orange, color: "white" }}
                  >
                    Déverrouiller le DS
                  </button>
                </div>
              </section>
            )}
            {hasDsPack && dsUnlocked && !dsForcedZero && (
              <section style={{ ...SHELL_CARD, padding: 12, border: "1px solid #F59E0B", background: "#FFFBEB" }}>
                <p style={{ margin: 0, color: "#92400E", fontWeight: 800 }}>
                  🛡️ Règle DS : quitter l’onglet/la page (perte de focus) entraîne directement la note 0.
                </p>
              </section>
            )}
            {hasDsPack && dsUnlocked && (
              <section style={{ ...SHELL_CARD, padding: 12, border: "1px solid #FCD34D", background: "#FFFBEB", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <p style={{ margin: 0, color: "#92400E", fontWeight: 700 }}>
                  Étape finale DS : valider chaque question puis cliquer sur « Valider ma copie ».
                </p>
                <button
                  className="ob-btn"
                  onClick={finalizeDsCopy}
                  disabled={!canFinalizeDsCopy}
                  style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: canFinalizeDsCopy ? "pointer" : "not-allowed", fontWeight: 800, background: canFinalizeDsCopy ? COLORS.orange : "#CBD5E1", color: "white" }}
                >
                  {dsFinalizedAt ? "Copie déjà validée" : "Valider ma copie (final)"}
                </button>
              </section>
            )}
            {dsForcedZero && (
              <section style={{ ...SHELL_CARD, padding: 12, border: "1px solid #FCA5A5", background: "#FEF2F2" }}>
                <p style={{ margin: 0, color: "#991B1B", fontWeight: 800 }}>
                  ❌ DS disqualifié : sortie de page détectée, note forcée à 0.
                </p>
              </section>
            )}
            {hasDsPack && dsUnlocked && profil?.role === "admin" && (
              <section style={{ ...SHELL_CARD, padding: 12, border: "1px solid #93C5FD", background: "#EFF6FF", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <p style={{ margin: 0, color: "#1E3A8A", fontWeight: 700 }}>
                  Export enseignant : télécharger la copie DS de cet élève en PDF.
                </p>
                <button
                  className="ob-btn"
                  onClick={downloadDsPdf}
                  style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: "pointer", fontWeight: 700, background: COLORS.blue, color: "white" }}
                >
                  Télécharger la copie PDF
                </button>
              </section>
            )}

            <section style={{ ...SHELL_CARD, padding: 16 }}>
              <p style={{ margin: "0 0 8px", color: "#1D4ED8", fontWeight: 800 }}>Filtrer les exercices</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {availableTypes.map((type) => (
                  <button
                    className="ob-btn"
                    key={type}
                    onClick={() => setSelectedType(type)}
                    style={{ border: "none", borderRadius: 999, padding: "7px 12px", cursor: "pointer", fontWeight: 700, background: selectedType === type ? COLORS.blue : "#E2E8F0", color: selectedType === type ? "white" : "#0F172A" }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </section>

            <section style={{ display: "grid", gap: 12 }}>
              {filteredExercises.map((exercise) => (
                exercise.type === DS_LOCK_TYPE ? (
                  <DsExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    forceZero={dsForcedZero}
                    copyFinalized={Boolean(dsFinalizedAt)}
                    answerDrafts={dsDraftAnswers[exercise.id] || {}}
                    lockedQuestions={(dsSubmissions[exercise.id] && dsSubmissions[exercise.id].questions) || {}}
                    onDraftChange={handleDsDraftChange}
                    onValidateQuestion={handleDsValidateQuestion}
                  />
                ) : (
                  <ExerciseCard
                    key={exercise.id}
                    exercise={exercise}
                    status={claimState[exercise.id]}
                    onClaimXP={handleClaimXP}
                    onEvaluateResponse={handleEvaluateResponse}
                    forceZero={false}
                    isDsExercise={false}
                    onDsSubmit={undefined}
                  />
                )
              ))}
            </section>
          </>
        )}

        {activeTab === "methodo" && (
          <>
            <section style={{ ...SHELL_CARD, padding: 16 }}>
              <p style={{ margin: "0 0 10px", color: "#1D4ED8", fontWeight: 800 }}>Quiz verbes directeurs (cas concrets)</p>
              <p style={{ margin: "0 0 8px", color: COLORS.muted, lineHeight: 1.6 }}>
                Le but : comprendre exactement ce que demande le verbe de la consigne, avec des exemples d’annales.
              </p>
              <p style={{ margin: "0 0 8px", color: COLORS.text, lineHeight: 1.55 }}>
                <strong>{currentQuiz.verbe}</strong> — {currentQuiz.question}
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {currentQuiz.options.map((option, idx) => (
                  <button
                    key={option}
                    onClick={() => setQuizChoice(idx)}
                    style={{ border: `1px solid ${quizChoice === idx ? "#60A5FA" : COLORS.border}`, background: quizChoice === idx ? "#DBEAFE" : "#F8FAFC", color: COLORS.text, borderRadius: 10, padding: "9px 11px", textAlign: "left", cursor: "pointer", fontWeight: 600 }}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button onClick={validateVerbQuiz} disabled={quizChoice === null} style={{ border: "none", borderRadius: 10, padding: "8px 12px", cursor: quizChoice === null ? "not-allowed" : "pointer", background: quizChoice === null ? "#CBD5E1" : COLORS.blue, color: "white", fontWeight: 700 }}>
                  Valider
                </button>
                <button onClick={nextVerbQuestion} style={{ border: "none", borderRadius: 10, padding: "8px 12px", background: COLORS.violet, color: "white", fontWeight: 700, cursor: "pointer" }}>
                  Question suivante
                </button>
              </div>
              <p style={{ margin: "8px 0 0", color: quizFeedback === "Bonne réponse." ? "#166534" : "#991B1B", minHeight: 20 }}>
                {quizFeedback ? `${quizFeedback} ${currentQuiz.explication}` : ""}
              </p>
              <p style={{ margin: 0, color: "#64748B", fontSize: 13 }}>Score session : {quizScore.ok}/{quizScore.total}</p>
              <div style={{ marginTop: 8, height: 8, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
                <div
                  style={{
                    width: `${Math.min(100, Math.round(((quizIndex + 1) / VERB_QUIZ.length) * 100))}%`,
                    height: "100%",
                    borderRadius: 999,
                    background: "linear-gradient(90deg, #2563EB, #7C3AED)",
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 12 }}>
                Progression quiz : question {quizIndex + 1}/{VERB_QUIZ.length}
              </p>
            </section>

            <section style={{ ...SHELL_CARD, padding: 16 }}>
              <p style={{ margin: "0 0 10px", color: "#BE123C", fontWeight: 800 }}>Défi management (sans indice)</p>
              <button
                onClick={drawDefi}
                style={{ border: "none", borderRadius: 10, padding: "9px 12px", background: COLORS.rose, color: "white", fontWeight: 700, cursor: "pointer" }}
              >
                Tirer un défi
              </button>
              {defi && (
                <div style={{ marginTop: 10, background: "#FFF1F2", border: "1px solid #FDA4AF", borderRadius: 10, padding: 12 }}>
                  <p style={{ margin: "0 0 6px", color: "#9F1239", fontWeight: 800 }}>{defi.theme}</p>
                  <p style={{ margin: 0, color: "#881337", lineHeight: 1.55 }}>{defi.consigne}</p>
                  <button
                    onClick={() => setShowDefiCorrection((v) => !v)}
                    style={{ marginTop: 8, border: "none", borderRadius: 10, padding: "8px 11px", background: showDefiCorrection ? COLORS.green : COLORS.blue, color: "white", fontWeight: 700, cursor: "pointer" }}
                  >
                    {showDefiCorrection ? "Masquer la correction" : "Cliquer pour afficher la correction"}
                  </button>
                  {showDefiCorrection && (
                    <p style={{ margin: "8px 0 0", color: "#14532D", lineHeight: 1.55 }}>
                      {defi.correction}
                    </p>
                  )}
                </div>
              )}
            </section>

            <section style={{ ...SHELL_CARD, padding: 16 }}>
              <p style={{ margin: "0 0 8px", color: "#0369A1", fontWeight: 800 }}>Checklist interactive — Question de synthèse</p>
              <p style={{ margin: "0 0 8px", color: COLORS.muted }}>
                Cet outil est uniquement pour la question de synthèse (15 lignes). Il t’aide à vérifier que ta copie respecte les attendus du correcteur.
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 8 }}>
                {SYNTHESIS_CHECK.map((line, i) => (
                  <label key={line} style={{ background: "#F8FAFC", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "9px 10px", display: "flex", gap: 8, alignItems: "flex-start", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={Boolean(synthChecklist[i])}
                      onChange={(e) => setSynthChecklist((prev) => ({ ...prev, [i]: e.target.checked }))}
                      style={{ marginTop: 2 }}
                    />
                    <span style={{ color: "#1F2937" }}>{line}</span>
                  </label>
                ))}
              </div>
              <p style={{ margin: "8px 0 0", color: "#0F766E", fontWeight: 700 }}>
                Progression synthèse : {Object.values(synthChecklist).filter(Boolean).length}/{SYNTHESIS_CHECK.length}
              </p>
            </section>

            <section style={{ ...SHELL_CARD, padding: 16 }}>
              <p style={{ margin: "0 0 8px", color: "#0E7490", fontWeight: 800 }}>Qualificateur de décision</p>
              <p style={{ margin: "0 0 8px", color: "#1F2937" }}>{currentDecision.cas}</p>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[
                  { id: "stratégique", label: "Stratégique" },
                  { id: "tactique", label: "Tactique" },
                  { id: "opérationnelle", label: "Opérationnelle" },
                ].map((choice) => (
                <button
                  className="ob-btn"
                    key={choice.id}
                    onClick={() => setDecisionChoice(choice.id)}
                    style={{ border: "none", borderRadius: 999, padding: "8px 12px", cursor: "pointer", fontWeight: 700, background: decisionChoice === choice.id ? COLORS.cyan : "#E2E8F0", color: decisionChoice === choice.id ? "white" : "#0F172A" }}
                  >
                    {choice.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={validateDecision} disabled={!decisionChoice} style={{ border: "none", borderRadius: 10, padding: "8px 11px", cursor: decisionChoice ? "pointer" : "not-allowed", background: decisionChoice ? COLORS.blue : "#CBD5E1", color: "white", fontWeight: 700 }}>
                  Valider
                </button>
                <button onClick={() => { setDecisionIndex((prev) => (prev + 1) % DECISION_CASES.length); setDecisionChoice(null); setDecisionFeedback(null); }} style={{ border: "none", borderRadius: 10, padding: "8px 11px", background: COLORS.violet, color: "white", fontWeight: 700, cursor: "pointer" }}>
                  Cas suivant
                </button>
              </div>
              {decisionFeedback && (
                <p style={{ margin: "8px 0 0", color: decisionFeedback === "Bonne qualification." ? "#166534" : "#991B1B" }}>
                  {decisionFeedback} {currentDecision.correction}
                </p>
              )}
            </section>

            <section style={{ ...SHELL_CARD, padding: 16 }}>
              <p style={{ margin: "0 0 10px", color: "#7C2D12", fontWeight: 800 }}>Autoévaluation méthodologique</p>
              <div style={{ display: "grid", gap: 8 }}>
                {AUTOEVAL_ITEMS.map((item) => (
                  <div key={item.id} style={{ background: "#F8FAFC", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 10 }}>
                    <p style={{ margin: "0 0 6px", color: "#1F2937" }}>{item.text}</p>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {[
                        { id: "toujours", label: "Toujours", color: "#16A34A" },
                        { id: "pas_toujours", label: "Pas toujours", color: "#D97706" },
                        { id: "jamais", label: "Jamais", color: "#DC2626" },
                      ].map((choice) => (
                        <button
                          key={choice.id}
                          onClick={() => setAutoEval((prev) => ({ ...prev, [item.id]: choice.id }))}
                          style={{ border: "none", borderRadius: 999, padding: "7px 11px", cursor: "pointer", fontWeight: 700, background: autoEval[item.id] === choice.id ? choice.color : "#E2E8F0", color: autoEval[item.id] === choice.id ? "white" : "#0F172A" }}
                        >
                          {choice.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ margin: "8px 0 0", color: "#92400E", fontWeight: 700 }}>
                Toujours: {autoEvalStats.toujours} · Pas toujours: {autoEvalStats.pas_toujours} · Jamais: {autoEvalStats.jamais}
              </p>
              <p style={{ margin: "4px 0 0", color: "#7C2D12" }}>{autoEvalDiagnostic}</p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}

