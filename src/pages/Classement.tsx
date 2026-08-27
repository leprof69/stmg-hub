// @ts-nocheck
import { useState, useEffect } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { COLLECTIONS } from "../services/collectionsData";
import { getPrestigeTotal } from "../services/userProfileService";

const CSS = `
@keyframes cl-up  { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
@keyframes cl-orb { 0%,100%{opacity:.4} 50%{opacity:.75} }
.cl-row { transition:all .18s ease; }
.cl-row:hover { transform:translateX(4px); background:rgba(30,53,96,.55)!important; }
.cl-tab { transition:all .18s ease; cursor:pointer; }
.cl-tab:hover { opacity:.85; }
`;

const familleColors = {
  Architecte: "#2563EB", Visionnaire: "#0EA5E9",
  Challenger:  "#F97316", Explorateur: "#10B981", Influenceur: "#F59E0B",
};
const familleEmojis = {
  Architecte: "🧠", Visionnaire: "🎨",
  Challenger:  "⚡", Explorateur: "🔬", Influenceur: "🔥",
};

const niveauNom = (score) => {
  if (score < 100)  return { nom:"Recrue",       emoji:"🌱" };
  if (score < 300)  return { nom:"Apprenti",      emoji:"⚡" };
  if (score < 600)  return { nom:"Guerrier",      emoji:"⚔️" };
  if (score < 1000) return { nom:"Champion",      emoji:"🏆" };
  if (score < 2000) return { nom:"Légende",       emoji:"👑" };
  return              { nom:"Dieu du STMG",       emoji:"🌟" };
};

const medaille = (rang) => {
  if (rang === 1) return "🥇";
  if (rang === 2) return "🥈";
  if (rang === 3) return "🥉";
  return `#${rang}`;
};

const getNbCartesUniques = (cartes) => {
  if (!cartes) return 0;
  return Object.values(cartes).filter(v => v > 0).length;
};
const getNbCartesRares = (cartes) => {
  if (!cartes) return 0;
  const toutesCartes = COLLECTIONS.flatMap(c => c.cartes);
  return toutesCartes.filter(c =>
    (cartes[c.id] || 0) > 0 &&
    ["rare","epique","legendaire","ultra_rare"].includes(c.rarete)
  ).length;
};

const podiumColors = ["#F59E0B", "#94A3B8", "#CD7C3A"];
const podiumGlows  = ["rgba(245,158,11,.35)", "rgba(148,163,184,.25)", "rgba(205,124,58,.28)"];

