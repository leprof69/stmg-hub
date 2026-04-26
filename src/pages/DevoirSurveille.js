import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const DS_EXAM_ID = "chapitre13_1h_2026";
const DS_LOCK_TYPE = "DS 1h - Chapitre 13";
const DS_CODE_STORAGE_KEY = "devoirSurveilleUnlocked";
const DS_ACCESS_CODE = (process.env.REACT_APP_DS_ACCESS_CODE || "STMG13").trim();
const normalizeCode = (value = "") => String(value).trim().toUpperCase();

const EXERCISES = [
  {
    id: "ds13_e1",
    title: "Partie 1 - Questions de cours",
    context: "Réponds avec un vocabulaire de cours précis.",
    questions: [
      { id: "q1", label: "Q1", prompt: "Définis la performance d’une organisation et donne les 3 étapes de la démarche de performance.", minChars: 180 },
      { id: "q2", label: "Q2", prompt: "Explique la différence entre efficacité et efficience avec un exemple.", minChars: 160 },
      { id: "q3", label: "Q3", prompt: "Définis rentabilité et profitabilité, puis cite 3 indicateurs de performance commerciale.", minChars: 180 },
    ],
  },
  {
    id: "ds13_e2",
    title: "Partie 2 - Calculs",
    context: "NOVA SNACK : N CA 1 260 000 €, marché 6 000 000 €, RN 94 500 €, CP 540 000 €. N-1 CA 1 080 000 €, marché 5 700 000 €, RN 81 000 €, CP 500 000 €.",
    questions: [
      { id: "q1", label: "Q1", prompt: "Calcule le taux d’évolution du CA entre N-1 et N (formule + calcul + résultat).", minChars: 140 },
      { id: "q2", label: "Q2", prompt: "Calcule la part de marché en N-1 puis en N, puis compare.", minChars: 160 },
      { id: "q3", label: "Q3", prompt: "Calcule profitabilité et rentabilité en N-1 puis en N, puis rédige ton analyse.", minChars: 220 },
    ],
  },
  {
    id: "ds13_e3",
    title: "Partie 3 - Analyse d’objectifs",
    context: "ECO'BAG : objectif +10% CA, satisfaction 90%, délai max 3 jours. Résultats : CA 800 000 -> 860 000, satisfaction 87%, délai 3,8 jours.",
    questions: [
      { id: "q1", label: "Q1", prompt: "Calcule l’évolution du CA et indique si l’objectif +10 % est atteint.", minChars: 140 },
      { id: "q2", label: "Q2", prompt: "Vérifie les objectifs satisfaction et délai, puis justifie.", minChars: 140 },
      { id: "q3", label: "Q3", prompt: "Rédige une analyse globale et propose 2 actions d’amélioration concrètes.", minChars: 220 },
    ],
  },
];

const cardStyle = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 16,
  boxShadow: "0 8px 22px rgba(15, 23, 42, 0.06)",
};

