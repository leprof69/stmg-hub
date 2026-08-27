import { useState, useEffect } from "react";
import { auth, db } from "../services/firebase";
import { collection, query, where, getDocs, orderBy, doc, getDoc, updateDoc } from "firebase/firestore";
import { formatJetonsDelta } from "../lib/jetons";
import { PLATFORM_XP_BLOCKED_MESSAGE, usePlatformIntegrity } from "../contexts/PlatformIntegrityContext";

const CSS = `
@keyframes ch-up  { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
@keyframes ch-orb { 0%,100%{opacity:.4} 50%{opacity:.75} }
.ch-chapitre { transition:all .2s ease; }
.ch-chapitre:hover { transform:translateX(3px); }
.ch-btn { transition:all .18s ease; }
.ch-btn:hover { opacity:.88; transform:translateY(-1px); }
`;

const matieres = [
  { nom: "Management",          emoji: "🏢", couleur: "#2563EB" },
  { nom: "Sciences de Gestion", emoji: "💻", couleur: "#06B6D4" },
  { nom: "Économie",            emoji: "📈", couleur: "#10B981" },
  { nom: "Droit",               emoji: "⚖️", couleur: "#0EA5E9" },
  { nom: "Marketing",           emoji: "🎯", couleur: "#F97316" },
  { nom: "Ressources Humaines", emoji: "👥", couleur: "#F59E0B" },
  { nom: "Gestion Finance",     emoji: "💰", couleur: "#10B981" },
];

