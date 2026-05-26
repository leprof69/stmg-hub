import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { auth } from "../services/firebase";
import {
  markDsAttemptStarted,
  persistDsForcedZero,
  persistDsTabResult,
} from "../services/dsTabExamService";
import { SDGN_CHAPTER_LABELS } from "../data/sdgn/registry";
import {
  buildDsSdgnPremiereDeck,
  countDsSdgnPremiereDifficile,
  DS_SDGN_PREMIERE_QUESTION_SEC,
  DS_SDGN_PREMIERE_SESSION_SEC,
  getDsSdgnPremiereDifficulte,
  getDsSdgnPremiereQuestionCount,
} from "../lib/dsSdgnQcmDeck";
import type { GameQuizQ } from "../lib/gameQcmPool";

type Props = { profil: { prenom?: string; niveau?: string } };

type Phase = "hub" | "play" | "end";

const DS_CSS = `
@keyframes dsPulse{0%,100%{opacity:1}50%{opacity:.5}}
.ds-timer-urgent{animation:dsPulse .7s ease-in-out infinite}
`;

export default function DS({ profil }: Props) {
  const [phase, setPhase] = useState<Phase>("hub");
  const [questions, setQuestions] = useState<GameQuizQ[]>([]);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [picked, setPicked] = useState<number | null>(null);
  const [qTimeLeft, setQTimeLeft] = useState(DS_SDGN_PREMIERE_QUESTION_SEC);
  const [sessionLeft, setSessionLeft] = useState(DS_SDGN_PREMIERE_SESSION_SEC);
  const [skipped, setSkipped] = useState(0);
  const [forcedZero, setForcedZero] = useState(false);
  const [cheatMsg, setCheatMsg] = useState("");

  const qTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const forcedZeroRef = useRef(false);
  const phaseRef = useRef<Phase>("hub");
  const finishedRef = useRef(false);
  const scoreRef = useRef(0);
  const skippedRef = useRef(0);
  const questionsRef = useRef<GameQuizQ[]>([]);

  const prenom = profil?.prenom || "toi";

  const totalInBank = getDsSdgnPremiereQuestionCount();
  const difficileCount = countDsSdgnPremiereDifficile();
  const targetFull = Math.floor(DS_SDGN_PREMIERE_SESSION_SEC / DS_SDGN_PREMIERE_QUESTION_SEC);

  const current = questions[index] ?? null;

  phaseRef.current = phase;
  scoreRef.current = score;
  skippedRef.current = skipped;
  questionsRef.current = questions;

  const clearTimers = useCallback(() => {
    if (qTimerRef.current) clearInterval(qTimerRef.current);
    if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    qTimerRef.current = null;
    sessionTimerRef.current = null;
  }, []);

  const persistFinish = useCallback(
    (finalScore: number, disqualified: boolean) => {
      if (finishedRef.current) return;
      finishedRef.current = true;
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const payload = {
        score: disqualified ? 0 : finalScore,
        total: questionsRef.current.length,
        skipped: skippedRef.current,
        forcedZero: disqualified,
        finishedAt: new Date().toISOString(),
      };
      void persistDsTabResult(uid, payload).catch((err) =>
        console.error("Sauvegarde resultat DS impossible", err),
      );
    },
    [],
  );

  const finishExam = useCallback(
    (disqualified = forcedZeroRef.current) => {
      clearTimers();
      if (disqualified) setScore(0);
      persistFinish(disqualified ? 0 : scoreRef.current, disqualified);
      setPhase("end");
    },
    [clearTimers, persistFinish],
  );

  const disqualify = useCallback(
    (reason: "visibility" | "navigate") => {
      if (forcedZeroRef.current || phaseRef.current !== "play") return;
      forcedZeroRef.current = true;
      setForcedZero(true);
      setScore(0);
      setCheatMsg(
        reason === "navigate"
          ? "Anti-triche : tu as quitte la page DS. Note forcee a 0."
          : "Anti-triche : changement d'onglet ou de fenetre detecte. Note forcee a 0.",
      );
      clearTimers();
      finishExam(true);
    },
    [clearTimers, finishExam],
  );

  const goNext = useCallback(
    (wasCorrect: boolean) => {
      if (forcedZeroRef.current) return;
      if (wasCorrect) setScore((s) => s + 1);
      const next = index + 1;
      if (next >= questions.length || sessionLeft <= 0) {
        finishExam(false);
        return;
      }
      setIndex(next);
      setAnswered(false);
      setPicked(null);
      setQTimeLeft(DS_SDGN_PREMIERE_QUESTION_SEC);
    },
    [finishExam, index, questions.length, sessionLeft],
  );

  const resolveAnswer = useCallback(
    (choiceIdx: number) => {
      if (answered || !current || forcedZeroRef.current) return;
      setAnswered(true);
      setPicked(choiceIdx);
      const ok = choiceIdx === current.ok;
      window.setTimeout(() => goNext(ok), 700);
    },
    [answered, current, goNext],
  );

  const onQuestionTimeout = useCallback(() => {
    if (answered || !current || forcedZeroRef.current) return;
    setAnswered(true);
    setSkipped((s) => s + 1);
    window.setTimeout(() => goNext(false), 400);
  }, [answered, current, goNext]);

  const startSdgnPremiere = () => {
    clearTimers();
    forcedZeroRef.current = false;
    finishedRef.current = false;
    setForcedZero(false);
    setCheatMsg("");
    setQuestions(buildDsSdgnPremiereDeck());
    setIndex(0);
    setScore(0);
    setSkipped(0);
    setAnswered(false);
    setPicked(null);
    setQTimeLeft(DS_SDGN_PREMIERE_QUESTION_SEC);
    setSessionLeft(DS_SDGN_PREMIERE_SESSION_SEC);
    setPhase("play");
    const uid = auth.currentUser?.uid;
    if (uid) {
      void markDsAttemptStarted(uid).catch((err) =>
        console.error("Marquage debut DS impossible", err),
      );
    }
  };

  useEffect(() => {
    if (phase !== "play" || forcedZero) return undefined;

    const onHidden = () => {
      if (document.hidden) disqualify("visibility");
    };
    const onBlur = () => disqualify("visibility");

    window.addEventListener("blur", onBlur);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("visibilitychange", onHidden);
    };
  }, [phase, forcedZero, disqualify]);

  useEffect(() => {
    return () => {
      if (phaseRef.current === "play" && !forcedZeroRef.current && !finishedRef.current) {
        forcedZeroRef.current = true;
        const uid = auth.currentUser?.uid;
        if (uid) {
          void persistDsForcedZero(uid).catch(() => undefined);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (phase !== "play" || forcedZero) return;
    qTimerRef.current = setInterval(() => {
      setQTimeLeft((t) => {
        if (t <= 1) {
          onQuestionTimeout();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    sessionTimerRef.current = setInterval(() => {
      setSessionLeft((t) => {
        if (t <= 1) {
          finishExam(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimers;
  }, [phase, index, forcedZero, clearTimers, finishExam, onQuestionTimeout]);

  const sessionMmSs = useMemo(() => {
    const m = Math.floor(sessionLeft / 60);
    const s = sessionLeft % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }, [sessionLeft]);

  const qPct = (qTimeLeft / DS_SDGN_PREMIERE_QUESTION_SEC) * 100;
  const diffLabel = current ? getDsSdgnPremiereDifficulte(current.sourceId) : undefined;

  if (phase === "hub") {
    return (
      <div className="min-h-screen bg-slate-950 text-white px-4 py-8 max-w-3xl mx-auto">
        <style>{DS_CSS}</style>
        <p className="text-amber-300 text-sm font-bold uppercase tracking-wide mb-2">
          {"Onglet temporaire \u2014 \u00e0 retirer plus tard"}
        </p>
        <h1 className="text-3xl font-black mb-2">{"DS \u2014 Contr\u00f4les"}</h1>
        <p className="text-slate-300 mb-6 leading-relaxed">
          {
            "QCM chronom\u00e9tr\u00e9 SDGN 1\u00e8re : banque Jeux, ordre al\u00e9atoire \u00e0 chaque \u00e9l\u00e8ve, r\u00e9ponses A\u2013D m\u00e9lang\u00e9es."
          }
        </p>

        <section className="rounded-2xl border border-red-900/60 bg-red-950/30 p-4 mb-6 text-red-200 text-sm">
          <p className="font-bold mb-1">{"R\u00e8gle anti-triche"}</p>
          <p>
            {
              "Changer d\u2019onglet, quitter la fen\u00eatre ou naviguer ailleurs dans l\u2019app pendant le DS = note 0 imm\u00e9diate."
            }
          </p>
        </section>

        <section className="rounded-2xl border border-slate-700 bg-slate-900/80 p-6 mb-6">
          <h2 className="text-xl font-bold text-sky-300 mb-2">{"SDGN \u2014 1\u00e8re"}</h2>
          <ul className="text-slate-300 text-sm space-y-1 mb-4 list-disc pl-5">
            <li>{`Dur\u00e9e session : ${DS_SDGN_PREMIERE_SESSION_SEC / 60} minutes`}</li>
            <li>{`${DS_SDGN_PREMIERE_QUESTION_SEC} secondes par question`}</li>
            <li>{`Banque : ${totalInBank} questions (dont ${difficileCount} pi\u00e8ges / difficiles)`}</li>
            <li>{`Jusqu\u2019\u00e0 ${targetFull} questions par session selon la banque`}</li>
          </ul>
          <button
            type="button"
            onClick={startSdgnPremiere}
            className="rounded-xl bg-sky-600 hover:bg-sky-500 px-6 py-3 font-bold text-white"
          >
            {"Lancer le QCM 1\u00e8re SDGN"}
          </button>
        </section>

        <section className="rounded-2xl border border-dashed border-slate-600 p-6 opacity-70">
          <h2 className="text-lg font-bold text-slate-400">{"Management \u2014 Terminale"}</h2>
          <p className="text-slate-500 text-sm mt-2">{"Bient\u00f4t disponible (m\u00eame format 50 min / 30 s)."}</p>
        </section>
      </div>
    );
  }

  if (phase === "end") {
    const total = questions.length;
    const displayScore = forcedZero ? 0 : score;
    const pct = total > 0 ? Math.round((displayScore / total) * 100) : 0;
    return (
      <div className="min-h-screen bg-slate-950 text-white px-4 py-10 max-w-2xl mx-auto text-center">
        <h2 className="text-2xl font-black mb-4">{"Fin du DS QCM"}</h2>
        {forcedZero && (
          <p className="text-red-400 font-bold mb-4 px-4">{cheatMsg || "DS disqualifi\u00e9 : note 0."}</p>
        )}
        <p className="text-slate-300 mb-6">{`${prenom}, voici ton r\u00e9sultat.`}</p>
        <p className={`text-5xl font-black mb-2 ${forcedZero ? "text-red-500" : "text-sky-400"}`}>
          {`${displayScore} / ${total}`}
        </p>
        {!forcedZero && <p className="text-lg text-slate-400 mb-2">{`${pct} % de bonnes r\u00e9ponses`}</p>}
        {!forcedZero && skipped > 0 && (
          <p className="text-amber-300 text-sm mb-6">{`${skipped} question(s) non r\u00e9pondues (temps \u00e9coul\u00e9)`}</p>
        )}
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
    <div className="min-h-screen bg-slate-950 text-white px-4 py-6 max-w-2xl mx-auto">
      <style>{DS_CSS}</style>
      {forcedZero && (
        <p className="text-red-400 text-sm font-bold mb-4 text-center">{cheatMsg}</p>
      )}
      <div className="flex justify-between items-center text-sm text-slate-400 mb-4">
        <span>{`Question ${index + 1} / ${questions.length}`}</span>
        <span>{`Session ${sessionMmSs}`}</span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 mb-1 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${qTimeLeft <= 8 ? "bg-red-500 ds-timer-urgent" : "bg-sky-500"}`}
          style={{ width: `${qPct}%` }}
        />
      </div>
      <p className="text-xs text-slate-500 mb-6">
        {`${qTimeLeft} s \u00b7 Ch. ${current.chapter} ${chLabel ?? ""}${diffLabel ? ` \u00b7 ${diffLabel}` : ""}`}
      </p>

      <h2 className="text-lg font-bold leading-snug mb-6">{current.q}</h2>

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

      <p className="text-center text-slate-500 text-xs mt-8">{`Score provisoire : ${score} bonne(s)`}</p>
    </div>
  );
}
