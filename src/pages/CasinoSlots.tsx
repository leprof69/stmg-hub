import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { formatJetonsDelta } from "../lib/jetons";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";

// ?? Unicode emoji constants ?????????????????????????????????????????????????
const E = {
  lemon:    "\u{1F34B}", // ??
  cherry:   "\u{1F352}", // ??
  grad:     "\u{1F393}", // ??
  moneym:   "\u{1F911}", // ??
  gem:      "\u{1F48E}", // ??
  rainbow:  "\u{1F308}", // ??
  slot:     "\u{1F3B0}", // ??
  ok:       "\u{2705}",  // ?
  nok:      "\u{274C}",  // ?
  sparkle:  "\u{2728}",  // ?
  party:    "\u{1F38A}", // ??
  boom:     "\u{1F4AB}", // ??
  coins:    "\u{1F4B0}", // ??
  gear:     "\u{2699}\u{FE0F}",
  hype:     "\u{1F973}", // ??
  fire:     "\u{1F525}", // ??
  moneyW:   "\u{1F4B8}", // ??
  star:     "\u{2B50}",  // ?
  card:     "\u{1F0CF}", // ??
  medal:    "\u{1F3C5}", // ??
  chart:    "\u{1F4C8}", // ??
  brain:    "\u{1F9E0}", // ??
  tie:      "\u{1F454}", // ??
  brief:    "\u{1F4BC}", // ??
  mega:     "\u{1F4E3}", // ??
  money2:   "\u{1F4B9}", // ??
};

type Props = { profil: { prenom?: string }; onXPGagne?: () => void };

// ?? SYMBOLS ?????????????????????????????????????????????????????????????????
const SYMBOLS = [
  { emoji: E.lemon,   name: "Citron",       weight: 30, color: "#fde047", glow: "rgba(253,224,71,0.75)",  tier: 0 },
  { emoji: E.cherry,  name: "Cerise",        weight: 24, color: "#f87171", glow: "rgba(248,113,113,0.75)", tier: 1 },
  { emoji: E.grad,    name: "Dipl\u00f4me",  weight: 18, color: "#fb923c", glow: "rgba(251,146,60,0.75)",  tier: 2 },
  { emoji: E.moneym,  name: "Jackpot",       weight: 12, color: "#4ade80", glow: "rgba(74,222,128,0.8)",   tier: 3 },
  { emoji: E.gem,     name: "Diamant",       weight:  9, color: "#38bdf8", glow: "rgba(56,189,248,0.85)",  tier: 4 },
  { emoji: E.rainbow, name: "Prismatique",   weight:  7, color: "#e879f9", glow: "rgba(232,121,249,0.9)",  tier: 5 },
] as const;
type Sym = typeof SYMBOLS[number];

function weightedRandom(): Sym {
  const total = SYMBOLS.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (const sym of SYMBOLS) { r -= sym.weight; if (r <= 0) return sym; }
  return SYMBOLS[0];
}
function symByEmoji(e: string): Sym { return SYMBOLS.find(s => s.emoji === e) ?? SYMBOLS[0]; }
function symNeighbor(e: string, delta: number): string {
  const idx = SYMBOLS.findIndex(s => s.emoji === e);
  return SYMBOLS[((idx + delta) % SYMBOLS.length + SYMBOLS.length) % SYMBOLS.length].emoji;
}

// ?? CASINO CARDS ?????????????????????????????????????????????????????????????
type CasinoCard = { id: string; name: string; desc: string; emoji: string; color: string };
const CASINO_CARDS: CasinoCard[] = [
  { id:"cc_pdg",    name:"PDG en Herbe",       desc:"La gouvernance n'a plus de secrets",           emoji:E.tie,    color:"#fbbf24" },
  { id:"cc_va",     name:"Expert Valeur Aj.",   desc:"Valeur Ajout\u00e9e maximale",                 emoji:E.chart,  color:"#4ade80" },
  { id:"cc_mkt",    name:"As du Marketing",     desc:"Les 4P ma\u00eet ris\u00e9s",                  emoji:E.mega,   color:"#f87171" },
  { id:"cc_strat",  name:"Strat\u00e8ge SWOT",  desc:"Analyse strat\u00e9gique au top",              emoji:E.brain,  color:"#a78bfa" },
  { id:"cc_compta", name:"Comptable Furtif",    desc:"Le bilan ? Connais par c\u0153ur",             emoji:E.brief,  color:"#38bdf8" },
  { id:"cc_lucky",  name:"Lucky Star",          desc:"La chance sourit aux pr\u00e9par\u00e9s",      emoji:E.star,   color:"#fde047" },
  { id:"cc_gold",   name:"Carte Dor\u00e9e",    desc:"R\u00e9compense sp\u00e9ciale casino",         emoji:E.medal,  color:"#f97316" },
  { id:"cc_inv",    name:"Investisseur Fou",    desc:"Risque calcul\u00e9\u2026 ou presque",         emoji:E.money2, color:"#10b981" },
  { id:"cc_ceo",    name:"Future Ministre",     desc:"Ton discours sur la VA \u00e9tait parfait",    emoji:"\u{1F3DB}\u{FE0F}", color:"#ec4899" },
  { id:"cc_ninja",  name:"Ninja du Bilan",      desc:"Actif = Passif, tu dormiras bien",             emoji:"\u{1F977}", color:"#06b6d4" },
];

