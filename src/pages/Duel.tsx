import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { updateDoc, increment } from "firebase/firestore";
import { auth } from "../services/firebase";
import { userDocRef } from "../services/userProfileService";
import { getDuelSeasonDaysLeft, getDuelSeasonId, getDuelSeasonEndsAt } from "../services/duelSeason";
import {
  buildDuelPartieQuestions,
  compareDuelChallengerVsGhost,
  createDuelRun,
  DUEL_QUESTIONS_PAR_PARTIE,
  DUEL_TEMPS_TOTAL_SEC,
  fetchDuelRun,
  getAttemptIdsForPlayerOnRuns,
  hasPlayerAttemptedRun,
  listGhostRunsForSeason,
  saveDuelAttempt,
  type DuelQuestionFrozen,
  type DuelRunDoc,
} from "../services/duelService";
import { formatJetonsDelta } from "../lib/jetons";
import { formatSdgnMissionChaptersLabel } from "../lib/sdgnMissionQcmPool";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";

const MISSION_CHAPTERS_LABEL = formatSdgnMissionChaptersLabel();

/** Messages FR via \\uXXXX pour eviter les soucis d'encodage Windows sur les chaines accentuees. */
function messageErreurFirestore(e: unknown, contexte: "publier" | "liste" | "defi"): string {
  const o = e as { code?: string; message?: string };
  const code = o?.code ?? "";
  const msg = String(o?.message ?? "");
  if (code === "permission-denied") {
    if (contexte === "publier") {
      return import.meta.env.DEV
        ? "Permission refus\u00E9e (Firestore). En local, d\u00E9ploie les r\u00E8gles \u00E0 jour : firebase deploy --only firestore:rules \u2014 ou v\u00E9rifie que la partie comporte bien 8 questions c\u00F4t\u00E9 r\u00E8gles."
        : "Le serveur a refus\u00E9 l\u2019enregistrement (souvent : r\u00E8gles Firebase pas \u00E0 jour sur le projet). Demande \u00E0 la personne qui g\u00E8re le site de lancer \u00AB firebase deploy --only firestore:rules \u00BB depuis le dossier du projet, puis r\u00E9essaie. Sinon, v\u00E9rifie ta connexion Internet.";
    }
    if (contexte === "liste") {
      return import.meta.env.DEV
        ? "Lecture refus\u00E9e ou r\u00E8gles / index manquants. V\u00E9rifie firestore.rules et les index composites duelRuns / duelAttempts."
        : "Impossible de charger les d\u00E9fis pour le moment.";
    }
    return "Action refus\u00E9e par le serveur. R\u00E9essaie plus tard.";
  }
  if (code === "failed-precondition" || /index/i.test(msg)) {
    return import.meta.env.DEV
      ? "Index Firestore manquant : ouvre le lien dans la console du navigateur ou d\u00E9ploie firestore.indexes.json."
      : "Service temporairement indisponible. R\u00E9essaie dans quelques minutes.";
  }
  if (contexte === "publier")
    return "Impossible d\u2019enregistrer le fant\u00F4me pour le moment. R\u00E9essaie plus tard.";
  if (contexte === "liste") return "Impossible de charger la liste des fant\u00F4mes.";
  return "Enregistrement impossible pour le moment.";
}

function countDuelQuestions(run: Pick<DuelRunDoc, "questions">): number {
  const n = Array.isArray(run.questions) ? run.questions.length : 0;
  return n > 0 ? n : DUEL_QUESTIONS_PAR_PARTIE;
}

/** Pression 0 = debut de partie, 1 = chrono ecoule (pour fond + barre). */
function duelChronoProgress(phase: Phase, deadlineMs: number | null, nowTick: number): number {
  const playing = phase === "init-play" || phase === "ghost-play";
  if (!playing || !deadlineMs) return 0;
  const total = DUEL_TEMPS_TOTAL_SEC * 1000;
  const left = Math.max(0, deadlineMs - nowTick);
  return Math.min(1, Math.max(0, 1 - left / total));
}

function duelShellStyle(phase: Phase, deadlineMs: number | null, nowTick: number): CSSProperties {
  const playing = phase === "init-play" || phase === "ghost-play";
  if (!playing || !deadlineMs) {
    return {
      backgroundColor: "#FFFC00",
      transition: "background-color 0.55s ease, background 0.55s ease",
    };
  }
  const p = duelChronoProgress(phase, deadlineMs, nowTick);
  const eased = Math.pow(p, 0.9);
  const h = 54 * (1 - eased);
  const s = 96;
  const l = 56 - 20 * eased;
  const top = `hsl(${h}, ${s}%, ${l}%)`;
  const hMid = Math.max(0, h - 6);
  const mid = `hsl(${hMid}, ${s}%, ${l - 5}%)`;
  const hBot = Math.max(0, h - 14);
  const bot = `hsl(${hBot}, ${Math.min(100, s + 2)}%, ${l - 14}%)`;
  return {
    background: `linear-gradient(188deg, ${top} 0%, ${mid} 42%, ${bot} 100%)`,
    transition: "background 0.4s ease-out",
  };
}

function DuelHourglassIcon({ urgent, critical }: { urgent: boolean; critical: boolean }) {
  const wrap =
    critical
      ? "duel-hourglass-wrap duel-hourglass-critical"
      : urgent
        ? "duel-hourglass-wrap duel-hourglass-urgent"
        : "duel-hourglass-wrap";
  return (
    <div className={wrap} aria-hidden>
      <svg width="40" height="40" viewBox="0 0 40 40" className="text-neutral-900 drop-shadow-sm">
        <path
          fill="currentColor"
          fillOpacity="0.12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
          d="M8 6h24v2l-8 12 8 12v2H8v-2l8-12-8-12V6z"
        />
        <path
          fill="currentColor"
          fillOpacity={critical ? 0.45 : urgent ? 0.32 : 0.2}
          className="duel-hourglass-sand"
          d="M12 10h16l-6 8 6 8H12l6-8-6-8z"
        />
      </svg>
    </div>
  );
}