export default function Chapitres({ profil, onXPGagne }) {
  const { xpRewardsSuspended } = usePlatformIntegrity();
  const XP_PAR_ACTION = { application: 12, fiche: 8 };
  const [matiereSelectionnee, setMatiereSelectionnee] = useState("Management");
  const [classeSelectionnee,  setClasseSelectionnee]  = useState(profil.classe);
  const [chapitres,    setChapitres]    = useState([]);
  const [chargement,   setChargement]   = useState(false);
  const [chapitreOuvert, setChapitreOuvert] = useState(null);
  const [notifXP,      setNotifXP]      = useState(null);
  const peutChoisirClasse = profil.role === "admin" || profil.classe === "terminale";

  const matiereActive = matieres.find(m => m.nom === matiereSelectionnee) ?? matieres[0];

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

  useEffect(() => {
    const chargerChapitres = async () => {
      setChargement(true); setChapitreOuvert(null);
      try {
        const q = query(
          collection(db, "chapitres"),
          where("matiere", "==", matiereSelectionnee),
          where("classe", "==", classeSelectionnee),
          orderBy("ordre")
        );
        const snapshot = await getDocs(q);
        setChapitres(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (err) { console.error(err); }
      setChargement(false);
    };
    chargerChapitres();
  }, [matiereSelectionnee, classeSelectionnee]);

  const ouvrirAppEtGagnerXP = async (url: string | undefined, actionType: string) => {
    if (!url) return;
    window.open(url, "_blank");
    try {
      const user = auth.currentUser;
      if (!user) return;
      if (xpRewardsSuspended) {
        setNotifXP(PLATFORM_XP_BLOCKED_MESSAGE);
        setTimeout(() => setNotifXP(null), 4200);
        return;
      }
      const xpGain = XP_PAR_ACTION[actionType] || 5;
      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);
      if (!snap.exists()) return;
      await updateDoc(userRef, { xp: ((snap.data().xp || 0) + xpGain) });
      setNotifXP(`${formatJetonsDelta(xpGain)} gagnés !`);
      if (onXPGagne) onXPGagne();
      setTimeout(() => setNotifXP(null), 2200);
    } catch (err) {
      console.error(err);
      setNotifXP("❌ Ressource ouverte, mais jetons non attribués.");
      setTimeout(() => setNotifXP(null), 2200);
    }
  };

  return (
    <div style={{ minHeight:"100vh", padding:"28px 16px 52px", color:"#F1F5F9", fontFamily:"'Nunito',sans-serif", position:"relative" }}>

      {/* Ambient orb */}
      <div style={{ position:"fixed", top:"8%", left:"50%", transform:"translateX(-50%)", width:"600px", height:"300px", background:`radial-gradient(ellipse, ${matiereActive.couleur}12 0%, transparent 70%)`, pointerEvents:"none", zIndex:0, animation:"ch-orb 5s ease-in-out infinite", transition:"background .5s" }} />

      {/* Toast XP */}
      {notifXP && (
        <div style={{ position:"fixed", top:"80px", right:"20px", zIndex:100, background:"linear-gradient(135deg,#F59E0B,#F97316)", color:"white", fontFamily:"'Nunito',sans-serif", fontWeight:900, padding:"12px 20px", borderRadius:"14px", boxShadow:"0 8px 24px rgba(245,158,11,.4)", fontSize:"0.95rem" }}>
          {notifXP}
        </div>
      )}

      <div style={{ maxWidth:"900px", margin:"0 auto", position:"relative", zIndex:1 }}>

        {/* ══ HERO HEADER ══ */}
        <div style={{ marginBottom:"22px", animation:"ch-up .5s ease both" }}>
          <div style={{ display:"flex", alignItems:"center", gap:"14px", marginBottom:"6px" }}>
            <div style={{
              width:"52px", height:"52px", borderRadius:"16px",
              background:`${matiereActive.couleur}1C`, border:`2px solid ${matiereActive.couleur}50`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:"1.6rem", boxShadow:`0 0 22px ${matiereActive.couleur}30`,
              transition:"all .3s ease",
            }}>
              {matiereActive.emoji}
            </div>
            <div>
              <h1 style={{
                fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"2rem", lineHeight:1, margin:"0 0 4px",
                background:`linear-gradient(135deg, #F1F5F9 30%, ${matiereActive.couleur})`,
                WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
                transition:"background .3s",
              }}>
                {matiereSelectionnee}
              </h1>
              <p style={{ color:"#475569", fontSize:"0.8rem", fontWeight:700, margin:0 }}>
                {chapitres.length > 0 ? `${chapitres.length} chapitre${chapitres.length > 1 ? "s" : ""} disponibles` : "Sélectionne une matière"}
                {" · "}
                {classeSelectionnee === "premiere" ? "Première STMG" : "Terminale STMG"}
              </p>
            </div>
          </div>
        </div>

        {/* ══ SÉLECTEUR CLASSE ══ */}
        {peutChoisirClasse && (
          <div style={{ display:"flex", gap:"8px", marginBottom:"14px", animation:"ch-up .5s .04s ease both" }}>
            {[
              { id:"premiere",  label:"📗 Première",  couleur:"#10B981" },
              { id:"terminale", label:"📘 Terminale",  couleur:"#2563EB" },
            ].map(c => (
              <button key={c.id} onClick={() => setClasseSelectionnee(c.id)}
                style={{
                  background: classeSelectionnee === c.id ? `${c.couleur}20` : "rgba(13,27,53,.5)",
                  border: `1.5px solid ${classeSelectionnee === c.id ? c.couleur+"65" : "rgba(30,53,96,.7)"}`,
                  color: classeSelectionnee === c.id ? c.couleur : "#64748B",
                  fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.85rem",
                  padding:"8px 16px", borderRadius:"12px", cursor:"pointer", transition:"all .18s",
                  boxShadow: classeSelectionnee === c.id ? `0 0 14px ${c.couleur}22` : "none",
                }}>
                {c.label}
              </button>
            ))}
          </div>
        )}

        {/* ══ ONGLETS MATIÈRES ══ */}
        <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"24px", animation:"ch-up .5s .08s ease both" }}>
          {matieres.map((m) => (
            <button key={m.nom} onClick={() => setMatiereSelectionnee(m.nom)}
              style={{
                background: matiereSelectionnee === m.nom ? `${m.couleur}1E` : "rgba(13,27,53,.5)",
                border: `1.5px solid ${matiereSelectionnee === m.nom ? m.couleur+"65" : "rgba(30,53,96,.7)"}`,
                color: matiereSelectionnee === m.nom ? m.couleur : "#64748B",
                fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.85rem",
                padding:"9px 16px", borderRadius:"14px", cursor:"pointer", transition:"all .18s",
                boxShadow: matiereSelectionnee === m.nom ? `0 0 16px ${m.couleur}28` : "none",
              }}>
              {m.emoji} {m.nom}
            </button>
          ))}
        </div>

        {/* ══ LISTE CHAPITRES ══ */}
        {chargement ? (
          <div style={{ textAlign:"center", padding:"60px 0" }}>
            <p style={{ fontSize:"2rem", margin:"0 0 10px" }}>⏳</p>
            <p style={{ color:"#475569", fontWeight:700 }}>Chargement des chapitres...</p>
          </div>
        ) : chapitres.length === 0 ? (
          <div style={{
            background:"rgba(13,27,53,.72)", border:`1px solid ${matiereActive.couleur}20`,
            borderRadius:"24px", padding:"48px 20px", textAlign:"center",
          }}>
            <p style={{ fontSize:"3rem", marginBottom:"12px" }}>🔒</p>
            <p style={{ color:"#64748B", fontWeight:800, fontSize:"1rem", margin:"0 0 6px" }}>Aucun chapitre disponible pour l'instant</p>
            <p style={{ color:"#334155", fontSize:"0.85rem", margin:0 }}>Le contenu arrive bientôt !</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"10px", animation:"ch-up .5s .12s ease both" }}>
            {chapitres.map((chapitre) => {
              const estOuvert = chapitreOuvert === chapitre.id;
              return (
                <div key={chapitre.id} className="ch-chapitre" style={{
                  background: estOuvert ? "rgba(13,27,53,.95)" : "rgba(13,27,53,.65)",
                  border: `1px solid ${estOuvert ? matiereActive.couleur+"50" : "rgba(30,53,96,.75)"}`,
                  borderLeft: `3px solid ${estOuvert ? matiereActive.couleur : matiereActive.couleur+"40"}`,
                  borderRadius:"18px", overflow:"hidden",
                  boxShadow: estOuvert ? `0 0 30px ${matiereActive.couleur}18, 0 12px 32px rgba(0,0,0,.3)` : "none",
                  transition:"all .22s ease",
                }}>

                  {/* EN-TÊTE CHAPITRE */}
                  <div onClick={() => setChapitreOuvert(estOuvert ? null : chapitre.id)}
                    style={{ padding:"18px 20px", cursor:"pointer", display:"flex", alignItems:"center", gap:"14px", position:"relative", overflow:"hidden" }}>
                    {/* Big chapter number decoration */}
                    <span style={{
                      position:"absolute", right:"60px", top:"50%", transform:"translateY(-50%)",
                      fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"4rem",
                      color:estOuvert ? `${matiereActive.couleur}12` : "rgba(30,53,96,.25)",
                      lineHeight:1, pointerEvents:"none", userSelect:"none",
                      transition:"color .3s",
                    }}>
                      {String(chapitre.ordre).padStart(2,"0")}
                    </span>

                    {/* Numéro pill */}
                    <div style={{
                      background: estOuvert ? matiereActive.couleur : `${matiereActive.couleur}25`,
                      color: estOuvert ? "white" : matiereActive.couleur,
                      fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"0.72rem",
                      padding:"5px 12px", borderRadius:"999px", flexShrink:0,
                      transition:"all .2s",
                    }}>
                      Ch. {chapitre.ordre}
                    </div>

                    {/* Title + meta */}
                    <div style={{ flex:1, minWidth:0, position:"relative", zIndex:1 }}>
                      <h3 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.02rem", color:"#F1F5F9", margin:"0 0 4px", lineHeight:1.3 }}>
                        {chapitre.titre}
                      </h3>
                      {chapitre.theme && (
                        <p style={{ color:matiereActive.couleur, fontSize:"0.75rem", fontWeight:800, margin:0, opacity:.85 }}>{chapitre.theme}</p>
                      )}
                    </div>

                    <div style={{ display:"flex", alignItems:"center", gap:"8px", flexShrink:0, position:"relative", zIndex:1 }}>
                      <span style={{ color:"#F59E0B", fontSize:"0.78rem", fontWeight:900, background:"rgba(245,158,11,.1)", padding:"3px 10px", borderRadius:"999px", border:"1px solid rgba(245,158,11,.2)" }}>
                        {formatJetonsDelta(chapitre.xp)}
                      </span>
                      <span style={{ color:estOuvert ? matiereActive.couleur : "#475569", fontSize:"0.85rem", transition:"transform .2s, color .2s", display:"inline-block", transform: estOuvert ? "rotate(180deg)" : "none" }}>▾</span>
                    </div>
                  </div>

                  {/* DÉTAIL CHAPITRE */}
                  {estOuvert && (
                    <div style={{ padding:"0 20px 20px", borderTop:`1px solid rgba(30,53,96,.6)` }}>

                      {/* Question de gestion */}
                      {chapitre.question && (
                        <div style={{ background:"rgba(245,158,11,.08)", border:"1px solid rgba(245,158,11,.22)", borderRadius:"14px", padding:"14px 16px", margin:"16px 0 14px" }}>
                          <p style={{ color:"#F59E0B", fontSize:"0.7rem", fontWeight:900, margin:"0 0 6px", textTransform:"uppercase", letterSpacing:"0.1em" }}>❓ Question de gestion</p>
                          <p style={{ color:"#CBD5E1", fontSize:"0.9rem", fontStyle:"italic", margin:0, lineHeight:1.6 }}>{chapitre.question}</p>
                        </div>
                      )}

                      {/* Notions */}
                      {chapitre.notions && chapitre.notions.length > 0 && (
                        <div style={{ marginBottom:"14px" }}>
                          <p style={{ color:matiereActive.couleur, fontSize:"0.7rem", fontWeight:900, margin:"14px 0 8px", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                            📖 Notions à maîtriser ({chapitre.notions.length})
                          </p>
                          <div style={{ display:"flex", flexWrap:"wrap", gap:"6px" }}>
                            {chapitre.notions.map((notion, i) => (
                              <span key={i} style={{
                                background:`${matiereActive.couleur}12`, color:matiereActive.couleur,
                                border:`1px solid ${matiereActive.couleur}30`,
                                fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.75rem",
                                padding:"4px 12px", borderRadius:"999px",
                              }}>
                                {notion}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Compétences */}
                      {chapitre.competences && chapitre.competences.length > 0 && (
                        <div style={{ marginBottom:"14px" }}>
                          <p style={{ color:"#10B981", fontSize:"0.7rem", fontWeight:900, margin:"14px 0 8px", textTransform:"uppercase", letterSpacing:"0.1em" }}>
                            ✅ Compétences visées ({chapitre.competences.length})
                          </p>
                          <div style={{ display:"flex", flexDirection:"column", gap:"5px" }}>
                            {chapitre.competences.map((comp, i) => (
                              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"8px" }}>
                                <span style={{ color:"#10B981", flexShrink:0, marginTop:"2px", fontSize:"0.9rem" }}>→</span>
                                <span style={{ color:"#CBD5E1", fontSize:"0.86rem", fontWeight:700, lineHeight:1.5 }}>{comp}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display:"flex", gap:"10px", marginTop:"18px" }}>
                        <button className="ch-btn" onClick={() => ouvrirAppEtGagnerXP(chapitre.url_app, "application")}
                          style={{
                            flex:1, fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"0.88rem",
                            padding:"13px 10px", borderRadius:"14px", cursor: chapitre.url_app ? "pointer" : "not-allowed",
                            border:"none",
                            background: chapitre.url_app ? `linear-gradient(135deg,${matiereActive.couleur},${matiereActive.couleur}CC)` : "rgba(30,53,96,.4)",
                            color: chapitre.url_app ? "white" : "#334155",
                            boxShadow: chapitre.url_app ? `0 6px 20px ${matiereActive.couleur}40` : "none",
                          }}>
                          🎮 {chapitre.url_app ? `Application · ${formatJetonsDelta(XP_PAR_ACTION.application)}` : "Bientôt disponible"}
                        </button>
                        <button className="ch-btn" onClick={() => ouvrirAppEtGagnerXP(chapitre.url_fiche, "fiche")}
                          style={{
                            flex:1, fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"0.88rem",
                            padding:"13px 10px", borderRadius:"14px", cursor: chapitre.url_fiche ? "pointer" : "not-allowed",
                            border:"none",
                            background: chapitre.url_fiche ? "linear-gradient(135deg,#06B6D4,#0EA5E9)" : "rgba(30,53,96,.4)",
                            color: chapitre.url_fiche ? "white" : "#334155",
                            boxShadow: chapitre.url_fiche ? "0 6px 20px rgba(6,182,212,.35)" : "none",
                          }}>
                          📄 {chapitre.url_fiche ? `Fiche · ${formatJetonsDelta(XP_PAR_ACTION.fiche)}` : "Bientôt disponible"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
