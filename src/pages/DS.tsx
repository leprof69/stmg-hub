import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { auth } from "../services/firebase";
import { useDsImmersive } from "../contexts/DsImmersiveContext";
import {
  buildDsSessionRecord,
  canStudentContinueDsSdgnExam,
  DS_SDGN_TERMINALE_QCM_EXAM_ID,
  DS_SDGN_QCM_EXAM_ID,
  isDsSdgnExamLocked,
  markDsAttemptStarted,
  persistDsTabCheckpoint,
  persistDsTabResult,
  readDsTabLastSession,
  resolveDsGradeOn20FromUser,
  type DsSessionAnswerRecord,
  type DsSessionStatus,
} from "../services/dsTabExamService";
import {
  subscribeDsSdgnExamConfig,
  reopenDsSdgnPremiereExam,
  type DsSdgnExamConfig,
} from "../services/dsSdgnExamConfigService";
import { SDGN_CHAPTER_LABELS } from "../data/sdgn/registry";
import {
  buildDsSdgnPremiereDeck,
  buildDsSdgnPremiereDeckFromQuestionIds,
  rebuildQuestionIdsForResume,
  type DsPlayQuestion,
  DS_SDGN_PREMIERE_SESSION_SEC,
  formatDsScore,
  getDsSdgnPremiereQuestionCount,
} from "../lib/dsSdgnQcmDeck";
import {
  buildDsSdgnTerminaleDeck,
  buildDsSdgnTerminaleDeckFromQuestionIds,
  rebuildTerminaleQuestionIdsForResume,
  type DsTerminalePlayQuestion,
  DS_SDGN_TERMINALE_SESSION_SEC,
  DS_SDGN_TERMINALE_QUESTION_SEC,
  getDsSdgnTerminaleQuestionCount,
} from "../lib/dsSdgnTerminaleQcmDeck";
import { DS_SDGN_TOPIC_LABELS, DS_SDGN_TOPIC_ORDER } from "../lib/dsSdgnQcmTopics";
import {
  computeDsGradeOn20,
  computeDsScoreFromAnswers,
  computeTopicStats,
} from "../lib/dsSdgnGrading";
import type { DsTopicStat } from "../lib/dsSdgnGrading";
import { computeTerminaleTopicStats } from "../lib/dsSdgnTerminaleGrading";
import { resolveDsAnswersForTopicStats } from "../lib/dsSdgnReportNotions";
import { DS_SCORE_CORRECT, DS_SCORE_WRONG } from "../lib/dsSdgnQcmDeck";
import {
  DS_SDGN_TERMINALE_TOPIC_LABELS,
  DS_SDGN_TERMINALE_TOPIC_ORDER,
} from "../lib/dsSdgnTerminaleQcmTopics";

type Props = {
  profil: { prenom?: string; role?: string; classe?: string; dsTab?: Record<string, unknown> };
  onExamFinished?: () => void | Promise<void>;
};

type Phase = "hub" | "play" | "end";
type DsTrack = "premiere" | "terminale";
type AnswerOutcome = "correct" | "wrong";
type ActivePlayQuestion = DsPlayQuestion | DsTerminalePlayQuestion;

function getTrackMeta(track: DsTrack) {
  if (track === "terminale") {
    return {
      examId: DS_SDGN_TERMINALE_QCM_EXAM_ID,
      sessionSec: DS_SDGN_TERMINALE_SESSION_SEC,
      questionSec: DS_SDGN_TERMINALE_QUESTION_SEC,
      title: "QCM Terminale STMG",
      subtitle: "Sciences de Gestion et Num\u00e9rique \u2014 100 questions",
      questionCount: getDsSdgnTerminaleQuestionCount(),
    };
  }
  return {
    examId: DS_SDGN_QCM_EXAM_ID,
    sessionSec: DS_SDGN_PREMIERE_SESSION_SEC,
    questionSec: null,
    title: "QCM 1\u00e8re STMG",
    subtitle: "Sciences de Gestion et Num\u00e9rique (1\u00e8re STMG) \u2014 100 questions",
    questionCount: getDsSdgnPremiereQuestionCount(),
  };
}

function resolveTrackHubGrade(
  userRecord: Record<string, unknown>,
  examId: string,
  lastSession: ReturnType<typeof readDsTabLastSession>,
): number | null {
  const fromProfil = resolveDsGradeOn20FromUser(userRecord, examId);
  if (fromProfil > 0) return fromProfil;
  if (lastSession?.gradeOn20 && lastSession.gradeOn20 > 0) return lastSession.gradeOn20;
  if (lastSession?.gradeOn20Provisional && lastSession.gradeOn20Provisional > 0) {
    return lastSession.gradeOn20Provisional;
  }
  return null;
}

const DS_CSS = `
@keyframes dsPulse{0%,100%{opacity:1}50%{opacity:.5}}
.ds-timer-urgent{animation:dsPulse .7s ease-in-out infinite}
`;

