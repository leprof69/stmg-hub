import { useCallback, useEffect, useRef, useState } from "react";
import { auth, db } from "../services/firebase";
import { doc, runTransaction } from "firebase/firestore";
import { formatJetonsDelta } from "../lib/jetons";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";

// ?? Emoji constants ?????????????????????????????????????????????????????????
const E = {
  micro: "\u{1F3A4}",  // ??
  star:  "\u{2B50}",   // ?
  trophy:"\u{1F3C6}",  // ??
  ok:    "\u{2705}",   // ?
  nok:   "\u{274C}",   // ?
  fire:  "\u{1F525}",  // ??
  hype:  "\u{1F973}",  // ??
  clap:  "\u{1F44F}",  // ??
  sweat: "\u{1F625}",  // ??
  angry: "\u{1F620}",  // ??
  wow:   "\u{1F92F}",  // ??
  think: "\u{1F914}",  // ??
  coins: "\u{1F4B0}",  // ??
  card:  "\u{1F0CF}",  // ??
  medal: "\u{1F3C5}",  // ??
  gem:   "\u{1F48E}",  // ??
  spark: "\u{2728}",   // ?
  cross: "\u{274C}",   // ?
  check: "\u{2714}",   // ?
};

type Props = { profil: { prenom?: string }; onXPGagne?: () => void };

// ?? JURORS ???????????????????????????????????????????????????????????????????
type Juror = {
  id: string; name: string; title: string; desc: string;
  difficulty: 1|2|3;
  suitColor: string; tieColor: string; skinTone: string;
  hairColor: string; hasGlasses: boolean; isWoman: boolean;
  glowColor: string; accentColor: string; bgGrad: string;
};

const JURORS: Juror[] = [
  {
    id:"moreau",
    name:"Prof. Moreau",
    title:"Expert Comptable",
    desc:"Pr\u00e9cis et m\u00e9ticuleux. Il v\u00e9rifie chaque centimes.",
    difficulty:1,
    suitColor:"#1e3a5f", tieColor:"#ef4444", skinTone:"#f5e6c8", hairColor:"#aaa",
    hasGlasses:true, isWoman:false,
    glowColor:"rgba(59,130,246,0.6)", accentColor:"#3b82f6",
    bgGrad:"radial-gradient(ellipse 120% 80% at 50% -10%,rgba(30,58,95,0.55) 0%,transparent 65%)",
  },
  {
    id:"lefebvre",
    name:"Mme Lef\u00e8bvre",
    title:"Directrice Marketing",
    desc:"Brillante et exigeante. Elle adore les bonnes strat\u00e9gies.",
    difficulty:2,
    suitColor:"#7c1c2e", tieColor:"#f97316", skinTone:"#fde8c8", hairColor:"#3d1f0f",
    hasGlasses:false, isWoman:true,
    glowColor:"rgba(220,38,38,0.5)", accentColor:"#ef4444",
    bgGrad:"radial-gradient(ellipse 120% 80% at 50% -10%,rgba(124,28,46,0.5) 0%,transparent 65%)",
  },
  {
    id:"supreme",
    name:"Le Jury Supr\u00eame",
    title:"Jury d'Excellence",
    desc:"Les trois l\u00e9gendes de STMG. Seuls les meilleurs passent.",
    difficulty:3,
    suitColor:"#2d1b00", tieColor:"#fbbf24", skinTone:"#f5e6c8", hairColor:"#888",
    hasGlasses:false, isWoman:false,
    glowColor:"rgba(251,191,36,0.6)", accentColor:"#fbbf24",
    bgGrad:"radial-gradient(ellipse 120% 80% at 50% -10%,rgba(120,80,0,0.55) 0%,transparent 65%)",
  },
];

// ?? SVG JUROR CHARACTERS ?????????????????????????????????????????????????????
type Reaction = "neutral"|"pleased"|"displeased";

