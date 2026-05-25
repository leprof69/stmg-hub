import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { formatJetonsDelta } from "../lib/jetons";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";
import type { MotMystereEntry } from "../data/motMystereBank";
import {
  getMotMystereQcm,
  jetonsMotMystere,
  motMystereAnswersMatch,
  motMystereChapterLabel,
  MOT_MYSTERE_WORDS_PER_SESSION,
  pickMotMystereRound,
} from "../lib/motMysterePool";

const E = {
  bulb: "\u{1F4A1}",
  mic: "\u{1F3A4}",
  check: "\u2705",
  cross: "\u274C",
  coin: "\u{1F4B0}",
  fire: "\u{1F525}",
  star: "\u2B50",
  next: "\u{1F680}",
};

type Props = { profil: { prenom?: string }; onXPGagne?: () => void };
type Phase = "menu" | "playing" | "summary";
type RoundResult = { term: string; ok: boolean; jetons: number; hintsUsed: number; qcm: boolean };

const MM_CSS = `
@keyframes mmIn { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:none; } }
@keyframes mmShake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-7px)} 40%,80%{transform:translateX(7px)} }
@keyframes mmPop { 0%{transform:scale(0.9);opacity:0} 50%{transform:scale(1.03);opacity:1} 100%{transform:scale(1);opacity:1} }
`;

/** Libell\u00e9s UI (cha\u00eenes JS pour \u00e9viter \\u00xx affich\u00e9 en clair dans le JSX). */
const MM_UI = {
  badge: "SDGN Premi\u00e8re \u00b7 chapitres 1 \u00e0 13",
  title: "Mot myst\u00e8re",
  intro: (prenom: string) =>
    `Salut ${prenom} ! Devine des termes du cours gr\u00e2ce \u00e0 des indices progressifs. Moins tu demandes d'indices, plus tu gagnes de jetons.`,
  rules: "R\u00e8gles",
  ruleQcm: "3 erreurs : question de cours SDGN \u00e0 4 choix (10 jetons max)",
  ruleJetons: "Jusqu'\u00e0 50 jetons si tu trouves d\u00e8s le premier indice",
  ruleHints: "1er indice gratuit, puis indices suivants (jetons r\u00e9duits)",
  placeholder: "Tape le mot myst\u00e8re\u2026",
  qcmHint: "Question de cours conseill\u00e9e",
  qcmHeader: (ch: number) => `Question SDGN \u00b7 ch. ${ch}`,
  bonneReponse: "Bonne r\u00e9ponse !",
  mauvaiseReponse: "Ce n'est pas la bonne r\u00e9ponse",
};