// ?? WIN EVALUATION ????????????????????????????????????????????????????????????
type WinResult = { jetons: number; prestige: number; prismatic: boolean; label: string; rank: number; card?: CasinoCard };
const FUNNY_MISS = [
  "Pas de chance\u2026 \u{1F622}", "Presque ! \u{1F62C}",
  "C'est pour la prochaine ! \u{1F4AA}", "Retry ? \u{1F3B0}", "Presque parfait ! \u{1F615}",
];

function pickCard(rank: number): CasinoCard | undefined {
  const chance = rank >= 5 ? 0.60 : rank >= 3 ? 0.35 : rank >= 1 ? 0.18 : 0;
  if (Math.random() >= chance) return undefined;
  return CASINO_CARDS[Math.floor(Math.random() * CASINO_CARDS.length)];
}

function evalWin(s0: string, s1: string, s2: string): WinResult {
  const all3 = s0 === s1 && s1 === s2;
  if (all3) {
    const rank6 = s0===E.rainbow ? 6 : s0===E.gem ? 5 : s0===E.moneym ? 4 : s0===E.grad ? 3 : s0===E.cherry ? 2 : 1;
    const base: Omit<WinResult,"card"> = s0===E.rainbow
      ? { jetons:100, prestige:200, prismatic:true,  label:"JACKPOT \u2014 Carte Prismatique !", rank:6 }
      : s0===E.gem
      ? { jetons:50,  prestige:50,  prismatic:false, label:"SUPER WIN \u2014 Prestige !",         rank:5 }
      : s0===E.moneym
      ? { jetons:30,  prestige:20,  prismatic:false, label:`CA VA CHAUFFER ${E.moneym} !`,         rank:4 }
      : s0===E.grad
      ? { jetons:15,  prestige:0,   prismatic:false, label:`WIN ! ${E.grad} Dipl\u00f4m\u00e9 !`,  rank:3 }
      : s0===E.cherry
      ? { jetons:8,   prestige:0,   prismatic:false, label:`Cerise ${E.cherry} +8j`,               rank:2 }
      : { jetons:5,   prestige:0,   prismatic:false, label:`Citron ${E.lemon} +5j`,                rank:1 };
    void rank6;
    return { ...base, card: pickCard(base.rank) };
  }
  const syms = [s0, s1, s2];
  const counts = new Map<string, number>();
  syms.forEach(s => counts.set(s, (counts.get(s) ?? 0) + 1));
  if (Math.max(...counts.values()) >= 2) return { jetons:3, prestige:0, prismatic:false, label:`Paire ! ${E.party} +3j`, rank:1, card:pickCard(1) };
  if (syms.includes(E.rainbow))          return { jetons:5, prestige:0, prismatic:false, label:`${E.rainbow} Arc-en-ciel solitaire +5j`, rank:1, card:pickCard(1) };
  return { jetons:0, prestige:0, prismatic:false, label:FUNNY_MISS[Math.floor(Math.random()*FUNNY_MISS.length)], rank:0 };
}

// ?? QUIZ ??????????????????????????????????????????????????????????????????????
type QuizQ = { q: string; choices: [string,string,string,string]; ok: number };
const CASINO_QUIZ: QuizQ[] = [
  { q:"Le chiffre d'affaires correspond \u00e0 :", choices:["Total des d\u00e9penses","Total des ventes HT","B\u00e9n\u00e9fice net","Capital social"], ok:1 },
  { q:"Un flux descendant part :", choices:["Des employ\u00e9s vers la hi\u00e9rarchie","De la direction vers les employ\u00e9s","Entre coll\u00e8gues","De l'ext\u00e9rieur vers l'interne"], ok:1 },
  { q:"Le seuil de rentabilit\u00e9 est le CA o\u00f9 :", choices:["Le profit est maximum","Les charges fixes = 0","R\u00e9sultat = 0","Les ventes doublent"], ok:2 },
  { q:"Management participatif =", choices:["D\u00e9cisions solitaires","Bureaucratie","Implication des collaborateurs","Suppression des r\u00e9unions"], ok:2 },
  { q:"Valeur ajout\u00e9e (VA) = CA \u2212 :", choices:["Salaires","Imp\u00f4ts","Consommations interm\u00e9diaires","Dividendes"], ok:2 },
  { q:"Un organigramme repr\u00e9sente :", choices:["Le bilan","La structure hi\u00e9rarchique","Le compte de r\u00e9sultat","Le march\u00e9 cible"], ok:1 },
  { q:"Int\u00e9gration verticale =", choices:["Racheter un concurrent","Contr\u00f4ler fournisseurs OU clients","Fusion internationale","D\u00e9localisation"], ok:1 },
  { q:"Oligopole = march\u00e9 domin\u00e9 par :", choices:["Un seul vendeur","Deux acheteurs","Quelques vendeurs dominants","Infinit\u00e9 de petits acteurs"], ok:2 },
  { q:"Strat\u00e9gie de diff\u00e9renciation =", choices:["Baisser les prix","Se distinguer de la concurrence","Copier les leaders","R\u00e9duire les stocks"], ok:1 },
  { q:"SWOT : forces, faiblesses, opportunit\u00e9s et :", choices:["Strat\u00e9gies","Tendances","Menaces","Synergies"], ok:2 },
  { q:"Marketing mix \u2014 1er P =", choices:["Prix","Promotion","Produit","Place"], ok:2 },
  { q:"ONG =", choices:["Entreprise priv\u00e9e","Organisme gouvernemental","Organisme non-gouvernemental \u00e0 but non lucratif","Banque centrale"], ok:2 },
  { q:"Maslow \u2014 besoins de base :", choices:["D'estime","De s\u00e9curit\u00e9","Physiologiques","D'appartenance"], ok:2 },
  { q:"Le bilan comptable recense :", choices:["Ventes du mois","Actif et passif \u00e0 une date","Liste des salari\u00e9s","Nombre de clients"], ok:1 },
  { q:"Une entreprise individuelle :", choices:["Est une SA","= Une seule personne \u00e0 la t\u00eate","Est forc\u00e9ment multinationale","Est une coop\u00e9rative"], ok:1 },
];

