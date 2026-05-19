import { useState, useEffect, useRef, useCallback } from "react";
import { auth, db } from "../services/firebase";
import { doc, runTransaction } from "firebase/firestore";
import type { UserProfile } from "../services/userProfileService";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";

// ?? Emoji constants (unicode escapes to avoid encoding issues) ?????????????????
const E = {
  bolt:    "\u{26A1}",
  check:   "\u{2705}",
  cross:   "\u{274C}",
  trophy:  "\u{1F3C6}",
  coin:    "\u{1F4B0}",
  star:    "\u{2B50}",
  fire:    "\u{1F525}",
  clock:   "\u{23F1}",
  chart:   "\u{1F4C8}",
  calc:    "\u{1F9EE}",
  rocket:  "\u{1F680}",
  brain:   "\u{1F9E0}",
  medal:   "\u{1F3C5}",
  gem:     "\u{1F48E}",
  percent: "\u{0025}",
};

// ?? CSS ????????????????????????????????????????????????????????????????????????
const CE_CSS = `
@keyframes ceSlideIn  { from { opacity:0; transform:translateY(20px) scale(0.97); } to { opacity:1; transform:none; } }
@keyframes ceCorrect  { 0%{transform:scale(1)} 30%{transform:scale(1.08)} 100%{transform:scale(1)} }
@keyframes ceWrong    { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
@keyframes cePop      { 0%{opacity:0;transform:translateY(0) scale(0.6)} 25%{opacity:1;transform:translateY(-18px) scale(1.1)} 75%{opacity:1;transform:translateY(-28px) scale(1)} 100%{opacity:0;transform:translateY(-40px) scale(0.9)} }
@keyframes ceTimer    { from{stroke-dashoffset:0} to{stroke-dashoffset:283} }
@keyframes cePulse    { 0%,100%{opacity:1} 50%{opacity:0.55} }
@keyframes ceShine    { 0%{background-position:200% center} 100%{background-position:-200% center} }
@keyframes ceCountIn  { from{opacity:0;transform:scale(2)} to{opacity:1;transform:scale(1)} }
@keyframes ceStreakBounce { 0%{transform:scale(1)} 40%{transform:scale(1.18)} 100%{transform:scale(1)} }
`;

// ?? Question generator ?????????????????????????????????????????????????????????
type CalcQ = {
  category: string;
  lines: string[];
  answer: number;
  tolerance: number;
  unit: string;
  points: number;
  hint: string;
};

function fmt(n: number): string {
  return n.toLocaleString("fr-FR");
}