type Phase =
  | "hub"
  | "init-brief"
  | "init-play"
  | "init-saving"
  | "init-publish-failed"
  | "init-done"
  | "ghost-loading"
  | "ghost-pick"
  | "ghost-brief"
  | "ghost-play"
  | "ghost-saving"
  | "ghost-done";

type ProfilLite = { id: string; prenom?: string };

type DuelProps = {
  profil: ProfilLite;
  onXPGagne?: () => void;
};

const XP_PUBLIER_FANTOME = 10;
const XP_DEFI_GAGNE = 24;
const XP_DEFI_NUL = 12;
const XP_DEFI_PERDU = 5;

function prenomAffiche(p: ProfilLite): string {
  const s = (p.prenom || "").trim();
  return s.length > 0 ? s : "Joueur";
}

export default function Duel({ profil, onXPGagne }: DuelProps) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const uid = auth.currentUser?.uid ?? profil.id;
  const prenom = prenomAffiche(profil);

  const seasonId = useMemo(() => getDuelSeasonId(), []);
  const joursRestants = useMemo(() => getDuelSeasonDaysLeft(), []);
  const finSaison = useMemo(() => getDuelSeasonEndsAt(), []);

  const [phase, setPhase] = useState<Phase>("hub");
  const [errMsg, setErrMsg] = useState<string | null>(null);

  const [questions, setQuestions] = useState<DuelQuestionFrozen[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [deadlineMs, setDeadlineMs] = useState<number | null>(null);
  const [nowTick, setNowTick] = useState(Date.now());
  const [finishedMeta, setFinishedMeta] = useState<{ correct: number; timeMs: number } | null>(null);

  const [activeRunId, setActiveRunId] = useState<string | null>(null);
  const [activeRun, setActiveRun] = useState<DuelRunDoc | null>(null);
  const [ghostRows, setGhostRows] = useState<{ id: string; data: DuelRunDoc }[]>([]);
  const [ghostOutcome, setGhostOutcome] = useState<"win" | "lose" | "draw" | null>(null);
  const [xpDelta, setXpDelta] = useState<number | null>(null);
  /** Jetons non crédités alors que le fantôme est en ligne (ex. erreur update profil). */
  const [publishWarn, setPublishWarn] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const flashClearRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const correctRef = useRef(0);
  const questionsSnapshotRef = useRef<DuelQuestionFrozen[]>([]);
  const expireHandledRef = useRef(false);

  const [edgeFlash, setEdgeFlash] = useState<{ kind: "ok" | "bad"; token: number } | null>(null);

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      if (flashClearRef.current) clearTimeout(flashClearRef.current);
    };
  }, []);

  correctRef.current = correctCount;
  questionsSnapshotRef.current = questions;

  const remainingSec = useMemo(() => {
    if (!deadlineMs) return DUEL_TEMPS_TOTAL_SEC;
    return Math.max(0, Math.ceil((deadlineMs - nowTick) / 1000));
  }, [deadlineMs, nowTick]);

  const finishPartie = useCallback(
    (finalCorrect: number, endMs: number) => {
      clearTimer();
      const start = startedAt ?? endMs;
      const timeMs = Math.max(1, endMs - start);
      setFinishedMeta({ correct: finalCorrect, timeMs });
      setDeadlineMs(null);
      return { correct: finalCorrect, timeMs };
    },
    [startedAt]
  );

  const persistInit = useCallback(
    async (meta: { correct: number; timeMs: number }, qs: DuelQuestionFrozen[]) => {
      setErrMsg(null);
      setPublishWarn(null);
      try {
        await createDuelRun({
          authorUid: uid,
          authorPrenom: prenom,
          questions: qs,
          ghostCorrect: meta.correct,
          ghostTimeMs: meta.timeMs,
        });
        if (!xpRewardsSuspended) {
          try {
            await updateDoc(userDocRef(uid), {
              xp: increment(XP_PUBLIER_FANTOME),
              duelSeasonPoints: increment(meta.correct * 2 + 1),
            });
            setXpDelta(XP_PUBLIER_FANTOME);
            onXPGagne?.();
          } catch (e2) {
            console.error(e2);
            setXpDelta(null);
            setPublishWarn(
              "Ton fantôme est bien enregistré sur le serveur, mais les jetons n’ont pas pu être ajoutés à ton profil (connexion ou droits). Tu peux quand même fermer cette fenêtre : un responsable pourra corriger plus tard."
            );
          }
        } else {
          setXpDelta(0);
          setPublishWarn(PLATFORM_XP_BLOCKED_MESSAGE);
        }
        setPhase("init-done");
      } catch (e) {
        console.error(e);
        setErrMsg(messageErreurFirestore(e, "publier"));
        setPhase("init-publish-failed");
      }
    },
    [uid, prenom, onXPGagne, xpRewardsSuspended]
  );

  const persistGhost = useCallback(
    async (meta: { correct: number; timeMs: number }) => {
      if (!activeRunId || !activeRun) {
        setPhase("hub");
        return;
      }
      setErrMsg(null);
      try {
        const already = await hasPlayerAttemptedRun(activeRunId, uid);
        if (already) {
          setErrMsg("Tu as déjà affronté ce fantôme.");
          setPhase("hub");
          return;
        }
        await saveDuelAttempt({
          runId: activeRunId,
          playerUid: uid,
          playerPrenom: prenom,
          seasonId: activeRun.seasonId,
          score: meta.correct,
          timeMs: meta.timeMs,
        });
        const cmp = compareDuelChallengerVsGhost(meta.correct, meta.timeMs, activeRun.ghostCorrect, activeRun.ghostTimeMs);
        setGhostOutcome(cmp);
        const ref = userDocRef(uid);
        let xp = XP_DEFI_PERDU;
        if (cmp === "win") xp = XP_DEFI_GAGNE;
        else if (cmp === "draw") xp = XP_DEFI_NUL;
        const patch: Record<string, unknown> = {
          duelSeasonPoints: increment(meta.correct * 3 + (cmp === "win" ? 8 : cmp === "draw" ? 4 : 0)),
        };
        if (!xpRewardsSuspended) {
          patch.xp = increment(xp);
        }
        if (cmp === "win") patch.duelGhostStreak = increment(1);
        else patch.duelGhostStreak = 0;
        await updateDoc(ref, patch);
        setXpDelta(xpRewardsSuspended ? 0 : xp);
        if (!xpRewardsSuspended) {
          onXPGagne?.();
        } else {
          setPublishWarn(PLATFORM_XP_BLOCKED_MESSAGE);
        }
        setPhase("ghost-done");
      } catch (e) {
        console.error(e);
        setErrMsg(messageErreurFirestore(e, "defi"));
        setPhase("ghost-pick");
      }
    },
    [activeRunId, activeRun, uid, prenom, onXPGagne, xpRewardsSuspended]
  );

  useEffect(() => {
    if (!deadlineMs || (phase !== "init-play" && phase !== "ghost-play")) {
      clearTimer();
      return;
    }
    expireHandledRef.current = false;
    timerRef.current = setInterval(() => {
      const now = Date.now();
      setNowTick(now);
      if (expireHandledRef.current || now < deadlineMs) return;
      expireHandledRef.current = true;
      const meta = finishPartie(correctRef.current, now);
      if (phase === "init-play") {
        setPhase("init-saving");
        void persistInit(meta, questionsSnapshotRef.current);
      } else {
        setPhase("ghost-saving");
        void persistGhost(meta);
      }
    }, 200);
    return clearTimer;
  }, [deadlineMs, phase, finishPartie, persistInit, persistGhost]);

  const startInitPlay = () => {
    setErrMsg(null);
    const qs = buildDuelPartieQuestions();
    setQuestions(qs);
    setQIndex(0);
    setCorrectCount(0);
    const t0 = Date.now();
    setStartedAt(t0);
    setDeadlineMs(t0 + DUEL_TEMPS_TOTAL_SEC * 1000);
    setFinishedMeta(null);
    setPublishWarn(null);
    setPhase("init-play");
  };

  const startGhostPlay = () => {
    if (!activeRun) return;
    setErrMsg(null);
    setQuestions(activeRun.questions);
    setQIndex(0);
    setCorrectCount(0);
    const t0 = Date.now();
    setStartedAt(t0);
    setDeadlineMs(t0 + DUEL_TEMPS_TOTAL_SEC * 1000);
    setFinishedMeta(null);
    setGhostOutcome(null);
    setPhase("ghost-play");
  };

  const onPick = (choice: 0 | 1 | 2 | 3) => {
    if (phase !== "init-play" && phase !== "ghost-play") return;
    if (!deadlineMs || Date.now() >= deadlineMs) return;
    const q = questions[qIndex];
    if (!q) return;
    const ok = choice === q.bonIndex;
    if (flashClearRef.current) clearTimeout(flashClearRef.current);
    setEdgeFlash({ kind: ok ? "ok" : "bad", token: Date.now() });
    flashClearRef.current = window.setTimeout(() => {
      setEdgeFlash(null);
      flashClearRef.current = null;
    }, 420);

    const nextCorrect = correctCount + (ok ? 1 : 0);
    if (qIndex + 1 >= questions.length) {
      expireHandledRef.current = true;
      const meta = finishPartie(nextCorrect, Date.now());
      if (phase === "init-play") {
        setPhase("init-saving");
        void persistInit(meta, questions);
      } else {
        setPhase("ghost-saving");
        void persistGhost(meta);
      }
      return;
    }
    setCorrectCount(nextCorrect);
    setQIndex((i) => i + 1);
  };

  const loadGhosts = async () => {
    setErrMsg(null);
    setPhase("ghost-loading");
    try {
      const rows = await listGhostRunsForSeason(seasonId, uid, 48);
      const ids = rows.map((r) => r.id);
      const done = await getAttemptIdsForPlayerOnRuns(uid, ids);
      const open = rows.filter((r) => !done.has(r.id));
      setGhostRows(open);
      setPhase("ghost-pick");
    } catch (e) {
      console.error(e);
      setErrMsg(messageErreurFirestore(e, "liste"));
      setPhase("hub");
    }
  };

  const selectGhost = async (id: string) => {
    setErrMsg(null);
    const run = await fetchDuelRun(id);
    if (!run) {
      setErrMsg("Ce fant\u00F4me n\u2019existe plus.");
      return;
    }
    setActiveRunId(id);
    setActiveRun(run);
    setPhase("ghost-brief");
  };

  const resetHub = () => {
    setPhase("hub");
    setErrMsg(null);
    setPublishWarn(null);
    setActiveRun(null);
    setActiveRunId(null);
    setGhostRows([]);
    setFinishedMeta(null);
    setXpDelta(null);
    setGhostOutcome(null);
  };

  const curQuestion = questions[qIndex];

  const isChronoPlay = phase === "init-play" || phase === "ghost-play";
  const pressure = duelChronoProgress(phase, deadlineMs, nowTick);
  const urgentChrono = remainingSec <= 12;
  const criticalChrono = remainingSec <= 6;
  /** Battement visible une fois par seconde quand il reste peu de temps. */
  const chronoHeartbeat = remainingSec <= 5 && remainingSec > 0;

  return (
    <>
      <style>{`
@keyframes duel-hourglass-flip {
  0% { transform: rotate(0deg); }
  45% { transform: rotate(0deg); }
  50% { transform: rotate(180deg); }
  95% { transform: rotate(180deg); }
  100% { transform: rotate(360deg); }
}
@keyframes duel-sand-pulse {
  0%, 100% { opacity: 0.28; transform: scaleY(1); }
  50% { opacity: 0.55; transform: scaleY(1.12); }
}
@keyframes duel-card-pulse {
  0%, 100% { box-shadow: 8px 8px 0 0 #000; }
  50% { box-shadow: 8px 8px 0 0 #b91c1c, 0 0 26px rgba(220, 38, 38, 0.22); }
}
.duel-hourglass-wrap svg {
  display: block;
  animation: duel-hourglass-flip 2.8s ease-in-out infinite;
  transform-origin: 50% 50%;
}
.duel-hourglass-urgent svg { animation-duration: 1.35s; }
.duel-hourglass-critical svg { animation-duration: 0.72s; }
.duel-hourglass-sand {
  transform-origin: 50% 50%;
  animation: duel-sand-pulse 0.85s ease-in-out infinite;
}
.duel-card-urgent { animation: duel-card-pulse 1.35s ease-in-out infinite; }
.duel-card-critical { animation: duel-card-pulse 0.62s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) {
  .duel-hourglass-wrap svg,
  .duel-hourglass-sand,
  .duel-card-urgent,
  .duel-card-critical,
  .duel-chrono-beat-once,
  .duel-edge-flash--ok,
  .duel-edge-flash--bad { animation: none !important; }
}
      `}</style>
      <div
        className="relative min-h-screen pb-16 text-neutral-900 transition-[background-color] duration-300"
        style={duelShellStyle(phase, deadlineMs, nowTick)}
      >
        {isChronoPlay && (
          <div
            className="pointer-events-none fixed inset-0 z-[1]"
            style={{
              background: `radial-gradient(ellipse 95% 75% at 50% 42%, transparent 48%, rgba(0,0,0,${0.05 + pressure * 0.28}) 100%)`,
              transition: "background 0.4s ease-out",
            }}
            aria-hidden
          />
        )}
        {edgeFlash && (
          <div
            key={edgeFlash.token}
            className={`pointer-events-none fixed inset-0 z-[40] motion-reduce:hidden ${
              edgeFlash.kind === "ok" ? "duel-edge-flash--ok" : "duel-edge-flash--bad"
            }`}
            aria-hidden
          />
        )}
        <div className="relative z-[2] mx-auto max-w-xl px-4 pb-12 pt-6 sm:px-6">
        <header className="mb-8 space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full border-2 border-black bg-white px-3 py-1 text-xs font-black uppercase tracking-wider text-neutral-800 shadow-sm">
              Mode 100 % asynchrone
            </span>
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              <span className="rounded-full bg-black px-3 py-1 text-[#FFFC00]">Saison {seasonId}</span>
              <span className="rounded-full bg-neutral-800 px-3 py-1 text-[#FFFC00]">~{joursRestants} j. restants</span>
              <span className="rounded-full border-2 border-black/15 bg-white/90 px-3 py-1 text-neutral-900">
                Fin {finSaison.toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}
              </span>
            </div>
          </div>

          <div>
            <h1 className="flex flex-wrap items-center gap-3 text-4xl font-black tracking-tight sm:text-5xl">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl border-4 border-black bg-[#FFFC00] text-3xl shadow-[4px_4px_0_0_#000]" aria-hidden>
                {"\uD83D\uDC7B"}
              </span>
              <span className="leading-none">{"Duel fant\u00F4mes"}</span>
            </h1>
            <p className="mt-3 max-w-2xl text-base font-semibold leading-snug text-neutral-900/90">
              {`Pas de partie en direct : tu publies un d\u00E9fi fig\u00E9, ou tu rejoues exactement le m\u00EAme QCM qu\u2019un camarade pour tenter de faire mieux.`}
            </p>
          </div>

          <section
            className="rounded-3xl border-4 border-black bg-white/95 p-5 shadow-[8px_8px_0_0_#000] sm:p-6"
            aria-labelledby="duel-how-title"
          >
            <h2 id="duel-how-title" className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              {"Comment \u00E7a marche"}
            </h2>
            <ol className="mt-4 space-y-3.5 text-sm font-medium leading-snug text-neutral-800 sm:text-[15px]">
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-[#FFFC00] text-sm font-black">
                  1
                </span>
                <span>
                  <strong>{"Publier"}</strong>
                  {` : un QCM de ${DUEL_QUESTIONS_PAR_PARTIE} questions (Sciences de gestion, ${MISSION_CHAPTERS_LABEL}), chrono global ${DUEL_TEMPS_TOTAL_SEC} s. \u00C0 la fin, ton score + ton temps deviennent un `}
                  <strong>{"fant\u00F4me"}</strong>
                  {` que d\u2019autres peuvent affronter.`}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-neutral-900 text-sm font-black text-[#FFFC00]">
                  2
                </span>
                <span>
                  <strong>{"Battre"}</strong>
                  {` : m\u00EAme \u00E9nonc\u00E9, m\u00EAme chrono. On compare d\u2019abord les `}
                  <strong>{"bonnes r\u00E9ponses"}</strong>
                  {` ; en cas d\u2019\u00E9galit\u00E9, le `}
                  <strong>{"temps"}</strong>
                  {` au chrono d\u00E9partage.`}
                </span>
              </li>
              <li className="flex gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-black bg-white text-sm font-black">
                  3
                </span>
                <span>
                  <strong>{"Jetons"}</strong>
                  {` : surtout en battant des fant\u00F4mes (victoire / nul / d\u00E9faite = r\u00E9compenses diff\u00E9rentes). Bonus publication : ${formatJetonsDelta(XP_PUBLIER_FANTOME)} une fois le fant\u00F4me enregistr\u00E9.`}
                </span>
              </li>
            </ol>
          </section>
        </header>

        {errMsg && phase !== "init-publish-failed" && (
          <div className="mb-6 flex gap-3 rounded-2xl border-2 border-red-600 bg-white px-4 py-3 shadow-[4px_4px_0_0_rgba(185,28,28,0.35)]">
            <span className="text-xl leading-none" aria-hidden>
              {"\u26A0\uFE0F"}
            </span>
            <p className="text-sm font-semibold leading-snug text-red-800">{errMsg}</p>
          </div>
        )}

        {phase === "hub" && (
          <div className="space-y-4">
            <p className="text-center text-xs font-black uppercase tracking-widest text-neutral-800/80">{"Choisis une action"}</p>
            <button
              type="button"
              onClick={() => {
                setPhase("init-brief");
              }}
              className="group w-full rounded-3xl border-4 border-black bg-white px-4 py-5 text-left shadow-[8px_8px_0_0_#000] transition-all hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[4px_4px_0_0_#000] sm:px-6 sm:py-6"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-black bg-[#FFFC00] text-2xl shadow-[3px_3px_0_0_#000] transition-transform group-hover:scale-105"
                  aria-hidden
                >
                  {"\uD83D\uDC7B"}
                </span>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-black px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-[#FFFC00]">
                      {"Publication"}
                    </span>
                    <span className="text-2xl font-black leading-tight sm:text-[1.65rem]">{"Cr\u00E9er un fant\u00F4me"}</span>
                  </div>
                  <ul className="space-y-1.5 text-sm font-medium leading-snug text-neutral-700">
                    <li className="flex gap-2">
                      <span className="font-black text-neutral-900">{"\u2022"}</span>
                      <span>{`${DUEL_QUESTIONS_PAR_PARTIE} questions \u00B7 chrono global ${DUEL_TEMPS_TOTAL_SEC} s`}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-black text-neutral-900">{"\u2022"}</span>
                      <span>{`Sciences de gestion (${MISSION_CHAPTERS_LABEL})`}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-black text-neutral-900">{"\u2022"}</span>
                      <span>{"Ton score et ton temps deviennent le d\u00E9fi des autres"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </button>
            <button
              type="button"
              onClick={() => void loadGhosts()}
              className="group w-full rounded-3xl border-4 border-black bg-neutral-900 px-4 py-5 text-left text-[#FFFC00] shadow-[8px_8px_0_0_#000] transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-[10px_10px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[4px_4px_0_0_#000] sm:px-6 sm:py-6"
            >
              <div className="flex items-start gap-4">
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#FFFC00] bg-[#FFFC00]/15 text-2xl"
                  aria-hidden
                >
                  {"\u2694\uFE0F"}
                </span>
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-[#FFFC00] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-black">
                      {"D\u00E9fi"}
                    </span>
                    <span className="text-2xl font-black leading-tight text-[#FFFC00] sm:text-[1.65rem]">{"Battre un fant\u00F4me"}</span>
                  </div>
                  <ul className="space-y-1.5 text-sm font-medium leading-snug text-[#FFFC00]/90">
                    <li className="flex gap-2">
                      <span className="font-black text-[#FFFC00]">{"\u2022"}</span>
                      <span>{"M\u00EAme QCM, m\u00EAme chrono que l\u2019\u00E9l\u00E8ve qui a publi\u00E9"}</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-black text-[#FFFC00]">{"\u2022"}</span>
                      <span>
                        {`Victoire ${formatJetonsDelta(XP_DEFI_GAGNE)} \u00B7 nul ${formatJetonsDelta(XP_DEFI_NUL)} \u00B7 d\u00E9faite ${formatJetonsDelta(XP_DEFI_PERDU)}`}
                      </span>
                    </li>
                    <li className="flex gap-2">
                      <span className="font-black text-[#FFFC00]">{"\u2022"}</span>
                      <span>{"Tu ne vois pas ton propre fant\u00F4me ici (un autre compte doit te d\u00E9fier)"}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </button>
          </div>
        )}

        {phase === "init-brief" && (
          <div className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
            <div className="border-b-4 border-black bg-[#FFFC00] px-5 py-4 sm:px-6">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-neutral-800/80">{"Avant la partie"}</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight">{"Check-list rapide"}</h2>
            </div>
            <ul className="space-y-3 px-5 py-5 text-sm font-medium leading-relaxed text-neutral-800 sm:px-6 sm:text-[15px]">
              <li className="flex gap-3 rounded-2xl border-2 border-black/10 bg-neutral-50/80 px-3 py-2.5">
                <span className="text-lg" aria-hidden>
                  {"\u23F1"}
                </span>
                <span>
                  {"Chrono global : "}
                  <strong>{`${DUEL_TEMPS_TOTAL_SEC} s`}</strong>
                  {" pour tout le QCM (anti-triche)."}
                </span>
              </li>
              <li className="flex gap-3 rounded-2xl border-2 border-black/10 bg-neutral-50/80 px-3 py-2.5">
                <span className="text-lg" aria-hidden>
                  {"\uD83D\uDC64"}
                </span>
                <span>
                  {`Ton pr\u00E9nom (`}
                  <strong>{prenom}</strong>
                  {`) appara\u00EEt comme auteur du fant\u00F4me.`}
                </span>
              </li>
              <li className="flex gap-3 rounded-2xl border-2 border-black/10 bg-neutral-50/80 px-3 py-2.5">
                <span className="text-lg" aria-hidden>
                  {"\u2B50"}
                </span>
                <span>
                  {`Bonus publication : `}
                  <strong>{formatJetonsDelta(XP_PUBLIER_FANTOME)}</strong>
                  {` une fois le fant\u00F4me enregistr\u00E9 (en plus des jetons gagn\u00E9s en battant d'autres d\u00E9fis).`}
                </span>
              </li>
            </ul>
            <div className="flex flex-col gap-3 border-t-2 border-black/10 bg-neutral-50/50 px-5 py-4 sm:flex-row sm:px-6">
              <button
                type="button"
                onClick={resetHub}
                className="order-2 flex-1 rounded-2xl border-2 border-black bg-white py-3.5 text-base font-bold shadow-sm transition hover:bg-neutral-50 sm:order-1"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={startInitPlay}
                className="order-1 flex-1 rounded-2xl border-4 border-black bg-[#FFFC00] py-3.5 text-base font-black shadow-[4px_4px_0_0_#000] transition hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none sm:order-2"
              >
                {"C\u2019est parti"}
              </button>
            </div>
          </div>
        )}

        {(phase === "init-play" || phase === "ghost-play") && curQuestion && (
          <div
            className={`overflow-hidden rounded-3xl border-4 border-black bg-white/95 shadow-[8px_8px_0_0_#000] backdrop-blur-[1px] transition-shadow duration-300 ${
              criticalChrono ? "duel-card-critical" : urgentChrono ? "duel-card-urgent" : ""
            }`}
          >
            <div className="border-b-2 border-black/10 bg-neutral-900/5 px-4 py-3 sm:px-5">
              <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-neutral-600">
                <span>{"Temps \u00E9coul\u00E9"}</span>
                <span className="tabular-nums">{Math.round(pressure * 100)}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-black/10 ring-1 ring-black/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-500 to-red-600 motion-safe:transition-[width] motion-safe:duration-200 motion-safe:ease-linear"
                  style={{ width: `${pressure * 100}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="rounded-lg border-2 border-black bg-[#FFFC00] px-2.5 py-1 text-xs font-black uppercase text-neutral-900 shadow-sm">
                  {"Question "}
                  {qIndex + 1}/{questions.length}
                </span>
                <div className="flex items-center gap-2 rounded-xl border-2 border-black/15 bg-white/90 px-2 py-1">
                  <DuelHourglassIcon urgent={urgentChrono} critical={criticalChrono} />
                  <span
                    key={chronoHeartbeat ? remainingSec : "chrono"}
                    className={`min-w-[3.25rem] text-right text-lg font-black tabular-nums ${
                      chronoHeartbeat
                        ? "text-red-700 duel-chrono-beat-once"
                        : criticalChrono
                          ? "text-red-700 motion-safe:animate-pulse"
                          : urgentChrono
                            ? "text-red-600 motion-safe:animate-pulse"
                            : "text-neutral-900"
                    }`}
                  >
                    {remainingSec}s
                  </span>
                </div>
              </div>
            </div>
            <div className="px-4 py-4 sm:px-5 sm:py-5">
              <p className="mb-4 rounded-2xl border-2 border-black/10 bg-neutral-50 px-4 py-3 text-base font-bold leading-snug text-neutral-900 sm:text-[17px]">
                {curQuestion.question}
              </p>
              <p className="mb-2 text-xs font-black uppercase tracking-wider text-neutral-500">{"Choisis une r\u00E9ponse"}</p>
              <div className="grid gap-2.5">
                {curQuestion.choix.map((label, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => onPick(i as 0 | 1 | 2 | 3)}
                    className="flex w-full items-center gap-3 rounded-2xl border-2 border-black bg-[#FFFC00]/90 px-3 py-3.5 text-left text-sm font-bold shadow-sm transition-all duration-200 hover:bg-[#FFFC00] hover:shadow-[3px_3px_0_0_#000] active:scale-[0.99] motion-reduce:transition-none sm:py-4 sm:text-[15px]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-white text-sm font-black">
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="min-w-0 flex-1 leading-snug">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {(phase === "init-saving" || phase === "ghost-saving") && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border-4 border-dashed border-black/30 bg-white/90 px-8 py-12 text-center">
            <span className="text-4xl motion-safe:animate-pulse" aria-hidden>
              {"\u23F3"}
            </span>
            <p className="text-lg font-black text-neutral-900">{"Enregistrement\u2026"}</p>
            <p className="max-w-xs text-sm font-medium text-neutral-600">{"Quelques secondes, ne ferme pas l\u2019onglet."}</p>
          </div>
        )}

        {phase === "init-publish-failed" && finishedMeta && (
          <div className="overflow-hidden rounded-3xl border-4 border-red-600 bg-white shadow-[8px_8px_0_0_rgba(185,28,28,0.45)]">
            <div className="border-b-4 border-red-600 bg-red-50 px-5 py-5 text-center">
              <p className="text-xs font-black uppercase tracking-widest text-red-800/90">{"Probl\u00E8me serveur"}</p>
              <h2 className="mt-2 text-2xl font-black text-red-800">{"Impossible d\u2019enregistrer le fant\u00F4me"}</h2>
            </div>
            <div className="space-y-4 px-5 py-5">
              <div className="rounded-2xl border-2 border-black/10 bg-neutral-50 px-4 py-3 text-center">
                <p className="text-2xl font-black tabular-nums text-neutral-900">
                  {finishedMeta.correct}/{DUEL_QUESTIONS_PAR_PARTIE}{" "}
                  <span className="text-base font-bold text-neutral-600">{"bonnes \u00E9ponses"}</span>
                </p>
                <p className="mt-1 text-sm font-semibold text-neutral-700">
                  {`Temps : ${Math.round(finishedMeta.timeMs / 100) / 10}\u00A0s`}
                </p>
              </div>
              {errMsg && (
                <div className="rounded-2xl border-2 border-red-300 bg-red-50 px-4 py-3 text-sm font-medium leading-snug text-red-950">
                  {errMsg}
                </div>
              )}
              <p className="text-center text-xs font-medium leading-relaxed text-neutral-600">
                {`Ton score est affich\u00E9 ci-dessus : tu ne l\u2019as pas perdu. Si le message parle des \u00AB r\u00E8gles \u00BB Firebase, il faut mettre \u00E0 jour le site (commande d\u00E9ploiement c\u00F4t\u00E9 prof / d\u00E9veloppeur).`}
              </p>
              <div className="flex flex-col gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setPhase("init-saving");
                    void persistInit(finishedMeta, questions);
                  }}
                  disabled={questions.length !== DUEL_QUESTIONS_PAR_PARTIE}
                  className="w-full rounded-2xl border-4 border-black bg-[#FFFC00] py-3.5 text-base font-black shadow-[4px_4px_0_0_#000] transition disabled:opacity-50 hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {"R\u00E9essayer l\u2019enregistrement"}
                </button>
                <button
                  type="button"
                  onClick={resetHub}
                  className="w-full rounded-2xl border-2 border-black py-2.5 text-base font-bold"
                >
                  {"Retour au menu Duel"}
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "init-done" && finishedMeta && (
          <div className="overflow-hidden rounded-3xl border-4 border-black bg-white text-center shadow-[8px_8px_0_0_#000]">
            <div className="border-b-4 border-black bg-[#FFFC00] px-5 py-6">
              <div className="text-5xl leading-none" aria-hidden>
                {"\uD83D\uDC7B"}
              </div>
              <h2 className="mt-3 text-2xl font-black tracking-tight">{"Fant\u00F4me enregistr\u00E9"}</h2>
            </div>
            <div className="space-y-4 px-5 py-6">
              {publishWarn && (
                <div className="rounded-xl border-2 border-amber-600 bg-amber-50 px-3 py-2 text-left text-sm font-semibold text-amber-950 leading-snug">
                  {publishWarn}
                </div>
              )}
              <p className="text-lg font-bold text-neutral-900">
                {`${finishedMeta.correct}/${countDuelQuestions({ questions })} bonnes \u00E9ponses`}
              </p>
              <p className="text-sm font-semibold text-neutral-600">
                {`Temps : ${Math.round(finishedMeta.timeMs / 100) / 10}\u00A0s`}
              </p>
              {xpDelta != null && (
                <p className="text-xl font-black text-green-700">{formatJetonsDelta(xpDelta)}</p>
              )}
              <button
                type="button"
                onClick={resetHub}
                className="w-full rounded-2xl border-4 border-black bg-black py-3.5 text-base font-black text-[#FFFC00] shadow-[4px_4px_0_0_#404040] transition hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                OK
              </button>
            </div>
          </div>
        )}

        {phase === "ghost-loading" && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border-4 border-black bg-white px-8 py-12 text-center shadow-[8px_8px_0_0_#000]">
            <span className="text-4xl motion-safe:animate-bounce" aria-hidden>
              {"\uD83D\uDC7B"}
            </span>
            <p className="text-lg font-black">{"Chargement des fant\u00F4mes\u2026"}</p>
            <p className="text-sm font-medium text-neutral-600">{"R\u00E9cup\u00E9ration de la liste sur le serveur."}</p>
          </div>
        )}

        {phase === "ghost-pick" && (
          <div className="space-y-4">
            {ghostRows.length === 0 ? (
              <div className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
                <div className="border-b-4 border-black bg-neutral-100 px-5 py-4">
                  <p className="text-xs font-black uppercase tracking-widest text-neutral-600">{"Liste vide"}</p>
                  <p className="mt-1 text-xl font-black">{"Aucun fant\u00F4me pour l\u2019instant"}</p>
                </div>
                <div className="space-y-4 px-5 py-5">
                  <p className="text-sm font-medium leading-relaxed text-neutral-700">
                    {`Ici tu ne vois jamais ton propre d\u00E9fi : seuls les fant\u00F4mes des autres \u00E9l\u00E8ves apparaissent. Si la liste est vide, c\u2019est qu\u2019aucun autre camarade n\u2019a encore publi\u00E9 (ou que tu as d\u00E9j\u00E0 affront\u00E9 ceux propos\u00E9s). Tu peux inviter quelqu\u2019un \u00E0 se connecter avec son compte pour rejouer le tien.`}
                  </p>
                  <button
                    type="button"
                    onClick={() => setPhase("init-brief")}
                    className="w-full rounded-2xl border-4 border-black bg-black py-3.5 font-black text-[#FFFC00] shadow-[4px_4px_0_0_#000] transition active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                  >
                    {"Créer un fantôme"}
                  </button>
                  <button
                    type="button"
                    onClick={resetHub}
                    className="w-full rounded-2xl border-2 border-black py-2.5 text-base font-bold"
                  >
                    Retour
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="rounded-2xl border-2 border-black/15 bg-white/90 px-4 py-3 text-center shadow-sm">
                  <p className="text-xs font-black uppercase tracking-widest text-neutral-500">{"D\u00E9fis disponibles"}</p>
                  <p className="mt-1 text-sm font-semibold text-neutral-800">{"Tape sur une ligne pour voir le d\u00E9tail puis lancer la partie."}</p>
                </div>
                <ul className="space-y-2.5">
                  {ghostRows.map(({ id, data }) => (
                    <li key={id}>
                      <button
                        type="button"
                        onClick={() => void selectGhost(id)}
                        className="flex w-full items-center justify-between gap-3 rounded-2xl border-4 border-black bg-white px-4 py-4 text-left shadow-[5px_5px_0_0_#000] transition hover:-translate-y-0.5 hover:shadow-[7px_7px_0_0_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_3px_0_0_#000]"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#FFFC00] text-lg font-black text-neutral-900">
                            {(data.authorPrenom || "?").trim().charAt(0).toUpperCase()}
                          </span>
                          <span className="truncate font-black text-lg">{data.authorPrenom}</span>
                        </span>
                        <span className="shrink-0 rounded-lg border-2 border-black/10 bg-neutral-50 px-2.5 py-1 text-xs font-bold text-neutral-700">
                          {data.ghostCorrect}/{countDuelQuestions(data)}
                          {" \u00B7 "}
                          {Math.round(data.ghostTimeMs / 100) / 10}s
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={resetHub}
                  className="w-full rounded-2xl border-2 border-black py-2.5 text-base font-bold"
                >
                  Retour
                </button>
              </>
            )}
          </div>
        )}

        {phase === "ghost-brief" && activeRun && (
          <div className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
            <div className="border-b-4 border-black bg-neutral-900 px-5 py-5 text-[#FFFC00]">
              <p className="text-xs font-black uppercase tracking-widest text-[#FFFC00]/80">{"Prochain match"}</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Contre {activeRun.authorPrenom}</h2>
            </div>
            <div className="space-y-5 px-5 py-5">
              <div className="rounded-2xl border-2 border-black/10 bg-neutral-50 px-4 py-3 text-sm font-medium leading-relaxed text-neutral-800">
                <p>
                  {"Son fant\u00F4me : "}
                  <strong className="text-neutral-950">
                    {`${activeRun.ghostCorrect}/${countDuelQuestions(activeRun)} bonnes \u00E9ponses en ${Math.round(activeRun.ghostTimeMs / 100) / 10}\u00A0s`}
                  </strong>
                </p>
                <p className="mt-2 text-neutral-700">
                  {"Bats-le au score. \u00C0 \u00E9galit\u00E9, le plus rapide au chrono gagne."}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => setPhase("ghost-pick")}
                  className="flex-1 rounded-2xl border-2 border-black bg-white py-3.5 text-base font-bold transition hover:bg-neutral-50"
                >
                  {"Autre adversaire"}
                </button>
                <button
                  type="button"
                  onClick={startGhostPlay}
                  className="flex-1 rounded-2xl border-4 border-black bg-[#FFFC00] py-3.5 text-base font-black shadow-[4px_4px_0_0_#000] transition hover:brightness-105 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
                >
                  {"Lancer la partie"}
                </button>
              </div>
            </div>
          </div>
        )}

        {phase === "ghost-done" && finishedMeta && activeRun && (
          <div className="overflow-hidden rounded-3xl border-4 border-black bg-white shadow-[8px_8px_0_0_#000]">
            <div
              className={`border-b-4 border-black px-5 py-5 text-center ${
                ghostOutcome === "win"
                  ? "bg-emerald-400"
                  : ghostOutcome === "draw"
                    ? "bg-amber-300"
                    : "bg-rose-300"
              }`}
            >
              <h2 className="text-3xl font-black tracking-tight text-neutral-900">
                {ghostOutcome === "win" && "Victoire"}
                {ghostOutcome === "lose" && "D\u00E9faite"}
                {ghostOutcome === "draw" && "Match nul"}
              </h2>
              <p className="mt-1 text-sm font-bold text-neutral-900/80">{"R\u00E9sultat du duel"}</p>
            </div>
            <div className="space-y-4 px-5 py-6">
              <div className="grid grid-cols-2 gap-3 text-center text-sm">
                <div className="rounded-2xl border-2 border-black bg-white p-4 shadow-sm">
                  <div className="text-xs font-black uppercase tracking-wide text-neutral-500">Toi</div>
                  <div className="mt-1 text-2xl font-black tabular-nums">
                    {finishedMeta.correct}/{countDuelQuestions(activeRun)}
                  </div>
                  <div className="mt-1 text-xs font-bold text-neutral-600">{Math.round(finishedMeta.timeMs / 100) / 10}s</div>
                </div>
                <div className="rounded-2xl border-2 border-black bg-black p-4 text-[#FFFC00] shadow-sm">
                  <div className="text-xs font-black uppercase tracking-wide text-[#FFFC00]/80">{activeRun.authorPrenom}</div>
                  <div className="mt-1 text-2xl font-black tabular-nums">
                    {activeRun.ghostCorrect}/{countDuelQuestions(activeRun)}
                  </div>
                  <div className="mt-1 text-xs font-bold text-[#FFFC00]/85">{Math.round(activeRun.ghostTimeMs / 100) / 10}s</div>
                </div>
              </div>
              {xpDelta != null && (
                <p className="text-center text-xl font-black text-green-700">{formatJetonsDelta(xpDelta)}</p>
              )}
              <button
                type="button"
                onClick={resetHub}
                className="w-full rounded-2xl border-4 border-black bg-black py-3.5 text-base font-black text-[#FFFC00] shadow-[4px_4px_0_0_#404040] transition hover:brightness-110 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Terminer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