function JurorBody({ j, reaction }: { j: Juror; reaction: Reaction }) {
  const pl = reaction==="pleased", di = reaction==="displeased";
  if (j.id === "supreme") {
    // Three figures
    const xs = [25, 70, 115], sizes = [18, 24, 18], suits = ["#2a1800","#3d2600","#2a1800"];
    return (
      <svg width="160" height="155" viewBox="0 0 160 155" style={{ display:"block", margin:"0 auto" }}>
        {xs.map((cx, i) => {
          const r = sizes[i]; const headY = 52 - (i===1?8:0); const bodyY = headY + r + 2;
          return (
            <g key={i}>
              <rect x={cx-r*0.9} y={bodyY} width={r*1.8} height={155-bodyY} rx={4} fill={suits[i]}/>
              {i===1 && <polygon points={`${cx},${bodyY+2} ${cx+5},${bodyY+2} ${cx+2},${bodyY+28}`} fill="#fbbf24"/>}
              <circle cx={cx} cy={headY} r={r} fill={j.skinTone}/>
              {/* Eyes */}
              <circle cx={cx-r*0.35} cy={headY-1} r={pl?3.5:2.5} fill="#2c2c2c"/>
              <circle cx={cx+r*0.35} cy={headY-1} r={pl?3.5:2.5} fill="#2c2c2c"/>
              {/* Mouth */}
              {pl && <path d={`M${cx-r*.45} ${headY+r*.45} Q${cx} ${headY+r*.65} ${cx+r*.45} ${headY+r*.45}`} stroke="#c49a6c" strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
              {di && <path d={`M${cx-r*.45} ${headY+r*.55} Q${cx} ${headY+r*.4} ${cx+r*.45} ${headY+r*.55}`} stroke="#c49a6c" strokeWidth="2.5" fill="none" strokeLinecap="round"/>}
              {!pl && !di && <line x1={cx-r*.38} y1={headY+r*.5} x2={cx+r*.38} y2={headY+r*.5} stroke="#c49a6c" strokeWidth="2.5" strokeLinecap="round"/>}
              {/* hair */}
              <path d={`M${cx-r*.95} ${headY-r*.4} Q${cx} ${headY-r*1.35} ${cx+r*.95} ${headY-r*.4}`} fill="#888" opacity="0.7"/>
              {/* crown center */}
              {i===1 && <polygon points={`${cx},${headY-r-8} ${cx-7},${headY-r+4} ${cx+7},${headY-r+4}`} fill="#fbbf24"/>}
            </g>
          );
        })}
      </svg>
    );
  }

  // Single character
  const cx=70, hy=52, hr=32;
  const mouthPath = pl
    ? `M${cx-hr*.55} ${hy+hr*.5} Q${cx} ${hy+hr*.72} ${cx+hr*.55} ${hy+hr*.5}`
    : di
    ? `M${cx-hr*.55} ${hy+hr*.62} Q${cx} ${hy+hr*.46} ${cx+hr*.55} ${hy+hr*.62}`
    : null;
  const browL = di ? `M${cx-hr*.75} ${hy-hr*.62} L${cx-hr*.22} ${hy-hr*.5}` : `M${cx-hr*.75} ${hy-hr*.68} Q${cx-hr*.45} ${hy-hr*.8} ${cx-hr*.22} ${hy-hr*.6}`;
  const browR = di ? `M${cx+hr*.22} ${hy-hr*.5} L${cx+hr*.75} ${hy-hr*.62}` : `M${cx+hr*.22} ${hy-hr*.6} Q${cx+hr*.45} ${hy-hr*.8} ${cx+hr*.75} ${hy-hr*.68}`;

  return (
    <svg width="140" height="165" viewBox="0 0 140 165" style={{ display:"block", margin:"0 auto" }}>
      {/* Suit body */}
      <path d={`M22 88 Q32 75 50 72 L50 84 L${cx} 96 L90 84 L90 72 Q108 75 118 88 L118 165 L22 165 Z`} fill={j.suitColor}/>
      {/* Shirt */}
      <path d={`M50 72 L50 86 L${cx} 96 L90 86 L90 72`} fill="white" opacity="0.92"/>
      {/* Tie / Bow */}
      {!j.isWoman && <polygon points={`${cx},74 ${cx+6},74 ${cx+3},100`} fill={j.tieColor}/>}
      {j.isWoman && (
        <>
          <ellipse cx={cx-12} cy={76} rx={6} ry={5} fill={j.tieColor} opacity={0.85}/>
          <ellipse cx={cx+12} cy={76} rx={6} ry={5} fill={j.tieColor} opacity={0.85}/>
          <circle cx={cx} cy={76} r={5} fill={j.tieColor}/>
        </>
      )}
      {/* Collar lapels */}
      <path d={`M50 73 L38 60`} stroke={j.suitColor} strokeWidth="4" strokeLinecap="round"/>
      <path d={`M90 73 L102 60`} stroke={j.suitColor} strokeWidth="4" strokeLinecap="round"/>
      {/* Neck */}
      <rect x={cx-12} y={hy+hr-4} width={24} height={14} rx={8} fill={j.skinTone}/>
      {/* Head */}
      <ellipse cx={cx} cy={hy} rx={hr+2} ry={hr+4} fill={j.skinTone}/>
      {/* Hair */}
      {j.isWoman
        ? <path d={`M${cx-hr-2} ${hy-8} Q${cx-hr+4} ${hy-hr*1.55} ${cx} ${hy-hr*1.6} Q${cx+hr-4} ${hy-hr*1.55} ${cx+hr+2} ${hy-8} L${cx+hr+2} ${hy+hr*.5} Q${cx+hr+8} ${hy+hr*.8} ${cx+hr+4} ${hy+hr*1.1} L${cx+hr-4} ${hy+hr*.9} L${cx-hr+4} ${hy+hr*.9} L${cx-hr-4} ${hy+hr*1.1} Q${cx-hr-8} ${hy+hr*.8} ${cx-hr-2} ${hy+hr*.5} Z`} fill={j.hairColor}/>
        : <path d={`M${cx-hr-1} ${hy-hr*.35} Q${cx} ${hy-hr*1.5} ${cx+hr+1} ${hy-hr*.35}`} fill={j.hairColor} opacity="0.85"/>
      }
      {/* Glasses */}
      {j.hasGlasses && (
        <>
          <rect x={cx-hr*.82} y={hy-hr*.22} width={hr*.7} height={hr*.5} rx={hr*.22} fill="none" stroke="#555" strokeWidth="2.5"/>
          <rect x={cx+hr*.14} y={hy-hr*.22} width={hr*.7} height={hr*.5} rx={hr*.22} fill="none" stroke="#555" strokeWidth="2.5"/>
          <line x1={cx-hr*.12} y1={hy+hr*.02} x2={cx+hr*.14} y2={hy+hr*.02} stroke="#555" strokeWidth="2"/>
        </>
      )}
      {/* Eyes */}
      <ellipse cx={cx-hr*.38} cy={hy+hr*.02} rx={j.hasGlasses?3.5:4.5} ry={j.isWoman?5:4} fill="white"/>
      <ellipse cx={cx+hr*.38} cy={hy+hr*.02} rx={j.hasGlasses?3.5:4.5} ry={j.isWoman?5:4} fill="white"/>
      <circle cx={cx-hr*.36+.5} cy={hy+hr*.06} r={j.hasGlasses?2.5:3} fill="#1a1a2e"/>
      <circle cx={cx+hr*.36+.5} cy={hy+hr*.06} r={j.hasGlasses?2.5:3} fill="#1a1a2e"/>
      {/* Eye shine */}
      <circle cx={cx-hr*.3} cy={hy} r={1} fill="white" opacity={0.7}/>
      <circle cx={cx+hr*.44} cy={hy} r={1} fill="white" opacity={0.7}/>
      {/* Lashes (woman) */}
      {j.isWoman && (
        <>
          {[-12,-6,0,6,12].map(x=><line key={x} x1={cx-hr*.38+x*.15} y1={hy-hr*.08} x2={cx-hr*.38+x*.13} y2={hy-hr*.22} stroke="#3d1f0f" strokeWidth="1.5" strokeLinecap="round"/>)}
          {[-12,-6,0,6,12].map(x=><line key={x} x1={cx+hr*.38+x*.15} y1={hy-hr*.08} x2={cx+hr*.38+x*.13} y2={hy-hr*.22} stroke="#3d1f0f" strokeWidth="1.5" strokeLinecap="round"/>)}
        </>
      )}
      {/* Eyebrows */}
      <path d={browL} stroke={j.isWoman?"#3d1f0f":"#7a6a5a"} strokeWidth="3" strokeLinecap="round" fill="none"/>
      <path d={browR} stroke={j.isWoman?"#3d1f0f":"#7a6a5a"} strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Nose */}
      <path d={`M${cx-5} ${hy+hr*.3} Q${cx} ${hy+hr*.42} ${cx+5} ${hy+hr*.3}`} stroke="#c49a6c" strokeWidth="1.8" fill="none" opacity="0.7"/>
      {/* Mouth */}
      {mouthPath
        ? <path d={mouthPath} stroke="#b88060" strokeWidth="3" fill="none" strokeLinecap="round"/>
        : <line x1={cx-hr*.42} y1={hy+hr*.56} x2={cx+hr*.42} y2={hy+hr*.56} stroke="#b88060" strokeWidth="3" strokeLinecap="round"/>
      }
      {/* Lipstick (woman) */}
      {j.isWoman && pl && <path d={`M${cx-hr*.55} ${hy+hr*.5} Q${cx} ${hy+hr*.72} ${cx+hr*.55} ${hy+hr*.5}`} fill={j.tieColor} opacity="0.4"/>}
    </svg>
  );
}

