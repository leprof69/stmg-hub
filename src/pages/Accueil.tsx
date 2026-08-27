import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { D, F_DISPLAY, F_BODY, F_MONO, useDesignSystem, Grain, Eyebrow, Highlight, Marquee, Icon } from "../design/system";

/* ─── Bandeau défilant de la home ─── */
const MARQUEE_ITEMS = ["MANAGEMENT","SDGN","ÉCONOMIE","DROIT","MATHÉMATIQUES","CLASSEMENT NATIONAL","CARTES À COLLECTIONNER","DUELS EN TEMPS RÉEL"];

/* ─── Typewriter — toutes cohérentes avec "qui te donne" ─── */
const PHRASES = [
  "vraiment envie de réviser.",
  "une longueur d'avance.",
  "les clés du classement.",
  "l'envie de te dépasser.",
  "ta chance de dominer le Bac.",
];

/* ─── Notifications flottantes dans le hero ─── */
const NOTIFS = [
  { text:"+50 XP",                emoji:"⭐", color:"#F59E0B" },
  { text:"Badge : Le Lion 🦁",    emoji:"🏅", color:"#F97316" },
  { text:"Niveau 12 atteint",     emoji:"⚡", color:"#0EA5E9" },
  { text:"Carte Légendaire !",    emoji:"🃏", color:"#F59E0B" },
  { text:"#1 du lycée 🏆",        emoji:"🏆", color:"#2563EB" },
  { text:"+120 XP · Duel gagné",  emoji:"⚔️", color:"#10B981" },
  { text:"Mission SDGN complète", emoji:"🌍", color:"#06B6D4" },
];

/* ─── Konami code ─── */
const KONAMI = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];

/* ─── 5 Familles ─── */
const FAMILLES = [
  { nom:"L'Architecte",  emoji:"🧠", color:"#2563EB", trait:"Analytique · Structuré · Stratège",      desc:"Tu planifies tout avant d'agir. Chaque problème est un puzzle à résoudre méthodiquement. Ton arme secrète : personne ne voit autant de détails que toi.",           traits:["Stratégie","Logique","Précision"],      bg:"rgba(37,99,235,0.08)",   border:"rgba(37,99,235,0.2)" },
  { nom:"Le Visionnaire", emoji:"🎨", color:"#0EA5E9", trait:"Créatif · Intuitif · Innovant",           desc:"Tu imagines des solutions que les autres ne voient pas encore. La créativité est ton superpouvoir. Tu transformes n'importe quel sujet en quelque chose d'intéressant.", traits:["Créativité","Innovation","Vision"],     bg:"rgba(14,165,233,0.08)",  border:"rgba(14,165,233,0.2)" },
  { nom:"Le Challenger",  emoji:"⚡", color:"#F97316", trait:"Compétitif · Déterminé · Ambitieux",      desc:"Tu transformes chaque obstacle en tremplin. Les classements te motivent plus que tout. Ta devise : second n'est pas une option.",                                       traits:["Compétition","Dépassement","Ambition"], bg:"rgba(249,115,22,0.08)",  border:"rgba(249,115,22,0.2)" },
  { nom:"L'Explorateur",  emoji:"🔬", color:"#10B981", trait:"Curieux · Analytique · Aventurier",       desc:"Tu questionnes tout pour mieux comprendre. La curiosité est ton moteur. Là où les autres voient un cours, tu vois un terrain d'exploration.",                           traits:["Curiosité","Analyse","Découverte"],     bg:"rgba(16,185,129,0.08)",  border:"rgba(16,185,129,0.2)" },
  { nom:"L'Influenceur",  emoji:"🔥", color:"#EF4444", trait:"Charismatique · Fédérateur · Inspirant",  desc:"Tu entraînes les autres vers le sommet. Ton énergie est contagieuse. Tu ne révises pas seul : tu crées une dynamique autour de toi.",                                 traits:["Leadership","Charisme","Impact"],       bg:"rgba(239,68,68,0.08)",   border:"rgba(239,68,68,0.2)" },
];

/* ══════════════════════════════════════
   COMPOSANTS
══════════════════════════════════════ */

const Logo = ({ size = "md", onDark = false, onClick = undefined }) => {
  const fs = size === "xl" ? "3.4rem" : size === "lg" ? "2.2rem" : size === "sm" ? "1.05rem" : "1.45rem";
  return (
    <div onClick={onClick} style={{ display:"flex", alignItems:"baseline", fontFamily:F_DISPLAY, fontWeight:700, fontSize:fs, lineHeight:1, letterSpacing:"-0.03em", cursor:onClick ? "pointer" : "default", userSelect:"none" }}>
      <span style={{ color:onDark ? "#FFFFFF" : D.text }}>STMG</span>
      <span style={{ width:"0.22em", display:"inline-block" }} />
      <span style={{ color:D.sky }}>HUB</span>
    </div>
  );
};

/* ─── Bouton primaire avec burst de particules ─── */
const PrimaryBtn = ({ children, onClick, size = "md" }) => {
  const [hov, setHov] = useState(false);
  const [sparks, setSparks] = useState<{id:number,tx:string,ty:string,c:string}[]>([]);
  const btnRef = useRef<HTMLButtonElement>(null);

  /* Magnetic attraction */
  const onGlobalMove = useCallback((e: MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 90) {
      const pull = (90 - dist) / 90;
      btnRef.current.style.transform = `translate(${dx * pull * 0.28}px, ${dy * pull * 0.28}px)`;
    } else {
      btnRef.current.style.transform = "translate(0,0)";
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onGlobalMove);
    return () => window.removeEventListener("mousemove", onGlobalMove);
  }, [onGlobalMove]);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const colors = [D.sky, D.cyan, D.orange, D.amber, "#fff", D.emerald];
    const newSparks = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const radius = 40 + Math.random() * 30;
      return {
        id: Date.now() + i,
        tx: `${Math.cos(angle) * radius}px`,
        ty: `${Math.sin(angle) * radius}px`,
        c: colors[i % colors.length],
      };
    });
    setSparks(newSparks);
    setTimeout(() => setSparks([]), 700);
    onClick?.();
  };

  return (
    <button ref={btnRef} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={handleClick}
      style={{
        position:"relative", overflow:"visible",
        background: hov ? "linear-gradient(135deg,#1D4ED8,#0284C7)" : "linear-gradient(135deg,#2563EB,#0EA5E9)",
        color:"white", border:"none",
        fontFamily:F_DISPLAY, fontWeight:600, letterSpacing:"-0.01em",
        fontSize: size === "lg" ? "1.02rem" : "0.92rem",
        padding: size === "lg" ? "16px 34px" : "12px 24px",
        borderRadius:"4px 12px 4px 12px", cursor:"pointer",
        boxShadow: hov ? "0 10px 36px rgba(37,99,235,0.5)" : "0 4px 22px rgba(37,99,235,0.32)",
        transition:"all 0.18s",
        display:"inline-flex", alignItems:"center", gap:"8px",
      }}>
      {sparks.map(s => (
        <span key={s.id} style={{
          position:"absolute", left:"50%", top:"50%",
          width:"7px", height:"7px", borderRadius:"50%", background:s.c,
          pointerEvents:"none",
          animation:"sparkBurst 0.65s ease-out forwards",
          "--tx":s.tx, "--ty":s.ty,
        } as React.CSSProperties} />
      ))}
      {children}
    </button>
  );
};

const GhostBtn = ({ children, onClick, onDark = true, size = "md" }) => {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: onDark ? (hov ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)") : (hov ? "rgba(37,99,235,0.08)" : "transparent"),
        color: onDark ? "rgba(255,255,255,0.82)" : D.primary,
        border: onDark ? "1px solid rgba(255,255,255,0.18)" : `1px solid ${D.primary}55`,
        fontFamily:F_DISPLAY, fontWeight:600,
        fontSize: size === "lg" ? "1.02rem" : "0.92rem",
        padding: size === "lg" ? "16px 34px" : "12px 24px",
        borderRadius:"4px 12px 4px 12px", cursor:"pointer", transition:"all 0.18s",
        display:"inline-flex", alignItems:"center", gap:"8px",
      }}>
      {children}
    </button>
  );
};