function genQ(): CalcQ {
  const type = Math.floor(Math.random() * 12);
  switch (type) {
    case 0: {
      const ca = (20 + Math.floor(Math.random() * 80)) * 1000;
      const ci = Math.floor(Math.random() * 0.65 * ca / 1000) * 1000;
      return { category: "Valeur Ajout\u00e9e", lines: [`CA\u00a0=\u00a0${fmt(ca)}\u00a0\u20ac`, `CI\u00a0=\u00a0${fmt(ci)}\u00a0\u20ac`, "Calculez la VA\u00a0:"], answer: ca - ci, tolerance: 0, unit: "\u20ac", points: 15, hint: "VA = CA \u2212 CI" };
    }
    case 1: {
      const pa = 20 + Math.floor(Math.random() * 180) * 5;
      const marge = (5 + Math.floor(Math.random() * 20)) * 5;
      return { category: "Marge brute", lines: [`PA\u00a0=\u00a0${fmt(pa)}\u00a0\u20ac`, `PV\u00a0=\u00a0${fmt(pa + marge)}\u00a0\u20ac`, "Calculez la marge brute\u00a0:"], answer: marge, tolerance: 0, unit: "\u20ac", points: 10, hint: "Marge = PV \u2212 PA" };
    }
    case 2: {
      const pa2 = (10 + Math.floor(Math.random() * 18)) * 10;
      const marge2 = (2 + Math.floor(Math.random() * 8)) * 10;
      const taux = Math.round(marge2 / pa2 * 100);
      return { category: "Taux de marge", lines: [`PA\u00a0=\u00a0${fmt(pa2)}\u00a0\u20ac`, `Marge\u00a0=\u00a0${fmt(marge2)}\u00a0\u20ac`, "Taux de marge (%)\u00a0:"], answer: taux, tolerance: 1, unit: "%", points: 12, hint: "Taux marge = Marge \u00f7 PA \u00d7 100" };
    }
    case 3: {
      const pa3 = (10 + Math.floor(Math.random() * 15)) * 10;
      const marge3 = (2 + Math.floor(Math.random() * 8)) * 10;
      const pv3 = pa3 + marge3;
      const tauxMarque = Math.round(marge3 / pv3 * 100);
      return { category: "Taux de marque", lines: [`PV\u00a0=\u00a0${fmt(pv3)}\u00a0\u20ac`, `Marge\u00a0=\u00a0${fmt(marge3)}\u00a0\u20ac`, "Taux de marque (%)\u00a0:"], answer: tauxMarque, tolerance: 1, unit: "%", points: 15, hint: "Taux marque = Marge \u00f7 PV \u00d7 100" };
    }
    case 4: {
      const prod = (50 + Math.floor(Math.random() * 200)) * 1000;
      const charges = (30 + Math.floor(Math.random() * Math.floor(prod / 1000 - 10))) * 1000;
      return { category: "R\u00e9sultat", lines: [`Produits\u00a0=\u00a0${fmt(prod)}\u00a0\u20ac`, `Charges\u00a0=\u00a0${fmt(charges)}\u00a0\u20ac`, "Calculez le r\u00e9sultat\u00a0:"], answer: prod - charges, tolerance: 0, unit: "\u20ac", points: 12, hint: "R\u00e9sultat = Produits \u2212 Charges" };
    }
    case 5: {
      const base = (10 + Math.floor(Math.random() * 80)) * 1000;
      const growPct = [-15, -10, -5, 5, 10, 15, 20, 25, 30][Math.floor(Math.random() * 9)];
      const n = Math.round(base * (1 + growPct / 100));
      const actual = Math.round((n - base) / base * 100);
      return { category: "Taux de croissance", lines: [`N\u22121\u00a0=\u00a0${fmt(base)}\u00a0\u20ac`, `N\u00a0=\u00a0${fmt(n)}\u00a0\u20ac`, "Taux de croissance (%)\u00a0:"], answer: actual, tolerance: 1, unit: "%", points: 18, hint: "(N \u2212 N\u22121) \u00f7 N\u22121 \u00d7 100" };
    }
    case 6: {
      const cf = (10 + Math.floor(Math.random() * 80)) * 1000;
      const tmcv = [20, 25, 30, 40, 50][Math.floor(Math.random() * 5)];
      const sr = Math.round(cf / (tmcv / 100));
      return { category: "Seuil de rentabilit\u00e9", lines: [`CF\u00a0=\u00a0${fmt(cf)}\u00a0\u20ac`, `TMCV\u00a0=\u00a0${tmcv}\u00a0%`, "Seuil de rentabilit\u00e9 (\u20ac)\u00a0:"], answer: sr, tolerance: 100, unit: "\u20ac", points: 20, hint: "SR = CF \u00f7 TMCV" };
    }
    case 7: {
      const pv4 = [5, 8, 10, 12, 15, 20, 25, 30, 40, 50][Math.floor(Math.random() * 10)];
      const qty = 50 + Math.floor(Math.random() * 450) * 2;
      return { category: "Chiffre d'affaires", lines: [`PV unit.\u00a0=\u00a0${pv4}\u00a0\u20ac`, `Quantit\u00e9s\u00a0=\u00a0${fmt(qty)}`, "Calculez le CA\u00a0:"], answer: pv4 * qty, tolerance: 0, unit: "\u20ac", points: 10, hint: "CA = PV \u00d7 Q" };
    }
    case 8: {
      const val = (5 + Math.floor(Math.random() * 45)) * 1000;
      const duree = [3, 4, 5, 8, 10][Math.floor(Math.random() * 5)];
      const annuite = Math.round(val / duree);
      return { category: "Amortissement", lines: [`Valeur\u00a0=\u00a0${fmt(val)}\u00a0\u20ac`, `Dur\u00e9e\u00a0=\u00a0${duree}\u00a0ans`, "Annuit\u00e9 (\u20ac)\u00a0:"], answer: annuite, tolerance: 1, unit: "\u20ac", points: 15, hint: "Annuit\u00e9 = Valeur \u00f7 Dur\u00e9e" };
    }
    case 9: {
      const va2 = (40 + Math.floor(Math.random() * 80)) * 1000;
      const chPct = 30 + Math.floor(Math.random() * 20);
      const impPct = 5 + Math.floor(Math.random() * 5);
      const chPers = Math.round(va2 * chPct / 100 / 1000) * 1000;
      const imp = Math.round(va2 * impPct / 100 / 1000) * 1000;
      const ebe = va2 - chPers - imp;
      return { category: "EBE", lines: [`VA\u00a0=\u00a0${fmt(va2)}\u00a0\u20ac`, `Ch. personnel\u00a0=\u00a0${fmt(chPers)}\u00a0\u20ac`, `Imp\u00f4ts\u00a0=\u00a0${fmt(imp)}\u00a0\u20ac`, "EBE (\u20ac)\u00a0:"], answer: ebe, tolerance: 0, unit: "\u20ac", points: 20, hint: "EBE = VA \u2212 Ch.Personnel \u2212 Imp\u00f4ts" };
    }
    case 10: {
      const ca2 = (80 + Math.floor(Math.random() * 120)) * 1000;
      const cvPct = 40 + Math.floor(Math.random() * 20);
      const cv = Math.round(ca2 * cvPct / 100 / 1000) * 1000;
      const mcv = ca2 - cv;
      return { category: "Marge sur Co\u00fbt Variable", lines: [`CA\u00a0=\u00a0${fmt(ca2)}\u00a0\u20ac`, `Co\u00fbts variables\u00a0=\u00a0${fmt(cv)}\u00a0\u20ac`, "Calculez la MCV\u00a0:"], answer: mcv, tolerance: 0, unit: "\u20ac", points: 15, hint: "MCV = CA \u2212 CV" };
    }
    default: {
      const inv = (5 + Math.floor(Math.random() * 95)) * 1000;
      const gain = (Math.floor(Math.random() * 20) + 5) * 1000;
      const rentab = Math.round(gain / inv * 100);
      return { category: "Rentabilit\u00e9", lines: [`Investissement\u00a0=\u00a0${fmt(inv)}\u00a0\u20ac`, `Gain annuel\u00a0=\u00a0${fmt(gain)}\u00a0\u20ac`, "Taux de rentabilit\u00e9 (%)\u00a0:"], answer: rentab, tolerance: 1, unit: "%", points: 18, hint: "Gain \u00f7 Investissement \u00d7 100" };
    }
  }
}

