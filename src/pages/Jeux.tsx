import { Suspense, lazy, useState } from "react";
import type { UserProfile } from "../services/userProfileService";
import SerpentSnack from "./SerpentSnack";

const CasinoSlots   = lazy(() => import("./CasinoSlots"));
const GrandOral     = lazy(() => import("./GrandOral"));
const CalculExpress = lazy(() => import("./CalculExpress"));
const AvatarCreator = lazy(() => import("./AvatarCreator"));
const Duel          = lazy(() => import("./Duel"));
const QuiVeutGagnerDesJetons = lazy(() => import("./QuiVeutGagnerDesJetons"));

const EJ = {
  snake:   "🐍",
  slot:    "🎰",
  micro:   "🎤",
  game:    "🎮",
  trophy:  "🏆",
  coin:    "💰",
  star:    "⭐",
  sparkle: "✨",
  medal:   "🏅",
  calc:    "🧮",
  palette: "🎨",
  swords:  "⚔️",
  money:   "💰",
};

type Props = { profil: UserProfile; onXPGagne: () => void };
type View  = "hub"|"snake"|"casino"|"grandoral"|"calcul"|"avatar"|"duel"|"jetons";

const GAMES = [
  {
    id: "duel" as const,
    emoji: EJ.swords,
    title: "Duel STMG",
    subtitle: "Affrontement en direct",
    desc: "Défie tes camarades en temps réel ! Réponds plus vite et plus juste pour remporter des jetons, du prestige et grimper au classement. Saisons, ligues et bonus de série inclus.",
    tags: ["Multijoueur", "Temps réel", "Saisons"],
    border:   "border-red-400/30",
    glow:     "rgba(239,68,68,0.3)",
    tagColor: "bg-red-500/15 text-red-200 border-red-400/25",
    btnFrom:  "#ef4444", btnTo: "#f97316",
    btnShadow:"rgba(239,68,68,0.5)",
    accent:   "#ef4444",
    grad:     "radial-gradient(ellipse 90% 60% at 80% 20%,rgba(239,68,68,0.15) 0%,transparent 60%),rgba(15,3,3,0.72)",
  },
  {
    id: "snake" as const,
    emoji: EJ.snake,
    title: "Snack Serpent",
    subtitle: "Arcade révisions",
    desc: "Mange des snacks, gère ton énergie, collecte des pouvoirs et réponds aux questions STMG pour recharger. Serpent à écailles, particules et révisions.",
    tags: ["Quiz intégré", "Pouvoirs", "Score"],
    border:   "border-teal-400/30",
    glow:     "rgba(20,184,166,0.3)",
    tagColor: "bg-teal-500/15 text-teal-200 border-teal-400/25",
    btnFrom:  "#14b8a6", btnTo: "#818cf8",
    btnShadow:"rgba(20,184,166,0.5)",
    accent:   "#14b8a6",
    grad:     "radial-gradient(ellipse 90% 60% at 80% 20%,rgba(20,184,166,0.15) 0%,transparent 60%),rgba(5,20,20,0.7)",
  },
  {
    id: "casino" as const,
    emoji: EJ.slot,
    title: "Fortune STMG",
    subtitle: "Casino de révisions",
    desc: "Réponds aux questions pour gagner des pièces casino, puis tente ta chance sur la machine à sous. Remporte jetons, prestige ou une carte prismatique légendaire !",
    tags: ["Machine à sous", "Prismatique", "Cartes bonus"],
    border:   "border-amber-400/30",
    glow:     "rgba(251,191,36,0.3)",
    tagColor: "bg-amber-500/15 text-amber-200 border-amber-400/25",
    btnFrom:  "#fbbf24", btnTo: "#ef4444",
    btnShadow:"rgba(251,191,36,0.5)",
    accent:   "#fbbf24",
    grad:     "radial-gradient(ellipse 90% 60% at 80% 20%,rgba(251,191,36,0.15) 0%,transparent 60%),rgba(12,6,2,0.72)",
  },
  {
    id: "jetons" as const,
    emoji: EJ.money,
    title: "Qui veut gagner des jetons ?",
    subtitle: "Quiz paliers",
    desc: "15 questions SDGN, paliers de jetons qui montent, cases sécurisées et jokers 50:50 / indice. Arrête-toi ou vise le jackpot !",
    tags: ["15 paliers", "Jokers", "SDGN Missions"],
    border:   "border-yellow-400/30",
    glow:     "rgba(234,179,8,0.35)",
    tagColor: "bg-yellow-500/15 text-yellow-100 border-yellow-400/25",
    btnFrom:  "#eab308", btnTo: "#ca8a04",
    btnShadow:"rgba(234,179,8,0.5)",
    accent:   "#eab308",
    grad:     "radial-gradient(ellipse 90% 60% at 80% 20%,rgba(234,179,8,0.18) 0%,transparent 60%),rgba(12,10,2,0.78)",
  },
  {
    id: "grandoral" as const,
    emoji: EJ.micro,
    title: "Le Grand Oral",
    subtitle: "Quiz RPG jury",
    desc: "Fais passer ton Grand Oral devant un jury STMG exigeant ! Réponds aux questions pour monter la jauge d’approbation. Décroche la Mention Très Bien pour les meilleures récompenses.",
    tags: ["Jury dessiné", "Timer", "Mention TB"],
    border:   "border-blue-400/30",
    glow:     "rgba(96,165,250,0.3)",
    tagColor: "bg-blue-500/15 text-blue-200 border-blue-400/25",
    btnFrom:  "#60a5fa", btnTo: "#c084fc",
    btnShadow:"rgba(96,165,250,0.5)",
    accent:   "#818cf8",
    grad:     "radial-gradient(ellipse 90% 60% at 80% 20%,rgba(96,165,250,0.15) 0%,transparent 60%),rgba(3,8,20,0.72)",
  },
  {
    id: "calcul" as const,
    emoji: EJ.calc,
    title: "Calcul Express",
    subtitle: "Calcul chronométré",
    desc: "90 secondes, le max de calculs STMG ! VA, marge, taux, seuil de rentabilité, amortissement… Enchaînez les bonnes réponses pour le combo x2 et convertissez votre score en jetons.",
    tags: ["Chronomètre", "Combo x2", "90 types"],
    border:   "border-green-400/30",
    glow:     "rgba(74,222,128,0.3)",
    tagColor: "bg-green-500/15 text-green-200 border-green-400/25",
    btnFrom:  "#4ade80", btnTo: "#22d3ee",
    btnShadow:"rgba(74,222,128,0.5)",
    accent:   "#4ade80",
    grad:     "radial-gradient(ellipse 90% 60% at 80% 20%,rgba(74,222,128,0.15) 0%,transparent 60%),rgba(2,15,8,0.72)",
  },
  {
    id: "avatar" as const,
    emoji: EJ.palette,
    title: "Mon Avatar",
    subtitle: "Créateur d’avatar",
    desc: "Personnalise ton avatar avec 90+ items : coiffures, tenues, accessoires, effets spéciaux… Achète du contenu exclusif avec tes jetons. Ton avatar s’affiche sur ta page profil !",
    tags: ["90+ items", "Achat jetons", "Profil"],
    border:   "border-pink-400/30",
    glow:     "rgba(236,72,153,0.3)",
    tagColor: "bg-pink-500/15 text-pink-200 border-pink-400/25",
    btnFrom:  "#ec4899", btnTo: "#a78bfa",
    btnShadow:"rgba(236,72,153,0.5)",
    accent:   "#ec4899",
    grad:     "radial-gradient(ellipse 90% 60% at 80% 20%,rgba(236,72,153,0.15) 0%,transparent 60%),rgba(15,3,15,0.72)",
  },
] as const;

