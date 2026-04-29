import { useEffect, useMemo, useState } from "react";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const COLORS = {
  page: "#F1F5F9",
  card: "#FFFFFF",
  border: "#E2E8F0",
  text: "#0F172A",
  muted: "#64748B",
  blue: "#2563EB",
  green: "#16A34A",
  orange: "#EA580C",
  red: "#DC2626",
  violet: "#7C3AED",
};

const FOCUS_PROGRESS_VERSION = 3;

const EXERCISES = [
  {
    id: "focus-6-1",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 1,
    type: "QCM",
    mode: "qcm",
    xp: 40,
    title: "Notion clé de la PokéData",
    consigne: "Dans la Ligue Pokémon, le Big Data se caractérise principalement par :",
    options: [
      "Un faible volume de données",
      "Un volume, une variété et une vélocité élevés",
      "Des données uniquement papier",
      "Des informations sans utilité pour la gestion de l'arène",
    ],
    correctOption: 1,
    correction: "Le Big Data repose sur les 5V, notamment volume, variété et vélocité.",
  },
  {
    id: "focus-6-2",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 2,
    type: "Vrai/Faux",
    mode: "truefalse",
    xp: 50,
    title: "Open Data de Kanto: vrai ou faux",
    consigne: "Indique Vrai/Faux pour chaque affirmation.",
    statements: [
      { text: "L'open data permet la réutilisation des données publiques.", expected: true },
      { text: "L'open data interdit toute diffusion.", expected: false },
      { text: "Une ville comme Safrania peut publier des jeux de données sur Internet.", expected: true },
    ],
    correction: "L'open data vise l'accès, la réutilisation et la diffusion des données publiques.",
  },
  {
    id: "focus-6-3",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 3,
    type: "Texte à trous",
    mode: "fill",
    xp: 60,
    title: "Chaîne de valeur du Pokédex",
    consigne: "Complète les 3 mots manquants.",
    fillSentence: "La ... brute du Pokédex devient une ... grâce au contexte, puis une ... utile à la décision.",
    blanks: ["donnée", "information", "connaissance"],
    correction: "La transformation donnée -> information -> connaissance soutient la décision.",
  },
  {
    id: "focus-6-4",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 4,
    type: "Classement",
    mode: "checklist",
    xp: 70,
    title: "Données personnelles du dresseur",
    consigne: "Dans l'application de la Ligue, coche uniquement les données personnelles.",
    checklist: [
      { label: "Nom et prénom du client", expected: true },
      { label: "Numéro de ticket anonyme", expected: false },
      { label: "Adresse email nominative", expected: true },
      { label: "Météo du jour à Jadielle", expected: false },
      { label: "Numéro de téléphone", expected: true },
    ],
    correction: "Une donnée personnelle permet d'identifier directement ou indirectement une personne.",
  },
  {
    id: "focus-6-5",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 5,
    type: "Mini-cas",
    mode: "redaction",
    xp: 90,
    title: "Cas PokéMart: erreur de saisie",
    consigne:
      "Au PokéMart, une commande est saisie avec une mauvaise référence produit. Donne 3 conséquences possibles pour l'entreprise et propose une action corrective.",
    correction:
      "Conséquences possibles: erreur logistique, litige client, coût supplémentaire. Action corrective: contrôle qualité de saisie et validation automatique au moment de la commande.",
    expectedKeywords: ["erreur", "commande", "client", "cout", "controle", "qualite", "saisie"],
    expectedNumbers: [3],
  },
  {
    id: "focus-6-6",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 6,
    type: "Application RGPD",
    mode: "redaction",
    xp: 110,
    title: "Principe de minimisation (RGPD)",
    consigne:
      "Pour la boutique en ligne Pokémon, explique quelles données sont strictement nécessaires pour traiter une commande et lesquelles ne le sont pas.",
    correction:
      "Nécessaires: identité, adresse de livraison, paiement, contact. Non nécessaires: informations sans lien avec la finalité de la commande.",
    expectedKeywords: ["rgpd", "finalite", "necessaires", "commande", "livraison", "paiement", "minimisation"],
  },
  {
    id: "focus-6-7",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 7,
    type: "QCM expert",
    mode: "qcm",
    xp: 120,
    title: "SI de la Ligue Pokémon",
    consigne: "Quel enchaînement décrit correctement le rôle du système d'information de la Ligue ?",
    options: [
      "Collecte des données -> stockage -> traitement -> diffusion",
      "Diffusion -> suppression -> stockage -> collecte",
      "Traitement -> collecte -> oubli -> diffusion",
      "Stockage -> copie -> suppression -> décision automatique",
    ],
    correctOption: 0,
    correction: "Le SI suit la logique collecte, stockage, traitement puis diffusion de l'information.",
  },
  {
    id: "focus-6-8",
    chapter: "Chapitre 6",
    matiere: "SDGN",
    theme: "Thème 2",
    difficulty: 8,
    type: "Synthèse",
    mode: "redaction",
    xp: 150,
    title: "Bilan du cahier de vacances Pokémon",
    consigne:
      "Rédige une synthèse de 12 à 15 lignes: dans l'univers Pokémon, comment la donnée devient une ressource stratégique, avec limites de qualité, d'accès et de conformité RGPD.",
    correction:
      "La synthèse doit relier Big Data, SI, transformation en connaissance, décision managériale et contraintes juridiques dans le cas de la Ligue/PokéMart.",
    expectedKeywords: ["big data", "si", "donnee", "information", "connaissance", "decision", "qualite", "rgpd"],
    expectedNumbers: [12],
  },
];

