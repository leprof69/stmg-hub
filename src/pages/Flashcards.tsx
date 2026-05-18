import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  FLASHCARDS,
  FLASHCARDS_DATA_VERSION,
  type FlashcardItem,
  type FlashcardProgramme,
} from "../data/flashcardsData";
import { formatJetons, formatJetonsDelta, motJetons } from "../lib/jetons";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";

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
  "Strat?giste Junior",
  "Pilote de Donn?es",
  "Ma?tre R?vision",
  "Boss du Bac",
];

const STOP_WORDS = new Set([
  "le", "la", "les", "de", "des", "du", "un", "une", "et", "ou", "pour", "par",
  "dans", "sur", "avec", "sans", "au", "aux", "a", "en", "est", "sont", "qui",
  "que", "quoi", "qu", "d", "l", "se", "ses", "son", "sa", "ce", "cet", "cette",
  "ces", "leur", "leurs", "on", "il", "elle", "ils", "elles", "ne", "pas",
]);

type DeckCategory = FlashcardProgramme | "tous";

const CATEGORY_LABELS: Record<DeckCategory, string> = {
  tous: "Toutes les mati?res",
  management: "Management",
  droit: "Droit",
  economie: "?conomie",
  sciences_gestion: "Sciences de Gestion",
  gestion_finance: "Gestion & Finance",
  mercatique: "Mercatique",
  ressources_humaines: "Ressources Humaines",
  numerique_si: "Num?rique & SI",
};

const CATEGORY_STYLES: Record<DeckCategory, { bg: string; border: string; text: string; glow: string }> = {
  tous:                { bg: "#F5F3FF", border: "#C4B5FD", text: "#6D28D9", glow: "rgba(139, 92, 246, 0.25)" },
  management:          { bg: "#EEF2FF", border: "#A5B4FC", text: "#3730A3", glow: "rgba(99, 102, 241, 0.25)" },
  droit:               { bg: "#FFF7ED", border: "#FCD34D", text: "#92400E", glow: "rgba(245, 158, 11, 0.25)" },
  economie:            { bg: "#DCFCE7", border: "#6EE7B7", text: "#065F46", glow: "rgba(16, 185, 129, 0.25)" },
  sciences_gestion:    { bg: "#ECFEFF", border: "#67E8F9", text: "#0F766E", glow: "rgba(6, 182, 212, 0.25)" },
  gestion_finance:     { bg: "#FFF1F2", border: "#FCA5A5", text: "#9F1239", glow: "rgba(239, 68, 68, 0.25)" },
  mercatique:          { bg: "#FDF4FF", border: "#E879F9", text: "#7E22CE", glow: "rgba(168, 85, 247, 0.25)" },
  ressources_humaines: { bg: "#FFF7ED", border: "#FB923C", text: "#C2410C", glow: "rgba(249, 115, 22, 0.25)" },
  numerique_si:        { bg: "#F0FDF4", border: "#86EFAC", text: "#166534", glow: "rgba(34, 197, 94, 0.25)" },
};

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

