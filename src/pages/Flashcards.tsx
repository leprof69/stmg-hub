import { useEffect, useMemo, useState, type TouchEvent } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  FLASHCARDS,
  FLASHCARDS_DATA_VERSION,
} from "../data/flashcardsData";

type Props = {
  profil: any;
  onXPGagne?: () => void;
};

const STORAGE_KEY = "flashcardsProgress";
const LEVEL_STEP_XP = 250;
const BONUS_STREAK_STEP = 5;
const BADGE_MILESTONES = [10, 25, 50, 75, 100, 150, 200];

const LEVEL_TITLES = [
  "Recrue STMG",
  "Apprenti Analyste",
  "Strategiste Junior",
  "Pilote de Donnees",
  "Maitre Revision",
  "Boss du Bac",
];

function getLevelFromXp(totalXp: number) {
  return Math.max(1, Math.floor(totalXp / LEVEL_STEP_XP) + 1);
}

function getMultiplierFromLevel(level: number) {
  return 1 + (level - 1) * 0.1;
}

function getLevelTitle(level: number) {
  return LEVEL_TITLES[Math.min(LEVEL_TITLES.length - 1, Math.floor((level - 1) / 2))];
}

function getXpInCurrentLevel(totalXp: number) {
  return ((totalXp % LEVEL_STEP_XP) + LEVEL_STEP_XP) % LEVEL_STEP_XP;
}

function getXpToNextLevel(totalXp: number) {
  const inLevel = getXpInCurrentLevel(totalXp);
  return inLevel === 0 ? LEVEL_STEP_XP : LEVEL_STEP_XP - inLevel;
}

