import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { formatJetons } from "../lib/jetons";
import { getXpTotalePourNiveau } from "../services/userProfileService";

const CSS = `
@keyframes mb-up   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
@keyframes mb-glow { 0%,100%{box-shadow:var(--glow-a)} 50%{box-shadow:var(--glow-b)} }
@keyframes mb-orb  { 0%,100%{opacity:.4} 50%{opacity:.75} }
@keyframes mb-bar  { from{width:0} }
.mb-badge { transition:all .2s ease; cursor:pointer; }
.mb-badge:hover { transform:translateY(-5px) scale(1.06); }
.mb-badge-locked { transition:all .2s ease; cursor:pointer; }
.mb-badge-locked:hover { transform:translateY(-3px); opacity:.75; }
`;

const rareteColors = {
  "Commun":     "#94A3B8",
  "Peu commun": "#10B981",
  "Rare":       "#0EA5E9",
  "Épique":     "#60A5FA",
  "Légendaire": "#F59E0B",
};

const rareteOrder = ["Commun", "Peu commun", "Rare", "Épique", "Légendaire"];

const verifierCondition = (badge, profil) => {
  const jetonsCumules = getXpTotalePourNiveau(profil);
  const chapitres  = (profil.chapitresCompletes || []).length;
  const missions   = (profil.missionsCompletes  || []).length;
  const connexions = profil.connexions_consecutives || 0;
  switch (badge.condition_type) {
    case "xp":         return jetonsCumules >= badge.condition_valeur;
    case "chapitres":  return chapitres     >= badge.condition_valeur;
    case "missions":   return missions      >= badge.condition_valeur;
    case "connexions": return connexions    >= badge.condition_valeur;
    default: return false;
  }
};

const getConditionTexte = (badge) => {
  switch (badge.condition_type) {
    case "xp":         return `Atteindre ${badge.condition_valeur} jetons cumulés`;
    case "chapitres":  return `Compléter ${badge.condition_valeur} chapitre${badge.condition_valeur > 1 ? "s" : ""}`;
    case "missions":   return `Compléter ${badge.condition_valeur} mission${badge.condition_valeur > 1 ? "s" : ""}`;
    case "connexions": return `Se connecter ${badge.condition_valeur} jours de suite`;
    case "classement": return `Être dans le top ${badge.condition_valeur} national`;
    default: return badge.description;
  }
};