export default function DevoirSurveille({ profil }) {
  const [codeInput, setCodeInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [forcedZero, setForcedZero] = useState(false);
  const [finalizedAt, setFinalizedAt] = useState("");
  const [submissions, setSubmissions] = useState({});
  const [drafts, setDrafts] = useState({});
  const [attemptStarted, setAttemptStarted] = useState(false);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    try {
      setUnlocked(window.sessionStorage.getItem(DS_CODE_STORAGE_KEY) === "1");
    } catch {
      setUnlocked(false);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const snap = await getDoc(doc(db, "users", user.uid));
      if (!snap.exists()) return;
      const exam = snap.data()?.objectifBacDs?.[DS_EXAM_ID] || {};
      if (exam.submissions) setSubmissions(exam.submissions);
      if (exam.finalizedAt) setFinalizedAt(exam.finalizedAt);
      if (exam.forcedZero) setForcedZero(true);
      if (exam.attemptStarted || exam.submissions) setAttemptStarted(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!attemptStarted || forcedZero || finalizedAt) return undefined;
    const disqualify = async () => {
      const user = auth.currentUser;
      setForcedZero(true);
      setBanner({ type: "error", text: "Sortie de page détectée : note DS forcée à 0." });
      if (!user) return;
      await updateDoc(doc(db, "users", user.uid), {
        [`objectifBacDs.${DS_EXAM_ID}.forcedZero`]: true,
        [`objectifBacDs.${DS_EXAM_ID}.forcedZeroAt`]: new Date().toISOString(),
        [`objectifBacDs.${DS_EXAM_ID}.attemptStarted`]: true,
      });
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
  }, [attemptStarted, forcedZero, finalizedAt]);

  const unlock = () => {
    if (normalizeCode(codeInput) !== normalizeCode(DS_ACCESS_CODE)) {
      setBanner({ type: "error", text: "Code incorrect." });
      return;
    }
    setUnlocked(true);
    setCodeInput("");
    try {
      window.sessionStorage.setItem(DS_CODE_STORAGE_KEY, "1");
    } catch {
      // ignore
    }
    setBanner({ type: "success", text: "Sujet DS déverrouillé." });
  };

  const updateDraft = (exerciseId, questionId, value) => {
    if (forcedZero || finalizedAt) return;
    setDrafts((prev) => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {}),
        [questionId]: value,
      },
    }));
  };

  const validateQuestion = async (exercise, question) => {
    if (forcedZero || finalizedAt) return;
    const user = auth.currentUser;
    if (!user) return;
    const answer = String(drafts?.[exercise.id]?.[question.id] || "").trim();
    if (answer.length < (question.minChars || 80)) {
      setBanner({ type: "error", text: `Réponse trop courte pour ${question.label}.` });
      return;
    }
    setAttemptStarted(true);
    const payload = { prompt: question.prompt, answer, validatedAt: new Date().toISOString() };
    setSubmissions((prev) => ({
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
    await updateDoc(doc(db, "users", user.uid), {
      [`objectifBacDs.${DS_EXAM_ID}.examId`]: DS_EXAM_ID,
      [`objectifBacDs.${DS_EXAM_ID}.type`]: DS_LOCK_TYPE,
      [`objectifBacDs.${DS_EXAM_ID}.attemptStarted`]: true,
      [`objectifBacDs.${DS_EXAM_ID}.submissions.${exercise.id}.title`]: exercise.title,
      [`objectifBacDs.${DS_EXAM_ID}.submissions.${exercise.id}.questions.${question.id}`]: payload,
    });
    setBanner({ type: "success", text: `${question.label} validée.` });
  };

  const canFinalize = useMemo(() => {
    if (!unlocked || forcedZero || finalizedAt) return false;
    return EXERCISES.every((exercise) =>
      exercise.questions.every((question) => Boolean(submissions?.[exercise.id]?.questions?.[question.id]))
    );
  }, [unlocked, forcedZero, finalizedAt, submissions]);

  const finalizeCopy = async () => {
    if (!canFinalize) {
      setBanner({ type: "error", text: "Toutes les questions ne sont pas validées." });
      return;
    }
    const user = auth.currentUser;
    if (!user) return;
    const now = new Date().toISOString();
    setFinalizedAt(now);
    await updateDoc(doc(db, "users", user.uid), {
      [`objectifBacDs.${DS_EXAM_ID}.finalizedAt`]: now,
    });
    setBanner({ type: "success", text: "Copie validée définitivement." });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", padding: "20px 14px", color: "#0F172A" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gap: 12 }}>
        {banner && (
          <div style={{ ...cardStyle, padding: 10, borderColor: banner.type === "error" ? "#FCA5A5" : "#86EFAC", color: banner.type === "error" ? "#991B1B" : "#166534", fontWeight: 700 }}>
            {banner.text}
          </div>
        )}

        <section style={{ ...cardStyle, padding: 16, background: "linear-gradient(120deg, #DBEAFE 0%, #ECFEFF 50%, #FCE7F3 100%)" }}>
          <h1 style={{ margin: "0 0 6px", fontSize: "1.8rem", color: "#0B3B8F" }}>📝 Devoir Surveillé</h1>
          <p style={{ margin: 0, color: "#1E293B" }}>
            Chapitre 13 - 1 heure - anti-triche actif - réponses validées une par une puis validation finale de copie.
          </p>
          <p style={{ margin: "6px 0 0", color: "#7C2D12", fontWeight: 700 }}>
            Élève : {`${profil?.prenom || ""} ${profil?.nom || ""}`.trim() || "Compte connecté"}
          </p>
        </section>

        {!unlocked && (
          <section style={{ ...cardStyle, padding: 16, border: "1px solid #F59E0B", background: "#FFFBEB" }}>
            <p style={{ margin: "0 0 8px", color: "#92400E", fontWeight: 800 }}>🔐 Sujet verrouillé</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <input
                type="password"
                value={codeInput}
                onChange={(e) => setCodeInput(e.target.value)}
                placeholder="Entrer le code DS"
                style={{ flex: "1 1 240px", borderRadius: 10, border: "1px solid #CBD5E1", padding: "9px 11px" }}
              />
              <button onClick={unlock} style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: "pointer", fontWeight: 700, background: "#EA580C", color: "white" }}>
                Déverrouiller
              </button>
            </div>
          </section>
        )}

        {unlocked && (
          <>
            {!forcedZero && (
              <section style={{ ...cardStyle, padding: 12, border: "1px solid #F59E0B", background: "#FFFBEB" }}>
                <p style={{ margin: 0, color: "#92400E", fontWeight: 800 }}>
                  Règle anti-triche : quitter l’onglet/la page entraîne automatiquement la note 0.
                </p>
              </section>
            )}
            {forcedZero && (
              <section style={{ ...cardStyle, padding: 12, border: "1px solid #FCA5A5", background: "#FEF2F2" }}>
                <p style={{ margin: 0, color: "#991B1B", fontWeight: 800 }}>
                  DS disqualifié : sortie de page détectée.
                </p>
              </section>
            )}

            {EXERCISES.map((exercise) => (
              <section key={exercise.id} style={{ ...cardStyle, padding: 16 }}>
                <h3 style={{ margin: "0 0 4px" }}>{exercise.title}</h3>
                <p style={{ margin: "0 0 8px", color: "#475569" }}>{exercise.context}</p>
                <div style={{ display: "grid", gap: 10 }}>
                  {exercise.questions.map((question) => {
                    const text = String(drafts?.[exercise.id]?.[question.id] || "");
                    const locked = Boolean(submissions?.[exercise.id]?.questions?.[question.id]) || forcedZero || Boolean(finalizedAt);
                    return (
                      <div key={`${exercise.id}-${question.id}`} style={{ border: "1px solid #E2E8F0", borderRadius: 12, padding: 10 }}>
                        <p style={{ margin: "0 0 6px", color: "#1E3A8A", fontWeight: 800 }}>{question.label}</p>
                        <p style={{ margin: "0 0 8px", color: "#1F2937" }}>{question.prompt}</p>
                        <textarea
                          value={text}
                          onChange={(e) => updateDraft(exercise.id, question.id, e.target.value)}
                          readOnly={locked}
                          onPaste={(e) => e.preventDefault()}
                          onCopy={(e) => e.preventDefault()}
                          onCut={(e) => e.preventDefault()}
                          onDrop={(e) => e.preventDefault()}
                          onContextMenu={(e) => e.preventDefault()}
                          style={{ width: "100%", minHeight: 120, borderRadius: 10, border: "1px solid #CBD5E1", padding: 10, resize: "vertical", boxSizing: "border-box" }}
                        />
                        <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <p style={{ margin: 0, color: "#64748B", fontSize: 12 }}>{text.trim().length} caractères (min conseillé {question.minChars})</p>
                          <button
                            onClick={() => validateQuestion(exercise, question)}
                            disabled={locked || text.trim().length < question.minChars}
                            style={{ border: "none", borderRadius: 10, padding: "8px 11px", cursor: locked || text.trim().length < question.minChars ? "not-allowed" : "pointer", background: locked ? "#CBD5E1" : "#EA580C", color: "white", fontWeight: 800 }}
                          >
                            {locked ? "Réponse validée" : "Valider la réponse"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            <section style={{ ...cardStyle, padding: 12, border: "1px solid #FCD34D", background: "#FFFBEB", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <p style={{ margin: 0, color: "#92400E", fontWeight: 700 }}>
                Étape finale : valider toutes les réponses puis cliquer sur « Valider ma copie ».
              </p>
              <button
                onClick={finalizeCopy}
                disabled={!canFinalize}
                style={{ border: "none", borderRadius: 10, padding: "9px 12px", cursor: canFinalize ? "pointer" : "not-allowed", fontWeight: 800, background: canFinalize ? "#EA580C" : "#CBD5E1", color: "white" }}
              >
                {finalizedAt ? "Copie déjà validée" : "Valider ma copie (final)"}
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
