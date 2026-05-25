import { useState, useEffect, useMemo, type CSSProperties } from "react";
import "./Missions.css";
import { auth, db } from "../services/firebase";
import { localCorrectionMissions } from "../services/correctionIA";
import type { ExerciseSupportTable } from "../services/correctionIA";
import { collection, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import ProtectedTextarea from "../components/ProtectedTextarea";
import { formatJetonsDelta } from "../lib/jetons";
import { getMissionLetterGradeMeta, sanitizeMissionEvaluationText } from "../lib/missionGrades";
import { splitReadableParagraphs } from "../lib/missionReadableText";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";
import type { SdgnMissionExercise } from "../data/sdgn/types";
import { MANAGEMENT_CHAPTER_LABELS } from "../data/management/registry";
import { getSdgnChapterReferential } from "../data/sdgn/chapterReferential";
import { SDGN_CHAPTER_LABELS } from "../data/sdgn/registry";
import {
  detectMissionChapterNumber,
  getMissionChapterBlurb,
  getMissionExercises,
  getMissionProgressLabel,
  hasMissionPack,
} from "../lib/missionPack";
import { rubricCorrectionMissions } from "../lib/missionRubric";
import { getMissionRubricPack } from "../lib/missionRubric/registry";
import {
  MISSIONS_PROGRESS_VERSION,
  MISSIONS_XP_REWARD_WAVE,
  missionJetonsDejaGagnesPourVague,
  readMissionClaims,
  type MissionClaimEntry,
} from "../lib/missionsProgress";

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
    <div className="mission-support-table-wrap">
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
  source: "local" | "rubric";
  entrainementSansXp: boolean;
};

const missionQuestionAnswerKey = (exerciseId: string, questionIndex: number) => `${exerciseId}__q${questionIndex}`;

function getMissionCombinedAnswer(
  exercise: MissionExercise,
  answers: Record<string, string>,
  useRubric: boolean
): string {
  const qs = exercise.questions ?? [];
  if (!useRubric || qs.length === 0) return answers[exercise.id] || "";
  return qs.map((_, qi) => (answers[missionQuestionAnswerKey(exercise.id, qi)] || "").trim()).join("\n\n");
}

function getMissionAnswersByQuestion(exercise: MissionExercise, answers: Record<string, string>): string[] {
  const qs = exercise.questions ?? [];
  return qs.map((_, qi) => answers[missionQuestionAnswerKey(exercise.id, qi)] || "");
}

/** Tous les packs Missions (SDGN + Management) : une zone de réponse par question si le sujet en a. */
function exerciseUsesPerQuestionAnswers(exercise: MissionExercise): boolean {
  return Boolean(exercise.questions?.length);
}

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