// ?? QUIZ POOL ????????????????????????????????????????????????????????????????
type Q = { q: string; choices: [string,string,string,string]; ok: number; cat: string };

const QUIZ_POOL: Q[] = [
  { q:"La valeur ajout\u00e9e (VA) = CA \u2212 :", choices:["Salaires","Imp\u00f4ts","Consommations interm\u00e9diaires","Dividendes"], ok:2, cat:"Compta" },
  { q:"Le seuil de rentabilit\u00e9 est :", choices:["Le CA maximum","Le CA o\u00f9 r\u00e9sultat = 0","Le point mort","B et C \u00e0 la fois"], ok:3, cat:"Compta" },
  { q:"Le bilan recense actif et passif :", choices:["Sur l'ann\u00e9e","Au 31 d\u00e9cembre uniquement","\u00c0 une date donn\u00e9e","Chaque semestre"], ok:2, cat:"Compta" },
  { q:"Les charges fixes sont :", choices:["Variables selon l'activit\u00e9","Ind\u00e9pendantes du volume","Toujours nulles","Li\u00e9es aux mati\u00e8res premi\u00e8res"], ok:1, cat:"Compta" },
  { q:"CAF = Capacit\u00e9 d'auto-financement. Elle mesure :", choices:["Le b\u00e9n\u00e9fice net","Les flux de tr\u00e9sorerie potentiels","La valeur ajout\u00e9e","Le chiffre d'affaires"], ok:1, cat:"Compta" },
  { q:"Le marketing mix comprend :", choices:["2 variables","3 variables","4 variables (4P)","5 variables"], ok:2, cat:"Marketing" },
  { q:"La diff\u00e9renciation consiste \u00e0 :", choices:["Baisser ses prix","Se distinguer de la concurrence","Copier le leader","Fusionner avec un concurrent"], ok:1, cat:"Marketing" },
  { q:"La strat\u00e9gie de p\u00e9n\u00e9tration fixe un prix :", choices:["\u00c9lev\u00e9","Moyen","Bas","Variable"], ok:2, cat:"Marketing" },
  { q:"Le positionnement d'un produit = :", choices:["Sa place en rayon","L'image voulue dans l'esprit du consommateur","Son prix de vente","Sa date de lancement"], ok:1, cat:"Marketing" },
  { q:"Un march\u00e9 oligopolistique est domin\u00e9 par :", choices:["Un seul vendeur","Quelques grandes entreprises","Des milliers de PME","L'\u00c9tat uniquement"], ok:1, cat:"Marketing" },
  { q:"Le management participatif implique :", choices:["Des d\u00e9cisions uniquement hi\u00e9rarchiques","La participation des employ\u00e9s aux d\u00e9cisions","Une gestion centralis\u00e9e","La suppression des syndicats"], ok:1, cat:"Management" },
  { q:"Un organigramme repr\u00e9sente :", choices:["Le bilan","La structure hi\u00e9rarchique","Le compte de r\u00e9sultat","Le march\u00e9"], ok:1, cat:"Management" },
  { q:"L'int\u00e9gration verticale consiste \u00e0 :", choices:["Racheter un concurrent","Acqu\u00e9rir fournisseurs ou distributeurs","Ouvrir \u00e0 l'international","Cr\u00e9er une franchise"], ok:1, cat:"Management" },
  { q:"La DPO (Direction par Objectifs) est une m\u00e9thode de :", choices:["Comptabilit\u00e9","Management","Marketing","Finance"], ok:1, cat:"Management" },
  { q:"La RSE (Responsabilit\u00e9 Sociale Entreprise) concerne :", choices:["Uniquement les grandes entreprises","Les impacts \u00e9conomiques, sociaux et environnementaux","Seulement les aspects financiers","Le recrutement uniquement"], ok:1, cat:"Management" },
  { q:"SWOT analyse forces, faiblesses, opportunit\u00e9s et :", choices:["Strat\u00e9gies","Synergies","Menaces","Tendances"], ok:2, cat:"Strat\u00e9gie" },
  { q:"Une fusion-acquisition vise \u00e0 :", choices:["R\u00e9duire les co\u00fbts salariaux","Prendre le contr\u00f4le d'une autre entreprise","Lancer un nouveau produit","Prospecter \u00e0 l'export"], ok:1, cat:"Strat\u00e9gie" },
  { q:"Une entreprise en croissance externe :", choices:["Grandit seule par ses ventes","Grossit via rachat, fusion","R\u00e9duit ses effectifs","Externalise ses activit\u00e9s"], ok:1, cat:"Strat\u00e9gie" },
  { q:"Le BFR (Besoin en Fonds de Roulement) augmente quand :", choices:["Les ventes diminuent","Les stocks augmentent","Les dettes fournisseurs augmentent","La tr\u00e9sorerie s'am\u00e9liore"], ok:1, cat:"Finance" },
  { q:"Un effet de levier financier positif signifie :", choices:["L'entreprise est endett\u00e9e","La dette am\u00e9liore la rentabilit\u00e9 des capitaux propres","Les int\u00e9r\u00eats sont nuls","La capacit\u00e9 d'auto-financement est nulle"], ok:1, cat:"Finance" },
  { q:"La mondialisation favorise :", choices:["Les \u00e9changes nationaux","L'ouverture des fronti\u00e8res et les flux internationaux","La protection des march\u00e9s locaux","La r\u00e9duction des importations"], ok:1, cat:"Mondialisation" },
  { q:"Une joint-venture est :", choices:["Un type de franchise","Une coentreprise entre 2 soci\u00e9t\u00e9s","Une fusion compl\u00e8te","Un rachat hostile"], ok:1, cat:"Mondialisation" },
];

