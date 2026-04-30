import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { COLLECTIONS } from "../data/collections";

const COLORS = {
  S: "#3B82F6", T: "#0284C7", M: "#F97316",
  G: "#10B981", H: "#EF4444", U: "#F59E0B", B: "#06B6D4",
};

const familleColors = {
  Architecte: "#3B82F6", Visionnaire: "#0EA5E9",
  Challenger: "#F97316", Explorateur: "#10B981", Influenceur: "#EF4444",
};

const familleEmojis = {
  Architecte: "🧠", Visionnaire: "🎨",
  Challenger: "⚡", Explorateur: "🔬", Influenceur: "🔥",
};

const niveauNom = (score) => {
  if (score < 100) return { nom: "Recrue", emoji: "🌱" };
  if (score < 300) return { nom: "Apprenti", emoji: "⚡" };
  if (score < 600) return { nom: "Guerrier", emoji: "⚔️" };
  if (score < 1000) return { nom: "Champion", emoji: "🏆" };
  if (score < 2000) return { nom: "Légende", emoji: "👑" };
  return { nom: "Dieu du STMG", emoji: "🌟" };
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
    ["rare", "epique", "legendaire", "ultra_rare"].includes(c.rarete)
  ).length;
};

const getPrestigeTotal = (user = {}) => (Number(user.prestigeBase) || 0) + (Number(user.prestige) || 0);

