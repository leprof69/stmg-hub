import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const COLORS = {
  page: "#F8FAFC",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  muted: "#475569",
  blue: "#2563EB",
  green: "#16A34A",
  orange: "#EA580C",
  red: "#DC2626",
};

const FOCUS_PROGRESS_VERSION = 2;

const EXERCISES = [
  {
    id: "focus-6-1",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 1,
    type: "Repérage",
    xp: 40,
    title: "Radar des données Pokémon",
    consigne:
      "Repère 6 sources de masses de données dans l'univers Pokémon (ex: combats en ligne, mails, réseaux, achats) et explique pourquoi elles alimentent le Big Data.",
    correction:
      "Des flux comme combats, objets achetés, messages, géolocalisation et interactions sociales génèrent un volume élevé et continu de données: c'est une base Big Data.",
    expectedKeywords: ["big", "data", "volume", "donnees", "reseaux", "mails", "achats", "combats"],
    expectedNumbers: [6],
  },
  {
    id: "focus-6-2",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 2,
    type: "Notions",
    xp: 50,
    title: "Les 5V de la PokéLigue",
    consigne: "Définis les 5V du Big Data et donne un exemple Pokémon pour chacun.",
    correction:
      "Volume, vélocité, variété, véracité et valeur: ces 5 dimensions décrivent la nature du Big Data et son potentiel pour la décision.",
    expectedKeywords: ["volume", "velocite", "variete", "veracite", "valeur", "big", "data"],
    expectedNumbers: [5],
  },
  {
    id: "focus-6-3",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 3,
    type: "Open Data",
    xp: 60,
    title: "Open Data de Kanto",
    consigne:
      "Explique ce qu'est l'open data et cite 3 caractéristiques essentielles à respecter pour une ville Pokémon.",
    correction:
      "L'open data correspond à des données mises à disposition publiquement: accessibles, réutilisables et diffusables.",
    expectedKeywords: ["open", "data", "accessible", "reutilisable", "diffusion", "public"],
    expectedNumbers: [3],
  },
  {
    id: "focus-6-4",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 4,
    type: "Réglementation",
    xp: 70,
    title: "Règle des 3 500 habitants",
    consigne:
      "Quelle obligation concerne les collectivités de plus de 3 500 habitants en open data ? Réponds en prenant l'exemple de Safrania.",
    correction:
      "La collectivité doit publier ses données sur Internet pour assurer transparence et réutilisation.",
    expectedKeywords: ["collectivites", "3500", "publier", "internet", "reutilisation", "transparence"],
    expectedNumbers: [3500],
  },
  {
    id: "focus-6-5",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 5,
    type: "Définition",
    xp: 80,
    title: "Donnée personnelle dresseur",
    consigne:
      "Définis une donnée personnelle et donne 4 exemples de données personnelles dans une appli Pokémon.",
    correction:
      "Une donnée personnelle identifie directement ou indirectement une personne (nom, numéro, photo, mail, etc.).",
    expectedKeywords: ["donnee", "personnelle", "identifier", "nom", "photo", "mail", "numero"],
    expectedNumbers: [4],
  },
  {
    id: "focus-6-6",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 6,
    type: "Gestion",
    xp: 90,
    title: "Ticket de caisse PokéMart",
    consigne:
      "À partir d'un ticket de caisse Pokémon, identifie les données utiles pour faire un bilan de journée et propose une décision de gestion.",
    correction:
      "Les données de prix, quantité, code article et heure permettent de calculer ventes et stock, puis d'ajuster les commandes.",
    expectedKeywords: ["prix", "quantite", "code", "article", "ventes", "stock", "decision"],
  },
  {
    id: "focus-6-7",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 7,
    type: "Chaîne de valeur",
    xp: 100,
    title: "De la donnée à la connaissance",
    consigne:
      "Explique la chaîne donnée -> information -> connaissance avec l'exemple d'un chiffre d'affaires mensuel de 10 000 Pokedollars.",
    correction:
      "Donnée: 10 000. Information: CA du mois. Connaissance: le manager interprète et agit (promotion, réassort, etc.).",
    expectedKeywords: ["donnee", "information", "connaissance", "contextualisation", "interpretation", "decision", "chiffre", "affaires"],
    expectedNumbers: [10000],
  },
  {
    id: "focus-6-8",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 8,
    type: "SI",
    xp: 110,
    title: "SI de la Ligue Pokémon",
    consigne:
      "Décris le rôle du système d'information: collecte, stockage, traitement et diffusion. Ajoute le rôle des acteurs humains.",
    correction:
      "Le SI transforme la donnée en information exploitable grâce aux ressources techniques et humaines, puis soutient la décision.",
    expectedKeywords: ["si", "collecte", "stockage", "traitement", "diffusion", "acteurs", "decision"],
  },
  {
    id: "focus-6-9",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 9,
    type: "Qualité",
    xp: 120,
    title: "Qualité d'info du Pokédex",
    consigne:
      "Donne 6 critères de qualité de l'information (ex: fiabilité, objectivité, actualité...) et explique pourquoi ils créent de la valeur.",
    correction:
      "Une information utile doit être fiable, pertinente, récente, objective, rentable et rapidement accessible.",
    expectedKeywords: ["fiable", "objective", "actualite", "pertinence", "rentabilite", "acces", "valeur"],
    expectedNumbers: [6],
  },
  {
    id: "focus-6-10",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 10,
    type: "Étude de cas",
    xp: 130,
    title: "Erreur de commande chez Bois Brut",
    consigne:
      "Analyse un cas de mauvaise information (commande mal saisie) et montre 3 conséquences possibles pour l'entreprise Pokémon.",
    correction:
      "Une donnée de mauvaise qualité peut provoquer erreur logistique, litige client et perte financière ou d'image.",
    expectedKeywords: ["qualite", "erreur", "commande", "client", "perte", "decision", "information"],
    expectedNumbers: [3],
  },
  {
    id: "focus-6-11",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 11,
    type: "RGPD",
    xp: 145,
    title: "RGPD anti Team Rocket",
    consigne:
      "Présente 4 obligations RGPD que doit respecter une organisation qui collecte des données de dresseurs.",
    correction:
      "Exemples: finalité claire, minimisation, information des personnes, sécurité, durée de conservation, droit d'accès/suppression.",
    expectedKeywords: ["rgpd", "finalite", "information", "securite", "conservation", "droit", "suppression"],
    expectedNumbers: [4],
  },
  {
    id: "focus-6-12",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 12,
    type: "Données personnelles",
    xp: 160,
    title: "DMP de dresseur",
    consigne:
      "Explique l'utilité d'un dossier medical partage (DMP) et précise qui peut y accéder dans le respect des droits de la personne.",
    correction:
      "Le DMP centralise les informations de santé pour améliorer le suivi; l'accès est encadré et contrôlé par les droits du patient.",
    expectedKeywords: ["dmp", "acces", "sante", "dossier", "droits", "protection", "information"],
  },
  {
    id: "focus-6-13",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 13,
    type: "Appliquer",
    xp: 175,
    title: "Kibali en ligne",
    consigne:
      "À partir du cas Kibali, identifie les données strictement nécessaires pour traiter une commande sans collecter d'informations inutiles.",
    correction:
      "Le principe RGPD impose de limiter la collecte aux données nécessaires à la finalité (commande, paiement, livraison).",
    expectedKeywords: ["kibali", "commande", "livraison", "finalite", "necessaires", "rgpd", "collecte"],
  },
  {
    id: "focus-6-14",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 14,
    type: "Vrai/Faux argumenté",
    xp: 190,
    title: "SF-Tester Pokémon",
    consigne:
      "Rédige 5 affirmations vraies ou fausses argumentées sur open data, données personnelles, mégadonnées, SI et prise de décision.",
    correction:
      "Une bonne réponse mobilise les notions du chapitre et justifie clairement chaque affirmation.",
    expectedKeywords: ["open", "data", "personnelles", "big", "si", "decision", "justifier"],
    expectedNumbers: [5],
  },
  {
    id: "focus-6-15",
    matiere: "SDGN",
    theme: "Thème 2",
    chapter: "Chapitre 6",
    difficulty: 15,
    type: "Synthèse",
    xp: 220,
    title: "Cahier de vacances final Pokémon",
    consigne:
      "Rédige une synthèse de 15 lignes: comment les technologies transforment l'information en ressource stratégique, avec limites de qualité, accessibilité et RGPD.",
    correction:
      "La synthèse relie masses de données, SI, transformation en connaissance et décision, puis expose les limites (qualité, accès, contraintes juridiques).",
    expectedKeywords: ["technologies", "information", "ressource", "si", "connaissance", "decision", "qualite", "rgpd", "limites"],
    expectedNumbers: [15],
  },
];