// ?? CSS ANIMATIONS ????????????????????????????????????????????????????????????
const CASINO_CSS = `
  @keyframes confettiFall{0%{transform:translateY(-20px) rotate(0deg);opacity:1}100%{transform:translateY(108vh) rotate(820deg);opacity:0}}
  @keyframes coinBounce{0%{transform:translateX(-50%) translateY(0) scale(1)}100%{transform:translateX(-50%) translateY(-16px) scale(1.2)}}
  @keyframes jackpotPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.07)}}
  @keyframes floatUp{0%{transform:translateY(0) rotate(-8deg);opacity:1}100%{transform:translateY(-70px) rotate(18deg);opacity:0}}
  @keyframes spinSlow{to{transform:rotate(360deg)}}
  @keyframes moneyBounce{0%,100%{transform:scale(1) rotate(-6deg)}50%{transform:scale(1.13) rotate(6deg)}}
  @keyframes shimmer{0%,100%{opacity:0.6}50%{opacity:1}}
  @keyframes cardReveal{0%{transform:scale(0.5) rotate(-12deg);opacity:0}60%{transform:scale(1.08) rotate(2deg);opacity:1}100%{transform:scale(1) rotate(0deg);opacity:1}}
  @keyframes coinPop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15);opacity:1}100%{transform:scale(1);opacity:1}}
`;

