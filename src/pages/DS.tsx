import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { auth } from "../services/firebase";
import { useDsImmersive } from "../contexts/DsImmersiveContext";
import {
  computeDsGradeOn20,
  computeDsScoreFromAnswers,
  computeTopicStats,
} from "../lib/dsSdgnGrading";
import {
  buildDsSessionRecord,
  canStudentResumeDsSdgnExam,
  DS_SDGN_QCM_EXAM_ID,
  isDsSdgnExamLocked,
  markDsAttemptStarted,
  persistDsTabResult,
  readDsTabLastSession,
  resetDsSdgnTabExamForUser,
  type DsSessionAnswerRecord,
  type DsSessionStatus,
} from "../services/dsTabExamService";
import { SDGN_CHAPTER_LABELS } from "../data/sdgn/registry";
import { enterDsFullscreen, exitDsFullscreen } from "../lib/dsFullscreen";
import {
  buildDsSdgnPremiereDeck,
  buildDsSdgnPremiereDeckFromQuestionIds,
  rebuildQuestionIdsForResume,
  type DsPlayQuestion,
  countDsSdgnPremiereByKind,
  DS_SCORE_CORRECT,
  DS_SCORE_WRONG,
  DS_SDGN_PREMIERE_QUESTION_SEC,
  DS_SDGN_PREMIERE_SESSION_SEC,
  formatDsScore,
  getDsSdgnPremiereQuestionCount,
} from "../lib/dsSdgnQcmDeck";

type Props = {
  profil: { prenom?: string; role?: string; dsTab?: Record<string, unknown> };
  onExamFinished?: () => void;
};

type Phase = "hub" | "play" | "end";
type AnswerOutcome = "correct" | "wrong";

const DS_CSS = `
@keyframes dsPulse{0%,100%{opacity:1}50%{opacity:.5}}
.ds-timer-urgent{animation:dsPulse .7s ease-in-out infinite}
`;

const DS_GATE_SESSION_KEY = "stmg_ds_sdgn_gate_v1";
const DS_GATE_PASSWORD = "vivestmg2";

