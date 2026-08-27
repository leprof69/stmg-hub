// @ts-nocheck
import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import {
  getPrestigePourNiveau,
  getPrestigeTotal,
  PRESTIGE_PAR_NIVEAU,
} from "../services/userProfileService";
import { formatJetons } from "../lib/jetons";
import { D, F_DISPLAY, F_BODY, F_MONO, useDesignSystem, Eyebrow, Icon } from "../design/system";

const CSS = `
@keyframes db-up  { from { opacity:0; transform:translateY(22px) } to { opacity:1; transform:translateY(0) } }
@keyframes db-pop { from { opacity:0; transform:scale(0.75) }      to { opacity:1; transform:scale(1) } }
@keyframes db-orb { 0%,100%{opacity:.45} 50%{opacity:.8} }
.db-hover { transition:transform .2s,box-shadow .2s; }
.db-hover:hover { transform:translateY(-3px); box-shadow:0 24px 48px rgba(0,0,0,.35)!important; }
.db-mat  { transition:all .2s ease; cursor:pointer; }
.db-mat:hover { transform:translateY(-6px) scale(1.04); }
.db-evrow{ transition:all .2s ease; }
.db-evrow:hover { transform:translateX(5px); border-color:rgba(14,165,233,.55)!important; }
`;

const motivations = {
  Architecte:  "Chaque grand projet commence par un plan. Tu es celui qui transforme le chaos en stratégie. Continue à construire.",
  Visionnaire: "Les plus grandes révolutions ont commencé dans la tête d'un seul individu. Cette tête, c'est la tienne.",
  Challenger:  "Tu ne joues pas pour participer. Tu joues pour gagner. Chaque jeton est une victoire de plus.",
  Explorateur: "La connaissance est la seule richesse qu'on ne peut pas te voler. Continue à explorer.",
  Influenceur: "Ton énergie est contagieuse. Les grands leaders ne naissent pas, ils se forment — tu es en train de te former.",
};

const emojis = {
  Architecte: "🧠", Visionnaire: "🎨", Challenger: "⚡", Explorateur: "🔬", Influenceur: "🔥",
};

const familleColors = {
  Architecte: "#2563EB", Visionnaire: "#0EA5E9", Challenger: "#F97316", Explorateur: "#10B981", Influenceur: "#F59E0B",
};

const matieres = [
  { nom: "Management",          code: "MGT", couleur: "#2563EB" },
  { nom: "Économie",            code: "ECO", couleur: "#10B981" },
  { nom: "Droit",                code: "DRT", couleur: "#0EA5E9" },
  { nom: "Sciences de Gestion", code: "SDG", couleur: "#06B6D4" },
  { nom: "Marketing",            code: "MKT", couleur: "#F97316" },
  { nom: "Ressources Humaines", code: "RH",  couleur: "#F59E0B" },
  { nom: "Gestion Finance",      code: "GF",  couleur: "#10B981" },
];

/* ─── En-tête de section — icône + libellé, remplace les titres emoji+gradient ─── */
const SectionTitle = ({ icon, children }: { icon: string; children: React.ReactNode }) => (
  <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"14px" }}>
    <span style={{ color:"#64748B" }}><Icon name={icon} size={18} strokeWidth={1.7} /></span>
    <h2 style={{ fontFamily:F_DISPLAY, fontWeight:700, fontSize:"1.15rem", color:"#F1F5F9", margin:0, letterSpacing:"-0.01em" }}>
      {children}
    </h2>
  </div>
);