const CHOICE_LETTERS = ["A", "B", "C", "D"] as const;

function splitDsQuestion(text: string): { lead?: string; body: string } {
  const marker = "Probl\u00e9matique :";
  const idx = text.indexOf(marker);
  if (idx === -1) return { body: text };
  return {
    lead: text.slice(0, idx).trim(),
    body: text.slice(idx).trim(),
  };
}

function resolveDsStudentKey(profil: Props["profil"]): string {
  const uid = auth.currentUser?.uid;
  if (uid) return uid;
  const fallback = [profil?.classe, profil?.prenom].filter(Boolean).join(":");
  return fallback || "anonymous";
}

const DS_TRACK_GATE_KEYS: Record<DsTrack, string> = {
  premiere: "stmg_ds_sdgn_gate_premiere_v1",
  terminale: "stmg_ds_sdgn_gate_terminale_v1",
};

const DS_TRACK_PASSWORDS: Record<DsTrack, string> = {
  premiere: "tomate",
  terminale: "tastykrousty",
};

/** Debloque anti-triche (changement d'onglet). */
const DS_UNLOCK_PASSWORD = "azerty";

function readTrackGateUnlocked(track: DsTrack): boolean {
  try {
    return sessionStorage.getItem(DS_TRACK_GATE_KEYS[track]) === "1";
  } catch {
    return false;
  }
}

function writeTrackGateUnlocked(track: DsTrack): void {
  try {
    sessionStorage.setItem(DS_TRACK_GATE_KEYS[track], "1");
  } catch {
    /* ignore */
  }
}

type TrackGateAction = "start" | "continue";

