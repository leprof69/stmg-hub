import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const COLORS = {
  S: "#3B82F6",
  T: "#7C3AED",
  M: "#F97316",
  G: "#10B981",
  H: "#EF4444",
  U: "#F59E0B",
  B: "#06B6D4",
};

const familleColors = {
  Architecte: COLORS.S,
  Visionnaire: COLORS.T,
  Challenger: COLORS.M,
  Explorateur: COLORS.G,
  Influenceur: COLORS.H,
};

const familleEmojis = {
  Architecte: "🧠",
  Visionnaire: "🎨",
  Challenger: "⚡",
  Explorateur: "🔬",
  Influenceur: "🔥",
};

const niveauNom = (xp) => {
  if (xp < 100) return { nom: "Recrue", emoji: "🌱" };
  if (xp < 300) return { nom: "Apprenti", emoji: "⚡" };
  if (xp < 600) return { nom: "Guerrier", emoji: "⚔️" };
  if (xp < 1000) return { nom: "Champion", emoji: "🏆" };
  if (xp < 2000) return { nom: "Légende", emoji: "👑" };
  return { nom: "Dieu du STMG", emoji: "🌟" };
};

const medaille = (rang) => {
  if (rang === 1) return "🥇";
  if (rang === 2) return "🥈";
  if (rang === 3) return "🥉";
  return `#${rang}`;
};

