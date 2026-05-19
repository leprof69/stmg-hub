import { useEffect, useMemo, useRef, useState, type TouchEvent } from "react";
import { auth, db } from "../services/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import {
  FLASHCARDS,
  FLASHCARDS_DATA_VERSION,
  type FlashcardItem,
  type FlashcardProgramme,
} from "../data/flashcardsData";
import { formatJetons, formatJetonsDelta } from "../lib/jetons";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";

type Props = {
  profil: any;
  onXPGagne?: () => void;
};

const STORAGE_KEY = "flashcardsProgress";
const BONUS_STREAK_STEP = 5;
const BONUS_STREAK_JETONS = 15;

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
  const [isActionBusy, setIsActionBusy] = useState(false);
  const [cardEmoji, setCardEmoji] = useState("");
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
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
    await updateDoc(ref, {
      xp: (data.xp || 0) + xpGain,
      [STORAGE_KEY]: {
        version: FLASHCARDS_DATA_VERSION,
        validatedIds: nextValidated,
        updatedAt: Date.now(),
      },
    });
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
      let bonusXp = 0;
      if (nextSessionGood % BONUS_STREAK_STEP === 0) {
        bonusXp = BONUS_STREAK_JETONS;
      }
      const totalGain = current.xp + bonusXp;
      await persist(nextValidated, totalGain);
      setBanner(
        bonusXp > 0
          ? `${formatJetonsDelta(current.xp)} + ${formatJetons(bonusXp)} bonus serie !`
          : `${formatJetonsDelta(current.xp)} ? carte validee`
      );
      setCardEmoji("\u{1F929}\u2705");
      setTimeout(() => setCardEmoji(""), 850);
      setSessionGood(nextSessionGood);
      setLearnerAnswer("");
      setAnswerChecked(false);
      setAnswerAccepted(false);
      setPendingAutoAction(null);
      setTimeout(() => {
        setValidatedIds(nextValidated);
        setTransitioningCard(false);
      }, 520);
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
      setBanner("R?ponds d'abord puis clique sur ? V?rifier ma r?ponse ? pour voir la correction.");
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
    <div className="min-h-screen p-3" style={{ background: "#F1F5F9", fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif" }}>
      <div className="max-w-3xl mx-auto" style={{ display: "grid", gap: 12 }}>
        <section style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 16, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#0F172A", fontWeight: 800 }}>Flashcards</h1>
              <p style={{ margin: "4px 0 0", color: "#64748B", fontSize: 14 }}>
                {masteredCount} / {cards.length} cartes validees ? {remaining.length} restantes
              </p>
            </div>
            <button
              type="button"
              onClick={resetProgress}
              style={{ borderRadius: 8, border: "1px solid #E2E8F0", background: "#F8FAFC", color: "#64748B", padding: "6px 10px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Reinitialiser
            </button>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 14 }}>
            {(["tous", "management", "droit", "economie", "sciences_gestion", "gestion_finance", "mercatique", "ressources_humaines", "numerique_si"] as DeckCategory[]).map((cat) => {
              const active = category === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  style={{
                    borderRadius: 8,
                    border: active ? "1px solid #4F46E5" : "1px solid #E2E8F0",
                    background: active ? "#EEF2FF" : "#fff",
                    color: active ? "#4338CA" : "#475569",
                    padding: "6px 11px",
                    fontWeight: active ? 700 : 500,
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, fontSize: 13, color: "#64748B" }}>
              <span>Progression du pack</span>
              <span style={{ fontWeight: 700, color: "#334155" }}>{progressPct}%</span>
            </div>
            <div style={{ height: 8, borderRadius: 999, background: "#E2E8F0", overflow: "hidden" }}>
              <div
                style={{
                  width: `${progressPct}%`,
                  height: "100%",
                  borderRadius: 999,
                  background: "#4F46E5",
                  transition: "width 350ms ease",
                }}
              />
            </div>
          </div>
          {banner && <p style={{ marginTop: 10, color: "#0F766E", fontWeight: 700 }}>{banner}</p>}
        </section>

        {!current ? (
          <section style={{ background: "white", borderRadius: 20, border: "1px solid #DBEAFE", padding: 24, textAlign: "center", boxShadow: "0 10px 30px rgba(30, 41, 59, 0.06)" }}>
            <p style={{ fontSize: 28, margin: "0 0 8px" }}>Bravo !</p>
            <p style={{ margin: 0, color: "#475569" }}>Tu as valid? toutes les cartes du pack.</p>
          </section>
        ) : (
          <section style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: 14, boxShadow: "0 4px 20px rgba(15, 23, 42, 0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8, gap: 8, flexWrap: "wrap" }}>
              <p style={{ margin: 0, color: "#334155", fontWeight: 800 }}>{current.notion}</p>
              <span style={{ background: "#F8FAFC", color: "#334155", borderRadius: 999, padding: "4px 10px", fontWeight: 700, fontSize: 12, border: "1px solid #E2E8F0" }}>{formatJetonsDelta(current.xp)}</span>
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
                    border: "1px solid #E2E8F0",
                    borderRadius: 16,
                    padding: 22,
                    background: "#FFFFFF",
                    backfaceVisibility: "hidden",
                    display: "grid",
                    alignContent: "center",
                    boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
                  }}
                >
                  <p style={{ margin: "0 0 8px", color: "#334155", fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>
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
                    border: "1px solid #E2E8F0",
                    borderRadius: 16,
                    padding: 22,
                    background: "#F8FAFC",
                    transform: "rotateY(180deg)",
                    backfaceVisibility: "hidden",
                    display: "grid",
                    alignContent: "center",
                    boxShadow: "0 8px 24px rgba(30, 41, 59, 0.08)",
                  }}
                >
                  <p style={{ margin: "0 0 8px", color: "#334155", fontSize: 12, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase" }}>
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