const CHAPTER_CONTENT = {
  "Chapitre 6": {
    heroTitle: "☀️ Cahier de vacances — SDGN 1ère",
    heroText:
      "Activités interactives type manuel, version Pokémon: QCM, vrai/faux, texte à trous, cas pratique et synthèse finale.",
    notions: "Notions: donnée, information, SI, Big Data, open data, RGPD",
  },
};

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const normalize = (v = "") =>
  String(v).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();

const extractNumbers = (text = "") => {
  const matches = String(text).match(/-?\d+(?:[.,]\d+)?/g) || [];
  return matches.map((m) => Number(m.replace(",", "."))).filter((n) => Number.isFinite(n));
};

const evaluateRedaction = (exercise, answer) => {
  const clean = normalize(answer);
  if (!clean) return { score: 0, mention: "À travailler", pointsForts: "Réponse vide.", aAmeliorer: "Rédige une réponse structurée." };
  const expected = (exercise.expectedKeywords || []).map(normalize);
  const found = expected.filter((k) => clean.includes(k));
  const keywordRatio = expected.length ? found.length / expected.length : 0;
  let numberRatio = 1;
  if (exercise.expectedNumbers?.length) {
    const numbers = extractNumbers(answer);
    const matched = exercise.expectedNumbers.filter((e) => numbers.some((n) => Math.abs(n - e) <= Math.max(1, Math.abs(e) * 0.02)));
    numberRatio = matched.length / exercise.expectedNumbers.length;
  }
  const structure = answer.length >= 220 ? 1 : answer.length >= 120 ? 0.8 : answer.length >= 70 ? 0.6 : 0.3;
  const raw = (keywordRatio * 7) + (numberRatio * 2) + structure;
  const score = Math.max(2, Math.min(10, Math.round(raw * 10) / 10));
  return {
    score,
    mention: score >= 8 ? "Très bien" : score >= 6 ? "Bon travail" : score >= 4 ? "Passable" : "À travailler",
    pointsForts: found.length ? `Notions trouvées: ${found.slice(0, 5).join(", ")}.` : "Tu as bien commencé.",
    aAmeliorer: found.length < Math.max(2, Math.floor(expected.length / 2)) ? "Ajoute davantage de vocabulaire du cours et un exemple concret." : "Ajoute une conclusion de gestion claire.",
  };
};

