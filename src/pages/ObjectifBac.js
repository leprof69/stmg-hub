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

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

function ExerciseCard({ exercise, status, onClaimXP }) {
  const [draft, setDraft] = useState("");
  const [showCorrection, setShowCorrection] = useState(false);
  const [loading, setLoading] = useState(false);
  const responseLength = draft.trim().length;
  const alreadyClaimedToday = status?.lastClaimDate === getTodayKey();
  const canClaim = responseLength >= exercise.minChars && !alreadyClaimedToday && !loading;

  const handleClaim = async () => {
    if (!canClaim) return;
    setLoading(true);
    try {
      await onClaimXP(exercise.id, exercise.xp);
    } finally {
      setLoading(false);
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
      } catch (error) {
        console.error("Impossible de charger la progression Objectif Bac", error);
      }
    };
    loadProgress();
  }, []);

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

  return (
    <div style={{ minHeight: "100vh", background: COLORS.dark, color: "white", padding: "24px 16px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex", flexDirection: "column", gap: 18 }}>
        {banner && (
          <div
            style={{
              borderRadius: 12,
              padding: "10px 14px",
              background: banner.type === "success" ? "#14532D" : "#7F1D1D",
              border: `1px solid ${banner.type === "success" ? "#16A34A" : "#DC2626"}`,
              color: "white",
              fontWeight: 700,
            }}
          >
            {banner.text}
          </div>
        )}
        <section
          style={{
            borderRadius: 24,
            padding: "28px 24px",
            background: "linear-gradient(135deg, #1E3A8A 0%, #312E81 55%, #581C87 100%)",
            border: "1px solid #4338CA",
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

        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 16 }}>
            <p style={{ margin: "0 0 10px", color: "#86EFAC", fontWeight: 800 }}>A faire</p>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.7 }}>
              {METHODO_RULES.faire.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 16 }}>
            <p style={{ margin: "0 0 10px", color: "#FCA5A5", fontWeight: 800 }}>A eviter</p>
            <ul style={{ margin: 0, paddingLeft: 18, color: COLORS.text, lineHeight: 1.7 }}>
              {METHODO_RULES.eviter.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>
        </section>

        <section style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 16 }}>
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
            />
          ))}
        </section>

        <section style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 18, padding: 16 }}>
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