export default function Classement({ profil }) {
  const [onglet, setOnglet] = useState("xp");
  const [classementEleves, setClassementEleves] = useState([]);
  const [classementCollection, setClassementCollection] = useState([]);
  const [classementLycees, setClassementLycees] = useState([]);
  const [classementFamilles, setClassementFamilles] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreurClassement, setErreurClassement] = useState("");

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    chargerClassements();
  }, []);

  const chargerClassements = async () => {
    setChargement(true);
    setErreurClassement("");
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() })).filter(u => u.role !== "admin");

      // Prestige
      const elevesClasses = users
        .filter(u => u.prenom)
        .sort((a, b) => getPrestigeTotal(b) - getPrestigeTotal(a))
        .slice(0, 50);
      setClassementEleves(elevesClasses);

      // Collection
      const elevesCollection = users
        .filter(u => u.prenom)
        .map(u => ({ ...u, nbCartes: getNbCartesUniques(u.cartes), nbRares: getNbCartesRares(u.cartes) }))
        .sort((a, b) => b.nbCartes - a.nbCartes || b.nbRares - a.nbRares)
        .slice(0, 50);
      setClassementCollection(elevesCollection);

      // Lycées
      const lyceesMap = {};
      users.forEach(u => {
        if (!u.lycee) return;
        if (!lyceesMap[u.lycee]) lyceesMap[u.lycee] = { nom: u.lycee, ville: u.lyceeVille || "", xp: 0, eleves: 0 };
        lyceesMap[u.lycee].xp += (u.xp || 0);
        lyceesMap[u.lycee].eleves += 1;
      });
      setClassementLycees(Object.values(lyceesMap).sort((a, b) => b.xp - a.xp).slice(0, 20));

      // Familles
      const famillesMap = {
        Architecte: { nom: "Architecte", xp: 0, eleves: 0 },
        Visionnaire: { nom: "Visionnaire", xp: 0, eleves: 0 },
        Challenger: { nom: "Challenger", xp: 0, eleves: 0 },
        Explorateur: { nom: "Explorateur", xp: 0, eleves: 0 },
        Influenceur: { nom: "Influenceur", xp: 0, eleves: 0 },
      };
      users.forEach(u => {
        if (!u.famille || !famillesMap[u.famille]) return;
        famillesMap[u.famille].xp += (u.xp || 0);
        famillesMap[u.famille].eleves += 1;
      });
      setClassementFamilles(Object.values(famillesMap).sort((a, b) => b.xp - a.xp));
    } catch (err) {
      console.error(err);
      setErreurClassement("Classement indisponible : lecture Firestore refusée pour les élèves.");
    }
    setChargement(false);
  };

  const monRangEleve = classementEleves.findIndex(e => e.id === profil?.id) + 1;
  const monRangCollection = classementCollection.findIndex(e => e.id === profil?.id) + 1;
  const monRangLycee = classementLycees.findIndex(l => l.nom === profil?.lycee) + 1;
  const monRangFamille = classementFamilles.findIndex(f => f.nom === profil?.famille) + 1;

  const onglets = [
    { id: "xp", label: "👑 Prestige", couleur: "#A855F7" },
    { id: "collection", label: "🃏 Collection", couleur: "#DB2777" },
    { id: "lycees", label: "🏫 Lycées", couleur: COLORS.M },
    { id: "familles", label: "🧬 Familles", couleur: COLORS.T },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F1F5F9", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>

        {/* HEADER */}
        <div style={{ background: "linear-gradient(135deg, #0B2447, #0369A1)", borderRadius: "24px", padding: "28px 32px", marginBottom: "24px" }}>
          <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.2rem", color: "white", margin: "0 0 4px" }}>
            🏆 Classement National
          </h1>
          <p style={{ color: "#BAE6FD", margin: 0, fontSize: "0.9rem" }}>
            La compétition entre tous les élèves STMG de France !
          </p>

          {/* MES RANGS */}
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginTop: "16px" }}>
            {[
              { label: "Prestige", rang: monRangEleve, couleur: "#A855F7" },
              { label: "Collection", rang: monRangCollection, couleur: "#DB2777" },
              { label: "Lycée", rang: monRangLycee, couleur: COLORS.M },
              { label: "Famille", rang: monRangFamille, couleur: COLORS.T },
            ].map((r, i) => r.rang > 0 && (
              <div key={i} style={{ background: r.couleur + "25", border: `1px solid ${r.couleur}50`, borderRadius: "12px", padding: "6px 14px", fontFamily: "'Fredoka One', cursive", color: "white", fontSize: "0.85rem" }}>
                {r.label} : {r.rang <= 3 ? medaille(r.rang) : `#${r.rang}`}
              </div>
            ))}
          </div>
        </div>

        {/* ONGLETS */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
          {onglets.map(t => (
            <button key={t.id} onClick={() => setOnglet(t.id)} style={{
              background: onglet === t.id ? t.couleur : "white",
              color: onglet === t.id ? "white" : t.couleur,
              border: `2px solid ${t.couleur}`,
              fontFamily: "'Fredoka One', cursive", fontSize: "0.95rem",
              padding: "10px 20px", borderRadius: "14px", cursor: "pointer",
              transition: "all 0.2s",
            }}>{t.label}</button>
          ))}
        </div>

        {erreurClassement && (
          <div style={{ background: COLORS.H + "12", border: `1px solid ${COLORS.H}30`, borderRadius: "14px", padding: "12px 14px", marginBottom: "20px" }}>
            <p style={{ margin: 0, color: COLORS.H, fontFamily: "'Fredoka One', cursive", fontSize: "0.85rem" }}>
              ⚠️ {erreurClassement}
            </p>
          </div>
        )}

        {chargement ? (
          <div style={{ textAlign: "center", padding: "60px", background: "white", borderRadius: "24px" }}>
            <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: "#6B7280" }}>⏳ Chargement...</p>
          </div>
        ) : (
          <>
            {/* CLASSEMENT PRESTIGE */}
            {onglet === "xp" && (
              <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: "#A855F7", marginBottom: "8px" }}>👑 Top Élèves - Prestige</h2>
                <p style={{ color: "#9CA3AF", fontSize: "0.82rem", marginBottom: "20px" }}>
                  Le prestige augmente quand l'XP est depensee dans la boutique.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {classementEleves.map((eleve, i) => {
                    const rang = i + 1;
                    const estMoi = eleve.id === profil?.id;
                    const prestigeTotal = getPrestigeTotal(eleve);
                    const niveau = niveauNom(prestigeTotal);
                    const couleurFamille = familleColors[eleve.famille] || COLORS.S;
                    return (
                      <div key={i} style={{
                        background: estMoi ? "#A855F710" : "#F8FAFC",
                        borderRadius: "16px", padding: "14px 16px",
                        border: estMoi ? "2px solid #A855F7" : "2px solid transparent",
                        display: "flex", alignItems: "center", gap: "12px",
                      }}>
                        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: rang <= 3 ? "1.6rem" : "1rem", width: "40px", textAlign: "center", color: "#9CA3AF" }}>
                          {medaille(rang)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1rem", margin: 0 }}>{eleve.prenom}</p>
                            {estMoi && <span style={{ background: "#A855F7", color: "white", fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.7rem" }}>Moi</span>}
                            <span style={{ background: couleurFamille + "20", color: couleurFamille, fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.7rem" }}>
                              {familleEmojis[eleve.famille]} {eleve.famille}
                            </span>
                          </div>
                          <p style={{ color: "#9CA3AF", fontSize: "0.8rem", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {eleve.lycee} • {niveau.emoji} {niveau.nom}
                          </p>
                        </div>
                        <div style={{ fontFamily: "'Fredoka One', cursive", color: "#A855F7", fontSize: "1.1rem", flexShrink: 0 }}>
                          {prestigeTotal.toLocaleString()} prestige
                          <p style={{ margin: "2px 0 0", color: "#94A3B8", fontSize: "0.72rem", fontFamily: "'Nunito', sans-serif", textAlign: "right" }}>
                            {(eleve.xp || 0).toLocaleString()} XP
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CLASSEMENT COLLECTION */}
            {onglet === "collection" && (
              <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: "#EC4899", marginBottom: "8px" }}>🃏 Top Collectionneurs</h2>
                <p style={{ color: "#9CA3AF", fontSize: "0.82rem", marginBottom: "20px" }}>Classement par nombre de cartes uniques obtenues</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {classementCollection.map((eleve, i) => {
                    const rang = i + 1;
                    const estMoi = eleve.id === profil?.id;
                    const totalDispo = COLLECTIONS.flatMap(c => c.cartes).length;
                    const prog = Math.round((eleve.nbCartes / totalDispo) * 100);
                    return (
                      <div key={i} style={{
                        background: estMoi ? "#EC489910" : "#F8FAFC",
                        borderRadius: "16px", padding: "14px 16px",
                        border: estMoi ? "2px solid #EC4899" : "2px solid transparent",
                        display: "flex", alignItems: "center", gap: "12px",
                      }}>
                        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: rang <= 3 ? "1.6rem" : "1rem", width: "40px", textAlign: "center", color: "#9CA3AF" }}>
                          {medaille(rang)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1rem", margin: 0 }}>{eleve.prenom}</p>
                            {estMoi && <span style={{ background: "#EC4899", color: "white", fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.7rem" }}>Moi</span>}
                            <span style={{ background: "#EC489915", color: "#EC4899", fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.7rem" }}>
                              🔵 {eleve.nbRares} rares+
                            </span>
                          </div>
                          <div style={{ marginTop: "6px", background: "#E5E7EB", borderRadius: "100px", height: "5px" }}>
                            <div style={{ height: "100%", borderRadius: "100px", background: "linear-gradient(90deg, #EC4899, #9D174D)", width: `${prog}%`, transition: "width 0.5s" }} />
                          </div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0 }}>
                          <p style={{ fontFamily: "'Fredoka One', cursive", color: "#EC4899", fontSize: "1.1rem", margin: 0 }}>{eleve.nbCartes} 🃏</p>
                          <p style={{ color: "#9CA3AF", fontSize: "0.75rem", margin: 0 }}>{prog}%</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CLASSEMENT LYCÉES */}
            {onglet === "lycees" && (
              <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: COLORS.M, marginBottom: "20px" }}>🏫 Classement Lycées</h2>
                {classementLycees.length === 0 ? (
                  <p style={{ textAlign: "center", color: "#9CA3AF", padding: "20px" }}>Aucun lycée encore inscrit</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {classementLycees.map((lycee, i) => {
                      const rang = i + 1;
                      const estMonLycee = lycee.nom === profil?.lycee;
                      return (
                        <div key={i} style={{
                          background: estMonLycee ? COLORS.M + "10" : "#F8FAFC",
                          borderRadius: "16px", padding: "14px 16px",
                          border: estMonLycee ? `2px solid ${COLORS.M}` : "2px solid transparent",
                          display: "flex", alignItems: "center", gap: "12px",
                        }}>
                          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: rang <= 3 ? "1.6rem" : "1rem", width: "40px", textAlign: "center", color: "#9CA3AF" }}>
                            {medaille(rang)}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1rem", margin: 0 }}>{lycee.nom}</p>
                              {estMonLycee && <span style={{ background: COLORS.M, color: "white", fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.7rem" }}>Mon lycée</span>}
                            </div>
                            <p style={{ color: "#9CA3AF", fontSize: "0.8rem", margin: "2px 0 0" }}>{lycee.ville} • {lycee.eleves} élève{lycee.eleves > 1 ? "s" : ""}</p>
                          </div>
                          <div style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.M, fontSize: "1.1rem", flexShrink: 0 }}>
                            {lycee.xp.toLocaleString()} XP
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* CLASSEMENT FAMILLES */}
            {onglet === "familles" && (
              <div style={{ background: "white", borderRadius: "24px", padding: "24px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: COLORS.T, marginBottom: "20px" }}>🧬 Classement Familles</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {classementFamilles.map((famille, i) => {
                    const rang = i + 1;
                    const estMaFamille = famille.nom === profil?.famille;
                    const couleur = familleColors[famille.nom] || COLORS.S;
                    const maxXP = classementFamilles[0]?.xp || 1;
                    const pourcentage = maxXP > 0 ? Math.round((famille.xp / maxXP) * 100) : 0;
                    return (
                      <div key={i} style={{
                        background: estMaFamille ? couleur + "10" : "#F8FAFC",
                        borderRadius: "16px", padding: "16px",
                        border: estMaFamille ? `2px solid ${couleur}` : "2px solid transparent",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                          <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: rang <= 3 ? "1.6rem" : "1rem", width: "40px", textAlign: "center", color: "#9CA3AF" }}>{medaille(rang)}</div>
                          <span style={{ fontSize: "1.8rem" }}>{familleEmojis[famille.nom]}</span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                              <p style={{ fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "1.1rem", margin: 0 }}>
                                {famille.nom === "Architecte" ? "L'Architecte" : famille.nom === "Visionnaire" ? "Le Visionnaire" : famille.nom === "Challenger" ? "Le Challenger" : famille.nom === "Explorateur" ? "L'Explorateur" : "L'Influenceur"}
                              </p>
                              {estMaFamille && <span style={{ background: couleur, color: "white", fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.7rem" }}>Ma famille</span>}
                            </div>
                            <p style={{ color: "#9CA3AF", fontSize: "0.8rem", margin: "2px 0 0" }}>{famille.eleves} membre{famille.eleves > 1 ? "s" : ""} • {famille.xp.toLocaleString()} XP</p>
                          </div>
                          <div style={{ fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "1.1rem", flexShrink: 0 }}>{pourcentage}%</div>
                        </div>
                        <div style={{ background: "#E5E7EB", borderRadius: "100px", height: "10px", overflow: "hidden", marginLeft: "52px" }}>
                          <div style={{ height: "100%", borderRadius: "100px", background: couleur, width: `${pourcentage}%`, transition: "width 0.5s ease" }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}