function GameCard({ game, onPlay, index }: { game: typeof GAMES[number]; onPlay: () => void; index: number }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[1.5rem] border ${game.border} backdrop-blur-xl transition-all hover:scale-[1.013]`}
      style={{ background:game.grad, boxShadow:`0 0 0 1px rgba(255,255,255,0.04) inset, 0 20px 60px -20px ${game.glow}`,
        animation:`gameCardIn 0.45s ${index*0.1}s both` }}>

      <style>{`@keyframes gameCardIn{0%{opacity:0;transform:translateY(18px)}100%{opacity:1;transform:translateY(0)}}`}</style>

      {/* Glow orb */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rounded-full opacity-20 transition-opacity group-hover:opacity-30"
        style={{ background:`radial-gradient(circle,${game.accent},transparent 70%)` }}/>

      <div className="flex items-start gap-3 p-5 sm:p-6">
        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl text-4xl select-none"
          style={{ background:"rgba(0,0,0,0.38)", border:`1px solid ${game.accent}28`, boxShadow:`0 0 20px ${game.accent}22` }}>
          {game.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color:`${game.accent}99` }}>{game.subtitle}</p>
          <h2 className="mt-0.5 text-xl font-black tracking-tight text-white sm:text-2xl">{game.title}</h2>
        </div>
      </div>

      <div className="px-5 pb-4 sm:px-6">
        <p className="text-sm leading-relaxed text-slate-400 mb-3">{game.desc}</p>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {game.tags.map(tag => (
            <span key={tag} className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${game.tagColor}`}>{tag}</span>
          ))}
        </div>
        <button type="button" onClick={onPlay}
          className="group/btn relative w-full overflow-hidden rounded-2xl py-3 text-sm font-black tracking-wide text-slate-950 transition active:scale-[0.98]"
          style={{ boxShadow:`0 10px 36px -10px ${game.btnShadow}` }}>
          <span className="absolute inset-0 transition group-hover/btn:brightness-110"
            style={{ background:`linear-gradient(135deg,${game.btnFrom},${game.btnTo})` }}/>
          <span className="relative flex items-center justify-center gap-2">
            <span>{game.emoji}</span>
            <span>Jouer maintenant</span>
          </span>
        </button>
      </div>
    </div>
  );
}