function readGateUnlocked(): boolean {
  try {
    return sessionStorage.getItem(DS_GATE_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

function writeGateUnlocked(): void {
  try {
    sessionStorage.setItem(DS_GATE_SESSION_KEY, "1");
  } catch {
    /* ignore */
  }
}

export default function DS({ profil, onExamFinished }: Props) {
  const { setImmersive } = useDsImmersive();
  const [phase, setPhase] = useState<Phase>("hub");
  const [gateUnlocked, setGateUnlocked] = useState(readGateUnlocked);
  const [gateInput, setGateInput] = useState("");
  const [gateError, setGateError] = useState("");
  const [questions, setQuestions] = useState<DsPlayQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [qTimeLeft, setQTimeLeft] = useState(DS_SDGN_PREMIERE_QUESTION_SEC);
  const [sessionLeft, setSessionLeft] = useState(DS_SDGN_PREMIERE_SESSION_SEC);
  const [wrongCount, setWrongCount] = useState(0);
  const [forcedZero, setForcedZero] = useState(false);
  const [cheatMsg, setCheatMsg] = useState("");
  const [adminResetting, setAdminResetting] = useState(false);

  const qTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const forcedZeroRef = useRef(false);
  const phaseRef = useRef<Phase>("hub");
  const finishedRef = useRef(false);
  const scoreRef = useRef(0);
  const questionsRef = useRef<DsPlayQuestion[]>([]);
  const sessionIdRef = useRef("");
  const startedAtRef = useRef("");
  const answersRef = useRef<DsSessionAnswerRecord[]>([]);
  const adminExitPlayRef = useRef(false);
  const indexRef = useRef(0);
  const answeredRef = useRef(false);
  const sessionLeftRef = useRef(DS_SDGN_PREMIERE_SESSION_SEC);
  const goNextRef = useRef<(outcome: AnswerOutcome, picked: number | null) => void>(() => {});
  const finishExamRef = useRef<(disqualified?: boolean) => void>(() => {});
  const onQuestionTimeoutRef = useRef<() => void>(() => {});

  const prenom = profil?.prenom || "toi";
  const isAdmin = profil?.role === "admin";
  const userRecord = profil as Record<string, unknown>;
  const [attemptLocked, setAttemptLocked] = useState(
    () => !isAdmin && isDsSdgnExamLocked(userRecord),
  );
  const canResume = !isAdmin && canStudentResumeDsSdgnExam(userRecord);
  const examLocked =
    !isAdmin && !canResume && (attemptLocked || isDsSdgnExamLocked(userRecord));
  const lastSession = readDsTabLastSession(userRecord);

  useEffect(() => {
    if (!isAdmin && isDsSdgnExamLocked(userRecord)) setAttemptLocked(true);
  }, [profil, isAdmin, userRecord]);

  const totalInBank = getDsSdgnPremiereQuestionCount();
  const kindCounts = countDsSdgnPremiereByKind();
  const targetFull = Math.floor(DS_SDGN_PREMIERE_SESSION_SEC / DS_SDGN_PREMIERE_QUESTION_SEC);

  const current = questions[index] ?? null;

  phaseRef.current = phase;
  scoreRef.current = score;
  questionsRef.current = questions;
  indexRef.current = index;
  answeredRef.current = answered;
  sessionLeftRef.current = sessionLeft;

  const immersiveActive = phase === "play" || phase === "end";

  useEffect(() => {
    setImmersive(immersiveActive);
    return () => setImmersive(false);
  }, [immersiveActive, setImmersive]);

  useEffect(() => {
    if (immersiveActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [immersiveActive]);

  const clearTimers = useCallback(() => {
    if (qTimerRef.current) clearInterval(qTimerRef.current);
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    qTimerRef.current = null;
    sessionTimerRef.current = null;
  }, []);

  const persistSession = useCallback(
    (finalScore: number, status: DsSessionStatus) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const finishedAt = new Date().toISOString();
      const total = questionsRef.current.length;
      const disqualified = status === "disqualified";
      const answers = [...answersRef.current];
      const scorePoints = disqualified
        ? computeDsScoreFromAnswers(answers)
        : finalScore;
      const gradeOn20 = disqualified
        ? 0
        : computeDsGradeOn20(scorePoints, total, false);
      const session = buildDsSessionRecord({
        sessionId: sessionIdRef.current,
        startedAt: startedAtRef.current,
        finishedAt,
        scorePoints,
        totalQuestions: total,
        questionsAnswered: answers.length,
        correctCount: answers.filter((a) => a.outcome === 1).length,
        wrongCount: answers.filter((a) => a.outcome === 0).length,
        skippedCount: 0,
        forcedZero: disqualified,
        gradeOn20,
        status,
        questionIds: questionsRef.current.map((q) => q.sourceId),
        answers,
        topicStats: computeTopicStats(answers),
        sessionLeftSec: sessionLeftRef.current,
        resumeIndex: answers.length,
      });
      void persistDsTabResult(uid, {
        score: disqualified ? scorePoints : scorePoints,
        total,
        skipped: 0,
        forcedZero: disqualified,
        finishedAt,
        gradeOn20: disqualified
          ? (session.gradeOn20Provisional ?? 0)
          : gradeOn20,
        session,
        resumeGranted: status === "completed" ? false : undefined,
      })
        .then(() => onExamFinished?.())
        .catch((err) => console.error("Sauvegarde resultat DS impossible", err));
    },
    [onExamFinished],
  );

  const finishExam = useCallback(
    (disqualified = forcedZeroRef.current) => {
      clearTimers();
      void exitDsFullscreen();
      if (disqualified) {
        const pts = computeDsScoreFromAnswers(answersRef.current);
        setScore(pts);
        scoreRef.current = pts;
      }
      persistSession(scoreRef.current, disqualified ? "disqualified" : "completed");
      setPhase("end");
    },
    [clearTimers, persistSession],
  );

  finishExamRef.current = finishExam;

  const disqualify = useCallback(
    (reason: "visibility" | "navigate" | "fullscreen") => {
      if (forcedZeroRef.current || phaseRef.current !== "play") return;
      forcedZeroRef.current = true;
      setForcedZero(true);
      setScore(0);
      const msg =
        reason === "fullscreen"
          ? "Session interrompue (plein \u00e9cran). Tes r\u00e9ponses sont enregistr\u00e9es : demande \u00e0 ton prof de te laisser reprendre le DS."
          : reason === "navigate"
            ? "Session interrompue (page quitt\u00e9e). Tes r\u00e9ponses sont enregistr\u00e9es : demande \u00e0 ton prof de te laisser reprendre le DS."
            : "Session interrompue (changement d\u2019onglet). Tes r\u00e9ponses sont enregistr\u00e9es : demande \u00e0 ton prof de te laisser reprendre le DS.";
      setCheatMsg(msg);
      clearTimers();
      finishExam(true);
    },
    [clearTimers, finishExam],
  );

  const recordCurrentAnswer = useCallback(
    (outcome: AnswerOutcome, picked: number | null) => {
      const q = questionsRef.current[indexRef.current];
      if (!q) return;
      answersRef.current.push({
        sourceId: q.sourceId,
        topic: q.topic,
        outcome: outcome === "correct" ? 1 : 0,
        scenarioText: q.q,
        scenarioTitle: q.kindLabel,
        ...(picked !== null ? { picked: picked as 0 | 1 | 2 | 3 } : {}),
      });
    },
    [],
  );

  const goNext = useCallback(
    (outcome: AnswerOutcome, picked: number | null = null) => {
      if (forcedZeroRef.current) return;
      recordCurrentAnswer(outcome, picked);
      if (outcome === "correct") {
        scoreRef.current += DS_SCORE_CORRECT;
      } else {
        scoreRef.current += DS_SCORE_WRONG;
        setWrongCount((c) => c + 1);
      }
      setScore(scoreRef.current);
      const next = indexRef.current + 1;
      if (next >= questionsRef.current.length || sessionLeftRef.current <= 0) {
        finishExamRef.current(false);
        return;
      }
      setIndex(next);
      setAnswered(false);
      setPicked(null);
    },
    [recordCurrentAnswer],
  );

  goNextRef.current = goNext;

  const resolveAnswer = useCallback(
    (choiceIdx: number) => {
      if (answered || !current || forcedZeroRef.current) return;
      setAnswered(true);
      setPicked(choiceIdx);
      const ok = choiceIdx === current.ok;
      window.setTimeout(() => goNext(ok ? "correct" : "wrong", choiceIdx), 700);
    },
    [answered, current, goNext],
  );

  const onQuestionTimeout = useCallback(() => {
    if (answeredRef.current || forcedZeroRef.current) return;
    const q = questionsRef.current[indexRef.current];
    if (!q) return;
    setAnswered(true);
    window.setTimeout(() => goNextRef.current("wrong", null), 400);
  }, []);

  onQuestionTimeoutRef.current = onQuestionTimeout;

  const resumeSdgnPremiere = () => {
    const session = readDsTabLastSession(userRecord);
    const questionIds = session ? rebuildQuestionIdsForResume(session) : null;
    if (!questionIds?.length || !canResume) return;

    clearTimers();
    forcedZeroRef.current = false;
    finishedRef.current = false;
    setForcedZero(false);
    setCheatMsg("");

    const deck = buildDsSdgnPremiereDeckFromQuestionIds(questionIds, session.sessionId);
    if (!deck.length) return;

    const answers = [...(session.answers ?? [])];
    const idx = Math.min(answers.length, deck.length);
    const score = computeDsScoreFromAnswers(answers);
    const wrong = answers.filter((a) => a.outcome === 0).length;
    const left = session.sessionLeftSec ?? DS_SDGN_PREMIERE_SESSION_SEC;

    sessionIdRef.current = session.sessionId;
    startedAtRef.current = session.startedAt;
    answersRef.current = answers;
    setQuestions(deck);
    setIndex(idx);
    scoreRef.current = score;
    setScore(score);
    setWrongCount(wrong);
    setAnswered(false);
    setPicked(null);
    setQTimeLeft(DS_SDGN_PREMIERE_QUESTION_SEC);
    setSessionLeft(left);
    sessionLeftRef.current = left;
    setPhase("play");
  };

  const startSdgnPremiere = () => {
    if (examLocked && !canResume) return;
    setAttemptLocked(true);
    clearTimers();
    forcedZeroRef.current = false;
    finishedRef.current = false;
    setForcedZero(false);
    setCheatMsg("");
    const deck = buildDsSdgnPremiereDeck();
    sessionIdRef.current = crypto.randomUUID();
    startedAtRef.current = new Date().toISOString();
    answersRef.current = [];
    setQuestions(deck);
    setIndex(0);
    scoreRef.current = 0;
    setScore(0);
    setWrongCount(0);
    setAnswered(false);
    setPicked(null);
    setQTimeLeft(DS_SDGN_PREMIERE_QUESTION_SEC);
    setSessionLeft(DS_SDGN_PREMIERE_SESSION_SEC);
    setPhase("play");
    const uid = auth.currentUser?.uid;
    if (uid) {
      void markDsAttemptStarted(uid, sessionIdRef.current).catch((err) =>
        console.error("Marquage debut DS impossible", err),
      );
    }
  };

  const adminExitFullscreen = useCallback(() => {
    if (!isAdmin) return;
    adminExitPlayRef.current = true;
    finishedRef.current = true;
    clearTimers();
    void exitDsFullscreen();
    setPhase("hub");
  }, [isAdmin, clearTimers]);

  const handleAdminSelfReset = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid || !isAdmin) return;
    if (!window.confirm("R\u00e9initialiser ton QCM SDGN ? Tu pourras le relancer.")) return;
    setAdminResetting(true);
    try {
      await resetDsSdgnTabExamForUser(uid);
      setAttemptLocked(false);
      setPhase("hub");
      setForcedZero(false);
      forcedZeroRef.current = false;
      finishedRef.current = false;
      onExamFinished?.();
    } catch (err) {
      console.error(err);
      window.alert("Reset impossible (Firebase).");
    } finally {
      setAdminResetting(false);
    }
  };

  const submitGate = (e: FormEvent) => {
    e.preventDefault();
    if (gateInput.trim() === DS_GATE_PASSWORD) {
      writeGateUnlocked();
      setGateUnlocked(true);
      setGateError("");
      setGateInput("");
      return;
    }
    setGateError("Mot de passe incorrect.");
  };

  useEffect(() => {
    if (phase !== "play" || forcedZero || isAdmin) return undefined;

    const onHidden = () => {
      if (document.hidden) disqualify("visibility");
    };
    const onBlur = () => disqualify("visibility");
    const onFsChange = () => {
      if (!document.fullscreenElement) disqualify("fullscreen");
    };

    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onHidden);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onHidden);
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, [phase, forcedZero, isAdmin, disqualify]);

  useEffect(() => {
    return () => {
      if (isAdmin || adminExitPlayRef.current) return;
      if (phaseRef.current !== "play" || forcedZeroRef.current || finishedRef.current) return;
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      persistSession(scoreRef.current, "incomplete");
    };
  }, [persistSession, isAdmin]);

  /** Chrono session 50 min (ind\u00e9pendant du changement de question). */
  useEffect(() => {
    if (phase !== "play" || forcedZero) return undefined;

    sessionTimerRef.current = setInterval(() => {
      setSessionLeft((t) => {
        if (t <= 1) {
          finishExamRef.current(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      if (sessionTimerRef.current) {
        clearInterval(sessionTimerRef.current);
        sessionTimerRef.current = null;
      }
    };
  }, [phase, forcedZero]);

  /** Chrono 30 s par question (cas / cours sans calcul). */
  useEffect(() => {
    if (phase !== "play" || forcedZero) return undefined;

    const q = questionsRef.current[index];
    const timed = q?.questionTimed !== false;
    setQTimeLeft(DS_SDGN_PREMIERE_QUESTION_SEC);

    if (timed) {
      qTimerRef.current = setInterval(() => {
        setQTimeLeft((t) => {
          if (t <= 1) {
            if (qTimerRef.current) {
              clearInterval(qTimerRef.current);
              qTimerRef.current = null;
            }
            onQuestionTimeoutRef.current();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else if (qTimerRef.current) {
      clearInterval(qTimerRef.current);
      qTimerRef.current = null;
    }

    return () => {
      if (qTimerRef.current) {
        clearInterval(qTimerRef.current);
        qTimerRef.current = null;
      }
    };
  }, [phase, index, forcedZero, current?.sourceId, current?.questionTimed]);

  const sessionMmSs = useMemo(() => {
    const m = Math.floor(sessionLeft / 60);
    const s = sessionLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [sessionLeft]);

  const questionTimed = current?.questionTimed !== false;
  const qPct = (qTimeLeft / DS_SDGN_PREMIERE_QUESTION_SEC) * 100;
  const metaKind = current?.kindLabel;

  const shellClass = immersiveActive
    ? "fixed inset-0 z-[10000] overflow-y-auto bg-slate-950 text-white"
    : "min-h-screen bg-slate-950 text-white";

  const lockedGrade =
    lastSession && !lastSession.forcedZero
      ? `${lastSession.gradeOn20} / 20`
      : lastSession?.forcedZero
        ? lastSession.gradeOn20Provisional != null
          ? `${lastSession.gradeOn20Provisional} / 20 (prov.)`
          : "0 / 20"
        : null;

  const resumeProgress =
    canResume && lastSession
      ? {
          answered: lastSession.answers?.length ?? 0,
          total: lastSession.totalQuestions ?? lastSession.questionIds?.length ?? 0,
          score: formatDsScore(lastSession.scorePoints ?? 0),
          minutesLeft: Math.ceil((lastSession.sessionLeftSec ?? DS_SDGN_PREMIERE_SESSION_SEC) / 60),
        }
      : null;

  if (!gateUnlocked) {
    return (
      <div className={`${shellClass} px-4 py-8 max-w-md mx-auto flex flex-col justify-center min-h-[60vh]`}>
        <style>{DS_CSS}</style>
        <h1 className="text-2xl font-black mb-2">{"DS \u2014 Acc\u00e8s"}</h1>
        <p className="text-slate-400 text-sm mb-6">
          {"Entre le mot de passe donn\u00e9 en classe pour acc\u00e9der au QCM."}
        </p>
        <form onSubmit={submitGate} className="space-y-4">
          <input
            type="password"
            autoComplete="off"
            value={gateInput}
            onChange={(e) => setGateInput(e.target.value)}
            placeholder="Mot de passe"
            className="w-full rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-white"
          />
          {gateError && <p className="text-red-400 text-sm">{gateError}</p>}
          <button
            type="submit"
            className="w-full rounded-xl bg-sky-600 hover:bg-sky-500 px-6 py-3 font-bold"
          >
            {"Valider"}
          </button>
        </form>
      </div>
    );
  }

  if (phase === "hub") {
    return (
      <div className={`${shellClass} px-4 py-8 max-w-3xl mx-auto`}>
        <style>{DS_CSS}</style>
        <h1 className="text-3xl font-black mb-2">{"DS \u2014 Contr\u00f4les"}</h1>
        <p className="text-slate-300 mb-6 leading-relaxed">
          {
            "QCM chronom\u00e9tr\u00e9 SDGN 1\u00e8re : questions et r\u00e9ponses A\u2013D tir\u00e9es au hasard \u00e0 chaque session."
          }
        </p>

        <section className="rounded-2xl border border-red-900/60 bg-red-950/30 p-4 mb-6 text-red-200 text-sm">
          <p className="font-bold mb-1">{"R\u00e8gle anti-triche"}</p>
          <p>
            {
              "Plein \u00e9cran obligatoire : touche \u00c9chap, changement d\u2019onglet ou autre fen\u00eatre = note 0 imm\u00e9diate."
            }
          </p>
        </section>

        {canResume && resumeProgress ? (
          <section className="rounded-2xl border border-emerald-600/60 bg-emerald-950/30 p-6 mb-6">
            <h2 className="text-xl font-bold text-emerald-300 mb-2">{"Reprendre ton DS"}</h2>
            <p className="text-slate-300 text-sm mb-3">
              {`Tu as d\u00e9j\u00e0 r\u00e9pondu \u00e0 ${resumeProgress.answered} / ${resumeProgress.total} questions. Score actuel : ${resumeProgress.score} pt. Temps restant : environ ${resumeProgress.minutesLeft} min.`}
            </p>
            <p className="text-slate-400 text-xs mb-4">
              {"M\u00eames questions dans le m\u00eame ordre \u00b7 tes r\u00e9ponses pr\u00e9c\u00e9dentes sont conserv\u00e9es."}
            </p>
            <button
              type="button"
              onClick={resumeSdgnPremiere}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 px-6 py-3 font-bold text-white"
            >
              {"Continuer le DS"}
            </button>
          </section>
        ) : examLocked ? (
          <section className="rounded-2xl border border-amber-700/60 bg-amber-950/30 p-6 mb-6">
            <h2 className="text-xl font-bold text-amber-300 mb-2">{"DS d\u00e9j\u00e0 pass\u00e9"}</h2>
            <p className="text-slate-300 text-sm mb-3">
              {
                "Tu ne peux pas relancer ce QCM. Si tu as \u00e9t\u00e9 coup\u00e9 par erreur, demande \u00e0 ton prof \u00ab Autoriser reprise \u00bb dans l\u2019admin."
              }
            </p>
            {lockedGrade && (
              <p className="text-2xl font-black text-sky-400">{`Ta note : ${lockedGrade}`}</p>
            )}
            {lastSession?.forcedZero && !canResume && (
              <p className="text-red-400 text-sm mt-2 font-bold">
                {"Session interrompue (anti-triche). Le prof peut autoriser la reprise."}
              </p>
            )}
          </section>
        ) : (
          <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 mb-6">
            <h2 className="text-xl font-bold text-sky-300 mb-2">{"SDGN \u2014 1\u00e8re"}</h2>
            <ul className="text-slate-300 text-sm space-y-1 mb-4 list-disc pl-5">
              <li>{`Dur\u00e9e session : ${DS_SDGN_PREMIERE_SESSION_SEC / 60} minutes`}</li>
              <li>
                {`${DS_SDGN_PREMIERE_QUESTION_SEC} s par question (sauf calcul chiffr\u00e9) \u00b7 ordre tir\u00e9 au hasard \u00e0 chaque lancement`}
              </li>
              <li>
                {`Banque DS : ${totalInBank} questions difficiles (${kindCounts.cas} cas, ${kindCounts.calcul} calculs, ${kindCounts.cours} cours)`}
              </li>
              <li>{`Jusqu\u2019\u00e0 ${targetFull} questions par session`}</li>
              <li>{"Ordre al\u00e9atoire \u00e0 chaque lancement"}</li>
              <li>{`Bar\u00e8me : +${DS_SCORE_CORRECT} pt si juste, ${DS_SCORE_WRONG} pt si faux ou temps \u00e9coul\u00e9`}</li>
              <li>
                {
                  "3 types d\u2019\u00e9nonc\u00e9s : cas entreprise (texte unique), calcul simple, cours pur \u2014 pas de blocs s\u00e9par\u00e9s."
                }
              </li>
              <li className="text-amber-200 font-semibold">
                {"Une seule tentative \u00b7 plein \u00e9cran navigateur (tout l\u2019\u00e9cran) jusqu\u2019\u00e0 la fin."}
              </li>
            </ul>
            <button
              type="button"
              onClick={startSdgnPremiere}
              className="rounded-xl bg-sky-600 hover:bg-sky-500 px-6 py-3 font-bold text-white"
            >
              {"Lancer le QCM 1\u00e8re SDGN"}
            </button>
          </section>
        )}

        <section className="rounded-2xl border border-dashed border-slate-600 p-6 opacity-70">
          <h2 className="text-lg font-bold text-slate-400">{"Management \u2014 Terminale"}</h2>
          <p className="text-slate-500 text-sm mt-2">{"Bient\u00f4t disponible (m\u00eame format 50 min / 30 s)."}</p>
        </section>

        {profil?.role === "admin" && (
          <section className="mt-6 rounded-xl border border-violet-700/50 bg-violet-950/30 p-4">
            <p className="text-violet-200 text-sm mb-3 font-bold">{"Zone admin (tests)"}</p>
            <button
              type="button"
              disabled={adminResetting}
              onClick={() => void handleAdminSelfReset()}
              className="rounded-lg border border-violet-500 px-4 py-2 text-sm font-bold text-violet-200 hover:bg-violet-900/50 disabled:opacity-50"
            >
              {adminResetting ? "Reset..." : "R\u00e9initialiser mon DS SDGN"}
            </button>
            <p className="text-violet-300/70 text-xs mt-2">
              {`Efface dsTab / ${DS_SDGN_QCM_EXAM_ID} pour ton compte.`}
            </p>
          </section>
        )}
      </div>
    );
  }

  if (phase === "end") {
    const total = questions.length;
    const displayScore = score;
    const scoreLabel = formatDsScore(displayScore);
    const gradeOn20 = computeDsGradeOn20(displayScore, total, false);
    const provGrade = forcedZero ? gradeOn20 : gradeOn20;
    const correctCount = answersRef.current.filter((a) => a.outcome === 1).length;

    return (
      <div className={`${shellClass} px-4 py-10 max-w-2xl mx-auto text-center`}>
        <h2 className="text-2xl font-black mb-4">{"Fin du DS QCM"}</h2>
        {forcedZero && (
          <p className="text-amber-300 font-bold mb-4 px-4 text-sm leading-relaxed">
            {cheatMsg || "Session interrompue. Demande \u00e0 ton prof de t\u2019autoriser \u00e0 reprendre."}
          </p>
        )}
        <p className="text-slate-300 mb-6">{`${prenom}, voici ton r\u00e9sultat.`}</p>
        {forcedZero && (
          <p className="text-slate-400 text-sm mb-2">
            {`Score provisoire enregistr\u00e9 : ${scoreLabel} pt (${provGrade} / 20 sur les questions d\u00e9j\u00e0 faites).`}
          </p>
        )}
        <p className={`text-5xl font-black mb-1 ${forcedZero ? "text-amber-500" : "text-sky-400"}`}>
          {forcedZero ? `${provGrade} / 20 (prov.)` : `${gradeOn20} / 20`}
        </p>
        {!forcedZero && (
          <>
            <p className="text-base text-slate-400 mb-2">
              {`${scoreLabel} points \u00b7 ${correctCount} bonne(s) \u00b7 ${wrongCount} en erreur ou non r\u00e9pondues`}
            </p>
            <p className="text-slate-500 text-xs mb-6">
              {`(${DS_SCORE_WRONG} pt par erreur ou temps \u00e9coul\u00e9)`}
            </p>
          </>
        )}
        <p className="text-amber-300 text-sm mb-6">
          {"Ce DS est termin\u00e9 : tu ne peux plus le relancer sans autorisation du professeur."}
        </p>
        <button
          type="button"
          onClick={() => setPhase("hub")}
          className="rounded-xl bg-slate-700 hover:bg-slate-600 px-6 py-3 font-bold"
        >
          {"Retour au hub DS"}
        </button>
      </div>
    );
  }

  if (!current) return null;

  const chLabel = SDGN_CHAPTER_LABELS[current.chapter as keyof typeof SDGN_CHAPTER_LABELS];

  return (
    <div className={`${shellClass} px-4 py-6 max-w-2xl mx-auto`}>
      <style>{DS_CSS}</style>
      {isAdmin && (
        <button
          type="button"
          onClick={adminExitFullscreen}
          className="fixed top-3 right-3 z-[10001] rounded-lg border border-violet-500/80 bg-violet-950/90 px-3 py-2 text-xs font-bold text-violet-200 shadow-lg hover:bg-violet-900"
        >
          {"Sortir du plein \u00e9cran (admin)"}
        </button>
      )}
      {forcedZero && (
        <p className="text-red-400 text-sm font-bold mb-4 text-center">{cheatMsg}</p>
      )}
      <div className="flex justify-between items-center text-sm text-slate-400 mb-4">
        <span>{`Question ${index + 1} / ${questions.length}`}</span>
        <span>{`Session ${sessionMmSs}`}</span>
      </div>
      {questionTimed ? (
        <>
          <div className="h-2 rounded-full bg-slate-800 mb-1 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${qTimeLeft <= 8 ? "bg-red-500 ds-timer-urgent" : "bg-sky-500"}`}
              style={{ width: `${qPct}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mb-6">
            {`${qTimeLeft} s \u00b7 ${metaKind ?? ""} \u00b7 Ch. ${current.chapter} ${chLabel ?? ""}`}
          </p>
        </>
      ) : (
        <p className="text-xs text-emerald-400/90 mb-6">
          {`${metaKind ?? "Calcul"} \u2014 pas de limite par question \u00b7 Ch. ${current.chapter} ${chLabel ?? ""}`}
        </p>
      )}

      <section className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-5 mb-6">
        <p className="text-slate-100 text-base leading-relaxed whitespace-pre-line">{current.q}</p>
      </section>

      <div className="grid gap-3">
        {current.choices.map((c, i) => {
          let cls =
            "rounded-xl border border-slate-600 bg-slate-900 px-4 py-3 text-left font-medium hover:border-sky-500";
          if (answered) {
            if (i === current.ok) cls += " border-emerald-500 bg-emerald-950/50";
            else if (i === picked) cls += " border-red-500 bg-red-950/40";
            else cls += " opacity-60";
          }
          return (
            <button key={i} type="button" disabled={answered} onClick={() => resolveAnswer(i)} className={cls}>
              {c}
            </button>
          );
        })}
      </div>

      <p className="text-center text-slate-500 text-xs mt-8">
        {`Score provisoire : ${formatDsScore(score)} pt \u00b7 +${DS_SCORE_CORRECT} / ${DS_SCORE_WRONG} par question`}
      </p>
    </div>
  );
}