export default function Classement({ profil, onVisiterProfil }) {
  const [onglet, setOnglet] = useState("xp");
  const [classementEleves,     setClassementEleves]     = useState([]);
  const [classementCollection, setClassementCollection] = useState([]);
  const [classementLycees,     setClassementLycees]     = useState([]);
  const [classementFamilles,   setClassementFamilles]   = useState([]);
  const [chargement,    setChargement]    = useState(true);
  const [erreurClassement, setErreurClassement] = useState("");

  useEffect(() => {
    const s = document.createElement("style");
    s.textContent = CSS;
    document.head.appendChild(s);
    return () => { try { document.head.removeChild(s); } catch {} };
  }, []);

  useEffect(() => { chargerClassements(); }, []);

  const chargerClassements = async () => {
    setChargement(true); setErreurClassement("");
    try {
      const snapshot = await getDocs(query(collection(db, "users"), where("role", "!=", "admin")));
      const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      setClassementEleves(users.filter(u => u.prenom).sort((a,b) => getPrestigeTotal(b) - getPrestigeTotal(a)).slice(0,50));

      setClassementCollection(
        users.filter(u => u.prenom)
          .map(u => ({ ...u, nbCartes: getNbCartesUniques(u.cartes), nbRares: getNbCartesRares(u.cartes) }))
          .sort((a,b) => b.nbCartes - a.nbCartes || b.nbRares - a.nbRares)
          .slice(0,50)
      );

      const lyceesMap = {};
      users.forEach(u => {
        if (!u.lycee) return;
        if (!lyceesMap[u.lycee]) lyceesMap[u.lycee] = { nom: u.lycee, ville: u.lyceeVille || "", xp: 0, eleves: 0 };
        lyceesMap[u.lycee].xp += (u.xp || 0);
        lyceesMap[u.lycee].eleves += 1;
      });
      setClassementLycees(Object.values(lyceesMap).sort((a,b) => b.xp - a.xp).slice(0,20));

      const famillesMap = {
        Architecte: { nom:"Architecte",  prestige:0, eleves:0 },
        Visionnaire:{ nom:"Visionnaire", prestige:0, eleves:0 },
        Challenger: { nom:"Challenger",  prestige:0, eleves:0 },
        Explorateur:{ nom:"Explorateur", prestige:0, eleves:0 },
        Influenceur:{ nom:"Influenceur", prestige:0, eleves:0 },
      };
      users.forEach(u => {
        if (!u.famille || !famillesMap[u.famille]) return;
        famillesMap[u.famille].prestige += getPrestigeTotal(u);
        famillesMap[u.famille].eleves   += 1;
      });
      setClassementFamilles(Object.values(famillesMap).sort((a,b) => b.prestige - a.prestige));
    } catch (err) {
      console.error(err);
      setErreurClassement("Classement indisponible : lecture Firestore refusée pour les élèves.");
    }
    setChargement(false);
  };

  const monRangEleve      = classementEleves.findIndex(e => e.id === profil?.id) + 1;
  const monRangCollection = classementCollection.findIndex(e => e.id === profil?.id) + 1;
  const monRangLycee      = classementLycees.findIndex(l => l.nom === profil?.lycee) + 1;
  const monRangFamille    = classementFamilles.findIndex(f => f.nom === profil?.famille) + 1;

  const onglets = [
    { id:"xp",         label:"👑 Prestige",   couleur:"#F59E0B" },
    { id:"collection", label:"🃏 Collection",  couleur:"#EC4899" },
    { id:"lycees",     label:"🏫 Lycées",      couleur:"#F97316" },
    { id:"familles",   label:"🧬 Familles",    couleur:"#0EA5E9" },
  ];

  const activeTab = onglets.find(o => o.id === onglet);

  return (
    <div style={{ minHeight:"100vh", color:"#F1F5F9", fontFamily:"'Nunito',sans-serif" }}>

      {/* Ambient orbs */}
      <div style={{ position:"fixed", top:"5%", left:"50%", transform:"translateX(-50%)", width:"600px", height:"350px", background:"radial-gradient(ellipse, rgba(245,158,11,.1) 0%, transparent 70%)", pointerEvents:"none", zIndex:0, animation:"cl-orb 5s ease-in-out infinite" }} />
      <div style={{ position:"fixed", bottom:"10%", left:"-5%", width:"320px", height:"320px", background:"radial-gradient(circle, rgba(37,99,235,.1) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ maxWidth:"900px", margin:"0 auto", padding:"28px 16px 52px", position:"relative", zIndex:1 }}>

        {/* ══ HERO HEADER ══ */}
        <div style={{
          background:"linear-gradient(145deg, rgba(13,27,53,.97), rgba(7,16,35,.98))",
          border:"1px solid rgba(245,158,11,.25)",
          borderRadius:"28px", padding:"28px 28px 24px", marginBottom:"20px",
          boxShadow:"0 0 50px rgba(245,158,11,.1), 0 20px 48px rgba(0,0,0,.45)",
          animation:"cl-up .5s ease both",
          position:"relative", overflow:"hidden",
        }}>
          <div style={{ position:"absolute", top:"-50px", right:"-50px", width:"240px", height:"240px", background:"radial-gradient(circle,rgba(245,158,11,.12),transparent 70%)", pointerEvents:"none" }} />

          <h1 style={{
            fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"2.2rem", margin:"0 0 6px",
            background:"linear-gradient(135deg,#F59E0B 0%,#F1F5F9 60%)",
            WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent",
          }}>
            🏆 Classement National
          </h1>
          <p style={{ color:"#475569", fontSize:"0.88rem", margin:"0 0 22px", fontWeight:700 }}>
            La compétition entre tous les élèves STMG de France
          </p>

          {/* My ranks */}
          <div style={{ display:"flex", gap:"8px", flexWrap:"wrap" }}>
            {[
              { label:"Prestige",   rang:monRangEleve,       couleur:"#F59E0B" },
              { label:"Collection", rang:monRangCollection,  couleur:"#EC4899" },
              { label:"Lycée",      rang:monRangLycee,       couleur:"#F97316" },
              { label:"Famille",    rang:monRangFamille,     couleur:"#0EA5E9" },
            ].map((r,i) => r.rang > 0 && (
              <div key={i} style={{
                background:`${r.couleur}14`, border:`1px solid ${r.couleur}40`,
                borderRadius:"12px", padding:"7px 16px",
                display:"flex", alignItems:"center", gap:"6px",
              }}>
                <span style={{ color:r.couleur, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.82rem" }}>{r.label}</span>
                <span style={{ color:"#F1F5F9", fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"0.9rem" }}>
                  {r.rang <= 3 ? medaille(r.rang) : `#${r.rang}`}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ══ ONGLETS ══ */}
        <div style={{ display:"flex", gap:"8px", marginBottom:"20px", flexWrap:"wrap", animation:"cl-up .5s .06s ease both" }}>
          {onglets.map(t => (
            <button key={t.id} className="cl-tab" onClick={() => setOnglet(t.id)} style={{
              background: onglet === t.id ? `${t.couleur}20` : "rgba(13,27,53,.55)",
              color: onglet === t.id ? t.couleur : "#64748B",
              border: `1.5px solid ${onglet === t.id ? t.couleur+"65" : "rgba(30,53,96,.7)"}`,
              fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.88rem",
              padding:"10px 20px", borderRadius:"14px",
              boxShadow: onglet === t.id ? `0 0 16px ${t.couleur}25` : "none",
            }}>{t.label}</button>
          ))}
        </div>

        {erreurClassement && (
          <div style={{ background:"rgba(239,68,68,.1)", border:"1px solid rgba(239,68,68,.3)", borderRadius:"14px", padding:"12px 16px", marginBottom:"16px" }}>
            <p style={{ margin:0, color:"#FCA5A5", fontSize:"0.85rem", fontWeight:700 }}>⚠️ {erreurClassement}</p>
          </div>
        )}

        {chargement ? (
          <div style={{ background:"rgba(13,27,53,.7)", border:"1px solid rgba(30,53,96,.8)", borderRadius:"24px", padding:"60px 20px", textAlign:"center" }}>
            <p style={{ fontSize:"2rem", margin:"0 0 10px" }}>⏳</p>
            <p style={{ color:"#475569", fontWeight:700, fontFamily:"'Nunito',sans-serif" }}>Chargement du classement...</p>
          </div>
        ) : (
          <div style={{ animation:"cl-up .45s .12s ease both" }}>

            {/* ══ PRESTIGE ══ */}
            {onglet === "xp" && (
              <div style={{ background:"rgba(13,27,53,.78)", border:"1px solid rgba(245,158,11,.2)", borderRadius:"24px", padding:"22px", backdropFilter:"blur(12px)" }}>
                <div style={{ marginBottom:"20px" }}>
                  <h2 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.3rem", margin:"0 0 4px", background:"linear-gradient(90deg,#F59E0B,#F97316)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                    👑 Top Élèves — Prestige
                  </h2>
                  <p style={{ color:"#475569", fontSize:"0.8rem", margin:0, fontWeight:700 }}>Le prestige augmente quand tu dépenses des jetons dans la boutique.</p>
                </div>

                {/* Top 3 podium */}
                {classementEleves.length >= 3 && (
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px", marginBottom:"18px" }}>
                    {[classementEleves[1], classementEleves[0], classementEleves[2]].map((eleve, idx) => {
                      const realRang = idx === 1 ? 1 : idx === 0 ? 2 : 3;
                      const estMoi = eleve.id === profil?.id;
                      const pc = podiumColors[realRang - 1];
                      const pg = podiumGlows[realRang - 1];
                      const pHeight = realRang === 1 ? "118px" : "90px";
                      const prestigeTotal = getPrestigeTotal(eleve);
                      return (
                        <div key={eleve.id} style={{ textAlign:"center" }}>
                          <div style={{ fontSize: realRang === 1 ? "1.1rem" : "0.9rem", marginBottom:"6px", fontFamily:"'Nunito',sans-serif", fontWeight:900 }}>
                            {medaille(realRang)}
                          </div>
                          <div style={{
                            background:`${pc}12`, border:`1.5px solid ${pc}40`,
                            borderRadius:"16px", padding:"12px 8px 10px",
                            boxShadow:`0 0 20px ${pg}`,
                          }}>
                            <p style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"0.85rem", color:"#F1F5F9", margin:"0 0 2px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                              {eleve.prenom}
                              {estMoi && <span style={{ color:pc, fontSize:"0.65rem" }}> (moi)</span>}
                            </p>
                            <p style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"0.82rem", color:pc, margin:0 }}>{prestigeTotal.toLocaleString()} pts</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Rest of list */}
                <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                  {classementEleves.map((eleve, i) => {
                    const rang = i + 1;
                    if (rang <= 3) return null;
                    const estMoi = eleve.id === profil?.id;
                    const prestigeTotal = getPrestigeTotal(eleve);
                    const niveau = niveauNom(prestigeTotal);
                    const couleurFamille = familleColors[eleve.famille] || "#2563EB";
                    return (
                      <div key={i} className="cl-row" onClick={() => !estMoi && onVisiterProfil && onVisiterProfil(eleve.id)}
                        style={{
                          background: estMoi ? "rgba(245,158,11,.07)" : "rgba(30,53,96,.28)",
                          borderRadius:"14px", padding:"11px 14px",
                          border: estMoi ? "1.5px solid rgba(245,158,11,.4)" : "1px solid rgba(30,53,96,.55)",
                          display:"flex", alignItems:"center", gap:"10px",
                          cursor: !estMoi ? "pointer" : "default",
                        }}>
                        <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"0.9rem", width:"32px", textAlign:"center", color:"#475569", flexShrink:0 }}>
                          #{rang}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"5px", flexWrap:"wrap" }}>
                            <span style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:"#E2E8F0", fontSize:"0.92rem" }}>{eleve.prenom}</span>
                            {estMoi && <span style={{ background:"rgba(245,158,11,.2)", color:"#F59E0B", fontFamily:"'Nunito',sans-serif", fontWeight:800, padding:"1px 8px", borderRadius:"100px", fontSize:"0.65rem" }}>Moi</span>}
                            <span style={{ background:`${couleurFamille}18`, color:couleurFamille, fontFamily:"'Nunito',sans-serif", fontWeight:800, padding:"1px 8px", borderRadius:"100px", fontSize:"0.65rem" }}>
                              {familleEmojis[eleve.famille]} {eleve.famille}
                            </span>
                          </div>
                          <p style={{ color:"#475569", fontSize:"0.72rem", margin:"2px 0 0", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", fontWeight:700 }}>
                            {eleve.lycee || "—"} · {niveau.emoji} {niveau.nom}
                          </p>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:"#F59E0B", fontSize:"0.92rem" }}>{prestigeTotal.toLocaleString()} pts</div>
                          {!estMoi && <span style={{ background:"rgba(14,165,233,.12)", color:"#0EA5E9", borderRadius:"8px", padding:"2px 7px", fontSize:"0.6rem", fontWeight:800 }}>🏠 Visiter</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ══ COLLECTION ══ */}
            {onglet === "collection" && (
              <div style={{ background:"rgba(13,27,53,.78)", border:"1px solid rgba(236,72,153,.2)", borderRadius:"24px", padding:"22px", backdropFilter:"blur(12px)" }}>
                <h2 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.3rem", margin:"0 0 4px", background:"linear-gradient(90deg,#EC4899,#F43F5E)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  🃏 Top Collectionneurs
                </h2>
                <p style={{ color:"#475569", fontSize:"0.8rem", margin:"0 0 18px", fontWeight:700 }}>Classement par nombre de cartes uniques obtenues</p>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                  {classementCollection.map((eleve,i) => {
                    const rang = i+1;
                    const estMoi = eleve.id === profil?.id;
                    const totalDispo = COLLECTIONS.flatMap(c=>c.cartes).length;
                    const prog = Math.round((eleve.nbCartes/totalDispo)*100);
                    return (
                      <div key={i} className="cl-row" style={{
                        background: estMoi ? "rgba(236,72,153,.07)" : "rgba(30,53,96,.28)",
                        borderRadius:"14px", padding:"12px 14px",
                        border: estMoi ? "1.5px solid rgba(236,72,153,.4)" : "1px solid rgba(30,53,96,.55)",
                        display:"flex", alignItems:"center", gap:"10px",
                      }}>
                        <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:rang<=3?"1.4rem":"0.9rem", width:"36px", textAlign:"center", color:"#64748B", flexShrink:0 }}>
                          {medaille(rang)}
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap", marginBottom:"7px" }}>
                            <span style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:"#E2E8F0", fontSize:"0.92rem" }}>{eleve.prenom}</span>
                            {estMoi && <span style={{ background:"rgba(236,72,153,.2)", color:"#EC4899", fontFamily:"'Nunito',sans-serif", fontWeight:800, padding:"1px 8px", borderRadius:"100px", fontSize:"0.65rem" }}>Moi</span>}
                            <span style={{ background:"rgba(236,72,153,.12)", color:"#EC4899", fontFamily:"'Nunito',sans-serif", fontWeight:800, padding:"1px 8px", borderRadius:"100px", fontSize:"0.65rem" }}>
                              🔵 {eleve.nbRares} rares+
                            </span>
                          </div>
                          <div style={{ background:"rgba(30,53,96,.6)", borderRadius:"100px", height:"5px", overflow:"hidden" }}>
                            <div style={{ height:"100%", borderRadius:"100px", background:"linear-gradient(90deg,#EC4899,#F43F5E)", width:`${prog}%`, transition:"width .5s" }} />
                          </div>
                        </div>
                        <div style={{ textAlign:"right", flexShrink:0 }}>
                          <p style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:"#EC4899", fontSize:"0.92rem", margin:0 }}>{eleve.nbCartes} 🃏</p>
                          <p style={{ color:"#475569", fontSize:"0.7rem", margin:0, fontWeight:700 }}>{prog}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ══ LYCÉES ══ */}
            {onglet === "lycees" && (
              <div style={{ background:"rgba(13,27,53,.78)", border:"1px solid rgba(249,115,22,.2)", borderRadius:"24px", padding:"22px", backdropFilter:"blur(12px)" }}>
                <h2 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.3rem", margin:"0 0 18px", background:"linear-gradient(90deg,#F97316,#FB923C)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  🏫 Classement Lycées
                </h2>
                {classementLycees.length === 0 ? (
                  <p style={{ textAlign:"center", color:"#475569", padding:"20px", fontWeight:700 }}>Aucun lycée encore inscrit</p>
                ) : (
                  <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                    {classementLycees.map((lycee,i) => {
                      const rang = i+1;
                      const estMonLycee = lycee.nom === profil?.lycee;
                      return (
                        <div key={i} className="cl-row" style={{
                          background: estMonLycee ? "rgba(249,115,22,.07)" : "rgba(30,53,96,.28)",
                          borderRadius:"14px", padding:"12px 14px",
                          border: estMonLycee ? "1.5px solid rgba(249,115,22,.4)" : "1px solid rgba(30,53,96,.55)",
                          display:"flex", alignItems:"center", gap:"10px",
                        }}>
                          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:rang<=3?"1.4rem":"0.9rem", width:"36px", textAlign:"center", color:"#64748B", flexShrink:0 }}>
                            {medaille(rang)}
                          </div>
                          <div style={{ flex:1, minWidth:0 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"6px", flexWrap:"wrap" }}>
                              <span style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:"#E2E8F0", fontSize:"0.92rem" }}>{lycee.nom}</span>
                              {estMonLycee && <span style={{ background:"rgba(249,115,22,.2)", color:"#F97316", fontFamily:"'Nunito',sans-serif", fontWeight:800, padding:"1px 8px", borderRadius:"100px", fontSize:"0.65rem" }}>Mon lycée</span>}
                            </div>
                            <p style={{ color:"#475569", fontSize:"0.72rem", margin:"2px 0 0", fontWeight:700 }}>{lycee.ville} · {lycee.eleves} élève{lycee.eleves>1?"s":""}</p>
                          </div>
                          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:"#F97316", fontSize:"0.9rem", flexShrink:0, textAlign:"right" }}>
                            {lycee.xp.toLocaleString()} j.
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ══ FAMILLES ══ */}
            {onglet === "familles" && (
              <div style={{ background:"rgba(13,27,53,.78)", border:"1px solid rgba(14,165,233,.2)", borderRadius:"24px", padding:"22px", backdropFilter:"blur(12px)" }}>
                <h2 style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:"1.3rem", margin:"0 0 18px", background:"linear-gradient(90deg,#0EA5E9,#38BDF8)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
                  🧬 Classement Familles
                </h2>
                <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
                  {classementFamilles.map((famille,i) => {
                    const rang = i+1;
                    const estMaFamille = famille.nom === profil?.famille;
                    const couleur = familleColors[famille.nom] || "#2563EB";
                    const maxPrestige = classementFamilles[0]?.prestige || 1;
                    const pourcentage = maxPrestige > 0 ? Math.round((famille.prestige/maxPrestige)*100) : 0;
                    const nomFamille = {
                      Architecte:"L'Architecte", Visionnaire:"Le Visionnaire",
                      Challenger:"Le Challenger", Explorateur:"L'Explorateur", Influenceur:"L'Influenceur"
                    }[famille.nom] ?? famille.nom;
                    return (
                      <div key={i} style={{
                        background: estMaFamille ? `${couleur}0C` : "rgba(30,53,96,.28)",
                        borderRadius:"18px", padding:"16px 18px",
                        border: estMaFamille ? `1.5px solid ${couleur}50` : "1px solid rgba(30,53,96,.55)",
                        boxShadow: estMaFamille ? `0 0 20px ${couleur}18` : "none",
                      }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
                          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, fontSize:rang<=3?"1.5rem":"1rem", width:"38px", textAlign:"center", color:"#64748B", flexShrink:0 }}>
                            {medaille(rang)}
                          </div>
                          <span style={{ fontSize:"1.7rem" }}>{familleEmojis[famille.nom]}</span>
                          <div style={{ flex:1 }}>
                            <div style={{ display:"flex", alignItems:"center", gap:"8px", flexWrap:"wrap" }}>
                              <span style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:couleur, fontSize:"1rem" }}>{nomFamille}</span>
                              {estMaFamille && <span style={{ background:`${couleur}25`, color:couleur, fontFamily:"'Nunito',sans-serif", fontWeight:800, padding:"1px 8px", borderRadius:"100px", fontSize:"0.65rem" }}>Ma famille</span>}
                            </div>
                            <p style={{ color:"#475569", fontSize:"0.72rem", margin:"2px 0 0", fontWeight:700 }}>{famille.eleves} membre{famille.eleves>1?"s":""} · {famille.prestige.toLocaleString("fr-FR")} prestige</p>
                          </div>
                          <div style={{ fontFamily:"'Nunito',sans-serif", fontWeight:900, color:couleur, fontSize:"1rem", flexShrink:0 }}>{pourcentage}%</div>
                        </div>
                        <div style={{ background:"rgba(30,53,96,.5)", borderRadius:"100px", height:"10px", overflow:"hidden", marginLeft:"48px" }}>
                          <div style={{ height:"100%", borderRadius:"100px", background:`linear-gradient(90deg, ${couleur}, ${couleur}BB)`, width:`${pourcentage}%`, transition:"width .7s ease", boxShadow:`0 0 10px ${couleur}55` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