/* ─── Wrapper 3D tilt + shine (DOM direct = 0 re-render) ─── */
const Tilt3D = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => {
  const el    = useRef<HTMLDivElement>(null);
  const shine = useRef<HTMLDivElement>(null);

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!el.current) return;
    const rect = el.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    el.current.style.transform = `perspective(700px) rotateX(${-y*20}deg) rotateY(${x*20}deg) scale3d(1.04,1.04,1.04)`;
    el.current.style.transition = "transform 0.08s ease";
    if (shine.current) {
      shine.current.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, rgba(255,255,255,0.18) 0%, transparent 55%)`;
      shine.current.style.opacity = "1";
    }
  }, []);

  const onLeave = useCallback(() => {
    if (!el.current) return;
    el.current.style.transform = "perspective(700px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    el.current.style.transition = "transform 0.55s ease";
    if (shine.current) shine.current.style.opacity = "0";
  }, []);

  return (
    <div ref={el} onMouseMove={onMove} onMouseLeave={onLeave} style={{ position:"relative", ...style }}>
      <div ref={shine} style={{ position:"absolute", inset:0, borderRadius:"inherit", pointerEvents:"none", zIndex:2, opacity:0, transition:"opacity 0.2s" }} />
      {children}
    </div>
  );
};

/* ─── App preview card ─── */
const AppPreview = () => (
  <Tilt3D style={{ width:"300px", flexShrink:0 }}>
    <div style={{
      background:"rgba(255,255,255,0.04)", backdropFilter:"blur(20px)",
      border:"1px solid rgba(255,255,255,0.1)", borderRadius:"4px 24px 4px 24px", padding:"24px",
      boxShadow:"0 30px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
    }}>
      <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"18px" }}>
        <div style={{ width:"42px", height:"42px", borderRadius:"4px 12px 4px 12px", background:"linear-gradient(135deg,#2563EB,#0EA5E9)", display:"flex", alignItems:"center", justifyContent:"center", color:"white" }}><Icon name="zap" size={20} strokeWidth={1.8} /></div>
        <div>
          <p style={{ color:"white", fontFamily:F_DISPLAY, fontWeight:700, fontSize:"0.9rem", margin:0 }}>Mathieu T.</p>
          <p style={{ color:D.sky, fontFamily:F_DISPLAY, fontWeight:600, fontSize:"0.75rem", margin:0 }}>Le Challenger · Niv. 12</p>
        </div>
        <div style={{ marginLeft:"auto", background:"rgba(37,99,235,0.2)", border:"1px solid rgba(37,99,235,0.4)", borderRadius:"6px", padding:"4px 10px" }}>
          <span style={{ color:D.sky, fontFamily:F_MONO, fontWeight:600, fontSize:"0.75rem" }}>2 400 XP</span>
        </div>
      </div>
      <div style={{ marginBottom:"18px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
          <span style={{ color:D.subtle, fontSize:"0.72rem", fontFamily:F_DISPLAY, fontWeight:600 }}>Vers niv. 13</span>
          <span style={{ color:D.sky, fontSize:"0.72rem", fontFamily:F_MONO, fontWeight:600 }}>80%</span>
        </div>
        <div style={{ background:"rgba(255,255,255,0.08)", borderRadius:"100px", height:"6px" }}>
          <div style={{ background:"linear-gradient(90deg,#2563EB,#0EA5E9)", borderRadius:"100px", height:"6px", width:"80%" }} />
        </div>
      </div>
      <div style={{ background:"rgba(251,146,60,0.1)", border:"1px solid rgba(251,146,60,0.25)", borderRadius:"12px", padding:"12px 14px", marginBottom:"14px", display:"flex", alignItems:"center", gap:"10px" }}>
        <span style={{ fontSize:"1.4rem" }}>🏅</span>
        <div>
          <p style={{ color:"rgba(255,255,255,0.9)", fontFamily:F_DISPLAY, fontWeight:800, fontSize:"0.8rem", margin:0 }}>Badge débloqué !</p>
          <p style={{ color:D.orange, fontFamily:F_DISPLAY, fontWeight:700, fontSize:"0.72rem", margin:0 }}>Le Lion — Rare</p>
        </div>
      </div>
      {[
        { emoji:"📊", label:"Management Chap. 7", stat:"94%",      done:true },
        { emoji:"🌍", label:"SDGN Mission 11",    stat:"En cours", done:false },
      ].map((item, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px", padding:"10px 0", borderTop:"1px solid rgba(255,255,255,0.06)" }}>
          <span style={{ fontSize:"1.1rem" }}>{item.emoji}</span>
          <span style={{ color:"rgba(255,255,255,0.75)", fontFamily:F_DISPLAY, fontWeight:600, fontSize:"0.78rem", flex:1 }}>{item.label}</span>
          <span style={{ color:item.done ? D.emerald : D.orange, fontFamily:F_DISPLAY, fontWeight:800, fontSize:"0.75rem" }}>{item.stat}</span>
        </div>
      ))}
      <div style={{ marginTop:"14px", background:"linear-gradient(135deg,rgba(37,99,235,0.15),rgba(14,165,233,0.15))", border:"1px solid rgba(37,99,235,0.25)", borderRadius:"10px", padding:"10px 14px", display:"flex", alignItems:"center", gap:"8px" }}>
        <span style={{ fontSize:"1rem" }}>🏆</span>
        <span style={{ color:"rgba(255,255,255,0.85)", fontFamily:F_DISPLAY, fontWeight:700, fontSize:"0.78rem" }}>Classement national · <strong style={{ color:D.sky }}>#4</strong></span>
      </div>
    </div>
  </Tilt3D>
);

/* ─── Feature card ─── */
const FeatureCard = ({ icon, iconBg, title, desc, tag, tagColor }) => {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background:"white", borderRadius: hov ? "4px 28px 4px 28px" : "4px 20px 4px 20px", padding:"34px",
        border: hov ? `1px solid ${tagColor}45` : `1px solid ${D.border}`,
        boxShadow: hov ? `0 16px 48px ${tagColor}16` : "0 2px 12px rgba(0,0,0,0.03)",
        transition:"all 0.25s cubic-bezier(0.22,1,0.36,1)", cursor:"default",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
      }}>
      <div style={{ width:"48px", height:"48px", borderRadius:"4px 12px 4px 12px", background:iconBg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"22px", color:tagColor }}>
        <Icon name={icon} size={24} strokeWidth={1.6} />
      </div>
      <h3 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"1.18rem", color:D.text, marginBottom:"10px", letterSpacing:"-0.01em" }}>{title}</h3>
      <p style={{ fontFamily:F_BODY, color:D.muted, lineHeight:1.75, fontSize:"0.95rem", marginBottom:"22px" }}>{desc}</p>
      <span style={{ display:"inline-flex", alignItems:"center", gap:"7px", fontFamily:F_MONO, color:tagColor, fontWeight:500, fontSize:"0.72rem", letterSpacing:"0.06em", textTransform:"uppercase" }}>
        <span style={{ width:"5px", height:"5px", borderRadius:"50%", background:tagColor }} />
        {tag}
      </span>
    </div>
  );
};

/* ─── Coverflow — présentation 3D interactive des fonctionnalités ─── */
type CoverSlide = { icon: string; title: string; desc: string; gradient: string; tag: string };

const COVER_SLIDES: CoverSlide[] = [
  { icon:"target", title:"QCM interactifs",        desc:"Des centaines de questions par chapitre, à ton rythme.",             gradient:"linear-gradient(135deg,#2563EB,#0EA5E9)", tag:"Révisions" },
  { icon:"layers", title:"Cartes à collectionner",  desc:"Chaque notion clé devient une carte à débloquer.",                   gradient:"linear-gradient(135deg,#06B6D4,#10B981)", tag:"Collection" },
  { icon:"zap", title:"Duels en temps réel",    desc:"Défie tes camarades et grimpe dans les classements.",                gradient:"linear-gradient(135deg,#F97316,#F59E0B)", tag:"Compétition" },
  { icon:"trophy", title:"Classement national",    desc:"Ton lycée face à tous les lycées STMG de France.",                   gradient:"linear-gradient(135deg,#2563EB,#06B6D4)", tag:"Classement" },
  { icon:"globe", title:"Missions SDGN",          desc:"Des missions immersives pour ancrer les notions clés.",              gradient:"linear-gradient(135deg,#0EA5E9,#10B981)", tag:"Missions" },
  { icon:"award", title:"Badges & progression",   desc:"Débloque des badges rares en validant tes acquis.",                  gradient:"linear-gradient(135deg,#F59E0B,#F97316)", tag:"Progression" },
];

const COVERFLOW_DUR = 0.6;
const COVERFLOW_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const COVERFLOW_DEPTH = 240;

const Coverflow = ({ slides, cardWidth = 300, cardHeight = 360 }: { slides: CoverSlide[]; cardWidth?: number; cardHeight?: number }) => {
  const n = slides.length;
  const [active, setActive] = useState(0);
  const lockRef = useRef(false);

  const lock = useCallback(() => {
    lockRef.current = true;
    window.setTimeout(() => { lockRef.current = false; }, 650);
  }, []);

  const step = useCallback((dir: number) => {
    if (lockRef.current) return;
    lock();
    setActive(a => (((a + dir) % n) + n) % n);
  }, [n, lock]);

  const handleCardClick = useCallback((i: number) => {
    if (lockRef.current) return;
    lock();
    setActive(a => (i === a ? (a + 1) % n : i));
  }, [n, lock]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
  }, [step]);

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"32px" }}>
      <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
        <button onClick={() => step(-1)} aria-label="Précédent"
          style={{ width:"44px", height:"44px", flexShrink:0, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.18)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"1.1rem", cursor:"pointer", display: cardWidth < 260 ? "none" : "flex", alignItems:"center", justifyContent:"center" }}>
          ‹
        </button>

        <div
          tabIndex={0}
          role="group"
          aria-roledescription="carousel"
          onKeyDown={onKeyDown}
          style={{ position:"relative", width: cardWidth * 1.9, maxWidth:"100%", height: cardHeight + 20, display:"flex", alignItems:"center", justifyContent:"center", perspective:"1600px", overflow:"hidden", outline:"none" }}
        >
          <div style={{ position:"relative", width:cardWidth, height:cardHeight, transformStyle:"preserve-3d" }}>
            {slides.map((slide, i) => {
              let rel = i - active;
              if (rel > n / 2) rel -= n;
              if (rel < -n / 2) rel += n;
              const ax = Math.abs(rel);
              const visible = ax <= 2;
              const isActive = rel === 0;
              const sc = Math.max(0.4, 1 - ax * 0.16);
              const tx = rel * (cardWidth * 0.62);
              const tz = -ax * COVERFLOW_DEPTH;
              const ry = -rel * 7;
              const rz = rel * 7;

              return (
                <div key={i} onClick={() => handleCardClick(i)} aria-label={slide.title} aria-hidden={!visible}
                  style={{
                    position:"absolute", left:"50%", top:"50%",
                    width:cardWidth, height:cardHeight,
                    borderRadius:"20px", overflow:"hidden",
                    transformStyle:"preserve-3d", transformOrigin:"center center",
                    transform:`translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
                    transition:`transform ${COVERFLOW_DUR}s ${COVERFLOW_EASE}, opacity ${COVERFLOW_DUR}s ${COVERFLOW_EASE}`,
                    opacity: visible ? 1 : 0,
                    cursor: isActive ? "default" : "pointer",
                    pointerEvents: visible ? "auto" : "none",
                    background: slide.gradient,
                    boxShadow: isActive ? "0 30px 80px rgba(0,0,0,0.5)" : "0 12px 32px rgba(0,0,0,0.3)",
                  }}>
                  <div style={{ position:"relative", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", textAlign:"center", padding:"32px" }}>
                    <div style={{ width:"64px", height:"64px", borderRadius:"4px 18px 4px 18px", background:"rgba(255,255,255,0.14)", border:"1px solid rgba(255,255,255,0.22)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"20px" }}>
                      <Icon name={slide.icon} size={30} strokeWidth={1.5} style={{ color:"white" }} />
                    </div>
                    <span style={{ fontFamily:F_MONO, color:"rgba(255,255,255,0.75)", fontWeight:500, fontSize:"0.68rem", letterSpacing:"0.12em", marginBottom:"14px", textTransform:"uppercase" }}>
                      {slide.tag}
                    </span>
                    <h3 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"1.25rem", color:"white", margin:"0 0 8px", letterSpacing:"-0.01em" }}>{slide.title}</h3>
                    <p style={{ fontFamily:F_BODY, color:"rgba(255,255,255,0.88)", fontSize:"0.88rem", lineHeight:1.6, margin:0 }}>{slide.desc}</p>
                  </div>
                  <div style={{ position:"absolute", inset:0, background:"#000000", opacity: isActive ? 0 : 0.35, transition:`opacity ${COVERFLOW_DUR}s ${COVERFLOW_EASE}`, pointerEvents:"none" }} />
                </div>
              );
            })}
          </div>
        </div>

        <button onClick={() => step(1)} aria-label="Suivant"
          style={{ width:"44px", height:"44px", flexShrink:0, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.18)", background:"rgba(255,255,255,0.05)", color:"white", fontSize:"1.1rem", cursor:"pointer", display: cardWidth < 260 ? "none" : "flex", alignItems:"center", justifyContent:"center" }}>
          ›
        </button>
      </div>

      <div style={{ display:"flex", gap:"8px" }}>
        {slides.map((_, i) => (
          <button key={i} onClick={() => handleCardClick(i)} aria-label={`Aller au slide ${i + 1}`}
            style={{ width: i === active ? "24px" : "8px", height:"8px", borderRadius:"100px", border:"none", background: i === active ? D.sky : "rgba(255,255,255,0.25)", cursor:"pointer", transition:"all 0.3s", padding:0 }} />
        ))}
      </div>
    </div>
  );
};

