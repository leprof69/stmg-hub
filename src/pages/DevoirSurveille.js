import { useEffect, useMemo, useRef, useState } from "react";
import { deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { DS_EXAM_ID, DS_LOCK_TYPE, DS_EXERCISES } from "../data/devoirSurveilleExam";
const DS_CODE_STORAGE_KEY = "devoirSurveilleUnlocked";
const DS_ACCESS_CODE = "POULPE";
const normalizeCode = (value = "") => String(value).trim().toUpperCase();
const HIDDEN_DISQUALIFY_DELAY_MS = 2000;

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
  const [banner, setBanner] = useState(null);
  const hiddenTimeoutRef = useRef(null);
  const disqualifyTriggeredRef = useRef(false);

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
      setForcedZero(Boolean(exam.forcedZero));
    };
    load();
  }, []);

  useEffect(() => {
    if (!unlocked || forcedZero || finalizedAt) return undefined;

    const disqualify = async (reason = "Sortie de page détectée") => {
      if (disqualifyTriggeredRef.current) return;
      disqualifyTriggeredRef.current = true;
      const user = auth.currentUser;
      setForcedZero(true);
      setBanner({ type: "error", text: `${reason} : note DS forcée à 0.` });
      if (!user) return;
      updateDoc(doc(db, "users", user.uid), {
        [`objectifBacDs.${DS_EXAM_ID}.forcedZero`]: true,
        [`objectifBacDs.${DS_EXAM_ID}.forcedZeroAt`]: new Date().toISOString(),
        [`objectifBacDs.${DS_EXAM_ID}.attemptStarted`]: true,
        [`objectifBacDs.${DS_EXAM_ID}.forcedZeroReason`]: reason,
      }).catch((err) => console.error("Sauvegarde forced zero impossible", err));
    };
    const onVisibility = () => {
      if (document.hidden) {
        if (hiddenTimeoutRef.current) return;
        // Tolérance large : évite de sanctionner un simple écran verrouillé/éteint brièvement.
        hiddenTimeoutRef.current = window.setTimeout(() => {
          hiddenTimeoutRef.current = null;
          disqualify("Changement d'écran / onglet prolongé");
        }, HIDDEN_DISQUALIFY_DELAY_MS);
      } else if (hiddenTimeoutRef.current) {
        window.clearTimeout(hiddenTimeoutRef.current);
        hiddenTimeoutRef.current = null;
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (hiddenTimeoutRef.current) {
        window.clearTimeout(hiddenTimeoutRef.current);
        hiddenTimeoutRef.current = null;
      }
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [unlocked, forcedZero, finalizedAt]);

  useEffect(() => {
    if (!forcedZero) {
      disqualifyTriggeredRef.current = false;
    }
  }, [forcedZero]);

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
    DS_EXERCISES.forEach((exercise) => {
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

  const resetAdminCopy = async () => {
    if (profil?.role !== "admin") return;
    if (!window.confirm("Réinitialiser entièrement ta copie de test DS (incluant anti-triche et note 0) ?")) return;
    const user = auth.currentUser;
    if (!user) return;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        [`objectifBacDs.${DS_EXAM_ID}`]: deleteField(),
      });
      setForcedZero(false);
      setFinalizedAt("");
      setDrafts({});
      setBanner({ type: "success", text: "Copie DS admin réinitialisée. Tu peux retester." });
    } catch (err) {
      console.error("Reset DS admin impossible", err);
      setBanner({ type: "error", text: "Reset impossible pour le moment." });
    }
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
          {profil?.role === "admin" && (
            <div style={{ marginTop: 10 }}>
              <button
                onClick={resetAdminCopy}
                style={{
                  border: "none",
                  borderRadius: 10,
                  padding: "8px 11px",
                  cursor: "pointer",
                  fontWeight: 800,
                  background: "#991B1B",
                  color: "white",
                }}
              >
                Réinitialiser ma copie test (admin)
              </button>
            </div>
          )}
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
                  Règle anti-triche : quitter l’onglet/la page plus de 2 secondes entraîne automatiquement la note 0.
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

            {DS_EXERCISES.map((exercise) => (
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
            {profil?.role === "admin" && (
              <div style={{ marginTop: 14 }}>
                <button
                  onClick={resetAdminCopy}
                  style={{
                    border: "none",
                    borderRadius: 10,
                    padding: "10px 14px",
                    cursor: "pointer",
                    fontWeight: 800,
                    background: "#FCA5A5",
                    color: "#7F1D1D",
                  }}
                >
                  Débloquer ma session test admin
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