export default function DS({ profil, onExamFinished }: Props) {
  const { setImmersive } = useDsImmersive();
  const [activeTrack, setActiveTrack] = useState<DsTrack>("premiere");
  const isTerminale = activeTrack === "terminale";
  const trackMeta = getTrackMeta(activeTrack);
  const examId = trackMeta.examId;
  const sessionSec = trackMeta.sessionSec;
  const questionSec = trackMeta.questionSec;
  const [phase, setPhase] = useState<Phase>("hub");
  const [pendingTrackGate, setPendingTrackGate] = useState<{
    track: DsTrack;
    action: TrackGateAction;
  } | null>(null);
  const [trackGateInput, setTrackGateInput] = useState("");
  const [trackGateError, setTrackGateError] = useState("");
  const [questions, setQuestions] = useState<ActivePlayQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [sessionLeft, setSessionLeft] = useState(sessionSec);
  const [questionLeft, setQuestionLeft] = useState(questionSec ?? 0);
  const [wrongCount, setWrongCount] = useState(0);
  const [interruptMsg, setInterruptMsg] = useState("");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "ok" | "err">("idle");
  const [savedGradeOn20, setSavedGradeOn20] = useState<number | null>(() => {
    const g = resolveDsGradeOn20FromUser(profil as Record<string, unknown>, examId);
    return g > 0 ? g : null;
  });
  const [examConfig, setExamConfig] = useState<DsSdgnExamConfig>({ closed: false });
  const [antiCheatBlocked, setAntiCheatBlocked] = useState(false);
  const [unlockInput, setUnlockInput] = useState("");
  const [unlockError, setUnlockError] = useState("");
  const [timerKey, setTimerKey] = useState(0);

  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const questionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseRef = useRef<Phase>("hub");
  const finishedRef = useRef(false);
  const scoreRef = useRef(0);
  const questionsRef = useRef<ActivePlayQuestion[]>([]);
  const sessionIdRef = useRef("");
  const startedAtRef = useRef("");
  const answersRef = useRef<DsSessionAnswerRecord[]>([]);
  const lastResultRef = useRef<{ gradeOn20: number; score: number } | null>(null);
  const indexRef = useRef(0);
  const answeredRef = useRef(false);
  const sessionLeftRef = useRef(sessionSec);
  const questionLeftRef = useRef(questionSec ?? 0);
  const examIdRef = useRef(examId);
  const isTerminaleRef = useRef(isTerminale);
  const antiCheatBlockedRef = useRef(false);
  const finishExamRef = useRef<(status: DsSessionStatus) => void>(() => {});
  const saveChainRef = useRef<Promise<void>>(Promise.resolve());

  const prenom = profil?.prenom || "toi";
  const isAdmin = profil?.role === "admin";
  const userRecord = profil as Record<string, unknown>;

  examIdRef.current = examId;
  isTerminaleRef.current = isTerminale;

  useEffect(() => subscribeDsSdgnExamConfig(setExamConfig), []);

  /** Reouvre automatiquement si un ancien etat "DS ferme" traîne en base. */
  useEffect(() => {
    if (!examConfig.closed) return;
    void reopenDsSdgnPremiereExam().catch((err) =>
      console.warn("Reouverture DS Premiere", err),
    );
  }, [examConfig.closed]);

  useEffect(() => {
    if (phaseRef.current !== "play") return;
    if (finishedRef.current) return;
    if (!examConfig.closed) return;
    setInterruptMsg("Le professeur a cloture le DS. Tes reponses sont enregistrees.");
    finishExamRef.current("incomplete");
  }, [examConfig.closed]);

  const current = questions[index] ?? null;
  const questionParts = current ? splitDsQuestion(current.q) : null;

  phaseRef.current = phase;
  scoreRef.current = score;
  questionsRef.current = questions;
  indexRef.current = index;
  answeredRef.current = answered;
  sessionLeftRef.current = sessionLeft;
  questionLeftRef.current = questionLeft;
  antiCheatBlockedRef.current = antiCheatBlocked;

  const immersiveActive = phase === "play";

  useEffect(() => {
    setImmersive(immersiveActive);
    return () => setImmersive(false);
  }, [immersiveActive, setImmersive]);

  useEffect(() => {
    document.body.style.overflow = immersiveActive ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [immersiveActive]);

  const clearTimers = useCallback(() => {
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    if (questionTimerRef.current) clearInterval(questionTimerRef.current);
    sessionTimerRef.current = null;
    questionTimerRef.current = null;
  }, []);

  const flushSave = useCallback(
    async (status: DsSessionStatus, partial = false): Promise<boolean> => {
      const run = async (): Promise<boolean> => {
        const uid = auth.currentUser?.uid;
        if (!uid) return false;
        const total = questionsRef.current.length;
        if (total <= 0) return false;

        const answers = [...answersRef.current];
        const scorePoints = computeDsScoreFromAnswers(answers);
        const answeredCount = answers.length;
        const gradeOn20 = computeDsGradeOn20(scorePoints, total, false);
        const now = new Date().toISOString();
        const finishedAll = answeredCount >= total;

        if (partial && answeredCount > 0 && status !== "completed") {
          const resolved = resolveDsAnswersForTopicStats(answers, examIdRef.current);
          const topicStats = isTerminaleRef.current
            ? computeTerminaleTopicStats(resolved as Parameters<typeof computeTerminaleTopicStats>[0])
            : computeTopicStats(resolved as Parameters<typeof computeTopicStats>[0]);
          await persistDsTabCheckpoint(uid, {
            examId: examIdRef.current,
            sessionId: sessionIdRef.current,
            startedAt: startedAtRef.current,
            scorePoints,
            totalQuestions: total,
            answers,
            questionIds: questionsRef.current.map((q) => q.sourceId),
            sessionLeftSec: sessionLeftRef.current,
            topicStats,
          });
          return true;
        }

        const finalStatus: DsSessionStatus =
          status === "completed" || finishedAll ? "completed" : status;
        const savedGrade = gradeOn20;

        const resolved = resolveDsAnswersForTopicStats(answers, examIdRef.current);
        const topicStats = isTerminaleRef.current
          ? computeTerminaleTopicStats(resolved as Parameters<typeof computeTerminaleTopicStats>[0])
          : computeTopicStats(resolved as Parameters<typeof computeTopicStats>[0]);

        const session = buildDsSessionRecord({
          sessionId: sessionIdRef.current,
          examId: examIdRef.current,
          startedAt: startedAtRef.current,
          finishedAt: now,
          scorePoints,
          totalQuestions: total,
          questionsAnswered: answeredCount,
          correctCount: answers.filter((a) => a.outcome === 1).length,
          wrongCount: answers.filter((a) => a.outcome === 0).length,
          skippedCount: 0,
          forcedZero: false,
          gradeOn20: savedGrade,
          status: finalStatus,
          questionIds: questionsRef.current.map((q) => q.sourceId),
          answers,
          topicStats,
          sessionLeftSec: sessionLeftRef.current,
          resumeIndex: answeredCount,
        });

        await persistDsTabResult(uid, {
          score: scorePoints,
          total,
          skipped: 0,
          forcedZero: false,
          finishedAt: now,
          gradeOn20: savedGrade,
          session,
          resumeGranted: finalStatus === "completed" ? false : undefined,
        });

        lastResultRef.current = { gradeOn20: savedGrade, score: scorePoints };
        setSavedGradeOn20(savedGrade);
        return true;
      };

      const chained = saveChainRef.current.then(run);
      saveChainRef.current = chained.then(() => undefined).catch(() => undefined);
      return chained;
    },
    [],
  );

  const finishExam = useCallback(
    (status: DsSessionStatus) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      clearTimers();
      setScore(scoreRef.current);
      setSaveState("saving");
      void flushSave(status, false)
        .then((ok) => {
          setSaveState(ok ? "ok" : "err");
        })
        .catch((err) => {
          console.error("Sauvegarde DS impossible", err);
          setSaveState("err");
        });
      setPhase("end");
    },
    [clearTimers, flushSave],
  );

  finishExamRef.current = finishExam;

  const onTabHidden = useCallback(() => {
    if (isAdmin) return;
    if (phaseRef.current !== "play" || finishedRef.current) return;
    if (!document.hidden) return;
    if (antiCheatBlockedRef.current) return;

    clearTimers();
    antiCheatBlockedRef.current = true;
    setAntiCheatBlocked(true);
    setUnlockError("");
    setUnlockInput("");

    const uid = auth.currentUser?.uid;
    if (uid && answersRef.current.length > 0) {
      void flushSave("incomplete", true).catch((err) =>
        console.warn("Checkpoint DS (blocage anti-triche)", err),
      );
    }
  }, [isAdmin, clearTimers, flushSave]);

  const submitUnlock = (e: FormEvent) => {
    e.preventDefault();
    if (unlockInput.trim() === DS_UNLOCK_PASSWORD) {
      antiCheatBlockedRef.current = false;
      setAntiCheatBlocked(false);
      setUnlockInput("");
      setUnlockError("");
      setTimerKey((k) => k + 1);
      return;
    }
    setUnlockError("Mot de passe incorrect. Demande le mot de passe debloque au prof.");
  };

  const recordAnswer = useCallback((outcome: AnswerOutcome, choiceIdx: number | null) => {
    const q = questionsRef.current[indexRef.current];
    if (!q) return;
    answersRef.current.push({
      sourceId: q.sourceId,
      topic: q.topic,
      outcome: outcome === "correct" ? 1 : 0,
      ...(choiceIdx !== null ? { picked: choiceIdx as 0 | 1 | 2 | 3 } : {}),
    });
  }, []);

  const goNext = useCallback(
    (outcome: AnswerOutcome, choiceIdx: number | null = null) => {
      recordAnswer(outcome, choiceIdx);
      if (outcome === "correct") {
        scoreRef.current += DS_SCORE_CORRECT;
      } else {
        scoreRef.current += DS_SCORE_WRONG;
        setWrongCount((c) => c + 1);
      }
      setScore(scoreRef.current);

      const next = indexRef.current + 1;
      const isLast = next >= questionsRef.current.length || sessionLeftRef.current <= 0;

      if (isLast) {
        finishExamRef.current("completed");
        return;
      }

      const uid = auth.currentUser?.uid;
      if (uid && answersRef.current.length > 0) {
        void flushSave("incomplete", true).catch((err) =>
          console.warn("Checkpoint DS", err),
        );
      }

      setIndex(next);
      setAnswered(false);
      setPicked(null);
      setQuestionLeft(questionSec ?? 0);
      questionLeftRef.current = questionSec ?? 0;
    },
    [recordAnswer, flushSave, questionSec],
  );

  const resolveAnswer = useCallback(
    (choiceIdx: number) => {
      if (answered || !current) return;
      setAnswered(true);
      setPicked(choiceIdx);
      const ok = choiceIdx === current.ok;
      window.setTimeout(() => goNext(ok ? "correct" : "wrong", choiceIdx), 600);
    },
    [answered, current, goNext],
  );

  const startPlay = (deck: ActivePlayQuestion[], opts: {
    sessionId: string;
    startedAt: string;
    answers: DsSessionAnswerRecord[];
    idx: number;
    sessionLeftSec: number;
  }) => {
    clearTimers();
    finishedRef.current = false;
    setInterruptMsg("");
    setSaveState("idle");
    antiCheatBlockedRef.current = false;
    setAntiCheatBlocked(false);
    setUnlockInput("");
    setUnlockError("");
    sessionIdRef.current = opts.sessionId;
    startedAtRef.current = opts.startedAt;
    answersRef.current = opts.answers;
    setQuestions(deck);
    setIndex(opts.idx);
    scoreRef.current = computeDsScoreFromAnswers(opts.answers);
    setScore(scoreRef.current);
    setWrongCount(opts.answers.filter((a) => a.outcome === 0).length);
    setAnswered(false);
    setPicked(null);
    setSessionLeft(opts.sessionLeftSec);
    sessionLeftRef.current = opts.sessionLeftSec;
    setQuestionLeft(questionSec ?? 0);
    questionLeftRef.current = questionSec ?? 0;
    setPhase("play");
  };

  const continueDs = (track: DsTrack) => {
    setActiveTrack(track);
    const meta = getTrackMeta(track);
    const session = readDsTabLastSession(userRecord, meta.examId);
    const canResume = canStudentContinueDsSdgnExam(userRecord, meta.examId);
    const questionIds = session
      ? track === "terminale"
        ? rebuildTerminaleQuestionIdsForResume(session)
        : rebuildQuestionIdsForResume(session)
      : null;
    if (!questionIds?.length || !canResume) return;
    const deck =
      track === "terminale"
        ? buildDsSdgnTerminaleDeckFromQuestionIds(questionIds, session!.sessionId)
        : buildDsSdgnPremiereDeckFromQuestionIds(questionIds, session!.sessionId);
    if (!deck.length) return;
    const answers = [...(session!.answers ?? [])];
    startPlay(deck, {
      sessionId: session!.sessionId,
      startedAt: session!.startedAt,
      answers,
      idx: Math.min(answers.length, deck.length),
      sessionLeftSec: session!.sessionLeftSec ?? meta.sessionSec,
    });
  };

  const startDs = (track: DsTrack) => {
    setActiveTrack(track);
    const meta = getTrackMeta(track);
    const canResume = canStudentContinueDsSdgnExam(userRecord, meta.examId);
    const locked =
      !isAdmin &&
      !canResume &&
      isDsSdgnExamLocked(userRecord, { globallyClosed: false, examId: meta.examId });
    if (locked) return;
    const sessionId = crypto.randomUUID();
    const studentKey = resolveDsStudentKey(profil);
    const deck =
      track === "terminale"
        ? buildDsSdgnTerminaleDeck(studentKey, sessionId)
        : buildDsSdgnPremiereDeck(studentKey, sessionId);
    const startedAt = new Date().toISOString();
    startPlay(deck, {
      sessionId,
      startedAt,
      answers: [],
      idx: 0,
      sessionLeftSec: meta.sessionSec,
    });
    const uid = auth.currentUser?.uid;
    if (uid) {
      void markDsAttemptStarted(uid, sessionId, meta.examId).catch(console.error);
    }
  };

  const runTrackGateAction = (track: DsTrack, action: TrackGateAction) => {
    if (action === "continue") continueDs(track);
    else startDs(track);
  };

  const requestTrackAccess = (track: DsTrack, action: TrackGateAction) => {
    if (readTrackGateUnlocked(track)) {
      runTrackGateAction(track, action);
      return;
    }
    setPendingTrackGate({ track, action });
    setTrackGateInput("");
    setTrackGateError("");
  };

  const submitTrackGate = (e: FormEvent) => {
    e.preventDefault();
    if (!pendingTrackGate) return;
    const expected = DS_TRACK_PASSWORDS[pendingTrackGate.track];
    if (trackGateInput.trim() !== expected) {
      setTrackGateError("Mot de passe incorrect.");
      return;
    }
    writeTrackGateUnlocked(pendingTrackGate.track);
    const { track, action } = pendingTrackGate;
    setPendingTrackGate(null);
    setTrackGateInput("");
    setTrackGateError("");
    runTrackGateAction(track, action);
  };

  /** Anti-triche : uniquement changement d'onglet / app (pas clic droit, pas blur, pas plein ecran). */
  useEffect(() => {
    if (phase !== "play") return undefined;
    document.addEventListener("visibilitychange", onTabHidden);
    return () => document.removeEventListener("visibilitychange", onTabHidden);
  }, [phase, onTabHidden]);

  /** Chrono session 50 min. */
  useEffect(() => {
    if (phase !== "play" || antiCheatBlocked) return undefined;
    sessionTimerRef.current = setInterval(() => {
      sessionLeftRef.current = Math.max(0, sessionLeftRef.current - 1);
      setSessionLeft(sessionLeftRef.current);
      if (sessionLeftRef.current <= 0) {
        finishExamRef.current("incomplete");
      }
    }, 1000);
    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    };
  }, [phase, antiCheatBlocked, timerKey]);

  /** Chrono par question (Terminale). */
  useEffect(() => {
    if (phase !== "play" || antiCheatBlocked) return undefined;
    if (!isTerminale || !questionSec || answered) return undefined;
    if (questionLeftRef.current <= 0) {
      questionLeftRef.current = questionSec;
      setQuestionLeft(questionSec);
    }
    questionTimerRef.current = setInterval(() => {
      questionLeftRef.current = Math.max(0, questionLeftRef.current - 1);
      setQuestionLeft(questionLeftRef.current);
      if (questionLeftRef.current <= 0) {
        setAnswered(true);
        setPicked(null);
        window.setTimeout(() => goNext("wrong", null), 150);
      }
    }, 1000);
    return () => {
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    };
  }, [phase, antiCheatBlocked, isTerminale, questionSec, answered, goNext, timerKey]);

  const sessionMmSs = useMemo(() => {
    const m = Math.floor(sessionLeft / 60);
    const s = sessionLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [sessionLeft]);

  const shellClass = immersiveActive
    ? "fixed inset-0 z-[10000] overflow-y-auto bg-slate-950 text-white"
    : "min-h-screen bg-slate-950 text-white";

  useEffect(() => {
    const g = resolveDsGradeOn20FromUser(profil as Record<string, unknown>, examId);
    if (g > 0) setSavedGradeOn20(g);
  }, [profil, examId]);

  const requestQuitQcm = useCallback(() => {
    if (finishedRef.current) return;
    const answered = answersRef.current.length;
    const msg =
      answered > 0
        ? "Terminer le QCM maintenant ? Tes reponses deja donnees seront enregistrees et notes."
        : "Terminer le QCM sans reponse ? Ta copie sera enregistree.";
    if (window.confirm(msg)) {
      finishExamRef.current("completed");
    }
  }, []);

  if (phase === "hub") {
    const renderTrackCard = (track: DsTrack) => {
      const meta = getTrackMeta(track);
      const last = readDsTabLastSession(userRecord, meta.examId);
      const canResume = canStudentContinueDsSdgnExam(userRecord, meta.examId);
      const locked =
        !isAdmin &&
        !canResume &&
        isDsSdgnExamLocked(userRecord, { globallyClosed: false, examId: meta.examId });
      const grade = resolveTrackHubGrade(userRecord, meta.examId, last);
      const progress =
        canResume && last
          ? {
              answered: last.answers?.length ?? 0,
              total: last.totalQuestions ?? last.questionIds?.length ?? 0,
              score: formatDsScore(last.scorePoints ?? 0),
            }
          : null;

      return (
        <section
          key={track}
          className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 flex flex-col gap-3"
        >
          <div>
            <h2 className="text-lg font-bold text-sky-300">{meta.title}</h2>
            <p className="text-slate-400 text-xs mt-1">{meta.subtitle}</p>
          </div>
          {track === "premiere" && (
            <p className="text-slate-400 text-xs leading-relaxed">
              {
                "Une seule proposition associe correctement la d\u00e9cision/l'analyse \u00e0 sa justification th\u00e9orique stricte."
              }
            </p>
          )}
          {canResume && progress ? (
            <>
              <p className="text-slate-300 text-sm">
                {`${progress.answered} / ${progress.total} questions \u00b7 ${progress.score} pt`}
              </p>
              <button
                type="button"
                onClick={() => requestTrackAccess(track, "continue")}
                className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 font-bold w-full sm:w-auto"
              >
                {"Continuer"}
              </button>
            </>
          ) : isAdmin ? (
            <>
              {grade != null ? (
                <p className="text-slate-300 text-sm">{`Derniere note : ${grade} / 20`}</p>
              ) : null}
              <p className="text-slate-500 text-xs">
                {"Mode admin : tu peux relancer le QCM. Rapport PDF dans Admin > Examens."}
              </p>
              <button
                type="button"
                onClick={() => requestTrackAccess(track, "start")}
                className="rounded-xl bg-sky-600 hover:bg-sky-500 px-6 py-3 font-bold w-full sm:w-auto"
              >
                {grade != null ? "Relancer le QCM" : "Lancer le QCM"}
              </button>
            </>
          ) : locked ? (
            <>
              <p className="text-slate-300 text-sm">
                {"Tu ne peux pas relancer ce QCM (une seule tentative). C'est normal."}
              </p>
              {grade != null ? (
                <p className="text-2xl font-black text-sky-400">{`Ta note : ${grade} / 20`}</p>
              ) : (
                <p className="text-amber-300 text-sm">
                  {"Note en cours de synchronisation. Reviens dans quelques secondes ou rafraichis la page."}
                </p>
              )}
            </>
          ) : meta.questionCount <= 0 ? (
            <p className="text-amber-300 text-sm">{"QCM en preparation. Reviens un peu plus tard."}</p>
          ) : (
            <button
              type="button"
              onClick={() => requestTrackAccess(track, "start")}
              className="rounded-xl bg-sky-600 hover:bg-sky-500 px-6 py-3 font-bold w-full sm:w-auto"
            >
              {"Lancer le QCM"}
            </button>
          )}
        </section>
      );
    };

    const gateTrackLabel =
      pendingTrackGate?.track === "terminale" ? "QCM Terminale" : "QCM 1\u00e8re";

    return (
      <div className={`${shellClass} px-4 py-8 max-w-4xl mx-auto`}>
        <style>{DS_CSS}</style>
        {pendingTrackGate ? (
          <div className="fixed inset-0 z-[10003] flex items-center justify-center bg-slate-950/90 px-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-600 bg-slate-900 p-6">
              <h2 className="text-xl font-black mb-1">{gateTrackLabel}</h2>
              <p className="text-slate-400 text-sm mb-4">{"Mot de passe donne en classe."}</p>
              <form onSubmit={submitTrackGate} className="space-y-4">
                <input
                  type="password"
                  autoComplete="off"
                  autoFocus
                  value={trackGateInput}
                  onChange={(e) => setTrackGateInput(e.target.value)}
                  placeholder="Mot de passe"
                  className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white"
                />
                {trackGateError ? <p className="text-red-400 text-sm">{trackGateError}</p> : null}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPendingTrackGate(null);
                      setTrackGateError("");
                      setTrackGateInput("");
                    }}
                    className="flex-1 rounded-xl border border-slate-600 px-4 py-3 font-bold text-slate-300"
                  >
                    {"Annuler"}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 rounded-xl bg-sky-600 hover:bg-sky-500 px-4 py-3 font-bold"
                  >
                    {"Valider"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        ) : null}
        <h1 className="text-3xl font-black mb-2">{"DS SDGN"}</h1>
        <p className="text-slate-300 mb-6 text-sm leading-relaxed">
          {isAdmin
            ? "Mode admin : QCM complet (100 questions). Rapport PDF dans Admin > Examens apres la session."
            : "Choisis ton niveau. +1 pt par bonne reponse, -0,5 pt par erreur. Tu peux terminer avec la croix en haut a droite."}
        </p>
        <div className="grid gap-6 md:grid-cols-2">{renderTrackCard("premiere")}{renderTrackCard("terminale")}</div>
      </div>
    );
  }

  if (phase === "end") {
    const total = questions.length;
    const displayScore = scoreRef.current;
    const gradeOn20 = computeDsGradeOn20(displayScore, total, false);
    const correctCount = answersRef.current.filter((a) => a.outcome === 1).length;
    const endExamId = isTerminale ? DS_SDGN_TERMINALE_QCM_EXAM_ID : DS_SDGN_QCM_EXAM_ID;
    const resolvedEnd = resolveDsAnswersForTopicStats(answersRef.current, endExamId);
    const topicStats = isTerminale
      ? computeTerminaleTopicStats(resolvedEnd as Parameters<typeof computeTerminaleTopicStats>[0])
      : computeTopicStats(resolvedEnd as Parameters<typeof computeTopicStats>[0]);
    const topicStatsMap = topicStats as Record<string, DsTopicStat>;
    const topicOrder = isTerminale ? DS_SDGN_TERMINALE_TOPIC_ORDER : DS_SDGN_TOPIC_ORDER;
    const topicLabels = isTerminale ? DS_SDGN_TERMINALE_TOPIC_LABELS : DS_SDGN_TOPIC_LABELS;
    return (
      <div className={`${shellClass} px-4 py-10 max-w-2xl mx-auto`}>
        <h2 className="text-2xl font-black mb-4 text-center">{"Fin du DS"}</h2>
        {interruptMsg && (
          <p className="text-amber-300 text-sm mb-4 text-center">{interruptMsg}</p>
        )}
        {saveState === "saving" && (
          <p className="text-sky-300 text-sm mb-4 text-center">{"Enregistrement..."}</p>
        )}
        {saveState === "err" && (
          <p className="text-red-400 text-sm mb-4 text-center font-bold">
            {"Erreur d'enregistrement. Previens ton prof."}
          </p>
        )}
        {saveState === "ok" && (
          <p className="text-emerald-400 text-sm mb-4 text-center">{"Copie enregistree sur le serveur."}</p>
        )}
        <p className="text-4xl font-black text-sky-400 text-center mb-2">
          {`${lastResultRef.current?.gradeOn20 ?? gradeOn20} / 20`}
        </p>
        <p className="text-slate-400 text-center text-sm mb-6">
          {`${formatDsScore(displayScore)} pt \u00b7 ${correctCount} bonnes \u00b7 ${wrongCount} erreurs`}
        </p>
        <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-4 mb-6 text-sm space-y-3">
          <p className="font-bold text-slate-200 text-base">{"Resume"}</p>
          <ul className="space-y-3">
            {topicOrder.map((topic, i) => {
              const stat = topicStatsMap[topic];
              const label = topicLabels[topic as keyof typeof topicLabels];
              if (!stat || stat.total <= 0) {
                return (
                  <li key={topic} className="text-slate-500 leading-relaxed">
                    <span className="font-bold text-slate-400">{`${i + 1}. `}</span>
                    {`${label} : pas evalue`}
                  </li>
                );
              }
              const ok = stat.acquis;
              return (
                <li key={topic} className="leading-relaxed">
                  <p className="font-bold text-slate-200">{`${i + 1}. ${label}`}</p>
                  <p className={ok ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                    {ok ? "OK pour ce theme" : "A revoir"}
                  </p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {`${stat.correct} bonne(s) sur ${stat.total}`}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="text-center">
          <button
            type="button"
            disabled={saveState === "saving"}
            onClick={() => {
              void (async () => {
                await saveChainRef.current;
                try {
                  await onExamFinished?.();
                } catch {
                  /* ignore */
                }
                setPhase("hub");
              })();
            }}
            className="rounded-xl bg-slate-700 hover:bg-slate-600 px-6 py-3 font-bold disabled:opacity-50"
          >
            {saveState === "saving" ? "Enregistrement..." : "Retour au hub DS"}
          </button>
          <p className="text-slate-500 text-xs max-w-sm">
            {"Tu peux aussi utiliser le menu STMG HUB (Accueil, etc.) : ta note reste enregistree."}
          </p>
        </div>
      </div>
    );
  }

  if (!current || !questionParts) return null;

  const chLabel = SDGN_CHAPTER_LABELS[current.chapter as keyof typeof SDGN_CHAPTER_LABELS];

  return (
    <div className={`${shellClass} px-4 py-6 max-w-2xl mx-auto`}>
      <style>{DS_CSS}</style>

      {antiCheatBlocked && (
        <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-slate-950/95 px-4">
          <div className="max-w-md w-full rounded-2xl border border-amber-600 bg-slate-900 p-6 text-center">
            <h2 className="text-xl font-black text-amber-300 mb-2">{"Pause anti-triche"}</h2>
            <p className="text-slate-300 text-sm mb-4">
              {"Changement d'onglet detecte. Demande le mot de passe de debloque au professeur."}
            </p>
            <form onSubmit={submitUnlock} className="space-y-3">
              <input
                type="password"
                autoComplete="off"
                value={unlockInput}
                onChange={(e) => setUnlockInput(e.target.value)}
                placeholder="Mot de passe debloque"
                className="w-full rounded-xl border border-slate-600 bg-slate-950 px-4 py-3 text-white text-center"
              />
              {unlockError && <p className="text-red-400 text-sm">{unlockError}</p>}
              <button type="submit" className="w-full rounded-xl bg-amber-600 hover:bg-amber-500 px-6 py-3 font-bold">
                {"Debloquer et continuer"}
              </button>
            </form>
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Terminer le QCM"
        title="Terminer le QCM"
        onClick={requestQuitQcm}
        className="fixed top-4 right-4 z-[10002] flex h-11 w-11 items-center justify-center rounded-full border-2 border-slate-500 bg-slate-900/95 text-2xl font-light leading-none text-slate-200 hover:border-red-400 hover:bg-red-950/90 hover:text-red-200"
      >
        {"\u00d7"}
      </button>

      <div className="flex justify-between items-center text-sm text-slate-400 mb-4 pr-14">
        <span>{`Question ${index + 1} / ${questions.length}`}</span>
        <div className="text-right">
          {isTerminale ? (
            <p className={`tabular-nums ${questionLeft <= 8 ? "text-amber-300 ds-timer-urgent" : ""}`}>
              {`Question: ${questionLeft}s`}
            </p>
          ) : null}
          <p className="tabular-nums">{`Temps restant ${sessionMmSs}`}</p>
        </div>
      </div>

      <div className="h-1.5 rounded-full bg-slate-800 mb-6 overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ease-linear ${sessionLeft <= 300 ? "bg-amber-500 ds-timer-urgent" : "bg-sky-500"}`}
          style={{ width: `${Math.max(0, (sessionLeft / sessionSec) * 100)}%` }}
        />
      </div>

      <section className="rounded-2xl border-2 border-sky-600/70 bg-sky-950/40 px-5 py-5 mb-8 shadow-lg shadow-sky-950/30">
        <p className="text-xs font-bold uppercase tracking-wider text-sky-300 mb-3">
          {`${current.kindLabel} \u00b7 Ch. ${current.chapter}${chLabel ? ` \u2014 ${chLabel}` : ""}`}
        </p>
        {questionParts.lead ? (
          <p className="text-slate-200 text-[15px] leading-relaxed whitespace-pre-line mb-4 border-b border-sky-800/50 pb-4">
            {questionParts.lead}
          </p>
        ) : null}
        <p className="text-white text-base font-semibold leading-relaxed whitespace-pre-line">
          {questionParts.body}
        </p>
      </section>

      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        {"Choisis ta r\u00e9ponse"}
      </p>

      <div className="grid gap-3">
        {current.choices.map((c, i) => {
          const letter = CHOICE_LETTERS[i];
          let cls =
            "flex gap-3 items-start rounded-xl border-2 border-slate-600 bg-slate-800/90 px-4 py-3.5 text-left font-medium text-slate-100 hover:border-violet-400 hover:bg-slate-800 transition-colors";
          let badgeCls =
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-violet-500/60 bg-violet-950/80 text-sm font-black text-violet-200";
          if (answered) {
            if (i === current.ok) {
              cls += " border-emerald-500 bg-emerald-950/60";
              badgeCls = "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-emerald-400 bg-emerald-900 text-sm font-black text-emerald-100";
            } else if (i === picked) {
              cls += " border-red-500 bg-red-950/50";
              badgeCls = "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-red-400 bg-red-900 text-sm font-black text-red-100";
            } else {
              cls += " opacity-55";
            }
          }
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => resolveAnswer(i)}
              className={cls}
            >
              <span className={badgeCls}>{letter}</span>
              <span className="pt-0.5 leading-snug">{c}</span>
            </button>
          );
        })}
      </div>

      <p className="text-center text-slate-500 text-xs mt-8">
        {`Score : ${formatDsScore(score)} pt (+1 bonne, -0,5 erreur) \u00b7 croix en haut a droite pour terminer`}
      </p>
    </div>
  );
}