const normalize = (v = "") =>
  String(v)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s%€]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const SYNONYM_GROUPS = [
  ["definir", "fixer", "determiner", "etablir", "preciser"],
  ["objectif", "objectifs", "but", "cible", "finalite"],
  ["resultat", "resultats", "issue", "issues"],
  ["atteinte", "realisation", "accomplissement"],
  ["analyse", "analyser", "interprete", "interpreter", "interpretation", "conclure", "conclusion"],
  ["chiffre", "ca", "chiffre affaires", "chiffre d affaires"],
  ["rentabilite", "rendement"],
  ["profitabilite", "marge nette"],
  ["indicateur", "indicateurs", "kpi", "kpis"],
];

const canonicalize = (text = "") => {
  let out = normalize(text);
  SYNONYM_GROUPS.forEach((group) => {
    const canonical = group[0];
    group.forEach((variant) => {
      const escaped = normalize(variant).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      out = out.replace(new RegExp(`\\b${escaped}\\b`, "g"), canonical);
    });
  });
  return out;
};

const deriveChapter = (exercise) => {
  if (exercise?.chapter) return exercise.chapter;
  const id = String(exercise?.id || "");
  if (id.startsWith("focus-6-")) return "Chapitre 6";
  return "Sans chapitre";
};

const CHAPTER_CONTENT = {
  "Chapitre 6": {
    heroTitle: "🎯 Focus — SDGN 1ère · Chapitre 6",
    heroText:
      "Cahier de vacances interactif: rôle des technologies dans la transformation de l'information en ressource, version Pokémon (définitions, applications, RGPD, synthèse).",
    notions: "Notions: donnée, information, SI, Big Data, open data, RGPD",
  },
};

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const extractNumbers = (text = "") => {
  const matches = String(text).match(/-?\d+(?:[.,]\d+)?/g) || [];
  return matches.map((m) => Number(m.replace(",", "."))).filter((n) => Number.isFinite(n));
};