// ?? CSS ANIMATIONS ????????????????????????????????????????????????????????????
const GO_CSS = `
  @keyframes goSlideIn{0%{transform:translateY(28px);opacity:0}100%{transform:translateY(0);opacity:1}}
  @keyframes goShake{0%,100%{transform:translateX(0)}15%{transform:translateX(-9px) rotate(-1deg)}40%{transform:translateX(9px) rotate(1deg)}65%{transform:translateX(-6px)}85%{transform:translateX(5px)}}
  @keyframes goNod{0%,100%{transform:translateY(0) rotate(0)}30%{transform:translateY(-8px) rotate(-3deg)}70%{transform:translateY(-4px) rotate(2deg)}}
  @keyframes goPop{0%{transform:scale(0) translateY(0);opacity:0}50%{transform:scale(1.3) translateY(-18px);opacity:1}100%{transform:scale(0.9) translateY(-38px);opacity:0}}
  @keyframes goTimerPulse{0%,100%{opacity:1}50%{opacity:0.55}}
  @keyframes goFadeIn{0%{opacity:0;transform:scale(0.95)}100%{opacity:1;transform:scale(1)}}
  @keyframes goPrismatic{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
  @keyframes goFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
  @keyframes goHeartbeat{0%,100%{transform:scale(1)}30%{transform:scale(1.18)}60%{transform:scale(0.92)}}
  @keyframes goConfetti{0%{transform:translateY(-10px) rotate(0);opacity:1}100%{transform:translateY(90vh) rotate(720deg);opacity:0}}
`;

// ?? APPROVAL meter ???????????????????????????????????????????????????????????
function ApprovalBar({ approval, accent }: { approval: number; accent: string }) {
  const pct = Math.max(0, Math.min(100, approval));
  const color = pct < 25 ? "#ef4444" : pct < 50 ? "#f97316" : pct < 75 ? "#fbbf24" : pct < 90 ? "#84cc16" : "#22c55e";
  const face = pct < 25 ? E.angry : pct < 50 ? E.sweat : pct < 75 ? E.think : pct < 90 ? E.clap : E.wow;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: accent + "bb" }}>Approbation du jury</span>
        <div className="flex items-center gap-1.5">
          <span className="text-base select-none">{face}</span>
          <span className="text-sm font-black tabular-nums" style={{ color }}>{pct}%</span>
        </div>
      </div>
      <div className="relative h-4 w-full overflow-hidden rounded-full" style={{ background:"rgba(255,255,255,0.08)" }}>
        <div className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width:`${pct}%`, background:`linear-gradient(90deg,${color},${color === "#22c55e" ? "#4ade80" : color})`,
            boxShadow:`0 0 12px ${color}80`, transition:"width 0.6s cubic-bezier(0.34,1.1,0.64,1)" }}/>
        {/* win glow at 100% */}
        {pct >= 95 && <div className="absolute inset-0 rounded-full" style={{ background:"linear-gradient(90deg,transparent 70%,rgba(74,222,128,0.6))", animation:"goTimerPulse 0.8s infinite" }}/>}
      </div>
    </div>
  );
}

// ?? TIMER ????????????????????????????????????????????????????????????????????
const TIMER_TOTAL = 20;
const R = 22;
const CIRC = 2 * Math.PI * R;