function computeUnlockedBadges(masteredCount: number): number[] {
  return BADGE_MILESTONES.filter((m) => masteredCount >= m);
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Flashcards({ profil, onXPGagne }: Props) {
  const [validatedIds, setValidatedIds] = useState<Record<string, true>>({});
  const [deck, setDeck] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [banner, setBanner] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sessionGood, setSessionGood] = useState(0);
  const [sessionRetry, setSessionRetry] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isActionBusy, setIsActionBusy] = useState(false);
  const [cardEmoji, setCardEmoji] = useState("");
  const [swipeHint, setSwipeHint] = useState("");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [flashcardsTotalXp, setFlashcardsTotalXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [unlockedBadges, setUnlockedBadges] = useState<number[]>([]);
  const [justUnlockedBadge, setJustUnlockedBadge] = useState<number | null>(null);

  const cards = useMemo(() => [...FLASHCARDS], []);
  const remaining = useMemo(
    () => cards.filter((c) => !validatedIds[c.id]),
    [cards, validatedIds]
  );
  const current = deck[index] || null;
  const masteredCount = cards.length - remaining.length;
  const progressPct = cards.length ? Math.round((masteredCount / cards.length) * 100) : 0;
  const estimatedXpLeft = remaining.reduce((sum, c) => sum + (Number(c.xp) || 0), 0);
  const levelTitle = getLevelTitle(level);
  const xpToNextLevel = getXpToNextLevel(flashcardsTotalXp);
  const levelProgressPct = Math.round((getXpInCurrentLevel(flashcardsTotalXp) / LEVEL_STEP_XP) * 100);

  useEffect(() => {
    setDeck(shuffleArray(remaining));
    setIndex(0);
    setShowAnswer(false);
  }, [remaining.length]);

  useEffect(() => {
    const load = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) {
          setLoading(false);
          return;
        }
        const data = snap.data();
        const stored = data?.[STORAGE_KEY];
        if (stored?.version === FLASHCARDS_DATA_VERSION && stored?.validatedIds) {
          setValidatedIds(stored.validatedIds);
          const storedTotalXp = Number(stored.totalXpEarned || 0);
          setFlashcardsTotalXp(storedTotalXp);
          setLevel(getLevelFromXp(storedTotalXp));
          setUnlockedBadges(Array.isArray(stored.badges) ? stored.badges : []);
        }
      } catch (err) {
        console.error("Chargement flashcards impossible", err);
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const persist = async (nextValidated: Record<string, true>, xpGain = 0) => {
    const user = auth.currentUser;
    if (!user) return;
    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const data = snap.data();
    const previousStored = data?.[STORAGE_KEY] || {};
    const nextTotalXp = Number(previousStored.totalXpEarned || 0) + xpGain;
    const nextMasteredCount = cards.length - (cards.filter((c) => !nextValidated[c.id]).length);
    const nextBadges = computeUnlockedBadges(nextMasteredCount);
    await updateDoc(ref, {
      xp: (data.xp || 0) + xpGain,
      [STORAGE_KEY]: {
        version: FLASHCARDS_DATA_VERSION,
        validatedIds: nextValidated,
        totalXpEarned: nextTotalXp,
        level: getLevelFromXp(nextTotalXp),
        badges: nextBadges,
        updatedAt: Date.now(),
      },
    });
    setFlashcardsTotalXp(nextTotalXp);
    setLevel(getLevelFromXp(nextTotalXp));
    setUnlockedBadges(nextBadges);
  };

  const handleMastered = async () => {
    if (!current || isActionBusy) return;
    if (validatedIds[current.id]) return;
    setIsActionBusy(true);
    const nextValidated = { ...validatedIds, [current.id]: true as const };
    setValidatedIds(nextValidated);
    try {
      const nextSessionGood = sessionGood + 1;
      const currentMultiplier = getMultiplierFromLevel(level);
      let bonusXp = 0;
      if (nextSessionGood % BONUS_STREAK_STEP === 0) {
        bonusXp = Math.round(15 * currentMultiplier);
      }
      const totalGain = current.xp + bonusXp;
      const previousLevel = level;
      await persist(nextValidated, totalGain);
      const projectedTotalXp = flashcardsTotalXp + totalGain;
      const nextLevel = getLevelFromXp(projectedTotalXp);
      if (nextLevel > previousLevel) {
        setCardEmoji("????");
        setBanner((prev) => `${prev}  Niveau ${nextLevel} atteint !`);
      }
      setBanner(
        bonusXp > 0
          ? `+${current.xp} XP + bonus ${bonusXp} XP (x${currentMultiplier.toFixed(1)}) !`
          : `+${current.xp} XP ! Carte maitrisee`
      );
      setCardEmoji("\u{1F929}\u2705");
      setTimeout(() => setCardEmoji(""), 850);
      setSessionGood(nextSessionGood);
      setStreak((v) => v + 1);
      const nextMastered = masteredCount + 1;
      const nextBadges = computeUnlockedBadges(nextMastered);
      const freshBadge = nextBadges.find((b) => !unlockedBadges.includes(b));
      if (freshBadge) {
        setJustUnlockedBadge(freshBadge);
        setTimeout(() => setJustUnlockedBadge(null), 1800);
      }
      if (onXPGagne) onXPGagne();
    } catch (err) {
      console.error("Validation flashcard impossible", err);
      setBanner("Validation impossible pour le moment.");
      setValidatedIds(validatedIds);
    } finally {
      setIsActionBusy(false);
    }
  };

  const handleNotMastered = () => {
    if (!current || isActionBusy) return;
    setDeck((prev) => {
      const rest = prev.filter((_, i) => i !== index);
      const insertAt = Math.min(rest.length, 2 + Math.floor(Math.random() * 4));
      const next = [...rest];
      next.splice(insertAt, 0, current);
      return next;
    });
    setIndex(0);
    setShowAnswer(false);
    setBanner("Carte remise dans la file");
    setCardEmoji("\u{1F622}\u{1F4DA}");
    setTimeout(() => setCardEmoji(""), 850);
    setSessionRetry((v) => v + 1);
    setStreak(0);
  };

  const resetProgress = async () => {
    const impacted = cards.map((c) => c.id);
    const nextValidated = { ...validatedIds };
    impacted.forEach((id) => delete nextValidated[id]);
    setValidatedIds(nextValidated);
    try {
      await persist(nextValidated, 0);
      setBanner("Progression du pack reinitialisee.");
    } catch {
      setBanner("Reinitialisation locale effectuee.");
    }
    setSessionGood(0);
    setSessionRetry(0);
    setStreak(0);
    setFlashcardsTotalXp(0);
    setLevel(1);
    setUnlockedBadges([]);
    setJustUnlockedBadge(null);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (!current) return;
      if (e.key === "Enter") {
        e.preventDefault();
        setShowAnswer((v) => !v);
        return;
      }
      if (!showAnswer) return;
      if (e.key.toLowerCase() === "m" || e.key === "ArrowRight") {
        e.preventDefault();
        void handleMastered();
      }
      if (e.key.toLowerCase() === "r" || e.key === "ArrowLeft") {
        e.preventDefault();
        handleNotMastered();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, showAnswer, isActionBusy, validatedIds]);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!showAnswer) return;
    setTouchStartX(e.changedTouches[0]?.clientX ?? null);
  };

  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    if (!showAnswer || touchStartX === null) return;
    const endX = e.changedTouches[0]?.clientX ?? touchStartX;
    const delta = endX - touchStartX;
    if (Math.abs(delta) < 60) {
      setSwipeHint("");
      setTouchStartX(null);
      return;
    }
    if (delta > 0) {
      setSwipeHint("\u{1F449} Maitrisee");
      void handleMastered();
    } else {
      setSwipeHint("\u{1F448} A revoir");
      handleNotMastered();
    }
    setTimeout(() => setSwipeHint(""), 700);
    setTouchStartX(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-6" style={{ display: "grid", placeItems: "center", background: "radial-gradient(circle at 20% 10%, #E0E7FF 0%, #F8FAFF 35%, #F1F5F9 100%)" }}>
        <div style={{ background: "white", borderRadius: 16, border: "1px solid #DBEAFE", padding: 18, boxShadow: "0 10px 30px rgba(30, 41, 59, 0.08)" }}>
          Chargement des flashcards...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4" style={{ background: "radial-gradient(circle at 20% 10%, #E0E7FF 0%, #F8FAFF 35%, #F1F5F9 100%)" }}>
      <div className="max-w-5xl mx-auto" style={{ display: "grid", gap: 14 }}>
        <section style={{ background: "rgba(255,255,255,0.92)", backdropFilter: "blur(10px)", borderRadius: 20, border: "1px solid #DBEAFE", padding: 16, boxShadow: "0 14px 34px rgba(30, 41, 59, 0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: "1.7rem", color: "#1E1B4B" }}>Flashcards Bac - Pack Unique</h1>
            <button
              onClick={resetProgress}
              style={{ borderRadius: 10, border: "1px solid #FCA5A5", background: "#FFF1F2", color: "#9F1239", padding: "7px 11px", fontWeight: 700, cursor: "pointer" }}
            >
              Reinitialiser le pack
            </button>
          </div>

          <p style={{ color: "#475569", margin: "8px 0 10px" }}>
            {remaining.length} restantes / {cards.length} - XP potentiel restant: {estimatedXpLeft}
          </p>

          <div style={{ height: 10, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
            <div
              style={{
                width: `${progressPct}%`,
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg, #22C55E, #0EA5E9, #8B5CF6)",
                transition: "width 350ms ease",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            <span style={{ background: "#EEF2FF", color: "#4338CA", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Progression: {progressPct}%</span>
            <span style={{ background: "#DCFCE7", color: "#166534", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Maitrisees: {masteredCount}</span>
            <span style={{ background: "#FEF9C3", color: "#854D0E", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Serie: {streak}</span>
            <span style={{ background: "#F1F5F9", color: "#334155", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Session OK: {sessionGood}</span>
            <span style={{ background: "#FFF1F2", color: "#9F1239", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Session a revoir: {sessionRetry}</span>
            <span style={{ background: "#EDE9FE", color: "#5B21B6", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Niveau: {level}</span>
            <span style={{ background: "#F5F3FF", color: "#6D28D9", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Coef: x{getMultiplierFromLevel(level).toFixed(1)}</span>
            <span style={{ background: "#ECFEFF", color: "#155E75", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>XP flashcards: {flashcardsTotalXp}</span>
            <span style={{ background: "#FFF7ED", color: "#9A3412", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Rang: {levelTitle}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <p style={{ margin: "0 0 6px", color: "#475569", fontSize: 13 }}>
              Prochain niveau dans {xpToNextLevel} XP
            </p>
            <div style={{ height: 8, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
              <div style={{ width: `${levelProgressPct}%`, height: "100%", borderRadius: 999, background: "linear-gradient(90deg, #8B5CF6, #06B6D4)", transition: "width 300ms ease" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 10 }}>
            {BADGE_MILESTONES.map((m) => {
              const unlocked = unlockedBadges.includes(m);
              return (
                <span
                  key={`badge-${m}`}
                  style={{
                    borderRadius: 999,
                    padding: "5px 9px",
                    fontWeight: 700,
                    fontSize: 12,
                    background: unlocked ? "#FEF3C7" : "#F1F5F9",
                    color: unlocked ? "#92400E" : "#64748B",
                    border: `1px solid ${unlocked ? "#F59E0B" : "#CBD5E1"}`,
                  }}
                >
                  {unlocked ? "??" : "??"} {m} cartes
                </span>
              );
            })}
          </div>
          {banner && <p style={{ marginTop: 10, color: "#0F766E", fontWeight: 700 }}>{banner}</p>}
          {justUnlockedBadge && (
            <p style={{ marginTop: 8, color: "#92400E", fontWeight: 800 }}>
              ?? Nouveau badge debloque: {justUnlockedBadge} cartes maitrisees !
            </p>
          )}
        </section>

        {!current ? (
          <section style={{ background: "white", borderRadius: 20, border: "1px solid #DBEAFE", padding: 24, textAlign: "center", boxShadow: "0 10px 30px rgba(30, 41, 59, 0.06)" }}>
            <p style={{ fontSize: 28, margin: "0 0 8px" }}>Bravo !</p>
            <p style={{ margin: 0, color: "#475569" }}>Tu as valide toutes les cartes du pack.</p>
          </section>
        ) : (
          <section style={{ background: "white", borderRadius: 20, border: "1px solid #DBEAFE", padding: 18, boxShadow: "0 12px 30px rgba(30, 41, 59, 0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
              <p style={{ margin: 0, color: "#6366F1", fontWeight: 800 }}>{current.notion}</p>
              <span style={{ background: "#DCFCE7", color: "#166534", borderRadius: 999, padding: "4px 10px", fontWeight: 700, fontSize: 12 }}>+{current.xp} XP</span>
            </div>
            <div
              onClick={() => setShowAnswer((v) => !v)}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={{
                minHeight: 240,
                perspective: 1200,
                cursor: "pointer",
                userSelect: "none",
              }}
            >
              <div
                style={{
                  position: "relative",
                  minHeight: 240,
                  transformStyle: "preserve-3d",
                  transition: "transform 520ms cubic-bezier(0.22, 1, 0.36, 1)",
                  transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: "1px solid #C7D2FE",
                    borderRadius: 16,
                    padding: 18,
                    background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)",
                    backfaceVisibility: "hidden",
                    display: "grid",
                    alignContent: "center",
                    boxShadow: "0 8px 24px rgba(30, 41, 59, 0.08)",
                  }}
                >
                  <p style={{ margin: 0, color: "#0F172A", lineHeight: 1.65, fontSize: "1.05rem", fontWeight: 700 }}>
                    {current.question}
                  </p>
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: "1px solid #BFDBFE",
                    borderRadius: 16,
                    padding: 18,
                    background: "linear-gradient(180deg, #EEF2FF 0%, #E0F2FE 100%)",
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    display: "grid",
                    alignContent: "center",
                    boxShadow: "0 8px 24px rgba(30, 41, 59, 0.08)",
                  }}
                >
                  <p style={{ margin: 0, color: "#1E293B", lineHeight: 1.65, fontSize: "1.02rem" }}>
                    {current.reponse}
                  </p>
                </div>
              </div>
            </div>
            {(cardEmoji || swipeHint) && (
              <div style={{ marginTop: 10, textAlign: "center", fontSize: "1.5rem", fontWeight: 800, color: "#334155", animation: "popin 220ms ease-out" }}>
                {cardEmoji || swipeHint}
              </div>
            )}
            <p style={{ margin: "10px 0 0", color: "#64748B", fontSize: 13 }}>
              Clique la carte ou appuie sur Entrer pour retourner. Raccourcis: M = maitrise, R = a revoir. Sur mobile: swipe droite = maitrise, swipe gauche = a revoir.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              <button
                onClick={() => void handleMastered()}
                disabled={!showAnswer || isActionBusy}
                style={{
                  border: "none",
                  borderRadius: 12,
                  background: showAnswer && !isActionBusy ? "linear-gradient(135deg, #22C55E, #16A34A)" : "#94A3B8",
                  color: "white",
                  padding: "10px 14px",
                  fontWeight: 800,
                  letterSpacing: 0.2,
                  cursor: showAnswer && !isActionBusy ? "pointer" : "not-allowed",
                  transition: "transform 150ms ease, box-shadow 150ms ease",
                  boxShadow: showAnswer && !isActionBusy ? "0 8px 18px rgba(34, 197, 94, 0.35)" : "none",
                }}
              >
                Je maitrise (+{current.xp} XP) [M]
              </button>
              <button
                onClick={handleNotMastered}
                disabled={!showAnswer || isActionBusy}
                style={{
                  border: "1px solid #FCA5A5",
                  borderRadius: 12,
                  background: showAnswer && !isActionBusy ? "#FFF1F2" : "#F8FAFC",
                  color: "#9F1239",
                  padding: "10px 14px",
                  fontWeight: 800,
                  cursor: showAnswer && !isActionBusy ? "pointer" : "not-allowed",
                  transition: "transform 150ms ease, box-shadow 150ms ease",
                }}
              >
                A revoir [R]
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