const evaluate = (exercise, answer) => {
  const clean = canonicalize(answer);
  if (!clean) {
    return {
      score: 0,
      pointsForts: "Réponse vide.",
      aAmeliorer: "Rédige une première version structurée.",
      reperes: [],
      mention: "À travailler",
    };
  }

  const expectedNormalized = exercise.expectedKeywords.map((k) => canonicalize(k));
  const foundKeywords = expectedNormalized.filter((k) => clean.includes(k));
  const keywordRatio = expectedNormalized.length ? foundKeywords.length / expectedNormalized.length : 0;

  let numberRatio = 1;
  let missingNumbers = [];
  if (exercise.expectedNumbers?.length) {
    const responseNumbers = extractNumbers(answer);
    const matched = exercise.expectedNumbers.filter((expected) =>
      responseNumbers.some((n) => Math.abs(n - expected) <= Math.max(0.5, Math.abs(expected) * 0.02))
    );
    numberRatio = matched.length / exercise.expectedNumbers.length;
    missingNumbers = exercise.expectedNumbers.filter((n) => !matched.includes(n));
  }

  const hasAnalysis = /(analyse|interpre|cela signifie|on peut conclure|donc|ce resultat|impact|montre que|indique que)/i.test(clean);
  const structureBonus = answer.length >= 120 ? 1.2 : answer.length >= 80 ? 0.9 : answer.length >= 40 ? 0.6 : 0.3;
  const analysisBonus = exercise.type === "Calcul" ? (hasAnalysis ? 1.2 : 0.5) : hasAnalysis ? 0.8 : 0.5;
  const rawScore = (keywordRatio * 5.2) + (numberRatio * 2.8) + structureBonus + analysisBonus;
  const tentativeFloor = answer.trim().length >= 35 ? 2 : 0;
  const partialCoverage = Math.max(keywordRatio, numberRatio);
  const partialFloor = partialCoverage >= 0.66 ? 6 : partialCoverage >= 0.33 ? 4 : 0;
  const score = Math.max(tentativeFloor, partialFloor, Math.min(10, Math.round(rawScore * 10) / 10));

  const mention = score >= 8 ? "Très bien" : score >= 6 ? "Bon travail" : score >= 4 ? "Passable" : "À travailler";
  const missingKeywords = expectedNormalized.filter((k) => !foundKeywords.includes(k)).slice(0, 4);

  return {
    score,
    mention,
    pointsForts: foundKeywords.length ? `Notions repérées : ${foundKeywords.slice(0, 5).join(", ")}.` : "Tu as tenté de répondre.",
    aAmeliorer:
      missingKeywords.length || missingNumbers.length
        ? `À ajouter : ${[
            missingKeywords.length ? `mots-clés (${missingKeywords.join(", ")})` : "",
            missingNumbers.length ? `résultats numériques (${missingNumbers.join(", ")})` : "",
          ]
            .filter(Boolean)
            .join(" ; ")}.`
        : "Réponse complète et bien orientée.",
    reperes: foundKeywords.slice(0, 5),
  };
};