function MissionReadableText({
  text,
  className,
  sanitize = true,
}: {
  text: string;
  className?: string;
  sanitize?: boolean;
}) {
  const paragraphs = useMemo(() => {
    const source = sanitize ? sanitizeMissionEvaluationText(text) : text;
    return splitReadableParagraphs(source);
  }, [text, sanitize]);
  return (
    <div className={className ? `mission-readable ${className}` : "mission-readable"}>
      {paragraphs.map((paragraph, index) => (
        <p key={`${index}-${paragraph.slice(0, 24)}`} className="mission-readable__line">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

const normalize = (value = "") =>
  String(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

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

function getExerciseNotionChips(exercise: MissionExercise): string[] {
  const fromNotions = (exercise.notionsCibles ?? [])
    .map((n) => n.trim().replace(/\.$/, ""))
    .filter((n) => n.length >= 3 && n.length <= 48 && !/^(trois|quatre|deux|une?)\s/i.test(n));
  if (fromNotions.length) return fromNotions.slice(0, 6);

  const attendu = exercise.attendu?.trim();
  if (!attendu) return [];
  return attendu
    .split(/[,;·]/)
    .map((part) => part.trim().replace(/\.$/, ""))
    .filter((part) => part.length > 4 && part.length <= 42 && !/\b(correctement|distincts|nommés)\b/i.test(part))
    .slice(0, 4);
}

function isMissionExerciseCompleted(exerciseId: string, claims: Record<string, MissionClaimEntry>): boolean {
  return (claims[exerciseId]?.totalClaims ?? 0) > 0;
}

function getFirstIncompleteExerciseIndex(
  exercises: MissionExercise[],
  claims: Record<string, MissionClaimEntry>
): number {
  const idx = exercises.findIndex((ex) => !isMissionExerciseCompleted(ex.id, claims));
  return idx === -1 ? Math.max(0, exercises.length - 1) : idx;
}

function canAccessMissionExerciseIndex(
  index: number,
  exercises: MissionExercise[],
  claims: Record<string, MissionClaimEntry>
): boolean {
  if (index <= 0 || index >= exercises.length) return index === 0;
  return isMissionExerciseCompleted(exercises[index - 1].id, claims);
}

type MissionExerciseCardProps = {
  exercise: MissionExercise;
  index: number;
  totalCount: number;
  perQuestionAnswers: boolean;
  answer: string;
  onAnswerChange: (value: string) => void;
  questionAnswers: string[];
  onQuestionAnswerChange: (questionIndex: number, value: string) => void;
  evalResult?: MissionEvalResult;
  xpDejaAccorde: boolean;
  savingId: string;
  canClaim: boolean;
  onSubmit: () => void;
  onBlockedPaste: () => void;
  hasNext: boolean;
  onGoNext?: () => void;
};

function MissionExerciseCard({
  exercise,
  index,
  totalCount,
  perQuestionAnswers,
  answer,
  onAnswerChange,
  questionAnswers,
  onQuestionAnswerChange,
  evalResult,
  xpDejaAccorde,
  savingId,
  canClaim,
  onSubmit,
  onBlockedPaste,
  hasNext,
  onGoNext,
}: MissionExerciseCardProps) {
  const diffStyle = DIFFICULTY_STYLE[exercise.difficulty];
  const isCas = exercise.type === "Etude de cas";
  const gradeMeta = evalResult ? getMissionLetterGradeMeta(evalResult.score) : null;
  const notionChips = getExerciseNotionChips(exercise);
  const answerCharCount = perQuestionAnswers
    ? questionAnswers.reduce((sum, part) => sum + (part || "").trim().length, 0)
    : answer.trim().length;
  const cardStyle = {
    "--diff-stripe": diffStyle.stripe,
    "--diff-header-bg": diffStyle.headerBg,
    "--diff-badge-bg": diffStyle.badgeBg,
    "--diff-badge-text": diffStyle.badgeText,
  } as CSSProperties;

  return (
    <article
      id={`mission-${exercise.id}`}
      className="mission-exercise mission-exercise--linear is-open"
      style={cardStyle}
    >
      <header className="mission-exercise__header">
        <div className="mission-exercise__head-row">
          <p className="mission-exercise__progress">
            Exercice <span className="mission-exercise__progress-num">{index + 1}</span>
            <span className="mission-exercise__progress-sep">/</span>
            {totalCount}
          </p>
          {xpDejaAccorde ? (
            <span className="mission-exercise__validated" aria-label="Exercice validé">
              Validé
            </span>
          ) : null}
        </div>
        <h3 className="mission-exercise__title mission-exercise__title--linear">{exercise.title}</h3>
        <ul className="mission-exercise__meta" aria-label="Informations sur l'exercice">
          <li>
            <span className="mission-meta-pill mission-meta-pill--diff">{formatDifficultyLabel(exercise.difficulty)}</span>
          </li>
          <li>
            <span className="mission-meta-pill mission-meta-pill--type">{formatExerciseTypeLabel(exercise.type)}</span>
          </li>
          <li>
            <span className={`mission-meta-pill mission-meta-pill--xp ${isCas ? "mission-meta-pill--cas" : ""}`}>
              {formatJetonsDelta(exercise.xp)}
            </span>
          </li>
        </ul>
        {notionChips.length > 0 ? (
          <div className="mission-exercise__notions">
            <p className="mission-exercise__notions-label">Notions du cours</p>
            <ul className="mission-notions" aria-label="Notions à mobiliser">
              {notionChips.map((notion) => (
                <li key={notion}>
                  <span className="mission-notion-chip">{notion}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </header>

      <div className="mission-exercise__body mission-exercise__body--readable">
        <section className="mission-block mission-block--consigne" aria-labelledby={`consigne-${exercise.id}`}>
          <span className="mission-block__label" id={`consigne-${exercise.id}`}>
            Consigne
          </span>
          <MissionReadableText text={exercise.consigne} className="mission-block__text mission-block__text--consigne" />
        </section>

        {(exercise.support || (exercise.supportTables && exercise.supportTables.length > 0)) && (
          <section className="mission-block mission-block--support" aria-labelledby={`support-${exercise.id}`}>
            <span className="mission-block__label" id={`support-${exercise.id}`}>
              Document
            </span>
            {exercise.support ? (
              <MissionReadableText text={exercise.support} className="mission-block__text mission-block__text--support" />
            ) : null}
            {exercise.supportTables && exercise.supportTables.length > 0 ? (
              <MissionSupportTables tables={exercise.supportTables} />
            ) : null}
          </section>
        )}

        {exercise.questions && exercise.questions.length > 0 ? (
          <section className="mission-block mission-block--questions" aria-labelledby={`questions-${exercise.id}`}>
            <span className="mission-block__label" id={`questions-${exercise.id}`}>
              Questions
            </span>
            <ol className="mission-questions">
              {exercise.questions.map((question, qi) => (
                <li key={`${exercise.id}-q-${qi}`}>
                  <span className="mission-questions__num" aria-hidden="true">
                    {qi + 1}
                  </span>
                  <p className="mission-questions__text">{question}</p>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

        <section className="mission-block mission-block--answer" aria-labelledby={`answer-${exercise.id}`}>
          <span className="mission-block__label" id={`answer-${exercise.id}`}>
            Ta réponse
          </span>
          {perQuestionAnswers ? (
            <div className="mission-answers-by-question">
              {exercise.questions.map((question, qi) => (
                <div key={`${exercise.id}-answer-q-${qi}`} className="mission-answer-block">
                  <p className="mission-answer-block__label">
                    <span className="mission-questions__num" aria-hidden="true">
                      {qi + 1}
                    </span>
                    {question}
                  </p>
                  <ProtectedTextarea
                    value={questionAnswers[qi] || ""}
                    onChange={(e) => onQuestionAnswerChange(qi, e.target.value)}
                    placeholder={`Réponse à la question ${qi + 1}…`}
                    rows={8}
                    enableProtection
                    onBlockedAction={onBlockedPaste}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="mission-answer">
              <ProtectedTextarea
                value={answer}
                onChange={(e) => onAnswerChange(e.target.value)}
                placeholder="Développe ta réponse en t'appuyant sur le document…"
                rows={12}
                enableProtection
                onBlockedAction={onBlockedPaste}
              />
            </div>
          )}
            <div className="mission-exercise__footer">
              <p className="mission-char-count">
                {answerCharCount} / {exercise.minChars} caractères minimum
              </p>
              <button type="button" className="mission-submit" disabled={!canClaim} onClick={onSubmit}>
                {savingId === exercise.id
                  ? "Correction…"
                  : xpDejaAccorde
                    ? "Corriger (entraînement)"
                    : "Corriger et valider"}
              </button>
            </div>
            {xpDejaAccorde ? (
              <p className="mission-hint">
                Jetons déjà obtenus pour cet exercice : tu peux t&apos;entraîner sans nouvelle récompense.
              </p>
            ) : null}
          </section>

          {evalResult && gradeMeta ? (
            <div className="mission-result">
              <div
                className="mission-grade"
                style={{
                  background: gradeMeta.bg,
                  borderColor: gradeMeta.border,
                  color: gradeMeta.color,
                }}
              >
                <span className="mission-grade__letter">{gradeMeta.grade}</span>
                <div className="mission-grade__meta">
                  {!evalResult.entrainementSansXp ? (
                    <p className="mission-grade__reward">{formatJetonsDelta(evalResult.xpAccordee)} gagnés</p>
                  ) : (
                    <p className="mission-grade__reward">Entraînement — pas de nouveaux jetons</p>
                  )}
                </div>
              </div>

              <div className="mission-result__section mission-result__section--plus">
                <p className="mission-result__section-title">Ce qui est bien</p>
                <MissionReadableText text={evalResult.pointsForts} />
              </div>

              <div className="mission-result__section mission-result__section--minus">
                <p className="mission-result__section-title">À améliorer</p>
                <MissionReadableText text={evalResult.pointsFaibles} />
              </div>

              <div className="mission-result__section">
                <p className="mission-result__section-title">Synthèse</p>
                <MissionReadableText text={evalResult.feedback} />
              </div>

              {evalResult.analyseDeveloppee ? (
                <details className="mission-result__details">
                  <summary>Analyse détaillée</summary>
                  <MissionReadableText text={evalResult.analyseDeveloppee} />
                </details>
              ) : null}

              {evalResult.conseilsProgression ? (
                <details className="mission-result__details">
                  <summary>Conseils pour progresser</summary>
                  <MissionReadableText text={evalResult.conseilsProgression} />
                </details>
              ) : null}

              <details className="mission-result__details mission-result__details--model">
                <summary>
                  {evalResult.source === "rubric" ? "Repères de correction" : "Réponse proposée"}
                </summary>
                <MissionReadableText text={evalResult.propositionReponse} sanitize={false} className="mission-result__model-text" />
              </details>

              {xpDejaAccorde && hasNext && onGoNext ? (
                <button type="button" className="mission-next-btn" onClick={onGoNext}>
                  Exercice suivant
                </button>
              ) : null}
            </div>
          ) : null}
      </div>
    </article>
  );
}

export default function Missions({ profil, onXPGagne }: MissionsProps) {
  const { xpRewardsSuspended } = usePlatformIntegrity();

  useEffect(() => {
    const href = "https://fonts.googleapis.com/css2?family=Lexend:wght@400;500;600;700&display=swap";
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  }, []);
  const niveauxAccessibles = useMemo((): ("premiere" | "terminale")[] => {
    return profil?.classe === "terminale" ? ["premiere", "terminale"] : ["premiere"];
  }, [profil?.classe]);
  const peutChoisirClasse = profil?.role === "admin" || profil?.classe === "terminale";

  const [niveauSelectionne, setNiveauSelectionne] = useState<"premiere" | "terminale">(
    profil?.classe === "terminale" ? "terminale" : "premiere"
  );
  const [matiereSelectionnee, setMatiereSelectionnee] = useState<string>(MATIERES_MISSIONS[0].matiere);
  const [chapitres, setChapitres] = useState<ChapitreRow[]>([]);
  const [chapitreIdSelectionne, setChapitreIdSelectionne] = useState<string>("");
  const [chargementChapitres, setChargementChapitres] = useState(false);
  const [claims, setClaims] = useState<Record<string, MissionClaimEntry>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [evaluations, setEvaluations] = useState<Record<string, MissionEvalResult>>({});
  const [uiMessage, setUiMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [savingId, setSavingId] = useState("");
  const [viewIndex, setViewIndex] = useState(0);

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
        setClaims(readMissionClaims(raw));
      } catch (err) {
        console.error("Chargement progression missions impossible", err);
      }
    };
    void loadClaims();
  }, []);

  const chapitreActif = chapitres.find((c) => c.id === chapitreIdSelectionne) ?? null;
  const missionChapterNum = useMemo(
    () => detectMissionChapterNumber(chapitreActif, matiereSelectionnee),
    [chapitreActif, matiereSelectionnee]
  );
  const hasActiveMissionPack = hasMissionPack(matiereSelectionnee, missionChapterNum);
  const missionProgressChapterLabel = useMemo(
    () =>
      missionChapterNum != null ? getMissionProgressLabel(matiereSelectionnee, missionChapterNum) : matiereSelectionnee,
    [matiereSelectionnee, missionChapterNum]
  );
  const missionPackExercises = useMemo(
    () => (missionChapterNum != null ? getMissionExercises(matiereSelectionnee, missionChapterNum) : []),
    [matiereSelectionnee, missionChapterNum]
  );
  const potentialXP = useMemo(() => missionPackExercises.reduce((sum, ex) => sum + ex.xp, 0), [missionPackExercises]);
  const completedExerciseCount = useMemo(
    () => missionPackExercises.filter((ex) => isMissionExerciseCompleted(ex.id, claims)).length,
    [missionPackExercises, claims]
  );

  useEffect(() => {
    if (!missionPackExercises.length) {
      setViewIndex(0);
      return;
    }
    setViewIndex(getFirstIncompleteExerciseIndex(missionPackExercises, claims));
  }, [chapitreIdSelectionne, missionPackExercises]);

  useEffect(() => {
    if (!missionPackExercises.length) return;
    setViewIndex((prev) => {
      if (canAccessMissionExerciseIndex(prev, missionPackExercises, claims)) return prev;
      return getFirstIncompleteExerciseIndex(missionPackExercises, claims);
    });
  }, [claims, missionPackExercises]);

  const activeExercise = missionPackExercises[viewIndex] ?? null;

  const sdgnReferential = useMemo(
    () =>
      matiereSelectionnee === "Sciences de Gestion" && missionChapterNum != null
        ? getSdgnChapterReferential(missionChapterNum)
        : null,
    [matiereSelectionnee, missionChapterNum]
  );

  const missionChapterTitle = useMemo(() => {
    if (missionChapterNum == null) return "";
    if (matiereSelectionnee === "Sciences de Gestion") return SDGN_CHAPTER_LABELS[missionChapterNum] ?? "";
    if (matiereSelectionnee === "Management") return MANAGEMENT_CHAPTER_LABELS[missionChapterNum] ?? "";
    return "";
  }, [matiereSelectionnee, missionChapterNum]);

  const rubricPack = useMemo(
    () => getMissionRubricPack(matiereSelectionnee, missionChapterNum),
    [matiereSelectionnee, missionChapterNum]
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
    const perQuestion = exerciseUsesPerQuestionAnswers(exercise);
    const text = getMissionCombinedAnswer(exercise, answers, perQuestion).trim();
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
      const prevClaims = readMissionClaims(stored);
      const prevEntry = prevClaims[exercise.id];
      const entrainementSansXp = missionJetonsDejaGagnesPourVague(prevEntry);
      const today = getTodayKey();

      const rubric = rubricPack?.getRubric(exercise.id);
      let reliable: {
        score: number;
        feedback: string;
        analyseDeveloppee: string;
        pointsForts: string;
        pointsFaibles: string;
        conseilsProgression: string;
        propositionReponse: string;
        source: "local" | "rubric";
      };

      if (rubric && rubricPack) {
        const byQuestion = perQuestion
          ? getMissionAnswersByQuestion(exercise, answers)
          : [text];
        const rubricEval = rubricCorrectionMissions(exerciseEval, byQuestion, rubric, rubricPack.glossaire);
        reliable = {
          score: rubricEval.score,
          feedback: rubricEval.feedback,
          analyseDeveloppee: rubricEval.analyseDeveloppee,
          pointsForts: rubricEval.pointsForts,
          pointsFaibles: rubricEval.pointsFaibles,
          conseilsProgression: rubricEval.conseilsProgression,
          propositionReponse: rubricEval.propositionReponse,
          source: "rubric",
        };
      } else {
        const local = localCorrectionMissions(exerciseEval, text);
        reliable = {
          score: local.score,
          feedback: local.feedback,
          analyseDeveloppee: local.analyseDeveloppee,
          pointsForts: local.pointsForts,
          pointsFaibles: local.pointsFaibles,
          conseilsProgression: local.conseilsProgression,
          propositionReponse: local.propositionReponse,
          source: "local",
        };
      }

      const score = reliable.score;
      const pourcentageBrute = Math.max(0, Math.min(100, Math.round(score * 10)));
      const xpBrute = Math.round((exercise.xp * pourcentageBrute) / 100);
      const xpAccordee = entrainementSansXp ? 0 : xpBrute;
      const pourcentageXP = entrainementSansXp ? 0 : pourcentageBrute;

      const nextEntry: MissionClaimEntry = {
        lastClaimDate: today,
        totalClaims: (prevEntry?.totalClaims || 0) + 1,
        lastScore: score,
        lastPercent: pourcentageBrute,
        lastXpAwarded: xpAccordee,
        lastXpWave: xpAccordee > 0 ? MISSIONS_XP_REWARD_WAVE : (prevEntry?.lastXpWave ?? 1),
      };
      const nextClaims = { ...prevClaims, [exercise.id]: nextEntry };
      await updateDoc(ref, {
        xp: (data.xp || 0) + xpAccordee,
        missionsProgress: {
          ...(stored || {}),
          version: MISSIONS_PROGRESS_VERSION,
          xpRewardWave: MISSIONS_XP_REWARD_WAVE,
          chapter: missionProgressChapterLabel,
          claims: nextClaims,
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
          ? `Correction terminée : ${getMissionLetterGradeMeta(score).grade}. Entraînement — pas de nouveaux jetons cette fois.`
          : `Correction terminée : ${getMissionLetterGradeMeta(score).grade} · ${formatJetonsDelta(xpAccordee)} gagnés.`,
      });
      if (onXPGagne && xpAccordee > 0) onXPGagne();
    } catch (err) {
      console.error("Validation jetons mission impossible", err);
      setUiMessage({ type: "error", text: "Validation impossible pour le moment." });
    } finally {
      setSavingId("");
    }
  };

  const goToExercise = (index: number) => {
    if (!canAccessMissionExerciseIndex(index, missionPackExercises, claims)) return;
    setViewIndex(index);
    requestAnimationFrame(() => {
      document.getElementById("mission-active")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const goToNextExercise = () => {
    if (viewIndex >= missionPackExercises.length - 1) return;
    if (!isMissionExerciseCompleted(missionPackExercises[viewIndex]?.id ?? "", claims)) return;
    goToExercise(viewIndex + 1);
  };

  const refNotions =
    chapitreActif?.notions && chapitreActif.notions.length > 0
      ? chapitreActif.notions
      : sdgnReferential?.notions ?? [];
  const refCompetences =
    chapitreActif?.competences && chapitreActif.competences.length > 0
      ? chapitreActif.competences
      : sdgnReferential?.competences ?? [];
  const refQuestion = chapitreActif?.question?.trim() || sdgnReferential?.question;

  return (
    <div className="missions-page">
      <div className="missions-shell">
        <header className="missions-hero">
          <h1>Missions</h1>
          <p>Un exercice à la fois : corrige pour débloquer le suivant.</p>
        </header>

        <section className="missions-panel">
          <p className="missions-panel__title">Filtres</p>
          <div className="missions-filters">
            <div className="missions-field">
              <label htmlFor="missions-niveau">Niveau</label>
              {peutChoisirClasse ? (
                <select
                  id="missions-niveau"
                  value={niveauSelectionne}
                  onChange={(e) => setNiveauSelectionne(e.target.value as "premiere" | "terminale")}
                >
                  {niveauxAccessibles.map((nv) => (
                    <option key={nv} value={nv}>
                      {nv === "terminale" ? "Terminale STMG" : "Première STMG"}
                    </option>
                  ))}
                </select>
              ) : (
                <p style={{ margin: 0, fontWeight: 700, color: "#1f2937", minHeight: 44, display: "flex", alignItems: "center" }}>
                  Première STMG
                </p>
              )}
            </div>
            <div className="missions-field">
              <label htmlFor="missions-matiere">Matière</label>
              <select
                id="missions-matiere"
                value={matiereSelectionnee}
                onChange={(e) => setMatiereSelectionnee(e.target.value)}
              >
                {MATIERES_MISSIONS.map((m) => (
                  <option key={m.matiere} value={m.matiere}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="missions-field">
              <label htmlFor="missions-chapitre">Chapitre</label>
              <select
                id="missions-chapitre"
                value={chapitreIdSelectionne}
                onChange={(e) => setChapitreIdSelectionne(e.target.value)}
                disabled={chargementChapitres || chapitres.length === 0}
                style={{ opacity: chargementChapitres || chapitres.length === 0 ? 0.6 : 1 }}
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
        </section>

        <section className={`missions-content ${hasActiveMissionPack ? "" : "missions-content--empty"}`}>
          {!hasActiveMissionPack ? (
            <>
              <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.25rem", color: "#0f172a", margin: "0 0 10px", textAlign: "center" }}>
                Exercices à venir
              </p>
              <p style={{ color: "#334155", fontSize: "0.95rem", margin: 0, fontWeight: 600, lineHeight: 1.55, textAlign: "center" }}>
                SDGN Première (ch. 1 à 13) et Management Terminale (ch. 1 à 15) : même parcours, notes en lettres et mise en page confortable.
              </p>
            </>
          ) : (
            <>
              <header className="missions-chapter-head">
                <div className="missions-chapter-head__row">
                  <h2>
                    {missionChapterNum != null
                      ? `${matiereSelectionnee === "Sciences de Gestion" ? "SDGN" : "Management"} — Ch. ${missionChapterNum}`
                      : matiereSelectionnee}
                  </h2>
                  <span className="missions-potential">Potentiel {formatJetonsDelta(potentialXP)}</span>
                </div>
                {missionChapterTitle ? (
                  <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#0f172a", fontSize: "0.95rem", lineHeight: 1.4 }}>
                    {missionChapterTitle}
                  </p>
                ) : null}
                <p className="missions-blurb">
                  {missionChapterNum != null ? getMissionChapterBlurb(matiereSelectionnee, missionChapterNum) : ""}
                </p>
              </header>

              <details className="missions-details">
                <summary>Règles anti-triche</summary>
                <div className="missions-details__body">
                  <p>
                    Copier-coller et glisser-déposer sont bloqués dans la zone de réponse. Les jetons ne sont suspendus
                    que si tu quittes l&apos;onglet plusieurs secondes.
                  </p>
                </div>
              </details>

              

              {chapitreActif && (refQuestion || refNotions.length > 0 || refCompetences.length > 0) ? (
                <details className="missions-details">
                  <summary>Référentiel du chapitre</summary>
                  <div className="missions-details__body">
                    {refQuestion ? (
                      <p>
                        <strong>Question de gestion :</strong> {refQuestion}
                      </p>
                    ) : null}
                    {refCompetences.length > 0 ? (
                      <>
                        <p style={{ marginBottom: 6 }}>
                          <strong>Compétences :</strong>
                        </p>
                        <ul>
                          {refCompetences.map((c, i) => (
                            <li key={`ref-c-${i}`}>{c}</li>
                          ))}
                        </ul>
                      </>
                    ) : null}
                    {refNotions.length > 0 ? (
                      <p style={{ marginTop: refCompetences.length > 0 ? 10 : 0 }}>
                        <strong>Notions :</strong> {refNotions.join(" · ")}
                      </p>
                    ) : null}
                  </div>
                </details>
              ) : null}

              {uiMessage ? (
                <div className={`missions-alert missions-alert--${uiMessage.type === "success" ? "success" : "error"}`}>
                  {uiMessage.text}
                </div>
              ) : null}

              <div className="mission-progress" aria-label="Progression du chapitre">
                <div
                  className="mission-progress__bar"
                  role="progressbar"
                  aria-valuenow={completedExerciseCount}
                  aria-valuemin={0}
                  aria-valuemax={missionPackExercises.length}
                >
                  <span
                    className="mission-progress__fill"
                    style={{
                      width: `${missionPackExercises.length ? (completedExerciseCount / missionPackExercises.length) * 100 : 0}%`,
                    }}
                  />
                </div>
                <p className="mission-progress__label">
                  {completedExerciseCount} / {missionPackExercises.length} exercices validés
                </p>
              </div>

              <nav className="mission-quick-nav" aria-label="Navigation entre exercices">
                {missionPackExercises.map((exercise, index) => {
                  const done = isMissionExerciseCompleted(exercise.id, claims);
                  const accessible = canAccessMissionExerciseIndex(index, missionPackExercises, claims);
                  const active = viewIndex === index;
                  return (
                    <button
                      key={`nav-${exercise.id}`}
                      type="button"
                      className={`mission-quick-nav__btn ${active ? "is-active" : ""} ${done ? "is-done" : ""} ${!accessible ? "is-locked" : ""}`}
                      onClick={() => goToExercise(index)}
                      disabled={!accessible}
                      aria-current={active ? "step" : undefined}
                      title={!accessible ? "Termine l'exercice précédent pour débloquer" : undefined}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </nav>

              {activeExercise ? (
                <div id="mission-active" className="mission-exercise-list">
                  {(() => {
                    const exercise = activeExercise;
                    const index = viewIndex;
                    const answer = answers[exercise.id] || "";
                    const perQuestionAnswers = exerciseUsesPerQuestionAnswers(exercise);
                    const questionAnswers = getMissionAnswersByQuestion(exercise, answers);
                    const combinedLen = perQuestionAnswers
                      ? questionAnswers.reduce((sum, part) => sum + (part || "").trim().length, 0)
                      : answer.trim().length;
                    const evalResult = evaluations[exercise.id];
                    const xpDejaAccorde = isMissionExerciseCompleted(exercise.id, claims);
                    const canClaim = combinedLen >= exercise.minChars && savingId !== exercise.id;
                    const hasNext = index < missionPackExercises.length - 1;
                    return (
                      <MissionExerciseCard
                        key={exercise.id}
                        exercise={exercise}
                        index={index}
                        totalCount={missionPackExercises.length}
                        perQuestionAnswers={perQuestionAnswers}
                        answer={answer}
                        onAnswerChange={(value) => setAnswers((prev) => ({ ...prev, [exercise.id]: value }))}
                        questionAnswers={questionAnswers}
                        onQuestionAnswerChange={(qi, value) =>
                          setAnswers((prev) => ({
                            ...prev,
                            [missionQuestionAnswerKey(exercise.id, qi)]: value,
                          }))
                        }
                        evalResult={evalResult}
                        xpDejaAccorde={xpDejaAccorde}
                        savingId={savingId}
                        canClaim={canClaim}
                        onSubmit={() => void evaluateAndClaimXP(exercise)}
                        onBlockedPaste={() =>
                          setUiMessage({
                            type: "error",
                            text: "Action bloquée : anti-triche active sur cette zone.",
                          })
                        }
                        hasNext={hasNext}
                        onGoNext={hasNext ? goToNextExercise : undefined}
                      />
                    );
                  })()}
                </div>
              ) : null}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
