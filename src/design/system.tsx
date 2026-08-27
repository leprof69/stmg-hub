/* ══════════════════════════════════════════════════════════════
   STMG HUB — Système de design partagé
   Extrait de la refonte de la page d'accueil (Accueil.tsx).
   Toute page qui veut le même langage visuel importe d'ici plutôt
   que de redéfinir ses propres tokens/couleurs/emoji.
══════════════════════════════════════════════════════════════ */
import { useEffect } from "react";

/* ─── Tokens ─── */
export const D = {
  primary:  "#2563EB",
  sky:      "#0EA5E9",
  cyan:     "#06B6D4",
  orange:   "#F97316",
  red:      "#EF4444",
  emerald:  "#10B981",
  amber:    "#F59E0B",
  dark:     "#0A0C10",
  darkMid:  "#0E121A",
  muted:    "#5B6472",
  subtle:   "#8B93A1",
  border:   "#E8E4DB",
  text:     "#111318",
  light:    "#FAF9F5",
};

/* ─── Typographie ─── */
export const F_DISPLAY = "'Space Grotesk', sans-serif";
export const F_BODY    = "'Inter', sans-serif";
export const F_MONO    = "'JetBrains Mono', monospace";

const FONTS_URL = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap";

const SHARED_KEYFRAMES = `
  @keyframes stmgRevealUp     { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes stmgCursorBlink  { 0%,100%{opacity:1} 50%{opacity:0} }
  @keyframes stmgMarquee      { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  .stmg-reveal  { opacity:0; transform:translateY(28px); }
  .stmg-visible { animation: stmgRevealUp 0.65s ease forwards; }
`;

/* ─── Hook : charge les polices + les keyframes partagées une seule fois ─── */
let injected = false;
export function useDesignSystem() {
  useEffect(() => {
    if (injected || document.querySelector("[data-stmg-design]")) { injected = true; return; }
    injected = true;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONTS_URL;
    link.setAttribute("data-stmg-design", "fonts");
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = SHARED_KEYFRAMES;
    style.setAttribute("data-stmg-design", "keyframes");
    document.head.appendChild(style);
  }, []);
}

/* ─── Grain — texture globale, calme les aplats de couleur ─── */
const GRAIN_URL = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
export const Grain = () => (
  <div style={{ position:"fixed", inset:0, zIndex:9998, pointerEvents:"none", opacity:0.035, mixBlendMode:"overlay", backgroundImage:GRAIN_URL }} />
);

/* ─── Eyebrow — étiquette mono, remplace les pastilles génériques ─── */
export const Eyebrow = ({ children, color = D.sky, dark = false, center = false }: { children: React.ReactNode; color?: string; dark?: boolean; center?: boolean }) => (
  <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"22px", justifyContent: center ? "center" : "flex-start" }}>
    <span style={{ width:"20px", height:"1.5px", background:color, flexShrink:0 }} />
    <span style={{ fontFamily:F_MONO, fontWeight:500, fontSize:"0.74rem", letterSpacing:"0.14em", textTransform:"uppercase", color: dark ? "rgba(255,255,255,0.55)" : color }}>
      {children}
    </span>
  </div>
);

/* ─── Highlight — marqueur derrière un mot, à la place du gradient-text répété ─── */
export const Highlight = ({ children, color = D.sky }: { children: React.ReactNode; color?: string }) => (
  <span style={{ position:"relative", display:"inline-block" }}>
    <span style={{ position:"absolute", left:"-5px", right:"-5px", bottom:"4%", top:"48%", background:color, opacity:0.9, transform:"rotate(-1deg)", zIndex:0, borderRadius:"2px" }} />
    <span style={{ position:"relative", zIndex:1 }}>{children}</span>
  </span>
);

/* ─── Marquee — bandeau défilant, repère éditorial ─── */
export const Marquee = ({ items }: { items: string[] }) => (
  <div style={{ position:"relative", overflow:"hidden", background:D.dark, borderTop:"1px solid rgba(255,255,255,0.08)", borderBottom:"1px solid rgba(255,255,255,0.08)", padding:"15px 0" }}>
    <div style={{ display:"flex", width:"max-content", animation:"stmgMarquee 36s linear infinite" }}>
      {[0,1].map(rep => (
        <div key={rep} style={{ display:"flex", alignItems:"center" }}>
          {items.map((item, i) => (
            <span key={i} style={{ display:"flex", alignItems:"center", fontFamily:F_MONO, fontWeight:500, fontSize:"0.82rem", letterSpacing:"0.08em", color:"rgba(255,255,255,0.32)", padding:"0 26px", whiteSpace:"nowrap" }}>
              {item}
              <span style={{ marginLeft:"26px", color:D.sky, opacity:0.55, fontSize:"0.6rem" }}>◆</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

/* ─── Icon — set minimal, remplace les emojis en usage structurel ─── */
export const Icon = ({ name, size = 24, strokeWidth = 1.6, style = {} }: { name: string; size?: number; strokeWidth?: number; style?: React.CSSProperties }) => {
  const p = { width:size, height:size, viewBox:"0 0 24 24", style };
  switch (name) {
    case "target": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.2"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/></svg>);
    case "layers": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="7" width="12" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-2"/></svg>);
    case "zap": return (<svg {...p} fill="currentColor" stroke="none"><polygon points="13,2 4,14 11,14 10,22 20,10 13,10"/></svg>);
    case "trophy": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M7 4h10v4a5 5 0 0 1-10 0V4z"/><path d="M7 5H4a1 1 0 0 0-1 1c0 2.5 1.8 4.5 4 4.9"/><path d="M17 5h3a1 1 0 0 1 1 1c0 2.5-1.8 4.5-4 4.9"/><line x1="12" y1="13" x2="12" y2="17"/><path d="M9 21h6"/><path d="M10 17h4l1 4H9l1-4z"/></svg>);
    case "globe": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth}><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><line x1="3" y1="12" x2="21" y2="12"/></svg>);
    case "award": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="6"/><path d="M8.5 14.2 7 22l5-3 5 3-1.5-7.8"/></svg>);
    case "rocket": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M12 2c3 2 5 6 5 10 0 2-1 4-2 5l-3 3-3-3c-1-1-2-3-2-5 0-4 2-8 5-10z"/><circle cx="12" cy="10" r="1.6"/><path d="M8 17l-3 3M16 17l3 3"/></svg>);
    case "crown": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M4 8l3.5 3L12 5l4.5 6L20 8l-1.8 10H5.8L4 8z"/></svg>);
    case "coin": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth}><circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.5 2 0 0 1 2.5-1.2c1.4 0 2.5.9 2.5 2s-1.1 1.6-2.5 2-2.5.9-2.5 2 1.1 2 2.5 2a2.5 2 0 0 0 2.5-1.2" strokeLinecap="round"/><line x1="12" y1="6" x2="12" y2="18"/></svg>);
    case "calendar": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><rect x="3.5" y="5" width="17" height="16" rx="2"/><line x1="3.5" y1="10" x2="20.5" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/></svg>);
    case "book": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5v-15z"/><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20"/></svg>);
    case "medal": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="15" r="5.5"/><path d="M9 10.5 6.5 3M15 10.5 17.5 3"/><path d="M12 12.5v5"/></svg>);
    case "logout": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round"><path d="M9 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h3"/><path d="M14 8l4 4-4 4"/><line x1="18" y1="12" x2="8" y2="12"/></svg>);
    case "plus": return (<svg {...p} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>);
    default: return null;
  }
};