function TimerRing({ timeLeft, accent }: { timeLeft: number; accent: string }) {
  const pct = timeLeft / TIMER_TOTAL;
  const offset = CIRC * (1 - pct);
  const color = timeLeft > 10 ? accent : timeLeft > 5 ? "#f97316" : "#ef4444";
  return (
    <div className="flex items-center gap-2.5">
      <svg width={56} height={56} viewBox="0 0 56 56">
        <circle cx={28} cy={28} r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={4}/>
        <circle cx={28} cy={28} r={R} fill="none" stroke={color} strokeWidth={4}
          strokeDasharray={CIRC} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 28 28)"
          style={{ transition:"stroke-dashoffset 1s linear, stroke 0.4s",
            filter: timeLeft <= 5 ? `drop-shadow(0 0 5px ${color})` : "none",
            animation: timeLeft <= 5 ? "goTimerPulse 0.5s infinite" : "none" }}/>
        <text x={28} y={33} textAnchor="middle" fontSize={15} fontWeight="900" fill={color}>{timeLeft}</text>
      </svg>
      <span className="text-xs text-slate-500">secondes</span>
    </div>
  );
}

// ?? FEEDBACK POPUP ????????????????????????????????????????????????????????????
function FeedbackPop({ text, color, key: k }: { text: string; color: string; key?: unknown }) {
  void k;
  return (
    <div className="pointer-events-none absolute left-1/2 top-8 z-20 -translate-x-1/2 text-xl font-black"
      style={{ color, textShadow:`0 0 16px ${color}`, animation:"goPop 0.9s ease-out forwards" }}>
      {text}
    </div>
  );
}

// ?? CONFETTI ??????????????????????????????????????????????????????????????????
function WinConfetti() {
  const items = Array.from({ length:55 }, (_,i) => ({
    left:`${Math.random()*100}%`, delay:`${Math.random()*1000}ms`, dur:`${1400+Math.random()*1400}ms`,
    color:["#fbbf24","#4ade80","#38bdf8","#a78bfa","#f97316","#ec4899"][i%6], sz:5+Math.floor(Math.random()*8),
  }));
  return (
    <div className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      {items.map((it,i) => <div key={i} style={{ position:"absolute", left:it.left, top:-20, width:it.sz, height:it.sz, background:it.color, borderRadius:i%3===0?"50%":"2px", animation:`goConfetti ${it.dur} ${it.delay} linear forwards` }}/>)}
    </div>
  );
}

// ?? MAIN COMPONENT ????????????????????????????????????????????????????????????
type Phase = "select"|"battle"|"result";

