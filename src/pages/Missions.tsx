import { useState, useEffect, useMemo, type CSSProperties } from "react";
import { auth, db } from "../services/firebase";
import {
  buildMissionsAIPrompt,
  buildReliableMissionsEvaluation,
  callGeminiCorrection,
  callGroqCorrection,
  localCorrectionMissions,
} from "../services/correctionIA";
import type { ExerciseSupportTable } from "../services/correctionIA";
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import ProtectedTextarea from "../components/ProtectedTextarea";
import { formatJetons, formatJetonsDelta } from "../lib/jetons";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";
import type { SdgnMissionExercise } from "../data/sdgn/types";
import { getSdgnChapterReferential } from "../data/sdgn/chapterReferential";
import {
  detectSdgnChapterNumber,
  getSdgnChapterBlurb,
  getSdgnExercises,
  getSdgnProgressLabel,
  SDGN_CHAPTER_LABELS,
} from "../data/sdgn/registry";

/** Même clé `matiere` que dans Firestore / import Admin ; libellé court à l'écran. */
const MATIERES_MISSIONS = [
  { matiere: "Management", label: "Management" },
  { matiere: "Économie", label: "Économie" },
  { matiere: "Droit", label: "Droit" },
  { matiere: "Sciences de Gestion", label: "SDGN" },
] as const;

type ChapitreRow = {
  id: string;
  ordre?: number;
  titre?: string;
  theme?: string;
  matiere?: string;
  classe?: string;
  notions?: string[];
  competences?: string[];
  question?: string;
};

type ProfilLite = {
  classe?: string;
  role?: string;
};

type MissionsProps = {
  profil: ProfilLite;
  onXPGagne?: () => void;
};

type MissionExercise = SdgnMissionExercise;