function normalizeAnswerText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(value: string): string[] {
  const normalized = normalizeAnswerText(value);
  if (!normalized) return [];
  return normalized
    .split(" ")
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function isLearnerAnswerAccepted(expected: string, learner: string): boolean {
  const normalizedExpected = normalizeAnswerText(expected);
  const normalizedLearner = normalizeAnswerText(learner);
  if (normalizedLearner.length < 3) return false;
  if (normalizedExpected === normalizedLearner) return true;
  if (normalizedLearner.length >= 10 && normalizedExpected.includes(normalizedLearner)) return true;
  if (normalizedExpected.length >= 10 && normalizedLearner.includes(normalizedExpected)) return true;

  const expectedKeywords = Array.from(new Set(extractKeywords(expected)));
  if (!expectedKeywords.length) return normalizedLearner.length >= Math.max(4, Math.floor(normalizedExpected.length * 0.5));
  const learnerSet = new Set(extractKeywords(learner));
  let matches = 0;
  expectedKeywords.forEach((token) => {
    if (learnerSet.has(token)) matches += 1;
  });
  const coverage = matches / expectedKeywords.length;
  return coverage >= 0.55 || (matches >= 3 && coverage >= 0.45);
}

export default function Flashcards({ profil, onXPGagne }: Props) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const [validatedIds, setValidatedIds] = useState<Record<string, true>>({});
  const [deck, setDeck] = useState<FlashcardItem[]>([]);
  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [banner, setBanner] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [sessionGood, setSessionGood] = useState(0);
  const [sessionRetry, setSessionRetry] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isActionBusy, setIsActionBusy] = useState(false);
  const [cardEmoji, setCardEmoji] = useState("");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [flashcardsTotalXp, setFlashcardsTotalXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [unlockedBadges, setUnlockedBadges] = useState<number[]>([]);
  const [justUnlockedBadge, setJustUnlockedBadge] = useState<number | null>(null);
  const [category, setCategory] = useState<DeckCategory>("tous");
  const [learnerAnswer, setLearnerAnswer] = useState("");
  const [answerChecked, setAnswerChecked] = useState(false);
  const [answerAccepted, setAnswerAccepted] = useState(false);
  const [transitioningCard, setTransitioningCard] = useState(false);
  const [pendingAutoAction, setPendingAutoAction] = useState<"mastered" | "retry" | null>(null);

  const cards = useMemo(() => {
    if (category === "tous") return [...FLASHCARDS];
    return FLASHCARDS.filter((c) => c.programme === category);
  }, [category]);
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
  const categoryStyle = CATEGORY_STYLES[category];

  useEffect(() => {
    setDeck(shuffleArray(remaining));
    setIndex(0);
    setShowAnswer(false);
    setLearnerAnswer("");
    setAnswerChecked(false);
    setAnswerAccepted(false);
  }, [remaining]);

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

  const handleMastered = async (force = false) => {
    if (!current || (!force && (isActionBusy || transitioningCard))) return;
    if (validatedIds[current.id]) return;
    if (xpRewardsSuspended) {
      setBanner(PLATFORM_XP_BLOCKED_MESSAGE);
      setIsActionBusy(false);
      setTransitioningCard(false);
      return;
    }
    setIsActionBusy(true);
    setTransitioningCard(true);
    const nextValidated = { ...validatedIds, [current.id]: true as const };
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
        setCardEmoji("Niveau +1");
        setBanner((prev) => `${prev}  Niveau ${nextLevel} atteint !`);
      }
      setBanner(
        bonusXp > 0
          ? `${formatJetonsDelta(current.xp)} + bonus ${formatJetons(bonusXp)} (x${currentMultiplier.toFixed(1)}) !`
          : `${formatJetonsDelta(current.xp)} ! Carte maitrisee`
      );
      setCardEmoji("\u{1F929}\u2705");
      setTimeout(() => setCardEmoji(""), 850);
      setSessionGood(nextSessionGood);
      setStreak((v) => v + 1);
      setLearnerAnswer("");
      setAnswerChecked(false);
      setAnswerAccepted(false);
      setPendingAutoAction(null);
      setTimeout(() => {
        setValidatedIds(nextValidated);
        setTransitioningCard(false);
      }, 520);
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
      setTransitioningCard(false);
    } finally {
      setIsActionBusy(false);
    }
  };

  const handleNotMastered = (force = false) => {
    if (!current || (!force && (isActionBusy || transitioningCard))) return;
    setDeck((prev) => {
      const rest = prev.filter((_, i) => i !== index);
      const insertAt = Math.min(rest.length, 2 + Math.floor(Math.random() * 4));
      const next = [...rest];
      next.splice(insertAt, 0, current);
      return next;
    });
    setIndex(0);
    setShowAnswer(false);
    setLearnerAnswer("");
    setAnswerChecked(false);
    setAnswerAccepted(false);
    setPendingAutoAction(null);
    setBanner("Carte remise dans la file");
    setCardEmoji("\u{1F622}\u{1F4DA}");
    setTimeout(() => setCardEmoji(""), 850);
    setTransitioningCard(false);
    setSessionRetry((v) => v + 1);
    setStreak(0);
  };

  const handleCheckAnswer = () => {
    if (!current || isActionBusy || transitioningCard) return;
    const accepted = isLearnerAnswerAccepted(current.reponse, learnerAnswer);
    setShowAnswer(true);
    setAnswerChecked(true);
    setAnswerAccepted(accepted);
    if (accepted) {
      setBanner("Bonne r?ponse : lis la correction puis clique sur Continuer.");
      setCardEmoji("\u2705");
      setPendingAutoAction("mastered");
    } else {
      setBanner("R?ponse insuffisante : lis la correction puis clique sur Continuer.");
      setCardEmoji("\u{1F914}");
      setPendingAutoAction("retry");
    }
  };

  const handleContinueAfterCorrection = () => {
    if (pendingAutoAction === "mastered") {
      void handleMastered(true);
      return;
    }
    if (pendingAutoAction === "retry") {
      handleNotMastered(true);
    }
  };

  const handleToggleCard = () => {
    if (!answerChecked) {
      setBanner("R?ponds d'abord puis clique sur 'V?rifier ma r?ponse' pour voir la correction.");
      setCardEmoji("\u270D\uFE0F");
      setTimeout(() => setCardEmoji(""), 850);
      return;
    }
    setShowAnswer((v) => !v);
  };

  const handleToggleCardRef = useRef(handleToggleCard);
  handleToggleCardRef.current = handleToggleCard;

  const resetProgress = async () => {
    const impacted = cards.map((c) => c.id);
    const nextValidated = { ...validatedIds };
    impacted.forEach((id) => delete nextValidated[id]);
    setValidatedIds(nextValidated);
    try {
      await persist(nextValidated, 0);
      setBanner("Progression du pack r?initialis?e.");
    } catch {
      setBanner("R?initialisation locale effectu?e.");
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
        handleToggleCardRef.current();
        return;
      }
      if (!showAnswer) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        setBanner("La validation est automatique apr?s v?rification de la r?ponse.");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [current, showAnswer]);

  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setTouchStartX(e.changedTouches[0]?.clientX ?? null);
  };

  const onTouchEnd = () => {
    if (touchStartX === null) return;
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
    <div className="min-h-screen p-3" style={{ background: "radial-gradient(circle at 15% 10%, #DBEAFE 0%, #EEF2FF 36%, #F8FAFC 100%)", fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      <div className="max-w-3xl mx-auto" style={{ display: "grid", gap: 12 }}>
        <section style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.96), rgba(240,249,255,0.94))", backdropFilter: "blur(10px)", borderRadius: 22, border: "1px solid #BFDBFE", padding: 16, boxShadow: "0 18px 45px rgba(30, 41, 59, 0.1)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, fontSize: "1.7rem", color: "#1E1B4B" }}>Flashcards Bac ? Entra?nement actif</h1>
            <button
              onClick={resetProgress}
              style={{ borderRadius: 10, border: "1px solid #FCA5A5", background: "#FFF1F2", color: "#9F1239", padding: "7px 11px", fontWeight: 700, cursor: "pointer" }}
            >
              R?initialiser le pack
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
            {(["tous", "management", "droit", "economie", "sciences_gestion", "gestion_finance", "mercatique", "ressources_humaines", "numerique_si"] as DeckCategory[]).map((cat) => {
              const active = category === cat;
              const stylePreset = CATEGORY_STYLES[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  style={{
                    borderRadius: 999,
                    border: active ? `1px solid ${stylePreset.border}` : "1px solid #CBD5E1",
                    background: active ? stylePreset.bg : "#F8FAFC",
                    color: active ? stylePreset.text : "#334155",
                    padding: "7px 12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: active ? `0 6px 16px ${stylePreset.glow}` : "none",
                    transition: "all 220ms ease",
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>

          <p style={{ color: categoryStyle.text, margin: "8px 0 10px", fontWeight: 600 }}>
            {remaining.length} restantes / {cards.length} ? jetons potentiels restants : {estimatedXpLeft} {motJetons(estimatedXpLeft)}
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
            <span style={{ background: "#DCFCE7", color: "#166534", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Ma?tris?es : {masteredCount}</span>
            <span style={{ background: "#FEF9C3", color: "#854D0E", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>S?rie : {streak}</span>
            <span style={{ background: "#F1F5F9", color: "#334155", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Session OK : {sessionGood}</span>
            <span style={{ background: "#FFF1F2", color: "#9F1239", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>? revoir : {sessionRetry}</span>
            <span style={{ background: "#EDE9FE", color: "#5B21B6", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Niveau: {level}</span>
            <span style={{ background: "#F5F3FF", color: "#6D28D9", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Coef: x{getMultiplierFromLevel(level).toFixed(1)}</span>
            <span style={{ background: "#ECFEFF", color: "#155E75", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Jetons flashcards : {flashcardsTotalXp}</span>
            <span style={{ background: "#FFF7ED", color: "#9A3412", borderRadius: 999, padding: "6px 10px", fontWeight: 700, fontSize: 13 }}>Rang: {levelTitle}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            <p style={{ margin: "0 0 6px", color: "#475569", fontSize: 13 }}>
              Prochain niveau dans {xpToNextLevel} {motJetons(xpToNextLevel)}
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
                  {unlocked ? "Badge d?bloqu?" : "Badge verrouill?"} ? {m} cartes
                </span>
              );
            })}
          </div>
          {banner && <p style={{ marginTop: 10, color: "#0F766E", fontWeight: 700 }}>{banner}</p>}
          {justUnlockedBadge && (
            <p style={{ marginTop: 8, color: "#92400E", fontWeight: 800 }}>
              Nouveau badge d?bloqu? : {justUnlockedBadge} cartes ma?tris?es !
            </p>
          )}
        </section>

        {!current ? (
          <section style={{ background: "white", borderRadius: 20, border: "1px solid #DBEAFE", padding: 24, textAlign: "center", boxShadow: "0 10px 30px rgba(30, 41, 59, 0.06)" }}>
            <p style={{ fontSize: 28, margin: "0 0 8px" }}>Bravo !</p>
            <p style={{ margin: 0, color: "#475569" }}>Tu as valid? toutes les cartes du pack.</p>
          </section>
        ) : (
          <section style={{ background: "linear-gradient(180deg, #FFFFFF 0%, #F8FAFC 100%)", borderRadius: 22, border: "1px solid #BFDBFE", padding: 14, boxShadow: "0 14px 34px rgba(30, 41, 59, 0.08)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
              <p style={{ margin: 0, color: categoryStyle.text, fontWeight: 800 }}>{current.notion}</p>
              <span style={{ background: categoryStyle.bg, color: categoryStyle.text, borderRadius: 999, padding: "4px 10px", fontWeight: 700, fontSize: 12, border: `1px solid ${categoryStyle.border}` }}>{formatJetonsDelta(current.xp)}</span>
            </div>
            <div
              onClick={handleToggleCard}
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              style={{
                minHeight: 240,
                perspective: 1200,
                cursor: "pointer",
                userSelect: "none",
                opacity: transitioningCard ? 0.62 : 1,
                transition: "opacity 260ms ease",
              }}
            >
              <div
                style={{
                  position: "relative",
                  minHeight: 240,
                  transformStyle: "preserve-3d",
                  transition: "transform 620ms cubic-bezier(0.2, 0.9, 0.2, 1)",
                  transform: showAnswer ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: `1px solid ${categoryStyle.border}`,
                    borderRadius: 16,
                    padding: 22,
                    background: `linear-gradient(180deg, #FFFFFF 0%, ${categoryStyle.bg} 100%)`,
                    backfaceVisibility: "hidden",
                    display: "grid",
                    alignContent: "center",
                    boxShadow: `0 8px 24px ${categoryStyle.glow}`,
                  }}
                >
                  <p style={{ margin: "0 0 8px", color: categoryStyle.text, fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>
                    Question
                  </p>
                  <p style={{ margin: 0, color: "#0F172A", lineHeight: 1.65, fontSize: "1.05rem", fontWeight: 700 }}>
                    {current.question}
                  </p>
                </div>
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    border: `1px solid ${categoryStyle.border}`,
                    borderRadius: 16,
                    padding: 22,
                    background: `linear-gradient(180deg, ${categoryStyle.bg} 0%, #E0F2FE 100%)`,
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    display: "grid",
                    alignContent: "center",
                    boxShadow: "0 8px 24px rgba(30, 41, 59, 0.08)",
                  }}
                >
                  <p style={{ margin: "0 0 8px", color: categoryStyle.text, fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>
                    Correction
                  </p>
                  <p style={{ margin: 0, color: "#1E293B", lineHeight: 1.65, fontSize: "1.02rem" }}>
                    {current.reponse}
                  </p>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 12, border: "1px solid #DBEAFE", background: "#F8FAFF", borderRadius: 14, padding: 12 }}>
              <label htmlFor="flashcards-answer" style={{ color: "#334155", fontWeight: 700, fontSize: 14 }}>
                Ta r?ponse (zone sous la carte) :
              </label>
              <textarea
                id="flashcards-answer"
                value={learnerAnswer}
                onChange={(e) => {
                  setLearnerAnswer(e.target.value);
                  setAnswerChecked(false);
                  setAnswerAccepted(false);
                  setPendingAutoAction(null);
                }}
                placeholder="?cris une d?finition courte avec les mots cl?s..."
                rows={3}
                disabled={pendingAutoAction !== null || isActionBusy || transitioningCard}
                style={{
                  marginTop: 8,
                  width: "100%",
                  borderRadius: 12,
                  border: "1px solid #CBD5E1",
                  padding: 12,
                  fontFamily: "inherit",
                  fontSize: 15,
                  resize: "vertical",
                  background: "#FFFFFF",
                  boxShadow: "inset 0 1px 2px rgba(15, 23, 42, 0.08)",
                }}
              />
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginTop: 8 }}>
                <button
                  onClick={handleCheckAnswer}
                  disabled={!learnerAnswer.trim() || isActionBusy || transitioningCard || pendingAutoAction !== null}
                  style={{
                    border: "none",
                    borderRadius: 10,
                    background: learnerAnswer.trim() && !isActionBusy && !transitioningCard && pendingAutoAction === null ? "#2563EB" : "#94A3B8",
                    color: "white",
                    padding: "8px 12px",
                    fontWeight: 700,
                    cursor: learnerAnswer.trim() && !isActionBusy && !transitioningCard && pendingAutoAction === null ? "pointer" : "not-allowed",
                  }}
                >
                  V?rifier ma r?ponse
                </button>
                {answerChecked && (
                  <span style={{ color: answerAccepted ? "#166534" : "#9F1239", fontWeight: 700 }}>
                    {answerAccepted ? "R?ponse accept?e : carte valid?e ? l'?tape suivante." : "R?ponse insuffisante : carte renvoy?e ? revoir ? l'?tape suivante."}
                  </span>
                )}
                {pendingAutoAction && (
                  <button
                    onClick={handleContinueAfterCorrection}
                    disabled={isActionBusy || transitioningCard}
                    style={{
                      border: "none",
                      borderRadius: 10,
                      background: "#0F766E",
                      color: "white",
                      padding: "8px 12px",
                      fontWeight: 700,
                      cursor: isActionBusy || transitioningCard ? "not-allowed" : "pointer",
                    }}
                  >
                    Continuer
                  </button>
                )}
              </div>
            </div>
            {cardEmoji && (
              <div style={{ marginTop: 10, textAlign: "center", fontSize: "1.5rem", fontWeight: 800, color: "#334155", animation: "popin 220ms ease-out" }}>
                {cardEmoji}
              </div>
            )}
            <p style={{ margin: "10px 0 0", color: "#64748B", fontSize: 13 }}>
              ?cris ta r?ponse puis clique sur ? V?rifier ma r?ponse ?. Tu vois la correction, puis ? Continuer ? applique la d?cision automatique.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}