function SubShell({ bg, back, label, accent, children }: {
  bg: string; back: () => void; label: string; accent: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="sticky top-0 z-50 flex items-center gap-3 border-b border-white/8 px-4 py-2.5 backdrop-blur-xl"
        style={{ background:`${bg}e6` }}>
        <button type="button" onClick={back}
          className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/[0.1]">
          {"←"} Jeux
        </button>
        <span className="text-sm font-bold" style={{ color: accent }}>{label}</span>
      </div>
      <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-slate-400">Chargement...</div>}>
        {children}
      </Suspense>
    </div>
  );
}

export default function Jeux({ profil, onXPGagne }: Props) {
  const [view, setView] = useState<View>("hub");

  if (view === "duel")
    return <SubShell bg="#0f0303" back={()=>setView("hub")} label={`${EJ.swords} Duel STMG`} accent="#ef4444"><Duel profil={profil} onXPGagne={onXPGagne}/></SubShell>;

  if (view === "jetons")
    return <SubShell bg="#050818" back={()=>setView("hub")} label={`${EJ.money} Qui veut gagner des jetons ?`} accent="#eab308"><QuiVeutGagnerDesJetons profil={profil} onXPGagne={onXPGagne}/></SubShell>;

  if (view === "snake")
    return <SubShell bg="#03070e" back={()=>setView("hub")} label={`${EJ.snake} Snack Serpent`} accent="#14b8a6"><SerpentSnack profil={profil} onXPGagne={onXPGagne}/></SubShell>;

  if (view === "casino")
    return <SubShell bg="#050209" back={()=>setView("hub")} label={`${EJ.slot} Fortune STMG`} accent="#fbbf24"><CasinoSlots profil={profil} onXPGagne={onXPGagne}/></SubShell>;

  if (view === "grandoral")
    return <SubShell bg="#030814" back={()=>setView("hub")} label={`${EJ.micro} Le Grand Oral`} accent="#818cf8"><GrandOral profil={profil} onXPGagne={onXPGagne}/></SubShell>;

  if (view === "calcul")
    return <SubShell bg="#03080f" back={()=>setView("hub")} label={`${EJ.calc} Calcul Express`} accent="#4ade80"><CalculExpress profil={profil} onXPGagne={onXPGagne}/></SubShell>;

  if (view === "avatar")
    return <SubShell bg="#070a12" back={()=>setView("hub")} label={`${EJ.palette} Mon Avatar`} accent="#ec4899"><AvatarCreator profil={profil} onXPGagne={onXPGagne}/></SubShell>;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#070a12] pb-28 text-slate-100">
      <div className="pointer-events-none absolute inset-0"
        style={{ background:"radial-gradient(ellipse 80% 40% at 20% -5%,rgba(99,102,241,0.18) 0%,transparent 55%),radial-gradient(ellipse 60% 35% at 85% 10%,rgba(251,191,36,0.1) 0%,transparent 50%),radial-gradient(ellipse 50% 30% at 50% 100%,rgba(59,130,246,0.08) 0%,transparent 50%)" }}/>

      <div className="relative z-10 mx-auto max-w-lg px-4 pt-8 sm:pt-10">
        <header className="mb-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2">
            <span className="rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-violet-200/90">Arcade STMG</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl"
            style={{ background:"linear-gradient(135deg,#a78bfa 0%,#818cf8 25%,#38bdf8 55%,#4ade80 80%,#fbbf24 100%)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
            {EJ.game} Espace Jeux
          </h1>
          <p className="mt-2.5 text-sm text-slate-400">
            Joue, révise et remporte des{" "}<span className="font-semibold text-amber-300">jetons {EJ.coin}</span>,{" "}
            du <span className="font-semibold text-violet-300">prestige {EJ.star}</span>{" "}et des{" "}
            <span className="font-semibold text-pink-300">cartes rares {EJ.medal}</span>.
          </p>
        </header>

        <div className="flex flex-col gap-5">
          {GAMES.map((game, i) => (
            <GameCard key={game.id} game={game} onPlay={() => setView(game.id)} index={i}/>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-center text-xs leading-relaxed text-slate-500">
          <p>Nouveaux jeux à venir {EJ.sparkle} — vote pour le prochain dans les missions !</p>
          <p className="mt-1">Les jetons gagnés ici comptent dans le classement {EJ.trophy}</p>
        </div>
      </div>
    </div>
  );
}