export default function MesBadges({ profil }) {
  const [badges,           setBadges]           = useState([]);
  const [badgeSelectionne, setBadgeSelectionne] = useState(null);
  const [chargement,       setChargement]       = useState(true);

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

  useEffect(() => {
    const chargerBadges = async () => {
      const snapshot = await getDocs(collection(db, "badges"));
      setBadges(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      setChargement(false);
    };
    chargerBadges();
  }, []);

  const universes       = [...new Set(badges.map(b => b.univers))];
  const totalDebloques  = badges.filter(b => verifierCondition(b, profil)).length;
  const progression     = badges.length > 0 ? (totalDebloques / badges.length) * 100 : 0;

  if (chargement) {
    return (
      <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <p style={{ color:"#64748B", fontFamily:"'Nunito',sans-serif", fontWeight:800 }}>Chargement des badges...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight:"100vh", padding:"28px 16px 52px", color:"#F1F5F9", fontFamily:"'Nunito',sans-serif", position:"relative" }}>

      {/* Ambient orb */}
      <div style={{ position:"fixed", top:"8%", left:"50%", transform:"translateX(-50%)", width:"600px", height:"320px", background:"radial-gradient(ellipse, rgba(245,158,11,.1) 0%, transparent 70%)", pointerEvents:"none", zIndex:0, animation:"mb-orb 5s ease-in-out infinite" }} />

      <div style={{ maxWidth:"920px", margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* ══ HERO ══ */}
        <div style={{
          background:"linear-gradient(145deg, rgba(13,27,53,.97), rgba(7,16,35,.98))",
          border:"1px solid rgba(245,158,11,.25)",
          borderRadius:"28px", padding:"28px 26px 24px", marginBottom:"22px",
          boxShadow:"0 0 50px rgba(245,158,11,.1), 0 20px 48px rgba(0,0,0,.45)",
          animation:"mb-up .5s ease both",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:"-50px", right:"-50px", width:"200px", height:"200px", background:"radial-gradient(circle,rgba(245,158,11,.12),transparent 70%)", pointerEvents:"none" }} />

          <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:"20px", flexWrap:"wrap", gap:"10px" }}>
            <div>
              <h1 style={{
                fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"2.2rem", margin:"0 0 5px",
                background:"linear-gradient(135deg,#F59E0B 0%,#F1F5F9 60%)",
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
              }}>
                🏅 Mes Badges
              </h1>
              <p style={{ color:"#475569", fontSize:"0.85rem", fontWeight:700, margin:0 }}>
                Ta collection de récompenses — chaque badge raconte une victoire
              </p>
            </div>
            <div style={{ textAlign:"right", flexShrink:0 }}>
              <p style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.8rem", lineHeight:1, margin:"0 0 2px", background:"linear-gradient(135deg,#F59E0B,#F97316)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                {totalDebloques}
                <span style={{ fontSize:"1rem", color:"#475569", WebkitTextFillColor:"#475569" }}> / {badges.length}</span>
              </p>
              <p style={{ color:"#475569", fontSize:"0.72rem", fontWeight:800, margin:0, textTransform:"uppercase", letterSpacing:"0.1em" }}>badges débloqués</p>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
              <span style={{ color:"#475569", fontSize:"0.72rem", fontWeight:700 }}>Progression</span>
              <span style={{ color:"#F59E0B", fontSize:"0.72rem", fontWeight:800 }}>{Math.round(progression)}%</span>
            </div>
            <div style={{ background:"rgba(30,53,96,.55)", borderRadius:"999px", height:"14px", overflow:"hidden" }}>
              <div style={{
                height:"14px", borderRadius:"999px",
                width:`${progression}%`,
                background:"linear-gradient(90deg,#F59E0B,#F97316)",
                boxShadow:"0 0 18px rgba(245,158,11,.6)",
                transition:"width 1.2s cubic-bezier(.4,0,.2,1)",
              }} />
            </div>
          </div>
        </div>

        {/* ══ UNIVERS ══ */}
        {universes.map((univers, uIdx) => {
          const badgesUnivers = badges
            .filter(b => b.univers === univers)
            .sort((a, b) => rareteOrder.indexOf(a.rarete) - rareteOrder.indexOf(b.rarete));
          const debloquesUnivers = badgesUnivers.filter(b => verifierCondition(b, profil)).length;
          const univPct = badgesUnivers.length > 0 ? Math.round((debloquesUnivers / badgesUnivers.length) * 100) : 0;

          return (
            <div key={univers} style={{
              background:"rgba(13,27,53,.75)", border:"1px solid rgba(30,53,96,.8)",
              borderRadius:"24px", padding:"22px", marginBottom:"14px",
              backdropFilter:"blur(12px)",
              animation:`mb-up .5s ${0.08 + uIdx * 0.06}s ease both`,
            }}>
              {/* Section header */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"18px" }}>
                <div>
                  <h2 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.15rem", margin:"0 0 3px", color:"#F1F5F9" }}>
                    🐾 Univers <span style={{ background:"linear-gradient(90deg,#F59E0B,#F97316)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>{univers}</span>
                  </h2>
                  <p style={{ color:"#475569", fontSize:"0.72rem", fontWeight:700, margin:0 }}>{debloquesUnivers} / {badgesUnivers.length} débloqués</p>
                </div>
                <div style={{
                  background: univPct === 100 ? "rgba(245,158,11,.15)" : "rgba(30,53,96,.4)",
                  border: `1px solid ${univPct === 100 ? "rgba(245,158,11,.4)" : "rgba(30,53,96,.7)"}`,
                  borderRadius:"12px", padding:"6px 14px",
                  fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"0.85rem",
                  color: univPct === 100 ? "#F59E0B" : "#475569",
                }}>
                  {univPct}%
                </div>
              </div>

              {/* Badge grid */}
              <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))", gap:"10px" }}>
                {badgesUnivers.map((badge) => {
                  const debloque = verifierCondition(badge, profil);
                  const couleur = rareteColors[badge.rarete] ?? "#94A3B8";
                  return (
                    <div key={badge.id}
                      className={debloque ? "mb-badge" : "mb-badge-locked"}
                      onClick={() => setBadgeSelectionne(badge)}
                      style={{
                        textAlign:"center", padding:"14px 8px 12px", borderRadius:"16px",
                        background: debloque ? `${couleur}12` : "rgba(13,27,96,.3)",
                        border: `1px solid ${debloque ? couleur+"42" : "rgba(30,53,96,.55)"}`,
                        boxShadow: debloque ? `0 0 18px ${couleur}25` : "none",
                      }}>
                      <div style={{ position:"relative", width:"56px", height:"56px", margin:"0 auto 9px" }}>
                        <img src={badge.image_url} alt={badge.nom}
                          style={{ width:"56px", height:"56px", objectFit:"contain", filter: debloque ? "none" : "grayscale(100%) brightness(18%)" }}
                        />
                        {!debloque && (
                          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                            <span style={{ fontSize:"1.25rem" }}>🔒</span>
                          </div>
                        )}
                      </div>
                      <p style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.72rem", lineHeight:1.3, color: debloque ? couleur : "#334155", margin:"0 0 3px" }}>{badge.nom}</p>
                      <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:"0.62rem", color: debloque ? "#64748B" : "#1E293B", margin:0 }}>{badge.rarete}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* ══ MODAL BADGE ══ */}
        {badgeSelectionne && (
          <div onClick={() => setBadgeSelectionne(null)}
            style={{ position:"fixed", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:"16px", background:"rgba(2,6,23,.85)", backdropFilter:"blur(10px)" }}>
            <div onClick={e => e.stopPropagation()}
              style={{
                background:"linear-gradient(145deg,rgba(13,27,53,.98),rgba(7,16,35,.98))",
                border:"1px solid rgba(30,53,96,.9)", borderRadius:"28px",
                padding:"30px 26px", maxWidth:"380px", width:"100%", textAlign:"center",
                boxShadow:"0 32px 80px rgba(0,0,0,.65)",
                animation:"mb-up .3s ease both",
              }}>
              {(() => {
                const debloque = verifierCondition(badgeSelectionne, profil);
                const couleur = rareteColors[badgeSelectionne.rarete] ?? "#94A3B8";
                return (
                  <>
                    {/* Badge image */}
                    <div style={{
                      position:"relative", width:"90px", height:"90px", margin:"0 auto 18px",
                      background: debloque ? `${couleur}14` : "rgba(30,53,96,.3)",
                      borderRadius:"22px", border: `2px solid ${debloque ? couleur+"45" : "rgba(30,53,96,.7)"}`,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      boxShadow: debloque ? `0 0 30px ${couleur}35` : "none",
                    }}>
                      <img src={badgeSelectionne.image_url} alt={badgeSelectionne.nom}
                        style={{ width:"64px", height:"64px", objectFit:"contain", filter: debloque ? "none" : "grayscale(100%) brightness(18%)" }}
                      />
                      {!debloque && (
                        <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
                          <span style={{ fontSize:"2.2rem" }}>🔒</span>
                        </div>
                      )}
                    </div>

                    <h3 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.25rem", color:"#F1F5F9", margin:"0 0 5px" }}>{badgeSelectionne.nom}</h3>
                    <p style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.88rem", color:couleur, margin:"0 0 3px" }}>{badgeSelectionne.rarete}</p>
                    <p style={{ color:"#475569", fontSize:"0.78rem", margin:"0 0 18px", fontWeight:700 }}>Univers {badgeSelectionne.univers}</p>

                    {debloque ? (
                      <div style={{ background:"rgba(16,185,129,.12)", border:"1px solid rgba(16,185,129,.3)", borderRadius:"14px", padding:"12px 16px", marginBottom:"18px" }}>
                        <p style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:"#6EE7B7", margin:0, fontSize:"0.95rem" }}>✅ Badge débloqué !</p>
                      </div>
                    ) : (
                      <div style={{ background:"rgba(30,53,96,.4)", border:"1px solid rgba(30,53,96,.75)", borderRadius:"14px", padding:"14px 16px", marginBottom:"18px", textAlign:"left" }}>
                        <p style={{ color:"#64748B", fontSize:"0.72rem", margin:"0 0 6px", fontWeight:800, textTransform:"uppercase", letterSpacing:"0.1em" }}>🎯 Pour débloquer</p>
                        <p style={{ fontFamily:"'Nunito',sans-serif", fontWeight:800, color:"#CBD5E1", fontSize:"0.9rem", margin:"0 0 8px" }}>{getConditionTexte(badgeSelectionne)}</p>
                        {badgeSelectionne.condition_type === "xp" && (
                          <p style={{ color:"#F59E0B", fontSize:"0.82rem", margin:0, fontWeight:700 }}>
                            {formatJetons(getXpTotalePourNiveau(profil))} accumulés — encore {formatJetons(Math.max(0, badgeSelectionne.condition_valeur - getXpTotalePourNiveau(profil)))} !
                          </p>
                        )}
                        {badgeSelectionne.condition_type === "chapitres" && (
                          <p style={{ color:"#0EA5E9", fontSize:"0.82rem", margin:0, fontWeight:700 }}>
                            {(profil.chapitresCompletes||[]).length} complétés — encore {badgeSelectionne.condition_valeur - (profil.chapitresCompletes||[]).length} !
                          </p>
                        )}
                        {badgeSelectionne.condition_type === "missions" && (
                          <p style={{ color:"#06B6D4", fontSize:"0.82rem", margin:0, fontWeight:700 }}>
                            {(profil.missionsCompletes||[]).length} complétées — encore {badgeSelectionne.condition_valeur - (profil.missionsCompletes||[]).length} !
                          </p>
                        )}
                        {badgeSelectionne.condition_type === "connexions" && (
                          <p style={{ color:"#F97316", fontSize:"0.82rem", margin:0, fontWeight:700 }}>
                            {profil.connexions_consecutives||0} jours — encore {badgeSelectionne.condition_valeur - (profil.connexions_consecutives||0)} !
                          </p>
                        )}
                      </div>
                    )}

                    <button onClick={() => setBadgeSelectionne(null)}
                      style={{ background:"linear-gradient(135deg,#2563EB,#0EA5E9)", border:"none", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"0.9rem", padding:"12px 32px", borderRadius:"14px", cursor:"pointer", boxShadow:"0 6px 20px rgba(37,99,235,.4)" }}>
                      Fermer
                    </button>
                  </>
                );
              })()}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