export default function Classement({ profil }) {
  const [classementEleves, setClassementEleves] = useState([]);
  const [classementLycees, setClassementLycees] = useState([]);
  const [classementFamilles, setClassementFamilles] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    chargerClassements();
  }, []);

  const chargerClassements = async () => {
    setChargement(true);
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

      // Élèves
      const elevesClasses = users
        .filter(u => u.prenom && u.xp !== undefined)
        .sort((a, b) => (b.xp || 0) - (a.xp || 0))
        .slice(0, 50);
      setClassementEleves(elevesClasses);

      // Lycées
      const lyceesMap = {};
      users.forEach(u => {
        if (!u.lycee) return;
        if (!lyceesMap[u.lycee]) {
          lyceesMap[u.lycee] = { nom: u.lycee, ville: u.lyceeVille || "", xp: 0, eleves: 0 };
        }
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
    }
    setChargement(false);
  };

  const monRangEleve = classementEleves.findIndex(e => e.id === profil?.id) + 1;
  const monRangLycee = classementLycees.findIndex(l => l.nom === profil?.lycee) + 1;

  return (
    <div style={{ minHeight: "100vh", background: "#F8F9FA", fontFamily: "'Nunito', sans-serif" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>

        {/* HEADER */}
        <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "2.5rem", color: "#1A1A2E", marginBottom: "4px" }}>
          🏆 Classement National
        </h1>
        <p style={{ color: "#6B7280", marginBottom: "32px" }}>
          La compétition entre tous les élèves STMG de France !
        </p>

        {chargement ? (
          <div style={{ textAlign: "center", padding: "60px" }}>
            <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.5rem", color: "#6B7280" }}>⏳ Chargement...</p>
          </div>
        ) : (
          <>
            {/* ===== CLASSEMENT ÉLÈVES ===== */}
            <div style={{ background: "white", borderRadius: "24px", padding: "24px", marginBottom: "24px", border: `2px solid ${COLORS.S}20` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
                <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.6rem", color: COLORS.S }}>
                  👤 Classement Élèves
                </h2>
                {monRangEleve > 0 && (
                  <span style={{ background: COLORS.S + "15", color: COLORS.S, fontFamily: "'Fredoka One', cursive", padding: "6px 16px", borderRadius: "100px", fontSize: "0.9rem", border: `1px solid ${COLORS.S}30` }}>
                    Ton rang : {medaille(monRangEleve)} {monRangEleve > 3 ? `#${monRangEleve}` : ""}
                  </span>
                )}
              </div>

              {classementEleves.length === 0 ? (
                <p style={{ textAlign: "center", color: "#9CA3AF", padding: "20px" }}>Aucun élève encore inscrit</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {classementEleves.map((eleve, i) => {
                    const rang = i + 1;
                    const estMoi = eleve.id === profil?.id;
                    const niveau = niveauNom(eleve.xp || 0);
                    const couleurFamille = familleColors[eleve.famille] || COLORS.S;
                    return (
                      <div key={i} style={{
                        background: estMoi ? COLORS.S + "10" : "#F8F9FA",
                        borderRadius: "16px", padding: "14px 16px",
                        border: estMoi ? `2px solid ${COLORS.S}` : "2px solid transparent",
                        display: "flex", alignItems: "center", gap: "12px",
                      }}>
                        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: rang <= 3 ? "1.6rem" : "1rem", width: "40px", textAlign: "center", color: rang <= 3 ? "" : "#9CA3AF" }}>
                          {medaille(rang)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1rem" }}>
                              {eleve.prenom}
                            </p>
                            {estMoi && (
                              <span style={{ background: COLORS.S, color: "white", fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.7rem" }}>Moi</span>
                            )}
                            <span style={{ background: couleurFamille + "20", color: couleurFamille, fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.7rem" }}>
                              {familleEmojis[eleve.famille]} {eleve.famille}
                            </span>
                          </div>
                          <p style={{ color: "#9CA3AF", fontSize: "0.8rem", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {eleve.lycee} • {niveau.emoji} {niveau.nom}
                          </p>
                        </div>
                        <div style={{ fontFamily: "'Fredoka One', cursive", color: COLORS.S, fontSize: "1.1rem", flexShrink: 0 }}>
                          {(eleve.xp || 0).toLocaleString()} XP
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ===== CLASSEMENT LYCÉES ===== */}
            <div style={{ background: "white", borderRadius: "24px", padding: "24px", marginBottom: "24px", border: `2px solid ${COLORS.M}20` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "8px" }}>
                <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.6rem", color: COLORS.M }}>
                  🏫 Classement Lycées
                </h2>
                {monRangLycee > 0 && (
                  <span style={{ background: COLORS.M + "15", color: COLORS.M, fontFamily: "'Fredoka One', cursive", padding: "6px 16px", borderRadius: "100px", fontSize: "0.9rem", border: `1px solid ${COLORS.M}30` }}>
                    Ton lycée : {medaille(monRangLycee)} {monRangLycee > 3 ? `#${monRangLycee}` : ""}
                  </span>
                )}
              </div>

              {classementLycees.length === 0 ? (
                <p style={{ textAlign: "center", color: "#9CA3AF", padding: "20px" }}>Aucun lycée encore inscrit</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {classementLycees.map((lycee, i) => {
                    const rang = i + 1;
                    const estMonLycee = lycee.nom === profil?.lycee;
                    return (
                      <div key={i} style={{
                        background: estMonLycee ? COLORS.M + "10" : "#F8F9FA",
                        borderRadius: "16px", padding: "14px 16px",
                        border: estMonLycee ? `2px solid ${COLORS.M}` : "2px solid transparent",
                        display: "flex", alignItems: "center", gap: "12px",
                      }}>
                        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: rang <= 3 ? "1.6rem" : "1rem", width: "40px", textAlign: "center", color: rang <= 3 ? "" : "#9CA3AF" }}>
                          {medaille(rang)}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                            <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1A1A2E", fontSize: "1rem" }}>
                              {lycee.nom}
                            </p>
                            {estMonLycee && (
                              <span style={{ background: COLORS.M, color: "white", fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.7rem" }}>Mon lycée</span>
                            )}
                          </div>
                          <p style={{ color: "#9CA3AF", fontSize: "0.8rem", marginTop: "2px" }}>
                            {lycee.ville} • {lycee.eleves} élève{lycee.eleves > 1 ? "s" : ""}
                          </p>
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

            {/* ===== CLASSEMENT FAMILLES ===== */}
            <div style={{ background: "white", borderRadius: "24px", padding: "24px", border: `2px solid ${COLORS.T}20` }}>
              <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "1.6rem", color: COLORS.T, marginBottom: "20px" }}>
                🧬 Classement Familles
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {classementFamilles.map((famille, i) => {
                  const rang = i + 1;
                  const estMaFamille = famille.nom === profil?.famille;
                  const couleur = familleColors[famille.nom] || COLORS.S;
                  const maxXP = classementFamilles[0]?.xp || 1;
                  const pourcentage = maxXP > 0 ? Math.round((famille.xp / maxXP) * 100) : 0;
                  return (
                    <div key={i} style={{
                      background: estMaFamille ? couleur + "10" : "#F8F9FA",
                      borderRadius: "16px", padding: "16px",
                      border: estMaFamille ? `2px solid ${couleur}` : "2px solid transparent",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                        <div style={{ fontFamily: "'Fredoka One', cursive", fontSize: rang <= 3 ? "1.6rem" : "1rem", width: "40px", textAlign: "center", color: rang <= 3 ? "" : "#9CA3AF" }}>
                          {medaille(rang)}
                        </div>
                        <span style={{ fontSize: "1.8rem" }}>{familleEmojis[famille.nom]}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <p style={{ fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "1.1rem" }}>
                              {famille.nom === "Architecte" ? "L'Architecte" :
                               famille.nom === "Visionnaire" ? "Le Visionnaire" :
                               famille.nom === "Challenger" ? "Le Challenger" :
                               famille.nom === "Explorateur" ? "L'Explorateur" : "L'Influenceur"}
                            </p>
                            {estMaFamille && (
                              <span style={{ background: couleur, color: "white", fontFamily: "'Fredoka One', cursive", padding: "1px 10px", borderRadius: "100px", fontSize: "0.7rem" }}>Ma famille</span>
                            )}
                          </div>
                          <p style={{ color: "#9CA3AF", fontSize: "0.8rem" }}>
                            {famille.eleves} membre{famille.eleves > 1 ? "s" : ""} • {famille.xp.toLocaleString()} XP
                          </p>
                        </div>
                        <div style={{ fontFamily: "'Fredoka One', cursive", color: couleur, fontSize: "1.1rem", flexShrink: 0 }}>
                          {pourcentage}%
                        </div>
                      </div>
                      <div style={{ background: "#E5E7EB", borderRadius: "100px", height: "10px", overflow: "hidden", marginLeft: "52px" }}>
                        <div style={{
                          height: "100%", borderRadius: "100px",
                          background: couleur,
                          width: `${pourcentage}%`,
                          transition: "width 0.5s ease",
                        }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}