export default function Dashboard({ profil }) {
  const [nouvelEvenement, setNouvelEvenement] = useState("");
  const [dateEvenement,   setDateEvenement]   = useState("");
  const [ajoutVisible,    setAjoutVisible]    = useState(false);

  const xpWallet           = profil.xp || 0;
  const prestigeClassement = getPrestigeTotal(profil);
  const prestigeNiveau     = getPrestigePourNiveau(profil);
  const niveau             = Math.floor(prestigeNiveau / PRESTIGE_PAR_NIVEAU) + 1;
  const palierBas          = (niveau - 1) * PRESTIGE_PAR_NIVEAU;
  const palierHaut         = niveau * PRESTIGE_PAR_NIVEAU;
  const progression        = palierHaut > palierBas ? ((prestigeNiveau - palierBas) / (palierHaut - palierBas)) * 100 : 0;
  const pointsVersPalier   = Math.max(0, palierHaut - prestigeNiveau);
  const familleColor       = familleColors[profil.famille] ?? "#2563EB";

  useDesignSystem();

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

  const ajouterEvenement = async () => {
    if (!nouvelEvenement || !dateEvenement) return;
    const user = auth.currentUser;
    await updateDoc(doc(db, "users", user.uid), {
      evenements: arrayUnion({ titre: nouvelEvenement, date: dateEvenement }),
    });
    setNouvelEvenement(""); setDateEvenement(""); setAjoutVisible(false);
  };

  return (
    <div style={{ minHeight:"100vh", padding:"28px 16px 52px", color:"#F1F5F9", position:"relative", fontFamily:F_DISPLAY }}>

      {/* Ambient orbs */}
      <div style={{ position:"fixed", top:"8%", left:"50%", transform:"translateX(-50%)", width:"700px", height:"380px", background:`radial-gradient(ellipse, ${familleColor}14 0%, transparent 68%)`, pointerEvents:"none", zIndex:0, animation:"db-orb 5s ease-in-out infinite" }} />
      <div style={{ position:"fixed", bottom:"15%", right:"-5%", width:"340px", height:"340px", background:"radial-gradient(circle, #0EA5E91A 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ maxWidth:"760px", margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* ══ HERO PLAYER CARD ══ */}
        <div className="db-hover" style={{
          background:`linear-gradient(145deg, rgba(13,27,53,.97) 0%, ${familleColor}15 100%)`,
          border:`1px solid ${familleColor}45`,
          borderRadius:"4px 28px 4px 28px",
          padding:"28px 24px 22px",
          marginBottom:"16px",
          backdropFilter:"blur(18px)",
          boxShadow:`0 0 55px ${familleColor}18, 0 20px 50px rgba(0,0,0,.45)`,
          animation:"db-up .5s ease both",
        }}>

          {/* Identity row */}
          <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:"14px", marginBottom:"22px" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"16px" }}>
              <div style={{
                width:"70px", height:"70px", borderRadius:"4px 20px 4px 20px", flexShrink:0,
                background:`${familleColor}1C`, border:`2px solid ${familleColor}60`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:"2.1rem", boxShadow:`0 0 28px ${familleColor}38`,
              }}>
                {emojis[profil.famille]}
              </div>
              <div>
                <h1 style={{
                  fontFamily:F_DISPLAY, fontWeight:700, fontSize:"2rem", lineHeight:1,
                  margin:"0 0 6px", letterSpacing:"-0.02em", color:"#F1F5F9",
                }}>
                  {profil.prenom}
                </h1>
                <p style={{ fontFamily:F_MONO, fontWeight:500, fontSize:"0.78rem", letterSpacing:"0.04em", color:familleColor, margin:"0 0 4px", textTransform:"uppercase" }}>
                  Famille {profil.famille}
                </p>
                <p style={{ fontFamily:F_BODY, fontSize:"0.78rem", color:"#475569", margin:0, fontWeight:500 }}>
                  {profil.classe === "premiere" ? "Première STMG" : "Terminale STMG"}
                  {profil.lycee ? ` · ${profil.lycee}` : ""}
                </p>
              </div>
            </div>

            {/* Niveau badge */}
            <div style={{
              flexShrink:0, textAlign:"center",
              background:"rgba(245,158,11,.1)", border:"1px solid rgba(245,158,11,.38)",
              borderRadius:"4px 18px 4px 18px", padding:"10px 18px 8px",
              boxShadow:"0 0 24px rgba(245,158,11,.15)",
            }}>
              <p style={{ fontFamily:F_MONO, fontWeight:500, fontSize:"0.6rem", color:"#94A3B8", margin:"0 0 3px", textTransform:"uppercase", letterSpacing:"0.12em" }}>Niveau</p>
              <p style={{
                fontFamily:F_MONO, fontWeight:600, fontSize:"2.6rem", lineHeight:1, margin:"0 0 2px",
                background:"linear-gradient(135deg,#F59E0B,#F97316)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                animation:"db-pop .55s .15s ease both",
              }}>
                {niveau}
              </p>
            </div>
          </div>

          {/* XP bar */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
              <span style={{ fontFamily:F_MONO, fontWeight:500, fontSize:"0.7rem", color:"#475569" }}>Niv. {niveau}</span>
              <span style={{
                fontFamily:F_MONO, fontWeight:600, fontSize:"0.74rem", color:familleColor,
                background:`${familleColor}14`, padding:"2px 11px", borderRadius:"6px", border:`1px solid ${familleColor}30`,
              }}>
                +{pointsVersPalier.toLocaleString()} pts → Niv. {niveau + 1}
              </span>
              <span style={{ fontFamily:F_MONO, fontWeight:500, fontSize:"0.7rem", color:"#475569" }}>Niv. {niveau + 1}</span>
            </div>
            <div style={{ width:"100%", background:"rgba(30,53,96,.55)", borderRadius:"999px", height:"14px", overflow:"hidden" }}>
              <div style={{
                height:"14px", borderRadius:"999px",
                width:`${progression}%`,
                background:`linear-gradient(90deg, ${familleColor}, ${familleColor}AA)`,
                boxShadow:`0 0 20px ${familleColor}70`,
                transition:"width 1.3s cubic-bezier(.4,0,.2,1)",
              }} />
            </div>
          </div>

          {/* Stats strip */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px", marginTop:"18px" }}>
            {[
              { icon:"crown",   label:"Prestige",   value:prestigeClassement.toLocaleString(), color:"#F59E0B" },
              { icon:"coin",    label:"Jetons",      value:formatJetons(xpWallet),             color:"#0EA5E9" },
              { icon:"trophy",  label:"Classement",  value:"—",                                color:"#10B981" },
            ].map((s) => (
              <div key={s.label} style={{
                background:"rgba(4,13,28,.6)", border:`1px solid ${s.color}22`,
                borderRadius:"4px 14px 4px 14px", padding:"14px 10px", textAlign:"center",
              }}>
                <p style={{ margin:"0 0 6px", color:s.color, display:"flex", justifyContent:"center" }}><Icon name={s.icon} size={20} strokeWidth={1.6} /></p>
                <p style={{ fontFamily:F_MONO, fontWeight:600, fontSize:"1.02rem", color:s.color, margin:"0 0 3px" }}>{s.value}</p>
                <p style={{ fontFamily:F_DISPLAY, fontSize:"0.62rem", color:"#475569", fontWeight:600, margin:0, textTransform:"uppercase", letterSpacing:"0.08em" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Prestige gift */}
          {(() => {
            const g = profil?.lastPrestigeGift as { fromPrenom?: string; amount?: number } | undefined;
            if (!g?.fromPrenom || !g?.amount) return null;
            return (
              <div style={{ marginTop:"14px", padding:"10px 14px", borderRadius:"4px 14px 4px 14px", border:`1px solid ${familleColor}30`, background:`${familleColor}0C`, display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
                <span style={{ color:familleColor }}><Icon name="crown" size={16} strokeWidth={1.8} /></span>
                <p style={{ fontFamily:F_DISPLAY, fontWeight:700, color:familleColor, fontSize:"0.85rem", margin:0 }}>
                  <strong>{g.fromPrenom}</strong> t'a offert {g.amount} point{g.amount > 1 ? "s" : ""} de prestige !
                </p>
              </div>
            );
          })()}
        </div>

        {/* ══ MOTIVATION ══ */}
        <div style={{
          background:`linear-gradient(135deg, ${familleColor}0A, rgba(13,27,53,.78))`,
          border:`1px solid ${familleColor}25`,
          borderRadius:"4px 22px 4px 22px", padding:"22px 24px", marginBottom:"16px",
          backdropFilter:"blur(12px)",
          animation:"db-up .5s .08s ease both",
          position:"relative", overflow:"hidden",
        }}>
          <span style={{
            position:"absolute", top:"-10px", left:"12px",
            fontFamily:"Georgia,serif", fontSize:"6rem", color:`${familleColor}18`, lineHeight:1, pointerEvents:"none", userSelect:"none",
          }}>❝</span>
          <Eyebrow color={familleColor}>Message de ta famille</Eyebrow>
          <p style={{ fontFamily:F_BODY, fontWeight:500, fontSize:"1rem", color:"#CBD5E1", lineHeight:1.7, margin:0, fontStyle:"italic", position:"relative", zIndex:1 }}>
            "{motivations[profil.famille]}"
          </p>
        </div>

        {/* ══ MES MATIÈRES ══ */}
        <div style={{ animation:"db-up .5s .14s ease both", marginBottom:"16px" }}>
          <SectionTitle icon="book">Mes Matières</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(145px,1fr))", gap:"10px" }}>
            {matieres.map((m) => (
              <div key={m.nom} className="db-mat" style={{
                background:`linear-gradient(140deg, ${m.couleur}0E, rgba(13,27,53,.82))`,
                border:`1px solid ${m.couleur}28`,
                borderRadius:"4px 16px 4px 16px", padding:"18px 14px 16px", textAlign:"center",
              }}>
                <span style={{ display:"inline-block", fontFamily:F_MONO, fontWeight:700, fontSize:"0.62rem", letterSpacing:"0.03em", color:"white", background:m.couleur, borderRadius:"3px", padding:"3px 7px", marginBottom:"10px" }}>{m.code}</span>
                <p style={{ fontFamily:F_DISPLAY, fontWeight:600, fontSize:"0.82rem", color:"#E2E8F0", margin:"0 0 5px", lineHeight:1.3 }}>{m.nom}</p>
                <p style={{ fontFamily:F_MONO, fontSize:"0.66rem", color:`${m.couleur}88`, margin:0, fontWeight:500 }}>Explorer →</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ BADGES RÉCENTS ══ */}
        <div style={{ animation:"db-up .5s .2s ease both", marginBottom:"16px" }}>
          <SectionTitle icon="award">Badges Récents</SectionTitle>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"10px" }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{
                background:"rgba(13,27,53,.72)", border:"1px solid rgba(30,53,96,.75)",
                borderRadius:"4px 16px 4px 16px", padding:"22px 10px", textAlign:"center",
              }}>
                <div style={{ marginBottom:"10px", color:"#334155", display:"flex", justifyContent:"center" }}><Icon name="medal" size={26} strokeWidth={1.5} /></div>
                <p style={{ fontFamily:F_MONO, fontSize:"0.68rem", color:"#334155", fontWeight:500, margin:0, textTransform:"uppercase", letterSpacing:"0.04em" }}>À débloquer</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ CALENDRIER ÉVALUATIONS ══ */}
        <div style={{
          background:"rgba(13,27,53,.78)", border:"1px solid rgba(30,53,96,.8)",
          borderRadius:"4px 24px 4px 24px", padding:"22px 22px 20px",
          backdropFilter:"blur(12px)",
          animation:"db-up .5s .26s ease both",
          marginBottom:"18px",
        }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"18px" }}>
            <SectionTitle icon="calendar">Mes Évaluations</SectionTitle>
            <button onClick={() => setAjoutVisible(!ajoutVisible)}
              style={{ background:"linear-gradient(135deg,#2563EB,#0EA5E9)", border:"none", color:"white", fontFamily:F_DISPLAY, fontWeight:600, fontSize:"0.8rem", padding:"8px 16px 8px 12px", borderRadius:"4px 10px 4px 10px", cursor:"pointer", boxShadow:"0 4px 14px rgba(37,99,235,.4)", display:"flex", alignItems:"center", gap:"6px" }}>
              <Icon name="plus" size={14} strokeWidth={2} /> Ajouter
            </button>
          </div>

          {ajoutVisible && (
            <div style={{ background:"rgba(4,13,28,.65)", border:"1px solid rgba(30,53,96,.85)", borderRadius:"4px 16px 4px 16px", padding:"16px", marginBottom:"14px", display:"flex", flexDirection:"column", gap:"10px" }}>
              <input type="text" placeholder="Nom de l'évaluation..." value={nouvelEvenement}
                onChange={(e) => setNouvelEvenement(e.target.value)}
                style={{ width:"100%", background:"rgba(4,13,28,.85)", border:"1px solid rgba(30,53,96,.9)", color:"#F1F5F9", padding:"11px 14px", borderRadius:"8px", fontFamily:F_BODY, fontSize:"0.88rem", outline:"none", boxSizing:"border-box" }}
              />
              <input type="date" value={dateEvenement} onChange={(e) => setDateEvenement(e.target.value)}
                style={{ width:"100%", background:"rgba(4,13,28,.85)", border:"1px solid rgba(30,53,96,.9)", color:"#F1F5F9", padding:"11px 14px", borderRadius:"8px", fontFamily:F_BODY, fontSize:"0.88rem", outline:"none", boxSizing:"border-box", colorScheme:"dark" }}
              />
              <button onClick={ajouterEvenement}
                style={{ background:"linear-gradient(135deg,#2563EB,#0EA5E9)", border:"none", color:"white", fontFamily:F_DISPLAY, fontWeight:600, fontSize:"0.9rem", padding:"12px", borderRadius:"4px 10px 4px 10px", cursor:"pointer", boxShadow:"0 4px 16px rgba(37,99,235,.4)" }}>
                Enregistrer
              </button>
            </div>
          )}

          {profil.evenements && profil.evenements.length > 0 ? (
            <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
              {[...profil.evenements]
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((ev, index) => {
                  const isUpcoming = new Date(ev.date) >= new Date();
                  return (
                    <div key={index} className="db-evrow" style={{
                      display:"flex", justifyContent:"space-between", alignItems:"center",
                      background: isUpcoming ? "rgba(14,165,233,.07)" : "rgba(30,53,96,.2)",
                      border: isUpcoming ? "1px solid rgba(14,165,233,.22)" : "1px solid rgba(30,53,96,.5)",
                      borderLeft:`3px solid ${isUpcoming ? "#0EA5E9" : "#334155"}`,
                      borderRadius:"4px 10px 10px 4px", padding:"12px 16px",
                    }}>
                      <span style={{ color:isUpcoming ? "#CBD5E1" : "#475569", fontFamily:F_BODY, fontWeight:600, fontSize:"0.88rem" }}>{ev.titre}</span>
                      <span style={{
                        color:isUpcoming ? "#0EA5E9" : "#475569",
                        fontFamily:F_MONO, fontWeight:600, fontSize:"0.78rem",
                        background:isUpcoming ? "rgba(14,165,233,.12)" : "transparent",
                        padding:"2px 10px", borderRadius:"6px",
                      }}>
                        {new Date(ev.date).toLocaleDateString("fr-FR")}
                      </span>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div style={{ textAlign:"center", padding:"24px 0 8px" }}>
              <div style={{ color:"#334155", marginBottom:"8px", display:"flex", justifyContent:"center" }}><Icon name="calendar" size={30} strokeWidth={1.4} /></div>
              <p style={{ color:"#334155", fontFamily:F_DISPLAY, fontSize:"0.85rem", fontWeight:600, margin:"0 0 4px" }}>Aucune évaluation planifiée</p>
              <p style={{ color:"#1E293B", fontFamily:F_BODY, fontSize:"0.78rem", margin:0 }}>Clique sur "+ Ajouter" pour en créer une</p>
            </div>
          )}
        </div>

        {/* DÉCONNEXION */}
        <button onClick={() => auth.signOut()}
          style={{ width:"100%", background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.22)", color:"#FCA5A5", fontFamily:F_DISPLAY, fontWeight:600, fontSize:"0.9rem", padding:"14px", borderRadius:"4px 16px 4px 16px", cursor:"pointer", transition:"background .2s", marginBottom:"20px", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
          <Icon name="logout" size={16} strokeWidth={1.7} /> Se déconnecter
        </button>

      </div>
    </div>
  );
}