/* ─── Vraie carte avec image + 3D tilt ─── */
const CollectibleCard = ({ image, titre, chapitre, rarete, color, rotate = "0deg" }) => {
  const isUltraRare  = rarete === "Ultra Rare";
  const isLegendaire = rarete === "Légendaire";
  const isSpecial    = isUltraRare || isLegendaire;

  return (
    <Tilt3D style={{ width:"155px", flexShrink:0, transform:`rotate(${rotate})` }}>
      <div style={{
        padding:"2px",
        borderRadius:"18px",
        background: isUltraRare
          ? "linear-gradient(135deg,#F472B6,#818CF8,#38BDF8,#34D399,#FBBF24,#F472B6)"
          : isLegendaire
          ? "linear-gradient(135deg,#FBBF24,#FDE68A,#F59E0B,#FBBF24)"
          : `linear-gradient(135deg,${color}80,${color}30)`,
        animation: isSpecial ? "borderSpin 3s linear infinite" : "none",
        boxShadow: isUltraRare
          ? "0 16px 48px rgba(244,114,182,0.45), 0 0 28px rgba(129,140,248,0.35)"
          : isLegendaire
          ? "0 14px 40px rgba(251,191,36,0.5), 0 0 20px rgba(251,191,36,0.25)"
          : `0 8px 28px ${color}30`,
      }}>
        <div style={{
          background:"#0a1628",
          borderRadius:"16px",
          overflow:"hidden",
          position:"relative",
        }}>
          {/* Image de la vraie carte */}
          <div style={{ position:"relative", overflow:"hidden" }}>
            <img
              src={image}
              alt={titre}
              style={{ width:"100%", height:"180px", objectFit:"cover", display:"block" }}
            />
            {/* Shimmer scan holographique */}
            {isSpecial && (
              <div style={{
                position:"absolute", inset:0,
                background:"linear-gradient(105deg,transparent 35%,rgba(255,255,255,0.22) 50%,transparent 65%)",
                animation:"shimmerScan 2.4s ease-in-out infinite",
                pointerEvents:"none",
              }} />
            )}
            {/* Overlay couleur en bas de l'image */}
            <div style={{
              position:"absolute", bottom:0, left:0, right:0, height:"50%",
              background:`linear-gradient(to top, #0a1628 0%, transparent 100%)`,
              pointerEvents:"none",
            }} />
          </div>

          {/* Infos sous l'image */}
          <div style={{ padding:"10px 12px 12px", textAlign:"center" }}>
            <p style={{ fontFamily:F_DISPLAY, fontWeight:900, fontSize:"0.76rem", color:"white", margin:"0 0 3px", lineHeight:1.3 }}>{titre}</p>
            <p style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"0.65rem", color:"rgba(255,255,255,0.4)", margin:"0 0 8px" }}>{chapitre}</p>
            <span style={{
              background: isUltraRare
                ? "linear-gradient(90deg,#F472B6,#818CF8,#38BDF8)"
                : `${color}25`,
              color: isUltraRare ? "white" : color,
              fontFamily:F_DISPLAY, fontWeight:800, fontSize:"0.62rem",
              padding:"3px 10px", borderRadius:"100px",
              border: isUltraRare ? "none" : `1px solid ${color}40`,
            }}>
              {rarete}
            </span>
          </div>
        </div>
      </div>
    </Tilt3D>
  );
};

