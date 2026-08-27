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
  tous: "Toutes",
  management: "Management",
  droit: "Droit",
  économie: "Économie",
  sciences_gestion: "Sc. Gestion",
  gestion_finance: "Gestion Fin.",
  mercatique: "Mercatique",
  ressources_humaines: "RH",
  numérique_si: "Num & SI",
};

const CATEGORY_COLORS: Partial<Record<DeckCategory, string>> = {
  tous:              "#2563EB",
  management:        "#2563EB",
  droit:             "#0EA5E9",
  économie:          "#10B981",
  sciences_gestion:  "#06B6D4",
  gestion_finance:   "#10B981",
  mercatique:        "#F97316",
  ressources_humaines:"#F59E0B",
  numérique_si:      "#3B82F6",
};

const CSS = `
@keyframes fc-up   { from { opacity:0; transform:translateY(16px) } to { opacity:1; transform:translateY(0) } }
@keyframes fc-orb  { 0%,100%{opacity:.4} 50%{opacity:.75} }
@keyframes fc-pop  { 0%{transform:scale(1)} 50%{transform:scale(1.12)} 100%{transform:scale(1)} }
.fc-cat { transition:all .18s ease; cursor:pointer; }
.fc-cat:hover { opacity:.85; }
.fc-btn { transition:all .18s ease; }
.fc-btn:hover { opacity:.88; transform:translateY(-1px); }
`;

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
    .replace(/[̀-ͯ]/g, "")
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
  const activeCatColor = CATEGORY_COLORS[category] ?? "#2563EB";

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

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
      if (!user) { setLoading(false); return; }
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (!snap.exists()) { setLoading(false); return; }
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
      setCardEmoji("🤩✅");
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
    setCardEmoji("😢📚");
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
      setBanner("Bonne réponse : lis la correction puis clique sur Continuer.");
      setCardEmoji("✅");
      setPendingAutoAction("mastered");
    } else {
      setBanner("Réponse insuffisante : lis la correction puis clique sur Continuer.");
      setCardEmoji("🤔");
      setPendingAutoAction("retry");
    }
  };

  const handleContinueAfterCorrection = () => {
    if (pendingAutoAction === "mastered") { void handleMastered(true); return; }
    if (pendingAutoAction === "retry") { handleNotMastered(true); }
  };

  const handleToggleCard = () => {
    if (!answerChecked) {
      setBanner("Réponds d'abord puis clique sur « Vérifier ma réponse » pour voir la correction.");
      setCardEmoji("✍️");
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
      setBanner("Progression du pack réinitialisée.");
    } catch {
      setBanner("Réinitialisation locale effectuée.");
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
        setBanner("La validation est automatique après vérification de la réponse.");
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
      <div style={{ minHeight:"100vh", display:"grid", placeItems:"center" }}>
        <div style={{ background:"rgba(13,27,53,.8)", borderRadius:16, border:"1px solid rgba(30,53,96,.8)", padding:"18px 24px", color:"#94A3B8", fontFamily:"'Nunito',sans-serif", fontWeight:800 }}>
          ⏳ Chargement des flashcards...
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", padding:"28px 14px 52px", fontFamily:"'Nunito',system-ui,sans-serif", color:"#F1F5F9", position:"relative" }}>

      {/* Ambient orb */}
      <div style={{ position:"fixed", top:"8%", left:"50%", transform:"translateX(-50%)", width:"600px", height:"300px", background:`radial-gradient(ellipse, ${activeCatColor}14 0%, transparent 70%)`, pointerEvents:"none", zIndex:0, animation:"fc-orb 5s ease-in-out infinite", transition:"background .5s" }} />

      <div style={{ maxWidth:700, margin:"0 auto", display:"grid", gap:14, position:"relative", zIndex:1 }}>

        {/* ══ HEADER ══ */}
        <section style={{
          background:"linear-gradient(145deg,rgba(13,27,53,.97),rgba(7,16,35,.98))",
          borderRadius:24, border:"1px solid rgba(30,53,96,.8)", padding:"22px 20px 18px",
          backdropFilter:"blur(14px)",
          animation:"fc-up .5s ease both",
          boxShadow:`0 0 40px ${activeCatColor}14, 0 14px 40px rgba(0,0,0,.35)`,
        }}>
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:10, flexWrap:"wrap", marginBottom:16 }}>
            <div>
              <h1 style={{
                margin:"0 0 4px", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"2rem",
                background:`linear-gradient(135deg,#F1F5F9 30%,${activeCatColor})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                🧠 Flashcards
              </h1>
              <p style={{ margin:0, color:"#475569", fontSize:"0.82rem", fontWeight:700 }}>
                <span style={{ color:activeCatColor, fontWeight:900 }}>{masteredCount}</span> / {cards.length} validées · <span style={{ color:"#F59E0B" }}>{remaining.length}</span> restantes
              </p>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
              {cardEmoji && (
                <span style={{ fontSize:"1.5rem", animation:"fc-pop .4s ease" }}>{cardEmoji}</span>
              )}
              <button type="button" onClick={resetProgress}
                style={{ borderRadius:12, border:"1px solid rgba(30,53,96,.75)", background:"rgba(30,53,96,.35)", color:"#64748B", padding:"7px 14px", fontWeight:800, fontSize:"0.82rem", cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all .18s" }}>
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div style={{ display:"flex", gap:"6px", flexWrap:"wrap", marginBottom:16 }}>
            {(["tous","management","droit","économie","sciences_gestion","gestion_finance","mercatique","ressources_humaines","numérique_si"] as DeckCategory[]).map((cat) => {
              const active = category === cat;
              const catColor = CATEGORY_COLORS[cat] ?? "#2563EB";
              return (
                <button key={cat} type="button" className="fc-cat" onClick={() => setCategory(cat)}
                  style={{
                    borderRadius:10,
                    border: active ? `1.5px solid ${catColor}65` : "1px solid rgba(30,53,96,.7)",
                    background: active ? `${catColor}1E` : "rgba(13,27,53,.5)",
                    color: active ? catColor : "#64748B",
                    padding:"6px 12px", fontWeight: active ? 800 : 700, fontSize:"0.78rem",
                    fontFamily:"'Nunito',sans-serif",
                    boxShadow: active ? `0 0 12px ${catColor}25` : "none",
                  }}>
                  {CATEGORY_LABELS[cat]}
                </button>
              );
            })}
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:7, fontSize:"0.72rem", fontWeight:700 }}>
              <span style={{ color:"#475569" }}>Progression</span>
              <span style={{ color:progressPct === 100 ? "#10B981" : activeCatColor }}>{progressPct}%</span>
            </div>
            <div style={{ height:12, borderRadius:999, background:"rgba(30,53,96,.55)", overflow:"hidden" }}>
              <div style={{ width:`${progressPct}%`, height:"100%", borderRadius:999, background:`linear-gradient(90deg,${activeCatColor},#10B981)`, transition:"width 500ms ease", boxShadow:"0 0 12px rgba(16,185,129,.4)" }} />
            </div>
          </div>

          {banner && (
            <p style={{ marginTop:12, color: banner.startsWith("❌") ? "#F87171" : "#10B981", fontWeight:800, fontSize:"0.88rem", margin:"12px 0 0" }}>
              {banner}
            </p>
          )}
        </section>

        {/* ══ CARTE ══ */}
        {!current ? (
          <section style={{
            background:"linear-gradient(135deg,rgba(16,185,129,.1),rgba(13,27,53,.85))",
            borderRadius:24, border:"1px solid rgba(16,185,129,.3)", padding:"40px 24px",
            textAlign:"center", backdropFilter:"blur(14px)",
            boxShadow:"0 0 40px rgba(16,185,129,.12)",
          }}>
            <p style={{ fontSize:"3rem", margin:"0 0 12px" }}>🎉</p>
            <h2 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.5rem", margin:"0 0 8px", background:"linear-gradient(135deg,#10B981,#06B6D4)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Pack terminé !
            </h2>
            <p style={{ margin:0, color:"#64748B", fontWeight:700, fontSize:"0.9rem" }}>Tu as validé toutes les cartes du pack. Bravo !</p>
          </section>
        ) : (
          <section style={{
            background:"rgba(13,27,53,.82)", borderRadius:22,
            border:`1px solid rgba(30,53,96,.8)`, padding:18,
            backdropFilter:"blur(14px)",
            animation:"fc-up .5s .06s ease both",
          }}>
            {/* Card info */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14, gap:8, flexWrap:"wrap" }}>
              <div>
                <p style={{ margin:0, color:activeCatColor, fontWeight:900, fontSize:"0.72rem", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:3 }}>
                  {CATEGORY_LABELS[current.programme] ?? current.programme}
                </p>
                <p style={{ margin:0, color:"#F1F5F9", fontWeight:900, fontSize:"1rem" }}>{current.notion}</p>
              </div>
              <span style={{ background:"rgba(245,158,11,.15)", color:"#F59E0B", borderRadius:999, padding:"4px 14px", fontWeight:900, fontSize:"0.78rem", border:"1px solid rgba(245,158,11,.3)", flexShrink:0 }}>
                {formatJetonsDelta(current.xp)}
              </span>
            </div>

            {/* Flip card */}
            <div onClick={handleToggleCard} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
              style={{ minHeight:220, perspective:1200, cursor:"pointer", userSelect:"none", opacity:transitioningCard?.62:1, transition:"opacity 260ms ease" }}>
              <div style={{ position:"relative", minHeight:220, transformStyle:"preserve-3d", transition:"transform 620ms cubic-bezier(0.2,0.9,0.2,1)", transform:showAnswer?"rotateY(180deg)":"rotateY(0deg)" }}>

                {/* Face QUESTION */}
                <div style={{
                  position:"absolute", inset:0,
                  border:`2px solid ${activeCatColor}35`, borderRadius:18, padding:"22px 24px",
                  background:"linear-gradient(145deg,rgba(7,16,35,.95),rgba(13,27,53,.92))",
                  backfaceVisibility:"hidden", display:"grid", alignContent:"center",
                  boxShadow:`0 0 30px ${activeCatColor}18, 0 8px 24px rgba(0,0,0,.35)`,
                }}>
                  <p style={{ margin:"0 0 12px", color:activeCatColor, fontSize:"0.7rem", fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase" }}>❓ Question</p>
                  <p style={{ margin:0, color:"#F1F5F9", lineHeight:1.7, fontSize:"1.05rem", fontWeight:700 }}>{current.question}</p>
                </div>

                {/* Face CORRECTION */}
                <div style={{
                  position:"absolute", inset:0,
                  border:"2px solid rgba(16,185,129,.38)", borderRadius:18, padding:"22px 24px",
                  background:"linear-gradient(145deg,rgba(7,16,35,.97),rgba(4,20,18,.95))",
                  transform:"rotateY(180deg)", backfaceVisibility:"hidden",
                  display:"grid", alignContent:"center",
                  boxShadow:"0 0 30px rgba(16,185,129,.18), 0 8px 24px rgba(0,0,0,.4)",
                }}>
                  <p style={{ margin:"0 0 12px", color:"#10B981", fontSize:"0.7rem", fontWeight:900, letterSpacing:"0.12em", textTransform:"uppercase" }}>✅ Correction</p>
                  <p style={{ margin:0, color:"#D1FAE5", lineHeight:1.7, fontSize:"1.02rem", fontWeight:700 }}>{current.reponse}</p>
                </div>
              </div>
            </div>

            {/* Answer zone */}
            <div style={{
              marginTop:16,
              border:`1px solid ${answerChecked ? (answerAccepted ? "rgba(16,185,129,.45)" : "rgba(248,113,113,.45)") : "rgba(37,99,235,.3)"}`,
              background:"rgba(4,13,28,.75)", borderRadius:16, padding:16,
              transition:"border-color .3s",
            }}>
              <label htmlFor="flashcards-answer" style={{ color:"#94A3B8", fontWeight:800, fontSize:"0.82rem", display:"block", marginBottom:8 }}>
                ✍️ Ta réponse :
              </label>
              <textarea id="flashcards-answer" value={learnerAnswer}
                onChange={(e) => { setLearnerAnswer(e.target.value); setAnswerChecked(false); setAnswerAccepted(false); setPendingAutoAction(null); }}
                placeholder="Écris une définition courte avec les mots clés..."
                rows={3}
                disabled={pendingAutoAction !== null || isActionBusy || transitioningCard}
                style={{
                  width:"100%", borderRadius:12, border:"1px solid rgba(30,53,96,.8)", padding:12,
                  fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:15, resize:"vertical",
                  background:"rgba(4,13,28,.85)", color:"#F1F5F9", outline:"none", boxSizing:"border-box",
                }}
              />
              <div style={{ display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginTop:12 }}>
                <button className="fc-btn" onClick={handleCheckAnswer}
                  disabled={!learnerAnswer.trim() || isActionBusy || transitioningCard || pendingAutoAction !== null}
                  style={{
                    border:"none", borderRadius:12,
                    background: learnerAnswer.trim() && !isActionBusy && !transitioningCard && pendingAutoAction === null
                      ? `linear-gradient(135deg,${activeCatColor},${activeCatColor}CC)`
                      : "rgba(30,53,96,.45)",
                    color:"white", padding:"10px 18px", fontWeight:900,
                    cursor: learnerAnswer.trim() && !isActionBusy && !transitioningCard && pendingAutoAction === null ? "pointer" : "not-allowed",
                    fontFamily:"'Nunito',sans-serif", fontSize:"0.88rem",
                    boxShadow: learnerAnswer.trim() && pendingAutoAction === null ? `0 4px 16px ${activeCatColor}40` : "none",
                  }}>
                  Vérifier ma réponse
                </button>

                {answerChecked && (
                  <span style={{ color: answerAccepted ? "#10B981" : "#F87171", fontWeight:900, fontSize:"0.88rem" }}>
                    {answerAccepted ? "✅ Réponse acceptée !" : "❌ Réponse insuffisante — à revoir."}
                  </span>
                )}

                {pendingAutoAction && (
                  <button className="fc-btn" onClick={handleContinueAfterCorrection} disabled={isActionBusy || transitioningCard}
                    style={{ border:"none", borderRadius:12, background:"linear-gradient(135deg,#10B981,#06B6D4)", color:"white", padding:"10px 18px", fontWeight:900, cursor: isActionBusy || transitioningCard ? "not-allowed" : "pointer", fontFamily:"'Nunito',sans-serif", fontSize:"0.88rem", boxShadow:"0 4px 16px rgba(16,185,129,.4)" }}>
                    Continuer →
                  </button>
                )}
              </div>
            </div>

            <p style={{ margin:"12px 0 0", color:"#334155", fontSize:"0.78rem", fontWeight:700 }}>
              Écris ta réponse · clique sur "Vérifier" · lis la correction · "Continuer" applique la décision automatique.
            </p>
          </section>
        )}

      </div>
    </div>
  );
}
