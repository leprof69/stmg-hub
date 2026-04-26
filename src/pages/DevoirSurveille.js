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
      { id: "q1", label: "Q1", prompt: "Définis la performance d’une organisation et donne les 3 étapes de la démarche de performance." },
      { id: "q2", label: "Q2", prompt: "Explique la différence entre efficacité et efficience avec un exemple." },
      { id: "q3", label: "Q3", prompt: "Définis rentabilité et profitabilité, puis cite 3 indicateurs de performance commerciale." },
    ],
  },
  {
    id: "ds13_e2",
    title: "Partie 2 - Calculs",
    context: "NOVA SNACK : N CA 1 260 000 €, marché 6 000 000 €, RN 94 500 €, CP 540 000 €. N-1 CA 1 080 000 €, marché 5 700 000 €, RN 81 000 €, CP 500 000 €.",
    questions: [
      { id: "q1", label: "Q1", prompt: "Calcule le taux d’évolution du CA entre N-1 et N (formule + calcul + résultat)." },
      { id: "q2", label: "Q2", prompt: "Calcule la part de marché en N-1 puis en N, puis compare." },
      { id: "q3", label: "Q3", prompt: "Calcule profitabilité et rentabilité en N-1 puis en N, puis rédige ton analyse." },
    ],
  },
  {
    id: "ds13_e3",
    title: "Partie 3 - Analyse d’objectifs",
    context: "ECO'BAG : objectif +10% CA, satisfaction 90%, délai max 3 jours. Résultats : CA 800 000 -> 860 000, satisfaction 87%, délai 3,8 jours.",
    questions: [
      { id: "q1", label: "Q1", prompt: "Calcule l’évolution du CA et indique si l’objectif +10 % est atteint." },
      { id: "q2", label: "Q2", prompt: "Vérifie les objectifs satisfaction et délai, puis justifie." },
      { id: "q3", label: "Q3", prompt: "Rédige une analyse globale et propose 2 actions d’amélioration concrètes." },
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
      if (exam.submissions && typeof exam.submissions === "object") {
        const nextDrafts = {};
        Object.entries(exam.submissions).forEach(([exerciseId, exerciseData]) => {
          const questionMap = exerciseData?.questions || {};
          nextDrafts[exerciseId] = {};
          Object.entries(questionMap).forEach(([questionId, qData]) => {
            nextDrafts[exerciseId][questionId] = qData?.answer || "";
          });
        });
        setDrafts(nextDrafts);
      }
      if (exam.finalizedAt) setFinalizedAt(exam.finalizedAt);
      if (exam.forcedZero) setForcedZero(true);
      if (exam.attemptStarted || exam.submissions) setAttemptStarted(true);
    };
    load();
  }, []);

  useEffect(() => {
    if (!attemptStarted || forcedZero || finalizedAt) return undefined;
    const disqualify = async (reason = "Sortie de page détectée") => {
      const user = auth.currentUser;
      setForcedZero(true);
      setBanner({ type: "error", text: `${reason} : note DS forcée à 0.` });
      if (!user) return;
      await updateDoc(doc(db, "users", user.uid), {
        [`objectifBacDs.${DS_EXAM_ID}.forcedZero`]: true,
        [`objectifBacDs.${DS_EXAM_ID}.forcedZeroAt`]: new Date().toISOString(),
        [`objectifBacDs.${DS_EXAM_ID}.attemptStarted`]: true,
        [`objectifBacDs.${DS_EXAM_ID}.forcedZeroReason`]: reason,
      });
    };
    const onVisibility = () => {
      if (document.hidden) disqualify("Changement d'écran / onglet");
    };
    const onBlur = () => disqualify("Perte de focus de la fenêtre");
    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("blur", onBlur);
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
    setAttemptStarted(true);
    setDrafts((prev) => ({
      ...prev,
      [exerciseId]: {
        ...(prev[exerciseId] || {}),
        [questionId]: value,
      },
    }));
  };

  const canFinalize = useMemo(() => {
    return unlocked && !forcedZero && !finalizedAt;
  }, [unlocked, forcedZero, finalizedAt]);

  const finalizeCopy = async () => {
    if (!canFinalize) {
      setBanner({ type: "error", text: "Toutes les questions ne sont pas validées." });
      return;
    }
    const user = auth.currentUser;
    if (!user) return;
    const now = new Date().toISOString();
    const submissionPayload = {};
    EXERCISES.forEach((exercise) => {
      submissionPayload[exercise.id] = {
        title: exercise.title,
        questions: {},
      };
      exercise.questions.forEach((question) => {
        submissionPayload[exercise.id].questions[question.id] = {
          prompt: question.prompt,
          answer: String(drafts?.[exercise.id]?.[question.id] || "").trim(),
          validatedAt: now,
        };
      });
    });
    setFinalizedAt(now);
    await updateDoc(doc(db, "users", user.uid), {
      [`objectifBacDs.${DS_EXAM_ID}.examId`]: DS_EXAM_ID,
      [`objectifBacDs.${DS_EXAM_ID}.type`]: DS_LOCK_TYPE,
      [`objectifBacDs.${DS_EXAM_ID}.attemptStarted`]: true,
      [`objectifBacDs.${DS_EXAM_ID}.submissions`]: submissionPayload,
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
            Chapitre 13 - 1 heure - anti-triche actif - réponses libres puis validation finale de copie.
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
                    const locked = forcedZero || Boolean(finalizedAt);
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
                        <p style={{ margin: "8px 0 0", color: "#64748B", fontSize: 12 }}>
                          {locked ? "Réponse verrouillée après validation finale." : "Tu peux modifier cette réponse jusqu'à la validation finale."}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}

            <section style={{ ...cardStyle, padding: 12, border: "1px solid #FCD34D", background: "#FFFBEB", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <p style={{ margin: 0, color: "#92400E", fontWeight: 700 }}>
                Étape finale : quand tu as terminé toutes tes réponses, clique sur « Valider ma copie ».
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

      {forcedZero && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 5000,
            background: "rgba(127, 29, 29, 0.96)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              width: "min(760px, 96vw)",
              borderRadius: 22,
              border: "3px solid #FCA5A5",
              background: "#7F1D1D",
              color: "#FEE2E2",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.45)",
              padding: "28px 22px",
            }}
          >
            <p style={{ margin: "0 0 10px", fontSize: "2rem", fontWeight: 900, color: "#FECACA" }}>
              ⛔ ALERTE ANTI-TRICHE
            </p>
            <p style={{ margin: "0 0 8px", fontSize: "1.45rem", fontWeight: 900, color: "#FCA5A5" }}>
              NOTE DS FORCÉE À 0
            </p>
            <p style={{ margin: 0, fontSize: "1.02rem", lineHeight: 1.6 }}>
              Un changement d’écran / perte de focus a été détecté.
              <br />
              L’épreuve est disqualifiée et la page est verrouillée.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