export default function MotMystere({ profil, onXPGagne }: Props) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const prenom = profil?.prenom || "toi";

  const [phase, setPhase] = useState<Phase>("menu");
  const [rounds, setRounds] = useState<MotMystereEntry[]>([]);
  const [roundIndex, setRoundIndex] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [mode, setMode] = useState<"type" | "qcm">("type");
  const [input, setInput] = useState("");
  const [wrongCount, setWrongCount] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [sessionJetons, setSessionJetons] = useState(0);
  const [history, setHistory] = useState<RoundResult[]>([]);
  const [busy, setBusy] = useState(false);
  const [gainFlash, setGainFlash] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = rounds[roundIndex] ?? null;
  const rescueQcm = useMemo(() => (current ? getMotMystereQcm(current) : null), [current]);

  const creditJetons = useCallback(
    async (amount: number) => {
      const user = auth.currentUser;
      if (!user || amount <= 0) return 0;
      if (xpRewardsSuspended) {
        setGainFlash(PLATFORM_XP_BLOCKED_MESSAGE);
        return 0;
      }
      setBusy(true);
      try {
        const ref = doc(db, "users", user.uid);
        const added = await runTransaction(db, async (tx) => {
          const snap = await tx.get(ref);
          if (!snap.exists()) return 0;
          const data = snap.data() as Record<string, unknown>;
          const xp = Number(data.xp ?? 0) + amount;
          tx.update(ref, { xp });
          return amount;
        });
        if (added > 0) {
          setGainFlash(formatJetonsDelta(added));
          onXPGagne?.();
        }
        return added;
      } catch (e) {
        console.error(e);
        return 0;
      } finally {
        setBusy(false);
      }
    },
    [onXPGagne, xpRewardsSuspended],
  );

  const resetRoundState = useCallback(() => {
    setHintLevel(0);
    setMode("type");
    setInput("");
    setWrongCount(0);
    setFeedback(null);
    setRevealed(false);
  }, []);

  const startSession = useCallback(() => {
    setRounds(pickMotMystereRound(MOT_MYSTERE_WORDS_PER_SESSION));
    setRoundIndex(0);
    setSessionJetons(0);
    setHistory([]);
    setGainFlash(null);
    resetRoundState();
    setPhase("playing");
  }, [resetRoundState]);

  useEffect(() => {
    if (phase === "playing" && mode === "type") inputRef.current?.focus();
  }, [phase, roundIndex, mode]);

  const goNextWord = useCallback(() => {
    if (roundIndex + 1 >= MOT_MYSTERE_WORDS_PER_SESSION) {
      setPhase("summary");
      return;
    }
    setRoundIndex((i) => i + 1);
    resetRoundState();
  }, [roundIndex, resetRoundState]);

  const finishRound = useCallback(
    async (ok: boolean, jetons: number, hintsUsed: number, qcm: boolean) => {
      if (!current) return;
      if (ok && jetons > 0) {
        const added = await creditJetons(jetons);
        setSessionJetons((s) => s + added);
      }
      setHistory((h) => [
        ...h,
        { term: current.term, ok, jetons: ok ? jetons : 0, hintsUsed, qcm },
      ]);
      setRevealed(true);
      setTimeout(() => goNextWord(), ok ? 1600 : 2200);
    },
    [current, creditJetons, goNextWord],
  );

  const onValidateType = useCallback(() => {
    if (!current || revealed || feedback) return;
    if (motMystereAnswersMatch(input, current)) {
      const j = jetonsMotMystere(hintLevel, false);
      setFeedback({ text: `${E.check} Bravo ! +${j} jetons`, ok: true });
      void finishRound(true, j, hintLevel, false);
      return;
    }
    const w = wrongCount + 1;
    setWrongCount(w);
    setFeedback({ text: `${E.cross} Pas tout a fait...`, ok: false });
    setTimeout(() => setFeedback(null), 700);
    if (w >= 3) setMode("qcm");
  }, [current, revealed, feedback, input, hintLevel, wrongCount, finishRound]);

  const onPickQcm = useCallback(
    (choiceIndex: 0 | 1 | 2 | 3) => {
      if (!current || !rescueQcm || revealed || feedback) return;
      const correct = choiceIndex === rescueQcm.ok;
      if (correct) {
        const j = jetonsMotMystere(hintLevel, true);
        setFeedback({ text: `${E.check} ${MM_UI.bonneReponse} +${j} jetons`, ok: true });
        void finishRound(true, j, hintLevel, true);
      } else {
        setFeedback({ text: `${E.cross} ${MM_UI.mauvaiseReponse}`, ok: false });
        setTimeout(() => {
          setFeedback(null);
          setRevealed(true);
          void finishRound(false, 0, hintLevel, true);
        }, 900);
      }
    },
    [current, rescueQcm, revealed, feedback, hintLevel, finishRound],
  );

  const revealNextHint = useCallback(() => {
    if (!current) return;
    const max = current.hints.length - 1;
    setHintLevel((h) => Math.min(h + 1, max));
  }, [current]);

  const passToQcm = useCallback(() => {
    setMode("qcm");
    setFeedback(null);
  }, []);

  const maxHints = current ? current.hints.length - 1 : 0;
  const progressPct = ((roundIndex + (revealed ? 1 : 0)) / MOT_MYSTERE_WORDS_PER_SESSION) * 100;

  if (phase === "menu") {
    return (
      <div
        className="relative min-h-screen overflow-x-hidden pb-28 text-slate-100"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% 0%,rgba(139,92,246,0.28) 0%,transparent 55%),#0c0618",
        }}
      >
        <style>{MM_CSS}</style>
        <div className="relative z-10 mx-auto max-w-lg px-4 pt-8">
          <header className="mb-8 text-center" style={{ animation: "mmIn 0.45s both" }}>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-violet-400/30 bg-violet-400/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200/90">
              {MM_UI.badge}
            </span>
            <h1
              className="text-4xl font-black tracking-tight sm:text-5xl"
              style={{
                background: "linear-gradient(135deg,#c4b5fd,#a78bfa,#f0abfc,#fbbf24)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {E.mic} {MM_UI.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{MM_UI.intro(prenom)}</p>
          </header>

          <div
            className="mb-6 rounded-2xl border border-violet-500/25 bg-violet-950/40 p-5 text-sm text-slate-300"
            style={{ animation: "mmIn 0.5s 0.08s both" }}
          >
            <p className="mb-2 font-bold text-violet-200">
              {E.bulb} {MM_UI.rules}
            </p>
            <ul className="m-0 list-inside list-disc space-y-1.5 text-slate-400">
              <li>{MOT_MYSTERE_WORDS_PER_SESSION} mots par partie</li>
              <li>{MM_UI.ruleHints}</li>
              <li>{MM_UI.ruleQcm}</li>
              <li>{MM_UI.ruleJetons}</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={startSession}
            className="w-full rounded-2xl py-4 text-lg font-black text-slate-950"
            style={{
              background: "linear-gradient(135deg,#a78bfa,#ec4899)",
              boxShadow: "0 12px 40px -8px rgba(167,139,250,0.55)",
              animation: "mmIn 0.5s 0.15s both",
            }}
          >
            {E.next} Lancer une partie
          </button>
        </div>
      </div>
    );
  }

  if (phase === "summary") {
    const wins = history.filter((h) => h.ok).length;
    return (
      <div className="min-h-screen pb-28 px-4 pt-8 text-slate-100" style={{ background: "#0c0618" }}>
        <style>{MM_CSS}</style>
        <div className="mx-auto max-w-lg text-center" style={{ animation: "mmPop 0.4s both" }}>
          <div className="text-5xl mb-3">{wins >= 4 ? E.fire : wins >= 2 ? E.star : E.mic}</div>
          <h2 className="text-3xl font-black text-white">Partie terminee</h2>
          <p className="mt-2 text-slate-400">
            {wins}/{MOT_MYSTERE_WORDS_PER_SESSION} mots trouves
          </p>
          <p className="mt-4 text-2xl font-black text-amber-300">
            {E.coin} {sessionJetons} jetons gagnes
          </p>
          {gainFlash && <p className="mt-2 text-sm text-emerald-400">{gainFlash}</p>}

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left text-sm">
            {history.map((h, i) => (
              <div
                key={i}
                className="flex justify-between gap-2 border-b border-white/5 py-2 last:border-0"
              >
                <span className={h.ok ? "text-emerald-400" : "text-red-400"}>
                  {h.ok ? E.check : E.cross} {h.term}
                </span>
                <span className="text-slate-500 shrink-0">{h.ok ? `+${h.jetons}` : "0"}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={startSession}
            className="mt-6 w-full rounded-2xl py-4 font-black text-slate-950 disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#a78bfa,#818cf8)" }}
          >
            Rejouer
          </button>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-slate-400">
        Chargement...
      </div>
    );
  }

  const visibleHints = current.hints.slice(0, hintLevel + 1);
  const nextJetons = jetonsMotMystere(hintLevel, false);
  const afterHintJetons = jetonsMotMystere(Math.min(hintLevel + 1, maxHints), false);

  return (
    <div
      className="min-h-screen pb-24 text-slate-100"
      style={{
        background:
          "radial-gradient(ellipse 80% 40% at 50% 0%,rgba(124,58,237,0.2) 0%,transparent 50%),#0c0618",
      }}
    >
      <style>{MM_CSS}</style>

      <div className="sticky top-0 z-20 border-b border-white/8 bg-[#0c0618]/90 px-4 py-3 backdrop-blur-md">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-violet-300/80">
              Mot {roundIndex + 1}/{MOT_MYSTERE_WORDS_PER_SESSION}
            </p>
            <p className="text-xs text-slate-500">{motMystereChapterLabel(current.chapter)}</p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase text-slate-500">Session</p>
            <p className="font-black text-amber-300">{sessionJetons} {E.coin}</p>
          </div>
        </div>
        <div className="mx-auto mt-2 h-1.5 max-w-lg overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 to-pink-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-lg px-4 pt-6" style={{ animation: "mmIn 0.35s both" }}>
        <div className="mb-4 flex flex-wrap gap-2">
          {visibleHints.map((hint, i) => (
            <div
              key={i}
              className="w-full rounded-xl border border-violet-500/20 bg-violet-950/50 px-4 py-3 text-sm leading-relaxed text-slate-200"
              style={{ animation: "mmPop 0.35s both" }}
            >
              <span className="mr-2 font-black text-violet-400">#{i + 1}</span>
              {hint}
            </div>
          ))}
        </div>

        {!revealed && (
          <p className="mb-3 text-center text-xs text-slate-500">
            Gain possible : <span className="font-bold text-amber-300">+{nextJetons} jetons</span>
            {hintLevel < maxHints && mode === "type" ? (
              <span>
                {" "}
                (indice suivant : +{afterHintJetons})
              </span>
            ) : null}
          </p>
        )}

        {feedback && (
          <div
            className={`mb-4 rounded-xl px-4 py-3 text-center font-bold ${feedback.ok ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}
            style={!feedback.ok ? { animation: "mmShake 0.4s" } : undefined}
          >
            {feedback.text}
          </div>
        )}

        {revealed && (
          <div className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-4 text-center">
            <p className="text-xs uppercase tracking-wider text-amber-200/70">Le mot etait</p>
            <p className="mt-1 text-2xl font-black capitalize text-amber-100">{current.term}</p>
          </div>
        )}

        {!revealed && mode === "type" && (
          <>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onValidateType();
              }}
              placeholder={MM_UI.placeholder}
              autoComplete="off"
              className="mb-3 w-full rounded-2xl border border-white/15 bg-white/5 px-4 py-4 text-center text-lg font-semibold text-white outline-none placeholder:text-slate-600 focus:border-violet-400/50"
            />
            <button
              type="button"
              onClick={onValidateType}
              disabled={!!feedback || !input.trim()}
              className="mb-3 w-full rounded-2xl py-3.5 font-black text-slate-950 disabled:opacity-50"
              style={{ background: "linear-gradient(135deg,#a78bfa,#c084fc)" }}
            >
              Valider
            </button>
            <div className="flex flex-wrap gap-2">
              {hintLevel < maxHints && (
                <button
                  type="button"
                  onClick={revealNextHint}
                  disabled={!!feedback}
                  className="flex-1 min-w-[140px] rounded-xl border border-violet-500/30 bg-violet-500/10 py-2.5 text-sm font-bold text-violet-200"
                >
                  {E.bulb} Indice suivant
                </button>
              )}
              <button
                type="button"
                onClick={passToQcm}
                disabled={!!feedback}
                className="flex-1 min-w-[140px] rounded-xl border border-white/15 py-2.5 text-sm font-bold text-slate-300"
              >
                Question de cours
              </button>
            </div>
            {wrongCount > 0 && (
              <p className="mt-3 text-center text-xs text-red-300/90">
                Erreurs : {wrongCount}/3
                {wrongCount >= 3 ? `  ${MM_UI.qcmHint}` : ""}
              </p>
            )}
          </>
        )}

        {!revealed && mode === "qcm" && rescueQcm && (
          <div className="grid gap-2">
            <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-wider text-violet-300/80">
              {MM_UI.qcmHeader(rescueQcm.chapter)}
            </p>
            <p className="mb-2 rounded-xl border border-violet-500/25 bg-violet-950/40 px-4 py-3 text-sm leading-relaxed text-slate-100">
              {rescueQcm.q}
            </p>
            {rescueQcm.choices.map((label, i) => (
              <button
                key={i}
                type="button"
                disabled={!!feedback}
                onClick={() => onPickQcm(i as 0 | 1 | 2 | 3)}
                className="rounded-xl border border-white/12 bg-white/[0.06] px-4 py-3.5 text-left text-sm font-semibold text-slate-100 transition hover:bg-violet-500/15 disabled:opacity-50"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