// ?? DRAWINGS ??????????????????????????????????????????????????????????????????
function CSSRainbow() {
  const arcs = ["#ef4444","#f97316","#fbbf24","#4ade80","#38bdf8","#a78bfa"];
  return (
    <div className="relative mx-auto" style={{ width:220, height:115, marginBottom:-10 }}>
      {arcs.map((color, i) => { const w=220-i*28; const h=w/2;
        return <div key={i} style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:w, height:h, borderRadius:`${w/2}px ${w/2}px 0 0`, border:`7px solid ${color}`, borderBottom:"none", opacity:0.9 }} />;
      })}
    </div>
  );
}
function CartoonChest() {
  return (
    <div className="relative mx-auto" style={{ width:90 }}>
      <div style={{ width:90, height:32, background:"linear-gradient(180deg,#b45309,#92400e)", borderRadius:"50% 50% 0 0 / 100% 100% 0 0", border:"2.5px solid #fbbf24", borderBottom:"none" }}><div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"#fbbf24" }} /></div>
      <div style={{ width:90, height:56, background:"linear-gradient(180deg,#92400e,#78350f)", borderRadius:"0 0 8px 8px", border:"2.5px solid #fbbf24", borderTop:"none", position:"relative", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <div style={{ width:18, height:18, background:"#fbbf24", borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center" }}><div style={{ width:8, height:8, background:"#92400e", borderRadius:"50%" }} /></div>
        <div style={{ position:"absolute", left:18, top:0, bottom:0, width:2, background:"rgba(251,191,36,0.45)" }} />
        <div style={{ position:"absolute", right:18, top:0, bottom:0, width:2, background:"rgba(251,191,36,0.45)" }} />
      </div>
      <div style={{ position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)", fontSize:24, animation:"coinBounce 0.65s ease-in-out infinite alternate" }}>{E.coins}</div>
    </div>
  );
}
function MoneyScene() {
  return (
    <div className="flex flex-col items-center gap-2">
      <div style={{ fontSize:88, lineHeight:1, animation:"moneyBounce 0.7s ease-in-out infinite" }}>{E.moneym}</div>
      <div className="flex gap-2 text-3xl">{[E.moneyW,E.coins,E.moneyW,E.coins,E.moneyW].map((em,i)=><span key={i} style={{ animation:`floatUp ${0.9+i*0.14}s ease-in-out ${i*0.12}s infinite` }}>{em}</span>)}</div>
    </div>
  );
}
function DiamondDraw() {
  return (
    <svg width="110" height="110" viewBox="0 0 100 100" style={{ display:"block", margin:"0 auto" }}>
      <defs><linearGradient id="gemG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#bae6fd"/><stop offset="50%" stopColor="#38bdf8"/><stop offset="100%" stopColor="#0369a1"/></linearGradient><filter id="gf"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      <polygon points="50,8 88,38 50,92 12,38" fill="url(#gemG)" stroke="#7dd3fc" strokeWidth="2" filter="url(#gf)" style={{ animation:"jackpotPulse 1.1s ease-in-out infinite" }}/>
      <polygon points="50,8 88,38 50,55" fill="rgba(255,255,255,0.22)"/><polygon points="50,8 12,38 50,55" fill="rgba(255,255,255,0.08)"/>
      <line x1="12" y1="38" x2="88" y2="38" stroke="rgba(255,255,255,0.38)" strokeWidth="1"/>
      <ellipse cx="37" cy="24" rx="8" ry="4" fill="white" opacity="0.5" transform="rotate(-30 37 24)"/>
    </svg>
  );
}
function StarBurst() {
  const pts = [[50,10],[90,28],[95,72],[70,95],[30,95],[5,72],[10,28],[50,50],[28,48],[72,48],[50,22],[50,78],[35,30],[65,30]];
  return (
    <svg width="130" height="130" viewBox="0 0 100 100" style={{ display:"block", margin:"0 auto" }}>
      <defs><filter id="sf"><feGaussianBlur stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs>
      {pts.map(([cx,cy],i)=>{const sz=i===7?16:3+Math.abs((i*7)%8);return <polygon key={i} filter="url(#sf)" points={`${cx},${cy-sz} ${cx+sz*.38},${cy-sz*.38} ${cx+sz},${cy} ${cx+sz*.38},${cy+sz*.38} ${cx},${cy+sz} ${cx-sz*.38},${cy+sz*.38} ${cx-sz},${cy} ${cx-sz*.38},${cy-sz*.38}`} fill={i%3===0?"#fbbf24":i%3===1?"#fde68a":"#f97316"} opacity={0.8} style={{ animation:`shimmer ${1+i*0.15}s ease-in-out ${i*0.08}s infinite alternate` }}/>;
      })}
    </svg>
  );
}

type ConfItem = { left:string; delay:string; dur:string; color:string; circle:boolean; sz:number };
function Confetti({ rank }: { rank:number }) {
  const items = useMemo<ConfItem[]>(()=>{
    const count=rank>=6?80:rank>=5?50:28;
    const pal=rank>=6?["#fbbf24","#f97316","#ef4444","#a78bfa","#ec4899","#38bdf8","#4ade80","#fde68a"]:rank>=5?["#38bdf8","#818cf8","#e879f9","#bae6fd"]:["#fbbf24","#fde68a","#f97316"];
    return Array.from({length:count},(_,i)=>({ left:`${Math.random()*100}%`, delay:`${Math.random()*1400}ms`, dur:`${1500+Math.random()*1500}ms`, color:pal[i%pal.length], circle:i%3===0, sz:5+Math.floor(Math.random()*9) }));
  },[rank]);
  return <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">{items.map((it,i)=><div key={i} style={{ position:"absolute", left:it.left, top:-22, width:it.sz, height:it.sz, background:it.color, borderRadius:it.circle?"50%":"2px", animation:`confettiFall ${it.dur} ${it.delay} linear forwards` }}/>)}</div>;
}

// ?? CARD REVEAL widget ????????????????????????????????????????????????????????
function CardBadge({ card }: { card: CasinoCard }) {
  return (
    <div style={{ animation:"cardReveal 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}
      className="mx-auto mt-3 w-full max-w-[220px] overflow-hidden rounded-2xl border p-3 text-center"
      style2={{ border:`1.5px solid ${card.color}55`, background:`${card.color}18`, boxShadow:`0 0 18px ${card.color}40` }}>
      <div style={{ fontSize:32, marginBottom:4 }}>{card.emoji}</div>
      <p className="text-sm font-black" style={{ color:card.color }}>{card.name}</p>
      <p className="text-[11px] text-slate-400 mt-0.5">{card.desc}</p>
      <span className="mt-1.5 inline-block rounded-full border border-white/15 bg-white/8 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">Carte Casino</span>
    </div>
  );
}

function WinOverlay({ result, onClose }: { result: WinResult; onClose: () => void }) {
  if (result.rank < 3 && !result.card) return null;
  // For small rank wins that only have a card, show a simpler overlay
  if (result.rank < 3 && result.card) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <div className="absolute inset-0" style={{ background:"rgba(0,0,0,0.72)" }}/>
        <div className="relative z-10 w-full max-w-xs rounded-[1.75rem] border border-white/15 bg-[#0d0820] p-6 text-center"
          style={{ boxShadow:"0 20px 60px rgba(0,0,0,0.8)" }} onClick={e=>e.stopPropagation()}>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-300/80 mb-3">Carte surprise !</p>
          <div style={{ animation:"cardReveal 0.55s cubic-bezier(0.34,1.56,0.64,1) both" }}
            className="rounded-2xl border p-4 text-center"
            style2={{ border:`1.5px solid ${result.card.color}55`, background:`${result.card.color}18` }}>
            <div style={{ fontSize:44 }}>{result.card.emoji}</div>
            <p className="mt-1 text-base font-black" style={{ color:result.card.color }}>{result.card.name}</p>
            <p className="text-xs text-slate-400 mt-1">{result.card.desc}</p>
          </div>
          <button type="button" onClick={onClose} className="mt-4 w-full rounded-xl bg-violet-500/20 border border-violet-400/30 py-2.5 text-sm font-bold text-violet-100">{E.sparkle} Super !</button>
        </div>
      </div>
    );
  }

  const isJP=result.rank>=6, isSup=result.rank===5, isMoney=result.rank===4;
  const bgStyle=isJP?{background:"radial-gradient(ellipse 100% 100% at 50% 0%,rgba(139,0,255,0.6) 0%,rgba(10,5,20,0.97) 60%)"}:isSup?{background:"radial-gradient(ellipse 100% 100% at 50% 0%,rgba(14,100,190,0.55) 0%,rgba(5,10,20,0.97) 60%)"}:{background:"radial-gradient(ellipse 100% 100% at 50% 0%,rgba(20,120,40,0.5) 0%,rgba(5,12,8,0.97) 60%)"};
  const borderC=isJP?"rgba(251,191,36,0.5)":isSup?"rgba(56,189,248,0.4)":"rgba(74,222,128,0.4)";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={onClose}>
      <Confetti rank={result.rank}/>
      <div className="absolute inset-0" style={{ background:"rgba(0,0,0,0.78)" }}/>
      <div className="relative z-10 w-full max-w-sm my-4 rounded-[2rem] p-7 text-center"
        style={{ ...bgStyle, border:`2px solid ${borderC}`, boxShadow:isJP?"0 0 80px rgba(251,191,36,0.4),0 0 0 1px rgba(251,191,36,0.1) inset":"0 30px 80px rgba(0,0,0,0.85)" }}
        onClick={e=>e.stopPropagation()}>
        <div className="mb-4">
          {isJP   && <div className="relative"><CSSRainbow/><div className="relative z-10 mt-2 flex flex-col items-center"><CartoonChest/><div className="mt-3 flex gap-3 text-3xl">{[E.sparkle,E.coins,E.party,E.coins,E.sparkle].map((em,i)=><span key={i} style={{ animation:`floatUp ${1.2+i*.18}s ease-in-out ${i*.15}s infinite` }}>{em}</span>)}</div></div></div>}
          {isSup  && <div className="flex flex-col items-center gap-3"><DiamondDraw/><div className="flex gap-2 text-2xl">{[E.sparkle,E.gem,E.sparkle,E.boom,E.sparkle].map((em,i)=><span key={i} style={{ animation:`floatUp ${1+i*.2}s ease-in-out ${i*.12}s infinite` }}>{em}</span>)}</div></div>}
          {isMoney && <MoneyScene/>}
          {result.rank===3 && <div style={{ fontSize:80, animation:"moneyBounce 0.9s ease-in-out infinite" }}>{E.grad}</div>}
        </div>

        <h2 className="text-2xl font-black sm:text-3xl"
          style={isJP?{background:"linear-gradient(90deg,#fbbf24,#f97316,#ef4444,#a78bfa,#38bdf8)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"jackpotPulse 1.1s ease-in-out infinite"}
            :isSup?{background:"linear-gradient(90deg,#38bdf8,#a78bfa,#e879f9)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}
            :isMoney?{color:"#4ade80"}:{color:"#fb923c"}}>
          {result.label}
        </h2>

        <div className="mt-3 space-y-1.5">
          {result.jetons>0 && <p className="flex items-center justify-center gap-2 text-sm font-semibold text-amber-200"><span>{E.coins}</span>+{result.jetons} jetons</p>}
          {result.prestige>0 && <p className="flex items-center justify-center gap-2 text-sm font-semibold text-violet-300"><span>{E.sparkle}</span>+{result.prestige} prestige</p>}
          {result.prismatic && <p className="flex items-center justify-center gap-2 text-sm font-bold text-pink-300"><span>{E.rainbow}</span>Carte Prismatique obtenue !</p>}
        </div>

        {/* Bonus card */}
        {result.card && (
          <div className="mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300/70 mb-2">{E.card} Carte Bonus !</p>
            <div style={{ animation:"cardReveal 0.5s 0.3s cubic-bezier(0.34,1.56,0.64,1) both", border:`1.5px solid ${result.card.color}55`, background:`${result.card.color}18`, borderRadius:16 }}
              className="p-3 text-center">
              <span style={{ fontSize:36 }}>{result.card.emoji}</span>
              <p className="text-sm font-black mt-1" style={{ color:result.card.color }}>{result.card.name}</p>
              <p className="text-[11px] text-slate-400">{result.card.desc}</p>
            </div>
          </div>
        )}

        <button type="button" onClick={onClose}
          className="mt-5 w-full rounded-2xl py-3 text-sm font-black tracking-wider text-slate-950"
          style={{ background:isJP?"linear-gradient(135deg,#fbbf24,#f97316)":isSup?"linear-gradient(135deg,#38bdf8,#818cf8)":isMoney?"linear-gradient(135deg,#4ade80,#22c55e)":"#fb923c" }}>
          {isJP?`${E.hype} Incroyable !`:isSup?`${E.fire} Super !`:isMoney?`${E.moneym} Trop fort !`:`${E.sparkle} Bien jou\u00e9 !`}
        </button>
      </div>
    </div>
  );
}

// ?? REEL (real spin animation) ????????????????????????????????????????????????
const CELL_H = 78;

function Reel({ mid, spinning, finalMid, spinDuration }: { mid:string; spinning:boolean; finalMid:string; spinDuration:number }) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [stripSyms, setStripSyms] = useState<string[]>(() => [symNeighbor(mid,-1), mid, symNeighbor(mid,+1)]);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevSpin = useRef(false);

  useEffect(() => {
    if (spinning === prevSpin.current) return;
    prevSpin.current = spinning;
    if (spinning) {
      const rows = Math.floor(spinDuration / 70);
      const strip: string[] = [];
      for (let i=0; i<rows; i++) strip.push(weightedRandom().emoji);
      strip.push(symNeighbor(finalMid,-1), finalMid, symNeighbor(finalMid,+1));
      setStripSyms(strip);
      setIsAnimating(true);
    } else {
      setTimeout(() => {
        setIsAnimating(false);
        setStripSyms([symNeighbor(finalMid,-1), finalMid, symNeighbor(finalMid,+1)]);
        const el = innerRef.current;
        if (el) { el.style.transition="none"; el.style.transform="translateY(0)"; }
      }, 180);
    }
  }, [spinning, finalMid, spinDuration]);

  useEffect(() => {
    if (!isAnimating || !innerRef.current) return;
    const el = innerRef.current;
    const rows = Math.floor(spinDuration / 70);
    el.style.transition = "none";
    el.style.transform   = "translateY(0)";
    void el.offsetHeight;
    el.style.transition  = `transform ${spinDuration}ms cubic-bezier(0.16,0.01,0.06,1.0)`;
    el.style.transform   = `translateY(${-rows * CELL_H}px)`;
  }, [isAnimating, spinDuration]);

  const sym = symByEmoji(isAnimating ? (stripSyms[0]??mid) : mid);
  const midIdx = isAnimating ? -1 : 1;

  return (
    <div style={{ width:"31%", height:CELL_H*3, overflow:"hidden", position:"relative",
      borderRadius:14, background:"linear-gradient(180deg,#180812 0%,#0b0409 50%,#180812 100%)",
      border:"1.5px solid rgba(255,255,255,0.07)",
      boxShadow:!spinning?`0 0 24px ${sym.glow}`:"none", transition:"box-shadow 0.4s" }}>

      {/* top/bottom fade � creates slot-machine depth */}
      <div style={{ position:"absolute", top:0, left:0, right:0, height:CELL_H*0.72, zIndex:3, background:"linear-gradient(to bottom,#0b0409 18%,transparent)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:0, left:0, right:0, height:CELL_H*0.72, zIndex:3, background:"linear-gradient(to top,#0b0409 18%,transparent)", pointerEvents:"none" }}/>

      <div ref={innerRef} style={{ display:"flex", flexDirection:"column" }}>
        {stripSyms.map((s,i) => {
          const sd = symByEmoji(s); const isMid = i===midIdx;
          return (
            <div key={i} style={{ height:CELL_H, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", userSelect:"none" }}>
              <span style={{ fontSize:"2.65rem", lineHeight:1, opacity:isMid?1:isAnimating?0.65:0.3, textShadow:isMid?`0 0 20px ${sd.glow},0 0 40px ${sd.glow}`:"none", transition:"opacity 0.25s,text-shadow 0.25s" }}>{s}</span>
              {isMid && <span style={{ fontSize:"8.5px", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.16em", color:sd.color, opacity:0.72, marginTop:3 }}>{sd.name}</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ?? MAIN ??????????????????????????????????????????????????????????????????????
export default function CasinoSlots({ profil, onXPGagne }: Props) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const [coins, setCoins]         = useState(5);
  const [reelMids, setReelMids]   = useState<[string,string,string]>([E.grad, E.cherry, E.lemon]);
  const [reelSpin, setReelSpin]   = useState<[boolean,boolean,boolean]>([false,false,false]);
  const [finalMids, setFinalMids] = useState<[string,string,string]>([E.grad, E.cherry, E.lemon]);
  const [result, setResult]       = useState<WinResult|null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [busy, setBusy]           = useState(false);
  const [gainAffiche, setGainAffiche] = useState<string|null>(null);

  const [quizPhase, setQuizPhase] = useState<"idle"|"question"|"answered">("idle");
  const [currentQ, setCurrentQ]   = useState<QuizQ|null>(null);
  const [lastCorrect, setLastCorrect] = useState<boolean|null>(null);
  const [usedQIdxs, setUsedQIdxs] = useState<number[]>([]);

  const SPIN_DUR: [number,number,number] = [850, 1600, 2300];
  const isSpinning = reelSpin.some(Boolean);

  const doSpin = () => {
    if (coins < 1 || isSpinning) return;
    setCoins(c => c - 1);
    setResult(null); setShowOverlay(false); setGainAffiche(null);
    const f: [string,string,string] = [weightedRandom().emoji, weightedRandom().emoji, weightedRandom().emoji];
    setFinalMids(f);
    setReelSpin([true,true,true]);
    setTimeout(() => setReelSpin(p=>[false,p[1],p[2]]), SPIN_DUR[0]);
    setTimeout(() => setReelSpin(p=>[p[0],false,p[2]]), SPIN_DUR[1]);
    setTimeout(() => {
      setReelSpin([false,false,false]);
      setReelMids(f);
      const win = evalWin(f[0], f[1], f[2]);
      setResult(win);
      if (win.rank >= 3 || win.card) setTimeout(() => setShowOverlay(true), 350);
      if (win.jetons > 0 || win.prismatic || win.card) void creditWin(win);
    }, SPIN_DUR[2]);
  };

  // Simplified: no daily cap, always credit
  const creditWin = useCallback(async (win: WinResult) => {
    const user = auth.currentUser; if (!user) return;
    if (xpRewardsSuspended) {
      setGainAffiche(PLATFORM_XP_BLOCKED_MESSAGE);
      return;
    }
    setBusy(true);
    try {
      const ref = doc(db, "users", user.uid);
      const added = await runTransaction(db, async tx => {
        const snap = await tx.get(ref); if (!snap.exists()) return 0;
        const data = snap.data() as Record<string,unknown>;
        const total = win.jetons + win.prestige;
        const upd: Record<string,unknown> = {};
        if (total > 0) upd.xp = Number(data.xp ?? 0) + total;
        if (win.prismatic) {
          const ex = (data.prismaticCards as string[]|undefined) ?? [];
          upd.prismaticCards = [...ex, `PRISM_${Date.now()}`];
        }
        if (win.card) {
          const ex = (data.casinoCards as string[]|undefined) ?? [];
          upd.casinoCards = [...ex, { ...win.card, wonAt: Date.now() }];
        }
        if (Object.keys(upd).length > 0) tx.update(ref, upd);
        return total;
      });
      if (added > 0) setGainAffiche(formatJetonsDelta(added));
      else if (win.prismatic || win.card) setGainAffiche(`${E.card} Carte obtenue !`);
      onXPGagne?.();
    } catch(e) { console.error("creditWin error:", e); }
    finally { setBusy(false); }
  }, [onXPGagne, xpRewardsSuspended]);

  const drawQuestion = () => {
    const avail = CASINO_QUIZ.map((_,i)=>i).filter(i=>!usedQIdxs.includes(i));
    const pool  = avail.length>0 ? avail : CASINO_QUIZ.map((_,i)=>i);
    const idx   = pool[Math.floor(Math.random()*pool.length)];
    setCurrentQ(CASINO_QUIZ[idx]);
    setUsedQIdxs(p=>[...p.slice(-8), idx]);
    setQuizPhase("question"); setLastCorrect(null);
  };
  const answerQ = (i: number) => {
    if (!currentQ) return;
    const ok = i===currentQ.ok;
    setLastCorrect(ok);
    setCoins(c => c + (ok ? 3 : 1));   // NO cap � accumulate freely
    setQuizPhase("answered");
  };

  const prenom = profil?.prenom || "toi";

  return (
    <div className="relative min-h-screen overflow-x-hidden pb-28 text-slate-100"
      style={{ background:"radial-gradient(ellipse 100% 60% at 50% 0%,rgba(180,0,50,0.2) 0%,transparent 60%),#050209" }}>
      <style>{CASINO_CSS}</style>
      <div className="pointer-events-none absolute inset-0" style={{ background:"radial-gradient(ellipse 60% 40% at 20% 30%,rgba(180,83,9,0.13) 0%,transparent 55%),radial-gradient(ellipse 50% 35% at 80% 70%,rgba(124,58,237,0.1) 0%,transparent 50%)" }}/>
      {showOverlay && result && (result.rank>=3 || result.card) && <WinOverlay result={result} onClose={()=>setShowOverlay(false)}/>}

      <div className="relative z-10 mx-auto max-w-lg px-3 pt-7 sm:pt-10">

        {/* Header */}
        <header className="mb-6 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="rounded-full border border-red-400/25 bg-red-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-red-200/90">Casino STMG</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl"
            style={{ background:"linear-gradient(135deg,#fbbf24 0%,#f97316 35%,#ef4444 70%,#ec4899 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            Fortune STMG
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Salut <span className="font-semibold text-amber-300">{prenom}</span> {E.hype}{" "}
            � gagne des pi\u00e8ces et tente ta chance !
          </p>
        </header>

        {/* Coins � no limit, show as number */}
        <div className="mb-5 flex items-center justify-between rounded-2xl border border-amber-400/20 bg-amber-500/8 px-5 py-4 backdrop-blur-xl">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-amber-400/70">Pièces Casino</p>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-4xl font-black tabular-nums text-amber-300" style={{ animation: coins>0?"coinPop 0.3s ease-out":"none" }}>{coins}</span>
              <span className="text-sm text-amber-500/60">pi\u00e8ce{coins>1?"s":""}</span>
            </div>
          </div>
          <div className="text-5xl select-none" style={{ filter:"drop-shadow(0 0 12px #fbbf24)" }}>{E.coins}</div>
        </div>

        {/* Machine */}
        <div className="relative mb-5 overflow-hidden rounded-[1.75rem]"
          style={{ background:"linear-gradient(180deg,#1c0a10 0%,#0f0508 100%)", boxShadow:"0 0 0 2px rgba(251,191,36,0.35) inset,0 24px 80px -20px rgba(239,68,68,0.4),0 0 120px -40px rgba(251,191,36,0.2)" }}>

          <div className="flex items-center justify-center gap-3 py-3" style={{ background:"linear-gradient(90deg,transparent,rgba(251,191,36,0.08),transparent)" }}>
            <span className="select-none">{E.slot}</span>
            <span className="font-black uppercase tracking-[0.3em] text-xs" style={{ background:"linear-gradient(90deg,#fbbf24,#f97316)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>Fortune STMG</span>
            <span className="select-none">{E.slot}</span>
          </div>

          {/* Reels � no win-line bar */}
          <div className="mx-4 mb-4 flex gap-2 rounded-2xl p-3"
            style={{ background:"linear-gradient(180deg,#0a0210 0%,#070110 100%)", border:"1.5px solid rgba(255,255,255,0.05)", boxShadow:"inset 0 2px 14px rgba(0,0,0,0.85)" }}>
            {([0,1,2] as const).map(i=>(
              <Reel key={i} mid={reelMids[i]} spinning={reelSpin[i]} finalMid={finalMids[i]} spinDuration={SPIN_DUR[i]}/>
            ))}
          </div>

          {/* Small win / miss banner */}
          {result && (result.rank>0 && result.rank<3 && !result.card || result.rank===0) && (
            <div className={`mx-4 mb-4 rounded-2xl border p-3 text-center ${result.rank>0?"border-slate-400/20 bg-white/4":"border-slate-700/25"}`}>
              <p className={`text-sm font-bold ${result.rank>0?"text-slate-200":"text-slate-600"}`}>{result.label}</p>
              {result.jetons>0 && <p className="mt-1 text-xs text-amber-300 font-semibold" style={{ animation:"coinPop 0.4s ease-out" }}>+{result.jetons} jetons {E.coins}</p>}
              {busy && <p className="mt-1 text-xs text-slate-500">Enregistrement...</p>}
              {gainAffiche && !busy && <p className="mt-1 text-xs font-bold text-emerald-300">{gainAffiche}</p>}
            </div>
          )}

          {/* Spin button */}
          <div className="mx-4 mb-4">
            <button type="button" disabled={coins<1||isSpinning||busy} onClick={doSpin}
              className="w-full rounded-2xl py-4 text-base font-black tracking-wider text-white transition active:scale-[0.98] disabled:opacity-40"
              style={{ background:coins>=1&&!isSpinning?"linear-gradient(135deg,#dc2626,#b91c1c,#991b1b)":"#1f1010", boxShadow:coins>=1&&!isSpinning?"0 8px 32px -8px rgba(239,68,68,0.65),0 0 0 1px rgba(251,191,36,0.3) inset":"none" }}>
              {isSpinning
                ? <span className="flex items-center justify-center gap-2"><span style={{ display:"inline-block", animation:"spinSlow 1s linear infinite" }}>{E.gear}</span> En cours...</span>
                : coins<1 ? "Gagne des pi\u00e8ces pour jouer !"
                : <span className="flex items-center justify-center gap-2">
                    <span>{E.slot}</span><span>SPIN</span>
                    <span className="rounded-lg border border-amber-400/40 bg-amber-400/15 px-1.5 py-0.5 text-xs font-bold text-amber-200">{"\u22121 pi\u00e8ce"}</span>
                  </span>
              }
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="mb-5 rounded-2xl border border-white/8 bg-white/[0.03] p-3 backdrop-blur-xl">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">Table des gains (3x) + carte bonus aléatoire possible</p>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { s:E.rainbow, l:"Prismatique", g:"Carte+100j+200p", c:"#e879f9" },
              { s:E.gem,     l:"Diamant",     g:"50j + 50 prestige",c:"#38bdf8" },
              { s:E.moneym,  l:"Jackpot",     g:"30j + 20 prestige",c:"#4ade80" },
              { s:E.grad,    l:"Dipl\u00f4me", g:"15 jetons",        c:"#fb923c" },
              { s:E.cherry,  l:"Cerise",       g:"8 jetons",         c:"#f87171" },
              { s:E.lemon,   l:"Citron",       g:"5 jetons",         c:"#fde047" },
            ].map(({s,l,g,c})=>(
              <div key={s} className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-black/20 px-2 py-1.5">
                <span className="text-lg select-none">{s}</span>
                <div><p className="text-[10px] font-semibold" style={{ color:c }}>{l}</p><p className="text-[9px] text-slate-600">{g}</p></div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[9px] text-slate-700">Paire = 3j &nbsp;&bull;&nbsp; {E.rainbow} solo = 5j &nbsp;&bull;&nbsp; {E.card} Carte al\u00e9atoire sur certains gains</p>
        </div>

        {/* Quiz */}
        <div className="rounded-[1.35rem] border border-violet-400/25 backdrop-blur-2xl"
          style={{ background:"linear-gradient(135deg,rgba(124,58,237,0.12) 0%,rgba(15,5,25,0.88) 60%)", boxShadow:"0 0 60px -22px rgba(139,92,246,0.4)" }}>
          <div className="p-4">
            <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300/80">Gagner des pièces</p>
            <p className="text-sm text-slate-400">Bonne réponse : <span className="font-bold text-amber-300">+3 pièces</span>{" \u2022 "}Mauvaise : <span className="font-semibold text-slate-300">+1 pièce</span>{" \u2022 "}<span className="text-slate-500">Pas de limite !</span></p>
          </div>

          {quizPhase==="idle" && (
            <div className="px-4 pb-4">
              <button type="button" onClick={drawQuestion}
                className="w-full rounded-2xl border border-violet-400/30 bg-violet-500/15 py-3 text-sm font-bold text-violet-100 transition hover:bg-violet-500/22">
                Tirer une question →
              </button>
            </div>
          )}

          {quizPhase==="question" && currentQ && (
            <div className="px-4 pb-4">
              <p className="mb-4 text-sm font-semibold leading-snug text-white sm:text-base">{currentQ.q}</p>
              <div className="grid gap-2.5">
                {currentQ.choices.map((c,i)=>(
                  <button key={i} type="button" onClick={()=>answerQ(i)}
                    className="rounded-xl border border-white/10 bg-white/[0.055] px-4 py-3 text-left text-sm font-medium text-slate-100 transition hover:border-violet-400/40 hover:bg-violet-500/10 active:scale-[0.99]">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {quizPhase==="answered" && currentQ && (
            <div className="px-4 pb-4">
              <div className={`mb-4 rounded-xl border p-3 text-center ${lastCorrect?"border-emerald-400/40 bg-emerald-500/12":"border-rose-400/30 bg-rose-500/10"}`}>
                <p className={`font-bold ${lastCorrect?"text-emerald-300":"text-rose-300"}`}>
                  {lastCorrect?`${E.ok} Correct ! +3 pi\u00e8ces`:`${E.nok} Mauvaise r\u00e9ponse +1 pi\u00e8ce`}
                </p>
                {!lastCorrect && <p className="mt-1 text-xs text-slate-400">Réponse : <span className="font-semibold text-slate-200">{currentQ.choices[currentQ.ok]}</span></p>}
              </div>
              <button type="button" onClick={()=>{ setQuizPhase("idle"); setCurrentQ(null); }}
                className="w-full rounded-2xl border border-violet-400/30 bg-violet-500/15 py-3 text-sm font-bold text-violet-100 transition hover:bg-violet-500/22">
                Autre question →
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
