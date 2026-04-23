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

const EXERCISES = [
  {
    id: "focus-13-1",
    difficulty: 1,
    type: "Définition",
    xp: 40,
    title: "Définir la performance",
    consigne: "Définis la performance dans une organisation et cite les 3 étapes de la démarche de performance.",
    correction:
      "La performance correspond à l’atteinte d’objectifs prédéfinis. La démarche suit 3 étapes : définition des objectifs, détermination/utilisation des moyens, atteinte du résultat.",
    expectedKeywords: ["performance", "objectifs", "definition", "moyens", "resultat", "atteinte"],
    expectedNumbers: [3],
  },
  {
    id: "focus-13-2",
    difficulty: 2,
    type: "Définition",
    xp: 55,
    title: "Rentabilité vs profitabilité",
    consigne: "Explique la différence entre rentabilité et profitabilité en une réponse structurée.",
    correction:
      "La rentabilité mesure la capacité à générer des profits à partir des moyens investis (capitaux). La profitabilité mesure la capacité à dégager du profit à partir de l’activité (souvent le chiffre d’affaires).",
    expectedKeywords: ["rentabilite", "profitabilite", "profits", "capitaux", "activite", "chiffre"],
  },
  {
    id: "focus-13-3",
    difficulty: 3,
    type: "Analyse",
    xp: 65,
    title: "Objectifs bien formulés",
    consigne: "Pourquoi des objectifs doivent-ils être compréhensibles, mesurables, réalisables et limités dans le temps ?",
    correction:
      "Des objectifs clairs permettent aux acteurs d’agir correctement. Ils doivent être mesurables pour vérifier l’atteinte, réalisables pour rester motivants, et limités dans le temps pour piloter l’action.",
    expectedKeywords: ["comprehensibles", "mesurables", "realisables", "temps", "indicateurs", "atteinte"],
  },
  {
    id: "focus-13-4",
    difficulty: 4,
    type: "Calcul",
    xp: 80,
    title: "Évolution du chiffre d’affaires",
    consigne:
      "Une entreprise passe de 180 000 € de CA à 225 000 €. Calcule l’évolution en valeur et en pourcentage, puis interprète.",
    correction:
      "Évolution en valeur = 225 000 - 180 000 = +45 000 €. Évolution en % = 45 000 / 180 000 = 25 %. L’entreprise améliore sa performance commerciale.",
    expectedKeywords: ["evolution", "valeur", "pourcentage", "performance", "commerciale", "analyse", "interprete"],
    expectedNumbers: [45000, 25],
  },
  {
    id: "focus-13-5",
    difficulty: 5,
    type: "Calcul",
    xp: 90,
    title: "Part de marché",
    consigne:
      "Le CA de l’entreprise est 300 000 €. Le CA total du marché est 1 200 000 €. Calcule la part de marché puis analyse ce que cela signifie face aux concurrents.",
    correction:
      "Part de marché = 300 000 / 1 200 000 = 0,25 soit 25 %. L’entreprise réalise un quart des ventes du marché.",
    expectedKeywords: ["part", "marche", "pourcentage", "concurrents", "ventes", "analyse", "interprete"],
    expectedNumbers: [25],
  },
  {
    id: "focus-13-6",
    difficulty: 6,
    type: "Calcul",
    xp: 100,
    title: "Rentabilité financière",
    consigne:
      "Bénéfice net = 48 000 €. Capitaux propres = 240 000 €. Calcule la rentabilité (en %) et interprète le résultat.",
    correction:
      "Rentabilité = bénéfice net / capitaux propres = 48 000 / 240 000 = 0,20 soit 20 %. Chaque euro investi en capitaux propres génère 0,20 € de bénéfice.",
    expectedKeywords: ["rentabilite", "benefice", "capitaux", "pourcentage", "interprete", "analyse"],
    expectedNumbers: [20],
  },
  {
    id: "focus-13-6b",
    difficulty: 7,
    type: "Calcul",
    xp: 115,
    title: "Profitabilité de l’activité",
    consigne:
      "Résultat net = 36 000 € et chiffre d’affaires = 450 000 €. Calcule la profitabilité (en %) puis analyse ce résultat pour l’activité.",
    correction:
      "Profitabilité = résultat net / chiffre d’affaires = 36 000 / 450 000 = 0,08 soit 8 %. L’organisation transforme 8 % de son CA en résultat net, ce qui mesure l’efficacité de l’activité.",
    expectedKeywords: ["profitabilite", "resultat", "chiffre", "affaires", "pourcentage", "analyse", "activite"],
    expectedNumbers: [8],
  },
  {
    id: "focus-13-6c",
    difficulty: 8,
    type: "Calcul",
    xp: 125,
    title: "Comparer rentabilité et profitabilité",
    consigne:
      "Entreprise A : bénéfice 50 000 €, capitaux 250 000 €, CA 1 000 000 €. Calcule rentabilité et profitabilité, puis analyse l’écart entre les deux indicateurs.",
    correction:
      "Rentabilité = 50 000 / 250 000 = 20 %. Profitabilité = 50 000 / 1 000 000 = 5 %. L’entreprise est rentable pour ses capitaux mais sa marge sur activité reste limitée.",
    expectedKeywords: ["rentabilite", "profitabilite", "capitaux", "activite", "ecart", "analyse"],
    expectedNumbers: [20, 5],
  },
  {
    id: "focus-13-7",
    difficulty: 9,
    type: "Tableau de bord",
    xp: 120,
    title: "Construire un mini tableau de bord",
    consigne:
      "Propose un mini tableau de bord (5 indicateurs) pour suivre la performance commerciale et financière d’une organisation.",
    correction:
      "Exemples pertinents : chiffre d’affaires, évolution du CA, part de marché, taux de fidélité, marge/profit, rentabilité. Il faut préciser l’unité et la périodicité.",
    expectedKeywords: ["tableau", "bord", "indicateurs", "chiffre", "part", "fidelite", "rentabilite", "periodicite"],
    expectedNumbers: [5],
  },
  {
    id: "focus-13-8",
    difficulty: 10,
    type: "Comparaison",
    xp: 140,
    title: "Comparer les performances dans le temps",
    consigne:
      "Année N : CA 520 000 €, part de marché 18 %, rentabilité 12 %. Année N+1 : CA 560 000 €, part de marché 17 %, rentabilité 10 %. Analyse la performance globale.",
    correction:
      "Le CA progresse (+40 000 €), mais part de marché et rentabilité reculent. La performance est contrastée : volume en hausse, efficacité concurrentielle et financière en baisse.",
    expectedKeywords: ["comparaison", "temps", "hausse", "baisse", "part", "rentabilite", "globale", "analyse"],
    expectedNumbers: [40000],
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

const getTodayKey = () => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

const extractNumbers = (text = "") => {
  const matches = String(text).match(/-?\d+(?:[.,]\d+)?/g) || [];
  return matches.map((m) => Number(m.replace(",", "."))).filter((n) => Number.isFinite(n));
};

const evaluate = (exercise, answer) => {
  const clean = normalize(answer);
  if (!clean) {
    return {
      score: 0,
      pointsForts: "Réponse vide.",
      aAmeliorer: "Rédige une première version structurée.",
      reperes: [],
      mention: "À travailler",
    };
  }

  const foundKeywords = exercise.expectedKeywords.filter((k) => clean.includes(normalize(k)));
  const keywordRatio = exercise.expectedKeywords.length ? foundKeywords.length / exercise.expectedKeywords.length : 0;

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

  const hasAnalysis = /(analyse|interpre|cela signifie|on peut conclure|donc|ce resultat)/i.test(clean);
  const structureBonus = answer.length >= 120 ? 1 : 0.4;
  const analysisBonus = exercise.type === "Calcul" ? (hasAnalysis ? 1 : 0) : 0.5;
  const rawScore = (keywordRatio * 5.5) + (numberRatio * 3) + structureBonus + analysisBonus;
  const score = Math.max(0, Math.min(10, Math.round(rawScore * 10) / 10));

  const mention = score >= 8 ? "Très bien" : score >= 6 ? "Bon travail" : score >= 4 ? "Passable" : "À travailler";
  const missingKeywords = exercise.expectedKeywords.filter((k) => !foundKeywords.includes(k)).slice(0, 4);

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
  const [showCorrection, setShowCorrection] = useState(false);
  const [loading, setLoading] = useState(false);

  const canEvaluate = answer.trim().length >= 40;
  const today = getTodayKey();
  const alreadyClaimed = claim?.lastClaimDate === today;
  const canClaim = !alreadyClaimed && result && result.score >= 5;

  const validate = () => setResult(evaluate(exercise, answer));

  const claimXp = async () => {
    if (!canClaim) return;
    setLoading(true);
    try {
      await onClaimXP(exercise.id, exercise.xp);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 16 }}>
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

      <h3 style={{ margin: "0 0 6px", color: COLORS.text }}>{exercise.title}</h3>
      <p style={{ margin: 0, color: COLORS.muted, lineHeight: 1.5 }}>{exercise.consigne}</p>

      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
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

      <div style={{ display: "flex", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
        <button
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
        <button
          onClick={() => setShowCorrection((v) => !v)}
          style={{
            border: "none",
            borderRadius: 10,
            padding: "8px 11px",
            fontWeight: 700,
            cursor: "pointer",
            background: COLORS.orange,
            color: "white",
          }}
        >
          {showCorrection ? "Masquer correction" : "Afficher correction"}
        </button>
      </div>

      {result && (
        <div style={{ marginTop: 10, borderRadius: 10, border: "1px solid #BFDBFE", background: "#EFF6FF", padding: 10 }}>
          <p style={{ margin: 0, color: "#1E3A8A", fontWeight: 800 }}>Score: {result.score}/10 — {result.mention}</p>
          <p style={{ margin: "6px 0 0", color: "#166534" }}><strong>Points forts:</strong> {result.pointsForts}</p>
          <p style={{ margin: "6px 0 0", color: "#9A3412" }}><strong>À améliorer:</strong> {result.aAmeliorer}</p>
        </div>
      )}

      {showCorrection && (
        <div style={{ marginTop: 10, borderRadius: 10, border: "1px solid #FCD34D", background: "#FFFBEB", padding: 10 }}>
          <p style={{ margin: 0, color: "#92400E" }}><strong>Correction attendue:</strong> {exercise.correction}</p>
        </div>
      )}
    </div>
  );
}

export default function Focus({ profil, onXPGagne }) {
  const [claims, setClaims] = useState({});
  const [banner, setBanner] = useState(null);

  const xpPotential = useMemo(() => EXERCISES.reduce((sum, ex) => sum + ex.xp, 0), []);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) return;
        setClaims(snap.data()?.focusProgress?.claims || {});
      } catch (err) {
        console.error("Chargement focus impossible", err);
      }
    };
    load();
  }, []);

  const handleClaimXP = async (exerciseId, xp) => {
    const user = auth.currentUser;
    if (!user) return;
    const today = getTodayKey();
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data();
    const prevClaims = data.focusProgress?.claims || {};
    if (prevClaims[exerciseId]?.lastClaimDate === today) return;

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
        ...(data.focusProgress || {}),
        chapter: "SDGN 1ère - Chapitre 13",
        claims: nextClaims,
      },
    });

    setClaims(nextClaims);
    setBanner({ type: "success", text: `+${xp} XP gagnés sur Focus.` });
    if (onXPGagne) onXPGagne();
  };

  return (
    <div style={{ minHeight: "100vh", background: COLORS.page, padding: "20px 14px 28px", color: COLORS.text }}>
      <div style={{ maxWidth: 980, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
        {banner && (
          <div style={{ background: banner.type === "success" ? "#DCFCE7" : "#FEE2E2", color: banner.type === "success" ? "#166534" : COLORS.red, border: `1px solid ${banner.type === "success" ? "#86EFAC" : "#FECACA"}`, borderRadius: 12, padding: "9px 12px", fontWeight: 700 }}>
            {banner.text}
          </div>
        )}

        <section style={{ background: "#FFFFFF", border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 18 }}>
          <h1 style={{ margin: "0 0 6px", color: "#1E3A8A" }}>🎯 Focus — SDGN 1ère · Chapitre 13</h1>
          <p style={{ margin: 0, color: COLORS.muted, lineHeight: 1.55 }}>
            Révision ciblée sur l’analyse des performances commerciale et financière. Progression en difficulté croissante: définitions, analyses, calculs et tableau de bord.
          </p>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span style={{ background: "#DBEAFE", color: "#1D4ED8", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>Notions: performance, rentabilité, profitabilité, indicateurs</span>
            <span style={{ background: "#DCFCE7", color: "#166534", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>XP potentiel/jour: +{xpPotential}</span>
            <span style={{ background: "#FEF3C7", color: "#92400E", borderRadius: 999, padding: "5px 11px", fontWeight: 700 }}>10 exercices progressifs</span>
          </div>
        </section>

        <section style={{ display: "grid", gap: 10 }}>
          {EXERCISES.map((exercise) => (
            <FocusCard key={exercise.id} exercise={exercise} claim={claims[exercise.id]} onClaimXP={handleClaimXP} />
          ))}
        </section>
      </div>
    </div>
  );
}