const evaluateInteractive = (exercise, state) => {
  if (exercise.mode === "qcm") {
    const ok = state.selected === exercise.correctOption;
    return { score: ok ? 10 : 3, mention: ok ? "Très bien" : "À retravailler", pointsForts: ok ? "Bonne réponse." : "Tu as répondu.", aAmeliorer: ok ? "Passe à l'exercice suivant." : "Relis la définition associée." };
  }
  if (exercise.mode === "truefalse") {
    const total = exercise.statements.length;
    const good = exercise.statements.filter((s, i) => state.tf[i] === s.expected).length;
    const score = Math.round((good / total) * 10);
    return { score, mention: score >= 8 ? "Très bien" : "Bon travail", pointsForts: `${good}/${total} affirmations correctes.`, aAmeliorer: score < 8 ? "Revois les affirmations fausses et leur justification." : "Excellent rythme." };
  }
  if (exercise.mode === "fill") {
    const good = exercise.blanks.filter((b, i) => normalize(state.blanks[i]) === normalize(b)).length;
    const total = exercise.blanks.length;
    const score = Math.round((good / total) * 10);
    return { score, mention: score >= 8 ? "Très bien" : "Bon travail", pointsForts: `${good}/${total} mots bien placés.`, aAmeliorer: score < 8 ? "Revois le vocabulaire de la chaîne d'information." : "Parfait." };
  }
  if (exercise.mode === "checklist") {
    const total = exercise.checklist.length;
    const good = exercise.checklist.filter((item, i) => Boolean(state.checks[i]) === item.expected).length;
    const score = Math.round((good / total) * 10);
    return { score, mention: score >= 8 ? "Très bien" : "Bon travail", pointsForts: `${good}/${total} choix corrects.`, aAmeliorer: score < 8 ? "Distingue mieux les données personnelles des données neutres." : "Très bon tri." };
  }
  return evaluateRedaction(exercise, state.text || "");
};