function FocusCard({ exercise, claim, onClaimXP }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localInfo, setLocalInfo] = useState("");
  const [answerLocked, setAnswerLocked] = useState(false);

  const canEvaluate = answer.trim().length >= 25 && !answerLocked;
  const today = getTodayKey();
  const alreadyClaimed = claim?.lastClaimDate === today;
  const canClaim = !alreadyClaimed && result && result.score >= 5;
  const claimHint = alreadyClaimed
    ? "XP déjà validés aujourd’hui pour cet exercice."
    : !result
      ? "Corrige d’abord ta réponse."
      : result.score < 5
        ? "Score minimum requis : 5/10 pour valider l’XP."
        : "";

  const validate = () => {
    const next = evaluate(exercise, answer);
    setResult(next);
    setAnswerLocked(true);
  };

  const claimXp = async () => {
    if (!canClaim) {
      setLocalInfo(claimHint || "Validation impossible pour le moment.");
      return;
    }
    setLoading(true);
    try {
      const ok = await onClaimXP(exercise.id, exercise.xp);
      if (!ok) setLocalInfo("Échec de validation. Vérifie la connexion et réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="focus-card" style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16 }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#DBEAFE", color: "#1D4ED8", fontWeight: 700, fontSize: 12 }}>
          Niveau {exercise.difficulty}
        </span>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#F3E8FF", color: "#6D28D9", fontWeight: 700, fontSize: 12 }}>
          {exercise.type}
        </span>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#DCFCE7", color: "#166534", fontWeight: 700, fontSize: 12 }}>
          +{exercise.xp} XP
        </span>
      </div>

      <h3 className="focus-title" style={{ margin: "0 0 6px", color: COLORS.text }}>{exercise.title}</h3>
      <p style={{ margin: 0, color: COLORS.muted, lineHeight: 1.5 }}>{exercise.consigne}</p>

      <textarea
        value={answer}
        onChange={(e) => {
          if (answerLocked) return;
          setAnswer(e.target.value);
        }}
        readOnly={answerLocked}
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
        placeholder="Rédige ta réponse..."
        style={{
          width: "100%",
          marginTop: 10,
          minHeight: 115,
          borderRadius: 10,
          border: `1px solid ${COLORS.border}`,
          padding: 10,
          fontSize: 14,
          color: COLORS.text,
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

      <div className="focus-actions" style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <button
          className="focus-btn"
          onClick={validate}
          disabled={!canEvaluate}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "8px 11px",
            fontWeight: 700,
            cursor: canEvaluate ? "pointer" : "not-allowed",
            background: canEvaluate ? COLORS.blue : "#CBD5E1",
            color: "white",
          }}
        >
          Corriger ma réponse
        </button>
        <button
          className="focus-btn"
          onClick={claimXp}
          disabled={!canClaim || loading}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "8px 11px",
            fontWeight: 700,
            cursor: canClaim && !loading ? "pointer" : "not-allowed",
            background: canClaim ? COLORS.green : "#CBD5E1",
            color: "white",
          }}
        >
          {alreadyClaimed ? "XP déjà gagné aujourd’hui" : loading ? "Validation..." : `Valider +${exercise.xp} XP`}
        </button>
      </div>
      {(claimHint || localInfo) && (
        <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 12 }}>
          {localInfo || claimHint}
        </p>
      )}

      {result && (
        <div style={{ marginTop: 10, borderRadius: 10, border: "1px solid #BFDBFE", background: "#EFF6FF", padding: 10 }}>
          <p style={{ margin: 0, color: "#1E3A8A", fontWeight: 800 }}>Score: {result.score}/10 — {result.mention}</p>
          <p style={{ margin: "6px 0 0", color: "#166534" }}><strong>Points forts:</strong> {result.pointsForts}</p>
          <p style={{ margin: "6px 0 0", color: "#9A3412" }}><strong>À améliorer:</strong> {result.aAmeliorer}</p>
          <div style={{ marginTop: 8, borderRadius: 10, border: "1px solid #FCD34D", background: "#FFFBEB", padding: 10 }}>
            <p style={{ margin: 0, color: "#92400E" }}><strong>Correction attendue:</strong> {exercise.correction}</p>
            <p style={{ margin: "6px 0 0", color: "#7C2D12", fontSize: 13 }}>
              <strong>Explication simple:</strong> compare toujours ton résultat à la question posée, puis termine par une phrase d’interprétation ("ce que cela veut dire pour l’organisation").
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Focus({ profil, onXPGagne }) {
  const [claims, setClaims] = useState({});
  const [banner, setBanner] = useState(null);
  const [matiereSelectionnee, setMatiereSelectionnee] = useState("SDGN");
  const [themeSelectionne, setThemeSelectionne] = useState("Thème 2");
  const [chapitreSelectionne, setChapitreSelectionne] = useState("Chapitre 6");

  const matieres = useMemo(() => Array.from(new Set(EXERCISES.map((ex) => ex.matiere || "SDGN"))), []);
  const themes = useMemo(
    () => Array.from(new Set(EXERCISES.filter((ex) => (ex.matiere || "SDGN") === matiereSelectionnee).map((ex) => ex.theme || "Sans thème"))),
    [matiereSelectionnee]
  );
  const chapitres = useMemo(
    () =>
      Array.from(
        new Set(
          EXERCISES.filter(
            (ex) => (ex.matiere || "SDGN") === matiereSelectionnee && (ex.theme || "Sans thème") === themeSelectionne
          ).map((ex) => deriveChapter(ex))
        )
      ),
    [matiereSelectionnee, themeSelectionne]
  );
  const exercicesFiltres = useMemo(
    () =>
      EXERCISES
        .filter(
          (ex) =>
            (ex.matiere || "SDGN") === matiereSelectionnee &&
            (ex.theme || "Sans thème") === themeSelectionne &&
            deriveChapter(ex) === chapitreSelectionne
        )
        .sort((a, b) => a.difficulty - b.difficulty),
    [matiereSelectionnee, themeSelectionne, chapitreSelectionne]
  );
  const xpPotential = useMemo(() => exercicesFiltres.reduce((sum, ex) => sum + ex.xp, 0), [exercicesFiltres]);
  const chapterUI = CHAPTER_CONTENT[chapitreSelectionne] || CHAPTER_CONTENT["Chapitre 6"];

  useEffect(() => {
    if (!themes.includes(themeSelectionne)) {
      setThemeSelectionne(themes[0] || "Thème 3");
    }
  }, [themes, themeSelectionne]);

  useEffect(() => {
    if (!chapitres.includes(chapitreSelectionne)) {
      setChapitreSelectionne(chapitres[0] || "Sans chapitre");
    }
  }, [chapitres, chapitreSelectionne]);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) return;
        const progress = snap.data()?.focusProgress || {};
        const isCurrent = progress?.version === FOCUS_PROGRESS_VERSION;
        setClaims(isCurrent ? progress.claims || {} : {});
      } catch (err) {
        console.error("Chargement focus impossible", err);
      }
    };
    load();
  }, []);

  const handleClaimXP = async (exerciseId, xp) => {
    const user = auth.currentUser;
    if (!user) {
      setBanner({ type: "error", text: "Session expirée. Reconnecte-toi pour valider l’XP." });
      return false;
    }
    try {
      const today = getTodayKey();
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setBanner({ type: "error", text: "Profil introuvable. Recharge la page." });
        return false;
      }
      const data = snap.data();
      const storedProgress = data.focusProgress || {};
      const prevClaims = storedProgress?.version === FOCUS_PROGRESS_VERSION ? (storedProgress.claims || {}) : {};
      if (prevClaims[exerciseId]?.lastClaimDate === today) {
        setBanner({ type: "error", text: "XP déjà validés aujourd’hui pour cet exercice." });
        return false;
      }

      const nextClaims = {
        ...prevClaims,
        [exerciseId]: {
          lastClaimDate: today,
          totalClaims: (prevClaims[exerciseId]?.totalClaims || 0) + 1,
        },
      };

      await updateDoc(ref, {
        xp: (data.xp || 0) + xp,
        focusProgress: {
          ...(storedProgress || {}),
          version: FOCUS_PROGRESS_VERSION,
          chapter: `SDGN 1ère - ${chapitreSelectionne}`,
          claims: nextClaims,
        },
      });

      setClaims(nextClaims);
      setBanner({ type: "success", text: `+${xp} XP gagnés sur Focus.` });
      if (onXPGagne) onXPGagne();
      return true;
    } catch (err) {
      console.error("Validation XP Focus impossible", err);
      setBanner({ type: "error", text: "Validation impossible pour le moment. Vérifie la connexion puis réessaie." });
      return false;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.page, padding: "20px 14px 28px", color: COLORS.text }}>
      <style>
        {`
          .focus-card { padding: 16px; }
          .focus-title { font-size: 1.12rem; line-height: 1.35; }
          .focus-actions .focus-btn { min-height: 42px; }
          @media (max-width: 640px) {
            .focus-card { padding: 13px; border-radius: 14px; }
            .focus-title { font-size: 1rem; }
            .focus-hero { padding: 14px; border-radius: 14px; }
            .focus-hero-title { font-size: 1.25rem; line-height: 1.3; }
            .focus-hero-text { font-size: 0.92rem; }
            .focus-badges span { width: 100%; text-align: center; }
            .focus-actions { width: 100%; }
            .focus-actions .focus-btn { width: 100%; }
          }
          @media (max-width: 420px) {
            .focus-title { font-size: 0.96rem; }
            .focus-hero-title { font-size: 1.12rem; }
          }
        `}
      </style>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {banner && (
          <div style={{ background: banner.type === "success" ? "#DCFCE7" : "#FEE2E2", color: banner.type === "success" ? "#166534" : COLORS.red, border: `1px solid ${banner.type === "success" ? "#86EFAC" : "#FECACA"}`, borderRadius: 12, padding: "9px 12px", fontWeight: 700 }}>
            {banner.text}
          </div>
        )}

        <section className="focus-hero" style={{ background: "#FFFFFF", border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 18 }}>
          <h1 className="focus-hero-title" style={{ margin: "0 0 6px", color: "#1E3A8A" }}>{chapterUI.heroTitle}</h1>
          <p className="focus-hero-text" style={{ margin: 0, color: COLORS.muted, lineHeight: 1.55 }}>
            {chapterUI.heroText}
          </p>
          <div className="focus-badges" style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: "#DBEAFE", color: "#1D4ED8", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>{chapterUI.notions}</span>
            <span style={{ background: "#DCFCE7", color: "#166534", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>XP potentiel/jour: +{xpPotential}</span>
            <span style={{ background: "#FEF3C7", color: "#92400E", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>{exercicesFiltres.length} exercices progressifs</span>
            <span style={{ background: "#FFE4E6", color: "#9F1239", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>Mode correction équilibré v{FOCUS_PROGRESS_VERSION}</span>
          </div>

          <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 10 }}>
            <div style={{ borderRadius: 12, border: "1px solid #BFDBFE", padding: "9px 10px", background: "#EFF6FF" }}>
              <p style={{ margin: "0 0 5px", color: "#1D4ED8", fontWeight: 700, fontSize: 12 }}>Matière</p>
              <select
                value={matiereSelectionnee}
                onChange={(e) => setMatiereSelectionnee(e.target.value)}
                style={{ width: "100%", borderRadius: 8, border: "1px solid #93C5FD", padding: "7px 9px", fontWeight: 700, color: "#1E3A8A", background: "white" }}
              >
                {matieres.map((matiere) => (
                  <option key={matiere} value={matiere}>{matiere}</option>
                ))}
              </select>
            </div>
            <div style={{ borderRadius: 12, border: "1px solid #FBCFE8", padding: "9px 10px", background: "#FFF1F2" }}>
              <p style={{ margin: "0 0 5px", color: "#BE185D", fontWeight: 700, fontSize: 12 }}>Thème</p>
              <select
                value={themeSelectionne}
                onChange={(e) => setThemeSelectionne(e.target.value)}
                style={{ width: "100%", borderRadius: 8, border: "1px solid #FDA4AF", padding: "7px 9px", fontWeight: 700, color: "#9F1239", background: "white" }}
              >
                {themes.map((theme) => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
            </div>
            <div style={{ borderRadius: 12, border: "1px solid #FDE68A", padding: "9px 10px", background: "#FFFBEB" }}>
              <p style={{ margin: "0 0 5px", color: "#92400E", fontWeight: 700, fontSize: 12 }}>Chapitre</p>
              <select
                value={chapitreSelectionne}
                onChange={(e) => setChapitreSelectionne(e.target.value)}
                style={{ width: "100%", borderRadius: 8, border: "1px solid #FCD34D", padding: "7px 9px", fontWeight: 700, color: "#92400E", background: "white" }}
              >
                {chapitres.map((chap) => (
                  <option key={chap} value={chap}>{chap}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gap: 10 }}>
          {exercicesFiltres.map((exercise) => (
            <FocusCard key={exercise.id} exercise={exercise} claim={claims[exercise.id]} onClaimXP={handleClaimXP} />
          ))}
          {!exercicesFiltres.length && (
            <div style={{ background: "#FFFFFF", border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 14, color: COLORS.muted }}>
              Aucun exercice disponible pour ce filtre.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