// ?? Component ??????????????????????????????????????????????????????????????????
type Phase = "start" | "countdown" | "playing" | "result";
type Props  = { profil: UserProfile; onXPGagne: () => void };

const GAME_DURATION = 90;
const QUESTION_TIME = 18; // seconds per question

export default function CalculExpress({ profil, onXPGagne }: Props) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const [phase, setPhase]           = useState<Phase>("start");
  const [countdown, setCountdown]   = useState(3);
  const [timeLeft, setTimeLeft]     = useState(GAME_DURATION);
  const [qTime, setQTime]           = useState(QUESTION_TIME);
  const [q, setQ]                   = useState<CalcQ>(() => genQ());
  const [input, setInput]           = useState("");
  const [score, setScore]           = useState(0);
  const [streak, setStreak]         = useState(0);
  const [maxStreak, setMaxStreak]   = useState(0);
  const [correct, setCorrect]       = useState(0);
  const [wrong, setWrong]           = useState(0);
  const [shake, setShake]           = useState(false);
  const [flash, setFlash]           = useState<"good"|"bad"|null>(null);
  const [popText, setPopText]       = useState<string|null>(null);
  const [showHint, setShowHint]     = useState(false);
  const [crediting, setCrediting]   = useState(false);
  const [reward, setReward]         = useState<{jetons:number;prestige:number}|null>(null);
  const [history, setHistory]       = useState<{category:string;ok:boolean;pts:number}[]>([]);
  const inputRef                    = useRef<HTMLInputElement>(null);
  const timerRef                    = useRef<ReturnType<typeof setInterval>|null>(null);
  const qTimerRef                   = useRef<ReturnType<typeof setInterval>|null>(null);

  const clearTimers = () => {
    if (timerRef.current)  clearInterval(timerRef.current);
    if (qTimerRef.current) clearInterval(qTimerRef.current);
  };

  const nextQ = useCallback(() => {
    setQ(genQ());
    setInput("");
    setQTime(QUESTION_TIME);
    setShowHint(false);
    setTimeout(() => inputRef.current?.focus(), 80);
  }, []);

  const endGame = useCallback((finalScore: number, finalStreak: number, finalCorrect: number, finalWrong: number) => {
    clearTimers();
    const jetons   = Math.min(60, Math.floor(finalScore / 8));
    const prestige = finalCorrect >= 10 ? Math.floor(finalCorrect / 5) : 0;
    setReward({ jetons, prestige });
    setPhase("result");

    const uid = auth.currentUser?.uid;
    if (!uid || jetons === 0) return;
    if (xpRewardsSuspended) {
      setPopText(PLATFORM_XP_BLOCKED_MESSAGE);
      return;
    }
    setCrediting(true);
    runTransaction(db, async tx => {
      const ref  = doc(db, "users", uid);
      const snap = await tx.get(ref);
      if (!snap.exists()) return;
      const d    = snap.data();
      tx.update(ref, {
        xp:      (d.xp      || 0) + jetons,
        prestige:(d.prestige || 0) + prestige,
      });
    }).then(() => { setCrediting(false); onXPGagne(); }).catch(() => setCrediting(false));
  }, [onXPGagne, xpRewardsSuspended]);

  // countdown ? playing
  useEffect(() => {
    if (phase !== "countdown") return;
    const id = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(id); setPhase("playing"); return 3; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // main game timer
  useEffect(() => {
    if (phase !== "playing") return;
    let localScore   = score;
    let localStreak  = streak;
    let localCorrect = correct;
    let localWrong   = wrong;

    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          endGame(localScore, localStreak, localCorrect, localWrong);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    qTimerRef.current = setInterval(() => {
      setQTime(qt => {
        if (qt <= 1) {
          // time up on question
          setTimeLeft(tl => Math.max(0, tl - 5));
          setStreak(0);
          setWrong(w => { localWrong = w + 1; return w + 1; });
          setFlash("bad");
          setPopText("-5s \u23F1");
          setTimeout(() => { setFlash(null); setPopText(null); }, 700);
          nextQ();
          return QUESTION_TIME;
        }
        return qt - 1;
      });
    }, 1000);

    inputRef.current?.focus();
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const checkAnswer = useCallback(() => {
    if (phase !== "playing") return;
    const val = parseFloat(input.replace(",", ".").replace(/\s/g, ""));
    if (isNaN(val)) { setShake(true); setTimeout(() => setShake(false), 500); return; }

    const isOk = Math.abs(val - q.answer) <= q.tolerance;
    const speedBonus = qTime > 12 ? 30 : qTime > 6 ? 20 : 15;
    const streakMult  = streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
    const pts = isOk ? Math.round(q.points + speedBonus) * streakMult : 0;

    if (isOk) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setMaxStreak(ms => Math.max(ms, newStreak));
      setScore(s => { return s + pts; });
      setCorrect(c => c + 1);
      setFlash("good");
      const popMsg = newStreak >= 3 ? `${E.fire} COMBO x${newStreak}!  +${Math.round(pts)}pts` : `${E.check} +${Math.round(pts)} pts`;
      setPopText(popMsg);
      setHistory(h => [...h, { category: q.category, ok: true, pts: Math.round(pts) }]);
      setTimeout(() => { setFlash(null); setPopText(null); nextQ(); }, 400);
    } else {
      setStreak(0);
      setWrong(w => w + 1);
      setShake(true);
      setFlash("bad");
      setTimeLeft(tl => Math.max(1, tl - 5));
      setPopText(`${E.cross} \u221210pts \u22125s`);
      setHistory(h => [...h, { category: q.category, ok: false, pts: 0 }]);
      setTimeout(() => { setShake(false); setFlash(null); setPopText(null); }, 700);
      setInput("");
    }
  }, [phase, input, q, streak, qTime, nextQ]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") checkAnswer();
  };

  const startGame = () => { setPhase("countdown"); setCountdown(3); setScore(0); setStreak(0); setMaxStreak(0); setCorrect(0); setWrong(0); setTimeLeft(GAME_DURATION); setQTime(QUESTION_TIME); setHistory([]); setQ(genQ()); setInput(""); };

  const timerPct  = timeLeft / GAME_DURATION;
  const qTimerPct = qTime / QUESTION_TIME;
  const timerColor = timeLeft > 45 ? "#4ade80" : timeLeft > 20 ? "#facc15" : "#ef4444";
  const qColor     = qTime > 10 ? "#4ade80" : qTime > 5 ? "#f97316" : "#ef4444";

  // ?? START ?????????????????????????????????????????????????????????????????
  if (phase === "start") return (
    <div style={{ minHeight:"100vh", background:"#03080f", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", fontFamily:"system-ui,sans-serif" }}>
      <style>{CE_CSS}</style>
      <div style={{ maxWidth:"420px", width:"100%", animation:"ceSlideIn 0.5s both" }}>
        <div style={{ textAlign:"center", marginBottom:"32px" }}>
          <div style={{ fontSize:"4.5rem", marginBottom:"12px" }}>{E.calc}</div>
          <h1 style={{ color:"white", fontSize:"2.4rem", fontWeight:900, margin:"0 0 8px", background:"linear-gradient(135deg,#4ade80,#22d3ee,#818cf8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Calcul Express</h1>
          <p style={{ color:"#64748b", fontSize:"1rem", margin:0 }}>Calculs STMG à la vitesse de l'éclair !</p>
        </div>

        <div style={{ background:"rgba(255,255,255,0.04)", borderRadius:"20px", border:"1px solid rgba(255,255,255,0.08)", padding:"24px", marginBottom:"24px" }}>
          <h3 style={{ color:"#94a3b8", fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", margin:"0 0 16px" }}>Comment jouer</h3>
          {[
            [E.clock, "90 secondes pour marquer un max de points"],
            [E.brain, "Calculs STMG : VA, Marge, SR, Amort..."],
            [E.bolt,  "Plus tu r\u00e9ponds vite, plus tu gagnes de points"],
            [E.fire,  "Enchainez les r\u00e9ponses correctes pour le COMBO x2"],
            [E.cross, "Mauvaise r\u00e9ponse = \u22125 secondes"],
            [E.coin,  "Score converti en jetons \u00e0 la fin !"],
          ].map(([ic, txt], i) => (
            <div key={i} style={{ display:"flex", gap:"12px", alignItems:"center", marginBottom:"10px" }}>
              <span style={{ fontSize:"1.2rem", flexShrink:0 }}>{ic}</span>
              <span style={{ color:"#cbd5e1", fontSize:"0.88rem" }}>{txt}</span>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px", marginBottom:"24px" }}>
          {[["Seuil de rentabilit\u00e9","20 pts"],["Taux de croissance","18 pts"],["EBE","20 pts"]].map(([n,p]) => (
            <div key={n} style={{ background:"rgba(74,222,128,0.06)", border:"1px solid rgba(74,222,128,0.15)", borderRadius:"14px", padding:"12px", textAlign:"center" }}>
              <div style={{ color:"#4ade80", fontSize:"0.7rem", fontWeight:700, marginBottom:"4px" }}>{n}</div>
              <div style={{ color:"white", fontSize:"0.9rem", fontWeight:900 }}>{p}</div>
            </div>
          ))}
        </div>

        <button onClick={startGame} style={{ width:"100%", background:"linear-gradient(135deg,#4ade80,#22d3ee)", color:"#03080f", fontWeight:900, fontSize:"1.15rem", padding:"18px", borderRadius:"18px", border:"none", cursor:"pointer", boxShadow:"0 12px 40px rgba(74,222,128,0.35)" }}>
          {E.rocket} Lancer le chrono !
        </button>
      </div>
    </div>
  );

  // ?? COUNTDOWN ????????????????????????????????????????????????????????????
  if (phase === "countdown") return (
    <div style={{ minHeight:"100vh", background:"#03080f", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{CE_CSS}</style>
      <div style={{ textAlign:"center", animation:"ceCountIn 0.6s both" }}>
        <div style={{ fontSize:"9rem", fontWeight:900, color:"#4ade80", lineHeight:1, animation:"ceCountIn 0.6s both", textShadow:"0 0 60px #4ade80" }}>{countdown}</div>
        <p style={{ color:"#64748b", fontSize:"1.2rem", marginTop:"16px" }}>Prépare-toi !</p>
      </div>
    </div>
  );

  // ?? RESULT ????????????????????????????????????????????????????????????????
  if (phase === "result") {
    const acc = correct + wrong > 0 ? Math.round(correct / (correct + wrong) * 100) : 0;
    const mention = score >= 800 ? "EXCEPTIONNEL" : score >= 500 ? "EXCELLENT" : score >= 300 ? "TR\u00c8S BIEN" : score >= 150 ? "BIEN" : "EN PROGR\u00c8S";
    const mentionColor = score >= 800 ? "#fbbf24" : score >= 500 ? "#a78bfa" : score >= 300 ? "#4ade80" : score >= 150 ? "#22d3ee" : "#94a3b8";

    return (
      <div style={{ minHeight:"100vh", background:"#03080f", display:"flex", flexDirection:"column", alignItems:"center", padding:"24px 16px", fontFamily:"system-ui,sans-serif" }}>
        <style>{CE_CSS}</style>
        <div style={{ maxWidth:"420px", width:"100%", animation:"ceSlideIn 0.5s both" }}>
          <div style={{ textAlign:"center", marginBottom:"24px" }}>
            <div style={{ fontSize:"3.5rem", marginBottom:"8px" }}>{E.trophy}</div>
            <div style={{ color:mentionColor, fontSize:"1rem", fontWeight:900, letterSpacing:"0.2em", textTransform:"uppercase" }}>{mention}</div>
            <div style={{ color:"white", fontSize:"3.5rem", fontWeight:900, lineHeight:1.1 }}>{Math.round(score)}</div>
            <div style={{ color:"#64748b", fontSize:"0.85rem" }}>points</div>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:"10px", marginBottom:"20px" }}>
            {[
              [E.check, correct, "Correctes", "#4ade80"],
              [E.cross, wrong, "Erreurs", "#ef4444"],
              [E.fire, maxStreak, "Meilleur combo", "#f97316"],
              [E.percent, `${acc}%`, "Pr\u00e9cision", "#22d3ee"],
            ].map(([ic, val, label, color]) => (
              <div key={label as string} style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"16px", padding:"14px 8px", textAlign:"center" }}>
                <div style={{ fontSize:"1.4rem" }}>{ic}</div>
                <div style={{ color:color as string, fontSize:"1.3rem", fontWeight:900 }}>{val}</div>
                <div style={{ color:"#64748b", fontSize:"0.6rem", marginTop:"2px" }}>{label}</div>
              </div>
            ))}
          </div>

          {reward && (
            <div style={{ background:"linear-gradient(135deg,rgba(74,222,128,0.1),rgba(34,211,238,0.1))", border:"1px solid rgba(74,222,128,0.25)", borderRadius:"20px", padding:"20px", textAlign:"center", marginBottom:"20px" }}>
              <div style={{ color:"#94a3b8", fontSize:"0.75rem", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"12px" }}>Récompenses gagnées</div>
              <div style={{ display:"flex", justifyContent:"center", gap:"24px" }}>
                <div>
                  <div style={{ fontSize:"2rem" }}>{E.coin}</div>
                  <div style={{ color:"#4ade80", fontSize:"1.6rem", fontWeight:900 }}>{crediting ? "..." : `+${reward.jetons}`}</div>
                  <div style={{ color:"#64748b", fontSize:"0.75rem" }}>jetons</div>
                </div>
                {reward.prestige > 0 && (
                  <div>
                    <div style={{ fontSize:"2rem" }}>{E.star}</div>
                    <div style={{ color:"#fbbf24", fontSize:"1.6rem", fontWeight:900 }}>+{reward.prestige}</div>
                    <div style={{ color:"#64748b", fontSize:"0.75rem" }}>prestige</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {history.length > 0 && (
            <div style={{ background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"16px", padding:"16px", marginBottom:"20px", maxHeight:"180px", overflowY:"auto" }}>
              <div style={{ color:"#64748b", fontSize:"0.7rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:"10px" }}>Historique des questions</div>
              {history.map((h, i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"5px 0", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ color:h.ok ? "#4ade80" : "#ef4444", fontSize:"0.85rem" }}>{h.ok ? E.check : E.cross} {h.category}</span>
                  <span style={{ color:"#94a3b8", fontSize:"0.8rem" }}>{h.ok ? `+${h.pts}pts` : "---"}</span>
                </div>
              ))}
            </div>
          )}

          <button onClick={startGame} style={{ width:"100%", background:"linear-gradient(135deg,#4ade80,#22d3ee)", color:"#03080f", fontWeight:900, fontSize:"1.1rem", padding:"16px", borderRadius:"16px", border:"none", cursor:"pointer", marginBottom:"12px" }}>
            {E.rocket} Rejouer
          </button>
        </div>
      </div>
    );
  }

  // ?? PLAYING ???????????????????????????????????????????????????????????????
  const streakMult = streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;

  return (
    <div style={{ minHeight:"100vh", background:"#03080f", display:"flex", flexDirection:"column", padding:"0", fontFamily:"system-ui,sans-serif", position:"relative", overflow:"hidden" }}>
      <style>{CE_CSS}</style>

      {/* Background grid */}
      <div style={{ position:"absolute", inset:0, backgroundImage:"linear-gradient(rgba(74,222,128,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(74,222,128,0.03) 1px,transparent 1px)", backgroundSize:"40px 40px", pointerEvents:"none" }}/>

      {/* Flash overlay */}
      {flash && <div style={{ position:"absolute", inset:0, background:flash==="good"?"rgba(74,222,128,0.07)":"rgba(239,68,68,0.07)", pointerEvents:"none", zIndex:1 }}/>}

      {/* Pop feedback */}
      {popText && (
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", background:"rgba(0,0,0,0.85)", color:flash==="good"?"#4ade80":"#ef4444", fontWeight:900, fontSize:"1.1rem", padding:"10px 24px", borderRadius:"50px", zIndex:50, pointerEvents:"none", animation:"cePop 0.8s forwards", whiteSpace:"nowrap" }}>{popText}</div>
      )}

      {/* Top bar */}
      <div style={{ position:"relative", zIndex:10, padding:"12px 16px", display:"flex", alignItems:"center", gap:"12px", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(3,8,15,0.7)", backdropFilter:"blur(12px)" }}>
        {/* Score */}
        <div style={{ flex:1 }}>
          <div style={{ color:"#475569", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>Score</div>
          <div style={{ color:"white", fontSize:"1.4rem", fontWeight:900 }}>{Math.round(score)}</div>
        </div>

        {/* Timer circle */}
        <div style={{ position:"relative", width:"62px", height:"62px" }}>
          <svg width="62" height="62" style={{ transform:"rotate(-90deg)" }}>
            <circle cx="31" cy="31" r="26" fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="5"/>
            <circle cx="31" cy="31" r="26" fill="none" stroke={timerColor} strokeWidth="5" strokeLinecap="round" strokeDasharray="163" strokeDashoffset={163 * (1 - timerPct)} style={{ transition:"stroke-dashoffset 1s linear, stroke 0.5s" }}/>
          </svg>
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", color:timerColor, fontSize:"1.1rem", fontWeight:900, transition:"color 0.5s" }}>{timeLeft}</div>
        </div>

        {/* Streak */}
        <div style={{ flex:1, textAlign:"right" }}>
          <div style={{ color:"#475569", fontSize:"0.65rem", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase" }}>Combo</div>
          <div style={{ color:streak >= 3 ? "#f97316" : "#64748b", fontSize:"1.4rem", fontWeight:900, animation:streak > 0 ? "ceStreakBounce 0.3s" : "none" }}>
            {streak >= 3 ? `${E.fire}x${streak}` : streak > 0 ? `x${streak}` : "x0"}
          </div>
        </div>
      </div>

      {/* Multiplier badge */}
      {streakMult > 1 && (
        <div style={{ textAlign:"center", padding:"6px", background:`linear-gradient(90deg,rgba(249,115,22,0.08),rgba(239,68,68,0.08))` }}>
          <span style={{ color:"#f97316", fontSize:"0.8rem", fontWeight:700 }}>{E.fire} Multiplicateur x{streakMult} actif !</span>
        </div>
      )}

      {/* Question card */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"16px", position:"relative", zIndex:5 }}>

        {/* Q-timer bar */}
        <div style={{ width:"100%", maxWidth:"400px", height:"4px", background:"rgba(255,255,255,0.08)", borderRadius:"4px", marginBottom:"20px", overflow:"hidden" }}>
          <div style={{ height:"100%", background:qColor, borderRadius:"4px", width:`${qTimerPct * 100}%`, transition:"width 1s linear, background 0.3s" }}/>
        </div>

        <div style={{ width:"100%", maxWidth:"400px", background:"rgba(255,255,255,0.04)", border:`1px solid ${flash==="good"?"rgba(74,222,128,0.4)":flash==="bad"?"rgba(239,68,68,0.4)":"rgba(255,255,255,0.08)"}`, borderRadius:"24px", padding:"28px 24px", animation:`${shake ? "ceWrong 0.4s" : "ceSlideIn 0.35s both"}`, transition:"border-color 0.2s" }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"16px" }}>
            <span style={{ background:"rgba(74,222,128,0.12)", color:"#4ade80", borderRadius:"8px", padding:"3px 10px", fontSize:"0.7rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.08em" }}>{q.category}</span>
            <span style={{ color:"#475569", fontSize:"0.75rem" }}>{correct + wrong + 1}</span>
          </div>

          {q.lines.map((line, i) => (
            <div key={i} style={{ color: i < q.lines.length - 1 ? "#94a3b8" : "#e2e8f0", fontSize: i < q.lines.length - 1 ? "1rem" : "0.95rem", fontWeight: i < q.lines.length - 1 ? 600 : 800, marginBottom:"6px", fontFamily:"'Courier New',monospace" }}>{line}</div>
          ))}

          {showHint && (
            <div style={{ marginTop:"12px", padding:"8px 12px", background:"rgba(129,140,248,0.12)", borderRadius:"10px", color:"#818cf8", fontSize:"0.8rem", fontWeight:600 }}>
              {E.brain} Formule : {q.hint}
            </div>
          )}
        </div>

        {/* Input */}
        <div style={{ width:"100%", maxWidth:"400px", marginTop:"20px", display:"flex", gap:"10px" }}>
          <input
            ref={inputRef}
            type="number"
            inputMode="numeric"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Votre réponse..."
            style={{ flex:1, background:"rgba(255,255,255,0.06)", border:"2px solid rgba(255,255,255,0.12)", borderRadius:"16px", padding:"16px 20px", color:"white", fontSize:"1.25rem", fontWeight:700, outline:"none", fontFamily:"'Courier New',monospace" }}
          />
          <button onClick={checkAnswer} style={{ background:"linear-gradient(135deg,#4ade80,#22d3ee)", color:"#03080f", fontWeight:900, padding:"16px 22px", borderRadius:"16px", border:"none", cursor:"pointer", fontSize:"1.2rem", flexShrink:0 }}>
            {E.bolt}
          </button>
        </div>

        <button onClick={() => setShowHint(h => !h)} style={{ marginTop:"12px", background:"none", border:"1px solid rgba(129,140,248,0.25)", color:"#818cf8", fontSize:"0.8rem", padding:"6px 16px", borderRadius:"10px", cursor:"pointer" }}>
          {showHint ? "Masquer" : E.brain+" Afficher"} l&apos;indice (sans penalt\u00e9)
        </button>

        {/* Stats row */}
        <div style={{ display:"flex", gap:"16px", marginTop:"20px" }}>
          <span style={{ color:"#4ade80", fontSize:"0.85rem", fontWeight:700 }}>{E.check} {correct} correctes</span>
          <span style={{ color:"#ef4444", fontSize:"0.85rem", fontWeight:700 }}>{E.cross} {wrong} erreurs</span>
          <span style={{ color:"#64748b", fontSize:"0.85rem" }}>{E.clock} {qTime}s</span>
        </div>
      </div>
    </div>
  );
}
