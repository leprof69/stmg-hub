import { useCallback, useEffect, useRef, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { formatJetonsDelta } from "../lib/jetons";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";
import { pickRandomGameQcm, type GameQuizQ } from "../lib/gameQcmPool";
import { SDGN_CHAPTER_LABELS } from "../data/sdgn/registry";

type Props = { profil: { prenom?: string }; onXPGagne?: () => void };

const E = {
  coin: "💰",
  star: "⭐",
  check: "✅",
  cross: "❌",
  phone: "📞",
  fifty: "50:50",
  stop: "🛑",
};

const TOTAL = 15;
const TIMER_SEC = 45;
const SAFE_AT = new Set([5, 10]);

/** Palier de jetons par bonne réponse (Q1..Q15). */
const LADDER = [5, 10, 20, 40, 80, 120, 180, 250, 350, 500, 700, 1000, 1500, 2500, 5000] as const;

type Phase = "menu" | "play" | "end";

function payoutOnStop(correct: number): number {
  if (correct <= 0) return 0;
  return LADDER[correct - 1];
}

function payoutOnFail(correctBefore: number): number {
  if (correctBefore >= 10) return LADDER[9];
  if (correctBefore >= 5) return LADDER[4];
  return 0;
}

function chapterHint(chapter: number): string {
  const label = SDGN_CHAPTER_LABELS[chapter as keyof typeof SDGN_CHAPTER_LABELS];
  return label ? `Piste : chapitre ${chapter} — ${label}` : `Piste : chapitre SDGN ${chapter}`;
}

const QVG_CSS = `
@keyframes qvgPulse{0%,100%{opacity:1}50%{opacity:.55}}
@keyframes qvgSlideUp{0%{opacity:0;transform:translateY(12px)}100%{opacity:1;transform:translateY(0)}}
@keyframes qvgGlow{0%,100%{box-shadow:0 0 20px rgba(251,191,36,.25)}50%{box-shadow:0 0 36px rgba(251,191,36,.5)}}
.qvg-ladder-active{animation:qvgGlow 1.8s ease-in-out infinite}
`;

export default function QuiVeutGagnerDesJetons({ profil, onXPGagne }: Props) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const [phase, setPhase] = useState<Phase>("menu");
  const [questions, setQuestions] = useState<GameQuizQ[]>([]);
  const [level, setLevel] = useState(0);
  const [usedFifty, setUsedFifty] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [hidden, setHidden] = useState<Set<number>>(new Set());
  const [hintText, setHintText] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SEC);
  const [endJetons, setEndJetons] = useState(0);
  const [endLabel, setEndLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [gainAffiche, setGainAffiche] = useState<string | null>(null);

  const timerRef = useRef<number | null>(null);
  const prenom = profil?.prenom || "toi";
  const current = questions[level] ?? null;

  const startGame = () => {
    setQuestions(pickRandomGameQcm(TOTAL));
    setLevel(0);
    setUsedFifty(false);
    setUsedHint(false);
    setHidden(new Set());
    setHintText(null);
    setAnswered(false);
    setTimeLeft(TIMER_SEC);
    setEndJetons(0);
    setEndLabel("");
    setGainAffiche(null);
    setPhase("play");
  };

  const finish = useCallback(
    (jetons: number, label: string) => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      setEndJetons(jetons);
      setEndLabel(label);
      setPhase("end");
      void creditJetons(jetons, label);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [xpRewardsSuspended],
  );

  const creditJetons = async (jetons: number, _label: string) => {
    const user = auth.currentUser;
    if (!user || jetons <= 0) return;
    if (xpRewardsSuspended) {
      setGainAffiche(PLATFORM_XP_BLOCKED_MESSAGE);
      return;
    }
    setBusy(true);
    try {
      const ref = doc(db, "users", user.uid);
      const added = await runTransaction(db, async (tx) => {
        const snap = await tx.get(ref);
        if (!snap.exists()) return 0;
        const data = snap.data() as Record<string, unknown>;
        const total = Math.max(0, Math.floor(jetons));
        tx.update(ref, { xp: Number(data.xp ?? 0) + total });
        return total;
      });
      if (added > 0) setGainAffiche(formatJetonsDelta(added));
      onXPGagne?.();
    } catch (e) {
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  const handleAnswer = useCallback(
    (choiceIdx: number) => {
      if (answered || !current) return;
      if (timerRef.current) window.clearInterval(timerRef.current);
      setAnswered(true);
      const correct = choiceIdx === current.ok;

      if (correct) {
        const next = level + 1;
        if (next >= TOTAL) {
          finish(LADDER[TOTAL - 1], "Jackpot ! 15 bonnes réponses");
          return;
        }
        setTimeout(() => {
          setLevel(next);
          setAnswered(false);
          setHidden(new Set());
          setHintText(null);
          setTimeLeft(TIMER_SEC);
        }, 1200);
      } else {
        const gain = payoutOnFail(level);
        finish(
          gain,
          gain > 0
            ? `Mauvaise réponse — palier sécurisé`
            : "Mauvaise réponse — 0 jeton",
        );
      }
    },
    [answered, current, level, finish],
  );

  const walkAway = () => {
    if (level <= 0) return;
    finish(payoutOnStop(level), "Tu t’arrêtes avec tes gains");
  };

  const useFifty = () => {
    if (usedFifty || answered || !current) return;
    const wrong = [0, 1, 2, 3].filter((i) => i !== current.ok);
    const keep = wrong.sort(() => Math.random() - 0.5).slice(0, 2);
    setHidden(new Set(keep));
    setUsedFifty(true);
  };

  const useHint = () => {
    if (usedHint || answered || !current) return;
    setHintText(chapterHint(current.chapter));
    setUsedHint(true);
  };

  useEffect(() => {
    if (phase !== "play" || answered || !current) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleAnswer(-1);
          return TIMER_SEC;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [phase, current, answered, handleAnswer]);

  if (phase === "menu") {
    return (
      <div
        className="relative min-h-screen overflow-x-hidden pb-28 text-slate-100"
        style={{
          background:
            "radial-gradient(ellipse 100% 55% at 50% 0%,rgba(30,58,138,0.45) 0%,transparent 60%),#050818",
        }}
      >
        <style>{QVG_CSS}</style>
        <div className="relative z-10 mx-auto max-w-lg px-4 pt-8 sm:pt-10">
          <header className="mb-8 text-center">
            <span className="mb-3 inline-block rounded-full border border-amber-400/35 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-200/90">
              Quiz SDGN
            </span>
            <h1
              className="text-3xl font-black tracking-tight sm:text-4xl"
              style={{
                background: "linear-gradient(135deg,#fde68a,#fbbf24,#f59e0b)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Qui veut gagner des jetons ?
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Salut <span className="font-semibold text-amber-300">{prenom}</span> ! 15 questions SDGN
              Missions, paliers de jetons, cases sécurisées à 5 et 10. {E.fifty}, indice
              chapitre, ou arrête-toi quand tu veux.
            </p>
          </header>

          <div
            className="mb-6 rounded-2xl border border-amber-400/25 p-4"
            style={{ background: "rgba(15,23,42,0.85)" }}
          >
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-amber-300/80">Paliers</p>
            <div className="flex flex-wrap justify-center gap-2 text-[11px] text-slate-400">
              {LADDER.map((j, i) => (
                <span
                  key={i}
                  className={`rounded-lg px-2 py-1 ${SAFE_AT.has(i + 1) ? "border border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "bg-white/5"}`}
                >
                  Q{i + 1}: {j}j
                </span>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={startGame}
            className="w-full rounded-2xl py-4 text-base font-black text-slate-950 transition active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
              boxShadow: "0 12px 40px -8px rgba(251,191,36,0.55)",
            }}
          >
            {E.coin} Commencer la partie
          </button>
        </div>
      </div>
    );
  }

  if (phase === "end") {
    const jackpot = endJetons >= LADDER[TOTAL - 1];
    return (
      <div
        className="relative min-h-screen pb-28 text-center text-slate-100"
        style={{ background: "radial-gradient(ellipse at 50% 0%,rgba(251,191,36,0.2),#050818)" }}
      >
        <style>{QVG_CSS}</style>
        <div className="mx-auto max-w-lg px-4 pt-16">
          <p className="text-6xl select-none">{jackpot ? "🏆" : E.coin}</p>
          <h2 className="mt-4 text-2xl font-black text-amber-300">{endLabel}</h2>
          <p className="mt-6 text-4xl font-black text-white">+{endJetons}</p>
          <p className="text-sm text-amber-200/80">jetons</p>
          {gainAffiche && (
            <p className="mt-4 text-sm font-semibold text-emerald-400">{gainAffiche}</p>
          )}
          <button
            type="button"
            disabled={busy}
            onClick={() => setPhase("menu")}
            className="mt-10 w-full rounded-2xl border border-white/15 bg-white/10 py-3 text-sm font-bold text-white hover:bg-white/15"
          >
            Rejouer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden pb-28 text-slate-100"
      style={{
        background:
          "radial-gradient(ellipse 80% 50% at 50% 0%,rgba(37,99,235,0.35) 0%,transparent 55%),#050818",
      }}
    >
      <style>{QVG_CSS}</style>
      <div className="relative z-10 mx-auto max-w-lg px-3 pt-4 sm:px-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-amber-300/90">
            Question {level + 1}/{TOTAL}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-black tabular-nums ${timeLeft <= 10 ? "bg-red-500/25 text-red-300" : "bg-white/10 text-slate-200"}`}
            style={timeLeft <= 10 ? { animation: "qvgPulse 0.8s ease infinite" } : undefined}
          >
            {timeLeft}s
          </span>
        </div>

        {hintText && (
          <p
            className="mb-3 rounded-xl border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-xs text-violet-200"
            style={{ animation: "qvgSlideUp 0.35s ease" }}
          >
            {E.phone} {hintText}
          </p>
        )}

        <div
          className="mb-4 rounded-2xl border border-amber-400/20 p-4 sm:p-5"
          style={{
            background:
              "radial-gradient(ellipse 100% 80% at 50% 0%,rgba(251,191,36,0.12),rgba(15,23,42,0.9))",
            animation: "qvgSlideUp 0.4s ease",
          }}
        >
          <p className="text-sm font-semibold leading-snug text-white sm:text-base">{current?.q}</p>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {([0, 1, 2, 3] as const).map((i) => {
            if (hidden.has(i)) {
              return (
                <div
                  key={i}
                  className="rounded-xl border border-white/5 bg-black/30 py-4 text-center text-xs text-slate-600"
                >
                  {"—"}
                </div>
              );
            }
            const labels = ["A", "B", "C", "D"] as const;
            const showResult = answered;
            const isOk = current?.ok === i;
            const isBad = answered && !isOk;
            let bg = "rgba(30,41,59,0.9)";
            let border = "rgba(255,255,255,0.1)";
            if (showResult && isOk) {
              bg = "rgba(34,197,94,0.25)";
              border = "rgba(74,222,128,0.5)";
            } else if (showResult && isBad) {
              bg = "rgba(239,68,68,0.15)";
              border = "rgba(248,113,113,0.35)";
            }
            return (
              <button
                key={i}
                type="button"
                disabled={answered}
                onClick={() => handleAnswer(i)}
                className="rounded-xl border py-3 px-3 text-left text-sm font-semibold transition active:scale-[0.98] disabled:pointer-events-none"
                style={{ background: bg, borderColor: border }}
              >
                <span className="mr-2 font-black text-amber-400">{labels[i]}.</span>
                {current?.choices[i]}
              </button>
            );
          })}
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          <button
            type="button"
            disabled={usedFifty || answered}
            onClick={useFifty}
            className="flex-1 min-w-[100px] rounded-xl border border-cyan-400/30 bg-cyan-500/10 py-2 text-xs font-bold text-cyan-200 disabled:opacity-40"
          >
            {E.fifty}
          </button>
          <button
            type="button"
            disabled={usedHint || answered}
            onClick={useHint}
            className="flex-1 min-w-[100px] rounded-xl border border-violet-400/30 bg-violet-500/10 py-2 text-xs font-bold text-violet-200 disabled:opacity-40"
          >
            {E.phone} Indice
          </button>
          {level > 0 && !answered && (
            <button
              type="button"
              onClick={walkAway}
              className="w-full rounded-xl border border-amber-400/40 bg-amber-500/15 py-2 text-xs font-bold text-amber-200 sm:w-auto sm:flex-1"
            >
              {E.stop} Arrêter ({payoutOnStop(level)} jetons)
            </button>
          )}
        </div>

        <div
          className="rounded-2xl border border-white/10 p-3"
          style={{ background: "rgba(0,0,0,0.35)" }}
        >
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Paliers jetons
          </p>
          <div className="flex max-h-48 flex-col-reverse gap-1 overflow-y-auto">
            {LADDER.map((j, i) => {
              const qNum = i + 1;
              const active = level === i && phase === "play";
              const done = level > i;
              const safe = SAFE_AT.has(qNum);
              return (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-xs ${
                    active ? "qvg-ladder-active border border-amber-400/50 bg-amber-500/20 font-bold text-amber-100" : done ? "bg-emerald-500/15 text-emerald-300" : "bg-white/5 text-slate-500"
                  }`}
                >
                  <span>
                    Q{qNum}
                    {safe ? " 🛡" : ""}
                  </span>
                  <span className="tabular-nums">{j} {E.coin}</span>
                </div>
              );
            })}
          </div>
          {level > 0 && (
            <p className="mt-2 text-center text-[11px] text-amber-300/90">
              Gains actuels si tu t’arrêtes : {payoutOnStop(level)} jetons
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