/* ─── Step card ─── */
const StepCard = ({ num, icon, title, desc, color }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
    <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
      <span style={{ fontFamily:F_MONO, fontWeight:500, fontSize:"0.85rem", color:"rgba(255,255,255,0.3)", letterSpacing:"0.05em" }}>{num}</span>
      <span style={{ flex:1, height:"1px", background:"rgba(255,255,255,0.1)" }} />
      <div style={{ width:"40px", height:"40px", borderRadius:"4px 12px 4px 12px", background:color+"18", border:`1px solid ${color}35`, display:"flex", alignItems:"center", justifyContent:"center", color, flexShrink:0 }}>
        <Icon name={icon} size={20} strokeWidth={1.6} />
      </div>
    </div>
    <h3 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"1.15rem", color:"white", margin:0, letterSpacing:"-0.01em" }}>{title}</h3>
    <p style={{ fontFamily:F_BODY, color:"rgba(255,255,255,0.50)", lineHeight:1.75, fontSize:"0.92rem", margin:0 }}>{desc}</p>
  </div>
);

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function Accueil({
  onConnexion,
  onInscription,
  estConnecte = false,
  onDeconnexion,
}: {
  onConnexion: () => void;
  onInscription: () => void;
  estConnecte?: boolean;
  onDeconnexion?: () => void;
}) {
  const [menuOpen, setMenuOpen]           = useState(false);
  const [scrolled, setScrolled]           = useState(false);
  const [familleActive, setFamilleActive] = useState(0);

  /* ── Typewriter ── */
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting,  setDeleting]  = useState(false);

  /* ── Floating notifications ── */
  const [floatNotifs, setFloatNotifs] = useState<{id:number; text:string; emoji:string; color:string; x:number}[]>([]);

  /* ── Easter egg (logo) ── */
  const [logoClicks, setLogoClicks] = useState(0);
  const [eggFound,   setEggFound]   = useState(false);
  const [showEgg,    setShowEgg]    = useState(false);
  const [eggShake,   setEggShake]   = useState(false);

  /* ── Konami code ── */
  const [konamiIdx,  setKonamiIdx]   = useState(0);
  const [confetti,   setConfetti]    = useState<{id:number;x:number;dur:number;delay:number;w:number;h:number;color:string;round:boolean}[]>([]);
  const [showKonami, setShowKonami]  = useState(false);

  /* ── XP toast ── */
  const [showXP, setShowXP]   = useState(false);
  const xpShown = useRef(false);

  /* ── DOM refs (performance — 0 re-render) ── */
  const heroRef      = useRef<HTMLElement>(null);
  const glowRef      = useRef<HTMLDivElement>(null);
  const heroTextRef  = useRef<HTMLDivElement>(null);
  const heroCardRef  = useRef<HTMLDivElement>(null);
  const notifIdx     = useRef(0);

  /* ── Mouse: glow + parallax globs ── */
  const handleHeroMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!heroRef.current || !glowRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    glowRef.current.style.left    = `${x - 220}px`;
    glowRef.current.style.top     = `${y - 220}px`;
    glowRef.current.style.opacity = "1";
  }, []);

  /* ── Design system partagé (polices + keyframes communes) ── */
  useDesignSystem();

  /* ── Effects ── */
  useEffect(() => {
    /* Keyframes propres à la home (confetti, easter eggs, coverflow, cartes...) */
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes floatCard     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
      @keyframes pulseGlow     { 0%,100%{opacity:.09;transform:scale(1)} 50%{opacity:.18;transform:scale(1.07)} }
      @keyframes heroIn        { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
      @keyframes eggBounce     { 0%{transform:translate(-50%,-50%) scale(0)} 65%{transform:translate(-50%,-50%) scale(1.08)} 80%{transform:translate(-50%,-50%) scale(0.96)} 100%{transform:translate(-50%,-50%) scale(1)} }
      @keyframes floatNotif    { 0%{opacity:0;transform:translateY(0) scale(0.9)} 12%{opacity:1;transform:translateY(-6px) scale(1)} 80%{opacity:1} 100%{opacity:0;transform:translateY(-80px)} }
      @keyframes confettiRain  { 0%{transform:translateY(-20px) rotate(0deg);opacity:1} 100%{transform:translateY(110vh) rotate(calc(var(--spin)*1deg));opacity:.15} }
      @keyframes konamiBadge   { 0%{transform:translate(-50%,-50%) scale(0) rotate(-10deg)} 60%{transform:translate(-50%,-50%) scale(1.1) rotate(2deg)} 80%{transform:translate(-50%,-50%) scale(0.97)} 100%{transform:translate(-50%,-50%) scale(1) rotate(0deg)} }
      @keyframes xpSlideUp     { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
      @keyframes shake          { 0%,100%{transform:rotate(0)} 20%{transform:rotate(-6deg)} 40%{transform:rotate(6deg)} 60%{transform:rotate(-4deg)} 80%{transform:rotate(4deg)} }
      @keyframes sparkBurst    { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--tx),var(--ty)) scale(0);opacity:0} }
      @keyframes konamiRainbow { 0%,100%{color:#0EA5E9} 50%{color:#F97316} }
      @keyframes borderSpin    { 0%{filter:hue-rotate(0deg)} 100%{filter:hue-rotate(360deg)} }
      @keyframes shimmerScan   { 0%{transform:translateX(-100%)} 60%,100%{transform:translateX(200%)} }
      .stmg-float   { animation: floatCard 6s ease-in-out infinite; }
    `;
    document.head.appendChild(style);

    /* Scroll: navbar + parallax + XP toast */
    const onScroll = () => {
      const sy = window.scrollY;
      setScrolled(sy > 30);

      /* Parallax hero */
      if (heroTextRef.current && sy < 800)
        heroTextRef.current.style.transform = `translateY(${sy * 0.18}px)`;
      if (heroCardRef.current && sy < 800)
        heroCardRef.current.style.transform = `translateY(${sy * 0.07}px)`;

      /* XP toast bottom */
      const pct = sy / (document.body.scrollHeight - window.innerHeight);
      if (pct > 0.88 && !xpShown.current) {
        xpShown.current = true;
        setShowXP(true);
        setTimeout(() => setShowXP(false), 3500);
      }
    };
    window.addEventListener("scroll", onScroll, { passive:true });

    /* Intersection observer scroll reveal */
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("stmg-visible"); }),
      { threshold:0.12 }
    );
    const t = setTimeout(() => document.querySelectorAll(".stmg-reveal").forEach(el => obs.observe(el)), 100);

    /* Floating notifications interval */
    const notifInterval = setInterval(() => {
      const n = NOTIFS[notifIdx.current % NOTIFS.length];
      notifIdx.current++;
      const id = Date.now();
      setFloatNotifs(prev => [...prev.slice(-4), { id, ...n, x: 5 + Math.random() * 55 }]);
      setTimeout(() => setFloatNotifs(prev => prev.filter(p => p.id !== id)), 3200);
    }, 2400);

    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(t);
      obs.disconnect();
      clearInterval(notifInterval);
    };
  }, []);

  /* ── Typewriter loop ── */
  useEffect(() => {
    const target = PHRASES[phraseIdx];
    if (!deleting && displayed.length < target.length) {
      const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 58);
      return () => clearTimeout(t);
    }
    if (!deleting && displayed.length === target.length) {
      const t = setTimeout(() => setDeleting(true), 2700);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length > 0) {
      const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 30);
      return () => clearTimeout(t);
    }
    if (deleting && displayed.length === 0) {
      setDeleting(false);
      setPhraseIdx((phraseIdx + 1) % PHRASES.length);
    }
  }, [displayed, deleting, phraseIdx]);

  /* ── Konami code listener ── */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const next = konamiIdx + (e.key === KONAMI[konamiIdx] ? 1 : 0);
      if (e.key !== KONAMI[konamiIdx]) { setKonamiIdx(0); return; }
      if (next === KONAMI.length) {
        setKonamiIdx(0);
        const colors = [D.primary,D.sky,D.cyan,D.orange,D.amber,D.emerald,"#fff","#EF4444"];
        const pieces = Array.from({ length:80 }, (_, i) => ({
          id:i, x:Math.random()*100,
          dur:1.8+Math.random()*2.2, delay:Math.random()*1.2,
          w:5+Math.random()*8, h:7+Math.random()*14,
          color:colors[Math.floor(Math.random()*colors.length)],
          round:Math.random()>0.55,
        }));
        setConfetti(pieces);
        setShowKonami(true);
        setTimeout(() => { setConfetti([]); setShowKonami(false); }, 6000);
      } else {
        setKonamiIdx(next);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [konamiIdx]);

  /* ── Easter egg logo ── */
  const handleLogoClick = () => {
    if (eggFound) return;
    const next = logoClicks + 1;
    setLogoClicks(next);
    setEggShake(true);
    setTimeout(() => setEggShake(false), 500);
    if (next >= 5) {
      setEggFound(true);
      setShowEgg(true);
      setTimeout(() => setShowEgg(false), 5000);
    }
  };

  const famille = FAMILLES[familleActive];

  return (
    <div style={{ fontFamily:F_DISPLAY, background:D.light, minHeight:"100vh" }}>
      <Grain />

      {/* ── Confetti Konami ── */}
      {confetti.map(p => (
        <div key={p.id} style={{
          position:"fixed", top:"-12px", left:`${p.x}%`, zIndex:9997, pointerEvents:"none",
          width:`${p.w}px`, height:`${p.h}px`,
          borderRadius: p.round ? "50%" : "2px",
          background:p.color,
          animation:`confettiRain ${p.dur}s ease-in ${p.delay}s forwards`,
          "--spin": `${360 + Math.random()*720}`,
        } as React.CSSProperties} />
      ))}

      {/* ── Konami badge popup ── */}
      {showKonami && (
        <div style={{ position:"fixed", top:"50%", left:"50%", zIndex:9999, pointerEvents:"none", animation:"konamiBadge 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
          <div style={{ background:"linear-gradient(135deg,#040D1C,#071E3D)", border:"2px solid rgba(37,99,235,0.7)", borderRadius:"28px", padding:"44px 56px", textAlign:"center", boxShadow:"0 40px 100px rgba(0,0,0,0.8), 0 0 80px rgba(37,99,235,0.35)" }}>
            <div style={{ fontSize:"5rem", marginBottom:"12px" }}>🎮</div>
            <p style={{ fontFamily:F_DISPLAY, fontWeight:900, fontSize:"1.6rem", color:"white", margin:"0 0 8px", animation:"konamiRainbow 2s linear infinite" }}>KONAMI CODE !</p>
            <p style={{ color:D.sky, fontFamily:F_DISPLAY, fontWeight:800, fontSize:"1.1rem", margin:"0 0 16px" }}>+9999 XP débloqués 😈</p>
            <p style={{ color:"rgba(255,255,255,0.4)", fontSize:"0.88rem", fontFamily:F_DISPLAY, margin:0 }}>
              ↑ ↑ ↓ ↓ ← → ← → B A<br />
              <span style={{ color:D.cyan }}>Tu as le profil d'un vrai Challenger.</span>
            </p>
          </div>
        </div>
      )}

      {/* ── Easter egg logo popup ── */}
      {showEgg && (
        <div style={{ position:"fixed", top:"50%", left:"50%", zIndex:9999, pointerEvents:"none", animation:"eggBounce 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
          <div style={{ background:"linear-gradient(135deg,#040D1C,#071E3D)", border:"2px solid rgba(37,99,235,0.6)", borderRadius:"24px", padding:"36px 48px", textAlign:"center", boxShadow:"0 30px 80px rgba(0,0,0,0.7), 0 0 60px rgba(37,99,235,0.3)" }}>
            <div style={{ fontSize:"4rem", marginBottom:"12px" }}>🔍</div>
            <p style={{ fontFamily:F_DISPLAY, fontWeight:900, fontSize:"1.4rem", color:"white", margin:"0 0 8px" }}>Easter egg trouvé !</p>
            <p style={{ color:D.sky, fontFamily:F_DISPLAY, fontWeight:700, fontSize:"1rem", margin:"0 0 16px" }}>+100 XP… ou peut-être pas 😏</p>
            <p style={{ color:"rgba(255,255,255,0.45)", fontSize:"0.88rem", fontFamily:F_DISPLAY }}>
              Tu es curieux — c'est une qualité STMG.<br />
              Tu es clairement un <strong style={{ color:D.cyan }}>Explorateur</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ── XP toast ── */}
      {showXP && (
        <div style={{ position:"fixed", bottom:"32px", left:"50%", zIndex:9999, pointerEvents:"none", animation:"xpSlideUp 0.45s ease forwards" }}>
          <div style={{ background:"linear-gradient(135deg,#040D1C,#071E3D)", border:"1px solid rgba(37,99,235,0.4)", borderRadius:"100px", padding:"14px 28px", display:"flex", alignItems:"center", gap:"12px", boxShadow:"0 12px 40px rgba(0,0,0,0.5)" }}>
            <span style={{ fontSize:"1.4rem" }}>⭐</span>
            <span style={{ fontFamily:F_DISPLAY, fontWeight:800, fontSize:"0.95rem", color:"white" }}>+10 XP — Tu es allé jusqu'au bout. Respect.</span>
          </div>
        </div>
      )}

      {/* ═══ NAVBAR ═══ */}
      <nav style={{
        position:"fixed", top:0, left:0, right:0, zIndex:100,
        background: scrolled ? "rgba(4,13,28,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "none",
        padding:"16px 32px", display:"flex", alignItems:"center", justifyContent:"space-between",
        transition:"all 0.3s",
      }}>
        <div style={{ position:"relative" }}>
          <div style={{ animation:eggShake ? "shake 0.5s ease" : "none" }}>
            <Logo size="md" onDark onClick={handleLogoClick} />
          </div>
          {logoClicks > 0 && !eggFound && (
            <div style={{ position:"absolute", top:"-6px", right:"-10px", background:D.primary, color:"white", fontFamily:F_DISPLAY, fontWeight:900, fontSize:"0.6rem", borderRadius:"100px", padding:"2px 6px", lineHeight:1.4 }}>
              {5 - logoClicks}x
            </div>
          )}
          {konamiIdx > 0 && (
            <div style={{ position:"absolute", top:"-6px", left:"-10px", background:D.orange, color:"white", fontFamily:F_DISPLAY, fontWeight:900, fontSize:"0.6rem", borderRadius:"100px", padding:"2px 6px", lineHeight:1.4 }}>
              {konamiIdx}/{KONAMI.length}
            </div>
          )}
        </div>
        <div style={{ display:"flex", gap:"12px", alignItems:"center" }} className="hidden md:flex">
          {estConnecte ? (
            <>
              <PrimaryBtn onClick={onConnexion}>Accéder à la plateforme →</PrimaryBtn>
              {onDeconnexion && <GhostBtn onClick={onDeconnexion}>Se déconnecter</GhostBtn>}
            </>
          ) : (
            <>
              <GhostBtn onClick={onConnexion}>Se connecter</GhostBtn>
              <PrimaryBtn onClick={onInscription}>Rejoindre la plateforme</PrimaryBtn>
            </>
          )}
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden"
          style={{ background:"none", border:"1px solid rgba(255,255,255,0.2)", color:"white", width:"40px", height:"40px", borderRadius:"10px", fontSize:"1.1rem", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {menuOpen && (
        <div style={{ position:"fixed", top:"64px", left:0, right:0, zIndex:99, background:"rgba(4,13,28,0.97)", backdropFilter:"blur(20px)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"20px 24px", display:"flex", flexDirection:"column", gap:"12px" }}>
          {estConnecte ? (
            <>
              <PrimaryBtn onClick={() => { onConnexion(); setMenuOpen(false); }} size="lg">Accéder à la plateforme →</PrimaryBtn>
              {onDeconnexion && <GhostBtn onClick={() => { onDeconnexion(); setMenuOpen(false); }}>Se déconnecter</GhostBtn>}
            </>
          ) : (
            <>
              <PrimaryBtn onClick={() => { onInscription(); setMenuOpen(false); }} size="lg">Rejoindre la plateforme</PrimaryBtn>
              <GhostBtn onClick={() => { onConnexion(); setMenuOpen(false); }}>Se connecter</GhostBtn>
            </>
          )}
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section ref={heroRef} onMouseMove={handleHeroMouseMove}
        style={{ minHeight:"100vh", background:D.dark, display:"flex", alignItems:"center", padding:"120px 32px 80px", position:"relative", overflow:"hidden" }}>

        {/* Background glows statiques animés */}
        {[
          { color:D.primary, top:"-100px", left:"-100px",   size:"500px", delay:"0s" },
          { color:D.cyan,    bottom:"-100px", right:"-80px", size:"420px", delay:"3s" },
          { color:D.sky,     top:"40%", left:"38%",          size:"280px", delay:"6s" },
        ].map((g, i) => (
          <div key={i} style={{
            position:"absolute", top:g.top, left:g.left, right:g.right, bottom:g.bottom,
            width:g.size, height:g.size, borderRadius:"50%",
            background:g.color, filter:"blur(90px)",
            animation:`pulseGlow 9s ease-in-out ${g.delay} infinite`,
            pointerEvents:"none",
          }} />
        ))}

        {/* Glow qui suit la souris (DOM direct) */}
        <div ref={glowRef} style={{
          position:"absolute", width:"440px", height:"440px", borderRadius:"50%",
          background:"radial-gradient(circle, rgba(37,99,235,0.2) 0%, transparent 70%)",
          pointerEvents:"none", zIndex:1, opacity:0,
          transition:"left 0.1s ease, top 0.1s ease",
        }} />

        {/* Grille */}
        <div style={{
          position:"absolute", inset:0, opacity:0.025,
          backgroundImage:"linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize:"60px 60px", pointerEvents:"none",
        }} />

        {/* Floating notifications */}
        {floatNotifs.map(n => (
          <div key={n.id} style={{
            position:"absolute", bottom:"12%", left:`${n.x}%`,
            pointerEvents:"none", zIndex:3,
            animation:"floatNotif 3.2s ease-out forwards",
            background:"rgba(7,18,36,0.88)", backdropFilter:"blur(10px)",
            border:`1px solid ${n.color}45`, borderRadius:"100px",
            padding:"8px 16px", display:"flex", alignItems:"center", gap:"8px",
            boxShadow:`0 4px 24px ${n.color}30`, whiteSpace:"nowrap",
          }}>
            <span style={{ fontSize:"1rem" }}>{n.emoji}</span>
            <span style={{ color:"white", fontFamily:F_DISPLAY, fontWeight:800, fontSize:"0.8rem" }}>{n.text}</span>
          </div>
        ))}

        <div style={{ maxWidth:"1200px", margin:"0 auto", width:"100%", position:"relative", zIndex:2, display:"flex", flexDirection:"row", gap:"64px", alignItems:"center", flexWrap:"wrap", justifyContent:"center" }}>

          {/* Hero text avec stagger d'entrée + parallax */}
          <div ref={heroTextRef} style={{ flex:"1 1 480px", maxWidth:"620px" }}>
            {/* Badge — entrée 1 */}
            <div style={{ animation:"heroIn 0.7s ease 0.1s both" }}>
              <Eyebrow dark>La plateforme de révision STMG</Eyebrow>
            </div>

            {/* H1 — entrée 2 */}
            <div style={{ animation:"heroIn 0.7s ease 0.28s both" }}>
              <h1 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"clamp(2.6rem,6vw,4.2rem)", lineHeight:1.1, color:"white", marginBottom:"24px", letterSpacing:"-0.04em" }}>
                La plateforme qui te donne
                <br />
                <span style={{ color:D.sky }}>
                  {displayed}
                </span>
                <span style={{ animation:"stmgCursorBlink 1s ease infinite", color:D.orange, fontWeight:300 }}>|</span>
              </h1>
            </div>

            {/* Subtext — entrée 3 */}
            <div style={{ animation:"heroIn 0.7s ease 0.46s both" }}>
              <p style={{ fontFamily:F_BODY, fontSize:"1.15rem", color:"rgba(255,255,255,0.55)", lineHeight:1.8, marginBottom:"40px", maxWidth:"520px" }}>
                QCM interactifs, duels entre élèves, cartes de révision à collectionner, classement national — tout le programme STMG dans une expérience unique et gamifiée.
              </p>
            </div>

            {/* CTAs — entrée 4 */}
            <div style={{ animation:"heroIn 0.7s ease 0.62s both" }}>
              <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", marginBottom:"52px" }}>
                {estConnecte ? (
                  <PrimaryBtn onClick={onConnexion} size="lg">Accéder à la plateforme →</PrimaryBtn>
                ) : (
                  <>
                    <PrimaryBtn onClick={onInscription} size="lg">Rejoindre la plateforme →</PrimaryBtn>
                    <GhostBtn onClick={onConnexion} size="lg">Se connecter</GhostBtn>
                  </>
                )}
              </div>
            </div>

            {/* Stats — entrée 5 */}
            <div style={{ animation:"heroIn 0.7s ease 0.78s both", display:"flex", alignItems:"center", gap:"28px", flexWrap:"wrap" }}>
              {[
                { val:"86+", label:"Chapitres couverts" },
                { val:"05",  label:"Matières STMG" },
                { val:"∞",   label:"Cartes à collectionner" },
              ].map((s, i) => (
                <Fragment key={i}>
                  {i > 0 && <span style={{ width:"1px", height:"32px", background:"rgba(255,255,255,0.12)", flexShrink:0 }} />}
                  <div>
                    <div style={{ fontFamily:F_MONO, fontWeight:600, fontSize:"1.7rem", color:"white", lineHeight:1 }}>{s.val}</div>
                    <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.78rem", fontFamily:F_DISPLAY, fontWeight:500, marginTop:"6px" }}>{s.label}</div>
                  </div>
                </Fragment>
              ))}
            </div>
          </div>

          {/* Preview card avec parallax */}
          <div ref={heroCardRef} style={{ flexShrink:0 }} className="stmg-float">
            <AppPreview />
          </div>
        </div>
      </section>

      <Marquee items={MARQUEE_ITEMS} />

      {/* ═══ FEATURES ═══ */}
      <section style={{ padding:"96px 32px", background:"white" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div className="stmg-reveal" style={{ textAlign:"center", marginBottom:"64px" }}>
            <Eyebrow color={D.primary} center>Ce que tu obtiens</Eyebrow>
            <h2 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"clamp(2rem,5vw,3rem)", color:D.text, marginBottom:"16px", letterSpacing:"-0.03em" }}>
              Tout ce qu'il faut pour réussir <Highlight color={D.primary}>ton Bac</Highlight>
            </h2>
            <p style={{ fontFamily:F_BODY, color:D.muted, fontSize:"1.05rem", maxWidth:"540px", margin:"0 auto", lineHeight:1.8 }}>
              Chaque fonctionnalité est pensée pour mémoriser plus vite, rester motivé et progresser tout au long de l'année.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(300px, 1fr))", gap:"24px" }}>
            {[
              { icon:"target", iconBg:`linear-gradient(135deg,${D.primary}18,${D.sky}18)`,    title:"QCM & révisions interactives",     desc:"Des centaines de questions par chapitre, organisées par niveau. Tu avances à ton rythme et gagnes de l'XP à chaque bonne réponse.",                                     tag:"Tout le programme officiel",   tagColor:D.primary },
              { icon:"layers", iconBg:`linear-gradient(135deg,${D.cyan}18,${D.emerald}18)`,   title:"Cartes de révision à collectionner", desc:"Chaque notion clé devient une carte avec sa rareté. Complète ta collection en progressant dans les chapitres.",                                                         tag:"Système de collection unique", tagColor:D.cyan },
              { icon:"zap", iconBg:`linear-gradient(135deg,${D.orange}18,${D.amber}18)`,   title:"Duels & classement national",       desc:"Défie tes camarades en duel en temps réel. Chaque XP compte pour le classement de ton lycée parmi tous les lycées STMG de France.",                                   tag:"Compétition en temps réel",    tagColor:D.orange },
            ].map((f, i) => (
              <div key={i} className="stmg-reveal" style={{ animationDelay:`${i*0.12}s` }}>
                <FeatureCard {...f} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ COVERFLOW — DÉCOUVRE LA PLATEFORME ═══ */}
      <section style={{ padding:"96px 32px", background:D.darkMid, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"700px", height:"400px", borderRadius:"50%", background:D.primary, opacity:0.06, filter:"blur(120px)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative" }}>
          <div className="stmg-reveal" style={{ textAlign:"center", marginBottom:"56px" }}>
            <Eyebrow dark center>Découvre la plateforme</Eyebrow>
            <h2 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"clamp(2rem,5vw,3rem)", color:"white", marginBottom:"16px", letterSpacing:"-0.03em" }}>
              Une expérience pensée <Highlight color={D.cyan}>pour toi</Highlight>
            </h2>
            <p style={{ fontFamily:F_BODY, color:"rgba(255,255,255,0.5)", fontSize:"1.05rem", maxWidth:"540px", margin:"0 auto", lineHeight:1.8 }}>
              Clique sur une carte ou utilise les flèches pour parcourir tout ce que STMG HUB te propose.
            </p>
          </div>
          <div className="stmg-reveal">
            <Coverflow slides={COVER_SLIDES} />
          </div>
        </div>
      </section>

      {/* ═══ 5 FAMILLES ═══ */}
      <section style={{ padding:"96px 32px", background:D.light }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <div className="stmg-reveal" style={{ textAlign:"center", marginBottom:"52px" }}>
            <Eyebrow color={D.orange} center>Ton profil de révision</Eyebrow>
            <h2 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"clamp(2rem,5vw,3rem)", color:D.text, marginBottom:"16px", letterSpacing:"-0.03em" }}>
              Quelle <Highlight color={D.orange}>famille</Highlight> es-tu ?
            </h2>
            <p style={{ fontFamily:F_BODY, color:D.muted, fontSize:"1.05rem", maxWidth:"560px", margin:"0 auto", lineHeight:1.8 }}>
              Un quiz de 15 questions révèle ta famille parmi 5 profils uniques. Chaque famille a ses forces, son style, ses stratégies de révision.
            </p>
          </div>
          <div className="stmg-reveal" style={{ display:"flex", gap:"10px", justifyContent:"center", flexWrap:"wrap", marginBottom:"36px" }}>
            {FAMILLES.map((f, i) => (
              <button key={i} onClick={() => setFamilleActive(i)}
                style={{
                  background: familleActive === i ? f.color : "white",
                  color: familleActive === i ? "white" : D.text,
                  border: familleActive === i ? `1.5px solid ${f.color}` : `1.5px solid ${D.border}`,
                  fontFamily:F_DISPLAY, fontWeight:600, fontSize:"0.9rem",
                  padding:"10px 20px", borderRadius:"8px", cursor:"pointer",
                  boxShadow: familleActive === i ? `0 6px 20px ${f.color}35` : "none",
                  transform: familleActive === i ? "translateY(-2px)" : "none",
                  transition:"all 0.2s", display:"flex", alignItems:"center", gap:"8px",
                }}>
                <span>{f.emoji}</span>{f.nom}
              </button>
            ))}
          </div>
          <Tilt3D style={{ borderRadius:"4px 32px 4px 32px" }}>
            <div style={{ background:"white", borderRadius:"4px 32px 4px 32px", padding:"40px", border:`1.5px solid ${famille.color}30`, boxShadow:`0 12px 48px ${famille.color}12`, transition:"border-color 0.3s, box-shadow 0.3s" }}>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"52px", alignItems:"center" }} className="block md:grid">
                <div>
                  <div style={{ fontSize:"4rem", marginBottom:"16px" }}>{famille.emoji}</div>
                  <h3 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"2.2rem", color:famille.color, marginBottom:"8px", letterSpacing:"-0.03em" }}>{famille.nom}</h3>
                  <p style={{ color:D.subtle, fontFamily:F_MONO, fontWeight:500, fontSize:"0.8rem", marginBottom:"18px", letterSpacing:"0.06em", textTransform:"uppercase" }}>{famille.trait}</p>
                  <p style={{ fontFamily:F_BODY, color:D.muted, fontSize:"1rem", lineHeight:1.8, marginBottom:"24px" }}>{famille.desc}</p>
                  <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
                    {famille.traits.map((t, i) => (
                      <span key={i} style={{ background:famille.color+"15", color:famille.color, fontFamily:F_MONO, fontWeight:500, fontSize:"0.78rem", padding:"6px 14px", borderRadius:"6px", border:`1px solid ${famille.color}30` }}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{ background:D.dark, borderRadius:"4px 24px 4px 24px", padding:"32px" }}>
                  <p style={{ color:"rgba(255,255,255,0.4)", fontFamily:F_MONO, fontWeight:500, fontSize:"0.72rem", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:"20px" }}>
                    Ton Triple Totem — révélé après le quiz
                  </p>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"12px", marginBottom:"28px" }}>
                    {[{ emoji:"🐾", label:"Animal totem" },{ emoji:"⚔️", label:"Objet mythique" },{ emoji:"⭐", label:"Star inspirante" }].map((t, i) => (
                      <div key={i} style={{ textAlign:"center", padding:"20px 8px", borderRadius:"4px 14px 4px 14px", background:famille.bg, border:`1px solid ${famille.border}` }}>
                        <div style={{ fontSize:"2rem", marginBottom:"8px" }}>{t.emoji}</div>
                        <p style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.7rem", fontFamily:F_MONO, fontWeight:500, margin:0 }}>{t.label}</p>
                        <p style={{ color:famille.color, fontSize:"0.72rem", fontFamily:F_DISPLAY, fontWeight:700, marginTop:"4px" }}>À révéler</p>
                      </div>
                    ))}
                  </div>
                  <PrimaryBtn onClick={estConnecte ? onConnexion : onInscription} size="lg">
                    {estConnecte ? "Voir mon profil →" : "Faire le quiz →"}
                  </PrimaryBtn>
                </div>
              </div>
            </div>
          </Tilt3D>
        </div>
      </section>

      {/* ═══ CARTES À COLLECTIONNER ═══ */}
      <section style={{ padding:"96px 32px", background:D.dark, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"700px", height:"400px", borderRadius:"50%", background:D.cyan, opacity:0.05, filter:"blur(120px)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative" }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"72px", alignItems:"center" }} className="block md:grid">
            <div className="stmg-reveal">
              <Eyebrow color={D.cyan}>Cartes de révision</Eyebrow>
              <h2 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"clamp(1.8rem,4vw,2.8rem)", color:"white", marginBottom:"20px", lineHeight:1.2, letterSpacing:"-0.03em" }}>
                Révise en collectionnant.<br />
                <span style={{ background:"linear-gradient(120deg,#06B6D4,#0EA5E9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  Chaque notion devient une carte.
                </span>
              </h2>
              <p style={{ fontFamily:F_BODY, color:"rgba(255,255,255,0.5)", fontSize:"1rem", lineHeight:1.8, marginBottom:"32px" }}>
                Chaque chapitre génère des cartes avec leurs définitions, exemples et notions clés. Plus tu progresses, plus tu débloques des cartes rares — jusqu'aux Légendaires réservées aux meilleurs élèves.
              </p>
              <div style={{ display:"flex", flexDirection:"column", gap:"14px", marginBottom:"36px" }}>
                {[
                  { label:"Commune",     color:"#94A3B8", desc:"Notions de base — accessible dès le début" },
                  { label:"Peu Commune", color:"#10B981", desc:"Notions courantes — bien maîtrisées" },
                  { label:"Rare",        color:"#60A5FA", desc:"Notions clés — mérite le travail" },
                  { label:"Épique",      color:"#C084FC", desc:"Notions avancées — pour les motivés" },
                  { label:"Légendaire",  color:"#FBBF24", desc:"Maîtrise confirmée — rare à obtenir" },
                  { label:"Ultra Rare",  color:"#F472B6", desc:"Maîtrise totale — réservée aux meilleurs ✨" },
                ].map((r, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px" }}>
                    <span style={{ width:"10px", height:"10px", borderRadius:"50%", background:r.color, boxShadow:`0 0 8px ${r.color}`, flexShrink:0 }} />
                    <span style={{ fontFamily:F_MONO, fontWeight:600, fontSize:"0.82rem", color:r.color, minWidth:"92px" }}>{r.label}</span>
                    <span style={{ fontFamily:F_BODY, color:"rgba(255,255,255,0.4)", fontSize:"0.85rem" }}>{r.desc}</span>
                  </div>
                ))}
              </div>
              <PrimaryBtn onClick={estConnecte ? onConnexion : onInscription} size="lg">
                {estConnecte ? "Voir ma collection →" : "Commencer ma collection →"}
              </PrimaryBtn>
            </div>
            <div className="stmg-reveal" style={{ display:"flex", gap:"10px", alignItems:"center", justifyContent:"center", flexWrap:"wrap", padding:"20px 0" }}>
              <CollectibleCard image="/cartes/th1/drop1/1.jpg"           titre="L'Action Collective Organisée" chapitre="Hero Agency"  rarete="Commune"    color="#94A3B8" rotate="-10deg" />
              <CollectibleCard image="/cartes/th1/drop1/29.jpg"          titre="La Culture d'Organisation"     chapitre="Hero Agency"  rarete="Rare"       color="#60A5FA" rotate="-4deg"  />
              <CollectibleCard image="/cartes/th1/drop1/37.jpg"          titre="Le Leadership"                 chapitre="Hero Agency"  rarete="Épique"     color="#A78BFA" rotate="1deg"   />
              <CollectibleCard image="/cartes/th2/drop1%20th2/6.jpg"     titre="Le Cloud Computing"            chapitre="Data Queens"  rarete="Légendaire" color="#FBBF24" rotate="6deg"   />
              <CollectibleCard image="/cartes/th2/drop2%20th2/9.jpg"     titre="L'Intelligence Collective"     chapitre="Hive Mind"    rarete="Ultra Rare" color="#F472B6" rotate="11deg"  />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ MATIÈRES ═══ */}
      <section style={{ padding:"64px 32px", background:"white" }}>
        <div className="stmg-reveal" style={{ maxWidth:"900px", margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"clamp(1.6rem,4vw,2.4rem)", color:D.text, marginBottom:"14px", letterSpacing:"-0.02em" }}>
            Tout le programme STMG couvert
          </h2>
          <p style={{ fontFamily:F_BODY, color:D.muted, fontSize:"1rem", marginBottom:"40px", lineHeight:1.75 }}>
            Des chapitres structurés par matière, alignés sur le programme officiel du Baccalauréat.
          </p>
          <div style={{ display:"flex", gap:"14px", flexWrap:"wrap", justifyContent:"center" }}>
            {[
              { label:"Management", code:"MGT", color:D.primary },
              { label:"SDGN",       code:"SDG", color:D.sky },
              { label:"Économie",   code:"ECO", color:D.emerald },
              { label:"Droit",      code:"DRT", color:D.orange },
              { label:"Maths",      code:"MTH", color:D.cyan },
            ].map((m, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:"12px", background:D.light, border:`1.5px solid ${m.color}30`, borderRadius:"4px 14px 4px 14px", padding:"12px 20px", boxShadow:`0 4px 16px ${m.color}10`, transition:"transform 0.2s, box-shadow 0.2s", cursor:"default" }}
                onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow=`0 10px 28px ${m.color}25`; }}
                onMouseLeave={e => { e.currentTarget.style.transform="translateY(0)";    e.currentTarget.style.boxShadow=`0 4px 16px ${m.color}10`; }}>
                <span style={{ fontFamily:F_MONO, fontWeight:700, fontSize:"0.68rem", letterSpacing:"0.04em", color:"white", background:m.color, borderRadius:"3px", padding:"3px 6px" }}>{m.code}</span>
                <span style={{ fontFamily:F_DISPLAY, fontWeight:600, fontSize:"0.95rem", color:D.text }}>{m.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section style={{ padding:"96px 32px", background:D.darkMid, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:"600px", height:"600px", borderRadius:"50%", background:D.primary, opacity:0.04, filter:"blur(100px)", pointerEvents:"none" }} />
        <div style={{ maxWidth:"1100px", margin:"0 auto", position:"relative" }}>
          <div className="stmg-reveal" style={{ textAlign:"center", marginBottom:"72px" }}>
            <Eyebrow dark center>Trois étapes</Eyebrow>
            <h2 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"clamp(2rem,5vw,3rem)", color:"white", letterSpacing:"-0.03em" }}>
              Prêt en moins de <Highlight color={D.sky}>5 minutes</Highlight>
            </h2>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(280px, 1fr))", gap:"52px" }}>
            {[
              { num:"01", icon:"rocket", title:"Crée ton profil",       desc:"Inscris-toi, fais le quiz de personnalité et découvre ta famille STMG. Tout ça en 5 minutes.",                                                  color:D.primary },
              { num:"02", icon:"target", title:"Choisis tes chapitres", desc:"Accède à l'intégralité du programme, lance des QCM, collecte des cartes et joue à des mini-jeux pédagogiques.",                              color:D.sky },
              { num:"03", icon:"trophy", title:"Grimpe au classement",  desc:"Gagne de l'XP, débloque des badges, défie tes camarades en duel et propulse ton lycée en tête du classement national.",                      color:D.cyan },
            ].map((s, i) => (
              <div key={i} className="stmg-reveal" style={{ animationDelay:`${i*0.15}s` }}>
                <StepCard {...s} />
              </div>
            ))}
          </div>
          <div className="stmg-reveal" style={{ textAlign:"center", marginTop:"56px" }}>
            <PrimaryBtn onClick={estConnecte ? onConnexion : onInscription} size="lg">
              {estConnecte ? "Reprendre mes révisions →" : "Rejoindre la plateforme →"}
            </PrimaryBtn>
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section style={{ padding:"100px 32px", background:"linear-gradient(140deg,#040D1C,#071E3D)", position:"relative", overflow:"hidden", textAlign:"center" }}>
        {[
          { color:D.primary, top:"-60px",   left:"-60px",  size:"400px" },
          { color:D.cyan,    bottom:"-80px", right:"-60px", size:"350px" },
        ].map((g, i) => (
          <div key={i} style={{ position:"absolute", top:g.top, left:g.left, right:g.right, bottom:g.bottom, width:g.size, height:g.size, borderRadius:"50%", background:g.color, opacity:0.09, filter:"blur(80px)", pointerEvents:"none" }} />
        ))}
        <div className="stmg-reveal" style={{ maxWidth:"640px", margin:"0 auto", position:"relative" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"36px" }}>
            <Logo size="lg" onDark />
          </div>
          <h2 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"clamp(2rem,6vw,3.8rem)", color:"white", marginBottom:"20px", lineHeight:1.12, letterSpacing:"-0.04em" }}>
            {estConnecte ? "Continue là où tu t'es arrêté." : "Ta progression commence maintenant."}
            <br />
            <span style={{ background:"linear-gradient(120deg,#2563EB,#0EA5E9)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
              {estConnecte ? "La plateforme t'attend." : "Rejoins la plateforme."}
            </span>
          </h2>
          <p style={{ fontFamily:F_BODY, color:"rgba(255,255,255,0.4)", fontSize:"1.05rem", lineHeight:1.8, marginBottom:"44px" }}>
            {estConnecte
              ? "Ta progression t'attend. Retourne sur la plateforme et continue tes révisions."
              : "Rejoins les lycéens STMG qui révisent autrement, collectionnent leurs cartes et grimpent au classement national."}
          </p>
          <PrimaryBtn onClick={estConnecte ? onConnexion : onInscription} size="lg">
            {estConnecte ? "Accéder à la plateforme →" : "Créer mon profil →"}
          </PrimaryBtn>
          <p style={{ color:"rgba(255,255,255,0.18)", fontSize:"0.76rem", fontFamily:F_MONO, marginTop:"22px" }}>
            Psst : essaie ↑ ↑ ↓ ↓ ← → ← → B A
          </p>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ background:"#020508", padding:"40px 32px", borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto", display:"flex", flexWrap:"wrap", justifyContent:"space-between", alignItems:"center", gap:"24px" }}>
          <Logo size="sm" onDark />
          <div style={{ display:"flex", gap:"28px", flexWrap:"wrap" }}>
            {["CGU & RGPD","Contact","Confidentialité"].map((item, i) => (
              <span key={i} style={{ color:"rgba(255,255,255,0.22)", fontSize:"0.82rem", cursor:"pointer", fontFamily:F_MONO, fontWeight:500, transition:"color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.22)")}>
                {item}
              </span>
            ))}
          </div>
          <p style={{ color:"rgba(255,255,255,0.18)", fontSize:"0.78rem", fontFamily:F_MONO }}>© 2026 STMG HUB</p>
        </div>
      </footer>

    </div>
  );
}