function FocusCard({ exercise, claim, onClaimXP }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [locked, setLocked] = useState(false);
  const [localInfo, setLocalInfo] = useState("");
  const [selected, setSelected] = useState(null);
  const [tf, setTf] = useState({});
  const [blanks, setBlanks] = useState({});
  const [checks, setChecks] = useState({});
  const [text, setText] = useState("");

  const today = getTodayKey();
  const alreadyClaimed = claim?.lastClaimDate === today;
  const canClaim = !alreadyClaimed && result && result.score >= 5;
  const canEvaluate =
    !locked &&
    ((exercise.mode === "qcm" && selected !== null) ||
      (exercise.mode === "truefalse" && exercise.statements.every((_, i) => tf[i] !== undefined)) ||
      (exercise.mode === "fill" && exercise.blanks.every((_, i) => (blanks[i] || "").trim().length > 0)) ||
      (exercise.mode === "checklist" && Object.keys(checks).length === exercise.checklist.length) ||
      (exercise.mode === "redaction" && text.trim().length >= 40));

  const validate = () => {
    const next = evaluateInteractive(exercise, { selected, tf, blanks, checks, text });
    setResult(next);
    setLocked(true);
  };

  const claimXp = async () => {
    if (!canClaim) return;
    setLoading(true);
    try {
      const ok = await onClaimXP(exercise.id, exercise.xp);
      if (!ok) setLocalInfo("Échec de validation. Réessaie.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 18, boxShadow: "0 6px 24px rgba(15,23,42,0.05)" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#DBEAFE", color: "#1D4ED8", fontWeight: 700, fontSize: 12 }}>Niveau {exercise.difficulty}</span>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#F3E8FF", color: "#6D28D9", fontWeight: 700, fontSize: 12 }}>{exercise.type}</span>
        <span style={{ borderRadius: 999, padding: "4px 10px", background: "#DCFCE7", color: "#166534", fontWeight: 700, fontSize: 12 }}>+{exercise.xp} XP</span>
      </div>
      <h3 style={{ margin: "0 0 8px", color: COLORS.text }}>{exercise.title}</h3>
      <p style={{ margin: "0 0 10px", color: COLORS.muted, lineHeight: 1.5 }}>{exercise.consigne}</p>

      {exercise.mode === "qcm" && (
        <div style={{ display: "grid", gap: 8 }}>
          {exercise.options.map((opt, idx) => (
            <button key={opt} disabled={locked} onClick={() => setSelected(idx)} style={{ textAlign: "left", borderRadius: 10, border: `1px solid ${selected === idx ? COLORS.blue : COLORS.border}`, background: selected === idx ? "#EFF6FF" : "white", padding: "10px 12px", cursor: locked ? "default" : "pointer" }}>
              {String.fromCharCode(65 + idx)}. {opt}
            </button>
          ))}
        </div>
      )}

      {exercise.mode === "truefalse" && (
        <div style={{ display: "grid", gap: 8 }}>
          {exercise.statements.map((row, i) => (
            <div key={row.text} style={{ border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: 10 }}>
              <p style={{ margin: "0 0 8px", color: COLORS.text }}>{row.text}</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button disabled={locked} onClick={() => setTf((p) => ({ ...p, [i]: true }))} style={{ borderRadius: 8, border: "none", padding: "6px 10px", background: tf[i] === true ? COLORS.green : "#E2E8F0", color: tf[i] === true ? "white" : "#334155" }}>Vrai</button>
                <button disabled={locked} onClick={() => setTf((p) => ({ ...p, [i]: false }))} style={{ borderRadius: 8, border: "none", padding: "6px 10px", background: tf[i] === false ? COLORS.red : "#E2E8F0", color: tf[i] === false ? "white" : "#334155" }}>Faux</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {exercise.mode === "fill" && (
        <div style={{ display: "grid", gap: 8 }}>
          <p style={{ margin: 0, color: "#334155" }}>{exercise.fillSentence}</p>
          {exercise.blanks.map((_, i) => (
            <input key={i} disabled={locked} value={blanks[i] || ""} onChange={(e) => setBlanks((p) => ({ ...p, [i]: e.target.value }))} placeholder={`Mot ${i + 1}`} style={{ borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: "10px" }} />
          ))}
        </div>
      )}

      {exercise.mode === "checklist" && (
        <div style={{ display: "grid", gap: 6 }}>
          {exercise.checklist.map((item, i) => (
            <label key={item.label} style={{ display: "flex", gap: 8, alignItems: "center", background: "#F8FAFC", border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: "8px 10px" }}>
              <input type="checkbox" disabled={locked} checked={Boolean(checks[i])} onChange={(e) => setChecks((p) => ({ ...p, [i]: e.target.checked }))} />
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      )}

      {exercise.mode === "redaction" && (
        <>
          <textarea
            value={text}
            onChange={(e) => {
              if (!locked) setText(e.target.value);
            }}
            readOnly={locked}
            placeholder="Rédige ta réponse..."
            style={{ width: "100%", minHeight: 130, marginTop: 6, borderRadius: 10, border: `1px solid ${COLORS.border}`, padding: 10, resize: "vertical", boxSizing: "border-box" }}
          />
          <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 12 }}>Minimum conseillé: 40 caractères.</p>
        </>
      )}

      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <button onClick={validate} disabled={!canEvaluate} style={{ border: "none", borderRadius: 10, padding: "9px 12px", fontWeight: 700, background: canEvaluate ? COLORS.blue : "#CBD5E1", color: "white", cursor: canEvaluate ? "pointer" : "not-allowed" }}>
          Corriger
        </button>
        <button onClick={claimXp} disabled={!canClaim || loading} style={{ border: "none", borderRadius: 10, padding: "9px 12px", fontWeight: 700, background: canClaim ? COLORS.green : "#CBD5E1", color: "white", cursor: canClaim ? "pointer" : "not-allowed" }}>
          {alreadyClaimed ? "XP déjà pris" : loading ? "Validation..." : `Valider +${exercise.xp} XP`}
        </button>
      </div>
      {(localInfo || (alreadyClaimed && "XP déjà validés aujourd'hui pour cet exercice.")) && (
        <p style={{ margin: "6px 0 0", color: "#64748B", fontSize: 12 }}>{localInfo || "XP déjà validés aujourd'hui pour cet exercice."}</p>
      )}

      {result && (
        <div style={{ marginTop: 10, borderRadius: 10, border: "1px solid #BFDBFE", background: "#EFF6FF", padding: 10 }}>
          <p style={{ margin: 0, color: "#1E3A8A", fontWeight: 800 }}>Score: {result.score}/10 — {result.mention}</p>
          <p style={{ margin: "6px 0 0", color: "#166534" }}><strong>Points forts:</strong> {result.pointsForts}</p>
          <p style={{ margin: "6px 0 0", color: "#9A3412" }}><strong>À améliorer:</strong> {result.aAmeliorer}</p>
          <p style={{ margin: "8px 0 0", color: "#92400E", background: "#FFFBEB", border: "1px solid #FCD34D", borderRadius: 8, padding: 8 }}>
            <strong>Correction attendue:</strong> {exercise.correction}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Focus({ onXPGagne }) {
  const [claims, setClaims] = useState({});
  const [banner, setBanner] = useState(null);
  const [chapitreSelectionne, setChapitreSelectionne] = useState("Chapitre 6");
  const exercicesFiltres = useMemo(() => EXERCISES.filter((e) => e.chapter === chapitreSelectionne).sort((a, b) => a.difficulty - b.difficulty), [chapitreSelectionne]);
  const chapterUI = CHAPTER_CONTENT[chapitreSelectionne] || CHAPTER_CONTENT["Chapitre 6"];
  const xpPotential = useMemo(() => exercicesFiltres.reduce((sum, ex) => sum + ex.xp, 0), [exercicesFiltres]);
  const total = exercicesFiltres.length;
  const done = exercicesFiltres.filter((ex) => claims[ex.id]?.lastClaimDate).length;
  const progress = total ? Math.round((done / total) * 100) : 0;

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) return;
        const progressData = snap.data()?.focusProgress || {};
        const isCurrent = progressData?.version === FOCUS_PROGRESS_VERSION;
        setClaims(isCurrent ? progressData.claims || {} : {});
      } catch (err) {
        console.error("Chargement focus impossible", err);
      }
    };
    load();
  }, []);

  const handleClaimXP = async (exerciseId, xp) => {
    const user = auth.currentUser;
    if (!user) {
      setBanner({ type: "error", text: "Session expirée. Reconnecte-toi." });
      return false;
    }
    try {
      const today = getTodayKey();
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return false;
      const data = snap.data();
      const stored = data.focusProgress || {};
      const prev = stored?.version === FOCUS_PROGRESS_VERSION ? (stored.claims || {}) : {};
      if (prev[exerciseId]?.lastClaimDate === today) {
        setBanner({ type: "error", text: "XP déjà validés aujourd'hui pour cet exercice." });
        return false;
      }
      const nextClaims = { ...prev, [exerciseId]: { lastClaimDate: today, totalClaims: (prev[exerciseId]?.totalClaims || 0) + 1 } };
      await updateDoc(ref, {
        xp: (data.xp || 0) + xp,
        focusProgress: { ...(stored || {}), version: FOCUS_PROGRESS_VERSION, chapter: `SDGN 1ère - ${chapitreSelectionne}`, claims: nextClaims },
      });
      setClaims(nextClaims);
      setBanner({ type: "success", text: `+${xp} XP gagnés sur le cahier de vacances.` });
      if (onXPGagne) onXPGagne();
      return true;
    } catch (err) {
      console.error("Validation XP Focus impossible", err);
      setBanner({ type: "error", text: "Validation impossible pour le moment." });
      return false;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.page, padding: "22px 14px 28px", color: COLORS.text }}>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gap: 14 }}>
        {banner && (
          <div style={{ background: banner.type === "success" ? "#DCFCE7" : "#FEE2E2", color: banner.type === "success" ? "#166534" : COLORS.red, border: `1px solid ${banner.type === "success" ? "#86EFAC" : "#FECACA"}`, borderRadius: 12, padding: "10px 12px", fontWeight: 700 }}>
            {banner.text}
          </div>
        )}

        <section style={{ background: "linear-gradient(135deg, #0B2447, #1D4ED8)", borderRadius: 22, padding: 22, color: "white" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "2rem" }}>{chapterUI.heroTitle}</h1>
          <p style={{ margin: "0 0 10px", color: "#DBEAFE", lineHeight: 1.5 }}>{chapterUI.heroText}</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: "rgba(255,255,255,0.16)", borderRadius: 999, padding: "6px 12px", fontWeight: 700 }}>{chapterUI.notions}</span>
            <span style={{ background: "rgba(16,185,129,0.25)", borderRadius: 999, padding: "6px 12px", fontWeight: 700 }}>XP potentiel: +{xpPotential}</span>
            <span style={{ background: "rgba(124,58,237,0.25)", borderRadius: 999, padding: "6px 12px", fontWeight: 700 }}>{total} activités</span>
          </div>
          <div style={{ marginTop: 12, background: "rgba(255,255,255,0.2)", borderRadius: 999, height: 10 }}>
            <div style={{ width: `${progress}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #22C55E, #84CC16)" }} />
          </div>
          <p style={{ margin: "6px 0 0", color: "#BFDBFE", fontSize: 13 }}>Progression du cahier: {done}/{total} ({progress}%)</p>
          <div style={{ marginTop: 10 }}>
            <select value={chapitreSelectionne} onChange={(e) => setChapitreSelectionne(e.target.value)} style={{ borderRadius: 10, border: "1px solid #93C5FD", padding: "8px 10px", fontWeight: 700 }}>
              <option value="Chapitre 6">Chapitre 6 - Information numérique</option>
            </select>
          </div>
        </section>

        <section style={{ display: "grid", gap: 10 }}>
          {exercicesFiltres.map((exercise) => (
            <FocusCard key={exercise.id} exercise={exercise} claim={claims[exercise.id]} onClaimXP={handleClaimXP} />
          ))}
        </section>
      </div>
    </div>
  );
}