function MissionSupportTables({ tables }: { tables: ExerciseSupportTable[] }) {
  const cell: CSSProperties = {
    border: "1px solid #fbbf24",
    padding: "8px 10px",
    verticalAlign: "top",
    fontSize: "0.88rem",
    lineHeight: 1.45,
    color: "#1e293b",
  };
  const th: CSSProperties = {
    ...cell,
    background: "linear-gradient(180deg, #fef3c7 0%, #fde68a 100%)",
    fontWeight: 800,
    color: "#92400e",
    whiteSpace: "nowrap",
  };
  return (
    <div style={{ marginTop: 10, overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
      {tables.map((tbl, ti) => (
        <div key={ti} style={{ marginBottom: ti < tables.length - 1 ? 14 : 0 }}>
          {tbl.title ? (
            <p style={{ margin: "0 0 6px", fontWeight: 800, fontSize: "0.84rem", color: "#78350f", letterSpacing: "0.02em" }}>
              {tbl.title}
            </p>
          ) : null}
          <table
            style={{
              width: "100%",
              minWidth: 260,
              borderCollapse: "collapse",
              background: "#fffbeb",
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "inset 0 0 0 1px rgba(217,119,6,0.22)",
            }}
          >
            <thead>
              <tr>
                {tbl.columns.map((c, ci) => (
                  <th key={ci} style={th}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tbl.rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? "#fffbeb" : "#fef9c3" }}>
                  {row.map((cellText, ci) => (
                    <td key={ci} style={{ ...cell, fontWeight: tbl.columns.length > 1 && ci === 0 ? 650 : 500 }}>
                      {cellText}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

type MissionEvalResult = {
  score: number;
  pourcentageXP: number;
  xpAccordee: number;
  feedback: string;
  analyseDeveloppee: string;
  pointsForts: string;
  pointsFaibles: string;
  conseilsProgression: string;
  propositionReponse: string;
  source: "ai" | "local";
  entrainementSansXp: boolean;
};

const MISSIONS_PROGRESS_VERSION = 1;

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();

const getScoreMood = (score: number) => {
  if (score >= 9) return { emoji: "🤯", text: "Niveau génie", color: "#166534" };
  if (score >= 8) return { emoji: "🔥", text: "Excellent", color: "#166534" };
  if (score >= 7) return { emoji: "😎", text: "Très solide", color: "#1D4ED8" };
  if (score >= 6) return { emoji: "🙂", text: "Bon travail", color: "#0369A1" };
  if (score >= 5) return { emoji: "🧐", text: "Correct mais perfectible", color: "#B45309" };
  if (score >= 3) return { emoji: "😅", text: "On continue, tu progresses", color: "#B45309" };
  return { emoji: "💪", text: "Ne rien lâcher", color: "#B91C1C" };
};

const formatDifficultyLabel = (d: MissionExercise["difficulty"]) => (d === "Tres difficile" ? "Très difficile" : d);

const DIFFICULTY_STYLE: Record<
  MissionExercise["difficulty"],
  { stripe: string; headerBg: string; badgeBg: string; badgeText: string }
> = {
  Facile: { stripe: "#059669", headerBg: "#ecfdf5", badgeBg: "#d1fae5", badgeText: "#064e3b" },
  Moyen: { stripe: "#ca8a04", headerBg: "#fffbeb", badgeBg: "#fef3c7", badgeText: "#78350f" },
  Difficile: { stripe: "#e11d48", headerBg: "#fff1f2", badgeBg: "#fecdd3", badgeText: "#881337" },
  "Tres difficile": { stripe: "#6366f1", headerBg: "#eef2ff", badgeBg: "#e0e7ff", badgeText: "#312e81" },
};

const formatExerciseTypeLabel = (t: MissionExercise["type"]) => (t === "Etude de cas" ? "Étude de cas" : t);

export default function Missions({ profil, onXPGagne }: MissionsProps) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const niveauxAccessibles = useMemo(
    () => (profil?.classe === "terminale" ? (["premiere", "terminale"] as const) : (["premiere"] as const)),
    [profil?.classe]
  );
  const peutChoisirClasse = profil?.role === "admin" || profil?.classe === "terminale";

  const [niveauSelectionne, setNiveauSelectionne] = useState<"premiere" | "terminale">(
    profil?.classe === "terminale" ? "terminale" : "premiere"
  );
  const [matiereSelectionnee, setMatiereSelectionnee] = useState<string>(MATIERES_MISSIONS[0].matiere);
  const [chapitres, setChapitres] = useState<ChapitreRow[]>([]);
  const [chapitreIdSelectionne, setChapitreIdSelectionne] = useState<string>("");
  const [chargementChapitres, setChargementChapitres] = useState(false);
  const [claims, setClaims] = useState<Record<string, { lastClaimDate?: string; totalClaims?: number }>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Record<string, MissionEvalResult>>({});
  const [uiMessage, setUiMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingId, setSavingId] = useState("");

  useEffect(() => {
    const def = profil?.classe === "terminale" ? "terminale" : "premiere";
    if (!niveauxAccessibles.includes(niveauSelectionne)) {
      setNiveauSelectionne(def);
    }
  }, [profil?.classe, niveauxAccessibles, niveauSelectionne]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setChargementChapitres(true);
      setChapitreIdSelectionne("");
      try {
        const q = query(
          collection(db, "chapitres"),
          where("matiere", "==", matiereSelectionnee),
          where("classe", "==", niveauSelectionne),
          orderBy("ordre")
        );
        const snap = await getDocs(q);
        const rows: ChapitreRow[] = snap.docs.map((d) => ({ id: d.id, ...d.data() } as ChapitreRow));
        if (!cancelled) {
          setChapitres(rows);
          if (rows.length) setChapitreIdSelectionne(rows[0].id);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setChapitres([]);
      } finally {
        if (!cancelled) setChargementChapitres(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [matiereSelectionnee, niveauSelectionne]);

  useEffect(() => {
    const loadClaims = async () => {
      const user = auth.currentUser;
      if (!user) return;
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) return;
        const raw = snap.data()?.missionsProgress || {};
        const nextClaims = raw?.version === MISSIONS_PROGRESS_VERSION ? (raw.claims || {}) : {};
        setClaims(nextClaims);
      } catch (err) {
        console.error("Chargement progression missions impossible", err);
      }
    };
    void loadClaims();
  }, []);

  const chapitreActif = chapitres.find((c) => c.id === chapitreIdSelectionne) ?? null;
  const sdgnChapterNum = useMemo(
    () => detectSdgnChapterNumber(chapitreActif, matiereSelectionnee),
    [chapitreActif, matiereSelectionnee]
  );
  const hasSdgnMissionPack = sdgnChapterNum != null;
  const sdgnProgressChapterLabel = useMemo(
    () => (sdgnChapterNum != null ? getSdgnProgressLabel(sdgnChapterNum) : "SDGN"),
    [sdgnChapterNum]
  );
  const sdgnPackExercises = useMemo(
    () => (sdgnChapterNum != null ? getSdgnExercises(sdgnChapterNum) : []),
    [sdgnChapterNum]
  );
  const potentialXP = useMemo(() => sdgnPackExercises.reduce((sum, ex) => sum + ex.xp, 0), [sdgnPackExercises]);

  const sdgnReferential = useMemo(
    () => (sdgnChapterNum != null ? getSdgnChapterReferential(sdgnChapterNum) : null),
    [sdgnChapterNum]
  );

  const missionExerciseForCorrection = (exercise: MissionExercise): MissionExercise & {
    referentielNotions?: string[];
    referentielCompetences?: string[];
  } => ({
    ...exercise,
    referentielNotions: sdgnReferential?.notions,
    referentielCompetences: sdgnReferential?.competences,
  });

  const evaluateAndClaimXP = async (exercise: MissionExercise) => {
    const user = auth.currentUser;
    const exerciseEval = missionExerciseForCorrection(exercise);
    if (!user) {
      setUiMessage({ type: "error", text: "Session expirée. Reconnecte-toi pour valider tes jetons." });
      return;
    }
    const text = (answers[exercise.id] || "").trim();
    if (text.length < exercise.minChars) {
      setUiMessage({
        type: "error",
        text: `Réponse trop courte pour « ${exercise.title} » (${exercise.minChars} caractères minimum).`,
      });
      return;
    }
    if (xpRewardsSuspended) {
      setUiMessage({ type: "error", text: PLATFORM_XP_BLOCKED_MESSAGE });
      return;
    }

    setSavingId(exercise.id);
    try {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) {
        setUiMessage({ type: "error", text: "Profil introuvable." });
        return;
      }
      const data = snap.data();
      const stored = data.missionsProgress || {};
      const prevClaims = stored?.version === MISSIONS_PROGRESS_VERSION ? (stored.claims || {}) : {};
      const prevEntry = prevClaims[exercise.id];
      const entrainementSansXp = (prevEntry?.totalClaims ?? 0) >= 1;
      const today = getTodayKey();

      const local = localCorrectionMissions(exerciseEval, text);
      const prompt = buildMissionsAIPrompt(exerciseEval, text);
      let ai = null;
      try {
        ai = await callGeminiCorrection(prompt);
        if (!ai) ai = await callGroqCorrection(prompt);
      } catch {
        ai = null;
      }
      const reliable = buildReliableMissionsEvaluation(local, ai, exerciseEval);
      const score = reliable.score;
      const pourcentageBrute = Math.max(0, Math.min(100, Math.round(score * 10)));
      const xpBrute = Math.round((exercise.xp * pourcentageBrute) / 100);
      const xpAccordee = entrainementSansXp ? 0 : xpBrute;
      const pourcentageXP = entrainementSansXp ? 0 : pourcentageBrute;

      const nextClaims = {
        ...prevClaims,
        [exercise.id]: {
          lastClaimDate: today,
          totalClaims: (prevEntry?.totalClaims || 0) + 1,
        },
      };
      await updateDoc(ref, {
        xp: (data.xp || 0) + xpAccordee,
        missionsProgress: {
          ...(stored || {}),
          version: MISSIONS_PROGRESS_VERSION,
          chapter: sdgnProgressChapterLabel,
          claims: {
            ...nextClaims,
            [exercise.id]: {
              ...(nextClaims[exercise.id] || {}),
              lastScore: score,
              lastPercent: pourcentageBrute,
              lastXpAwarded: xpAccordee,
            },
          },
        },
      });
      setClaims(nextClaims);
      setEvaluations((prev) => ({
        ...prev,
        [exercise.id]: {
          score,
          pourcentageXP,
          xpAccordee,
          feedback: reliable.feedback,
          analyseDeveloppee: reliable.analyseDeveloppee,
          pointsForts: reliable.pointsForts,
          pointsFaibles: reliable.pointsFaibles,
          conseilsProgression: reliable.conseilsProgression,
          propositionReponse: reliable.propositionReponse,
          source: reliable.source,
          entrainementSansXp,
        },
      }));
      setUiMessage({
        type: "success",
        text: entrainementSansXp
          ? `Correction terminée : ${score}/10. Entraînement : les jetons ne sont comptés qu'une fois par exercice (${formatJetons(0)} cette fois).`
          : `Correction terminée : ${score}/10 → ${pourcentageBrute}% de la récompense mission, soit ${formatJetonsDelta(xpAccordee)}.`,
      });
      if (onXPGagne && xpAccordee > 0) onXPGagne();
    } catch (err) {
      console.error("Validation jetons mission impossible", err);
      setUiMessage({ type: "error", text: "Validation impossible pour le moment." });
    } finally {
      setSavingId("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg,#0b1220 0%,#111827 40%,#1e293b 100%)", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "24px 16px 48px" }}>
        <div
          style={{
            background: "linear-gradient(145deg,#0f172a 0%,#1e293b 55%,#334155 100%)",
            borderRadius: "16px",
            padding: "24px 26px",
            marginBottom: "22px",
            border: "1px solid #475569",
            boxShadow: "0 4px 24px rgba(15,23,42,0.35)",
          }}
        >
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.1rem", color: "#f8fafc", margin: "0 0 8px", letterSpacing: "0.02em" }}>
            Missions
          </h1>
          <p style={{ color: "#cbd5e1", margin: 0, fontSize: "0.95rem", fontWeight: 600, lineHeight: 1.5 }}>
            Choisis le niveau, la matière puis le chapitre (même arborescence que l'onglet Chapitres).
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: "14px",
            border: "1px solid #e2e8f0",
            padding: "16px",
            marginBottom: "18px",
            boxShadow: "0 1px 3px rgba(15,23,42,0.06)",
          }}
        >
          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#0f172a", fontSize: "1.05rem", margin: "0 0 14px" }}>Filtres</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
            <div style={{ borderRadius: "12px", border: "1px solid #e2e8f0", padding: "10px 12px", background: "#f8fafc" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#0369a1", fontSize: "0.78rem", margin: "0 0 6px" }}>
                Niveau
              </p>
              {peutChoisirClasse ? (
                <select
                  value={niveauSelectionne}
                  onChange={(e) => setNiveauSelectionne(e.target.value as "premiere" | "terminale")}
                  style={{
                    width: "100%",
                    border: "1px solid #cbd5e1",
                    borderRadius: "10px",
                    padding: "8px 10px",
                    fontFamily: "'Nunito', sans-serif",
                    fontWeight: 700,
                    color: "#0f172a",
                    background: "white",
                  }}
                >
                  {niveauxAccessibles.map((nv) => (
                    <option key={nv} value={nv}>
                      {nv === "terminale" ? "Terminale STMG" : "Première STMG"}
                    </option>
                  ))}
                </select>
              ) : (
                <p style={{ margin: 0, fontWeight: 700, color: "#1F2937" }}>Première STMG</p>
              )}
            </div>

            <div style={{ borderRadius: "12px", border: "1px solid #e2e8f0", padding: "10px 12px", background: "#f8fafc" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#475569", fontSize: "0.78rem", margin: "0 0 6px" }}>
                Matière
              </p>
              <select
                value={matiereSelectionnee}
                onChange={(e) => setMatiereSelectionnee(e.target.value)}
                style={{
                  width: "100%",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#0f172a",
                  background: "white",
                }}
              >
                {MATIERES_MISSIONS.map((m) => (
                  <option key={m.matiere} value={m.matiere}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ borderRadius: "12px", border: "1px solid #e2e8f0", padding: "10px 12px", background: "#f8fafc" }}>
              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#15803d", fontSize: "0.78rem", margin: "0 0 6px" }}>
                Chapitre
              </p>
              <select
                value={chapitreIdSelectionne}
                onChange={(e) => setChapitreIdSelectionne(e.target.value)}
                disabled={chargementChapitres || chapitres.length === 0}
                style={{
                  width: "100%",
                  border: "1px solid #cbd5e1",
                  borderRadius: "10px",
                  padding: "8px 10px",
                  fontFamily: "'Nunito', sans-serif",
                  fontWeight: 700,
                  color: "#0f172a",
                  background: "white",
                  opacity: chargementChapitres || chapitres.length === 0 ? 0.6 : 1,
                }}
              >
                {chapitres.length === 0 && !chargementChapitres ? (
                  <option value="">Aucun chapitre pour ce couple niveau / matière</option>
                ) : (
                  chapitres.map((ch) => (
                    <option key={ch.id} value={ch.id}>
                      Chap. {ch.ordre ?? "?"} — {ch.titre || ch.id}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "center",
            padding: "22px",
            background: "#ffffff",
            borderRadius: "14px",
            border: hasSdgnMissionPack ? "1px solid #cbd5e1" : "1px dashed #94a3b8",
            boxShadow: hasSdgnMissionPack ? "0 1px 3px rgba(15,23,42,0.06)" : "none",
          }}
        >
          {!hasSdgnMissionPack ? (
            <>
              <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.4rem", color: "#0f172a", margin: "0 0 12px" }}>
                Exercices à venir
              </p>
              <p
                style={{
                  color: "#334155",
                  fontSize: "0.98rem",
                  margin: 0,
                  maxWidth: "560px",
                  marginLeft: "auto",
                  marginRight: "auto",
                  fontWeight: 600,
                  lineHeight: 1.55,
                }}
              >
                Sélectionne SDGN et un chapitre (1 à 13) pour afficher les 10 exercices progressifs et 2 études de cas alignés sur le manuel.
              </p>
            </>
          ) : (
            <div style={{ textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.35rem", color: "#0f172a", margin: 0, letterSpacing: "0.02em" }}>
                  {sdgnChapterNum != null
                    ? `SDGN — Chapitre ${sdgnChapterNum} : ${SDGN_CHAPTER_LABELS[sdgnChapterNum]}`
                    : "SDGN : missions"}
                </p>
                <span
                  style={{
                    background: "#f1f5f9",
                    color: "#0f172a",
                    borderRadius: 999,
                    padding: "7px 12px",
                    fontWeight: 800,
                    fontSize: 13,
                    border: "1px solid #cbd5e1",
                  }}
                >
                  Potentiel : {formatJetonsDelta(potentialXP)}
                </span>
              </div>
              <p style={{ margin: "0 0 14px", fontSize: "0.88rem", color: "#64748b", fontWeight: 600, lineHeight: 1.45 }}>
                {sdgnChapterNum != null ? getSdgnChapterBlurb(sdgnChapterNum) : ""}
              </p>
              <p style={{ color: "#475569", margin: "0 0 14px", fontSize: "0.94rem", fontWeight: 600 }}>
                Anti-triche : copier-coller, menu contextuel et glisser-déposer bloqués sur les réponses. Les jetons ne sont
                suspendus que si tu quittes l&apos;onglet (ou une autre fenêtre passe au premier plan) pendant au moins
                quelques secondes — une notification ou un clic accidentel ne suffit pas. Rester sur cet onglet ne compte
                pas comme triche.
              </p>
              {chapitreActif && (
                <div
                  style={{
                    marginBottom: 16,
                    borderRadius: 12,
                    padding: "14px 16px",
                    border: "1px solid #cbd5e1",
                    background: "#f8fafc",
                    color: "#0f172a",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'Fredoka One', cursive",
                      fontSize: "1rem",
                      margin: "0 0 12px",
                      color: "#0f172a",
                      borderLeft: "4px solid #0d9488",
                      paddingLeft: 10,
                    }}
                  >
                    Référentiel du chapitre (commun à toutes les missions)
                  </p>
                  {(chapitreActif.question?.trim() || sdgnReferential?.question) ? (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ fontFamily: "'Fredoka One', cursive", margin: "0 0 6px", fontWeight: 700, color: "#0f766e", fontSize: "0.88rem" }}>
                        Question de gestion
                      </p>
                      <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.55, fontSize: "0.95rem", color: "#334155" }}>
                        {chapitreActif.question?.trim() || sdgnReferential?.question}
                      </p>
                    </div>
                  ) : null}
                  {(() => {
                    const notions =
                      chapitreActif.notions && chapitreActif.notions.length > 0
                        ? chapitreActif.notions
                        : sdgnReferential?.notions ?? [];
                    const competences =
                      chapitreActif.competences && chapitreActif.competences.length > 0
                        ? chapitreActif.competences
                        : sdgnReferential?.competences ?? [];
                    if (notions.length === 0 && competences.length === 0) {
                      return (
                        <p style={{ margin: 0, fontWeight: 600, color: "#64748b", fontSize: "0.92rem" }}>
                          Référentiel indisponible pour ce chapitre.
                        </p>
                      );
                    }
                    return (
                      <>
                        {competences.length > 0 ? (
                          <div style={{ marginBottom: 12 }}>
                            <p
                              style={{
                                fontFamily: "'Fredoka One', cursive",
                                margin: "0 0 6px",
                                fontWeight: 700,
                                color: "#0f766e",
                                fontSize: "0.88rem",
                              }}
                            >
                              Compétences (référentiel SDGN)
                            </p>
                            <ul
                              style={{
                                margin: 0,
                                paddingLeft: 22,
                                fontWeight: 600,
                                lineHeight: 1.5,
                                color: "#334155",
                                fontSize: "0.93rem",
                              }}
                            >
                              {competences.map((c, i) => (
                                <li key={`ref-c-${i}`}>{c}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                        {notions.length > 0 ? (
                          <div>
                            <p
                              style={{
                                fontFamily: "'Fredoka One', cursive",
                                margin: "0 0 6px",
                                fontWeight: 700,
                                color: "#0f766e",
                                fontSize: "0.88rem",
                              }}
                            >
                              Notions (à mobiliser dans chaque mission)
                            </p>
                            <p style={{ margin: 0, fontWeight: 600, lineHeight: 1.55, fontSize: "0.93rem", color: "#334155" }}>
                              {notions.join(" · ")}
                            </p>
                          </div>
                        ) : null}
                      </>
                    );
                  })()}
                </div>
              )}
              {uiMessage && (
                <div
                  style={{
                    marginBottom: 12,
                    borderRadius: 10,
                    padding: "10px 12px",
                    fontWeight: 800,
                    border: `1px solid ${uiMessage.type === "success" ? "#86efac" : "#fca5a5"}`,
                    color: uiMessage.type === "success" ? "#14532d" : "#991b1b",
                    background: uiMessage.type === "success" ? "#ecfdf5" : "#fef2f2",
                  }}
                >
                  {uiMessage.text}
                </div>
              )}
              <div style={{ display: "grid", gap: "16px" }}>
                {sdgnPackExercises.map((exercise, index) => {
                  const answer = answers[exercise.id] || "";
                  const evalResult = evaluations[exercise.id];
                  const mood = evalResult ? getScoreMood(evalResult.score) : null;
                  const xpDejaAccorde = (claims[exercise.id]?.totalClaims ?? 0) > 0;
                  const canClaim = answer.trim().length >= exercise.minChars && savingId !== exercise.id;
                  const diffStyle = DIFFICULTY_STYLE[exercise.difficulty];
                  const isCas = exercise.type === "Etude de cas";
                  return (
                    <article
                      key={exercise.id}
                      style={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderLeft: `4px solid ${diffStyle.stripe}`,
                        borderRadius: 12,
                        padding: 0,
                        overflow: "hidden",
                        boxShadow: "0 1px 3px rgba(15,23,42,0.08)",
                      }}
                    >
                      <div
                        style={{
                          background: diffStyle.headerBg,
                          padding: "10px 14px",
                          borderBottom: "1px solid #e2e8f0",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 8,
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                          <span
                            style={{
                              background: "#ffffff",
                              color: "#0f172a",
                              borderRadius: 8,
                              padding: "5px 10px",
                              fontWeight: 800,
                              fontSize: 12,
                              fontFamily: "'Fredoka One', cursive",
                              border: "1px solid #cbd5e1",
                            }}
                          >
                            {index + 1}. {formatExerciseTypeLabel(exercise.type)}
                          </span>
                          <span
                            style={{
                              background: diffStyle.badgeBg,
                              color: diffStyle.badgeText,
                              borderRadius: 8,
                              padding: "5px 10px",
                              fontWeight: 800,
                              fontSize: 12,
                              border: "1px solid rgba(15,23,42,0.12)",
                            }}
                          >
                            {formatDifficultyLabel(exercise.difficulty)}
                          </span>
                          <span
                            style={{
                              background: isCas ? "#ffe4e6" : "#f1f5f9",
                              color: "#334155",
                              borderRadius: 8,
                              padding: "5px 10px",
                              fontWeight: 800,
                              fontSize: 12,
                              border: "1px solid #cbd5e1",
                            }}
                          >
                            {formatJetonsDelta(exercise.xp)}
                          </span>
                        </div>
                      </div>
                      <div style={{ padding: "16px 16px 18px" }}>
                        <p style={{ margin: "0 0 12px", fontWeight: 800, color: "#0f172a", fontSize: "1.05rem", fontFamily: "'Fredoka One', cursive", lineHeight: 1.35 }}>
                          {exercise.title}
                        </p>
                        <div style={{ margin: "0 0 14px" }}>
                          <p style={{ margin: "0 0 6px", fontFamily: "'Fredoka One', cursive", fontWeight: 700, color: "#475569", fontSize: "0.82rem", letterSpacing: "0.03em" }}>
                            CONSIGNE
                          </p>
                          <p style={{ margin: 0, color: "#1e293b", lineHeight: 1.6, fontWeight: 500, fontSize: "0.98rem" }}>{exercise.consigne}</p>
                        </div>
                        {(exercise.support || (exercise.supportTables && exercise.supportTables.length > 0)) && (
                          <div
                            style={{
                              margin: "0 0 14px",
                              color: "#1e293b",
                              lineHeight: 1.6,
                              background: "#fffbeb",
                              border: "1px solid #fcd34d",
                              borderRadius: 10,
                              padding: "12px 14px",
                            }}
                          >
                            <p style={{ margin: "0 0 6px", fontFamily: "'Fredoka One', cursive", fontWeight: 700, color: "#b45309", fontSize: "0.82rem" }}>SUPPORT</p>
                            {exercise.support ? (
                              <p style={{ margin: 0, fontWeight: 500, fontSize: "0.96rem", whiteSpace: "pre-wrap" }}>{exercise.support}</p>
                            ) : null}
                            {exercise.supportTables && exercise.supportTables.length > 0 ? (
                              <MissionSupportTables tables={exercise.supportTables} />
                            ) : null}
                          </div>
                        )}
                        {exercise.questions && exercise.questions.length > 0 && (
                          <div style={{ margin: "0 0 14px" }}>
                            <p
                              style={{
                                margin: "0 0 10px",
                                fontFamily: "'Fredoka One', cursive",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                color: "#0f172a",
                              }}
                            >
                              Questions à traiter
                            </p>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                              {exercise.questions.map((question, qi) => (
                                <div
                                  key={`${exercise.id}-q-${qi}`}
                                  style={{
                                    background: "#ffffff",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: 10,
                                    padding: "12px 14px",
                                    borderLeft: "4px solid #0d9488",
                                    boxShadow: "0 1px 2px rgba(15,23,42,0.04)",
                                  }}
                                >
                                  <p
                                    style={{
                                      margin: 0,
                                      fontSize: "0.78rem",
                                      fontWeight: 800,
                                      color: "#0f766e",
                                      letterSpacing: "0.04em",
                                      textTransform: "uppercase",
                                    }}
                                  >
                                    Question {qi + 1}
                                  </p>
                                  <p style={{ margin: "8px 0 0", fontWeight: 500, fontSize: "0.97rem", color: "#1e293b", lineHeight: 1.55 }}>
                                    {question}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <p
                          style={{
                            margin: "0 0 10px",
                            padding: "10px 12px",
                            borderRadius: 10,
                            border: "1px solid #99f6e4",
                            background: "linear-gradient(135deg, #f0fdfa 0%, #ecfeff 100%)",
                            color: "#115e59",
                            fontSize: "0.88rem",
                            fontWeight: 600,
                            lineHeight: 1.5,
                          }}
                        >
                          <span style={{ fontFamily: "'Fredoka One', cursive", fontWeight: 700, color: "#0f766e" }}>Rédaction</span>
                          {" — "}
                          Nomme les notions du cours (valeur ajoutée, consommations intermédiaires, parties prenantes, etc.) et relie les chiffres à ton raisonnement :
                          comme sur une copie papier ou au bac, quelques phrases claires valent mieux qu’un bloc de chiffres seuls — et la correction automatique
                          suit mieux ton travail.
                        </p>
                        <ProtectedTextarea
                          value={answer}
                          onChange={(e) => setAnswers((prev) => ({ ...prev, [exercise.id]: e.target.value }))}
                          placeholder="Écris ta réponse ici…"
                          enableProtection
                          onBlockedAction={() =>
                            setUiMessage({
                              type: "error",
                              text: "Action bloquée : anti-triche active sur cette zone.",
                            })
                          }
                          style={{
                            width: "100%",
                            minHeight: 130,
                            borderRadius: 10,
                            border: "1px solid #cbd5e1",
                            padding: "12px",
                            resize: "vertical",
                            boxSizing: "border-box",
                            fontFamily: "'Nunito', sans-serif",
                            fontWeight: 500,
                            fontSize: "0.98rem",
                            lineHeight: 1.55,
                          }}
                        />
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
                          <p style={{ margin: 0, color: "#64748b", fontSize: 12, fontWeight: 600 }}>
                            {answer.trim().length} caractères / {exercise.minChars} minimum
                          </p>
                          <button
                            type="button"
                            onClick={() => void evaluateAndClaimXP(exercise)}
                            disabled={!canClaim}
                            style={{
                              border: "1px solid #0f766e",
                              borderRadius: 10,
                              padding: "10px 16px",
                              fontWeight: 800,
                              cursor: canClaim ? "pointer" : "not-allowed",
                              background: canClaim ? "#0d9488" : "#cbd5e1",
                              color: canClaim ? "#ffffff" : "#64748b",
                              fontFamily: "'Nunito', sans-serif",
                              fontSize: "0.95rem",
                            }}
                          >
                            {savingId === exercise.id
                              ? "Correction…"
                              : xpDejaAccorde
                                ? "Corriger (sans jetons)"
                                : "Corriger et valider les jetons"}
                          </button>
                        </div>
                        {xpDejaAccorde && (
                          <p style={{ margin: "10px 0 0", fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                            Tu as déjà obtenu les jetons pour cet exercice : chaque nouvelle correction compte comme entraînement ({formatJetons(0)}).
                          </p>
                        )}
                        {evalResult && (
                          <div
                            style={{
                              marginTop: 14,
                              background: "#f8fafc",
                              border: "1px solid #cbd5e1",
                              borderLeft: "4px solid #0d9488",
                              borderRadius: 10,
                              padding: 14,
                            }}
                          >
                            <p style={{ margin: "0 0 6px", color: "#0f172a", fontWeight: 800, fontFamily: "'Fredoka One', cursive", fontSize: "0.98rem" }}>
                              Résultat : {evalResult.score}/10
                              {evalResult.entrainementSansXp
                                ? ` — entraînement (${formatJetons(0)})`
                                : ` — ${Math.max(0, Math.min(100, Math.round(evalResult.score * 10)))}% de la récompense mission → ${formatJetonsDelta(evalResult.xpAccordee)}`}
                            </p>
                            {mood && (
                              <p style={{ margin: "0 0 8px", color: mood.color, fontWeight: 800, fontSize: "1.2rem" }}>
                                {mood.emoji} {mood.text}
                              </p>
                            )}
                            <p style={{ margin: "0 0 6px", color: "#166534", fontWeight: 600 }}>
                              <strong>Points + :</strong> {evalResult.pointsForts}
                            </p>
                            <p style={{ margin: "0 0 6px", color: "#b45309", fontWeight: 600 }}>
                              <strong>Points − :</strong> {evalResult.pointsFaibles}
                            </p>
                            <p style={{ margin: "0 0 8px", color: "#334155", fontWeight: 500, lineHeight: 1.55 }}>
                              <strong>Synthèse :</strong> {evalResult.feedback}
                            </p>
                            {evalResult.analyseDeveloppee ? (
                              <p style={{ margin: "0 0 8px", color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.55, fontWeight: 500 }}>
                                <strong style={{ fontFamily: "'Fredoka One', cursive", color: "#0f172a" }}>Analyse détaillée</strong>
                                {"\n"}
                                {evalResult.analyseDeveloppee}
                              </p>
                            ) : null}
                            {evalResult.conseilsProgression ? (
                              <p style={{ margin: "0 0 10px", color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.55, fontWeight: 500 }}>
                                <strong style={{ fontFamily: "'Fredoka One', cursive", color: "#0f172a" }}>Conseils</strong>
                                {"\n"}
                                {evalResult.conseilsProgression}
                              </p>
                            ) : null}
                            <div style={{ background: "#ecfdf5", border: "1px solid #86efac", borderRadius: 8, padding: 12 }}>
                              <p style={{ margin: "0 0 6px", color: "#14532d", fontWeight: 800, fontFamily: "'Fredoka One', cursive", fontSize: "0.9rem" }}>
                                Réponse proposée (à noter au cahier)
                              </p>
                              <p style={{ margin: 0, color: "#166534", whiteSpace: "pre-wrap", lineHeight: 1.55, fontWeight: 500 }}>
                                {evalResult.propositionReponse}
                              </p>
                            </div>
                            <p style={{ margin: "8px 0 0", fontSize: 12, color: "#64748b", fontWeight: 600 }}>
                              Source : {evalResult.source === "ai" ? "IA + garde-fous locaux" : "Correction locale"}
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