export default function GrandOral({ profil, onXPGagne }: Props) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const [phase, setPhase]       = useState<Phase>("select");
  const [juror, setJuror]       = useState<Juror | null>(null);
  const [approval, setApproval] = useState(30);
  const [combo, setCombo]       = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIMER_TOTAL);
  const [qIdx, setQIdx]         = useState<number[]>([]);
  const [current, setCurrent]   = useState<Q | null>(null);
  const [reaction, setReaction] = useState<Reaction>("neutral");
  const [feedback, setFeedback] = useState<{ text:string; color:string; id:number }|null>(null);
  const [answered, setAnswered] = useState(false);
  const [won, setWon]           = useState(false);
  const [wrongCt, setWrongCt]   = useState(0);
  const [result, setResult]     = useState<{jetons:number;prestige:number;mention:string;card:string|null}>({jetons:0,prestige:0,mention:"",card:null});
  const [jurorAnim, setJurorAnim] = useState<"none"|"nod"|"shake">("none");
  const [busy, setBusy]         = useState(false);
  const [gainAffiche, setGainAffiche] = useState<string|null>(null);

  const timerRef = useRef<number|null>(null);
  const popIdRef = useRef(0);

  // ?? Pick next question ??????????????????????????????????????????????????
  const nextQuestion = useCallback(() => {
    setAnswered(false);
    setTimeLeft(TIMER_TOTAL);
    setReaction("neutral");
    setQIdx(prev => {
      const available = QUIZ_POOL.map((_,i)=>i).filter(i => !prev.includes(i));
      const pool = available.length > 0 ? available : QUIZ_POOL.map((_,i)=>i);
      const picked = pool[Math.floor(Math.random() * pool.length)];
      setCurrent(QUIZ_POOL[picked]);
      return [...prev.slice(-10), picked];
    });
  }, []);

  // ?? Start battle ????????????????????????????????????????????????????????
  const startBattle = (j: Juror) => {
    setJuror(j); setPhase("battle"); setApproval(30); setCombo(0); setWrongCt(0);
    setWon(false); setQIdx([]); setFeedback(null); setJurorAnim("none");
    // slight delay for mount animation then first question
    setTimeout(() => nextQuestion(), 350);
  };

  // ?? Timer ???????????????????????????????????????????????????????????????
  useEffect(() => {
    if (phase !== "battle" || answered || !current) return;
    timerRef.current = window.setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { handleAnswer(-1); return TIMER_TOTAL; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [phase, current, answered]); // eslint-disable-line

  // ?? Answer handler ??????????????????????????????????????????????????????
  const handleAnswer = useCallback((choiceIdx: number) => {
    if (answered || !current) return;
    if (timerRef.current) window.clearInterval(timerRef.current);
    setAnswered(true);
    const correct = choiceIdx === current.ok;
    popIdRef.current++;
    const pid = popIdRef.current;

    if (correct) {
      const newCombo = combo + 1;
      setCombo(newCombo);
      const bonus = newCombo >= 3 ? 5 : 0;
      const gain  = timeLeft >= 15 ? 17 : 12; // speed bonus
      const total = gain + bonus;
      setApproval(a => {
        const next = Math.min(100, a + total);
        if (next >= 100) {
          setWon(true);
          setTimeout(() => endBattle(true, wrongCt), 400);
        }
        return next;
      });
      setReaction("pleased");
      setJurorAnim("nod"); setTimeout(() => setJurorAnim("none"), 1000);
      setFeedback({ text: newCombo>=3 ? `COMBO x${newCombo}! +${total}%` : `+${total}% ${E.check}`, color:"#4ade80", id:pid });
    } else {
      setCombo(0);
      setWrongCt(wc => {
        const nwc = wc + 1;
        setApproval(a => {
          const next = Math.max(0, a - 18);
          if (next <= 0) setTimeout(() => endBattle(false, nwc), 400);
          return next;
        });
        return nwc;
      });
      setReaction("displeased");
      setJurorAnim("shake"); setTimeout(() => setJurorAnim("none"), 800);
      const miss = choiceIdx === -1 ? `Temps \u00e9coul\u00e9 ${E.sweat} \u221218%` : `-18% ${E.cross}`;
      setFeedback({ text:miss, color:"#ef4444", id:pid });
    }

    setTimeout(() => { setFeedback(null); nextQuestion(); }, 1400);
  }, [answered, current, combo, timeLeft, wrongCt, nextQuestion]);

  // ?? End battle ??????????????????????????????????????????????????????????
  const endBattle = useCallback((isWin: boolean, wc: number) => {
    if (timerRef.current) window.clearInterval(timerRef.current);
    const mention = isWin
      ? wc===0 ? "Tr\u00e8s Bien" : wc<=2 ? "Bien" : wc<=5 ? "Assez Bien" : "Passable"
      : "\u00c9ch\u00e9c";
    const jetons   = isWin ? (wc===0?100:wc<=2?60:wc<=5?35:20) : 8;
    const prestige = isWin ? (wc===0?100:wc<=2?50:wc<=5?20:0)  : 0;
    const card     = isWin && wc<=2 ? (wc===0?"mention_tb":"mention_b") : null;
    setResult({ jetons, prestige, mention, card });
    setPhase("result");
    void creditResult(jetons, prestige, card);
  }, []); // eslint-disable-line

  // ?? Firestore ???????????????????????????????????????????????????????????
  const creditResult = useCallback(async (jetons: number, prestige: number, card: string|null) => {
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
        const total = jetons + prestige;
        const upd: Record<string,unknown> = { xp: Number(data.xp??0) + total };
        if (card) {
          const ex = (data.grandOralCards as string[]|undefined) ?? [];
          upd.grandOralCards = [...ex, `${card}_${Date.now()}`];
        }
        tx.update(ref, upd); return total;
      });
      if (added > 0) setGainAffiche(formatJetonsDelta(added));
      onXPGagne?.();
    } catch(e) { console.error(e); }
    finally { setBusy(false); }
  }, [onXPGagne, xpRewardsSuspended]);

  const prenom = profil?.prenom || "toi";

  // ?? SELECT ????????????????????????????????????????????????????????????????
  if (phase === "select") {
    return (
      <div className="relative min-h-screen overflow-x-hidden pb-28 text-slate-100"
        style={{ background:"radial-gradient(ellipse 100% 60% at 50% 0%,rgba(0,40,100,0.35) 0%,transparent 65%),#030814" }}>
        <style>{GO_CSS}</style>
        <div className="pointer-events-none absolute inset-0" style={{ background:"radial-gradient(ellipse 70% 50% at 10% 80%,rgba(139,92,246,0.12) 0%,transparent 55%),radial-gradient(ellipse 60% 40% at 90% 20%,rgba(59,130,246,0.1) 0%,transparent 50%)" }}/>
        <div className="relative z-10 mx-auto max-w-lg px-4 pt-8 sm:pt-10">

          <header className="mb-8 text-center">
            <div className="mb-3 inline-flex items-center gap-2">
              <span className="rounded-full border border-blue-400/30 bg-blue-400/12 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-blue-200/90">Quiz STMG</span>
              <span className="text-xl select-none">{E.micro}</span>
            </div>
            <h1 className="text-4xl font-black tracking-tight sm:text-5xl"
              style={{ background:"linear-gradient(135deg,#60a5fa 0%,#818cf8 40%,#c084fc 70%,#f0abfc 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              Le Grand Oral
            </h1>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-400">
              Salut <span className="font-semibold text-blue-300">{prenom}</span> ! Choisis ton jury et d\u00e9fends tes connaissances STMG.<br/>
              Monte la jauge d'approbation \u00e0 <span className="font-bold text-emerald-300">100%</span> pour valider ton oral.
            </p>
          </header>

          {/* Difficulty legend */}
          <div className="mb-5 flex items-center justify-center gap-4 text-xs text-slate-600">
            <span className="flex items-center gap-1"><span className="text-emerald-400">{E.star}</span> Facile</span>
            <span className="flex items-center gap-1"><span className="text-amber-400">{E.star}{E.star}</span> Moyen</span>
            <span className="flex items-center gap-1"><span className="text-rose-400">{E.star}{E.star}{E.star}</span> Expert</span>
          </div>

          {/* Juror cards */}
          <div className="flex flex-col gap-4">
            {JURORS.map((j, idx) => (
              <div key={j.id}
                className="group relative overflow-hidden rounded-[1.4rem] border backdrop-blur-xl transition-all hover:scale-[1.015]"
                style={{ borderColor:`${j.accentColor}35`,
                  background:`radial-gradient(ellipse 90% 60% at 80% 20%, ${j.accentColor}18 0%, transparent 55%), rgba(5,10,20,0.75)`,
                  boxShadow:`0 0 0 1px rgba(255,255,255,0.04) inset, 0 16px 48px -16px ${j.glowColor}`,
                  animation:`goSlideIn 0.4s ${idx*0.1}s both` }}>
                <div className="flex items-stretch gap-0">
                  {/* Mini character preview */}
                  <div className="flex w-28 flex-shrink-0 items-end justify-center overflow-hidden rounded-l-[1.4rem] pb-0"
                    style={{ background:`linear-gradient(180deg,${j.accentColor}18 0%,${j.accentColor}08 100%)` }}>
                    <div style={{ transform:"scale(0.6)", transformOrigin:"bottom center", marginBottom:-12 }}>
                      <JurorBody j={j} reaction="neutral"/>
                    </div>
                  </div>
                  {/* Info */}
                  <div className="flex flex-1 flex-col justify-center py-5 pr-4">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color:`${j.accentColor}90` }}>{j.title}</p>
                      <span className="text-xs">{Array.from({length:j.difficulty},(_,i)=><span key={i} style={{ color: j.difficulty===1?"#4ade80":j.difficulty===2?"#fbbf24":"#ef4444" }}>{E.star}</span>)}</span>
                    </div>
                    <h3 className="text-lg font-black text-white mb-1">{j.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mb-3">{j.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {[20,40,60,80,100].map(th=>(
                          <div key={th} className="text-center">
                            <div className="text-[8px] font-bold" style={{ color:`${j.accentColor}70` }}>{th}%</div>
                            <div className="h-1 w-7 rounded-full" style={{ background:`${j.accentColor}${th<=30?"22":th<=60?"44":"77"}` }}/>
                          </div>
                        ))}
                      </div>
                      <button type="button" onClick={() => startBattle(j)}
                        className="rounded-xl px-4 py-2 text-xs font-black text-slate-950 transition active:scale-[0.97]"
                        style={{ background:`linear-gradient(135deg,${j.accentColor},${j.tieColor})`, boxShadow:`0 6px 20px -6px ${j.accentColor}` }}>
                        D\u00e9buter {E.micro}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Rewards preview */}
          <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-slate-600">R\u00e9compenses selon la mention</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { m:"Tr\u00e8s Bien",  j:100, p:100, c:"#fbbf24", card:true },
                { m:"Bien",          j:60,  p:50,  c:"#4ade80", card:true },
                { m:"Assez Bien",    j:35,  p:20,  c:"#38bdf8", card:false },
                { m:"Passable",      j:20,  p:0,   c:"#94a3b8", card:false },
              ].map(({ m,j,p,c,card })=>(
                <div key={m} className="rounded-xl border border-white/8 bg-black/20 p-2.5">
                  <p className="text-xs font-black mb-0.5" style={{ color:c }}>{m}</p>
                  <p className="text-[10px] text-slate-500">{j}j ù {p}p{card?` ù ${E.card} carte`:""}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ?? BATTLE ????????????????????????????????????????????????????????????????
  if (phase === "battle" && juror) {
    return (
      <div className="relative min-h-screen overflow-x-hidden pb-24 text-slate-100"
        style={{ background:`${juror.bgGrad},#030814` }}>
        <style>{GO_CSS}</style>

        <div className="relative z-10 mx-auto max-w-lg px-3 pt-6">

          {/* Approval bar */}
          <div className="mb-4 rounded-2xl border border-white/8 bg-white/[0.04] p-4 backdrop-blur-xl">
            <ApprovalBar approval={approval} accent={juror.accentColor}/>
            {/* Combo badge */}
            {combo >= 2 && (
              <div className="mt-2 flex items-center justify-end">
                <span className="rounded-full border px-2.5 py-0.5 text-[11px] font-black animate-pulse"
                  style={{ borderColor:`${juror.accentColor}60`, color:juror.accentColor, background:`${juror.accentColor}15` }}>
                  {E.fire} COMBO x{combo}
                </span>
              </div>
            )}
          </div>

          {/* Juror + reaction */}
          <div className="mb-4 flex items-end justify-center rounded-[1.5rem] border border-white/8 overflow-hidden"
            style={{ minHeight:220, background:`linear-gradient(180deg,${juror.accentColor}18 0%,${juror.accentColor}08 40%,transparent 100%)`,
              boxShadow:`0 0 0 1px rgba(255,255,255,0.04) inset, 0 0 60px -20px ${juror.glowColor}` }}>
            <div className="flex flex-col items-center pb-0 relative">
              {/* Feedback pop */}
              {feedback && <FeedbackPop text={feedback.text} color={feedback.color} key={feedback.id}/>}
              {/* Character */}
              <div style={{ animation: jurorAnim==="nod"?"goNod 0.8s ease-in-out":jurorAnim==="shake"?"goShake 0.65s ease-in-out":"none" }}>
                <JurorBody j={juror} reaction={reaction}/>
              </div>
              {/* Nameplate */}
              <div className="mb-0 w-full px-4 pb-3 text-center">
                <p className="text-xs font-black" style={{ color:juror.accentColor }}>{juror.name}</p>
                <p className="text-[10px] text-slate-600">{juror.title}</p>
              </div>
            </div>
          </div>

          {/* Question card */}
          {current && !answered && (
            <div className="mb-4 rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
              style={{ animation:"goSlideIn 0.3s ease-out", boxShadow:"0 8px 32px -12px rgba(0,0,0,0.6)" }}>
              {/* Timer + category */}
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-full border border-white/10 bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{current.cat}</span>
                <TimerRing timeLeft={timeLeft} accent={juror.accentColor}/>
              </div>
              {/* Question */}
              <p className="text-sm font-semibold leading-snug text-white mb-4 sm:text-base">{current.q}</p>
              {/* Choices */}
              <div className="grid gap-2.5">
                {current.choices.map((c, i) => (
                  <button key={i} type="button" onClick={() => handleAnswer(i)}
                    className="rounded-xl border px-4 py-3 text-left text-sm font-medium transition active:scale-[0.98]"
                    style={{ borderColor:"rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.055)", color:"#e2e8f0",
                      cursor:"pointer" }}
                    onMouseEnter={e=>{(e.currentTarget as HTMLElement).style.borderColor=juror.accentColor+"66"; (e.currentTarget as HTMLElement).style.background=juror.accentColor+"18";}}
                    onMouseLeave={e=>{(e.currentTarget as HTMLElement).style.borderColor="rgba(255,255,255,0.1)"; (e.currentTarget as HTMLElement).style.background="rgba(255,255,255,0.055)";}}>
                    <span className="mr-2 text-slate-500 font-mono text-xs">{["A","B","C","D"][i]}</span>{c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Waiting for next question */}
          {answered && (
            <div className="mb-4 rounded-[1.4rem] border border-white/8 bg-white/[0.025] p-8 text-center">
              <div className="text-3xl mb-2 select-none">{reaction==="pleased"?E.clap:E.sweat}</div>
              <p className="text-sm text-slate-400">Pr\u00e9paration de la question suivante...</p>
            </div>
          )}

        </div>
      </div>
    );
  }

  // ?? RESULT ????????????????????????????????????????????????????????????????
  const isWin = result.mention !== "\u00c9chec";
  return (
    <div className="relative min-h-screen overflow-x-hidden pb-28 text-slate-100"
      style={{ background:isWin?"radial-gradient(ellipse 100% 60% at 50% 0%,rgba(0,100,40,0.35) 0%,transparent 65%),#030814":"radial-gradient(ellipse 100% 60% at 50% 0%,rgba(100,0,20,0.35) 0%,transparent 65%),#030814" }}>
      <style>{GO_CSS}</style>
      {isWin && <WinConfetti/>}

      <div className="relative z-10 mx-auto max-w-lg px-4 pt-12 text-center">

        {/* Big result */}
        <div className="mb-6" style={{ animation:"goFadeIn 0.5s ease-out" }}>
          {isWin
            ? <div style={{ fontSize:88, animation:"goFloat 2.5s ease-in-out infinite" }}>{result.mention==="Tr\u00e8s Bien"?E.trophy:E.clap}</div>
            : <div style={{ fontSize:88 }}>{E.sweat}</div>
          }
          <h2 className="mt-3 text-3xl font-black sm:text-4xl"
            style={ isWin && result.mention==="Tr\u00e8s Bien"
              ? { background:"linear-gradient(90deg,#fbbf24,#f97316,#fbbf24)", backgroundSize:"200% 100%", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", animation:"goPrismatic 2.5s linear infinite" }
              : { color: isWin ? "#4ade80" : "#ef4444" }
            }>
            {isWin ? `Mention ${result.mention} !` : "Jury insatisfait\u2026"}
          </h2>
          {juror && <p className="mt-1 text-sm text-slate-500">{juror.name} a rendu son verdict.</p>}
        </div>

        {/* Rewards */}
        <div className="mb-6 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl"
          style={{ animation:"goSlideIn 0.5s 0.15s both" }}>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-600">R\u00e9compenses</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-amber-400/25 bg-amber-400/10 p-4 text-center" style={{ animation:"goHeartbeat 1.5s 0.5s ease-in-out infinite" }}>
              <div className="text-3xl mb-1 select-none">{E.coins}</div>
              <p className="text-2xl font-black text-amber-300">+{result.jetons}</p>
              <p className="text-[10px] text-amber-500/70 uppercase tracking-wide">Jetons</p>
            </div>
            <div className="rounded-2xl border border-violet-400/25 bg-violet-400/10 p-4 text-center">
              <div className="text-3xl mb-1 select-none">{E.spark}</div>
              <p className="text-2xl font-black text-violet-300">+{result.prestige}</p>
              <p className="text-[10px] text-violet-500/70 uppercase tracking-wide">Prestige</p>
            </div>
          </div>

          {result.card && (
            <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-center"
              style={{ animation:"goSlideIn 0.5s 0.4s both" }}>
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-300/70 mb-2">{E.card} Carte Exclusive</p>
              <p className="text-base font-black" style={{ color:"#fbbf24" }}>
                {result.card==="mention_tb" ? "Carte Mention Tr\u00e8s Bien" : "Carte Mention Bien"}
              </p>
              <p className="text-xs text-slate-500">Ajout\u00e9e \u00e0 ton profil</p>
            </div>
          )}

          {busy && <p className="mt-2 text-xs text-slate-500">Enregistrement...</p>}
          {gainAffiche && !busy && <p className="mt-2 text-xs font-bold text-emerald-300">{gainAffiche}</p>}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button type="button" onClick={() => { setPhase("select"); }} className="w-full rounded-2xl py-3.5 text-sm font-black text-slate-950 transition active:scale-[0.98]"
            style={{ background:"linear-gradient(135deg,#60a5fa,#818cf8,#c084fc)", boxShadow:"0 8px 28px -8px rgba(96,165,250,0.6)" }}>
            {E.micro} Choisir un autre jury
          </button>
          {!isWin && juror && (
            <button type="button" onClick={() => startBattle(juror)} className="w-full rounded-2xl border border-white/10 bg-white/[0.06] py-3.5 text-sm font-bold text-slate-200 transition hover:bg-white/[0.09]">
              Recommencer avec {juror.name}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
